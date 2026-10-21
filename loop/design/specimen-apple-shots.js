// T-051: the 12 specimen screenshots.
//   python3 -m http.server 8766 --bind 127.0.0.1   (from the repo root)
//   node loop/design/specimen-apple-shots.js
// Each PNG is the whole screen: the viewport is grown to the page's height
// before the shot, so the fixed sidebar and tab bar sit where they would on a
// device scrolled to the end. Phone at 2x (hairlines draw 0.5px), desktop at
// 1x (hairlines take the 1px fallback).
"use strict";
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BASE = process.env.SPECIMEN_URL || "http://127.0.0.1:8766/loop/design/specimen-apple.html";
const OUT = __dirname;
const SCREENS = ["dashboard", "lesson", "problems"];
const SIZES = [[390, 844, 2], [1440, 900, 1]];
const THEMES = ["light", "dark"];

(async () => {
  const browser = await chromium.launch();
  for (const [w, h, dpr] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    for (const screen of SCREENS) for (const theme of THEMES) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(BASE + "?screen=" + screen + "&theme=" + theme, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const font = await page.evaluate(() => document.fonts.check('17px "Inter"') && [...document.fonts].some(f => f.family.replace(/"/g, "") === "Inter" && f.status === "loaded"));
      if (!font) throw new Error("Inter did not load for " + screen + " " + w);
      const full = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
      await page.setViewportSize({ width: w, height: Math.max(h, full) });
      await page.waitForTimeout(150);
      const file = path.join(OUT, "specimen-apple-" + screen + "-" + w + "-" + theme + ".png");
      await page.screenshot({ path: file });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      console.log(path.basename(file), w + "x" + Math.max(h, full), "@" + dpr + "x", overflow > 0 ? "HORIZONTAL OVERFLOW " + overflow + "px" : "");
    }
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
