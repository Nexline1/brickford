// T-064 stage 5: the Sunday seal, Record and Treasury, through the app.
//
// The plan: START_DATE 2026-10-16 (a Friday), so the first revision Sunday is 25 Oct and
// Sunday 8 Nov closes revision week 3 (1-7 Nov). 7 Nov is the Saturday rest
// day, 9 Nov the Monday that opens week 5.
import 'dart:convert';

import 'package:app/engine/record.dart';
import 'package:app/main.dart';
import 'package:app/screens/library/library_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<AppModel> model(Map<String, dynamic> state, {String today = '2026-11-08'}) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => DateTime.utc(2026, 11, 8, 9, 30, 15, 123));
}

Future<void> open(WidgetTester tester, AppModel m) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
}

Finder key(String s) => find.byKey(ValueKey(s));

void main() {
  test('the seal is Sunday only: the revision week own Sunday and no other day', () async {
    final sat = await model({}, today: '2026-11-07'), sun = await model({}), mon = await model({}, today: '2026-11-09');
    expect(sat.engine.canSealWeek(), isFalse);
    expect(sun.engine.canSealWeek(), isTrue);
    expect(mon.engine.canSealWeek(), isFalse);
    expect(sat.sealWeek(shipped: 'x', notes: '', posts: 0), isFalse, reason: 'refused on the Saturday');
    expect(sat.engine.S['weeks'], isEmpty);
    expect(sat.engine.ledger, isEmpty);
    expect(sat.engine.weekView().state, 'Opens Sunday 8 Nov · 1 day');
    expect(mon.engine.weekView().state, 'Opens Sunday 15 Nov · 6 days');
    expect(sun.engine.weekView().state, 'Ready to seal');
  });

  testWidgets('sealing a week: the entry, the ledger event, a week from before the reset kept beside it', (tester) async {
    final m = await model({
      'weeks': [
        {'week': 3, 'date': '2026-09-27', 'shipped': 'old start', 'dsa': 1, 'posts': 0, 'revenue': 0, 'notes': ''},
      ],
      'problems': {'Arrays|Two Sum': '2026-11-03', 'Arrays|Valid Anagram': '2026-11-04'},
    });
    await open(tester, m);
    await tester.tap(key('chip-week'));
    await tester.pumpAndSettle();
    expect(find.text('Week 3'), findsOneWidget);
    expect(find.text('Ready to seal'), findsOneWidget);
    await tester.enterText(key('week-shipped'), 'a repo');
    await tester.tap(key('posts-plus'));
    await tester.tap(key('posts-plus'));
    await tester.pump();
    await tester.tap(key('week-seal'));
    await tester.pumpAndSettle();
    final weeks = (m.engine.S['weeks'] as List).cast<Map>();
    expect(weeks.length, 2, reason: 'the pre-reset week 3 is kept beside the new one (revisionWeek.from)');
    final mine = weeks.last;
    expect(mine['week'], 3);
    expect(mine['date'], '2026-11-08');
    expect(mine['shipped'], 'a repo');
    expect(mine['posts'], 2);
    expect(mine['dsa'], 2);
    expect(m.engine.ledger.length, 1);
    final ev = m.engine.ledger.single as Map;
    expect(ev['type'], 'week');
    expect(ev['ref'], 'week3');
    expect(ev['ts'], '2026-11-08T09:30:15.123Z');
    expect(m.engine.verifyChain().ok, isTrue);
    expect(find.text('Sealed 8 Nov'), findsOneWidget);
    // Sealing again replaces this week's entry; the old one still stands.
    await tester.enterText(key('week-shipped'), 'a second repo');
    await tester.tap(key('week-seal'));
    await tester.pumpAndSettle();
    final again = (m.engine.S['weeks'] as List).cast<Map>();
    expect(again.length, 2);
    expect(again.last['shipped'], 'a second repo');
    expect(m.engine.ledger.length, 2);
    expect(m.engine.verifyChain().ok, isTrue);
  });

  testWidgets('the seal button is dead on a Wednesday', (tester) async {
    final m = await model({}, today: '2026-11-04');
    await open(tester, m);
    await tester.tap(key('chip-week'));
    await tester.pumpAndSettle();
    expect(find.text('Opens Sunday 8 Nov · 4 days'), findsOneWidget);
    await tester.tap(key('week-seal'), warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(m.engine.S['weeks'], isEmpty);
  });

  test('Library: the revision PDFs resolve beside app-web/', () {
    expect(revisionUrl(3), endsWith('/revision/week-03.pdf'));
    expect(RecordEngine.revisionPdfs, 6);
  });
}
