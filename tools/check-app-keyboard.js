// check-app-keyboard.js — the iPhone search-keyboard zoom bug (T-064 nav), in Chromium.
//
//   node tools/check-app-keyboard.js [--root DIR]     DIR holds app-web/ (default: the repo)
//
// iOS Safari zooms the page, and shifts it sideways, when a text field under 16px takes focus;
// the owner's screenshot showed the search sheet cut off on the left with a dark strip on the right.
// There is no WebKit here, so this is a Chromium emulation (390x844, DPR 3, mobile, touch) of what
// can be measured: the viewport meta, the computed font-size of the engine's hidden editing input
// (flt-text-editing-host), and that the layout width, the visual viewport's scale and offset, and
// the scroll position do not move when the search field is focused and the viewport then shrinks
// the way a keyboard shrinks it. It is NOT a test on a real iPhone, and a resize is not iOS's
// visualViewport inset; the keyboard-inset path itself is asserted in app/test/widgets_test.dart.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(process.argv.includes("--root") ? process.argv[process.argv.indexOf("--root") + 1] : path.join(__dirname, ".."));
const OUT = path.resolve(__dirname, "../loop/specs/T-064-flutter-app/shots");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream", ".txt": "text/plain" };
let fails = 0;
const check = (name, ok, detail) => { if (!ok) fails++; console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : "")); };

function serve() {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    if (!u.pathname.startsWith("/brickford/")) { res.writeHead(404); return res.end(); }
    let p = path.join(ROOT, decodeURIComponent(u.pathname.slice("/brickford/".length)));
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
    if (!p.startsWith(ROOT) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

(async () => {
  const server = await serve();
  const URL_ = "http://localhost:" + server.address().port + "/brickford/app-web/";
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await ctx.clock.setFixedTime(new Date("2026-11-04T12:00:00Z"));
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await page.waitForTimeout(2500);
    // Semantics stay OFF, as on a phone without VoiceOver: then the text field is the engine's hidden
    // <input> in flt-text-editing-host, which is the element Safari decides to zoom for.

    const metrics = () => page.evaluate(() => {
      const v = window.visualViewport;
      return { inner: innerWidth, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth,
        scale: v.scale, offX: v.offsetLeft, pageX: v.pageLeft, scrollX: scrollX, vvW: v.width, vvH: v.height };
    });
    const meta = await page.evaluate(() => [...document.querySelectorAll('meta[name="viewport"]')].map(m => m.content).join(" | "));
    check("viewport meta (after the engine has rewritten it) stops pinch/auto zoom", /maximum-scale=1(\.0)?(,|$)/.test(meta) && /user-scalable=no/.test(meta) && !/maximum-scale=5/.test(meta), meta);
    const before = await metrics();

    // The round search button: right edge 16.6px in, 64px across, 14px above the bottom (Tokens.barHeight/barGap).
    await page.touchscreen.tap(390 - 16.64 - 32, 844 - 14 - 32);
    await page.waitForSelector("flt-text-editing-host input, flt-text-editing-host textarea", { state: "attached", timeout: 10000 });
    await page.waitForTimeout(800);
    const field = await page.evaluate(() => {
      const el = document.querySelector("flt-text-editing-host input, flt-text-editing-host textarea");
      const r = el.getBoundingClientRect();
      return { fs: parseFloat(getComputedStyle(el).fontSize), focused: document.activeElement === el, top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    });
    check("the search sheet's editing input is focused", field.focused);
    check("its computed font-size is at least 16px", field.fs >= 16, field.fs + "px");

    const open = await metrics();
    const same = (a, b) => a.inner === b.inner && a.client === b.client && a.scale === b.scale && a.offX === b.offX && a.scrollX === b.scrollX && a.scroll <= a.inner;
    check("layout width, zoom, offset and scroll unchanged by focusing the field", same(before, open) && open.scale === 1 && open.offX === 0 && open.scrollX === 0, JSON.stringify(open));

    // The keyboard: shrink the viewport by 300px (what is left above it), type, and look.
    await page.setViewportSize({ width: 390, height: 544 });
    await page.waitForTimeout(800);
    await page.keyboard.type("lin", { delay: 40 });
    await page.waitForTimeout(800);
    const kb = await metrics();
    const field2 = await page.evaluate(() => { const r = document.querySelector("flt-text-editing-host input, flt-text-editing-host textarea").getBoundingClientRect(); return { fs: parseFloat(getComputedStyle(document.querySelector("flt-text-editing-host input, flt-text-editing-host textarea")).fontSize), top: r.top, bottom: r.bottom, left: r.left, right: r.right }; });
    check("with the keyboard up: still 390 wide, scale 1, no sideways shift", kb.inner === 390 && kb.client === 390 && kb.scale === 1 && kb.offX === 0 && kb.scrollX === 0 && kb.scroll <= 390, JSON.stringify(kb));
    check("with the keyboard up: the field is inside the visible viewport, left to right", field2.top >= 0 && field2.bottom <= kb.vvH && field2.left >= 0 && field2.right <= kb.vvW, JSON.stringify(field2));
    check("still at least 16px after typing", field2.fs >= 16, field2.fs + "px");
    fs.mkdirSync(OUT, { recursive: true });
    const shot = path.join(OUT, "search-keyboard.png");
    await page.screenshot({ path: shot });
    console.log("  shot  " + path.relative(path.join(__dirname, ".."), shot));
    check("no page errors", errors.length === 0, errors.slice(0, 2).join(" | "));
  } finally { await browser.close(); server.close(); }
  console.log(fails ? "\n" + fails + " check(s) FAILED" : "\nall checks passed");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
