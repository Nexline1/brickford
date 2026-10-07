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

## Contrast is a gate, not a preference

**Every text/background pair clears 4.5:1** (3:1 for ≥24px, or ≥18.66px bold), in all six
themes, on every route. `node tools/verify-contrast.js` proves it and exits non-zero if not.

This rule exists because of a specific failure. `.fact` and `.unit` were given
`background: var(--panel)` — the dark sidebar colour — while their text stayed `var(--ink)`,
which in the light theme is the same hex. Text painted its own background colour: five empty
boxes on the dashboard and a dark block where the daily rituals should have been. Every check
in place at the time passed, because they all measured accent colours and layout geometry and
none asked whether text could be read.

Three rules follow from it:

- **Inks are solid values, never alpha.** An alpha ink passes on one surface and fails on the
  next, so it cannot be checked by reading the stylesheet. `--ink-3` at `rgba(…, 0.46)`
  measured 2.83:1 on white across the entire platform.
- **`--panel` belongs to `.sidebar` and `.tabbar` only.** The harness fails the build if a
  `--panel` background appears in any other rule.
- **A component that paints the panel must re-scope the ink with it.** The tabbar carried the
  dark fill but inherited the page's `--ink-3`, giving 2.6:1 labels.

And the idiom that caused it is gone: emphasis is a rule, a weight, and space — never a filled
block that re-scopes eight tokens and breaks every child that assumes light-theme values.

## Verification before any deploy

```
node tools/verify-content.js          # content + numerics + graph
node tools/verify-contrast.js         # 4.5:1, every route × six themes × two widths
# Playwright: all routes × 320/390/768/1280 — no overflow AND no clipped content
```

Then read the screenshots. Numbers said the calendar was fine; a screenshot said it was
cut in half. And a passing layout sweep said the dashboard was fine while three of its blocks
were invisible.
