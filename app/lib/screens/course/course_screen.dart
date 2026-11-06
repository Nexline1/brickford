// A course (or one unit of it): its lectures as blocks, each with its glyph.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../engine/quiz.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import '../learn/problem_sheets.dart';
import '../lesson/lesson_screen.dart';

/// Lessons watched and cleared in a course, from S.
({int total, int done, int cleared}) courseCounts(AppModel m, String cid, {int? unit}) {
  var total = 0, done = 0, cleared = 0;
  for (final f in m.engine.flatLessons(cid)) {
    if (unit != null && f.ui != unit) continue;
    total++;
    if (truthy(m.lesson(f.key)['done'])) done++;
    if (m.engine.lessonCleared(f.key)) cleared++;
  }
  return (total: total, done: done, cleared: cleared);
}

class CourseScreen extends StatelessWidget {
  const CourseScreen({super.key, required this.cid, this.unit});
  final String cid;
  final int? unit;

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final c = m.data.course(cid)!;
    final units = (c['units'] as List? ?? const []);
    final n = courseCounts(m, cid, unit: unit);
    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '${c['code']}',
          style: body(12, color: Tokens.onMidnight2, weight: FontWeight.w700),
        ),
        SizedBox(height: 4.h),
        Text(
          unit != null ? '${units[unit!]['name']}' : '${c['title']}',
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: display(22, weight: FontWeight.w600),
        ),
        SizedBox(height: 10.h),
        Row(
          children: [
            if (truthy(c['tracker']))
              Stat(icon: Icons.code, value: '${m.engine.dsaCount()}/150', semantic: 'problems solved')
            else ...[
              Stat(icon: Icons.check_circle_outline, value: '${n.cleared}/${n.total}', semantic: 'cleared'),
              SizedBox(width: 18.w),
              Stat(icon: Icons.visibility_outlined, value: '${n.done}', semantic: 'watched'),
            ],
          ],
        ),
      ],
    );
    void openLesson(int ui, int li) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => LessonScreen(cid: cid, ui: ui, li: li)));
    // The unit page is the lectures; the course page is its units and the one next lecture
    // (a course of a single unit goes straight to its lectures).
    final byUnit = unit == null && units.length > 1;
    ({int ui, int li})? nx;
    if (unit == null) {
      for (var ui = 0; ui < units.length && nx == null; ui++) {
        for (var li = 0; li < (units[ui]['lessons'] as List).length; li++) {
          if (!truthy(m.lesson(lessonKey(cid, ui, li))['done'])) {
            nx = (ui: ui, li: li);
            break;
          }
        }
      }
    }
    final started = n.done > 0;
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          if (truthy(c['tracker'])) ..._tracker(context, m, c),
          if (nx != null && !truthy(c['tracker'])) ...[
            PillButton(
              key: const ValueKey('course-continue'),
              id: 'course-continue',
              label: started ? 'Continue' : 'Start',
              icon: Icons.play_arrow_rounded,
              onPressed: () => openLesson(nx!.ui, nx.li),
            ),
            SizedBox(height: 14.h),
          ],
          if (byUnit)
            for (var ui = 0; ui < units.length; ui++)
              () {
                final u = courseCounts(m, cid, unit: ui);
                return ItemBlock(
                  key: ValueKey('unit-$cid-$ui'),
                  id: 'unit-$cid-$ui',
                  leading: u.total > 0 && u.cleared == u.total
                      ? const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white)
                      : LeadTile(text: '${ui + 1}'),
                  title: '${units[ui]['name']}',
                  meta: '${u.cleared}/${u.total}',
                  below: ProgressBar(u.total == 0 ? 0 : u.cleared / u.total),
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CourseScreen(cid: cid, unit: ui))),
                );
              }()
          else
            for (var ui = 0; ui < units.length; ui++)
              if (unit == null || unit == ui)
                for (var li = 0; li < (units[ui]['lessons'] as List).length; li++)
                  ItemBlock(
                    key: ValueKey('lesson-$cid-$ui-$li'),
                    id: 'lesson-row-$cid-$ui-$li',
                    leading: LessonGlyph(m.markOf(lessonKey(cid, ui, li))),
                    title: '${units[ui]['lessons'][li]['t']}',
                    meta: units[ui]['lessons'][li]['min'] != null ? "${units[ui]['lessons'][li]['min']}m" : null,
                    onTap: () => openLesson(ui, li),
                  ),
        ],
      ),
    );
  }

  /// The tracker (NeetCode) course: its categories, each opening its problems.
  List<Widget> _tracker(BuildContext context, AppModel m, Map<String, dynamic> c) {
    final solved = m.engine.S['problems'] as Map;
    final cats = c['problems'] is Map ? (c['problems'] as Map).cast<String, dynamic>() : const <String, dynamic>{};
    return [
      for (final en in cats.entries)
        ItemBlock(
          id: 'code-${en.key}',
          leading: const LeadTile(icon: Icons.code),
          title: en.key,
          meta: '${(en.value as List).where((p) => truthy(solved['${en.key}|$p'])).length}/${(en.value as List).length}',
          onTap: () => showProblemsSheet(context, en.key, (en.value as List).cast<String>()),
        ),
    ];
  }
}
