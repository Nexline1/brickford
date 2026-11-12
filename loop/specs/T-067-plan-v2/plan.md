# T-067: Plan v2 — Python bridge, real practice, a re-ordered AI track, 5 hours a day

(Earlier sections of this file, T-064 Flutter stages, T-065 Monk Start and T-053 private sync, are done and merged. One item is still open: T-066, see step 0.)

## Context
Owner, 10 Nov, three weeks in (study day 23 of 1094):
- MATH 110 Unit I and AI 200 Unit I were fine. AI 200 Unit II (Karpathy) was too hard: basic Python, no practice, he explains in code.
- The owner wants:
  1. coding fundamentals first;
  2. real practice with unsolved problems and written answers, and a way to correct them;
  3. the AI lectures re-ordered;
  4. 3 h theory + 2 h practice a day, to finish faster;
  5. every lecture reviewed for repetition.
- Linear algebra stays as it is.

What the code shows (read-only look at main, 89e45e2):
- **The pace was the problem.** `scheduledFor` packs the Build track at 90 effort-minutes a day (`EFFORT = min × 1.8 + 4`, `BUILD_BUDGET = 90`), about 50 minutes of video. That put Micrograd on study day 3, Makemore 4 on day 14 and "Build GPT" on day 19, with no coding prerequisite anywhere.
- **Lectures already end around study day 518** (Build spine day 55, the math rotation about day 117, Phase 2 chain about day 393, papers day 518). The remaining days to 1094 are gates: projects, paper rebuilds, and getting hired (the last gate is 18 months). Studying faster cannot shorten the hiring gate.
- **Practice exists only as a counter.** The lecture page's "Go deeper" has four gates (`lessonGates`: recall text, rebuild ticks, "N problems unaided" with +/- buttons and a link out, explain). The app gives no problems of its own and corrects nothing.
- **Lesson keys are positional** (`course.unit.index`). Inserting or re-ordering lessons in `platform/data` silently re-points progress. Only SPCH 100 is pinned by a ledger today.

Owner's decisions (11 Nov):
- **Speed:** decide after the audit, with real dates.
- **Karpathy:** redo from Micrograd after the bridge, typing along.
- **Correction:** self-check **and** in-app Claude grading with the owner's own key.
- **Python course:** I choose after checking transcripts.

My answer to "watch more or practice more?": practice more. For code, about one part watching to two parts typing. For math, one lecture, then problems the same day.

## The goal, and one clear path (owner, 12 Nov)
**Goal, in the owner's words:** "AI Scientist (the idea is to be a top tier engineer in math and physics, in the computing industry) and a founder of a startup that shall reach billions of people, and hopefully being able to obtain Nobel prize along the way." The fork is therefore decided now: **AI scientist with deep math, physics and computing engineering, and a founder.** This overrides the starting table in step 1 where they differ:
- **The full math stays core.** Linear algebra, calculus, probability and MATH 210 (matrix calculus, optimisation, information theory, MacKay in full) are a scientist's tools. Trim only true duplicates, never "hard" lectures. A multivariable unit (partial derivatives, gradients) is added, and the audit lists what a math-and-physics engineer still lacks (multivariable calculus in full, differential equations) as proposed later courses for the owner to approve, sources checked by transcript.
- **Physics is core, not an elective.** PHYS 100 (MIT 8.01, 37 lectures) stays on the schedule and is placed by prerequisite (after single-variable calculus), with practice problems like the math lectures. The audit proposes the next physics courses (electromagnetism, then statistical physics, which underlies much of machine learning) for approval.
- **Computing engineering is core:** SYS 250 in full (deep learning systems, CUDA and kernels), CS 150 algorithms, and the Python bridge.
- **Core for an AI scientist:** the Paper Room (AI 300), CS336 (AI 310), reinforcement learning, mechanistic interpretability and research craft (RES 400).
- **Core for a founder:** Storytelling, publishing, shipping projects, and the Treasury block.
- **Optional:** only true duplicates and what no path needs (fast.ai lessons 6–7 at most). Because little is cut, option A ("lectures sooner") comes from 5 hours a day and a better order, not from trimming; `dates.md` shows the honest result, including the added courses.
- Honest note for `audit.md`: a self-taught route to science needs published work, so the paper reimplementations and the first original result matter more than any lecture; the gates already say this and are kept.

**One clear path (owner's choice).** The order must make sense lecture to lecture:
- **A prerequisite map.** Every lecture gets `needs: [lessonKey, …]` (inside its course and across courses: for example the chain rule before Micrograd, matrix multiplication and broadcasting before Makemore 1, conditional probability before the bigram model, Python functions and classes before any Karpathy code). Built in step 1 from the summaries and transcripts, as `loop/specs/T-067-plan-v2/prerequisites.md`, then stored in the data in step 2.
- **A level per lecture** (1 intro, 2 core, 3 advanced). Within a track the level never jumps by more than one from one scheduled lecture to the next without a bridge lecture in between.
- **The v2 sequence is derived from the map**, not from course order: a lecture is scheduled only after everything it needs. The daily tracks stay (math, AI/Python, Storytelling), but each track is one ordered line, and the three math courses are interleaved by prerequisite instead of a blind daily rotation.
- **The app shows it.** Each lecture page lists "Needs" (with a tick when watched) and "Leads to", and the Atlas shows the path as one line per track.
- **Gates:** `verify-content` fails if any `needs` key does not exist, if the map has a cycle, or if a level jumps by more than one; `verify-logic` fails if any v2 day schedules a lecture before one of its prerequisites (plants for each).

## Not a reset
`START_DATE` (2026-10-16), sealed days, the streak, watched lectures and the hash chain do not move. This re-plans the future only, so the standing "refuse resets" rule does not apply. Past days keep the lessons they had.

## Step 0: finish T-066 first (same scheduler function)
The Storytelling Fri/Sat calendar fix (`loop/T-066-publish-anchor`, worktree `/home/user/bf-T-066`) stopped on a usage limit while running the web gates. Resume that builder, verify (logic, sync-loop, analyze, tests, verify-app, boot, scope), merge, and confirm the Pages run succeeded.

**State, 12 Nov:** the T-066 builder was resumed once and hit the usage limit again while re-running `verify-app` (its work is committed in the worktree). Next action: check `git status` and `git log` in `/home/user/bf-T-066`, resume the same builder with SendMessage once requests are accepted, and if it fails a third time, finish the remaining checks myself (verify-app, rebuild `app-web/`, verify-boot, scope diff) rather than spawning again.

**State, 13 Nov:** I ran the remaining T-066 checks myself on the builder's commits (5ed19c6): verify-logic 238 invariants, verify-sync-loop, flutter analyze, 120 tests, `tools/build-app.sh`, verify-boot and verify-app 326/326 all pass. The rebuilt `app-web/` (index.html, main.dart.js) is uncommitted in `/home/user/bf-T-066`. Remaining for step 0: commit the rebuild and the gate outputs, push, check the scope diff and `verify-flows` (the builder's run1 output is there; re-run once if it shows the known flaky (j)/(n)/(p)), open the PR, merge, confirm the Pages run.

## Step 1: the audit (no app change) → the owner approves before anything is trimmed
Outputs in `loop/specs/T-067-plan-v2/`:

**`audit.md`: every lecture marked core / optional / duplicate, with the reason.**
- Built from the 455 existing lecture summaries (`DAR.SUMMARIES`: takeaway and beats) by a read-only script, `tools/audit-lectures.js`, that lists overlapping pairs within and across courses. I judge each pair. Nothing is deleted: "optional" is a flag.
- My starting position, to confirm lecture by lecture:

| Course | Proposal |
|---|---|
| MATH 110 | Unchanged (owner). |
| MATH 120 (18.01) | Keep derivatives, chain rule, optimisation, approximation, Taylor, the fundamental theorem. Mark the integration-technique lectures optional (about a third). Add a short partial-derivatives and gradient unit, which ML needs and the plan lacks. |
| MATH 130 (Stat 110) | Keep through joint distributions, covariance, LLN/CLT, conditional expectation and Markov chains (a bigram model is one). The audit decides the tail. |
| AI 200 | "Intro to LLMs" and "Deep dive into LLMs" overlap; both need no code, so they move forward into the bridge weeks, and one may become optional. |
| AI 210 (fast.ai) | Lessons 1–5 and 8 core; 6 (random forests) and 7 (collaborative filtering) optional. |
| MATH 210 | MacKay: keep entropy, KL, source coding; the coding-theory lectures optional. |
| SYS 250, RES 400 (RL) | Optional until the fork (gate 4) chooses a path. |
| PHYS 100 | Already an elective, but scheduled every 4th day from week 27; take it off the schedule. |
| SPCH 100 | 170 lessons; flag near-duplicates inside each unit from the summaries. |

**`python-bridge.md`: the bridge course, chosen from transcripts** (YouTube transcript tools; nothing is added unread, per `docs/CONTENT-STANDARD.md`).
- Candidates:
  - CS50P (same teacher as CS50, real problem sets), the leading candidate;
  - a short crash course;
  - NumPy and PyTorch tensor basics;
  - 3Blue1Brown's later deep-learning chapters as no-code AI lectures.
- All must be free to watch without YouTube Premium.

**`sequence.md` and `dates.md`: the proposed order, and old vs new dates computed by the real scheduler** (never by hand), for two options:
- (A) lectures sooner, gates and day 1094 unchanged;
- (B) gates shortened too.

The owner picks.

Proposed arrangement (to be confirmed by the audit):
- **Daily, six days a week, 5 h.**
  - Theory, 3 h: a math lecture with notes (about 90 min), an AI or Python lecture (about 60 min), Storytelling (about 30 min).
  - Practice, 2 h: coding (about 75 min) and math problems plus one written answer (about 45 min).
- **AI/Build track.**
  1. Bridge, about 7 weeks: Python, then NumPy and PyTorch basics, mostly exercises. The no-code AI lectures (LLM talks, 3Blue1Brown chapters) run alongside so the subject stays alive. Easy NeetCode problems start mid-bridge.
  2. Karpathy second pass, typing along at about 35 minutes of video a day: Micrograd, Makemore 1–5, Build GPT, Tokenizer, GPT-2, each followed by a "rebuild it without the video" exercise. fast.ai 1–5 interleaved, one a week.
- **Math track.** The LA → Calc → Prob rotation continues unchanged; each lecture gets a problem set the same day.

## Step 2: Plan v2 in the scheduler (web and Flutter, one PR)
Files: `platform/data/curriculum.js` and a new `platform/data/python-bridge.js` (PROTECTED path, named here), `platform/js/app.js` (`scheduledFor`, `windowFor`, budgets, `backlogCount`), `app/lib/engine/engine.dart` (1:1 port), `tools/export-data.js`, `tools/verify-logic.js`, `tools/verify-content.js`, `tools/verify-app.js`, `CLAUDE.md` (a short "Plan v2" section; PROTECTED, approved with this plan).

- **Append-only data.**
  - New course `cs100` (Python for ML).
  - A new last unit in `ai200`, "Second pass: type along", whose entries point at the same videos as Micrograd and Makemore 1–4 under new keys, re-using their summaries and quizzes by alias. The originals stay watched.
  - A lesson flag `optional: true`.
  - No existing key moves.
- **A cutover date, `PLAN_V2_FROM`** (the Sunday after it ships).
  - `scheduledFor(iso)` before that date runs the v1 code path untouched.
  - From it on, an explicit v2 sequence, packed with the v2 budgets from slot 0.
  - Optional lessons are never scheduled, but stay watchable and count if watched.
- **Backlog.** A v1 lesson that v2 re-schedules in the future is not owed. Past days keep their v1 lists; a missed day still turns green when its lecture is later watched.
- **Phase 2 opens when the math rotation ends,** not on fixed day 182, if the owner picks option A.
- **Gates (each with a plant that must exit 1):**
  - every date before the cutover schedules exactly what main schedules today (snapshot generated from main, on Thursday, Friday, Saturday and Sunday clocks);
  - a ledger pins every lesson key in every course to its video id (extends the SPCH 100 ledger check in `verify-content.js`);
  - watched lessons, sealed days, streak and `START_DATE` are untouched;
  - no v2 day exceeds 3 h of lectures;
  - an optional lesson is never scheduled;
  - Dart and JS agree on every day from the start to the end of the lectures (`verify-app`).

## Step 3: the practice engine (web first, then a Flutter PR)
Files: new `platform/data/practice-*.js` (`DAR.PRACTICE[lessonKey]`), `platform/js/app.js` (the lecture page under the quiz, plus a daily Practice list), `tools/verify-content.js`, `docs/CONTENT-STANDARD.md` (PROTECTED, named here: the practice-item standard), then `app/lib/screens/`.

- **Item types.**
  - `numeric`: auto-checked, re-using the quiz engine's numeric grading.
  - `output`: a coding exercise done in Replit; the app checks the value your code prints.
  - `worked`: solve on paper, enter the result, then the worked solution appears and you mark got it / partly / missed.
  - `write`: a written answer; a checklist of key points and a model answer appear only after a real attempt.
- **Correction, as chosen.**
  - Self-check: the revealed solution or checklist. Missed items return through the existing spaced review (`S.review`, Forgot / Shaky / Solid).
  - **Grade with Claude:** a button on `write` and `worked` items.
    - It sends only the question, the checklist and the owner's answer, straight from the browser with the owner's API key.
    - The key is stored on the device only (`brickford_anthropic_key`), never synced, logged or committed.
    - It returns a verdict per key point and one correction. Offline or without a key it falls back to self-check.
    - The builder loads the `claude-api` skill for the model id and headers, and re-uses T-047's key-handling spec.
  - A "Copy this week's answers" button, for a free weekly review in chat.
- **State.** `S.practice[lessonKey]` (answers, marks, time), merged per field by time like the rest. It syncs only to the private repo.
- **Content standard.**
  - Problems are similar to the lecture's example, never identical.
  - Every numeric answer is recomputed independently in `verify-content.js` (an `expectedPractice` table, same pattern as `expectedSummary`).
  - Every `output` item is verified by running a reference solution with `python3` in the gate.
  - No bare `<`.
- **Math lectures are covered explicitly (owner, 11 Nov).**
  - Every core lecture in MATH 110 (Unit I and the 35 MIT lectures), MATH 120, MATH 130 and MATH 210 gets 2 to 3 unsolved problems similar to the lecture's worked examples (same method, different numbers or setup, never identical), sized by `practiceTarget` (1 for a 10-minute chapter, 2 to 3 for a 50-minute lecture).
  - Types are `numeric` (answer auto-checked) and `worked` (solve on paper, enter the result, then the worked solution and a "got it / partly / missed" mark). Each is derived from that lecture's summary (`DAR.SUMMARIES`) and its transcript, so it matches what the video teaches.
  - A coverage gate in `verify-content.js` ratchets: the number of core math lectures without practice items may only go down, and any lecture inside the next 14 days of the calendar must have them. No lecture ships to the calendar without its problems.
  - The lecture page shows them under the quiz, and the daily 2 h practice block lists "today's math problems".
- **First content batch.**
  - A MATH 110 Unit I review set (3 problems per chapter, the "recall the fundamentals" request).
  - AI 200 Unit I: one written prompt per chapter plus "explain how a network learns, end to end".
  - MATH 120 Unit I.
  - The next two weeks of math lectures.
  - Python weeks 1–2.
  - After that, a batch each week ahead of the calendar.

## Delivery
One sonnet builder per step, no separate reviewer; I verify by script and merge, and check the Pages run after every merge. Order: step 0 → step 1 (owner approves the audit and picks A or B) → step 2 → step 3 web → step 3 Flutter → weekly content.

## Verification
- **Step 1:** the audit script's output is reproducible. Every bridge candidate has its transcript stored. `dates.md` comes from the real scheduler through the test hook.
- **Step 2:** `verify-logic`, `verify-content`, `verify-app` (parity), `verify-sync-loop`, `flutter analyze` and `flutter test`, each plant exiting 1. A manual look at the calendar on a Saturday clock: past days are unchanged, future days show v2.
- **Step 3:** `verify-content` (recomputed answers, `python3` reference runs), `verify-flows` (answer a numeric item, reveal a worked solution only after an attempt, tick a checklist, a missed item appears in Recall), `verify-sync-loop` (practice state merges, the API key never leaves the device, a stubbed grading call), contrast, shell and clip.
- **Honest limits:**
  - I cannot see the owner's progress.
  - Week counts above are estimates until `dates.md`.
  - Grading quality with real Claude is tested against a stub only.
  - No iPhone here.
