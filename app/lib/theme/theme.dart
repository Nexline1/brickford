import 'dart:math' as math;

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
  );
}
