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
| ledger events | 15, 16, 19, 20 Oct | 27, 28, 30 Oct, 1 Nov |
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

## Round 2: the owner's "Keep Sunday" (review findings 2 and 3)

Sunday stays the seal-and-revision day. The Week page, its Seal, the calendar's Sunday seal tile,
the .ics review and the Library's revision tiles now use the **revision week** (Sun–Fri before
the Sunday that seals it; week 1 = 16–23 Oct, revised Sun 25 Oct), not the plan week. Nothing was
removed or loosened; the rows below are fixtures and expected values that moved because the week
being sealed on the pinned clock (Sun 1 Nov) is now revision week 2, not plan week 3.

### verify-design.js
| Assertion | Old (r1) | New (r2) |
|---|---|---|
| t26cWeekOf (the week /review shows) | plan week of the date (Fri–Thu): on 1 Nov week 3, 30 Oct–5 Nov | revision week, walked Sunday by Sunday: on 1 Nov week 2, 25–31 Oct (Sat in), sealed Sun 1 Nov |
| /review state "Ready to seal" / "Opens …" | today >= the plan week's last day (Thu) / "Opens Thursday 5 Nov · 4 days" | today >= the revision Sunday / "Opens Sunday 8 Nov · 3 days" |
| T26C_PATCH proven lectures (verifiedAt) | 0.1 29 Oct, 0.2 1 Nov, 0.3 31 Oct, 0.4 5 Nov, 0.5 6 Nov (in: 3) | 0.1 24 Oct, 0.2 1 Nov, 0.3 31 Oct, 0.4 30 Oct, 0.5 25 Oct (in: 3, edges Sat 24 Oct and Sun 1 Nov out) |
| T26C_PATCH payments | 29 Oct 999, 30 Oct 1000, 1 Nov 120, 31 Oct 27, 5 Nov 2.5, 6 Nov 500 | 24 Oct 999, 25 Oct 1000, 28 Oct 120, 31 Oct 27, 30 Oct 2.5, 1 Nov 500; counted 1,149.5 (unchanged) |
| T26C_PATCH sealed weeks | week 1 (22 Oct, shipped), week 2 (29 Oct, failed, notes) | week 1 (25 Oct, shipped); week 2 is the week being sealed, so the failed week (1 Nov) is `T26C_WEEK2`, used by the two states below |
| state "a ledger with no payment in this week" | only Thu 29 Oct and Fri 6 Nov | only Sat 24 Oct and Sun 1 Nov |
| state "this week already sealed" | + week 3 sealed 1 Nov ("a repo", 150.5) | + week 2 sealed 1 Nov ("a repo", dsa 2, 2 posts, 150.5, notes "") — the same entry, renumbered to the week being sealed. (r2 first dropped it for `T26C_WEEK2`, which lost the "No notes." fallback, the plural "2 posts" and a decimal BHD; review r2 finding 1 restored it.) `T26C_WEEK2` (failed, with its note) is used only by the Sun 8 Nov state |
| state renamed in r1 to "the plan week's last day (Thu 5 Nov…), the day the week is sealed" | Thu 5 Nov, T26C_PATCH | **restored** to "a Sunday, the day the week is sealed": Sun 8 Nov (week 3, Ready to seal), weeks 1 and 2 sealed |
| NEW state | — | "mid-week (Thu 5 Nov), the seal not open until Sunday": week 3, "Opens Sunday 8 Nov · 3 days" (the Opens branch the base clock no longer shows) |
| calendar habit tiles (~4307): Seal as a fifth tile | on every Sunday | on every Sunday from the first revision Sunday (25 Oct) |
| NEW check (~4307) | — | on a seal Sunday the tile reads "30 min · Week r · range" of the revision week it seals (1 Nov: "Week 2 · 25–30 Oct") |

### verify-flows.js (o)
| Assertion | Old (r1) | New (r2) |
|---|---|---|
| T26C_WEEK (the week Seal stores on 1 Nov) | plan week 3, 30 Oct–5 Nov | revision week 2, 25–31 Oct (sealed Sun 1 Nov) |
| T26C_SEAL_STATE payments | 29 Oct 999, 30 Oct 120, 1 Nov 30.5, 31 Oct 7, 5 Nov 2.25, 6 Nov 500 | 24 Oct 999, 25 Oct 120, 28 Oct 30.5, 31 Oct 7, 30 Oct 2.25, 1 Nov 500; counted 159.75 (unchanged) |
| T26C_SEAL_STATE week sealed before | week 1, 22 Oct | week 1, 25 Oct |
| "no payment in this week" ledger | 29 Oct, 6 Nov | 24 Oct, 1 Nov |
| Seal stores Week N, chain ref weekN | 3 | 2 |

### verify-content.js (T-055 PDF block)
| Assertion | Old (r1) | New (r2) |
|---|---|---|
| "T-055 REVISION_WEEKS is declared in app.js" (regex over app.js) | the hard-coded table | "T-055 the Library's revision tiles are read from the app (revisionTiles)", through the test hook in the bare VM; the table is gone |
| each linked PDF exists and is a PDF; every PDF is linked | 6 | 6 (unchanged) |
| NEW (7 checks) | — | one tile per week 1–6; each tile's from/to/sun/range equal to the owner's ranges written out, its lecture count equal to the distinct lectures counted here from scheduledFor (34, 19, 15, 14, 14, 12), its href week-0N.pdf |

### verify-logic.js
| Assertion | Old | New |
|---|---|---|
| NEW (T-056 r2, 35 checks) | — | revision weeks 1–6 = the owner's ranges; revisionWeekOf for 731 dates = the first revision Sunday on or after; 104 weeks partition the study days (7 then 6, Friday end, Sunday seal); .ics review DTSTART 20261025T180000 BYDAY=SU; the seal tile only on 25 Oct, 1 Nov, 8 Nov and naming its week (none on Sun 18 Oct, Fri, Sat, Mon, Thu); the Week page's heading and state on 9 dates; Seal on 1 Nov stores week 2 / ref week2; the six Library tiles; page errors |

## Round 3 (review r2)

### verify-logic.js
| Assertion | Old (r2) | New (r3) |
|---|---|---|
| "today cleared with a lecture owed …": the card's lecture is not watched | `!watchedK.has(keyOf(od.href))` — watchedK is the OLD plan's days 1-8, which includes the owed lecture deleted from this scenario, so it forbade exactly the lecture the owner's rule asks for | `!less[keyOf(od.href)]` — not watched in THIS scenario's state (same intent, the scenario's own watched set) |
| NEW | — | with math130.0.0 owed, the work-ahead card opens it: `keyOf(od.href) === owedK` (review r2 finding 2; plant next-skips-owed) |
| NEW (3 checks) | — | Sun 25 Oct with a pre-reset `{week:1, date:"2026-10-11"}`: the Week page reads "Ready to seal"; sealing keeps that entry byte-identical and appends week 1 dated 25 Oct ("Sealed 25 Oct"); page errors (review r2 finding 3; plants old-week-collides, old-week-overwritten). The read side only: `mergeState` still matches sealed weeks by week number alone |
| QUIZ_GATE_FROM (app.js), and every fixture derived from it (verify-logic T-043 gate-1/gate+1/gate+5, flows BEFORE_GATE, design T-045 gate-day clock) | 2026-10-23 | 2026-10-24 (review r2 finding 4); derived fixtures follow automatically |
| NEW (3 checks) | — | lectures watched on Fri 23 Oct count as done (grandfathered), the day completed, and GATE === 2026-10-24; a lecture watched ON the gate day needs its quiz (partial); page errors (plants gate-on-merge-day, gate-not-strict) |
| plant grandfather-old-date pattern | `QUIZ_GATE_FROM = "2026-10-23"` → 16 Oct | `QUIZ_GATE_FROM = "2026-10-24"` → 16 Oct |
