// GitHub sync (T-064 stage 3), against an in-memory fake of the contents API.
// Nothing here calls the real GitHub, and the token is a made-up string that
// the tests also hunt for in every place it must not appear.
import 'dart:convert';

import 'package:app/engine/engine.dart';
import 'package:app/engine/merge.dart';
import 'package:app/main.dart';
import 'package:app/screens/profile/sync_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:app/state/sync.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

const fakeToken = 'github_pat_FAKE0123456789abcdef';

/// T-053: the private repo, and the one file in it. Nothing else is ever asked.
const repoPath = '/repos/Nexline1/brickford-private';
const filePath = '$repoPath/contents/progress/brickford-state.json';

/// The contents API for one file, in memory.
class FakeGitHub {
  Map<String, dynamic>? file; // null: 404
  int sha = 1;
  bool down = false; // no answer at all
  int? getStatus; // forces the GET's status (401, 500 ...)
  bool loseAccessOnPut = false; // the token loses the repo between the GET and the PUT: the PUT is a 404 and so is the repo from then on
  int repoStatus = 200; // GET /repos/<repo>; 404 is a token with no access to a private repo, and then the file answers 404 too
  final calls = <String>[];
  final stray = <String>[]; // a request without the token, or to another host
  final puts = <Map<String, dynamic>>[];

  http.Client get client => MockClient((req) async {
    if (down) throw http.ClientException('no route to host');
    calls.add('${req.method} ${req.url.path}');
    if (req.url.path.endsWith('/zen')) return http.Response('Keep it logically awesome.', 200);
    if (req.headers['Authorization'] != 'Bearer $fakeToken' || req.url.host != 'api.github.com') stray.add('${req.method} ${req.url.host}');
    if (req.url.path != filePath && req.url.path != repoPath) {
      stray.add('${req.method} ${req.url.host}${req.url.path}'); // any other path, the public repo included
      return http.Response('{}', 404);
    }
    if (req.url.path == repoPath) return repoStatus == 200 ? http.Response(jsonEncode({'full_name': 'Nexline1/brickford-private'}), 200) : http.Response(jsonEncode({'message': 'Not Found'}), 404);
    if (repoStatus != 200) return http.Response(jsonEncode({'message': 'Not Found'}), 404);
    if (req.method == 'GET') {
      if (getStatus != null) return http.Response(jsonEncode({'message': 'Bad credentials'}), getStatus!);
      if (file == null) return http.Response('{}', 404);
      final b64 = base64.encode(utf8.encode(jsonEncode(file)));
      final wrapped = [for (var i = 0; i < b64.length; i += 60) b64.substring(i, i + 60 > b64.length ? b64.length : i + 60)].join('\n');
      return http.Response(jsonEncode({'sha': 's$sha', 'content': wrapped}), 200);
    }
    if (loseAccessOnPut) {
      repoStatus = 404;
      return http.Response(jsonEncode({'message': 'Not Found'}), 404);
    }
    final body = jsonDecode(req.body) as Map<String, dynamic>;
    if (file != null && body['sha'] != 's$sha') return http.Response('{}', 409);
    puts.add(body);
    file = jsonDecode(utf8.decode(base64.decode(body['content'] as String))) as Map<String, dynamic>;
    sha++;
    return http.Response('{}', 200);
  });
}

final noon = DateTime.utc(2026, 11, 5, 12);

/// "No monkStart key at all" (as opposed to null).
const _absent = Object();

Future<AppModel> model(
  FakeGitHub gh, {
  bool token = true,
  bool Function()? offline,
  Map<String, dynamic>? state,
  Map<String, Object>? prefs,
  SharedPreferences? reuse,
}) async {
  SharedPreferences.setMockInitialValues({
    if (state != null) AppModel.storageKey: jsonEncode(state),
    if (token) SyncService.tokenKey: fakeToken,
    ...?prefs,
  });
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, reuse ?? await SharedPreferences.getInstance(), today: () => '2026-11-05', now: () => noon, client: gh.client, offline: offline);
}

Map<String, dynamic> watched(String on) => {'done': true, 'doneAt': on, 'notes': '', 'checks': <dynamic>[]};

Map<String, dynamic> remoteWith(Map<String, dynamic> state, {Map<String, dynamic>? ledgers}) => {
  'v': 1,
  'updatedAt': '2026-11-05T10:00:00.000Z',
  'device': 'laptop',
  'state': state,
  'ledgers': ledgers ?? <String, dynamic>{},
};

String firstLessonKey(AppModel m) => m.engine.realSched(m.today).first.key;

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  testWidgets('a pull merges the remote in, sends the token only to api.github.com, and ignores a remote monk', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh, state: {
      'monk': {'days': {'2026-11-05': {'nosin': true}}},
    });
    final k = firstLessonKey(m);
    gh.file = remoteWith({
      'lessons': {k: watched('2026-11-05')},
      'studyDays': ['2026-11-04'],
      'monk': {'days': {'2026-11-05': {'work': 10, 'at': '2030-01-01T00:00:00.000Z'}, '2026-11-04': {'nosin': true}}},
    });
    final done = m.sync.run('pull');
    await tester.pump();
    expect(await done, isTrue);
    expect(m.markOf(k), isNot(LessonMark.none));
    expect(m.engine.studyDays, contains('2026-11-04'));
    expect(m.sync.message, 'Pulled — 2 changes merged.');
    // MONK_SYNCS = false: nothing of the remote's monk was read.
    expect(m.monkRec('2026-11-05'), {'nosin': true});
    expect(m.monkDays.containsKey('2026-11-04'), isFalse);
    expect(gh.calls, ['GET /repos/Nexline1/brickford-private/contents/progress/brickford-state.json']);
    expect(gh.stray, isEmpty);
    expect(m.sync.status, SyncStatus.synced);
  });

  testWidgets('a push merges first, then writes the payload with the sha, and never carries monk', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh, state: {
      'monk': {'days': {'2026-11-05': {'nosin': true}}},
    });
    final k = firstLessonKey(m);
    m.engine.lessons[k] = watched('2026-11-05');
    gh.file = remoteWith({
      'lessons': {'math110.0.5': watched('2026-11-03')},
      'studyDays': ['2026-11-03'],
    }, ledgers: {'laptop': [{'type': 'x'}]});
    final done = m.sync.run('push');
    await tester.pump();
    await tester.pump();
    expect(await done, isTrue);
    expect(gh.puts, hasLength(1));
    final put = gh.puts.single;
    expect(put['sha'], 's1');
    expect(put['message'], startsWith('progress: 2026-11-05 from ${m.engine.settings['deviceId']} (merged 3)'));
    final sent = gh.file!;
    final state = sent['state'] as Map<String, dynamic>;
    expect((state['lessons'] as Map).keys, containsAll([k, 'math110.0.5']));
    expect(state['studyDays'], ['2026-11-03']);
    expect(state.containsKey('monk'), isFalse);
    expect(jsonEncode(sent), isNot(contains('nosin')));
    expect((sent['ledgers'] as Map).keys, containsAll(['laptop', m.engine.settings['deviceId']]));
    expect(sent['device'], m.engine.settings['deviceId']);
    expect(m.sync.message, 'Pushed — 3 changes merged in.');
  });

  testWidgets('a push to an empty repo creates the file, with no sha', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh);
    final done = m.sync.run('push');
    await tester.pump();
    await tester.pump();
    expect(await done, isTrue);
    expect(gh.puts.single.containsKey('sha'), isFalse);
    expect(gh.file!['v'], 1);
  });

  testWidgets('a save arms a push 4 s out; a render, a lesson open, a monk write and a sync outcome arm none', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh);
    final k = firstLessonKey(m);
    // Reads: opening a lesson (settings.lastLesson), Monk Mode's writes.
    m.openedLesson('math110', 0, 0, 'MATH 110 · x');
    m.monkPatch((d) => d['nosin'] = true);
    m.monkToggleLoop('s1');
    m.monkAddLoop('close the loop');
    m.monkSavePlan({'business': 'a'});
    await tester.pump(const Duration(seconds: 10));
    expect(gh.calls, isEmpty);
    expect(m.sync.owed, isFalse);
    // A real save.
    m.toggleDone(k);
    expect(m.sync.owed, isTrue);
    await tester.pump(const Duration(milliseconds: 3900));
    expect(gh.calls, isEmpty);
    await tester.pump(const Duration(milliseconds: 200));
    await tester.pump();
    await tester.pump();
    expect(gh.puts, hasLength(1));
    // The outcome (lastSyncAt) was written quietly: no push after the push.
    final n = gh.calls.length;
    await tester.pump(const Duration(seconds: 30));
    expect(gh.calls.length, n);
    expect(m.sync.owed, isFalse);
  });

  testWidgets('a rejected token is latched: automatic pushes stop, a manual pull runs, a success lifts it', (tester) async {
    final gh = FakeGitHub()..getStatus = 401;
    final m = await model(gh);
    final k = firstLessonKey(m);
    expect(await Future.wait([m.sync.run('push'), tester.pump().then((_) => true)]).then((r) => r[0]), isFalse);
    expect(m.sync.latched, isTrue);
    expect(m.sync.status, SyncStatus.attention);
    expect(m.sync.error!['msg'], startsWith('Token rejected'));
    final before = gh.calls.length;
    m.toggleDone(k); // arms nothing while latched
    await tester.pump(const Duration(seconds: 20));
    expect(gh.calls.length, before);
    // The token is fixed (or the repo grants it): a manual pull always runs.
    gh.getStatus = null;
    gh.file = remoteWith({'studyDays': ['2026-11-01']});
    final ok = m.sync.run('pull');
    await tester.pump();
    expect(await ok, isTrue);
    expect(m.sync.latched, isFalse);
    expect(m.sync.error, isNull);
    expect(m.sync.status, SyncStatus.synced);
    m.toggleDone(k);
    await tester.pump(const Duration(seconds: 5));
    await tester.pump();
    await tester.pump();
    expect(gh.puts, isNotEmpty);
  });

  testWidgets('no answer is the network, not a rejection: offline, owed in its own key, pushed on the next start', (tester) async {
    final gh = FakeGitHub()..down = true;
    final m = await model(gh);
    final k = firstLessonKey(m);
    m.toggleDone(k);
    await tester.pump(const Duration(seconds: 5));
    await tester.pump();
    expect(m.sync.status, SyncStatus.offline);
    expect(m.sync.error, isNull); // no syncError, so never the latch
    expect(m.sync.latched, isFalse);
    expect(m.prefs.getString(SyncService.owedKey), isNotNull);
    expect(m.prefs.getString(AppModel.storageKey)!, isNot(contains(SyncService.owedKey))); // not in the state's shape

    // The app is closed and opened again, online: what was owed goes out.
    gh.down = false;
    final m2 = await model(gh, token: false, reuse: m.prefs, prefs: const {});
    m2.sync.boot();
    await tester.pump();
    await tester.pump();
    await tester.pump();
    expect(gh.puts, hasLength(1)); // a push, not a pull
    expect(m2.sync.owed, isFalse);
    expect(m2.sync.status, SyncStatus.synced);
    expect(m2.markOf(k), isNot(LessonMark.none));
  });

  testWidgets('offline() says so without asking; coming back online arms what is owed through the debounce', (tester) async {
    final gh = FakeGitHub();
    var off = true;
    final m = await model(gh, offline: () => off);
    m.toggleDone(firstLessonKey(m));
    await tester.pump(const Duration(seconds: 5));
    expect(gh.calls, isEmpty);
    expect(m.sync.status, SyncStatus.offline);
    expect(m.sync.message, SyncService.offlineSay);
    off = false;
    m.sync.onOnline();
    await tester.pump(const Duration(seconds: 5));
    await tester.pump();
    await tester.pump();
    expect(gh.puts, hasLength(1));
    expect(m.sync.status, SyncStatus.synced);
  });

  testWidgets('hiding the app pushes; coming back pulls, but not twice inside 20 s', (tester) async {
    final gh = FakeGitHub();
    var t = noon;
    SharedPreferences.setMockInitialValues({SyncService.tokenKey: fakeToken});
    final data = await AppModel.loadData(rootBundle);
    final m = AppModel(data, await SharedPreferences.getInstance(), today: () => '2026-11-05', now: () => t, client: gh.client);
    m.sync.onHidden();
    await tester.pump();
    await tester.pump();
    expect(gh.calls.first, startsWith('GET'));
    expect(gh.puts, hasLength(1));
    t = noon.add(const Duration(minutes: 5));
    final c = gh.calls.length;
    m.sync.onVisible();
    await tester.pump();
    await tester.pump();
    expect(gh.calls.length, greaterThan(c)); // a pull (the first visible: no lastPull yet)
    final c2 = gh.calls.length;
    m.sync.onVisible();
    await tester.pump();
    expect(gh.calls.length, c2); // inside 20 s: not again
  });

  testWidgets('the token is never shown, printed or stored in the state: the screen says Saved', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh, token: false);
    final logs = <String>[];
    final old = debugPrint;
    debugPrint = (msg, {wrapWidth}) => logs.add(msg ?? '');
    tester.view.physicalSize = const Size(375 * 3, 812 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(BrickfordApp(model: m));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('tab-Profile')));
    await tester.pumpAndSettle();
    expect(find.text('Not connected'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('profile-sync')));
    await tester.pumpAndSettle();
    expect(find.byType(SyncScreen), findsOneWidget);
    expect(find.byKey(const ValueKey('sync-status')), findsOneWidget);
    // A bad repo is refused and nothing is stored.
    await tester.enterText(find.byKey(const ValueKey('sync-token')), fakeToken);
    await tester.enterText(find.byKey(const ValueKey('sync-repo')), '../../etc');
    await tester.tap(find.byKey(const ValueKey('sync-connect')));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('sync-problem')), findsOneWidget);
    expect(m.sync.hasToken, isFalse);
    await tester.enterText(find.byKey(const ValueKey('sync-repo')), 'Nexline1/brickford-private');
    await tester.tap(find.byKey(const ValueKey('sync-connect')));
    await tester.pumpAndSettle();
    expect(m.sync.hasToken, isTrue);
    expect(find.text('Saved'), findsOneWidget);
    expect(find.textContaining(fakeToken), findsNothing);
    expect(find.byKey(const ValueKey('sync-token')), findsNothing); // the field is gone, with its text
    expect(find.byKey(const ValueKey('sync-pull')), findsOneWidget);
    // Not in the state that syncs, not in the persisted state, not in any message or log.
    expect(jsonEncode(m.engine.S), isNot(contains(fakeToken)));
    expect(m.prefs.getString(AppModel.storageKey) ?? '', isNot(contains(fakeToken)));
    expect(m.sync.message, isNot(contains(fakeToken)));
    expect(logs.join(), isNot(contains(fakeToken)));
    debugPrint = old;
    // Pull from the screen, against a rejecting server: the error is GitHub's word and not the token.
    gh.getStatus = 401;
    await tester.tap(find.byKey(const ValueKey('sync-pull')));
    await tester.pumpAndSettle();
    expect(find.text('Needs attention'), findsWidgets);
    expect(find.byKey(const ValueKey('sync-error')), findsOneWidget);
    expect(find.textContaining(fakeToken), findsNothing);
    // Forget: gone from the store.
    await tester.tap(find.byKey(const ValueKey('sync-forget')));
    await tester.pumpAndSettle();
    expect(m.prefs.getString(SyncService.tokenKey), isNull);
    expect(find.text('Not connected'), findsWidgets);
  });

  testWidgets('the status in words: Not connected, Synced, Offline, Needs attention (and a latched one beats offline)', (tester) async {
    final gh = FakeGitHub();
    Future<AppModel> m0({bool token = true, bool off = false, Object? err, bool synced = true}) => model(
      gh,
      token: token,
      offline: () => off,
      state: {
        'settings': {if (synced) 'lastSyncAt': '2026-11-05T11:59:00.000Z', 'syncError': ?err},
      },
    );
    Future<void> show(AppModel m) async {
      await tester.pumpWidget(const SizedBox());
      tester.view.physicalSize = const Size(375 * 3, 812 * 3);
      tester.view.devicePixelRatio = 3;
      await tester.pumpWidget(BrickfordApp(model: m));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('tab-Profile')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('profile-sync')));
      await tester.pumpAndSettle();
    }

    addTearDown(tester.view.reset);
    String word() => tester.widget<Text>(find.byKey(const ValueKey('sync-status'))).data!;
    String sub() => tester.widget<Text>(find.byKey(const ValueKey('sync-sub'))).data!;

    await show(await m0(token: false));
    expect(word(), 'Not connected');
    await show(await m0());
    expect(word(), 'Synced');
    expect(sub(), 'just now');
    await show(await m0(off: true));
    expect(word(), 'Offline');
    await show(await m0(err: {'msg': 'GitHub returned 500.', 'at': '2026-11-05T11:00:00.000Z', 'fatal': false}));
    expect(word(), 'Needs attention');
    await show(await m0(off: true, err: {'msg': 'Token rejected', 'at': '2026-11-05T11:00:00.000Z', 'fatal': true}));
    expect(word(), 'Needs attention'); // latched: it will not sync when the connection is back either
    expect(find.byKey(const ValueKey('sync-error')), findsOneWidget);
    await show(await m0(synced: false));
    expect(sub(), 'Never synced');
    expect(syncLook(SyncStatus.synced).word, 'Synced');
  });

  // ---------- T-053: sync lives in the private repo ----------
  const noFix = "Sync can't reach brickford-private: give your token access to it.";

  testWidgets('(a) pulls and pushes go only to the private repo\'s file, and a device that stored the old public repo is not sent there', (tester) async {
    for (final stored in <Map<String, Object>>[const {}, {SyncService.repoKey: 'Nexline1/brickford'}]) {
      final gh = FakeGitHub();
      final m = await model(gh, prefs: stored);
      expect(m.sync.repo, 'Nexline1/brickford-private', reason: 'stored: $stored');
      gh.file = remoteWith({'studyDays': ['2026-11-01']});
      var done = m.sync.run('pull');
      await tester.pump();
      expect(await done, isTrue);
      done = m.sync.run('push');
      await tester.pump();
      expect(await done, isTrue);
      expect(gh.calls, ['GET $filePath', 'GET $filePath', 'PUT $filePath'], reason: 'stored: $stored');
      expect(gh.stray, isEmpty, reason: 'any other path, the public repo included, lands here');
    }
  });

  testWidgets('(b) a 404 on the file and on the repo: the new error, latched for automatic pushes only; manual Pull and Push run; a success clears it', (tester) async {
    final gh = FakeGitHub()..repoStatus = 404;
    final m = await model(gh);
    final k = firstLessonKey(m);
    expect(await Future.wait([m.sync.run('pull'), tester.pump().then((_) => true)]).then((r) => r[0]), isFalse);
    expect(gh.calls, ['GET $filePath', 'GET $repoPath'], reason: 'the repo is asked after the file\'s 404');
    expect(m.sync.error!['msg'], noFix);
    expect(m.sync.message, noFix);
    expect(m.sync.latched, isTrue);
    expect(m.sync.status, SyncStatus.attention);
    final before = gh.calls.length;
    m.toggleDone(k); // arms nothing while latched
    await tester.pump(const Duration(seconds: 20));
    expect(gh.calls.length, before);
    // A manual Push and a manual Pull still run (and say the same thing); neither wrote anything.
    expect(await Future.wait([m.sync.run('push'), tester.pump().then((_) => true)]).then((r) => r[0]), isFalse);
    expect(await Future.wait([m.sync.run('pull'), tester.pump().then((_) => true)]).then((r) => r[0]), isFalse);
    expect(gh.calls.length, before + 4);
    expect(m.sync.message, noFix);
    expect(gh.puts, isEmpty);
    // The owner gives the token access: the repo answers, the file is not there yet, a manual push creates it.
    gh.repoStatus = 200;
    final ok = m.sync.run('push');
    await tester.pump();
    expect(await ok, isTrue);
    expect(gh.puts, hasLength(1));
    expect(m.sync.error, isNull);
    expect(m.sync.latched, isFalse);
    m.toggleDone(k);
    await tester.pump(const Duration(seconds: 5));
    await tester.pump();
    await tester.pump();
    expect(gh.puts, hasLength(2), reason: 'the latch is lifted: a save arms a push again');
  });

  testWidgets('(b) the same 404 split on the PUT: a push told 404 asks the repo and says the same line', (tester) async {
    final gh = FakeGitHub()
      ..file = remoteWith({'studyDays': ['2026-11-01']})
      ..loseAccessOnPut = true;
    final m = await model(gh);
    final done = m.sync.run('push');
    await tester.pump();
    expect(await done, isFalse);
    expect(gh.calls, ['GET $filePath', 'PUT $filePath', 'GET $repoPath']);
    expect(m.sync.error!['msg'], noFix);
    expect(m.sync.latched, isTrue);
    expect(gh.puts, isEmpty);
  });

  testWidgets('(c) a 404 on the file with the repo answering is not an error: Pull says Nothing stored yet, Push creates the file with no sha', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh);
    var done = m.sync.run('pull');
    await tester.pump();
    expect(await done, isFalse);
    expect(m.sync.message, 'Nothing stored yet — push from the device that has your progress.');
    expect(m.sync.error, isNull);
    expect(gh.calls, ['GET $filePath', 'GET $repoPath']);
    done = m.sync.run('push');
    await tester.pump();
    expect(await done, isTrue);
    expect(gh.puts, hasLength(1));
    expect(gh.puts.first.containsKey('sha'), isFalse);
    expect(m.sync.error, isNull);
    expect(m.sync.status, SyncStatus.synced);
  });

  Map<String, dynamic> workedRemote() => remoteWith(
    {
      'lessons': {'math110.0.0': {'done': true, 'doneAt': '2026-11-02', 'firstDoneAt': '2026-11-02', 'verified': true, 'notes': 'from the laptop', 'checks': <dynamic>[]}},
      'studyDays': ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05'],
      'settings': {'streakFrom': '2026-11-04'},
      'monkStart': '2026-11-02',
    },
    ledgers: {'laptop': [{'date': '2026-11-02', 'kind': 'lesson', 'ref': 'math110.0.0', 'hash': 'h1'}]},
  );

  testWidgets('(d) a new empty device with a token pulls a remote that holds lessons, studyDays, streakFrom and monkStart, and shows them', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh);
    expect(m.engine.studyDays, isEmpty);
    expect(m.engine.S['monkStart'], isNull);
    gh.file = workedRemote();
    final done = m.sync.run('pull');
    await tester.pump();
    expect(await done, isTrue);
    await tester.pumpAndSettle();
    expect((m.engine.S['lessons'] as Map)['math110.0.0']['verified'], isTrue);
    expect(m.engine.studyDays, ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05']);
    expect(m.engine.settings['streakFrom'], '2026-11-04');
    expect(m.monkFrom, '2026-11-02');
    expect(m.engine.S['foreignLedgers'], contains('laptop'));
    // Shown: the streak counts from the reset (2), the longest ignores it (4), and Monk Mode is on its day.
    expect(m.engine.streak(), 2);
    expect(m.engine.bestStreak(), 4);
    tester.view.physicalSize = const Size(375 * 3, 812 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(BrickfordApp(model: m));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('chip-monk')));
    await tester.pumpAndSettle();
    expect(find.text('Day 4 of 21'), findsOneWidget);
    await tester.pumpWidget(const SizedBox());
    expect(gh.stray, isEmpty);
  });

  testWidgets('(e) a push from a new empty device removes nothing the remote holds: it merges before it writes', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh);
    gh.file = workedRemote(); // the device has pulled nothing; the first thing it does is push
    final done = m.sync.run('push');
    await tester.pump();
    expect(await done, isTrue);
    expect(gh.puts, hasLength(1));
    expect(gh.puts.first['sha'], 's1', reason: 'over the remote\'s own sha, not blind');
    final state = (gh.file!['state'] as Map).cast<String, dynamic>();
    expect((state['lessons'] as Map)['math110.0.0']['verified'], isTrue);
    expect(state['studyDays'], containsAll(['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05']));
    expect((state['settings'] as Map)['streakFrom'], '2026-11-04');
    expect(state['monkStart'], '2026-11-02');
    expect((gh.file!['ledgers'] as Map), contains('laptop'));
  });

  // ---------- T-065: the Monk start date, the one piece of Monk that syncs ----------

  Future<({int changed, String? start})> mergedStart(WidgetTester tester, {Object? local, Object? remote = _absent}) async {
    final m = await model(FakeGitHub(), token: false, state: {'monkStart': ?local});
    final r = remote == _absent ? <String, dynamic>{} : {'monkStart': remote};
    final changed = mergeState(m.engine, remoteWith(r));
    return (changed: changed, start: m.engine.S['monkStart'] as String?);
  }

  testWidgets('the Monk start merges by "first write wins": none takes the other\'s, two keep the EARLIER, and nothing that is not a date ever clears or replaces it', (tester) async {
    Future<void> expectMerge(String name, {Object? local, Object? remote = _absent, String? start, required int changed}) async {
      final r = await mergedStart(tester, local: local, remote: remote);
      expect((r.start, r.changed), (start, changed), reason: name);
    }

    await expectMerge('remote only', remote: '2026-11-06', start: '2026-11-06', changed: 1);
    await expectMerge('remote earlier than local', local: '2026-11-06', remote: '2026-11-02', start: '2026-11-02', changed: 1);
    await expectMerge('remote later than local', local: '2026-11-02', remote: '2026-11-06', start: '2026-11-02', changed: 0);
    await expectMerge('the same date', local: '2026-11-06', remote: '2026-11-06', start: '2026-11-06', changed: 0);
    await expectMerge('local only (the remote has none)', local: '2026-11-06', start: '2026-11-06', changed: 0);
    await expectMerge('neither', changed: 0);
    for (final bad in <Object?>['', null, 'tomorrow', '2026-11-6', '2026-11-06T00:00:00Z', ' 2026-11-06', '2026-11-06\n', 20261106, true, <String>['2026-11-06'], <String, dynamic>{}]) {
      await expectMerge('a remote start of ${jsonEncode(bad)} never clears one', local: '2026-11-06', remote: bad, start: '2026-11-06', changed: 0);
      await expectMerge('a remote start of ${jsonEncode(bad)} is never taken', remote: bad, start: null, changed: 0);
    }
  });

  testWidgets('the payload carries monkStart when it is set and nothing else of Monk; not started, it carries no Monk key at all', (tester) async {
    final monk = {'days': {'2026-11-05': {'nosin': true, 'work': 10}}, 'plans': {'2026-11-06': {'business': 'secretplan'}}, 'loops': {'s1': {'text': 'secretloop', 'done': false, 'at': 'x'}}};
    final started = await model(FakeGitHub(), state: {'monk': monk, 'monkStart': '2026-11-01'});
    var state = syncPayload(started.engine)['state'] as Map<String, dynamic>;
    expect(state.keys.where((k) => RegExp('monk', caseSensitive: false).hasMatch(k)).toList(), ['monkStart']);
    expect(state['monkStart'], '2026-11-01');
    expect(jsonEncode(syncPayload(started.engine)), allOf(isNot(contains('secretplan')), isNot(contains('secretloop')), isNot(contains('nosin'))));
    final fresh = await model(FakeGitHub(), state: {'monk': monk});
    state = syncPayload(fresh.engine)['state'] as Map<String, dynamic>;
    expect(state.keys.where((k) => RegExp('monk', caseSensitive: false).hasMatch(k)), isEmpty);
    expect(Engine.MONK_SYNCS, isFalse);
  });

  testWidgets('starting pushes at once (inside the 4 s debounce, and only once), carrying the date; with no token nothing is sent', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh);
    expect(m.startMonk(), isTrue);
    await tester.pump();
    await tester.pump();
    expect(gh.puts, hasLength(1)); // no waiting out the debounce
    expect(((gh.file!['state'] as Map)['monkStart']), '2026-11-05');
    expect(m.sync.owed, isFalse);
    // The debounce a save arms was cancelled by the push, so nothing follows it.
    final n = gh.calls.length;
    await tester.pump(const Duration(seconds: 30));
    expect(gh.calls.length, n);
    expect(gh.puts, hasLength(1));
    expect(m.startMonk(), isFalse); // a second press writes nothing and pushes nothing
    await tester.pump(const Duration(seconds: 10));
    expect(gh.puts, hasLength(1));
    // No token: the start is kept on the device and nothing leaves it.
    final gh2 = FakeGitHub();
    final m2 = await model(gh2, token: false);
    expect(m2.startMonk(), isTrue);
    await tester.pump(const Duration(seconds: 10));
    expect(gh2.calls, isEmpty);
    expect(m2.monkFrom, '2026-11-05');
  });

  testWidgets('a pulled start repaints the open Monk screen from Start to Day 3 of 21', (tester) async {
    final gh = FakeGitHub();
    final m = await model(gh);
    tester.view.physicalSize = const Size(375 * 3, 812 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(BrickfordApp(model: m));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('chip-monk')));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('monk-start')), findsOneWidget);
    gh.file = remoteWith({'monkStart': '2026-11-03'});
    final done = m.sync.run('pull');
    await tester.pump();
    expect(await done, isTrue);
    await tester.pumpAndSettle();
    expect(m.monkFrom, '2026-11-03');
    expect(find.text('Day 3 of 21'), findsOneWidget);
    expect(find.byKey(const ValueKey('monk-start')), findsNothing);
    // It was persisted by the pull's own (quiet) save, and the pull did not arm a push.
    expect(jsonDecode(m.prefs.getString(AppModel.storageKey)!)['monkStart'], '2026-11-03');
    final n = gh.calls.length;
    await tester.pump(const Duration(seconds: 30));
    expect(gh.calls.length, n);
    await tester.pumpWidget(const SizedBox());
  });
}
