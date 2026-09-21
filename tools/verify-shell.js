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
// Wider than ROUTES: the frame check needs the DETAIL pages too, because the
// breadcrumb is what the old frame broke and only a detail page has one.
const FRAME_ROUTES = ROUTES.concat([
  "/course/math110", "/lesson/math110/0/0", "/concept/la-eigen",
  "/quiz/linear-algebra", "/sync", "/method", "/recall", "/electives",
  "/drill", "/review", "/no-such-page",
]);

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

  // ---- the phone's frame does not sit on the page ----
  //
  // Added 2026-09-21, after the owner opened a lecture on his phone and found
  // the breadcrumb broken in half. The menu button was position:fixed with
  // nothing behind it, and the page was asked to indent its first line past it;
  // anything that wrapped ran back underneath, and the rule doing the indenting
  // used display:flex, which turned "MATH 110 · Unit I — ..." into two columns:
  //
  //     [x]  MATH · UNIT I - ESSENCE OF LINEAR
  //          110   ALGEBRA (3BLUE1BROWN)
  //
  // Nothing caught it. Every gate above measures inside .main or asks whether
  // the navigation EXISTS; none asked whether the furniture was standing on the
  // content. This does, by the only test that settles it: take the box of every
  // fixed control and see whether any text is underneath it.
  for (const w of PHONE) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 860 }, hasTouch: true, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    for (const r of FRAME_ROUTES) {
      await page.goto(URL + r, { waitUntil: "load" });
      await page.waitForTimeout(220);
      const m = await page.evaluate(() => {
        const bar = document.querySelector("#topbar");
        const title = document.querySelector("#tbTitle");
        const btn = document.querySelector(".menu-btn").getBoundingClientRect();
        let on = null;
        document.querySelectorAll("#view *").forEach(el => {
          if (on) return;
          // Only elements that paint their own text: a wrapper's box reaching
          // under the button is fine, a word sitting under it is not.
          if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length)) return;
          const b = el.getBoundingClientRect();
          if (b.width < 1 || b.height < 1) return;
          if (b.top < btn.bottom && b.bottom > btn.top && b.left < btn.right && b.right > btn.left)
            on = el.tagName.toLowerCase() + " \"" + el.textContent.trim().slice(0, 30) + "\"";
        });
        const first = document.querySelector("#view *:not(.tb-taken)");
        return {
          shown: getComputedStyle(bar).display !== "none",
          stuck: getComputedStyle(bar).position,
          h: Math.round(bar.getBoundingClientRect().height),
          name: title.textContent.trim(),
          lines: title.getClientRects().length,
          below: first ? first.getBoundingClientRect().top >= bar.getBoundingClientRect().bottom - 1 : true,
          on,
        };
      });
      const at = w + "px " + r;
      check(m.shown, at + ": no running head on a phone");
      check(m.stuck === "sticky", at + ": running head is " + m.stuck + ", not sticky");
      check(m.h <= 54, at + ": running head is " + m.h + "px");
      check(!!m.name, at + ": running head has no page name");
      check(m.lines <= 1, at + ": running head wraps to " + m.lines + " lines");
      check(m.below, at + ": content starts underneath the running head");
      check(!m.on, at + ": the menu button is sitting on text — " + m.on);
    }
    console.log("  " + String(w).padStart(5) + "px  frame clears the page on " + FRAME_ROUTES.length + " routes");
    await ctx.close();
  }

  await browser.close();
  const n = DESKTOP.length * ROUTES.length + PHONE.length + 10 +
            PHONE.length * FRAME_ROUTES.length * 7;
  console.log(fails
    ? "\nFAIL — " + fails + " shell assertion" + (fails === 1 ? "" : "s") + " broken"
    : "\nPASS — shell intact across " + DESKTOP.length + " desktop widths x " + ROUTES.length +
      " routes and " + PHONE.length + " phone widths, frame clear on " +
      FRAME_ROUTES.length + " routes (" + n + " checks)");
  process.exit(fails ? 1 : 0);
})();
