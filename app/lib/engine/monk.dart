// Monk Mode's arithmetic: a 1:1 port of monkPrayerTimes, monkPlanFor,
// monkWeekSums, monkMonthSums, monkFocus and the page's Now/Next helpers in
// platform/js/app.js (T-054, T-057; T-064 stage 3). monkDay, monkScore, MONK,
// MONK_PRI and the start date (T-065: Engine.monkFrom, null until started) are
// already in engine.dart. The functions here that count from the start take it
// as `from`, so the not-started case cannot be forgotten by a caller.
//
// PORTED, NOT REDESIGNED: Ja'fari times for Manama (Fajr 17.7, Maghrib 4.5,
// Isha 14 degrees), the five prayers in three combined blocks, the owner's
// routine. tools/verify-app.js compares these with app.js over 7 dates.
//
// PRIVACY: S.monk never leaves the device (MONK_SYNCS = false). Only the start
// date (S.monkStart, T-065) syncs.
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dart:math' as math;

import 'dates.dart';
import 'engine.dart';

const MONK_GEO = (lat: 26.2285, lng: 50.586, tzh: 3); // Manama

/// 0 = Sunday.
int mkDow(String iso) => dowOf(iso);

/// Weeks run Sunday to Saturday.
String monkWeekStart(String iso) => addDaysISO(iso, -mkDow(iso));

/// Math.round: halves go up.
int _round(num x) => (x + 0.5).floor();

String _pad2(int n) => n.toString().padLeft(2, '0');

String mkHHMM(num m) {
  final r = _round(m);
  return '${_pad2((r / 60).floor() % 24)}:${_pad2(r % 60)}';
}

String mkDur(num m) {
  final r = _round(m);
  return r >= 60 ? '${(r / 60).floor()}h ${r % 60}m' : '${r}m';
}

/// Minutes from midnight for each time of the day (app.js monkPrayerTimes).
Map<String, double> monkPrayerTimes(String iso, [({num fajr, num maghrib, num isha, bool combine})? method]) {
  final M = method ?? Engine.PRAYER_METHOD;
  const LAT = 26.2285, LNG = 50.586;
  const d2r = math.pi / 180, r2d = 180 / math.pi;
  double S_(double x) => math.sin(x * d2r);
  double C_(double x) => math.cos(x * d2r);
  double T_(double x) => math.tan(x * d2r);
  double fix(double a, double b) {
    a = a - b * (a / b).floorToDouble();
    return a < 0 ? a + b : a;
  }

  double julian(int y, int m, int d) {
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    final A = (y / 100).floor(), B = 2 - A + (A / 4).floor();
    return (365.25 * (y + 4716)).floor() + (30.6001 * (m + 1)).floor() + d + B - 1524.5;
  }

  ({double decl, double eqt}) sun(double jd) {
    final D0 = jd - 2451545,
        g = fix(357.529 + 0.98560028 * D0, 360),
        q = fix(280.459 + 0.98564736 * D0, 360),
        L = fix(q + 1.915 * S_(g) + 0.02 * S_(2 * g), 360),
        e = 23.439 - 0.00000036 * D0;
    final RA = math.atan2(C_(e) * S_(L), C_(L)) * r2d / 15;
    return (decl: math.asin(S_(e) * S_(L)) * r2d, eqt: q / 15 - fix(RA, 24));
  }

  final jd = julian(int.parse(iso.substring(0, 4)), int.parse(iso.substring(5, 7)), int.parse(iso.substring(8, 10))) - LNG / (15 * 24);
  double noon(double t) => fix(12 - sun(jd + t).eqt, 24);
  double at(double angle, double t, bool ccw) {
    final dc = sun(jd + t).decl, n = noon(t), v = (1 / 15) * math.acos((-S_(angle) - S_(dc) * S_(LAT)) / (C_(dc) * C_(LAT))) * r2d;
    return n + (ccw ? -v : v);
  }

  double asr(double t) {
    final dc = sun(jd + t).decl;
    return at(-math.atan(1 / (1 + T_((LAT - dc).abs()))) * r2d, t, false);
  }

  const adj = 3 - LNG / 15;
  double m(double h) => (h + adj) * 60;
  return {
    'fajr': m(at(M.fajr.toDouble(), 5 / 24, true)),
    'sunrise': m(at(0.833, 6 / 24, true)),
    'dhuhr': m(noon(12 / 24)),
    'asr': m(asr(13 / 24)),
    'maghrib': m(at(M.maghrib.toDouble(), 18 / 24, false)),
    'isha': m(at(M.isha.toDouble(), 18 / 24, false)),
  };
}

typedef MonkEvent = ({num start, num end, String title, String kind});

/// The owner's routine (amendment 2026-10-23), in minutes from midnight (app.js monkPlanFor).
List<MonkEvent> monkPlanFor(String iso) {
  final w = mkDow(iso), pt = monkPrayerTimes(iso), ev = <MonkEvent>[];
  void add(num start, num mins, String title, [String kind = '']) => ev.add((start: start, end: start + mins, title: title, kind: kind));
  for (final s in Engine.monkSlots()) {
    add(pt[s.at]!, s.mins, s.label, 'prayer');
  }
  add(330, 10, 'Journaling');
  add(340, 20, 'Meditation');
  add(360, 90, 'Gym');
  add(360, 45, 'German — Easy German podcast');
  add(450, 180, 'Brickford — Deep Track');
  if (w == 5) add(480, 60, 'Grandmother — grave visit');
  add(630, 45, 'Scripting');
  add(720, 120, w == 0 || w == 3 ? 'Editing — stream → clips' : 'Working — business');
  add(830, 10, 'Post short-form');
  add(840, 90, 'Nap');
  add(930, 10, 'German — speaking');
  add(940, 10, 'German — writing');
  add(950, 70, 'Working — business');
  add(1080, 25, 'German — reading');
  if (w == 0) add(1080, 30, 'Weekly review');
  if (w == 2 || w == 6) {
    add(1140, 120, 'Stream (English)');
  } else {
    add(1105, 155, 'Working — business');
  }
  add(1260, 55, 'Reading');
  add(1315, 5, 'Plan tomorrow');
  // Array.prototype.sort is stable; so is this (insertion).
  for (var i = 1; i < ev.length; i++) {
    final p = ev[i];
    var j = i;
    while (j > 0 && ev[j - 1].start > p.start) {
      ev[j] = ev[j - 1];
      j--;
    }
    ev[j] = p;
  }
  return ev;
}

const MONK_HABITS = [
  ('meditate', 'Meditate'), ('read', 'Read'), ('clean', 'No TikTok · IG · YouTube'), ('plan', 'Plan tomorrow'),
];
const MONK_WEEK = [
  ('shorts', 'Short-form', 8), ('stream', 'Streams', 2), ('video', 'Videos', 2), ('scripts', 'Scripts', 4),
  ('gym', 'Gym', 5), ('book', 'Book', 1), ('work', 'Work hours', 70),
];
const MONK_MONTH = [('stream', 'Streams', 8), ('clips', 'Clips', 36)];
const MONK_NUMS = [
  ('gym', 'Gym'), ('shorts', 'Short-form posted'), ('video', 'Videos published'), ('scripts', 'Scripts written'),
  ('stream', 'Streams done'), ('clips', 'Clips cut'), ('book', 'Books finished'),
];

bool mkPhoneOk(Map<String, dynamic> d) => d['phone'] is num && (d['phone'] as num) < 2;

const MONK_FIX = {
  'prayers': "Stop what you're doing at the adhan alert. Pray first, then open anything else.",
  'german': "Do German listening on the run and speaking on the drive. Don't save it for later.",
  'nosin': "When the pull comes, get up and change rooms. Don't negotiate with it.",
  'bfh': 'Start the Deep Track before you check any messages.',
  'meditate': 'Meditate straight after journaling, same spot every day.',
  'read': 'Leave your phone in another room at 21:00 and read 20 pages.',
  'clean': 'Delete TikTok, Instagram and YouTube from the phone for the 21 days.',
  'plan': "The 21:55 alert is your cue: tick today, write tomorrow's 3, lights out.",
  'work': 'Protect the 12:00 and 18:25 blocks. No calls, no phone.',
  'phone': 'Set a 2-hour screen-time limit and keep the phone out of reach while you work.',
};

double _num(Object? v) => v is num ? v.toDouble() : (v is String ? (double.tryParse(v) ?? 0) : 0);

/// app.js monkLive: days logged before the start never count (the old store stays,
/// nothing is deleted); nothing counts while there is no start.
Map<String, dynamic> monkLive(Map<String, dynamic>? days, String? from) => {
  if (from != null)
    for (final e in (days ?? const <String, dynamic>{}).entries)
      if (e.key.compareTo(from) >= 0) e.key: e.value,
};

double mkSum(Map<String, dynamic> days, String key, String from, String to) {
  var t = 0.0;
  for (var i = from; le(i, to); i = addDaysISO(i, 1)) {
    final d = days[i];
    t += d is Map && truthy(d[key]) ? _num(d[key]) : 0;
  }
  return t;
}

Map<String, double> monkWeekSums(Map<String, dynamic>? days, String iso) {
  final a = monkWeekStart(iso), b = addDaysISO(a, 6);
  return {for (final k in MONK_WEEK) k.$1: mkSum(days ?? const {}, k.$1, a, b)};
}

Map<String, double> monkMonthSums(Map<String, dynamic>? days, String iso) {
  final a = '${iso.substring(0, 8)}01', b = addDaysISO('${addDaysISO(a, 32).substring(0, 8)}01', -1);
  return {for (final k in MONK_MONTH) k.$1: mkSum(days ?? const {}, k.$1, a, b)};
}

/// The weakest of the five priorities over the seven days before [today] (monk days only).
({int days, String key, String label, int rate, String fix})? monkFocus(Map<String, dynamic>? days, String today, String? from) {
  days ??= const {};
  if (from == null) return null; // T-065: not started, no days to count
  final end = addDaysISO(today, -1), list = <String>[];
  for (var i = addDaysISO(end, -6); le(i, end); i = addDaysISO(i, 1)) {
    if (ge(i, from)) list.add(i);
  }
  if (list.isEmpty) return null;
  int rate(bool Function(Map<String, dynamic>) f) =>
      _round(100 * list.where((i) => f(days![i] is Map ? (days[i] as Map).cast<String, dynamic>() : <String, dynamic>{})).length / list.length);
  final rows = [for (final p in Engine.MONK_PRI) (p.$1, p.$2, rate((d) => Engine.mkPriDone(d, p.$1)))];
  // stable sort by rate ascending: the first weakest in the owner's order
  var best = rows.first;
  for (final r in rows) {
    if (r.$3 < best.$3) best = r;
  }
  return (days: list.length, key: best.$1, label: best.$2, rate: best.$3, fix: MONK_FIX[best.$1] ?? '');
}

/// A prayer-day streak: full days back from [today] (app.js monkPrayerStreak).
int monkPrayerStreak(Map<String, dynamic> days, String today, String from) {
  final n = Engine.monkSlots().length;
  bool full(String i) => Engine.mkPrayed(days[i] is Map ? (days[i] as Map).cast<String, dynamic>() : <String, dynamic>{}) == n;
  var s = 0, i = today;
  if (!full(i)) i = addDaysISO(i, -1);
  while (ge(i, from) && full(i)) {
    s++;
    i = addDaysISO(i, -1);
  }
  return s;
}

const MONK_SEED_AT = '2026-10-22T00:00:00.000Z';
const MONK_SEEDS = [
  "Carousel 'Top 5 Claude Code skills': approved twice 6 Oct, never rebuilt: rebuild or drop",
  "Carousel 'OpenAI agent broke into a health portal': approved 24 Sep, never built: drop or reframe",
  'Connect your main Gmail in Claude',
  'Allow huggingface.co in the cloud environment',
];

Map<String, dynamic> monkSeedLoops() => {
  for (var i = 0; i < MONK_SEEDS.length; i++) 's${i + 1}': {'text': MONK_SEEDS[i], 'done': false, 'at': MONK_SEED_AT},
};

/// app.js monkStore: S.monk created on the first write, never by a render.
Map<String, dynamic> monkStore(Map<String, dynamic> S) {
  if (S['monk'] is! Map) S['monk'] = <String, dynamic>{};
  final m = (S['monk'] as Map).cast<String, dynamic>();
  if (m['days'] is! Map) m['days'] = <String, dynamic>{};
  if (m['plans'] is! Map) m['plans'] = <String, dynamic>{};
  if (m['loops'] is! Map) m['loops'] = monkSeedLoops();
  return m;
}
