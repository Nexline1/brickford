# T-028 verification notes

Branch `loop/T-028-practice-recorder`, cut from origin/main at cc0d9ed. The CHECK is in `check/` (`check/summary.txt` has one line per gate and the commit it ran on). Plants are in `plant-{a,b,c}.diff` and `plant-*-verify-*.txt`. Screenshots are `practice-*.png`, made by `shots.js`.

## Harness: file://, no server
I measured this before writing any test (probe in the scratchpad, not committed). On `file://`, headless Chromium treats the page as a secure context, and `getUserMedia`, `MediaRecorder` and IndexedDB all work. Launched with `--use-fake-ui-for-media-stream --use-fake-device-for-media-stream`, it records `audio/webm;codecs=opus`. So no static server was needed, and the app was not changed to suit the harness.
- **Fake microphone:** verify-flows (p) and verify-sync-loop launch a second Chromium with those two flags. The existing browser in each gate is unchanged.
- **No microphone, two cases:**
  - (q) "permission denied": an init script replaces `getUserMedia` with a function that rejects with `NotAllowedError`.
  - (q) "no device": the plain Chromium with no flags, which has no device and rejects with `NotFoundError`.
- **Fixed clock:** every new context pins the clock to Tue 20 Oct 2026 in UTC (the Saturday case uses Sat 24 Oct). The recorder times itself with `performance.now()`, because the fixed clock freezes `Date.now()` while `performance.now()` still moves (measured).
- **No new `page.reload`:** nothing new reloads a page, so nothing new needs `acrossReload`.

## Deviations and interpretations
1. **The red is the theme's `--bad` in both themes**, not #ff453a. The spec says "#ff453a or the theme's --bad if that has better contrast". Measured on the card, `--bad` does better in both themes:
   - Dark: #e8705c, 5.59:1 on #1c1c1e, against 4.99:1 for #ff453a.
   - Light: #b32d1f, 6.34:1 on white, against 3.41:1 for #ff453a.

   So by the letter of the spec, #ff453a is never used. In Dark this gives a coral red rather than the mockup's #ff453a. verify-design measures the rule rather than assuming it.
   - **To restore #ff453a in Dark:** add one token to the CSS and change the verify-design check that pins the red to `--bad`.
2. **The ring is `--ink`.** That is white (#ffffff) in Dark, as the spec says. In Light it is near-black (#111111, 18.9:1), because a white ring on Light's white card would not be visible.
3. **Default tab when several kinds are due.** The recorded kinds come first: Story, then Humour, then Story bank. If nothing is due, the default is Story.
   - The bank is owed every study day, so on an ordinary weekday before it is logged the page opens on Story bank. On Friday, or once the bank is logged, it opens on Story.
   - verify-design checks five such days.
4. **The monthly review keeps its card above the tabs when it is due.** The spec gives it no tab. Without the card it could never be logged, which is what `repsDue`'s own comment warns about.
5. **Rest day.** The "Nothing owed today" card sits above the tabs, and recording works: the clip is kept. The rep is not logged, because the rep path's existing rest-day guard ("nothing owed") refuses it, as it always has. The toast says "Kept on this device. Saturday is a rest day — nothing logged." Since review 1 no Log button is drawn on a rest day (finding 7).
6. **The recorded reps go through one function, `logRep`, which the hand forms now use too.** It does the same push and `logEvent` as before.
   - **Story from the recorder:** `{ date, seconds, takes: 1, from: <title> }`, the shape the hand form stores.
   - **Humour from the recorder:** `{ date, attempts: <the five fields, usually empty>, keeper, seconds }`. `seconds` is a new optional field on humour entries; nothing that reads humour reps depends on it.
   - **History:** a recorded humour rep reads "Humour rep, recorded · m:ss".
   - Nothing stored is dropped or rewritten.
7. **Story's hand form is shown only when the microphone is unavailable,** as the spec scopes it. With a working microphone, a story rep is logged by recording it. Humour keeps its five fields, folded, under the recorder.
8. **Renaming changes IndexedDB only.** The rep's `from` keeps the title it had when it was recorded.
9. **Delete removes the clip and keeps the rep.** The confirm says so.
10. **The recording stops (and the clip is kept) when you leave `/practice` or switch tab while recording.** This keeps the microphone from staying open behind another page.
11. **The header.**
    - The page drops `folio("Practice")` for `.page-head h1`, as the T-026a/b/c pages did.
    - The "Clear for today" card and its streak line are gone, replaced by the tabs.
    - "Logged so far" (the counts) and the history are folded into one disclosure under the list.
12. **The mockup's waveform is decorative.** It is a static pattern in `--line-strong`, not the clip's real waveform, and it is hidden under 768px. The play button is 44px (the mockup's is 34) to meet the 44×44 rule. Download and delete, which the spec requires but the mockup does not show, are 44×44 icon buttons.
13. **`window.__recLimit` is read at each recording start, only when it is defined.** It is not gated behind `#/__test`, which the spec does not ask for.
14. **IndexedDB is created the first time `/practice` lists recordings.** That is not app state, and nothing is saved or synced.
15. **If the IndexedDB write fails, the rep is still logged** and the toast says the recording could not be kept.
16. **Under a second is not a rep** (review 1, finding 3): nothing is kept or logged.
17. **A second press while the microphone prompt is open cancels the start** (review 1, finding 2).
18. **`logEvent` round-trips its data through JSON before hashing** (review 1, finding 1). This is in `app.js`'s chain code, outside `V.practice`; it changes no existing hash.

## Plants (re-run on 09f95e4 after review 2, with the same counts as after review 1; each restored, `cmp` of `platform/js/app.js` against HEAD clean)
- (a) the clip not logged as a rep (`logRep("story", …)` removed from the recorder): verify-flows exit 1, 6 FAIL — "reps.story gains exactly one entry" and "the rep stays logged" after delete, at 390 and 1280, and the track-ended case's rep and chain checks. (Round 0's first run of this plant timed out in the (p) wait, which also waited for the rep; the wait now waits only for the clip's row, so the plant fails the check that names it — 8acbcad.)
- (b) the audio written into localStorage state, as a `data:audio/…;base64` URL on the rep: verify-flows exit 1, 4 FAIL (the rep's keys, and "no audio anywhere in localStorage", at 390 and 1280); verify-sync-loop exit 1, 2 FAIL (the pushed rep's shape; "no push carries audio").
- (c) no fallback when `getUserMedia` rejects (the `micGone()` in `recStart`'s catch removed): verify-flows exit 1, 9 FAIL — the named (q) check at 390/1280 for denied and no device; each then fails as a harness error where hand-logging cannot find the form, and the Saturday no-microphone case cannot reach its fallback.

## Review round 1 (8 findings) — what changed, and the new checks put against the round-1 bytes
`review1-bugs-back/`: HEAD's gates run with `platform/js/app.js` and `platform/css/style.css` put back to d950640 — verify-flows 10 FAIL, verify-sync-loop 3 FAIL, verify-design 11 FAIL; every new check fails there; restored, `cmp` clean.
1. A recorder that stops by itself (track ended, device lost, error) finishes through `recFinish`, exactly once: stopped, the interval cleared, seconds computed from the elapsed time, the tracks released, then `recSaved`. `onstop` and `onerror` both reach it. `logEvent` now hashes its data as it will be stored (a JSON round trip), so an `undefined` (or `NaN`) can never make the chain unverifiable after a reload; for data without either, the round trip is the identity and every existing hash is unchanged. Check: verify-flows ends the captured tracks at 0:02 — one clip, a rep with numeric `seconds` equal to the clip's, the button idle, the next recording runs its full 3 of 3 s, and after a proven reload (`acrossReload`) /record reads "newest first".
2. `recStart` re-checks after `await getUserMedia`: if `rec` is no longer the pending start, the route is not /practice, or the button on screen is another kind, the stream is released and nothing starts. A second press, a tab switch or a hashchange (a listener registered before the router's) cancels a pending start. While the prompt is open the button is `aria-busy`, labelled "Starting the microphone — press to cancel", the disc shrinks, and the timer reads "Starting…". Check: `getUserMedia` held 1.5 s; leave, and pick Humour, during it — every track ended, no clip, no rep, nothing written, the button idle.
3. Under 1 s of audio, or no chunks, keeps nothing and logs nothing; the toast says "Under a second — nothing kept." Check: a double tap 30 ms apart, and a stop 150 ms into a recording.
4. `render({ background: true })` is deferred while `rec` is set (recording, or the prompt open) or any `#view audio` is playing (`mediaBusy`), as it is for the video. Check (verify-sync-loop): a remote with something new on every GET makes the push merge and ask for a background repaint (its toast is the proof); during playback the `<audio>` is the same element, attached and playing; during a recording the button is the same element, recording and focused, and the recording then finishes.
5. `.card.pr-card.pr-hand` (three classes; one was a dead rule). Check: `#bankWhat`/`#bankWhy` and the no-microphone Story form fill the card's content box within 1px at 390 and 1440, both themes.
6. Below 600px the title takes the row beside play and download/delete wrap under it; the phone row gives the title 8px more (the new check caught "Humour · Wed 30 Sep" at 208/202 at 320 first). Check: three default titles, the widest weekday and month, whole at 320 and 390 (`scrollWidth <= clientWidth`), the icons clear of the title, every control 44×44.
7. Rest day: Story bank and the no-microphone panes draw no Log button and no fields, only "Nothing owed today."; Humour's written fold is not drawn; the recorder stays. Check: verify-design (all three tabs, Saturday) and verify-flows (Saturday, permission denied).
8. verify-flows tests the key name before `getItem`: no gate calls `getItem("brickford_gh_token")`.
Also: the story-bank screenshot is retaken after its tab's transition has finished (taps, then waits for the animations); tokens are `20261014a`.

## Review round 2 (3 findings)
1. **The full-length check could never fail.** It now sets `window.__recLimit = 3` before the first press, ends the track at about 2 s, and starts the second recording as soon as the first recording's row appears. A leaked timer from the first recording would call `recStop` 3 s after the first press, which is inside the second recording.
   - **Timer plant** (only `clearInterval(r.tick)` removed from `recMark`, `plant-timer.diff`): verify-flows exits 1. The second recording is cut short (under a second, so nothing is kept). Restored; `cmp` clean.
2. **Deferred, not lost.** `mediaBusy` now also counts a clip that has started and not finished: `!a.paused || (a.currentTime > 0 && !a.ended)`.
   - A background render skipped for the video or the Practice page sets `bgSkipped`. Any render that runs clears it.
   - `bgReplay()` runs the skipped render once the page is free. It is called from:
     - the clip's `ended` listener;
     - the cancel branch of `recStop`, and the post-prompt cancel in `recStart`;
     - `recSaved` when it ends away from /practice;
     - `micGone`;
     - the list refill.
   - The `render` comment now says how the deferral is kept.
   - **verify-sync-loop checks:**
     - (3) Pause mid-clip, then a merged push: the `<audio>` is the same element, at the same `currentTime`.
     - (4) Play the clip to its end: the view's "N logged" equals storage.
     - (5) A merged push lands while the prompt is open, which leaves the view behind; cancelling the prompt brings it up to date.
3. **`mr.start()` throwing.** The call is wrapped in try/catch. On failure the tracks are released, `rec` is cleared, and `micGone()` shows the hand form. verify-flows covers it by stubbing `MediaRecorder.prototype.start` to throw, then checking:
   - the hand form appears;
   - no track is live;
   - nothing is logged or written;
   - there are no page errors.

**Old-bytes runs (`review2-bugs-back/`).** The new checks were run against 4425778's `app.js`:
- verify-flows exits 1: the start-throws case fails, plus "no page errors".
- verify-sync-loop exits 1: (3), (4) and (5) fail.
  - On the old app the paused `<audio>` is detached, so (3) fails, and the view caught up through that very render.
  - (4) then fails because the detached element never ends.

Restored; `cmp` clean. Tokens are now `20261014b`. The screenshots are unchanged from review 1, because round 2 changed no CSS and nothing that is drawn.

## Review round 3 (1 finding)
**The finding.** `bgReplay()` ran inside its caller. Under reduced motion it re-rendered `#view` synchronously in the middle of the tab handler. The handler then compared the new buttons against its old `b`, so no tab was left pressed. On the hashchange path the same thing made leaving the page render twice.

**The fix.**
- `bgReplay()` now always queues its check, with `setTimeout(…, 0)`. That covers every call site.
- The tab handler sets `practiceTab` before `recStop()`. It works on the `#view` that is on screen and marks the pressed tab by value.

**The checks (verify-sync-loop, reduced motion).** Both start with the prompt open and a merged push whose repaint has waited.
- (6) Pick Humour: exactly one tab is pressed, it is Humour, and Humour's recorder is on screen.
- (7) Leave /practice: the view is swapped once.

**Against 8a735bf's `app.js`** (`review3-bugs-back/`): verify-sync-loop exits 1.
- (6) no tab is pressed;
- (7) the view is swapped twice.

Restored; `cmp` clean. Tokens are now `20261014c`.

## Found, not fixed
- `MediaRecorder` delivers its data only on stop. A tab closed mid-recording loses that recording, and the rep is not logged. A timeslice would bound the loss but would not save it.
- verify-contrast's fixtures have no clips in IndexedDB, so it never measures a list row or the recording state.
  - The row inks are pairs already used elsewhere (`--ink`/`--ink-2` on `--surface`).
  - The recording state changes only the disc's shape, not any ink.
- Only Chromium was exercised. Safari's `MediaRecorder` writes `audio/mp4`; the download name follows the Blob's type (`.m4a`), but that path is untested.
- The older blocks of verify-sync-loop still use fixed `waitForTimeout` waits and an unpinned clock. They predate this item and were not touched. The new T-028 block pins the clock and waits on proof.
