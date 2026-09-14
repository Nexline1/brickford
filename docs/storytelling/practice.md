# Phase 7 — the practice layer

Watching does not make anyone funnier. This is the part that does.

Everything here works **without a single video**. It does not wait on the harvest, it
does not wait on Phase 6, and it should start the day you read it. The curriculum is
scaffolding for these reps; the reps are the subject.

---

## The four reps

### 1. Story bank — daily, 2 minutes

One real thing from your day that could become a story. **Two lines.** No more.

```
2026-09-14  The client asked what an embedding was and I drew it on a napkin.
            He got it in 20 seconds. Four years of study, one napkin.
```

Line 1 is what happened. Line 2 is why it stuck — the turn, the surprise, the thing that
makes it a story rather than an event. If line 2 won't come, write the entry anyway; a
bank entry you can't yet see the point of is still an entry, and half of them reveal
themselves weeks later.

This is Matthew Dicks' *Homework for Life*, which is the one source already verified and
stored (`data/storytelling/transcripts/x7p329Z8MD0.txt`). It is module A2, and A2 is
first in the sequence for exactly this reason: **the bank has to be filling before any
other rep has fuel.**

Non-negotiable detail: log it **the same day**. A bank filled from memory on Sunday is a
bank of the four things memorable enough to survive a week, which are the four stories
you'd have told anyway. The whole value is the ones you'd have lost.

> **Target: 6 entries a week.** Saturday off. Miss a day, log it the next day marked
> late — but do not backfill three at once, that is fiction.

### 2. Story rep — weekly, recorded, under 90 seconds

Pick one entry from the week's bank. Tell it out loud. Record it. Under 90 seconds.

Rules that make it work:
- **Recorded, or it didn't happen.** The recording is the artifact and the input to the
  monthly review. Phone camera, one take preferred.
- **Under 90 seconds**, timed. The constraint is the teacher — it forces you to find the
  one moment the story is actually about.
- **No script.** Notes are fine, reading is not. This is spoken storytelling, not
  narration.
- **Second takes allowed, and log how many.** Take count over time is a real signal.

Lands on **Friday** — the second non-study day for this track. Friday isn't a day off;
the rep is that day's work.

### 3. Humor rep — weekly, written, five attempts

Five attempts at a joke about something from your week. **Most will be bad. That is the
format, not a failure of it.**

- Five attempts, not one good one. Volume is the mechanic — A5 teaches that jokes are
  found by generating and cutting, not by thinking harder.
- From your own week, not from the internet. Specificity is where the funny lives, and
  you only have specific access to your own life.
- Mark the one you'd actually say out loud. If none, mark none. Some weeks have none.
- Once A6 is covered, one of the five must be a **callback** to an earlier week's bank
  entry. Callbacks are the highest-leverage move in conversational humor and they are
  impossible without a bank.

### 4. Monthly review — rewatch yourself

Rewatch your recordings from **four weeks ago**, against the mechanics from the modules
you had covered *by then*. Not against today's knowledge — against what you had.

Three questions, written down:
1. Which mechanic from those modules did I not use, that I now can?
2. What did I do that I didn't notice at the time — good or bad?
3. Is the 90 seconds tighter than four weeks ago, or just shorter?

Four weeks is chosen deliberately: long enough that you've forgotten your own delivery
and can watch as an audience, short enough that the mechanics are still the ones you
were working on.

---

## The weekly shape

| day | study track | practice |
|---|---|---|
| Sun–Thu | 20 min storytelling video + drill | story bank (2 min) |
| **Fri** | *no video* | story bank · **story rep (recorded)** · **humor rep (5 attempts)** |
| Sat | rest — Brickford's rest day | nothing |

Weekly cost: ~10 min of bank + ~20 min of reps ≈ **half an hour**, on top of 100 minutes
of video across the week. Monthly review adds ~20 minutes once every four weeks.

---

## Why these four and not more

Each rep is the smallest thing that produces an artifact you can be judged against
later. That is the whole selection rule.

- The **bank** produces text. Without it the story rep has no input and the humor rep has
  no specifics.
- The **story rep** produces video. Without video there is no monthly review, and
  self-assessment from memory is worthless — you remember the version you meant to tell.
- The **humor rep** produces a written list. Jokes have to be written badly in volume
  before they're said well, and a list is auditable in a way "I tried to be funnier" is not.
- The **monthly review** produces a judgement, and it is the only rep that closes a loop.
  Three reps that generate and none that evaluate is just a diary.

There is deliberately **no daily speaking rep**. You already talk all day — in the
community, in audits, at the job. The scarce thing isn't reps at talking, it's reps at
talking *deliberately, recorded, against a mechanic*. One a week you actually do beats
a daily one you abandon in three weeks.

---

## How this gets installed

Per the brief: recurring items in the platform, not a document you'll forget.

Brickford has **no recurring-item mechanism today** — see `00-platform-notes.md` §4c. The
closest things are `S.studyDays` (a one-bit daily seal, no payload) and `S.weeks[]` (a
weekly record with free-text fields, already synced and merge-aware).

Proposed, and needing your sign-off on the diff before I write it:

```js
S.reps = {
  bank:  [ { date: "2026-09-14", what: "...", why: "..." } ],   // append-only
  story: [ { week: 5, date: "...", seconds: 84, takes: 2, from: "2026-09-14" } ],
  humor: [ { week: 5, date: "...", attempts: ["", "", "", "", ""], keeper: 2 } ],
  review:[ { month: 2, date: "...", against: ["A1","A2","A3"], notes: "..." } ],
}
```

Four things this has to get right, each of which is a way it could quietly fail:

1. **Append-only, unioned on sync** — same shape as `S.anchors`, which already merges
   correctly. A rep written on the phone must not be lost when the laptop pushes.
2. **Surfaced on the dashboard**, next to the day's lectures. A rep on a page you visit
   weekly is a rep you skip.
3. **Never auto-completed.** The bank entry is written by you or it doesn't exist. No
   "mark as done" without a payload — that's the same discipline as `verified` vs `done`
   on lectures, and it's the reason the rest of the record is worth anything.
4. **Rest-day aware.** `REST_DOW = 6`. Saturday owes no rep and a missed Saturday must
   not break anything — the same rule every other Brickford counter already follows.

I'll bring this as a reviewable diff. It is the one part of the storytelling work that
touches app state, so it gets looked at properly rather than slipped in.

---

## Start tonight, before any of that exists

The install is a convenience. The rep is the thing. Until it ships:

```bash
echo "$(date +%F)  what happened / why it stuck" >> docs/storytelling/bank.md
```

Do that tonight and you're a week of entries ahead by the time the curriculum is
installed — which means the first story rep has something real to draw on instead of
being performed from an empty bank.
