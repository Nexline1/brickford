// Library: the Sunday revision PDFs (V.library's "Sunday revision" tiles), one
// per revision week. Each opens revision/week-NN.pdf, which sits at the site
// root beside app-web/, in a new tab; the root service worker serves it.
import 'package:flutter/material.dart';

import '../../engine/record.dart';
import '../../state/app_model.dart';
import '../../state/open_url.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/sheet_scaffold.dart';
import '../calendar/calendar_screen.dart' show shortRange;

/// ../revision/week-NN.pdf from wherever the app is served: /brickford/app-web/ -> /brickford/revision/week-NN.pdf.
String revisionUrl(int n) => Uri.base.resolve('../revision/week-${n.toString().padLeft(2, '0')}.pdf').toString();

void openLibrary(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const LibraryScreen()));

class LibraryScreen extends StatelessWidget {
  const LibraryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final e = AppScope.of(context).engine;
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: Text('Library', key: const ValueKey('library-title'), style: display(34)),
        children: [
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
        ],
      ),
    );
  }
}
