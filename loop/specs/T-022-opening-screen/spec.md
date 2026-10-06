# T-022: The opening screen: navy into gold, crest zoom, wordmark fade

Source: `loop/design/brief.md` §9 (owner, 2026-10-06: "the first thing that happens when I'm clicking on the app … the logo is zooming out and zooming in … important that you add it"). The look is `loop/design/specimen-navy-splash-*.png` and the live `specimen-navy.html#splash`. The PROTECTED exception for this animation was approved by the owner on 2026-10-06 and written into `docs/CONTENT-STANDARD.md` by T-024.

## Problem
Opening the app shows the page building itself. There's no branded first moment, and on iPhone the native launch frame is a blank white or black screen.

## Scope
1. **The overlay:** `#launch` sits at the very top of `<body>` in `platform/index.html`, with critical inline CSS so it paints before `style.css`. It's a full-screen navy-into-gold gradient (the brief §9 opening-screen gradient), with the crest and "Brickford" / "Self-built university" centred.
2. **Motion:**
   - The crest scales 0.86 → 1.06 → 1 over about 900ms (`cubic-bezier(.2,.7,.2,1)`).
   - The wordmark fades and rises in from 360ms.
   - About 1.1s in, once the first render has completed (whichever is later), the overlay cross-fades out over 280ms and is removed from the DOM.
   - Hard cap of 2.5s, even if the app errors.
3. **When it plays:** once per cold launch (a `sessionStorage` flag, wrapped in try/catch). A route change or a re-render never plays it.
4. **Reduced motion:** a still lockup, then a 150ms fade out once rendered.
5. **It never blocks:** `pointer-events: none` while fading, and removed after. The app boots underneath at the same time, with no added delay.
6. **iOS startup images:** `tools/make-icons.mjs` is extended to render the overlay's first frame as `apple-touch-startup-image` PNGs for current iPhone sizes (portrait). `index.html` links them with the matching media queries, so iOS's native launch frame is the overlay's first frame.
7. **`theme-color` while it shows:** navy `#0d1636`.
8. Bump every `?v=` token.

## Acceptance criteria
1. **In `verify-design`:**
   - On a fresh load `#launch` is visible with the gradient and lockup.
   - It is gone from the DOM within 2.5s.
   - After removal, a click at the screen centre reaches the app (`elementFromPoint` is not inside `#launch`).
   - A second render or a route change does not show it again in the same session.
2. **Reduced motion:** there is no running animation on the crest (`getAnimations()` is empty), and the overlay is removed within 1s of the first render.
3. **Startup images:** every linked `apple-touch-startup-image` file exists, and its pixel size matches its media query.
4. **Planted bugs**, each exiting 1:
   - (a) the overlay is never removed;
   - (b) it plays on every route change;
   - (c) it intercepts taps after it fades;
   - (d) it animates under reduced motion.
5. **All gates green.** `verify-shell`'s "nothing fixed over text" excludes `#launch` only while it is present and fading.
6. **Frames:** start, middle and end captured at 390 in both themes.
