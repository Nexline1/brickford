# T-037: SPCH 100, the full storytelling course (about 50 hours)

**Source: owner, 2026-10-09.** "Storytelling course is only 5 lectures? I'm supposed to master it, and it can't happen with 5 (4 minutes) lectures." Owner decisions:
- **Size:** "Bigger: about 50 hours".
- **Timing:** "Right after T-026b".
- This is an owner-approved change to the curriculum's content.

## Background
- `platform/data/storytelling.js` is explicitly a five-lesson **seed**.
- The real course was designed in:
  - `docs/storytelling/01-taxonomy.md`: 16 modules, Track A (life and work, A1–A8) and Track B (content).
  - `docs/storytelling/02-harvest-runbook.md`.
- It was blocked because YouTube discovery and transcripts were unreachable (`docs/storytelling/00-harvest-blocker.md`). As of 2026-10-09:
  - transcript fetch works through the `Yt_T` MCP (`mcp__Yt_T__get_youtube_transcript`), verified on `nLpoqD7LHOU`;
  - discovery works through `WebSearch`.

## Scope
1. **Budget: about 50 core hours.** Scale the taxonomy's module budgets up from 30 h.
   - Weight the increase toward A5/A6 (humour, written and live), A3 (delivery), A7 (high-stakes talking and pitching to non-technical buyers) and A8 (non-native speaker).
   - Keep the dependency order from the taxonomy.
   - Record the final per-module hours in `01-taxonomy.md`, as a dated revision.
2. **Discovery.** Use `WebSearch` queries per module, following the runbook's query set, adapted (no `yt-dlp`).
   - Log every candidate (module, query, title, channel, URL/id) to `data/storytelling/candidates.jsonl`, or the location the runbook names.
   - Prefer teachers with depth, for example Matthew Dicks, The Moth, Matt Abrahams/Stanford GSB, Patrick Winston's MIT "How to Speak", Vinh Giang, Pixar in a Box, Julian Treasure.
   - Never invent a channel, video, URL or view count.
3. **Verification (hard rule):** never install a video without reading its transcript.
   - Fetch each candidate's transcript through the MCP.
   - Confirm it teaches the module's mechanic.
   - Store it, de-duplicated, where the existing two transcripts live.
   - Log every rejection, with its reason, in `docs/storytelling/rejections.md`.
   - Apply the runbook's redundancy rule: drop a video whose mechanic is already covered better.
4. **The lesson layer (`DAR.DRILLS` shape), for every installed lesson:**
   - the mechanic in one sentence;
   - 3–5 rules paraphrased from the transcript;
   - one drill of 10 minutes or less that produces an artifact;
   - one check that says how you know it worked.

   Also add a revision summary in the shape T-035's PDF needs: key ideas, plus 3 or more checks. Multiple-choice answers go in mixed positions; the engine shuffles them anyway.
5. **Install.**
   - Append new units after Unit II. Never insert or reorder: lesson keys are positional (`spch100.U.L`), and progress on the five seed lessons must stay attached.
   - Sequence the units by the taxonomy's dependency order.
   - Each lesson has `t`, `v` (id), and `min` (from the transcript's duration).
6. **Schedule.**
   - SPCH 100 runs inside the existing `Publish` block. Confirm in `DAR.SCHEDULE` and the scheduler that adding lessons lengthens only the SPCH track (about 30 weeks at ~20 min of video a day) and moves nothing else.
   - `START_DATE`, day 1094 (2030-04-02), the gate baseline (2030-04-03) and every other course's dates must be byte-identical before and after (verify-logic plus an explicit before/after diff of every course's lesson-to-date map).
7. **Gates.** Extend `verify-content` to cover SPCH. For every lesson:
   - the key resolves;
   - drill fields are present;
   - a transcript file exists for its `v`;
   - `min` is positive;
   - the summary is well formed, and every check's answer is inside its options.
8. **Bump every `?v=` token.**

## Out of scope
- Recording audio (T-028).
- The Sunday PDF (T-035).
- Changing any other course.
- New dependencies.

## Acceptance
- **Hours:** about 50 core hours installed, with per-module hours within ±20% of the revised budget.
- **Verification:** every installed video has a stored transcript, and every rejection is logged.
- **No other date moved:** the before/after date map of every non-SPCH lesson is identical, and day 1094 and the baseline are unchanged.
- **Plants:**
  - (a) a lesson without a transcript file;
  - (b) an inserted (not appended) unit that re-points `spch100.0.0`;
  - (c) a drill missing its check;
  - (d) a schedule change that moves another course's date.

  Each must make a gate exit 1.
- **All gates green.** A report goes to the owner: modules, hours, sources, and rejections with reasons.
