// capture.js — T-072: what the Flutter app's first seconds look like, frame by frame.
//
//   node loop/specs/T-072-boot-consistency/capture.js <out dir>     (serves app-web/ as it is built)
//
// 390x844 at deviceScaleFactor 2, no service worker, a throttled line (1.2 MB/s, 150 ms) so the
// HTML boot and the Flutter splash each stay on screen long enough to see. Saves:
//   NN-t<ms>.png      every DISTINCT frame, in order (a screenshot is taken roughly every 150 ms from
//                     navigation until the Shell has settled; repeats of the previous frame are dropped)
//   log.json          when the first frame came, and which font files had finished by then
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "../../..");
const OUT = path.resolve(process.argv[2] || path.join(__dirname, "verification/capture"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".bin": "application/octet-stream" };

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

// In the page: when the first frame came, and which font files had finished by then.
const PROBE = () => {
  window.__cap = { t0: performance.now(), ff: null, fontsAtFF: null };
  window.addEventListener("flutter-first-frame", () => {
    window.__cap.ff = performance.now() - window.__cap.t0;
    window.__cap.fontsAtFF = performance.getEntriesByType("resource").filter(e => /\.(ttf|otf)/.test(e.name))
      .map(e => ({ f: e.name.split("/").pop(), end: Math.round(e.responseEnd), type: e.initiatorType }));
  });
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (/\.(png|json)$/.test(f)) fs.unlinkSync(path.join(OUT, f));
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/";
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: "block" });
  await ctx.addInitScript(PROBE);
  await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.2 * 1048576, uploadThroughput: 256 * 1024 });
  const t0 = Date.now(), reqs = [];
  page.on("requestfinished", r => { if (/\.(ttf|otf|json)(\?|$)/.test(r.url())) reqs.push({ u: r.url().split("/").pop(), at: Date.now() - t0 }); });
  await page.goto(BASE + "app-web/", { waitUntil: "commit" });
  let ffAt = null;
  const shots = [];
  while (Date.now() - t0 < 120000) {
    const t = Date.now() - t0;
    const f = "t" + String(t).padStart(6, "0") + ".png";
    await page.screenshot({ path: path.join(OUT, f) });
    const s = await page.evaluate(() => ({ ff: window.__cap && window.__cap.ff, boot: !!document.getElementById("boot"),
      bootOpacity: document.getElementById("boot") ? getComputedStyle(document.getElementById("boot")).opacity : null }));
    shots.push({ f, t, boot: s.boot, bootOpacity: s.bootOpacity, ff: s.ff != null });
    if (s.ff != null && ffAt == null) ffAt = t;
    const dataDone = reqs.filter(r => /\.json$/.test(r.u)).length;
    if (ffAt != null && t - ffAt > 6000 && dataDone > 0 && t - Math.max(...reqs.map(r => r.at)) > 3000) break;
    await page.waitForTimeout(100);
  }
  const cap = await page.evaluate(() => window.__cap);
  // Keep only the frames that differ from the one before, renamed in order: NN-t<ms>.png.
  let prev = null, n = 0;
  const crypto = require("crypto");
  for (const s of shots) {
    const p = path.join(OUT, s.f), h = crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex");
    if (h === prev) { fs.unlinkSync(p); s.kept = null; continue; }
    prev = h; s.kept = String(++n).padStart(2, "0") + "-" + s.f;
    fs.renameSync(p, path.join(OUT, s.kept));
  }
  fs.writeFileSync(path.join(OUT, "log.json"), JSON.stringify({ firstFrameMs: cap.ff, fontsAtFirstFrame: cap.fontsAtFF, requests: reqs, shots }, null, 1));
  console.log("first frame at " + Math.round(cap.ff) + " ms; fonts finished by then: " + JSON.stringify(cap.fontsAtFF));
  console.log(shots.length + " shots in " + OUT);
  await browser.close();
  server.close();
})().catch(e => { console.error(e); process.exit(1); });
