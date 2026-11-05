// T-064 stage 6a: Atlas, Recall, Drill and Electives under the Learn tab.
// The fixture, on 2026-11-04 (plan day 17): six courses are running, math110.0.0 and .0.1 are watched,
// math110.0.1 is proven and in the rotation.
import 'dart:convert';

import 'package:app/engine/learn.dart';
import 'package:app/main.dart';
import 'package:app/screens/course/course_screen.dart';
import 'package:app/shell.dart';
import 'package:app/state/app_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Map<String, dynamic> w(String on, {Map<String, dynamic>? more}) => {'done': true, 'doneAt': on, 'notes': '', 'checks': <dynamic>[], ...?more};

Future<AppModel> model(Map<String, dynamic> state, {String today = '2026-11-04'}) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => DateTime.utc(2026, 11, 4, 9));
}

Future<void> openLearn(WidgetTester tester, AppModel m) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
  await tester.tap(find.descendant(of: find.byKey(const ValueKey('brickford-tabs')), matching: find.byType(BarTab)).at(1));
  await tester.pumpAndSettle();
}

Future<void> tool(WidgetTester tester, String id) async {
  await tester.tap(find.byKey(ValueKey('learn-tool-$id')));
  await tester.pumpAndSettle();
}

/// The sheet's list builds only what is on screen: scroll until [f] is.
Future<void> reveal(WidgetTester tester, Finder f) async {
  await tester.dragUntilVisible(f, find.byType(Scrollable).last, const Offset(0, -240));
  await tester.pumpAndSettle();
}

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  final state = {
    'lessons': {
      'math110.0.0': w('2026-10-20'),
      'math110.0.1': w('2026-10-21', more: {'verified': true, 'verifiedAt': '2026-10-22'}),
    },
  };

  testWidgets('Atlas lists the running courses and the later ones, and a course opens to its units, then a unit to its lectures', (tester) async {
    final m = await model(state);
    await openLearn(tester, m);
    await tool(tester, 'atlas');
    final a = m.engine.atlas();
    expect(find.byKey(const ValueKey('atlas-route')), findsOneWidget);
    expect(find.byKey(const ValueKey('atlas-next-gate')), findsOneWidget);
    expect(a.tiles.length, greaterThan(3));
    for (final t in a.tiles) {
      await reveal(tester, find.byKey(ValueKey('atlas-tile-${t.id}')));
      expect(find.byKey(ValueKey('atlas-tile-${t.id}')), findsOneWidget, reason: '${t.code} is running');
    }
    await reveal(tester, find.byKey(ValueKey('atlas-later-${a.later.first.id}')));
    expect(find.text(monthLabel(m.engine.planDrift().projected, true)), findsOneWidget, reason: 'the header is the finish month');
    // A tile opens its course: a Start/Continue pill and one row per unit.
    await tester.dragUntilVisible(find.byKey(const ValueKey('atlas-tile-math110')), find.byType(Scrollable).last, const Offset(0, 240));
    await tester.tap(find.byKey(const ValueKey('atlas-tile-math110')));
    await tester.pumpAndSettle();
    expect(find.byType(CourseScreen), findsOneWidget);
    expect(find.byKey(const ValueKey('course-continue')), findsOneWidget);
    final units = (m.data.course('math110')!['units'] as List).length;
    for (var u = 0; u < units; u++) {
      await reveal(tester, find.byKey(ValueKey('unit-math110-$u')));
      expect(find.byKey(ValueKey('unit-math110-$u')), findsOneWidget);
    }
    // A unit opens to its lectures, the watched one carrying the half-ring / tick glyph.
    await tester.dragUntilVisible(find.byKey(const ValueKey('unit-math110-0')), find.byType(Scrollable).last, const Offset(0, 240));
    await tester.tap(find.byKey(const ValueKey('unit-math110-0')));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('lesson-math110-0-0')), findsOneWidget);
    expect(find.byKey(const ValueKey('lesson-math110-0-1')), findsOneWidget);
    expect(find.byKey(const ValueKey('unit-math110-1')), findsNothing, reason: 'a unit page shows only its own lectures');
  });

  testWidgets('Atlas counts: proven (not watched) in a tile, watched in a unit, and the tracker counts DSA', (tester) async {
    final m = await model({...state, 'problems': {'Arrays & Hashing|Two Sum': '2026-11-01', 'Stack|Min Stack': true}});
    final a = m.engine.atlas();
    final t = a.tiles.firstWhere((t) => t.id == 'math110');
    expect(t.meta, '1 of ${t.of} proven');
    expect(m.engine.unitCounts('math110').first.done, 2);
    expect(a.tiles.firstWhere((t) => t.tracker).meta, '2 of 150 problems');
  });
}
