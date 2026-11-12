# The prerequisite map

**Files.** `prerequisites.json` is the machine-readable map: one entry per lecture, `{ "needs": [keys], "level": 1|2|3, "status": "core"|"optional"|"duplicate-of:<key>" }`, for all 494 existing lectures and 142 proposed ones. Proposed keys are listed with a note under `_provisional` (`cs100.*` the Python bridge, `ai200.3.*` the Karpathy second pass, `math120.2.*` the multivariable bridge, `math140.*`, `math150.*`, `phys200.*`, `phys300.*` the proposed later courses). It is generated from `plan-data.js` by `node tools/plan-dates.js`; edit `plan-data.js`, never the JSON.

**Checks.** `node tools/audit-lectures.js --check-prereqs` asserts that every existing lecture has an entry, every key is real or declared provisional, every level is 1–3, every needed key exists, and the graph has no cycle (exits 1 otherwise). It currently reports 636 entries, 0 cycles, 0 failures. `plan-dates.js` adds two more: no core lecture needs an optional or duplicate one, and in the simulated sequence no track jumps more than one level between consecutive lectures (0 jumps).

**The default rule.** A lecture needs the previous core lecture of its own unit; the first lecture of a unit needs the last core lecture of the unit before (same course). So course order is kept everywhere — MATH 110's order is unchanged, as the owner asked — and only the edges below are hand-made. They were taken from the summaries (takeaways and beats), not from transcripts, which could not be read this session.

**Levels.** 1 intro (3Blue1Brown units, CS50P, Storytelling Units I–V, no-code talks), 2 core (the MIT/Harvard full courses, 8.01, Karpathy's Micrograd to Makemore 2, fast.ai, the multivariable bridge, NumPy/PyTorch), 3 advanced (Makemore 3 onward, MATH 210, SYS 250, AI 310, RES 400, the Paper Room, statistical mechanics).

## The edges that shape the path

- **Python before any Karpathy code:** Micrograd needs CS50P lectures 8 (classes) and 9 (comprehensions); Makemore 1 needs the PyTorch tensors session; the tokenizer needs regular expressions and file I/O; fast.ai 1 needs CS50P 4 (libraries).
- **Calculus before backprop:** Micrograd needs the chain rule (`math120.0.3`) and 3B1B's backprop calculus; Makemore 4 needs the multivariable chain rule (`math120.2.4`).
- **Linear algebra and probability before the bigram model:** Makemore 1 needs matrix multiplication (`math110.0.3`) and conditional probability (`math130.0.3`); Build GPT needs dot products (`math110.0.8`) and 3B1B's attention chapter.
- **Single-variable calculus before 8.01:** PHYS 100 starts after the Second Fundamental Theorem (`math120.1.17`): by then the owner has derivatives and integrals, which is all 8.01 uses (MIT students take 8.01 alongside 18.01). Later lectures wait on the matching calculus: oscillators on differential equations (`math120.1.14`), work on the Fundamental Theorem, moment of inertia on volumes, Kepler on polar coordinates.
- **Calculus before Stat 110's continuous half:** densities need definite integrals, the normal needs the √π integral (`math120.1.22`), MGFs need Taylor series, joint densities need double integrals (`math120.2.6`), transformations need the Jacobian (`math120.2.5`).
- **Foundations before MATH 210:** matrix calculus waits for the end of 18.06, of 18.01 and of the multivariable bridge; MacKay waits for expectation, the law of large numbers and Markov chains.
- **The spine before systems and research:** SYS 250 and CS336 wait for GPT-2 (`ai200.1.8`); CS336's GPU and Triton lectures wait for the matching GPU MODE lectures; RL waits for Markov chains and conditional expectation; interpretability waits for Build GPT and the SVD.
- **Papers wait for the lecture that teaches their idea** (Attention for Build GPT, Chinchilla for CS336's scaling laws, LoRA for the SVD and fine-tuning, DDPM for variational methods and the multivariate normal).

<!-- BEGIN GENERATED -->
636 lectures (494 real, 142 provisional), 696 edges. Checks: every needed key exists; no core lecture needs an optional or duplicate one. Cycle check: `node tools/audit-lectures.js --check-prereqs`.

### Every cross-course edge

| Lecture | Needs (other course) |
|---|---|
| math110.1.22 Differential Equations and exp(At) | math120.1.14 Differential Equations; math120.1.5 Exponential and Log |
| math110.1.27 Positive Definite Matrices and Minima | math120.2.2 The gradient |
| math130.0.6 Gambler's Ruin and Random Variables | math120.1.14 Differential Equations |
| math130.0.11 Discrete vs. Continuous, the Uniform | math120.1.15 Definite Integrals |
| math130.0.12 Normal distribution | math120.1.22 Exam 3 Review |
| math130.0.16 Moment Generating Functions | math120.1.33 Taylor's Series |
| math130.0.18 Joint, Conditional, and Marginal Distributions | math120.2.6 Double integrals |
| math130.0.21 Transformations and Convolutions | math120.2.5 The Jacobian matrix |
| math130.0.29 Chi-Square, Student-t, Multivariate Normal | math110.1.25 Symmetric Matrices and Positive Definiteness |
| ai200.1.6 Let's build GPT — from scratch, in code | cs100.2.2 Attention in transformers, step by step (Deep Learning ch. 6); math110.0.8 Dot products and duality |
| ai200.1.7 Let's build the GPT Tokenizer | cs100.0.7 Lecture 7 — Regular Expressions; cs100.0.6 Lecture 6 — File I/O |
| ai210.0.0 Lesson 1: Getting started | cs100.0.4 Lecture 4 — Libraries |
| ai210.0.2 Lesson 3: Neural net foundations | ai200.3.0 Micrograd — spelled-out intro to neural networks and backpropagation (second pass, typing along) |
| ai210.0.4 Lesson 5: From-scratch model | ai200.3.2 Makemore 2 — MLP, following Bengio et al. 2003 (second pass, typing along) |
| phys100.0.0 Introduction | math120.1.17 Second Fundamental Theorem |
| phys100.0.2 Introduction to Kinematics | math120.1.3 Chain Rule |
| phys100.0.3 Vectors | math110.0.8 Dot products and duality |
| phys100.0.10 Hooke's Law, Simple Harmonic Oscillator | math120.1.14 Differential Equations |
| phys100.0.11 Work, Energy, and Universal Gravitation | math120.1.16 First Fundamental Theorem |
| phys100.0.13 Equation of Motion for Simple Harmonic Oscillators | math120.1.7 Linear and Quadratic Approximations |
| phys100.0.19 Rotating Rigid Bodies, Inertia, and Axis Theorems | math120.1.19 Volumes |
| phys100.0.20 Angular Momentum | math110.0.10 Cross products in the light of linear transformations |
| phys100.0.22 Kepler's Laws, Elliptical Orbits, and Maneuvers | math120.1.29 Exam 4 Review |
| math210.0.0 Lecture 1 Part 1: Introduction and Motivation | math110.1.34 Final Course Review; math120.1.34 Final Review; math120.2.5 The Jacobian matrix |
| math210.1.0 Loss functions and optimization (CS231n Lecture 3) | ai200.3.0 Micrograd — spelled-out intro to neural networks and backpropagation (second pass, typing along) |
| math210.2.0 Introduction to Information Theory | math130.0.8 Expectation, Indicator Random Variables, Linearity |
| math210.2.2 Entropy and Data Compression (II): Shannon's Source Coding Theorem, The Bent Coin Lottery | math130.0.28 Law of Large Numbers and Central Limit Theorem |
| math210.2.9 An Introduction To Bayesian Inference (II): Inference Of Parameters And Models | math130.0.22 Beta distribution |
| math210.2.11 Approximating Probability Distributions (II): Monte Carlo Methods (I) | math130.0.32 Markov Chains Continued Further |
| ai300.0.0 AlexNet — ImageNet Classification with Deep CNNs (2012) | ai210.0.7 Lesson 8: Convolutions (CNNs); sys250.0.10 Convolutional Networks |
| ai300.1.0 Attention Is All You Need (2017) | ai200.1.6 Let's build GPT — from scratch, in code |
| ai300.1.2 GPT-2 — Language Models are Unsupervised Multitask Learners (2019) | ai200.1.8 Let's reproduce GPT-2 (124M) |
| ai300.1.3 Chinchilla — Training Compute-Optimal LLMs (2022) | ai310.0.8 Lecture 9: Scaling laws 1 |
| ai300.2.0 InstructGPT — Training LMs to Follow Instructions (2022) | ai310.0.14 Lecture 15: Alignment - SFT/RLHF |
| ai300.2.1 LoRA — Low-Rank Adaptation of LLMs (2021) | math110.1.29 Singular Value Decomposition; ai310.1.1 Supervised finetuning in practice (TRL + alignment handbook) |
| ai300.2.2 DPO — Direct Preference Optimization (2023) | ai310.0.14 Lecture 15: Alignment - SFT/RLHF |
| ai300.2.3 LLaMA — Open and Efficient Foundation Models (2023) | ai310.0.2 Lec. 3: Architectures, Hyperparameters |
| ai300.3.0 FlashAttention — Fast and Memory-Efficient Exact Attention (2022) | sys250.1.7 Flash Attention |
| ai300.3.1 Mixtral — Mixture of Experts (2024) | ai310.0.3 Lecture 4: Mixture of experts |
| ai300.3.2 DDPM — Denoising Diffusion Probabilistic Models (2020) | math210.2.13 Approximating Probability Distributions (IV): Variational Methods; math130.0.29 Chi-Square, Student-t, Multivariate Normal |
| ai300.3.3 RAG — Retrieval-Augmented Generation (2020) | ai310.1.5 Agents — tool use, function calling, and failure modes |
| sys250.0.0 Introduction and Logistics | ai200.1.8 Let's reproduce GPT-2 (124M); math210.0.10 Lecture 5 Part 3: Differentiation on Computational Graphs |
| sys250.0.4 Automatic Differentiation | ai200.3.0 Micrograd — spelled-out intro to neural networks and backpropagation (second pass, typing along) |
| ai310.0.0 Lecture 1: Overview and Tokenization | ai200.1.8 Let's reproduce GPT-2 (124M) |
| ai310.0.4 Lecture 5: GPUs | sys250.1.3 Compute and Memory Basics |
| ai310.0.5 Lecture 6: Kernels, Triton | sys250.1.8 Practitioners Guide to Triton |
| ai310.0.16 Lecture 17: Alignment - RL 2 | res400.0.6 Policy Gradient Methods |
| res400.0.0 Introduction to Reinforcement Learning | math130.0.32 Markov Chains Continued Further; math130.0.26 Conditional Expectation given an R.V. |
| res400.0.6 Policy Gradient Methods | math210.0.6 Lecture 4 Part 1: Gradients and Inner Products in Other Vector Spaces |
| res400.1.0 A Mathematical Framework for Transformer Circuits | ai200.1.6 Let's build GPT — from scratch, in code; math110.1.29 Singular Value Decomposition |
| res400.2.0 Hamming — You and Your Research | ai200.1.8 Let's reproduce GPT-2 (124M) |
| ai200.3.0 Micrograd — spelled-out intro to neural networks and backpropagation (second pass, typing along) | cs100.0.8 Lecture 8 — Object-Oriented Programming; cs100.0.9 Lecture 9 — Et Cetera (sets, comprehensions, generators, *args, map); math120.0.3 Visualizing the chain rule and product rule |
| ai200.3.1 Makemore 1 — bigram character-level language model (second pass, typing along) | cs100.1.1 PyTorch fundamentals: tensors, shapes, indexing, matmul, broadcasting (Learn PyTorch for Deep Learning, chapter 00, Daniel Bourke); math110.0.3 Matrix multiplication as composition; math130.0.3 Conditional Probability |
| ai200.3.2 Makemore 2 — MLP, following Bengio et al. 2003 (second pass, typing along) | math130.0.7 Random Variables and Their Distributions |
| ai200.3.3 Makemore 3 — activations, gradients, BatchNorm (second pass, typing along) | math130.0.13 Location, Scale, and LOTUS |
| ai200.3.4 Makemore 4 — becoming a backprop ninja (DO NOT SKIP) (second pass, typing along) | math120.2.4 The multivariable chain rule |
| math120.2.0 Multivariable functions — what a function of two inputs looks like | math110.0.8 Dot products and duality |
| math140.0.0 MIT 18.02, full course — lecture 1 | math120.1.34 Final Review; math110.0.10 Cross products in the light of linear transformations; math120.2.5 The Jacobian matrix |
| math150.0.0 MIT 18.03, full course — lecture 1 | math120.1.34 Final Review; math110.1.21 Diagonalization and Powers of A |
| phys200.0.0 MIT 8.02, full course — lecture 1 | phys100.0.34 Heisenberg's Uncertainty Principle; math140.0.18 MIT 18.02, full course — lecture 19 |
| phys200.0.12 MIT 8.02, full course — lecture 13 | math140.0.34 MIT 18.02, full course — lecture 35 |
| phys300.0.0 Stanford Statistical Mechanics — lecture 1 | phys100.0.33 Ideal-Gas Law; math130.0.28 Law of Large Numbers and Central Limit Theorem; math210.2.2 Entropy and Data Compression (II): Shannon's Source Coding Theorem, The Bent Coin Lottery; math140.0.12 MIT 18.02, full course — lecture 13 |

### Non-default edges inside a course

| Lecture | Needs |
|---|---|
| ai200.1.5 Makemore 5 — building a WaveNet | ai200.3.4 |
| ai200.2.0 Intro to Large Language Models | (none: chain removed) |
| ai200.2.1 Deep dive into LLMs like ChatGPT | (none: chain removed) |
| ai300.0.0 AlexNet — ImageNet Classification with Deep CNNs (2012) | (none: chain removed) |
| ai300.0.2 ViT — An Image Is Worth 16x16 Words (2020) | ai300.1.0 |
| ai300.1.0 Attention Is All You Need (2017) | (none: chain removed) |
| ai300.2.0 InstructGPT — Training LMs to Follow Instructions (2022) | (none: chain removed) |
| ai300.3.0 FlashAttention — Fast and Memory-Efficient Exact Attention (2022) | (none: chain removed) |
| res400.1.0 A Mathematical Framework for Transformer Circuits | (none: chain removed) |
| res400.2.0 Hamming — You and Your Research | (none: chain removed) |
| cs100.1.0 NumPy for beginners (freeCodeCamp, Keith Galli) | cs100.0.2 |
| cs100.2.0 Large Language Models explained briefly | (none: chain removed) |
| ai200.3.0 Micrograd — spelled-out intro to neural networks and backpropagation (second pass, typing along) | ai200.0.3 |
| math120.2.0 Multivariable functions — what a function of two inputs looks like | math120.1.5 |
<!-- END GENERATED -->
