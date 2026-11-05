// shoot-app.js — the deployed Flutter app (app-web/), in a browser, as GitHub Pages serves it.
//
//   node tools/shoot-app.js [out dir]     default loop/specs/T-064-flutter-app/shots
//
// Serves the repo root at /brickford/ (Pages' path: /brickford/platform/ and
// /brickford/app-web/ side by side) on a local port; run tools/build-app.sh first. Then:
//   1. opens /brickford/app/ (the hand-written forward) and checks it lands on
//      /brickford/app-web/; screenshots at 375x812: Home, a lecture (opened from
//      Home, then marked watched), Market, Community, Profile. A fresh device:
//      no state is seeded, so every number on screen is the engine's own.
//      Controls are found through Flutter's semantics tree (each carries a
//      semantics identifier), never by guessing coordinates.
//   2. the root service worker: opens /brickford/platform/ until sw.js
//      controls it, then opens /brickford/app/ under that worker and asserts
//      the app still loads and renders, every request it makes is answered,
//      and the worker served none of the app's files (it must not intercept
//      /app/).
//   3. asserts the app asks no host but this one for its own files (fonts,
//      CanvasKit and data are bundled; only the lecture's YouTube embed and
//      its thumbnail are third-party).
// Exits 1 on any failed assertion.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "loop/specs/T-064-flutter-app/shots"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".wasm": "application/wasm", ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf",
  ".woff2": "font/woff2", ".pdf": "application/pdf", ".md": "text/markdown", ".frag": "text/plain", ".bin": "application/octet-stream", ".txt": "text/plain" };

let fails = 0;
const check = (name, ok, detail) => { if (!ok) fails++; console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : "")); };

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

// Flutter paints a canvas: wait for the first frame, then for it to settle.
async function ready(page) {
  await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
  await page.waitForTimeout(2500);
}
// Turn on Flutter's semantics tree (the a11y placeholder), so controls are DOM nodes.
async function semantics(page) {
  await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
  await page.waitForSelector("[flt-semantics-identifier]", { timeout: 10000 });
}
// Click the centre of the (first) node with this semantics identifier.
async function tap(page, id, nth = 0) {
  const el = page.locator(`[flt-semantics-identifier="${id}"]`).nth(nth);
  await el.waitFor({ timeout: 10000 });
  const b = await el.boundingBox();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  return b;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/";
  const browser = await chromium.launch();
  const W = 375, H = 812;
  try {
    // ---- 1. screenshots ----
    {
      const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
      await ctx.clock.setFixedTime(new Date("2026-11-04T12:00:00Z"));
      const page = await ctx.newPage();
      const errors = [], foreign = new Set(), failed = [];
      page.on("pageerror", e => errors.push(e.message));
      // A blocked thumbnail or embed logs "Failed to load resource" against its own URL; those are the
      // offline case the fallback tile exists for, so they are not the app's errors.
      page.on("console", m => { if (m.type() === "error" && !/youtube\.com|ytimg\.com/.test((m.location() || {}).url || "")) errors.push(m.text() + " @ " + ((m.location() || {}).url || "")); });
      page.on("request", r => { const h = new URL(r.url()).host; if (!h.startsWith("localhost") && !/(^|\.)youtube\.com$|ytimg\.com$/.test(h)) foreign.add(h); });
      page.on("requestfailed", r => { if (r.url().startsWith(BASE)) failed.push(r.url()); });
      page.on("response", r => { if (r.url().startsWith(BASE) && r.status() >= 400) failed.push(r.status() + " " + r.url()); });
      await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());   // the embed's own host; not part of what is measured
      await page.goto(BASE + "app/", { waitUntil: "load" });
      await page.waitForURL(BASE + "app-web/", { timeout: 10000 }).catch(() => {});
      check("/brickford/app/ forwards to /brickford/app-web/", page.url() === BASE + "app-web/", page.url());
      await ready(page);
      await semantics(page);
      await page.waitForTimeout(500);
      const shot = async name => { const f = path.join(OUT, name + ".png"); await page.screenshot({ path: f }); console.log("  shot  " + path.relative(ROOT, f)); };
      await shot("home");
      // Tap targets on Home: the bar's tabs and the search button are at least 44x44.
      for (const id of ["tab-Home", "tab-Market", "tab-Community", "tab-Profile", "search"]) {
        const b = await page.locator(`[flt-semantics-identifier="${id}"]`).boundingBox();
        check(id + " is at least 44x44", b && b.width >= 44 && b.height >= 44, b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing");
      }
      // The first lecture card, scrolled into view inside the sheet.
      const card = page.locator('[flt-semantics-identifier="lecture"]').first();
      check("Home lists today's lectures as cards", await card.count() > 0);
      await page.mouse.move(W / 2, 600);
      await page.mouse.wheel(0, 260);
      await page.waitForTimeout(800);
      await shot("home-scrolled");
      await tap(page, "lecture");
      await page.waitForTimeout(1500);
      await shot("lesson");
      await tap(page, "lesson-mark");
      await page.waitForTimeout(800);
      await shot("lesson-watched");
      const stored = await page.evaluate(() => localStorage.getItem("flutter.darhikmah_v1"));
      const S = stored ? JSON.parse(JSON.parse(stored)) : null;
      const marked = S ? Object.entries(S.lessons || {}).filter(([, v]) => v.done) : [];
      check("Mark watched writes S.lessons[k] = {done, doneAt} in the web app's shape", marked.length === 1 && marked[0][1].doneAt === "2026-11-04",
        marked.length ? marked[0][0] + " " + JSON.stringify(marked[0][1]) : "nothing stored");
      await tap(page, "lesson-back");
      await page.waitForTimeout(1000);
      for (const name of ["Market", "Community", "Profile"]) {
        await tap(page, "tab-" + name);
        await page.waitForTimeout(1200);
        await shot(name.toLowerCase());
      }
      await tap(page, "search");
      await page.waitForTimeout(800);
      await page.keyboard.type("eigen");
      await page.waitForTimeout(800);
      await shot("search");
      check("no page or console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
      check("every request for the app's own files is answered", failed.length === 0, failed.slice(0, 3).join(", "));
      check("no third-party host is asked for anything but the lecture's video", foreign.size === 0, [...foreign].join(", "));
      await ctx.close();
    }

    // ---- 2. under the site's root service worker ----
    {
      const ctx = await browser.newContext({ viewport: { width: W, height: H } });
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(BASE + "platform/", { waitUntil: "load" });
      await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 })
        .catch(async () => { await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 30000 }); });
      const scope = await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).scope);
      const fromSW = [], appReqs = [];
      page.on("response", r => { if (r.url().startsWith(BASE + "app-web/")) { appReqs.push(r.url()); if (r.fromServiceWorker()) fromSW.push(r.url()); } });
      await page.goto(BASE + "app-web/", { waitUntil: "load" });
      await ready(page);
      const st = await page.evaluate(() => ({ controlled: !!navigator.serviceWorker.controller, view: !!document.querySelector("flutter-view, flt-glass-pane"),
        regs: null }));
      const regs = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).map(r => r.scope));
      await page.screenshot({ path: path.join(OUT, "home-under-root-sw.png") });
      check("the root sw.js is registered for the whole site (" + scope + ") and controls /app-web/ too", st.controlled && scope === BASE, "scope " + scope);
      check("under it, /app-web/ loads and renders, with no page errors", st.view && errors.length === 0, errors.slice(0, 2).join(" | "));
      check("sw.js answers none of /app-web/'s requests (they go to the network as if it were not there)", appReqs.length > 0 && fromSW.length === 0,
        appReqs.length + " requests, " + fromSW.length + " from the worker" + (fromSW.length ? ": " + fromSW.slice(0, 3).join(", ") : ""));
      check("the app registers no service worker of its own", regs.length === 1 && regs[0] === BASE, regs.join(", "));
      // And the web app is still the worker's: platform/ comes back from it, rendered.
      const back = await page.goto(BASE + "platform/", { waitUntil: "load" });
      await page.waitForSelector(".main", { timeout: 15000 }).catch(() => {});
      check("platform/ still loads under the same worker afterwards", back && back.ok() && await page.locator(".main").count() > 0,
        back ? back.status() + (back.fromServiceWorker() ? " (from the worker)" : " (network)") : "no response");
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(fails ? "\n" + fails + " check(s) FAILED" : "\nall checks passed");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
