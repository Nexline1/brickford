// GitHub sync, ported from runSync / syncSoon / armPush / syncOk / syncFailed
// and the boot, resume, hide and online hooks in platform/js/app.js
// (T-064 stage 3). The same file (progress/brickford-state.json), the same
// merge (engine/merge.dart), the same rules:
//
//   - a push MERGES before it writes, so it is safe from any device in any order;
//   - every save arms a push 4 s out, except a "quiet" one: a render is a read,
//     and so is anything the app writes about its own sync (syncOk, syncFailed)
//     and Monk Mode, which never syncs (MONK_SYNCS = false, S.monk is not in
//     the payload and a remote one is ignored);
//   - a rejected token is latched (no more automatic pushes), but a manual pull
//     or push always runs and a success lifts the latch;
//   - no answer at all is the network, not GitHub: no syncError, never the
//     latch; what is owed is kept in its own storage key, so it outlives the
//     app being closed offline, and goes out when the app is open and online;
//   - sync never repaints a page being read: its status lives on this
//     notifier, and the app's own listeners are told only when a merge
//     actually changed the record.
//
// THE TOKEN IS A SECRET. It is read in one place (the Authorization header),
// is never shown after it is saved, and appears in no message, log or error:
// an unexpected exception is reported as "Sync failed", never by its text.
import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../engine/engine.dart';
import '../engine/merge.dart';
import 'app_model.dart';
import 'net_status.dart';

enum SyncStatus { notConnected, synced, offline, attention }

class _SyncError implements Exception {
  const _SyncError(this.message);
  final String message;
}

class SyncService extends ChangeNotifier {
  SyncService(this.m, {http.Client? client, bool Function()? offline, this.debounce = const Duration(seconds: 4)})
    : _client = client ?? http.Client(),
      _offline = offline ?? navigatorOffline;

  final AppModel m;
  final http.Client _client;
  final bool Function() _offline;
  final Duration debounce;

  static const defaultRepo = 'Nexline1/brickford';
  static const syncPath = 'progress/brickford-state.json';
  static const tokenKey = 'brickford_gh_token';
  static const repoKey = 'brickford_gh_repo';
  static const owedKey = 'brickford_sync_pending';
  static final repoShape = RegExp(r'^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$');
  static final _fatal = RegExp(r'not accessible|token rejected|bad credentials|requires authentication|401|403', caseSensitive: false);
  static const offlineSay = 'Offline — this device will sync when the connection is back.';

  Engine get _e => m.engine;
  Map<String, dynamic> get _settings => _e.settings;

  bool _busy = false, _pushAgain = false, _netDown = false, _hidden = false;
  int _hides = 0;
  DateTime? _lastPull;
  Timer? _timer;

  /// What the Sync screen prints under the buttons: the last outcome.
  String message = '';

  // ---------- the connection (the only reader of the token) ----------
  String get _token => m.prefs.getString(tokenKey) ?? '';
  bool get hasToken => _token.isNotEmpty;
  String get repo => m.prefs.getString(repoKey) ?? defaultRepo;

  /// A new token deserves a fresh verdict: the old one's rejection must not keep this device latched off.
  /// Returns an error to show, or null when it was saved.
  String? connect(String token, String repoText) {
    final t = token.trim(), r = repoText.trim().isEmpty ? defaultRepo : repoText.trim();
    if (t.isEmpty) return 'Paste the token first.';
    if (!repoShape.hasMatch(r)) return 'The repo is owner/name.';
    m.prefs.setString(tokenKey, t);
    m.prefs.setString(repoKey, r);
    _clearError();
    message = '';
    notifyListeners();
    return null;
  }

  void forget() {
    m.prefs.remove(tokenKey);
    _timer?.cancel();
    _clearError();
    message = '';
    notifyListeners();
  }

  void _clearError() => m.quiet(() {
    _settings['syncError'] = null;
    m.persist();
  });

  // ---------- the state, in words ----------
  Map<String, dynamic>? get error => _settings['syncError'] is Map ? (_settings['syncError'] as Map).cast<String, dynamic>() : null;
  bool get latched => error != null && error!['fatal'] == true;
  bool get noNet => _offline() || _netDown;
  int get otherDevices => (_e.S['foreignLedgers'] as Map? ?? const {}).length;
  String? get lastSync => (truthy(_settings['lastSyncAt']) ? _settings['lastSyncAt'] : _settings['lastSync']) as String?;

  SyncStatus get status => !hasToken
      ? SyncStatus.notConnected
      : latched
      ? SyncStatus.attention
      : noNet
      ? SyncStatus.offline
      : error != null
      ? SyncStatus.attention
      : SyncStatus.synced;

  /// app.js agoLabel.
  String ago(String? iso) {
    if (iso == null || iso.isEmpty) return 'never';
    final t = DateTime.tryParse(iso.length == 10 ? '${iso}T12:00:00' : iso);
    if (t == null) return 'never';
    final min = m.now().difference(t).inMinutes;
    if (min < 2) return 'just now';
    if (min < 60) return '${min}m ago';
    final h = min ~/ 60;
    if (h < 24) return '${h}h ago';
    final d = h ~/ 24;
    return d == 1 ? '1d ago' : '${d}d ago';
  }

  // ---------- what this device owes (its own key, not the state) ----------
  String? get _owedMark => m.prefs.getString(owedKey);
  bool get owed => _owedMark != null;
  void _markOwed() => m.prefs.setString(owedKey, '${(int.tryParse(_owedMark ?? '') ?? 0) + 1}');
  void _clearOwed(String? mark) {
    if (_owedMark == mark) m.prefs.remove(owedKey);
  }

  // ---------- saves arm a push ----------
  /// A save that is not quiet (AppModel.persist).
  void soon() {
    if (!hasToken) return;
    _markOwed();
    armPush();
  }

  void armPush() {
    if (!hasToken) return;
    // Latched off after a rejection; syncOk, connecting and forgetting a token clear it.
    if (latched) return;
    _timer?.cancel();
    _timer = Timer(debounce, () => run('push'));
  }

  // ---------- the hooks ----------
  int get _hiddenMark => _hidden ? -1 : _hides;
  bool _hiddenSince(int mark) => mark == -1 || mark != _hides || _hidden;

  /// Pull once on open so a device that has been away is current before the first
  /// tap; a push instead while a sync is owed (it merges first).
  void boot() {
    listenOnline(onOnline, notifyListeners);
    _lastPull = m.now();
    if (hasToken) run(owed ? 'push' : 'pull');
  }

  /// The page came back. Pull again, but do not hammer the API.
  void onVisible() {
    _hidden = false;
    if (_netDown) probeNet();
    if (!hasToken) return;
    final now = m.now();
    if (_lastPull != null && now.difference(_lastPull!) < const Duration(seconds: 20)) return;
    _lastPull = now;
    run(owed ? 'push' : 'pull');
  }

  /// Hidden (backgrounded, or the page going away): push what is pending.
  void onHidden() {
    m.flush();
    if (_hidden) return;
    _hidden = true;
    _hides++;
    if (hasToken) run('push');
  }

  /// The connection is back: what is owed goes out once, through armPush (latch and all).
  void onOnline() {
    notifyListeners();
    if (_netDown) probeNet();
    if (owed) armPush();
  }

  void _netState(bool down, [bool sure = false]) {
    if (_netDown == down) return;
    _netDown = down;
    notifyListeners();
    if (down && !sure) probeNet();
  }

  /// The app asks the network itself before it believes a sync. Only the
  /// probe's own failure is sure.
  Future<void> probeNet() async {
    if (_offline()) return;
    final seen = _hiddenMark;
    try {
      await _client.get(Uri.https('api.github.com', '/zen'));
      _netState(false);
    } catch (_) {
      if (!_hiddenSince(seen)) _netState(true, true);
    }
  }

  // ---------- one code path for both directions ----------
  void _say(String t) {
    message = t;
    notifyListeners();
  }

  Future<http.Response> _gh(String method, [Map<String, dynamic>? body]) {
    final base = Uri.parse('https://api.github.com/repos/$repo/contents/$syncPath');
    final headers = {
      'Authorization': 'Bearer $_token',
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    return method == 'GET'
        ? _client.get(base.replace(queryParameters: {'ref': 'main'}), headers: headers)
        : _client.put(base, headers: {...headers, 'Content-Type': 'application/json'}, body: jsonEncode(body));
  }

  void _ok() {
    m.quiet(() {
      _settings['lastSync'] = m.today;
      _settings['lastSyncAt'] = m.now().toUtc().toIso8601String();
      _settings['syncError'] = null;
      m.persist();
    });
    notifyListeners();
  }

  void _failed(String msg) {
    m.quiet(() {
      _settings['syncError'] = {'msg': msg, 'at': m.now().toUtc().toIso8601String(), 'fatal': _fatal.hasMatch(msg)};
      m.persist();
    });
  }

  /// [dir] is "pull" or "push". Resolves true when it did what was asked.
  Future<bool> run(String dir) async {
    if (!hasToken) return false;
    m.flush(); // what a push sends, and what a pull merges into, is on disk first
    if (_busy) {
      if (dir == 'push') _pushAgain = true;
      return false;
    }
    if (_offline()) {
      _markOwed();
      _say(offlineSay);
      return false;
    }
    _busy = true;
    final seen = _hiddenMark; // a request cut while hidden is not the network
    _say('Contacting GitHub…');
    var done = false;
    try {
      final res = await _gh('GET');
      _netState(false); // an answer, whatever it says: the network is there
      var missing = false;
      Map<String, dynamic> file = {};
      if (res.statusCode == 404) {
        missing = true;
      } else if (res.statusCode == 401 || res.statusCode == 403) {
        throw _SyncError('Token rejected — it needs Contents: Read and write on $repo.');
      } else if (res.statusCode < 200 || res.statusCode >= 300) {
        throw _SyncError('GitHub returned ${res.statusCode}.');
      } else {
        file = (jsonDecode(res.body) as Map).cast<String, dynamic>();
      }
      final remote = missing ? null : jsonDecode(utf8.decode(base64.decode(((file['content'] ?? '') as String).replaceAll('\n', ''))));
      if (dir == 'pull') {
        if (remote == null) {
          _say('Nothing stored yet — push from the device that has your progress.');
        } else {
          final n = m.quiet(() => mergeState(_e, remote));
          _ok();
          _say(n > 0 ? 'Pulled — $n change${n == 1 ? '' : 's'} merged.' : 'Up to date.');
          if (n > 0) m.refresh();
          done = true;
        }
      } else {
        // A push MUST merge before it writes.
        var mergedIn = 0;
        if (remote != null) mergedIn = m.quiet(() => mergeState(_e, remote));
        final mark = _owedMark; // what this push carries; a later save keeps the debt
        final body = <String, dynamic>{
          'message': 'progress: ${m.today} from ${_settings['deviceId']}${mergedIn > 0 ? ' (merged $mergedIn)' : ''}',
          'content': base64.encode(utf8.encode(encodePayload(syncPayload(_e, now: m.now())))),
          if (!missing && file['sha'] != null) 'sha': file['sha'],
        };
        final res2 = await _gh('PUT', body);
        if (res2.statusCode == 409) throw const _SyncError('The remote moved while pushing. Pull, then push again.');
        if (res2.statusCode < 200 || res2.statusCode >= 300) {
          String? why;
          try {
            why = (jsonDecode(res2.body) as Map)['message'] as String?;
          } catch (_) {}
          throw _SyncError(truthy(why) ? why! : 'GitHub returned ${res2.statusCode}');
        }
        _clearOwed(mark);
        _ok();
        _say(mergedIn > 0 ? 'Pushed — $mergedIn change${mergedIn == 1 ? '' : 's'} merged in.' : 'Pushed.');
        // If the push pulled work in on its way past, the screen is out of date.
        if (mergedIn > 0) m.refresh();
        done = true;
      }
    } catch (err) {
      final network = err is http.ClientException || err is TimeoutException;
      if (_offline() || network) {
        _markOwed();
        if (!_hiddenSince(seen)) _netState(true);
        _say(offlineSay);
      } else {
        // The text of an unexpected exception is never shown: it is not GitHub's word.
        final text = err is _SyncError ? err.message : 'Sync failed.';
        _failed(text);
        _say(text);
      }
    } finally {
      _busy = false;
    }
    if (_pushAgain) {
      _pushAgain = false;
      unawaited(run('push'));
    }
    return done;
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
