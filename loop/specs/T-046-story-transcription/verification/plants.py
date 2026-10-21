#!/usr/bin/env python3
# T-046 plants (a)-(d): put each bug back, run the gates that must catch it,
# record each exit code, restore the file. Run from the worktree root:
#   NODE_PATH=/opt/node22/lib/node_modules python3 loop/specs/T-046-story-transcription/verification/plants.py [a b ...]
import subprocess, sys, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
APP = "platform/js/app.js"
PLANTS = {
  "a": ("the transcript is written into localStorage and the sync payload (onto the story rep)", APP,
        "    return clipPatch(m.id, { transcript: t }).then(() => { const c = txClips.get(m.id); if (c) c.transcript = t; txEnd(m.id, null); },",
        "    return clipPatch(m.id, { transcript: t }).then(() => { const c = txClips.get(m.id); if (c) c.transcript = t;"
        " const rp = (S.reps.story || []).slice(-1)[0]; if (rp) { rp.transcript = t.text; save(); } txEnd(m.id, null); },",
        ["tools/verify-flows.js", "tools/verify-sync-loop.js"]),
  "b": ("\"I like it\" is counted as a filler (like: always)", APP,
        '{ w: "like", when: "comma" }', '{ w: "like", when: "always" }', ["tools/verify-flows.js"]),
  "c": ("the model download starts without consent (the first use does not ask)", APP,
        "    if (txSetting() !== \"on\") { txAsk = key; return txPaint(); }   // the first use asks\n", "", ["tools/verify-flows.js"]),
  "d": ("the transcription runs on the main thread (no Worker: the library imported and run by the page)", APP,
        '    const w = new Worker(TX_WORKER, { type: "module" });',
        '    const w = { terminate() {}, postMessage(m) { import(m.lib)'
        '.then(lib => lib.pipeline("automatic-speech-recognition", m.model, { revision: m.revision, dtype: "q8", device: "wasm" }))'
        '.then(asr => asr(m.pcm, { return_timestamps: true, chunk_length_s: 30, stride_length_s: 5 }))'
        '.then(out => w.onmessage({ data: { type: "done", id: m.id, text: out.text, chunks: out.chunks } }),'
        ' err => w.onmessage({ data: { type: "error", id: m.id, kind: "failed", msg: String(err) } })); } };',
        ["tools/verify-flows.js"]),
}
which = sys.argv[1:] or sorted(PLANTS)
results = []
for key in which:
    name, path, old, new, gates = PLANTS[key]
    fp = os.path.join(ROOT, path)
    src = open(fp).read()
    assert src.count(old) == 1, (key, "anchor not found once")
    open(fp, "w").write(src.replace(old, new))
    try:
        for g in gates:
            r = subprocess.run(["node", g], cwd=ROOT, capture_output=True, text=True)
            fails = [l for l in r.stdout.splitlines() if "FAIL" in l]
            print("(%s) %s -> %s exit %d" % (key, name, g, r.returncode))
            for l in fails[:8]: print("      " + l.strip()[:240])
            results.append((key, g, r.returncode))
    finally:
        open(fp, "w").write(src)
    assert open(fp).read() == src, (key, "restore failed")
ok = all(code == 1 for _, _, code in results)
print("ALL PLANTS EXIT 1" if ok else "SOME PLANT DID NOT EXIT 1: %r" % results)
sys.exit(0 if ok else 1)
