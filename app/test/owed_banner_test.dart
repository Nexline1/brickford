// T-079 (Flutter): the owed list and the Home banner. owedList walks what backlogCount walks plus today, once per
// lecture, oldest first, with due = the frozen scheduledFor and late in study days (a Saturday adds none: Friday's
// lecture is 1 late on the Saturday and on the Sunday); backlogCount is the late entries. The banner: five rows
// labelled today / 1 day late / N days late, the rest behind "+N more", each row opening its lecture, 44px rows,
// nothing when nothing is owed, a row gone once its lecture is watched, and building it writes nothing.
//
// Parity with app.js on the same inputs is tools/verify-app.js; these pin the behaviour on the Dart side.
import 'dart:convert';

import 'package:app/main.dart';
import 'package:app/screens/lesson/lesson_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<AppModel> model({Map<String, dynamic>? state, required String today}) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({if (state != null) AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => DateTime.parse('${today}T12:00:00Z'));
}

Finder key(String s) => find.byKey(ValueKey(s));

Future<void> reveal(WidgetTester t, Finder f) async {
  await t.scrollUntilVisible(f, 200, scrollable: find.descendant(of: find.byKey(SheetScaffold.sheetKey), matching: find.byType(Scrollable)).first);
  await t.pumpAndSettle();
}

Future<void> home(WidgetTester t, AppModel m) async {
  t.view.physicalSize = const Size(375 * 3, 812 * 3);
  t.view.devicePixelRatio = 3;
  addTearDown(t.view.reset);
  await t.pumpWidget(BrickfordApp(model: m));
  await t.pumpAndSettle();
}

const fri = {'studyDays': ['2026-11-27']};

void main() {
  test('Friday owed: late 0 on the Friday, 1 on the Saturday (nothing new), 1 on the Sunday; backlogCount is the late entries', () async {
    final at = <String, List<List<Object>>>{};
    for (final d in ['2026-11-27', '2026-11-28', '2026-11-29']) {
      final e = (await model(state: fri, today: d)).engine;
      at[d] = [for (final o in e.owedList()) [o.k, o.due, o.late]];
      expect(e.backlogCount(), e.owedList().where((o) => o.late > 0).length, reason: d);
    }
    expect(at['2026-11-27']!.every((x) => x[2] == 0), isTrue);
    expect([for (final x in at['2026-11-28']!) x[0]], [for (final x in at['2026-11-27']!) x[0]], reason: 'a Saturday adds no entries');
    expect(at['2026-11-28']!.every((x) => x[2] == 1), isTrue);
    final sunFri = at['2026-11-29']!.where((x) => x[1] == '2026-11-27').toList();
    expect(sunFri, isNotEmpty);
    expect(sunFri.every((x) => x[2] == 1), isTrue, reason: 'a Saturday is not a late day');
    expect(at['2026-11-29']!.any((x) => x[1] == '2026-11-29' && x[2] == 0), isTrue);
  });

  test('a frozen scheduledFor is the due date; an optional lecture is never listed', () async {
    var e = (await model(state: fri, today: '2026-11-29')).engine;
    final k = e.owedList().first.k;
    e = (await model(state: {...fri, 'lessons': {k: {'scheduledFor': '2026-11-26'}}}, today: '2026-11-29')).engine;
    expect([e.owedList().first.k, e.owedList().first.due, e.owedList().first.late], [k, '2026-11-26', 2]);
    e = (await model(state: {'studyDays': ['2026-11-16']}, today: '2026-11-23')).engine;
    expect(e.owedList().any((o) => o.k == 'ai200.2.0'), isFalse);
    expect(e.owedList(), isNotEmpty);
  });

  testWidgets('the banner: five rows labelled by lateness, +N more, 44px rows, a row opens its lecture; building writes nothing', (t) async {
    final m = await model(state: {'studyDays': ['2026-11-25']}, today: '2026-11-29');
    final list = m.engine.owedList();
    expect(list.length, greaterThan(5));
    final before = m.prefs.getString(AppModel.storageKey);
    await home(t, m);
    await reveal(t, key('home-owed'));
    expect(find.text('Not watched yet · ${list.length}'), findsOneWidget);
    for (final o in list.take(5)) {
      await reveal(t, key('home-owed-${o.k}'));
      expect(find.descendant(of: key('home-owed-${o.k}'), matching: find.text(o.label)), findsOneWidget);
      final r = t.getRect(key('home-owed-${o.k}'));
      expect(r.width >= 44 && r.height >= 44, isTrue, reason: '${o.k} is ${r.size}');
    }
    expect(['3 days late', '2 days late', '1 day late', 'today'].every((w) => list.any((o) => o.label == w)), isTrue);
    expect(key('home-owed-${list[5].k}'), findsNothing, reason: 'the sixth sits behind +N more');
    await reveal(t, key('home-owed-more'));
    expect(find.text('+${list.length - 5} more'), findsOneWidget);
    await t.tap(key('home-owed-more'));
    await t.pumpAndSettle();
    await reveal(t, key('home-owed-${list[5].k}'));
    expect(key('home-owed-${list[5].k}'), findsOneWidget);
    expect(m.prefs.getString(AppModel.storageKey), before, reason: 'a build is a read');
    await t.tap(key('home-owed-${list[5].k}'));
    await t.pumpAndSettle();
    final ls = t.widget<LessonScreen>(find.byType(LessonScreen));
    expect('${ls.cid}.${ls.ui}.${ls.li}', list[5].k);
    expect(t.takeException(), isNull);
  });

  testWidgets('watching a lecture removes its row', (t) async {
    final m = await model(state: {'studyDays': ['2026-11-25']}, today: '2026-11-29');
    final o = m.engine.owedList().firstWhere((o) => !m.engine.hasQuiz(o.k));
    await home(t, m);
    await reveal(t, key('home-owed-${o.k}'));
    m.toggleDone(o.k);
    await t.pumpAndSettle();
    expect(key('home-owed-${o.k}'), findsNothing);
    expect(m.engine.owedList().any((x) => x.k == o.k), isFalse);
  });

  testWidgets('nothing owed: no banner under the next action', (t) async {
    final none = await model(today: '2026-11-29');
    expect(none.engine.owedList(), isEmpty);
    await home(t, none);
    await reveal(t, key('home-nextup'));
    expect(key('home-nextup'), findsOneWidget, reason: 'the place the banner would be is built');
    expect(key('home-owed'), findsNothing);
    expect(find.textContaining('Not watched yet'), findsNothing);
  });
}
