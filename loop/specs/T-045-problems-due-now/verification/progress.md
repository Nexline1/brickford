# T-045 progress (resume notes)

Branch loop/T-045-problems-due-now, worktree /home/user/bf-T-045, base main 8c2bbd1.

## Steps
- [x] 0. spec committed unchanged
- [x] 1. data: `after` on all 54 psets/labs + mapping.md; verify-content check (AC1)
- [x] 2. app.js: due-now model, V.workshop rewrite, dashboard line, pset tick re-render
- [x] 3. CSS + ?v= bump
- [x] 4. gates: verify-design T-045 block (replaces T-026b /workshop checks); [x] verify-flows (pd) added, (l) opens Everything first
- [x] 5. plants (a)-(c): all exit 1 (plants.log)
- [x] 6. full gate run (gates.log, all exit 0 incl. clip under TZ=America/Los_Angeles, baseline 797 unchanged) + screenshots (screens/, 16 PNGs)

## Decisions
- "Open" on a pset and "Start" on a lab expand the row in place (<details>): the pset shows its source link and its done toggle; the lab shows the existing lab detail (criteria, checkbox, proof field once ticked). No new route.
- Ticking a pset re-renders (foreground), so it leaves Due now at once; open folds are reopened. Lab ticks keep the old no-render behaviour (flows (l)).
- "Not shipped" = S.labs[id].done is false (meaning unchanged).
- Daily review row appears only when the miss pool (filtered as the drill filters it) is non-empty; otherwise "Due now" can be empty and the dashboard line stays quiet.
- Empty state names the lock root of the next unfinished lecture, if it is locked.
- Coming up: "After lecture n · title" (n = place in its course); labs add " · Phase p".

## Existing-test changes
- verify-flows (l): presses the "Everything" summary before looking for a lab checkbox (the catalogue is behind it now). Assertions unchanged.
- verify-design T-026b /workshop: T26B_HEAD sub-line is the new header; t26bProblems now runs t45Check (header, due rows = expected, tags/why-lines/actions >= 44, one filled primary in view, empty state, How this works, Coming up <= 3, Everything closed, mode cards gone). Removed: the three mode-card checks, the drill-primary check, the "x of 34 done / x of 20 shipped" Open pills, the stat-box check, "This phase's labs" head and row checks, the first-clause description check, the folds-under-the-list check, the two Open-jump checks — all measured the page the spec replaces. T26B_TEXT sweep gains .pd-list/.pd-how/.pd-empty (nothing removed).
