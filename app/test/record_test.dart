// T-064 stage 5: the Sunday seal, Record and Treasury, through the app.
//
// The plan: START_DATE 2026-10-16 (a Friday), so the first revision Sunday is 25 Oct and
// Sunday 8 Nov closes revision week 3 (1-7 Nov). 7 Nov is the Saturday rest
// day, 9 Nov the Monday that opens week 5.
import 'dart:convert';

import 'package:app/engine/record.dart';
import 'package:app/engine/engine.dart' show truthy;
import 'package:app/engine/quiz.dart';
import 'package:app/main.dart';
import 'package:app/screens/library/library_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<AppModel> model(Map<String, dynamic> state, {String today = '2026-11-08'}) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today, now: () => DateTime.utc(2026, 11, 8, 9, 30, 15, 123));
}

Future<void> open(WidgetTester tester, AppModel m) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
}

Finder key(String s) => find.byKey(ValueKey(s));

/// Scrolls the page until [k] is built and on screen (the sheet's list builds lazily).
Future<void> reveal(WidgetTester t, String k) async {
  final f = key(k), sc = find.descendant(of: find.byKey(SheetScaffold.sheetKey).last, matching: find.byType(Scrollable)).first;
  for (var i = 0; i < 80 && f.evaluate().isEmpty; i++) {
    await t.drag(sc, const Offset(0, -250));
    await t.pump();
  }
  for (var i = 0; i < 80 && f.evaluate().isEmpty; i++) {
    await t.drag(sc, const Offset(0, 250));
    await t.pump();
  }
  await Scrollable.ensureVisible(t.element(f), alignment: 0.5);
  await t.pumpAndSettle();
}

void main() {
  test('the seal is Sunday only: the revision week own Sunday and no other day', () async {
    final sat = await model({}, today: '2026-11-07'), sun = await model({}), mon = await model({}, today: '2026-11-09');
    expect(sat.engine.canSealWeek(), isFalse);
    expect(sun.engine.canSealWeek(), isTrue);
    expect(mon.engine.canSealWeek(), isFalse);
    expect(sat.sealWeek(shipped: 'x', notes: '', posts: 0), isFalse, reason: 'refused on the Saturday');
    expect(sat.engine.S['weeks'], isEmpty);
    expect(sat.engine.ledger, isEmpty);
    expect(sat.engine.weekView().state, 'Opens Sunday 8 Nov · 1 day');
    expect(mon.engine.weekView().state, 'Opens Sunday 15 Nov · 6 days');
    expect(sun.engine.weekView().state, 'Ready to seal');
  });

  testWidgets('sealing a week: the entry, the ledger event, a week from before the reset kept beside it', (tester) async {
    final m = await model({
      'weeks': [
        {'week': 3, 'date': '2026-09-27', 'shipped': 'old start', 'dsa': 1, 'posts': 0, 'revenue': 0, 'notes': ''},
      ],
      'problems': {'Arrays|Two Sum': '2026-11-03', 'Arrays|Valid Anagram': '2026-11-04'},
    });
    await open(tester, m);
    await tester.tap(key('chip-week'));
    await tester.pumpAndSettle();
    expect(find.text('Week 3'), findsOneWidget);
    expect(find.text('Ready to seal'), findsOneWidget);
    await tester.enterText(key('week-shipped'), 'a repo');
    await tester.tap(key('posts-plus'));
    await tester.tap(key('posts-plus'));
    await tester.pump();
    await tester.tap(key('week-seal'));
    await tester.pumpAndSettle();
    final weeks = (m.engine.S['weeks'] as List).cast<Map>();
    expect(weeks.length, 2, reason: 'the pre-reset week 3 is kept beside the new one (revisionWeek.from)');
    final mine = weeks.last;
    expect(mine['week'], 3);
    expect(mine['date'], '2026-11-08');
    expect(mine['shipped'], 'a repo');
    expect(mine['posts'], 2);
    expect(mine['dsa'], 2);
    expect(m.engine.ledger.length, 1);
    final ev = m.engine.ledger.single as Map;
    expect(ev['type'], 'week');
    expect(ev['ref'], 'week3');
    expect(ev['ts'], '2026-11-08T09:30:15.123Z');
    expect(m.engine.verifyChain().ok, isTrue);
    expect(find.text('Sealed 8 Nov'), findsOneWidget);
    // Sealing again replaces this week's entry; the old one still stands.
    await tester.enterText(key('week-shipped'), 'a second repo');
    await tester.tap(key('week-seal'));
    await tester.pumpAndSettle();
    final again = (m.engine.S['weeks'] as List).cast<Map>();
    expect(again.length, 2);
    expect(again.last['shipped'], 'a second repo');
    expect(m.engine.ledger.length, 2);
    expect(m.engine.verifyChain().ok, isTrue);
  });

  testWidgets('the seal button is dead on a Wednesday', (tester) async {
    final m = await model({}, today: '2026-11-04');
    await open(tester, m);
    await tester.tap(key('chip-week'));
    await tester.pumpAndSettle();
    expect(find.text('Opens Sunday 8 Nov · 4 days'), findsOneWidget);
    await tester.tap(key('week-seal'), warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(m.engine.S['weeks'], isEmpty);
  });

  test('Library: the revision PDFs resolve beside app-web/', () {
    expect(revisionUrl(3), endsWith('/revision/week-03.pdf'));
    expect(RecordEngine.revisionPdfs, 6);
  });

  // ---------------------------------------------------------------- Record

  // Mon 26 Oct .. Wed 4 Nov sealed, the Saturday rest day (31 Oct) stepped over: nine days.
  const nine = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'];

  Future<void> openRecordPage(WidgetTester tester, AppModel m) async {
    await open(tester, m);
    await tester.tap(key('tab-Profile'));
    await tester.pumpAndSettle();
    await tester.tap(key('chip-record'));
    await tester.pumpAndSettle();
  }

  test('canon and sha256 are the web app\'s: sorted keys, 150.0 is 150, the standard digest', () {
    expect(sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(sha256Hex('a' * 1000), '41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3');
    expect(canon({'b': 150.0, 'a': [1, 2.5, null, 'x"\n'], 'c': true}), '{"a":[1,2.5,null,"x\\"\\n"],"b":150,"c":true}');
    expect(fmtBHD(1149.5), 'BHD 1,149.5');
    expect(fmtBHD(150), 'BHD 150');
    expect(fmtBHD(0.1 + 0.2), 'BHD 0.3');
  });

  testWidgets('Record: the streak, the best, the days sealed; sealing today writes the day and the chain', (tester) async {
    final m = await model({'studyDays': nine}, today: '2026-11-05');
    await openRecordPage(tester, m);
    expect(tester.widget<Text>(key('record-streak')).data, '9');
    expect(find.bySemanticsLabel('days sealed 9'), findsOneWidget);
    expect(key('record-heat'), findsOneWidget);
    await tester.tap(key('record-seal'));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(key('record-streak')).data, '10');
    expect(m.engine.studyDays.contains('2026-11-05'), isTrue);
    final ev = m.engine.ledger.single as Map;
    expect([ev['type'], ev['ref'], ev['i'], ev['prev']], ['day', '2026-11-05', 0, ledgerGenesis]);
    expect(m.engine.verifyChain().ok, isTrue);
    expect(key('record-sealed'), findsOneWidget);
    expect(find.text('Deep Track day sealed'), findsOneWidget);
  });

  testWidgets('Record: the reset moves the line and deletes nothing; the best streak stays', (tester) async {
    final m = await model({'studyDays': nine}, today: '2026-11-05');
    await openRecordPage(tester, m);
    await tester.ensureVisible(key('record-reset'));
    await tester.tap(key('record-reset'));
    await tester.pumpAndSettle();
    await tester.tap(key('reset-confirm'));
    await tester.pumpAndSettle();
    expect(m.engine.settings['streakFrom'], '2026-11-05');
    expect(m.engine.streak(), 0);
    expect(m.engine.bestStreak(), 9, reason: 'bestStreak ignores streakFrom');
    expect(m.engine.studyDays.length, 9, reason: 'nothing deleted');
    final ev = m.engine.ledger.single as Map;
    expect(ev['type'], 'streak');
    expect(ev['data'], {'was': 9, 'best': 9});
    expect(tester.widget<Text>(key('record-streak')).data, '0');
    await tester.tap(key('record-seal'));
    await tester.pumpAndSettle();
    expect(m.engine.streak(), 1);
    expect(m.engine.bestStreak(), 10);
  });

  testWidgets('Record: a tampered ledger shows where the chain breaks', (tester) async {
    final m = await model({'studyDays': nine}, today: '2026-11-05');
    m.sealDay();
    m.resetStreak();
    expect(m.engine.verifyChain().ok, isTrue);
    ((m.engine.ledger.first as Map)['data'] as Map)['x'] = 1;
    await openRecordPage(tester, m);
    expect(tester.widget<Text>(key('record-broken')).data, 'broken at 0');
    expect(m.engine.verifyChain().brokenAt, 0);
  });

  test('the writers: lesson, quiz-free events, lab, problem and diagnostic each add one link', () async {
    final m = await model({}, today: '2026-11-05');
    m.toggleDone('math110.0.0');
    m.tickLab('flashcards-cli', true);
    m.tickProblem('Arrays|Two Sum', true);
    m.recordDiag('coding', 71.5);
    final t = [for (final e in m.engine.ledger) (e as Map)['type']];
    expect(t, ['lesson', 'lab', 'problem', 'diagnostic']);
    expect((m.engine.ledger.last as Map)['data'], {'score': 72});
    expect(m.engine.verifyChain().ok, isTrue);
    expect((m.engine.ledger[1] as Map)['data'], {'done': true});
  });

  testWidgets('Proof: anchors need a chain, record the head, and can be removed', (tester) async {
    final m = await model({'studyDays': nine}, today: '2026-11-05');
    expect(m.addAnchor('a commit', ''), 'Nothing to anchor yet.');
    expect(m.addAnchor('', ''), 'Say where you published it.');
    m.sealDay();
    await openRecordPage(tester, m);
    await tester.ensureVisible(key('record-proof'));
    await tester.tap(key('record-proof'));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(key('proof-status')).data, '1');
    await tester.enterText(key('anchor-where'), 'a commit');
    await tester.ensureVisible(key('anchor-add'));
    await tester.tap(key('anchor-add'));
    await tester.pumpAndSettle();
    expect(m.engine.anchors.length, 1);
    expect((m.engine.anchors.single as Map)['head'], m.engine.chainHead());
    expect((m.engine.anchors.single as Map)['where'], 'a commit');
    await tester.ensureVisible(key('anchor-del-0'));
    await tester.tap(key('anchor-del-0'));
    await tester.pumpAndSettle();
    expect(m.engine.anchors, isEmpty);
  });

  test('a record file verifies, and says where it breaks', () async {
    final m = await model({'studyDays': nine}, today: '2026-11-05');
    m.sealDay();
    m.resetStreak();
    m.toggleDone('math110.0.0');
    final bundle = m.engine.recordBundle(isoStamp(m.now()));
    final ok = verifyRecordText(jsonEncode(bundle));
    expect(ok, startsWith('3 entries verify'));
    expect(verifyRecordText('nope'), 'Not valid JSON.');
    expect(verifyRecordText('{"entries":[]}'), 'No entries in that file.');
    final bad = jsonDecode(jsonEncode(bundle)) as Map<String, dynamic>;
    ((bad['entries'] as List)[1] as Map)['ref'] = 'edited';
    expect(verifyRecordText(jsonEncode(bad)), 'chain breaks at entry 1 of 3');
    final pre = jsonDecode(jsonEncode(bundle)) as Map<String, dynamic>;
    ((pre['entries'] as List)[2] as Map)['preimage'] = 'something else';
    expect(verifyRecordText(jsonEncode(pre)), 'entry 2 does not hash to its stated value');
    expect(truthy(bundle['head']), isTrue);
  });

  test('a lecture quiz pass and a bank sitting each add their link, as the web app writes them', () async {
    final m = await model({}, today: '2026-10-27');
    m.passedQuiz('math110.0.0', const SittingResult(total: 5, firstTry: 4, attempts: 6, missed: []));
    final s = BankSitting([
      {'q': 'one', 'opts': ['a', 'b'], 'a': 0},
      {'q': 'two', 'opts': ['a', 'b'], 'a': 1},
    ], 2, rand: () => 0.5);
    while (!s.over) {
      s.answer(s.q!['a']);
      s.next();
    }
    m.sat('bank-x', s, [0, 1]);
    final ev = [for (final e in m.engine.ledger) e as Map];
    expect([for (final e in ev) e['type']], ['quiz', 'exam']);
    expect(ev[0]['ref'], 'math110.0.0');
    expect(ev[0]['data'], {'firstTry': 4, 'total': 5});
    expect(ev[1]['ref'], 'bank-x');
    expect(ev[1]['data'], {'score': 2, 'total': 2, 'pct': 100});
    expect(m.engine.verifyChain().ok, isTrue);
    expect(m.engine.eventLine(ev[1]), 'Examination · bank-x · 100% (2/2)');
    expect(m.engine.eventLine(ev[0]), 'Lecture quiz passed · math110.0.0 · 4 of 5 first try');
  });

  // -------------------------------------------------------------- Treasury

  Future<void> openTreasuryPage(WidgetTester tester, AppModel m) async {
    await open(tester, m);
    await tester.tap(key('tab-Profile'));
    await tester.pumpAndSettle();
    await tester.tap(key('chip-treasury'));
    await tester.pumpAndSettle();
  }

  Future<void> pay(WidgetTester tester, String amount, String note) async {
    await reveal(tester, 'entry-amount');
    await tester.enterText(key('entry-amount'), amount);
    await tester.enterText(key('entry-note'), note);
    await reveal(tester, 'entry-add');
    await tester.tap(key('entry-add'));
    await tester.pumpAndSettle();
  }

  testWidgets('Treasury: adding payments updates the ledger, the total and the week, in the web app\'s decimals', (tester) async {
    final m = await model({}, today: '2026-11-05');
    await openTreasuryPage(tester, m);
    expect(tester.widget<Text>(key('treasury-total')).data, '0');
    await pay(tester, '12.5', 'first');
    await pay(tester, '1137', 'second');
    await pay(tester, '0', 'nothing');
    final entries = (m.engine.treasury['entries'] as List).cast<Map>();
    expect(entries.length, 2, reason: 'a zero amount is refused');
    expect(entries.first, {'date': '2026-11-05', 'amount': 12.5, 'note': 'first'});
    expect(entries.last['amount'], 1137);
    expect(m.engine.revenueTotal(), 1149.5);
    expect(tester.widget<Text>(key('treasury-total')).data, '1,150', reason: 'Math.round(1149.5)');
    expect(find.bySemanticsLabel('BHD this week 1,149.5'), findsOneWidget);
    expect(find.text('BHD 12.5'), findsOneWidget);
    expect(find.text('BHD 1,137'), findsOneWidget);
    final wk = m.engine.weekView();
    expect([wk.counted, wk.earned], [true, 1149.5]);
  });

  testWidgets('Treasury: two clients, a third only after the cap confirm; removing one', (tester) async {
    final m = await model({}, today: '2026-11-05');
    await openTreasuryPage(tester, m);
    Future<void> add(String name) async {
      await reveal(tester, 'client-name');
      await tester.enterText(key('client-name'), name);
      await tester.enterText(key('client-price'), '300');
      await reveal(tester, 'client-add');
      await tester.tap(key('client-add'));
      await tester.pumpAndSettle();
    }

    await add('A');
    await add('B');
    expect((m.engine.treasury['clients'] as List).length, 2);
    await add('C');
    expect(find.text('Add a third client?'), findsOneWidget);
    await tester.tap(key('client-cancel'));
    await tester.pumpAndSettle();
    expect((m.engine.treasury['clients'] as List).length, 2);
    await reveal(tester, 'client-add');
    await tester.tap(key('client-add'));
    await tester.pumpAndSettle();
    await tester.tap(key('client-confirm'));
    await tester.pumpAndSettle();
    expect((m.engine.treasury['clients'] as List).length, 3);
    expect(((m.engine.treasury['clients'] as List).last as Map)['price'], 300);
    await reveal(tester, 'client-del-0');
    await tester.tap(key('client-del-0'));
    await tester.pumpAndSettle();
    expect([for (final c in m.engine.treasury['clients'] as List) (c as Map)['name']], ['B', 'C']);
  });

  testWidgets('Treasury: the offer saves, and an earning offer locks and changes', (tester) async {
    final m = await model({}, today: '2026-11-05');
    await openTreasuryPage(tester, m);
    await reveal(tester, 'offer-field');
    await tester.enterText(key('offer-field'), 'Clinics: WhatsApp agent, 14 days, BHD 500');
    await reveal(tester, 'offer-save');
    await tester.tap(key('offer-save'));
    await tester.pumpAndSettle();
    expect(m.engine.treasury['offer'], 'Clinics: WhatsApp agent, 14 days, BHD 500');
    expect(m.data.niches.length, 6);
    await reveal(tester, 'niche-lock');
    await tester.tap(key('niche-lock'));
    await tester.pumpAndSettle();
    expect(m.engine.treasury['niche'], 'clinics');
    await reveal(tester, 'move-4');
    expect(key('move-4'), findsOneWidget);
    await reveal(tester, 'niche-change');
    await tester.tap(key('niche-change'));
    await tester.pumpAndSettle();
    expect(m.engine.treasury['niche'], '');
  });
}
