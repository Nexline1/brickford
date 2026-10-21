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
  // T-026a: the Courses shelf on its Later filter, so its covers are held to
  // 44x44 and the frame too.
  "/courses?later",
]);

// Some controls only exist once there is progress — the Prove-it card, the
// unverify button, a due recall. Seeded so they are measured too.
function seedProgress() {
  const iso = d => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
  const s = { lessons: {}, problems: {}, studyDays: [], review: {} };
  for (let i = 0; i < 4; i++) s.studyDays.push(iso(i));
  s.lessons["math110.0.13"] = { done: true, verified: true, doneAt: iso(1), notes: "n",
    checks: [true], solved: 3, recall: "x".repeat(200), verifiedAt: iso(1) };
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log("  FAIL  " + msg); } };

// Every context runs on a pinned clock and timezone: Tuesday 20 Oct 2026, noon
// UTC — the study day verify-flows and verify-clip use. This gate read the real
// date until 2026-10-06, and went red on the day /record's heatmap first had
// anything to draw (14 study days after START_DATE), with no code change at all.
// A gate whose answer depends on the day it runs only passes on the day it was
// written (loop/lessons.md). Pinned AFTER that day on purpose, so the heatmap is
// always on screen and always measured.
// Plan day 14 (moved with reset six, START 2026-10-05; was 2026-10-06 under START 2026-09-21).
const FIXED_NOW = new Date("2026-10-20T12:00:00Z");
async function freshContext(browser, opts) {
  const ctx = await browser.newContext(Object.assign({ timezoneId: "UTC" }, opts));
  await ctx.clock.setFixedTime(FIXED_NOW);
  return ctx;
}

(async () => {
  const browser = await chromium.launch();

  // ---- the navigation is reachable, at every width, on every route ----
  for (const w of DESKTOP) {
    const ctx = await freshContext(browser, { viewport: { width: w, height: 880 }, reducedMotion: "reduce" });
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
    const ctx = await freshContext(browser, { viewport: { width: w, height: 880 }, reducedMotion: "reduce" });
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
    const ctx = await freshContext(browser, { viewport: { width: w, height: 860 }, hasTouch: true });
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
    // Tap the scrim where it is exposed, beside the drawer. Clicking its
    // centre (force: true) landed on the drawer above it — on a nav link,
    // whose navigation closed the drawer — so this never touched the scrim
    // (found by T-051, when the 44px rows put a group label at that point).
    const sb = await page.evaluate(() => document.querySelector(".sidebar").getBoundingClientRect().right);
    await page.mouse.click(Math.round((sb + w) / 2), 422);
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
    const ctx = await freshContext(browser, { viewport: { width: w, height: 860 }, hasTouch: true, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    let cardRoutes = 0;
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
      // 52: a 44px hamburger, 3px of bar either side, and the rule under it.
      // The ceiling is here so the bar cannot quietly grow into a header.
      check(m.h <= 52, at + ": running head is " + m.h + "px");
      check(!!m.name, at + ": running head has no page name");
      check(m.lines <= 1, at + ": running head wraps to " + m.lines + " lines");
      check(m.below, at + ": content starts underneath the running head");
      check(!m.on, at + ": the menu button is sitting on text — " + m.on);
      // T-023: the tab bar floats over the page, and content scrolls under it
      // by design — but at the END of the scroll nothing may be left under it.
      // That is what the page's bottom padding is for; take it away and the
      // last lines of every page sit under the capsule.
      const under = await page.evaluate(() => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
        const tb = document.querySelector("#tabbar");
        if (getComputedStyle(tb).display === "none") return { shown: false };
        // Both fixed controls at the bottom: the capsule and, when it is on
        // screen (not stowed, not off), the Next card floating above it.
        const boxes = [["the tab bar", tb.getBoundingClientRect()]];
        const rb = document.querySelector("#railbar");
        if (rb && rb.checkVisibility({ opacityProperty: true }) && rb.getBoundingClientRect().height > 0)
          boxes.push(["the Next card", rb.getBoundingClientRect()]);
        let on = null;
        document.querySelectorAll("#view *").forEach(el => {
          if (on || !el.checkVisibility()) return;
          if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length)) return;
          const b = el.getBoundingClientRect();
          if (b.width < 1 || b.height < 1) return;
          for (const [what, bar] of boxes)
            if (!on && b.top < bar.bottom && b.bottom > bar.top && b.left < bar.right && b.right > bar.left)
              on = el.tagName.toLowerCase() + " \"" + el.textContent.trim().slice(0, 30) + "\" at " + Math.round(b.top) + "-" + Math.round(b.bottom) +
                   " under " + what + " at " + Math.round(bar.top) + "-" + Math.round(bar.bottom);
        });
        return { shown: true, on, card: boxes.length > 1 };
      });
      if (under.card) cardRoutes++;
      check(under.shown && !under.on, at + ": at the end of the scroll the tab bar or the Next card is sitting on text — " + (under.shown ? under.on : "no tab bar"));
    }
    console.log("  " + String(w).padStart(5) + "px  frame clears the page on " + FRAME_ROUTES.length + " routes (menu button, tab bar, and the Next card on " + cardRoutes + ")");
    await ctx.close();
  }

  // ---- 44x44, which is the size of a fingertip ----
  //
  // Added 2026-09-21. .btn.tiny had carried this rule and a comment about
  // physical constants for rounds; nothing else in the file ever got it, and
  // nothing measured it. At 390px almost every control in the app was under
  // Apple's minimum — sidebar links 39px, the theme menu 32px, the footer rows
  // 34px, ordinary buttons 38px, concept links 27px, and the hamburger 34x34.
  // None of that shows up in a screenshot, in a contrast ratio or in an
  // overflow sweep. It is the difference between a control you hit and a
  // control you aim at.
  {
    const ctx = await freshContext(browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
    await ctx.addInitScript(seedProgress);
    const page = await ctx.newPage();
    let checked = 0;
    for (const r of FRAME_ROUTES) {
      await page.goto(URL + r, { waitUntil: "load" });
      await page.waitForTimeout(220);
      const small = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll("a,button,summary,label,input[type=checkbox],[role=button]").forEach(el => {
          // checkVisibility walks closed <details> and content-visibility, which
          // a bounding box alone does not: half this app's controls live inside
          // a fold and are not on screen to be hit.
          if (!el.checkVisibility()) return;
          const b = el.getBoundingClientRect();
          if (b.width < 1 || b.height < 1) return;
          // A link inside a sentence is text being read, not a target.
          if (el.tagName === "A" && el.closest("p,.beat-d,.g-s,.sub")) return;
          // A <label class="field"> is a caption over a textarea. Clicking it
          // focuses the field, but nobody aims at it, and making every form
          // caption 44px tall would wreck the forms to satisfy a number.
          if (el.tagName === "LABEL" && el.classList.contains("field")) return;
          // The heatmap and the month grid are dense date matrices by design,
          // the way a native calendar's is. The heatmap's container is .heat
          // (app.js heatmap()); this named ".hc-wrap", a class nothing carries,
          // so the exemption never applied and only the real clock hid it.
          if (el.closest(".heat, .cal-grid")) return;
          if (b.height < 44 || b.width < 44)
            out.push(el.tagName.toLowerCase() + "." + String(el.className).replace(/\s+/g, ".").slice(0, 24) +
                     " " + Math.round(b.width) + "x" + Math.round(b.height));
        });
        return [...new Set(out)];
      });
      checked++;
      check(!small.length, "390px " + r + ": " + small.length + " control(s) under 44x44 — " + small.slice(0, 4).join(", "));
    }
    console.log("  " + String(390).padStart(5) + "px  every control reaches 44x44 on " + checked + " routes");
    await ctx.close();
  }

  // ---- T-051: a press on every control, and the press is felt ----
  //
  // The owner's spec: every tappable element answers the finger, and not with
  // one rule for everything — a row highlights, a filled button or a discrete
  // object scales, a card scales and dims, a text button dims (app.js PRESS,
  // the utilities in tailwind.input.css). Two halves, because either alone
  // proves nothing: the class on every control (the same controls the 44px
  // sweep measures — a date-matrix cell is still pressed, so only prose links,
  // form captions and the inputs themselves are left out), and then the
  // press itself, with a real pointer held down, read back as computed style.
  {
    const PRESS = ["press-row", "press-card", "press-btn", "press-text"];
    const ctx = await freshContext(browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
    await ctx.addInitScript(seedProgress);
    const page = await ctx.newPage();
    let controls = 0;
    const kinds = {};
    for (const r of FRAME_ROUTES) {
      await page.goto(URL + r, { waitUntil: "load" });
      await page.waitForTimeout(220);
      const m = await page.evaluate(PRESS => {
        const out = { n: 0, bare: [], twice: [], wrong: [], kinds: {} };
        // The canonical controls and the press each must take.
        const WANT = [[".glist > .g-row", "press-row"], [".sidebar .nav a:not(.active)", "press-row"], [".sidebar .nav a.active", "press-text"], [".tabbar a", "press-text"],
                      [".btn:not(.ghost):not(.bare)", "press-btn"], [".btn.ghost", "press-text"], [".at-tile, .book", "press-card"]];
        document.querySelectorAll("a,button,summary,label,[role=button]").forEach(el => {
          if (!el.checkVisibility()) return;
          const b = el.getBoundingClientRect();
          if (b.width < 1 || b.height < 1) return;
          if (el.tagName === "A" && el.closest("p,.beat-d,.g-s,.sub")) return;   // a link in a sentence is text being read
          if (el.tagName === "LABEL" && !el.classList.contains("check-row")) return;   // a caption over a field
          out.n++;
          const has = PRESS.filter(c => el.classList.contains(c));
          const name = el.tagName.toLowerCase() + "." + String(el.className).replace(/\s+/g, ".").slice(0, 40);
          if (!has.length) out.bare.push(name);
          if (has.length > 1) out.twice.push(name + " " + has.join("+"));
          if (has.length === 1) out.kinds[has[0]] = (out.kinds[has[0]] || 0) + 1;
          for (const [sel, cls] of WANT) if (el.matches(sel) && !el.classList.contains(cls)) out.wrong.push(name + " wants " + cls);
        });
        return out;
      }, PRESS);
      controls += m.n;
      Object.entries(m.kinds).forEach(([k, v]) => { kinds[k] = (kinds[k] || 0) + v; });
      check(!m.bare.length, "390px " + r + ": " + m.bare.length + " control(s) with no press — " + [...new Set(m.bare)].slice(0, 4).join(", "));
      check(!m.twice.length, "390px " + r + ": " + m.twice.length + " control(s) with two presses — " + m.twice.slice(0, 3).join(", "));
      check(!m.wrong.length, "390px " + r + ": " + m.wrong.length + " control(s) with the wrong press — " + [...new Set(m.wrong)].slice(0, 4).join(", "));
    }
    check(PRESS.every(k => kinds[k] > 0), "390px: every press kind is in use (" + JSON.stringify(kinds) + ")");
    console.log("  " + String(390).padStart(5) + "px  " + controls + " controls on " + FRAME_ROUTES.length + " routes, each with one press " + JSON.stringify(kinds));
    await ctx.close();

    // Held down. One control of each kind, pressed with the pointer and read
    // while it is held: what the finger sees, not what a rule says.
    for (const motion of ["no-preference", "reduce"]) {
      const c2 = await freshContext(browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: motion });
      await c2.addInitScript(seedProgress);
      const p2 = await c2.newPage();
      const felt = {};
      for (const [cls, route, sel] of [["press-row", "/", "#view .glist > a.g-row"], ["press-btn", "/", "#view a.btn.press-btn"],
                                       ["press-text", "/", ".tabbar a.press-text:not(.active)"], ["press-card", "/atlas", "#view .press-card"]]) {
        await p2.goto(URL + route, { waitUntil: "load" });
        await p2.waitForTimeout(300);
        const el = p2.locator(sel).first();
        if (!(await el.count())) { felt[cls] = null; continue; }
        await el.scrollIntoViewIfNeeded();
        const box = await el.boundingBox();
        const read = () => el.evaluate(e => { const s = getComputedStyle(e); return { bg: s.backgroundColor, tf: s.transform, op: s.opacity }; });
        const rest = await read();
        await p2.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await p2.mouse.down();
        await p2.waitForTimeout(150);
        const held = await read();
        await p2.mouse.up();
        felt[cls] = { rest, held };
        // A release that navigates is fine; the next goto starts clean.
      }
      // The row highlight is systemGray4 in whichever theme is painted, read
      // from the token through a probe so it is an rgb() like the reading.
      const hl = await p2.evaluate(() => { const d = document.createElement("div"); d.style.background = "var(--ios-highlight)"; document.body.appendChild(d);
        const v = getComputedStyle(d).backgroundColor; d.remove(); return v; });
      const scaled = f => f && /^matrix\(0\.97, 0, 0, 0\.97/.test(f.held.tf);
      const at = "390px press held (" + motion + ")";
      check(!!felt["press-row"] && felt["press-row"].held.bg === hl && felt["press-row"].held.tf === "none",
        at + ": a row highlights to systemGray4 and does not scale — " + JSON.stringify(felt["press-row"]));
      check(motion === "reduce" ? !!felt["press-btn"] && felt["press-btn"].held.tf === "none" && +felt["press-btn"].held.op === 0.7 : scaled(felt["press-btn"]),
        at + ": a filled button " + (motion === "reduce" ? "dims to 0.7 and does not scale" : "scales to 0.97") + " — " + JSON.stringify(felt["press-btn"]));
      check(!!felt["press-text"] && +felt["press-text"].held.op === 0.4 && felt["press-text"].held.tf === "none",
        at + ": a text control dims to 0.4 — " + JSON.stringify(felt["press-text"]));
      check(motion === "reduce" ? !!felt["press-card"] && felt["press-card"].held.tf === "none" && +felt["press-card"].held.op === 0.7
                                : scaled(felt["press-card"]) && +felt["press-card"].held.op === 0.9,
        at + ": a card " + (motion === "reduce" ? "dims to 0.7 and does not scale" : "scales to 0.97 and dims to 0.9") + " — " + JSON.stringify(felt["press-card"]));
      await c2.close();
    }

    // Beside the page, with a mouse: the hover must not hide the press.
    const c3 = await freshContext(browser, { viewport: { width: 1280, height: 880 }, reducedMotion: "reduce" });
    const p3 = await c3.newPage();
    await p3.goto(URL + "/", { waitUntil: "load" });
    await p3.waitForTimeout(300);
    const row = p3.locator(".sidebar .nav a[href='#/atlas']");
    const rb = await row.boundingBox();
    await p3.mouse.move(rb.x + 40, rb.y + rb.height / 2);
    await p3.waitForTimeout(100);
    const hover = await row.evaluate(e => getComputedStyle(e).backgroundColor);
    await p3.mouse.down();
    await p3.waitForTimeout(100);
    const held = await row.evaluate(e => getComputedStyle(e).backgroundColor);
    await p3.mouse.up();
    const hl3 = await p3.evaluate(() => { const d = document.createElement("div"); d.style.background = "var(--ios-highlight)"; document.body.appendChild(d);
      const v = getComputedStyle(d).backgroundColor; d.remove(); return v; });
    check(held === hl3 && hover !== held, "1280px: a sidebar row held under the mouse shows the press (systemGray4 " + hl3 + "), not its hover — hover " + hover + ", held " + held);
    await c3.close();
    console.log("  press held: row, filled button, text, card at 390 (both motion settings); a sidebar row under the mouse at 1280");
  }

  // ---- every tab in the bottom bar, at the owner's text size ----
  //
  // Added 2026-09-25 (T-001). The owner reads with a larger text size. At a
  // 24px root the letterspaced rem labels pushed the bar to 397px, so at 390px
  // "Review" was cut off and at 320px it was off the screen. The 44x44 sweep
  // above only ran at a 16px root, where the bar fits, so it never saw it.
  // The root is set the way verify-clip sets it, before any view renders.
  const TAB_ROOTS = [16, 24], TAB_WIDTHS = [320, 390];
  let tabBlockChecks = 0;
  {
    const failsBefore = fails;
    for (const root of TAB_ROOTS) {
      for (const w of TAB_WIDTHS) {
        const ctx = await freshContext(browser, { viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
        await ctx.addInitScript(rt => {
          document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.fontSize = rt + "px"; });
        }, root);
        const page = await ctx.newPage();
        await page.goto(URL + "/", { waitUntil: "load" });
        await page.waitForSelector("#view > *");
        const m = await page.evaluate(() => ({
          bar: (() => { const t = document.querySelector("#tabbar"), b = t.getBoundingClientRect();
                        return { l: b.left, r: b.right, btm: b.bottom, h: b.height, rad: parseFloat(getComputedStyle(t).borderTopLeftRadius) }; })(),
          root: getComputedStyle(document.documentElement).fontSize,
          vw: document.documentElement.clientWidth,
          vh: window.innerHeight,
          tabs: [...document.querySelectorAll("#tabbar a")].map(a => {
            const b = a.getBoundingClientRect();
            return { name: a.textContent.trim(), shown: a.checkVisibility(),
                     x: b.left, r: b.right, t: b.top, btm: b.bottom, w: b.width, h: b.height };
          }),
        }));
        const at = w + "px root " + root + "px";
        check(m.root === root + "px", at + ": root font is " + m.root);
        check(m.tabs.length === 5, at + ": tab bar has " + m.tabs.length + " tabs, not 5");
        tabBlockChecks += 2;
        // T-023: a capsule 14px (+/-1) in from both edges, 70px tall, and
        // 12px above the bottom (headless Chromium has no safe-area inset, so
        // "above the safe area" is the 12px itself).
        check(Math.abs(m.bar.l - 14) <= 1 && Math.abs(m.vw - m.bar.r - 14) <= 1,
              at + ": the tab bar is not 14px from both edges (" + m.bar.l.toFixed(1) + " and " + (m.vw - m.bar.r).toFixed(1) + ")");
        check(Math.abs(m.vh - m.bar.btm - 12) <= 1 && Math.abs(m.bar.h - 70) <= 0.5 && m.bar.rad >= m.bar.h / 2,
              at + ": the tab bar is not a 70px capsule 12px above the bottom (h " + m.bar.h.toFixed(1) + ", gap " +
              (m.vh - m.bar.btm).toFixed(1) + ", radius " + m.bar.rad + ")");
        tabBlockChecks += 2;
        for (const t of m.tabs) {
          tabBlockChecks += 2;
          const inside = t.x >= 0 && t.r <= m.vw + 0.5 && t.t >= 0 && t.btm <= m.vh + 0.5;
          check(t.shown && inside, at + ": tab " + t.name + " is not fully on screen (" +
                t.x.toFixed(1) + ".." + t.r.toFixed(1) + " of " + m.vw + ")");
          check(t.w >= 44 && t.h >= 44, at + ": tab " + t.name + " is " +
                t.w.toFixed(1) + "x" + t.h.toFixed(1) + ", under 44x44");
        }
        await ctx.close();
      }
    }
    const tabFails = fails - failsBefore;
    console.log(tabFails
      ? "  320/390px  roots 16/24  " + tabFails + " of " + tabBlockChecks + " tab checks failed"
      : "  320/390px  roots 16/24  all " + tabBlockChecks + " tab checks passed");
  }

  // ---- phone landscape: the notch's side insets (T-023 review) ----
  //
  // viewport-fit=cover hands the whole screen to the page, so in landscape the
  // notch and the rounded corners are the page's to keep clear. The capsule and
  // the Next card were 14px from the screen edge, which put the first tab and
  // the card's label under the notch. Chromium cannot draw a notch, but CDP
  // can set the insets env() reads; the probe confirms they took, so this
  // cannot pass on an override the browser ignored.
  const INSETS = { left: 47, right: 47, bottom: 21 }, LAND_ROUTES = ["/review", "/courses", "/"];
  let landChecks = 0;
  {
    const failsBefore = fails;
    const ctx = await freshContext(browser, { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: INSETS });
    let cards = 0;
    for (const r of LAND_ROUTES) {
      await page.goto(URL + r, { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      await page.waitForTimeout(250);
      const m = await page.evaluate(() => {
        const probe = document.createElement("div");
        probe.style.cssText = "position:fixed;left:env(safe-area-inset-left,0px);top:0;width:calc(env(safe-area-inset-right,0px) + 1px);height:calc(env(safe-area-inset-bottom,0px) + 1px)";
        document.body.appendChild(probe);
        const pb = probe.getBoundingClientRect(); probe.remove();
        const box = el => { const b = el.getBoundingClientRect(); return { l: b.left, r: b.right, btm: b.bottom }; };
        const rb = document.querySelector("#railbar");
        const card = rb && rb.checkVisibility({ opacityProperty: true }) && rb.getBoundingClientRect().height > 0;
        return {
          inset: { l: pb.left, r: pb.width - 1, b: pb.height - 1 }, vw: document.documentElement.clientWidth, vh: window.innerHeight,
          bar: box(document.querySelector("#tabbar")),
          tabs: [...document.querySelectorAll("#tabbar a")].map(a => Object.assign({ name: a.textContent.trim().split(/\s+/)[0] }, box(a))),
          card: card ? { box: box(rb), parts: [...rb.querySelectorAll(".rb-main, .btn")].map(box) } : null,
        };
      });
      const at = "844x390 insets 47/47/21 " + r;
      const L = m.inset.l, R = m.vw - m.inset.r;
      check(m.inset.l === INSETS.left && m.inset.r === INSETS.right && m.inset.b === INSETS.bottom,
            at + ": the inset override did not take (env reads " + JSON.stringify(m.inset) + ")");
      check(Math.abs(m.bar.l - (L + 14)) <= 1 && Math.abs(m.bar.r - (R - 14)) <= 1 && m.bar.btm <= m.vh - m.inset.b + 0.5,
            at + ": the capsule is not 14px inside the side insets and above the bottom one (" +
            m.bar.l.toFixed(1) + ".." + m.bar.r.toFixed(1) + " of " + L + ".." + R + ", bottom " + m.bar.btm.toFixed(1) + ")");
      const out = m.tabs.filter(t => t.l < L - 0.5 || t.r > R + 0.5);
      check(!out.length, at + ": tab(s) under the side insets — " + out.map(t => t.name + " " + t.l.toFixed(1) + ".." + t.r.toFixed(1)).join(", "));
      landChecks += 3;                                    // the three check() calls above
      if (m.card) {
        cards++;
        const parts = [m.card.box].concat(m.card.parts).filter(b => b.l < L - 0.5 || b.r > R + 0.5);
        check(!parts.length && Math.abs(m.card.box.l - (L + 14)) <= 1 && Math.abs(m.card.box.r - (R - 14)) <= 1,
              at + ": the Next card or its content is under the side insets (card " + m.card.box.l.toFixed(1) + ".." + m.card.box.r.toFixed(1) +
              ", content " + m.card.parts.map(b => b.l.toFixed(1) + ".." + b.r.toFixed(1)).join(" / ") + ")");
        landChecks++;
      }
    }
    // The Next card has to have been measured somewhere, or its half is blind.
    check(cards > 0, "844x390 landscape: the Next card was on screen on none of " + LAND_ROUTES.join(", "));
    landChecks++;
    await ctx.close();
    const lf = fails - failsBefore;
    console.log(lf ? "  844x390  insets 47/47/21  " + lf + " of " + landChecks + " landscape checks failed"
                   : "  844x390  insets 47/47/21  all " + landChecks + " landscape checks passed (capsule, tabs, Next card on " + cards + " routes)");
  }

  await browser.close();
  const n = DESKTOP.length * ROUTES.length + PHONE.length + 10 +
            PHONE.length * FRAME_ROUTES.length * 8 + FRAME_ROUTES.length + tabBlockChecks + landChecks;
  console.log(fails
    ? "\nFAIL — " + fails + " shell assertion" + (fails === 1 ? "" : "s") + " broken"
    : "\nPASS — shell intact across " + DESKTOP.length + " desktop widths x " + ROUTES.length +
      " routes and " + PHONE.length + " phone widths, frame clear on " +
      FRAME_ROUTES.length + " routes, phone landscape inside the safe-area insets on " + LAND_ROUTES.length + " routes (" + n + " checks)");
  process.exit(fails ? 1 : 0);
})();
