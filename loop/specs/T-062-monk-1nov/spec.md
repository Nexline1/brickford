# T-062 — Monk Mode starts 1 Nov

Owner, 2026-10-31: "Reset monk Mode to start on Nov 1". Days stay 21 (T-057), so day 21 = Fri 21 Nov 2026.
Same shape as T-061 (loop/specs/T-061-monk-30oct/, merged as #27): change `MONK.from` "2026-10-30" -> "2026-11-01"
and the range comment in platform/js/app.js, then move every pinned monk clock and expected string in
tools/verify-logic.js, verify-flows.js, verify-sync-loop.js and verify-design.js so each fixture keeps its meaning
(a "logged day" stays a monk day, a "before" state stays before the start, weekday-dependent fixtures keep their weekday).
Read T-061's changed-assertions.md and `git show 9a5f355^2` diff for the exact pattern; this is +2 days again.

Acceptance: monkDay edges (31 Oct null, 1 Nov = 1, 21 Nov = 21, 22 Nov null); dashboard row and #/monk head right at
those edges; the pre-start Focus test still discriminates (re-pick "today" so the window holds pre-start days with misleading
data AND >= 2 monk days; plant focus-counts-prestart exits 1); no assertion loosened, each moved clock listed in
verification/changed-assertions.md; reuse T-061's plants.sh pointed at this worktree and add plant monk-from-30 (old start, exits 1);
all gates green (typecheck, content, logic, sync-loop x2, flows x2, design x2, shell, contrast, offline x2, density,
clip 797 may only shrink + TZ=LA). Bump ?v=. Nothing else changes. Known flake: flows (p), re-run once.
