// Brickford — contrast gate.  node tools/verify-contrast.js
//
// This exists because of a specific failure. `.fact` and `.unit` were given
// `background: var(--panel)` — the DARK sidebar colour — while their text used
// `var(--ink)`, which in the light theme is the same hex. Text painted its own
// background colour: five empty boxes on the dashboard and a dark block where
// the daily rituals should have been.
//
// Nothing caught it, because every check measured accent colours and layout
// geometry. None asked the only question that decides whether a page can be
// used at all: can the text be read against what is behind it?
//
// So: every route, every theme, every element carrying text — composite the
// alpha, walk up for the real background, compute the WCAG ratio, and fail.
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PW = "/opt/node22/lib/node_modules/playwright";
const { chromium } = require(PW);

const URL = "file://" + path.join(ROOT, "platform/index.html");
const THEMES = ["light", "parchment", "dark", "forest", "midnight", "latte", "slate"];
const WIDTHS = [390, 1280];
const ROUTES = [
  "/", "/atlas", "/courses", "/course/math110", "/course/cs150", "/course/phys100",
  "/lesson/math110/0/13", "/summary/math110.0.0", "/concept/la-eigen",
  "/workshop", "/electives", "/exams", "/quiz/linear-algebra", "/recall",
  "/method", "/record", "/transcript", "/review", "/calendar", "/library",
  "/treasury", "/sync", "/drill", "/guide", "/practice",
  // /settings was in this list and has never existed — renderInner fell through
  // to the dashboard, so it measured Today twice and called it two routes. The
  // not-found view that replaced that fallthrough is a real page now, so it is
  // measured like one.
  "/lesson/math110/0/0", "/no-such-page",
  "/course/spch100", "/lesson/spch100/0/0", "/lesson/spch100/1/0", "/course/ai200",
];

// Seeded so states that only appear with progress are covered too: a proven
// lecture, a watched one, a streak, a solved problem, a scheduled recall.
function seed() {
  const iso = d => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
  const s = { lessons: {}, problems: {}, studyDays: [], review: {} };
  for (let i = 0; i < 4; i++) s.studyDays.push(iso(i));
  s.lessons["math110.0.13"] = { done: true, verified: true, doneAt: iso(1), notes: "n", checks: [true], solved: 3, recall: "x".repeat(200), verifiedAt: iso(1) };
  s.lessons["math110.0.0"] = { done: true, verified: false, doneAt: iso(2), notes: "", checks: [] };
  s.review["math110.0.13"] = { due: iso(1), box: 1 };
  s.problems["Arrays & Hashing|Contains Duplicate"] = iso(3);
  s.weeks = [{ week: 1, date: iso(2), shipped: "repo", dsa: 4, posts: 1, revenue: 120, notes: "" }];
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}

// ---------- the theme fingerprint ----------
// What the theme settle waits on: a few computed colours from parts of the page
// that do not move with the route, plus one from inside the view. It has to be
// a value that CHANGES when the palette does — see the loop below for why
// "nothing is moving" was not a usable condition.
function installFP() {
  window.__fp = function () {
    const b = getComputedStyle(document.body);
    const side = document.querySelector(".sidebar");
    const inView = document.querySelector("#view *");
    return [
      b.backgroundColor,
      b.color,
      side ? getComputedStyle(side).backgroundColor : "",
      inView ? getComputedStyle(inView).color : "",
    ].join("|");
  };
}
const FP = () => window.__fp();

// ---------- the measurement, run inside the page ----------
// Kept as one string so the browser side stays self-contained and readable.
const PROBE = function () {
  // Chromium serialises color-mix() as oklab(…) or color(srgb …), not rgba().
  // An rgba-only regex silently returns null for those, and a null background
  // means the walk sails past the element that actually paints — which reported
  // the dark tabbar's labels as sitting on the light page. So: fast path for
  // plain rgb/rgba, and a 1×1 canvas to resolve everything else, since the
  // canvas understands every colour syntax the CSS engine does.
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  cx.globalCompositeOperation = "copy";      // fill replaces alpha too
  const parse = c => {
    if (!c || c === "transparent" || c === "none") return { r: 0, g: 0, b: 0, a: 0 };
    const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(c);
    if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
    try {
      cx.fillStyle = "#000";
      cx.fillStyle = c;
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
    } catch (e) { return null; }
  };
  const over = (fg, bg) => ({            // composite fg (with alpha) onto bg
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const la = lum(a), lb = lum(b), hi = Math.max(la, lb), lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
  };
  // The background actually behind an element: walk up until something is not
  // transparent, compositing each translucent layer on the way back down.
  const backdrop = el => {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const bg = parse(getComputedStyle(n).backgroundColor);
      if (!bg || bg.a === 0) continue;
      stack.push(bg);
      if (bg.a === 1) break;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  };
  const sel = el => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    if (el.className && typeof el.className === "string") s += "." + el.className.trim().split(/\s+/).slice(0, 3).join(".");
    return s;
  };

  const out = [];
  document.querySelectorAll("body *").forEach(el => {
    // Only elements that paint their own text, and only if visible.
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length);
    if (!own) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // A disabled control is deliberately dimmed; that is a state, not a defect.
    if (el.closest("[disabled]") || el.matches(":disabled")) return;
    const fgRaw = parse(cs.color);
    if (!fgRaw) return;
    const bg = backdrop(el);
    const fg = over(fgRaw, bg);
    const r = ratio(fg, bg);
    const px = parseFloat(cs.fontSize);
    const bold = +cs.fontWeight >= 700;
    const large = px >= 24 || (px >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (r < need - 0.005) {
      out.push({
        sel: sel(el), r: Math.round(r * 100) / 100, need, px: Math.round(px * 10) / 10,
        fg: cs.color, bg: "rgb(" + [bg.r, bg.g, bg.b].map(Math.round).join(", ") + ")",
        text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 34),
        invisible: r < 1.1,
      });
    }
  });
  return out;
};

// ---------- stylesheet lint ----------
// The bug was reachable because a dark panel fill could be written anywhere.
// The panel is the sidebar and the tabbar. Nothing else may claim it.
function lintPanelUse() {
  const css = fs.readFileSync(path.join(ROOT, "platform/css/style.css"), "utf8");
  const bad = [];
  // Split into rules and check each block that paints a --panel background.
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const sel = m[1].trim().split("\n").pop().trim(), body = m[2];
    if (!/background(-color)?\s*:\s*[^;]*var\(--panel\)/.test(body)) continue;
    if (/\.sidebar|\.tabbar|\.menu-btn/.test(sel)) continue;
    bad.push(sel.slice(0, 70));
  }
  return bad;
}

(async () => {
  const panelMisuse = lintPanelUse();
  const browser = await chromium.launch();
  const failures = [];
  let measured = 0, drift = 0;

  for (const w of WIDTHS) {
    // reducedMotion matters for correctness here, not for politeness.
    //
    // page.goto() with only the hash changing is a same-document navigation, so
    // data-theme survives the loop below and every theme switch is a real CSS
    // transition. `.plan-row .what strong` carries `transition: color 180ms`, so
    // measuring 90ms later read the blend between two themes' --ink and reported
    // a perfectly good near-black as a mid-grey at 4.17:1. (dark #e8ebef →
    // forest #17201a has a midpoint of rgb(127,133,132); it measured
    // rgb(134,140,139).) The stylesheet's reduced-motion kill-switch collapses
    // every transition to 0.01ms, so measurements land on declared values.
    //
    // It also decides the shape of the loop: under reduced motion render() skips
    // startViewTransition, so a hashchange rebuilds the view synchronously.
    //
    // Nothing is lost: the entrance animations use `both` fill, so their final
    // state — the one worth checking — is what gets measured.
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
    await ctx.addInitScript(seed);
    await ctx.addInitScript(installFP);
    const page = await ctx.newPage();
    // One real document load per width. Every navigation after this one is
    // hash-only, so it is same-document: boot() runs exactly once and cannot
    // undo a theme set below. The hash is deliberately NOT a route in the list —
    // the first entry is "/", and page.goto() to a URL whose hash has not
    // changed fires no hashchange, so the render proof would wait for a render
    // that was never going to happen.
    await page.goto(URL + "#/__boot", { waitUntil: "load" });

    // Prime onto a theme that is not the first one measured, so the settle
    // below always has a change to wait for. The list has no duplicates, so
    // its last entry is never its first.
    await page.evaluate(t => { document.documentElement.dataset.theme = t; }, THEMES[THEMES.length - 1]);
    await page.waitForTimeout(400);

    for (const theme of THEMES) {
      // The theme is set ONCE per theme, and never again while routes are being
      // navigated. It used to be set after every navigation — redundant, since
      // the attribute was already right for every route after the first, and
      // the cause of this gate's flakiness.
      //
      // What the flake actually was, measured rather than guessed: when the
      // attribute changed in the same frame as a route render, the whole
      // document's COMPUTED style stayed on the previous theme for hundreds of
      // milliseconds, while `data-theme` itself already read the new one. Every
      // reproduction landed on the loop's first route, the only iteration where
      // the theme really changed, and every stale reading was exactly one theme
      // behind — asking for forest and measuring dark, asking for midnight and
      // measuring forest. That is why the failures looked like a light theme's
      // ink on a dark theme's page.
      //
      // It is also why a stability check ALONE made this worse (12 failures):
      // during the lag the stale values are perfectly stable, so "nothing is
      // moving" is true and says nothing. The condition has to be that the page
      // has CHANGED, and then stopped.
      const before = await page.evaluate(FP);
      await page.evaluate(t => {
        window.__fpLast = null;
        document.documentElement.dataset.theme = t;
      }, theme);
      await page.waitForFunction(prev => {
        const now = window.__fp();
        const settled = now !== prev && window.__fpLast === now;
        window.__fpLast = now;
        return settled;
      }, before, { timeout: 8000, polling: "raf" });

      for (const route of ROUTES) {
        // Proof that the view was rebuilt, instead of a guess at how long it
        // takes. renderInner() replaces #view's children wholesale, so a marker
        // put on the current first child cannot survive the next render — and
        // once it is gone, this route's DOM is the one on screen. A fixed wait
        // would have measured the PREVIOUS page on any render slower than the
        // timeout: a silent coverage hole rather than a failure.
        await page.evaluate(() => {
          const c = document.querySelector("#view > *");
          if (c) c.setAttribute("data-probe-stale", "1");
        });
        await page.goto(URL + "#" + route, { waitUntil: "load" });
        await page.waitForFunction(
          () => !document.querySelector("#view [data-probe-stale]"),
          null, { timeout: 8000, polling: "raf" });

        let hits = await page.evaluate(PROBE);
        // A finding has to survive a second look. What this gate exists to find
        // is a DECLARED colour pair that cannot be read — a property of the
        // stylesheet, identical on every measurement. A reading that does not
        // reproduce is, by definition, not that. It costs nothing in the
        // ordinary case, because it only runs when something has failed.
        if (hits.length) {
          await page.waitForTimeout(250);
          const again = await page.evaluate(PROBE);
          const keep = new Set(again.map(h => h.sel + "|" + h.fg + "|" + h.bg));
          hits = hits.filter(h => keep.has(h.sel + "|" + h.fg + "|" + h.bg));
        }
        // Nothing else writes this attribute, so it can only differ if that
        // stops being true. Better a loud failure than thirty pages quietly
        // measured in the wrong palette.
        const attr = await page.evaluate(() => document.documentElement.dataset.theme);
        if (attr !== theme) {
          console.log("THEME DRIFT — asked for " + theme + ", page is " + attr + " (" + route + ")");
          drift++;
        }
        measured++;
        hits.forEach(h => failures.push(Object.assign({ theme, route, w }, h)));
      }
    }
    await ctx.close();
  }
  await browser.close();

  // One report line per distinct (selector, theme) — the same token failing on
  // twenty pages is one fix, not twenty findings.
  const seen = new Set(), rows = [];
  failures.forEach(f => {
    const k = f.sel + "|" + f.theme + "|" + f.invisible;
    if (seen.has(k)) return;
    seen.add(k);
    rows.push(f);
  });
  rows.sort((a, b) => (b.invisible - a.invisible) || (a.r - b.r));

  const invisible = rows.filter(r => r.invisible);
  if (invisible.length) {
    console.log("\nTEXT THE SAME COLOUR AS ITS BACKGROUND — " + invisible.length + " case(s)");
    invisible.forEach(r => console.log("  " + r.theme.padEnd(9) + r.sel.slice(0, 46).padEnd(48) +
      "ratio " + r.r + "  fg " + r.fg + "  bg " + r.bg + "   " + r.route));
  }
  const low = rows.filter(r => !r.invisible);
  if (low.length) {
    console.log("\nBELOW THRESHOLD — " + low.length + " case(s)");
    // The route and width are what make a finding findable. Without them the
    // report says "some strong somewhere is at 3.57" and the hunt is manual.
    low.slice(0, 60).forEach(r => console.log("  " + r.theme.padEnd(9) + r.sel.slice(0, 34).padEnd(36) +
      r.r + " < " + r.need + "  " + r.px + "px  " + (r.route + "@" + r.w).padEnd(26) +
      "fg " + r.fg + " on " + r.bg + "  \"" + r.text + "\""));
    if (low.length > 60) console.log("  … " + (low.length - 60) + " more");
  }
  if (panelMisuse.length) {
    console.log("\nPANEL FILL OUTSIDE THE SIDEBAR — " + panelMisuse.length + " rule(s)");
    panelMisuse.forEach(s => console.log("  " + s));
    console.log("  (--panel is the dark sidebar block. On a light page its own --ink text is invisible.)");
  }

  const fail = rows.length + panelMisuse.length + drift;
  console.log("\n" + (fail === 0
    ? "PASS — " + measured + " page-renders across " + ROUTES.length + " routes × " + THEMES.length +
      " themes × " + WIDTHS.length + " widths, every text/background pair at or above threshold"
    : fail + " contrast problem(s) across " + measured + " page-renders"));
  process.exit(fail === 0 ? 0 : 1);
})();
