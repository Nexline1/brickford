// T-069: the near checkpoints on Home, the web dashboard's Checkpoints block
// (app.js checkpointsHTML): the week's solved problems in the label, then each
// checkpoint as a fold (the first not yet done open), its items as tick rows.
// Days left in calendar days; past the date it reads "late", in the same ink as
// any other count, never red, and can still be ticked. An auto item is drawn
// ticked or not by what the app knows and has no tap. A tick is one write
// (AppModel.cpToggle); building writes nothing.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/checkpoints.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';

/// The block, or nothing when there are no checkpoints.
List<Widget> checkpointsBlock(BuildContext context, AppModel m) {
  final vs = m.engine.checkpointsView();
  if (vs.isEmpty) return const [];
  return [
    Semantics(
      identifier: 'cp-week',
      child: SheetLabel(Icons.flag_outlined, 'Checkpoints · ${cpWeekLine(m.engine.problemsThisWeek())}', key: const ValueKey('cp-week')),
    ),
    CheckpointsBlock(views: vs, m: m),
  ];
}

class CheckpointsBlock extends StatefulWidget {
  const CheckpointsBlock({super.key, required this.views, required this.m});
  final List<CpView> views;
  final AppModel m;

  @override
  State<CheckpointsBlock> createState() => _CheckpointsBlockState();
}

class _CheckpointsBlockState extends State<CheckpointsBlock> {
  /// Which folds are open; null until the reader opens or closes one (then the first not done is open).
  Set<String>? _open;

  @override
  Widget build(BuildContext context) {
    final vs = widget.views;
    final first = vs.where((v) => v.state != 'done').firstOrNull?.id;
    final open = _open ?? {?first};
    return Padding(
      padding: EdgeInsets.only(bottom: 10.h),
      child: Material(
        color: Tokens.fieldFill,
        borderRadius: BorderRadius.circular(Tokens.radius),
        clipBehavior: Clip.antiAlias,
        child: Column(
          children: [
            for (final v in vs) ...[
              _head(v, open.contains(v.id), () => setState(() => _open = {...open}..flip(v.id))),
              if (open.contains(v.id))
                for (var i = 0; i < v.items.length; i++) _item(v, v.items[i], v.texts[i]),
            ],
          ],
        ),
      ),
    );
  }

  Widget _head(CpView v, bool isOpen, VoidCallback onTap) => Semantics(
    identifier: 'cp-${v.id}',
    button: true,
    expanded: isOpen,
    child: InkWell(
      key: ValueKey('cp-${v.id}'),
      onTap: onTap,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 52),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(v.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: body(14.5, weight: FontWeight.w700, height: 1.3)),
                    SizedBox(height: 2.h),
                    Text(v.meta, key: ValueKey('cp-${v.id}-meta'), maxLines: 1, overflow: TextOverflow.ellipsis,
                        style: body(12, color: Tokens.ink2, weight: FontWeight.w600)),
                  ],
                ),
              ),
              SizedBox(width: 8.w),
              Icon(isOpen ? Icons.expand_less : Icons.expand_more, size: 20, color: Tokens.quiet),
            ],
          ),
        ),
      ),
    ),
  );

  Widget _item(CpView v, CpItem x, String text) {
    final row = ConstrainedBox(
      constraints: const BoxConstraints(minHeight: 48),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
        child: Row(
          children: [
            Icon(
              x.done ? Icons.check_circle : Icons.radio_button_unchecked,
              size: 22,
              color: x.done ? Tokens.done : Tokens.quiet,
              semanticLabel: x.done ? (x.auto ? 'done, ticked by the app' : 'done') : 'not done',
            ),
            SizedBox(width: 12.w),
            Expanded(child: Text(text, style: body(13.5, color: x.done ? Tokens.ink2 : Tokens.ink, weight: FontWeight.w600, height: 1.3))),
          ],
        ),
      ),
    );
    return Semantics(
      identifier: 'cp-${v.id}-${x.id}',
      child: x.auto
          ? KeyedSubtree(key: ValueKey('cp-${v.id}-${x.id}'), child: row)
          : InkWell(key: ValueKey('cp-${v.id}-${x.id}'), onTap: () => widget.m.cpToggle(v.id, x.id, !x.done), child: row),
    );
  }
}

extension on Set<String> {
  /// Add [k] when absent, remove it when present.
  void flip(String k) => contains(k) ? remove(k) : add(k);
}
