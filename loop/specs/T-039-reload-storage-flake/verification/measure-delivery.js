// measure-delivery.js <tree> <n>: the switch (c) path n times (verify-design's context: 1280x800, light
// scheme, pinned clock, network refused, bareSettings-once seed; a real save; Light picked), then the
// reload through <tree>/tools/lib-reload.js's provenReload with { session: true }. Per reload it records
// which unload events reported through the harness BINDING by the time provenReload returned, and, for
// comparison, which reported through console.log from listeners added just before (the old channel).
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const tree = path.resolve(process.argv[2]), N = +process.argv[3];
const { provenReload } = require(path.join(tree, "tools/lib-reload.js"));
const URL = "file://" + path.join(tree, "platform/index.html") + "#";
const bare = new Function("args", "if (window.top !== window) return; if (sessionStorage.getItem('__bare')) return; sessionStorage.setItem('__bare', '1'); localStorage.setItem('darhikmah_v1', JSON.stringify({ settings: {\"theme\":\"light\"} }));");
(async () => {
  const browser = await chromium.launch();
  const t = { reloads: 0, stored: 0, binding: 0, bindingAll3: 0, console: 0, consoleAll3: 0, bindingOnlyMissing: 0, consoleOnlyMissing: 0, lost: 0, appRemoved: 0, noReport: 0, pageErrors: 0 };
  const seqs = {};
  for (let i = 0; i < N; i++) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "light", timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
    await ctx.route(/^https?:/, r => r.abort());
    await ctx.addInitScript(bare, [0]);
    const page = await ctx.newPage();
    page.on("pageerror", () => t.pageErrors++);
    const cons = [];
    page.on("console", m => { const x = m.text(); if (x.startsWith("__cmpConsole ")) cons.push(x.slice(13)); });
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await page.click(".card.one.lead a.one-go");
    await page.waitForSelector("#view [data-act=toggleDone]");
    await page.click("#view [data-act=toggleDone]");
    await page.waitForFunction(() => /^Unmark watched/.test((document.querySelector("#view [data-act=toggleDone]") || {}).textContent || ""), null, { timeout: 5000 }).catch(() => {});
    await page.click("#themeBtn");
    await page.click("#themeMenu [data-theme-pick='light']");
    await page.evaluate(() => {
      const tell = ev => () => { if (ev === "visibilitychange" && document.visibilityState !== "hidden") return; console.log("__cmpConsole " + ev); };
      window.addEventListener("pagehide", tell("pagehide"));
      document.addEventListener("visibilitychange", tell("visibilitychange"));
      window.addEventListener("unload", tell("unload"));
    });
    const r = await provenReload(page, { waitUntil: "load" }, true);
    t.reloads++;
    if (r.storedBefore) t.stored++;
    const b = r.reportEvents, c = cons.slice();
    if (b.length) t.binding++;
    if (b.length === 3) t.bindingAll3++;
    if (c.length) t.console++;
    if (c.length === 3) t.consoleAll3++;
    if (!b.length && c.length) t.bindingOnlyMissing++;
    if (b.length && !c.length) t.consoleOnlyMissing++;
    if (r.lost) t.lost++;
    if (r.appRemoved) t.appRemoved++;
    if (r.storedBefore && !r.report) t.noReport++;
    const k = "binding " + (b.join(">") || "(none)") + " | console " + (c.join(">") || "(none)");
    seqs[k] = (seqs[k] || 0) + 1;
    if (r.lost) console.log("LOST " + JSON.stringify({ report: r.report, boot: r.boot }));
    await ctx.close();
  }
  await browser.close();
  console.log("SEQUENCES " + JSON.stringify(seqs, null, 1));
  console.log("TALLY " + JSON.stringify(t));
})().catch(e => { console.error(e); process.exit(2); });
