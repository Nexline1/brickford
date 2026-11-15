# Queue

status: proposed / ready / building / review / pr-open / done / blocked
Only the owner moves an item from proposed to ready (T-000 was made ready on the owner's instruction).

| id | title | status | rounds | pr | notes |
|---|---|---|---|---|---|
| T-000 | Verification harness | done | 4 | https://github.com/Nexline1/brickford/pull/2 | Owner-granted 4th round; reviewer APPROVED. All 7 gates green (clip: 0 new, 0 stale, 953 known). Contains the scaffold commit while PR #1 is unmerged. Merged to main (owner confirmed 2026-11-15; from git log). |
| T-001 | Tab bar fits at larger text sizes | done | 3 | https://github.com/Nexline1/brickford/pull/3 | Reviewer APPROVED round 3. Stacked on PR #2 and #1. Merged to main (owner confirmed 2026-11-15; from git log). |
| T-002 | Sidebar brand fits at larger text sizes | proposed | 0 | | From T-000 clip evidence (24px root, 768 px and up). Possibly superseded by later work (T-026c touched T-003); re-check before building. |
| T-003 | No sideways scroll or cut-off controls on narrow phones | proposed | 0 | | From T-000 clip evidence; the drill answer row fails even at 16px. Add: the numeric-answer Submit (#numGo) clips at 320px/16px (reviewer, round 3). Possibly superseded by later work (T-026c touched T-003); re-check before building. |
| T-004 | Longest streak skips a sealed Saturday | proposed | 0 | | Found by the T-000 reviewer: bestStreak counts a sealed Saturday (app.js:572-587). Possibly superseded by later work (T-026c touched T-003); re-check before building. |
| T-005 | Design foundations: iOS type ramp, system font, tokens, Auto theme, verify-design gate | done | 0 | https://github.com/Nexline1/brickford/pull/4 | from inbox 2026-09-25 (premium iOS redesign; loop/design/brief.md) Merged to main (owner confirmed 2026-11-15; from git log). |
| T-006 | iOS chrome: collapsing large title, material nav and tab bar, sidebar material | done | 0 | https://github.com/Nexline1/brickford/pull/5 | from inbox 2026-09-25; depends on T-005 Merged to main (owner confirmed 2026-11-15; from git log). |
| T-007 | Lists become iOS inset grouped sections | done | 0 | https://github.com/Nexline1/brickford/pull/5 | from inbox 2026-09-25; depends on T-005 Merged to main (owner confirmed 2026-11-15; from git log). |
| — | T-008..T-073 shipped outside this table (see git log on main) | done | | | Noted 2026-11-15 so PICK does not reach back to stale rows. |
| T-074 | Frozen schedule date, first-watch timestamp, synced-state docs | ready | 0 | | from inbox 2026-11-14 (notes 2+4). Needs owner approval: adds state fields (PROTECTED). Blocked by the T-069 feature freeze unless lifted. Both apps. Ready (owner, 2026-11-15, confirmed in the loop session). State additions owner-approved; T-069 feature freeze lifted for T-074..T-076 only (owner, 2026-11-15). |
| T-075 | Today banner: each unwatched lecture and how late | ready | 0 | | from inbox 2026-11-14 (note 1). Depends on T-074. Freeze applies. Both apps. Ready (owner, 2026-11-15, confirmed in the loop session). State additions owner-approved; T-069 feature freeze lifted for T-074..T-076 only (owner, 2026-11-15). |
| T-076 | One-tap mood, four slots, synced as a ledger event | ready | 0 | | from inbox 2026-11-14 (note 3). Needs owner approval: new synced event (PROTECTED). Freeze applies. Slot hours are an owner decision. Ready (owner, 2026-11-15, confirmed in the loop session). State additions owner-approved; T-069 feature freeze lifted for T-074..T-076 only (owner, 2026-11-15). |
