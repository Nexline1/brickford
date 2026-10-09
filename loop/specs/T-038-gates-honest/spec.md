# T-038: Gates can't be passed by accident, and an unmark sticks

**Source: owner, 2026-10-09.** The owner's Atlas read "Your route to February 2029". On day 5 the owner's device had Gates 1–3 marked passed; the owner confirmed this was "by accident".

That state pulls every later target earlier, and the numbers match exactly: Core skills Feb 2027, Research legs May 2027, The fork May 2027, Arrival Feb 2029. The arithmetic is correct. These are the defects:

1. **Passing is a bare toggle.** It sits behind the Transcript page's "Mark a gate passed" fold (`data-gate` in `platform/js/app.js` `wire()`). There is no confirmation, no requirements shown, and no order: Gate 3 can be passed before Gate 1.
2. **Sync can never remove a pass.** `mergeState` treats `gates` as "a truthy remote fills a falsy local". An unmark (`false`) is restored by the next pull from any device or the remote file, and a push merges the remote first, so the remote keeps the pass for good.
3. **A legacy `true` slides every day.** `gatePlan()` reads `true` as `todayISO()`, so a gate with that value is passed "today" on every load, and every later target moves daily.
4. **Atlas shows passed gates under their old target month.** It shows "Core skills Feb 2027", which reads as if it were still in the future. It should show when the gate was passed.

## Scope
1. **Passing a gate.**
   - Only the next gate can be passed.
   - The control opens a confirm sheet that lists the gate's requirements (`req` split on " · "). Each requirement has to be ticked before "Pass gate n" is enabled.
   - Unmark works only on the last passed gate and asks for confirmation.
   - Each is a single `save()`.
2. **A stored shape that syncs.**
   - The new value is `S.gates[n] = { date, at, passed: true|false }`, where `at` is an ISO timestamp.
   - `mergeState` uses last-writer-wins on `at`, so an unmark survives a pull from an older pass.
   - Old values are read without rewriting at boot (a render is a read):
     - `"YYYY-MM-DD"` means passed on that date, with `at` = that date at 00:00 local;
     - `false` means not passed;
     - legacy `true` means passed on the date of its `gate` ledger event if one exists, otherwise on START_DATE. It is never "today".
   - They persist in the new shape on the next ordinary save.
3. **Atlas.**
   - A passed gate's label shows "Passed d Mon" (its date).
   - The header uses the projected arrival.
   - When the projection differs from the baseline, a muted line reads "Plan baseline April 2030 · N months ahead".
4. **Bump every `?v=` token.**

## Acceptance
- **verify-logic, with a fixed clock:**
  - an out-of-order pass is impossible;
  - a legacy `true` gives the same targets on two different days;
  - LWW merge: a pass at t1, then an unmark at t2 on another device, gives an unmark after a pull either way round;
  - old date strings read the same as before.
- **verify-flows:**
  - the confirm sheet blocks until every requirement is ticked;
  - pass, then unmark, works;
  - after a pull from a stub remote that still holds the pass, the unmark sticks.
- **verify-design:** at 1440 and 390, both themes, a passed gate shows "Passed …".
- **Plants:**
  - (a) the old merge, so the unmark is undone;
  - (b) legacy `true` read as today, so targets drift;
  - (c) no order guard;
  - (d) passed labels showing the target.

  Each must make a gate exit 1.
- **All gates green.**
