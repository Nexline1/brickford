// verify-design.js — the design foundations, asserted on real elements.
//
// Why this exists: loop/design/brief.md (owner decision, 25 Sep 2026) moved the
// app to an iOS-native look — the system font, the iOS text styles, a radius
// scale, flat controls, a lead pair of light and dark, and an Auto theme that
// follows the phone. Every other gate measures contrast, the frame, overflow,
// data or flows; none of them would notice if a later change put the Caslon
// serif or the 2px corner back. This one would.
//
// What it asserts (spec T-005), at 390px (a phone: isMobile, touch) and 1280px,
// in light and dark, on /, /course/math110, /lesson/math110/0/13, /calendar and
// /workshop:
//   - no element's computed font-family names Caslon;
//   - the page title h1 is the large title: 34px at 390, 40px at 1280, weight
//     700, tracking -0.022em (±0.002);
//   - every visible .btn has 12px corners, and no control carries the old
//     key-cap gloss, lift or well;
//   - the theme tokens resolve to the brief's hex values;
// and once each:
//   - the Auto theme: with S.settings.theme = "auto", an emulated dark scheme
//     resolves --bg to #000000 and a light one to #f2f1ee, it follows a live
//     change without writing storage or repainting the view (a render is a
//     read), and picking it from the menu stores the string "auto";
//   - the selected calendar day runs a `cellPick` animation (getAnimations()),
//     and does not under reduced motion;
//   - the phone .topbar sits under the iPhone status bar: its padding-top and
//     min-height carry env(safe-area-inset-top). Chromium cannot emulate a
//     notch, so that one is read from platform/css/style.css ON DISK — never
//     document.styleSheets, which throws on a file:// page and would make every
//     rule look missing;
// and at 390px in light and dark:
//   - an empty track can still be seen: an empty heatmap day and the "Quiet"
//     legend swatch on /record, and an unanswered question segment on
//     /quiz/linear-algebra, each measure >= 1.05:1 luminance contrast against
//     their actual backdrop (the first ancestor with an opaque background).
//     Round 1 of this item moved --bg to #f2f1ee, one step from the unchanged
//     --bg-2 these tracks were filled with (1.009:1), and flattened the --sink
//     inset that had been drawing their edge — so every empty track on the
//     page vanished while every other check here stayed green. These are
//     fills, not text, so the bar is "visible", not 4.5:1;
//   - a rest day (Saturday) in the /calendar month grid measures >= 1.05:1
//     against its backdrop (the grid) AND against a plain day cell beside it,
//     so the rest days stay visibly rest.
//
// Setup, the way every harness here does it (loop/lessons.md): each context is
// fresh, the clock is pinned (Tuesday 6 Oct 2026, noon UTC) and the timezone is
// UTC, and every http(s) request is refused and logged — nothing here needs the
// network, and the log is how "no request for Libre Caslon" is checked.
//
//   node tools/verify-design.js
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT = path.resolve(__dirname, "..");
const CSS_FILE = path.join(ROOT, "platform/css/style.css");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";

const FIXED_NOW = new Date("2026-10-06T12:00:00Z");
const ROUTES = ["/", "/course/math110", "/lesson/math110/0/13", "/calendar", "/workshop"];
// The routes whose view carries a page-title h1 (a detail page's title). The
// other three head themselves with the folio, an h1 styled as a running head
// (and hidden into the bar on a phone) — that is T-006's collapsing large
// title, not this item's. A title h1 found on any route is checked; on these
// two its absence is a failure, so the check can never pass by measuring
// nothing.
const TITLE_ROUTES = new Set(["/course/math110", "/lesson/math110/0/13"]);
const WIDTHS = [
  { w: 390, h: 844, mobile: true, large: 34 },
  { w: 1280, h: 800, mobile: false, large: 40 },
];
const THEMES = ["light", "dark"];
// loop/design/brief.md §3, the lead pair.
const BRIEF = {
  light: { "--bg": "#f2f1ee", "--surface": "#ffffff", "--surface-2": "#f7f6f3", "--line": "#dcdad5",
           "--ink": "#111111", "--ink-2": "#5c5a55", "--ink-3": "#6e6b65", "--accent": "#1e4f8f",
           "--accent-fill": "#1e4f8f", "--accent-soft": "#e6edf6", "--gold": "#8a5f12" },
  dark:  { "--bg": "#000000", "--surface": "#1c1c1e", "--surface-2": "#2c2c2e", "--line": "#38383a",
           "--ink": "#ffffff", "--ink-2": "#a1a1a6", "--ink-3": "#8e8e93", "--accent": "#78aef0",
           "--accent-fill": "#2f6bbd", "--accent-soft": "#1a2a3f", "--gold": "#e0b35a" },
};
// Each theme's --panel, which is what the Home Screen status bar is painted
// from (meta theme-color).
const PANEL = { light: "#2b2118", dark: "#0a0d10" };
const RADII = { "--r-sm": "8px", "--r-md": "12px", "--r-lg": "16px", "--r-xl": "22px" };

let checks = 0, fails = 0;
function check(name, ok, detail) {
  checks++;
  if (!ok) fails++;
  console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : ""));
  return ok;
}
const rgb = hex => "rgb(" + [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(", ") + ")";

// Same seeded progress as verify-contrast / verify-clip, so states that only
// appear with progress (a proven lecture, a streak, a due recall) are covered.
// Dates come from the pinned clock passed in, never from Date.now(). Top frame
// only: the lesson page's video frame is an opaque origin where localStorage
// throws.
function seed([nowMs, theme]) {
  if (window.top !== window) return;
  const iso = d => new Date(nowMs - d * 86400000).toISOString().slice(0, 10);
  const s = { lessons: {}, problems: {}, studyDays: [], review: {} };
  if (theme) s.settings = { theme };
  for (let i = 0; i < 4; i++) s.studyDays.push(iso(i));
  s.lessons["math110.0.13"] = { done: true, verified: true, doneAt: iso(1), notes: "n", checks: [true], solved: 3, recall: "x".repeat(200), verifiedAt: iso(1) };
  s.lessons["math110.0.0"] = { done: true, verified: false, doneAt: iso(2), notes: "", checks: [] };
  s.review["math110.0.13"] = { due: iso(1), box: 1 };
  s.problems["Arrays & Hashing|Contains Duplicate"] = iso(3);
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}
// Counts every write of the progress state after this point. save() is the
// only thing that writes it, so a count that moves is a save().
function countWrites() {
  if (window.top !== window) return;
  window.__stateWrites = 0;
  const set = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    if (k === "darhikmah_v1") window.__stateWrites++;
    return set.call(this, k, v);
  };
}

const requests = [];
let githubHits = 0;
async function fresh(browser, opts, theme) {
  const ctx = await browser.newContext(Object.assign({ timezoneId: "UTC", reducedMotion: "reduce" }, opts));
  await ctx.clock.setFixedTime(FIXED_NOW);
  await ctx.route(/^https?:/, r => {
    const u = r.request().url();
    requests.push(u);
    if (/api\.github\.com/.test(u)) githubHits++;
    return r.abort();
  });
  if (theme !== undefined) await ctx.addInitScript(seed, [FIXED_NOW.getTime(), theme]);
  await ctx.addInitScript(countWrites);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  return { ctx, page, errors };
}
// Proof the view was rebuilt, not a guess at how long it takes: renderInner()
// replaces #view's children wholesale, so a marker on the current first child
// cannot survive the next render (verify-contrast.js's technique).
async function go(page, route) {
  await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-design-stale", "1"); });
  await page.goto(URL + route, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("#view > *") && !document.querySelector("#view [data-design-stale]"),
    null, { timeout: 8000, polling: "raf" });
  // Then let the finite entrance animations land, so what is measured is the
  // resting state.
  await page.evaluate(() => Promise.all(document.getAnimations()
    .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity)
    .map(a => a.finished.catch(() => {}))));
}

// ---------- measured inside the page ----------
function probe(names) {
  // Custom properties resolved through a real property, so the answer is the
  // value the browser will paint, whatever the source spelling. A NEW element
  // per token: re-assigning one element's style starts a transition (the
  // reduced-motion kill-switch sets a 0.01ms duration on everything, and the
  // default transition-property is `all`), and inside one task the computed
  // value is still the transition's start — so every token after the first
  // read back as the first.
  const resolve = (prop, value) => {
    const el = document.createElement("div");
    el.style[prop] = value;
    document.body.appendChild(el);
    const v = getComputedStyle(el)[prop];
    el.remove();
    return v;
  };
  const tokens = {};
  for (const n of names.colours) tokens[n] = resolve("color", "var(" + n + ")");
  const radii = {};
  for (const n of names.radii) radii[n] = resolve("borderTopLeftRadius", "var(" + n + ")");
  const rounded = resolve("fontFamily", "var(--font-rounded)");

  const caslon = [];
  document.querySelectorAll("*").forEach(n => {
    if (/caslon/i.test(getComputedStyle(n).fontFamily)) caslon.push(n.tagName.toLowerCase() + (n.className && typeof n.className === "string" ? "." + n.className.trim().split(/\s+/)[0] : ""));
  });

  const h1 = [...document.querySelectorAll("#view h1:not(.folio)")].find(n => n.checkVisibility());
  const h = h1 ? getComputedStyle(h1) : null;

  // Visible only: half this app's controls sit inside a closed <details>.
  const btns = [...document.querySelectorAll(".btn")].filter(n => n.checkVisibility());
  const corners = btns.map(b => {
    const s = getComputedStyle(b);
    return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  });
  // A shadow layer is visible when its colour has any alpha and it has any
  // extent. Layers are split on top-level commas (colours carry their own).
  const layers = v => {
    const out = []; let depth = 0, cur = "";
    for (const ch of v) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const visibleLayer = l => {
    if (l === "none") return false;
    const col = /rgba?\(([^)]*)\)/.exec(l);
    const a = col ? col[1].split(",").map(Number) : [0, 0, 0, 1];
    if (a.length === 4 && a[3] === 0) return false;
    const lens = (l.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g) || []).map(parseFloat);
    return lens.some(x => x !== 0);
  };
  const deep = [];
  document.querySelectorAll(".btn, input[type=text], input[type=number], input[type=date], textarea, select").forEach(n => {
    if (!n.checkVisibility()) return;
    const bs = getComputedStyle(n).boxShadow;
    if (layers(bs).some(visibleLayer)) deep.push(n.tagName.toLowerCase() + "." + String(n.className).split(/\s+/)[0] + " " + bs);
  });

  const b = getComputedStyle(document.body);
  return {
    theme: document.documentElement.dataset.theme,
    tokens, radii, rounded, caslon: [...new Set(caslon)],
    h1: h ? { text: h1.textContent.trim().slice(0, 40), size: parseFloat(h.fontSize), weight: h.fontWeight, ls: parseFloat(h.letterSpacing) } : null,
    btns: btns.length, corners, deep,
    body: { size: b.fontSize, family: b.fontFamily },
    meta: (document.querySelector('meta[name="theme-color"]') || {}).content || "",
  };
}
const NAMES = { colours: Object.keys(BRIEF.light), radii: Object.keys(RADII) };

// ---------- an empty track against what is actually behind it ----------
// The first visible element matching the selector, its background-color, and
// the background of its first ancestor whose background is opaque — the
// colour the eye really compares it with. Colours are read back through a 1x1
// canvas, so any CSS colour syntax (rgb(), color(srgb …) from a color-mix, a
// name) comes out as the same sRGB bytes; a translucent fill is composited
// over the backdrop first, the way it is painted.
// Given [sel, peerSel], it also measures the element against the first visible
// peer painted over the same backdrop — for a cell that has to read apart from
// its neighbours as well as from the grid behind them.
const MIN_TRACK = 1.05;
function trackContrast(arg) {
  const [sel, peerSel] = Array.isArray(arg) ? arg : [arg, null];
  const el = [...document.querySelectorAll(sel)].find(n => n.checkVisibility());
  if (!el) return { err: "no visible " + sel };
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const c = cv.getContext("2d", { willReadFrequently: true });
  const bytes = col => {
    c.clearRect(0, 0, 1, 1); c.fillStyle = "#000"; c.fillStyle = col; c.fillRect(0, 0, 1, 1);
    return [...c.getImageData(0, 0, 1, 1).data];
  };
  let a = el.parentElement, backEl = null, back = null;
  for (; a; a = a.parentElement) {
    const col = getComputedStyle(a).backgroundColor;
    if (bytes(col)[3] === 255) { backEl = a; back = col; break; }
  }
  if (!backEl) return { err: "no ancestor of " + sel + " has an opaque background" };
  const fill = getComputedStyle(el).backgroundColor;
  c.clearRect(0, 0, 1, 1);
  c.fillStyle = back; c.fillRect(0, 0, 1, 1);
  c.fillStyle = fill; c.fillRect(0, 0, 1, 1);          // source-over: the painted result
  const painted = [...c.getImageData(0, 0, 1, 1).data];
  const lum = p => {
    const [r, g, b] = p.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const x = lum(painted), y = lum(bytes(back));
  const hex = p => "#" + p.slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("");
  const name = n => n.tagName.toLowerCase() + (n.id ? "#" + n.id : "") + (typeof n.className === "string" && n.className.trim() ? "." + n.className.trim().split(/\s+/)[0] : "");
  const out = { ratio: (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), fill: hex(painted), back: hex(bytes(back)), on: name(backEl) };
  if (peerSel) {
    const peer = [...document.querySelectorAll(peerSel)].find(n => n !== el && n.checkVisibility());
    if (!peer) return Object.assign(out, { err: "no visible peer " + peerSel });
    c.clearRect(0, 0, 1, 1);
    c.fillStyle = back; c.fillRect(0, 0, 1, 1);
    c.fillStyle = getComputedStyle(peer).backgroundColor; c.fillRect(0, 0, 1, 1);
    const pp = [...c.getImageData(0, 0, 1, 1).data], z = lum(pp);
    out.peer = (Math.max(x, z) + 0.05) / (Math.min(x, z) + 0.05);
    out.peerFill = hex(pp);
  }
  return out;
}
const trackText = t => t.err || t.ratio.toFixed(3) + ":1, " + t.fill + " on " + t.back + " (" + t.on + ")" +
  (t.peer !== undefined ? "; " + t.peer.toFixed(3) + ":1 against a plain day " + t.peerFill : "");
const trackOk = t => !t.err && t.ratio >= MIN_TRACK && (t.peer === undefined || t.peer >= MIN_TRACK);

// ---------- the status bar, read from the stylesheet on disk ----------
// A small brace-matching reader: top-level blocks, and the blocks inside each
// @media. Comments go first, so a commented-out declaration cannot count.
function readBlocks(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) break;
    const prelude = css.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (j < css.length && depth) { if (css[j] === "{") depth++; else if (css[j] === "}") depth--; j++; }
    out.push({ prelude, body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}
function decls(body) {
  return body.split(";").map(d => d.trim()).filter(Boolean).map(d => {
    const k = d.indexOf(":");
    return [d.slice(0, k).trim(), d.slice(k + 1).trim()];
  });
}
function firstToken(v) {                  // "calc(3px + env(x)) 14px ..." -> "calc(3px + env(x))"
  let depth = 0;
  for (let i = 0; i < v.length; i++) {
    if (v[i] === "(") depth++;
    else if (v[i] === ")") depth--;
    else if (/\s/.test(v[i]) && depth === 0) return v.slice(0, i);
  }
  return v;
}
// The value a property ends up with in one rule: the last declaration wins,
// and a `padding` shorthand sets padding-top to its first value.
function effective(list, prop) {
  let v = null;
  for (const [k, val] of list) {
    if (k === prop) v = val;
    if (prop === "padding-top" && k === "padding") v = firstToken(val);
  }
  return v;
}
function safeAreaSource() {
  const css = fs.readFileSync(CSS_FILE, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const top = readBlocks(css);
  const phone = top.filter(b => /^@media\s*\(max-width:\s*860px\)$/.test(b.prelude)).flatMap(b => readBlocks(b.body));
  const rule = sel => {
    const hits = phone.filter(b => b.prelude === sel);
    return hits.length ? decls(hits.map(b => b.body).join(";")) : null;
  };
  const baseRule = sel => {
    const hits = top.filter(b => b.prelude === sel);
    return hits.length ? decls(hits.map(b => b.body).join(";")) : null;
  };
  const ENV = /env\(\s*safe-area-inset-top\b/;
  const bar = rule(".topbar"), drawer = rule(".sidebar"), grab = baseRule(".edge-grab");
  const pt = bar && effective(bar, "padding-top"), mh = bar && effective(bar, "min-height");
  check("status bar: the phone .topbar pads its content below the inset (padding-top)",
    !!pt && ENV.test(pt), bar ? "padding-top: " + pt : "no .topbar rule inside @media (max-width: 860px)");
  check("status bar: the phone .topbar grows by the inset (min-height)",
    !!mh && ENV.test(mh), bar ? "min-height: " + mh : "no .topbar rule");
  const dpt = drawer && effective(drawer, "padding-top");
  check("status bar: the drawer's content starts below the inset",
    !!dpt && ENV.test(dpt), drawer ? "padding-top: " + dpt : "no .sidebar rule inside @media (max-width: 860px)");
  const gt = grab && effective(grab, "top");
  check("status bar: the edge-grab strip starts below the inset",
    !!gt && ENV.test(gt), grab ? "top: " + gt : "no .edge-grab rule");
}

(async () => {
  console.log("status bar (read from platform/css/style.css)");
  safeAreaSource();

  const browser = await chromium.launch();

  // ---- the foundations, on real elements ----
  for (const { w, h, mobile, large } of WIDTHS) {
    for (const theme of THEMES) {
      const at = w + "px " + theme;
      console.log("\n" + at);
      const { ctx, page, errors } = await fresh(browser,
        { viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, colorScheme: theme }, theme);
      await page.goto(URL + "/__boot", { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      let tokensChecked = false;
      for (const route of ROUTES) {
        await go(page, route);
        const m = await page.evaluate(probe, NAMES);
        const where = at + " " + route;
        check(where + ": no element is set in Caslon", m.caslon.length === 0,
          m.caslon.length ? m.caslon.slice(0, 4).join(", ") : "");
        if (m.h1 || TITLE_ROUTES.has(route)) {
          const em = m.h1 ? m.h1.ls / m.h1.size : NaN;
          check(where + ": the page h1 is the large title (" + large + "px, 700, -0.022em)",
            !!m.h1 && m.h1.size === large && m.h1.weight === "700" && Math.abs(em - -0.022) <= 0.002,
            m.h1 ? m.h1.size + "px, weight " + m.h1.weight + ", " + em.toFixed(4) + "em, \"" + m.h1.text + "\"" : "no visible title h1 in the view");
        }
        const off = m.corners.filter(c => c.some(r => r !== "12px"));
        check(where + ": every visible .btn has 12px corners", m.btns > 0 && off.length === 0,
          m.btns === 0 ? "no visible .btn on this route" : off.length ? off.length + " of " + m.btns + ", e.g. " + off[0].join(" ") : m.btns + " buttons");
        check(where + ": no control carries a key-cap gloss, lift or well", m.deep.length === 0,
          m.deep.slice(0, 2).join(" | "));
        if (!tokensChecked) {
          tokensChecked = true;
          const want = BRIEF[theme];
          const bad = Object.keys(want).filter(k => m.tokens[k] !== rgb(want[k]));
          check(at + ": the theme tokens resolve to the brief's values", m.theme === theme && bad.length === 0,
            "data-theme " + m.theme + (bad.length ? "; " + bad.map(k => k + " " + m.tokens[k] + " (want " + want[k] + ")").join(", ") : "; " + Object.keys(want).length + " tokens"));
          const rbad = Object.keys(RADII).filter(k => m.radii[k] !== RADII[k]);
          check(at + ": the radius scale is 8/12/16/22", rbad.length === 0, rbad.map(k => k + " " + m.radii[k]).join(", "));
          check(at + ": body is the system face at 17px", m.body.size === "17px" && /^-apple-system\b/.test(m.body.family),
            m.body.size + " " + m.body.family);
          check(at + ": --font-rounded asks for ui-rounded first", /^ui-rounded\b/.test(m.rounded), m.rounded);
        }
      }
      check(at + ": no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- empty tracks: fills that have to be seen against the page ----
  for (const theme of THEMES) {
    const at = "390px " + theme;
    console.log("\nempty tracks, " + at);
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: theme }, theme);
    await page.goto(URL + "/__boot", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    // The seed has a few sealed days and the pinned clock is two weeks past
    // the start, so /record draws its heatmap with empty (l0) days in it.
    await go(page, "/record");
    const day = await page.evaluate(trackContrast, ".heat .hc.l0");
    const swatch = await page.evaluate(trackContrast, ".cal-legend .hc.l0");
    check(at + " /record: an empty heatmap day and the Quiet swatch stand off their backdrop (>= " + MIN_TRACK + ":1)",
      trackOk(day) && trackOk(swatch), "day " + trackText(day) + "; swatch " + trackText(swatch));
    // A fresh quiz is on question 1: that segment is "now" and every later
    // one is unanswered.
    await go(page, "/quiz/linear-algebra");
    const seg = await page.evaluate(trackContrast, ".q-progress i:not(.done):not(.now)");
    check(at + " /quiz/linear-algebra: an unanswered question segment stands off its backdrop (>= " + MIN_TRACK + ":1)",
      trackOk(seg), trackText(seg));
    // A Saturday in the month grid. Its cell sits in .cal-grid, whose --line
    // fill shows through the 1px gaps as the rules, so the backdrop is that
    // grid; and it must also read apart from a plain day cell beside it, or
    // three years of rest days look like days with nothing on them.
    await go(page, "/calendar");
    const rest = await page.evaluate(trackContrast,
      [".cal-grid .cal-cell.rest", ".cal-grid .cal-cell[data-cal-day]:not(.rest):not(.sel):not(.today):not(.blank)"]);
    check(at + " /calendar: a rest day stands off its backdrop and reads apart from a plain day (>= " + MIN_TRACK + ":1)",
      trackOk(rest), trackText(rest));
    check(at + " empty tracks: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- Auto follows the phone ----
  console.log("\nAuto theme");
  for (const scheme of ["dark", "light"]) {
    const other = scheme === "dark" ? "light" : "dark";
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: scheme }, "auto");
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const read = () => page.evaluate(() => {
      const el = document.createElement("div"); document.body.appendChild(el);
      el.style.color = "var(--bg)"; const bg = getComputedStyle(el).color; el.remove();
      const picks = [...document.querySelectorAll("#themeMenu [data-theme-pick]")];
      return {
        theme: document.documentElement.dataset.theme, bg,
        meta: (document.querySelector('meta[name="theme-color"]') || {}).content || "",
        first: picks[0] ? { pick: picks[0].dataset.themePick, label: picks[0].textContent.trim(), on: picks[0].classList.contains("on") } : null,
        stored: (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).theme,
        writes: window.__stateWrites,
      };
    });
    const a = await read();
    check("auto, phone " + scheme + ": resolves to " + scheme + ", --bg " + BRIEF[scheme]["--bg"],
      a.theme === scheme && a.bg === rgb(BRIEF[scheme]["--bg"]), "data-theme " + a.theme + ", --bg " + a.bg);
    check("auto, phone " + scheme + ": the status-bar colour follows (" + PANEL[scheme] + ")", a.meta === PANEL[scheme], "meta theme-color " + a.meta);
    check("auto, phone " + scheme + ": \"Auto\" is listed first and marked as the pick",
      !!a.first && a.first.pick === "auto" && a.first.label === "Auto" && a.first.on,
      a.first ? a.first.pick + " \"" + a.first.label + "\" on=" + a.first.on : "no theme picks");
    // Live: the phone flips while the app is open. The listener may re-apply
    // the theme; it may not save (arming a push) or repaint the view.
    await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-design-kept", "1"); });
    await page.emulateMedia({ colorScheme: other });
    await page.waitForFunction(t => document.documentElement.dataset.theme === t, other, { timeout: 3000 }).catch(() => {});
    const b = await read();
    const kept = await page.evaluate(() => !!document.querySelector("#view [data-design-kept]"));
    check("auto, phone flips to " + other + " while open: follows live, --bg " + BRIEF[other]["--bg"],
      b.theme === other && b.bg === rgb(BRIEF[other]["--bg"]) && b.meta === PANEL[other],
      "data-theme " + b.theme + ", --bg " + b.bg + ", meta " + b.meta);
    check("auto, phone flips to " + other + ": a read — no save, no repaint, still stored as \"auto\"",
      b.writes === a.writes && kept && b.stored === "auto",
      "state writes " + a.writes + " -> " + b.writes + ", view kept " + kept + ", stored " + JSON.stringify(b.stored));
    check("auto, phone " + scheme + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  {
    // Picking it: the stored setting is the string "auto".
    const { ctx, page, errors } = await fresh(browser, { viewport: { width: 1280, height: 800 }, colorScheme: "dark" }, null);
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    await page.click("#themeBtn");
    await page.click("#themeMenu [data-theme-pick='auto']");
    const r = await page.evaluate(() => {
      const el = document.createElement("div"); document.body.appendChild(el);
      el.style.color = "var(--bg)"; const bg = getComputedStyle(el).color; el.remove();
      return { theme: document.documentElement.dataset.theme, bg,
               stored: (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).theme };
    });
    check("auto, picked from the menu on a dark phone: stored as \"auto\", shows dark",
      r.stored === "auto" && r.theme === "dark" && r.bg === rgb(BRIEF.dark["--bg"]),
      "stored " + JSON.stringify(r.stored) + ", data-theme " + r.theme + ", --bg " + r.bg);
    // What a device from before Auto does with the synced string: it writes it
    // straight into data-theme, which no theme block matches, so the light
    // :root values apply. (index.html's html element starts as "light".)
    const old = await page.evaluate(() => {
      document.documentElement.dataset.theme = "auto";
      const el = document.createElement("div"); document.body.appendChild(el);
      el.style.color = "var(--bg)"; const bg = getComputedStyle(el).color; el.remove();
      return bg;
    });
    check("an older device reading \"auto\" falls back to light", old === rgb(BRIEF.light["--bg"]), "--bg " + old);
    check("auto, picked from the menu: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- the picked calendar day ----
  console.log("\ncalendar cellPick");
  for (const motion of ["no-preference", "reduce"]) {
    const { ctx, page, errors } = await fresh(browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: motion }, "light");
    await page.goto(URL + "/calendar", { waitUntil: "load" });
    await page.waitForSelector("#view .cal-grid");
    // Click a day that is not the selected one, then catch the new selected
    // cell on the first frame it exists — the view is re-rendered (inside a
    // view transition when motion is allowed), so it is a new element with a
    // fresh animation. Proof, not a duration.
    const r = await page.evaluate(() => new Promise(done => {
      const cell = [...document.querySelectorAll(".cal-cell[data-cal-day]:not(.sel)")][3];
      if (!cell) return done({ err: "no unselected day in the month grid" });
      const day = cell.dataset.calDay;
      cell.click();
      const t0 = performance.now();
      const poll = () => {
        const el = document.querySelector('.cal-cell.sel[data-cal-day="' + day + '"]');
        if (!el) return performance.now() - t0 > 3000 ? done({ err: "day " + day + " never became selected" }) : requestAnimationFrame(poll);
        const anims = el.getAnimations().filter(a => a.animationName === "cellPick");
        const kf = anims[0] && anims[0].effect.getKeyframes();
        done({ day, n: anims.length, states: anims.map(a => a.playState),
               from: kf && kf.length ? kf[0].transform : null });
      };
      requestAnimationFrame(poll);
    }));
    if (motion === "no-preference") {
      check("the picked day runs cellPick", !r.err && r.n === 1 && r.states[0] === "running",
        r.err || r.n + " cellPick animation(s) " + JSON.stringify(r.states) + " on " + r.day);
      check("cellPick starts from scale(0.92)", !r.err && r.from === "scale(0.92)", r.err || "first keyframe " + r.from);
    } else {
      check("under reduced motion the picked day does not animate", !r.err && !(r.states || []).includes("running"),
        r.err || r.n + " cellPick animation(s) " + JSON.stringify(r.states));
    }
    check("calendar (" + motion + "): no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  await browser.close();

  console.log("");
  const caslonReq = requests.filter(u => /caslon/i.test(u));
  check("no request for Libre Caslon", caslonReq.length === 0, caslonReq[0] || [...new Set(requests.filter(u => /fonts\.googleapis/.test(u)))].join(" ; "));
  check("no network sync (GitHub requests from test contexts)", githubHits === 0, githubHits + " request(s)");

  console.log("\n" + (fails === 0
    ? "PASS — " + checks + " design checks: " + ROUTES.length + " routes x " + WIDTHS.length + " widths x " +
      THEMES.length + " themes, the empty tracks, the Auto theme, cellPick and the status-bar inset"
    : "FAIL — " + fails + " of " + checks + " design checks failed"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => {
  console.error(e);
  console.log("\nFAIL — harness error after " + checks + " design checks (" + fails + " failed): " + e.message.split("\n")[0]);
  process.exit(1);
});
