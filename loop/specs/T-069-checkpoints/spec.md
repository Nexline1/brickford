# T-069: Near targets as three checkpoints in the app

Owner, 13 Nov: asked for near goals; approved "put these into the app as your next three checkpoints".

## What
A small "Checkpoints" block on the web dashboard (and a row on the Record page). and the same block on the Flutter Home (owner, 13 Nov: features go to BOTH apps; the website is primary, so it is built and verified first): three dated checkpoints, each a short tick list. Barely any words. Ticks are stored in `S.checkpoints[id][itemId] = {done, at}`, merged per item by `at`, synced like the rest (private repo). Data lives in `platform/data/checkpoints.js` (`DAR.CHECKPOINTS`). Exported to Flutter (`checkpoints.json`); `S.checkpoints` merged in Dart exactly as on the web, so a phone sync never drops the ticks. A checkpoint shows days left; past its date it reads "late", never red-shames, and can still be ticked. Nothing here touches the schedule, the gates, the streak or START_DATE.

## The three checkpoints (owner-approved text)
1. **6 Dec 2026 — Prove the routine**
   - Study 10 of the 12 study days, 4 h or more each
   - CS50P lectures 3–5 done, problem sets submitted
   - Every practice problem solved the same day as its math lecture
   - Half a page: how a neural network learns, graded
2. **4 Jan 2027 — The Python bridge is done**
   - All CS50P problem sets from lecture 3 submitted; NumPy and PyTorch basics done
   - 25 easy NeetCode problems solved without help
   - MIT 18.06 Exam 1, timed 50 min, closed book, 70% or more
   - First public post live: "What I learned in my first 10 weeks"
3. **28 Feb 2027 — You can build what you watched**
   - Micrograd rebuilt from a blank file, no video, timed, on GitHub
   - Makemore bigram and MLP rebuilt the same way
   - One timed MIT 18.01 exam, 70% or more
   - Three posts published, each explaining one thing you built

Also: one weekly number on the block, "problems solved this week" (count of practice items marked got it or checked right in the last 7 days), derived, never stored.

## Auto-ticks (derived, shown as ticked, not editable) where the app already knows
- "CS50P lectures 3–5 done" when cs100.0.3–0.5 are watched.
- "25 easy NeetCode problems" from the existing CS 150 tracker count.
Everything else is a manual tick.

## Acceptance
- verify-logic: ticks merge both ways by `at`; a render writes nothing (render is a read); days-left arithmetic on pinned clocks incl. a rest day; auto-ticks follow state; nothing in scheduledFor/dayStatus/streak changes (existing invariants).
- verify-flows: tick and untick an item at 390 and 1280, one write each; 44px targets.
- verify-app: Dart/JS parity for the merge, days-left, auto-ticks and the weekly number; export fresh; a Flutter push keeps `checkpoints`.
- Flutter widget test for the Home block. Plants: merge takes older `at`, a render that writes, auto-tick ignoring state, Flutter push drops checkpoints.
- No change to platform/data/curriculum.js, CLAUDE.md, sw.js.

## After this ships: FEATURE FREEZE for 8 weeks (owner agreed direction, 13 Nov critique)
Only bug fixes and the weekly practice batches until about 10 Jan 2027. One app decision pending with the owner.

## App decision (owner, 13 Nov, corrected): BOTH apps get every feature
The website is primary: each feature is built and verified there first, then ported to the Flutter app in the same item (or the next PR). A Flutter push must never drop data it does not understand.
