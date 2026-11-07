# T-062 changed assertions

Owner, 2026-10-31: Monk Mode starts Sun 1 Nov 2026 (was Fri 30 Oct, T-061). 21 days, so day 21 is Sat 21 Nov. +2 days on T-061.
Nothing deleted or loosened; every computed expectation (14%, 29%, 0%, 3 days, 7 days, "1 of 5", "2 of 5", 20%) is unchanged.

## tools/verify-logic.js
- Monk row fixtures 29 Oct null / 30 Oct 1 / 1 Nov 3 / 19 Nov 21 / 20 Nov null -> 31 Oct null / 1 Nov 1 / 3 Nov 3 / 21 Nov 21 / 22 Nov null.
- `MONK is 21 days from ...`: `md.from === "2026-10-30"` -> `"2026-11-01"`.
- Focus (German 14%, No sin 29%, Brickford 0%): today Fri 6 Nov -> Sun 8 Nov; window 30 Oct-5 Nov -> 1-7 Nov; pre-start sentinel 29 Oct -> 31 Oct. Window is again exactly days 1-7.
- Pre-start filter: today Mon 2 Nov -> Wed 4 Nov; window 28 Oct-3 Nov; 28-31 Oct (4 pre-start days, every priority but German, would give German 43%) and 1-3 Nov (3 monk days, every priority but No sin). Still asserts days 3, key nosin, rate 0. Title now "focus on Wed 4 Nov: 3 monk days (1-3 Nov)". Plant focus-counts-prestart exits 1.

## tools/verify-flows.js
- `MK_DAY`/`MK_NEXT` 30/31 Oct -> 1/2 Nov (day 1 and day 2). Heads "Day 1 of 21"/"Day 2 of 21" unchanged.

## tools/verify-sync-loop.js (privacy half and flipped half)
- Every monk date, the `at` stamps, the clock and T moved +2 days (30 Oct -> 1 Nov etc.), same relative layout, same winners. Unmoved: remote study day 2026-10-19 and seed stamp 2026-10-22T00:00:00Z (not monk days).

## tools/verify-design.js
- State "day 6 with a day logged", head "Day 6 of 21" -> "day 4 ...", "Day 4 of 21" (clock Wed 4 Nov unchanged, now day 4; Wednesday kept).
- "before the 21 days" (clock 20 Oct) head "Starts 30 Oct" -> "Starts 1 Nov".

## Not moved
Every other pinned clock: none of them reads MONK.from.
