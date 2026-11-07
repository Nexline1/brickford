// shoot-app-monk-start.js — the Monk Mode Start (T-065) in the built Flutter app (app-web/), 375x812, in Chromium.
//
//   node tools/shoot-app-monk-start.js [out dir]   default loop/specs/T-065-monk-start/verification-app/shots
//
// Serves the repo root at /brickford/ on a local port (run tools/build-app.sh first), fixes the clock at Fri 6 Nov 2026
// 10:00, starts from an empty state with a made-up GitHub token, and answers api.github.com from an in-memory fake: the
// REAL GitHub is never called and the token is never printed. It drives the Start for real, through Flutter's semantics
// identifiers and the mouse: Home's Start and the Monk screen's Start, the sheet, the box ticked, a 0.7 s hold that
// aborts, a plain click that does nothing, a 1.6 s hold that starts it, then Day 1 of 21 and the push that left at once.
// Chromium only: there is no iPhone here, and a mouse is not a finger.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "loop/specs/T-065-monk-start/verification-app/shots"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream", ".txt": "text/plain" };
const FAKE_TOKEN = "github_pat_FAKE_FOR_SCREENSHOTS_0123456789";
const TODAY = "2026-11-06";
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

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/app-web/";
  const browser = await chromium.launch();
  const W = 375, H = 812;
  const errors = [], puts = [], gets = [];
  try {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
    await ctx.clock.setFixedTime(new Date(TODAY + "T10:00:00"));
    await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
    let remote = null;
    await ctx.route("https://api.github.com/**", r => {
      const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" };
      const m = r.request().method(), t = Date.now();
      if (m === "OPTIONS") return r.fulfill({ status: 204, headers: cors });
      if (m === "GET") { gets.push(t); return remote ? r.fulfill({ status: 200, contentType: "application/json", headers: cors, body: JSON.stringify({ sha: "s1", content: remote.toString("base64") }) })
        : r.fulfill({ status: 404, contentType: "application/json", headers: cors, body: "{}" }); }
      const body = JSON.parse(r.request().postData());
      puts.push({ t, state: JSON.parse(Buffer.from(body.content, "base64").toString("utf8")).state });
      remote = Buffer.from(body.content, "base64");
      return r.fulfill({ status: 200, contentType: "application/json", headers: cors, body: "{}" });
    });
    // a made-up token (shared_preferences on the web keeps strings JSON-quoted under "flutter.")
    await ctx.addInitScript(t => { if (!localStorage.getItem("flutter.brickford_gh_token")) localStorage.setItem("flutter.brickford_gh_token", JSON.stringify(t)); }, FAKE_TOKEN);
    const page = await ctx.newPage();
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error" && !/youtube\.com|ytimg\.com|^https:\/\/api\.github\.com\//.test((m.location() || {}).url || "")) errors.push(m.text().replace(FAKE_TOKEN, "<token>")); });
    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await page.waitForSelector("[flt-semantics-identifier]", { timeout: 10000 });
    const id = (x, n = 0) => page.locator(`[flt-semantics-identifier="${x}"]`).nth(n);
    const has = async x => (await page.locator(`[flt-semantics-identifier="${x}"]`).count()) > 0;
    const box = async x => id(x).boundingBox();
    // `still`: a shot taken while the button is held must not move the mouse (that is sliding off, which aborts the hold).
    const shot = async (name, still) => { if (!still) { await page.mouse.move(W - 3, 300); await page.waitForTimeout(500); } const f = path.join(OUT, "monk-start-" + name + ".png"); const t = Date.now(); await page.screenshot(still ? { path: f, scale: "css" } : { path: f }); console.log("  shot  " + path.relative(ROOT, f) + (still ? " (held; " + (Date.now() - t) + " ms to take)" : "")); };
    const click = async x => { const b = await box(x); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(700); return b; };
    const stored = async () => { const raw = await page.evaluate(() => localStorage.getItem("flutter.darhikmah_v1")); return raw ? JSON.parse(JSON.parse(raw)) : {}; };
    const size = async (x, label) => { const b = await box(x); check(label + " is at least 44x44", !!b && b.width >= 44 && b.height >= 44, b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing"); };
    const pressHold = async (x, ms) => { const b = await box(x); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(ms); };

    // ---- Home, not started: the one Start button ----
    await page.waitForTimeout(1200);
    await shot("1-home");
    check("Home shows Start Monk Mode, not a day", (await has("home-monk-start")) && !(await has("home-monk")));
    await size("home-monk-start", "Home's Start Monk Mode");

    // ---- the Monk screen, not started ----
    await click("chip-monk");
    await shot("2-monk-not-started");
    check("the Monk screen has the Start button and none of the day's controls", (await has("monk-start")) && !(await has("monk-pri-prayers")) && !(await has("monk-chip-fajr")));
    await size("monk-start", "the Monk screen's Start Monk Mode");

    // ---- the sheet ----
    await click("monk-start");
    await shot("3-sheet");
    check("the sheet is open with the box, Cancel and the hold button", (await has("monk-start-ack")) && (await has("monk-start-cancel")) && (await has("monk-start-hold")));
    await pressHold("monk-start-hold", 1700); await page.mouse.up(); await page.waitForTimeout(400);
    check("unticked, even a 1.7 s press does not start it", !(await stored()).monkStart);
    await click("monk-start-ack");
    await shot("4-sheet-ticked");
    await size("monk-start-hold", "Hold to start");
    await size("monk-start-ack", "the box");
    // a plain click does nothing
    await click("monk-start-hold");
    await page.waitForTimeout(1900);
    check("a plain click on Hold to start does nothing", !(await stored()).monkStart && (await has("monk-start-hold")));
    // 0.7 s then let go
    await pressHold("monk-start-hold", 300);
    await shot("5-holding", true);   // the screenshot itself takes time; it must end before 1.5 s, so this is only a hold that is let go
    await page.mouse.up();
    await page.waitForTimeout(2000);
    check("a 0.7 s hold, then letting go, does not start it", !(await stored()).monkStart && (await has("monk-start-hold")));
    // slide off while holding
    {
      const b = await box("monk-start-hold");
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(500);
      await page.mouse.move(b.x + b.width / 2, b.y - 160, { steps: 6 }); await page.waitForTimeout(1500); await page.mouse.up(); await page.waitForTimeout(400);
      check("sliding off the button during a hold does not start it", !(await stored()).monkStart && (await has("monk-start-hold")));
    }
    check("nothing has been pushed so far", puts.length === 0, puts.length + " pushes");

    // ---- the real hold ----
    const t0 = Date.now();
    await pressHold("monk-start-hold", 900);
    await page.waitForTimeout(800);       // 1.7 s in total
    await page.mouse.up();
    await page.waitForTimeout(900);
    const st = await stored();
    check("a 1.5 s hold starts it: monkStart is today, written once", st.monkStart === TODAY, st.monkStart);
    check("the sheet is gone", !(await has("monk-start-hold")));
    await shot("6-monk-day-1");
    check("the Monk screen reads Day 1 of 21", await page.evaluate(() => document.body.innerText.includes("Day 1 of 21") || [...document.querySelectorAll("[flt-semantics-identifier],flt-semantics")].some(e => (e.getAttribute("aria-label") || e.textContent || "").includes("Day 1 of 21"))));
    check("the Start button is gone from the Monk screen", !(await has("monk-start")));
    await page.waitForTimeout(600);
    check("the date was pushed at once (under 4 s from the press that started it; a debounced push would be 5.5 s), once, and only the start left of Monk", puts.length === 1 && puts[0].t - t0 < 4000 &&
      puts[0].state.monkStart === TODAY && Object.keys(puts[0].state).filter(k => /monk/i.test(k)).join() === "monkStart", puts.length + " pushes");
    await page.waitForTimeout(5000);
    check("no second push follows after the debounce", puts.length === 1, puts.length + " pushes");

    // ---- back to Home ----
    await page.keyboard.press("Escape");
    const back = await box("back").catch(() => null);
    if (back) { await page.mouse.click(back.x + back.width / 2, back.y + back.height / 2); await page.waitForTimeout(900); }
    await shot("7-home-started");
    check("Home shows the day, not Start", (await has("home-monk")) && !(await has("home-monk-start")));
    check("no page or console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
  console.log(fails ? "\n" + fails + " FAILED" : "\nall checks passed");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(String(e.stack || e).replace(FAKE_TOKEN, "<token>")); process.exit(1); });
