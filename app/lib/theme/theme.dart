import 'dart:math' as math;

import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';

import 'tokens.dart';

/// Playfair Display for display headings, Inter for everything else.
TextStyle display(double size, {Color color = Tokens.onMidnight, FontWeight weight = FontWeight.w700}) =>
    GoogleFonts.playfairDisplay(fontSize: size.sp, color: color, fontWeight: weight, height: 1.1);

TextStyle body(double size, {Color? color = Tokens.ink, FontWeight weight = FontWeight.w400, double? height}) =>
    GoogleFonts.inter(fontSize: size.sp, color: color, fontWeight: weight, height: height);

/// iOS Safari zooms the page when a text field under 16 logical px takes focus, and the
/// zoom shifts the page sideways. Every text field's style goes through this floor.
const double minFieldFontSize = 16;
TextStyle fieldStyle(TextStyle s) => s.copyWith(fontSize: math.max(s.fontSize ?? minFieldFontSize, minFieldFontSize));

ThemeData brickfordTheme() {
  final base = ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor: Tokens.primary));
  return base.copyWith(
    scaffoldBackgroundColor: Tokens.midnight,
    colorScheme: base.colorScheme.copyWith(primary: Tokens.primary, onPrimary: Tokens.onPrimary, surface: Tokens.sheet),
    // Not GoogleFonts.interTextTheme: google_fonts 9 builds on package:material_ui, whose TextTheme is not
    // this one. Every visible style is set through body() and display(); this is the fallback family.
    textTheme: base.textTheme.apply(fontFamily: GoogleFonts.inter().fontFamily, bodyColor: Tokens.ink, displayColor: Tokens.ink),
    pageTransitionsTheme: kIsWeb ? webPageTransitions : base.pageTransitionsTheme,
  );
}

/// T-078: one back swipe, not two. In a browser on an iPhone the edge swipe
/// is Safari's (it goes back in history, which WebHistory turns into closing
/// the page). Flutter's iOS page route ALSO listens for that swipe, so both
/// moved at once: Safari's snapshot of the page before slid in from the left
/// while Flutter dragged the page aside over a second, offset copy of the same
/// page (owner's screenshot, 16 Nov). On the web the pages slide exactly as on
/// iOS, but without Flutter's gesture; the back button still slides them out.
const webPageTransitions = PageTransitionsTheme(builders: {
  TargetPlatform.iOS: SlideNoSwipeTransitionsBuilder(),
  TargetPlatform.macOS: SlideNoSwipeTransitionsBuilder(),
  TargetPlatform.android: ZoomPageTransitionsBuilder(),
});

/// The iOS slide (CupertinoPageTransition) with no edge-swipe detector.
class SlideNoSwipeTransitionsBuilder extends PageTransitionsBuilder {
  const SlideNoSwipeTransitionsBuilder();

  @override
  Widget buildTransitions<T>(PageRoute<T> route, BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) =>
      CupertinoPageTransition(primaryRouteAnimation: animation, secondaryRouteAnimation: secondaryAnimation, linearTransition: false, child: child);
}
