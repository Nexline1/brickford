// The blueprint's viewport (skill_ui_blueprint.md §1-2): a Stack whose base
// layer is the midnight canvas holding the branding, and a white sheet laid
// over it from 240 (design px) down, 36px top corners only, a black12 soft blur-12
// shadow cast upward, the screen's content scrolling inside it with
// BouncingScrollPhysics.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../theme/theme.dart';
import '../theme/tokens.dart';
import 'blocks.dart';
import 'crest.dart';

class SheetScaffold extends StatelessWidget {
  const SheetScaffold({super.key, this.header, this.trailing, this.canvas, required this.children, this.onBack, this.tabbed = false});

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
            // The screen's numbers sit at the foot of the canvas, just above the sheet.
            // (Spacer then header, not Align: a header Column would fill an Align.)
            const Spacer(),
            ?header,
            SizedBox(height: 30.h),
          ],
        ),
      ),
    );

    return ColoredBox(
      key: canvasKey,
      color: Tokens.midnight,
      child: Stack(
        children: [
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: canvas != null ? Tokens.headerHeight.h : Tokens.sheetTop.h,
            child: canvas ?? branding,
          ),
          Positioned(
            top: Tokens.sheetTop.h,
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
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
            ),
          ),
        ],
      ),
    );
  }
}
