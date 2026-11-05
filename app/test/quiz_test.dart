// T-064 stage 4: the lecture quiz. Answering shows the feedback and the
// explanation; a miss comes back; finishing records the pass in the web
// app's shape and clears the lecture everywhere that reads lessonCleared.
import 'dart:convert';

import 'package:app/engine/quiz.dart';
import 'package:app/main.dart';
import 'package:app/screens/quiz/quiz_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:app/widgets/question_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

const k = 'math110.0.0'; // two checks: one multiple choice, one numeric

Map<String, dynamic> watched(String on) => {'done': true, 'doneAt': on, 'notes': '', 'checks': <dynamic>[]};

Future<AppModel> model(String today, Map<String, dynamic> state) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  final m = AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => DateTime.utc(2026, 10, 27, 9));
  await m.ensureSummaries();
  return m;
}

Future<void> openQuiz(WidgetTester tester, AppModel m, {double Function()? rand}) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
  tester.state<NavigatorState>(find.byType(Navigator).first).push(MaterialPageRoute(builder: (_) => QuizScreen.lecture(k, rand: rand)));
  await tester.pumpAndSettle();
}

QuestionView current(WidgetTester tester) => tester.widget<QuestionView>(find.byType(QuestionView));

/// Answer the question on screen: right, or (an option question) the first wrong slot.
Future<void> answer(WidgetTester tester, {required bool right}) async {
  final q = current(tester).q;
  if (q['opts'] != null) {
    final a = q['a'] as int;
    await tester.tap(find.byKey(ValueKey('opt-${right ? a : (a == 0 ? 1 : 0)}')));
  } else {
    final field = find.descendant(of: find.byKey(const ValueKey('quiz-num')), matching: find.byType(TextField));
    await tester.enterText(field, right ? '${q['num']}'.replaceAll('.', ',') : 'zzz');
    await tester.tap(find.byKey(const ValueKey('quiz-submit')));
  }
  await tester.pumpAndSettle();
}

void main() {
  const gateState = {'lessons': {k: {'done': true, 'doneAt': '2026-10-26', 'notes': '', 'checks': []}}};

  testWidgets('answering: the feedback and the explanation appear, a miss turns its segment red and comes back', (tester) async {
    final m = await model('2026-10-27', gateState);
    expect(m.engine.lessonCleared(k), isFalse, reason: 'watched after the gate, quiz not passed');
    await openQuiz(tester, m, rand: () => 0.0);
    expect(find.byKey(const ValueKey('quiz-feedback')), findsNothing);
    expect(find.byKey(const ValueKey('quiz-count')), findsOneWidget);
    final first = current(tester).q;
    await answer(tester, right: false);
    expect(find.byKey(const ValueKey('quiz-feedback')), findsOneWidget);
    expect(find.text('Not quite'), findsOneWidget);
    expect(find.byKey(const ValueKey('quiz-next')), findsOneWidget);
    expect(find.byWidgetPredicate((w) => w.key.toString().contains('seg-') && w.key.toString().contains('-miss')), findsOneWidget);
    // Nothing is recorded before the sitting ends.
    expect(m.engine.quizPassed(k), isFalse);
    await tester.tap(find.byKey(const ValueKey('quiz-next')));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('quiz-feedback')), findsNothing);
    expect(current(tester).q['q'], isNot(first['q']), reason: 'the other question comes before the retry');
    await answer(tester, right: true);
    expect(find.text('Correct'), findsOneWidget);
    // The miss is next, and it is marked as coming back.
    await tester.tap(find.byKey(const ValueKey('quiz-next')));
    await tester.pumpAndSettle();
    expect(current(tester).q['q'], first['q']);
    expect(current(tester).again, isTrue);
    expect(tester.takeException(), isNull);
  });

  testWidgets('passing the quiz clears the lecture: the record has the web shape, Home and the glyph follow', (tester) async {
    final m = await model('2026-10-27', gateState);
    expect(m.markOf(k), LessonMark.watched);
    await openQuiz(tester, m, rand: () => 0.5);
    await answer(tester, right: true);
    await tester.tap(find.byKey(const ValueKey('quiz-next')));
    await tester.pumpAndSettle();
    await answer(tester, right: true); // a numeric answer with a decimal comma
    expect(find.text('Finish'), findsNothing, reason: 'the last question reads Finish only on its own button');
    await tester.tap(find.byKey(const ValueKey('quiz-next')));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('quiz-passed')), findsOneWidget);
    final q = (m.lesson(k)['quiz'] as Map).cast<String, dynamic>();
    expect(q['passedAt'], '2026-10-27');
    expect(q['firstTry'], 2);
    expect(q['total'], 2);
    expect(q['attempts'], 2);
    expect(q['at'], '2026-10-27T09:00:00.000Z');
    expect(m.engine.quizPassed(k), isTrue);
    expect(m.engine.lessonCleared(k), isTrue);
    expect(m.markOf(k), LessonMark.cleared);
    // Saved under the web app's key, in the web app's shape.
    final saved = jsonDecode(m.prefs.getString(AppModel.storageKey)!) as Map;
    expect((saved['lessons'][k]['quiz'] as Map)['passedAt'], '2026-10-27');
    // Done goes back to the screen under it.
    await tester.tap(find.byKey(const ValueKey('quiz-done')));
    await tester.pumpAndSettle();
    expect(find.byType(QuizScreen), findsNothing);
  });

  test('a later sitting only raises the best first-try score, and a pass is never undone', () async {
    final m = await model('2026-10-27', gateState);
    m.engine.recordQuizPass(k, const SittingResult(total: 2, firstTry: 1, attempts: 3, missed: [0]), 'x');
    final first = Map<String, dynamic>.from(m.lesson(k)['quiz'] as Map);
    m.engine.recordQuizPass(k, const SittingResult(total: 2, firstTry: 0, attempts: 4, missed: [0, 1]), 'y');
    expect(m.lesson(k)['quiz'], first, reason: 'a worse sitting changes nothing');
    m.engine.recordQuizPass(k, const SittingResult(total: 2, firstTry: 2, attempts: 2, missed: []), 'z');
    final q = m.lesson(k)['quiz'] as Map;
    expect([q['firstTry'], q['total'], q['attempts']], [2, 2, 2]);
    expect(q['passedAt'], '2026-10-27');
    expect(q['at'], 'x', reason: 'the stamp of the first pass stays');
  });

  test('grading: option slots are exact, numbers parse the way parseFloat does, with the comma and the tolerance', () {
    expect(gradeAnswer({'opts': ['a', 'b'], 'a': 1}, 1), isTrue);
    expect(gradeAnswer({'opts': ['a', 'b'], 'a': 1}, 0), isFalse);
    expect(gradeAnswer({'num': 5}, '5'), isTrue);
    expect(gradeAnswer({'num': 2.5}, '2,5'), isTrue);
    expect(gradeAnswer({'num': 5}, ' 5.0abc'), isTrue, reason: 'parseFloat reads the numeric prefix');
    expect(gradeAnswer({'num': 5}, 'abc'), isFalse);
    expect(gradeAnswer({'num': 5}, '5.000002'), isFalse, reason: 'the default tolerance is 1e-6');
    expect(gradeAnswer({'num': 5, 'tol': 0.01}, '5.005'), isTrue);
    expect(gradeAnswer({'num': 5}, 'Infinity'), isFalse);
    expect(gradeAnswer({'num': 1.234}, '1,234.5'), isTrue, reason: 'only the first comma becomes a point: 1.234.5 parses as 1.234');
  });
}
