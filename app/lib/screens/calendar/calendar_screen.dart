// The calendar: a Sunday-first month on the white sheet, one mark per day
// from the engine's dayStatus (tick, half ring, red ring, grey ring, moon),
// a diamond on an open gate's target date, the month's counts and the round
// month buttons on the canvas, and this revision week's seal tile under the
// grid. Tapping a day opens its day sheet.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/dates.dart';
import '../../engine/engine.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/day_glyph.dart';
import '../../widgets/sheet_scaffold.dart';
import 'day_sheet.dart';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

String _mon(String iso) => monthNames[int.parse(iso.substring(5, 7)) - 1].substring(0, 3);
int _dayOf(String iso) => int.parse(iso.substring(8, 10));

/// "1–6 Nov", or "26 Oct–1 Nov" across a month (app.js shortRange).
String shortRange(String a, String b) =>
    '${a.substring(0, 7) == b.substring(0, 7) ? '${_dayOf(a)}' : '${_dayOf(a)} ${_mon(a)}'}–${_dayOf(b)} ${_mon(b)}';

/// "Sun 8 Nov".
String shortDay(String iso) => '${weekdayNames[dowOf(iso)].substring(0, 3)} ${_dayOf(iso)} ${_mon(iso)}';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key, this.month});

  /// "YYYY-MM" to open on; the default is today's month.
  final String? month;

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  String? cursor;

  static String _shift(String ym, int by) {
    final y = int.parse(ym.substring(0, 4)), m = int.parse(ym.substring(5, 7)) - 1 + by;
    final yy = y + (m / 12).floor(), mm = m % 12 + 1;
    return '$yy-${mm.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final today = e.todayISO();
    final ym = cursor ??= widget.month ?? today.substring(0, 7);
    final y = int.parse(ym.substring(0, 4)), mo = int.parse(ym.substring(5, 7));
    final first = '$ym-01';
    final pad = dowOf(first);
    final days = DateTime.utc(y, mo + 1, 0).day;
    final gates = {
      for (final g in e.gatePlan())
        if (g.doneDate == null) g.target: g,
    };

    final cells = <Widget>[for (var i = 0; i < pad; i++) const SizedBox.shrink()];
    final counts = <DayMark, int>{};
    for (var d = 1; d <= days; d++) {
      final iso = '$ym-${d.toString().padLeft(2, '0')}';
      final before = lt(iso, e.START_DATE);
      final mark = markForStatus(before ? '' : e.dayStatus(iso), beforeStart: before);
      counts[mark] = (counts[mark] ?? 0) + 1;
      cells.add(
        DayCell(
          key: ValueKey('cal-$iso'),
          iso: iso,
          mark: mark,
          today: iso == today,
          gate: gates.containsKey(iso),
          onTap: before ? null : () => showDaySheet(context, iso),
        ),
      );
    }

    final r = e.revisionWeekOf(lt(today, e.START_DATE) ? e.START_DATE : today);
    final rw = e.revisionWeek(r);
    final sealed = e.sealedWeek(r) != null;

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Flexible(
              child: Text(
                monthNames[mo - 1],
                key: const ValueKey('cal-month'),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: display(30),
              ),
            ),
            SizedBox(width: 10.w),
            Text(
              '$y',
              style: body(16, color: Tokens.onMidnight2, weight: FontWeight.w600),
            ),
          ],
        ),
        SizedBox(height: 14.h),
        Row(
          children: [
            Expanded(
              child: Wrap(
                spacing: 14.w,
                runSpacing: 6.h,
                children: [
                  for (final k in const [DayMark.done, DayMark.part, DayMark.missed])
                    if ((counts[k] ?? 0) > 0) _Count(mark: k, n: counts[k]!),
                ],
              ),
            ),
            FrostButton(
              key: const ValueKey('cal-prev'),
              id: 'cal-prev',
              icon: Icons.chevron_left_rounded,
              tooltip: 'Previous month',
              dark: true,
              onPressed: () => setState(() => cursor = _shift(ym, -1)),
            ),
            SizedBox(width: 8.w),
            _FrostPill(
              key: const ValueKey('cal-today'),
              label: 'Today',
              selected: ym == today.substring(0, 7),
              onTap: () => setState(() => cursor = today.substring(0, 7)),
            ),
            SizedBox(width: 8.w),
            FrostButton(
              key: const ValueKey('cal-next'),
              id: 'cal-next',
              icon: Icons.chevron_right_rounded,
              tooltip: 'Next month',
              dark: true,
              onPressed: () => setState(() => cursor = _shift(ym, 1)),
            ),
          ],
        ),
      ],
    );

    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          Row(
            children: [
              for (var i = 0; i < 7; i++)
                Expanded(
                  child: Text(
                    const ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i],
                    textAlign: TextAlign.center,
                    style: body(12, color: i == Engine.REST_DOW ? Tokens.quiet : Tokens.ink2, weight: FontWeight.w700),
                  ),
                ),
            ],
          ),
          SizedBox(height: 6.h),
          GridView.count(
            key: const ValueKey('cal-grid'),
            crossAxisCount: 7,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: EdgeInsets.zero,
            childAspectRatio: 0.82,
            children: cells,
          ),
          SizedBox(height: 18.h),
          if (ge(rw.sun, e.START_DATE))
            SealTile(
              key: const ValueKey('cal-seal'),
              week: r,
              range: shortRange(rw.from, rw.to),
              sunday: rw.sun,
              sealed: sealed,
              onTap: () => showDaySheet(context, rw.sun),
            ),
        ],
      ),
    );
  }
}

/// One day of the month: its mark over its number; today's number on an accent disc.
class DayCell extends StatelessWidget {
  const DayCell({super.key, required this.iso, required this.mark, required this.today, required this.gate, this.onTap});
  final String iso;
  final DayMark mark;
  final bool today, gate;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final n = _dayOf(iso);
    final faded = mark == DayMark.none || mark == DayMark.rest;
    return Semantics(
      identifier: 'cal-$iso',
      button: onTap != null,
      label: '$iso ${DayGlyph.nameOf(mark)}${gate ? ' gate' : ''}${today ? ' today' : ''}',
      excludeSemantics: true,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: onTap,
          child: ConstrainedBox(
            constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                DayGlyph(mark, size: 24, gate: gate),
                const SizedBox(height: 4),
                Container(
                  width: 24,
                  height: 20,
                  alignment: Alignment.center,
                  decoration: today ? BoxDecoration(color: Tokens.accent, borderRadius: BorderRadius.circular(10)) : null,
                  child: Text(
                    '$n',
                    maxLines: 1,
                    style: body(
                      12.5,
                      color: today ? Colors.white : (faded ? Tokens.quiet : Tokens.ink),
                      weight: today ? FontWeight.w800 : FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A mark and how many days of the month carry it (on the canvas).
class _Count extends StatelessWidget {
  const _Count({required this.mark, required this.n});
  final DayMark mark;
  final int n;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '${DayGlyph.nameOf(mark)} $n',
      excludeSemantics: true,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          DayGlyph(mark, size: 16),
          SizedBox(width: 5.w),
          Text(
            '$n',
            style: body(15, color: Tokens.onMidnight, weight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

/// A frosted pill on the canvas, 44 high (the month row's Today).
class _FrostPill extends StatelessWidget {
  const _FrostPill({super.key, required this.label, required this.selected, required this.onTap});
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      identifier: 'cal-today',
      button: true,
      selected: selected,
      label: label,
      excludeSemantics: true,
      child: Material(
        color: selected ? Colors.white : Colors.white.withValues(alpha: 0.16),
        shape: StadiumBorder(side: BorderSide(color: selected ? Colors.white : Colors.white24)),
        child: InkWell(
          customBorder: const StadiumBorder(),
          onTap: onTap,
          child: Container(
            height: 44,
            padding: EdgeInsets.symmetric(horizontal: 16.w),
            alignment: Alignment.center,
            child: Text(
              label,
              style: body(13.5, color: selected ? Tokens.ink : Colors.white, weight: FontWeight.w700),
            ),
          ),
        ),
      ),
    );
  }
}

/// The Sunday seal: revision week r, the study days it covers, its Sunday,
/// and a tick once it is sealed.
class SealTile extends StatelessWidget {
  const SealTile({super.key, required this.week, required this.range, required this.sunday, required this.sealed, this.onTap});
  final int week;
  final String range, sunday;
  final bool sealed;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      identifier: 'seal',
      child: ItemBlock(
        leading: LeadTile(
          icon: Icons.verified_outlined,
          color: sealed ? Tokens.gold : Colors.white,
          fg: sealed ? Tokens.espresso : Tokens.goldInk,
        ),
        title: 'Week $week',
        subtitle: range,
        meta: shortDay(sunday),
        onTap: onTap,
      ),
    );
  }
}

/// Opens the calendar on today's month.
void openCalendar(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const CalendarScreen()));

/// The lecture's short title: what comes before an em-dash gloss.
String shortTitle(String t) => t.split(' — ').first;
