// The blueprint, measured on the widgets themselves (skill_ui_blueprint.md):
// the canvas is #12141C, the sheet's top corners are 36 and nothing else, its
// shadow is black12 blur 20 offset (0, -5); fields are #F3F4F6, radius 16,
// with no border in any state; pills are radius 16 with elevation 0 in every
// state. Plus Home on the real data at a fixed date.
import 'package:app/main.dart';
import 'package:app/state/app_model.dart';
import 'package:app/widgets/brickford_field.dart';
import 'package:app/widgets/pill_button.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<AppModel> model(String today) async {
  SharedPreferences.setMockInitialValues({});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today);
}

Future<void> pumpApp(WidgetTester tester, AppModel m) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: m));
  await tester.pumpAndSettle();
}

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  testWidgets('the canvas is deep midnight #12141C and the sheet is the blueprint sheet', (tester) async {
    await pumpApp(tester, await model('2026-11-04'));
    final canvas = tester.widget<ColoredBox>(find.byKey(SheetScaffold.canvasKey).first);
    expect(canvas.color, const Color(0xFF12141C));

    final sheet = tester.widget<Container>(find.byKey(SheetScaffold.sheetKey).first);
    final deco = sheet.decoration! as BoxDecoration;
    expect(deco.color, Colors.white);
    expect(
      deco.borderRadius,
      const BorderRadius.only(topLeft: Radius.circular(36.0), topRight: Radius.circular(36.0)),
    );
    final r = deco.borderRadius! as BorderRadius;
    expect(r.bottomLeft, Radius.zero);
    expect(r.bottomRight, Radius.zero);
    expect(deco.boxShadow, const [BoxShadow(color: Colors.black12, blurRadius: 20.0, offset: Offset(0, -5))]);

    // The sheet starts at 240 of the 812 design height, over a 280-high branding layer.
    final top = tester.getTopLeft(find.byKey(SheetScaffold.sheetKey).first).dy;
    expect(top, closeTo(240, 0.5));
    expect(find.text('Brickford'), findsWidgets);
    final scroll = tester.widget<ListView>(find.descendant(of: find.byKey(SheetScaffold.sheetKey).first, matching: find.byType(ListView)));
    expect(scroll.physics, isA<BouncingScrollPhysics>());
  });

  testWidgets('fields: #F3F4F6 fill, radius 16, BorderSide.none in every state, black45 prefix icon, explicit padding', (tester) async {
    final m = await model('2026-11-04');
    await pumpApp(tester, m);
    await tester.tap(find.text('Market'));
    await tester.pumpAndSettle();
    final field = tester.widget<TextField>(find.descendant(of: find.byType(BrickfordField), matching: find.byType(TextField)));
    final d = field.decoration!;
    expect(d.filled, isTrue);
    expect(d.fillColor, const Color(0xFFF3F4F6));
    expect(d.contentPadding, isNotNull);
    for (final b in [d.border, d.enabledBorder, d.focusedBorder, d.disabledBorder]) {
      expect(b, isA<OutlineInputBorder>());
      final o = b! as OutlineInputBorder;
      expect(o.borderSide, BorderSide.none);
      expect(o.borderRadius, BorderRadius.circular(16.0));
    }
    final icon = d.prefixIcon! as Icon;
    expect(icon.color, Colors.black45);
  });

  testWidgets('pills: radius 16, elevation 0 when idle, hovered, focused, pressed and disabled', (tester) async {
    await pumpApp(tester, await model('2026-11-04'));
    final pills = find.byType(PillButton);
    expect(pills, findsWidgets);
    final button = tester.widget<ElevatedButton>(find.descendant(of: pills.first, matching: find.byType(ElevatedButton)));
    final style = button.style!;
    for (final states in <Set<WidgetState>>[
      {}, {WidgetState.hovered}, {WidgetState.focused}, {WidgetState.pressed}, {WidgetState.disabled},
    ]) {
      expect(style.elevation!.resolve(states), 0, reason: 'elevation in $states');
    }
    final shape = style.shape!.resolve({})! as RoundedRectangleBorder;
    expect(shape.borderRadius, BorderRadius.circular(16.0));
  });

  testWidgets('Home on the real plan: 4 Nov 2026 is plan day 17 and Monk day 4 of 21; four tabs', (tester) async {
    await pumpApp(tester, await model('2026-11-04'));
    expect(tester.widget<Text>(find.byKey(const ValueKey('home-day'))).data, '17');
    expect(find.text('Day 4 / 21'), findsOneWidget);
    for (final t in ['Home', 'Market', 'Community', 'Profile']) {
      expect(find.text(t), findsOneWidget);
    }
    // Saturday 7 Nov is a rest day: still the day just worked, nothing scheduled.
    await pumpApp(tester, await model('2026-11-07'));
    expect(tester.widget<Text>(find.byKey(const ValueKey('home-day'))).data, '19');
    expect(find.byIcon(Icons.bedtime_outlined), findsWidgets);
  });

  testWidgets('Mark watched stores lessons[k] in the web app\'s shape', (tester) async {
    final m = await model('2026-11-04');
    await pumpApp(tester, m);
    final first = m.engine.realSched('2026-11-04').first;
    await tester.tap(find.byKey(ValueKey('home-lesson-${first.key}')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('lesson-mark')));
    await tester.pumpAndSettle();
    final st = m.lesson(first.key);
    expect(st['done'], isTrue);
    expect(st['doneAt'], '2026-11-04');
    expect(m.prefs.getString(AppModel.storageKey), contains('"doneAt":"2026-11-04"'));
  });
}
