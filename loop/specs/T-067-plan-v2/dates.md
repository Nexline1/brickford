# Old vs new dates — computed (option A, everything included)

**How.** `node tools/plan-dates.js` opens the real app in Chromium with a fixed clock and a fresh state. It reads `window.__brickfordTest`, the hook `tools/verify-logic.js` uses, and calls the app's own `scheduledFor` on every study day 0–1093 for the OLD dates, and its own `dateForStudy` for every calendar date.

The NEW dates come from the v2 simulation in `sequence.md`:
- budgets: Math & Physics 90, AI 60, Storytelling 40 effort-minutes;
- the shorter bridge and the seven additions;
- the real video lengths, checked on 12 Nov;
- papers reimplemented in the practice block, 21 study days each, one after another, from the end of GPT-2.

Nothing was estimated by hand. Day 1094 is 2030-04-14 and the gate baseline is 2030-04-15, as the code says.

**Decision (owner, 12 Nov): option A.** Lectures come sooner, and the gates and day 1094 do not move.

## Summary

| | Old (v1, as the app schedules today) | **New: the plan (everything included)** | New, core only (for reference) |
|---|---|---|---|
| Python bridge done | — (there is none) | 4 Jan 2027 | 4 Jan 2027 |
| Zero to Hero done | 26 Nov 2026 (day 36, with no Python first) | **28 Feb 2027** (second pass, typed along) | 24 Feb 2027 |
| Math foundation (18.06, 18.01, Stat 110) done | 28 Feb 2027 | 3 Jun 2027 | 21 Apr 2027 |
| PHYS 100 done | 1 Nov 2027 | 26 Mar 2027 | 13 Apr 2027 |
| Last lecture (excluding Storytelling) | 17 Jan 2028 (RES 400) | **31 Jan 2028** (RES 400) | 27 Aug 2027 |
| 6th paper reimplementation done (gate 3 needs 6) | — | 27 Sep 2027 | 15 Aug 2027 |
| 16th paper reimplementation done | 11 Jun 2028 | **29 May 2028** | 16 Apr 2028 |
| Storytelling done | 4 Jul 2027 | unchanged | unchanged |

What the numbers say:

1. **The seven additions cost about five months of lecture calendar.** That is about 159 hours of video, and it buys 18.02, 18.03, 8.02, statistical mechanics, 18.650, 6.006 and Missing Semester. With them, the last lecture lands on 31 Jan 2028, two weeks after v1's last lecture, which had none of them. Without them it would be 27 Aug 2027.
2. **No gate moves, and everything fits.** Every lecture ends before gate 4 (16 Jul 2028), and so does the 16th paper (29 May 2028). By gate 3 (16 Dec 2027), 9 of 16 papers are reimplemented; gate 3 needs 6. Only 8.02 is still running at gate 3. It is first in the drop order, so if the owner is behind at gate 3, 8.02 is deferred.
3. **The math foundation ends later than in v1, on purpose.** Stat 110 now waits for the calculus its continuous half uses, and its joint-density and transformation lectures wait for 18.02's double integrals and change of variables. 18.06 and 18.01 end slightly earlier than in v1.
4. **The papers are still the long pole.** Lectures do not decide the late gates.

<!-- BEGIN GENERATED -->
Computed by tools/plan-dates.js: the OLD dates are read from the real app (scheduledFor on every study day, fresh state, through window.__brickfordTest); the NEW dates are the v2 simulation. Calendar: START 2026-10-16, Saturday rest, day 1094 = 2030-04-14. Cutover 2026-11-22 = study day 32.

### When each course's last lecture lands

| Course | Old first | Old last | New (core only, for reference) | New (everything included — the plan) |
|---|---|---|---|---|
| MATH 110 | 2026-10-16 (day 1) | 2027-02-23 (day 112) | 2027-02-15 (day 105) | 2027-02-15 (day 105) |
| MATH 120 | 2026-10-18 (day 2) | 2027-02-28 (day 116) | 2027-02-19 (day 109) | 2027-02-19 (day 109) |
| MATH 130 | 2026-10-19 (day 3) | 2027-02-08 (day 99) | 2027-04-21 (day 161) | 2027-06-03 (day 198) |
| AI 200 | 2026-10-16 (day 1) | 2026-11-26 (day 36) | 2027-02-24 (day 113) | 2027-02-28 (day 116) |
| AI 210 | 2026-11-27 (day 37) | 2026-12-18 (day 55) | 2027-03-28 (day 140) | 2027-04-20 (day 160) |
| PHYS 100 | 2027-05-17 (day 183) | 2027-11-01 (day 327) | 2027-04-13 (day 154) | 2027-03-26 (day 139) |
| MATH 210 | 2027-05-17 (day 183) | 2027-06-30 (day 221) | 2027-06-02 (day 197) | 2027-07-13 (day 232) |
| AI 300 | 2027-05-17 (day 183) | 2028-06-11 (day 518) | 2027-08-11 (day 257) | 2028-01-14 (day 391) |
| SYS 250 | 2027-07-01 (day 222) | 2027-09-22 (day 293) | 2027-06-23 (day 215) | 2027-10-05 (day 304) |
| AI 310 | 2027-09-23 (day 294) | 2027-11-15 (day 339) | 2027-08-10 (day 256) | 2028-01-13 (day 390) |
| RES 400 | 2027-11-16 (day 340) | 2028-01-17 (day 393) | 2027-08-27 (day 271) | 2028-01-31 (day 405) |
| SPCH 100 | 2026-10-18 (day 2) | 2027-07-04 (day 224) | unchanged: 2027-07-04 (day 224) | unchanged |
| CS 100 | not scheduled | not scheduled | 2027-01-04 (day 69) | 2027-01-04 (day 69) |
| CS 110 | not scheduled | not scheduled | — | 2027-07-16 (day 235) |
| CS 150 | not scheduled | not scheduled | — | 2027-06-03 (day 198) |
| MATH 140 | not scheduled | not scheduled | — | 2027-06-14 (day 207) |
| MATH 160 | not scheduled | not scheduled | — | 2027-09-01 (day 275) |
| MATH 150 | not scheduled | not scheduled | — | 2027-12-16 (day 366) |
| PHYS 300 | not scheduled | not scheduled | — | 2027-10-01 (day 301) |
| PHYS 200 | not scheduled | not scheduled | — | 2027-12-21 (day 370) |

Old: the last lecture of any kind lands 2028-06-11 (day 518); excluding Storytelling 2028-06-11 (day 518). Never scheduled by the old plan: none.
New, core only: last lecture 2027-08-27 (day 271); the math foundation (MATH 110/120/130) ends 2027-04-21 (day 161), so Phase-2 work opens then instead of fixed day 183; the Karpathy pass ends 2027-02-24 (day 113); the 16th paper's reimplementation ends 2028-03-24 (day 451).
New, everything included (core + the seven additions; option A): Zero to Hero done 2027-02-28 (day 116); last lecture 2028-01-31 (day 405); the 16th paper ends 2028-05-29 (day 507).
Unscheduled leftovers: core none; with additions none.

### Gates under option A (chosen 12 Nov: unchanged)

| Gate | Requirement | Target (unchanged) | Papers reimplemented by then | Added courses still running then |
|---|---|---|---:|---|
| 1 Calibration | Diagnostics done · blog live · first paid client | 2026-12-27 (day 62) | 0 of 16 | CS 110, CS 150, MATH 140, MATH 160, MATH 150, PHYS 300, PHYS 200 |
| 2 Core skills | GPT from scratch · 150 DSA problems · 20+ posts · 5+ repos | 2027-05-18 (day 184) | 3 of 16 | CS 110, CS 150, MATH 140, MATH 160, MATH 150, PHYS 300, PHYS 200 |
| 3 Research legs | 6+ paper reimplementations · first merged open-source PR | 2027-12-16 (day 366) | 9 of 16 | PHYS 200 |
| 4 The fork | Fork chosen (researcher / engineer / founder) · portfolio getting replies | 2028-07-16 (day 548) | 16 of 16 | none |
| 5 Arrival | Employed in a real AI role (Gulf / remote / Germany) or founder with revenue | 2030-04-15 (day 1095) | 16 of 16 | none |

No gate moves: the targets are what the app's gatePlan() gives today (cumulative months × 30.4 study days, walked with dateForStudy), and day 1094 stays 2030-04-14. With everything included the last lecture is 2028-01-31 (day 405) and the 16th paper 2028-05-29 (day 507), both before gate 4 (2028-07-16 (day 548)).

Paper reimplementations (everything included, 21 study days each in the practice block): 1. ai300.1.0 ends 2027-03-26; 2. ai300.1.1 ends 2027-04-20; 3. ai300.1.2 ends 2027-05-14; 4. ai300.0.0 ends 2027-08-09; 5. ai300.0.1 ends 2027-09-02; 6. ai300.0.2 ends 2027-09-27; 7. ai300.0.3 ends 2027-10-21; 8. ai300.3.0 ends 2027-11-15; 9. ai300.3.1 ends 2027-12-09; 10. ai300.3.2 ends 2028-01-03; 11. ai300.1.3 ends 2028-01-27; 12. ai300.2.0 ends 2028-02-21; 13. ai300.2.1 ends 2028-03-16; 14. ai300.2.2 ends 2028-04-10; 15. ai300.2.3 ends 2028-05-04; 16. ai300.3.3 ends 2028-05-29.
<!-- END GENERATED -->

## Option A, decided

The gate targets stay where the app puts them today: 27 Dec 2026, 18 May 2027, 16 Dec 2027, 16 Jul 2028, 15 Apr 2030. Day 1094 stays 14 Apr 2030.

The time option A frees is spent on the seven additions, and on the reimplementations and the first original result, which are what gates 3 and 4 measure. If the owner passes gates early, the app already pulls the later targets forward on its own.

Option B was costed in the first draft: shortening the gates bought 80 days at the very end. It was not chosen.
