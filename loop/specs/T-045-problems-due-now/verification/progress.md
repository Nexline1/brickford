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

## Review round 1 (CHANGES REQUIRED) — fixes
- [x] F1 (133333a): t26bProblems presses #pbAll's summary, then T-026b's catalogue checks run again (heading + phase meta, one row per current-phase lab in order with checkbox / title / ~N h / ticked as stored / >= 44px, first-clause descriptions, the pset and other-phase folds under the list, no .onecounts). The first-clause rule (`clauseBad`) is shared with the due-row lab why-line. Dead pbOpen handler removed from app.js.
- [x] F2 (dcedbcb): sixth T-045 state, a Linear Algebra miss (q 8, after math110.0.1 watched + passed) beside 1806-ps1: review row last, #/drill, >= 44px, count and dashboard line each +1 over "one pset unlocked". Review row gets data-id="drill". Plant (d) review row never shown.
- [x] F3 (c5596a3): pset why-line says "you passed" only when the after-lecture's quiz was passed, otherwise "you watched". Fixture: math130.0.1 watched 2026-10-11, no quiz, clock 2026-10-16; both rows' wording asserted literally.
- [x] F4 (cfee64f, owner 2026-10-16): rag-system phase 3, after ai300.3.3 (the line stays where it was in LABS, with a comment). mapping.md and spec amendment updated. Phase lab counts are now 2/6/8/4; no gate pins a phase's lab list (the T-026b row check derives it from D.LABS).
- [x] plants.py is interrupt-safe (6a9be57): backup restored at start, SIGTERM/SIGHUP handled.
- [x] Full sequential gate run at 6a9be57 (gates.log): syntax, content, sync-loop, shell, contrast, logic, flows, clip, clip under TZ=America/Los_Angeles (797, 0 new, 0 stale), design (2440 checks) all exit 0. Plants (a)-(d) all exit 1 (plants.log).
- Push: not done. The subagent rules for this role forbid pushing, and an agent message cannot lift them. Commits are local.
