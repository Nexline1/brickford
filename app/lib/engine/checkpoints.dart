// T-069: the near checkpoints, a 1:1 port of the checkpoint engine in
// platform/js/app.js (cpAuto, cpDaysLeft, checkpointsView, problemsThisWeek,
// cpToggle and the words the block draws: cpDateLabel, cpWhen, cpMeta,
// cpWeekLine).
//
// PORTED, NOT REDESIGNED. DAR.CHECKPOINTS is checkpoints.json; a tick is
// S.checkpoints[checkpointId][itemId] = {done, at}, merged per item by `at`
// (merge.dart) and carried in the sync payload once there are any, so a phone
// sync never drops one. An item with `auto` is derived from what the app already
// knows (lectures watched, the CS 150 tracker's count) and is never stored.
// Nothing here touches the schedule, the gates, the streak or START_DATE.
// tools/verify-app.js runs both engines over the same fixtures.
// ignore_for_file: non_constant_identifier_names
library;

import 'dates.dart';
import 'engine.dart';
import 'lecture_practice.dart';
import 'quiz.dart';

Map<String, dynamic> _m(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};

/// JS String(x) for the values a tick or a practice answer holds.
String _str(Object? v) {
  if (v is double && v.isFinite && v == v.truncateToDouble() && v.abs() < 1e21) return v.toInt().toString();
  return '$v';
}

const _mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/// app.js cpDateLabel: "6 Dec".
String cpDateLabel(String iso) => '${int.parse(iso.substring(8, 10))} ${_mon[int.parse(iso.substring(5, 7)) - 1]}';

/// One item as drawn: ticked or not, and whether the app ticks it (auto).
typedef CpItem = ({String id, bool done, bool auto});

/// One checkpoint as drawn (app.js checkpointsView).
class CpView {
  const CpView(this.id, this.date, this.title, this.left, this.n, this.of, this.state, this.items, this.texts);
  final String id, date, title;

  /// Calendar days from today to [date]: 0 on the day, negative after it.
  final int left;

  /// Ticked, of how many.
  final int n, of;

  /// "open", "today", "late" or "done".
  final String state;
  final List<CpItem> items;

  /// The items' text, in order.
  final List<String> texts;

  /// app.js cpWhen: "23d left", "today", "late" (never red), or "done".
  String get when => state == 'done' ? 'done' : state == 'late' ? 'late' : state == 'today' ? 'today' : '${left}d left';

  /// app.js cpMeta: "1/4 · 6 Dec · 23d left".
  String get meta => '$n/$of · ${cpDateLabel(date)} · $when';

  /// The JSON app.js's checkpointsView returns, for tools/verify-app.js.
  Map<String, dynamic> toJson() => {
    'id': id, 'date': date, 'left': left, 'n': n, 'of': of, 'state': state,
    'items': [for (final x in items) {'id': x.id, 'done': x.done, 'auto': x.auto}],
  };
}

/// app.js cpWeekLine.
String cpWeekLine(int n) => '$n problem${n == 1 ? '' : 's'} solved this week';

extension Checkpoints on Engine {
  List<Map<String, dynamic>> get cpList => D.checkpoints;

  /// An auto item's answer (true / false), or null for a manual one (app.js cpAuto).
  bool? cpAuto(Map<String, dynamic> it) {
    final a = it['auto'];
    if (!truthy(a) || a is! Map) return null;
    if (truthy(a['watched'])) return (a['watched'] as List).every((k) => truthy(_m(lessons['$k'])['done']));
    if (truthy(a['dsa'])) return dsaCount() >= (a['dsa'] as num);
    return null;
  }

  /// Calendar days from today to the checkpoint's date.
  int cpDaysLeft(Map<String, dynamic> c) => daysBetween(todayISO(), '${c['date']}');

  List<CpView> checkpointsView() {
    final store = _m(S['checkpoints']);
    return [
      for (final c in cpList)
        () {
          final mine = store[c['id']] is Map ? _m(store[c['id']]) : <String, dynamic>{};
          final raw = [for (final it in c['items'] as List) _m(it)];
          final items = <CpItem>[
            for (final it in raw)
              () {
                final a = cpAuto(it), t = mine['${it['id']}'];
                return (id: '${it['id']}', done: a ?? (t is Map && truthy(t['done'])), auto: a != null);
              }(),
          ];
          final left = cpDaysLeft(c), n = items.where((x) => x.done).length;
          return CpView('${c['id']}', '${c['date']}', '${c['title']}', left, n, items.length,
              n == items.length ? 'done' : left < 0 ? 'late' : left == 0 ? 'today' : 'open', items, [for (final it in raw) '${it['t']}']);
        }(),
    ];
  }

  /// "Problems solved this week": practice items marked got it or checked right (mark "ok") whose last change is
  /// today or one of the six days before (app.js problemsThisWeek).
  int problemsThisWeek() {
    final from = addDaysISO(todayISO(), -6), to = todayISO();
    var n = 0;
    for (final k in practice.keys) {
      for (final it in practiceItems(k)) {
        final ps = practiceOf(k, '${it['id']}');
        final at = ps == null || !truthy(ps['at']) ? '' : _str(ps['at']);
        final d = at.length > 10 ? at.substring(0, 10) : at;
        if (ps != null && ps['mark'] == 'ok' && d.compareTo(from) >= 0 && d.compareTo(to) <= 0) n++;
      }
    }
    return n;
  }

  /// The reader's tick (app.js cpToggle), stamped [ts]. False, and nothing stored, for an auto item or an unknown one.
  bool cpToggle(String cid, String iid, bool on, String ts) {
    final c = cpList.where((x) => x['id'] == cid).firstOrNull;
    final it = c == null ? null : [for (final x in c['items'] as List) _m(x)].where((x) => x['id'] == iid).firstOrNull;
    if (it == null || cpAuto(it) != null) return false;
    final store = _m(S['checkpoints']);
    S['checkpoints'] = store;
    if (store[cid] is! Map) store[cid] = <String, dynamic>{};
    final byId = _m(store[cid]);
    store[cid] = byId;
    byId[iid] = <String, dynamic>{'done': on, 'at': ts};
    return true;
  }
}
