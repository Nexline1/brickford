// The app's state: the data, the engine over S, and S persisted in
// shared_preferences under the web app's key, in the web app's shape
// (lessons[k] = {done, doneAt, firstDoneAt, quiz, ...}), so the sync stage
// can merge the two with the web app's mergeState rules unchanged.
import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../engine/dates.dart';
import '../engine/engine.dart';
import '../engine/learn.dart';
import '../engine/monk.dart';
import '../engine/pages.dart';
import '../engine/practice.dart';
import '../engine/quiz.dart';
import '../engine/record.dart';
import 'audio.dart';
import 'recorder.dart';
import 'sync.dart';

class AppModel extends ChangeNotifier {
  /// [today] fixes the date (tests, screenshots); the default is the device's local date.
  /// [now] is the wall clock (Monk's Now/Next, sync timestamps); [client] and
  /// [offline] are the sync's network, replaced by a fake in tests.
  AppModel(this.data, this.prefs, {String Function()? today, DateTime Function()? now, this.client, this.offline, AudioBackend? audio, this.recorderClock, this.saveDelay = Duration.zero})
    : engine = Engine(data, _load(prefs), today: today),
      audio = audio ?? createAudioBackend(),
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
    // From here every write goes through persist() or notifyListeners(), and both touch() the engine,
    // so its memoised schedule, streak, backlog and day statuses are dropped when S moves.
    engine.memoize = true;
  }

  final DateTime Function() now;
  final AudioBackend audio;

  /// Elapsed time for the recorder (a test's fake clock); the stopwatch by default.
  final Duration Function()? recorderClock;
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

  /// Every notification means S may have changed: the engine's memo is dropped first, so a listener
  /// that rebuilds in response reads fresh answers.
  @override
  void notifyListeners() {
    engine.touch();
    super.notifyListeners();
  }

  /// How long a change waits for further changes before S is written (jsonEncode of the whole state plus a
  /// storage write, which is too much to do on every tap and every keystroke). Zero writes at once, which is what
  /// the tests that read storage straight after a change expect; main.dart passes 400 ms.
  final Duration saveDelay;
  Timer? _saveTimer;
  bool _dirty = false;
  DateTime? _dirtySince;

  /// Whether S has changes not yet in storage.
  bool get unsaved => _dirty;

  /// app.js save(): S to storage (after [saveDelay], and never later than 2 s after the first unsaved
  /// change), and a push 4 s out unless quiet. Nothing is lost: [flush] runs when the page is hidden,
  /// before a sync and before an export.
  Future<void> persist() {
    engine.touch();
    if (_quiet == 0) sync.soon();
    if (saveDelay == Duration.zero) return _store();
    final at = now();
    if (!_dirty) _dirtySince = at;
    _dirty = true;
    _saveTimer?.cancel();
    if (at.difference(_dirtySince!) >= const Duration(seconds: 2)) return flush();
    _saveTimer = Timer(saveDelay, flush);
    return Future<void>.value();
  }

  /// Write any unsaved change now.
  Future<void> flush() {
    _saveTimer?.cancel();
    _saveTimer = null;
    if (!_dirty) return Future<void>.value();
    return _store();
  }

  Future<void> _store() {
    _dirty = false;
    _dirtySince = null;
    return prefs.setString(storageKey, jsonEncode(engine.S));
  }

  @override
  void dispose() {
    flush();
    super.dispose();
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
    engine.logEvent('lesson', k, {'done': truthy(lesson(k)['done'])}, _ts());
    persist();
    notifyListeners();
  }

  // ---------- quizzes, Problems, Exams (stage 4): each write is app.js's, then save() ----------

  /// A lecture quiz finished: the pass is recorded once (recordQuizPass), and
  /// the lecture is cleared everywhere that reads lessonCleared.
  void passedQuiz(String k, SittingResult r) {
    engine.recordQuizPass(k, r, now().toUtc().toIso8601String());
    engine.logEvent('quiz', k, {'firstTry': r.firstTry, 'total': r.total}, _ts());
    persist();
    notifyListeners();
  }

  /// A bank sitting finished: the attempt, and the misses it adds or clears.
  void sat(String bankId, BankSitting s, List<int> map) {
    engine.recordExam(bankId, s, map);
    engine.logEvent('exam', bankId, {'score': s.score, 'total': s.n, 'pct': s.pct}, _ts());
    persist();
    notifyListeners();
  }

  /// A recall graded (forgot / shaky / solid): the lecture is rescheduled and one `recall` event chained.
  void recall(String k, String grade) {
    if (!engine.gradeRecall(k, grade, _ts())) return;
    persist();
    notifyListeners();
  }

  /// The Electives status tap: none -> planned -> done -> none.
  void cycleElective(String id) {
    engine.cycleElective(id);
    persist();
    notifyListeners();
  }

  /// A drill finished: right answers leave the miss pool, wrong ones stay in it.
  void drilled(List<BankQ> pool, BankSitting s) {
    engine.recordDrill(pool, s);
    persist();
    notifyListeners();
  }

  String _ts() => isoStamp(now());

  void _write(void Function() f) {
    f();
    persist();
    notifyListeners();
  }

  void tickPset(String id, bool on) => _write(() => engine.setPset(id, on));
  void tickLab(String id, bool on) => _write(() {
    engine.setLab(id, on);
    engine.logEvent('lab', id, {'done': on}, _ts());
  });
  void labProof(String id, String url) => _write(() => engine.setLabProof(id, url));
  void tickProblem(String key, bool on) => _write(() {
    engine.setProblem(key, on);
    engine.logEvent('problem', key, {'solved': on}, _ts());
  });
  bool recordDiag(String id, double? v) {
    final ok = engine.recordDiag(id, v);
    if (ok) {
      engine.logEvent('diagnostic', id, {'score': jsRound(v!)}, _ts());
      persist();
      notifyListeners();
    }
    return ok;
  }

  void recordDiagDone(String id) => _write(() {
    engine.recordDiagDone(id);
    engine.logEvent('diagnostic', id, {'score': null}, _ts());
  });

  // ---------- the record (stage 5): the day seal, the Sunday week, the streak reset, anchors, Treasury ----------

  /// "Mark today's Deep Track done" (app.js act "studied"): false on a rest day.
  bool sealDay() {
    final ok = engine.sealDay(_ts());
    if (ok) {
      persist();
      notifyListeners();
    }
    return ok;
  }

  /// "Seal the week": Sunday only; false when it is not.
  bool sealWeek({required String shipped, required String notes, required num posts, num? revenue}) {
    final e = engine.sealWeek(shipped: shipped, notes: notes, posts: posts, revenue: revenue, ts: _ts());
    if (e == null) return false;
    persist();
    notifyListeners();
    return true;
  }

  void resetStreak() => _write(() => engine.resetStreak(_ts()));
  String? addAnchor(String where, String url) {
    final err = engine.addAnchor(where, url);
    if (err == null) _write(() {});
    return err;
  }

  void removeAnchor(int i) => _write(() => engine.removeAnchor(i));
  void saveOffer(String t) => _write(() => engine.saveOffer(t));
  bool addClient(String name, String project, num price, {bool force = false}) {
    final ok = engine.addClient(name, project, price, force: force);
    if (ok) _write(() {});
    return ok;
  }

  void removeClient(int i) => _write(() => engine.removeClient(i));
  bool addEntry(num amount, String note) {
    final ok = engine.addEntry(amount, note);
    if (ok) _write(() {});
    return ok;
  }

  void lockNiche(String id) => _write(() => engine.lockNiche(id));

  // ---------- Practice (stage 6b): the reps, the recorder, the gates ----------

  /// The hand form's logging (app.js's repBank / repStory / repHumor / repReview).
  RepResult logRep(String act, Map<String, String> values) {
    final r = engine.logRepForm(act, values, _ts());
    if (r.ok) {
      persist();
      notifyListeners();
    }
    return r;
  }

  /// What the Practice page's hand-form fields hold now (the recorded humour rep
  /// takes the five attempts and the keeper from them, as the web page does).
  Map<String, String> Function() practiceForm = () => const {};

  /// The last thing the recorder wants said (a toast): taken once by the Practice page.
  String? practiceNote;

  /// The one recorder; created on first use. A finished clip is logged here, not in a
  /// page, so a recording that ends after the page was left is still kept and logged.
  late final PracticeRecorder recorder = PracticeRecorder(
    audio,
    today: () => today,
    clock: recorderClock,
    onClip: (kind, date, seconds, title, kept) {
      final r = engine.logRecordedRep(kind, date, seconds, title, kept: kept, v: practiceForm(), ts: _ts());
      if (r.ok) persist();
      practiceNote = r.msg;
      notifyListeners();
    },
    onShort: () {
      practiceNote = 'Under a second \u2014 nothing kept. Hold it and talk.';
      notifyListeners();
    },
  );

  /// Pass the next gate / unmark the last one passed (the Transcript's confirm sheet); false when refused.
  bool setGate(int n, bool pass) {
    final ok = engine.setGate(n, pass, _ts());
    if (ok) {
      persist();
      notifyListeners();
    }
    return ok;
  }

  /// The lesson page records itself as the one to resume, only when it changed
  /// (the web app's rule: a render is a read; this runs once, on open).
  void openedLesson(String cid, int ui, int li, String label) {
    final was = engine.settings['lastLesson'];
    if (was is Map && was['cid'] == cid && was['ui'] == ui && was['li'] == li && was['label'] == label) return;
    engine.settings['lastLesson'] = {'cid': cid, 'ui': ui, 'li': li, 'label': label};
    quiet(persist);
  }

  // ---------- Monk Mode (local only: MONK_SYNCS is false, so no write here arms a push; the start date is the exception) ----------
  String _stamp() => now().toUtc().toIso8601String();

  /// The Monk start date (S.monkStart, T-065), or null until the owner starts it.
  String? get monkFrom => engine.monkFrom;

  /// The days that count (app.js monkLive): none before the start, and none at all while there is no start.
  Map<String, dynamic> get monkLiveDays => monkLive(monkDays, engine.monkFrom);

  /// app.js startMonk: today becomes day 1, once. False, and nothing changes, when it already has a start.
  /// A user action (the start sheet's hold), never called from a build. It saves like any user action, then pushes
  /// at once instead of waiting out the debounce, so the date reaches the other devices.
  bool startMonk() {
    if (!engine.startMonk()) return false;
    persist();
    notifyListeners();
    if (sync.hasToken) unawaited(sync.pushNow());
    return true;
  }

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
