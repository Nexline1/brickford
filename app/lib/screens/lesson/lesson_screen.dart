// One lecture: the video, Mark watched, and the summary. Opening it records
// it as the lecture to resume (once, in initState: a build is a read).
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import 'video_embed.dart';

/// Summary prose is written as HTML with KaTeX `$...$` for the web app; here
/// it is shown as plain text: tags dropped, entities decoded, `$` removed.
String plain(Object? html) {
  final s = (html ?? '').toString().replaceAll(RegExp(r'<[^>]+>'), '').replaceAll(r'$', '');
  return s
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&quot;', '"')
      .replaceAll('&#39;', "'")
      .replaceAll('&nbsp;', ' ')
      .replaceAll('&amp;', '&');
}

class LessonScreen extends StatefulWidget {
  const LessonScreen({super.key, required this.cid, required this.ui, required this.li});
  final String cid;
  final int ui, li;

  @override
  State<LessonScreen> createState() => _LessonScreenState();
}

class _LessonScreenState extends State<LessonScreen> {
  bool _recorded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_recorded) return;
    _recorded = true;
    final m = AppScope.of(context);
    final c = m.data.course(widget.cid);
    final l = _lesson(c);
    if (c != null && l != null) m.openedLesson(widget.cid, widget.ui, widget.li, '${c['code']} · ${l['t']}');
  }

  Map<String, dynamic>? _unit(Map<String, dynamic>? c) {
    final units = (c?['units'] as List?) ?? const [];
    return widget.ui < units.length ? (units[widget.ui] as Map).cast<String, dynamic>() : null;
  }

  Map<String, dynamic>? _lesson(Map<String, dynamic>? c) {
    final ls = (_unit(c)?['lessons'] as List?) ?? const [];
    return widget.li < ls.length ? (ls[widget.li] as Map).cast<String, dynamic>() : null;
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final c = m.data.course(widget.cid);
    final u = _unit(c);
    final l = _lesson(c);
    final k = lessonKey(widget.cid, widget.ui, widget.li);
    if (c == null || u == null || l == null) {
      return SheetScaffold(onBack: () => Navigator.of(context).maybePop(), children: const []);
    }
    final v = l['v'] as String?;
    final playlist = u['playlist'] as String?;
    final src = v != null
        ? 'https://www.youtube.com/embed/$v${playlist != null ? '?list=$playlist' : ''}'
        : playlist != null
            ? 'https://www.youtube.com/embed/videoseries?list=$playlist'
            : null;
    final link = (l['read'] ?? l['paper'])?.toString();
    final mark = m.markOf(k);
    final watched = truthy(m.lesson(k)['done']);
    final sm = m.data.summaries[k] is Map ? (m.data.summaries[k] as Map).cast<String, dynamic>() : null;
    final checks = m.engine.lessonQuiz(k);

    final header = Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        LessonGlyph(mark, size: 20),
        SizedBox(width: 8.w),
        Text('${c['code']}', style: body(12, color: Tokens.onMidnight2, weight: FontWeight.w700)),
        if (l['min'] != null) ...[
          SizedBox(width: 10.w),
          Text("${l['min']}m", style: body(12, color: Tokens.onMidnight2, weight: FontWeight.w600)),
        ],
      ]),
      SizedBox(height: 6.h),
      Text(l['t']?.toString() ?? '', maxLines: 3, overflow: TextOverflow.ellipsis, style: display(20, weight: FontWeight.w600)),
    ]);

    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          if (src != null) VideoEmbed(src: src, videoId: v),
          if (link != null) ItemBlock(leading: const Icon(Icons.menu_book_outlined, color: Tokens.quiet), title: link),
          SizedBox(height: 16.h),
          PillButton(
            key: const ValueKey('lesson-mark'),
            icon: watched ? Icons.check_circle : Icons.visibility_outlined,
            label: watched ? 'Watched' : 'Mark watched',
            tone: watched ? PillTone.done : PillTone.primary,
            onPressed: () => m.toggleDone(k),
          ),
          if (mark == LessonMark.watched && checks != null)
            Padding(
              padding: EdgeInsets.only(top: 10.h),
              child: Row(children: [
                const Icon(Icons.quiz_outlined, size: 18, color: Tokens.half),
                SizedBox(width: 6.w),
                Text('${checks.length}', style: body(14, color: Tokens.half, weight: FontWeight.w700)),
              ]),
            ),
          if (sm != null) ...[
            SizedBox(height: 22.h),
            Text(plain(sm['takeaway']), style: body(16, weight: FontWeight.w700, height: 1.4)),
            for (final b in (sm['beats'] as List? ?? const []))
              Padding(
                padding: EdgeInsets.only(top: 14.h),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(plain(b['t']), style: body(14.5, weight: FontWeight.w700, height: 1.35)),
                  SizedBox(height: 4.h),
                  Text(plain(b['d']), style: body(14.5, color: Tokens.ink2, height: 1.5)),
                ]),
              ),
            if (sm['worked'] != null) ...[
              SheetLabel(Icons.edit_note, 'Worked'),
              Text(plain(sm['worked']), style: body(14.5, height: 1.5)),
            ],
            if (sm['watch'] != null) ...[
              SheetLabel(Icons.warning_amber_rounded, 'Watch'),
              Text(plain(sm['watch']), style: body(14.5, height: 1.5)),
            ],
          ],
        ],
      ),
    );
  }
}
