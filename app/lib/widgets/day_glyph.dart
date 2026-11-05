// The calendar's marks, drawn rather than picked from an icon font, so a day
// and a lecture read as the same shape language: a green disc with a tick
// (done / cleared), a half ring (part / watched with the quiz still open), a
// red ring (missed), a grey ring (ahead / not watched), a muted moon (rest),
// and a small accent diamond for a gate's target date.
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../state/app_model.dart';
import '../theme/tokens.dart';

enum DayMark { done, part, missed, open, rest, none }

/// engine.dayStatus -> the mark the month grid draws. A day before the start
/// draws nothing, as the web app's grid does; today is an open ring until it
/// is over (dayStatus says "today" whatever was done).
DayMark markForStatus(String status, {bool beforeStart = false}) {
  if (beforeStart) return DayMark.none;
  return switch (status) {
    'completed' => DayMark.done,
    'partial' => DayMark.part,
    'missed' => DayMark.missed,
    'rest' => DayMark.rest,
    _ => DayMark.open,
  };
}

/// A lecture's [LessonMark] as a day mark: cleared = tick, watched = half ring, else ring.
DayMark markForLesson(LessonMark m) => switch (m) {
  LessonMark.cleared => DayMark.done,
  LessonMark.watched => DayMark.part,
  LessonMark.none => DayMark.open,
};

class DayGlyph extends StatelessWidget {
  const DayGlyph(this.mark, {super.key, this.size = 22, this.gate = false, this.semantic});
  final DayMark mark;
  final double size;

  /// Overlay the gate diamond (top right).
  final bool gate;

  /// The spoken label; defaults to the mark's name.
  final String? semantic;

  static String nameOf(DayMark m) => switch (m) {
    DayMark.done => 'done',
    DayMark.part => 'part',
    DayMark.missed => 'missed',
    DayMark.open => 'ahead',
    DayMark.rest => 'rest',
    DayMark.none => '',
  };

  @override
  Widget build(BuildContext context) {
    final label = semantic ?? [nameOf(mark), if (gate) 'gate'].where((s) => s.isNotEmpty).join(', ');
    return Semantics(
      label: label,
      excludeSemantics: true,
      child: SizedBox(
        width: size,
        height: size,
        child: CustomPaint(painter: _GlyphPainter(mark, gate)),
      ),
    );
  }
}

class _GlyphPainter extends CustomPainter {
  _GlyphPainter(this.mark, this.gate);
  final DayMark mark;
  final bool gate;

  @override
  void paint(Canvas canvas, Size size) {
    final c = size.center(Offset.zero);
    final r = size.shortestSide / 2;
    final stroke = math.max(2.0, r * 0.2);
    final ring = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke;
    final inner = r - stroke / 2;
    switch (mark) {
      case DayMark.done:
        canvas.drawCircle(c, r, Paint()..color = Tokens.done);
        final tick = Path()
          ..moveTo(c.dx - r * 0.42, c.dy + r * 0.02)
          ..lineTo(c.dx - r * 0.1, c.dy + r * 0.34)
          ..lineTo(c.dx + r * 0.46, c.dy - r * 0.3);
        canvas.drawPath(
          tick,
          Paint()
            ..color = Colors.white
            ..style = PaintingStyle.stroke
            ..strokeWidth = stroke * 1.05
            ..strokeCap = StrokeCap.round
            ..strokeJoin = StrokeJoin.round,
        );
      case DayMark.part:
        canvas.drawCircle(c, inner, ring..color = Tokens.ringTrack);
        canvas.drawArc(
          Rect.fromCircle(center: c, radius: inner),
          -math.pi / 2,
          math.pi,
          false,
          Paint()
            ..color = Tokens.half
            ..style = PaintingStyle.stroke
            ..strokeWidth = stroke
            ..strokeCap = StrokeCap.round,
        );
        canvas.drawArc(Rect.fromCircle(center: c, radius: inner * 0.62), -math.pi / 2, math.pi, true, Paint()..color = Tokens.half);
      case DayMark.missed:
        canvas.drawCircle(c, inner, ring..color = Tokens.missed);
      case DayMark.open:
        canvas.drawCircle(c, inner, ring..color = Tokens.ringOpen);
      case DayMark.rest:
        // A crescent: the disc less an offset disc.
        final moon = Path.combine(
          PathOperation.difference,
          Path()..addOval(Rect.fromCircle(center: c, radius: r * 0.62)),
          Path()..addOval(Rect.fromCircle(center: c.translate(r * 0.36, -r * 0.3), radius: r * 0.56)),
        );
        canvas.drawPath(moon, Paint()..color = Tokens.restMark);
      case DayMark.none:
        break;
    }
    if (gate) {
      final d = r * 0.5;
      final at = Offset(size.width - d * 0.7, d * 0.7);
      final diamond = Path()
        ..moveTo(at.dx, at.dy - d)
        ..lineTo(at.dx + d, at.dy)
        ..lineTo(at.dx, at.dy + d)
        ..lineTo(at.dx - d, at.dy)
        ..close();
      canvas.drawPath(diamond, Paint()..color = Tokens.accent);
      canvas.drawPath(
        diamond,
        Paint()
          ..color = Colors.white
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.5,
      );
    }
  }

  @override
  bool shouldRepaint(_GlyphPainter old) => old.mark != mark || old.gate != gate;
}
