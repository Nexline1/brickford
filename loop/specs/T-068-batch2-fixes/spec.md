# T-068: practice batch 2, and three small fixes

Owner approval: practice items are `platform/data/practice-*.js`, named in
`loop/specs/T-067-plan-v2/plan.md` step 3 ("After that, a batch each week ahead of the
calendar"). No other PROTECTED path is touched.

## Part A: practice batch 2

The list comes from the scheduler through the test hook (`__brickfordTest.scheduledFor`,
app.js loaded in a bare VM exactly as `verify-content.js` does), core maths and physics,
not optional, 6 to 20 Dec 2026. That is also the coverage gate's 14-day window on a clock
pinned to 6 Dec, so the window adds nothing beyond it:

| date | lecture | min | items |
|---|---|---|---|
| 6 Dec | math120.1.12 Mean Value Theorem | 50 | has 3 already |
| 7 Dec | math110.1.14 Projections onto Subspaces | 49 | 3 |
| 8 Dec | math120.1.13 Antiderivatives | 49 | 3 |
| 9 Dec | math110.1.15 Projection Matrices and Least Squares | 48 | 3 |
| 10 Dec | math120.1.14 Differential Equations | 45 | 3 |
| 11 Dec | math110.1.16 Orthogonal Matrices and Gram-Schmidt | 49 | 3 |
| 13 Dec | math120.1.15 Definite Integrals | 47 | 3 |
| 14 Dec | math130.0.11 Discrete vs. Continuous, the Uniform | 50 | 3 |
| 15 Dec | math110.1.17 Properties of Determinants | 49 | 3 |
| 16 Dec | math120.1.16 First Fundamental Theorem | 48 | 3 |
| 17 Dec | math110.1.18 Determinant Formulas and Cofactors | 53 | 3 |
| 18 Dec | math120.1.17 Second Fundamental Theorem | 50 | 3 |
| 20 Dec | phys100.0.0 Introduction | 3 | 1 |
| 20 Dec | phys100.0.1 Units, Dimensions, and Scaling Arguments | 38 | 3 |

13 lectures, 37 items, `numeric` and `worked` only, each written from the lecture's
`DAR.SUMMARIES` entry: same method as its worked example or checks, different numbers or
setup, never the same problem.

Acceptance:
- A1. Every lecture above has at least `practiceTarget` items, in the course's file;
  PHYS 100's are in a new `platform/data/practice-phys100.js`, loaded in
  `platform/index.html`, `tools/verify-content.js` and the export (`tools/export-data.js`).
- A2. Every `num` has an `expectedPractice` entry computed by a different route
  (minimisation for a projection, covariance over variance for a fitted slope, a cross
  product for Gram-Schmidt in 3D, the permutation formula for an eliminated determinant,
  a coefficient read off by linearity for a cofactor, Runge-Kutta for a separable ODE,
  Simpson for an antiderivative or an FTC answer, a units chain for a conversion).
- A3. No bare `<` before a letter (the gate's existing rule).
- A4. `verify-content.practice-baseline.json`: `uncovered` lowered by 13, and its `clock`
  moved from 2026-11-22 to 2026-12-06 so the 14-day check covers this batch's window.
- A5. `node tools/export-data.js` re-run; `verify-app` sees practice.json fresh.
- A6. Plant: one new `num` wrong makes verify-content exit 1; the ratchet raised makes it
  exit 1. Both restored byte-identically.

## Part B

B1. **Flutter Home overflow at 320x568, and with a 47pt top inset.** Smallest change in
`app/lib/screens/home/home_screen.dart`: the header's brand line / badge gets flexible text
with an ellipsis. A widget test at 320x568 with a 47 top inset asserts no overflow
exception. Plant: the old header back makes the test fail.

B2. **Web optional backlog.** Done in #50. Confirm the existing check exists and passes.

B3. **verify-flows (p) "after a reload /record says the chain is whole" fails with
"none yet".** Investigated before writing this spec (scripts and tallies in
`verification/p-diagnosis/`):
- The app is not racing. Read back from localStorage just before the reload, the state
  holds the ledger (2 entries) in 40 of 40 runs. `save()` is synchronous, and the app never
  removes `darhikmah_v1`.
- At the reloaded document's start, localStorage is EMPTY (every key, the harness's stamp
  included) in 4 to 8 of 40 runs, with sessionStorage intact. The app then boots with no
  ledger: "none yet".
- It is not this flow, and it is not timing. A bare write-then-reload of a `file://` page
  in a fresh context loses storage 8 of 40 times. With a 2 s wait first it is 12 of 40, and
  a second page opened instead of a reload loses it 7 of 40. No settle condition can fix
  it: the store is gone before any page script runs.
- lib-reload's retry cannot fire: it needs the old page's unload report, and Playwright
  delivers nothing from an unloading document. Binding, console and `window.name` each
  gave 0 reports, and the (p) flow gave 0 of 40. So every loss is "measured as it is" and
  fails.
- Over `http://127.0.0.1` the same bare reload loses 0 of 80, and the whole (p) flow loses
  0 of 40.

So it is the harness, or more exactly the origin it measures on. Fix: this one block
serves `platform/` over an in-process `http://127.0.0.1` server (node `http`, no
dependency) and reloads there. It keeps the proof it already has: the reload still goes
through `acrossReload`, and a new check asserts that the stamp written last before the
reload, and the state, arrived at document start. A lost store then reads as a lost
store, not as "none yet". The chain assertion is unchanged. Plant: a ledger the app does
not persist across the reload (the reloaded page's state stripped of its ledger) still
fails it.
verify-flows is run 3 times after the fix.

## Gates (one at a time, outputs in `verification/`)
verify-content, verify-logic, verify-sync-loop, verify-shell, verify-flows x3,
verify-contrast, `TZ=America/Los_Angeles node tools/verify-clip.js`; flutter analyze,
flutter test, verify-app, build-app.sh, verify-boot (then restore T-064 shots).
`?v=` tokens bumped in `platform/index.html`; sw.js untouched.
