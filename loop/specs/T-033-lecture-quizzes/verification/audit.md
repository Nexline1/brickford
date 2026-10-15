# T-033 sample audit

First done on 2026-10-15 and redone the same day after review round 1 (see the last
section). The data covers AI 200 9, AI 210 8, AI 310 23 and RES 400 1 lectures: 270 checks.

The sample is drawn by `verification/audit-pick.js`. A fixed-seed LCG (seed 20261015) picks
10 of the 270 checks, sorted by key and index. Rerun it to get the same 10; nothing was
re-drawn. The draw lands on the same positions both times. One of them, #2, is a different
question now, because review round 1 replaced it.

`check-evidence.js` already proves every quote is verbatim in the cached source. Since review
round 1, the cached source is the material **as it stood when the video was made**: the
video-date snapshots in `sources/videodate/` and the served-version pins in `sources/pinned/`.

This audit asks a different question: does the quote, read in its context, support the answer
the quiz marks correct? Each quote was opened at the line given, in the video-date or pinned
file.

## 10 questions traced to their evidence

| # | check | answer marked correct | evidence quote | found at | supports the answer? |
|---|---|---|---|---|---|
| 1 | `ai200.1.7` 4: why RegexTokenizer splits by category before BPE | "So no merge — and so no token — can cross a category boundary" | "This ensures that no merges will happen across category boundaries." | `karpathy/minbpe` README.md:11 at a98e0a5, the video-date commit | Yes. The sentence follows the description of the regex split into letters, numbers and punctuation. |
| 2 | `ai200.1.7` 5: how many chunks GPT-4's pattern makes of 1234567 | 3 | `\|\p{N}{1,3}\|` | `minbpe/regex.py`:19, `GPT4_SPLIT_PATTERN` (identical blob at a98e0a5 and HEAD) | Yes. The pattern's number branch matches at most three digits at a time, giving '123', '456', '7'. N4 re-derives it. *(This replaced the '677' question, which relied on `lecture.md`, written after the video.)* |
| 3 | `ai210.0.0` 3: what `learn.fine_tune(1)` does | "It fits the new head, then trains it all, the later layers updated faster" | "updating the weights of the later layers (especially the head) faster than the earlier layers" | `fastai/fastbook` 01_intro.ipynb at 2b8b8a2 (the course release), rendered line 684 | Yes. Line 683 is the first step (one epoch to fit the new head); line 684 is the second (the whole model, later layers faster). |
| 4 | `ai310.0.0` 4: character tokenizer's bytes per token on 'Hello, 🌍! 你好!' | 1.54 (tol 0.01, "Two decimals.") | `assert bytes("🌍", encoding="utf-8") == b"\xf0\x9f\x8c\x8d"` | lecture_01.py at 246e39d (lecture day), character_tokenizer / byte_tokenizer | Yes. The quote establishes that 🌍 is 4 bytes; N1 has the full derivation. |
| 5 | `ai310.0.10` 3: what breaks muP's learning-rate transfer | "Learnable RMSNorm gains (and, notably, strong weight decay)" | "In our arch – RMSNorm has learnable gains. This turns out to break muP" | Lecture 11 slides, text line 336 (slide 51); the PDF is unchanged since the lecture | Yes. Slide 53 adds "strong (0.1) weight decay … maybe the only significant muP failure", which the parenthesis reflects. |
| 6 | `ai310.0.2` 5: T5's (heads × head dim) / d_model | 16 | "T5 128 128 1024 16" | Lecture 3 slides, text line 392 (slide 43 table) | Yes. The table's columns are Num heads, Head dim, Model dim, Ratio. N2 re-derives it. |
| 7 | `ai310.0.4` 1: what operator fusion saves | "Trips to memory: intermediates stay on-chip, not written back" | "What if we have to do many operations? Shipping back and forth is somewhat silly" | Lecture 5 slides, text line 176 (slide 27) | Yes. Slide 26 is the warehouse/factory picture, slide 27 "Operator fusion to minimize memory access", and slide 29 fuses 5 kernels into 1. |
| 8 | `ai310.0.9` 2: what PagedAttention solves | "KV-cache fragmentation, by storing it in non-contiguous blocks" | "Divide the KV cache of a sequence into non-contiguous blocks" | lecture_10.py:532 at f8e785c (lecture day); `**blocks**` in the source, with the asterisks normalised away | Yes. The problem is stated just above ("Problem: fragmentation", internal and external). |
| 9 | `ai310.0.9` 4: H100 accelerator intensity, the B above which the matmul is compute-limited | 295 (tol 1) | `assert round(accelerator_intensity) == 295` | lecture_10.py:130 at f8e785c | Yes. Lines 127–128 give 989e12 FLOP/s and 3.35e12 B/s, and line 124 asserts that the matmul's intensity equals B. N3 re-derives it. |
| 10 | `ai310.1.2` 0: what quantization trades, and for what | "Precision of the stored weights, for lower memory, while keeping as much accuracy as it can" | "lowers the memory requirements of loading and using a model by storing the weights in a lower precision while trying to preserve as much accuracy" | `huggingface/transformers` overview.md:19 at v5.19.0 (c4c4605), the version the live docs serve | Yes, nearly word for word. |

**Result: 10 of 10 supported.** One observation does not change a quiz. #5's answer goes one
step beyond its quote: the weight-decay half comes from slide 53, inside the cited range. That
is acceptable because `src` names slides 46–54, but it is a pattern to watch.

## Numerics re-derived by hand

These were worked by hand from the source, not from the data file or `expectedSummary`.

**N1 — `ai310.0.0` check 4 (stated 1.54, tol 0.01).** The character tokenizer gives one token
per code point: H, e, l, l, o, comma, space, 🌍, !, space, 你, 好, ! — that is **13 tokens**.

The UTF-8 bytes are:

| characters | bytes |
|---|---|
| "Hello, " | 7 |
| 🌍 (F0 9F 8C 8D) | 4 |
| "! " | 2 |
| 你, 好 (3 bytes each) | 6 |
| "!" | 1 |
| **total** | **20** |

20 / 13 = 1.538, which is **1.54**. The lecture-day trace agrees. ✔

**N2 — `ai310.0.2` check 5 (stated 16).** 128 × 128 = 16,384, and 16,384 / 1,024 = **16**.
That is 16 times the usual 1:1 ratio (GPT-3: 96 × 128 = 12,288 = d_model). ✔

**N3 — `ai310.0.9` check 4 (stated 295, tol 1).**

1. The matmul's FLOPs are 2BDF and its bytes are 2(BD + DF + BF).
2. When B ≪ D, F, the intensity is ≈ B.
3. The H100's intensity is 989 / 3.35. Since 3.35 × 295 = 988.25, the ratio is ≈ 295.2.

So the matmul is compute-limited above B ≈ **295**. ✔

**N4 — `ai200.1.7` check 5 (stated 3).** Scanning 1234567 from the left, `\p{N}{1,3}` takes
'123', then '456', then '7' — **3** chunks. The pattern's other branches need a letter,
whitespace or punctuation, so none of them can match inside the number. ✔

**N5 — `ai310.0.8` check 5 (stated 16.4, tol 0.1, new in review round 1).**

1. Mistral 7B has N × D = 7 × 770 = 5,390, in units of 10¹⁸ parameter-tokens.
2. At 20 tokens per parameter the same product is 20 N², so N² = 269.5.
3. 16² = 256 and 16.5² = 272.25, so N lies between 16 and 16.5.
4. 16.4² = 268.96 and 16.42² = 269.62, so N ≈ 16.42, which is **16.4**B. ✔

**N6 — `ai310.0.10` check 5 (stated 10.8, new in review round 1).**

- The stable run must reach the last branch point, at 90% of 8B: 7.2B.
- The decays add 10% of each size: 0.1 × (1 + … + 8) = 0.1 × 36 = 3.6B.
- 7.2 + 3.6 = **10.8**B, against 36B for eight cosine runs. ✔

## What the first audit missed, and what changed

The first pass of this audit (10 of 10 supported) did not catch the defects that review
round 1 found, and the lessons are worth keeping.

**It audited against the wrong version.** Every quote was checked against the material as it
stands now. ai200.1.6 check 2 quoted a line that a community PR introduced ten days after the
video. ai200.1.7 check 5 quoted `lecture.md`, which was written two days after the video. Both
were "verbatim in the cached source", and both were wrong about what the lecture showed. The
cached source is now the video-date material, so `check-evidence.js` catches this class of
error.

**It checked support, not mechanism.** The minbpe beat described the README's (Wikipedia's)
merge order. The code merges differently and only happens to reach the same ids, so a quote
check could never see the difference. Reading what the code actually does is what caught it
(ai200.1.7, finding 2).

**It checked support, not gradability.** It did not check whether the natural answer is
accepted. Several numerics rejected the obvious rounding, and comma-formatted integers are
graded wrong. A precision note or "(digits only, no commas)" now accompanies each one
(findings 3, 7, 8).
