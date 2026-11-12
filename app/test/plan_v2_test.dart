// T-067 Plan v2 on the Flutter side: the engine's v2 days (the cutover, the bridge, the second pass),
// the second pass re-using the first pass's quiz by alias, and the lesson screen's "Needs" (ticked when
// watched) and "Leads to" rows. Day-by-day parity with app.js is tools/verify-app.js; this is the screen.
import 'package:app/engine/engine.dart';
import 'package:app/main.dart';
import 'package:app/screens/lesson/lesson_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<AppModel> model(Map<String, Object> prefs) async {
  SharedPreferences.setMockInitialValues(prefs);
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => '2026-11-12');
}

List<String> keys(Engine e, String iso, String track) =>
    [for (final it in e.scheduledFor(iso)) if (!it.pseudo && it.track == track) it.key];

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  test('the cutover: v1 before 22 Nov 2026, the v2 sequence from it (sequence.md, first week)', () async {
    final m = await model({});
    final e = m.engine;
    expect(Engine.PLAN_V2_FROM, '2026-11-22');
    expect(keys(e, '2026-11-22', 'Theory'), ['math110.1.8']);
    expect(keys(e, '2026-11-22', 'Build'), ['cs100.0.3']);
    expect(keys(e, '2026-11-24', 'Theory'), ['math130.0.10']);
    expect(keys(e, '2026-11-27', 'Build'), ['cs100.2.0']);        // a Friday: the no-code talk
    expect(keys(e, '2027-01-05', 'Build'), ['ai200.3.0']);        // the second pass opens with Micrograd
    // Optional lectures are never scheduled; the video-less 18.03 lecture 18 neither.
    final scheduled = <String>{};
    for (var d = e.studyIndex('2026-11-22'); d < 1094; d++) {
      for (final it in e.scheduledFor(e.dateForStudy(d))) {
        if (!it.pseudo) scheduled.add(it.key);
      }
    }
    for (final k in ['cs100.0.0', 'cs100.0.1', 'cs100.0.2', 'math120.1.6', 'phys100.0.9', 'ai210.0.5', 'math210.0.16', 'math150.0.17']) {
      expect(scheduled.contains(k), isFalse, reason: k);
    }
    expect(scheduled.contains('math150.0.18'), isTrue);
  });

  test('the second pass has the first pass\'s quiz by alias; an optional lecture never locks the next', () async {
    final m = await model({});
    final e = m.engine;
    expect(e.sumKey('ai200.3.0'), 'ai200.1.0');
    expect(e.hasQuiz('ai200.3.0'), e.hasQuiz('ai200.1.0'));
    expect(e.hasQuiz('ai200.3.0'), isTrue);
    expect(e.hasQuiz('phys100.0.9'), isTrue);                    // an optional exam review with a quiz ...
    expect(e.lockedBy('phys100', 0, 10), isNull);                // ... does not hold back the lecture after it
  });

  testWidgets('the lesson screen lists Needs, ticked when watched, and Leads to; a row opens that lecture', (tester) async {
    final m = await model({
      AppModel.storageKey: '{"lessons":{"cs100.0.8":{"done":true,"doneAt":"2026-11-10","notes":"","checks":[]}}}',
    });
    tester.view.physicalSize = const Size(375 * 3, 812 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(BrickfordApp(model: m));
    await tester.pumpAndSettle();
    final nav = tester.state<NavigatorState>(find.byType(Navigator).first);
    nav.push(MaterialPageRoute<void>(builder: (_) => const LessonScreen(cid: 'ai200', ui: 3, li: 0)));
    await tester.pumpAndSettle();
    final needs = m.engine.needsOf('ai200.3.0');
    expect(needs, ['cs100.0.8', 'cs100.0.9', 'math120.0.3', 'ai200.0.3']);
    final list = find.descendant(of: find.byType(LessonScreen), matching: find.byType(Scrollable)).first;
    Finder row(String k) => find.byWidgetPredicate((w) => w is Semantics && w.properties.identifier == 'lesson-map-$k');
    await tester.scrollUntilVisible(find.text('Needs · 1 of 4 watched'), 200, scrollable: list);
    // Each need is a row; the watched one carries the tick, the others the open circle.
    for (final k in needs) {
      await tester.scrollUntilVisible(row(k), 200, scrollable: list);
      expect(row(k), findsOneWidget, reason: k);
      expect(find.descendant(of: row(k), matching: find.byIcon(k == 'cs100.0.8' ? Icons.check : Icons.radio_button_unchecked)), findsOneWidget, reason: k);
    }
    await tester.scrollUntilVisible(find.text('Leads to'), 200, scrollable: list);
    expect(m.engine.leadsTo('ai200.3.0'), contains('ai200.3.1'));
    await tester.scrollUntilVisible(row('ai200.3.1'), 200, scrollable: list);
    await tester.drag(list, const Offset(0, -200));   // off the screen's foot, so the tap lands on the row
    await tester.pumpAndSettle();
    await tester.tap(find.descendant(of: row('ai200.3.1'), matching: find.text('AI 200')));
    await tester.pumpAndSettle();
    final top = tester.widgetList<LessonScreen>(find.byType(LessonScreen)).last;
    expect('${top.cid}.${top.ui}.${top.li}', 'ai200.3.1');
  });
}
