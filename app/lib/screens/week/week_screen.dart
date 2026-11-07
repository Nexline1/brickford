// Week (V.review): the Sunday seal. What counted for you, what you ship, what
// got in the way, and one button that only works on the revision week's own
// Sunday. Past weeks below, newest first.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/record.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/record_widgets.dart';
import '../../widgets/sheet_scaffold.dart';

/// Opens the week page (today's revision week).
void openWeek(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const WeekScreen()));

class WeekScreen extends StatefulWidget {
  const WeekScreen({super.key});
  @override
  State<WeekScreen> createState() => _WeekScreenState();
}

class _WeekScreenState extends State<WeekScreen> {
  final _shipped = TextEditingController(), _notes = TextEditingController(), _rev = TextEditingController();
  int posts = 0;

  @override
  void dispose() {
    _shipped.dispose();
    _notes.dispose();
    _rev.dispose();
    super.dispose();
  }

  void _seal(AppModel m, WeekView v) {
    final ok = m.sealWeek(shipped: _shipped.text, notes: _notes.text, posts: posts, revenue: double.tryParse(_rev.text.trim()));
    if (!ok) return toast(context, v.state);
    _shipped.clear();
    _notes.clear();
    _rev.clear();
    setState(() => posts = 0);
    toast(context, 'Week ${v.w} sealed');
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final v = m.engine.weekView();
    final sealed = v.sealed != null;

    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Week ${v.w}', key: const ValueKey('week-title'), style: display(34)),
        SizedBox(height: 8.h),
        Row(
          children: [
            Icon(sealed ? Icons.verified : v.canSeal ? Icons.lock_open_rounded : Icons.lock_outline, size: 18, color: sealed ? Tokens.gold : Tokens.onMidnight2),
            SizedBox(width: 8.w),
            Flexible(
              child: Text(v.state, key: const ValueKey('week-state'), style: body(15, color: Tokens.onMidnight2, weight: FontWeight.w600)),
            ),
          ],
        ),
      ],
    );

    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          Row(
            children: [
              Expanded(child: StatTile(id: 'week-dsa', icon: Icons.terminal, label: 'DSA', value: '${v.dsa}')),
              SizedBox(width: 10.w),
              Expanded(child: StatTile(id: 'week-proven', icon: Icons.verified_outlined, label: 'Proven', value: '${v.proven}')),
            ],
          ),
          SizedBox(height: 10.h),
          Row(
            children: [
              Expanded(
                child: StatTile(
                  id: 'week-posts',
                  icon: Icons.campaign_outlined,
                  label: 'Posts',
                  child: Row(
                    children: [
                      StepButton(key: const ValueKey('posts-minus'), id: 'posts-minus', icon: Icons.remove, tooltip: 'Fewer posts', onPressed: posts > 0 ? () => setState(() => posts--) : null),
                      Expanded(
                        child: Text('$posts', key: const ValueKey('week-posts-n'), textAlign: TextAlign.center, style: display(28, color: Tokens.ink)),
                      ),
                      StepButton(key: const ValueKey('posts-plus'), id: 'posts-plus', icon: Icons.add, tooltip: 'More posts', onPressed: () => setState(() => posts++)),
                    ],
                  ),
                ),
              ),
              SizedBox(width: 10.w),
              Expanded(
                child: v.counted
                    ? StatTile(id: 'week-bhd', icon: Icons.payments_outlined, label: 'BHD', value: numText(v.earned))
                    : StatTile(
                        id: 'week-bhd',
                        icon: Icons.payments_outlined,
                        label: 'BHD',
                        child: TextField(
                          key: const ValueKey('week-bhd-field'),
                          controller: _rev,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          style: fieldStyle(display(28, color: Tokens.ink)),
                          decoration: InputDecoration(isDense: true, border: InputBorder.none, hintText: '0', hintStyle: fieldStyle(display(28, color: Tokens.quiet))),
                        ),
                      ),
              ),
            ],
          ),
          SizedBox(height: 16.h),
          BrickfordField(key: const ValueKey('week-shipped'), id: 'week-shipped', icon: Icons.rocket_launch_outlined, hint: 'Shipped', controller: _shipped),
          SizedBox(height: 10.h),
          BrickfordField(key: const ValueKey('week-notes'), id: 'week-notes', icon: Icons.block_outlined, hint: 'In the way', controller: _notes),
          SizedBox(height: 16.h),
          PillButton(
            key: const ValueKey('week-seal'), id: 'week-seal',
            label: sealed ? 'Sealed' : 'Seal',
            icon: v.canSeal ? Icons.verified_outlined : Icons.lock_outline,
            tone: sealed ? PillTone.done : PillTone.primary,
            onPressed: v.canSeal ? () => _seal(m, v) : null,
          ),
          SizedBox(height: 8.h),
          const SheetLabel(Icons.history, 'Past weeks'),
          if (v.past.isEmpty)
            Padding(
              padding: EdgeInsets.symmetric(vertical: 18.h),
              child: const Icon(Icons.verified_outlined, size: 40, color: Tokens.quiet, semanticLabel: 'none sealed yet'),
            ),
          for (final x in v.past)
            ItemBlock(
              leading: LeadTile(text: x.title.replaceFirst('Week ', 'W'), color: Colors.white),
              title: x.shipped.isEmpty ? 'Nothing shipped' : x.shipped,
              subtitle: x.metrics,
              meta: x.date,
              below: x.notes == 'No notes.' ? null : Text(x.notes, style: body(12.5, color: Tokens.ink2, height: 1.35)),
            ),
        ],
      ),
    );
  }
}
