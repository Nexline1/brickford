# T-056: "ticks disappearing" (bounded look, no code changed for it)

What the owner most likely saw is the half-done bug, not lost data. The tick beside a lecture
on the dashboard and calendar is drawn from `schedDone` -> `lessonCleared`, not from `done`.
With `QUIZ_GATE_FROM` 2026-10-16, a quizzed lecture marked watched on or after 16 Oct showed no
tick until its quiz was passed. Moving the gate to the merge date fixes that. The reset also
re-dates which lecture belongs to which calendar day, so ticks appear to move between days.

What does clear or hide a tick, other than the explicit Unmark (`toggleDone`):
- `importBackup` (app.js, ~6474) replaces S wholesale (`S = Object.assign({}, DEFAULT, data)`),
  so restoring an older backup removes every tick made after it was taken.
- A non-syncing device shows only its own local state: ticks made on another device are absent
  there. The owner's phone read "This device is not syncing" the week of 6 Oct.
- `grandfathered()` uses a strict `<` against `QUIZ_GATE_FROM`, so a lecture first watched ON the
  gate date itself is not grandfathered and needs its quiz. The code is left as it is: the gate
  date is set to the merge date.

What does not clear `done`: `mergeState` keeps the higher-standing copy (watched scores 2, notes
alone 1) and only ever takes the earlier `firstDoneAt`; the check, solve, keepPosition and
recordQuizPass writers never touch `done`.

One unconfirmed path, not fixed: `toggleDone` flips the stored value. If a pull marked a lecture
watched while a video was on screen (that background repaint is deferred), the page could still
read "Mark watched", and pressing it would unmark. It needs two syncing devices.
