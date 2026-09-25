# Brickford design brief: premium, iOS-native

Owner decision, 2026-09-25: the app should look and feel like a premium app on the App Store, phone first and desktop too. Every design spec (T-005 onward) points here. If a spec and this brief disagree, the brief wins until the owner changes it.

## 1. The decision, and what it replaces

**What it replaces.** `platform/css/style.css` opens with "a register, not an app". That stance means:
- ruled content, not cards;
- square corners and nothing floating;
- a Libre Caslon serif display face.

It was a deliberate choice, made on 20 Sep 2026 *against* the iOS grouped list.

**The new decision.** The owner chose the iOS-native direction on 25 Sep 2026: large titles, inset grouped lists, translucent chrome, the system font and spring motion. T-005 rewrites that header so the stylesheet states the current intent instead of contradicting it.

**What does not change:**
- **The structure** the register work produced. There is one primary action per screen, a list for anything that repeats, and numbers in a right-hand column. Only the clothes change.
- **The brand.** Navy and gold, and the crest. The accent stays in the navy family, gold stays for the crest and achievement moments, and the app icon is untouched.
- **Every rule in `docs/CONTENT-STANDARD.md` (PROTECTED):**
  - inks are solid colours, never alpha;
  - 4.5:1 contrast in all 7 themes;
  - `--panel` is allowed only on the sidebar and tab bar;
  - no overflow at 320px;
  - motion only where it shows change.
- **Every CLAUDE.md gate:**
  - 44×44 targets;
  - no fixed control over text;
  - a render is a read;
  - REST_DOW and the start date.

**Themes.** Light and dark lead, and a new **Auto** setting follows the phone. The other five themes (parchment, forest, midnight, latte, slate) inherit the new shapes, type and spacing. They keep their own colours and must keep passing `verify-contrast`, but they are not tuned screen by screen.

## 2. Principles (from `/apple-design`, applied here)

1. **Respond on press-down.** Every tappable already has press feedback, which is good. Keep it at ≤100ms, `scale(.97)`, and never only on release.
2. **Critically damped springs by default** (damping 1.0, response 0.3–0.4). Bounce (damping about 0.8) only after a flick. The drawer spring (`app.js`, around line 1306) is the house spring; sheets reuse it.
3. **Enter and exit on the same path.** A sheet that rises from the bottom leaves downward. The theme menu grows from its trigger.
4. **Translucent chrome, a scroll-edge effect instead of rules.** The nav bar and tab bar are materials with content scrolling under them. The 1.5px ink rule under the topbar goes; a hairline appears only once content is actually under the bar.
5. **Hierarchy comes from weight, size and leading together.** It does not come from caps, letter-spacing and rules. Uppercase tracked labels are the register's voice; the iOS voice is sentence case.
6. **Tracking depends on size.** Large titles are tight (−0.022em), body is 0, captions +0.01em.
7. **Respect text size.** Everything is rem-based, so a larger phone text setting scales the layout (T-001's lesson).
8. **Fallbacks are part of the design:**
   - `prefers-reduced-motion`: cross-fades, no slides;
   - `prefers-reduced-transparency`: solid chrome;
   - `prefers-contrast: more`: solid backgrounds and defined borders.
9. **One primary action per screen.** The screen's single filled button is the thing to do next. Everything else is tinted, gray or plain.
10. **Progress is shown, not stated** (Brilliant, Duolingo, Apple Fitness):
    - a ring for today;
    - a week strip for the six study days, with Saturday visibly rest;
    - a streak that opens its calendar.

## 3. Target tokens

These are the values T-005 lands. Anything not listed keeps its current value until a later spec changes it.

### Type: system font, iOS text styles, in rem (1rem = 16px, so larger text still scales)

The family is `-apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", Roboto, sans-serif`. Numbers use `font-variant-numeric: tabular-nums`. Big stat numbers use `ui-rounded` first (SF Pro Rounded on Apple, falling back to the system face). JetBrains Mono stays for code only. Libre Caslon is dropped, and so is its Google Fonts request.

| Style | Size / line | Weight | Tracking |
|---|---|---|---|
| Large title | 2.125rem (34) / 1.2 | 700 | −0.022em |
| Title 1 | 1.75rem (28) / 1.2 | 700 | −0.02em |
| Title 2 | 1.375rem (22) / 1.25 | 700 | −0.015em |
| Title 3 | 1.25rem (20) / 1.25 | 600 | −0.01em |
| Headline | 1.0625rem (17) / 1.3 | 600 | −0.005em |
| Body | 1.0625rem (17) / 1.45 | 400 | 0 |
| Callout | 1rem (16) / 1.4 | 400 | 0 |
| Subhead | 0.9375rem (15) / 1.35 | 400 | 0 |
| Footnote | 0.8125rem (13) / 1.35 | 400 | 0.005em |
| Caption | 0.75rem (12) / 1.3 | 500 | 0.01em |

On desktop (≥ 861px) the large title steps up to 2.5rem. Everything else keeps the same values.

### Colour, light and dark (the lead pair)

Every ink is solid, and every pair is checked by `verify-contrast`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#f2f1ee` | `#000000` | grouped page background (warm, not iOS's cool `#f2f2f7`) |
| `--surface` | `#ffffff` | `#1c1c1e` | cells, cards |
| `--surface-2` | `#f7f6f3` | `#2c2c2e` | gray fills, pressed cells |
| `--line` | `#dcdad5` | `#38383a` | hairline separators (non-text) |
| `--ink` | `#111111` | `#ffffff` | primary label |
| `--ink-2` | `#5c5a55` | `#a1a1a6` | secondary label (≥ 4.5:1 on `--bg` and `--surface`) |
| `--ink-3` | `#6e6b65` | `#8e8e93` | tertiary; still text, so still 4.5:1 |
| `--accent` | `#1e4f8f` | `#78aef0` | tint: links, the active tab, tinted-button labels |
| `--accent-fill` | `#1e4f8f` | `#2f6bbd` | filled-button and done-day fill; label is always white (≥ 5.3:1) |
| `--accent-soft` | `#e6edf6` | `#1a2a3f` | tinted-button fill (label = `--accent`, ≥ 4.5:1) |
| `--gold` | `#8a5f12` | `#e0b35a` | crest, streak, achievement; never an action |
| `--good` / `--bad` / `--urgent` | current values | current values | unchanged |

### Shape, space, depth

- **Radius:**
  - `--r-sm` 8: chips, small tiles.
  - `--r-md` 12: list sections, inputs, buttons.
  - `--r-lg` 16: cards.
  - `--r-xl` 22: the hero card and sheets.
  - Capsules use 999px.
- **Spacing:** a 4pt grid (4, 8, 12, 16, 20, 24, 32, 40, 48) in rem. The page gutter is 16px on phone and 20px from 390px up. The gap between sections is 32px.
- **Depth:**
  - Cards sit on `--bg` by contrast of fill, not shadow.
  - One soft shadow is reserved for things that truly float: sheets, menus, the hero card on desktop. The value is `0 1px 2px rgb(0 0 0 / .06), 0 8px 24px rgb(0 0 0 / .08)` in light; in dark the shadow is replaced by a 1px `--line` border.
  - The `--lift`, `--btn-gloss` and `--sink` key-cap depth goes. iOS controls are flat fills.
- **Materials:** chrome is `color-mix(in srgb, var(--surface) 78%, transparent)` with `backdrop-filter: blur(20px) saturate(180%)`. Reduced transparency gives the solid `--surface`.

## 4. Components

- **Nav bar (phone):**
  - A 44px bar with a centred inline title (17/600), which appears only after the large title has scrolled under it.
  - The large title sits in the page flow beneath it.
  - Leading: the menu button. Trailing: a capsule chip, e.g. "Day 14 · Wk 3".
  - Material background; a hairline appears only once content is under the bar.
- **Tab bar:**
  - 49px plus the safe area, material background, a 0.5px top hairline.
  - 24px glyphs, 10px/500 labels in sentence case.
  - Active tab `--accent`, inactive `--ink-3`.
  - Keeps T-001's `min(…, 3.5vw)` cap.
- **Buttons:**

  | Kind | Look | Use |
  |---|---|---|
  | Filled | `--accent-fill` with white 17/600 label, 50px tall, `--r-md`, full width on phone | the screen's one primary action |
  | Tinted | `--accent-soft` fill with an `--accent` label | secondary actions |
  | Gray | `--surface-2` fill with an `--ink` label | tertiary actions |
  | Plain | `--accent` text only | inline actions |
  | Destructive | tinted, in `--bad` | destructive actions |

- **Inset grouped list** (`.ghead` / `.glist` / `.grow`):
  - **Section:** a `--surface` block with `--r-md` corners, a 16px inset from the page edge, and 32px between sections.
  - **Section header:** Title 3 in sentence case, with its meta on the right in Subhead `--ink-2`.
  - **Rows:** at least 44px (56 with a subtitle); headline title, subhead subtitle, value in `--ink-2` with tabular numerals, then a chevron.
  - **Separators:** hairlines inset from the text's leading edge.
- **Hero card (Today):**
  - `--surface`, `--r-xl`, 20px padding.
  - Eyebrow: "Up next · MATH 120" (footnote, 600, `--accent`).
  - Title 2 title, subhead meta, and a progress ring for today on the right.
  - A full-width filled button: "▶ Open lecture".
- **Week strip:** six study-day dots plus Saturday as rest. Done days are filled, today is ringed, rest is a dash. It opens the calendar.
- **Stat tiles:** a 2×2 grid inside one section, each tile a `ui-rounded` 28/600 number over a caption label. These replace the ruled boxed grid on the course page.
- **Sheets:** they rise from the bottom with `--r-xl` top corners and a grabber, and can be dragged to dismiss using the drawer spring. Theme, backup and settings move into sheets.

## 5. Screen roadmap (one spec each, three specced per loop run)

| Item | Screen / area | Premium target |
|---|---|---|
| **T-005** | Foundations + `verify-design.js` gate | Tokens above; Auto theme; header stance rewritten; `@keyframes cellPick` defined |
| **T-006** | Chrome | Collapsing large title, material nav and tab bar, scroll-edge hairline; desktop sidebar as material |
| **T-007** | Lists | Inset grouped sections everywhere `.glist` is used |
| T-008 | Controls | Button hierarchy, segmented control, switch, inputs |
| T-009 | Today (dashboard) | Hero card, ring, week strip, streak chip; "Needs attention" as a compact list |
| T-010 | Lesson | Full-bleed video on phone, sticky primary action, summary beats as cards, knowledge checks inline (the Imprint pattern) |
| T-011 | Quiz, drill, review | Large answer cards, spring correct/wrong states, progress bar across the top |
| T-012 | Calendar, record | iOS Calendar month grid; the streak opens its calendar (the Duolingo pattern); refined heatmap |
| T-013 | Sheets | Theme, backup, settings as bottom sheets |
| T-014 | Motion polish | No opacity-0 first frame under reduced motion; `riseIn` and `viewIn` gated |
| T-015 | Desktop | Content column, hover states, rail material |

T-002 and T-003 (clipping) stay in the queue, and T-003 should land before T-009 and T-011.

## 6. How a design item is proven

Taste is not a gate, so each spec proves itself three ways:

1. **Computed style, not screenshots.** `tools/verify-design.js` (added in T-005, extended by each item) asserts the tokens on real elements at 390 and 1280, in light and dark. Examples: the h1 font-size and letter-spacing, the list section radius, the tab bar's `backdrop-filter`.
2. **The existing gates stay green:** contrast in all 7 themes, shell (44×44 and nothing over text), clip, and the rest. A new gate is shown failing on a planted bug first.
3. **Before and after screenshots** at 390 (light and dark) and 1280, beside `loop/design/before/`. The owner looks at them at the training-mode SHIP pause.

## 7. References

The owner named appshots.design, screensdesign.com, refero.design, pageflows.com, gummble.com, collectui.com and revyl.com. All seven are blocked by this environment's network policy (checked twice on 2026-09-25), so no screens were studied directly. What was taken from their published text:
- Imprint: bite-sized lesson cards with knowledge checks inside the flow.
- Duolingo: tapping the streak opens a month calendar.
- Brilliant: streaks and XP, and a loading motif that carries identity.
- Brainscape: mastery, totals and time together on a progress view.

The rest comes from the `/apple-design` skill (Apple's WWDC design talks). Screenshots the owner drops into `loop/inbox.md` get folded into this brief.

Before census (this environment, 2026-09-25, T-001 branch): `loop/design/before/<screen>-<390-light|390-dark|1280-light>.png`, covering home, lesson, courses, course, calendar, quiz, workshop and record. Note that the cloud browser cannot reach Google Fonts, so the serif and mono in these shots are fallbacks, not Libre Caslon or JetBrains Mono.
