// The sync merge and the sync payload: a 1:1 port of mergeState, mergeQuiz,
// canon and syncPayload in platform/js/app.js (T-064 stage 3).
//
// PORTED, NOT REDESIGNED. Same field rules, same order, same `changed` count.
// Where JS and Dart differ the port reproduces JS: truthiness (see [truthy]),
// `x || ""` string comparison, `+x` numeric coercion, "undefined" vs null in a
// joined key, and Array.prototype.sort's "equal goes after" on the one
// comparator that never returns 0.
//
// MONK_SYNCS is false: a remote `monk` is not read at all, and the payload
// never carries one. The one piece of Monk that syncs is `monkStart` (T-065):
// the earlier date stands, a remote that is not a date is ignored.
// tools/verify-app.js runs app.js's own mergeState over the same fixtures and
// compares the merged state key by key.
// ignore_for_file: non_constant_identifier_names
library;

import 'dart:convert';

import 'engine.dart';

final _isoDate = RegExp(r'^\d{4}-\d{2}-\d{2}$');

Map<String, dynamic> _m(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};
List<dynamic> _l(Object? v) => v is List ? v : <dynamic>[];

/// JS `undefined`: a key that is not there (null is JSON null).
const Object _undef = Object();
Object? _get(Map m, String k) => m.containsKey(k) ? m[k] : _undef;

/// `(x || "")`.
String _s(Object? v) => truthy(v) ? _js(v) : '';

/// JS string conversion, for the keys the merge joins with "|".
String _js(Object? v) {
  if (identical(v, _undef)) return 'undefined';
  if (v == null) return 'null';
  if (v is double && v.isFinite && v == v.truncateToDouble() && v.abs() < 1e21) return v.toInt().toString();
  return '$v';
}

/// JS unary plus: null is 0, a missing value, text that is not a number and
/// anything else that is not a number is NaN.
double _plus(Object? v) {
  if (v == null) return 0;
  if (v is num) return v.toDouble();
  if (v is bool) return v ? 1 : 0;
  if (v is String) return v.trim().isEmpty ? 0 : (double.tryParse(v.trim()) ?? double.nan);
  return double.nan;
}

/// `(+x || 0)`.
double _or0(Object? v) {
  final n = _plus(v);
  return n.isNaN ? 0 : n;
}

int _len(Object? v) => truthy(v) ? (v is String ? v.length : (v is List ? v.length : 0)) : 0;

/// app.js canon: JSON with sorted keys, so equal values compare equal.
String canon(Object? v) {
  if (v == null) return 'null';
  if (v is List) return '[${v.map(canon).join(',')}]';
  if (v is Map) {
    final ks = v.keys.map((k) => '$k').toList()..sort();
    return '{${ks.map((k) => '${jsonEncode(k)}:${canon(v[k])}').join(',')}}';
  }
  if (v is num) return _js(v);
  return jsonEncode(v);
}

/// Array.prototype.sort with a comparator, as V8 runs it: a binary insertion
/// where the element goes AFTER every element it does not sort before. Stable
/// for a comparator that returns 0 on a tie, and "tie goes after" for the
/// sketches' `a < b ? -1 : 1`. Dart's own sort is neither.
void _sortJs(List<dynamic> a, int Function(dynamic, dynamic) cmp) {
  for (var i = 1; i < a.length; i++) {
    final pivot = a[i];
    var left = 0, right = i;
    while (left < right) {
      final mid = left + ((right - left) >> 1);
      if (cmp(pivot, a[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    for (var j = i; j > left; j--) {
      a[j] = a[j - 1];
    }
    a[left] = pivot;
  }
}

int _cmpStr(String a, String b) => a.compareTo(b);

/// Two quiz records, one result (app.js mergeQuiz).
Map<String, dynamic>? mergeQuiz(Object? a0, Object? b0) {
  final a = a0 is Map ? a0.cast<String, dynamic>() : null, b = b0 is Map ? b0.cast<String, dynamic>() : null;
  if (a == null || !truthy(a['passedAt'])) return b != null && truthy(b['passedAt']) ? b : a;
  if (b == null || !truthy(b['passedAt'])) return a;
  final first = (_js(b['passedAt']) + _s(b['at'])).compareTo(_js(a['passedAt']) + _s(a['at'])) < 0 ? b : a;
  double share(Map<String, dynamic> x) => _plus(_get(x, 'total')) > 0 ? _or0(_get(x, 'firstTry')) / _plus(_get(x, 'total')) : 0;
  final better = share(b) > share(a) || (share(b) == share(a) && _or0(_get(b, 'total')) > _or0(_get(a, 'total'))) ? b : a;
  return {
    'passedAt': first['passedAt'],
    'at': first['at'],
    'firstTry': better['firstTry'],
    'total': better['total'],
    'attempts': better['attempts'],
  };
}

Map<String, dynamic> _ensureMap(Map<String, dynamic> S, String key) {
  final v = S[key];
  if (v is Map) return v.cast<String, dynamic>();
  return S[key] = <String, dynamic>{};
}

List<dynamic> _ensureList(Map<String, dynamic> S, String key) {
  final v = S[key];
  if (v is List) return v;
  return S[key] = <dynamic>[];
}

/// app.js mergeState: field-level, so work on two devices in one day never
/// costs work. Mutates [e].S in place and returns how many things it changed.
int mergeState(Engine e, Object? remote) {
  if (remote is! Map) return 0;
  final S = e.S;
  var changed = 0;
  final r = _m(remote['state']);

  // lessons: keep the further-along version of each
  final lessons = _ensureMap(S, 'lessons');
  final rl = _m(r['lessons']);
  for (final k in rl.keys.toList()) {
    final theirs0 = rl[k];
    if (!truthy(theirs0) || theirs0 is! Map) continue;
    final theirs = theirs0.cast<String, dynamic>();
    final mine0 = lessons[k];
    if (!truthy(mine0) || mine0 is! Map) {
      lessons[k] = theirs;
      changed++;
      continue;
    }
    final mine = mine0.cast<String, dynamic>();
    // The resume point goes with whichever side stamped it last.
    final pos = _s(theirs['posAt']).compareTo(_s(mine['posAt'])) > 0 ? theirs : mine;
    final keepPos = _get(pos, 'pos'), keepPosAt = _get(pos, 'posAt');
    int score(Map<String, dynamic> x) =>
        (truthy(x['verified']) ? 4 : 0) + (truthy(x['done']) ? 2 : 0) + (_len(x['notes']) + _len(x['recall']) > 0 ? 1 : 0);
    if (score(theirs) > score(mine)) {
      lessons[k] = theirs;
      changed++;
    } else if (score(theirs) == score(mine)) {
      if (_len(theirs['notes']) > _len(mine['notes'])) {
        mine['notes'] = theirs['notes'];
        changed++;
      }
      if (_len(theirs['recall']) > _len(mine['recall'])) {
        mine['recall'] = theirs['recall'];
        changed++;
      }
      if (_or0(theirs['solved']) > _or0(mine['solved'])) {
        mine['solved'] = theirs['solved'];
        changed++;
      }
    }
    final now = (lessons[k] as Map).cast<String, dynamic>();
    // A quiz pass on either device survives whichever copy won.
    final quiz = mergeQuiz(mine['quiz'], theirs['quiz']);
    if (quiz != null && canon(quiz) != canon(truthy(now['quiz']) ? now['quiz'] : null)) {
      now['quiz'] = quiz;
      changed++;
    }
    // Both watched: the earlier watch date stands; firstDoneAt is the earliest either side knows.
    if (truthy(mine['done']) && truthy(theirs['done']) && truthy(mine['doneAt']) && truthy(theirs['doneAt'])) {
      final a = _js(mine['doneAt']), b = _js(theirs['doneAt']);
      final early = a.compareTo(b) < 0 ? a : b;
      if (now['doneAt'] != early) {
        now['doneAt'] = early;
        changed++;
      }
    }
    final fds = [mine['firstDoneAt'], theirs['firstDoneAt']].where(truthy).map(_js).toList()..sort();
    final fd = fds.isEmpty ? null : fds.first;
    if (fd != null && now['firstDoneAt'] != fd) {
      now['firstDoneAt'] = fd;
      changed++;
    }
    if (_get(now, 'pos') != keepPos || _get(now, 'posAt') != keepPosAt) {
      if (keepPos == null || identical(keepPos, _undef)) {
        now.remove('pos');
      } else {
        now['pos'] = keepPos;
      }
      if (keepPosAt == null || identical(keepPosAt, _undef)) {
        now.remove('posAt');
      } else {
        now['posAt'] = keepPosAt;
      }
      if (identical(lessons[k], mine0)) changed++; // JS: now === mine
    }
  }

  // sets: union
  final sd = _ensureList(S, 'studyDays');
  for (final d in _l(r['studyDays'])) {
    if (!sd.contains(d)) {
      sd.add(d);
      changed++;
    }
  }
  _sortJs(sd, (a, b) => _cmpStr(_js(a), _js(b)));
  for (final key in ['problems', 'psets', 'electives', 'labs', 'diag']) {
    final mineMap = _ensureMap(S, key), theirs = _m(r[key]);
    for (final k in theirs.keys.toList()) {
      if (!truthy(mineMap[k]) && truthy(theirs[k])) {
        mineMap[k] = theirs[k];
        changed++;
      }
    }
  }

  // attempts: concat, dedupe
  final qa = _ensureMap(S, 'quizAttempts');
  final rqa = _m(r['quizAttempts']);
  String attemptKey(Object? a2) {
    final m = a2 is Map ? a2 : const {};
    return '${_js(_get(m, 'date'))}|${_js(_get(m, 'pct'))}|${_js(_get(m, 'score'))}';
  }

  for (final b in rqa.keys.toList()) {
    final list = qa[b] is List && truthy(qa[b]) ? qa[b] as List : (qa[b] = <dynamic>[]);
    final seen = {for (final a2 in list) attemptKey(a2)};
    for (final a2 in _l(rqa[b])) {
      final k = attemptKey(a2);
      if (!seen.contains(k)) {
        list.add(a2);
        seen.add(k);
        changed++;
      }
    }
  }

  // weeks: by week number, later entry wins; a week sealed under an earlier
  // start can carry the same number, so two entries are the same seal only
  // when both sit on the same side of that revision week's start.
  final weeks = _ensureList(S, 'weeks');
  for (final w0 in _l(r['weeks'])) {
    final w = _m(w0);
    final wn = _plus(_get(w, 'week'));
    if (wn.isNaN) continue;
    final wFrom = e.revisionWeek(wn.toInt()).from;
    bool side(Map x) => _s(x['date']).compareTo(wFrom) >= 0;
    final i = weeks.indexWhere((x) => x is Map && _plus(_get(x, 'week')) == wn && side(x) == side(w));
    if (i < 0) {
      weeks.add(w0);
      changed++;
    } else if (_s(w['date']).compareTo(_s((weeks[i] as Map)['date'])) > 0) {
      weeks[i] = w0;
      changed++;
    }
  }

  // review: the later date wins, so a recall done elsewhere is respected
  final review = _ensureMap(S, 'review');
  final rr = _m(r['review']);
  for (final k in rr.keys.toList()) {
    final mine = review[k], theirs = rr[k];
    if (!truthy(mine) || _s(theirs is Map ? theirs['last'] : null).compareTo(_s(mine is Map ? mine['last'] : null)) > 0) {
      review[k] = theirs;
      changed++;
    }
  }

  // concepts: proven wins; sketches keep the newest two across devices
  final concepts = _ensureMap(S, 'concepts');
  final rc = _m(r['concepts']);
  for (final k in rc.keys.toList()) {
    final mine0 = concepts[k], theirs0 = rc[k];
    if (!truthy(mine0) || mine0 is! Map) {
      concepts[k] = theirs0;
      changed++;
      continue;
    }
    if (theirs0 is! Map) continue;
    final mine = mine0.cast<String, dynamic>(), theirs = theirs0.cast<String, dynamic>();
    if (truthy(theirs['proven']) && !truthy(mine['proven'])) {
      mine['proven'] = true;
      mine['provenAt'] = theirs['provenAt'];
      changed++;
    }
    final mineSk = truthy(mine['sketches']) ? _l(mine['sketches']) : <dynamic>[];
    final merged = [...mineSk, ...(truthy(theirs['sketches']) ? _l(theirs['sketches']) : <dynamic>[])];
    final all = <dynamic>[
      for (var i = 0; i < merged.length; i++)
        if (merged.indexWhere((x) => _get(_m(x), 'png') == _get(_m(merged[i]), 'png')) == i) merged[i],
    ];
    _sortJs(all, (x, y) {
      final dx = _get(_m(x), 'date'), dy = _get(_m(y), 'date');
      return dx is String && dy is String && dx.compareTo(dy) < 0 ? -1 : 1;
    });
    if (all.length != mineSk.length) {
      mine['sketches'] = all.length > 2 ? all.sublist(all.length - 2) : all;
      changed++;
    }
  }
  final anchors = _ensureList(S, 'anchors');
  for (final a2 in _l(r['anchors'])) {
    final a = _m(a2);
    if (!anchors.any((x) => _get(_m(x), 'head') == _get(a, 'head') && _get(_m(x), 'date') == _get(a, 'date'))) {
      anchors.add(a2);
      changed++;
    }
  }

  // Reps union like anchors: a rep is a thing that happened.
  final reps = _ensureMap(S, 'reps');
  final rreps = _m(r['reps']);
  String Function(Map) repKey(String k) => switch (k) {
    'bank' => (x) => '${_js(_get(x, 'date'))}|${_s(x['what'])}',
    'story' => (x) => '${_js(_get(x, 'date'))}|${truthy(x['seconds']) ? _js(x['seconds']) : '0'}',
    'humor' => (x) {
      final at = x['attempts'];
      final first = at is List && at.isNotEmpty ? at.first : null;
      return '${_js(_get(x, 'date'))}|${_s(first)}';
    },
    _ => (x) => _js(_get(x, 'date')),
  };
  for (final k in ['bank', 'story', 'humor', 'review']) {
    final mine = reps[k] is List ? reps[k] as List : (reps[k] = <dynamic>[]);
    final key = repKey(k);
    final seen = {for (final x in mine) key(_m(x))};
    for (final x in _l(rreps[k])) {
      final id = key(_m(x));
      if (!seen.contains(id)) {
        mine.add(x);
        seen.add(id);
        changed++;
      }
    }
    _sortJs(mine, (a, b) {
      final da = _s(_m(a)['date']), db = _s(_m(b)['date']);
      return da.compareTo(db) < 0 ? -1 : (da.compareTo(db) > 0 ? 1 : 0);
    });
  }

  // The streak floor takes the later of the two. Days union, so without this a
  // reset on the phone would be silently undone by the next pull.
  final rf = _m(r['settings'])['streakFrom'];
  if (truthy(rf) && _js(rf).compareTo(_s(e.settings['streakFrom'])) > 0) {
    e.settings['streakFrom'] = rf;
    changed++;
  }

  // T-065: the Monk start date, the one piece of Monk that syncs. First write wins: a side with none takes the
  // other's, and with two the EARLIER date stands, so every device settles on the same day and an older device
  // that has not heard of the start can never clear it. A remote value that is not a date is ignored.
  final rm = r['monkStart'];
  if (rm is String && _isoDate.hasMatch(rm)) {
    final mine = S['monkStart'];
    if (!truthy(mine) || (mine is String && rm.compareTo(mine) < 0)) {
      S['monkStart'] = rm;
      changed++;
    }
  }

  // Ledgers stay per device and are never re-hashed.
  final ledgers = _m(remote['ledgers']);
  final foreign = _ensureMap(S, 'foreignLedgers');
  for (final dev in ledgers.keys.toList()) {
    if (dev == e.settings['deviceId']) continue;
    final theirs = truthy(ledgers[dev]) ? _l(ledgers[dev]) : <dynamic>[];
    final mineForeign = truthy(foreign[dev]) ? _l(foreign[dev]) : <dynamic>[];
    if (theirs.length > mineForeign.length) {
      foreign[dev] = theirs;
      changed++;
    }
  }

  // Gates: last writer wins on `at`, per gate.
  final gates = _ensureMap(S, 'gates');
  final rg = _m(r['gates']);
  Map<String, dynamic> rec(Object? raw, String k) {
    final g = e.gateRec(raw, int.tryParse(k) ?? 0);
    return {'date': g.date, 'at': g.at, 'passed': g.passed};
  }

  for (final k in rg.keys.toList()) {
    final theirs = rec(rg[k], k), mine = rec(gates[k], k);
    if (_s(theirs['at']).compareTo(_s(mine['at'])) > 0) {
      gates[k] = theirs;
      changed++;
    }
  }
  return changed;
}

/// What a push writes (app.js syncPayload). `monk` is never in it; `monkStart` (T-065) is, when set.
Map<String, dynamic> syncPayload(Engine e, {DateTime? now}) {
  final S = e.S, state = <String, dynamic>{};
  for (final k in [
    'lessons', 'problems', 'quizAttempts', 'quizMisses', 'diag', 'gates', 'studyDays',
    'weeks', 'labs', 'psets', 'electives', 'treasury', 'review', 'concepts', 'anchors', 'reps',
  ]) {
    if (S.containsKey(k)) state[k] = S[k];
  }
  final st = e.settings, settings = <String, dynamic>{};
  for (final k in ['theme', 'dailyStart', 'streakFrom']) {
    if (st.containsKey(k)) settings[k] = st[k];
  }
  state['settings'] = settings;
  // T-065: the start date alone leaves the device; nothing else of Monk does.
  if (truthy(S['monkStart'])) state['monkStart'] = S['monkStart'];
  final ledgers = <String, dynamic>{..._m(S['foreignLedgers'])};
  ledgers['${st['deviceId']}'] = S['ledger'];
  return {
    'v': 1,
    'updatedAt': (now ?? DateTime.now()).toUtc().toIso8601String(),
    'device': st['deviceId'],
    'state': state,
    'ledgers': ledgers,
  };
}

/// JSON.stringify(payload, null, 1).
String encodePayload(Map<String, dynamic> payload) => const JsonEncoder.withIndent(' ').convert(payload);
