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
| T-026a | Atlas as a route, Courses as a shelf (mockups approved 2026-10-07) | merged (PR #11) | 0 | | owner approved specimen-atlas/courses; after T-025 |
| T-026b | Problems, Exams, Proof say what they are for (mockups approved 2026-10-07) | merged (PR #13) | 0 | | owner approved specimen-problems/exams/proof; after T-026a |
| T-026c | Week, Calendar day view, Library (mockups approved 2026-10-07) | building | 0 | | started 2026-10-10 after T-031 |
| T-029 | Phone landscape: Next card + tab bar take ~44% of a 390px-tall screen; compact or hide the card when the viewport is short | proposed | 0 | | found in T-023 r2 CHECK 2026-10-08 |
| T-030 | Dashboard: at 320px with a 24px root the next-lecture kicker (.one-kind) overflows (scrollWidth 340 vs 280) on long titles, which zooms the whole page out on isMobile | proposed | 0 | | pre-existing on main; found by T-023 r2 reviewer 2026-10-08 (probe rv023r2/ovf3.js) |
| T-031 | Atlas/Courses layout polish from T-026a review r3: shelf floor 7rem, sweep widths, card basis 12rem, plants, deviation note | done | 2 | PR #16 | merged 2026-10-10 (45fdf55) |
| T-032 | Shuffle MCQ options at mount (answers are 95% option 2 in summaries, ~all option 1 in two banks) + uniform-position gate | merged (PR #12) | 0 | | owner 2026-10-08: fix first |
| T-033 | Summaries for the 85 unsummarised lectures (AI 200, SPCH 100 now; AI 210 by week 7; AI 300/310, RES 400), from transcripts via Yt T MCP; tools/check-runway.js | ready | 0 | | owner 2026-10-08 |
| T-035 | Sunday revision PDF: sample first, then #/revision/<week> print layout, Export only on Sunday | proposed | 0 | | owner 2026-10-08; sample to owner before build |
| T-034 | Sunday review #/sunday: week at a glance, recall, mastery-loop exercises, week-understood seal; on top of the full Sunday | ready | 0 | | owner 2026-10-08 (no schedule change) |
| T-036 | Review council: 5 advisor agents + llm-council skill + owner profile; monthly routine + on demand; proposals only | ready | 0 | | owner 2026-10-08 |
| T-037 | SPCH 100 full course (~50 h, 16 modules, transcript-verified, drill per lesson), appended after the seed; no other dates move | merged (PR #14) | 0 | | owner 2026-10-09: bigger ~50 h; right after T-026b |
| T-038 | Gates: pass only in order with a requirements confirm; LWW sync so an unmark sticks; legacy true never 'today'; Atlas shows 'Passed d Mon' | merged (PR #15) | 0 | | owner 2026-10-09: accidental Gates 1-3; after T-037 |
| T-039 | verify-design T-024 "switch (c)" (pick Light then reload) is racy: flaked once during T-031 plant b; make it wait on proof | proposed | 0 | | found by T-031 builder 2026-10-10 |
| T-040 | /atlas, root 24, Gate 3 next, 320–329px: since T-031's min-content floor the .at-main column (caption, title, both chips) is 265px in a 230px content box and crosses the card's right border by up to 10px (330–354: into the right padding). Acceptance: (a) contained and no word broken mid-word at 320–354/root 24; (b) the per-gate check (verify-design) gains a containment clause (nothing wider than its box) for Gates 1–5, so a future long chip word fails; (c) correct the style.css comment (~2425-2432) that implies the floor keeps the column inside the card | proposed | 0 | | reworded per T-031 r2 review 2026-10-10 |
