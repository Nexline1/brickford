// T-064 lesson-controls: on the web the lecture's video is an <iframe> in front of the canvas and takes every
// touch in its own rectangle, so Back and More must not be inside it. Measured here on the widgets (the tests
// run on the VM, where VideoEmbed is its stub, but it fills the same box the iframe fills); the browser side,
// the iframe's own rectangle and what is at the controls' centres, is tools/check-lesson-controls.js.
import 'package:app/main.dart';
import 'package:app/screens/lesson/lesson_screen.dart';
import 'package:app/screens/lesson/video_embed.dart';
import 'package:app/state/app_model.dart';
import 'package:app/theme/tokens.dart';
import 'package:app/widgets/blocks.dart';
import 'package:app/widgets/crest.dart';
import 'package:app/widgets/sheet_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<AppModel> model() async {
  SharedPreferences.setMockInitialValues({});
  final data = await AppModel.loadData(rootBundle);
  return AppModel(data, await SharedPreferences.getInstance(), today: () => '2026-11-04');
}

/// The app on a 375x812 phone.
Future<NavigatorState> pumpApp(WidgetTester tester) async {
  tester.view.physicalSize = const Size(375 * 3, 812 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(BrickfordApp(model: await model()));
  await tester.pumpAndSettle();
  return tester.state<NavigatorState>(find.byType(Navigator).first);
}

/// Opens a lecture over Home.
Future<void> openLesson(WidgetTester tester, NavigatorState nav, String cid, int ui, int li) async {
  nav.push(MaterialPageRoute<void>(builder: (_) => LessonScreen(cid: cid, ui: ui, li: li)));
  await tester.pumpAndSettle();
}

/// A lecture on a screen of this size, with this much status bar above it. The lecture takes Home's place and
/// the screen is resized after, because Home (not this change) was never laid out for 320x568 or a 47pt status bar.
Future<void> lessonOn(WidgetTester tester, double w, double h, {double safeTop = 0, String cid = 'math110', int ui = 0, int li = 0}) async {
  final nav = await pumpApp(tester);
  nav.pushReplacement(MaterialPageRoute<void>(builder: (_) => LessonScreen(cid: cid, ui: ui, li: li)));
  await tester.pumpAndSettle();
  tester.view.physicalSize = Size(w * 3, h * 3);
  tester.view.padding = FakeViewPadding(top: safeTop * 3);
  tester.view.viewPadding = FakeViewPadding(top: safeTop * 3);
  await tester.pumpAndSettle();
}

class Parts {
  Parts(WidgetTester t) {
    Finder inLesson(Finder f) => find.descendant(of: find.byType(LessonScreen), matching: f);
    back = t.getRect(inLesson(find.byWidgetPredicate((w) => w is FrostButton && w.id == 'lesson-back')));
    more = t.getRect(inLesson(find.byKey(const ValueKey('lesson-more'))));
    crest = t.getRect(inLesson(find.byType(Crest)).first);   // the row's; the video's fallback tile has one too
    title = t.getRect(inLesson(find.text('BRICKFORD')));
    video = t.getRect(inLesson(find.byKey(const ValueKey('lesson-video'))));
    sheetTop = t.getTopLeft(inLesson(find.byKey(SheetScaffold.sheetKey))).dy;
  }
  late final Rect back, more, crest, title, video;
  late final double sheetTop;
}

void main() {
  setUpAll(() => GoogleFonts.config.allowRuntimeFetching = false);

  for (final s in [(320.0, 568.0), (375.0, 812.0), (390.0, 844.0), (430.0, 932.0)]) {
    testWidgets('a lecture with a video at ${s.$1.toInt()}x${s.$2.toInt()}: the control row and the video do not overlap; the sheet starts at the video\'s foot', (tester) async {
      await lessonOn(tester, s.$1, s.$2);
      final p = Parts(tester);
      // The controls are fingertips, one on each side.
      for (final r in [p.back, p.more]) {
        expect(r.width, greaterThanOrEqualTo(44));
        expect(r.height, greaterThanOrEqualTo(44));
        expect(r.overlaps(p.video), isFalse, reason: 'a control inside the iframe\'s rectangle shows but takes no touch');
        expect(r.bottom, lessThanOrEqualTo(p.video.top));
      }
      expect(p.back.right, lessThan(s.$1 / 2));
      expect(p.more.left, greaterThan(s.$1 / 2));
      // The crest and the wordmark are in the same row, centred.
      for (final r in [p.crest, p.title]) {
        expect(r.bottom, lessThanOrEqualTo(p.video.top));
        expect(r.left, greaterThanOrEqualTo(p.back.right));
        expect(r.right, lessThanOrEqualTo(p.more.left));
      }
      expect((p.crest.left + p.title.right) / 2, closeTo(s.$1 / 2, 1.5));
      // The video: directly under the row, full width, 16:9.
      expect(p.video.left, 0);
      expect(p.video.width, s.$1);
      expect(p.video.height, closeTo(s.$1 * 9 / 16, 0.01));
      expect(p.video.top - p.back.bottom, inInclusiveRange(0, 16));
      // The sheet starts where the video ends, so it never covers the player's own controls.
      expect(p.sheetTop, closeTo(p.video.bottom, 0.5));
    });
  }

  testWidgets('below a status bar the whole row and the video are below it, and the controls stay out of the video', (tester) async {
    await lessonOn(tester, 375, 812, safeTop: 47);
    final p = Parts(tester);
    for (final r in [p.back, p.more, p.crest, p.title]) {
      expect(r.top, greaterThanOrEqualTo(47));
      expect(r.bottom, lessThanOrEqualTo(p.video.top));
    }
    expect(p.video.top - p.back.bottom, inInclusiveRange(0, 16));
    expect(p.video.height, closeTo(375 * 9 / 16, 0.01));
    expect(p.back.overlaps(p.video), isFalse);
    expect(p.more.overlaps(p.video), isFalse);
    expect(p.sheetTop, closeTo(p.video.bottom, 0.5));
  });

  testWidgets('on a short, wide screen the video stops at half the height, and the sheet still starts at its foot', (tester) async {
    // The app frames itself at most 480 wide; a phone on its side is 480 x 375 there, where 16:9 would be 270 high.
    await lessonOn(tester, 812, 375);
    final p = Parts(tester);
    expect(p.video.width, 480);
    expect(p.video.height, closeTo(187.5, 0.01));
    expect(p.back.overlaps(p.video), isFalse);
    expect(p.more.overlaps(p.video), isFalse);
    expect(p.sheetTop, closeTo(p.video.bottom, 0.5));
  });

  testWidgets('a lecture with no video: the fallback tile is in the same box, so the screen does not jump', (tester) async {
    final nav = await pumpApp(tester);
    await openLesson(tester, nav, 'math110', 0, 0);
    expect(find.descendant(of: find.byType(LessonScreen), matching: find.byType(VideoEmbed)), findsOneWidget);
    final withVideo = Parts(tester);
    nav.pop();
    await tester.pumpAndSettle();
    await openLesson(tester, nav, 'math210', 1, 3);
    expect(find.descendant(of: find.byType(LessonScreen), matching: find.byType(VideoEmbed)), findsNothing);
    expect(tester.widget(find.descendant(of: find.byType(LessonScreen), matching: find.byKey(const ValueKey('lesson-video')))), isA<FallbackTile>());
    final p = Parts(tester);
    expect(p.video, withVideo.video);
    expect(p.back, withVideo.back);
    expect(p.more, withVideo.more);
    expect(p.sheetTop, withVideo.sheetTop);
    expect(p.back.overlaps(p.video), isFalse);
    expect(p.more.overlaps(p.video), isFalse);
  });

  testWidgets('Back goes back and More opens the unit\'s lectures, from the control row', (tester) async {
    await openLesson(tester, await pumpApp(tester), 'math110', 0, 0);
    await tester.tap(find.byKey(const ValueKey('lesson-more')));
    await tester.pumpAndSettle();
    expect(find.text('Vectors'), findsWidgets);
    await tester.tapAt(const Offset(187, 20));   // the scrim
    await tester.pumpAndSettle();
    await tester.tapAt(Parts(tester).back.center);
    await tester.pumpAndSettle();
    expect(find.byType(LessonScreen), findsNothing);
  });

  group('SheetScaffold: only a screen that asks moves its canvas or sheet', () {
    Future<void> pumpScaffold(WidgetTester tester, {double? canvasHeight, double? sheetTop}) async {
      tester.view.physicalSize = const Size(375 * 3, 812 * 3);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        MaterialApp(
          home: ScreenUtilInit(
            designSize: const Size(375, 812),
            minTextAdapt: true,
            builder: (_, _) => Scaffold(
              body: SheetScaffold(canvas: const SizedBox.expand(key: ValueKey('c')), canvasHeight: canvasHeight, sheetTop: sheetTop, children: const []),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
    }

    testWidgets('the defaults are the tokens: a 280 canvas, the sheet from 240', (tester) async {
      await pumpScaffold(tester);
      expect(tester.getSize(find.byKey(const ValueKey('c'))).height, Tokens.headerHeight);
      expect(tester.getTopLeft(find.byKey(SheetScaffold.sheetKey)).dy, Tokens.sheetTop);
    });

    testWidgets('the overrides move them', (tester) async {
      await pumpScaffold(tester, canvasHeight: 300, sheetTop: 290);
      expect(tester.getSize(find.byKey(const ValueKey('c'))).height, 300);
      expect(tester.getTopLeft(find.byKey(SheetScaffold.sheetKey)).dy, 290);
    });
  });
}
