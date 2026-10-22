// verify-design.js — the design foundations, asserted on real elements.
//
// Why this exists: loop/design/brief.md (owner decision, 25 Sep 2026) moved the
// app to an iOS-native look — the system font, the iOS text styles, a radius
// scale, flat controls, a lead pair of light and dark, and an Auto theme that
// follows the phone. Every other gate measures contrast, the frame, overflow,
// data or flows; none of them would notice if a later change put the Caslon
// serif or the 2px corner back. This one would.
//
// What it asserts (spec T-005), at 390px (a phone: isMobile, touch) and 1280px,
// in light and dark, on /, /course/math110, /lesson/math110/0/13, /calendar and
// /workshop:
//   - no element's computed font-family names Caslon;
//   - the page title h1 is the large title: 34px at 390, 40px at 1280, weight
//     700, tracking -0.022em (±0.002);
//   - every visible .btn has 12px corners, and no control carries the old
//     key-cap gloss, lift or well;
//   - the theme tokens resolve to the brief's hex values;
// and once each:
//   - the Auto theme: with S.settings.theme = "auto", an emulated dark scheme
//     resolves --bg to #000000 and a light one to #f2f1ee, it follows a live
//     change without writing storage or repainting the view (a render is a
//     read), and picking it from the menu stores the string "auto";
//   - the selected calendar day runs a `cellPick` animation (getAnimations()),
//     and does not under reduced motion;
//   - the phone .topbar sits under the iPhone status bar: its padding-top and
//     min-height carry env(safe-area-inset-top). Chromium cannot emulate a
//     notch, so that one is read from platform/css/style.css ON DISK — never
//     document.styleSheets, which throws on a file:// page and would make every
//     rule look missing;
// and at 390px in light and dark:
//   - an empty track can still be seen: an empty heatmap day and the "Quiet"
//     legend swatch on /record, and an unanswered question segment on
//     /quiz/linear-algebra, each measure >= 1.05:1 luminance contrast against
//     their actual backdrop (the first ancestor with an opaque background).
//     Round 1 of this item moved --bg to #f2f1ee, one step from the unchanged
//     --bg-2 these tracks were filled with (1.009:1), and flattened the --sink
//     inset that had been drawing their edge — so every empty track on the
//     page vanished while every other check here stayed green. These are
//     fills, not text, so the bar is "visible", not 4.5:1;
//   - a rest day (Saturday) in the /calendar month grid measures >= 1.05:1
//     against its backdrop (the grid) AND against a plain day cell beside it,
//     so the rest days stay visibly rest.
//
// T-006, the chrome (loop/specs/T-006-ios-chrome/spec.md):
//   - the phone nav bar, at 390 in light and dark on /, /course/math110 and
//     /calendar: a 44px material (--bg at 78%, blur(20px) saturate(180%)), the
//     menu button leading (its left edge on the screen, >= 0) and a day/week
//     capsule trailing, the page h1 as the 34px large title, and an inline
//     title that is transparent at scroll 0,
//     opaque once the h1 is 200px under the bar, and transparent again back at
//     the top — with the 0.5px --line scroll edge absent, present, absent;
//   - the tab bar: a --surface material with a --line edge (1px since T-023),
//     24px glyphs, 10px/500 sentence-case labels with no tracking, the active
//     tab --accent and the rest --ink-3;
//   - T-023, the floating tab bar (loop/specs/T-023-floating-tab-bar/spec.md),
//     at 390 and 320 in light and dark: a 70px capsule 14px (+/-1) from both
//     edges and 12px above the bottom, --surface at 78% under blur(22px)
//     saturate(170%) with a 1px --line edge and a shadow; every tab >= 44x44;
//     a translucent, blurred bubble centred (+/-1) behind the active tab; the
//     due-review badge a solid fill with its count at >= 4.5:1; and under
//     reduced transparency the bubble solid and unblurred too; and on /review
//     the Next card above it on the capsule's insets (+/-1), radius >= 20,
//     8px (+/-1) above it, in the same glass, its Open >= 44x44;
//   - the sidebar at 1280: not the espresso --panel, the page's --surface at
//     85% under a blur, a 0.5px trailing edge, the current item an
//     --accent-soft pill with an --accent label on 8px corners, a --gold crest;
//     and at 390 the drawer is solid;
//   - prefers-reduced-transparency and prefers-contrast: more, emulated over
//     CDP (Emulation.setEmulatedMedia) and CONFIRMED with matchMedia, so the
//     check cannot pass on a media query the browser ignored: every material
//     goes solid with no blur, and under more contrast the edges are 1px
//     --line-strong and every .glist is outlined;
//   - reduced motion: the inline title is opaque in the same task the class
//     that shows it lands, with no transition — and with motion allowed the
//     same measurement does see a fade, so it is not blind;
//   - a render is a read: scrolling /lesson/math120/0/0 (a video on the page; T-043)
//     through the title and edge states writes no state, rebuilds no view and
//     keeps the same <iframe> node.
// T-007, the lists (loop/specs/T-007-inset-grouped-lists/spec.md), at 390 and
// 1280 in light and dark on /, /course/math110, /exams and /courses (/workshop
// is in the spec's list and has no .glist; it is reported n/a, and it would be
// measured the moment it had one; /courses since T-026a and /exams since
// T-026b are the same — their section headers are still measured):
//   - every visible .glist is an opaque --surface section with 12px corners
//     that clips its rows; every .ghead (bar the hero's .oh) is 20px/600
//     sentence case with no rule, its meta 15px --ink-2 tabular; every row is
//     >= 44px (56 with a subtitle); .g-t 17px/600 body face, .g-s 15px --ink-2,
//     .g-v tabular and not mono; no separator above a first row and each later
//     one a 0.5px --line starting at or right of the text above it; the
//     leading slot --ink-2 and the chevron --ink-3;
//   - the keyboard ring, at 390 and 1280 in light and dark: Tab (the real key,
//     not .focus()) onto the row of a one-row section on /, and its 2px --accent
//     outline must lie inside the section's box — the section clips its rows,
//     and the global ring is drawn OUTSIDE an element's box — and be PAINTED:
//     the section screenshotted focused and not, and the ring's colour found
//     at all four sides and round all four corners;
// and the press, in all SEVEN themes: every visible row forced :active at 390
// and :hover at 1280 (CDP CSS.forcePseudoState) must fill >= 1.05:1 against
// its section and keep every text node on it >= 4.5:1 (3:1 large); the same
// for the sidebar's rows, whose hover and press fill is the page's --bg-2.
//
// T-016, the thumbnails (loop/specs/T-016-thumbnails-and-resume/spec.md), at
// 390 and 1280 in light and dark on /course/math110 with every unit opened:
//   - every video lecture row leads with an <img> whose src is
//     i.ytimg.com/vi/<its own v>/hqdefault.jpg — v read from the curriculum
//     by the row's own href, not from the page's markup;
//   - each is loading=lazy, decoding=async, alt="", in a 16:9 box (±0.01);
//   - until it loads, the frame is invisible over a --surface-2 skeleton;
//   - the duration chip reads the lesson's `min` as m:ss or h:mm:ss, worked
//     out here from whole minutes (h = min / 60), not by the app's formatter,
//     and is aria-hidden (the title is beside it);
//   - the state is on the frame: a watched lecture's edge is full and white, a
//     proven one's full and gold, and the row's subtitle says which;
//   - the error fallback: this harness refuses the network, so every frame
//     fails — each must become the typeset cover, with no <img> left, in the
//     course's own colour (its --fac hue), its code shown, its title in the
//     markup, and the cover's text and the chip >= 4.5:1 on it. Frames are
//     scrolled into view one by one so every lazy request is actually made;
// and on /course/ai300 a reading or a paper is a cover with no <img> from its
// first paint, its chip "Paper" or "Reading";
// once, at 390 light: a frame that loads is shown (.loaded, opacity 1), with
// a 120ms opacity fade when motion is allowed and none under reduced motion,
// and YouTube's 120x90 grey "no such video" image counts as a miss (cover);
// and in all SEVEN themes, on one course per faculty, every cover's text and
// every chip is >= 4.5:1 on what is behind it — and the chip stays >= 4.5:1
// over ANY picture: its fill composited over pure white and pure black.
//
// T-024, the navy theme (loop/specs/T-024-navy-theme/spec.md; the owner's
// decision of 2026-10-06, loop/design/brief.md §9). The dark half of the lead
// pair is the navy palette now, so three expectations above moved with it —
// the same checks, new expected values: the dark token table is navy rather
// than T-005's true black (and --bg-2, --btn-bg, --btn-ink and the new
// --accent-fill-ink are in both tables), dark's --panel is #0c1330, a FILLED
// .btn is a 999px capsule (ghost, danger and bare keep 12px), and a .glist is
// a 20px (--r-card) section; --r-card joins the radius scale. Added:
//   - the default: with nothing stored, and with progress stored but no theme,
//     the page resolves to dark (navy) on a phone set to LIGHT — so it is the
//     default speaking and not the phone — with meta theme-color #0c1330, Navy
//     listed second after Auto and marked, and — after a REAL save (today's
//     lecture opened from the dashboard and marked watched, the state writes
//     counted) — no theme key in the stored state (Auto's dark->dark and
//     light->light are the Auto checks above);
//   - the navy switch (round 3, owner decision 2026-10-06): a stored "light"
//     with no themeNavyOnce marker opens navy with Navy marked and NO state
//     write at boot, and after a real save stores no theme and the marker;
//     Light then picked from the menu survives a reload, and so does Light
//     picked on a device that had stored nothing; "light" with the marker
//     stays light through a save; "parchment" and "auto" are untouched;
//   - the first paint (round 2): index.html's inline <head> script sets the
//     theme from storage before app.js runs. With app.js HELD (the KaTeX
//     script before it never answers), every frame sampled from the first
//     styled one is the expected --bg — stored "light" without the marker
//     is navy, with it light, nothing stored is navy, "auto" follows the
//     phone — and still
//     after app.js runs; the script's PANEL map equals style.css's --panel;
//   - the primary action, at 390 and 1280 in light and dark on the five
//     routes: every visible filled .btn, and at least one .btn.lg, is a 999px
//     capsule on --btn-bg with an --accent-fill-ink label at >= 4.5:1 — a gold
//     fill and a navy label in dark, a white label in light — and the toast,
//     the other text on --btn-bg, reads the same pair;
//   - cards (.card, bar the hero's ruled .one) have 20px corners and a chip
//     (.pill) is a capsule;
//   - the glow, at 390 and 1280 on /, /course/math110, /calendar and /record:
//     in dark .main::before is a static layer of two radial gradients with
//     pointer-events none, as wide as .main and over its top; forced
//     hit-testable, it still loses the hit at the centre of every text and
//     control in its box (it is painted behind them), and as shipped every
//     control there takes its own hit (nothing interactive under it); it
//     declares a solid background-color, .main declares the same one (so
//     verify-contrast measures the page's text against it), and that colour
//     is no darker than the glow's brightest possible pixel — every
//     translucent stop of its computed gradients stacked at its own alpha on
//     --bg, an upper bound worked out here, not read from the stylesheet; in
//     light there is no layer and .main paints nothing;
//   - on every route in the foundations loop, meta theme-color is the
//     theme's --panel (#0c1330 in dark).
//
// T-025, Dark, Light and Auto (loop/specs/T-025-dark-light-auto/spec.md; the
// owner's decision of 2026-10-07 reverses T-024's colours). Same checks, new
// expected values, and only where the spec says:
//   - the dark token table is the pre-T-024 dark (commit a309b5a), restored
//     exactly, plus the three exceptions — --panel #000000, --bg #0e0e10,
//     --bg-2 #141416 — and --accent-fill-ink equal to --btn-ink; the table now
//     also carries the rest of that block (--good, --bad, the --fac-* hues,
//     --line-strong, --surface-float, --accent-2, --urgent and the --panel
//     inks), so "restored exactly" is measured, not asserted. Light: :root.
//   - dark's --panel (meta theme-color) is #000000; the primary action in dark
//     is the light-grey fill #e8ebef with the #0f1216 label;
//   - the theme lists: ALL_THEMES (the press, covers and chips) is light and
//     dark — the five removed themes have nothing left to measure;
//   - the glow checks are replaced: on the same four routes, both widths,
//     both themes, .main generates no ::before layer and neither .main nor
//     the sidebar paints a background-image;
//   - the sidebar (spec item 4) is a solid --panel: at 1280 no backdrop-filter,
//     no background-image, and its luminance below the page --bg, in both
//     themes; the drawer at 390 and the reduced-transparency / more-contrast
//     sidebar are the same solid --panel (they were solid --surface). Its pill,
//     label and crest are read in the sidebar's own scope, because light's
//     sidebar is espresso and re-scopes its inks; the crest's cut-outs are
//     --panel. The 1280 "not the espresso --panel" and "a material" checks
//     are what the spec reverses, and are replaced by the solid-panel one;
//   - the Theme menu is exactly Auto, Dark, Light, in that order ("Navy" and
//     "Paper" are gone); a stored "parchment" (no marker) renders dark with
//     Dark marked and is still stored "parchment" after a save (never
//     rewritten); stored "forest" and "slate" paint dark from the first frame
//     with app.js held, and after it runs, with zero state writes at boot;
//   - index.html's PANEL map is the stylesheet's --panel for exactly the two
//     themes.
//
// T-026b, Problems, Exams and Proof (loop/specs/T-026b-problems-exams-proof/
// spec.md), at 1440x900 and 390x844 in dark and light on the seed plus a
// six-entry chain, then nine more states at both sizes (labs and problem sets
// done; an exam passed; every bank open; Gate 1 passed, so a bank leads;
// lectures watched in a locked bank's course; the coding diagnostic leading;
// a two-entry chain after a streak reset; day 1 with nothing stored; a
// Saturday). Every expected value is worked out from the stored state and the
// data files, never read from the view:
//   - each page: its h1 and its one line, exactly; its one filled primary
//     inside the first viewport (under the phone bar, above the tab bar and
//     the Next bar), or on Proof, none;
//   - /workshop: three mode cards (glyph, title, line), 3 columns at 1440 and
//     1 at 390; Daily drill holds the only filled button ("Start", #/drill,
//     "10 min"); "x of 34 done" and "x of 20 shipped" from storage, each with
//     an Open pill >= 44x44 that jumps to its section in memory; no stat box;
//     one row per lab of the current phase (phase from the study index), in
//     order, ticked as stored, its description the lab's first clause cut
//     only at the end of a word; the folds still under the list;
//   - /exams: the record line; the hero's tag (course code, "· Gate 1" while
//     the gate is open) in the faculty colour, title, facts, a bar equal to
//     the course's lectures watched / all of them within 1% (in the faculty
//     colour), the days to Gate 1, and "Sit it"; one also-open card per other
//     open exam (unlocking from each question's `after` lecture or its
//     course), its tag and meta exact (a bank's sitting is perSitting capped
//     by the questions unlocked; an exam's course is found by code, not by
//     the app's lookup); at most 6 locked rows, "+N more" past that, which shows the
//     rest in memory; no .glist left;
//   - /record: three tiles equal to streak(), bestStreak() and the proven
//     lectures; the heatmap 26 weeks x 7 weekday rows — 156 study-day cells,
//     every Saturday a rest cell (or void outside the plan), never a level —
//     and every cell's class recomputed from that day's lessons, problems and
//     seal; at most 4 seals, newest first, "CODE · Ln" and #xxxx…xxxx from a
//     chain hashed here, joined by "←", genesis faded when reached; the pills
//     in order, >= 44x44, none filled, the reset last in --bad, still asking
//     first; and nothing on the three pages writes state;
//   - at 320/360/390/640/768/1100/1280/1440 x roots 16/20/24: nothing wider
//     than its box, no sideways scroll, and no word of the text this item
//     added broken across two lines (labelWords, read from the rendered text).
//
// T-026c, Week, the Calendar's day view, and Library (loop/specs/T-026c-week-
// calendar-library/spec.md), at 1440x900 and 390x844 in dark and light on the
// seed plus T26C_PATCH (a problem and a lecture proven this week, one proven
// the week before, today's MATH 120 lecture watched, three payments of which
// the Sunday ending week 2 must not count, two sealed weeks), then four more
// Week states at both sizes (no payment this week; this week sealed; nothing
// sealed; a Sunday). Expected values come from storage, the data and the
// study calendar walked here, never from the view:
//   - /review: h1 "Week N" and its line; four tiles — DSA solved (every
//     problem stored) and lectures proven (verifiedAt inside the plan week's
//     dates), both "counted for you" in --good, posts a typed field, BHD
//     earned the Treasury entries dated in the week "from Treasury" (typed
//     when there are none) — and Seal reads the counted values through the
//     inputs it always read; 4 across at 1440, 2 at 390; "Seal the week" the
//     only filled primary; the state ("Opens <day> <date> · N days", "Ready
//     to seal", "Sealed <date>"); the two questions on #rvShipped/#rvNotes;
//     past weeks newest first (or the four places they will go), a card
//     opening to its notes; and a render is a read (rendered twice, a card
//     opened, nothing written);
//   - /calendar, today, a Saturday and a Sunday: the grid, the day and the
//     .ics fold in that order; the heading and "Day N · Week W · x of y done"
//     ("Rest day · Week W" on a Saturday, the week just worked); ‹ Today ›
//     each >= 44x44; the bar within 1%; one block per scheduled item, in
//     order, with its href, "CODE · BLOCK" (uppercase), title, minutes and
//     place ("lecture n" counted through the course's units, or "part p of
//     q"), and a 6px bar in its faculty's colour (T26_FAC by faculty); a done
//     one checked in --ink-2; no .glist left; the habits 4 (5 on a Sunday)
//     with their minutes and "about 1 h 25"; ‹ › Today step the day in memory;
//   - /library: h1 and its line; "Start here" the Handbook (the only --accent
//     edge), the Method, the Calibration Kit; "Guides" every other id in
//     DOCS, read from app.js on disk; the Progress Log's note in --ink-3;
//     3 across at 1440, 1 at 390; 5 links then "+N", every link (folded ones
//     too) target=_blank rel=noopener; "+N" shows the rest in memory.
//
// Setup, the way every harness here does it (loop/lessons.md): each context is
// fresh, the clock is pinned (Sunday 1 Nov 2026, plan day 14, noon UTC) and the timezone is
// UTC, and every http(s) request is refused and logged — nothing here needs the
// network, and the log is how "no request for Libre Caslon" is checked.
// Where a block reads colours right after a boot (the 1280 sidebar, and the
// thumbnail blocks), it first waits for the theme it asked for to be PAINTED
// (themePainted below) — the theme lag verify-contrast.js was rewritten for.
//
// T-039, a reload (loop/specs/T-039-reload-storage-flake/spec.md). "switch (c)"
// failed at random with its code unchanged. Instrumented, the reloaded page
// started — before any app script ran — without storage the old page had:
// in the spec's evidence localStorage was empty; in this item's runs
// sessionStorage was, and bareSettings' write-once seed, which keys "once" off
// a sessionStorage flag, then wrote its fixture over the app's state. So the
// two reloads here (switch (c) and (c2)) go through tools/lib-reload.js. Just
// before the reload it writes a stamp beside the state in localStorage —
// switch (c) also one in sessionStorage ({ session: true }), because
// bareSettings is the only seed on a reloaded page that reads sessionStorage —
// and then reads whether the old page still held them when it unloaded (a
// report through a binding only the harness owns; the app's doing if not:
// measured, never retried) and whether they arrived at document start, before
// any app script. Only a stamp the old page is reported to have held and the
// new one did not find discards the attempt — every reading of it, failing
// checks included — and the block is re-measured from a fresh context, up to
// 5 attempts; if all 5 lose it the gate fails with that reason. With no unload
// report the attempt is measured as it is, never retried (fail-closed).
// Whether the state itself arrived is what the checks measure; their
// predicates are as they were.
//
//   node tools/verify-design.js
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const { acrossReload } = require("./lib-reload");
const ROOT = path.resolve(__dirname, "..");
const CSS_FILE = path.join(ROOT, "platform/css/style.css");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";

// Plan day 14 (moved with reset seven, START 2026-10-16; was 2026-10-20 under START 2026-10-05, 2026-10-06 under 2026-09-21).
const FIXED_NOW = new Date("2026-11-01T12:00:00Z");
const ROUTES = ["/", "/course/math110", "/lesson/math110/0/13", "/calendar", "/workshop"];
// The routes whose view carries a page-title h1 (a detail page's title). The
// other three head themselves with the folio, an h1 styled as a running head
// (and hidden into the bar on a phone) — that is T-006's collapsing large
// title, not this item's. A title h1 found on any route is checked; on these
// two its absence is a failure, so the check can never pass by measuring
// nothing.
const TITLE_ROUTES = new Set(["/course/math110", "/lesson/math110/0/13"]);
const WIDTHS = [
  { w: 390, h: 844, mobile: true, large: 34 },
  { w: 1280, h: 800, mobile: false, large: 40 },
];
const THEMES = ["light", "dark"];
// T-006: the nav bar is measured where the spec names it.
const NAV_ROUTES = ["/", "/course/math110", "/calendar"];
// T-007: the spec's four routes plus /courses, the densest list in the app.
// /workshop has no .glist today; it is reported n/a rather than passed.
// T-026a: /courses is a shelf of covers now (its spec removes the .glist
// rows), so it joins /workshop as n/a — and is measured again the moment a
// .glist comes back — and leaves the press routes, whose check needs rows.
// Its covers, filter and tiles are measured in the T-026a block below.
// T-026b: /exams goes the same way. Its spec turns the rows into a hero, a
// grid of cards and a grid of locked rows, and the Record group into one
// line, so no .glist is left: it is n/a for the rows (its section headers are
// still measured) and leaves the press routes. Its hero, cards and locked
// rows are measured in the T-026b block below.
const LIST_ROUTES = ["/", "/course/math110", "/exams", "/courses", "/workshop"];
const LIST_NA = new Set(["/workshop", "/courses", "/exams"]);
const PRESS_ROUTES = ["/", "/course/math110"];
// The lead pair: light from loop/design/brief.md §3 (:root, unchanged); dark
// is T-025's: the [data-theme="dark"] block as it was at commit a309b5a,
// before T-024's navy, copied here value by value — plus the spec's three
// exceptions, so the sidebar is darker than the page, and the label token
// T-024 introduced, which in dark is the button's own ink.
const DARK_A309B5A = {
  "--bg": "#000000", "--bg-2": "#0b0e11", "--surface": "#1c1c1e", "--surface-2": "#2c2c2e", "--surface-float": "#22272f",
  "--line": "#38383a", "--line-strong": "#3d454f", "--ink": "#ffffff", "--ink-2": "#a1a1a6", "--ink-3": "#8e8e93",
  "--accent": "#78aef0", "--accent-fill": "#2f6bbd", "--accent-soft": "#1a2a3f", "--gold": "#e0b35a", "--accent-2": "#9ec2e8",
  "--good": "#62b881", "--bad": "#e8705c", "--urgent": "#d99a4e", "--btn-bg": "#e8ebef", "--btn-ink": "#0f1216",
  "--fac-math": "#7aa6da", "--fac-ai": "#d9ab6d", "--fac-sys": "#63b3aa", "--fac-phys": "#d98071", "--fac-res": "#a58ac9", "--fac-speech": "#c98fac",
  "--panel": "#0a0d10", "--panel-ink": "#e8ebef", "--panel-accent": "#7fb0e6",
};
const BRIEF = {
  light: { "--bg": "#f2f1ee", "--bg-2": "#f2f0ea", "--surface": "#ffffff", "--surface-2": "#f7f6f3", "--surface-float": "#ffffff",
           "--line": "#dcdad5", "--line-strong": "#c7c0b3",
           "--ink": "#111111", "--ink-2": "#5c5a55", "--ink-3": "#6e6b65", "--accent": "#1e4f8f",
           "--accent-fill": "#1e4f8f", "--accent-soft": "#e6edf6", "--gold": "#8a5f12", "--accent-2": "#3f6ea0",
           "--good": "#2a7047", "--bad": "#b32d1f", "--urgent": "#9a5a16",
           "--btn-bg": "#241f1a", "--btn-ink": "#ffffff", "--accent-fill-ink": "#ffffff",
           "--fac-math": "#35608f", "--fac-ai": "#88592b", "--fac-sys": "#26665f", "--fac-phys": "#9c4534", "--fac-res": "#63498a", "--fac-speech": "#8a4a63",
           "--panel": "#2b2118", "--panel-ink": "#f2ece2", "--panel-accent": "#d3a874" },
  dark: Object.assign({}, DARK_A309B5A, {
    "--panel": "#000000", "--bg": "#0e0e10", "--bg-2": "#141416",     // the spec's three exceptions
    "--accent-fill-ink": DARK_A309B5A["--btn-ink"],                    // = --btn-ink
  }),
};
// Each theme's --panel: the sidebar's fill (T-025) and what the Home Screen
// status bar is painted from (meta theme-color).
const PANEL = { light: BRIEF.light["--panel"], dark: BRIEF.dark["--panel"] };
// --r-card is T-024's: cards and grouped sections.
const RADII = { "--r-sm": "8px", "--r-md": "12px", "--r-lg": "16px", "--r-xl": "22px", "--r-card": "20px" };
// T-024's four glow routes; since T-025 they are where "no decoration" is
// measured.
const GLOW_ROUTES = ["/", "/course/math110", "/calendar", "/record"];
// The primary action's pair: in light a white label on the fill; in dark
// (T-025) the restored light-grey fill with its dark label.
const PRIMARY = {
  light: { bg: "#241f1a", ink: "#ffffff", what: "a white label on the fill" },
  dark:  { bg: "#e8ebef", ink: "#0f1216", what: "a light-grey fill (#e8ebef) with a dark label (#0f1216)" },
};
const hexBytes = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).concat(255);

let checks = 0, fails = 0;
function check(name, ok, detail) {
  checks++;
  if (!ok) fails++;
  console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : ""));
  return ok;
}
const rgb = hex => "rgb(" + [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(", ") + ")";
// A hairline as Chromium computes it. The stylesheet declares 0.5px, which
// WebKit — the owner's iPhone — paints as one device pixel; Chromium rounds
// any border under 1px up to 1px, in its computed value AND its paint, at
// every pixel ratio (measured: 1x, 2x and 3x all paint one CSS pixel). So
// the live element can only be asked for a line no wider than 1px, and the
// declared 0.5px is read from the stylesheet on disk (hairlineSource below).
const hairline = w => w > 0 && w <= 1;
// Two byte arrays [r, g, b, a?] the same colour within `tol` per channel.
const __same = (a, b, tol) => !!a && !!b && [0, 1, 2].every(i => Math.abs(a[i] - b[i]) <= (tol === undefined ? 2 : tol));

// Same seeded progress as verify-contrast / verify-clip, so states that only
// appear with progress (a proven lecture, a streak, a due recall) are covered.
// Dates come from the pinned clock passed in, never from Date.now(). Top frame
// only: the lesson page's video frame is an opaque origin where localStorage
// throws.
function seed([nowMs, theme]) {
  if (window.top !== window) return;
  const iso = d => new Date(nowMs - d * 86400000).toISOString().slice(0, 10);
  const s = { lessons: {}, problems: {}, studyDays: [], review: {} };
  // A seeded theme is a pick made in the Theme menu, so it carries the
  // per-device marker an explicit pick sets (T-024's navy switch would
  // otherwise turn a seeded "light" into navy). The switch itself is tested
  // with stored states written by bareSettings below, which have no marker.
  if (theme) s.settings = { theme, themeNavyOnce: true };
  for (let i = 0; i < 4; i++) s.studyDays.push(iso(i));
  s.lessons["math110.0.13"] = { done: true, verified: true, doneAt: iso(1), notes: "n", checks: [true], solved: 3, recall: "x".repeat(200), verifiedAt: iso(1) };
  s.lessons["math110.0.0"] = { done: true, verified: false, doneAt: iso(2), notes: "", checks: [] };
  s.review["math110.0.13"] = { due: iso(1), box: 1 };
  s.problems["Arrays & Hashing|Contains Duplicate"] = iso(3);
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}
// Counts every write of the progress state after this point. save() is the
// only thing that writes it, so a count that moves is a save().
function countWrites() {
  if (window.top !== window) return;
  window.__stateWrites = 0;
  const set = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    if (k === "darhikmah_v1") window.__stateWrites++;
    return set.call(this, k, v);
  };
}

// T-024: a stored state that is ONLY these settings — no marker unless given
// — written before the app loads. `once` writes it on the first load of the
// tab only (sessionStorage remembers), so a reload sees what the app saved.
const bareSettings = (settings, once) => new Function("args",
  "if (window.top !== window) return;" +
  (once ? "if (sessionStorage.getItem('__bare')) return; sessionStorage.setItem('__bare', '1');" : "") +
  "localStorage.setItem('darhikmah_v1', JSON.stringify({ settings: " + JSON.stringify(settings) + " }));");

const requests = [];
let githubHits = 0;
// `extra`, when given, runs after the seed and may add to the stored state.
async function fresh(browser, opts, theme, extra) {
  const ctx = await browser.newContext(Object.assign({ timezoneId: "UTC", reducedMotion: "reduce" }, opts));
  await ctx.clock.setFixedTime(FIXED_NOW);
  await ctx.route(/^https?:/, r => {
    const u = r.request().url();
    requests.push(u);
    if (/api\.github\.com/.test(u)) githubHits++;
    return r.abort();
  });
  if (theme !== undefined) await ctx.addInitScript(seed, [FIXED_NOW.getTime(), theme]);
  if (extra) await ctx.addInitScript(extra, [FIXED_NOW.getTime()]);
  await ctx.addInitScript(countWrites);
  await ctx.addInitScript(installHelpers);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  return { ctx, page, errors };
}
// The theme a block asked for, painted — not just declared. When data-theme
// is set in the same frame as a route render, the document's computed style
// can stay on the previous theme for hundreds of milliseconds while the
// attribute already reads the new one (CLAUDE.md, verify-contrast.js): four
// 1280 dark-sidebar checks here once read light values that way, under load.
// So after a boot, wait for proof: the body's computed background is the --bg
// that style.css on disk declares for that theme (:root for light,
// [data-theme="X"] for the rest), and it is still that three frames running.
// The first half is the change, the second that it stopped — not a duration.
const THEME_BG = (() => {
  const css = fs.readFileSync(CSS_FILE, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const out = {};
  for (const m of css.matchAll(/^(:root|\[data-theme="([\w-]+)"\])\s*\{([^}]*)\}/gm)) {
    const bg = /--bg:\s*(#[0-9a-fA-F]{6})\b/.exec(m[3]);
    if (bg) out[m[2] || "light"] = bg[1].toLowerCase();
  }
  return out;
})();
async function themePainted(page, theme, at) {
  const want = THEME_BG[theme] ? rgb(THEME_BG[theme]) : null;
  const ok = !!want && await page.waitForFunction(want => {
    if (getComputedStyle(document.body).backgroundColor !== want) { window.__themeRun = 0; return false; }
    return (window.__themeRun = (window.__themeRun || 0) + 1) >= 3;
  }, want, { polling: "raf", timeout: 8000 }).then(() => true, () => false);
  const now = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  return check(at + ": painted in the theme asked for before anything is read (body = its --bg in style.css)", ok,
    want ? "body " + now + ", --bg " + THEME_BG[theme] + " (" + want + ")" : "no --bg declared for \"" + theme + "\" in style.css");
}
// Proof the view was rebuilt, not a guess at how long it takes: renderInner()
// replaces #view's children wholesale, so a marker on the current first child
// cannot survive the next render (verify-contrast.js's technique).
async function go(page, route) {
  await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-design-stale", "1"); });
  await page.goto(URL + route, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("#view > *") && !document.querySelector("#view [data-design-stale]"),
    null, { timeout: 8000, polling: "raf" });
  // Then let the finite entrance animations land, so what is measured is the
  // resting state.
  await page.evaluate(() => Promise.all(document.getAnimations()
    .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity)
    .map(a => a.finished.catch(() => {}))));
}

// ---------- measured inside the page ----------
function probe(names) {
  // Custom properties resolved through a real property, so the answer is the
  // value the browser will paint, whatever the source spelling. A NEW element
  // per token: re-assigning one element's style starts a transition (the
  // reduced-motion kill-switch sets a 0.01ms duration on everything, and the
  // default transition-property is `all`), and inside one task the computed
  // value is still the transition's start — so every token after the first
  // read back as the first.
  const resolve = (prop, value) => {
    const el = document.createElement("div");
    el.style[prop] = value;
    document.body.appendChild(el);
    const v = getComputedStyle(el)[prop];
    el.remove();
    return v;
  };
  const tokens = {};
  for (const n of names.colours) tokens[n] = resolve("color", "var(" + n + ")");
  const radii = {};
  for (const n of names.radii) radii[n] = resolve("borderTopLeftRadius", "var(" + n + ")");
  const rounded = resolve("fontFamily", "var(--font-rounded)");

  const caslon = [];
  document.querySelectorAll("*").forEach(n => {
    if (/caslon/i.test(getComputedStyle(n).fontFamily)) caslon.push(n.tagName.toLowerCase() + (n.className && typeof n.className === "string" ? "." + n.className.trim().split(/\s+/)[0] : ""));
  });

  const h1 = [...document.querySelectorAll("#view h1:not(.folio)")].find(n => n.checkVisibility());
  const h = h1 ? getComputedStyle(h1) : null;

  // Visible only: half this app's controls sit inside a closed <details>.
  const btns = [...document.querySelectorAll(".btn")].filter(n => n.checkVisibility());
  const corners = btns.map(b => {
    const s = getComputedStyle(b);
    return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  });
  // T-024: what kind each button is, by its CLASS (not by what it computes,
  // which is the thing under test): a filled .btn is any .btn that is not a
  // ghost, a danger or a bare one. A disabled filled button keeps its shape
  // but drops its fill, so it is in the shape check and not the fill check.
  const z = window.__dz;
  const kinds = btns.map((b, i) => {
    const s = getComputedStyle(b);
    return { name: z.name(b), text: b.textContent.trim().replace(/\s+/g, " ").slice(0, 24),
             filled: !b.matches(".ghost, .danger, .bare"), lg: b.matches(".lg"), disabled: b.matches(":disabled"),
             corners: corners[i], bg: z.bytes(s.backgroundColor), color: z.bytes(s.color) };
  });
  const four = s => [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  const cards = [...document.querySelectorAll(".card:not(.one)")].filter(n => n.checkVisibility())
    .map(n => ({ name: z.name(n), corners: four(getComputedStyle(n)) }));
  const pills = [...document.querySelectorAll(".pill:not(.wrapping)")].filter(n => n.checkVisibility())
    .map(n => ({ name: z.name(n), text: n.textContent.trim().slice(0, 20), corners: four(getComputedStyle(n)) }));
  const ts = getComputedStyle(document.querySelector("#toast"));
  const fillTok = { bg: z.tok("--btn-bg"), ink: z.tok("--accent-fill-ink") };
  const toast = { bg: z.bytes(ts.backgroundColor), color: z.bytes(ts.color) };
  // A shadow layer is visible when its colour has any alpha and it has any
  // extent. Layers are split on top-level commas (colours carry their own).
  const layers = v => {
    const out = []; let depth = 0, cur = "";
    for (const ch of v) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const visibleLayer = l => {
    if (l === "none") return false;
    const col = /rgba?\(([^)]*)\)/.exec(l);
    const a = col ? col[1].split(",").map(Number) : [0, 0, 0, 1];
    if (a.length === 4 && a[3] === 0) return false;
    const lens = (l.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g) || []).map(parseFloat);
    return lens.some(x => x !== 0);
  };
  const deep = [];
  document.querySelectorAll(".btn, input[type=text], input[type=number], input[type=date], textarea, select").forEach(n => {
    if (!n.checkVisibility()) return;
    const bs = getComputedStyle(n).boxShadow;
    if (layers(bs).some(visibleLayer)) deep.push(n.tagName.toLowerCase() + "." + String(n.className).split(/\s+/)[0] + " " + bs);
  });

  const b = getComputedStyle(document.body);
  return {
    theme: document.documentElement.dataset.theme,
    tokens, radii, rounded, caslon: [...new Set(caslon)],
    h1: h ? { text: h1.textContent.trim().slice(0, 40), size: parseFloat(h.fontSize), weight: h.fontWeight, ls: parseFloat(h.letterSpacing) } : null,
    btns: btns.length, corners, deep, kinds, cards, pills, fillTok, toast,
    body: { size: b.fontSize, family: b.fontFamily },
    meta: (document.querySelector('meta[name="theme-color"]') || {}).content || "",
  };
}
const NAMES = { colours: Object.keys(BRIEF.light), radii: Object.keys(RADII) };

// ---------- an empty track against what is actually behind it ----------
// The first visible element matching the selector, its background-color, and
// the background of its first ancestor whose background is opaque — the
// colour the eye really compares it with. Colours are read back through a 1x1
// canvas, so any CSS colour syntax (rgb(), color(srgb …) from a color-mix, a
// name) comes out as the same sRGB bytes; a translucent fill is composited
// over the backdrop first, the way it is painted.
// Given [sel, peerSel], it also measures the element against the first visible
// peer painted over the same backdrop — for a cell that has to read apart from
// its neighbours as well as from the grid behind them.
const MIN_TRACK = 1.05;
function trackContrast(arg) {
  const [sel, peerSel] = Array.isArray(arg) ? arg : [arg, null];
  const el = [...document.querySelectorAll(sel)].find(n => n.checkVisibility());
  if (!el) return { err: "no visible " + sel };
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const c = cv.getContext("2d", { willReadFrequently: true });
  const bytes = col => {
    c.clearRect(0, 0, 1, 1); c.fillStyle = "#000"; c.fillStyle = col; c.fillRect(0, 0, 1, 1);
    return [...c.getImageData(0, 0, 1, 1).data];
  };
  let a = el.parentElement, backEl = null, back = null;
  for (; a; a = a.parentElement) {
    const col = getComputedStyle(a).backgroundColor;
    if (bytes(col)[3] === 255) { backEl = a; back = col; break; }
  }
  if (!backEl) return { err: "no ancestor of " + sel + " has an opaque background" };
  const fill = getComputedStyle(el).backgroundColor;
  c.clearRect(0, 0, 1, 1);
  c.fillStyle = back; c.fillRect(0, 0, 1, 1);
  c.fillStyle = fill; c.fillRect(0, 0, 1, 1);          // source-over: the painted result
  const painted = [...c.getImageData(0, 0, 1, 1).data];
  const lum = p => {
    const [r, g, b] = p.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const x = lum(painted), y = lum(bytes(back));
  const hex = p => "#" + p.slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("");
  const name = n => n.tagName.toLowerCase() + (n.id ? "#" + n.id : "") + (typeof n.className === "string" && n.className.trim() ? "." + n.className.trim().split(/\s+/)[0] : "");
  const out = { ratio: (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), fill: hex(painted), back: hex(bytes(back)), on: name(backEl) };
  if (peerSel) {
    const peer = [...document.querySelectorAll(peerSel)].find(n => n !== el && n.checkVisibility());
    if (!peer) return Object.assign(out, { err: "no visible peer " + peerSel });
    c.clearRect(0, 0, 1, 1);
    c.fillStyle = back; c.fillRect(0, 0, 1, 1);
    c.fillStyle = getComputedStyle(peer).backgroundColor; c.fillRect(0, 0, 1, 1);
    const pp = [...c.getImageData(0, 0, 1, 1).data], z = lum(pp);
    out.peer = (Math.max(x, z) + 0.05) / (Math.min(x, z) + 0.05);
    out.peerFill = hex(pp);
  }
  return out;
}
const trackText = t => t.err || t.ratio.toFixed(3) + ":1, " + t.fill + " on " + t.back + " (" + t.on + ")" +
  (t.peer !== undefined ? "; " + t.peer.toFixed(3) + ":1 against a plain day " + t.peerFill : "");
const trackOk = t => !t.err && t.ratio >= MIN_TRACK && (t.peer === undefined || t.peer >= MIN_TRACK);

// ---------- the status bar, read from the stylesheet on disk ----------
// A small brace-matching reader: top-level blocks, and the blocks inside each
// @media. Comments go first, so a commented-out declaration cannot count.
function readBlocks(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) break;
    const prelude = css.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (j < css.length && depth) { if (css[j] === "{") depth++; else if (css[j] === "}") depth--; j++; }
    out.push({ prelude, body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}
function decls(body) {
  return body.split(";").map(d => d.trim()).filter(Boolean).map(d => {
    const k = d.indexOf(":");
    return [d.slice(0, k).trim(), d.slice(k + 1).trim()];
  });
}
function firstToken(v) {                  // "calc(3px + env(x)) 14px ..." -> "calc(3px + env(x))"
  let depth = 0;
  for (let i = 0; i < v.length; i++) {
    if (v[i] === "(") depth++;
    else if (v[i] === ")") depth--;
    else if (/\s/.test(v[i]) && depth === 0) return v.slice(0, i);
  }
  return v;
}
// The value a property ends up with in one rule: the last declaration wins,
// and a `padding` shorthand sets padding-top to its first value.
function effective(list, prop) {
  let v = null;
  for (const [k, val] of list) {
    if (k === prop) v = val;
    if (prop === "padding-top" && k === "padding") v = firstToken(val);
  }
  return v;
}
function safeAreaSource() {
  const css = fs.readFileSync(CSS_FILE, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const top = readBlocks(css);
  const phone = top.filter(b => /^@media\s*\(max-width:\s*860px\)$/.test(b.prelude)).flatMap(b => readBlocks(b.body));
  const rule = sel => {
    const hits = phone.filter(b => b.prelude === sel);
    return hits.length ? decls(hits.map(b => b.body).join(";")) : null;
  };
  const baseRule = sel => {
    const hits = top.filter(b => b.prelude === sel);
    return hits.length ? decls(hits.map(b => b.body).join(";")) : null;
  };
  const ENV = /env\(\s*safe-area-inset-top\b/;
  const bar = rule(".topbar"), drawer = rule(".sidebar"), grab = baseRule(".edge-grab");
  const pt = bar && effective(bar, "padding-top"), mh = bar && effective(bar, "min-height");
  check("status bar: the phone .topbar pads its content below the inset (padding-top)",
    !!pt && ENV.test(pt), bar ? "padding-top: " + pt : "no .topbar rule inside @media (max-width: 860px)");
  check("status bar: the phone .topbar grows by the inset (min-height)",
    !!mh && ENV.test(mh), bar ? "min-height: " + mh : "no .topbar rule");
  const dpt = drawer && effective(drawer, "padding-top");
  check("status bar: the drawer's content starts below the inset",
    !!dpt && ENV.test(dpt), drawer ? "padding-top: " + dpt : "no .sidebar rule inside @media (max-width: 860px)");
  const gt = grab && effective(grab, "top");
  check("status bar: the edge-grab strip starts below the inset",
    !!gt && ENV.test(gt), grab ? "top: " + gt : "no .edge-grab rule");
}

// ---------- T-006 / T-007: measured inside the page ----------
// One set of colour tools for every probe below, installed as an init script.
// Colours are read back through a 1x1 canvas, so any CSS syntax (rgb(), the
// color(srgb … / a) a color-mix() serialises to) comes out as the same sRGB
// bytes plus alpha. A token is resolved through a real property on a NEW
// element each time (see probe() for why).
function installHelpers() {
  if (window.top !== window) return;
  let c = null;
  const ctx2d = () => {
    if (!c) { const cv = document.createElement("canvas"); cv.width = cv.height = 1; c = cv.getContext("2d", { willReadFrequently: true }); }
    return c;
  };
  const bytes = col => {
    const k = ctx2d();
    k.clearRect(0, 0, 1, 1); k.fillStyle = "#000"; k.fillStyle = col; k.fillRect(0, 0, 1, 1);
    return [...k.getImageData(0, 0, 1, 1).data];
  };
  const resolve = (prop, value) => {
    const el = document.createElement("div");
    el.style[prop] = value;
    document.body.appendChild(el);
    const v = getComputedStyle(el)[prop];
    el.remove();
    return v;
  };
  const tok = n => bytes(resolve("color", "var(" + n + ")"));
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = p => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const over = (fg, bg) => { const a = fg[3] / 255; return [0, 1, 2].map(i => fg[i] * a + bg[i] * (1 - a)).concat(255); };
  // What is actually painted behind an element: walk up to the first opaque
  // background, compositing each translucent one on the way back down
  // (verify-contrast.js's method).
  const backdrop = el => {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const b = bytes(getComputedStyle(n).backgroundColor);
      if (b[3] === 0) continue;
      stack.push(b);
      if (b[3] === 255) break;
    }
    let base = [255, 255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  };
  const same = (a, b, tol) => !!a && !!b && [0, 1, 2].every(i => Math.abs(a[i] - b[i]) <= (tol === undefined ? 2 : tol));
  const hex = p => "#" + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, "0")).join("") + (p[3] !== undefined && p[3] !== 255 ? "/" + p[3] : "");
  const name = n => n.tagName.toLowerCase() + (n.id ? "#" + n.id : "") +
    (typeof n.className === "string" && n.className.trim() ? "." + n.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
  window.__dz = { bytes, resolve, tok, ratio, over, backdrop, same, hex, name };
}

// T-025: decoration on .main and the sidebar, as it is right now. The spec
// allows none: no .main::before layer, and no background-image on .main or
// the sidebar.
function decorState() {
  const main = document.querySelector(".main"), side = document.querySelector("#sidebar");
  const ms = getComputedStyle(main), gs = getComputedStyle(main, "::before"), ss = getComputedStyle(side);
  return { content: gs.content, beforeImg: gs.backgroundImage, beforeBg: gs.backgroundColor,
           mainImg: ms.backgroundImage, mainBg: ms.backgroundColor, sideImg: ss.backgroundImage };
}

// The phone nav bar, as it is right now.
function barState() {
  const z = window.__dz;
  const bar = document.querySelector("#topbar"), cs = getComputedStyle(bar);
  const after = getComputedStyle(bar, "::after");
  const title = document.querySelector("#tbTitle"), ts = getComputedStyle(title);
  const chip = document.querySelector("#tbMeta"), chs = getComputedStyle(chip);
  const menuEl = document.querySelector("#menuBtn"), menu = menuEl.getBoundingClientRect();
  const h1 = document.querySelector("#view h1"), hs = h1 && getComputedStyle(h1);
  const fm = h1 && h1.querySelector(".fo-meta");
  const cr = chip.getBoundingClientRect();
  return {
    cls: bar.className, scrollY: Math.round(scrollY), vw: document.documentElement.clientWidth,
    bf: cs.backdropFilter, bg: z.bytes(cs.backgroundColor), bgTok: z.tok("--bg"),
    h: bar.getBoundingClientRect().height, rule: parseFloat(cs.borderBottomWidth) || 0,
    edge: { op: after.opacity, w: parseFloat(after.borderBottomWidth) || 0, col: z.bytes(after.borderBottomColor),
            line: z.tok("--line"), strong: z.tok("--line-strong") },
    title: { op: ts.opacity, size: ts.fontSize, weight: ts.fontWeight, text: title.textContent.trim() },
    chip: { text: chip.textContent.trim(), bg: z.bytes(chs.backgroundColor), surface: z.tok("--surface"),
            fvn: chs.fontVariantNumeric, family: chs.fontFamily, radius: parseFloat(chs.borderTopLeftRadius), right: cr.right, h: cr.height },
    menu: { w: menu.width, h: menu.height, left: menu.left, color: z.bytes(getComputedStyle(menuEl).color), accent: z.tok("--accent") },
    h1: h1 ? { text: [...h1.childNodes].filter(n => n !== fm).map(n => n.textContent).join("").trim(),
               size: hs.fontSize, weight: hs.fontWeight, tt: hs.textTransform, meta: fm ? getComputedStyle(fm).display : null } : null,
  };
}
// Scroll so the page h1's top edge is `under` px above the bar's bottom edge,
// and say where it got to (a page too short to scroll that far must fail, not
// pass on the scroll position it happened to reach).
function scrollTitleUnder(under) {
  const h1 = document.querySelector("#view h1"), bar = document.querySelector("#topbar");
  if (!h1) return { err: "no h1 in the view" };
  const want = Math.round(h1.getBoundingClientRect().top + scrollY - bar.getBoundingClientRect().bottom + under);
  window.scrollTo({ top: want, behavior: "instant" });
  return { want, got: Math.round(scrollY) };
}
const frames = page => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

// The tab bar.
function tabState() {
  const z = window.__dz;
  const bar = document.querySelector("#tabbar"), cs = getComputedStyle(bar);
  return {
    bf: cs.backdropFilter, bg: z.bytes(cs.backgroundColor), surface: z.tok("--surface"), panel: z.tok("--panel"),
    topW: parseFloat(cs.borderTopWidth) || 0, topCol: z.bytes(cs.borderTopColor), line: z.tok("--line"),
    accent: z.tok("--accent"), ink3: z.tok("--ink-3"),
    // T-023: the capsule, its bubble and the due-review badge.
    box: (() => { const b = bar.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, btm: b.bottom, h: b.height }; })(),
    vw: document.documentElement.clientWidth, vh: window.innerHeight,
    radius: parseFloat(cs.borderTopLeftRadius), shadow: cs.boxShadow,
    edges: ["Top", "Right", "Bottom", "Left"].map(k => ({ w: parseFloat(cs["border" + k + "Width"]) || 0, col: z.bytes(cs["border" + k + "Color"]) })),
    bubble: (() => {
      const e = bar.querySelector(".tab-bubble"), bs = e && getComputedStyle(e), b = e && e.getBoundingClientRect();
      const act = bar.querySelector("a.active"), ab = act && act.getBoundingClientRect();
      // The active label is painted over the bubble, which is over the bar:
      // composite both translucent layers onto what is behind the bar.
      const under = act ? z.over(z.bytes(bs.backgroundColor), z.backdrop(bar)) : null;
      const lab = act ? z.bytes(getComputedStyle(act).color) : null;
      return e ? { bf: bs.backdropFilter, bg: z.bytes(bs.backgroundColor), op: bs.opacity, c: b.left + b.width / 2,
                   labelRatio: under ? z.ratio(z.over(lab, under), under) : 0,
                   actC: ab ? ab.left + ab.width / 2 : null, behind: !!ab && b.top >= ab.top - 6 && b.bottom <= ab.bottom + 6 } : null;
    })(),
    badge: (() => {
      const e = bar.querySelector(".tab-badge");
      if (!e || !e.checkVisibility()) return null;
      const bs = getComputedStyle(e), bg = z.bytes(bs.backgroundColor), fg = z.bytes(bs.color);
      return { text: e.textContent.trim(), bg, ratio: z.ratio(z.over(fg, bg), bg), inReview: !!e.closest("a[data-route='/review']") };
    })(),
    tabs: [...bar.querySelectorAll("a")].map(a => {
      const t = getComputedStyle(a), g = a.querySelector(".glyph").getBoundingClientRect();
      return { name: a.textContent.trim(), active: a.classList.contains("active"), tt: t.textTransform, size: t.fontSize,
               weight: t.fontWeight, ls: t.letterSpacing, color: z.bytes(t.color), gw: g.width, gh: g.height, h: a.getBoundingClientRect().height,
               w: a.getBoundingClientRect().width };
    }),
  };
}

// The sidebar (or, below 861px, the drawer).
function sideState() {
  const z = window.__dz;
  const s = document.querySelector("#sidebar"), cs = getComputedStyle(s);
  const act = document.querySelector(".sidebar .nav a.active"), as = act && getComputedStyle(act);
  const field = document.querySelector(".crest .cr-field"), cut = document.querySelector(".crest .cr-cut");
  // A token as the sidebar's contents see it (T-025: light's espresso sidebar
  // re-scopes its inks), resolved on a probe inside the nav.
  const sideTok = n => {
    const el = document.createElement("div"); el.style.color = "var(" + n + ")";
    document.querySelector("#nav").appendChild(el);
    const v = z.bytes(getComputedStyle(el).color); el.remove(); return v;
  };
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = p => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
  const bg = z.bytes(cs.backgroundColor), page = z.tok("--bg");
  return {
    bf: cs.backdropFilter, bg, surface: z.tok("--surface"), panel: z.tok("--panel"), img: cs.backgroundImage,
    page, lSide: L(bg), lPage: L(page),
    rightW: parseFloat(cs.borderRightWidth) || 0, rightCol: z.bytes(cs.borderRightColor), line: z.tok("--line"), strong: z.tok("--line-strong"),
    act: act ? { text: act.textContent.trim(), bg: z.bytes(as.backgroundColor), color: z.bytes(as.color), radius: as.borderTopLeftRadius } : null,
    soft: sideTok("--accent-soft"), accent: sideTok("--accent"), gold: sideTok("--gold"),
    field: field ? z.bytes(getComputedStyle(field).fill) : null, cut: cut ? z.bytes(getComputedStyle(cut).fill) : null,
  };
}

// Every material in the chrome, for the reduced-transparency and more-contrast
// fallbacks.
function chromeState() {
  const z = window.__dz;
  const one = sel => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { bf: cs.backdropFilter, bg: z.bytes(cs.backgroundColor), shown: cs.display !== "none" };
  };
  const bar = document.querySelector("#topbar"), after = getComputedStyle(bar, "::after");
  const tab = getComputedStyle(document.querySelector("#tabbar"));
  const side = getComputedStyle(document.querySelector("#sidebar"));
  const gl = [...document.querySelectorAll("#view .glist")].find(n => n.checkVisibility());
  const gs = gl && getComputedStyle(gl);
  return {
    rt: matchMedia("(prefers-reduced-transparency: reduce)").matches, more: matchMedia("(prefers-contrast: more)").matches,
    topbar: one("#topbar"), tabbar: one("#tabbar"), railbar: one("#railbar"), sidebar: one("#sidebar"), bubble: one("#tabbar .tab-bubble"),
    bg: z.tok("--bg"), surface: z.tok("--surface"), panel: z.tok("--panel"), strong: z.tok("--line-strong"),
    edge: { op: after.opacity, w: parseFloat(after.borderBottomWidth) || 0, col: z.bytes(after.borderBottomColor) },
    tabTop: { w: parseFloat(tab.borderTopWidth) || 0, col: z.bytes(tab.borderTopColor) },
    sideRight: { w: parseFloat(side.borderRightWidth) || 0, col: z.bytes(side.borderRightColor) },
    glist: gs ? ["Top", "Right", "Bottom", "Left"].map(k => ({ w: parseFloat(gs["border" + k + "Width"]) || 0, col: z.bytes(gs["border" + k + "Color"]) })) : null,
  };
}

// The grouped lists on the current route: every visible section, header and
// row, with what is wrong collected per rule.
function listState() {
  const z = window.__dz;
  const T = { surface: z.tok("--surface"), ink2: z.tok("--ink-2"), ink3: z.tok("--ink-3"), line: z.tok("--line") };
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const bad = {}, n = {};
  const note = (k, msg) => { (bad[k] = bad[k] || []).push(msg); };
  const cnt = k => { n[k] = (n[k] || 0) + 1; };
  const lists = vis("#view .glist");
  lists.forEach((g, gi) => {
    const s = getComputedStyle(g), bg = z.bytes(s.backgroundColor);
    cnt("glist");
    if (!(bg[3] === 255 && z.same(bg, T.surface))) note("fill", "list " + gi + " is " + z.hex(bg));
    const radii = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
    if (radii.some(r => r !== "20px") || s.overflowX !== "hidden" || s.overflowY !== "hidden")
      note("shape", "list " + gi + " corners " + radii.join(" ") + ", overflow " + s.overflowX + "/" + s.overflowY);
    const rows = [...g.children].filter(r => r.classList.contains("grow") && r.checkVisibility());
    rows.forEach((r, ri) => {
      cnt("row");
      const rr = r.getBoundingClientRect(), min = r.querySelector(".g-s") ? 56 : 44;
      if (rr.height < min - 0.5) note("height", z.name(r) + " " + rr.height.toFixed(1) + "px (min " + min + ")");
      const t = r.querySelector(".g-t");
      if (t) {
        cnt("gt");
        // A muted or a done row recedes to 400 — that is the variant's meaning,
        // which the spec keeps — so 600 is asked of every other row.
        const ts = getComputedStyle(t), weight = r.matches(".muted-row, .done-row") ? "400" : "600";
        if (ts.fontSize !== "17px" || ts.fontWeight !== weight || !/^-apple-system\b/.test(ts.fontFamily))
          note("type", ".g-t " + ts.fontSize + "/" + ts.fontWeight + " (want " + weight + ") " + ts.fontFamily.slice(0, 24));
      }
      r.querySelectorAll(".g-s").forEach(x => {
        cnt("gs");
        const xs = getComputedStyle(x);
        if (xs.fontSize !== "15px" || !z.same(z.bytes(xs.color), T.ink2)) note("type", ".g-s " + xs.fontSize + " " + z.hex(z.bytes(xs.color)));
      });
      r.querySelectorAll(".g-v").forEach(x => {
        cnt("gv");
        const xs = getComputedStyle(x);
        if (!/tabular-nums/.test(xs.fontVariantNumeric) || /mono/i.test(xs.fontFamily))
          note("value", ".g-v \"" + x.textContent.trim().slice(0, 12) + "\" " + xs.fontVariantNumeric + " / " + xs.fontFamily.slice(0, 30));
      });
      const lead = r.querySelector(":scope > .g-lead");
      if (lead && !lead.classList.contains("bad-lead") && !r.classList.contains("done-row")) {
        cnt("lead");
        const c = z.bytes(getComputedStyle(lead).color);
        if (!z.same(c, T.ink2)) note("lead", "lead \"" + lead.textContent.trim() + "\" " + z.hex(c));
      }
      if (r.matches("a.grow")) {
        cnt("chev");
        const c = z.bytes(getComputedStyle(r, "::after").borderRightColor);
        if (!z.same(c, T.ink3)) note("lead", "chevron " + z.hex(c));
      }
      const b = getComputedStyle(r, "::before");
      if (ri === 0) {
        if (b.content !== "none" && b.content !== "normal") note("sep", "list " + gi + ": a separator above the first row");
      } else {
        cnt("sep");
        const w = parseFloat(b.borderTopWidth) || 0, col = z.bytes(b.borderTopColor);
        const prev = rows[ri - 1].querySelector(".g-t") || rows[ri - 1].querySelector(".g-main") || rows[ri - 1];
        const start = rr.left + (parseFloat(b.left) || 0), text = prev.getBoundingClientRect().left;
        if (b.content === "none" || b.content === "normal" || !(w > 0 && w <= 1) || !z.same(col, T.line) || start < text - 0.5)
          note("sep", "list " + gi + " row " + ri + ": " + (b.content === "none" ? "no separator" :
            w + "px " + z.hex(col) + " from x=" + start.toFixed(1) + ", text above at x=" + text.toFixed(1)));
      }
    });
  });
  vis("#view .ghead:not(.oh)").forEach(h => {
    cnt("ghead");
    const hs = getComputedStyle(h);
    if (hs.textTransform !== "none" || hs.fontSize !== "20px" || hs.fontWeight !== "600" || (parseFloat(hs.borderBottomWidth) || 0) !== 0)
      note("head", "\"" + h.firstChild.textContent.trim().slice(0, 20) + "\" " + hs.textTransform + " " + hs.fontSize + "/" + hs.fontWeight + " rule " + hs.borderBottomWidth);
    const m = h.querySelector(".gh-meta");
    if (m) {
      cnt("ghmeta");
      const ms = getComputedStyle(m);
      if (ms.fontSize !== "15px" || !z.same(z.bytes(ms.color), T.ink2) || !/tabular-nums/.test(ms.fontVariantNumeric))
        note("meta", "\"" + m.textContent.trim() + "\" " + ms.fontSize + " " + z.hex(z.bytes(ms.color)) + " " + ms.fontVariantNumeric);
    }
  });
  return { bad, n };
}

// Every visible element matching `sel` is in its pressed (forced) state: how
// far its fill stands off what it sits on, and the worst text on it.
function pressState(sel) {
  const z = window.__dz;
  const rows = [...document.querySelectorAll(sel)].filter(r => r.checkVisibility());
  const out = { rows: rows.length, texts: 0, lowFill: [], lowText: [], fill: null, text: null };
  rows.forEach(r => {
    const fill = z.backdrop(r), under = z.backdrop(r.parentElement);
    const fr = z.ratio(fill, under);
    if (!out.fill || fr < out.fill.r) out.fill = { r: fr, at: z.name(r) + " " + z.hex(fill) + " on " + z.hex(under) };
    if (fr < 1.05) out.lowFill.push(z.name(r) + " \"" + r.textContent.trim().slice(0, 24) + "\" " + fr.toFixed(3) + ":1 (" + z.hex(fill) + " on " + z.hex(under) + ")");
    [r, ...r.querySelectorAll("*")].forEach(el => {
      if (![...el.childNodes].some(t => t.nodeType === 3 && t.textContent.trim())) return;
      if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return;
      const cs = getComputedStyle(el), bg = z.backdrop(el), fg = z.over(z.bytes(cs.color), bg);
      const ratio = z.ratio(fg, bg), px = parseFloat(cs.fontSize);
      const need = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700) ? 3 : 4.5;
      out.texts++;
      if (!out.text || ratio / need < out.text.r / out.text.need)
        out.text = { r: ratio, need, at: z.name(el) + " \"" + el.textContent.trim().slice(0, 20) + "\" " + z.hex(fg) + " on " + z.hex(bg) };
      if (ratio < need - 0.005) out.lowText.push(z.name(el) + " \"" + el.textContent.trim().slice(0, 20) + "\" " + ratio.toFixed(2) + ":1 (" + z.hex(fg) + " on " + z.hex(bg) + ")");
    });
  });
  return out;
}

// ---------- T-016: the thumbnails, measured inside the page ----------
// Every lecture row on the page and its thumbnail, against the curriculum
// (window.DAR, the data file the page loaded) by the row's own href. `fmt` is
// the harness's own reading of a whole-minute length.
function thumbState() {
  const z = window.__dz;
  const T = { s2: z.tok("--surface-2") };
  const fmt = min => {
    if (min !== Math.floor(min)) return "?" + min;            // every `min` is whole minutes; say so if one is not
    const h = Math.floor(min / 60), m = min % 60;
    return h ? h + ":" + String(m).padStart(2, "0") + ":00" : m + ":00";
  };
  const hue = p => {
    const [r, g, b] = p.slice(0, 3).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (!d) return null;
    const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (h * 60 + 360) % 360;
  };
  const textOn = el => {
    const cs = getComputedStyle(el), bg = z.backdrop(el), fg = z.over(z.bytes(cs.color), bg);
    return { r: z.ratio(fg, bg), fg: z.hex(fg), bg: z.hex(bg) };
  };
  const rows = [];
  document.querySelectorAll('#view a.grow[href^="#/lesson/"]').forEach(a => {
    const [, , cid, ui, li] = a.getAttribute("href").slice(1).split("/");
    const c = window.DAR.COURSES.find(x => x.id === cid);
    const l = c && c.units[+ui] && c.units[+ui].lessons[+li];
    const t = a.querySelector(":scope > .thumb");
    const out = { at: cid + "/" + ui + "/" + li, v: l ? l.v || null : undefined, title: l ? l.t : "",
                  want: l ? (l.min ? fmt(l.min) : l.paper ? "Paper" : "Reading") : "", thumb: !!t, vis: a.checkVisibility() };
    if (!t) { rows.push(out); return; }
    const img = t.querySelector("img");
    const tb = t.getBoundingClientRect(), bg = z.bytes(getComputedStyle(t).backgroundColor);
    const edge = t.querySelector(".th-prog i");
    Object.assign(out, {
      cls: t.className, imgs: t.querySelectorAll("img").length,
      src: img ? img.getAttribute("src") : null, loading: img ? img.getAttribute("loading") : null,
      decoding: img ? img.getAttribute("decoding") : null, alt: img ? img.getAttribute("alt") : null,
      ratio: (r => r.height ? r.width / r.height : 0)((img || t).getBoundingClientRect()),
      boxRatio: tb.height ? tb.width / tb.height : 0, boxW: tb.width,
      imgOpacity: img ? getComputedStyle(img).opacity : null,
      bg: z.hex(bg), bgOpaque: bg[3] === 255, skeleton: z.same(bg, T.s2), bgHue: hue(bg),
      fac: getComputedStyle(t).getPropertyValue("--fac").trim(),
      facHue: hue(z.bytes(getComputedStyle(t).getPropertyValue("--fac").trim() || "transparent")),
      chip: ((t.querySelector(".th-dur") || {}).textContent || "").trim(),
      chipAria: t.querySelector(".th-dur") ? t.querySelector(".th-dur").getAttribute("aria-hidden") : null,
      edge: edge ? edge.style.width : "", edgeCol: edge ? z.hex(z.bytes(getComputedStyle(edge).backgroundColor)) : "",
      sub: ((a.querySelector(".g-s") || {}).textContent || "").trim(),
      code: ((t.querySelector(".th-code") || {}).textContent || "").replace(/\s+/g, " ").trim(),
      codeShown: !!t.querySelector(".th-code") && t.querySelector(".th-code").checkVisibility(),
      ttl: ((t.querySelector(".th-ttl") || {}).textContent || "").trim(),
      course: c ? c.code : "",
    });
    // Text drawn on the frame, where it is showing: the cover's code and its
    // number, and the chip.
    out.texts = [...t.querySelectorAll(".th-code, .th-no, .th-dur")]
      .filter(el => el.checkVisibility() && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
      .map(el => Object.assign({ what: el.className + " \"" + el.textContent.trim().slice(0, 16) + "\"" }, textOn(el)));
    // The chip over any picture at all: its fill over pure white and pure black.
    const d = t.querySelector(".th-dur");
    if (d) {
      const cs = getComputedStyle(d), fill = z.bytes(cs.backgroundColor), ink = z.bytes(cs.color);
      out.chipWorst = Math.min(...[[255, 255, 255, 255], [0, 0, 0, 255]].map(under => {
        const b = z.over(fill, under);
        return z.ratio(z.over(ink, b), b);
      }));
    }
    rows.push(out);
  });
  return rows;
}
// Scroll every visible frame still waiting into view (a closed unit's never
// asks for its image), two frames each, so its lazy request is really made;
// then wait for every one to settle — proof, with a ceiling, so a fallback
// that never comes is a failure and not a hang.
async function visitThumbs(page) {
  await page.evaluate(async () => {
    const two = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const t of document.querySelectorAll("#view .thumb")) {
      if (!t.querySelector("img") || !t.checkVisibility()) continue;
      t.scrollIntoView({ block: "center", behavior: "instant" });
      await two();
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  // Measured the moment the last one settles, deliberately with no wait for
  // animations: the state change has to be a swap. The first run of this
  // check found the last 8 to 12 frames visited half-way through the
  // kill-switch's 0.01ms transition — the cover's white code on the
  // skeleton's grey — which is the frame a reader sees too.
  return page.waitForFunction(() => [...document.querySelectorAll("#view .thumb")].filter(t => t.checkVisibility())
    .every(t => t.classList.contains("cover") || t.classList.contains("loaded")), null, { timeout: 6000, polling: 100 })
    .then(() => true, () => false);
}
// A solid-colour PNG, for the frames this harness does let load.
function png(w, h, rgb) {
  const zlib = require("zlib");
  const crcT = [];
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = buf => { let c = 0xffffffff; for (const b of buf) c = crcT[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const sum = Buffer.alloc(4); sum.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, sum]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const row = Buffer.alloc(1 + w * 3);
  for (let x = 0; x < w; x++) { row[1 + x * 3] = rgb[0]; row[2 + x * 3] = rgb[1]; row[3 + x * 3] = rgb[2]; }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(Buffer.concat(Array(h).fill(row)))), chunk("IEND", Buffer.alloc(0))]);
}
// The curriculum, read here from the data file itself, for what the harness
// has to know before the page does (which frames to let load).
const CURRICULUM = (() => {
  const vm = require("vm");
  const sandbox = { window: {} };
  sandbox.window.DAR = sandbox.DAR = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "platform/data/curriculum.js"), "utf8"), sandbox);
  return sandbox.window.DAR;
})();
const ytimg = v => "https://i.ytimg.com/vi/" + v + "/hqdefault.jpg";

// The keyboard ring. The section is the box that clips: .glist is overflow
// hidden, so an outline drawn outside a row is simply not painted. Marks the
// first visible section whose only visible child is a row that goes somewhere
// (a link or a button) — a one-row section, where a ring outside the row has
// no neighbour to land on and so vanishes completely.
function markOneRow() {
  const g = [...document.querySelectorAll("#view .glist")].filter(n => n.checkVisibility()).find(n => {
    const k = [...n.children].filter(c => c.checkVisibility());
    return k.length === 1 && k[0].matches("a.grow, button.grow");
  });
  if (!g) return null;
  g.dataset.ringList = "1";
  return g.textContent.trim().replace(/\s+/g, " ").slice(0, 40);
}
// Where the focused row's outline is drawn, against the section's padding box
// (the clip). An outline's outer edge is the border box grown by
// outline-offset + outline-width on every side.
function ringState() {
  const z = window.__dz;
  const g = document.querySelector("[data-ring-list]");
  const row = g && [...g.children].find(c => c.checkVisibility());
  const a = document.activeElement;
  if (!row || a !== row) return { err: "focus is on " + (a ? z.name(a) : "nothing") + ", not the row" };
  row.scrollIntoView({ block: "center", behavior: "instant" });
  const cs = getComputedStyle(row), gs = getComputedStyle(g);
  const r = row.getBoundingClientRect(), gr = g.getBoundingClientRect();
  const w = parseFloat(cs.outlineWidth) || 0, off = parseFloat(cs.outlineOffset) || 0, e = w + off;
  const px = k => parseFloat(gs["border" + k + "Width"]) || 0;
  const clip = { l: gr.left + px("Left"), t: gr.top + px("Top"), r: gr.right - px("Right"), b: gr.bottom - px("Bottom") };
  const ring = { l: r.left - e, t: r.top - e, r: r.right + e, b: r.bottom + e };
  // Nothing of the page's own may sit over the section (the bars are fixed
  // and sticky), or the pixels below would be measuring them.
  const mx = (clip.l + clip.r) / 2, my = (clip.t + clip.b) / 2;
  const covered = [[mx, clip.t + 1], [clip.r - 1, my], [mx, clip.b - 1], [clip.l + 1, my]]
    .map(([x, y]) => document.elementFromPoint(x, y)).filter(n => !n || !g.contains(n)).map(n => n ? z.name(n) : "nothing");
  return {
    fv: row.matches(":focus-visible"), name: z.name(row), style: cs.outlineStyle, w, off,
    col: z.bytes(cs.outlineColor), accent: z.tok("--accent"), clip, ring, covered,
  };
}
// The section as painted with the row focused (`on`) and not (`off`), two PNGs
// decoded through a canvas. For a pixel, `gain` is how far it moved from its
// unfocused colour toward --accent: 0 unchanged, 1 the ring's colour. Each
// probe walks inward from the section's edge — 8px at the middle of each side,
// 14px along the diagonal at each corner, where the rounded clip is — and keeps
// the best gain it meets.
async function ringPixels([on, off]) {
  const z = window.__dz;
  const load = async b64 => {
    const im = new Image();
    im.src = "data:image/png;base64," + b64;
    await im.decode();
    const cv = document.createElement("canvas"); cv.width = im.naturalWidth; cv.height = im.naturalHeight;
    const k = cv.getContext("2d", { willReadFrequently: true });
    k.drawImage(im, 0, 0);
    return { w: cv.width, h: cv.height, d: k.getImageData(0, 0, cv.width, cv.height).data };
  };
  const A = await load(on), B = await load(off), acc = z.tok("--accent");
  if (A.w !== B.w || A.h !== B.h) return { err: "the two shots differ in size: " + A.w + "x" + A.h + " and " + B.w + "x" + B.h };
  const s = A.w / document.querySelector("[data-ring-list]").getBoundingClientRect().width;
  const gain = (x, y) => {
    const i = (y * A.w + x) * 4;
    let num = 0, den = 0;
    for (let c = 0; c < 3; c++) { const d = acc[c] - B.d[i + c]; num += (A.d[i + c] - B.d[i + c]) * d; den += d * d; }
    return den ? num / den : 0;
  };
  const walk = (x0, y0, dx, dy, n) => {
    let best = -Infinity;
    for (let k = 0; k < n; k++) {
      const x = x0 + dx * k, y = y0 + dy * k;
      if (x >= 0 && y >= 0 && x < A.w && y < A.h) best = Math.max(best, gain(x, y));
    }
    return best;
  };
  const W = A.w - 1, H = A.h - 1, mx = Math.round(W / 2), my = Math.round(H / 2);
  const side = Math.ceil(8 * s), diag = Math.ceil(14 * s);
  return {
    sides: { top: walk(mx, 0, 0, 1, side), right: walk(W, my, -1, 0, side), bottom: walk(mx, H, 0, -1, side), left: walk(0, my, 1, 0, side) },
    corners: { "top-left": walk(0, 0, 1, 1, diag), "top-right": walk(W, 0, -1, 1, diag),
               "bottom-right": walk(W, H, -1, -1, diag), "bottom-left": walk(0, H, 1, -1, diag) },
  };
}
// The press needs rows that carry every variant, so its contexts add two quiz
// scores to the seed: a pass and a gap, which put a --good and a --bad status
// pill on /exams rows.
function seedScores() {
  if (window.top !== window) return;
  const s = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  s.quizAttempts = { "linear-algebra": [{ date: "2026-10-16", score: 9, total: 10, pct: 90 }],
                     "calculus": [{ date: "2026-10-16", score: 4, total: 10, pct: 40 }] };
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}
// Force a pseudo-class on every node matching `selector`, over CDP: the state
// the browser itself would compute under a finger or a pointer, without
// moving either (a real tap would navigate away mid-measurement).
async function force(cdp, selector, classes) {
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector });
  for (const nodeId of nodeIds) await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: classes });
  return nodeIds.length;
}

// The four hairlines T-006 and T-007 declare, read from the stylesheet: each
// must be 0.5px of --line (see `hairline` for why the live value cannot say).
function hairlineSource() {
  const css = fs.readFileSync(CSS_FILE, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const top = readBlocks(css);
  const phone = top.filter(b => /^@media\s*\(max-width:\s*860px\)$/.test(b.prelude)).flatMap(b => readBlocks(b.body));
  const rule = (list, sel) => { const hits = list.filter(b => b.prelude === sel); return hits.length ? decls(hits.map(b => b.body).join(";")) : null; };
  for (const [where, list, sel, prop, width] of [
    ["the nav bar's scroll edge", phone, ".topbar::after", "border-bottom"],
    // T-023 made this one a 1px edge all round the capsule (the spec's "1px
    // hairline edge"); it was a 0.5px top edge on a full-width bar.
    ["the tab bar's edge", phone, ".tabbar", "border", "1px"],
    ["the sidebar's trailing edge", top, ".sidebar", "border-right"],
    ["a row's separator", top, ".grow::before", "border-top"],
  ]) {
    const px = width || "0.5px";
    const r = rule(list, sel), v = r && effective(r, prop);
    check("hairline: " + where + " is declared " + px + " solid var(--line) (" + sel + " " + prop + ")",
      !!v && new RegExp("^" + px.replace(".", "\\.") + "\\s+solid\\s+var\\(--line\\)$").test(v), r ? prop + ": " + v : "no " + sel + " rule");
  }
}

// ---------- T-026a: the Atlas route and the Courses shelf ----------
// Everything this block expects is worked out here, not read from the view.
// The gate dates walk the study calendar from curriculum.js one calendar day
// at a time, skipping Saturdays (the rest day, CLAUDE.md) — a brute force,
// where the app uses closed-form arithmetic, so the two can disagree. Which
// courses are running and which open later comes from the schedule itself
// (scheduledFor, through the test-only hook verify-logic uses), not from the
// page that draws them.
const T26_TODAY = FIXED_NOW.toISOString().slice(0, 10);
const T26_STUDY = (() => {
  const out = [];
  const d = new Date(CURRICULUM.START_DATE + "T00:00:00Z");
  while (out.length < 1400) {
    if (d.getUTCDay() !== 6) out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
})();
// A rest day counts as the study day before it; anything up to the start is 0.
const t26Pos = iso => { let n = 0; for (let i = 0; i < T26_STUDY.length && T26_STUDY[i] <= iso; i++) n = i; return n; };
const T26_GATES = (() => {
  let base = CURRICULUM.START_DATE;
  return CURRICULUM.GATES.map(g => {
    const target = T26_STUDY[T26_STUDY.indexOf(base) + Math.round(g.months * 30.4)];
    base = target;
    return { n: g.n, label: g.label, req: g.req, target };
  });
})();
const t26Month = (iso, long) => new Date(iso + "T00:00:00Z").toLocaleString("en-US", { month: long ? "long" : "short", year: "numeric", timeZone: "UTC" });
const T26_DAYS = Math.round((Date.parse(T26_GATES[0].target) - Date.parse(T26_TODAY)) / 86400000);
// The seed passes no gate, so the next gate is the first, and the fill is the
// share of its segment (Start to its target) already walked.
const T26_F = (t26Pos(T26_TODAY) - t26Pos(CURRICULUM.START_DATE)) / (t26Pos(T26_GATES[0].target) - t26Pos(CURRICULUM.START_DATE));
const T26_FILL = (0 + T26_F) / T26_GATES.length;
const T26_FAC = { "Mathematics": "--fac-math", "Computer Science": "--fac-sys", "Artificial Intelligence": "--fac-ai",
                  "Physics": "--fac-phys", "Systems": "--fac-sys", "Research": "--fac-res", "Speech": "--fac-speech" };
// A resume point, as T-016's checks seed one: lecture 2 of AI 200, paused at
// 5:00 an hour before the pinned clock — the newest thing in the state.
function seedResume([nowMs]) {
  if (window.top !== window) return;
  const s = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  s.lessons = s.lessons || {};
  s.lessons["ai200.0.1"] = { done: false, notes: "", checks: [], pos: 300, posAt: new Date(nowMs - 3600000).toISOString() };
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}
// Gate 1 passed on 12 Oct (T-031): the next gate is Core skills, four months
// of study days on from that date, so the Atlas counts three digits to it.
function seedGate1() {
  if (window.top !== window) return;
  const s = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  s.gates = { 1: "2026-10-23" };
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}
// Running and later, from the schedule: a course runs once a lecture of it
// has been scheduled on or before today's study day (a tracker always runs).
function t26Sets(today) {
  const T = window.__brickfordTest, C = window.DAR.COURSES;
  let d = T.studyIndex(today);
  for (let back = today; d < 0 && back > window.DAR.START_DATE;) {
    const dt = new Date(back + "T00:00:00Z"); dt.setUTCDate(dt.getUTCDate() - 1);
    back = dt.toISOString().slice(0, 10); d = T.studyIndex(back);
  }
  const first = {};
  for (let i = 0; i <= 400; i++) T.scheduledFor(T.dateForStudy(i)).forEach(it => { if (it.cid && first[it.cid] == null) first[it.cid] = i; });
  const running = C.filter(c => c.tracker || (first[c.id] != null && first[c.id] <= d)).map(c => c.id);
  const later = C.filter(c => running.indexOf(c.id) < 0)
    .sort((a, b) => (first[a.id] == null ? 1e9 : first[a.id]) - (first[b.id] == null ? 1e9 : first[b.id])).map(c => c.id);
  return { running, later, faculty: Object.fromEntries(C.map(c => [c.id, c.faculty])) };
}
function atlasState() {
  const z = window.__dz;
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const box = r => ({ l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height });
  const textBox = n => { const rg = document.createRange(); rg.selectNodeContents(n); return box(rg.getBoundingClientRect()); };
  const rt = document.querySelector("#view .rt");
  const nodes = vis("#view .rt-node").map(n => {
    const dot = n.querySelector(".rt-dot"), ds = getComputedStyle(dot), lab = n.querySelector(".rt-lab");
    const seg = getComputedStyle(n, "::after");
    return { cls: n.className, dot: box(dot.getBoundingClientRect()), bg: z.bytes(ds.backgroundColor),
             border: z.bytes(ds.borderTopColor), lab: box(lab.getBoundingClientRect()),
             name: (lab.querySelector("b") || {}).textContent, when: (lab.querySelector("span") || {}).textContent,
             seg: seg.content === "none" ? null : z.bytes(seg.backgroundColor) };
  });
  const pin = vis("#view .rt-pin")[0];
  const tb = rt && getComputedStyle(rt, "::before"), fb = rt && getComputedStyle(rt, "::after");
  const tiles = vis("#view .at-tile").map(a => {
    const code = a.querySelector(".tl-code");
    return { href: a.getAttribute("href"), box: box(a.getBoundingClientRect()), col: code ? z.bytes(getComputedStyle(code).color) : null,
             ring: !!a.querySelector(".tl-ring svg .tr-fg"), pct: (a.querySelector(".tl-pct") || {}).textContent };
  });
  const chips = vis("#view .at-chip").map(a => ({ href: a.getAttribute("href"), text: a.textContent.trim().replace(/\s+/g, " "), box: box(a.getBoundingClientRect()) }));
  const view = document.querySelector("#view");
  const one = sel => { const n = document.querySelector(sel); return n ? n.textContent.trim().replace(/\s+/g, " ") : null; };
  return {
    h1: one("#view .page-head h1"), sub: one("#view .page-head .sub"),
    nodes, pin: pin ? { text: pin.textContent.trim(), box: textBox(pin) } : null,
    track: tb && tb.content !== "none" ? parseFloat(tb.width) : null, fill: fb && fb.content !== "none" ? parseFloat(fb.width) : null,
    next: (() => { const a = document.querySelector("#view .at-next"); return a ? { tag: a.tagName, href: a.getAttribute("href") } : null; })(),
    kicker: one("#view .at-next .at-k"), gate: one("#view .at-next .at-gate"),
    reqs: vis("#view .at-req").map(n => n.textContent.trim()), days: one("#view .at-days b"),
    tilesMeta: one("#view .at-tiles"), tiles, chips,
    concept: (() => { const a = document.querySelector("#view .at-concepts"); return a ? { text: a.textContent.trim(), href: a.getAttribute("href"), h: a.getBoundingClientRect().height } : null; })(),
    rest: /The rest of it/.test(view.textContent), glist: vis("#view .glist").length,
    accent: z.tok("--accent"), fac: Object.fromEntries(["--fac-math", "--fac-ai", "--fac-sys", "--fac-phys", "--fac-res", "--fac-speech"].map(t => [t, z.tok(t)])),
  };
}
function coursesState() {
  const z = window.__dz;
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const surface = z.tok("--surface"), bg = z.tok("--bg");
  const mix = (a, b, p) => [0, 1, 2].map(i => a[i] * p + b[i] * (1 - p));
  return {
    seg: vis("#view .seg [data-shelf]").map(b => ({ k: b.dataset.shelf, t: b.textContent.trim(), on: b.getAttribute("aria-pressed") === "true",
      w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height })),
    empty: vis("#view .shelf-empty").length,
    shelves: vis("#view .shelf").map(s => {
      const head = s.previousElementSibling && s.previousElementSibling.matches(".ghead") ? s.previousElementSibling.firstChild.textContent.trim() : "";
      return { head, cols: getComputedStyle(s).gridTemplateColumns.split(" ").filter(Boolean).length,
        books: [...s.querySelectorAll(".book")].map(b => {
          const fac = [...b.classList].find(c => /^fac-/.test(c)), ft = fac ? z.tok("--" + fac) : null;
          const cover = b.querySelector(".cover"), code = b.querySelector(".cv-code"), later = b.classList.contains("later");
          const want = ft ? (later ? mix(mix(ft, surface, 0.14), bg, 0.45) : mix(ft, surface, 0.14)) : null;
          const r = b.getBoundingClientRect();
          return { href: b.getAttribute("href"), code: code ? code.textContent.trim() : "", meta: (b.querySelector(".bk-m") || {}).textContent || "",
                   later, fac, w: r.width, h: r.height, left: Math.round(r.left),
                   codeCol: code ? z.bytes(getComputedStyle(code).color) : null, facCol: ft,
                   coverBg: cover ? z.bytes(getComputedStyle(cover).backgroundColor) : null, coverWant: want };
        }) };
    }),
  };
}
// The clipping sweep's question (verify-clip.js), asked of #view alone: is
// any element's content wider than its box, outside a deliberate scroller
// or ellipsis? And does the page scroll sideways?
function viewOverflow() {
  const out = [];
  document.querySelectorAll("#view *").forEach(el => {
    if (el.ownerSVGElement || !el.checkVisibility()) return;
    if (el.scrollWidth <= el.clientWidth + 1) return;
    const cs = getComputedStyle(el);
    if (cs.textOverflow === "ellipsis" || cs.overflowX === "auto" || cs.overflowX === "scroll") return;
    out.push(el.tagName.toLowerCase() + "." + String(el.className).trim().split(/\s+/)[0] + " " + el.scrollWidth + ">" + el.clientWidth);
  });
  const side = document.documentElement.scrollWidth > window.innerWidth + 1 ? document.documentElement.scrollWidth + ">" + window.innerWidth : "";
  return { out: [...new Set(out)], side };
}
// No label word broken across two lines. Asked of the rendered text itself:
// each pair of neighbouring letters in a word must sit on the same line.
// (overflow-wrap:anywhere breaks a word that does not fit — "Calibratio/n" —
// and nothing overflows, so the sweep above cannot see it. Comparing a
// nowrap copy of the word with its column was tried first and was blind:
// it read "Calibration" as 80.6px while the label rendered it as 82.3 +
// 10.7px on two lines.)
function labelWords(sel) {
  const out = [];
  // The route's labels, and the next-gate card's title and requirement chips
  // (review round 2: at a 24px root on a phone the card's grid squeezed
  // "Calibratio/n" and "Diag/nostics done" while this read only .rt-lab).
  document.querySelectorAll(sel || "#view .rt-lab, #view .at-gate, #view .at-req").forEach(lab => {
    const walk = document.createTreeWalker(lab, NodeFilter.SHOW_TEXT);
    for (let t = walk.nextNode(); t; t = walk.nextNode()) {
      const s = t.textContent, rg = document.createRange();
      let prev = null;
      for (let i = 0; i < s.length; i++) {
        // A word is a run of letters and digits: a line may break after a
        // hyphen or a dash ("Single-/Variable"), which is not mid-word.
        if (/[^A-Za-z0-9]/.test(s[i])) { prev = null; continue; }
        rg.setStart(t, i); rg.setEnd(t, i + 1);
        const top = rg.getBoundingClientRect().top;
        if (prev !== null && Math.abs(top - prev) > 1) { out.push("\"" + s.trim() + "\" breaks inside a word at \"" + s.slice(0, i) + "/" + s.slice(i) + "\""); break; }
        prev = top;
      }
    }
  });
  return out;
}
// The pin, read against its card and the labels.
function pinPlace() {
  const card = document.querySelector("#view .at-route"), pin = document.querySelector("#view .rt-pin");
  if (!card || !pin) return { err: "no " + (card ? "pin" : "route card") };
  const rg = document.createRange(); rg.selectNodeContents(pin);
  const p = rg.getBoundingClientRect(), c = card.getBoundingClientRect();
  const inside = p.left >= c.left - 0.5 && p.right <= c.right + 0.5 && p.top >= c.top - 0.5 && p.bottom <= c.bottom + 0.5;
  return { inside, text: pin.textContent.trim(), p: [p.left, p.top, p.right, p.bottom].map(v => +v.toFixed(1)), c: [c.left, c.top, c.right, c.bottom].map(v => +v.toFixed(1)),
           nodes: [...document.querySelectorAll("#view .rt-node")].map(n => n.className.replace("rt-node", "").trim()),
           gate: (document.querySelector("#view .at-next .at-gate") || {}).textContent || "" };
}
// Every pair of the route's text boxes — the six labels and the pin.
function routeOverlaps() {
  const boxes = [...document.querySelectorAll("#view .rt-lab")].map(n => ["label " + (n.querySelector("b") || n).textContent, n.getBoundingClientRect()]);
  const pin = document.querySelector("#view .rt-pin");
  if (pin) { const rg = document.createRange(); rg.selectNodeContents(pin); boxes.push(["pin", rg.getBoundingClientRect()]); }
  const hit = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i][1], b = boxes[j][1];
    if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) hit.push(boxes[i][0] + " / " + boxes[j][0]);
  }
  return { n: boxes.length, hit };
}

// ---------- T-038: a passed gate says when, and the confirm sheet ----------
// loop/specs/T-038-gates-honest/spec.md. Gate 1 passed on Fri 9 Oct (the
// owner's day 5) in the new stored shape, Gate 2 on Wed 14 Oct as a legacy
// date string. Everything expected is walked here from curriculum.js: the
// targets on the study calendar (T26_STUDY, Saturdays skipped), the arrival,
// the baseline (1094 study days from the start) and the gap between them.
const T38_DONE = { 1: "2026-10-21", 2: "2026-10-26" };
function seedT38() {
  if (window.top !== window) return;
  const s = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  s.gates = { 1: { date: "2026-10-21", at: "2026-10-21T08:00:00.000Z", passed: true }, 2: "2026-10-26" };
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}
// Every done date used here is a study day, so it indexes T26_STUDY directly.
const t38PlanOf = doneBy => {
  let base = CURRICULUM.START_DATE;
  return CURRICULUM.GATES.map(g => {
    const target = T26_STUDY[T26_STUDY.indexOf(base) + Math.round(g.months * 30.4)];
    const done = doneBy[g.n] || null;
    base = done || target;
    return { n: g.n, label: g.label, target, done };
  });
};
const T38_PLAN = t38PlanOf(T38_DONE);
const T38_ARRIVAL = T38_PLAN[4].target;
const T38_BASELINE = T26_STUDY[T26_STUDY.indexOf(CURRICULUM.START_DATE) + 1094];
const T38_AHEAD = Math.round((Date.parse(T38_BASELINE) - Date.parse(T38_ARRIVAL)) / 86400000);
// The line under the head, as the spec words it: months from half a month up
// (30.44 days, the mean calendar month), days below; ahead or behind.
const t38Words = days => { const a = Math.abs(days), m = Math.round(a / 30.44);
  return (m >= 1 ? m + " month" + (m === 1 ? "" : "s") : a + " day" + (a === 1 ? "" : "s")) + (days > 0 ? " ahead" : " behind"); };
const t38Passed = iso => "Passed " + Number(iso.slice(8)) + " " + new Date(iso + "T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" });
// The /atlas head and route labels, with the contrast of each date line
// against what is actually painted behind it.
function t38Atlas() {
  const z = window.__dz;
  const ratioOf = el => { const bg = z.backdrop(el); return z.ratio(z.over(z.bytes(getComputedStyle(el).color), bg), bg); };
  const sub = document.querySelector("#view .page-head .sub"), base = document.querySelector("#view .page-head .at-base");
  return {
    sub: sub ? sub.textContent.trim().replace(/\s+/g, " ") : null,
    base: base ? { text: base.textContent.trim().replace(/\s+/g, " "), vis: base.checkVisibility(), r: ratioOf(base) } : null,
    labs: [...document.querySelectorAll("#view .rt-node .rt-lab")].map(l => {
      const sp = l.querySelector("span");
      return { name: (l.querySelector("b") || {}).textContent, when: sp ? sp.textContent : null, r: sp ? ratioOf(sp) : 0 };
    }),
  };
}
// The open sheet: where it sits, every text's contrast, every control's size,
// and whether anything else on the screen is over its text or its controls
// (each is hit-tested at its centre: the topmost element there must be in the
// sheet, and for a control, inside that control).
function t38Sheet() {
  const z = window.__dz;
  const d = document.querySelector("dialog.sheet[open]");
  if (!d) return null;
  const b = d.getBoundingClientRect();
  const low = [], covered = [];
  let texts = 0, least = Infinity;
  const walk = document.createTreeWalker(d, NodeFilter.SHOW_TEXT);
  for (let t = walk.nextNode(); t; t = walk.nextNode()) {
    const el = t.parentElement;
    if (!t.textContent.trim() || !el.checkVisibility()) continue;
    const bg = z.backdrop(el), r = z.ratio(z.over(z.bytes(getComputedStyle(el).color), bg), bg);
    texts++; least = Math.min(least, r);
    if (r < 4.5) low.push("\"" + t.textContent.trim().slice(0, 30) + "\" " + r.toFixed(2) + ":1");
    const rg = document.createRange(); rg.selectNodeContents(t);
    const tr = rg.getBoundingClientRect(), hit = document.elementFromPoint(tr.left + tr.width / 2, tr.top + tr.height / 2);
    if (!hit || !d.contains(hit)) covered.push("\"" + t.textContent.trim().slice(0, 30) + "\" under " + (hit ? z.name(hit) : "nothing"));
  }
  const controls = [...d.querySelectorAll("button, label")].filter(n => n.checkVisibility()).map(n => {
    const r = n.getBoundingClientRect(), hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { name: n.textContent.trim().slice(0, 30), w: r.width, h: r.height, hit: !!hit && n.contains(hit) };
  });
  return { box: [b.left, b.top, b.right, b.bottom].map(v => +v.toFixed(1)), vw: innerWidth, vh: innerHeight,
           sideways: d.scrollWidth > d.clientWidth + 1, texts, least, low, covered, controls,
           title: (d.querySelector("h2") || {}).textContent || "" };
}

// ---------- T-026b: Problems, Exams and Proof say what they are for ----------
// loop/specs/T-026b-problems-exams-proof/spec.md. What each page should show
// is worked out here from the stored state and the data files (window.DAR),
// never read back from the view: the phase from the study index (the test
// hook), the counts from localStorage, the course of an exam from the
// curriculum, unlocking from each question's own `after` lecture or its
// course, the streaks from streak()/bestStreak(), the heatmap's level per day
// from the lessons, problems and sealed days on that date, and the hash chain
// for the seals is built here, hashed with Node's own sha256.
const T26B_HEAD = {
  "/workshop": ["Problems", "Only what\u2019s due now. Each item says what it is and why it\u2019s here."],   // T-045
  "/exams": ["Exams", "Timed, closed book, no AI. This is how a gate is passed."],
  "/record": ["Proof", "Every lecture you prove is sealed into a record nobody can quietly edit."],
};
const t26bCanon = v => v === null || typeof v !== "object" ? JSON.stringify(v === undefined ? null : v)
  : Array.isArray(v) ? "[" + v.map(t26bCanon).join(",") + "]"
  : "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + t26bCanon(v[k])).join(",") + "}";
// The chain as logEvent() writes it: each entry hashes its own fields and the
// previous hash; the first points at the genesis string (published in every
// export as `genesis`).
function t26bChain(events) {
  const crypto = require("crypto");
  let prev = "brickford-genesis";
  return events.map((ev, i) => {
    const e = { i, ts: ev.ts, type: ev.type, ref: ev.ref, data: ev.data, prev };
    e.hash = crypto.createHash("sha256").update(t26bCanon(e), "utf8").digest("hex");
    prev = e.hash;
    return e;
  });
}
// A lecture's name on a seal: its course code and its place in the course.
const t26bLectureName = ref => {
  const [cid, ui, li] = ref.split(".");
  const c = CURRICULUM.COURSES.find(x => x.id === cid);
  if (!c || !c.units || !c.units[ui] || !c.units[ui].lessons[li]) return null;
  let n = +li + 1;
  for (let u = 0; u < +ui; u++) n += c.units[u].lessons.length;
  return c.code + " · L" + n;
};
const T26B_LONG = t26bChain([
  { ts: "2026-10-27T09:00:00.000Z", type: "lesson", ref: "math110.0.0", data: { done: true } },
  { ts: "2026-10-28T09:00:00.000Z", type: "lesson", ref: "math110.0.13", data: { done: true } },
  { ts: "2026-10-28T10:00:00.000Z", type: "verified", ref: "math110.0.13", data: { solved: 3 } },
  { ts: "2026-10-30T09:00:00.000Z", type: "day", ref: "2026-10-30", data: {} },
  { ts: "2026-10-30T10:00:00.000Z", type: "lab", ref: "micrograd-blind", data: { done: true } },
  { ts: "2026-11-01T09:00:00.000Z", type: "lesson", ref: "math110.1.2", data: { done: true } },
]);
const T26B_SHORT = T26B_LONG.slice(0, 2);
// The tracker's problems, as S.problems keys them ("category|name").
const T26B_PROBLEMS = (() => { const c = CURRICULUM.COURSES.find(x => x.tracker);
  return [].concat(...Object.keys(c.problems).map(cat => c.problems[cat].map(n => cat + "|" + n))); })();
// A stored state on top of the seed: arrays and scalars replace, objects merge.
const t26bPatch = patch => new Function("args",
  "if (window.top !== window) return; const s = JSON.parse(localStorage.getItem('darhikmah_v1') || '{}'); const p = " + JSON.stringify(patch) + ";" +
  "for (const k in p) { if (Array.isArray(p[k]) || typeof p[k] !== 'object' || p[k] === null) s[k] = p[k]; else s[k] = Object.assign(s[k] || {}, p[k]); }" +
  "localStorage.setItem('darhikmah_v1', JSON.stringify(s));");
// The filled primary on the page, and the part of the window a reader sees:
// under the phone's bar and above the floating tab bar and Next bar.
function t26bPrimary() {
  const z = window.__dz, fill = z.tok("--btn-bg");
  const filled = [...document.querySelectorAll("#view a, #view button")].filter(n => n.checkVisibility() &&
    (b => b[3] === 255 && z.same(b, fill, 2))(z.bytes(getComputedStyle(n).backgroundColor)));
  const shown = sel => { const n = document.querySelector(sel); return n && n.checkVisibility() && n.getBoundingClientRect().height > 0 ? n.getBoundingClientRect() : null; };
  const tb = shown("#topbar"), tab = shown("#tabbar"), rail = shown("#railbar");
  return {
    filled: filled.map(n => { const r = n.getBoundingClientRect(), m = n.closest("[data-mode]");
      return { text: n.textContent.trim(), href: n.getAttribute("href"), mode: m ? m.dataset.mode : null, t: r.top, b: r.bottom, w: r.width, h: r.height }; }),
    top: tb ? tb.bottom : 0, floor: Math.min(window.innerHeight, tab ? tab.top : Infinity, rail ? rail.top : Infinity), scrollY: window.scrollY,
    head: (() => { const h = document.querySelector("#view .page-head h1"), s = document.querySelector("#view .page-head .sub");
      return { h1: h ? h.textContent.trim() : null, sub: s ? s.textContent.trim() : null }; })(),
  };
}
// T-026b's catalogue, as it still ships behind T-045's "Everything" fold:
// the current phase's lab list (its head and the phase name, one row per lab
// of the phase, in order, ticked as stored), the folds under it, no stat box.
// Read once #pbAll has been opened by pressing its summary.
function t26bWorkshop() {
  const D = window.DAR, T = window.__brickfordTest, st = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  const today = (() => { const d = new Date(), p = n => String(n).padStart(2, "0"); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); })();
  // The plan week: six study days; a rest day belongs to the week just worked.
  let iso = today, idx = T.studyIndex(iso);
  for (let g = 0; g < 7 && idx < 0 && iso > D.START_DATE; g++) {
    const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() - 1);
    iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    idx = T.studyIndex(iso);
  }
  const week = Math.max(1, Math.floor(Math.max(0, idx) / 6) + 1);
  const phase = week > 78 ? 3 : week > 26 ? 2 : week > 2 ? 1 : 0;
  const labs = st.labs || {};
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const txt = (n, s) => { const x = n.querySelector(s); return x ? x.textContent.trim() : null; };
  const all = document.querySelector("#view details#pbAll");
  return {
    phase, allOpen: !!all && all.open,
    want: { rows: D.LABS.filter(l => l.phase === phase).map(l => ({ id: l.id, title: l.title, req: l.req, hours: l.hours, done: !!(labs[l.id] || {}).done })) },
    rows: vis("#view .pb-labs .pb-lab").map(r => {
      const cb = r.querySelector("input[data-lab]"), lb = r.querySelector("label");
      return { id: cb ? cb.dataset.lab : null, checked: cb ? cb.checked : null, title: txt(r, ".pb-lt-t"), desc: txt(r, ".pb-lt-d"), hours: txt(r, ".pb-h"),
        box: !!r.querySelector(".checkbox"), h: lb ? lb.getBoundingClientRect().height : 0 };
    }),
    head: (() => { const l = document.querySelector("#view #pbLabs"), g = l && l.previousElementSibling;
      return g && g.matches(".ghead") ? { t: g.firstChild.textContent.trim(), meta: txt(g, ".gh-meta") } : null; })(),
    phaseName: ["Phase 0 · Calibration", "Phase 1 · Foundations", "Phase 2 · Depth", "Phase 3 · Frontier"][phase],
    statBox: document.querySelectorAll("#view .onecounts").length,
    setsFold: !!document.querySelector("#view details#pbSets"), otherFold: [...document.querySelectorAll("#view details.unit .u-name")].map(n => n.textContent.trim()),
    // "under the list": each fold starts below the last lab row.
    under: (() => { const l = document.querySelector("#view #pbLabs"), lb = l ? l.getBoundingClientRect().bottom : null;
      return [...document.querySelectorAll("#view #pbAll details.unit")].map(d => ({ name: txt(d, ".u-name"), below: lb === null || d.getBoundingClientRect().top >= lb - 0.5 })); })(),
  };
}
// T-045 (replaces T-026b's mode cards and phase list): what /workshop
// should list as due, worked out here from the stored state and the data
// files — `after` on every pset and lab, the phase from the study index —
// with only "cleared" asked of the app (T-043's lessonCleared, itself gated
// by verify-logic). And what the page shows: the due rows (kind, id, title,
// tag, why-line, action and its box), the count, the empty state, "How this
// works", "Coming up", and the "Everything" fold.
function t45Problems() {
  const D = window.DAR, T = window.__brickfordTest, st = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  const p2 = n => String(n).padStart(2, "0"), isoOf = d => d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate());
  let iso = isoOf(new Date()), idx = T.studyIndex(iso);
  for (let g = 0; g < 7 && idx < 0 && iso > D.START_DATE; g++) { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() - 1); iso = isoOf(d); idx = T.studyIndex(iso); }
  const week = Math.max(1, Math.floor(Math.max(0, idx) / 6) + 1), phase = week > 78 ? 3 : week > 26 ? 2 : week > 2 ? 1 : 0;
  const lessons = st.lessons || {}, psets = st.psets || {}, labs = st.labs || {};
  const flat = [].concat(...D.COURSES.map(c => [].concat(...(c.units || []).map((u, ui) => u.lessons.map((l, li) => ({ k: c.id + "." + ui + "." + li, cid: c.id, ui, li, code: c.code, t: l.t }))))));
  const byKey = Object.fromEntries(flat.map(f => [f.k, f]));
  const nOf = k => { const f = byKey[k]; return f ? flat.filter(x => x.cid === f.cid).findIndex(x => x.k === k) + 1 : 0; };
  const checksOf = k => ((D.SUMMARIES || {})[k] || {}).checks || [];
  const first = s => [s.doneAt, s.firstDoneAt].filter(Boolean).sort()[0] || null;
  const gf = s => !!(s && s.done && first(s) && first(s) < T.QUIZ_GATE_FROM);
  const open = f => { const s = lessons[f.k]; return !!(s && s.done) && checksOf(f.k).length > 0 && !((s.quiz || {}).passedAt); };
  const items = [].concat(...D.PSETS.map(g => g.items.map(i => Object.assign({ course: g.course }, i))));
  const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
  const want = [];
  flat.filter(f => open(f) && !gf(lessons[f.k])).forEach(f => {
    const nx = flat[flat.indexOf(f) + 1], locks = !!nx && nx.cid === f.cid && T.lockedBy(nx.cid, nx.ui, nx.li);
    want.push({ due: "quiz", id: f.k, title: "Lecture quiz · " + f.t, tag: "Quiz",
      why: f.code + " · watched, not passed · " + plural(checksOf(f.k).length, "question") + (locks ? " · locks the next lecture" : ""), go: "Take it", href: "#/lesson/" + f.cid + "/" + f.ui + "/" + f.li });
  });
  flat.filter(f => open(f) && gf(lessons[f.k])).forEach(f => want.push({ due: "catchup", id: f.k, title: "Lecture quiz · " + f.t, tag: "Quiz",
    why: f.code + " · catch-up · watched, not passed · " + plural(checksOf(f.k).length, "question"), go: "Take it", href: "#/lesson/" + f.cid + "/" + f.ui + "/" + f.li }));
  items.filter(i => T.lessonCleared(i.after) && !psets[i.id]).forEach(i => want.push({ due: "pset", id: i.id, title: "Problem set · " + i.course + ", " + i.label, tag: "Problem set",
    why: "Pen and paper · unlocked: you " + (((lessons[i.after] || {}).quiz || {}).passedAt ? "passed " : "watched ") + (byKey[i.after] || {}).t, go: "Open" }));
  D.LABS.filter(l => T.lessonCleared(l.after) && l.phase <= phase && !(labs[l.id] || {}).done).forEach(l => want.push({ due: "lab", id: l.id, title: "Lab · " + l.title, tag: "Lab",
    req: l.req, tail: " · Phase " + l.phase + " · ~" + l.hours + " h", go: "Start" }));
  const misses = Object.keys(st.quizMisses || {}).some(b => (st.quizMisses[b] || []).some(i => {
    const bank = (D.QUIZZES || {})[b], q = bank && bank.questions[i]; if (!q) return false;
    if (q.after) return !!(lessons[q.after] || {}).done;
    const c = D.COURSES.find(x => x.quiz === b); return !!c && flat.some(f => f.cid === c.id && (lessons[f.k] || {}).done); }));
  if (misses) want.push({ due: "review", id: "drill", title: "Daily review", tag: null, why: "questions you missed, served back until they stick", go: "Start", href: "#/drill" });
  const z = window.__dz, fill = z.tok("--btn-bg");
  const txt = (n, sel) => { const x = sel ? n.querySelector(sel) : n; return x ? x.textContent.replace(/\s+/g, " ").trim() : null; };
  const rows = [...document.querySelectorAll("#view #pdDue [data-due]")].map(n => {
    const row = n.matches("details") ? n.querySelector("summary") : n, go = row.querySelector(".pd-go"), gr = go ? go.getBoundingClientRect() : null;
    const tag = row.querySelector(".pd-tag"), m = row.querySelector(".pd-m");
    return { due: n.dataset.due, id: n.dataset.id, title: txt(row, ".pd-t"), tag: tag ? tag.textContent.trim() : null,
      why: m ? [...m.childNodes].filter(c => c !== tag).map(c => c.textContent).join("").replace(/\s+/g, " ").trim() : null,
      go: go ? go.textContent.trim() : null, goW: gr ? gr.width : 0, goH: gr ? gr.height : 0, t: gr ? gr.top : 0, b: gr ? gr.bottom : 0, text: go ? go.textContent.trim() : null, rowH: row.getBoundingClientRect().height,
      href: n.getAttribute("href"), visible: row.checkVisibility(),
      filled: !!go && (b => b[3] === 255 && z.same(b, fill, 2))(z.bytes(getComputedStyle(go).backgroundColor)) };
  });
  const soon = [...document.querySelectorAll("#view .pd-soon [data-soon]")].map(n => ({ soon: n.dataset.soon, id: n.dataset.id, meta: txt(n, ".pd-m"), title: txt(n, ".pd-t") }));
  const soonOk = soon.map(r => {
    const it = r.soon === "pset" ? items.find(i => i.id === r.id) : D.LABS.find(l => l.id === r.id); if (!it) return r.id + ": unknown";
    const L = byKey[it.after], at = "After lecture " + nOf(it.after) + " · " + (L || {}).t;
    const locked = r.soon === "pset" ? !T.lessonCleared(it.after) && !psets[it.id] : !(labs[it.id] || {}).done && (!T.lessonCleared(it.after) || it.phase > phase);
    const meta = r.soon === "pset" ? at : at + " · Phase " + it.phase;
    return locked && r.meta === meta ? null : r.id + ": \"" + r.meta + "\" (want \"" + meta + "\", locked " + locked + ")";
  }).filter(Boolean);
  const empty = document.querySelector("#view .pd-empty"), ea = empty && empty.querySelector("a[href]");
  const all = document.querySelector("#view details#pbAll");
  return { phase, want, rows, soon, soonOk, count: txt(document, "#view .pd-count"),
    empty: empty ? { text: txt(empty), href: ea ? ea.getAttribute("href") : null } : null,
    how: [...document.querySelectorAll("#view .pd-how > div")].map(d => ({ b: txt(d, "b"), text: txt(d) })),
    howCols: new Set([...document.querySelectorAll("#view .pd-how > div")].map(d => Math.round(d.getBoundingClientRect().left))).size,
    all: all ? { open: all.open, sum: txt(all, "summary .u-name") } : null,
    oldModes: document.querySelectorAll("#view .pb-mode").length };
}
function t26bExams() {
  const D = window.DAR, z = window.__dz, st = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  const lessons = st.lessons || {}, done = k => !!(lessons[k] || {}).done;
  const dsa = Object.values(st.problems || {}).filter(Boolean).length;
  const lectureKeys = c => [].concat(...(c.units || []).map((u, ui) => u.lessons.map((_, li) => c.id + "." + ui + "." + li)));
  const watch = c => !c ? { w: 0, of: 0 } : c.tracker ? { w: dsa, of: 150 } : { w: lectureKeys(c).filter(done).length, of: lectureKeys(c).length };
  // An exam's course, found a different way from the app's: a bank by the
  // course code it carries itself, a diagnostic by the approved mockups'
  // tags (specimen-exams.png: MIT 18.06 is MATH 110, 18.01 MATH 120, Stat
  // 110 MATH 130, the coding diagnostic CS 150).
  const byCode = code => D.COURSES.find(x => x.code === code) || null;
  const DIAG_CODE = { "diag-la": "MATH 110", "diag-calc": "MATH 120", "diag-prob": "MATH 130", "diag-code": "CS 150" };
  const banks = Object.keys(D.QUIZZES).map(id => {
    const c = byCode(D.QUIZZES[id].course);
    const anyDone = !!c && (lectureKeys(c).some(done) || (!!c.tracker && dsa > 0));
    const n = D.QUIZZES[id].questions.filter(q => q.after ? done(q.after) : anyDone).length;
    const at = (st.quizAttempts || {})[id] || [];
    // What a sitting serves: perSitting questions, or every unlocked one if
    // fewer are unlocked than that.
    const size = Math.min(D.QUIZZES[id].perSitting, n) + " questions";
    return { id, c, n, size, len: D.QUIZZES[id].questions.length, sat: at.length > 0, title: D.QUIZZES[id].title };
  });
  const diags = D.DIAGNOSTICS.map(d => ({ d, c: byCode(DIAG_CODE[d.id]), sat: ((st.diag || {})[d.id] || {}).score != null }));
  // Gate 1 as the app reads a stored gate (gateRec, T-038): an object is
  // passed only with passed === true and a date; a "YYYY-MM-DD" string or a
  // legacy true is passed; anything else — false, nothing, an unmark object
  // { date: null, at, passed: false } — is open. (This read !!gates[1], which
  // counts an unmark object as passed.)
  const g1 = (st.gates || {})[1];
  const gatePassed = g1 && typeof g1 === "object" ? g1.passed === true && !!g1.date
    : g1 === true || (typeof g1 === "string" && /^\d{4}-\d\d-\d\d$/.test(g1));
  const unsatDiag = diags.find(x => !x.sat);
  // The one to sit next: an unsat diagnostic while Gate 1 is open, else the
  // open, unsat bank with the most of it unlocked.
  const leadBank = banks.filter(b => b.n && !b.sat).sort((a, b) => b.n / b.len - a.n / a.len)[0];
  const lead = !gatePassed && unsatDiag ? { kind: "diag", id: unsatDiag.d.id, c: unsatDiag.c, title: unsatDiag.d.title, href: "#/diag/" + unsatDiag.d.id,
      size: unsatDiag.d.minutes + " min", pass: unsatDiag.d.gate }
    : leadBank ? { kind: "bank", id: leadBank.id, c: leadBank.c, title: leadBank.title, href: "#/quiz/" + leadBank.id,
      size: leadBank.size, pass: 70 } : null;
  const locked = banks.filter(b => !b.n);
  const short = t => { const [a, b] = t.split(" — "); return !b ? t : a + (/^Qualifying/.test(b) ? " qualifier" : /^Concept/.test(b) ? " concepts" : ""); };
  const facTok = c => c ? "--fac-" + ({ "Mathematics": "math", "Computer Science": "sys", "Artificial Intelligence": "ai", "Physics": "phys", "Systems": "sys", "Research": "res", "Speech": "speech" })[c.faculty] : "--accent";
  const W = lead ? watch(lead.c) : null;
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const txt = (n, s) => { const x = n && n.querySelector(s); return x ? x.textContent.trim() : null; };
  const hero = document.querySelector("#view .ex-hero");
  const bar = n => { const t = n && n.querySelector(".ex-bar, .ex-lbar"), i = t && t.querySelector("i");
    return t ? { track: t.getBoundingClientRect().width, fill: i ? i.getBoundingClientRect().width : 0, col: i ? z.bytes(getComputedStyle(i).backgroundColor) : null } : null; };
  const sit = hero && hero.querySelector(".ex-sit"), fill = z.tok("--btn-bg");
  return {
    want: {
      rec: D.DIAGNOSTICS.length + " diagnostics · " + banks.length + " concept banks · " + (diags.filter(x => x.sat).length + banks.filter(b => b.sat).length) + " sat",
      lead: lead && { title: lead.title, href: lead.href, code: lead.c ? lead.c.code : null, gate: lead.kind === "diag" && !gatePassed, facts: [lead.size].concat(lead.pass != null ? ["Pass at " + lead.pass + "%"] : [])
        .concat(W.of ? [W.w + " of " + W.of + (lead.c.tracker ? " problems solved" : " lectures watched")] : []), pct: W.of ? W.w / W.of * 100 : null,
        fac: z.tok(facTok(lead.c)) },
      open: diags.filter(x => x.d.id !== (lead && lead.id)).map(x => "#/diag/" + x.d.id).concat(banks.filter(b => b.n && b.id !== (lead && lead.id)).map(b => "#/quiz/" + b.id)).sort(),
      // Each card's tag and meta, exactly: a diagnostic's minutes and its pass
      // mark if it has one; a bank's sitting size and the 70% pass.
      cards: Object.fromEntries(diags.map(x => ["#/diag/" + x.d.id, (x.c ? x.c.code : "") + " | " + x.d.minutes + " min" + (x.d.gate != null ? " · pass " + x.d.gate + "%" : "")])
        .concat(banks.map(b => ["#/quiz/" + b.id, b.c.code + " | " + b.size + " · pass 70%"]))),
      locked: locked.map(b => ({ name: short(b.title), pct: watch(b.c).of ? watch(b.c).w / watch(b.c).of * 100 : 0 })),
    },
    rec: txt(document, "#view .page-head .ex-rec"),
    hero: hero ? { tag: txt(hero, ".ex-tag"), tagCol: z.bytes(getComputedStyle(hero.querySelector(".ex-tag")).color), title: txt(hero, ".at-gate"),
      facts: [...hero.querySelectorAll(".ex-facts > span")].map(n => n.textContent.trim()), bar: bar(hero), days: txt(hero, ".at-days b"),
      daysLabel: txt(hero, ".at-days span"),
      sit: sit ? { text: sit.textContent.trim(), href: sit.getAttribute("href"), filled: (b => b[3] === 255 && z.same(b, fill, 2))(z.bytes(getComputedStyle(sit).backgroundColor)) } : null } : null,
    open: vis("#view .ex-open .ex-card").map(a => ({ href: a.getAttribute("href"), tag: txt(a, ".ex-tag"), title: txt(a, ".tl-t"), meta: txt(a, ".tl-m"), left: Math.round(a.getBoundingClientRect().left) })),
    lockRows: [...document.querySelectorAll("#view .ex-locked .ex-lock")].map(a => ({ shown: a.checkVisibility(), name: txt(a, ".ex-ln"), lock: !!a.querySelector(".ex-lk svg"),
      bar: bar(a), h: a.getBoundingClientRect().height, left: Math.round(a.getBoundingClientRect().left) })),
    more: (() => { const b = document.querySelector("#view .ex-more"); return b && b.checkVisibility() ? { text: b.textContent.trim(), w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height } : null; })(),
    glist: vis("#view .glist").length,
  };
}
function t26bRecord() {
  const D = window.DAR, T = window.__brickfordTest, z = window.__dz, st = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  const pad = n => String(n).padStart(2, "0"), loc = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = loc(new Date());
  const add = (iso, n) => { const p = iso.split("-").map(Number); return loc(new Date(p[0], p[1] - 1, p[2] + n)); };
  const dow = iso => new Date(iso + "T00:00:00").getDay();
  // The last 26 weeks, Sunday-first, ending with this week.
  const first = add(add(today, -dow(today)), -7 * 25);
  const lessons = Object.values(st.lessons || {}), probs = Object.values(st.problems || {}), sealed = new Set(st.studyDays || []);
  const wantCell = iso => {
    if (iso < D.START_DATE || iso > today) return "void";
    if (dow(iso) === T.REST_DOW) return "rest";
    const lvl = Math.min(4, lessons.filter(l => l && l.doneAt === iso).length + probs.filter(v => v === iso).length + (sealed.has(iso) ? 1 : 0));
    return "l" + lvl;
  };
  const cols = [...document.querySelectorAll("#view .heat .hcol")].map(c => [...c.children].map(n =>
    (n.classList.contains("void") ? "void" : n.classList.contains("rest") ? "rest" : ([...n.classList].find(k => /^l\d$/.test(k)) || "?")) +
    (n.dataset.hday ? "@" + n.dataset.hday : "")));
  const want = [];
  for (let w = 0; w < 26; w++) { const col = []; for (let d = 0; d < 7; d++) { const iso = add(first, 7 * w + d), k = wantCell(iso); col.push(k + (/^l/.test(k) ? "@" + iso : "")); } want.push(col); }
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const fill = z.tok("--btn-bg");
  const heat = document.querySelector("#view .heat");
  return {
    want: { streak: T.streak(), best: T.bestStreak(), proven: lessons.filter(l => l && l.verified).length, cells: want }, restDow: T.REST_DOW,
    tiles: vis("#view .pf-tile").map(t => ({ n: (t.querySelector(".at-days b") || {}).textContent, label: (t.querySelector(".at-days span") || {}).textContent })),
    cols, cellW: heat && heat.querySelector(".hc") ? heat.querySelector(".hc").getBoundingClientRect().width : 0,
    heatOver: heat ? heat.scrollWidth > heat.clientWidth + 1 : null,
    seals: vis("#view .pf-seals .seal:not(.gen)").map(s => ({ name: (s.querySelector("b") || {}).textContent, hash: (s.querySelector(".seal-h") || {}).textContent })),
    gen: vis("#view .pf-seals .seal.gen").map(s => ({ ink: z.bytes(getComputedStyle(s.querySelector("b")).color) })),
    arrows: vis("#view .pf-seals .seal-arrow").map(a => a.textContent),
    order: vis("#view .pf-seals > *").map(n => n.classList.contains("seal-arrow") ? "<-" : n.classList.contains("gen") ? "G" : "S"),
    ledger: (st.ledger || []).map(e => ({ i: e.i, type: e.type, ref: e.ref, hash: e.hash })),
    pills: vis("#view .pf-pills > *").map(p => ({ text: p.textContent.trim(), tag: p.tagName, act: p.dataset.act || null, href: p.getAttribute("href"),
      w: p.getBoundingClientRect().width, h: p.getBoundingClientRect().height, col: z.bytes(getComputedStyle(p).color),
      filled: (b => b[3] === 255 && z.same(b, fill, 2))(z.bytes(getComputedStyle(p).backgroundColor)) })),
    bad: z.tok("--bad"), ink3: z.tok("--ink-3"),
    seen: vis("#view .ghead").map(g => g.firstChild.textContent.trim()),
  };
}

// ---------- T-026c: Week, the Calendar's day view, and Library ----------
// loop/specs/T-026c-week-calendar-library/spec.md. As in T-026b, what each
// page should show is worked out here from the stored state, the data files
// and the study calendar walked in Node (T26_STUDY), never read from the view:
// the plan week (six study days, the Saturday between them inside its dates),
// the counted tiles from storage, the day's schedule through the test hook,
// each course's faculty colour from its faculty in the data (T26_FAC, not the
// app's own map), and the Library's documents from DOCS in app.js on disk.
const T26C_SUB = {
  "/review": "Every Sunday: what shipped, what didn’t. Seal it in two minutes.",
  "/library": "The rules of Brickford, and the guides for each phase.",
};
// On top of the seed (which has one problem on 17 Oct and math110.0.13
// proven on 19 Oct): a second problem this week; today's MATH 120 lecture
// watched (a done block); two sealed weeks, one of them a failed week with a
// note; and lectures proven and payments on BOTH edges of week 3 (Fri 30 Oct
// to Thu 5 Nov since reset seven) and on its rest day — Thu 29 Oct (the last
// day of week 2) and Fri 6 Nov (the first of week 4) must not count; Fri 30
// Oct, Sat 31 Oct and Thu 5 Nov must.
// So "iso < to", "iso > from" and a Saturday left out each change a tile
// (review round 1: with "iso < to" planted, every check had passed). The
// payments that count come to 1,149.5, a number long enough to have run out
// of its tile.
const T26C_PATCH = {
  problems: { "Arrays & Hashing|Valid Anagram": "2026-10-30" },
  lessons: {
    "math110.0.1": { done: true, verified: true, doneAt: "2026-10-29", verifiedAt: "2026-10-29", notes: "", checks: [] },
    "math110.0.2": { done: true, verified: true, doneAt: "2026-11-01", verifiedAt: "2026-11-01", notes: "", checks: [] },
    "math110.0.3": { done: true, verified: true, doneAt: "2026-10-31", verifiedAt: "2026-10-31", notes: "", checks: [] },
    "math110.0.4": { done: true, verified: true, doneAt: "2026-11-05", verifiedAt: "2026-11-05", notes: "", checks: [] },
    "math110.0.5": { done: true, verified: true, doneAt: "2026-11-06", verifiedAt: "2026-11-06", notes: "", checks: [] },
    // T-043: a lecture counts once watched AND its quiz is passed, so the
    // day's one done lecture carries its pass (a quiz pass added, nothing else).
    "math120.1.0": { done: true, doneAt: "2026-11-01", notes: "", checks: [],
      quiz: { passedAt: "2026-11-01", at: "2026-11-01T11:00:00.000Z", firstTry: 2, total: 2, attempts: 2 } },
  },
  treasury: { offer: "", clients: [], niche: "", entries: [
    { date: "2026-10-29", amount: 999, note: "the last day of week 2" },
    { date: "2026-10-30", amount: 1000, note: "pilot" },
    { date: "2026-11-01", amount: 120, note: "a referral" },
    { date: "2026-10-31", amount: 27, note: "the rest day" },
    { date: "2026-11-05", amount: 2.5, note: "the last day of week 3" },
    { date: "2026-11-06", amount: 500, note: "the first day of week 4" },
  ] },
  weeks: [
    { week: 1, date: "2026-10-22", shipped: "flashcards-cli on GitHub and a first post", dsa: 4, posts: 1, revenue: 120, notes: "the router broke twice" },
    { week: 2, date: "2026-10-29", shipped: "", dsa: 6, posts: 0, revenue: 0, notes: "flu, then a client fire" },
  ],
};
// The habits a study day carries, as the page had them before (four, and on
// a Sunday the seal as a fifth), in minutes; Workshop has no fixed time.
const T26C_HABITS = [["Practice", 45, "#/course/cs150"], ["Drill", 10, "#/drill"], ["Publish", 30, "#/review"], ["Workshop", 0, "#/workshop"]];
const T26C_SEAL = ["Seal the week", 30, "#/review"];
const t26cAbout = m => "about " + (m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + String(m % 60).padStart(2, "0") : "") : m + " min");
const t26cUTC = (iso, o) => new Date(iso + "T00:00:00Z").toLocaleString("en-US", Object.assign({ timeZone: "UTC" }, o));
const t26cShort = iso => Number(iso.slice(8)) + " " + t26cUTC(iso, { month: "short" });
const t26cNice = iso => t26cUTC(iso, { weekday: "long" }) + " " + Number(iso.slice(8)) + " " + t26cUTC(iso, { month: "long" });
const t26cDays = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
// The plan week a date belongs to (a rest day: the week just worked), and
// its first and last study day, from the calendar walked here.
function t26cWeekOf(iso) {
  const w = Math.floor(t26Pos(iso) / 6) + 1;
  return { w, from: T26_STUDY[(w - 1) * 6], to: T26_STUDY[w * 6 - 1] };
}
// What the Week page should say, from the stored state alone.
function t26cWeekWant(st, today) {
  const { w, from, to } = t26cWeekOf(today);
  const inWeek = iso => typeof iso === "string" && iso >= from && iso <= to;
  const ledger = (st.treasury || {}).entries || [];
  const earned = Math.round(ledger.filter(e => inWeek(e.date)).reduce((a, e) => a + (+e.amount || 0), 0) * 100) / 100;
  const weeks = (st.weeks || []).slice().sort((a, b) => b.week - a.week);
  const sealed = weeks.find(x => +x.week === w);
  const n = t26cDays(today, to);
  const bhd = v => "BHD " + (Math.round(v * 100) / 100).toLocaleString("en-US");
  return {
    // Spec: BHD "stays editable if the ledger has none" — counted whenever
    // the ledger has any entry, this week or not.
    w, from, to, auto: ledger.length > 0, earned,
    dsa: Object.values(st.problems || {}).filter(Boolean).length,
    proven: Object.values(st.lessons || {}).filter(l => l && l.verified && inWeek(l.verifiedAt)).length,
    bhdText: earned.toLocaleString("en-US", { maximumFractionDigits: 2 }),
    state: sealed ? "Sealed " + t26cShort(sealed.date) : today >= to ? "Ready to seal"
      : "Opens " + t26cUTC(to, { weekday: "long" }) + " " + t26cShort(to) + " · " + n + " day" + (n === 1 ? "" : "s"),
    cards: weeks.map(x => ({ h: "Week " + x.week, date: t26cShort(x.date), s: x.shipped || "nothing shipped", fail: !x.shipped,
      m: "DSA " + (+x.dsa || 0) + " · " + (+x.posts || 0) + " post" + ((+x.posts || 0) === 1 ? "" : "s") + " · " + bhd(+x.revenue || 0),
      notes: x.notes || "No notes." })),
    meta: weeks.length ? weeks.length + " sealed" : "none sealed yet",
    slots: weeks.length ? [] : [0, 1, 2, 3].map(k => "Week " + (w + k)),
  };
}
// The Library's documents, read from DOCS in app.js on disk: every id, in
// order. The Calibration Kit (readme) is in "Start here"; the rest are guides.
const T26C_DOCS = (() => {
  const src = fs.readFileSync(path.join(ROOT, "platform/js/app.js"), "utf8");
  const m = /const DOCS = \[([\s\S]*?)\n  \];/.exec(src);
  return m ? [...m[1].matchAll(/\bid: "([\w-]+)"/g)].map(x => x[1]) : [];
})();

function t26cWeek() {
  const z = window.__dz, fill = z.tok("--btn-bg");
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const txt = (n, s) => { const x = n && n.querySelector(s); return x ? x.textContent.replace(/ /g, " ").trim() : null; };
  const tiles = vis("#view .wk-tiles > *").map(t => {
    const inp = t.querySelector("input"), em = t.querySelector("em"), r = t.getBoundingClientRect();
    return { tag: t.tagName, n: inp ? null : txt(t, ".at-days b"), label: txt(t, ".at-days > span"), em: em ? em.textContent.trim() : null,
      emCol: em ? z.bytes(getComputedStyle(em).color) : null, left: Math.round(r.left), w: r.width, h: r.height,
      input: inp ? { id: inp.id, type: inp.type, value: inp.value, h: inp.getBoundingClientRect().height } : null };
  });
  const hidden = id => { const n = document.querySelector("#view input#" + id); return n ? { type: n.type, value: n.value } : null; };
  return {
    head: { h1: txt(document, "#view .page-head h1"), sub: txt(document, "#view .page-head .sub") },
    tiles, rvDsa: hidden("rvDsa"), rvRev: hidden("rvRev"),
    filled: [...document.querySelectorAll("#view a, #view button")].filter(n => n.checkVisibility() &&
      (b => b[3] === 255 && z.same(b, fill, 2))(z.bytes(getComputedStyle(n).backgroundColor))).map(n => ({ text: n.textContent.trim(), act: n.dataset.act || null })),
    state: txt(document, "#view .wk-foot .wk-state"),
    qs: vis("#view .wk-q").map(c => { const l = c.querySelector("label"), i = c.querySelector("input, textarea");
      return { q: l ? l.textContent.trim() : null, forId: l ? l.htmlFor : null, input: i ? i.id : null, h: i ? i.getBoundingClientRect().height : 0 }; }),
    cards: vis("#view .wk-weeks > *").map(c => ({ tag: c.tagName, slot: c.classList.contains("wk-slot"), h: c.classList.contains("wk-slot") ? txt(c, "span") : txt(c, ".wk-h b"),
      date: txt(c, ".wk-h span"), s: txt(c, ".wk-s"), fail: !!c.querySelector(".wk-s.wk-fail"), m: txt(c, ".wk-m"),
      notes: c.tagName === "DETAILS" && c.open ? txt(c, ".wk-notes") : null, open: !!c.open,
      sh: c.querySelector("summary") ? c.querySelector("summary").getBoundingClientRect().height : 0 })),
    past: (g => g ? { t: g.firstChild.textContent.trim(), meta: txt(g, ".gh-meta") } : null)(vis("#view .ghead").find(g => /^Past weeks/.test(g.textContent))),
    // Each question's placeholder ink over what is behind the field.
    ph: ["rvShipped", "rvNotes"].map(id => { const el = document.querySelector("#view #" + id); if (!el) return { id, ratio: 0 };
      const back = z.backdrop(el), ink = z.over(z.bytes(getComputedStyle(el, "::placeholder").color), back);
      return { id, text: el.placeholder, ratio: z.ratio(ink, back), ink: z.hex(ink), back: z.hex(back) }; }),
    good: z.tok("--good"), ink3: z.tok("--ink-3"),
  };
}
// Every counted or typed Week number inside its tile's content box, and the
// BHD number's size.
function t26cTileFit() {
  const out = [];
  document.querySelectorAll("#view .wk-tiles > *").forEach(t => {
    const r = t.getBoundingClientRect(), cs = getComputedStyle(t);
    const l = r.left + parseFloat(cs.paddingLeft) - 0.5, rt = r.right - parseFloat(cs.paddingRight) + 0.5;
    t.querySelectorAll("b, input, .at-days > span, em").forEach(el => {
      if (!el.checkVisibility()) return;
      const a = el.getBoundingClientRect();
      if (a.left < l || a.right > rt || el.scrollWidth > el.clientWidth + 1)
        out.push(el.tagName.toLowerCase() + " \"" + (el.value || el.textContent).trim().slice(0, 16) + "\" " + a.left.toFixed(0) + "-" + a.right.toFixed(0) + " in " + l.toFixed(0) + "-" + rt.toFixed(0));
    });
  });
  const b = document.querySelector("#view .wk-tiles > :nth-child(4) b");
  return { out, bhd: b ? b.textContent : null, size: b ? parseFloat(getComputedStyle(b).fontSize) : 0 };
}
// The selected day, measured; and what it should be, from the schedule (the
// test hook) and the data — the faculty colour by the course's faculty
// through `fac` (the harness's own map), the lecture's place counted through
// the course's units.
function t26cDay([iso, fac]) {
  const D = window.DAR, T = window.__brickfordTest, z = window.__dz;
  const st = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}"), lessons = st.lessons || {};
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const txt = (n, s) => { const x = n && n.querySelector(s); return x ? x.textContent.trim() : null; };
  const col = (n, p) => n ? z.bytes(getComputedStyle(n)[p || "color"]) : null;
  // T-043 (review r1): a locked lecture's block links to the first quiz in
  // its chain of locks. Walked here from storage and the summaries' checks:
  // a lecture not yet watched is locked while the one before it has a quiz
  // that is not passed and was not watched before QUIZ_GATE_FROM; the chain
  // runs back through lectures that are themselves locked.
  const gate = T.QUIZ_GATE_FROM, sums = D.SUMMARIES || {};
  // Only a lecture planned on or after the gate blocks (owner, 2026-10-15:
  // "lock from go-live only"); the plan date is the app's planDateOf.
  const blocksNext = k => { const s0 = lessons[k] || {}; return (T.planDateOf(k) || "9999") >= gate && !!((sums[k] || {}).checks || []).length && !(s0.quiz && s0.quiz.passedAt) &&
    !(s0.done && [s0.doneAt, s0.firstDoneAt].filter(Boolean).sort()[0] < gate); };
  const rootOf = it => {
    const flat = []; D.COURSES.find(x => x.id === it.cid).units.forEach((u, ui) => u.lessons.forEach((_, li) => flat.push(it.cid + "." + ui + "." + li)));
    let i = flat.indexOf(it.cid + "." + it.ui + "." + it.li), root = null;
    while (i > 0 && !(lessons[flat[i]] || {}).done && blocksNext(flat[i - 1])) { root = flat[i - 1]; i--; }
    return root ? "#/lesson/" + root.split(".").join("/") : null;
  };
  const want = T.scheduledFor(iso).map(it => {
    if (it.pseudo) return { pseudo: true, href: it.href };
    const c = D.COURSES.find(x => x.id === it.cid);
    let n = it.li + 1;
    for (let u = 0; u < it.ui; u++) n += c.units[u].lessons.length;
    const dnK = (st0 => !!st0.done && (!!(st0.quiz && st0.quiz.passedAt) || !(((D.SUMMARIES || {})[it.cid + "." + it.ui + "." + it.li] || {}).checks || []).length ||
        (!!st0.doneAt && st0.doneAt < T.QUIZ_GATE_FROM)))(lessons[it.cid + "." + it.ui + "." + it.li] || {});
    return { href: (!dnK && rootOf(it)) || "#/lesson/" + it.cid + "/" + it.ui + "/" + it.li, k: c.code + " · " + it.track, t: it.l.t,
      r: [it.l.min ? it.l.min + " min" : it.l.paper ? "paper" : "reading", it.spanN > 1 ? "part " + it.dayN + " of " + it.spanN : "lecture " + n],
      // T-043: done is watched AND cleared — its quiz passed, no quiz at all
      // (the summary's checks, data), or watched before QUIZ_GATE_FROM.
      done: (st0 => !!st0.done && (!!(st0.quiz && st0.quiz.passedAt) || !(((D.SUMMARIES || {})[it.cid + "." + it.ui + "." + it.li] || {}).checks || []).length ||
        (!!st0.doneAt && st0.doneAt < T.QUIZ_GATE_FROM)))(lessons[it.cid + "." + it.ui + "." + it.li] || {}),
      fac: z.tok(fac[c.faculty] || "--accent"), faculty: c.faculty };
  });
  const blocks = vis("#view .cd-blk").map(b => {
    const k = b.querySelector(".cd-k"), t = b.querySelector(".cd-t"), bar = b.querySelector(".cd-bar");
    return { href: b.getAttribute("href"), pseudo: b.classList.contains("cd-pseudo"), done: b.classList.contains("done"),
      k: k ? k.textContent.trim() : null, upper: k ? getComputedStyle(k).textTransform : null, kCol: col(k),
      t: t ? [...t.childNodes].filter(x => !(x.classList && x.classList.contains("cd-ok"))).map(x => x.textContent).join("").trim() : null,
      tCol: col(t), ok: !!b.querySelector(".cd-ok"), bar: bar ? { col: col(bar, "backgroundColor"), w: bar.getBoundingClientRect().width } : null,
      r: [...b.querySelectorAll(".cd-r > span")].map(s => s.textContent.trim()), h: b.getBoundingClientRect().height };
  });
  const prog = document.querySelector("#view .cd-prog");
  const head = vis("#view .ghead").find(g => /^Every study day/.test(g.textContent));
  const order = [...document.querySelectorAll("#view .view-enter > *")].map(n => n.matches(".card") && n.querySelector(".cal-grid") ? "grid"
    : n.matches(".cd-day") ? "day" : n.matches("details.unit") ? "ics" : null).filter(Boolean);
  return {
    want, blocks, order,
    h2: txt(document, "#view .cd-head h2"), sub: txt(document, "#view .cd-head .cd-sub"),
    seg: vis("#view .cd-seg button").map(b => ({ label: b.getAttribute("aria-label") || b.textContent.trim(), w: b.getBoundingClientRect().width,
      h: b.getBoundingClientRect().height, pressed: b.getAttribute("aria-pressed"), disabled: b.disabled })),
    prog: prog && prog.checkVisibility() ? { track: prog.getBoundingClientRect().width, fill: prog.querySelector("i") ? prog.querySelector("i").getBoundingClientRect().width : 0 } : null,
    habits: vis("#view .cd-habits > *").map(a => ({ tag: a.tagName, t: txt(a, ".tl-t"), m: txt(a, ".tl-m"), href: a.getAttribute("href"),
      left: Math.round(a.getBoundingClientRect().left), w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height })),
    about: head ? txt(head, ".gh-meta") : null,
    glist: vis("#view .glist").length, groupHeads: vis("#view .ghead").map(g => g.firstChild.textContent.trim()),
    sel: (document.querySelector("#view .cal-cell.sel") || { dataset: {} }).dataset.calDay || null,
    ink2: z.tok("--ink-2"), ink3: z.tok("--ink-3"),
  };
}
function t26cLib() {
  const z = window.__dz;
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const txt = (n, s) => { const x = n && n.querySelector(s); return x ? x.textContent.trim() : null; };
  const before = n => { const g = n && n.previousElementSibling; return g && g.matches(".ghead") ? { t: g.firstChild.textContent.trim(), meta: txt(g, ".gh-meta") } : null; };
  const card = a => { const bs = getComputedStyle(a).boxShadow, c = /rgba?\([^)]*\)/.exec(bs), r = a.getBoundingClientRect(), d = a.querySelector(".pb-d");
    return { href: a.getAttribute("href"), t: txt(a, ".pb-t"), m: txt(a, ".pb-d"), mCol: d ? z.bytes(getComputedStyle(d).color) : null,
      glyph: !!a.querySelector(".pb-glyph svg"), edge: /inset/.test(bs) && c ? z.bytes(c[0]) : null, left: Math.round(r.left), w: r.width, h: r.height }; };
  const links = document.querySelector("#view .lb-links"), more = links && links.querySelector("button");
  return {
    head: { h1: txt(document, "#view .page-head h1"), sub: txt(document, "#view .page-head .sub") },
    groups: vis("#view .lb-docs").map(g => ({ head: before(g), cards: [...g.children].filter(a => a.checkVisibility()).map(card) })),
    linksHead: before(links),
    links: links ? [...links.querySelectorAll("a")].map(a => ({ text: a.textContent.trim(), href: a.getAttribute("href"), target: a.getAttribute("target"),
      rel: a.getAttribute("rel"), shown: a.checkVisibility(), w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height })) : [],
    more: more && more.checkVisibility() ? { text: more.textContent.trim(), w: more.getBoundingClientRect().width, h: more.getBoundingClientRect().height } : null,
    focus: document.activeElement && document.activeElement.closest(".lb-links") ? document.activeElement.textContent.trim() : null,
    accent: z.tok("--accent"), ink2: z.tok("--ink-2"), ink3: z.tok("--ink-3"),
  };
}

// ---- T-028: Practice, as it is on screen ----
// The header, the three tabs, the record button and what is painted round it.
// The red is read off the disc and the card behind it is read the way
// verify-contrast reads a backdrop; #ff453a (the spec's default red) is
// measured against the same card, so the spec's rule — #ff453a, or the
// theme's --bad if that has better contrast — is checked, not assumed.
function t28Practice() {
  const z = window.__dz, q = s => document.querySelector(s);
  const txt = n => (n ? n.textContent.trim() : null);
  const box = n => { const r = n.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, b: r.bottom }; };
  const btn = q("#view .pr-rec"), card = btn && btn.closest(".pr-card"), dot = btn && btn.querySelector(".pr-dot");
  const cardBg = card ? z.backdrop(card) : null;
  const red = dot ? z.bytes(getComputedStyle(dot).backgroundColor) : null, ring = btn ? z.bytes(getComputedStyle(btn).borderTopColor) : null;
  const SYS = [255, 69, 58, 255];
  const list = q("#view #prClips"), lh = list && list.previousElementSibling;
  const rest = [...document.querySelectorAll("#view .card.one")].find(c => /Nothing owed today/.test(c.textContent));
  const rev = [...document.querySelectorAll("#view .card.one")].find(c => /Monthly review/.test(c.textContent));
  const seg = q("#view .pr-seg");
  return {
    head: { h1: txt(q("#view .page-head h1")), sub: txt(q("#view .page-head .sub")), week: txt(q("#view .pr-week-t")),
      dots: document.querySelectorAll("#view .pr-week .wd").length, on: document.querySelectorAll("#view .pr-week .wd.on").length },
    seg: [...document.querySelectorAll("#view .pr-seg button")].map(b => Object.assign({ t: txt(b), on: b.getAttribute("aria-pressed") === "true" }, box(b))),
    rec: btn ? Object.assign(box(btn), {
      tag: btn.tagName, type: btn.getAttribute("type"), label: btn.getAttribute("aria-label") || "", tab: btn.tabIndex, card: box(card),
      red: z.hex(red), bad: z.hex(z.tok("--bad")), ink: z.hex(z.tok("--ink")), ring: z.hex(ring), ringW: parseFloat(getComputedStyle(btn).borderTopWidth),
      cardBg: z.hex(cardBg), redRatio: z.ratio(red, cardBg), sysRatio: z.ratio(SYS, cardBg), ringRatio: z.ratio(ring, cardBg),
      round: dot ? parseFloat(getComputedStyle(dot).borderTopLeftRadius) >= dot.getBoundingClientRect().width / 2 - 0.5 : false }) : null,
    time: txt(q("#view .pr-time")),
    prompt: txt(q("#view .pr-card .pr-prompt")), hint: txt(q("#view .pr-card .pr-hint")),
    listHead: lh && lh.matches(".ghead") ? { t: lh.firstChild.textContent.trim(), meta: txt(lh.querySelector(".gh-meta")) } : null,
    rest: rest ? box(rest) : null, review: rev ? Object.assign(box(rev), { form: !!rev.querySelector("#revNotes"), go: txt(rev.querySelector("[data-act=repReview]")) }) : null,
    segTop: seg ? seg.getBoundingClientRect().top : null,
    focus: document.activeElement ? (document.activeElement.matches(".pr-rec") ? "record" : document.activeElement.tagName) : null,
  };
}
// T-028 review 1: the hand forms fill their card. Each field's box against
// the card's content box (its width less its padding): a dead align-items
// rule once left them at their intrinsic ~220px.
function t28Fill(ids) {
  const card = document.querySelector("#view .pr-pane .pr-card");
  if (!card) return null;
  const r = card.getBoundingClientRect(), cs = getComputedStyle(card);
  const left = r.left + parseFloat(cs.paddingLeft), right = r.right - parseFloat(cs.paddingRight);
  return { content: +(right - left).toFixed(1), fields: ids.map(id => { const e = document.getElementById(id); if (!e) return { id, missing: true };
    const b = e.getBoundingClientRect(); return { id, l: +(b.left - left).toFixed(1), r: +(right - b.right).toFixed(1), w: +b.width.toFixed(1) }; }) };
}
// T-028 review 1: the clip rows at phone widths. Every title field shows its
// whole title (scrollWidth within clientWidth), its controls are 44x44, and
// download/delete do not sit on top of the title.
function t28Rows() {
  return [...document.querySelectorAll("#view .pr-clip")].map(row => {
    const n = row.querySelector(".pr-name"), m = row.querySelector(".pr-main").getBoundingClientRect();
    const ics = [...row.querySelectorAll(".pr-ic")].map(c => c.getBoundingClientRect());
    const ctl = [...row.querySelectorAll(".pr-play, .pr-ic")].map(c => c.getBoundingClientRect());
    return { title: n.value, scroll: n.scrollWidth, client: n.clientWidth,
      apart: ics.length > 0 && ics.every(a => a.top >= m.bottom - 1 || a.left >= m.right - 1), small: ctl.filter(c => c.width < 44 || c.height < 44).length, ctl: ctl.length };
  });
}
// The clips for t28Rows, written straight into IndexedDB as the recorder
// stores them: default titles, the widest weekday and month this app prints.
function t28SeedClips(list) {
  return new Promise((res, rej) => {
    const q = indexedDB.open("brickford_audio", 1);
    q.onupgradeneeded = () => { if (!q.result.objectStoreNames.contains("clips")) q.result.createObjectStore("clips"); };
    q.onerror = () => rej(q.error);
    q.onsuccess = () => {
      const db = q.result, t = db.transaction("clips", "readwrite");
      list.forEach(c => t.objectStore("clips").put({ date: c.date, seconds: c.seconds, kind: c.kind, title: c.title, blob: new Blob([new Uint8Array(64)], { type: "audio/webm" }) }, c.key));
      t.oncomplete = () => { db.close(); res(list.length); };
      t.onerror = () => rej(t.error);
    };
  });
}

(async () => {
  console.log("status bar (read from platform/css/style.css)");
  safeAreaSource();
  console.log("\nhairlines (read from platform/css/style.css)");
  hairlineSource();

  const browser = await chromium.launch();

  // ---- the foundations, on real elements ----
  for (const { w, h, mobile, large } of WIDTHS) {
    for (const theme of THEMES) {
      const at = w + "px " + theme;
      console.log("\n" + at);
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme);
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      let tokensChecked = false;
      // T-024: the primary action, gathered over the routes (a .btn.lg is on
      // some routes and not others), then judged once per context.
      const prim = { filled: 0, lg: 0, bad: [], lgBad: [], toast: null, cards: 0, cardBad: [], pills: 0, pillBad: [] };
      for (const route of ROUTES) {
        await go(page, route);
        const m = await page.evaluate(probe, NAMES);
        const where = at + " " + route;
        check(where + ": no element is set in Caslon", m.caslon.length === 0,
          m.caslon.length ? m.caslon.slice(0, 4).join(", ") : "");
        if (m.h1 || TITLE_ROUTES.has(route)) {
          const em = m.h1 ? m.h1.ls / m.h1.size : NaN;
          check(where + ": the page h1 is the large title (" + large + "px, 700, -0.022em)",
            !!m.h1 && m.h1.size === large && m.h1.weight === "700" && Math.abs(em - -0.022) <= 0.002,
            m.h1 ? m.h1.size + "px, weight " + m.h1.weight + ", " + em.toFixed(4) + "em, \"" + m.h1.text + "\"" : "no visible title h1 in the view");
        }
        // T-005's corner check, with T-024's shapes (the owner's decision of
        // 2026-10-06): a filled .btn is a 999px capsule; the outlined kinds —
        // ghost, danger and bare — keep 12px. Same check, new expected values.
        const shapeOff = m.kinds.filter(k => k.corners.some(r => r !== (k.filled ? "999px" : "12px")));
        check(where + ": every visible filled .btn is a 999px capsule and every ghost, danger or bare one has 12px corners",
          m.btns > 0 && shapeOff.length === 0,
          m.btns === 0 ? "no visible .btn on this route" : shapeOff.length ? shapeOff.length + " of " + m.btns + ", e.g. " +
            shapeOff[0].name + " \"" + shapeOff[0].text + "\" (" + (shapeOff[0].filled ? "filled" : "outlined") + ") " + shapeOff[0].corners.join(" ")
            : m.btns + " buttons (" + m.kinds.filter(k => k.filled).length + " filled)");
        // T-024: every filled, enabled .btn is the gold-or-light fill with the
        // --accent-fill-ink label, at 4.5:1 or better.
        const z2 = { ratio: (a, b) => { const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          const L = p => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]); const x = L(a), y = L(b);
          return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); } };
        const hx = p => "#" + p.slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("");
        for (const k of m.kinds.filter(k => k.filled && !k.disabled)) {
          prim.filled++;
          if (k.lg) prim.lg++;
          const r = z2.ratio(k.color, k.bg);
          const ok = k.bg[3] === 255 && __same(k.bg, m.fillTok.bg) && __same(k.color, m.fillTok.ink) && r >= 4.5 &&
            __same(k.bg, hexBytes(PRIMARY[theme].bg)) && __same(k.color, hexBytes(PRIMARY[theme].ink)) && k.corners.every(c => c === "999px");
          if (!ok) (k.lg ? prim.lgBad : prim.bad).push(route + " " + k.name + " \"" + k.text + "\" " + hx(k.color) + " on " + hx(k.bg) +
            "/" + k.bg[3] + " " + r.toFixed(2) + ":1 " + k.corners[0]);
        }
        prim.toast = m.toast;
        prim.fillTok = m.fillTok;
        prim.cards += m.cards.length;
        m.cards.filter(c => c.corners.some(r => r !== "20px")).forEach(c => prim.cardBad.push(route + " " + c.name + " " + c.corners.join(" ")));
        prim.pills += m.pills.length;
        m.pills.filter(c => c.corners.some(r => r !== "999px")).forEach(c => prim.pillBad.push(route + " " + c.name + " \"" + c.text + "\" " + c.corners.join(" ")));
        check(where + ": meta theme-color is this theme's --panel (" + PANEL[theme] + ")", m.meta === PANEL[theme], "meta " + m.meta);
        check(where + ": no control carries a key-cap gloss, lift or well", m.deep.length === 0,
          m.deep.slice(0, 2).join(" | "));
        if (!tokensChecked) {
          tokensChecked = true;
          const want = BRIEF[theme];
          const bad = Object.keys(want).filter(k => m.tokens[k] !== rgb(want[k]));
          check(at + ": the theme tokens resolve to the brief's values", m.theme === theme && bad.length === 0,
            "data-theme " + m.theme + (bad.length ? "; " + bad.map(k => k + " " + m.tokens[k] + " (want " + want[k] + ")").join(", ") : "; " + Object.keys(want).length + " tokens"));
          const rbad = Object.keys(RADII).filter(k => m.radii[k] !== RADII[k]);
          check(at + ": the radius scale is 8/12/16/22, cards 20 (--r-card)", rbad.length === 0, rbad.map(k => k + " " + m.radii[k]).join(", "));
          check(at + ": body is the system face at 17px", m.body.size === "17px" && /^-apple-system\b/.test(m.body.family),
            m.body.size + " " + m.body.family);
          check(at + ": --font-rounded asks for ui-rounded first", /^ui-rounded\b/.test(m.rounded), m.rounded);
        }
      }
      // ---- T-024: the primary action, the toast, cards and chips ----
      const want = PRIMARY[theme];
      check(at + ": the primary action — every filled .btn and at least one .btn.lg is a 999px capsule, " + want.what +
        ", label --accent-fill-ink, >= 4.5:1",
        prim.lg > 0 && prim.lgBad.length === 0 && prim.bad.length === 0,
        (prim.lg === 0 ? "no .btn.lg on " + ROUTES.join(" ") + "; " : "") + (prim.lgBad.length + prim.bad.length
          ? prim.lgBad.concat(prim.bad).slice(0, 3).join("; ") : prim.filled + " filled buttons (" + prim.lg + " .btn.lg)"));
      const tr = prim.toast;
      check(at + ": the toast is the same pair (--btn-bg under an --accent-fill-ink label)",
        !!tr && __same(tr.bg, prim.fillTok.bg) && __same(tr.color, prim.fillTok.ink) && __same(tr.color, hexBytes(want.ink)),
        tr ? "toast " + tr.color.slice(0, 3).join(",") + " on " + tr.bg.slice(0, 3).join(",") : "no toast");
      check(at + ": every visible card (bar the hero's ruled .one) has 20px corners", prim.cards > 0 && prim.cardBad.length === 0,
        prim.cardBad.length ? prim.cardBad.slice(0, 3).join("; ") : prim.cards + " cards");
      check(at + ": every visible chip (.pill) is a capsule (999px)", prim.pills > 0 && prim.pillBad.length === 0,
        prim.pillBad.length ? prim.pillBad.slice(0, 3).join("; ") : prim.pills + " chips");
      check(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- empty tracks: fills that have to be seen against the page ----
  for (const theme of THEMES) {
    const at = "390px " + theme;
    console.log("\nempty tracks, " + at);
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: theme }, theme);
    await page.goto(URL + "/__boot", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    // The seed has a few sealed days and the pinned clock is two weeks past
    // the start, so /record draws its heatmap with empty (l0) days in it.
    await go(page, "/record");
    const day = await page.evaluate(trackContrast, ".heat .hc.l0");
    const swatch = await page.evaluate(trackContrast, ".cal-legend .hc.l0");
    check(at + " /record: an empty heatmap day and the Quiet swatch stand off their backdrop (>= " + MIN_TRACK + ":1)",
      trackOk(day) && trackOk(swatch), "day " + trackText(day) + "; swatch " + trackText(swatch));
    // A fresh quiz is on question 1: that segment is "now" and every later
    // one is unanswered.
    await go(page, "/quiz/linear-algebra");
    const seg = await page.evaluate(trackContrast, ".q-progress i:not(.done):not(.now)");
    check(at + " /quiz/linear-algebra: an unanswered question segment stands off its backdrop (>= " + MIN_TRACK + ":1)",
      trackOk(seg), trackText(seg));
    // A Saturday in the month grid. Its cell sits in .cal-grid, whose --line
    // fill shows through the 1px gaps as the rules, so the backdrop is that
    // grid; and it must also read apart from a plain day cell beside it, or
    // three years of rest days look like days with nothing on them.
    await go(page, "/calendar");
    const rest = await page.evaluate(trackContrast,
      // Only a real Saturday: days before START_DATE also carry .rest, but their
      // label has no "· rest" status. After reset six the first .rest cell in
      // October became Thu 1 Oct (pre-start) and the check stopped measuring a
      // Saturday at all, so the selector names the status, not the position.
      [".cal-grid .cal-cell.rest[aria-label$='· rest']", ".cal-grid .cal-cell[data-cal-day]:not(.rest):not(.sel):not(.today):not(.blank)"]);
    check(at + " /calendar: a rest day stands off its backdrop and reads apart from a plain day (>= " + MIN_TRACK + ":1)",
      trackOk(rest), trackText(rest));
    check(at + " empty tracks: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- Auto follows the phone ----
  console.log("\nAuto theme");
  for (const scheme of ["dark", "light"]) {
    const other = scheme === "dark" ? "light" : "dark";
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: scheme }, "auto");
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const read = () => page.evaluate(() => {
      const el = document.createElement("div"); document.body.appendChild(el);
      el.style.color = "var(--bg)"; const bg = getComputedStyle(el).color; el.remove();
      const picks = [...document.querySelectorAll("#themeMenu [data-theme-pick]")];
      return {
        theme: document.documentElement.dataset.theme, bg,
        meta: (document.querySelector('meta[name="theme-color"]') || {}).content || "",
        first: picks[0] ? { pick: picks[0].dataset.themePick, label: picks[0].textContent.trim(), on: picks[0].classList.contains("on") } : null,
        stored: (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).theme,
        writes: window.__stateWrites,
      };
    });
    const a = await read();
    check("auto, phone " + scheme + ": resolves to " + scheme + ", --bg " + BRIEF[scheme]["--bg"],
      a.theme === scheme && a.bg === rgb(BRIEF[scheme]["--bg"]), "data-theme " + a.theme + ", --bg " + a.bg);
    check("auto, phone " + scheme + ": the status-bar colour follows (" + PANEL[scheme] + ")", a.meta === PANEL[scheme], "meta theme-color " + a.meta);
    check("auto, phone " + scheme + ": \"Auto\" is listed first and marked as the pick",
      !!a.first && a.first.pick === "auto" && a.first.label === "Auto" && a.first.on,
      a.first ? a.first.pick + " \"" + a.first.label + "\" on=" + a.first.on : "no theme picks");
    // Live: the phone flips while the app is open. The listener may re-apply
    // the theme; it may not save (arming a push) or repaint the view.
    await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-design-kept", "1"); });
    await page.emulateMedia({ colorScheme: other });
    await page.waitForFunction(t => document.documentElement.dataset.theme === t, other, { timeout: 3000 }).catch(() => {});
    const b = await read();
    const kept = await page.evaluate(() => !!document.querySelector("#view [data-design-kept]"));
    check("auto, phone flips to " + other + " while open: follows live, --bg " + BRIEF[other]["--bg"],
      b.theme === other && b.bg === rgb(BRIEF[other]["--bg"]) && b.meta === PANEL[other],
      "data-theme " + b.theme + ", --bg " + b.bg + ", meta " + b.meta);
    check("auto, phone flips to " + other + ": a read — no save, no repaint, still stored as \"auto\"",
      b.writes === a.writes && kept && b.stored === "auto",
      "state writes " + a.writes + " -> " + b.writes + ", view kept " + kept + ", stored " + JSON.stringify(b.stored));
    check("auto, phone " + scheme + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  {
    // Picking it: the stored setting is the string "auto".
    const { ctx, page, errors } = await fresh(browser, { viewport: { width: 1280, height: 800 }, colorScheme: "dark" }, null);
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await page.click("#themeBtn");
    await page.click("#themeMenu [data-theme-pick='auto']");
    const r = await page.evaluate(() => {
      const el = document.createElement("div"); document.body.appendChild(el);
      el.style.color = "var(--bg)"; const bg = getComputedStyle(el).color; el.remove();
      return { theme: document.documentElement.dataset.theme, bg,
               stored: (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).theme };
    });
    check("auto, picked from the menu on a dark phone: stored as \"auto\", shows dark",
      r.stored === "auto" && r.theme === "dark" && r.bg === rgb(BRIEF.dark["--bg"]),
      "stored " + JSON.stringify(r.stored) + ", data-theme " + r.theme + ", --bg " + r.bg);
    // What a device from before Auto does with the synced string: it writes it
    // straight into data-theme, which no theme block matches, so the light
    // :root values apply. (index.html's html element starts as "light".)
    const old = await page.evaluate(() => {
      document.documentElement.dataset.theme = "auto";
      const el = document.createElement("div"); document.body.appendChild(el);
      el.style.color = "var(--bg)"; const bg = getComputedStyle(el).color; el.remove();
      return bg;
    });
    check("an older device reading \"auto\" falls back to light", old === rgb(BRIEF.light["--bg"]), "--bg " + old);
    check("auto, picked from the menu: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- T-024: the default is dark (T-025: the restored dark, not navy) ----
  // On a LIGHT phone, so a dark page is the default speaking and not the
  // phone. Twice: with nothing stored at all, and with progress stored but
  // no theme in it (the shape a device has once anything is saved).
  console.log("\nT-024: the default theme");
  const readTheme = () => ({
    theme: document.documentElement.dataset.theme,
    bg: (() => { const el = document.createElement("div"); document.body.appendChild(el);
                 el.style.color = "var(--bg)"; const v = getComputedStyle(el).color; el.remove(); return v; })(),
    meta: (document.querySelector('meta[name="theme-color"]') || {}).content || "",
    picks: [...document.querySelectorAll("#themeMenu [data-theme-pick]")].map(b => ({ pick: b.dataset.themePick, label: b.textContent.trim(), on: b.classList.contains("on") })),
    stored: (() => { const raw = localStorage.getItem("darhikmah_v1"); if (!raw) return { raw: false };
                     const st = JSON.parse(raw); return { raw: true, has: !!st.settings && "theme" in st.settings, theme: (st.settings || {}).theme,
                       mark: (st.settings || {}).themeNavyOnce }; })(),
    writes: window.__stateWrites,
  });
  // A real save, through the UI: open today's lecture from the dashboard and
  // mark it watched (verify-flows' flow c). The state writes are counted
  // (countWrites) so the storage checks below are asked of a device that has
  // provably written its state — a fixture that never saves cannot tell an
  // unset theme from one save() would have written.
  const reallySave = async page => {
    await page.click(".card.one.lead a.one-go");
    await page.waitForSelector("#view [data-act=toggleDone]");
    const before = await page.evaluate(() => window.__stateWrites);
    await page.click("#view [data-act=toggleDone]");
    await page.waitForFunction(() => /^Unmark watched/.test((document.querySelector("#view [data-act=toggleDone]") || {}).textContent || ""),
      null, { timeout: 5000 }).catch(() => {});
    const after = await page.evaluate(() => window.__stateWrites);
    return { before, after };
  };
  for (const [label, seedTheme] of [["nothing stored", undefined], ["progress stored, no theme", null]]) {
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "light" }, seedTheme);
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const w0 = await reallySave(page);
    const r = await page.evaluate(readTheme);
    check("default (" + label + ", phone light): resolves to data-theme=\"dark\", the dark --bg " + BRIEF.dark["--bg"],
      r.theme === "dark" && r.bg === rgb(BRIEF.dark["--bg"]), "data-theme " + r.theme + ", --bg " + r.bg);
    check("default (" + label + "): meta theme-color " + PANEL.dark, r.meta === PANEL.dark, "meta " + r.meta);
    // T-025: the menu is exactly three options, Auto · Dark · Light, in that
    // order, and the default marks Dark.
    const menuIs = r.picks.map(p => p.pick + ":" + p.label).join(" ");
    check("default (" + label + "): the Theme menu is exactly Auto, Dark, Light, in that order, and marks Dark",
      menuIs === "auto:Auto dark:Dark light:Light" && r.picks[1].on && r.picks.filter(p => p.on).length === 1,
      r.picks.map(p => p.pick + ":" + p.label + (p.on ? "*" : "")).join(" "));
    check("default (" + label + "): marking a lecture watched really saved (state writes went up, the state is stored)",
      w0.after > w0.before && r.stored.raw === true, "state writes " + w0.before + " -> " + w0.after + ", stored " + JSON.stringify(r.stored));
    check("default (" + label + "): and the saved state carries no theme key (unset stays unset)",
      r.stored.raw === true && r.stored.has === false, JSON.stringify(r.stored));
    check("default (" + label + "): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // ---- T-024 round 3: the navy switch (owner decision 2026-10-06) ----
  // A stored "light" without the per-device marker themeNavyOnce is the old
  // default (pre-T-024 every device wrote "light" on its first save): it
  // switches to navy once. With the marker, or any other theme, nothing moves.
  console.log("\nT-024: the navy switch");
  const pickTheme = async (page, t) => {
    await page.click("#themeBtn");
    await page.click("#themeMenu [data-theme-pick='" + t + "']");
  };
  await acrossReload({ label: "switch (c)", check, fail: why => check(why, false), session: true }, async (check, reload) => {
    // (a) "light", no marker, on a LIGHT phone (so navy is the switch, not the
    // phone); desktop, where the Theme menu is on screen for (c).
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 1280, height: 800 }, colorScheme: "light" }, undefined, bareSettings({ theme: "light" }, true));
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await frames(page);
    const a = await page.evaluate(readTheme);
    check("switch (a) stored \"light\", no marker: opens dark (--bg " + BRIEF.dark["--bg"] + ", meta " + PANEL.dark + "), Dark marked",
      a.theme === "dark" && a.bg === rgb(BRIEF.dark["--bg"]) && a.meta === PANEL.dark &&
        a.picks.some(p => p.pick === "dark" && p.on) && a.picks.filter(p => p.on).length === 1,
      "data-theme " + a.theme + ", --bg " + a.bg + ", meta " + a.meta + ", " + a.picks.filter(p => p.on).map(p => p.label).join(","));
    check("switch (a): opening the app writes nothing (no save at boot, so no push is armed)",
      a.writes === 0 && a.stored.theme === "light" && a.stored.mark === undefined,
      "state writes " + a.writes + ", stored " + JSON.stringify(a.stored));
    const w0 = await reallySave(page);
    const a2 = await page.evaluate(readTheme);
    check("switch (a): after a real save the stored state has no theme key and themeNavyOnce true, still dark",
      w0.after > w0.before && a2.stored.raw && a2.stored.has === false && a2.stored.mark === true && a2.theme === "dark",
      "state writes " + w0.before + " -> " + w0.after + ", stored " + JSON.stringify(a2.stored) + ", data-theme " + a2.theme);
    // (c) the explicit pick: Light from the menu, then a reload.
    await pickTheme(page, "light");
    await reload(page, { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await frames(page);
    const c = await page.evaluate(readTheme);
    check("switch (c): Light picked from the menu after the switch survives a reload (light, stored \"light\" + marker)",
      c.theme === "light" && c.bg === rgb(BRIEF.light["--bg"]) && c.meta === PANEL.light && c.stored.theme === "light" && c.stored.mark === true &&
        c.picks.some(p => p.pick === "light" && p.on),
      "data-theme " + c.theme + ", --bg " + c.bg + ", meta " + c.meta + ", stored " + JSON.stringify(c.stored));
    check("switch (a)/(c): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  });
  await acrossReload({ label: "switch (c2)", check, fail: why => check(why, false) }, async (check, reload) => {
    // (c2) a device with nothing stored picks Light, then reloads: the pick
    // carries the marker, so it is not mistaken for the old default.
    const { ctx, page, errors } = await fresh(browser, { viewport: { width: 1280, height: 800 }, colorScheme: "dark" }, undefined);
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await pickTheme(page, "light");
    await reload(page, { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await frames(page);
    const r = await page.evaluate(readTheme);
    check("switch (c2): nothing stored, Light picked, reload: stays light (stored \"light\" + marker)",
      r.theme === "light" && r.bg === rgb(BRIEF.light["--bg"]) && r.stored.theme === "light" && r.stored.mark === true,
      "data-theme " + r.theme + ", --bg " + r.bg + ", stored " + JSON.stringify(r.stored));
    check("switch (c2): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  });
  {
    // (b) "light" WITH the marker on a DARK phone: a pick, kept.
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "dark" }, "light");
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const w0 = await reallySave(page);
    const r = await page.evaluate(readTheme);
    check("switch (b) stored \"light\" + marker on a dark phone: stays light (--bg " + BRIEF.light["--bg"] + ", meta " + PANEL.light + ")",
      r.theme === "light" && r.bg === rgb(BRIEF.light["--bg"]) && r.meta === PANEL.light,
      "data-theme " + r.theme + ", --bg " + r.bg + ", meta " + r.meta);
    check("switch (b): after a real save, still stored as \"light\" with the marker, Light marked",
      w0.after > w0.before && r.stored.theme === "light" && r.stored.mark === true && r.picks.some(p => p.pick === "light" && p.on),
      "state writes " + w0.before + " -> " + w0.after + ", stored " + JSON.stringify(r.stored));
    check("switch (b): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // (d) other stored themes, with no marker, are not touched. T-025: a removed
  // theme ("parchment") is not a theme any more, so it renders dark with Dark
  // marked — and it is still stored "parchment" after a save: never rewritten.
  for (const [t, scheme, want, mark] of [["parchment", "light", "dark", "dark"], ["auto", "dark", "dark", "auto"], ["auto", "light", "light", "auto"]]) {
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: scheme }, undefined, bareSettings({ theme: t }));
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const w0 = await reallySave(page);
    const r = await page.evaluate(readTheme);
    check("switch (d) stored \"" + t + "\", no marker, phone " + scheme + ": data-theme " + want + ", " + mark + " marked, still stored \"" + t + "\" after a save",
      r.theme === want && r.bg === rgb(BRIEF[want]["--bg"]) && w0.after > w0.before && r.stored.theme === t &&
        r.picks.some(p => p.pick === mark && p.on) && r.picks.filter(p => p.on).length === 1,
      "data-theme " + r.theme + ", stored " + JSON.stringify(r.stored));
    check("switch (d) " + t + "/" + scheme + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- T-024: the theme before the first paint ----
  // index.html sets data-theme and meta theme-color from the stored pick in a
  // synchronous <head> script, because app.js is deferred behind the KaTeX
  // CDN script and until it runs the static attribute is all there is. To
  // prove the paint is the inline script's and not app.js's, app.js is HELD:
  // deferred scripts run in order, so a KaTeX request that never answers
  // keeps app.js from running. Every frame from the first one with a styled
  // body is sampled (requestAnimationFrame, which runs before each paint),
  // while held and after release, and every sample must be the expected
  // --bg — the first paint included, and never the other theme in between.
  console.log("\nT-024: the theme before the first paint");
  {
    // The inline script's panel map is the stylesheet's, theme by theme.
    const html = fs.readFileSync(path.join(ROOT, "platform/index.html"), "utf8");
    const mm = /var PANEL = \{([^}]*)\}/.exec(html);
    const map = {};
    if (mm) for (const p of mm[1].matchAll(/(\w+):\s*"(#[0-9a-fA-F]{6})"/g)) map[p[1]] = p[2].toLowerCase();
    const css = fs.readFileSync(CSS_FILE, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const cssPanel = {};
    for (const m of css.matchAll(/^(:root|\[data-theme="([\w-]+)"\])\s*\{([^}]*)\}/gm)) {
      const v = /--panel:\s*(#[0-9a-fA-F]{6})\b/.exec(m[3]);
      if (v) cssPanel[m[2] || "light"] = v[1].toLowerCase();
    }
    const keys = [...new Set(Object.keys(map).concat(Object.keys(cssPanel)))];
    const off = keys.filter(k => map[k] !== cssPanel[k]);
    check("first paint: index.html's PANEL map is every theme's --panel in style.css (light and dark, T-025)",
      !!mm && keys.length === 2 && off.length === 0,
      !mm ? "no PANEL map in index.html" : off.length ? off.map(k => k + " " + map[k] + " vs css " + cssPanel[k]).join(", ") : keys.length + " themes");
  }
  function samplePaints() {
    if (window.top !== window) return;
    window.__paints = [];
    const tick = () => {
      if (document.body) {
        const bg = getComputedStyle(document.body).backgroundColor;
        if (bg !== "rgba(0, 0, 0, 0)") window.__paints.push({ bg, theme: document.documentElement.dataset.theme,
          app: !!document.querySelector("#view > *") });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  for (const [label, seedTheme, scheme, want, extra, removed] of [
    // The navy switch (round 3): "light" with no marker paints navy from the
    // first frame, on a light phone so it is not the phone speaking.
    ["stored \"light\", no marker, phone light", undefined, "light", "dark", bareSettings({ theme: "light" })],
    ["stored \"light\" + marker, phone dark", "light", "dark", "light"],
    ["nothing stored, phone light", undefined, "light", "dark"],
    ["stored \"auto\", phone dark", "auto", "dark", "dark"],
    ["stored \"auto\", phone light", "auto", "light", "light"],
    // T-025: removed themes, no marker, on a LIGHT phone so dark is not the
    // phone speaking: dark from the first frame, nothing written at boot.
    ["stored \"forest\" (removed), phone light", undefined, "light", "dark", bareSettings({ theme: "forest" }), "forest"],
    ["stored \"slate\" (removed), phone light", undefined, "light", "dark", bareSettings({ theme: "slate" }), "slate"],
  ]) {
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: scheme }, seedTheme, extra);
    await ctx.addInitScript(samplePaints);
    let release; const held = new Promise(r => { release = r; });
    let heldHits = 0;
    await ctx.route(/katex(\.min)?\.js/, async r => { heldHits++; await held; return r.abort(); });
    await page.goto(URL + "/", { waitUntil: "commit" });
    const first = await page.waitForFunction(() => window.__paints && window.__paints.length >= 3 ? window.__paints.slice() : null,
      null, { polling: "raf", timeout: 8000 }).then(h => h.jsonValue(), () => null);
    const meta = await page.evaluate(() => (document.querySelector('meta[name="theme-color"]') || {}).content || "");
    const wantBg = rgb(BRIEF[want]["--bg"]);
    check("first paint (" + label + "): with app.js held, the first painted body is the " + want + " --bg " + BRIEF[want]["--bg"] + ", meta " + PANEL[want],
      !!first && heldHits > 0 && first.every(p => !p.app) && first[0].bg === wantBg && first[0].theme === want && meta === PANEL[want],
      first ? "held " + heldHits + ", first paint " + first[0].bg + " (" + first[0].theme + "), app ran " + first.some(p => p.app) + ", meta " + meta
        : "no styled frame while app.js was held");
    release();
    await page.waitForSelector("#view > *", { timeout: 10000 });
    await frames(page);
    const all = await page.evaluate(() => window.__paints);
    const wrong = all.filter(p => p.bg !== wantBg);
    check("first paint (" + label + "): every frame, held and after app.js ran, is " + want + " — never the other theme",
      all.length > 3 && all.some(p => p.app) && wrong.length === 0,
      wrong.length ? wrong.length + " of " + all.length + " frames, e.g. " + wrong[0].bg + " (" + wrong[0].theme + ")" : all.length + " frames");
    if (removed) {
      const after = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, writes: window.__stateWrites,
        stored: (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).theme,
        meta: (document.querySelector('meta[name="theme-color"]') || {}).content || "" }));
      check("first paint (" + label + "): after app.js ran, data-theme=\"dark\", meta " + PANEL.dark + ", zero state writes at boot, still stored \"" + removed + "\"",
        after.theme === "dark" && after.meta === PANEL.dark && after.writes === 0 && after.stored === removed,
        "data-theme " + after.theme + ", meta " + after.meta + ", state writes " + after.writes + ", stored " + JSON.stringify(after.stored));
    }
    check("first paint (" + label + "): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- T-025: no decoration (T-024's glow is gone) ----
  console.log("\nT-025: no glow, no decoration");
  for (const { w, h, mobile } of WIDTHS) {
    for (const theme of THEMES) {
      const at = w + "px " + theme;
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme);
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await themePainted(page, theme, at + " decoration");
      for (const route of GLOW_ROUTES) {
        await go(page, route);
        const g = await page.evaluate(decorState);
        check(at + " " + route + ": no .main::before decoration, and no background-image on .main or the sidebar",
          g.content === "none" && g.beforeImg === "none" && g.mainImg === "none" && g.sideImg === "none",
          "::before content " + g.content + " image " + g.beforeImg.slice(0, 60) + "; .main image " + g.mainImg.slice(0, 60) +
            " bg " + g.mainBg + "; sidebar image " + g.sideImg.slice(0, 60));
      }
      check(at + " decoration: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- the picked calendar day ----
  console.log("\ncalendar cellPick");
  for (const motion of ["no-preference", "reduce"]) {
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: motion }, "light");
    await page.goto(URL + "/calendar", { waitUntil: "load" });
    await page.waitForSelector("#view .cal-grid");
    // Click a day that is not the selected one, then catch the new selected
    // cell on the first frame it exists — the view is re-rendered (inside a
    // view transition when motion is allowed), so it is a new element with a
    // fresh animation. Proof, not a duration.
    const r = await page.evaluate(() => new Promise(done => {
      const cell = [...document.querySelectorAll(".cal-cell[data-cal-day]:not(.sel):not(.rest)")][3];   // a plan day, never a pre-start or rest cell
      if (!cell) return done({ err: "no unselected day in the month grid" });
      const day = cell.dataset.calDay;
      cell.click();
      const t0 = performance.now();
      const poll = () => {
        const el = document.querySelector('.cal-cell.sel[data-cal-day="' + day + '"]');
        if (!el) return performance.now() - t0 > 3000 ? done({ err: "day " + day + " never became selected" }) : requestAnimationFrame(poll);
        const anims = el.getAnimations().filter(a => a.animationName === "cellPick");
        const kf = anims[0] && anims[0].effect.getKeyframes();
        done({ day, n: anims.length, states: anims.map(a => a.playState),
               from: kf && kf.length ? kf[0].transform : null });
      };
      requestAnimationFrame(poll);
    }));
    if (motion === "no-preference") {
      check("the picked day runs cellPick", !r.err && r.n === 1 && r.states[0] === "running",
        r.err || r.n + " cellPick animation(s) " + JSON.stringify(r.states) + " on " + r.day);
      check("cellPick starts from scale(0.92)", !r.err && r.from === "scale(0.92)", r.err || "first keyframe " + r.from);
    } else {
      check("under reduced motion the picked day does not animate", !r.err && !(r.states || []).includes("running"),
        r.err || r.n + " cellPick animation(s) " + JSON.stringify(r.states));
    }
    check("calendar (" + motion + "): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // =================== T-006: the chrome ===================
  const near = (a, want, tol) => Math.abs(a - want) <= tol;
  const material = (bg, tokBytes, pct) => bg[3] !== 255 && near(bg[3], Math.round(pct * 255), 3) && __same(bg, tokBytes);
  const blurOk = bf => /blur\(20px\)/.test(bf) && /saturate\((180%|1\.8)\)/.test(bf);
  const tabBlurOk = bf => /blur\(22px\)/.test(bf) && /saturate\((170%|1\.7)\)/.test(bf);
  const hx = p => "#" + p.slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("") + (p[3] !== 255 ? " at " + Math.round(p[3] / 2.55) + "%" : "");

  // ---- the nav bar, at 390 ----
  for (const theme of THEMES) {
    const at = "390px " + theme;
    console.log("\nnav bar, " + at);
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: theme }, theme);
    await page.goto(URL + "/__boot", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await themePainted(page, theme, at);
    for (const route of NAV_ROUTES) {
      await go(page, route);
      // Two frames: the observer's first report is delivered after a render,
      // and it is allowed to change nothing here.
      await frames(page);
      const a = await page.evaluate(barState);
      const where = at + " " + route;
      check(where + ": the nav bar is a material — --bg at 78%, blur(20px) saturate(180%)",
        blurOk(a.bf) && material(a.bg, a.bgTok, 0.78), "backdrop-filter " + a.bf + "; background " + hx(a.bg) + " (--bg " + hx(a.bgTok) + ")");
      check(where + ": the nav bar is 44px tall (±1) with no rule under it",
        near(a.h, 44, 1) && a.rule === 0, a.h + "px, border-bottom " + a.rule + "px");
      check(where + ": the menu button leads, on screen (left edge >= 0), 44x44, in --accent",
        a.menu.w >= 44 && a.menu.h >= 44 && a.menu.left >= 0 && a.menu.left < 24 && __same(a.menu.color, a.menu.accent),
        Math.round(a.menu.w) + "x" + Math.round(a.menu.h) + " at x=" + Math.round(a.menu.left) + ", " + hx(a.menu.color));
      check(where + ": the day/week capsule trails, on --surface, in tabular numerals",
        /^Day \d{3} · Week \d+$/.test(a.chip.text) && a.chip.bg[3] === 255 && __same(a.chip.bg, a.chip.surface) &&
        /tabular-nums/.test(a.chip.fvn) && !/mono/i.test(a.chip.family) && a.chip.radius >= a.chip.h / 2 && a.chip.right >= a.vw - 16,
        "\"" + a.chip.text + "\" on " + hx(a.chip.bg) + ", " + a.chip.fvn + ", right edge " + Math.round(a.chip.right) + " of " + a.vw);
      check(where + ": the page h1 is the large title (34px/700, sentence case, no day meta in it)",
        !!a.h1 && a.h1.size === "34px" && a.h1.weight === "700" && a.h1.tt === "none" && (a.h1.meta === null || a.h1.meta === "none"),
        a.h1 ? "\"" + a.h1.text + "\" " + a.h1.size + "/" + a.h1.weight + " " + a.h1.tt + (a.h1.meta ? ", meta " + a.h1.meta : "") : "no h1");
      check(where + ": the inline title is 17px/600 and reads the h1",
        a.title.size === "17px" && a.title.weight === "600" && !!a.h1 && a.title.text === a.h1.text,
        a.title.size + "/" + a.title.weight + " \"" + a.title.text + "\"");
      check(where + ": at scroll 0 the inline title is hidden (opacity 0) and there is no scroll edge",
        a.title.op === "0" && a.edge.op === "0", "title opacity " + a.title.op + ", edge opacity " + a.edge.op + " (" + a.cls + ")");
      // Under the bar: the h1's top edge 200px above the bar's bottom edge.
      const sc = await page.evaluate(scrollTitleUnder, 200);
      await page.waitForFunction(() => /\blt-on\b/.test(document.querySelector("#topbar").className) &&
        /\bedge-on\b/.test(document.querySelector("#topbar").className), null, { timeout: 2000, polling: "raf" }).catch(() => {});
      await frames(page);
      const b = await page.evaluate(barState);
      check(where + ": with the h1 scrolled 200px under the bar the inline title shows (opacity 1)",
        !sc.err && sc.got === sc.want && b.title.op === "1",
        sc.err || "scrolled to " + sc.got + " (wanted " + sc.want + "); title opacity " + b.title.op + " (" + b.cls + ")");
      check(where + ": and the scroll edge shows: a 0.5px --line",
        b.edge.op === "1" && hairline(b.edge.w) && __same(b.edge.col, b.edge.line),
        "opacity " + b.edge.op + ", " + b.edge.w + "px " + hx(b.edge.col) + " (--line " + hx(b.edge.line) + ")");
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForFunction(() => !/\b(lt-on|edge-on)\b/.test(document.querySelector("#topbar").className),
        null, { timeout: 2000, polling: "raf" }).catch(() => {});
      await frames(page);
      const c = await page.evaluate(barState);
      check(where + ": back at the top the inline title and the edge go again",
        c.title.op === "0" && c.edge.op === "0", "title opacity " + c.title.op + ", edge opacity " + c.edge.op);
    }
    check(at + " nav bar: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- the tab bar, at 390; the sidebar at 1280 and the drawer at 390 ----
  for (const theme of THEMES) {
    console.log("\ntab bar and sidebar, " + theme);
    {
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: theme }, theme);
      await page.goto(URL + "/", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await themePainted(page, theme, "390px " + theme + " tab bar");
      const t = await page.evaluate(tabState);
      const at = "390px " + theme + " tab bar";
      // T-023 set the capsule's glass to blur(22px) saturate(170%); it was the
      // nav bar's blur(20px) saturate(180%).
      check(at + ": a material — --surface at 78%, blur(22px) saturate(170%), not the --panel slab",
        tabBlurOk(t.bf) && material(t.bg, t.surface, 0.78) && !__same(t.bg, t.panel, 0),
        "backdrop-filter " + t.bf + "; background " + hx(t.bg) + " (--surface " + hx(t.surface) + ", --panel " + hx(t.panel) + ")");
      // T-023: a 1px --line edge (it was a 0.5px top edge).
      check(at + ": a 1px --line edge all round", t.edges.every(e => e.w === 1 && __same(e.col, t.line)),
        t.edges.map(e => e.w + "px " + hx(e.col)).join(", "));
      const lab = t.tabs.filter(x => x.tt !== "none" || x.size !== "10px" || x.weight !== "500" || !(x.ls === "normal" || parseFloat(x.ls) === 0));
      check(at + ": the labels are sentence case (text-transform none), 10px/500, no letter-spacing",
        t.tabs.length === 5 && lab.length === 0,
        lab.length ? lab.map(x => x.name + " " + x.tt + " " + x.size + "/" + x.weight + " ls " + x.ls).join("; ") : t.tabs.map(x => x.name).join(", "));
      const gl = t.tabs.filter(x => x.gw !== 24 || x.gh !== 24 || x.h < 48.5);
      check(at + ": 24px glyphs on 49px tabs", gl.length === 0,
        gl.length ? gl.map(x => x.name + " glyph " + x.gw + "x" + x.gh + ", tab " + x.h.toFixed(1)).join("; ") : "5 tabs");
      const act = t.tabs.filter(x => x.active), rest = t.tabs.filter(x => !x.active);
      check(at + ": the active tab is --accent", act.length === 1 && __same(act[0].color, t.accent),
        act.map(x => x.name + " " + hx(x.color)).join(", ") + " (--accent " + hx(t.accent) + ")");
      check(at + ": the other tabs are --ink-3", rest.length === 4 && rest.every(x => __same(x.color, t.ink3)),
        rest.map(x => x.name + " " + hx(x.color)).join(", "));
      const d = await page.evaluate(sideState);
      check("390px " + theme + " drawer: solid --panel (as the sidebar, T-025), no material over the scrim, no image",
        d.bg[3] === 255 && __same(d.bg, d.panel, 0) && d.bf === "none" && d.img === "none",
        hx(d.bg) + " (--panel " + hx(d.panel) + "), backdrop-filter " + d.bf + ", image " + d.img);
      check("390px " + theme + " tab bar and drawer: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
    {
      const { ctx, page, errors } = await fresh(browser, { viewport: { width: 1280, height: 800 }, colorScheme: theme }, theme);
      await page.goto(URL + "/", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      const at = "1280px " + theme + " sidebar";
      await themePainted(page, theme, at);
      const s = await page.evaluate(sideState);
      // T-025 (spec item 4): a plain, solid --panel, darker than the page.
      check(at + ": a solid --panel (" + PANEL[theme] + "), no backdrop-filter, no background-image",
        s.bg[3] === 255 && __same(s.bg, s.panel, 0) && __same(s.bg, hexBytes(PANEL[theme]), 0) && s.bf === "none" && s.img === "none",
        "background " + hx(s.bg) + " (--panel " + hx(s.panel) + "), backdrop-filter " + s.bf + ", image " + s.img);
      check(at + ": darker than the page — its luminance below the page --bg's",
        s.lSide < s.lPage, "sidebar " + hx(s.bg) + " L " + s.lSide.toFixed(4) + ", page --bg " + hx(s.page) + " L " + s.lPage.toFixed(4));
      check(at + ": a 0.5px --line trailing edge", hairline(s.rightW) && __same(s.rightCol, s.line), s.rightW + "px " + hx(s.rightCol));
      check(at + ": the current item is an --accent-soft pill, --accent label, 8px corners",
        !!s.act && s.act.bg[3] === 255 && __same(s.act.bg, s.soft) && __same(s.act.color, s.accent) && s.act.radius === "8px",
        s.act ? "\"" + s.act.text + "\" " + hx(s.act.bg) + " (--accent-soft " + hx(s.soft) + "), label " + hx(s.act.color) + ", " + s.act.radius : "no current nav item");
      check(at + ": the crest is --gold with --panel cut-outs (holes in the seal, T-025)",
        !!s.field && __same(s.field, s.gold) && !!s.cut && __same(s.cut, s.panel),
        "field " + (s.field ? hx(s.field) : "?") + " (--gold " + hx(s.gold) + "), cut " + (s.cut ? hx(s.cut) : "?"));
      check(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- T-023: the floating tab bar, at 390 and 320 ----
  for (const theme of THEMES) {
    console.log("\nfloating tab bar, " + theme);
    for (const w of [390, 320]) {
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true, colorScheme: theme }, theme);
      await page.goto(URL + "/", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      const at = w + "px " + theme + " floating tab bar";
      await themePainted(page, theme, at);
      const t = await page.evaluate(tabState);
      check(at + ": 14px (+/-1) in from both edges",
        Math.abs(t.box.l - 14) <= 1 && Math.abs(t.vw - t.box.r - 14) <= 1, t.box.l.toFixed(1) + " and " + (t.vw - t.box.r).toFixed(1));
      check(at + ": a 70px capsule (radius >= half its height), 12px above the bottom",
        Math.abs(t.box.h - 70) <= 0.5 && t.radius >= t.box.h / 2 && Math.abs(t.vh - t.box.btm - 12) <= 1,
        "h " + t.box.h.toFixed(1) + ", radius " + t.radius + ", gap " + (t.vh - t.box.btm).toFixed(1));
      check(at + ": glass — --surface at 78%, blur(22px) saturate(170%), a 1px --line edge, a shadow",
        tabBlurOk(t.bf) && material(t.bg, t.surface, 0.78) && t.edges.every(e => e.w === 1 && __same(e.col, t.line)) && t.shadow !== "none",
        t.bf + "; " + hx(t.bg) + "; edges " + t.edges.map(e => e.w).join("/") + "; shadow " + (t.shadow === "none" ? "none" : "yes"));
      const small = t.tabs.filter(x => x.w < 44 || x.h < 44);
      check(at + ": every tab is at least 44x44", t.tabs.length === 5 && small.length === 0,
        small.length ? small.map(x => x.name + " " + x.w.toFixed(1) + "x" + x.h.toFixed(1)).join("; ") : t.tabs.map(x => x.w.toFixed(0) + "x" + x.h.toFixed(0)).join(", "));
      const bb = t.bubble;
      check(at + ": a glass bubble (translucent, blurred) centred (+/-1) behind the active tab",
        !!bb && bb.op === "1" && bb.bg[3] > 0 && bb.bg[3] < 255 && /blur\(/.test(bb.bf) && bb.actC !== null && Math.abs(bb.c - bb.actC) <= 1 && bb.behind,
        bb ? "opacity " + bb.op + ", " + hx(bb.bg) + ", " + bb.bf + ", centre " + bb.c.toFixed(1) + " vs active " + (bb.actC === null ? "none" : bb.actC.toFixed(1)) : "no bubble");
      const act = t.tabs.filter(x => x.active);
      check(at + ": the active tab's icon and label are --accent", act.length === 1 && __same(act[0].color, t.accent),
        act.map(x => x.name + " " + hx(x.color)).join(", "));
      check(at + ": the active label on the bubble is at least 4.5:1", !!bb && bb.labelRatio >= 4.5,
        bb ? bb.labelRatio.toFixed(2) + ":1" : "no bubble");
      // The seed has one due review.
      check(at + ": the Review tab's badge counts the due reviews in a solid fill at >= 4.5:1",
        !!t.badge && t.badge.inReview && t.badge.text === "1" && t.badge.bg[3] === 255 && t.badge.ratio >= 4.5,
        t.badge ? "\"" + t.badge.text + "\" " + hx(t.badge.bg) + " " + t.badge.ratio.toFixed(2) + ":1" : "no badge shown");
      // The Next card over the capsule, on /review, where it is on screen (on
      // Today it is stowed while the hero's own button shows).
      await go(page, "/review");
      const n = await page.evaluate(() => {
        const z = window.__dz, rb = document.querySelector("#railbar"), tb = document.querySelector("#tabbar");
        if (!rb || !rb.checkVisibility({ opacityProperty: true })) return null;
        const cs = getComputedStyle(rb), b = rb.getBoundingClientRect(), t = tb.getBoundingClientRect();
        const btn = rb.querySelector(".btn"), bb = btn && btn.getBoundingClientRect();
        return { l: b.left - t.left, r: t.right - b.right, gap: t.top - b.bottom, radius: parseFloat(cs.borderTopLeftRadius),
                 bf: cs.backdropFilter, bg: z.bytes(cs.backgroundColor), surface: z.tok("--surface"), line: z.tok("--line"), shadow: cs.boxShadow,
                 edges: ["Top", "Right", "Bottom", "Left"].map(k => ({ w: parseFloat(cs["border" + k + "Width"]) || 0, col: z.bytes(cs["border" + k + "Color"]) })),
                 btn: bb ? { w: bb.width, h: bb.height } : null };
      });
      const card = at.replace("floating tab bar", "Next card");
      check(card + ": on screen above the capsule on /review", !!n, n ? "" : "not visible");
      if (n) {
        check(card + ": the capsule's insets (+/-1)", Math.abs(n.l) <= 1 && Math.abs(n.r) <= 1, "left " + n.l.toFixed(1) + ", right " + n.r.toFixed(1) + " from the capsule's");
        check(card + ": radius >= 20px and 8px (+/-1) above the capsule", n.radius >= 20 && Math.abs(n.gap - 8) <= 1, "radius " + n.radius + ", gap " + n.gap.toFixed(1));
        check(card + ": the capsule's glass — --surface at 78%, blur(22px) saturate(170%), a 1px --line edge, a shadow",
          tabBlurOk(n.bf) && material(n.bg, n.surface, 0.78) && n.edges.every(e => e.w === 1 && __same(e.col, n.line)) && n.shadow !== "none",
          n.bf + "; " + hx(n.bg) + "; edges " + n.edges.map(e => e.w).join("/") + "; shadow " + (n.shadow === "none" ? "none" : "yes"));
        check(card + ": Open is at least 44x44", !!n.btn && n.btn.w >= 44 && n.btn.h >= 44, n.btn ? n.btn.w.toFixed(1) + "x" + n.btn.h.toFixed(1) : "no button");
      }
      check(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- T-023 review: a long count stays a badge, inside its tab ----
  // 99, 100, 150 and 1200 due (the seed's one plus synthetic verified lectures
  // due a day ago; there are not 1200 real ones). The badge read "150" and
  // "1200", left-anchored and uncapped, and at 320 it ran past the capsule's
  // edge. 99 and 100 are the boundary: "99" is the widest badge that is still
  // a number, and the one the right anchor has to keep inside the tab too.
  console.log("\nthe Review badge with a long count");
  let badgeCases = 0;
  for (const due of [99, 100, 150, 1200]) {
    for (const w of [320, 390]) {
      for (const root of [16, 24]) {
        const more = new Function("args",
          "if (window.top !== window) return;" +
          "const s = JSON.parse(localStorage.getItem('darhikmah_v1') || '{}'); s.lessons = s.lessons || {}; s.review = s.review || {};" +
          "const y = new Date(args[0] - 86400000).toISOString().slice(0, 10);" +
          "for (let i = 0; i < " + (due - 1) + "; i++) { const k = 'zz' + i + '.0.0'; s.lessons[k] = { done: true, verified: true, doneAt: y, notes: '', checks: [] }; s.review[k] = { due: y, box: 1 }; }" +
          "localStorage.setItem('darhikmah_v1', JSON.stringify(s));" +
          "document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.fontSize = '" + root + "px'; });");
        const { ctx, page, errors } = await fresh(browser,
          { viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "dark" }, "dark", more);
        await page.goto(URL + "/", { waitUntil: "load" });
        await page.waitForSelector("#view > *");
        const m = await page.evaluate(() => {
          const e = document.querySelector("#tabBadge"), a = e && e.closest("a"), bar = document.querySelector("#tabbar");
          const r = x => { const b = x.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom }; };
          return e ? { text: e.textContent.trim(), shown: e.checkVisibility(), label: a.getAttribute("aria-label"), badge: r(e), tab: r(a), bar: r(bar),
                       root: getComputedStyle(document.documentElement).fontSize } : null;
        });
        const at = w + "px root " + root + "px, " + due + " due";
        const want = due > 99 ? "99+" : String(due);
        const inside = (x, box) => x.l >= box.l - 0.5 && x.r <= box.r + 0.5 && x.t >= box.t - 0.5 && x.b <= box.b + 0.5;
        const f = n => n.toFixed(1);
        check(at + ": the badge reads " + want + " and the Review link's label keeps the full count",
          !!m && m.root === root + "px" && m.shown && m.text === want && m.label === "Review, " + due + " due",
          m ? "root " + m.root + ", \"" + m.text + "\", aria-label \"" + m.label + "\"" : "no badge");
        check(at + ": the badge sits inside the Review tab and the capsule",
          !!m && inside(m.badge, m.tab) && inside(m.badge, m.bar),
          m ? "badge " + f(m.badge.l) + ".." + f(m.badge.r) + ", tab " + f(m.tab.l) + ".." + f(m.tab.r) + ", capsule " + f(m.bar.l) + ".." + f(m.bar.r) : "no badge");
        check(at + ": no page errors", errors.length === 0, errors.join(" | "));
        badgeCases++;
        await ctx.close();
      }
    }
  }

  // ---- reduced transparency and more contrast, emulated and confirmed ----
  for (const [mq, feature, value] of [["reduced transparency", "prefers-reduced-transparency", "reduce"], ["more contrast", "prefers-contrast", "more"]]) {
    for (const theme of THEMES) {
      console.log("\n" + mq + ", " + theme);
      for (const w of [390, 1280]) {
        const mobile = w === 390;
        const { ctx, page, errors } = await fresh(browser,
          { viewport: { width: w, height: mobile ? 844 : 800 }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme);
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: feature, value }] });
        await page.goto(URL + "/", { waitUntil: "load" });
        await page.waitForSelector("#view > *");
        await frames(page);
        const m = await page.evaluate(chromeState);
        const at = w + "px " + theme + " " + mq;
        const on = feature === "prefers-contrast" ? m.more : m.rt;
        check(at + ": the media query is in effect (matchMedia confirms the emulation)", on,
          "matchMedia(" + feature + ": " + value + ") = " + on);
        const solid = (x, tokBytes) => !!x && x.bf === "none" && x.bg[3] === 255 && __same(x.bg, tokBytes);
        if (mobile) {
          check(at + ": the nav bar is solid --bg, the tab bar and the action bar solid --surface, none blurred",
            on && solid(m.topbar, m.bg) && solid(m.tabbar, m.surface) && solid(m.railbar, m.surface),
            "nav " + hx(m.topbar.bg) + " " + m.topbar.bf + "; tab " + hx(m.tabbar.bg) + " " + m.tabbar.bf + "; action " + hx(m.railbar.bg) + " " + m.railbar.bf);
          if (feature === "prefers-reduced-transparency")
            check(at + ": the tab bar's bubble is solid and unblurred (T-023)",
              !!m.bubble && m.bubble.bf === "none" && m.bubble.bg[3] === 255, m.bubble ? hx(m.bubble.bg) + " " + m.bubble.bf : "no bubble");
          if (feature === "prefers-contrast")
            check(at + ": the edges are stated — the nav bar's at scroll 0 and the tab bar's, 1px --line-strong",
              m.edge.op === "1" && m.edge.w === 1 && __same(m.edge.col, m.strong) && m.tabTop.w === 1 && __same(m.tabTop.col, m.strong),
              "nav edge opacity " + m.edge.op + " " + m.edge.w + "px " + hx(m.edge.col) + "; tab top " + m.tabTop.w + "px " + hx(m.tabTop.col) + " (--line-strong " + hx(m.strong) + ")");
        } else {
          check(at + ": the sidebar is solid --panel, not blurred (T-025)", on && solid(m.sidebar, m.panel),
            hx(m.sidebar.bg) + " " + m.sidebar.bf);
          if (feature === "prefers-contrast")
            check(at + ": the sidebar's trailing edge is 1px --line-strong",
              m.sideRight.w === 1 && __same(m.sideRight.col, m.strong), m.sideRight.w + "px " + hx(m.sideRight.col));
        }
        if (feature === "prefers-contrast")
          check(at + ": a .glist is outlined, 1px --line-strong on all four sides",
            !!m.glist && m.glist.every(b => b.w === 1 && __same(b.col, m.strong)),
            m.glist ? m.glist.map(b => b.w + "px " + hx(b.col)).join(", ") : "no visible .glist on /");
        check(at + ": no page errors", errors.length === 0, errors.join(" | "));
        await ctx.close();
      }
    }
  }

  // ---- reduced motion: the swap is instant ----
  console.log("\nthe inline title under reduced motion");
  for (const motion of ["reduce", "no-preference"]) {
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: motion }, "light");
    await page.goto(URL + "/calendar", { waitUntil: "load" });
    await page.waitForSelector("#view .cal-grid");
    await frames(page);
    // Read the title in the same task the class that shows it lands: an
    // instant swap is already opaque there; a fade is still at its start.
    const r = await page.evaluate(() => new Promise(done => {
      const bar = document.querySelector("#topbar"), title = document.querySelector("#tbTitle");
      const h1 = document.querySelector("#view h1");
      if (!h1) return done({ err: "no h1" });
      const t = setTimeout(() => { mo.disconnect(); done({ err: "the inline title never came on" }); }, 3000);
      const mo = new MutationObserver(() => {
        if (!bar.classList.contains("lt-on")) return;
        mo.disconnect(); clearTimeout(t);
        done({
          op: getComputedStyle(title).opacity,
          fades: bar.getAnimations({ subtree: true }).filter(a => a.playState === "running")
            .map(a => (a.transitionProperty || a.animationName || "?") + " on " + (a.effect && a.effect.pseudoElement ? "::" + a.effect.pseudoElement.replace(/^:+/, "") : a.effect && a.effect.target ? a.effect.target.id || a.effect.target.className : "?")),
        });
      });
      mo.observe(bar, { attributes: true, attributeFilter: ["class"] });
      const y = h1.getBoundingClientRect().top + scrollY - bar.getBoundingClientRect().bottom + 200;
      window.scrollTo({ top: y, behavior: "instant" });
    }));
    if (motion === "reduce")
      check("reduced motion: the inline title is opaque the moment it is shown, with no fade on the title or the edge",
        !r.err && r.op === "1" && r.fades.length === 0, r.err || "opacity " + r.op + " in the same task; running: " + (r.fades.join(", ") || "none"));
    else
      check("motion allowed: the same measurement sees the title fade in (so the check above is not blind)",
        !r.err && r.op !== "1" && r.fades.some(f => /opacity/.test(f)), r.err || "opacity " + r.op + "; running: " + (r.fades.join(", ") || "none"));
    check("reduced motion (" + motion + "): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- a render is a read: scrolling a lesson with its video on screen ----
  console.log("\nscrolling a lesson page");
  {
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "light" }, "light");
    await page.goto(URL + "/__boot", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    // T-043: a watched lecture's video collapses to the watched bar, and the
    // seed has MATH 110 lectures 1 and 14 watched (so 2 is locked); the first
    // lecture of MATH 120 is open, unwatched, and has its video on the page.
    await go(page, "/lesson/math120/0/0");
    const before = await page.evaluate(() => {
      const f = document.querySelector("#view .video-frame iframe");
      if (f) f.dataset.designStamp = "original";
      window.__viewRebuilds = 0;
      new MutationObserver(ms => { for (const m of ms) if (m.addedNodes.length) window.__viewRebuilds++; })
        .observe(document.querySelector("#view"), { childList: true });
      window.__barSeen = new Set();
      const bar = document.querySelector("#topbar");
      new MutationObserver(() => bar.classList.forEach(c => window.__barSeen.add(c)))
        .observe(bar, { attributes: true, attributeFilter: ["class"] });
      return { frame: !!f, writes: window.__stateWrites };
    });
    for (const [y, want] of [[300, true], [900, true], [0, false]]) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), y);
      await page.waitForFunction(w => /\bedge-on\b/.test(document.querySelector("#topbar").className) === w,
        want, { timeout: 2000, polling: "raf" }).catch(() => {});
      await frames(page);
    }
    const after = await page.evaluate(() => {
      const f = document.querySelector("#view .video-frame iframe");
      return { stamp: f ? f.dataset.designStamp || "(rebuilt)" : "(gone)", writes: window.__stateWrites,
               rebuilds: window.__viewRebuilds, seen: [...window.__barSeen].sort() };
    });
    check("lesson page: there is a video frame to protect", before.frame, before.frame ? "iframe present" : "no .video-frame iframe");
    check("lesson page: scrolling ran the nav bar through its states (the observer was live)",
      after.seen.includes("lt-on") && after.seen.includes("edge-on"), "classes seen: " + (after.seen.join(" ") || "none"));
    check("lesson page: scrolling is a read — no state write, no view rebuilt, the same <iframe> node",
      after.writes === before.writes && after.rebuilds === 0 && after.stamp === "original",
      "state writes " + before.writes + " -> " + after.writes + ", view rebuilds " + after.rebuilds + ", iframe " + after.stamp);
    check("lesson page: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // =================== T-007: the lists ===================
  const LIST_NAMES = {
    fill: "every visible .glist is an opaque --surface section",
    // 12px under T-007; 20px (--r-card) since T-024, the owner's decision.
    shape: "every visible .glist has 20px corners and clips its rows (overflow hidden)",
    head: "every .ghead is sentence case (text-transform none), 20px, 600, with no rule",
    meta: "every .gh-meta is 15px --ink-2 with tabular numerals",
    height: "every .grow is at least 44px tall (56 with a subtitle)",
    type: ".g-t is 17px in the body face, 600 (400 on a muted or done row); .g-s is 15px --ink-2",
    value: ".g-v has tabular numerals and no mono face",
    sep: "no separator above a first row; each later row's 0.5px --line separator starts at or right of the .g-t above it",
    lead: "the leading slot is --ink-2 and the chevron --ink-3",
  };
  const listMeasured = new Set(), listNA = new Set();
  for (const { w, h, mobile } of WIDTHS) {
    for (const theme of THEMES) {
      const at = w + "px " + theme;
      console.log("\nlists, " + at);
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme);
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      for (const route of LIST_ROUTES) {
        await go(page, route);
        const m = await page.evaluate(listState);
        const where = at + " " + route;
        // A route the spec names that has no list is reported, not passed:
        // only /workshop, /courses (T-026a) and /exams (T-026b) are allowed
        // to be without one.
        // Only the list's and the rows' checks are n/a there: a section
        // header (.ghead, .gh-meta) still heads the shelf on /courses and is
        // measured like any other (review round 1).
        const na = !m.n.glist;
        if (na && !LIST_NA.has(route)) { check(where + ": has a .glist to measure", false, "no visible .glist"); continue; }
        if (na) { listNA.add(route); console.log("  n/a   " + where + ": no .glist on this route (rows and sections); headers measured"); }
        else listMeasured.add(route);
        const counts = { fill: m.n.glist, shape: m.n.glist, head: m.n.ghead, meta: m.n.ghmeta, height: m.n.row,
                         type: (m.n.gt || 0) + (m.n.gs || 0), value: m.n.gv, sep: m.n.sep, lead: (m.n.lead || 0) + (m.n.chev || 0) };
        for (const k of (na ? ["head", "meta"] : Object.keys(LIST_NAMES))) {
          if (!counts[k] && !m.bad[k]) continue;          // nothing of that kind on this route
          const b = m.bad[k] || [];
          check(where + ": " + LIST_NAMES[k], b.length === 0,
            b.length ? b.length + " — " + b.slice(0, 3).join("; ") : counts[k] + " measured");
        }
      }
      check(at + " lists: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- the keyboard ring, inside the section that clips it ----
  // Reached with the Tab key from a fresh page, so :focus-visible is the
  // browser's own decision and not a forced state.
  const RING_MIN = 0.6;              // the ring's colour, at least 60% of the way there
  let ringsSeen = 0;
  for (const { w, h, mobile } of WIDTHS) {
    for (const theme of THEMES) {
      const at = w + "px " + theme + " / keyboard ring";
      console.log("\nthe keyboard ring, " + w + "px " + theme);
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme);
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await go(page, "/");
      const label = await page.evaluate(markOneRow);
      let tabs = 0, reached = false;
      if (label) {
        for (; tabs < 200 && !reached; tabs++) {
          await page.keyboard.press("Tab");
          reached = await page.evaluate(() => {
            const g = document.querySelector("[data-ring-list]"), a = document.activeElement;
            return !!a && a.parentElement === g;
          });
        }
      }
      check(at + ": Tab reaches the row of a one-row section", !!label && reached,
        !label ? "no one-row .glist on /" : reached ? "\"" + label + "\" after " + tabs + " Tab presses" : "not reached in " + tabs + " presses");
      if (!reached) { await ctx.close(); continue; }
      await frames(page);
      const r = await page.evaluate(ringState);
      if (r.err) { check(at + ": the focused row can be measured", false, r.err); await ctx.close(); continue; }
      ringsSeen++;
      const box = b => [b.l, b.t, b.r, b.b].map(v => +v.toFixed(1)).join(",");
      check(at + ": the row is :focus-visible with a solid, opaque, non-zero --accent outline",
        r.fv && r.style !== "none" && r.w >= 2 && r.col[3] === 255 && __same(r.col, r.accent),
        r.name + " :focus-visible " + r.fv + ", outline " + r.style + " " + r.w + "px " + hx(r.col) + " (--accent " + hx(r.accent) + "), offset " + r.off + "px");
      const inside = r.ring.l >= r.clip.l - 0.01 && r.ring.t >= r.clip.t - 0.01 && r.ring.r <= r.clip.r + 0.01 && r.ring.b <= r.clip.b + 0.01;
      check(at + ": the outline's outer box lies inside the section's box (the box that clips it)", inside,
        "outline " + box(r.ring) + " in section " + box(r.clip));
      check(at + ": nothing covers the section while its pixels are read", r.covered.length === 0,
        r.covered.length ? "covered by " + r.covered.join(", ") : "clear");
      // Painted, not just declared: the section with the row focused, then
      // blurred, the second shot the baseline the first is measured against.
      const sec = page.locator("[data-ring-list]");
      const shotOn = (await sec.screenshot()).toString("base64");
      await page.evaluate(() => document.activeElement.blur());
      await frames(page);
      const shotOff = (await sec.screenshot()).toString("base64");
      const p = await page.evaluate(ringPixels, [shotOn, shotOff]);
      const fmt = o => Object.entries(o).map(([k, v]) => k + " " + v.toFixed(2)).join(", ");
      check(at + ": the ring is painted at the middle of all four sides (>= " + RING_MIN + " of the way to --accent)",
        !p.err && Object.values(p.sides).every(v => v >= RING_MIN), p.err || fmt(p.sides));
      check(at + ": and round all four rounded corners, not cut by the clip",
        !p.err && Object.values(p.corners).every(v => v >= RING_MIN), p.err || fmt(p.corners));
      check(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- the press, in every theme ----
  // Rows forced :active on a phone and :hover on a desktop; the sidebar's rows
  // forced :active in the drawer and :hover + :active beside the page, with
  // the theme menu open so its buttons are measured too.
  // T-025: the two themes there are. Parchment, Forest, Midnight, Latte and
  // Slate were removed, so there is nothing of theirs to measure.
  const ALL_THEMES = ["light", "dark"];
  let pressRows = 0, pressTexts = 0;
  for (const theme of ALL_THEMES) {
    console.log("\npress, " + theme);
    for (const { w, h, mobile } of WIDTHS) {
      const state = mobile ? ["active"] : ["hover"];
      const sideState2 = mobile ? ["active"] : ["hover", "active"];
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile }, theme, seedScores);
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      const measure = async sel => {
        await frames(page);
        let r = await page.evaluate(pressState, sel);
        // A finding has to survive a re-measure.
        if (r.lowFill.length || r.lowText.length) { await page.waitForTimeout(250); r = await page.evaluate(pressState, sel); }
        return r;
      };
      for (const route of PRESS_ROUTES) {
        await go(page, route);
        // Every row takes the press (.grow:active has no selector on the
        // element); only a row that goes somewhere — a link or a button —
        // takes the hover.
        const sel = mobile ? "#view .glist > .grow" : "#view .glist > a.grow, #view .glist > button.grow";
        const nForced = await force(cdp, sel, state);
        const r = await measure(sel);
        await force(cdp, sel, []);
        const where = w + "px " + theme + " " + route + " rows :" + state.join(":");
        pressRows += r.rows; pressTexts += r.texts;
        check(where + ": the pressed fill stands off the section (>= 1.05:1)", r.rows > 0 && nForced > 0 && r.lowFill.length === 0,
          r.rows === 0 ? "no visible row" : r.lowFill.length ? r.lowFill.slice(0, 3).join("; ") : r.rows + " rows, least " + r.fill.r.toFixed(3) + ":1 (" + r.fill.at + ")");
        check(where + ": every text node on a pressed row is >= 4.5:1 (3:1 large)", r.texts > 0 && r.lowText.length === 0,
          r.lowText.length ? r.lowText.length + " — " + r.lowText.slice(0, 3).join("; ") : r.texts + " texts, least " + r.text.r.toFixed(2) + ":1 (" + r.text.at + ")");
      }
      // The sidebar's own rows.
      await go(page, "/");
      if (!mobile) await page.evaluate(() => document.querySelector("#themeMenu").classList.add("open"));
      const ssel = ".sidebar .nav a, .sidebar .navrow, .sidebar .theme-menu button";
      await force(cdp, ssel, sideState2);
      const r = await measure(ssel);
      await force(cdp, ssel, []);
      const where = w + "px " + theme + " sidebar rows :" + sideState2.join(":");
      pressRows += r.rows; pressTexts += r.texts;
      check(where + ": the pressed fill stands off the sidebar (>= 1.05:1)", r.rows > 0 && r.lowFill.length === 0,
        r.rows === 0 ? "no visible row" : r.lowFill.length ? r.lowFill.slice(0, 3).join("; ") : r.rows + " rows, least " + r.fill.r.toFixed(3) + ":1 (" + r.fill.at + ")");
      check(where + ": every label on a pressed row is >= 4.5:1", r.texts > 0 && r.lowText.length === 0,
        r.lowText.length ? r.lowText.length + " — " + r.lowText.slice(0, 3).join("; ") : r.texts + " texts, least " + r.text.r.toFixed(2) + ":1 (" + r.text.at + ")");
      check(w + "px " + theme + " press: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // =================== T-016: the thumbnails ===================
  const show = (list, f) => list.length + " — " + list.slice(0, 3).map(f).join("; ");
  const hueOff = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
  const lessonsOf = cid => CURRICULUM.COURSES.find(c => c.id === cid).units.reduce((n, u) => n + u.lessons.length, 0);
  const readingsOf = cid => CURRICULUM.COURSES.find(c => c.id === cid).units.reduce((n, u) => n + u.lessons.filter(l => !l.v).length, 0);
  let thumbRows = 0, coverRows = 0, thumbTexts = 0;
  for (const { w, h, mobile } of WIDTHS) {
    for (const theme of THEMES) {
      const at = w + "px " + theme;
      console.log("\nthumbnails, " + at);
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme);
      // The frames are held, unanswered, while the skeleton is measured, and
      // refused after: the network is never reached, so what is asserted is
      // the waiting state and the fallback, not the pixels of a frame.
      let mode = "hold";
      const held = [];
      await page.route(/^https:\/\/i\.ytimg\.com\//, r => { if (mode === "hold") held.push(r); else r.abort(); });
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await themePainted(page, theme, at + " thumbnails");
      await go(page, "/course/math110");
      // Every unit open, so every row is on the page to measure.
      await page.evaluate(() => document.querySelectorAll("#view details.unit").forEach(d => { d.open = true; }));
      await frames(page);
      const where = at + " /course/math110";
      const pre = await page.evaluate(thumbState);
      const vids = pre.filter(r => r.v);
      thumbRows += pre.length;
      const badSrc = pre.filter(r => !r.thumb || (r.v ? r.imgs !== 1 || r.src !== ytimg(r.v) : r.imgs !== 0));
      check(where + ": every video lecture row leads with an <img> of i.ytimg.com/vi/<its v>/hqdefault.jpg",
        pre.length === lessonsOf("math110") && vids.length > 0 && badSrc.length === 0,
        badSrc.length ? show(badSrc, r => r.at + " src " + r.src + " (v " + r.v + ")") : vids.length + " of " + pre.length + " rows (" + lessonsOf("math110") + " lectures in the course)");
      const badAttr = vids.filter(r => r.loading !== "lazy" || r.decoding !== "async" || r.alt !== "" ||
        !(Math.abs(r.ratio - 16 / 9) <= 0.01) || !(Math.abs(r.boxRatio - 16 / 9) <= 0.01));
      check(where + ": each image is loading=lazy, decoding=async, alt=\"\", and 16:9 (±0.01)", vids.length > 0 && badAttr.length === 0,
        badAttr.length ? show(badAttr, r => r.at + " " + r.loading + "/" + r.decoding + " alt " + JSON.stringify(r.alt) + " " + r.ratio.toFixed(3) + " box " + r.boxRatio.toFixed(3))
          : vids.length + " images, box " + vids[0].boxW.toFixed(0) + "px at " + vids[0].ratio.toFixed(4));
      const badSkel = vids.filter(r => !r.bgOpaque || !r.skeleton || r.imgOpacity !== "0" || /\b(loaded|cover)\b/.test(r.cls));
      check(where + ": before load, each frame is invisible over a --surface-2 skeleton", vids.length > 0 && badSkel.length === 0,
        badSkel.length ? show(badSkel, r => r.at + " bg " + r.bg + ", img opacity " + r.imgOpacity + ", " + r.cls) : vids.length + " skeletons, " + vids[0].bg);
      const badChip = pre.filter(r => r.chip !== r.want || r.chipAria !== "true");
      check(where + ": the duration chip reads the lesson's min as m:ss or h:mm:ss, and is aria-hidden (the title is beside it)", pre.length > 0 && badChip.length === 0,
        badChip.length ? show(badChip, r => r.at + " \"" + r.chip + "\", want \"" + r.want + "\", aria-hidden " + r.chipAria) : pre.length + " chips, e.g. \"" + pre[0].chip + "\", aria-hidden");
      // The seeded state: lecture 1 watched, lecture 14 proven.
      const wr = pre.find(r => r.at === "math110/0/0"), pr = pre.find(r => r.at === "math110/0/13");
      const stateOk = !!wr && !!pr && /\bwatched\b/.test(wr.cls) && wr.edge === "100%" && wr.edgeCol === "#ffffff" && /· Watched$/.test(wr.sub) &&
        /\bproven\b/.test(pr.cls) && pr.edge === "100%" && pr.edgeCol !== wr.edgeCol && /· Proven$/.test(pr.sub);
      check(where + ": a watched lecture's frame has a full white edge, a proven one's a full gold edge, and each row says which", stateOk,
        [wr, pr].map(r => r ? r.at + " " + r.cls.replace(/^thumb /, "") + " edge " + r.edge + " " + r.edgeCol + " \"" + r.sub + "\"" : "missing").join("; "));

      // Now refuse them: every frame fails, and must fall back.
      mode = "abort";
      held.splice(0).forEach(r => r.abort().catch(() => {}));
      const settled = await visitThumbs(page);
      const post = await page.evaluate(thumbState);
      const pv = post.filter(r => r.v);
      coverRows += pv.length;
      const badCover = pv.filter(r => !/\bcover\b/.test(r.cls) || r.imgs !== 0 || !r.bgOpaque || r.skeleton ||
        r.bgHue == null || r.facHue == null || hueOff(r.bgHue, r.facHue) > 4 || !r.codeShown ||
        r.code !== r.course + " · " + (+r.at.split("/")[2] + 1) || r.ttl !== r.title);
      check(where + ": a frame that fails falls back to the typeset cover — no <img>, the course's colour, its code shown, its title in the markup",
        settled && pv.length === vids.length && badCover.length === 0,
        !settled ? "not every frame settled within 6s: " + post.filter(r => r.v && !/\bcover\b/.test(r.cls)).length + " still waiting" :
        badCover.length ? show(badCover, r => r.at + " " + r.cls + " imgs " + r.imgs + " bg " + r.bg + " (hue " + (r.bgHue == null ? "-" : r.bgHue.toFixed(1)) + " vs --fac " + r.fac + ") code \"" + r.code + "\" shown " + r.codeShown)
          : pv.length + " covers, " + pv[0].bg + " (--fac " + pv[0].fac + "), \"" + pv[0].code + "\"");
      const low = [];
      post.forEach(r => (r.texts || []).forEach(t => { thumbTexts++; if (t.r < 4.5 - 0.005) low.push(r.at + " " + t.what + " " + t.r.toFixed(2) + ":1 (" + t.fg + " on " + t.bg + ")"); }));
      const least = post.flatMap(r => (r.texts || []).map(t => Object.assign({ at: r.at }, t))).sort((a, b) => a.r - b.r)[0];
      check(where + ": on the cover, its code and the chip are >= 4.5:1", !!least && low.length === 0,
        low.length ? low.length + " — " + low.slice(0, 3).join("; ") : least ? "least " + least.r.toFixed(2) + ":1 (" + least.what + ", " + least.fg + " on " + least.bg + ")" : "no text measured");

      // Readings and papers: a cover from the first paint, nothing to load.
      mode = "hold";
      await go(page, "/course/ai300");
      const ai = await page.evaluate(thumbState);
      const reads = ai.filter(r => !r.v), aiv = ai.filter(r => r.v);
      const badRead = reads.filter(r => !r.thumb || !/\bcover\b/.test(r.cls) || r.imgs !== 0 || r.chip !== r.want || (r.vis && !r.codeShown));
      const badAiv = aiv.filter(r => r.src !== ytimg(r.v));
      check(at + " /course/ai300: every reading and paper row is a typeset cover with no <img> from its first paint, its chip \"Paper\" or \"Reading\"; every video row's frame is its own v",
        reads.length === readingsOf("ai300") && reads.length > 0 && badRead.length === 0 && badAiv.length === 0,
        badRead.length || badAiv.length ? show(badRead.concat(badAiv), r => r.at + " " + r.cls + " imgs " + r.imgs + " chip \"" + r.chip + "\" src " + r.src)
          : reads.length + " readings (" + reads.filter(r => r.vis).length + " on screen), " + aiv.length + " video rows with their frames");
      check(at + " thumbnails: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- a frame that does load ----
  // Two frames answered with real images: lecture 2's a 480x360 PNG (the
  // size hqdefault is), lecture 3's a 120x90 one — the size of YouTube's grey
  // "no such video" placeholder, which it serves instead of an error. The
  // moment .loaded lands, the frame's running animations are read in that
  // same task: a fade is a CSSTransition on opacity, or it is not there.
  console.log("\nthumbnails that load, 390px light");
  const u0 = CURRICULUM.COURSES.find(c => c.id === "math110").units[0].lessons;
  const BIG = ytimg(u0[1].v), GREY = ytimg(u0[2].v);
  const bigPng = png(480, 360, [38, 84, 140]), greyPng = png(120, 90, [204, 204, 204]);
  let fadesSeen = 0;
  for (const motion of ["reduce", "no-preference"]) {
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "light", reducedMotion: motion }, "light",
      () => {
        if (window.top !== window) return;
        window.__fade = [];
        new MutationObserver(ms => ms.forEach(m => {
          const t = m.target;
          if (!t.classList || !t.classList.contains("thumb") || !t.classList.contains("loaded") || t.dataset.fadeSeen) return;
          t.dataset.fadeSeen = "1";
          const img = t.querySelector("img");
          window.__fade.push(img ? img.getAnimations().map(a => (a.transitionProperty || a.animationName || "?") + " " +
            a.effect.getComputedTiming().duration) : ["no img"]);
        })).observe(document, { subtree: true, attributes: true, attributeFilter: ["class"] });
      });
    await page.route(/^https:\/\/i\.ytimg\.com\//, r => {
      const u = r.request().url();
      if (u === BIG) return r.fulfill({ status: 200, contentType: "image/png", body: bigPng });
      if (u === GREY) return r.fulfill({ status: 200, contentType: "image/png", body: greyPng });
      return r.abort();
    });
    await page.goto(URL + "/__boot", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await go(page, "/course/math110");
    const sel = li => '#view a.grow[href="#/lesson/math110/0/' + li + '"] > .thumb';
    const landed = await page.waitForFunction(([a, b]) => {
      const x = document.querySelector(a), y = document.querySelector(b);
      return !!x && !!y && x.classList.contains("loaded") && y.classList.contains("cover");
    }, [sel(1), sel(2)], { timeout: 6000, polling: 100 }).then(() => true, () => false);
    await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished.catch(() => {}))));
    const r = await page.evaluate(([a, b]) => {
      const x = document.querySelector(a), y = document.querySelector(b), img = x && x.querySelector("img");
      const cs = img ? getComputedStyle(img) : null;
      return { cls: x ? x.className : "", img: !!img, op: cs ? cs.opacity : null, prop: cs ? cs.transitionProperty : null,
               dur: cs ? cs.transitionDuration : null, grey: y ? y.className : "", greyImgs: y ? y.querySelectorAll("img").length : -1,
               fade: window.__fade };
    }, [sel(1), sel(2)]);
    const at = "390px light, motion " + motion;
    check(at + ": a frame that loads is shown — .loaded, opacity 1", landed && /\bloaded\b/.test(r.cls) && r.img && r.op === "1",
      (landed ? "" : "did not settle; ") + r.cls + ", img " + r.img + ", opacity " + r.op);
    const fade = (r.fade || [])[0] || [];
    if (motion === "reduce") {
      check(at + ": under reduced motion it is not faded — no transition declared, none running as it lands",
        r.prop === "none" && fade.length === 0, "transition-property " + r.prop + "; running at load: " + (fade.join(", ") || "none"));
    } else {
      fadesSeen += fade.length;
      check(at + ": with motion allowed it fades in over 120ms (a running opacity transition as it lands)",
        r.prop === "opacity" && r.dur === "0.12s" && fade.length === 1 && /^opacity 120$/.test(fade[0]),
        "transition " + r.prop + " " + r.dur + "; running at load: " + (fade.join(", ") || "none"));
    }
    check(at + ": YouTube's 120x90 placeholder counts as a miss — the cover, no <img>", /\bcover\b/.test(r.grey) && r.greyImgs === 0,
      r.grey + ", imgs " + r.greyImgs);
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- covers and chips in every theme, one course per faculty ----
  const FAC_COURSES = ["math110", "ai300", "phys100", "sys250", "res400"];
  let facTexts = 0;
  for (const theme of ALL_THEMES) {
    console.log("\nthumbnail contrast, " + theme);
    const { ctx, page, errors } = await fresh(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, theme);
    await page.goto(URL + "/__boot", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await themePainted(page, theme, theme + " thumbnail contrast");
    const low = [], lowChip = [];
    let least = null, worstChip = Infinity, covers = 0, unsettled = [];
    for (const cid of FAC_COURSES) {
      await go(page, "/course/" + cid);
      if (!(await visitThumbs(page))) unsettled.push(cid);
      (await page.evaluate(thumbState)).filter(r => r.vis).forEach(r => {
        if (/\bcover\b/.test(r.cls)) covers++;
        (r.texts || []).forEach(t => {
          facTexts++;
          if (!least || t.r < least.r) least = Object.assign({ at: r.at }, t);
          if (t.r < 4.5 - 0.005) low.push(r.at + " " + t.what + " " + t.r.toFixed(2) + ":1 (" + t.fg + " on " + t.bg + ")");
        });
        if (r.chipWorst != null) { worstChip = Math.min(worstChip, r.chipWorst); if (r.chipWorst < 4.5) lowChip.push(r.at + " " + r.chipWorst.toFixed(2)); }
      });
    }
    check(theme + ": every cover's text and every chip is >= 4.5:1, on " + FAC_COURSES.length + " courses (one per faculty)",
      unsettled.length === 0 && covers > 0 && !!least && low.length === 0,
      unsettled.length ? "frames still waiting on " + unsettled.join(", ") : low.length ? low.length + " — " + low.slice(0, 3).join("; ")
        : covers + " covers, least " + least.r.toFixed(2) + ":1 (" + least.at + " " + least.what + ", " + least.fg + " on " + least.bg + ")");
    check(theme + ": the chip stays >= 4.5:1 over any picture (its fill over pure white and over pure black)",
      worstChip !== Infinity && lowChip.length === 0, lowChip.length ? lowChip.slice(0, 3).join("; ") : "worst " + worstChip.toFixed(2) + ":1");
    check(theme + " thumbnail contrast: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // =================== T-026a: the Atlas route, the Courses shelf ===================
  // loop/specs/T-026a-atlas-courses/spec.md, acceptance 1 and 2, at 1440 and
  // 390 in dark and light, on the seeded state plus a resume point. The page
  // boots on #/__test so the schedule can be asked who is running.
  const T26_W = [{ w: 1440, h: 900, mobile: false, cols: 3, shelf: 4 }, { w: 390, h: 844, mobile: true, cols: 1, shelf: 2 }];
  let t26Checks = 0;
  const c26 = (name, ok, detail) => { t26Checks++; return check(name, ok, detail); };
  const capFirst = s => s.charAt(0).toUpperCase() + s.slice(1);
  for (const theme of ["dark", "light"]) {
    for (const { w, h, mobile, cols, shelf } of T26_W) {
      const at = w + "px " + theme;
      console.log("\nT-026a Atlas and Courses, " + at);
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme, seedResume);
      await page.goto(URL + "/__test", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      const sets = await page.evaluate(t26Sets, T26_TODAY);
      const fac = id => T26_FAC[sets.faculty[id]];

      // ---- the Atlas ----
      await go(page, "/atlas");
      const a = await page.evaluate(atlasState);
      const w0 = await page.evaluate(() => window.__stateWrites);
      c26(at + " /atlas: the header is h1 \"Atlas\" and \"Your route to " + t26Month(T26_GATES[4].target, true) + ", in five gates.\"",
        a.h1 === "Atlas" && a.sub === "Your route to " + t26Month(T26_GATES[4].target, true) + ", in five gates.", a.h1 + " / " + a.sub);
      const wantNames = ["Start"].concat(T26_GATES.map(g => g.label));
      const wantWhen = [CURRICULUM.START_DATE].concat(T26_GATES.map(g => g.target)).map(d => t26Month(d));
      c26(at + " /atlas: the route has 6 nodes, Start and the five gates, each with its target month (MMM YYYY)",
        a.nodes.length === 6 && a.nodes.every((n, i) => n.name === wantNames[i] && n.when === wantWhen[i]),
        a.nodes.map(n => n.name + " " + n.when).join(", ") + " (want " + wantNames.map((n, i) => n + " " + wantWhen[i]).join(", ") + ")");
      const hx = p => p ? "#" + p.slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("") : "none";
      const isNext = n => /\bnext\b/.test(n.cls), filled = n => __same(n.bg, a.accent);
      c26(at + " /atlas: exactly one node is the next gate (gate 1, node 2), with an --accent ring and no fill",
        a.nodes.filter(isNext).length === 1 && isNext(a.nodes[1]) && __same(a.nodes[1].border, a.accent) && !filled(a.nodes[1]),
        a.nodes.map(n => n.cls.replace("rt-node", "").trim() + " bg " + hx(n.bg) + " ring " + hx(n.border)).join("; "));
      c26(at + " /atlas: the nodes before it are filled --accent, the ones after it hollow",
        a.nodes.length === 6 && filled(a.nodes[0]) && a.nodes.slice(2).every(n => !filled(n) && !__same(n.border, a.accent)),
        a.nodes.map(n => hx(n.bg)).join(", ") + " (--accent " + hx(a.accent) + ")");
      const ov = await page.evaluate(routeOverlaps);
      c26(at + " /atlas: no two of the route's text boxes overlap (6 labels and the pin)", ov.n === 7 && ov.hit.length === 0,
        ov.hit.length ? ov.hit.join("; ") : ov.n + " boxes");
      const cx = a.nodes.map(n => n.dot.l + n.dot.w / 2), cy = a.nodes.map(n => n.dot.t + n.dot.h / 2);
      if (!mobile) {
        const gaps = cx.slice(1).map((x, i) => x - cx[i]);
        c26(at + " /atlas: the track is horizontal and its six nodes are evenly spaced (centres within 1px)",
          gaps.length === 5 && gaps.every(g => g > 0) && Math.max(...gaps) - Math.min(...gaps) <= 1 && Math.max(...cy) - Math.min(...cy) <= 1,
          "gaps " + gaps.map(g => g.toFixed(1)).join(", "));
        c26(at + " /atlas: the fill runs from Start to " + (T26_FILL * 100).toFixed(2) + "% of the track (study days walked in the current segment), within 1.5px",
          a.track > 0 && a.fill != null && Math.abs(a.fill - T26_FILL * a.track) <= 1.5,
          "fill " + a.fill + "px of " + a.track + "px, want " + (T26_FILL * a.track).toFixed(1) + "px");
      } else {
        c26(at + " /atlas: under 600px the track is vertical — the nodes stacked, one above the next, in one column",
          Math.max(...cx) - Math.min(...cx) <= 1 && cy.slice(1).every((y, i) => y > cy[i]), "x " + cx.map(v => v.toFixed(0)).join(",") + "; y " + cy.map(v => v.toFixed(0)).join(","));
        c26(at + " /atlas: the vertical fill: --accent from Start to the pin, the rest of the track not",
          !!a.nodes[0].seg && __same(a.nodes[0].seg, a.accent) && a.nodes.slice(1, 5).every(n => n.seg && !__same(n.seg, a.accent)),
          a.nodes.map(n => hx(n.seg)).join(", "));
      }
      const day = t26Pos(T26_TODAY) + 1;
      c26(at + " /atlas: the pin reads \"You are here · day " + day + "\"" + (mobile ? "" : " and sits above the fill's end (its left edge within 2px)"),
        !!a.pin && a.pin.text === "You are here · day " + day &&
          (mobile || (a.pin.box.b < Math.min(...a.nodes.map(n => n.dot.t)) && Math.abs(a.pin.box.l - (cx[0] + T26_FILL * (cx[5] - cx[0]))) <= 2)),
        a.pin ? "\"" + a.pin.text + "\" at x " + a.pin.box.l.toFixed(1) + ", want " + (cx[0] + T26_FILL * (cx[5] - cx[0])).toFixed(1) : "no pin");
      const wantReq = T26_GATES[0].req.split(" · ").map(capFirst);
      c26(at + " /atlas: the next-gate card links to #/transcript, \"Next gate · 1 of 5\", Calibration, its requirements as " + wantReq.length + " chips",
        !!a.next && a.next.tag === "A" && a.next.href === "#/transcript" && a.kicker === "Next gate · 1 of 5" && a.gate === T26_GATES[0].label &&
          JSON.stringify(a.reqs) === JSON.stringify(wantReq),
        JSON.stringify({ next: a.next, kicker: a.kicker, gate: a.gate, reqs: a.reqs }));
      c26(at + " /atlas: the days number is daysBetween(" + T26_TODAY + ", " + T26_GATES[0].target + ") = " + T26_DAYS + ", worked out here",
        a.days === String(T26_DAYS), "shows " + a.days);
      const tileHrefs = a.tiles.map(t => t.href), wantHrefs = sets.running.map(id => "#/course/" + id);
      c26(at + " /atlas: one tile per running course (" + sets.running.length + ", from the schedule), each the link to its course",
        a.tiles.length === sets.running.length && JSON.stringify(tileHrefs) === JSON.stringify(wantHrefs), tileHrefs.join(" "));
      const tcols = new Set(a.tiles.map(t => Math.round(t.box.l))).size;
      c26(at + " /atlas: the tiles are " + cols + " column" + (cols === 1 ? "" : "s") + " wide", tcols === cols, tcols + " distinct columns");
      const tileBad = a.tiles.filter((t, i) => t.box.h < 44 || t.box.w < 44 || !t.ring || !/^\d+%$/.test(t.pct || "") ||
        !__same(t.col, a.fac[fac(sets.running[i])]));
      c26(at + " /atlas: every tile is >= 44x44, carries a mastery ring, and its code is in the faculty colour",
        a.tiles.length > 0 && tileBad.length === 0, tileBad.map(t => t.href + " " + t.box.w.toFixed(0) + "x" + t.box.h.toFixed(0) + " ring " + t.ring + " " + hx(t.col)).join("; ") || a.tiles.length + " tiles");
      const more = sets.later.length - 5;
      const wantChips = sets.later.slice(0, 5).map(id => "#/course/" + id).concat(more > 0 ? ["#/courses?later"] : []);
      c26(at + " /atlas: Opens later is capped at 5 chips in start order, then \"+" + more + "\" to #/courses?later",
        JSON.stringify(a.chips.map(c => c.href)) === JSON.stringify(wantChips) && (more <= 0 || a.chips[a.chips.length - 1].text === "+" + more),
        a.chips.map(c => c.text + " " + c.href).join(", "));
      c26(at + " /atlas: every chip is >= 44x44 (a control)", a.chips.length > 0 && a.chips.every(c => c.box.h >= 44 && c.box.w >= 44),
        a.chips.map(c => c.box.w.toFixed(0) + "x" + c.box.h.toFixed(0)).join(", "));
      c26(at + " /atlas: \"The rest of it\" is gone (no such text, no .glist), and \"Concept map →\" is one link under the chips",
        !a.rest && a.glist === 0 && !!a.concept && a.concept.text === "Concept map →" && /^#\/concept\//.test(a.concept.href) && a.concept.h >= 44,
        JSON.stringify({ rest: a.rest, glist: a.glist, concept: a.concept }));
      // The "+N" chip opens Courses on the Later filter.
      if (more > 0) {
        await page.click("#view .at-chip.more");
        const landed = await page.waitForFunction(() => location.hash === "#/courses?later" &&
          !!document.querySelector("#view .seg [data-shelf=later][aria-pressed=true]"), null, { timeout: 8000, polling: "raf" }).then(() => true, () => false);
        const s = landed ? await page.evaluate(coursesState) : null;
        const hrefs = s ? [].concat(...s.shelves.map(x => x.books.map(b => b.href))) : [];
        c26(at + " /atlas: \"+" + more + "\" lands on #/courses?later with Later pressed and the " + sets.later.length + " later courses on the shelf",
          landed && JSON.stringify(hrefs) === JSON.stringify(sets.later.map(id => "#/course/" + id)), landed ? hrefs.join(" ") : "did not land");
      }

      // ---- Courses ----
      await go(page, "/courses");
      let s = await page.evaluate(coursesState);
      const wantSeg = ["Now · " + sets.running.length, "Later · " + sets.later.length, "Finished · 0", "All"];
      c26(at + " /courses: the filter has 4 options — " + wantSeg.join(", ") + " — and Now is pressed",
        JSON.stringify(s.seg.map(b => b.t)) === JSON.stringify(wantSeg) && s.seg.map(b => b.on).join() === "true,false,false,false",
        s.seg.map(b => b.t + (b.on ? " (on)" : "")).join(", "));
      c26(at + " /courses: every filter option is >= 44x44", s.seg.length === 4 && s.seg.every(b => b.w >= 44 && b.h >= 44),
        s.seg.map(b => b.w.toFixed(0) + "x" + b.h.toFixed(0)).join(", "));
      const lead = s.shelves[0] && s.shelves[0].books[0];
      c26(at + " /courses: the Continue shelf leads with AI 200, the course with the stored resume point — its lecture, at 5:00",
        !!lead && s.shelves[0].head === "Continue" && lead.href === "#/lesson/ai200/0/1" && /resume at 5:00$/.test(lead.meta),
        lead ? s.shelves[0].head + ": " + lead.code + " " + lead.href + " \"" + lead.meta + "\"" : "no shelf");
      const nowHrefs = [].concat(...s.shelves.map(x => x.books.map(b => b.href.replace(/^#\/lesson\/([^/]+)\/.*/, "#/course/$1"))));
      c26(at + " /courses: Now holds every running course once (Continue, then Also running)",
        nowHrefs.length === sets.running.length && sets.running.every(id => nowHrefs.indexOf("#/course/" + id) >= 0),
        s.shelves.map(x => x.head + " " + x.books.map(b => b.code).join("/")).join("; "));
      const allBooks = [].concat(...s.shelves.map(x => x.books));
      const coverBad = allBooks.filter(b => !b.facCol || !__same(b.codeCol, b.facCol) || !__same(b.coverBg, b.coverWant, 2));
      c26(at + " /courses: every cover carries its faculty colour — the code in it, and the cover --fac at 14% over --surface",
        allBooks.length > 0 && coverBad.length === 0,
        coverBad.length ? coverBad.map(b => b.code + " code " + hx(b.codeCol) + " vs " + hx(b.facCol) + ", cover " + hx(b.coverBg) + " vs " + hx(b.coverWant && b.coverWant.map(Math.round))).join("; ") : allBooks.length + " covers");
      c26(at + " /courses: the shelves are " + shelf + " columns wide", s.shelves.length > 0 && s.shelves.every(x => x.cols === shelf),
        s.shelves.map(x => x.head + " " + x.cols).join(", "));
      c26(at + " /courses: every cover is a link >= 44x44", allBooks.every(b => b.w >= 44 && b.h >= 44),
        allBooks.map(b => b.w.toFixed(0) + "x" + b.h.toFixed(0)).join(", "));
      // The filter, clicked for real: the shelf changes and nothing is written.
      const before = await page.evaluate(() => window.__stateWrites);
      for (const [k, test] of [
        ["later", x => x.shelves.length === 1 && x.shelves[0].books.length === sets.later.length && x.shelves[0].books.every(b => b.later) &&
          JSON.stringify(x.shelves[0].books.map(b => b.href)) === JSON.stringify(sets.later.map(id => "#/course/" + id))],
        ["finished", x => x.shelves.length === 0 && x.empty === 1],
        // Every course the page has (curriculum.js plus SPCH 100 from storytelling.js),
        // the later ones dimmed and the running ones not.
        ["all", x => { const bs = [].concat(...x.shelves.map(y => y.books));
          return bs.length === sets.running.length + sets.later.length && x.shelves.length > 1 &&
            bs.every(b => b.later === (sets.later.indexOf(b.href.replace("#/course/", "")) >= 0)); }],
        ["now", x => x.shelves[0] && x.shelves[0].head === "Continue"],
      ]) {
        await page.click("#view .seg [data-shelf=" + k + "]");
        await page.waitForFunction(k => !!document.querySelector("#view .seg [data-shelf=" + k + "][aria-pressed=true]"), k, { timeout: 4000, polling: "raf" }).catch(() => {});
        s = await page.evaluate(coursesState);
        c26(at + " /courses: clicking " + capFirst(k) + " presses it alone and changes the shelf to " + k,
          s.seg.filter(b => b.on).map(b => b.k).join() === k && test(s),
          s.seg.filter(b => b.on).map(b => b.k).join() + "; " + (s.shelves.map(x => x.head + " " + x.books.length).join(", ") || s.empty + " empty"));
      }
      const after = await page.evaluate(() => window.__stateWrites);
      c26(at + " /courses: the filter is in memory — four clicks made no save() (state writes " + before + " -> " + after + ")", after === before);
      c26(at + " T-026a: nothing on /atlas or /courses wrote state (writes since /atlas " + w0 + " -> " + after + ")", after === w0);
      c26(at + " T-026a: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  // ---- gates passed: the pin past the middle, and the route complete ----
  // Review round 1: with the fill past half the track the pin hangs left of
  // its stick, and on the vertical route that hang (0,2,0) beat the reset
  // and put the pin outside the card. With all five passed, Start was marked
  // next. Gates 1-3 passed puts the fill at ~60%; all five puts it at 100%.
  const gatesSeed = passed => new Function("args",
    "if (window.top !== window) return; const s = JSON.parse(localStorage.getItem('darhikmah_v1') || '{}');" +
    "s.gates = " + JSON.stringify(Object.fromEntries(passed.map((n, i) => [n, ["2026-10-23", "2026-10-25", "2026-10-26", "2026-10-27", "2026-10-28"][i]]))) + ";" +
    "localStorage.setItem('darhikmah_v1', JSON.stringify(s));");
  for (const passed of [[1, 2, 3], [1, 2, 3, 4, 5]]) {
    for (const w of [390, 1100, 1440]) {
      const mobile = w < 861, at = w + "px gates " + passed.join(",") + " passed";
      const { ctx, page, errors } = await fresh(browser, { viewport: { width: w, height: 900 }, isMobile: mobile, hasTouch: mobile }, "dark", gatesSeed(passed));
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await go(page, "/atlas");
      const p = await page.evaluate(pinPlace), r = await page.evaluate(routeOverlaps);
      c26(at + ": the pin's text is inside the route card and overlaps no label",
        !p.err && p.inside && r.hit.length === 0 && r.n === 7,
        p.err || ("\"" + p.text + "\" " + p.p.join(",") + " in card " + p.c.join(",") + (r.hit.length ? "; overlaps " + r.hit.join("; ") : "")));
      if (passed.length === 5)
        c26(at + ": no node is the next gate, every node is passed, and the card says \"All gates passed\"",
          !p.err && p.nodes.length === 6 && p.nodes.every(c => !/\bnext\b/.test(c) && /\bdone\b/.test(c)) && p.gate === "All gates passed",
          p.err || p.nodes.join(" | ") + " / " + p.gate);
      else
        c26(at + ": gate 4 is next, and the three before it are passed",
          !p.err && /\bnext\b/.test(p.nodes[4]) && p.nodes.slice(0, 4).every(c => /\bdone\b/.test(c)) && p.nodes.filter(c => /\bnext\b/.test(c)).length === 1,
          p.err || p.nodes.join(" | "));
      c26(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  // ---- T-038: a passed gate shows "Passed d Mon"; the head is the projection ----
  // At 1440 and 390, dark and light. Then the confirm sheet on /transcript,
  // the pass for Gate 3 and the unmark for Gate 2, measured open.
  let t38Checks = 0;
  const c38 = (name, ok, detail) => { t38Checks++; return check(name, ok, detail); };
  for (const theme of ["dark", "light"]) {
    for (const { w, h, mobile } of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
      const at = w + "px " + theme + " T-038";
      console.log("\n" + at);
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme, seedT38);
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await themePainted(page, theme, at);
      await go(page, "/atlas");
      const w0 = await page.evaluate(() => window.__stateWrites);
      const a = await page.evaluate(t38Atlas);
      const want = T38_PLAN.map(g => g.done ? t38Passed(g.done) : t26Month(g.target));
      const got = a.labs.slice(1).map(l => l.when);
      c38(at + " /atlas: a passed gate shows \"Passed …\" (its date), an open one its target month: " + want.join(", "),
        a.labs.length === 6 && JSON.stringify(got) === JSON.stringify(want), got.join(", "));
      const lowLab = a.labs.filter(l => l.r < 4.5);
      c38(at + " /atlas: every route date line is >= 4.5:1", a.labs.length === 6 && lowLab.length === 0,
        a.labs.map(l => l.when + " " + l.r.toFixed(2)).join(", "));
      const wantSub = "Your route to " + t26Month(T38_ARRIVAL, true) + ", in five gates.";
      c38(at + " /atlas: the header is the projected arrival — \"" + wantSub + "\"", a.sub === wantSub, a.sub);
      const months = Math.round(T38_AHEAD / 30.44);
      const wantBase = "Plan baseline " + t26Month(T38_BASELINE, true) + " · " + months + " months ahead";
      c38(at + " /atlas: a muted line reads \"" + wantBase + "\" (" + T38_AHEAD + " days), >= 4.5:1",
        !!a.base && a.base.vis && a.base.text === wantBase && a.base.r >= 4.5, a.base ? "\"" + a.base.text + "\" " + a.base.r.toFixed(2) + ":1" : "no .at-base");
      const ov = await page.evaluate(routeOverlaps), words = await page.evaluate(labelWords), of = await page.evaluate(viewOverflow);
      c38(at + " /atlas: no route text overlaps, no label breaks mid-word, nothing overflows",
        ov.n === 7 && ov.hit.length === 0 && words.length === 0 && of.out.length === 0 && !of.side,
        [].concat(ov.hit, words, of.out, of.side ? ["page " + of.side] : []).join("; ") || ov.n + " boxes");

      await go(page, "/transcript");
      const ctl = await page.evaluate(() => [...document.querySelectorAll("#view [data-gate]")]
        .map(b => b.dataset.gateDo + " " + b.dataset.gate).filter((v, i, a) => a.indexOf(v) === i).sort().join(", "));
      c38(at + " /transcript: with Gates 1-2 passed the only gate controls are \"pass 3, unmark 2\" (the next gate, the last passed)",
        ctl === "pass 3, unmark 2", ctl || "none");
      for (const [doWhat, n, title, goText] of [["pass", 3, "Pass Gate 3 — " + T38_PLAN[2].label, "Pass gate 3"],
                                                ["unmark", 2, "Unmark Gate 2 — " + T38_PLAN[1].label, "Unmark gate 2"]]) {
        await page.evaluate(() => document.querySelectorAll("#view details.unit").forEach(d => { d.open = true; }));
        await page.click("#view [data-gate-do=" + doWhat + "][data-gate='" + n + "']");
        const opened = await page.waitForSelector("dialog.sheet[open]", { timeout: 4000 }).then(() => true, () => false);
        await page.evaluate(() => Promise.all(document.getAnimations().map(x => x.finished.catch(() => {}))));
        const sh = opened ? await page.evaluate(t38Sheet) : null;
        if (!c38(at + " /transcript: the " + doWhat + " sheet for Gate " + n + " opens (\"" + title + "\")", !!sh && sh.title === title, sh ? sh.title : "no sheet")) continue;
        c38(at + " " + doWhat + " sheet: inside the screen, no sideways scroll" + (mobile ? ", on the bottom edge" : ""),
          sh.box[0] >= -0.5 && sh.box[1] >= -0.5 && sh.box[2] <= sh.vw + 0.5 && sh.box[3] <= sh.vh + 0.5 && !sh.sideways && (!mobile || Math.abs(sh.box[3] - sh.vh) <= 0.5),
          sh.box.join(",") + " in " + sh.vw + "x" + sh.vh + (sh.sideways ? ", scrolls sideways" : ""));
        c38(at + " " + doWhat + " sheet: every text is >= 4.5:1 and nothing else on screen is over it",
          sh.texts > 0 && sh.low.length === 0 && sh.covered.length === 0,
          sh.low.concat(sh.covered).join("; ") || sh.texts + " texts, least " + sh.least.toFixed(2) + ":1");
        const small = sh.controls.filter(c => c.w < 44 || c.h < 44 || !c.hit);
        c38(at + " " + doWhat + " sheet: every control (" + (doWhat === "pass" ? "each requirement, " : "") + "Cancel, " + goText + ") is >= 44x44 and on top at its centre",
          sh.controls.length >= 2 && small.length === 0, small.map(c => c.name + " " + c.w.toFixed(0) + "x" + c.h.toFixed(0) + (c.hit ? "" : " covered")).join("; ") || sh.controls.length + " controls");
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("dialog.sheet"), null, { timeout: 4000 }).catch(() => {});
      }
      const w1 = await page.evaluate(() => window.__stateWrites);
      c38(at + ": drawing /atlas and /transcript and opening both sheets wrote nothing (writes " + w0 + " -> " + w1 + ")", w1 === w0);
      c38(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  // ---- T-038: the head when nothing is passed, when all five are, and when a
  // gate was passed late; and the labels read eight hours west of UTC ----
  // The arrival is the projection: with Gate 5 passed it is Gate 5's date, not
  // its target. On the baseline there is no line; passed late it says behind.
  const t38Seed = gates => new Function("args", "if (window.top !== window) return; const s = JSON.parse(localStorage.getItem('darhikmah_v1') || '{}');" +
    "s.gates = " + JSON.stringify(gates) + "; localStorage.setItem('darhikmah_v1', JSON.stringify(s));");
  const t38Obj = done => Object.fromEntries(Object.keys(done).map(n => [n, { date: done[n], at: done[n] + "T08:00:00.000Z", passed: true }]));
  const T38_ALL = { 1: "2026-10-21", 2: "2026-10-26", 3: "2026-10-27", 4: "2026-10-28", 5: "2026-10-30" };
  for (const fx of [
    { name: "no gate passed", done: {}, seed: t38Seed({}) },
    { name: "all five passed", done: T38_ALL, seed: t38Seed(t38Obj(T38_ALL)) },
    { name: "Gate 1 passed late (15 Jan 2027)", done: { 1: "2027-01-15" }, seed: t38Seed(t38Obj({ 1: "2027-01-15" })) },
    { name: "Gates 1-2 passed, America/Los_Angeles", done: T38_DONE, seed: seedT38, tz: "America/Los_Angeles" },
  ]) {
    for (const [w, theme] of [[1440, "dark"], [390, "light"]]) {
      const mobile = w < 861, at = w + "px " + theme + " T-038 " + fx.name;
      const { ctx, page, errors } = await fresh(browser, Object.assign({ viewport: { width: w, height: 900 }, isMobile: mobile, hasTouch: mobile, colorScheme: theme },
        fx.tz ? { timezoneId: fx.tz } : {}), theme, fx.seed);
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await go(page, "/atlas");
      const a = await page.evaluate(t38Atlas);
      const plan = t38PlanOf(fx.done), arrival = plan[4].done || plan[4].target;
      const days = Math.round((Date.parse(T38_BASELINE) - Date.parse(arrival)) / 86400000);
      const wantLabs = plan.map(g => g.done ? t38Passed(g.done) : t26Month(g.target)), gotLabs = a.labs.slice(1).map(l => l.when);
      const wantSub = "Your route to " + t26Month(arrival, true) + ", in five gates.";
      const wantBase = days ? "Plan baseline " + t26Month(T38_BASELINE, true) + " \u00b7 " + t38Words(days) : null;
      c38(at + ": labels " + wantLabs.join(", ") + "; \"" + wantSub + "\"; " + (wantBase ? "\"" + wantBase + "\" (" + days + " days)" : "no baseline line (on the baseline)"),
        JSON.stringify(gotLabs) === JSON.stringify(wantLabs) && a.sub === wantSub &&
          (wantBase ? !!a.base && a.base.vis && a.base.text === wantBase && a.base.r >= 4.5 : !a.base),
        gotLabs.join(", ") + "; " + a.sub + "; " + (a.base ? "\"" + a.base.text + "\" " + a.base.r.toFixed(2) + ":1" : "no line"));
      c38(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  // ---- Continue orders by the reader's own date, not UTC's ----
  // Review round 1: posAt is a UTC timestamp and doneAt a local date. In
  // Bahrain (UTC+3) at 02:00 on 2 Nov, a lecture watched that day and a
  // lecture paused at 23:00Z on 1 Nov are the same day; compared raw,
  // "2026-11-02" beat "2026-11-01T23:00:00.000Z" and MATH 110 led. On the
  // same day the live resume point leads.
  for (const w of [1440, 390]) {
    const mobile = w < 861, at = w + "px Asia/Bahrain 2 Nov 02:00";
    const ctx = await browser.newContext({ timezoneId: "Asia/Bahrain", reducedMotion: "reduce", viewport: { width: w, height: 900 }, isMobile: mobile, hasTouch: mobile });
    await ctx.clock.setFixedTime(new Date("2026-11-01T23:00:00Z"));
    await ctx.route(/^https?:/, r => { if (/api\.github\.com/.test(r.request().url())) githubHits++; return r.abort(); });
    await ctx.addInitScript(() => {
      if (window.top !== window) return;
      localStorage.setItem("darhikmah_v1", JSON.stringify({ settings: { theme: "dark", themeNavyOnce: true }, studyDays: [], lessons: {
        "math110.0.0": { done: true, doneAt: "2026-11-02", notes: "", checks: [] },
        "ai200.0.1": { done: false, notes: "", checks: [], pos: 300, posAt: "2026-11-01T23:00:00.000Z" } } }));
    });
    await ctx.addInitScript(countWrites);
    await ctx.addInitScript(installHelpers);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(URL + "/__boot", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await go(page, "/courses");
    const s = await page.evaluate(coursesState);
    const lead = s.shelves[0] && s.shelves[0].books[0];
    c26(at + ": Continue leads with AI 200 (paused 02:00 local) over MATH 110 (watched the same local day)",
      !!lead && s.shelves[0].head === "Continue" && lead.href === "#/lesson/ai200/0/1" && /resume at 5:00$/.test(lead.meta),
      s.shelves[0] ? s.shelves[0].head + ": " + s.shelves[0].books.map(b => b.code + " \"" + b.meta + "\"").join(", ") : "no shelf");
    c26(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // ---- no overflow and no overlap, every filter, phone to desktop, two text sizes ----
  // verify-clip sweeps /atlas and /courses (Now); the Later, Finished and All
  // shelves only exist after a click, so they are swept here. 1100 is the
  // narrowest column with three tiles and three covers across (the sidebar and
  // the rail both showing), where the first build squeezed a tile's code into
  // 29px at a 24px root.
  // 640 and 1280 are where the first breakpoint (32rem) left a sixth of the
  // horizontal track narrower than "Calibration" (review round 1).
  // 376, 1038, 1132, 1178 and 1372 are where a shelf track landed between a
  // 6.75rem column floor and "Mathematics" (6.81rem in .bk-t), so Later and
  // All broke it "Mathematic/s": 1132 at a 16px root, the rest at 24px (T-031;
  // a 2px sweep, 320 to 1440 at roots 16, 20 and 24). With the floor back at
  // 6.75rem (plant a) this sweep fails at roots 16 and 24. The same floor
  // also broke it at a 20px root (322, 1088 and 1252); this sweep has no 20px
  // root, so those bands are not asked here (the 2px sweep found 0 after the
  // fix).
  const T26_OW = [320, 376, 390, 640, 768, 1038, 1100, 1132, 1178, 1280, 1372, 1440];
  for (const root of [16, 24]) {
    for (const w of T26_OW) {
      const mobile = w < 861;
      const { ctx, page, errors } = await fresh(browser, { viewport: { width: w, height: 900 }, isMobile: mobile, hasTouch: mobile }, "light", seedResume);
      await ctx.addInitScript(rt => { document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.fontSize = rt + "px"; }); }, root);
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      const bad = [];
      await go(page, "/atlas");
      const rootNow = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
      if (rootNow !== root + "px") bad.push("root font is " + rootNow + ", asked for " + root + "px");
      const o = await page.evaluate(viewOverflow), r = await page.evaluate(routeOverlaps);
      if (o.out.length || o.side) bad.push("/atlas " + o.out.concat(o.side ? ["page " + o.side] : []).join(", "));
      if (r.hit.length || r.n !== 7) bad.push("/atlas route text overlaps: " + (r.hit.join("; ") || r.n + " boxes"));
      const lw = await page.evaluate(labelWords);
      if (lw.length) bad.push("/atlas a route label or next-gate text breaks mid-word: " + lw.join("; "));
      await go(page, "/courses");
      for (const k of ["now", "later", "finished", "all"]) {
        await page.click("#view .seg [data-shelf=" + k + "]");
        await page.waitForFunction(k => !!document.querySelector("#view .seg [data-shelf=" + k + "][aria-pressed=true]"), k, { timeout: 4000, polling: "raf" }).catch(() => {});
        const q = await page.evaluate(viewOverflow);
        if (q.out.length || q.side) bad.push("/courses " + k + " " + q.out.concat(q.side ? ["page " + q.side] : []).join(", "));
        // A cover's code and a book's title, the same question (review round 2:
        // two columns at 320 and a 24px root broke "Probabilit/y").
        const bw = await page.evaluate(labelWords, "#view .bk-t, #view .cv-code");
        if (bw.length) bad.push("/courses " + k + " a book title or code breaks mid-word: " + bw.join("; "));
      }
      c26(w + "px root " + root + "px: /atlas and every Courses filter — nothing wider than its box, no sideways scroll, no route text overlapping, no word broken in a route label, the next-gate card or a book",
        bad.length === 0 && errors.length === 0, bad.concat(errors).join(" | ") || "5 views");
      await ctx.close();
    }
  }
  // ---- the days beside the text: a phone at the default size, 3 digits ----
  // T-031: a 14rem basis on .at-main put a 3-digit count of days under the
  // chips at 390 and a 16px root. Beside means right of the text column and
  // starting above its foot, so on the same flex line; a wrapped count
  // starts at or below it.
  {
    const { ctx, page, errors } = await fresh(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, "light", seedGate1);
    await page.goto(URL + "/__boot", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await go(page, "/atlas");
    const d = await page.evaluate(() => {
      const main = document.querySelector("#view .at-next .at-main"), days = document.querySelector("#view .at-next .at-days");
      if (!main || !days) return null;
      const m = main.getBoundingClientRect(), b = days.getBoundingClientRect();
      return { n: days.querySelector("b").textContent, root: getComputedStyle(document.documentElement).fontSize,
               m: [m.left, m.top, m.right, m.bottom].map(v => +v.toFixed(1)), b: [b.left, b.top, b.right, b.bottom].map(v => +v.toFixed(1)) };
    });
    c26("390px root 16px: /atlas, a 3-digit count of days to the next gate shares the text's line (right of it, not under the chips)",
      !!d && d.root === "16px" && /^\d{3}$/.test(d.n) && d.b[0] >= d.m[2] - 0.5 && d.b[1] < d.m[3] - 0.5,
      d ? "root " + d.root + ", \"" + d.n + "\" at " + d.b.join(",") + "; the text at " + d.m.join(",") : "no next-gate card");
    c26("390px root 16px, a 3-digit count: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // ---- every next gate: no word on /atlas broken mid-word ----
  // T-031 review round 1: the sweep above only ever has Gate 1 next. With
  // Gates 1-2 passed, the 12rem basis put the days beside a 192px text column
  // at 373-374px (root 16) and broke Gate 3's chip "6+ paper
  // reimplementation/s" while every check stayed green. So each next gate in
  // turn, at the sweep's widths plus 358 (where the days first sit beside the
  // text with 2 digits) and 373 and 374 (3 digits). One context per gate,
  // root and phone-or-desktop, resized width to width.
  const T31_WIDTHS = T26_OW.concat([358, 373, 374]).sort((a, b) => a - b);
  for (let k = 1; k <= T26_GATES.length; k++) {
    const passed = {};
    for (let g = 1; g < k; g++) passed[g] = ["2026-10-23", "2026-10-25", "2026-10-26", "2026-10-27"][g - 1];   // plan days 7-10 (were 12-15 Oct before reset seven)
    for (const root of [16, 24]) {
      const bad = [], errs = [], seen = new Set();
      for (const mobile of [true, false]) {
        const ws = T31_WIDTHS.filter(w => (w < 861) === mobile);
        const { ctx, page, errors } = await fresh(browser, { viewport: { width: ws[0], height: 900 }, isMobile: mobile, hasTouch: mobile }, "light");
        await ctx.addInitScript(g => {
          if (window.top !== window) return;
          const s = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
          s.gates = g;
          localStorage.setItem("darhikmah_v1", JSON.stringify(s));
        }, passed);
        await ctx.addInitScript(rt => { document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.fontSize = rt + "px"; }); }, root);
        await page.goto(URL + "/__boot", { waitUntil: "load" });
        await page.waitForSelector("#view > *");
        await go(page, "/atlas");
        for (const w of ws) {
          await page.setViewportSize({ width: w, height: 900 });
          await page.waitForFunction(w => window.innerWidth === w, w, { timeout: 4000, polling: "raf" });
          // A resize starts transitions (.main's padding, as the rail comes and
          // goes), and in their first frame the column is still the old width:
          // read there, "Calibratio/n" broke at 768, 1372 and 1440, and never on
          // a fresh load. So two frames for them to start, then until they end.
          await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
            .then(() => Promise.all(document.getAnimations()
              .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity)
              .map(a => a.finished.catch(() => {})))));
          const s = await page.evaluate(() => ({ root: getComputedStyle(document.documentElement).fontSize,
            gate: (document.querySelector("#view .at-next .at-gate") || {}).textContent || "" }));
          seen.add(s.gate);
          if (s.root !== root + "px") bad.push(w + "px: root font is " + s.root);
          const lw = await page.evaluate(labelWords);
          if (lw.length) bad.push(w + "px: " + lw.join("; "));
        }
        errs.push(...errors);
        await ctx.close();
      }
      const want = T26_GATES[k - 1].label;
      c26("/atlas, Gate " + k + " next (" + want + "), root " + root + "px: no route label, next-gate title or chip broken mid-word at " + T31_WIDTHS.join(", ") + "px",
        bad.length === 0 && errs.length === 0 && seen.size === 1 && seen.has(want),
        bad.concat(errs).join(" | ") || (seen.size === 1 && seen.has(want) ? T31_WIDTHS.length + " widths" : "the card names " + [...seen].join(", ")));
    }
  }

  // =================== T-026b: Problems, Exams and Proof ===================
  // loop/specs/T-026b-problems-exams-proof/spec.md, acceptance 1 and 2: at
  // 1440x900 and 390x844 in dark and light on the seed (plus a six-entry
  // chain), then one state at a time for what the seed cannot show — labs
  // and problem sets done, an exam passed, every bank open, Gate 1 passed (a
  // bank leads), a short chain reaching genesis after a streak reset, day 1
  // (nothing watched: every bank locked), and a Saturday. Each page boots on
  // #/__test so streak(), bestStreak() and studyIndex() can be asked.
  let t26bChecks = 0;
  const c26b = (name, ok, detail) => { t26bChecks++; return check(name, ok, detail); };
  const T26B_SAT = new Date("2026-10-24T12:00:00Z");                     // a Saturday: the rest day
  const T26B_DAY1 = new Date(CURRICULUM.START_DATE + "T12:00:00Z");      // day 1, nothing stored
  const isoOf = d => d.toISOString().slice(0, 10);                       // the contexts run in UTC
  const PSET_IDS = (() => {
    const vm = require("vm"), sb = { window: {} };
    sb.window.DAR = sb.DAR = {};
    vm.createContext(sb);
    vm.runInContext(fs.readFileSync(path.join(ROOT, "platform/data/workshop.js"), "utf8"), sb);
    return [].concat(...sb.window.DAR.PSETS.map(g => g.items.map(i => i.id)));
  })();
  async function t26bFresh(o) {
    const now = o.now || FIXED_NOW;
    const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: o.motion || "reduce", viewport: { width: o.w, height: o.h },
      isMobile: o.mobile, hasTouch: o.mobile, colorScheme: o.theme });
    await ctx.clock.setFixedTime(now);
    await ctx.route(/^https?:/, r => { const u = r.request().url(); requests.push(u); if (/api\.github\.com/.test(u)) githubHits++; return r.abort(); });
    if (o.empty) await ctx.addInitScript(t => { if (window.top === window) localStorage.setItem("darhikmah_v1", JSON.stringify({ settings: { theme: t, themeNavyOnce: true } })); }, o.theme);
    else await ctx.addInitScript(seed, [now.getTime(), o.theme]);
    if (o.patch) await ctx.addInitScript(t26bPatch(o.patch), [now.getTime()]);
    await ctx.addInitScript(countWrites);
    await ctx.addInitScript(installHelpers);
    if (o.root) await ctx.addInitScript(rt => { document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.fontSize = rt + "px"; }); }, o.root);
    const page = await ctx.newPage();
    const errors = [], dialogs = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("dialog", d => { dialogs.push(d.message()); d.dismiss().catch(() => {}); });
    await page.goto(URL + "/__test", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    return { ctx, page, errors, dialogs, today: isoOf(now) };
  }
  const writesNow = page => page.evaluate(() => window.__stateWrites);
  const headOk = (p, route) => p.head.h1 === T26B_HEAD[route][0] && p.head.sub === T26B_HEAD[route][1];
  const inView = (p, f) => p.scrollY === 0 && !!f && f.t >= p.top - 0.5 && f.b <= p.floor + 0.5;
  const where = f => f ? f.text + " at " + f.t.toFixed(0) + "-" + f.b.toFixed(0) : "none";

  // T-045 replaced the page T-026b measured here (the mode cards, the
  // phase's lab list and their Opens): what stays is the header, the one
  // filled primary inside the first viewport, and that reading the page
  // writes nothing. The rest is T-045's own check, on every state.
  const T45_HOW = [["Lecture quiz", "After every lecture. Pass it to count the lecture and open the next one."],
    ["Problem set", "Unlocks when you finish a unit. Pen and paper, checked against the course’s solutions."],
    ["Lab", "A build project, one or two per phase. Done when it’s on GitHub and meets its checklist."]];
  const T45_ORDER = ["quiz", "catchup", "pset", "lab", "review"];
  // A lab's description is its first clause, at most ~50 characters, cut
  // only at the end of a word (T-026b's rule; T-045's due rows use it too).
  // Returns true when `desc` breaks it against the lab's `req`.
  const clauseBad = (desc, req) => {
    if (!desc || !req) return true;
    const d = desc.replace(/…$/, ""), cut = d !== desc;
    const next = req.charAt(d.length);
    return desc.length > 51 || !d.length || req.indexOf(d) !== 0 || /[;,]/.test(d) || /[A-Za-z0-9]/.test(next) ||
      (!cut && !/^([;,:.]|\s—|$)/.test(req.slice(d.length)));
  };
  async function t45Check(page, at, o, chk) {
    const p = await page.evaluate(t26bPrimary), m = await page.evaluate(t45Problems);
    chk(at + " /workshop: the header is h1 \"Problems\" and \"" + T26B_HEAD["/workshop"][1] + "\"", headOk(p, "/workshop"), JSON.stringify(p.head));
    const key = r => r.due + ":" + r.id;
    const got = m.rows.map(key), want = m.want.map(key);
    const sorted = (a, b) => a.slice().sort().join() === b.slice().sort().join();
    const ordered = m.rows.every((r, i) => i === 0 || T45_ORDER.indexOf(m.rows[i - 1].due) <= T45_ORDER.indexOf(r.due));
    chk(at + " /workshop: \"Due now\" lists exactly what is due — quizzes waiting, then catch-up, then psets whose lecture is cleared, then labs cleared AND in phase (" + m.phase + "), then the review — and its count says so",
      sorted(got, want) && ordered && m.count === String(m.want.length), "shows [" + got.join(", ") + "], want [" + want.join(", ") + "], count " + m.count);
    const bad = m.rows.map(r => {
      const w = m.want.find(x => key(x) === key(r)); if (!w) return null;
      const why = w.due === "lab" ? !!r.why && r.why.endsWith(w.tail) && !clauseBad(r.why.slice(0, -w.tail.length), w.req) : r.why === w.why;
      const ok = r.title === w.title && r.tag === w.tag && why && r.go === w.go && (!w.href || r.href === w.href) && r.visible && r.goW >= 44 && r.goH >= 44 && r.rowH >= 44;
      return ok ? null : JSON.stringify(r) + " want " + JSON.stringify(w);
    }).filter(Boolean);
    chk(at + " /workshop: each due row has its title, its tag, its why-line and its action (Take it / Open / Start), the action and the row >= 44px",
      bad.length === 0, bad.join(" | ") || m.rows.map(r => r.tag + " \"" + r.why + "\"").join("; ") || "no rows");
    // t26bPrimary reads <a>/<button>; a row's action is a span painted like
    // a button inside the row (the row is the link), so both are counted.
    const filled = p.filled.map(f => f.text).concat(m.rows.filter(r => r.filled).map(r => r.go));
    chk(at + " /workshop: at most one filled primary, and it is the first row's action", filled.length <= 1 && (m.rows.length ? m.rows[0].filled : true),
      (filled.join(" | ") || "none") + (m.rows[0] ? ", first row " + m.rows[0].go + (m.rows[0].filled ? " filled" : "") : ""));
    if (m.rows.length) chk(at + " /workshop: the primary is inside the first viewport", inView(p, m.rows[0]), where(m.rows[0]) + ", room " + p.top.toFixed(0) + "-" + p.floor.toFixed(0));
    chk(at + " /workshop: the empty state shows exactly when nothing is due: \"Nothing due. Your next lecture is ‹title›.\" with a link",
      m.want.length ? !m.empty : !!m.empty && /^Nothing due\. Your next lecture is .+\.$/.test(m.empty.text) && /^#\/(lesson\/|courses)/.test(m.empty.href || ""),
      JSON.stringify(m.empty));
    chk(at + " /workshop: \"How this works\" is three columns — Lecture quiz, Problem set, Lab — in the mockup's words",
      m.how.length === 3 && m.how.every((h, i) => h.b === T45_HOW[i][0] && h.text === T45_HOW[i][0] + T45_HOW[i][1]) && m.howCols === (o.w >= 861 ? 3 : 1),
      m.how.map(h => h.b).join(" | ") + ", " + m.howCols + " column(s)");
    chk(at + " /workshop: \"Coming up\" has 3 rows or fewer, each still locked and reading \"After lecture n · ‹title›\"",
      m.soon.length <= 3 && m.soonOk.length === 0, m.soon.length + " rows" + (m.soonOk.length ? "; " + m.soonOk.join("; ") : ": " + m.soon.map(r => r.meta).join(" | ")));
    chk(at + " /workshop: the catalogue is behind a closed \"Everything\" disclosure, and the mode cards are gone",
      !!m.all && !m.all.open && m.all.sum === "Everything" && m.oldModes === 0, JSON.stringify(m.all) + ", " + m.oldModes + " mode cards");
    return m;
  }
  async function t26bProblems(page, at, o) {
    await go(page, "/workshop");
    await t45Check(page, at, o, c26b);
    // Review r1, finding 1: the catalogue still ships, behind "Everything".
    // Opened as a reader would, by pressing its summary, then measured with
    // T-026b's own checks.
    await page.click("#view details#pbAll > summary");
    await page.waitForFunction(() => { const d = document.querySelector("#view details#pbAll"); return !!d && d.open; }, null, { timeout: 4000 }).catch(() => {});
    const m = await page.evaluate(t26bWorkshop);
    c26b(at + " /workshop: pressing \"Everything\" opens the catalogue", m.allOpen);
    c26b(at + " /workshop: the stat box is gone (no .onecounts in the view)", m.statBox === 0, m.statBox + " found");
    c26b(at + " /workshop: \"This phase’s labs\" heads the catalogue's list, its meta the phase (" + m.phaseName + ")",
      !!m.head && m.head.t === "This phase’s labs" && m.head.meta === m.phaseName, JSON.stringify(m.head));
    const rowsOk = m.rows.length === m.want.rows.length && m.rows.every((r, i) => {
      const w = m.want.rows[i];
      return r.id === w.id && r.title === w.title && r.hours === "~" + w.hours + " h" && r.checked === w.done && r.box && r.h >= 44;
    });
    c26b(at + " /workshop: the list has one row per lab of phase " + m.phase + " (" + m.want.rows.length + "), in order — a checkbox, the title, ~N h, ticked as stored, >= 44px",
      m.want.rows.length > 0 && rowsOk, m.rows.map(r => r.id + " \"" + r.title + "\" " + r.hours + (r.checked ? " [x]" : " [ ]") + " " + r.h.toFixed(0) + "px").join("; "));
    const descBad = m.rows.filter((r, i) => { const w = m.want.rows[i]; return !w || clauseBad(r.desc, w.req); });
    c26b(at + " /workshop: each row's description is its lab's first clause, at most ~50 characters, cut only at the end of a word",
      m.rows.length > 0 && descBad.length === 0, (descBad.length ? "bad: " : "") + (descBad.length ? descBad : m.rows).map(r => "\"" + r.desc + "\"").join("; "));
    c26b(at + " /workshop: the problem sets" + (m.phase === 3 ? "" : " and the other phases' labs") + " stay behind their folds, under the list",
      m.setsFold && m.otherFold.indexOf("Problem sets — pen and paper") >= 0 && (m.phase === 3 || m.otherFold.indexOf("Labs in the other phases") >= 0) &&
        m.under.length >= 1 && m.under.every(u => u.below),
      m.otherFold.join(" | ") + "; " + JSON.stringify(m.under));
  }

  async function t26bExamsCheck(page, at, o) {
    await go(page, "/exams");
    const p = await page.evaluate(t26bPrimary), m = await page.evaluate(t26bExams), L = m.want.lead;
    c26b(at + " /exams: the header is h1 \"Exams\" and \"" + T26B_HEAD["/exams"][1] + "\"", headOk(p, "/exams"), JSON.stringify(p.head));
    c26b(at + " /exams: the record is one muted line under it: \"" + m.want.rec + "\"", m.rec === m.want.rec, "shows \"" + m.rec + "\"");
    if (!L || !m.hero) { c26b(at + " /exams: the hero exists for the exam to sit next", !!L && !!m.hero, "lead " + JSON.stringify(L)); return; }
    const wantTag = (L.code || "") + (L.gate ? " · Gate 1" : "");
    c26b(at + " /exams: the hero's tag is \"" + wantTag + "\" in the course's faculty colour",
      m.hero.tag === wantTag && __same(m.hero.tagCol, L.fac), "\"" + m.hero.tag + "\"");
    c26b(at + " /exams: the hero is \"" + L.title + "\" with its facts — " + L.facts.join(", "),
      m.hero.title === L.title && JSON.stringify(m.hero.facts) === JSON.stringify(L.facts), "\"" + m.hero.title + "\": " + m.hero.facts.join(", "));
    const got = m.hero.bar && m.hero.bar.track ? m.hero.bar.fill / m.hero.bar.track * 100 : null;
    c26b(at + " /exams: the readiness bar is the course's lectures watched (on the tracker, problems solved) over all of them (" + (L.pct == null ? "none" : L.pct.toFixed(2) + "%") + ") within 1%, in the faculty colour",
      L.pct == null ? !m.hero.bar : got != null && Math.abs(got - L.pct) <= 1 && __same(m.hero.bar.col, L.fac),
      got == null ? "no bar" : got.toFixed(2) + "% of a " + m.hero.bar.track.toFixed(0) + "px track");
    const days = L.gate ? Math.max(0, Math.round((Date.parse(T26_GATES[0].target) - Date.parse(o.today)) / 86400000)) : null;
    c26b(at + " /exams: " + (L.gate ? "the big number is the days to Gate 1 (" + days + ", from " + o.today + " to " + T26_GATES[0].target + ")" : "no gate applies, so no days number"),
      L.gate ? m.hero.days === String(days) && m.hero.daysLabel === "days to the gate" : m.hero.days === null, "shows " + m.hero.days);
    const f = p.filled[0];
    c26b(at + " /exams: \"Sit it\" is the one filled primary, to " + L.href, p.filled.length === 1 && f.text === "Sit it" && f.href === L.href && !!m.hero.sit && m.hero.sit.filled,
      p.filled.map(x => "\"" + x.text + "\" " + x.href).join("; ") || "no filled button");
    c26b(at + " /exams: the primary is inside the first viewport (under the bar, above the tab bar and the Next bar)", inView(p, f),
      where(f) + ", room " + p.top.toFixed(0) + "-" + p.floor.toFixed(0));
    const hrefs = m.open.map(c => c.href).sort();
    const cardBad = m.open.filter(c => !c.title || c.tag + " | " + c.meta !== m.want.cards[c.href]);
    c26b(at + " /exams: \"Also open\" is one card per other open exam (" + m.want.open.length + "), each with a title, its course tag and, exactly, its minutes or the questions a sitting serves, and its pass mark",
      JSON.stringify(hrefs) === JSON.stringify(m.want.open) && cardBad.length === 0,
      (cardBad.length ? "wrong: " + cardBad.map(c => c.href + " \"" + c.tag + " | " + c.meta + "\" (want \"" + m.want.cards[c.href] + "\")").join("; ")
        : m.open.map(c => c.tag + " / " + c.title + " / " + c.meta).join("; ")) + (JSON.stringify(hrefs) === JSON.stringify(m.want.open) ? "" : " (want " + m.want.open.join(" ") + ")"));
    if (o.cols && m.open.length) {
      const cols = new Set(m.open.map(c => c.left)).size, want = Math.min(o.cols, m.open.length);
      c26b(at + " /exams: the also-open cards are " + want + " column" + (want === 1 ? "" : "s") + " wide", cols === want, cols + " distinct columns");
    }
    const Lk = m.want.locked, shown = m.lockRows.filter(r => r.shown);
    c26b(at + " /exams: \"Unlock by watching\" shows " + Math.min(6, Lk.length) + " of the " + Lk.length + " locked banks" + (Lk.length > 6 ? ", then \"+" + (Lk.length - 6) + " more\"" : ", and no \"+N\""),
      m.lockRows.length === Lk.length && shown.length === Math.min(6, Lk.length) && m.lockRows.every((r, i) => r.shown === i < 6) &&
        (Lk.length > 6 ? !!m.more && m.more.text === "+" + (Lk.length - 6) + " more" && m.more.w >= 44 && m.more.h >= 44 : !m.more),
      shown.length + " shown of " + m.lockRows.length + (m.more ? ", \"" + m.more.text + "\"" : ""));
    // A row past the sixth is hidden until "+N more", so its bar is measured
    // after the click below; every shown row is measured here.
    const lockBad = (rows, wantAll) => rows.filter((r, i) => !Lk[i] || r.name !== Lk[i].name || !r.lock ||
      ((r.shown || wantAll) && (!r.bar || !r.bar.track || Math.abs(r.bar.fill / r.bar.track * 100 - Lk[i].pct) > 1 || r.h < 44)));
    const lockText = rows => rows.map((r, i) => r.name + " " + (r.bar && r.bar.track ? (r.bar.fill / r.bar.track * 100).toFixed(1) + "%" : "(hidden)") +
      " (want " + (Lk[i] ? Lk[i].name + " " + Lk[i].pct.toFixed(1) : "-") + "%)").join("; ") || "no locked banks";
    c26b(at + " /exams: each locked row is a lock and the short name, and each shown one a bar of its course's lectures watched (within 1%), >= 44px tall",
      lockBad(m.lockRows, false).length === 0, lockText(m.lockRows));
    if (o.lockedWatched)
      c26b(at + " /exams: this state can fail the bar check — a shown locked bank's course has lectures watched (" + Lk.filter(l => l.pct > 1).map(l => l.name + " " + l.pct.toFixed(1) + "%").join(", ") + ")",
        Lk.some((l, i) => l.pct > 1 && i < 6));
    if (o.cols === 3 && shown.length > 1) {
      const cols = new Set(shown.map(r => r.left)).size;
      c26b(at + " /exams: the locked rows are 2 columns wide", cols === 2, cols + " distinct columns");
    }
    c26b(at + " /exams: no .glist is left on the page (the Record rows are the line under the header)", m.glist === 0, m.glist + " found");
    if (o.click && m.more) {
      const w0 = await writesNow(page);
      await page.click("#view .ex-more");
      await page.waitForFunction(() => !document.querySelector("#view .ex-more"), null, { timeout: 4000, polling: "raf" }).catch(() => {});
      const m2 = await page.evaluate(t26bExams), w1 = await writesNow(page);
      c26b(at + " /exams: \"+" + (Lk.length - 6) + " more\" shows all " + Lk.length + " in place, each bar measured as above, in memory (state writes " + w0 + " -> " + w1 + ")",
        m2.lockRows.length === Lk.length && m2.lockRows.every(r => r.shown) && !m2.more && w1 === w0 && lockBad(m2.lockRows, true).length === 0,
        m2.lockRows.filter(r => r.shown).length + " shown; " + lockText(m2.lockRows));
    }
  }

  async function t26bRecordCheck(page, at, o, dialogs) {
    await go(page, "/record");
    const p = await page.evaluate(t26bPrimary), m = await page.evaluate(t26bRecord);
    c26b(at + " /record: the header is h1 \"Proof\" and \"" + T26B_HEAD["/record"][1] + "\"", headOk(p, "/record"), JSON.stringify(p.head));
    const want = [String(m.want.streak), String(m.want.best), String(m.want.proven)];
    c26b(at + " /record: three tiles — streak() " + want[0] + ", bestStreak() " + want[1] + ", lectures proven " + want[2],
      JSON.stringify(m.tiles.map(t => t.n)) === JSON.stringify(want) &&
        JSON.stringify(m.tiles.map(t => t.label)) === JSON.stringify(["day streak", "longest streak", "lectures proven"]),
      m.tiles.map(t => t.n + " " + t.label).join(", "));
    const rest = m.restDow;
    const study = m.cols.reduce((a, c) => a + c.filter((_, d) => d !== rest).length, 0);
    const satLevel = m.cols.map(c => c[rest]).filter(k => k && !/^(rest|void)/.test(k));
    c26b(at + " /record: the heatmap is the last 26 weeks in weekday rows — 26x6 = 156 study-day cells — and every Saturday is drawn as today (rest, or void outside the plan), never a level",
      m.cols.length === 26 && m.cols.every(c => c.length === 7) && study === 156 && satLevel.length === 0,
      m.cols.length + " columns, " + study + " study-day cells" + (satLevel.length ? "; Saturdays painted " + satLevel.slice(0, 4).join(", ") : ""));
    const diff = [];
    m.want.cells.forEach((c, w) => c.forEach((k, d) => { if (!m.cols[w] || m.cols[w][d] !== k) diff.push(k + " drawn " + (m.cols[w] ? m.cols[w][d] : "-")); }));
    c26b(at + " /record: every cell is what the existing logic says — the day's lessons, problems and seal as its level, a rest day hollow, outside the plan void",
      diff.length === 0, diff.length ? diff.length + " differ, e.g. " + diff.slice(0, 3).join("; ") : "182 cells");
    c26b(at + " /record: the heatmap fits its card (no sideways scroll), cells >= 6px", m.heatOver === false && m.cellW >= 6, "cell " + m.cellW.toFixed(1) + "px");
    const led = m.ledger, top = led.slice(-4).reverse();
    const wantSeals = top.map(e => ({ name: t26bLectureName(e.ref), hash: "#" + e.hash.slice(0, 4) + "…" + e.hash.slice(-4) }));
    const genesis = led.length > 0 && led.length <= 4;
    c26b(at + " /record: \"Latest seals\" is the newest " + top.length + " of " + led.length + " chain entries — the lecture's code, then #xxxx…xxxx — newest first",
      m.seals.length === top.length && m.seals.length <= 4 && m.seals.every((s, i) => s.hash === wantSeals[i].hash &&
        (wantSeals[i].name ? s.name === wantSeals[i].name : !!s.name && !/undefined/.test(s.name))),
      m.seals.map(s => s.name + " " + s.hash).join(" | ") || "no seals");
    const wantOrder = top.map(() => "S").concat(genesis ? ["G"] : []).join(",<-,");
    c26b(at + " /record: each seal is joined to the next by \"←\"" + (genesis ? ", and genesis is reached, so it is shown last, faded (--ink-3)" : ", and genesis is not reached, so it is not shown"),
      m.order.join(",") === wantOrder && m.arrows.every(a => a === "←") && (genesis ? m.gen.length === 1 && __same(m.gen[0].ink, m.ink3) : m.gen.length === 0),
      m.order.join(" ") || "nothing");
    const wantPills = ["Transcript & gates", "Verify a file", "How it works", "Reset the streak counter"];
    const last = m.pills[m.pills.length - 1];
    c26b(at + " /record: the pills are " + wantPills.join(", ") + " — each >= 44x44, none filled — and the reset is last, in --bad",
      JSON.stringify(m.pills.map(x => x.text)) === JSON.stringify(wantPills) && m.pills.every(x => x.w >= 44 && x.h >= 44 && !x.filled) &&
        last.act === "resetStreak" && __same(last.col, m.bad),
      m.pills.map(x => x.text + " " + x.w.toFixed(0) + "x" + x.h.toFixed(0) + (x.filled ? " filled" : "")).join(", "));
    c26b(at + " /record: there is no filled primary on the page, so the reset cannot be one", p.filled.length === 0, p.filled.map(x => x.text).join(", "));
    if (o.click) {
      const w0 = await writesNow(page);
      await page.click("#view .pf-pills [data-act=toggleAdv]");
      const adv = await page.waitForFunction(() => { const b = document.querySelector("#view #advBox"); return b && !b.hidden && b.checkVisibility(); }, null, { timeout: 4000, polling: "raf" }).then(() => true, () => false);
      c26b(at + " /record: \"Verify a file\" opens the verify-and-anchor box", adv);
      const n0 = dialogs.length, from0 = await page.evaluate(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).streakFrom || null);
      await page.click("#view .pf-pills [data-act=resetStreak]");
      for (let i = 0; i < 100 && dialogs.length === n0; i++) await new Promise(r => setTimeout(r, 20));   // proof: the dialog event, not a duration
      const from1 = await page.evaluate(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).streakFrom || null), w1 = await writesNow(page);
      c26b(at + " /record: the reset still asks first — a confirm, and dismissing it changes nothing (streakFrom " + from0 + ", state writes " + w0 + " -> " + w1 + ")",
        dialogs.length === n0 + 1 && /^Reset the streak to zero\?/.test(dialogs[dialogs.length - 1] || "") && from1 === from0 && w1 === w0,
        (dialogs.length - n0) + " dialog(s): " + JSON.stringify(dialogs.slice(n0)));
    }
  }

  // ---- the seeded state (with a chain) at both sizes, both themes ----
  for (const theme of ["dark", "light"]) {
    for (const o of [{ w: 1440, h: 900, mobile: false, cols: 3 }, { w: 390, h: 844, mobile: true, cols: 1 }]) {
      const at = o.w + "px " + theme;
      console.log("\nT-026b Problems, Exams and Proof, " + at);
      const { ctx, page, errors, dialogs, today } = await t26bFresh(Object.assign({ theme, patch: { ledger: T26B_LONG } }, o));
      const w0 = await writesNow(page);
      await t26bProblems(page, at, Object.assign({ click: true, today }, o));
      await t26bExamsCheck(page, at, Object.assign({ today }, o));
      await t26bRecordCheck(page, at, Object.assign({ click: true, today }, o), dialogs);
      const w1 = await writesNow(page);
      c26b(at + " T-026b: nothing on the three pages wrote state, Opens, \"Verify a file\" and a dismissed reset included (state writes " + w0 + " -> " + w1 + ")", w1 === w0);
      c26b(at + " T-026b: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  // ---- one state at a time, for what the seed cannot show ----
  const T26B_STATES = [
    { name: "labs and problem sets done", routes: ["/workshop"],
      patch: { labs: { "micrograd-blind": { done: true, proof: "" }, "flashcards-cli": { done: true, proof: "https://example.org/x" } },
               psets: Object.fromEntries(PSET_IDS.slice(0, 3).map(id => [id, true])) } },
    { name: "an exam passed (MIT 18.06, 80%) and five MATH 120 lectures watched", routes: ["/exams"],
      patch: { diag: { "diag-la": { score: 80, date: "2026-10-30" } },
               lessons: Object.fromEntries([0, 1, 2, 3, 4].map(i => ["math120.0." + i, { done: true, doneAt: "2026-10-29", notes: "", checks: [] }])) } },
    { name: "every bank open", routes: ["/exams"],
      patch: { lessons: Object.fromEntries(["math120.0.0", "math130.0.0", "ai200.0.0", "math210.0.0", "ai310.0.0"].map(k => [k, { done: true, doneAt: "2026-10-29", notes: "", checks: [] }])) } },
    { name: "Gate 1 passed, so a bank leads", routes: ["/exams"], patch: { gates: { 1: "2026-10-23" } } },
    // T-038 review round 1: an unmark is stored as an object, which is truthy.
    // Gate 1 unmarked is open, so the next diagnostic still leads, tagged
    // "· Gate 1" with the days to the gate — read off the page itself below,
    // not only through the expectation above.
    { name: "Gate 1 unmarked (stored { passed: false }), so it is open and a diagnostic leads", routes: ["/exams"], gate1Open: true,
      patch: { gates: { 1: { date: null, at: "2026-10-30T09:00:00.000Z", passed: false } } } },
    // Review round 1: every other state has nothing watched in a locked
    // bank's course, so a bar drawn at 0 passed. Eight MATH 110 lectures that
    // no Linear Algebra question waits on: the bank stays locked at 8/51.
    { name: "eight MATH 110 lectures watched, none a question's, so Linear Algebra is locked at 8 of 51", routes: ["/exams"], empty: true, lockedWatched: true,
      patch: { lessons: Object.fromEntries([0, 3, 4, 7, 9, 10, 11, 12].map(i => ["math110.0." + i, { done: true, doneAt: "2026-10-29", notes: "", checks: [] }])) } },
    // Review round 1: with the three maths diagnostics sat the coding one
    // leads, and the approved mockup tags it CS 150 — readiness is problems
    // solved of 150 (30 here, so a bar drawn at 0 cannot pass).
    { name: "the three maths diagnostics sat, so the coding diagnostic leads, with 30 problems solved", routes: ["/exams"],
      patch: { diag: { "diag-la": { score: 80, date: "2026-10-30" }, "diag-calc": { score: 75, date: "2026-10-30" }, "diag-prob": { score: 72, date: "2026-10-30" } },
               problems: Object.fromEntries(T26B_PROBLEMS.slice(0, 30).map(k => [k, "2026-10-29"])) } },
    { name: "a two-entry chain (genesis reached) after a streak reset", routes: ["/record"],
      patch: { ledger: T26B_SHORT, settings: { streakFrom: "2026-10-30" } } },
    { name: "day 1, nothing stored", routes: ["/workshop", "/exams", "/record"], empty: true, now: T26B_DAY1, click: true },
    { name: "a Saturday (the rest day)", routes: ["/workshop", "/exams", "/record"], now: T26B_SAT, patch: { ledger: T26B_LONG } },
  ];
  for (const st of T26B_STATES) {
    for (const o of [{ w: 1440, h: 900, mobile: false, cols: 3 }, { w: 390, h: 844, mobile: true, cols: 1 }]) {
      const at = o.w + "px dark, " + st.name;
      console.log("\nT-026b " + at);
      const { ctx, page, errors, dialogs, today } = await t26bFresh(Object.assign({ theme: "dark", patch: st.patch, empty: st.empty, now: st.now }, o));
      const oo = Object.assign({ today, click: !!st.click, lockedWatched: !!st.lockedWatched }, o);
      for (const r of st.routes) {
        if (r === "/workshop") await t26bProblems(page, at, oo);
        if (r === "/exams") await t26bExamsCheck(page, at, oo);
        if (r === "/exams" && st.gate1Open) {
          const m = await page.evaluate(t26bExams);
          c26b(at + " /exams: Gate 1 is open — the hero is a diagnostic tagged \"· Gate 1\", counting the days to the gate",
            !!m.hero && /^#\/diag\//.test((m.hero.sit || {}).href || "") && / · Gate 1$/.test(m.hero.tag || "") && m.hero.daysLabel === "days to the gate",
            m.hero ? "\"" + m.hero.tag + "\" " + ((m.hero.sit || {}).href || "no Sit it") + ", \"" + m.hero.daysLabel + "\"" : "no hero");
        }
        if (r === "/record") await t26bRecordCheck(page, at, oo, dialogs);
      }
      c26b(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  // ---- nothing wider than its box, no word broken mid-word ----
  // Every text this item added, read as rendered (labelWords: no two letters
  // of a word on different lines), at 8 widths x 3 root sizes, on a state that
  // draws all of it: labs ticked, a passed exam (a score pill on a card), a
  // chain; and day 1 for the locked rows, expanded past "+N more".
  const T26B_TEXT = "#view .page-head, #view .pb-modes, #view .pb-labs, #view .ghead, #view .pd-list, #view .pd-how, #view .pd-empty, #view .ex-hero, #view .ex-open, #view .ex-locked, " +
    "#view .ex-more, #view .pf-tiles, #view .pf-seals, #view .pf-pills, #view .pf-heat, #view .shelf-empty";
  const T26B_OW = [320, 360, 390, 640, 768, 1100, 1280, 1440];
  for (const root of [16, 20, 24]) {
    for (const w of T26B_OW) {
      const mobile = w < 861, bad = [];
      for (const st of [{ patch: { ledger: T26B_LONG, labs: T26B_STATES[0].patch.labs, psets: T26B_STATES[0].patch.psets, diag: T26B_STATES[1].patch.diag },
                          routes: ["/workshop", "/exams", "/record"] },
                        { empty: true, now: T26B_DAY1, routes: ["/exams"] }]) {
        const { ctx, page, errors } = await t26bFresh({ w, h: 900, mobile, theme: "light", root, patch: st.patch, empty: st.empty, now: st.now });
        for (const r of st.routes) {
          await go(page, r);
          if (await page.$("#view .ex-more")) { await page.click("#view .ex-more"); await page.waitForFunction(() => !document.querySelector("#view .ex-more"), null, { timeout: 4000 }).catch(() => {}); }
          const rootNow = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
          if (rootNow !== root + "px") bad.push("root font is " + rootNow);
          const ov = await page.evaluate(viewOverflow), lw = await page.evaluate(labelWords, T26B_TEXT);
          if (ov.out.length || ov.side) bad.push(r + (st.empty ? " (day 1)" : "") + " " + ov.out.concat(ov.side ? ["page " + ov.side] : []).join(", "));
          if (lw.length) bad.push(r + (st.empty ? " (day 1)" : "") + " " + lw.join("; "));
        }
        bad.push(...errors);
        await ctx.close();
      }
      c26b(w + "px root " + root + "px: /workshop, /exams (also day 1, every locked bank shown) and /record — nothing wider than its box, no sideways scroll, no word broken mid-word",
        bad.length === 0, bad.join(" | ") || "4 views");
    }
  }

  // =================== T-026c: Week, the Calendar's day view, Library ===================
  // loop/specs/T-026c-week-calendar-library/spec.md, acceptance 1: at
  // 1440x900 and 390x844 in dark and light on the seed plus T26C_PATCH, then
  // the states the seed cannot show — no payment this week (the BHD tile is
  // typed), the week already sealed, nothing sealed yet, and a Sunday. Each
  // page boots on #/__test (t26bFresh), so the schedule can be asked.
  let t26cChecks = 0;
  const c26c = (name, ok, detail) => { t26cChecks++; return check(name, ok, detail); };
  const t26cState = page => page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}"));

  async function t26cWeekCheck(page, at, o) {
    const w0 = await writesNow(page);
    await go(page, "/review");
    const st = await t26cState(page), W = t26cWeekWant(st, o.today), m = await page.evaluate(t26cWeek);
    c26c(at + " /review: the header is h1 \"Week " + W.w + "\" and \"" + T26C_SUB["/review"] + "\"",
      m.head.h1 === "Week " + W.w && m.head.sub === T26C_SUB["/review"], JSON.stringify(m.head));
    const wantLabels = ["DSA solved", "lectures proven", "posts", "BHD earned"];
    c26c(at + " /review: four tiles — " + wantLabels.join(", ") + " — each >= 44x44", m.tiles.length === 4 &&
      JSON.stringify(m.tiles.map(t => t.label)) === JSON.stringify(wantLabels) && m.tiles.every(t => t.w >= 44 && t.h >= 44),
      m.tiles.map(t => t.label + " " + t.w.toFixed(0) + "x" + t.h.toFixed(0)).join(", "));
    const [tD, tP, tPo, tB] = m.tiles;
    c26c(at + " /review: DSA solved is counted, not typed, and says it is the running total — " + W.dsa + ", every problem stored as solved — \"all time · counted for you\" in --good, and Seal reads it (rvDsa " + W.dsa + ")",
      !!tD && !tD.input && tD.n === String(W.dsa) && tD.em === "all time · counted for you" && __same(tD.emCol, m.good) && !!m.rvDsa && m.rvDsa.type === "hidden" && m.rvDsa.value === String(W.dsa),
      tD ? tD.n + " \"" + tD.em + "\", rvDsa " + JSON.stringify(m.rvDsa) : "no tile");
    c26c(at + " /review: lectures proven is the lectures proven between " + W.from + " and " + W.to + " (" + W.proven + "), counted, \"counted for you\"",
      !!tP && !tP.input && tP.n === String(W.proven) && tP.em === "counted for you" && __same(tP.emCol, m.good), tP ? tP.n + " \"" + tP.em + "\"" : "no tile");
    c26c(at + " /review: posts is typed — the tile holds the number field #rvPosts (0), >= 44px tall, \"tap to edit\"",
      !!tPo && tPo.tag === "LABEL" && !!tPo.input && tPo.input.id === "rvPosts" && tPo.input.type === "number" && tPo.input.value === "0" && tPo.input.h >= 44 && tPo.em === "tap to edit",
      tPo ? tPo.tag + " " + JSON.stringify(tPo.input) + " \"" + tPo.em + "\"" : "no tile");
    c26c(at + " /review: " + (W.auto ? "the ledger has entries, so BHD earned is counted: those dated " + W.from + " to " + W.to + ", its rest day included (" + W.bhdText + "), \"from Treasury\", and Seal reads it (rvRev " + W.earned + ")"
        : "the Treasury ledger is empty, so BHD earned is typed — the field #rvRev, \"tap to edit\""),
      !!tB && (W.auto ? !tB.input && tB.n === W.bhdText && tB.em === "from Treasury" && __same(tB.emCol, m.good) && !!m.rvRev && m.rvRev.type === "hidden" && m.rvRev.value === String(W.earned)
        : tB.tag === "LABEL" && !!tB.input && tB.input.id === "rvRev" && tB.input.type === "number" && tB.input.h >= 44 && tB.em === "tap to edit"),
      tB ? (tB.input ? "typed " + JSON.stringify(tB.input) : tB.n + " \"" + tB.em + "\"") + ", rvRev " + JSON.stringify(m.rvRev) : "no tile");
    if (o.cols) {
      const cols = new Set(m.tiles.map(t => t.left)).size;
      c26c(at + " /review: the tiles are " + o.cols + " across", cols === o.cols, cols + " distinct columns");
    }
    c26c(at + " /review: \"Seal the week\" is the only filled primary (data-act logWeek, the existing handler)",
      m.filled.length === 1 && m.filled[0].text === "Seal the week" && m.filled[0].act === "logWeek", m.filled.map(f => "\"" + f.text + "\" " + f.act).join("; ") || "no filled button");
    c26c(at + " /review: beside it the state reads \"" + W.state + "\"", m.state === W.state, "\"" + m.state + "\"");
    c26c(at + " /review: each question's placeholder reads at >= 4.5:1 on its field (" + m.ph.map(x => "#" + x.id).join(", ") + ")",
      m.ph.length === 2 && m.ph.every(x => x.ratio >= 4.5), m.ph.map(x => "#" + x.id + " " + (x.ink || "?") + " on " + (x.back || "?") + " " + x.ratio.toFixed(2) + ":1").join("; "));
    c26c(at + " /review: two questions — \"What did you ship?\" on #rvShipped and \"What got in the way?\" on #rvNotes, each field >= 44px",
      JSON.stringify(m.qs.map(q => [q.q, q.forId, q.input])) === JSON.stringify([["What did you ship?", "rvShipped", "rvShipped"], ["What got in the way?", "rvNotes", "rvNotes"]]) && m.qs.every(q => q.h >= 44),
      JSON.stringify(m.qs));
    c26c(at + " /review: \"Past weeks\" reads \"" + W.meta + "\"" + (W.cards.length ? " and is one card per sealed week, newest first, each its shipped text (or \"nothing shipped\") and its numbers"
        : " and holds the four places the cards will go (" + W.slots.join(", ") + ")"),
      !!m.past && m.past.meta === W.meta && (W.cards.length
        ? m.cards.length === W.cards.length && m.cards.every((c, i) => { const x = W.cards[i];
            return c.tag === "DETAILS" && c.h === x.h && c.date === x.date && c.s === x.s && c.fail === x.fail && c.m === x.m && c.sh >= 44; })
        : m.cards.length === 4 && m.cards.every((c, i) => c.slot && c.h === W.slots[i])),
      (m.past ? "\"" + m.past.meta + "\": " : "no header: ") + m.cards.map(c => c.h + (c.date ? " " + c.date : "") + (c.s ? " / " + c.s : "") + (c.m ? " / " + c.m : "")).join(" | "));
    if (o.click && W.cards.length) {
      await page.click("#view .wk-weeks > details:first-child > summary");
      await page.waitForFunction(() => { const d = document.querySelector("#view .wk-weeks > details"); return d && d.open; }, null, { timeout: 4000, polling: "raf" }).catch(() => {});
      const m2 = await page.evaluate(t26cWeek);
      c26c(at + " /review: a past week's card opens to its notes (\"" + W.cards[0].notes + "\")", !!m2.cards[0] && m2.cards[0].open && m2.cards[0].notes === W.cards[0].notes,
        JSON.stringify(m2.cards[0] && { open: m2.cards[0].open, notes: m2.cards[0].notes }));
    }
    // A render is a read: the page, a second render of it, and the card
    // opened — the counted tiles reach storage only through Seal.
    await page.evaluate(() => window.__brickfordTest.render());
    await page.waitForFunction(() => !!document.querySelector("#view .wk-tiles"), null, { timeout: 4000 });
    const w1 = await writesNow(page);
    c26c(at + " /review: a render is a read — the page, rendered twice" + (o.click ? " and a card opened" : "") + ", wrote nothing (state writes " + w0 + " -> " + w1 + ")", w1 === w0);
  }

  async function t26cCalCheck(page, at, o) {
    const w0 = await writesNow(page);
    await go(page, "/calendar");
    const pick = async iso => {
      await page.click('#view .cal-grid .cal-cell[data-cal-day="' + iso + '"]');
      await page.waitForFunction(t => { const h = document.querySelector("#view .cd-head h2"); return h && h.textContent.trim() === t; }, t26cNice(iso), { timeout: 4000, polling: "raf" }).catch(() => {});
    };
    const days = [o.today].concat(o.more || []);
    for (const iso of days) {
      if (iso !== o.today) await pick(iso);
      const m = await page.evaluate(t26cDay, [iso, T26_FAC]);
      const tag = at + " /calendar " + iso;
      if (iso === o.today) c26c(tag + ": the month grid, then the day, then the .ics fold — the grid and the fold where they were", m.order.join(",") === "grid,day,ics", m.order.join(","));
      const rest = new Date(iso + "T00:00:00Z").getUTCDay() === 6, idx = T26_STUDY.indexOf(iso), wk = Math.floor(t26Pos(iso) / 6) + 1;
      const real = m.want.filter(x => !x.pseudo), doneN = real.filter(x => x.done).length;
      const wantSub = rest ? "Rest day · Week " + wk : "Day " + (idx + 1) + " · Week " + wk + (real.length ? " · " + doneN + " of " + real.length + " done" : "");
      c26c(tag + ": the day is the heading \"" + t26cNice(iso) + "\" over \"" + wantSub + "\"", m.h2 === t26cNice(iso) && m.sub === wantSub, "\"" + m.h2 + "\" / \"" + m.sub + "\"");
      const segOk = m.seg.length === 3 && m.seg.map(s => s.label).join("|") === "Previous day|Today|Next day" && m.seg.every(s => s.w >= 44 && s.h >= 44) &&
        m.seg[1].pressed === String(iso === o.today);
      c26c(tag + ": ‹ Today › at the right, each >= 44x44, Today pressed " + (iso === o.today ? "(this is today)" : "off"), segOk,
        m.seg.map(s => s.label + " " + s.w.toFixed(0) + "x" + s.h.toFixed(0) + (s.pressed === "true" ? " pressed" : "")).join(", "));
      const pct = m.prog && m.prog.track ? m.prog.fill / m.prog.track * 100 : null, wantPct = real.length ? doneN / real.length * 100 : null;
      c26c(tag + ": " + (real.length ? "the slim bar is " + doneN + " of " + real.length + " lectures done (" + wantPct.toFixed(1) + "%) within 1%" : "no lectures, so no bar"),
        real.length ? pct != null && Math.abs(pct - wantPct) <= 1 : !m.prog, pct == null ? "no bar" : pct.toFixed(1) + "%");
      const blockBad = [];
      if (m.blocks.length !== m.want.length) blockBad.push(m.blocks.length + " blocks for " + m.want.length + " scheduled");
      m.want.forEach((x, i) => {
        const b = m.blocks[i];
        if (!b) return;
        if (x.pseudo) { if (!b.pseudo || b.href !== x.href) blockBad.push("#" + (i + 1) + " is not the " + x.href + " block"); return; }
        const why = [];
        if (b.pseudo || b.href !== x.href) why.push("href " + b.href);
        if (b.k !== x.k || b.upper !== "uppercase") why.push("kicker \"" + b.k + "\" " + b.upper);
        if (b.t !== x.t) why.push("title \"" + b.t + "\"");
        if (JSON.stringify(b.r) !== JSON.stringify(x.r)) why.push("right " + JSON.stringify(b.r) + " (want " + JSON.stringify(x.r) + ")");
        if (!b.bar || !__same(b.bar.col, x.fac) || Math.abs(b.bar.w - 6) > 0.5) why.push("bar " + (b.bar ? JSON.stringify(b.bar.col) + " " + b.bar.w + "px" : "none") + " (want " + x.faculty + " " + JSON.stringify(x.fac) + ")");
        if (x.done ? !(b.done && b.ok && __same(b.tCol, m.ink2)) : (b.done || b.ok || !__same(b.kCol, x.fac))) why.push(x.done ? "not shown done (check, --ink-2)" : "shown done, or its kicker not in the faculty colour");
        if (b.h < 44) why.push(b.h.toFixed(0) + "px tall");
        if (why.length) blockBad.push(x.href + ": " + why.join(", "));
      });
      c26c(tag + ": one block per scheduled lecture (" + real.length + (m.want.length > real.length ? " + " + (m.want.length - real.length) + " other" : "") +
          "), in order, linking to it — a 6px bar in its faculty's colour, \"CODE · BLOCK\", the title, minutes over its place" + (doneN ? "; a done one checked, in --ink-2" : ""),
        (m.want.length > 0 || rest) && blockBad.length === 0,
        blockBad.join("; ") || m.blocks.map(b => b.k + " " + (b.r || []).join("/") + (b.done ? " (done)" : "")).join(", ") || "none (a rest day)");
      if (iso === o.today) c26c(tag + ": the old per-course group headers and .glist rows are gone (no visible .glist; the section headers are only \"Every study day\")",
        m.glist === 0 && JSON.stringify(m.groupHeads) === JSON.stringify(["Every study day"]), m.glist + " .glist, headers " + JSON.stringify(m.groupHeads));
      const H = T26C_HABITS.concat(new Date(iso + "T00:00:00Z").getUTCDay() === 0 ? [T26C_SEAL] : []);
      const habitBad = m.habits.filter((h, i) => !H[i] || h.tag !== "A" || h.t !== H[i][0] || h.href !== H[i][2] || h.w < 44 || h.h < 44 ||
        !(H[i][1] ? h.m.indexOf(H[i][1] + " min") === 0 : !/\bmin\b/.test(h.m)));
      c26c(tag + ": \"Every study day\" is " + H.length + " habit tiles (" + H.map(h => h[0]).join(", ") + "), each a link with its minutes, and reads \"" + t26cAbout(H.reduce((a, h) => a + h[1], 0)) + "\"",
        m.habits.length === H.length && habitBad.length === 0 && m.about === t26cAbout(H.reduce((a, h) => a + h[1], 0)),
        m.habits.map(h => h.t + " \"" + h.m + "\"").join(", ") + "; \"" + m.about + "\"");
      if (iso === o.today && o.cols) {
        const cols = new Set(m.habits.map(h => h.left)).size;
        c26c(tag + ": the habits are " + o.cols + " across", cols === o.cols, cols + " distinct columns");
      }
    }
    // ‹ and › step the day in memory; Today comes back.
    await pick(o.today);
    const prev = (() => { const d = new Date(o.today + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); })();
    await page.click("#view .cd-seg [data-cal-step='-1']");
    await page.waitForFunction(t => { const h = document.querySelector("#view .cd-head h2"); return h && h.textContent.trim() === t; }, t26cNice(prev), { timeout: 4000, polling: "raf" }).catch(() => {});
    const a = await page.evaluate(t26cDay, [prev, T26_FAC]);
    await page.click("#view .cd-seg [data-cal-step='1']");
    await page.waitForFunction(t => { const h = document.querySelector("#view .cd-head h2"); return h && h.textContent.trim() === t; }, t26cNice(o.today), { timeout: 4000, polling: "raf" }).catch(() => {});
    const b = await page.evaluate(t26cDay, [o.today, T26_FAC]);
    await page.click("#view .cd-seg [data-cal-step='1']");
    await page.click("#view .cd-seg [data-cal-nav='today']");
    await page.waitForFunction(t => { const h = document.querySelector("#view .cd-head h2"); return h && h.textContent.trim() === t; }, t26cNice(o.today), { timeout: 4000, polling: "raf" }).catch(() => {});
    const c = await page.evaluate(t26cDay, [o.today, T26_FAC]);
    const w1 = await writesNow(page);
    c26c(at + " /calendar: ‹ selects " + prev + " (the grid follows), › comes back, and Today returns from tomorrow — all in memory (state writes " + w0 + " -> " + w1 + ")",
      a.h2 === t26cNice(prev) && a.sel === prev && b.h2 === t26cNice(o.today) && b.sel === o.today && c.h2 === t26cNice(o.today) && c.sel === o.today && w1 === w0,
      [a, b, c].map(x => x.h2 + " (" + x.sel + ")").join(" -> "));
  }

  // Review round 1: ‹ › and the day's Today put the page back where it was:
  // the pressed control stays where it is on screen and keeps the focus. A
  // same-route render had started at the top, which on a phone left the row
  // under the fixed bars and the next tap opened a lesson. Pressed the way a
  // reader does — scrolled down to the day, a finger on the control's centre
  // where it is NOW, twice; on a desktop, Enter twice and then Today.
  const t26cAdd = (iso, k) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
  // Still: the scroll position unchanged and no finite animation running, for
  // three frames in a row (a change, then a stop — not a duration).
  const t26cSettled = page => page.waitForFunction(() => {
    const y = window.scrollY, busy = document.getAnimations().some(a => a.playState === "running" &&
      (!a.effect || a.effect.getComputedTiming().iterations !== Infinity));
    if (busy || y !== window.__t26cY) { window.__t26cY = y; window.__t26cN = 0; return false; }
    return ++window.__t26cN >= 3;
  }, null, { polling: "raf", timeout: 6000 }).catch(() => {});
  const t26cSegAt = (page, sel) => page.evaluate(sel => {
    const b = document.querySelector(sel), r = b ? b.getBoundingClientRect() : null, x = r ? r.left + r.width / 2 : 0, y = r ? r.top + r.height / 2 : 0;
    const hit = r ? document.elementFromPoint(x, y) : null, a = document.activeElement;
    return { x, y, top: r ? r.top : NaN, mine: !!hit && !!b && b.contains(hit), hit: hit ? hit.tagName.toLowerCase() + "." + String(hit.className).split(" ")[0] : null,
      hash: location.hash, h2: ((document.querySelector("#view .cd-head h2") || {}).textContent || "").trim(),
      sel: (document.querySelector("#view .cal-cell.sel") || { dataset: {} }).dataset.calDay || null, focus: !!a && !!b && a === b };
  }, sel);
  const t26cDayIs = (page, iso) => page.waitForFunction(t => ((document.querySelector("#view .cd-head h2") || {}).textContent || "").trim() === t,
    t26cNice(iso), { timeout: 4000, polling: "raf" }).catch(() => {});
  // /calendar with today selected, from wherever the page is (go() to the
  // hash it is already on would wait for a render that never comes).
  async function t26cOnToday(page, today) {
    if (await page.evaluate(() => location.hash) !== "#/calendar") await go(page, "/calendar");
    if ((await t26cSegAt(page, "#view .cd-head h2")).h2 !== t26cNice(today)) {
      await page.click("#view .cal-head [data-cal-nav='today']");
      await t26cDayIs(page, today);
    }
  }
  async function t26cStepTaps(page, at, o) {
    const NEXT = "#view .cd-seg [data-cal-step='1']";
    await t26cOnToday(page, o.today);
    const w0 = await writesNow(page);
    await page.evaluate(() => document.querySelector("#view .cd-seg").scrollIntoView({ block: "center", behavior: "instant" }));
    await t26cSettled(page);
    const a = await t26cSegAt(page, NEXT), taps = [];
    for (const k of [1, 2]) {
      const p = await t26cSegAt(page, NEXT);
      await page.touchscreen.tap(p.x, p.y);
      await t26cDayIs(page, t26cAdd(o.today, k));
      await t26cSettled(page);
      taps.push(await t26cSegAt(page, NEXT));
    }
    const last = t26cAdd(o.today, 2), w1 = await writesNow(page);
    c26c(at + " /calendar: scrolled to the day, › tapped twice where it is — still /calendar, the day moved by 2 (" + last + "), › under the finger after each tap (within 1px, not covered) and holding the focus, nothing written",
      a.mine && taps.length === 2 && taps.every(t => t.hash === "#/calendar" && Math.abs(t.top - a.top) <= 1 && t.mine && t.focus) &&
        taps[1].h2 === t26cNice(last) && taps[1].sel === last && w1 === w0,
      [a].concat(taps).map(t => t.hash + " \"" + t.h2 + "\" ›@" + t.top.toFixed(1) + (t.mine ? "" : " covered by " + t.hit) + (t.focus ? " focused" : "")).join(" -> ") + ", writes " + w0 + " -> " + w1);
  }
  async function t26cStepKeys(page, at, o) {
    const NEXT = "#view .cd-seg [data-cal-step='1']", TODAY = "#view .cd-seg [data-cal-nav='today']";
    await t26cOnToday(page, o.today);
    const w0 = await writesNow(page);
    await page.focus(NEXT);
    await t26cSettled(page);
    const a = await t26cSegAt(page, NEXT), keys = [];
    for (const k of [1, 2]) {
      await page.keyboard.press("Enter");
      await t26cDayIs(page, t26cAdd(o.today, k));
      await t26cSettled(page);
      keys.push(await t26cSegAt(page, NEXT));
    }
    const t0 = await t26cSegAt(page, TODAY);
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Enter");
    await t26cDayIs(page, o.today);
    await t26cSettled(page);
    const t1 = await t26cSegAt(page, TODAY), w1 = await writesNow(page);
    c26c(at + " /calendar: Enter on › twice moves the day by 2 with › where it was and focused; Shift+Tab, Enter on Today comes back with Today focused, in place; nothing written",
      keys.length === 2 && keys.every(t => t.hash === "#/calendar" && Math.abs(t.top - a.top) <= 1 && t.focus) && keys[1].h2 === t26cNice(t26cAdd(o.today, 2)) &&
        t1.h2 === t26cNice(o.today) && t1.sel === o.today && t1.focus && Math.abs(t1.top - t0.top) <= 1 && w1 === w0,
      [a].concat(keys).map(t => "\"" + t.h2 + "\" ›@" + t.top.toFixed(1) + (t.focus ? " focused" : "")).join(" -> ") + "; Today: \"" + t1.h2 + "\" @" + t1.top.toFixed(1) + " (was " + t0.top.toFixed(1) + ")" + (t1.focus ? " focused" : "") + ", writes " + w0 + " -> " + w1);
  }

  async function t26cLibCheck(page, at, o) {
    const w0 = await writesNow(page);
    await go(page, "/library");
    const m = await page.evaluate(t26cLib);
    c26c(at + " /library: the header is h1 \"Library\" and \"" + T26C_SUB["/library"] + "\"", m.head.h1 === "Library" && m.head.sub === T26C_SUB["/library"], JSON.stringify(m.head));
    const [start, guides] = m.groups;
    const wantStart = ["#/guide", "#/method", "#/doc/readme"];
    c26c(at + " /library: \"Start here\" is 3 document cards — the Handbook, the Method, the Calibration Kit — each a page glyph, a title and a line",
      !!start && start.head && start.head.t === "Start here" && JSON.stringify(start.cards.map(c => c.href)) === JSON.stringify(wantStart) &&
        start.cards.every(c => c.glyph && !!c.t && !!c.m && c.w >= 44 && c.h >= 44),
      start ? start.cards.map(c => c.href + " \"" + c.t + "\"").join(", ") : "no group");
    c26c(at + " /library: the Handbook card alone carries an --accent edge (the first read)",
      !!start && !!start.cards[0] && !!start.cards[0].edge && __same(start.cards[0].edge, m.accent) && start.cards.slice(1).every(c => !c.edge || !__same(c.edge, m.accent)),
      start ? start.cards.map(c => c.href + " " + (c.edge ? JSON.stringify(c.edge) : "none")).join(", ") : "no group");
    const wantGuides = T26C_DOCS.filter(id => id !== "readme").map(id => "#/doc/" + id);
    c26c(at + " /library: \"Guides\" is the remaining documents in DOCS (" + wantGuides.length + ": " + wantGuides.join(" ") + "), as the same cards",
      wantGuides.length > 0 && !!guides && guides.head && guides.head.t === "Guides" && JSON.stringify(guides.cards.map(c => c.href)) === JSON.stringify(wantGuides) &&
        guides.cards.every(c => c.glyph && !!c.t && !!c.m && !c.edge),
      guides ? guides.cards.map(c => c.href).join(" ") : "no group");
    const log = guides && guides.cards.find(c => c.href === "#/doc/log");
    c26c(at + " /library: \"Progress Log (file)\" shows its superseded note in muted ink (--ink-3)",
      !!log && log.t === "Progress Log (file)" && /supersedes/.test(log.m) && __same(log.mCol, m.ink3), log ? "\"" + log.m + "\" " + JSON.stringify(log.mCol) : "no card");
    if (o.cols && guides) {
      const cols = new Set(guides.cards.slice(0, 3).map(c => c.left)).size;
      c26c(at + " /library: the cards are " + o.cols + " across", cols === o.cols, cols + " distinct columns in the first three guides");
    }
    const n = m.links.length, shown = m.links.filter(l => l.shown);
    c26c(at + " /library: \"Outside links\" reads " + n + ", shows 5, then \"+" + (n - 5) + "\" (>= 44x44); every chip >= 44x44 with its ↗",
      n > 5 && !!m.linksHead && m.linksHead.t === "Outside links" && m.linksHead.meta === String(n) && shown.length === 5 && m.links.every((l, i) => l.shown === i < 5) &&
        !!m.more && m.more.text === "+" + (n - 5) && m.more.w >= 44 && m.more.h >= 44 && shown.every(l => l.w >= 44 && l.h >= 44 && /↗$/.test(l.text)),
      shown.length + " shown of " + n + (m.more ? ", \"" + m.more.text + "\"" : ", no +N") + (m.linksHead ? ", meta " + m.linksHead.meta : ""));
    const badLink = m.links.filter(l => l.target !== "_blank" || !/(^|\s)noopener(\s|$)/.test(l.rel || "") || !/^https:\/\//.test(l.href || ""));
    c26c(at + " /library: every outside link (all " + n + ", the folded ones too) opens in a new tab with rel=\"noopener\"",
      n > 0 && badLink.length === 0, badLink.map(l => l.text + " target=" + l.target + " rel=" + l.rel).join("; ") || n + " links");
    if (o.click) {
      await page.click("#view .lb-links button");
      await page.waitForFunction(() => !document.querySelector("#view .lb-links button"), null, { timeout: 4000, polling: "raf" }).catch(() => {});
      const m2 = await page.evaluate(t26cLib);
      c26c(at + " /library: \"+" + (n - 5) + "\" shows all " + n + " in place and hands the focus to the first of them",
        m2.links.length === n && m2.links.every(l => l.shown && l.w >= 44 && l.h >= 44) && !m2.more && m2.focus === m.links[5].text,
        m2.links.filter(l => l.shown).length + " shown, focus " + JSON.stringify(m2.focus));
    }
    const w1 = await writesNow(page);
    c26c(at + " /library: nothing on it wrote state" + (o.click ? ", \"+N\" included" : "") + " (state writes " + w0 + " -> " + w1 + ")", w1 === w0);
  }

  // ---- the seeded state, at both sizes, both themes ----
  for (const theme of ["dark", "light"]) {
    for (const o of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
      const at = o.w + "px " + theme;
      console.log("\nT-026c Week, the Calendar's day view and Library, " + at);
      const { ctx, page, errors, today } = await t26bFresh(Object.assign({ theme, patch: T26C_PATCH }, o));
      const w0 = await writesNow(page);
      await t26cWeekCheck(page, at, { today, click: true, cols: o.mobile ? 2 : 4 });
      await t26cCalCheck(page, at, { today, cols: o.mobile ? 2 : 4, more: ["2026-11-07", "2026-11-05"] });   // a rest day and a later study day in the pinned month (reset seven: Sat 31 Oct is in October)
      if (o.mobile) await t26cStepTaps(page, at, { today }); else await t26cStepKeys(page, at, { today });
      await t26cLibCheck(page, at, { today, click: true, cols: o.mobile ? 1 : 3 });
      const w1 = await writesNow(page);
      c26c(at + " T-026c: nothing on the three pages wrote state (state writes " + w0 + " -> " + w1 + ")", w1 === w0);
      c26c(at + " T-026c: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  // ---- one state at a time, for what the seed cannot show ----
  const T26C_LEDGER = entries => Object.assign({}, T26C_PATCH, { treasury: { offer: "", clients: [], niche: "", entries } });
  const T26C_STATES = [
    { name: "a ledger with no payment in this week (only Thu 29 Oct and Fri 6 Nov), so BHD is a counted 0",
      patch: T26C_LEDGER([T26C_PATCH.treasury.entries[0], T26C_PATCH.treasury.entries[5]]) },
    { name: "an empty Treasury ledger, so BHD is typed", patch: T26C_LEDGER([]) },
    { name: "a 12,345.75 week", patch: T26C_LEDGER([{ date: "2026-10-30", amount: 12345.75, note: "a big one" }]) },
    { name: "this week already sealed",
      patch: Object.assign({}, T26C_PATCH, { weeks: T26C_PATCH.weeks.concat([{ week: 3, date: "2026-11-01", shipped: "a repo", dsa: 2, posts: 2, revenue: 150.5, notes: "" }]) }) },
    { name: "nothing sealed yet", patch: Object.assign({}, T26C_PATCH, { weeks: [] }) },
    { name: "the plan week's last day (Thu 5 Nov since reset seven), the day the week is sealed", now: new Date("2026-11-05T12:00:00Z"), patch: T26C_PATCH },
  ];
  for (const st of T26C_STATES) {
    for (const o of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
      const at = o.w + "px dark, " + st.name;
      console.log("\nT-026c " + at);
      const { ctx, page, errors, today } = await t26bFresh(Object.assign({ theme: "dark", patch: st.patch, now: st.now }, o));
      await t26cWeekCheck(page, at, { today });
      c26c(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  // ---- the day controls at the reviewer's phone sizes, and with motion on ----
  for (const o of [{ w: 375, h: 667 }, { w: 320, h: 568 }, { w: 390, h: 664 }, { w: 390, h: 844, motion: "no-preference" }, { w: 1440, h: 900, motion: "no-preference" }]) {
    const mobile = o.w < 861, at = o.w + "x" + o.h + " dark" + (o.motion ? ", motion on" : "");
    console.log("\nT-026c the day controls, " + at);
    const { ctx, page, errors, today } = await t26bFresh({ w: o.w, h: o.h, mobile, theme: "dark", patch: T26C_PATCH, motion: o.motion });
    if (mobile) await t26cStepTaps(page, at, { today }); else await t26cStepKeys(page, at, { today });
    c26c(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // ---- a long BHD week fits its tile ----
  // Review round 1: 1,149.5 ran out of its tile at 320, 360, 1024, 1100 and
  // 1280 (root 16) and 1440 (root 24), and scrolled the page sideways at 320;
  // 12,345.75 at 390. Every number in the tiles inside its tile's content box,
  // nothing in the view wider than its box, no sideways scroll.
  const T26C_FIT_W = [320, 390, 1100, 1280, 1440];
  for (const amt of [1149.5, 12345.75]) {
    for (const root of [16, 24]) {
      for (const w of T26C_FIT_W) {
        const { ctx, page, errors } = await t26bFresh({ w, h: 900, mobile: w < 861, theme: "light", root,
          patch: T26C_LEDGER([{ date: "2026-10-30", amount: amt, note: "x" }]) });
        await go(page, "/review");
        const f = await page.evaluate(t26cTileFit), ov = await page.evaluate(viewOverflow);
        const rootNow = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
        const want = amt.toLocaleString("en-US", { maximumFractionDigits: 2 });
        c26c(w + "px root " + root + "px /review: a " + want + " BHD week fits its tile (every Week number inside its tile, nothing in the view wider than its box, no sideways scroll)",
          rootNow === root + "px" && f.bhd === want && f.out.length === 0 && ov.out.length === 0 && !ov.side && errors.length === 0,
          (f.out.concat(ov.out).concat(ov.side ? ["page " + ov.side] : []).concat(errors).join("; ") || "\"" + f.bhd + "\" at " + f.size.toFixed(1) + "px") + (rootNow === root + "px" ? "" : ", root " + rootNow));
        await ctx.close();
      }
    }
  }

  // ---- T-028: Practice — record yourself ----
  // At 1440 and 390, Dark and Light, on a day with nothing owed (the bank
  // logged Fri 30 Oct and today, Sun 1 Nov): the header with its week, three tabs
  // with Story picked, the record button >= 88px, centred in its card, a
  // <button> with a label that the keyboard reaches, its red the theme's
  // --bad where that beats #ff453a against the card (and >= 3:1 either way,
  // non-text), its ring --ink at >= 3:1; nothing written. Then, once each at
  // 390 Dark, the default tab on the days it changes, the Saturday card and
  // the monthly review's card above the tabs.
  let t28Checks = 0;
  const c28 = (name, ok, detail) => { t28Checks++; return check(name, ok, detail); };
  const T28_SUB = "Speak it out loud. Recording yourself is the practice.";
  const t28Reps = o => Object.assign({ bank: [], story: [], humor: [], review: [] }, o);
  const T28_BANK = d => ({ date: d, what: "a client asked what an embedding was", why: "he got it in 20 seconds" });
  const T28_PATCH = { reps: t28Reps({ bank: [T28_BANK("2026-10-30"), T28_BANK("2026-11-01")] }) };
  for (const theme of ["dark", "light"]) {
    for (const o of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
      const at = o.w + "px " + theme;
      console.log("\nT-028 Practice, " + at);
      const { ctx, page, errors } = await t26bFresh(Object.assign({ theme, patch: T28_PATCH }, o));
      const w0 = await writesNow(page);
      await go(page, "/practice");
      await page.waitForFunction(() => { const l = document.querySelector("#view #prClips"); return l && l.getAttribute("aria-busy") === "false"; }, null, { timeout: 5000 }).catch(() => {});
      const m = await page.evaluate(t28Practice), r = m.rec || {};
      c28(at + " /practice: the header is h1 \"Practice\" and \"" + T28_SUB + "\", with the week's six dots and \"2 of 6 days this week\"",
        m.head.h1 === "Practice" && m.head.sub === T28_SUB && m.head.dots === 6 && m.head.on === 2 && m.head.week === "2 of 6 days this week", JSON.stringify(m.head));
      c28(at + " /practice: the segmented control has 3 options — Story, Humour, Story bank — each >= 44x44, and Story is picked (nothing is owed)",
        m.seg.length === 3 && m.seg.map(s => s.t).join("|") === "Story|Humour|Story bank" && m.seg.every(s => s.w >= 44 && s.h >= 44) &&
          m.seg.filter(s => s.on).map(s => s.t).join() === "Story", m.seg.map(s => s.t + (s.on ? "*" : "") + " " + s.w.toFixed(0) + "x" + s.h.toFixed(0)).join(", "));
      c28(at + " /practice: the Story card reads \"Tell one story from this week\" / \"Under 90 seconds. Beginning, turn, ending.\" and the timer 0:00 / 1:30",
        m.prompt === "Tell one story from this week" && m.hint === "Under 90 seconds. Beginning, turn, ending." && m.time === "0:00 / 1:30", JSON.stringify([m.prompt, m.hint, m.time]));
      c28(at + " /practice: the record button is a <button type=button> labelled \"Start recording\", in the tab order, at least 88x88 (" + (r.w || 0).toFixed(0) + "x" + (r.h || 0).toFixed(0) + "), its disc round",
        !!m.rec && r.tag === "BUTTON" && r.type === "button" && r.label === "Start recording" && r.tab === 0 && r.w >= 88 && r.h >= 88 && r.round, JSON.stringify(m.rec));
      c28(at + " /practice: the record button is centred in its card (centre within 1px of the card's)",
        !!m.rec && Math.abs(r.cx - r.card.cx) <= 1 && r.x >= r.card.x && r.x + r.w <= r.card.x + r.card.w,
        m.rec ? "button centre " + r.cx.toFixed(1) + ", card centre " + r.card.cx.toFixed(1) : "no button");
      c28(at + " /practice: its red is the theme's --bad (" + (r.bad || "?") + "), which beats #ff453a on the card (" + (r.redRatio || 0).toFixed(2) + ":1 against " + (r.sysRatio || 0).toFixed(2) + ":1 on " + (r.cardBg || "?") + "), and clears 3:1",
        !!m.rec && r.red === r.bad && r.redRatio >= r.sysRatio && r.redRatio >= 3, JSON.stringify({ red: r.red, bad: r.bad, cardBg: r.cardBg }));
      c28(at + " /practice: its ring is --ink (" + (r.ink || "?") + "), " + (r.ringW || 0) + "px, at " + (r.ringRatio || 0).toFixed(2) + ":1 on the card (>= 3:1)",
        !!m.rec && r.ring === r.ink && r.ringW >= 3 && r.ringRatio >= 3, JSON.stringify({ ring: r.ring, ink: r.ink, ringW: r.ringW }));
      c28(at + " /practice: \"Your recordings\" heads the list, \"kept on this device\"",
        !!m.listHead && m.listHead.t === "Your recordings" && m.listHead.meta === "kept on this device", JSON.stringify(m.listHead));
      // The keyboard: from the last tab, Tab lands on the record button.
      await page.focus("#view [data-ptab=bank]");
      await page.keyboard.press("Tab");
      const f = await page.evaluate(() => document.activeElement && document.activeElement.matches(".pr-rec"));
      c28(at + " /practice: Tab from the last tab lands on the record button", f, String(f));
      // Review 1: the hand forms fill the card's content box (within 1px each side).
      const fills = (x, ids) => !!x && x.fields.length === ids.length && x.fields.every(g => !g.missing && Math.abs(g.l) <= 1 && Math.abs(g.r) <= 1);
      await page.click("#view [data-ptab=bank]");
      const fb = await page.evaluate(t28Fill, ["bankWhat", "bankWhy"]);
      c28(at + " /practice: Story bank's two fields fill the card's content box (" + (fb ? fb.content : "?") + "px)", fills(fb, ["bankWhat", "bankWhy"]), JSON.stringify(fb));
      // No microphone in this browser: pressing record brings the hand form.
      await page.click("#view [data-ptab=story]");
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => !!document.querySelector("#view .pr-nomic"), null, { timeout: 5000 }).catch(() => {});
      const fs2 = await page.evaluate(t28Fill, ["repWhich"]);
      const grid = await page.evaluate(() => { const a = document.getElementById("repSecs"), b = document.getElementById("repTakes"), w = document.getElementById("repWhich");
        if (!a || !b || !w) return null; const A = a.getBoundingClientRect(), B = b.getBoundingClientRect(), W = w.getBoundingClientRect();
        return { l: +(A.left - W.left).toFixed(1), r: +(W.right - B.right).toFixed(1) }; });
      c28(at + " /practice: with no microphone, Story's hand form fills the card — \"Which entry\" edge to edge, seconds and takes spanning the same width",
        fills(fs2, ["repWhich"]) && !!grid && Math.abs(grid.l) <= 1 && Math.abs(grid.r) <= 1, JSON.stringify({ fs2, grid }));
      const w1 = await writesNow(page);
      c28(at + " /practice: opening it and reading the recordings wrote nothing (state writes " + w0 + " -> " + w1 + ")", w1 === w0);
      c28(at + " /practice: no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }
  const T28_DAYS = [
    { name: "Sun 1 Nov (the pinned clock), the bank not yet logged: Story bank", patch: { reps: t28Reps() }, want: "Story bank" },
    { name: "Fri 23 Oct (story and humour owed), the bank logged: Story", now: new Date("2026-10-23T12:00:00Z"),
      patch: { reps: t28Reps({ bank: [T28_BANK("2026-10-23")] }) }, want: "Story" },
    { name: "Fri 23 Oct, the bank and the story logged: Humour", now: new Date("2026-10-23T12:00:00Z"),
      patch: { reps: t28Reps({ bank: [T28_BANK("2026-10-23")], story: [{ date: "2026-10-23", seconds: 70, takes: 1, from: "x" }] }) }, want: "Humour" },
    { name: "Sat 24 Oct: the rest card above the tabs, Story", now: new Date("2026-10-24T12:00:00Z"), patch: { reps: t28Reps() }, want: "Story", rest: true },
    { name: "a monthly review owed: its card above the tabs, with its form", patch: { reps: t28Reps({ bank: [T28_BANK("2026-11-01")],
      story: [{ date: "2026-09-01", seconds: 80, takes: 1, from: "the first one" }] }) }, want: "Story", review: true },
  ];
  // Review 1: at 320 and 390 a default title is never cut off.
  const T28_CLIPS = [
    { key: "2026-10-20-1", date: "2026-10-20", seconds: 72, kind: "story", title: "Story \u00b7 Tue 20 Oct" },
    { key: "2026-09-30-1", date: "2026-09-30", seconds: 58, kind: "humor", title: "Humour \u00b7 Wed 30 Sep" },
    { key: "2026-09-24-1", date: "2026-09-24", seconds: 90, kind: "humor", title: "Humour \u00b7 Thu 24 Sep" },
  ];
  for (const w of [320, 390]) {
    const at = w + "px dark, three recordings with default titles";
    console.log("\nT-028 " + at);
    const { ctx, page, errors } = await t26bFresh({ w, h: 844, mobile: true, theme: "dark", patch: T28_PATCH });
    await page.evaluate(t28SeedClips, T28_CLIPS);
    const w0 = await writesNow(page);
    await go(page, "/practice");
    await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 3, null, { timeout: 5000 }).catch(() => {});
    const rows = await page.evaluate(t28Rows);
    c28(at + " — every title is shown whole (scrollWidth <= clientWidth), download and delete clear of it, every control >= 44x44",
      rows.length === 3 && rows.every(r => r.scroll <= r.client && r.apart && r.small === 0 && r.ctl === 3),
      rows.map(r => "\"" + r.title + "\" " + r.scroll + "/" + r.client + (r.apart ? "" : " overlapped") + (r.small ? " " + r.small + " small" : "")).join("; "));
    const w1 = await writesNow(page);
    c28(at + " — nothing written, no page errors", w1 === w0 && errors.length === 0, "writes " + w0 + " -> " + w1 + (errors.length ? ", " + errors.join(" | ") : ""));
    await ctx.close();
  }
  for (const d of T28_DAYS) {
    const at = "390px dark, " + d.name;
    console.log("\nT-028 " + at);
    const { ctx, page, errors } = await t26bFresh({ w: 390, h: 844, mobile: true, theme: "dark", patch: d.patch, now: d.now });
    const w0 = await writesNow(page);
    await go(page, "/practice");
    const m = await page.evaluate(t28Practice);
    const picked = m.seg.filter(s => s.on).map(s => s.t).join();
    c28(at + " — the tab picked is " + d.want, picked === d.want, picked || "none");
    if (d.rest) c28(at + " — \"Nothing owed today\" is a card above the tabs and the recorder, which is still there",
      !!m.rest && !!m.rec && m.rest.b <= m.segTop && m.rest.b <= m.rec.y, JSON.stringify({ rest: m.rest, segTop: m.segTop, rec: !!m.rec }));
    if (d.rest) {
      // Review 1: a Log button on a rest day could only refuse. None is drawn;
      // the bank pane says "Nothing owed today." and the recorder stays.
      const panes = {};
      for (const k of ["story", "humor", "bank"]) {
        await page.click("#view [data-ptab=" + k + "]");
        panes[k] = await page.evaluate(() => { const p = document.querySelector("#view .pr-pane");
          return { log: [...p.querySelectorAll("[data-act^=rep]")].map(b => b.dataset.act), rec: !!p.querySelector(".pr-rec"), write: !!p.querySelector(".pr-write"),
            rest: ((p.querySelector(".pr-rest") || {}).textContent || "").trim() }; });
      }
      c28(at + " — no tab draws a Log button; Story and Humour keep the recorder (Humour without its written fold); Story bank says \"Nothing owed today.\"",
        ["story", "humor", "bank"].every(k => panes[k].log.length === 0) && panes.story.rec && panes.humor.rec && !panes.humor.write && !panes.bank.rec &&
          panes.bank.rest === "Nothing owed today.", JSON.stringify(panes));
    }
    if (d.review) c28(at + " — the review card, its notes field and \"Log the review\" sit above the tabs",
      !!m.review && m.review.form && m.review.go === "Log the review" && m.review.b <= m.segTop, JSON.stringify(m.review));
    const w1 = await writesNow(page);
    c28(at + " — nothing written, no page errors", w1 === w0 && errors.length === 0, "writes " + w0 + " -> " + w1 + (errors.length ? ", " + errors.join(" | ") : ""));
    await ctx.close();
  }

  // =================== T-043: the lecture quiz gate ===================
  // loop/specs/T-043-lecture-quiz-gate/spec.md, criterion 4; the mockups are
  // loop/design/specimen-lesson-quiz.png and specimen-lesson-passed.png. At
  // 1440 and 390, Dark and Light: the page before "watched", the quiz after a
  // miss, the pass with Go deeper, the locked lecture, and the dashboard
  // pointing at a quiz. Each state has at most one filled primary in the
  // view (t26bPrimary: a visible <a>/<button> painted --btn-bg); the watched
  // bar's Rewatch is >= 44x44; the cards and tiles are painted --surface.
  let t43Checks = 0;
  const c43 = (name, ok, detail) => { t43Checks++; return check(name, ok, detail); };
  const T43_PASS = (d, ft, n) => ({ passedAt: d, at: d + "T10:00:00.000Z", firstTry: ft, total: n, attempts: n + 1 });
  const T43_STATES = [
    { name: "before watched", route: "/lesson/math120/1/0",
      patch: { lessons: { "math120.0.11": { done: true, doneAt: "2026-10-28", notes: "", checks: [], quiz: T43_PASS("2026-10-28", 2, 2) } } } },
    { name: "the quiz after a miss", route: "/lesson/math120/1/0", miss: true,
      patch: { lessons: { "math120.0.11": { done: true, doneAt: "2026-10-28", notes: "", checks: [], quiz: T43_PASS("2026-10-28", 2, 2) },
                          "math120.1.0": { done: true, doneAt: "2026-11-01", notes: "", checks: [] } } } },
    { name: "passed, with Go deeper", route: "/lesson/math110/0/13",
      patch: { lessons: { "math110.0.13": { done: true, verified: true, doneAt: "2026-10-30", notes: "n", checks: [true], solved: 3, recall: "x".repeat(200),
        verifiedAt: "2026-10-30", quiz: T43_PASS("2026-10-30", 2, 3) } } } },
    // One quiz in the way: lecture 13 watched, its quiz not passed.
    { name: "the locked lecture", route: "/lesson/math120/1/1",
      patch: { lessons: { "math120.0.11": { done: true, doneAt: "2026-10-28", notes: "", checks: [], quiz: T43_PASS("2026-10-28", 2, 2) },
                          "math120.1.0": { done: true, doneAt: "2026-11-01", notes: "", checks: [] } } } },
    { name: "the dashboard pointing at a quiz", route: "/", patch: null },
    { name: "the dashboard pointing at a watched lecture's quiz", route: "/",
      patch: { lessons: { "math120.0.11": { done: true, doneAt: "2026-10-28", notes: "", checks: [], quiz: T43_PASS("2026-10-28", 2, 2) },
                          "math120.1.0": { done: true, doneAt: "2026-11-01", notes: "", checks: [] } } } },
  ];
  function t43Measure() {
    const z = window.__dz, surface = z.tok("--surface");
    const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
    const box = n => { const r = n.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
    const bgOk = n => !!n && z.same(z.bytes(getComputedStyle(n).backgroundColor), surface, 2);
    const txt = sel => { const n = document.querySelector(sel); return n ? n.textContent.replace(/\s+/g, " ").trim() : null; };
    const card = document.querySelector("#view .lq-card"), pass = document.querySelector("#view .lq-pass"), lock = document.querySelector("#view .lq-lock");
    const rw = document.querySelector("#view .lq-rewatch");
    // Review r1: every text-bearing element in the quiz card, measured against
    // what is painted behind it (z.backdrop), at the 4.5:1 text threshold —
    // the miss state's tinted option fills included.
    // The tinted option fills are color-mix() results, which compute to
    // "color(srgb r g b)" — a form the canvas in z.bytes does not take (it
    // read them as black, and a planted --ink-3 key passed). Parsed here.
    // Chromium also serialises some of them as oklab(L a b), converted here
    // with the standard OKLab -> linear sRGB matrices.
    const px = c => { let m = /^color\(srgb ([-\d.e]+) ([-\d.e]+) ([-\d.e]+)(?: \/ ([\d.]+))?\)$/.exec(c);
      if (m) return [m[1], m[2], m[3]].map(v => Math.round(Math.min(1, Math.max(0, +v)) * 255)).concat(Math.round((m[4] == null ? 1 : +m[4]) * 255));
      m = /^oklab\(([-\d.e]+) ([-\d.e]+) ([-\d.e]+)(?: \/ ([\d.]+))?\)$/.exec(c);
      if (m) {
        const L = +m[1], A = +m[2], B = +m[3];
        const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3), mm = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3), s3 = Math.pow(L - 0.0894841775 * A - 1.2914855480 * B, 3);
        const lin = [4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s3, -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s3, -0.0041960863 * l - 0.7034186147 * mm + 1.7076147010 * s3];
        const g = v => { v = Math.min(1, Math.max(0, v)); return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; };
        return lin.map(v => Math.round(g(v) * 255)).concat(Math.round((m[4] == null ? 1 : +m[4]) * 255));
      }
      return z.bytes(c); };
    const behind = el => { const stack = [];
      for (let n = el; n; n = n.parentElement) { const b = px(getComputedStyle(n).backgroundColor); if (b[3] === 0) continue; stack.push(b); if (b[3] === 255) break; }
      let base = [255, 255, 255, 255]; for (let i = stack.length - 1; i >= 0; i--) base = z.over(stack[i], base); return base; };
    const lowInk = card ? [...card.querySelectorAll("*")].filter(n => n.checkVisibility() &&
      [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())).map(n => {
        const r = z.ratio(z.over(px(getComputedStyle(n).color), behind(n)), behind(n));
        return { n: n.className || n.tagName, t: n.textContent.trim().slice(0, 16), r: +r.toFixed(2) };
      }).filter(x => x.r < 4.5) : null;
    return {
      lowInk, marked: card ? card.querySelectorAll(".opt.wrong, .opt.correct").length : 0,
      keyInk: card ? [...card.querySelectorAll(".opt.wrong .key, .opt.correct .key")].map(n => +z.ratio(z.over(px(getComputedStyle(n).color), behind(n)), behind(n)).toFixed(2)) : null,
      frame: !!document.querySelector("#view .video-frame iframe"), mark: txt("#view [data-act=toggleDone]"),
      bar: !!document.querySelector("#view .lq-watched"), rewatch: rw && rw.checkVisibility() ? box(rw) : null,
      quiz: card ? { title: txt("#view .lq-title"), sub: txt("#view .lq-head .lq-note"), n: txt("#view .lq-n"),
        segs: [...card.querySelectorAll(".lq-segs i")].map(i => i.className), note: txt("#view .lq-foot .lq-note"),
        why: txt("#view #qFeedback"), bg: bgOk(card), opts: vis("#view .lq-card .opt").map(box) } : null,
      pass: pass ? { text: txt("#view .lq-pass"), bg: bgOk(pass), btn: txt("#view .lq-pass .btn") } : null,
      // Review r1: the Go deeper heading and its caption on one line.
      deepHead: (() => { const h = document.querySelector("#view .lq-deep-head"), m = h && h.querySelector(".gh-meta");
        if (!h || !m) return null; const rg = document.createRange(); rg.selectNodeContents(h.firstChild);
        const a = rg.getBoundingClientRect(), b = m.getBoundingClientRect();
        return { text: h.textContent, oneLine: Math.abs(a.bottom - b.bottom) <= 4, a: Math.round(a.top), b: Math.round(b.top) }; })(),
      sketch: ((document.querySelector("#view .lq-tile .lq-tm") || {}).textContent || "").trim(),
      tiles: vis("#view .lq-tile").map(n => ({ t: (n.querySelector(".lq-tt") || {}).textContent, go: (n.querySelector(".lq-go") || {}).textContent, bg: bgOk(n), h: box(n).h })),
      prove: (() => { const d = document.querySelector("#view details.lq-prove"); return d ? { open: d.open, sum: d.querySelector("summary").textContent.replace(/\s+/g, " ").trim() } : null; })(),
      check: !!document.querySelector("#view [data-act=startSummaryCheck]"),
      lock: lock ? { text: txt("#view .lq-lock-t"), glyph: !!lock.querySelector(".lq-lock-ic svg"), bg: bgOk(lock), h1: txt("#view .page-head h1"),
        kicker: txt("#view .page-head .kicker"), btn: (lock.querySelector("a.btn") || { getAttribute: () => null }).getAttribute("href"),
        cards: document.querySelectorAll("#view .card").length, ahead: lock.dataset.ahead } : null,
      kind: txt(".card.one.lead .one-kind"), go: (document.querySelector(".card.one.lead a.one-go") || { getAttribute: () => null }).getAttribute("href"),
      railLock: !!document.querySelector("#rail .rl-lock"), railRule: txt("#rail .rl-rule"),
      todayRoot: (r => r ? "#/lesson/" + r.split(".").join("/") : null)(window.__brickfordTest.lockRoot("math120", 1, 0)),
    };
  }
  for (const theme of ["dark", "light"]) {
    for (const o of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
      for (const st of T43_STATES) {
        const at = o.w + "px " + theme + ", " + st.name;
        console.log("\nT-043 " + at);
        const { ctx, page, errors } = await t26bFresh(Object.assign({ theme, patch: st.patch }, o));
        await go(page, st.route);
        if (st.miss) {
          await page.waitForSelector("#view .lq-card");
          // The miss is made on a multiple-choice question, so the marked
          // options are on screen to measure (review r1): a numeric one drawn
          // first is answered right and passed over.
          for (let g = 0; g < 4 && await page.evaluate(() => !document.querySelector("#view .lq-card .opt")); g++) {
            await page.evaluate(() => { const c = document.querySelector("#view .lq-card");
              document.querySelector("#view #numAns").value = String(window.DAR.SUMMARIES["math120.1.0"].checks[+c.dataset.q].num);
              document.querySelector("#view #numGo").click(); document.querySelector("#view #nextBtn").click(); });
          }
          // A wrong answer: the first option that is not the bank's answer,
          // or a number nobody would give.
          await page.evaluate(() => {
            const c = document.querySelector("#view .lq-card"), q = window.DAR.SUMMARIES["math120.1.0"].checks[+c.dataset.q];
            const o = [...c.querySelectorAll(".opt")].find(b => +b.dataset.o !== q.a);
            if (o) o.click(); else { document.querySelector("#view #numAns").value = "-98765"; document.querySelector("#view #numGo").click(); }
          });
          await page.waitForFunction(() => getComputedStyle(document.querySelector("#view #nextBtn")).visibility === "visible", null, { timeout: 4000 });
          // The marked options' fills transition in: measure once they have
          // changed (the correct one is no longer the plain option's fill) and
          // nothing in the card is still running — proof, not a duration.
          await page.waitForFunction(() => { const c = document.querySelector("#view .lq-card"), ok = c && c.querySelector(".opt.correct"), plain = c && c.querySelector(".opt:not(.correct):not(.wrong)");
            return !!ok && (!plain || getComputedStyle(ok).backgroundColor !== getComputedStyle(plain).backgroundColor) &&
              c.getAnimations({ subtree: true }).every(a => a.playState !== "running"); }, null, { timeout: 4000, polling: "raf" }).catch(() => {});
        }
        const w0 = await writesNow(page);
        const m = await page.evaluate(t43Measure), p = await page.evaluate(t26bPrimary);
        const filled = p.filled.map(f => f.text);
        c43(at + ": at most one filled primary in the view", p.filled.length <= 1, filled.join(" | ") || "none");
        if (st.name === "before watched") {
          c43(at + ": the page as before — the video, \"Mark watched\" the one primary, no quiz, no watched bar",
            m.frame && m.mark === "Mark watched" && filled.join() === "Mark watched" && !m.quiz && !m.bar && !m.pass && m.tiles.length === 0, JSON.stringify({ frame: m.frame, mark: m.mark, filled }));
        } else if (st.name === "the quiz after a miss") {
          const q = m.quiz || {};
          c43(at + ": the video is the watched bar, the quiz under it", !m.frame && m.bar && !!m.quiz, JSON.stringify({ frame: m.frame, bar: m.bar }));
          c43(at + ": the bar's Rewatch is >= 44x44", !!m.rewatch && m.rewatch.w >= 44 && m.rewatch.h >= 44, JSON.stringify(m.rewatch));
          c43(at + ": the quiz card reads \"Lecture quiz\" · \"From this lecture only\" · \"Question i of n\", with n segments and the miss red",
            q.title === "Lecture quiz" && q.sub === "From this lecture only" && /^Question \d+ of \d+$/.test(q.n || "") &&
              q.segs.length === +/of (\d+)/.exec(q.n || "of 0")[1] && q.segs.includes("miss"), JSON.stringify(q));
          c43(at + ": the note says misses come back and the first-try score is kept; the miss says why and that it comes back",
            q.note === "Misses come back, reshuffled, until you get them. Your first-try score is kept." && /^Not quite\./.test(q.why || "") && /comes back at the end/.test(q.why || ""),
            JSON.stringify({ note: q.note, why: q.why }));
          c43(at + ": the card is --surface, every option >= 44px tall, and \"Next question\" is the one primary", q.bg && q.opts.every(b => b.h >= 44) && filled.join() === "Next question",
            JSON.stringify({ bg: q.bg, opts: q.opts, filled }));
          c43(at + ": every text in the quiz card is >= 4.5:1 on what is behind it, the two marked options (wrong, correct) and their keys included",
            Array.isArray(m.lowInk) && m.lowInk.length === 0 && m.marked === 2, "marked options " + m.marked + ", their keys " + JSON.stringify(m.keyInk) + ":1; under 4.5: " + JSON.stringify(m.lowInk));
          c43(at + ": no \"Check yourself\" under the summary (the quiz is the check)", !m.check, String(m.check));
          if (o.w === 1440) c43(at + ": the rail says how the ring counts and shows the next lecture locked",
            m.railRule === "A lecture counts once its quiz is passed" && m.railLock, JSON.stringify({ rule: m.railRule, lock: m.railLock }));
        } else if (st.name === "passed, with Go deeper") {
          c43(at + ": the pass card — \"Lecture passed\", \"3 of 3 · 2 right on the first try\", --surface, \"Next lecture →\" the one primary",
            !!m.pass && /^✓\s*Lecture passed\s*3 of 3 · 2 right on the first try · counted/.test(m.pass.text) && m.pass.bg && m.pass.btn === "Next lecture →" &&
              filled.join() === "Next lecture →", JSON.stringify({ pass: m.pass, filled }));
          c43(at + ": Go deeper is three tiles — Sketch it, Recall it cold, Practice problems — each --surface and >= 44px",
            m.tiles.map(t => t.t).join("|") === "Sketch it|Recall it cold|Practice problems" && m.tiles.every(t => t.bg && t.h >= 44), JSON.stringify(m.tiles));
          c43(at + ": the Go deeper heading reads \"Go deeper\" with \"optional\" on the same line", !!m.deepHead && m.deepHead.text === "Go deeperoptional" && m.deepHead.oneLine,
            JSON.stringify(m.deepHead));
          c43(at + ": the Sketch tile names the concept in quotes and reads as a sentence",
            /^Sketch “[^”]+” from memory, then compare with the summary\.$/.test(m.sketch), "\"" + m.sketch + "\"");
          c43(at + ": the four gates sit under a closed \"Prove mastery · 4 gates\" disclosure", !!m.prove && !m.prove.open && /^Prove mastery · 4 gates/.test(m.prove.sum),
            JSON.stringify(m.prove));
          c43(at + ": no quiz on a passed lecture, and the watched bar's Rewatch >= 44x44", !m.quiz && !!m.rewatch && m.rewatch.w >= 44 && m.rewatch.h >= 44, JSON.stringify(m.rewatch));
        } else if (st.name === "the locked lecture") {
          const L = m.lock || {};
          c43(at + ": one card, no video: \"Pass the quiz for “…” first\", a lock glyph, the kicker and title above, --surface",
            !!m.lock && L.cards === 1 && !m.frame && !m.mark && /^Pass the quiz for “.+” first$/.test(L.text || "") && L.glyph && L.bg &&
              /^2\. /.test(L.h1 || "") && /^MATH 120/.test(L.kicker || ""), JSON.stringify(L));
          c43(at + ": its one primary goes to the previous lecture's quiz", filled.join() === "Go to the quiz ▸" && L.btn === "#/lesson/math120/1/0" && L.ahead === "1", JSON.stringify({ filled, href: L.btn }));
        } else if (st.name === "the dashboard pointing at a quiz") {
          // Review r1: nothing watched, so the first lecture in the chain is
          // to be watched first — not called a quiz.
          c43(at + ": nothing watched — the Next card says \"Watch: <title>, then its quiz\" for the root of today's chain (which starts at the gate, not at lecture 1), and its \"Open ▸\" is the one primary",
            /^Watch: .+, then its quiz$/.test(m.kind || "") && !!m.todayRoot && m.go === m.todayRoot && m.go !== "#/lesson/math120/0/0" && filled.join() === "Open ▸",
            JSON.stringify({ kind: m.kind, go: m.go, root: m.todayRoot, filled }));
        } else {
          c43(at + ": a watched lecture with its quiz to pass — the Next card says \"Quiz: <title>\" and its \"Start ▸\" is the one primary",
            m.kind === "Quiz: Rate of Change" && m.go === "#/lesson/math120/1/0" && filled.join() === "Start ▸", JSON.stringify({ kind: m.kind, go: m.go, filled }));
        }
        const w1 = await writesNow(page);
        c43(at + ": measuring wrote nothing, no page errors", w1 === w0 && errors.length === 0, "writes " + w0 + " -> " + w1 + (errors.length ? ", " + errors.join(" | ") : ""));
        await ctx.close();
      }
    }
  }

  // =================== T-045: Problems shows what's due now ===================
  // loop/specs/T-045-problems-due-now/spec.md, criterion 2; the mockup is
  // loop/design/specimen-problems-v2.png. At 1440 and 390, Dark and Light,
  // on five stored states at the pinned clock (Sun 1 Nov 2026, phase 1):
  // one quiz waiting, one catch-up quiz, one pset unlocked, one lab due (with
  // a phase-2 lab's lecture also cleared, so a lab shown before its phase
  // fails), and nothing due. t45Check works out what is due from storage and
  // the data files; here each state also asserts it is the one row it names
  // (so a fixture that stopped meaning anything fails), and the dashboard's
  // "n due on Problems" line is there exactly when something is due.
  let t45Checks = 0;
  const c45 = (name, ok, detail) => { t45Checks++; return check(name, ok, detail); };
  const T45_L = (d, pass) => Object.assign({ done: true, doneAt: d, notes: "", checks: [] },
    pass ? { quiz: { passedAt: d, at: d + "T10:00:00.000Z", firstTry: pass, total: pass, attempts: pass } } : {});
  const T45_STATES = [
    { name: "one quiz waiting", one: "quiz:math120.1.0", lessons: { "math120.1.0": T45_L("2026-11-01") } },
    { name: "one catch-up quiz", one: "catchup:math130.0.0", lessons: { "math130.0.0": T45_L("2026-10-17") } },
    { name: "one pset unlocked", one: "pset:1806-ps1", lessons: { "math110.1.1": T45_L("2026-10-30", 2) } },
    { name: "one lab due (and a phase-2 lab's lecture cleared)", one: "lab:micrograd-blind",
      lessons: { "ai200.1.0": T45_L("2026-10-19", 8), "ai200.1.8": T45_L("2026-10-30", 8) } },
    { name: "nothing due", one: null, lessons: {} },
    // Review r1, finding 2: the Daily review row, which no state drew. A
    // missed Linear Algebra question (index 8, `after` math110.0.1) whose
    // lecture is watched and passed, beside the pset of "one pset unlocked":
    // the review row is last, goes to #/drill, and adds exactly one to that
    // state's count and to its dashboard line.
    { name: "the daily review beside one pset", one: "pset:1806-ps1,review:drill", twin: "one pset unlocked",
      lessons: { "math110.1.1": T45_L("2026-10-30", 2), "math110.0.1": T45_L("2026-10-30", 2) }, misses: { "linear-algebra": [8] } },
  ];
  // Review r1, finding 3: a lecture watched before the gate (grandfathered,
  // so cleared) with its quiz never passed. Its pset is unlocked and its quiz
  // is on the catch-up list in the same view, so the pset must not say "you
  // passed" it. The clock is the gate's own day, QUIZ_GATE_FROM read from
  // app.js (T-056); both rows' wording is stated here in full.
  const T45_GATE = /const QUIZ_GATE_FROM = "(\d{4}-\d\d-\d\d)"/.exec(fs.readFileSync(path.join(ROOT, "platform/js/app.js"), "utf8"))[1];
  T45_STATES.push({ name: "a pset unlocked by a lecture watched before the gate", now: new Date(T45_GATE + "T12:00:00Z"),
    one: "catchup:math130.0.1,pset:s110-sp1", lessons: { "math130.0.1": T45_L("2026-10-22") },
    words: { "catchup:math130.0.1": "MATH 130 · catch-up · watched, not passed · 3 questions",
             "pset:s110-sp1": "Pen and paper · unlocked: you watched Story Proofs, Axioms of Probability" } });
  const t45Seen = {};
  for (const theme of ["dark", "light"]) {
    for (const o of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
      for (const st of T45_STATES) {
        const at = o.w + "px " + theme + ", " + st.name;
        console.log("\nT-045 " + at);
        const { ctx, page, errors } = await t26bFresh(Object.assign({ theme, empty: true, now: st.now,
          patch: Object.assign({ lessons: st.lessons }, st.misses ? { quizMisses: st.misses } : {}) }, o));
        const w0 = await writesNow(page);
        await go(page, "/workshop");
        const m = await t45Check(page, at, o, c45);
        const got = m.rows.map(r => r.due + ":" + r.id);
        c45(at + ": the fixture is what it names — " + (st.one ? "exactly the row" + (st.one.includes(",") ? "s " : " ") + st.one : "no row"),
          st.one ? got.join() === st.one : got.length === 0, got.join(", ") || "no rows");
        if (st.words) {
          const said = Object.fromEntries(m.rows.map(r => [r.due + ":" + r.id, r.why]));
          c45(at + ": the catch-up row and the pset row say what happened — watched, not passed; unlocked because you watched it",
            Object.keys(st.words).every(k => said[k] === st.words[k]), JSON.stringify(said));
        }
        await go(page, "/");
        const line = await page.evaluate(() => { const a = document.querySelector(".card.one.lead a.one-due");
          return a ? { text: a.textContent.trim(), href: a.getAttribute("href"), h: a.getBoundingClientRect().height, vis: a.checkVisibility() } : null; });
        c45(at + ": the Today card " + (m.want.length ? "reads \"" + m.want.length + " due on Problems\", linking to #/workshop, >= 44px" : "has no Problems line"),
          m.want.length ? !!line && line.text === m.want.length + " due on Problems" && line.href === "#/workshop" && line.vis && line.h >= 44 : !line, JSON.stringify(line));
        const lineN = line ? parseInt(line.text, 10) : 0, key = theme + o.w;
        t45Seen[key + st.name] = { count: +m.count, line: lineN };
        if (st.twin) {
          const tw = t45Seen[key + st.twin] || null, rv = m.rows[m.rows.length - 1] || {};
          c45(at + ": the Daily review row is last, goes to #/drill, and it and its Start are >= 44px",
            rv.due === "review" && rv.href === "#/drill" && rv.rowH >= 44 && rv.goW >= 44 && rv.goH >= 44 && rv.visible, JSON.stringify(rv));
          c45(at + ": it adds exactly 1 to the count and to the dashboard line (\"" + st.twin + "\": " + (tw ? tw.count + " / " + tw.line : "not measured") + ")",
            !!tw && +m.count === tw.count + 1 && lineN === tw.line + 1, "count " + m.count + ", line " + lineN);
        }
        const w1 = await writesNow(page);
        c45(at + ": reading both pages wrote nothing, no page errors", w1 === w0 && errors.length === 0, "writes " + w0 + " -> " + w1 + (errors.length ? ", " + errors.join(" | ") : ""));
        await ctx.close();
      }
    }
  }

  // =================== T-054: Monk Mode, #/monk ===================
  // loop/specs/T-054-monk-page/spec.md, verify-design: at 1440 and 390, Dark
  // and Light, on two states — day 5 of 90 (day 1 is 24 Oct since T-056) with a day logged (a prayer, a
  // habit and two numbers on, a loop closed, a plan saved for today), and
  // 20 Oct, before the 90 days, with nothing stored — and once more with the
  // Full day disclosure open. Measured on the rendered page (t54Measure):
  // at most one filled primary, and it is "Save tomorrow's plan"; every
  // visible control (link, button, input, summary) at least 44x44; nothing
  // wider than the window and no text outside a box that clips it; every
  // visible text at 4.5:1 on what is painted behind it (3:1 when large).
  let t54Checks = 0;
  const c54 = (name, ok, detail) => { t54Checks++; return check(name, ok, detail); };
  const T54_DAY = "2026-10-28";
  const T54_STATES = [
    { name: "day 5 with a day logged", now: new Date(T54_DAY + "T12:00:00Z"), head: "Day 5 of 90", patch: { monk: {
      days: { [T54_DAY]: { prayers: { fajr: true }, german: { podcast: true, speak: true }, brickford: true, work: 8, phone: 1.5, at: T54_DAY + "T09:00:00.000Z" },
              "2026-10-27": { prayers: { fajr: true, dhuhrAsr: true, maghribIsha: true }, german: { podcast: true, speak: true, write: true, read: true }, brickford: true, work: 10, phone: 1, at: "2026-10-27T21:00:00.000Z" } },
      plans: { [T54_DAY]: { business: "Call two venues", content: "Script the Bahrain video", education: "MATH 120 lecture 4", at: "2026-10-27T21:55:00.000Z" } },
      loops: { s1: { text: "Carousel 'Top 5 Claude Code skills': approved twice 6 Oct, never rebuilt: rebuild or drop", done: true, at: "2026-10-27T10:00:00.000Z" },
               l2: { text: "Reply to the venue", done: false, at: "2026-10-26T10:00:00.000Z" } } } } },
    { name: "before the 90 days, nothing stored", now: new Date("2026-10-20T12:00:00Z"), head: "Starts 24 Oct", patch: null },
  ];
  function t54Measure() {
    const z = window.__dz, fill = z.tok("--btn-bg");
    const vis = el => el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
    const filled = [...document.querySelectorAll("#view a, #view button")].filter(n => vis(n) &&
      (b => b[3] === 255 && z.same(b, fill, 2))(z.bytes(getComputedStyle(n).backgroundColor))).map(n => n.textContent.trim());
    const small = [...document.querySelectorAll("#view a, #view button, #view input, #view summary, #view select, #view textarea")].filter(vis)
      .map(n => ({ n, r: n.getBoundingClientRect() })).filter(x => x.r.width < 44 - 0.5 || x.r.height < 44 - 0.5)
      .map(x => z.name(x.n) + " \"" + (x.n.textContent || x.n.placeholder || "").trim().slice(0, 20) + "\" " + x.r.width.toFixed(1) + "x" + x.r.height.toFixed(1));
    const controls = [...document.querySelectorAll("#view a, #view button, #view input, #view summary")].filter(vis).length;
    const clipped = [], low = [];
    let texts = 0;
    for (const el of document.querySelectorAll("#view *")) {
      if (![...el.childNodes].some(t => t.nodeType === 3 && t.textContent.trim())) continue;
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      texts++;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (!/hidden|clip|auto|scroll/.test(cs.overflowX + cs.overflowY)) continue;
        const b = a.getBoundingClientRect();
        if (r.left < b.left - 1 || r.right > b.right + 1 || r.top < b.top - 1 || r.bottom > b.bottom + 1) {
          clipped.push(z.name(el) + " \"" + el.textContent.trim().slice(0, 24) + "\" outside " + z.name(a)); break; }
      }
      const cs = getComputedStyle(el);
      if (cs.overflowX === "hidden" && el.scrollWidth > el.clientWidth + 1) clipped.push(z.name(el) + " \"" + el.textContent.trim().slice(0, 24) + "\" cut (" + el.scrollWidth + " > " + el.clientWidth + ")");
      const bg = z.backdrop(el), fg = z.over(z.bytes(cs.color), bg), ratio = z.ratio(fg, bg), px = parseFloat(cs.fontSize);
      const need = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700) ? 3 : 4.5;
      if (ratio < need - 0.005) low.push(z.name(el) + " \"" + el.textContent.trim().slice(0, 20) + "\" " + ratio.toFixed(2) + ":1 (" + z.hex(fg) + " on " + z.hex(bg) + ")");
    }
    const map = document.querySelector("#view #mkMap");
    const cols = map ? [...map.querySelectorAll(".hcol")] : [];
    return { filled, small, controls, clipped, low, texts,
      wide: document.documentElement.scrollWidth > window.innerWidth + 1 ? document.documentElement.scrollWidth + " > " + window.innerWidth : null,
      head: ((document.querySelector("#view .mk-head .one-kind") || {}).textContent || "").trim(),
      map: { cols: cols.length, rows: cols.map(c => c.querySelectorAll(".hc").length), now: map ? map.querySelectorAll(".hc.now").length : -1,
        fits: !!map && map.scrollWidth <= map.clientWidth + 1 },
      ext: (a => a ? { href: a.getAttribute("href"), blank: a.target === "_blank", rel: a.rel } : null)(document.querySelector("#view a.mk-ext")) };
  }
  for (const theme of ["dark", "light"]) {
    for (const o of [{ w: 1440, h: 900, mobile: false }, { w: 390, h: 844, mobile: true }]) {
      for (const st of T54_STATES) {
        const at = o.w + "px " + theme + ", " + st.name;
        console.log("\nT-054 " + at);
        const { ctx, page, errors } = await t26bFresh(Object.assign({ theme, empty: true, now: st.now, patch: st.patch }, o));
        await themePainted(page, theme, "T-054 " + at);
        const w0 = await writesNow(page);
        await go(page, "/monk");
        for (const open of [false, true]) {
          if (open) {
            await page.click("#view details.mk-day > summary");
            await page.waitForFunction(() => { const d = document.querySelector("#view details.mk-day"); return !!d && d.open; });
          }
          const m = await page.evaluate(t54Measure), lab = at + (open ? ", Full day open" : "");
          c54(lab + ": the head reads \"" + st.head + "\"", m.head === st.head, m.head);
          c54(lab + ": at most one filled primary, and it is Save tomorrow's plan", m.filled.length <= 1 && m.filled.every(t => t === "Save tomorrow’s plan"), JSON.stringify(m.filled));
          c54(lab + ": every visible control is at least 44x44 (" + m.controls + " measured)", m.controls > 20 && m.small.length === 0, m.small.slice(0, 4).join("; "));
          c54(lab + ": nothing wider than the window, no text outside a box that clips it", !m.wide && m.clipped.length === 0, (m.wide || "") + " " + m.clipped.slice(0, 3).join("; "));
          c54(lab + ": every visible text at 4.5:1 (3:1 large) on what is behind it (" + m.texts + " texts)", m.texts > 30 && m.low.length === 0, m.low.slice(0, 3).join("; "));
          if (!open) {
            c54(lab + ": the 90-day map is 13 week columns x 7 days, inside its box" + (st.patch ? ", today outlined" : ""),
              m.map.cols === 13 && m.map.rows.every(n => n === 7) && m.map.fits && m.map.now === (st.patch ? 1 : 0), JSON.stringify(m.map));
            c54(lab + ": Calendar and inbox opens MONK.url in a new tab", !!m.ext && /^https:\/\/claude\.ai\/artifact\//.test(m.ext.href) && m.ext.blank && /noopener/.test(m.ext.rel), JSON.stringify(m.ext));
          }
        }
        const w1 = await writesNow(page);
        c54(at + ": reading the page and opening Full day wrote nothing, no page errors", w1 === w0 && errors.length === 0, "writes " + w0 + " -> " + w1 + (errors.length ? ", " + errors.join(" | ") : ""));
        await ctx.close();
      }
    }
  }
  // The clipping sweep's widths and roots on #/monk, inside the view. (Not in
  // verify-clip.js: there a new route brings the sidebar crest's known clip at
  // a 24px root, 20 baseline entries, and that baseline may only shrink.)
  for (const w of [320, 390, 768, 1024, 1100, 1280, 1440]) {
    for (const root of [16, 24]) {
      const st = T54_STATES[0], at = w + "px root " + root + ", " + st.name;
      const { ctx, page, errors } = await t26bFresh({ theme: "dark", empty: true, now: st.now, patch: st.patch, w, h: 900, mobile: w < 860, root });
      await go(page, "/monk");
      await page.click("#view details.mk-day > summary");
      const m = await page.evaluate(t54Measure);
      c54("T-054 " + at + ": nothing wider than the window, no text outside a box that clips it (Full day open)", !m.wide && m.clipped.length === 0 && errors.length === 0,
        (m.wide || "") + " " + m.clipped.slice(0, 3).join("; ") + errors.join(" | "));
      await ctx.close();
    }
  }

  await browser.close();

  console.log("");
  const caslonReq = requests.filter(u => /caslon/i.test(u));
  check("no request for Libre Caslon", caslonReq.length === 0, caslonReq[0] || [...new Set(requests.filter(u => /fonts\.googleapis/.test(u)))].join(" ; "));
  check("no network sync (GitHub requests from test contexts)", githubHits === 0, githubHits + " request(s)");

  const na = [...listNA].filter(r => !listMeasured.has(r));
  console.log("\n" + (fails === 0
    ? "PASS — " + checks + " design checks: " + ROUTES.length + " routes x " + WIDTHS.length + " widths x " +
      THEMES.length + " themes, the empty tracks, the Auto theme, cellPick, the status-bar inset and the declared hairlines; " +
      "the nav bar on " + NAV_ROUTES.length + " routes x " + THEMES.length + " themes, the tab bar, the floating tab bar and the Next card at 390/320 (T-023), the Review badge at 99/99+ in " + badgeCases + " cases, the sidebar, " +
      "reduced transparency, more contrast, reduced motion and a scroll that is a read; " +
      "lists on " + listMeasured.size + " routes" + (na.length ? " (+ " + na.join(", ") + " n/a)" : "") + " x " +
      WIDTHS.length + " widths x " + THEMES.length + " themes; the keyboard ring inside its section in " + ringsSeen +
      " contexts; the press on " + pressRows + " rows (" + pressTexts +
      " texts) in " + ALL_THEMES.length + " themes; thumbnails: " + thumbRows + " lecture rows measured across " + WIDTHS.length + " widths x " +
      THEMES.length + " themes (" + coverRows + " error fallbacks, " + thumbTexts + " texts on them), a frame that loads with and " +
      "without motion, and cover/chip contrast on " + FAC_COURSES.length + " courses in " + ALL_THEMES.length + " themes (" + facTexts + " texts); " +
      "T-024: the default (nothing stored, no stored theme, a stored Light kept), the primary action, cards, chips; " +
      "T-025: the restored dark, the solid --panel sidebar below the page, the three-option menu, removed themes paint dark " +
      "with no write, and no decoration on " + GLOW_ROUTES.length + " routes x " + WIDTHS.length + " widths x " + THEMES.length + " themes; " +
      "T-026a: the Atlas route and the Courses shelf at 1440/390 x 2 themes and the filters overflow-free at " + T26_OW.length + " widths x 2 roots, a 3-digit count beside the text at 390, no word on /atlas broken mid-word with each of " + T26_GATES.length + " gates next at " + T31_WIDTHS.length + " widths x 2 roots (" + t26Checks + " checks); " +
      "T-038: passed gates on /atlas, its head and baseline line, and the confirm sheet at 1440/390 x 2 themes (" + t38Checks + " checks); " +
      "T-026b: Problems, Exams and Proof at 1440/390 x 2 themes, " + T26B_STATES.length + " more states at 1440/390, and no overflow or mid-word break at " +
      T26B_OW.length + " widths x 3 roots (" + t26bChecks + " checks); " +
      "T-026c: Week (four tiles, the counted ones equal to storage, Seal the only primary, a render that is a read), the Calendar's day view " +
      "(one block per scheduled lecture in its faculty colour, the habits, on today, a Saturday and a Sunday) and Library (3 start cards, the guides " +
      "equal to DOCS, 5 links + \"+N\", all noopener) at 1440/390 x 2 themes, " + T26C_STATES.length + " more Week states at 1440/390, ‹ › Today tapped and keyed " +
      "at 5 more sizes (2 with motion on), and 1,149.5 / 12,345.75 BHD weeks fitting their tile at " + T26C_FIT_W.length + " widths x 2 roots (" + t26cChecks + " checks); " +
      "T-028: Practice at 1440/390 x 2 themes — the header and its week, 3 tabs, the record button >= 88px, centred, keyboard-reachable, its --bad red and --ink ring measured on the card, the hand forms filling it — the tab picked on " + T28_DAYS.length + " days, the Saturday (no Log buttons) and monthly-review cards, and whole titles at 320/390 (" + t28Checks + " checks); " +
      "T-043: the lecture quiz gate at 1440/390 x 2 themes — before watched, the quiz after a miss, the pass with Go deeper, the locked lecture and the dashboard pointing at a quiz, one primary each, Rewatch >= 44x44 (" + t43Checks + " checks)" + "; " +
      "T-045: Problems as what's due now at 1440/390 x 2 themes — one quiz waiting, one catch-up, one pset, one lab, nothing due, the daily review, a grandfathered unlock — the rows, tags and why-lines worked out from storage, Coming up <= 3, the empty state, and the dashboard's line (" + t45Checks + " checks)" + "; " +
      "T-054: Monk Mode at 1440/390 x 2 themes x 2 states, Full day shut and open — one filled primary at most, every control >= 44x44, nothing clipped, every text at 4.5:1, the 13 x 7 map, and no clip at 7 widths x roots 16/24 (" + t54Checks + " checks)"
    : "FAIL — " + fails + " of " + checks + " design checks failed"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => {
  console.error(e);
  console.log("\nFAIL — harness error after " + checks + " design checks (" + fails + " failed): " + e.message.split("\n")[0]);
  process.exit(1);
});
