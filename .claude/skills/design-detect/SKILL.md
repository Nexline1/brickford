---
name: design-detect
description: Review, critique, audit, and fix the visual design of frontend code. Runs a deterministic 30-rule detector that catches AI-generated design tells (Inter everywhere, purple gradients, icon tiles above headings, nested cards, bounce easing) plus accessibility and quality failures, then applies targeted fixes. Use this whenever the user asks to audit, critique, review, polish, clean up, improve, tone down, or amplify any UI, page, component, or stylesheet — and also proactively right after generating frontend code, before showing it to them, even if they did not ask for a review.
---

# design-detect

Design review for frontend code. Two layers: a deterministic detector that finds the things a script can prove, and a judgement layer for the things it cannot.

## Run the detector first

Always run before forming an opinion. It is Node-only, no dependencies, no network.

```bash
node <skill-dir>/scripts/detect.mjs <path>          # human output
node <skill-dir>/scripts/detect.mjs <path> --json   # machine output
node <skill-dir>/scripts/detect.mjs . --list-rules  # the full catalog
node <skill-dir>/scripts/detect.mjs . --ignore overused-font,pure-black
```

Exit code is 1 when any `high` finding exists — usable as a CI gate.

Findings arrive with severity, file, line, why it matters, and the fix. Report them grouped by severity, never as a raw dump. Fix `high` findings without being asked; propose `med` and `low`.

To silence a rule for one file, the file can carry a comment: `<!-- design-detect-disable overused-font: exported brand doc -->`.

## Then judge what the script cannot

The detector proves syntax-level problems. It cannot see whether the design is any good. After the scan, assess by hand:

**Hierarchy** — Does the eye land on the single most important thing first? Rank the three loudest elements on the page and check that ranking matches the page's actual job.

**Distinctiveness** — Could this page belong to any other product with the logo swapped? If yes, name the one element that would make it unmistakable and build that.

**Restraint** — Count the competing focal points. More than one means the emphasis is spent, not concentrated. Cut until one remains.

**Content truth** — Do structural devices encode something real? Numbered markers (01/02/03) only belong on an actual sequence. Eyebrows, dividers, and labels must carry information, not decorate.

**Copy** — Buttons name what happens ("Save changes", not "Submit"). The verb stays the same through the flow. Empty and error states give direction, not mood.

## Commands

The user may invoke these by name. Each is a different intent, not a different tone.

| Command | What to do |
|---|---|
| `audit` | Run the detector, report every finding grouped by severity, fix nothing yet |
| `critique` | Skip the mechanics — judge hierarchy, distinctiveness, restraint, copy. Be specific about what fails and why |
| `polish` | Fix all `high` findings, tighten spacing rhythm and type scale, ship-ready pass |
| `bolder` | The design is timid. Raise contrast, enlarge the display type, commit to one signature element |
| `quieter` | The design is shouting. Remove competing focal points, reduce the palette, calm the motion |
| `distill` | Strip to essence. Remove every element that does not serve the page's single job |
| `harden` | Error states, empty states, long-string overflow, RTL, loading, offline |
| `typeset` | Type only — face pairing, scale, weights, measure, tracking |
| `layout` | Spacing rhythm, alignment, grid, optical balance |
| `animate` | Add motion that serves meaning; strip motion that decorates |
| `colorize` | Rebuild the palette from the subject; tint the neutrals |
| `adapt` | Responsive behaviour at 375 / 768 / 1024 / 1440 |

If no command is given, default to `audit` followed by a short `critique`.

## Fix discipline

- Fix the cause, not the symptom. `overused-font` is not fixed by swapping Inter for Roboto.
- Change one axis at a time so the user can see what each change did.
- After fixing, re-run the detector and report the delta (`7 high → 0 high`).
- Never introduce a new palette, face, or spacing scale mid-fix without saying so.

## Anti-patterns, stated plainly

These are the defaults every model reaches for. Avoid them unless the brief explicitly asks:

- Inter / Roboto / Arial / system-ui as the *display* face
- Purple→blue or purple→pink gradients; gradient-filled headline text
- Pure `#000` and untinted greys (`#888`, `#ccc`)
- The rounded-square icon tile stacked above every feature heading
- Cards nested inside cards; every element sharing one 8px radius
- Bounce / elastic / overshoot easing
- Emoji standing in for icons
- Three identical feature columns with identical weight
- Cream `#F4F1EA` + high-contrast serif + terracotta `#D97757` — currently the most over-produced AI aesthetic there is

See `references/RULES.md` for the full rule catalog with rationale.
