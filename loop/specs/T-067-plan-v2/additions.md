# The seven additions (tutor's decision, 12 Nov)

Exactly these seven, in priority order. They are in `plan-data.js` and `prerequisites.json` under provisional keys, and in every date in `dates.md` and `sequence.md` (option A, everything included). **No id, playlist, lecture count or length below was confirmed in this session**: the transcript tools were down and youtube.com was blocked (see `python-bridge.md`). Each is marked `unverified` in the data and must be checked by transcript before step 2 writes it into `platform/data`.

| # | Course | Key | Lectures × min | Hours | Line and slot | Computed dates (first → last lecture) |
|---:|---|---|---|---:|---|---|
| 1 | **MIT Missing Semester** (2020) | `cs110.0.0–0.10` | 11 × ~52 | ~9.5 | AI line, **Fridays**, after the bridge's no-code talks end; before the first open-source PR | 12 Feb → 9 Jul 2027 |
| 2 | **MIT 6.006 Introduction to Algorithms** (Spring 2020) | `cs150.0.0–0.20` (CS 150's first lecture unit) | 21 × ~56 | ~19.5 | AI line, right after Zero to Hero, **alternating with AI 210** | 16 Mar → 3 Jun 2027 |
| 3 | **MIT 18.02 Multivariable Calculus** (Auroux, Fall 2007) | `math140.0.0–0.34` | 35 × ~50 | ~29 | Math line, after 18.01, **alternating with MATH 210** (it joins the core rotation). Replaces the 1.3 h Khan multivariable bridge, which is dropped | 23 Feb → 14 Jun 2027 |
| 4 | **MIT 18.650 Statistics for Applications** (Rigollet, Fall 2016) | `math160.0.0–0.23` | 24 × ~75 | ~30 | Math line, after Stat 110 and 18.02, **before AI 310 Unit II** (`ai310.1.0` needs its last lecture) | 14 Jul → 7 Sep 2027 |
| 5 | **MIT 18.03 Differential Equations** (Mattuck, Spring 2006) | `math150.0.0–0.32` | 33 × ~50 | ~27.5 | Math line, after 18.02, **in rotation with 8.02** | 13 Oct → 27 Dec 2027 |
| 6 | **Statistical Mechanics** (Susskind, Stanford 2013) | `phys300.0.0–0.9` | 10 × ~105 | ~17.5 | Math line, **straight after MacKay** (`math210.2.15`) | 8 Sep → 12 Oct 2027 |
| 7 | **MIT 8.02 Electricity and Magnetism** (Lewin, Spring 2002) | `phys200.0.0–0.35` | 36 × ~50 | ~30 | Math line, **last**; after 8.01 and 18.02, in rotation with 18.03 | 14 Oct → 31 Dec 2027 |

Total about 163 hours of video. Candidate playlists (all unverified): Missing Semester `PLyzOVJj3bHQuloKGG59rS43e29ro7I57J`; 6.006 `PLUl4u3cNGP63EdVPNLG3ToM6LaEUuStEY`; 18.02 `PL4C4C8A7D06566F38`; 18.650 `PLUl4u3cNGP60uVBMaoNERc6knT_MgPKS0`; 18.03 `PLEC88901EBADDD980`; Susskind and 8.02 not identified.

## Why each, and what it unlocks

1. **Missing Semester.** The shell, scripting, Vim, data wrangling, Git, debugging and profiling. These are the tools nobody teaches and every lab and open-source project assumes. **Unlocks:** working in a real repository: a clean pull request (gate 3's first merged PR), reproducible experiment scripts, profiling before optimising (SYS 250). Needs: nothing beyond the bridge.
2. **MIT 6.006.** CS 150 has the NeetCode 150 problems but no lectures. Problems teach patterns; 6.006 teaches why they work: asymptotic analysis, hashing, balanced trees, heaps, graph search, shortest paths, dynamic programming, complexity. **Unlocks:** the analysis behind the gate-2 DSA count, technical interviews (gate 5), and reading systems papers that argue in big-O (FlashAttention's IO complexity, paged KV caches). Needs: Zero to Hero done (so it never competes with Karpathy) and CS50P 9.
3. **MIT 18.02.** Partial derivatives, gradients, the chain rule in many variables, Lagrange multipliers, double and triple integrals, change of variables, line and surface integrals, Green, Stokes and divergence. **Unlocks:** MATH 210 (matrix calculus starts from the gradient and the multivariable chain rule: `math210.0.0` needs 18.02's gradient lecture, `math210.0.2` its chain rule), Stat 110's joint densities (double integrals) and transformations (change of variables), 18.650, 18.03, 8.02 (which is written in 18.02's language) and statistical mechanics. Needs: the end of 18.01 and the cross product.
4. **MIT 18.650.** Stat 110 is probability: from a model to data. 18.650 is inference, from data back to the model: estimation, confidence intervals, hypothesis tests, maximum likelihood, regression, Bayesian statistics, GLMs. **Unlocks:** every experiment the owner will run. Evaluation (AI 310 Unit II's evals, contamination, "why public benchmarks lie"), A/B tests as a founder, and honest error bars on a paper's numbers. Needs: Stat 110 and 18.02.
5. **MIT 18.03.** First- and second-order linear ODEs, oscillators and resonance, Fourier series, Laplace transforms, linear systems and phase portraits. **Unlocks:** physics as equations of motion (8.01's oscillators properly, 8.02's circuits), and the ODE view of ML (gradient flow, neural ODEs, diffusion models as SDEs). MATH 110's `exp(At)` lecture becomes a special case. Needs: 18.02.
6. **Statistical Mechanics.** Entropy, the Boltzmann distribution, partition functions, free energy, temperature as a Lagrange multiplier, the Ising model. **Unlocks:** the physics under ML: softmax is a Boltzmann distribution, log-sum-exp is a free energy, energy-based models, simulated annealing, diffusion and variational inference. Placed straight after MacKay so the information-theoretic and the physical entropy meet within weeks. Needs: MacKay, 8.01's ideal gas, the CLT, Lagrange multipliers (18.02).
7. **MIT 8.02.** Electric and magnetic fields, Gauss, Ampère, Faraday, circuits, Maxwell's equations, electromagnetic waves. **Unlocks:** the second pillar of classical physics, the hardware the owner computes on, and the field-theory vocabulary (flux, curl, divergence) used across physics-inspired ML. Needs: 8.01 and 18.02.

## Rules for the additions

- **Core lectures take priority over additions on a shared line**, with one exception: 18.02 alternates with MATH 210. In the simulation, 18.02 joins the core rotation of the Math & Physics line. 18.650, statistical mechanics, 18.03 and 8.02 run only on a day when no core course on that line has a lecture ready. 6.006 alternates with AI 210 on the AI line. Missing Semester uses only the Friday lane.
- **An added course counts only once its problem sets and one timed exam are done.** Watching the lectures is not completing it. (Step 2 needs a per-course "problem sets done / exam done" record for these seven; today only the lecture ticks exist.)
- **An added course never takes from the 75-minute coding block.** Its problems go in the 45-minute math block (18.02, 18.650, 18.03, 8.02, statistical mechanics) or in its own lecture time (6.006's problem sets, Missing Semester's exercises). The coding block stays with CS50P, Karpathy rebuilds, NeetCode and the paper reimplementations.

## If behind at gate 3 (16 Dec 2027): the drop order

1. Defer **8.02** (computed to be still running at gate 3).
2. Trim **18.03's Laplace-transform lectures** (about lectures 19–22; exact numbers to be fixed from the transcripts).
3. Defer **statistical mechanics**.

**Never drop** 18.02, 18.650, 6.006 or Missing Semester.

## Not now, and why

| Course | Why not now |
|---|---|
| Stanford EE364A Convex Optimization (Boyd) | MATH 210 already has Boyd's book chapters 2–3 and the optimisation unit. The full course pays off only on a research path that needs duality and solvers. |
| MIT 8.04 Quantum Physics | The next physics after 8.02 and 18.03, but no part of the AI path needs it before the fork. |
| Stanford CS229 Machine Learning | Largely covered by fast.ai, Karpathy, MATH 210 and 18.650 together. The overlap is too large for its hours. |
| Stanford CS231n | Its two optimisation lectures are already in MATH 210 Unit II; the rest overlaps Karpathy, SYS 250 and the vision papers. |
| Real analysis | The first elective **if gate 4 picks the research path**: proofs and rigour for theory work. Not needed to engineer or build. |
| MIT 18.065 (Strang, matrix methods in data analysis) | Overlaps 18.06 plus MATH 210; a second pass, not a new idea. |
| Computer architecture, signal processing | Useful later (architecture for kernels, signals for audio and vision), but SYS 250's GPU unit covers what the AI path needs now. |
