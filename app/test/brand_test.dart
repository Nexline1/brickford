// The brand (owner, 5 Nov: "I don't see my logo in it, neither am I seeing
// the colors of the brand"): the crest is the mark in every header and on the
// splash, the palette is midnight + white sheet + gold crest + navy, no stage-1
// green is left anywhere in lib/, and every pair the app paints text with
// clears WCAG AA, measured here rather than asserted in a comment.
import 'dart:async';
import 'dart:io';

import 'package:app/main.dart';
import 'package:app/state/app_model.dart';
import 'package:app/theme/tokens.dart';
import 'package:app/widgets/crest.dart';
import 'package:app/widgets/pill_button.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
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

  // T-072: the HTML boot screen (web/index.html #boot) paints this lockup in CSS px before the
  // engine is up, so it has to be one fixed set of numbers: no ScreenUtil .sp, no system text
  // scale, even leading (CSS half-leading), and the heights the CSS line-heights copy.
  testWidgets('the splash lockup is the same logical px at every screen size and text scale (T-072)', (tester) async {
    addTearDown(tester.view.reset);
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    tester.platformDispatcher.textScaleFactorTestValue = 1.3;
    for (final size in const [Size(375, 812), Size(390, 844), Size(430, 932), Size(1280, 800)]) {
      tester.view.physicalSize = size * 2;
      tester.view.devicePixelRatio = 2;
      await tester.pumpWidget(const SizedBox());
      await tester.pumpWidget(const SplashApp());
      await tester.pumpAndSettle();
      expect(tester.getSize(find.byType(Crest)), const Size(132 * 200 / 224, 132), reason: '$size');
      final wm = tester.widget<Text>(find.text('BRICKFORD')).style!;
      expect(wm.fontFamily, contains('PlayfairDisplay'));
      expect(wm.fontWeight, FontWeight.w700);
      expect(wm.fontSize, closeTo(26.4, 1e-9), reason: '$size');
      expect(wm.letterSpacing, closeTo(26.4 * 0.14, 1e-9));
      expect(wm.height, 1.1);
      expect(wm.leadingDistribution, TextLeadingDistribution.even);
      final est = tester.widget<Text>(find.text('SELF-BUILT UNIVERSITY')).style!;
      expect(est.fontFamily, contains('Inter'));
      expect(est.fontWeight, FontWeight.w600);
      expect(est.fontSize, closeTo(11.22, 1e-9), reason: '$size');
      expect(est.letterSpacing, closeTo(11.22 * 0.2, 1e-9));
      expect(est.height, 1.2);
      expect(est.leadingDistribution, TextLeadingDistribution.even);
      for (final t in ['BRICKFORD', 'SELF-BUILT UNIVERSITY']) {
        expect(tester.renderObject<RenderParagraph>(find.text(t)).textScaler, TextScaler.noScaling, reason: '$t at $size');
      }
    }
  });

  testWidgets('BootApp: the splash until the app is ready, then one 250 ms cross-fade (T-072)', (tester) async {
    final ready = Completer<Widget>();
    await tester.pumpWidget(BootApp(app: ready.future));
    await tester.pumpAndSettle();
    expect(find.byType(SplashApp), findsOneWidget);
    expect(bootFade, const Duration(milliseconds: 250));
    ready.complete(const ColoredBox(key: ValueKey('next'), color: Color(0xFF000000)));
    await tester.pump(); // the future resolves and the switch is built
    await tester.pump(); // the fade's ticker takes its start time
    await tester.pump(const Duration(milliseconds: 125));
    expect(find.byType(SplashApp), findsOneWidget, reason: 'mid-fade both are on screen');
    expect(find.byKey(const ValueKey('next')), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 130));
    expect(find.byType(SplashApp), findsNothing);
    expect(find.byKey(const ValueKey('next')), findsOneWidget);
  });
}
