// T-046 screenshots: /practice at 1440 and 390, Dark and Light — a recording
// with its transcript open (fillers struck, chips, words per minute, the
// note, Copy) above an untranscribed one; then, at 390 in both themes, the
// question before the download, and once each the line "Transcribing… n%"
// (a stub module served for the pinned URL, slowed down) and the off line
// after Not now. Nothing leaves the machine: every https request is refused
// except the pinned library URL, which the script answers itself.
//   NODE_PATH=/opt/node22/lib/node_modules node loop/specs/T-046-story-transcription/verification/shots.js
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = path.resolve(__dirname, "../../../..");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const OUT = path.join(__dirname, "screens");
fs.mkdirSync(OUT, { recursive: true });
const LIB = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";
const TEXT = " So um, last Tuesday a client asked me, like, what an embedding actually is. I drew arrows on a napkin, you know, king minus man plus woman." +
  " She stopped me. She said, “so it's a map of meaning?” And that was it. She'd said it better than I had in ten minutes. So yeah, I stopped drawing and I asked her to explain it back to her team.";
const SLOW = "const wait = ms => new Promise(r => setTimeout(r, ms));" +
  "export async function pipeline(t, m, o) { for (const p of [10, 60, 100]) { o.progress_callback({ status: 'progress_total', progress: p }); await wait(300); }" +
  " return async (a, q) => { await wait(1500); q.streamer.end(); await wait(60000); return { text: '', chunks: [] }; }; }";
const STATE = (theme, extra) => ({ settings: Object.assign({ theme, themeNavyOnce: true }, extra || {}),
  reps: { bank: [], story: [{ date: "2026-10-16", seconds: 72, takes: 1, from: "Story · Fri 16 Oct" }], humor: [], review: [] } });
const seed = text => new Promise((res, rej) => {
  const q = indexedDB.open("brickford_audio", 1);
  q.onupgradeneeded = () => { if (!q.result.objectStoreNames.contains("clips")) q.result.createObjectStore("clips"); };
  q.onerror = () => rej(q.error);
  q.onsuccess = () => {
    const db = q.result, t = db.transaction("clips", "readwrite");
    // A real 2s tone, so the "Transcribing" shot can decode it.
    const rate = 16000, n = rate * 2, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const s = (o, x) => [...x].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
    s(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); s(8, "WAVE"); s(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, "data"); v.setUint32(40, n * 2, true);
    const blob = () => new Blob([buf], { type: "audio/wav" });
    t.objectStore("clips").put({ date: "2026-10-16", seconds: 72, kind: "story", title: "The client and the embedding", blob: blob(),
      transcript: { text, chunks: [{ text, timestamp: [0, 72] }], model: "stub@stub", at: "2026-10-16T12:00:00.000Z" } }, "2026-10-16-1");
    t.objectStore("clips").put({ date: "2026-10-19", seconds: 58, kind: "humor", title: "Humour · Mon 19 Oct", blob: blob() }, "2026-10-19-1");
    t.oncomplete = () => { db.close(); res(); };
    t.onerror = () => rej(t.error);
  };
});
const settle = page => page.evaluate(() => Promise.all(document.getAnimations()
  .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
(async () => {
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  for (const [w, theme] of [[1440, "dark"], [1440, "light"], [390, "dark"], [390, "light"]]) {
    for (const what of w === 390 ? ["card", "ask", "running", "off"] : ["card"]) {
      if ((what === "running" || what === "off") && theme === "light") continue;
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 860 ? 844 : 900 }, timezoneId: "UTC", reducedMotion: "reduce",
        isMobile: w < 860, hasTouch: w < 860, colorScheme: theme });
      await ctx.route(/^https?:/, r => r.abort());
      await ctx.route(u => u.href === LIB, r => r.fulfill({ status: 200, contentType: "text/javascript", headers: { "access-control-allow-origin": "*" }, body: SLOW }));
      await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
      await ctx.addInitScript(s => { if (window.top === window && !sessionStorage.getItem("__s")) { sessionStorage.setItem("__s", "1"); localStorage.setItem("darhikmah_v1", s); } },
        JSON.stringify(STATE(theme, what === "running" ? { transcribe: "on" } : null)));
      const page = await ctx.newPage();
      await page.goto(URL + "/", { waitUntil: "load" });
      await page.evaluate(seed, TEXT);
      await page.goto(URL + "/practice", { waitUntil: "load" });
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 2);
      const press = sel => (w < 860 ? page.tap(sel) : page.click(sel));
      if (what === "card") await press("#view details.pr-tx > summary");
      if (what !== "card") await press("#view [data-tx-go]");
      if (what === "running") await page.waitForFunction(() => /Transcribing… \d+%/.test((document.querySelector("#view .tx-line") || {}).textContent || ""), null, { timeout: 15000 });
      if (what === "off") { await page.waitForSelector("#view .pr-ask"); await press("#view [data-tx=no]"); await page.waitForSelector("#view .pr-txoff"); }
      await settle(page);
      await page.evaluate(() => { const t = document.querySelector("#toast"); if (t) t.classList.remove("show"); });
      await page.evaluate(() => document.querySelector("#view .ghead").scrollIntoView({ block: "start" }));
      await page.screenshot({ path: path.join(OUT, "transcript-" + w + "-" + theme + "-" + what + ".png"), fullPage: w >= 860 });
      await ctx.close();
    }
  }
  await browser.close();
  console.log("shots in " + OUT);
})().catch(e => { console.error(e); process.exit(1); });
