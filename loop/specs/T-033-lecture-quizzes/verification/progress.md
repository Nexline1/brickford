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
- Render notebooks: `python3 -I verification/nb2txt.py sources/text <notebooks...>`;
  spreadsheets: `python3 -I verification/xlsx2txt.py <file.xlsx> 12 40 > sources/text/<file>.xlsx.txt`;
  slide PDFs: `pip install --target <scratch>/pylib pypdf==5.1.0` (outside the repo), then
  `PYTHONPATH=<scratch>/pylib python3 verification/pdf2txt.py <pdf> sources/text/cs336/<name>.txt`.
- fastai/course22-web (lesson pages, for the lesson-to-material map) is cloned to
  `sources/repos/fastai_course22-web`.
- Try one fetch of each owner-allowed host: arxiv.org, proceedings.neurips.cc,
  cdn.openai.com, transformer-circuits.pub, web.stanford.edu, www.cs.virginia.edu,
  www.neelnanda.io, www.arena.education. Last tried 2026-10-15 02:22 UTC: all refused
  (proxy CONNECT 403).
- Videos waiting for transcripts (17): 3Blue1Brown ×4, Silver ×10, the 2 big-picture
  talks, Hamming. Retry `Yt_T` / `Youtube_Transcribt` once per session. 2026-10-15: `Yt_T`
  still asks for an API key; `Youtube_Transcribt` returns empty output.

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
| 17 | ai210.0.0 | course22 00 bird + 01 Jupyter 101; fastbook ch. 1 (map: course22-web lesson1.qmd) | 6 (6 MCQ) |
| 18 | ai210.0.1 | course22 02 saving a model; fastbook ch. 2 (lesson2.qmd) | 6 (6 MCQ) |
| 19 | ai210.0.2 | course22 03 image models, 04 neural net, xl/titanic.xlsx; fastbook ch. 4 (lesson3.qmd) | 6 (4 MCQ, 2 numeric) |
| 20 | ai210.0.3 | course22 slides/nlp-intro.ipynb; fastbook ch. 10 (lesson4.qmd) | 8 (8 MCQ) |
| 21 | ai210.0.4 | course22 05 from scratch, 06 why a framework (lesson5.qmd) | 8 (6 MCQ, 2 numeric) |
| 22 | ai210.0.5 | course22 07 random forests, 08 road to the top 1; fastbook ch. 9 (lesson6.qmd) | 8 (6 MCQ, 2 numeric) |
| 23 | ai210.0.6 | course22 10 road to the top 3, xl/entropy_example, xl/collab_filter; fastbook ch. 8 (lesson7.qmd) | 8 (5 MCQ, 3 numeric) |
| 24 | ai210.0.7 | fastbook ch. 8 (embeddings) and ch. 13; xl/collab_filter, xl/conv-example (lesson8.qmd) | 8 (6 MCQ, 2 numeric) |
| 25 | ai310.0.0 | CS336 lecture_01.py + its trace | 6 (3 MCQ, 3 numeric) |
| 26 | ai310.0.1 | CS336 lecture_02.py + its trace | 6 (4 MCQ, 2 numeric) |
| 27 | ai310.0.2 | CS336 nonexecutable/2025 Lecture 3 - architecture.pdf | 6 (4 MCQ, 2 numeric) |
| 28 | ai310.0.3 | CS336 nonexecutable/2025 Lecture 4 - MoEs.pdf | 6 (4 MCQ, 2 numeric) |
| 29 | ai310.0.4 | CS336 nonexecutable/2025 Lecture 5 - GPUs.pdf | 6 (4 MCQ, 2 numeric) |
| 30 | ai310.0.5 | CS336 lecture_06.py, gelu.cu + trace | 6 (4 MCQ, 2 numeric) |
| 31 | ai310.0.6 | CS336 nonexecutable/2025 Lecture 7 - Parallelism basics.pdf | 6 (4 MCQ, 2 numeric) |
| 32 | ai310.0.7 | CS336 lecture_08.py + recorded stdout | 6 (4 MCQ, 2 numeric) |
| 33 | ai310.0.8 | CS336 nonexecutable/2025 Lecture 9 - Scaling laws basics.pdf | 6 (4 MCQ, 2 numeric) |
| 34 | ai310.0.9 | CS336 lecture_10.py + trace | 6 (4 MCQ, 2 numeric) |
| 35 | ai310.0.10 | CS336 nonexecutable/2025 Lecture 11 - Scaling details.pdf | 6 (4 MCQ, 2 numeric) |
| 36 | ai310.0.11 | CS336 lecture_12.py | 6 (4 MCQ, 2 numeric) |
| 37 | ai310.0.12 | CS336 lecture_13.py | 6 (4 MCQ, 2 numeric) |
| 38 | ai310.0.13 | CS336 lecture_14.py + trace | 6 (4 MCQ, 2 numeric) |
| 39 | ai310.0.14 | CS336 nonexecutable/2025 Lecture 15 - RLHF Alignment.pdf | 6 (5 MCQ, 1 numeric) |
| 40 | ai310.0.15 | CS336 nonexecutable/2025 Lecture 16 - RLVR.pdf | 6 (4 MCQ, 2 numeric) |
| 41 | ai310.0.16 | CS336 lecture_17.py + trace | 6 (4 MCQ, 2 numeric) |

## Next, in order (calendar order within what is buildable; AI 200 first)

AI 210 and AI 310 Unit I complete: every lecture buildable from course materials is built.
Remaining lectures wait on transcripts or paper hosts (unavailable.md).

End-of-build steps, 2026-10-15: plants (a)–(g) re-run on the final data (all exit 1, control
exit 0, every restore proven with cmp; `plants/plants-summary.txt`); full CHECK one gate at a
time plus clip under TZ=America/Los_Angeles (`check/summary.txt`); screenshots (`shots.js`);
`audit.md` (10 sampled questions traced, 3 numerics by hand); `unavailable.md` updated.

## Per-lecture routine

1. Read the lecture's material in full (notebook text in `sources/text/`, repo files).
2. Write the entry in `platform/data/summaries-<course>.js` (`src` on every check).
3. Numerics → `expectedSummary` in `tools/verify-content.js`, derived another way.
4. Evidence → `verification/evidence/<course>.jsonl`; repo/paths/SHA → `sources.json`.
5. `node tools/verify-content.js` and `node verification/check-evidence.js`.
6. Commit and push every 3 lectures.
