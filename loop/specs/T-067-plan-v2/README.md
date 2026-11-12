# Plan v2 — the audit, in one page

Nothing in the app has changed yet. This is the audit you approve before step 2.

## What stays, what goes

- **Almost everything stays.** Of 494 lectures, 483 are core.
- **10 are optional.** Optional means "not scheduled". You can still watch them, and they still count.
  - Pure exam reviews: 18.01 Exam 1 review, Stat 110 midterm review, three 8.01 reviews. Your practice problems will do their job.
  - Karpathy's "Intro to LLMs". It is the short version of his "Deep dive", which you keep.
  - fast.ai 6 and 7 (random forests, recommendations). No path here needs them.
  - Walter Lewin's memoir and his farewell lecture. Inspiring, but not new physics.
- **1 is a true duplicate.** MATH 210 lecture 8.2 repeats lecture 5.3 with the same example.
- **Two paper lessons re-use videos you already watch** (GPT-2, Mixtral). They become reading and coding only.
- **One data error found:** the ResNet lesson plays the AlexNet video. Step 2 fixes it.
- The cut is small on purpose. Your goal needs the full math and physics.

## What is added

- **A Python bridge (CS 100), about 8 weeks.** CS50P by David Malan, your CS50 teacher. Ten lectures, each with real problem sets and an automatic checker. Then one NumPy hour and one PyTorch tensors session.
- **No-code AI lectures on Fridays** during the bridge: 3Blue1Brown on transformers and attention, then Karpathy's "Deep dive into LLMs".
- **Karpathy again, from Micrograd, typing along.** About 30 minutes of video a day. After each lecture: rebuild it without the video.
- **A short multivariable unit** (7 videos, about 1.3 hours): partial derivatives, gradient, chain rule, Jacobian, double integrals. Makemore 4 and MATH 210 need it.
- **Proposed later courses, for you to approve:**
  - MIT 18.02 Multivariable Calculus (35 lectures, ~29 h)
  - MIT 18.03 Differential Equations (33 lectures, ~27 h)
  - MIT 8.02 Electricity and Magnetism, Walter Lewin (36 lectures, ~30 h)
  - Stanford Statistical Mechanics, Leonard Susskind (10 lectures, ~17 h)
  - Also named, not scheduled: statistics (MIT 18.650), quantum mechanics (MIT 8.04), algorithms lectures (MIT 6.006), convex optimisation (Stanford EE364A).

## Your new day

Six days a week, about 5 hours.

| Block | Time | What |
|---|---|---|
| Math & Physics | 1 h 30 | one lecture with notes |
| AI / Python | 1 h | the bridge, then Karpathy; Fridays: a no-code AI talk |
| Storytelling | 40 min | unchanged |
| Practice | 2 h | 75 min coding, 45 min math problems and one written answer |

Every lecture now comes **after** the lectures it needs. Examples: Python classes before Micrograd. Matrix multiplication and conditional probability before the bigram model. Integrals before Stat 110's continuous part. Calculus before physics.

## The first weeks (from Sunday 22 Nov 2026)

- **Weeks 1–8:** CS50P lectures 0–9, then NumPy and PyTorch. Alongside: 18.06, 18.01, Stat 110 and the multivariable unit. Physics starts 22 Dec, right after the calculus it needs.
- **Week 9 (18 Jan 2027):** Micrograd again, typed along. Then Makemore 1–5, Build GPT, the tokenizer, GPT-2.
- **7 Mar 2027:** Zero to Hero done. Then fast.ai, the papers, systems, CS336, research.

The full day-by-day table is in `sequence.md`.

## The dates (computed by the app, not guessed)

| | Old plan | New plan |
|---|---|---|
| Karpathy finished | 26 Nov 2026, with no Python | 7 Mar 2027, after the bridge |
| Last lecture | 17 Jan 2028 | 2 Sep 2027 (5 Dec 2027 with the four added courses) |
| 16th paper rebuilt | 11 Jun 2028 | 26 Apr 2028 |

**Option A:** lectures sooner. The gates and the finish (15 Apr 2030) stay the same.

**Option B:** gates shortened too. The finish moves to 25 Jan 2030, **80 days sooner**. That is all it buys, because the last gate is 18 months of getting hired or earning revenue, and studying faster cannot shorten that. B also squeezes gate 3 (six papers and a merged open-source PR) from 6 months to 3.3.

**My recommendation: A.** Use the time you gain for the added physics and math, and for the papers and your first original result. If you pass gates early, the app moves the later gates forward by itself.

## What I could not check

The transcript tools did not work in this session (one needs an API key, the other failed on every video). YouTube and the CS50 site were blocked here. So the new video ids and lengths are **not verified**. A web search confirmed only CS50P lecture 0's id and two lengths. Before step 2 adds anything, every new video must be checked by transcript. To make that possible: give the Yt_T transcript tool a free API key (youtube-transcript.ai), or allow youtube.com and cs50.harvard.edu in the environment's network settings.

## Your decisions

1. **A or B?** I recommend A.
2. **Approve the optional list** above (10 lectures) and the one duplicate.
3. **MATH 110's four review lectures:** keep them (you said linear algebra stays unchanged), or make them optional like the other reviews?
4. **Approve the Python bridge:** CS50P, then NumPy and PyTorch, about 8 weeks.
5. **Approve the added courses:** 18.02, 18.03, 8.02, statistical mechanics. Any of the four extra ones too?
6. **Storytelling time:** keep 40 minutes a day (your earlier choice), or 30? 30 makes SPCH 100 take about a quarter longer.
7. **Allow the transcript check** (an API key or the two websites), so the new videos can be verified.

Files: `audit.md` (every lecture, with the reason), `python-bridge.md`, `prerequisites.md` and `prerequisites.json`, `sequence.md`, `dates.md`. Regenerate with `node tools/audit-lectures.js` and `node tools/plan-dates.js`.
