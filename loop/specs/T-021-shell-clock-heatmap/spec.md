# T-021: verify-shell pins its clock and exempts the real heatmap

## Problem
`tools/verify-shell.js` went red on `main` with no code change.
- **Symptom:** at 390px on `/record` it reports `button.hc.l0 10x10` and three more heatmap cells under 44×44.
- **Cause 1, a wrong class:** the exemption for dense date matrices (old `:241`) names `.hc-wrap, .cal-grid`, but no element has `.hc-wrap`. The heatmap's container is `.heat` (`platform/js/app.js` ~2668, `platform/css/style.css` ~1583). The comment above the line, and CLAUDE.md, both say the heatmap is exempt by design.
- **Cause 2, the real clock:** the gate read the real date. The heatmap only has cells from 2026-10-05 (14 study days after START_DATE), so the wrong selector stayed hidden until that day.

## Learner outcome
None directly. The gate that guards 44×44 tap targets gives the same verdict on any day, and stops flagging the heatmap, which is a dense date grid by design.

## Scope
- `tools/verify-shell.js` only. Every browser context is created through `freshContext()`, which adds `timezoneId: "UTC"` and `clock.setFixedTime(2026-10-06T12:00Z)`. That is the study day verify-flows and verify-clip already use.
- The exemption selector becomes `.heat, .cal-grid`.
- No assertion is removed or loosened.

## Out of scope
App code, other gates, PROTECTED paths, dependencies.

## Acceptance criteria
1. `verify-shell` exits 0 at any machine date and timezone (run normally and under `TZ=America/Los_Angeles`). `/record` at 390 is measured with its heatmap present: 21 cells at the pinned date.
2. **Plant (a):** the exemption reverted to `.hc-wrap` → exit 1, with the heatmap cells reported.
3. **Plant (b):** a real, non-heatmap control shrunk to 30px → exit 1. This shows the exemption covers only the date matrices.
4. All other gates pass unchanged.
