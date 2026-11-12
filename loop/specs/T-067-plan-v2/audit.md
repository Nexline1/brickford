# T-067 audit — every lecture, judged against the goal

**Goal (owner, 12 Nov):** AI scientist — a top-tier engineer in math and physics in computing — and a founder. So the full math and the physics stay core, computing engineering stays core, research craft stays core, Storytelling stays core. Only true duplicates and what no path needs are cut, and "cut" means the `optional` flag: nothing is deleted, an optional lecture stays watchable and counts if watched.

**How it was built.** `node tools/audit-lectures.js > audit-raw.txt` lists all 494 lectures and every candidate overlapping pair (TF-IDF cosine over title, takeaway and beats, within and across courses). Each pair was judged by hand; the judgements live in one file, `plan-data.js`, and `node tools/plan-dates.js` writes the table below from it. The raw script is reproducible (same output byte for byte on a second run).

**Honest limit.** 39 lectures have no summary (AI 200 Units I and III, AI 300, RES 400), so they were judged by title, source and position only. No transcript could be read this session (see `python-bridge.md`, "What could not be checked").

## What the pairs showed

- **True duplicates (marked).** `math210.0.16` repeats `math210.0.10`: same worked example (a = sin x, b = a/y, z = b + x), same sum-over-paths argument. Three AI 300 lessons re-use a video the plan already plays: `ai300.1.2` (GPT-2 paper) is the "Let's build GPT" video `ai200.1.6`; `ai300.3.1` (Mixtral) is CS336's MoE lecture `ai310.0.3`. Those two stay core as papers but are scheduled as reading and reimplementation only, with no re-watch.
- **A data defect found in passing.** `ai300.0.1` (ResNet) points at the AlexNet video `DAOcjicFr1Y`, the same id as `ai300.0.0`. Fix the video in step 2.
- **Overlaps that are NOT duplicates (kept core).** 3Blue1Brown and MIT on the same topic (eigenvectors, e, Taylor, Cramer): intuition first, then the algebra; two levels by design. The GPU cluster (`sys250.0.12`, `sys250.1.3`, `ai310.0.4`): three lecturers at three depths. Training tricks (`ai200.1.3`, `math210.1.1`, `sys250.0.6/0.9`): each pass is one level up and adds something. The autodiff cluster (`ai200.1.0`, `sys250.0.4`, `math210.0.10`): code, then a framework, then the mathematics.
- **Revision lectures.** Exam reviews re-teach rather than teach. Pure reviews are optional (`math120.1.6`, `math130.0.14`, `phys100.0.9/0.18/0.29`); the practice engine (step 3) does their job with problems. Reviews that carry new material stay core (`math120.1.22` derives the Gaussian integral √π; `math120.1.29` teaches polar area; `math120.1.34` teaches power-series operations). The four MATH 110 reviews stay core only because MATH 110 is unchanged by decision — **owner decision 1.**
- **Talks.** `ai200.2.0` (Intro to LLMs, 1 h) is the short version of `ai200.2.1` (Deep dive, 3.5 h): optional. `phys100.0.35/0.36` (Lewin's memoir and his last public lecture) are inspiration, not curriculum: optional.
- **fast.ai 6 and 7** (random forests, collaborative filtering): optional, as the plan allowed.
- **Integration techniques stay core.** The 10 Nov idea was to mark them optional; the 12 Nov goal overrides it: physics (8.01, and 8.02 if approved) and Stat 110 densities use substitution, parts and partial fractions constantly.
- **SPCH 100:** no near-duplicate. The strongest pair scores 0.28 and is a part-one/part-two lesson. All 170 core.

## Headline

| | Lectures | Core | Optional | Duplicate |
|---|---:|---:|---:|---:|
| Existing curriculum | 494 | 483 | 10 | 1 |
| Proposed: Python bridge, second pass, multivariable bridge | 28 | 28 | 0 | 0 |
| Proposed later courses (need approval) | 114 | 114 | 0 | 0 |

Optional: `math120.1.6`, `math130.0.14`, `ai200.2.0`, `ai210.0.5`, `ai210.0.6`, `phys100.0.9`, `phys100.0.18`, `phys100.0.29`, `phys100.0.35`, `phys100.0.36`. Duplicate: `math210.0.16`. Trimming saves about 11 hours of video (614 optional minutes plus the 65-minute duplicate) out of 320 hours, about 3.5% — as the goal requires, option A's speed comes from five hours a day and a better order, not from cutting.

## What the curriculum lacks for this goal

Proposals only; nothing is added to the data. Lecture counts and lengths are from the courses' published listings as I know them and were **not** checked this session — the transcript tools and the course sites were unreachable (details in `python-bridge.md`). Each must be checked by transcript before it is added, per `docs/CONTENT-STANDARD.md`.

| Gap | Proposal | Lectures | Hours | Why |
|---|---|---:|---:|---|
| Partial derivatives, gradient, Jacobian, double integrals (short, now) | Khan Academy multivariable calculus, the videos by Grant Sanderson (3Blue1Brown's author): 7 chosen videos as a new last unit of MATH 120 (`math120.2.*`) | 7 | ~1.3 | Makemore 4 and MATH 210 need gradients and Jacobians; Stat 110's joint densities need double integrals. Ids not chosen yet. |
| Multivariable calculus in full | MIT 18.02, Denis Auroux, Fall 2007 (MIT OpenCourseWare playlist) → MATH 140 | 35 | ~29 | Line and surface integrals, Green, Stokes, divergence: the language of electromagnetism and of any field theory. |
| Differential equations | MIT 18.03, Arthur Mattuck, Spring 2006 (MIT OCW) → MATH 150 | 33 | ~27.5 | Dynamics, oscillators, Laplace and Fourier: physics runs on ODEs, and neural ODEs and diffusion models do too. |
| Electromagnetism | MIT 8.02, Walter Lewin, Spring 2002 (same lecturer as PHYS 100) → PHYS 200 | 36 | ~30 | The second pillar of classical physics; needs 18.02. |
| Statistical physics | Stanford, Leonard Susskind, Statistical Mechanics (2013) → PHYS 300 | 10 | ~17.5 | Entropy, Boltzmann distribution, partition functions: the physics under softmax, energy-based models, diffusion and much of ML theory. Placed after MacKay's entropy lectures. |
| Statistics (inference) | MIT 18.650, Philippe Rigollet, Fall 2016 — listed, not sequenced | ~24 | ~30 | Stat 110 is probability; estimation, tests and regression are a separate course. A scientist needs it for every experiment. |
| Quantum mechanics | MIT 8.04, Allan Adams, Spring 2013 — listed, not sequenced | ~24 | ~30 | The next physics after E&M if the physics side grows; also the door to quantum computing. |
| Algorithms lectures | MIT 6.006, Spring 2020 — listed, not sequenced | ~21 | ~20 | CS 150 has the NeetCode 150 problems but **no lectures at all**; the problems teach patterns, not analysis. |
| Convex optimisation | Stanford EE364A, Stephen Boyd — listed, not sequenced | ~19 | ~25 | MATH 210 has Boyd's book chapters 2–3 as reading; the lectures are the full version. |

The first five rows are in `prerequisites.json` (MATH 140, MATH 150, PHYS 200, PHYS 300 under provisional keys) and in the "with additions" columns of `dates.md`. The last four are named for the owner to consider; they are not in any computed date.

**An honest note.** A self-taught route to science is judged on published work, not on lectures watched. The paper reimplementations (AI 300) and the first original result matter more than any lecture in this table. The gates already say this (gate 3: six reimplementations and a merged open-source PR) and they are kept. The Nobel ambition does not change this audit: it is reached, if at all, through original results, and the plan's job is to make the owner able to produce them.

## The table

<!-- BEGIN GENERATED -->
### Counts per course

| Course | Lectures | Core | Optional | Duplicate | Core video hours |
|---|---:|---:|---:|---:|---:|
| MATH 110 (math110) | 51 | 51 | 0 | 0 | 30.8 |
| MATH 120 (math120) | 54 | 53 | 1 | 0 | 32.2 |
| MATH 130 (math130) | 34 | 33 | 1 | 0 | 26.2 |
| AI 200 (ai200) | 20 | 19 | 1 | 0 | 32.7 |
| AI 210 (ai210) | 8 | 6 | 2 | 0 | 9.1 |
| PHYS 100 (phys100) | 37 | 32 | 5 | 0 | 25.4 |
| MATH 210 (math210) | 39 | 38 | 0 | 1 | 34.3 |
| AI 300 (ai300) | 16 | 16 | 0 | 0 | 2.6 |
| SYS 250 (sys250) | 36 | 36 | 0 | 0 | 37.0 |
| AI 310 (ai310) | 23 | 23 | 0 | 0 | 22.3 |
| RES 400 (res400) | 18 | 18 | 0 | 0 | 17.1 |
| SPCH 100 (spch100) | 170 | 170 | 0 | 0 | 46.4 |
| CS 100 (cs100) — proposed | 16 | 16 | 0 | 0 | 20.5 |
| MATH 140 (math140) — proposed | 35 | 35 | 0 | 0 | 29.2 |
| MATH 150 (math150) — proposed | 33 | 33 | 0 | 0 | 27.5 |
| PHYS 200 (phys200) — proposed | 36 | 36 | 0 | 0 | 30.0 |
| PHYS 300 (phys300) — proposed | 10 | 10 | 0 | 0 | 17.5 |

### Every lecture

Level: 1 intro, 2 core, 3 advanced. Provisional keys (not yet in the data) are marked †.

#### MATH 110 — Unit I — Essence of Linear Algebra (3Blue1Brown)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math110.0.0 | 10 | 1 | Vectors | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.1 | 10 | 1 | Linear combinations, span, and basis vectors | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.2 | 11 | 1 | Linear transformations and matrices | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.3 | 10 | 1 | Matrix multiplication as composition | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.4 | 5 | 1 | Three-dimensional linear transformations | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.5 | 10 | 1 | The determinant | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.6 | 12 | 1 | Inverse matrices, column space and null space | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.7 | 4 | 1 | Nonsquare matrices as transformations between dimensions | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.8 | 14 | 1 | Dot products and duality | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.9 | 9 | 1 | Cross products | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.10 | 13 | 1 | Cross products in the light of linear transformations | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.11 | 12 | 1 | Cramer's rule, explained geometrically | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.12 | 13 | 1 | Change of basis | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.13 | 17 | 1 | Eigenvectors and eigenvalues | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.14 | 13 | 1 | A quick trick for computing eigenvalues | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.0.15 | 17 | 1 | Abstract vector spaces | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |

#### MATH 110 — Unit II — MIT 18.06, Gilbert Strang (full course)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math110.1.0 | 40 | 2 | The Geometry of Linear Equations | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.1 | 48 | 2 | Elimination with Matrices | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.2 | 47 | 2 | Multiplication and Inverse Matrices | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.3 | 48 | 2 | Factorization into A = LU | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.4 | 48 | 2 | Transposes, Permutations, Spaces R^n | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.5 | 46 | 2 | Column Space and Nullspace | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.6 | 43 | 2 | Solving Ax = 0: Pivot Variables, Special Solutions | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.7 | 47 | 2 | Solving Ax = b: Row Reduced Form R | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.8 | 50 | 2 | Independence, Basis, and Dimension | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.9 | 49 | 2 | The Four Fundamental Subspaces | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.10 | 46 | 2 | Matrix Spaces; Rank 1; Small World Graphs | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.11 | 48 | 2 | Graphs, Networks, Incidence Matrices | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.12 | 48 | 2 | Quiz 1 Review | core | revision hour (Quiz 1 review); kept only because MATH 110 is unchanged by decision — candidate optional if the owner allows |
| math110.1.13 | 50 | 2 | Orthogonal Vectors and Subspaces | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.14 | 49 | 2 | Projections onto Subspaces | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.15 | 48 | 2 | Projection Matrices and Least Squares | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.16 | 49 | 2 | Orthogonal Matrices and Gram-Schmidt | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.17 | 49 | 2 | Properties of Determinants | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.18 | 53 | 2 | Determinant Formulas and Cofactors | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.19 | 51 | 2 | Cramer's Rule, Inverse Matrix, and Volume | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.20 | 51 | 2 | Eigenvalues and Eigenvectors | core | overlaps math110.0.13 (3B1B eigenvectors) by design: intuition first, then the algebra — two levels, not a duplicate |
| math110.1.21 | 52 | 2 | Diagonalization and Powers of A | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.22 | 51 | 2 | Differential Equations and exp(At) | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.23 | 51 | 2 | Markov Matrices; Fourier Series | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.24 | 48 | 2 | Quiz 2 Review | core | revision hour (Quiz 2 review); kept only because MATH 110 is unchanged — candidate optional |
| math110.1.25 | 44 | 2 | Symmetric Matrices and Positive Definiteness | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.26 | 48 | 2 | Complex Matrices; Fast Fourier Transform | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.27 | 51 | 2 | Positive Definite Matrices and Minima | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.28 | 46 | 2 | Similar Matrices and Jordan Form | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.29 | 40 | 2 | Singular Value Decomposition | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.30 | 49 | 2 | Linear Transformations and Their Matrices | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.31 | 50 | 2 | Change of Basis; Image Compression | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.32 | 47 | 2 | Quiz 3 Review | core | revision hour (Quiz 3 review); kept only because MATH 110 is unchanged — candidate optional |
| math110.1.33 | 42 | 2 | Left and Right Inverses; Pseudoinverse | core | MATH 110 is unchanged by the owner's decision (10 Nov); linear algebra is the language of ML |
| math110.1.34 | 43 | 2 | Final Course Review | core | final review; kept because MATH 110 is unchanged — candidate optional |

#### MATH 120 — Unit I — Essence of Calculus (3Blue1Brown)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math120.0.0 | 17 | 1 | The essence of calculus | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.1 | 17 | 1 | The paradox of the derivative | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.2 | 18 | 1 | Derivative formulas through geometry | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.3 | 16 | 1 | Visualizing the chain rule and product rule | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.4 | 14 | 1 | What's so special about Euler's number e? | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.5 | 16 | 1 | Implicit differentiation, what's going on here? | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.6 | 18 | 1 | Limits, L'Hôpital's rule, and epsilon delta definitions | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.7 | 21 | 1 | Integration and the fundamental theorem of calculus | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.8 | 13 | 1 | What does area have to do with slope? | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.9 | 6 | 1 | Higher order derivatives | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.10 | 22 | 1 | Taylor series | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.0.11 | 14 | 1 | The other way to visualize derivatives | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |

#### MATH 120 — Unit II — MIT 18.01, David Jerison (full course)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math120.1.0 | 52 | 2 | Rate of Change | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.1 | 53 | 2 | Limits | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.2 | 50 | 2 | Derivatives | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.3 | 46 | 2 | Chain Rule | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.4 | 49 | 2 | Implicit Differentiation | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.5 | 48 | 2 | Exponential and Log | core | overlaps math120.0.4 (3B1B on e) by design: two levels |
| math120.1.6 | 51 | 2 | Exam 1 Review | optional | Exam 1 review: re-teaches Unit I rules with no new idea; the practice engine's problem sets do this job |
| math120.1.7 | 47 | 2 | Linear and Quadratic Approximations | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.8 | 52 | 2 | Curve Sketching | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.9 | 50 | 2 | Max-min | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.10 | 50 | 2 | Related Rates | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.11 | 53 | 2 | Newton's Method | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.12 | 50 | 2 | Mean Value Theorem | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.13 | 49 | 2 | Antiderivatives | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.14 | 45 | 2 | Differential Equations | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.15 | 47 | 2 | Definite Integrals | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.16 | 48 | 2 | First Fundamental Theorem | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.17 | 50 | 2 | Second Fundamental Theorem | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.18 | 50 | 2 | Applications to Logarithms | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.19 | 50 | 2 | Volumes | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.20 | 49 | 2 | Work, Probability | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.21 | 50 | 2 | Numerical Integration | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.22 | 49 | 2 | Exam 3 Review | core | an exam review that also derives the √π Gaussian integral, which Stat 110's normal lecture uses |
| math120.1.23 | 47 | 2 | Trig Integrals | core | integration technique, kept core (12 Nov overrides the 10 Nov 'optional' idea): needed for 8.01/8.02 integrals |
| math120.1.24 | 48 | 2 | Inverse Substitution | core | integration technique, kept core: trig substitution recurs in 8.02 field integrals |
| math120.1.25 | 49 | 2 | Partial Fractions | core | integration technique, kept core: partial fractions recur in 18.03 Laplace transforms |
| math120.1.26 | 51 | 2 | Integration by Parts | core | integration by parts: used constantly in Stat 110 (expectations) and physics |
| math120.1.27 | 45 | 2 | Parametric Equations | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.28 | 49 | 2 | Polar Coordinates | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.29 | 49 | 2 | Exam 4 Review | core | an exam review that teaches polar area and the astronomy orbit formula (8.01 Kepler) as new material |
| math120.1.30 | 49 | 2 | Indeterminate Forms | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.31 | 49 | 2 | Improper Integrals | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.32 | 50 | 2 | Infinite Series | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.1.33 | 48 | 2 | Taylor's Series | core | overlaps math120.0.10 (3B1B Taylor) by design: two levels |
| math120.1.34 | 39 | 2 | Final Review | core | titled Final Review but teaches power-series operations as new material |

#### MATH 130 — Harvard Statistics 110 — Joe Blitzstein (full course)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math130.0.0 | 46 | 2 | Probability and Counting | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.1 | 46 | 2 | Story Proofs, Axioms of Probability | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.2 | 49 | 2 | Birthday Problem, Properties of Probability | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.3 | 50 | 2 | Conditional Probability | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.4 | 50 | 2 | Conditioning Continued, Law of Total Probability | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.5 | 49 | 2 | Monty Hall, Simpson's Paradox | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.6 | 52 | 2 | Gambler's Ruin and Random Variables | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.7 | 50 | 2 | Random Variables and Their Distributions | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.8 | 50 | 2 | Expectation, Indicator Random Variables, Linearity | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.9 | 50 | 2 | Expectation Continued | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.10 | 43 | 2 | The Poisson distribution | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.11 | 50 | 2 | Discrete vs. Continuous, the Uniform | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.12 | 51 | 2 | Normal distribution | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.13 | 49 | 2 | Location, Scale, and LOTUS | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.14 | 38 | 2 | Midterm Review | optional | midterm review: a revision sheet with no new idea (its own summary says so); replaced by the practice engine |
| math130.0.15 | 18 | 2 | Exponential Distribution | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.16 | 51 | 2 | Moment Generating Functions | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.17 | 50 | 2 | MGFs Continued | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.18 | 50 | 2 | Joint, Conditional, and Marginal Distributions | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.19 | 49 | 2 | Multinomial and Cauchy | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.20 | 49 | 2 | Covariance and Correlation | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.21 | 48 | 2 | Transformations and Convolutions | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.22 | 50 | 2 | Beta distribution | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.23 | 49 | 2 | Gamma distribution and Poisson process | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.24 | 48 | 2 | Order Statistics and Conditional Expectation | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.25 | 50 | 2 | Conditional Expectation Continued | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.26 | 51 | 2 | Conditional Expectation given an R.V. | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.27 | 47 | 2 | Inequalities | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.28 | 50 | 2 | Law of Large Numbers and Central Limit Theorem | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.29 | 47 | 2 | Chi-Square, Student-t, Multivariate Normal | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.30 | 47 | 2 | Markov Chains | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.31 | 48 | 2 | Markov Chains Continued | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.32 | 47 | 2 | Markov Chains Continued Further | core | probability: the bigram model, losses, sampling, RL and MacKay all stand on it |
| math130.0.33 | 37 | 2 | A Look Ahead | core | 37-minute look-ahead; short, and the only pointer to statistical inference in the plan |

#### AI 200 — Unit I — Primer: But what is a neural network? (3Blue1Brown)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai200.0.0 | 19 | 1 | But what is a neural network? | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.0.1 | 21 | 1 | Gradient descent — how neural networks learn | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.0.2 | 13 | 1 | What is backpropagation really doing? | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.0.3 | 10 | 1 | Backpropagation calculus | core | the AI spine: built in code, redone typing along after the Python bridge |

#### AI 200 — Unit II — Zero to Hero (Andrej Karpathy)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai200.1.0 | 146 | 2 | Micrograd — spelled-out intro to neural networks and backpropagation | core | watched; redone typing along as ai200.3.0 after the bridge (same video, new key) |
| ai200.1.1 | 118 | 2 | Makemore 1 — bigram character-level language model | core | watched; redone as ai200.3.1 |
| ai200.1.2 | 76 | 2 | Makemore 2 — MLP, following Bengio et al. 2003 | core | watched; redone as ai200.3.2 |
| ai200.1.3 | 116 | 3 | Makemore 3 — activations, gradients, BatchNorm | core | watched; redone as ai200.3.3 |
| ai200.1.4 | 115 | 3 | Makemore 4 — becoming a backprop ninja (DO NOT SKIP) | core | watched; redone as ai200.3.4 |
| ai200.1.5 | 56 | 3 | Makemore 5 — building a WaveNet | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.1.6 | 116 | 3 | Let's build GPT — from scratch, in code | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.1.7 | 134 | 3 | Let's build the GPT Tokenizer | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.1.8 | 241 | 3 | Let's reproduce GPT-2 (124M) | core | the AI spine: built in code, redone typing along after the Python bridge |

#### AI 200 — Unit III — The big picture (watch after Unit II)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai200.2.0 | 60 | 1 | Intro to Large Language Models | optional | the one-hour version of ai200.2.1 (same speaker, same pretraining → post-training story); its only unique part is the LLM-security section (~15 min) |
| ai200.2.1 | 211 | 2 | Deep dive into LLMs like ChatGPT | core | no code needed, so it moves forward into the bridge weeks to keep the subject alive |

#### AI 210 — fast.ai 2022 — Part 1

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai210.0.0 | 83 | 2 | Lesson 1: Getting started | core | fast.ai: the top-down, practical counterweight to Karpathy |
| ai210.0.1 | 77 | 2 | Lesson 2: Deployment | core | fast.ai: the top-down, practical counterweight to Karpathy |
| ai210.0.2 | 90 | 2 | Lesson 3: Neural net foundations | core | fast.ai: the top-down, practical counterweight to Karpathy |
| ai210.0.3 | 95 | 2 | Lesson 4: Natural language (NLP) | core | fast.ai: the top-down, practical counterweight to Karpathy |
| ai210.0.4 | 103 | 2 | Lesson 5: From-scratch model | core | fast.ai: the top-down, practical counterweight to Karpathy |
| ai210.0.5 | 103 | 2 | Lesson 6: Random forests | optional | random forests: tabular ML no path in this plan needs (12 Nov: fast.ai 6–7 at most optional) |
| ai210.0.6 | 107 | 2 | Lesson 7: Collaborative filtering | optional | collaborative filtering: no path needs it; its gradient-accumulation tip is in ai310.0.6 |
| ai210.0.7 | 97 | 2 | Lesson 8: Convolutions (CNNs) | core | fast.ai: the top-down, practical counterweight to Karpathy |

#### PHYS 100 — MIT 8.01 — Walter Lewin (Fall 1999)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| phys100.0.0 | 3 | 2 | Introduction | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.1 | 38 | 2 | Units, Dimensions, and Scaling Arguments | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.2 | 51 | 2 | Introduction to Kinematics | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.3 | 50 | 2 | Vectors | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.4 | 52 | 2 | The Motion of Projectiles | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.5 | 51 | 2 | Uniform Circular Motion | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.6 | 49 | 2 | Newton's First, Second, and Third Laws | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.7 | 50 | 2 | Weight, Perceived Gravity, and Weightlessnes | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.8 | 48 | 2 | Frictional Forces | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.9 | 50 | 2 | Review of Lectures 1 through 5 | optional | exam review of lectures 1–5: revision, no new idea |
| phys100.0.10 | 49 | 2 | Hooke's Law, Simple Harmonic Oscillator | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.11 | 49 | 2 | Work, Energy, and Universal Gravitation | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.12 | 50 | 2 | Resistive Forces | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.13 | 52 | 2 | Equation of Motion for Simple Harmonic Oscillators | core | overlaps phys100.0.10 (both SHO) but adds F = −dU/dx and small oscillations about any minimum |
| phys100.0.14 | 50 | 2 | Orbits and Escape Velocity | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.15 | 53 | 2 | Momentum and Its Conservation | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.16 | 49 | 2 | Elastic and Inelastic Collisions | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.17 | 49 | 2 | Momentum of Individual Objects, Rocket Equation | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.18 | 50 | 2 | Review of Lectures 6 through 15 | optional | exam review of lectures 6–15: revision, no new idea |
| phys100.0.19 | 41 | 2 | Rotating Rigid Bodies, Inertia, and Axis Theorems | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.20 | 51 | 2 | Angular Momentum | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.21 | 48 | 2 | Torque | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.22 | 49 | 2 | Kepler's Laws, Elliptical Orbits, and Maneuvers | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.23 | 50 | 2 | Doppler Effect, Binary Stars, Neutron Stars, Black Holes | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.24 | 50 | 2 | Rolling Motion, Gyroscopes | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.25 | 48 | 2 | Static Equilibrium, Stability, Rope Walker | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.26 | 50 | 2 | Elasticity and Young's Modulus | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.27 | 50 | 2 | Gases and Incompressible Liquids | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.28 | 49 | 2 | Hydrostatics, Archimedes' Principle, Fluid Dynamics | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.29 | 50 | 2 | Review of Lectures 16 through 24 | optional | exam review of lectures 16–24: revision, no new idea |
| phys100.0.30 | 50 | 2 | Simple Harmonic Oscillations of Suspended Solid Bodies | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.31 | 48 | 2 | Pendulums and Springs | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.32 | 49 | 2 | Thermal Expansion | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.33 | 53 | 2 | Ideal-Gas Law | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.34 | 48 | 2 | Heisenberg's Uncertainty Principle | core | physics is core for the goal (12 Nov): classical mechanics, the first of the physics line |
| phys100.0.35 | 44 | 2 | Professor Lewin’s Early days at MIT | optional | Lewin's research memoir (x-ray astronomy): inspiration, not curriculum |
| phys100.0.36 | 61 | 2 | For the Love of Physics (Walter Lewin's Last Lecture) | optional | Lewin's last public lecture: the course in miniature, a recap; no new idea |

#### MATH 210 — Unit I — Matrix Calculus (MIT 18.S096, Edelman & Johnson)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math210.0.0 | 58 | 3 | Lecture 1 Part 1: Introduction and Motivation | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.1 | 48 | 3 | Lecture 1 Part 2: Derivatives as Linear Operators | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.2 | 74 | 3 | Lecture 2 Part 1: Derivatives in Higher Dimensions: Jacobians and Matrix Functions | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.3 | 30 | 3 | Lecture 2 Part 2: Vectorization of Matrix Functions | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.4 | 53 | 3 | Lecture 3 Part 1: Kronecker Products and Jacobians | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.5 | 51 | 3 | Lecture 3 Part 2: Finite-Difference Approximations | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.6 | 64 | 3 | Lecture 4 Part 1: Gradients and Inner Products in Other Vector Spaces | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.7 | 44 | 3 | Lecture 4 Part 2: Nonlinear Root Finding, Optimization, and Adjoint Gradient Methods | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.8 | 28 | 3 | Lecture 5 Part 1: Derivative of Matrix Determinant and Inverse | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.9 | 36 | 3 | Lecture 5 Part 2: Forward Automatic Differentiation via Dual Numbers | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.10 | 33 | 3 | Lecture 5 Part 3: Differentiation on Computational Graphs | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.11 | 58 | 3 | Lecture 6 Part 1: Adjoint Differentiation of ODE Solutions | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.12 | 43 | 3 | Lecture 6 Part 2: Calculus of Variations and Gradients of Functionals | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.13 | 66 | 3 | Lecture 7 Part 1: Derivatives of Random Functions | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.14 | 46 | 3 | Lecture 7 Part 2: Second Derivatives, Bilinear Forms, and Hessian Matrices | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.15 | 37 | 3 | Lecture 8 Part 1: Derivatives of Eigenproblems | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.0.16 | 65 | 3 | Lecture 8 Part 2: Automatic Differentiation on Computational Graphs | duplicate-of:math210.0.10 | same worked example (a = sin x, b = a/y, z = b + x) and the same sum-over-paths argument; its one addition, forward costs ×inputs and reverse ×outputs, is also in sys250.0.4 |

#### MATH 210 — Unit II — Optimization for Deep Learning

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math210.1.0 | 75 | 3 | Loss functions and optimization (CS231n Lecture 3) | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.1.1 | 80 | 3 | Training neural networks I — init, activations, BatchNorm (CS231n Lecture 6) | core | overlaps ai200.1.3 and sys250.0.6/0.9 (init, BatchNorm) but adds babysitting and log-scale hyperparameter search; a third pass at a higher level, not a duplicate |
| math210.1.2 | 76 | 3 | Training neural networks II — momentum, Adam, schedules (CS231n Lecture 7) | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.1.3 | 0 | 3 | Why momentum really works — read and play with every widget | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.1.4 | 0 | 3 | An overview of gradient descent optimization algorithms (Ruder) | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.1.5 | 0 | 3 | Convexity — Boyd & Vandenberghe ch. 2–3 (free book) | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |

#### MATH 210 — Unit III — Information Theory (David MacKay, Cambridge)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math210.2.0 | 62 | 3 | Introduction to Information Theory | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.1 | 51 | 3 | Entropy and Data Compression (I): Introduction to Compression, Inf.Theory and Entropy | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.2 | 51 | 3 | Entropy and Data Compression (II): Shannon's Source Coding Theorem, The Bent Coin Lottery | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.3 | 57 | 3 | Entropy and Data Compression (III): Shannon's Source Coding Theorem, Symbol Codes | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.4 | 63 | 3 | Entropy and Data Compression (IV): Shannon's Source Coding Theorem, Symbol Codes | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.5 | 55 | 3 | Noisy Channel Coding (I): Inference and Information Measures for Noisy Channels | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.6 | 47 | 3 | Noisy Channel Coding (II): The Capacity of a Noisy Channel | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.7 | 69 | 3 | Noisy Channel Coding (III): The Noisy-Channel Coding Theorem | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.8 | 49 | 3 | A Noisy Channel Coding Gem, And An Introduction To Bayesian Inference (I) | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.9 | 76 | 3 | An Introduction To Bayesian Inference (II): Inference Of Parameters And Models | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.10 | 57 | 3 | Approximating Probability Distributions (I):  Clustering As An Example Inference Problem | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.11 | 84 | 3 | Approximating Probability Distributions (II): Monte Carlo Methods (I) | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.12 | 108 | 3 | Approximating Probability Distributions (III): Monte Carlo Methods (II): Slice Sampling | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.13 | 47 | 3 | Approximating Probability Distributions (IV): Variational Methods | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.14 | 87 | 3 | Data Modelling With Neural Networks (I): Feedforward Networks: The Capacity Of A Neuron | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |
| math210.2.15 | 97 | 3 | Data Modelling With Neural Networks (II): Content-Addressable Memories And State | core | MATH 210 stays in full (12 Nov): matrix calculus, optimisation, information theory |

#### AI 300 — Unit I — The Vision Era

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai300.0.0 | 78 | 3 | AlexNet — ImageNet Classification with Deep CNNs (2012) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.0.1 | 78 | 3 | ResNet — Deep Residual Learning (2015) | core | the paper is core, but DATA DEFECT: this lesson points at the AlexNet video (DAOcjicFr1Y, same as ai300.0.0); fix the video in step 2 |
| ai300.0.2 | 0 | 3 | ViT — An Image Is Worth 16x16 Words (2020) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.0.3 | 0 | 3 | CLIP — Learning Transferable Visual Models (2021) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |

#### AI 300 — Unit II — The Transformer

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai300.1.0 | 0 | 3 | Attention Is All You Need (2017) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.1.1 | 0 | 3 | BERT — Pre-training Deep Bidirectional Transformers (2018) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.1.2 | 116 | 3 | GPT-2 — Language Models are Unsupervised Multitask Learners (2019) | core | the paper is core; its video is the same as ai200.1.6 (kCc8FmEb1nY) — schedule it as reading + reimplementation only |
| ai300.1.3 | 0 | 3 | Chinchilla — Training Compute-Optimal LLMs (2022) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |

#### AI 300 — Unit III — Alignment & Adaptation

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai300.2.0 | 0 | 3 | InstructGPT — Training LMs to Follow Instructions (2022) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.2.1 | 0 | 3 | LoRA — Low-Rank Adaptation of LLMs (2021) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.2.2 | 0 | 3 | DPO — Direct Preference Optimization (2023) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.2.3 | 0 | 3 | LLaMA — Open and Efficient Foundation Models (2023) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |

#### AI 300 — Unit IV — Scale & Systems

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai300.3.0 | 0 | 3 | FlashAttention — Fast and Memory-Efficient Exact Attention (2022) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.3.1 | 82 | 3 | Mixtral — Mixture of Experts (2024) | core | the paper is core; its video is the same as ai310.0.3 (LPv1KfUXLCo) — schedule it as reading only |
| ai300.3.2 | 0 | 3 | DDPM — Denoising Diffusion Probabilistic Models (2020) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |
| ai300.3.3 | 0 | 3 | RAG — Retrieval-Augmented Generation (2020) | core | the Paper Room: reimplementations are the published-work evidence a self-taught scientist needs |

#### SYS 250 — Unit I — Deep Learning Systems (CMU 10-714, Chen & Kolter)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| sys250.0.0 | 58 | 3 | Introduction and Logistics | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.1 | 80 | 3 | ML Refresher / Softmax Regression | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.2 | 54 | 3 | "Manual" Neural Networks | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.3 | 48 | 3 | "Manual" Neural Networks | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.4 | 64 | 3 | Automatic Differentiation | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.5 | 66 | 3 | Automatic Differentiation Implementation | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.6 | 87 | 3 | Fully connected networks, optimization, initialization | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.7 | 60 | 3 | Neural Network Abstractions | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.8 | 56 | 3 | Neural Network Library Implementation | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.9 | 80 | 3 | Normalization and Regularization | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.10 | 69 | 3 | Convolutional Networks | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.11 | 45 | 3 | Hardware Acceleration | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.12 | 44 | 3 | Lecture - 12 GPU Acceleration | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.13 | 50 | 3 | Hardware Acceleration Implemention | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.14 | 80 | 3 | Implementing Convolutions | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.15 | 47 | 3 | Training Large Models | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.16 | 38 | 3 | Generative Adversarial Networks | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.17 | 35 | 3 | Generative Adversarial Networks Implementation | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.18 | 71 | 3 | Sequence Modeling and Recurrent Networks | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.19 | 55 | 3 | RNN Implementation | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.20 | 70 | 3 | Transformers and Attention | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.21 | 61 | 3 | Transformer Implementation | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.22 | 43 | 3 | Model Deployment | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.0.23 | 37 | 3 | Machine Learning Compilation and Deployment Implementation | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |

#### SYS 250 — Unit II — CUDA & Kernels (GPU MODE)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| sys250.1.0 | 56 | 3 | How to profile CUDA kernels in PyTorch | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.1 | 52 | 3 | Ch1-3 PMPP book | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.2 | 78 | 3 | Getting Started With CUDA for Python Programmers | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.3 | 57 | 3 | Compute and Memory Basics | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.4 | 78 | 3 | Going Further with CUDA for Python Programmers | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.5 | 68 | 3 | CUDA Performance Checklist | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.6 | 47 | 3 | Reductions | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.7 | 72 | 3 | Flash Attention | core | the kernel-level view of the ai300.3.0 paper; complementary |
| sys250.1.8 | 82 | 3 | Practitioners Guide to Triton | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.9 | 69 | 3 | Hacker's Guide to Speculative Decoding in VLLM | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.10 | 77 | 3 | int8 tensorcore matmul for Turing | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |
| sys250.1.11 | 86 | 3 | Mosaic GPU | core | computing engineering is core (12 Nov): frameworks, GPUs, kernels |

#### AI 310 — Unit I — Language Modeling from Scratch (Stanford CS336, 2025)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai310.0.0 | 79 | 3 | Lecture 1: Overview and Tokenization | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.1 | 79 | 3 | Lec. 2: Pytorch, Resource Accounting | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.2 | 87 | 3 | Lec. 3: Architectures, Hyperparameters | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.3 | 82 | 3 | Lecture 4: Mixture of experts | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.4 | 74 | 3 | Lecture 5: GPUs | core | overlaps sys250.0.12 and sys250.1.3 (GPU basics) — three lecturers, three depths; CS336's is the LLM-specific one |
| ai310.0.5 | 80 | 3 | Lecture 6: Kernels, Triton | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.6 | 85 | 3 | Lecture 7: Parallelism 1 | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.7 | 75 | 3 | Lecture 8: Parallelism 2 | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.8 | 65 | 3 | Lecture 9: Scaling laws 1 | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.9 | 83 | 3 | Lecture 10: Inference | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.10 | 78 | 3 | Lecture 11: Scaling laws 2 | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.11 | 81 | 3 | Lecture 12: Evaluation | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.12 | 79 | 3 | Lecture 13: Data 1 | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.13 | 79 | 3 | Lecture 14: Data 2 | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.14 | 75 | 3 | Lecture 15: Alignment - SFT/RLHF | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.15 | 81 | 3 | Lecture 16: Alignment - RL 1 | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.0.16 | 76 | 3 | Lecture 17: Alignment - RL 2 | core | CS336 is core for an AI scientist (12 Nov) |

#### AI 310 — Unit II — Finetune, Evaluate, Serve

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai310.1.0 | 0 | 3 | The Hugging Face LLM course — pipeline fundamentals | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.1.1 | 0 | 3 | Supervised finetuning in practice (TRL + alignment handbook) | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.1.2 | 0 | 3 | Quantization — GGUF, AWQ, bitsandbytes tradeoffs | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.1.3 | 0 | 3 | Evals — lm-evaluation-harness, contamination, and why public benchmarks lie | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.1.4 | 0 | 3 | Serving — vLLM, PagedAttention, and the KV cache | core | CS336 is core for an AI scientist (12 Nov) |
| ai310.1.5 | 0 | 3 | Agents — tool use, function calling, and failure modes | core | CS336 is core for an AI scientist (12 Nov) |

#### RES 400 — Unit I — Reinforcement Learning (David Silver, DeepMind/UCL)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| res400.0.0 | 88 | 3 | Introduction to Reinforcement Learning | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.1 | 102 | 3 | Markov Decision Process | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.2 | 99 | 3 | Planning by Dynamic Programming | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.3 | 97 | 3 | Model-Free Prediction | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.4 | 97 | 3 | Model Free Control | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.5 | 97 | 3 | Value Function Approximation | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.6 | 94 | 3 | Policy Gradient Methods | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.7 | 100 | 3 | Integrating Learning and Planning | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.8 | 99 | 3 | Exploration and Exploitation | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.0.9 | 111 | 3 | Classic Games | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |

#### RES 400 — Unit II — Mechanistic Interpretability (reading-led)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| res400.1.0 | 0 | 3 | A Mathematical Framework for Transformer Circuits | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.1.1 | 0 | 3 | In-context Learning and Induction Heads | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.1.2 | 0 | 3 | Toy Models of Superposition | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.1.3 | 0 | 3 | ARENA — Transformer Interpretability track | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.1.4 | 0 | 3 | Nanda — MI Quickstart & 200 Concrete Open Problems | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |

#### RES 400 — Unit III — The Craft of Research

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| res400.2.0 | 44 | 3 | Hamming — You and Your Research | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.2.1 | 0 | 3 | How to read a paper — the three-pass method | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |
| res400.2.2 | 0 | 3 | Karpathy — A Survival Guide to a PhD (read for the research taste, not the PhD) | core | RL, interpretability and research craft are core for an AI scientist (12 Nov) |

#### SPCH 100 — Unit I — Seed: finding, delivering, and holding up under pressure

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.0.0 | 18 | 1 | Homework for Life — finding the story in an ordinary day | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.0.1 | 11 | 1 | Five ways to improve your professional voice | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.0.2 | 39 | 1 | Think faster, talk smarter — structure under pressure | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit II — Seed: the spine, and humour you can prepare

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.1.0 | 4 | 1 | The Pixar story spine — six prompts that hold a story up | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.1.1 | 5 | 1 | How to easily be funnier in conversations | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit III — Structure: the moment, the stakes, the ending

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.2.0 | 18 | 1 | What is a story — and why tell one | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.1 | 24 | 1 | The five-second moment: the instant a story is about | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.2 | 5 | 1 | Anecdote, bait and reflection — the two building blocks | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.3 | 10 | 1 | The elephant: a reason to listen in the first thirty seconds | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.4 | 19 | 1 | The clues to a great story — make me care | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.5 | 5 | 1 | The shapes of stories — fortune drawn over time | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.6 | 41 | 1 | Building a story live: know the end, start close to it | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.7 | 4 | 1 | And, But, Yet, Therefore — structure in one breath | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.8 | 4 | 1 | Structure is what they know, and when — the Nemo flashbacks | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.9 | 3 | 1 | Write what you know — the feeling under the monster story | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.10 | 7 | 1 | Credibility before vulnerability — five tips for a story in a talk | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.2.11 | 56 | 1 | Promise, progress, payoff — why a middle drags and an ending lands (start at 19:28) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit IV — Finding stories: the lens, the bank, the volume

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.3.0 | 7 | 1 | Homework for Life, sharpened — and the pickle story | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.3.1 | 3 | 1 | Seeing with storyteller eyes — notice the flag | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.3.2 | 5 | 1 | A photo folder called Stories | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.3.3 | 7 | 1 | First, last, best, worst — mining the past | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.3.4 | 13 | 1 | Personal signature stories — make them, then bank them | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.3.5 | 12 | 1 | Twelve lessons: zoom in, quote it, use 'how are you?' | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.3.6 | 4 | 1 | Most of the work is finding — and killing | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.3.7 | 5 | 1 | The taste gap — volume on a deadline | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit V — Delivery: voice, body, pauses, nerves

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.4.0 | 10 | 1 | The voice toolbox — register, prosody, pace, and a warm-up | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.1 | 43 | 1 | The five dials — rate, volume, melody, tone, pause | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.2 | 36 | 1 | Melody, volume, and the descending scale | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.3 | 13 | 1 | The pause — tie it to a breath | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.4 | 8 | 1 | Five body-language habits that read as confidence | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.5 | 28 | 1 | Rookie, pretty good, natural — using the whole range | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.6 | 38 | 1 | Nerves: treat the symptoms and the sources | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.7 | 63 | 1 | How to speak — the promise, the star, the ending | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.8 | 24 | 1 | When all eyes are on you — rehearse to the stakes, connect, then review | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.9 | 16 | 1 | Skills, not talent — open body, functional hands, the pause over 'uh' | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.10 | 19 | 1 | Breath is thought — the diaphragm, stillness, and the closed mouth | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.11 | 15 | 1 | Stage movement — give every place and person a spot, and go back to it | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.4.12 | 4 | 1 | Move with a purpose — the action in the story, and the stage as a timeline | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit VI — Speaking as a non-native speaker: clear, not native

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.5.0 | 15 | 2 | Speak it like a video game, not a piano exam | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.1 | 5 | 2 | Intelligibility, not accent — what the research says to fix | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.2 | 17 | 2 | The other view: aim native-like, one perfect sentence at a time | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.3 | 11 | 2 | Keep speaking — the accent, the comments, and what 'normal' is | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.4 | 4 | 2 | The rhythm of English — content words carry the beat | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.5 | 10 | 2 | Thought groups — chunk, link, and pause by meaning | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.6 | 12 | 2 | Shadowing in ten steps — understand before you copy | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.7 | 6 | 2 | Stop translating: chunks, self-talk, keep it short | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.8 | 14 | 2 | Four past tenses that move a story in English | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.9 | 38 | 2 | Presenting in your second language — seven mistakes | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.10 | 20 | 2 | Share, don't present — bottom line first, less robotic | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.11 | 46 | 2 | Being funny in another language | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.12 | 4 | 2 | Word stress — the syllable that is higher and longer | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.13 | 5 | 2 | Intonation — the melody that carries attitude | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.14 | 5 | 2 | Arabic speakers' English — p and b, the r, and the missing 'a' | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.15 | 6 | 2 | Stuck for a word — simplify, define, synonym, opposite, go general (stop at 6:20) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.5.16 | 16 | 2 | Linking — a consonant sound runs into the next vowel sound | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit VII — Humour you can build: structure, filters, the funny story

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.6.0 | 12 | 2 | What makes things funny — the benign violation | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.1 | 7 | 2 | Funny versus comedy — flawed people doing their best | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.2 | 12 | 2 | Joke structure — the one thing with two meanings | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.3 | 4 | 2 | Three kinds of setup | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.4 | 4 | 2 | The late-night formula — two lists and a link | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.5 | 8 | 2 | Eleven funny filters | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.6 | 5 | 2 | Making writing funnier — flaws, details, zig zig zag | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.7 | 5 | 2 | How Seinfeld writes a bit | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.8 | 5 | 2 | A little story, how you feel about it, zoom out, tag | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.9 | 29 | 2 | The levity list — exaggeration, contrast, rule of three | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.10 | 5 | 2 | Three ways to add humour to a speech | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.11 | 55 | 2 | Stand-up techniques for people who are not comedians | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.12 | 33 | 2 | The clown and the editor — a repeatable process for writing funny (stop at 33:20) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.13 | 21 | 2 | Anatomy of a cartoon — incongruity, context, and who the target is | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.14 | 37 | 2 | Open mode and closed mode — Cleese on the conditions for ideas | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.15 | 35 | 2 | Humour tailored to the room — Judy Carter's 'what's a bad day?' | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.16 | 10 | 2 | The laugh generator — punch up a talk from its transcript | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.17 | 3 | 2 | When a joke gets nothing — too little information, or too much | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.18 | 6 | 2 | Don't open with a joke — three low-risk ways to be light | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.19 | 7 | 2 | Act-outs, part one — show, don't tell: play what the character wants | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.6.20 | 8 | 2 | Act-outs, part two — stage the scene, play the honest reaction (stop at 8:20) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit VIII — Humour in real time: noticing, yes-and, reading the room

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.7.0 | 7 | 2 | Finding laughter anywhere — notice your honest reactions | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.1 | 11 | 2 | The way of improvisation — seven steps | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.2 | 57 | 2 | Improv wisdom — don't prepare, just show up | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.3 | 19 | 2 | Humour is a skill — point of view, yes-and, staircase wit | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.4 | 60 | 2 | Humour at work — status, styles, and the lines not to cross | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.5 | 10 | 2 | Jokes that make people like you less | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.6 | 11 | 2 | Rescuing a joke — explain it, flatten it, own the flub | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.7 | 3 | 2 | Callbacks | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.8 | 4 | 2 | Name the elephant in the room | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.9 | 20 | 2 | Yes-and, then 'thank you because' — disagreeing without killing the idea | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.10 | 14 | 2 | Crowd work — turning an ordinary answer into a joke | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.11 | 3 | 2 | Prepared spontaneity — lines in your pocket for the questions everyone asks | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.12 | 14 | 2 | Teasing and comebacks — British banter, and when to stop | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.13 | 14 | 2 | Self-deprecation that raises you — whoever names the weakness owns it | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.7.14 | 18 | 2 | Where self-deprecation stops — never joke about the job you were hired for | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit IX — Conversation: listening, asking, holding the floor

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.8.0 | 11 | 2 | Ten rules for a better conversation | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.1 | 22 | 2 | Shift or support — the habits we don't see in ourselves | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.2 | 8 | 2 | Five ways to listen better — and RASA | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.3 | 16 | 2 | The power of listening — what do you really want? | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.4 | 2 | 2 | The mirror — an invitation to keep talking | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.5 | 43 | 2 | TALK — topics, asking, levity, kindness | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.6 | 10 | 2 | Three kinds of conversation, and the deep question | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.7 | 18 | 2 | Conversation starters that spark | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.8 | 12 | 2 | Talking to strangers — five ways in | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.9 | 5 | 2 | Feedback in four parts | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.10 | 22 | 2 | Disagreeing productively — common ground and better questions | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.11 | 32 | 2 | Argue less, talk more — 'what did you hear?', and a well, not a waterfall | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.8.12 | 46 | 2 | Supercommunicators — match the conversation, loop for understanding | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit X — High stakes: explaining, pitching, and the hard questions

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.9.0 | 8 | 2 | One idea, built in their heads | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.1 | 12 | 2 | The curse of knowledge — find the core, make it concrete | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.2 | 4 | 2 | Talk nerdy to us — so what, no jargon, no bullets | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.3 | 24 | 2 | Before and after — putting words on numbers (stop at 24:00) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.4 | 18 | 2 | The shape of a persuasive talk — what is, what could be | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.5 | 20 | 2 | How to start — a joke, a story or a question | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.6 | 19 | 2 | Rhetoric — threes, repetition, balance, metaphor | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.7 | 27 | 2 | Describe what you do so anyone could build it | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.8 | 14 | 2 | The 30-second pitch and the 2-minute pitch | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.9 | 30 | 2 | Value stories — normal, explosion, new normal | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.10 | 48 | 2 | A true story for every point in the pitch | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.11 | 2 | 2 | The accusation audit — say their objections first | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.12 | 5 | 2 | Direct questions get direct answers | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.13 | 1 | 2 | Answer the question asked — and say 'I don't know' | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.14 | 3 | 2 | Delivering bad news | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.15 | 2 | 2 | Restarting a stalled deal — and earning 'that's right' | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.16 | 9 | 2 | Fight with story — the wedding DJs who booked 100 of 100 | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.17 | 20 | 2 | Death by PowerPoint — one message, six objects, you as the visual aid | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.18 | 17 | 2 | Make numbers count — translate every number people must feel | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.19 | 5 | 2 | Six pitches — Pixar, subject line, rhyme, question, tweet, one word | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.20 | 21 | 2 | Why you, now — the shift, the stakes, the promised land | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.21 | 48 | 2 | Magic words — identities, could not should, hedges and advice | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.9.22 | 46 | 2 | Reading the room in a pitch — five faces and what to say back | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit XI — Choosing your stories: the five-minute test and the bank

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.10.0 | 7 | 2 | Your life story in five minutes | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.10.1 | 22 | 2 | A story bank — categories, prompts and tags | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.10.2 | 58 | 2 | Which story to tell — start from the objective, then look for a success, a failure or a moment of clarity (stop at 58:00) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit XII — Short-form structure: hooks, progression, payoff

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.11.0 | 4 | 2 | A story in under sixty seconds | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.11.1 | 16 | 2 | Four ways a hook fails — delay, confusion, irrelevance, disinterest | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.11.2 | 20 | 2 | Hook layering — what the first three seconds of viral shorts share | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.11.3 | 27 | 2 | Hook point — attention, story, credibility | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.11.4 | 41 | 2 | Shorts in depth — but/so, visible progress, the last word | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.11.5 | 17 | 2 | Three script mistakes — story flow, comprehension, speed to value | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit XIII — Retention and analytics: reading what the audience did

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.12.0 | 40 | 2 | How recommendations work — pulled for each viewer, not pushed | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.12.1 | 5 | 2 | Reading a retention graph — five shapes | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.12.2 | 44 | 2 | Shorts metrics — viewed versus swiped, valued watch time | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.12.3 | 4 | 2 | Where a strategist looks first | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.12.4 | 9 | 2 | Which intros keep viewers — 63 retention graphs compared | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.12.5 | 10 | 2 | Why click-through rate misleads — and the comparisons that still mean something | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit XIV — On camera: the lens, the energy, the reps

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.13.0 | 8 | 2 | Talk to one person — how TV presenters own the words | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.1 | 2 | 2 | When to look at the lens, and when to look away | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.2 | 2 | 2 | What low energy and nervous movement look like | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.3 | 10 | 2 | Coffee mode and presenter mode | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.4 | 5 | 2 | Dial it up, then bring it down | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.5 | 8 | 2 | Thirty days of recording yourself | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.6 | 8 | 2 | Sounding natural from a script — conversational lines, one sentence at a time | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.7 | 5 | 2 | Talking-head basics — eyeline, one soft light, the mic close, slower, in sections | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.8 | 7 | 2 | Reading from a prompter — write it to be said, break it into breaths, rehearse on the glass | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.9 | 7 | 2 | Why a prompter read still sounds fake — the setup, the head space, and your own words | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.10 | 4 | 2 | Sounding natural on air — an anchor's prompter habits | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.13.11 | 19 | 2 | Body language on camera — you fill the frame, so everything is bigger | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit XV — Documenting the build: process, not a diary

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.14.0 | 38 | 2 | Show your work — share the process, not just the product (talk ends 37:30) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.14.1 | 16 | 2 | A vlog needs a story — goal, challenge, complications, payoff | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.14.2 | 17 | 2 | Devlogs — technical or design, a straight line, the struggle left in | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.14.3 | 4 | 2 | Explain the build to people who don't build | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.14.4 | 15 | 2 | Building in public without giving the business away — a share / don't-share list (start at 1:30) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.14.5 | 26 | 2 | Storytelling for engineers — announce a change so people understand it (talk ends 25:20) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit XVI — Positioning and pillars: who it's for, what you're known for

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.15.0 | 5 | 2 | The smallest viable audience — specific up | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.15.1 | 35 | 2 | Positioning — context that makes your value obvious (talk ends 34:10) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.15.2 | 14 | 2 | Five content pillars — knowledge, experience, need, you, values | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### SPCH 100 — Unit XVII — Long-form: acts, scripts, packaging, tension

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| spch100.16.0 | 9 | 2 | Three acts — 24 hours to meet Yes Theory | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.16.1 | 20 | 2 | Scripting a long video — packaging, outline, intro, body, outro | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.16.2 | 19 | 2 | Packaging — legitbait, not a click trap | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.16.3 | 5 | 2 | Editing for tension — moments, countdowns, questions | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.16.4 | 16 | 2 | A story inside a review — and packaging before you film | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.16.5 | 6 | 2 | Start with the misconception — why a clear explainer can teach nothing | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |
| spch100.16.6 | 26 | 2 | How Johnny Harris writes a video — the promise, the cold open, words paired with pictures (start at 10:19, stop at 36:00) | core | Storytelling is core for the founder side (12 Nov); no near-duplicate found (max similarity 0.28, all part-one/part-two pairs) |

#### CS 100 — Python for ML (bridge)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| cs100.0.0 † | 105 | 1 | Lecture 0 — Functions, Variables | core | proposed lecture, see python-bridge.md |
| cs100.0.1 † | 60 | 1 | Lecture 1 — Conditionals | core | proposed lecture, see python-bridge.md |
| cs100.0.2 † | 90 | 1 | Lecture 2 — Loops | core | proposed lecture, see python-bridge.md |
| cs100.0.3 † | 56 | 1 | Lecture 3 — Exceptions | core | proposed lecture, see python-bridge.md |
| cs100.0.4 † | 80 | 1 | Lecture 4 — Libraries | core | proposed lecture, see python-bridge.md |
| cs100.0.5 † | 55 | 1 | Lecture 5 — Unit Tests | core | proposed lecture, see python-bridge.md |
| cs100.0.6 † | 107 | 1 | Lecture 6 — File I/O | core | proposed lecture, see python-bridge.md |
| cs100.0.7 † | 120 | 1 | Lecture 7 — Regular Expressions | core | proposed lecture, see python-bridge.md |
| cs100.0.8 † | 167 | 1 | Lecture 8 — Object-Oriented Programming | core | proposed lecture, see python-bridge.md |
| cs100.0.9 † | 100 | 1 | Lecture 9 — Et Cetera (sets, comprehensions, generators, *args, map) | core | proposed lecture, see python-bridge.md |

#### CS 100 — Python for ML (bridge)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| cs100.1.0 † | 58 | 2 | NumPy for beginners (freeCodeCamp, Keith Galli) | core | proposed lecture, see python-bridge.md |
| cs100.1.1 † | 150 | 2 | PyTorch fundamentals: tensors, shapes, indexing, matmul, broadcasting (Learn PyTorch for Deep Learning, chapter 00, Daniel Bourke) | core | proposed lecture, see python-bridge.md |

#### CS 100 — Python for ML (bridge)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| cs100.2.0 † | 8 | 1 | Large Language Models explained briefly | core | proposed lecture, see python-bridge.md |
| cs100.2.1 † | 27 | 2 | Transformers, the tech behind LLMs (Deep Learning ch. 5) | core | proposed lecture, see python-bridge.md |
| cs100.2.2 † | 26 | 2 | Attention in transformers, step by step (Deep Learning ch. 6) | core | proposed lecture, see python-bridge.md |
| cs100.2.3 † | 23 | 2 | How might LLMs store facts (Deep Learning ch. 7) | core | proposed lecture, see python-bridge.md |

#### AI 200 — 

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| ai200.3.0 † | 146 | 2 | Micrograd — spelled-out intro to neural networks and backpropagation (second pass, typing along) | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.3.1 † | 118 | 2 | Makemore 1 — bigram character-level language model (second pass, typing along) | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.3.2 † | 76 | 2 | Makemore 2 — MLP, following Bengio et al. 2003 (second pass, typing along) | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.3.3 † | 116 | 3 | Makemore 3 — activations, gradients, BatchNorm (second pass, typing along) | core | the AI spine: built in code, redone typing along after the Python bridge |
| ai200.3.4 † | 115 | 3 | Makemore 4 — becoming a backprop ninja (DO NOT SKIP) (second pass, typing along) | core | the AI spine: built in code, redone typing along after the Python bridge |

#### MATH 120 — 

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math120.2.0 † | 10 | 2 | Multivariable functions — what a function of two inputs looks like | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.2.1 † | 10 | 2 | Partial derivatives | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.2.2 † | 10 | 2 | The gradient | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.2.3 † | 12 | 2 | Directional derivatives, and why the gradient is steepest ascent | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.2.4 † | 12 | 2 | The multivariable chain rule | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.2.5 † | 12 | 2 | The Jacobian matrix | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |
| math120.2.6 † | 12 | 2 | Double integrals | core | single-variable calculus: 8.01, Stat 110's continuous half and MATH 210 all stand on it |

#### MATH 140 — Multivariable Calculus — MIT 18.02 (Denis Auroux, Fall 2007)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math140.0.0 † | 50 | 2 | MIT 18.02, full course — lecture 1 | core | proposed addition, see audit.md |
| math140.0.1 † | 50 | 2 | MIT 18.02, full course — lecture 2 | core | proposed addition, see audit.md |
| math140.0.2 † | 50 | 2 | MIT 18.02, full course — lecture 3 | core | proposed addition, see audit.md |
| math140.0.3 † | 50 | 2 | MIT 18.02, full course — lecture 4 | core | proposed addition, see audit.md |
| math140.0.4 † | 50 | 2 | MIT 18.02, full course — lecture 5 | core | proposed addition, see audit.md |
| math140.0.5 † | 50 | 2 | MIT 18.02, full course — lecture 6 | core | proposed addition, see audit.md |
| math140.0.6 † | 50 | 2 | MIT 18.02, full course — lecture 7 | core | proposed addition, see audit.md |
| math140.0.7 † | 50 | 2 | MIT 18.02, full course — lecture 8 | core | proposed addition, see audit.md |
| math140.0.8 † | 50 | 2 | MIT 18.02, full course — lecture 9 | core | proposed addition, see audit.md |
| math140.0.9 † | 50 | 2 | MIT 18.02, full course — lecture 10 | core | proposed addition, see audit.md |
| math140.0.10 † | 50 | 2 | MIT 18.02, full course — lecture 11 | core | proposed addition, see audit.md |
| math140.0.11 † | 50 | 2 | MIT 18.02, full course — lecture 12 | core | proposed addition, see audit.md |
| math140.0.12 † | 50 | 2 | MIT 18.02, full course — lecture 13 | core | proposed addition, see audit.md |
| math140.0.13 † | 50 | 2 | MIT 18.02, full course — lecture 14 | core | proposed addition, see audit.md |
| math140.0.14 † | 50 | 2 | MIT 18.02, full course — lecture 15 | core | proposed addition, see audit.md |
| math140.0.15 † | 50 | 2 | MIT 18.02, full course — lecture 16 | core | proposed addition, see audit.md |
| math140.0.16 † | 50 | 2 | MIT 18.02, full course — lecture 17 | core | proposed addition, see audit.md |
| math140.0.17 † | 50 | 2 | MIT 18.02, full course — lecture 18 | core | proposed addition, see audit.md |
| math140.0.18 † | 50 | 2 | MIT 18.02, full course — lecture 19 | core | proposed addition, see audit.md |
| math140.0.19 † | 50 | 2 | MIT 18.02, full course — lecture 20 | core | proposed addition, see audit.md |
| math140.0.20 † | 50 | 2 | MIT 18.02, full course — lecture 21 | core | proposed addition, see audit.md |
| math140.0.21 † | 50 | 2 | MIT 18.02, full course — lecture 22 | core | proposed addition, see audit.md |
| math140.0.22 † | 50 | 2 | MIT 18.02, full course — lecture 23 | core | proposed addition, see audit.md |
| math140.0.23 † | 50 | 2 | MIT 18.02, full course — lecture 24 | core | proposed addition, see audit.md |
| math140.0.24 † | 50 | 2 | MIT 18.02, full course — lecture 25 | core | proposed addition, see audit.md |
| math140.0.25 † | 50 | 2 | MIT 18.02, full course — lecture 26 | core | proposed addition, see audit.md |
| math140.0.26 † | 50 | 2 | MIT 18.02, full course — lecture 27 | core | proposed addition, see audit.md |
| math140.0.27 † | 50 | 2 | MIT 18.02, full course — lecture 28 | core | proposed addition, see audit.md |
| math140.0.28 † | 50 | 2 | MIT 18.02, full course — lecture 29 | core | proposed addition, see audit.md |
| math140.0.29 † | 50 | 2 | MIT 18.02, full course — lecture 30 | core | proposed addition, see audit.md |
| math140.0.30 † | 50 | 2 | MIT 18.02, full course — lecture 31 | core | proposed addition, see audit.md |
| math140.0.31 † | 50 | 2 | MIT 18.02, full course — lecture 32 | core | proposed addition, see audit.md |
| math140.0.32 † | 50 | 2 | MIT 18.02, full course — lecture 33 | core | proposed addition, see audit.md |
| math140.0.33 † | 50 | 2 | MIT 18.02, full course — lecture 34 | core | proposed addition, see audit.md |
| math140.0.34 † | 50 | 2 | MIT 18.02, full course — lecture 35 | core | proposed addition, see audit.md |

#### MATH 150 — Differential Equations — MIT 18.03 (Arthur Mattuck, Spring 2006)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| math150.0.0 † | 50 | 2 | MIT 18.03, full course — lecture 1 | core | proposed addition, see audit.md |
| math150.0.1 † | 50 | 2 | MIT 18.03, full course — lecture 2 | core | proposed addition, see audit.md |
| math150.0.2 † | 50 | 2 | MIT 18.03, full course — lecture 3 | core | proposed addition, see audit.md |
| math150.0.3 † | 50 | 2 | MIT 18.03, full course — lecture 4 | core | proposed addition, see audit.md |
| math150.0.4 † | 50 | 2 | MIT 18.03, full course — lecture 5 | core | proposed addition, see audit.md |
| math150.0.5 † | 50 | 2 | MIT 18.03, full course — lecture 6 | core | proposed addition, see audit.md |
| math150.0.6 † | 50 | 2 | MIT 18.03, full course — lecture 7 | core | proposed addition, see audit.md |
| math150.0.7 † | 50 | 2 | MIT 18.03, full course — lecture 8 | core | proposed addition, see audit.md |
| math150.0.8 † | 50 | 2 | MIT 18.03, full course — lecture 9 | core | proposed addition, see audit.md |
| math150.0.9 † | 50 | 2 | MIT 18.03, full course — lecture 10 | core | proposed addition, see audit.md |
| math150.0.10 † | 50 | 2 | MIT 18.03, full course — lecture 11 | core | proposed addition, see audit.md |
| math150.0.11 † | 50 | 2 | MIT 18.03, full course — lecture 12 | core | proposed addition, see audit.md |
| math150.0.12 † | 50 | 2 | MIT 18.03, full course — lecture 13 | core | proposed addition, see audit.md |
| math150.0.13 † | 50 | 2 | MIT 18.03, full course — lecture 14 | core | proposed addition, see audit.md |
| math150.0.14 † | 50 | 2 | MIT 18.03, full course — lecture 15 | core | proposed addition, see audit.md |
| math150.0.15 † | 50 | 2 | MIT 18.03, full course — lecture 16 | core | proposed addition, see audit.md |
| math150.0.16 † | 50 | 2 | MIT 18.03, full course — lecture 17 | core | proposed addition, see audit.md |
| math150.0.17 † | 50 | 2 | MIT 18.03, full course — lecture 18 | core | proposed addition, see audit.md |
| math150.0.18 † | 50 | 2 | MIT 18.03, full course — lecture 19 | core | proposed addition, see audit.md |
| math150.0.19 † | 50 | 2 | MIT 18.03, full course — lecture 20 | core | proposed addition, see audit.md |
| math150.0.20 † | 50 | 2 | MIT 18.03, full course — lecture 21 | core | proposed addition, see audit.md |
| math150.0.21 † | 50 | 2 | MIT 18.03, full course — lecture 22 | core | proposed addition, see audit.md |
| math150.0.22 † | 50 | 2 | MIT 18.03, full course — lecture 23 | core | proposed addition, see audit.md |
| math150.0.23 † | 50 | 2 | MIT 18.03, full course — lecture 24 | core | proposed addition, see audit.md |
| math150.0.24 † | 50 | 2 | MIT 18.03, full course — lecture 25 | core | proposed addition, see audit.md |
| math150.0.25 † | 50 | 2 | MIT 18.03, full course — lecture 26 | core | proposed addition, see audit.md |
| math150.0.26 † | 50 | 2 | MIT 18.03, full course — lecture 27 | core | proposed addition, see audit.md |
| math150.0.27 † | 50 | 2 | MIT 18.03, full course — lecture 28 | core | proposed addition, see audit.md |
| math150.0.28 † | 50 | 2 | MIT 18.03, full course — lecture 29 | core | proposed addition, see audit.md |
| math150.0.29 † | 50 | 2 | MIT 18.03, full course — lecture 30 | core | proposed addition, see audit.md |
| math150.0.30 † | 50 | 2 | MIT 18.03, full course — lecture 31 | core | proposed addition, see audit.md |
| math150.0.31 † | 50 | 2 | MIT 18.03, full course — lecture 32 | core | proposed addition, see audit.md |
| math150.0.32 † | 50 | 2 | MIT 18.03, full course — lecture 33 | core | proposed addition, see audit.md |

#### PHYS 200 — Electricity and Magnetism — MIT 8.02 (Walter Lewin, Spring 2002)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| phys200.0.0 † | 50 | 2 | MIT 8.02, full course — lecture 1 | core | proposed addition, see audit.md |
| phys200.0.1 † | 50 | 2 | MIT 8.02, full course — lecture 2 | core | proposed addition, see audit.md |
| phys200.0.2 † | 50 | 2 | MIT 8.02, full course — lecture 3 | core | proposed addition, see audit.md |
| phys200.0.3 † | 50 | 2 | MIT 8.02, full course — lecture 4 | core | proposed addition, see audit.md |
| phys200.0.4 † | 50 | 2 | MIT 8.02, full course — lecture 5 | core | proposed addition, see audit.md |
| phys200.0.5 † | 50 | 2 | MIT 8.02, full course — lecture 6 | core | proposed addition, see audit.md |
| phys200.0.6 † | 50 | 2 | MIT 8.02, full course — lecture 7 | core | proposed addition, see audit.md |
| phys200.0.7 † | 50 | 2 | MIT 8.02, full course — lecture 8 | core | proposed addition, see audit.md |
| phys200.0.8 † | 50 | 2 | MIT 8.02, full course — lecture 9 | core | proposed addition, see audit.md |
| phys200.0.9 † | 50 | 2 | MIT 8.02, full course — lecture 10 | core | proposed addition, see audit.md |
| phys200.0.10 † | 50 | 2 | MIT 8.02, full course — lecture 11 | core | proposed addition, see audit.md |
| phys200.0.11 † | 50 | 2 | MIT 8.02, full course — lecture 12 | core | proposed addition, see audit.md |
| phys200.0.12 † | 50 | 2 | MIT 8.02, full course — lecture 13 | core | proposed addition, see audit.md |
| phys200.0.13 † | 50 | 2 | MIT 8.02, full course — lecture 14 | core | proposed addition, see audit.md |
| phys200.0.14 † | 50 | 2 | MIT 8.02, full course — lecture 15 | core | proposed addition, see audit.md |
| phys200.0.15 † | 50 | 2 | MIT 8.02, full course — lecture 16 | core | proposed addition, see audit.md |
| phys200.0.16 † | 50 | 2 | MIT 8.02, full course — lecture 17 | core | proposed addition, see audit.md |
| phys200.0.17 † | 50 | 2 | MIT 8.02, full course — lecture 18 | core | proposed addition, see audit.md |
| phys200.0.18 † | 50 | 2 | MIT 8.02, full course — lecture 19 | core | proposed addition, see audit.md |
| phys200.0.19 † | 50 | 2 | MIT 8.02, full course — lecture 20 | core | proposed addition, see audit.md |
| phys200.0.20 † | 50 | 2 | MIT 8.02, full course — lecture 21 | core | proposed addition, see audit.md |
| phys200.0.21 † | 50 | 2 | MIT 8.02, full course — lecture 22 | core | proposed addition, see audit.md |
| phys200.0.22 † | 50 | 2 | MIT 8.02, full course — lecture 23 | core | proposed addition, see audit.md |
| phys200.0.23 † | 50 | 2 | MIT 8.02, full course — lecture 24 | core | proposed addition, see audit.md |
| phys200.0.24 † | 50 | 2 | MIT 8.02, full course — lecture 25 | core | proposed addition, see audit.md |
| phys200.0.25 † | 50 | 2 | MIT 8.02, full course — lecture 26 | core | proposed addition, see audit.md |
| phys200.0.26 † | 50 | 2 | MIT 8.02, full course — lecture 27 | core | proposed addition, see audit.md |
| phys200.0.27 † | 50 | 2 | MIT 8.02, full course — lecture 28 | core | proposed addition, see audit.md |
| phys200.0.28 † | 50 | 2 | MIT 8.02, full course — lecture 29 | core | proposed addition, see audit.md |
| phys200.0.29 † | 50 | 2 | MIT 8.02, full course — lecture 30 | core | proposed addition, see audit.md |
| phys200.0.30 † | 50 | 2 | MIT 8.02, full course — lecture 31 | core | proposed addition, see audit.md |
| phys200.0.31 † | 50 | 2 | MIT 8.02, full course — lecture 32 | core | proposed addition, see audit.md |
| phys200.0.32 † | 50 | 2 | MIT 8.02, full course — lecture 33 | core | proposed addition, see audit.md |
| phys200.0.33 † | 50 | 2 | MIT 8.02, full course — lecture 34 | core | proposed addition, see audit.md |
| phys200.0.34 † | 50 | 2 | MIT 8.02, full course — lecture 35 | core | proposed addition, see audit.md |
| phys200.0.35 † | 50 | 2 | MIT 8.02, full course — lecture 36 | core | proposed addition, see audit.md |

#### PHYS 300 — Statistical Mechanics — Stanford (Leonard Susskind, 2013)

| Key | Min | Lvl | Title | Mark | Reason |
|---|---:|---:|---|---|---|
| phys300.0.0 † | 105 | 3 | Stanford Statistical Mechanics — lecture 1 | core | proposed addition, see audit.md |
| phys300.0.1 † | 105 | 3 | Stanford Statistical Mechanics — lecture 2 | core | proposed addition, see audit.md |
| phys300.0.2 † | 105 | 3 | Stanford Statistical Mechanics — lecture 3 | core | proposed addition, see audit.md |
| phys300.0.3 † | 105 | 3 | Stanford Statistical Mechanics — lecture 4 | core | proposed addition, see audit.md |
| phys300.0.4 † | 105 | 3 | Stanford Statistical Mechanics — lecture 5 | core | proposed addition, see audit.md |
| phys300.0.5 † | 105 | 3 | Stanford Statistical Mechanics — lecture 6 | core | proposed addition, see audit.md |
| phys300.0.6 † | 105 | 3 | Stanford Statistical Mechanics — lecture 7 | core | proposed addition, see audit.md |
| phys300.0.7 † | 105 | 3 | Stanford Statistical Mechanics — lecture 8 | core | proposed addition, see audit.md |
| phys300.0.8 † | 105 | 3 | Stanford Statistical Mechanics — lecture 9 | core | proposed addition, see audit.md |
| phys300.0.9 † | 105 | 3 | Stanford Statistical Mechanics — lecture 10 | core | proposed addition, see audit.md |
<!-- END GENERATED -->
