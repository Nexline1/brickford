// Home: a greeting with the plan day under it, Monk's day as a persistent
// badge, a chip row over today's courses, the one next action, and today's
// lectures as dark cards with a glyph each. Numbers, glyphs and the lecture
// titles; nothing else to read.
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
import '../calendar/calendar_screen.dart';
import '../learn/recall_screen.dart';
import '../lesson/lesson_screen.dart';
import '../monk/monk_screen.dart';
import '../monk/monk_start.dart';
import '../practice/practice_screen.dart';
import '../quiz/quiz_screen.dart';
import '../week/week_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  static IconData trackIcon(String track) => switch (track) {
    'Theory' => Icons.functions,
    'Build' => Icons.construction,
    'Publish' => Icons.record_voice_over_outlined,
    _ => Icons.circle_outlined,
  };

  static String greeting(int hour) => hour < 5
      ? 'Good evening'
      : hour < 12
      ? 'Good morning'
      : hour < 18
      ? 'Good afternoon'
      : 'Good evening';

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  /// The chip row's filter: null is All, otherwise a course code.
  String? only;

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
    final reviewsN = e.reviewsDue().length;
    void openRecall() => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const RecallScreen()));
    final codes = <String>{for (final it in real) ?it.code}.toList();
    if (only != null && !codes.contains(only)) only = null;

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(HomeScreen.greeting(DateTime.now().hour), style: display(30)),
        SizedBox(height: 8.h),
        Row(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  'Day ',
                  style: body(16, color: Tokens.onMidnight2, weight: FontWeight.w500),
                ),
                Text(
                  '$dayN',
                  key: const ValueKey('home-day'),
                  style: body(16, color: Tokens.onMidnight, weight: FontWeight.w800),
                ),
                Text(
                  ' / $total',
                  style: body(16, color: Tokens.onMidnight2, weight: FontWeight.w500),
                ),
              ],
            ),
            SizedBox(width: 12.w),
            FrostButton(
              key: const ValueKey('home-calendar'),
              id: 'home-calendar',
              icon: Icons.calendar_month_outlined,
              tooltip: 'Calendar',
              dark: true,
              onPressed: () => openCalendar(context),
            ),
          ],
        ),
        SizedBox(height: 14.h),
        Wrap(
          spacing: 18.w,
          runSpacing: 6.h,
          children: [
            Stat(icon: Icons.local_fire_department_outlined, value: '${e.streak()}', semantic: 'streak'),
            Stat(icon: Icons.task_alt, value: '$doneN/${real.length}', semantic: 'cleared today'),
            if (owed > 0) Stat(icon: Icons.history, value: owed > 20 ? '20+' : '$owed', semantic: 'owed'),
            if (rest) const Stat(icon: Icons.bedtime_outlined, value: '', semantic: 'rest day'),
          ],
        ),
      ],
    );

    void open(String cid, int ui, int li) => Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => LessonScreen(cid: cid, ui: ui, li: li),
      ),
    );

    final (IconData icon, String label) = switch (next.kind) {
      'lecture' => (next.workAhead ? Icons.fast_forward_rounded : Icons.play_arrow_rounded, 'Play'),
      'quiz' => (next.seen ? Icons.quiz_outlined : Icons.lock_open_rounded, 'Quiz'),
      'resume' => (Icons.replay, 'Resume'),
      'recall' => (Icons.psychology_alt_outlined, 'Recall'),
      'rest' => (Icons.bedtime_outlined, 'Rest'),
      _ => (Icons.check, 'Done'),
    };

    final shown = [
      for (final it in items)
        if (only == null || (!it.pseudo && it.code == only)) it,
    ];

    return SheetScaffold(
      tabbed: true,
      // T-065: until the owner starts Monk Mode the badge is the one Start button (it opens the sheet); after
      // day 21 there is nothing here (the Monk chip still opens the screen, which reads "21 days done").
      trailing: e.monkFrom == null
          ? RhythmBadge(
              key: const ValueKey('home-monk-start'),
              id: 'home-monk-start',
              icon: Icons.self_improvement,
              label: 'Start Monk Mode',
              onTap: () => openMonkStart(context),
            )
          : monk != null
          ? RhythmBadge(
              key: const ValueKey('home-monk'),
              id: 'home-monk',
              icon: Icons.self_improvement,
              label: 'Day $monk / ${Engine.MONK.days}',
              onTap: () => openMonk(context),
            )
          : null,
      header: header,
      children: [
        ChipRow(
          children: [
            Semantics(
              identifier: 'chip-calendar',
              child: BrickChip(
                key: const ValueKey('chip-calendar'),
                label: 'Calendar',
                icon: Icons.calendar_month_outlined,
                selected: false,
                onTap: () => openCalendar(context),
              ),
            ),
            Semantics(
              identifier: 'chip-week',
              child: BrickChip(
                key: const ValueKey('chip-week'),
                label: 'Week',
                icon: Icons.verified_outlined,
                selected: false,
                onTap: () => openWeek(context),
              ),
            ),
            Semantics(
              identifier: 'chip-monk',
              child: BrickChip(
                key: const ValueKey('chip-monk'),
                label: 'Monk',
                icon: Icons.self_improvement,
                selected: false,
                onTap: () => openMonk(context),
              ),
            ),
            if (!rest && !e.sealedToday && ge(today, e.START_DATE))
              Semantics(
                identifier: 'chip-seal',
                child: BrickChip(
                  key: const ValueKey('chip-seal'),
                  label: 'Seal day',
                  icon: Icons.task_alt,
                  selected: false,
                  onTap: () => m.sealDay(),
                ),
              ),
            if (codes.length > 1) ...[
              BrickChip(key: const ValueKey('chip-all'), label: 'All', selected: only == null, onTap: () => setState(() => only = null)),
              for (final c in codes)
                BrickChip(key: ValueKey('chip-$c'), label: c, selected: only == c, onTap: () => setState(() => only = c)),
            ],
          ],
        ),
        SizedBox(height: 18.h),
        _NextUp(
          icon: icon,
          label: label,
          title: next.title,
          code: next.code,
          onPressed: next.kind == 'quiz' && next.seen && next.opensLesson
              ? () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => QuizScreen.lecture(lessonKey(next.cid!, next.ui!, next.li!))),
                )
              : next.opensLesson
              ? () => open(next.cid!, next.ui!, next.li!)
              : next.kind == 'recall'
              ? openRecall
              : null,
        ),
        SizedBox(height: 18.h),
        // The daily review (app.js: "Recall due"): only while something is due.
        if (reviewsN > 0) ...[
          _ReviewRow(n: reviewsN, onPressed: openRecall),
          SizedBox(height: 18.h),
        ],
        // The first rep owed (app.js: the dashboard's row to #/practice); repsDue is empty on a rest day.
        ?practiceRow(context, m),
        for (final it in shown)
          if (it.pseudo)
            ItemBlock(
              leading: LeadTile(icon: HomeScreen.trackIcon(it.track)),
              title: it.short ?? it.title,
              subtitle: it.track,
            )
          else
            LectureCard(
              key: ValueKey('home-lesson-${it.key}'),
              title: it.title,
              code: it.code,
              span: it.spanN != null && it.spanN! > 1 ? '${it.dayN}/${it.spanN}' : null,
              minutes: it.l?['min'],
              videoId: it.l?['v'] as String?,
              mark: m.markOf(it.key),
              onTap: () => open(it.cid!, it.ui!, it.li!),
            ),
        if (items.isEmpty)
          Padding(
            padding: EdgeInsets.symmetric(vertical: 32.h),
            child: Icon(
              rest ? Icons.bedtime_outlined : Icons.event_available,
              size: 48,
              color: Tokens.quiet,
              semanticLabel: rest ? 'rest day' : 'nothing scheduled',
            ),
          ),
      ],
    );
  }
}

/// The next-up card: a soft accent-washed gradient, the one action's title,
/// and the primary pill.
class _NextUp extends StatelessWidget {
  const _NextUp({required this.icon, required this.label, required this.title, required this.code, this.onPressed});
  final IconData icon;
  final String label, title, code;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('home-nextup'),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(Tokens.cardRadius),
        gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Colors.white, Tokens.accentWash]),
        border: Border.all(color: Tokens.hairline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              LeadTile(icon: icon, color: Tokens.accent, fg: Colors.white),
              SizedBox(width: 12.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (code.isNotEmpty)
                      Text(
                        code,
                        style: body(11.5, color: Tokens.ink2, weight: FontWeight.w700).copyWith(letterSpacing: 0.8),
                      ),
                    Text(
                      title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: body(15.5, weight: FontWeight.w700, height: 1.3),
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 14.h),
          PillButton(key: const ValueKey('home-next'), icon: icon, label: label, onPressed: onPressed),
        ],
      ),
    );
  }
}

/// "N due" with its one button into Recall; the web dashboard's "Recall due" row.
class _ReviewRow extends StatelessWidget {
  const _ReviewRow({required this.n, required this.onPressed});
  final int n;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('home-review'),
      padding: EdgeInsets.fromLTRB(12.w, 10.h, 10.w, 10.h),
      decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
      child: Row(
        children: [
          const LeadTile(icon: Icons.psychology_alt_outlined),
          SizedBox(width: 12.w),
          Expanded(
            child: Semantics(
              label: '$n lectures due for recall',
              excludeSemantics: true,
              child: Text.rich(
                TextSpan(
                  children: [
                    TextSpan(text: '$n', style: body(20, weight: FontWeight.w800)),
                    TextSpan(text: ' due', style: body(14.5, color: Tokens.ink2, weight: FontWeight.w600)),
                  ],
                ),
              ),
            ),
          ),
          PillButton(key: const ValueKey('home-review-go'), id: 'home-review-go', label: 'Recall', icon: Icons.arrow_forward_rounded, expand: false, onPressed: onPressed),
        ],
      ),
    );
  }
}
