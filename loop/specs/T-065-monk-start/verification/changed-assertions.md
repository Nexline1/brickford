# T-065 changed assertions (web)

Owner, 2026-11-06: Monk Mode starts on the day the Start button is pressed and held, not on a date in
app.js. `MONK.from` now reads `S.monkStart`, which is absent until then, so every fixture that pinned the
old `2026-11-01` start has to carry `monkStart: "2026-11-01"` in its state to keep reading what it read.

**Nothing was deleted, skipped or loosened.** No `check(...)` predicate, expected value, threshold or
baseline entry changed. Every change below is a fixture (the state a scenario starts from) or the text of a
final PASS line. The old numbers are all still asserted: day 1 on 1 Nov, 14% / 29% / 0% focus, 3 and 7 days,
"1 of 5", "2 of 5", 20%, "Starts 1 Nov", the one-write-per-press counts.

## Moved: 9 fixture lines (old -> new)

### tools/verify-logic.js (3)
1. Monk dashboard row, 5 clocks (31 Oct null, 1 Nov day 1, 3 Nov day 3, 21 Nov day 21, 22 Nov null):
   `scenario(browser, now, null)` -> `scenario(browser, now, STARTED)`; `STARTED = { monkStart: "2026-11-01" }`.
   Same expectations: row absent before day 1 and after day 21, a 44px `a.monk-row` to `#/monk` reading
   "Monk ModeDay N of 21" inside. (After day 21 the dashboard still shows no row; only the Monk page says
   "21 days done".)
2. The Monk arithmetic probe (clock 28 Oct): `scenario(browser, "2026-10-28", null)` -> `scenario(browser, "2026-10-28", STARTED)`.
   Read through it, unchanged: `MONK is 21 days from Sun 1 Nov 2026` (`md.from === "2026-11-01"`), the four
   `monkFocus` checks (German 14%, No sin 29%, Brickford 0%, 3 monk days before the pre-start filter), and the
   rest of that block, which does not read the start.
3. The Also count on #/monk (4 Nov): the fixture `{ studyDays: [], monk: {...} }` -> `{ studyDays: [], monkStart: MONK_START, monk: {...} }`,
   and the nothing-logged one `null` -> `STARTED`. Same "1 of 5" / "0 of 5".

### tools/verify-design.js (2)
4. T-054 state loop (1440/390 x dark/light x 2 states): `patch: st.patch` -> `patch: t54Patch(st)`, where
   `t54Patch = st => Object.assign({ monkStart: "2026-11-01" }, st.patch)`. `st.patch` itself is untouched, so
   "day 4 with a day logged" still has its monk data and "before the 21 days" still has `patch: null`; the
   assertions that read `st.patch` as "today is inside the 21 days" (today outlined, `m.map.now === (st.patch ? 1 : 0)`)
   are exactly as they were. Heads "Day 4 of 21" / "Starts 1 Nov", Priorities, Also, ring: unchanged.
5. The clipping sweep on #/monk (7 widths x roots 16/24): the same `patch: st.patch` -> `patch: t54Patch(st)`.

### tools/verify-flows.js (1)
6. T-054 Monk flows at 390/1280 (clock 1 Nov): `fresh(browser, w, null, "/", MK_DAY)` ->
   `fresh(browser, w, { monkStart: MK_DAY }, "/", MK_DAY)`. "Opening #/monk writes nothing", "Day 1 of 21 with 3
   chips and the 4 seed loops", every one-write press, "Day 2 of 21" after the clock moves: unchanged.

### tools/verify-sync-loop.js (2)
7. Privacy half (m1-m3): the seeded state `{ studyDays: [], monk: m }` -> `{ studyDays: [], monkStart: "2026-11-01", monk: m }`.
   (m1) "a pull leaves local monk data exactly as it was", (m2) "a monk write arms no push" and both (m3)
   assertions ("the push's state has no monk key", "none of the monk text anywhere in it") are untouched and
   still pass with the start in the payload: `monkStart` is not `monk`.
8. Flipped half (f): `local = { studyDays: [], monk: {...} }` -> `local = { studyDays: [], monkStart: T, monk: {...} }`
   (T = 2026-11-01). Every `(f)` merge-by-`at` assertion unchanged.

### tools/verify-density.js (1)
9. The shared seed (pinned clock 1 Nov): `{ lessons, problems, studyDays, review, settings }` ->
   the same with `monkStart: "2026-11-01"`. Not in the brief's list of four gates, but the same kind of fixture:
   without it the dashboard's Monk row and the Monk page drew their Start states, which put the dashboard at 49 words
   at 320px (ceiling 48; the 44px Start row is 12px shorter than the 56px Day row, so one more row came into the first
   viewport) and left 17 /monk and /dashboard baseline entries STALE. With it the run is identical to origin/main's
   (same failures, same 1983 words, same 152 known findings). No ceiling or baseline entry was touched.

Without the start the Monk page is the Start page, so none of those fixtures could reach the prayer chips, the
priorities or the map they assert on.

## Text only: 2 final PASS lines
- verify-flows: the PASS summary gains " ; Start Monk Mode at 390/1280 ... (T-065)".
- verify-sync-loop: "Monk Mode never leaves the device while MONK_SYNCS is false" -> "... never leaves the device but its start
  date while MONK_SYNCS is false ..., and the start date syncs both ways and is pushed at once when pressed (T-065)".
  (This is a printed sentence, not an assertion. The assertions behind it are the old (m3) pair plus the new one below.)

## The "monk never leaves the device" assertion, narrowed
The old (m3) pair is kept as written (no `monk` key in the push's state; none of the monk text anywhere in the
body). Beside it: `(m3) only monkStart leaves: of every Monk key in the push's state, exactly monkStart, holding the
date 2026-11-01`: the keys of `state` matching /monk/i must be exactly `["monkStart"]`. Plant `payload-has-monk`
(S.monk put back into the payload) fails it and the old pair.

## Not moved
Every other pinned clock and fixture: none of them reads the start. The dashboard fixtures at 1 Nov in
verify-flows/verify-logic that are not about Monk now draw the Start row where the "Day 1 of 21" row used to be:
same slot, same 44px height, and no assertion of theirs reads it.

## Added (new assertions)
- verify-logic: not started (monkDay null on 7 dates, monkFocus null; the page and the dashboard are the one
  Start button and no day, score or plan; nothing stored by looking); startMonk() writes today's date and a
  second call, three days later, returns false and changes nothing; the 21 days count from it; mergeState x 10
  (both directions, same date, remote-only, local-only, absent/empty/null/non-date remote, neither); importBackup
  x 6 through the Restore control.
- verify-logic: days logged before the start never count (Short-form 2 / 8, Work hours 0 / 70 on the first week, old day still stored).
- verify-sync-loop: (m3) only monkStart leaves; (s1) a pulled start is applied through mergeState and the open
  Monk page repaints; (s2) pressing and holding Start pushes inside the 4 s debounce.
- verify-flows: Start on the page and the dashboard at 390/1280 (44px, no day), the sheet's words and tick, Cancel
  and Escape, unticked hold, single click, 0.7 s hold, slide-off, the real 1.5 s hold (one write, Day 1 of 21 on
  the page and the dashboard, Start gone), and the same by keyboard (Space/Enter) at 1280.
