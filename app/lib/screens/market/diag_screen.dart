// An official diagnostic (V.diag): the exam clock, the paper, and the honest
// score recorded against the gate. A diagnostic with no grade (the coding one)
// is marked complete instead.
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/quiz.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';

class DiagScreen extends StatefulWidget {
  const DiagScreen({super.key, required this.id});
  final String id;
  @override
  State<DiagScreen> createState() => _DiagScreenState();
}

class _DiagScreenState extends State<DiagScreen> {
  final _score = TextEditingController();
  Timer? _tick;
  late int _left; // seconds
  bool _running = false;
  bool _bad = false;

  Map<String, dynamic>? _diag(AppModel m) {
    for (final d in m.data.diagnostics) {
      if (d['id'] == widget.id) return d;
    }
    return null;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_started) {
      _started = true;
      _left = ((_diag(AppScope.of(context))?['minutes'] as num?) ?? 0).toInt() * 60;
    }
  }

  bool _started = false;

  @override
  void dispose() {
    _tick?.cancel();
    _score.dispose();
    super.dispose();
  }

  void _begin() {
    _tick?.cancel();
    setState(() => _running = true);
    _tick = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_left <= 0) {
        t.cancel();
        setState(() => _running = false);
      } else {
        setState(() => _left--);
      }
    });
  }

  void _stop() {
    _tick?.cancel();
    setState(() => _running = false);
  }

  String get _clock {
    final h = _left ~/ 3600, mm = (_left % 3600) ~/ 60, s = _left % 60;
    String p(int n) => n.toString().padLeft(2, '0');
    return '${p(h)}:${p(mm)}:${p(s)}';
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final d = _diag(m);
    void back() => Navigator.of(context).maybePop();
    if (d == null) {
      return Scaffold(backgroundColor: Tokens.midnight, body: SheetScaffold(onBack: back, children: const []));
    }
    final rec = (m.engine.S['diag'] as Map)[widget.id];
    final r = rec is Map ? rec : const {};
    final gate = d['gate'] as num?;
    final score = r['score'];
    Widget line(IconData i, String t) => Padding(
      padding: EdgeInsets.only(bottom: 10.h),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(i, size: 18, color: Tokens.quiet),
          SizedBox(width: 10.w),
          Expanded(child: SelectableText(t, style: body(13.5, color: Tokens.ink2, height: 1.45))),
        ],
      ),
    );
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: back,
        header: BigCount(
          icon: Icons.timer_outlined,
          semantic: 'minutes',
          value: '${d['minutes']}',
          total: gate != null ? '$gate%' : '—',
          valueKey: const ValueKey('diag-minutes'),
        ),
        children: [
          Text('${d['subject']}', style: body(12, color: Tokens.ink2, weight: FontWeight.w800).copyWith(letterSpacing: 0.8)),
          SizedBox(height: 6.h),
          Text('${d['title']}', style: display(22, color: Tokens.ink)),
          SizedBox(height: 10.h),
          Text('${d['note']}', style: body(13.5, color: Tokens.ink2, height: 1.5)),
          SizedBox(height: 16.h),
          if (d['pdf'] != null) line(Icons.picture_as_pdf_outlined, '${d['pdf']}'),
          if (d['solutions'] != null) line(Icons.fact_check_outlined, '${d['solutions']}'),
          SizedBox(height: 8.h),
          Container(
            padding: EdgeInsets.all(16.w),
            decoration: BoxDecoration(color: Tokens.card, borderRadius: BorderRadius.circular(Tokens.cardRadius)),
            child: Column(
              children: [
                Text(_clock, key: const ValueKey('diag-clock'), style: display(40)),
                SizedBox(height: 12.h),
                Row(
                  children: [
                    Expanded(
                      child: Semantics(
                        identifier: 'diag-begin',
                        child: PillButton(
                          key: const ValueKey('diag-begin'),
                          label: 'Begin',
                          icon: Icons.play_arrow_rounded,
                          onPressed: _running ? null : _begin,
                        ),
                      ),
                    ),
                    SizedBox(width: 10.w),
                    PillButton(
                      key: const ValueKey('diag-stop'),
                      label: 'Stop',
                      icon: Icons.stop_rounded,
                      expand: false,
                      tone: PillTone.quiet,
                      onPressed: _running ? _stop : null,
                    ),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(height: 18.h),
          if (gate != null) ...[
            BrickfordField(
              key: const ValueKey('diag-score'),
              icon: Icons.percent_rounded,
              hint: score != null ? '$score' : '74',
              controller: _score,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              onSubmitted: (_) => _record(m),
            ),
            SizedBox(height: 10.h),
            Semantics(
              identifier: 'diag-record',
              child: PillButton(key: const ValueKey('diag-record'), label: 'Record', icon: Icons.fact_check_outlined, onPressed: () => _record(m)),
            ),
            if (_bad)
              Padding(
                padding: EdgeInsets.only(top: 8.h),
                child: const Icon(Icons.error_outline, color: Tokens.missed, semanticLabel: 'enter the honest number'),
              ),
          ] else
            PillButton(
              key: const ValueKey('diag-complete'),
              label: score == null && r['date'] != null ? 'Done' : 'Complete',
              icon: Icons.check_circle_outline,
              tone: r['date'] != null ? PillTone.done : PillTone.primary,
              onPressed: () => m.recordDiagDone(widget.id),
            ),
          if (r['date'] != null && gate != null && score != null) ...[
            SizedBox(height: 14.h),
            Row(
              children: [
                Icon(score >= gate ? Icons.verified_rounded : Icons.flag_outlined, color: score >= gate ? Tokens.done : Tokens.half, size: 22),
                SizedBox(width: 8.w),
                Text('$score%  ·  ${r['date']}', key: const ValueKey('diag-recorded'), style: body(14, weight: FontWeight.w700)),
              ],
            ),
          ],
        ],
      ),
    );
  }

  void _record(AppModel m) {
    final v = jsParseFloat(_score.text);
    final ok = m.recordDiag(widget.id, v);
    setState(() => _bad = !ok);
    if (ok) FocusScope.of(context).unfocus();
  }
}
