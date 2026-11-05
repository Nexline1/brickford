// A sitting: a lecture's own quiz (mastery: every question, misses come back,
// first-try score kept; passing clears the lecture) or a bank from Exams (a
// draw of perSitting questions, one score, recorded in the register). The
// count and the segments sit on the canvas; the question on the sheet.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/learn.dart' show BankQ, ReviewEngine;
import '../../engine/quiz.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/question_view.dart';
import '../../widgets/sheet_scaffold.dart';
import '../lesson/lesson_screen.dart' show plain;

/// The lecture's quiz: `QuizScreen.lecture('math110.0.1')`; a bank: `QuizScreen.bank('linear-algebra')`.
class QuizScreen extends StatefulWidget {
  const QuizScreen.lecture(String this.k, {super.key, this.rand}) : bankId = null;
  const QuizScreen.bank(String this.bankId, {super.key, this.rand}) : k = null;

  /// The Drill: ten questions drawn from what you have missed (padded from what you have been taught).
  const QuizScreen.drill({super.key, this.rand})
      : k = null,
        bankId = null;

  final String? k, bankId;

  /// Fixed random for tests; the default is a real one.
  final double Function()? rand;

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  Sitting? s;
  List<int> map = const [];
  Object? chosen;
  bool? ok;
  bool saved = false;

  /// Which showing this is: a miss that comes back is a new question view, with an empty field.
  int shown = 0;

  bool get isLecture => widget.k != null;
  bool get isDrill => widget.k == null && widget.bankId == null;

  /// The drill's draw: where each question of the sitting came from (bank, index).
  List<BankQ> drillPool = const [];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final m = AppScope.of(context);
    if (isLecture) m.ensureSummaries();
    _begin(m);
  }

  /// Start the sitting once its questions exist (a lecture's come with summaries.json).
  void _begin(AppModel m) {
    if (s != null) return;
    if (isLecture) {
      final checks = m.engine.lessonQuiz(widget.k!);
      if (checks != null) s = MasterySitting(checks, rand: widget.rand);
    } else if (isDrill) {
      final pool = m.engine.drillPick(widget.rand ?? randomSource());
      if (pool.isNotEmpty) {
        drillPool = pool;
        s = BankSitting([for (final p in pool) ((m.data.quizzes[p.bankId] as Map)['questions'] as List)[p.idx]], pool.length, rand: widget.rand);
      }
    } else {
      final u = m.engine.unlockedBank(widget.bankId!);
      if (u.questions.isNotEmpty) {
        map = u.map;
        s = BankSitting(u.questions, u.perSitting, rand: widget.rand);
      }
    }
  }

  void _answer(Object given) {
    final r = s!.answer(given);
    if (r == null) return;
    setState(() {
      ok = r;
      chosen = given;
    });
  }

  void _next(AppModel m) {
    s!.next();
    shown++;
    if (s!.over && !saved) {
      saved = true;
      final x = s!;
      if (x is MasterySitting) {
        m.passedQuiz(widget.k!, x.result!);
      } else if (x is BankSitting) {
        if (isDrill) {
          m.drilled(drillPool, x);
        } else {
          m.sat(widget.bankId!, x, map);
        }
      }
    }
    setState(() {
      ok = null;
      chosen = null;
    });
  }

  void _again(AppModel m) {
    setState(() {
      s = null;
      saved = false;
      ok = null;
      chosen = null;
      _begin(m);
    });
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    _begin(m);
    final x = s;
    void back() => Navigator.of(context).maybePop();
    if (x == null) {
      // Summaries still loading, or a bank with nothing unlocked yet.
      final loading = isLecture && !m.data.summariesLoaded;
      return Scaffold(
        backgroundColor: Tokens.midnight,
        body: SheetScaffold(
          onBack: back,
          children: [
            SizedBox(height: 40.h),
            Center(
              child: loading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(key: ValueKey('quiz-loading'), strokeWidth: 2.4, color: Tokens.accent),
                    )
                  : isDrill
                  ? const Icon(Icons.event_available, key: ValueKey('drill-empty'), size: 48, color: Tokens.quiet, semanticLabel: 'nothing to drill yet')
                  : const Icon(Icons.lock_outline, size: 40, color: Tokens.quiet, semanticLabel: 'nothing unlocked yet'),
            ),
          ],
        ),
      );
    }

    final header = x.over
        ? _resultCount(x)
        : Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BigCount(
                icon: Icons.quiz_outlined,
                semantic: 'question',
                value: '${x.pos + 1}',
                total: '${x.n}',
                valueKey: const ValueKey('quiz-count'),
              ),
              SizedBox(height: 12.h),
              SegBar(x.seg, x.answered ? -1 : x.pos),
            ],
          );

    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: back,
        header: header,
        children: [
          if (x.over)
            ..._result(m, x)
          else
            QuestionView(
              key: ValueKey('q-$shown'),
              q: x.q!,
              answered: x.answered,
              ok: ok,
              chosen: chosen,
              again: x.again,
              last: x.isLast,
              showAnswer: !isLecture,
              onAnswer: _answer,
              onNext: () => _next(m),
            ),
        ],
      ),
    );
  }

  Widget _resultCount(Sitting x) {
    if (x is MasterySitting) {
      return BigCount(
        icon: Icons.verified_outlined,
        semantic: 'right on the first try',
        value: '${x.firstTry}',
        total: '${x.n}',
        valueKey: const ValueKey('quiz-result'),
      );
    }
    final b = x as BankSitting;
    return BigCount(
      icon: Icons.verified_outlined,
      semantic: 'score',
      value: '${b.pct}',
      total: '100',
      valueKey: const ValueKey('quiz-result'),
    );
  }

  List<Widget> _result(AppModel m, Sitting x) {
    final pass = x is BankSitting ? x.pct >= examPassAt : true;
    final misses = x is BankSitting
        ? [for (final r in x.results) if (!r.ok) x.qs[x.order.indexOf(r.bi)]]
        : const <Map<String, dynamic>>[];
    return [
      Center(
        child: Icon(
          pass ? Icons.verified_rounded : Icons.flag_outlined,
          key: ValueKey(pass ? 'quiz-passed' : 'quiz-gap'),
          size: 64,
          color: pass ? Tokens.done : Tokens.half,
          semanticLabel: pass ? 'passed' : 'below the pass mark',
        ),
      ),
      SizedBox(height: 22.h),
      Semantics(
        identifier: 'quiz-done',
        child: PillButton(
          key: const ValueKey('quiz-done'),
          label: 'Done',
          icon: Icons.check,
          onPressed: () => Navigator.of(context).maybePop(),
        ),
      ),
      if (!isLecture) ...[
        SizedBox(height: 10.h),
        PillButton(label: 'Again', icon: Icons.replay_rounded, tone: PillTone.quiet, onPressed: () => _again(m)),
      ],
      if (misses.isNotEmpty) ...[
        SheetLabel(Icons.rule_rounded, '${misses.length}'),
        for (final q in misses)
          Container(
            margin: EdgeInsets.only(bottom: 10.h),
            padding: EdgeInsets.all(14.w),
            decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(plain(q['q']), style: body(14, weight: FontWeight.w700, height: 1.4)),
                if (q['expl'] != null) ...[
                  SizedBox(height: 6.h),
                  Text(plain(q['expl']), style: body(13.5, color: Tokens.ink2, height: 1.45)),
                ],
              ],
            ),
          ),
      ],
    ];
  }
}
