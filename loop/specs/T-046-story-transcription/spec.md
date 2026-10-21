# T-046: transcribe story recordings on the device

## Source
The owner, 2026-10-14: "make sure… the audio recorder is recording the stories as audio and transcribing them as text too."

The owner chose transcription on the device (`loop/inbox.md`, 2026-10-14). The speech-to-text model runs in the browser after a one-time download, and the audio never leaves the device. That choice approves the dependency named below.

The mockup is `loop/design/specimen-practice-coach.png`. Its left card is the transcript, with fillers struck through and filler chips.

## Depends on
T-028, which is merged: clips live in IndexedDB `brickford_audio` / `clips`.

## The dependency (approved, pinned)
- **The library:** `@huggingface/transformers@4.3.0` (published 2026-09-16), loaded on demand with `import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0")`. Load it inside a **module Web Worker**, so the page never freezes. Never load it at page load.
- **The model:** an English Whisper ONNX build, the smallest that is good enough, `whisper-base.en` class (about 75 MB). Before pinning it:
  - verify the exact model id and pin its **revision** (commit hash), using the model page fetched with WebFetch;
  - record the id, the revision and the size in `verification/notes.md`.
- **Consent before the download.** The first use asks "Download the speech model (~N MB, once)? It runs on this device; your audio never leaves it." Show the size, plus Download / Not now. After that, the browser's cache keeps the model.

## Scope (`platform/js/app.js`, a new `platform/js/transcribe-worker.js`, `platform/css/style.css`)
1. **Transcribing a clip.**
   - **When it happens:** after a Story or Humour clip is saved, or from a "Transcribe" control on any existing clip row.
   - **How:** decode the Blob to 16 kHz mono PCM on the page with `OfflineAudioContext`, post it to the worker, and get back `{ text, chunks: [{ text, timestamp }] }`.
   - **While it runs:** a quiet "Transcribing… n%" line on the clip row. Nothing blocks.
   - **Where the result goes:** stored on the clip's IndexedDB record as `transcript: { text, chunks, model, at }`.
   - **It never goes to localStorage, the sync payload or the chain.**
2. **Fillers.**
   - Mark filler words and phrases in the transcript with a deterministic list in `app.js` (`FILLERS`). The list includes: um, uh, er, ah, like (as a filler, not "I like"), you know, basically, actually, literally, I mean, kind of, sort of, so yeah, right? (as a tag), okay so.
   - Use simple context rules for "like" and "so". Document them, and test them with fixtures such as "I like it" (not a filler) and "it was, like, huge" (a filler).
   - **Show:** fillers struck through and tinted, with chips that give the total and each word's count, as in the mockup. Also show words and words per minute from `seconds`.
   - **Be honest about um/uh:** Whisper often drops "um" and "uh". Try the library's prompt or initial-text option, seeded with fillers, if 4.3.0 supports it. Either way, the transcript card carries one muted line: "Whisper can miss 'um' and 'uh'."
3. **The clip row** gets a transcript disclosure that opens the transcript card. The card's text is selectable, and there is a Copy button.
4. **Failure paths.**
   - These cases each show one muted line and leave the recording intact:
     - no WebAssembly or Worker;
     - the download fails or is refused;
     - out of memory;
     - a clip with no speech.
   - "Not now" is remembered on the device, in `settings` but outside the sync payload. A small "Turn on transcription" control can bring the prompt back.
   - **A render is a read:** nothing starts transcribing or downloads because a page rendered.
5. **Bump every `?v=` token**, including for the new worker file.

## Tests (the harness has no network, so stub the library)
- **The stub:** in verify-flows, route the pinned jsdelivr URL to a fake module whose `pipeline()` returns a canned transcript, with chunks and fillers, after a short delay.
- **The checks:**
  - record a clip with the fake microphone;
  - consent;
  - the transcript is stored on the IndexedDB record and nowhere else;
  - fillers are marked;
  - the counts and words per minute are right;
  - copy works;
  - "Not now" is remembered;
  - the failure path shows its line;
  - there are no page errors.
- **Plants, each exiting 1:**
  - (a) the transcript is written into localStorage or the sync payload;
  - (b) "I like it" is counted as a filler;
  - (c) the model download starts without consent;
  - (d) the transcription runs on the main thread (detected by a long task over 200 ms during the stubbed run).
- **verify-sync-loop:** no transcript text in any push.
- **verify-design** at 1440 and 390, both themes: the transcript card, the chips (≥ 4.5:1 contrast, struck-through text included) and the 44px controls.
- **All gates green**, plus clip under the LA timezone.

## Out of scope
- The coach (T-047).
- Syncing transcripts between devices.
- Languages other than English.
- Changes to Story bank.
