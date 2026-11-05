// verify-boot.js — how the Flutter app (app-web/) starts, in Chromium, served as GitHub Pages serves it (T-064 boot).
//
//   node tools/verify-boot.js [shots dir]     run tools/build-app.sh first
//
// The owner's iPhone showed a blank #12141C page at /brickford/app/: no frame,
// no error. So this asserts, under a /brickford/ prefix with Pages' directory
// redirect (/brickford/app -> /brickford/app/):
//   1. /brickford/app/, /brickford/app and /brickford/app-web/ each end on
//      /brickford/app-web/ and render the app: Flutter's first frame fires,
//      the boot screen is gone, the Home tab is in the semantics tree.
//   2. the boot screen is there from the first paint (before any script ran
//      past the inline one) and its byte count is real: it rises, and ends
//      at or under the build's total, and within 25% of what was transferred.
//   3. with main.dart.js blocked, the failure screen appears, with the error,
//      the URL, the user agent, the WebGL / WebGL2 / WebAssembly line and the
//      Reset and reload button; with canvaskit.wasm hanging, the same screen
//      appears after 25 s with no error ("No first frame").
//   4. the root sw.js: /brickford/platform/ first, until sw.js controls it,
//      then /brickford/app-web/ in the same context renders, and sw.js answers
//      none of its requests. Then, with main.dart.js blocked in that context,
//      Reset and reload unregisters every worker, empties every cache, and
//      reloads.
//   5. startup does not read summaries.json, nothing comes from a CDN or any
//      host but this one, and the data JSON is served minified.
// Exits 1 on any failed assertion.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const { BOOT_FILES } = require("./boot-files.js");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "loop/specs/T-064-flutter-app/shots"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream",
  ".frag": "text/plain", ".txt": "text/plain", ".md": "text/markdown", ".pdf": "application/pdf" };

let fails = 0;
const check = (name, ok, detail) => { if (!ok) fails++; console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : "")); };

function serve() {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    if (!u.pathname.startsWith("/brickford/")) { res.writeHead(404); return res.end(); }
    let p = path.join(ROOT, decodeURIComponent(u.pathname.slice("/brickford/".length)));
    if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      if (!u.pathname.endsWith("/")) { res.writeHead(301, { Location: u.pathname + "/" + u.search }); return res.end(); }  // Pages does this
      p = path.join(p, "index.html");
    }
    if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

// Recorded from the first script on every page: whether #boot is on screen at
// DOMContentLoaded, the boot line every 200 ms, and when the first frame came.
const PROBE = () => {
  window.__probe = { boot0: null, lines: [], firstFrame: null, t0: performance.now() };
  document.addEventListener("DOMContentLoaded", () => {
    const b = document.getElementById("boot");
    window.__probe.boot0 = b ? { display: getComputedStyle(b).display, text: b.innerText.slice(0, 80) } : null;
  });
  window.addEventListener("flutter-first-frame", () => { window.__probe.firstFrame = performance.now() - window.__probe.t0; });
  const iv = setInterval(() => {
    const n = document.getElementById("bootNum");
    if (n) window.__probe.lines.push(n.textContent); else clearInterval(iv);
  }, 200);
};
const mbOf = line => { const m = /([\d.]+) of ~([\d.]+) MB/.exec(line || ""); return m ? [+m[1], +m[2]] : null; };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/";
  const browser = await chromium.launch();
  const W = 375, H = 812;
  const fresh = async (opts = {}) => {
    const ctx = await browser.newContext(Object.assign({ viewport: { width: W, height: H }, deviceScaleFactor: 2 }, opts));
    await ctx.addInitScript(PROBE);
    await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());   // a lecture card's thumbnail: third-party by design, not the app's own files
    return ctx;
  };
  const booted = async (page, ms = 60000) => {
    await page.waitForFunction(() => window.__probe && window.__probe.firstFrame != null && !document.getElementById("boot"), null, { timeout: ms });
    await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await page.waitForSelector('[flt-semantics-identifier="tab-Home"]', { timeout: 15000 });
  };
  try {
    // ---- 1, 2, 5: the three ways in ----
    for (const [entry, shot] of [["app/", "boot-app-slash"], ["app", "boot-app-noslash"], ["app-web/", "boot-app-web"]]) {
      const ctx = await fresh({ serviceWorkers: "block" });
      const page = await ctx.newPage();
      const reqs = [], foreign = new Set(), errors = [];
      let lastBoot = null;
      page.on("pageerror", e => errors.push(e.message));
      page.on("request", r => { const u = new URL(r.url()); if (u.host !== new URL(BASE).host && !/(^|\.)youtube\.com$|ytimg\.com$/.test(u.host)) foreign.add(u.host); });
      page.on("requestfinished", async r => {
        const u = r.url();
        if (!u.startsWith(BASE)) return;
        try { const s = await r.sizes(); reqs.push({ u: u.slice((BASE + "app-web/").length), bytes: s.responseBodySize, at: Date.now() }); } catch (e) {}
      });
      await page.goto(BASE + entry, { waitUntil: "commit" });
      await page.waitForURL(BASE + "app-web/", { timeout: 15000 }).catch(() => {});
      check("/brickford/" + entry + " ends on /brickford/app-web/", page.url() === BASE + "app-web/", page.url());
      await page.waitForFunction(() => !!document.getElementById("boot") || (window.__probe && window.__probe.firstFrame != null), null, { timeout: 15000 });
      try { await booted(page); } catch (e) { lastBoot = await page.evaluate(() => { const b = document.getElementById("boot"); return b ? b.innerText : null; }); }
      const probe = await page.evaluate(() => window.__probe);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUT, shot + ".png") });
      const home = await page.locator('[flt-semantics-identifier="tab-Home"]').count();
      check("  it renders the app: first frame, boot screen gone, Home on screen", probe.firstFrame != null && home > 0 && !lastBoot,
        probe.firstFrame != null ? "first frame at " + Math.round(probe.firstFrame) + " ms" : "boot screen still says: " + (lastBoot || "").slice(0, 160));
      if (entry === "app-web/") {
        check("the boot screen is on screen at the first paint (DOMContentLoaded), with the wordmark and the count",
          probe.boot0 && probe.boot0.display !== "none" && /BRICKFORD/.test(probe.boot0.text), JSON.stringify(probe.boot0));
        const nums = probe.lines.map(mbOf).filter(Boolean);
        const last = nums[nums.length - 1] || [0, 0];
        const rising = nums.some((x, i) => i > 0 && x[0] > nums[i - 1][0]);
        const appBytes = reqs.filter(r => r.at).reduce((a, r) => a + (r.bytes || 0), 0) / 1048576;
        check("the boot count is real progress: it rises, and ends at or under its total and near what was transferred", rising && last[0] <= last[1] + 0.05 && last[0] > 0.75 * appBytes,
          nums.length + " samples; last " + last[0] + " of ~" + last[1] + " MB; " + appBytes.toFixed(1) + " MB fetched by the time Home was up; e.g. " +
          [...new Set(probe.lines)].filter((_, i, a) => i % Math.max(1, Math.floor(a.length / 5)) === 0).slice(0, 6).join(" | "));
        const got = new Set(reqs.map(r => r.u.split("?")[0]));
        check("startup does not read summaries.json (it loads when a lecture opens)", !got.has("assets/assets/data/summaries.json"), [...got].filter(u => /data\//.test(u)).join(", "));
        const boot = BOOT_FILES.filter(f => !/canvaskit\//.test(f));
        const missing = boot.filter(f => !got.has(f));
        check("the boot total's file list matches what a start reads (CanvasKit aside: Chromium takes canvaskit/chromium/)", missing.length === 0,
          missing.length ? "listed but not read: " + missing.join(", ") : boot.length + " files; read too: " +
          [...got].filter(u => !BOOT_FILES.includes(u)).join(", "));
        const json = await page.evaluate(async b => (await (await fetch(b + "app-web/assets/assets/data/courses.json")).text()).slice(0, 200), BASE);
        check("the data JSON is served minified", !/\n/.test(json), json.slice(0, 40));
      }
      check("  no host but this one (no CDN fonts or CanvasKit)", foreign.size === 0, [...foreign].join(", "));
      check("  no page errors", errors.length === 0, errors.slice(0, 2).join(" | "));
      await ctx.close();
    }

    // ---- 2b: a slow line (about 2 bars of LTE): the count climbs while the screen waits ----
    {
      const ctx = await fresh({ serviceWorkers: "block" });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.2 * 1048576, uploadThroughput: 256 * 1024 });
      await page.goto(BASE + "app-web/", { waitUntil: "commit" });
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(OUT, "boot-loading.png") });
      let ok = true;
      try { await booted(page, 90000); } catch (e) { ok = false; }
      const probe = await page.evaluate(() => window.__probe);
      const nums = probe.lines.map(mbOf).filter(Boolean).map(x => x[0]);
      const steps = new Set(nums).size, mono = nums.every((x, i) => !i || x >= nums[i - 1]);
      check("on a 1.2 MB/s line the boot screen stays up and its count climbs in real steps until the first frame",
        ok && steps >= 5 && mono && nums.length > 10,
        nums.length + " samples, " + steps + " distinct values, " + (nums[0] || 0) + " -> " + (nums[nums.length - 1] || 0) + " MB; first frame at " +
        (probe.firstFrame != null ? (probe.firstFrame / 1000).toFixed(1) + " s" : "never"));
      await ctx.close();
    }

    // ---- 3a: main.dart.js blocked ----
    {
      const ctx = await fresh({ serviceWorkers: "block" });
      await ctx.route(/main\.dart\.js/, r => r.abort());
      const page = await ctx.newPage();
      await page.goto(BASE + "app-web/", { waitUntil: "load" });
      await page.waitForSelector("#boot.failed", { timeout: 20000 }).catch(() => {});
      const f = await page.evaluate(() => { const b = document.getElementById("boot"); return b && { failed: b.className, text: b.innerText,
        btn: !!document.getElementById("bootReset") && getComputedStyle(document.getElementById("bootReset")).display !== "none" }; });
      await page.screenshot({ path: path.join(OUT, "boot-failed-blocked.png") });
      check("main.dart.js blocked: the failure screen, with the error, URL, user agent, WebGL/WebGL2/WebAssembly and Reset and reload",
        f && /failed/.test(f.failed) && /main\.dart\.js/.test(f.text) && f.text.includes(BASE + "app-web/") && f.text.includes("Chrome") &&
        /WebGL (yes|NO) · WebGL2 (yes|NO) · WebAssembly (yes|NO)/.test(f.text) && f.btn,
        f ? f.text.replace(/\s+/g, " ").slice(0, 300) : "no boot screen");
      await ctx.close();
    }

    // ---- 3b: canvaskit.wasm never arrives: the 25 s watchdog ----
    {
      const ctx = await fresh({ serviceWorkers: "block" });
      await ctx.route(/canvaskit\.wasm/, () => {});            // never answered
      const page = await ctx.newPage();
      const t = Date.now();
      await page.goto(BASE + "app-web/", { waitUntil: "load" });
      await page.waitForSelector("#boot.failed", { timeout: 40000 }).catch(() => {});
      const s = (Date.now() - t) / 1000;
      const text = await page.evaluate(() => { const b = document.getElementById("boot"); return b ? b.innerText : ""; });
      await page.screenshot({ path: path.join(OUT, "boot-failed-timeout.png") });
      check("canvaskit.wasm hanging: the failure screen at 25 s, saying no first frame came", /No first frame after 25 s/.test(text) && s >= 24 && s < 35,
        Math.round(s) + " s; " + text.replace(/\s+/g, " ").slice(0, 200));
      await ctx.close();
    }

    // ---- 4: under the root sw.js, then Reset and reload ----
    {
      const ctx = await fresh();
      const page = await ctx.newPage();
      await page.goto(BASE + "platform/", { waitUntil: "load" });
      await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 })
        .catch(async () => { await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 30000 }); });
      const before = await page.evaluate(async () => ({ regs: (await navigator.serviceWorker.getRegistrations()).length, caches: (await caches.keys()).length }));
      const fromSW = [], appReqs = [];
      page.on("response", r => { if (r.url().startsWith(BASE + "app-web/")) { appReqs.push(r.url()); if (r.fromServiceWorker()) fromSW.push(r.url()); } });
      await page.goto(BASE + "app-web/", { waitUntil: "commit" });
      let ok = true;
      try { await booted(page); } catch (e) { ok = false; }
      check("after /brickford/platform/ registered sw.js (" + before.regs + " worker, " + before.caches + " caches), /brickford/app-web/ in the same context renders",
        ok && before.regs >= 1);
      check("sw.js answers none of /app-web/'s requests", appReqs.length > 0 && fromSW.length === 0, appReqs.length + " requests, " + fromSW.length + " from the worker");
      // Now break it, and press Reset and reload.
      await ctx.route(/main\.dart\.js/, r => r.abort());
      await page.reload({ waitUntil: "load" });
      await page.waitForSelector("#boot.failed", { timeout: 20000 });
      const nav = page.waitForEvent("framenavigated", { timeout: 15000 });
      await page.click("#bootReset");
      await nav;
      await page.waitForLoadState("load");
      const after = await page.evaluate(async () => ({ regs: (await navigator.serviceWorker.getRegistrations()).length, caches: (await caches.keys()).length }));
      check("Reset and reload, with the app broken: every worker unregistered, every cache deleted, the page reloaded", after.regs === 0 && after.caches === 0 && before.caches > 0,
        "before " + JSON.stringify(before) + ", after " + JSON.stringify(after));
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(fails ? "\n" + fails + " check(s) FAILED" : "\nall checks passed");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
