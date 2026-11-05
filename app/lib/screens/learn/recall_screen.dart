// Recall (V.recall): the lectures you have proven come back on a widening schedule.
// Each due one is a card: say it out loud, then judge it honestly. Forgot resets
// the interval, Shaky holds it, Solid moves it out. The grading is the web app's
// (S.review, one `recall` event on the chain); this is its face.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/learn.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../lesson/lesson_screen.dart';

class RecallScreen extends StatelessWidget {
  const RecallScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final r = m.engine.recallData();
    final header = BigCount(
      icon: Icons.psychology_alt_outlined,
      semantic: 'due now',
      value: '${r.dueN}',
      total: '${r.scheduled}',
      valueKey: const ValueKey('recall-count'),
    );
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          if (r.due.isEmpty)
            Padding(
              padding: EdgeInsets.symmetric(vertical: 24.h),
              child: const Center(child: Icon(Icons.event_available, key: ValueKey('recall-empty'), size: 48, color: Tokens.quiet, semanticLabel: 'nothing due')),
            ),
          for (final it in r.due) _RecallCard(it, m),
          if (r.next.isNotEmpty) ...[
            SheetLabel(Icons.schedule, '${r.next.length}'),
            for (final it in r.next)
              ItemBlock(
                key: ValueKey('recall-next-${it.k}'),
                leading: const LeadTile(icon: Icons.schedule),
                subtitle: it.label.code,
                title: it.label.title,
                meta: it.due.substring(5),
              ),
          ],
        ],
      ),
    );
  }
}

class _RecallCard extends StatelessWidget {
  const _RecallCard(this.it, this.m);
  final RecallItem it;
  final AppModel m;

  @override
  Widget build(BuildContext context) {
    final L = it.label;
    return Container(
      key: ValueKey('recall-card-${it.k}'),
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.fromLTRB(14.w, 10.h, 6.w, 12.h),
      decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(L.code, style: body(11.5, color: Tokens.ink2, weight: FontWeight.w700).copyWith(letterSpacing: 0.8)),
                    SizedBox(height: 2.h),
                    Text(L.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: body(14.5, weight: FontWeight.w700, height: 1.3)),
                  ],
                ),
              ),
              SizedBox(width: 6.w),
              Semantics(
                label: it.pill,
                excludeSemantics: true,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 9.w, vertical: 5.h),
                  decoration: BoxDecoration(color: it.crimson ? const Color(0xFFFBE6E7) : Colors.white, borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.update, size: 14, color: it.crimson ? Tokens.missed : Tokens.ink2),
                      SizedBox(width: 4.w),
                      Text('${BOXES[it.box.clamp(0, BOXES.length - 1)]}d', style: body(12, color: it.crimson ? Tokens.missed : Tokens.ink2, weight: FontWeight.w800)),
                      if (it.lapses > 0) ...[
                        SizedBox(width: 6.w),
                        Icon(Icons.replay, size: 13, color: it.crimson ? Tokens.missed : Tokens.ink2),
                        Text('${it.lapses}', style: body(12, color: it.crimson ? Tokens.missed : Tokens.ink2, weight: FontWeight.w800)),
                      ],
                    ],
                  ),
                ),
              ),
              Semantics(
                identifier: 'recall-open-${it.k}',
                child: IconButton(
                  key: ValueKey('recall-open-${it.k}'),
                  tooltip: 'Open lecture',
                  constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                  onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => LessonScreen(cid: L.cid, ui: L.ui, li: L.li))),
                  icon: const Icon(Icons.play_circle_outline, color: Tokens.accent),
                ),
              ),
            ],
          ),
          SizedBox(height: 6.h),
          Padding(
            padding: EdgeInsets.only(right: 8.w),
            child: Row(
              children: [
                _Grade(it.k, 'forgot', Icons.close_rounded, 'Forgot', Colors.white, Tokens.missed, m),
                SizedBox(width: 8.w),
                _Grade(it.k, 'shaky', Icons.remove_rounded, 'Shaky', Colors.white, Tokens.half, m),
                SizedBox(width: 8.w),
                _Grade(it.k, 'solid', Icons.check_rounded, 'Solid', Tokens.accent, Colors.white, m),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Grade extends StatelessWidget {
  const _Grade(this.k, this.grade, this.icon, this.label, this.bg, this.fg, this.m);
  final String k, grade, label;
  final IconData icon;
  final Color bg, fg;
  final AppModel m;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Semantics(
        identifier: 'recall-$grade-$k',
        label: label,
        button: true,
        excludeSemantics: true,
        child: Material(
          key: ValueKey('recall-$grade-$k'),
          color: bg,
          borderRadius: BorderRadius.circular(14),
          child: InkWell(
            borderRadius: BorderRadius.circular(14),
            onTap: () => m.recall(k, grade),
            child: SizedBox(
              height: 52,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon, size: 22, color: fg),
                  Text(label, style: body(11, color: bg == Colors.white ? Tokens.ink2 : Colors.white, weight: FontWeight.w700)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
