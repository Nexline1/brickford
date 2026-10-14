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
