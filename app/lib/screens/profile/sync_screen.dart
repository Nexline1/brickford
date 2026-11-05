// Profile > Sync (T-064 stage 3): the web app's /sync page, in the app's design.
// A status (Synced / Offline / Needs attention), Pull and Push, and the token
// and repo fields. THE TOKEN IS A SECRET: it is typed into a hidden field, kept
// by SyncService, and never shown again; this screen says "Saved".
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../state/app_model.dart';
import '../../state/sync.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';

/// The status in the app's words and glyphs, shared by the screen and the Profile row.
({String word, IconData icon, Color onDark}) syncLook(SyncStatus s) => switch (s) {
  SyncStatus.synced => (word: 'Synced', icon: Icons.cloud_done_outlined, onDark: Tokens.doneOnDark),
  SyncStatus.offline => (word: 'Offline', icon: Icons.cloud_off_outlined, onDark: Tokens.onMidnight2),
  SyncStatus.attention => (word: 'Needs attention', icon: Icons.error_outline, onDark: Tokens.gold),
  SyncStatus.notConnected => (word: 'Not connected', icon: Icons.link_off, onDark: Tokens.onMidnight2),
};

/// "just now · 1 other device", or why there is nothing to say.
String syncSub(SyncService s) {
  final last = s.lastSync;
  final devs = s.otherDevices;
  if (!s.hasToken) return 'Add a token';
  return '${last == null ? 'Never synced' : s.ago(last)}${devs > 0 ? ' · $devs other device${devs == 1 ? '' : 's'}' : ''}';
}

class SyncScreen extends StatefulWidget {
  const SyncScreen({super.key});
  @override
  State<SyncScreen> createState() => _SyncScreenState();
}

class _SyncScreenState extends State<SyncScreen> {
  final token = TextEditingController(), repo = TextEditingController(text: SyncService.defaultRepo);
  String? problem;

  @override
  void dispose() {
    token.dispose();
    repo.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sync = AppScope.of(context).sync;
    return ListenableBuilder(
      listenable: sync,
      builder: (context, _) {
        final look = syncLook(sync.status);
        final err = sync.error;
        final header = Row(
          children: [
            Icon(look.icon, size: 40, color: look.onDark, semanticLabel: look.word),
            SizedBox(width: 14.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(look.word, key: const ValueKey('sync-status'), style: display(26)),
                  SizedBox(height: 4.h),
                  Text(
                    syncSub(sync),
                    key: const ValueKey('sync-sub'),
                    style: body(14, color: Tokens.onMidnight2, weight: FontWeight.w500),
                  ),
                ],
              ),
            ),
          ],
        );
        return Scaffold(
          backgroundColor: Tokens.midnight,
          body: SheetScaffold(
            header: header,
            onBack: () => Navigator.of(context).pop(),
            children: [
              if (err != null)
                Container(
                  key: const ValueKey('sync-error'),
                  margin: EdgeInsets.only(bottom: 14.h),
                  padding: EdgeInsets.all(14.w),
                  decoration: BoxDecoration(
                    color: Tokens.fieldFill,
                    borderRadius: BorderRadius.circular(Tokens.radius),
                    border: const Border(left: BorderSide(color: Tokens.missed, width: 4)),
                  ),
                  child: Text('${err['msg']}', style: body(13.5, weight: FontWeight.w600, height: 1.35)),
                ),
              if (!sync.hasToken) ...[
                BrickfordField(
                  key: const ValueKey('sync-token'),
                  icon: Icons.key_outlined,
                  hint: 'github_pat_…',
                  controller: token,
                  obscure: true,
                ),
                SizedBox(height: 12.h),
                BrickfordField(key: const ValueKey('sync-repo'), icon: Icons.folder_outlined, hint: 'owner/name', controller: repo),
                if (problem != null)
                  Padding(
                    padding: EdgeInsets.only(top: 10.h),
                    child: Text(
                      problem!,
                      key: const ValueKey('sync-problem'),
                      style: body(13, color: Tokens.missed, weight: FontWeight.w600),
                    ),
                  ),
                SizedBox(height: 16.h),
                Semantics(
                  identifier: 'sync-connect',
                  child: PillButton(
                    key: const ValueKey('sync-connect'),
                    icon: Icons.link,
                    label: 'Connect',
                    onPressed: () => setState(() {
                      problem = sync.connect(token.text, repo.text);
                      if (problem == null) token.clear();
                    }),
                  ),
                ),
                SizedBox(height: 12.h),
                Text(
                  'Contents: read and write, on that one repo. It stays on this device.',
                  style: body(12.5, color: Tokens.ink2, height: 1.35),
                ),
              ] else ...[
                Row(
                  children: [
                    Expanded(
                      child: Semantics(
                        identifier: 'sync-pull',
                        child: PillButton(
                          key: const ValueKey('sync-pull'),
                          icon: Icons.south,
                          label: 'Pull',
                          onPressed: () => sync.run('pull'),
                        ),
                      ),
                    ),
                    SizedBox(width: 12.w),
                    Expanded(
                      child: Semantics(
                        identifier: 'sync-push',
                        child: PillButton(
                          key: const ValueKey('sync-push'),
                          icon: Icons.north,
                          label: 'Push',
                          onPressed: () => sync.run('push'),
                        ),
                      ),
                    ),
                  ],
                ),
                if (sync.message.isNotEmpty)
                  Padding(
                    padding: EdgeInsets.only(top: 12.h),
                    child: Text(
                      sync.message,
                      key: const ValueKey('sync-message'),
                      style: body(13, color: Tokens.ink2, weight: FontWeight.w600),
                    ),
                  ),
                SizedBox(height: 18.h),
                ItemBlock(
                  leading: const LeadTile(icon: Icons.key_outlined),
                  title: 'Token',
                  meta: 'Saved',
                ),
                ItemBlock(
                  leading: const LeadTile(icon: Icons.folder_outlined),
                  title: sync.repo,
                ),
                SizedBox(height: 6.h),
                Semantics(
                  identifier: 'sync-forget',
                  child: PillButton(
                    key: const ValueKey('sync-forget'),
                    icon: Icons.link_off,
                    label: 'Forget token',
                    tone: PillTone.quiet,
                    onPressed: sync.forget,
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}

void openSync(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const SyncScreen()));
