// shoot-app-stage6a.js — Atlas, a course and its unit, Recall, Drill, Electives and the Home review row in the built Flutter app (app-web/), 375x812.
//
//   node tools/shoot-app-stage6a.js [out dir]     default loop/specs/T-064-flutter-app/shots (stage6a-*.png)
//
// Serves the repo root at /brickford/ on a local port (run tools/build-app.sh first), fixes the clock at Wed 4 Nov 2026 08:15
// (plan day 17) and seeds a state in the web app's shape: proven lectures in the rotation (three due, four coming up, one with
// two lapses), a miss pool, a passed gate. It then does the real things: grades a recall, answers a drill question, cycles an
// elective, and reads back what each wrote from localStorage. Controls are found through Flutter's semantics identifiers;
// every control shot is measured at 44x44 or more. Exits 1 on a failed assertion.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "loop/specs/T-064-flutter-app/shots"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream", ".txt": "text/plain" };
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
const rv = (box, due, lapses) => ({ box, due, last: "2026-10-30", lapses });
const state = {
  lessons: {
    "math110.0.0": w("2026-10-20", pv("2026-10-21")), "math110.0.1": w("2026-10-21", pv("2026-10-22")), "math110.0.2": w("2026-10-22", pv("2026-10-23")),
    "math110.0.3": w("2026-10-23", pv("2026-10-24")), "math110.0.4": w("2026-10-26", pv("2026-10-27")), "math110.0.5": w("2026-10-27", pv("2026-10-28")),
    "math110.0.6": w("2026-10-28"), "math110.0.7": w("2026-10-29"), "ai200.0.0": w("2026-10-22", pv("2026-10-23")), "ai200.0.1": w("2026-10-24"), "math120.0.0": w("2026-10-27"),
  },
  review: {
    "math110.0.0": rv(0, "2026-11-01", 2), "math110.0.1": rv(1, "2026-11-03", 0), "ai200.0.0": rv(2, "2026-11-04", 1),
    "math110.0.2": rv(1, "2026-11-08", 0), "math110.0.3": rv(2, "2026-11-12", 0), "math110.0.4": rv(0, "2026-11-06", 0), "math110.0.5": rv(3, "2026-12-02", 0),
  },
  gates: { 1: { date: "2026-10-30", at: "2026-10-30T09:00:00.000Z", passed: true } },
  quizAttempts: { "linear-algebra": [{ date: "2026-10-28", score: 11, total: 15, pct: 73 }] },
  quizMisses: { calculus: [0, 1, 2], "linear-algebra": [] },
  problems: { "Arrays & Hashing|Two Sum": "2026-10-27", "Arrays & Hashing|Valid Anagram": "2026-10-28", "Stack|Min Stack": "2026-10-30" },
  studyDays: ["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-11-01", "2026-11-02", "2026-11-03"],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/app-web/";
  const browser = await chromium.launch();
  const W = 375, H = 812;
  const errors = [], hosts = new Set();
  try {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
    await ctx.clock.setFixedTime(new Date("2026-11-04T08:15:00"));
    await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
    await ctx.addInitScript(s => { if (!localStorage.getItem("flutter.darhikmah_v1")) localStorage.setItem("flutter.darhikmah_v1", s); }, JSON.stringify(JSON.stringify(state)));
    const page = await ctx.newPage();
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error" && !/youtube\.com|ytimg\.com/.test((m.location() || {}).url || "")) errors.push(m.text()); });
    page.on("request", r => { const h = new URL(r.url()).host; if (!h.startsWith("localhost") && !/(^|\.)youtube\.com$|ytimg\.com$/.test(h)) hosts.add(h); });
    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await page.waitForSelector("[flt-semantics-identifier]", { timeout: 10000 });
    const id = (x, n = 0) => page.locator(`[flt-semantics-identifier="${x}"]`).nth(n);
    const has = async x => (await id(x).count()) > 0;
    const shot = async name => { await page.mouse.move(W - 3, 300); await page.waitForTimeout(900); const f = path.join(OUT, "stage6a-" + name + ".png"); await page.screenshot({ path: f }); console.log("  shot  " + path.relative(ROOT, f)); };
    const tap = async (x, n = 0) => { const b = await id(x, n).boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(700); return b; };
    const wait = x => page.waitForSelector(`[flt-semantics-identifier="${x}"]`, { timeout: 10000 });
    const scroll = async dy => { await page.mouse.move(W / 2, 500); await page.mouse.wheel(0, dy); await page.waitForTimeout(700); };
    const sized = async (ids, label) => {
      const small = [];
      for (const x of ids) { const b = await id(x).boundingBox().catch(() => null); if (!b || b.width < 44 || b.height < 44) small.push(x + " " + (b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing")); }
      check(label + " are at least 44x44", small.length === 0, small.join(", ") || ids.length + " measured");
    };
    const stored = async () => JSON.parse(JSON.parse(await page.evaluate(() => localStorage.getItem("flutter.darhikmah_v1"))));

    // ---- Home: the review row, while three are due ----
    await wait("home-review-go");
    check("Home shows the review row, with its button, while reviews are due", await has("home-review-go"));
    await scroll(260);
    await shot("home-review");
    await sized(["home-review-go"], "the review button");
    await scroll(-1000);

    // ---- Learn: the tools ----
    await tap("tab-Learn");
    await wait("learn-tool-atlas");
    await shot("learn");
    await sized(["learn-tool-atlas", "learn-tool-recall", "learn-tool-drill", "learn-tool-electives"], "the Learn tool buttons");

    // ---- Atlas ----
    await tap("learn-tool-atlas");
    await wait("atlas-tile-math110");
    await shot("atlas");
    await scroll(700);
    await shot("atlas-tiles");
    await sized(["atlas-tile-math110", "back"], "the Atlas controls");
    await scroll(2600);
    await shot("atlas-later");
    await scroll(-3000);
    await scroll(700);
    await tap("atlas-tile-math110");
    await wait("course-continue");
    await shot("course");
    await sized(["course-continue", "unit-math110-0", "back"], "the course controls");
    await tap("unit-math110-0");
    await page.waitForTimeout(500);
    await shot("unit");
    await tap("back");
    await tap("back");
    await tap("back");

    // ---- Recall ----
    await wait("learn-tool-recall");
    await tap("learn-tool-recall");
    await wait("recall-solid-math110.0.0");
    await shot("recall");
    await sized(["recall-forgot-math110.0.0", "recall-shaky-math110.0.0", "recall-solid-math110.0.0", "recall-open-math110.0.0", "back"], "the Recall controls");
    await tap("recall-solid-math110.0.0");
    let S = await stored();
    const r0 = S.review["math110.0.0"], ev = S.ledger[S.ledger.length - 1];
    check("Solid rescheduled it in the web app's shape (box 0 -> 1, due in 7 days, last today, lapses kept) and chained one recall event",
      r0.box === 1 && r0.due === "2026-11-11" && r0.last === "2026-11-04" && r0.lapses === 2 && ev.type === "recall" && ev.ref === "math110.0.0" && ev.data.grade === "solid" && ev.data.box === 1, JSON.stringify(r0));
    await tap("recall-forgot-math110.0.1");
    S = await stored();
    const r1 = S.review["math110.0.1"];
    check("Forgot reset it to the first box and counted a lapse", r1.box === 0 && r1.due === "2026-11-06" && r1.lapses === 1, JSON.stringify(r1));
    await shot("recall-graded");
    await tap("back");

    // ---- Drill ----
    await tap("learn-tool-drill");
    await page.waitForSelector('[flt-semantics-identifier="opt-0"], [flt-semantics-identifier="quiz-num"]', { timeout: 10000 });
    await shot("drill");
    await sized([(await has("opt-0")) ? "opt-0" : "quiz-submit", "back"], "the Drill controls");
    await tap("back");

    // ---- Electives ----
    await wait("learn-tool-electives");
    await tap("learn-tool-electives");
    await wait("elective-status-mitx-686x");
    await shot("electives");
    await sized(["elective-status-mitx-686x", "back"], "the Electives controls");
    await tap("elective-status-mitx-686x");
    S = await stored();
    check("the status tile stores planned in S.electives", S.electives["mitx-686x"] === "planned", JSON.stringify(S.electives));
    await shot("electives-planned");
    await scroll(700);
    await shot("electives-further");
    check("no page or console errors, and no host but this one was asked", errors.length === 0 && hosts.size === 0, errors.slice(0, 3).join(" | ") + [...hosts].join(","));
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(String(e.stack || e)); process.exit(1); });
