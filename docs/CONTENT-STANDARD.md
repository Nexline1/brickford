# Content standard

The bar every future course is built to. Written down so quality does not depend on
whoever is authoring that day.

## The principle

A lecture teaches by being watched. A **concept** teaches by being produced. Everything
here exists to make the learner generate the idea before they are shown it, then keep
generating it on a widening schedule.

## A concept

One atomic idea, in `platform/data/concepts-<subject>.js`. Required fields:

| field | rule |
|---|---|
| `id` | `<subject>-<slug>`, stable forever — recall history is keyed on it |
| `title` | A claim, not a topic. "A matrix moves space", never "Matrices" |
| `one` | The compressed truth in **one sentence**. If it needs two, it is two concepts |
| `fig` | An id in `DAR.FIG`. Every concept has a figure. No exceptions |
| `prereq` | Concept ids only. The graph must stay acyclic |
| `lectures` | Real lesson keys (`math110.1.20`). The harness rejects invented ones |
| `miss` | The misconception that *actually* trips people, not a generic warning |
| `applies` | Where it shows up in AI. This is what makes abstract maths stick for an engineer |
| `probes` | ≥2 retrieval items, same shape as the exam banks |

**Title test:** if the title could be a chapter heading, rewrite it as the thing the
chapter concludes.

**`applies` test:** name a specific mechanism — "the r in LoRA is a rank budget", not
"used in machine learning". Vagueness here is worse than omission.

## A figure

In `platform/js/figures.js`, one function per figure, returning an SVG string.

- **Theme variables only.** `var(--accent)`, `var(--ink)`, `var(--line)`. A hard-coded
  hex fails the harness, because it will be invisible in one of the six themes.
- **`viewBox`, never fixed width.** Every figure is read at 320px on a phone.
- **One idea per figure.** If it needs a legend to survive, it is doing too much.
- **Label the insight, not the parts.** "the error is perpendicular" beats "e".
- **Draw the key line on** with `class="fig-draw"`; motion should carry meaning.
- **`aria-label`** describing what the figure shows, in a full sentence.

## A probe

Retrieval, not recognition. In descending order of value:

1. **numeric** (`num`, optional `tol`) — cannot be guessed from the options
2. **derivation** — state the steps, self-grade against a rubric
3. **debugging** — here is broken code or a broken argument; find the fault
4. **multiple choice** — acceptable for a definition or a discrimination, weakest otherwise

Every probe carries `expl` that teaches, not just confirms. A wrong answer is the moment
the learner is most receptive; do not waste it on "Incorrect."

Distractors must encode **real** errors — the sign slip, the transposed index, the
confusion the `miss` field names. Never filler.

## Correctness

Non-negotiable, because a wrong item does not just fail to teach: the spaced scheduler
will rehearse the error for months.

- Every numeric answer is **recomputed from the mathematics** in
  `tools/verify-content.js`. Not copied from the data file — derived independently.
- Every external URL is fetched and confirmed reachable before it ships.
- No invented citations, no plausible-looking deep links. Link the course page you have
  verified rather than the PDF you assume exists.
- `node tools/verify-content.js` must exit 0. It is the gate.

## Design

- **Prose budget: ≤120 words per page.** If an explanation needs more, it wants a figure.
- Figures and state carry the meaning; text labels it.
- Motion only where it shows change: a curve drawing, a bar filling, a ring sweeping.
  No decorative animation, nothing page-wide.
- Every page must survive 320px with no horizontal overflow **and no clipped content** —
  the calendar bug hid two days a week behind `overflow: hidden` and produced no
  document overflow at all, so the audit checks both.

## Verification before any deploy

```
node tools/verify-content.js          # content + numerics + graph
# Playwright: all routes × 320/390/768/1280, six themes, reduced motion
```

Then read the screenshots. Numbers said the calendar was fine; a screenshot said it was
cut in half.
