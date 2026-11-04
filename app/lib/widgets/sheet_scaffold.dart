// The blueprint's viewport: a midnight canvas holding the branding, and a
// white sheet with 36px top corners laid over it, the screen's content
// scrolling inside the sheet (skill_ui_blueprint.md §1-2).
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../state/app_model.dart';
import '../theme/theme.dart';
import '../theme/tokens.dart';

class SheetScaffold extends StatelessWidget {
  const SheetScaffold({super.key, this.header, required this.children, this.onBack});

  /// What this screen shows on the canvas under the branding: numbers, badges.
  final Widget? header;

  /// The sheet's content, in a bouncing scroll.
  final List<Widget> children;

  /// A back control in the branding row (pushed screens).
  final VoidCallback? onBack;

  static const sheetKey = ValueKey('brickford-sheet');
  static const canvasKey = ValueKey('brickford-canvas');

  @override
  Widget build(BuildContext context) {
    final identity = AppScope.of(context).data.identity;
    return ColoredBox(
      key: canvasKey,
      color: Tokens.midnight,
      child: Stack(
        children: [
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: Tokens.headerHeight.h,
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: EdgeInsets.fromLTRB(24.w, 14.h, 24.w, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        if (onBack != null)
                          Padding(
                            padding: EdgeInsets.only(right: 4.w),
                            child: IconButton(
                              onPressed: onBack,
                              tooltip: 'Back',
                              icon: const Icon(Icons.arrow_back_ios_new, color: Tokens.onMidnight, size: 20),
                              constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                            ),
                          ),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Brickford', style: display(26)),
                              SizedBox(height: 2.h),
                              Text(identity['motto']?.toString() ?? '',
                                  style: body(12, color: Tokens.onMidnight2, weight: FontWeight.w500)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16.h),
                    ?header,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: Tokens.sheetTop.h,
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              key: sheetKey,
              decoration: const BoxDecoration(
                color: Tokens.sheet,
                borderRadius: Tokens.sheetBorderRadius,
                boxShadow: Tokens.sheetShadow,
              ),
              child: ClipRRect(
                borderRadius: Tokens.sheetBorderRadius,
                child: ListView(
                  physics: const BouncingScrollPhysics(),
                  padding: EdgeInsets.fromLTRB(20.w, 28.h, 20.w, 28.h),
                  children: children,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
