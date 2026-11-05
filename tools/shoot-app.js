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
//   1b. T-064 stage 2, the calendar: Home's calendar button opens the month
//      (stage2-month), a day opens its sheet (stage2-day-sheet); then, under a
//      Saturday clock with a progress state seeded in the web app's shape (the
//      plan's own lectures for 16-27 Oct, watched on their days), the month
//      again (stage2-month-saturday, and October: stage2-month-progress), a past day's sheet on the rest day (its
//      own lectures, T-063: stage2-saturday-past-day) and the Saturday itself
//      (stage2-rest-saturday). Every day cell, the month buttons and the day
//      rows are measured at 44x44 or more.
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
async function box(page, id, nth = 0) {
  const el = page.locator(`[flt-semantics-identifier="${id}"]`).nth(nth);
  await el.waitFor({ timeout: 10000 });
  return el.boundingBox();
}
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

    // ---- 1b. the calendar ----
    const sized = async (page, ids, label) => {
      const small = [];
      for (const id of ids) {
        const n = await page.locator(`[flt-semantics-identifier="${id}"]`).count();
        for (let i = 0; i < n; i++) {
          const b = await page.locator(`[flt-semantics-identifier="${id}"]`).nth(i).boundingBox();
          if (!b || b.width < 44 || b.height < 44) small.push(id + (n > 1 ? "#" + i : "") + " " + (b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing"));
        }
      }
      check(label + " are at least 44x44", small.length === 0, small.slice(0, 4).join(", ") || ids.length + " ids measured");
    };
    const calendar = async (clock, state, shots) => {
      const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
      await ctx.clock.setFixedTime(new Date(clock + "T12:00:00Z"));
      await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
      if (state) await ctx.addInitScript(s => localStorage.setItem("flutter.darhikmah_v1", s), JSON.stringify(JSON.stringify(state)));
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(BASE + "app-web/", { waitUntil: "load" });
      await ready(page);
      await semantics(page);
      await page.waitForTimeout(500);
      // The pointer off every control first: a click leaves it hovering, and a hovered month button shows its tooltip.
      const shot = async name => { await page.mouse.move(W - 4, 200); await page.waitForTimeout(1600);
        const f = path.join(OUT, name + ".png"); await page.screenshot({ path: f }); console.log("  shot  " + path.relative(ROOT, f)); };
      const hb = await box(page, "home-calendar");
      check("Home's calendar button is at least 44x44", hb && hb.width >= 44 && hb.height >= 44, hb ? Math.round(hb.width) + "x" + Math.round(hb.height) : "missing");
      await tap(page, "home-calendar");
      await page.waitForTimeout(1200);
      await shot(shots.month);
      const month = clock.slice(0, 7), days = new Date(Date.UTC(+month.slice(0, 4), +month.slice(5, 7), 0)).getUTCDate();
      const cells = Array.from({ length: days }, (_, i) => "cal-" + month + "-" + String(i + 1).padStart(2, "0"));
      await sized(page, cells.concat(["cal-prev", "cal-next", "cal-today"]), "the " + days + " day cells of " + month + " and the month buttons (" + clock + ")");
      if (shots.prevMonth) {                            // the month before, where the seeded progress is
        await tap(page, "cal-prev"); await page.waitForTimeout(900);
        await shot(shots.prevMonth);
        await tap(page, "cal-next"); await page.waitForTimeout(700);
      }
      for (const [day, name] of shots.days) {
        if (day.slice(0, 7) < month) { await tap(page, "cal-prev"); await page.waitForTimeout(700); }
        await tap(page, "cal-" + day);
        await page.waitForTimeout(1200);
        await shot(name);
        const rows = await page.locator('[flt-semantics-identifier="day-row"]').count();
        if (rows) await sized(page, ["day-row"], "the " + rows + " lecture rows of " + day);
        await page.mouse.click(W / 2, 40);               // the modal barrier, above the sheet
        await page.waitForTimeout(900);
        if (day.slice(0, 7) < month) { await tap(page, "cal-next"); await page.waitForTimeout(700); }
      }
      check("the calendar (" + clock + ") ran without page errors", errors.length === 0, errors.slice(0, 2).join(" | "));
      await ctx.close();
    };
    await calendar("2026-11-04", null, { month: "stage2-month", days: [["2026-11-03", "stage2-day-sheet"]] });
    // A progress state in the web app's shape: the plan's own lectures for these days, watched on them
    // (16-23 Oct before the quiz gate, so cleared; 27 Oct after it with no quiz passed, so half rings).
    const W8 = (on, passed) => Object.assign({ done: true, doneAt: on, notes: "", checks: [] }, passed ? { quiz: { passedAt: passed } } : {});
    const seeded = { lessons: {}, studyDays: ["2026-10-16", "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21"] };
    const plan = {
      "2026-10-16": ["math110.0.0", "math110.0.1", "math110.0.2", "math110.0.3", "math110.0.4", "math110.0.5", "ai200.0.0", "ai200.0.1"],
      "2026-10-18": ["math120.0.0", "math120.0.1", "math120.0.2", "ai200.0.2", "ai200.0.3", "spch100.0.0"],
      "2026-10-19": ["math130.0.0", "ai200.1.0", "spch100.0.1"],
      "2026-10-20": ["math110.0.6", "math110.0.7", "math110.0.8", "math110.0.9", "math110.0.10", "spch100.0.2"],
      "2026-10-21": ["math120.0.3", "math120.0.4", "math120.0.5"],
      "2026-10-27": ["math110.0.15", "math110.1.0"],
    };
    for (const [on, keys] of Object.entries(plan)) keys.forEach(k => { seeded.lessons[k] = W8(on); });
    seeded.lessons["math110.0.15"] = W8("2026-10-27", "2026-10-27");
    await calendar("2026-11-07", seeded, { month: "stage2-month-saturday", prevMonth: "stage2-month-progress",
      days: [["2026-11-07", "stage2-rest-saturday"], ["2026-10-27", "stage2-saturday-past-day"]] });

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
