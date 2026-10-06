# T-017: Home becomes a feed — Continue watching, Up next, a shelf per course

Source: `loop/design/brief.md` §8. The approved look is `loop/design/specimen-feed-home-*.png`. It supersedes T-009, and keeps T-009's ring, week strip and streak chip. Depends on T-016's thumbnails.

## Re-scope (owner, 2026-10-06, brief §9)
The Home feed takes the approved navy layout in `loop/design/specimen-navy-home-*.png`:
- **Greeting:** "Good evening, Ali", time-of-day aware, using a new *Your name* setting. With no name it reads "Welcome back". It sits over the glow, with day, week and streak on a small line above.
- **Sheet:** a content sheet rising with 32px top corners.
- **Continue card:** a thumbnail, three stat wells with big numbers (Today n/N, Planned, Due), and one gold "Resume" capsule.
- **Below the card:** icon chips (Lectures / Problems / Review) with a week meter, then course tiles (an icon plus two short lines).
- **Text:** less of it, with numbers and icons instead of sentences.

The Up next and course shelves below stay as specified.

## Problem
The dashboard (`V.dashboard`, `app.js` ~1676) is a hero card with a black "Open" button, a "Needs attention" list, and today's lectures as text rows (`dayGroupsHTML` ~1032). The plan already knows what comes next (`nextAction` ~1234, `scheduledFor` ~919, `backlogCount` ~1075), but nothing on the screen looks like something to watch. It reads as a to-do list.

## Learner outcome
Opening the app shows the lecture you were in the middle of, as a big frame with a Resume button. The rest of today and your courses sit underneath as rows you can swipe. The next thing to watch is always one tap away.

## Scope
1. **Hero, "Continue watching":**
   - Content:
     - the lecture from `nextAction()`, as a full-width thumbnail (T-016);
     - a play button over the frame, the time left, the progress edge;
     - an eyebrow ("Continue watching" when a resume point exists, otherwise "Up next");
     - the title and meta, today's ring (`n of N today`);
     - one filled button: "Resume at 21:14", or "Play".
   - Rest day: the hero becomes the rest card. No autoplay, no video.
   - Recall-due state: unchanged in priority (`nextAction` order is kept).
2. **Week strip:** six study days plus Saturday as rest, from the existing week data. Tapping it opens `/calendar`.
3. **"Up next" shelf:** today's remaining scheduled lectures (`realSched` / `schedDone`), then the backlog, as horizontal-scroll cards.
   - Phone: 72% width with scroll-snap.
   - Desktop: a 4-column grid.
4. **One shelf per running course:** the current unit's lectures, done ones marked "Watched" or "Proven", headed with the course name and "Unit I · 2 of 16". Readings use the typeset cover.
5. **"Needs attention":** stays, as T-007's compact inset list, placed under the hero only when it has rows.
6. **Desktop:** the hero is a 1.55fr/1fr split (frame on the left, details on the right), and the shelves become grids.
7. **Phone tab:** the tab and the large title both read "Today". This settles the Dashboard / Home / Today naming the T-006 reviewer flagged. The desktop sidebar label is changed to match.
8. Bump every `?v=` token.

## Out of scope
- The watch page and autoplay (T-018); the mini-player (T-019); the break nudge (T-020).
- Any change to scheduling logic: `scheduledFor`, `nextAction` and `backlogCount` are reused, not changed.
- PROTECTED paths; new dependencies.

## Acceptance criteria
1. **Feed structure, in `verify-design.js`**, at 390 and 1280 in light and dark on `/` (seeded state):
   - the hero contains a `.thumb` for `nextAction()`'s lesson, a filled button whose label starts with "Resume" or "Play", and the ring;
   - the week strip has 7 days with Saturday marked rest;
   - the Up next shelf lists exactly the remaining scheduled lectures, then the backlog, in order (compared with `realSched`);
   - each running course has one shelf;
   - phone shelves are horizontal scrollers with `scroll-snap-type: x`, and nothing makes the page scroll sideways;
   - desktop shelves are grids.
2. **States**, using the test hook's clock:
   - Saturday shows the rest hero, and no shelf card offers "Play" as the primary action;
   - an empty first day shows the first lecture with "Play";
   - an all-done day shows "You've finished today" and tomorrow's first lecture.
3. **Planted bugs**, each exiting 1:
   - (a) the shelf drops the backlog;
   - (b) the rest-day hero shows a play button;
   - (c) the phone shelf loses scroll-snap.
4. **All gates green**: shell (44×44 on cards and buttons), contrast in 7 themes, clip 0 new, flows ("open today's lecture" goes through the hero).
5. **Screenshots** of `/` at 390 (light and dark), scrolled and not, plus 1280. They are compared with the specimen, with the differences listed.

## Verification checklist
- [ ] typecheck and all gates
- [ ] three planted-bug runs exit 1
- [ ] rest, empty and all-done states shown
- [ ] screenshots vs the specimen
