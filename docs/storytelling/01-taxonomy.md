# Phase 1 — Taxonomy

The module tree, fixed before searching so the searches have targets. Sixteen modules
across two tracks, as briefed, with per-module hour budgets and the dependency order the
core path has to follow.

This will be revised once the harvest shows where the material actually is. Modules that
turn out to have no good source get said so in the final report rather than padded.

---

## Budget

Settled: **40 effort-minutes a day, 5 days a week.**

Brickford's pacing model is `EFFORT(min) = video × 1.8 + 4` — watch, take notes, do the
thing once. So:

```
40 effort-min/day  ->  20 min of video/day  ->  100 min/week  ->  1.67 h/week
```

| core path | weeks |
|---|---|
| 25 h | 15 |
| 30 h | 18 |
| 35 h | 21 |

**Target: 30 hours, ~18 weeks.** That is one full pass ending around week 18 of the
storytelling track, running inside the ~30-minute `Publish` block already declared in
`DAR.SCHEDULE` and never filled. The existing four hours are untouched.

Storytelling rests Saturday (Brickford's rest day) **and** Friday. Friday is not a
second day off — it carries the weekly recorded rep from Phase 7. The rep is the work.

---

## Track A — storytelling for life

Goal: be someone people want to keep listening to. In conversation, in meetings, in
audits with business owners.

| id | module | core hrs | why it is weighted this way |
|---|---|---|---|
| **A1** | Story structure for spoken stories | 3.0 | Everything in Track A stands on this. Spoken anecdote structure, not screenwriting. |
| **A2** | Finding stories in an ordinary week | 1.5 | Small module, huge leverage — it is the input to every rep in Phase 7. Matthew Dicks' "Homework for Life" is the spine here and is already verified. |
| **A3** | Delivery: pacing, pauses, volume, presence | 2.5 | The first thing that changes how you land in a room. |
| **A4** | Conversation mechanics | 2.0 | Listening, asking, holding the floor without dominating. The audit skill. |
| **A5** | Humor construction | 3.0 | Joke anatomy, setup/punchline, misdirection, the rule of the specific. Written, slow, learnable. |
| **A6** | Humor in real time | 2.0 | Callbacks, self-deprecation that doesn't cost status, riffing, "yes and". Only works on top of A5. |
| **A7** | High-stakes talking | 2.5 | Pitching, explaining technical work to non-technical buyers, objections live. Directly your audits. |
| **A8** | Speaking as a non-native English speaker | 1.5 | Clarity, rhythm, accent confidence. **English-language sources** — this is not the Arabic module. |
| | **Track A total** | **18.0 h** | |

## Track B — storytelling for content

Goal: a personal brand on short-form, documenting what you build.

| id | module | core hrs | why |
|---|---|---|---|
| **B1** | Short-form structure | 2.5 | Hooks, lock-in, loops, payoffs. The highest-churn module — recency weighted hard. |
| **B2** | Retention mechanics and reading your analytics | 2.0 | Recency weighted. Reading your own graph is a skill, not a dashboard. |
| **B3** | Story selection | 1.5 | Which of your own experiences are worth a video. Shares its spine with A2. |
| **B4** | Documenting a build without it becoming a vlog | 2.0 | The one nearest what you're already doing daily. |
| **B5** | Long-form and YouTube structure | 1.5 | Deliberately light — you have not outgrown shorts yet. Recency weighted. |
| **B6** | Delivery on camera | 1.5 | Energy, register, self-tape. A3 transfers most of the way; this is the delta. |
| **B7** | Personal brand positioning and content pillars | 1.0 | Small on purpose. This module attracts the most padding and the least mechanic. |
| **B8** | Arabic and Gulf-specific content | **0 (archive)** | Per your call — harvested and archived, not core-pathed. See below. |
| | **Track B total** | **12.0 h** | |

**Core path total: 30.0 h across 15 scheduled modules.**

---

## Dependency order

The brief is explicit that order follows dependency, not score: *structure before
delivery, delivery before humor, humor before riffing.* Extending that through both
tracks:

```
A1 structure
 └─ A2 finding stories ──────────────┐
     └─ A3 delivery                  │
         ├─ A5 humor construction    │   (needs structure: a joke is a story with
         │   └─ A6 humor in real time│    a load-bearing last word)
         ├─ A4 conversation mechanics│
         │   └─ A7 high-stakes talking
         └─ A8 non-native delivery   │
                                     │
                         B3 story selection  (inherits A2's noticing)
                          └─ B1 short-form structure
                              ├─ B2 retention + analytics
                              ├─ B6 on-camera delivery  (inherits A3)
                              ├─ B4 building in public
                              └─ B7 positioning
                                  └─ B5 long-form
```

Track A runs first and Track B interleaves from B3 onward, because B3 and B6 are cheaper
once A2 and A3 are done — the same mechanic, pointed at a lens instead of a room.

Rough shape of the 18 weeks:

| weeks | focus |
|---|---|
| 1–4 | A1, A2 — structure and the story bank starts filling |
| 5–7 | A3, A8 — delivery, incl. non-native clarity |
| 8–11 | A5, A6 — humor written, then live |
| 12–13 | A4, A7 — conversation and high-stakes |
| 14–18 | B3, B1, B2, B6, B4, B7, B5 |

Phase 7's reps start in **week 1**, not week 14. Watching A1 while logging the story
bank daily is the whole point; the videos are scaffolding for the reps, not the other
way round.

---

## B8 and the Arabic material

Your call was English-only for the core path, Arabic collected to archive. So:

- The Arabic seed queries **still run** in the harvest — they cost nothing and the
  archive is where they land.
- B8 gets **zero core hours** and is excluded from the schedule.
- Everything found is tagged `"language": "ar"` and `"module": "B8"` in
  `candidates.jsonl`, ready to promote later via the bench promote control.

Worth saying plainly: B8 is the module most likely to matter for a Gulf audience and
least likely to have a good taught source in either language. I expect it to be the
weakest module in the final report. Parking it is the right call for now; it is not a
solved problem.

---

## What "a module is covered" means

Per the brief: every module gets **at least one** core video, **no more than three**.
A module is covered when its core videos between them hand over:

1. a named, repeatable mechanic,
2. at least one worked before-and-after,
3. something drillable in ten minutes.

A module with three videos and no drillable mechanic is **not** covered, and gets
recorded as a gap rather than quietly counted.

---

## Revision — 2026-10-09 (T-037): about 50 hours, and what was installed

**Source:** owner, 2026-10-09 — "Storytelling course is only 5 lectures? I'm supposed to
master it" — and the decision **"Bigger: about 50 hours"** (spec
`loop/specs/T-037-spch100-full-course/spec.md`). This revision supersedes the 30-hour budget
above. The module tree, the dependency order and B8's archive status do not change.

### The revised budget, against what was installed

The revised budget is the spec's instruction applied to the 30 h plan: the extra 20 h go
to A5/A6 (humour, written and live), A3 (delivery), A7 (high-stakes talking and pitching to
non-technical buyers) and A8 (non-native speaker), with 2 h to A4 because it is the audit
skill and half an hour to A1; Track B keeps its original budget. It was **not** fitted to
what the harvest found — where a module came in short, the table says so.

| id | module | 30 h plan | **revised** | **installed** | lessons | vs revised | ±20% |
|---|---|---|---|---|---|---|---|
| A1 | Story structure for spoken stories | 3.0 | 3.5 | 3.33 | 13 | −5% | yes |
| A2 | Finding stories in an ordinary week | 1.5 | 1.5 | 1.23 | 9 | −18% | yes |
| A3 | Delivery | 2.5 | 6.0 | 5.47 | 14 | −9% | yes |
| A4 | Conversation mechanics | 2.0 | 4.0 | 4.12 | 13 | +3% | yes |
| A5 | Humour construction | 3.0 | 6.0 | 5.18 | 21 | −14% | yes |
| A6 | Humour in real time | 2.0 | 5.5 | 4.50 | 16 | −18% | yes |
| A7 | High-stakes talking | 2.5 | 7.0 | 7.37 | 24 | +5% | yes |
| A8 | Speaking as a non-native speaker | 1.5 | 4.5 | 3.90 | 17 | −13% | yes |
| | **Track A** | 18.0 | **38.0** | **35.10** | 127 | −8% | 8 of 8 |
| B1 | Short-form structure | 2.5 | 2.5 | 2.08 | 6 | −17% | yes |
| B2 | Retention and analytics | 2.0 | 2.0 | 1.87 | 6 | −7% | yes |
| B3 | Story selection | 1.5 | 1.5 | 1.45 | 3 | −3% | yes |
| B4 | Documenting a build | 2.0 | 2.0 | 1.93 | 6 | −3% | yes |
| B5 | Long-form and YouTube structure | 1.5 | 1.5 | 1.68 | 7 | +12% | yes |
| B6 | Delivery on camera | 1.5 | 1.5 | 1.42 | 12 | −6% | yes |
| B7 | Positioning and content pillars | 1.0 | 1.0 | 0.90 | 3 | −10% | yes |
| | **Track B** | 12.0 | **12.0** | **11.33** | 43 | −6% | 7 of 7 |
| B8 | Arabic and Gulf content | 0 | 0 (archive) | 0 | 0 | | |
| | **Core path** | 30.0 | **50.0** | **46.43** | **170** | **−7%** | 15 of 15 |

"Installed" is the sum of each lesson's `min` by module (`DAR.DRILLS[key].module`), the five
seed lessons included under their modules. `min` is the part of the video to watch: where
the teaching ends before the video does (a Q&A, a sponsor, plugs) the title says "stop at",
and where it starts late, "start at" — so the hours are teaching time, not upload length.

### Where it fell short, and what review round 1 found

The first draft of this section said the harvest stopped at 43.3 h because good material
ran out before the hours did. **For Track B that was not true: Track B had not been searched
to the same depth.** Counting distinct queries in `candidates.jsonl`, Track A modules had
8–28 each and B2–B7 had 3–6. Five Track B modules sat outside ±20% (B2 −23%, B3 −68%,
B4 −38%, B5 −23%, B6 −47%), and the review sent it back.

Review round 1 searched each of B2–B6 to Track A depth: the runbook's queries for the
module (`tools/storytelling/queries.json`) plus adapted variants, **eight queries per module,
40 in all**, each logged with the ids it returned in `data/storytelling/searches.jsonl`.
Every plausible result was logged in `candidates.jsonl` — installed, read and rejected, or
not fetched — with its reason. It also found that two B3 rejections were stale: they had
been rejected only because the transcript tool stopped at its 120,000-character limit, and
the tool now returns whole transcripts. Both were re-fetched and read in full.

11 lessons and 3.1 h were installed, every transcript read in full first:

| module | before | added | after | vs revised |
|---|---|---|---|---|
| B2 | 1.55 h | intros measured at 30 seconds; why CTR misleads | 1.87 h | −7% |
| B3 | 0.48 h | Paul Smith: choose the story from the objective (a re-fetched stale rejection) | 1.45 h | −3% |
| B4 | 1.25 h | Arvid Kahl's share / don't-share list; storytelling for engineers (LISA19) | 1.93 h | −3% |
| B5 | 1.15 h | Derek Muller: start with the misconception; Johnny Harris on writing a long video | 1.68 h | +12% |
| B6 | 0.80 h | teleprompter writing and rehearsal; why prompter reads sound fake; an anchor's habits; body language in the frame | 1.42 h | −6% |

Six further results were read in full and rejected (density, overlap, or a claim the
source does not support), and 46 were logged as not fetched. The Johnny Harris interview is
strong throughout, but only 26 of its 87 minutes are counted, so B5 stays inside its band;
Paul Smith's 63 minutes are counted to 58, where the teaching ends.

So: **all fifteen modules are now inside ±20% of the revised budget, at 46.4 h of 50.**
The 3.6 h still short is spread thinly — 2.9 h across Track A modules that are each inside
their band, 0.7 h across Track B — rather than concentrated anywhere. The 28 Track A
candidates rejected for truncation alone were not revisited this round, because no Track A
module is outside its band; they are the first place to look if the course is ever taken
to the full 50 h.

### The schedule

SPCH 100 runs only inside the `Publish` block, five days a week (it rests Saturday with
the plan and Friday for the recorded rep). Measured with the app's own `scheduledFor()` on
a fixed clock: **170 lessons over 186 Publish days, 2026-10-05 to 2027-06-21 — about 37
weeks**, averaging 15 minutes of video a day (whole lessons are packed into the
40-effort-minute block, so a day often carries less than the 20-minute ceiling). Every
other course's lesson dates, the start date, day 1094 (2030-04-02) and the gate baseline
(2030-04-03) are unchanged; the before/after date map is in
`loop/specs/T-037-spch100-full-course/verification/`.

### Install order (positional keys, append-only)

Units III–XVII were appended after the seed Units I–II, never inserted, in the dependency
order above. Top-up lessons were appended to the **end** of their unit, so no existing
`spch100.U.L` key ever pointed at a different video. `data/storytelling/ledger.json` pins
every key to its video, and `verify-content` fails if a pinned key moves.

| unit | module | lessons | hours |
|---|---|---|---|
| I, II | seed (A2, A3, A7 / A1, A6) | 5 | 1.28 |
| III | A1 structure | 12 | 3.27 |
| IV | A2 finding stories | 8 | 0.93 |
| V | A3 delivery | 13 | 5.28 |
| VI | A8 non-native speaker | 17 | 3.90 |
| VII | A5 humour construction | 21 | 5.18 |
| VIII | A6 humour in real time | 15 | 4.42 |
| IX | A4 conversation | 13 | 4.12 |
| X | A7 high stakes | 23 | 6.72 |
| XI | B3 story selection | 3 | 1.45 |
| XII | B1 short-form structure | 6 | 2.08 |
| XIII | B2 retention and analytics | 6 | 1.87 |
| XIV | B6 on camera | 12 | 1.42 |
| XV | B4 documenting the build | 6 | 1.93 |
| XVI | B7 positioning and pillars | 3 | 0.90 |
| XVII | B5 long-form | 7 | 1.68 |

### Rules that changed with the size

- **"No more than three core videos per module" is lifted.** At 50 h it cannot hold. It is
  replaced by the redundancy rule applied per lesson: a video is installed only if it adds a
  mechanic no installed lesson already teaches. Where two installed teachers disagree (how
  to open a talk; whether to aim for a native accent) both are kept and the lessons say so.
- **Truncation.** During the harvest the transcript tool stopped at about 120,000
  characters of raw captions. A candidate with more than about 15% of its teaching unread
  was rejected rather than installed half-read; 30 were rejected for this alone (two of
  them, in B3, were re-fetched whole in review round 1: one installed, one rejected on density). The rule
  was not applied consistently, and the first draft of this file said it was: six videos
  were installed at full length with their last 6–10% unread (hCf3dHd8_i8, 6-shbSFc48E,
  SP8YSgUkCh0, ABw26imw4m4, 7eosJwqoDaY, LTrrd94QEdU). Review round 1 caught it. On
  re-fetch the tool returned all six whole, and the three lessons that had been timed to
  stop before the cut (7TiX-tTSRVU, j7gYVXjDePw, m8v3jf8RVBk) as well; all nine were
  re-read and re-stored, and their candidate notes and lesson notes corrected. Every
  installed transcript is now complete, so no `min` changed and the hours above stand.
  `verify-content` now fails if a stored transcript is cut short and the lesson does not
  stop (in its title, and in `min`) at or before the cut.
- **Every lesson carries the full layer:** the mechanic in one sentence, 3–5 rules
  paraphrased from the transcript, a drill of 10 minutes or less that produces a written,
  recorded or spoken artifact, a check, and a revision summary with at least three
  multiple-choice checks — all asserted by `verify-content`.
- **Checks must need the lesson** (review round 1). At review the answer was the unique
  longest option in 436 of 479 checks, so picking the longest passed. Every distractor was
  rewritten as a plausible misreading of the same video at the answer's length; now 91 of
  513 (17.7%), and `verify-content` fails if more than about a third are (the unique
  shortest is bounded the same way).
- **Every name has a source** (review round 1). Each teacher, channel or person a lesson
  names is logged in `candidates.jsonl` for that video with where the name comes from — the
  title, a transcript quote, a logged WebSearch result, or another lesson's source — and
  `verify-content` fails on a name that isn't. Attributions nothing supported were rewritten
  (a lesson says "a communication coach" where neither title nor transcript names him).
