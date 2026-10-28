# T-061 changed assertions

The owner moved Monk Mode's day 1 from Wed 28 Oct to Fri 30 Oct 2026 (2026-10-29, Bahrain). It is still
21 days, so day 21 is Thu 19 Nov. Every assertion below changed only because the date it measures moved.
None was deleted. None was loosened: every check still asserts the same thing with the same strictness,
and every computed expectation (14%, 29%, 0%, 3 days, 7 days) is unchanged.

## tools/verify-logic.js

| Was | Now | Why |
|---|---|---|
| Monk row fixtures 27 Oct null, 28 Oct 1, 30 Oct 3, 17 Nov 21, 18 Nov null | 29 Oct null, 30 Oct 1, 1 Nov 3, 19 Nov 21, 20 Nov null | Spec acceptance. Same shape, moved +2 days: the day before day 1, day 1, one day inside, day 21, the day after. The head "Monk ModeDay n of 21" and the 44px row are asserted as before. |
| `MONK is 21 days from Wed 28 Oct 2026 (T-057)`: `md.from === "2026-10-28"` | `MONK is 21 days from Fri 30 Oct 2026 (T-061; T-057 had Wed 28 Oct)`: `md.from === "2026-10-30"` | The constant moved. `days === 21` unchanged. |
| Focus (German 14%, No sin 29%, Brickford 0%): today Wed 4 Nov, window `range("2026-10-28", "2026-11-03")`, `FOCUS["2026-10-27"]` before day 1 | Today Fri 6 Nov, window `range("2026-10-30", "2026-11-05")`, `FOCUS["2026-10-29"]` before day 1 | Under the new start the old window held 2 pre-start days, so `days === 7` would have failed. Moved +2 days so the window is again exactly days 1-7 and today is day 8. Weekday changes from Wed to Fri; monkFocus reads no weekday. Expected values unchanged (days 7; German 14%; No sin 29%; Brickford 0%). |
| Pre-start filter (T-057 r1): today Sat 31 Oct, window 24-30 Oct; 24-27 Oct every priority but German, 28-30 Oct every priority but No sin | Today Mon 2 Nov, window 26 Oct - 1 Nov; 26-29 Oct every priority but German (pre-start, misleading), 30 Oct - 1 Nov every priority but No sin (the 3 monk days) | Spec acceptance. Same shape moved +2 days: 4 pre-start days and 3 monk days. If the pre-start days were counted, the pick would be German at 3 of 7 (43%). Asserts `days === 3`, key `nosin`, rate 0, as before. Plant `focus-counts-prestart` re-run: exits 1. |
| Also count comment "Wed 4 Nov (day 8)" | "Wed 4 Nov (day 6 since T-061; it was day 8)" | Comment only. The clock stays on Wed 4 Nov. It is still a monk day. The Also count does not depend on the day number. Expected "1 of 5" / "0 of 5" unchanged. |

## tools/verify-flows.js (T-054 Monk Mode block)

| Was | Now | Why |
|---|---|---|
| `MK_DAY = "2026-10-28"`, `MK_NEXT = "2026-10-29"` (Wed/Thu) | `MK_DAY = "2026-10-30"`, `MK_NEXT = "2026-10-31"` (Fri/Sat) | Without the move, the logged day would fall before the start and the head would read "Starts 30 Oct". Moved +2 days so the logged day is day 1 again and the clock-moved day is day 2. The expected heads "Day 1 of 21" and "Day 2 of 21" are unchanged. The flow reads no weekday: the Top 3 check is "not tomorrow's plan" / "exactly tomorrow's plan", not a weekday default. |

## tools/verify-sync-loop.js (both T-054 monk blocks: MONK_SYNCS false, and flipped on in a temp copy)

| Was | Now | Why |
|---|---|---|
| Privacy half: clock 28 Oct 12:00; `at` stamps on 28 Oct; local days 27, 26 Oct; local plan 28 Oct ("Ship MONK-PRIVATE..."); remote days 27, 20 Oct; tick key `days["2026-10-28"]`; (m3) compares `days["2026-10-27"]` and expects no `days["2026-10-20"]` | Clock 30 Oct; stamps on 30 Oct; local days 29, 28 Oct; local plan 30 Oct; remote days 29, 22 Oct; tick key `days["2026-10-30"]`; (m3) compares `days["2026-10-29"]` and expects no `days["2026-10-22"]` | Every monk date moved +2 days with the clock. Today's tick is again on day 1 (a logged day stays a monk day). Every other date keeps its place around today (yesterday, two days back, today's plan). The remote study day `2026-10-19` (proof the pull ran) and the seed stamp `2026-10-22T00:00:00.000Z` (MONK_SEED_AT) are not monk days and stay. |
| Flipped half: `T = "2026-10-28"`; days 26, 27, 25 (local) / 26, 27, 24 (remote); plans 29, 30 Oct; `want` keyed the same | `T = "2026-10-30"`; days 28, 29, 27 / 28, 29, 26; plans 31 Oct, 1 Nov; `want` keyed the same | Same +2 shift. The push still has to carry `days[T].nosin === true`, with T on day 1 again. The merge expectations are built from the fixtures by key, so each keeps the same winner: local newer, or remote newer. |

## tools/verify-design.js (T-054 Monk Mode block)

| Was | Now | Why |
|---|---|---|
| State "day 8 with a day logged", head "Day 8 of 21" (clock Wed 4 Nov) | State "day 6 with a day logged", head "Day 6 of 21" (clock unchanged, Wed 4 Nov) | The clock does not move. Wed 4 Nov (day 6) and the day before it, 3 Nov (day 5), are still monk days. The Wednesday is kept, which this fixture depends on (Clips shows in Numbers and Streams does not; Full day has the Wednesday routine). Only the day number in the expected head changes. Priorities "1 of 5", Also "2 of 5", ring "20%", 3 x 7 map with today outlined: unchanged. |
| State "before the 21 days" (clock 20 Oct), head "Starts 28 Oct" | head "Starts 30 Oct" (clock unchanged) | 20 Oct is still before the start. The head names the new day 1. |

## Pinned clocks, all of them

- Moved: verify-logic dashboard row (5 dates, +2), focus today 4 Nov -> 6 Nov, pre-start focus today 31 Oct -> 2 Nov;
  verify-flows 28/29 Oct -> 30/31 Oct; verify-sync-loop 28 Oct -> 30 Oct (both blocks, with their fixtures).
- Not moved, on purpose:
  - verify-design Wed 4 Nov and 20 Oct, and verify-logic's Also count on Wed 4 Nov. Each keeps its meaning where it is
    (a monk day stays a monk day, before stays before) and its weekday.
  - verify-logic's monk-arithmetic probe clock (28 Oct). Nothing in that block reads today. Every function there is
    handed its date: prayer times, slots, routine, score, week and month sums, focus with an explicit today, mkPhoneOk.
  - The weekly/monthly sums fixture (Wed 28 Oct, 24 Oct - 1 Nov). It tests Sunday-to-Saturday and month arithmetic,
    which does not read MONK.from.
  - The prayer-reference span (24 Oct - 21 Jan, 90 days) and the week-start span. As T-057 recorded, these test
    arithmetic over a span. They do not measure the monk length.

## New checks

- Plant `monk-from-28` (MONK.from back to 2026-10-28) -> verify-logic exits 1.
