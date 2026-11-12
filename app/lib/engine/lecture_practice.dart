// T-067 step 3: the practice items under a lecture's quiz, a 1:1 port of the
// practice engine in platform/js/app.js (practiceItems .. weekText, outputOk,
// gradeRequest and the reading of a Messages API answer in practiceGrade).
//
// PORTED, NOT REDESIGNED. DAR.PRACTICE[lessonKey] is practice.json; the state is
// S.practice[lessonKey][itemId] = {answer, mark, at, ticks, grade}, merged per item
// by `at` (merge.dart). A missed or partly item goes into the spaced review under
// "p:<lessonKey>:<itemId>" and comes back in Recall. Every message, threshold and
// field is app.js's; tools/verify-app.js runs both over the same fixtures.
//
// (Not Storytelling's practice: that is practice.dart, the reps.)
//
// THE ANTHROPIC KEY is not in S and never passes through this file: it is read
// by AppModel from shared_preferences (brickford_anthropic_key) and handed to
// [gradeHeaders] only at the moment of a request.
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dart:convert';

import 'dates.dart';
import 'engine.dart';
import 'learn.dart';
import 'quiz.dart';

/// Characters of a real written attempt.
const WRITE_MIN = 80;

/// Where the owner's Anthropic key lives on this device (shared_preferences; localStorage on the web). Never in S.
const AI_KEY = 'brickford_anthropic_key';
const AI_URL = 'https://api.anthropic.com/v1/messages';

/// Claude Opus 5.5, the default model; a refusal falls back server-side ("default" routing).
const AI_MODEL = 'claude-opus-5-5', AI_VERSION = '2026-10-21', AI_BETA = 'server-side-fallback-2026-07-01';
const AI_SCHEMA = {
  'type': 'object', 'additionalProperties': false, 'required': ['points', 'correction'],
  'properties': {
    'points': {'type': 'array', 'items': {'type': 'object', 'additionalProperties': false, 'required': ['point', 'verdict'],
      'properties': {'point': {'type': 'string'}, 'verdict': {'type': 'string', 'enum': ['met', 'partly', 'missing']}}}},
    'correction': {'type': 'string'},
  },
};
const AI_SYSTEM = 'You grade one student answer against the key points of a model solution. For each key point, in order, '
    'say whether the answer meets it: met, partly or missing. Then give exactly one correction: the most important thing '
    'to fix, in at most two sentences, addressed to the student. Judge the mathematics and the reasoning, not the wording.';

/// The self-check lines (app.js practiceItemHTML / practiceGrade).
const noKeySay = 'No Claude key on this device (Sync): self-check above.';
const offlineSay = 'Offline: self-check above.';
String gradeFailSay(String why) => 'Claude could not grade this (${why.length > 80 ? why.substring(0, 80) : why}): self-check above.';

/// PR_TYPE and PR_MARK.
const prType = {'numeric': 'Number', 'output': 'Code · run it in Replit', 'worked': 'On paper', 'write': 'Written'};
const prMark = {'ok': 'Got it', 'partly': 'Partly', 'missed': 'Missed'};

final _pk = RegExp(r'^p:([^:]+):([^:]+)$');
String practiceKey(String k, String id) => 'p:$k:$id';
bool isPracticeKey(String k) => _pk.hasMatch(k);

Map<String, dynamic> _m(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};

/// JS String(x) for the values practice state holds.
String _str(Object? v) {
  if (v is double && v.isFinite && v == v.truncateToDouble() && v.abs() < 1e21) return v.toInt().toString();
  return '$v';
}

/// app.js prTried: an answer was given (for `write`, at least [WRITE_MIN] characters of it).
bool prTried(Map<String, dynamic> it, Map<String, dynamic>? ps) {
  final a = ps?['answer'];
  return a is String && a.trim().isNotEmpty && (it['type'] != 'write' || a.trim().length >= WRITE_MIN);
}

/// JS Number(s) for a string: whole-string, whitespace trimmed, "" is 0, hex/octal/binary and Infinity read.
double jsNumber(String s0) {
  final s = s0.trim();
  if (s.isEmpty) return 0;
  final radix = RegExp(r'^0([xXoObB])([0-9a-fA-F]+)$').firstMatch(s);
  if (radix != null) {
    final base = {'x': 16, 'o': 8, 'b': 2}[radix[1]!.toLowerCase()]!;
    final v = int.tryParse(radix[2]!, radix: base);
    return v == null ? double.nan : v.toDouble();
  }
  final inf = RegExp(r'^([+-]?)Infinity$').firstMatch(s);
  if (inf != null) return inf[1] == '-' ? double.negativeInfinity : double.infinity;
  if (!RegExp(r'^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$').hasMatch(s)) return double.nan;
  return double.parse(s.replaceFirst(RegExp(r'\.(?=[eE]|$)'), ''));
}

/// app.js outputOk: the printed value, the same text spacing aside, or the same number by the quiz's grader.
bool outputOk(Map<String, dynamic> it, String v) {
  String norm(String x) => x.replaceAll(RegExp(r'\s+'), '');
  final out = _str(it['out']);
  if (norm(v) == norm(out)) return true;
  final n = jsNumber(out);
  return n.isFinite && out.trim().isNotEmpty && gradeAnswer({'num': n}, v);
}

/// app.js gradeRequest: the Messages API body. The question, the checklist (or the worked solution and its result)
/// and the answer; nothing else.
Map<String, dynamic> gradeRequest(Map<String, dynamic> it, String answer) {
  final points = it['type'] == 'write' ? (it['points'] as List) : [...(it['steps'] as List), 'Result: ${it['result']}'];
  return {
    'model': AI_MODEL,
    'max_tokens': 1024,
    'system': AI_SYSTEM,
    'messages': [
      {'role': 'user', 'content': jsonEncode({'question': it['q'], 'key_points': points, 'answer': answer})},
    ],
    'output_config': {'format': {'type': 'json_schema', 'schema': AI_SCHEMA}},
    'fallbacks': 'default',
  };
}

/// The request's headers (app.js practiceGrade's fetch).
Map<String, String> gradeHeaders(String key) => {
  'content-type': 'application/json',
  'x-api-key': key,
  'anthropic-version': AI_VERSION,
  'anthropic-dangerous-direct-browser-access': 'true',
  'anthropic-beta': AI_BETA,
};

/// app.js practiceGrade's reading of the answer: the grade to store (points and correction; the caller stamps `at`),
/// or why it failed. A refusal is "declined"; an HTTP error is the API's own message.
({Map<String, dynamic>? grade, String? why}) readGrade(int status, String bodyText) {
  Object? d;
  try {
    d = jsonDecode(bodyText);
  } catch (_) {
    d = <String, dynamic>{};
  }
  final dm = _m(d);
  if (status < 200 || status > 299) {
    final msg = _m(dm['error'])['message'];
    return (grade: null, why: truthy(msg) ? _str(msg) : 'HTTP $status');
  }
  if (dm['stop_reason'] == 'refusal') return (grade: null, why: 'declined');
  final content = dm['content'] is List ? dm['content'] as List : const [];
  final t = content.firstWhere((b) => b is Map && b['type'] == 'text', orElse: () => null);
  Object? g;
  try {
    g = jsonDecode(t is Map ? '${t['text']}' : '');
  } catch (_) {
    return (grade: null, why: 'an answer in the wrong shape');
  }
  if (g is! Map || g['points'] is! List || g['correction'] is! String) return (grade: null, why: 'an answer in the wrong shape');
  const verdicts = ['met', 'partly', 'missing'];
  return (
    grade: {
      'points': [
        for (final p in g['points'] as List)
          {
            'point': truthy(_m(p)['point']) ? _str(_m(p)['point']) : '',
            'verdict': verdicts.contains(_m(p)['verdict']) ? _m(p)['verdict'] : 'missing',
          },
      ],
      'correction': g['correction'],
    },
    why: null,
  );
}

/// A practice key in the review, resolved: the lecture, the item and its place.
typedef PracticeRef = ({String k, String id, Map<String, dynamic> it, int i});

/// One row of today's practice: a lecture, and how many of its items are due again.
class PracticeRow {
  PracticeRow(this.k, this.due);
  final String k;
  int due;
}

/// The dashboard's "Today's practice" group, as app.js practiceDashHTML draws it.
class PracticeDash {
  const PracticeDash(this.items, this.rows, this.week);

  /// The "N items" in the head: every item of every row's lecture.
  final int items;

  /// Per lecture (lectures with no label are left out, as on the web): the title, the line under it, watched.
  final List<({String k, String title, String sub, bool seen})> rows;

  /// This week's answers (the copy row shows when there are any).
  final int week;
  String get weekSub => '$week answer${week == 1 ? '' : 's'} and their questions, for a review in chat';
}

extension LecturePractice on Engine {
  Map<String, dynamic> get practice => _m(S['practice']);

  /// app.js practiceItems: DAR.PRACTICE[k], or none.
  List<Map<String, dynamic>> practiceItems(String k) =>
      D.practice[k] is List ? [for (final it in D.practice[k] as List) _m(it)] : const [];

  /// app.js practiceOf: S.practice[k][id], or null.
  Map<String, dynamic>? practiceOf(String k, String id) {
    final v = _m(practice[k])[id];
    return truthy(v) && v is Map ? v.cast<String, dynamic>() : null;
  }

  PracticeRef? practiceRef(String pk) {
    final m = _pk.firstMatch(pk);
    if (m == null) return null;
    final items = practiceItems(m[1]!);
    final i = items.indexWhere((x) => x['id'] == m[2]);
    return i < 0 ? null : (k: m[1]!, id: m[2]!, it: items[i], i: i);
  }

  /// The items marked right (or "got it").
  int practiceSolvedN(String k) => practiceItems(k).where((it) => practiceOf(k, '${it['id']}')?['mark'] == 'ok').length;

  /// app.js practiceTarget: problems to solve unaided for a lecture of this length.
  int practiceTarget(Map<String, dynamic>? l) {
    if (l != null && truthy(l['solve'])) return (l['solve'] as num).toInt();
    final m = l?['min'];
    if (!truthy(m)) return 2;
    if ((m as num) <= 15) return 1;
    if (m <= 35) return 2;
    return 3;
  }

  /// app.js practiceNeed and lessonGates' "solve" gate: with practice items, the items count, and no more is asked
  /// than there are; without, the manual counter.
  ({int solved, int need}) solveGate(String k) {
    final l = lessonAt(k), n = practiceItems(k).length, st = _m(lessons[k]);
    final need = n > 0 ? (practiceTarget(l) < n ? practiceTarget(l) : n) : practiceTarget(l);
    final solved = n > 0 ? practiceSolvedN(k) : (truthy(st['solved']) ? (st['solved'] as num).toInt() : 0);
    return (solved: solved, need: need);
  }

  /// app.js practicePut: the patch over what was there, stamped [ts] (ISO, ms, Z).
  void practicePut(String k, String id, Map<String, dynamic> patch, String ts) {
    final pr = practice;
    if (!truthy(pr[k]) || pr[k] is! Map) pr[k] = <String, dynamic>{};
    final byId = (pr[k] as Map).cast<String, dynamic>();
    pr[k] = byId;
    byId[id] = <String, dynamic>{...?practiceOf(k, id), ...patch, 'at': ts};
  }

  /// Check / Submit (wirePractice's answer()): null when stored, else the refusal to show. A wrong
  /// numeric or output answer goes into the spaced review at once.
  String? practiceAnswer(String k, Map<String, dynamic> it, String raw, String ts) {
    final v = raw.trim();
    if (v.isEmpty) return 'Answer first.';
    if (it['type'] == 'write' && v.length < WRITE_MIN) return 'At least $WRITE_MIN characters: a real attempt first.';
    final mark = it['type'] == 'numeric'
        ? (gradeAnswer(it, v) ? 'ok' : 'missed')
        : it['type'] == 'output'
        ? (outputOk(it, v) ? 'ok' : 'missed')
        : null;
    practicePut(k, '${it['id']}', {'answer': v, 'mark': mark, 'ticks': <dynamic>[], 'grade': null}, ts);
    if (mark == 'missed') scheduleReview(practiceKey(k, '${it['id']}'), 0);
    return null;
  }

  /// Got it / Partly / Missed on a worked or written item; partly and missed come back in Recall.
  void practiceMark(String k, String id, String m, String ts) {
    practicePut(k, id, {'mark': m}, ts);
    if (m == 'partly' || m == 'missed') scheduleReview(practiceKey(k, id), 0);
  }

  void practiceAgain(String k, String id, String ts) =>
      practicePut(k, id, {'answer': '', 'mark': null, 'ticks': <dynamic>[], 'grade': null}, ts);

  /// A key point ticked or unticked.
  void practiceTick(String k, String id, int j, bool on, String ts) {
    final ticks = [...(practiceOf(k, id)?['ticks'] is List ? practiceOf(k, id)!['ticks'] as List : const [])];
    while (ticks.length <= j) {
      ticks.add(null);
    }
    ticks[j] = on;
    practicePut(k, id, {'ticks': ticks}, ts);
  }

  /// A grading stored: the verdicts and the correction, stamped.
  void practiceSetGrade(String k, String id, Map<String, dynamic> grade, String ts) =>
      practicePut(k, id, {'grade': {...grade, 'at': ts}}, ts);

  /// app.js practiceToday: the lectures scheduled today that have items, then the lectures with items due again.
  List<PracticeRow> practiceToday() {
    final rows = <PracticeRow>[];
    for (final it in realSched(todayISO())) {
      if (practiceItems(it.key).isNotEmpty && !rows.any((r) => r.k == it.key)) rows.add(PracticeRow(it.key, 0));
    }
    for (final pk in reviewsDue().where(isPracticeKey)) {
      final ref = practiceRef(pk);
      if (ref == null) continue;
      var row = rows.where((r) => r.k == ref.k).firstOrNull;
      if (row == null) rows.add(row = PracticeRow(ref.k, 0));
      row.due++;
    }
    return rows;
  }

  /// app.js weekAnswers: the last seven days' answers (today and the six before), by lecture.
  List<({String k, Map<String, dynamic> it, int i, Map<String, dynamic> ps})> weekAnswers() {
    final from = addDaysISO(todayISO(), -6);
    final out = <({String k, Map<String, dynamic> it, int i, Map<String, dynamic> ps})>[];
    for (final k in practice.keys.toList()..sort()) {
      final items = practiceItems(k);
      for (var i = 0; i < items.length; i++) {
        final ps = practiceOf(k, '${items[i]['id']}');
        if (ps == null || !truthy(ps['answer'])) continue;
        final at = truthy(ps['at']) ? _str(ps['at']) : '';
        if ((at.length > 10 ? at.substring(0, 10) : at).compareTo(from) >= 0) out.add((k: k, it: items[i], i: i, ps: ps));
      }
    }
    return out;
  }

  /// app.js weekText: what "Copy this week's answers" puts on the clipboard, and how many answers.
  ({String text, int n}) weekText() {
    final rows = weekAnswers();
    String plain(Object? t) => (truthy(t) ? _str(t) : '').replaceAll(RegExp(r'<[^>]*>'), '');
    const mark = {'ok': 'got it', 'partly': 'partly', 'missed': 'missed'};
    String? last;
    final s = StringBuffer('Brickford practice, ${addDaysISO(todayISO(), -6)} to ${todayISO()}\n'
        'Please review: for each answer, say whether it is right, name the mistake if there is one, and give one correction.\n');
    for (final r in rows) {
      if (r.k != last) {
        final L = lessonLabel(r.k);
        s.write('\n${L == null ? r.k : '${L.code} · ${L.title}'}\n');
        last = r.k;
      }
      final auto = r.it['type'] == 'numeric' || r.it['type'] == 'output';
      final m = r.ps['mark'];
      s.write('${r.i + 1}. ${plain(r.it['q'])}\n   My answer: ${_str(r.ps['answer'])}'
          '${truthy(m) ? ' (${auto ? (m == 'ok' ? 'checked right' : 'checked wrong') : 'self-marked ${mark[m] ?? 'undefined'}'})' : ''}\n');
    }
    return (text: s.toString(), n: rows.length);
  }

  /// app.js practiceDashHTML's content: null when there is nothing to show.
  PracticeDash? practiceDash() {
    final rows = practiceToday(), wk = weekAnswers().length;
    if (rows.isEmpty && wk == 0) return null;
    final out = <({String k, String title, String sub, bool seen})>[];
    for (final r in rows) {
      final L = lessonLabel(r.k);
      if (L == null) continue;
      final items = practiceItems(r.k);
      final done = items.where((it) => prTried(it, practiceOf(r.k, '${it['id']}'))).length;
      out.add((
        k: r.k,
        title: L.title,
        sub: '${L.code} · $done of ${items.length} answered${r.due > 0 ? ' · ${r.due} due again' : ''}',
        seen: truthy(_m(lessons[r.k])['done']),
      ));
    }
    return PracticeDash(rows.fold(0, (a, r) => a + practiceItems(r.k).length), out, wk);
  }
}
