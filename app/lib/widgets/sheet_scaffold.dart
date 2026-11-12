// The blueprint's viewport (skill_ui_blueprint.md §1-2): a Stack whose base
// layer is the midnight canvas holding the branding, and a white sheet laid
// over it from 240 (design px) down, 36px top corners only, a black12 soft blur-12
// shadow cast upward, the screen's content scrolling inside it with
// BouncingScrollPhysics.
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../theme/theme.dart';
import '../theme/tokens.dart';
import 'blocks.dart';
import 'crest.dart';

class SheetScaffold extends StatelessWidget {
  const SheetScaffold({
    super.key,
    this.header,
    this.trailing,
    this.canvas,
    required this.children,
    this.onBack,
    this.tabbed = false,
    this.canvasHeight,
    this.sheetTop,
  });

  /// What this screen shows on the canvas under the branding: numbers, badges.
  final Widget? header;

  /// The right end of the branding row (a persistent badge).
  final Widget? trailing;

  /// Replaces the branding layer entirely (the lecture's video).
  final Widget? canvas;

  /// The sheet's content, in a bouncing scroll.
  final List<Widget> children;

  /// A frosted round back button in the branding row (pushed screens).
  final VoidCallback? onBack;

  /// A tab screen: the sheet's scroll clears the floating bar.
  final bool tabbed;

  /// Overrides for a screen whose canvas is not the branding (the lecture: a control
  /// row, then a video that must not be covered). Logical pixels, not design px.
  /// Left null, a [canvas] is [Tokens.headerHeight] tall and the sheet starts at
  /// [Tokens.sheetTop], so every other screen is laid out exactly as it was.
  final double? canvasHeight, sheetTop;

  static const sheetKey = ValueKey('brickford-sheet');
  static const canvasKey = ValueKey('brickford-canvas');

  @override
  Widget build(BuildContext context) {
    final branding = SafeArea(
      bottom: false,
      child: Padding(
        padding: EdgeInsets.fromLTRB(20.w, 12.h, 20.w, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          // T-068: brand row at the top, the screen's numbers at the foot, just above the sheet. Space
          // between them rather than a Spacer, so the layer can also be laid out at its natural height
          // (a Spacer needs a bounded one): see _GrowingCanvas.
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SizedBox(
              height: 44,
              child: Row(
                children: [
                  if (onBack != null) ...[
                    FrostButton(icon: Icons.arrow_back_ios_new, tooltip: 'Back', id: 'back', onPressed: onBack!, dark: true),
                    SizedBox(width: 12.w),
                  ],
                  const Crest(height: 32),
                  SizedBox(width: 10.w),
                  Expanded(
                    child: Text(
                      'BRICKFORD',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: display(17, color: Tokens.onMidnight).copyWith(letterSpacing: 17 * 0.14),
                    ),
                  ),
                  ?trailing,
                ],
              ),
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ?header,
                SizedBox(height: 30.h),
              ],
            ),
          ],
        ),
      ),
    );

    final sheet = Container(
      key: sheetKey,
      decoration: const BoxDecoration(color: Tokens.sheet, borderRadius: Tokens.sheetBorderRadius, boxShadow: Tokens.sheetShadow),
      child: ClipRRect(
        borderRadius: Tokens.sheetBorderRadius,
        // The scrolling content is its own layer: a scrolled frame repaints this, not the sheet's
        // shadow, the canvas behind it or the floating bar above it.
        child: RepaintBoundary(
          child: ListView(
            physics: const BouncingScrollPhysics(),
            padding: EdgeInsets.fromLTRB(20.w, 26.h, 20.w, tabbed ? Tokens.barClearance : 32.h),
            children: children,
          ),
        ),
      ),
    );

    // The branding layer (T-068): on a short screen, or under a tall status bar, the brand row and the
    // screen's numbers need more than sheetTop. The layer then takes its natural height and the sheet
    // starts below it, instead of the numbers overflowing under the sheet. Where they fit, nothing moves.
    if (canvas == null && canvasHeight == null && sheetTop == null) {
      return ColoredBox(
        key: canvasKey,
        color: Tokens.midnight,
        child: CustomMultiChildLayout(
          delegate: _GrowingCanvas(Tokens.sheetTop.h),
          children: [
            LayoutId(id: _GrowingCanvas.canvas, child: branding),
            LayoutId(id: _GrowingCanvas.sheet, child: sheet),
          ],
        ),
      );
    }

    return ColoredBox(
      key: canvasKey,
      color: Tokens.midnight,
      child: Stack(
        children: [
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: canvasHeight ?? (canvas != null ? Tokens.headerHeight.h : Tokens.sheetTop.h),
            child: canvas ?? branding,
          ),
          Positioned(top: sheetTop ?? Tokens.sheetTop.h, left: 0, right: 0, bottom: 0, child: sheet),
        ],
      ),
    );
  }
}

/// The branding layer at least [top] high and as tall as its content needs; the sheet from its foot down.
class _GrowingCanvas extends MultiChildLayoutDelegate {
  _GrowingCanvas(this.top);
  final double top;
  static const canvas = #canvas, sheet = #sheet;

  @override
  void performLayout(Size size) {
    final c = layoutChild(canvas, BoxConstraints(minWidth: size.width, maxWidth: size.width, minHeight: math.min(top, size.height)));
    positionChild(canvas, Offset.zero);
    final y = math.min(c.height, size.height);
    layoutChild(sheet, BoxConstraints.tight(Size(size.width, size.height - y)));
    positionChild(sheet, Offset(0, y));
  }

  @override
  bool shouldRelayout(_GrowingCanvas old) => old.top != top;
}
