# T-057 — Monk Mode: 21 days from 28 Oct, the owner's five priorities first

Owner, 2026-10-28 (verbatim):
> Reset the monk mode to start on the 28th of October and go for 21 days, not 90 days. … I want you to
> prioritize in the monk mode: 1. Praying on time 2. Not sinning 3. Working 10 hours a day 4. Learning
> Brickford for 3 hours a day minimum 5. Learning German for 1.5 hours. These are my priorities.
> Anything else is noise, but it should be done.

## Scope (platform/js/app.js, gates, docs; no change to the study plan, START_DATE or QUIZ_GATE_FROM)
1. `MONK = { from: "2026-10-28", days: 21, … }`. Day 21 = Tue 17 Nov 2026. Every "90" in Monk Mode copy,
   comments and MONK_FIX ("for the 90 days") follows MONK.days; no hard-coded 90 left in the monk code.
   The score map heading reads "21 days" (derived from MONK.days), 3 week columns.
2. **The five priorities, in this order, in their own group at the top of #/monk** (directly under the
   head card and Now/Next; before Top 3), titled "Priorities", meta "x of 5":
   1. Prayer on time — the three Ja'fari chips as today (done = all blocks ticked).
   2. No sin today — a new day toggle, key `nosin` (boolean).
   3. Work 10 h — the existing `work` stepper (step 0.5, done at >= 10), moved here from Numbers.
   4. Brickford 3 h — becomes an hours stepper, NEW key `bfh` (step 0.5, done at >= 3). Do NOT reuse the
      boolean `brickford` key (an old `true` must not read as 1 h). Old `brickford` booleans are ignored, not deleted.
   5. German 1.5 h — the four chips as today (done = all four).
   Each row shows done state the way the page already does (tick / mk-good), in the page's existing components.
3. **The ring and the day score are the five priorities only**: `monkScore(d)` → `{done, n: 5, pct}`.
   The 21-day map colours by it; monkFocus picks the weakest of the five (fix lines for each, incl. `nosin`:
   one plain, non-preachy line). Prayer streak unchanged.
4. **Everything else stays, below, as "Also"** (meta "x of y"): Meditate, Read, No TikTok · IG · YouTube,
   Plan tomorrow, Phone under 2 h, and the remaining Numbers (gym, short-form, videos, scripts, streams, clips,
   books), This week / This month, Open loops, Plan tomorrow, Calendar link — same behaviour, lower on the page,
   not counted in the ring. Weekly "Work hours 70" stays.
5. Dashboard row: "Day n of 21", shown only during the 21 days (monkDay already does this).
6. Privacy unchanged: MONK_SYNCS stays false; nothing new leaves the device.

## Acceptance
- verify-logic: monkDay("2026-10-27") null, ("2026-10-28") 1, ("2026-11-17") 21, ("2026-11-18") null;
  monkScore n = 5; a day with all five done = 100 even with every "Also" item undone; a day with every Also
  item done and no priorities = 0; `brickford: true` alone does not satisfy Brickford; bfh 3 does, 2.5 does not;
  work 10 does, 9.5 does not; nosin required; focus picks the weakest priority.
- verify-design / flows / shell / contrast / clip / sync-loop green; any changed assertion listed in
  verification/changed-assertions.md with old → new and why (no loosening). Plants (each must exit 1):
  priorities-not-first (Also above Priorities), ring-counts-also, bfh-reads-brickford-bool, days-90.
- Pinned clocks: pick monk-day fixtures inside 28 Oct – 17 Nov; say which moved.
- CLAUDE.md: no edit needed unless a monk date is stated there (grep); if so update it (PROTECTED, owner-approved here).
