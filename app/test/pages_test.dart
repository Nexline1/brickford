// T-064 stage 6b: Transcript (passing a gate through its confirm sheet), the
// Handbook, the Method, the Workshop, and the Library opening a document.
import 'dart:convert';

import 'package:app/engine/record.dart';
import 'package:app/main.dart';
import 'package:app/screens/library/doc_screen.dart';
import 'package:app/state/app_model.dart';
import 'package:app/widgets/blocks.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<AppModel> model([Map<String, dynamic> state = const {}]) async {
  GoogleFonts.config.allowRuntimeFetching = false;
  SharedPreferences.setMockInitialValues({AppModel.storageKey: jsonEncode(state)});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => '2026-11-05', now: () => DateTime.utc(2026, 11, 5, 9, 30, 15, 123));
}

Finder sheetScroll() => find.descendant(of: find.byKey(SheetScaffold.sheetKey).last, matching: find.byType(Scrollable)).first;

Finder key(String s) => find.byKey(ValueKey(s));

Future<void> profile(WidgetTester t, AppModel m, String chip) async {
  t.view.physicalSize = const Size(375 * 3, 812 * 3);
  t.view.devicePixelRatio = 3;
  addTearDown(t.view.reset);
  await t.pumpWidget(BrickfordApp(model: m));
  await t.pumpAndSettle();
  await t.tap(find.text('Profile'));
  await t.pumpAndSettle();
  await tapChip(t, chip);
}

/// A chip beyond the right edge of the row is scrolled into view first.
Future<void> tapChip(WidgetTester t, String chip) async {
  final row = find.descendant(of: find.byType(ChipRow), matching: find.byType(Scrollable));
  if (key(chip).evaluate().isEmpty) await t.scrollUntilVisible(key(chip), 120, scrollable: row.first);
  await t.ensureVisible(key(chip));
  await t.pumpAndSettle();
  await t.tap(key(chip));
  await t.pumpAndSettle();
}

void main() {
  const md = '# Calibration\n\nA **bold** line with [a link](other.md).\n\n- first item\n- second item\n\n| Subject | Score |\n|---|---|\n| Algebra | 70% |\n\n---\n\n> quoted';

  testWidgets('the Library opens a document as a readable page, fetched relative to the site root', (t) async {
    Uri? asked;
    docLoader = (u) async {
      asked = u;
      return md;
    };
    final m = await model();
    await profile(t, m, 'chip-library');
    expect(find.text('Start here'), findsOneWidget);
    await t.tap(key('doc-readme'));
    await t.pumpAndSettle();
    expect(asked!.path, endsWith('/README.md'), reason: 'resolved from ../README.md, as the web app does');
    expect(find.text('Phase 0 — Calibration Kit'), findsOneWidget);
    expect(find.textContaining('A bold line with a link.', findRichText: true), findsOneWidget);
    expect(find.text('first item', findRichText: true), findsOneWidget);
    expect(find.text('Algebra', findRichText: true), findsOneWidget);
    expect(find.text('quoted', findRichText: true), findsOneWidget);
  });

  testWidgets('a document that cannot be fetched says so and offers the file', (t) async {
    docLoader = (u) async => throw StateError('404');
    final m = await model();
    await profile(t, m, 'chip-library');
    await t.tap(key('doc-curriculum'));
    await t.pumpAndSettle();
    expect(key('doc-failed'), findsOneWidget);
    expect(find.text('Could not load ../phase-1-curriculum.md'), findsOneWidget);
    expect(key('doc-open-file'), findsOneWidget);
  });

  testWidgets('the Library lists five outside links, then +5 shows all ten', (t) async {
    docLoader = (u) async => md;
    final m = await model();
    await profile(t, m, 'chip-library');
    await t.scrollUntilVisible(key('link-0'), 300, scrollable: sheetScroll());
    expect(key('link-4'), findsOneWidget);
    expect(key('link-5'), findsNothing);
    await t.ensureVisible(key('link-more'));
    await t.pumpAndSettle();
    await t.tap(key('link-more'));
    await t.pumpAndSettle();
    await t.scrollUntilVisible(key('link-9'), 300, scrollable: sheetScroll());
    expect(key('link-9'), findsOneWidget);
    expect(key('link-more'), findsNothing);
  });

  testWidgets('the Transcript passes the next gate only through its confirm sheet, every requirement ticked', (t) async {
    final m = await model();
    await profile(t, m, 'chip-transcript');
    expect(find.text('0%'), findsOneWidget);
    expect(m.engine.gatePlan().first.doneDate, isNull);
    await t.tap(key('gate-pass'));
    await t.pumpAndSettle();
    expect(t.widget<ElevatedButton>(find.descendant(of: key('gate-go'), matching: find.byType(ElevatedButton))).onPressed, isNull, reason: 'nothing ticked yet');
    for (var i = 0; key('gate-req-$i').evaluate().isNotEmpty; i++) {
      await t.tap(key('gate-req-$i'));
      await t.pump();
    }
    await t.tap(key('gate-go'));
    await t.pumpAndSettle();
    expect(m.engine.gatePlan().first.doneDate, '2026-11-05');
    expect(m.engine.ledger.where((e) => (e as Map)['type'] == 'gate').length, 1);
    expect(find.textContaining('Gate 1 passed'), findsOneWidget);
    // only the last gate passed can be unmarked, through its own sheet
    await t.tap(key('gate-1'));
    await t.pumpAndSettle();
    await t.tap(key('gate-go'));
    await t.pumpAndSettle();
    expect(m.engine.gatePlan().first.doneDate, isNull);
  });

  testWidgets('the Handbook, the Method and the Workshop open as readable pages', (t) async {
    final m = await model({'labs': {'micrograd-blind': {'done': true, 'proof': ''}}, 'psets': {'1806-ps1': true}});
    await profile(t, m, 'chip-guide');
    expect(key('guide-title'), findsOneWidget);
    await t.scrollUntilVisible(key('guide-laws'), 300, scrollable: sheetScroll());
    await t.tap(key('guide-laws'));
    await t.pumpAndSettle();
    expect(find.text('Never just watch'), findsOneWidget);
    await t.tap(find.byIcon(Icons.arrow_back_ios_new));
    await t.pumpAndSettle();
    await tapChip(t, 'chip-method');
    expect(key('method-curve'), findsOneWidget);
    expect(find.text('Recall cold'), findsOneWidget);
    await t.tap(find.byIcon(Icons.arrow_back_ios_new));
    await t.pumpAndSettle();
    await tapChip(t, 'chip-workshop');
    expect(t.widget<Text>(key('workshop-done')).data, '2', reason: 'one lab and one pset');
    await t.scrollUntilVisible(key('workshop-lab-micrograd-blind'), 200, scrollable: sheetScroll());
    expect(key('workshop-lab-micrograd-blind'), findsOneWidget);
  });
}
