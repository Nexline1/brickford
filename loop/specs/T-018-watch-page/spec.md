# T-018: The lesson becomes a watch page, with Up next and an autoplay countdown

Source: `loop/design/brief.md` §8. The approved look is `loop/design/specimen-feed-watch*-*.png`. It supersedes T-010. Depends on T-016's resume and `postMessage` bridge.

## Problem
- **When a lecture ends, nothing happens.** The reader has to scroll, find "Watched" and then "Next".
- **"Next" stops at the end of a unit.** It is `li + 1` within the unit (`app.js` ~2223), and at the end it links back to the course page (~2344).
- **The phone layout wastes the video.** The video sits inside the reading column with margins, and the summary, drill and proof are a long scroll with no sense of what comes after.

## Learner outcome
- A lecture flows into the next one the plan wants you to watch.
- You see what's coming in a column (desktop) or under the summary (phone).
- You can always cancel the countdown, take the proof check, or stop.

## Scope
1. **Layout:**
   - **Phone:** the player is full-bleed 16:9 directly under the nav bar. Below it, in order:
     - the title (Title 2);
     - a meta row: a course pill, "Lecture 3 of 16", the duration, the instructor;
     - actions: "Mark watched" (filled), "Prove it" (tinted, when a proof exists), "Notes" (gray);
     - the summary beats as cards (`summaryHTML`);
     - the drill and proof;
     - the "Up next" list.
   - **Desktop:** two columns, the player and body on the left and a 360px "Up next" column on the right.
2. **`queueAfter(k)`:** the ordered next lectures for this reader.
   - First the rest of today's plan (`realSched`), then the backlog, then the next lecture in course order, crossing unit boundaries.
   - Pure; it reads only state.
   - Rendered as rows with T-016 thumbnails. The current lecture is highlighted "Now playing".
3. **End card and countdown.** On `ended` (via the T-016 bridge), an overlay on the player shows:
   - a ring counting down 8s;
   - "Up next in N";
   - the next title;
   - "Play now" and "Cancel".

   Rules:
   - At 0 it navigates to the next lecture, with `autoplay=1`.
   - Cancel, any scroll or tap outside the card, or leaving the page cancels it.
   - **No countdown on a rest day.** On Saturday the end card offers "Play now" only.
   - **No countdown past the proof.** If the finished lecture has a "prove it" check and it is not yet proven, the end card offers "Prove it" first and does not count down.
   - "Watched" is **not** set automatically. The end card's "Play now" and the countdown both mark the finished lecture watched, exactly as the existing button does.
   - Setting "Autoplay next" (default on) in settings. When off, the end card shows without the countdown.
4. **Reduced motion:** the ring is replaced by a plain "Up next" label, with no countdown animation (the timer still applies).
5. Bump every `?v=` token.

## Out of scope
- The mini-player (T-019) and the break nudge (T-020).
- Changes to proofs, drills or summaries content.
- PROTECTED paths; new dependencies.

## Acceptance criteria
1. **Layout, in `verify-design.js`:**
   - At 390 the player spans the viewport width (±1px), with 16:9 aspect, directly under the nav bar.
   - At 1280 there is a right column 360px wide (±2) holding "Up next".
   - Title, meta, actions and summary are in the order above.
2. **`queueAfter`, in `verify-logic`:**
   - with a seeded day, it returns the remaining scheduled lectures, then the backlog, then course order;
   - at the last lecture of MATH 110 Unit I it continues into Unit II;
   - it never returns a lecture already done today;
   - it is pure (the state hash is unchanged).
3. **Countdown, in `verify-flows`** (simulated `ended` via the test hook, pinned clock):
   - it reaches 0 after 8s and navigates to `queueAfter(k)[0]`, marking the finished one watched;
   - Cancel stops it and the route is unchanged;
   - on a Saturday no countdown starts;
   - on an unproven lecture with a proof, "Prove it" shows and no countdown starts;
   - with the setting off, no countdown.
4. **A render is a read:** the countdown and the end card never call `save()` until the reader or the timer acts. `verify-sync-loop` passes, so a background render does not destroy the playing iframe.
5. **Planted bugs**, each exiting 1:
   - (a) the countdown starts on a Saturday;
   - (b) `queueAfter` stops at the unit end;
   - (c) the countdown ignores Cancel;
   - (d) the end card skips the proof.
6. **All gates green:** 44×44 on "Play now", "Cancel" and queue rows; contrast in 7 themes, including white on the 78% black end-card scrim; clip 0 new.
7. **Screenshots** of the lesson at 390 (light and dark, playing and ended) and 1280, compared with the specimen.

## Verification checklist
- [ ] typecheck and all gates
- [ ] four planted-bug runs exit 1
- [ ] the countdown states: normal, cancel, Saturday, unproven, setting off
- [ ] screenshots vs the specimen
