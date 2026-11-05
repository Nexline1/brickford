// The Brickford engine: a 1:1 port of the date, schedule, quiz-gate, streak,
// revision-week and Monk functions in platform/js/app.js.
//
// PORTED, NOT REDESIGNED. Every function keeps its JS name and its JS body,
// line for line where Dart allows, including the guards and the odd corners
// (the `|| 50` for a lesson with no minutes, the strict `<` against
// QUIZ_GATE_FROM, the -1 a rest day indexes to). Where Dart and JS differ the
// port reproduces JS: integer division is FLOOR division (Dart's ~/ truncates
// toward zero, Math.floor does not, and todayTurn divides a negative), and
// `x || y` is JS truthiness (see [truthy]).
//
// tools/verify-app.js runs this engine (tool/engine_dump.dart) and app.js over
// every date of the plan and a set of state fixtures and fails on the first
// disagreement, so a change here that is not also a change there cannot ship.
//
// CLAUDE.md rules this file must keep, as app.js does:
//   - START_DATE comes from the data (meta.json), never from here.
//   - REST_DOW is the only rest-day constant; everything else derives from it.
//   - the streak is derived from S.studyDays, never stored; it stops at
//     S.settings.streakFrom; bestStreak ignores streakFrom.
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dart:convert';

import 'dates.dart';

/// JS truthiness, for porting `a || b`, `!!a` and `if (a)` faithfully.
bool truthy(Object? v) {
  if (v == null || v == false) return false;
  if (v is num) return v != 0 && !v.isNaN;
  if (v is String) return v.isNotEmpty;
  return true;
}

/// Math.floor(a / b).
int fdiv(num a, num b) => (a / b).floor();

T? _at<T>(List<T> list, int i) => i >= 0 && i < list.length ? list[i] : null;

Map<String, dynamic> _map(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};

// ---------- data ----------

/// app/assets/data/*.json, as written by tools/export-data.js.
class BrickfordData {
  BrickfordData({
    required this.startDate,
    required this.identity,
    required this.courses,
    required this.summaries,
    required this.quizKeys,
    required this.quizzes,
    required this.psets,
    required this.labs,
    required this.gates,
    required this.diagnostics,
    required this.weekPlan,
    required this.drills,
    required this.speechCourseIds,
  });

  /// DAR.START_DATE.
  final String startDate;
  final Map<String, dynamic> identity;
  final List<Map<String, dynamic>> courses;
  /// summaries.json: read when a lecture opens, not at startup (it is 1.9 MB),
  /// so empty until [summariesLoaded]. The quiz gate never waits on it: it
  /// asks [quizKeys].
  Map<String, dynamic> summaries;
  bool summariesLoaded = false;

  /// quiz-keys.json: the lectures whose summary carries checks (app.js
  /// lessonQuiz(k) != null), exported from the same data.
  final Set<String> quizKeys;
  final Map<String, dynamic> quizzes;
  final List<Map<String, dynamic>> psets;
  final List<Map<String, dynamic>> labs;
  final List<Map<String, dynamic>> gates;
  final List<Map<String, dynamic>> diagnostics;
  final List<Map<String, dynamic>> weekPlan;
  final Map<String, dynamic> drills;
  final List<String> speechCourseIds;

  /// What startup reads.
  static const files = [
    'meta.json', 'courses.json', 'quiz-keys.json', 'quizzes.json', 'workshop.json', 'gates.json', 'storytelling.json',
  ];

  /// Read later, on first need.
  static const lazyFiles = ['summaries.json'];

  /// From the decoded text of [files] (and [lazyFiles], when given), keyed by file name.
  factory BrickfordData.fromText(Map<String, String> text) {
    Map<String, dynamic> obj(String f) => _map(jsonDecode(text[f]!));
    List<Map<String, dynamic>> list(Object? v) => (v as List).map((e) => _map(e)).toList();
    final meta = obj('meta.json'), work = obj('workshop.json'), gates = obj('gates.json'), story = obj('storytelling.json');
    return BrickfordData(
      startDate: meta['START_DATE'] as String,
      identity: _map(meta['IDENTITY']),
      courses: list(jsonDecode(text['courses.json']!)),
      summaries: text['summaries.json'] != null ? obj('summaries.json') : <String, dynamic>{},
      quizKeys: (jsonDecode(text['quiz-keys.json']!) as List).cast<String>().toSet(),
      quizzes: obj('quizzes.json'),
      psets: list(work['PSETS']),
      labs: list(work['LABS']),
      gates: list(gates['GATES']),
      diagnostics: list(gates['DIAGNOSTICS']),
      weekPlan: list(gates['WEEK_PLAN']),
      drills: _map(story['DRILLS']),
      speechCourseIds: (story['courses'] as List).cast<String>(),
    )..summariesLoaded = text['summaries.json'] != null;
  }

  Map<String, dynamic>? course(String id) {
    for (final c in courses) {
      if (c['id'] == id) return c;
    }
    return null;
  }
}

/// One entry of flatLessons(cid): { cid, ui, li, l, code }.
class FlatLesson {
  const FlatLesson(this.cid, this.ui, this.li, this.l, this.code);
  final String cid;
  final int ui, li;
  final Map<String, dynamic> l;
  final String? code;
  String get key => lessonKey(cid, ui, li);
}

/// A window of packWindows: { idxs, dayN?, spanN? }.
class Window {
  const Window(this.idxs, [this.dayN, this.spanN]);
  final List<int> idxs;
  final int? dayN, spanN;
}

/// One item of scheduledFor(iso). A real lecture carries cid/ui/li/l/code; a
/// pseudo block (Psets, Project, Frontier) carries short/t/href instead.
class SchedItem {
  SchedItem.lesson(this.track, FlatLesson f, this.dayN, this.spanN)
      : pseudo = false, cid = f.cid, ui = f.ui, li = f.li, l = f.l, code = f.code, short = null, t = null, href = null;
  SchedItem.pseudo(this.track, String this.short, String this.t, String this.href)
      : pseudo = true, cid = null, ui = null, li = null, l = null, code = null, dayN = null, spanN = null;
  final String track;
  final bool pseudo;
  final String? cid, code, short, t, href;
  final int? ui, li, dayN, spanN;
  final Map<String, dynamic>? l;
  String get key => pseudo ? '~$short' : lessonKey(cid!, ui!, li!);
  String get title => pseudo ? t! : (l!['t'] as String? ?? '');
}

/// The dashboard's one next action (app.js nextAction), without the HTML.
class NextAction {
  const NextAction(this.kind,
      {this.cid, this.ui, this.li, this.title = '', this.code = '', this.workAhead = false, this.seen = false});
  /// lecture | quiz | recall | resume | rest | none
  final String kind;
  final String? cid;
  final int? ui, li;
  final String title, code;
  final bool workAhead;
  /// For a quiz action: the lecture is watched, so its quiz is what is left ("Quiz:"), else "Watch: …, then its quiz".
  final bool seen;
  bool get opensLesson => cid != null;
}

String lessonKey(String cid, int u, int i) => '$cid.$u.$i';

// ---------- state ----------

/// app.js DEFAULT, fresh each call.
Map<String, dynamic> defaultState() => {
      'v': 1,
      'lessons': <String, dynamic>{},
      'problems': <String, dynamic>{},
      'quizAttempts': <String, dynamic>{},
      'quizMisses': <String, dynamic>{},
      'diag': <String, dynamic>{},
      'gates': <String, dynamic>{},
      'studyDays': <dynamic>[],
      'weeks': <dynamic>[],
      'labs': <String, dynamic>{},
      'psets': <String, dynamic>{},
      'electives': <String, dynamic>{},
      'treasury': <String, dynamic>{'offer': '', 'clients': <dynamic>[], 'entries': <dynamic>[], 'niche': ''},
      'reps': <String, dynamic>{'bank': <dynamic>[], 'story': <dynamic>[], 'humor': <dynamic>[], 'review': <dynamic>[]},
      'settings': <String, dynamic>{
        'lastBackup': null, 'dailyStart': '08:00', 'streakFrom': null, 'lastSyncAt': null, 'syncError': null,
      },
    };

/// app.js's load: DEFAULT under what was stored, the nested objects merged the
/// same way, S.review and S.monk created when missing.
Map<String, dynamic> normalizeState(Map<String, dynamic>? stored) {
  final d = defaultState();
  final s = <String, dynamic>{...d, ...?stored};
  s['treasury'] = {...d['treasury'] as Map<String, dynamic>, ..._map(s['treasury'])};
  s['reps'] = {...d['reps'] as Map<String, dynamic>, ..._map(s['reps'])};
  s['settings'] = {...d['settings'] as Map<String, dynamic>, ..._map(s['settings'])};
  s['review'] = s['review'] is Map ? _map(s['review']) : <String, dynamic>{};
  if (s['monk'] is! Map) s['monk'] = <String, dynamic>{};
  for (final k in ['lessons', 'problems', 'labs', 'psets']) {
    s[k] = _map(s[k]);
  }
  if (s['studyDays'] is! List) s['studyDays'] = <dynamic>[];
  return s;
}

// ---------- the engine ----------

class Engine {
  Engine(this.D, Map<String, dynamic>? state, {String Function()? today})
      : S = normalizeState(state),
        todayISO = today ?? (() => localISO(DateTime.now()));

  final BrickfordData D;
  Map<String, dynamic> S;
  final String Function() todayISO;

  String get START_DATE => D.startDate;
  Map<String, dynamic> get lessons => S['lessons'] as Map<String, dynamic>;
  Map<String, dynamic> get settings => S['settings'] as Map<String, dynamic>;
  List<String> get studyDays => (S['studyDays'] as List).whereType<String>().toList();

  // ---------- six days a week ----------
  static const int REST_DOW = 6; // 0 = Sunday … 6 = Saturday
  bool isRestDay(String iso) => dowOf(iso) == REST_DOW;
  int? _restK;
  int restOffset() => _restK ??= (REST_DOW - dowOf(START_DATE) + 7) % 7;
  int restsWithin(int n) {
    final k = restOffset();
    return n > k ? fdiv(n - k - 1, 7) + 1 : 0;
  }

  int studyIndex(String iso) {
    if (lt(iso, START_DATE) || isRestDay(iso)) return -1;
    final n = daysBetween(START_DATE, iso);
    return n - restsWithin(n);
  }

  String dateForStudy(int i) {
    final k = restOffset();
    if (i < k) return addDaysISO(START_DATE, i);
    final j = i - k;
    return addDaysISO(START_DATE, k + 1 + fdiv(j, 6) * 7 + (j % 6));
  }

  // ---- the speech calendar ----
  static const int SPEECH_OFF_DOW = 5; // Friday
  int? _friK;
  int speechOffset() {
    if (_friK == null) {
      var i = 0;
      while (i < 7 && dowOf(dateForStudy(i)) != SPEECH_OFF_DOW) {
        i++;
      }
      _friK = i;
    }
    return _friK!;
  }

  int speechOffsWithin(int d) {
    final k = speechOffset();
    return d > k ? fdiv(d - k - 1, STUDY_WEEK) + 1 : 0;
  }

  int speechSlot(String iso) {
    final d = studyIndex(iso);
    if (d < 0 || dowOf(iso) == SPEECH_OFF_DOW) return -1;
    return d - speechOffsWithin(d);
  }

  String addStudyDays(String iso, int n) {
    final base = studyIndex(iso);
    if (base < 0) {
      var cur = lt(iso, START_DATE) ? START_DATE : addDaysISO(iso, 1);
      while (isRestDay(cur)) {
        cur = addDaysISO(cur, 1);
      }
      return dateForStudy(studyIndex(cur) + n);
    }
    return dateForStudy(base + n);
  }

  int studyToday() => studyIndex(todayISO());

  /// T-063: the slot windowing treats as "today" (the last study day on a rest day).
  int studyAnchor() {
    final i = studyToday();
    return i >= 0 || lt(todayISO(), START_DATE) ? i : studyIndex(prevStudyDay(todayISO()));
  }

  String nextStudyDay(String iso) {
    var cur = addDaysISO(iso, 1);
    for (var guard = 0; guard < 14 && isRestDay(cur); guard++) {
      cur = addDaysISO(cur, 1);
    }
    return cur;
  }

  static const int STUDY_WEEK = 6;
  int weekNumber() {
    final i = studyToday();
    final prev = studyIndex(prevStudyDay(todayISO()));
    final eff = i >= 0 ? i : (prev > 0 ? prev : 0);
    final w = fdiv(eff, STUDY_WEEK) + 1;
    return w < 1 ? 1 : w;
  }

  String prevStudyDay(String iso) {
    var cur = addDaysISO(iso, -1);
    for (var guard = 0; guard < 14 && (isRestDay(cur) || lt(cur, START_DATE)); guard++) {
      if (lt(cur, START_DATE)) return START_DATE;
      cur = addDaysISO(cur, -1);
    }
    return cur;
  }

  // ---------- the streak ----------
  int streak() {
    final set = studyDays.toSet();
    final floor = truthy(settings['streakFrom']) ? settings['streakFrom'] as String : '';
    var n = 0;
    var cur = todayISO();
    if (!set.contains(cur)) cur = addDaysISO(cur, -1);
    for (var guard = 0; guard < 4000; guard++) {
      if (lt(cur, floor)) break;
      if (isRestDay(cur)) {
        cur = addDaysISO(cur, -1);
        continue;
      }
      if (!set.contains(cur)) break;
      n++;
      cur = addDaysISO(cur, -1);
    }
    return n;
  }

  int bestStreak() {
    final days = studyDays..sort();
    var best = 0, run = 0;
    String? prev;
    for (final d in days) {
      if (prev != null) {
        var gap = addDaysISO(prev, 1);
        while (lt(gap, d) && isRestDay(gap)) {
          gap = addDaysISO(gap, 1);
        }
        run = gap == d ? run : 0;
      }
      run++;
      if (run > best) best = run;
      prev = d;
    }
    return best;
  }

  // ---------- the fixed syllabus ----------
  final Map<String, List<FlatLesson>> _flatCache = {};
  List<FlatLesson> flatLessons(String cid) {
    return _flatCache.putIfAbsent(cid, () {
      final c = D.course(cid);
      if (c == null) throw StateError('flatLessons: no course $cid');
      final out = <FlatLesson>[];
      final units = (c['units'] as List?) ?? const [];
      for (var ui = 0; ui < units.length; ui++) {
        final ls = (units[ui]['lessons'] as List);
        for (var li = 0; li < ls.length; li++) {
          out.add(FlatLesson(cid, ui, li, _map(ls[li]), c['code'] as String?));
        }
      }
      return out;
    });
  }

  static double EFFORT(num m) => m * 1.8 + 4;
  static const int THEORY_BUDGET = 120, BUILD_BUDGET = 90;
  static const int SPEECH_BUDGET = 40;
  static num _min(Map<String, dynamic> l) => truthy(l['min']) ? l['min'] as num : 50;

  List<Window> packWindows(List<FlatLesson> flat, int from, num budget) {
    final out = <Window>[];
    var i = from;
    while (i < flat.length) {
      final e = EFFORT(_min(flat[i].l));
      if (e > budget * 1.15) {
        final n = (e / budget).ceil();
        for (var k = 1; k <= n; k++) {
          out.add(Window([i], k, n));
        }
        i++;
      } else {
        double eff = 0;
        var j = i;
        while (j < flat.length) {
          final ej = EFFORT(_min(flat[j].l));
          if (ej > budget * 1.15) break;
          if (j > i && eff + ej > budget * 1.05) break;
          eff += ej;
          j++;
        }
        out.add(Window([for (var k = i; k < j; k++) k]));
        i = j;
      }
    }
    return out;
  }

  final Map<String, List<Window>> _winCache = {};
  List<Window> fixedWindows(String key, List<FlatLesson> flat, num budget) =>
      _winCache.putIfAbsent(key, () => packWindows(flat, 0, budget));

  int firstUnfinished(List<FlatLesson> flat) {
    for (var i = 0; i < flat.length; i++) {
      if (!truthy(_map(lessons[flat[i].key])['done'])) return i;
    }
    return flat.length;
  }

  bool planOnly = false;

  Window? windowFor(String key, List<FlatLesson> flat, num budget, int slot, int todaySlot) {
    final fixed = fixedWindows(key, flat, budget);
    if (planOnly) return _at(fixed, slot);
    if (todaySlot < 0 && firstUnfinished(flat) == 0) return _at(fixed, slot);
    if (slot <= todaySlot) return _at(fixed, slot);
    final fu = firstUnfinished(flat);
    final nextFixedStart = todaySlot + 1 < fixed.length ? fixed[todaySlot + 1].idxs[0] : flat.length;
    if (fu <= nextFixedStart) return _at(fixed, slot);
    final dyn = packWindows(flat, fu, budget);
    return _at(dyn, slot - todaySlot - 1);
  }

  static const THEORY_ROT = ['math110', 'math120', 'math130'];
  static const SPEECH_COURSES = ['spch100', 'spch110'];
  static const int P2_DAY = 182;

  List<SchedItem> scheduledFor(String iso) {
    final d = studyIndex(iso);
    if (d < 0) return [];
    final items = <SchedItem>[];

    // ---- Theory ----
    final dT = studyAnchor();
    final rotIdx = d % 3, rot = THEORY_ROT[rotIdx];
    final rotFlat = flatLessons(rot);
    final turn = fdiv(d, 3);
    final todayTurn = dT < 0 ? -1 : fdiv(dT - rotIdx, 3);
    final tw = windowFor('t:$rot', rotFlat, THEORY_BUDGET, turn, todayTurn);
    var theoryAdded = false;
    if (tw != null) {
      for (final k in tw.idxs) {
        items.add(SchedItem.lesson('Theory', rotFlat[k], tw.dayN, tw.spanN));
      }
      theoryAdded = tw.idxs.isNotEmpty;
    }
    if (!theoryAdded && d >= P2_DAY) {
      const chain = [['math210', 1], ['sys250', 2], ['ai310', 2], ['res400', 3]];
      var off = d - P2_DAY;
      for (final c in chain) {
        final cid = c[0] as String, span = c[1] as int;
        final flat = flatLessons(cid);
        final len = flat.length * span;
        if (off < len) {
          items.add(SchedItem.lesson('Theory', flat[fdiv(off, span)], (off % span) + 1, span));
          theoryAdded = true;
          break;
        }
        off -= len;
      }
      final physFlat = flatLessons('phys100');
      final pIdx = fdiv(d - P2_DAY, 4);
      if ((d - P2_DAY) % 4 == 0 && pIdx >= 0 && pIdx < physFlat.length) {
        items.add(SchedItem.lesson('Theory', physFlat[pIdx], 1, 1));
      }
    }
    if (!theoryAdded) {
      items.add(d < P2_DAY
          ? SchedItem.pseudo('Theory', 'Psets',
              'Problem sets & exam prep — MIT psets, Stat 110 practice, checkpoint exams', '#/workshop')
          : SchedItem.pseudo('Theory', 'Frontier',
              'Frontier study on your fork — new papers, ARENA, outside courses', '#/electives'));
    }

    // ---- Build ----
    final spineFlat = [...flatLessons('ai200'), ...flatLessons('ai210')];
    final bw = windowFor('b:spine', spineFlat, BUILD_BUDGET, d, dT < 0 ? -1 : dT);
    var buildAdded = false;
    if (bw != null) {
      for (final k in bw.idxs) {
        items.add(SchedItem.lesson('Build', spineFlat[k], bw.dayN, bw.spanN));
      }
      buildAdded = bw.idxs.isNotEmpty;
    }
    if (!buildAdded) {
      if (d < P2_DAY) {
        items.add(SchedItem.pseudo('Build', 'Project',
            'Original project block — your GPT on your corpus, nanoGPT depth, labs (see week focus)', '#/workshop'));
      } else {
        final papers = flatLessons('ai300');
        final pi = fdiv(d - P2_DAY, 21);
        if (pi < papers.length) {
          items.add(SchedItem.lesson('Build', papers[pi], ((d - P2_DAY) % 21) + 1, 21));
        } else {
          items.add(SchedItem.pseudo('Build', 'Frontier',
              'Frontier build — ship on your fork: labs, open source, product', '#/workshop'));
        }
      }
    }

    // ---- Publish ----
    final sd = speechSlot(iso);
    final speechFlat = <FlatLesson>[
      for (final cid in SPEECH_COURSES.where((cid) => D.course(cid) != null)) ...flatLessons(cid),
    ];
    if (speechFlat.isNotEmpty) {
      if (sd >= 0) {
        final sToday = speechSlot(todayISO());
        final sw = windowFor('s:speech', speechFlat, SPEECH_BUDGET, sd, sToday);
        if (sw != null) {
          for (final k in sw.idxs) {
            items.add(SchedItem.lesson('Publish', speechFlat[k], sw.dayN, sw.spanN));
          }
        }
      }
    }
    return items;
  }

  // ---------- the lecture quiz gate (T-043) ----------
  static const QUIZ_GATE_FROM = '2026-10-24';

  /// lessonQuiz(k) != null, answered from quiz-keys.json so it holds before
  /// summaries.json is read. Every gate decision goes through this.
  bool hasQuiz(String k) => D.quizKeys.contains(k);

  /// The checks themselves (the lesson page), once summaries.json is read.
  List<dynamic>? lessonQuiz(String k) {
    final sm = D.summaries[k];
    if (sm is! Map) return null;
    final checks = sm['checks'];
    return checks is List && checks.isNotEmpty ? checks : null;
  }

  bool quizPassed(String k) => truthy(_map(_map(lessons[k])['quiz'])['passedAt']);

  static String? firstWatched(Map<String, dynamic>? st) {
    if (st == null) return null;
    final l = [st['doneAt'], st['firstDoneAt']].where(truthy).map((e) => e.toString()).toList()..sort();
    return l.isEmpty ? null : l.first;
  }

  static bool grandfathered(Map<String, dynamic>? st) {
    final fw = firstWatched(st);
    return st != null && truthy(st['done']) && fw != null && lt(fw, QUIZ_GATE_FROM);
  }

  bool lessonCleared(String k) {
    final st = _map(lessons[k]);
    return truthy(st['done']) && (quizPassed(k) || !hasQuiz(k) || grandfathered(st));
  }

  // The lecture's own date in the plan, read with no work-ahead re-anchoring.
  var _planNext = 0;
  final Map<String, String> _planDate = {};
  String? planDateOf(String k) {
    while (_planDate[k] == null && _planNext < 1300) {
      final iso = dateForStudy(_planNext++);
      planOnly = true;
      try {
        for (final it in scheduledFor(iso)) {
          if (!it.pseudo) _planDate.putIfAbsent(it.key, () => iso);
        }
      } finally {
        planOnly = false;
      }
    }
    return _planDate[k];
  }

  bool lessonBlocks(String k) =>
      hasQuiz(k) &&
      !quizPassed(k) &&
      !grandfathered(lessons[k] is Map ? _map(lessons[k]) : null) &&
      ge(planDateOf(k) ?? '9999', QUIZ_GATE_FROM);

  FlatLesson? lockedBy(String cid, int ui, int li) {
    if (truthy(_map(lessons[lessonKey(cid, ui, li)])['done'])) return null;
    final flat = flatLessons(cid);
    final i = flat.indexWhere((f) => f.ui == ui && f.li == li);
    if (i <= 0) return null;
    final p = flat[i - 1];
    return lessonBlocks(p.key) ? p : null;
  }

  FlatLesson? lockRoot(String cid, int ui, int li) {
    var b = lockedBy(cid, ui, li);
    for (var guard = 0; b != null && guard < 1000; guard++) {
      final up = lockedBy(b.cid, b.ui, b.li);
      if (up == null) break;
      b = up;
    }
    return b;
  }

  bool schedDone(SchedItem it) => !it.pseudo && lessonCleared(it.key);
  List<SchedItem> realSched(String iso) => scheduledFor(iso).where((it) => !it.pseudo).toList();

  ({int lessons, int problems, bool sealed, bool any}) dayActivity(String iso) {
    var nl = 0, np = 0;
    for (final l in lessons.values) {
      if (l is Map && l['doneAt'] == iso) nl++;
    }
    for (final v in _map(S['problems']).values) {
      if (v == iso) np++;
    }
    final sealed = (S['studyDays'] as List).contains(iso);
    return (lessons: nl, problems: np, sealed: sealed, any: nl + np > 0 || sealed);
  }

  String? firstActivityISO() {
    String? first;
    for (final d in studyDays) {
      if (first == null || lt(d, first)) first = d;
    }
    for (final l in lessons.values) {
      if (l is Map && truthy(l['doneAt'])) {
        final d = l['doneAt'].toString();
        if (first == null || lt(d, first)) first = d;
      }
    }
    for (final v in _map(S['problems']).values) {
      if (v is String && (first == null || lt(v, first))) first = v;
    }
    return first;
  }

  int backlogCount() {
    final today = todayISO();
    final from = firstActivityISO();
    if (from == null) return 0;
    final owed = <String>{};
    for (var iso = gt(from, START_DATE) ? from : START_DATE; lt(iso, today); iso = addDaysISO(iso, 1)) {
      if (isRestDay(iso)) continue;
      for (final it in realSched(iso)) {
        if (!schedDone(it)) owed.add(it.key);
      }
    }
    return owed.length;
  }

  SchedItem? firstOwed() {
    final today = todayISO(), from = firstActivityISO();
    if (from == null) return null;
    for (var iso = gt(from, START_DATE) ? from : START_DATE; lt(iso, today); iso = addDaysISO(iso, 1)) {
      if (isRestDay(iso)) continue;
      for (final x in realSched(iso)) {
        if (!schedDone(x)) return x;
      }
    }
    return null;
  }

  /// completed | partial | missed | today | upcoming | rest
  String dayStatus(String iso) {
    final today = todayISO();
    if (isRestDay(iso) && ge(iso, START_DATE)) return 'rest';
    if (gt(iso, today)) return 'upcoming';
    if (iso == today) return 'today';
    final sched = realSched(iso);
    if (sched.isNotEmpty) {
      final done = sched.where(schedDone).length;
      if (done == sched.length) return 'completed';
      if (done > 0 || dayActivity(iso).any) return 'partial';
      return 'missed';
    }
    final a = dayActivity(iso);
    if (a.sealed) return 'completed';
    if (a.any) return 'partial';
    return 'missed';
  }

  // ---------- the one next action ----------
  List<String> reviewsDue() {
    final today = todayISO();
    final review = _map(S['review']);
    final keys = review.keys.where((k) {
      final st = lessons[k];
      return st is Map && truthy(st['verified']) && le(_map(review[k])['due'].toString(), today);
    }).toList();
    keys.sort((a, b) => _map(review[a])['due'].toString().compareTo(_map(review[b])['due'].toString()));
    return keys;
  }

  NextAction nextAction() {
    final real = realSched(todayISO());
    SchedItem? nextUp;
    for (final it in real) {
      if (!schedDone(it)) {
        nextUp = it;
        break;
      }
    }
    final due = reviewsDue();
    if (nextUp != null) return lectureAction(nextUp, real, false);
    if (due.isNotEmpty) {
      return NextAction('recall', title: '${due.length} lecture${due.length == 1 ? '' : 's'} due', code: 'RECALL');
    }
    if (real.isNotEmpty) {
      SchedItem? ahead = backlogCount() > 0 ? firstOwed() : null;
      if (ahead == null) {
        for (final it in realSched(addStudyDays(todayISO(), 1))) {
          if (!schedDone(it)) {
            ahead = it;
            break;
          }
        }
      }
      if (ahead != null) return lectureAction(ahead, real, true);
    }
    return idleAction();
  }

  NextAction lectureAction(SchedItem nextUp, List<SchedItem> real, bool workAhead) {
    final nk = nextUp.key;
    final root = lockRoot(nextUp.cid!, nextUp.ui!, nextUp.li!);
    final watchedOpen = truthy(_map(lessons[nk])['done']) && hasQuiz(nk) && !quizPassed(nk);
    if (root != null || watchedOpen) {
      final cid = root?.cid ?? nextUp.cid!, ui = root?.ui ?? nextUp.ui!, li = root?.li ?? nextUp.li!;
      final t = root != null ? (root.l['t'] as String? ?? '') : nextUp.title;
      final seen = truthy(_map(lessons[lessonKey(cid, ui, li)])['done']);
      return NextAction('quiz', cid: cid, ui: ui, li: li, title: t, code: root?.code ?? nextUp.code ?? '', seen: seen);
    }
    return NextAction('lecture',
        cid: nextUp.cid, ui: nextUp.ui, li: nextUp.li, title: nextUp.title, code: nextUp.code ?? '', workAhead: workAhead);
  }

  NextAction idleAction() {
    final last = settings['lastLesson'];
    if (last is Map) {
      return NextAction('resume',
          cid: last['cid'] as String?, ui: (last['ui'] as num?)?.toInt(), li: (last['li'] as num?)?.toInt(),
          title: last['label']?.toString() ?? '', code: 'RESUME');
    }
    if (isRestDay(todayISO()) && ge(todayISO(), START_DATE)) return const NextAction('rest', code: 'REST');
    return const NextAction('none', code: 'TODAY');
  }

  // ---------- T-056 r2: the revision week ----------
  String firstSunday() => addDaysISO(START_DATE, (7 - dowOf(START_DATE)) % 7);

  ({int r, String from, String to, String sun}) revisionWeek(int r) {
    final sun = addDaysISO(firstSunday(), 7 * r);
    return (r: r, from: r == 1 ? START_DATE : addDaysISO(sun, -7), to: prevStudyDay(sun), sun: sun);
  }

  int revisionWeekOf(String iso) {
    final w = (daysBetween(firstSunday(), iso) / 7).ceil();
    return w < 1 ? 1 : w;
  }

  /// app.js isSealDay: every Sunday from the first revision Sunday on.
  bool isSealDay(String iso) => dowOf(iso) == 0 && ge(iso, revisionWeek(1).sun);

  /// The week sealed for revision week [r] (V.review's rule: a week sealed
  /// under an earlier start can carry the same number, so it counts only if
  /// it was sealed on or after this week began), or null.
  Map<String, dynamic>? sealedWeek(int r) {
    final from = revisionWeek(r).from;
    for (final x in (S['weeks'] as List? ?? const [])) {
      if (x is! Map) continue;
      final w = x['week'];
      final n = w is num ? w : num.tryParse('$w');
      if (n == r && ge((x['date'] ?? '').toString(), from)) return x.cast<String, dynamic>();
    }
    return null;
  }

  /// app.js weekRowFor's week: a rest day belongs to the week just worked.
  int weekOf(String iso) {
    final i = studyIndex(iso) >= 0 ? studyIndex(iso) : studyIndex(prevStudyDay(iso));
    final w = fdiv(i < 0 ? 0 : i, STUDY_WEEK) + 1;
    return w < 1 ? 1 : w;
  }

  // ---------- the gates (T-038) ----------
  /// app.js gateRec: a gate's stored record in any of its shapes.
  ({String? date, String? at, bool passed}) gateRec(Object? raw, int n) {
    if (raw is Map) {
      final date = truthy(raw['date']) ? raw['date'].toString() : null;
      final at = truthy(raw['at']) ? raw['at'].toString() : null;
      return (date: date, at: at, passed: raw['passed'] == true && date != null);
    }
    String midnight(String iso) => DateTime(int.parse(iso.substring(0, 4)), int.parse(iso.substring(5, 7)), int.parse(iso.substring(8, 10)))
        .toUtc()
        .toIso8601String();
    if (raw is String && RegExp(r'^\d{4}-\d\d-\d\d$').hasMatch(raw)) return (date: raw, at: midnight(raw), passed: true);
    if (raw == true) {
      String? ts;
      final ledgers = [S['ledger'], ..._map(S['foreignLedgers']).values];
      for (final l in ledgers) {
        if (l is! List) continue;
        for (final e in l) {
          if (e is Map && e['type'] == 'gate' && e['ref'] == 'gate$n' && e['data'] is Map && truthy((e['data'] as Map)['passed']) &&
              truthy(e['ts']) && (ts == null || e['ts'].toString().compareTo(ts) > 0)) {
            ts = e['ts'].toString();
          }
        }
      }
      return ts != null
          ? (date: localISO(DateTime.parse(ts).toLocal()), at: ts, passed: true)
          : (date: START_DATE, at: midnight(START_DATE), passed: true);
    }
    return (date: null, at: null, passed: false);
  }

  /// app.js gatePlan: each gate's target is the previous gate's completion date
  /// (its target while still open) plus this gate's duration in study days.
  List<({int n, String label, String target, String? doneDate})> gatePlan() {
    var base = START_DATE;
    final gates = _map(S['gates']);
    return [
      for (final g in D.gates)
        () {
          final n = (g['n'] as num).toInt();
          final rec = gateRec(gates['$n'], n);
          final doneDate = rec.passed ? rec.date : null;
          final target = addStudyDays(base, ((g['months'] as num) * 30.4).round());
          base = doneDate ?? target;
          return (n: n, label: (g['label'] ?? '').toString(), target: target, doneDate: doneDate);
        }(),
    ];
  }

  /// The open gate whose target is [iso] (the calendar's diamond), or null.
  ({int n, String label, String target, String? doneDate})? gateOn(String iso) {
    for (final g in gatePlan()) {
      if (g.doneDate == null && g.target == iso) return g;
    }
    return null;
  }

  // ---------- Monk Mode (T-052, T-054, T-057, T-062) ----------
  static const MONK = (from: '2026-11-01', days: 21, url: 'https://claude.ai/artifact/44WXCMiUaxiwt6jebgcS2Z');
  static const MONK_SYNCS = false;

  int? monkDay(String iso) {
    final n = daysBetween(MONK.from, iso) + 1;
    return n >= 1 && n <= MONK.days ? n : null;
  }

  static const PRAYER_METHOD = (fajr: 17.7, maghrib: 4.5, isha: 14, combine: true);

  static List<({String k, String label, String at, int mins})> monkSlots([bool combine = true]) => combine
      ? const [
          (k: 'fajr', label: 'Fajr', at: 'fajr', mins: 15),
          (k: 'dhuhrAsr', label: 'Dhuhr & Asr', at: 'dhuhr', mins: 25),
          (k: 'maghribIsha', label: 'Maghrib & Isha', at: 'maghrib', mins: 25),
        ]
      : [
          for (final p in const [['fajr', 'Fajr'], ['dhuhr', 'Dhuhr'], ['asr', 'Asr'], ['maghrib', 'Maghrib'], ['isha', 'Isha']])
            (k: p[0], label: p[1], at: p[0], mins: 15),
        ];

  static const MONK_GERMAN = [('podcast', 'Podcast', 45), ('speak', 'Speak', 10), ('write', 'Write', 10), ('read', 'Read', 25)];
  static const MONK_PRI = [
    ('prayers', 'Prayer on time'), ('nosin', 'No sin today'), ('work', 'Work 10 h'), ('bfh', 'Brickford 3 h'), ('german', 'German 1.5 h'),
  ];

  static bool mkHabitDone(Map<String, dynamic> d, String k) {
    if (k == 'german') {
      final g = d['german'];
      return truthy(g) && g is Map && MONK_GERMAN.every((x) => truthy(g[x.$1]));
    }
    return truthy(d[k]);
  }

  static int mkPrayed(Map<String, dynamic> d, [bool combine = true]) {
    final p = d['prayers'];
    return monkSlots(combine).where((s) => truthy(p) && p is Map && truthy(p[s.k])).length;
  }

  static bool mkHours(Map<String, dynamic> d, String k, num h) => d[k] is num && (d[k] as num) >= h;

  static bool mkPriDone(Map<String, dynamic> d, String k, [bool combine = true]) {
    if (k == 'prayers') return mkPrayed(d, combine) == monkSlots(combine).length;
    if (k == 'nosin') return d['nosin'] == true;
    if (k == 'work') return mkHours(d, 'work', 10);
    if (k == 'bfh') return mkHours(d, 'bfh', 3);
    return mkHabitDone(d, k);
  }

  static ({int done, int n, int pct}) monkScore(Map<String, dynamic>? d, [bool combine = true]) {
    final dd = d ?? <String, dynamic>{};
    final done = MONK_PRI.where((p) => mkPriDone(dd, p.$1, combine)).length, n = MONK_PRI.length;
    return (done: done, n: n, pct: (100 * done / n).round());
  }

  // ---------- writes ----------

  /// The lesson page's "Mark watched" toggle (app.js act === "toggleDone").
  void toggleDone(String k) {
    final st = lessons[k] is Map ? _map(lessons[k]) : <String, dynamic>{'done': false, 'notes': '', 'checks': <dynamic>[]};
    st['done'] = !truthy(st['done']);
    if (truthy(st['done'])) {
      st['doneAt'] = todayISO();
    } else {
      if (truthy(st['doneAt'])) st['firstDoneAt'] = firstWatched(st);
      st.remove('doneAt');
    }
    lessons[k] = st;
  }
}
