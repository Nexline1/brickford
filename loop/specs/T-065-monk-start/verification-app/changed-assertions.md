# T-065 changed assertions (Flutter app, PART 2)

Owner, 2026-11-06: Monk Mode starts on the day the Start button is pressed and held, not on a date in the
source. The web app did it in PR #45 (`S.monkStart`); the app does it here with the same rules. `Engine.MONK.from`
(the constant `2026-11-01`) is gone: `Engine.monkFrom` reads `S['monkStart']`, which is absent until the owner starts
it. Every fixture that pinned the old start therefore carries `monkStart: '2026-11-01'` in its state to keep reading
what it read.

**Nothing was deleted, skipped or loosened.** No `expect(...)` or `check(...)` predicate, expected value, threshold or
baseline entry changed. Every change below is a fixture (the state a scenario starts from) or a call signature that
gained the start date. The old numbers are all still asserted: `Day 5 of 21`, ring 60 / 20 / 80, `9.5/10h`, `3/4`,
`21 days · avg`, the focus line, `Starts 1 Nov`, `Day 4 / 21`, the 44 px badge, and the focus / sums / prayer-time
parity over the same dates.

## Moved: 8 fixture or signature lines (old -> new)

### app/test/monk_test.dart (2)
1. The `model()` helper's stored state: `{monk}` (or nothing) -> `{monk?, monkStart: '2026-11-01'}` by default, through a
   new `start` parameter (`null` is the not-started state the new tests use). It feeds every existing test in the file:
   the ring and badges (`Day 5 of 21`), the controls (every write local, no push), Now / Next, the 21-day map with
   the focus line, loops and tomorrow's plan, and "before the 21 days" (`2026-10-28`, `Starts 1 Nov`, no Home badge,
   then the 44 px badge on day 5). Their expectations are untouched.
2. `monkFocus(m.monkDays, today)!` -> `monkFocus(m.monkDays, today, m.monkFrom)!`. The function took the old constant
   implicitly; it now takes the start as an argument so the not-started case cannot be forgotten by a caller.
   The expected `'${f.label} · ${f.rate}%'` is the same.

### app/test/widgets_test.dart (2)
3. "Home on the real plan": `model('2026-11-04')` -> `model('2026-11-04', monkStart: '2026-11-01')`, and
   `model('2026-11-07')` -> `model('2026-11-07', monkStart: '2026-11-01')`. Still asserts plan day 17, `Day 4 / 21`,
   the four tabs, and day 19 with the rest-day moon on the Saturday.

### tools/verify-app.js and app/tool/engine_dump.dart (3)
4. The Monk block (prayer times, day plan, week and month sums, focus): the JS page was seeded with no state ->
   `{ monkStart: fx.monk.start }`, `MONK_START = "2026-11-01"`; the Dart side's `monkFocus(monkDays, d)` ->
   `monkFocus(monkDays, d, mk['start'])`. Same dates, same expected values (`f5.days >= 2`, a focus line on 5 Nov, a month sum of
   clips on 8 Nov): without the start the focus is null everywhere and the check "the monk fixtures reach a focus line"
   could not be reached.
5. The merge projection (`PROJ` in the JS, `project()` in `engine_dump.dart`) gained `monkStart`, so a merge that changes
   it is compared key by key. It adds a compared key; no existing key is dropped. The "two devices that diverge" fixture
   carries `monkStart` on both sides (`2026-11-06` local, `2026-11-02` remote): its change count goes up by one (the check
   is still `> 20`), and "an empty remote changes nothing" (which reuses the diverge local) still counts 0 changes.
6. The plan block's `MONK` row: `{from: "2026-11-01", days: 21}` -> `{from: null, days: 21}` on both sides (the plan page has no
   state, so there is no start), and `monkDay` over START .. day 1094 + 7 is `null` on every date on both sides
   where it used to be `1..21` on 1 .. 21 Nov. The parity check over it is unchanged.

### tools/perf-app.js and tools/shoot-app-stage3.js (2)
7. perf-app's `seed()` and shoot-app-stage3's `monkState` gain `monkStart: "2026-11-01"`. Both walk into the Monk page at
   clock 4 / 5 Nov; without it they would measure and photograph the Start page.
8. `engine_dump.dart` `'MONK': {'from': Engine.MONK.from, ...}` -> `{'from': e.monkFrom, ...}` (the field moved to the engine).

## The "monk never leaves the device" assertions, kept and narrowed
Kept as written: `sync_test` "...never carries monk" (`state.containsKey('monk')` false, no `nosin` in the body) and
verify-app "the payload never carries monk, and the merge never reads a remote one". Beside them, new: the keys of the
payload's state matching /monk/i are exactly `['monkStart']` when a start is set and none when it is not.

## Added (new assertions)
- monk_test: not started (monkDay null on 7 dates, monkFocus null, monkLive empty, Home and Monk screen show Start, no
  day / ring / card / plan / "of 21", 21 empty cells, 44 x 44, opening it writes nothing); `startMonk` writes once, saves,
  false on another day, S.monk untouched, an empty string is not a start; the sheet (words, hold disabled unticked, a tap,
  a 0.7 s hold, a slide-off, a closed sheet and Cancel do not start it; the fill tracks the hold); a 1.5 s hold starts it and
  the screen reads `Day 1 of 21` and Home `Day 1 / 21`; Enter held 0.7 s aborts and 1.5 s starts; day 21 / after day 21
  (Home nothing, Monk screen `21 days done`); days before the start never count (`2 / 8`, `0 / 70`, still stored).
- sync_test: the merge matrix (remote only, earlier, later, same, local only, neither, and 11 non-date remotes x set /
  unset local); the payload's Monk keys; the push is immediate (inside the debounce, once, nothing after, nothing without
  a token); a pulled start repaints the open Monk screen.
- verify-app: parity blocks for monkDay (6 windows), startMonk (3 scenarios), monkFocus and monkLive with no start, the
  merge matrix (17 new fixtures), the payload keys (3 devices), and four plants
  (`monk-start-overwrites`, `monk-merge-later`, `monk-payload-monk`, `monk-day-unstarted`), each run with the engine files cmp-checked afterwards.
