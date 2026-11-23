# T-074 CHECK round 4 (merged tree 4a471ee, origin/main 1f63575)

- Every browser gate ran with a local, harness-only preload (`net-shim.js`, not in the repo): directory symlinks become junctions (Windows EPERM), and requests to outside hosts that a gate does not route itself are aborted (YouTube/CDN loads stalled `page.goto` on this network). Main's baselines (`main-*.txt`) ran under the same preload.
- typecheck, content, shell, contrast, logic, flows, design, boot, sync-loop: exit 0.
- clip, density: exit 1 with the same findings as main (`main-verify-clip.txt`, `main-verify-density.txt`).
- offline: exit 1 on the same 2 checks as main (T-046's transcribe-worker.js not in sw.js's precache; one GitHub request while offline). The first run also failed 3 update checks under load; two re-runs (`verify-offline.rerun-*.txt`) did not.
- Flutter (LF clone): analyze clean, test 177/177.
- verify-app (LF clone; a CRLF checkout fails export-data --check on main too): all parity checks pass. Plants: 15 caught in the first run, which a session restart then killed (exit 3221226091 = terminated); the other 22 re-run one by one, all exit 1 on parity (`verify-app.plants-rerun.txt`). 37/37.
