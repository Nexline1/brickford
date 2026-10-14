# T-028: Practice — record yourself

Source: owner, 2026-10-07.
- "The practice is not clear enough. Maybe you should add an audio thing, an audio button where I can record myself."
- "It's just a lot of text."

The owner approved `loop/design/specimen-practice.png` ("Yes, all four"). The owner also accepted that recordings stay on the device that made them.

## Scope (`V.practice` and helpers in `platform/js/app.js`)
1. **Header.** `h1` "Practice", with the line "Speak it out loud. Recording yourself is the practice." On the right: the existing week dots, plus "x of 6 days this week".
2. **Segmented control: Story · Humour · Story bank.**
   - It is in memory only, never saved.
   - It defaults to the kind due today; if nothing is due, Story.
3. **Story tab.**
   - A card with the prompt "Tell one story from this week" and "Under 90 seconds. Beginning, turn, ending."
   - **The record button.** It is at least 88px and red (`#ff453a` or the theme's `--bad` if that has better contrast). It sits inside a white ring with an `aria-label` and works from the keyboard.
   - Pressing it calls `navigator.mediaDevices.getUserMedia({audio:true})` and starts a `MediaRecorder`.
   - While recording, the button morphs to a rounded square, and the timer shows `m:ss / 1:30`.
   - It stops on a second press, or automatically at 1:30.
   - On stop:
     - the Blob is stored in **IndexedDB** (database `brickford_audio`, store `clips`, key `<date>-<n>`), with its metadata `{date, seconds, kind, title}`;
     - the existing story rep is logged through the same function the current form uses (`reps.story` with `date` and `seconds`), so streaks and counts keep working;
     - the title defaults to "Story · <weekday d Mon>" and can be renamed inline.
   - **No microphone, permission denied, or no MediaRecorder:** the card shows one line ("Microphone not available, so log it by hand") and the existing manual form. Nothing breaks.
4. **Humour tab.** The same recorder with the prompt "Five attempts at one joke", logged through the existing humour rep path. The 5-attempt text fields stay available beneath it, collapsed.
5. **Story bank tab.** The existing two-field form ("what happened" / "why it stuck") and its Log button, unchanged.
6. **"Your recordings — kept on this device."**
   - The list comes from IndexedDB, newest first: a play button (an `<audio>` element, created on demand), the title, the date, and the duration.
   - Each recording can be deleted, after a confirm.
   - Each recording can be downloaded (an anchor with an object URL), so a recording can be moved to another device by hand.
7. **"Logged so far" and the history** sit behind a disclosure under the list.
8. **Never sync audio.** It is never written to localStorage or the GitHub payload. `syncPayload` is unchanged, and verify-sync-loop stays green.
9. **Rest days** keep their "Nothing owed today" card above the recorder. Recording is still allowed.
10. **Bump every `?v=` token.**

## Out of scope
- Syncing audio between devices.
- Transcription.
- Video.
- New dependencies.
- PROTECTED paths.

## Acceptance criteria
1. **verify-flows**, in a Chromium context launched with `--use-fake-ui-for-media-stream` and `--use-fake-device-for-media-stream`:
   - press record, wait about 2s, then stop;
   - one clip is in IndexedDB with `seconds` ≥ 1;
   - `reps.story` gains exactly one entry for today;
   - the recordings list shows it, and its `<audio>` has a blob src;
   - delete removes it;
   - the auto-stop at 1:30 is tested with a shortened limit through a test hook. If one is needed, it is `window.__recLimit`, read only when defined.
2. **verify-flows, no microphone** (permissions denied): the fallback line and the manual form appear, and logging by hand still works.
3. **verify-sync-loop:** the pushed payload contains no audio and no `brickford_audio` data.
4. **verify-design, 1440 and 390, both themes:** the record button is 88px or more and centred in its card, its contrast passes, and the segmented control has 3 options.
5. **Plants, each exiting 1:**
   - (a) the clip is not logged as a rep;
   - (b) the audio blob is written into localStorage state;
   - (c) the fallback is missing when `getUserMedia` rejects.
6. **All gates green.** Screenshots at 1440 and 390, in Dark and Light, including one taken mid-recording.
