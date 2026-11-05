// One question, as the quiz engine draws it (quiz-engine.js card()): the text,
// either lettered options or a numeric answer, the feedback with the
// explanation, and Next / Finish. The blocks are the app's own (ItemBlock's
// fill and radius, LeadTile's letter, PillButton); the words are few.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../screens/lesson/lesson_screen.dart' show plain;
import '../theme/theme.dart';
import '../theme/tokens.dart';
import 'blocks.dart';
import 'brickford_field.dart';
import 'pill_button.dart';

/// The segments under the count: ok, miss, the one on screen, still to come.
class SegBar extends StatelessWidget {
  const SegBar(this.seg, this.now, {super.key});
  final List<String> seg;
  final int now;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (final (i, s) in seg.indexed)
          Expanded(
            child: Container(
              key: ValueKey('seg-$i-${s.isEmpty ? (i == now ? 'now' : 'todo') : s}'),
              height: 6,
              margin: EdgeInsets.only(right: i == seg.length - 1 ? 0 : 3),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(3),
                color: s == 'ok'
                    ? Tokens.doneOnDark
                    : s == 'miss'
                    ? const Color(0xFFE5656B)
                    : i == now
                    ? Tokens.navyOnDark
                    : Colors.white24,
              ),
            ),
          ),
      ],
    );
  }
}

class QuestionView extends StatefulWidget {
  const QuestionView({
    super.key,
    required this.q,
    required this.answered,
    required this.ok,
    required this.chosen,
    required this.onAnswer,
    required this.onNext,
    required this.last,
    this.again = false,
    this.showAnswer = false,
  });

  /// The question as presented (options already in their shuffled order).
  final Map<String, dynamic> q;
  final bool answered;

  /// null before an answer.
  final bool? ok;

  /// The slot chosen (options) or the text typed (numeric), once answered.
  final Object? chosen;
  final void Function(Object given) onAnswer;
  final VoidCallback onNext;

  /// "Finish" instead of "Next".
  final bool last;

  /// A miss coming back.
  final bool again;

  /// A wrong numeric answer says what the answer was (the bank sitting does).
  final bool showAnswer;

  @override
  State<QuestionView> createState() => _QuestionViewState();
}

class _QuestionViewState extends State<QuestionView> {
  final _ctl = TextEditingController();

  @override
  void dispose() {
    _ctl.dispose();
    super.dispose();
  }

  void _submit() {
    final v = _ctl.text.trim();
    if (v.isNotEmpty && !widget.answered) widget.onAnswer(v);
  }

  Widget _option(int i, String text) {
    final w = widget;
    final isAnswer = w.answered && i == w.q['a'];
    final isWrong = w.answered && w.ok == false && i == w.chosen;
    final dim = w.answered && !isAnswer && !isWrong;
    final accent = isAnswer ? Tokens.done : (isWrong ? Tokens.missed : null);
    return Padding(
      padding: EdgeInsets.only(bottom: 10.h),
      child: Semantics(
        identifier: 'opt-$i',
        child: Material(
          color: accent == null ? Tokens.fieldFill : accent.withValues(alpha: 0.12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(Tokens.radius),
            side: accent == null ? BorderSide.none : BorderSide(color: accent, width: 1.5),
          ),
          child: InkWell(
            key: ValueKey('opt-$i'),
            borderRadius: BorderRadius.circular(Tokens.radius),
            onTap: w.answered ? null : () => w.onAnswer(i),
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 56),
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
                child: Row(
                  children: [
                    isAnswer
                        ? const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white)
                        : isWrong
                        ? const LeadTile(icon: Icons.close_rounded, color: Tokens.missed, fg: Colors.white)
                        : LeadTile(text: String.fromCharCode(65 + i)),
                    SizedBox(width: 12.w),
                    Expanded(
                      child: Text(
                        plain(text),
                        style: body(14.5, color: dim ? Tokens.ink2 : Tokens.ink, weight: FontWeight.w600, height: 1.35),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final w = widget, q = w.q;
    final opts = q['opts'] as List?;
    final ok = w.ok;
    final expl = plain(q['expl'] ?? '');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (w.again)
          Padding(
            padding: EdgeInsets.only(bottom: 8.h),
            child: const Icon(Icons.replay_rounded, size: 18, color: Tokens.half, semanticLabel: 'again'),
          ),
        Text(plain(q['q']), key: const ValueKey('q-text'), style: body(16.5, weight: FontWeight.w700, height: 1.45)),
        SizedBox(height: 18.h),
        if (opts != null)
          for (final (i, o) in opts.indexed) _option(i, '$o')
        else ...[
          BrickfordField(
            key: const ValueKey('quiz-num'),
            icon: Icons.pin_outlined,
            hint: '123',
            controller: _ctl,
            keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
            onSubmitted: (_) => _submit(),
          ),
          SizedBox(height: 10.h),
          if (!w.answered)
            PillButton(key: const ValueKey('quiz-submit'), label: 'Submit', icon: Icons.check, onPressed: _submit),
        ],
        if (ok != null) ...[
          SizedBox(height: 6.h),
          Container(
            key: const ValueKey('quiz-feedback'),
            padding: EdgeInsets.all(14.w),
            decoration: BoxDecoration(
              color: Tokens.accentWash,
              borderRadius: BorderRadius.circular(Tokens.radius),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(ok ? Icons.check_circle : Icons.cancel, size: 20, color: ok ? Tokens.done : Tokens.missed),
                    SizedBox(width: 8.w),
                    Text(
                      ok ? 'Correct' : (opts == null && w.showAnswer ? 'Answer ${q['num']}' : 'Not quite'),
                      style: body(14, weight: FontWeight.w800),
                    ),
                    if (!ok) ...[SizedBox(width: 8.w), const Icon(Icons.replay_rounded, size: 16, color: Tokens.half)],
                  ],
                ),
                if (expl.isNotEmpty) ...[SizedBox(height: 8.h), Text(expl, style: body(14, color: Tokens.ink2, height: 1.5))],
              ],
            ),
          ),
          SizedBox(height: 14.h),
          PillButton(
            key: const ValueKey('quiz-next'),
            label: w.last ? 'Finish' : 'Next',
            icon: w.last ? Icons.flag_rounded : Icons.arrow_forward_rounded,
            onPressed: w.onNext,
          ),
        ],
      ],
    );
  }
}
