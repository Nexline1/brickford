# The v2 sequence — one ordered line per track

**Derived, not hand-written.** `node tools/plan-dates.js` walks the study calendar from the cutover and, each day, schedules on each track the next lecture whose prerequisites (`prerequisites.json`) are all already scheduled. It packs days with the app's own rules (EFFORT = min × 1.8 + 4; a lecture over 1.15 × the budget spans days, "part 2 of 4"; short ones share a day up to 1.05 × the budget). Optional and duplicate lectures are never scheduled. The table below is its output; the simulation also checks that no track jumps more than one level between consecutive lectures (it reports none).

**Cutover:** Sunday 22 Nov 2026 (provisional: "the Sunday after step 2 ships"), study day 32. Before it, every day keeps exactly what v1 gave it. Assumed for the simulation: everything v1 scheduled before the cutover in Theory and Storytelling is done (or owed on its own day, as today); in Build only the 3Blue1Brown primer and Micrograd to Makemore 4 count as watched (owner, 10 Nov), and everything after Makemore 4 is re-scheduled after the second pass.

## The day (six days a week, about 5 hours)

| Block | Budget (effort-min) | About | What |
|---|---:|---|---|
| Math & Physics | 90 | 1 h 30 | one MIT/Harvard lecture with notes, or several short chapters. One line: MATH 110, MATH 120 (and its multivariable bridge), MATH 130, PHYS 100 and MATH 210 interleaved by prerequisite — a rotation over whichever course's next lecture is ready, not a blind LA → Calc → Prob cycle. |
| AI / Python / Build | 60 | 1 h | the bridge (CS50P → NumPy → PyTorch), then Karpathy typed along (about 31 min of video a day), fast.ai, papers, SYS 250, CS336, RES 400. **Fridays** carry the no-code talks (3Blue1Brown ch. 5–7, the Deep dive) in their own lane, so a long talk continues the next Friday and never blocks the coding line. **When the Math & Physics line is finished, its 90 minutes go to this line**, so theory stays about 3 hours. |
| Storytelling | 40 | 40 min | unchanged: SPCH 100 five days a week, Friday is the weekly recorded rep. 40 is the owner's earlier call; the plan's "about 30" would slow SPCH 100 by a quarter, so it was left alone — see the README's decisions. |
| Practice | not lecture time | 2 h | about 75 min coding (the lecture's problem set: CS50P psets, then "rebuild it without the video", later paper reimplementations, two easy NeetCode problems a day from bridge week 4) and about 45 min math problems plus one written answer (the step-3 practice engine). |

Theory comes to about 3 h 10 (190 effort-minutes) and practice 2 h.

**Where physics sits.** PHYS 100 enters the Math & Physics line after the Second Fundamental Theorem of 18.01 (`math120.1.17`, 21 Dec 2026; PHYS 100 begins 22 Dec), so it never arrives before the calculus it uses, and then shares the line with the rest of 18.01 and Stat 110. In v1 it waited for day 183 and ran every fourth day. If the proposed courses are approved, MATH 140 (18.02), MATH 150 (18.03), PHYS 200 (8.02) and PHYS 300 (statistical mechanics) join the same line when their prerequisites are met; `dates.md` shows that case as "with additions".

**Storytelling** keeps its own line, untouched (the speech column below is read from the current app).

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
| 12 | 2027-02-07 | 6 lectures: phys100.0.15 Momentum and Its Conservation … math120.1.32 Infinite Series | 2 lectures: ai200.1.6 Let's build GPT — from scratch, in … ai200.1.7 Let's build the GPT Tokenizer |
| 13 | 2027-02-14 | 6 lectures: phys100.0.17 Momentum of Individual Objects, Ro … math120.1.34 Final Review | 2 lectures: ai200.1.7 Let's build the GPT Tokenizer … ai200.1.8 Let's reproduce GPT-2 (124M) |
| 14 | 2027-02-21 | 5 lectures: math130.0.17 MGFs Continued … phys100.0.21 Torque | 2 lectures: ai200.1.8 Let's reproduce GPT-2 (124M) … ai300.1.0 Attention Is All You Need (2017) |
| 15 | 2027-02-28 | 5 lectures: math210.0.1 Lecture 1 Part 2: Derivatives as L … math130.0.20 Covariance and Correlation | 2 lectures: ai300.1.1 BERT — Pre-training Deep Bidirecti … ai300.1.2 GPT-2 — Language Models are Unsupe |
| 16 | 2027-03-07 | 6 lectures: phys100.0.23 Doppler Effect, Binary Stars, Neut … math130.0.22 Beta distribution | 2 lectures: ai210.0.0 Lesson 1: Getting started … ai210.0.1 Lesson 2: Deployment |
| 17 | 2027-03-14 | 5 lectures: phys100.0.25 Static Equilibrium, Stability, Rop … math210.0.6 Lecture 4 Part 1: Gradients and In | 2 lectures: ai210.0.2 Lesson 3: Neural net foundations … ai210.0.3 Lesson 4: Natural language (NLP) |
| 18 | 2027-03-21 | 6 lectures: math130.0.24 Order Statistics and Conditional E … math210.0.8 Lecture 5 Part 1: Derivative of Ma | 2 lectures: ai210.0.4 Lesson 5: From-scratch model … ai210.0.7 Lesson 8: Convolutions (CNNs) |
| 19 | 2027-03-28 | 6 lectures: math130.0.26 Conditional Expectation given an R … math210.0.10 Lecture 5 Part 3: Differentiation  | 3 lectures: ai210.0.7 Lesson 8: Convolutions (CNNs) … ai310.0.1 Lec. 2: Pytorch, Resource Accounti |
| 20 | 2027-04-04 | 5 lectures: math130.0.28 Law of Large Numbers and Central L … phys100.0.33 Ideal-Gas Law | 3 lectures: ai310.0.1 Lec. 2: Pytorch, Resource Accounti … sys250.0.1 ML Refresher / Softmax Regression |
| 21 | 2027-04-11 | 5 lectures: math210.0.12 Lecture 6 Part 2: Calculus of Vari … math130.0.31 Markov Chains Continued | 3 lectures: sys250.0.2 "Manual" Neural Networks … sys250.0.4 Automatic Differentiation |
| 22 | 2027-04-18 | 5 lectures: math210.0.14 Lecture 7 Part 2: Second Derivativ … math210.1.0 Loss functions and optimization (C | 2 lectures: sys250.0.5 Automatic Differentiation Implemen … sys250.0.6 Fully connected networks, optimiza |
| 23 | 2027-04-25 | 4 lectures: math210.1.1 Training neural networks I — init, … math210.1.4 An overview of gradient descent op | 3 lectures: sys250.0.7 Neural Network Abstractions … sys250.0.9 Normalization and Regularization |
| 24 | 2027-05-02 | 5 lectures: math210.1.5 Convexity — Boyd & Vandenberghe ch … math210.2.3 Entropy and Data Compression (III) | 3 lectures: sys250.0.9 Normalization and Regularization … ai300.0.0 AlexNet — ImageNet Classification  |
| 25 | 2027-05-09 | 5 lectures: math210.2.3 Entropy and Data Compression (III) … math210.2.7 Noisy Channel Coding (III): The No | 3 lectures: ai300.0.0 AlexNet — ImageNet Classification  … ai300.0.2 ViT — An Image Is Worth 16x16 Word |
| 26 | 2027-05-16 | 4 lectures: math210.2.7 Noisy Channel Coding (III): The No … math210.2.10 Approximating Probability Distribu | 3 lectures: ai300.0.3 CLIP — Learning Transferable Visua … sys250.0.12 Lecture - 12 GPU Acceleration |
| 27 | 2027-05-23 | 3 lectures: math210.2.11 Approximating Probability Distribu … math210.2.13 Approximating Probability Distribu | 3 lectures: sys250.0.13 Hardware Acceleration Implemention … sys250.0.15 Training Large Models |
| 28 | 2027-05-30 | 2 lectures: math210.2.14 Data Modelling With Neural Network … math210.2.15 Data Modelling With Neural Network | 5 lectures: sys250.0.15 Training Large Models … sys250.0.19 RNN Implementation |
| 29 | 2027-06-06 | — | 7 lectures: sys250.0.20 Transformers and Attention … sys250.1.2 Getting Started With CUDA for Pyth |
| 30 | 2027-06-13 | — | 6 lectures: sys250.1.3 Compute and Memory Basics … ai300.3.0 FlashAttention — Fast and Memory-E |
| 31 | 2027-06-20 | — | 6 lectures: sys250.1.8 Practitioners Guide to Triton … ai310.0.3 Lecture 4: Mixture of experts |
| 32 | 2027-06-27 | — | 6 lectures: ai300.3.1 Mixtral — Mixture of Experts (2024 … ai310.0.7 Lecture 8: Parallelism 2 |
| 33 | 2027-07-04 | — | 6 lectures: ai310.0.8 Lecture 9: Scaling laws 1 … ai310.0.12 Lecture 13: Data 1 |
| 34 | 2027-07-11 | — | 6 lectures: ai310.0.13 Lecture 14: Data 2 … res400.0.1 Markov Decision Process |
| 35 | 2027-07-18 | — | 4 lectures: res400.0.1 Markov Decision Process … res400.0.4 Model Free Control |
| 36 | 2027-07-25 | — | 4 lectures: res400.0.4 Model Free Control … ai310.0.16 Lecture 17: Alignment - RL 2 |
| 37 | 2027-08-01 | — | 6 lectures: ai310.1.0 The Hugging Face LLM course — pipe … ai310.1.2 Quantization — GGUF, AWQ, bitsandb |
| 38 | 2027-08-08 | — | 5 lectures: ai310.1.3 Evals — lm-evaluation-harness, con … res400.0.7 Integrating Learning and Planning |
| 39 | 2027-08-15 | — | 4 lectures: res400.0.8 Exploration and Exploitation … res400.1.1 In-context Learning and Induction  |
| 40 | 2027-08-22 | — | 6 lectures: res400.1.2 Toy Models of Superposition … res400.2.2 Karpathy — A Survival Guide to a P |
<!-- END GENERATED -->
