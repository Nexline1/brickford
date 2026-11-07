// Practice (V.practice): the week as six dots, the recorder, the hand forms, the
// recordings kept on this device, and what has been logged. Under Build.
//
// PORTED, NOT REDESIGNED: the page's rules are app.js's (engine/practice.dart);
// the recorder is state/recorder.dart. Barely any words: the prompt, the button.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/engine.dart';
import '../../engine/practice.dart';
import '../../state/app_model.dart';
import '../../state/recorder.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/record_widgets.dart';
import '../../widgets/sheet_scaffold.dart';

void openPractice(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const PracticeScreen()));

/// The dashboard's row (app.js: the first rep owed, linking to Practice); null when nothing is owed.
Widget? practiceRow(BuildContext context, AppModel m) {
  final due = m.engine.repsDue();
  if (due.isEmpty) return null;
  return ItemBlock(
    key: const ValueKey('practice-row'),
    id: 'practice-row',
    leading: const LeadTile(icon: Icons.mic_none_rounded),
    title: due.first.label,
    subtitle: due.first.hint,
    onTap: () => openPractice(context),
  );
}

class PracticeScreen extends StatefulWidget {
  const PracticeScreen({super.key});
  @override
  State<PracticeScreen> createState() => _PracticeScreenState();
}

class _PracticeScreenState extends State<PracticeScreen> {
  static const _ids = ['bankWhat', 'bankWhy', 'repSecs', 'repTakes', 'repWhich', 'joke0', 'joke1', 'joke2', 'joke3', 'joke4', 'jokeKeep', 'revNotes'];
  final _c = {for (final i in _ids) i: TextEditingController()};
  late final AppModel _m;
  String? _tab;
  bool _wired = false, _logOpen = false, _writeOpen = false;
  List<StoredClip>? _clips;
  bool _clipsFailed = false;
  ClipPlayer? _player;
  String? _playing;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_wired) return;
    _wired = true;
    _m = AppScope.of(context);
    _m.practiceNote = null;
    _m.practiceForm = () => {for (final e in _c.entries) e.key: e.value.text};
    _loadClips();
  }

  @override
  void dispose() {
    // Leaving the page stops the recording (and keeps it); the microphone is not left open behind another page.
    if (_m.recorder.phase != RecPhase.idle) _m.recorder.stop();
    _m.practiceForm = () => const {};
    _player?.dispose();
    _m.audio.releaseUrls();
    for (final c in _c.values) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _loadClips() async {
    if (!_m.audio.storeSupported) return;
    try {
      final l = await _m.audio.list();
      if (mounted) setState(() => _clips = l);
    } catch (_) {
      if (mounted) setState(() => _clipsFailed = true);
    }
  }

  String _text(String id) => _c[id]!.text;

  void _log(String act, List<String> fields) {
    final r = _m.logRep(act, {for (final f in fields) f: _text(f)});
    if (r.ok) {
      for (final f in fields) {
        _c[f]!.clear();
      }
    }
    toast(context, r.msg);
  }

  void _pick(String tab) {
    if (_m.recorder.phase != RecPhase.idle) _m.recorder.stop();
    setState(() => _tab = tab);
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final e = m.engine;
    final note = m.practiceNote;
    if (note != null) {
      m.practiceNote = null;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        toast(context, note);
        _loadClips();
      });
    }
    final tab = _tab ?? e.practiceDefault();
    final week = e.weekDots();
    final rest = e.practiceResting;
    final rev = e.repsDue().where((d) => d.kind == 'review').firstOrNull;
    final log = e.repLog();
    final header = Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: week == null
              ? Align(alignment: Alignment.centerLeft, child: Icon(rest ? Icons.bedtime_outlined : Icons.mic_none_rounded, size: 44, color: Tokens.gold, semanticLabel: rest ? 'rest day' : 'practice'))
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    BigCount(icon: Icons.mic_none_rounded, semantic: 'days logged this week', value: '${week.logged}', total: '${Engine.STUDY_WEEK}', valueKey: const ValueKey('practice-week')),
                    SizedBox(height: 12.h),
                    _Dots(week.dots),
                  ],
                ),
        ),
      ],
    );
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: header,
        children: [
          ChipRow(
            children: [
              for (final (k, label) in repTabs)
                Semantics(
                  identifier: 'practice-tab-$k',
                  child: BrickChip(
                    key: ValueKey('practice-tab-$k'),
                    label: label,
                    icon: switch (k) {
                      'story' => Icons.mic_none_rounded,
                      'humor' => Icons.theater_comedy_outlined,
                      _ => Icons.edit_note_rounded,
                    },
                    selected: tab == k,
                    onTap: () => _pick(k),
                  ),
                ),
            ],
          ),
          SizedBox(height: 14.h),
          if (rest)
            const ItemBlock(key: ValueKey('practice-rest'), id: 'practice-rest', leading: LeadTile(icon: Icons.bedtime_outlined), title: 'Saturday', subtitle: 'Nothing owed today.'),
          if (rev != null) ...[
            ItemBlock(key: const ValueKey('practice-review'), id: 'practice-review', leading: const LeadTile(icon: Icons.history_edu_outlined), title: rev.label, subtitle: rev.hint),
            BrickfordField(id: 'field-revNotes', icon: Icons.edit_note_rounded, hint: 'What the recording shows', controller: _c['revNotes'], minLines: 3, maxLines: 5),
            SizedBox(height: 10.h),
            PillButton(key: const ValueKey('practice-log-review'), id: 'practice-log-review', label: 'Log the review', icon: Icons.check_rounded, onPressed: () => _log('repReview', const ['revNotes'])),
            SizedBox(height: 14.h),
          ],
          _pane(m, tab, rest),
          SheetLabel(Icons.mic_none_rounded, 'Recordings'),
          _clipList(m),
          if (log.history.isNotEmpty || log.counts.isNotEmpty) ...[
            SizedBox(height: 4.h),
            ItemBlock(
              key: const ValueKey('practice-log'),
              id: 'practice-log',
              leading: const LeadTile(icon: Icons.history),
              title: 'Logged so far',
              meta: '${log.history.length}',
              onTap: () => setState(() => _logOpen = !_logOpen),
            ),
            if (_logOpen) ...[
              for (final c in log.counts) ItemBlock(key: ValueKey('practice-count-${c[0]}'), title: c[0], subtitle: c[1], meta: c[2]),
              for (var i = 0; i < log.history.length; i++)
                ItemBlock(key: ValueKey('practice-hist-$i'), title: log.history[i][1], subtitle: log.history[i][2].isEmpty ? null : log.history[i][2], meta: log.history[i][0]),
            ],
          ],
        ],
      ),
    );
  }

  // ---- the pane: a recorder card, or the hand form ----

  Widget _pane(AppModel m, String tab, bool rest) {
    return ListenableBuilder(
      listenable: m.recorder,
      builder: (context, _) {
        final r = m.recorder;
        final hand = r.hand;
        if (tab == 'bank') {
          return _hand('What happened today', 'One real thing, two lines.', rest, [
            _field('bankWhat', Icons.edit_outlined, 'What happened'),
            _field('bankWhy', Icons.lightbulb_outline_rounded, 'Why it stuck'),
          ], 'repBank', const ['bankWhat', 'bankWhy'], 'Log it');
        }
        final humor = tab == 'humor';
        final prompt = humor ? 'Five attempts at one joke' : 'Tell one story from this week';
        final hint = humor ? 'Most will be bad. Volume is the mechanic.' : 'Under 90 seconds. Beginning, turn, ending.';
        final fields = humor
            ? [for (var i = 0; i < 5; i++) _field('joke$i', Icons.mic_none_rounded, 'Attempt ${i + 1}'), _field('jokeKeep', Icons.star_outline_rounded, 'Keeper (1–5, blank for none)', number: true)]
            : [_field('repSecs', Icons.timer_outlined, 'Seconds', number: true), _field('repTakes', Icons.replay_rounded, 'Takes', number: true), _field('repWhich', Icons.menu_book_outlined, 'Which entry')];
        final act = humor ? 'repHumor' : 'repStory';
        final names = humor ? ['joke0', 'joke1', 'joke2', 'joke3', 'joke4', 'jokeKeep'] : ['repSecs', 'repTakes', 'repWhich'];
        final verb = humor ? 'Log five' : 'Log the rep';
        if (hand) {
          return _hand(prompt, hint, rest, fields, act, names, verb, nomic: true);
        }
        return Column(
          children: [
            _RecorderCard(key: ValueKey('practice-card-$tab'), kind: tab, prompt: prompt, hint: hint, recorder: r),
            if (humor && !rest) ...[
              SizedBox(height: 10.h),
              ItemBlock(
                key: const ValueKey('practice-write'),
                id: 'practice-write',
                leading: const LeadTile(icon: Icons.edit_outlined),
                title: 'Write the five down instead',
                onTap: () => setState(() => _writeOpen = !_writeOpen),
              ),
              if (_writeOpen) ..._form(fields, act, names, verb),
            ],
            SizedBox(height: 6.h),
          ],
        );
      },
    );
  }

  Widget _field(String id, IconData icon, String hint, {bool number = false}) => Padding(
    padding: EdgeInsets.only(bottom: 10.h),
    child: BrickfordField(id: 'field-$id', icon: icon, hint: hint, controller: _c[id], keyboardType: number ? TextInputType.number : null),
  );

  List<Widget> _form(List<Widget> fields, String act, List<String> names, String verb) => [
    ...fields,
    PillButton(key: ValueKey('practice-log-$act'), id: 'practice-log-$act', label: verb, icon: Icons.check_rounded, onPressed: () => _log(act, names)),
  ];

  /// A hand form: the prompt, the "no microphone" line when that is why, and the fields (not on a rest day, which owes nothing).
  Widget _hand(String prompt, String hint, bool rest, List<Widget> fields, String act, List<String> names, String verb, {bool nomic = false}) {
    return Container(
      key: ValueKey('practice-hand-$act'),
      margin: EdgeInsets.only(bottom: 6.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(prompt, style: body(16, weight: FontWeight.w800)),
          SizedBox(height: 4.h),
          Text(hint, style: body(13, color: Tokens.ink2)),
          if (nomic) ...[
            SizedBox(height: 8.h),
            Row(
              children: [
                const Icon(Icons.mic_off_outlined, size: 18, color: Tokens.quiet),
                SizedBox(width: 8.w),
                Expanded(child: Text('Microphone not available, so log it by hand', key: const ValueKey('practice-nomic'), style: body(13, color: Tokens.ink2, weight: FontWeight.w600))),
              ],
            ),
          ],
          SizedBox(height: 12.h),
          if (rest)
            Text('Nothing owed today.', style: body(13, color: Tokens.ink2))
          else
            ..._form(fields, act, names, verb),
        ],
      ),
    );
  }

  // ---- the recordings ----

  Widget _clipList(AppModel m) {
    if (!m.audio.storeSupported || _clipsFailed) {
      return Padding(padding: EdgeInsets.only(bottom: 8.h), child: Text('This browser cannot keep recordings.', key: const ValueKey('practice-nostore'), style: body(13, color: Tokens.ink2)));
    }
    final clips = _clips;
    if (clips == null) return const SizedBox(height: 44, key: ValueKey('practice-loading'));
    if (clips.isEmpty) {
      return Padding(padding: EdgeInsets.only(bottom: 8.h), child: Text(m.recorder.hand ? 'Nothing recorded yet.' : 'Nothing recorded yet. Press the red button and talk.', key: const ValueKey('practice-empty'), style: body(13, color: Tokens.ink2)));
    }
    return Column(children: [for (final c in clips) _ClipRow(key: ValueKey('clip-${c.key}'), clip: c, playing: _playing == c.key && (_player?.playing ?? false), onPlay: () => _play(m, c), onRename: () => _rename(m, c), onDelete: () => _delete(m, c))]);
  }

  Future<void> _play(AppModel m, StoredClip c) async {
    if (c.url == null) return;
    if (_playing != c.key) {
      _player?.dispose();
      _player = m.audio.player(c, () {
        if (mounted) setState(() {});
      });
      _playing = c.key;
    }
    await _player!.toggle();
  }

  Future<void> _rename(AppModel m, StoredClip c) async {
    final ctl = TextEditingController(text: c.title);
    final v = await showDialog<String>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: Colors.white,
        title: Text('Title', style: body(17, weight: FontWeight.w700)),
        content: BrickfordField(id: 'field-clip-title', icon: Icons.edit_outlined, controller: ctl, autofocus: true, onSubmitted: (s) => Navigator.pop(context, s)),
        actions: [
          TextButton(key: const ValueKey('clip-rename-cancel'), onPressed: () => Navigator.pop(context), child: Text('Cancel', style: body(14, weight: FontWeight.w700))),
          TextButton(key: const ValueKey('clip-rename-ok'), onPressed: () => Navigator.pop(context, ctl.text), child: Text('Save', style: body(14, color: Tokens.accent, weight: FontWeight.w700))),
        ],
      ),
    );
    ctl.dispose();
    final t = v?.trim() ?? '';
    if (t.isEmpty || t == c.title) return;
    try {
      await m.audio.rename(c.key, t);
      if (mounted) setState(() => _clips = [for (final x in _clips ?? const <StoredClip>[]) x.key == c.key ? x.withTitle(t) : x]);
    } catch (_) {
      if (mounted) toast(context, 'Could not rename it.');
    }
  }

  Future<void> _delete(AppModel m, StoredClip c) async {
    final yes = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: Colors.white,
        title: Text('Delete “${c.title}”?', style: body(17, weight: FontWeight.w700)),
        content: Text('It is kept only on this device, so it cannot be brought back. The rep stays logged.', style: body(14, color: Tokens.ink2, height: 1.4)),
        actions: [
          TextButton(key: const ValueKey('clip-delete-cancel'), onPressed: () => Navigator.pop(context, false), child: Text('Cancel', style: body(14, weight: FontWeight.w700))),
          TextButton(key: const ValueKey('clip-delete-ok'), onPressed: () => Navigator.pop(context, true), child: Text('Delete', style: body(14, color: Tokens.missed, weight: FontWeight.w700))),
        ],
      ),
    );
    if (yes != true) return;
    if (_playing == c.key) {
      _player?.dispose();
      _player = null;
      _playing = null;
    }
    try {
      await m.audio.delete(c.key);
      await _loadClips();
    } catch (_) {
      if (mounted) toast(context, 'Could not delete it.');
    }
  }
}

class _Dots extends StatelessWidget {
  const _Dots(this.dots);
  final List<WeekDot> dots;

  @override
  Widget build(BuildContext context) {
    final on = dots.where((d) => d.on).length;
    return Semantics(
      label: '$on of ${dots.length} days logged this week',
      child: Row(
        key: const ValueKey('practice-dots'),
        children: [
          for (final d in dots)
            Container(
              key: ValueKey('dot-${d.iso}'),
              width: 16,
              height: 16,
              margin: EdgeInsets.only(right: 10.w),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: d.on ? Tokens.gold : Colors.transparent,
                border: Border.all(color: d.on ? Tokens.gold : (d.now ? Tokens.goldHi : Tokens.onMidnight2.withValues(alpha: d.ahead ? 0.7 : 0.35)), width: d.now ? 2.5 : 1.5),
              ),
            ),
        ],
      ),
    );
  }
}

/// The dark recorder card: the prompt, the round record button, the timer.
class _RecorderCard extends StatelessWidget {
  const _RecorderCard({super.key, required this.kind, required this.prompt, required this.hint, required this.recorder});
  final String kind, prompt, hint;
  final PracticeRecorder recorder;

  @override
  Widget build(BuildContext context) {
    final mode = recorder.modeOf(kind);
    final rec = mode == RecPhase.recording, wait = mode == RecPhase.starting;
    final time = wait ? 'Starting…' : '${clockLabel(rec ? recorder.seconds.floor() : 0)} / ${clockLabel(recorder.limit)}';
    final label = rec ? 'Stop recording' : (wait ? 'Starting the microphone — press to cancel' : 'Start recording');
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(18.w, 18.h, 18.w, 16.h),
      decoration: BoxDecoration(color: Tokens.card, borderRadius: BorderRadius.circular(Tokens.cardRadius)),
      child: Column(
        children: [
          Text(prompt, textAlign: TextAlign.center, style: body(16, color: Colors.white, weight: FontWeight.w800)),
          SizedBox(height: 4.h),
          Text(hint, textAlign: TextAlign.center, style: body(13, color: Tokens.onMidnight2)),
          SizedBox(height: 14.h),
          Semantics(
            identifier: 'practice-rec',
            button: true,
            toggled: rec,
            label: label,
            excludeSemantics: true,
            child: GestureDetector(
              key: const ValueKey('practice-rec'),
              behavior: HitTestBehavior.opaque,
              onTap: () => recorder.toggle(kind),
              child: SizedBox(
                width: 88,
                height: 88,
                child: Center(
                  child: Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 3)),
                    alignment: Alignment.center,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 160),
                      width: rec ? 26 : 54,
                      height: rec ? 26 : 54,
                      decoration: BoxDecoration(color: wait ? Tokens.onMidnight2 : Tokens.rec, borderRadius: BorderRadius.circular(rec ? 6 : 27)),
                    ),
                  ),
                ),
              ),
            ),
          ),
          SizedBox(height: 8.h),
          Text(time, key: const ValueKey('practice-time'), style: body(15, color: Colors.white, weight: FontWeight.w700).copyWith(fontFeatures: const [FontFeature.tabularFigures()])),
        ],
      ),
    );
  }
}

/// One recording: play, its title (tap to rename), its day and length, download, delete.
class _ClipRow extends StatelessWidget {
  const _ClipRow({super.key, required this.clip, required this.playing, required this.onPlay, required this.onRename, required this.onDelete});
  final StoredClip clip;
  final bool playing;
  final VoidCallback onPlay, onRename, onDelete;

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    return Padding(
      padding: EdgeInsets.only(bottom: 10.h),
      child: Material(
        color: Tokens.fieldFill,
        borderRadius: BorderRadius.circular(Tokens.radius),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 6.h),
          child: Row(
            children: [
              StepButton(icon: playing ? Icons.pause_rounded : Icons.play_arrow_rounded, tooltip: playing ? 'Pause ${clip.title}' : 'Play ${clip.title}', id: 'clip-play-${clip.key}', onPressed: onPlay),
              SizedBox(width: 8.w),
              Expanded(
                child: InkWell(
                  onTap: onRename,
                  borderRadius: BorderRadius.circular(8),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(minHeight: 44),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(clip.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: body(14.5, weight: FontWeight.w700)),
                        Text('${recDay(clip.date)} · ${clockLabel(clip.seconds)}', style: body(12, color: Tokens.ink2, weight: FontWeight.w500)),
                      ],
                    ),
                  ),
                ),
              ),
              if (clip.url != null) StepButton(icon: Icons.file_download_outlined, tooltip: 'Download ${clip.title}', id: 'clip-save-${clip.key}', onPressed: () => m.audio.download(clip)),
              StepButton(icon: Icons.delete_outline_rounded, tooltip: 'Delete ${clip.title}', id: 'clip-delete-${clip.key}', onPressed: onDelete),
            ],
          ),
        ),
      ),
    );
  }
}
