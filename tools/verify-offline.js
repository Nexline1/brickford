// verify-offline.js — Brickford with no connection (T-058).
//
// Why this exists. On 28 Oct 2026 the owner asked for the platform to work
// "even if I don't have Wi-Fi or an internet connection ... the entire
// platform". It had a manifest and icons and no service worker, so with no
// connection it did not open at all. sw.js, at the site root, is the fix; this
// gate keeps it true. Everything but the video stream has to work offline.
//
// Unlike every other gate it serves the repo over http, because a service
// worker does not exist on file://. The server is in this file. It answers the
// way GitHub Pages does (Cache-Control max-age=600, an ETag, 304s), so the
// browser's HTTP cache is in play where it is on the real site.
//
// "Offline" is two things at once, so neither can stand in for the other:
// context.setOffline(true) (navigator.onLine, the online/offline events, and,
// with PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS, the worker's own
// fetches) AND the server refusing every connection. A page that renders then
// came out of the worker's cache, or nowhere.
//
// Nothing leaves the machine. KaTeX and Google Fonts are answered by
// stand-ins at their real URLs (jsdelivr is unreachable from the cloud
// sandbox; loop/lessons.md), so what is proven is the worker's path for those
// URLs: cached on install, served offline. The stand-in auto-render marks
// $...$ as .katex, and the stand-in stylesheet's font-family reaching a .katex
// element proves the stylesheet came as well. YouTube answers with a blank
// page online and refuses offline; GitHub's API is a stub that counts every
// request. The update block runs in a second browser with no routes at all
// (routing turns Chromium's HTTP cache off), because that block is about the
// HTTP cache; there, and everywhere, an outside request fails on this machine
// (SEALED, below).
//
// Blocks: install (what the worker holds, and that the app can be installed),
// offline (every route verify-shell visits, KaTeX, the lesson's video panel,
// a lecture ticked and kept, sync words, the revision PDFs, the Library's
// documents), online again (exactly one push, no latch), the video back in
// place, the update (A to B on the next launch, A's cache gone, nothing
// reloaded under a video), and file:// (the other gates' world: no worker).
"use strict";
process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = "1";
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK = "1";
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const INDEX_FILE = path.join(ROOT, "platform", "index.html");
const INDEX_HTML = fs.readFileSync(INDEX_FILE, "utf8");
const TOKENS = [...INDEX_HTML.matchAll(/\?v=([\w.-]+)/g)].map(m => m[1]);
const TOKEN = TOKENS[0];
const TOKEN_B = TOKEN + "update";
// Same study day as verify-shell, verify-flows and verify-clip.
const FIXED_NOW = new Date("2026-11-01T12:00:00Z");
const STUB_TOKEN = "ghp_stub_token_for_the_harness";

let fails = 0, checks = 0;
// A gate fails; it never hangs. A worker that waits forever on a network that
// never answers is exactly the defect some plants put back.
setTimeout(() => { console.log("\nFAIL — the gate did not finish in 10 minutes (" + fails + " failed of " + checks + " so far)"); process.exit(1); }, 600000).unref();
const check = (ok, msg) => { checks++; console.log((ok ? "  ok    " : "  FAIL  ") + msg); if (!ok) fails++; };

// ---------- what the worker should hold, read from the files themselves ----------
// Every relative src and href in index.html: what the page loads.
function localRefs(html) {
  return [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map(m => m[1])
    .filter(u => !/^(#|[a-z]+:)/i.test(u)).map(u => "/platform/" + u.replace(/^\.\//, ""));
}
const THIRD = [...INDEX_HTML.matchAll(/\s(?:src|href)="(https:\/\/[^"]+)"/g)].map(m => m[1])
  .filter(u => /^https:\/\/(cdn\.jsdelivr\.net\/npm\/katex@|fonts\.googleapis\.com\/css)/.test(u));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, "platform", "manifest.json"), "utf8"));
const PDFS = fs.readdirSync(path.join(ROOT, "revision")).filter(f => /\.pdf$/.test(f)).sort();
const APP_JS = fs.readFileSync(path.join(ROOT, "platform", "js", "app.js"), "utf8");
const DOCS = [...(APP_JS.match(/const DOCS = \[[\s\S]*?\];/) || [""])[0].matchAll(/\{ id: "([^"]+)", file: "\.\.\/([^"]+)"/g)].map(m => ({ id: m[1], file: m[2] }));
// The routes verify-shell visits, read out of verify-shell itself so the two
// cannot drift apart.
const SHELL_ROUTES = (function () {
  const src = fs.readFileSync(path.join(__dirname, "verify-shell.js"), "utf8");
  const a = src.match(/const ROUTES = \[[\s\S]*?\];/), b = src.match(/const FRAME_ROUTES = ROUTES\.concat\(\[[\s\S]*?\]\);/);
  if (!a || !b) return [];
  try { return vm.runInNewContext((a[0] + "\n" + b[0]).replace(/\bconst /g, "var ") + "\nFRAME_ROUTES"); } catch (e) { return []; }
})();
// PNG width and height, from the IHDR chunk.
const pngSize = f => { const b = fs.readFileSync(f); return b.toString("ascii", 1, 4) === "PNG" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null; };

// ---------- the server ----------
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".png": "image/png", ".pdf": "application/pdf", ".md": "text/markdown; charset=utf-8" };
// hang: a test on the path; a match is accepted and never answered (one bar
// of signal, a Wi-Fi with nothing behind it), and held until release().
const server = { down: false, token: TOKEN, hits: [], hang: null, held: [] };
server.release = () => { server.hang = null; server.held.splice(0).forEach(r => r.socket && r.socket.destroy()); };
const srv = http.createServer((req, res) => {
  if (server.down) { req.socket.destroy(); return; }
  const p = decodeURIComponent(req.url.split("?")[0]);
  if (server.hang && server.hang(p)) { server.held.push(res); return; }
  const file = path.normalize(path.join(ROOT, p.endsWith("/") ? p + "index.html" : p));
  server.hits.push(req.url);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); res.end("not found"); return; }
    // Version B is version A with a new token: the same code, a new name.
    if (file === INDEX_FILE && server.token !== TOKEN) buf = Buffer.from(buf.toString("utf8").split("?v=" + TOKEN).join("?v=" + server.token));
    const etag = '"' + crypto.createHash("md5").update(buf).digest("hex") + '"';
    const head = { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "max-age=600", ETag: etag };
    if (req.headers["if-none-match"] === etag) { res.writeHead(304, head); res.end(); return; }
    res.writeHead(200, head);
    res.end(buf);
  });
});

// ---------- the outside world, standing in ----------
// holdGet: GitHub GETs are taken and held (a pull in flight) until releaseGets().
// captive: everything outside refused while the browser still says online
// (a Wi-Fi with no internet behind it); with server.down, this site too.
const net = { ghStatus: 200, offline: false, captive: false, gh: [], ghSeen: 0, yt: 0, other: [], hangFontCss: false, holdGet: false, held: [] };
const ghAnswer = route => route.request().method() === "GET"
  ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ sha: "stubsha", content: Buffer.from("{}").toString("base64") }) })
  : route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) });
net.releaseGets = () => { net.holdGet = false; net.held.splice(0).forEach(r => ghAnswer(r).catch(() => {})); };
// What a PUT carried: the pushed state.
const pushedState = g => { try { return JSON.parse(Buffer.from(JSON.parse(g.body).content, "base64").toString("utf8")).state; } catch (e) { return null; } };
const CORS = { "access-control-allow-origin": "*" };
const STUB_AUTORENDER = "window.renderMathInElement = function (el) {" +
  " var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, hit = [];" +
  " while ((n = w.nextNode())) if (/\\$[^$]+\\$/.test(n.nodeValue)) hit.push(n);" +
  " hit.forEach(function (t) { var s = document.createElement('span');" +
  " s.innerHTML = t.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\\$([^$]+)\\$/g, '<span class=\"katex\">$1</span>');" +
  " t.replaceWith(s); }); };";
async function standIns(ctx) {
  // Every request the app makes to GitHub, whether or not it gets anywhere.
  ctx.on("request", r => { if (r.url().startsWith("https://api.github.com/")) net.ghSeen++; });
  await ctx.route(u => u.hostname !== "127.0.0.1", route => {
    const req = route.request(), u = req.url();
    const refuse = () => route.abort("internetdisconnected");
    if (u.startsWith("https://api.github.com/")) {
      net.gh.push({ method: req.method(), offline: net.offline, body: req.postData() });
      if (net.offline || net.captive) return refuse();
      if (net.ghStatus !== 200) return route.fulfill({ status: net.ghStatus, contentType: "application/json", body: JSON.stringify({ message: "Bad credentials" }) });
      if (net.holdGet && req.method() === "GET") { net.held.push(route); return; }
      return ghAnswer(route);
    }
    if (/^https:\/\/www\.youtube(-nocookie)?\.com\//.test(u)) {
      net.yt++;
      return net.offline || net.captive ? refuse() : route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>player</title>" });
    }
    if (net.offline || net.captive) return refuse();
    if (net.hangFontCss && /^https:\/\/fonts\.googleapis\.com\/css/.test(u)) return;   // taken, never answered
    if (/katex@[^/]+\/dist\/katex\.min\.js$/.test(u)) return route.fulfill({ status: 200, headers: CORS, contentType: "text/javascript", body: "window.katex = { standIn: true };" });
    if (/katex@[^/]+\/dist\/contrib\/auto-render\.min\.js$/.test(u)) return route.fulfill({ status: 200, headers: CORS, contentType: "text/javascript", body: STUB_AUTORENDER });
    if (/katex@[^/]+\/dist\/katex\.min\.css$/.test(u)) return route.fulfill({ status: 200, headers: CORS, contentType: "text/css",
      body: "@font-face{font-family:KaTeX_Main;src:url(fonts/KaTeX_Main-Regular.woff2) format(\"woff2\")}.katex{font-family:KaTeX_Main,serif}" });
    if (/^https:\/\/fonts\.googleapis\.com\/css/.test(u)) return route.fulfill({ status: 200, headers: CORS, contentType: "text/css",
      body: "@font-face{font-family:'JetBrains Mono';src:url(https://fonts.gstatic.com/s/jetbrainsmono/v1/standin.woff2) format('woff2')}" });
    if (/\.woff2$/.test(u)) return route.fulfill({ status: 200, headers: CORS, contentType: "font/woff2", body: Buffer.from("wOF2 stand-in") });
    net.other.push(u);
    return route.abort();
  });
}
const STANDIN_FONTS = ["https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts/KaTeX_Main-Regular.woff2",
  "https://fonts.gstatic.com/s/jetbrainsmono/v1/standin.woff2"];

// A stub token (never the real one) where GitHub is stood in for; none where
// it is not, so nothing tries to reach it.
async function freshContext(browser, token) {
  const ctx = await browser.newContext({ timezoneId: "UTC", viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", acceptDownloads: true });
  await ctx.clock.setFixedTime(FIXED_NOW);
  if (token) await ctx.addInitScript(t => { try { localStorage.setItem("brickford_gh_token", t); } catch (e) {} }, STUB_TOKEN);
  return ctx;
}
// Wait on proof held in this process (the stand-ins' counters).
async function until(fn, ms) {
  for (const end = Date.now() + ms; Date.now() < end; await new Promise(r => setTimeout(r, 100))) if (fn()) return true;
  return fn();
}
// What a page reports that it could not load or run: ours only (the site,
// KaTeX, the fonts). YouTube, its thumbnails and GitHub fail offline by design.
function watch(page) {
  const w = { failed: [], errors: [] };
  page.on("requestfailed", r => {
    const u = r.url();
    if (u.startsWith(BASE) || /^https:\/\/(cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)\//.test(u)) w.failed.push(u.replace(BASE, "") + " " + ((r.failure() || {}).errorText || ""));
  });
  page.on("pageerror", e => w.errors.push(String(e.message || e).split("\n")[0]));
  return w;
}
// Controlled by a worker that has finished activating: a page's controller
// switches to a new worker when its activation STARTS (the spec moves the
// clients before the activate event runs), and the old caches go inside that
// event, so a controller alone proves nothing about them.
const controlled = (page, token, ms) => page.waitForFunction(t => { const c = navigator.serviceWorker && navigator.serviceWorker.controller;
  return !!c && c.state === "activated" && (!t || c.scriptURL.endsWith("?v=" + t)); }, token || null, { timeout: ms || 30000 }).then(() => true, () => false);
const cacheMap = page => page.evaluate(async () => {
  const out = {};
  for (const name of await caches.keys()) out[name] = (await (await caches.open(name)).keys()).map(r => r.url);
  return out;
});
// Everything the files cache should hold, there (it may fill after activation).
const wantFilesList = () => PDFS.map(f => "/revision/" + f).concat(DOCS.map(d => "/" + d.file)).concat(THIRD).concat(STANDIN_FONTS);
// Polled from here with evaluate, which awaits the page's promise; a
// waitForFunction predicate that returns a promise is truthy at once.
async function filled(page, ms) {
  const want = wantFilesList().map(u => u.startsWith("/") ? BASE + u : u);
  const all = () => page.evaluate(async w => {
    if (!(await caches.has("brickford-files"))) return false;
    const have = new Set((await (await caches.open("brickford-files")).keys()).map(r => r.url));
    return w.every(u => have.has(u));
  }, want).catch(() => false);
  for (const end = Date.now() + (ms || 30000); Date.now() < end; await new Promise(r => setTimeout(r, 250))) if (await all()) return true;
  return all();
}
const stored = page => page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}"));
const viewReady = page => page.waitForFunction(() => !!document.querySelector("#view > *"), null, { timeout: 15000 }).then(() => true, () => false);
// The font loads this page started settle before the harness moves on:
// navigating away mid-load cancels them (net::ERR_ABORTED), which is the
// harness and not the cache. Measured: 28 of 40 offline lesson visits lost the
// KaTeX woff2 that way without the wait, 0 of 40 with it.
const viewFacts = page => page.evaluate(async () => {
  const k = document.querySelector("#view .katex");
  const font = k ? getComputedStyle(k).fontFamily : "";
  await document.fonts.ready;
  return {
    h1: ((document.querySelector("#view h1") || {}).textContent || "").trim(),
    text: (document.querySelector("#view") || {}).innerText || "",
    title: document.title,
    katex: document.querySelectorAll("#view .katex").length,
    font,
  };
});
async function launch(page, r) {
  // Whatever page is open lets its font loads finish first (see viewFacts).
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.goto("about:blank");
  await page.goto(BASE + "/platform/#" + r, { waitUntil: "load" }).catch(() => {});
  return viewReady(page);
}
let BASE = "", wantShellCount = 0;
// Every browser here sends every outside request to a proxy that is not
// there (port 9 on this machine), and only 127.0.0.1 goes direct: Chromium's
// own loopback bypass, which Playwright turns off unless told not to. The
// cloud sandbox's proxy comes in from the environment otherwise, and
// --no-proxy-server or a resolver rule alone were both measured still
// tunnelling to jsdelivr through it. The routed browser has its stand-ins in
// front of this; the others have nothing else.
const SEALED = { proxy: { server: "http://127.0.0.1:9" } };

(async () => {
  await new Promise(r => srv.listen(0, "127.0.0.1", r));
  BASE = "http://127.0.0.1:" + srv.address().port;
  const browser = await chromium.launch(SEALED);

  // ================= install =================
  console.log("Install: what the worker holds, and that the app can be installed");
  check(TOKENS.length > 30 && TOKENS.every(t => t === TOKEN) && INDEX_HTML.includes('register("../sw.js?v=' + TOKEN + '")'),
    "index.html: one ?v= token everywhere (" + TOKENS.length + " uses), and the worker is registered as ../sw.js with it");
  check(SHELL_ROUTES.length > 20, "verify-shell's routes read from verify-shell.js (" + SHELL_ROUTES.length + ")");
  const ctx = await freshContext(browser, true);
  await standIns(ctx);
  const page = await ctx.newPage();
  let w = watch(page);
  await page.goto(BASE + "/platform/#/", { waitUntil: "load" });
  const ctl = await controlled(page);
  const reg = ctl ? await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return { scope: r.scope, script: navigator.serviceWorker.controller.scriptURL }; }) : {};
  check(ctl && reg.scope === BASE + "/" && reg.script === BASE + "/sw.js?v=" + TOKEN,
    "the worker controls the page from the site root, so its scope covers revision/ too (scope " + reg.scope + ", " + (reg.script || "none") + ")");
  // The files cache fills after activation (review r1, 2): waited for, as proof.
  await filled(page);
  const caches1 = await cacheMap(page);
  const shell = (caches1["brickford-" + TOKEN] || []).map(u => u.replace(BASE, ""));
  const files = (caches1["brickford-files"] || []).map(u => u.replace(BASE, ""));
  const wantShell = new Set(localRefs(INDEX_HTML).concat(["/platform/index.html"])
    .concat(MANIFEST.icons.map(i => "/platform/" + i.src)));
  const missShell = [...wantShell].filter(u => !shell.includes(u));
  wantShellCount = wantShell.size;
  check(shell.length > 0 && !missShell.length, "this version's cache brickford-" + TOKEN + " holds index.html, everything it loads, and the manifest's icons (" +
    shell.length + " entries" + (missShell.length ? "; missing " + missShell.join(", ") : "") + ")");
  const onDisk = ["data", "js", "css"].flatMap(d => fs.readdirSync(path.join(ROOT, "platform", d)).filter(f => /\.(js|css)$/.test(f)).map(f => "/platform/" + d + "/" + f));
  const missDisk = onDisk.filter(f => !shell.some(u => u.split("?")[0] === f));
  check(!missDisk.length, "every platform/data, js and css file on disk is in it (" + onDisk.length + " files" + (missDisk.length ? "; missing " + missDisk.join(", ") : "") + ")");
  const wantFiles = wantFilesList();
  const missFiles = wantFiles.filter(u => !files.includes(u));
  check(PDFS.length >= 6 && DOCS.length >= 5 && THIRD.length >= 4 && !missFiles.length,
    "brickford-files holds the " + PDFS.length + " revision PDFs, the " + DOCS.length + " Library documents, KaTeX and the font stylesheet (" + THIRD.length +
    ") and the fonts they name" + (missFiles.length ? "; missing " + missFiles.join(", ") : ""));
  check(!w.failed.length && !w.errors.length, "the first load, online: nothing failed (" + w.failed.concat(w.errors).join(", ") + ")");

  // The app can be installed: the manifest, its icons at the sizes it claims,
  // and the apple meta iOS reads instead.
  const icon = (size, purpose) => MANIFEST.icons.find(i => i.sizes === size + "x" + size && (i.purpose || "any").split(" ").includes(purpose));
  const iconsTrue = MANIFEST.icons.every(i => { const s = pngSize(path.join(ROOT, "platform", i.src)); return s && i.sizes === s[0] + "x" + s[1] && i.type === "image/png"; });
  const scope = new URL(MANIFEST.scope, BASE + "/platform/manifest.json").href, start = new URL(MANIFEST.start_url, BASE + "/platform/manifest.json").href;
  check(MANIFEST.name && MANIFEST.short_name && MANIFEST.display === "standalone" && start.startsWith(scope) &&
    icon(192, "any") && icon(512, "any") && icon(512, "maskable") && iconsTrue,
    "manifest: name, short_name, standalone, start_url inside scope, 192 and 512 icons plus a maskable 512, each the size it says");
  const touch = (INDEX_HTML.match(/rel="apple-touch-icon" sizes="180x180" href="([^"?]+)/) || [])[1];
  const ts = touch && pngSize(path.join(ROOT, "platform", touch));
  check(ts && ts[0] === 180 && ts[1] === 180 && /name="apple-mobile-web-app-capable" content="yes"/.test(INDEX_HTML) &&
    /rel="manifest" href="manifest\.json\?v=/.test(INDEX_HTML) && /name="apple-mobile-web-app-title"/.test(INDEX_HTML),
    "iPhone: a 180x180 PNG apple-touch-icon, apple-mobile-web-app-capable and a title");
  const cdp = await ctx.newCDPSession(page);
  const inst = await cdp.send("Page.getInstallabilityErrors").then(r => r.installabilityErrors || [], e => [{ errorId: "unavailable: " + e.message }]);
  check(!inst.length, "Chromium's own installability check: no errors (" + inst.map(e => e.errorId).join(", ") + ")");
  await cdp.detach();

  // Online, every route's heading, to hold the offline one to.
  const online = {};
  for (const r of SHELL_ROUTES) { await launch(page, r); online[r] = await viewFacts(page); }

  // ================= offline =================
  console.log("Offline: no network at all, and the server refusing connections");
  net.offline = true; server.down = true;
  await ctx.setOffline(true);
  const ghBefore = net.ghSeen;
  w = watch(page);
  check(await launch(page, "/") && (await viewFacts(page)).h1 === online["/"].h1 && await page.evaluate(() => navigator.onLine === false),
    "relaunched offline: the dashboard renders (" + online["/"].h1 + ")");
  const bad = [], mathBad = [], withMath = [];
  let font = "";
  for (const r of SHELL_ROUTES) {
    const ok = await launch(page, r);
    const f = await viewFacts(page);
    if (!ok || f.title !== "Brickford" || f.h1 !== online[r].h1 || f.text.length < 40) bad.push(r + " (h1 " + JSON.stringify(f.h1) + ", " + f.text.length + " chars)");
    if (f.katex !== online[r].katex) mathBad.push(r + " " + online[r].katex + " online, " + f.katex + " offline");
    if (f.katex) { withMath.push(r); font = font || f.font; }
  }
  check(!bad.length, "every route verify-shell visits renders offline, the same page as online (" + SHELL_ROUTES.length + " routes" + (bad.length ? "; " + bad.join("; ") : "") + ")");
  check(!w.failed.length && !w.errors.length, "offline, nothing of ours failed to load and nothing threw (" + w.failed.concat(w.errors).slice(0, 8).join(", ") + ")");
  // KaTeX: the script, auto-render and the stylesheet, all out of the cache.
  // Every route's math is typeset offline exactly as online, and the
  // stylesheet's font-family reaches a typeset element.
  check(withMath.length > 0 && !mathBad.length && /KaTeX_Main/.test(font),
    "KaTeX renders offline: the same .katex count as online on every route, " + withMath.length + " with math (" + withMath.join(", ") + "), font " + (font || "none") +
    (mathBad.length ? "; differs: " + mathBad.join("; ") : ""));
  // The Library's documents load by fetch, from beside platform/.
  const docBad = [];
  for (const d of DOCS) {
    await launch(page, "/doc/" + d.id);
    const ok = await page.waitForFunction(() => { const h = document.querySelector("#docHost"); return h && !/^Loading/.test(h.textContent.trim()); }, null, { timeout: 8000 }).then(() => true, () => false);
    const t = await page.evaluate(() => (document.querySelector("#docHost") || {}).innerText || "");
    if (!ok || /Could not load/.test(t) || t.length < 200) docBad.push(d.id);
  }
  check(!docBad.length, "the Library's " + DOCS.length + " documents open offline" + (docBad.length ? " (not: " + docBad.join(", ") + ")" : ""));

  // The lesson: a panel where the video goes, no frame, no loop.
  const yt0 = net.yt;
  await launch(page, "/lesson/math110/0/0");
  const ls = await page.evaluate(() => {
    const v = document.querySelector("#view");
    window.__first = v.firstElementChild; window.__mut = 0;
    new MutationObserver(() => { window.__mut++; }).observe(v, { childList: true });
    const p = document.querySelector("#view .video-off");
    return { panel: p ? p.textContent.trim() : "", frames: v.querySelectorAll("iframe").length, vf: !!v.querySelector(".video-frame") };
  });
  check(/^Video needs a connection/.test(ls.panel) && !ls.frames && !ls.vf, "a lesson offline: the video frame is a plain \"" + ls.panel.split(".")[0] + "\" panel, and no iframe");
  await page.waitForTimeout(6000);   // longer than a push cycle (4s): what a loop would need
  const still = await page.evaluate(() => ({ same: document.querySelector("#view").firstElementChild === window.__first, mut: window.__mut }));
  check(still.same && still.mut === 0 && net.yt === yt0, "and it stays put: no repaint in 6s, no request to YouTube (" + still.mut + " repaints, " + (net.yt - yt0) + " requests)");

  // Ticking a lecture offline, kept on this device.
  await page.click("#view [data-act='toggleDone']");
  const ticked = await page.waitForFunction(() => ((JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons || {})["math110.0.0"] || {}).done === true, null, { timeout: 5000 }).then(() => true, () => false);
  let st = await stored(page);
  check(ticked && !st.settings.syncError, "marking the lecture watched offline is saved locally, and records no sync error (" + JSON.stringify(st.settings.syncError || null) + ")");
  await page.click("#view [data-act='rewatch']").catch(() => {});
  const rw = await page.evaluate(() => ({ frames: document.querySelectorAll("#view iframe").length, toast: document.querySelector("#toast").textContent }));
  check(!rw.frames && /Video needs a connection/.test(rw.toast), "Rewatch offline says so instead of opening a broken frame (" + rw.toast + ")");
  await page.reload({ waitUntil: "load" }).catch(() => {});
  await viewReady(page);
  st = await stored(page);
  const kept = await page.evaluate(() => !!document.querySelector("#view #lqWatched"));
  check((st.lessons["math110.0.0"] || {}).done === true && kept, "and it is still watched after an offline relaunch");

  // Sync, offline: a quiet state, never the rejection latch.
  await launch(page, "/sync");
  const head = await page.evaluate(() => (document.querySelector("[data-sync-head]") || {}).textContent);
  await page.click("#view [data-act='syncPush']");
  const said = await page.waitForFunction(() => /Offline/.test((document.querySelector("#syncMsg") || {}).textContent || ""), null, { timeout: 3000 }).then(() => true, () => false);
  st = await stored(page);
  check(head === "Offline · will sync" && said && !st.settings.syncError,
    "/sync offline reads \"" + head + "\"; Push says it will sync later and records no error, so nothing is latched (" + JSON.stringify(st.settings.syncError || null) + ")");
  await launch(page, "/");
  const dash = await page.evaluate(() => ({ t: (document.querySelector("#view [data-sync-t]") || {}).textContent, failing: /Sync is failing/.test(document.querySelector("#view").innerText) }));
  check(dash.t === "Offline · will sync" && !dash.failing, "the dashboard's sync row reads \"" + dash.t + "\", and nothing says sync is failing");
  check(net.ghSeen === ghBefore, "offline, the app sent GitHub nothing (" + (net.ghSeen - ghBefore) + " requests)");

  // The revision PDFs, opened from the Library the way the owner opens them:
  // a new tab, a top-level navigation outside platform/.
  await launch(page, "/library");
  // Headless Chromium has no PDF viewer, so the PDF arrives as a download,
  // reported on the opener as well as on the tab it opened in, and sometimes
  // on the opener before the tab's own page event: listened for on both, from
  // before the click, and the new tab is its own fact (the page count grew).
  const pagesBefore = ctx.pages().length;
  const dlP = new Promise(res => {
    const t = setTimeout(() => res(null), 10000);
    const got = d => { clearTimeout(t); res(d); };
    page.once("download", got);
    ctx.once("page", p => p.once("download", got));
  });
  await page.click("#view .lb-rev a");
  const dl = await dlP;
  const newTab = await until(() => ctx.pages().length > pagesBefore, 3000);
  const tab = ctx.pages().slice(pagesBefore)[0] || null;
  let pdfOk = false, how = "nothing arrived";
  if (dl) {
    const got = fs.readFileSync(await dl.path()), disk = fs.readFileSync(path.join(ROOT, "revision", PDFS[0]));
    pdfOk = newTab && got.equals(disk) && dl.url() === BASE + "/revision/" + PDFS[0];
    how = got.length + " bytes from " + dl.url().replace(BASE, "") + (newTab ? " in a new tab, " : " (no new tab), ") + (got.equals(disk) ? "identical to " : "not ") + "revision/" + PDFS[0];
  } else if (tab) {
    const body = await tab.evaluate(() => document.contentType).catch(() => "");
    pdfOk = body === "application/pdf"; how = "opened as " + (body || "nothing");
  }
  for (const p of ctx.pages().slice(pagesBefore)) await p.close().catch(() => {});
  check(pdfOk, "the Library's Week 1 tile opens its revision PDF offline, in its own tab (" + how + ")");
  const all = await page.evaluate(async list => Promise.all(list.map(async f => {
    try { const r = await fetch("../revision/" + f); const b = new Uint8Array(await r.arrayBuffer()); return [f, r.status, b.length, String.fromCharCode(...b.slice(0, 5))]; }
    catch (e) { return [f, 0, 0, ""]; }
  })), PDFS);
  const pdfBad = all.filter(([f, s, n, sig]) => s !== 200 || sig !== "%PDF-" || n !== fs.statSync(path.join(ROOT, "revision", f)).size);
  check(!pdfBad.length, "all " + PDFS.length + " revision PDFs come out of the cache whole" + (pdfBad.length ? " (not: " + pdfBad.map(x => x[0]).join(", ") + ")" : ""));

  // ================= online again =================
  console.log("Online again: one push, through the ordinary path");
  await launch(page, "/");
  const puts0 = () => net.gh.filter(g => g.method === "PUT").length - putsBefore;
  const putsBefore = net.gh.filter(g => g.method === "PUT").length;
  net.offline = false; server.down = false;
  await ctx.setOffline(false);
  const words = await page.waitForFunction(() => ((document.querySelector("#view [data-sync-t]") || {}).textContent || "") === "Synced", null, { timeout: 3000 }).then(() => true, () => false);
  check(words, "the dashboard's sync row says Synced again the moment the connection is back, in place");
  const pushed = await until(() => puts0() >= 1, 15000);
  await page.waitForTimeout(6000);   // a second push would need one more 4s cycle
  const puts = puts0();
  st = await stored(page);
  check(pushed && puts === 1, "back online, exactly one push (" + puts + " PUT" + (puts === 1 ? "" : "s") + ")");
  check(!st.settings.syncError && !!st.settings.lastSyncAt && ((st.lessons || {})["math110.0.0"] || {}).done === true,
    "and it succeeded: no sync error, no latch, the offline tick still there (" + JSON.stringify(st.settings.syncError || null) + ")");
  await ctx.close();

  // ================= owed, across a relaunch =================
  console.log("A lecture ticked offline, the app closed before any push, relaunched online");
  {
    const c = await freshContext(browser, true);
    await standIns(c);
    let p = await c.newPage();
    await p.goto(BASE + "/platform/#/lesson/math110/0/0", { waitUntil: "load" });
    await controlled(p);
    await p.waitForFunction(() => !!(JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).lastSyncAt, null, { timeout: 10000 }).catch(() => {});
    net.offline = true; server.down = true;
    await c.setOffline(true);
    await p.reload({ waitUntil: "load" }).catch(() => {});
    await viewReady(p);
    await p.click("#view [data-act='toggleDone']");
    await p.waitForFunction(() => ((JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons || {})["math110.0.0"] || {}).done === true, null, { timeout: 5000 }).catch(() => {});
    const owed = await p.evaluate(() => localStorage.getItem("brickford_sync_pending"));
    await p.close();   // closed at once, still offline: no push could have been made
    net.offline = false; server.down = false;
    await c.setOffline(false);
    const g0 = net.gh.length;
    p = await c.newPage();
    await p.goto(BASE + "/platform/#/", { waitUntil: "load" });
    const put1 = await until(() => net.gh.slice(g0).some(g => g.method === "PUT"), 15000);
    await p.waitForTimeout(6000);   // a second push would need one more 4s cycle
    const puts = net.gh.slice(g0).filter(g => g.method === "PUT");
    const sent = puts.length ? pushedState(puts[0]) : null;
    const after = await p.evaluate(() => localStorage.getItem("brickford_sync_pending"));
    check(!!owed && put1 && puts.length === 1 && !!sent && ((sent.lessons || {})["math110.0.0"] || {}).done === true && after === null,
      "the relaunch pushes it: owed " + JSON.stringify(owed) + " when closed, then exactly one PUT (" + puts.length + "), carrying the tick (" +
      JSON.stringify(sent && (sent.lessons || {})["math110.0.0"] && sent.lessons["math110.0.0"].done) + "), and nothing owed after (" + JSON.stringify(after) + ")");
    await c.close();
  }
  console.log("A pull in flight when the push timer fires: the push still happens");
  {
    const c = await freshContext(browser, true);
    await standIns(c);
    net.holdGet = true;   // the boot pull is out and stays out
    const p = await c.newPage();
    await p.goto(BASE + "/platform/#/lesson/math110/0/0", { waitUntil: "load" });
    const g0 = net.gh.length;
    await p.click("#view [data-act='toggleDone']");
    await p.waitForTimeout(5000);   // the push timer is 4s, by design: it fires while the pull is out
    net.releaseGets();
    const put = await until(() => net.gh.slice(g0).some(g => g.method === "PUT"), 10000);
    const sent = put ? pushedState(net.gh.slice(g0).find(g => g.method === "PUT")) : null;
    check(put && ((sent && sent.lessons || {})["math110.0.0"] || {}).done === true,
      "once the pull is answered, the push it held up is made, carrying the tick (" + (put ? "PUT seen" : "no PUT in 10s") + ")");
    await c.close();
  }

  // ================= a Wi-Fi with no internet =================
  console.log("A Wi-Fi with no internet behind it: navigator.onLine stays true, nothing answers");
  {
    const c = await freshContext(browser, true);
    await standIns(c);
    const p = await c.newPage();
    await p.goto(BASE + "/platform/#/", { waitUntil: "load" });
    await controlled(p) && await filled(p);
    net.captive = true; server.down = true;   // no setOffline
    await launch(p, "/");
    const words = await p.waitForFunction(() => ((document.querySelector("#view [data-sync-t]") || {}).textContent || "") === "Offline \u00b7 will sync", null, { timeout: 8000 }).then(() => true, () => false);
    const d = await p.evaluate(() => ({ onLine: navigator.onLine, failing: /Sync is failing/.test(document.querySelector("#view").innerText),
      err: (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).syncError || null, owed: localStorage.getItem("brickford_sync_pending") }));
    check(d.onLine && words && !d.failing && !d.err && !!d.owed,
      "the dashboard says \"Offline \u00b7 will sync\", not \"Sync is failing\"; no sync error; the sync is owed (onLine " + d.onLine + ", error " + JSON.stringify(d.err) + ", owed " + JSON.stringify(d.owed) + ")");
    await launch(p, "/lesson/math110/0/0");
    const panel = await p.waitForSelector("#view .video-off", { state: "attached", timeout: 8000 }).then(() => true, () => false);
    const frames = await p.evaluate(() => document.querySelectorAll("#view iframe").length);
    check(panel && !frames, "a lesson there: its frame, whose player never answered, becomes the \"Video needs a connection\" panel (" + frames + " iframes)");
    net.captive = false; server.down = false;
    const g0 = net.gh.length;
    await launch(p, "/");
    const put = await until(() => net.gh.slice(g0).some(g => g.method === "PUT"), 15000);
    const back = await p.waitForFunction(() => ((document.querySelector("#view [data-sync-t]") || {}).textContent || "") === "Synced" && !localStorage.getItem("brickford_sync_pending"), null, { timeout: 8000 }).then(() => true, () => false);
    check(put && back, "the internet back, the next launch pushes what was owed and reads Synced, nothing owed");
    await c.close();
  }

  // ================= a rejected token, then offline =================
  console.log("A rejected token, then offline: the latch is what the status says");
  {
    const c = await freshContext(browser, true);
    await standIns(c);
    net.ghStatus = 401;
    const p = await c.newPage();
    await p.goto(BASE + "/platform/#/", { waitUntil: "load" });
    await controlled(p);
    const fatal = await p.waitForFunction(() => ((JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).syncError || {}).fatal === true, null, { timeout: 10000 }).then(() => true, () => false);
    net.ghStatus = 200;
    net.offline = true; server.down = true;
    await c.setOffline(true);
    await launch(p, "/");
    const d = await p.evaluate(() => ({ t: (document.querySelector("#view [data-sync-t]") || {}).textContent, v: (document.querySelector("#view [data-sync-v]") || {}).textContent,
      failing: /Sync is failing/.test(document.querySelector("#view").innerText) }));
    await launch(p, "/sync");
    const head = await p.evaluate(() => (document.querySelector("[data-sync-head]") || {}).textContent);
    check(fatal && d.t === "Synced" && d.v === "failing" && d.failing && head === "Connected, but failing",
      "latched by a 401, then offline: the row reads \"" + d.t + " \u00b7 " + d.v + "\", \"Sync is failing\" stays, /sync reads \"" + head + "\" (never \"will sync\")");
    net.offline = false; server.down = false;
    await c.close();
  }

  // ================= the video, back =================
  console.log("The video comes back with the connection, in place");
  {
    const c = await freshContext(browser, true);
    await standIns(c);
    const p = await c.newPage();
    await p.goto(BASE + "/platform/#/lesson/math110/0/0", { waitUntil: "load" });
    await controlled(p);
    net.offline = true; server.down = true;
    await c.setOffline(true);
    await p.reload({ waitUntil: "load" }).catch(() => {});
    await viewReady(p);
    const before = await p.evaluate(() => { window.__first = document.querySelector("#view").firstElementChild; return !!document.querySelector("#view .video-off"); });
    net.offline = false; server.down = false;
    await c.setOffline(false);
    const back = await p.waitForSelector("#view .video-frame iframe[data-k]", { state: "attached", timeout: 5000 }).then(() => true, () => false);
    const after = await p.evaluate(() => ({ off: !!document.querySelector("#view .video-off"), same: document.querySelector("#view").firstElementChild === window.__first }));
    check(before && back && !after.off && after.same, "offline the panel, online the player in its place, and the rest of the page untouched (not a repaint)");
    await c.close();
  }

  // ================= one stalled download =================
  console.log("One download that stalls during the first install does not hold the worker back");
  {
    const c = await freshContext(browser, false);
    await standIns(c);
    server.hang = q => q === "/revision/" + PDFS[2];
    const p = await c.newPage();
    const t0 = Date.now();
    await p.goto(BASE + "/platform/#/", { waitUntil: "load" });
    const on = await controlled(p, TOKEN, 15000);
    const secs = (Date.now() - t0) / 1000;
    const shell = on ? ((await cacheMap(p))["brickford-" + TOKEN] || []).length : 0;
    check(on && shell >= wantShellCount, "revision/" + PDFS[2] + " taken and never answered: the worker is active anyway, in " + secs.toFixed(1) +
      "s (under 15s), its shell complete (" + shell + " of " + wantShellCount + ")");
    server.release();
    await c.close();
  }

  // ================= a network that never answers =================
  console.log("A network that takes the request and never answers: the cache, after 3s");
  {
    const c = await freshContext(browser, false);
    await standIns(c);
    const p = await c.newPage();
    await p.goto(BASE + "/platform/#/", { waitUntil: "load" });
    const ready = await controlled(p) && await filled(p);
    // A second page, open before the network goes quiet: the PDF and document
    // fetches run there, so they never wait on a navigation that is hanging.
    const p2 = await c.newPage();
    await p2.goto(BASE + "/platform/#/library", { waitUntil: "load" });
    // Online as far as the browser knows: nothing is refused, nothing answers.
    server.hang = q => /^\/platform\/(index\.html)?$|^\/revision\/|\.md$/.test(q);
    net.hangFontCss = true;
    await p.goto("about:blank");
    const t0 = Date.now();
    p.goto(BASE + "/platform/#/", { waitUntil: "commit", timeout: 20000 }).catch(() => {});
    const shown = await p.waitForFunction(() => !!document.querySelector("#view > *") && !!document.querySelector("#view h1"), null, { timeout: 15000 }).then(() => true, () => false);
    const s0 = (Date.now() - t0) / 1000;
    check(ready && shown && s0 < 5, "index.html and the font stylesheet taken and never answered: the app opens from the cache in " + s0.toFixed(1) + "s (under 5s)");
    const t1 = Date.now();
    const got = await Promise.race([p2.evaluate(async list => Promise.all(list.map(async u => {
      try { const r = await fetch(u, { signal: AbortSignal.timeout(10000) }); return [u, r.status, (await r.arrayBuffer()).byteLength]; } catch (e) { return [u, 0, 0]; }
    })), ["../revision/" + PDFS[0], "../" + DOCS[0].file]).catch(() => []), new Promise(r => setTimeout(r, 15000, []))]);
    const s1 = (Date.now() - t1) / 1000;
    const sizes = [fs.statSync(path.join(ROOT, "revision", PDFS[0])).size, fs.statSync(path.join(ROOT, DOCS[0].file)).size];
    check(got.length === 2 && got.every((g, i) => g[1] === 200 && g[2] === sizes[i]) && s1 < 5,
      "a revision PDF and a Library document the same way, whole, in " + s1.toFixed(1) + "s (under 5s)");
    net.hangFontCss = false;
    server.release();
    await c.close();
  }
  await browser.close();

  // ================= the update =================
  // A second browser: no routes (routing turns the HTTP cache off, and this is
  // about the HTTP cache), and every host but this one resolving nowhere.
  console.log("Update: version A, then B on the next launch");
  {
    const b2 = await chromium.launch(SEALED);
    const c = await freshContext(b2, false);
    server.token = TOKEN;
    const p1 = await c.newPage();
    await p1.goto(BASE + "/platform/#/lesson/math110/0/0", { waitUntil: "load" });
    const a = await controlled(p1);
    const ca = a ? await cacheMap(p1) : {};
    check(a && !!ca["brickford-" + TOKEN], "A: installed, its cache brickford-" + TOKEN + " in place");
    // A video on screen in the page that is open when B arrives.
    const hasFrame = await p1.evaluate(() => { const f = document.querySelector("#view .video-frame iframe"); window.__keep = "A"; if (f) f.__keep = "A"; return !!f; });
    server.token = TOKEN_B;
    const p2 = await c.newPage();
    await p2.goto(BASE + "/platform/#/", { waitUntil: "load" });
    const appB = await p2.evaluate(() => (document.querySelector('script[src*="js/app.js"]') || {}).src || "");
    check(appB.endsWith("?v=" + TOKEN_B) && await viewReady(p2), "the next launch runs B: index.html came from the network, past a fresh HTTP cache (" + appB.replace(BASE, "") + ")");
    const swB = await controlled(p2, TOKEN_B);
    const cb = await cacheMap(p2);
    check(swB && !!cb["brickford-" + TOKEN_B] && !cb["brickford-" + TOKEN] && !!cb["brickford-files"],
      "B's worker is in charge, its cache is there and A's is gone (caches: " + Object.keys(cb).join(", ") + ")");
    const old = await p1.evaluate(() => { const f = document.querySelector("#view .video-frame iframe");
      return { keep: window.__keep, frame: !!f && f.__keep === "A", app: (document.querySelector('script[src*="js/app.js"]') || {}).src || "" }; });
    check(hasFrame && old.keep === "A" && old.frame && old.app.endsWith("?v=" + TOKEN),
      "the page that was open, with its video, was not reloaded: same document, same frame, still running A");
    server.down = true;
    await c.setOffline(true);
    const p3 = await c.newPage();
    await p3.goto(BASE + "/platform/#/", { waitUntil: "load" }).catch(() => {});
    await viewReady(p3);
    const appOff = await p3.evaluate(() => (document.querySelector('script[src*="js/app.js"]') || {}).src || "").catch(() => "");
    check(appOff.endsWith("?v=" + TOKEN_B), "and an offline launch after the update is B too, not A (" + appOff.replace(BASE, "") + ")");
    server.down = false; server.token = TOKEN;
    await b2.close();
  }

  // ================= file:// =================
  console.log("file://: where the other gates load the app, no worker");
  {
    const b3 = await chromium.launch(SEALED);
    const c = await freshContext(b3, false);
    const p = await c.newPage();
    const errs = []; p.on("pageerror", e => errs.push(e.message));
    await p.goto("file://" + INDEX_FILE + "#/", { waitUntil: "load" });
    await p.waitForTimeout(500);
    const r = await p.evaluate(async () => ({ view: !!document.querySelector("#view > *"),
      regs: navigator.serviceWorker && navigator.serviceWorker.getRegistrations ? (await navigator.serviceWorker.getRegistrations().catch(() => [])).length : 0 }));
    check(r.view && r.regs === 0 && !errs.length, "file:// renders as before and registers nothing (" + r.regs + " registrations" + (errs.length ? ", " + errs[0] : "") + ")");
    await b3.close();
  }

  srv.close();
  console.log(fails
    ? "\nFAIL — " + fails + " of " + checks + " offline checks failed"
    : "\nPASS — offline: " + SHELL_ROUTES.length + " routes, " + DOCS.length + " documents and " + PDFS.length + " revision PDFs with no connection, one push on return, A to B on the next launch (" + checks + " checks)");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
