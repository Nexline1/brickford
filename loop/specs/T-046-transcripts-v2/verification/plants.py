#!/usr/bin/env python3
# T-046 v2 plants (a)-(g), plus (h) for the Flutter parity check: put each bug
# back, run every gate that must catch it, record each exit code, restore the
# file byte for byte (checked by sha256). Run from anywhere:
#   python3 loop/specs/T-046-transcripts-v2/verification/plants.py [a b ...]
# Every gate runs under TZ=America/Los_Angeles, as the spec asks.
import hashlib, os, signal, subprocess, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
APP = "platform/js/app.js"
FLOWS, SYNC, DESIGN, VAPP = "tools/verify-flows.js", "tools/verify-sync-loop.js", "tools/verify-design.js", ["tools/verify-app.js", "--no-plants"]
PLANTS = {
  "a": ("the transcript is written into localStorage and the sync payload (onto the story rep)", APP,
        "      return clipPatch(m.id, { transcript: t }).then(() => { const c = txClips.get(m.id); if (c) c.transcript = t; txEnd(m.id, null); },",
        "      return clipPatch(m.id, { transcript: t }).then(() => { const c = txClips.get(m.id); if (c) c.transcript = t;"
        " const rp = (S.reps.story || []).slice(-1)[0]; if (rp) { rp.transcript = t.text; save(); } txEnd(m.id, null); },",
        [FLOWS, SYNC]),
  "b": ("\"I like it\" is counted as a filler (like: always)", APP,
        '{ w: "like", when: "comma" }', '{ w: "like", when: "always" }', [FLOWS]),
  "c": ("the model download starts without consent (the first use does not ask)", APP,
        "    if (txSetting() !== \"on\") { txAsk = key; return txPaint(); }   // the first use asks\n", "", [FLOWS]),
  "d": ("the transcription runs on the main thread (no Worker: the library imported and run by the page)", APP,
        '    const w = new Worker(TX_WORKER, { type: "module" });',
        '    const w = { terminate() {}, postMessage(m) { import(m.lib)'
        '.then(lib => lib.pipeline("automatic-speech-recognition", m.model, { revision: m.revision, dtype: "q8", device: "wasm" }))'
        '.then(asr => asr(m.pcm, { language: "english", task: "transcribe", return_timestamps: true, chunk_length_s: 30, stride_length_s: 5 }))'
        '.then(out => w.onmessage({ data: { type: "done", id: m.id, text: out.text, chunks: out.chunks } }),'
        ' err => w.onmessage({ data: { type: "error", id: m.id, kind: "failed", msg: String(err) } })); } };',
        [FLOWS]),
  "e": ("an upload during a render (V.practice uploads what is not yet in the repo)", APP,
        "  V.practice = function () {\n", "  V.practice = function () {\n    audioOpen();\n", [FLOWS]),
  "f": ("the audio is uploaded to the public repo", APP,
        '    const url = "https://api.github.com/repos/" + SYNC_REPO + "/contents/" + (file || "audio");',
        '    const url = "https://api.github.com/repos/Nexline1/brickford/contents/" + (file || "audio");',
        [FLOWS, SYNC]),
  "g": ("the model loads on the phone (every device counts as the desktop)", APP,
        '  const txDesktop = () => !!(window.matchMedia && matchMedia("(pointer: fine)").matches) && window.innerWidth >= 1024;',
        "  const txDesktop = () => true;", [FLOWS, DESIGN]),
  "h": ("the Flutter app builds another upload path (.oga for ogg)", "app/lib/engine/practice.dart",
        "    ? '.ogg'\n", "    ? '.oga'\n", [VAPP]),
}
# Interrupt-safe: the original is copied to <file>.plant-backup before a plant,
# removed only once restored; a killed run's backup is put back first.
def _exit(signum, frame): raise SystemExit(128 + signum)
for sig in (signal.SIGTERM, signal.SIGHUP): signal.signal(sig, _exit)
for _, path, _o, _n, _g in PLANTS.values():
    bk = os.path.join(ROOT, path) + ".plant-backup"
    if os.path.exists(bk):
        os.replace(bk, os.path.join(ROOT, path))
        print("restored %s from a backup a killed run left behind" % path)
env = dict(os.environ, TZ="America/Los_Angeles")
which = sys.argv[1:] or sorted(PLANTS)
results = []
for key in which:
    name, path, old, new, gates = PLANTS[key]
    fp = os.path.join(ROOT, path)
    src = open(fp, "rb").read()
    before = hashlib.sha256(src).hexdigest()
    text = src.decode("utf8")
    assert text.count(old) == 1, (key, "anchor not found once")
    open(fp + ".plant-backup", "wb").write(src)
    open(fp, "wb").write(text.replace(old, new).encode("utf8"))
    try:
        for g in gates:
            cmd = ["node"] + (g if isinstance(g, list) else [g])
            r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, env=env)
            fails = [l for l in r.stdout.splitlines() if "FAIL" in l]
            print("(%s) %s -> %s exit %d (%d FAIL lines)" % (key, name, " ".join(cmd[1:]), r.returncode, len(fails)), flush=True)
            for l in fails[:8]: print("      " + l.strip()[:260], flush=True)
            results.append((key, cmd[1], r.returncode))
    finally:
        open(fp, "wb").write(src)
        os.remove(fp + ".plant-backup")
    after = hashlib.sha256(open(fp, "rb").read()).hexdigest()
    assert after == before, (key, "restore failed")
    print("(%s) restored %s byte-identically (sha256 %s)" % (key, path, after[:16]), flush=True)
ok = all(code == 1 for _, _, code in results)
print("ALL PLANTS EXIT 1" if ok else "SOME PLANT DID NOT EXIT 1: %r" % results)
sys.exit(0 if ok else 1)
