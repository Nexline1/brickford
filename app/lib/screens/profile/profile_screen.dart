// Profile (stage 1): the record in numbers, and every course with its progress.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../state/app_model.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../course/course_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final header = Wrap(spacing: 22.w, runSpacing: 8.h, children: [
      Stat(icon: Icons.local_fire_department_outlined, value: '${e.streak()}', semantic: 'streak'),
      Stat(icon: Icons.emoji_events_outlined, value: '${e.bestStreak()}', semantic: 'best streak'),
      Stat(icon: Icons.verified_outlined, value: '${e.studyDays.toSet().length}', semantic: 'days sealed'),
    ]);
    return SheetScaffold(
      header: header,
      children: [
        for (final c in m.data.courses)
          if (((c['units'] as List?) ?? const []).isNotEmpty)
            () {
              final id = c['id'] as String;
              final n = courseCounts(m, id);
              return ItemBlock(
                key: ValueKey('profile-course-$id'),
                subtitle: '${c['code']}',
                title: '${c['title']}',
                meta: '${n.cleared}/${n.total}',
                below: ProgressBar(n.total == 0 ? 0 : n.cleared / n.total),
                onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CourseScreen(cid: id))),
              );
            }(),
      ],
    );
  }
}
