// Workshop (V.workshop's catalogue, "Everything"): this phase's labs, the labs of
// the other phases, and the problem sets by source, each ticked or not. What is
// due now (quizzes owed, psets and labs a cleared lecture unlocked) is the Problems
// page under Learn, from stage 4; a row here opens the same pset and lab sheets.
import 'package:flutter/material.dart';

import '../../engine/engine.dart' show truthy;
import '../../engine/pages.dart';
import '../../state/app_model.dart';
import '../../state/open_url.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../learn/problem_sheets.dart';

void openWorkshop(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const WorkshopScreen()));

class WorkshopScreen extends StatefulWidget {
  const WorkshopScreen({super.key});
  @override
  State<WorkshopScreen> createState() => _WorkshopScreenState();
}

class _WorkshopScreenState extends State<WorkshopScreen> {
  bool _later = false;

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context), e = m.engine, w = e.workshop();
    final labs = e.S['labs'] as Map, psets = e.S['psets'] as Map;
    bool labDone(Map<String, dynamic> l) => truthy((labs[l['id']] is Map ? labs[l['id']] as Map : const {})['done']);
    Widget labRow(Map<String, dynamic> l) => ItemBlock(
      key: ValueKey('workshop-lab-${l['id']}'),
      id: 'workshop-lab-${l['id']}',
      leading: labDone(l) ? const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white) : const LeadTile(icon: Icons.build_outlined),
      title: '${l['title']}',
      subtitle: firstClause('${l['req']}'),
      subtitleLines: 2,
      meta: '~${l['hours']} h',
      onTap: () => showLabSheet(context, l),
    );
    final total = w.psetTotal + m.data.labs.length, done = w.psetDone + w.labsDone;
    final laterN = w.later.fold<int>(0, (a, x) => a + x.$2.length);
    final header = BigCount(icon: Icons.construction, semantic: 'labs and problem sets done', value: '$done', total: '$total', valueKey: const ValueKey('workshop-done'));
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          SheetLabel(Icons.build_outlined, phaseNames[w.phase]),
          for (final l in w.phaseLabs) labRow(l),
          if (w.later.isNotEmpty) ...[
            ItemBlock(
              key: const ValueKey('workshop-later'),
              id: 'workshop-later',
              leading: LeadTile(icon: _later ? Icons.expand_less_rounded : Icons.expand_more_rounded),
              title: 'Labs in the other phases',
              meta: '$laterN',
              onTap: () => setState(() => _later = !_later),
            ),
            if (_later)
              for (final (ph, ls) in w.later) ...[SheetLabel(Icons.build_outlined, phaseNames[ph]), for (final l in ls) labRow(l)],
          ],
          SheetLabel(Icons.assignment_outlined, 'Problem sets'),
          for (final g in w.groups) ...[
            ItemBlock(
              key: ValueKey('workshop-group-${g.title}'),
              leading: const LeadTile(icon: Icons.open_in_new_rounded),
              title: g.title,
              meta: '${g.items.where((i) => truthy(psets[i['id']])).length}/${g.items.length}',
              onTap: () => openUrl(g.url),
            ),
            for (final i in g.items)
              ItemBlock(
                key: ValueKey('workshop-pset-${i['id']}'),
                id: 'workshop-pset-${i['id']}',
                leading: truthy(psets[i['id']]) ? const LeadTile(icon: Icons.check_rounded, color: Tokens.done, fg: Colors.white) : const LeadTile(icon: Icons.assignment_outlined),
                title: '${i['label']}',
                onTap: () => showPsetSheet(context, {...i, 'course': _course(m, g), 'url': g.url}),
              ),
          ],
        ],
      ),
    );
  }

  String _course(AppModel m, WorkshopGroup g) {
    for (final x in m.data.psets) {
      if ('${x['title']}' == g.title) return '${x['course']}';
    }
    return '';
  }
}
