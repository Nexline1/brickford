// shoot-app-practice.js — the lecture's Practice block (T-067 step 3) in the built Flutter app (app-web/), 375x812, in Chromium.
//
//   node tools/shoot-app-practice.js [out dir]   default loop/specs/T-067-plan-v2/verification-practice-app/shots
//
// Serves the repo root at /brickford/ on a local port (run tools/build-app.sh first), fixes the clock on the plan's
// first day (MATH 110 Unit I and AI 200's first lecture are scheduled, both with practice items), starts with those
// two lectures watched and a made-up Anthropic key, and answers api.anthropic.com from a stub: the REAL API is never
// called and the key is never printed. It drives the block through Flutter's semantics identifiers and the keyboard:
// Home's Today's practice, the block not tried, a worked item answered (the solution revealed), a written answer
// submitted and graded by the stub. Chromium only: there is no iPhone here, and a mouse is not a finger.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "loop/specs/T-067-plan-v2/verification-practice-app/shots"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream", ".txt": "text/plain" };
const FAKE_KEY = "sk-ant-test-stub";
const START = JSON.parse(fs.readFileSync(path.join(ROOT, "app/assets/data/meta.json"), "utf8")).START_DATE;
const LONG = "Each hidden neuron takes a weighted sum of every activation in the layer before, adds its bias, and squashes the result with a sigmoid.";
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
  const errors = [], claude = [];
  try {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
    await ctx.clock.setFixedTime(new Date(START + "T10:00:00"));
    await ctx.route(/youtube\.com|ytimg\.com|api\.github\.com/, r => r.abort());
    await ctx.route("https://api.anthropic.com/**", r => {
      const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" };
      if (r.request().method() === "OPTIONS") return r.fulfill({ status: 204, headers: cors });
      const h = r.request().headers();
      claude.push({ key: h["x-api-key"] === FAKE_KEY, body: JSON.parse(r.request().postData()) });
      const grade = { points: [
        { point: "A weighted sum of all the activations in the previous layer.", verdict: "met" },
        { point: "Adds a bias, which sets the threshold for being active.", verdict: "partly" },
        { point: "Squashes the result with a sigmoid (or ReLU) into the activation.", verdict: "met" },
        { point: "The weights act as a pattern the neuron looks for.", verdict: "missing" },
      ], correction: "Say what the weights encode: a pattern of pixels the neuron responds to, positive where it wants ink and negative around it." };
      return r.fulfill({ status: 200, contentType: "application/json", headers: cors, body: JSON.stringify({ stop_reason: "end_turn", content: [{ type: "text", text: JSON.stringify(grade) }] }) });
    });
    const lessons = { "math110.0.0": { done: true, doneAt: START, notes: "", checks: [] }, "ai200.0.0": { done: true, doneAt: START, notes: "", checks: [] } };
    // shared_preferences on the web keeps strings JSON-quoted under "flutter.".
    await ctx.addInitScript(([k, s]) => {
      if (window.top !== window) return;   // the lecture's (aborted) YouTube frame has no storage of its own
      if (!localStorage.getItem("flutter.darhikmah_v1")) localStorage.setItem("flutter.darhikmah_v1", JSON.stringify(s));
      if (!localStorage.getItem("flutter.brickford_anthropic_key")) localStorage.setItem("flutter.brickford_anthropic_key", JSON.stringify(k));
    }, [FAKE_KEY, JSON.stringify({ lessons })]);
    const page = await ctx.newPage();
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error" && !/youtube\.com|ytimg\.com|api\.github\.com/.test((m.location() || {}).url || "")) errors.push(m.text().replace(FAKE_KEY, "<key>")); });
    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await page.waitForSelector("[flt-semantics-identifier]", { timeout: 10000 });
    const id = (x, n = 0) => page.locator(`[flt-semantics-identifier="${x}"]`).nth(n);
    const has = async x => (await page.locator(`[flt-semantics-identifier="${x}"]`).count()) > 0;
    const box = async x => id(x).boundingBox();
    const shot = async name => { await page.mouse.move(W - 3, 120); await page.waitForTimeout(500); const f = path.join(OUT, "practice-" + name + ".png"); await page.screenshot({ path: f }); console.log("  shot  " + path.relative(ROOT, f)); };
    const click = async x => { const b = await box(x); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(800); return b; };
    const size = async (x, label) => { const b = await box(x); check(label + " is at least 44x44", !!b && b.width >= 44 && b.height >= 44, b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing"); };
    // Scroll the sheet (the wheel over its middle) until [x] sits between the top bar and the foot of the screen.
    const reveal = async (x, top = 150, bottom = 40) => {
      for (let i = 0; i < 80; i++) {
        const b = (await has(x)) ? await box(x) : null;
        if (b && b.y >= top && b.y + b.height <= H - bottom) return true;
        await page.mouse.move(W / 2, H * 0.6);
        await page.mouse.wheel(0, b ? (b.y < top ? -160 : 160) : 500);
        await page.waitForTimeout(250);
      }
      return false;
    };
    const stored = async () => { const raw = await page.evaluate(() => localStorage.getItem("flutter.darhikmah_v1")); return raw ? JSON.parse(JSON.parse(raw)) : {}; };

    // ---- Home: Today's practice ----
    check("Home has Today's practice with MATH 110's first lecture", await reveal("home-practice-math110.0.0", 150, 300));
    await shot("1-home-today");
    await size("home-practice-math110.0.0", "the Today's practice row");

    // ---- the lecture: the block, nothing tried ----
    await click("home-practice-math110.0.0");
    await page.waitForTimeout(800);
    check("the lecture's Practice block is there", await reveal("pr-in-p3", 380));
    await shot("2-not-tried");
    check("nothing is revealed before an attempt: no mark buttons", !(await has("pr-mark-ok-p3")));
    await size("pr-check-p3", "Check");

    // ---- a worked item answered: the solution is revealed, with the three marks ----
    await click("pr-in-p3");
    await page.keyboard.type("(1,-1)");
    await click("pr-check-p3");
    check("after the attempt the three marks are there", await reveal("pr-mark-ok-p3", 300));
    await shot("3-worked-revealed");
    for (const m of ["ok", "partly", "missed"]) await size("pr-mark-" + m + "-p3", "the " + m + " mark");
    const s1 = await stored();
    check("the answer is stored (no mark yet)", ((s1.practice || {})["math110.0.0"] || {}).p3 && s1.practice["math110.0.0"].p3.answer === "(1,-1)" && s1.practice["math110.0.0"].p3.mark == null);

    // ---- a written answer, graded by the stub ----
    await page.keyboard.press("Escape");
    await page.goBack().catch(() => {});
    await page.waitForTimeout(600);
    if (!(await has("home-practice-ai200.0.0"))) { const back = await box("lesson-back").catch(() => null); if (back) { await page.mouse.click(back.x + back.width / 2, back.y + back.height / 2); await page.waitForTimeout(900); } }
    check("Home has AI 200's first lecture under Today's practice", await reveal("home-practice-ai200.0.0", 150, 120));
    await click("home-practice-ai200.0.0");
    await page.waitForTimeout(800);
    check("the written item's field is there", await reveal("pr-in-p1", 300));
    await click("pr-in-p1");
    await page.keyboard.type("Too short to count.");
    await click("pr-check-p1");
    check("under 80 characters the key points stay hidden", !(await has("pr-grade-p1")));
    await click("pr-in-p1");
    await page.keyboard.type(" " + LONG);
    await click("pr-check-p1");
    check("the Grade button is there after 80 characters", await reveal("pr-grade-p1", 200));
    await size("pr-grade-p1", "Grade with Claude");
    await click("pr-grade-p1");
    await page.waitForTimeout(1200);
    check("one request reached the stub, with the stub key as its header", claude.length === 1 && claude[0].key, claude.length + " requests");
    check("the request's body keys are the six the web sends", claude.length === 1 && Object.keys(claude[0].body).join() === "model,max_tokens,system,messages,output_config,fallbacks" && claude[0].body.model === "claude-opus-5-5");
    check("the answer's grade is shown", await reveal("pr-mark-ok-p1", 420));
    await shot("4-write-graded");
    const s2 = await stored();
    check("the grade is stored, the key is not", !!(((s2.practice || {})["ai200.0.0"] || {}).p1 || {}).grade && !JSON.stringify(s2).includes(FAKE_KEY));
    check("no page or console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
  console.log(fails ? "\n" + fails + " FAILED" : "\nall checks passed");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(String(e.stack || e).replace(FAKE_KEY, "<key>")); process.exit(1); });
