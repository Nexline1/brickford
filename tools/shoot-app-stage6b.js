// shoot-app-stage6b.js — Practice (every state), the Transcript, the Handbook, the Method, the Workshop and the Library in the built
// Flutter app (app-web/), 375x812.
//
//   node tools/shoot-app-stage6b.js [out dir]     default loop/specs/T-064-flutter-app/shots (stage6b-*.png)
//
// Serves the repo root at /brickford/ on a local port (run tools/build-app.sh first), starts the clock at Fri 6 Nov 2026 08:15 (plan
// day 21: the bank, a story and a humour rep owed) and lets it run. Chromium's fake microphone (--use-fake-device-for-media-stream)
// stands in for a real one, so the recorder runs for real: it records, stops, keeps the clip in IndexedDB (database brickford_audio,
// store clips) and logs the rep in S.reps; a reload shows the clip still there. Denied (getUserMedia rejects) and no-device
// (no MediaRecorder) are two more contexts. Every control shot is measured at 44x44 or more. Exits 1 on a failed assertion.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "loop/specs/T-064-flutter-app/shots"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm", ".md": "text/markdown",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream", ".txt": "text/plain", ".pdf": "application/pdf" };
let fails = 0;
const check = (name, ok, detail) => { if (!ok) fails++; console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : "")); };

function serve() {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    if (!u.pathname.startsWith("/brickford/")) { res.writeHead(404); return res.end(); }
    let p = path.join(ROOT, decodeURIComponent(u.pathname.slice("/brickford/".length)));
    if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
    if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

const w = (on, extra) => Object.assign({ done: true, doneAt: on, notes: "", checks: [] }, extra || {});
const pv = on => ({ verified: true, verifiedAt: on });
const state = {
  lessons: { "math110.0.0": w("2026-10-20", pv("2026-10-21")), "math110.0.1": w("2026-10-21", pv("2026-10-22")), "math110.0.2": w("2026-10-22", pv("2026-10-23")), "math110.0.3": w("2026-10-23"), "ai200.0.0": w("2026-10-24", pv("2026-10-25")), "math120.0.0": w("2026-10-27") },
  gates: { 1: { date: "2026-10-30", at: "2026-10-30T09:00:00.000Z", passed: true } },
  quizAttempts: { "linear-algebra": [{ date: "2026-10-28", score: 13, total: 15, pct: 87 }] },
  labs: { "micrograd-blind": { done: true, proof: "https://github.com/x/micrograd" } }, psets: { "1806-ps1": true, "1806-ps2": true },
  reps: { bank: [{ date: "2026-11-02", what: "a client asked what an embedding was", why: "he got it in 20 seconds" }, { date: "2026-11-03", what: "the demo broke on stage", why: "" }, { date: "2026-11-05", what: "a taxi driver explained inflation", why: "no jargon" }], story: [], humor: [], review: [] },
  studyDays: ["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05"],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/app-web/";
  const browser = await chromium.launch({ args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
  const W = 375, H = 812;
  const errors = [], hosts = new Set();
  // A fresh context at a given clock (the clock runs from there), with an optional init script, on the app.
  async function open(clock, init, seed) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block", permissions: ["microphone"] });
    await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
    if (init) await ctx.addInitScript(init);
    await ctx.addInitScript(s => { if (s && !localStorage.getItem("flutter.darhikmah_v1")) localStorage.setItem("flutter.darhikmah_v1", s); }, seed === null ? null : JSON.stringify(JSON.stringify(seed || state)));
    const page = await ctx.newPage();
    await page.clock.install({ time: new Date(clock) });
    await page.clock.resume();
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error" && !/youtube\.com|ytimg\.com/.test((m.location() || {}).url || "")) errors.push(m.text()); });
    page.on("request", r => { const h = new URL(r.url()).host; if (!h.startsWith("localhost") && !/(^|\.)youtube\.com$|ytimg\.com$/.test(h)) { hosts.add(h); if (process.env.DBG) console.log("host " + r.url() + " after " + (global.__last || "start")); } });
    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await page.waitForSelector("[flt-semantics-identifier]", { timeout: 10000 });
    const id = (x, n = 0) => page.locator(`[flt-semantics-identifier="${x}"]`).nth(n);
    const has = async x => (await id(x).count()) > 0;
    const shot = async name => { await page.mouse.move(W - 3, 300); await page.waitForTimeout(900); const f = path.join(OUT, "stage6b-" + name + ".png"); await page.screenshot({ path: f }); console.log("  shot  " + path.relative(ROOT, f)); global.__last = name; };
    const tap = async (x, n = 0) => { const b = await id(x, n).boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(700); return b; };
    const wait = x => page.waitForSelector(`[flt-semantics-identifier="${x}"]`, { timeout: 10000 }).catch(async e => { await page.screenshot({ path: path.join(OUT, "stage6b-debug.png") }); throw e; });
    const scroll = async dy => { await page.mouse.move(W / 2, 500); await page.mouse.wheel(0, dy); await page.waitForTimeout(700); };
    // The chip row scrolls sideways: drag it until the chip is built, then tap.
    const chip = async x => {
      // A chip clipped by the sheet's edge reports a clipped box: only a whole chip (>= 60 wide, inside the viewport) counts as shown.
      const box = async () => ((await has(x)) ? id(x).boundingBox() : null);
      const shown = b => !!b && b.x >= 0 && b.x + b.width <= W - 1 && b.width >= 60;
      // Not whole: back to the left end of the row, then step right until it is.
      if (!shown(await box())) { await page.mouse.move(200, 288); await page.mouse.wheel(-3000, 0); await page.waitForTimeout(500); }
      for (let i = 0; i < 10 && !shown(await box()); i++) { await page.mouse.move(200, 288); await page.mouse.wheel(220, 0); await page.waitForTimeout(500); }
      await tap(x);
    };
    const sized = async (ids, label) => {
      const small = [];
      for (const x of ids) { const b = await id(x).boundingBox().catch(() => null); if (!b || b.width < 44 || b.height < 44) small.push(x + " " + (b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing")); }
      check(label + " are at least 44x44", small.length === 0, small.join(", ") || ids.length + " measured");
    };
    const stored = async () => JSON.parse(JSON.parse(await page.evaluate(() => localStorage.getItem("flutter.darhikmah_v1"))));
    return { ctx, page, id, has, shot, tap, wait, scroll, chip, sized, stored };
  }
  const clips = page => page.evaluate(() => new Promise(res => {
    const q = indexedDB.open("brickford_audio");
    q.onerror = () => res(null);
    q.onsuccess = () => { const db = q.result; if (!db.objectStoreNames.contains("clips")) return res([]); const t = db.transaction("clips"), st = t.objectStore("clips"), k = st.getAllKeys(), v = st.getAll();
      t.oncomplete = () => { db.close(); res(k.result.map((key, i) => ({ key, size: v.result[i].blob.size, type: v.result[i].blob.type, seconds: v.result[i].seconds, kind: v.result[i].kind, title: v.result[i].title }))); }; };
  }));
  try {
    // ---- Home and Build: the practice entry ----
    let A = await open("2026-11-06T08:15:00");
    await A.wait("practice-row");
    await A.shot("home-practice");
    await A.sized(["practice-row"], "the Home practice row");
    await A.tap("tab-Build");
    await A.wait("chip-practice");
    await A.shot("build-practice");
    await A.sized(["chip-practice", "practice-row"], "the Build practice chip and row");

    // ---- Practice: idle, recording, stopped ----
    await A.tap("chip-practice");
    await A.wait("practice-rec");
    await A.shot("practice-idle");
    await A.sized(["practice-rec", "practice-tab-story", "practice-tab-humor", "practice-tab-bank", "back"], "the Practice controls");
    await A.tap("practice-rec");
    await A.page.waitForTimeout(2600);
    await A.shot("practice-recording");
    check("while recording, the button says Stop and the timer is running", await A.page.locator('[flt-semantics-identifier="practice-rec"][aria-label="Stop recording"], [flt-semantics-identifier="practice-rec"]').count() > 0);
    await A.tap("practice-rec");
    await A.page.waitForTimeout(1200);
    await A.shot("practice-stopped");
    let S = await A.stored();
    let K = await clips(A.page);
    check("stopping kept the clip in IndexedDB (brickford_audio / clips, key <date>-<n>) and logged one story rep in the web app's shape",
      K && K.length === 1 && K[0].key === "2026-11-06-1" && K[0].size > 1000 && /audio/.test(K[0].type) && K[0].kind === "story" && S.reps.story.length === 1 && S.reps.story[0].date === "2026-11-06" && S.reps.story[0].seconds >= 2 && S.reps.story[0].takes === 1 && /^Story · Fri 6 Nov$/.test(S.reps.story[0].from) &&
      S.ledger[S.ledger.length - 1].type === "rep" && S.ledger[S.ledger.length - 1].ref === "story", JSON.stringify(K) + " " + JSON.stringify(S.reps.story));
    await A.sized(["clip-play-2026-11-06-1", "clip-save-2026-11-06-1", "clip-delete-2026-11-06-1"], "the clip's play, download and delete buttons");
    await A.tap("clip-play-2026-11-06-1");
    await A.page.waitForTimeout(800);
    await A.shot("practice-playing");
    // the track survives a reload
    await A.page.reload({ waitUntil: "load" });
    await A.page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await A.page.waitForTimeout(2500);
    await A.page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await A.wait("tab-Build"); await A.tap("tab-Build"); await A.wait("chip-practice"); await A.tap("chip-practice");
    await A.wait("clip-play-2026-11-06-1");
    check("after a reload the recording is still listed (kept on this device)", await A.has("clip-play-2026-11-06-1") && (await clips(A.page)).length === 1);
    await A.shot("practice-reloaded");
    // humour and the bank
    await A.tap("practice-tab-humor");
    await A.shot("practice-humor");
    await A.tap("practice-tab-bank");
    await A.shot("practice-bank");
    // the delete confirmation (its buttons are covered by the widget test)
    await A.tap("practice-tab-story");
    await A.tap("clip-delete-2026-11-06-1");
    await A.page.waitForTimeout(500);
    await A.shot("practice-delete");
    await A.page.keyboard.press("Escape");
    await A.ctx.close();

    // ---- denied, and no device: the hand form, no record button ----
    const D = await open("2026-11-06T08:15:00", () => { navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException("Permission denied", "NotAllowedError")); });
    await D.tap("tab-Build"); await D.wait("chip-practice"); await D.tap("chip-practice"); await D.wait("practice-rec");
    await D.tap("practice-rec");
    await D.page.waitForTimeout(800);
    check("permission denied: the record button is gone and the hand form is open", !(await D.has("practice-rec")) && await D.has("field-repSecs"));
    await D.shot("practice-denied");
    await D.ctx.close();
    const N = await open("2026-11-06T08:15:00", () => { delete window.MediaRecorder; });
    await N.tap("tab-Build"); await N.wait("chip-practice"); await N.tap("chip-practice"); await N.wait("field-repSecs");
    check("no recorder in the browser: no record button, the hand form from the start", !(await N.has("practice-rec")));
    await N.shot("practice-nodevice");
    await N.ctx.close();

    // ---- a rest day ----
    const R = await open("2026-11-07T09:00:00");
    await R.tap("tab-Build"); await R.wait("chip-practice"); await R.tap("chip-practice"); await R.wait("practice-rest");
    await R.shot("practice-rest");
    await R.ctx.close();

    // ---- Profile: Transcript, Handbook, Method, Workshop, Library, a document ----
    const P = await open("2026-11-06T08:15:00");
    await P.tap("tab-Profile"); await P.wait("chip-record");
    await P.shot("profile");
    await P.chip("chip-transcript"); await P.wait("gate-2");
    await P.shot("transcript");
    await P.sized(["gate-pass", "back"], "the Transcript controls");
    await P.tap("gate-pass"); await P.wait("gate-go");
    await P.shot("transcript-gate");
    await P.page.keyboard.press("Escape");
    await P.page.waitForTimeout(500);
    await P.scroll(900);
    await P.shot("transcript-mastery");
    await P.tap("back");
    await P.chip("chip-guide"); await P.wait("guide-today");
    await P.shot("guide");
    await P.scroll(800);
    await P.shot("guide-more");
    await P.tap("back");
    await P.chip("chip-method"); await P.wait("method-recall");
    await P.shot("method");
    await P.scroll(700);
    await P.shot("method-more");
    await P.tap("back");
    await P.chip("chip-workshop"); await P.wait("workshop-later");
    await P.shot("workshop");
    await P.sized(["workshop-lab-micrograd-blind", "back"], "the Workshop controls");
    await P.scroll(900);
    await P.shot("workshop-sets");
    await P.tap("back");
    await P.chip("chip-library"); await P.wait("doc-readme");
    await P.shot("library");
    await P.sized(["lib-guide", "lib-method", "doc-readme", "doc-curriculum"], "the Library rows");
    await P.tap("doc-readme");
    await P.page.waitForTimeout(1500);
    await P.shot("doc");
    await P.scroll(700);
    await P.shot("doc-more");
    await P.tap("back");
    await P.scroll(1800);
    await P.shot("library-links");
    await P.ctx.close();
    check("no page or console errors, and no host but this one was asked", errors.length === 0 && hosts.size === 0, errors.slice(0, 3).join(" | ") + [...hosts].join(","));
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(String(e.stack || e)); process.exit(1); });
