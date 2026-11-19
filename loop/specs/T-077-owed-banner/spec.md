# T-077: Unwatched-lecture banner on Today

From inbox 2026-11-14 (owner), note 1. Depends on T-074 (it reads the frozen `scheduledFor`).
**Feature freeze:** T-069 froze features until about 10 Jan 2027, so building this needs the
owner to lift the freeze for it. No state change and no PROTECTED path.

## Problem
Today shows only a count of owed lectures: `backlogCount()` (`platform/js/app.js:1890`) feeds the
dashboard (`V.dashboard`, `app.js:2721`) and the Flutter Home stat (`app/lib/screens/home/home_screen.dart:70,121`,
"20+ owed"). `firstOwed()` (`app.js:1903`) names only the first lecture. Nothing says which
lectures are late or by how much.

## Learner outcome
Opening Today tells him exactly which lectures are behind and how late each one is, so he
clears the oldest first. There is no popup and no nagging beyond the banner.

## Scope (website first, then the Flutter Home in the same item)
- `owedList()`: the same walk and filters as `backlogCount()` (rest days skipped, optional
  lectures skipped, `v2Rescheduled` skipped, `schedDone` counts as cleared), plus today's
  scheduled lectures that are not watched. Each entry is `{k, title, due, late}`:
  - `due` = the lesson's `scheduledFor` (T-074), otherwise the walk's date.
  - `late` = study days from `due` to today: `studyIndex(today) − studyIndex(due)`, or the
    previous study day's index on a Saturday. A rest day never adds lateness, per REST_DOW.
  - Ordered oldest first. `backlogCount()` must equal the number of entries with `late > 0`
    (one source, two readers).
- A banner at the top of Today: one row per lecture with its title and "today", "1 day late" or
  "N days late". Each row links to the lesson. It shows the first 5 rows, and any more sit inside a
  closed `<details>` ("+N more"). It is hidden when the list is empty. It is not dismissable,
  since it goes away when the work is done. On a Saturday it still lists what is owed (owing
  carries over a rest day; nothing new is added). The existing owed count stays.
- Flutter: the same list in `engine.dart` (Dart/JS parity) and the same banner on `home_screen.dart`.

## Out of scope
Email, push or any notification (the life-loop tracker sends email; Brickford never does). Popups.
State changes. PROTECTED paths, curriculum and plan. New dependencies.

## Acceptance criteria
1. verify-logic, pinned clock (owner fixture plus a Fri-owed / Sat-rest / Sun-today case): `owedList()`
   gives the right keys, order and `late`. The Friday lecture on Sunday is `late: 1`, not 2. A
   Saturday clock adds no new entries. `backlogCount()` equals the entries with `late > 0`.
2. verify-logic: a lesson with a frozen `scheduledFor` uses it for `due`, even after work-ahead
   re-anchors the computed plan.
3. verify-flows at 390 and 1280: the banner lists the owed lectures. Tapping a row opens that
   lecture. Marking it watched removes the row. With nothing owed, the banner is absent.
4. verify-sync-loop: the banner render writes nothing. verify-shell, verify-contrast, verify-clip
   (baseline may not grow), verify-density (ceilings may not rise) and verify-design all stay green.
   Tap targets are 44px.
5. verify-app: Dart/JS parity for `owedList()` on the same fixtures. Flutter widget test for the banner.
6. Planted bugs, each must fail a gate: a Saturday counted as a late day; an optional lecture
   listed; `due` taken from the re-anchored plan over a frozen `scheduledFor`; the banner shown
   with an empty list.

## Verification checklist
Typecheck, then every CHECK gate plus verify-app, verify-boot, verify-offline and verify-density.
`flutter analyze` + `flutter test`. Run the planted bugs above. Screenshots of Today at 390 and
1280 in light and dark: with 3 owed, with 8 owed (the `<details>`), and with none owed. Bump `?v=`.
