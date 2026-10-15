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
| T-028 | Practice: record yourself (audio), recordings on this device | done | 3 | PR #19 | merged 2026-10-14 (bdb6d0e); owner: fix, quick check, merge |
| T-026a | Atlas as a route, Courses as a shelf (mockups approved 2026-10-07) | merged (PR #11) | 0 | | owner approved specimen-atlas/courses; after T-025 |
| T-026b | Problems, Exams, Proof say what they are for (mockups approved 2026-10-07) | merged (PR #13) | 0 | | owner approved specimen-problems/exams/proof; after T-026a |
| T-026c | Week, Calendar day view, Library (mockups approved 2026-10-07) | done | 2 | PR #18 | merged 2026-10-11 (cc0d9ed) |
| T-029 | Phone landscape: Next card + tab bar take ~44% of a 390px-tall screen; compact or hide the card when the viewport is short | proposed | 0 | | found in T-023 r2 CHECK 2026-10-08 |
| T-030 | Dashboard: at 320px with a 24px root the next-lecture kicker (.one-kind) overflows (scrollWidth 340 vs 280) on long titles, which zooms the whole page out on isMobile | proposed | 0 | | pre-existing on main; found by T-023 r2 reviewer 2026-10-08 (probe rv023r2/ovf3.js) |
| T-031 | Atlas/Courses layout polish from T-026a review r3: shelf floor 7rem, sweep widths, card basis 12rem, plants, deviation note | done | 2 | PR #16 | merged 2026-10-10 (45fdf55) |
| T-032 | Shuffle MCQ options at mount (answers are 95% option 2 in summaries, ~all option 1 in two banks) + uniform-position gate | merged (PR #12) | 0 | | owner 2026-10-08: fix first |
| T-035 | Sunday revision PDF: sample first, then #/revision/<week> print layout, Export only on Sunday | proposed | 0 | | owner 2026-10-08; sample to owner before build |
| T-034 | Sunday review #/sunday: week at a glance, recall, mastery-loop exercises, week-understood seal; on top of the full Sunday | ready | 0 | | owner 2026-10-08 (no schedule change) |
| T-036 | Review council: 5 advisor agents + llm-council skill + owner profile; monthly routine + on demand; proposals only | ready | 0 | | owner 2026-10-08 |
| T-037 | SPCH 100 full course (~50 h, 16 modules, transcript-verified, drill per lesson), appended after the seed; no other dates move | merged (PR #14) | 0 | | owner 2026-10-09: bigger ~50 h; right after T-026b |
| T-038 | Gates: pass only in order with a requirements confirm; LWW sync so an unmark sticks; legacy true never 'today'; Atlas shows 'Passed d Mon' | merged (PR #15) | 0 | | owner 2026-10-09: accidental Gates 1-3; after T-037 |
| T-039 | verify-design T-024 "switch (c)" flake: diagnosed — the harness browser loses file:// localStorage on reload (~1 in 30); add a document-start precondition proof + re-measure on every gate reload, never loosening an assertion | done | 3 | PR #17 | merged 2026-10-11 (9b004fe) |
| T-040 | /atlas, root 24, Gate 3 next, 320–329px: since T-031's min-content floor the .at-main column (caption, title, both chips) is 265px in a 230px content box and crosses the card's right border by up to 10px (330–354: into the right padding). Acceptance: (a) contained and no word broken mid-word at 320–354/root 24; (b) the per-gate check (verify-design) gains a containment clause (nothing wider than its box) for Gates 1–5, so a future long chip word fails; (c) correct the style.css comment (~2425-2432) that implies the floor keeps the column inside the card | proposed | 0 | | reworded per T-031 r2 review 2026-10-10 |
| T-041 | Week (#/review): re-sealing a week overwrites it with the (empty) form; a background repaint clears text typed into the Week fields; the grid's Today can show a month before START_DATE. Pre-existing, found by T-026c builder | proposed | 0 | | 2026-10-11 |
| T-042 | Practice reps merge key: recorded humour reps all share `date|` and two 90s-capped story recordings share `date|90`, so two such reps on one day become one on other devices after a sync (app.js ~336). Give recorded reps a distinguishing merge key without breaking existing merges | proposed | 0 | | found by T-028 reviewer 2026-10-14 |
| T-033 | Lecture quizzes + summaries for the 80 lectures with none (AI 200 first, then AI 210, AI 300, AI 310, RES 400), 5–8 questions each from the video transcript; numerics re-derived; verify-content checks | building | 0 | | owner 2026-10-14: content first; supersedes the old T-033 summaries item |
| T-043 | Lecture quiz gate + lesson flow (mockups specimen-lesson-quiz/-passed): quiz under the video once watched, misses retried, first-try score kept; lecture done = watched + quiz passed; next lecture in the course locked; Go deeper (sketch, recall, problems); pre-gate watched lectures not locked, listed to catch up | ready (spec written) | 0 | | owner 2026-10-14 |
| T-045 | Problems as 'due now' (mockup specimen-problems-v2): quizzes waiting, problem sets unlocked at unit end, labs by phase, each explained; 'Coming up'; catch-up quizzes | ready (spec written) | 0 | | owner 2026-10-14 |
| T-046 | Story transcription on device (pinned on-device speech-to-text model, approved dependency), transcript stored with the clip; filler words marked | ready (spec written) | 0 | | owner 2026-10-14 |
| T-047 | Story coach: Claude in the app with the owner's own API key (device only, never synced), compares the transcript with SPCH 100's structure, lists fillers to cut (mockup specimen-practice-coach) | ready (spec written) | 0 | | owner 2026-10-14 |
| T-044 | Deeper lecture quizzes: 5–8 questions per lecture from transcripts for the 414 summarised lectures, course by course ahead of the calendar | proposed | 0 | | owner 2026-10-14 |
| T-048 | Practice: if the mic is refused while a background repaint is queued, the replayed render lands after micGone() focused #repSecs, so focus ends on <body>; focus the field in the replayed render's after (found by T-028 quick review) | proposed | 0 | | 2026-10-14 |
| T-049 | Quiz engine: numeric answers typed with thousands separators ("38,597,376") are graded wrong, because only the first comma is turned into a decimal point. Accept grouped digits (commas, spaces, thin spaces) when the grouping is valid, keep "2,5" as a decimal comma, and add verify-flows cases for both (found by T-033 review r1; sys250 is exposed too) | proposed | 0 | | 2026-10-15 |
