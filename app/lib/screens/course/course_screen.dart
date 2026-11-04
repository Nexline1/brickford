// A course (or one unit of it): its lectures as blocks, each with its glyph.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
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
    final header = Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('${c['code']}', style: body(12, color: Tokens.onMidnight2, weight: FontWeight.w700)),
      SizedBox(height: 4.h),
      Text(unit != null ? '${units[unit!]['name']}' : '${c['title']}',
          maxLines: 2, overflow: TextOverflow.ellipsis, style: display(22, weight: FontWeight.w600)),
      SizedBox(height: 10.h),
      Row(children: [
        Stat(icon: Icons.check_circle_outline, value: '${n.cleared}/${n.total}', semantic: 'cleared'),
        SizedBox(width: 18.w),
        Stat(icon: Icons.visibility_outlined, value: '${n.done}', semantic: 'watched'),
      ]),
    ]);
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          for (var ui = 0; ui < units.length; ui++)
            if (unit == null || unit == ui) ...[
              if (unit == null) SheetLabel(Icons.layers_outlined, '${units[ui]['name']}'),
              for (var li = 0; li < (units[ui]['lessons'] as List).length; li++)
                ItemBlock(
                  leading: LessonGlyph(m.markOf(lessonKey(cid, ui, li))),
                  title: '${units[ui]['lessons'][li]['t']}',
                  meta: units[ui]['lessons'][li]['min'] != null ? "${units[ui]['lessons'][li]['min']}m" : null,
                  onTap: () => Navigator.of(context)
                      .push(MaterialPageRoute(builder: (_) => LessonScreen(cid: cid, ui: ui, li: li))),
                ),
            ],
        ],
      ),
    );
  }
}
