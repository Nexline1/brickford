// Profile: the record in numbers; Record, Transcript, Library, Guide, Method, Workshop and Sync (the courses moved to Learn, the Treasury to Build).
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../state/app_model.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../library/library_screen.dart';
import 'guide_screen.dart';
import 'method_screen.dart';
import 'transcript_screen.dart';
import 'workshop_screen.dart';
import '../record/record_screen.dart';
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
        ChipRow(
          children: [
            Semantics(identifier: 'chip-record', child: BrickChip(key: const ValueKey('chip-record'), label: 'Record', icon: Icons.verified_outlined, selected: false, onTap: () => openRecord(context))),
            Semantics(identifier: 'chip-library', child: BrickChip(key: const ValueKey('chip-library'), label: 'Library', icon: Icons.menu_book_outlined, selected: false, onTap: () => openLibrary(context))),
            Semantics(identifier: 'chip-transcript', child: BrickChip(key: const ValueKey('chip-transcript'), label: 'Transcript', icon: Icons.workspace_premium_outlined, selected: false, onTap: () => openTranscript(context))),
            Semantics(identifier: 'chip-guide', child: BrickChip(key: const ValueKey('chip-guide'), label: 'Guide', icon: Icons.auto_stories_outlined, selected: false, onTap: () => openGuide(context))),
            Semantics(identifier: 'chip-method', child: BrickChip(key: const ValueKey('chip-method'), label: 'Method', icon: Icons.psychology_alt_outlined, selected: false, onTap: () => openMethod(context))),
            Semantics(identifier: 'chip-workshop', child: BrickChip(key: const ValueKey('chip-workshop'), label: 'Workshop', icon: Icons.construction_outlined, selected: false, onTap: () => openWorkshop(context))),
          ],
        ),
        SizedBox(height: 14.h),
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
      ],
    );
  }
}
