// T-051a: the app after the foundation phase, as the owner will see it.
//   node loop/design/apple-51a/shots.js
// Dashboard, a lecture (MATH 130's Conditional Probability, the one the mockup
// draws) and Problems, at 390 (2x, the tab bar) and 1440 (1x, the sidebar), in
// Light and Dark. The real day: 21 October 2026, plan day 15, nothing stored
// but the theme. The network is cut, as in every gate, so the lecture's video
// frame is empty and KaTeX (a CDN) leaves its $...$ source showing.
// Each PNG is the whole page: the viewport grows to the page's height first.
"use strict";
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const URL = "file://" + path.resolve(__dirname, "../../../platform/index.html") + "#";
const SCREENS = [["dashboard", "/"], ["lesson", "/lesson/math130/0/3"], ["problems", "/workshop"]];
const SIZES = [[390, 844, 2, true], [1440, 900, 1, false]];

(async () => {
  const browser = await chromium.launch();
  for (const [w, h, dpr, mobile] of SIZES) for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date("2026-10-21T09:00:00Z"));
    await ctx.route(/^https?:/, r => r.abort());
    await ctx.addInitScript(t => { if (window.top === window) localStorage.setItem("darhikmah_v1", JSON.stringify({ settings: { theme: t, themeNavyOnce: true } })); }, theme);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    for (const [name, route] of SCREENS) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(URL + route, { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      const full = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
      await page.setViewportSize({ width: w, height: Math.max(h, full) });
      await page.waitForTimeout(250);
      const file = path.join(__dirname, "apple-51a-" + name + "-" + w + "-" + theme + ".png");
      await page.screenshot({ path: file });
      console.log(path.basename(file), w + "x" + Math.max(h, full), "@" + dpr + "x", errors.length ? "ERRORS " + errors.join(" | ") : "");
    }
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
