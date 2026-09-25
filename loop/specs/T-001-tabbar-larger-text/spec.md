# T-001: The tab bar fits at larger text sizes

## Problem
With a larger phone text size (24px root), `nav#tabbar` is 397px wide on a 320 or 390px
screen. "Review" is cut off at 390px and falls entirely off-screen at 320px, on all 32
routes.
- Cause: `.tabbar a` in `platform/css/style.css:1762-1767` has `flex: 1` but no
  `min-width: 0`. The labels are letterspaced caps in rem (`0.62rem`, `0.06em`), so they
  grow with the root font and force every tab wider than its share.
- Evidence: `verify-clip` baseline entries tagged T-001 (from T-000).
- The owner uses a larger text size, so this happens every day.

## Learner outcome
All five tabs (Home, Courses, Exams, Problems, Review) are visible and tappable on the
phone at any text size. "Review", the spaced-recall entry point, can always be reached
in one tap.

## Scope
CSS only, in `platform/css/style.css`: make the five tabs share the bar at any root size,
for example with `min-width: 0` on the tabs and a label that shrinks, wraps or clamps
rather than overflows. The tab row, glyphs and order stay as they are. Bump the `?v=`
cache tokens.

## Out of scope
- the sidebar and desktop layout
- other clipping (T-002, T-003)
- PROTECTED paths
- new dependencies

## Acceptance criteria
1. At a 24px root and 320 and 390px widths, on every route, no `nav#tabbar` finding is
   left in verify-clip, and every T-001 line is deleted from
   `tools/verify-clip.baseline.json`. No entry is added.
2. All five tabs are fully inside the viewport and at least 44×44 at 320 and 390px, at
   16 and 24px roots. Evidence: `verify-shell.js` stays green, plus a new or extended
   assertion at the 24px root.
3. At a 16px root the tab bar looks unchanged. Evidence: before and after screenshots at
   390px.
4. All gates are green.

## Verification checklist
- [ ] typecheck and all 7 gates green
- [ ] screenshots at 320 and 390px, 16 and 24px roots, before and after
- [ ] the baseline only shrank
