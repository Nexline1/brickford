// Problems and Exams as derived data (T-064 stage 4): app.js problemsDue
// (T-045) with psetDue, labDue, catchUpQuizzes and byPlan, and the ranked list
// V.exams draws. Derived on every read, like the lock: nothing here is stored.
// ignore_for_file: non_constant_identifier_names, constant_identifier_names
library;

import 'dates.dart';
import 'engine.dart';
import 'quiz.dart';

Map<String, dynamic> _m(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};

/// Array.prototype.sort is stable in JS; List.sort is not, so ties keep their order here.
List<T> stableSorted<T>(Iterable<T> xs, int Function(T a, T b) cmp) {
  final l = [for (final (i, x) in xs.indexed) (i, x)];
  l.sort((a, b) => cmp(a.$2, b.$2) != 0 ? cmp(a.$2, b.$2) : a.$1.compareTo(b.$1));
  return [for (final e in l) e.$2];
}

class DueQuiz {
  const DueQuiz(this.k, this.cid, this.ui, this.li, this.code, this.title);
  final String k, cid, title;
  final int ui, li;
  final String? code;
}

/// A "coming up" row: a pset or a lab not yet unlocked.
class Coming {
  const Coming(this.after, {this.pset, this.lab});
  final String after;
  final Map<String, dynamic>? pset, lab;
}

class ProblemsDue {
  const ProblemsDue({required this.quizzes, required this.catchUp, required this.psets, required this.labs, required this.review, required this.coming});
  final List<DueQuiz> quizzes, catchUp;
  final List<Map<String, dynamic>> psets, labs;
  final int review;
  final List<Coming> coming;
  int get n => quizzes.length + catchUp.length + psets.length + labs.length + (review > 0 ? 1 : 0);

  /// The due rows as the web page prints them (data-due:data-id), in order.
  List<String> get keys => [
    for (final q in quizzes) 'quiz:${q.k}',
    for (final q in catchUp) 'catchup:${q.k}',
    for (final p in psets) 'pset:${p['id']}',
    for (final l in labs) 'lab:${l['id']}',
    if (review > 0) 'review:drill',
  ];
}

extension ProblemsEngine on Engine {
  /// workshop.js PSETS flattened: every item with its group's course and url.
  List<Map<String, dynamic>> allPsets() => [
    for (final g in D.psets)
      for (final i in (g['items'] as List)) {'course': g['course'], 'url': g['url'], ..._m(i)},
  ];

  /// 0..3, by plan week.
  int currentPhase() {
    final w = weekNumber();
    return w > 78 ? 3 : (w > 26 ? 2 : (w > 2 ? 1 : 0));
  }

  /// A pset is due once the lecture that prepares for it is cleared.
  bool psetDue(Map<String, dynamic> i) => lessonCleared('${i['after']}') && !truthy(_m(S['psets'])[i['id']]);

  /// A lab: its lecture cleared AND the plan in the lab's phase.
  bool labDue(Map<String, dynamic> l) =>
      lessonCleared('${l['after']}') && currentPhase() >= (l['phase'] as num) && !truthy(_m(_m(S['labs'])[l['id']])['done']);

  int _byPlan(String a, String b) => (planDateOf(a) ?? '9999').compareTo(planDateOf(b) ?? '9999');

  /// Watched with a quiz, not passed; [grandfathered] picks the catch-up list
  /// (watched before the gate) or the owed ones (watched since).
  List<DueQuiz> _owedQuizzes(bool grandfatheredOnes) {
    final out = <DueQuiz>[];
    for (final c in D.courses) {
      final units = (c['units'] as List?) ?? const [];
      for (var ui = 0; ui < units.length; ui++) {
        final ls = units[ui]['lessons'] as List;
        for (var li = 0; li < ls.length; li++) {
          final k = lessonKey(c['id'] as String, ui, li);
          final st = lessons[k] is Map ? _m(lessons[k]) : null;
          if (st != null && truthy(st['done']) && hasQuiz(k) && !quizPassed(k) && Engine.grandfathered(st) == grandfatheredOnes) {
            out.add(DueQuiz(k, c['id'] as String, ui, li, c['code'] as String?, '${ls[li]['t']}'));
          }
        }
      }
    }
    return out;
  }

  List<DueQuiz> catchUpQuizzes() => _owedQuizzes(true);

  /// The lecture that prepares item k: its title and 1-based number in its course.
  ({String title, int n})? lessonOf(String k) {
    final p = k.split('.');
    if (p.length != 3 || D.course(p[0]) == null) return null;
    final f = flatLessons(p[0]);
    final i = f.indexWhere((x) => '${x.ui}' == p[1] && '${x.li}' == p[2]);
    return i < 0 ? null : (title: '${f[i].l['t']}', n: i + 1);
  }

  ProblemsDue problemsDue() {
    final quizzes = _owedQuizzes(false);
    final psets = stableSorted(allPsets().where(psetDue), (a, b) => _byPlan('${a['after']}', '${b['after']}'));
    final labs = stableSorted(D.labs.where(labDue), (a, b) => _byPlan('${a['after']}', '${b['after']}'));
    final review = missPool().where((p) => questionUnlocked(p.bankId, _m(((D.quizzes[p.bankId] as Map)['questions'] as List)[p.idx]))).length;
    // Not yet unlocked and not done, nearest first: a lab held only by its
    // phase sorts by the day its phase begins.
    String phaseStart(int ph) => dateForStudy(const [0, 12, 156, 468][ph]);
    String when(Coming it) {
      final d = planDateOf(it.after) ?? '9999', p = it.lab != null ? phaseStart((it.lab!['phase'] as num).toInt()) : '';
      return d.compareTo(p) > 0 ? d : p;
    }

    final coming = stableSorted<Coming>([
      for (final i in allPsets())
        if (!truthy(_m(S['psets'])[i['id']]) && !psetDue(i)) Coming('${i['after']}', pset: i),
      for (final l in D.labs)
        if (!truthy(_m(_m(S['labs'])[l['id']])['done']) && !labDue(l)) Coming('${l['after']}', lab: l),
    ], (a, b) => when(a).compareTo(when(b)));
    return ProblemsDue(quizzes: quizzes, catchUp: catchUpQuizzes(), psets: psets, labs: labs, review: review, coming: coming);
  }

  // ---------- V.exams ----------

  /// One exam on the list: a diagnostic (sat once, graded or logged) or a bank
  /// of questions (sat any number of times, best score kept).
  List<ExamItem> examItems() {
    final plan = gatePlan();
    final gate1 = plan.isNotEmpty ? plan.first : null;
    final gateLeft = gate1 != null && gate1.doneDate == null ? daysBetween(todayISO(), gate1.target) : null;
    final items = <ExamItem>[];
    for (final d in D.diagnostics) {
      final r = _m(_m(S['diag'])[d['id']]);
      final sat = r['score'] != null;
      final gate = d['gate'] as num?;
      final score = r['score'] is num ? (r['score'] as num).toInt() : null;
      final course = _courseWhere((x) => x['diagnostic'] == d['id']) ?? _courseWhere((x) => truthy(x['tracker']));
      final st = course != null && !truthy(course['tracker']) ? courseLessonStats(course) : null;
      items.add(ExamItem(
        kind: 'diag',
        id: '${d['id']}',
        href: '#/diag/${d['id']}',
        title: '${d['title']}',
        due: gateLeft,
        sat: sat,
        score: score,
        verdict: !sat ? null : (gate == null ? 'logged' : ((r['score'] is num && r['score'] >= gate) ? 'pass' : 'gap')),
        // Unsat diagnostics outrank everything; the sooner the gate, the higher.
        rank: sat ? 100 : (gateLeft == null ? 50 : (gateLeft < 0 ? 0 : gateLeft) / 1000),
        course: course,
        code: course != null ? '${course['code']}' : '${d['subject']}',
        size: '${d['minutes']} min',
        pass: gate?.toInt(),
        watched: st != null ? st.done : (course != null && truthy(course['tracker']) ? dsaCount() : 0),
        of: st != null ? st.total : (course != null && truthy(course['tracker']) ? 150 : 0),
      ));
    }
    for (final e in D.quizzes.entries) {
      final id = e.key, bank = _m(e.value), n = unlockedIdx(id).length, best = bestQuiz(id);
      final course = _courseWhere((x) => x['quiz'] == id);
      final st = course != null && !truthy(course['tracker']) ? courseLessonStats(course) : null;
      final cap = truthy(bank['perSitting']) ? (bank['perSitting'] as num).toInt() : 15;
      items.add(ExamItem(
        kind: 'bank',
        id: id,
        href: n > 0 ? '#/quiz/$id' : '#/courses',
        title: '${bank['title']}',
        locked: n == 0,
        sat: best != null,
        score: best,
        verdict: examVerdict(best),
        // +1 so that an unsat diagnostic ALWAYS outranks a bank; then open
        // and unsat, most-unlocked first.
        rank: 1 + (best != null ? 200 : 0) + (n > 0 ? 10 - (n / (bank['questions'] as List).length) * 10 : 300),
        course: course,
        code: course != null ? '${course['code']}' : '${bank['course']}',
        size: '${cap < n ? cap : n} questions',
        pass: examPassAt,
        watched: st != null ? st.done : (course != null && truthy(course['tracker']) ? dsaCount() : 0),
        of: st != null ? st.total : (course != null && truthy(course['tracker']) ? 150 : 0),
      ));
    }
    return stableSorted(items, (a, b) => a.rank.compareTo(b.rank));
  }

  Map<String, dynamic>? _courseWhere(bool Function(Map<String, dynamic>) f) {
    for (final c in D.courses) {
      if (f(c)) return c;
    }
    return null;
  }
}

class ExamItem {
  const ExamItem({
    required this.kind,
    required this.id,
    required this.href,
    required this.title,
    this.due,
    this.locked = false,
    required this.sat,
    required this.score,
    required this.verdict,
    required this.rank,
    required this.course,
    required this.code,
    required this.size,
    required this.pass,
    required this.watched,
    required this.of,
  });
  final String kind, id, href, title, code, size;
  final int? due, score, pass;
  final bool locked, sat;
  final String? verdict;
  final double rank;
  final Map<String, dynamic>? course;
  final int watched, of;

  /// "Linear Algebra — Qualifying Examination" -> "Linear Algebra qualifier" (a locked row).
  String get short {
    final p = title.split(' — ');
    if (p.length < 2) return title;
    return p[0] + (RegExp(r'^Qualifying').hasMatch(p[1]) ? ' qualifier' : (RegExp(r'^Concept').hasMatch(p[1]) ? ' concepts' : ''));
  }

  /// The score tag as the web page prints it: "74%" in a good or a crimson
  /// pill, "done" for a logged diagnostic, nothing for an exam not sat.
  String get tag => switch (verdict) {
    'pass' => 'good:$score%',
    'gap' => 'crimson:$score%',
    'logged' => 'good:done',
    _ => '',
  };
}
