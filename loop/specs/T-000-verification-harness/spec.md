# T-000: Verification harness

## Problem
Four gates exist (content, sync-loop, shell, contrast), but:
1. The load-bearing date/streak logic in `platform/js/app.js` (studyIndex, dateForStudy,
   addStudyDays, scheduledFor, dayStatus, streak, bestStreak, backlogCount) has no tests.
2. No smoke test walks the three main study flows.
3. The clipping sweep that CLAUDE.md lists as a gate is not in the repo.

## Learner outcome
A change can no longer silently break today's session, the streak or the progress count.
A green gate set means the daily flow still works.

## Scope
- `tools/verify-logic.js`: asserts the CLAUDE.md invariants.
  - day 1 = START_DATE
  - dateForStudy(1093) = 2030-03-19
  - addStudyDays(START, 1094) = 2030-03-20
  - studyIndex is -1 on a Saturday and before the start
  - dateForStudy(studyIndex(d)) = d for study days
  - scheduledFor(Saturday) = []
  - dayStatus(Saturday) = "rest"
  - streak steps over Saturdays and stops at streakFrom
  - bestStreak ignores streakFrom
  - backlogCount skips rest days
  - Approach, since app.js is an IIFE: drive it through Playwright with `page.clock`,
    seeding state into a FRESH context's localStorage. If a function cannot be reached
    through the UI, add ONE read-only hook, `window.__brickfordTest = { studyIndex, ... }`,
    set only when `location.hash` contains `__test` (this spec names and approves it).
- `tools/verify-flows.js`: three Playwright smoke tests in fresh contexts:
  - (a) open today's session: the dashboard shows the next lecture and it opens
  - (b) answer one quiz question: the answer registers
  - (c) mark a lecture watched: the progress count or tile updates
- `tools/verify-clip.js`: the clipping sweep in the repo. All routes at
  320/390/768/1024/1100/1280/1440 px with root font sizes 16 and 24 px: no horizontal
  overflow, and nothing clipped inside an overflow:hidden box.
- Add the three commands to CLAUDE.md's "Verify before every deploy" block.

## Out of scope
- Any behaviour change (the test hook above is the only permitted app.js edit)
- Any PROTECTED path
- New dependencies
- Existing gates' assertions

## Acceptance criteria
1. The clean tree passes: `node tools/verify-logic.js` exits 0 and prints each invariant checked.
2. The logic gate catches a planted bug: with REST_DOW temporarily changed to 5, or dateForStudy off by one, `verify-logic.js` exits non-zero naming the invariant. Evidence: output in verification/.
3. `node tools/verify-flows.js` exits 0, with a screenshot per flow saved to verification/.
4. The flows gate catches a planted bug: breaking the watched-count update makes verify-flows exit non-zero.
5. `node tools/verify-clip.js` exits 0 on the clean tree, and non-zero with a planted `width: 2000px` on a card.
6. No test touches real data: every Playwright context is fresh, and no network sync happens (no token in the test context).
7. The four existing gates are still green and unchanged.

## Verification checklist
- [ ] typecheck (`node --check`) green
- [ ] all 7 gates green on the clean tree (outputs in verification/)
- [ ] planted-bug runs for criteria 2, 4 and 5 fail as expected (outputs in verification/)
- [ ] screenshots of the three flows
- [ ] `git diff --stat` shows only tools/, CLAUDE.md, and (if used) the one app.js hook line and cache token
