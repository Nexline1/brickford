// One lecture: on the midnight canvas a control row (Back, the crest, More), the
// video full-width at 16:9 directly below it, then on the sheet the title, Mark
// watched, and the summary. Opening it records it as the lecture to resume (once: a build is a
// read).
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/crest.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import '../quiz/quiz_screen.dart';
import 'video_embed.dart';

/// Where the lecture's pieces sit, top to bottom, in logical pixels: the control row
/// under the status bar, the video directly below it at 16:9, the sheet from the
/// video's foot. The sheet never starts higher than [floor] (where every other
/// screen's sheet starts), and on a screen so wide that 16:9 would take the page the
/// video stops at half the height and YouTube letterboxes inside it.
class LessonFrame {
  const LessonFrame._(this.rowH, this.videoTop, this.videoH, this.sheetTop);

  /// The control row: [FrostButton]s are 44 high, with [rowTop] (design px) above and [rowGap] below.
  static const rowGap = 8.0;
  static double get rowTop => 12.h;
  static double get rowHeight => rowTop + 44 + rowGap;

  final double rowH, videoTop, videoH, sheetTop;
  double get videoBottom => videoTop + videoH;

  factory LessonFrame.compute({required double safeTop, required Size size, required double rowH, required double floor}) {
    final videoTop = safeTop + rowH;
    final videoH = math.min(size.width * 9 / 16, size.height * 0.5);
    return LessonFrame._(rowH, videoTop, videoH, math.max(floor, videoTop + videoH));
  }
}

/// Summary prose is written as HTML with KaTeX `$...$` for the web app; here
/// it is shown as plain text: tags dropped, entities decoded, and the math
/// inside `$...$` turned into readable Unicode by [tex].
String plain(Object? html) {
  final s = (html ?? '').toString().replaceAll(RegExp(r'<[^>]+>'), '');
  final text = s
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&quot;', '"')
      .replaceAll('&#39;', "'")
      .replaceAll('&nbsp;', ' ')
      .replaceAll('&amp;', '&');
  return text.replaceAllMapped(RegExp(r'\$\$?([^$]*)\$\$?'), (m) => tex(m[1]!)).replaceAll(r'\$', r'$');
}

const _sym = {
  'lambda': 'λ',
  'Lambda': 'Λ',
  'theta': 'θ',
  'pi': 'π',
  'alpha': 'α',
  'beta': 'β',
  'gamma': 'γ',
  'Gamma': 'Γ',
  'delta': 'δ',
  'Delta': 'Δ',
  'epsilon': 'ε',
  'varepsilon': 'ε',
  'sigma': 'σ',
  'Sigma': 'Σ',
  'mu': 'μ',
  'omega': 'ω',
  'Omega': 'Ω',
  'rho': 'ρ',
  'kappa': 'κ',
  'phi': 'φ',
  'varphi': 'φ',
  'Phi': 'Φ',
  'tau': 'τ',
  'eta': 'η',
  'chi': 'χ',
  'ell': 'ℓ',
  'hbar': 'ħ',
  'imath': 'i',
  'jmath': 'j',
  'nabla': '∇',
  'partial': '∂',
  'infty': '∞',
  'times': '×',
  'cdot': '·',
  'approx': '≈',
  'mid': '|',
  'to': '→',
  'mapsto': '↦',
  'leftarrow': '←',
  'Rightarrow': '⇒',
  'leftrightarrow': '↔',
  'lt': '<',
  'gt': '>',
  'le': '≤',
  'ge': '≥',
  'neq': '≠',
  'ne': '≠',
  'll': '≪',
  'gg': '≫',
  'gtrsim': '≳',
  'preceq': '≼',
  'succeq': '≽',
  'sim': '∼',
  'propto': '∝',
  'pm': '±',
  'cdots': '⋯',
  'dots': '…',
  'ldots': '…',
  'in': '∈',
  'cap': '∩',
  'cup': '∪',
  'bigcup': '⋃',
  'subseteq': '⊆',
  'otimes': '⊗',
  'oplus': '⊕',
  'odot': '⊙',
  'circ': '∘',
  'perp': '⊥',
  'varnothing': '∅',
  'div': '÷',
  'langle': '⟨',
  'rangle': '⟩',
  'lceil': '⌈',
  'rceil': '⌉',
  'lfloor': '⌊',
  'rfloor': '⌋',
  'sum': 'Σ',
  'prod': 'Π',
  'int': '∫',
  'iint': '∬',
  'sqrt': '√',
  'bmod': 'mod',
};
const _sup = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  'n': 'ⁿ',
  'T': 'ᵀ',
  'i': 'ⁱ',
  'k': 'ᵏ',
  '*': '*',
};
const _sub = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '₊',
  '-': '₋',
  'i': 'ᵢ',
  'j': 'ⱼ',
  'k': 'ₖ',
  'n': 'ₙ',
  't': 'ₜ',
  'x': 'ₓ',
};

/// KaTeX source as plain Unicode: good enough to read a formula in a
/// sentence (the web app renders it properly; this is the stage 1 reader).
String tex(String src) {
  var s = src;
  String group(String g) => g.length > 1 && !RegExp(r'^[\w.]+$').hasMatch(g) ? '($g)' : g;
  for (var guard = 0; guard < 6; guard++) {
    final before = s;
    s = s.replaceAllMapped(RegExp(r'\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}'), (m) => '${group(m[1]!)}/${group(m[2]!)}');
    s = s.replaceAllMapped(RegExp(r'\\binom\{([^{}]*)\}\{([^{}]*)\}'), (m) => 'C(${m[1]}, ${m[2]})');
    s = s.replaceAllMapped(RegExp(r'\\sqrt\{([^{}]*)\}'), (m) => '√${group(m[1]!)}');
    s = s.replaceAllMapped(
      RegExp(r'\\(?:mathrm|mathbf|mathbb|mathcal|text|operatorname|vec|hat|bar|tilde|dot|ddot|displaystyle)\{([^{}]*)\}'),
      (m) => m[1]!,
    );
    s = s.replaceAllMapped(
      RegExp(r'\^\{([^{}]*)\}'),
      (m) => m[1]!.split('').every(_sup.containsKey) ? m[1]!.split('').map((c) => _sup[c]).join() : '^(${m[1]})',
    );
    s = s.replaceAllMapped(
      RegExp(r'_\{([^{}]*)\}'),
      (m) => m[1]!.split('').every(_sub.containsKey) ? m[1]!.split('').map((c) => _sub[c]).join() : '_(${m[1]})',
    );
    if (s == before) break;
  }
  s = s.replaceAllMapped(RegExp(r'\^([0-9a-zA-Z+\-*])'), (m) => _sup[m[1]] ?? '^${m[1]}');
  s = s.replaceAllMapped(RegExp(r'_([0-9a-zA-Z])'), (m) => _sub[m[1]] ?? '_${m[1]}');
  s = s.replaceAll(RegExp(r'\\(?:left|right|big|Big|displaystyle|begin\{[a-z*]*\}|end\{[a-z*]*\})'), '');
  s = s.replaceAllMapped(RegExp(r'\\([a-zA-Z]+)'), (m) => _sym[m[1]] ?? m[1]!);
  s = s
      .replaceAll(r'\,', ' ')
      .replaceAll(r'\;', ' ')
      .replaceAll(r'\!', '')
      .replaceAll(r'\\', '; ')
      .replaceAll(r'\{', '{')
      .replaceAll(r'\}', '}');
  return s.replaceAll('{', '').replaceAll('}', '').replaceAll('&', ' ');
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
    m.ensureSummaries();
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

  /// The more button: the rest of this unit, as a list sheet.
  void _more(AppModel m, Map<String, dynamic> c, Map<String, dynamic> u) {
    final ls = (u['lessons'] as List).cast<Map>();
    showListSheet(
      context,
      title: '${u['name']}',
      rows: [
        for (var li = 0; li < ls.length; li++)
          Padding(
            padding: EdgeInsets.only(bottom: 12.h),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: SizedBox(
                    width: 72,
                    height: 48,
                    child: VideoThumb(videoId: ls[li]['v'] as String?, code: '${c['code']}'),
                  ),
                ),
                SizedBox(width: 12.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${ls[li]['t']}',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: body(14, weight: FontWeight.w700, height: 1.3),
                      ),
                      if (ls[li]['min'] != null) Text("${ls[li]['min']}m", style: body(12, color: Tokens.ink2)),
                    ],
                  ),
                ),
                SizedBox(width: 8.w),
                LessonGlyph(m.markOf(lessonKey(widget.cid, widget.ui, li)), size: 22),
                SizedBox(width: 8.w),
                li == widget.li
                    ? const SizedBox(
                        width: 72,
                        height: 44,
                        child: Icon(Icons.graphic_eq, color: Tokens.accent, semanticLabel: 'playing'),
                      )
                    : SizedBox(
                        width: 72,
                        child: ElevatedButton(
                          style: PillButton.styleFor(PillTone.dark).copyWith(
                            padding: const WidgetStatePropertyAll(EdgeInsets.zero),
                            minimumSize: const WidgetStatePropertyAll(Size(72, 44)),
                          ),
                          onPressed: () {
                            Navigator.of(context).pop();
                            Navigator.of(context).pushReplacement(
                              MaterialPageRoute(
                                builder: (_) => LessonScreen(cid: widget.cid, ui: widget.ui, li: li),
                              ),
                            );
                          },
                          child: Text('View', style: body(13, color: null, weight: FontWeight.w700)),
                        ),
                      ),
              ],
            ),
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final c = m.data.course(widget.cid);
    final u = _unit(c);
    final l = _lesson(c);
    final k = lessonKey(widget.cid, widget.ui, widget.li);
    if (c == null || u == null || l == null) {
      return Scaffold(
        backgroundColor: Tokens.midnight,
        body: SheetScaffold(onBack: () => Navigator.of(context).maybePop(), children: const []),
      );
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
    final sk = m.engine.sumKey(k);   // T-067: a second-pass lesson reads its first pass's summary
    final sm = m.data.summaries[sk] is Map ? (m.data.summaries[sk] as Map).cast<String, dynamic>() : null;
    final needs = m.engine.needsOf(k), leads = m.engine.leadsTo(k);
    final checks = m.engine.lessonQuiz(k);

    // Top to bottom: the control row, the video at 16:9, the white sheet. Nothing overlaps the
    // video: on the web it is an <iframe> in front of the canvas that takes every touch in its
    // own rectangle, so a Back or More painted over it could be seen but not tapped.
    final mq = MediaQuery.of(context);
    final f = LessonFrame.compute(safeTop: mq.padding.top, size: mq.size, rowH: LessonFrame.rowHeight, floor: Tokens.sheetTop.h);
    final canvas = Stack(
      children: [
        Positioned(
          top: mq.padding.top,
          left: 0,
          right: 0,
          height: f.rowH,
          child: Padding(
            padding: EdgeInsets.fromLTRB(20.w, 12.h, 20.w, LessonFrame.rowGap),
            child: Row(
              children: [
                FrostButton(
                  id: 'lesson-back',
                  icon: Icons.arrow_back_ios_new,
                  tooltip: 'Back',
                  onPressed: () => Navigator.of(context).maybePop(),
                  dark: true,
                ),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Crest(height: 32),
                      SizedBox(width: 10.w),
                      Flexible(
                        child: Text(
                          'BRICKFORD',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: display(17, color: Tokens.onMidnight).copyWith(letterSpacing: 17 * 0.14),
                        ),
                      ),
                    ],
                  ),
                ),
                FrostButton(
                  key: const ValueKey('lesson-more'),
                  id: 'lesson-more',
                  icon: Icons.more_horiz,
                  tooltip: 'More',
                  onPressed: () => _more(m, c, u),
                  dark: true,
                ),
              ],
            ),
          ),
        ),
        Positioned(
          top: f.videoTop,
          left: 0,
          right: 0,
          height: f.videoH,
          child: src != null
              ? VideoEmbed(key: const ValueKey('lesson-video'), src: src, videoId: v, code: '${c['code']}')
              : FallbackTile(key: const ValueKey('lesson-video'), code: '${c['code']}'),
        ),
      ],
    );

    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        canvas: canvas,
        canvasHeight: f.sheetTop,
        sheetTop: f.sheetTop,
        children: [
          Row(
            children: [
              LessonGlyph(mark, size: 20),
              SizedBox(width: 8.w),
              Text(
                '${c['code']}',
                style: body(12, color: Tokens.ink2, weight: FontWeight.w800).copyWith(letterSpacing: 0.8),
              ),
              if (l['min'] != null) ...[
                SizedBox(width: 10.w),
                Text(
                  "${l['min']}m",
                  style: body(12, color: Tokens.ink2, weight: FontWeight.w600),
                ),
              ],
            ],
          ),
          SizedBox(height: 8.h),
          Text(
            l['t']?.toString() ?? '',
            style: display(24, color: Tokens.ink, weight: FontWeight.w700),
          ),
          SizedBox(height: 18.h),
          Semantics(
            identifier: 'lesson-mark',
            child: PillButton(
              key: const ValueKey('lesson-mark'),
              icon: watched ? Icons.check_circle : Icons.visibility_outlined,
              label: watched ? 'Watched' : 'Mark watched',
              tone: watched ? PillTone.quiet : PillTone.primary,
              onPressed: () => m.toggleDone(k),
            ),
          ),
          if (watched && checks != null)
            Padding(
              padding: EdgeInsets.only(top: 10.h),
              child: Semantics(
                identifier: 'lesson-quiz',
                child: PillButton(
                  key: const ValueKey('lesson-quiz'),
                  icon: m.engine.quizPassed(k) ? Icons.verified_outlined : Icons.quiz_outlined,
                  label: 'Quiz',
                  tone: m.engine.quizPassed(k) ? PillTone.quiet : PillTone.primary,
                  onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => QuizScreen.lecture(k))),
                ),
              ),
            ),
          if (link != null) ...[
            SizedBox(height: 14.h),
            ItemBlock(
              leading: const LeadTile(icon: Icons.menu_book_outlined),
              title: link,
            ),
          ],
          if (!m.data.summariesLoaded && m.engine.hasQuiz(k))
            Padding(
              padding: EdgeInsets.only(top: 28.h),
              child: const Center(
                child: SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(key: ValueKey('lesson-summary-loading'), strokeWidth: 2.4, color: Tokens.accent),
                ),
              ),
            ),
          if (sm != null) ...[
            SizedBox(height: 22.h),
            Text(plain(sm['takeaway']), style: body(16, weight: FontWeight.w700, height: 1.4)),
            for (final b in (sm['beats'] as List? ?? const []))
              Padding(
                padding: EdgeInsets.only(top: 14.h),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(plain(b['t']), style: body(14.5, weight: FontWeight.w700, height: 1.35)),
                    SizedBox(height: 4.h),
                    Text(plain(b['d']), style: body(14.5, color: Tokens.ink2, height: 1.5)),
                  ],
                ),
              ),
            if (sm['worked'] != null) ...[SheetLabel(Icons.edit_note, 'Worked'), Text(plain(sm['worked']), style: body(14.5, height: 1.5))],
            if (sm['watch'] != null) ...[
              SheetLabel(Icons.warning_amber_rounded, 'Watch'),
              Text(plain(sm['watch']), style: body(14.5, height: 1.5)),
            ],
          ],
          // T-067: where this lecture sits on the map, as app.js's lesson page has it.
          if (needs.isNotEmpty) ...[
            SheetLabel(Icons.call_split, 'Needs · ${needs.where((n) => truthy(m.lesson(n)['done'])).length} of ${needs.length} watched'),
            for (final n in needs) _mapRow(m, n, tick: true),
          ],
          if (leads.isNotEmpty) ...[
            SheetLabel(Icons.arrow_forward, 'Leads to'),
            for (final n in leads) _mapRow(m, n, tick: false),
          ],
        ],
      ),
    );
  }

  /// One lecture on the map: its title and course, ticked when watched ("Needs"); a tap opens it.
  Widget _mapRow(AppModel m, String key, {required bool tick}) {
    final p = key.split('.');
    final c = m.data.course(p[0]);
    final l = m.engine.lessonAt(key);
    if (c == null || l == null || p.length != 3) return const SizedBox.shrink();
    final done = truthy(m.lesson(key)['done']);
    return Padding(
      padding: EdgeInsets.only(bottom: 8.h),
      child: ItemBlock(
        id: 'lesson-map-$key',
        leading: LeadTile(icon: tick ? (done ? Icons.check : Icons.radio_button_unchecked) : Icons.arrow_forward, fg: tick && done ? Tokens.done : Tokens.ink),
        title: '${l['t']}',
        subtitle: '${c['code']}',
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => LessonScreen(cid: p[0], ui: int.parse(p[1]), li: int.parse(p[2]))),
        ),
      ),
    );
  }
}
