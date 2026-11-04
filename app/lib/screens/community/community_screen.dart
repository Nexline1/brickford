// Community (stage 1): the storytelling course, unit by unit.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../course/course_screen.dart';

class CommunityScreen extends StatelessWidget {
  const CommunityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final ids = m.data.speechCourseIds.where((id) => m.data.course(id) != null).toList();
    var total = 0, cleared = 0;
    for (final id in ids) {
      final n = courseCounts(m, id);
      total += n.total;
      cleared += n.cleared;
    }
    final header = Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
      Text('$cleared', style: display(54)),
      SizedBox(width: 6.w),
      Padding(
        padding: EdgeInsets.only(bottom: 9.h),
        child: Text('/ $total', style: body(15, color: Tokens.onMidnight2, weight: FontWeight.w600)),
      ),
      const Spacer(),
      Padding(
        padding: EdgeInsets.only(bottom: 8.h),
        child: const Icon(Icons.record_voice_over_outlined, color: Tokens.onMidnight2, size: 30, semanticLabel: 'storytelling'),
      ),
    ]);
    return SheetScaffold(
      header: header,
      children: [
        for (final id in ids) ...[
          for (var ui = 0; ui < ((m.data.course(id)!['units'] as List?) ?? const []).length; ui++)
            () {
              final u = (m.data.course(id)!['units'] as List)[ui];
              final n = courseCounts(m, id, unit: ui);
              return ItemBlock(
                subtitle: '${m.data.course(id)!['code']}',
                title: '${u['name']}',
                meta: '${n.cleared}/${n.total}',
                below: ProgressBar(n.total == 0 ? 0 : n.cleared / n.total),
                onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CourseScreen(cid: id, unit: ui))),
              );
            }(),
        ],
      ],
    );
  }
}
