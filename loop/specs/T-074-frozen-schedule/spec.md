# T-074: Frozen schedule date, first-watch timestamp, and the reader contract

From inbox 2026-11-14 (owner), notes 2 and 4. **Needs owner approval:** it adds fields to the
synced state (`progress/brickford-state.json`, the `S` shape in `app.js` load/save, PROTECTED).
It only adds; nothing is dropped or rewritten. **Feature freeze:** T-069 froze features until
about 10 Jan 2027; building this needs the owner to lift the freeze for it.

## Problem
- A lecture's date is computed, never stored. `scheduledFor(iso)` (`platform/js/app.js:1281`)
  re-anchors FUTURE days when work runs ahead (`windowFor`, `app.js:1260-1270`; past slots stay
  fixed at `:1264`). So nothing outside the app can tell when a lecture was due.
- `firstDoneAt` is written only on UNMARK (`app.js:7040`, Dart `engine.dart:1303`), as a date,
  and it is set to `firstWatched(st)` (`app.js:1732`). It is present on 2 of 68 lessons. The
  first watch is otherwise only `doneAt`, which a re-mark moves to the new day.
- Nothing documents which synced fields an outside reader (the life-loop tracker, which reads
  `progress/brickford-state.json` from `Nexline1/brickford-private`) can rely on.

## Learner outcome
The owner's own tracker can say "watched 2 days late" or "on time" without him logging anything,
and a later refactor can't silently break it.

## Scope (website first, then Flutter in the same item, per T-069's both-apps rule)
1. **`scheduledFor` on the lesson.** `S.lessons[k].scheduledFor = "YYYY-MM-DD"`, written once,
   never changed. A helper `freezeSchedule()` walks study days from `max(START_DATE, first
   activity)` up to and including today; for each `realSched(iso)` item that is not optional and
   not `v2Rescheduled(iso, k)` (`app.js:1529`), it sets `scheduledFor = iso` only if the lesson
   has none. The first date that owns the lecture wins. Rest days schedule nothing, so they freeze
   nothing.
   - It runs at boot and on the first render after the date changes. **A render is a read**, so the
     write goes through `syncQuiet`, never `save()`+push from inside a view.
   - Backfill: past slots are fixed (`app.js:1264`), so the first run writes the true past dates.
   - Merge (`mergeState`, `app.js:~331`; Dart `merge.dart:~186`): the earlier `scheduledFor` wins
     when both sides have one; one side's value fills a missing one.
2. **`firstDoneAt` as a full ISO timestamp, never overwritten.** On mark-watched, if the lesson has
   no `firstDoneAt`, set it to `new Date().toISOString()`. Unmark no longer writes it. `doneAt`
   stays a date (it feeds `dayActivity`, `app.js:1186`). Legacy: a watched lesson with no
   `firstDoneAt` gets `firstDoneAt = doneAt` (date-only) once at boot. That adds a field and
   rewrites none. Existing date-only values are kept as they are.
   - `firstWatched` and the `firstDoneAt` merge compare on the **date part** (`slice(0,10)`). On a
     same-day tie they keep the full timestamp, so a date-only copy from an older device can't
     replace it. `grandfathered()` (`QUIZ_GATE_FROM` comparison) behaves exactly as today.
3. **`docs/SYNCED-STATE.md`**: the reader contract. It lists `state.lessons.*.{done, doneAt,
   firstDoneAt, scheduledFor}`, `state.studyDays`, and `ledgers.<deviceId>[].{ts, type, ref,
   data}`, with each field's format, when it is written, its merge rule, and that lateness is the
   reader's job (`firstDoneAt − scheduledFor`, date part). It covers the legacy date-only
   `firstDoneAt` and the `mood` event (T-080, "planned" until that ships). It also states the
   rule: **a change to any listed field updates this file and verify-logic's contract check in
   the same PR.**

## Out of scope
The banner (T-079), mood (T-080), any email or notification, PROTECTED paths other than the state
shape named here, `platform/data/*` and `curriculum.js`, START_DATE / REST_DOW / plan, new
dependencies.

## Acceptance criteria
1. verify-logic, pinned clock: after boot, every non-optional lecture scheduled on a past or
   current study day has `scheduledFor` equal to that date. A Saturday freezes nothing. A
   v1 lecture that v2 reschedules is not frozen on its v1 day.
2. verify-logic: working ahead (marking future lectures, moving the clock forward a day) never
   changes an existing `scheduledFor`.
3. verify-logic: mark → unmark → mark leaves `firstDoneAt` byte-identical to the first mark. The
   value matches `/^\d{4}-\d{2}-\d{2}T/`.
4. verify-logic: a legacy lesson `{done:true, doneAt:"2026-10-20"}` gains `firstDoneAt:"2026-10-20"`.
   No existing field changes value. `grandfathered()` gives the same answer as before for the
   owner's fixture.
5. verify-logic merge: the earlier `scheduledFor` wins both ways. A same-day date-only
   `firstDoneAt` does not replace a full timestamp. Neither side's fields are dropped.
6. verify-sync-loop stays green: the freeze does not arm a push from a render.
7. verify-app: Dart/JS parity for freeze, toggle and merge on the same fixtures. A Flutter push
   keeps `scheduledFor` and `firstDoneAt`. Flutter widget/engine test for the toggle.
8. Contract check (verify-logic): a synced payload has every field named in
   `docs/SYNCED-STATE.md` with the stated format.
9. Planted bugs, each must fail a gate: unmark overwrites `firstDoneAt`; freeze rewrites an
   existing `scheduledFor`; merge takes the later `scheduledFor`; freeze called with `save()` from
   a render; Flutter push drops `scheduledFor`.

## Verification checklist
Typecheck, then every CHECK gate plus verify-app, verify-boot, verify-offline and verify-density,
all exit 0. `flutter analyze` + `flutter test` in `app/`. Run the planted bugs above. Screenshots at
390 and 1280 of the lesson page before and after mark/unmark (no visible change expected).
Bump every `?v=` token.
