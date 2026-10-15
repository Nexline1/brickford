# T-026a: Atlas as a route, Courses as a shelf

Source: owner, 2026-10-07. "I went into the Atlas and it's really not clear what this is all about ... make it self-explanatory." And: "the structure and the layout of the buttons in the Atlas courses is the same thing. It's just a stack on top of each other." The owner approved the mockups `loop/design/specimen-atlas.png` and `loop/design/specimen-courses.png` ("Yes, this direction"). Build them in the theme that T-025 lands: restored Dark, Light, Auto.

## Problem
- `V.atlas` and `V.courses` (`platform/js/app.js`) are both a ruled folio plus `.glist` rows, so the two pages look the same.
- Neither page shows its purpose at a glance:
  - Atlas is the whole 3½-year route, but it reads as a list.
  - Courses is where you pick up a lecture, but it reads as a list too.

## Learner outcome
- **Atlas:** one look tells you where you are on the route to April 2030, what the next gate needs and how long is left.
- **Courses:** one look takes you back into the course you were watching.

## Scope

### Atlas (`V.atlas`)
1. **Header.** An `h1` "Atlas", then one line: "Your route to <Month YYYY>, in five gates." The month is the last gate's target from `gatePlan()`.
   - This replaces the folio kicker.
   - The day/week folio meta may stay as it is on other pages.
2. **Route card.** One `.card`:
   - a horizontal track with six evenly spaced nodes: Start plus the five gates from `gatePlan()`;
   - under each node, its label and target month (`MMM YYYY`);
   - passed gates are filled `--accent`, the next gate gets an `--accent` ring, later gates are hollow;
   - a fill runs from Start toward the next gate, in proportion to the study days elapsed in the current segment;
   - a "You are here · day N" pin sits above the fill's end.
   - At phone width (under 600px) the track turns vertical, with nodes stacked and labels to the right. Text must never overlap. verify-clip and verify-shell hold this.
3. **Next gate card.**
   - The kicker "Next gate · n of 5", then the gate label.
   - Its requirements (`req` split on " · ") as chips, each with a hollow circle. Requirements have no done-state data yet, so all are hollow; inventing state is out of scope.
   - On the right: a big number with "days left" under it.
   - The card links to `#/transcript`, as now.
   - When every gate is passed, the existing "All gates passed" copy appears in the same card.
4. **"Studying now".**
   - A grid of tiles: 3 columns at 1024px and up, 2 at 600–1023px, 1 below 600px.
   - Each tile shows the code in the faculty colour, the title, a meta line ("x of y proven", or "x of 150 problems" for the tracker) and a small progress ring (conic-gradient or SVG) showing `courseMastery`.
   - The whole tile is the link to `#/course/<id>`, with at least a 44px hit target.
5. **"Opens later".**
   - Compact chips: `<code> week N`, sorted by start.
   - Show at most 5, then a "+N" chip that links to `#/courses?later`. A filter on Courses (below) is fine.
6. **Remove** the "The rest of it" list. Later gates are on the route card, and opening-later courses are in the chips. The concept entry ("Linear algebra, as ideas") moves to a single small text link under the chips: "Concept map →".

### Courses (`V.courses`)
7. **Header and filter.**
   - `h1` "Courses".
   - A segmented control: "Now · n", "Later · n", "Finished · n", "All". It stays in memory only, never saved; a render is a read.
   - It defaults to Now.
8. **Now view, "Continue" shelf.**
   - The running courses that have a resume point or a started lecture, most recent first, at most 4.
   - Each shows a cover: a 16:10 rounded box with the faculty colour at about 18% over `--surface`, the code large in the faculty colour, and a 4px progress bar along the bottom.
   - Under the cover: the title, then the lecture number and either "resume at m:ss" (T-016 data) or the duration.
   - A cover links to the lecture.
9. **Now view, "Also running" shelf.** The other running courses, with "N lectures · x proven". They link to the course.
10. **Later view.** Not-yet-open courses at about 45% opacity, with "Opens week N".
11. **Finished view.** Courses with mastery of 85% or more. **All view:** every course, grouped by faculty.
12. **Shelf columns:** 4 at 1024px and up, 3 at 768px, 2 below 600px.
   - **Deviation (2026-10-10, T-031):** with the right rail visible, the shelf has 3 columns from about 1040px to about 1148px, because 4 would break titles mid-word ("Mathematic/s"). Each column has a 7rem floor, wider than "Mathematics" in the title (6.81rem). Measured at a 16px root: the rail appears at 1040px, and 4 columns return at 1149px.

### Both pages
13. **Use tokens only:** `--surface`, `--surface-2`, `--ink-*`, the `--fac-*` colours, `--accent`. No new colours and no gradients beyond the faculty tint. Contrast must be 4.5:1 or better for every text in both themes, and `verify-contrast` must cover both routes.
14. **Keep:** the right rail, the sidebar, the phone header and tab bar.
15. **Bump every `?v=` token.**

## Out of scope
- Other pages.
- New data, such as requirement completion state.
- Phone-only redesign beyond the responsive collapse above.
- PROTECTED paths and new dependencies.

## Acceptance criteria
1. **verify-design: Atlas at 1440 and 390, both themes.**
   - The route has 6 nodes: one is the next gate, the earlier ones are filled.
   - No label boxes overlap each other.
   - The pin is present.
   - The next-gate card shows the req chips and a days number equal to `daysBetween(today, target)` at the pinned clock.
   - Tiles equal the running count, with 3 columns at 1440 and 1 at 390.
   - Chips are capped at 5 plus "+N".
   - The old "The rest of it" group is gone.
2. **verify-design: Courses at 1440 and 390.**
   - The segmented control has 4 options, and clicking Later changes the shelf without calling `save()`.
   - The Continue shelf leads with the course that has a stored resume point (seed one, as T-016's checks do).
   - Covers carry the faculty colour.
   - Columns: 4 at 1440 and 2 at 390.
3. **verify-shell, verify-clip and verify-contrast are green.** The clip baseline only shrinks, and every tile and chip is 44px or more where it is a control.
4. **Plants, each exiting 1:**
   - (a) route labels overlap (equal spacing removed and replaced with time-proportional positions);
   - (b) the days number is off by one;
   - (c) the Continue shelf ignores the resume point;
   - (d) the filter writes state (a `save()` on click).
5. **All gates green on the final bytes. Screenshots** of Atlas and Courses at 1440 and 390, in Dark and Light.
