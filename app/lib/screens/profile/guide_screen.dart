// The Handbook (V.guide): the daily loop in order, the weekly and monthly loops,
// the seven laws, the map of the rooms, and the phone notes. Text is the web
// page's; a row is a link only where there is somewhere to go.
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/blocks.dart';
import '../../widgets/pill_button.dart';
import '../../widgets/sheet_scaffold.dart';
import '../calendar/calendar_screen.dart';
import '../course/course_screen.dart';
import '../learn/atlas_screen.dart';
import '../library/library_screen.dart';
import '../practice/practice_screen.dart';
import '../record/proof_screen.dart';
import '../treasury/treasury_screen.dart';
import '../week/week_screen.dart';
import 'transcript_screen.dart';
import 'workshop_screen.dart';

void openGuide(BuildContext context) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const GuideScreen()));

/// A route of the web app, opened where the app has a page for it (null: a tab, or nowhere to go).
VoidCallback? _go(BuildContext context, String? route) {
  void push(Widget w) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => w));
  return switch (route) {
    '/' => () => Navigator.of(context).popUntil((r) => r.isFirst),
    '/course/cs150' => () => push(const CourseScreen(cid: 'cs150')),
    '/practice' => () => openPractice(context),
    '/review' => () => openWeek(context),
    '/transcript' => () => openTranscript(context),
    '/workshop' => () => openWorkshop(context),
    '/atlas' => () => push(const AtlasScreen()),
    '/record' => () => openProof(context),
    '/calendar' => () => openCalendar(context),
    '/treasury' => () => openTreasury(context),
    '/library' => () => openLibrary(context),
    _ => null,
  };
}

class GuideScreen extends StatelessWidget {
  const GuideScreen({super.key});

  @override
  Widget build(BuildContext context) {
    Widget row(String n, String title, String sub, [String? route]) => ItemBlock(leading: n.isEmpty ? null : LeadTile(text: n), title: title, subtitle: sub, subtitleLines: 4, onTap: _go(context, route));
    Widget room(String name, String when, String what, String route) => ItemBlock(title: name, subtitle: what, subtitleLines: 4, meta: when, onTap: _go(context, route));
    return Scaffold(
      backgroundColor: Tokens.midnight,
      body: SheetScaffold(
        onBack: () => Navigator.of(context).maybePop(),
        header: Text('The Handbook', key: const ValueKey('guide-title'), style: display(34)),
        children: [
          Container(
            padding: EdgeInsets.all(18.w),
            decoration: BoxDecoration(color: Tokens.card, borderRadius: BorderRadius.circular(Tokens.cardRadius)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: Text('The daily loop', style: body(16, color: Colors.white, weight: FontWeight.w800))),
                    Text('4–5h', style: body(15, color: Tokens.goldHi, weight: FontWeight.w800)),
                  ],
                ),
                SizedBox(height: 6.h),
                Text('Six days a week — Saturday is off, and taking it is following the plan, not breaking it. Same order every day.', style: body(13, color: Tokens.onMidnight2, height: 1.4)),
                SizedBox(height: 14.h),
                PillButton(key: const ValueKey('guide-today'), id: 'guide-today', label: 'Open Today', icon: Icons.play_arrow_rounded, onPressed: _go(context, '/')),
              ],
            ),
          ),
          SheetLabel(Icons.format_list_numbered_rounded, 'In this order'),
          row('1', 'Open Today', 'the day’s lectures, plus anything owed from earlier days', '/'),
          row('2', 'Theory · ~2h', 'the math rotation — Linear Algebra → Calculus → Probability'),
          row('3', 'Build · ~1.5h', 'today’s spine lecture + the two named NeetCode problems', '/course/cs150'),
          row('4', 'Drill · ~10 min', 'the questions you missed, served back until they stick'),
          row('5', 'Publish · ~30 min', 'the day’s rep — one real thing, two lines', '/practice'),
          row('6', 'Seal the day', 'the streak counts pressed days', '/'),
          _Fold(
            key: const ValueKey('guide-loops'),
            title: 'The weekly and monthly loops',
            count: '2',
            children: [
              SheetLabel(Icons.event_repeat_rounded, 'The weekly loop · Sunday · 30 min'),
              row('1', 'Week', 'what shipped, DSA, posts, revenue. No artifact = a failed week', '/review'),
              row('2', 'Sit one examination', 'one concept exam · ≥85% is Mastered · 40% of course mastery'),
              row('3', 'Export a backup', 'Profile → Sync. This device is the only copy until it syncs'),
              SheetLabel(Icons.calendar_month_outlined, 'The monthly loop · gate day'),
              row('1', 'Transcript & gates', 'pass a gate the day it is true — every later target moves earlier', '/transcript'),
              row('2', 'Lab audit', 'every done lab needs a proof URL — the list is your CV', '/workshop'),
            ],
          ),
          _Fold(
            key: const ValueKey('guide-laws'),
            title: 'The seven laws',
            count: '7',
            children: [
              row('1', 'Never just watch', 'Close the video, rebuild from memory, compare.'),
              row('2', 'The gates are honest or they are nothing', 'You grade yourself. Cheat and you cheat only yourself.'),
              row('3', 'Ship every week', 'A repo, a post, or a delivery. Or the week is failed.'),
              row('4', 'The drill is daily', 'Ten minutes. The miss pool maps what you don’t know.'),
              row('5', 'One niche, capped hours', '≤2h/day, max 2 clients, one niche. It funds the mission.'),
              row('6', 'Proof or it didn’t happen', 'No proof URL, no credit. Links are the only currency.'),
              row('7', 'Back up weekly', 'Export every Sunday. Restore anywhere.'),
            ],
          ),
          _Fold(
            key: const ValueKey('guide-map'),
            title: 'The map',
            count: '11 rooms',
            children: [
              room('Dashboard', 'daily', 'The next lecture, the rest of today, and where you stand.', '/'),
              room('The Atlas', 'weekly', 'What is running now, the gates ahead, and what opens later.', '/atlas'),
              room('Courses', 'reference', 'Pick a lecture back up: what is running, what opens later, what is finished.', ''),
              room('Problems', 'daily', 'Labs with proof URLs, pen-and-paper problem sets, and the daily drill.', '/workshop'),
              room('Exams', 'weekly', 'The official MIT/Harvard diagnostics, plus the auto-graded concept banks.', ''),
              room('Proof', 'monthly', 'The hash-chained record of everything done, the streak, and the export.', '/record'),
              room('Practice', 'daily', 'The speaking reps — story bank, story rep, humour rep, monthly review.', '/practice'),
              room('Week', 'Sunday', 'The sealing ritual. Feeds every chart and every number.', '/review'),
              room('Calendar', 'reference', 'Every day of the three years, and what belongs to each.', '/calendar'),
              room('Treasury', 'selling', 'The locked niche, the one offer, clients (max 2), and the revenue ledger.', '/treasury'),
              room('Library', 'reference', 'The founding documents and the outside courses.', '/library'),
            ],
          ),
          SheetLabel(Icons.phone_iphone_rounded, 'On your phone'),
          row('', 'Install it', 'iPhone: Safari → Share → Add to Home Screen. Android: Chrome → menu → Install app'),
          row('', 'Offline', 'everything works without a connection except the videos; progress syncs when you are back online'),
          SizedBox(height: 6.h),
          Container(
            padding: EdgeInsets.all(14.w),
            decoration: BoxDecoration(color: Tokens.fieldFill, borderRadius: BorderRadius.circular(Tokens.radius)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Right now — Phase 0, weeks 1–2', style: body(15, weight: FontWeight.w800)),
                SizedBox(height: 4.h),
                Text('Four things, then Phase 1 opens: three math diagnostics (≥70%), the coding diagnostic, GitHub/blog/X, and the Treasury’s first five moves.', style: body(13, color: Tokens.ink2, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// A folded group (the web page's details fold): its row opens and closes it.
class _Fold extends StatefulWidget {
  const _Fold({super.key, required this.title, required this.count, required this.children});
  final String title, count;
  final List<Widget> children;
  @override
  State<_Fold> createState() => _FoldState();
}

class _FoldState extends State<_Fold> {
  bool open = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ItemBlock(leading: LeadTile(icon: open ? Icons.expand_less_rounded : Icons.expand_more_rounded), title: widget.title, meta: widget.count, onTap: () => setState(() => open = !open)),
        if (open) ...widget.children,
      ],
    );
  }
}
