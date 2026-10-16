// T-045 criterion 6: Problems (and the dashboard line) at 1440 and 390, Dark and Light.
//   node loop/specs/T-045-problems-due-now/verification/shots.js [filter]
// Fresh context per shot, clock pinned to Tue 20 Oct 2026 (UTC, plan phase 1), no network.
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = path.resolve(__dirname, "../../../..");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const OUT = path.join(__dirname, "screens");
fs.mkdirSync(OUT, { recursive: true });
const P = (d, n) => ({ passedAt: d, at: d + "T10:00:00.000Z", firstTry: n, total: n, attempts: n });
const L = (d, quiz) => Object.assign({ done: true, doneAt: d, notes: "", checks: [] }, quiz ? { quiz } : {});
const ALL = { lessons: {
  "math120.1.0": L("2026-10-20"),                              // a quiz waiting (locks the next lecture)
  "math130.0.0": L("2026-10-10"),                              // a catch-up quiz (watched before the gate)
  "math110.1.1": L("2026-10-19", P("2026-10-19", 2)),          // 18.06 Pset 1 unlocked
  "ai200.1.0": L("2026-10-07", P("2026-10-08", 8)),            // Micrograd lab due (phase 1)
} };
const STATES = [
  ["1-problems-due", "/workshop", ALL],
  ["2-problems-nothing-due", "/workshop", {}],
  ["3-problems-pset-open", "/workshop", ALL, "#view details[data-due=pset] > summary"],
  ["4-dashboard-due-line", "/", ALL],
];
const only = process.argv[2];
(async () => {
  const b = await chromium.launch();
  for (const theme of ["dark", "light"]) for (const [w, h, mob] of [[1440, 900, false], [390, 844, true]]) for (const [name, route, state, click] of STATES) {
    if (only && !name.includes(only)) continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
    await ctx.route(/^https?:/, r => r.abort());
    await ctx.addInitScript(s => { if (window.top === window) localStorage.setItem("darhikmah_v1", s); },
      JSON.stringify(Object.assign({ settings: { theme, themeNavyOnce: true } }, state)));
    const page = await ctx.newPage();
    const errors = []; page.on("pageerror", e => errors.push(e.message));
    await page.goto(URL + route, { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    if (click) await page.click(click);
    await page.evaluate(() => Promise.all(document.getAnimations().filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
    const file = path.join(OUT, name + "-" + w + "-" + theme + ".png");
    await page.screenshot({ path: file, fullPage: route === "/workshop" });
    console.log(path.relative(ROOT, file) + (errors.length ? "  ERRORS " + errors.join(" | ") : ""));
    await ctx.close();
  }
  await b.close();
})();
