// T-064 performance round: the engine's memo and the debounced save.
//
// The memo (scheduledFor, backlogCount, streak, bestStreak, dayStatus, firstOwed) must never change an
// answer, only when it is worked out: every answer is compared with a bare Engine (no memo) over a copy of
// the same S, after each of a sequence of state changes and a rolled-over date. The save is debounced by
// 400 ms in the app, and must never lose a write: flushed when the page is hidden, before a sync, before an
// export, and no later than 2 s after the first unsaved change.
import 'dart:convert';

import 'package:app/engine/dates.dart';
import 'package:app/engine/engine.dart';
import 'package:app/engine/problems.dart';
import 'package:app/main.dart';
import 'package:app/widgets/blocks.dart' show ItemBlock;
import 'package:app/state/app_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

var today = '2026-11-04';
var clock = DateTime.utc(2026, 11, 4, 9);

Future<AppModel> model(Map<String, dynamic> state, {Duration saveDelay = Duration.zero}) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => clock, saveDelay: saveDelay);
}

Map<String, dynamic> copy(Map<String, dynamic> s) => jsonDecode(jsonEncode(s)) as Map<String, dynamic>;
List<String> keys(List<SchedItem> l) => [for (final i in l) i.key];

/// Everything the memo covers, from [e], as plain values.
Map<String, Object?> answers(Engine e) {
  final days = [for (var i = -2; i < 14; i++) addDaysISO(today, i)];
  return {
    'streak': e.streak(),
    'best': e.bestStreak(),
    'backlog': e.backlogCount(),
    'owed': e.firstOwed()?.key,
    for (final d in days) 'sched $d': keys(e.scheduledFor(d)),
    for (final d in days) 'status $d': e.dayStatus(d),
  };
}

/// What a bare Engine (no memo) over a copy of [m]'s S answers: the reference.
Map<String, Object?> reference(AppModel m) {
  final bare = Engine(m.data, copy(m.engine.S), today: () => today);
  expect(bare.memoize, isFalse);
  return answers(bare);
}

void same(AppModel m, String when) {
  final memo = answers(m.engine), ref = reference(m);
  for (final k in ref.keys) {
    expect(memo[k], ref[k], reason: '$k $when');
  }
}

void main() {
  testWidgets('the memo answers exactly what an unmemoised engine does across a sequence of state changes', (tester) async {
    today = '2026-11-04';
    final m = await model({
      'lessons': {
        'math110.0.0': {'done': true, 'doneAt': '2026-10-14', 'notes': '', 'checks': []},
        'math110.0.1': {'done': true, 'doneAt': '2026-10-15', 'notes': '', 'checks': []},
      },
      'studyDays': ['2026-10-14', '2026-10-15', '2026-11-02', '2026-11-03'],
    });
    expect(m.engine.memoize, isTrue);
    same(m, 'at the start');
    same(m, 'asked twice (now from the memo)');

    final steps = <String, void Function()>{
      'a lecture marked watched': () => m.toggleDone('math110.0.2'),
      'another one, and the first unmarked': () {
        m.toggleDone('ai200.0.0');
        m.toggleDone('math110.0.0');
      },
      'the day sealed': () => m.sealDay(),
      'a problem ticked': () => m.tickProblem('dsa.1', true),
      'the streak reset': () => m.resetStreak(),
      'a lesson marked on a later day': () {
        today = '2026-11-05';
        m.toggleDone('math120.0.0');
      },
    };
    for (final e in steps.entries) {
      e.value();
      same(m, 'after ${e.key}');
    }

    // The date rolls over with nothing else changing: no touch(), and the answers still follow the clock.
    final before = answers(m.engine);
    today = '2026-11-06';
    same(m, 'after the date rolled over');
    expect(answers(m.engine)['status 2026-11-05'], isNot(before['status 2026-11-05']), reason: 'yesterday is no longer "today"');
  });

  testWidgets('the memo holds until state changes: touch() and any notification drop it', (tester) async {
    today = '2026-11-04';
    final m = await model({'studyDays': ['2026-11-03']});
    final e = m.engine;
    expect(e.streak(), 1);
    // S edited behind the engine's back: the memo still answers (that is what memoised means) ...
    (e.S['studyDays'] as List).add('2026-11-04');
    expect(e.streak(), 1);
    final rev = e.rev;
    // ... until the app says S changed.
    e.touch();
    expect(e.rev, rev + 1);
    expect(e.streak(), 2);
    (e.S['studyDays'] as List).add('2026-11-02');
    var heard = 0;
    m.addListener(() => heard++);
    m.refresh(); // a merge brought work in: notifyListeners() touches before anyone rebuilds
    expect(heard, 1);
    expect(e.streak(), 3);

    // A scheduledFor result is the caller's own list: changing it does not change the next answer.
    final a = e.scheduledFor(today);
    final n = a.length;
    a.clear();
    expect(e.scheduledFor(today), hasLength(n));

    // planOnly (revisionLectures) changes what scheduledFor means: it is never answered from, or kept in, the memo.
    final plain = keys(e.scheduledFor('2026-11-09'));
    e.planOnly = true;
    final plan = keys(e.scheduledFor('2026-11-09'));
    e.planOnly = false;
    expect(keys(e.scheduledFor('2026-11-09')), plain);
    expect(plan, isNotEmpty);
  });

  testWidgets('the recorder (its tick) and the sync (its status) notify on their own, so no screen under AppScope rebuilds for them', (tester) async {
    final m = await model({});
    var heard = 0;
    m.addListener(() => heard++);
    // ignore: invalid_use_of_protected_member
    m.recorder.notifyListeners(); // what the recorder's 200 ms tick does
    // ignore: invalid_use_of_protected_member
    m.sync.notifyListeners(); // what a sync status change does
    expect(heard, 0);
    m.refresh(); // a change to the record does
    expect(heard, 1);
  });

  testWidgets('a long list builds only the rows near the screen (Learn > All feeds a lazy ListView, not one Column)', (tester) async {
    final m = await model({});
    tester.view.physicalSize = const Size(375 * 3, 812 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(BrickfordApp(model: m));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('tab-Learn')));
    await tester.pumpAndSettle();
    await tester.drag(find.byKey(const ValueKey('learn-tab-exams')), const Offset(-300, 0)); // the chip row scrolls
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('learn-tab-all')));
    await tester.pumpAndSettle();
    final total = m.engine.allPsets().length + m.data.labs.length;
    final built = find.byType(ItemBlock, skipOffstage: false).evaluate().length;
    expect(total, greaterThan(30), reason: 'a list worth being lazy about');
    expect(built, lessThan(total ~/ 2), reason: '$built of $total rows built at the top of the list');
  });

  group('the debounced save', () {
    const k = 'math110.0.0';
    bool saved(AppModel m) => (m.prefs.getString(AppModel.storageKey) ?? '').contains('"$k"');

    testWidgets('waits for the delay, then writes once, with every change in it', (tester) async {
      final m = await model({}, saveDelay: const Duration(milliseconds: 400));
      m.toggleDone(k);
      m.toggleDone('math110.0.1');
      expect(m.unsaved, isTrue);
      expect(saved(m), isFalse);
      await tester.pump(const Duration(milliseconds: 399));
      expect(saved(m), isFalse);
      await tester.pump(const Duration(milliseconds: 2));
      expect(m.unsaved, isFalse);
      expect(saved(m), isTrue);
      expect(m.prefs.getString(AppModel.storageKey), contains('"math110.0.1"'));
    });

    testWidgets('flush() writes now, and cancels the timer', (tester) async {
      final m = await model({}, saveDelay: const Duration(milliseconds: 400));
      m.toggleDone(k);
      expect(saved(m), isFalse);
      await m.flush();
      expect(saved(m), isTrue);
      expect(m.unsaved, isFalse);
      // nothing left pending: the test would fail on a live timer
    });

    testWidgets('continuous changes are written no later than 2 s after the first', (tester) async {
      clock = DateTime.utc(2026, 11, 4, 9);
      final m = await model({}, saveDelay: const Duration(milliseconds: 400));
      m.toggleDone(k);
      for (var i = 0; i < 9; i++) {
        clock = clock.add(const Duration(milliseconds: 300));
        await tester.pump(const Duration(milliseconds: 300));
        m.toggleDone('math110.0.${i + 2}'); // each one restarts the 400 ms wait
        if (i < 5) expect(saved(m), isFalse, reason: 'still inside 2 s');
      }
      expect(saved(m), isTrue, reason: '2.7 s of changes, never quiet for 400 ms');
      await m.flush();
    });

    testWidgets('the page being hidden writes it (the app lifecycle), and so does a sync starting', (tester) async {
      final m = await model({}, saveDelay: const Duration(milliseconds: 400));
      tester.view.physicalSize = const Size(375 * 3, 812 * 3);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(BrickfordApp(model: m));
      await tester.pumpAndSettle();
      m.toggleDone(k);
      expect(saved(m), isFalse);
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.inactive);
      await tester.pump();
      expect(saved(m), isTrue, reason: 'inactive is the last notice an iPhone gives');
      m.toggleDone('math110.0.1');
      expect(m.unsaved, isTrue);
      m.sync.onHidden(); // what a push does first
      expect(m.unsaved, isFalse);
      m.toggleDone('math110.0.2');
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.hidden);
      await tester.pump();
      expect(m.prefs.getString(AppModel.storageKey), contains('"math110.0.2"'));
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pump();
    });

    testWidgets('with no delay (the tests, a bare model) every change is in storage at once', (tester) async {
      final m = await model({});
      m.toggleDone(k);
      expect(saved(m), isTrue);
      expect(m.unsaved, isFalse);
    });
  });
}
