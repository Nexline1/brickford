# T-064: Brickford as a Flutter app (supersedes the T-051 CSS redesign)

## Context
The owner's new brief (4 Nov) replaces the "Apple design, page by page in CSS" task. They want Brickford rebuilt as a **Flutter/Dart app**. The brief, in order of authority:
- the owner's prompt;
- `skill_ui_blueprint.md` (repo root on main, added by the owner on 1 Nov);
- their reference images, which they will re-send.

The design system:
- a midnight `#12141C` canvas, with branding in the upper layer;
- a white sheet with 36px top-only corners and a `black12` blur-20 shadow;
- Playfair Display for display headings and Inter for everything else;
- `#F3F4F6` fields with 16px radius, no outline and a black45 prefix icon;
- flat pill buttons (elevation 0, radius 16);
- `flutter_screenutil` with a 375×812 design size;
- "Zero placeholders": every list is filled from the real `platform/data/*.js`.

Earlier rules from the owner still apply: barely any words on main screens, and visuals and buttons only.

Owner decisions:
- **Tabs:** Home (today, next up, calendar, Monk), Market (Treasury, earning offers, Problems/Exams as work), Community (Practice, Storytelling/Publish), Profile (Record, Proof, Courses/Atlas, sync/settings).
- **Platform:** Flutter **web** on GitHub Pages at `/app/` plus an **Android APK**. The current web app stays live until parity.
- **Delivery:** **in stages**, one PR per stage, each merged.

## Approach
**Location:** a new top-level `app/` folder holding the Flutter project. `platform/` (the current web app) is untouched.

**Toolchain:** install the Flutter stable SDK in the container (storage.googleapis.com and pub.dev are reachable). Dependencies are only what the brief names: `flutter_screenutil`, `google_fonts`, plus `shared_preferences` for local storage and `http` for GitHub sync. Google Fonts are bundled as assets so they work offline.

**Data, with no hand copying:**
- A node script `tools/export-data.js` loads `platform/data/*.js` in a VM, exactly as verify-content does, and writes `app/assets/data/*.json`.
- Those are the courses, lessons with YouTube ids and minutes, summaries/quizzes, workshop psets and labs, gates, and the storytelling course.
- A gate check fails if the JSON is stale against the JS, so the two can never drift.

**Engine, ported 1:1 from `platform/js/app.js`:** `lib/engine/` gets these functions with the same names:
- `studyIndex`, `dateForStudy`, `addStudyDays`, `REST_DOW`;
- `studyAnchor` (T-063);
- `scheduledFor` with `windowFor`, `packWindows` and `fixedWindows`;
- `lessonCleared`, `grandfathered` with `QUIZ_GATE_FROM`;
- `dayStatus`, `streak`, `bestStreak`, `backlogCount`;
- `revisionWeek`;
- `monkDay`, `monkScore` and `MONK_PRI`.

A **parity test** runs the JS functions (in node, over the existing app.js test hook) and the Dart port over the same fixtures and dates, and asserts identical output. That way the plan, the dates and day 1094 cannot silently change.

**State:** the same `S` shape, stored with `shared_preferences`, and synced through the **same GitHub file and mergeState rules**, so the web app and the Flutter app agree. `MONK_SYNCS` stays false, and Monk data stays on the device.

**Stages (one PR each, merged before the next):**
1. **Foundation + Home.**
   - pubspec, theme tokens and the blueprint's `SheetScaffold` (the Stack: midnight header + white 36px sheet).
   - `BrickfordField`, `PillButton`, and the 4-tab bottom bar.
   - Data export, the engine port with its parity test, and local state.
   - **Home** with real data: today's lectures with watched/quiz state, next up, the day count and Monk Day N of 21.
   - Lesson screen: video via a YouTube embed, mark watched, and the summary.
   - Deployed to `/app/`, plus an APK artifact.
2. **Calendar + day view**, which includes T-063's tick, half and empty states.
3. **Monk Mode** (Rhythm, rendered as persistent active badges).
4. **Profile:** Courses/Atlas, Record, Proof, and sync/settings (GitHub token).
5. **Market:** Problems, Exams, Treasury, earning offers.
6. **Community:** Practice, Storytelling.
7. **Offline** (service worker on web, plus cached assets), then a parity review. Then the owner decides whether `/app/` becomes the main site.

**Design input:** screen designs wait for the owner's re-sent reference images. Stage 1's infrastructure (export, engine and parity test) starts immediately, because it does not depend on them. Magic Patterns (connected) is used to mock a screen for approval when a reference is ambiguous. n8n is connected, but no backend task needs it yet, so nothing is wired to it in these stages.

## Critical files
- **New:**
  - `app/pubspec.yaml`
  - `app/lib/main.dart`
  - `app/lib/theme/`
  - `app/lib/widgets/sheet_scaffold.dart`
  - `app/lib/engine/*.dart`
  - `app/lib/screens/home/`
  - `app/assets/data/`
  - `tools/export-data.js`
  - `tools/verify-app.js` (export freshness + engine parity)
- **Read and port from:** `platform/js/app.js` (engine functions above; test hook `__brickfordTest`), `platform/data/*.js`.
- **Docs:** `loop/specs/T-064-flutter-app/spec.md`, the queue row, and CLAUDE.md, which gets one gate line for verify-app (PROTECTED; the owner's approval of this plan covers that line).

## Verification
- `flutter analyze` must be clean, and `flutter test` covers the widget tests for SheetScaffold, fields and pills: 36px top radius, `#12141C`, 16px radius, elevation 0.
- `node tools/verify-app.js`:
  - the JSON matches the JS;
  - for the engine parity, Dart and JS agree on `scheduledFor`, `dayStatus`, `streak` and `monkDay` for every day from 16 Oct 2026 to day 1094, plus the fixed fixtures (rest day, owner fixture);
  - plants (a changed rest day, a stale JSON) each exit 1.
- `flutter build web --base-href /app/` and `flutter build apk`. Playwright screenshots of `/app/` at 375×812, compared against the owner's reference images.
- The existing web gates all stay green, since `platform/` is untouched.

---
## Stage 2 (4-5 Nov, owner "continue"): Calendar + day view
Branch loop/T-064-flutter-2. Plan = the "Stage 2" section of the approved plan file; summary:
- Calendar screen: Sunday-first month grid on the white sheet; status per day = done (green tick) / part (half ring) / missed (red ring) / ahead (grey ring) / rest (muted) / gate (diamond); month chevrons + Today as round frosted buttons; Sunday seal tile from revisionWeek; tap a day = day view.
- Day view: bottom sheet with a drag handle; header (weekday, date, "Day N · Week W"); one row per scheduled lecture with glyph (tick = watched+cleared, half ring = watched, quiz pending, empty ring = not watched), short title, track, minutes; row opens the lecture screen. Past days use the frozen plan (reuse studyAnchor, T-063). Barely any words.
- Entry points: Home (chip/day count) and a Calendar button.
- Gates: flutter analyze clean; widget tests (grid status per day for a fixture; row glyphs match lessonCleared); verify-app gains a dayStatus parity block (Dart vs JS, every day Oct-Dec 2026, on a Saturday clock and a study-day clock); 375x812 screenshots (month, day sheet, a rest-day Saturday); taps >= 44; rebuild app-web/ via tools/build-app.sh; platform/, sw.js, CLAUDE.md untouched; re-run existing gates and report the pre-existing failures (offline Inter, design, density, clip on main) separately.

---
## Owner, 5 Nov: "I love it, but there's a lot of pages missing" → build in this order, minimise tokens, port the existing web pages into the new design (do not redesign logic)
Order: (3) Sync + Monk Mode; (4) quizzes + Problems/Exams; (5) Week/Sunday seal, Record, Proof, Treasury; (6) Atlas, Practice, Recall/Review, Drill, Electives, guide, transcript, then offline.
Token rules: one builder per stage, sonnet, no separate reviewer; I verify independently by script (analyze, tests, verify-app, verify-boot, scope diff) and merge. Port from platform/js/app.js, do not re-derive.
Stage 3 = sync (Profile > Sync: GitHub token + repo, push/pull of progress/brickford-state.json using the SAME mergeState rules, offline/latch rules as the web app; the token is never logged or shown) and Monk Mode (#/monk: priorities, day plan, 21-day map, Also section; MONK_SYNCS stays false, monk data never leaves the device).
