# T-056: Reset seven (day 1 = 16 Oct 2026), the half-done fix, Monk Mode from 24 Oct

## Owner, 2026-10-23
"reset brickford progress so that the day 1 becomes the 16th of oct". The refusal was given, with the numbers below. The owner chose "Reset anyway: day 1 = 16 Oct".

The numbers:
- 10 study days discarded (5–15 Oct);
- day 1094 moves from 2030-04-02 to 2030-04-14;
- the gate baseline moves from 2030-04-03 to 2030-04-15.

Also: "reset monk mode to start on the 24th of oct".

## 1. Reset seven, done exactly as reset six was
- **START_DATE.** `DAR.START_DATE = "2026-10-16"` in `platform/data/curriculum.js`. This is a PROTECTED path, approved by the owner here.
- **Pinned clocks and fixtures move by the same number of study days,** so every pinned clock keeps its plan day and weekday.
  - That covers verify-design, verify-clip, verify-flows and verify-logic's facts and fixtures.
  - Compute it by replicating `studyIndex` and `dateForStudy`, never by hand.
  - Prove it the same way reset six did: the same plan day number on every pinned clock, and the rest-day and Saturday checks still measuring a Saturday. Re-plant the Saturday bug and show it fails.
- **CLAUDE.md** (PROTECTED, approved, because the standing rule says to update it):
  - the start date section: 16 Oct 2026 is a Friday, so give the first rest day and the day-1094/baseline dates as computed;
  - the override paragraph for this seventh reset, with the numbers above;
  - "this is reset number seven" (27 Jul → 30 Jul → 12 Aug → 14 Sep → 23 Sep → 6 Oct → 23 Oct);
  - the note that this reset was asked for alongside a real bug (half-done days), which is fixed in the same change.
- **Progress itself is not deleted.** Lessons keep their done and quiz state. They are keyed by lesson, not by date. The streak, sealed days and the chain are untouched, exactly as in earlier resets.

## 2. The "half done" bug
- **Cause:** `grandfathered()` uses the first-watched date being before `QUIZ_GATE_FROM` (2026-10-16). Lectures the owner ticked on or after 16 Oct therefore count only once their quiz is passed. So days whose every lecture is watched paint "Part".
- **Fix:**
  - set `QUIZ_GATE_FROM` to this change's ship date, the day it merges (pass it in at ship), so everything watched before the change ships counts;
  - those lectures' quizzes stay on the catch-up list;
  - the lock-from-go-live rule follows the same constant.
- **Tests:**
  - verify-logic: a lecture first watched before the new gate date, with no quiz passed, counts as cleared, and its day paints done;
  - a lecture first watched after the gate still needs its quiz.
  - Derive the fixtures from `T.QUIZ_GATE_FROM`, as T-043 r1 did.
- **"Ticks disappearing":** the owner isn't sure. Spend a bounded look (≤30 min): does any code path clear `done` other than the explicit Unmark? Check `mergeState` (lesson score rule) and the T-043 unmark/firstDoneAt path. Report what you find, and fix only a confirmed path.

## 3. Monk Mode from 24 Oct
`MONK.from = "2026-10-24"`, so day 90 is 21 Jan 2027. Update T-052/T-054's verify-logic monk checks to match:
- 23 Oct → none
- 24 Oct → 1
- 26 Oct → 3
- 21 Jan → 90
- 22 Jan → none

## Acceptance
- Every gate passes, plus the plants:
  - the Saturday plant;
  - a grandfather plant, with the old date rule restored, must exit 1;
  - a monk off-by-one plant.
- `?v=` bumped.
- Changed assertions listed, with old and new values.
