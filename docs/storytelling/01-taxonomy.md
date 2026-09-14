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
