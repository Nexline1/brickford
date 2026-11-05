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
import '../lib/engine/dates.dart';
// ignore: avoid_relative_lib_imports
import '../lib/engine/engine.dart';
// ignore: avoid_relative_lib_imports
import '../lib/engine/learn.dart';
// ignore: avoid_relative_lib_imports
import '../lib/engine/merge.dart';
// ignore: avoid_relative_lib_imports
import '../lib/engine/monk.dart';
// ignore: avoid_relative_lib_imports
import '../lib/engine/problems.dart';
// ignore: avoid_relative_lib_imports
import '../lib/engine/quiz.dart';
// ignore: avoid_relative_lib_imports
import '../lib/engine/record.dart';

String schedKey(List<SchedItem> items) => items
    .map((it) => '${it.track}:${it.key}${it.dayN != null || it.spanN != null ? '@${it.dayN}/${it.spanN}' : ''}')
    .join(' ');

/// The seeded random both sides use for the sitting traces: Math.random replaced by this in the page.
double Function() lcg(int seed) {
  var s = seed;
  return () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/// One scripted sitting (mirrored by driveSitting in verify-app.js): the same
/// answer policy, so the two traces list the same questions, option orders and outcomes.
Map<String, dynamic> runSitting(Map<String, dynamic> f, BrickfordData data, String dir) {
  final mastery = f['mode'] == 'mastery';
  List<dynamic> qs;
  if (f['lecture'] != null) {
    final sm = jsonDecode(File('$dir/summaries.json').readAsStringSync()) as Map<String, dynamic>;
    qs = (sm[f['lecture']] as Map)['checks'] as List;
  } else {
    qs = ((data.quizzes[f['bank']] as Map)['questions'] as List).take(f['take'] as int).toList();
  }
  final rand = lcg(f['seed'] as int);
  final Sitting s = mastery ? MasterySitting(qs, rand: rand) : BankSitting(qs, f['perSitting'] as int?, rand: rand);
  final nth = <int, int>{};
  final trace = <String>[];
  while (!s.over && trace.length < 500) {
    final q = s.q!;
    final bi = s is MasterySitting ? s.bi! : (s as BankSitting).order[s.pos];
    final n0 = nth[bi] ?? 0;
    nth[bi] = n0 + 1;
    final right = bi % 3 != 0 || n0 >= 1;
    final Object given = q['opts'] != null
        ? (right ? q['a'] as int : ((q['a'] as int) == 0 ? 1 : 0))
        : (right ? (bi % 2 == 0 ? '${(qs[bi] as Map)['num']}' : '${(qs[bi] as Map)['num']}'.replaceFirst('.', ',')) : 'zzz');
    final again = s.again;
    final ok = s.answer(given)!;
    final segs = s.seg.map((x) => x == 'ok' ? 'o' : x == 'miss' ? 'm' : '.').join();
    trace.add('$bi:${q['opts'] != null ? (q['perm'] as List).join() : ''}:${again ? 'r' : 'n'}:${ok ? '+' : '-'}${mastery ? ':$segs' : ''}');
    s.next();
  }
  final r = s is MasterySitting
      ? (() {
          final x = s.result!;
          return {'total': x.total, 'firstTry': x.firstTry, 'attempts': x.attempts, 'missed': x.missed};
        })()
      : (() {
          final b = s as BankSitting;
          return {'score': b.score, 'total': b.n, 'pct': b.pct, 'missed': b.missedBank, 'correct': b.correctBank};
        })();
  return {'trace': trace, 'result': r};
}

/// The quiz / Problems / Exams answers (T-064 stage 4).
Map<String, dynamic> quizDump(Map<String, dynamic> fx, BrickfordData data, String dir) {
  final q = fx['quiz'] as Map<String, dynamic>;
  dynamic copy(Object? v) => jsonDecode(jsonEncode(v));
  Engine engine(Map f) => Engine(data, copy(f['state']) as Map<String, dynamic>?, today: () => f['clock'] as String);
  final out = <String, dynamic>{};
  final g = q['grade'] as Map<String, dynamic>;
  out['grade'] = [
    for (final qq in g['qs'] as List) [for (final given in g['given'] as List) gradeAnswer((qq as Map).cast<String, dynamic>(), given)],
  ];
  out['sittings'] = {for (final f in q['sittings'] as List) f['name'] as String: runSitting((f as Map).cast<String, dynamic>(), data, dir)};

  final gate = q['gate'] as Map<String, dynamic>;
  final ge = engine(gate);
  out['gate'] = {
    'cleared': {for (final k in gate['quizKeys'] as List) k as String: ge.lessonCleared(k)},
    'grandfathered': {
      for (final k in gate['quizKeys'] as List)
        if (ge.lessons[k] is Map) k as String: Engine.grandfathered((ge.lessons[k] as Map).cast<String, dynamic>()),
    },
    'passed': {for (final k in gate['quizKeys'] as List) k as String: ge.quizPassed(k)},
    'locked': {
      for (final k in fx['lessonKeys'] as List)
        k as String: (() {
          final p = k.split('.');
          return ge.lockedBy(p[0], int.parse(p[1]), int.parse(p[2])) != null;
        })(),
    },
    'catchUp': [for (final c in ge.catchUpQuizzes()) c.k],
  };

  out['problems'] = {
    for (final f in q['problems'] as List)
      f['name'] as String: (() {
        final e = engine(f as Map);
        final P = e.problemsDue();
        return {
          'due': P.keys,
          'n': P.n,
          'soon': [for (final c in P.coming.take(3)) c.pset != null ? 'pset:${c.pset!['id']}' : 'lab:${c.lab!['id']}'],
          'psetDue': {for (final i in e.allPsets()) i['id'] as String: e.psetDue(i)},
          'labDue': {for (final l in data.labs) l['id'] as String: e.labDue(l)},
        };
      })(),
  };

  out['exams'] = {
    for (final f in q['exams'] as List)
      f['name'] as String: (() {
        final e = engine(f as Map);
        final items = e.examItems();
        final lead = items.first, rest = items.skip(1).toList();
        final rows = <List<String>>[
          [
            'hero',
            lead.href,
            lead.title,
            lead.size,
            lead.due != null ? '${lead.due! < 0 ? 0 : lead.due}' : '',
          ],
          for (final x in rest.where((x) => !x.locked))
            ['card', x.href, x.title, '${x.size}${x.pass != null ? ' \u00b7 pass ${x.pass}%' : ''}', x.tag],
          for (final x in rest.where((x) => x.locked))
            ['lock', x.short, '${x.watched} of ${x.of}${truthy(x.course?['tracker']) ? ' solved' : ' watched'}'],
        ];
        final diagSat = items.where((x) => x.kind == 'diag' && x.sat).length, bankSat = items.where((x) => x.kind == 'bank' && x.sat).length;
        return {
          'rows': rows,
          'rec': '${data.diagnostics.length} diagnostics \u00b7 ${data.quizzes.length} concept banks \u00b7 ${diagSat + bankSat} sat',
        };
      })(),
  };

  // recordQuizPass, updateMisses, bestQuiz: each step's state, from a fresh engine.
  final rec = q['record'] as Map<String, dynamic>;
  final e = Engine(data, null, today: () => '2026-11-04');
  final passes = <dynamic>[];
  for (final p in rec['passes'] as List) {
    e.recordQuizPass(
      rec['key'] as String,
      SittingResult(total: p['total'] as int, firstTry: p['firstTry'] as int, attempts: p['attempts'] as int, missed: const []),
      'AT',
    );
    final quiz = copy((e.lessons[rec['key']] as Map)['quiz']) as Map;
    quiz.remove('at');
    passes.add(quiz);
  }
  final misses = <dynamic>[];
  for (final m in rec['misses'] as List) {
    e.updateMisses(m[0] as String, (m[1] as List).cast<int>(), (m[2] as List).cast<int>());
    misses.add(copy((e.S['quizMisses'] as Map)[m[0]]));
  }
  final be = Engine(data, <String, dynamic>{'quizAttempts': copy(rec['attempts'])}, today: () => '2026-11-04');
  out['record'] = {
    'passes': passes,
    'misses': misses,
    'best': {for (final b in (rec['attempts'] as Map).keys) b as String: be.bestQuiz(b)},
    'bestNone': be.bestQuiz('none'),
  };
  return out;
}

/// The record answers (T-064 stage 5): the ledger chain and its tamper checks,
/// the Week page and the seal, the streak reset and the day seal, the Record
/// page's numbers, and the Treasury sums and formatting.
Map<String, dynamic> recordDump(Map<String, dynamic> fx, BrickfordData data) {
  final R = fx['record'] as Map<String, dynamic>;
  dynamic copy(Object? v) => jsonDecode(jsonEncode(v));
  Engine eng(Map f) => Engine(data, copy(f['state']) as Map<String, dynamic>?, today: () => f['clock'] as String);
  Map<String, dynamic> chain(ChainCheck c) => {'ok': c.ok, 'count': c.count, 'brokenAt': c.brokenAt, 'head': c.head};
  final out = <String, dynamic>{};

  // ---- the ledger: the same events through logEvent, then tampered ----
  final L = R['ledger'] as Map<String, dynamic>;
  final e0 = Engine(data, null, today: () => fx['planClock'] as String);
  final entries = <Map<String, dynamic>>[
    for (final ev in L['events'] as List) copy(e0.logEvent(ev['type'] as String, ev['ref'], ev['data'], ev['ts'] as String)) as Map<String, dynamic>,
  ];
  out['ledger'] = {
    'entries': entries,
    'preimages': [for (final e in entries) preimage(e)],
    'lines': [for (final e in entries) e0.eventLine(e)],
    'verify': chain(e0.verifyChain()),
    'head': e0.chainHead(),
    'tamper': {
      for (final t in L['tamper'] as List)
        t['name'] as String: () {
          final c = copy(entries) as List;
          switch (t['op']) {
            case 'set':
              (c[t['i'] as int] as Map)[t['field']] = t['value'];
            case 'drop':
              c.removeAt(t['i'] as int);
            case 'swap':
              final a = c[t['i'] as int];
              c[t['i'] as int] = c[t['j'] as int];
              c[t['j'] as int] = a;
          }
          return {...chain(verifyEntries(c)), 'text': verifyRecordText(jsonEncode({'entries': c}))};
        }(),
    },
  };
  out['sha'] = {for (final s in R['sha'] as List) s as String: sha256Hex(s)};

  // ---- the Week page ----
  out['weeks'] = {
    for (final f in R['weeks'] as List)
      f['name'] as String: () {
        final v = eng(f).weekView();
        return {
          'w': 'Week ${v.w}',
          'tiles': ['${v.dsa}', '${v.proven}', null, v.counted ? numText(v.earned) : null],
          'dsa': v.dsa,
          'counted': v.counted,
          'revValue': v.counted ? v.earned : null,
          'state': v.state,
          'past': [for (final x in v.past) [x.title, x.date, x.shipped.isEmpty ? 'nothing shipped' : x.shipped, x.metrics, x.notes]],
        };
      }(),
  };
  out['seals'] = {
    for (final f in R['seals'] as List)
      f['name'] as String: () {
        final e = eng(f), i = f['input'] as Map;
        final r = e.sealWeek(shipped: i['shipped'] as String, notes: i['notes'] as String, posts: i['posts'] as num, revenue: i['rev'] as num?, ts: '${f['clock']}T12:00:00.000Z');
        return {'weeks': copy(e.S['weeks']), 'ledger': copy(e.ledger), if (r == null) 'refused': true};
      }(),
  };
  out['refused'] = {
    for (final f in R['refused'] as List)
      f['name'] as String: () {
        final e = eng(f);
        final r = e.sealWeek(shipped: 'x', notes: '', posts: 1, revenue: 1, ts: '${f['clock']}T12:00:00.000Z');
        return {'sealed': r != null, 'weeks': copy(e.S['weeks']), 'ledger': copy(e.ledger)};
      }(),
  };
  out['sealDates'] = {
    for (final d in (R['sealDates'] as List).cast<String>())
      d: {'w': e0.revisionWeekOf(d), 'sealDay': e0.isSealDay(d), 'ready': e0.canSealWeek(d)},
  };
  out['revLectures'] = [for (var n = 1; n <= RecordEngine.revisionPdfs; n++) e0.revisionLectures(n)];

  // ---- the streak reset and the day seal ----
  out['streak'] = {
    for (final f in R['streaks'] as List)
      f['name'] as String: () {
        final e = eng(f), ts = '${f['clock']}T12:00:00.000Z';
        final before = {'streak': e.streak(), 'best': e.bestStreak()};
        e.resetStreak(ts);
        final afterReset = {'streakFrom': e.settings['streakFrom'], 'streak': e.streak(), 'best': e.bestStreak(), 'ledger': copy(e.ledger)};
        e.sealDay(ts);
        return {
          'before': before,
          'afterReset': afterReset,
          'after': {'studyDays': copy(e.S['studyDays']), 'streak': e.streak(), 'best': e.bestStreak(), 'ledger': copy(e.ledger)},
        };
      }(),
  };

  // ---- the Record page ----
  out['record'] = {
    for (final f in R['records'] as List)
      f['name'] as String: () {
        final e = eng(f), today = e.todayISO();
        final lastSunday = addDaysISO(today, -dowOf(today)), first = addDaysISO(lastSunday, -7 * 25);
        final led = e.ledger, c = e.verifyChain();
        return {
          'tiles': ['${e.streak()}', '${e.bestStreak()}', '${e.provenCount()}'],
          'heat': [for (var wk = 0; wk < 26; wk++) for (var d = 0; d < 7; d++) e.heatLevel(addDaysISO(first, 7 * wk + d))],
          'seals': [
            for (final x in led.reversed.take(4)) [e.sealName(x as Map), e.shortHash('${x['hash']}')],
            if (led.isNotEmpty && (led.reversed.take(4).last as Map)['i'] == 0) ['Genesis', 'the first link'],
          ],
          'chain': led.isEmpty ? 'none' : c.ok ? 'ok' : 'broken at ${c.brokenAt}',
        };
      }(),
  };

  // ---- the Treasury ----
  final T = R['treasury'] as Map<String, dynamic>;
  out['treasury'] = {
    'amounts': [
      for (final v in T['amounts'] as List) [fmtBHD(v as num), numText(v), jsRound(v)],
    ],
    'states': {
      for (final f in T['states'] as List)
        f['name'] as String: () {
          final e = eng(f), t = e.treasury;
          return {
            'total': e.revenueTotal(),
            'totalText': e.totalText(),
            'counts': () {
              final cells = [if (e.revenueTotal() > 0) e.totalText(), '${(t['clients'] as List).length} / 2', if ((t['entries'] as List).isNotEmpty) '${(t['entries'] as List).length}'];
              return cells.length > 1 ? cells : <String>[];
            }(),
            'rows': [for (final r in e.ledgerRows()) [r.date, r.amount, r.note]],
            'clients': [for (final r in e.clientRows()) [r.name, r.project, r.price]],
          };
        }(),
    },
  };
  return out;
}

/// Atlas, Recall, Drill and Electives (T-064 stage 6a): the same fixtures app.js renders, as the Dart port sees them.
Map<String, dynamic> learnDump(Map<String, dynamic> fx, BrickfordData data) {
  final L = fx['learn'] as Map<String, dynamic>;
  dynamic copy(Object? v) => jsonDecode(jsonEncode(v));
  Engine eng(Map<String, dynamic> f) => Engine(data, (copy(f['state']) as Map?)?.cast<String, dynamic>(), today: () => f['clock'] as String);
  final out = <String, dynamic>{'atlas': <String, dynamic>{}, 'units': <String, dynamic>{}};

  // ---- the Atlas, and the unit counts of the course pages ----
  for (final f in L['atlas'] as List) {
    final e = eng(f as Map<String, dynamic>);
    final a = e.atlas();
    (out['atlas'] as Map)[f['name']] = {
      'sub': a.sub,
      'base': a.base,
      'nodes': [for (final n in a.nodes) [n.label, n.when, [if (n.done) 'done', if (n.next) 'next', if (n.past) 'past', if (n.cur) 'cur'].join(' ')]],
      'pin': a.pin,
      'pinEnd': a.pinEnd,
      'fill': a.fill.toStringAsFixed(4),
      'f': a.f.toStringAsFixed(4),
      'next': a.next == null ? null : {'k': 'Next gate · ${a.next!.k} of ${a.next!.of}', 'gate': a.next!.label, 'reqs': a.next!.reqs, 'days': '${a.next!.daysLeft}'},
      'tiles': [for (final t in a.tiles) [t.id, t.code, t.title, t.meta, '${t.pct}%']],
      'chips': [for (final c in a.later.take(5)) c.text],
      'more': a.later.length > 5 ? '+${a.later.length - 5}' : '',
      'laterN': a.later.isEmpty ? null : '${a.later.length} course${a.later.length == 1 ? '' : 's'}',
    };
    if ((L['courseFixtures'] as List).contains((L['atlas'] as List).indexOf(f))) {
      (out['units'] as Map)[f['name']] = {
        for (final c in (L['courses'] as List).where((c) => c['tracker'] != true))
          c['id'] as String: [for (final u in e.unitCounts(c['id'] as String)) [u.name, '${u.done}/${u.total}']],
      };
    }
  }

  // ---- Recall: the lists, and the grading over the matrix ----
  final R = L['recall'] as Map<String, dynamic>;
  out['recall'] = {
    for (final f in R['pages'] as List)
      f['name'] as String: () {
        final r = eng(f as Map<String, dynamic>).recallData();
        return {
          'due': [for (final it in r.due) [it.k, it.label.code, it.label.title, it.pill, it.crimson]],
          'counts': r.dueN == 0 ? null : ['${r.dueN}', '${r.scheduled}'],
          'nothing': r.dueN > 0 ? null : (r.scheduled > 0 ? '${r.scheduled} lecture${r.scheduled == 1 ? '' : 's'} scheduled ahead.' : 'Prove a lecture and it enters the rotation.'),
          'next': [for (final it in r.next) [it.label.title, it.label.code, it.due.substring(5)]],
        };
      }(),
  };
  out['grades'] = [
    for (final c in R['grades'] as List)
      () {
        final k = c['k'] as String;
        final e = Engine(
          data,
          {'review': {if (c['rv'] != null) k: copy(c['rv'])}, 'lessons': {k: {'verified': true}}},
          today: () => c['clock'] as String,
        );
        e.gradeRecall(k, c['grade'] as String, '2026-11-10T09:00:00.000Z');
        return {
          'rv': copy(e.review[k]),
          'events': [for (final ev in e.S['ledger'] as List) [ev['type'], ev['ref'], copy(ev['data'])]],
        };
      }(),
  ];

  // ---- Drill: the candidates, and the properties of a pick over the same four seeds ----
  out['drill'] = {
    for (final f in L['drill'] as List)
      f['name'] as String: () {
        final e = eng(f as Map<String, dynamic>);
        String key(BankQ p) => '${p.bankId}|${p.idx}';
        final misses = [for (final p in e.drillMisses()) key(p)];
        final unlocked = [for (final b in data.quizzes.keys) for (final i in e.unlockedIdx(b)) '$b|$i'];
        return {
          'misses': [...misses]..sort(),
          'unlocked': [...unlocked]..sort(),
          'picks': [
            for (final n in [1, 2, 3, 4])
              () {
                final pick = [for (final p in e.drillPick(lcg(n))) key(p)];
                return {
                  'size': pick.length,
                  'dups': pick.length - pick.toSet().length,
                  'outside': pick.where((x) => !misses.contains(x) && !(misses.length < 5 && unlocked.contains(x))).length,
                  'fromMiss': pick.where(misses.contains).length,
                };
              }(),
          ],
        };
      }(),
  };
  return out;
}

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
  out['quiz'] = quizDump(fx, data, dir);
  out['record'] = recordDump(fx, data);
  out['learn'] = learnDump(fx, data);
  stdout.write(jsonEncode(out));
}
