// One day, as a bottom sheet with a drag handle: the weekday, the date and
// "Day N · Week W" over the day's own mark, then one row per scheduled item.
// A lecture's row carries its glyph (tick = cleared, half ring = watched with
// the quiz open, ring = not watched), its short title, its track and its
// minutes, and opens the lecture. A gate's target day and a seal Sunday get
// their tile; a rest day gets its moon.
//
// The rows are engine.scheduledFor(iso), unchanged. That is what keeps a past
// day frozen: scheduledFor windows against studyAnchor (T-063), so on a
// Saturday the past days keep their own lectures instead of being re-packed
// around the work done since. Nothing here re-derives the plan.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/dates.dart';
import '../../engine/engine.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/day_glyph.dart';
import '../home/home_screen.dart';
import '../lesson/lesson_screen.dart';
import 'calendar_screen.dart';

Future<void> showDaySheet(BuildContext context, String iso) {
  final nav = Navigator.of(context);
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Tokens.sheet,
    showDragHandle: true,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(borderRadius: Tokens.sheetBorderRadius),
    builder: (_) => DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.62,
      minChildSize: 0.3,
      maxChildSize: 0.92,
      builder: (_, scroll) => DaySheet(
        iso: iso,
        scroll: scroll,
        open: (it) => nav.push(
          MaterialPageRoute(
            builder: (_) => LessonScreen(cid: it.cid!, ui: it.ui!, li: it.li!),
          ),
        ),
      ),
    ),
  );
}

class DaySheet extends StatelessWidget {
  const DaySheet({super.key, required this.iso, this.scroll, required this.open});
  final String iso;
  final ScrollController? scroll;
  final void Function(SchedItem) open;

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final status = e.dayStatus(iso);
    final rest = status == 'rest';
    final mark = markForStatus(status, beforeStart: lt(iso, e.START_DATE));
    final day = e.studyIndex(iso) + 1;
    final week = e.weekOf(iso);
    final gate = e.gateOn(iso);
    final items = e.scheduledFor(iso);
    final real = items.where((it) => !it.pseudo).toList();
    final doneN = real.where(e.schedDone).length;
    final seal = e.isSealDay(iso) ? e.revisionWeek(e.revisionWeekOf(iso)) : null;

    final rows = <Widget>[
      for (final it in items)
        if (it.pseudo)
          ItemBlock(
            key: ValueKey('day-row-${it.key}'),
            leading: LeadTile(icon: HomeScreen.trackIcon(it.track)),
            title: it.short ?? it.title,
            subtitle: it.track,
          )
        else
          () {
            final lm = m.markOf(it.key);
            final min = it.l?['min'];
            final span = it.spanN != null && it.spanN! > 1 ? '${it.dayN}/${it.spanN}' : null;
            return Semantics(
              identifier: 'day-row',
              child: ItemBlock(
                key: ValueKey('day-row-${it.key}'),
                leading: SizedBox(
                  width: 44,
                  height: 44,
                  child: Center(child: DayGlyph(markForLesson(lm), key: ValueKey('day-glyph-${it.key}'), size: 26)),
                ),
                title: shortTitle(it.title),
                subtitle: [it.code, it.track, ?span].whereType<String>().join(' · '),
                meta: min != null ? '${min}m' : null,
                onTap: () => open(it),
              ),
            );
          }(),
    ];

    return ListView(
      key: const ValueKey('day-sheet'),
      controller: scroll,
      physics: const BouncingScrollPhysics(),
      padding: EdgeInsets.fromLTRB(20.w, 0, 20.w, 28.h),
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    weekdayNames[dowOf(iso)].toUpperCase(),
                    style: body(12, color: Tokens.ink2, weight: FontWeight.w700).copyWith(letterSpacing: 1.2),
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    '${int.parse(iso.substring(8, 10))} ${monthNames[int.parse(iso.substring(5, 7)) - 1]}',
                    key: const ValueKey('day-date'),
                    style: display(26, color: Tokens.ink),
                  ),
                  SizedBox(height: 6.h),
                  Row(
                    children: [
                      if (rest) ...[const DayGlyph(DayMark.rest, size: 16), SizedBox(width: 6.w)],
                      Text(
                        rest ? 'Week $week' : 'Day $day · Week $week',
                        key: const ValueKey('day-sub'),
                        style: body(13.5, color: Tokens.ink2, weight: FontWeight.w600),
                      ),
                      if (real.isNotEmpty) ...[
                        SizedBox(width: 10.w),
                        Text(
                          '$doneN/${real.length}',
                          style: body(13.5, color: Tokens.ink, weight: FontWeight.w800),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: EdgeInsets.only(top: 6.h),
              child: DayGlyph(mark, key: const ValueKey('day-mark'), size: 34, gate: gate != null),
            ),
          ],
        ),
        SizedBox(height: 18.h),
        if (gate != null)
          ItemBlock(
            key: const ValueKey('day-gate'),
            leading: const LeadTile(icon: Icons.diamond_outlined, color: Tokens.gold, fg: Tokens.espresso),
            title: 'Gate ${gate.n}',
            subtitle: gate.label,
          ),
        ...rows,
        if (seal != null)
          SealTile(
            key: const ValueKey('day-seal'),
            week: seal.r,
            range: shortRange(seal.from, seal.to),
            sunday: seal.sun,
            sealed: e.sealedWeek(seal.r) != null,
          ),
        if (items.isEmpty)
          Padding(
            padding: EdgeInsets.symmetric(vertical: 28.h),
            child: Center(child: DayGlyph(rest ? DayMark.rest : DayMark.none, size: 56)),
          ),
      ],
    );
  }
}
