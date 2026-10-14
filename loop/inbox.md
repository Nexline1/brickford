# Inbox

Dump notes here after a study session. The loop turns new ones into proposed specs
(max 3 per run). Leave processed notes in place; the loop marks them with `→ <id>`.

<!-- template: copy per day
## YYYY-MM-DD
[friction] 
[want] 
[bug] 
-->

## 2026-09-25
[friction] Tab bar below 300px wide: at a 16px root Home is 35.5px wide (under 44), and at 28/32px roots some tabs drop under 44 at 250-280px. From the T-001 reviewer; outside T-001's 320/390 scope.
[want] Premium iOS-native redesign, phone first and desktop too (owner, 2026-09-25). Direction, tokens and roadmap in loop/design/brief.md. → T-005, T-006, T-007 (T-008..T-015 on the brief's roadmap)
[bug] Auto theme can flip light↔dark mid-session; the sketch pad reads --ink once when the page opens (app.js ~4529), so strokes stay #111 on the dark surface after a flip. From the T-005 reviewer.
[friction] Check on the phone after T-005 ships: with apple-mobile-web-app-status-bar-style black-translucent, iOS may draw white status-bar glyphs over the light theme's cream header strip. Chromium can't emulate it. From the T-005 reviewer.
[friction] After T-005: verify-design never measures the dashboard's empty .bar track (only /record and /quiz); .opt.correct/.wrong fills are 1.013:1 on the light page (borders still carry the state); hard-coded .opt edge (style.css ~883), .onecounts > a inset (~1352) and .card radius 0 (~669) are left for the screen items. From the T-005 round-2 reviewer.
[friction] From the T-006/T-007 reviewer: the phone names one page three ways (large title "Dashboard", tab "Home", specimen "Today") — reconcile in T-009; once a lesson page is scrolled the course link is no longer reachable from the bar; meta theme-color is still --panel (espresso) above the light nav bar (predates T-006; T-005's gate asserts it, so change both together).

## 2026-10-03
[want] The whole app as one seamless long-form watching experience, phone and desktop, modelled on YouTube/Netflix continuity; keep Saturday rest, add a switch-off break nudge; keep the iOS look (owner). → T-016, T-017, T-018 (T-019 mini-player and T-020 session continuity on the brief's roadmap)
[bug] From the T-006/T-007 round-3 reviewer: the .hash box on /record anchors is --surface on a --surface section, so its box vanishes (fix: .glist .hash { background: var(--surface-2) }); large titles split mid-word at 320px/24px root ('Dashboar|d', 'Handboo|k' — cap the size or use overflow-wrap: break-word); .ghead padding 0 4px 8px vs the spec's 0 20px 8px — settle in T-017; the menu button's focus ring top edge is off-screen at y=0; T-005's cellPick check failed once under parallel load (3000ms ceiling).

## 2026-10-07 — owner feedback after navy shipped (verbatim points)
- Navy "too fancy", "too bright", "not comfortable for my eyes to stay on the platform for long". "The dark one was good, but you removed it." Fewer themes: "just what actually is doable". Sidebar "slightly darker".
  → decided: Dark + Light + Auto; sidebar darker than the page. T-025.
- Apple-design asks still missing: removing things, removing text, the opening intro that fades in (T-022), the bottom bar (T-023).
- Desktop pages are not self-explanatory and all share one template ("just a stack on top of each other"): Atlas, Courses, Problems ("what am I supposed to do here?"), Exams, Proof, Library all look alike.
- Practice: unclear, too much text; wants an audio button to record himself.
- Week: "what is all this about?"
- Calendar: grid is one of the best; the lists beneath it (MATH 130, AI 200, SPCH 100) need a new layout.
- Treasury: "a place where I can manage my business from. Imagine Notion ... every part of my business, my finance, all of that is being recorded in there."
- Order decided: theme fix first, then pages one by one on desktop with a mockup before each; bottom bar finishes in parallel; opening screen after.

## 2026-10-14 — owner: quiz after every lecture, reorganise practice, story transcription + coach
Owner (verbatim gist): "I never, never, ever take the questions right after each video… create a quiz after each video… using the summary… block the next video for me unless I do take the quiz and solve it correctly. The quiz should actually be valuable and cover what's in each video. This applies to AI, storytelling, mathematics, and all other subjects." "I've never used the draw method… I've never taken [the problem sets and labs]… I'm not even sure what they are… reorganize and change how the quiz works, where the quiz appears, and/or reorganize everything." "Make sure… the audio recorder is recording the stories as audio and transcribing them as text too." "An AI brain to read the transcript and compare what the lectures are saying with the story format and story structure versus what I have recorded… find filler words that should be removed."

Owner decisions (AskUserQuestion, 2026-10-14):
- Gate: **every question right, misses retried** (a miss shows why and comes back reshuffled later in the same sitting); first-try score kept on the record.
- **A lecture counts as done for the day only when watched AND its quiz passed** (day green / streak). No plan dates move.
- Transcription: **on-device** speech-to-text in the browser (one-time model download ~40–75 MB; audio never leaves the device). This approves that dependency (pinned, from an allowed CDN) for the transcription item.
- Story coach: **Claude inside the app**, with the owner's own Anthropic API key saved on the device (never synced).

Census at decision time: 494 lessons (466 video). 414 have summaries with 2–4 "Check yourself" questions (1,233 total). 80 have none: AI 200 (15), AI 210 (8), AI 300 (16), AI 310 (23), RES 400 (18) — T-033.

Owner decisions on the mockups (AskUserQuestion, 2026-10-14):
- Mockups `specimen-lesson-quiz`, `specimen-lesson-passed`, `specimen-problems-v2`, `specimen-practice-coach`: **"Yes, build this"**.
- Order: **content, then gate, then coach** — finish T-028; quizzes for the 80 lectures with none (AI 200 first, it is on the calendar); then the gate + lesson flow + Problems as due-now; then on-device transcription + Claude coach; then deeper quizzes everywhere. Other redesigns (Treasury, opening screen, …) after.
- Lectures watched before the gate ships: **don't lock; list their quizzes to catch up** under Problems. Past days keep their colours.
- Quiz depth: **5–8 questions per lecture, written from the video's transcript**, numerics re-derived, course by course ahead of the calendar.
