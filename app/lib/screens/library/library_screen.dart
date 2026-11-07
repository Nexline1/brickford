// Library (V.library): Start here (the Handbook, the Method, the Calibration Kit),
// the Guides (the other documents, each opening as a readable page), the Sunday
// revision PDFs and the outside links (five, then +N).
// The revision tiles are one per revision week. Each opens revision/week-NN.pdf, which sits at the site
// root beside app-web/, in a new tab; the root service worker serves it.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/pages.dart';
import '../../engine/record.dart';
import '../../state/app_model.dart';
import '../../state/open_url.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../calendar/calendar_screen.dart' show shortRange;
import '../profile/guide_screen.dart';
import '../profile/method_screen.dart';
import 'doc_screen.dart';

/// ../revision/week-NN.pdf from wherever the app is served: /brickford/app-web/ -> /brickford/revision/week-NN.pdf.
String revisionUrl(int n) => Uri.base.resolve('../revision/week-${n.toString().padLeft(2, '0')}.pdf').toString();

void openLibrary(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const LibraryScreen()));

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});
  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  bool _more = false;

  @override
  Widget build(BuildContext context) {
    final e = AppScope.of(context).engine;
    final kit = libraryDocs.first, guides = libraryDocs.skip(1).toList();
    final links = _more ? libraryLinks : libraryLinks.take(5).toList();
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: Text('Library', key: const ValueKey('library-title'), style: display(34)),
        children: [
          const SheetLabel(Icons.auto_stories_outlined, 'Start here'),
          ItemBlock(key: const ValueKey('lib-guide'), id: 'lib-guide', leading: const LeadTile(icon: Icons.menu_book_outlined), title: 'The Handbook', subtitle: 'How Brickford works, end to end', onTap: () => openGuide(context)),
          ItemBlock(key: const ValueKey('lib-method'), id: 'lib-method', leading: const LeadTile(icon: Icons.psychology_alt_outlined), title: 'The Method', subtitle: 'Why mastery beats coverage', onTap: () => openMethod(context)),
          ItemBlock(key: ValueKey('doc-${kit.id}'), id: 'doc-${kit.id}', leading: const LeadTile(icon: Icons.article_outlined), title: kit.card, subtitle: kit.cardSub, onTap: () => openDoc(context, kit.id)),
          const SheetLabel(Icons.description_outlined, 'Guides'),
          for (final d in guides) ItemBlock(key: ValueKey('doc-${d.id}'), id: 'doc-${d.id}', leading: const LeadTile(icon: Icons.article_outlined), title: d.card, subtitle: d.cardSub, onTap: () => openDoc(context, d.id)),
          const SheetLabel(Icons.menu_book_outlined, 'Sunday revision'),
          for (var n = 1; n <= RecordEngine.revisionPdfs; n++)
            () {
              final rw = e.revisionWeek(n);
              return ItemBlock(
                key: ValueKey('revision-$n'),
                id: 'revision-$n',
                leading: LeadTile(text: 'W$n', color: Colors.white),
                title: 'Week $n',
                subtitle: shortRange(rw.from, rw.to),
                meta: '${e.revisionLectures(n)} lectures',
                onTap: () => openUrl(revisionUrl(n)),
              );
            }(),
          const SheetLabel(Icons.open_in_new_rounded, 'Outside links'),
          Wrap(
            spacing: 8.w,
            runSpacing: 8.h,
            children: [
              for (final (i, l) in links.indexed)
                BrickChip(key: ValueKey('link-$i'), label: l.$1, icon: Icons.north_east_rounded, selected: false, onTap: () => openUrl(l.$2)),
              if (!_more && libraryLinks.length > 5) BrickChip(key: const ValueKey('link-more'), label: '+${libraryLinks.length - 5}', selected: false, onTap: () => setState(() => _more = true)),
            ],
          ),
        ],
      ),
    );
  }
}
