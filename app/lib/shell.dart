// The four tabs: Home, Learn, Build, Profile, under a floating frosted
// bar (icon + tiny label per tab, a soft pill behind the selected one) with a
// separate round search button beside it.
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'screens/build/build_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/lesson/lesson_screen.dart';
import 'screens/learn/learn_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'state/app_model.dart';
import 'theme/theme.dart';
import 'theme/tokens.dart';
import 'widgets/blocks.dart';
import 'widgets/brickford_field.dart';

class Shell extends StatefulWidget {
  const Shell({super.key});
  @override
  State<Shell> createState() => _ShellState();
}

class _ShellState extends State<Shell> {
  int index = 0;

  /// The tabs built so far. Home is built at once; the others are built when first visited, or by [_warm]
  /// while the reader is still on Home, so startup builds one screen instead of four and a notification
  /// rebuilds only the screens that exist.
  final _built = <int>{0};

  Timer? _warming;

  @override
  void initState() {
    super.initState();
    _warm(1);
  }

  @override
  void dispose() {
    _warming?.cancel();
    super.dispose();
  }

  void _warm(int i) {
    if (i > 3) return;
    _warming = Timer(Duration(milliseconds: i == 1 ? 1500 : 700), () {
      if (!mounted) return;
      if (_built.add(i)) setState(() {});
      _warm(i + 1);
    });
  }

  static const tabs = [
    (Icons.home_outlined, Icons.home_rounded, 'Home'),
    (Icons.school_outlined, Icons.school, 'Learn'),
    (Icons.construction_outlined, Icons.construction, 'Build'),
    (Icons.person_outline, Icons.person, 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.paddingOf(context).bottom;
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: Stack(
        children: [
          Positioned.fill(
            child: IndexedStack(
              index: index,
              children: [
                const HomeScreen(),
                if (_built.contains(1)) const LearnScreen() else const SizedBox.shrink(),
                if (_built.contains(2)) const BuildScreen() else const SizedBox.shrink(),
                if (_built.contains(3)) const ProfileScreen() else const SizedBox.shrink(),
              ],
            ),
          ),
          Positioned(
            left: 16.w,
            right: 16.w,
            bottom: Tokens.barGap + bottom,
            child: Row(
              children: [
                Expanded(
                  child: BrickfordBar(
                    key: const ValueKey('brickford-tabs'),
                    index: index,
                    tabs: tabs,
                    onSelect: (i) => setState(() {
                      _built.add(i);
                      index = i;
                    }),
                  ),
                ),
                SizedBox(width: 10.w),
                FrostButton(
                  key: const ValueKey('brickford-search'),
                  icon: Icons.search,
                  tooltip: 'Search',
                  id: 'search',
                  size: Tokens.barHeight,
                  onPressed: () => showSearchSheet(context),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class BrickfordBar extends StatelessWidget {
  const BrickfordBar({super.key, required this.index, required this.tabs, required this.onSelect});
  final int index;
  final List<(IconData, IconData, String)> tabs;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    // No live blur (a BackdropFilter re-samples and re-blurs everything under it on every frame the sheet
    // scrolls, which is what made the phone lag): the 90% white fill and the hairline carry the frosted
    // look, a small shadow floats it, and the RepaintBoundary paints the bar once and only composites it.
    return RepaintBoundary(
      child: Container(
        height: Tokens.barHeight,
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: Tokens.frost,
          borderRadius: BorderRadius.circular(Tokens.barHeight / 2),
          border: Border.all(color: Tokens.hairline),
          boxShadow: const [BoxShadow(color: Color(0x24000000), blurRadius: 12, offset: Offset(0, 4))],
        ),
        child: Row(
          children: [
            for (var i = 0; i < tabs.length; i++)
              Expanded(
                child: BarTab(
                  key: ValueKey('tab-${tabs[i].$3}'),
                  icon: i == index ? tabs[i].$2 : tabs[i].$1,
                  label: tabs[i].$3,
                  selected: i == index,
                  onTap: () => onSelect(i),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class BarTab extends StatelessWidget {
  const BarTab({super.key, required this.icon, required this.label, required this.selected, required this.onTap});
  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final fg = selected ? Tokens.accent : Tokens.ink2;
    return Semantics(
      identifier: 'tab-$label',
      selected: selected,
      button: true,
      label: label,
      excludeSemantics: true,
      child: Material(
        color: selected ? Tokens.accentWash : Colors.transparent,
        borderRadius: BorderRadius.circular(26),
        child: InkWell(
          borderRadius: BorderRadius.circular(26),
          onTap: onTap,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 22, color: fg),
              const SizedBox(height: 2),
              Text(
                label,
                maxLines: 1,
                style: body(10, color: fg, weight: FontWeight.w700),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// The round search button's sheet: every lecture in the plan, by title or code.
Future<void> showSearchSheet(BuildContext context) {
  final m = AppScope.of(context);
  final all = [
    for (final c in m.data.courses)
      if (((c['units'] as List?) ?? const []).isNotEmpty) ...m.engine.flatLessons(c['id'] as String),
  ];
  final nav = Navigator.of(context);
  var q = '';
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Tokens.sheet,
    showDragHandle: true,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(borderRadius: Tokens.sheetBorderRadius),
    // The sheet shrinks above the keyboard (viewInsets), so the results stay visible
    // instead of sliding under it.
    builder: (sheet) => Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(sheet).bottom),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.9,
        maxChildSize: 0.94,
        builder: (_, scroll) => StatefulBuilder(
          builder: (context, setState) {
            final needle = q.toLowerCase();
            final hits = needle.isEmpty
                ? const []
                : all.where((f) => '${f.code} ${f.l['t']}'.toLowerCase().contains(needle)).take(60).toList();
            return ListView(
              controller: scroll,
              physics: const BouncingScrollPhysics(),
              padding: EdgeInsets.fromLTRB(20.w, 0, 20.w, 28.h),
              children: [
                BrickfordField(
                  key: const ValueKey('search-field'),
                  icon: Icons.search,
                  hint: 'Search',
                  autofocus: true,
                  onChanged: (v) => setState(() => q = v.trim()),
                ),
                SizedBox(height: 14.h),
                for (final f in hits)
                  ItemBlock(
                    leading: LessonGlyph(m.markOf(f.key)),
                    subtitle: f.code,
                    title: '${f.l['t']}',
                    meta: f.l['min'] != null ? "${f.l['min']}m" : null,
                    onTap: () {
                      Navigator.of(sheet).pop();
                      nav.push(
                        MaterialPageRoute(
                          builder: (_) => LessonScreen(cid: f.cid, ui: f.ui, li: f.li),
                        ),
                      );
                    },
                  ),
              ],
            );
          },
        ),
      ),
    ),
  );
}
