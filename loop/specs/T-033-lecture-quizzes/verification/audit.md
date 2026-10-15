# T-033 sample audit

Done 2026-10-15 on the final data (AI 200 9, AI 210 8, AI 310 23, RES 400 1 lectures;
270 checks). The sample is drawn by `verification/audit-pick.js`: a fixed-seed LCG
(seed 20261015) picks 10 of the 270 checks, sorted by key and index. Rerun it to get
the same 10; nothing was re-drawn.

`check-evidence.js` already proves every quote is verbatim in the cached source. This
audit asks the other question: does the quote, read in its context in the source, support
the answer the quiz marks correct? Each one was opened at the line given.

## 10 questions traced to their evidence

| # | check | answer marked correct | evidence quote | found at | supports the answer? |
|---|---|---|---|---|---|
| 1 | `ai200.1.7` 4: why RegexTokenizer splits by category before BPE | "So no merge — and so no token — can cross a category boundary" | "This ensures that no merges will happen across category boundaries." | `karpathy/minbpe` README.md:11 | Yes. The sentence follows the description of the regex split into letters, numbers and punctuation. |
| 2 | `ai200.1.7` 5: why LLMs are bad at simple arithmetic | "Numbers are split into tokens arbitrarily, such as 677 as ' 6' and '77'" | "the number 127 is a single token of three characters, but the number 677 because two tokens" | `karpathy/minbpe` lecture.md:104 | Yes. The same paragraph names the tokens " 6" and "77". ("because" is the source's typo for "becomes".) |
| 3 | `ai210.0.0` 3: what `learn.fine_tune(1)` does | "It fits the new head, then trains it all, the later layers updated faster" | "updating the weights of the later layers (especially the head) faster than the earlier layers" | `fastai/fastbook` 01_intro.ipynb, rendered text line 684 | Yes. Line 683 is the first step (one epoch to fit the new head); line 684 is the second (the whole model, later layers faster). |
| 4 | `ai310.0.0` 4: character tokenizer's bytes per token on 'Hello, 🌍! 你好!' | 1.54 (tol 0.01) | `assert bytes("🌍", encoding="utf-8") == b"\xf0\x9f\x8c\x8d"` | `stanford-cs336/spring2025-lectures` lecture_01.py, character_tokenizer / byte_tokenizer | Yes. The quote establishes that 🌍 is 4 bytes. The full derivation is in N1 below, and the recorded trace prints `compression_ratio = 1.5384615384615385` at line 632. |
| 5 | `ai310.0.10` 3: what breaks muP's learning-rate transfer | "Learnable RMSNorm gains (and, notably, strong weight decay)" | "In our arch – RMSNorm has learnable gains. This turns out to break muP" | Lecture 11 slides, text line 336 (slide 51) | Yes. Slide 53 adds "strong (0.1) weight decay … maybe the only significant muP failure", which the parenthesis reflects. The distractors (SwiGLU, batch size, zero-query init) are listed on slides 48–50 as things muP is robust to. |
| 6 | `ai310.0.2` 5: T5's (heads × head dim) / d_model | 16 | "T5 128 128 1024 16" | Lecture 3 slides, text line 392 (slide 43 table) | Yes. The table's columns are Num heads, Head dim, Model dim, Ratio. N2 re-derives it. |
| 7 | `ai310.0.4` 1: what operator fusion saves | "Trips to memory: intermediates stay on-chip, not written back" | "What if we have to do many operations? Shipping back and forth is somewhat silly" | Lecture 5 slides, text line 176 (slide 27) | Yes. Slide 26 sets up the factory/warehouse picture (memory = warehouse), slide 27 is "Operator fusion to minimize memory access", and slide 29 fuses 5 kernels into 1. |
| 8 | `ai310.0.9` 2: what PagedAttention solves | "KV-cache fragmentation, by storing it in non-contiguous blocks" | "Divide the KV cache of a sequence into non-contiguous blocks" | lecture_10.py:533 (paged_attention; `**blocks**` in the source, the asterisks normalised away) | Yes. Line 528 states the problem ("Problem: fragmentation"), followed by internal and external fragmentation, and then the solution. |
| 9 | `ai310.0.9` 4: H100 accelerator intensity, the B above which the matmul is compute-limited | 295 (tol 1) | `assert round(accelerator_intensity) == 295` | lecture_10.py:130 | Yes. Lines 127–129 give 989e12 FLOP/s and 3.35e12 B/s, and line 124 asserts the matmul's intensity equals B. N3 re-derives it. |
| 10 | `ai310.1.2` 0: what quantization trades, and for what | "Precision of the stored weights, for lower memory, while keeping as much accuracy as it can" | "lowers the memory requirements of loading and using a model by storing the weights in a lower precision while trying to preserve as much accuracy" | `huggingface/transformers` docs/source/en/quantization/overview.md:19 | Yes, nearly word for word. |

**Result: 10 of 10 supported.** There are no wrong keys and no answers that go beyond the
source. Two observations came out of the audit, and neither changes a quiz:

- #2's source has a typo ("because" for "becomes"). The quote copies it verbatim, as the
  evidence rule requires.
- #5's answer goes one step beyond its quote: the weight-decay half comes from slide 53,
  inside the cited slide range. A reviewer reading only the evidence line would see half
  of the justification. That is acceptable because `src` names slides 46–54, but it is
  the pattern to watch.

## 3 numerics re-derived by hand

These were worked by hand from the source, not from the data file or `expectedSummary`.

**N1 — `ai310.0.0` check 4 (stated 1.54, tol 0.01).** The string is
`Hello, 🌍! 你好!`, and the character tokenizer gives one token per Unicode code point:
H, e, l, l, o, comma, space, 🌍, !, space, 你, 好, ! — that is **13 tokens**.

The UTF-8 bytes are:

| characters | bytes |
|---|---|
| "Hello, " (7 ASCII) | 7 |
| 🌍 (U+1F30D, 4-byte sequence F0 9F 8C 8D, as the lecture's assert shows) | 4 |
| "! " | 2 |
| 你 and 好 (CJK, 3 bytes each) | 6 |
| final "!" | 1 |
| **total** | **20** |

`get_compression_ratio` is num_bytes / num_tokens = 20 / 13 = 1.5385, which is **1.54** to
two decimals. The trace agrees (1.5384615…). ✔

**N2 — `ai310.0.2` check 5 (stated 16).** 128 heads × 128 dims = 16,384, and
16,384 / 1,024 = **16**. That is 16 times the usual 1:1 ratio that GPT-3 (96 × 128 =
12,288 = d_model) and T5 v1.1 (64 × 64 = 4,096) follow. ✔

**N3 — `ai310.0.9` check 4 (stated 295, tol 1).** For X (B × D) @ W (D × F) in bf16:

- FLOPs = 2BDF.
- Bytes = 2BD + 2DF + 2BF.
- Intensity = 2BDF / (2BD + 2DF + 2BF) = BDF / (BD + DF + BF).
- When B ≪ D, F the denominator is ≈ DF, so the intensity is ≈ **B** (the lecture's
  `assert intensity == B` under that limit).

The H100's own intensity is 989 × 10¹² / 3.35 × 10¹² = 989 / 3.35. Since 3.35 × 295 =
988.25, and the remaining 0.75 / 3.35 ≈ 0.22, the ratio is ≈ 295.2.

The matmul is compute-limited when its intensity exceeds the accelerator's, so above
B ≈ **295**. ✔
