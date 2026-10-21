# T-046 verification notes

Branch `loop/T-046-story-transcription`, cut from main at 8c2bbd1.

## The dependency, as pinned

### The library: verified
- **Pin:** `@huggingface/transformers@4.3.0`, imported as `https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0` (the constant `TX_LIB` in `platform/js/app.js`).
- **Source:** the npm registry, fetched on 2026-10-21 (registry.npmjs.org is reachable from this container; jsdelivr and huggingface.co are not).
  - Published `2026-09-16T04:31:30.600Z`, which matches the spec. `latest` is now 4.3.1; the spec pins 4.3.0.
  - Tarball `transformers-4.3.0.tgz`, sha1 `bd838fcd2f64b21dc79028a520f89af8b2dda41d` (checked against the registry's `dist.shasum`).
- **What the bare jsdelivr URL serves:** the package's `jsdelivr` field, `./dist/transformers.min.js`. That file was read from the tarball:
  - it is an ES module that bundles ONNX Runtime;
  - it has no bare-specifier imports (`transformers.web.js` has two, so it would not load in a browser);
  - so `import(TX_LIB)` works inside a module worker as the spec writes it.
- **What it fetches at runtime:**
  - ONNX Runtime's wasm from `https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.0-dev.20260914-8d85527a0/dist/ort-wasm-simd-threaded.asyncify.{mjs,wasm}`. That version is fixed by the library, and it is published on npm (shasum `b8b660a1ee7d75e6e65d5e8764c1d9d227f79847`).
  - The model files from `https://huggingface.co/<model>/resolve/<revision>/…` (`env.remotePathTemplate`). The `revision` passed to `pipeline()` is URL-encoded into that path, so a commit hash pins the bytes.
  - The browser's Cache API (`transformers-cache`) keeps both after the first download.
- **The API used:**
  - `pipeline("automatic-speech-recognition", model, { revision, dtype: "q8", device: "wasm", progress_callback })`. These option names are read from `pipeline2` in 4.3.0. `q8` is also the default for wasm, and selects the `*_quantized.onnx` files.
  - The call is `transcriber(pcm, { return_timestamps: true, chunk_length_s: 30, stride_length_s: 5, streamer })`, which returns `{ text, chunks: [{ text, timestamp: [start, end] }] }`.
  - `streamer` is only ever called as `streamer.put(ids)` and `streamer.end()`; `end()` runs once per generate call. The worker counts the `end()` calls for "Transcribing… n%".

### The prompt / initial-text option: NOT supported in 4.3.0
`WhisperGenerationConfig` declares `prompt_ids`, but nothing in 4.3.0 reads it:
- `generate()` has `// prompt_ids = null,` commented out;
- `_retrieve_init_tokens()` builds the decoder prompt from the language, the task and `<|notimestamps|>` alone;
- the processor has no `get_prompt_ids`.

Hand-building `decoder_input_ids` with `<|startofprev|>` would put the prompt tokens into the timestamp decoding path, which cannot be tested here without the real model. So no filler prompt is passed. As the spec allows, the transcript card carries the muted line "Whisper can miss 'um' and 'uh'." in every case.

### The model: NOT verified (blocker)
- **Network:**
  - `huggingface.co` cannot be reached: WebFetch returns `getaddrinfo ENOTFOUND huggingface.co` for both the API (`/api/models/<id>`) and the tree page, and curl gets a 403 from the proxy on CONNECT;
  - jsdelivr is blocked the same way.
- **So nothing is guessed:**
  - `TX_MODEL = "Xenova/whisper-base.en"` is a **candidate**. Whisper `base.en` is the class the spec names. The `Xenova/whisper-*.en` family is the one the 4.3.0 package's own ASR docs use (`Xenova/whisper-tiny.en`).
  - `TX_REVISION = "UNVERIFIED"`.
  - `TX_MODEL_MB = 75` is the spec's own "about 75 MB", and the consent prompt prints it.
- **verify-content fails** while `TX_REVISION` is not a 40-hex commit recorded in this file next to the model id.
- **To clear it** (the owner, or a session that can reach huggingface.co):
  1. Open `https://huggingface.co/api/models/Xenova/whisper-base.en`, or the onnx-community build if preferred.
  2. Take `sha`.
  3. Check that `onnx/encoder_model_quantized.onnx` and `onnx/decoder_model_merged_quantized.onnx` exist at that revision, and add up their sizes.
  4. Set `TX_MODEL`, `TX_REVISION` and `TX_MODEL_MB` in `platform/js/app.js`.
  5. Record all three here, with the date and the URL they were read from.

  Nothing else changes.

| field | value | source |
|---|---|---|
| model id | `Xenova/whisper-base.en` (candidate, unverified) | huggingface.co unreachable |
| revision | UNVERIFIED | huggingface.co unreachable |
| size | ~75 MB (the spec's estimate, unverified) | spec |

## Harness: why one Chromium flag
- **The problem:** a Worker cannot be constructed from a `file://` page. It throws a SecurityError, because the script "cannot be accessed from origin 'null'". This was measured in a probe before any test was written.
- **The fix:** the transcription contexts launch Chromium with `--allow-file-access-from-files`, in the same way T-028 added the fake-media flags.
  - With it, a module worker runs, and `ctx.route` intercepts the worker's `import()` of the pinned URL. This was measured as well.
  - The app is unchanged for the harness. On GitHub Pages (https) no flag is involved.
  - On a bare `file://` page the app shows the no-Worker line, which is the right behaviour.
- **The stub:**
  - It is served for exactly `https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0`.
  - Its `pipeline()` reports progress, then returns a transcriber. The transcriber busy-loops for 400 ms (the model's work, a long task on whichever thread runs it) and returns a canned `{ text, chunks }`.
  - It POSTs what it was asked for to `https://tx-stub.test/report`, which the harness answers itself. That covers the task, the model, the revision, the dtype and device, `Float32Array`, the length and the timestamps.
  - Every other https request is aborted, and huggingface.co requests are counted (0).

## Interpretations
1. **Progress wording.**
   - "Preparing the audio…" while the clip decodes.
   - "Loading the speech model… n%" while the library and model load. The spec has one line, "Transcribing… n%". After the first time the load reads from the browser cache, so "Downloading" would not be true.
   - "Transcribing… n%" while it runs. The n is coarse: it counts 30 s windows done, capped at 99 until the text is back, so a clip under 30 s reads 0% and then finishes.
2. **Consent is remembered on the device as `settings.transcribe`:**
   - "on" after Download;
   - "off" after Not now;
   - unset means ask.

   It is stored with `syncQuiet` (a press, but nothing about it syncs), and `syncPayload` still sends only `theme`, `dailyStart` and `streakFrom` from settings. A pull merges settings key by key, so it survives.
3. **"Turn on transcription"** clears the setting and asks again for the newest clip with no transcript. If every clip has one, it only clears the setting.
4. **Where the consent question sits:** above the list, not on the row. While transcription is off, rows do not offer Transcribe. One muted line, "Transcription is off on this device.", sits under the list with the control. That line is the "refused" case of the failure paths.
5. **No Worker / no WebAssembly / no OfflineAudioContext, or a Worker the page may not construct:**
   - the row says "This browser cannot run the speech model, so this one stays audio only.";
   - it offers no retry;
   - the consent question is not asked (nothing could be downloaded).
6. **Failures are kept in memory only.** The row offers Transcribe again (except the case above). Nothing is written for a failure: a clip with no speech gets no transcript field.
7. **No speech** is a transcript with no letters or digits once Whisper's bracketed or parenthesised tags (`[BLANK_AUDIO]`, `(silence)`) are removed.
8. **Words** are matched by `[A-Za-z0-9]+` with inner apostrophes and hyphens; the test counts by whitespace instead. **Words per minute** is `round(words × 60 / seconds)`, using the clip's stored `seconds`.
9. **Rules beyond "like" and "so".** "you know", "I mean", "kind of", "sort of" and "right?" also have context rules (documented above `FILLERS`), because counting "a kind of map" or "is that right?" would strike real words. The rules: "loose" means punctuation follows; "nodet" means not after a determiner; "tag" means "right" followed by "?" and preceded by a comma.
10. **The transcript stays open through a list refill.** `txOpen` remembers it in memory, so a background repaint does not fold a transcript that is being read.
11. **The worker URL carries the page's `?v=` token** (`TX_WORKER`); verify-content holds them equal.
12. **The mockup** (`specimen-practice-coach.png`) is untracked in the main checkout only, so it was viewed there and not copied. The transcript sits under its clip row, as a disclosure. The coach column belongs to T-047.
