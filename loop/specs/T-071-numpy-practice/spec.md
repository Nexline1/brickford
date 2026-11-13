# T-071 — Practice for NumPy for beginners (cs100.1.0)

Freeze-compatible content batch, same shape as T-070 (read loop/specs/T-070-python-practice/spec.md and platform/data/practice-cs100.js first).

## Source (read, partial)
`sources/QUT1VHiLmmI.examples.md`: transcript covers 0:00–37:51 of 58:08 (cut mid-sentence; statistics, stacking, masking and the advanced-indexing challenge NOT read). Items may use ONLY what the notes cover (creation, ndim/shape/dtype/itemsize, slicing and assignment, initialisers, the 5x5 ones-with-a-zero-ring exercise, element-wise arithmetic, aliasing vs copy). Say so in the file header comment.

## Do
- Add 3 items for `cs100.1.0` to `platform/data/practice-cs100.js` (extend; same item shapes). Similar to the lecture's examples, never identical. Output items must be verified in the gate by python3 reference runs: if numpy is not importable in the gate environment, write the reference in plain Python lists (the expected printed value must be derivable without numpy) — do NOT add a dependency; do not skip the check. Mix: output, worked (e.g. aliasing vs copy: what do a and b print), write (why NumPy beats lists, from what he says).
- expectedPractice / python3 reference runs in tools/verify-content.js; lower the ratchet baseline if cs100 counts; no bare `<`.
- Export (tools/export-data.js), bump `?v=`, rebuild app-web (tools/build-app.sh), update pinned Dart totals in app/test/lecture_practice_test.dart.
- Gates (TZ=America/Los_Angeles): verify-content, verify-logic, verify-sync-loop, verify-shell, verify-flows, verify-contrast, verify-clip (0 new/1 stale/588 known), flutter analyze/test (/opt/flutter/bin), verify-app, verify-boot (then git checkout loop/specs/T-064-flutter-app/shots). Plants: wrong output answer; ratchet raised: each exits 1, restores byte-identically. Run long gates DETACHED (setsid nohup ... &) writing to /tmp/<name>.txt, then poll with short checks.
- Scope: practice-cs100.js, tools/verify-content*, export, app assets/test, app-web, this folder. Nothing else.
