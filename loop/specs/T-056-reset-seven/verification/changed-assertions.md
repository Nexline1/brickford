# T-056: changed assertions (old -> new)

Every study-day fixture moved 10 study days (plan day kept); a Saturday fixture moved to the
Saturday of the same plan week. The map is `plan-day-map.txt`. Expected VALUES are unchanged
unless a row says otherwise. Nothing was removed or loosened; 11 checks were added (verify-logic
105 -> 116), and the flows (324), design (2566) and clip (797 known) counts are unchanged.

## verify-logic.js
| Assertion | Old | New |
|---|---|---|
| START | 2026-10-05 | 2026-10-16 |
| DAY_1094 = dateForStudy(1093) | 2030-04-02 | 2030-04-14 |
| BASELINE = addStudyDays(START, 1094) | 2030-04-03 | 2030-04-15 |
| WALK_TO | 2030-04-15 | 2030-04-27 |
| date scenario clock | 2026-10-20 (Tue, day 14) | 2026-11-01 (Sun, day 14) |
| "a past study day is missed" fixture | 2026-10-13 ("past Tuesday") | 2026-10-25 ("past study day"), still "missed" |
| streak: sealed days | 5-7, 12-16, 18-20 Oct | 16, 18, 19, 23, 25-30 Oct, 1 Nov (plan days 1-3, 7-14) |
| streak: unsealed Saturday stepped over | Sat 17 Oct | Sats 24 and 31 Oct; streak 8 (unchanged) |
| streak: sealed Saturday not counted | Sat 17 Oct | Sat 31 Oct; streak 8 (unchanged) |
| streakFrom | 2026-10-19 | 2026-10-30; streak 2, best 8 (unchanged) |
| rest-day backlog scenario (plan day NOT kept) | today Sun 18 Oct (day 12), sealed Sat 17 Oct | today Sun 1 Nov (day 14), sealed Sat 31 Oct; backlog 0 (unchanged) |
| backlog = owed lectures since first activity | 12 -> 20 Oct | 23 Oct -> 1 Nov (7 study days, unchanged) |
| storytelling isolation clock | 2026-10-20 | 2026-11-01 |
| T-038 DAY_A / DAY_B | 2026-10-20 / 2026-11-03 | 2026-11-01 / 2026-11-15 |
| T-038 Bahrain gate events | 6, 7 (22:30Z), 9 Oct; want 8 Oct | 18, 19 (22:30Z), 21 Oct; want 20 Oct |
| T-038 DAY_LOCAL (Bahrain 22:30Z on DAY_A) | 2026-10-21 | 2026-11-02 |
| T-038 LWW T1/T2 day, pass date | 2026-10-19 | 2026-10-30 |
| T-038 legacy date string pulling a newer unmark | 2026-10-12 | 2026-10-23 |
| T-038 remote-ledger legacy true | 2026-10-07 | 2026-10-19 |
| T-038 old date strings | 2026-11-20, 2027-03-13 | unchanged |
| T-043 fixture day P | 2026-10-06 (day 2) | 2026-10-18 (day 2); gate dates still derived from T.QUIZ_GATE_FROM |
| T-052 monk row table | 10-21 none, 10-22 1, 10-24 3, 2027-01-19 90, 01-20 none | 10-23 none, 10-24 1, 10-26 3, 2027-01-21 90, 01-22 none |
| T-054 prayer-times span90 | 2026-10-22 .. 2027-01-19 | 2026-10-24 .. 2027-01-21 |
| T-054 focus: clock, monk days, pre-day | 28 Oct; 22-27 Oct; 21 Oct | 30 Oct; 24-29 Oct; 23 Oct (6 days, 17%, unchanged) |
| hook absent on ordinary load: clock | 2026-10-20 | 2026-11-01 |
| NEW (T-056, 11 checks) | — | old plan days 1-8 watched 16-22 Oct: new days 1-8 done; days 1-7 completed; calendar dfull; 36 on catch-up; 25 Oct next action = first unwatched (hero and rail); no open link to a watched lecture; "ahead of plan" with backlog 0; "today is done · 1 owed" with one lecture owed; page errors x2 |

## verify-flows.js
| Assertion | Old | New |
|---|---|---|
| TODAY | 2026-10-20 (Tue) | 2026-11-01 (Sun), plan day 14 |
| PREV_PASSED / PREV / (rw) math120.0.11 doneAt, passedAt | 2026-10-16 | 2026-10-28 |
| WATCHED doneAt (flow b) | 2026-10-15 | QUIZ_GATE_FROM - 1 (read from app.js) |
| seal fixture: problems | 17, 19 Oct | 24, 30 Oct |
| seal fixture: proven lecture | 19 Oct | 30 Oct |
| seal fixture: payments | 18, 19, 20, 24, 25, 26 Oct | 29, 30 Oct, 1 Nov, 31 Oct, 5 Nov, 6 Nov |
| seal fixture: week 1 sealed | 2026-10-11 | 2026-10-22 |
| sealFlow edge payments | 18, 26 Oct | 29 Oct, 6 Nov |
| resume posAt T10 / sync T9-T11 | 2026-10-20 | 2026-11-01 |
| (m) Monk Mode head on 28 Oct / 29 Oct | Day 7 of 90 / Day 8 of 90 | Day 5 of 90 / Day 6 of 90 |
| Saturday recorder, Sat 24 Oct | unchanged (still a Saturday rest day in the plan) | — |

## verify-design.js
| Assertion | Old | New |
|---|---|---|
| FIXED_NOW | 2026-10-20 | 2026-11-01 (plan day 14) |
| quizAttempts dates | 2026-10-05 | 2026-10-16 |
| gates {1} (two states) | 2026-10-12 | 2026-10-23 |
| T38_DONE | {1: 10-09, 2: 10-14} | {1: 10-21, 2: 10-26} |
| T38_ALL | 10-09, 10-14, 10-15, 10-16, 10-19 | 10-21, 10-26, 10-27, 10-28, 10-30 |
| gatesSeed / T-031 passed gates | 12-16 Oct / 12-15 Oct | 23, 25, 26, 27, 28 Oct / 23, 25, 26, 27 Oct |
| ledger events | 15, 16, 19, 20 Oct | 26, 28, 30 Oct, 1 Nov |
| T26C patch (problems, proven lectures, payments, sealed weeks) | 18-26 Oct, weeks 11 and 18 Oct | per map: 29 Oct-6 Nov (rest Sat 31 Oct), weeks 22 and 29 Oct; BHD 1,149.5 unchanged |
| T26C states: counted-0 ledger, 12,345.75 week, already sealed | 18/26 Oct, 19 Oct, 20 Oct | 29 Oct/6 Nov, 30 Oct, 1 Nov |
| "a Sunday, the day the week is sealed" | Sun 25 Oct | Thu 5 Nov ("the plan week's last day"); the seal-day wording is held for the owner (review findings 2-3) |
| calendar extra days (plan day NOT kept) | Sat 24 Oct, Sun 25 Oct | Sat 7 Nov, Thu 5 Nov |
| Continue in Bahrain | clock 20 Oct 23:00Z, doneAt 21 Oct | clock 1 Nov 23:00Z, doneAt 2 Nov |
| T-026b states (diag, problems, lessons, gate 1, streakFrom) | 12, 18, 19 Oct | 23, 29, 30 Oct |
| T-028 bank days | 19, 20 Oct | 30 Oct, 1 Nov |
| T-028 Fri 23 / Sat 24 Oct states | unchanged (still a Friday and a Saturday in the plan) | — |
| T-043 states | doneAt / passedAt 16, 19, 20 Oct | 28, 30 Oct, 1 Nov |
| T-045 states | 7, 10, 19, 20 Oct | 19, 17 (Sat), 30 Oct, 1 Nov |
| T-045 gate-day state | clock 16 Oct, watched 11 Oct | clock QUIZ_GATE_FROM (from app.js), watched 22 Oct |
| T-054 day state head | Day 7 of 90 | Day 5 of 90 |
| T-054 before-the-90-days state | clock FIXED_NOW, "Starts 22 Oct" | clock 2026-10-20, "Starts 24 Oct" |

## verify-clip.js, verify-shell.js
| Assertion | Old | New |
|---|---|---|
| FIXED_NOW | 2026-10-20 | 2026-11-01 (plan day 14) |
| clip baseline | 797 | 797 (re-measured in UTC and America/Los_Angeles: 0 new, 0 stale) |
