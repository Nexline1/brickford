// shoot-app-stage4.js — the quiz, Problems and Exams in the built Flutter app (app-web/), 375x812.
//
//   node tools/shoot-app-stage4.js [out dir]     default loop/specs/T-064-flutter-app/shots (stage4-*.png)
//
// Serves the repo root at /brickford/ on a local port (run tools/build-app.sh first), fixes the clock at
// Tue 27 Oct 2026 08:15 (plan day 9) and seeds a state in the web app's shape: one lecture owing its quiz, a
// catch-up quiz, psets and labs unlocked, diagnostics and banks sat. It then answers the lecture quiz for real
// (the options by trying them, the numeric from the data) and checks what it wrote. Controls are found through
// Flutter's semantics identifiers; every control shot is measured at 44x44 or more. Exits 1 on a failed assertion.
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
const pass = { quiz: { passedAt: "2026-10-26" } };
const state = {
  lessons: { "math110.0.0": w("2026-10-26"), "math110.0.1": w("2026-10-26", pass), "math110.0.2": w("2026-10-26", pass), "math110.1.1": w("2026-10-20"),
    "math110.1.4": w("2026-10-26", pass), "math110.1.5": w("2026-10-26"), "ai200.0.0": w("2026-10-26"), "math120.0.0": w("2026-10-26") },
  problems: { "Arrays & Hashing|Two Sum": "2026-10-27" },
  diag: { "diag-la": { score: 70, date: "2026-10-26" }, "diag-code": { score: null, date: "2026-10-26" } },
  quizAttempts: { "linear-algebra": [{ date: "2026-10-26", score: 10, total: 15, pct: 70 }], calculus: [{ date: "2026-10-26", score: 9, total: 15, pct: 60 }] },
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/app-web/";
  const browser = await chromium.launch();
  const W = 375, H = 812;
  const errors = [], hosts = new Set();
  const sm = JSON.parse(fs.readFileSync(path.join(ROOT, "app/assets/data/summaries.json"), "utf8"));
  try {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
    await ctx.clock.setFixedTime(new Date("2026-10-27T08:15:00"));
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
    const shot = async name => { await page.mouse.move(W - 3, 300); await page.waitForTimeout(900); const f = path.join(OUT, "stage4-" + name + ".png"); await page.screenshot({ path: f }); console.log("  shot  " + path.relative(ROOT, f)); };
    const tap = async (x, n = 0) => { const b = await id(x, n).boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(700); return b; };
    const sized = async (ids, label) => {
      const small = [];
      for (const x of ids) { const b = await id(x).boundingBox().catch(() => null); if (!b || b.width < 44 || b.height < 44) small.push(x + " " + (b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing")); }
      check(label + " are at least 44x44", small.length === 0, small.join(", ") || ids.length + " measured");
    };
    const stored = async () => JSON.parse(JSON.parse(await page.evaluate(() => localStorage.getItem("flutter.darhikmah_v1"))));

    // ---- Problems ----
    await tap("tab-Market");
    await page.waitForSelector('[flt-semantics-identifier="due-quiz-math110.0.0"]', { timeout: 10000 });
    await shot("problems");
    await sized(["due-quiz-math110.0.0", "due-catchup-math110.1.1", "due-pset-1806-ps1", "market-tab-due", "market-tab-exams", "market-tab-code"], "the Problems rows and the chips");
    await page.mouse.move(W / 2, 500); await page.mouse.wheel(0, 700); await page.waitForTimeout(700);
    await sized(["due-lab-flashcards-cli"], "a lab row, scrolled to");
    await page.mouse.wheel(0, -1400); await page.waitForTimeout(500);

    // ---- the lecture quiz, answered for real ----
    await tap("due-quiz-math110.0.0");
    await page.waitForSelector('[flt-semantics-identifier="opt-0"], [flt-semantics-identifier="quiz-num"]', { timeout: 20000 });
    await shot("quiz-question");
    const checks = sm["math110.0.0"].checks;
    let shownFeedback = false, tries = 0, steps = 0;
    const ANY = '[flt-semantics-identifier="opt-0"], [flt-semantics-identifier="quiz-num"], [flt-semantics-identifier="quiz-done"]';
    for (; steps < 14; steps++) {
      await page.waitForSelector(ANY, { timeout: 10000 });
      if (await has("quiz-done")) break;
      if (await has("opt-0")) {
        const n = (await has("opt-3")) ? 4 : (await has("opt-2")) ? 3 : 2;
        if (steps === 0) await sized(Array.from({ length: n }, (_, i) => "opt-" + i), "the answer options");
        // The options are reshuffled on every showing: find the right one by its text, as a reader would.
        const mcq = checks.find(q => q.opts), want = mcq.opts[mcq.a];
        let pick = 0;
        if (tries++ > 0 || steps > 0) for (let i = 0; i < n; i++) if (((await id("opt-" + i).evaluate(e => e.getAttribute("aria-label") || e.textContent)) || "").includes(want)) pick = i;
        await tap("opt-" + (tries === 1 ? 0 : pick));   // the first showing is answered wrong on purpose, for the feedback shot
      } else {
        const num = checks.find(q => q.num != null).num;
        await tap("quiz-num");
        await page.keyboard.type(String(num));
        await tap("quiz-submit");
      }
      if (!shownFeedback) { shownFeedback = true; await shot("quiz-feedback"); await sized(["quiz-next"], "Next"); }
      await tap("quiz-next");
    }
    check("the sitting ended (every question right once, misses come back)", await has("quiz-done"), steps + " answers");
    await shot("quiz-result");
    await sized(["quiz-done"], "Done");
    const rec = (await stored()).lessons["math110.0.0"];
    check("passing wrote lessons[k].quiz in the web app's shape (passedAt, firstTry, total, attempts, at)", rec.quiz && rec.quiz.passedAt === "2026-10-27" && rec.quiz.total === checks.length &&
      Number.isInteger(rec.quiz.firstTry) && rec.quiz.attempts >= rec.quiz.total && typeof rec.quiz.at === "string", JSON.stringify(rec.quiz));
    await tap("quiz-done");
    await page.waitForTimeout(500);
    check("the passed quiz left Problems", !(await has("due-quiz-math110.0.0")));

    // ---- Exams ----
    await tap("market-tab-exams");
    await page.waitForSelector('[flt-semantics-identifier="exam-sit"]', { timeout: 10000 });
    await shot("exams");
    await sized(["exam-sit"], "the exam hero's Sit");
    await page.mouse.move(W / 2, 500); await page.mouse.wheel(0, 640); await page.waitForTimeout(700);
    await shot("exams-more");
    await sized(["exam-linear-algebra"], "an open exam, scrolled to");
    await page.mouse.wheel(0, -1400); await page.waitForTimeout(500);
    // the diagnostic: the exam clock, the paper, the honest score
    await tap("exam-sit");
    await page.waitForSelector('[flt-semantics-identifier="diag-begin"]', { timeout: 10000 });
    await shot("diag");
    await sized(["diag-begin"], "Begin");
    check("no page or console errors, and no host but this one was asked", errors.length === 0 && hosts.size === 0, errors.slice(0, 3).join(" | ") + [...hosts].join(","));
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(String(e.stack || e)); process.exit(1); });
