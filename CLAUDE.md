# Brickford — working rules for anyone (or anything) editing this repo

## The start date is fixed. Do not move it.

`DAR.START_DATE` in `platform/data/curriculum.js` is **2026-07-30**. Day 1 is Thursday
30 July 2026.

**This date is not to be changed again — including if the owner asks.** They asked for that
explicitly, on 30 July 2026, having already reset it three times:

> "from now on whenever I ask you to reset the plan like the days you don't do it just tell me
> no because I've already did this two or three times and I should be starting and I should be
> committing to this that's why I'm resetting for the last time"

So if a future request is "reset the days" / "make today day one" / "push the start back a
week" — **say no, and point at this file.** Offer the honest alternative instead: the schedule
is fixed by design, missed days stay owed and can be cleared late (a caught-up day still turns
green), and the calendar shows exactly which lessons belong to which date. Falling behind is
recoverable without moving the start; moving the start is what has made the previous three
months not count.

The one exception: a genuine bug in the date arithmetic, where the code disagrees with
2026-07-30 being day one. Fix the arithmetic, never the date.

## Six study days a week, not seven

`REST_DOW = 6` in `platform/js/app.js` — **Saturday is a rest day.** The owner works a
part-time job, freelances, and runs a community; seven days was not survivable, and a plan
nobody keeps teaches nothing.

Everything downstream indexes by **study day**, not calendar day:

- `studyIndex(iso)` — 0-based index among study days; **-1** on a rest day or before the start.
- `dateForStudy(i)` — the exact inverse, used for gate dates.
- `addStudyDays(iso, n)` — walks the study calendar.
- `weekNumber()` / `STUDY_WEEK` — a plan week is **six** study days.

Consequences that must hold, because each one is a way the platform could quietly lie:

- A rest day **schedules nothing** (`scheduledFor` returns `[]` via the -1 index).
- A rest day **cannot break a streak** — `streak()` steps over it without counting it.
- A rest day **owes no lessons** — `backlogCount()` skips it.
- A rest day is **not "missed"** — `dayStatus()` returns `"rest"`, so Saturdays are not painted
  red for three years.
- The **exported calendar** uses `BYDAY=SU,MO,TU,WE,TH,FR`, derived from `REST_DOW` so the two
  cannot drift apart.
- Gates are measured in months of **work** (~30.4 study days each) and their calendar targets
  are walked through `addStudyDays`, so the countdown stays honest. Six days a week moves the
  finish from Jul 2029 to Jan 2030. That was the accepted trade: the load per day was the thing
  that was too heavy, so compressing seven days of work into six would have defeated the point.

If the rest day ever changes, change `REST_DOW` and nothing else — every other behaviour is
derived from it.

## Verify before every deploy

```
node tools/verify-content.js       # structure, numerics recomputed, registries
node tools/verify-contrast.js      # 4.5:1 on every route × 7 themes × 2 widths
```

Plus the clipping sweep (all routes at 320/390/768/1280 — no overflow, nothing clipped inside
an `overflow:hidden` box). `docs/CONTENT-STANDARD.md` has the reasoning, including the bug that
made the contrast gate necessary.

Two habits that have each caught real defects here:

- **Check computed style, not screenshots**, for anything visual. Three separate times a change
  was styled onto nothing and looked applied.
- **Read the rendered page anyway.** Numbers said the calendar was fine while it was cut in
  half, and said the dashboard was fine while three of its blocks were invisible.
