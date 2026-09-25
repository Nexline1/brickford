---
name: brickford-spec
description: Turn one Brickford inbox note (loop/inbox.md) or a discovered defect into a loop spec plus a queue row with status proposed. Use when running the brickford-loop DISCOVER step, or when the owner asks to spec an idea for the Brickford improvement loop.
---

# brickford-spec

1. Read `loop/config.md`, `loop/lessons.md` and `loop/queue.md`. Pick the next id: T-### (zero-padded, one more than the highest).
2. Reproduce or locate the problem in the code before writing anything (file:line). If it would need a PROTECTED path, say so in the spec and mark it "needs owner approval".
3. Create `loop/specs/<id>-<slug>/spec.md` and `loop/specs/<id>-<slug>/verification/.gitkeep`. The spec has these sections:
   - **Problem:** what happens now, with file:line.
   - **Learner outcome:** what gets easier, faster or clearer in daily study.
   - **Scope:** the smallest change that achieves it.
   - **Out of scope:** explicitly include PROTECTED paths, curriculum and plan changes, and new dependencies unless named.
   - **Acceptance criteria:** numbered, each testable by a script exit code or a screenshot, and at least one planted-bug check where a gate is added.
   - **Verification checklist:** typecheck, all gates, planted-bug runs, screenshots at 390 px and desktop.
4. Append a queue row: `| <id> | <title> | proposed | 0 | | from inbox YYYY-MM-DD |`. Never set status to ready; only the owner does.
5. Mark the inbox line with `→ <id>`.
6. Keep to at most 3 proposals per run (the count is shared with the loop).
