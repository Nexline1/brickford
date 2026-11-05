// A document (V.doc): one of the repo's markdown files, fetched from the site
// root the way the web app does (../README.md, relative to the page, which from
// /brickford/app-web/ is /brickford/README.md) and laid out as a readable page.
// If it cannot be fetched the page says so and offers the file itself.
import 'dart:convert';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:http/http.dart' as http;

import '../../engine/pages.dart';
import '../../state/open_url.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';

/// Fetches a document's text; tests replace it.
typedef DocLoader = Future<String> Function(Uri url);
Future<String> _httpLoad(Uri url) async {
  final r = await http.get(url);
  if (r.statusCode != 200) throw StateError('${r.statusCode}');
  // The bytes as UTF-8, whatever charset the server names (a static host often names none).
  return utf8.decode(r.bodyBytes, allowMalformed: true);
}

DocLoader docLoader = _httpLoad;

/// Where a document is served: its path (`../README.md`) resolved against the page.
Uri docUrl(String file) => Uri.base.resolve(file);

void openDoc(BuildContext context, String id) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => DocScreen(id: id)));

class DocScreen extends StatefulWidget {
  const DocScreen({super.key, required this.id});
  final String id;
  @override
  State<DocScreen> createState() => _DocScreenState();
}

class _DocScreenState extends State<DocScreen> {
  late final doc = libraryDocs.firstWhere((d) => d.id == widget.id);
  List<MdBlock>? blocks;
  bool failed = false;
  final _taps = <TapGestureRecognizer>[];

  @override
  void initState() {
    super.initState();
    docLoader(docUrl(doc.file)).then((t) {
      // The page's own heading carries the title; a document's first h1 repeats it.
      final b = parseMd(t);
      if (b.isNotEmpty && b.first.kind == 'h1') b.removeAt(0);
      if (mounted) setState(() => blocks = b);
    }, onError: (_) {
      if (mounted) setState(() => failed = true);
    });
  }

  @override
  void dispose() {
    for (final t in _taps) {
      t.dispose();
    }
    super.dispose();
  }

  /// app.js md()'s inline: **bold**, *em*, `code`, [text](url).
  List<InlineSpan> _inline(String s, TextStyle base) {
    final out = <InlineSpan>[];
    final re = RegExp(r'\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)');
    var at = 0;
    for (final m in re.allMatches(s)) {
      if (m.start > at) out.add(TextSpan(text: s.substring(at, m.start)));
      // Bold and italic hold more markup (app.js replaces in turn, so code or a link can sit inside them).
      if (m.group(1) != null) {
        out.add(TextSpan(children: _inline(m.group(1)!, base), style: const TextStyle(fontWeight: FontWeight.w800)));
      } else if (m.group(2) != null) {
        out.add(TextSpan(children: _inline(m.group(2)!, base), style: const TextStyle(fontStyle: FontStyle.italic)));
      } else if (m.group(3) != null) {
        out.add(TextSpan(text: m.group(3), style: base.copyWith(fontFamily: 'monospace', backgroundColor: Tokens.fieldFill)));
      } else {
        final href = m.group(5)!;
        final tap = TapGestureRecognizer()..onTap = () => openUrl(docUrl(doc.file).resolve(href).toString());
        _taps.add(tap);
        out.add(TextSpan(text: m.group(4), recognizer: tap, style: const TextStyle(color: Tokens.accent, decoration: TextDecoration.underline)));
      }
      at = m.end;
    }
    if (at < s.length) out.add(TextSpan(text: s.substring(at)));
    return out;
  }

  Widget _block(MdBlock b) {
    Widget text(String s, TextStyle st) => Text.rich(TextSpan(style: st, children: _inline(s, st)));
    switch (b.kind) {
      case 'h1':
        return Padding(padding: EdgeInsets.only(bottom: 10.h), child: text(b.text, display(24, color: Tokens.ink)));
      case 'h2':
        return Padding(padding: EdgeInsets.only(top: 14.h, bottom: 6.h), child: text(b.text, body(17, weight: FontWeight.w800)));
      case 'h3':
        return Padding(padding: EdgeInsets.only(top: 10.h, bottom: 4.h), child: text(b.text, body(15, weight: FontWeight.w800)));
      case 'hr':
        return Padding(padding: EdgeInsets.symmetric(vertical: 10.h), child: const Divider(height: 1, color: Tokens.hairline));
      case 'quote':
        return Container(
          margin: EdgeInsets.symmetric(vertical: 6.h),
          padding: EdgeInsets.only(left: 12.w),
          decoration: const BoxDecoration(border: Border(left: BorderSide(color: Tokens.gold, width: 3))),
          child: text(b.text, body(14, color: Tokens.ink2, height: 1.5)),
        );
      case 'li':
        return Padding(
          padding: EdgeInsets.only(bottom: 6.h),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(padding: EdgeInsets.only(top: 8.h, right: 10.w, left: 4.w), child: Container(width: 5, height: 5, decoration: const BoxDecoration(shape: BoxShape.circle, color: Tokens.quiet))),
              Expanded(child: text(b.text, body(14.5, height: 1.5))),
            ],
          ),
        );
      case 'table':
        return Container(
          margin: EdgeInsets.only(bottom: 6.h),
          padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 8.h),
          decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(12)),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [for (final c in b.cells) Expanded(child: Padding(padding: EdgeInsets.only(right: 6.w), child: text(c, body(12.5, height: 1.4))))],
          ),
        );
      default:
        return Padding(padding: EdgeInsets.only(bottom: 10.h), child: text(b.text, body(14.5, height: 1.55)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final url = docUrl(doc.file);
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: Text(doc.title, key: const ValueKey('doc-title'), maxLines: 3, overflow: TextOverflow.ellipsis, style: display(24)),
        children: [
          if (failed) ...[
            Text('Could not load ${doc.file}', key: const ValueKey('doc-failed'), style: body(14, color: Tokens.missed, weight: FontWeight.w600)),
            SizedBox(height: 12.h),
            PillButton(key: const ValueKey('doc-open-file'), id: 'doc-open-file', label: 'Open the file', icon: Icons.open_in_new_rounded, onPressed: () => openUrl(url.toString())),
          ] else if (blocks == null)
            const SizedBox(key: ValueKey('doc-loading'), height: 44)
          else
            for (final b in blocks!) _block(b),
        ],
      ),
    );
  }
}
