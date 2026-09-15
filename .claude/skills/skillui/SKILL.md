---
name: skillui
description: Motion & animated-UI methodology — animated icons, flowing gradients, animated typography, and micro-interactions, hand-crafted with SVG + CSS (no animation libraries by default). Use when adding motion, animation, or micro-interactions to any web UI, when a UI feels static and needs life, or when the user references animated-design inspiration (Lordicon, ShaderGradient, typeface animators, motion-design sites).
---

# Skill UI — Motion & Animated Interfaces

Layer this on top of the `frontend-design` skill: that one governs static craft (color, type,
spacing, depth); this one governs everything that moves. When both apply, static craft rules first,
then motion is added with the discipline below.

## Instructions

### Step 1: Audit the existing motion system

Before writing any animation, inventory what the project already has:

- Easing/duration tokens (CSS custom properties, theme config).
- Existing `@keyframes` and animation utility classes.
- Reveal/in-view mechanisms (IntersectionObserver wrappers, scroll-linked JS). If a reveal system
  exists that toggles a class like `.is-visible`, **piggyback on it with descendant selectors**
  (`.reveal.is-visible .my-icon path { animation: … }`) instead of adding new observers.
- `prefers-reduced-motion` handling (global kill-switch vs. per-component guards).
- Layout landmines: `position: sticky` pins, scroll-driven transforms, view transitions.

Reuse everything reusable. Never build a parallel motion system next to an existing one.

### Step 2: Establish (or extend) motion tokens

Define these once, use them everywhere (see `references/motion-principles.md` for values):

- **Easing families**: standard ease-out for most things, a soft-out for entrances, one
  spring/overshoot for playful confirmations. Name them (`--ease-out-soft`, `--ease-spring`).
- **Duration scale**: ~120ms (micro feedback) → 200–300ms (hover/press) → 400–700ms (entrances)
  → 800ms+ (hero moments only).
- **Stagger step**: 40–80ms between siblings.

### Step 3: Pick the technique per element

Read the matching reference file before implementing:

| Element | Reference |
| --- | --- |
| Icons (draw-in, micro-scenes, hover life) | `references/animated-icons.md` |
| Backgrounds & surfaces (flowing gradients, aurora) | `references/animated-gradients.md` |
| Headlines & text (split reveals, variable-font moves) | `references/animated-typography.md` |
| Framing content like a product shot (rings, glass, reflections) | `references/presentation-surfaces.md` |
| Choreography, durations, restraint | `references/motion-principles.md` |

### Step 4: Implement under the hard constraints

- Continuous/looping animation may only touch `transform` and `opacity` (compositor-only).
  One-shot entrance `filter: blur()` is acceptable; never loop filters, layout properties, or
  `font-variation-settings`.
- Respect `prefers-reduced-motion`: rely on a global kill-switch if one exists, add one if not;
  JS-driven motion needs its own guard. Frozen states must still look intentional (an aurora
  becomes a static gradient, split text is simply visible).
- **No-JS visitors see everything**: gate "hidden until animated" states behind
  `@media (scripting: enabled)` or equivalent, so content never depends on JS to appear.
- **Connected scripts (Arabic, Urdu, Farsi, Devanagari…) must never be split per-letter** —
  letterforms join; splitting breaks shaping and ligatures. Split per-word only. Latin may split
  per-letter. Split text keeps the original string as `aria-label` on the wrapper with the
  fragments `aria-hidden`.
- Never add `transform`/`filter`/`will-change` to an **ancestor** of a `position: sticky` element
  (it becomes the containing block and kills the pin). Children of the sticky element are safe.
- No new dependencies by default (no Lottie/framer-motion/GSAP). Hand-craft with SVG + CSS.
  Only add a library if the user explicitly asks.

### Step 5: Verify like frontend-design

Serve locally, screenshot with a headless browser, and compare against intent — then repeat:

1. Normal pass: screenshot the animated states (mid-animation and settled) at mobile and desktop
   widths; check both text directions if the site is bilingual.
2. **Reduced-motion pass**: emulate `prefers-reduced-motion: reduce` and re-screenshot — every
   piece of content must be instantly visible and static.
3. At least 2 comparison rounds. Motion must read as intentional, not busy: if a screen has more
   than one attention-grabbing animation running at once, cut until it doesn't.

## Hard rules

- Do not animate layout properties (width/height/top/margin) or use `transition-all` — ever.
- Do not loop `filter`, `box-shadow`, or `font-variation-settings`.
- Do not split connected-script text per-letter; do not drop `aria-label` on split text.
- Do not put transforms/filters on ancestors of sticky elements.
- Do not add motion without a job (guide, confirm, establish hierarchy, or express brand — see
  `references/motion-principles.md`). One hero moment per screen, maximum.
- Do not ship without the reduced-motion screenshot pass.
