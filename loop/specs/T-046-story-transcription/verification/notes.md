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
