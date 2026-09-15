---
name: frontend-design
description: Methodology for building high-craft, non-generic frontend UI (HTML/Tailwind/React) — either matching a provided reference image exactly, or designing from scratch with strong visual craft when there's no reference. Use before writing any frontend/UI code, whenever building or editing pages, components, layouts, or other visual elements.
---

# Frontend Design

## Instructions

### Step 1: Check for a reference image

Ask yourself (don't ask the user unless truly ambiguous) whether a reference image was provided for this UI.

- **Reference provided** → go to Step 2a (match mode).
- **No reference** → go to Step 2b (from-scratch mode).

### Step 2a: Match mode (reference image given)

Match the reference **exactly**: layout, spacing, typography, color, proportions. Swap in placeholder
content only where the reference doesn't supply real content — generic copy, and images from
`https://placehold.co/WIDTHxHEIGHT`.

Hard constraints in this mode:
- Do not "improve" the design. Do not add sections, features, or content that isn't in the reference.
- Do not invent additional polish (extra shadows, animations, states) beyond what's visible, even if
  Step 3's guardrails would normally call for it — matching the reference wins over general craft rules.
- If the reference is ambiguous about a color/spacing value, pick the closest reasonable value rather
  than guessing wildly, and note the assumption.

Then proceed to Step 4 (verification loop) — comparison there is against the reference image itself.

### Step 2b: From-scratch mode (no reference)

Design with high craft using the guardrails in `references/guardrails.md`. Read that file now if you
haven't already this session — it covers color, shadows, typography, gradients/texture, motion,
interactive states, imagery treatment, spacing, and depth/layering. These are the rules that keep
output from reading as generic template design.

Then proceed to Step 4 — comparison there is against your own design intent (does it look and feel
the way you intended, is it internally consistent, do the guardrails actually show up in the output).

### Step 3: Check for brand assets

Before inventing any placeholder branding (logo, colors, fonts), look for a `brand_assets/` folder (or
similarly named: `brand/`, `assets/brand/`) in the project. If real assets, a color palette, or a style
guide exist there, use them exactly — do not invent brand colors or substitute a placeholder logo when
a real one is available.

### Step 4: Serve locally and screenshot

Never screenshot a `file:///` URL — always serve the page over local HTTP first, then screenshot that
URL with a headless browser. The exact tooling depends on the environment/project:

- If the project already has its own serve/screenshot scripts or an established workflow (check
  CLAUDE.md and the repo root), use those as-is rather than inventing a parallel path.
- Otherwise, start any simple local static/dev server (e.g. a one-line Node http server, `npx serve`,
  or the framework's own dev server) and drive a headless browser (Puppeteer, Playwright, or raw CDP
  against a headless Chrome/Edge) to navigate and capture a screenshot.
- Read the resulting screenshot image directly to inspect it visually — don't guess from markup alone.

### Step 5: Compare, fix, repeat

Compare the screenshot against the reference (match mode) or your design intent (from-scratch mode).
Be specific and numeric, not vague:

- "heading is 32px but reference shows ~24px"
- "card gap is 16px but should be 24px"
- "primary button is default Tailwind blue, should be the derived brand color"

Check at minimum: spacing/padding, font size/weight/line-height, colors (exact hex where it matters),
alignment, border-radius, shadows, image sizing/cropping.

Fix the mismatches, re-screenshot, compare again. **Do at least 2 comparison rounds.** Stop only when
no visible differences remain (match mode) or the design reads as intentional and on-brand
(from-scratch mode), or the user says to stop.

## Hard rules

- Do not add sections, features, or content not in the reference (match mode) or not requested.
- Do not "improve" a reference design instead of matching it.
- Do not stop after a single screenshot pass — always do the multi-round comparison loop.
- Do not use `transition-all` — animate only `transform` and `opacity`.
- Do not default to Tailwind's stock blue/indigo (or any unmodified default palette color) as a primary
  color — derive a real custom color and scale (see `references/guardrails.md`).
