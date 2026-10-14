# T-033: lectures with no fetchable source

> **Update, 2026-10-14 (spec amendment).** The owner chose "course materials now,
> transcripts later": AI 200 Unit II (9), AI 210 (8) and AI 310 Unit I (17) are now
> written from the authors' companion material on GitHub, so those 34 rows below are
> no longer blocked (see `progress.md`). Still unavailable: the 17 videos that wait for
> transcripts (3Blue1Brown ×4, Silver ×10, the two big-picture talks, Hamming), the 16
> AI 300 papers, and 6 readings (`res400.1.0`–`1.4`, `res400.2.1`) whose hosts the owner
> will allow; at 21:53 UTC all eight hosts were still refused.

The rule is "no source, no lecture": nothing below has a summary or a quiz, and none
was written from memory. 73 of the 80 are here. They are blocked by access, not by
content: each becomes buildable the moment its source can be fetched, and the order
in `order.md` still applies.

## Why

**V1 — every video.** Neither transcript tool returns a transcript in this session.

- `mcp__Yt_T__get_youtube_transcript` (the primary tool; the one T-037 used) refuses
  every call with: *"This MCP server needs a free API key (10 requests a day) before it
  can fetch transcripts. 1. Create a key at https://youtube-transcript.ai/get-api-key
  2. Reconnect this server with the key in its URL: https://youtube-transcript.ai/mcp?key=YOUR_KEY"*.
  Tried on `aircAruvnKk` (twice, 16:41 and 16:52 UTC) and `kCc8FmEb1nY`.
  Even with a key it allows 10 requests a day, and a multi-hour lecture takes two or
  three (it pages at 120,000 characters), so the 51 videos need roughly a week of
  daily quota.
- `mcp__Youtube_Transcribt__get_transcript` (the fallback) returns an empty result,
  "An unexpected error occurred while fetching the transcript.", or "Service
  temporarily busy, try again in a few minutes." Tried 16:41–16:52 UTC on
  `aircAruvnKk` (x3), `IHZwWFHWa-w`, `VMj-3S1tku0`, `kCc8FmEb1nY`, `Ilg3gGewQ5U`,
  `tIeHLnjs5U8`, `PaCmpygFfXo`, `TCH_1BHY58I`, `P6sfmUTpUmc`, `q8SA3rM6ckI`,
  `t3YJ5hKiMQ0`, `zduSFxRajkE`, `l8pRSuU81PU`, `zjkBMFhNj_g`, `7xTGNNLPyMI`,
  `8SF_h3xF3cE`, `F4tvM4Vb3A0`, `hBBOjCiFcuo`, and on `x7p329Z8MD0`, a video it
  transcribed successfully for T-037. Not one call returned text.
- `www.youtube.com` itself is refused by the session's egress policy (proxy 403,
  `connect_rejected`), so there is no direct route either, and routing around an
  egress policy is not on the table.

**P1 — papers and readings off GitHub.** The session's egress policy admits GitHub
(`github.com`, `raw.githubusercontent.com`, `api.github.com`) and the package
registries, and refuses everything else with a proxy 403 (`connect_rejected` in
`/__agentproxy/status`): `arxiv.org`, `export.arxiv.org`, `proceedings.neurips.cc`,
`cdn.openai.com`, `transformer-circuits.pub`, `www.neelnanda.io`, `www.arena.education`,
`web.stanford.edu`, `www.cs.virginia.edu`, `karpathy.github.io`, `huggingface.co`,
`docs.vllm.ai`. WebFetch fails the same hosts with `getaddrinfo ENOTFOUND` (it works
on `github.com`). The official venue copies were probed too — `openreview.net`,
`aclanthology.org`, `papers.nips.cc`, `ar5iv.labs.arxiv.org`, `www.semanticscholar.org`
— and are refused the same way. Copies of papers in third parties' GitHub repositories
were not used: their provenance cannot be checked against the paper.

The seven readings that were buildable are the ones whose page is published from an
official GitHub repository (Hugging Face course and docs, vLLM docs, EleutherAI's
README, Karpathy's blog). `sources.json` names the exact file each was read from.

## To unblock

- Videos: give the `Yt_T` transcript server an API key (the steps in its error above),
  or restore the `Youtube_Transcribt` server. Expect several sessions at 10 requests a day.
- Papers and readings: allow the hosts above in the cloud environment's Network access
  settings (Allowed domains), at minimum `arxiv.org`, `proceedings.neurips.cc`,
  `cdn.openai.com`, `transformer-circuits.pub`, `web.stanford.edu`, `www.cs.virginia.edu`,
  `www.neelnanda.io`, `www.arena.education`.

## The lectures

| key | lecture | source | why |
|---|---|---|---|
| `ai200.0.0` | But what is a neural network? | video aircAruvnKk (19 min) | no transcript tool works (V1) |
| `ai200.0.1` | Gradient descent — how neural networks learn | video IHZwWFHWa-w (21 min) | no transcript tool works (V1) |
| `ai200.0.2` | What is backpropagation really doing? | video Ilg3gGewQ5U (13 min) | no transcript tool works (V1) |
| `ai200.0.3` | Backpropagation calculus | video tIeHLnjs5U8 (10 min) | no transcript tool works (V1) |
| `ai200.1.0` | Micrograd — spelled-out intro to neural networks and backpropagation | video VMj-3S1tku0 (146 min) | no transcript tool works (V1) |
| `ai200.1.1` | Makemore 1 — bigram character-level language model | video PaCmpygFfXo (118 min) | no transcript tool works (V1) |
| `ai200.1.2` | Makemore 2 — MLP, following Bengio et al. 2003 | video TCH_1BHY58I (76 min) | no transcript tool works (V1) |
| `ai200.1.3` | Makemore 3 — activations, gradients, BatchNorm | video P6sfmUTpUmc (116 min) | no transcript tool works (V1) |
| `ai200.1.4` | Makemore 4 — becoming a backprop ninja (DO NOT SKIP) | video q8SA3rM6ckI (115 min) | no transcript tool works (V1) |
| `ai200.1.5` | Makemore 5 — building a WaveNet | video t3YJ5hKiMQ0 (56 min) | no transcript tool works (V1) |
| `ai200.1.6` | Let's build GPT — from scratch, in code | video kCc8FmEb1nY (116 min) | no transcript tool works (V1) |
| `ai200.1.7` | Let's build the GPT Tokenizer | video zduSFxRajkE (134 min) | no transcript tool works (V1) |
| `ai200.1.8` | Let's reproduce GPT-2 (124M) | video l8pRSuU81PU (241 min) | no transcript tool works (V1) |
| `ai200.2.0` | Intro to Large Language Models | video zjkBMFhNj_g (60 min) | no transcript tool works (V1) |
| `ai200.2.1` | Deep dive into LLMs like ChatGPT | video 7xTGNNLPyMI (211 min) | no transcript tool works (V1) |
| `ai210.0.0` | Lesson 1: Getting started | video 8SF_h3xF3cE (83 min) | no transcript tool works (V1) |
| `ai210.0.1` | Lesson 2: Deployment | video F4tvM4Vb3A0 (77 min) | no transcript tool works (V1) |
| `ai210.0.2` | Lesson 3: Neural net foundations | video hBBOjCiFcuo (90 min) | no transcript tool works (V1) |
| `ai210.0.3` | Lesson 4: Natural language (NLP) | video toUgBQv1BT8 (95 min) | no transcript tool works (V1) |
| `ai210.0.4` | Lesson 5: From-scratch model | video _rXzeWq4C6w (103 min) | no transcript tool works (V1) |
| `ai210.0.5` | Lesson 6: Random forests | video AdhG64NF76E (103 min) | no transcript tool works (V1) |
| `ai210.0.6` | Lesson 7: Collaborative filtering | video p4ZZq0736Po (107 min) | no transcript tool works (V1) |
| `ai210.0.7` | Lesson 8: Convolutions (CNNs) | video htiNBPxcXgo (97 min) | no transcript tool works (V1) |
| `ai300.0.0` | AlexNet — ImageNet Classification with Deep CNNs (2012) | paper: https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf | proceedings.neurips.cc refused by the egress policy (proxy 403) |
| `ai300.0.1` | ResNet — Deep Residual Learning (2015) | paper: https://arxiv.org/abs/1512.03385 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.0.2` | ViT — An Image Is Worth 16x16 Words (2020) | paper: https://arxiv.org/abs/2010.11929 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.0.3` | CLIP — Learning Transferable Visual Models (2021) | paper: https://arxiv.org/abs/2103.00020 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.1.0` | Attention Is All You Need (2017) | paper: https://arxiv.org/abs/1706.03762 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.1.1` | BERT — Pre-training Deep Bidirectional Transformers (2018) | paper: https://arxiv.org/abs/1810.04805 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.1.2` | GPT-2 — Language Models are Unsupervised Multitask Learners (2019) | paper: https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf | cdn.openai.com refused by the egress policy (proxy 403) |
| `ai300.1.3` | Chinchilla — Training Compute-Optimal LLMs (2022) | paper: https://arxiv.org/abs/2203.15556 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.2.0` | InstructGPT — Training LMs to Follow Instructions (2022) | paper: https://arxiv.org/abs/2203.02155 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.2.1` | LoRA — Low-Rank Adaptation of LLMs (2021) | paper: https://arxiv.org/abs/2106.09685 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.2.2` | DPO — Direct Preference Optimization (2023) | paper: https://arxiv.org/abs/2305.18290 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.2.3` | LLaMA — Open and Efficient Foundation Models (2023) | paper: https://arxiv.org/abs/2302.13971 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.3.0` | FlashAttention — Fast and Memory-Efficient Exact Attention (2022) | paper: https://arxiv.org/abs/2205.14135 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.3.1` | Mixtral — Mixture of Experts (2024) | paper: https://arxiv.org/abs/2401.04088 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.3.2` | DDPM — Denoising Diffusion Probabilistic Models (2020) | paper: https://arxiv.org/abs/2006.11239 | arxiv.org refused by the egress policy (proxy 403) |
| `ai300.3.3` | RAG — Retrieval-Augmented Generation (2020) | paper: https://arxiv.org/abs/2005.11401 | arxiv.org refused by the egress policy (proxy 403) |
| `ai310.0.0` | Lecture 1: Overview and Tokenization | video SQ3fZ1sAqXI (79 min) | no transcript tool works (V1) |
| `ai310.0.1` | Lec. 2: Pytorch, Resource Accounting | video msHyYioAyNE (79 min) | no transcript tool works (V1) |
| `ai310.0.2` | Lec. 3: Architectures, Hyperparameters | video ptFiH_bHnJw (87 min) | no transcript tool works (V1) |
| `ai310.0.3` | Lecture 4: Mixture of experts | video LPv1KfUXLCo (82 min) | no transcript tool works (V1) |
| `ai310.0.4` | Lecture 5: GPUs | video 6OBtO9niT00 (74 min) | no transcript tool works (V1) |
| `ai310.0.5` | Lecture 6: Kernels, Triton | video E8Mju53VB00 (80 min) | no transcript tool works (V1) |
| `ai310.0.6` | Lecture 7: Parallelism 1 | video l1RJcDjzK8M (85 min) | no transcript tool works (V1) |
| `ai310.0.7` | Lecture 8: Parallelism 2 | video LHpr5ytssLo (75 min) | no transcript tool works (V1) |
| `ai310.0.8` | Lecture 9: Scaling laws 1 | video 6Q-ESEmDf4Q (65 min) | no transcript tool works (V1) |
| `ai310.0.9` | Lecture 10: Inference | video fcgPYo3OtV0 (83 min) | no transcript tool works (V1) |
| `ai310.0.10` | Lecture 11: Scaling laws 2 | video OSYuUqGBQxw (78 min) | no transcript tool works (V1) |
| `ai310.0.11` | Lecture 12: Evaluation | video x-R5l2HsXqM (81 min) | no transcript tool works (V1) |
| `ai310.0.12` | Lecture 13: Data 1 | video WePxmeXU1xg (79 min) | no transcript tool works (V1) |
| `ai310.0.13` | Lecture 14: Data 2 | video 9Cd0THLS1t0 (79 min) | no transcript tool works (V1) |
| `ai310.0.14` | Lecture 15: Alignment - SFT/RLHF | video Dfu7vC9jo4w (75 min) | no transcript tool works (V1) |
| `ai310.0.15` | Lecture 16: Alignment - RL 1 | video 46f2QTDB08Q (81 min) | no transcript tool works (V1) |
| `ai310.0.16` | Lecture 17: Alignment - RL 2 | video JdGFdViaOJk (76 min) | no transcript tool works (V1) |
| `res400.0.0` | Introduction to Reinforcement Learning | video 2pWv7GOvuf0 (88 min) | no transcript tool works (V1) |
| `res400.0.1` | Markov Decision Process | video lfHX2hHRMVQ (102 min) | no transcript tool works (V1) |
| `res400.0.2` | Planning by Dynamic Programming | video Nd1-UUMVfz4 (99 min) | no transcript tool works (V1) |
| `res400.0.3` | Model-Free Prediction | video PnHCvfgC_ZA (97 min) | no transcript tool works (V1) |
| `res400.0.4` | Model Free Control | video 0g4j2k_Ggc4 (97 min) | no transcript tool works (V1) |
| `res400.0.5` | Value Function Approximation | video UoPei5o4fps (97 min) | no transcript tool works (V1) |
| `res400.0.6` | Policy Gradient Methods | video KHZVXao4qXs (94 min) | no transcript tool works (V1) |
| `res400.0.7` | Integrating Learning and Planning | video ItMutbeOHtc (100 min) | no transcript tool works (V1) |
| `res400.0.8` | Exploration and Exploitation | video sGuiWX07sKw (99 min) | no transcript tool works (V1) |
| `res400.0.9` | Classic Games | video kZ_AUmFcZtk (111 min) | no transcript tool works (V1) |
| `res400.1.0` | A Mathematical Framework for Transformer Circuits | reading: https://transformer-circuits.pub/2021/framework/index.html | transformer-circuits.pub refused by the egress policy (proxy 403) |
| `res400.1.1` | In-context Learning and Induction Heads | reading: https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html | transformer-circuits.pub refused by the egress policy (proxy 403) |
| `res400.1.2` | Toy Models of Superposition | reading: https://transformer-circuits.pub/2022/toy_model/index.html | transformer-circuits.pub refused by the egress policy (proxy 403) |
| `res400.1.3` | ARENA — Transformer Interpretability track | reading: https://www.arena.education/ | www.arena.education refused by the egress policy (proxy 403) |
| `res400.1.4` | Nanda — MI Quickstart & 200 Concrete Open Problems | reading: https://www.neelnanda.io/mechanistic-interpretability/quickstart | www.neelnanda.io refused by the egress policy (proxy 403) |
| `res400.2.0` | Hamming — You and Your Research | video a1zDuOPkMSw (44 min) | no transcript tool works (V1); the linked reading www.cs.virginia.edu is refused too |
| `res400.2.1` | How to read a paper — the three-pass method | reading: https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf | web.stanford.edu refused by the egress policy (proxy 403) |
