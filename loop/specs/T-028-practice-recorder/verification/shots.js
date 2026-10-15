// T-028 screenshots: /practice at 1440 and 390, Dark and Light — idle, mid-
// recording (a fake microphone), and after the stop with the clip in the list;
// plus Humour, Story bank and the no-microphone card once each at 390.
//   NODE_PATH=/opt/node22/lib/node_modules node loop/specs/T-028-practice-recorder/verification/shots.js
"use strict";
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = path.resolve(__dirname, "../../../..");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const OUT = __dirname;
const bank = d => ({ date: d, what: "a client asked what an embedding was", why: "he got it in 20 seconds" });
const STATE = theme => ({ settings: { theme, themeNavyOnce: true },
  reps: { bank: [bank("2026-10-19"), bank("2026-10-20")], story: [{ date: "2026-10-16", seconds: 72, takes: 2, from: "the napkin one" }], humor: [], review: [] } });
const settle = page => page.evaluate(() => Promise.all(document.getAnimations()
  .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
(async () => {
  for (const mic of [true, false]) {
    const browser = await chromium.launch({ args: mic ? ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] : [] });
    const runs = mic ? [[1440, "dark"], [1440, "light"], [390, "dark"], [390, "light"]] : [[390, "dark"], [1440, "light"]];
    for (const [w, theme] of runs) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 860 ? 844 : 900 }, timezoneId: "UTC", reducedMotion: "reduce",
        isMobile: w < 860, hasTouch: w < 860, colorScheme: theme });
      await ctx.route(/^https?:/, r => r.abort());
      await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
      await ctx.addInitScript(s => { if (window.top === window && !sessionStorage.getItem("__s")) { sessionStorage.setItem("__s", "1"); localStorage.setItem("darhikmah_v1", s); } }, JSON.stringify(STATE(theme)));
      const page = await ctx.newPage();
      await page.goto(URL + "/practice", { waitUntil: "load" });
      await page.waitForSelector("#view .pr-seg");
      await page.waitForFunction(() => document.querySelector("#prClips").getAttribute("aria-busy") === "false");
      await settle(page);
      const tag = w + "-" + theme;
      if (!mic) {
        await page.click("#view .pr-rec");
        await page.waitForSelector("#view .pr-nomic");
        await settle(page);
        await page.screenshot({ path: path.join(OUT, "practice-" + tag + "-no-microphone.png") });
        await ctx.close();
        continue;
      }
      await page.screenshot({ path: path.join(OUT, "practice-" + tag + "-idle.png") });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => /^0:0[3-9]/.test(document.querySelector("#view .pr-time").textContent));
      await page.screenshot({ path: path.join(OUT, "practice-" + tag + "-recording.png") });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1);
      await settle(page);
      await page.evaluate(() => { const t = document.querySelector("#toast"); if (t) t.classList.remove("show"); });
      await page.evaluate(() => document.querySelector("#view .ghead").scrollIntoView({ block: "start" }));
      await page.screenshot({ path: path.join(OUT, "practice-" + tag + "-recorded.png"), fullPage: w >= 860 });
      if (w === 390 && theme === "dark") {
        await page.evaluate(() => window.scrollTo(0, 0));
        // Tapped, as a phone does (a mouse click leaves a hover behind), and
        // shot only once the pressed tab's transition has finished and the
        // tab reads pressed (review 1: the first story-bank shot caught it
        // mid-transition, with the wrong tab looking picked).
        const tab = async k => {
          await page.tap("#view [data-ptab=" + k + "]");
          await page.waitForFunction(k => document.querySelector("#view [data-ptab=" + k + "]").getAttribute("aria-pressed") === "true", k);
          await settle(page);
        };
        await tab("humor");
        await page.tap("#view .pr-write summary");
        await settle(page);
        await page.screenshot({ path: path.join(OUT, "practice-" + tag + "-humour.png"), fullPage: true });
        await tab("bank");
        await page.screenshot({ path: path.join(OUT, "practice-" + tag + "-story-bank.png") });
      }
      await ctx.close();
    }
    await browser.close();
  }
  console.log("written to " + OUT);
})().catch(e => { console.error(e); process.exit(1); });
