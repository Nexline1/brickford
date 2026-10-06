# Reset six: START_DATE 2026-10-05, so that 7 October 2026 is day 3

## Owner request and approval
- **Request, 2026-10-06:** "reset the streak for the 7th of OCT to be day 3".
- **Refusal first**, per CLAUDE.md's standing rule, with the numbers computed by replicating `studyIndex`/`dateForStudy`/`addStudyDays` from `platform/js/app.js`:
  - 12 study days discarded;
  - day 1094 moves from 2030-03-19 to 2030-04-02;
  - the gate baseline moves from 2030-03-20 to 2030-04-03.

  It offered two alternatives: missed days stay owed and can be caught up, or a streak-counter reset (`streakFrom`) that moves nothing in the plan. It also noted that the owner's phone showed "This device is not syncing".
- **Reaffirmed, 2026-10-06:** "do the reset, 7th of Oct as day 3", followed by "merge it once the review passes".

## PROTECTED path, named and approved
- **`platform/data/curriculum.js`:** `DAR.START_DATE` changes from `"2026-09-21"` to `"2026-10-05"`. Nothing else in the file changes.

## Scope
- **`tools/verify-logic.js`:**
  - The stated facts: START, day 1094 = 2030-04-02, baseline 2030-04-03.
  - Every dated fixture moves +14 days, keeping weekdays and plan days.
  - Expected values are unchanged.
- **Pinned clocks:** `tools/verify-design.js`, `tools/verify-clip.js`, `tools/verify-flows.js` and `loop/design/census.js` move from 2026-10-06 to 2026-10-20, the same plan day (14). The clip baseline is not edited.
- **`CLAUDE.md`:** the start-date section, the fourth override and sixth reset, and the related prose corrections.
- **`loop/lessons.md`:** day 1094 and the baseline.
- **`README.md`:** the start date.
- **`platform/index.html`:** the `curriculum.js` cache token.

## Acceptance
1. With the clock at 5, 6 and 7 Oct the dashboard reads Day 001, Day 002 and Day 003, and 10 Oct is a rest day.
2. `verify-logic` asserts START 2026-10-05, day 1094 2030-04-02 and baseline 2030-04-03, and passes 24/24.
3. Both T-000 planted bugs still fail `verify-logic` (REST_DOW = 5; `dateForStudy` off by one).
4. All gates are green, and the clip baseline is unchanged (0 new, 0 stale).

## Not in scope
- **The streak counter** (`streak()` / `streakFrom`) is untouched. It counts sealed days and ignores START_DATE.
- **Synced progress data** is not touched.
