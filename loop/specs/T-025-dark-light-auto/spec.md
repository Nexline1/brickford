# T-025: Dark, Light and Auto only — the dark the owner liked, back as the default

Source: owner, 2026-10-07, after PR #8 shipped navy:
- "I don't like the navy ... too fancy ... too bright, not comfortable for my eyes to stay on the platform for long."
- "The dark one was good, but you removed it."
- "I don't have to have all these themes, just what actually is doable."
- On the sidebar, "make it slightly darker".

Owner's answers: themes **Dark + Light + Auto**; sidebar **darker than the page**. This reverses T-024's colours by the owner's decision.

## Problem
- The default dark theme is navy with a gold glow. It's bright and decorative, and reads as tiring for long study sessions.
- There are seven themes. Five of them (Parchment, Latte, Forest, Midnight, Slate) aren't wanted, and every one multiplies the design and contrast work.
- The desktop sidebar is a lighter, tinted material next to the page. It draws the eye away from the reading column.

## Learner outcome
The app opens in a calm, near-black dark theme that is comfortable for hours. The sidebar recedes and the reading column is the brightest thing on screen. Theme choice is three obvious options.

## Scope
1. **Dark theme tokens** (`[data-theme="dark"]` in `platform/css/style.css`).
   - Restore the pre-T-024 dark exactly. That is the block at commit `a309b5a`: iOS neutrals, `--surface #1c1c1e`, `--surface-2 #2c2c2e`, ink `#fff` / `#a1a1a6` / `#8e8e93`, accent `#78aef0`, light-grey filled button `--btn-bg #e8ebef` / `--btn-ink #0f1216`, and the original `--fac-*`, `--good`, `--bad` and `--line` values.
   - Exceptions, so that the sidebar is darker than the page:
     - `--panel: #000000`, the sidebar.
     - `--bg: #0e0e10` and `--bg-2: #141416`, the page lifted just off black.
   - `--accent-fill-ink` in dark equals `--btn-ink`.
   - Re-solve any ink that drops below 4.5:1 on the new `--bg`. Change as little as possible and list every change in the report.
2. **Light theme:** `:root` (Paper) is unchanged. Its `--panel #2b2118` is already darker than its page.
3. **Remove the glow.**
   - Delete the `[data-theme="dark"] .main::before` layer and its `.main` worst-case background and isolation rule.
   - No decorative gradient anywhere in the chrome.
4. **The sidebar is a plain, solid `--panel` in every theme.**
   - No `backdrop-filter`, no gradient and no translucent material on desktop.
   - It is separated from the page by a hairline `--line` (a lighter rule on the dark panel is fine).
   - The phone drawer follows the same rule.
5. **Remove the themes Parchment, Latte, Forest, Midnight and Slate.**
   - Delete their CSS blocks.
   - Their menu buttons go; the Theme menu reads **Auto · Dark · Light**, in that order. The Dark swatch shows the new dark, not navy. The label "Navy" is gone.
   - A stored value that is no longer a theme (`parchment`, `forest`, `midnight`, `latte`, `slate`, or anything unknown) renders as **Dark**, in both the inline `<head>` script and `applyTheme`.
   - Nothing is written at boot. The stored value stays until the next menu pick: a render is a read, and there is no migration write.
   - The PANEL map in the inline script shrinks to `light` and `dark`. Unknown values fall back to dark's panel.
6. **Keep:**
   - T-024's one-time switch: stored "light" without `themeNavyOnce` goes to the default, which is now this dark. The marker semantics and the sync isolation tests stay as they are.
   - The capsule filled buttons and 20px cards. They carry no colour; they are shapes.
   - `meta theme-color`: dark gives `#000000` (the panel), light gives `#2b2118`.
7. **`docs/CONTENT-STANDARD.md`:** if the paragraph T-024 added is about the glow or the navy palette, remove it. Leave everything else untouched.
8. **Gates.** Change only what this spec mandates:
   - **Theme lists:** `verify-contrast` and the `verify-design` press check (`ALL_THEMES`) shrink to `["light", "dark"]`. The removed themes no longer exist, so there is nothing to measure. Say so in the report.
   - **Dark token table:** the verify-design expectations move to the restored values.
   - **Glow checks:** replace them with "no `.main::before` decoration and no background-image on `.main` or the sidebar, in either theme".
   - **New checks in verify-design:**
     - the sidebar's background is a solid `--panel`, has no backdrop-filter or background-image, and its luminance is below the page `--bg` in both themes, at 1280;
     - the Theme menu has exactly Auto, Dark and Light;
     - stored `"forest"` and stored `"slate"` render `data-theme="dark"` both at first paint, with app.js held as in T-024, and after app.js runs, with zero writes at boot;
     - the PANEL map is cross-checked against `style.css`, as now.
9. **Bump every `?v=` token** to a fresh value.

## Out of scope
- Page layouts. Those are separate items, with mockups first.
- The bottom bar (T-023, building separately).
- Any change to the light theme's colours.
- PROTECTED paths.
- New dependencies.

## Acceptance criteria
1. Dark resolves to the restored table plus the three sidebar/page exceptions, which verify-design checks. Light is unchanged.
2. Sidebar luminance is below page luminance in both themes. The sidebar is solid, with no filter or image.
3. The menu has exactly three options. Stored removed themes render as dark with no flash and no write.
4. There is no glow layer in any theme.
5. Plants, each of which must make a gate exit 1:
   - (a) the navy `--bg #0c1330` put back in dark;
   - (b) a removed theme's menu button put back;
   - (c) `--panel` lighter than `--bg` in dark;
   - (d) the glow layer put back;
   - (e) the inline script left letting `"forest"` through, so first paint is not dark.
6. All gates green on the final bytes, run sequentially:
   - typecheck, content, sync-loop, shell, contrast, logic, flows, design;
   - clip, plus clip with `TZ=America/Los_Angeles`, with the baseline only shrinking.
7. Screenshots at 1440 and 390, in dark and light, on `/`, `/atlas` and `/course/math110`.
