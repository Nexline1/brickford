// Monk Mode (T-064 stage 3): the score ring, the five priority badges, the
// Now/Next plan, the 21-day map, and the rule that nothing here ever syncs.
import 'dart:convert';

import 'package:app/engine/engine.dart';
import 'package:app/engine/monk.dart';
import 'package:app/main.dart';
import 'package:app/screens/monk/monk_screen.dart';
import 'package:app/screens/monk/monk_start.dart';
import 'package:app/state/app_model.dart';
import 'package:app/state/sync.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

const today = '2026-11-05'; // a Thursday, Monk day 5

/// [at] is the wall clock, local: Monk's Now/Next reads it. T-065: Monk has no start until the owner presses
/// Start, so every scenario that reads a Monk day carries the start these tests were written against (1 Nov);
/// [start] null is the not-started state.
Future<AppModel> model({Map<String, dynamic>? monk, String date = today, String Function()? clock, DateTime? at, http.Client? client, bool token = false, String? start = '2026-11-01'}) async {
  SharedPreferences.setMockInitialValues({
    if (monk != null || start != null) AppModel.storageKey: jsonEncode({'monk': ?monk, 'monkStart': ?start}),
    if (token) SyncService.tokenKey: 'github_pat_FAKE',
  });
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: clock ?? () => date, now: () => at ?? DateTime(2026, 11, 5, 8, 15), client: client);
}

Future<void> show(WidgetTester tester, AppModel m) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
}

Future<void> openFromHome(WidgetTester tester) async {
  await tester.tap(find.byKey(const ValueKey('home-monk')));
  await tester.pumpAndSettle();
  expect(find.byType(MonkScreen), findsOneWidget);
}

Finder checkIn(String k) => find.descendant(of: find.byKey(ValueKey('monk-pri-$k')), matching: find.byIcon(Icons.check_rounded));
String ring(WidgetTester tester) => tester.widget<ScoreRing>(find.descendant(of: find.byKey(const ValueKey('monk-ring')), matching: find.byType(ScoreRing))).pct.toString();

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  testWidgets('the ring counts only the five priorities, and a badge is done exactly when its rule is met', (tester) async {
    final m = await model(monk: {
      'days': {
        today: {
          'prayers': {'fajr': true, 'dhuhrAsr': true, 'maghribIsha': true},
          'nosin': true,
          'work': 9.5, // not 10 h
          'bfh': 3,
          'german': {'podcast': true, 'speak': true, 'write': true}, // 3 of 4
          'meditate': true, 'read': true, 'clean': true, 'plan': true, 'phone': 1, 'gym': 1, // Also: not in the ring
        },
      },
    });
    await show(tester, m);
    await openFromHome(tester);
    expect(find.text('Day 5 of 21'), findsOneWidget);
    expect(ring(tester), '60'); // prayers, no sin, Brickford: 3 of 5
    for (final k in ['prayers', 'nosin', 'bfh']) {
      expect(checkIn(k), findsOneWidget, reason: '$k is done');
    }
    for (final k in ['work', 'german']) {
      expect(checkIn(k), findsNothing, reason: '$k is not');
    }
    expect(Engine.monkScore(m.monkRec(today)).done, 3);
    expect(find.text('9.5/10h'), findsOneWidget);
    expect(find.text('3/4'), findsOneWidget);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('tap a badge, tap its controls: prayers, no sin, hours, German; every write is local and arms no push', (tester) async {
    final calls = <String>[];
    final client = MockClient((r) async {
      calls.add(r.method);
      return http.Response('{}', 404);
    });
    final m = await model(client: client, token: true);
    await show(tester, m);
    calls.clear(); // the boot pull is the sync's own, before any of this
    await openFromHome(tester);
    expect(ring(tester), '0');
    // Prayers: three chips, each with its Ja'fari time.
    await tester.tap(find.byKey(const ValueKey('monk-pri-prayers')));
    await tester.pumpAndSettle();
    final pt = monkPrayerTimes(today);
    expect(find.text(mkHHMM(pt['fajr']!)), findsOneWidget);
    expect(find.text(mkHHMM(pt['maghrib']!)), findsOneWidget);
    for (final k in ['fajr', 'dhuhrAsr', 'maghribIsha']) {
      await tester.tap(find.byKey(ValueKey('monk-chip-$k')));
      await tester.pumpAndSettle();
    }
    expect(checkIn('prayers'), findsOneWidget);
    expect(ring(tester), '20');
    // No sin.
    await tester.tap(find.byKey(const ValueKey('monk-pri-nosin')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('monk-nosin-toggle')));
    await tester.pumpAndSettle();
    expect(checkIn('nosin'), findsOneWidget);
    // Brickford 3 h: six half-hours; a minus does not go below zero.
    await tester.tap(find.byKey(const ValueKey('monk-pri-bfh')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('monk-bfh-minus')));
    for (var i = 0; i < 6; i++) {
      await tester.tap(find.byKey(const ValueKey('monk-bfh-plus')));
    }
    await tester.pumpAndSettle();
    expect(checkIn('bfh'), findsOneWidget);
    expect(m.monkRec(today)['bfh'], 3); // 3, the web's shape, not 3.0
    // German needs all four.
    await tester.tap(find.byKey(const ValueKey('monk-pri-german')));
    await tester.pumpAndSettle();
    for (final g in ['podcast', 'speak', 'write']) {
      await tester.tap(find.byKey(ValueKey('monk-german-$g')));
      await tester.pumpAndSettle();
    }
    expect(checkIn('german'), findsNothing);
    await tester.tap(find.byKey(const ValueKey('monk-german-read')));
    await tester.pumpAndSettle();
    expect(checkIn('german'), findsOneWidget);
    expect(ring(tester), '80');
    // Stored in the web app's S.monk shape, and it never left the device.
    final saved = jsonDecode(m.prefs.getString(AppModel.storageKey)!) as Map<String, dynamic>;
    final day = ((saved['monk'] as Map)['days'] as Map)[today] as Map;
    expect(day['prayers'], {'fajr': true, 'dhuhrAsr': true, 'maghribIsha': true});
    expect(day['german'], {'podcast': true, 'speak': true, 'write': true, 'read': true});
    expect(day['nosin'], true);
    expect(day['at'], isA<String>());
    await tester.pump(const Duration(seconds: 30));
    expect(calls, isEmpty);
    expect(m.sync.owed, isFalse);
    expect(Engine.MONK_SYNCS, isFalse);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('Now / Next follow the clock and the Ja\'fari prayer times', (tester) async {
    final m = await model(at: DateTime(2026, 11, 5, 8, 15));
    await show(tester, m);
    await openFromHome(tester);
    expect(find.descendant(of: find.byKey(const ValueKey('monk-now')), matching: find.text('Brickford — Deep Track')), findsOneWidget);
    expect(find.text('until 10:30'), findsOneWidget);
    expect(find.text('Scripting'), findsOneWidget); // next: 10:30
    await tester.pumpWidget(const SizedBox());
    // Just before Fajr, on its own block.
    final fajr = monkPrayerTimes(today)['fajr']!.round();
    final m2 = await model(at: DateTime(2026, 11, 5, fajr ~/ 60, fajr % 60 + 1));
    await show(tester, m2);
    await openFromHome(tester);
    expect(find.descendant(of: find.byKey(const ValueKey('monk-now')), matching: find.text('Fajr')), findsOneWidget);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('the 21-day map, the focus line, loops and tomorrow\'s plan', (tester) async {
    final m = await model(monk: {
      'days': {
        '2026-11-01': {'prayers': {'fajr': true, 'dhuhrAsr': true, 'maghribIsha': true}, 'nosin': true, 'work': 10, 'bfh': 3, 'german': {'podcast': true, 'speak': true, 'write': true, 'read': true}},
        '2026-11-03': {'nosin': true},
      },
    });
    await show(tester, m);
    await openFromHome(tester);
    final scroll = find.descendant(of: find.byKey(const ValueKey('brickford-sheet')), matching: find.byType(Scrollable)).first;
    await tester.scrollUntilVisible(find.byKey(const ValueKey('monk-map-2026-11-05')), 300, scrollable: scroll);
    expect(find.byKey(const ValueKey('monk-map-2026-11-21')), findsOneWidget);
    expect(find.textContaining('21 days · avg'), findsOneWidget);
    // Focus: the weakest priority of the 4 monk days before today.
    await tester.scrollUntilVisible(find.byKey(const ValueKey('monk-focus')), 300, scrollable: scroll);
    final f = monkFocus(m.monkDays, today, m.monkFrom)!;
    expect(find.text('${f.label} · ${f.rate}%'), findsOneWidget);
    // A seeded loop closes; a new one opens.
    await tester.scrollUntilVisible(find.byKey(const ValueKey('monk-loop-new')), 300, scrollable: scroll);
    await tester.tap(find.byKey(const ValueKey('monk-loop-s3')));
    await tester.pumpAndSettle();
    expect((m.monkLoops['s3'] as Map)['done'], true);
    await tester.enterText(find.byKey(const ValueKey('monk-loop-new')), 'Close the invoice');
    await tester.tap(find.byKey(const ValueKey('monk-loop-add')));
    await tester.pumpAndSettle();
    expect(m.monkLoops.values.where((l) => (l as Map)['text'] == 'Close the invoice'), hasLength(1));
    // Tomorrow's plan, saved under tomorrow, and today's "Plan tomorrow" ticked.
    await tester.scrollUntilVisible(find.byKey(const ValueKey('monk-plan-save')), 300, scrollable: scroll);
    await tester.enterText(find.byKey(const ValueKey('monk-plan-business')), 'Call the client');
    await tester.tap(find.byKey(const ValueKey('monk-plan-save')));
    await tester.pumpAndSettle();
    expect((m.monkPlans['2026-11-06'] as Map)['business'], 'Call the client');
    expect(m.monkRec(today)['plan'], true);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('before the 21 days it says when they start; Home\'s badge is a 44 px button, and so is the chip', (tester) async {
    final m = await model(date: '2026-10-28');
    await show(tester, m);
    expect(find.byKey(const ValueKey('home-monk')), findsNothing); // no badge outside the 21 days
    await tester.tap(find.byKey(const ValueKey('chip-monk')));
    await tester.pumpAndSettle();
    expect(find.text('Starts 1 Nov'), findsOneWidget);
    expect(find.text('Starts tomorrow'), findsNothing);
    await tester.pumpWidget(const SizedBox());
    final m2 = await model();
    await show(tester, m2);
    final size = tester.getSize(find.byKey(const ValueKey('home-monk')));
    expect(size.height, greaterThanOrEqualTo(44));
    await tester.pumpWidget(const SizedBox());
  });

  // ---------- T-065: the one-time Start ----------

  const hold = ValueKey('monk-start-hold');
  const ack = ValueKey('monk-start-ack');
  Finder fill() => find.byKey(const ValueKey('monk-start-fill'));
  double filled(WidgetTester tester) => tester.widget<FractionallySizedBox>(fill()).widthFactor!;

  /// The Monk screen's Start button, open to the sheet, on a Friday with nothing started.
  Future<AppModel> openSheet(WidgetTester tester, {String date = '2026-11-06'}) async {
    final m = await model(start: null, date: date);
    await show(tester, m);
    await tester.tap(find.byKey(const ValueKey('chip-monk')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('monk-start')));
    await tester.pumpAndSettle();
    expect(find.byKey(hold), findsOneWidget);
    return m;
  }

  testWidgets('not started: monkDay is null on every date, and neither the Monk screen nor Home shows a day, a score or a plan', (tester) async {
    final m = await model(start: null, monk: {'days': {'2026-11-03': {'nosin': true}}});
    expect(m.monkFrom, isNull);
    for (final d in ['2026-10-31', '2026-11-01', '2026-11-05', '2026-11-21', '2026-11-22', '2027-01-01', '2028-02-29']) {
      expect(m.engine.monkDay(d), isNull, reason: d);
    }
    expect(monkFocus(m.monkDays, today, m.monkFrom), isNull);
    expect(m.monkLiveDays, isEmpty); // nothing counts without a start
    expect(m.monkDays.containsKey('2026-11-03'), isTrue); // and nothing stored was deleted
    await show(tester, m);
    // Home: the one Start button, no "Day N / 21", and 44 x 44 or more.
    expect(find.byKey(const ValueKey('home-monk-start')), findsOneWidget);
    expect(find.byKey(const ValueKey('home-monk')), findsNothing);
    expect(find.textContaining(' / 21'), findsNothing);
    final hb = tester.getSize(find.byKey(const ValueKey('home-monk-start')));
    expect(hb.height >= 44 && hb.width >= 44, isTrue, reason: '$hb');
    // The Monk screen: 21 empty days and one Start button, nothing else.
    await tester.tap(find.byKey(const ValueKey('chip-monk')));
    await tester.pumpAndSettle();
    expect(find.byType(MonkStartScreen), findsOneWidget);
    expect(find.byKey(const ValueKey('monk-start')), findsOneWidget);
    final sb = tester.getSize(find.byKey(const ValueKey('monk-start')));
    expect(sb.height >= 44 && sb.width >= 44, isTrue, reason: '$sb');
    expect(find.descendant(of: find.byKey(const ValueKey('monk-start-map')), matching: find.byType(AspectRatio)), findsNWidgets(21));
    for (final k in ['monk-head', 'monk-ring', 'monk-card', 'monk-now', 'monk-focus', 'monk-plan-save', 'monk-loop-new']) {
      expect(find.byKey(ValueKey(k)), findsNothing, reason: k);
    }
    expect(find.textContaining('of 21'), findsNothing);
    expect(find.textContaining('Starts '), findsNothing);
    // Looking at it wrote nothing, and started nothing.
    expect(m.engine.S.containsKey('monkStart'), isFalse);
    expect(m.prefs.getString(AppModel.storageKey), jsonEncode({'monk': {'days': {'2026-11-03': {'nosin': true}}}}));
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('startMonk writes today once, saves it, and returns false the second time even on another day', (tester) async {
    var date = '2026-11-06';
    final m = await model(start: null, clock: () => date, monk: {'days': {'2026-11-03': {'nosin': true}}});
    final before = jsonEncode(m.engine.S['monk']);
    expect(m.startMonk(), isTrue);
    expect(m.monkFrom, '2026-11-06');
    expect(m.engine.monkDay('2026-11-06'), 1);
    expect(m.engine.monkDay('2026-11-26'), 21);
    expect(m.engine.monkDay('2026-11-27'), isNull);
    expect(jsonDecode(m.prefs.getString(AppModel.storageKey)!)['monkStart'], '2026-11-06');
    date = '2026-11-09';
    expect(m.startMonk(), isFalse);
    expect(m.monkFrom, '2026-11-06'); // not the 9th
    expect(jsonEncode(m.engine.S['monk']), before); // S.monk untouched
    // An empty string is not a start.
    final e = (await model(start: '')).engine;
    expect(e.monkFrom, isNull);
    expect(e.startMonk(), isTrue);
  });

  testWidgets('the sheet: it says what it costs, the hold is disabled until the box is ticked, and a tap, a short hold, a slide-off and a closed sheet do not start it', (tester) async {
    final m = await openSheet(tester);
    expect(find.text("21 days. Day 1 is today (Fri 6 Nov). This can't be undone or reset."), findsOneWidget);
    expect(find.text("I understand it can't be reset"), findsOneWidget);
    final box = tester.getCenter(find.byKey(hold));
    final size = tester.getSize(find.byKey(hold));
    expect(size.height >= 44 && size.width >= 44, isTrue, reason: '$size');
    expect(tester.widget<MonkHoldButton>(find.byKey(hold)).enabled, isFalse);
    // Unticked: even a long press does nothing, and the fill never moves.
    var g = await tester.startGesture(box);
    await tester.pump(const Duration(seconds: 2));
    expect(filled(tester), 0);
    await g.up();
    await tester.pumpAndSettle();
    expect(m.monkFrom, isNull);
    // Ticked: the button is live.
    await tester.tap(find.byKey(ack));
    await tester.pumpAndSettle();
    expect(tester.widget<MonkHoldButton>(find.byKey(hold)).enabled, isTrue);
    // A single tap does nothing.
    await tester.tap(find.byKey(hold));
    await tester.pump(const Duration(seconds: 2));
    expect(m.monkFrom, isNull);
    expect(filled(tester), 0);
    // 0.7 s then letting go: the fill was moving, and goes back; waiting on changes nothing.
    g = await tester.startGesture(box);
    await tester.pump(); // the fill's clock starts on the first frame after the press
    await tester.pump(const Duration(milliseconds: 700));
    expect(filled(tester), closeTo(700 / 1500, 0.02));
    await g.up();
    await tester.pump();
    expect(filled(tester), 0);
    await tester.pump(const Duration(seconds: 3));
    expect(m.monkFrom, isNull);
    // Sliding off the button aborts it, even if the finger stays down past 1.5 s.
    g = await tester.startGesture(box);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));
    expect(filled(tester), greaterThan(0));
    await g.moveTo(box + const Offset(0, -200));
    await tester.pump();
    expect(filled(tester), 0);
    await tester.pump(const Duration(seconds: 3));
    expect(m.monkFrom, isNull);
    await g.up();
    await tester.pump();
    // Closing the sheet during a hold aborts it.
    g = await tester.startGesture(box);
    await tester.pump(const Duration(milliseconds: 700));
    Navigator.of(tester.element(find.byKey(hold))).pop();
    await tester.pump(const Duration(seconds: 3));
    await g.up();
    await tester.pumpAndSettle();
    expect(find.byKey(hold), findsNothing);
    expect(m.monkFrom, isNull);
    expect(m.prefs.getString(AppModel.storageKey), isNull); // nothing was written
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('a 1.5 s hold starts it: the sheet closes, the screen reads Day 1 of 21, and Cancel starts nothing', (tester) async {
    final m = await openSheet(tester);
    await tester.tap(find.byKey(const ValueKey('monk-start-cancel')));
    await tester.pumpAndSettle();
    expect(find.byKey(hold), findsNothing);
    expect(m.monkFrom, isNull);
    await tester.tap(find.byKey(const ValueKey('monk-start')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(ack));
    await tester.pumpAndSettle();
    final g = await tester.startGesture(tester.getCenter(find.byKey(hold)));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 1400));
    expect(m.monkFrom, isNull); // not yet
    expect(filled(tester), closeTo(1400 / 1500, 0.02));
    await tester.pump(const Duration(milliseconds: 200));
    await g.up();
    await tester.pumpAndSettle();
    expect(m.monkFrom, '2026-11-06');
    expect(find.byKey(hold), findsNothing);
    expect(find.byType(MonkStartScreen), findsNothing);
    expect(find.text('Day 1 of 21'), findsOneWidget);
    expect(find.byKey(const ValueKey('monk-ring')), findsOneWidget);
    expect(find.byKey(const ValueKey('monk-start')), findsNothing);
    // Back on Home the badge is the day, not Start.
    Navigator.of(tester.element(find.byType(MonkScreen))).pop();
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('home-monk-start')), findsNothing);
    expect(find.text('Day 1 / 21'), findsOneWidget);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('Start from Home\'s badge, by keyboard: Enter held 0.7 s aborts, held 1.5 s starts', (tester) async {
    final m = await model(start: null, date: '2026-11-06');
    await show(tester, m);
    await tester.tap(find.byKey(const ValueKey('home-monk-start')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(ack));
    await tester.pumpAndSettle();
    Focus.of(tester.element(find.descendant(of: find.byKey(hold), matching: find.byType(Listener)).first)).requestFocus();
    await tester.pump();
    await tester.sendKeyDownEvent(LogicalKeyboardKey.enter);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 700));
    expect(filled(tester), closeTo(700 / 1500, 0.02));
    await tester.sendKeyUpEvent(LogicalKeyboardKey.enter);
    await tester.pump();
    expect(filled(tester), 0);
    await tester.pump(const Duration(seconds: 2));
    expect(m.monkFrom, isNull);
    await tester.sendKeyDownEvent(LogicalKeyboardKey.enter);
    await tester.pump(const Duration(milliseconds: 1600));
    await tester.sendKeyUpEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(m.monkFrom, '2026-11-06');
    expect(find.byKey(hold), findsNothing);
    expect(find.text('Day 1 / 21'), findsOneWidget);
    expect(find.byKey(const ValueKey('home-monk-start')), findsNothing);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('started on day 21 it still shows Day 21; the day after, Home shows nothing and the Monk screen reads 21 days done', (tester) async {
    final m = await model(date: '2026-11-21');
    await show(tester, m);
    expect(find.text('Day 21 / 21'), findsOneWidget);
    await tester.pumpWidget(const SizedBox());
    final m2 = await model(date: '2026-11-22');
    await show(tester, m2);
    expect(find.byKey(const ValueKey('home-monk')), findsNothing);
    expect(find.byKey(const ValueKey('home-monk-start')), findsNothing); // started, so no Start either
    await tester.tap(find.byKey(const ValueKey('chip-monk')));
    await tester.pumpAndSettle();
    expect(find.text('21 days done'), findsOneWidget);
    expect(find.byKey(const ValueKey('monk-start')), findsNothing);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('days logged before the start never count on the Monk screen, and stay stored', (tester) async {
    final m = await model(start: '2026-11-05', monk: {
      'days': {
        '2026-11-03': {'shorts': 5, 'work': 12, 'nosin': true},
        '2026-11-05': {'shorts': 2},
      },
    });
    expect(m.monkLiveDays.keys, ['2026-11-05']);
    expect(m.monkDays.keys, containsAll(['2026-11-03', '2026-11-05']));
    await show(tester, m);
    await openFromHome(tester);
    final scroll = find.descendant(of: find.byKey(const ValueKey('brickford-sheet')), matching: find.byType(Scrollable)).first;
    await tester.scrollUntilVisible(find.text('Short-form'), 300, scrollable: scroll);
    expect(find.text('2 / 8'), findsOneWidget); // the 5 on the 3rd is not in the week
    await tester.scrollUntilVisible(find.text('Work hours'), 300, scrollable: scroll);
    expect(find.text('0 / 70'), findsOneWidget); // nor the 12 work hours
    await tester.pumpWidget(const SizedBox());
  });
}
