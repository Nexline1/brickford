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

## 2026-11-14
[want] Unwatched-lecture flag (owner, 2026-11-14). When any lecture scheduled for today or earlier is not marked watched, Today shows a banner naming each one and how many days late it is. No popup. The email reminder is NOT Brickford's job: the life-loop tracker (C:\Users\user\Downloads\life-loop\tracker) reads progress/brickford-state.json from Nexline1/brickford-private and sends it. Brickford only has to publish the data below. → T-075
[want] Frozen schedule date per lecture (owner, 2026-11-14). Scheduled dates are computed and re-anchor when he works ahead, so lateness can't be measured after the fact. Once a lecture's scheduled date arrives, store it on the lesson (e.g. `scheduledFor: "YYYY-MM-DD"`) and never change it. `firstDoneAt` must never be overwritten by unmark/re-mark; store it as a full ISO timestamp from now on (today it is a date on 2 of 68 lessons). Lateness = firstDoneAt − scheduledFor, computed by the reader, not the app. Adds fields only; drops or rewrites nothing (PROTECTED state shape: needs the owner's approval in the spec). → T-074
[want] One-tap mood (owner, 2026-11-14). A 1–5 row on Today, four slots a day (after dawn, midday, late afternoon, night). A missed slot is one pending chip, never a popup. Also offered once right after marking a lecture watched. Saved as a ledger event `type: "mood"`, `data: {score, slot}`, with the event's `ts`. It MUST sync (unlike Monk Mode, which never syncs): the tracker reads it from the synced file. → T-076
[want] Keep the synced file readable by an outside reader: document in docs/ the fields the tracker relies on (state.lessons.*.done/doneAt/firstDoneAt/scheduledFor, state.studyDays, ledgers.*[].{ts,type,ref,data}) so a later refactor doesn't silently break the email. → T-074
