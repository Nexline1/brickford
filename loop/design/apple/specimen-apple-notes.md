# T-051 mockup: Brickford in the iOS system

The owner approves this look before the app is rebuilt. Nothing in `platform/js/app.js` or `platform/css/style.css` has changed. The live app still loads `style.css` only.

## What to look at

| Screen | 390 phone (tab bar), 2x | 1440 desktop (sidebar), 1x |
|---|---|---|
| (a) Dashboard | `specimen-apple-dashboard-390-light.png`, `-390-dark.png` | `specimen-apple-dashboard-1440-light.png`, `-1440-dark.png` |
| (b) Lecture | `specimen-apple-lesson-390-light.png`, `-390-dark.png` | `specimen-apple-lesson-1440-light.png`, `-1440-dark.png` |
| (c) Problems | `specimen-apple-problems-390-light.png`, `-390-dark.png` | `specimen-apple-problems-1440-light.png`, `-1440-dark.png` |

- **Live page:** `loop/design/specimen-apple.html`. Serve the repo root with `python3 -m http.server 8766`, then open `/loop/design/specimen-apple.html`.
  - It takes `?screen=dashboard|lesson|problems` and `?theme=light|dark`.
  - The sidebar, the tab bar, the theme circle and the Light/Dark segmented control all work.
  - Its only stylesheet is the compiled `platform/css/tailwind.css`.
- **Screenshots:** `node loop/design/specimen-apple-shots.js` regenerates them. Each PNG is the whole screen, so the fixed sidebar and tab bar sit where they would at the end of a scroll.
- **The lecture screen shows two states, one above the other.** First the quiz, mid-question after a miss. Then, below a labelled divider, the passed card and Go deeper that replace it on the real page.

## Pinned versions

All three are exact pins in `package.json` devDependencies, with `package-lock.json` committed and `node_modules/` ignored.

| Package | Version | Published |
|---|---|---|
| `tailwindcss` | 4.3.3 | 2026-07-16 |
| `@tailwindcss/cli` | 4.3.3 | 2026-07-16 |
| `@fontsource-variable/inter` | 5.3.0 | 2026-07-19, 94 days before today |

**Inter, self-hosted in `platform/fonts/`:**
- Copied byte for byte from `node_modules/@fontsource-variable/inter/files/`.
- These are the "standard" files, which carry both the weight and the optical-size axes, so `font-optical-sizing: auto` works:
  - `inter-latin-standard-normal.woff2`: 72,920 bytes, sha256 `2c295d99…76fa`.
  - `inter-latin-ext-standard-normal.woff2`: 133,336 bytes, sha256 `5e6d4fe9…6a9c`. It downloads only when a page uses those code points.
- `OFL.txt` is the package's licence file, SIL Open Font License 1.1.
- The `@font-face` rules use `font-display: swap` and fontsource's unicode ranges.

**Screenshots and contrast:** run with Playwright's Chromium 1194 (`/opt/pw-browsers`), using the repo's existing Playwright install.

**`npm audit` reports 4 high-severity advisories.** They come from `braces`, through `micromatch` and `@parcel/watcher`, inside `@tailwindcss/cli`.
- That path runs only in `--watch` mode.
- It is a dev tool and is never shipped.
- `npm audit fix --force` would downgrade the CLI to 4.3.0, which breaks the pin, so I did not run it.

## Build

- **Input:** `platform/css/tailwind.input.css`. It contains:
  - `@import "tailwindcss" source(none)`;
  - `@config "../../tailwind.config.js"`;
  - `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`;
  - the `@font-face` rules;
  - the base layer;
  - the component utilities.
- **Output:** `platform/css/tailwind.css`, committed, about 32 KB. Rebuild it with `npm run build:css`, which runs `tailwindcss -i … -o … --optimize`.
  - `--optimize` runs Lightning CSS without minifying. It flattens the CSS nesting that `@utility` blocks produce, so Safari 16 works; nesting would otherwise need Safari 17.2. The output stays readable.
- **The dark variant works with the v4 CLI.** The compiled CSS contains `.dark\:shadow-none:where([data-theme="dark"], [data-theme="dark"] *)`, and the PNGs use it: the app-icon rim, the thumbnail rim and the tab-bar shadow. `bg-blue-500` is not generated, so the palette really is replaced.
- **`source(none)`** means only the config's `content` globs are scanned, not the whole repository.
- **The gate is `tools/verify-tailwind.js`.** It rebuilds into a temp file with the same flags and fails on any byte difference from the committed file, printing the first line that differs. The full log is in `specimen-apple-verify-tailwind.txt`.

| Run | Exit |
|---|---|
| Clean | 0 |
| Plant 1: a stale copy, an older build missing the `.press-row` rule | 1 |
| Plant 2: a class no page used before (`bg-orange/10`) added to the specimen, CSS not rebuilt | 1 |
| Plant 3: one token changed in `tailwind.config.js`, CSS not rebuilt | 1 |
| Restored | 0 |

## Deviations from the literal spec, and why

The owner's spec was written as Tailwind classes. Where a literal class would look non-native, the apple-design skill's rules win. Each case is listed here so it can be overruled.

1. **Font stack.** The spec says Inter. The stack is `-apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif`.
   - iPhone, iPad and Mac get the real SF; Windows and Android get the self-hosted Inter.
   - Putting Inter first would make Apple devices, the ones that set the standard, look less native.
   - The PNGs were rendered on Linux, so they show Inter.
2. **Line heights are Apple's, not 1.5.** Body is 17/22, footnote 13/18, title 20/25, large title 34/41, and so on for the whole scale. A 17px row at `leading-normal` is about 4px taller per line than iOS and reads as "web".
3. **Tracking is set per size from Inter's dynamic-metrics curve,** `-0.0223 + 0.185·e^(-0.1745·px)`:

   | Size | Tracking |
   |---|---|
   | 34px | -0.0218em |
   | 22px | -0.0183em |
   | 20px | -0.0167em |
   | 17px | -0.0128em |
   | 15px | -0.0088em |
   | 13px | -0.0032em |
   | 11px | +0.0048em |
   | 10px | +0.0100em |

   - There is no blanket value.
   - Uppercase section headers use +0.06em, where the spec had `tracking-wider` at +0.05em.
4. **Section headers are 13px regular,** where the spec had `text-xs` (12px) semibold.
   - iOS draws inset-grouped headers in Footnote: 13pt, regular, uppercase.
   - A 12px semibold uppercase grey label reads as a web "eyebrow".
   - Kept from the spec: uppercase, grey, `pl-4`, `mb-2`. All of it is packaged as the `section-header` utility.
5. **Press physics differ by element.** The spec put `transition-all duration-200 ease-out active:scale-[0.97] active:opacity-70` on everything.

   | Utility | On press | On release |
   |---|---|---|
   | `press-row` (list rows) | Background to systemGray4 (`#D1D1D6` / `#3A3A3C`) instantly; **no scale**; the separators either side hide, as in UIKit | Fades back over 300ms |
   | `press-btn` (filled buttons) | `scale(0.97)` in 80ms | 300ms on a critically damped curve |
   | `press-card` (cards and tiles) | The same scale, plus a slight dim to 0.9 | As `press-btn` |
   | `press-text` (text buttons) | Dim to 0.4; the spec had 0.7, which is barely visible on text | Back over 200ms |

   - Only `transform`, `opacity` and `background-color` transition, never `all`.
   - Under `prefers-reduced-motion`, the scale is dropped and the button dims to 0.7.
   - **Measured by pressing in Playwright, not by reading the rules:**
     - A row goes to `rgb(209,209,214)` with `transform: none`, and both neighbouring separators drop to opacity 0.
     - After release it is at 66% after 60ms, 20% after 150ms, and transparent by 400ms.
     - A button goes to `matrix(0.97,…)`. Under reduced motion it stays at `none`, with opacity 0.7.
   - **iOS Safari fires `:active` on touch only when the page has a `touchstart` listener.** The specimen registers an empty passive one, and the rebuild must too.
6. **Separators are inset to the text,** where the spec had plain hairlines.
   - They start 16px in, or 57px past a 29px icon tile (`sep-icon`).
   - They are drawn between rows only, never above the first row or below the last.
   - They are 1px on a 1x screen and 0.5px from 2x. A 0.5px line at 1x either rounds up or disappears, depending on the browser.
   - The colour is the opaque separator (`#C6C6C8` / `#38383A`), not an alpha one.
   - Measured: `0.5px@57px` at 2x, `1px@57px` at 1x, and no separator on any group's first row.
7. **Two text shades are darker than iOS,** beyond the table the owner approved.
   - **Green text is `#1F7A35` in light mode.** iOS's increased-contrast `#248A3D` is only 4.40:1 on white.
   - **Orange text is `#C93400` in light mode.** That is systemOrange's increased-contrast value.
   - The exact hues (`#34C759`, `#FF9500`, `#007AFF`, `#FF3B30`, `#8E8E93`) are used only for fills, icons, rings and tiles.
8. **The selected sidebar row is white on `#0071E3`,** in the iPadOS style; white on `#007AFF` would be 4.02:1. Pressing the selected row dims it rather than greying it, because white on systemGray4 is 1.52:1. The contrast script's pressed-state pass found that case.
9. **Every control is at least 44px.**
   - Measured at 390: no visible link or button is smaller.
   - The small action capsules in the Problems rows ("Take it", "Open", "Start") are 30px tall, App Store-style. They sit inside a row that is itself the tap target and is at least 44px tall. A 44px capsule squeezed the titles onto three lines on a phone.
10. **Colours are dynamic tokens.**
    - `bg-canvas`, `text-label` and the rest read CSS variables that the config's plugin writes once for `:root` and once for `:root[data-theme="dark"]`, as iOS system colours do. So pages never write `dark:` for a colour.
    - Every token also exists as fixed `-light` and `-dark` values (for example, `bg-canvas-dark`).
    - `dark:` is still defined, and is used for shadows and rims.
11. **The content glob is `loop/design/specimen-apple*.html`.** The literal `specimen-apple-*.html` would not match the deliverable, `specimen-apple.html`.
12. **The tab bar is the iOS 26 floating capsule,** the shape the app already uses. It is a 94% chrome material with background blur. Tab labels are 10px medium: the selected one in `#0066CC` / `#0A84FF`, the rest in `#6E6E73` / `#8E8E93`.

**Kept exactly as the owner wrote it:**
- the canvas, card and ink colours;
- iOS blue as the tint and red for destructive;
- 34px bold page headers;
- 17px regular rows and body;
- 13px medium grey captions (iOS would use regular here);
- `rounded-2xl` groups with `overflow: hidden`;
- `px-4 py-3.5` rows;
- inset grouped lists only, with no loose grids or blocky borders;
- navy and gold gone from the interface, with the crest kept as the app icon at the top of the sidebar.

**Ink colours.** The owner's `#1D1D1F` / `#F5F5F7` are apple.com's text colours, not iOS's label colours (`#000` / `#FFF`). They are kept as asked; it is a softer look.

## Content

**Real, taken from the app as it runs on 21 October 2026 (day 15, week 3) and from the T-045 branch's Problems data:**
- every course, lecture title, duration, unit and lab name;
- the quiz question and its explanation;
- the takeaway;
- the gate, its date and its 55 days;
- the "not syncing" warning.

The Dashboard shows exactly what the app shows today: "Watch: Conditional Probability, then its quiz", the three lectures and "0 of 3".

**Illustrative, because this browser has no real progress:**
- the 3-day streak and the week strip;
- "2 of 54 done" and "2 of 14";
- the quiz's two right answers;
- the passed card's "2 right on the first try".

**Simplified for the specimen:**
- Mathematics is written in Unicode here (P(A ∩ B)); the app renders it with KaTeX.
- The lecture thumbnail is a dark tile with a play glyph, where the app shows the YouTube still.
- The Go deeper rows follow the real code for MATH 130. It has no concept page, so there is no "Sketch it" row.

## Contrast

`node loop/design/specimen-apple-contrast.js` measures computed styles in the browser. The full output is in `specimen-apple-contrast.txt`.

**What it measures:**
- every visible element that owns text;
- 3 screens × 2 widths × 2 themes: **692 text elements, 25 distinct text/background pairs**;
- each element's text colour, multiplied by every ancestor's opacity, composited over its real background (the ancestor walk composites alpha layers);
- colours normalised through a canvas, so rgb, color-mix and oklab all count the same;
- a threshold of **4.5:1 for all text, large or small**.

**Result: 0 failures. Lowest 4.54:1.**

| Pair | Ratio | Where |
|---|---|---|
| `#6E6E73` on `#F2F2F7` | **4.54:1** | grey caption on the light canvas (lowest) |
| `#0A84FF` on `#1C1C1E` | 4.66:1 | tint on a dark card |
| `#FFFFFF` on `#0071E3` | 4.70:1 | filled buttons |
| `#6E6E73` on `#F9F9F9` | 4.80:1 | light tab labels |
| `#D70015` on `#FFFFFF` | 5.38:1 | red text, light |
| `#FF453A` on `#1C1C1E` | 4.99:1 | red text, dark |
| `#1F7A35` on `#FFFFFF` | 5.39:1 | green text, light |
| `#8E8E93` on `#1C1C1E` | 5.22:1 | grey text, dark |

**Caveats:**
- The tab bar is measured over the canvas colour. The material is 94% opaque over blurred content.
- **Pressed rows, not gated:** while a row is highlighted (about 300ms), grey and tint text on systemGray4 measure 3.11–3.66:1. iOS has the same pairs. This is a question for the owner, below.

## For the rebuild, and questions for the owner

1. **Class-name collisions.** The config scans `platform/js/**/*.js` as asked, so app class names that are also Tailwind utilities already produce Tailwind rules:
   - `grow`, `ring`, `table`, `border`, `rounded`, `transition`, `filter`, `transform`, `inline`, `sticky`, `static`, `visible`, `collapse`, `container`, `resize`.
   - This is harmless today, because `index.html` does not load `tailwind.css`.
   - The rebuild must rename those app classes before both stylesheets are on one page. `.grow` (the dashboard rows) would otherwise pick up `flex-grow: 1`.
2. **Pressed-state contrast:** for about 300ms, grey and tint text on the row highlight is 3.1–3.7:1, as on iOS.
   - Accept it? Or darken the highlight in light mode, which makes the press look heavier than iOS?
3. **Section headers:** 13px regular (iOS) or the spec's 12px semibold? The PNGs show 13px regular.
4. **Tracking on Apple devices:** SF receives the same letter-spacing as Inter. Inter's curve was modelled on SF's, so the two should be close. It is worth one look on the owner's iPhone. If SF looks tight, the fix is to drop tracking for SF only.
5. **Tab bar:** the floating capsule (iOS 26, and the app's current shape), or the full-width bar of iOS 18 with a hairline on top?
