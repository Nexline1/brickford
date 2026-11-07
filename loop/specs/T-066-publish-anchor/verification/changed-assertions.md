# T-066: changed assertions

Nothing moved. No existing assertion, expected value, fixture, baseline or gate was edited, loosened, skipped or deleted.

Additions only:
- `tools/verify-logic.js`: six new checks ("Publish anchor: ..."), after the T-063 block.
- `tools/verify-app.js`: the `publish-anchor` plant, a Publish fixture (five clocks), five parity checks, two
  per-engine invariance checks and one reach check; header comment lines. `d40` added to the plan read.
- `app/tool/engine_dump.dart`: an `out['publish']` section; nothing existing changed.
- `app/test/calendar_test.dart`: two new tests and three helpers; the existing tests are untouched.
- `platform/index.html`: the `?v=` token only (20261107a to 20261107b), 34 occurrences.

The clip baseline (`tools/verify-clip.baseline.json`) is not touched.
