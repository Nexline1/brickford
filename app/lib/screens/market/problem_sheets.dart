// The sheets a Problems row opens: a pset or a lab (ticked done, as the web
// page's checkbox does), and a NeetCode category (each problem ticked). They
// repaint from the model, so a tick shows at once.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../engine/problems.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';

Future<void> _sheet(BuildContext context, Widget Function(BuildContext, AppModel) rows) {
  final m = AppScope.of(context);
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Tokens.sheet,
    showDragHandle: true,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(borderRadius: Tokens.sheetBorderRadius),
    builder: (_) => DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.62,
      maxChildSize: 0.92,
      builder: (ctx, scroll) => ListenableBuilder(
        listenable: m,
        builder: (c, _) => ListView(
          controller: scroll,
          physics: const BouncingScrollPhysics(),
          padding: EdgeInsets.fromLTRB(20.w, 0, 20.w, 28.h),
          children: [rows(c, m)],
        ),
      ),
    ),
  );
}

Widget _line(IconData icon, String text) => Padding(
  padding: EdgeInsets.only(bottom: 10.h),
  child: Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Icon(icon, size: 18, color: Tokens.quiet),
      SizedBox(width: 10.w),
      Expanded(child: SelectableText(text, style: body(14, height: 1.45))),
    ],
  ),
);

Widget _title(String t, [String? sub]) => Column(
  children: [
    Text(t, textAlign: TextAlign.center, style: body(16, weight: FontWeight.w700)),
    if (sub != null) ...[SizedBox(height: 4.h), Text(sub, textAlign: TextAlign.center, style: body(12.5, color: Tokens.ink2, weight: FontWeight.w600))],
    SizedBox(height: 16.h),
  ],
);

/// A problem set: where it is, which lecture unlocked it, and the tick.
Future<void> showPsetSheet(BuildContext context, Map<String, dynamic> item) => _sheet(context, (c, m) {
  final id = '${item['id']}', on = truthy((m.engine.S['psets'] as Map)[id]);
  final L = m.engine.lessonOf('${item['after']}');
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _title('${item['label']}', '${item['course']}'),
      if (L != null) _line(m.engine.quizPassed('${item['after']}') ? Icons.verified_outlined : Icons.play_circle_outline, '${L.n} · ${L.title}'),
      _line(Icons.link, '${item['url']}'),
      SizedBox(height: 6.h),
      PillButton(
        key: const ValueKey('pset-tick'),
        label: on ? 'Done' : 'Mark done',
        icon: on ? Icons.check_circle : Icons.check_circle_outline,
        tone: on ? PillTone.done : PillTone.primary,
        onPressed: () => m.tickPset(id, !on),
      ),
    ],
  );
});

/// A lab: what it asks, and the tick; once ticked, the proof URL ("no proof URL, no credit").
Future<void> showLabSheet(BuildContext context, Map<String, dynamic> lab) => _sheet(context, (c, m) {
  final id = '${lab['id']}';
  final st = m.engine.S['labs'] is Map && (m.engine.S['labs'] as Map)[id] is Map ? ((m.engine.S['labs'] as Map)[id] as Map) : const {};
  final on = truthy(st['done']);
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _title('${lab['title']}', 'Phase ${lab['phase']}  ·  ~${lab['hours']} h'),
      _line(Icons.rule_rounded, '${lab['req']}'),
      SizedBox(height: 6.h),
      PillButton(
        key: const ValueKey('lab-tick'),
        label: on ? 'Done' : 'Mark done',
        icon: on ? Icons.check_circle : Icons.check_circle_outline,
        tone: on ? PillTone.done : PillTone.primary,
        onPressed: () => m.tickLab(id, !on),
      ),
      if (on) ...[
        SizedBox(height: 12.h),
        _ProofField(labId: id, initial: '${st['proof'] ?? ''}'),
      ],
    ],
  );
});

class _ProofField extends StatefulWidget {
  const _ProofField({required this.labId, required this.initial});
  final String labId, initial;
  @override
  State<_ProofField> createState() => _ProofFieldState();
}

class _ProofFieldState extends State<_ProofField> {
  late final _ctl = TextEditingController(text: widget.initial);
  @override
  void dispose() {
    _ctl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    return Focus(
      onFocusChange: (f) {
        if (!f) m.labProof(widget.labId, _ctl.text);
      },
      child: BrickfordField(
        key: const ValueKey('lab-proof'),
        icon: Icons.link,
        hint: 'https://github.com/…',
        controller: _ctl,
        keyboardType: TextInputType.url,
        onSubmitted: (v) => m.labProof(widget.labId, v),
      ),
    );
  }
}

/// A NeetCode category: every problem, tapped to tick (S.problems["Category|Name"] = the date, or false).
Future<void> showProblemsSheet(BuildContext context, String category, List<String> names) => _sheet(context, (c, m) {
  final solved = m.engine.S['problems'] as Map;
  final n = names.where((p) => truthy(solved['$category|$p'])).length;
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _title(category, '$n/${names.length}'),
      for (final p in names)
        InkWell(
          key: ValueKey('prob-$category|$p'),
          borderRadius: BorderRadius.circular(12),
          onTap: () => m.tickProblem('$category|$p', !truthy(solved['$category|$p'])),
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 48),
            child: Row(
              children: [
                Icon(
                  truthy(solved['$category|$p']) ? Icons.check_circle : Icons.radio_button_unchecked,
                  size: 22,
                  color: truthy(solved['$category|$p']) ? Tokens.done : Tokens.quiet,
                ),
                SizedBox(width: 12.w),
                Expanded(child: Text(p, style: body(14.5, weight: FontWeight.w600, height: 1.3))),
              ],
            ),
          ),
        ),
    ],
  );
});
