// The Method (V.method): why watching fades (the retention curve, drawn rather
// than argued), the four gates per lecture, the spacing, and the two numbers
// (watched against proven). Text is the web page's.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/learn.dart' show BOXES;
import '../../engine/pages.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import '../learn/recall_screen.dart';

void openMethod(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MethodScreen()));

class MethodScreen extends StatelessWidget {
  const MethodScreen({super.key});

  static const steps = [
    ('Recall cold', 'Blank page, three minutes, no video. What did it establish?'),
    ('Rebuild', 'Reproduce the derivation or the code from memory. Diff it.'),
    ('Solve unaided', 'Three problems from the real source. Solutions only after.'),
    ('Explain plainly', 'A few sentences a smart friend would follow. That is your post.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: Text('The Method', key: const ValueKey('method-title'), style: display(34)),
        children: [
          SheetLabel(Icons.show_chart_rounded, 'Why watching fades'),
          Container(
            padding: EdgeInsets.fromLTRB(12.w, 14.h, 12.w, 10.h),
            decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
            child: Column(
              children: [
                AspectRatio(
                  aspectRatio: RetentionCurve.W / RetentionCurve.H,
                  child: Semantics(
                    label: 'Retention decays quickly without recall; each recall resets it and flattens the decay',
                    child: CustomPaint(key: const ValueKey('method-curve'), painter: _CurvePainter(RetentionCurve())),
                  ),
                ),
                SizedBox(height: 8.h),
                Wrap(
                  spacing: 16.w,
                  runSpacing: 4.h,
                  children: [
                    _Key(Tokens.missed, 'watch once', dashed: true),
                    _Key(Tokens.accent, 'recall at widening gaps'),
                    _Key(Tokens.accent, 'a recall check', dot: true),
                  ],
                ),
              ],
            ),
          ),
          SheetLabel(Icons.verified_outlined, 'Four gates per lecture'),
          Padding(
            padding: EdgeInsets.only(bottom: 8.h),
            child: Text('All four, or it counts as watched — not proven.', style: body(12.5, color: Tokens.ink2)),
          ),
          for (final (i, s) in steps.indexed) ItemBlock(key: ValueKey('method-step-${i + 1}'), leading: LeadTile(text: '${i + 1}'), title: s.$1, subtitle: s.$2),
          SheetLabel(Icons.replay_rounded, 'Then it comes back'),
          Container(
            padding: EdgeInsets.symmetric(vertical: 14.h, horizontal: 12.w),
            decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    for (final (i, d) in BOXES.indexed)
                      Column(
                        children: [
                          Container(width: 14, height: 14, decoration: BoxDecoration(shape: BoxShape.circle, color: Tokens.accent.withValues(alpha: 0.45 + i * 0.14))),
                          SizedBox(height: 4.h),
                          Text('${d}d', style: body(12.5, color: Tokens.ink2, weight: FontWeight.w700)),
                        ],
                      ),
                  ],
                ),
                SizedBox(height: 6.h),
                Text('Solid recall pushes it out · forgetting resets it', style: body(12.5, color: Tokens.ink2)),
              ],
            ),
          ),
          SizedBox(height: 10.h),
          PillButton(key: const ValueKey('method-recall'), id: 'method-recall', label: 'Open Recall', icon: Icons.psychology_alt_outlined, onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const RecallScreen()))),
          SheetLabel(Icons.compare_arrows_rounded, 'Two different numbers'),
          Container(
            padding: EdgeInsets.all(14.w),
            decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _Bar('Watched', 0.7, '70%', Tokens.quiet),
                SizedBox(height: 12.h),
                _Bar('Proven', 0.25, '25%', Tokens.accent),
                SizedBox(height: 12.h),
                Text('Mastery counts the second one. The gap is the honest picture of where you stand.', style: body(13, color: Tokens.ink2, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Bar extends StatelessWidget {
  const _Bar(this.label, this.value, this.text, this.color);
  final String label, text;
  final double value;
  final Color color;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [Text(label, style: body(13.5, weight: FontWeight.w600)), Text(text, style: body(13.5, color: Tokens.ink2, weight: FontWeight.w700))],
      ),
      SizedBox(height: 4.h),
      ClipRRect(
        borderRadius: BorderRadius.circular(4),
        child: LinearProgressIndicator(value: value, minHeight: 6, backgroundColor: Tokens.track, valueColor: AlwaysStoppedAnimation(color)),
      ),
    ],
  );
}

class _Key extends StatelessWidget {
  const _Key(this.color, this.text, {this.dashed = false, this.dot = false});
  final Color color;
  final String text;
  final bool dashed, dot;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      if (dot)
        Container(width: 8, height: 8, decoration: BoxDecoration(shape: BoxShape.circle, color: color))
      else
        SizedBox(width: 16, height: 4, child: CustomPaint(painter: _LinePainter(color, dashed))),
      SizedBox(width: 6.w),
      Text(text, style: body(12, color: Tokens.ink2, weight: FontWeight.w600)),
    ],
  );
}

class _LinePainter extends CustomPainter {
  const _LinePainter(this.color, this.dashed);
  final Color color;
  final bool dashed;
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = color..strokeWidth = 2;
    if (!dashed) return canvas.drawLine(Offset(0, size.height / 2), Offset(size.width, size.height / 2), p);
    for (var x = 0.0; x < size.width; x += 5) {
      canvas.drawLine(Offset(x, size.height / 2), Offset((x + 3).clamp(0, size.width), size.height / 2), p);
    }
  }

  @override
  bool shouldRepaint(_LinePainter o) => false;
}

/// retentionSVG drawn: the 620x165 plot scaled to the box.
class _CurvePainter extends CustomPainter {
  _CurvePainter(this.c);
  final RetentionCurve c;

  @override
  void paint(Canvas canvas, Size size) {
    final sx = size.width / RetentionCurve.W, sy = size.height / RetentionCurve.H;
    Offset at((double, double) p) => Offset(p.$1 * sx, p.$2 * sy);
    final axis = Paint()..color = Tokens.ringOpen..strokeWidth = 1;
    final y0 = RetentionCurve.Y(0) * sy, x0 = RetentionCurve.pad * sx;
    canvas.drawLine(Offset(x0, y0), Offset((RetentionCurve.W - 10) * sx, y0), axis);
    canvas.drawLine(Offset(x0, y0), Offset(x0, RetentionCurve.Y(100) * sy), axis);
    void label(String t, Offset o) {
      final tp = TextPainter(text: TextSpan(text: t, style: body(11, color: Tokens.ink2, weight: FontWeight.w600)), textDirection: TextDirection.ltr)..layout();
      tp.paint(canvas, o);
    }

    label('100%', Offset(0, RetentionCurve.Y(100) * sy - 6));
    label('day 0', Offset(x0, size.height - 14));
    label('day 130', Offset((RetentionCurve.W - 50) * sx, size.height - 14));
    // watch once: dashed 4 3
    final dash = Paint()..color = Tokens.missed..style = PaintingStyle.stroke..strokeWidth = 2;
    final pp = Path()..moveTo(at(c.passive.first).dx, at(c.passive.first).dy);
    for (final p in c.passive.skip(1)) {
      pp.lineTo(at(p).dx, at(p).dy);
    }
    for (final m in pp.computeMetrics()) {
      for (var d = 0.0; d < m.length; d += 7) {
        canvas.drawPath(m.extractPath(d, (d + 4).clamp(0, m.length)), dash);
      }
    }
    final sp = Path()..moveTo(at(c.spaced.first).dx, at(c.spaced.first).dy);
    for (final p in c.spaced.skip(1)) {
      sp.lineTo(at(p).dx, at(p).dy);
    }
    canvas.drawPath(sp, Paint()..color = Tokens.accent..style = PaintingStyle.stroke..strokeWidth = 2.2..strokeJoin = StrokeJoin.round);
    for (final d in c.dots) {
      canvas.drawCircle(at(d), 3.4, Paint()..color = Tokens.accent);
    }
  }

  @override
  bool shouldRepaint(_CurvePainter o) => false;
}
