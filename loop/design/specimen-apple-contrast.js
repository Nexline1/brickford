// T-051: WCAG contrast of every text/background pair in the iOS specimen.
//   python3 -m http.server 8766 --bind 127.0.0.1   (from the repo root)
//   node loop/design/specimen-apple-contrast.js > loop/design/specimen-apple-contrast.txt
//
// For each screen x width x theme: every visible element that owns a text
// node. Its computed `color` (alpha times every ancestor's opacity) is
// composited over its real background, found by walking up the ancestors and
// compositing each computed background-color until an opaque one. Colours go
// through a 1px canvas, so rgb(), color-mix() and oklab() all come back as
// sRGB bytes. The bar's 94% material is composited over the canvas colour
// (what is under it is blurred; see the note in the output).
//
// The gate is 4.5:1 for ALL text, large or not. Exit 1 on any pair below it.
// A second, informational pass measures each press-row's text against the
// pressed highlight (systemGray4), which is on screen for about 300ms.
// Disabled rows (answered quiz options) are left out: :active never fires on them.
"use strict";
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BASE = process.env.SPECIMEN_URL || "http://127.0.0.1:8766/loop/design/specimen-apple.html";
const SCREENS = ["dashboard", "lesson", "problems"];
const WIDTHS = [390, 1440];
const THEMES = ["light", "dark"];
const MIN = 4.5;

function measure(pressed) {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = s => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "rgba(0,0,0,0)"; ctx.fillStyle = s; ctx.fillRect(0, 0, 1, 1); const d = ctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + under[i] * (1 - a)).concat(1); };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = c => "#" + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
  const root = rgba(getComputedStyle(document.documentElement).backgroundColor);
  const bgOf = (el, highlight) => {
    const layers = [];
    if (highlight) layers.push(highlight);
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const c = rgba(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let base = layers.length && layers[layers.length - 1][3] >= 1 ? layers.pop() : root;
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
  };
  const opacityOf = el => { let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o; };
  const out = [];
  const els = pressed ? [...document.querySelectorAll(".press-row")].filter(r => !r.matches(":disabled")).flatMap(r => [r, ...r.querySelectorAll("*")].map(e => [e, r])) : [...document.querySelectorAll("body *")].map(e => [e, null]);
  const hl = pressed ? rgba(getComputedStyle(document.documentElement).getPropertyValue("--ios-highlight")) : null;
  for (const [el, row] of els) {
    if (el.closest("svg")) continue;
    const text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("").replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Pressed: the highlight sits on the row itself, so it replaces the row's
    // background and anything between the row and the text is composited on it.
    let bg;
    if (pressed) {
      bg = hl;
      const between = [];
      for (let n = el; n && n !== row; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] > 0) between.push(c); }
      for (let i = between.length - 1; i >= 0; i--) bg = over(between[i], bg);
    } else bg = bgOf(el);
    const fg0 = rgba(getComputedStyle(el).color);
    const fg = over([fg0[0], fg0[1], fg0[2], fg0[3] * opacityOf(el)], bg);
    const cs = getComputedStyle(el);
    out.push({ fg: hex(fg), bg: hex(bg), ratio: Math.round(ratio(fg, bg) * 100) / 100, size: parseFloat(cs.fontSize), weight: +cs.fontWeight, text: text.slice(0, 48) });
  }
  return out;
}

(async () => {
  const browser = await chromium.launch();
  const all = [], pressedAll = [];
  let elements = 0;
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 2400 } });
    for (const screen of SCREENS) for (const theme of THEMES) {
      await page.goto(BASE + "?screen=" + screen + "&theme=" + theme, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      // Wait on proof that the theme applied: the canvas token matches the attribute.
      await page.waitForFunction(t => document.documentElement.getAttribute("data-theme") === t &&
        getComputedStyle(document.body).backgroundColor === (t === "dark" ? "rgb(0, 0, 0)" : "rgb(242, 242, 247)"), theme);
      const rows = await page.evaluate(measure, false);
      const pr = await page.evaluate(measure, true);
      elements += rows.length;
      for (const r of rows) all.push(Object.assign({ where: screen + " " + w + " " + theme }, r));
      for (const r of pr) pressedAll.push(Object.assign({ where: screen + " " + w + " " + theme }, r));
    }
    await page.close();
  }
  await browser.close();

  const group = list => {
    const m = new Map();
    for (const r of list) {
      const k = r.fg + " on " + r.bg;
      const g = m.get(k) || { pair: k, ratio: r.ratio, n: 0, sizes: new Set(), where: new Set(), sample: r.text };
      g.n++; g.sizes.add(r.size + "/" + r.weight); g.where.add(r.where.split(" ").slice(1).join(" "));
      if (r.ratio < g.ratio) { g.ratio = r.ratio; g.sample = r.text; }
      m.set(k, g);
    }
    return [...m.values()].sort((a, b) => a.ratio - b.ratio);
  };
  const pairs = group(all);
  const fails = pairs.filter(p => p.ratio < MIN);
  const line = p => p.ratio.toFixed(2).padStart(6) + ":1  " + p.pair.padEnd(20) + " x" + String(p.n).padEnd(4) + " size/weight " + [...p.sizes].join(", ").padEnd(34) + " " + [...p.where].sort().join(", ") + "  e.g. “" + p.sample + "”";
  console.log("Brickford iOS specimen: text contrast, measured on computed styles (WCAG 2.x relative luminance)");
  console.log("Screens: " + SCREENS.join(", ") + " | widths: " + WIDTHS.join(", ") + " | themes: " + THEMES.join(", "));
  console.log("Text elements measured: " + elements + " | distinct text/background pairs: " + pairs.length + " | threshold " + MIN + ":1 for all text");
  console.log("Lowest: " + pairs[0].ratio.toFixed(2) + ":1 (" + pairs[0].pair + ") | failures: " + fails.length);
  console.log("");
  console.log("Every pair, lowest first (ratio, colours, count, size px/weight, where, lowest example):");
  pairs.forEach(p => console.log(line(p)));
  console.log("");
  console.log("Note: the tab bar is a 94%-opaque material over blurred content; it is measured over the canvas colour.");
  console.log("");
  const pp = group(pressedAll);
  console.log("Informational, not gated: press-row text against the pressed highlight (systemGray4), on screen ~300ms:");
  pp.forEach(p => console.log(line(p)));
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
