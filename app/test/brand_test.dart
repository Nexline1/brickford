// The brand (owner, 5 Nov: "I don't see my logo in it, neither am I seeing
// the colors of the brand"): the crest is the mark in every header and on the
// splash, the palette is midnight + white sheet + gold crest + navy, no stage-1
// green is left anywhere in lib/, and every pair the app paints text with
// clears WCAG AA, measured here rather than asserted in a comment.
import 'dart:io';

import 'package:app/main.dart';
import 'package:app/state/app_model.dart';
import 'package:app/theme/tokens.dart';
import 'package:app/widgets/crest.dart';
import 'package:app/widgets/pill_button.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

double contrast(Color a, Color b) {
  final la = a.computeLuminance(), lb = b.computeLuminance();
  final hi = la > lb ? la : lb, lo = la > lb ? lb : la;
  return (hi + 0.05) / (lo + 0.05);
}

Future<void> pumpHome(WidgetTester tester) async {
  SharedPreferences.setMockInitialValues({});
  final data = await AppModel.loadData(rootBundle);
  final m = AppModel(data, await SharedPreferences.getInstance(), today: () => '2026-11-04');
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
}

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  test('the palette: midnight, white, crest gold, navy; text pairs clear 4.5:1, glyphs 3:1', () {
    expect(Tokens.midnight, const Color(0xFF12141C));
    expect(Tokens.sheet, Colors.white);
    expect(Tokens.gold, const Color(0xFFC89B60));
    expect(Tokens.accent, const Color(0xFF1E4F8F));
    expect(Tokens.primary, Tokens.accent);
    // Text.
    expect(contrast(Colors.white, Tokens.primary), greaterThanOrEqualTo(4.5)); // the filled pill's label
    expect(contrast(Tokens.accent, Colors.white), greaterThanOrEqualTo(4.5)); // navy text on the sheet
    expect(contrast(Tokens.accent, Tokens.accentWash), greaterThanOrEqualTo(4.5)); // the selected tab
    expect(contrast(Tokens.gold, Tokens.midnight), greaterThanOrEqualTo(4.5)); // gold on the canvas
    expect(contrast(Tokens.goldHi, Tokens.midnight), greaterThanOrEqualTo(4.5));
    expect(contrast(Tokens.navyOnDark, Tokens.midnight), greaterThanOrEqualTo(4.5));
    expect(contrast(Colors.white, Tokens.navyFillOnDark), greaterThanOrEqualTo(4.5));
    expect(contrast(Colors.white, Tokens.badge), greaterThanOrEqualTo(4.5));
    expect(contrast(Tokens.gold, Tokens.badge), greaterThanOrEqualTo(4.5));
    expect(contrast(Tokens.goldInk, Colors.white), greaterThanOrEqualTo(4.5));
    expect(contrast(Tokens.espresso, Tokens.gold), greaterThanOrEqualTo(4.5));
    expect(contrast(Colors.white, Tokens.done), greaterThanOrEqualTo(4.5)); // the Watched pill
    expect(contrast(Tokens.ink2, Colors.white), greaterThanOrEqualTo(4.5));
    expect(contrast(Tokens.onMidnight2, Tokens.midnight), greaterThanOrEqualTo(4.5));
    // Glyphs (non-text, 3:1).
    for (final c in [Tokens.done, Tokens.missed, Tokens.ringOpen, Tokens.half, Tokens.goldInk]) {
      expect(contrast(c, Colors.white), greaterThanOrEqualTo(3), reason: '$c on white');
    }
    expect(contrast(Tokens.doneOnDark, Tokens.card), greaterThanOrEqualTo(3));
  });

  test('no stage-1 green is left in lib/ (the old accent, its wash, the orb gradient)', () {
    final greens = RegExp(r'10875B|E3F2EA|3FBF86|B9F0D2|1F4D3A|14231D', caseSensitive: false);
    final hits = <String>[
      for (final f in Directory('lib').listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.dart')))
        for (final (i, line) in f.readAsLinesSync().indexed)
          if (greens.hasMatch(line)) '${f.path}:${i + 1}',
    ];
    expect(hits, isEmpty);
  });

  testWidgets('Home: the crest is the mark top-left in gold on midnight, BRICKFORD beside it; the primary pill is navy', (tester) async {
    await pumpHome(tester);
    // The branding row's crest (the lecture cards' thumbnails carry a quieter one of their own).
    final crest = find.descendant(of: find.byKey(SheetScaffold.canvasKey).first, matching: find.byType(Crest)).first;
    final w = tester.widget<Crest>(crest);
    expect(w.field, Tokens.gold);
    expect(w.cut, Tokens.midnight);
    final at = tester.getTopLeft(crest);
    expect(at.dx, lessThan(40));
    expect(at.dy, lessThan(80));
    // The 200:224 viewBox.
    final size = tester.getSize(crest);
    expect(size.width / size.height, closeTo(200 / 224, 0.01));
    expect(find.text('BRICKFORD'), findsWidgets);
    final pill = tester.widget<ElevatedButton>(find.descendant(of: find.byType(PillButton).first, matching: find.byType(ElevatedButton)));
    expect(pill.style!.backgroundColor!.resolve({}), Tokens.accent);
    expect(pill.style!.foregroundColor!.resolve({}), Colors.white);
  });

  testWidgets('the splash: the large crest over BRICKFORD and SELF-BUILT UNIVERSITY', (tester) async {
    tester.view.physicalSize = const Size(375 * 3, 812 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(const SplashApp());
    await tester.pumpAndSettle();
    expect(find.byType(CrestLockup), findsOneWidget);
    expect(tester.getSize(find.byType(Crest)).height, greaterThanOrEqualTo(100));
    expect(find.text('BRICKFORD'), findsOneWidget);
    expect(find.text('SELF-BUILT UNIVERSITY'), findsOneWidget);
  });
}
