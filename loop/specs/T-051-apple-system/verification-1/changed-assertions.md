# T-051-1: changed assertions

Every change below is an assertion moved to the new value it measures, or a new assertion. Review round 1's seven
fixes are folded in, each marked "review r1". **No assertion was
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
| Every visible .btn's corners (5 routes × 2 widths × 2 themes) | filled 999px; ghost, danger, bare 12px | every kind PAINTS a capsule: the used corner radius (the declared one clamped to the box, as the browser clamps it) less the transparent edge is a circle of half the painted height, ±1.5px, on all four corners | The owner, 2026-10-29: buttons "too plain"; the ghost and the danger are tinted capsules, the bare one a text button whose hover fill is a capsule. Review r1 (fix 5): measured as painted, not read as "999px", because the paint is the padding box inside a 5px top-and-bottom edge and its declared radius is 340px / 440px (999px there paints 22×17px ellipses; plant `corners-999`). The T-024 primary-action check's own "999px" clause moved to the same painted test. |
| The sidebar crest (1280, both themes) | the field is --gold, cut-outs --panel | the field is **--crest**, at #d3a874 (Light) / #e0b35a (Dark), and not --gold; cut-outs --panel | Review r1 (fix 2): --gold became iOS orange and took the seal off the home-screen icon's colours. --crest is pinned to what the crest painted before T-051 (caramel in Light, from the espresso sidebar's --panel-accent; gold in Dark) and joins the token tables. Plant `crest-is-gold`. |
| `.ghead` (5 list routes × 2 widths × 2 themes) | sentence case, 20px, 600, no rule | uppercase, 13px, 400, **and --ink-2** (added), no rule | The owner's decision of 2026-10-22 ("Section headers are 13px regular uppercase"), applied after his phone showed the heads as the biggest text on screen. |
| `.gh-meta` | 15px --ink-2, tabular | 13px --ink-2, tabular, **text-transform none** | The count sits in the header, at its size. Review r1 (fix 7): not uppercased with it, because "50m" and "1h56" are units ("50M", "1H56"). Plant `meta-uppercase`. |

## tools/verify-design.js — new assertions (T-051-1)

| check | what it holds | plant |
|---|---|---|
| 390 light: the body face | `font-family` is exactly `-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif`, both Inter FontFaces exist, one is `loaded`, none `error`, and `document.fonts.check("17px Inter")` | — (verify-offline's precache plant covers the file going missing) |
| 390 light: the iOS type scale, 24 routes | no text node with a letter in it renders over 17px in `#view`, except the view's h1, which must be 34px; figures (numerals, a stepper's "+"), course covers and lecture thumbnails (artwork, T-016) and the transcript's "Brickford" wordmark are named exemptions | `row-title-22-design` (.g-t at 22px) |
| 390 light: every button's hit box ≥ 44x44 | the border box, which is where a tap lands (the 5px transparent border is part of the element and its hit test) | — (verify-shell's own 44px sweep is unchanged and still measures the border box) |
| 390 and 1280 light: every button PAINTS 30-38px | border box minus the top and bottom borders, with `background-clip: padding-box`, and (review r1, fix 4) all four border colours transparent | `button-paints-44` (the 5px transparent border taken away: the hit box stays 44, the paint becomes 44); `border-painted` (the edge painted in the fill colour) |
| 390 light: a full-width primary PAINTS the column (review r1, fix 5) | .btn.one-go, .ex-sit, .rail-card .btn, .lsn-act .btn.lg: paint left and right within 1px of the parent's content edges | `edge-inset` |
| 390 and 1280 light: a button that starts its line paints from the column's edge (fix 5) | every non-tiny button whose paint or box is within 6px of its parent's content-left paints from it within 1px | `edge-inset` |
| 390 and 1280 light: no hit box runs into a neighbour's (fix 5) | no two visible buttons under one parent have intersecting boxes | — |
| 1280, both themes: the hover (review r1, fix 1) | every button in #view and the NEXT bar, forced `:hover` on 7 routes: opacity stays 1, the label is >= 4.5:1 on its fill (composited at its opacity), filled, tinted and text kinds each present, and the hover changes the paint on every one | `hover-opacity` (the unguarded opacity 0.88 back) |
| 390, both themes: no hover on a phone (fix 1) | the same buttons, forced `:hover` under (hover: none): fill, label and opacity unchanged | `hover-opacity` |
| install colours (review r1, fix 6) | manifest.json theme_color is the default theme's --panel #1c1c1e (as index.html's static meta) and background_color its --bg #000000; the Theme menu's swatches are each theme's --bg | `manifest-espresso` |
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

## tools/verify-clip.baseline.json — 208 stale entries removed, 0 added (182, then 26 in review r1)

797 → 615 entries. The new face, the smaller type and the wrapping quiz footer stopped 182 known clips (T-002 132:
the drawer crest's wordmark, `div.crest` and `div.name-en`, at 768px with a 24px root, on every route; T-003 50: the
quiz, drill and diagnostic pages, /electives, /transcript and /recall at a 24px root). Each was reported STALE by both the UTC and the TZ=America/Los_Angeles run,
identically, so each survived a re-measure. The list is `clip-stale-removed.txt`. Nothing new clips: both runs say
"0 new".

Review r1: fix 5's take 2 made a button's box 10px narrower, and the phone's `min-width: 44px` on .btn replaces a flex
item's automatic minimum, so at 320px the quiz's and the diagnostic's numeric rows squeezed the button under its own
word: 4 new findings (their rows, "234>230"). The answer field now gives way instead (`:has(> input + .btn) > input
{ min-width: 0 }`, the button `flex-shrink: 0`), which also cleared 26 known T-003 clips of those same buttons and
rows; they are removed (615 → 589), listed at the end of `clip-stale-removed.txt`.

## tools/verify-density.js — a new gate, and its baseline

Copied from the reference branch (bc4416b) and pointed at main: `.grow` rows (the branch had renamed them
`.g-row`), verify-design's clock (2026-11-01) and seed (value for value; the branch's two quiz scores dated before
START are not in verify-design's seed), and /monk added to the routes. Baseline measured twice on this branch,
identical both times (160 findings, 1983 first-viewport words over 34 route-widths; 156 after review r1, below), each finding owned by the page
step that will fix it. Plants: `density-two-line-sub`, `density-dashboard-sentence`, `density-more-words`.

## verify-density: the first-screen word ceilings against main's (review r1)

**Smaller type put more words on the first screen.** main (3968924), measured with this same gate, has 1872
first-viewport words over the 34 route-widths; this branch has 1983. The 13px section headers, the 17px card
titles and the 34px buttons take less height, so more of each page rises into the first 844 (or 568) pixels. That
is the measurement the owner asked to see, not a regression this PR hides: the page PRs (T-051-2 shell, T-051-3
Dashboard, then the pages) cut these ceilings, and each may only come down. 20 route-widths rose above main's
(21 before review r1; 320 /monk fell below main's with fix 3):

| route-width | main | T-051-1 ceiling | change |
|---|---|---|---|
| 320 /calendar | 50 | 53 | +3 |
| 320 /course/math110 | 54 | 67 | +13 |
| 320 /courses | 32 | 35 | +3 |
| 320 /drill | 49 | 50 | +1 |
| 320 /exams | 49 | 54 | +5 |
| 320 /lesson/math110/0/13 | 34 | 45 | +11 |
| 320 /practice | 39 | 41 | +2 |
| 320 /record | 36 | 39 | +3 |
| 320 /sync | 30 | 36 | +6 |
| 320 /transcript | 23 | 34 | +11 |
| 320 /treasury | 49 | 70 | +21 |
| 320 /workshop | 49 | 69 | +20 |
| 390 / | 75 | 88 | +13 |
| 390 /atlas | 52 | 54 | +2 |
| 390 /courses | 51 | 59 | +8 |
| 390 /exams | 69 | 71 | +2 |
| 390 /lesson/math110/0/13 | 89 | 92 | +3 |
| 390 /record | 58 | 65 | +7 |
| 390 /review | 60 | 61 | +1 |
| 390 /transcript | 52 | 70 | +18 |

And 7 fell below main's:

| route-width | main | T-051-1 ceiling | change |
|---|---|---|---|
| 320 /atlas | 37 | 35 | -2 |
| 390 /calendar | 74 | 69 | -5 |
| 390 /course/math110 | 87 | 84 | -3 |
| 390 /monk | 73 | 70 | -3 |
| 390 /sync | 93 | 74 | -19 |
| 390 /treasury | 84 | 80 | -4 |
| 390 /workshop | 95 | 89 | -6 |

**The baseline itself moved during review r1, before it ever merged.** Re-measured twice, identically, after the
round's fixes: three ceilings changed against the first T-051-1 measurement — 390 /transcript 65 → 70 (fix 7: the
lower-case meta is narrower, so a section header fits on one line and the page below it rises), 390 /monk 68 → 70
and 320 /monk 40 → 33 (fix 3) — and four /monk findings no longer occur and were deleted: `title|390|/monk|Maghrib &
Isha` (the one the review named: `.g-main`'s `flex: 1` basis of 0 let a row fit by squeezing the title to its 7rem
floor; with `flex: 1 1 auto` the value wraps under the title instead), and with it `title|320|/monk|Cut 4–5 clips from
the stream`, `title|320|/monk|Editing — stream → clips` and `title|390|/monk|Editing — stream → clips`. 156 findings
remain, none new.

## Review r1, fix 5: the first take was undone because verify-clip failed it

The review asked for `margin-inline: -5px` (and `calc(100% + 10px)` on full-width buttons, with >= 10px between
neighbours) so the paint would line up with the column. That was built and committed (a7edffd), and verify-clip then
reported **805 new findings**: every such button sticks 5px out of its parent, which the sweep reads as overflow
("285>280, overflow-x visible"), and that baseline may only shrink. So take 2 (d22ee3a) undid it — the margins, the
widths, the four CSS gaps and the nine inline gaps in app.js, which is back to main's — and moved the 5px transparent
edge to the top and bottom only. Across, the paint is the box (min-width: 44px keeps the finger's width), so it is
on the column without leaving its parent, and the corners are an elliptical 340px / 440px so the paint stays a true
capsule. The checks the review asked for (full-width paint = column ±1px, edge, no overlap) hold it.

## Colour fixes the new tokens forced (style.css, tokens and colour only)

| where | was | now | measured |
|---|---|---|---|
| `.lq-card .opt.correct .key`, `.wrong .key` | --ink-2 | --ink | verify-design T-043 quiz block: the iOS grey #6e6e73 is 4.01-4.17:1 on Light's tinted options |
| `.beat-n`, `.mstep .mnum` | accent 12% into transparent | accent 8% into --surface | verify-contrast: 4.19:1 over the light page; 4.98:1 now |
| dark `--accent-soft` | (reference) #0b1a2b | #212e3e | see above |
| `.btn:hover` (review r1, fix 1) | opacity 0.88, every pointer | inside `@media (hover: hover)`: filled → --btn-bg-hover #0060c1; ghost → the accent 20% into --surface under --accent-hover (#0057ad Light, #66b0ff Dark); danger → --bad 14% under --bad-hover (#b70012, #ff8781); text kinds → the 12% tint under --accent | verify-design forced :hover: filled 6.10:1, ghost 5.24 / 5.42:1, text 4.68 / 5.06:1 (Light / Dark); opacity 0.88 had been 3.84–4.47:1 |
| `.crest` field and wordrule (fix 2) | --gold | --crest (#d3a874 Light, #e0b35a Dark) | the home-screen icon's caramel |
| `.topbar` under reduced motion (found in review r1's gate run) | the title and the edge had `transition: none`; the bar kept the kill-switch's 0.01ms `all` | the bar too | verify-design's reduced-motion check (unchanged) failed in 1 of 2 runs: a no-op scrollbar-color transition on #topbar, 5 of 30 repeats on this branch, 0 of 30 on main, 0 of 30 without Inter, 0 of 60 with this line |
| manifest.json, Theme swatches (fix 6) | #2b2118, #f2f1ee, #0e0e10 | theme_color #1c1c1e, background_color #000000; swatches #f2f2f7 and #000000 | the default theme's --panel and --bg |
