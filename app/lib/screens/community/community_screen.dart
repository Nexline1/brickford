// Community (stage 1): the storytelling course, unit by unit.
import 'package:flutter/material.dart';

import '../../state/app_model.dart';
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
    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BigCount(
          icon: Icons.record_voice_over,
          semantic: 'storytelling lectures cleared',
          value: '$cleared',
          total: '$total',
          valueKey: const ValueKey('community-count'),
        ),
      ],
    );
    return SheetScaffold(
      tabbed: true,
      header: header,
      children: [
        for (final id in ids) ...[
          for (var ui = 0; ui < ((m.data.course(id)!['units'] as List?) ?? const []).length; ui++)
            () {
              final u = (m.data.course(id)!['units'] as List)[ui];
              final n = courseCounts(m, id, unit: ui);
              return ItemBlock(
                key: ValueKey('community-unit-$id-$ui'),
                leading: n.total > 0 && n.cleared == n.total
                    ? const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white)
                    : LeadTile(text: '${ui + 1}'),
                subtitle: '${m.data.course(id)!['code']}',
                title: '${u['name']}',
                meta: '${n.cleared}/${n.total}',
                below: ProgressBar(n.total == 0 ? 0 : n.cleared / n.total),
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => CourseScreen(cid: id, unit: ui),
                  ),
                ),
              );
            }(),
        ],
      ],
    );
  }
}
