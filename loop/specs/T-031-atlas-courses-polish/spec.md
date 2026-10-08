# T-031: Atlas and Courses layout polish (from T-026a review round 3)

Source: T-026a review round 3 (2026-10-08). The owner chose "Merge now, fix later" (PR #11, merged at 13105f7). The reviewer's probes are in the session scratchpad `r3/` (probe4–7); this spec is self-contained without them.

## Scope
1. **The shelf column floor is narrower than its word.** `platform/css/style.css` (~2501–2503) uses a 6.75rem floor, but "Mathematics" in `.bk-t` (15px, weight 600) is 109px, which is 6.81rem in the harness font.
   - **Where it breaks:** a track between the two splits the title as "Mathematic/s for Machine Learning" on Later and All. Reproduced at:
     - root 16: 1132–1134px;
     - root 20: 322–324px, 1088–1090px and 1252–1256px;
     - root 24: 376–378px, 1038px, 1178–1182px and 1372–1376px.
   - **Fix:** raise the floor to `max(7rem, …)` in all three rules, and correct the comment.
2. **The gate is blind to this.**
   - Add widths 1132 (root 16) and 376 (root 24) to the T-026a sweep (`T26_OW` in `tools/verify-design.js`), plus anything the 2px sweep shows lands in the gap.
   - Show the gate exits 1 on 13105f7, and passes after fix 1.
   - Correct the comment near the sweep that says 1100 has "four covers across"; it has three.
3. **Plants for the shelf floor:**
   - (a) the floor back at 6.75rem;
   - (b) `repeat(4, minmax(0, 1fr))` at 1024px and up.

   Each must exit 1. Restore with `cmp`.
4. **The next-gate card wraps the days at the default size.** `.at-main { flex: 1 1 14rem }` puts a 3-digit day count under the chips on a 390 phone at root 16.
   - **Fix:** lower the basis to 12rem. Keep one line at 390/root 16 for 3 digits and at 360/root 16 for 2 digits; it still wraps at roots 20 and 24 at ≤390.
   - **Verify:**
     - add a verify-design assertion that the days share the text's line at 390/root 16 for a 3-digit count;
     - re-run the mid-word sweep, which must find 0 breaks on /atlas and /courses at 320/360/390 × roots 16/20/24;
     - re-run plant j.
5. **Record the deviation** in `loop/specs/T-026a-atlas-courses/spec.md` under item 12, dated: with the rail visible, 3 columns from about 1040px to about 1147px, because 4 would break titles mid-word.
6. **Bump every `?v=` token.**

## Acceptance
- All gates are green on the final bytes, run sequentially, with clip also under `TZ=America/Los_Angeles`.
- Plants a, b and j each exit 1.
- The mid-word sweep shows 0 breaks on /atlas and /courses.
