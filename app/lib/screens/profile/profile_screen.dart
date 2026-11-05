// Profile (stage 1): the record in numbers, and every course with its progress.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../state/app_model.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../course/course_screen.dart';
import 'sync_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BigCount(
          icon: Icons.local_fire_department,
          semantic: 'streak over best',
          value: '${e.streak()}',
          total: '${e.bestStreak()}',
          valueKey: const ValueKey('profile-streak'),
        ),
        SizedBox(height: 10.h),
        Wrap(
          spacing: 22.w,
          runSpacing: 8.h,
          children: [Stat(icon: Icons.verified_outlined, value: '${e.studyDays.toSet().length}', semantic: 'days sealed')],
        ),
      ],
    );
    return SheetScaffold(
      tabbed: true,
      header: header,
      children: [
        ListenableBuilder(
          listenable: m.sync,
          builder: (context, _) {
            final look = syncLook(m.sync.status);
            return ItemBlock(
              key: const ValueKey('profile-sync'),
              id: 'profile-sync',
              leading: LeadTile(icon: look.icon, color: Tokens.card, fg: look.onDark),
              subtitle: syncSub(m.sync),
              title: look.word,
              onTap: () => openSync(context),
            );
          },
        ),
        for (final c in m.data.courses)
          if (((c['units'] as List?) ?? const []).isNotEmpty)
            () {
              final id = c['id'] as String;
              final n = courseCounts(m, id);
              return ItemBlock(
                key: ValueKey('profile-course-$id'),
                leading: LeadTile(text: '${c['code']}'.split(' ').last),
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
