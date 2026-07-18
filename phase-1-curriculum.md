# Phase 1 Curriculum — Months 1–6 (Weeks 3–26)

Starts when Phase 0 diagnostics are logged. Adjust per diagnostic results (see rules at bottom).

## The Daily Template (Deep Track, 4–5 h)

| Block | Time | Content |
|---|---|---|
| Theory | ~2 h | Karpathy video + reproducing it by hand (never just watch) |
| Build | ~1.5 h | NeetCode (45 min, ~1 problem/day) + fast.ai / project work |
| Publish | ~30 min | Notes → weekly blog post; build-in-public post on X |

Rule for Karpathy: watch a segment → close the video → rewrite the code from memory → compare. A 2-hour video legitimately takes 6–8 hours to *own*. That's the point.

## Week-by-Week

**Weeks 3–4 — Micrograd.** Zero to Hero video 1: build micrograd (backprop engine) from scratch. Then rebuild it blind. Blog post: "I built backprop from scratch — here's what a gradient actually is." NeetCode: Arrays & Hashing. fast.ai lesson 1.

**Weeks 5–7 — Makemore 1–2.** Bigram models, then MLP (following Bengio 2003 — your first paper contact). NeetCode: Two Pointers, Sliding Window. fast.ai lessons 2–3. Post weekly.

**Weeks 8–10 — Makemore 3–4.** Activations, BatchNorm, becoming a "backprop ninja" (manual backward pass through a full network — do NOT skip this one; it's the single best exercise in the series). NeetCode: Stack, Binary Search. fast.ai lessons 4–5.

**Weeks 11–13 — Makemore 5 + GPT.** WaveNet-style CNN, then "Let's build GPT from scratch" — the transformer, attention, the whole thing. NeetCode: Linked List, Trees start. fast.ai lessons 6–7.

**Weeks 14–16 — Tokenizer + consolidation.** "Let's build the GPT Tokenizer." Then reproduce the full GPT pipeline end-to-end with zero reference. Blog series: "The Transformer, explained by someone who just built it" (consider an Arabic version — nobody in the region is doing this well). NeetCode: Trees. fast.ai lessons 8–9 (done with part 1).

**Weeks 17–20 — First original project.** Train a small GPT on a dataset YOU choose (Arabic text? Quran + classical Arabic corpus? football commentary?). Original data + from-scratch model = first serious portfolio piece. Write it up properly. NeetCode: Heap, Backtracking.

**Weeks 21–24 — nanoGPT + PyTorch depth.** Read Karpathy's nanoGPT repo line by line; train it on your dataset; profile it; make one real improvement (speed, data loading, logging). Learn proper PyTorch idioms (Dataset/DataLoader, mixed precision, checkpointing). NeetCode: Graphs.

**Weeks 25–26 — Month-6 gate review.** Rebuild GPT from blank file, timed. Count: DSA solved (target 150), posts (target 20+), repos (target 5+). Fill the gate row in progress-log.md. If passed → Phase 2 (paper reimplementations begin). If not → diagnose which block underperformed, fix pacing, retake gate in 4 weeks.

## Adjustment rules (from Phase 0 results)

- **Math subject <70%** → add 1 h/day for that subject (Deisenroth MML book, matched chapter) until you can pass the same exam ≥70%. Retest monthly. Deep Track build block shrinks to make room — theory block is untouchable.
- **Coding diagnostic weak (0–4 NeetCode / unfinished build)** → weeks 3–10 NeetCode time goes to 1.5 h/day, easy tier only until 8/10 easy solve rate, and every Karpathy rebuild gets typed with zero autocomplete.
- **Everything strong** → pull fast.ai part 2 (from-scratch diffusion) into weeks 20–26.

## Resources (all free)

- [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html) · [nanoGPT](https://github.com/karpathy/nanoGPT)
- [fast.ai Practical Deep Learning](https://course.fast.ai/)
- [NeetCode roadmap](https://neetcode.io/roadmap)
- [Mathematics for ML (Deisenroth)](https://mml-book.github.io/) · [3Blue1Brown — NN series](https://www.3blue1brown.com/topics/neural-networks)
