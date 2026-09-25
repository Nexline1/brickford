# Lessons (read at the start of every run; max 60 lines; merge duplicates)

## Invariants from CLAUDE.md
- START_DATE (curriculum.js) is fixed. A date bug means fixing the arithmetic, never the date.
- Day 1094 = dateForStudy(1093) = 2030-03-19. The gate baseline addStudyDays(START,1094) = 2030-03-20. The one-day gap is intentional.
- REST_DOW = 6 (Saturday). If it changes, change nothing else; everything derives from it.
- Rest day: scheduledFor → [], streak steps over it, backlogCount skips it, dayStatus → "rest".
- The streak is derived, never stored. streakFrom merges by taking the LATER date. bestStreak ignores streakFrom.
- Refuse plan resets first, show the numbers, then obey a reaffirmation. Never refuse twice.

## Code
- app.js is one IIFE; nothing is exported. Tests drive the UI or use an explicitly spec'd hook.
- A render is a read: any persist during a render goes through syncQuiet, or it arms a network push that re-enters render.
- Background repaints use render({ background: true }). A repaint while a video is on screen destroys the iframe.
- summaryHTML injects prose raw, so no bare `<` before a letter in content (`\lt`, or `&lt;` for code).
- Bump every `?v=` cache token in platform/index.html when any JS/CSS/data file changes (sed the token).
- Tap targets 44x44 on phone widths. Measure with checkVisibility(), not the bounding box (closed <details>).

## Verification habits
- Check computed style, not screenshots. Then look at the rendered page anyway.
- Wait on proof (a marker gone, a value changed), never on a fixed duration.
- A settle condition is "changed, then stopped", not "nothing moving".
- A finding must survive a re-measure. A gate that has never failed is untested: plant the bug, watch it fail.
- Look at the whole window, not just .main (the sidebar once vanished with all gates green).
- KaTeX loads from a CDN that headless Chromium in the cloud may not reach, so raw `$…$` in screenshots can be the harness.
- The transcript tool truncates at 120k chars. Auto-captions come back tripled; dedupe first.
- Every harness context pins the clock and timezone (setFixedTime + timezoneId UTC); a gate that reads the real date passes only on the day it was written.
- A check's name must claim only what its fixture can violate: plant the exact bug the name promises to catch (a random draw can hide a whole layout, e.g. numeric answers).
