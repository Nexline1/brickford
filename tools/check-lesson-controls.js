// check-lesson-controls.js — the lecture's Back and More must be reachable (T-064 lesson-controls), in Chromium.
//
//   node tools/check-lesson-controls.js [--root DIR]   DIR holds app-web/ (default: the repo). Runs the checks,
//                                                      then the plants below (each must make it exit 1).
//   node tools/check-lesson-controls.js --no-plants    the checks alone (a quick look while editing)
//   node tools/check-lesson-controls.js --plant NAME   one planted defect, built in a scratch copy; must exit 1
//   node tools/check-lesson-controls.js --shots        also write the lecture screenshots (lesson-controls-*.png)
//
// The bug (the owner, on an iPhone): Back and More were Flutter widgets painted ON the lecture's video. On the
// web the video is a real <iframe> in an HtmlElementView, which sits in the page IN FRONT of the canvas and takes
// every touch inside its own rectangle. Flutter painted the buttons; the taps went to YouTube. The Chromium tests
// had clicked them with a mouse through the semantics layer (which sits above the iframe) and never noticed.
//
// What this measures, at 375x812 and 390x844, on the built app (app-web/):
//   - the controls are 44x44 or more, and their rectangles do not meet the iframe's (or any platform view's);
//   - nothing in the page at either control's centre is the iframe, a platform-view host or its slot
//     (document.elementsFromPoint, the whole stack, so the semantics layer on top cannot hide it);
//   - the video sits directly under the control row, 16:9, full width;
//   - a mouse click at Back's centre goes back, and one at More's centre opens the unit's sheet. The click is made
//     with the semantics layer pointer-transparent, which is the phone without VoiceOver: there the page has no
//     semantics DOM at all, and the touch goes to whatever is in front of the canvas at that point.
//
// What it cannot show: iOS Safari's touch routing itself. There is no WebKit here. Chromium shows the cause (the
// controls were inside the iframe's rectangle and the iframe was the element at their centre) and that with the fix
// the click reaches Flutter; that an iPhone then taps them is the inference, not something measured.
"use strict";
const fs = require("fs"), http = require("http"), os = require("os"), path = require("path");
const { spawnSync } = require("child_process");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const REPO = path.resolve(__dirname, "..");
const arg = n => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };
const ROOT = path.resolve(arg("--root") || REPO);
const PLANT = arg("--plant");
const OUT = path.join(REPO, "loop/specs/T-064-flutter-app/shots");
const FLUTTER = process.env.FLUTTER || "/opt/flutter/bin/flutter";
const SIZES = [[375, 812], [390, 844]];
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream", ".txt": "text/plain" };

// PLANTS. Each puts the defect back in a scratch copy of app/, builds it, and runs the checks on that build;
// the gate (this script with no flags) demands exit 1 from every one. Nothing in the repo is touched.
const PLANTS = {
  // The control row is laid back over the video: the video starts at the top of the safe area again.
  "overlay-controls": { file: "lib/screens/lesson/lesson_screen.dart", was: "top: f.videoTop,", now: "top: mq.padding.top," },
};
if (PLANT && !PLANTS[PLANT]) { console.log("unknown plant " + PLANT + " (have: " + Object.keys(PLANTS).join(", ") + ")"); process.exit(2); }

let fails = 0;
const check = (name, ok, detail) => { if (!ok) fails++; console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : "")); };

function serve(root) {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    if (!u.pathname.startsWith("/brickford/")) { res.writeHead(404); return res.end(); }
    let p = path.join(root, decodeURIComponent(u.pathname.slice("/brickford/".length)));
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
    if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

// A scratch copy of app/ with the plant applied, built the way tools/build-app.sh builds it, laid out as root/app-web/.
function buildPlant(name) {
  const p = PLANTS[name];
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "lesson-controls-"));
  const app = path.join(scratch, "app");
  fs.cpSync(path.join(REPO, "app"), app, { recursive: true, filter: s => !/[\\/]app[\\/](build|android[\\/]\.gradle)([\\/]|$)/.test(s) });
  const f = path.join(app, p.file), src = fs.readFileSync(f, "utf8");
  if (src.split(p.was).length !== 2) throw new Error("plant " + name + ": `" + p.was + "` must occur exactly once in " + p.file);
  fs.writeFileSync(f, src.replace(p.was, () => p.now));
  console.log("  plant " + name + ": building " + p.file + " in " + scratch + " ...");
  const b = spawnSync(FLUTTER, ["build", "web", "--release", "--base-href", "/brickford/app-web/", "--no-web-resources-cdn", "--no-wasm-dry-run"],
    { cwd: app, encoding: "utf8", maxBuffer: 1 << 28 });
  if (b.status !== 0) { console.log(b.stdout + b.stderr); throw new Error("plant " + name + ": flutter build failed"); }
  const root = path.join(scratch, "root");
  fs.cpSync(path.join(app, "build/web"), path.join(root, "app-web"), { recursive: true });
  return { scratch, root };
}

const overlap = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
const near = (a, b, e) => Math.abs(a - b) <= e;
const c = r => [r.left + r.width / 2, r.top + r.height / 2];

async function ready(page) {
  await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
  await page.waitForSelector("[flt-semantics-identifier]", { timeout: 10000 });
}
const rectOf = (page, id) => page.evaluate(i => { const e = document.querySelector('[flt-semantics-identifier="' + i + '"]'); return e && e.getBoundingClientRect().toJSON(); }, id);
const exists = (page, id) => page.evaluate(i => !!document.querySelector('[flt-semantics-identifier="' + i + '"]'), id);
// The semantics layer above the canvas: a phone without VoiceOver has none, so its touches reach the page behind it.
// Flutter gives each semantics node its own pointer-events, so the host's alone is not enough: a rule on all of them.
const semanticsPassesTouches = page => page.evaluate(() => {
  const st = document.createElement("style"); st.id = "no-voiceover";
  st.textContent = "flt-semantics-host, flt-semantics-host * { pointer-events: none !important; }";
  document.head.appendChild(st);
  return !!document.querySelector("flt-semantics-host");
});
// A modal sheet's route is a semantics node labelled "Dialog".
const dialogOpen = page => page.evaluate(() => !!document.querySelector('flt-semantics[aria-label="Dialog"]'));

async function openFirstLecture(page) {
  const card = page.locator('[flt-semantics-identifier="lecture"]').first();
  await card.waitFor({ timeout: 10000 });
  const b = await card.boundingBox();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForSelector('[flt-semantics-identifier="lesson-back"]', { timeout: 10000 });
  await page.waitForTimeout(1500);
}

// A lecture that is only a reading (MATH 210, unit 2, "Why momentum really works"): no video, so the fallback tile.
// Learn tab > the MATH 210 card (scrolled clear of the floating bar) > the unit > the lecture's row (4th of 6).
async function openNoVideoLecture(page) {
  const press = async loc => { await loc.waitFor({ timeout: 10000 }); const b = await loc.boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(1200); };
  await press(page.locator('[flt-semantics-identifier="tab-Learn"]'));
  const card = page.locator('flt-semantics[aria-label*="MATH 210"]').first();
  await card.waitFor({ timeout: 10000 });
  for (let i = 0; i < 8 && (await card.boundingBox()).y + 50 > page.viewportSize().height - 150; i++) {
    await page.mouse.move(page.viewportSize().width / 2, 500); await page.mouse.wheel(0, 300); await page.waitForTimeout(500);
  }
  await press(card);
  await press(page.locator('[flt-semantics-identifier="unit-math210-1"]'));
  await press(page.locator('[flt-semantics-identifier="lesson-row-math210-1-3"]'));
  await page.waitForSelector('[flt-semantics-identifier="lesson-back"]', { timeout: 10000 });
  await page.waitForTimeout(1500);
}

// What is in the page, in front of and behind this point: the whole stack, and the nearest platform-view ancestor if any.
function stackAt(page, x, y) {
  return page.evaluate(([x, y]) => {
    const isPv = e => /^(IFRAME|FLT-PLATFORM-VIEW|FLT-PLATFORM-VIEW-SLOT|SLOT)$/.test(e.tagName) || (e.closest && !!e.closest("iframe, flt-platform-view, flt-platform-view-slot"));
    const all = document.elementsFromPoint(x, y);
    const top = document.elementFromPoint(x, y);
    return { top: top ? top.tagName : null, topInPv: !!top && isPv(top), stack: all.map(e => e.tagName), pv: all.filter(isPv).map(e => e.tagName) };
  }, [x, y]);
}

async function lecture(browser, base, [W, H], opts) {
  console.log("\n" + W + "x" + H + "  (a lecture with a YouTube video)");
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: "block" });
  await ctx.clock.setFixedTime(new Date("2026-11-04T12:00:00Z"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());   // the iframe is there; YouTube's page is not what is measured
  try {
    await page.goto(base + "app-web/", { waitUntil: "load" });
    await ready(page);
    await openFirstLecture(page);

    const f = await page.evaluate(() => {
      const fr = document.querySelector("iframe");
      const pvs = [...document.querySelectorAll("flt-platform-view")].map(e => e.getBoundingClientRect().toJSON());
      return { src: fr ? fr.src : null, rect: fr ? fr.getBoundingClientRect().toJSON() : null, pvs };
    });
    check("the lecture has a YouTube <iframe>", !!f.src && /youtube\.com\/embed\//.test(f.src), f.src || "no iframe");
    const back = await rectOf(page, "lesson-back"), more = await rectOf(page, "lesson-more");
    check("lesson-back and lesson-more are on the page", !!back && !!more);
    if (!back || !more || !f.rect) return;
    const r1 = o => Math.round(o.left) + "," + Math.round(o.top) + " " + Math.round(o.width) + "x" + Math.round(o.height);
    console.log("        back " + r1(back) + "   more " + r1(more) + "   iframe " + r1(f.rect));

    for (const [name, r] of [["Back", back], ["More", more]]) {
      check(name + " is at least 44x44", r.width >= 44 && r.height >= 44, Math.round(r.width) + "x" + Math.round(r.height));
      check(name + "'s rectangle does not meet the iframe's", !overlap(r, f.rect));
      check(name + "'s rectangle does not meet any platform view's", !f.pvs.some(p => p.width > 0 && p.height > 0 && overlap(r, p)));
      const [x, y] = c(r);
      const s = await stackAt(page, x, y);
      check("nothing at " + name + "'s centre is the iframe or a platform view", s.pv.length === 0 && !s.topInPv, "stack: " + s.stack.join(" > "));
    }
    check("the video is directly under the control row", f.rect.top >= Math.max(back.bottom, more.bottom) && f.rect.top - Math.max(back.bottom, more.bottom) <= 16,
      "gap " + Math.round((f.rect.top - Math.max(back.bottom, more.bottom)) * 10) / 10 + "px");
    check("the video is full width and 16:9", near(f.rect.left, 0, 0.5) && near(f.rect.width, W, 0.5) && near(f.rect.width / f.rect.height, 16 / 9, 0.02),
      Math.round(f.rect.width * 10) / 10 + "x" + Math.round(f.rect.height * 10) / 10);
    check("Back and More sit left and right of the screen's middle", back.right < W / 2 && more.left > W / 2);

    if (opts.shots) { const fl = path.join(OUT, "lesson-controls-video-" + W + ".png"); fs.mkdirSync(OUT, { recursive: true }); await page.screenshot({ path: fl }); console.log("  shot  " + path.relative(REPO, fl)); }

    // A touch, as the phone sends it: the semantics layer does not take it, so it goes to what is in front of the canvas.
    check("the semantics layer is there to be made transparent", await semanticsPassesTouches(page));
    const [mx, my] = c(more);
    await page.mouse.click(mx, my);
    await page.waitForTimeout(900);
    check("a click at More's centre opens the unit's sheet", await dialogOpen(page));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    if (await dialogOpen(page)) { await page.mouse.click(W / 2, 40); await page.waitForTimeout(600); }   // the scrim, if Escape did not close it

    const [bx, by] = c(await rectOf(page, "lesson-back"));
    await page.mouse.click(bx, by);
    await page.waitForTimeout(1200);
    check("a click at Back's centre goes back to the previous screen", !(await exists(page, "lesson-back")) && await exists(page, "tab-Home"),
      (await exists(page, "lesson-back")) ? "still on the lecture" : "on Home");
    check("no page errors", errors.length === 0, errors.slice(0, 2).join(" | "));
  } finally { await ctx.close(); }
}

async function noVideoLecture(browser, base, [W, H], opts) {
  console.log("\n" + W + "x" + H + "  (a lecture with no video: the fallback tile, the same layout)");
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: "block" });
  await ctx.clock.setFixedTime(new Date("2026-11-04T12:00:00Z"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
  try {
    await page.goto(base + "app-web/", { waitUntil: "load" });
    await ready(page);
    await openNoVideoLecture(page);
    check("this lecture has no iframe", await page.evaluate(() => !document.querySelector("iframe")));
    const back = await rectOf(page, "lesson-back"), more = await rectOf(page, "lesson-more");
    check("Back and More are where they are on a lecture with a video (same row, 44x44)", !!back && !!more && back.width >= 44 && more.width >= 44 && near(back.top, 12, 1) && near(more.top, 12, 1) && back.right < W / 2 && more.left > W / 2,
      back ? Math.round(back.left) + "," + Math.round(back.top) + " " + Math.round(back.width) + "x" + Math.round(back.height) : "missing");
    if (opts.shots) { const fl = path.join(OUT, "lesson-controls-novideo-" + W + ".png"); fs.mkdirSync(OUT, { recursive: true }); await page.screenshot({ path: fl }); console.log("  shot  " + path.relative(REPO, fl)); }
    await semanticsPassesTouches(page);
    const [bx, by] = c(back);
    await page.mouse.click(bx, by);
    await page.waitForTimeout(1200);
    check("a click at Back's centre goes back", !(await exists(page, "lesson-back")));
    check("no page errors", errors.length === 0, errors.slice(0, 2).join(" | "));
  } finally { await ctx.close(); }
}

(async () => {
  let planted = null, root = ROOT;
  if (PLANT) { planted = buildPlant(PLANT); root = planted.root; }
  const server = await serve(root);
  const base = "http://localhost:" + server.address().port + "/brickford/";
  const browser = await chromium.launch();
  try {
    const shots = process.argv.includes("--shots") && !PLANT;
    for (const size of SIZES) await lecture(browser, base, size, { shots });
    if (!PLANT) for (const size of SIZES) await noVideoLecture(browser, base, size, { shots });
  } finally { await browser.close(); server.close(); if (planted) fs.rmSync(planted.scratch, { recursive: true, force: true }); }

  // The plants, only from the gate itself (never from inside a plant, and never with --no-plants).
  if (!PLANT && !process.argv.includes("--no-plants")) {
    console.log("");
    for (const name of Object.keys(PLANTS)) {
      const res = spawnSync(process.execPath, [__filename, "--plant", name], { encoding: "utf8", maxBuffer: 1 << 28 });
      check("plant " + name + " exits 1", res.status === 1, res.status === 1 ? (res.stdout.match(/^\s+FAIL\s.*$/m) || [""])[0].trim() : "exit " + res.status + " " + (res.stderr || res.stdout).slice(-300));
    }
  }
  console.log(fails ? "\n" + fails + " check(s) FAILED" : "\nall checks passed");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
