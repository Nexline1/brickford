// T-051-1: the app before and after colours, type and buttons, as the owner sees it.
//   node loop/design/apple-1/shots.js after               (this checkout)
//   node loop/design/apple-1/shots.js before <dir>        (<dir> holds main's platform/, e.g.
//                                                           git archive 3968924 platform | tar -x -C <dir>)
// Dashboard, a lecture (MATH 130 lecture 3, the open one on 29 Oct, which the
// owner's phone shows as the next thing) and Problems, at 390 (3x, the tab bar) and 1440
// (1x, the sidebar), in Light and Dark. The real day, 29 October 2026, and
// nothing stored but the theme. The network is cut, as in every gate, so the
// lecture's video frame is empty and KaTeX (a CDN) leaves its $...$ source
// showing. Each PNG is the first screen: what a thumb sees before it scrolls.
"use strict";
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const which = process.argv[2] === "before" ? "before" : "after";
const root = which === "before" ? path.resolve(process.argv[3] || ".") : path.resolve(__dirname, "../../..");
const URL = "file://" + path.join(root, "platform/index.html") + "#";
const SCREENS = [["dashboard", "/"], ["lesson", "/lesson/math130/0/2"], ["problems", "/workshop"]];
const SIZES = [[390, 844, 3, true], [1440, 900, 1, false]];

(async () => {
  const browser = await chromium.launch();
  for (const [w, h, dpr, mobile] of SIZES) for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date("2026-10-29T09:00:00Z"));
    await ctx.route(/^https?:/, r => r.abort());
    await ctx.addInitScript(t => { if (window.top === window) localStorage.setItem("darhikmah_v1", JSON.stringify({ settings: { theme: t, themeNavyOnce: true } })); }, theme);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    for (const [name, route] of SCREENS) {
      await page.goto(URL + route, { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => Promise.all(document.getAnimations()
        .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
      await page.waitForTimeout(300);
      const file = path.join(__dirname, which + "-" + name + "-" + w + "-" + theme + ".png");
      await page.screenshot({ path: file });
      const face = await page.evaluate(() => [...document.fonts].filter(f => f.status === "loaded").map(f => f.family.replace(/"/g, "")).join(",") || "system");
      console.log(path.basename(file), w + "x" + h, "@" + dpr + "x", "faces " + face, errors.length ? "ERRORS " + errors.join(" | ") : "");
    }
    await ctx.close();
  }
  // And the owner's own phone: his 29 Oct screenshot (owner-2026-10-29-*.png)
  // matches this app rendered 320 CSS px wide across a 393pt iPhone — Display
  // Zoom, or Safari's page zoom — so the dashboard is also taken there, in
  // Dark, at his screenshot's pixel size (960 wide), to set beside it.
  {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 693 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date("2026-10-29T09:00:00Z"));
    await ctx.route(/^https?:/, r => r.abort());
    await ctx.addInitScript(() => { if (window.top === window) localStorage.setItem("darhikmah_v1", JSON.stringify({ settings: { theme: "dark", themeNavyOnce: true } })); });
    const page = await ctx.newPage();
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const file = path.join(__dirname, which + "-dashboard-320-dark-as-owner.png");
    await page.screenshot({ path: file });
    console.log(path.basename(file), "320x693 @3x");
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
