// T-064 stage 6a: Atlas, Recall, Drill and Electives under the Learn tab.
// The fixture, on 2026-11-04 (plan day 17): six courses are running, math110.0.0 and .0.1 are watched,
// math110.0.1 is proven and in the rotation.
import 'dart:convert';

import 'package:app/engine/learn.dart';
import 'package:app/engine/quiz.dart';
import 'package:app/engine/record.dart';
import 'package:app/main.dart';
import 'package:app/screens/learn/recall_screen.dart';
import 'package:app/screens/quiz/quiz_screen.dart';
import 'package:app/widgets/question_view.dart';
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

  // ---------- Recall ----------

  Map<String, dynamic> reviewState({String due = '2026-11-03'}) => {
    'lessons': {
      'math110.0.0': w('2026-10-20', more: {'verified': true, 'verifiedAt': '2026-10-21'}),
      'math110.0.1': w('2026-10-21', more: {'verified': true, 'verifiedAt': '2026-10-22'}),
    },
    'review': {
      'math110.0.0': {'box': 1, 'due': due, 'last': '2026-10-27', 'lapses': 0},
      'math110.0.1': {'box': 1, 'due': '2026-11-20', 'last': '2026-11-13', 'lapses': 1},
    },
  };

  testWidgets('answering a Recall item reschedules it: solid moves a box out, forgot resets and counts a lapse, one event each', (tester) async {
    final m = await model(reviewState());
    await openLearn(tester, m);
    await tool(tester, 'recall');
    expect(find.byType(RecallScreen), findsOneWidget);
    expect(find.byKey(const ValueKey('recall-card-math110.0.0')), findsOneWidget);
    expect(find.byKey(const ValueKey('recall-card-math110.0.1')), findsNothing, reason: 'due on the 20th, so only coming up');
    expect(find.byKey(const ValueKey('recall-next-math110.0.1')), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('recall-solid-math110.0.0')));
    await tester.pumpAndSettle();
    var rv = m.engine.review['math110.0.0'] as Map;
    expect(rv, {'box': 2, 'due': '2026-11-25', 'last': '2026-11-04', 'lapses': 0}, reason: 'box 1 -> 2 is 21 days from today');
    expect(find.byKey(const ValueKey('recall-card-math110.0.0')), findsNothing, reason: 'it left the due list');
    expect(find.byKey(const ValueKey('recall-empty')), findsOneWidget);
    final ev = m.engine.S['ledger'].last as Map;
    expect([ev['type'], ev['ref'], ev['data']], ['recall', 'math110.0.0', {'grade': 'solid', 'box': 2}]);
    // Forgot: back to the first box, a lapse counted.
    m.engine.review['math110.0.0']['due'] = '2026-11-04';
    m.refresh();
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('recall-forgot-math110.0.0')));
    await tester.pumpAndSettle();
    rv = m.engine.review['math110.0.0'] as Map;
    expect(rv, {'box': 0, 'due': '2026-11-06', 'last': '2026-11-04', 'lapses': 1});
    expect((m.engine.S['ledger'] as List).length, 2);
    expect(m.engine.reviewsDue(), isEmpty);
    expect(m.engine.verifyChain().ok, isTrue, reason: 'the events chain');
  });

  testWidgets('Home shows the review row only while something is due, with its button into Recall', (tester) async {
    final m = await model(reviewState(due: '2026-11-20'));
    tester.view.physicalSize = const Size(375 * 3, 812 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(BrickfordApp(model: m));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('home-review')), findsNothing, reason: 'nothing due on the 4th');
    // Something falls due: the row appears with the count and a 44px button.
    m.engine.review['math110.0.0']['due'] = '2026-11-04';
    m.engine.review['math110.0.1']['due'] = '2026-11-01';
    m.refresh();
    await tester.pumpAndSettle();
    await tester.dragUntilVisible(find.byKey(const ValueKey('home-review')), find.byType(Scrollable).last, const Offset(0, -120));
    expect(find.byKey(const ValueKey('home-review')), findsOneWidget);
    expect(find.descendant(of: find.byKey(const ValueKey('home-review')), matching: find.textContaining('2', findRichText: true)), findsWidgets);
    final size = tester.getSize(find.byKey(const ValueKey('home-review-go')));
    expect(size.width >= 44 && size.height >= 44, isTrue, reason: 'button is $size');
    await tester.tap(find.byKey(const ValueKey('home-review-go')));
    await tester.pumpAndSettle();
    expect(find.byType(RecallScreen), findsOneWidget);
    expect(find.byKey(const ValueKey('recall-card-math110.0.1')), findsOneWidget);
    expect(find.byKey(const ValueKey('recall-card-math110.0.0')), findsOneWidget);
  });

  // ---------- Drill ----------

  QuestionView current(WidgetTester tester) => tester.widget<QuestionView>(find.byType(QuestionView));

  testWidgets('Drill: ten questions (three misses padded from what is taught); right answers leave the miss pool, a wrong one stays', (tester) async {
    final m = await model({
      'lessons': {'math120.0.0': w('2026-10-20')},
      'quizMisses': {'calculus': [0, 1, 2]},
    });
    await openLearn(tester, m);
    var seed = 7;
    double rand() => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    tester.state<NavigatorState>(find.byType(Navigator).first).push(MaterialPageRoute(builder: (_) => QuizScreen.drill(rand: rand)));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(find.byKey(const ValueKey('quiz-count'))).data, '1');
    String? wrong;
    for (var i = 0; i < 10; i++) {
      final q = current(tester).q;
      if (i == 0) wrong = '${q['q']}';
      if (q['opts'] != null) {
        final a = q['a'] as int;
        await tester.tap(find.byKey(ValueKey('opt-${i == 0 ? (a == 0 ? 1 : 0) : a}')));
      } else {
        final field = find.descendant(of: find.byKey(const ValueKey('quiz-num')), matching: find.byType(TextField));
        await tester.enterText(field, i == 0 ? 'zzz' : '${q['num']}'.replaceAll('.', ','));
        await tester.tap(find.byKey(const ValueKey('quiz-submit')));
      }
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('quiz-next')));
      await tester.pumpAndSettle();
    }
    expect(find.byKey(const ValueKey('quiz-result')), findsOneWidget);
    // Which question was the wrong one?
    final pool = <String>[];
    m.data.quizzes.forEach((b, v) {
      final qs = (v as Map)['questions'] as List;
      for (var i = 0; i < qs.length; i++) {
        if ('${qs[i]['q']}' == wrong) pool.add('$b|$i');
      }
    });
    final misses = [for (final p in m.engine.missPool()) '${p.bankId}|${p.idx}'];
    expect(misses, pool, reason: 'only the wrong answer is in the pool: the three right misses left, no padded question joined');
    expect((m.engine.S['ledger'] as List), isEmpty, reason: 'the web drill chains nothing');
  });

  testWidgets('Drill with nothing taught shows nothing to drill', (tester) async {
    final m = await model({});
    await openLearn(tester, m);
    await tool(tester, 'drill');
    expect(find.byKey(const ValueKey('drill-empty')), findsOneWidget);
  });
}
