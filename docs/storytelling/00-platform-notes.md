# Phase 0 — Platform notes

What Brickford actually is, where a fourth subject plugs in, and what it does not yet
have that a video subject with a practice layer needs. Written before any curriculum
data, per the brief.

Everything below was read out of the source, not assumed. File and line references are
to the tree at commit `d943d68`.

---

## 1. The data model

### Where content lives

All curriculum data is plain JS assigned onto a `window.DAR` global. No build step, no
database, no migrations — the "schema" is the shape of these object literals, enforced
at deploy time by `tools/verify-content.js` rather than by a type system.

| file | global | what it holds |
|---|---|---|
| `platform/data/curriculum.js` | `DAR.COURSES` | 12 courses, the spine |
| | `DAR.GATES` | 5 gates, measured in months of work |
| | `DAR.WEEK_PLAN` | week-range → phase/tag/focus |
| | `DAR.SCHEDULE` | the day's **blocks** (see §3 — this matters) |
| | `DAR.DIAGNOSTICS`, `DAR.ELECTIVES`, `DAR.NICHES` | |
| `platform/data/workshop.js` | `DAR.LABS`, `DAR.PSETS` | hands-on builds with acceptance criteria |
| `platform/data/concepts-*.js` | `DAR.CONCEPTS` | the idea-level layer, linear algebra only |
| `platform/data/summaries-*.js` | `DAR.SUMMARIES` | per-lecture review records, MATH 110 only |
| `platform/data/quiz-*.js` | `DAR.QUIZZES` | 7 exam banks |

### Course → unit → lesson

```js
{
  id: "math110", code: "MATH 110", title: "Linear Algebra", faculty: "Mathematics",
  instructor: { name: "...", org: "..." },
  practice:   { label: "...", url: "https://..." },   // required by the content gate
  external: [ { label, url } ],
  phase: 0, color: "gold", desc: "...",
  quiz: "linear-algebra", diagnostic: "diag-la",
  units: [
    { name: "Unit I — ...", playlist: "PL...",        // YouTube playlist id, optional
      lessons: [
        { t: "Vectors", v: "fNk_zzaMoSs", min: 10 },  // v = YouTube video id
      ] },
  ],
}
```

Lesson fields in use across the app: `t` (title), `v` (YouTube id), `min` (duration),
plus `paper` and `read` for non-video items. That is the whole lesson vocabulary.

### The one dangerous property: lesson keys are positional

`lessonKey(cid, ui, li)` → `"math110.0.0"` (`app.js:506`). Progress, summaries, concept
back-references, quiz unlock keys (`after:`) and the spaced-recall schedule are **all**
keyed on that string.

> **Inserting a lesson into the middle of an existing unit silently re-points every
> completed lesson after it.** Ali's ticked lectures would shift onto different videos
> with no error and no visible sign.

This is the single biggest hazard in the whole installation. It does not block
storytelling — a new course gets new keys — but it rules out any "tidy up while I'm in
there" edits to existing units, and it means storytelling lessons must only ever be
**appended** to a unit once shipped, never inserted.

### Progress state

One localStorage key, `darhikmah_v1`, mirrored to GitHub (`progress/brickford-state.json`)
by a field-level merge. Relevant slices:

```js
S.lessons["cid.ui.li"] = { done, verified, doneAt, notes, checks: [], recall, solved }
S.studyDays = ["2026-08-12", ...]        // sealed days; drives the streak
S.weeks     = [{ week, date, shipped, dsa, posts, revenue, notes }]   // weekly seal
S.labs, S.psets, S.concepts, S.review, S.gates, S.ledger (hash-chained)
```

`verified` vs `done` is deliberate — the platform's core claim is that watching ≠
proving. A storytelling subject has to respect that distinction or it cheapens the rest.

---

## 2. How a lesson reaches a day

`scheduledFor(iso)` — `platform/js/app.js:814`.

```
studyIndex(iso)  ->  -1 on a Saturday or before the start date, else 0-based study day
```

**Pacing is computed, not authored.** There is no per-day assignment table anywhere:

```js
const EFFORT = m => m * 1.8 + 4;              // watch + notes + immediate practice
const THEORY_BUDGET = 120, BUILD_BUDGET = 90; // effort-minutes per block
```

`packWindows()` walks a course's flattened lessons and packs them into days by effort
minutes. A lesson whose effort exceeds `budget × 1.15` spans days and renders as
"day 2 of 4". `windowFor()` re-anchors *future* days to the first unfinished lesson, so
working ahead pulls tomorrow forward while falling behind leaves missed lessons owed on
their original dates.

**The finding that matters:** `scheduledFor()` is hardcoded end to end.

- It emits exactly two track strings, `"Theory"` and `"Build"`.
- The rotation is a literal: `THEORY_ROT = ["math110", "math120", "math130"]`.
- Phase 2 is a literal chain: `[["math210",1],["sys250",2],["ai310",2],["res400",3]]`.
- `phys100` is special-cased to every 4th day; `ai300` papers to every 21st.

There is **no data-driven track registry**. A fourth subject cannot be scheduled by
adding data alone. This is the one place the brief's "install using whatever structure
Brickford already uses" runs out of road, and it is why Phase 0 stops here for approval.

---

## 3. The gap that is already declared

`DAR.SCHEDULE` in `curriculum.js` declares the day's shape:

| block | time | note |
|---|---|---|
| Theory | ~2 h | Course lecture + reproducing it by hand |
| Build | ~1.5 h | NeetCode + fast.ai / project work |
| **Publish** | **~30 min** | **"Notes → weekly post; build-in-public on X"** |
| Treasury | ≤2 h | Client work, strictly capped |

**Publish is declared in the data, shown on the Method page, and never scheduled.**
`scheduledFor()` emits Theory and Build only. There is a 30-minute block in the stated
daily plan with nothing assigned to it.

Storytelling lands exactly there. Track B *is* "notes → post, build in public". Track A
is what makes the Publish block work in a room instead of on a timeline. Filling it
means the day does not grow — an empty declared block gets content — which is a very
different proposition from bolting a fourth hour onto an already-heavy day.

This is the insertion point I want to use, and it changes one of your four questions
(see §7).

---

## 4. What is missing for a video subject with a practice layer

Good news first: **Brickford is already a video platform.** Every existing course is
YouTube. So four of the things the brief lists as possibly-missing already exist:

| need | status |
|---|---|
| duration | ✅ `l.min`, and the whole pacing model runs on it |
| source URL | ✅ `l.v` (video id), unit `playlist` |
| progress state | ✅ `S.lessons[key]`, with `done`/`verified` split |
| per-lesson notes | ✅ `S.lessons[key].notes`, `.recall`, `.checks[]` |

Genuinely missing, all three needed by this brief:

**a) Transcript storage.** Nothing anywhere stores transcripts. The brief requires
lessons to survive a video being deleted. Nothing in the current model does.

**b) A per-lesson mechanic + drill.** `DAR.SUMMARIES` is close — it carries
`takeaway`, `beats[]`, `worked`, `watch`, `checks[]` — but it is a *review* artifact,
built so you can revise without rewatching, and it is locked until the lecture is
watched. Phase 5 wants a *drill*: one 10-minute action, same day, that produces an
artifact, plus a check. That is a different field set with a different lifecycle
(a drill is due *with* the lesson; a summary is for four weeks later).

**c) Any recurring-item mechanism at all.** This is the real hole, and it is the one
that matters most, because Phase 7 is the part that actually makes someone funnier.
There is no repeating-task concept in the codebase. The closest things:

- `S.studyDays` — a per-day boolean seal. One bit, no payload.
- `S.weeks[]` — a **weekly** record with free-text fields (`shipped`, `posts`, `notes`).
  This is the closest existing hook for a weekly rep, and it is already wired into the
  Workshop page.
- `S.review` — spaced recall, but it is keyed to lectures and its intervals are driven
  by recall grading, not a fixed cadence.

A daily story bank and a weekly recorded rep have no home in any of these as they stand.

---

## 5. What I propose adding

Nothing here is built yet. Listed smallest-first, because each step is independently
useful and I would rather ship the small one than argue about the big one.

**P1 — `platform/data/storytelling.js`, a new `DAR.COURSES` entry.** No schema change.
Two courses (`SPCH 100` Track A, `SPCH 110` Track B) or one course with two units.
Conforms exactly to the existing course shape, passes the existing content gate.
*Cost: zero risk. Gets the content in and browsable.*

**P2 — `DAR.DRILLS`, a new sibling registry** keyed by lesson key, mirroring how
`DAR.SUMMARIES` and `DAR.CONCEPTS` already attach to lessons:
```js
DAR.DRILLS["spch100.0.0"] = {
  mechanic: "one sentence",
  rules: ["...", "..."],          // 3-5, mostly paraphrased
  drill:  { do: "...", minutes: 10, artifact: "written|recorded|spoken" },
  check:  "how you know it worked",
}
```
*Cost: a new file + a render block in the lesson view. Additive, nothing existing moves.*

**P3 — transcripts on disk** at `data/storytelling/transcripts/<videoid>.txt`, with the
lesson view linking to the stored copy when the video 404s. *Cost: additive.*

**P4 — the Publish block, wired.** Add a `"Speech"` track to `scheduledFor()` filling
the already-declared Publish slot, with its own budget constant. **This is a change to
`app.js` and to the day's output — it needs your diff approval before I write a line
of it.** It is also the only proposed change that touches existing behaviour.

**P5 — recurring practice items.** The honest options:
- *Cheap:* extend `S.weeks[]` with `story`/`joke`/`rep` fields. Weekly reps only, no
  daily bank. Reuses a shipped, synced, merge-aware structure.
- *Right:* a small `S.reps` slice with a daily story-bank append and a weekly cadence,
  surfaced on the dashboard next to the day's lectures.
  *Cost: real work, and it needs the sync merge extended (append-only union, same shape
  as `S.anchors`) or reps written on the phone will be lost.*

---

## 6. Verification gates any of this must pass

`tools/verify-content.js` (366 checks today) enforces, among others:

- every course has an `https` `practice.url` with a label > 8 chars;
- every lesson key referenced by a quiz `after:`, a concept `lectures[]` or a summary
  actually resolves;
- concepts need `one` (>30 chars), a real `fig` in `DAR.FIG`, `miss`, `applies`, ≥2
  probes, acyclic prereqs;
- figures must use theme variables, never hard-coded colours.

`tools/verify-contrast.js` renders every route × 7 themes × 2 widths at 4.5:1. Any new
view I add is subject to both, plus the clipping sweep at 320/390/768/1280.

I would extend `verify-content.js` with drill assertions (every drill resolves to a real
lesson, states a mechanic, has a ≤10-minute artifact-producing action and a check) so a
half-written drill fails the build rather than shipping blank.

---

## 7. Open questions — and one correction to the brief

Answers to your four, plus what reading the code changed:

**1. Where Brickford lives.** `/home/user/brickford`, GitHub `Nexline1/brickford`,
deployed from `main` to Pages. This session's designated branch is
`claude/brickford-journey-reset-47t19n`. I will develop there and show you the diff
before anything reaches `main`. *No input needed unless you want a different branch.*

**2. "40 minutes a day" — this needs a real answer, because the platform's own effort
model makes it ambiguous.** `EFFORT(m) = m × 1.8 + 4`. So:

| if "40 minutes" means | video per day | video per week (5 days) | 25 h core takes | 35 h core takes |
|---|---|---|---|---|
| 40 min of **effort** (matches how every other course is paced) | **20 min** | 1.7 h | 15 weeks | 21 weeks |
| 40 min of **video** | 40 min | 3.3 h | 7.5 weeks | 10.5 weeks |

The second reading is 76 effort-minutes a day, on top of four hours. The first is what
the rest of the platform means by a 40-minute block. **I would use the effort reading**
and let the core path run ~15–20 weeks.

Also: you said storytelling runs **five** days a week, but Brickford's week is **six**
study days with Saturday off (`REST_DOW = 6`). So storytelling would rest on Saturday
plus one more. I propose Friday as the second off-day and that it carries the weekly
recorded rep instead — the rep is the work that day.

**3. Arabic sources — same track or parallel?** Still yours to answer. What the code
says: `language` is not a field anywhere in the current schema, so either answer needs
one adding. A8 and B8 are explicitly bilingual modules, which argues for same-track with
a `lang` tag rather than a parallel tree.

**4. Bench tier installed now or kept as a file?** Still yours. Note that installing the
bench costs nothing at the scheduler level — `scheduledFor()` only walks courses it is
told to walk, so a bench course can exist, be browsable and be excluded from the day.

---

## 8. Stop point

Per the brief, no curriculum data is written and nothing is installed. Awaiting sign-off
on §5 and answers to §7.

One thing outside the platform blocks Phase 2 entirely — it is not a Brickford problem
and it is covered separately in the message accompanying these notes.
