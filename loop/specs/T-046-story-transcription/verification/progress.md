# T-046 progress (resume notes)

Branch loop/T-046-story-transcription, worktree /home/user/bf-T-046, base main 8c2bbd1.

## Steps
- [x] 0. spec committed unchanged (0aab854)
- [x] 1. research: library verified on npm; prompt option absent in 4.3.0; model revision UNVERIFIABLE (huggingface.co blocked for WebFetch and shell) -> notes.md
- [x] 2. verify-content: TX_LIB pinned, worker ?v= token = index token, TX_REVISION 40-hex + recorded in notes.md (fails until the owner verifies)
- [x] 3. verify-flows (r): record -> consent -> stub transcript stored in IndexedDB only; fillers; counts/wpm; copy; Not now; failure paths; no long task
- [x] 4. app.js + transcribe-worker.js + style.css; bump ?v= tokens
- [x] 5. verify-sync-loop (written): no transcript in any push; settings keys unchanged
- [x] 6. verify-design (written): transcript card, chips, struck text >= 4.5:1, 44px controls at 1440/390 x dark/light
- [x] 7. plants (a)-(d) via verification/plants.py on 0ed2c60: ALL EXIT 1 (verification/plants.log); (a) flows 2 FAIL + sync-loop 1 FAIL, (b) flows 4 FAIL, (c) flows 5 FAIL, (d) flows 10 FAIL incl. the named long-task check (400ms at 390 and 1280) (a)-(d) via verification/plants.py, each exit 1
- [x] 8. all gates sequential + clip under TZ=America/Los_Angeles (verification/gates.log): typecheck 0, content 1 (ONLY the two TX_REVISION checks: the blocker), sync-loop 0, shell 0, contrast 0, logic 0, flows 0 (339), clip 0 and 0 under LA (797 known, 0 new, 0 stale), design 0 (2108)
- [x] 9. screenshots: verification/shots.js -> verification/screens/ (8 PNGs), read

## Decisions
- Harness: a Worker cannot be constructed from a file:// page (SecurityError, origin 'null'), measured. The transcription contexts launch Chromium with --allow-file-access-from-files (as T-028 added fake-media flags); with it a module worker runs and ctx.route intercepts its import() of the pinned URL (measured in a probe). Production (GitHub Pages, https) needs no flag. Without it, the page shows the "cannot run" line, which is the no-Worker failure path.
- The prompt/initial-text option: not wired in 4.3.0 (see notes.md); not used; the muted line is always shown.
- The worker URL test regex accepts the relative "js/transcribe-worker.js?v=" (as the page passes it).
- Progress wording: "Preparing the audio…", "Loading the speech model… n%" (it also reads from the browser cache after the first time, so not "Downloading"), "Transcribing… n%".
- Run 1 of verify-flows (cc89990's parent): all 337 old+new checks ok except the worker-URL regex (fixed in cc89990).
- verify-content: only the two TX_REVISION checks fail (the blocker), by design.
- Coordinator 2026-10-21: push own branch after every commit (no PRs).
- Plant (d) first exited 1 only through the Worker and progress checks; the long-task check itself passed under the plant. Two harness causes, both measured in probes:
  (1) Playwright's fixed clock fakes performance.now() (and performance.mark, Event.timeStamp) onto another timeline than the long-task entries, so the reference now reads document.timeline.currentTime (native, shared);
  (2) a busy loop run straight after a fetch's await was not reported as a long task, so the stub's 400ms now runs in a timer task.
  After both fixes the long-task check fails under (d) at 390 and 1280 (a 400ms task), and passes unplanted (flows 339/339 at 736dce4).
- One flake seen once (T-028's reload/chain check, "none yet") — see gates.log.
- DONE except the blocker: TX_REVISION is unverified (huggingface.co unreachable from this container); verify-content fails on exactly those two checks until the owner records the 40-hex commit.
