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
// ignore: avoid_relative_lib_imports
import '../lib/engine/merge.dart';
// ignore: avoid_relative_lib_imports
import '../lib/engine/monk.dart';

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

  final heavy = fx['light'] != true; // a light plant (merge, monk) skips the plan, fixtures and calendar

  // ---- the plan itself: no state, no clock dependence ----
  if (heavy) {
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
  for (final f in heavy ? fx['fixtures'] as List : const []) {
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
  for (final f in heavy ? fx['fixtures'] as List : const []) {
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

  // ---- sync (T-064 stage 3): mergeState over each fixture, and the payload ----
  dynamic copy(Object? v) => jsonDecode(jsonEncode(v));
  dynamic strip(Object? v) => v is Map
      ? {for (final en in v.entries) if (en.value != null) en.key: strip(en.value)}
      : v is List
      ? [for (final x in v) strip(x)]
      : v;
  Map<String, dynamic> project(Engine e) => {
    for (final k in ['lessons', 'studyDays', 'problems', 'psets', 'electives', 'labs', 'diag', 'quizAttempts', 'weeks', 'review', 'concepts', 'anchors', 'reps', 'foreignLedgers', 'gates', 'monk'])
      k: e.S[k],
    'streakFrom': e.settings['streakFrom'],
  };
  out['merge'] = {
    for (final f in fx['merge'] as List)
      f['name'] as String: () {
        final e = Engine(data, copy(f['local']) as Map<String, dynamic>, today: () => fx['planClock'] as String);
        final n = mergeState(e, copy(f['remote']));
        return {'changed': n, 'state': strip(copy(project(e)))};
      }(),
  };
  out['payload'] = {
    for (final f in fx['payload'] as List)
      f['name'] as String: () {
        final e = Engine(data, copy(f['local']) as Map<String, dynamic>, today: () => fx['planClock'] as String);
        final p = copy(syncPayload(e)) as Map<String, dynamic>..remove('updatedAt');
        return strip(p);
      }(),
  };

  // ---- Monk Mode (T-064 stage 3): prayer times, the day plan, sums and focus ----
  final mk = fx['monk'] as Map<String, dynamic>;
  final monkDays = (mk['days'] as Map).cast<String, dynamic>();
  out['monk'] = {
    'times': {
      for (final d in (mk['dates'] as List).cast<String>())
        d: () {
          final t = monkPrayerTimes(d);
          return {'raw': t, 'hhmm': {for (final en in t.entries) en.key: mkHHMM(en.value)}};
        }(),
    },
    'plan': {
      for (final d in (mk['dates'] as List).cast<String>())
        d: [for (final ev in monkPlanFor(d)) '${mkHHMM(ev.start)}-${mkHHMM(ev.end)} ${ev.kind} ${ev.title}'],
    },
    'slots': [for (final s in Engine.monkSlots()) '${s.k}|${s.label}|${s.at}|${s.mins}'],
    'sums': {
      for (final d in (mk['sumDates'] as List).cast<String>())
        d: {'week': monkWeekSums(monkDays, d), 'month': monkMonthSums(monkDays, d), 'weekStart': monkWeekStart(d)},
    },
    'focus': {
      for (final d in (mk['focusDates'] as List).cast<String>())
        d: () {
          final f = monkFocus(monkDays, d);
          return f == null ? null : {'days': f.days, 'key': f.key, 'label': f.label, 'rate': f.rate, 'fix': f.fix};
        }(),
    },
    'phoneOk': [for (final d in (mk['phones'] as List)) mkPhoneOk(d == null ? <String, dynamic>{} : (d as Map).cast<String, dynamic>())],
  };
  stdout.write(jsonEncode(out));
}
