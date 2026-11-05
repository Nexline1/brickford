// Brickford design tokens (skill_ui_blueprint.md). Every colour, radius and
// shadow the screens use is named here, so a restyle is an edit to this file.
import 'package:flutter/material.dart';

abstract final class Tokens {
  // ---- colour ----
  /// The background canvas: deep midnight.
  static const midnight = Color(0xFF12141C);
  /// The overlapping content sheet.
  static const sheet = Colors.white;
  /// Input fill: light slate. Also the fill of separated item blocks.
  static const fieldFill = Color(0xFFF3F4F6);
  /// Prefix icons and quiet glyphs on the sheet.
  static const quiet = Colors.black45;
  /// Text on the sheet.
  static const ink = Color(0xFF12141C);
  /// Secondary text on the sheet (6.9:1 on white).
  static const ink2 = Color(0xFF55596A);
  /// Text on the midnight canvas.
  static const onMidnight = Colors.white;
  /// Secondary text on the canvas and on dark cards (8.4:1 on midnight).
  static const onMidnight2 = Color(0xFFA9AEC2);
  /// Unselected chip edge, bar edge.
  static const hairline = Color(0xFFE2E4EA);

  /// THE accent, the one brand colour: Brickford green. 4.5:1 against white
  /// (so white labels on it, and it as text on the sheet, pass AA) and 4.1:1
  /// against midnight (icons, fills and large type on the canvas pass the 3:1
  /// non-text rule). No colour clears 4.5:1 on both #12141C and white: the
  /// best possible is 4.3:1 each, so this sits on the white side of that.
  static const accent = Color(0xFF10875B);
  static const onAccent = Colors.white;
  /// A pale wash of the accent: the next-up card's gradient, the selected
  /// tab's soft pill.
  static const accentWash = Color(0xFFE3F2EA);

  /// The primary action is the accent.
  static const primary = accent;
  static const onPrimary = onAccent;

  /// The dark lecture card on the white sheet.
  static const card = Color(0xFF1A1D27);

  /// A progress bar's empty track, on a field-filled block.
  static const track = Color(0xFFDCDFE6);
  /// Cleared / done: the accent.
  static const done = accent;
  /// Watched, quiz still to pass (3.3:1 on white: a glyph, never body text).
  static const half = Color(0xFFC77700);

  /// The floating bar's frosted fill.
  static const frost = Color(0xE6FFFFFF);

  // ---- geometry ----
  /// The sheet's top corners: exactly 36, upper points only.
  static const sheetRadius = 36.0;
  /// Fields, pills and blocks.
  static const radius = 16.0;
  /// Cards (lecture, next up).
  static const cardRadius = 24.0;
  /// Where the sheet starts and how tall the branding layer is (design px; .h applied at use).
  static const sheetTop = 240.0;
  static const headerHeight = 280.0;
  /// The floating bar: its height and the gap under it. Tab screens pad their
  /// sheet by [barClearance] so the last row scrolls clear of it.
  static const barHeight = 64.0;
  static const barGap = 14.0;
  static const barClearance = barHeight + barGap + 24;

  static const sheetBorderRadius = BorderRadius.only(
    topLeft: Radius.circular(sheetRadius),
    topRight: Radius.circular(sheetRadius),
  );
  static const sheetShadow = [BoxShadow(color: Colors.black12, blurRadius: 20.0, offset: Offset(0, -5))];
}
