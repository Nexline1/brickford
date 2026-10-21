# T-045: why each problem set and lab unlocks where it does

`after` is the lesson key of the lecture that prepares for the item. For a problem set it is the
last lecture its topics need, read from the course's syllabus (the lecture titles in
`curriculum.js`). For a lab it is the lecture that teaches what it builds. A lab is due only once
that lecture is cleared **and** the plan is in the lab's phase; verify-content checks each lab's
`after` is scheduled in its phase or earlier. Plan dates are the app's `planDateOf` under the
2026-10-05 start.

## MATH 110 — MIT 18.06 problem sets & exams
| Item | after | Justifying lecture |
|---|---|---|
| 1806-ps1 Ax = b, elimination | math110.1.1 | L2 "Elimination with Matrices" |
| 1806-ps2 LU, transposes | math110.1.4 | L5 "Transposes, Permutations, Spaces R^n" (after L4 "Factorization into A = LU") |
| 1806-ps3 vector spaces, nullspace | math110.1.5 | L6 "Column Space and Nullspace" (the spec's example) |
| 1806-ps4 independence, four subspaces | math110.1.9 | L10 "The Four Fundamental Subspaces" (after L9 "Independence, Basis, and Dimension") |
| 1806-ps5 orthogonality, projections | math110.1.14 | L15 "Projections onto Subspaces" (after L14 "Orthogonal Vectors and Subspaces") |
| 1806-ps6 least squares, Gram-Schmidt | math110.1.16 | L17 "Orthogonal Matrices and Gram-Schmidt" (after L16 "Projection Matrices and Least Squares") |
| 1806-ps7 determinants | math110.1.19 | L20 "Cramer's Rule, Inverse Matrix, and Volume", the last of the three determinant lectures |
| 1806-ps8 eigenvalues, diagonalization | math110.1.21 | L22 "Diagonalization and Powers of A" |
| 1806-ps9 symmetric & positive definite | math110.1.27 | L27 "Positive Definite Matrices and Minima" (after L25 "Symmetric Matrices and Positive Definiteness") |
| 1806-ps10 SVD, linear transformations | math110.1.30 | L30 "Linear Transformations and Their Matrices" (after L29 "Singular Value Decomposition") |
| 1806-exams the three quizzes | math110.1.32 | "Quiz 3 Review", the review before the last of the three |

## MATH 120 — MIT 18.01 problem sets & exams
| Item | after | Justifying lecture |
|---|---|---|
| 1801-ps1 Unit 1, differentiation | math120.1.6 | "Exam 1 Review", which closes Unit 1 (Rate of Change → Exponential and Log) |
| 1801-ps2 Unit 2, applications of differentiation | math120.1.14 | "Differential Equations", the last Unit 2 lecture (Approximations → Antiderivatives → Differential Equations) |
| 1801-ps3 Unit 3, the definite integral | math120.1.21 | "Numerical Integration", the last Unit 3 lecture before "Exam 3 Review" |
| 1801-ps4 Unit 4, techniques of integration | math120.1.28 | "Polar Coordinates", the last Unit 4 lecture before "Exam 4 Review" |
| 1801-ps5 Unit 5, series | math120.1.33 | "Taylor's Series", the last series lecture |
| 1801-exams unit exams 1–4 | math120.1.29 | "Exam 4 Review", the review before the fourth exam |

## MATH 130 — Stat 110 strategic practice
| Item | after | Justifying lecture |
|---|---|---|
| s110-sp1 naive definition, counting | math130.0.1 | L2 "Story Proofs, Axioms of Probability" (after L1 "Probability and Counting") |
| s110-sp2 conditional probability, Bayes | math130.0.4 | L5 "Conditioning Continued, Law of Total Probability" |
| s110-sp3 independence, discrete r.v.s | math130.0.7 | L8 "Random Variables and Their Distributions" |
| s110-sp4 expectation, indicators | math130.0.9 | L10 "Expectation Continued" (after L9 "Expectation, Indicator Random Variables, Linearity") |
| s110-sp5 continuous r.v.s, Normal | math130.0.12 | L13 "Normal distribution" |
| s110-sp6 LOTUS, moments | math130.0.17 | L18 "MGFs Continued" (after L14 "Location, Scale, and LOTUS") |
| s110-sp7 joint distributions | math130.0.18 | L19 "Joint, Conditional, and Marginal Distributions" |
| s110-sp8 covariance, transformations | math130.0.21 | L22 "Transformations and Convolutions" (after L21 "Covariance and Correlation") |
| s110-sp9 conditional expectation | math130.0.26 | L27 "Conditional Expectation given an R.V.", the last of three |
| s110-sp10 inequalities, LLN, CLT | math130.0.28 | L29 "Law of Large Numbers and Central Limit Theorem" (after L28 "Inequalities") |
| s110-sp11 Markov chains | math130.0.32 | L33 "Markov Chains Continued Further", the last of three |
| s110-final practice final | math130.0.33 | L34 "A Look Ahead", the course's last lecture |

## MATH 210 — 18.S096 homework + MacKay exercises
| Item | after | Justifying lecture |
|---|---|---|
| ms096-hw1 | math210.0.5 | "Lecture 3 Part 2: Finite-Difference Approximations" — homework 1 covers derivatives as linear operators, Jacobians, Kronecker products (lectures 1–3) |
| ms096-hw2 | math210.0.10 | "Lecture 5 Part 3: Differentiation on Computational Graphs" — homework 2 covers gradients in other vector spaces, det/inverse derivatives and AD (lectures 4–5) |
| mackay-ch2 probability & entropy | math210.2.1 | "Entropy and Data Compression (I): … Entropy" |
| mackay-ch4 source coding | math210.2.2 | "Entropy and Data Compression (II): Shannon's Source Coding Theorem" |
| mackay-ch8 ch. 8–9 channel capacity | math210.2.6 | "Noisy Channel Coding (II): The Capacity of a Noisy Channel" |

## Labs
| Lab (phase) | after (scheduled, phase) | Justifying lecture |
|---|---|---|
| flashcards-cli (0) | ai200.0.0 (2026-10-05, 0) | No lecture teaches a CLI flashcard program; the lab is the calibration build. It unlocks with day 1's first Build-track lecture, "But what is a neural network?" (judgment call) |
| neetcode-10 (0) | ai200.0.0 (2026-10-05, 0) | The coding diagnostic needs no lecture; same day-1 Build-track lecture (judgment call) |
| micrograd-blind (1) | ai200.1.0 (2026-10-07, 0) | "Micrograd — spelled-out intro to neural networks and backpropagation" (the spec's example) |
| tokenizer (1) | ai200.1.7 (2026-10-29, 1) | "Let's build the GPT Tokenizer" (the spec's example) |
| gpt-arabic (1) | ai200.1.6 (2026-10-26, 1) | "Let's build GPT — from scratch, in code" — the character-level GPT the lab trains |
| kaggle-entry (1) | ai210.0.5 (2026-11-29, 1) | fast.ai "Lesson 6: Random forests" — the lesson that works a live Kaggle competition and its iteration loop |
| blog-deepdive (1) | ai200.1.4 (2026-10-20, 1) | "Makemore 4 — becoming a backprop ninja" — backprop by hand, the subject the post teaches |
| deploy-space (1) | ai210.0.1 (2026-11-18, 1) | fast.ai "Lesson 2: Deployment" — a model behind a public HF Space |
| resnet-cifar (2) | ai300.0.1 (2027-05-30, 2) | "ResNet — Deep Residual Learning (2015)" |
| gpt2-repro (2) | ai200.1.8 (2026-11-02, 1) | "Let's reproduce GPT-2 (124M)" |
| lora-finetune (2) | ai300.2.1 (2027-12-12, 2) | "LoRA — Low-Rank Adaptation of LLMs (2021)" |
| eval-harness (2) | ai310.1.3 (2027-10-28, 2) | "Evals — lm-evaluation-harness, contamination, and why public benchmarks lie" |
| cuda-matmul (2) | sys250.1.4 (2027-08-24, 2) | "Going Further with CUDA for Python Programmers" — the tiled shared-memory matmul |
| kernel-profile (2) | sys250.1.0 (2027-08-15, 2) | "How to profile CUDA kernels in PyTorch" |
| oss-pr (2) | ai310.1.0 (2027-10-21, 2) | "The Hugging Face LLM course — pipeline fundamentals" — the first lecture working inside the open-source ML libraries a PR would target (judgment call) |
| rag-system (3) | ai300.3.3 (2028-05-07, 3) | "RAG — Retrieval-Augmented Generation (2020)". Owner decision, 2026-10-16: the lab moves from phase 2 to phase 3 and comes after the RAG paper. Round 1 had it in phase 2 after ai300.1.1 (BERT), because the paper is scheduled in phase 3 |
| dpo-run (2) | ai300.2.2 (2028-01-05, 2) | "DPO — Direct Preference Optimization (2023)" |
| interp-notebook (3) | res400.1.1 (2027-12-13, 2) | "In-context Learning and Induction Heads" — the induction heads the notebook reproduces |
| agent-tools (3) | ai310.1.5 (2027-11-02, 2) | "Agents — tool use, function calling, and failure modes" |
| inference-api (3) | ai310.1.4 (2027-10-31, 2) | "Serving — vLLM, PagedAttention, and the KV cache" (after "Quantization") |
