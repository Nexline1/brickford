# T-033 progress (resume from here)

Branch `loop/T-033-lecture-quizzes`, worktree `/home/user/bf-T-033`. Read this, then
`git log --oneline`, then continue with the next lecture below.

## Sources (check at the start of every session)

- **Spec amendment, 2026-10-14** (end of `spec.md`): AI 200 Unit II, AI 210 and AI 310
  Unit I are written from the authors' companion material on GitHub. Questions carry
  `src` (file + cell/section); sized by the VIDEO's length (5/6/8); evidence quotes come
  from the material; `sources.json` records repo, paths and commit SHA.
- Clone the repos (git-ignored) if `sources/repos/` is missing:
  `git clone --depth 1 https://github.com/<repo>.git sources/repos/<owner>_<name>` for
  karpathy/nn-zero-to-hero, micrograd, makemore, ng-video-lecture, minbpe, build-nanogpt;
  fastai/course22, fastai/fastbook; stanford-cs336/spring2025-lectures. Check HEAD
  against the SHAs in `sources.json`; if a repo moved, record the new SHA.
- Render notebooks: `python3 -I verification/nb2txt.py sources/text <notebooks...>`.
- Try one fetch of each owner-allowed host: arxiv.org, proceedings.neurips.cc,
  cdn.openai.com, transformer-circuits.pub, web.stanford.edu, www.cs.virginia.edu,
  www.neelnanda.io, www.arena.education. Last tried 2026-10-14 21:53 UTC: all refused.
- Videos waiting for transcripts (17): 3Blue1Brown ×4, Silver ×10, the 2 big-picture
  talks, Hamming. Retry `Yt_T` / `Youtube_Transcribt` once per session.

## Done

| # | key | source | checks |
|---|---|---|---|
| 1 | ai310.1.0 | HF LLM course ch. 1 (GitHub `huggingface/course`) | 6 (5 MCQ, 1 numeric) |
| 2 | ai310.1.1 | TRL SFT Trainer docs (GitHub `huggingface/trl`) | 6 (5 MCQ, 1 numeric) |
| 3 | ai310.1.2 | Transformers quantization overview (GitHub `huggingface/transformers`) | 6 (5 MCQ, 1 numeric) |
| 4 | ai310.1.3 | lm-evaluation-harness README | 6 (5 MCQ, 1 numeric) |
| 5 | ai310.1.4 | vLLM docs: landing, Quickstart, Automatic Prefix Caching | 6 (5 MCQ, 1 numeric) |
| 6 | ai310.1.5 | HF Agents course, Unit 1 | 6 (6 MCQ) |
| 7 | res400.2.2 | Karpathy, A Survival Guide to a PhD | 6 (5 MCQ, 1 numeric) |
| 8 | ai200.1.0 | micrograd lecture notebooks + karpathy/micrograd | 8 (5 MCQ, 3 numeric) |
| 9 | ai200.1.1 | makemore_part1_bigrams.ipynb | 8 (6 MCQ, 2 numeric) |
| 10 | ai200.1.2 | makemore_part2_mlp.ipynb | 6 (4 MCQ, 2 numeric) |
| 11 | ai200.1.3 | makemore_part3_bn.ipynb (bonus cells 22-25 excluded) | 8 (6 MCQ, 2 numeric) |
| 12 | ai200.1.4 | makemore_part4_backprop.ipynb | 8 (6 MCQ, 2 numeric) |
| 13 | ai200.1.5 | makemore_part5_cnn1.ipynb | 6 (5 MCQ, 1 numeric) |
| 14 | ai200.1.6 | karpathy/ng-video-lecture (gpt.py, bigram.py, git history) | 8 (6 MCQ, 2 numeric) |
| 15 | ai200.1.7 | karpathy/minbpe (lecture.md, package, tests) | 8 (6 MCQ, 2 numeric) |
| 16 | ai200.1.8 | karpathy/build-nanogpt (train_gpt2.py, fineweb, hellaswag, play.ipynb, history) | 8 (4 MCQ, 4 numeric) |

## Next, in order (calendar order within what is buildable; AI 200 first)

ai210.0.0–0.7 (course22 lesson notebooks + fastbook chapters; 83/77/90 → 6, 95/103/103/107/97 → 8)
→ ai310.0.0–0.16 (spring2025-lectures, all 65–87 min → 6).

At the end: rerun `verification/plants/run-plants.sh` (spec plants a–e plus f), the full
CHECK one gate at a time (summary in `verification/check/`), screenshots (`shots.js`),
and write `verification/audit.md`.

## Per-lecture routine

1. Read the lecture's material in full (notebook text in `sources/text/`, repo files).
2. Write the entry in `platform/data/summaries-<course>.js` (`src` on every check).
3. Numerics → `expectedSummary` in `tools/verify-content.js`, derived another way.
4. Evidence → `verification/evidence/<course>.jsonl`; repo/paths/SHA → `sources.json`.
5. `node tools/verify-content.js` and `node verification/check-evidence.js`.
6. Commit and push every 3 lectures.
