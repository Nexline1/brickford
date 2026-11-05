// Practice (T-064 stage 6b): app.js's practice layer - repsDue, weekOf, the
// four rep forms and their refusals (the data-act handlers behind V.practice),
// the recorder's "a recorded rep is the same record as a typed one" (recSaved),
// and the lists V.practice draws (the week's six dots, the counts, the history).
//
// PORTED, NOT REDESIGNED: every refusal text, every threshold and every field
// is app.js's. The pure rules live here so tools/verify-app.js can run them
// against app.js with the same fixtures; the microphone is state/recorder.dart.
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dates.dart';
import 'engine.dart';
import 'record.dart';

/// The story rep's cap, and the shortest recording that counts as a rep (seconds).
const REC_LIMIT = 90;
const REC_MIN = 1;

/// app.js clockLabel: m:ss, or h:mm:ss.
String clockLabel(num sec) {
  final s0 = jsRound(sec < 0 ? 0 : sec).toInt();
  final h = s0 ~/ 3600, m = (s0 % 3600) ~/ 60, s = s0 % 60;
  return '${h > 0 ? '$h:${m.toString().padLeft(2, '0')}' : '$m'}:${s.toString().padLeft(2, '0')}';
}

const _dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const _mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/// app.js recDay: "Tue 20 Oct".
String recDay(String iso) {
  final d = DateTime.utc(int.parse(iso.substring(0, 4)), int.parse(iso.substring(5, 7)), int.parse(iso.substring(8, 10)));
  return '${_dow[d.weekday % 7]} ${d.day} ${_mon[d.month - 1]}';
}

/// What a rep kind is called (REP_VERB / PR_TABS / the counts' titles).
const repTabs = [('story', 'Story'), ('humor', 'Humour'), ('bank', 'Story bank')];

class RepDue {
  const RepDue(this.kind, this.label, this.hint);
  final String kind, label, hint;
}

class RepResult {
  const RepResult(this.ok, this.msg);

  /// A rep was logged (and the caller saves).
  final bool ok;

  /// The toast: why it was refused, or what was logged.
  final String msg;
}

/// One of the week's six dots.
class WeekDot {
  const WeekDot(this.iso, {required this.on, required this.ahead, required this.now});
  final String iso;
  final bool on, ahead, now;
}

String _t(Object? v) => v == null ? '' : '$v'.trim();

/// JS `+v || 0` over a field's text.
num _num(String s, num dflt) {
  final d = jsPlus(s);
  if (d.isNaN || d == 0) return dflt;
  return d == d.truncateToDouble() ? d.toInt() : d;
}

extension PracticeEngine on Engine {
  Map<String, dynamic> get reps => S['reps'] as Map<String, dynamic>;
  List<dynamic> repList(String kind) => (reps[kind] is List ? reps[kind] as List : (reps[kind] = <dynamic>[]));
  int repCount(String kind) => repList(kind).length;

  /// A rest day owes nothing, and the page says so. (app.js practiceResting.)
  bool get practiceResting => isRestDay(todayISO()) && ge(todayISO(), START_DATE);

  /// Which plan week a date belongs to: one a week means one per plan week.
  int weekOf(String iso) {
    final d = studyIndex(iso);
    return d < 0 ? -1 : fdiv(d, Engine.STUDY_WEEK);
  }

  /// What is owed, derived (app.js repsDue): never a stored "pending" flag.
  List<RepDue> repsDue([String? iso]) {
    iso ??= todayISO();
    if (isRestDay(iso) || lt(iso, START_DATE)) return [];
    final out = <RepDue>[];
    if (!repList('bank').any((e) => e is Map && e['date'] == iso)) out.add(const RepDue('bank', 'Story bank', 'one real thing, two lines'));
    if (dowOf(iso) == Engine.SPEECH_OFF_DOW) {
      final wk = weekOf(iso);
      if (!repList('story').any((e) => e is Map && weekOf('${e['date']}') == wk)) {
        out.add(const RepDue('story', 'Story rep', 'one from the bank, recorded, under 90s'));
      }
      if (!repList('humor').any((e) => e is Map && weekOf('${e['date']}') == wk)) {
        out.add(const RepDue('humor', 'Humour rep', 'five attempts, most will be bad'));
      }
    }
    // The monthly review comes due once there is a recording four weeks old and no review since.
    final old4 = addDaysISO(iso, -28);
    final hasOld = repList('story').any((e) => e is Map && le('${e['date']}', old4));
    var lastRev = '';
    for (final e in repList('review')) {
      final d = e is Map ? '${e['date']}' : '';
      if (d.compareTo(lastRev) > 0) lastRev = d;
    }
    if (hasOld && (lastRev.isEmpty || le(lastRev, old4))) out.add(const RepDue('review', 'Monthly review', 'rewatch the recording from four weeks ago'));
    return out;
  }

  /// The tab opened first: the kind owed today, the recorded ones first; nothing owed is Story.
  String practiceDefault() {
    final due = repsDue().map((d) => d.kind).toList();
    for (final k in const ['story', 'humor', 'bank']) {
      if (due.contains(k)) return k;
    }
    return 'story';
  }

  /// The week as six dots (null before the start). A dot is on when the bank was
  /// logged that day; today counts as ahead until it is over.
  ({List<WeekDot> dots, int logged})? weekDots() {
    final today = todayISO(), wk = weekOf(today);
    if (wk < 0) return null;
    var logged = 0;
    final dots = <WeekDot>[];
    for (var i = 0; i < Engine.STUDY_WEEK; i++) {
      final iso = dateForStudy(wk * Engine.STUDY_WEEK + i);
      final on = repList('bank').any((e) => e is Map && e['date'] == iso);
      if (on) logged++;
      dots.add(WeekDot(iso, on: on, ahead: ge(iso, today), now: iso == today));
    }
    return (dots: dots, logged: logged);
  }

  /// "Logged so far": a count per kind that has any, then the history rows
  /// [date.slice(5), what, sub] exactly as repHistoryHTML builds them.
  ({List<List<String>> counts, List<List<String>> history}) repLog() {
    String s(Object? v) => v is num ? numText(v) : '${v ?? ''}';
    const kinds = [
      ('bank', 'Story bank', 'one real thing, two lines'),
      ('story', 'Story reps', 'recorded, under 90 seconds'),
      ('humor', 'Humour reps', 'five attempts, most will be bad'),
      ('review', 'Monthly reviews', 'rewatch what you recorded'),
    ];
    final counts = [
      for (final (k, t, sub) in kinds)
        if (repCount(k) > 0) [t, sub, '${repCount(k)}'],
    ];
    List<Map> last(String k, int n) {
      final l = repList(k).whereType<Map>().toList();
      return l.sublist(l.length > n ? l.length - n : 0).reversed.toList();
    }

    String d5(Object? d) => '$d'.length > 5 ? '$d'.substring(5) : '$d';
    final history = <List<String>>[
      for (final e in repList('bank').whereType<Map>().toList().reversed.take(10)) [d5(e['date']), s(e['what']), s(e['why'])],
      for (final e in last('story', 4)) [d5(e['date']), '${s(e['seconds'])}s story rep · ${s(e['takes'])} take${e['takes'] == 1 ? '' : 's'}', s(e['from'])],
      for (final e in last('humor', 4))
        [
          d5(e['date']),
          truthy(e['seconds'])
              ? 'Humour rep, recorded · ${clockLabel(jsOr0(e['seconds']))}'
              : '${((e['attempts'] as List?) ?? const []).where((a) => truthy(a)).length} jokes written',
          truthy(e['keeper']) ? 'kept #${s(e['keeper'])}' : 'none kept',
        ],
      for (final e in last('review', 3)) [d5(e['date']), 'Monthly review', s(e['notes']).length > 90 ? s(e['notes']).substring(0, 90) : s(e['notes'])],
    ];
    return (counts: counts, history: history);
  }

  /// app.js logRep: appended, and sealed into the chain. Both the hand forms and
  /// the recorder come through here. The caller saves.
  void _logRep(String kind, Map<String, dynamic> entry, Map<String, dynamic> ev, String ts) {
    repList(kind).add(entry);
    logEvent('rep', kind, ev, ts);
  }

  /// The four forms (app.js's repBank / repStory / repHumor / repReview handlers).
  /// [v] is what the form holds, by the web page's own field ids (bankWhat, bankWhy,
  /// repSecs, repTakes, repWhich, joke0..joke4, jokeKeep, revNotes). A rep must
  /// carry a payload or it does not exist.
  RepResult logRepForm(String act, Map<String, String> v, String ts) {
    final iso = todayISO();
    if (isRestDay(iso) && ge(iso, START_DATE)) return const RepResult(false, 'Saturday is a rest day — nothing owed.');
    String val(String id) => _t(v[id]);
    switch (act) {
      case 'repBank':
        final what = val('bankWhat');
        if (what.isEmpty) return const RepResult(false, 'Write what happened first — an empty entry is not an entry.');
        _logRep('bank', {'date': iso, 'what': what, 'why': val('bankWhy')}, {'date': iso}, ts);
        return const RepResult(true, 'Logged. The bank is the input to every other rep.');
      case 'repStory':
        final secs = _num(val('repSecs'), 0);
        if (secs == 0) return const RepResult(false, 'How long was it? The 90-second cap is the teacher.');
        _logRep('story', {'date': iso, 'seconds': secs, 'takes': _num(val('repTakes'), 1), 'from': val('repWhich')}, {'date': iso, 'seconds': secs}, ts);
        return RepResult(true, secs <= 90 ? 'Logged, and inside 90s.' : 'Logged — ${numText(secs)}s. The cap is 90.');
      case 'repHumor':
        final attempts = [for (var i = 0; i < 5; i++) val('joke$i')];
        final n = attempts.where((a) => a.isNotEmpty).length;
        if (n < 5) return RepResult(false, 'Five attempts, not $n. Volume is the mechanic.');
        final k = _num(val('jokeKeep'), 0);
        _logRep('humor', {'date': iso, 'attempts': attempts, 'keeper': k >= 1 && k <= 5 ? k : 0}, {'date': iso, 'keeper': k}, ts);
        return RepResult(true, truthy(k) ? 'Logged, one keeper.' : 'Logged. No keeper this week — that is a normal week.');
      default:
        final notes = val('revNotes');
        if (notes.isEmpty) return const RepResult(false, 'A review with no writing is a rewatch.');
        _logRep('review', {'date': iso, 'notes': notes}, {'date': iso}, ts);
        return const RepResult(true, 'Review logged.');
    }
  }

  /// app.js recSaved's logging half: a finished recording becomes a rep the way the
  /// hand form's Log does. [seconds] is already at least [REC_MIN]; [kept] is whether
  /// the clip reached the device's store. A rest day keeps the clip and logs nothing.
  RepResult logRecordedRep(String kind, String date, int seconds, String title, {required bool kept, Map<String, String> v = const {}, required String ts}) {
    final rest = isRestDay(date) && ge(date, START_DATE);
    String msg;
    var logged = false;
    if (rest) {
      msg = '${kept ? 'Kept on this device. ' : ''}Saturday is a rest day — nothing logged.';
    } else if (kind == 'humor') {
      final k = _num(_t(v['jokeKeep']), 0);
      final keeper = k >= 1 && k <= 5 ? k : 0;
      _logRep('humor', {'date': date, 'attempts': [for (var i = 0; i < 5; i++) _t(v['joke$i'])], 'keeper': keeper, 'seconds': seconds}, {'date': date, 'keeper': keeper}, ts);
      msg = 'Logged, ${clockLabel(seconds)} recorded.';
      logged = true;
    } else {
      _logRep('story', {'date': date, 'seconds': seconds, 'takes': 1, 'from': title}, {'date': date, 'seconds': seconds}, ts);
      msg = seconds <= 90 ? 'Logged, and inside 90s.' : 'Logged — ${seconds}s. The cap is 90.';
      logged = true;
    }
    if (!kept) msg = 'Could not keep the recording on this device. $msg';
    return RepResult(logged, msg);
  }
}
