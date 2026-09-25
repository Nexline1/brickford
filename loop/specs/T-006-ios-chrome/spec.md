# T-006: iOS chrome: a collapsing large title, a material nav bar and tab bar, and a sidebar material

Source: `loop/design/brief.md` §2.4 and §4 ("Nav bar", "Tab bar"). The look is the top and bottom of `loop/design/specimen-today-*.png`. Depends on T-005's tokens.

## Problem
**Phone running head.** The phone topbar is a register folio:
- small-caps serif page name, a mono day/week meta, and a hard 1.5px ink rule underneath (`platform/css/style.css:1680-1723`, filled by `mountTopbar()` at `platform/js/app.js:1512`);
- the page's own h1 sits below it as a second title.

On iOS the large title *is* the page head, and the inline title only appears once the large title has scrolled under the bar.

**Tab bar.** It is a dark `--panel` slab in the light theme:
- uppercase tracked 0.62rem labels (`style.css:1751-1770`);
- the active tab is marked by colour alone, in gold.

On iOS it is a light material in light mode: sentence-case labels, a tinted active tab, and a hairline top edge.

**Desktop sidebar.** It is the same dark espresso slab (`style.css:456`, `--panel: #2b2118` at `:125`) beside a light page. A premium desktop app uses a sidebar material in the page's own scheme, with a tinted selection pill.

## Learner outcome
- On the phone every page opens with one big, clear title. Scrolling hands it off to a small title in a translucent bar, so there is always room to read and it is always clear where you are.
- The tab bar recedes behind the content instead of being a heavy block, and the current tab is obvious at a glance.

## Scope
1. **Nav bar, phone (≤ 860px):**
   - The topbar becomes a 44px sticky material bar:
     - background `color-mix(in srgb, var(--bg) 78%, transparent)` with `backdrop-filter: blur(20px) saturate(180%)`;
     - leading: the menu button (44×44);
     - centre: the inline title at 17px/600, hidden (opacity 0) while the page h1 is visible;
     - trailing: a capsule chip holding the existing day/week meta, in the body face with tabular numerals.
   - The 1.5px rule is replaced by a 0.5px `--line` hairline, shown only while content is scrolled under the bar (scroll-edge effect).
   - Implementation: one IntersectionObserver on the view's h1 plus a top sentinel. It only toggles classes. A render is a read: nothing is persisted, and no `save()` is called.
   - Folio and kicker duplication: the page h1 *is* the large title, so the `tb-taken` hiding (`style.css:1721-1723`) is adjusted to avoid a double title.
2. **Tab bar:**
   - Background `color-mix(in srgb, var(--surface) 78%, transparent)` with the same blur, and a 0.5px `--line` top edge.
   - Labels 0.625rem/500 in sentence case, with no letter-spacing, keeping T-001's `min(…, 3.5vw)` cap. Glyphs 24px.
   - Active tab `--accent`, inactive `--ink-3`.
   - `--panel` is re-scoped per `docs/CONTENT-STANDARD.md`: the tab bar stops painting it.
3. **Sidebar (≥ 861px):**
   - A material in the page's own scheme: `--surface` at 85% with blur, and a 0.5px `--line` trailing edge.
   - Nav items get an `--accent-soft` selection pill with `--r-sm` corners and an `--accent` label.
   - The crest and wordmark stay.
   - `--panel` is kept only where CONTENT-STANDARD requires it, and its ink is re-scoped.
4. **Fallbacks:**
   - `prefers-reduced-transparency: reduce` gives solid `--surface` or `--bg` chrome with no blur (extend `style.css:1882-1900`).
   - `prefers-contrast: more` gives solid chrome plus a 1px `--line-strong` edge.
   - Reduced motion makes the inline-title swap instant.
5. Bump every `?v=` token.

## Out of scope
- **List and screen restyling** (T-007, T-009 onward).
- **Drawer behaviour**, which already has its spring.
- **The railbar's layout** (it only inherits the material).
- **PROTECTED paths** (the CONTENT-STANDARD rules are obeyed, not edited), curriculum and plan changes, and new dependencies.

## Acceptance criteria
1. **Nav bar computed style**, in `verify-design.js` (extended), at 390 in light and dark on `/`, `/course/math110` and `/calendar`:
   - `.topbar` has a `backdrop-filter` containing `blur(20px)` and is 44px tall (±1);
   - the inline title's opacity is 0 at scroll 0, and 1 after the h1 has been scrolled 200px under the bar;
   - the hairline is absent at scroll 0 and present after scrolling.
2. **Tab bar computed style**, in the same gate: the label's `text-transform` is `none`, the active tab's colour equals `--accent`, and `backdrop-filter` contains `blur(20px)`.
3. **Sidebar at 1280**, in the same gate: the sidebar background is not `--panel`'s espresso `#2b2118`, and the current nav item's background equals `--accent-soft`.
4. **Reduced transparency.** With `prefers-reduced-transparency` emulated (or a forced class if Chromium cannot emulate it), the topbar and tab bar compute `backdrop-filter: none` and an opaque background.
5. **Planted bugs.** Each makes `verify-design.js` exit 1, with output in `verification/`:
   - (a) the observer removed, so the inline title is always visible;
   - (b) the tab-bar labels set back to uppercase.
6. `verify-shell.js` passes: sidebar present at 8 desktop widths, the drawer and hamburger below 860px, nothing fixed over text on 23 routes × 5 phone widths, and 44×44 targets. The tab-bar block from T-001 still passes.
7. `verify-sync-loop.js` passes: the observer must not arm a push or repaint a playing video.
8. `verify-contrast` (all 7 themes), `verify-clip` (0 new), `verify-content`, `verify-logic` and `verify-flows` all pass. Typecheck is clean.
9. Screenshots at 390 in light and dark, scrolled to 0 and to 300px, on `/` and `/course/math110`, plus 1280 in light.

## Verification checklist
- [ ] typecheck and all gates
- [ ] two planted-bug runs exit 1
- [ ] the scroll-state screenshots at 390 light/dark plus 1280
- [ ] a render-is-a-read check: no `save()` from the observer
