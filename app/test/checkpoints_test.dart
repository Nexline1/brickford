// T-069 (Flutter): the near checkpoints. The data is the web's DAR.CHECKPOINTS; days left is calendar days
// (a Saturday is no different), "late" past the date; the auto-ticks follow the state and a stored tick never
// overrides one; ticks merge per item by `at`; a push carries them (a phone sync never drops the laptop's); and the
// Home block: the first checkpoint not done open, a tap ticks and a second unticks (one write each), an auto item
// has no tap, 44px rows, and building it writes nothing.
//
// Parity with app.js on the same inputs is tools/verify-app.js; these pin the behaviour on the Dart side.
import 'dart:convert';

import 'package:app/engine/checkpoints.dart';
import 'package:app/engine/merge.dart';
import 'package:app/main.dart';
import 'package:app/state/app_model.dart';
import 'package:app/state/sync.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'sync_test.dart' show FakeGitHub, fakeToken, remoteWith;

final noonish = DateTime.utc(2026, 11, 14, 12);

Future<AppModel> model({Map<String, dynamic> state = const {}, String today = '2026-11-14', bool token = false, FakeGitHub? gh}) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({
    AppModel.storageKey: jsonEncode(state),
    if (token) SyncService.tokenKey: fakeToken,
  });
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => noonish, client: (gh ?? FakeGitHub()).client);
}

Map<String, dynamic> tk(bool done, String at) => {'done': done, 'at': at};
const w = {'done': true, 'doneAt': '2026-11-02', 'notes': '', 'checks': <dynamic>[]};
Map<String, dynamic> probs(int n) => {for (var i = 0; i < n; i++) 'Cat|P$i': '2026-11-02'};
bool? doneOf(AppModel m, String c, String i) =>
    m.engine.checkpointsView().firstWhere((v) => v.id == c).items.where((x) => x.id == i).firstOrNull?.done;
Finder key(String s) => find.byKey(ValueKey(s));

/// Scroll Home's sheet (a lazy ListView) until [f] is built and on screen.
Future<void> reveal(WidgetTester t, Finder f) async {
  await t.scrollUntilVisible(f, 200, scrollable: find.descendant(of: find.byKey(SheetScaffold.sheetKey), matching: find.byType(Scrollable)).first);
  await t.pumpAndSettle();
}

Map<String, dynamic>? stored(AppModel m) => (jsonDecode(m.prefs.getString(AppModel.storageKey) ?? '{}') as Map)['checkpoints'] as Map<String, dynamic>?;

void main() {
  test('checkpoints.json is the web DAR.CHECKPOINTS: three dated checkpoints, four items each, two of them auto', () async {
    final m = await model();
    expect([for (final c in m.data.checkpoints) [c['id'], c['date'], c['title']]], [
      ['c1', '2026-12-06', 'Prove the routine'],
      ['c2', '2027-01-04', 'The Python bridge is done'],
      ['c3', '2027-02-28', 'You can build what you watched'],
    ]);
    expect([for (final c in m.data.checkpoints) (c['items'] as List).length], [4, 4, 4]);
    expect([for (final c in m.data.checkpoints) for (final it in c['items'] as List) if (it['auto'] != null) '${c['id']}.${it['id']}'], ['c1.cs50p', 'c2.neetcode']);
  });

  test('days left is calendar days, a Saturday included; the day itself reads today and the day after late', () async {
    for (final (clock, left, word) in [
      ('2026-11-14', 22, '22d left'), // a Saturday, a rest day
      ('2026-11-16', 20, '20d left'),
      ('2026-12-05', 1, '1d left'), // a Saturday
      ('2026-12-06', 0, 'today'),
      ('2026-12-07', -1, 'late'),
    ]) {
      final m = await model(today: clock);
      final v = m.engine.checkpointsView().first;
      expect(v.left, left, reason: clock);
      expect(v.meta, '0/4 · 6 Dec · $word', reason: clock);
    }
  });

  test('the auto-ticks follow the state, and a stored tick or untick never overrides them', () async {
    var m = await model(state: {'lessons': {'cs100.0.3': w, 'cs100.0.4': w}, 'problems': probs(24)});
    expect([doneOf(m, 'c1', 'cs50p'), doneOf(m, 'c2', 'neetcode')], [false, false]);
    m = await model(state: {'lessons': {'cs100.0.3': w, 'cs100.0.4': w, 'cs100.0.5': w}, 'problems': probs(25)});
    expect([doneOf(m, 'c1', 'cs50p'), doneOf(m, 'c2', 'neetcode')], [true, true]);
    m = await model(state: {'checkpoints': {'c1': {'cs50p': tk(true, '2026-11-13T08:00:00.000Z')}, 'c2': {'neetcode': tk(true, '2026-11-13T08:00:00.000Z')}}});
    expect([doneOf(m, 'c1', 'cs50p'), doneOf(m, 'c2', 'neetcode')], [false, false]);
    expect(m.cpToggle('c1', 'cs50p', true), isFalse, reason: 'an auto item cannot be ticked by hand');
  });

  test('the merge: per item, the newer `at` wins (an untick too); one side only is kept; non-objects are skipped', () async {
    final m = await model(state: {'checkpoints': {'c1': {'routine': tk(true, '2026-11-10T08:00:00.000Z'), 'nn': tk(true, '2026-11-12T08:00:00.000Z')}}});
    final n = mergeState(m.engine, remoteWith({'checkpoints': {
      'c1': {'routine': tk(false, '2026-11-11T08:00:00.000Z'), 'nn': tk(false, '2026-11-11T08:00:00.000Z'), 'sameday': null},
      'c2': {'exam1': tk(true, '2026-11-09T08:00:00.000Z')},
      'c3': [1],
    }}));
    expect(n, 2);
    expect([doneOf(m, 'c1', 'routine'), doneOf(m, 'c1', 'nn'), doneOf(m, 'c2', 'exam1')], [false, true, true]);
  });

  test('a push carries the checkpoints: the laptop ticks in the remote file survive the phone push, and the phone tick is added', () async {
    final gh = FakeGitHub()..file = remoteWith({'checkpoints': {'c2': {'exam1': tk(true, '2026-11-13T08:00:00.000Z')}}});
    final m = await model(token: true, gh: gh);
    expect(m.cpToggle('c1', 'routine', true), isTrue);
    expect(syncPayload(m.engine)['state']['checkpoints'], m.engine.S['checkpoints']);
    expect(await m.sync.pushNow(), isTrue);
    final remote = (gh.file!['state'] as Map)['checkpoints'] as Map;
    expect(remote['c2']['exam1'], tk(true, '2026-11-13T08:00:00.000Z'));
    expect(remote['c1']['routine']['done'], isTrue);
  });

  test('the week: practice items marked ok whose last change is in the last 7 days', () async {
    final m = await model(state: {'practice': {
      'math110.0.0': {
        'p1': {'answer': '1', 'mark': 'ok', 'at': '2026-11-14T23:59:00.000Z'},
        'p2': {'answer': '1', 'mark': 'ok', 'at': '2026-11-08T00:00:00.000Z'},
        'p3': {'answer': '1', 'mark': 'ok', 'at': '2026-11-07T23:59:00.000Z'},
        'p9': {'answer': '1', 'mark': 'ok', 'at': '2026-11-13T08:00:00.000Z'},
      },
      'math110.0.1': {'p1': {'answer': '1', 'mark': 'missed', 'at': '2026-11-13T08:00:00.000Z'}},
    }});
    expect(m.engine.problemsThisWeek(), 2);
    expect(cpWeekLine(2), '2 problems solved this week');
    expect(cpWeekLine(1), '1 problem solved this week');
  });

  group('the Home block', () {
    Future<void> home(WidgetTester t, AppModel m, {double width = 375}) async {
      t.view.physicalSize = Size(width * 3, 812 * 3);
      t.view.devicePixelRatio = 3;
      addTearDown(t.view.reset);
      await t.pumpWidget(BrickfordApp(model: m));
      await t.pumpAndSettle();
      await reveal(t, key('cp-week'));
    }

    Future<void> tap(WidgetTester t, Finder f) async {
      await reveal(t, f);
      await t.tap(f);
      await t.pumpAndSettle();
    }


    testWidgets('the week line, the first checkpoint open with its four items, the others folded; building writes nothing', (t) async {
      final m = await model(state: {'lessons': {'cs100.0.3': w, 'cs100.0.4': w, 'cs100.0.5': w}});
      final before = m.prefs.getString(AppModel.storageKey);
      await home(t, m);
      expect(find.text('Checkpoints · 0 problems solved this week'), findsOneWidget);
      for (final i in ['routine', 'cs50p', 'sameday', 'nn']) {
        expect(key('cp-c1-$i'), findsOneWidget);
      }
      expect(key('cp-c2-exam1'), findsNothing, reason: 'the second checkpoint is folded');
      expect(t.widget<Text>(key('cp-c1-meta')).data, '1/4 · 6 Dec · 22d left');
      expect(t.widget<Text>(key('cp-c3-meta')).data, '0/4 · 28 Feb · 106d left');
      for (final k in ['cp-c1', 'cp-c2', 'cp-c3', 'cp-c1-routine', 'cp-c1-cs50p']) {
        final r = t.getRect(key(k));
        expect(r.width >= 44 && r.height >= 44, isTrue, reason: '$k is ${r.size}, under 44x44');
      }
      expect(m.prefs.getString(AppModel.storageKey), before, reason: 'a build is a read');
      expect(t.takeException(), isNull);
    });

    testWidgets('a tap ticks an item and a second unticks it, one write each, { done, at } stored, the count repainted', (t) async {
      final m = await model();
      var writes = 0;
      m.addListener(() => writes++);
      await home(t, m);
      await tap(t, key('cp-c1-sameday'));
      expect(writes, 1);
      expect(stored(m)!['c1']['sameday'], {'done': true, 'at': '2026-11-14T12:00:00.000Z'});
      expect(t.widget<Text>(key('cp-c1-meta')).data, startsWith('1/4'));
      await tap(t, key('cp-c1-sameday'));
      expect(writes, 2);
      expect(stored(m)!['c1']['sameday']['done'], isFalse, reason: 'the untick is kept, so it syncs');
      expect(t.widget<Text>(key('cp-c1-meta')).data, startsWith('0/4'));
      expect(key('cp-c1-sameday'), findsOneWidget, reason: 'the checkpoint stays open');
    });

    testWidgets('an auto item has no tap: pressing it stores nothing', (t) async {
      final m = await model();
      await home(t, m);
      await tap(t, key('cp-c1-cs50p'));
      expect(stored(m), anyOf(isNull, isEmpty));
      expect(doneOf(m, 'c1', 'cs50p'), isFalse);
    });

    testWidgets('a folded checkpoint opens, and past its date it reads late and can still be ticked', (t) async {
      final m = await model(today: '2027-03-01');
      await home(t, m);
      expect(t.widget<Text>(key('cp-c1-meta')).data, '0/4 · 6 Dec · late');
      await tap(t, key('cp-c2'));
      expect(key('cp-c2-exam1'), findsOneWidget);
      await tap(t, key('cp-c2-exam1'));
      expect(stored(m)!['c2']['exam1']['done'], isTrue);
      expect(t.widget<Text>(key('cp-c2-meta')).data, '1/4 · 4 Jan · late');
    });

    testWidgets('at 320 wide nothing in the block overflows', (t) async {
      final m = await model();
      await home(t, m, width: 320);
      await reveal(t, key('cp-c1-nn'));
      expect(t.takeException(), isNull);
    });
  });
}
