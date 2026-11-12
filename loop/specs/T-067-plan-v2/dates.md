# Old vs new dates — computed

**How.** `node tools/plan-dates.js` opens the real app in Chromium with a fixed clock and a fresh state, reads `window.__brickfordTest` (the hook `tools/verify-logic.js` uses), and calls the app's own `scheduledFor` on every study day 0–1093 for the OLD dates and its own `dateForStudy` for every calendar date. The NEW dates are the v2 simulation described in `sequence.md` (Math & Physics 90, AI 60, Storytelling 40 effort-minutes; papers reimplemented in the practice block, 21 study days each, one after another, starting after GPT-2). Nothing was estimated by hand. Day 1094 is 2030-04-14 and the gate baseline 2030-04-15, as the code says (the one-day gap CLAUDE.md describes).

## Summary

| | Old (v1, as the app schedules today) | New, core only | New, core + proposed courses |
|---|---|---|---|
| Python bridge done | — (there is none) | 17 Jan 2027 | 17 Jan 2027 |
| Karpathy Zero to Hero done | 26 Nov 2026 (day 36, no Python first) | 7 Mar 2027 (second pass, typed along) | 7 Mar 2027 |
| Math foundation (18.06, 18.01, Stat 110) done | 28 Feb 2027 | 23 Apr 2027 | 31 May 2027 |
| PHYS 100 done | 1 Nov 2027 | 15 Apr 2027 | 16 May 2027 |
| Last lecture (excluding papers and Storytelling) | 17 Jan 2028 (RES 400) | **2 Sep 2027** | **5 Dec 2027** |
| 16th paper reimplementation done | 11 Jun 2028 | 26 Apr 2028 | 26 Apr 2028 |
| Storytelling done | 4 Jul 2027 | unchanged | unchanged |

Three things the numbers say plainly:

1. **The math foundation ends later than in v1, on purpose.** v1 ran 18.06, 18.01 and Stat 110 side by side with no regard for prerequisites, so Stat 110's continuous lectures came before the integrals they use. v2 waits for them; Stat 110 finishes about ten weeks later (23 Apr instead of 8 Feb 2027), 18.06 and 18.01 six days earlier.
2. **Everything after the foundation comes much sooner.** Phase 2 opens when the foundation ends instead of on fixed day 183, and the Math & Physics block's 90 minutes pass to the AI line once math is done. The last lecture moves from Jan 2028 to Sep 2027 (core) — 4½ months sooner — or to Dec 2027 with all four proposed courses (about 104 hours more) still six weeks sooner than v1.
3. **The papers are now the bottleneck, and lectures cannot shorten them.** Sixteen reimplementations at three weeks each are 336 study days of practice. They start after GPT-2 (Mar 2027) and end 26 Apr 2028, only six weeks before v1's 11 Jun 2028.

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

## Option A or option B

**Option A — lectures sooner, gates and day 1094 unchanged.** The gate targets stay where the app puts them today (27 Dec 2026, 18 May 2027, 16 Dec 2027, 16 Jul 2028, 15 Apr 2030). Lectures finish by Sep 2027 (or Dec 2027 with the added courses), which leaves gate 3 and gate 4 with months of room for what they actually measure: reimplementations, a merged open-source PR, a portfolio, and an original project.

**Option B — gates shortened.** Each gate is pulled to when its content is done (rules under the table). Computed result: gate 2 on 2 May 2027 (16 days sooner), gate 3 on 25 Aug 2027 (3.7 months sooner), gate 4 on 27 Apr 2028 (2.6 months sooner), gate 5 on **25 Jan 2030 instead of 15 Apr 2030 — 80 days sooner**. With the proposed courses the dates are the same, because the papers, not the lectures, decide gates 3 and 4.

What B costs, plainly:
- **It buys 80 days at the very end, and nothing more.** Gate 5 — employed in a real AI role or a founder with revenue — is 18 months, and study speed cannot shorten being hired or earning revenue.
- **Gate 3 drops from 6 months to 3.3.** Six paper reimplementations and a first merged open-source PR by 25 Aug 2027 means the first papers start while the math foundation is still running. The PR depends on other people's review times, which the plan does not control.
- **Gate 2 keeps its content but loses slack.** 150 DSA problems, 20+ posts and 5+ repos by 2 May 2027, with the GPT project block reduced to the 48 study days after GPT-2.
- **A missed target costs more.** The gates are adaptive (passing late pushes every later target), so a tighter gate that slips moves everything after it, and a dashboard that is always behind is the pattern this repository's reset history warns about.

**Recommendation: A.** Take the speed as room, not as an earlier finish line: it is what makes the four proposed courses (18.02, 18.03, 8.02, statistical mechanics) fit with no gate moving, and it gives the reimplementations and the first original result — the things a self-taught scientist is judged on — the time they need. If the owner later passes gates early, the app already pulls the later targets forward on its own; that is option B earned instead of promised.
