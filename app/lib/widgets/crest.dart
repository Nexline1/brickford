// The Brickford crest (owner's artwork, 23 Nov 2026): the shield's two
// keylines, the laurel wreath, the temple and the two diamonds, all one gold
// mark on whatever it sits on. One even-odd path, the same data as the web
// app's sidebar crest (platform/index.html) and every icon (platform/icons/*),
// all written by tools/crest-gen.js from platform/icons/crest.svg (viewBox
// 0 0 200 224).
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/theme.dart';
import '../theme/tokens.dart';
import 'crest_data.dart';

class Crest extends StatelessWidget {
  const Crest({super.key, this.height = 30, this.field = Tokens.crest, this.cut = Tokens.midnight, this.semantic = 'Brickford crest'});

  /// The crest's height; its width follows the 200:224 viewBox.
  final double height;

  /// [field] is the mark's colour. [cut] is no longer painted (the new crest is
  /// a mark on an open field, not a gold shield with holes in it); it is kept so
  /// the call sites read as before.
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

  /// [crestPathData] as a Path, parsed once. The data holds only absolute
  /// M, L, C and Z (crest-gen writes nothing else).
  static final Path mark = parseCrestPath(crestPathData);

  @override
  void paint(Canvas canvas, Size size) {
    final s = math.min(size.width / Crest.viewBox.width, size.height / Crest.viewBox.height);
    canvas.save();
    canvas.translate((size.width - Crest.viewBox.width * s) / 2, (size.height - Crest.viewBox.height * s) / 2);
    canvas.scale(s);
    canvas.drawPath(mark, Paint()
      ..color = field
      ..isAntiAlias = true);
    canvas.restore();
  }

  @override
  bool shouldRepaint(CrestPainter old) => old.field != field || old.cut != cut;
}

/// Absolute M/L/C/Z path data to an even-odd [Path].
Path parseCrestPath(String d) {
  final path = Path()..fillType = PathFillType.evenOdd;
  final tok = RegExp(r'[MLCZ]|-?\d+(?:\.\d+)?').allMatches(d).map((m) => m.group(0)!).toList();
  var i = 0;
  var cmd = '';
  double n() => double.parse(tok[i++]);
  while (i < tok.length) {
    if (RegExp(r'^[MLCZ]$').hasMatch(tok[i])) cmd = tok[i++];
    switch (cmd) {
      case 'M':
        path.moveTo(n(), n());
        cmd = 'L';
      case 'L':
        path.lineTo(n(), n());
      case 'C':
        path.cubicTo(n(), n(), n(), n(), n(), n());
      case 'Z':
        path.close();
      default:
        throw FormatException('crest path: unexpected "$cmd"');
    }
  }
  return path;
}

/// The lockup, as the web app's drawer sets it: the crest, BRICKFORD in
/// letter-spaced caps, a gold hairline, and SELF-BUILT UNIVERSITY under it.
///
/// The splash draws it, and web/index.html's #boot draws the same lockup in CSS
/// px before the engine is up (T-072), so every measure is a fixed fraction of
/// [height] in logical px: no ScreenUtil .sp (which scaled the text but not the
/// crest, so the two screens disagreed on every phone but a 375x812 one), no
/// system text scale, and even leading, which is CSS's half-leading. For
/// height 132: crest 132 tall, a 21.12 gap, BRICKFORD 26.4/1.1 at .14em, a
/// 39.6x1 rule with 9.24 above and below, SELF-BUILT UNIVERSITY 11.22/1.2 at .2em.
class CrestLockup extends StatelessWidget {
  const CrestLockup({super.key, this.height = 120});
  final double height;

  @override
  Widget build(BuildContext context) {
    final wm = height * 0.2, est = height * 0.085;
    return MediaQuery.withNoTextScaling(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Crest(height: height),
          SizedBox(height: height * 0.16),
          Text(
            'BRICKFORD',
            style: display(wm, color: Tokens.onMidnight).copyWith(
                fontSize: wm, letterSpacing: wm * 0.14, height: 1.1, leadingDistribution: TextLeadingDistribution.even),
          ),
          Container(
            width: height * 0.3,
            height: 1,
            margin: EdgeInsets.symmetric(vertical: height * 0.07),
            color: Tokens.gold,
          ),
          Text(
            'SELF-BUILT UNIVERSITY',
            style: body(est, color: Tokens.onMidnight2, weight: FontWeight.w600).copyWith(
                fontSize: est, letterSpacing: est * 0.2, height: 1.2, leadingDistribution: TextLeadingDistribution.even),
          ),
        ],
      ),
    );
  }
}
