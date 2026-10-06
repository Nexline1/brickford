# T-016: Thumbnails and resume points for every lecture

Source: `loop/design/brief.md` §8 (owner decision 2026-10-03: "Continuity, with a break nudge"). The look to hit is the thumbnails in `loop/design/specimen-feed-*.png`. Builds on T-005, T-006 and T-007.

## Problem
- **No lecture has an image.** The only `<img>` in the app is the sketch preview (`platform/js/app.js` ~3166). Every list of lectures is text, so nothing on the screen invites you to press play.
- **The data already carries everything a thumbnail needs.** Each lesson in `platform/data/curriculum.js` stores its YouTube id in `v`:
  - 296 of 324 lessons have one, and each matches the 11-character id pattern;
  - `min` holds the duration;
  - 28 readings and papers have no `v`.
- **No playback position is stored.** `V.lesson` (`app.js` ~2195) builds `https://www.youtube.com/embed/<v>` with no `enablejsapi`, `start` or `origin`. So a 115-minute lecture always restarts from 0:00.

## Learner outcome
- Every lecture shows its real video frame, its length, and how far you have watched.
- Re-opening a lecture resumes where you stopped, on any device that syncs.

## Scope
1. **`thumbFor(cid, u, i)` helper:**
   - Returns `https://i.ytimg.com/vi/<v>/hqdefault.jpg` when `v` exists.
   - Otherwise returns `null`, and the caller draws a typeset cover: the course colour, the code and the title.
   - `loading="lazy"`, `decoding="async"`, an explicit 16:9 aspect ratio, and empty `alt` (the title is already beside it).
   - A `--surface-2` skeleton until `load` fires. The image fades in over 120ms, and reduced motion makes that instant.
   - On `error`, it falls back to the typeset cover.
2. **One `.thumb` component**, matching the specimen:
   - `--r-md` corners;
   - a duration chip at bottom-right (`min` formatted as `m:ss` or `h:mm:ss`);
   - a 3px progress edge (watched fraction from the resume point; full when done);
   - "Watched" and "Proven" states.
3. **Resume points:**
   - Add `enablejsapi=1&origin=<location.origin>&start=<sec>` to the lesson embed URL.
   - Listen to the iframe's `postMessage` `infoDelivery` events. Do not load `iframe_api`.
   - Keep the current time in memory. Persist it as `S.lessons[k].pos` (seconds) only on `pause`, on leaving the route or page (`pagehide`), and on `ended` (which also clears it), through the existing save path.
   - A render is a read: never write from a render or a timer tick (CLAUDE.md, `verify-sync-loop`).
   - `pos` syncs like the other lesson fields, merged by the later `posAt` timestamp.
4. **Where thumbnails appear in this item:** only the course page's lecture rows (`V.course`, as a 96px leading thumbnail) and the lesson page's prev/next. The feed (T-017) and the watch page (T-018) use the component later.
5. Bump every `?v=` token.

## Out of scope
- Home feed layout (T-017), watch page layout and autoplay (T-018), mini-player (T-019).
- Any edit to `platform/data/` (PROTECTED); every value is derived.
- New dependencies: no `iframe_api` script, and thumbnails come from YouTube's public image host. The app has no CSP and no service worker.
- Changes to what "watched" means.

## Acceptance criteria
1. **Thumbnails, in `verify-design.js` (extended)**, at 390 and 1280 in light and dark, on `/course/math110`:
   - every video lecture row has an `<img>` whose `src` matches `i.ytimg.com/vi/<its v>/hqdefault.jpg`;
   - each image is `loading=lazy` with an aspect ratio of 16/9 (±0.01);
   - its box has a `--surface-2` skeleton background before load;
   - reading lectures (e.g. `/course/ai300`) get a typeset cover with no `<img>`;
   - the duration chip text equals the formatted `min`.

   Network is refused in the harness, so the gate asserts the *error* fallback and the skeleton, not the image pixels.
2. **Resume, a new verify-flows check.** The test hook simulates the iframe's `infoDelivery` (`currentTime` 754) followed by a `pause` event. Then:
   - `S.lessons[k].pos === 754`;
   - re-opening the lesson builds an embed URL containing `start=754`;
   - an `ended` event clears `pos`.
3. **A render is a read.** Rendering `/lesson/math110/0/13` 20 times, and receiving 50 `infoDelivery` ticks without a pause, causes zero `save()` calls. `verify-sync-loop` still passes.
4. **Planted bugs**, each exiting 1:
   - (a) writing `pos` on every tick;
   - (b) the thumbnail `src` built from the wrong field;
   - (c) the error fallback removed.
5. **All gates green:** contrast in 7 themes (duration chips and cover text are at least 4.5:1), shell (44×44, nothing fixed over text), and clip with 0 new findings (the baseline only shrinks).
6. **Screenshots** of `/course/math110` and `/lesson/math110/0/3` at 390 (light and dark) and 1280.

## Verification checklist
- [ ] typecheck and all gates
- [ ] three planted-bug runs exit 1
- [ ] resume round-trip shown in the flows check
- [ ] screenshots
