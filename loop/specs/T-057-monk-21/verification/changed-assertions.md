# T-057 changed assertions

Every assertion below changed because the owner changed what it measures (2026-10-28: 21 days
from 28 Oct; the ring is the five priorities; Brickford is hours under `bfh`). None was deleted
without a replacement of at least the same strength; none was loosened. New checks are listed last.

## tools/verify-logic.js

| Was | Now | Why |
|---|---|---|
| Monk row fixtures 23 Oct null, 24 Oct 1, 26 Oct 3, 21 Jan 90, 22 Jan null; head "Day n of 90" | 27 Oct null, 28 Oct 1, 30 Oct 3, 17 Nov 21, 18 Nov null; head "Day n of 21" | MONK moved to 28 Oct, 21 days. Same shape: both edges and one inside day each side. |
| Score: 11 items (3 prayers + 6 habits + work + phone), 8 fixtures, `n` 11 | Score: 5 priorities, 17 fixtures, `n` 5 | Spec 3: the ring is the five priorities only. Every old fixture that still means something is kept with its new count (nothing, Fajr only, work 9.5, German 3 of 4, German bare `true`, separate-prayer key); added: all five with Also undone = 5, all Also with no priorities = 0, `brickford: true` alone = 0 and with the other four = 4, bfh 3 / 2.5, work 10 / 9.5, nosin missing / false / alone. The old "phone 0 counts" fixture is gone because phone is no longer in the score; the "all Also, no priorities = 0" fixture includes `phone: 1` and asserts it does not count. |
| Combine off: 5 prayers + work = 6 of 13 | 5 prayers + work = 2 of 5; 4 of 5 prayers + work = 1 of 5 | Prayer on time is one priority whatever the method; the second fixture keeps "all, not some" under combine off. |
| Focus: today 30 Oct, window 24–29 Oct (6 monk days), German 17% | Today Wed 4 Nov, window 28 Oct – 3 Nov (7 monk days), German 14%, with every Also item at 0% (so a focus that ranked Also would not pick German) | Day 1 moved to 28 Oct, so the old window had 2 monk days. Pinned clock moved 30 Oct -> 4 Nov. |

## tools/verify-flows.js (T-054 Monk Mode block)

| Was | Now | Why |
|---|---|---|
| Head "Day 5 of 90" on 28 Oct, "Day 6 of 90" on 29 Oct | "Day 1 of 21", "Day 2 of 21" | Same pinned clocks (28/29 Oct, inside the 21 days); the day numbers follow MONK. |
| Press `[data-mk-habit=brickford]`, assert `brickford === true` (and kept after the German press) | Press `[data-mk-habit=nosin]`, assert `nosin === true` (and kept after the German press) | The Brickford toggle no longer exists (spec 2.4: an hours stepper). No sin is the page's new toggle; same one-write assertion. |

## tools/verify-sync-loop.js (MONK_SYNCS flipped, in a temp copy)

| Was | Now | Why |
|---|---|---|
| Click `[data-mk-habit=brickford]`, push carries `days[T].brickford` truthy | Click `[data-mk-habit=nosin]`, push carries `days[T].nosin === true` | Same reason; the assertion is now strict equality (`=== true`), not truthy. |

## tools/verify-design.js (T-054 Monk Mode block)

| Was | Now | Why |
|---|---|---|
| Pinned clock Wed 28 Oct, "Day 5 of 90", previous day 27 Oct | Wed 4 Nov, "Day 8 of 21", previous day 3 Nov | Day 1 moved; 4 Nov keeps the weekday (Wednesday, so Clips shows and Streams does not, as before). The "before" state stays 20 Oct; its head is now "Starts 28 Oct". |
| Fixture day: `brickford: true` | `nosin: true, bfh: 1.5, meditate: true` added, `brickford: true` kept | Exercises the new rows; `brickford: true` stays to prove it is ignored (Priorities reads 1 of 5). |
| "the 90-day map is 13 week columns x 7 days" | "the 21-day map is 3 week columns x 7 days" | MONK.days 21 -> ceil(21/7) = 3 columns, no void cells. |

## New checks (added, not changed)

- verify-logic: MONK is `{from: "2026-10-28", days: 21}`; three focus cases (German weakest with Also all 0%, No sin weakest, Brickford weakest when only the old boolean was logged).
- verify-flows: the Brickford-hours stepper writes `bfh: 0.5` and no `brickford` key, reads "0.5 / 3".
- verify-design (per theme x width x state): group order Now, Priorities, Top 3 today, … Also, and nothing but Now / Full day above Priorities; the five priority rows in the owner's order; Priorities meta, Also meta and the ring label (1 of 5 / 2 of 5 / 20% on the logged day; 0 of 5 / 0 of 5 / 0% before).

## Untouched on purpose

- verify-logic's prayer-reference span "on all 90 days" (24 Oct – 21 Jan) and the week-start span: they test the prayer and week arithmetic over a span of dates, not the monk length. Shrinking them to 21 days would loosen them.
