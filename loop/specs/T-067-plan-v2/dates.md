# dates

<!-- BEGIN GENERATED -->
Computed by tools/plan-dates.js: the OLD dates are read from the real app (scheduledFor on every study day, fresh state, through window.__brickfordTest); the NEW dates are the v2 simulation. Calendar: START 2026-10-16, Saturday rest, day 1094 = 2030-04-14. Cutover 2026-11-22 = study day 32.

### When each course's last lecture lands

| Course | Old first | Old last | New (core only) | New (core + proposed additions) |
|---|---|---|---|---|
| MATH 110 | 2026-10-16 (day 1) | 2027-02-23 (day 112) | 2027-02-18 (day 108) | 2027-02-18 (day 108) |
| MATH 120 | 2026-10-18 (day 2) | 2027-02-28 (day 116) | 2027-02-23 (day 112) | 2027-02-23 (day 112) |
| MATH 130 | 2026-10-19 (day 3) | 2027-02-08 (day 99) | 2027-04-25 (day 164) | 2027-06-01 (day 196) |
| AI 200 | 2026-10-16 (day 1) | 2026-11-26 (day 36) | 2027-03-07 (day 122) | 2027-03-07 (day 122) |
| AI 210 | 2026-11-27 (day 37) | 2026-12-18 (day 55) | 2027-03-29 (day 141) | 2027-03-29 (day 141) |
| PHYS 100 | 2027-05-17 (day 183) | 2027-11-01 (day 327) | 2027-04-16 (day 157) | 2027-05-17 (day 183) |
| MATH 210 | 2027-05-17 (day 183) | 2027-06-30 (day 221) | 2027-06-06 (day 200) | 2027-10-15 (day 313) |
| AI 300 | 2027-05-17 (day 183) | 2028-06-11 (day 518) | 2027-08-17 (day 262) | 2027-11-22 (day 345) |
| SYS 250 | 2027-07-01 (day 222) | 2027-09-22 (day 293) | 2027-06-27 (day 218) | 2027-08-25 (day 269) |
| AI 310 | 2027-09-23 (day 294) | 2027-11-15 (day 339) | 2027-08-16 (day 261) | 2027-11-21 (day 344) |
| RES 400 | 2027-11-16 (day 340) | 2028-01-17 (day 393) | 2027-09-02 (day 276) | 2027-12-05 (day 356) |
| SPCH 100 | 2026-10-18 (day 2) | 2027-07-04 (day 224) | unchanged: 2027-07-04 (day 224) | unchanged |
| CS 100 | not scheduled | not scheduled | 2027-01-17 (day 80) | 2027-01-17 (day 80) |
| MATH 140 | not scheduled | not scheduled | — | 2027-10-06 (day 305) |
| MATH 150 | not scheduled | not scheduled | — | 2027-09-21 (day 292) |
| PHYS 200 | not scheduled | not scheduled | — | 2027-11-09 (day 334) |
| PHYS 300 | not scheduled | not scheduled | — | 2027-10-01 (day 301) |

Old: the last lecture of any kind lands 2028-06-11 (day 518); excluding Storytelling 2028-06-11 (day 518). Never scheduled by the old plan: none.
New, core only: last lecture 2027-09-02 (day 276); the math foundation (MATH 110/120/130) ends 2027-04-25 (day 164), so Phase-2 work opens then instead of fixed day 183; the Karpathy pass ends 2027-03-07 (day 122); the 16th paper's reimplementation ends 2028-04-26 (day 479).
New, core + proposed additions: last lecture 2027-12-05 (day 356); the 16th paper ends 2028-04-26 (day 479).
Unscheduled leftovers: core none; with additions none.

### Gates

| Gate | Requirement | A: unchanged | B: shortened (core only) | B: shortened (with additions) |
|---|---|---|---|---|
| 1 Calibration | Diagnostics done · blog live · first paid client | 2026-12-27 (day 62) — 2 mo | 2026-12-27 (day 62) — 2.0 mo | 2026-12-27 (day 62) — 2.0 mo |
| 2 Core skills | GPT from scratch · 150 DSA problems · 20+ posts · 5+ repos | 2027-05-18 (day 184) — 4 mo | 2027-05-02 (day 170) — 3.6 mo | 2027-05-02 (day 170) — 3.6 mo |
| 3 Research legs | 6+ paper reimplementations · first merged open-source PR | 2027-12-16 (day 366) — 6 mo | 2027-08-25 (day 269) — 3.3 mo | 2027-08-25 (day 269) — 3.3 mo |
| 4 The fork | Fork chosen (researcher / engineer / founder) · portfolio getting replies | 2028-07-16 (day 548) — 6 mo | 2028-04-27 (day 480) — 6.9 mo | 2028-04-27 (day 480) — 6.9 mo |
| 5 Arrival | Employed in a real AI role (Gulf / remote / Germany) or founder with revenue | 2030-04-15 (day 1095) — 18 mo | 2030-01-25 (day 1027) — 18.0 mo | 2030-01-25 (day 1027) — 18.0 mo |

B rules (study days): gate 1 unchanged; gate 2 = Karpathy pass done + 48 (the original-GPT project block); gate 3 = the 6th paper reimplementation done; gate 4 = the later of (last SYS 250 / AI 310 / RES 400 / MATH 210 lecture + 24) and the 16th paper reimplementation done (v1 put all 16 papers before the fork); gate 5 = gate 4 + 547 (18 months: being hired or earning revenue does not go faster because study did). Each gate is never earlier than the one before.

Paper reimplementations (core run, 21 study days each in the practice block): 1. ai300.1.0 ends 2027-04-25; 2. ai300.1.1 ends 2027-05-19; 3. ai300.1.2 ends 2027-06-13; 4. ai300.0.0 ends 2027-07-07; 5. ai300.0.1 ends 2027-08-01; 6. ai300.0.2 ends 2027-08-25; 7. ai300.0.3 ends 2027-09-19; 8. ai300.3.0 ends 2027-10-13; 9. ai300.3.1 ends 2027-11-07; 10. ai300.3.2 ends 2027-12-01; 11. ai300.1.3 ends 2027-12-26; 12. ai300.2.0 ends 2028-01-19; 13. ai300.2.1 ends 2028-02-13; 14. ai300.2.2 ends 2028-03-08; 15. ai300.2.3 ends 2028-04-02; 16. ai300.3.3 ends 2028-04-26.
<!-- END GENERATED -->
