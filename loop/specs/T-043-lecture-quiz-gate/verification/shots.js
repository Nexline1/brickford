// T-043 criterion 7: the five states at 1440 and 390, Dark and Light.
//   node loop/specs/T-043-lecture-quiz-gate/verification/shots.js
// Fresh context per shot, clock pinned to Tue 20 Oct 2026 (UTC), no network.
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = path.resolve(__dirname, "../../../..");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const OUT = path.join(__dirname, "screens");
fs.mkdirSync(OUT, { recursive: true });
const P = (d, ft, n) => ({ passedAt: d, at: d + "T10:00:00.000Z", firstTry: ft, total: n, attempts: n + 1 });
const prev = { "math120.0.11": { done: true, doneAt: "2026-10-16", notes: "", checks: [], quiz: P("2026-10-16", 2, 2) } };
const STATES = [
  ["1-before-watched", "/lesson/math120/1/0", { lessons: prev }],
  ["2-quiz-after-miss", "/lesson/math120/1/0", { lessons: Object.assign({}, prev, { "math120.1.0": { done: true, doneAt: "2026-10-20", notes: "", checks: [] } }) }, true],
  ["3-passed-go-deeper", "/lesson/math110/0/13", { lessons: { "math110.0.12": { done: true, doneAt: "2026-10-19", notes: "", checks: [], quiz: P("2026-10-19", 3, 3) },
    "math110.0.13": { done: true, doneAt: "2026-10-19", notes: "", checks: [], quiz: P("2026-10-19", 2, 3) } } }],
  ["4-locked", "/lesson/math120/1/1", {}],
  ["5-dashboard-quiz", "/", {}],
];
(async () => {
  const b = await chromium.launch();
  for (const theme of ["dark", "light"]) for (const [w, h, mob] of [[1440, 900, false], [390, 844, true]]) for (const [name, route, state, miss] of STATES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
    await ctx.route(/^https?:/, r => r.abort());
    await ctx.addInitScript(s => { if (window.top === window) localStorage.setItem("darhikmah_v1", s); },
      JSON.stringify(Object.assign({ settings: { theme, themeNavyOnce: true } }, state)));
    const page = await ctx.newPage();
    await page.goto(URL + route, { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    if (miss) {
      await page.waitForSelector("#view .lq-card");
      await page.evaluate(() => {
        const c = document.querySelector("#view .lq-card"), q = window.DAR.SUMMARIES["math120.1.0"].checks[+c.dataset.q];
        const o = [...c.querySelectorAll(".opt")].find(x => +x.dataset.o !== q.a);
        if (o) o.click(); else { document.querySelector("#view #numAns").value = "-98765"; document.querySelector("#view #numGo").click(); }
      });
    }
    await page.evaluate(() => Promise.all(document.getAnimations().filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
    if (miss) await page.evaluate(() => document.querySelector("#view .lq-watched").scrollIntoView({ block: "start" }));
    const file = path.join(OUT, name + "-" + w + "-" + theme + ".png");
    await page.screenshot({ path: file });
    console.log(path.relative(ROOT, file));
    await ctx.close();
  }
  await b.close();
})();
