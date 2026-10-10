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
- **Merged since:** #15 T-038 (honest gates), #16 T-031 (Atlas/Courses polish).
- **Building:** T-026c (Week, Calendar day view, Library), worktree `/home/user/bf-T-026c`.

## Next, in the owner's order
1. ~~T-031~~ merged (#16).
2. **The page redesigns:** T-026c (Week, Calendar day, Library; building), T-028 (Practice recorder), T-027 (Treasury workspace plus the treasury merge fix).
3. **T-022:** the opening screen. Rewrite its spec first: the calm Dark, the crest fading in on near-black. The navy specification is obsolete.
4. **Smaller fixes:**
   - T-029: in landscape the phone bars are too tall.
   - T-030: Home overflows at 320px with a 24px root.
   - T-039: the flaky T-024 "switch (c)" theme check (failed 2 of ~12 design runs).
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
