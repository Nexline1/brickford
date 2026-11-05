// Electives (V.electives): the outside courses worth a place in the plan. The ones that fit
// the phase you are in (and the next) first, the rest further out. The status tile cycles
// none -> planned -> done; a row opens its verdict and the source. Data and rules are the
// web app's (D.ELECTIVES, currentPhase, S.electives); this is their face.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/learn.dart';
import '../../state/app_model.dart';
import '../../state/open_url.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';

String phaseText(Object? phase) => phase is num ? 'Phase ${phase.toInt()}' : 'Any';

class ElectivesScreen extends StatelessWidget {
  const ElectivesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final v = e.electives();
    final all = e.D.electives;
    final done = all.where((x) => e.electiveStatus('${x['id']}') == 'done').length;
    final planned = all.where((x) => e.electiveStatus('${x['id']}') == 'planned').length;
    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BigCount(icon: Icons.explore_outlined, semantic: 'done', value: '$done', total: '${all.length}', valueKey: const ValueKey('electives-count')),
        SizedBox(height: 10.h),
        Stat(icon: Icons.event_available_outlined, value: '$planned', semantic: 'planned'),
      ],
    );
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          for (final x in v.open) _Row(x, m),
          if (v.later.isNotEmpty) ...[
            SheetLabel(Icons.lock_clock_outlined, '${v.later.length}'),
            for (final x in v.later) Opacity(opacity: 0.72, child: _Row(x, m)),
          ],
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row(this.x, this.m);
  final Map<String, dynamic> x;
  final AppModel m;

  @override
  Widget build(BuildContext context) {
    final id = '${x['id']}';
    final st = m.engine.electiveStatus(id);
    final (IconData icon, Color bg, Color fg, String label) = switch (st) {
      'done' => (Icons.check_rounded, Tokens.done, Colors.white, 'done'),
      'planned' => (Icons.event_available_outlined, Tokens.accent, Colors.white, 'planned'),
      _ => (Icons.add_rounded, Colors.white, Tokens.ink2, 'not planned'),
    };
    return Padding(
      padding: EdgeInsets.only(bottom: 10.h),
      child: Material(
        key: ValueKey('elective-$id'),
        color: Tokens.fieldFill,
        borderRadius: BorderRadius.circular(Tokens.radius),
        child: InkWell(
          borderRadius: BorderRadius.circular(Tokens.radius),
          onTap: () => _detail(context),
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 64),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
              child: Row(
                children: [
                  Semantics(
                    identifier: 'elective-status-$id',
                    label: '$label, tap to change',
                    button: true,
                    excludeSemantics: true,
                    child: GestureDetector(
                      key: ValueKey('elective-status-$id'),
                      behavior: HitTestBehavior.opaque,
                      onTap: () => m.cycleElective(id),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12), border: st == null ? Border.all(color: Tokens.hairline) : null),
                        child: Icon(icon, size: 22, color: fg),
                      ),
                    ),
                  ),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${x['provider']}  ·  ${phaseText(x['phase'])}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: body(12, color: Tokens.ink2, weight: FontWeight.w500),
                        ),
                        SizedBox(height: 2.h),
                        Text('${x['what']}', maxLines: 2, overflow: TextOverflow.ellipsis, style: body(14.5, weight: FontWeight.w700, height: 1.3)),
                      ],
                    ),
                  ),
                  SizedBox(width: 8.w),
                  const Icon(Icons.arrow_forward_ios, size: 14, color: Tokens.quiet),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _detail(BuildContext context) {
    showListSheet(
      context,
      title: '${x['what']}',
      rows: [
        Text('${x['provider']}  ·  ${phaseText(x['phase'])}  ·  ${x['cost']}', style: body(13, color: Tokens.ink2, weight: FontWeight.w600, height: 1.4)),
        SizedBox(height: 12.h),
        Text('${x['verdict']}', style: body(14.5, height: 1.5)),
        SizedBox(height: 18.h),
        PillButton(key: ValueKey('elective-open-${x['id']}'), id: 'elective-open-${x['id']}', label: 'Open source', icon: Icons.open_in_new_rounded, onPressed: () => openUrl('${x['url']}')),
      ],
    );
  }
}
