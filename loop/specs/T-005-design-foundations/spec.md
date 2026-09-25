# T-005: Design foundations: the iOS type ramp, the system font, new tokens and a design gate

Source: `loop/design/brief.md` §3 (owner decision 2026-09-25, "premium, iOS-native"). The look to hit is `loop/design/specimen-*.png`.

## Problem
The app's foundations encode the old "register" stance, which the owner has now replaced:
- **Serif display face.** `--font-display` is Libre Caslon Text (`platform/css/style.css:143`), used by every heading and list title (`:426`, `:439`, `:485`, `:625`, `:658`, …). Numbers use JetBrains Mono (`:144`). Both load from Google Fonts (`platform/index.html:34-43`).
- **Square corners everywhere:** `--radius: 2px; --radius-lg: 2px` (`style.css:174`).
- **Key-cap depth on controls:** `--lift`, `--btn-gloss` and `--sink` (`style.css:97-119`, restated per theme at `:251-257`, `:316-322` and `:356-362`). iOS controls are flat fills.
- **Stated stance to rewrite.** The stylesheet header (`style.css:1-31`) says "a register, not an app". It must not contradict the new direction.
- **No Auto theme.** Theme is a fixed pick (`index.html:124-132`, applied at `app.js:4874-4889`). Nothing follows the phone's light/dark setting.
- **Missing keyframes.** `.cal-cell.sel` animates `cellPick`, but there is no `@keyframes cellPick` (`style.css:979`), so the selected calendar day never animates.
- **Nothing measures any of it.** No gate asserts a design token, so a later change can put the serif or the 2px corner back and every gate stays green.

## Learner outcome
- Every screen reads like a native iOS app: the phone's own font, headings sized and tracked the way iOS does it, rounded controls, and flat fills.
- Light and dark follow the phone when set to Auto.
- Nothing is lost at a larger text size, because the whole ramp is in rem.

## Scope
The smallest change that lands the brief's §3 tokens globally, without restyling individual screens (screens are T-006 onward).
1. **Type:**
   - `--font-display` and `--font-body` become the brief's system stack. Add `--font-rounded` (`ui-rounded` first). `--font-mono` is kept for code only.
   - Add the text-style tokens (`--fs-large` … `--fs-caption`, with line height and tracking per the brief table). Map h1 to the large title (34px phone, 40px desktop), h2 to title 2, h3 to title 3, and body to 17px.
   - Retire the separate phone type step (`style.css:1641-1647`) in favour of the ramp.
   - Numbers that used mono for alignment use `font-variant-numeric: tabular-nums` in the body face.
   - Remove the Google Fonts request for Libre Caslon. JetBrains Mono stays only if something still uses `--font-mono`; otherwise remove it too.
2. **Shape and depth:**
   - Add `--r-sm` 8, `--r-md` 12, `--r-lg` 16 and `--r-xl` 22. `--radius` becomes `--r-md` and `--radius-lg` becomes `--r-lg`.
   - `--lift`, `--lift-press`, `--btn-gloss` and `--sink` become flat: no gloss and no inset. Keep the tokens and set their values, so no rule changes shape.
   - Add `--float`, the one soft shadow, for sheets and menus.
3. **Colour:**
   - The light theme (`:root`) and `[data-theme="dark"]` get the brief's lead-pair values, including the new `--accent-fill`, `--accent-soft` and `--gold`.
   - The other five themes keep their colours and must still pass contrast.
4. **Auto theme:**
   - A new `data-theme-pick="auto"` button labelled "Auto", listed first.
   - `applyTheme` resolves "auto" through `matchMedia('(prefers-color-scheme: dark)')` to light or dark, and follows changes live. `meta theme-color` follows too.
   - The stored setting is the string `"auto"`. An older device that does not know it falls back to light, which is the existing `|| "light"` path, so nothing breaks.
5. **Stance and keyframes:**
   - Rewrite the header comment (`style.css:1-31`) to state the iOS-native intent and point to `loop/design/brief.md`.
   - Define `@keyframes cellPick`: a critically damped scale from 0.92 to 1, gated by reduced motion.
6. **New gate, `tools/verify-design.js`.**
   - Setup: Playwright with the pinned clock and timezone (loop/lessons.md). Routes `/`, `/course/math110`, `/lesson/math110/0/13`, `/calendar` and `/workshop`, at 390 (isMobile) and 1280, in light and dark.
   - It asserts:
     - no element's computed `font-family` contains "Caslon";
     - the page h1 is 34px at 390 and 40px at 1280, weight 700, letter-spacing −0.022em ±0.002;
     - `.btn` border-radius is 12px;
     - the theme tokens resolve to the brief's hex values;
     - with `S.settings.theme = "auto"`, emulated `colorScheme: dark` resolves `--bg` to `#000000`, and `light` resolves it to `#f2f1ee`;
     - the selected calendar cell has a running `cellPick` animation (via `getAnimations()`).

     It prints one summary line in one unit and exits 1 on any failure.
   - Add it to config's CHECK line.
7. **The header sits under the iPhone status bar.** In the owner's home-screen screenshot of 2026-09-26, the clock and signal overlap "DASHBOARD". `platform/index.html:5` sets `viewport-fit=cover`, and `:19` sets `apple-mobile-web-app-status-bar-style: black-translucent`, so the page draws under the status bar. But no rule in `style.css` uses `env(safe-area-inset-top)`. The fix: the sticky phone `.topbar` gets `padding-top: env(safe-area-inset-top)`, its min-height grows by the same amount, and its background covers the inset. Anything else pinned to the top (the drawer's top edge, `.edge-grab`, the theme menu) is offset by the same amount. The desktop layout is unchanged.
8. Bump every `?v=` token.

## Out of scope
- **Screen layouts:** nav bar, tab bar and sidebar (T-006), lists (T-007), and the dashboard, lesson and quiz screens (T-009 onward).
- **The other five themes' colours**, apart from any fix contrast forces.
- **PROTECTED paths.** `docs/CONTENT-STANDARD.md` rules still hold: solid inks and scoped `--panel`.
- **`platform/data/`**, curriculum and plan changes.
- **New dependencies.** Removing the Google Fonts request is a removal.

## Acceptance criteria
1. `node tools/verify-design.js` exits 0, and its summary names the number of checks.
2. **Planted bugs.** Each of these makes `verify-design.js` exit 1, with output saved to `verification/plant-*.txt`:
   - (a) `--font-display` set back to Libre Caslon;
   - (b) `--radius` set back to 2px;
   - (c) the `@keyframes cellPick` block deleted;
   - (d) `applyTheme` treating "auto" as light regardless of the scheme.
3. `verify-contrast.js` passes 420 renders across all 7 themes. No ink is an alpha value.
4. `verify-shell.js` passes: 44×44 targets and nothing fixed over text.
5. `verify-clip.js` reports 0 new findings. Baseline entries that the font change resolved are removed, and none are added. If the new face creates a clipping finding, the builder fixes it in this item.
6. `verify-content`, `verify-sync-loop`, `verify-logic` and `verify-flows` all pass. Typecheck is clean.
7. No request to `fonts.googleapis.com` for Libre Caslon appears in the page. Evidence: a network log in `verification/`.
8. **Status bar.** `verify-design.js` reads `platform/css/style.css` from disk. It must not use `document.styleSheets`, which throws on `file://`. It asserts that the phone `.topbar` rule contains `env(safe-area-inset-top)` in its padding-top. Chromium cannot emulate a notch, so this is a source assertion. Planted bug (e): remove it, and the gate exits 1.
9. Screenshots of home, course and lesson at 390 (light and dark) and 1280 (light), saved beside `loop/design/before/`.

## Verification checklist
- [ ] typecheck and all gates, with verify-design added to the CHECK line
- [ ] the four planted-bug runs exit 1
- [ ] contrast in 7 themes
- [ ] clip with 0 new findings; the baseline only shrank
- [ ] screenshots at 390 light/dark and 1280, compared with `loop/design/before/`
