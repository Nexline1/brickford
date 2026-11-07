# T-063 — On a rest day the calendar re-plans the past (bug) + show watched / not watched per lecture

Owner, 2026-10-31 (Saturday), screenshots of Calendar: Fri 16 Oct (day 1) lists "Makemore 4" and "MATH 110 lecture 17"
although Makemore 1-3 are watched; most past days show Part/Missed though ~8 of 15 days were fully watched.
"on the calendar page there's going to be something that shows: I've watched this, but you did not watch that."

## Root cause (found by reading app.js, confirm with a test first)
`studyToday = () => studyIndex(todayISO())` is -1 on a rest day (Saturday) and before the start. `scheduledFor` passes
`dT < 0 ? -1 : dT` as `todaySlot` to `windowFor`, whose rule is: slot <= todaySlot -> the frozen fixed plan;
slot > todaySlot -> re-anchor to the first UNFINISHED lesson. With todaySlot -1, EVERY past day re-anchors, so every
past day shows "the next unwatched lectures" instead of its own frozen content, and watched lectures drop off the
calendar. (Matches the screenshot: day 1 = first unfinished of each course.) It happens every rest day.

## Fix
1. The "today" slot used by scheduledFor/windowFor on a rest day is the study index of the LAST study day before today
   (past days stay frozen). Before the start it stays -1. Do NOT change what a rest day itself schedules (nothing),
   backlog, streak or any other studyToday use: add a separate helper (e.g. studyAnchor) used only for windowing.
   Look at every `dT` / `studyToday()` use inside scheduledFor and the Theory/Build/other windowing.
2. Day view (calendar day list): each lecture row shows its own state, using the same lessonCleared rule the day
   status uses: watched + cleared = a green tick; watched but quiz not passed = a half/ring glyph; not watched = an
   empty ring. Use existing glyph/tick components and tokens (CHECK_SVG, .mk-ring style), small, no new words
   beyond a screen-reader label. Also fix nothing else on the page.

## Acceptance
- verify-logic: with the clock on a Saturday, past days' scheduledFor equals the same days with the clock on the
  Friday before (same state with several lectures watched); today's rest-day output unchanged; before-start unchanged.
  Plant `rest-day-reanchors-past` (restore the old dT) exits 1.
- verify-design or verify-flows: the day view shows tick / partial / empty for three lectures in those three states
  (new check), 44px and contrast rules unchanged. Plant: glyph always empty, exits 1.
- All gates green: typecheck, content, logic, sync-loop x2, flows x2, design x2, shell, contrast, offline x2,
  clip (589 baseline, may only shrink) + TZ=LA. density may fail only if it reads the real date (known; say so).
  Bump ?v=. No existing test loosened; list changed assertions in verification/changed-assertions.md.
  If a pinned clock in an existing fixture is on a rest day and its expectation depended on the bug, say so explicitly.
