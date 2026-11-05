// The Atlas (V.atlas): the route to the finish with its five gates, the next gate and
// the days left, what is running now and what opens later. Route and tiles are the
// web app's; this is their face, in the sheet. Tapping a course opens it.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/learn.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../course/course_screen.dart';

class AtlasScreen extends StatelessWidget {
  const AtlasScreen({super.key});

  void _course(BuildContext context, String id) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CourseScreen(cid: id)));

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final a = m.engine.atlas();
    final header = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(monthLabel(m.engine.planDrift().projected, true), key: const ValueKey('atlas-finish'), style: display(30)),
        SizedBox(height: 10.h),
        Wrap(
          spacing: 20.w,
          runSpacing: 6.h,
          children: [
            if (a.next != null) Stat(icon: Icons.flag_outlined, value: '${a.next!.daysLeft}', semantic: 'days to the next gate'),
            Stat(icon: Icons.menu_book_outlined, value: '${a.tiles.length}', semantic: 'courses running'),
            if (a.base != null) Stat(icon: Icons.trending_flat_rounded, value: a.base!.split(' · ').last, semantic: 'against the plan baseline'),
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
          _Route(a),
          SizedBox(height: 14.h),
          if (a.next != null) _NextGateCard(a.next!),
          SheetLabel(Icons.play_circle_outline, '${a.tiles.length}'),
          for (final t in a.tiles)
            ItemBlock(
              key: ValueKey('atlas-tile-${t.id}'),
              id: 'atlas-tile-${t.id}',
              leading: LeadTile(text: t.code.split(' ').last),
              subtitle: t.code,
              title: t.title,
              meta: '${t.pct}%',
              below: _TileBar(t),
              onTap: () => _course(context, t.id),
            ),
          if (a.later.isNotEmpty) ...[
            SheetLabel(Icons.lock_clock_outlined, '${a.later.length}'),
            Wrap(
              spacing: 8.w,
              runSpacing: 8.h,
              children: [
                for (final c in a.later)
                  Semantics(
                    identifier: 'atlas-later-${c.id}',
                    child: BrickChip(key: ValueKey('atlas-later-${c.id}'), label: c.text, selected: false, onTap: () => _course(context, c.id)),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _TileBar extends StatelessWidget {
  const _TileBar(this.t);
  final AtlasTile t;
  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(child: ProgressBar(t.pct / 100)),
      SizedBox(width: 10.w),
      Text('${t.n}/${t.of}', style: body(11.5, color: Tokens.ink2, weight: FontWeight.w600)),
    ],
  );
}

/// The route: Start and the five gates down a rail that fills as the study days pass,
/// with a pin where you are.
class _Route extends StatelessWidget {
  const _Route(this.a);
  final AtlasData a;

  @override
  Widget build(BuildContext context) {
    final rows = <Widget>[];
    for (final n in a.nodes) {
      rows.add(_NodeRow(n));
      if (n.cur) rows.add(_PinRow(a.pin));
    }
    return Container(
      key: const ValueKey('atlas-route'),
      padding: EdgeInsets.fromLTRB(16.w, 12.h, 16.w, 12.h),
      decoration: BoxDecoration(color: Tokens.card, borderRadius: BorderRadius.circular(Tokens.cardRadius)),
      child: Column(children: rows),
    );
  }
}

class _NodeRow extends StatelessWidget {
  const _NodeRow(this.n);
  final AtlasNode n;

  @override
  Widget build(BuildContext context) {
    final lit = n.past;
    return Semantics(
      label: '${n.label} ${n.when}${n.done ? ', passed' : ''}',
      excludeSemantics: true,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 44),
        child: Row(
          children: [
            SizedBox(
              width: 24,
              child: Icon(
                n.done ? Icons.check_circle : (n.next ? Icons.flag_outlined : Icons.radio_button_unchecked),
                size: 20,
                color: n.done ? Tokens.doneOnDark : (lit ? Tokens.goldHi : Tokens.onMidnight2),
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Text(
                n.label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: body(14.5, color: lit ? Colors.white : Tokens.onMidnight2, weight: n.cur ? FontWeight.w800 : FontWeight.w600),
              ),
            ),
            Text(n.when, style: body(12.5, color: Tokens.onMidnight2, weight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}

class _PinRow extends StatelessWidget {
  const _PinRow(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
    key: const ValueKey('atlas-pin'),
    padding: EdgeInsets.only(left: 36.w, bottom: 6.h),
    child: Align(
      alignment: Alignment.centerLeft,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
        decoration: BoxDecoration(color: Tokens.navyFillOnDark, borderRadius: BorderRadius.circular(20)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.place_outlined, size: 15, color: Colors.white),
            SizedBox(width: 6.w),
            Flexible(child: Text(text, maxLines: 1, overflow: TextOverflow.ellipsis, style: body(12.5, color: Colors.white, weight: FontWeight.w700))),
          ],
        ),
      ),
    ),
  );
}

/// The next gate: what it asks for, and the days left to it.
class _NextGateCard extends StatelessWidget {
  const _NextGateCard(this.g);
  final NextGate g;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('atlas-next-gate'),
      margin: EdgeInsets.only(bottom: 4.h),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(Tokens.cardRadius),
        gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Colors.white, Tokens.accentWash]),
        border: Border.all(color: Tokens.hairline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'GATE ${g.k} / ${g.of}',
                  style: body(11.5, color: Tokens.goldInk, weight: FontWeight.w800).copyWith(letterSpacing: 0.8),
                ),
              ),
              const Icon(Icons.flag_outlined, size: 17, color: Tokens.ink2),
              SizedBox(width: 4.w),
              Text('${g.daysLeft}', style: body(15, weight: FontWeight.w800)),
            ],
          ),
          SizedBox(height: 4.h),
          Text(g.label, style: display(22, color: Tokens.ink, weight: FontWeight.w600)),
          SizedBox(height: 10.h),
          Wrap(
            spacing: 6.w,
            runSpacing: 6.h,
            children: [
              for (final r in g.reqs)
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 6.h),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Tokens.hairline)),
                  child: Text(r, style: body(12, color: Tokens.ink2, weight: FontWeight.w600)),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
