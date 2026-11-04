// The blueprint's primary action (§4): a flat pill, radius 16, elevation 0 in
// every state (styleFrom alone would lift it +2 on hover and +6 on press).
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../theme/theme.dart';
import '../theme/tokens.dart';

enum PillTone { primary, quiet, done }

class PillButton extends StatelessWidget {
  const PillButton({super.key, required this.label, this.icon, this.onPressed, this.tone = PillTone.primary, this.expand = true});

  final String label;
  final IconData? icon;
  final VoidCallback? onPressed;
  final PillTone tone;
  final bool expand;

  static ButtonStyle styleFor(PillTone tone) {
    final (bg, fg) = switch (tone) {
      PillTone.primary => (Tokens.primary, Tokens.onPrimary),
      PillTone.quiet => (Tokens.fieldFill, Tokens.ink),
      PillTone.done => (Tokens.done, Colors.white),
    };
    return ElevatedButton.styleFrom(
      backgroundColor: bg,
      foregroundColor: fg,
      disabledBackgroundColor: Tokens.fieldFill,
      disabledForegroundColor: Tokens.ink2,
      shadowColor: Colors.transparent,
      minimumSize: const Size(44, 52),
      padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 14.h),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(Tokens.radius))),
    ).copyWith(elevation: const WidgetStatePropertyAll(0));
  }

  @override
  Widget build(BuildContext context) {
    final text = Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: body(15, color: null, weight: FontWeight.w600));
    final button = ElevatedButton(
      style: styleFor(tone),
      onPressed: onPressed,
      child: Row(
        mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (icon != null) ...[Icon(icon, size: 20), SizedBox(width: 10.w)],
          Flexible(child: text),
        ],
      ),
    );
    return expand ? SizedBox(width: double.infinity, child: button) : button;
  }
}
