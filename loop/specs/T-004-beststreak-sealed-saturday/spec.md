# T-004: The longest streak skips a sealed Saturday

## Problem
`bestStreak()` in `platform/js/app.js:572-587` does `run++` for every sealed day, so a
sealed Saturday is counted as a study day. `streak()` (`app.js:549-567`) correctly steps
over it. CLAUDE.md is explicit that rest days are "stepped over, never counted", for
bestStreak too.
- The T-000 reviewer confirmed it through the test hook: for sealed days Mon 28 Sep to
  Tue 6 Oct including Sat 3 Oct, `streak()` returns 8 and `bestStreak()` returns 9.
- A Saturday can end up sealed even though the UI guards against it (`app.js:4154`): the
  pull merge (`app.js:252`) unions `studyDays` from other devices, and from data sealed
  before the six-day plan.

## Learner outcome
The Record page's longest run means the same thing as the live streak. Rest days never
inflate it, so the two numbers side by side are honest.

## Scope
The `bestStreak` function only: step over rest days without counting them, including
sealed ones. No data migration. `S.studyDays` is untouched and only the derived number
changes. Bump the `?v=` cache tokens.

## Out of scope
- `streak()`
- `streakFrom`
- the seal UI
- the pull merge
- PROTECTED paths (including stored progress)

## Acceptance criteria
1. In `tools/verify-logic.js`, the sealed-Saturday fixture (sealed Mon 28 Sep to Tue 6
   Oct 2026, including Sat 3 Oct) asserts `bestStreak() === 8`. Evidence: a run before
   the fix fails on exactly that check; a run after the fix passes.
2. `streak() === 8` still holds on the same fixture, and "bestStreak ignores streakFrom"
   still passes.
3. The known-bug comment added in T-000 is replaced by the real assertion.
4. All gates are green.
