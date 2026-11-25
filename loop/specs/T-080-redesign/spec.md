# T-080: website redesign — the phone app's identity, fewer buttons per page (CURRENT)

## Context
- **What the owner asked (25 Nov).** Improve the website's design, since "a lot of stuff could be improved". Use skills to find what.
- **Skills used.**
  - `landing-page-design`: built for marketing pages, so only its general rules apply (one primary action, 44px taps, mobile, speed).
  - "find_skill": does not exist, and a skills search found nothing to install.
  - `design-detect`: run as the audit. 15 high / 22 med / 6 low. Many are deliberate or false positives (Inter is the body face, "weight 100" is the @font-face range). The real ones:
    - pure `#000` page;
    - cards nested in cards (`app.js` 3031, 3691, 3697, 5537, 6482);
    - ✓ text glyphs used as icons;
    - placeholders standing in for labels (`ghTok`, `aiKeyIn`, `anWhere`, `anUrl`, `rvShipped`, `diagScore`);
    - 11–12px text (`style.css` 945, 1602, 1620, 1920);
    - `100vh` without `dvh`.
- **What I saw, on screenshots at 1440 and 390:**
  - The site and the phone app look like two products. The site is iOS settings: pure black, bright blue `#0A84FF` pills, system font titles. The app and the new crest are midnight, gold, navy and Playfair.
  - Too many controls at once:
    - The sidebar has 14 items: 11 nav links plus Theme, Backup, Restore and Sync as four separate rows.
    - The dashboard stacks about 8 equal-weight rows under the hero.
    - The "Next up" rail (ring, Open, streak) repeats on every page, including Courses and the course page, and duplicates the dashboard hero.
  - Every page has the same layout (title, then grey rounded rows), so nothing tells you where you are.
  - Specific defects:
    - Courses tiles are big flat colour blocks showing only the code again.
    - Course-page lecture thumbnails repeat "MATH 110 1" in tiny text.
    - The course stats are square-bordered boxes in an otherwise rounded UI.
    - "Day 035" is zero-padded.
    - The Monk Mode row's icon renders as a stray "‹".
    - The Practice form is centred while every other page is left-aligned.
    - "Press the red button" shows on a tab that has none.
- **Owner's answers.**
  1. Match the phone app.
  2. All pages, but mainly **simplify**. Make each page user-friendly with **its own layout**, not one template. **Fewer buttons per page**: compress them or group them into categories. Courses and the course page come first.
- **Freeze.** This is the owner's explicit exception, like T-046.

## Approach (one builder, website only; three PRs so each ships and is checked on its own)
**PR 1: identity (tokens only, no layout).**
- **Files:** `platform/css/style.css`, `platform/index.html`.
- **Dark and Auto-dark:**
  - the page is midnight `#12141C`, not `#000`;
  - surfaces step up from it;
  - the primary button is navy (the app's `Tokens.primary`), not iOS blue;
  - gold `--crest #DFB46B` is kept for the crest, wins and the today ring.
- **Light:** the app's white sheet on a warm off-white, with the same navy and gold.
- **Page titles** (the large title and the dashboard hero) use the bundled Playfair Display Bold, copied from `app/assets/fonts`, self-hosted like Inter. Body stays Inter.
- **Other five themes:** keep their own colours and pick up the new type.
- **Rules that must hold:** solid inks, 4.5:1 in all 7 themes (re-solve each changed ink), `--panel` only on the sidebar and tab bar.
- **Detector fixes:**
  - `100dvh` with a `100vh` fallback;
  - a 13px floor on labels and 15px on body;
  - real `<label>`s instead of placeholder-only fields;
  - the ✓ glyphs become the existing inline SVG check.

**PR 2: fewer buttons, grouped (structure).** The core files are `platform/index.html` (sidebar) and `platform/js/app.js` (views).
- **Sidebar, 14 rows to 7.**
  - Primary: Today, Courses, Practice, Week, Proof.
  - "Study tools" collapses Problems, Exams, Atlas, Calendar and Library.
  - "Life" collapses Monk Mode and Treasury.
  - Theme, Backup, Restore and Sync merge into one **Settings** sheet with sections.
  - The phone tab bar keeps 5 tabs; its "Review" tab becomes "More", opening the same grouped list.
- **"Next up" rail:** shown only on the dashboard and lecture pages. Courses, the course page and Practice get their width back.
- **Dashboard:**
  - one hero (today's next thing, one filled button);
  - below it, **one** grouped card "Today" with the 3 track lectures and "seal the day";
  - Monk Mode and the warnings fold into a single "Needs you" strip that only appears when non-empty.
  - About 8 rows drop to about 5.
- **Secondary actions:** each page's row of secondary buttons (Week, Practice, Treasury forms) goes behind one "⋯ More" menu or a segmented control. Only the page's one primary action stays as a button.

**PR 3: a layout of its own per page.**
- **Courses:**
  - a shelf grouped by track (Math, AI/Build, Storytelling) instead of a flat colour-block grid;
  - each card shows the title large, the code small and a real progress bar (lectures watched / total).
  - The Now/Later/Finished/All segmented control stays.
- **Course page:**
  - a header with the instructor, a progress ring and "Continue: <next lecture>" as the one button (not "Start the course" once begun);
  - units as collapsible sections showing progress;
  - lecture rows lose the fake thumbnail (number plus duration only);
  - the bordered stat boxes become plain inline stats.
- **Lecture page:** a two-column reading layout on desktop (video and notes left, quiz and practice in a sticky side panel); stacked on the phone.
- **Practice:** left-aligned like the rest, recorder first, the three tabs as a segmented control, and the wrong "red button" line fixed.
- **Week and Calendar:** the week as a 6-day strip header with the review form below. On the calendar, the month grid leads.

**Out of scope:**
- The Flutter app, which already has this identity.
- Data, the schedule and features.
- Lesson keys and the `CLAUDE.md` invariants.

## Gates (each PR)
- **Checks to run:** content, logic, sync-loop, shell (sidebar visible and tappable at 8 widths; the new grouped nav must pass), contrast (7 themes × 2 widths), flows, design, clip.
- **verify-design** pins the old tokens (`BRIEF[theme]`, sidebar/crest checks). The builder updates those pins to the new values in the same PR, with a note per change. It never loosens a check.
- **New checks with plants:**
  - the sidebar has ≤ 7 top-level items;
  - the "Next up" rail is absent on `/courses`;
  - one filled button per screen on each main route;
  - Playfair is loaded and renders on titles;
  - the page background is not `#000`.
- **Gates not in scope:** the Flutter gates are untouched (scope diff: no `app/` changes).
- **Visual review:** before/after screenshots at 1440 and 390 for Dashboard, Courses, Course, Lecture, Practice and Week, dark and light. I look at every one before merging.
- **Owner feedback:** the owner gets the after-shots or the live link after PR 1, so the direction can be corrected early.

## Critical files
- `platform/css/style.css`: tokens, themes, the 7 theme blocks.
- `platform/index.html`: sidebar, fonts.
- `platform/js/app.js`: `V.dashboard`, `V.courses`, `V.course`, `V.lesson`, `V.practice`, `V.week`, the rail renderer.
- `tools/verify-design.js`, `tools/verify-shell.js`.
- `loop/design/brief.md`: a new section 0, "25 Nov 2026: the phone app's identity", which supersedes the iOS-blue tokens and keeps the brief's structure rules.

---

