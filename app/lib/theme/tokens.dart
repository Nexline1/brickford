// Brickford design tokens (skill_ui_blueprint.md). Every colour, radius and
// shadow the screens use is named here, so a restyle is an edit to this file.
import 'package:flutter/material.dart';

abstract final class Tokens {
  // ---- colour ----
  /// The background canvas: deep midnight.
  static const midnight = Color(0xFF12141C);
  /// The overlapping content sheet.
  static const sheet = Colors.white;
  /// Input fill: light slate.
  static const fieldFill = Color(0xFFF3F4F6);
  /// Prefix icons and quiet glyphs on the sheet.
  static const quiet = Colors.black45;
  /// Text on the sheet.
  static const ink = Color(0xFF12141C);
  /// Secondary text on the sheet (6.9:1 on white).
  static const ink2 = Color(0xFF55596A);
  /// Text on the midnight canvas.
  static const onMidnight = Colors.white;
  static const onMidnight2 = Color(0xFFA9AEC2);
  /// The primary action colour (the web app's accent; white on it is 5.6:1).
  static const primary = Color(0xFF0066CC);
  static const onPrimary = Colors.white;
  /// A progress bar's empty track, on a field-filled block.
  static const track = Color(0xFFDCDFE6);
  /// Cleared / done.
  static const done = Color(0xFF1E8E5A);
  /// Watched, quiz still to pass.
  static const half = Color(0xFFC77700);

  // ---- geometry ----
  /// The sheet's top corners: exactly 36, upper points only.
  static const sheetRadius = 36.0;
  /// Fields, pills and blocks.
  static const radius = 16.0;
  /// Where the sheet starts and how tall the branding layer is (design px; .h applied at use).
  static const sheetTop = 240.0;
  static const headerHeight = 280.0;

  static const sheetBorderRadius = BorderRadius.only(
    topLeft: Radius.circular(sheetRadius),
    topRight: Radius.circular(sheetRadius),
  );
  static const sheetShadow = [BoxShadow(color: Colors.black12, blurRadius: 20.0, offset: Offset(0, -5))];
}
