# T-067 step 2: changed assertions

**No existing assertion was moved, deleted, skipped or loosened.** No `check(...)` / `ok(...)`
predicate, expected value, threshold, baseline entry or Flutter `expect` changed. Every existing gate
ran unmodified against the new plan; the only edits to existing gate files are additions.

## Added (not changed)
- `tools/verify-logic.js`: the T-067 block (a)-(f): the pre-cutover snapshot from origin/main
  (`tools/verify-logic.v1-snapshot.json`, taken by `tools/plan-v1-snapshot.js`), parity with
  `tools/plan-dates.js`, needs-first, level jumps, budgets, optional/video-less never scheduled, the
  backlog rule, the lecture page's Needs / Leads to and the Atlas path. 238 -> 251 invariants.
- `tools/verify-content.js`: DAR.PREREQ checks (every key, every need exists, no self-need, no cycle,
  equal to `prerequisites.json`, scheduled exactly when the audit marks core, a scheduled lecture never
  needs an unscheduled one), `alias` checks, and the curriculum ledger (`data/curriculum-ledger.json`).
  `prerequisites.js` was added to its VM file list.
- `tools/verify-app.js`: two plants appended to PLANTS (`plan-v2-budget`, `plan-v2-backlog`) and a
  comment section; nothing else.
- `app/test/plan_v2_test.dart`: three new tests.

## Data changes an existing check reads (not assertion changes)
- `platform/data/workshop.js`, lab `kaggle-entry`: `after` `ai210.0.5` -> `ai210.0.4`. ai210.0.5
  (random forests) is one of the owner's approved cuts, so Plan v2 never schedules it and the existing
  T-045 check ("its after lecture is scheduled in its phase or earlier") failed with `scheduled null`.
  The check is unchanged; the lab now hangs on fast.ai lesson 5 (a tabular model from scratch), which
  v2 schedules on 2027-04-08, week 25, phase 1.
- `.at-step` instead of `.at-chip` for the Atlas path: `verify-app` (Atlas parity) and
  `verify-design` read every `.at-chip` as an "opens later" chip. A separate class with the same CSS
  keeps those counts what they measure.
- `quiz-keys.json` is unchanged in meaning (summaries with checks): the second pass's quizzes are
  resolved by `alias` in `hasQuiz`, so `widgets_test.dart`'s "quiz-keys.json is exactly lessonQuiz !=
  null" stands as written.
