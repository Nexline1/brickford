# T-033 build order

AI 200 first (spec), then every other lecture in the order its **first scheduled date**
comes up on the calendar. Ties (two lectures first scheduled on the same day) keep
curriculum order.

How the dates were computed: `order.js` (in this folder) is a Node replica of
`studyIndex`, `dateForStudy`, `packWindows`/`fixedWindows` and `scheduledFor` from
`platform/js/app.js`, run with empty progress (so every day uses the fixed windows, which
is the calendar as published). It then loads the real app in Chromium with the clock
pinned to 2026-10-14 12:00 UTC, calls the real `scheduledFor` through
`window.__brickfordTest` for study days 0–1199, and compares the first date of every
target lecture:

```
$ NODE_PATH=/opt/node22/lib/node_modules node order.js <repo>
replica vs app.js scheduledFor: 80 of 80 agree
```

`START_DATE` is 2026-10-05 (curriculum.js). AI 200 and AI 210 are the Build spine
(packed at 90 effort-minutes a day); AI 300 is one paper per 21 study days from day 182;
AI 310 and RES 400 are links in the Stage-3 theory chain from day 182.

| # | key | first scheduled | lecture | kind | video | min |
|---|---|---|---|---|---|---|
| 1 | `ai200.0.0` | 2026-10-05 | But what is a neural network? | video | aircAruvnKk | 19 |
| 2 | `ai200.0.1` | 2026-10-05 | Gradient descent — how neural networks learn | video | IHZwWFHWa-w | 21 |
| 3 | `ai200.0.2` | 2026-10-06 | What is backpropagation really doing? | video | Ilg3gGewQ5U | 13 |
| 4 | `ai200.0.3` | 2026-10-06 | Backpropagation calculus | video | tIeHLnjs5U8 | 10 |
| 5 | `ai200.1.0` | 2026-10-07 | Micrograd — spelled-out intro to neural networks and backpropagation | video | VMj-3S1tku0 | 146 |
| 6 | `ai200.1.1` | 2026-10-11 | Makemore 1 — bigram character-level language model | video | PaCmpygFfXo | 118 |
| 7 | `ai200.1.2` | 2026-10-14 | Makemore 2 — MLP, following Bengio et al. 2003 | video | TCH_1BHY58I | 76 |
| 8 | `ai200.1.3` | 2026-10-16 | Makemore 3 — activations, gradients, BatchNorm | video | P6sfmUTpUmc | 116 |
| 9 | `ai200.1.4` | 2026-10-20 | Makemore 4 — becoming a backprop ninja (DO NOT SKIP) | video | q8SA3rM6ckI | 115 |
| 10 | `ai200.1.5` | 2026-10-23 | Makemore 5 — building a WaveNet | video | t3YJ5hKiMQ0 | 56 |
| 11 | `ai200.1.6` | 2026-10-26 | Let's build GPT — from scratch, in code | video | kCc8FmEb1nY | 116 |
| 12 | `ai200.1.7` | 2026-10-29 | Let's build the GPT Tokenizer | video | zduSFxRajkE | 134 |
| 13 | `ai200.1.8` | 2026-11-02 | Let's reproduce GPT-2 (124M) | video | l8pRSuU81PU | 241 |
| 14 | `ai200.2.0` | 2026-11-08 | Intro to Large Language Models | video | zjkBMFhNj_g | 60 |
| 15 | `ai200.2.1` | 2026-11-10 | Deep dive into LLMs like ChatGPT | video | 7xTGNNLPyMI | 211 |
| 16 | `ai210.0.0` | 2026-11-16 | Lesson 1: Getting started | video | 8SF_h3xF3cE | 83 |
| 17 | `ai210.0.1` | 2026-11-18 | Lesson 2: Deployment | video | F4tvM4Vb3A0 | 77 |
| 18 | `ai210.0.2` | 2026-11-20 | Lesson 3: Neural net foundations | video | hBBOjCiFcuo | 90 |
| 19 | `ai210.0.3` | 2026-11-23 | Lesson 4: Natural language (NLP) | video | toUgBQv1BT8 | 95 |
| 20 | `ai210.0.4` | 2026-11-25 | Lesson 5: From-scratch model | video | _rXzeWq4C6w | 103 |
| 21 | `ai210.0.5` | 2026-11-29 | Lesson 6: Random forests | video | AdhG64NF76E | 103 |
| 22 | `ai210.0.6` | 2026-12-02 | Lesson 7: Collaborative filtering | video | p4ZZq0736Po | 107 |
| 23 | `ai210.0.7` | 2026-12-06 | Lesson 8: Convolutions (CNNs) | video | htiNBPxcXgo | 97 |
| 24 | `ai300.0.0` | 2027-05-05 | AlexNet — ImageNet Classification with Deep CNNs (2012) | paper | DAOcjicFr1Y | 78 |
| 25 | `ai300.0.1` | 2027-05-30 | ResNet — Deep Residual Learning (2015) | paper | DAOcjicFr1Y | 78 |
| 26 | `ai300.0.2` | 2027-06-23 | ViT — An Image Is Worth 16x16 Words (2020) | paper |  |  |
| 27 | `ai300.0.3` | 2027-07-18 | CLIP — Learning Transferable Visual Models (2021) | paper |  |  |
| 28 | `ai300.1.0` | 2027-08-11 | Attention Is All You Need (2017) | paper |  |  |
| 29 | `ai300.1.1` | 2027-09-05 | BERT — Pre-training Deep Bidirectional Transformers (2018) | paper |  |  |
| 30 | `ai310.0.0` | 2027-09-12 | Lecture 1: Overview and Tokenization | video | SQ3fZ1sAqXI | 79 |
| 31 | `ai310.0.1` | 2027-09-14 | Lec. 2: Pytorch, Resource Accounting | video | msHyYioAyNE | 79 |
| 32 | `ai310.0.2` | 2027-09-16 | Lec. 3: Architectures, Hyperparameters | video | ptFiH_bHnJw | 87 |
| 33 | `ai310.0.3` | 2027-09-19 | Lecture 4: Mixture of experts | video | LPv1KfUXLCo | 82 |
| 34 | `ai310.0.4` | 2027-09-21 | Lecture 5: GPUs | video | 6OBtO9niT00 | 74 |
| 35 | `ai310.0.5` | 2027-09-23 | Lecture 6: Kernels, Triton | video | E8Mju53VB00 | 80 |
| 36 | `ai310.0.6` | 2027-09-26 | Lecture 7: Parallelism 1 | video | l1RJcDjzK8M | 85 |
| 37 | `ai310.0.7` | 2027-09-28 | Lecture 8: Parallelism 2 | video | LHpr5ytssLo | 75 |
| 38 | `ai300.1.2` | 2027-09-29 | GPT-2 — Language Models are Unsupervised Multitask Learners (2019) | paper | kCc8FmEb1nY | 116 |
| 39 | `ai310.0.8` | 2027-09-30 | Lecture 9: Scaling laws 1 | video | 6Q-ESEmDf4Q | 65 |
| 40 | `ai310.0.9` | 2027-10-03 | Lecture 10: Inference | video | fcgPYo3OtV0 | 83 |
| 41 | `ai310.0.10` | 2027-10-05 | Lecture 11: Scaling laws 2 | video | OSYuUqGBQxw | 78 |
| 42 | `ai310.0.11` | 2027-10-07 | Lecture 12: Evaluation | video | x-R5l2HsXqM | 81 |
| 43 | `ai310.0.12` | 2027-10-10 | Lecture 13: Data 1 | video | WePxmeXU1xg | 79 |
| 44 | `ai310.0.13` | 2027-10-12 | Lecture 14: Data 2 | video | 9Cd0THLS1t0 | 79 |
| 45 | `ai310.0.14` | 2027-10-14 | Lecture 15: Alignment - SFT/RLHF | video | Dfu7vC9jo4w | 75 |
| 46 | `ai310.0.15` | 2027-10-17 | Lecture 16: Alignment - RL 1 | video | 46f2QTDB08Q | 81 |
| 47 | `ai310.0.16` | 2027-10-19 | Lecture 17: Alignment - RL 2 | video | JdGFdViaOJk | 76 |
| 48 | `ai310.1.0` | 2027-10-21 | The Hugging Face LLM course — pipeline fundamentals | reading |  |  |
| 49 | `ai300.1.3` | 2027-10-24 | Chinchilla — Training Compute-Optimal LLMs (2022) | paper |  |  |
| 50 | `ai310.1.1` | 2027-10-24 | Supervised finetuning in practice (TRL + alignment handbook) | reading |  |  |
| 51 | `ai310.1.2` | 2027-10-26 | Quantization — GGUF, AWQ, bitsandbytes tradeoffs | reading |  |  |
| 52 | `ai310.1.3` | 2027-10-28 | Evals — lm-evaluation-harness, contamination, and why public benchmarks lie | reading |  |  |
| 53 | `ai310.1.4` | 2027-10-31 | Serving — vLLM, PagedAttention, and the KV cache | reading |  |  |
| 54 | `ai310.1.5` | 2027-11-02 | Agents — tool use, function calling, and failure modes | reading |  |  |
| 55 | `res400.0.0` | 2027-11-04 | Introduction to Reinforcement Learning | video | 2pWv7GOvuf0 | 88 |
| 56 | `res400.0.1` | 2027-11-08 | Markov Decision Process | video | lfHX2hHRMVQ | 102 |
| 57 | `res400.0.2` | 2027-11-11 | Planning by Dynamic Programming | video | Nd1-UUMVfz4 | 99 |
| 58 | `res400.0.3` | 2027-11-15 | Model-Free Prediction | video | PnHCvfgC_ZA | 97 |
| 59 | `ai300.2.0` | 2027-11-17 | InstructGPT — Training LMs to Follow Instructions (2022) | paper |  |  |
| 60 | `res400.0.4` | 2027-11-18 | Model Free Control | video | 0g4j2k_Ggc4 | 97 |
| 61 | `res400.0.5` | 2027-11-22 | Value Function Approximation | video | UoPei5o4fps | 97 |
| 62 | `res400.0.6` | 2027-11-25 | Policy Gradient Methods | video | KHZVXao4qXs | 94 |
| 63 | `res400.0.7` | 2027-11-29 | Integrating Learning and Planning | video | ItMutbeOHtc | 100 |
| 64 | `res400.0.8` | 2027-12-02 | Exploration and Exploitation | video | sGuiWX07sKw | 99 |
| 65 | `res400.0.9` | 2027-12-06 | Classic Games | video | kZ_AUmFcZtk | 111 |
| 66 | `res400.1.0` | 2027-12-09 | A Mathematical Framework for Transformer Circuits | reading |  |  |
| 67 | `ai300.2.1` | 2027-12-12 | LoRA — Low-Rank Adaptation of LLMs (2021) | paper |  |  |
| 68 | `res400.1.1` | 2027-12-13 | In-context Learning and Induction Heads | reading |  |  |
| 69 | `res400.1.2` | 2027-12-16 | Toy Models of Superposition | reading |  |  |
| 70 | `res400.1.3` | 2027-12-20 | ARENA — Transformer Interpretability track | reading |  |  |
| 71 | `res400.1.4` | 2027-12-23 | Nanda — MI Quickstart & 200 Concrete Open Problems | reading |  |  |
| 72 | `res400.2.0` | 2027-12-27 | Hamming — You and Your Research | video | a1zDuOPkMSw | 44 |
| 73 | `res400.2.1` | 2027-12-30 | How to read a paper — the three-pass method | reading |  |  |
| 74 | `res400.2.2` | 2028-01-03 | Karpathy — A Survival Guide to a PhD (read for the research taste, not the PhD) | reading |  |  |
| 75 | `ai300.2.2` | 2028-01-05 | DPO — Direct Preference Optimization (2023) | paper |  |  |
| 76 | `ai300.2.3` | 2028-01-30 | LLaMA — Open and Efficient Foundation Models (2023) | paper |  |  |
| 77 | `ai300.3.0` | 2028-02-23 | FlashAttention — Fast and Memory-Efficient Exact Attention (2022) | paper |  |  |
| 78 | `ai300.3.1` | 2028-03-19 | Mixtral — Mixture of Experts (2024) | paper | LPv1KfUXLCo | 82 |
| 79 | `ai300.3.2` | 2028-04-12 | DDPM — Denoising Diffusion Probabilistic Models (2020) | paper |  |  |
| 80 | `ai300.3.3` | 2028-05-07 | RAG — Retrieval-Augmented Generation (2020) | paper |  |  |
