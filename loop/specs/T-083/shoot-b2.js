// T-083 batch 2 before/after screenshots: Today, a watched and an unwatched lecture, Problems, More, a course
// at 1440 and 390, dark and light. Pinned clock Wednesday 25 Nov 2026 (UTC), a seeded
// state of 31 lectures watched in plan order (so some are owed). Fresh context per shot.
// usage: node loop/specs/T-083/shoot.js <before|after>
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = path.resolve(__dirname, "../../..");
const URL = "file://" + ROOT + "/platform/index.html";
const tag = process.argv[2] || "after";
const OUT = path.join(__dirname, "shots-b2"); require("fs").mkdirSync(OUT, { recursive: true });
const NOW = new Date("2026-11-25T12:00:00Z");
function seed([nowMs, theme]) {
  if (window.top !== window) return;
  if (sessionStorage.getItem("__seeded")) return;
  sessionStorage.setItem("__seeded", "1");
  localStorage.setItem("__theme", theme);
}
(async () => {
  const browser = await chromium.launch();
  const routes = [["today", "/"], ["lecture-watched", "/lesson/math110/0/5"], ["lecture-new", "/lesson/math110/0/12"], ["problems", "/workshop"], ["more", "/more"], ["course", "/course/math110"]];
  for (const [w, mobile] of [[1440, false], [390, true]]) for (const theme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(NOW);
    await ctx.route(/^https?:/, r => r.abort());
    const page = await ctx.newPage();
    await page.goto(URL + "#/__test", { waitUntil: "load" });
    await page.evaluate(([theme]) => {
      const T = window.__brickfordTest, D = window.DAR;
      const s = { lessons: {}, problems: {}, studyDays: [], review: {}, settings: { theme, themeNavyOnce: true } };
      let n = 0;
      for (let i = 0; i < 60 && n < 31; i++) {
        const iso = T.dateForStudy(i);
        T.scheduledFor(iso).filter(x => !x.pseudo).forEach(it => {
          if (n >= 31) return;
          const k = it.cid + "." + it.ui + "." + it.li;
          if (s.lessons[k]) return;
          s.lessons[k] = { done: true, doneAt: iso, notes: "", checks: [] };
          if (n % 5 === 0) { s.lessons[k].verified = true; s.lessons[k].verifiedAt = iso; }
          n++;
          if (!s.studyDays.includes(iso)) s.studyDays.push(iso);
        });
      }
      localStorage.setItem("darhikmah_v1", JSON.stringify(s));
    }, [theme]);
    for (const [name, r] of routes) {
      await page.goto(URL + "#" + r, { waitUntil: "load" });
      await page.reload({ waitUntil: "load" });
      await page.waitForTimeout(400);
      if (name === "restore") {
        // Open Settings, then press Restore backup with a backup file of a fresh device.
        await page.evaluate(() => { const b = document.querySelector("#settingsBtn"); if (b) b.click(); });
        const file = path.join(OUT, "..", "backup-sample.json");
        require("fs").writeFileSync(file, JSON.stringify({ lessons: { "math110.0.0": { done: true, doneAt: "2026-10-16" } }, studyDays: ["2026-10-16"], settings: { lastBackup: "2026-10-20" }, problems: {}, review: {} }));
        await page.setInputFiles("#importFile", file);
        await page.waitForTimeout(500);
      }
      await page.screenshot({ path: path.join(OUT, tag + "-" + name + "-" + w + "-" + theme + ".png"), fullPage: name !== "restore" });
    }
    await ctx.close();
  }
  await browser.close();
})();
