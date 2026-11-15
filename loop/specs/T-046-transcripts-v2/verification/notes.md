# T-046 v2 verification notes

Branch `loop/T-046-transcripts-v2`, cut from main at 27fbbed. The October branch
(`loop/T-046-story-transcription`, c619f38) was ported by hand, not merged.

## The library (October research stands; not re-checked beyond the two facts below)
- `@huggingface/transformers@4.3.0`, imported as `https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0`
  (`TX_LIB` in `platform/js/app.js`). The tarball fetched from registry.npmjs.org on 2026-11-15 has
  sha1 `bd838fcd2f64b21dc79028a520f89af8b2dda41d`, the same as October's.
- Read from that tarball's `dist/transformers.js`, for the size below:
  - `DEFAULT_DTYPE_SUFFIX_MAPPING[q8] = "_quantized"`, so `dtype: "q8"` loads `onnx/<session>_quantized.onnx`.
  - Whisper is `MODEL_TYPES.Seq2Seq`: sessions `encoder_model` and `decoder_model_merged`, optional config
    `generation_config.json`.
  - `resolveExternalDataFormat(config, "encoder_model_quantized.onnx", "encoder_model")`: this model's
    `transformers.js_config.use_external_data_format` names only `encoder_model.onnx` (the fp32 file), so the
    quantized encoder has **no** `.onnx_data` file to fetch.
  - The ASR task is type `multimodal`, so the tokenizer (`tokenizer.json`, `tokenizer_config.json`) and the
    processor (`preprocessor_config.json`; `WhisperProcessor` does not use `processor_config.json` or a chat
    template) are loaded.
  - ONNX Runtime's wasm comes from `https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.0-dev.20260914-8d85527a0/dist/`
    as `ort-wasm-simd-threaded.asyncify.{mjs,wasm}` (sizes read from that npm tarball, shasum
    `b8b660a1ee7d75e6e65d5e8764c1d9d227f79847`).
  - Whisper large-v3-turbo is multilingual. The worker passes `language: "english", task: "transcribe"`
    (`_retrieve_init_tokens` reads both; without them 4.3.0 warns and defaults to English anyway).
  - The prompt / initial-text option is still not wired in 4.3.0 (October's finding), so the card always
    carries "Whisper can miss 'um' and 'uh'."

## The model: pinned
Read on 2026-11-15 from `https://huggingface.co/api/models/onnx-community/whisper-large-v3-turbo`
(`sha` = the revision below, lastModified 2025-03-06T17:18:13Z) and
`https://huggingface.co/api/models/onnx-community/whisper-large-v3-turbo/revision/360ebcde2559d60bb474678be3c1de9ef347d01a?blobs=true`
(every file's size). Each file below was also HEAD-requested at
`https://huggingface.co/onnx-community/whisper-large-v3-turbo/resolve/360ebcde2559d60bb474678be3c1de9ef347d01a/<file>`
and its `x-linked-size` matched the API.

| field | value |
|---|---|
| model id | `onnx-community/whisper-large-v3-turbo` |
| revision | `360ebcde2559d60bb474678be3c1de9ef347d01a` |
| dtype | `q8` (files `*_quantized.onnx`), device `wasm` |

What the pipeline fetches for that dtype, and from where (verify-content sums the `bytes` column and holds
`TX_MODEL_MB` to it):

| file | bytes |
|---|---|
| `config.json` | 1332 |
| `generation_config.json` | 3897 |
| `preprocessor_config.json` | 340 |
| `tokenizer.json` | 2480617 |
| `tokenizer_config.json` | 282843 |
| `onnx/encoder_model_quantized.onnx` | 644822195 |
| `onnx/decoder_model_merged_quantized.onnx` | 439936716 |
| `transformers.min.js` (the library, jsdelivr) | 581935 |
| `ort-wasm-simd-threaded.asyncify.mjs` (ONNX Runtime, jsdelivr) | 53057 |
| `ort-wasm-simd-threaded.asyncify.wasm` (ONNX Runtime, jsdelivr) | 26861777 |

Total 1,115,024,709 bytes: **~1115 MB** (decimal), which is what the consent question prints
(`TX_MODEL_MB = 1115`). The model files alone are 1,087,527,940 bytes. The October amendment's "about 800 MB"
was an estimate; the real q8 build is bigger, and the prompt says the real number.

For the record, not used: q4 would be 424,942,775 + 334,147,222 bytes (~759 MB of model). The spec pins q8.

## The harness (as October)
- A module Worker cannot be made from a `file://` page without `--allow-file-access-from-files`, so the
  transcription contexts launch Chromium with it; nothing in the app depends on it.
- The pinned library URL is routed to a stub module; huggingface.co, jsdelivr and api.github.com are never
  reached (GitHub is answered by the harness's own stub).
- "Desktop" in the harness is a 1280px context without touch (`(pointer: fine)` matches); "phone" is 390px
  with `hasTouch` and `isMobile` (`(pointer: coarse)`).

## Interpretations (v2)
1. **Upload on save** goes to `https://api.github.com/repos/Nexline1/brickford-private/contents/audio/<key><ext>`
   (`SYNC_REPO`; ext from the Blob's type, the same `clipExt` the Download link uses). A 422 (the file is
   already there, e.g. a response lost on the way back) is answered by reading that path's sha, so it is not a
   failure. No token: nothing is tried and nothing is said (sync is not set up on that device).
2. **Retry**: every local clip with no `remote` is tried once per Practice open (the route arriving at
   /practice, by navigation or at boot), never from a render, never on a timer. A failure is remembered in
   memory and shows one muted line under the list.
3. **Desktop pull** (on the same Practice open, desktop only): `GET .../contents/audio?ref=main`; every
   `<date>-<n>.<ext>` file whose key is not in IndexedDB is fetched with `Accept: application/vnd.github.raw`
   and stored as `{ date, seconds, kind, title, blob, remote: { sha, at } }`. The date comes from the key; the
   seconds from decoding the audio (rounded, at least 1); the kind and title from the synced rep of that date
   with the nearest seconds (a story rep carries its title as `from`), else Story. A list that is not an array
   (no `audio/` folder yet, or anything else) is nothing to pull.
4. **The phone** is everything that is not desktop. It never draws Transcribe, the consent question or the
   off line, never makes a Worker and never imports the library; a clip it saves is uploaded and that is all.
