# T-003: No sideways scroll or cut-off controls on narrow phones

## Problem
At 320px, and in places at 390/768/1024/1100px, several screens clip or scroll
sideways. Evidence: `verify-clip` baseline entries tagged T-003.
- Sideways page scroll at 320px:
  - `/calendar` (342>320)
  - `/diag/diag-la` (336)
  - `/quiz/linear-algebra` (399)
  - `/drill` (431)
- `/drill`: the numeric-answer row overflows even at the default 16px root (289>280), and
  the Submit button looked cut off at the card edge.
- `/diag/diag-la`: `button.btn` at 320 and 768 (16px root); the timer and its stop button
  at 320–1024 (24px root).
- `/electives`: the table overflows its wrapper at 320px.
- The lesson page `.card.one` at 320 (286>280).
- A few 3–11px overruns on `/transcript`, `/recall` and `/course/math110`.

## Learner outcome
Drills, quizzes, the diagnostic and the calendar work on a small phone without sideways
panning. The answer box and Submit button are always fully visible, so practice doesn't
stall on layout.

## Scope
CSS, plus markup only where CSS can't fix it. Do the `/drill` answer row first, since it
fails at the default text size. The work may be split into T-003a (drill and quiz) and
T-003b (the rest) if it grows beyond one reviewable PR. Bump the `?v=` cache tokens.

## Out of scope
- T-001 and T-002
- any change to question content or scoring
- PROTECTED paths (`platform/data/`)

## Acceptance criteria
1. Every T-003 baseline entry that is fixed is deleted, and no entry is added. The target
   is that all are deleted. Any left over must be listed in the PR with a reason and stay
   tagged T-003.
2. At 320px and both roots, `/drill` and `/quiz/linear-algebra` show the full answer
   input and the Submit or Next controls inside the card. Evidence: screenshots, plus a
   `verify-flows` assertion at 320px.
3. No route scrolls sideways at 320px at a 16px root.
4. All gates are green, and 44×44 targets hold.
