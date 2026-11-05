// The quiz engine (T-064 stage 4): platform/js/quiz-engine.js (grading, the
// lecture quiz's mastery sitting, the bank sitting) and app.js's
// recordQuizPass, updateMisses, bestQuiz, questionUnlocked and unlockedBank,
// ported line for line. No Flutter in here: tools/verify-app.js runs it under
// plain Dart, with the same seeded random as the JS, and the two must agree
// on every question drawn, every option order and every outcome.
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dart:math' as math;

import 'engine.dart';

/// V.exams: a bank's best score of 70 or more is a pass, below is a gap.
const examPassAt = 70;

/// A diagnostic's own pass mark is its `gate` (null: logged, never graded).
String? examVerdict(int? best, [int passAt = examPassAt]) => best == null ? null : best >= passAt ? 'pass' : 'gap';

num _n(Object? v) => v is num ? v : 0;

/// JS `parseFloat(String(s))`: the longest numeric prefix after leading
/// whitespace; NaN when there is none.
double jsParseFloat(String s) {
  final m = RegExp(r'^\s*([+-]?(?:Infinity|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?))').firstMatch(s);
  if (m == null) return double.nan;
  return double.parse(m[1]!);
}

/// quiz-engine.js grade(): `q` is the question as presented (its `a` is the
/// answer's slot in the shuffled options); `given` is a slot, or typed text.
bool gradeAnswer(Map<String, dynamic> q, Object? given) {
  if (q['opts'] != null) return given == q['a'];
  final tol = q['tol'] != null ? _n(q['tol']).toDouble() : 1e-6;
  final v = jsParseFloat('$given'.replaceFirst(',', '.'));
  final want = q['num'];
  return v.isFinite && want is num && (v - want).abs() <= tol;
}

/// quiz-engine.js shuffle(), over an injectable random (the JS uses Math.random).
List<T> shuffled<T>(List<T> a, double Function() rand) {
  final r = [...a];
  for (var i = r.length - 1; i > 0; i--) {
    final j = (rand() * (i + 1)).floor();
    final t = r[i];
    r[i] = r[j];
    r[j] = t;
  }
  return r;
}

double Function() randomSource([math.Random? r]) {
  final g = r ?? math.Random();
  return g.nextDouble;
}

Map<String, dynamic> _present(Map<String, dynamic> q, List<int> perm) => {
  ...q,
  'opts': [for (final i in perm) (q['opts'] as List)[i]],
  'a': perm.indexOf((q['a'] as num).toInt()),
  'perm': perm,
};

class SittingResult {
  const SittingResult({required this.total, required this.firstTry, required this.attempts, required this.missed});
  final int total, firstTry, attempts;
  final List<int> missed;
}

/// What a sitting screen needs from either kind of sitting.
abstract interface class Sitting {
  Map<String, dynamic>? get q;
  int get pos; // 0-based, the question on screen
  int get n;
  List<String> get seg; // '', 'ok' or 'miss' per question
  bool get answered;
  bool get isLast;
  bool get over;
  bool get again;
  bool? answer(Object given);
  void next();
}

class _Item {
  _Item(this.bi, this.pos, this.again);
  final int bi, pos;
  final bool again;
}

/// The lecture quiz (quiz-engine.js mastery()): every question, not a draw. A
/// miss turns its segment red and comes back at the end, options reshuffled
/// into an order it was not just shown in. It ends when every question has
/// been answered right once; the first-try score is what is kept.
class MasterySitting implements Sitting {
  MasterySitting(List<dynamic> questions, {double Function()? rand})
    : qsrc = [for (final q in questions) (q as Map).cast<String, dynamic>()],
      _rand = rand ?? randomSource() {
    n = qsrc.length;
    final order = shuffled([for (var i = 0; i < n; i++) i], _rand);
    for (var pos = 0; pos < order.length; pos++) {
      queue.add(_Item(order[pos], pos, false));
    }
    seg = List<String>.filled(n, '');
    step();
  }

  final List<Map<String, dynamic>> qsrc;
  final double Function() _rand;
  @override
  late final int n;
  final _lastPerm = <int, List<int>>{};
  final queue = <_Item>[];
  @override
  late final List<String> seg;
  final missed = <int>[];
  int firstTry = 0, attempts = 0;
  _Item? _cur;
  @override
  Map<String, dynamic>? q;
  @override
  bool answered = false, over = false;

  /// The bank index of the question on screen, and whether it is a retry.
  int? get bi => _cur?.bi;
  @override
  int get pos => _cur?.pos ?? 0;
  @override
  bool get again => _cur?.again ?? false;

  /// The answer button reads "Finish" when nothing is left to ask.
  @override
  bool get isLast => queue.isEmpty;

  Map<String, dynamic> _presentAt(int bi) {
    final src = qsrc[bi];
    if (src['opts'] == null) return src;
    final len = (src['opts'] as List).length;
    final prev = _lastPerm[bi];
    var p = shuffled([for (var i = 0; i < len; i++) i], _rand);
    for (var guard = 0; prev != null && len > 1 && p.join(',') == prev.join(',') && guard < 50; guard++) {
      p = shuffled([for (var i = 0; i < len; i++) i], _rand);
    }
    _lastPerm[bi] = p;
    return _present(src, p);
  }

  void step() {
    if (over) return;
    if (queue.isEmpty) {
      over = true;
      return;
    }
    _cur = queue.removeAt(0);
    q = _presentAt(_cur!.bi);
    answered = false;
  }

  /// Null when there is nothing to answer (already answered, or over).
  @override
  bool? answer(Object given) {
    if (answered || over || q == null) return null;
    answered = true;
    attempts++;
    final ok = gradeAnswer(q!, given);
    final c = _cur!;
    if (ok) {
      if (!c.again) firstTry++;
      if (seg[c.pos] != 'miss') seg[c.pos] = 'ok';
    } else {
      seg[c.pos] = 'miss';
      if (!missed.contains(c.bi)) missed.add(c.bi);
      queue.add(_Item(c.bi, c.pos, true));
    }
    return ok;
  }

  /// "Next question" / "Finish": only after an answer.
  @override
  void next() {
    if (answered) step();
  }

  SittingResult? get result => over ? SittingResult(total: n, firstTry: firstTry, attempts: attempts, missed: [...missed]) : null;
}

/// A bank's sitting (quiz-engine.js mount() without `mastery`): a draw of
/// perSitting questions, options shuffled, one score at the end.
class BankSitting implements Sitting {
  BankSitting(List<dynamic> questions, int? perSitting, {double Function()? rand}) : _rand = rand ?? randomSource() {
    final src = [for (final q in questions) (q as Map).cast<String, dynamic>()];
    final cap = (perSitting != null && perSitting != 0) ? perSitting : 15;
    n = math.min(cap, src.length);
    order = shuffled([for (var i = 0; i < src.length; i++) i], _rand).take(n).toList();
    qs = [
      for (final i in order)
        src[i]['opts'] == null
            ? src[i]
            : _present(src[i], shuffled([for (var j = 0; j < (src[i]['opts'] as List).length; j++) j], _rand)),
    ];
  }

  final double Function() _rand;
  @override
  late final int n;
  late final List<int> order;
  late final List<Map<String, dynamic>> qs;
  int idx = 0, score = 0;
  @override
  bool answered = false;
  bool finished = false;
  final results = <({bool ok, int bi})>[];

  @override
  Map<String, dynamic>? get q => finished || idx >= n ? null : qs[idx];
  @override
  bool get isLast => idx == n - 1;
  @override
  int get pos => idx;
  @override
  bool get over => finished;
  @override
  bool get again => false;
  @override
  List<String> get seg => [for (var i = 0; i < n; i++) i < results.length ? (results[i].ok ? 'ok' : 'miss') : ''];

  @override
  bool? answer(Object given) {
    if (answered || finished || q == null) return null;
    answered = true;
    final ok = gradeAnswer(q!, given);
    if (ok) score++;
    results.add((ok: ok, bi: order[idx]));
    return ok;
  }

  @override
  void next() {
    if (!answered || finished) return;
    idx++;
    answered = false;
    if (idx >= n) finished = true;
  }

  int get pct => n == 0 ? 0 : (score / n * 100 + 0.5).floor();
  List<int> get missedBank => [for (final r in results) if (!r.ok) r.bi];
  List<int> get correctBank => [for (final r in results) if (r.ok) r.bi];
}

Map<String, dynamic> _m(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};

/// What the quiz state does to S, as app.js writes it.
extension QuizEngine on Engine {
  /// courseLessonStats(c): { total, done, verified } over the course's lectures.
  ({int total, int done, int verified}) courseLessonStats(Map<String, dynamic> c) {
    var total = 0, done = 0, verified = 0;
    final units = (c['units'] as List?) ?? const [];
    for (var ui = 0; ui < units.length; ui++) {
      final ls = units[ui]['lessons'] as List;
      for (var li = 0; li < ls.length; li++) {
        total++;
        final st = _m(lessons[lessonKey(c['id'] as String, ui, li)]);
        if (truthy(st['done'])) done++;
        if (truthy(st['verified'])) verified++;
      }
    }
    return (total: total, done: done, verified: verified);
  }

  int dsaCount() => _m(S['problems']).values.where(truthy).length;

  /// recordQuizPass(k, res): the quiz record, written once on finish. A pass
  /// is permanent: a later sitting only raises the best first-try score, and
  /// unmarking watched never touches it. [at] is the wall clock (a full ISO stamp).
  void recordQuizPass(String k, SittingResult res, String at) {
    final st = lessons[k] is Map ? _m(lessons[k]) : <String, dynamic>{'done': false, 'notes': '', 'checks': <dynamic>[]};
    final was = st['quiz'];
    final ft = res.firstTry, total = res.total, att = res.attempts;
    if (was is Map && truthy(was['passedAt'])) {
      double share(num t, num f) => t > 0 ? f / t : 0;
      final a = share(total, ft), b = share(_n(was['total']), _n(was['firstTry']));
      if (a > b || (a == b && total > _n(was['total']))) {
        was['firstTry'] = ft;
        was['total'] = total;
        was['attempts'] = att;
      }
    } else {
      st['quiz'] = {'passedAt': todayISO(), 'at': at, 'firstTry': ft, 'total': total, 'attempts': att};
    }
    lessons[k] = st;
  }

  // ---------- the banks (Exams) ----------

  int? bestQuiz(String bankId) {
    final at = _m(S['quizAttempts'])[bankId];
    if (at is! List || at.isEmpty) return null;
    return at.map((a) => _n(_m(a)['pct']).toInt()).reduce(math.max);
  }

  /// Miss pool: wrong answers join, later correct answers on the same question leave.
  void updateMisses(String bankId, List<int> missed, List<int> correct) {
    final misses = _m(S['quizMisses']);
    final cur = <int>{...((misses[bankId] as List?) ?? const []).whereType<num>().map((e) => e.toInt())};
    cur.removeAll(correct);
    cur.addAll(missed);
    misses[bankId] = cur.toList();
  }

  List<({String bankId, int idx})> missPool() {
    final out = <({String bankId, int idx})>[];
    for (final b in _m(S['quizMisses']).keys) {
      final bank = D.quizzes[b];
      if (bank is! Map) continue;
      final qs = bank['questions'] as List;
      for (final i in (_m(S['quizMisses'])[b] as List? ?? const []).whereType<num>()) {
        if (i.toInt() >= 0 && i.toInt() < qs.length && qs[i.toInt()] != null) out.add((bankId: b, idx: i.toInt()));
      }
    }
    return out;
  }

  bool questionUnlocked(String bankId, Map<String, dynamic> q) {
    if (truthy(q['after'])) return truthy(_m(lessons['${q['after']}'])['done']);
    Map<String, dynamic>? course;
    for (final c in D.courses) {
      if (c['quiz'] == bankId) {
        course = c;
        break;
      }
    }
    if (course == null) return false;
    return courseLessonStats(course).done > 0 || (truthy(course['tracker']) && dsaCount() > 0);
  }

  List<int> unlockedIdx(String bankId) {
    final bank = D.quizzes[bankId];
    if (bank is! Map) return [];
    final qs = bank['questions'] as List;
    return [for (var i = 0; i < qs.length; i++) if (questionUnlocked(bankId, _m(qs[i]))) i];
  }

  /// A bank restricted to what you have covered (questions, perSitting, and the map back to the bank).
  ({List<Map<String, dynamic>> questions, int perSitting, List<int> map, int total}) unlockedBank(String bankId) {
    final bank = _m(D.quizzes[bankId]);
    final idx = unlockedIdx(bankId);
    final all = bank['questions'] as List;
    final cap = truthy(bank['perSitting']) ? _n(bank['perSitting']).toInt() : 15;
    return (questions: [for (final i in idx) _m(all[i])], perSitting: math.min(cap, idx.length), map: idx, total: all.length);
  }

  /// A finished bank sitting: the attempt, and the miss pool (the sitting's
  /// indices are into the unlocked subset; [u.map] takes them back to the bank).
  void recordExam(String bankId, BankSitting s, List<int> map) {
    final at = (S['quizAttempts'] as Map).putIfAbsent(bankId, () => <dynamic>[]) as List;
    at.add({'date': todayISO(), 'score': s.score, 'total': s.n, 'pct': s.pct});
    updateMisses(bankId, [for (final i in s.missedBank) map[i]], [for (final i in s.correctBank) map[i]]);
  }

  /// saveDiag: a graded diagnostic keeps its rounded score (Math.round) and the date.
  bool recordDiag(String id, double? v) {
    if (v == null || !v.isFinite) return false;
    (S['diag'] as Map)[id] = {'score': (v + 0.5).floor(), 'date': todayISO()};
    return true;
  }

  /// saveDiagDone: a diagnostic with no grade (the coding one) is marked complete.
  void recordDiagDone(String id) => (S['diag'] as Map)[id] = {'score': null, 'date': todayISO()};

  /// The pset / lab checkboxes: S.psets[id] is the date or false; S.labs[id].done.
  void setPset(String id, bool on) => (S['psets'] as Map)[id] = on ? todayISO() : false;

  void setLab(String id, bool on) {
    final labs = S['labs'] as Map;
    final st = labs[id] is Map ? _m(labs[id]) : <String, dynamic>{'done': false, 'proof': ''};
    st['done'] = on;
    labs[id] = st;
  }

  void setLabProof(String id, String proof) {
    final labs = S['labs'] as Map;
    final st = labs[id] is Map ? _m(labs[id]) : <String, dynamic>{'done': false, 'proof': ''};
    st['proof'] = proof.trim();
    labs[id] = st;
  }

  /// The NeetCode tracker: S.problems["Category|Name"] is the date solved, or false.
  void setProblem(String key, bool on) => (S['problems'] as Map)[key] = on ? todayISO() : false;
}
