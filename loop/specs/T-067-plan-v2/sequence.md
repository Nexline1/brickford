# The v2 sequence — one ordered line per track

**Derived, not hand-written.** `node tools/plan-dates.js` walks the study calendar from the cutover and, each day, schedules on each track the next lecture whose prerequisites (`prerequisites.json`) are all already scheduled. It packs days with the app's own rules (EFFORT = min × 1.8 + 4; a lecture over 1.15 × the budget spans days, "part 2 of 4"; short ones share a day up to 1.05 × the budget). Optional and duplicate lectures are never scheduled. The table below is its output; the simulation also checks that no track jumps more than one level between consecutive lectures (it reports none).

**Option A (owner, 12 Nov), everything included.** The tables below are the full plan: core lectures, the shorter Python bridge, and the seven additions (`additions.md`), with the real video lengths checked on 12 Nov.

**Cutover:** Sunday 22 Nov 2026 (provisional: "the Sunday after step 2 ships"), study day 32. Every day before it keeps exactly what v1 gave it. Assumptions for the simulation:
- Theory and Storytelling: everything v1 scheduled before the cutover is done, or owed on its own day, as today.
- Build: only the 3Blue1Brown primer and Micrograd to Makemore 4 count as watched (owner, 10 Nov). Everything after Makemore 4 is re-scheduled after the second pass.

## The day (six days a week, about 5 hours)

| Block | Budget (effort-min) | About | What |
|---|---:|---|---|
| Math & Physics | 90 | 1 h 30 | One lecture with notes, or several short chapters. One line, explained below the table. |
| AI / Python / Build | 60 | 1 h | The shorter bridge (CS50P 3–9, NumPy, PyTorch), then Karpathy typed along (about 31 min of video a day), then papers, fast.ai alternating with **6.006**, SYS 250, CS336 and RES 400. **Fridays** have their own lane: the no-code talks, then **Missing Semester**. A long Friday item continues the next Friday. **When the Math & Physics line is finished, its 90 minutes go to this line**, so theory stays about 3 hours. |
| Storytelling | 40 | 40 min | Unchanged (owner default, 12 Nov). SPCH 100 runs five days a week; Friday is the weekly recorded rep. |
| Practice | not lecture time | 2 h | About 75 min coding: the CS50P problem sets, then "rebuild it without the video", then paper reimplementations, plus two easy NeetCode problems a day from bridge week 3. **No added course takes from this coding block.** About 45 min math: problems and one written answer, including the problem sets of 18.02, 18.650, 18.03, 8.02 and statistical mechanics. |

Theory comes to about 3 h 10 (190 effort-minutes), and practice to 2 h.

**The Math & Physics line.** Core courses rotate by readiness (prerequisites met): 18.06, 18.01, Stat 110, 8.01 and MATH 210. **18.02 joins that rotation, so it alternates with MATH 210.** The other additions run only on a day when no core course on the line has a lecture ready, in this order:
1. 18.650, after Stat 110 and 18.02;
2. statistical mechanics, straight after MacKay;
3. 18.03 and 8.02, alternating.

**Where physics sits.** PHYS 100 enters after the Second Fundamental Theorem of 18.01 (`math120.1.17`), so it never comes before the calculus it uses. In v1 it waited for day 183 and then ran every fourth day.

<!-- BEGIN GENERATED -->
Generated from prerequisites.json by tools/plan-dates.js. Cutover 2026-11-22 = study day 32. Budgets: Math & Physics 90, AI/Python/Build 60, Storytelling 40 (unchanged) effort-minutes, EFFORT = min × 1.8 + 4. Level jumps > 1 inside a track: none.

### The first 8 weeks, day by day

| Study day | Date | Math & Physics (~1 h 30) | AI / Python (~1 h) | Storytelling (~40 min, unchanged) |
|---:|---|---|---|---|
| 32 | Sun 2026-11-22 | math110.1.8 Independence, Basis, and Dimension | cs100.0.3† Lecture 3 — Exceptions (part 1/2) | spch100.4.1 |
| 33 | Mon 2026-11-23 | math120.1.7 Linear and Quadratic Approximations | cs100.0.3† Lecture 3 — Exceptions (part 2/2) | spch100.4.2 |
| 34 | Tue 2026-11-24 | math130.0.10 The Poisson distribution | cs100.0.4† Lecture 4 — Libraries (part 1/3) | spch100.4.2 |
| 35 | Wed 2026-11-25 | math110.1.9 The Four Fundamental Subspaces | cs100.0.4† Lecture 4 — Libraries (part 2/3) | spch100.4.3 |
| 36 | Thu 2026-11-26 | math120.1.8 Curve Sketching | cs100.0.4† Lecture 4 — Libraries (part 3/3) | spch100.4.4 |
| 37 | Fri 2026-11-27 | math110.1.10 Matrix Spaces; Rank 1; Small World Graphs | cs100.2.0† Large Language Models explained briefly | weekly recorded rep |
| 38 | Sun 2026-11-29 | math120.1.9 Max-min | cs100.0.5† Lecture 5 — Unit Tests (part 1/2) | spch100.4.5 |
| 39 | Mon 2026-11-30 | math110.1.11 Graphs, Networks, Incidence Matrices | cs100.0.5† Lecture 5 — Unit Tests (part 2/2) | spch100.4.5 |
| 40 | Tue 2026-12-01 | math120.1.10 Related Rates | cs100.0.6† Lecture 6 — File I/O (part 1/3) | spch100.4.6 |
| 41 | Wed 2026-12-02 | math110.1.12 Quiz 1 Review | cs100.0.6† Lecture 6 — File I/O (part 2/3) | spch100.4.6 |
| 42 | Thu 2026-12-03 | math120.1.11 Newton's Method | cs100.0.6† Lecture 6 — File I/O (part 3/3) | spch100.4.7 |
| 43 | Fri 2026-12-04 | math110.1.13 Orthogonal Vectors and Subspaces | cs100.2.1† Transformers, the tech behind LLMs (Deep Learning ch. 5) | weekly recorded rep |
| 44 | Sun 2026-12-06 | math120.1.12 Mean Value Theorem | cs100.0.7† Lecture 7 — Regular Expressions (part 1/4) | spch100.4.7 |
| 45 | Mon 2026-12-07 | math110.1.14 Projections onto Subspaces | cs100.0.7† Lecture 7 — Regular Expressions (part 2/4) | spch100.4.7 |
| 46 | Tue 2026-12-08 | math120.1.13 Antiderivatives | cs100.0.7† Lecture 7 — Regular Expressions (part 3/4) | spch100.4.8 |
| 47 | Wed 2026-12-09 | math110.1.15 Projection Matrices and Least Squares | cs100.0.7† Lecture 7 — Regular Expressions (part 4/4) | spch100.4.8 |
| 48 | Thu 2026-12-10 | math120.1.14 Differential Equations | cs100.0.8† Lecture 8 — Object-Oriented Programming (part 1/6) | spch100.4.9 |
| 49 | Fri 2026-12-11 | math110.1.16 Orthogonal Matrices and Gram-Schmidt | cs100.2.2† Attention in transformers, step by step (Deep Learning ch. 6 | weekly recorded rep |
| 50 | Sun 2026-12-13 | math120.1.15 Definite Integrals | cs100.0.8† Lecture 8 — Object-Oriented Programming (part 2/6) | spch100.4.10 |
| 51 | Mon 2026-12-14 | math130.0.11 Discrete vs. Continuous, the Uniform | cs100.0.8† Lecture 8 — Object-Oriented Programming (part 3/6) | spch100.4.11 |
| 52 | Tue 2026-12-15 | math110.1.17 Properties of Determinants | cs100.0.8† Lecture 8 — Object-Oriented Programming (part 4/6) | spch100.4.12 |
| 53 | Wed 2026-12-16 | math120.1.16 First Fundamental Theorem | cs100.0.8† Lecture 8 — Object-Oriented Programming (part 5/6) | spch100.5.0 |
| 54 | Thu 2026-12-17 | math110.1.18 Determinant Formulas and Cofactors | cs100.0.8† Lecture 8 — Object-Oriented Programming (part 6/6) | spch100.5.1 |
| 55 | Fri 2026-12-18 | math120.1.17 Second Fundamental Theorem | cs100.2.3† How might LLMs store facts (Deep Learning ch. 7) | weekly recorded rep |
| 56 | Sun 2026-12-20 | phys100.0.0 Introduction + phys100.0.1 Units, Dimensions, and Scaling Arguments | cs100.0.9† Lecture 9 — Et Cetera (sets, comprehensions, generators, *ar (part 1/5) | spch100.5.2 |
| 57 | Mon 2026-12-21 | math110.1.19 Cramer's Rule, Inverse Matrix, and Volume | cs100.0.9† Lecture 9 — Et Cetera (sets, comprehensions, generators, *ar (part 2/5) | spch100.5.3, spch100.5.4 |
| 58 | Tue 2026-12-22 | math120.1.18 Applications to Logarithms | cs100.0.9† Lecture 9 — Et Cetera (sets, comprehensions, generators, *ar (part 3/5) | spch100.5.5 |
| 59 | Wed 2026-12-23 | phys100.0.2 Introduction to Kinematics | cs100.0.9† Lecture 9 — Et Cetera (sets, comprehensions, generators, *ar (part 4/5) | spch100.5.6, spch100.5.7 |
| 60 | Thu 2026-12-24 | math110.1.20 Eigenvalues and Eigenvectors | cs100.0.9† Lecture 9 — Et Cetera (sets, comprehensions, generators, *ar (part 5/5) | spch100.5.8 |
| 61 | Fri 2026-12-25 | math120.1.19 Volumes | ai200.2.1 Deep dive into LLMs like ChatGPT (part 1/7) | weekly recorded rep |
| 62 | Sun 2026-12-27 | phys100.0.3 Vectors | cs100.1.0† NumPy for beginners (freeCodeCamp, Keith Galli) (part 1/2) | spch100.5.9 |
| 63 | Mon 2026-12-28 | math110.1.21 Diagonalization and Powers of A | cs100.1.0† NumPy for beginners (freeCodeCamp, Keith Galli) (part 2/2) | spch100.5.9 |
| 64 | Tue 2026-12-29 | math120.1.20 Work, Probability | cs100.1.1† PyTorch fundamentals: tensors, shapes, indexing, matmul, bro (part 1/5) | spch100.5.10 |
| 65 | Wed 2026-12-30 | phys100.0.4 The Motion of Projectiles | cs100.1.1† PyTorch fundamentals: tensors, shapes, indexing, matmul, bro (part 2/5) | spch100.5.11 |
| 66 | Thu 2026-12-31 | math110.1.22 Differential Equations and exp(At) | cs100.1.1† PyTorch fundamentals: tensors, shapes, indexing, matmul, bro (part 3/5) | spch100.5.11 |
| 67 | Fri 2027-01-01 | math120.1.21 Numerical Integration | ai200.2.1 Deep dive into LLMs like ChatGPT (part 2/7) | weekly recorded rep |
| 68 | Sun 2027-01-03 | phys100.0.5 Uniform Circular Motion | cs100.1.1† PyTorch fundamentals: tensors, shapes, indexing, matmul, bro (part 4/5) | spch100.5.11 |
| 69 | Mon 2027-01-04 | math110.1.23 Markov Matrices; Fourier Series | cs100.1.1† PyTorch fundamentals: tensors, shapes, indexing, matmul, bro (part 5/5) | spch100.5.12, spch100.5.13, spch100.5.14 |
| 70 | Tue 2027-01-05 | math120.1.22 Exam 3 Review | ai200.3.0† Micrograd — spelled-out intro to neural networks and backpro (part 1/5) | spch100.5.15 |
| 71 | Wed 2027-01-06 | math130.0.12 Normal distribution | ai200.3.0† Micrograd — spelled-out intro to neural networks and backpro (part 2/5) | spch100.5.16 |
| 72 | Thu 2027-01-07 | phys100.0.6 Newton's First, Second, and Third Laws | ai200.3.0† Micrograd — spelled-out intro to neural networks and backpro (part 3/5) | spch100.6.0 |
| 73 | Fri 2027-01-08 | math110.1.24 Quiz 2 Review | ai200.2.1 Deep dive into LLMs like ChatGPT (part 3/7) | weekly recorded rep |
| 74 | Sun 2027-01-10 | math120.1.23 Trig Integrals | ai200.3.0† Micrograd — spelled-out intro to neural networks and backpro (part 4/5) | spch100.6.1 |
| 75 | Mon 2027-01-11 | math130.0.13 Location, Scale, and LOTUS | ai200.3.0† Micrograd — spelled-out intro to neural networks and backpro (part 5/5) | spch100.6.2, spch100.6.3 |
| 76 | Tue 2027-01-12 | phys100.0.7 Weight, Perceived Gravity, and Weightlessnes | ai200.3.1† Makemore 1 — bigram character-level language model (second p (part 1/4) | spch100.6.4, spch100.6.5 |
| 77 | Wed 2027-01-13 | math110.1.25 Symmetric Matrices and Positive Definiteness | ai200.3.1† Makemore 1 — bigram character-level language model (second p (part 2/4) | spch100.6.6, spch100.6.7, spch100.6.8 |
| 78 | Thu 2027-01-14 | math120.1.24 Inverse Substitution | ai200.3.1† Makemore 1 — bigram character-level language model (second p (part 3/4) | spch100.6.9 |
| 79 | Fri 2027-01-15 | math130.0.15 Exponential Distribution | ai200.2.1 Deep dive into LLMs like ChatGPT (part 4/7) | weekly recorded rep |

### After that, week by week (six study days each)

| Week | From | Math & Physics | AI / Python / Build |
|---:|---|---|---|
| 9 | 2027-01-17 | 6 lectures: phys100.0.8 Frictional Forces … math120.1.26 Integration by Parts | 4 lectures: ai200.3.1 Makemore 1 — bigram character-leve … ai200.2.1 Deep dive into LLMs like ChatGPT |
| 10 | 2027-01-24 | 6 lectures: phys100.0.11 Work, Energy, and Universal Gravit … math120.1.28 Polar Coordinates | 3 lectures: ai200.3.3 Makemore 3 — activations, gradient … ai200.2.1 Deep dive into LLMs like ChatGPT |
| 11 | 2027-01-31 | 6 lectures: phys100.0.13 Equation of Motion for Simple Harm … math120.1.30 Indeterminate Forms | 4 lectures: ai200.3.4 Makemore 4 — becoming a backprop n … ai200.2.1 Deep dive into LLMs like ChatGPT |
| 12 | 2027-02-07 | 6 lectures: phys100.0.15 Momentum and Its Conservation … math120.1.32 Infinite Series | 3 lectures: ai200.1.6 Let's build GPT — from scratch, in … cs110.0.0 Lecture 1: Course Overview + The S |
| 13 | 2027-02-14 | 6 lectures: phys100.0.17 Momentum of Individual Objects, Ro … math120.1.34 Final Review | 3 lectures: ai200.1.7 Let's build the GPT Tokenizer … cs110.0.0 Lecture 1: Course Overview + The S |
| 14 | 2027-02-21 | 6 lectures: math130.0.17 MGFs Continued … phys100.0.22 Kepler's Laws, Elliptical Orbits,  | 2 lectures: ai200.1.8 Let's reproduce GPT-2 (124M) … cs110.0.1 Lecture 2: Shell Tools and Scripti |
| 15 | 2027-02-28 | 6 lectures: math140.0.2 Lec 3: Matrices; inverse matrices … phys100.0.25 Static Equilibrium, Stability, Rop | 4 lectures: ai200.1.8 Let's reproduce GPT-2 (124M) … cs110.0.1 Lecture 2: Shell Tools and Scripti |
| 16 | 2027-03-07 | 6 lectures: math140.0.5 Lec 6: Velocity, acceleration; Kep … phys100.0.28 Hydrostatics, Archimedes' Principl | 3 lectures: ai300.1.2 GPT-2 — Language Models are Unsupe … cs110.0.2 Lecture 3: Editors (Vim) (2020) |
| 17 | 2027-03-14 | 6 lectures: math140.0.8 Lec 9: Max-min problems; least squ … phys100.0.32 Thermal Expansion | 4 lectures: ai210.0.0 Lesson 1: Getting started … cs110.0.2 Lecture 3: Editors (Vim) (2020) |
| 18 | 2027-03-21 | 5 lectures: math140.0.11 Lec 12: Gradient; directional deri … phys100.0.34 Heisenberg's Uncertainty Principle | 4 lectures: ai210.0.1 Lesson 2: Deployment … cs110.0.3 Lecture 4: Data Wrangling (2020) |
| 19 | 2027-03-28 | 5 lectures: math210.0.1 Lecture 1 Part 2: Derivatives as L … math210.0.3 Lecture 2 Part 2: Vectorization of | 4 lectures: ai210.0.2 Lesson 3: Neural net foundations … cs110.0.3 Lecture 4: Data Wrangling (2020) |
| 20 | 2027-04-04 | 6 lectures: math140.0.15 Lec 16: Double integrals … math210.0.5 Lecture 3 Part 2: Finite-Differenc | 4 lectures: ai210.0.3 Lesson 4: Natural language (NLP) … cs110.0.4 Lecture 5: Command-line Environmen |
| 21 | 2027-04-11 | 5 lectures: math140.0.17 Lec 18: Change of variables … math130.0.21 Transformations and Convolutions | 3 lectures: ai210.0.4 Lesson 5: From-scratch model … cs110.0.4 Lecture 5: Command-line Environmen |
| 22 | 2027-04-18 | 6 lectures: math210.0.7 Lecture 4 Part 2: Nonlinear Root F … math130.0.23 Gamma distribution and Poisson pro | 3 lectures: ai210.0.7 Lesson 8: Convolutions (CNNs) … cs110.0.5 Lecture 6: Version Control (git) ( |
| 23 | 2027-04-25 | 6 lectures: math210.0.9 Lecture 5 Part 2: Forward Automati … math130.0.25 Conditional Expectation Continued | 4 lectures: cs150.0.6 7. Binary Trees, Part 2: AVL … cs110.0.5 Lecture 6: Version Control (git) ( |
| 24 | 2027-05-02 | 5 lectures: math210.0.11 Lecture 6 Part 1: Adjoint Differen … math140.0.24 Lec 25: Triple integrals in rectan | 4 lectures: cs150.0.8 9. Breadth-First Search … cs110.0.5 Lecture 6: Version Control (git) ( |
| 25 | 2027-05-09 | 5 lectures: math130.0.27 Inequalities … math210.0.14 Lecture 7 Part 2: Second Derivativ | 4 lectures: cs150.0.11 12. Bellman-Ford … cs110.0.6 Lecture 7: Debugging and Profiling |
| 26 | 2027-05-16 | 6 lectures: math140.0.26 Lec 27: Vector fields in 3D; surfa … math210.1.0 Loss functions and optimization (C | 4 lectures: cs150.0.13 14. APSP and Johnson … cs110.0.6 Lecture 7: Debugging and Profiling |
| 27 | 2027-05-23 | 5 lectures: math210.1.0 Loss functions and optimization (C … math140.0.29 Lec 30: Line integrals in space, c | 4 lectures: cs150.0.16 17. Dynamic Programming, Part 3: A … cs110.0.7 Lecture 8: Metaprogramming (2020) |
| 28 | 2027-05-30 | 5 lectures: math130.0.32 Markov Chains Continued Further … math210.1.3 Why momentum really works — read a | 4 lectures: cs150.0.18 19. Complexity … cs110.0.7 Lecture 8: Metaprogramming (2020) |
| 29 | 2027-06-06 | 6 lectures: math140.0.31 Lec 32: Stokes' theorem (cont.); r … math210.2.0 Introduction to Information Theory | 3 lectures: sys250.0.0 Introduction and Logistics … cs110.0.8 Lecture 9: Security and Cryptograp |
| 30 | 2027-06-13 | 5 lectures: math210.2.0 Introduction to Information Theory … math210.2.3 Entropy and Data Compression (III) | 4 lectures: sys250.0.2 "Manual" Neural Networks … cs110.0.8 Lecture 9: Security and Cryptograp |
| 31 | 2027-06-20 | 4 lectures: math210.2.4 Entropy and Data Compression (IV): … math210.2.7 Noisy Channel Coding (III): The No | 4 lectures: sys250.0.4 Automatic Differentiation … cs110.0.9 Lecture 10: Potpourri (2020) |
| 32 | 2027-06-27 | 4 lectures: math210.2.8 A Noisy Channel Coding Gem, And An … math210.2.11 Approximating Probability Distribu | 4 lectures: sys250.0.6 Fully connected networks, optimiza … cs110.0.9 Lecture 10: Potpourri (2020) |
| 33 | 2027-07-04 | 4 lectures: math210.2.11 Approximating Probability Distribu … math210.2.14 Data Modelling With Neural Network | 4 lectures: sys250.0.8 Neural Network Library Implementat … cs110.0.10 Lecture 11: Q&A (2020) |
| 34 | 2027-07-11 | 4 lectures: math210.2.14 Data Modelling With Neural Network … math160.0.1 2. Introduction to Statistics (con | 3 lectures: sys250.0.10 Convolutional Networks … cs110.0.10 Lecture 11: Q&A (2020) |
| 35 | 2027-07-18 | 4 lectures: math160.0.1 2. Introduction to Statistics (con … math160.0.4 5. Maximum Likelihood Estimation ( | 3 lectures: ai300.0.1 ResNet — Deep Residual Learning (2 … ai300.0.3 CLIP — Learning Transferable Visua |
| 36 | 2027-07-25 | 4 lectures: math160.0.4 5. Maximum Likelihood Estimation ( … math160.0.7 8. Parametric Hypothesis Testing ( | 4 lectures: ai300.0.3 CLIP — Learning Transferable Visua … sys250.0.13 Hardware Acceleration Implemention |
| 37 | 2027-08-01 | 4 lectures: math160.0.7 8. Parametric Hypothesis Testing ( … math160.0.10 12. Testing Goodness of Fit (cont. | 3 lectures: sys250.0.13 Hardware Acceleration Implemention … sys250.0.15 Training Large Models |
| 38 | 2027-08-08 | 4 lectures: math160.0.10 12. Testing Goodness of Fit (cont. … math160.0.13 15. Regression (cont.) | 3 lectures: sys250.0.16 Generative Adversarial Networks … sys250.0.18 Sequence Modeling and Recurrent Ne |
| 39 | 2027-08-15 | 4 lectures: math160.0.13 15. Regression (cont.) … math160.0.16 19. Principal Component Analysis | 3 lectures: sys250.0.19 RNN Implementation … sys250.0.21 Transformer Implementation |
| 40 | 2027-08-22 | 4 lectures: math160.0.16 19. Principal Component Analysis … math160.0.19 22. Generalized Linear Models (con | 4 lectures: sys250.0.21 Transformer Implementation … sys250.1.0 How to profile CUDA kernels in PyT |
| 41 | 2027-08-29 | 4 lectures: math160.0.19 22. Generalized Linear Models (con … phys300.0.0 Statistical Mechanics Lecture 1 | 3 lectures: sys250.1.0 How to profile CUDA kernels in PyT … sys250.1.2 Getting Started With CUDA for Pyth |
| 42 | 2027-09-05 | 4 lectures: phys300.0.0 Statistical Mechanics Lecture 1 … phys300.0.3 Statistical Mechanics Lecture 4 | 3 lectures: sys250.1.3 Compute and Memory Basics … sys250.1.5 CUDA Performance Checklist |
| 43 | 2027-09-12 | 3 lectures: phys300.0.3 Statistical Mechanics Lecture 4 … phys300.0.5 Statistical Mechanics Lecture 6 | 3 lectures: sys250.1.5 CUDA Performance Checklist … sys250.1.7 Flash Attention |
| 44 | 2027-09-19 | 3 lectures: phys300.0.5 Statistical Mechanics Lecture 6 … phys300.0.7 Statistical Mechanics Lecture 8 | 3 lectures: sys250.1.7 Flash Attention … sys250.1.8 Practitioners Guide to Triton |
| 45 | 2027-09-26 | 2 lectures: phys300.0.8 Statistical Mechanics Lecture 9 … phys300.0.9 Statistical Mechanics Lecture 10 | 2 lectures: sys250.1.9 Hacker's Guide to Speculative Deco … sys250.1.10 int8 tensorcore matmul for Turing |
| 46 | 2027-10-03 | 6 lectures: math150.0.0 Lec 1 … phys200.0.2 Lec 03: Electric Flux and Gauss's  | 2 lectures: sys250.1.11 Mosaic GPU … ai310.0.0 Lecture 1: Overview and Tokenizati |
| 47 | 2027-10-10 | 6 lectures: math150.0.3 Lec 4 … phys200.0.5 Lec 06: High-Voltage Breakdown and | 2 lectures: ai310.0.1 Lec. 2: Pytorch, Resource Accounti … ai310.0.2 Lec. 3: Architectures, Hyperparame |
| 48 | 2027-10-17 | 6 lectures: math150.0.6 Lec 7 … phys200.0.8 Lec 09: Currents, Resistivity and  | 2 lectures: ai310.0.3 Lecture 4: Mixture of experts … ai300.3.1 Mixtral — Mixture of Experts (2024 |
| 49 | 2027-10-24 | 6 lectures: math150.0.9 Lec 10 … phys200.0.11 Lec 12: Review Exam 1 (Secret Top! | 3 lectures: ai300.3.2 DDPM — Denoising Diffusion Probabi … ai310.0.5 Lecture 6: Kernels, Triton |
| 50 | 2027-10-31 | 6 lectures: math150.0.12 Lec 13 … phys200.0.14 Lec 15: Ampère's Law | 3 lectures: ai310.0.5 Lecture 6: Kernels, Triton … ai310.0.7 Lecture 8: Parallelism 2 |
| 51 | 2027-11-07 | 6 lectures: math150.0.15 Lec 16 … phys200.0.17 Lec 18: Displacement Current and S | 3 lectures: ai310.0.7 Lecture 8: Parallelism 2 … ai300.1.3 Chinchilla — Training Compute-Opti |
| 52 | 2027-11-14 | 6 lectures: math150.0.18 Lec 19 … phys200.0.20 Lec 21: Magnetic Materials | 3 lectures: ai300.1.3 Chinchilla — Training Compute-Opti … ai310.0.10 Lecture 11: Scaling laws 2 |
| 53 | 2027-11-21 | 6 lectures: math150.0.21 Lec 22 … phys200.0.23 Lec 24: Transformers, Car Coils an | 3 lectures: ai310.0.10 Lecture 11: Scaling laws 2 … ai310.0.12 Lecture 13: Data 1 |
| 54 | 2027-11-28 | 6 lectures: math150.0.24 Lec 25 … phys200.0.26 Lec 27: Resonance and Destructive  | 3 lectures: ai310.0.12 Lecture 13: Data 1 … ai310.0.14 Lecture 15: Alignment - SFT/RLHF |
| 55 | 2027-12-05 | 6 lectures: math150.0.27 Lec 28 … phys200.0.29 Lec 30: Polarizers and Malus's Law | 3 lectures: ai310.0.14 Lecture 15: Alignment - SFT/RLHF … ai310.0.15 Lecture 16: Alignment - RL 1 |
| 56 | 2027-12-12 | 6 lectures: math150.0.30 Lec 31 … phys200.0.32 Lec 33: Double-Slit Interference a | 2 lectures: res400.0.0 Introduction to Reinforcement Lear … res400.0.1 Markov Decision Process |
| 57 | 2027-12-19 | 3 lectures: phys200.0.33 Lec 34: Gratings and Resolving Pow … phys200.0.35 Lec 36: Farewell Special | 3 lectures: res400.0.1 Markov Decision Process … res400.0.3 Model-Free Prediction |
| 58 | 2027-12-26 | — | 4 lectures: res400.0.3 Model-Free Prediction … res400.0.6 Policy Gradient Methods |
| 59 | 2028-01-02 | — | 6 lectures: res400.0.6 Policy Gradient Methods … ai300.2.2 DPO — Direct Preference Optimizati |
| 60 | 2028-01-09 | — | 6 lectures: ai300.2.3 LLaMA — Open and Efficient Foundat … ai300.3.3 RAG — Retrieval-Augmented Generati |
| 61 | 2028-01-16 | — | 3 lectures: res400.0.7 Integrating Learning and Planning … res400.0.9 Classic Games |
| 62 | 2028-01-23 | — | 6 lectures: res400.1.0 A Mathematical Framework for Trans … res400.2.0 Hamming — You and Your Research |
| 63 | 2028-01-30 | — | 2 lectures: res400.2.1 How to read a paper — the three-pa … res400.2.2 Karpathy — A Survival Guide to a P |
<!-- END GENERATED -->
