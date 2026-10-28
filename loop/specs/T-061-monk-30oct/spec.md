# T-061 — Monk Mode starts 30 Oct

Owner, 2026-10-29 (Bahrain): "Reset monk mode to start on 30 of Oct".

## Scope
- `MONK.from` "2026-10-28" → "2026-10-30" in platform/js/app.js. `days` stays 21 (owner's T-057 decision),
  so day 21 = Thu 19 Nov 2026. Nothing else in the monk logic changes (priorities, score, Also, privacy).
- Update the comments that state the monk range (T-052/T-057 comment near MONK).
- Days 28–29 Oct now fall before the start: anything already ticked on them stays stored (never deleted)
  and simply sits outside the 21 days, like 24–27 Oct did under T-057.

## Acceptance
- verify-logic: monkDay("2026-10-29") null, ("2026-10-30") 1, ("2026-11-19") 21, ("2026-11-20") null;
  the dashboard row "Day n of 21" only inside the 21 days.
- The Focus pre-start test (T-057 r1) must still discriminate: re-pick its "today" so the 7-day window
  contains both pre-start days with misleading data and ≥2 monk days, assert days === the true count and the key,
  and re-run plant focus-counts-prestart (must exit 1).
- Every pinned monk clock in verify-logic / verify-design / verify-flows / verify-sync-loop moves so each fixture
  keeps its meaning (a "logged day" stays a monk day, a "before" state stays before the start); keep weekdays
  where a fixture depends on one. List every moved clock and changed expected string in
  verification/changed-assertions.md (old → new, why). Nothing loosened.
- Re-run the T-057 plants (days-90, ring-counts-also, bfh-reads-brickford-bool, priorities-not-first,
  focus-counts-prestart, phone-missing-counts, phone-two-counts) against head; each exits 1. Add plant
  `monk-from-28` (old start) → exits 1.
- All gates green: typecheck, content, logic, sync-loop ×2, flows ×2, design ×2, shell, contrast, clip
  (797 may only shrink) + TZ=LA.
