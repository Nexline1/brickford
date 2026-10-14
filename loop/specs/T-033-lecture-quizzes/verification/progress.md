# T-033 progress (resume from here)

Branch `loop/T-033-lecture-quizzes`, worktree `/home/user/bf-T-033`. Read this, then
`git log --oneline`, then continue with the next lecture below.

## Source access (check first — it decides what is buildable)

- Videos: BLOCKED. `Yt_T` needs an API key; `Youtube_Transcribt` returns nothing.
  Re-try one call each at the start of a session; if either works, the videos open up
  in `order.md` order (AI 200 first).
- Papers and readings: only GitHub-hosted sources are reachable. See `unavailable.md`.

## Done

| # | key | source | checks |
|---|---|---|---|
| 1 | ai310.1.0 | HF LLM course ch. 1 (GitHub `huggingface/course`) | 6 (5 MCQ, 1 numeric) |
| 2 | ai310.1.1 | TRL SFT Trainer docs (GitHub `huggingface/trl`) | 6 (5 MCQ, 1 numeric) |
| 3 | ai310.1.2 | Transformers quantization overview (GitHub `huggingface/transformers`) | 6 (5 MCQ, 1 numeric) |
| 4 | ai310.1.3 | lm-evaluation-harness README (GitHub `EleutherAI/lm-evaluation-harness`) | 6 (5 MCQ, 1 numeric) |
| 5 | ai310.1.4 | vLLM docs: landing, Quickstart, Automatic Prefix Caching (GitHub `vllm-project/vllm`) | 6 (5 MCQ, 1 numeric) |

## Next (buildable now, in calendar order)

ai310.1.5 (HF agents course) → res400.2.2 (Karpathy PhD guide, GitHub
`karpathy/karpathy.github.io` `_posts/2016-09-07-phd.markdown`).

Then: plants (a)–(e), gates, screenshots, audit.md.

## Per-lecture routine

1. Fetch the source into `sources/` (git-ignored), record it in `verification/sources.json`.
2. Read all of it. 3. Write the entry in `platform/data/summaries-<course>.js`.
4. Numerics → `expectedSummary` in `tools/verify-content.js`, derived another way.
5. Evidence → `verification/evidence/<course>.jsonl`; run `check-evidence.js`.
6. `node tools/verify-content.js`. 7. Commit and push every 3 lectures.
