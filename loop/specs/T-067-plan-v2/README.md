# Plan v2: the plan, in one page

Nothing in the app has changed yet. This is the plan you approved on 12 Nov, written out with the dates the app itself computes.

## What you decided

- **Speed: option A.** Lectures come sooner. The gates and the finish date do not move.
- **Cuts: all eleven approved.** Ten lectures are optional, and one is a duplicate. Optional means "not scheduled"; you can still watch them, and they still count.
- **The shorter Python bridge.** You already know variables, functions, conditionals and loops from CS50, so those three CS50P lectures are skipped.
- **MATH 110's reviews stay. Storytelling stays at 40 minutes a day.**

## The order

Every lecture comes **after** the lectures it needs. Python classes come before Micrograd. Matrix multiplication and conditional probability come before the bigram model. Integrals come before Stat 110's continuous part. Calculus comes before physics.

1. **22 Nov 2026 to 4 Jan 2027: the Python bridge.** CS50P lectures 3–9 (exceptions, libraries, tests, files, regex, classes, and the rest), then NumPy and PyTorch tensors. On Fridays: 3Blue1Brown on transformers and attention, then Karpathy's "Deep dive into LLMs". This takes about 6 weeks, not 5, because Fridays carry the talks.
2. **5 Jan to 28 Feb 2027: Karpathy again, from Micrograd, typing along.** About 30 minutes of video a day, then "rebuild it without the video".
3. **Then:** the papers, fast.ai alternating with MIT 6.006, systems (SYS 250), CS336 and research (RES 400).
4. **The math and physics line runs all along:** 18.06, 18.01, Stat 110 and 8.01 (8.01 from 20 Dec 2026), then MATH 210 alternating with 18.02, then 18.650, statistical mechanics, 18.03 and 8.02.

The full day-by-day table for the first 8 weeks is in `sequence.md`.

## Your day

Six days a week, about 5 hours.

| Block | Time | What |
|---|---|---|
| Math & Physics | 1 h 30 | one lecture with notes |
| AI / Python | 1 h | the bridge, then Karpathy, then the rest. Fridays: a no-code talk, later Missing Semester |
| Storytelling | 40 min | unchanged |
| Practice | 2 h | 75 min coding, 45 min math problems and one written answer |

No added course ever takes time from the 75 minutes of coding.

## What each added course is for

1. **MIT Missing Semester (about 10 h).** The shell, Git, Vim, debugging and scripting: the tools every lab and open-source project assumes. You need them before your first open-source pull request.
2. **MIT 6.006 Algorithms (about 19 h).** Why the NeetCode patterns work: analysis, hashing, trees, graphs, dynamic programming. You need it for interviews, and to read systems papers.
3. **MIT 18.02 Multivariable Calculus (about 28 h).** Gradients, Jacobians, multiple integrals, Green and Stokes. MATH 210, statistics, 18.03 and 8.02 all stand on it.
4. **MIT 18.650 Statistics (about 28 h).** How to go from data back to a model: estimates, tests, error bars, regression. Every experiment and every eval needs it.
5. **MIT 18.03 Differential Equations (about 26 h).** Equations of motion, oscillators, Fourier and Laplace. They are the language of physics, and of diffusion models.
6. **Stanford Statistical Mechanics, Susskind (about 17 h).** Entropy, the Boltzmann distribution, free energy. This is the physics under softmax, energy-based models and diffusion. It comes right after MacKay's information theory.
7. **MIT 8.02 Electricity and Magnetism, Lewin (about 30 h).** The second pillar of classical physics. Same teacher as your 8.01.

An added course counts as done only when its problem sets and one timed exam are done. If you are behind at gate 3: defer 8.02 first, then trim 18.03's Laplace lectures, then defer statistical mechanics. Never drop 18.02, 18.650, 6.006 or Missing Semester. The full list, and the courses deliberately left for later, are in `additions.md`.

## The dates (computed by the app, not guessed)

| | Old plan | New plan |
|---|---|---|
| Karpathy finished | 26 Nov 2026, with no Python | 28 Feb 2027, after the bridge |
| Last lecture | 17 Jan 2028 | 31 Jan 2028, with all seven added courses |
| 16th paper rebuilt | 11 Jun 2028 | 29 May 2028 |
| Finish (day 1094) | 14 Apr 2030 | 14 Apr 2030, unchanged |

**No gate moves.** Gate 3 is 16 Dec 2027; by then 9 of the 16 papers are rebuilt, and it needs 6. Gate 4 is 16 Jul 2028; by then every lecture and all 16 papers are done.

## The honest part

Lectures make you literate; they do not make you a scientist. What gets a self-taught person taken seriously is public, checkable work: reimplementations that reproduce the paper's numbers, merged PRs in libraries people use, and at least one original result written up clearly enough for a stranger to rerun. A Nobel is not something a curriculum can aim at; pick problems worth decades and let the rest follow.

## What still blocks step 2

- **The video ids are checked.** All 189 new videos were checked against YouTube itself: title, channel and length. 188 are verified. Two ids I had from memory were wrong and are now corrected. One video is missing: MIT 18.03 lecture 18 is not in MIT's playlist, so it needs another source.
- **The transcripts are not read.** The transcript tool needs a free API key (youtube-transcript.ai). YouTube's watch pages, which carry the chapter lists, are behind a bot check from this machine. Without transcripts:
  - the PyTorch "chapter 00" start and stop times cannot be fixed;
  - 18.03's Laplace lectures cannot be named exactly;
  - the practice problems in step 3 cannot be written from what each lecture actually says.
- **To unblock:** give the transcript tool an API key, or give this machine full youtube.com access (the watch pages too).

Files: `additions.md`, `audit.md` (every lecture, with its reason), `python-bridge.md`, `prerequisites.md` and `prerequisites.json`, `sequence.md`, `dates.md`. Regenerate everything with `node tools/audit-lectures.js` and `node tools/plan-dates.js`.
