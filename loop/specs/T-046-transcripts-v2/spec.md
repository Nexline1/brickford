# T-046 v2 — Story transcripts: record on the phone, transcribe on the laptop (owner, 15 Nov: "Do this")

Freeze exception granted by the owner for this feature. Read FIRST:
- the original spec + 23 Oct amendment: `git show c619f38:loop/specs/T-046-story-transcription/spec.md`
- the October implementation on branch `loop/T-046-story-transcription` (c619f38; worker, FILLERS + context rules, transcript card, consent, failure paths, verify-flows / verify-sync-loop / verify-design / verify-content blocks, plants (a)-(d), notes.md with the library research). `git diff 8c2bbd1 c619f38 -- platform tools` shows the code.
- the plan section "T-046: story transcripts" in this file's sibling plan is summarised here.

## Port, don't merge
The October branch is 3 weeks behind main (app.js changed a lot: T-053 private sync `SYNC_REPO = "Nexline1/brickford-private"`, Plan v2, practice, checkpoints). Start from main (this branch) and port the October code by hand. Keep every October check and plant.

## What the owner gets
1. Records a Story/Humour clip on the phone, in the Flutter app's Practice recorder (T-064 6b) or the phone website, as now. After save, the clip uploads to the private repo `SYNC_REPO` at `audio/<clip key>.<ext>` (Contents API PUT, base64, existing sync token). Clip record gets `remote: {sha, at}`. On failure one muted line: "Audio stays on this device until your token can reach brickford-private"; retry on the next Practice open, never in a loop, never during a render (a render is a read).
2. On the laptop ("desktop" = `matchMedia("(pointer: fine)").matches` and viewport >= 1024px), Practice lists `audio/` in the private repo and downloads clips it lacks into IndexedDB `brickford_audio`/`clips` in the same record shape; they show with **Transcribe**.
3. First Transcribe asks consent: "Download the speech model (~N MB, once)? It runs on this device; your audio never leaves your devices and your private repo." N = the real size of the files the pipeline will fetch.
4. Transcript card as October: text, fillers struck through + chips with counts, words and words per minute, Copy, the muted "Whisper can miss 'um' and 'uh'" line.
5. Transcripts live only in the laptop's IndexedDB record; never localStorage, the sync payload, the chain, or the private repo. The phone never shows Transcribe and never imports the library.

## Model and library (pinned)
- Library `@huggingface/transformers@4.3.0` via jsdelivr, in a module worker (October research in notes.md stands; re-check nothing).
- Model `onnx-community/whisper-large-v3-turbo`, revision `360ebcde2559d60bb474678be3c1de9ef347d01a` (read from https://huggingface.co/api/models/onnx-community/whisper-large-v3-turbo on 15 Nov; huggingface.co is now reachable from this container). Confirm with the API: the dtype the worker requests (q8 = `*_quantized.onnx`, or whatever 4.3.0 maps q8 to) exists at that revision, and sum the real byte sizes of every file the pipeline fetches for that dtype (HEAD or the API's `?blobs=true`) for the consent text. Record id, revision, dtype, files and sizes in `verification/notes.md`. verify-content's TX_REVISION pin check must pass.

## Flutter app
The recorder uploads after save to the same path with the same failure line (reuse the Dart sync client and token). No transcription on the phone. verify-app parity: both apps build the same upload path for the same clip key; neither sync payload carries a transcript or audio.

## Gates (TZ=America/Los_Angeles; long gates detached with setsid nohup, poll)
verify-content, verify-logic, verify-sync-loop, verify-shell, verify-flows, verify-contrast, verify-clip (0 new / 1 stale / 588 known), verify-design only if October added checks there (it fails on main for old reasons: report, don't fix), flutter analyze/test (/opt/flutter/bin), verify-app, tools/build-app.sh, verify-boot (then git checkout + git clean loop/specs/T-064-flutter-app/shots).
Flows (stub the library and the GitHub API; no network): phone width never shows Transcribe nor imports the library; record -> upload PUT to SYNC_REPO audio/ only -> desktop pulls a stubbed remote clip -> consent -> transcript in IndexedDB only -> fillers, counts, wpm, copy; Not now remembered; every failure line.
Plants, each exit 1 and restore byte-identically: (a) transcript in localStorage/payload, (b) "I like it" counted as filler, (c) download without consent, (d) transcription on the main thread, (e) upload during render, (f) upload to the public repo, (g) model import on the phone.

## Scope
platform/js/app.js, platform/js/transcribe-worker.js (new), platform/css/style.css, platform/index.html (?v=), app/lib (recorder upload), app/test, tools/verify-*.js touched by the checks, app-web/, this folder, loop/lessons.md (one lesson). Bump every ?v= token.
