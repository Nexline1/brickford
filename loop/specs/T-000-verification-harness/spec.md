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
5. (Replaced 2026-09-25, see the owner decision below.)
   - 5a. `verify-clip` exits 0 on the clean tree when checked against `tools/verify-clip.baseline.json`.
   - 5b. It exits non-zero on the planted `.card { width: 2000px }`.
   - 5c. It exits non-zero on a NEW clip not in the baseline: plant something that clips at root 16px (e.g. an over-wide tab-bar label or padding at 390px) and show it is reported as NEW.
   - 5d. It exits non-zero when a baseline entry no longer occurs (stale): plant one fake baseline entry, show "stale", then remove it.
6. No test touches real data: every Playwright context is fresh, and no network sync happens (no token in the test context).
7. The four existing gates are still green and unchanged.

### Owner decision 2026-09-25
The first build found 453 of 896 clip-sweep renders failing on the clean tree: real, pre-existing
clipping that the old sweep never measured (it looked only inside `.main`, on six routes). The
owner chose to ship the gate with a committed baseline of today's known failures rather than hold
it back. Each baseline entry is owned by a fix item: T-001 (tab bar at a 24px root, 320/390),
T-002 (sidebar brand `div.crest` / `div.name-en` at a 24px root, 768 px and wider), T-003 (every
other finding). Keys carry no pixel numbers. The baseline is hand-edited only and may only shrink;
only NEW findings and stale entries fail. Criterion 5 was replaced by 5a to 5d accordingly.

## Verification checklist
- [ ] typecheck (`node --check`) green
- [ ] all 7 gates green on the clean tree (outputs in verification/)
- [ ] planted-bug runs for criteria 2, 4 and 5 fail as expected (outputs in verification/)
- [ ] screenshots of the three flows
- [ ] `git diff --stat` shows only tools/, CLAUDE.md, and (if used) the one app.js hook line and cache token
