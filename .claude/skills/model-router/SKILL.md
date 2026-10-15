---
name: model-router
description: Picks which Claude model (opus, sonnet, haiku) each delegated task runs on, and cuts the token waste that doesn't depend on the model at all. Quality comes first, so judgement work stays on the strongest model and only mechanical, checkable work moves to a lighter one. Use it before every Agent spawn in the Brickford loop (BUILD, CHECK, REVIEW, DISCOVER, research, source fetching, sweeps). Also use it whenever the owner mentions tokens, usage limits, cost, or "which model", or a run keeps hitting the usage limit, even if they don't ask for routing by name.
---

# model-router

The owner's rule, in their words: **quality is the priority**. Saving tokens is good only when the work comes out just as good. A defect that ships costs more tokens later (a review round, a fix, a re-review, a re-merge) than any downgrade saves. So the default answer is the strongest model, and a task earns a lighter one only by passing the test below.

## The test: may this task run on a lighter model?

All three must be true:

1. **The output is checkable without trusting it.** A script exit code, a diff, a file that exists, a number that can be recomputed. If the only check is "read it and judge whether it's right", the task is judgement work.
2. **A miss is cheap and visible.** If the light model gets it wrong, you notice right away, before anything ships or anyone relies on it. Nothing quietly lands in the app, the curriculum or a quiz key.
3. **It needs no taste or adversarial thinking.** Following a clear recipe, moving or fetching things, and summarising output a script produced all qualify. Designing, deciding, teaching and hunting for bugs do not.

If any answer is "no" or "not sure", use **opus**. Doubt resolves upward.

## Routing table

| Task | Model | Why |
|---|---|---|
| Building app code (brickford-builder) | **opus** | Every line ships. A subtle bug costs a review round, which costs more than the build. |
| Adversarial review (brickford-reviewer) | **opus** | Its whole job is to find what a strong builder missed. A weaker reviewer passes defects. |
| Content and quiz writing, summaries, answer keys | **opus** | A wrong key gets rehearsed by the scheduler for months (`docs/CONTENT-STANDARD.md`). |
| Specs, proposals, mockups, design | **opus** | This is taste and trade-offs, and the owner reads it. |
| Anything that goes to the owner as a question or a recommendation | **opus** (you, inline) | Their decision rests on it. |
| Source checks: does this quote, number or claim match the source? | **opus** | This is judgement about meaning, even when it looks mechanical. |
| Finding files, listing usages, mapping where something lives (Explore) | **sonnet** | Results are paths and lines you open yourself before acting. |
| Fetching and caching sources (transcripts, repo files, pages) with no writing | **sonnet** | The file is either there or not, and its SHA is recorded. |
| Summarising a long gate or test log into "which checks failed, with the lines" | **haiku** | The raw log stays on disk, so open the failing lines yourself. |
| Inventories and counts (how many lectures lack X; list rows with status Y) | **haiku**, or better a script | The count can be recomputed in one line. |
| Re-running a known screenshot or gate sweep from an existing script | **no model**: Bash plus Monitor | A script needs no agent. |

A row that says "sonnet" or "haiku" is a ceiling, not a target. If the task grows mid-flight (the fetcher starts deciding what a source *means*, the searcher starts proposing fixes), finish it on opus.

## How to set the model

- **Agent tool:** pass `model: "opus" | "sonnet" | "haiku"`. Leaving it out inherits whatever this session runs on, which can change. So set it explicitly whenever the model matters.
- **Agent definitions:** `brickford-builder` and `brickford-reviewer` pin `model: opus` in their frontmatter, so a session started on a lighter model can't silently downgrade them.
- **Resuming an agent** with SendMessage keeps its model and its context. Prefer that to a new spawn (see below).

## Token savings that cost no quality (do these first)

Most waste in this loop has nothing to do with the model, so fix these before reaching for a lighter one:

1. **Resume, don't respawn.** A new agent starts cold and re-reads the spec, CLAUDE.md, lessons and the diff, often 50–150k tokens before it does anything. Send the next round to the same builder or reviewer with SendMessage. Spawn fresh only where independence is the point: the first review of an item. (Round 2 goes to the same reviewer, who already knows the code.)
2. **Scripts over agents for anything deterministic.** Gates, plants, sweeps, censuses and verbatim quote checks all belong in a script under the scratchpad, run with Bash and watched with Monitor. A script costs zero model tokens on every re-run.
3. **Narrow briefs.** Tell an agent exactly what to read: the spec path, the diff range, and the scratch files from the last round. Don't say "review the repo". For round 2, name the findings and the files they touch.
4. **Pass results by path, not by paste.** Point at `verification/summary.txt`, not at 400 lines of log in the message.
5. **Don't re-read what's in context.** If a file was read this session and hasn't changed, use what you have.
6. **Background long runs, no polling.** Use `run_in_background` plus one completion notice, never repeated status checks.
7. **Checkpoint often.** A run cut off by the usage limit and resumed loses nothing. A run that never committed redoes everything.

## Record what was used

Add the model to each `loop/state.md` line for a delegated task, e.g. `builder (opus, resumed)` or `source fetch (sonnet)`.

If a light-model task comes back wrong or thin, redo it on opus. Don't patch around it. Then add a line to `loop/lessons.md` so that task type moves up a row next time. The table should drift towards what actually worked.

## What to tell the owner

When they ask about tokens, be straight about it. The heavy work in this project (building, reviewing, writing quizzes) stays on opus because it's quality work. The savings come mostly from resuming agents, from scripts and from narrow briefs, with lighter models only for fetching, searching and counting. Don't promise a figure you haven't measured.
