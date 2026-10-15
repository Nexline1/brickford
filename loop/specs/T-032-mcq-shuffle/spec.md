# T-032: multiple-choice answers are not where they were written

Source: owner, 2026-10-08: "In the multiple-choice questions, the correct answer is always the first option. I subconsciously pick it straight away."

Measured on main (13105f7) across 531 multiple-choice questions with 4 options: the written answer slot is A 103, **B 393 (74%)**, C 34, D 1.
- Every summary file puts the answer at B in about 95% of its questions.
- `quiz-zero-to-hero` has 37 of 40 at A; `quiz-dsa` has 29 of 30 at A.
- `DAR.Quiz.mount` (`platform/js/quiz-engine.js`) shuffled the question order but never the options.
- No option refers to its own position ("all of the above"), so shuffling is safe.

## Change
- `DAR.Quiz.mount` presents each question as a copy with its options shuffled on every sitting. The answer index follows its option through the permutation.
- The banks are never modified. Results are reported by bank index, as before.
- This one function renders every exam, drill, summary check and concept probe.
- Every `?v=` token is bumped.

## Acceptance
1. **verify-flows (k):**
   - every multiple-choice question in every bank, summary and concept probe is mounted alone 8 times;
   - the answer slot is uniform within 5 points for each option count with at least 200 mounts;
   - choosing the right option is graded right, and a wrong one is graded wrong with the right one marked, for every question;
   - no page errors.
2. **Plant:** the identity permutation must make verify-flows exit 1.
3. **All gates green.**
