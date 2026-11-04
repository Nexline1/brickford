// Market (stage 1): the real Problems and Exams from the data. NeetCode
// categories with what is solved, the problem sets, and the exams (the
// official diagnostics and the course question banks). Searchable.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';

enum _Tab { problems, psets, exams }

class MarketScreen extends StatefulWidget {
  const MarketScreen({super.key});
  @override
  State<MarketScreen> createState() => _MarketScreenState();
}

class _MarketScreenState extends State<MarketScreen> {
  _Tab tab = _Tab.problems;
  String q = '';

  bool _hit(String s) => q.isEmpty || s.toLowerCase().contains(q.toLowerCase());

  void _detail(BuildContext context, String title, List<Widget> rows) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Tokens.sheet,
      showDragHandle: true,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: Tokens.sheetBorderRadius),
      builder: (_) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.6,
        builder: (_, scroll) => ListView(
          controller: scroll,
          physics: const BouncingScrollPhysics(),
          padding: EdgeInsets.fromLTRB(20.w, 0, 20.w, 28.h),
          children: [Text(title, style: display(20, color: Tokens.ink, weight: FontWeight.w600)), SizedBox(height: 14.h), ...rows],
        ),
      ),
    );
  }

  Widget _line(IconData icon, String text) => Padding(
        padding: EdgeInsets.only(bottom: 10.h),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(icon, size: 18, color: Tokens.quiet),
          SizedBox(width: 10.w),
          Expanded(child: SelectableText(text, style: body(14, height: 1.45))),
        ]),
      );

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final d = m.data;
    final problems = <String, List<String>>{};
    for (final c in d.courses) {
      if (c['tracker'] == true && c['problems'] is Map) {
        (c['problems'] as Map).forEach((cat, list) => problems[cat as String] = (list as List).cast<String>());
      }
    }
    final solvedSet = (m.engine.S['problems'] as Map).entries.where((e) => truthy(e.value)).map((e) => e.key).toSet();
    final totalProblems = problems.values.fold<int>(0, (a, l) => a + l.length);
    final solved = problems.entries.fold<int>(0, (a, e) => a + e.value.where((p) => solvedSet.contains('${e.key}|$p')).length);
    final psetItems = [
      for (final g in d.psets)
        for (final i in (g['items'] as List)) (group: g, item: (i as Map).cast<String, dynamic>()),
    ];
    final psetsDone = psetItems.where((p) => truthy((m.engine.S['psets'] as Map)[p.item['id']])).length;
    final banks = d.quizzes.entries.toList();
    final exams = d.diagnostics.length + banks.length;

    final header = Wrap(spacing: 22.w, runSpacing: 8.h, children: [
      Stat(icon: Icons.code, value: '$solved/$totalProblems', semantic: 'problems solved'),
      Stat(icon: Icons.assignment_outlined, value: '$psetsDone/${psetItems.length}', semantic: 'problem sets done'),
      Stat(icon: Icons.school_outlined, value: '$exams', semantic: 'exams'),
    ]);

    final tabs = Row(children: [
      for (final (t, icon, n) in [
        (_Tab.problems, Icons.code, totalProblems),
        (_Tab.psets, Icons.assignment_outlined, psetItems.length),
        (_Tab.exams, Icons.school_outlined, exams),
      ]) ...[
        Expanded(
          child: PillButton(
            key: ValueKey('market-tab-${t.name}'),
            icon: icon,
            label: '$n',
            tone: tab == t ? PillTone.primary : PillTone.quiet,
            onPressed: () => setState(() => tab = t),
          ),
        ),
        if (t != _Tab.exams) SizedBox(width: 8.w),
      ],
    ]);

    final List<Widget> list = switch (tab) {
      _Tab.problems => [
          for (final e in problems.entries)
            if (_hit(e.key) || e.value.any(_hit))
              ItemBlock(
                leading: const Icon(Icons.code, color: Tokens.quiet),
                title: e.key,
                meta: '${e.value.where((p) => solvedSet.contains('${e.key}|$p')).length}/${e.value.length}',
                onTap: () => _detail(context, e.key, [
                  for (final p in e.value)
                    _line(solvedSet.contains('${e.key}|$p') ? Icons.check_circle : Icons.radio_button_unchecked, p),
                ]),
              ),
        ],
      _Tab.psets => [
          for (final p in psetItems)
            if (_hit('${p.item['label']} ${p.group['course']}'))
              ItemBlock(
                leading: Icon(truthy((m.engine.S['psets'] as Map)[p.item['id']]) ? Icons.check_circle : Icons.assignment_outlined,
                    color: Tokens.quiet),
                subtitle: '${p.group['course']}',
                title: '${p.item['label']}',
                onTap: () => _detail(context, '${p.item['label']}', [
                  _line(Icons.school_outlined, '${p.group['title']}'),
                  _line(Icons.play_circle_outline, _lessonTitle(m, '${p.item['after']}')),
                  _line(Icons.link, '${p.group['url']}'),
                ]),
              ),
        ],
      _Tab.exams => [
          for (final x in d.diagnostics)
            if (_hit('${x['title']} ${x['subject']}'))
              ItemBlock(
                leading: const Icon(Icons.timer_outlined, color: Tokens.quiet),
                subtitle: '${x['subject']}',
                title: '${x['title']}',
                meta: '${x['minutes']}m',
                onTap: () => _detail(context, '${x['title']}', [
                  _line(Icons.timer_outlined, '${x['minutes']} min${x['gate'] != null ? '  ·  ${x['gate']}%' : ''}'),
                  _line(Icons.info_outline, '${x['note']}'),
                  if (x['pdf'] != null) _line(Icons.picture_as_pdf_outlined, '${x['pdf']}'),
                  if (x['solutions'] != null) _line(Icons.fact_check_outlined, '${x['solutions']}'),
                ]),
              ),
          for (final b in banks)
            if (_hit('${(b.value as Map)['title']} ${(b.value as Map)['course']}'))
              ItemBlock(
                leading: const Icon(Icons.quiz_outlined, color: Tokens.quiet),
                subtitle: '${(b.value as Map)['course']}',
                title: '${(b.value as Map)['title']}',
                meta: '${((b.value as Map)['questions'] as List).length}',
                onTap: () => _detail(context, '${(b.value as Map)['title']}', [
                  _line(Icons.quiz_outlined,
                      '${((b.value as Map)['questions'] as List).length} questions  ·  ${(b.value as Map)['perSitting']} per sitting'),
                ]),
              ),
        ],
    };

    return SheetScaffold(
      header: header,
      children: [
        BrickfordField(icon: Icons.search, hint: 'Search', onChanged: (v) => setState(() => q = v.trim())),
        SizedBox(height: 14.h),
        tabs,
        SizedBox(height: 16.h),
        ...list,
      ],
    );
  }

  String _lessonTitle(AppModel m, String k) {
    final p = k.split('.');
    if (p.length != 3) return k;
    final f = m.data.course(p[0]) == null ? const <FlatLesson>[] : m.engine.flatLessons(p[0]);
    for (final x in f) {
      if (x.key == k) return '${x.code} · ${x.l['t']}';
    }
    return k;
  }
}
