# T-033 notes

## Data oddities (reported, not fixed — curriculum.js is out of scope)

| lesson | what | effect on the quiz |
|---|---|---|
| `ai300.0.0` AlexNet and `ai300.0.1` ResNet | both carry `v: "DAOcjicFr1Y", min: 78` | Two different papers share one video, so the lesson page shows the same lecture for both and the calendar counts its 78 minutes twice. Each quiz is to be written from the paper the lesson names, with `src` sections and 6 checks (the paper size), not from the shared video. |
| `ai300.1.2` GPT-2 | `v: "kCc8FmEb1nY", min: 116` is AI 200's "Let's build GPT" (`ai200.1.6`) | The video is a Karpathy build of a small GPT, not the GPT-2 paper. The quiz is to come from the paper (`cdn.openai.com/.../language_models_are_unsupervised_multitask_learners.pdf`), 6 checks. As a 116-minute video it would have needed 8; verify-content sizes a quiz by its source, and allows a reading-sourced quiz on a video lesson only when the lesson names a paper or reading. |
| `ai300.3.1` Mixtral | `v: "LPv1KfUXLCo", min: 82` is CS336 lecture 4 (`ai310.0.3`) | Quiz from the Mixtral paper (arXiv 2401.04088), 6 checks. The video is also quizzed in its own right under `ai310.0.3`. |

The owner's choices: give each AI 300 paper its own video (or none), or keep the
duplicates knowingly. Nothing in T-033 depends on which.

All four AI 300 lessons are currently in `unavailable.md` (P1: arXiv, NeurIPS and the
OpenAI CDN are refused by the egress policy), so none of these quizzes exists yet.

## Reading scope — where the linked page is not the whole reading

- `ai310.1.0` "The Hugging Face LLM course — pipeline fundamentals" links
  `chapter1/1`, which is the course's welcome page (authors, FAQ, translations). The
  lesson is chapter 1, so all of its reading sections were read (1.1–1.6, 1.8–1.10;
  1.7 is a quiz and 1.11 the certification exam) and the quiz spans them.
- `ai310.1.1` names "TRL + alignment handbook" but links only TRL's SFT Trainer page;
  the quiz is from that page.
- `ai310.1.3` names "contamination, and why public benchmarks lie" and links the
  lm-evaluation-harness README, which never discusses contamination. The quiz covers
  what the README does say (backends, parallel layouts, logprob limits, answer
  extraction, and its prompt-procedure priority, which exists to limit the harm of
  cross-paper comparisons). If the owner wants contamination taught, the lesson needs
  a reading that covers it.
- `ai310.1.4` links the vLLM docs root, which is a feature list. The lesson names
  PagedAttention and the KV cache, so the reading is the landing page plus two pages of
  the same docs site: the Quickstart (the landing page's named starting point for
  running models) and Automatic Prefix Caching (how KV-cache blocks are pooled, hashed,
  reused and evicted). The docs' PagedAttention page was opened and not used: it says
  it is a historical document that no longer describes vLLM's code.
- `ai310.1.5` links `agents-course/unit0/introduction`, the course welcome (syllabus,
  certificates, team). The lesson is tool use and function calling, which the syllabus
  places in Unit 1, "Agent Fundamentals"; Unit 1 was read in full (its quizzes
  excepted) and the quiz is from it. Fine-tuning for function calling is the course's
  Bonus Unit 1 and was not read. "Failure modes" is covered by Unit 1's hallucinated
  observation and the code-execution risk.

## Companion material — scope and exclusions (spec amendment, 2026-10-14)

With no transcript, a lecture is quizzed only on what its own material shows the
lecture does. Where the material marks something as outside the video, it is left out:

- AI 200: makemore part 3's bonus cells 22-25 ("not covered in video"); ng-video-lecture's
  `_init_weights` (added after the video); build-nanogpt's lines marked "added after
  video" (uint16 to int32, `device_type`, `require_backward_grad_sync`).
- AI 210: which notebooks and chapters belong to each lesson comes from the course's own
  lesson pages, `fastai/course22-web` `Lessons/lessonN.qmd` (pinned in `sources.json`).
  Those pages say each lesson is "based partly on" a book chapter, so chapter questions
  stay on the topics the lesson page names. The student-written "Summaries" pages on the
  same site are not used. Per lesson:
  - L2 (`ai210.0.1`): the lesson deploys with Gradio on Hugging Face Spaces; the chapter's
    Voila/Binder steps are not quizzed, nor are the Drivetrain Approach and "How to Avoid
    Disaster", which the page does not show the lesson covering. The chapter's SerpAPI
    cells are a later edit to the book (Bing's image API was retired) and are not quizzed.
  - L3 (`ai210.0.2`): the page names SGD, linear layers with nonlinear activations and
    ReLU; chapter 4 questions stay there (not `mnist_loss`, sigmoid or DataLoader detail).
    `xl/titanic.xlsx` was read sheet by sheet with `xlsx2txt.py` (formulas included).
  - L4 (`ai210.0.3`): the lesson notebook is course22's `slides/nlp-intro.ipynb` (the
    course's copy of the Kaggle notebook), which stops at `trainer.train()`. Chapter 10
    questions stay on ULMFiT and tokenization.
  - L5 (`ai210.0.4`): the page lists notebooks 05, 06 and 07; its description is the
    from-scratch model, sigmoid and metrics, so 05 and 06 are quizzed here and 07 (random
    forests) once, with L6, whose page lists it again.
  - L6 (`ai210.0.5`): 07, 08 (Road to the top, part 1) and chapter 9's random-forest,
    interpretation and extrapolation sections; not its embeddings or neural-net sections.
  - L7 and L8 (`ai210.0.6`, `ai210.0.7`) share chapter 8 and `collab_filter.xlsx`. L7's page
    describes the dot-product and deep-learning approaches, so it is quizzed on latent
    factors, biases and weight decay (plus Road to the Top part 3 and the entropy sheet);
    L8's page says it finishes collaborative filtering 'by looking closely at embeddings',
    so it is quizzed on the embedding lookup, interpreting it and bootstrapping, then on
    chapter 13's convolutions and `conv-example.xlsx`. Chapter 13's training-stability half
    (ActivationStats, 1cycle, batchnorm) is not quizzed. Road to the Top part 4 and the
    Collaborative Filtering Deep Dive are Kaggle-only and not in course22.

### Small errors in the source material (not quizzed, reported for the owner)

- `course22/04-how-does-a-neural-net-really-work.ipynb` cell 19 says "a table of numbers
  (a *matrix* or *rank-0 tensor*)"; a matrix is rank 2, as the book's own jargon recap says.
- The same notebook's loop in cell 47 calls `backward()` each step without zeroing
  `abc.grad`, so the gradients accumulate; chapter 4 explains why they must be zeroed.
  The quiz asks only what the notebook says about the rising loss (cell 48).
- `course22/07-how-random-forests-really-work.ipynb` cell 67 says gini is "the probability
  that, if you pick two rows from a group, you'll get the same `Survived` result", 1.0 for a
  uniform group. The formula it defines, 1 - p² - (1-p)², is the probability the two rows
  DIFFER: 0 for a uniform group. The `ai210.0.5` question uses the formula and its
  explanation states the meaning correctly. The same notebook's feature-importance plot
  (cell 94) uses the single tree `m`, not the forest `rf` the prose describes, and cell 95
  points to chapter 8 for feature importance, which is in chapter 9.
- `course22/slides/nlp-intro.ipynb` says the split holds out 20% for validation; its code
  holds out 25% (`train_test_split(0.25, ...)`). Not quizzed.
- `fastbook/13_convolutions.ipynb` (Receptive Fields) says `conv-example.xlsx` shows two
  stride-2 convolutions with a 7×7 receptive field. course22's `xl/conv-example.xlsx`
  convolves with stride 1 (cell AI3 reads A2:C4, AJ3 reads B2:D4), which gives a 5×5
  receptive field after two layers; only its 2×2 max-pool has stride 2. Its headers also
  say 'Conv1 (27 x 27)' and 'Conv2 (26 x 26)' for grids that are 26 and 24 wide. Receptive
  field is therefore not quizzed.
- `course22/xl/entropy_example.xlsx` sheet entropy: the binary-cross-entropy total F32 is
  `-SUM(F27:F31)` over values that are already negated, so it shows -1.66. Not quizzed.
- `course22/10-scaling-up-road-to-the-top-part-3.ipynb` cell 12 says the number passed to
  `GradientAccumulation` is how many batches are accumulated; the code passes 64, the
  effective batch size in images (fastai counts samples). The quiz asks only what the
  technique does and the `bs=64//accum` arithmetic.
- `stanford-cs336/spring2025-lectures/lecture_02.py`: `train()` ignores its `lr` and
  `num_layers` arguments (it always builds `num_layers=0` and uses `lr=0.01`), so the
  'hyperparameter tuning' call with `lr=0.1` trains exactly as the first one did; and the
  '8 H100s for 2 weeks' line multiplies by one week of seconds (60*60*24*7). The recorded
  trace was run without a GPU, so its timing and MFU values are meaningless. None of
  these is quizzed.
- `course22/05-linear-model-and-neural-net-from-scratch.ipynb` cell 116 calls
  `calc_preds(tst_indep, coeffs)` with the arguments swapped; the elementwise product makes
  it harmless there. Not quizzed.

## Where each reading was fetched from

`huggingface.co`, `docs.vllm.ai` and `karpathy.github.io` are refused by the egress
policy, so each page was read from the official repository it is published from, at
its default branch on 2026-10-14. `sources.json` lists the exact files. A deployed page
can lag or lead its repository by a release; where that matters it is noted per lesson.

## verify-content: what was added

A T-033 block after the summaries block (see its header comment), the five files in the
loader as each is created, one recomputation per numeric check in `expectedSummary`,
and the course counts in the PASS line. Nothing existing was changed or loosened. Two
checks beyond the spec's list: the unique-SHORTEST bound (the SPCH rule's other half,
so a fix for the longest-option tell cannot overshoot into the opposite tell) and
paired `$` delimiters in every field (an odd `$` makes KaTeX eat the rest of the text).

## Screenshots (`shots/`, `shots.js`)

"Check yourself" on `ai310.1.2` at 1440 and 390, Dark and Light: the button under the
summary ("Check yourself · 6 questions"), then the quiz mounted on its first question
(a random draw: in the saved set, the numeric question at 1440 Dark and MCQs elsewhere). `shots.js` asserts by computed
style that the button is visible inside the viewport and that the mounted card causes
no horizontal overflow. Pre-existing finding, not caused by T-033 and outside its
scope (app code): at 390 and 320 the numeric answer row squeezes its Submit button,
whose label overflows its own box (scrollWidth 78px vs clientWidth 73px at 390, 66px at
320) and reads "Submi". The same happens on an existing MATH 130 numeric check.
Measured by `shots/numeric-row-measure.js` (output beside it). Queued as a separate task.
