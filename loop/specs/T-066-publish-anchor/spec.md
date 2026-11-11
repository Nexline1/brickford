# T-066 — Calendar shows past Storytelling days as not watched on a Friday or Saturday (bug, web and Flutter)

Owner, 2026-11-07 (Saturday): "In the calendar, past days show partially done: Math and AI are watched but
Storytelling (SPCH 100) is not, even though I watched many."

## Why
T-063 gave Theory and Build `studyAnchor()` (on a rest day, the last study day) so the past stays frozen. The Publish
block was missed: it still passes `speechSlot(todayISO())` as `todaySlot` to `windowFor`. `speechSlot` is -1 on a Friday
(the weekly rep day, `SPEECH_OFF_DOW`), on a Saturday (rest) and before the start, so on every Friday and Saturday every
past Storytelling day re-anchors to the first UNWATCHED SPCH lecture. A day whose lecture was watched lists other
lectures and reads "partial". Display and derivation only: no stored data is wrong; nothing is migrated.

## What
- `speechAnchor()` next to `studyAnchor()` in `platform/js/app.js` and `app/lib/engine/engine.dart`: the slot of the last
  speech day on or before today (within 7 days back), -1 before `START_DATE`. It replaces `speechSlot(todayISO())`, the
  only caller. A Friday or Saturday itself still schedules no Publish item (`sd` stays `speechSlot(iso)`).
- `?v=` tokens in `platform/index.html` bumped (20261107a to 20261107b). `sw.js` is untouched (its version is the token).

## Acceptance
1. verify-logic: with the first eight Storytelling days watched, every past day's plan (Publish items included) and
   status are identical on a Thursday, Friday and Saturday clock; on the Saturday each watched Storytelling day lists
   its own fixed-plan lectures and is "completed", not "partial"; Fridays and Saturdays schedule no Publish item; a
   Sunday and a Monday clock keep the fixed past and the work-ahead re-anchor. Failed on the unfixed code (3 checks,
   `verification/red-before-fix.txt`); plant (revert the fix) exits 1.
2. Flutter: the same invariance, completed-day and no-Publish-on-Friday checks as an engine test, and a month-grid
   widget test (Saturday clock, watched Storytelling days show the done mark) in `app/test/calendar_test.dart`.
3. `tools/verify-app.js`: Publish items and dayStatus, Dart against app.js, on five clocks over the start to day 40,
   each engine's Friday and Saturday equal to its own Thursday; plant `publish-anchor` (Dart anchors on `speechSlot`
   again) exits 1.
4. No existing assertion edited, loosened or removed; `platform/data`, `sw.js`, `CLAUDE.md`, `loop/config.md`,
   `progress`, `docs` untouched. All gates as in `verification/`.
