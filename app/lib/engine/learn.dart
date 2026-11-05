// Atlas, Recall, Drill and Electives as derived data (T-064 stage 6a): app.js
// V.atlas with courseSets, studyPos, planDrift and courseMastery; the spaced-review
// scheduler (BOXES, scheduleReview, the recall grading) and V.recall's lists;
// V.drill's pick; V.electives with currentPhase. Ported line for line and derived on
// every read; nothing here is stored but S.review and S.electives, in the web
// app's shape, so the stage-3 merge (the later `last` wins) carries them as it is.
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dart:math' as math;

import 'dates.dart';
import 'engine.dart';
import 'problems.dart' show stableSorted;
import 'quiz.dart';
import 'record.dart';

Map<String, dynamic> _m(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};

// ---------- Atlas ----------

const _MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const NUM_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/// A plan date as the route prints it: "Dec 2026" under a node, "April 2030" in the header.
String monthLabel(String iso, [bool long = false]) {
  final m = _MONTHS[int.parse(iso.substring(5, 7)) - 1];
  return '${long ? m : m.substring(0, 3)} ${iso.substring(0, 4)}';
}

/// A passed gate on the route: "Passed 9 Oct".
String passedLabel(String iso) => 'Passed ${int.parse(iso.substring(8, 10))} ${_MONTHS[int.parse(iso.substring(5, 7)) - 1].substring(0, 3)}';

/// The projection against the baseline, in words: months once it is half a month or more.
String driftWords(int days) {
  final a = days.abs(), m = (a / 30.44).round();
  return '${m >= 1 ? '$m month${m == 1 ? '' : 's'}' : '$a day${a == 1 ? '' : 's'}'}${days > 0 ? ' ahead' : ' behind'}';
}

String capFirst(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

class AtlasNode {
  const AtlasNode(this.label, this.when, {required this.done, required this.next, required this.past, required this.cur});
  final String label, when;
  final bool done, next, past, cur;
}

class AtlasTile {
  const AtlasTile(this.id, this.code, this.title, this.n, this.of, this.pct, {required this.tracker});
  final String id, code, title;
  final int n, of, pct;
  final bool tracker;

  /// The web tile's line: "3 of 12 proven", or "40 of 150 problems" on the tracker.
  String get meta => tracker ? '$n of $of problems' : '$n of $of proven';
}

class AtlasChip {
  const AtlasChip(this.id, this.code, this.week);
  final String id, code;
  final int? week;
  String get text => '$code ${week != null ? 'week $week' : 'later'}';
}

class NextGate {
  const NextGate(this.k, this.of, this.label, this.reqs, this.daysLeft);
  final int k, of, daysLeft;
  final String label;
  final List<String> reqs;
}

class AtlasData {
  const AtlasData({
    required this.sub,
    required this.base,
    required this.nodes,
    required this.pin,
    required this.pinEnd,
    required this.fill,
    required this.f,
    required this.next,
    required this.tiles,
    required this.later,
  });
  final String sub;
  final String? base;
  final List<AtlasNode> nodes;
  final String pin;
  final bool pinEnd;
  final double fill, f;
  final NextGate? next;
  final List<AtlasTile> tiles;
  final List<AtlasChip> later;
}

final _startCache = Expando<Map<String, int>>();

extension LearnEngine on Engine {
  /// app.js studyPos: which study day a date belongs to (a rest day counts as the day before).
  int studyPos(String iso) {
    if (le(iso, START_DATE)) return 0;
    var d = iso;
    for (var g = 0; g < 14 && studyIndex(d) < 0; g++) {
      d = addDaysISO(d, -1);
    }
    return math.max(0, studyIndex(d));
  }

  /// The study day each course's first lecture is scheduled on, read from the schedule itself.
  Map<String, int> courseStartDays() => _startCache[this] ??= () {
    final out = <String, int>{};
    for (var d = 0; d <= 400; d++) {
      for (final it in scheduledFor(dateForStudy(d))) {
        if (it.cid != null && !out.containsKey(it.cid)) out[it.cid!] = d;
      }
      if (out.length >= D.courses.length) break;
    }
    return out;
  }();

  /// What is running and what opens later; later courses come in the order they open.
  ({Map<String, int> starts, List<Map<String, dynamic>> running, List<Map<String, dynamic>> later}) courseSets() {
    final starts = courseStartDays();
    final t = todayISO();
    final dNow = lt(t, START_DATE) ? -1 : studyPos(t);
    final running = [
      for (final c in D.courses)
        if (truthy(c['tracker']) || (starts[c['id']] != null && starts[c['id']]! <= dNow)) c,
    ];
    final later = stableSorted(
      D.courses.where((c) => !running.contains(c)),
      (a, b) => (starts[a['id']] ?? 1000000000).compareTo(starts[b['id']] ?? 1000000000),
    );
    return (starts: starts, running: running, later: later);
  }

  int? opensWeek(Map<String, int> starts, Map<String, dynamic> c) => starts[c['id']] == null ? null : starts[c['id']]! ~/ Engine.STUDY_WEEK + 1;

  /// app.js courseMastery: proven lectures (60%) and the best exam (40%), a percentage.
  int courseMastery(Map<String, dynamic> c) {
    final quiz = c['quiz'] is String ? c['quiz'] as String : null;
    if (truthy(c['tracker'])) {
      final p = dsaCount() / 150;
      final q = quiz == null ? null : bestQuiz(quiz);
      return ((q == null ? p : p * 0.6 + (q / 100) * 0.4) * 100).round();
    }
    final s = courseLessonStats(c);
    final lr = s.total > 0 ? s.verified / s.total : 0.0;
    final q = quiz == null ? null : bestQuiz(quiz);
    return ((q == null ? lr : lr * 0.6 + (q / 100) * 0.4) * 100).round();
  }

  /// app.js planDrift: the last gate's date against the baseline (every gate on its own target).
  ({String projected, String baseline, int aheadDays}) planDrift() {
    final plan = gatePlan();
    final last = plan.last;
    final months = D.gates.fold<num>(0, (a, g) => a + (g['months'] as num));
    final baseline = addStudyDays(START_DATE, (months * 30.4).round());
    final projected = last.doneDate ?? last.target;
    return (projected: projected, baseline: baseline, aheadDays: daysBetween(projected, baseline));
  }

  /// A gate's requirement line, as the data has it (gatePlan carries only the label).
  String gateReq(int n) {
    for (final g in D.gates) {
      if ((g['n'] as num).toInt() == n) return (g['req'] ?? '').toString();
    }
    return '';
  }

  /// V.atlas, without the HTML: the route, the next gate, what is running, what opens later.
  AtlasData atlas() {
    final gates = gatePlan();
    final drift = planDrift();
    final today = todayISO();
    final sets = courseSets();
    final ngi = gates.indexWhere((g) => g.doneDate == null);
    final ng = ngi < 0 ? null : gates[ngi];
    final k = ng != null ? ngi + 1 : 0;
    var f = 1.0, fill = 1.0;
    if (k > 0) {
      final prev = k > 1 ? gates[k - 2] : null;
      final a = studyPos(prev != null ? (prev.doneDate ?? prev.target) : START_DATE);
      final b = studyPos(gates[k - 1].target);
      f = b > a ? math.min(1.0, math.max(0.0, (studyPos(today) - a) / (b - a))) : 0.0;
      fill = (k - 1 + f) / gates.length;
    }
    final raw = [
      ('Start', monthLabel(START_DATE), true),
      for (final g in gates) (g.label, g.doneDate != null ? passedLabel(g.doneDate!) : monthLabel(g.target), g.doneDate != null),
    ];
    final last = k > 0 ? k - 1 : raw.length - 1;
    final nodes = [
      for (final (i, n) in raw.indexed) AtlasNode(n.$1, n.$2, done: n.$3, next: k > 0 && i == k, past: i <= last, cur: i == last),
    ];
    final pin = lt(today, START_DATE) ? 'Starts ${monthLabel(START_DATE)}' : 'You are here · day ${studyPos(today) + 1}';
    NextGate? next;
    if (ng != null) {
      next = NextGate(k, gates.length, ng.label, gateReq(ng.n).split(' · ').map(capFirst).toList(), math.max(0, daysBetween(today, ng.target)));
    }
    return AtlasData(
      sub: 'Your route to ${monthLabel(drift.projected, true)}, in ${gates.length < NUM_WORDS.length ? NUM_WORDS[gates.length] : '${gates.length}'} gates.',
      base: drift.aheadDays != 0 ? 'Plan baseline ${monthLabel(drift.baseline, true)} · ${driftWords(drift.aheadDays)}' : null,
      nodes: nodes,
      pin: pin,
      pinEnd: fill > 0.5,
      fill: fill,
      f: f,
      next: next,
      tiles: [
        for (final c in sets.running)
          () {
            final tracker = truthy(c['tracker']);
            final st = tracker ? null : courseLessonStats(c);
            return AtlasTile('${c['id']}', '${c['code']}', '${c['title']}', tracker ? dsaCount() : st!.verified, tracker ? 150 : st!.total, courseMastery(c), tracker: tracker);
          }(),
      ],
      later: [for (final c in sets.later) AtlasChip('${c['id']}', '${c['code']}', opensWeek(sets.starts, c))],
    );
  }

  /// A unit's counts as the course page prints them: lectures watched, and the total.
  List<({String name, int done, int total})> unitCounts(String cid) {
    final c = D.course(cid);
    final units = (c?['units'] as List?) ?? const [];
    return [
      for (var ui = 0; ui < units.length; ui++)
        () {
          final ls = units[ui]['lessons'] as List;
          var dn = 0;
          for (var li = 0; li < ls.length; li++) {
            if (truthy(_m(lessons[lessonKey(cid, ui, li)])['done'])) dn++;
          }
          return (name: '${units[ui]['name']}', done: dn, total: ls.length);
        }(),
    ];
  }
}

// ---------- spaced recall (app.js BOXES, scheduleReview, V.recall) ----------

/// A verified lecture comes back on a widening schedule: days until the next check, by box.
const BOXES = [2, 7, 21, 60, 120];

typedef LessonLabel = ({String code, String cid, int ui, int li, String title});

class RecallItem {
  const RecallItem(this.k, this.label, this.box, this.lapses, this.due);
  final String k;
  final LessonLabel label;
  final int box, lapses;
  final String due;

  /// The web pill: "interval 7d · 2 lapses".
  String get pill => 'interval ${BOXES[box.clamp(0, BOXES.length - 1)]}d${lapses > 0 ? ' · $lapses lapse${lapses == 1 ? '' : 's'}' : ''}';
  bool get crimson => lapses > 1;
}

class RecallData {
  const RecallData({required this.dueN, required this.scheduled, required this.due, required this.next});

  /// Everything due (the count), and every verified lecture in the rotation.
  final int dueN, scheduled;

  /// The first eight due, then up to six coming up (nearest first). Unknown keys are left out, as on the web.
  final List<RecallItem> due, next;
}

typedef BankQ = ({String bankId, int idx});

extension ReviewEngine on Engine {
  Map<String, dynamic> get review => _m(S['review']);

  /// app.js lessonLabel: a lecture key as its course code, place and title; null when it names no lecture.
  LessonLabel? lessonLabel(String k) {
    final parts = k.split('.');
    if (parts.length != 3) return null;
    final c = D.course(parts[0]);
    final ui = int.tryParse(parts[1]), li = int.tryParse(parts[2]);
    final units = (c?['units'] as List?) ?? const [];
    if (c == null || ui == null || li == null || ui < 0 || ui >= units.length) return null;
    final ls = units[ui]['lessons'] as List;
    if (li < 0 || li >= ls.length) return null;
    return (code: '${c['code']}', cid: parts[0], ui: ui, li: li, title: '${ls[li]['t']}');
  }

  /// app.js scheduleReview: box [box] (clamped), due BOXES[box] days from today, lapses kept.
  void scheduleReview(String k, num? box) {
    final b = math.max(0, math.min(BOXES.length - 1, (box == null || box.isNaN ? 0 : box).toInt()));
    final prev = review[k] is Map ? _m(review[k]) : const <String, dynamic>{};
    review[k] = {
      'box': b,
      'due': addDaysISO(todayISO(), BOXES[b]),
      'last': todayISO(),
      'lapses': truthy(prev['lapses']) ? prev['lapses'] : 0,
    };
  }

  /// The recall grading (app.js [data-recall] handler): forgetting resets the interval and counts a lapse,
  /// shaky holds the box, solid moves one box out. One `recall` event on the chain. False when [k] is not in the rotation.
  bool gradeRecall(String k, String grade, String ts) {
    final rv = review[k];
    if (rv is! Map) return false;
    final r = _m(rv);
    final lapses = r['lapses'] is num ? (r['lapses'] as num).toInt() : 0;
    final box = r['box'] is num ? (r['box'] as num).toInt() : 0;
    if (grade == 'forgot') {
      r['lapses'] = lapses + 1;
      scheduleReview(k, 0);
      review[k]['lapses'] = lapses + 1;
    } else if (grade == 'shaky') {
      scheduleReview(k, r['box'] is num ? r['box'] as num : null);
      review[k]['lapses'] = lapses;
    } else {
      scheduleReview(k, box + 1);
      review[k]['lapses'] = lapses;
    }
    logEvent('recall', k, {'grade': grade, 'box': review[k]['box']}, ts);
    return true;
  }

  /// V.recall's lists: what is due now and what comes up next.
  RecallData recallData() {
    final today = todayISO();
    final dueKeys = reviewsDue();
    String dueOf(String k) => _m(review[k])['due'] is String ? _m(review[k])['due'] as String : '';
    final all = review.keys.where((k) => truthy(_m(lessons[k])['verified'])).toList();
    final nextKeys = stableSorted(all.where((k) => dueOf(k).isNotEmpty && dueOf(k).compareTo(today) > 0), (a, b) => dueOf(a).compareTo(dueOf(b))).take(6);
    RecallItem? item(String k) {
      final L = lessonLabel(k);
      if (L == null) return null;
      final rv = _m(review[k]);
      return RecallItem(k, L, rv['box'] is num ? (rv['box'] as num).toInt() : 0, rv['lapses'] is num ? (rv['lapses'] as num).toInt() : 0, dueOf(k));
    }

    return RecallData(
      dueN: dueKeys.length,
      scheduled: all.length,
      due: [for (final k in dueKeys.take(8)) ?item(k)],
      next: [for (final k in nextKeys) ?item(k)],
    );
  }

  // ---------- the Drill (app.js V.drill) ----------

  /// The questions you have missed that are unlocked (a miss on a lecture not yet reached is not served).
  List<BankQ> drillMisses() => [
    for (final p in missPool())
      if (questionUnlocked(p.bankId, _m(((D.quizzes[p.bankId] as Map)['questions'] as List)[p.idx]))) p,
  ];

  /// Ten of them at random; under five, padded from material already taught (every unlocked question of every
  /// bank, never a course not yet opened) up to ten, with no question twice.
  List<BankQ> drillPick(double Function() rand) {
    final pool = shuffled(drillMisses(), rand).take(10).toList();
    if (pool.length < 5) {
      final have = {for (final p in pool) '${p.bankId}|${p.idx}'};
      final all = shuffled<BankQ>([
        for (final b in D.quizzes.keys)
          for (final i in unlockedIdx(b)) (bankId: b, idx: i),
      ], rand);
      for (final p in all) {
        if (pool.length >= 10) break;
        if (have.add('${p.bankId}|${p.idx}')) pool.add(p);
      }
    }
    return pool;
  }

  /// A finished drill: right answers leave the miss pool, wrong ones stay in it (updateMisses per bank).
  void recordDrill(List<BankQ> pool, BankSitting s) {
    final byBank = <String, ({List<int> m, List<int> c})>{};
    for (final j in s.missedBank) {
      byBank.putIfAbsent(pool[j].bankId, () => (m: <int>[], c: <int>[])).m.add(pool[j].idx);
    }
    for (final j in s.correctBank) {
      byBank.putIfAbsent(pool[j].bankId, () => (m: <int>[], c: <int>[])).c.add(pool[j].idx);
    }
    byBank.forEach((b, v) => updateMisses(b, v.m, v.c));
  }
}
