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

  // ---- the brand (T-064 brand) ----
  // The web app's identity before the T-051 iOS palette (platform/css/style.css
  // history, platform/icons): the gold crest on a dark panel, navy for the tint
  // and filled buttons. Ratios are WCAG 2 contrast, measured.

  /// The crest's gold (platform/icons, the drawer's seal): 7.3:1 on midnight.
  /// Crest, canvas highlights and badges on the canvas. Never on white (2.5:1).
  static const gold = Color(0xFFC89B60);

  /// The lighter caramel (--crest): 8.4:1 on midnight. Highlights on the canvas.
  static const goldHi = Color(0xFFD3A874);

  /// Gold where it sits on the white sheet (the gate diamond, a seal's icon):
  /// the old light --gold, 5.6:1 on white.
  static const goldInk = Color(0xFF8A5F12);

  /// The espresso of the app icon's ground: the ink on a gold fill (6.2:1).
  static const espresso = Color(0xFF2B2118);

  /// THE accent: Brickford navy (--accent / --accent-fill, Light). 8.2:1 with
  /// white either way round, so a white label on it and it as text on the
  /// sheet both pass AA; 6.9:1 on [accentWash]. It is 2.3:1 on midnight, so on
  /// the canvas the tint is [navyOnDark] instead.
  static const accent = Color(0xFF1E4F8F);
  static const onAccent = Colors.white;

  /// Navy on the dark canvas and dark cards (the old Dark --accent): 8.0:1 on midnight.
  static const navyOnDark = Color(0xFF78AEF0);

  /// A navy fill on dark (the old Dark --accent-fill): white on it is 5.3:1.
  static const navyFillOnDark = Color(0xFF2F6BBD);

  /// A pale wash of the navy (--accent-soft): the next-up card's gradient,
  /// the selected tab's soft pill.
  static const accentWash = Color(0xFFE6EDF6);

  /// The primary action is the navy.
  static const primary = accent;
  static const onPrimary = onAccent;

  /// A persistent badge on the canvas (§5, Rhythm): a raised midnight with a
  /// gold hairline. White on it 15.8:1, gold on it 6.3:1.
  static const badge = Color(0xFF1E2230);

  /// The dark lecture card on the white sheet.
  static const card = Color(0xFF1A1D27);

  /// A progress bar's empty track, on a field-filled block.
  static const track = Color(0xFFDCDFE6);

  /// Cleared / done: the one green left, and only as the semantic "done" tick
  /// (and the Watched pill's fill). 5.1:1 on white, and white on it 5.1:1.
  static const done = Color(0xFF2E7D4F);

  /// The done tick on a dark card: 7.6:1 on [card].
  static const doneOnDark = Color(0xFF5CC28A);

  /// Watched, quiz still to pass (3.3:1 on white: a glyph, never body text).
  static const half = Color(0xFFC77700);

  /// Calendar marks (glyphs only, never text). Missed: a red ring, 4.9:1 on
  /// white. Ahead: a grey ring, 3.2:1 (the non-text 3:1 rule). The half ring's
  /// unfilled half and a rest day's moon are quieter on purpose.
  static const missed = Color(0xFFC8323A);
  static const ringOpen = Color(0xFF8A8F9D);
  static const ringTrack = Color(0xFFDCDFE6);
  static const restMark = Color(0xFFC4C8D2);

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

  static const sheetBorderRadius = BorderRadius.only(topLeft: Radius.circular(sheetRadius), topRight: Radius.circular(sheetRadius));
  static const sheetShadow = [BoxShadow(color: Colors.black12, blurRadius: 20.0, offset: Offset(0, -5))];
}
