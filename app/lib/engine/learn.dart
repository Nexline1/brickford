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
