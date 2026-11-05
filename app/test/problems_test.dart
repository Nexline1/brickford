// T-064 stage 4: Problems (what is due now) and Exams on the Market tab.
// The fixture, on 2026-10-27 (plan day 9, phase 0):
//   math110.1.1  watched 20 Oct, before the gate, quiz never passed  -> cleared (grandfathered), a catch-up row, pset 1806-ps1 due
//   math110.1.4  watched 26 Oct, quiz passed                          -> cleared, pset 1806-ps2 due
//   math110.1.5  watched 26 Oct, quiz not passed                      -> an owed quiz, NOT cleared, pset 1806-ps3 held back
//   ai200.0.0    watched 26 Oct, no quiz                              -> cleared, both phase-0 labs due
import 'dart:convert';

import 'package:app/engine/problems.dart';
import 'package:app/engine/quiz.dart';
import 'package:app/main.dart';
import 'package:app/screens/market/diag_screen.dart';
import 'package:app/screens/quiz/quiz_screen.dart';
import 'package:app/shell.dart';
import 'package:app/state/app_model.dart';
import 'package:app/widgets/question_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Map<String, dynamic> w(String on, {String? passed}) => {
  'done': true,
  'doneAt': on,
  'notes': '',
  'checks': <dynamic>[],
  if (passed != null) 'quiz': {'passedAt': passed},
};

final fixture = {
  'lessons': {
    'math110.1.1': w('2026-10-20'),
    'math110.1.4': w('2026-10-26', passed: '2026-10-26'),
    'math110.1.5': w('2026-10-26'),
    'ai200.0.0': w('2026-10-26'),
  },
};

Future<AppModel> model(
  Map<String, dynamic> state, {
  String today = '2026-10-27',
}) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({
    AppModel.storageKey: jsonEncode(state),
  });
  final data = await AppModel.loadData(rootBundle);
  return AppModel(
    data,
    await SharedPreferences.getInstance(),
    today: () => today,
    now: () => DateTime.utc(2026, 10, 27, 9),
  );
}

Future<void> openMarket(WidgetTester tester, AppModel m) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
  await tester.tap(
    find
        .descendant(
          of: find.byKey(const ValueKey('brickford-tabs')),
          matching: find.byType(BarTab),
        )
        .at(1),
  );
  await tester.pumpAndSettle();
}

Finder id(String s) => find.bySemanticsIdentifier(s);

void main() {
  test('problemsDue on the fixture: owed quiz, catch-up, psets then labs; the held-back pset is coming', () async {
    final m = await model(fixture);
    final P = m.engine.problemsDue();
    expect(P.keys, [
      'quiz:math110.1.5',
      'catchup:math110.1.1',
      'pset:1806-ps1',
      'pset:1806-ps2',
      'lab:flashcards-cli',
      'lab:neetcode-10',
    ]);
    expect(P.n, 6);
    expect(
      m.engine.lessonCleared('math110.1.5'),
      isFalse,
      reason: 'the gate: watched since it opened, quiz not passed',
    );
    expect(
      m.engine.lessonCleared('math110.1.1'),
      isTrue,
      reason: 'watched before it opened',
    );
    expect(P.coming.any((c) => c.pset?['id'] == '1806-ps3'), isTrue);
    expect(P.psets.any((i) => i['id'] == '1806-ps3'), isFalse);
    // A pset ticked leaves; psetDue and labDue are the whole of "due".
    expect(m.engine.psetDue(P.psets.first), isTrue);
    m.tickPset('1806-ps1', true);
    expect(m.engine.psetDue(P.psets.first), isFalse);
    expect(m.engine.problemsDue().keys, isNot(contains('pset:1806-ps1')));
    m.tickLab('flashcards-cli', true);
    expect(m.engine.problemsDue().keys, isNot(contains('lab:flashcards-cli')));
    // A lab of a later phase waits for its phase even with its lecture cleared.
    expect(
      m.engine.labDue({'id': 'x', 'after': 'ai200.0.0', 'phase': 1}),
      isFalse,
    );
  });

  testWidgets(
    'Problems lists the right items, the held-back ones are muted, and an item opens',
    (tester) async {
      final m = await model(fixture);
      await openMarket(tester, m);
      for (final s in [
        'due-quiz-math110.1.5',
        'due-catchup-math110.1.1',
        'due-pset-1806-ps1',
        'due-pset-1806-ps2',
        'due-lab-flashcards-cli',
        'due-lab-neetcode-10',
      ]) {
        expect(id(s), findsOneWidget, reason: s);
      }
      expect(id('due-pset-1806-ps3'), findsNothing);
      // The three nearest still-locked items, muted, below the due ones (scrolled to: the list is lazy).
      final soon = m.engine
          .problemsDue()
          .coming
          .take(3)
          .map(
            (c) =>
                'soon-${c.pset != null ? 'pset' : 'lab'}-${(c.pset ?? c.lab)!['id']}',
          )
          .toList();
      await tester.scrollUntilVisible(
        id(soon.last),
        200,
        scrollable: find.byType(Scrollable).first,
      );
      for (final s in soon) {
        expect(id(s), findsOneWidget, reason: s);
      }
      await tester.scrollUntilVisible(
        id('due-quiz-math110.1.5'),
        -200,
        scrollable: find.byType(Scrollable).first,
      );
      expect(
        tester.widget<Text>(find.byKey(const ValueKey('market-count'))).data,
        '6',
      );
      // A pset opens, ticks, and leaves the list.
      await tester.tap(id('due-pset-1806-ps1'));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('pset-tick')));
      await tester.pumpAndSettle();
      expect(
        m.engine.S['psets']['1806-ps1'],
        '2026-10-27',
        reason: 'the date it was ticked, as the web app stores it',
      );
      await tester.tapAt(const Offset(10, 10)); // the scrim
      await tester.pumpAndSettle();
      expect(id('due-pset-1806-ps1'), findsNothing);
      expect(
        tester.widget<Text>(find.byKey(const ValueKey('market-count'))).data,
        '5',
      );
      // A lab opens and ticks; its proof field appears.
      await tester.tap(id('due-lab-neetcode-10'));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('lab-tick')));
      await tester.pumpAndSettle();
      expect((m.engine.S['labs']['neetcode-10'] as Map)['done'], isTrue);
      expect(find.byKey(const ValueKey('lab-proof')), findsOneWidget);
      // A quiz row opens the quiz.
      await tester.tapAt(const Offset(10, 10));
      await tester.pumpAndSettle();
      await tester.tap(id('due-quiz-math110.1.5'));
      await tester.pumpAndSettle();
      expect(find.byType(QuizScreen), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'passing an owed quiz takes it off Problems and unlocks the pset behind it',
    (tester) async {
      final m = await model(fixture);
      expect(
        m.engine.psetDue(
          m.engine.allPsets().firstWhere((i) => i['id'] == '1806-ps3'),
        ),
        isFalse,
      );
      await m.ensureSummaries();
      await openMarket(tester, m);
      await tester.tap(id('due-quiz-math110.1.5'));
      await tester.pumpAndSettle();
      for (
        var i = 0;
        i < 40 && find.byKey(const ValueKey('quiz-passed')).evaluate().isEmpty;
        i++
      ) {
        final q = tester.widget<QuestionView>(find.byType(QuestionView)).q;
        if (q['opts'] != null) {
          await tester.tap(find.byKey(ValueKey('opt-${q['a']}')));
        } else {
          await tester.enterText(
            find.descendant(
              of: find.byKey(const ValueKey('quiz-num')),
              matching: find.byType(TextField),
            ),
            '${q['num']}',
          );
          await tester.tap(find.byKey(const ValueKey('quiz-submit')));
        }
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('quiz-next')));
        await tester.pumpAndSettle();
      }
      expect(find.byKey(const ValueKey('quiz-passed')), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('quiz-done')));
      await tester.pumpAndSettle();
      expect(m.engine.lessonCleared('math110.1.5'), isTrue);
      expect(id('due-quiz-math110.1.5'), findsNothing);
      expect(id('due-pset-1806-ps3'), findsOneWidget);
    },
  );

  testWidgets(
    'Exams: the ranked list, a diagnostic is recorded against its gate, a bank sitting is recorded with its pass mark',
    (tester) async {
      final m = await model({
        'lessons': {
          for (var i = 0; i < 3; i++)
            'math110.0.$i': w('2026-10-26', passed: '2026-10-26'),
        },
      });
      await openMarket(tester, m);
      await tester.tap(find.byKey(const ValueKey('market-tab-exams')));
      await tester.pumpAndSettle();
      final items = m.engine.examItems();
      expect(
        items.first.kind,
        'diag',
        reason: 'an unsat diagnostic outranks every bank',
      );
      expect(find.byKey(const ValueKey('exam-hero')), findsOneWidget);
      expect(
        id('exam-linear-algebra'),
        findsOneWidget,
        reason: 'its questions unlocked by watching',
      );
      await tester.scrollUntilVisible(
        id('exam-locked-calculus'),
        200,
        scrollable: find.byType(Scrollable).first,
      );
      expect(
        id('exam-locked-calculus'),
        findsOneWidget,
        reason: 'nothing of its course watched yet',
      );
      await tester.scrollUntilVisible(
        find.byKey(const ValueKey('exam-sit')),
        -200,
        scrollable: find.byType(Scrollable).first,
      );

      // The diagnostic: the score is rounded and stored with the date.
      await tester.tap(find.byKey(const ValueKey('exam-sit')));
      await tester.pumpAndSettle();
      expect(find.byType(DiagScreen), findsOneWidget);
      await tester.enterText(
        find.descendant(
          of: find.byKey(const ValueKey('diag-score')),
          matching: find.byType(TextField),
        ),
        '74.6',
      );
      await tester.ensureVisible(find.byKey(const ValueKey('diag-record')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('diag-record')));
      await tester.pumpAndSettle();
      final rec = (m.engine.S['diag'] as Map)[items.first.id] as Map;
      expect(rec['score'], 75);
      expect(rec['date'], '2026-10-27');
      expect(find.byKey(const ValueKey('diag-recorded')), findsOneWidget);
      await tester.tap(find.byIcon(Icons.arrow_back_ios_new));
      await tester.pumpAndSettle();

      // The bank: every answer right is 100%, a pass; the attempt has the web shape.
      await tester.tap(id('exam-linear-algebra'));
      await tester.pumpAndSettle();
      expect(find.byType(QuizScreen), findsOneWidget);
      final n =
          (find.byKey(const ValueKey('quiz-count')).evaluate().first.widget
                  as Text)
              .data;
      expect(n, '1');
      for (
        var i = 0;
        i < 40 && find.byKey(const ValueKey('quiz-result')).evaluate().isEmpty;
        i++
      ) {
        final q = tester.widget<QuestionView>(find.byType(QuestionView)).q;
        if (q['opts'] != null) {
          await tester.tap(find.byKey(ValueKey('opt-${q['a']}')));
        } else {
          await tester.enterText(
            find.descendant(
              of: find.byKey(const ValueKey('quiz-num')),
              matching: find.byType(TextField),
            ),
            '${q['num']}',
          );
          await tester.tap(find.byKey(const ValueKey('quiz-submit')));
        }
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('quiz-next')));
        await tester.pumpAndSettle();
      }
      final at =
          (m.engine.S['quizAttempts']['linear-algebra'] as List).single as Map;
      expect(at['pct'], 100);
      expect(at['score'], at['total']);
      expect(at['date'], '2026-10-27');
      expect(m.engine.bestQuiz('linear-algebra'), 100);
      expect(examVerdict(100), 'pass');
      expect(find.byKey(const ValueKey('quiz-passed')), findsOneWidget);
    },
  );

  test('the pass mark is 70: 70 passes, 69 is a gap, and nothing sat has no verdict', () {
    expect(examPassAt, 70);
    expect(examVerdict(70), 'pass');
    expect(examVerdict(69), 'gap');
    expect(examVerdict(null), isNull);
  });
}
