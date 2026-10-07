# T-026c: Week, the Calendar's day view, and Library

Source: owner, 2026-10-07:
- "The week: what is all this about?"
- "The calendar is probably one of the best ... but below it ... where there's Math 130, AI 200, and CH 100, I think you can change the layouts here."
- "The library is the same thing."

The owner approved `loop/design/specimen-week.png`, `specimen-calendar.png` and `specimen-library.png` ("Yes, all four"). This item reuses the header, tile, chip and segmented-control CSS from T-026a and T-026b.

## Week (`V.review`)
1. **Header.** `h1` "Week N", then "Every Sunday: what shipped, what didn't. Seal it in two minutes."
2. **Four stat tiles:**
   - **DSA solved:** auto, from CS 150, with "counted for you".
   - **Lectures proven this week:** auto, "counted for you".
   - **Posts:** an editable number. Tapping the tile edits it.
   - **BHD earned this week:** auto, from the Treasury ledger where entries exist, "from Treasury". It stays editable if the ledger has none.
   - Auto values are computed at render. Nothing is written until Seal.
3. **Two question cards:**
   - "What did you ship?", which maps to the existing shipped field;
   - "What got in the way?", which maps to the existing notes/blockers field.
4. **Footer row.**
   - "Seal the week", the primary button. It uses the existing seal handler with the same stored shape: the four numbers plus the two texts.
   - On the left, the state: "Opens Sunday <date> · N days", or "Ready to seal", or "Sealed <date>".
   - Sealing early keeps whatever the current rules allow; the rules themselves do not change.
5. **"Past weeks".** A row of week cards, newest first, showing the shipped text (truncated) and the numbers. Clicking a card expands its notes. This replaces the register table.

## Calendar, below the month grid (`V.calendar`)
6. **The month grid, the legend and the .ics disclosure stay exactly as they are.**
7. **Selected-day header.**
   - The day name as a heading ("Wednesday 7 October").
   - Then "Day N · Week W · x of y done".
   - A slim progress bar.
   - The existing ‹ Today › controls, at the right.
8. **Lecture blocks.**
   - Each scheduled lecture is one block: a 6px left bar in the faculty colour, a kicker ("MATH 130 · THEORY"), the title, and on the right "46 min" over "lecture n" or "part p of q".
   - Each block links as today.
   - Done blocks show a check and muted ink.
9. **"Every study day".**
   - Habits as a 4-column tile row (2 columns on phone), each with a title and "min · detail".
   - The header shows the total time ("about 1 h 25").
10. **Remove** the old per-course group headers and the `.glist` rows they replaced.

## Library (`V.library`)
11. **Header.** `h1` "Library", then "The rules of Brickford, and the guides for each phase."
12. **"Start here":** Handbook, Method and Calibration Kit as document cards. Each has a page glyph, the title and a short description. The Handbook card has an `--accent` outline as the suggested first read.
13. **"Guides":** the remaining documents as the same cards, 3 columns (1 on phone). "Progress Log (file)" shows its "superseded" note as muted text.
14. **"Outside links":** chips with ↗, opening in a new tab with `rel="noopener"`. Show 5, then "+N", which expands.

## All three
- Tokens only; contrast 4.5:1 or better; controls 44px or more; a render is a read.
- Bump every `?v=` token.

## Acceptance criteria
1. **verify-design, 1440 and 390, both themes:**
   - **Week:** 4 tiles. The auto tiles equal the computed values at the pinned clock. Seal is the only primary. Sealing stores the same shape as before (verify-flows).
   - **Calendar:** the grid is unchanged; the existing calendar checks stay green and untouched. There is one lecture block per scheduled lecture, each with the faculty bar colour. The habit tiles equal the habits count.
   - **Library:** 3 start cards; guides equal the remaining documents; links are capped at 5 plus "+N".
2. **Plants, each exiting 1:**
   - (a) a Week auto tile writes state at render;
   - (b) a calendar block uses the wrong faculty colour;
   - (c) a Library link is missing `rel="noopener"`;
   - (d) Seal stores a changed shape.
3. **All gates green**, with the clip baseline only shrinking.
4. **Screenshots** at 1440 and 390, in Dark and Light.
