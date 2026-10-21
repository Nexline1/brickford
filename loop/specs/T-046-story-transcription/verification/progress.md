# T-046 progress (resume notes)

Branch loop/T-046-story-transcription, worktree /home/user/bf-T-046, base main 8c2bbd1.

## Steps
- [x] 0. spec committed unchanged (0aab854)
- [x] 1. research: library verified on npm; prompt option absent in 4.3.0; model revision UNVERIFIABLE (huggingface.co blocked for WebFetch and shell) -> notes.md
- [ ] 2. verify-content: TX_LIB pinned, worker ?v= token = index token, TX_REVISION 40-hex + recorded in notes.md (fails until the owner verifies)
- [ ] 3. verify-flows (r): record -> consent -> stub transcript stored in IndexedDB only; fillers; counts/wpm; copy; Not now; failure paths; no long task
- [ ] 4. app.js + transcribe-worker.js + style.css; bump ?v= tokens
- [ ] 5. verify-sync-loop: no transcript in any push; settings keys unchanged
- [ ] 6. verify-design: transcript card, chips, struck text >= 4.5:1, 44px controls at 1440/390 x dark/light
- [ ] 7. plants (a)-(d) via verification/plants.py, each exit 1
- [ ] 8. all gates sequential + clip under TZ=America/Los_Angeles

## Decisions
- Harness: a Worker cannot be constructed from a file:// page (SecurityError, origin 'null'), measured. The transcription contexts launch Chromium with --allow-file-access-from-files (as T-028 added fake-media flags); with it a module worker runs and ctx.route intercepts its import() of the pinned URL (measured in a probe). Production (GitHub Pages, https) needs no flag. Without it, the page shows the "cannot run" line, which is the no-Worker failure path.
- The prompt/initial-text option: not wired in 4.3.0 (see notes.md); not used; the muted line is always shown.
