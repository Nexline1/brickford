# T-051-1: changed assertions

Every change below is an assertion moved to the new value it measures, or a new assertion. **No assertion was
removed, skipped or loosened**, and no threshold moved. The contrast gate is untouched (4.5:1, both themes, Light and
Dark — the two themes main has). Where a row names a plant, that plant exits 1 (`plants-run.txt`).

## tools/verify-design.js — the token tables (old → new)

`BRIEF` is the table "the theme tokens resolve to the brief's values" checks on real elements in both themes at 390
and 1280, and that the Auto, default, switch and first-paint blocks read `--bg` from. Until T-051-1 the light half was
loop/design/brief.md §3 and the dark half T-025's restored a309b5a block with its three exceptions; it is now the iOS
palette in Apple's accessible shades, the values the reference branch bc4416b measured, with one deviation (dark
`--accent-soft`, below). Same 30 tokens, same elements, new values:

| token | Light | Dark |
|---|---|---|
| `--bg` | #f2f1ee → #f2f2f7 | #0e0e10 → #000000 |
| `--bg-2` | #f2f0ea → #f2f2f7 | #141416 → #000000 |
| `--surface` | #ffffff → #ffffff | #1c1c1e → #1c1c1e |
| `--surface-2` | #f7f6f3 → #f2f2f7 | #2c2c2e → #2c2c2e |
| `--surface-float` | #ffffff → #ffffff | #22272f → #2c2c2e |
| `--line` | #dcdad5 → #c6c6c8 | #38383a → #38383a |
| `--line-strong` | #c7c0b3 → #aeaeb2 | #3d454f → #48484a |
| `--ink` | #111111 → #1d1d1f | #ffffff → #f5f5f7 |
| `--ink-2` | #5c5a55 → #6e6e73 | #a1a1a6 → #98989d |
| `--ink-3` | #6e6b65 → #6e6e73 | #8e8e93 → #98989d |
| `--accent` | #1e4f8f → #0066cc | #78aef0 → #409cff |
| `--accent-fill` | #1e4f8f → #0071e3 | #2f6bbd → #0071e3 |
| `--accent-soft` | #e6edf6 → #e0eefc | #1a2a3f → #212e3e |
| `--gold` | #8a5f12 → #c93400 | #e0b35a → #ff9f0a |
| `--accent-2` | #3f6ea0 → #2a68c0 | #9ec2e8 → #64a8ff |
| `--good` | #2a7047 → #1f7a35 | #62b881 → #30d158 |
| `--bad` | #b32d1f → #d70015 | #e8705c → #ff6961 |
| `--urgent` | #9a5a16 → #c93400 | #d99a4e → #ff9f0a |
| `--btn-bg` | #241f1a → #0071e3 | #e8ebef → #0071e3 |
| `--btn-ink` | #ffffff → #ffffff | #0f1216 → #ffffff |
| `--accent-fill-ink` | #ffffff → #ffffff | #0f1216 → #ffffff |
| `--fac-math` | #35608f → #4947c3 | #7aa6da → #9b99ff |
| `--fac-ai` | #88592b → #a22a00 | #d9ab6d → #ff9f0a |
| `--fac-sys` | #26665f → #09616b | #63b3aa → #40c8e0 |
| `--fac-phys` | #9c4534 → #a90010 | #d98071 → #ff766e |
| `--fac-res` | #63498a → #793c97 | #a58ac9 → #da8fff |
| `--fac-speech` | #8a4a63 → #aa0c38 | #c98fac → #ff7691 |
| `--panel` | #2b2118 → #ffffff | #000000 → #1c1c1e |
| `--panel-ink` | #f2ece2 → #1d1d1f | #e8ebef → #f5f5f7 |
| `--panel-accent` | #d3a874 → #0066cc | #7fb0e6 → #409cff |

**Dark `--accent-soft` is #212e3e, not the reference branch's #0b1a2b.** #0b1a2b is darker than the #1c1c1e card,
and this gate's own press check measured the sidebar's current pill at 1.031:1 against the sidebar ("the pressed
fill stands off the sidebar (>= 1.05:1)" failed at 390 and 1280). The reference branch had moved the current row to
`--accent-fill`, which T-051-1 does not do (no sidebar redesign), so the pill keeps `--accent-soft` and the token
was solved instead: the tint 14% into the card, 1.24:1 against it, `--accent` on it 4.86:1.

| assertion | was | now | why |
|---|---|---|---|
| `PANEL` (derived from `BRIEF`): meta theme-color, index.html's first-paint `PANEL` map, the sidebar and drawer fill | light #2b2118, dark #000000 | light #ffffff, dark #1c1c1e | `--panel` is the card colour (the approved mockup's sidebar). index.html's map and its static `<meta name="theme-color">` moved with it; the "map equals the stylesheet" check is unchanged. |
| `PRIMARY`: every filled .btn, the .btn.lg, the toast | light #241f1a under #ffffff; dark #e8ebef under #0f1216 | #0071e3 under #ffffff in both (4.70:1) | iOS's filled button. The 4.5:1 floor in the same check is unchanged. |
| `WIDTHS`: "the page h1 is the large title" | 390: 34px; 1280: 40px | 34px at both | The iOS large title is 34 at every width; the desktop 2.5rem step is gone from style.css. -0.022em ±0.002 unchanged (the token is -0.0218em). |
| 1280 sidebar: "darker than the page — its luminance below the page --bg's" | `lSide < lPage` | "the card colour (--surface), lighter than the page": `same(bg, --surface) && lSide > lPage` | The approved mockup's sidebar is white beside #f2f2f7 and #1c1c1e beside black. The neighbouring "a solid --panel, no backdrop-filter, no image" check is unchanged and still pins the exact hex. |
| 390 tab bar: "a material … not the --panel slab" | `material(bg, --surface, 0.78) && !same(bg, --panel)` | `material(…) && !(same(bg, --panel) && alpha === 255)` | --panel now equals --surface in both themes, so a 78% --surface material has --panel's rgb by construction. "Not the slab" is read as "not SOLID": `material()` still demands alpha 0.78 and blur(22px) saturate(170%), so a solid slab still fails. |
| Every visible .btn's corners (5 routes × 2 widths × 2 themes) | filled 999px; ghost, danger, bare 12px | every kind 999px | The owner, 2026-10-29: buttons "too plain". The ghost and the danger are tinted capsules, the bare one a text button whose hover fill is a capsule. |
| `.ghead` (5 list routes × 2 widths × 2 themes) | sentence case, 20px, 600, no rule | uppercase, 13px, 400, **and --ink-2** (added), no rule | The owner's decision of 2026-10-22 ("Section headers are 13px regular uppercase"), applied after his phone showed the heads as the biggest text on screen. |
| `.gh-meta` | 15px --ink-2, tabular | 13px --ink-2, tabular | The count sits in the header, at its size. |

## tools/verify-design.js — new assertions (T-051-1)

| check | what it holds | plant |
|---|---|---|
| 390 light: the body face | `font-family` is exactly `-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif`, both Inter FontFaces exist, one is `loaded`, none `error`, and `document.fonts.check("17px Inter")` | — (verify-offline's precache plant covers the file going missing) |
| 390 light: the iOS type scale, 24 routes | no text node with a letter in it renders over 17px in `#view`, except the view's h1, which must be 34px; figures (numerals, a stepper's "+"), course covers and lecture thumbnails (artwork, T-016) and the transcript's "Brickford" wordmark are named exemptions | `row-title-22-design` (.g-t at 22px) |
| 390 light: every button's hit box ≥ 44x44 | the border box, which is where a tap lands (the 5px transparent border is part of the element and its hit test) | — (verify-shell's own 44px sweep is unchanged and still measures the border box) |
| 390 and 1280 light: every button PAINTS 30-38px | border box minus the top and bottom borders, with `background-clip: padding-box` | `button-paints-44` (the 5px transparent border taken away: the hit box stays 44, the paint becomes 44) |
| 390 and 1280 light: labels | 15px / 600, .tiny's compact 12px aside | — |
| 390 and 1280 light: the kinds | filled = --btn-bg under --accent-fill-ink; tinted = the accent 12% into --surface (red 8% for .danger) under the accent (or --bad), padding-box; text = no fill | — |
| 390 light press, motion allowed and reduced | a filled and a tinted button, forced `:active`: matrix(0.97 …) and opacity 0.7; under reduced motion transform none and opacity 0.7 | — |

The first draft of the paint check failed on its first run, correctly: `.btn.ghost { background: … }` (the
shorthand) reset `background-clip` to border-box, so the tint painted the transparent hit edge too and the ghost was
a 44px slab. The fix was in style.css (`background-color` in every .btn variant), not in the check.

## tools/verify-offline.js — new assertions

| check | what it holds | plant |
|---|---|---|
| install: the shell cache | `wantShell` now also has every woff2 css/style.css names (read from the file on disk) | `inter-not-precached` |
| install: the fonts | every woff2 in platform/fonts is named by style.css and held by this version's cache | `inter-not-precached` |
| offline: the face | on the last route visited offline, the Inter FontFaces include `loaded` and no `error` | `inter-not-precached` |

## tools/verify-clip.baseline.json — 182 stale entries removed, 0 added

797 → 615 entries. The new face, the smaller type and the wrapping quiz footer stopped 182 known clips (T-002 132:
the drawer crest's wordmark, `div.crest` and `div.name-en`, at 768px with a 24px root, on every route; T-003 50: the
quiz, drill and diagnostic pages, /electives, /transcript and /recall at a 24px root). Each was reported STALE by both the UTC and the TZ=America/Los_Angeles run,
identically, so each survived a re-measure. The list is `clip-stale-removed.txt`. Nothing new clips: both runs say
"0 new".

## tools/verify-density.js — a new gate, and its baseline

Copied from the reference branch (bc4416b) and pointed at main: `.grow` rows (the branch had renamed them
`.g-row`), verify-design's clock (2026-11-01) and seed (value for value; the branch's two quiz scores dated before
START are not in verify-design's seed), and /monk added to the routes. Baseline measured twice on this branch,
identical both times (160 findings, 1983 first-viewport words over 34 route-widths), each finding owned by the page
step that will fix it. Plants: `density-two-line-sub`, `density-dashboard-sentence`, `density-more-words`.

## Colour fixes the new tokens forced (style.css, tokens and colour only)

| where | was | now | measured |
|---|---|---|---|
| `.lq-card .opt.correct .key`, `.wrong .key` | --ink-2 | --ink | verify-design T-043 quiz block: the iOS grey #6e6e73 is 4.01-4.17:1 on Light's tinted options |
| `.beat-n`, `.mstep .mnum` | accent 12% into transparent | accent 8% into --surface | verify-contrast: 4.19:1 over the light page; 4.98:1 now |
| dark `--accent-soft` | (reference) #0b1a2b | #212e3e | see above |
