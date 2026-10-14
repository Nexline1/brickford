// T-033 screenshots: a new lecture's "Check yourself" at 1440 and 390, Dark and
// Light — the button under the summary, then the quiz mounted on its first
// question. Lecture: AI 310 Unit II lesson 2 (quantization), a T-033 entry.
//   NODE_PATH=/opt/node22/lib/node_modules node loop/specs/T-033-lecture-quizzes/verification/shots.js
// Also asserts, by computed style and not by eye, that the button and the first
// question are on screen and inside the viewport width.
"use strict";
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = path.resolve(__dirname, "../../../..");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const OUT = path.join(__dirname, "shots");
const STATE = theme => ({ settings: { theme, themeNavyOnce: true } });
const settle = page => page.evaluate(() => Promise.all(document.getAnimations()
  .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
(async () => {
  require("fs").mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  let fails = 0;
  for (const [w, theme] of [[1440, "dark"], [1440, "light"], [390, "dark"], [390, "light"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 860 ? 844 : 900 }, timezoneId: "UTC", reducedMotion: "reduce",
      isMobile: w < 860, hasTouch: w < 860, colorScheme: theme });
    await ctx.route(/^https?:/, r => r.abort());
    await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
    await ctx.addInitScript(s => { if (window.top === window && !sessionStorage.getItem("__s")) { sessionStorage.setItem("__s", "1"); localStorage.setItem("darhikmah_v1", s); } }, JSON.stringify(STATE(theme)));
    const page = await ctx.newPage();
    await page.goto(URL + "/lesson/ai310/1/2", { waitUntil: "load" });
    const btn = '#view [data-act="startSummaryCheck"]';
    await page.waitForSelector(btn);
    await settle(page);
    await page.evaluate(b => document.querySelector(b).scrollIntoView({ block: "center" }), btn);
    await settle(page);
    const tag = w + "-" + theme;
    const b = await page.evaluate(b => { const e = document.querySelector(b), r = e.getBoundingClientRect();
      return { text: e.textContent, vis: e.checkVisibility(), left: r.left, right: r.right, h: r.height, vw: innerWidth, theme: document.documentElement.dataset.theme }; }, btn);
    const okB = b.vis && b.left >= 0 && b.right <= b.vw && /Check yourself · 6 questions/.test(b.text);
    console.log((okB ? "  ok    " : "  FAIL  ") + tag + " button '" + b.text + "' visible, x " + Math.round(b.left) + "-" + Math.round(b.right) + " of " + b.vw + ", h " + Math.round(b.h) + "px, data-theme " + b.theme);
    if (!okB) fails++;
    await page.screenshot({ path: path.join(OUT, "check-yourself-" + tag + "-button.png") });
    if (w < 860) await page.tap(btn); else await page.click(btn);
    await page.waitForSelector("#sumCheck .q-card");
    await settle(page);
    await page.evaluate(() => document.querySelector("#sumCheck .q-card").scrollIntoView({ block: "start" }));
    await settle(page);
    const q = await page.evaluate(() => { const c = document.querySelector("#sumCheck .q-card"), r = c.getBoundingClientRect();
      return { opts: c.querySelectorAll(".opt").length, num: !!c.querySelector("#numAns"), q: c.querySelector(".q-text").textContent.slice(0, 60),
        right: r.right, vw: innerWidth, sw: document.documentElement.scrollWidth }; });
    const okQ = (q.opts === 4 || q.num) && q.right <= q.vw && q.sw <= q.vw;
    console.log((okQ ? "  ok    " : "  FAIL  ") + tag + " question mounted: " + (q.num ? "numeric" : q.opts + " options") + ", '" + q.q + "…', no horizontal overflow (" + q.sw + " <= " + q.vw + ")");
    if (!okQ) fails++;
    await page.screenshot({ path: path.join(OUT, "check-yourself-" + tag + "-question.png") });
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? "\n" + fails + " FAILED" : "\nPASS — Check yourself on ai310.1.2 at 1440/390 x Dark/Light: button visible, quiz mounts, no overflow");
  process.exit(fails ? 1 : 0);
})();
