// T-068: Home on the smallest phone it has to fit, 320x568 (iPhone SE 1st gen),
// and with a 47pt status bar (the notch's safe-area top inset). A RenderFlex that
// overflows reports through FlutterError, which the test binding holds as the
// pending exception: takeException() must come back null, in both badge states
// (before Monk Mode starts, "Start Monk Mode"; during it, "Day n / 21"), and the
// Day row and the calendar button sit above the sheet at full size.
import 'dart:convert';

import 'package:app/main.dart';
import 'package:app/state/app_model.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<AppModel> model(String today, {String? monkStart}) async {
  SharedPreferences.setMockInitialValues({
    if (monkStart != null) AppModel.storageKey: jsonEncode({'monkStart': monkStart}),
  });
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => today);
}

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  for (final top in [0.0, 47.0]) {
    for (final monk in [null, '2026-11-01']) {
      final state = monk == null ? '"Start Monk Mode"' : '"Day n / 21"';
      testWidgets('Home at 320x568 with a ${top.toInt()}pt top inset, badge $state: nothing overflows', (tester) async {
        // Laid out first at 375x812 with the bundled fonts loaded: a RenderFlex reports an overflow
        // once, so a first frame in the fallback font must not use up the report the real one makes.
        tester.view.physicalSize = const Size(375 * 3, 812 * 3);
        tester.view.devicePixelRatio = 3;
        addTearDown(tester.view.reset);
        await tester.pumpWidget(BrickfordApp(model: await model('2026-11-04', monkStart: monk)));
        await tester.runAsync(() => GoogleFonts.pendingFonts());
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull, reason: 'Home overflowed at 375x812, before the small screen was tried');
        tester.view.physicalSize = const Size(320 * 3, 568 * 3);
        tester.view.padding = FakeViewPadding(top: top * 3);
        tester.view.viewPadding = FakeViewPadding(top: top * 3);
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull, reason: 'a RenderFlex overflowed on Home at 320x568, top inset $top');
        // And what an overflow would have hidden is on the canvas, above the sheet, at full size.
        final sheetTop = tester.getTopLeft(find.byKey(SheetScaffold.sheetKey).first).dy;
        final cal = tester.getRect(find.byKey(const ValueKey('home-calendar')));
        expect(
          tester.getRect(find.byKey(const ValueKey('home-day'))).bottom <= sheetTop,
          isTrue,
          reason: 'the Day row runs under the sheet',
        );
        expect(cal.bottom <= sheetTop, isTrue, reason: 'the calendar button runs under the sheet');
        expect(cal.width >= 44 && cal.height >= 44, isTrue, reason: 'the calendar button is ${cal.size}, under 44x44');
        expect(find.text('BRICKFORD'), findsWidgets);
        expect(find.byKey(ValueKey(monk == null ? 'home-monk-start' : 'home-monk')), findsOneWidget);
      });
    }
  }
}
