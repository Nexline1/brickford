# T-007: Lists become iOS inset grouped sections

Source: `loop/design/brief.md` §4 ("Inset grouped list"). The look is "Needs attention" and "Today's lectures" in `loop/design/specimen-today-*.png`. Depends on T-005's tokens.

## Problem
The grouped list is the app's most-used component. `app.js` builds `.ghead`, `.glist` and `.grow` in 43 places, for example the dashboard at `platform/js/app.js:1044-1049` and `:1740-1741`.

It is still styled as a ruled register (`platform/css/style.css:1933-2012`):
- an uppercase tracked `.ghead` with a 1.5px ink rule under it;
- full-width hairlines between rows;
- no fill or rounding;
- serif `.g-t` titles and mono `.g-v` values.

On the phone this reads as a printed table, not an app. It is also the main reason the before census (`loop/design/before/home-390-light.png`) looks nothing like the specimen.

## Learner outcome
- Every list (today's lectures, needs attention, units in a course, problems, exams) becomes a soft rounded section that is easy to scan and easy to tap.
- The header reads as a plain-language title ("Needs attention") instead of a shouted label.
- Row values line up in clean tabular numerals.

## Scope
CSS first, in `platform/css/style.css:1933-2012` and the `.ghead.oh` and `.grow` overrides at `:1212-1215` and `:1346`. `app.js` changes only where markup must change: for example, a section header that is built with a hard-coded uppercase string.
1. **`.glist`:**
   - `--surface` fill with `--r-md` corners and `overflow: hidden`.
   - On phone it is inset 16px from the page edge, or aligned to the page gutter if `.main` already provides 16px. On desktop it sits in the reading column.
   - 32px between sections.
2. **`.ghead`:**
   - 1.25rem/600 in sentence case, with no letter-spacing and no rule. Padding is 0 20px 8px, so it aligns with the row text.
   - `.gh-meta` is 0.9375rem in `--ink-2` with tabular numerals.
   - `.ghead.oh` (the hero's line) keeps its own treatment. T-009 restyles the hero.
3. **`.grow`:**
   - At least 44px tall (56 with a `.g-s` subtitle), padded 10px 16px.
   - Separators are a 0.5px `--line` pseudo-element inset from the text's leading edge (past `.g-lead` when present), and none above the first row.
   - `.g-t` is 1.0625rem/600 in the body face, `.g-s` is 0.9375rem `--ink-2`, and `.g-v` is 0.9375rem `--ink-2` in tabular numerals, no longer mono.
   - The chevron is `--ink-3`.
   - Press state: a `--surface-2` fill, instant on pointer-down (the existing `:active` rule, recoloured).
4. **Variants keep their meaning:**
   - `.muted-row`, `.done-row`, `.bad-lead` and `.grow > .btn` (`style.css:2005-2012`, `:1215`) keep their semantics in the new style.
   - Status leads ("!" rows) may use the brief's 32px tinted glyph tile. That is optional in this item and required in T-009.
5. Bump every `?v=` token.

## Out of scope
- The dashboard hero (`.card.one.lead`), the stat tiles and the week strip, which are T-009.
- Chrome (T-006) and controls (T-008).
- PROTECTED paths, curriculum and plan changes, and new dependencies.

## Acceptance criteria
1. **List computed style**, in `verify-design.js` (extended), at 390 and 1280 in light and dark, on `/`, `/course/math110`, `/workshop` and `/exams`:
   - every visible `.glist` has an opaque background equal to `--surface` and a border-radius of 12px;
   - every `.ghead` has `text-transform: none`, a font-size of 20px and weight 600;
   - every `.grow` is at least 44px tall;
   - `.g-v` has `font-variant-numeric` containing `tabular-nums` and a font-family without "Mono";
   - the separator of the second row starts at or right of the first row's `.g-t` left edge.
2. **Planted bugs.** Each makes `verify-design.js` exit 1, with output in `verification/`:
   - (a) the `.glist` radius set back to 2px;
   - (b) `.ghead` set back to uppercase.
3. `verify-clip.js` reports 0 new findings. The inset makes lists 32px narrower on phone, so any row that now clips at 320px, or at a 24px root, is fixed in this item. Nothing is added to the baseline.
4. `verify-shell.js` (44×44 and nothing fixed over text) and `verify-contrast.js` (7 themes) pass, including `--ink-2` on `--surface` in every theme.
5. `verify-content`, `verify-sync-loop`, `verify-logic` and `verify-flows` pass. Typecheck is clean.
6. Screenshots of `/`, `/course/math110`, `/workshop` and `/calendar` at 390 in light and dark, and at 1280 in light.

## Verification checklist
- [ ] typecheck and all gates
- [ ] two planted-bug runs exit 1
- [ ] clip with 0 new findings; the baseline only shrank
- [ ] screenshots at 390 light/dark and 1280, compared with `loop/design/before/`
