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
//   - a render is a read: scrolling /lesson/math110/0/13 (a video on the page)
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
// Setup, the way every harness here does it (loop/lessons.md): each context is
// fresh, the clock is pinned (Tuesday 20 Oct 2026, noon UTC) and the timezone is
// UTC, and every http(s) request is refused and logged — nothing here needs the
// network, and the log is how "no request for Libre Caslon" is checked.
// Where a block reads colours right after a boot (the 1280 sidebar, and the
// thumbnail blocks), it first waits for the theme it asked for to be PAINTED
// (themePainted below) — the theme lag verify-contrast.js was rewritten for.
//
//   node tools/verify-design.js
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = path.resolve(__dirname, "..");
const CSS_FILE = path.join(ROOT, "platform/css/style.css");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";

// Plan day 14 (moved with reset six, START 2026-10-05; was 2026-10-06 under START 2026-09-21).
const FIXED_NOW = new Date("2026-10-20T12:00:00Z");
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
  s.quizAttempts = { "linear-algebra": [{ date: "2026-10-05", score: 9, total: 10, pct: 90 }],
                     "calculus": [{ date: "2026-10-05", score: 4, total: 10, pct: 40 }] };
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
const T38_DONE = { 1: "2026-10-09", 2: "2026-10-14" };
function seedT38() {
  if (window.top !== window) return;
  const s = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
  s.gates = { 1: { date: "2026-10-09", at: "2026-10-09T08:00:00.000Z", passed: true }, 2: "2026-10-14" };
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
  "/workshop": ["Problems", "Learning sticks when you solve, not when you watch."],
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
  { ts: "2026-10-15T09:00:00.000Z", type: "lesson", ref: "math110.0.0", data: { done: true } },
  { ts: "2026-10-16T09:00:00.000Z", type: "lesson", ref: "math110.0.13", data: { done: true } },
  { ts: "2026-10-16T10:00:00.000Z", type: "verified", ref: "math110.0.13", data: { solved: 3 } },
  { ts: "2026-10-19T09:00:00.000Z", type: "day", ref: "2026-10-19", data: {} },
  { ts: "2026-10-19T10:00:00.000Z", type: "lab", ref: "micrograd-blind", data: { done: true } },
  { ts: "2026-10-20T09:00:00.000Z", type: "lesson", ref: "math110.1.2", data: { done: true } },
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
  const labs = st.labs || {}, psets = st.psets || {};
  const vis = sel => [...document.querySelectorAll(sel)].filter(n => n.checkVisibility());
  const z = window.__dz, fill = z.tok("--btn-bg");
  const txt = (n, s) => { const x = n.querySelector(s); return x ? x.textContent.trim() : null; };
  return {
    phase,
    want: {
      rows: D.LABS.filter(l => l.phase === phase).map(l => ({ id: l.id, title: l.title, req: l.req, hours: l.hours, done: !!(labs[l.id] || {}).done })),
      sets: D.PSETS.reduce((a, g) => a + g.items.filter(i => psets[i.id]).length, 0) + " of " + D.PSETS.reduce((a, g) => a + g.items.length, 0) + " done",
      labs: D.LABS.filter(l => (labs[l.id] || {}).done).length + " of " + D.LABS.length + " shipped",
    },
    cards: vis("#view .pb-mode").map(c => {
      const act = c.querySelector(".pb-foot a, .pb-foot button"), r = c.getBoundingClientRect(), ar = act ? act.getBoundingClientRect() : null;
      return { mode: c.dataset.mode, title: txt(c, ".pb-t"), desc: txt(c, ".pb-d"), meta: txt(c, ".pb-m"), glyph: !!c.querySelector(".pb-glyph svg"),
        left: Math.round(r.left), act: act ? { text: act.textContent.trim(), tag: act.tagName, href: act.getAttribute("href"), to: act.dataset.to || null,
          w: ar.width, h: ar.height, filled: (b => b[3] === 255 && z.same(b, fill, 2))(z.bytes(getComputedStyle(act).backgroundColor)) } : null };
    }),
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
  };
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
  {
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
    await page.reload({ waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await frames(page);
    const c = await page.evaluate(readTheme);
    check("switch (c): Light picked from the menu after the switch survives a reload (light, stored \"light\" + marker)",
      c.theme === "light" && c.bg === rgb(BRIEF.light["--bg"]) && c.meta === PANEL.light && c.stored.theme === "light" && c.stored.mark === true &&
        c.picks.some(p => p.pick === "light" && p.on),
      "data-theme " + c.theme + ", --bg " + c.bg + ", meta " + c.meta + ", stored " + JSON.stringify(c.stored));
    check("switch (a)/(c): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  {
    // (c2) a device with nothing stored picks Light, then reloads: the pick
    // carries the marker, so it is not mistaken for the old default.
    const { ctx, page, errors } = await fresh(browser, { viewport: { width: 1280, height: 800 }, colorScheme: "dark" }, undefined);
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await pickTheme(page, "light");
    await page.reload({ waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await frames(page);
    const r = await page.evaluate(readTheme);
    check("switch (c2): nothing stored, Light picked, reload: stays light (stored \"light\" + marker)",
      r.theme === "light" && r.bg === rgb(BRIEF.light["--bg"]) && r.stored.theme === "light" && r.stored.mark === true,
      "data-theme " + r.theme + ", --bg " + r.bg + ", stored " + JSON.stringify(r.stored));
    check("switch (c2): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
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
    await go(page, "/lesson/math110/0/13");
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
    "s.gates = " + JSON.stringify(Object.fromEntries(passed.map((n, i) => [n, "2026-10-1" + (2 + i)]))) + ";" +
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
  const T38_ALL = { 1: "2026-10-09", 2: "2026-10-14", 3: "2026-10-15", 4: "2026-10-16", 5: "2026-10-19" };
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
  // Bahrain (UTC+3) at 02:00 on 21 Oct, a lecture watched that day and a
  // lecture paused at 23:00Z on the 20th are the same day; compared raw,
  // "2026-10-21" beat "2026-10-20T23:00:00.000Z" and MATH 110 led. On the
  // same day the live resume point leads.
  for (const w of [1440, 390]) {
    const mobile = w < 861, at = w + "px Asia/Bahrain 21 Oct 02:00";
    const ctx = await browser.newContext({ timezoneId: "Asia/Bahrain", reducedMotion: "reduce", viewport: { width: w, height: 900 }, isMobile: mobile, hasTouch: mobile });
    await ctx.clock.setFixedTime(new Date("2026-10-20T23:00:00Z"));
    await ctx.route(/^https?:/, r => { if (/api\.github\.com/.test(r.request().url())) githubHits++; return r.abort(); });
    await ctx.addInitScript(() => {
      if (window.top !== window) return;
      localStorage.setItem("darhikmah_v1", JSON.stringify({ settings: { theme: "dark", themeNavyOnce: true }, studyDays: [], lessons: {
        "math110.0.0": { done: true, doneAt: "2026-10-21", notes: "", checks: [] },
        "ai200.0.1": { done: false, notes: "", checks: [], pos: 300, posAt: "2026-10-20T23:00:00.000Z" } } }));
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
  // a 2px sweep, 320 to 1440 at roots 16, 20 and 24, found every one).
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
    const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce", viewport: { width: o.w, height: o.h },
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

  async function t26bProblems(page, at, o) {
    await go(page, "/workshop");
    const p = await page.evaluate(t26bPrimary), m = await page.evaluate(t26bWorkshop);
    c26b(at + " /workshop: the header is h1 \"Problems\" and \"" + T26B_HEAD["/workshop"][1] + "\"", headOk(p, "/workshop"), JSON.stringify(p.head));
    c26b(at + " /workshop: three mode cards — Daily drill, Problem sets, Labs — each a glyph tile, a title and a one-line description",
      m.cards.map(c => c.title).join("|") === "Daily drill|Problem sets|Labs" && m.cards.every(c => c.glyph && !!c.desc),
      m.cards.map(c => c.title + (c.glyph ? "" : " (no glyph)")).join(", "));
    if (o.cols) {
      const cols = new Set(m.cards.map(c => c.left)).size;
      c26b(at + " /workshop: the mode cards are " + o.cols + " column" + (o.cols === 1 ? "" : "s") + " wide", cols === o.cols, cols + " distinct columns");
    }
    const f = p.filled[0];
    c26b(at + " /workshop: Daily drill holds the only filled primary — \"Start\" to #/drill — and reads \"10 min\"",
      p.filled.length === 1 && f.mode === "drill" && f.href === "#/drill" && f.text === "Start" && m.cards[0] && m.cards[0].meta === "10 min",
      p.filled.map(x => (x.mode || "?") + " \"" + x.text + "\" " + x.href).join("; ") || "no filled button in the view");
    c26b(at + " /workshop: the primary is inside the first viewport (under the bar, above the tab bar and the Next bar)", inView(p, f),
      where(f) + ", room " + p.top.toFixed(0) + "-" + p.floor.toFixed(0) + ", scrollY " + p.scrollY);
    const opens = [1, 2].map(i => m.cards[i] && m.cards[i].act);
    c26b(at + " /workshop: Problem sets reads \"" + m.want.sets + "\" and Labs \"" + m.want.labs + "\", each with an Open pill >= 44x44 that is not filled",
      !!m.cards[2] && m.cards[1].meta === m.want.sets && m.cards[2].meta === m.want.labs &&
        opens.every(a => a && a.text === "Open" && !a.filled && a.w >= 44 && a.h >= 44),
      m.cards.slice(1).map(c => "\"" + c.meta + "\" " + (c.act ? c.act.text + " " + c.act.w.toFixed(0) + "x" + c.act.h.toFixed(0) + (c.act.filled ? " filled" : "") : "no action")).join("; "));
    c26b(at + " /workshop: the stat box is gone (no .onecounts in the view)", m.statBox === 0, m.statBox + " found");
    c26b(at + " /workshop: \"This phase’s labs\" heads the list, its meta the phase (" + m.phaseName + ")",
      !!m.head && m.head.t === "This phase’s labs" && m.head.meta === m.phaseName, JSON.stringify(m.head));
    const rowsOk = m.rows.length === m.want.rows.length && m.rows.every((r, i) => {
      const w = m.want.rows[i];
      return r.id === w.id && r.title === w.title && r.hours === "~" + w.hours + " h" && r.checked === w.done && r.box && r.h >= 44;
    });
    c26b(at + " /workshop: the list has one row per lab of phase " + m.phase + " (" + m.want.rows.length + "), in order — a checkbox, the title, ~N h, ticked as stored, >= 44px",
      m.want.rows.length > 0 && rowsOk, m.rows.map(r => r.id + " \"" + r.title + "\" " + r.hours + (r.checked ? " [x]" : " [ ]") + " " + r.h.toFixed(0) + "px").join("; "));
    const descBad = m.rows.filter((r, i) => {
      const w = m.want.rows[i]; if (!w || !r.desc) return true;
      const d = r.desc.replace(/…$/, ""), cut = d !== r.desc;
      const next = w.req.charAt(d.length);
      return r.desc.length > 51 || !d.length || w.req.indexOf(d) !== 0 || /[;,]/.test(d) || /[A-Za-z0-9]/.test(next) ||
        (!cut && !/^([;,:.]|\s—|$)/.test(w.req.slice(d.length)));
    });
    c26b(at + " /workshop: each row's description is its lab's first clause, at most ~50 characters, cut only at the end of a word",
      m.rows.length > 0 && descBad.length === 0, (descBad.length ? "bad: " : "") + (descBad.length ? descBad : m.rows).map(r => "\"" + r.desc + "\"").join("; "));
    c26b(at + " /workshop: the problem sets" + (m.otherFold.length > 1 ? " and the other phases' labs" : "") + " stay behind their folds, under the list",
      m.setsFold && m.otherFold.indexOf("Problem sets — pen and paper") >= 0 && (m.phase === 3 || m.otherFold.indexOf("Labs in the other phases") >= 0),
      m.otherFold.join(" | "));
    if (o.click) {
      const w0 = await writesNow(page);
      await page.click("#view .pb-mode[data-mode=sets] .pb-open");
      const sets = await page.waitForFunction(() => { const d = document.querySelector("#view details#pbSets"); if (!d || !d.open) return false;
        const t = document.querySelector("#topbar"), top = t && t.checkVisibility() ? t.getBoundingClientRect().bottom : 0, r = d.getBoundingClientRect();
        return r.top >= top - 1 && r.top < window.innerHeight * 0.6; }, null, { timeout: 4000, polling: "raf" }).then(() => true, () => false);
      c26b(at + " /workshop: Problem sets' Open opens the problem-set fold and brings it into view", sets);
      await page.click("#view .pb-mode[data-mode=labs] .pb-open");
      const labs = await page.waitForFunction(() => { const d = document.querySelector("#view #pbLabs");
        const t = document.querySelector("#topbar"), top = t && t.checkVisibility() ? t.getBoundingClientRect().bottom : 0, r = d.getBoundingClientRect();
        return r.top >= top - 1 && r.top < window.innerHeight * 0.6; }, null, { timeout: 4000, polling: "raf" }).then(() => true, () => false);
      c26b(at + " /workshop: Labs' Open brings the labs list into view", labs);
      const w1 = await writesNow(page);
      c26b(at + " /workshop: both Opens are in memory — no save() (state writes " + w0 + " -> " + w1 + ")", w1 === w0);
    }
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
      patch: { diag: { "diag-la": { score: 80, date: "2026-10-19" } },
               lessons: Object.fromEntries([0, 1, 2, 3, 4].map(i => ["math120.0." + i, { done: true, doneAt: "2026-10-18", notes: "", checks: [] }])) } },
    { name: "every bank open", routes: ["/exams"],
      patch: { lessons: Object.fromEntries(["math120.0.0", "math130.0.0", "ai200.0.0", "math210.0.0", "ai310.0.0"].map(k => [k, { done: true, doneAt: "2026-10-18", notes: "", checks: [] }])) } },
    { name: "Gate 1 passed, so a bank leads", routes: ["/exams"], patch: { gates: { 1: "2026-10-12" } } },
    // T-038 review round 1: an unmark is stored as an object, which is truthy.
    // Gate 1 unmarked is open, so the next diagnostic still leads, tagged
    // "· Gate 1" with the days to the gate — read off the page itself below,
    // not only through the expectation above.
    { name: "Gate 1 unmarked (stored { passed: false }), so it is open and a diagnostic leads", routes: ["/exams"], gate1Open: true,
      patch: { gates: { 1: { date: null, at: "2026-10-19T09:00:00.000Z", passed: false } } } },
    // Review round 1: every other state has nothing watched in a locked
    // bank's course, so a bar drawn at 0 passed. Eight MATH 110 lectures that
    // no Linear Algebra question waits on: the bank stays locked at 8/51.
    { name: "eight MATH 110 lectures watched, none a question's, so Linear Algebra is locked at 8 of 51", routes: ["/exams"], empty: true, lockedWatched: true,
      patch: { lessons: Object.fromEntries([0, 3, 4, 7, 9, 10, 11, 12].map(i => ["math110.0." + i, { done: true, doneAt: "2026-10-18", notes: "", checks: [] }])) } },
    // Review round 1: with the three maths diagnostics sat the coding one
    // leads, and the approved mockup tags it CS 150 — readiness is problems
    // solved of 150 (30 here, so a bar drawn at 0 cannot pass).
    { name: "the three maths diagnostics sat, so the coding diagnostic leads, with 30 problems solved", routes: ["/exams"],
      patch: { diag: { "diag-la": { score: 80, date: "2026-10-19" }, "diag-calc": { score: 75, date: "2026-10-19" }, "diag-prob": { score: 72, date: "2026-10-19" } },
               problems: Object.fromEntries(T26B_PROBLEMS.slice(0, 30).map(k => [k, "2026-10-18"])) } },
    { name: "a two-entry chain (genesis reached) after a streak reset", routes: ["/record"],
      patch: { ledger: T26B_SHORT, settings: { streakFrom: "2026-10-19" } } },
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
  const T26B_TEXT = "#view .page-head, #view .pb-modes, #view .pb-labs, #view .ghead, #view .ex-hero, #view .ex-open, #view .ex-locked, " +
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
      "T-026a: the Atlas route and the Courses shelf at 1440/390 x 2 themes and the filters overflow-free at " + T26_OW.length + " widths x 2 roots (" + t26Checks + " checks); " +
      "T-038: passed gates on /atlas, its head and baseline line, and the confirm sheet at 1440/390 x 2 themes (" + t38Checks + " checks); " +
      "T-026b: Problems, Exams and Proof at 1440/390 x 2 themes, " + T26B_STATES.length + " more states at 1440/390, and no overflow or mid-word break at " +
      T26B_OW.length + " widths x 3 roots (" + t26bChecks + " checks)"
    : "FAIL — " + fails + " of " + checks + " design checks failed"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => {
  console.error(e);
  console.log("\nFAIL — harness error after " + checks + " design checks (" + fails + " failed): " + e.message.split("\n")[0]);
  process.exit(1);
});
