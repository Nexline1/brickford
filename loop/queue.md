# Queue

status: proposed / ready / building / review / pr-open / done / blocked
Only the owner moves an item from proposed to ready (T-000 was made ready on the owner's instruction).

| id | title | status | rounds | pr | notes |
|---|---|---|---|---|---|
| T-000 | Verification harness | pr-open | 4 | https://github.com/Nexline1/brickford/pull/2 | Owner-granted 4th round; reviewer APPROVED. All 7 gates green (clip: 0 new, 0 stale, 953 known). Contains the scaffold commit while PR #1 is unmerged. |
| T-001 | Tab bar fits at larger text sizes | pr-open | 3 | https://github.com/Nexline1/brickford/pull/3 | Reviewer APPROVED round 3. Stacked on PR #2 and #1. |
| T-002 | Sidebar brand fits at larger text sizes | proposed | 0 | | From T-000 clip evidence (24px root, 768 px and up). |
| T-003 | No sideways scroll or cut-off controls on narrow phones | proposed | 0 | | From T-000 clip evidence; the drill answer row fails even at 16px. Add: the numeric-answer Submit (#numGo) clips at 320px/16px (reviewer, round 3). |
| T-004 | Longest streak skips a sealed Saturday | proposed | 0 | | Found by the T-000 reviewer: bestStreak counts a sealed Saturday (app.js:572-587). |
| T-005 | Design foundations: iOS type ramp, system font, tokens, Auto theme, verify-design gate | ready | 0 | | from inbox 2026-09-25 (premium iOS redesign; loop/design/brief.md) |
| T-006 | iOS chrome: collapsing large title, material nav and tab bar, sidebar material | proposed | 0 | | from inbox 2026-09-25; depends on T-005 |
| T-007 | Lists become iOS inset grouped sections | proposed | 0 | | from inbox 2026-09-25; depends on T-005 |

