// Small shared pieces: the separated item block with its trailing arrow
// (blueprint §5, Academics), the lesson glyph, the persistent badge (§5,
// Rhythm), a stat on the canvas, and a progress bar.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../state/app_model.dart';
import '../theme/theme.dart';
import '../theme/tokens.dart';

class ItemBlock extends StatelessWidget {
  const ItemBlock({super.key, this.leading, required this.title, this.subtitle, this.meta, this.onTap, this.below});

  final Widget? leading;
  final String title;
  final String? subtitle;
  final String? meta;
  final VoidCallback? onTap;
  final Widget? below;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: 10.h),
      child: Material(
        color: Tokens.fieldFill,
        borderRadius: BorderRadius.circular(Tokens.radius),
        child: InkWell(
          borderRadius: BorderRadius.circular(Tokens.radius),
          onTap: onTap,
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 56),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
              child: Row(
                children: [
                  if (leading != null) ...[leading!, SizedBox(width: 12.w)],
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (subtitle != null)
                          Text(subtitle!, style: body(11, color: Tokens.ink2, weight: FontWeight.w600)),
                        Text(title, maxLines: 2, overflow: TextOverflow.ellipsis, style: body(14.5, weight: FontWeight.w600, height: 1.3)),
                        if (below != null) ...[SizedBox(height: 8.h), below!],
                      ],
                    ),
                  ),
                  if (meta != null) ...[SizedBox(width: 8.w), Text(meta!, style: body(12.5, color: Tokens.ink2, weight: FontWeight.w600))],
                  if (onTap != null) ...[SizedBox(width: 8.w), const Icon(Icons.arrow_forward_ios, size: 14, color: Tokens.quiet)],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}


/// Not watched, watched with its quiz still open, cleared.
class LessonGlyph extends StatelessWidget {
  const LessonGlyph(this.mark, {super.key, this.size = 24});
  final LessonMark mark;
  final double size;

  @override
  Widget build(BuildContext context) {
    final (icon, color, label) = switch (mark) {
      LessonMark.cleared => (Icons.check_circle, Tokens.done, 'cleared'),
      LessonMark.watched => (Icons.timelapse, Tokens.half, 'watched, quiz open'),
      LessonMark.none => (Icons.radio_button_unchecked, Tokens.quiet, 'not watched'),
    };
    return Icon(icon, color: color, size: size, semanticLabel: label);
  }
}

/// A persistent badge on the canvas or the sheet.
class RhythmBadge extends StatelessWidget {
  const RhythmBadge({super.key, required this.icon, required this.label, this.onMidnight = true});
  final IconData icon;
  final String label;
  final bool onMidnight;

  @override
  Widget build(BuildContext context) {
    final fg = onMidnight ? Tokens.midnight : Colors.white;
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 7.h),
      decoration: BoxDecoration(
        color: onMidnight ? Colors.white : Tokens.midnight,
        borderRadius: BorderRadius.circular(Tokens.radius),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: 16, color: fg),
        SizedBox(width: 6.w),
        Text(label, style: body(13, color: fg, weight: FontWeight.w700)),
      ]),
    );
  }
}

/// An icon and a number on the canvas.
class Stat extends StatelessWidget {
  const Stat({super.key, required this.icon, required this.value, required this.semantic});
  final IconData icon;
  final String value;
  final String semantic;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '$semantic $value',
      excludeSemantics: true,
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: 18, color: Tokens.onMidnight2),
        SizedBox(width: 5.w),
        Text(value, style: body(15, color: Tokens.onMidnight, weight: FontWeight.w700)),
      ]),
    );
  }
}

class ProgressBar extends StatelessWidget {
  const ProgressBar(this.value, {super.key});
  final double value;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(4),
      child: LinearProgressIndicator(
        value: value.clamp(0, 1).toDouble(),
        minHeight: 6,
        backgroundColor: Tokens.track,
        valueColor: const AlwaysStoppedAnimation(Tokens.primary),
      ),
    );
  }
}

/// A small section label on the sheet.
class SheetLabel extends StatelessWidget {
  const SheetLabel(this.icon, this.text, {super.key});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(top: 8.h, bottom: 10.h),
      child: Row(children: [
        Icon(icon, size: 18, color: Tokens.quiet),
        SizedBox(width: 8.w),
        Text(text, style: body(13, color: Tokens.ink2, weight: FontWeight.w700)),
      ]),
    );
  }
}
