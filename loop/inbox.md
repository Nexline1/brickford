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

2026-10-14, T-033 sources: the transcript tools broke (`Yt_T` needs a key; `Youtube_Transcribt` errors) and the paper hosts are blocked. Owner decisions:
- **"Course materials now, transcripts later":** quizzes come from the official GitHub companion materials for Zero to Hero, fast.ai and CS336 (34 videos). 3Blue1Brown, David Silver and the LLM talks wait.
- **"I'll allow the sites":** arxiv.org, proceedings.neurips.cc, cdn.openai.com, transformer-circuits.pub, web.stanford.edu, www.cs.virginia.edu, www.neelnanda.io and www.arena.education.
- **2026-10-15, readings (T-033 review r1, finding 12):** "Yes, count it". The 7 reading quizzes may use the page's source text from the authors' own repos, pinned to the version the live site serves. Questions on text the served page lacks are removed.

## 2026-10-21: owner course-correction, "a premium, native Apple application"
The owner sent a full spec: Inter as the SF stand-in, the iOS type scale, iOS system colours, inset grouped lists with `rounded-2xl`, and press physics on everything tappable. They asked for a tailwind.config.js and a rewrite of the visual template. Their decisions:
- **"Add Tailwind with a build step".** Tailwind 4.3.3, CLI, `tailwind.config.js`, compiled CSS committed so GitHub Pages stays as it is.
- **"Apple's accessible shades".**

  | Use | Light | Dark |
  |---|---|---|
  | Grey text | `#6E6E73` | `#8E8E93` |
  | Links and tint text | `#0066CC` | `#0A84FF` |
  | Filled buttons, white text | `#0071E3` | |
  | Red text | `#D70015` | `#FF453A` |

  Exact iOS hues stay for fills and icons. The 4.5:1 contrast gate stays.
- **"Pure iOS; crest stays as the logo".** Navy and gold leave the interface.
- **"Mockup of 3 screens first, then the whole app".** Dashboard, lecture with quiz, and Problems, at 390 and 1440, in Light and Dark.
- T-045 is paused at 105002d; its r1 fixes resume under the new system.
- The apple-design skill gained `references/ios-system-tokens.md` (aad8bd3).
- **2026-10-22, the T-051 mockup:** approved ("rebuild the whole app"); 13px regular headers; floating capsule tab bar; the press dip is fine. Phone feedback: too much text, titles too long, the layout isn't user-friendly, "monitor that to make it better". Answered by the density rules and verify-density in the T-051 spec.
- **2026-10-23, the owner is Shia:**
  - Prayers: Ja'fari (Tehran) in 3 combined blocks (Fajr; Dhuhr & Asr; Maghrib & Isha); no Jumu'ah.
  - Gym once a day, right after Fajr; Brickford 3 h straight after the gym (fixed).
  - German 1.5 h spread through the day: Easy German podcast on Spotify 45 (during the workout), speaking 10, writing 10, reading 25.
  - 10 h of work a day.
  - The 22 Oct day plan is the model. Calendar reworked to match (log: scratchpad/monk/created.txt).
