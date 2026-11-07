// The readable pages (T-064 stage 6b): V.transcript (the standing, the gates and
// setGate, the one write the confirm sheet makes), V.workshop's catalogue,
// V.method's retention curve, V.library's DOCS and LINKS.
//
// PORTED, NOT REDESIGNED: the numbers are app.js's (standing, the overall
// mastery, setGate's order guard); the curve is retentionSVG's arithmetic.
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dart:math' as math;

import 'dates.dart';
import 'engine.dart';
import 'learn.dart';
import 'problems.dart';
import 'quiz.dart';
import 'record.dart';

/// app.js standing: [English, grade].
(String, String) standing(num pct) => pct >= 85
    ? ('Mastered', 'A')
    : pct >= 70
    ? ('Proficient', 'B')
    : pct >= 50
    ? ('Developing', 'C')
    : pct > 0
    ? ('Started', 'D')
    : ('Not begun', '—');

class MasteryRow {
  const MasteryRow(this.code, this.title, this.mastery, this.best, this.standing);
  final String code, title, standing;
  final int mastery;
  final int? best;
}

/// One of the five gates as the Transcript lists it: [left] is the days from today to its target (negative: overdue).
class GateLine {
  const GateLine(this.n, this.label, this.req, this.target, this.doneDate, this.left);
  final int n, left;
  final String label, req, target;
  final String? doneDate;
}

class TranscriptView {
  const TranscriptView({required this.overall, required this.standing, required this.grade, required this.counted, required this.mastered, required this.rows, required this.gates});
  final int overall, counted, mastered;
  final String standing, grade;
  final List<MasteryRow> rows;
  final List<GateLine> gates;

  /// The next gate to pass (null when all are), the last one passed (the one that can be unmarked).
  GateLine? get next => gates.where((g) => g.doneDate == null).firstOrNull;
  GateLine? get lastPassed => gates.where((g) => g.doneDate != null).lastOrNull;
}

class WorkshopGroup {
  const WorkshopGroup(this.title, this.url, this.items);
  final String title, url;
  final List<Map<String, dynamic>> items;
}

class WorkshopView {
  const WorkshopView({required this.phase, required this.labsDone, required this.psetDone, required this.psetTotal, required this.phaseLabs, required this.later, required this.groups});
  final int phase, labsDone, psetDone, psetTotal;
  final List<Map<String, dynamic>> phaseLabs;
  final List<(int, List<Map<String, dynamic>>)> later;
  final List<WorkshopGroup> groups;
}

extension PagesEngine on Engine {
  /// app.js setGate: the one way a gate changes. Only the next open gate can be
  /// passed and only the last one passed can be unmarked; anything else is
  /// refused and changes nothing. The caller saves.
  bool setGate(int n, bool pass, String ts) {
    final plan = gatePlan();
    final open = plan.where((x) => x.doneDate == null).toList(), done = plan.where((x) => x.doneDate != null).toList();
    final g = pass ? (open.isEmpty ? null : open.first) : (done.isEmpty ? null : done.last);
    if (g == null || g.n != n) return false;
    (S['gates'] as Map<String, dynamic>)['$n'] = {'date': pass ? todayISO() : null, 'at': ts, 'passed': pass};
    logEvent('gate', 'gate$n', {'passed': pass}, ts);
    return true;
  }

  /// V.transcript's numbers: the overall mastery of the courses counted in the
  /// current phase, its standing, and each course's row.
  TranscriptView transcript() {
    final ph = currentPhase();
    final counted = [for (final c in D.courses) if (!truthy(c['elective']) && (c['phase'] as num) <= ph) c];
    final overall = counted.isEmpty ? 0 : jsRound(counted.fold<num>(0, (a, c) => a + courseMastery(c)) / counted.length).toInt();
    final (en, grade) = standing(overall);
    final rows = [
      for (final c in D.courses)
        () {
          final m = courseMastery(c);
          final q = c['quiz'] is String ? bestQuiz(c['quiz'] as String) : null;
          return MasteryRow('${c['code']}', '${c['title']}', m, q, standing(m).$1);
        }(),
    ];
    final today = todayISO();
    final gates = [for (final g in gatePlan()) GateLine(g.n, g.label, gateReq(g.n), g.target, g.doneDate, daysBetween(today, g.target))];
    return TranscriptView(overall: overall, standing: en, grade: grade, counted: counted.length, mastered: D.courses.where((c) => courseMastery(c) >= 85).length, rows: rows, gates: gates);
  }

  /// V.workshop's catalogue: this phase's labs, the labs of the other phases, and
  /// the problem sets by source, each with its done count.
  WorkshopView workshop() {
    final labs = _map(S['labs']), psets = _map(S['psets']);
    final phase = currentPhase();
    List<Map<String, dynamic>> labsIn(int ph) => [for (final l in D.labs) if (l['phase'] == ph) l];
    var psetTotal = 0, psetDone = 0;
    for (final g in D.psets) {
      for (final i in g['items'] as List) {
        psetTotal++;
        if (truthy(psets[(i as Map)['id']])) psetDone++;
      }
    }
    return WorkshopView(
      phase: phase,
      labsDone: D.labs.where((l) => truthy(_map(labs[l['id']])['done'])).length,
      psetDone: psetDone,
      psetTotal: psetTotal,
      phaseLabs: labsIn(phase),
      later: [
        for (final ph in [0, 1, 2, 3])
          if (ph != phase && labsIn(ph).isNotEmpty) (ph, labsIn(ph)),
      ],
      groups: [for (final g in D.psets) WorkshopGroup('${g['title']}', '${g['url']}', [for (final i in g['items'] as List) (i as Map).cast<String, dynamic>()])],
    );
  }
}

Map<String, dynamic> _map(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};

/// A lab's description cut to its first clause, and to about fifty characters on
/// a word: never an ellipsis inside a word (app.js firstClause).
String firstClause(String t) {
  var c = t.split(RegExp(r';|,| — |: |\. ')).first.replaceAll(RegExp(r'[.\s]+$'), '');
  if (c.length <= 50) return c;
  c = c.substring(0, 51);
  return '${c.substring(0, c.lastIndexOf(' ')).replaceAll(RegExp(r'[\s,;:(—-]+$'), '')}…';
}

/// V.method's curve (retentionSVG): the same 620x165 plot, as points. [passive]
/// is watch-once, [spaced] recall at widening gaps, [dots] each recall.
class RetentionCurve {
  RetentionCurve._(this.passive, this.spaced, this.dots);
  static const W = 620.0, H = 165.0, pad = 26.0, days = 130;
  final List<(double, double)> passive, spaced, dots;

  static double X(num d) => pad + (d / days) * (W - pad - 10);
  static double Y(num r) => H - pad - (r / 100) * (H - pad - 22);

  factory RetentionCurve() {
    final passive = <(double, double)>[];
    for (var d = 0; d <= days; d += 2) {
      passive.add((_r1(X(d)), _r1(Y(100 * math.exp(-d / 13)))));
    }
    const marks = [0, 2, 9, 30, 90];
    final spaced = <(double, double)>[], dots = <(double, double)>[];
    for (var i = 0; i < marks.length; i++) {
      final m = marks[i], end = i + 1 < marks.length ? marks[i + 1] : days;
      final tau = 13 * (i + 1) * 1.5;
      for (double d = m.toDouble(); d <= end; d += 1.5) {
        spaced.add((_r1(X(d)), _r1(Y(100 * math.exp(-(d - m) / tau)))));
      }
      if (i + 1 < marks.length) spaced.add((_r1(X(end)), _r1(Y(100))));
      if (m > 0) dots.add((_r1(X(m)), _r1(Y(100))));
    }
    return RetentionCurve._(passive, spaced, dots);
  }

  static double _r1(double v) => double.parse(v.toStringAsFixed(1));
}

/// V.workshop's PHASE_NAME.
const phaseNames = ['Phase 0 \u2014 Calibration', 'Phase 1 \u2014 Foundations', 'Phase 2 \u2014 Depth', 'Phase 3 \u2014 Frontier'];

/// The five documents V.library lists (app.js DOCS), the face each card shows
/// (DOC_CARD) and the outside links (LINKS).
const libraryDocs = [
  (id: 'readme', file: '../README.md', title: 'Phase 0 — Calibration Kit', sub: 'The Week 1–2 checklist: exams, diagnostics, setup', card: 'Calibration Kit', cardSub: 'Weeks 1–2 checklist'),
  (id: 'curriculum', file: '../phase-1-curriculum.md', title: 'Phase 1 — Curriculum (Months 1–6)', sub: 'Week-by-week plan + adjustment rules', card: 'Phase 1 curriculum', cardSub: 'Months 1–6, week by week'),
  (id: 'coding', file: '../coding-diagnostic.md', title: 'Coding Diagnostic', sub: 'The no-AI flashcards build + NeetCode 10', card: 'Coding diagnostic', cardSub: 'Flashcards build + NeetCode 10'),
  (id: 'offers', file: '../earning-offers.md', title: 'Earning Offers', sub: 'Three productized offers, Arabic pitch included', card: 'Earning offers', cardSub: 'Three offers, Arabic pitch'),
  (id: 'log', file: '../progress-log.md', title: 'Progress Log (file)', sub: 'The original markdown log — the Week page supersedes it', card: 'Progress Log (file)', cardSub: 'The original markdown log — the Week page supersedes it'),
];

const libraryLinks = [
  ('MIT OpenCourseWare', 'https://ocw.mit.edu/'),
  ('3Blue1Brown', 'https://www.3blue1brown.com/'),
  ('Karpathy', 'https://karpathy.ai/zero-to-hero.html'),
  ('NeetCode', 'https://neetcode.io/roadmap'),
  ('fast.ai', 'https://course.fast.ai/'),
  ('ARENA curriculum', 'https://www.arena.education/'),
  ('Mathematics for ML', 'https://mml-book.github.io/'),
  ('Understanding Deep Learning', 'https://udlbook.github.io/udlbook/'),
  ('Stat 110', 'https://stat110.hsites.harvard.edu/'),
  ('nanoGPT', 'https://github.com/karpathy/nanoGPT'),
];

/// app.js md(): the tiny markdown, as blocks a widget can lay out. [kind] is
/// h1 h2 h3 p li quote hr table; a table row's cells are in [cells].
class MdBlock {
  const MdBlock(this.kind, [this.text = '', this.cells = const []]);
  final String kind, text;
  final List<String> cells;
}

List<MdBlock> parseMd(String src) {
  final out = <MdBlock>[];
  for (final raw in src.split(RegExp(r'\r?\n'))) {
    final l = raw.replaceAll(RegExp(r'\s+$'), '');
    final tl = l.trim();
    if (tl.startsWith('|')) {
      final cells = tl.replaceAll(RegExp(r'^\||\|$'), '').split('|').map((c) => c.trim()).toList();
      if (cells.every((c) => RegExp(r'^:?-{2,}:?$').hasMatch(c))) continue;
      out.add(MdBlock('table', '', cells));
    } else if (l.startsWith('### ')) {
      out.add(MdBlock('h3', l.substring(4)));
    } else if (l.startsWith('## ')) {
      out.add(MdBlock('h2', l.substring(3)));
    } else if (l.startsWith('# ')) {
      out.add(MdBlock('h1', l.substring(2)));
    } else if (RegExp(r'^---+$').hasMatch(l)) {
      out.add(const MdBlock('hr'));
    } else if (l.startsWith('> ')) {
      out.add(MdBlock('quote', l.substring(2)));
    } else if (RegExp(r'^[-*] ').hasMatch(l)) {
      out.add(MdBlock('li', l.replaceFirst(RegExp(r'^[-*] (\[[ x]\] )?'), '')));
    } else if (RegExp(r'^\d+\. ').hasMatch(l)) {
      out.add(MdBlock('li', l.replaceFirst(RegExp(r'^\d+\. '), '')));
    } else if (l.isNotEmpty) {
      out.add(MdBlock('p', l));
    }
  }
  return out;
}
