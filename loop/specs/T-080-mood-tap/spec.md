# T-080: One-tap mood, four slots a day, synced

From inbox 2026-11-14 (owner), note 3. **Needs owner approval:** it adds a new ledger event type
to the synced file (`progress/brickford-state.json`, PROTECTED). It only adds; nothing is dropped
or rewritten. **Feature freeze:** T-069 froze features until about 10 Jan 2027, so building this
needs the owner to lift the freeze for it.

## Problem
There is no mood data anywhere. The closest thing, Monk Mode, is deliberately kept off the sync
(`MONK_SYNCS`, `platform/js/app.js:406,737,1587`), so the life-loop tracker can't read it. The
hash-chain ledger does sync: `logEvent(type, ref, data)` (`app.js:820`) appends `{i, ts, type,
ref, data, prev, hash}`, and `syncPayload` sends it under `ledgers[deviceId]` (`app.js:745`).
Dart does the same in `merge.dart:468` and `record.dart`.

## Learner outcome
One tap a few times a day, and his tracker sees how his mood moves alongside the study record. He
logs nothing by hand.

## Scope (website first, then the Flutter Home in the same item)
- **Slots, by local time** (default, owner may adjust): `dawn` 04:00–11:00 ("after dawn"),
  `midday` 11:00–15:00, `afternoon` 15:00–19:00 ("late afternoon"), `night` 19:00–04:00. A night
  after midnight belongs to the previous date. The values are one constant, with no setting.
- **The row on Today**: five 44px buttons, 1–5, labelled with the current slot. One tap calls
  `logEvent("mood", <date>, {score, slot})`, where `ref` is the slot's date, and the row shows
  "logged". Tapping again in the same slot logs again; the reader takes the last one per
  (date, slot). It shows on every day, Saturday included. Mood is not study, so it never touches
  `studyDays`, `dayActivity`, the streak or `dayStatus`.
- **Pending chip**: if an earlier slot today has no mood event, one chip appears ("Midday mood?").
  Tapping it opens the same 1–5 row for that slot, and the event's `data.slot` names that slot
  while its `ts` is now. It is never a popup, and there is at most one chip, for the most recent
  missed slot.
- **After marking watched**: the lesson page shows the 1–5 row once, inline, under the button,
  for the current slot. It shows only if that slot has no event yet. It is not a modal.
- Flutter: the same row, chip and post-watch offer, via Dart `logEvent`. The event must reach the
  synced file from either app.
- `docs/SYNCED-STATE.md` (from T-074): mark the `mood` event as shipped.

## Out of scope
Monk Mode and its sync rule (unchanged). Charts or history views of mood. Notifications or
popups. Any change to the hash chain format. PROTECTED paths beyond this event. Curriculum/plan.
New dependencies.

## Acceptance criteria
1. verify-logic, pinned clock and timezone: the slot function at each boundary (03:59, 04:00, 10:59,
   11:00, 15:00, 19:00, 23:59, 00:30 → previous date's night). A tap appends one event with the
   right `type`, `ref` and `data`, and `verifyChain()` stays true.
2. verify-logic: a mood event changes nothing in `studyDays`, `streak()`, `dayStatus()`,
   `backlogCount()`.
3. verify-logic sync: `syncPayload().ledgers[deviceId]` contains the mood event, and a merge on a
   second device keeps it. Holding Monk Mode unsynced stays green.
4. verify-flows at 390 and 1280: tap 3 on Today, and one event, one save. A missed slot shows
   exactly one chip and tapping it logs that slot. Marking a lecture watched shows the row once,
   and once the slot is logged it does not show again.
5. verify-sync-loop green (a render writes nothing). verify-shell, verify-contrast, verify-clip
   (baseline may not grow), verify-density (may not rise) and verify-design are green. 44px targets.
6. verify-app: Dart/JS parity for slot and event shape. A Flutter push carries the mood event.
   Flutter widget test for the row.
7. Planted bugs, each must fail a gate: a mood event left out of the payload; a mood tap that adds
   a study day; the 19:00 boundary off by an hour; two chips at once; a popup/modal on post-watch.

## Verification checklist
Typecheck, then every CHECK gate plus verify-app, verify-boot, verify-offline and verify-density.
`flutter analyze` + `flutter test`. Run the planted bugs above. Screenshots at 390 and 1280: the
row, the chip, logged, and the post-watch offer. Bump `?v=`.

## Owner decisions
Slot hours (above defaults). Whether the four slots should follow prayer times instead of fixed
hours (not in scope; that needs a location and a calculation source, so it would be a new item).
