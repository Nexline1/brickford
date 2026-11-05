// Build: the Treasury, and the storytelling course unit by unit.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../state/app_model.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../course/course_screen.dart';
import '../treasury/treasury_screen.dart';

class BuildScreen extends StatelessWidget {
  const BuildScreen({super.key});

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
          valueKey: const ValueKey('build-count'),
        ),
      ],
    );
    return SheetScaffold(
      tabbed: true,
      header: header,
      children: [
        ChipRow(
          children: [
            Semantics(identifier: 'chip-treasury', child: BrickChip(key: const ValueKey('chip-treasury'), label: 'Treasury', icon: Icons.savings_outlined, selected: false, onTap: () => openTreasury(context))),
          ],
        ),
        SizedBox(height: 14.h),
        for (final id in ids) ...[
          for (var ui = 0; ui < ((m.data.course(id)!['units'] as List?) ?? const []).length; ui++)
            () {
              final u = (m.data.course(id)!['units'] as List)[ui];
              final n = courseCounts(m, id, unit: ui);
              return ItemBlock(
                key: ValueKey('build-unit-$id-$ui'),
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
