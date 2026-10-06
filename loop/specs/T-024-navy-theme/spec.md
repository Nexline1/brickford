# T-024: The navy theme: dark navy into gold, the default look

Source: `loop/design/brief.md` §9. The look the owner approved on 2026-10-06 is `loop/design/specimen-navy.html` and its renders `specimen-navy-*.png`, and the owner said "approved, start building the navy theme". This item stacks on T-016, which stacks on T-006 and T-007 (PR #5).

## Problem
- **The dark theme is iOS true black.** `[data-theme="dark"]` in `platform/css/style.css` (around line 251) is the T-005 lead pair: `--bg #000000`, `--surface #1c1c1e`, and a blue `--accent #78aef0`. The owner now wants Batelco's feel instead: deep navy with a gold accent and soft glows.
- **Light is the default.** An unset theme falls back to light (`S.settings.theme || "light"`, `platform/js/app.js` around line 5135). The owner wants dark navy by default.
- **The primary button is black, not gold.** It is `--btn-bg` / `--btn-ink`. In the navy look the one primary action is a gold capsule with a navy label.
- **The status bar is espresso.** `meta theme-color` follows `--panel`, which is still `#0a0d10` in dark, so the browser chrome doesn't match the navy page.

## Learner outcome
- The app opens in Brickford's own navy and gold. One clear gold action sits on each screen, and a soft glow sits behind the page head.
- Readable at night, and consistent between phone and desktop.

## Scope
1. **The `dark` theme becomes the navy palette** from brief §9:

   | Token | Value |
   |---|---|
   | `--bg` | `#0c1330` |
   | `--bg-2` | `#101839` |
   | `--surface` | `#1a2248` |
   | `--surface-2` | `#232c58` |
   | `--line` | `#2e3866` |
   | `--ink` | `#ffffff` |
   | `--ink-2` | `#c3c8de` |
   | `--ink-3` | `#9aa2c4` |
   | `--accent`, `--accent-fill`, `--gold` | `#e0b35a` |
   | `--accent-soft` | gold at about 16% on the surface, as a solid colour |
   | `--btn-bg` | `#e0b35a` |
   | `--btn-ink` | `#121a38` |
   | `--panel` | `#0c1330` |

   - Add a new token `--accent-fill-ink` (the label colour on a filled accent): light `#ffffff`, dark `#121a38`. Every rule that puts text on `--accent-fill` or `--btn-bg` uses it.
   - `--good`, `--bad`, `--urgent` and the `--fac-*` colours are re-solved for the navy surfaces where needed. Every ink stays solid and at 4.5:1 or better.
2. **The default theme is `dark`.**
   - An unset `S.settings.theme` resolves to `dark`, and Auto with a dark phone resolves to `dark`, which is already the case.
   - A stored choice is never rewritten. No migration touches saved settings, so an owner who picked Light keeps Light until they choose again.
   - The theme menu labels `dark` as "Navy" and lists it second, after Auto.
3. **Glow.**
   - A decorative layer at the top of `.main`, in dark only: a faint gold radial glow top-right and an indigo glow top-left.
   - Rules: `pointer-events: none`, behind the content (never over text), no animation.
   - Every element whose background is a gradient also declares a solid `background-color` (the worst case for its text), so `verify-contrast` measures a real pair.
4. **Shape.**
   - Cards and grouped sections: 20px corners (`--r-card`).
   - Primary and filled buttons: capsules (`border-radius: 999px`).
   - Chips: capsules.
   - These shape tokens apply in all themes, for consistency.
5. **Bump every `?v=` token.**
6. **The protected exception.** `docs/CONTENT-STANDARD.md` (PROTECTED; named here and approved by the owner on 2026-10-06) gains one short paragraph:
   - decorative motion is allowed for the opening screen only (built in T-022), and is still under Reduce Motion;
   - static decorative glows are allowed behind page heads in the dark theme, as long as text never sits on them without a measured solid fallback.

## Out of scope
- **Later items:** the floating tab bar (T-023), the opening screen and its animation (T-022), the Home layout with the greeting, sheet, stat wells, tiles and course card (T-017).
- **Light and the other five themes:** their colours are unchanged; only the shared shape tokens reach them.
- **PROTECTED paths** other than the `docs/CONTENT-STANDARD.md` paragraph named above.
- **Curriculum and plan data:** not touched.
- **No new dependencies.**

## Acceptance criteria
1. **Tokens, in `verify-design.js`.** The dark token table changes from the T-005 true-black values to the navy values above, because of the owner's 2026-10-06 decision. This is not a loosening: same check, new expected values. The gate also asserts:
   - with no stored theme, the page resolves to `data-theme="dark"`;
   - Auto with a dark phone resolves to dark, and Auto with a light phone to light;
   - a stored `light` stays light.
2. **Primary action.** In dark, `.btn.lg` and the primary `.btn` compute a gold background, a navy label and a 999px radius. In light, the label stays white on the fill.
3. **Glow.** In dark at 390 and 1280:
   - the glow layer exists with a gradient background image and `pointer-events: none`;
   - its box lies behind the content, with nothing interactive under it;
   - it is absent in light.
4. **Status bar.** In dark, `meta[name=theme-color]` equals `#0c1330`.
5. **Planted bugs**, each exiting 1:
   - (a) dark `--bg` back to `#000000`;
   - (b) the default back to light;
   - (c) a navy label lost on the gold button (white on gold fails contrast);
   - (d) the glow catching pointer events.
6. **All gates green on the final bytes:**
   - `verify-contrast`: all 7 themes, with the navy dark measured;
   - shell, clip (0 new), flows, sync-loop, logic, content;
   - design, with T-005 to T-016's checks all still present.
7. **Screenshots** at 390 (dark and light) and 1280 (dark) of `/`, `/course/math110`, `/calendar` and `/record`, compared with the specimen. Differences are listed, along with which later item resolves each.

## Verification checklist
- [ ] typecheck and all gates on the final bytes
- [ ] four planted-bug runs exit 1
- [ ] screenshots vs the specimen
- [ ] the branch pushed at each checkpoint
