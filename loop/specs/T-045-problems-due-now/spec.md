# T-045: Problems shows what's due now

## Source
The owner, 2026-10-14: "even the problem sets and the labs in the problems section… I've never taken these. I'm not even sure what they are… reorganize and change how the quiz works, where the quiz appears, and/or reorganize everything here."

The approved mockup is `loop/design/specimen-problems-v2.png`.

## Depends on
T-043, merged. This item uses `catchUpQuizzes()` and the lock/cleared predicates from it.

## The problem today
- Problem sets (`DAR.PSETS`) and labs (`DAR.LABS`) are a catalogue tied to no lecture. Nothing says when they become relevant.
- The page opens on three catalogue cards ("Daily drill / Problem sets / Labs"), so it explains nothing.

## Scope

### 1. Data: when each item unlocks
In `platform/data/workshop.js`, a PROTECTED path named here and approved by the owner on 2026-10-14 with the mockup:
- Give every PSETS item and every LAB an `after`. It is the lesson key `<courseId>.<unit>.<lesson>` of the lecture that prepares for the item.
  - For a problem set, that is the last lecture its topics need, read from the course's own syllabus. For example, MIT 18.06 Pset 3 (vector spaces, nullspace) comes after the 18.06 lecture on the nullspace.
  - For a lab, it is the lecture that teaches what it builds. For example, "Micrograd from a blank file" comes after AI 200 "Micrograd"; "BPE tokenizer from scratch" after AI 200 "Let's build the GPT Tokenizer".
- Labs keep `phase`. A lab is due only once its `after` lecture is cleared **and** the plan is in that phase or later.
- Record the reasoning for every mapping in `verification/mapping.md`: item, `after`, and a line from the syllabus or lecture title that justifies it.
- **No other data changes.** Don't add, drop or rename psets or labs, and leave `curriculum.js` untouched.

### 2. The page (`V.workshop`, route `#/workshop`, sidebar "Problems")
- **Header:** `h1` "Problems", then "Only what's due now. Each item says what it is and why it's here."
- **"Due now"** shows a count. The rows, in this order:
  1. **Lecture quizzes waiting:** watched, gated, not passed. Then the catch-up quizzes from T-043, labelled "catch-up". Tag "Quiz". The why-line reads "‹course› · watched, not passed · n questions", plus "locks the next lecture" when it does. "Take it" goes to that lecture's quiz.
  2. **Problem sets:** their `after` lecture is cleared and they are not done. Tag "Problem set". The why-line reads "Pen and paper · unlocked: you passed ‹after title›". "Open" goes to the existing source link and the existing done toggle.
  3. **Labs:** due as defined above, and not shipped. Tag "Lab". The why-line is the lab's one-line plain description plus "Phase n · ~h". "Start" goes to the existing lab detail, with its criteria and proof URL.
  4. **Daily review** stays as one row: "Daily review · questions you missed, served back until they stick", linking to `#/drill`.
- **"How this works":** three short columns, matching the mockup's text, explaining Lecture quiz, Problem set and Lab.
- **"Coming up":** the next 3 locked psets and labs, muted, each with "After lecture n · ‹title›". Behind a disclosure, "Everything", the full catalogue as it is today.
- **Empty state:** "Nothing due. Your next lecture is ‹title›." with a link.
- **Don't change these:** `S.psets`, `S.labs` and their meaning, the lab and proof flows, and `#/drill`.

### 3. Dashboard
When anything is due, the Today card gains one line, "n due on Problems", linking to `#/workshop`. Nothing else on the dashboard changes.

## Rules
- A render is a read.
- Nothing fixed sits over text.
- Tap targets are 44px or larger.
- Contrast is 4.5:1 or better in both themes.
- Tokens only.
- Bump `?v=`.
- No dependencies.
- Reloads in gates go through `tools/lib-reload.js`.

## Acceptance criteria
1. **verify-content:** every pset and lab has an `after` that resolves to a real lesson. Each lab's phase is consistent with its `after` lecture's scheduled phase.
2. **verify-design** at 1440 and 390, in both themes, against fixtures that cover:
   - one quiz waiting;
   - one catch-up quiz;
   - one pset unlocked;
   - one lab due;
   - nothing due.

   Check that the rows, tags and why-lines are there, that "Coming up" has 3 rows or fewer, and that the empty state shows.
3. **verify-flows:** "Take it" opens the quiz. Passing it removes the row. "Open" on a pset and marking it done removes it.
4. **Plants, each exiting 1:**
   - (a) a pset shows before its `after` lecture is cleared;
   - (b) a lab shows before its phase;
   - (c) an `after` names a lesson that doesn't exist.
5. **All gates green**, run one at a time, plus clip under the LA timezone.
6. **Screenshots** at 1440 and 390, Dark and Light.
