---
name: brickford-loop
description: Orchestrator for the Brickford improvement loop. Reads loop/ state, turns inbox notes into proposals, builds the top ready item in a worktree via brickford-builder, runs every check, gets an adversarial review from brickford-reviewer, opens a PR, and records the run. Use when the owner says "run the loop", "brickford loop", or asks to ship the next queued improvement.
---

# brickford-loop

Work from the repo root. Follow `CLAUDE.md`. Config, caps and PROTECTED paths are in `loop/config.md`.

## Training mode
If `training_mode: on` in config: before (a) showing DISCOVER output, (b) BUILD and (c) SHIP, tell the owner in 3 lines what you are about to do and why, then wait for "go".

## The cycle
1. **READ** `loop/config.md`, `loop/lessons.md`, the last 10 entries of `loop/state.md`, and `loop/queue.md`.
2. **DISCOVER.** Turn new `loop/inbox.md` notes into specs with the brickford-spec skill (status: proposed). Also propose fixes for anything broken you find: failing gates, console errors, slow pages. Max 3 proposals per run. Never set your own proposals to ready.
3. **PICK** the top ready item. None? Stop and report. While T-000 is not done, it is the only item that may be built.
4. **BUILD.** Run `git worktree add ../bf-<id> -b loop/<id>-<slug> origin/main`. Hand the spec and the worktree path to the brickford-builder agent. Set status building, and increment rounds on each build.
5. **CHECK** (you run these, not the builder) inside the worktree:
   - Typecheck, and every gate in config's CHECK line; all must exit 0.
   - A Playwright walk through the changed screens at 390 px and 1280 px, with screenshots saved to `loop/specs/<id>-<slug>/verification/`.
   - Save each command's output to `verification/`.
   - Any failure goes back to the builder with the exact output.
6. **REVIEW.** Send the diff, the spec and the CHECK output to the brickford-reviewer agent in a fresh context. Set status review. CHANGES REQUIRED goes back to the builder (step 4) with the findings.
7. **SHIP.** Checks green AND reviewer APPROVED:
   - Commit with the attribution lines, then `git push -u origin loop/<id>-<slug>`.
   - Open a PR to `main` via `pr_tool`: the GitHub MCP `create_pull_request` in the cloud, `gh pr create` on the PC.
   - The PR body carries a summary, each acceptance criterion with its evidence, screenshots, test output and risks.
   - Status pr-open, with the PR link in the queue.
8. **RECORD.** Append to `loop/state.md` (date, item, rounds, result, blocker). Add at most 2 lessons to `loop/lessons.md`, keeping it at 60 lines or fewer by merging duplicates. Remove the worktree with `git worktree remove`.
9. Back to 3.

**Done for one item** = every acceptance criterion has a passing test or screenshot as evidence, the full suite is green, the reviewer APPROVED, and a PR is open.

## Stop rules
- 3 build/review rounds without approval: blocked (write why in queue notes and state), move on.
- The same failure twice in a row: blocked.
- 2 blocked items in a row: end the run.
- 3 PRs opened: end the run.
- No ready items: end the run.

End every run with a 5-line report: shipped, blocked, proposed, lessons, next up.

## Never (stop and ask the owner instead)
- Merge a PR, push to main, deploy, or change hosting or env settings.
- Touch PROTECTED paths unless the spec names the path and the owner approved it. No migration that drops or rewrites data.
- Delete, skip or loosen an existing test to get green.
- Add a dependency the spec doesn't name.
- Read or print secrets from `.env` or the `brickford_gh_token`.
- Change the curriculum structure or the 3-year plan.
