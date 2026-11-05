// Record (V.record's numbers and chain): the streak and the longest, the days
// sealed, the heatmap of the last 26 weeks, the newest seals drawn as the
// links they are, the ledger and its integrity check. The reset keeps its
// confirmation. Everything that proves the record to a third party (head
// hash, export, anchors, the file check) is the Proof page.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/dates.dart';
import '../../engine/engine.dart';
import '../../engine/record.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import '../calendar/day_sheet.dart';
import 'proof_screen.dart';

void openRecord(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const RecordScreen()));

class RecordScreen extends StatelessWidget {
  const RecordScreen({super.key});

  static IconData iconFor(String type) => switch (type) {
    'lesson' => Icons.play_circle_outline,
    'quiz' => Icons.quiz_outlined,
    'exam' => Icons.assignment_outlined,
    'diagnostic' => Icons.speed,
    'lab' => Icons.science_outlined,
    'problem' => Icons.code,
    'day' => Icons.task_alt,
    'week' => Icons.verified_outlined,
    'streak' => Icons.restart_alt,
    'gate' => Icons.diamond_outlined,
    _ => Icons.link,
  };

  Future<void> _reset(BuildContext context, AppModel m) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: Colors.white,
        title: Text('Reset the streak to zero?', style: body(17, weight: FontWeight.w700)),
        content: Text(
          'The counter starts again from today. Every sealed day stays in the record: the heatmap, the day count and the chain are untouched.',
          style: body(14, color: Tokens.ink2, height: 1.4),
        ),
        actions: [
          TextButton(key: const ValueKey('reset-cancel'), onPressed: () => Navigator.pop(context, false), child: Text('Cancel', style: body(14, weight: FontWeight.w700))),
          TextButton(
            key: const ValueKey('reset-confirm'),
            onPressed: () => Navigator.pop(context, true),
            child: Text('Reset', style: body(14, color: Tokens.missed, weight: FontWeight.w700)),
          ),
        ],
      ),
    );
    if (ok == true) m.resetStreak();
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final today = e.todayISO();
    final rest = e.isRestDay(today) && ge(today, e.START_DATE);
    final proven = e.provenCount();
    final chain = e.verifyChain();
    final led = e.ledger;
    final seals = led.reversed.take(4).map((x) => (x as Map)).toList();

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BigCount(
          icon: Icons.local_fire_department,
          semantic: 'streak over best',
          value: '${e.streak()}',
          total: '${e.bestStreak()}',
          valueKey: const ValueKey('record-streak'),
        ),
        SizedBox(height: 10.h),
        Wrap(
          spacing: 22.w,
          runSpacing: 8.h,
          children: [
            Stat(icon: Icons.verified_outlined, value: '${e.studyDays.toSet().length}', semantic: 'days sealed'),
            Stat(icon: Icons.school_outlined, value: '$proven', semantic: 'lectures proven'),
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
          if (!rest && ge(today, e.START_DATE))
            e.sealedToday
                ? const ItemBlock(
                    key: ValueKey('record-sealed'),
                    leading: LeadTile(icon: Icons.check, color: Tokens.done, fg: Colors.white),
                    title: 'Sealed',
                  )
                : PillButton(key: const ValueKey('record-seal'), id: 'record-seal', label: 'Seal today', icon: Icons.task_alt, onPressed: () => m.sealDay()),
          const SheetLabel(Icons.grid_view_rounded, 'Sealed days'),
          Container(
            key: const ValueKey('record-heat'),
            padding: EdgeInsets.all(12.w),
            decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
            child: HeatmapGrid(e, onTap: (iso) => showDaySheet(context, iso)),
          ),
          const SheetLabel(Icons.link, 'Seals'),
          Row(
            key: const ValueKey('record-chain'),
            children: [
              Icon(
                led.isEmpty ? Icons.shield_outlined : chain.ok ? Icons.verified_user : Icons.gpp_bad,
                size: 22,
                color: led.isEmpty ? Tokens.quiet : chain.ok ? Tokens.done : Tokens.missed,
              ),
              SizedBox(width: 8.w),
              Text(
                '${led.length}',
                key: const ValueKey('record-count'),
                style: body(16, weight: FontWeight.w800, color: led.isEmpty || chain.ok ? Tokens.ink : Tokens.missed),
              ),
              if (led.isNotEmpty && !chain.ok) ...[
                SizedBox(width: 8.w),
                Flexible(
                  child: Text('broken at ${chain.brokenAt}', key: const ValueKey('record-broken'), style: body(14, color: Tokens.missed, weight: FontWeight.w700)),
                ),
              ],
            ],
          ),
          SizedBox(height: 10.h),
          if (seals.isEmpty)
            Padding(
              padding: EdgeInsets.symmetric(vertical: 14.h),
              child: const Icon(Icons.link, size: 40, color: Tokens.quiet, semanticLabel: 'the first lecture you prove starts the chain'),
            )
          else
            Wrap(
              spacing: 6.w,
              runSpacing: 8.h,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                for (var i = 0; i < seals.length; i++) ...[
                  if (i > 0) const Icon(Icons.arrow_back, size: 16, color: Tokens.quiet),
                  _Seal(name: e.sealName(seals[i]), hash: e.shortHash('${seals[i]['hash']}')),
                ],
                if (seals.last['i'] == 0) ...[
                  const Icon(Icons.arrow_back, size: 16, color: Tokens.quiet),
                  const _Seal(name: 'Genesis', hash: 'first link', gold: true),
                ],
              ],
            ),
          SizedBox(height: 14.h),
          Row(
            children: [
              Expanded(
                child: PillButton(key: const ValueKey('record-proof'), id: 'record-proof', label: 'Proof', icon: Icons.shield_outlined, tone: PillTone.dark, onPressed: () => openProof(context)),
              ),
              SizedBox(width: 10.w),
              Expanded(
                child: PillButton(key: const ValueKey('record-reset'), id: 'record-reset', label: 'Reset', icon: Icons.restart_alt, tone: PillTone.quiet, onPressed: () => _reset(context, m)),
              ),
            ],
          ),
          if (led.isNotEmpty) ...[
            const SheetLabel(Icons.receipt_long_outlined, 'Ledger'),
            for (final x in led.reversed.take(40))
              ItemBlock(
                key: ValueKey('ledger-${(x as Map)['i']}'),
                leading: LeadTile(icon: iconFor('${x['type']}')),
                title: e.eventLine(x),
                subtitle: '${'${x['ts']}'.substring(0, 10)} · ${e.shortHash('${x['hash']}')}',
                meta: '#${x['i']}',
              ),
          ],
        ],
      ),
    );
  }
}

class _Seal extends StatelessWidget {
  const _Seal({required this.name, required this.hash, this.gold = false});
  final String name, hash;
  final bool gold;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 8.h),
      decoration: BoxDecoration(
        color: gold ? Tokens.gold : Tokens.fieldFill,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(name, style: body(12.5, weight: FontWeight.w800, color: gold ? Tokens.espresso : Tokens.ink)),
          Text(hash, style: body(11, color: gold ? Tokens.espresso : Tokens.ink2, weight: FontWeight.w600)),
        ],
      ),
    );
  }
}

/// The last 26 weeks, a column per week (Sunday first), one square per day.
/// A dense date matrix like the calendar's: the squares are not 44 high.
class HeatmapGrid extends StatelessWidget {
  const HeatmapGrid(this.e, {super.key, this.onTap, this.weeks = 26});
  final Engine e;
  final void Function(String iso)? onTap;
  final int weeks;

  static const levels = [0.0, 0.3, 0.55, 0.8, 1.0];

  @override
  Widget build(BuildContext context) {
    final today = e.todayISO();
    final lastSunday = addDaysISO(today, -dowOf(today));
    final first = addDaysISO(lastSunday, -7 * (weeks - 1));
    return LayoutBuilder(
      builder: (context, c) {
        const gap = 2.0;
        final cell = (c.maxWidth - gap * (weeks - 1)) / weeks;
        return Row(
          children: [
            for (var wk = 0; wk < weeks; wk++) ...[
              if (wk > 0) const SizedBox(width: gap),
              Column(
                children: [
                  for (var d = 0; d < 7; d++) ...[
                    if (d > 0) const SizedBox(height: gap),
                    () {
                      final iso = addDaysISO(first, 7 * wk + d), lvl = e.heatLevel(iso);
                      final color = lvl == -1
                          ? Colors.transparent
                          : lvl == -2
                          ? Colors.white
                          : Color.lerp(Tokens.track, Tokens.accent, levels[lvl])!;
                      return Semantics(
                        identifier: lvl >= 0 ? 'heat-$iso-$lvl' : null,
                        child: GestureDetector(
                          behavior: HitTestBehavior.opaque,
                          onTap: lvl == -1 || onTap == null ? null : () => onTap!(iso),
                          child: Container(
                            width: cell,
                            height: cell,
                            decoration: BoxDecoration(
                              color: color,
                              borderRadius: BorderRadius.circular(2.5),
                              border: iso == today ? Border.all(color: Tokens.ink, width: 1.2) : null,
                            ),
                          ),
                        ),
                      );
                    }(),
                  ],
                ],
              ),
            ],
          ],
        );
      },
    );
  }
}
