# T-023: Floating glass tab bar you can slide along

Source: `loop/design/brief.md` §9 (owner, 2026-10-06: "the bottom bar where I can scroll between tabs, that's important"). The owner chose "slide along the bar" and approved the look in `loop/design/specimen-navy-home-slide-390.png`. Builds on T-024.

## Problem
- **The phone tab bar is pinned to the screen edge.** It's a full-width bar (`.tabbar`, `platform/css/style.css`, plus `#tabbar` in `platform/index.html`) that only responds to taps.
- **No gesture.** Batelco's bar floats as a glass capsule, and its selection bubble glides between tabs. The owner wants to slide a finger across it and have the bubble follow.
- **Switching tabs loses your place.** Scroll position isn't remembered per tab.
- **Tapping the active tab does nothing**, where iOS scrolls back to the top.

## Learner outcome
- One thumb moves between Today, Courses, Exams, Problems and Review. It feels direct, and you always land where you left each tab.

## Scope
1. **Layout:**
   - A capsule 14px in from each side.
   - It sits at `calc(12px + env(safe-area-inset-bottom))` from the bottom and is 70px tall, `border-radius: 999px`.
   - Glass: `--surface` at about 78% with `backdrop-filter: blur(22px) saturate(170%)`, a 1px hairline edge and a soft shadow. Solid under reduced transparency.
   - Page content gets bottom padding so nothing sits under the bar (the "nothing fixed over text" gate).
   - At 44×44 or more per tab, the T-001 large-text fit still holds at 320/390px with 16/24px roots.
2. **Bubble:** a glass pill behind the active tab, with the active icon and label in `--accent` (gold in navy).
3. **Slide to switch:**
   - `pointerdown` on the bar calls `setPointerCapture`.
   - The bubble tracks the finger 1:1, horizontally, centred on the finger.
   - Past the first or last tab it rubber-bands (brief §2 / the apple-design rubber-band function).
   - On `pointerup`, the target is the tab nearest the bubble's projected position (momentum projection). The bubble springs there with the existing `spring()` (`platform/js/app.js` ~1318, damping 1.0, response about 0.35) and the route changes.
   - A tap with under 10px of movement behaves as a normal tap.
   - Vertical drags are ignored (hysteresis), so page scrolling is never blocked.
4. **Tap the active tab:** scrolls the page to the top (smooth; instant under reduced motion).
5. **Per-tab scroll memory:** leaving a tab stores `scrollY` in memory, keyed by tab route; returning restores it after render. The value is never persisted. Render is a read.
6. **Badge:** the Review tab shows a count of due reviews, from existing state and read-only, with a solid badge colour at 4.5:1 or better.
7. **Desktop:** unchanged (the sidebar).
8. Bump every `?v=` token.

## Out of scope
- New tabs.
- Haptics: iOS web has no Vibration API.
- The opening screen (T-022) and the Home layout (T-017).
- PROTECTED paths and new dependencies.

## Acceptance criteria
1. **Geometry, in `verify-shell` and `verify-design`:** at 390 and 320px the bar is a capsule whose box is 14px (±1) from both edges and above the safe area. Every tab is at least 44×44, and no text sits under the bar on 23 routes.
2. **Slide, in `verify-flows`, using CDP touch or pointer events:**
   - Press on Today and move 60% of the way toward Courses: the bubble's translateX follows within 2px of the finger.
   - Release: the route becomes `/courses`, and the bubble settles centred on Courses.
   - Slide past Review: the bubble resists, moving less than the finger.
   - A vertical drag of 40px does not switch tabs.
3. **Tap the active tab** at `scrollY` 800: it returns to 0.
4. **Scroll memory:** Today scrolled to 600, go to Courses, come back: `scrollY` is 600 (±2).
5. **Render is a read:** sliding and switching make zero `save()` calls (`verify-sync-loop` is unchanged and still green).
6. **Planted bugs**, each exiting 1:
   - (a) the bubble ignores the finger and only moves on release;
   - (b) a vertical drag switches tabs;
   - (c) scroll memory is not restored;
   - (d) the bar overlaps text (padding removed).
7. **All gates green** on the final bytes, and screenshots at 390 in navy and light, including one mid-slide.
