// Home: the day number, Monk's day as a badge, the one next action, and
// today's lectures with a glyph each. Numbers and glyphs; the only words are
// lecture titles.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import '../lesson/lesson_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static IconData trackIcon(String track) => switch (track) {
        'Theory' => Icons.functions,
        'Build' => Icons.construction,
        'Publish' => Icons.record_voice_over_outlined,
        _ => Icons.circle_outlined,
      };

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final today = e.todayISO();
    final idx = e.studyToday();
    final rest = e.isRestDay(today) && today.compareTo(e.START_DATE) >= 0;
    // On a rest day the page number is the day just worked (weekNumber's rule).
    final dayN = idx >= 0 ? idx + 1 : (today.compareTo(e.START_DATE) < 0 ? 0 : e.studyAnchor() + 1);
    final total = e.studyIndex(e.dateForStudy(1093)) + 1;
    final monk = e.monkDay(today);
    final items = e.scheduledFor(today);
    final real = items.where((it) => !it.pseudo).toList();
    final doneN = real.where(e.schedDone).length;
    final owed = e.backlogCount();
    final next = e.nextAction();

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text('$dayN', key: const ValueKey('home-day'), style: display(54)),
            SizedBox(width: 6.w),
            Padding(
              padding: EdgeInsets.only(bottom: 9.h),
              child: Text('/ $total', style: body(15, color: Tokens.onMidnight2, weight: FontWeight.w600)),
            ),
            const Spacer(),
            if (monk != null)
              Padding(
                padding: EdgeInsets.only(bottom: 8.h),
                child: RhythmBadge(
                    key: const ValueKey('home-monk'), icon: Icons.self_improvement, label: 'Day $monk / ${Engine.MONK.days}'),
              ),
          ],
        ),
        SizedBox(height: 10.h),
        Wrap(spacing: 18.w, runSpacing: 6.h, children: [
          Stat(icon: Icons.local_fire_department_outlined, value: '${e.streak()}', semantic: 'streak'),
          Stat(icon: Icons.task_alt, value: '$doneN/${real.length}', semantic: 'cleared today'),
          if (owed > 0) Stat(icon: Icons.history, value: owed > 20 ? '20+' : '$owed', semantic: 'owed'),
          if (rest) const Stat(icon: Icons.bedtime_outlined, value: '', semantic: 'rest day'),
        ]),
      ],
    );

    void open(String cid, int ui, int li) =>
        Navigator.of(context).push(MaterialPageRoute(builder: (_) => LessonScreen(cid: cid, ui: ui, li: li)));

    final (IconData icon, String label) = switch (next.kind) {
      'lecture' => (next.workAhead ? Icons.fast_forward_rounded : Icons.play_arrow_rounded, next.title),
      'quiz' => (next.seen ? Icons.quiz_outlined : Icons.lock_open_rounded, next.title),
      'resume' => (Icons.replay, next.title),
      'recall' => (Icons.psychology_alt_outlined, next.title),
      'rest' => (Icons.bedtime_outlined, 'Rest'),
      _ => (Icons.check, '—'),
    };

    return SheetScaffold(
      header: header,
      children: [
        PillButton(
          key: const ValueKey('home-next'),
          icon: icon,
          label: label,
          onPressed: next.opensLesson ? () => open(next.cid!, next.ui!, next.li!) : null,
        ),
        SizedBox(height: 18.h),
        for (final it in items)
          if (it.pseudo)
            ItemBlock(leading: Icon(trackIcon(it.track), color: Tokens.quiet), title: it.short ?? '', subtitle: it.track)
          else
            ItemBlock(
              key: ValueKey('home-lesson-${it.key}'),
              leading: LessonGlyph(m.markOf(it.key)),
              subtitle: '${it.code ?? ''}${it.spanN != null && it.spanN! > 1 ? '  ·  ${it.dayN}/${it.spanN}' : ''}',
              title: it.title,
              meta: it.l?['min'] != null ? "${it.l!['min']}m" : null,
              onTap: () => open(it.cid!, it.ui!, it.li!),
            ),
        if (items.isEmpty)
          Padding(
            padding: EdgeInsets.symmetric(vertical: 32.h),
            child: Icon(rest ? Icons.bedtime_outlined : Icons.event_available, size: 48, color: Tokens.quiet,
                semanticLabel: rest ? 'rest day' : 'nothing scheduled'),
          ),
      ],
    );
  }
}
