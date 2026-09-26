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
