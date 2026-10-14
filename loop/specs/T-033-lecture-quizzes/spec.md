# T-033: summaries and lecture quizzes for the 80 lectures that have none

Source: owner, 2026-10-14:
- "I never, never, ever take the questions right after each video… create a quiz after each video… The quiz should actually be valuable and cover what's in each video. This applies to AI, storytelling, mathematics, and all other subjects."
- Decisions recorded in `loop/inbox.md` (2026-10-14):
  - the order is content, then the gate (T-043), then the coach;
  - every quiz has **5–8 questions per lecture, written from the video's transcript**, with every numeric answer re-derived;
  - AI 200 comes first, because it is on the calendar now.

This item writes content only. The gate that uses it is T-043, and deeper quizzes for the 414 lectures that already have summaries are T-044. The app needs no code change: `summaryHTML()` already renders a summary and its "Check yourself" questions.

## PROTECTED paths this spec names (approved by the owner's 2026-10-14 decision)
- `platform/data/summaries-ai200.js`, `summaries-ai210.js`, `summaries-ai300.js`, `summaries-ai310.js` and `summaries-res400.js`, all new.
- `platform/index.html`, only for one `<script>` tag per new file and the `?v=` bump.

Nothing else under `platform/data` may change. `curriculum.js` must not change.

## The 80 lectures
| Course | Lectures | Source |
|---|---|---|
| AI 200 | 15 (3Blue1Brown ×4, Karpathy Zero to Hero ×9, LLM big picture ×2) | video |
| AI 210 | 8 (fast.ai 2022) | video |
| AI 300 | 16: 4 videos, 12 papers | the video's transcript, or the paper itself (arXiv) |
| AI 310 | 23: 17 CS336 videos, 6 readings | the video's transcript, or the reading's page |
| RES 400 | 18: 11 videos, 7 readings | the video's transcript, or the reading's page |

**Order:** AI 200 first. After that, take each lecture in the order its first scheduled date comes up on the calendar. Replicate the app's scheduling (`scheduledFor` / `dateForStudy` in `platform/js/app.js`); don't guess it. Write the order to `verification/order.md` before you start.

## Per lecture (key `<courseId>.<unit>.<lesson>`, e.g. `ai200.1.0`)

### 1. Read the source in full first
- **A video:** fetch the transcript with the YouTube transcript tool (`mcp__Yt_T__get_youtube_transcript`, or `mcp__Youtube_Transcribt__get_transcript` as a fallback). Read all of it. A 4-hour Karpathy lecture is long, so read it in parts, but read every part.
- **A paper or reading:** fetch the text itself with WebFetch. For arXiv, use the abs or HTML page, or the PDF.
- **If a source can't be fetched or is truncated,** record it in `verification/unavailable.md` and skip that lecture. Never write from memory or from what a lecture "probably" covers.

### 2. A summary in the existing shape
Match `summaries-math130.js`:
- `takeaway`;
- `beats` (at least 3, each `{t, d}`);
- `worked`;
- `watch`;
- `concepts` (optional; existing concept ids only);
- `checks`.

Prose is plain and precise. HTML is written unescaped, so no bare `<` before a letter. Use `$…$` only for real maths.

### 3. `checks`: the lecture quiz
**How many,** scaled with length:
| Lecture | Questions |
|---|---|
| ≤ 30 min | 5 |
| 31–90 min | 6 |
| > 90 min | 8 |
| papers and readings | 6 |

**What they test:**
- Each question must be answerable from **this lecture alone**, and must test understanding: why, how, what happens if, apply it, spot the error.
- No trivia: no slide colours, no dates or names unless they are the point, no "which library did he import".
- Across the set, cover the lecture's arc, from the first third through to the end, not only the opening.

**Format:**
- **MCQ:** `{q, opts: [4 options], a, expl}`.
- **Numeric:** `{q, num, tol?, expl}`.
- Every question has `expl`, which teaches the point. It doesn't just restate the answer.

**Where it's taught:**
- New optional field `at`: the second in the video where the point is taught. T-043 will offer "rewatch from here".
- For a paper or reading, use `src`: the section heading.

**MCQ hygiene, per lesson:**
- The right answer is the unique longest option in at most ⌈n/3⌉ of the MCQs (the SPCH rule).
- Within a course, no answer slot holds more than 40% of the answers, even though options are shuffled at mount.
- Distractors are the misconceptions the lecture itself warns about, not filler.

**Numerics:** every numeric answer is re-derived independently in verify-content's `expectedSummary` table, the way the MATH summaries are, and never copied from the data file. Examples: a parameter count from the layer sizes, a tensor shape, a loss at initialisation (−ln(1/27) for makemore), a FLOP count.

### 4. Evidence, without republishing transcripts
- **Transcripts are not committed.** The repository is public. Cache them in a git-ignored folder, `sources/transcripts/<id>.txt`, and add `sources/` to `.gitignore`. They can always be fetched again.
- **Each question gets an evidence line** in `verification/evidence/<courseId>.jsonl`: `{key, i, at, quote}`, where `quote` is at most 25 words of the transcript or paper where the point is made. The reviewer checks questions against these.

## verify-content
Extend the summaries block to the new files:
- every key resolves to a lesson;
- the summary has its required fields, at least 3 beats, and figure and concept ids that exist;
- the number of checks is right for the lecture's length;
- every check is numeric or MCQ, with the answer among 4 options and an `expl`;
- `at`, where given, is ≥ 0 and below the lesson's `min × 60`;
- the unique-longest rule and the 40% slot rule hold;
- every numeric is recomputed in `expectedSummary`;
- no bare `<` before a letter.

The PASS line names the new courses.

**Plants**, each of which must exit 1:
- (a) one numeric answer changed;
- (b) an answer index out of range;
- (c) a > 90-min lecture with 5 checks;
- (d) the answer made the unique longest in every MCQ of one lesson;
- (e) `at` beyond the video's length.

## Known data oddities (report them; don't fix them)
- AI 300 lessons 0 (AlexNet) and 1 (ResNet) both point at video `DAOcjicFr1Y`.
- AI 300's GPT-2 lesson reuses AI 200's "Let's build GPT" video.
- AI 300's Mixtral lesson reuses CS336 lecture 4.

For each of these, write the questions from the paper the lesson names. Note the duplication in `verification/notes.md` so the owner can decide; changing `curriculum.js` is out of scope.

## Saving progress (critical)
Commit and push after **every 3 lectures**, and at the end of each course. A usage limit can stop the work at any moment, and the branch must hold everything done so far.

## Acceptance
1. All 80 lectures have a summary and a quiz of the right size, except any listed in `unavailable.md` with the reason.
2. verify-content passes, and plants (a)–(e) each exit 1. Restore each one and prove it with `cmp`.
3. Every gate is green when run one at a time, plus clip under `TZ=America/Los_Angeles`.
   - The "Check yourself" button appears on a new lecture. Check it at 390 and 1440 in both themes with a screenshot.
   - Contrast and clip must be unaffected.
4. `?v=` tokens are bumped.
5. A sample audit is recorded in `verification/audit.md`: 10 random questions, each traced to its evidence quote, plus 3 numerics re-derived by hand.
