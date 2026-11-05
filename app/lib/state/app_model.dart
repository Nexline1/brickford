// The app's state: the data, the engine over S, and S persisted in
// shared_preferences under the web app's key, in the web app's shape
// (lessons[k] = {done, doneAt, firstDoneAt, quiz, ...}), so the sync stage
// can merge the two with the web app's mergeState rules unchanged.
import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../engine/dates.dart';
import '../engine/engine.dart';
import '../engine/monk.dart';
import '../engine/quiz.dart';
import 'sync.dart';

class AppModel extends ChangeNotifier {
  /// [today] fixes the date (tests, screenshots); the default is the device's local date.
  /// [now] is the wall clock (Monk's Now/Next, sync timestamps); [client] and
  /// [offline] are the sync's network, replaced by a fake in tests.
  AppModel(this.data, this.prefs, {String Function()? today, DateTime Function()? now, this.client, this.offline})
    : engine = Engine(data, _load(prefs), today: today),
      now = now ?? DateTime.now {
    // app.js's load: a device id (kept, never reset), and gates in the shape that syncs.
    // In memory only, like there: opening the app saves nothing and arms no push.
    final st = engine.settings;
    if (!truthy(st['deviceId'])) {
      final ts = this.now().millisecondsSinceEpoch.toRadixString(36);
      st['deviceId'] = math.Random().nextInt(1679616).toRadixString(36).padLeft(4, '0') + ts.substring(ts.length - 4);
    }
    final gates = (engine.S['gates'] as Map).cast<String, dynamic>();
    for (final k in gates.keys.toList()) {
      final g = engine.gateRec(gates[k], int.tryParse(k) ?? 0);
      gates[k] = {'date': g.date, 'at': g.at, 'passed': g.passed};
    }
  }

  final DateTime Function() now;
  final http.Client? client;
  final bool Function()? offline;

  /// GitHub sync; its status is its own notifier, so a sync never repaints a page being read.
  late final SyncService sync = SyncService(this, client: client, offline: offline);

  String get today => engine.todayISO();

  static const storageKey = 'darhikmah_v1';

  final BrickfordData data;
  final SharedPreferences prefs;
  final Engine engine;

  static Map<String, dynamic>? _load(SharedPreferences prefs) {
    final raw = prefs.getString(storageKey);
    if (raw == null) return null;
    try {
      final v = jsonDecode(raw);
      return v is Map ? v.cast<String, dynamic>() : null;
    } catch (_) {
      return null;
    }
  }

  static Future<String> _read(AssetBundle bundle, String f) async {
    // load + utf8.decode, not loadString: loadString decodes anything over
    // 50 KB on a compute() isolate, which never completes inside a widget
    // test's fake clock (and buys nothing for a one-off read).
    final bytes = await bundle.load('assets/data/$f');
    return utf8.decode(bytes.buffer.asUint8List(bytes.offsetInBytes, bytes.lengthInBytes));
  }

  /// Startup's data: everything but summaries.json (see [ensureSummaries]).
  static Future<BrickfordData> loadData(AssetBundle bundle) async {
    final text = <String, String>{};
    for (final f in BrickfordData.files) {
      text[f] = await _read(bundle, f);
    }
    return BrickfordData.fromText(text);
  }

  Future<void>? _summaries;

  /// summaries.json (1.9 MB), read the first time a lecture page asks for it
  /// rather than at startup; listeners rebuild when it lands.
  Future<void> ensureSummaries([AssetBundle? bundle]) => _summaries ??= () async {
    final raw = await _read(bundle ?? rootBundle, 'summaries.json');
    final v = jsonDecode(raw);
    data.summaries = v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};
    data.summariesLoaded = true;
    notifyListeners();
  }();

  // A render is a read. Anything a view must persist while rendering goes
  // through quiet(): a save that is not quiet arms a network write.
  int _quiet = 0;
  T quiet<T>(T Function() f) {
    _quiet++;
    try {
      return f();
    } finally {
      _quiet--;
    }
  }

  /// app.js save(): S to storage, and a push 4 s out unless quiet.
  Future<void> persist() {
    final f = prefs.setString(storageKey, jsonEncode(engine.S));
    if (_quiet == 0) sync.soon();
    return f;
  }

  /// The record changed under the screen (a merge brought work in).
  void refresh() => notifyListeners();

  Map<String, dynamic> lesson(String k) {
    final v = engine.lessons[k];
    return v is Map ? v.cast<String, dynamic>() : const {};
  }

  LessonMark markOf(String k) {
    if (engine.lessonCleared(k)) return LessonMark.cleared;
    if (truthy(lesson(k)['done'])) return LessonMark.watched;
    return LessonMark.none;
  }

  /// Mark watched / unmark (the web app's toggleDone).
  void toggleDone(String k) {
    engine.toggleDone(k);
    persist();
    notifyListeners();
  }

  // ---------- quizzes, Problems, Exams (stage 4): each write is app.js's, then save() ----------

  /// A lecture quiz finished: the pass is recorded once (recordQuizPass), and
  /// the lecture is cleared everywhere that reads lessonCleared.
  void passedQuiz(String k, SittingResult r) {
    engine.recordQuizPass(k, r, now().toUtc().toIso8601String());
    persist();
    notifyListeners();
  }

  /// A bank sitting finished: the attempt, and the misses it adds or clears.
  void sat(String bankId, BankSitting s, List<int> map) {
    engine.recordExam(bankId, s, map);
    persist();
    notifyListeners();
  }

  void _write(void Function() f) {
    f();
    persist();
    notifyListeners();
  }

  void tickPset(String id, bool on) => _write(() => engine.setPset(id, on));
  void tickLab(String id, bool on) => _write(() => engine.setLab(id, on));
  void labProof(String id, String url) => _write(() => engine.setLabProof(id, url));
  void tickProblem(String key, bool on) => _write(() => engine.setProblem(key, on));
  bool recordDiag(String id, double? v) {
    final ok = engine.recordDiag(id, v);
    if (ok) {
      persist();
      notifyListeners();
    }
    return ok;
  }

  void recordDiagDone(String id) => _write(() => engine.recordDiagDone(id));

  /// The lesson page records itself as the one to resume, only when it changed
  /// (the web app's rule: a render is a read; this runs once, on open).
  void openedLesson(String cid, int ui, int li, String label) {
    final was = engine.settings['lastLesson'];
    if (was is Map && was['cid'] == cid && was['ui'] == ui && was['li'] == li && was['label'] == label) return;
    engine.settings['lastLesson'] = {'cid': cid, 'ui': ui, 'li': li, 'label': label};
    quiet(persist);
  }

  // ---------- Monk Mode (local only: MONK_SYNCS is false, so no write here arms a push) ----------
  String _stamp() => now().toUtc().toIso8601String();

  Map<String, dynamic> get monkDays => ((engine.S['monk'] as Map?)?['days'] as Map?)?.cast<String, dynamic>() ?? const {};
  Map<String, dynamic> get monkPlans => ((engine.S['monk'] as Map?)?['plans'] as Map?)?.cast<String, dynamic>() ?? const {};
  Map<String, dynamic> get monkLoops => ((engine.S['monk'] as Map?)?['loops'] as Map?)?.cast<String, dynamic>() ?? monkSeedLoops();

  Map<String, dynamic> monkRec(String iso) => monkDays[iso] is Map ? (monkDays[iso] as Map).cast<String, dynamic>() : const {};

  void _monkSave() {
    quiet(persist);
    notifyListeners();
  }

  /// app.js dayPatch: change today's record, stamp it.
  void monkPatch(void Function(Map<String, dynamic> d) fn) {
    final iso = today, st = monkStore(engine.S), days = (st['days'] as Map).cast<String, dynamic>();
    final d = <String, dynamic>{...monkRec(iso)};
    fn(d);
    d['at'] = _stamp();
    days[iso] = d;
    _monkSave();
  }

  void monkToggleLoop(String id) {
    final loops = (monkStore(engine.S)['loops'] as Map).cast<String, dynamic>();
    final l = loops[id];
    if (l is! Map) return;
    loops[id] = {...l.cast<String, dynamic>(), 'done': !truthy(l['done']), 'at': _stamp()};
    _monkSave();
  }

  void monkAddLoop(String text) {
    final t = text.trim();
    if (t.isEmpty) return;
    final loops = (monkStore(engine.S)['loops'] as Map).cast<String, dynamic>();
    loops['l${now().millisecondsSinceEpoch.toRadixString(36)}${math.Random().nextInt(46656).toRadixString(36).padLeft(3, '0')}'] = {
      'text': t.length > 200 ? t.substring(0, 200) : t,
      'done': false,
      'at': _stamp(),
    };
    _monkSave();
  }

  /// Save tomorrow's plan; saving it is today's "Plan tomorrow".
  void monkSavePlan(Map<String, String> fields) {
    final st = monkStore(engine.S), at = _stamp();
    final plans = (st['plans'] as Map).cast<String, dynamic>(), days = (st['days'] as Map).cast<String, dynamic>();
    final p = <String, dynamic>{'at': at};
    fields.forEach((k, v) => p[k] = v.trim().length > 200 ? v.trim().substring(0, 200) : v.trim());
    plans[addDaysISO(today, 1)] = p;
    days[today] = {...monkRec(today), 'plan': true, 'at': at};
    _monkSave();
  }
}

enum LessonMark { none, watched, cleared }

class AppScope extends InheritedNotifier<AppModel> {
  const AppScope({super.key, required AppModel model, required super.child}) : super(notifier: model);

  static AppModel of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<AppScope>()!.notifier!;
}
