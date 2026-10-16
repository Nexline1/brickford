# Resume here, if a session ends mid-work

Updated 2026-10-10. Everything below is pushed to GitHub. A fresh session can continue from this file, `loop/queue.md` and `loop/state.md` alone.

## How the loop runs
- Process: `.claude/skills/brickford-loop/SKILL.md`.
- Per item: a spec in `loop/specs/<id>/spec.md`, then a worktree `/home/user/bf-<id>` on branch `loop/<id>` from `origin/main`.
- Then BUILD (brickford-builder; a general-purpose agent if the item needs WebSearch or the YouTube transcript MCP), CHECK, REVIEW (brickford-reviewer, stop after 3 rounds and ask the owner), PR, merge.
- **Owner's standing instruction:** merge once review passes.
- **Saving:** builders commit and push after every step. If one stops on a usage limit, re-send the remaining steps; the worktree and branch hold its work.
- **One long agent at a time.** Two at once hits the limit sooner.
- **Gates**, run one at a time, as listed in CLAUDE.md, plus clip under `TZ=America/Los_Angeles`.
- **Commit trailer:** `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01CoARp7vRj6L4B4zT6ME4Ng`.

## Where things stand
- **Merged:**
  - #9 T-025 (Dark, Light, Auto)
  - #10 T-023 (floating tab bar)
  - #11 T-026a (Atlas and Courses)
  - #12 T-032 (MCQ shuffle)
  - #13 T-026b (Problems, Exams, Proof)
  - #14 T-037 (SPCH 100, 170 lessons)
- **Merged since:** #15 T-038 (honest gates), #16 T-031 (Atlas/Courses polish), #17 T-039 (gate reloads prove storage arrived; tools/lib-reload.js), #18 T-026c (Week, Calendar day view, Library), #19 T-028 (Practice recorder).
- **Building:** T-033 (quizzes + summaries for the 80 lectures with none), worktree `/home/user/bf-T-033`, by a general-purpose agent (needs the YouTube transcript MCP and WebFetch).
- **Rule for new gate code:** every page.reload in a gate goes through `tools/lib-reload.js` (acrossReload).

## Next, in the owner's order (updated 2026-10-14: owner's quiz-gate request comes first after T-028)
0. T-028 (recorder, in review) → T-033 (quizzes for the 80 lectures with none, AI 200 first, from transcripts; general-purpose agent for the transcript MCP) → T-043 (gate + lesson flow) → T-045 (Problems due-now) → T-046 (on-device transcription) → T-047 (Claude story coach) → T-044 (deeper quizzes, ahead of the calendar). Mockups approved: loop/design/specimen-{lesson-quiz,lesson-passed,problems-v2,practice-coach}.png. Decisions in loop/inbox.md (2026-10-14).

1. ~~T-031~~ merged (#16).
2. **The page redesigns:** ~~T-026c~~ merged (#18), T-028 (building) (Practice recorder), T-027 (Treasury workspace plus the treasury merge fix).
3. **T-022:** the opening screen. Rewrite its spec first: the calm Dark, the crest fading in on near-black. The navy specification is obsolete.
4. **Smaller fixes:**
   - T-029: in landscape the phone bars are too tall.
   - T-030: Home overflows at 320px with a 24px root.
   - T-040: /atlas Gate 3 chip crosses the card at root 24, 320–329px; add a containment check.
5. **T-033:** summaries for the unsummarised AI 200/210/300/310 and RES 400 lectures, from YouTube transcripts.
6. **T-035 sample PDF:** send the owner a sample before building.
7. **T-034:** Sunday review, on top of the full Sunday. No schedule change.
8. **T-035:** the Sunday PDF, exportable on Sundays only.
9. **T-036:** the review council, five advisors plus the llm-council method, monthly and on demand. It needs `loop/owner-profile.md`, which the owner fills in.

## Owner facts to remember
- **Start date:** 2026-10-05. Day 1094 is 2030-04-02; the baseline is 2030-04-03.
- **Themes:** Dark (default), Light, Auto. The sidebar is darker than the page.
- **Gates 1–3** on the owner's device were passed by accident. T-038 fixes the cause; the owner unmarks them by hand under Proof → Transcript & gates.
- Wants pages that explain themselves, little text, Apple-like. Desktop first.

## 2026-10-16 00:30 UTC — where things stand
- T-043 (quiz gate): r1 fixes committed and pushed up to f9f7bdc on loop/T-043-lecture-quiz-gate (/home/user/bf-T-043). Builder (same agent, opus) finishing finding 1 (Dark contrast + verify-design measurement fix), then gates.
- Next: CHECK by script (scratchpad/t043-check/run.sh <outdir>), then review r2 by the SAME reviewer (narrow brief: findings 1-9 + `git diff 4173728..HEAD`), then set QUIZ_GATE_FROM to the ship date, PR, merge (owner standing instruction).
- Owner decisions on record: lock from go-live only; CLAUDE.md on main already correct.
- 2026-10-16: T-043 MERGED (PR #21, main 8c2bbd1). Next in owner order: T-045 (Problems due-now), then T-046, T-047.
- 2026-10-16: T-045 building in /home/user/bf-T-045 (branch loop/T-045-problems-due-now). If cut off: resume builder, then CHECK by script (sed the worktree path in scratchpad/t043-check/run.sh), fresh reviewer r1, merge.
