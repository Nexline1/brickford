// The Brickford crest: the gold shield, its keyline, the temple under its
// arch, the laurels and the two diamonds, painted from the same path data as
// the web app's sidebar crest (platform/index.html, viewBox 0 0 200 224) and
// its icons (platform/icons/*). The web app colours it with CSS: the field is
// --crest, and every cut (cr-cut, cr-stem, and cr-key at 55% opacity) is the
// panel the crest sits on. Here those are [field] and [cut].
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/theme.dart';
import '../theme/tokens.dart';
import 'crest_data.dart';

class Crest extends StatelessWidget {
  const Crest({super.key, this.height = 30, this.field = Tokens.gold, this.cut = Tokens.midnight, this.semantic = 'Brickford crest'});

  /// The crest's height; its width follows the 200:224 viewBox.
  final double height;
  final Color field, cut;
  final String? semantic;

  static const viewBox = Size(200, 224);

  @override
  Widget build(BuildContext context) {
    final painted = SizedBox(
      width: height * viewBox.width / viewBox.height,
      height: height,
      child: CustomPaint(
        painter: CrestPainter(field: field, cut: cut),
      ),
    );
    return semantic == null ? painted : Semantics(label: semantic, image: true, child: painted);
  }
}

class CrestPainter extends CustomPainter {
  CrestPainter({required this.field, required this.cut});
  final Color field, cut;

  static Path fieldPath() => Path()
    ..moveTo(18, 16)
    ..lineTo(182, 16)
    ..lineTo(182, 118)
    ..cubicTo(182, 168, 143, 199, 100, 212)
    ..cubicTo(57, 199, 18, 168, 18, 118)
    ..close();

  static Path keyPath() => Path()
    ..moveTo(30, 28)
    ..lineTo(170, 28)
    ..lineTo(170, 118)
    ..cubicTo(170, 160, 137, 187, 100, 199)
    ..cubicTo(63, 187, 30, 160, 30, 118)
    ..close();

  static final stems = [
    Path()
      ..moveTo(60, 178)
      ..cubicTo(38, 158, 30, 118, 48, 78),
    Path()
      ..moveTo(140, 178)
      ..cubicTo(162, 158, 170, 118, 152, 78),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final s = math.min(size.width / Crest.viewBox.width, size.height / Crest.viewBox.height);
    canvas.save();
    canvas.translate((size.width - Crest.viewBox.width * s) / 2, (size.height - Crest.viewBox.height * s) / 2);
    canvas.scale(s);

    final cutFill = Paint()
      ..color = cut
      ..isAntiAlias = true;
    canvas.drawPath(fieldPath(), Paint()..color = field);
    canvas.drawPath(
      keyPath(),
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3
        ..color = cut.withValues(alpha: 0.55),
    );
    for (final p in crestPolygons) {
      canvas.drawPath(Path()..addPolygon(p, true), cutFill);
    }
    for (final r in crestRects) {
      canvas.save();
      if (r.rot != 0) {
        canvas.translate(r.cx, r.cy);
        canvas.rotate(r.rot * math.pi / 180);
        canvas.translate(-r.cx, -r.cy);
      }
      canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(r.x, r.y, r.w, r.h), Radius.circular(r.rx)), cutFill);
      canvas.restore();
    }
    final stem = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.4
      ..strokeCap = StrokeCap.round
      ..color = cut;
    for (final p in stems) {
      canvas.drawPath(p, stem);
    }
    for (final e in crestLeaves) {
      canvas.save();
      canvas.translate(e.cx, e.cy);
      canvas.rotate(e.rot * math.pi / 180);
      canvas.drawOval(Rect.fromCenter(center: Offset.zero, width: e.rx * 2, height: e.ry * 2), cutFill);
      canvas.restore();
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(CrestPainter old) => old.field != field || old.cut != cut;
}

/// The lockup, as the web app's drawer sets it: the crest, BRICKFORD in
/// letter-spaced caps, a gold hairline, and SELF-BUILT UNIVERSITY under it.
class CrestLockup extends StatelessWidget {
  const CrestLockup({super.key, this.height = 120});
  final double height;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Crest(height: height),
        SizedBox(height: height * 0.16),
        Text(
          'BRICKFORD',
          style: display(height * 0.2, color: Tokens.onMidnight).copyWith(letterSpacing: height * 0.2 * 0.14),
        ),
        Container(
          width: height * 0.3,
          height: 1,
          margin: EdgeInsets.symmetric(vertical: height * 0.07),
          color: Tokens.gold,
        ),
        Text(
          'SELF-BUILT UNIVERSITY',
          style: body(height * 0.085, color: Tokens.onMidnight2, weight: FontWeight.w600).copyWith(letterSpacing: height * 0.085 * 0.2),
        ),
      ],
    );
  }
}
