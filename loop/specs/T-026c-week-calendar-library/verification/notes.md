# T-026c verification notes: deviations from the mockups and the spec

Mockups: `loop/design/specimen-week.png`, `specimen-calendar.png`, `specimen-library.png`
(read on the `claude/brickford-journey-reset-47t19n` checkout, not copied here).

## Week (`V.review`)

1. **DSA solved is the running total**, `dsaCount()`, as the stored `dsa` field always was
   ("Total DSA problems solved (cumulative — auto-filled from CS 150)"); the dashboard draws it
   as "DSA over time". The spec says "DSA solved: auto, from CS 150" and, unlike the lectures
   and BHD tiles, not "this week". Changing it to a weekly count would change what an existing
   stored number means. One line to flip if the owner wants the week's count instead.
2. **"Lectures proven this week" is shown, not stored.** The spec's "the four numbers plus the
   two texts" is read as the stored week, `{ week, date, shipped, dsa, posts, revenue, notes }`;
   adding a `lectures` field would be a changed shape (plant d). The Seal handler is
   byte-identical; the counted values reach it through the input ids it always read
   (`#rvDsa`, and `#rvRev` when counted, as hidden inputs).
3. **BHD earned is counted when at least one Treasury entry is dated inside this plan week**
   (its first study day to its last, so the Saturday between them is inside); with none, it is
   a typed field. The spec's "where entries exist" read as entries in the week.
4. **Typed tiles say "tap to edit"** in `--ink-3` under the label. The mockup's posts tile has no
   third line; without one an editable number looks the same as a counted one.
5. **The empty "Past weeks" row is faded by ink and a dashed edge, not opacity.** The mockup
   fades weeks 2–4 with opacity .5/.35/.2, which puts text under 4.5:1 where verify-contrast
   cannot see it. The four places are this week and the three after it.
6. Past-week cards: newest first by week number; the shipped text is cut at 60 characters in
   JS (a CSS line-clamp would be a clip to verify-clip); a week with nothing shipped says
   "nothing shipped" in `--bad`, as the register did; numbers as "DSA n · n posts · BHD n", each
   number kept with its unit.
7. The two questions are one-line inputs, as in the mockup. The old notes field was a textarea.
8. The state line uses the plan week's last study day ("Opens Sunday 25 Oct · 5 days"; Sunday
   under the current start, derived rather than assumed), "Ready to seal" on it, "Sealed 20 Oct"
   once sealed. Seal stays enabled throughout, as the current rules allow an early seal.
9. The line under the h1 uses a typographic apostrophe ("didn’t").

## Calendar, below the month grid (`dayDetailHTML`)

1. **‹ Today › are the day's own controls.** The spec says "the existing ‹ Today › controls";
   the existing ones are the month grid's (previous month / Today / next month), and the grid
   must stay exactly as it is, so they were not moved. The day header has a T-026a `.seg`:
   ‹ and › step the selected day (never before day 1; ‹ is disabled there) and the grid
   follows into the next month; its Today is the grid's own `data-cal-nav="today"`.
2. The day name is an `h2`: the page's `h1` is the folio "Calendar" (verify-design measures any
   other visible `h1` as the large title).
3. **Kept from the old summary card**, under the bar: the week's focus line (the only place the
   app shows it), the catch-up note on a missed or part-done day, and the gate note on a gate
   day. The spec lists what to remove and these are not on it; the mockup's day shows none of
   the conditional ones. The status pill and the "Progress · x of y lessons · n problems ·
   sealed" line are gone: the header line and the bar say it.
4. Non-lecture blocks (problem sets, the project block, frontier work) are blocks too, with a
   neutral `--line-strong` bar and a muted kicker; they have no faculty.
5. A rest day shows "Nothing is scheduled and nothing is owed. The streak is safe." The old
   fallback offered a "Project work" row on it. The bar is hidden when a day has no lectures.
6. Habit lines follow the mockup: "45 min · NeetCode" (or "all 150 done"), "10 min" (with
   "· N missed" when the pool has any), "30 min · one post", "this week’s build", and on a
   Sunday "Seal the week · 30 min · Week N", the fifth routine the page already had. The old
   Practice row named the next two problems; that is dropped.
7. **Found and fixed:** `weekRowFor` read a Saturday's study index (-1) as day 0, so every
   Saturday's day view said Week 1 and showed Week 1's focus. It now takes the study day before
   it (weekNumber's rule). Its only caller is this view; a check fails without the fix.
8. `pseudoRowHTML` is removed: this view was its only caller.

## Library (`V.library`)

1. The Handbook's line is "How Brickford works, end to end": the mockup's "· 12 min read" is a
   reading time nothing measures.
2. Card titles and lines are the mockup's, from `DOC_CARD`; `DOCS` is unchanged, so each
   document's own page still heads itself with its long title. "Progress Log (file)" keeps its
   title and its superseded note, in `--ink-3`.
3. Guides are four cards (the mockup draws three), because the Progress Log is one of the
   remaining documents (spec item 13). At 1440 that is a row of three and one under it.
4. Links: the mockup's five first (MIT OpenCourseWare, 3Blue1Brown, Karpathy, NeetCode, fast.ai),
   then the rest; "Karpathy — Zero to Hero" is "Karpathy" as in the mockup. The four labelled
   groups (Video courses, Books, Problems & lectures, Source) are gone with the fold.
5. The chips are T-026a's `.at-chip` (a `--surface` fill), not the mockup's outlined pill, as
   the brief asks for reuse. "+N" hands the focus to the first link it reveals.
6. The Handbook's `--accent` edge is an inset box-shadow, so nothing outside the card can clip it.
7. Two columns between 600 and 1023px, as T-026b's cards.

## All three

- The heredoc and edit tools wrote some `\u` escapes as literal UTF-8 glyphs (·, —, ’, …, ↗, ✓);
  the file already uses literal glyphs. No-break spaces are written as ` ` escapes.
- The clip baseline shrank 815 -> 801: the 14 `/calendar` entries at a 24px root on 320/390
  (T-003) came from the old day summary's unwrapped pill row and no longer occur.

## Screenshots

`screenshots/{review,calendar,library}-{1440,390}-{dark,light}.png`: verify-design's seed plus
`T26C_PATCH`, the clock pinned to Tuesday 20 Oct 2026 12:00 UTC, the viewport grown to the
page's height so each page is one frame (the phone's fixed Next bar and tab bar sit at its foot).
