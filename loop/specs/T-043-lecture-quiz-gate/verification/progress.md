# T-043 progress (resume notes)

Branch loop/T-043-lecture-quiz-gate, worktree /home/user/bf-T-043, base main c889fea.

## Steps
- [x] 0. spec committed unchanged (cbd24ec)
- [x] 1. quiz-engine mastery mode
- [x] 2. app.js: quiz record, merge, cleared/schedDone, lock, catchUpQuizzes, hook
- [x] 3. lesson page flow (watched bar, quiz, pass card, Go deeper, lock card, rail)
- [x] 4. CSS
- [ ] 5. gates: verify-logic DONE, verify-sync-loop DONE, verify-flows DONE (flow c = AC1); verify-design additions TODO
- [ ] 6. plants (a)-(e)
- [ ] 7. full gate run + screenshots

## Decisions
- Pushing: the subagent system rules forbid push; checkpoints are local commits only.

- QUIZ_GATE_FROM = "2026-10-15" (today; orchestrator may set the real ship date at SHIP; every harness clock is 2026-10-20, after it).
- Lock also never applies to a lecture that is itself watched (spec: grandfathered lectures are not locked; generalised to any watched one, so a verified lecture never hides behind a lock card).
- firstUnfinished (work-ahead re-anchoring) still reads .done: "no plan dates move".
- Existing-test changes so far: sync-loop latch test saves on math110/0/0 (0/1 is now locked); flows (a) strips "Quiz: " from the card title before matching the h1; flows (c) rewritten as the AC1 flow (the +1 now asserted after the pass, and "no move on watched alone" added); flows resume contexts get PREV_PASSED (math110.0.12 watched + quiz passed); flows (g) second lecture moved from math110.0.12 to math110.0.0.
