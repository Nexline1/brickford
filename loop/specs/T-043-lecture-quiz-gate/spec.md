# T-043: the lecture quiz gate and the new lecture flow

## Source
The owner, 2026-10-14:
- "I never, never, ever take the questions right after each video."
- "Block the next video for me unless I do take the quiz and solve it correctly."
- "Reorganize where you put the questions and the quizzes because I've never taken them."
- The owner never used the draw (sketch) pad.

The decisions and the approved mockups are recorded in `loop/inbox.md` (2026-10-14):
- **Gate:** every question must be answered right. A miss shows why, then comes back later in the same sitting with its options reshuffled. The first-try score is kept.
- **Done:** a lecture counts as done for the day only when it is watched AND its quiz is passed. No plan date moves.
- **Past lectures:** a lecture marked watched before the gate ships is not locked, and nothing it touched is re-coloured. Its quiz goes to a catch-up list (T-045 shows that list on Problems; this item exposes it).
- **Mockups:** `loop/design/specimen-lesson-quiz.png` (quiz in progress after a miss, next lecture locked in the rail) and `specimen-lesson-passed.png` (passed, counted for today, Next lecture, Go deeper).

## Depends on
T-033, merged. Every lecture then has `SUMMARIES[k].checks` (5–8 for the 80 new lectures, 2–4 for the rest until T-044 deepens them). A lecture whose summary has no checks has no quiz, and it is treated as cleared once watched.

## Scope (`platform/js/app.js`, `platform/js/quiz-engine.js`, `platform/css/style.css`)

### 1. Mastery mode in `DAR.Quiz.mount`
Add `opts.mastery: true`.
- **The sitting is every question**, not a random subset.
- **A miss:**
  - shows the explanation;
  - marks its segment red;
  - re-queues the question at the end with its options reshuffled again (the T-032 shuffle at mount must hold for re-queued copies too).
- **A numeric miss** re-queues the same way.
- **The sitting finishes when every question has been answered right once.** `onFinish` receives `{ total, firstTry, attempts, missed: [bank indices missed at least once] }`.
- **There is no "Leave" penalty.** Leaving keeps nothing, and the quiz restarts fresh next time.
- **Non-mastery callers are unchanged**, byte for byte in behaviour: Exams, banks, summary checks elsewhere and concept probes.

### 2. The quiz record: `S.lessons[k].quiz`
- **Shape:** `{ passedAt: "YYYY-MM-DD", at: ISO timestamp, firstTry, total, attempts }`.
- **Writes:** written once, on finish, through `save()`. Never during render.
- **The pass is permanent.** Unmarking watched does not clear it, and a later re-sit only updates the best `firstTry`.
- **Merge** (`mergeState`): carry `quiz` across separately from the "further along" rule, the way T-016 carries `pos`.
  - A pass on either device survives.
  - Keep the earliest `passedAt` and the best `firstTry`.
  - The merge must never lose a pass, whichever side wins the rest of the lesson.
- **Chain:** log a `quiz` event `{ firstTry, total }` (no `undefined` values).

### 3. "Done" means watched + passed
- **`schedDone(it)`** becomes "watched AND cleared". Cleared means one of:
  - the quiz is passed;
  - the lecture has no quiz;
  - the lecture is **grandfathered**: `doneAt` before `QUIZ_GATE_FROM`.
- **`QUIZ_GATE_FROM`** is one constant in `app.js`: the ship date, written in when this item ships.
- Everything that reads `schedDone` follows from it: `dayStatus`, `backlogCount`, the dashboard ring, the calendar's done blocks and the Week tiles. Keep it to the one predicate, so there are no parallel definitions.
- **The streak and `S.studyDays` are unchanged.** Sealing a day stays what it is.
- **CLAUDE.md's date invariants must all still hold.** verify-logic stays green, and its fixtures are updated only by adding quiz passes or `doneAt` dates. No assertion is loosened.

### 4. The lock
- **Which lectures lock.** Lecture `i` of a course, in its flat lecture order, is **locked** when lecture `i−1` of the same course is not cleared. "Not cleared" means either:
  - watched after `QUIZ_GATE_FROM` with the quiz not passed;
  - not watched at all, and not grandfathered.

  The first lecture of every course is never locked. A grandfathered or quiz-less previous lecture never locks the next one.
- **A locked lecture page** shows no video, and puts nothing in the frame. It shows one card:
  - "Pass the quiz for ‹previous title› first";
  - a primary button to that lecture's quiz;
  - its kicker and title.
- **The dashboard's Next card.** When the next scheduled lecture is locked, it points at the blocking quiz ("Quiz: ‹title›").
- **Calendar blocks** for locked lectures show a lock glyph and stay links to the lock card.
- **The lock is derived, never stored.**

### 5. The lecture page after "watched" (mockups)
- **Watching collapses the video.** Once marked watched, it becomes the slim "✓ Watched · N min · Rewatch" bar. Rewatch re-expands the video in place; it is a foreground action.
- **The quiz mounts directly under the watched bar,** in mastery mode, when it isn't passed yet. The header reads "Lecture quiz · From this lecture only · Question i of n", with the segment bar. The note under it says misses come back until you get them and the first-try score is kept.
- **Rewatch from the explanation.** When a missed question has `at`, its explanation offers "Rewatch from m:ss", which seeks the player using the existing resume mechanism.
- **On pass,** the "Lecture passed" card appears ("n of n · f right on the first try · counted for today"), with a primary "Next lecture →" (or "Back to today" at the end of a course).
- **The rail:**
  - Today's ring counts only cleared lectures, with the line "A lecture counts once its quiz is passed".
  - "Next in ‹course›" shows the lock card until the quiz is passed.
- **Go deeper (optional)** appears after a pass, as three tiles:
  - **Sketch it:** opens the sketch pad of this lecture's first concept. It is hidden when the lecture has no concepts.
  - **Recall it cold:** the existing 3-minute recall, gate 1.
  - **Practice problems:** the course's practice link and the counter, gate 3.
- **The four-gate "Prove it" card** moves under a disclosure in Go deeper ("Prove mastery · 4 gates"). `lessonGates()` and `lessonCanVerify()` are untouched.
- **The summary** stays below, collapsed under its heading. Its "Check yourself" button is removed when the lecture quiz exists (the quiz *is* the check).
- **Before "watched",** the page is as it is today: video, Mark watched, and the summary collapsed.

### 6. Catch-up
- Expose `catchUpQuizzes()`: lectures that are watched, have a quiz, are not passed and are grandfathered, in course order. T-045 lists them on Problems.
- Taking one of these quizzes records a pass like any other. It never changes past day colours, because grandfathered lectures already count.

## Rules
- A render is a read.
- Nothing fixed sits over text.
- Controls are 44×44 or larger.
- Contrast is 4.5:1 or better in Dark and Light.
- Tokens only.
- Bump every `?v=`.
- **Do not touch:** `platform/data` (no curriculum change), `CLAUDE.md`, `loop/config.md`, `progress/` or `docs/CONTENT-STANDARD.md`.
- No dependencies.
- **Reloads in gates** go through `tools/lib-reload.js`.

## Acceptance criteria
1. **verify-flows** at 390 and 1280:
   - mark a fixture lecture watched;
   - the quiz mounts;
   - answer one question wrong and the rest right;
   - the missed question returns with its options reshuffled;
   - the pass card shows `firstTry = n−1`;
   - the record is stored once;
   - the dashboard ring and today's day status count the lecture only after the pass;
   - the next lecture is locked before the pass and opens after it;
   - Next lecture navigates;
   - nothing is written at render.
2. **verify-logic:**
   - `schedDone`, `dayStatus` and `backlogCount` with gated, grandfathered and quiz-less lectures;
   - every existing invariant still holds;
   - the streak is unchanged.
3. **verify-sync-loop:**
   - a pass on device A survives a merge with device B's further-along copy (verified, without a quiz);
   - the earliest `passedAt` and the best `firstTry` win;
   - the lock and dashboard state follow the merged pass.
4. **verify-design** at 1440 and 390, both themes:
   - the quiz card, the pass card, the lock card and the Go deeper tiles;
   - only one primary per state;
   - the watched bar's Rewatch is 44px or larger.
5. **Plants, each exiting 1:**
   - (a) a miss is not re-queued;
   - (b) `schedDone` ignores the quiz;
   - (c) the merge drops a pass;
   - (d) the lock reads a stored flag instead of deriving;
   - (e) the quiz record is written during render.
6. **All gates green,** run one at a time, plus clip under `TZ=America/Los_Angeles`.
7. **Screenshots** at 1440 and 390, Dark and Light, for each state: before watched, quiz after a miss, passed with Go deeper, the locked page, and the dashboard pointing at a quiz.
