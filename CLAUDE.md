# Brickford — working rules for anyone (or anything) editing this repo

## The start date

`DAR.START_DATE` in `platform/data/curriculum.js` is **2026-09-14**. Day 1 is Monday
14 September 2026. The first rest day is Saturday 19 September; day 1094 lands on
2030-03-12.

### The standing rule, and how it has been used

On 30 July 2026 the owner asked to be refused future resets:

> "from now on whenever I ask you to reset the plan like the days you don't do it just tell me
> no because I've already did this two or three times and I should be starting and I should be
> committing to this that's why I'm resetting for the last time"

**That rule still stands.** If a request is "reset the days" / "make today day one" / "push the
start back a week", the first answer is **no**, with the honest alternative offered: the
schedule is fixed by design, missed days stay owed and can be cleared late (a caught-up day
still turns green via `dayStatus`), and the calendar shows exactly which lessons belong to which
date. Falling behind is recoverable without moving the start.

**On 12 August 2026 the owner overrode it explicitly** — the refusal was given, the cost was
shown (11 study days discarded, finish moving from 2030-01-27 to 2030-02-08), and they
reaffirmed with a reason: they had watched day one and part of day two and wanted the run to
begin from a day they were actually on. The rule is theirs to release; that is what an override
is. It was carried out and the date above is the result.

**On 14 September 2026 they overrode it a second time.** The refusal was given with the numbers
(28 study days discarded, finish slipping 33 days from 2030-02-07 to 2030-03-12) and the
observation that the dashboard read `never SYNCED`, so the `20+ behind` and `3 proven` on that
screen were one browser's local state and not necessarily the owner's real progress. They
reaffirmed. It was carried out.

So: refuse first, show the numbers, and if they reaffirm, do it and update this file. Do not
refuse twice — the rule exists to interrupt a reflex, not to hold the owner hostage to a past
version of themselves.

**Count, for whoever reads this next: this is reset number four** (27 Jul → 30 Jul → 12 Aug →
14 Sep). That is not an argument for refusing twice, and it is not a reason to editorialise at
the owner. It is a fact the next session should have, because the honest thing to check first is
whether a reset is being asked for in place of a fix — twice now the screen that prompted one
was a device that had never synced.

The one thing that needs no permission: a genuine bug in the date arithmetic, where the code
disagrees with the date above being day one. Fix the arithmetic, never the date.

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
  are walked through `addStudyDays`, so the countdown stays honest. Six days a week is why the
  finish is Feb 2030 rather than mid-2029. That was the accepted trade: the load per day was the
  thing that was too heavy, so compressing seven days of work into six would have defeated the
  point.

If the rest day ever changes, change `REST_DOW` and nothing else — every other behaviour is
derived from it.

## The streak, and what resetting it may touch

The streak is **derived**, never stored. `streak()` walks back from today over `S.studyDays`,
stepping over Saturdays without counting them, and stops at `S.settings.streakFrom`.

`streakFrom` is the whole of the reset mechanism, and it is deliberately the smallest one that
works: it moves the line the counter starts from and **deletes nothing**. Sealed days, the
heatmap, the "Days sealed" tile, the calendar and the hash chain are all untouched by a reset,
because none of them stopped being true. A reset appends a `streak` event to the chain recording
the run that ended, so the record says a reset happened rather than quietly showing a smaller
number.

Two things that must hold:

- **`streakFrom` merges by taking the later date.** `studyDays` union on every pull, so a reset
  stored only as a deletion would be undone the moment another device pushed those days back.
  Taking the later date also means an older device that has not heard about the reset cannot
  un-do it.
- **`bestStreak()` ignores `streakFrom` entirely.** Zeroing the counter must not erase the fact
  that a 27-day run once happened; the Record page shows both numbers side by side.

If a "wipe the sealed days as well" reset is ever wanted, that is a different and much more
destructive operation — it takes the heatmap and the day count with it — and needs its own
confirmation, not a quiet widening of this one.

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
