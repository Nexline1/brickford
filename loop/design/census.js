// Usage: node loop/design/census.js <checkout root> <out dir>   (pinned clock, seeded state, reduced motion)
// Before census: 8 most-used routes, phone 390x844 light+dark, desktop 1280x800 light.
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = process.argv[2], OUT = process.argv[3];
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const NOW = new Date("2026-10-06T12:00:00Z");
const ROUTES = [["home","/"],["lesson","/lesson/math110/0/13"],["courses","/courses"],["course","/course/math110"],
  ["calendar","/calendar"],["quiz","/quiz/linear-algebra"],["workshop","/workshop"],["record","/record"]];
function seed([nowMs, theme]) {
  if (window.top !== window) return;
  const iso = d => new Date(nowMs - d * 86400000).toISOString().slice(0, 10);
  const s = { lessons: {}, problems: {}, studyDays: [], review: {}, settings: { theme } };
  for (let i = 0; i < 4; i++) s.studyDays.push(iso(i));
  s.lessons["math110.0.13"] = { done: true, verified: true, doneAt: iso(1), notes: "n", checks: [true], solved: 3, recall: "x".repeat(200), verifiedAt: iso(1) };
  s.lessons["math110.0.0"] = { done: true, verified: false, doneAt: iso(2), notes: "", checks: [] };
  s.review["math110.0.13"] = { due: iso(1), box: 1 };
  s.problems["Arrays & Hashing|Contains Duplicate"] = iso(3);
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
  Math.random = (() => { let x = 1; return () => ((x = (x * 16807) % 2147483647) / 2147483647); })();
}
(async () => {
  const browser = await chromium.launch();
  const CONF = [["390-light",{width:390,height:844},true,"light"],["390-dark",{width:390,height:844},true,"dark"],["1280-light",{width:1280,height:800},false,"light"]];
  for (const [tag, vp, mobile, theme] of CONF) {
    for (const [name, route] of ROUTES) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce", timezoneId: "UTC" });
      await ctx.addInitScript(seed, [NOW.getTime(), theme]);
      const page = await ctx.newPage();
      await page.clock.setFixedTime(NOW);
      await page.goto(URL + route);
      await page.waitForSelector(".main > *", { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(OUT, `${name}-${tag}.png`) });
      await ctx.close();
    }
    console.log("done", tag);
  }
  await browser.close();
})();
