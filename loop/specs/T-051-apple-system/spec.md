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

## Owner, 2026-10-29 (second message): "barely any words"
> "minimize the unnecessary details or branch them inside the pages/tabs, since the UI looks messy with a lot
> of words, I don't like that I want to barely have any words in the main User interface, only visual
> appearance and buttons"

This tightens the density rules for every page PR (T-051-2 onward) and overrides them where they conflict.

- **Overview screens show only labels, numbers, visuals and buttons.** Overview screens are Dashboard, Courses,
  Atlas, Problems, Exams, Week, Calendar, Practice home, Library, Record and Monk. No sentences at all.
  - Labels are at most 3 words.
  - Numbers are compact ("3h 26m", "Day 15", "🔥 3").
  - State is shown visually: rings, bars, heatmaps, ticks, colour dots, SF-style glyphs.
- **Every detail moves one level down.** Explanations, hints, secondary facts and "how this works" text move into
  the item's own page or tab, a sheet behind ⓘ, or a collapsed "More" disclosure. Nothing is deleted that the
  owner needs, but it is no longer on the main surface.
- **A row is a glyph, a short title and one value.** A subtitle is allowed only where the row is ambiguous
  without it.
- **verify-density tightens per page as each page ships.**
  - On overview routes, the longest text node is at most **6 words** (was 12).
  - Each overview route gets a first-viewport word budget at 390px, set when its PR lands and only ever lowered.
    The target is about 40 words for the Dashboard and about 30 for the others.
- **Lesson content is exempt:** the summary, the quiz questions and the explanations shown after an answer. The
  lecture page's chrome around them follows the same rules.
