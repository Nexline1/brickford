# Queue

status: proposed / ready / building / review / pr-open / done / blocked
Only the owner moves an item from proposed to ready (T-000 was made ready on the owner's instruction).

| id | title | status | rounds | pr | notes |
|---|---|---|---|---|---|
| T-000 | Verification harness | building | 4 | | Owner granted a 4th round 2026-09-25 to fix the round-3 findings: numeric draw in the sweep, stale off-by-one evidence, backlogCount check name. Branch loop/T-000-verification-harness. |
| T-001 | Tab bar fits at larger text sizes | proposed | 0 | | From T-000 clip evidence. Owner uses larger text: fix first. |
| T-002 | Sidebar brand fits at larger text sizes | proposed | 0 | | From T-000 clip evidence (24px root, 768 px and up). |
| T-003 | No sideways scroll or cut-off controls on narrow phones | proposed | 0 | | From T-000 clip evidence; the drill answer row fails even at 16px. Add: the numeric-answer Submit (#numGo) clips at 320px/16px (reviewer, round 3). |
| T-004 | Longest streak skips a sealed Saturday | proposed | 0 | | Found by the T-000 reviewer: bestStreak counts a sealed Saturday (app.js:572-587). |
