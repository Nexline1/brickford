// The calendar and the day sheet on the real plan (START_DATE 2026-10-16,
// Saturday rest), a fixed clock and a fixture state:
//   16 Oct  every lecture watched that day, before the quiz gate -> done (tick)
//   27 Oct  every lecture watched that day, after the gate, no quiz passed -> part (half ring)
//   28 Oct  nothing -> missed (red ring)
//   31 Oct  Saturday -> rest (moon)
//   10 Nov  -> ahead (grey ring)
//   27 Dec  gate 1's target -> a diamond
// The expected marks are written out by hand here, and every other cell is
// also held to markForStatus(engine.dayStatus).
import 'dart:convert';

import 'package:app/engine/dates.dart';
import 'package:app/engine/engine.dart';
import 'package:app/main.dart';
import 'package:app/screens/calendar/calendar_screen.dart';
import 'package:app/screens/calendar/day_sheet.dart';
import 'package:app/screens/lesson/lesson_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:app/widgets/day_glyph.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Map<String, dynamic> watched(String on, {String? passed}) => {
  'done': true,
  'doneAt': on,
  'notes': '',
  'checks': <dynamic>[],
  if (passed != null) 'quiz': {'passedAt': passed},
};

/// The plan's own lectures for a day (scheduledFor on a fresh engine: past days are the fixed windows).
Future<List<String>> planKeys(String iso) async {
  final data = await AppModel.loadData(rootBundle);
  return Engine(data, null, today: () => '2026-11-05').realSched(iso).map((it) => it.key).toList();
}

Future<AppModel> model(String today, Map<String, dynamic> state) async {
  SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today);
}

Future<void> pump(WidgetTester tester, AppModel m) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
}

Future<void> openCalendarFromHome(WidgetTester tester) async {
  await tester.tap(find.byKey(const ValueKey('home-calendar')));
  await tester.pumpAndSettle();
  expect(find.byType(CalendarScreen), findsOneWidget);
}

DayMark markAt(WidgetTester tester, String iso) => tester.widget<DayCell>(find.byKey(ValueKey('cal-$iso'))).mark;

Future<Map<String, dynamic>> fixture() async {
  final lessons = <String, dynamic>{};
  for (final k in await planKeys('2026-10-16')) {
    lessons[k] = watched('2026-10-16');
  }
  for (final k in await planKeys('2026-10-27')) {
    lessons[k] = watched('2026-10-27');
  }
  return {'lessons': lessons};
}

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  for (final clock in ['2026-11-05', '2026-11-07']) {
    testWidgets('the month grid: each day carries its own dayStatus mark (clock $clock)', (tester) async {
      final m = await model(clock, await fixture());
      await pump(tester, m);
      await openCalendarFromHome(tester);
      expect(find.text('November'), findsOneWidget);

      // Back to October: the fixture's month.
      await tester.tap(find.byKey(const ValueKey('cal-prev')));
      await tester.pumpAndSettle();
      expect(find.text('October'), findsOneWidget);
      // Sunday-first: 1 Oct 2026 is a Thursday, so four blank cells before it.
      final grid = find.byKey(const ValueKey('cal-grid'));
      expect(
        tester.getTopLeft(find.byKey(const ValueKey('cal-2026-10-04'))).dx,
        closeTo(tester.getTopLeft(grid).dx, 0.5),
        reason: 'Sunday is the first column',
      );
      expect(markAt(tester, '2026-10-01'), DayMark.none, reason: 'before the start');
      expect(markAt(tester, '2026-10-16'), DayMark.done, reason: 'watched, before the gate');
      expect(markAt(tester, '2026-10-27'), DayMark.part, reason: 'watched, quizzes pending');
      expect(markAt(tester, '2026-10-28'), DayMark.missed);
      expect(markAt(tester, '2026-10-31'), DayMark.rest);
      expect(markAt(tester, '2026-10-17'), DayMark.rest);
      expect(markAt(tester, '2026-10-26'), DayMark.missed, reason: 'a lecture shared with the 27th, watched on the 27th');
      for (var d = 1; d <= 31; d++) {
        final iso = '2026-10-${d.toString().padLeft(2, '0')}';
        final want = iso.compareTo(m.engine.START_DATE) < 0 ? DayMark.none : markForStatus(m.engine.dayStatus(iso));
        expect(markAt(tester, iso), want, reason: iso);
      }

      // Forward to November: ahead, rest, and today.
      await tester.tap(find.byKey(const ValueKey('cal-next')));
      await tester.pumpAndSettle();
      expect(markAt(tester, '2026-11-10'), DayMark.open);
      expect(markAt(tester, '2026-11-07'), DayMark.rest);
      expect(tester.widget<DayCell>(find.byKey(ValueKey('cal-$clock'))).today, isTrue);

      // December: gate 1's target date carries the diamond, and nothing else does.
      await tester.tap(find.byKey(const ValueKey('cal-next')));
      await tester.pumpAndSettle();
      expect(m.engine.gatePlan().first.target, '2026-12-27');
      final gated = [
        for (final c in tester.widgetList<DayCell>(find.byType(DayCell)))
          if (c.gate) c.iso,
      ];
      expect(gated, ['2026-12-27']);
      expect(markAt(tester, '2026-12-27'), DayMark.open);

      // Today comes back to the current month.
      await tester.tap(find.byKey(const ValueKey('cal-today')));
      await tester.pumpAndSettle();
      expect(find.text('November'), findsOneWidget);
    });
  }

  testWidgets('the day sheet: one row per lecture, glyphs match lessonCleared; a past day keeps its plan on a Saturday', (tester) async {
    final keys = await planKeys('2026-10-27');
    // T-063's case: the clock on a rest day, a past day's lectures must be its own.
    expect(keys, ['math110.0.15', 'math110.1.0', 'ai200.1.2', 'spch100.2.1']);
    final m = await model('2026-11-07', {
      'lessons': {
        keys[0]: watched('2026-10-27', passed: '2026-10-27'), // cleared
        keys[1]: watched('2026-10-27'), // watched, quiz open
        // keys[2], keys[3]: not watched
      },
    });
    await pump(tester, m);
    await openCalendarFromHome(tester);
    await tester.tap(find.byKey(const ValueKey('cal-prev')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('cal-2026-10-27')));
    await tester.pumpAndSettle();

    expect(find.byType(DaySheet), findsOneWidget);
    expect(find.text('TUESDAY'), findsOneWidget);
    expect(find.text('27 October'), findsOneWidget);
    expect(tester.widget<Text>(find.byKey(const ValueKey('day-sub'))).data, 'Day 10 · Week 2');
    expect(m.engine.studyIndex('2026-10-27') + 1, 10);

    final rows = m.engine.scheduledFor('2026-10-27');
    expect([for (final it in rows) it.key], keys, reason: 'the frozen plan, on a Saturday clock');
    final want = {keys[0]: DayMark.done, keys[1]: DayMark.part, keys[2]: DayMark.open, keys[3]: DayMark.open};
    for (final it in rows) {
      final g = tester.widget<DayGlyph>(find.byKey(ValueKey('day-glyph-${it.key}')));
      final cleared = m.engine.lessonCleared(it.key);
      final seen = truthy(m.lesson(it.key)['done']);
      expect(g.mark, cleared ? DayMark.done : (seen ? DayMark.part : DayMark.open), reason: it.key);
      expect(g.mark, want[it.key], reason: it.key);
    }
    expect(m.engine.lessonCleared(keys[0]), isTrue);
    expect(m.engine.lessonCleared(keys[1]), isFalse);

    // A row opens the lecture.
    await tester.tap(find.byKey(ValueKey('day-row-${keys[2]}')));
    await tester.pumpAndSettle();
    final lesson = tester.widget<LessonScreen>(find.byType(LessonScreen));
    expect('${lesson.cid}.${lesson.ui}.${lesson.li}', keys[2]);
  });

  testWidgets('a rest-day Saturday: the moon, the week, and no rows', (tester) async {
    final m = await model('2026-11-07', {});
    await pump(tester, m);
    await openCalendarFromHome(tester);
    await tester.tap(find.byKey(const ValueKey('cal-2026-11-07')));
    await tester.pumpAndSettle();
    expect(find.text('SATURDAY'), findsOneWidget);
    expect(tester.widget<Text>(find.byKey(const ValueKey('day-sub'))).data, 'Week 4');
    expect(tester.widget<DayGlyph>(find.byKey(const ValueKey('day-mark'))).mark, DayMark.rest);
    expect(
      find.descendant(
        of: find.byType(DaySheet),
        matching: find.byWidgetPredicate((w) => w.key is ValueKey && '${(w.key! as ValueKey).value}'.startsWith('day-row-')),
      ),
      findsNothing,
    );
  });

  testWidgets('a seal Sunday carries its revision week; the calendar shows this week\'s seal tile', (tester) async {
    final m = await model('2026-11-05', {});
    await pump(tester, m);
    await openCalendarFromHome(tester);
    final w = m.engine.revisionWeek(m.engine.revisionWeekOf('2026-11-05'));
    expect(w.sun, '2026-11-08');
    final tile = tester.widget<SealTile>(find.byKey(const ValueKey('cal-seal')));
    expect(tile.week, m.engine.revisionWeekOf('2026-11-05'));
    expect(tile.range, shortRange(w.from, w.to));
    await tester.tap(find.byKey(const ValueKey('cal-2026-11-08')));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('day-seal')), findsOneWidget);
  });

  // T-066: the Publish track anchored on speechSlot(today), which is -1 on a Friday (the rep day) and
  // on a Saturday, so every past Storytelling day re-anchored to the first UNWATCHED lecture: a day
  // whose Storytelling was watched listed other lectures and read "part". The past is the same on
  // Thursday, Friday and Saturday.
  List<String> daysFrom(String a, String b) => [for (var d = a; !lt(b, d); d = addDaysISO(d, 1)) d];
  List<String> sched(Engine e, String d) => [for (final it in e.scheduledFor(d)) '${it.track}:${it.key}'];
  List<String> publish(List<String> l) => [for (final x in l) if (x.startsWith('Publish:')) x];

  testWidgets('T-066: the Publish items of a past day are the same on a Thursday, Friday and Saturday clock; Fridays and Saturdays schedule none', (tester) async {
    const thu = '2026-11-05', fri = '2026-11-06', sat = '2026-11-07';
    final data = await AppModel.loadData(rootBundle);
    final plan = Engine(data, null, today: () => '2026-10-10'); // before the start: the fixed plan
    final watchedDays = [for (final d in daysFrom(plan.START_DATE, '2026-10-27')) if (plan.studyIndex(d) >= 0) d];
    final speechWatched = [for (final d in watchedDays) if (publish(sched(plan, d)).isNotEmpty) d];
    expect(speechWatched.length, 8, reason: 'eight watched Storytelling days');
    final lessons = {for (final d in watchedDays) for (final it in plan.realSched(d)) it.key: watched('2026-10-17')};
    Engine at(String clock) => Engine(data, jsonDecode(jsonEncode({'lessons': lessons})) as Map<String, dynamic>, today: () => clock);
    final onThu = at(thu), onFri = at(fri), onSat = at(sat);

    var publishItems = 0;
    for (final d in daysFrom(plan.START_DATE, thu)) {
      expect(sched(onFri, d), sched(onThu, d), reason: 'Friday clock, $d');
      expect(sched(onSat, d), sched(onThu, d), reason: 'Saturday clock, $d');
      if (d != thu) {
        expect(onFri.dayStatus(d), onThu.dayStatus(d), reason: 'Friday clock status, $d');
        expect(onSat.dayStatus(d), onThu.dayStatus(d), reason: 'Saturday clock status, $d');
      }
      publishItems += publish(sched(onSat, d)).length;
    }
    expect(publishItems, greaterThan(0));
    for (final d in speechWatched) {
      expect(publish(sched(onSat, d)), publish(sched(plan, d)), reason: 'Saturday clock lists $d from the fixed plan');
      expect(onSat.dayStatus(d), 'completed', reason: '$d is completed, not part');
    }
    final fridays = [for (final d in daysFrom(plan.START_DATE, sat)) if (dowOf(d) == 5) d];
    expect(fridays.length, greaterThanOrEqualTo(3));
    for (final d in fridays) {
      expect(publish(sched(onSat, d)), isEmpty, reason: 'Friday $d, Saturday clock');
      expect(publish(sched(onFri, d)), isEmpty, reason: 'Friday $d, Friday clock');
      expect(sched(onFri, d), isNotEmpty, reason: 'Friday $d still has Theory and Build');
    }
    expect(onSat.scheduledFor(sat), isEmpty);
  });

  testWidgets('T-066: on a Saturday the month grid shows the watched Storytelling days as done', (tester) async {
    final data = await AppModel.loadData(rootBundle);
    final plan = Engine(data, null, today: () => '2026-10-10');
    final days = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'];
    for (final d in days) {
      expect(publish(sched(plan, d)), isNotEmpty, reason: '$d has a Storytelling lecture');
    }
    final m = await model('2026-11-07', {
      'lessons': {for (final d in days) for (final it in plan.realSched(d)) it.key: watched('2026-10-17')},
    });
    await pump(tester, m);
    await openCalendarFromHome(tester);
    await tester.tap(find.byKey(const ValueKey('cal-prev')));
    await tester.pumpAndSettle();
    expect(find.text('October'), findsOneWidget);
    for (final d in days) {
      expect(markAt(tester, d), DayMark.done, reason: d);
      expect(markAt(tester, d), markForStatus(m.engine.dayStatus(d)), reason: d);
    }
  });

  testWidgets('tap targets: every day, the month buttons, the day rows and both Home entry points are at least 44', (tester) async {
    final m = await model('2026-11-05', await fixture());
    await pump(tester, m);
    void atLeast44(Finder f) {
      expect(f, findsWidgets);
      for (final e in f.evaluate()) {
        final s = (e.renderObject! as RenderBox).size;
        expect(s.width >= 44 && s.height >= 44, isTrue, reason: '${e.widget.key} is $s');
      }
    }

    atLeast44(find.byKey(const ValueKey('home-calendar')));
    atLeast44(find.byKey(const ValueKey('chip-calendar')));
    // The chip opens the calendar too.
    await tester.tap(find.byKey(const ValueKey('chip-calendar')));
    await tester.pumpAndSettle();
    expect(find.byType(CalendarScreen), findsOneWidget);
    atLeast44(find.byType(DayCell));
    for (final k in ['cal-prev', 'cal-next', 'cal-today', 'cal-seal']) {
      atLeast44(find.byKey(ValueKey(k)));
    }
    await tester.tap(find.byKey(const ValueKey('cal-2026-11-05')));
    await tester.pumpAndSettle();
    atLeast44(find.descendant(of: find.byType(DaySheet), matching: find.byType(InkWell)));
  });
}
