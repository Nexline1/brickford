# T-070 — Practice for CS50P lectures 3–5 (cs100.0.3, 0.4, 0.5)

Freeze-compatible content batch (no feature work). Python bridge starts 22 Nov; checkpoint 1 (6 Dec) needs CS50P 3–5.

## Sources (read, partial)
`sources/<videoId>.examples.md`, from transcripts fetched 13 Nov. Only the first ~60% of each lecture was read
(0:05–29:01 of 44:30; 0:05–28:17 of 1:17:23; 0:24–27:54 of 50:49). Items may use ONLY what those notes contain.
Say so in the data file's header comment. Videos: LW7g1169v7w (0.3), MztLZWibctI (0.4), tIrcxwLqzjQ (0.5).

## Do
- New `platform/data/practice-cs100.js` (loaded in index.html; protected path named here, owner approved Plan v2 content), `DAR.PRACTICE["cs100.0.3"|"0.4"|"0.5"]`, 3 items each: mix of `output` (a short program, expected printed value; verified in the gate by running a reference solution with python3), `worked`/`write` (e.g. why a bare except is bad, what test cases catch the n+n bug). Similar to the lecture's examples, never identical. Follow docs/CONTENT-STANDARD.md and the T-068 item shapes in practice-math110.js.
- Extend verify-content's expectedPractice/python reference runs to these items; lower the ratchet baseline if cs100 counts there; no bare `<`.
- Re-run tools/export-data.js, bump `?v=`, rebuild app-web/ (tools/build-app.sh), update Dart pinned totals in app/test/lecture_practice_test.dart if they change.
- Gates: verify-content, verify-logic, verify-sync-loop, verify-shell, verify-flows, verify-contrast, verify-clip (TZ=America/Los_Angeles; 0 new/1 stale/588 known), flutter analyze/test (/opt/flutter/bin), verify-app, verify-boot (then git checkout loop/specs/T-064-flutter-app/shots). Plants: a wrong output answer, a ratchet raised; each exits 1 and restores byte-identically.
- Scope: practice-cs100.js, index.html, tools/verify-content*, export, app assets, app-web, app tests, this folder. Nothing else.
