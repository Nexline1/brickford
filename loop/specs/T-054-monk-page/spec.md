# T-054: Monk Mode page inside Brickford (native)

## Owner decision, 2026-10-23
"Rebuild it natively inside Brickford." This replaces T-052's link-out row, which this item absorbs. The source to mirror is the published monk-mode page; a copy is in `loop/design/monk-mode.html`, and its layout, logic and copy are the reference. Calendar and Gmail can't run inside Brickford, so they stay on that claude.ai page, reached by one link.

## The page: `#/monk`
Use Brickford's current components (`.one`, `.ghead`, `.glist`, `.grow`, the 44px controls, the theme tokens) so it matches the app today. The paused T-051 restyles everything later. Phone density rules from T-051 apply: one-line rows, no sentences.

1. **Head:**
   - "Day N of 90", using T-052's `monkDay` (calendar days, 22 Oct 2026 – 19 Jan 2027);
   - the date and week of 90;
   - a score ring for today.
   - Before or after the 90 days: "Starts 22 Oct" or "90 days done".
2. **Now / Next,** from the routine template in `loop/design/monk-mode.html` (`planFor`): the current block, the next block, and the next adhan with a countdown. The full day sits behind a disclosure.
3. **Top 3 today** (business, content, education): the plan saved the night before, or the same day-type defaults as the reference.
4. **Prayer on time:** 5 chips with their adhan times, and a streak.
   - Times come from the reference's `prayerTimes` port: Manama, Umm al-Qura, Fajr 18.5°, Isha = Maghrib + 90.
5. **Non-negotiables** (toggles): German 1.5 h, Brickford 3 h, Meditate, Read, "No TikTok · IG · YouTube", Plan tomorrow.
6. **Numbers** (± steppers):
   - work hours (target 10) and phone hours (max 2), in steps of 0.5;
   - gym, short-form, videos, scripts, books;
   - streams, shown on Tue and Sat;
   - clips, shown on Sun and Wed or when non-zero.
7. **This week** (Sunday to Saturday): short-form 8, streams 2, videos 2, scripts 4, gym 5, book 1, work 70 h. **This month:** streams 8, clips 36.
8. **90-day map:** 13 week columns × 7 days, coloured by the daily score (the reference's `score()`); today outlined.
9. **Focus this week:** the weakest habit over the last 7 days, with the one-line fix from the reference's FIX table. Rule-based, with no AI call.
10. **Open loops:** a toggle list plus an add field. When `S.monk.loops` is first created, seed the 4 loops below.
11. **Plan tomorrow:** three fields (business, content, education) and a Save button. Saving sets today's "Plan tomorrow".
12. **Calendar and inbox:** one row that opens `MONK.url` in a new tab.

## Data, and privacy
- **Shape:**
  - `S.monk = {days:{iso:{…, at}}, plans:{iso:{…, at}}, loops:{id:{text, done, at}}}`;
  - every write sets `at` (ISO time);
  - `mergeState` merges each day, plan and loop by the newer `at`.
- **Writes happen only from the viewer's own actions,** through `save()`. A render is a read.
- **PRIVACY:** until T-053 (private sync) ships, `monk` is stripped from the payload pushed to GitHub, and a pull never deletes local monk data. Put this behind one constant, `MONK_SYNCS = false`, which T-053 flips. The page shows nothing about sync.

## Navigation
- The sidebar's Rhythm section gains "Monk Mode" (`#/monk`).
- The dashboard row from T-052 links to `#/monk` (same window) instead of the external page, and still shows only on days 1–90.
- The phone tab bar is unchanged; the dashboard row is the phone's way in.

## Seed loops
1. "Carousel 'Top 5 Claude Code skills': approved twice 6 Oct, never rebuilt: rebuild or drop"
2. "Carousel 'OpenAI agent broke into a health portal': approved 24 Sep, never built: drop or reframe"
3. "Connect your main Gmail in Claude"
4. "Allow huggingface.co in the cloud environment"

## Acceptance
- **verify-logic:**
  - `prayerTimes` matches the reference within 1 minute for 2026-10-22 (04:21 11:22 14:38 17:04 18:34), 2026-12-06 (04:47 11:29 14:26 16:46 18:16) and 2027-01-05 (05:02 11:43 14:40 17:00 18:30);
  - `score` and the weekly sums on a fixture;
  - Sunday-start weeks;
  - T-052's `monkDay` checks stay.
- **verify-sync-loop:**
  - with `MONK_SYNCS` false, a push payload has no `monk` key, and a pull keeps local monk data;
  - the newer-`at` merge is correct when the constant is flipped on in a test.
- **verify-flows** (390 and 1280):
  - a prayer chip, a habit and a stepper write exactly once each, on the action;
  - opening `#/monk` writes nothing;
  - saving tomorrow's plan shows it as tomorrow's Top 3 when the clock moves a day.
- **verify-design:** `#/monk` at 1440 and 390, Dark and Light. At most one filled primary, every control 44px or more, no clipping, and contrast covered.
- **verify-shell:** the sidebar link count is updated. List it as a changed assertion.
- **Plants that must each exit 1:**
  - a write during render;
  - `monk` included in the push while `MONK_SYNCS` is false;
  - an off-by-one in `prayerTimes`.
- Every gate passes, and the `?v=` tokens are bumped.

## Amendment 2026-10-23 (owner): Shia, Ja'fari Tehran, prayers combined into 3 blocks, no Jumu'ah
Relayed by the loop coordinator. It replaces the Umm al-Qura method in item 4 and the prayer values under Acceptance.
- **Method:** one constant, `PRAYER_METHOD = {fajr: 17.7, maghrib: 4.5, isha: 14, combine: true}` (Ja'fari, Tehran). Maghrib is the sun at a 4.5° depression, not sunset. Isha is by angle (14°), not by minutes. Asr keeps shadow factor 1 when shown separately. Still Manama.
- **Combined:** with `combine` true the page shows 3 prayer chips and 3 blocks: "Fajr", "Dhuhr & Asr" (at Dhuhr time) and "Maghrib & Isha" (at Maghrib time). With `combine` false it shows 5.
- **Score and streak:** the day score counts 3 prayer items, not 5. The prayer streak means all 3 on time.
- **No Jumu'ah.** Friday is an ordinary "Dhuhr & Asr" day. The Friday grave visit stays.
- **Routine template** (`planFor`, also in `loop/design/monk-mode.html`): the separate Asr and Isha blocks are gone; "Dhuhr & Asr" lasts 25 min and "Maghrib & Isha" 25 min.
- **verify-logic** reads the expected Manama times from one table, within 1 minute:
  - 2026-10-22: Fajr 04:24, Dhuhr 11:22, Maghrib 17:20 (Isha 18:03)
  - 2026-12-06: Fajr 04:51, Dhuhr 11:29, Maghrib 17:04 (Isha 17:49)
  - 2027-01-15: Fajr 05:07, Dhuhr 11:47, Maghrib 17:25 (Isha 18:10)

### Amendment 2026-10-23, second message (owner): the routine and German
Relayed by the loop coordinator. `planFor` is replaced by this routine (and the reference's copy with it).
- **Prayers** (3 combined, Ja'fari Tehran): Fajr at Fajr, 15 min; "Dhuhr & Asr" at Dhuhr, 25 min, every day including Friday; "Maghrib & Isha" at Maghrib (4.5°), 25 min.
- **Daily blocks:** 05:30 Journaling (10) · 05:40 Meditation (20) · 06:00 Gym (90), once a day after Fajr · 06:00 German — Easy German podcast on Spotify (45), during the workout · 07:30 Brickford — Deep Track (180), fixed, straight after the gym · 10:30 Scripting (45) · 12:00 Working (120), "Editing — stream → clips" on Sun and Wed · 13:50 Post short-form (10) · 14:00 Nap (90) · 15:30 German — speaking (10) · 15:40 German — writing (10) · 15:50 Working (70) · 18:00 German — reading (25) · 18:25 Working (155) on Sun, Mon, Wed, Thu, Fri · 19:00 Stream (120) on Tue and Sat · 21:00 Reading (55) · 21:55 Plan tomorrow (5).
- Fridays add the grandmother grave visit at 08:00 (60). Sundays add the weekly review at 18:00 (30).
- **German on the page:** the single "German 1.5 h" toggle becomes 4 chips in one row, like the prayer chips: Podcast 45, Speak 10, Write 10, Read 25. German counts as done for the score and the weekly focus only when all 4 are ticked. Stored as `german: {podcast, speak, write, read}`.
- **Gym:** one session a day (the stepper stops at 1). The weekly target stays 5.
