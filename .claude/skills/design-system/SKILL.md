---
name: design-system
description: Generate a complete, opinionated design system — page pattern, style direction, palette, type pairing, motion spec, and category-specific anti-patterns — before writing any UI code. Use this at the START of any request to build, design, or mock up a landing page, website, app screen, dashboard, or component, even when the user gives no design direction at all. Also use when the user asks what colors, fonts, or layout to use, or wants an existing project's design system documented and made consistent.
---

# design-system

Decide the design before writing the markup. A page built without a system becomes whatever the model's priors are, which is why so much generated UI looks the same.

## Generate first

```bash
node <skill-dir>/scripts/generate.mjs "<the brief in plain language>" --name "<Product>"
node <skill-dir>/scripts/generate.mjs "<brief>" --json                    # machine output
node <skill-dir>/scripts/generate.mjs "<brief>" --persist ./design-system # write MASTER.md
```

Pass the brief as the user actually described it. The matcher scores it against 27 product categories using inverse-frequency keyword weighting, so specific words ("dental clinic", "developer tool") beat vague ones ("platform", "app").

It returns a category, a page pattern, a primary style plus two alternates, a five-token palette with CSS custom properties, a type pairing with free Google Fonts substitutes, a motion spec, and an avoid-list combining category-specific and universal anti-patterns.

## Read the confidence line before trusting it

The output states its own confidence:

- **high** — the brief named the category. Build from it.
- **medium / low** — it guessed from partial signal. Say which category it landed on and confirm before building.
- **none** — nothing matched; it fell back to a generic direction. Ask what the product actually is rather than building on a default.

When an **alternative** category is listed, the brief straddled two. Name both to the user and let them pick — that one question saves a full rebuild.

## The system is a floor, not a ceiling

The generator gives a defensible starting point. It does not give the thing that makes the page memorable. After generating:

**Pick the signature.** Name the one element this page will be remembered by — a typographic treatment, an interaction, a structural device, an image strategy. Everything else stays quieter than it. A page with three signature elements has none.

**Ground it in the subject.** The palette entry is a direction, not a mandate. A coffee roaster and a law firm can both land on "warm earth" and should not look alike. Pull specifics from the subject's own world — its materials, its vernacular, its artifacts.

**Spend the risk once.** Take one real aesthetic risk you can justify in a sentence. Not taking one is also a risk.

**Check the type at size.** High-contrast display serifs collapse below 48px. Ultralight weights vanish on low-DPI screens. Set the actual sizes before committing to the pairing.

## Persisting the system

`--persist ./design-system` writes `MASTER.md` plus an empty `pages/` folder.

- `design-system/MASTER.md` — the global source of truth
- `design-system/pages/<page>.md` — deviations for one page only

When building a page, read `pages/<page>.md` first if it exists; its rules override MASTER. Otherwise use MASTER alone. Record only the deviations in a page file, never a full copy — a duplicated system drifts within a week.

## Building from it

Derive every colour, size, and spacing value from the tokens. When you need something the system does not define, extend the scale rather than inventing a one-off, and say which value you derived and from what.

Ship the quality floor without announcing it: contrast 4.5:1 for body text, visible `:focus-visible`, 44px touch targets, `prefers-reduced-motion` honoured, tested at 375 / 768 / 1024 / 1440.

## Data

- `data/categories.json` — 27 product categories → pattern, styles, colour mood, type mood, motion, category-specific anti-patterns
- `data/library.json` — 26 palettes, 20 type pairings, 17 style definitions with stated risks, 26 page patterns

The library is curated and opinionated by design. Extend it — add a category, palette, or pairing — rather than working around it. Keep the cross-references intact: every `colorMood`, `typeMood`, `pattern`, and `styles` entry in a category must resolve to an id in the library.
