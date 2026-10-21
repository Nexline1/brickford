# iOS system tokens on the web

Concrete values for building an interface that reads as native iOS. SKILL.md has the principles; this file has the numbers. Each value is Apple's own: the named system colour, text style or metric. Where a value fails WCAG 4.5:1 for text, the accessible substitute is given beside it.

## Contents
1. Font stack
2. Type scale (iOS text styles)
3. Tracking
4. System colours (light and dark)
5. Contrast: the exact values that fail, and what to use instead
6. Inset grouped lists
7. Press feedback: rows, buttons and cards differ
8. Hairlines
9. Translating a Tailwind-style spec

## 1. Font stack

Put the real SF first, so Apple devices get it, and Inter as the stand-in everywhere else:

```css
--font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI Variable", system-ui, sans-serif;
font-optical-sizing: auto;          /* SF and Inter variable fonts both carry an optical-size axis */
-webkit-font-smoothing: antialiased;
```

- **Self-host Inter** (OFL licence, `InterVariable.woff2`) for an offline PWA, with `font-display: swap`. A Google Fonts link adds a network dependency and a privacy leak.
- **Never put Inter before `-apple-system`.** If you do, Apple devices render Inter instead of SF, and the app looks less native on exactly the devices that set the standard.

## 2. Type scale (iOS text styles, default "Large" size)

| Style | Size / line height (pt) | Weight | Typical use |
|---|---|---|---|
| Large Title | 34 / 41 | Bold for nav titles | Page header |
| Title 1 | 28 / 34 | Regular | |
| Title 2 | 22 / 28 | Regular | |
| Title 3 | 20 / 25 | Regular | Card title |
| Headline | 17 / 22 | Semibold | Row title with emphasis |
| Body | 17 / 22 | Regular | Row label, body |
| Callout | 16 / 21 | Regular | |
| Subheadline | 15 / 20 | Regular | Secondary row text |
| Footnote | 13 / 18 | Regular | Captions, section headers (uppercase) |
| Caption 1 | 12 / 16 | Regular | |
| Caption 2 | 11 / 13 | Regular | |

Line heights are fixed ratios: 17/22 = 1.29, **not** 1.5. A 17px row with `leading-normal` (1.5) is about 4px taller per line than iOS and reads as "web".

Use `rem`, so the user's text-size setting scales the whole layout (Dynamic Type's web equivalent).

## 3. Tracking

Tracking is per size, never one value:

- **SF on Apple devices.** `font-optical-sizing: auto` lets the variable font's optical-size axis switch between Text and Display and handle most of the spacing. Add little or nothing.
- **Inter.** Use Inter's published dynamic-metrics curve:
  `tracking(em) = -0.0223 + 0.185 × e^(-0.1745 × size_px)`

  | Size | Tracking |
  |---|---|
  | 34px | -0.022em |
  | 22px | -0.018em |
  | 17px | -0.013em |
  | 15px | -0.009em |
  | 13px | -0.003em |
  | 11px | +0.005em |

- **A blanket `tracking-tight` (-0.025em) is wrong everywhere below about 30px.** Body text gets cramped.
- **Uppercase section headers want positive tracking**, about +0.06em.

## 4. System colours

| Token | Light | Dark |
|---|---|---|
| systemGroupedBackground (canvas) | `#F2F2F7` | `#000000` |
| secondarySystemGroupedBackground (cells) | `#FFFFFF` | `#1C1C1E` |
| tertiarySystemGroupedBackground | `#F2F2F7` | `#2C2C2E` |
| label | `#000000` | `#FFFFFF` |
| secondaryLabel | rgba(60,60,67,.60) ≈ `#8A8A8E` | rgba(235,235,245,.60) ≈ `#9D9DA1` on `#1C1C1E` |
| separator (opaque) | `#C6C6C8` | `#38383A` |
| cell highlight (systemGray4) | `#D1D1D6` | `#3A3A3C` |
| systemBlue | `#007AFF` | `#0A84FF` |
| systemRed | `#FF3B30` | `#FF453A` |
| systemGreen | `#34C759` | `#30D158` |
| systemOrange | `#FF9500` | `#FF9F0A` |
| systemGray | `#8E8E93` | `#8E8E93` |

- **Every system colour has a different dark value.** A spec that gives one hex for both modes, like `#007AFF` everywhere, is not Apple's.
- **`#1D1D1F` and `#F5F5F7` are apple.com's marketing text colours,** not iOS label colours. They're fine for a softer look, but know you're mixing two palettes.

## 5. Contrast: what fails, and what to use instead

These iOS values fail WCAG 4.5:1 for normal text. Apple accepts that on device; a project with a contrast gate must not.

| Exact iOS pair | Ratio | Substitute | Ratio |
|---|---|---|---|
| `#8E8E93` caption on white | 3.26 | `#6E6E73` (apple.com secondary text) | 5.07 |
| `#8E8E93` header on `#F2F2F7` | 2.92 | `#6E6E73` | 4.54 |
| `#007AFF` link on white | 4.02 | `#0066CC` (apple.com link) | 5.57 |
| white on `#007AFF` button | 4.02 | white on `#0071E3` (apple.com button) | 4.70 |
| `#FF3B30` text on white | 3.55 | `#D70015` (systemRed, increased contrast) | 5.38 |
| `#007AFF` on `#1C1C1E` | 4.24 | `#0A84FF` | 4.66 |

These pairs already pass in dark: `#8E8E93` on `#1C1C1E` is 5.22, and `#FF453A` on `#1C1C1E` is 4.99.

**Rule of thumb:** keep the exact iOS hue for fills, icons and large text. For any small text, use the accessible shade. Compute ratios with a script; don't eyeball them.

## 6. Inset grouped lists

The signature iOS structure (Settings, Health and most first-party apps):

- **Canvas:** systemGroupedBackground. **Cells:** secondarySystemGroupedBackground, inset from the screen edges by 16px (20px on wide phones).
- **Group corner radius:** about 10–12px through iOS 18; larger and concentric in iOS 26's Liquid Glass. Use `overflow: hidden` on the group so the cells' highlight respects the radius.
- **Row:** at least 44px tall. The usual padding is 11px vertical and 16px horizontal, with the body at 17/22, which gives 44px.
- **Separators:** between rows only, never above the first or below the last. Start each separator at the text, not the cell edge: a 16px leading inset, or past the icon when there is one. A full-width separator is a web tell.
- **Section header:** footnote 13px, uppercase, secondary label colour, sitting about 6–8px above the group and aligned with the cell text, not the group edge.
- **Section footer:** footnote 13px, sentence case, secondary label, about 6–8px below the group.
- **Gap between groups:** about 35px, with no lines. Space separates the sections.
- **Disclosure:** a chevron `›` in tertiary label at the trailing edge, about 13px. Put values in secondary label before the chevron.
- **Icons:** 29×29 rounded squares (radius about 7) with white glyphs, in Settings style. Use them only where the list is a menu.

## 7. Press feedback: rows, buttons and cards differ

One rule for everything is the most common way a "native" spec goes wrong:

| Element | Press (on pointer-down, instant) | Release |
|---|---|---|
| List row | Background goes to cell highlight (systemGray4). **No scale.** | Fades back over about 250–300ms |
| Text or tinted button | Opacity to about 0.3–0.5 | Back over about 200ms |
| Filled button, card or tile | `scale(0.97)`; a card can also dim slightly | Spring back: damping 1.0, response about 0.3 |

- **Scaling a full-width row looks broken.** Its edges move away from the group's corners and the separators, and the rows around it. Highlight rows; scale discrete objects.
- **The release is slower than the press.** Use a 0–100ms press and a 200–300ms release, not one symmetric duration.
- **Transition only what changes:** `transition: transform .3s, opacity .2s, background-color .3s`. `transition-all` also animates layout properties, colours you didn't mean to animate, and theme switches, and it costs frames.
- **Feedback must not depend on hover.** On touch, `:hover` sticks after a tap. Put hover styles inside `@media (hover: hover)`.
- **Under `prefers-reduced-motion`,** keep the highlight and opacity changes and drop the scale.

```css
.row { transition: background-color .3s ease-out; }
.row:active { background-color: var(--cell-highlight); transition-duration: 0s; }
.btn-filled { transition: transform .3s cubic-bezier(.2,.8,.2,1), opacity .2s; }
.btn-filled:active { transform: scale(.97); transition-duration: .08s; }
@media (prefers-reduced-motion: reduce) { .btn-filled:active { transform: none; opacity: .7; } }
```

## 8. Hairlines

- **On a high-DPI screen,** a `0.5px` border draws one device pixel.
- **On a 1x screen,** `0.5px` either rounds up to 1px or disappears, depending on the browser.
- **For a reliable hairline,** draw a 1px pseudo-element and apply `transform: scaleY(.5)` under `(min-resolution: 2dppx)`.
- **Prefer the opaque separator colour** (`#C6C6C8` / `#38383A`) over alpha borders. An alpha separator changes colour depending on what's behind it.

## 9. Translating a Tailwind-style spec

When a design spec arrives as Tailwind classes and the project doesn't use Tailwind, translate the values into the project's own tokens and classes. Don't add a framework to carry a palette. Map each class to its value:

| Tailwind class | Value |
|---|---|
| `rounded-2xl` | 16px |
| `px-4` | 16px |
| `py-3.5` | 14px |
| `text-xs` | 12px / 16px |
| `tracking-wider` | 0.05em |
| `tracking-tight` | -0.025em |
| `leading-normal` | 1.5 |
| `duration-200` | 200ms |

Then check each value against sections 2–8. Apply the fixes those sections give (line height, tracking per size, accessible colours, row vs card feedback) rather than copying the class literally.
