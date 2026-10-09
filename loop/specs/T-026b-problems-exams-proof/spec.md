# T-026b: Problems, Exams and Proof say what they are for

Source: owner, 2026-10-07.
- "The problems part, I don't see it clearly either. What am I supposed to do here?"
- "The exams too, it just looks like the Atlas and courses. The proof too."

The owner approved the mockups `loop/design/specimen-problems.png`, `specimen-exams.png` and `specimen-proof.png` ("Yes, all three"). Build them on the T-025 theme, after T-026a, reusing T-026a's page header, tile, ring and chip CSS rather than adding parallel rules.

## Shared rule for all three pages
- **Header:** an `h1` with the page name, then one line (12 words or fewer) saying what the page is for. Use the exact lines from the mockups.
- **Above the fold:** the one primary action is visible at 1440×900 and at 390×844.
- **Tokens only.** Contrast of 4.5:1 or better in both themes. Controls are at least 44px.
- **A render is a read.**

## Problems (`V.workshop`)
1. **Three mode cards in a grid** (3 columns at ≥1024px, 1 below 600px):
   - **Daily drill**: the existing random-drill entry, "10 min", a "Start" filled button (the primary).
   - **Problem sets**: "x of 34 done"; "Open" goes to the problem-set section (anchor or disclosure).
   - **Labs**: "x of 20 shipped"; "Open" goes to the labs section.
   - Each card has a small glyph tile, a title and a one-line description, as in the mockup.
2. **"This phase's labs"** is a rounded list.
   - Each row has a checkbox, the title, a short description and "~N h" on the right.
   - The description is the existing lab description cut to its first clause, at most about 50 characters. No ellipsis mid-word.
   - Toggling a row works exactly as the checkbox does today, with the same state and the same `save()`.
3. **Other phases' labs and the problem sets** stay behind their existing disclosures, under the list.
4. **Remove** the separate stat box "0/20 labs shipped · 0/34 problem sets": its numbers now live in the cards.

## Exams (`V.exams`)
5. **Hero card for the next exam** (the current lead):
   - a course tag in the faculty colour with "· GATE n" when it is a gate exam;
   - the title;
   - facts: minutes, pass mark, and "x of y lectures watched";
   - a readiness bar in the faculty colour, showing watched ÷ total lectures for that course;
   - on the right, a big "days to the gate" number when a gate applies;
   - "Sit it" as the primary button.
6. **"Also open"** is a grid of cards (3 columns at ≥1024px), each with a tag, a title and its minutes and pass mark. Each links as today.
7. **"Unlock by watching"** is a 2-column grid of compact locked rows:
   - a lock, the short exam name, and a progress bar of the lectures watched toward unlocking;
   - show at most 6, then "+N more" which expands.
8. **The "Record" group** (Diagnostics sat, Concept banks attempted) becomes a single muted line under the header: "4 diagnostics · 7 concept banks · 0 sat".

## Proof (`V.record`)
9. **Three stat tiles:** current streak, longest streak, and lectures proven, each with a big number. They use the existing `streak()`, `bestStreak()` and count.
10. **"Sealed days":** the existing heatmap data, drawn as a grid of rounded cells in weekday rows over the last 26 weeks.
    - Fill levels come from the existing logic.
    - Rest days stay as they are today.
11. **"Latest seals":**
    - The newest chain entries, at most 4, as small blocks: the lesson code, then a short hash (`#xxxx…xxxx`).
    - Each block is joined to the next by "←".
    - Genesis is shown faded when it is reached.
12. **The links** "Transcript & gates", "Verify a file" and "How it works" become pill buttons at the bottom.
    - "Reset the streak counter" stays reachable and keeps its confirmation.
    - It goes at the end of the pill row with its danger colour.
    - It is never the primary action.

## Out of scope
- New data.
- The drill engine, the exam engine and the hash chain itself.
- Other pages.
- PROTECTED paths.
- New dependencies.

## Acceptance criteria
1. **verify-design, 1440 and 390, both themes:**
   - **Problems:** 3 mode cards, with Daily drill holding the only filled primary; the labs list matches the phase labs count; a lab toggle saves exactly as before (verify-flows covers it).
   - **Exams:** the hero exists with tag, facts, bar and Sit button; the bar width equals watched ÷ total within 1%; also-open cards = n; locked rows are capped at 6 plus "+N".
   - **Proof:** 3 tiles whose numbers equal `streak()`, `bestStreak()` and the proven count; heatmap cells = 26×6 (rest days handled as today); seal blocks ≤ 4; the reset control exists and is not the primary.
2. **Every route's primary action is inside the first viewport** at 1440×900 and at 390×844.
3. **Plants, each exiting 1:**
   - (a) the Problems drill card loses its primary;
   - (b) the Exams readiness bar uses mastery instead of watched;
   - (c) Proof shows the best streak in the current-streak tile;
   - (d) the heatmap paints rest days as missed.
4. **All gates green on the final bytes**, with the clip baseline only shrinking.
5. **Screenshots** of the three pages at 1440 and 390, in Dark and Light.
