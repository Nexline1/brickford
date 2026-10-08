# Queue

status: proposed / ready / building / review / pr-open / done / blocked
Only the owner moves an item from proposed to ready (T-000 was made ready on the owner's instruction).

| id | title | status | rounds | pr | notes |
|---|---|---|---|---|---|
| T-000 | Verification harness | merged | 4 | https://github.com/Nexline1/brickford/pull/2 | Owner-granted 4th round; reviewer APPROVED. All 7 gates green (clip: 0 new, 0 stale, 953 known). Contains the scaffold commit while PR #1 is unmerged. |
| T-001 | Tab bar fits at larger text sizes | merged | 3 | https://github.com/Nexline1/brickford/pull/3 | Reviewer APPROVED round 3. Stacked on PR #2 and #1. |
| T-002 | Sidebar brand fits at larger text sizes | proposed | 0 | | From T-000 clip evidence (24px root, 768 px and up). |
| T-003 | No sideways scroll or cut-off controls on narrow phones | proposed | 0 | | From T-000 clip evidence; the drill answer row fails even at 16px. Add: the numeric-answer Submit (#numGo) clips at 320px/16px (reviewer, round 3). |
| T-004 | Longest streak skips a sealed Saturday | proposed | 0 | | Found by the T-000 reviewer: bestStreak counts a sealed Saturday (app.js:572-587). |
| T-005 | Design foundations: iOS type ramp, system font, tokens, Auto theme, verify-design gate | merged | 2 | https://github.com/Nexline1/brickford/pull/4 | from inbox 2026-09-25 (premium iOS redesign; loop/design/brief.md). Scope adds the status-bar overlap fix (owner screenshot 2026-09-26). |
| T-006 | iOS chrome: collapsing large title, material nav and tab bar, sidebar material | merged | 3 | https://github.com/Nexline1/brickford/pull/5 | from inbox 2026-09-25. Owner 2026-09-26: build together with T-007 in one branch, stacked on T-005 (PR #4). |
| T-007 | Lists become iOS inset grouped sections | merged | 3 | https://github.com/Nexline1/brickford/pull/5 | Built together with T-006 (owner, 2026-09-26). |
| T-016 | Thumbnails and resume points for every lecture | merged (PR #7) | 2 | | from owner 2026-10-03 (long-form continuity, brief §8) |
| T-017 | Home becomes a feed: Continue watching, Up next, a shelf per course | ready | 0 | | brief §8; supersedes T-009; depends on T-016 |
| T-018 | Watch page with Up next and an autoplay countdown | proposed | 0 | | brief §8; supersedes T-010; depends on T-016 |
| T-021 | verify-shell pins its clock and exempts the real heatmap | merged (via PR #7) | 1 | | owner decision 2026-10-06 (gate went red on main by date) |
| T-024 | Navy theme: dark navy into gold, the default look | merged (PR #8) | 1 | | owner approved the specimen 2026-10-06; stacks on T-016 |
| T-023 | Floating glass tab bar you can slide along | merged (PR #10) | 0 | | owner 2026-10-06 (Batelco bar; brief §9); after T-024 |
| T-022 | Opening screen: navy into gold, crest zoom, wordmark fade, iOS startup images | ready | 0 | | owner 2026-10-06 (brief §9); after T-023 |
| T-025 | Dark, Light and Auto only; the dark the owner liked back as default; sidebar darker | merged (PR #9) | 0 | | owner 2026-10-07 (reverses T-024 colours) |
| T-026 | Page redesigns, desktop first, one page per PR with a mockup first: Atlas, Courses, Problems, Exams, Proof, Practice, Week, Calendar lists, Library | proposed | 0 | | owner 2026-10-07 |
| T-027 | Treasury becomes a business workspace (Notion-like): clients, projects, money in/out, notes; fixes treasury never merging on pull | ready | 0 | | owner 2026-10-07; needs its own mockup |
| T-028 | Practice: record yourself (audio), recordings on this device | ready | 0 | | owner 2026-10-07 |
| T-026a | Atlas as a route, Courses as a shelf (mockups approved 2026-10-07) | ready | 0 | | owner approved specimen-atlas/courses; after T-025 |
| T-026b | Problems, Exams, Proof say what they are for (mockups approved 2026-10-07) | ready | 0 | | owner approved specimen-problems/exams/proof; after T-026a |
| T-026c | Week, Calendar day view, Library (mockups approved 2026-10-07) | ready | 0 | | after T-026b |
| T-029 | Phone landscape: Next card + tab bar take ~44% of a 390px-tall screen; compact or hide the card when the viewport is short | proposed | 0 | | found in T-023 r2 CHECK 2026-10-08 |
| T-030 | Dashboard: at 320px with a 24px root the next-lecture kicker (.one-kind) overflows (scrollWidth 340 vs 280) on long titles, which zooms the whole page out on isMobile | proposed | 0 | | pre-existing on main; found by T-023 r2 reviewer 2026-10-08 (probe rv023r2/ovf3.js) |
