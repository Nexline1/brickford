// The record (T-064 stage 5): app.js's hash-chain ledger (canon, logEvent,
// verifyChain, preimage, recordBundle), the Sunday week (V.review, logWeek,
// the seal), the streak reset and the day seal, the anchors and the Treasury
// (fmtBHD, revenueTotal, the offer, clients and entries).
//
// PORTED, NOT REDESIGNED. The hash must match the web app's byte for byte, so
// canon() renders a number the way JSON.stringify does (150.0 is "150"), a
// string the way JSON.stringify does, and sorts keys by UTF-16 code unit;
// sha256 is hand-written here (no package: import, so tools/verify-app.js can
// copy this folder to a scratch place and plant a change in it).
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dart:convert';

import 'dates.dart';
import 'engine.dart';
import 'quiz.dart';

const ledgerGenesis = 'brickford-genesis';

/// JS unary plus: `+v` (NaN where JS gives NaN).
double jsPlus(Object? v) {
  if (v == null) return 0;
  if (v is num) return v.toDouble();
  if (v is bool) return v ? 1 : 0;
  if (v is String) return v.trim().isEmpty ? 0 : (double.tryParse(v.trim()) ?? double.nan);
  return double.nan;
}

/// `(+v || 0)`.
double jsOr0(Object? v) {
  final n = jsPlus(v);
  return n.isNaN ? 0 : n;
}

/// Math.round.
num jsRound(num x) => (x + 0.5).floor();

String _jsNum(num v) {
  if (v is int) return '$v';
  if (!v.isFinite) return 'null';
  if (v == v.truncateToDouble() && v.abs() < 1e21) return v.toInt().toString();
  return '$v';
}

/// app.js canon(): the same entry always hashes identically (sorted keys).
String canon(Object? v) {
  if (v == null) return 'null';
  if (v is num) return _jsNum(v);
  if (v is String) return jsonEncode(v);
  if (v is bool) return '$v';
  if (v is List) return '[${v.map(canon).join(',')}]';
  if (v is Map) {
    final keys = [for (final k in v.keys) '$k']..sort();
    return '{${keys.map((k) => '${jsonEncode(k)}:${canon(v[k])}').join(',')}}';
  }
  return 'null';
}

// ---------- sha256 ----------

const _k = <int>[
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];
const _m32 = 0xffffffff;
int _rotr(int x, int n) => ((x >> n) | ((x << (32 - n)) & _m32)) & _m32;

/// app.js sha256(msg): the hex digest of the UTF-8 bytes of [msg].
String sha256Hex(String msg) {
  final bytes = <int>[...utf8.encode(msg), 0x80];
  final bits = utf8.encode(msg).length * 8;
  while (bytes.length % 64 != 56) {
    bytes.add(0);
  }
  final hi = bits ~/ 4294967296, lo = bits & _m32;
  for (final x in [hi, lo]) {
    bytes.addAll([(x >> 24) & 255, (x >> 16) & 255, (x >> 8) & 255, x & 255]);
  }
  var h = <int>[0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  final w = List<int>.filled(64, 0);
  for (var off = 0; off < bytes.length; off += 64) {
    for (var i = 0; i < 16; i++) {
      w[i] = (bytes[off + i * 4] << 24 | bytes[off + i * 4 + 1] << 16 | bytes[off + i * 4 + 2] << 8 | bytes[off + i * 4 + 3]) & _m32;
    }
    for (var i = 16; i < 64; i++) {
      final s0 = _rotr(w[i - 15], 7) ^ _rotr(w[i - 15], 18) ^ (w[i - 15] >> 3);
      final s1 = _rotr(w[i - 2], 17) ^ _rotr(w[i - 2], 19) ^ (w[i - 2] >> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & _m32;
    }
    var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (var i = 0; i < 64; i++) {
      final S1 = _rotr(e, 6) ^ _rotr(e, 11) ^ _rotr(e, 25);
      final ch = (e & f) ^ ((~e & _m32) & g);
      final t1 = (hh + S1 + ch + _k[i] + w[i]) & _m32;
      final S0 = _rotr(a, 2) ^ _rotr(a, 13) ^ _rotr(a, 22);
      final mj = (a & b) ^ (a & c) ^ (b & c);
      final t2 = (S0 + mj) & _m32;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) & _m32;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) & _m32;
    }
    h = [(h[0] + a) & _m32, (h[1] + b) & _m32, (h[2] + c) & _m32, (h[3] + d) & _m32, (h[4] + e) & _m32, (h[5] + f) & _m32, (h[6] + g) & _m32, (h[7] + hh) & _m32];
  }
  return h.map((x) => x.toRadixString(16).padLeft(8, '0')).join();
}

/// A wall-clock stamp the way `new Date().toISOString()` writes it (milliseconds, Z).
String isoStamp(DateTime d) => DateTime.fromMillisecondsSinceEpoch(d.millisecondsSinceEpoch, isUtc: true).toIso8601String();

/// app.js verifyChain over any list of entries (a record file's, or the ledger).
({bool ok, int count, int? brokenAt, String? head}) verifyEntries(List<dynamic> L) {
  for (var i = 0; i < L.length; i++) {
    final e = L[i] is Map ? (L[i] as Map) : const {};
    final body = {'i': e['i'], 'ts': e['ts'], 'type': e['type'], 'ref': e['ref'], 'data': e['data'], 'prev': e['prev']};
    final prev = i > 0 ? (L[i - 1] is Map ? (L[i - 1] as Map)['hash'] : null) : ledgerGenesis;
    if (e['i'] != i || e['prev'] != prev || sha256Hex(canon(body)) != e['hash']) {
      return (ok: false, count: L.length, brokenAt: i, head: null);
    }
  }
  return (ok: true, count: L.length, brokenAt: null, head: L.isNotEmpty ? '${(L.last as Map)['hash']}' : ledgerGenesis);
}

/// The exact bytes hashed for an entry (published in the export).
String preimage(Map e) => canon({'i': e['i'], 'ts': e['ts'], 'type': e['type'], 'ref': e['ref'], 'data': e['data'], 'prev': e['prev']});

/// V.record's file check: a record bundle's text, verified independently of the live state.
String verifyRecordText(String text) {
  Object? bundle;
  try {
    bundle = jsonDecode(text);
  } catch (_) {
    return 'Not valid JSON.';
  }
  final entries = bundle is Map && bundle['entries'] is List ? bundle['entries'] as List : const [];
  if (entries.isEmpty) return 'No entries in that file.';
  final chain = verifyEntries(entries);
  var preOk = true, preBad = -1;
  for (var i = 0; i < entries.length; i++) {
    final e = entries[i];
    if (preOk && e is Map && e['preimage'] is String) {
      if (sha256Hex(e['preimage'] as String) != e['hash'] || e['preimage'] != preimage(e)) {
        preOk = false;
        preBad = i;
      }
    }
  }
  if (chain.ok && preOk) {
    final first = entries.first as Map, last = entries.last as Map;
    return '${entries.length} entries verify · ${'${first['ts']}'.substring(0, 10)} → ${'${last['ts']}'.substring(0, 10)} · head ${'${last['hash']}'.substring(0, 12)}…';
  }
  if (!chain.ok) return 'chain breaks at entry ${chain.brokenAt} of ${entries.length}';
  return 'entry $preBad does not hash to its stated value';
}

// ---------- labels (EV_LABEL, eventLine, sealName) ----------

const evLabel = {
  'lesson': 'Lecture', 'problem': 'Problem', 'exam': 'Examination', 'diagnostic': 'Diagnostic', 'gate': 'Gate', 'week': 'Week sealed',
  'lab': 'Lab', 'day': 'Day sealed', 'streak': 'Streak', 'rep': 'Practice', 'quiz': 'Lecture quiz',
};

String _cap(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

String _s(Object? v) => v == null ? '' : '$v';

const _monShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/// app.js shortDay: "8 Nov".
String jsShortDay(String iso) => '${int.parse(iso.substring(8, 10))} ${_monShort[int.parse(iso.substring(5, 7)) - 1]}';

/// app.js fmtBHD: "BHD " and the amount to two places, grouped, trailing zeros dropped.
String numText(num v) {
  final r = jsRound(v * 100) / 100;
  if (r.isNaN) return 'NaN';
  var s = r.abs().toStringAsFixed(2);
  if (s.contains('.')) s = s.replaceFirst(RegExp(r'\.?0+$'), '');
  final dot = s.indexOf('.');
  final whole = dot < 0 ? s : s.substring(0, dot), frac = dot < 0 ? '' : s.substring(dot);
  final grouped = whole.replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ',');
  return '${r < 0 ? '-' : ''}$grouped$frac';
}

String fmtBHD(num v) => 'BHD ${numText(v)}';

/// What V.week's clipTitle does to a long line.
String clipTitle(String s, int n) => s.length > n ? '${s.substring(0, n - 1).replaceFirst(RegExp(r'[\s—·-]+$'), '')}…' : s;

// ---------- the engine's record ----------

typedef ChainCheck = ({bool ok, int count, int? brokenAt, String? head});

/// One sealed week, as the Past weeks list draws it.
typedef PastWeek = ({String title, String date, String shipped, String metrics, String notes});

/// What the Week page shows (V.review).
class WeekView {
  const WeekView({
    required this.w,
    required this.from,
    required this.sun,
    required this.sealed,
    required this.dsa,
    required this.proven,
    required this.counted,
    required this.earned,
    required this.state,
    required this.canSeal,
    required this.past,
  });
  final int w;
  final String from, sun;
  final Map<String, dynamic>? sealed;
  final int dsa, proven;
  final bool counted;
  final double earned;
  final String state;
  final bool canSeal;
  final List<PastWeek> past;
}

extension RecordEngine on Engine {
  List<dynamic> get ledger => S['ledger'] as List;
  List<dynamic> get anchors => S['anchors'] as List;
  Map<String, dynamic> get treasury => (S['treasury'] as Map).cast<String, dynamic>();
  String chainHead() => ledger.isNotEmpty ? '${(ledger.last as Map)['hash']}' : ledgerGenesis;

  /// app.js logEvent: append one entry committing to the one before it. [ts]
  /// is the wall clock (isoStamp); the caller saves.
  Map<String, dynamic> logEvent(String type, Object? ref, Object? data, String ts) {
    final prev = chainHead();
    final e = <String, dynamic>{
      'i': ledger.length,
      'ts': ts,
      'type': type,
      'ref': truthy(ref) ? '$ref' : '',
      'data': truthy(data) ? jsonDecode(jsonEncode(data)) : <String, dynamic>{},
      'prev': prev,
    };
    e['hash'] = sha256Hex(canon(e));
    ledger.add(e);
    return e;
  }

  ChainCheck verifyChain() => verifyEntries(ledger);

  /// app.js recordBundle (the "Download record" file).
  Map<String, dynamic> recordBundle(String exportedAt) => {
    'platform': 'Brickford',
    'startDate': START_DATE,
    'exportedAt': exportedAt,
    'count': ledger.length,
    'head': chainHead(),
    'genesis': ledgerGenesis,
    'howToVerify': [
      '1. For each entry: sha256(preimage) must equal its hash.',
      "   Shell check: printf '%s' \"<preimage>\" | shasum -a 256",
      '2. entry[i].prev must equal entry[i-1].hash; entry[0].prev must equal the genesis string.',
      '3. Any edited, inserted or removed entry changes every hash after it, so the chain stops matching.',
      '4. Timestamps are self-reported. Trust them only as far as the anchors below: each anchor is a head hash published somewhere with its own independent timestamp.',
    ],
    'anchors': anchors,
    'entries': [for (final e in ledger) {...(e as Map).cast<String, dynamic>(), 'preimage': preimage(e)}],
  };

  /// app.js eventLine: one ledger entry as a sentence.
  String eventLine(Map e) {
    final d = e['data'] is Map ? e['data'] as Map : const {};
    final ref = _s(e['ref']);
    String n(Object? v) => v is num ? _jsNum(v) : _s(v);
    switch (e['type']) {
      case 'exam':
        return 'Examination · $ref · ${n(d['pct'])}% (${n(d['score'])}/${n(d['total'])})';
      case 'diagnostic':
        return 'Diagnostic · $ref${d['score'] == null ? ' · completed' : ' · ${n(d['score'])}%'}';
      case 'gate':
        return '${truthy(d['passed']) ? 'Gate passed · ' : 'Gate un-marked · '}$ref';
      case 'week':
        return 'Week sealed · $ref${truthy(d['shipped']) ? ' · shipped: ${d['shipped']}' : ' · nothing shipped'}';
      case 'lab':
        return '${truthy(d['done']) ? 'Lab shipped · ' : 'Lab un-marked · '}$ref';
      case 'lesson':
        return '${truthy(d['done']) ? 'Lecture completed · ' : 'Lecture un-marked · '}$ref';
      case 'quiz':
        return 'Lecture quiz passed · $ref · ${truthy(d['firstTry']) ? n(d['firstTry']) : '0'} of ${truthy(d['total']) ? n(d['total']) : '0'} first try';
      case 'problem':
        return '${truthy(d['solved']) ? 'Problem solved · ' : 'Problem un-marked · '}$ref';
      case 'day':
        return 'Deep Track day sealed';
      case 'rep':
        return const {
              'bank': 'Story bank entry',
              'review': 'Monthly review written',
            }[ref] ??
            (ref == 'story'
                ? 'Story rep recorded${truthy(d['seconds']) ? ' · ${n(d['seconds'])}s' : ''}'
                : ref == 'humor'
                ? 'Humour rep · five attempts${truthy(d['keeper']) ? ' · kept #${n(d['keeper'])}' : ' · none kept'}'
                : 'Practice rep');
      case 'streak':
        return 'Streak reset to zero · previous run ${truthy(d['was']) ? n(d['was']) : '0'}d${truthy(d['best']) ? ' · longest ever ${n(d['best'])}d' : ''}';
    }
    return '${evLabel[e['type']] ?? e['type']} · $ref';
  }

  /// V.record's sealName: a lecture's code and place in its course, else the kind of entry.
  String sealName(Map e) {
    final ref = _s(e['ref']), p = ref.split('.');
    if (p.length == 3 && D.course(p[0]) != null) {
      final c = D.course(p[0])!, units = (c['units'] as List?) ?? const [];
      final ui = int.tryParse(p[1]), li = int.tryParse(p[2]);
      if (ui != null && li != null && ui >= 0 && ui < units.length && li >= 0 && li < ((units[ui] as Map)['lessons'] as List).length) {
        var n = li + 1;
        for (var u = 0; u < ui; u++) {
          n += ((units[u] as Map)['lessons'] as List).length;
        }
        return '${c['code']} · L$n';
      }
    }
    return evLabel['${e['type']}'] ?? _cap('${e['type']}');
  }

  String shortHash(String h) => '#${h.substring(0, h.length < 4 ? h.length : 4)}…${h.substring(h.length < 4 ? 0 : h.length - 4)}';

  // ---------- the day and the streak ----------

  /// app.js act "studied": seal today (a rest day is refused, so it cannot inflate the streak).
  bool sealDay(String ts) {
    final t = todayISO();
    if (isRestDay(t) && ge(t, START_DATE)) return false;
    final days = S['studyDays'] as List;
    if (!days.contains(t)) {
      days.add(t);
      logEvent('day', t, <String, dynamic>{}, ts);
    }
    return true;
  }

  bool get sealedToday => (S['studyDays'] as List).contains(todayISO());

  /// app.js act "resetStreak": move the line the counter starts from; delete nothing.
  void resetStreak(String ts) {
    final was = streak();
    settings['streakFrom'] = todayISO();
    logEvent('streak', todayISO(), {'was': was, 'best': bestStreak()}, ts);
  }

  // ---------- anchors ----------

  /// app.js act "addAnchor": null when it was added, else the refusal.
  String? addAnchor(String where, String url) {
    final wh = where.trim(), u = url.trim();
    if (wh.isEmpty && u.isEmpty) return 'Say where you published it.';
    if (ledger.isEmpty) return 'Nothing to anchor yet.';
    anchors.add({'date': todayISO(), 'head': chainHead(), 'where': wh, 'url': u});
    return null;
  }

  void removeAnchor(int i) {
    if (i >= 0 && i < anchors.length) anchors.removeAt(i);
  }

  // ---------- the Sunday week (V.review, logWeek) ----------

  /// The seal is Sunday only: the revision week's own Sunday has come (today >= sun).
  bool canSealWeek() => ge(todayISO(), revisionWeek(revisionWeekOf(todayISO())).sun);

  double revenueTotal() => treasury['entries'] is List
      ? (treasury['entries'] as List).fold<double>(0, (a, e) => a + (e is Map ? jsOr0(e['amount']) : 0))
      : 0;

  WeekView weekView() {
    final today = todayISO(), w = revisionWeekOf(today), rw = revisionWeek(w), from = rw.from, sun = rw.sun;
    bool inWeek(Object? iso) => iso is String && ge(iso, from) && lt(iso, sun);
    final sealed = sealedWeek(w);
    final proven = lessons.values.where((l) => l is Map && truthy(l['verified']) && inWeek(l['verifiedAt'])).length;
    final entries = (treasury['entries'] as List?) ?? const [];
    final counted = entries.isNotEmpty;
    final earned = jsRound(entries.where((e) => e is Map && inWeek(e['date'])).fold<double>(0, (a, e) => a + jsOr0((e as Map)['amount'])) * 100) / 100;
    final state = sealed != null
        ? 'Sealed ${jsShortDay('${sealed['date']}')}'
        : ge(today, sun)
        ? 'Ready to seal'
        : () {
            final n = daysBetween(today, sun);
            return 'Opens Sunday ${jsShortDay(sun)} · $n day${n == 1 ? '' : 's'}';
          }();
    final past = [for (final x in (S['weeks'] as List? ?? const [])) if (x is Map) x.cast<String, dynamic>()]
      ..sort((a, b) => ((jsPlus(b['week'])).isNaN ? 0 : jsPlus(b['week'])).compareTo((jsPlus(a['week'])).isNaN ? 0 : jsPlus(a['week'])));
    return WeekView(
      w: w,
      from: from,
      sun: sun,
      sealed: sealed,
      dsa: dsaCount(),
      proven: proven,
      counted: counted,
      earned: earned,
      state: state,
      canSeal: canSealWeek(),
      past: [
        for (final x in past)
          (
            title: 'Week ${_s(x['week'])}',
            date: truthy(x['date']) ? jsShortDay('${x['date']}') : '',
            shipped: truthy(x['shipped']) ? clipTitle(_s(x['shipped']), 60) : '',
            metrics: 'DSA ${_jsNum(jsOr0(x['dsa']))} · ${_jsNum(jsOr0(x['posts']))} post${jsOr0(x['posts']) == 1 ? '' : 's'} · ${fmtBHD(jsOr0(x['revenue'])).replaceFirst(' ', ' ')}',
            notes: truthy(x['notes']) ? _s(x['notes']) : 'No notes.',
          ),
      ],
    );
  }

  /// app.js act "logWeek": the revision week, sealed. Refused (null) unless
  /// it is the Sunday. Re-sealing replaces this week's entry; one from an
  /// earlier start with the same number is kept and the new one appended.
  Map<String, dynamic>? sealWeek({required String shipped, required String notes, required num posts, num? revenue, required String ts}) {
    if (!canSealWeek()) return null;
    final v = weekView(), w = v.w;
    final entry = <String, dynamic>{
      'week': w,
      'date': todayISO(),
      'shipped': shipped.trim(),
      'dsa': v.dsa,
      'posts': posts.isNaN ? 0 : posts,
      'revenue': v.counted ? v.earned : (revenue == null || revenue.isNaN ? 0 : revenue),
      'notes': notes.trim(),
    };
    final weeks = S['weeks'] as List, wFrom = revisionWeek(w).from;
    final i = weeks.indexWhere((x) => x is Map && jsPlus(x['week']) == w && ge(_s(x['date']), wFrom));
    if (i >= 0) {
      weeks[i] = entry;
    } else {
      weeks.add(entry);
    }
    logEvent('week', 'week$w', {'shipped': entry['shipped'], 'dsa': entry['dsa'], 'posts': entry['posts'], 'revenue': entry['revenue']}, ts);
    return entry;
  }

  // ---------- the Sunday revision PDFs (V.library) ----------

  /// T-055: the revision weeks that have a PDF in revision/.
  static const revisionPdfs = 6;

  /// app.js revisionLectures: the distinct lectures the plan puts in revision week [r] (no work-ahead re-anchoring).
  int revisionLectures(int r) {
    final rw = revisionWeek(r), keys = <String>{};
    planOnly = true;
    try {
      for (var iso = rw.from; le(iso, rw.to); iso = addDaysISO(iso, 1)) {
        for (final it in scheduledFor(iso)) {
          if (!it.pseudo) keys.add(it.key);
        }
      }
    } finally {
      planOnly = false;
    }
    return keys.length;
  }

  // ---------- the heatmap ----------

  /// V.record's heatmap level for a day: 0-4, or -1 void (before the start / after today), -2 a rest day.
  int heatLevel(String iso) {
    final today = todayISO();
    if (lt(iso, START_DATE) || gt(iso, today)) return -1;
    if (isRestDay(iso)) return -2;
    final a = dayActivity(iso);
    final lvl = a.lessons + a.problems + (a.sealed ? 1 : 0);
    return lvl > 4 ? 4 : lvl;
  }

  // ---------- the Treasury (V.treasury) ----------

  void saveOffer(String text) => treasury['offer'] = text;

  /// app.js addClient: false when over the cap (the caller confirms, then passes [force]).
  bool addClient(String name, String project, num price, {bool force = false}) {
    final n = name.trim();
    if (n.isEmpty) return true;
    final clients = treasury['clients'] as List;
    if (clients.length >= 2 && !force) return false;
    clients.add({'name': n, 'project': project.trim(), 'price': price.isNaN ? 0 : price});
    return true;
  }

  void removeClient(int i) {
    final clients = treasury['clients'] as List;
    if (i >= 0 && i < clients.length) clients.removeAt(i);
  }

  /// app.js addEntry: a payment on today's date. A zero (or no) amount is refused.
  bool addEntry(num amount, String note) {
    if (amount == 0 || amount.isNaN) return false;
    (treasury['entries'] as List).add({'date': todayISO(), 'amount': amount, 'note': note.trim()});
    return true;
  }

  void lockNiche(String id) => treasury['niche'] = id;
}
