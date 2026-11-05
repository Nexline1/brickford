// Monk Mode (T-064 stage 3): V.monk and wireMonk in platform/js/app.js, in the
// app's design. The day's five priorities are big tappable badges on a
// persistent card (blueprint section 5, Rhythm); only the five count in the
// ring. Under them: Now/Next from the plan, the 21-day map, the focus line,
// and Also (habits, phone, numbers, the week, open loops, tomorrow's plan).
//
// Local only: S.monk never syncs (MONK_SYNCS = false), and no write here arms a push.
import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../engine/dates.dart';
import '../../engine/engine.dart';
import '../../engine/monk.dart';
import '../../state/app_model.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/brickford_field.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';

void openMonk(BuildContext context) =>
    Navigator.of(context)
        .push(MaterialPageRoute(builder: (_) => const MonkScreen()));

const _months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const _days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/// "Thu 5 Nov" (app.js mkNice).
String mkNice(String iso) =>
    '${_days[mkDow(iso)]} ${int.parse(iso.substring(8))} ${_months[int.parse(iso.substring(5, 7)) - 1]}';

/// The day-score ring: gold arc on a raised track, the percentage inside.
class ScoreRing extends StatelessWidget {
  const ScoreRing(this.pct, {super.key, this.size = 64});
  final int pct;
  final double size;

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'day score $pct percent',
    child: SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _RingPainter(pct / 100),
        child: Center(
          child: Text(
            '$pct%',
            style: body(
              size * 0.26,
              color: Colors.white,
              weight: FontWeight.w800,
            ),
          ),
        ),
      ),
    ),
  );
}

class _RingPainter extends CustomPainter {
  _RingPainter(this.v);
  final double v;
  @override
  void paint(Canvas canvas, Size size) {
    final r = Rect.fromLTWH(4, 4, size.width - 8, size.height - 8);
    final p = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(r, 0, math.pi * 2, false, p..color = Tokens.badge);
    if (v > 0) {
      canvas.drawArc(
        r,
        -math.pi / 2,
        math.pi * 2 * v,
        false,
        p..color = Tokens.gold,
      );
    }
  }

  @override
  bool shouldRepaint(_RingPainter o) => o.v != v;
}

class MonkScreen extends StatefulWidget {
  const MonkScreen({super.key});
  @override
  State<MonkScreen> createState() => _MonkScreenState();
}

class _MonkScreenState extends State<MonkScreen> {
  int? sel; // the priority whose controls are open
  Timer? _tick;
  final loopText = TextEditingController();
  final plan = {
    for (final k in ['business', 'content', 'education'])
      k: TextEditingController(),
  };
  bool _init = false;

  @override
  void initState() {
    super.initState();
    // Now/Next follows the clock: rewritten in place, nothing stored.
    _tick = Timer.periodic(const Duration(seconds: 30), (_) => setState(() {}));
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_init) return;
    _init = true;
    final m = AppScope.of(context);
    final tp = m.monkPlans[addDaysISO(m.today, 1)];
    for (final k in plan.keys) {
      plan[k]!.text = tp is Map && tp[k] is String ? tp[k] as String : '';
    }
  }

  @override
  void dispose() {
    _tick?.cancel();
    loopText.dispose();
    for (final c in plan.values) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final m = AppScope.of(context);
    final iso = m.today,
        n = m.engine.monkDay(iso),
        before = lt(iso, Engine.MONK.from);
    final d = m.monkRec(iso), days = m.monkDays, w = mkDow(iso);
    final sc = Engine.monkScore(d);
    final weeks = (Engine.MONK.days / 7).ceil();
    final week = n != null ? 'Week ${(n - 1) ~/ 7 + 1} of $weeks' : '';
    final head = n != null
        ? 'Day $n of ${Engine.MONK.days}'
        : before
        ? 'Starts ${int.parse(Engine.MONK.from.substring(8))} ${_months[int.parse(Engine.MONK.from.substring(5, 7)) - 1]}'
        : '${Engine.MONK.days} days done';

    final header = Row(
      children: [
        KeyedSubtree(
          key: const ValueKey('monk-ring'),
          child: ScoreRing(sc.pct),
        ),
        SizedBox(width: 16.w),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(head, key: const ValueKey('monk-head'), style: display(26)),
              SizedBox(height: 4.h),
              Text(
                '${mkNice(iso)}${week.isEmpty ? '' : ' · $week'}',
                style: body(
                  14,
                  color: Tokens.onMidnight2,
                  weight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );

    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        header: header,
        onBack: () => Navigator.of(context).pop(),
        children: [
          _PriorityCard(
            m: m,
            d: d,
            days: days,
            iso: iso,
            score: sc,
            sel: sel,
            onSel: (i) => setState(() => sel = sel == i ? null : i),
          ),
          ..._nowNext(m, iso),
          ..._map(m, iso, days),
          ..._focus(days, iso),
          ..._also(m, d, w),
          ..._numbers(m, d, w),
          ..._sums(days, iso),
          ..._loops(m),
          ..._planTomorrow(m, iso),
        ],
      ),
    );
  }

  // ---------- Now / Next ----------
  List<Widget> _nowNext(AppModel m, String iso) {
    final t = m.now(), min = t.hour * 60 + t.minute;
    final evs = monkPlanFor(iso), pt = monkPrayerTimes(iso);
    final cands = evs.where((e) => e.start <= min && min < e.end).toList()
      ..sort(
        (a, b) =>
            (b.kind == 'prayer' ? 1 : 0) - (a.kind == 'prayer' ? 1 : 0) != 0
            ? (b.kind == 'prayer' ? 1 : 0) - (a.kind == 'prayer' ? 1 : 0)
            : b.start.compareTo(a.start),
      );
    final cur = cands.isEmpty ? null : cands.first;
    final nxt = evs.where((e) => e.start > min).firstOrNull;
    final np = Engine.monkSlots()
        .map((s) => (l: s.label, m: pt[s.at]!))
        .where((p) => p.m > min)
        .firstOrNull;
    return [
      const SheetLabel(Icons.schedule, 'Now'),
      _TimeRow(
        key: const ValueKey('monk-now'),
        time: 'Now',
        title: cur?.title ?? 'Free',
        meta: cur != null ? 'until ${mkHHMM(cur.end)}' : null,
        current: true,
      ),
      if (nxt != null)
        _TimeRow(
          time: mkHHMM(nxt.start),
          title: nxt.title,
          meta: 'in ${mkDur(nxt.start - min)}',
        ),
      if (np != null &&
          !(nxt != null &&
              nxt.kind == 'prayer' &&
              (nxt.start - np.m).abs() < 20))
        _TimeRow(
          time: mkHHMM(np.m),
          title: np.l,
          meta: 'adhan · in ${mkDur(np.m - min)}',
        ),
      ItemBlock(
        key: const ValueKey('monk-fullday'),
        leading: const LeadTile(icon: Icons.view_agenda_outlined),
        title: 'Full day',
        meta: '${evs.length}',
        onTap: () => showListSheet(
          context,
          title: 'Full day',
          rows: [
            for (final e in evs)
              _TimeRow(
                time: mkHHMM(e.start),
                title: e.title,
                muted: e.end <= min,
              ),
          ],
        ),
      ),
    ];
  }

  // ---------- the 21 days, three weeks of seven ----------
  List<Widget> _map(AppModel m, String iso, Map<String, dynamic> days) {
    final weeks = (Engine.MONK.days / 7).ceil();
    var sum = 0, past = 0;
    final rows = <Widget>[];
    for (var c = 0; c < weeks; c++) {
      final cells = <Widget>[];
      for (var r = 0; r < 7; r++) {
        final k = c * 7 + r;
        if (k >= Engine.MONK.days) {
          cells.add(const Expanded(child: SizedBox()));
          continue;
        }
        final di = addDaysISO(Engine.MONK.from, k);
        var pct = -1;
        if (!gt(di, iso)) {
          pct = Engine.monkScore(
            days[di] is Map ? (days[di] as Map).cast<String, dynamic>() : null,
          ).pct;
          if (lt(di, iso)) {
            sum += pct;
            past++;
          }
        }
        cells.add(
          Expanded(
            child: _MapCell(
              key: ValueKey('monk-map-$di'),
              iso: di,
              pct: pct,
              today: di == iso,
            ),
          ),
        );
      }
      rows.add(
        Padding(
          padding: EdgeInsets.only(bottom: 6.h),
          child: Row(children: cells),
        ),
      );
    }
    return [
      SheetLabel(
        Icons.grid_view_rounded,
        past > 0
            ? '${Engine.MONK.days} days · avg ${_round(sum / past)}%'
            : '${Engine.MONK.days} days',
      ),
      Semantics(
        label: 'Daily score, ${Engine.MONK.days} days',
        child: Column(children: rows),
      ),
    ];
  }

  // ---------- Focus: the weakest priority and its one-line fix ----------
  List<Widget> _focus(Map<String, dynamic> days, String iso) {
    final f = monkFocus(days, iso);
    return [
      const SheetLabel(Icons.center_focus_strong_outlined, 'Focus'),
      Container(
        key: const ValueKey('monk-focus'),
        padding: EdgeInsets.all(16.w),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(Tokens.cardRadius),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.white, Tokens.accentWash],
          ),
          border: Border.all(color: Tokens.hairline),
        ),
        child: f == null
            ? Text(
                iso == Engine.MONK.from
                    ? 'Starts tomorrow'
                    : 'Starts ${int.parse(addDaysISO(Engine.MONK.from, 1).substring(8))} ${_months[int.parse(Engine.MONK.from.substring(5, 7)) - 1]}',
                style: body(14.5, color: Tokens.ink2, weight: FontWeight.w600),
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${f.label} · ${f.rate}%',
                    style: body(15.5, weight: FontWeight.w800),
                  ),
                  if (f.fix.isNotEmpty) ...[
                    SizedBox(height: 6.h),
                    Text(
                      f.fix,
                      style: body(13.5, color: Tokens.ink2, height: 1.4),
                    ),
                  ],
                ],
              ),
      ),
    ];
  }

  // ---------- Also: the rest of the day, not in the ring ----------
  List<Widget> _also(AppModel m, Map<String, dynamic> d, int w) {
    final done =
        MONK_HABITS.where((h) => Engine.mkHabitDone(d, h.$1)).length +
        (mkPhoneOk(d) ? 1 : 0);
    return [
      SheetLabel(Icons.add_task, 'Also · $done of ${MONK_HABITS.length + 1}'),
      Wrap(
        spacing: 8.w,
        runSpacing: 8.h,
        children: [
          for (final h in MONK_HABITS)
            Semantics(
              identifier: 'monk-habit-${h.$1}',
              child: BrickChip(
                key: ValueKey('monk-habit-${h.$1}'),
                label: h.$2,
                icon: Engine.mkHabitDone(d, h.$1) ? Icons.check : null,
                selected: Engine.mkHabitDone(d, h.$1),
                onTap: () => m.monkPatch((x) => x[h.$1] = !truthy(x[h.$1])),
              ),
            ),
        ],
      ),
      SizedBox(height: 10.h),
      _StepRow(
        key: const ValueKey('monk-num-phone'),
        label: 'Phone hours',
        value: _n(d['phone']),
        target: 2,
        good: mkPhoneOk(d),
        onStep: (dir) => _step(m, 'phone', dir * 0.5),
      ),
    ];
  }

  List<Widget> _numbers(AppModel m, Map<String, dynamic> d, int w) => [
    const SheetLabel(Icons.numbers, 'Numbers'),
    for (final r in MONK_NUMS)
      if ((r.$1 != 'stream' || w == 2 || w == 6) &&
          (r.$1 != 'clips' || w == 0 || w == 3 || _n(d['clips']) > 0))
        _StepRow(
          key: ValueKey('monk-num-${r.$1}'),
          label: r.$2,
          value: _n(d[r.$1]),
          onStep: (dir) =>
              _step(m, r.$1, dir.toDouble(), max: r.$1 == 'gym' ? 1 : null),
        ),
  ];

  void _step(AppModel m, String k, double delta, {double? max}) =>
      m.monkPatch((d) {
        var v = math.max(0.0, ((_n(d[k]) + delta) * 2).roundToDouble() / 2);
        if (max != null) v = math.min(max, v);
        d[k] = v == v.truncateToDouble() ? v.toInt() : v;
      });

  // ---------- This week and this month ----------
  List<Widget> _sums(Map<String, dynamic> days, String iso) {
    final ws = monkWeekStart(iso),
        wk = monkWeekSums(days, iso),
        mo = monkMonthSums(days, iso);
    Widget prog(String l, double v, num t) => ItemBlock(
      title: l,
      meta:
          '${v == v.truncateToDouble() ? v.toInt() : double.parse(v.toStringAsFixed(1))} / $t',
      below: ProgressBar(math.min(1.0, v / t)),
    );
    return [
      SheetLabel(
        Icons.date_range_outlined,
        'This week · ${mkNice(ws).substring(4)} – ${mkNice(addDaysISO(ws, 6)).substring(4)}',
      ),
      for (final k in MONK_WEEK) prog(k.$2, wk[k.$1]!, k.$3),
      SheetLabel(Icons.calendar_view_month_outlined, 'This month'),
      for (final k in MONK_MONTH) prog(k.$2, mo[k.$1]!, k.$3),
    ];
  }

  // ---------- Open loops ----------
  List<Widget> _loops(AppModel m) {
    final loops = m.monkLoops;
    final ids = loops.keys.toList()
      ..sort((a, b) {
        final la = loops[a] as Map, lb = loops[b] as Map;
        final da = truthy(la['done']) ? 1 : 0, db = truthy(lb['done']) ? 1 : 0;
        if (da != db) return da - db;
        final c = '${la['at'] ?? ''}'.compareTo('${lb['at'] ?? ''}');
        return c != 0 ? c : a.compareTo(b);
      });
    final open = ids.where((k) => !truthy((loops[k] as Map)['done'])).length;
    return [
      SheetLabel(Icons.loop, open > 0 ? 'Open loops · $open' : 'Open loops'),
      for (final k in ids)
        _LoopRow(
          key: ValueKey('monk-loop-$k'),
          text: '${(loops[k] as Map)['text']}',
          done: truthy((loops[k] as Map)['done']),
          onTap: () => m.monkToggleLoop(k),
        ),
      Row(
        children: [
          Expanded(
            child: BrickfordField(
              key: const ValueKey('monk-loop-new'),
              icon: Icons.add,
              hint: 'Something to close',
              controller: loopText,
              onSubmitted: (_) => _addLoop(m),
            ),
          ),
          SizedBox(width: 10.w),
          PillButton(
            key: const ValueKey('monk-loop-add'),
            label: 'Add',
            expand: false,
            onPressed: () => _addLoop(m),
          ),
        ],
      ),
    ];
  }

  void _addLoop(AppModel m) {
    m.monkAddLoop(loopText.text);
    loopText.clear();
  }

  // ---------- Top 3 today, and tomorrow's plan ----------
  List<Widget> _planTomorrow(AppModel m, String iso) {
    final w = mkDow(iso), tm = addDaysISO(iso, 1);
    final today = m.monkPlans[iso] is Map
        ? (m.monkPlans[iso] as Map)
        : const {};
    final def = {
      'business': 'Decide the business idea: one hour, one page',
      'content': w == 2 || w == 6
          ? 'Stream at 19:00, script ready by 18:00'
          : w == 0 || w == 3
          ? 'Cut 4–5 clips from the stream'
          : 'Script one video, post one short',
      'education': 'Today’s Brickford lectures + their quizzes',
    };
    String pick(String k) => truthy(today[k]) ? '${today[k]}' : def[k]!;
    final tp = m.monkPlans[tm];
    return [
      const SheetLabel(Icons.looks_3_outlined, 'Top 3 today'),
      for (final g in [('B', 'business'), ('C', 'content'), ('E', 'education')])
        ItemBlock(
          leading: LeadTile(text: g.$1),
          title: pick(g.$2),
        ),
      SheetLabel(Icons.edit_calendar_outlined, 'Plan tomorrow · ${mkNice(tm)}'),
      BrickfordField(
        key: const ValueKey('monk-plan-business'),
        icon: Icons.work_outline,
        hint: 'Business',
        controller: plan['business'],
      ),
      SizedBox(height: 10.h),
      BrickfordField(
        key: const ValueKey('monk-plan-content'),
        icon: Icons.videocam_outlined,
        hint: 'Content',
        controller: plan['content'],
      ),
      SizedBox(height: 10.h),
      BrickfordField(
        key: const ValueKey('monk-plan-education'),
        icon: Icons.school_outlined,
        hint: 'Education',
        controller: plan['education'],
      ),
      SizedBox(height: 14.h),
      PillButton(
        key: const ValueKey('monk-plan-save'),
        icon: tp is Map ? Icons.check : Icons.save_outlined,
        label: 'Save',
        onPressed: () =>
            m.monkSavePlan({for (final e in plan.entries) e.key: e.value.text}),
      ),
    ];
  }
}

double _n(Object? v) => v is num ? v.toDouble() : 0;
int _round(num x) => (x + 0.5).floor();

/// The persistent card: the five priorities as big badges; tap one to open its controls.
class _PriorityCard extends StatelessWidget {
  const _PriorityCard({
    required this.m,
    required this.d,
    required this.days,
    required this.iso,
    required this.score,
    required this.sel,
    required this.onSel,
  });
  final AppModel m;
  final Map<String, dynamic> d, days;
  final String iso;
  final ({int done, int n, int pct}) score;
  final int? sel;
  final ValueChanged<int> onSel;

  static const _icons = {
    'prayers': Icons.mosque_outlined,
    'nosin': Icons.shield_outlined,
    'work': Icons.work_outline,
    'bfh': Icons.school_outlined,
    'german': Icons.translate,
  };
  static const _short = {
    'prayers': 'Prayer',
    'nosin': 'No sin',
    'work': 'Work',
    'bfh': 'Brickford',
    'german': 'German',
  };

  String _status(String k) {
    switch (k) {
      case 'prayers':
        return '${Engine.mkPrayed(d)}/${Engine.monkSlots().length}';
      case 'nosin':
        return d['nosin'] == true ? 'Held' : '–';
      case 'work':
        return '${_fmt(_n(d['work']))}/10h';
      case 'bfh':
        return '${_fmt(_n(d['bfh']))}/3h';
      default:
        final g = d['german'] is Map ? d['german'] as Map : const {};
        return '${Engine.MONK_GERMAN.where((x) => truthy(g[x.$1])).length}/4';
    }
  }

  static String _fmt(double v) =>
      v == v.truncateToDouble() ? '${v.toInt()}' : v.toStringAsFixed(1);

  @override
  Widget build(BuildContext context) {
    final pri = Engine.MONK_PRI;
    final streak = monkPrayerStreak(days, iso);
    return Container(
      key: const ValueKey('monk-card'),
      padding: EdgeInsets.fromLTRB(12.w, 14.h, 12.w, 14.h),
      decoration: BoxDecoration(
        color: Tokens.card,
        borderRadius: BorderRadius.circular(Tokens.cardRadius),
      ),
      child: Column(
        children: [
          Row(
            children: [
              for (var i = 0; i < pri.length; i++)
                Expanded(
                  child: _Badge(
                    key: ValueKey('monk-pri-${pri[i].$1}'),
                    id: pri[i].$1,
                    icon: _icons[pri[i].$1]!,
                    label: _short[pri[i].$1]!,
                    status: _status(pri[i].$1),
                    done: Engine.mkPriDone(d, pri[i].$1),
                    open: sel == i,
                    onTap: () => onSel(i),
                  ),
                ),
            ],
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 160),
            alignment: Alignment.topCenter,
            child: sel == null
                ? const SizedBox(width: double.infinity)
                : Padding(
                    padding: EdgeInsets.only(top: 14.h),
                    child: _controls(pri[sel!].$1, streak),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _controls(String k, int streak) {
    Widget toggle(
      String id,
      String label,
      String sub,
      bool on,
      VoidCallback tap,
    ) => Expanded(
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 3.w),
        child: _Toggle(
          key: ValueKey('monk-$id'),
          label: label,
          sub: sub,
          on: on,
          onTap: tap,
        ),
      ),
    );
    switch (k) {
      case 'prayers':
        final pt = monkPrayerTimes(iso),
            pr = d['prayers'] is Map ? d['prayers'] as Map : const {};
        return Column(
          children: [
            Row(
              children: [
                for (final s in Engine.monkSlots())
                  toggle(
                    'chip-${s.k}',
                    s.label,
                    mkHHMM(pt[s.at]!),
                    truthy(pr[s.k]),
                    () => m.monkPatch((x) {
                      final p = {
                        ...(x['prayers'] is Map
                            ? (x['prayers'] as Map).cast<String, dynamic>()
                            : <String, dynamic>{}),
                      };
                      p[s.k] = !truthy(p[s.k]);
                      x['prayers'] = p;
                    }),
                  ),
              ],
            ),
            if (streak > 0)
              Padding(
                padding: EdgeInsets.only(top: 10.h),
                child: Text(
                  '$streak-day streak',
                  style: body(
                    13,
                    color: Tokens.goldHi,
                    weight: FontWeight.w700,
                  ),
                ),
              ),
          ],
        );
      case 'nosin':
        return Row(
          children: [
            toggle(
              'nosin-toggle',
              'No sin today',
              '',
              d['nosin'] == true,
              () => m.monkPatch((x) => x['nosin'] = x['nosin'] != true),
            ),
          ],
        );
      case 'work':
      case 'bfh':
        final target = k == 'work' ? 10.0 : 3.0, v = _n(d[k]);
        return _Stepper(
          id: k,
          text: '${_fmt(v)} / ${_fmt(target)} h',
          good: v >= target,
          onMinus: () => _bump(k, -0.5),
          onPlus: () => _bump(k, 0.5),
        );
      default:
        final g = d['german'] is Map ? d['german'] as Map : const {};
        return Row(
          children: [
            for (final x in Engine.MONK_GERMAN)
              toggle(
                'german-${x.$1}',
                x.$2,
                '${x.$3} min',
                truthy(g[x.$1]),
                () => m.monkPatch((y) {
                  final gg = {
                    ...(y['german'] is Map
                        ? (y['german'] as Map).cast<String, dynamic>()
                        : <String, dynamic>{}),
                  };
                  gg[x.$1] = !truthy(gg[x.$1]);
                  y['german'] = gg;
                }),
              ),
          ],
        );
    }
  }

  void _bump(String k, double delta) => m.monkPatch((x) {
    final v = math.max(0.0, ((_n(x[k]) + delta) * 2).roundToDouble() / 2);
    x[k] = v == v.truncateToDouble() ? v.toInt() : v;
  });
}

/// One priority: a round badge, gold and filled when done; its short name and state under it.
class _Badge extends StatelessWidget {
  const _Badge({
    super.key,
    required this.id,
    required this.icon,
    required this.label,
    required this.status,
    required this.done,
    required this.open,
    required this.onTap,
  });
  final String id, label, status;
  final IconData icon;
  final bool done, open;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      identifier: 'monk-pri-$id',
      button: true,
      selected: open,
      label: '$label $status${done ? ', done' : ''}',
      excludeSemantics: true,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: done ? Tokens.gold : Tokens.badge,
                  border: Border.all(
                    color: open
                        ? Colors.white
                        : Tokens.gold.withValues(alpha: done ? 1 : 0.55),
                    width: open ? 2 : 1.2,
                  ),
                ),
                child: Icon(
                  done ? Icons.check_rounded : icon,
                  size: 24,
                  color: done ? Tokens.espresso : Tokens.gold,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                label,
                maxLines: 1,
                style: body(11.5, color: Colors.white, weight: FontWeight.w700),
              ),
              Text(
                status,
                maxLines: 1,
                style: body(
                  11,
                  color: done ? Tokens.goldHi : Tokens.onMidnight2,
                  weight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A chip on the dark card: gold and filled when on.
class _Toggle extends StatelessWidget {
  const _Toggle({
    super.key,
    required this.label,
    required this.sub,
    required this.on,
    required this.onTap,
  });
  final String label, sub;
  final bool on;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final fg = on ? Tokens.espresso : Colors.white;
    return Semantics(
      button: true,
      toggled: on,
      label: '$label $sub',
      excludeSemantics: true,
      child: Material(
        color: on ? Tokens.gold : Tokens.badge,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: BorderSide(color: Tokens.gold.withValues(alpha: on ? 1 : 0.55)),
        ),
        child: InkWell(
          customBorder: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          onTap: onTap,
          child: Container(
            constraints: const BoxConstraints(minHeight: 52),
            alignment: Alignment.center,
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  maxLines: 2,
                  textAlign: TextAlign.center,
                  style: body(
                    12.5,
                    color: fg,
                    weight: FontWeight.w800,
                    height: 1.2,
                  ),
                ),
                if (sub.isNotEmpty)
                  Text(
                    sub,
                    maxLines: 1,
                    style: body(
                      11,
                      color: on ? Tokens.espresso : Tokens.goldHi,
                      weight: FontWeight.w600,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Minus, the value, plus (44x44 each), on the dark card.
class _Stepper extends StatelessWidget {
  const _Stepper({
    required this.id,
    required this.text,
    required this.good,
    required this.onMinus,
    required this.onPlus,
  });
  final String id, text;
  final bool good;
  final VoidCallback onMinus, onPlus;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      _Round(
        key: ValueKey('monk-$id-minus'),
        icon: Icons.remove,
        tooltip: 'Less',
        onTap: onMinus,
      ),
      SizedBox(
        width: 140,
        child: Text(
          text,
          key: ValueKey('monk-$id-value'),
          textAlign: TextAlign.center,
          style: body(
            18,
            color: good ? Tokens.goldHi : Colors.white,
            weight: FontWeight.w800,
          ),
        ),
      ),
      _Round(
        key: ValueKey('monk-$id-plus'),
        icon: Icons.add,
        tooltip: 'More',
        onTap: onPlus,
      ),
    ],
  );
}

class _Round extends StatelessWidget {
  const _Round({
    super.key,
    required this.icon,
    required this.tooltip,
    required this.onTap,
    this.dark = true,
  });
  final IconData icon;
  final String tooltip;
  final VoidCallback onTap;
  final bool dark;

  @override
  Widget build(BuildContext context) => Tooltip(
    message: tooltip,
    child: Material(
      color: dark ? Tokens.badge : Colors.white,
      shape: CircleBorder(
        side: BorderSide(
          color: dark ? Tokens.gold.withValues(alpha: 0.55) : Tokens.hairline,
        ),
      ),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: SizedBox(
          width: 44,
          height: 44,
          child: Icon(
            icon,
            size: 22,
            color: dark ? Tokens.gold : Tokens.ink,
            semanticLabel: tooltip,
          ),
        ),
      ),
    ),
  );
}

/// A counter row on the sheet: label, then minus / value / plus.
class _StepRow extends StatelessWidget {
  const _StepRow({
    super.key,
    required this.label,
    required this.value,
    required this.onStep,
    this.target,
    this.good = false,
  });
  final String label;
  final double value;
  final double? target;
  final bool good;
  final void Function(int dir) onStep;

  @override
  Widget build(BuildContext context) {
    final v = value == value.truncateToDouble()
        ? '${value.toInt()}'
        : value.toStringAsFixed(1);
    return Padding(
      padding: EdgeInsets.only(bottom: 10.h),
      child: Container(
        constraints: const BoxConstraints(minHeight: 64),
        padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
        decoration: BoxDecoration(
          color: Tokens.fieldFill,
          borderRadius: BorderRadius.circular(Tokens.radius),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                label,
                maxLines: 2,
                style: body(14.5, weight: FontWeight.w700, height: 1.3),
              ),
            ),
            _Round(
              key: ValueKey('${(key as ValueKey).value}-minus'),
              icon: Icons.remove,
              tooltip: 'Less: $label',
              dark: false,
              onTap: () => onStep(-1),
            ),
            SizedBox(
              width: 64,
              child: Text(
                target == null ? v : '$v / ${target!.toInt()}',
                textAlign: TextAlign.center,
                style: body(
                  14.5,
                  color: good ? Tokens.done : Tokens.ink,
                  weight: FontWeight.w800,
                ),
              ),
            ),
            _Round(
              key: ValueKey('${(key as ValueKey).value}-plus'),
              icon: Icons.add,
              tooltip: 'More: $label',
              dark: false,
              onTap: () => onStep(1),
            ),
          ],
        ),
      ),
    );
  }
}

class _TimeRow extends StatelessWidget {
  const _TimeRow({
    super.key,
    required this.time,
    required this.title,
    this.meta,
    this.current = false,
    this.muted = false,
  });
  final String time, title;
  final String? meta;
  final bool current, muted;

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.only(bottom: 10.h),
    child: Container(
      constraints: const BoxConstraints(minHeight: 52),
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
      decoration: BoxDecoration(
        color: current ? Tokens.accentWash : Tokens.fieldFill,
        borderRadius: BorderRadius.circular(Tokens.radius),
        border: current
            ? Border.all(color: Tokens.accent.withValues(alpha: 0.35))
            : null,
      ),
      child: Row(
        children: [
          SizedBox(
            width: 54,
            child: Text(
              time,
              style: body(
                13,
                color: current ? Tokens.accent : Tokens.ink2,
                weight: FontWeight.w800,
              ),
            ),
          ),
          Expanded(
            child: Text(
              title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: body(
                14,
                color: muted ? Tokens.ink2 : Tokens.ink,
                weight: FontWeight.w700,
                height: 1.3,
              ),
            ),
          ),
          if (meta != null) ...[
            SizedBox(width: 8.w),
            Text(
              meta!,
              style: body(12.5, color: Tokens.ink2, weight: FontWeight.w700),
            ),
          ],
        ],
      ),
    ),
  );
}

class _LoopRow extends StatelessWidget {
  const _LoopRow({
    super.key,
    required this.text,
    required this.done,
    required this.onTap,
  });
  final String text;
  final bool done;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.only(bottom: 10.h),
    child: Semantics(
      button: true,
      toggled: done,
      label: text,
      excludeSemantics: true,
      child: Material(
        color: Tokens.fieldFill,
        borderRadius: BorderRadius.circular(Tokens.radius),
        child: InkWell(
          borderRadius: BorderRadius.circular(Tokens.radius),
          onTap: onTap,
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 56),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
              child: Row(
                children: [
                  Icon(
                    done ? Icons.check_circle : Icons.radio_button_unchecked,
                    color: done ? Tokens.done : Tokens.ringOpen,
                  ),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: Text(
                      text,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style:
                          body(
                            14,
                            color: done ? Tokens.ink2 : Tokens.ink,
                            weight: FontWeight.w600,
                            height: 1.3,
                          ).copyWith(
                            decoration: done
                                ? TextDecoration.lineThrough
                                : null,
                          ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

/// One day of the map: filled by the day's score, ringed when today, hollow when ahead.
class _MapCell extends StatelessWidget {
  const _MapCell({
    super.key,
    required this.iso,
    required this.pct,
    required this.today,
  });
  final String iso;
  final int pct; // -1: ahead
  final bool today;

  static const _ramp = [
    Tokens.fieldFill,
    Color(0xFFC9D8EC),
    Color(0xFF8FB0DD),
    Color(0xFF3F72B4),
    Tokens.accent,
  ];

  @override
  Widget build(BuildContext context) {
    final lv = pct < 0
        ? -1
        : (pct >= 90
              ? 4
              : pct >= 70
              ? 3
              : pct >= 40
              ? 2
              : pct > 0
              ? 1
              : 0);
    final fill = lv < 0 ? Colors.white : _ramp[lv];
    final fg = lv >= 3 ? Colors.white : Tokens.ink;
    return Semantics(
      label: '${mkNice(iso)}${pct >= 0 ? ', $pct%' : ''}',
      excludeSemantics: true,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 3),
        child: AspectRatio(
          aspectRatio: 1,
          child: Container(
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: fill,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: today
                    ? Tokens.ink
                    : (lv < 0 ? Tokens.hairline : Colors.transparent),
                width: today ? 2 : 1,
              ),
            ),
            child: Text(
              '${int.parse(iso.substring(8))}',
              style: body(
                12.5,
                color: lv < 0 ? Tokens.ink2 : fg,
                weight: FontWeight.w700,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
