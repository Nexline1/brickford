// verify-shell.js — the frame around the page, which nothing else checks.
//
// Why this exists: on 2026-09-17 the desktop sidebar was missing entirely and
// three green gates said the app was fine. verify-content reads data,
// verify-contrast renders text on backgrounds, and the clipping sweep measures
// overflow inside .main — none of them ever asked whether you could see the
// navigation. The gesture drawer had been writing an inline translateX onto
// .sidebar at EVERY width; above the breakpoint that shoved a static flex child
// off-screen while its 250px of layout space stayed reserved, and the only
// thing that cleared it was a resize handler nobody triggers on a desktop load.
//
// So: assert the shell, at the widths a person actually has a window at.
const path = require("path");
// Same resolution the other two gates use — this repo has no node_modules.
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const URL = "file://" + path.join(path.resolve(__dirname, ".."), "platform/index.html") + "#";

const ROUTES = ["/", "/atlas", "/courses", "/exams", "/record", "/calendar",
                "/library", "/guide", "/practice", "/transcript", "/workshop", "/treasury"];
const DESKTOP = [1536, 1440, 1370, 1280, 1100, 1040, 900, 861];
const PHONE = [320, 390, 430, 768, 860];

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log("  FAIL  " + msg); } };

(async () => {
  const browser = await chromium.launch();

  // ---- the navigation is reachable, at every width, on every route ----
  for (const w of DESKTOP) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 880 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const columns = new Set();
    for (const r of ROUTES) {
      await page.goto(URL + r, { waitUntil: "load" });
      await page.waitForTimeout(200);
      const m = await page.evaluate(() => {
        const side = document.querySelector(".sidebar");
        const box = side.getBoundingClientRect();
        const view = document.querySelector(".main > *");
        const vb = view ? view.getBoundingClientRect() : { x: 0, right: 0 };
        return {
          x: Math.round(box.x), w: Math.round(box.width),
          visible: side.checkVisibility(),
          inline: side.getAttribute("style") || "",
          links: side.querySelectorAll(".nav a").length,
          menu: getComputedStyle(document.querySelector(".menu-btn")).display,
          col: Math.round(vb.x) + "-" + Math.round(vb.right),
        };
      });
      check(m.visible && m.x === 0 && m.w > 180, w + "px " + r + ": sidebar off-screen (x=" + m.x + ")");
      check(m.inline === "", w + "px " + r + ": sidebar carries an inline style (" + m.inline + ")");
      check(m.links >= 10, w + "px " + r + ": only " + m.links + " nav links");
      check(m.menu === "none", w + "px " + r + ": hamburger showing beside the sidebar");
      columns.add(m.col);
    }
    // The reading column must not change width or position between routes —
    // it did, because the dashboard stows the rail and .main is flex:1.
    check(columns.size === 1, w + "px: reading column varies by route (" + [...columns].join(" | ") + ")");
    console.log("  " + String(w).padStart(5) + "px  sidebar shown, column " + [...columns][0]);
    await ctx.close();
  }

  // ---- navigating the way a person does: by clicking the sidebar ----
  // Going straight to a URL does not exercise this. The second half of the same
  // defect was that tapping a nav link calls shut(), which on desktop sprang the
  // sidebar off-screen — so a gate that only ever called page.goto() sailed past
  // it. Click the links.
  for (const w of [1370, 1040]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 880 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForTimeout(250);
    for (const to of ["/atlas", "/courses", "/exams", "/calendar", "/"]) {
      await page.click(".sidebar .nav a[href='#" + to + "']");
      await page.waitForTimeout(450);
      const m = await page.evaluate(() => {
        const side = document.querySelector(".sidebar");
        return { x: Math.round(side.getBoundingClientRect().x), inline: side.getAttribute("style") || "" };
      });
      check(m.x === 0, w + "px: clicking through to " + to + " moved the sidebar to x=" + m.x);
      check(m.inline === "", w + "px: clicking through to " + to + " left an inline style (" + m.inline + ")");
    }
    console.log("  " + String(w).padStart(5) + "px  sidebar survives being navigated by");
    await ctx.close();
  }

  // ---- below the breakpoint it is a drawer, and the drawer works ----
  for (const w of PHONE) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 860 }, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForTimeout(350);
    const read = () => page.evaluate(() => {
      const s = document.querySelector(".sidebar");
      return { x: Math.round(s.getBoundingClientRect().x), open: s.classList.contains("open"),
               menu: getComputedStyle(document.querySelector(".menu-btn")).display };
    });
    // A spring has no duration, so waiting a fixed number of milliseconds for it
    // is a race: this gate first failed at 768px with the drawer 1px short of
    // open, which was my timer and not the app. "Two equal samples" is no
    // better — a spring crawls near its target and rounds to the same integer
    // for several frames before it snaps. Wait for the end state itself, with a
    // deadline, so a drawer that never arrives still fails.
    const arrive = async want => {
      for (let i = 0; i < 60; i++) {
        const now = await read();
        if (want(now)) return now;
        await page.waitForTimeout(50);
      }
      return read();
    };
    const shut0 = await read();
    check(shut0.x <= -180, w + "px: drawer not tucked away at rest (x=" + shut0.x + ")");
    check(shut0.menu !== "none", w + "px: no way to open the drawer — hamburger is display:none");
    await page.click("#menuBtn");
    const open = await arrive(s => s.x === 0 && s.open);
    check(open.x === 0 && open.open, w + "px: drawer did not open (x=" + open.x + ")");
    await page.click("#scrim", { force: true });
    const shut1 = await arrive(s => s.x <= -180 && !s.open);
    check(shut1.x <= -180, w + "px: drawer did not close (x=" + shut1.x + ")");
    console.log("  " + String(w).padStart(5) + "px  drawer opens and closes");
    await ctx.close();
  }

  await browser.close();
  const n = DESKTOP.length * ROUTES.length + PHONE.length + 10;
  console.log(fails
    ? "\nFAIL — " + fails + " shell assertion" + (fails === 1 ? "" : "s") + " broken"
    : "\nPASS — shell intact across " + DESKTOP.length + " desktop widths x " + ROUTES.length +
      " routes and " + PHONE.length + " phone widths (" + n + " checks)");
  process.exit(fails ? 1 : 0);
})();
