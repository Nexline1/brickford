// Transcript (V.transcript): the seal (overall mastery and its standing), the gate
// you are at with the one control the page exists for, the five gates, and every
// course's mastery. Passing or unmarking a gate goes through a confirm sheet
// (gateSheet), never a toggle; the order guard is the engine's (setGate).
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/learn.dart' show capFirst;
import '../../engine/pages.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/record_widgets.dart';
import '../../widgets/sheet_scaffold.dart';

void openTranscript(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const TranscriptScreen()));

class TranscriptScreen extends StatelessWidget {
  const TranscriptScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final t = m.engine.transcript(), nx = t.next, lp = t.lastPassed;
    final header = Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text('${t.overall}%', key: const ValueKey('transcript-overall'), style: display(46)),
        SizedBox(width: 14.w),
        Flexible(child: RhythmBadge(icon: Icons.workspace_premium_outlined, label: t.standing + (t.grade != '—' ? ' · ${t.grade}' : ''))),
      ],
    );
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          if (nx != null)
            _GateCard(gate: nx, onPass: () => _gateSheet(context, nx, true))
          else
            const ItemBlock(key: ValueKey('transcript-clear'), leading: LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white), title: 'All gates passed'),
          SizedBox(height: 14.h),
          Row(
            children: [
              Expanded(child: StatTile(icon: Icons.flag_outlined, label: 'Gates', value: '${t.gates.where((g) => g.doneDate != null).length}/${t.gates.length}')),
              SizedBox(width: 10.w),
              Expanded(child: StatTile(icon: Icons.school_outlined, label: 'Courses', value: '${t.counted}')),
              if (t.mastered > 0) ...[SizedBox(width: 10.w), Expanded(child: StatTile(icon: Icons.workspace_premium_outlined, label: 'Mastered', value: '${t.mastered}'))],
            ],
          ),
          SheetLabel(Icons.flag_outlined, 'The five gates'),
          for (final g in t.gates)
            ItemBlock(
              key: ValueKey('gate-${g.n}'),
              id: 'gate-${g.n}',
              leading: g.doneDate != null ? const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white) : LeadTile(text: '${g.n}'),
              title: 'Gate ${g.n} — ${g.label}',
              subtitle: g.req,
              meta: g.doneDate ?? (g.left >= 0 ? '${g.left}d' : '${-g.left}d over'),
              onTap: g.n == nx?.n
                  ? () => _gateSheet(context, g, true)
                  : g.n == lp?.n
                  ? () => _gateSheet(context, g, false)
                  : null,
            ),
          SheetLabel(Icons.school_outlined, 'Mastery, course by course'),
          for (final r in t.rows)
            ItemBlock(
              key: ValueKey('mastery-${r.code}'),
              leading: LeadTile(text: '${r.mastery}%'),
              subtitle: r.code,
              title: r.title,
              meta: [if (r.best != null) 'best ${r.best}%', r.standing].join(' · '),
              below: ProgressBar(r.mastery / 100),
            ),
        ],
      ),
    );
  }
}

class _GateCard extends StatelessWidget {
  const _GateCard({required this.gate, required this.onPass});
  final GateLine gate;
  final VoidCallback onPass;

  @override
  Widget build(BuildContext context) {
    final over = gate.left < 0;
    return Container(
      key: const ValueKey('transcript-next'),
      padding: EdgeInsets.all(18.w),
      decoration: BoxDecoration(color: Tokens.card, borderRadius: BorderRadius.circular(Tokens.cardRadius)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text('Gate ${gate.n} — ${gate.label}', style: body(16, color: Colors.white, weight: FontWeight.w800))),
              Text('${gate.left < 0 ? 0 : gate.left}d', style: body(15, color: over ? Tokens.gold : Tokens.goldHi, weight: FontWeight.w800)),
            ],
          ),
          SizedBox(height: 6.h),
          Text(gate.req, style: body(13, color: Tokens.onMidnight2, height: 1.4)),
          SizedBox(height: 14.h),
          PillButton(key: const ValueKey('gate-pass'), id: 'gate-pass', label: 'Mark passed', icon: Icons.verified_outlined, onPressed: onPass),
        ],
      ),
    );
  }
}

/// gateSheet: tick each requirement that is true today, then Pass; unmarking just confirms.
Future<void> _gateSheet(BuildContext context, GateLine g, bool pass) {
  final m = AppScope.of(context);
  final reqs = g.req.split(' · ').map(capFirst).toList();
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Tokens.sheet,
    showDragHandle: true,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(borderRadius: Tokens.sheetBorderRadius),
    builder: (sheet) {
      final ticks = List<bool>.filled(reqs.length, false);
      return StatefulBuilder(
        builder: (c, set) {
          final ready = !pass || ticks.every((x) => x);
          return Padding(
            padding: EdgeInsets.fromLTRB(20.w, 0, 20.w, 24.h + MediaQuery.viewInsetsOf(c).bottom),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${pass ? 'Pass' : 'Unmark'} Gate ${g.n} — ${g.label}', style: body(17, weight: FontWeight.w800)),
                SizedBox(height: 6.h),
                Text(
                  pass ? 'Tick each requirement that is true today. Every later target will count from today.' : 'Gate ${g.n} goes back to open, and every later target counts from its target again.',
                  style: body(13.5, color: Tokens.ink2, height: 1.4),
                ),
                SizedBox(height: 12.h),
                if (pass)
                  for (var i = 0; i < reqs.length; i++)
                    InkWell(
                      key: ValueKey('gate-req-$i'),
                      onTap: () => set(() => ticks[i] = !ticks[i]),
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(minHeight: 48),
                        child: Row(
                          children: [
                            Icon(ticks[i] ? Icons.check_box_rounded : Icons.check_box_outline_blank_rounded, color: ticks[i] ? Tokens.accent : Tokens.quiet),
                            SizedBox(width: 12.w),
                            Expanded(child: Text(reqs[i], style: body(14.5, weight: FontWeight.w600))),
                          ],
                        ),
                      ),
                    ),
                SizedBox(height: 14.h),
                Row(
                  children: [
                    Expanded(child: PillButton(key: const ValueKey('gate-cancel'), label: 'Cancel', tone: PillTone.quiet, onPressed: () => Navigator.pop(c))),
                    SizedBox(width: 10.w),
                    Expanded(
                      child: PillButton(
                        key: const ValueKey('gate-go'),
                        id: 'gate-go',
                        label: pass ? 'Pass' : 'Unmark',
                        onPressed: ready
                            ? () {
                                Navigator.pop(c);
                                final ok = m.setGate(g.n, pass);
                                toast(
                                  context,
                                  !ok
                                      ? (pass ? 'Only the next gate can be passed.' : 'Only the last gate passed can be unmarked.')
                                      : pass
                                      ? 'Gate ${g.n} passed — every later target now counts from today.'
                                      : 'Gate ${g.n} is open again.',
                                );
                              }
                            : null,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      );
    },
  );
}
