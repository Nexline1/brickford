// perf-app.js — how the Flutter app (app-web/) feels under load: Chromium at 375x812 (dpr 2) with the CPU
// throttled 4x, served as GitHub Pages serves it. T-064 performance round (the owner's iPhone lags).
//
//   node tools/perf-app.js [out file]      run tools/build-app.sh first; prints a table, and writes it to [out file]
//
// Measures, in one run, on a seeded state (a few lectures done, a ledger, sync not configured, clock 2026-11-04):
//   - navigation -> Flutter's first frame, and how much of that is after the data files arrived;
//   - frame times (requestAnimationFrame deltas from an injected loop) while scrolling Home, Learn (courses and the
//     lecture list), Build, Library and the Calendar: median, p95, worst, and frames over 50 ms;
//   - tap -> the new screen on screen: a tab switch (Learn, Build, Profile), a lecture, the Calendar, Monk, Atlas,
//     as ident (the first moment the new screen's semantics identifier is in the DOM, which follows the frame that
//     painted it) and settled (the end of the last frame over 32 ms in the 1.2 s after the tap).
// What it can not say: this is a software-GL Chromium on a server CPU, throttled by a multiplier, not an iPhone's
// GPU. Raster cost (blurs, shadows) is exaggerated by software GL and the main-thread (Dart) cost is scaled by 4;
// read the numbers as a ranking of before against after, not as milliseconds on the phone.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path"), crypto = require("crypto");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = process.argv[2] ? path.resolve(process.argv[2]) : null;
const THROTTLE = +(process.env.THROTTLE || 4);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".wasm": "application/wasm", ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf",
  ".woff2": "font/woff2", ".pdf": "application/pdf", ".md": "text/markdown", ".frag": "text/plain", ".bin": "application/octet-stream", ".txt": "text/plain" };

function serve() {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    if (!u.pathname.startsWith("/brickford/")) { res.writeHead(404); return res.end(); }
    let p = path.join(ROOT, decodeURIComponent(u.pathname.slice("/brickford/".length)));
    if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      if (!u.pathname.endsWith("/")) { res.writeHead(301, { Location: u.pathname + "/" }); return res.end(); }
      p = path.join(p, "index.html");
    }
    if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

// ---- the seeded state: the web app's shape, a valid ledger, sync not configured ----
function seed() {
  const lessons = {}, days = ["2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17", "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22",
    "2026-10-23", "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-11-02", "2026-11-03"];
  const keys = [];
  for (let i = 0; i < 16; i++) keys.push("math110.0." + i);
  for (let i = 0; i < 6; i++) keys.push("ai200.0." + i);
  for (let i = 0; i < 6; i++) keys.push("math120.0." + i);
  for (let i = 0; i < 4; i++) keys.push("spch100.0." + i);
  keys.forEach((k, i) => {
    const on = days[i % days.length];
    lessons[k] = { done: true, doneAt: on, notes: "", checks: [] };
    if (i % 3 === 0 && on < "2026-10-30") lessons[k].quiz = { passedAt: on };
  });
  const canon = v => Array.isArray(v) ? "[" + v.map(canon).join(",") + "]"
    : v && typeof v === "object" ? "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}" : JSON.stringify(v);
  const ledger = [];
  keys.forEach((k, i) => {
    const e = { i: ledger.length, ts: days[i % days.length] + "T09:00:00.000Z", type: "lesson", ref: k, data: { done: true },
      prev: ledger.length ? ledger[ledger.length - 1].hash : "brickford-genesis" };
    e.hash = crypto.createHash("sha256").update(canon(e)).digest("hex");
    ledger.push(e);
  });
  return { lessons, studyDays: days, ledger };
}

const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN; };
const f1 = n => (Number.isFinite(n) ? n.toFixed(1) : "-");

(async () => {
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/";
  const browser = await chromium.launch();
  const W = 375, H = 812;
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
  await ctx.clock.setFixedTime(new Date("2026-11-04T12:00:00Z"));
  await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
  await ctx.addInitScript(s => {
    try { localStorage.setItem("flutter.darhikmah_v1", s); } catch (_) {}
    window.__ff = null;
    window.addEventListener("flutter-first-frame", () => { window.__ff = performance.now(); });
    // The frame probe: one rAF loop for the page's life; samples are kept only while a window is open.
    window.__frames = null; let last = 0;
    const loop = t => { if (window.__frames && last) window.__frames.push([t, t - last]); last = t; requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    // Semantics on from the start (the placeholder is clicked the moment it exists), so the Home tab's arrival is seen.
    window.__home = null;
    new MutationObserver(() => {
      const p = document.querySelector("flt-semantics-placeholder"); if (p && !window.__sem) { window.__sem = true; p.click(); }
      if (window.__home === null && document.querySelector('[flt-semantics-identifier="tab-Home"]')) window.__home = performance.now();
    }).observe(document, { subtree: true, childList: true });
    window.__t0 = null; window.__hit = null; window.__obs = null;
    addEventListener("pointerup", e => { window.__t0 = e.timeStamp; }, true);
    // arm(sel): from now on, note the first moment a node matching sel is in the DOM.
    window.__arm = sel => {
      window.__hit = null; if (window.__obs) window.__obs.disconnect();
      const check = () => { if (window.__hit === null && document.querySelector(sel)) { window.__hit = performance.now(); window.__obs.disconnect(); } };
      window.__obs = new MutationObserver(check);
      window.__obs.observe(document, { subtree: true, childList: true, attributes: true });
      return !document.querySelector(sel);
    };
  }, JSON.stringify(JSON.stringify(seed())));
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));

  const rows = [];      // [section, name, ...cells]
  const log = (...a) => { process.stderr.write(a.join(" ") + "\n"); };

  // ---- start: navigation -> first frame ----
  // (Resource timing is not reliable once the clock is fixed, so the arrival times are Node's: ~10 ms coarse.)
  const arrived = { js: 0, wasm: 0, data: 0 }; let tnav = 0;
  page.on("requestfinished", r => {
    const u = r.url(), t = Date.now() - tnav;
    if (/main\.dart\.js/.test(u)) arrived.js = t; else if (/canvaskit\.wasm/.test(u)) arrived.wasm = t; else if (/assets\/data\/[^/]*\.json/.test(u)) arrived.data = Math.max(arrived.data, t);
  });
  tnav = Date.now();
  await page.goto(BASE + "app-web/", { waitUntil: "load" });
  await page.waitForFunction(() => window.__ff !== null, null, { timeout: 120000 });
  await page.waitForFunction(() => window.__home !== null, null, { timeout: 120000 });
  const start = Object.assign({ first: await page.evaluate(() => window.__ff), home: await page.evaluate(() => window.__home) }, arrived);
  await page.waitForTimeout(2500);
  await page.waitForTimeout(800);

  const sel = id => `[flt-semantics-identifier="${id}"]`;
  const center = async (s, nth = 0) => {
    const el = page.locator(s).nth(nth);
    await el.waitFor({ timeout: 20000 });
    const b = await el.boundingBox();
    return [b.x + b.width / 2, b.y + b.height / 2];
  };
  const click = async (s, nth = 0) => { const [x, y] = await center(s, nth); await page.mouse.click(x, y); };

  // Frame stats from a window of [t, delta] samples.
  const stats = fr => { const d = fr.map(x => x[1]); return { n: d.length, med: pct(d, 0.5), p95: pct(d, 0.95), worst: Math.max(0, ...d), over50: d.filter(x => x > 50).length }; };

  // Scroll the sheet down then back up by wheel steps (a wheel step is an immediate jump; one step per ~frame).
  async function scroll(name, steps = 22, dy = 120) {
    await page.mouse.move(W / 2, 560);
    const before = await page.screenshot();
    const grab = () => page.evaluate(() => { const f = window.__frames; window.__frames = null; return f; });
    let fr = [];
    await page.evaluate(() => { window.__frames = []; });
    for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy); await page.waitForTimeout(16); }
    await page.waitForTimeout(250);
    fr = fr.concat(await grab());
    const moved = !before.equals(await page.screenshot());   // outside the window: a screenshot is not a frame to count
    await page.evaluate(() => { window.__frames = []; });
    for (let i = 0; i < steps + 4; i++) { await page.mouse.wheel(0, -dy); await page.waitForTimeout(16); }
    await page.waitForTimeout(250);
    fr = fr.concat(await grab());
    const s = stats(fr);
    rows.push(["scroll", name + (moved ? "" : " (DID NOT MOVE)"), s.n, f1(s.med), f1(s.p95), f1(s.worst), s.over50]);
    log("  scrolled", name, JSON.stringify(s));
  }

  // Tap [tapSel], wait for [wantSel] to appear; ident = tap -> its first sighting, settled = to the last frame over 32 ms.
  async function open(name, tapSel, wantSel, nth = 0) {
    const absent = await page.evaluate(s => window.__arm(s), wantSel);
    if (!absent) throw new Error(name + ": " + wantSel + " was already on screen");
    await page.evaluate(() => { window.__frames = []; window.__t0 = null; });
    await click(tapSel, nth);
    await page.waitForFunction(() => window.__hit !== null, null, { timeout: 20000 });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => { const f = window.__frames; window.__frames = null; return { f, t0: window.__t0, hit: window.__hit }; });
    const t0 = r.t0 ?? r.f[0][0];
    const long = r.f.filter(x => x[1] > 32 && x[0] >= t0 && x[0] <= t0 + 1200).map(x => x[0]);
    const ident = r.hit - t0, settled = Math.max(ident, (long.length ? Math.max(...long) : 0) - t0);
    const worst = Math.max(0, ...r.f.filter(x => x[0] >= t0 && x[0] <= t0 + 1200).map(x => x[1]));
    rows.push(["open", name, f1(ident), f1(settled), f1(worst)]);
    log("  opened", name, "ident", f1(ident), "settled", f1(settled), "worst", f1(worst));
  }
  const back = async (id = "back") => {
    await click(sel(id));
    await page.waitForFunction(s => !document.querySelector(s), sel(id), { timeout: 20000 });
    await page.waitForTimeout(700);
  };

  // ---- the walk ----
  await scroll("Home", 14);
  await open("tab Learn", sel("tab-Learn"), sel("learn-tab-courses"));
  await scroll("Learn (courses)");
  await click(sel("learn-tab-all")); await page.waitForTimeout(1200);
  await scroll("Learn (lecture list)", 40);
  await click(sel("learn-tab-courses")); await page.waitForTimeout(800);
  await open("Atlas", sel("learn-tool-atlas"), sel("back"));
  await back();
  await open("tab Build", sel("tab-Build"), sel("chip-treasury"));
  await scroll("Build");
  await open("tab Profile", sel("tab-Profile"), sel("chip-record"));
  await open("Library", sel("chip-library"), sel("back"));
  await scroll("Library");
  await back();
  await click(sel("tab-Home")); await page.waitForTimeout(1000);
  await open("Calendar", sel("chip-calendar"), sel("cal-prev"));
  await scroll("Calendar", 10);
  await open("Calendar day sheet", sel("cal-2026-11-03"), sel("day-row"));
  await scroll("Calendar day sheet", 8);
  await page.mouse.click(W / 2, 40); await page.waitForTimeout(900);
  await back();
  await open("Monk", sel("chip-monk"), sel("back"));
  await back();
  await open("Lecture", sel("lecture"), sel("lesson-mark"));
  await back("lesson-back");

  // ---- the table ----
  const out = [];
  const pad = (s, n) => String(s).padEnd(n), lpad = (s, n) => String(s).padStart(n);
  out.push(`perf-app: ${W}x${H} dpr 2, CPU throttle ${THROTTLE}x, Chromium ${browser.version()} (software GL), seeded state, clock 2026-11-04`);
  out.push("");
  out.push(`start: splash frame ${f1(start.first)} ms after navigation; Home on screen ${f1(start.home)} ms (main.dart.js in at ${f1(start.js)}, canvaskit.wasm at ${f1(start.wasm)}, last data JSON in at ${f1(start.data)}; ${f1(start.home - start.data)} ms from the last data file to Home: decode, build, first frame)`);
  out.push("");
  out.push(pad("scrolling (frame = rAF delta, ms)", 36) + lpad("frames", 8) + lpad("median", 8) + lpad("p95", 8) + lpad("worst", 8) + lpad(">50ms", 7));
  for (const r of rows.filter(r => r[0] === "scroll")) out.push(pad(r[1], 36) + lpad(r[2], 8) + lpad(r[3], 8) + lpad(r[4], 8) + lpad(r[5], 8) + lpad(r[6], 7));
  out.push("");
  out.push(pad("opening (ms from the tap)", 36) + lpad("ident", 8) + lpad("settled", 9) + lpad("worst frame", 13));
  for (const r of rows.filter(r => r[0] === "open")) out.push(pad(r[1], 36) + lpad(r[2], 8) + lpad(r[3], 9) + lpad(r[4], 13));
  out.push("");
  out.push(errors.length ? "page errors: " + errors.slice(0, 3).join(" | ") : "no page errors");
  const text = out.join("\n");
  console.log(text);
  if (OUT) { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, text + "\n"); }
  await browser.close(); server.close();
})().catch(e => { console.error(e); process.exit(1); });
