// Monk Mode (T-064 stage 3): the score ring, the five priority badges, the
// Now/Next plan, the 21-day map, and the rule that nothing here ever syncs.
import 'dart:convert';

import 'package:app/engine/engine.dart';
import 'package:app/engine/monk.dart';
import 'package:app/main.dart';
import 'package:app/screens/monk/monk_screen.dart';
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

/// [at] is the wall clock, local: Monk's Now/Next reads it.
Future<AppModel> model({Map<String, dynamic>? monk, String date = today, DateTime? at, http.Client? client, bool token = false}) async {
  SharedPreferences.setMockInitialValues({
    if (monk != null) AppModel.storageKey: jsonEncode({'monk': monk}),
    if (token) SyncService.tokenKey: 'github_pat_FAKE',
  });
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => date, now: () => at ?? DateTime(2026, 11, 5, 8, 15), client: client);
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
    final f = monkFocus(m.monkDays, today)!;
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
}
