// Market: Problems (what is due now), Exams, the NeetCode tracker, and the whole
// catalogue, behind a chip row. The data and the rules are the web app's
// (T-045 problemsDue, V.exams); this is their face: icons, counts, blocks.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../engine/problems.dart';
import '../../engine/quiz.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import '../quiz/quiz_screen.dart';
import 'diag_screen.dart';
import 'problem_sheets.dart';

enum _Tab { due, exams, code, all }

class MarketScreen extends StatefulWidget {
  const MarketScreen({super.key});
  @override
  State<MarketScreen> createState() => _MarketScreenState();
}

class _MarketScreenState extends State<MarketScreen> {
  _Tab tab = _Tab.due;

  void _push(Widget w) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => w));

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final P = e.problemsDue();
    final exams = e.examItems();
    final sat = exams.where((x) => x.sat).length;
    // The daily review is the Drill's (a later stage): it counts in problemsDue, not on this page.
    final rows = P.n - (P.review > 0 ? 1 : 0);

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BigCount(
          icon: Icons.assignment,
          semantic: 'due now',
          value: '$rows',
          total: '${rows + P.coming.length}',
          valueKey: const ValueKey('market-count'),
        ),
        SizedBox(height: 10.h),
        Wrap(
          spacing: 22.w,
          runSpacing: 8.h,
          children: [
            Stat(icon: Icons.school_outlined, value: '$sat/${exams.length}', semantic: 'exams sat'),
            Stat(icon: Icons.code, value: '${e.dsaCount()}/150', semantic: 'problems solved'),
          ],
        ),
      ],
    );

    final tabs = ChipRow(
      children: [
        for (final (t, icon, label) in [
          (_Tab.due, Icons.assignment_outlined, 'Due'),
          (_Tab.exams, Icons.school_outlined, 'Exams'),
          (_Tab.code, Icons.code, 'Code'),
          (_Tab.all, Icons.checklist_rounded, 'All'),
        ])
          Semantics(
            identifier: 'market-tab-${t.name}',
            child: BrickChip(
              key: ValueKey('market-tab-${t.name}'),
              icon: icon,
              label: label,
              selected: tab == t,
              onTap: () => setState(() => tab = t),
            ),
          ),
      ],
    );

    final List<Widget> list = switch (tab) {
      _Tab.due => _due(context, m, P, rows),
      _Tab.exams => _exams(m, exams),
      _Tab.code => _code(context, m),
      _Tab.all => _all(context, m),
    };
    return SheetScaffold(
      tabbed: true,
      header: header,
      children: [tabs, SizedBox(height: 16.h), ...list],
    );
  }

  // ---------- Due ----------

  Widget _quizRow(AppModel m, DueQuiz q, bool catchUp) {
    final e = m.engine;
    final n = m.data.summariesLoaded ? e.lessonQuiz(q.k)?.length : null;
    // Does passing it open the next lecture? (the lock the web row calls out)
    final flat = e.flatLessons(q.cid);
    final i = flat.indexWhere((f) => f.ui == q.ui && f.li == q.li);
    final nx = i >= 0 && i + 1 < flat.length ? flat[i + 1] : null;
    final locks = !catchUp && nx != null && e.lockedBy(nx.cid, nx.ui, nx.li) != null;
    return ItemBlock(
      id: 'due-${catchUp ? 'catchup' : 'quiz'}-${q.k}',
      leading: LeadTile(
        icon: catchUp ? Icons.history_rounded : Icons.quiz_outlined,
        color: catchUp ? Colors.white : Tokens.accent,
        fg: catchUp ? Tokens.ink : Colors.white,
      ),
      subtitle: q.code,
      title: q.title,
      meta: n != null ? '$n' : null,
      below: locks ? const Icon(Icons.lock_outline_rounded, size: 16, color: Tokens.half, semanticLabel: 'locks the next lecture') : null,
      onTap: () => _push(QuizScreen.lecture(q.k)),
    );
  }

  List<Widget> _due(BuildContext context, AppModel m, ProblemsDue P, int rows) {
    final e = m.engine;
    return [
      for (final q in P.quizzes) _quizRow(m, q, false),
      for (final q in P.catchUp) _quizRow(m, q, true),
      for (final i in P.psets)
        ItemBlock(
          id: 'due-pset-${i['id']}',
          leading: const LeadTile(icon: Icons.edit_note_rounded, color: Tokens.accent, fg: Colors.white),
          subtitle: '${i['course']}',
          title: '${i['label']}',
          onTap: () => showPsetSheet(context, i),
        ),
      for (final l in P.labs)
        ItemBlock(
          id: 'due-lab-${l['id']}',
          leading: const LeadTile(icon: Icons.build_outlined, color: Tokens.accent, fg: Colors.white),
          subtitle: 'Phase ${l['phase']}  ·  ~${l['hours']} h',
          title: '${l['title']}',
          onTap: () => showLabSheet(context, l),
        ),
      if (rows == 0)
        Padding(
          padding: EdgeInsets.symmetric(vertical: 28.h),
          child: const Icon(Icons.event_available, size: 48, color: Tokens.quiet, semanticLabel: 'nothing due'),
        ),
      if (P.coming.isNotEmpty) ...[
        const SheetLabel(Icons.lock_clock_outlined, 'Soon'),
        for (final c in P.coming.take(3))
          Opacity(
            opacity: 0.62,
            child: ItemBlock(
              id: 'soon-${c.pset != null ? 'pset' : 'lab'}-${(c.pset ?? c.lab)!['id']}',
              leading: const LeadTile(icon: Icons.lock_outline_rounded),
              subtitle: () {
                final L = e.lessonOf(c.after);
                return L != null ? '${L.n} · ${L.title}' : c.after;
              }(),
              title: c.pset != null ? '${c.pset!['label']}' : '${c.lab!['title']}',
            ),
          ),
      ],
    ];
  }

  // ---------- Exams ----------

  void _sit(ExamItem x) => _push(x.kind == 'diag' ? DiagScreen(id: x.id) : QuizScreen.bank(x.id));

  List<Widget> _exams(AppModel m, List<ExamItem> items) {
    if (items.isEmpty) return const [];
    final lead = items.first, rest = items.skip(1).toList();
    final open = rest.where((x) => !x.locked).toList(), shut = rest.where((x) => x.locked).toList();
    return [
      if (!lead.locked) _ExamHero(item: lead, gate: lead.due != null ? m.engine.gatePlan().first.n : null, onSit: () => _sit(lead)),
      SizedBox(height: 14.h),
      for (final x in open)
        ItemBlock(
          id: 'exam-${x.id}',
          leading: _examTile(x),
          subtitle: x.code,
          title: x.title,
          meta: x.verdict == 'pass' || x.verdict == 'gap' ? '${x.score}%' : (x.verdict == 'logged' ? null : x.size.split(' ').first),
          onTap: () => _sit(x),
        ),
      for (final x in shut)
        ItemBlock(
          id: 'exam-locked-${x.id}',
          leading: const LeadTile(icon: Icons.lock_outline_rounded),
          title: x.short,
          below: ProgressBar(x.of == 0 ? 0 : (x.watched / x.of).clamp(0, 1).toDouble()),
        ),
    ];
  }

  Widget _examTile(ExamItem x) => switch (x.verdict) {
    'pass' || 'logged' => const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white),
    'gap' => const LeadTile(icon: Icons.priority_high_rounded, color: Tokens.missed, fg: Colors.white),
    _ => LeadTile(icon: x.kind == 'diag' ? Icons.timer_outlined : Icons.quiz_outlined),
  };

  // ---------- Code (NeetCode) ----------

  List<Widget> _code(BuildContext context, AppModel m) {
    final problems = <String, List<String>>{};
    for (final c in m.data.courses) {
      if (c['tracker'] == true && c['problems'] is Map) {
        (c['problems'] as Map).forEach((cat, list) => problems[cat as String] = (list as List).cast<String>());
      }
    }
    final solved = m.engine.S['problems'] as Map;
    return [
      for (final en in problems.entries)
        ItemBlock(
          id: 'code-${en.key}',
          leading: const LeadTile(icon: Icons.code),
          title: en.key,
          meta: '${en.value.where((p) => truthy(solved['${en.key}|$p'])).length}/${en.value.length}',
          onTap: () => showProblemsSheet(context, en.key, en.value),
        ),
    ];
  }

  // ---------- All: the whole catalogue, ticked or not ----------

  List<Widget> _all(BuildContext context, AppModel m) {
    final e = m.engine;
    final psets = e.S['psets'] as Map, labs = e.S['labs'] as Map;
    return [
      for (final i in e.allPsets())
        ItemBlock(
          id: 'all-pset-${i['id']}',
          leading: truthy(psets[i['id']])
              ? const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white)
              : const LeadTile(icon: Icons.assignment_outlined),
          subtitle: '${i['course']}',
          title: '${i['label']}',
          onTap: () => showPsetSheet(context, i),
        ),
      for (final l in m.data.labs)
        ItemBlock(
          id: 'all-lab-${l['id']}',
          leading: truthy((labs[l['id']] is Map ? labs[l['id']] as Map : const {})['done'])
              ? const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white)
              : const LeadTile(icon: Icons.build_outlined),
          subtitle: 'Phase ${l['phase']}  ·  ~${l['hours']} h',
          title: '${l['title']}',
          onTap: () => showLabSheet(context, l),
        ),
    ];
  }
}

/// The exam to sit next: a dark card like the lecture cards, the one action.
class _ExamHero extends StatelessWidget {
  const _ExamHero({required this.item, required this.gate, required this.onSit});
  final ExamItem item;
  final int? gate;
  final VoidCallback onSit;

  @override
  Widget build(BuildContext context) {
    final x = item;
    final urgent = x.due != null && x.due! <= 14;
    return Container(
      key: const ValueKey('exam-hero'),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(color: Tokens.card, borderRadius: BorderRadius.circular(Tokens.cardRadius)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  x.code,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: body(11.5, color: Tokens.goldHi, weight: FontWeight.w800).copyWith(letterSpacing: 0.8),
                ),
              ),
              if (gate != null)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.flag_outlined, size: 16, color: urgent ? Tokens.goldHi : Tokens.onMidnight2),
                    SizedBox(width: 4.w),
                    Text('${x.due! < 0 ? 0 : x.due}', style: body(14, color: Colors.white, weight: FontWeight.w800)),
                  ],
                ),
            ],
          ),
          SizedBox(height: 6.h),
          Text(x.title, maxLines: 3, overflow: TextOverflow.ellipsis, style: body(16.5, color: Colors.white, weight: FontWeight.w700, height: 1.3)),
          SizedBox(height: 10.h),
          Wrap(
            spacing: 16.w,
            runSpacing: 6.h,
            children: [
              Stat(icon: x.kind == 'diag' ? Icons.timer_outlined : Icons.quiz_outlined, value: x.size.split(' ').first, semantic: x.size),
              if (x.pass != null) Stat(icon: Icons.flag_circle_outlined, value: '${x.pass}%', semantic: 'pass at'),
            ],
          ),
          if (x.of > 0) ...[
            SizedBox(height: 12.h),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: (x.watched / x.of).clamp(0, 1).toDouble(),
                minHeight: 6,
                backgroundColor: Colors.white24,
                valueColor: const AlwaysStoppedAnimation(Tokens.navyOnDark),
              ),
            ),
          ],
          SizedBox(height: 14.h),
          Semantics(
            identifier: 'exam-sit',
            child: PillButton(key: const ValueKey('exam-sit'), label: 'Sit', icon: Icons.play_arrow_rounded, onPressed: onSit),
          ),
        ],
      ),
    );
  }
}
