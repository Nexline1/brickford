# T-028 verification notes

Branch `loop/T-028-practice-recorder`, cut from origin/main at cc0d9ed. The CHECK is in `check/`, run on 33ef295 (`check/summary.txt` has one line per gate). Plants are in `plant-{a,b,c}.diff` and `plant-*-verify-*.txt`. Screenshots are `practice-*.png`, made by `shots.js`.

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
5. **Rest day.** The "Nothing owed today" card sits above the tabs, and recording works: the clip is kept. The rep is not logged, because the rep path's existing rest-day guard ("nothing owed") refuses it, as it always has. The toast says "Kept on this device. Saturday is a rest day — nothing logged."
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

## Plants (each restored; `cmp` of `platform/js/app.js` against HEAD is clean)
- **(a) The clip is not logged as a rep** (the `logRep("story", …)` call removed from the recorder): verify-flows exit 1, 4 FAIL.
  - At 390 and 1280: the "reps.story gains exactly one entry" check, and "the rep stays logged" after delete.
  - The first run of this plant timed out in the (p) wait, because that wait also waited for the rep. The wait now waits only for the clip's row, and the plant now fails the check that names it (commit 8acbcad).
- **(b) The audio written into localStorage state**, as a `data:audio/…;base64` URL on the rep:
  - verify-flows exit 1, 4 FAIL: the rep's keys, and "no audio anywhere in localStorage", each at 390 and 1280.
  - verify-sync-loop exit 1, 2 FAIL: the pushed rep's shape, and "no push carries audio".
- **(c) No fallback when `getUserMedia` rejects** (the `micGone()` in `recStart`'s catch removed): verify-flows exit 1, 8 FAIL.
  - The named (q) check "the fallback line and the manual form appear" fails at 390 and 1280, for both "permission denied" and "no device".
  - In each case the hand-logging step after it then fails as a harness error, because the form it fills is not there.

## Found, not fixed
- At 390 the clip's title field is ellipsized (for example "Story · Tue 20 …"), because the row also carries download and delete. The full title is in the field, and the meta line under it shows the date.
- `MediaRecorder` delivers its data only on stop. A tab closed mid-recording loses that recording, and the rep is not logged. A timeslice would bound the loss but would not save it.
- verify-contrast's fixtures have no clips in IndexedDB, so it never measures a list row or the recording state.
  - The row inks are pairs already used elsewhere (`--ink`/`--ink-2` on `--surface`).
  - The recording state changes only the disc's shape, not any ink.
- Only Chromium was exercised. Safari's `MediaRecorder` writes `audio/mp4`; the download name follows the Blob's type (`.m4a`), but that path is untested.
- The older blocks of verify-sync-loop still use fixed `waitForTimeout` waits and an unpinned clock. They predate this item and were not touched. The new T-028 block pins the clock and waits on proof.
