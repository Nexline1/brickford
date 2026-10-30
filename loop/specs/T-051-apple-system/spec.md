# T-051: Apple system redesign, the whole app

Status: ready (owner approved the mockup on 2026-10-22, "rebuild the whole app").

## Owner decisions
- **2026-10-21:**
  - Tailwind 4.3.3 with a build step. The compiled CSS is committed and Pages is unchanged.
  - Apple's accessible shades; the 4.5:1 gate stays.
  - Pure iOS: navy and gold leave, and the crest stays as the logo.
  - Mockup first.
- **2026-10-22:**
  - Approved the mockup: `loop/design/apple/specimen-apple-*.png`, `tailwind.config.js`, and `specimen-apple-notes.md`, deviations 1–13.
  - Section headers are 13px regular uppercase.
  - The tab bar is a floating capsule.
  - A pressed row may dip below 4.5:1 for about 0.3s; the contrast gate exempts `:active` states only.
- **2026-10-22, the owner's words on the phone design:** "there's a lot of text in here that is not needed. It's really annoying… the titles are too long… even the size of the layout… you should be able to monitor that to make it better for my UI/UX." The density rules below answer this. They override the mockup wherever the two disagree.

## Phone density rules (390px and narrower)
1. **List row titles are one line, with an ellipsis if needed.**
   - Lists show a **short title**, derived at display time; the data is untouched (`platform/data` stays PROTECTED).
   - To shorten: cut at the first " — ", " – ", ": " or " (" when what remains is at least 2 words, and strip "(DO NOT SKIP)"-style suffixes.
     - "Makemore 4 — becoming a backprop ninja (DO NOT SKIP)" becomes "Makemore 4".
     - "Building a story live: know the end, start close to it" becomes "Building a story live".
   - The full title appears only on the lecture page header, at most 3 lines.
2. **Each row has at most one subtitle line.** It holds the single most useful fact, e.g. "MATH 130 · 50 min" or "Due · 3 questions". Drop the rest: no "Theory", no "day 2 of 3", no "Pen and paper", no lecture-number prose.
3. **No sentences on overview screens:** dashboard, courses, problems, exams, week, calendar, practice home.
   - Explanatory copy moves behind an ⓘ button that opens a sheet, or is deleted. Examples:
     - "Pass it to open …";
     - "How this works";
     - "Progress stays in this browser only";
     - "Misses come back, reshuffled…".
   - Lesson content itself (summary, quiz questions, explanations after an answer) is exempt.
4. **Hero card:** a kicker, a title (at most 2 lines) and one button. Nothing else.
5. **Section headers:** at most 3 words, plus an optional count. "TODAY · 3", not "3 LECTURES · 3 H 26 MIN".
6. **Compact numbers:**
   - durations: "3h 26m", "50m";
   - day count: "Day 15 / 1094";
   - streak: "🔥 3".
7. **The layout fits the thumb:**
   - the most important action sits in the first viewport at 390×844;
   - the phone dashboard shows Up next, Today and Progress before the fold;
   - secondary blocks (Where you stand, attention items) sit below the fold or collapse;
   - card padding is 16px and the gap between groups is 24px on the phone.
8. **Desktop (1024px and wider)** may show the longer subtitle and the full title. The rules above are phone-first.

## Monitoring: tools/verify-density.js (new gate)
- Covers every main route at 320 and 390, Light, with the fixture states verify-design already uses.
- On each route, it measures:
  - the words visible in the first viewport;
  - the line count of every list-row title and subtitle (from the rendered box height ÷ line-height);
  - the longest run of words in any text node outside the exempt lesson-content selectors.
- **Fails when:**
  - any row title is more than 1 line;
  - any row subtitle is more than 1 line;
  - a non-exempt text node is more than 12 words;
  - any route's first-viewport word count exceeds its baseline.
- **Baseline:** `tools/verify-density.baseline.json`, which may only shrink, the same rule as verify-clip.
- **Plants that must fail it:**
  1. a 2-line subtitle;
  2. a returned sentence on the dashboard;
  3. a raised word count.
- It joins the CLAUDE.md gate list when this item merges. CLAUDE.md is protected, so the owner's approval of this spec covers adding one line for the gate.

## Build phases (one PR each, merged in order)
- **51a, Foundation:**
  - Load `tailwind.css` in `index.html`. During migration, preflight is off or scoped, so unmigrated screens don't break.
  - Rename the 15 app class names that collide with Tailwind utilities (`grow`, `ring`, `table`, `border`, `rounded`, `transition` and the rest; see notes).
  - Point style.css's `:root` and `[data-theme=dark]` tokens at the iOS palette, so every screen immediately gets the iOS colours, the SF/Inter stack and the type scale.
  - Self-host Inter.
  - Shell:
    - the sidebar, as in the mockup;
    - the floating tab bar;
    - the large-title header;
    - press utilities (`press-row`, `press-btn`, `press-card`, `press-text`) on every tappable element;
    - the short-title helper;
    - verify-density with its baseline;
    - verify-tailwind added to the gate list.
- **51b:** Dashboard, Lesson (with the quiz) and Problems, per the mockup plus the density rules.
- **51c:** every other route: Atlas, Courses, Course, Exams, Proof, Practice, Week, Calendar, Treasury, Library, Drill, Record, and the Sync/Backup sheets.
- **51d:** delete the dead style.css rules, turn preflight on everywhere, and bring the density baselines down.

## Acceptance (every phase)
- **Every existing gate passes,** plus verify-tailwind and verify-density.
- **verify-design's token assertions are updated to the new tokens, not removed.**
  - Each changed assertion is listed with the old value and the new one.
  - Removal is allowed only where the thing measured no longer exists, and each removal is listed.
- **Contrast:** 4.5:1 for every text pair in both themes. Only `:active` is exempt.
- **Touch targets:** 44px everywhere.
- **Screenshots** at 390 and 1440, Light and Dark, for every route the phase touches.
- **Plants:** each new gate is shown failing on a planted bug.
- **No new dependency** beyond tailwindcss 4.3.3, @tailwindcss/cli 4.3.3 and @fontsource-variable/inter 5.3.0.

## Merge order
T-045 and T-046 merge first. Each T-051 phase rebases on main before its PR.

---

## Re-plan, owner 2026-10-29 (overrides "Build phases" and "Merge order" above)

Owner: "Start doing the apple design task, but slight fixes page by page (and after each page push and merge)",
and chose **"Colours first, then pages"**. There is **no Tailwind build step**: everything goes into the existing
`platform/css/style.css`, and the no-new-dependency rule now allows nothing at all. The 22 Oct foundation branch
`loop/T-051-apple-system` (bc4416b) is a **reference to copy from**, not something to merge. It holds the iOS
token values, the accessible shades it measured (for example dark red #FF6961), the self-hosted Inter woff2 files
with OFL.txt, verify-density.js with its baseline, and the specimen screenshots in loop/design/specimen-apple-*.png.

Each step is one small PR, merged before the next one starts. "Slight" means no restructuring of app.js views
beyond what the page needs, and no behaviour changes.

1. **T-051-1: colours, type and the density gate. No layout changes.**
   - Point style.css's `:root` and dark-theme tokens at the iOS palette, with the accessible shades.
   - Self-host Inter: copy the two woff2 files and OFL.txt from bc4416b, `@font-face` with `font-display: swap`, a
     `-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui` stack, and add them to the T-058 precache.
   - Add `tools/verify-density.js` with its baseline measured on today's main, so it only records where we stand,
     and add one line for it to CLAUDE.md's gate list (owner-approved via this spec). Nothing is expected to shrink yet.
   - Update verify-design's token assertions to the new values (old → new listed). Contrast stays 4.5:1 in both
     themes, measured, not assumed.
   - Screenshots at 390 and 1440, Light and Dark, of Dashboard, a Lesson and Problems.
2. **T-051-2 Dashboard**, **T-051-3 Lesson + quiz**, **T-051-4 Problems**, **T-051-5 Week + Calendar**,
   **T-051-6 Courses/Atlas/Course**, **T-051-7 Exams/Proof/Record**, **T-051-8 Practice/Library/Treasury/Drill**,
   **T-051-9 Monk**, **T-051-10 shell (sidebar, tab bar, large title)**: one PR each. In each:
   - Apply the phone density rules above to that page only: short titles, one subtitle line, no sentences on
     overview screens, compact numbers, iOS inset grouped lists, press feedback, 44px targets.
   - Lower that page's verify-density baseline. It may only shrink.
   - Take screenshots of that page at 390 and 1440, Light and Dark.
   - Pass every gate.

### Owner feedback, 2026-10-29 (evening), and the scope change it brought (relayed by the coordinator)

Two screenshots from the owner's iPhone, Dark, are the "before" evidence:
`loop/design/apple-1/owner-2026-10-29-dashboard-phone-dark.png` and `owner-2026-10-29-drawer-phone-dark.png`.

The owner: "Even the sidebar is too big (on mobile version and texts too) + buttons in the entire app are too
large and too plain". Earlier: "I want to barely have any words in the main User interface, only visual appearance
and buttons" — that rule is for the page PRs, not T-051-1.

What the screenshots show: row titles wrapping to 2–5 lines ("Makemore 3 — activations, gradients, BatchNorm" on
five), section heads as the biggest text on screen ("MATH 130 · Theory"), the floating NEXT bar and the tab bar
together covering about a quarter of the screen, the drawer's crest, BRICKFORD and SELF-BUILT UNIVERSITY taking a
third of it, and oversized nav rows.

**Added to T-051-1, because they are app-wide:**
1. **The iOS type scale on a phone.** Body and list rows 17px; subtitles and secondary text 15px; section headers
   13px uppercase (the owner's decision of 2026-10-22); the large title 34px only at the top of a page; the nav bar's
   inline title 17px semibold; card and row titles at most 17px semibold. Find out whether the app inflates the root
   font size, and fix the cause. The verify-clip root 16/24px sweep keeps passing.
2. **Buttons, all of them: smaller and not plain.** Primary: a filled accent capsule, 15px semibold, about 34–36px
   painted. Secondary: tinted, the accent at about 12–15% fill with accent text. Tertiary: plain accent text. The
   hit area stays 44×44 without a 44px visual, and verify-shell's 44px measurement must measure the hit box, not be
   loosened. Press feedback: a 0.97 scale and an opacity dip, with reduced motion respected.
3. **Left alone in T-051-1:** the drawer, the sidebar layout, the floating NEXT bar and the tab bar. No view is
   restructured.

Plants added: a 22px row title, and a button painted 44px or taller, each caught (exit 1).

**The order after T-051-1 changes:** the shell moves up, right after this PR, because of this feedback. The next
PRs are **T-051-2 shell** (the sidebar and drawer made compact, the tab bar, the NEXT bar; it was T-051-10) and
**T-051-3 Dashboard**. The page steps after them keep their order.
