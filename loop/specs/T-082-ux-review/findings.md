# T-082 UX review: Brickford website (25 Nov 2026)

Skills: WDG = web-design-guidelines (Vercel), IMP = impeccable (guides only; launcher not run), UUP = ui-ux-pro-max (checklists).
Evidence: Playwright renders at 1440/390 × dark/light with a seeded state (day 35, 31 lectures watched), computed style, a keyboard pass.
Screenshots: shots/ (59 PNGs). Degraded: single-context review, no impeccable detector.

## Ranked findings (most impact on daily use first)
1. **"What next?" has four answers** (P1, M; IMP, UUP). Home hero = plan's pick; Courses = last-touched course (app.js:3193); course page = first unwatched (app.js:3355); lecture rail vs unit list disagree. Fix: one resolver (the plan's) for every Next/Continue; unit list says "After this in the unit".
2. **Today is a wall: 31 controls; backlog above today** (P1, M). On the phone today's 3 lectures start ~980px down; Next bar + tab bar = 160px fixed chrome. Fix: hero → Today → one row "32 owed · oldest 17 days ›"; Checkpoints/Where you stand move to Proof; Next bar hidden while the hero button shows; ≤12 controls.
3. **Empty box on Today** (P1, S). `<textarea id="weekOut" class="pr-week" hidden>` (app.js:4125) is shown because `.pr-week{display:flex}` (style.css:3078,3457) beats `hidden`. Fix: rename; global `[hidden]{display:none!important}`.
4. **"Seal the week" live 4 days early** (P1, S). Filled + enabled on Wednesday; one tap writes a failed week and a chain event (app.js:5631, 7724–7741), no confirm/undo. Fix: before Sunday a tinted "Seal early" with a confirm.
5. **Restore backup overwrites everything, no confirm** (P1, S). importBackup (app.js:8178–8195). Fix: confirm comparing both states, 10s undo, red-tinted label.
6. **Lecture page buries the notes** (P2, M). Phone: quiz/practice aside precedes notes (app.js:3778–3792); notes folded; step bodies 15px grey. Fix: video → notes (open once watched) → quiz → practice; 17px `--ink`; no rail on lectures.
7. **Three navigation systems on the phone** (P2, M). Hamburger drawer + tab bar + More; tab top-level ≠ sidebar top-level; one page called Today/Home/Dashboard. Fix: drop the phone hamburger, one name "Today", tabs follow sidebar order (owner picks the four).
8. **Problems = 24 identical "Take it" buttons** (P2, M). 2318px desktop / 4627px phone. Fix: group by course, one filled "Start next quiz", whole rows tappable, legend on top.
9. **Text/inputs below floors** (P2, S). 8px calendar weekdays at 390 (style.css:1175), 8.96px ring captions (1198), 8–11px labels (1082,1090,2049,2659); Practice inputs 39–40px. Fix: 13px floor, 44px inputs, a verify-design assertion.
10. **Desktop Today has no heading** (P2, S). h1 hidden (style.css:652); hero title and section heads are divs. Fix: hero title = h1, `.ghead` = h2.
11. **Feedback silent, focus lost** (P2, S). #toast no live region; #view not focused on route change; no skip link; `<summary>` missing from focus styles (style.css:419).
12. **Glyphs as icons** (P3, S). ✓ ○ ! ◆ on Today (app.js:2958,2960), ? ⌘ ✎ on Problems (6770,6785,6792). Fix: the nav's SVG set.
13. **Uppercase tracked headings against the brief** (P3, M). `.ghead` (2189), `.field` (833), lecture kicker (658). Fix: sentence case 17/600; kicker becomes a breadcrumb.
14. **"Past weeks" lists this week and 3 future ones** (P3, S). app.js:5604,5633. Fix: one line until the first seal.
15. **Green on every lecture row; leftover fake thumbnails** (P3, S). Fix: "Watched" in --ink-2, only "Proven" green; lecture page's In this unit uses the course page rows (app.js:3298,3812).

## Heuristic scores (impeccable, 0–4 × 10)
Today 23 · Courses 27 · Course 28 · Lecture 27 (notes 22/32) · Practice 26 · Week 23 · Calendar 28 · Problems 27 · Exams 29 · More+Settings 24. Today and Week are weakest; Exams is the model page.

## Already good
Identity matches the phone app; Settings sheet (native dialog, clear rows); Exams page; course page; mechanics (no overflow at 390/1440, no page errors, focus ring, reduced motion, safe areas, no transition:all).

## Appendix (WDG file:line, skipped deliberate items per brief/CLAUDE.md)
index.html:83 no skip link; :122-221 decorative SVGs lack aria-hidden; :236-238 theme buttons lack aria-pressed; :249 toast not live. style.css:824-826 input focus ring ~16% mix (<3:1); :969,3440 one-sided border bars; :2878 no overscroll-behavior:contain. app.js:5154 img without size; :5668,6685-6695,6718,6747 inputs missing autocomplete/type=url/inputmode=decimal; :2911 generic "Open"; :8609 no aria-current; :8664 theme state class-only.
