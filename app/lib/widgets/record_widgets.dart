// Small pieces the stage 5 pages share: a number tile, a round step button,
// and the toast. Same tokens as the rest of the app; nothing here is new design.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../theme/theme.dart';
import '../theme/tokens.dart';

/// A light tile: an icon, a number in Playfair, a one-word label. [child]
/// replaces the number (a stepper, a field).
class StatTile extends StatelessWidget {
  const StatTile({super.key, required this.icon, required this.label, this.value, this.child, this.id});
  final IconData icon;
  final String label;
  final String? value;
  final Widget? child;
  final String? id;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      identifier: id,
      container: true,
      label: value != null ? '$label $value' : label,
      child: Container(
        constraints: const BoxConstraints(minHeight: 92),
        padding: EdgeInsets.symmetric(horizontal: 14.w, vertical: 12.h),
        decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              children: [
                Icon(icon, size: 16, color: Tokens.quiet),
                SizedBox(width: 6.w),
                Flexible(
                  child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: body(12, color: Tokens.ink2, weight: FontWeight.w700)),
                ),
              ],
            ),
            SizedBox(height: 4.h),
            child ??
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(value ?? '', style: display(28, color: Tokens.ink)),
                ),
          ],
        ),
      ),
    );
  }
}

/// A 44x44 round step button.
class StepButton extends StatelessWidget {
  const StepButton({super.key, required this.icon, required this.tooltip, required this.onPressed, this.id});
  final IconData icon;
  final String tooltip;
  final VoidCallback? onPressed;
  final String? id;

  @override
  Widget build(BuildContext context) {
    final button = Tooltip(
      message: tooltip,
      child: Material(
        color: Colors.white,
        shape: const CircleBorder(side: BorderSide(color: Tokens.hairline)),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onPressed,
          child: SizedBox(width: 44, height: 44, child: Icon(icon, size: 20, color: onPressed == null ? Tokens.quiet : Tokens.ink, semanticLabel: tooltip)),
        ),
      ),
    );
    return id == null ? button : Semantics(identifier: id, child: button);
  }
}

void toast(BuildContext context, String text) {
  final m = ScaffoldMessenger.maybeOf(context);
  m?.hideCurrentSnackBar();
  m?.showSnackBar(
    SnackBar(
      behavior: SnackBarBehavior.floating,
      backgroundColor: Tokens.card,
      duration: const Duration(seconds: 2),
      content: Text(text, style: body(14, color: Colors.white, weight: FontWeight.w600)),
    ),
  );
}
