// T-046 (loop/specs/T-046-story-transcription/spec.md): Whisper, off the main
// thread. A module Web Worker, made by app.js only after the reader agreed to
// the one-time download, so the page never freezes while the model loads or
// runs, and nothing here loads at page load.
//
// The page sends { type: "run", id, lib, model, revision, pcm }: the pinned
// library URL, the pinned model and its revision (all three are constants in
// app.js), and the clip as 16 kHz mono Float32 PCM, decoded on the page. It
// gets back, for that id:
//   { type: "progress", phase: "download" | "run", pct }
//   { type: "done", text, chunks: [{ text, timestamp }] }
//   { type: "error", kind: "download" | "memory" | "failed", msg }
// The audio never leaves the device: the library fetches the model's files
// (and ONNX Runtime's wasm), then runs on this machine. The browser's Cache
// API keeps the model after the first download.
"use strict";

let asr = null;          // the pipeline, once loaded; kept for the worker's life
let loading = null;      // the load in flight, so two runs share one download

const memory = e => e instanceof RangeError || /memory|allocation|bad_alloc|OOM/i.test(String(e && (e.message || e)));
const said = e => String((e && e.message) || e || "").slice(0, 200);

function load(m) {
  if (!loading) {
    loading = (async () => {
      const lib = await import(m.lib);
      return lib.pipeline("automatic-speech-recognition", m.model, {
        revision: m.revision, dtype: "q8", device: "wasm",
        progress_callback: p => {
          if (p && p.status === "progress_total")
            self.postMessage({ type: "progress", id: m.id, phase: "download", pct: Math.round(p.progress || 0) });
        },
      });
    })();
    // A failed load is not kept: the next run tries again.
    loading.catch(() => { loading = null; });
  }
  return loading;
}

self.onmessage = async e => {
  const m = e.data || {};
  if (m.type !== "run") return;
  try {
    asr = asr || await load(m);
  } catch (err) {
    self.postMessage({ type: "error", id: m.id, kind: memory(err) ? "memory" : "download", msg: said(err) });
    return;
  }
  try {
    // A 30s window with a 5s stride; each window ends one generate call,
    // which is what the streamer's end() counts. Capped under 100 until the
    // text is back, because a window can take more than one call.
    const windows = Math.max(1, 1 + Math.ceil((m.pcm.length - 30 * 16000) / (20 * 16000)));
    let done = 0;
    self.postMessage({ type: "progress", id: m.id, phase: "run", pct: 0 });
    const out = await asr(m.pcm, {
      return_timestamps: true, chunk_length_s: 30, stride_length_s: 5,
      streamer: { put() {}, end() { done++; self.postMessage({ type: "progress", id: m.id, phase: "run", pct: Math.min(99, Math.round(done / windows * 100)) }); } },
    });
    const chunks = (out && out.chunks || []).map(c => ({ text: String(c.text || ""), timestamp: [c.timestamp[0], c.timestamp[1]] }));
    self.postMessage({ type: "done", id: m.id, text: String((out && out.text) || ""), chunks: chunks });
  } catch (err) {
    self.postMessage({ type: "error", id: m.id, kind: memory(err) ? "memory" : "failed", msg: said(err) });
  }
};
