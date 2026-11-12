// T-067 step 3: the lecture's Practice block, under the quiz (app.js practiceHTML / practiceItemHTML, in the
// app's own widgets). Four kinds of item:
//   numeric  checked by the quiz's numeric grader (gradeAnswer, held equal to quiz-engine.js by verify-app)
//   output   run the code in Replit, type what it prints
//   worked   solve on paper and enter the result; the worked solution shows only after that attempt,
//            then Got it / Partly / Missed
//   write    a written answer; the key points and the model answer show only after 80 characters
// Partly and missed items come back in Recall. A build is a read: every write is a tap.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/lecture_practice.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/record_widgets.dart' show toast;
import 'lesson_screen.dart' show plain;

class PracticeBlock extends StatelessWidget {
  const PracticeBlock({super.key, required this.k});
  final String k;

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final items = m.engine.practiceItems(k);
    if (items.isEmpty) return const SizedBox.shrink();
    final g = m.engine.solveGate(k);
    return Column(
      key: const ValueKey('practice-block'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: 8.h),
        SheetLabel(Icons.edit_outlined, 'Practice · ${m.engine.practiceSolvedN(k)} of ${items.length} solved'),
        Padding(
          padding: EdgeInsets.only(bottom: 10.h),
          child: Text('${g.solved} of ${g.need} problems unaided', key: const ValueKey('practice-unaided'), style: body(13, color: Tokens.ink2, weight: FontWeight.w600)),
        ),
        for (var i = 0; i < items.length; i++) PracticeItem(key: ValueKey('pr-${items[i]['id']}'), k: k, it: items[i], i: i),
      ],
    );
  }
}

class PracticeItem extends StatefulWidget {
  const PracticeItem({super.key, required this.k, required this.it, required this.i});
  final String k;
  final Map<String, dynamic> it;
  final int i;

  @override
  State<PracticeItem> createState() => _PracticeItemState();
}

class _PracticeItemState extends State<PracticeItem> {
  final _in = TextEditingController();

  @override
  void dispose() {
    _in.dispose();
    super.dispose();
  }

  String get id => '${widget.it['id']}';

  void _check(AppModel m) {
    final why = m.practiceAnswer(widget.k, widget.it, _in.text);
    if (why != null) {
      toast(context, why);
      return;
    }
    _in.clear();
  }

  static String _num(Object? v) => v is double && v == v.truncateToDouble() && v.abs() < 1e21 ? '${v.toInt()}' : '$v';

  Widget _pill(String label, IconData icon, Color c, String key) => Container(
    key: ValueKey(key),
    padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 5.h),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: c, width: 1.5)),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 15, color: c),
        SizedBox(width: 5.w),
        Text(label, style: body(12.5, weight: FontWeight.w800)),
      ],
    ),
  );

  Widget _label(String t) => Padding(
    padding: EdgeInsets.only(top: 12.h, bottom: 4.h),
    child: Text(t, style: body(12, color: Tokens.ink2, weight: FontWeight.w800).copyWith(letterSpacing: 0.6)),
  );

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final it = widget.it, k = widget.k, type = '${it['type']}';
    final ps = m.engine.practiceOf(k, id) ?? const <String, dynamic>{};
    final tried = prTried(it, ps);
    final auto = type == 'numeric' || type == 'output';
    final mark = ps['mark'] as String?;
    final children = <Widget>[
      Text('${widget.i + 1} · ${prType[type] ?? type}'.toUpperCase(), style: body(11.5, color: Tokens.ink2, weight: FontWeight.w800).copyWith(letterSpacing: 0.8)),
      SizedBox(height: 6.h),
      Text(plain(it['q']), style: body(14.5, weight: FontWeight.w600, height: 1.45)),
      SizedBox(height: 12.h),
    ];

    if (!tried) {
      if (type == 'write') {
        children.addAll([
          BrickfordField(
            key: ValueKey('pr-in-$id'),
            id: 'pr-in-$id',
            icon: Icons.edit_note,
            hint: 'Your answer, in your own words',
            controller: _in,
            minLines: 4,
            maxLines: 10,
            onChanged: (_) => setState(() {}),
          ),
          SizedBox(height: 10.h),
          Row(
            children: [
              PillButton(key: ValueKey('pr-check-$id'), id: 'pr-check-$id', label: 'Submit', icon: Icons.check, expand: false, tone: PillTone.quiet, onPressed: () => _check(m)),
              SizedBox(width: 12.w),
              Text('${_in.text.trim().length} / $WRITE_MIN', key: ValueKey('pr-len-$id'), style: body(13, color: Tokens.ink2, weight: FontWeight.w700)),
            ],
          ),
        ]);
      } else {
        children.add(Row(
          children: [
            Expanded(
              child: BrickfordField(
                key: ValueKey('pr-in-$id'),
                id: 'pr-in-$id',
                icon: type == 'numeric' ? Icons.tag : type == 'output' ? Icons.terminal : Icons.edit_outlined,
                hint: type == 'numeric' ? 'A number' : type == 'output' ? 'What it prints' : 'Your result',
                controller: _in,
                keyboardType: type == 'numeric' ? const TextInputType.numberWithOptions(decimal: true, signed: true) : null,
                onSubmitted: (_) => _check(m),
              ),
            ),
            SizedBox(width: 10.w),
            PillButton(key: ValueKey('pr-check-$id'), id: 'pr-check-$id', label: 'Check', expand: false, tone: PillTone.quiet, onPressed: () => _check(m)),
          ],
        ));
      }
    } else {
      final answer = '${ps['answer']}';
      if (auto) {
        final right = mark == 'ok';
        children.addAll([
          Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 8.w,
            runSpacing: 6.h,
            children: [
              right ? _pill('Right', Icons.check_rounded, Tokens.done, 'pr-v-$id') : _pill('Not quite', Icons.close_rounded, Tokens.missed, 'pr-v-$id'),
              Text(right ? answer : '$answer · the answer is ${type == 'numeric' ? _num(it['num']) : it['out']}', style: body(14, weight: FontWeight.w600)),
            ],
          ),
          if (it['expl'] != null) ...[SizedBox(height: 8.h), Text(plain(it['expl']), style: body(14, color: Tokens.ink2, height: 1.45))],
          if (type == 'output') ...[
            SizedBox(height: 8.h),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(12.w),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
              child: Text('${it['code']}', style: const TextStyle(fontFamily: 'monospace', fontSize: 13, color: Tokens.ink, height: 1.4)),
            ),
          ],
        ]);
      } else {
        final ticks = ps['ticks'] is List ? ps['ticks'] as List : const [];
        children.add(Container(
          width: double.infinity,
          padding: EdgeInsets.all(12.w),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
          child: Text(answer, key: ValueKey('pr-ans-$id'), style: body(14, height: 1.45)),
        ));
        if (type == 'worked') {
          children.add(Column(
            key: ValueKey('pr-sol-$id'),
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _label('ANSWER'),
              Text(plain(it['result']), style: body(14, weight: FontWeight.w700, height: 1.45)),
              _label('STEPS'),
              for (var j = 0; j < (it['steps'] as List).length; j++)
                Padding(
                  padding: EdgeInsets.only(bottom: 4.h),
                  child: Text('${j + 1}. ${plain((it['steps'] as List)[j])}', style: body(14, color: Tokens.ink2, height: 1.45)),
                ),
            ],
          ));
        } else {
          final points = it['points'] as List;
          children.add(Column(
            key: ValueKey('pr-sol-$id'),
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _label('KEY POINTS'),
              for (var j = 0; j < points.length; j++)
                InkWell(
                  key: ValueKey('pr-tick-$j-$id'),
                  borderRadius: BorderRadius.circular(10),
                  onTap: () => m.practiceTick(k, id, j, !(j < ticks.length && ticks[j] == true)),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(minHeight: 44),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Icon(j < ticks.length && ticks[j] == true ? Icons.check_box : Icons.check_box_outline_blank, color: Tokens.accent, size: 24),
                        SizedBox(width: 10.w),
                        Expanded(child: Text(plain(points[j]), style: body(14, height: 1.4))),
                      ],
                    ),
                  ),
                ),
              _label('MODEL ANSWER'),
              Text(plain(it['model']), style: body(14, color: Tokens.ink2, height: 1.45)),
            ],
          ));
        }
        // Grade with Claude.
        final g = ps['grade'] is Map ? (ps['grade'] as Map).cast<String, dynamic>() : null;
        final mk = '$k/$id', key = m.hasAiKey, net = !m.sync.noNet, busy = m.grading.contains(mk);
        final msg = (m.practiceMsg[mk] ?? '').isNotEmpty ? m.practiceMsg[mk]! : (!key ? noKeySay : !net ? offlineSay : '');
        if (g != null) {
          children.addAll([
            _label('CLAUDE'),
            for (final p in (g['points'] is List ? g['points'] as List : const []))
              Padding(
                padding: EdgeInsets.only(bottom: 4.h),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p['verdict'] == 'met' ? '✓' : p['verdict'] == 'partly' ? '½' : '✗',
                        style: body(14, weight: FontWeight.w800, color: p['verdict'] == 'met' ? Tokens.done : p['verdict'] == 'partly' ? Tokens.goldInk : Tokens.missed)),
                    SizedBox(width: 8.w),
                    Expanded(child: Text('${p['point']} · ${p['verdict']}', style: body(13.5, height: 1.4))),
                  ],
                ),
              ),
            SizedBox(height: 4.h),
            Text('Correction: ${g['correction'] ?? ''}', key: ValueKey('pr-correction-$id'), style: body(14, weight: FontWeight.w600, height: 1.45)),
          ]);
        }
        children.addAll([
          SizedBox(height: 12.h),
          PillButton(
            key: ValueKey('pr-grade-$id'),
            id: 'pr-grade-$id',
            icon: Icons.auto_awesome_outlined,
            label: busy ? 'Grading…' : g != null ? 'Grade again' : 'Grade with Claude',
            tone: PillTone.quiet,
            onPressed: key && net && !busy ? () => m.practiceGrade(k, it) : null,
          ),
          if (msg.isNotEmpty)
            Padding(
              padding: EdgeInsets.only(top: 6.h),
              child: Text(msg, key: ValueKey('pr-msg-$id'), style: body(12.5, color: Tokens.ink2, weight: FontWeight.w600)),
            ),
        ]);
      }
      children.add(SizedBox(height: 12.h));
      if (mark != null && !auto && prMark.containsKey(mark)) {
        children.add(Padding(
          padding: EdgeInsets.only(bottom: 8.h),
          child: _pill(prMark[mark]!, mark == 'ok' ? Icons.check_rounded : mark == 'partly' ? Icons.remove_rounded : Icons.close_rounded,
              mark == 'ok' ? Tokens.done : mark == 'partly' ? Tokens.half : Tokens.missed, 'pr-marked-$id'),
        ));
      }
      if (!auto && mark == null) {
        children.add(Wrap(
          spacing: 8.w,
          runSpacing: 8.h,
          children: [
            for (final mm in const ['ok', 'partly', 'missed'])
              PillButton(
                key: ValueKey('pr-mark-$mm-$id'),
                id: 'pr-mark-$mm-$id',
                label: prMark[mm]!,
                expand: false,
                tone: mm == 'ok' ? PillTone.primary : PillTone.quiet,
                onPressed: () => m.practiceMark(k, id, mm),
              ),
          ],
        ));
      } else {
        children.add(PillButton(key: ValueKey('pr-again-$id'), id: 'pr-again-$id', label: 'Again', icon: Icons.replay, expand: false, tone: PillTone.quiet, onPressed: () => m.practiceAgain(k, id)));
      }
    }

    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.fromLTRB(14.w, 12.h, 14.w, 14.h),
      decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children),
    );
  }
}
