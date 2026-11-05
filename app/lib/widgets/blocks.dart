// Small shared pieces: frosted round buttons, chips, the
// separated item block with its trailing arrow (blueprint §5, Academics), the
// dark lecture card, the lesson glyph, the persistent badge (§5, Rhythm), a
// stat on the canvas, a progress bar, and the video thumbnail with its
// fallback tile.
import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../state/app_model.dart';
import '../theme/theme.dart';
import '../theme/tokens.dart';
import 'crest.dart';

/// A round frosted button, 44x44: over the video, in the branding row, and
/// the bar's search button (at [size]).
class FrostButton extends StatelessWidget {
  const FrostButton({
    super.key,
    required this.icon,
    required this.tooltip,
    required this.onPressed,
    this.dark = false,
    this.size = 44,
    this.id,
  });
  final IconData icon;
  final String tooltip;
  final VoidCallback onPressed;
  final bool dark;
  final double size;

  /// The semantics identifier (what a browser harness finds it by).
  final String? id;

  @override
  Widget build(BuildContext context) {
    final fill = dark ? Colors.white.withValues(alpha: 0.16) : Tokens.frost;
    final fg = dark ? Colors.white : Tokens.ink;
    return Semantics(
      identifier: id,
      child: Tooltip(
        message: tooltip,
        child: ClipOval(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
            child: Material(
              color: fill,
              shape: CircleBorder(side: BorderSide(color: dark ? Colors.white24 : Tokens.hairline)),
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: onPressed,
                child: SizedBox(
                  width: size,
                  height: size,
                  child: Icon(icon, size: size * 0.42, color: fg, semanticLabel: tooltip),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// A selectable chip: fully round, dark filled when selected, white with a
/// hairline when not. 44 high, so it is a tap target and not a label.
class BrickChip extends StatelessWidget {
  const BrickChip({super.key, required this.label, required this.selected, required this.onTap, this.icon});
  final String label;
  final bool selected;
  final VoidCallback onTap;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final fg = selected ? Colors.white : Tokens.ink;
    return Material(
      color: selected ? Tokens.card : Colors.white,
      shape: StadiumBorder(side: BorderSide(color: selected ? Tokens.card : Tokens.hairline)),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: onTap,
        child: Container(
          height: 44,
          padding: EdgeInsets.symmetric(horizontal: 14.w),
          alignment: Alignment.center,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[Icon(icon, size: 17, color: fg), SizedBox(width: 6.w)],
              Text(
                label,
                style: body(13.5, color: fg, weight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A horizontal chip row that scrolls when it is wider than the sheet.
class ChipRow extends StatelessWidget {
  const ChipRow({super.key, required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: children.length,
        separatorBuilder: (_, _) => SizedBox(width: 8.w),
        itemBuilder: (_, i) => children[i],
      ),
    );
  }
}

/// The rounded-square tile at the start of a row.
class LeadTile extends StatelessWidget {
  const LeadTile({super.key, this.icon, this.text, this.color = Colors.white, this.fg = Tokens.ink});
  final IconData? icon;
  final String? text;
  final Color color, fg;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
      child: icon != null
          ? Icon(icon, size: 22, color: fg)
          : Text(
              text ?? '',
              maxLines: 1,
              style: body(12.5, color: fg, weight: FontWeight.w800),
            ),
    );
  }
}

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
            constraints: const BoxConstraints(minHeight: 64),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
              child: Row(
                children: [
                  if (leading != null) ...[leading!, SizedBox(width: 12.w)],
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: body(14.5, weight: FontWeight.w700, height: 1.3),
                        ),
                        if (subtitle != null) ...[
                          SizedBox(height: 2.h),
                          Text(
                            subtitle!,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: body(12, color: Tokens.ink2, weight: FontWeight.w500),
                          ),
                        ],
                        if (below != null) ...[SizedBox(height: 8.h), below!],
                      ],
                    ),
                  ),
                  if (meta != null) ...[
                    SizedBox(width: 8.w),
                    Text(
                      meta!,
                      style: body(12.5, color: Tokens.ink2, weight: FontWeight.w700),
                    ),
                  ],
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
  const LessonGlyph(this.mark, {super.key, this.size = 24, this.onDark = false});
  final LessonMark mark;
  final double size;
  final bool onDark;

  @override
  Widget build(BuildContext context) {
    final (icon, color, label) = switch (mark) {
      LessonMark.cleared => (Icons.check_circle, onDark ? Tokens.doneOnDark : Tokens.done, 'cleared'),
      LessonMark.watched => (Icons.timelapse, onDark ? const Color(0xFFF2A93B) : Tokens.half, 'watched, quiz open'),
      LessonMark.none => (Icons.radio_button_unchecked, onDark ? Tokens.onMidnight2 : Tokens.quiet, 'not watched'),
    };
    return Icon(icon, color: color, size: size, semanticLabel: label);
  }
}

/// The video's own thumbnail (i.ytimg.com), or a clean tile when it cannot
/// load (offline, no id): the accent's dark wash with the course code.
class VideoThumb extends StatelessWidget {
  const VideoThumb({super.key, required this.videoId, this.code});
  final String? videoId;
  final String? code;

  @override
  Widget build(BuildContext context) {
    final tile = FallbackTile(code: code);
    final id = videoId;
    if (id == null) return tile;
    return Image.network(
      'https://i.ytimg.com/vi/$id/hqdefault.jpg',
      fit: BoxFit.cover,
      frameBuilder: (_, child, frame, sync) => frame == null && !sync ? tile : child,
      errorBuilder: (_, _, _) => tile,
    );
  }
}

class FallbackTile extends StatelessWidget {
  const FallbackTile({super.key, this.code});
  final String? code;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Tokens.accent, Color(0xFF172238), Tokens.midnight],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            right: 18,
            top: 14,
            child: Opacity(opacity: 0.8, child: Crest(height: 34, cut: Color(0xFF172238), semantic: null)),
          ),
          if (code != null)
            Positioned(
              left: 14,
              bottom: 12,
              child: Text(
                code!,
                style: body(12, color: Colors.white70, weight: FontWeight.w800).copyWith(letterSpacing: 1.2),
              ),
            ),
        ],
      ),
    );
  }
}

/// The dark lecture card: code and glyph, the title in white, the thumbnail
/// with a round play button.
class LectureCard extends StatelessWidget {
  const LectureCard({
    super.key,
    required this.title,
    this.code,
    this.minutes,
    this.videoId,
    required this.mark,
    required this.onTap,
    this.span,
  });
  final String title;
  final String? code;
  final Object? minutes;
  final String? videoId;
  final LessonMark mark;
  final VoidCallback onTap;
  final String? span;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: 14.h),
      child: Semantics(
        identifier: 'lecture',
        child: Material(
          color: Tokens.card,
          borderRadius: BorderRadius.circular(Tokens.cardRadius),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: Padding(
              padding: EdgeInsets.all(14.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      LessonGlyph(mark, size: 20, onDark: true),
                      SizedBox(width: 8.w),
                      Expanded(
                        child: Text(
                          [code, span].whereType<String>().join('  ·  '),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: body(11.5, color: Tokens.onMidnight2, weight: FontWeight.w700).copyWith(letterSpacing: 0.8),
                        ),
                      ),
                      if (minutes != null)
                        Text(
                          '${minutes}m',
                          style: body(12, color: Tokens.onMidnight2, weight: FontWeight.w600),
                        ),
                    ],
                  ),
                  SizedBox(height: 8.h),
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: body(16, color: Colors.white, weight: FontWeight.w700, height: 1.3),
                  ),
                  SizedBox(height: 12.h),
                  AspectRatio(
                    aspectRatio: 16 / 9,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(Tokens.radius),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          VideoThumb(videoId: videoId, code: code),
                          Positioned(
                            right: 10,
                            bottom: 10,
                            child: Container(
                              width: 48,
                              height: 48,
                              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                              child: const Icon(Icons.play_arrow_rounded, color: Tokens.ink, size: 28, semanticLabel: 'play'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// A persistent badge on the canvas (§5, Rhythm): raised midnight, a gold hairline and a gold icon.
class RhythmBadge extends StatelessWidget {
  const RhythmBadge({super.key, required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 36,
      padding: EdgeInsets.symmetric(horizontal: 12.w),
      decoration: BoxDecoration(
        color: Tokens.badge,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Tokens.gold.withValues(alpha: 0.55)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 17, color: Tokens.gold),
          SizedBox(width: 6.w),
          Text(
            label,
            style: body(13, color: Colors.white, weight: FontWeight.w800),
          ),
        ],
      ),
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
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18, color: Tokens.onMidnight2),
          SizedBox(width: 5.w),
          Text(
            value,
            style: body(15, color: Tokens.onMidnight, weight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

/// A big number over its total, on the canvas (Playfair numerals).
class BigCount extends StatelessWidget {
  const BigCount({super.key, required this.value, required this.total, this.valueKey, this.icon, this.semantic});
  final String value;
  final String total;
  final Key? valueKey;
  final IconData? icon;
  final String? semantic;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.baseline,
      textBaseline: TextBaseline.alphabetic,
      children: [
        if (icon != null) ...[Icon(icon, size: 28, color: Tokens.gold, semanticLabel: semantic), SizedBox(width: 8.w)],
        Text(value, key: valueKey, style: display(46)),
        SizedBox(width: 6.w),
        Text(
          '/ $total',
          style: body(15, color: Tokens.onMidnight2, weight: FontWeight.w600),
        ),
      ],
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
        valueColor: const AlwaysStoppedAnimation(Tokens.accent),
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
      padding: EdgeInsets.only(top: 14.h, bottom: 10.h),
      child: Row(
        children: [
          Icon(icon, size: 18, color: Tokens.quiet),
          SizedBox(width: 8.w),
          Expanded(
            child: Text(
              text,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: body(14, color: Tokens.ink, weight: FontWeight.w800),
            ),
          ),
        ],
      ),
    );
  }
}

/// The modal list sheet with a drag handle (the reference's "In this reel").
Future<void> showListSheet(BuildContext context, {required String title, required List<Widget> rows}) {
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Tokens.sheet,
    showDragHandle: true,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(borderRadius: Tokens.sheetBorderRadius),
    builder: (_) => DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.62,
      maxChildSize: 0.92,
      builder: (_, scroll) => ListView(
        controller: scroll,
        physics: const BouncingScrollPhysics(),
        padding: EdgeInsets.fromLTRB(20.w, 0, 20.w, 28.h),
        children: [
          Text(
            title,
            textAlign: TextAlign.center,
            style: body(16, weight: FontWeight.w700),
          ),
          SizedBox(height: 16.h),
          ...rows,
        ],
      ),
    ),
  );
}
