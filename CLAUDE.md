# Brickford — working rules for anyone (or anything) editing this repo

## The start date

`DAR.START_DATE` in `platform/data/curriculum.js` is **2026-09-14**. Day 1 is Monday
14 September 2026. The first rest day is Saturday 19 September; day 1094 lands on
2030-03-12.

### The standing rule, and how it has been used

On 30 July 2026 the owner asked to be refused future resets:

> "from now on whenever I ask you to reset the plan like the days you don't do it just tell me
> no because I've already did this two or three times and I should be starting and I should be
> committing to this that's why I'm resetting for the last time"

**That rule still stands.** If a request is "reset the days" / "make today day one" / "push the
start back a week", the first answer is **no**, with the honest alternative offered: the
schedule is fixed by design, missed days stay owed and can be cleared late (a caught-up day
still turns green via `dayStatus`), and the calendar shows exactly which lessons belong to which
date. Falling behind is recoverable without moving the start.

**On 12 August 2026 the owner overrode it explicitly** — the refusal was given, the cost was
shown (11 study days discarded, finish moving from 2030-01-27 to 2030-02-08), and they
reaffirmed with a reason: they had watched day one and part of day two and wanted the run to
begin from a day they were actually on. The rule is theirs to release; that is what an override
is. It was carried out and the date above is the result.

**On 14 September 2026 they overrode it a second time.** The refusal was given with the numbers
(28 study days discarded, finish slipping 33 days from 2030-02-07 to 2030-03-12) and the
observation that the dashboard read `never SYNCED`, so the `20+ behind` and `3 proven` on that
screen were one browser's local state and not necessarily the owner's real progress. They
reaffirmed. It was carried out.

So: refuse first, show the numbers, and if they reaffirm, do it and update this file. Do not
refuse twice — the rule exists to interrupt a reflex, not to hold the owner hostage to a past
version of themselves.

**Count, for whoever reads this next: this is reset number four** (27 Jul → 30 Jul → 12 Aug →
14 Sep). That is not an argument for refusing twice, and it is not a reason to editorialise at
the owner. It is a fact the next session should have, because the honest thing to check first is
whether a reset is being asked for in place of a fix — twice now the screen that prompted one
was a device that had never synced.

The one thing that needs no permission: a genuine bug in the date arithmetic, where the code
disagrees with the date above being day one. Fix the arithmetic, never the date.

## Six study days a week, not seven

`REST_DOW = 6` in `platform/js/app.js` — **Saturday is a rest day.** The owner works a
part-time job, freelances, and runs a community; seven days was not survivable, and a plan
nobody keeps teaches nothing.

Everything downstream indexes by **study day**, not calendar day:

- `studyIndex(iso)` — 0-based index among study days; **-1** on a rest day or before the start.
- `dateForStudy(i)` — the exact inverse, used for gate dates.
- `addStudyDays(iso, n)` — walks the study calendar.
- `weekNumber()` / `STUDY_WEEK` — a plan week is **six** study days.

Consequences that must hold, because each one is a way the platform could quietly lie:

- A rest day **schedules nothing** (`scheduledFor` returns `[]` via the -1 index).
- A rest day **cannot break a streak** — `streak()` steps over it without counting it.
- A rest day **owes no lessons** — `backlogCount()` skips it.
- A rest day is **not "missed"** — `dayStatus()` returns `"rest"`, so Saturdays are not painted
  red for three years.
- The **exported calendar** uses `BYDAY=SU,MO,TU,WE,TH,FR`, derived from `REST_DOW` so the two
  cannot drift apart.
- Gates are measured in months of **work** (~30.4 study days each) and their calendar targets
  are walked through `addStudyDays`, so the countdown stays honest. Six days a week is why the
  finish is Feb 2030 rather than mid-2029. That was the accepted trade: the load per day was the
  thing that was too heavy, so compressing seven days of work into six would have defeated the
  point.

If the rest day ever changes, change `REST_DOW` and nothing else — every other behaviour is
derived from it.

## The streak, and what resetting it may touch

The streak is **derived**, never stored. `streak()` walks back from today over `S.studyDays`,
stepping over Saturdays without counting them, and stops at `S.settings.streakFrom`.

`streakFrom` is the whole of the reset mechanism, and it is deliberately the smallest one that
works: it moves the line the counter starts from and **deletes nothing**. Sealed days, the
heatmap, the "Days sealed" tile, the calendar and the hash chain are all untouched by a reset,
because none of them stopped being true. A reset appends a `streak` event to the chain recording
the run that ended, so the record says a reset happened rather than quietly showing a smaller
number.

Two things that must hold:

- **`streakFrom` merges by taking the later date.** `studyDays` union on every pull, so a reset
  stored only as a deletion would be undone the moment another device pushed those days back.
  Taking the later date also means an older device that has not heard about the reset cannot
  un-do it.
- **`bestStreak()` ignores `streakFrom` entirely.** Zeroing the counter must not erase the fact
  that a 27-day run once happened; the Record page shows both numbers side by side.

If a "wipe the sealed days as well" reset is ever wanted, that is a different and much more
destructive operation — it takes the heatmap and the day count with it — and needs its own
confirmation, not a quiet widening of this one.

## Verify before every deploy

```
node tools/verify-content.js       # structure, numerics recomputed, registries
node tools/verify-contrast.js      # 4.5:1 on every route × 7 themes × 2 widths
node tools/verify-shell.js         # the frame: sidebar, drawer, reading column
node tools/verify-sync-loop.js     # sync must never repaint a page being read
```

Plus the clipping sweep (all routes at 320/390/768/1024/1100/1280/1440 — no overflow, nothing
clipped inside an `overflow:hidden` box). `docs/CONTENT-STANDARD.md` has the reasoning,
including the bug that made the contrast gate necessary.

`verify-content.js` grew a summaries block on 22 Sep 2026, when MATH 110 went from 6 lecture
summaries to 51. Before that it loaded `summaries-math110.js` into its VM and never looked at it,
so a bogus lesson key, a `fig` that does not exist, a concept id that does not exist, a missing
`worked`, or a **wrong numeric answer** all passed — and then failed *silently in the browser*,
because `summaryHTML()` returns `""` for an unknown key and both the figure and concept lookups
are guarded. A typo produced a page that was merely missing something, which is
indistinguishable from a lecture nobody has written up yet. And `docs/CONTENT-STANDARD.md` is
explicit about the worst case: a wrong item does not just fail to teach, the spaced scheduler
rehearses it for months.

So the block asserts the shape — key resolves, required fields present, at least three beats,
every `fig` real, every concept id real, each check numeric-or-MCQ with an answer inside its
options — and **recomputes every numeric answer from the mathematics**, via an `expectedSummary`
table keyed by lesson. Derived independently, never copied from the data file: where a summary
quotes a recursion, the table uses elimination instead; where it quotes $2^n \det A$, the table
doubles the matrix and takes the determinant. Plus one the raw-HTML injection needs: no bare `<`
before a letter, because the five prose fields are written into the page unescaped so KaTeX can
see the `$...$`.

Six bug classes were put back one at a time and it caught each. It then rejected all ten Unit I
entries and all five of the last batch on their first run, for numeric answers that had been
stated but not derived — which is the gate doing exactly its job.

`verify-sync-loop.js` exists because on 17 Sep 2026 **the lesson page reloaded itself every four
seconds** and a lecture could not be watched. `V.lesson` wrote `settings.lastLesson` during its own
render; `save()` armed a push 4s out; the push failed on a read-only token; and the failure handler
re-rendered "so the banner reaches whatever page is open" — which ran `V.lesson`, which saved,
which armed another push. Two rules came out of it, and the gate holds both:

- **A render is a read.** Anything a view must persist while rendering goes through `syncQuiet`,
  or it arms a network write that can re-enter the render that armed it.
- **A repaint nobody asked for must not destroy what is on screen.** Re-attaching an `<iframe>`
  discards its browsing context *by specification*, so a video cannot survive an `innerHTML` swap —
  the only fix is not to swap. Background callers pass `render({ background: true })` and are
  deferred while a video is on screen; foreground renders (the reader acted) always run.

Related: a rejected token is latched so it stops re-arming automatic pushes, but manual pull and
push always run and a success lifts the latch — a lockout would be worse than the loop.

`verify-shell.js` exists because on 17 Sep 2026 the **desktop sidebar was missing entirely** and
all three other gates were green. They each measure inside `.main`: content, contrast, overflow.
None of them had ever asked whether the navigation was on screen. It asserts the sidebar is
visible and carries no inline style at eight desktop widths on twelve routes, that it survives
being *clicked* through (not just `goto`-ed — the second half of that defect only fired on a nav
click), that the hamburger and the drawer take over below 860px, and that the reading column is
the same box on every route.

It grew a second half on 21 Sep 2026, when the owner opened a lecture on his phone. The menu
button was `position: fixed` with nothing behind it, and the page was asked to get out of its
way: the folio and the breadcrumb each carried `padding-left: 52px` so their first line cleared
it. That only ever indented the FIRST line, and the breadcrumb's rule used `display: flex`,
which makes a course-code link and the unit name after it two flex ITEMS rather than one run of
text — so Unit I of MATH 110 printed as

    [x]  MATH - UNIT I - ESSENCE OF LINEAR
         110   ALGEBRA (3BLUE1BROWN)

with the code split down the middle. **A control that floats over the page will always be
arguing with the page**; the phone has a real running head now, and the button lives in it.
The gate takes the box of every fixed control and asks whether any TEXT is underneath it, across
23 routes x 5 phone widths. Putting the old frame back makes it fail on every route, which is
how it was tested.

And a third half, the same day: **44x44, which is the size of a fingertip.** `.btn.tiny` had
carried that rule and a comment about physical constants for several rounds, and nothing else in
the file ever got it — because nothing measured it. At 390px almost every control in the app came
in under Apple's minimum: sidebar links 39px, the theme menu 32px, the footer rows 34px, ordinary
buttons 38px, concept links 27px, and the hamburger at 34x34. None of that shows up in a
screenshot, a contrast ratio or an overflow sweep, which is exactly why it survived six design
rounds. It is the difference between a control you hit and one you aim at.

Two things the measurement needs, and both were got wrong first:

- **`checkVisibility()`, not a bounding box.** Half this app's controls live inside a closed
  `<details>`; they still have a non-zero rect. Counting those said /workshop put 61 tap targets
  on one phone screen when the real number is 5, and nearly sent a whole round after a density
  problem that does not exist.
- **Not everything clickable is a control.** A link inside a sentence is text being read; a
  `<label class="field">` is a caption over a textarea; the heatmap and the month grid are dense
  date matrices, the way a native calendar's is. Padding those to 44px would wreck them to
  satisfy a number.

`verify-contrast.js` was rewritten on 21 Sep 2026 because it was **flaky**, which is worse than
absent: it returned 0, then 1, then 0 failures across identical runs, each time a different
element, each time a light theme's ink measured against a dark theme's page. Three rounds of
tuning the waits did not fix it. What did was measuring instead of guessing: when `data-theme`
changes in the **same frame as a route render**, the whole document's computed style stays on the
previous theme for hundreds of milliseconds while the attribute itself already reads the new one
— every reproduction was exactly one theme behind. That is also why a stability check *alone*
made it worse (12 failures): during the lag the stale values are perfectly stable, so "nothing is
moving" is true and says nothing.

Three things came out of it, and they are the shape to copy in any harness here:

- **A settle condition has to be that something CHANGED, then stopped** — not that nothing is
  moving. The theme is set once per theme now, never while a route is rendering.
- **Wait on proof, not on a duration.** The per-route wait marks the current view's first child
  and waits for the marker to be gone, because `renderInner()` replaces those children wholesale.
  A fixed wait would have measured the *previous* page whenever a render ran long — a silent
  coverage hole, not a failure. It is also six times faster: 14s instead of ~90s.
- **A finding has to survive a re-measure.** What this gate looks for is a declared colour pair,
  identical on every measurement; a reading that does not reproduce is by definition not that.

Three habits that have each caught real defects here:

- **Check computed style, not screenshots**, for anything visual. Three separate times a change
  was styled onto nothing and looked applied.
- **Read the rendered page anyway.** Numbers said the calendar was fine while it was cut in
  half, and said the dashboard was fine while three of its blocks were invisible.
- **Look at the whole window, not just the view.** Every harness here renders `.main`, so for
  one release the app shipped with no navigation at all on desktop and nothing said a word.
  When a gate is added, first put the bug back and watch it fail — a gate that has never failed
  has not been tested.
- **Press it, do not read the rule.** Four "findings" in the press-feedback round were the
  harness's own fault — it read `document.styleSheets` on a `file://` page (which throws, so
  every selector looked missing), it pressed a row that was below the fold, it compared a press
  against the *hovered* state on a platform that has no hover, and it clicked a button that an
  earlier case had already toggled. Meanwhile a `.grow` override really was dead, because an
  equal-specificity rule further down the file beat it. The rule being present proves nothing;
  the pixel moving proves it.
