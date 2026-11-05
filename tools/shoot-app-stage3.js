// shoot-app-stage3.js — Sync, Monk Mode and Home in the built Flutter app (app-web/), 375x812.
//
//   node tools/shoot-app-stage3.js [out dir]     default loop/specs/T-064-flutter-app/shots (stage3-*.png)
//
// Serves the repo root at /brickford/ on a local port (run tools/build-app.sh first), fixes the clock at
// Thu 5 Nov 2026 08:15 (Monk day 5), seeds Monk days in the web app's S.monk shape, and answers
// api.github.com from an in-memory fake: the REAL GitHub is never called, and the token is a made-up string
// that is never printed. Controls are found through Flutter's semantics identifiers; every control shot is
// measured at 44x44 or more. Exits 1 on a failed assertion.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "loop/specs/T-064-flutter-app/shots"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream", ".txt": "text/plain" };
const FAKE_TOKEN = "github_pat_FAKE_FOR_SCREENSHOTS_0123456789";
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

const monkState = {
  monk: { days: {
    "2026-11-01": { prayers: { fajr: true, dhuhrAsr: true, maghribIsha: true }, nosin: true, work: 10, bfh: 3, german: { podcast: true, speak: true, write: true, read: true }, meditate: true, gym: 1 },
    "2026-11-02": { prayers: { fajr: true, dhuhrAsr: true, maghribIsha: false }, nosin: true, work: 8, bfh: 3, german: { podcast: true, speak: true }, read: true },
    "2026-11-03": { prayers: { fajr: true, dhuhrAsr: true, maghribIsha: true }, nosin: false, work: 10, bfh: 2.5 },
    "2026-11-04": { prayers: { fajr: false, dhuhrAsr: true, maghribIsha: true }, nosin: true, work: 6, bfh: 3, german: { podcast: true, speak: true, write: true, read: true } },
    "2026-11-05": { prayers: { fajr: true, dhuhrAsr: false, maghribIsha: false }, nosin: true, work: 3.5, bfh: 1.5, meditate: true },
  } },
};
const remote = { v: 1, updatedAt: "2026-11-05T05:00:00.000Z", device: "laptop", state: { lessons: {}, studyDays: ["2026-11-04"] }, ledgers: { laptop: [] } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/app-web/";
  const browser = await chromium.launch();
  const W = 375, H = 812;
  const errors = [], hosts = new Set();
  let ghMode = "ok";
  try {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
    await ctx.clock.setFixedTime(new Date("2026-11-05T08:15:00"));
    await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
    await ctx.route("https://api.github.com/**", r => {
      hosts.add("api.github.com");
      if (ghMode === "401") return r.fulfill({ status: 401, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ message: "Bad credentials" }) });
      const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" };
      if (r.request().method() === "OPTIONS") return r.fulfill({ status: 204, headers: cors });
      if (r.request().method() === "GET") return r.fulfill({ status: 200, contentType: "application/json", headers: cors,
        body: JSON.stringify({ sha: "s1", content: Buffer.from(JSON.stringify(remote)).toString("base64") }) });
      return r.fulfill({ status: 200, contentType: "application/json", headers: cors, body: "{}" });
    });
    await ctx.addInitScript(s => { if (!localStorage.getItem("flutter.darhikmah_v1")) localStorage.setItem("flutter.darhikmah_v1", s); }, JSON.stringify(JSON.stringify(monkState)));
    const page = await ctx.newPage();
    page.on("pageerror", e => errors.push(e.message));
    // The 401 shot is a simulated rejection: the browser logs it against the fake's own URL.
    page.on("console", m => { if (m.type() === "error" && !/youtube\.com|ytimg\.com|^https:\/\/api\.github\.com\//.test((m.location() || {}).url || "")) errors.push(m.text().replace(FAKE_TOKEN, "<token>")); });
    page.on("request", r => { const h = new URL(r.url()).host; if (!h.startsWith("localhost") && !/(^|\.)youtube\.com$|ytimg\.com$/.test(h)) hosts.add(h); });
    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await page.waitForSelector("[flt-semantics-identifier]", { timeout: 10000 });
    const id = (x, n = 0) => page.locator(`[flt-semantics-identifier="${x}"]`).nth(n);
    const shot = async name => { await page.mouse.move(W - 3, 300); await page.waitForTimeout(900); const f = path.join(OUT, "stage3-" + name + ".png"); await page.screenshot({ path: f }); console.log("  shot  " + path.relative(ROOT, f)); };
    const tap = async (x, n = 0) => { const b = await id(x, n).boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(700); return b; };
    const sized = async (ids, label) => {
      const small = [];
      for (const x of ids) { const b = await id(x).boundingBox().catch(() => null); if (!b || b.width < 44 || b.height < 44) small.push(x + " " + (b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing")); }
      check(label + " are at least 44x44", small.length === 0, small.join(", ") || ids.length + " measured");
    };
    const wheel = async dy => { await page.mouse.move(W / 2, 560); await page.mouse.wheel(0, dy); await page.waitForTimeout(700); };

    // ---- Home: the badge and the chip ----
    await shot("home");
    await sized(["home-monk", "chip-monk"], "Home's Monk badge and chip");

    // ---- Monk ----
    await tap("home-monk");
    await tap("monk-pri-prayers");
    await shot("monk");
    await sized(["monk-pri-prayers", "monk-pri-nosin", "monk-pri-work", "monk-pri-bfh", "monk-pri-german", "monk-chip-fajr", "monk-chip-dhuhrAsr", "monk-chip-maghribIsha"], "the five priority badges and the prayer chips");
    await tap("monk-chip-dhuhrAsr");
    await tap("monk-pri-bfh");
    await sized(["monk-bfh-minus", "monk-bfh-plus"], "the hours stepper");
    await tap("monk-bfh-plus");
    await shot("monk-hours");
    const stored = JSON.parse(JSON.parse(await page.evaluate(() => localStorage.getItem("flutter.darhikmah_v1"))));
    const day = stored.monk.days["2026-11-05"];
    check("tapping writes S.monk.days[today] in the web app's shape, and the page asked GitHub for nothing", day.prayers.dhuhrAsr === true && day.bfh === 2 && typeof day.at === "string" && !hosts.has("api.github.com"),
      JSON.stringify({ prayers: day.prayers, bfh: day.bfh }));
    await wheel(620);
    await shot("monk-map");
    await wheel(700);
    await shot("monk-also");
    await wheel(900);
    await shot("monk-loops");
    for (let i = 0; i < 4; i++) await page.keyboard.press("Escape");
    await page.reload({ waitUntil: "load" });
    await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await page.waitForSelector("[flt-semantics-identifier]");

    // ---- Sync: not connected, then connected (the fake GitHub), then a rejected token ----
    await tap("tab-Profile");
    await sized(["profile-sync"], "Profile's Sync row");
    await tap("profile-sync");
    await shot("sync-connect");
    await sized(["sync-connect"], "Connect");
    // type the made-up token into the hidden field: it must never be readable afterwards
    await page.mouse.click(W / 2, 300);
    await page.keyboard.type(FAKE_TOKEN);
    await page.waitForTimeout(400);
    await shot("sync-token-typed");
    await tap("sync-connect");
    await page.waitForTimeout(1200);
    const visible = await page.evaluate(t => document.body.innerText.includes(t) || [...document.querySelectorAll("input,textarea,[aria-label]")].some(e => (e.value || "").includes(t) || (e.getAttribute("aria-label") || "").includes(t)), FAKE_TOKEN);
    check("the token is not in the page's text, inputs or labels once saved", !visible);
    await tap("sync-pull");
    await page.waitForTimeout(800);
    await shot("sync");
    await sized(["sync-pull", "sync-push", "sync-forget"], "Pull, Push and Forget");
    await tap("sync-push");
    await page.waitForTimeout(800);
    ghMode = "401";
    await tap("sync-pull");
    await page.waitForTimeout(800);
    await shot("sync-attention");
    ghMode = "ok";
    await tap("sync-pull");
    await tap("sync-forget");
    const left = await page.evaluate(() => Object.keys(localStorage).filter(k => /token/.test(k)));
    check("Forget removes the token from storage", left.length === 0, left.join(","));
    check("only api.github.com (the fake) and this host were asked", [...hosts].every(h => h === "api.github.com"), [...hosts].join(", "));
    check("no page or console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(String(e.stack || e).replace(FAKE_TOKEN, "<token>")); process.exit(1); });
