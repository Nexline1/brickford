// Diagnostic for verify-flows (p) "none yet": replays the block N times and
// records, at document start (before the harness seed), whether sessionStorage's
// __seeded flag and the state's ledger survived the reload.
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = process.argv[2], N = +process.argv[3] || 20;
const { provenReload } = require(path.join(ROOT, "tools/lib-reload.js"));
const http = require("http"), fs = require("fs");
const srv = http.createServer((q, r) => { const f = path.join(ROOT, "platform", decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": f.endsWith(".html") ? "text/html" : f.endsWith(".js") ? "text/javascript" : f.endsWith(".css") ? "text/css" : "application/octet-stream" }); r.end(d); }); });
let URL;
const TODAY = "2026-11-01";
const P_STATE = { settings: { theme: "dark", themeNavyOnce: true } };
srv.listen(0, "127.0.0.1", async () => { URL = process.argv[4] === "file" ? "file://" + path.join(ROOT, "platform/index.html") + "#" : "http://127.0.0.1:" + srv.address().port + "/index.html#";
  const br = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  const tally = {};
  for (let i = 0; i < N; i++) {
    const ctx = await br.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.route(/^https?:/, r => /^http:\/\/127\.0\.0\.1:/.test(r.request().url()) ? r.continue() : r.abort());
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    await ctx.addInitScript(() => { if (window.top !== window) return;
      let led = -1; try { led = (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").ledger || []).length; } catch (e) {}
      window.__diag = { seeded: sessionStorage.getItem("__seeded"), led, has: localStorage.getItem("darhikmah_v1") !== null, lsLen: localStorage.length, keys: Object.keys(localStorage), sessLen: sessionStorage.length }; });
    await ctx.addInitScript(s => { if (window.top === window && !sessionStorage.getItem("__seeded")) { sessionStorage.setItem("__seeded", "1"); localStorage.setItem("darhikmah_v1", s); } }, JSON.stringify(P_STATE));
    await ctx.addInitScript(() => { if (window.top !== window || !navigator.mediaDevices) return; window.__streams = [];
      const g = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async c => { const s = await g(c); window.__streams.push(s); return s; }; });
    const page = await ctx.newPage();
    let out;
    try {
      await page.goto(URL + "/practice", { waitUntil: "load" });
      await page.waitForSelector("#view .seg");
      await page.click("#view [data-ptab=story]");
      await page.waitForFunction(() => document.querySelector("#view [data-ptab=story]").getAttribute("aria-pressed") === "true");
      await page.evaluate(() => { window.__recLimit = 3; });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => /^0:02 /.test(document.querySelector("#view .pr-time").textContent.trim()), null, { timeout: 8000 });
      await page.evaluate(() => window.__streams.forEach(s => s.getTracks().forEach(t => t.stop())));
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 2, null, { timeout: 10000 }).catch(() => {});
      const before = await page.evaluate(() => { const r = localStorage.getItem("darhikmah_v1"); return { has: r !== null, led: r ? (JSON.parse(r).ledger || []).length : null, seeded: sessionStorage.getItem("__seeded"), clips: document.querySelectorAll("#view .pr-clip").length, keys: Object.keys(localStorage) }; });
      const pr = await provenReload(page, { waitUntil: "load" }, false);
      await page.waitForSelector("#view > *");
      const boot = await page.evaluate(() => window.__diag);
      const after = await page.evaluate(() => { const r = localStorage.getItem("darhikmah_v1"); return r ? (JSON.parse(r).ledger || []).length : "NULL"; });
      out = { before, boot, after, proven: { report: pr.report, events: pr.reportEvents, pboot: pr.boot, lost: pr.lost, appRemoved: pr.appRemoved } };
    } catch (e) { out = { err: e.message.split("\n")[0] }; }
    const key = JSON.stringify(out.err ? { err: out.err } : { beforeHas: out.before.has, bootHas: out.boot.has, report: !!out.proven.report, stampAtBoot: out.proven.pboot.local !== null, stateAtBootProbe: out.proven.pboot.state, lost: out.proven.lost, bootSeeded: out.boot.seeded, bootLed: out.boot.led, after: out.after });
    tally[key] = (tally[key] || 0) + 1;
    console.log(i + 1, JSON.stringify(out));
    await ctx.close();
  }
  console.log("TALLY", JSON.stringify(tally, null, 1));
  await br.close(); srv.close();
});
