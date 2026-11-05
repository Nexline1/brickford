// engine_dump.dart — the Dart engine's answers, as JSON, for tools/verify-app.js.
//
//   dart run app/tool/engine_dump.dart <data dir> <fixtures.json>
//
// verify-app.js writes the fixtures (state + clock, the date range, the extra
// probes), runs app.js over the same file in a browser, runs this, and
// compares the two outputs key by key. The encoding of a schedule (schedKey)
// is mirrored in verify-app.js; everything else is plain JSON values.
//
// Relative imports only (no package: URIs), so the engine can be copied to a
// scratch folder with a planted change and run there, which is how the gate
// proves it fails.
import 'dart:convert';
import 'dart:io';

// ignore: avoid_relative_lib_imports
import '../lib/engine/engine.dart';

String schedKey(List<SchedItem> items) => items
    .map((it) => '${it.track}:${it.key}${it.dayN != null || it.spanN != null ? '@${it.dayN}/${it.spanN}' : ''}')
    .join(' ');

void main(List<String> args) {
  final dir = args[0];
  final fx = jsonDecode(File(args[1]).readAsStringSync()) as Map<String, dynamic>;
  final text = {for (final f in BrickfordData.files) f: File('$dir/$f').readAsStringSync()};
  final data = BrickfordData.fromText(text);
  final dates = (fx['dates'] as List).cast<String>();
  final out = <String, dynamic>{};

  // ---- the plan itself: no state, no clock dependence ----
  {
    final e = Engine(data, null, today: () => fx['planClock'] as String);
    out['plan'] = {
      'START_DATE': e.START_DATE,
      'REST_DOW': Engine.REST_DOW,
      'QUIZ_GATE_FROM': Engine.QUIZ_GATE_FROM,
      'MONK': {'from': Engine.MONK.from, 'days': Engine.MONK.days},
      'MONK_PRI': [for (final p in Engine.MONK_PRI) p.$1],
      'dateForStudy': [for (var i = 0; i < (fx['studyN'] as int); i++) e.dateForStudy(i)],
      'studyIndex': [for (final d in dates) e.studyIndex(d)],
      'prevStudyDay': [for (final d in dates) e.prevStudyDay(d)],
      'addStudyDays': [for (final p in fx['addStudy'] as List) e.addStudyDays(p[0] as String, p[1] as int)],
      'revisionWeek': [
        for (var r = 1; r <= (fx['revisionWeeks'] as int); r++)
          () {
            final w = e.revisionWeek(r);
            return '${w.from}..${w.to}@${w.sun}';
          }(),
      ],
      'monkDay': [for (final d in dates) e.monkDay(d)],
      'monkScore': [
        for (final d in fx['monkDays'] as List)
          () {
            final s = Engine.monkScore(d == null ? null : (d as Map).cast<String, dynamic>());
            return [s.done, s.n, s.pct];
          }(),
      ],
    };
  }

  // ---- each fixture: its own state and clock ----
  final fixtures = <String, dynamic>{};
  for (final f in fx['fixtures'] as List) {
    final name = f['name'] as String;
    final state = (jsonDecode(jsonEncode(f['state'])) as Map?)?.cast<String, dynamic>();
    var now = f['clock'] as String;
    final e = Engine(data, state, today: () => now);
    final fixed = <String, dynamic>{
      'studyAnchor': e.studyAnchor(),
      'sched': [for (final d in dates) schedKey(e.scheduledFor(d))],
      'status': [for (final d in dates) e.dayStatus(d)],
      'cleared': {for (final k in fx['lessonKeys'] as List) k as String: e.lessonCleared(k)},
      'grandfathered': {
        for (final k in fx['lessonKeys'] as List)
          if (e.lessons[k] is Map) k as String: Engine.grandfathered((e.lessons[k] as Map).cast<String, dynamic>()),
      },
      'streak': e.streak(),
      'bestStreak': e.bestStreak(),
      'backlogCount': e.backlogCount(),
    };
    final walk = <String, List<dynamic>>{'anchor': [], 'today': [], 'streak': [], 'backlog': []};
    for (final t in (f['walk'] as List).cast<String>()) {
      now = t;
      walk['anchor']!.add(e.studyAnchor());
      walk['today']!.add(schedKey(e.scheduledFor(t)));
      walk['streak']!.add(e.streak());
      walk['backlog']!.add(e.backlogCount());
    }
    fixtures[name] = {'fixed': fixed, 'walk': walk};
  }
  out['fixtures'] = fixtures;

  // ---- the calendar (T-064 stage 2): each fixture's state under each calendar clock ----
  final cal = fx['calendar'] as Map<String, dynamic>;
  final calDates = (cal['dates'] as List).cast<String>();
  final calendar = <String, dynamic>{};
  for (final f in fx['fixtures'] as List) {
    for (final clock in (cal['clocks'] as List).cast<String>()) {
      final state = (jsonDecode(jsonEncode(f['state'])) as Map?)?.cast<String, dynamic>();
      final e = Engine(data, state, today: () => clock);
      calendar['${f['name']} @ $clock'] = {
        'status': [for (final d in calDates) e.dayStatus(d)],
        'sched': [for (final d in calDates) schedKey(e.scheduledFor(d))],
        'gates': [for (final g in e.gatePlan()) '${g.n}:${g.target}:${g.doneDate ?? ''}'],
      };
    }
  }
  out['calendar'] = calendar;
  stdout.write(jsonEncode(out));
}
