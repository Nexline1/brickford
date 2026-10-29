// verify-density.js — how much the phone asks a person to read (T-051).
//
// The owner, 2026-10-22, on the phone design: "there's a lot of text in here
// that is not needed... the titles are too long... even the size of the
// layout... you should be able to monitor that." This is the monitor. It
// measures, on every main route at 320 and 390px (Light, the same seeded state
// and pinned clock verify-design uses):
//
//   words   the words visible in the first viewport (the shell included: the
//           nav bar and the tab bar are part of what a thumb's first look sees);
//   title   every list-row title rendered on more than one line;
//   sub     every list-row subtitle rendered on more than one line;
//   long    every text node of more than 12 words outside lesson content
//           (the summary, the quiz, the explanations are exempt: they are the
//           lesson, not the furniture around it).
//
// Lines come from the rendered box: height / line-height for a block, distinct
// line boxes for an inline element. A row is a .glist .grow (title .g-t,
// subtitle .g-s), a Go-deeper tile, a library book, or anything the rebuild
// marks [data-row] with [data-row-title] / [data-row-sub].
//
// tools/verify-density.baseline.json holds what is true today, the same rule
// as verify-clip: `words` is a ceiling per route-width, `findings` the known
// multi-line titles, subtitles and long nodes, each owned by the page step
// that fixes it (the 2026-10-29 re-plan, as reordered that evening: T-051-2
// shell, T-051-3 Dashboard, then the pages). T-051-1 measured it on main with
// its own colours, face, type scale and buttons, so it records where the app
// stands and nothing in it was expected to shrink yet. It may only shrink. The run fails on
//   - a first-viewport word count above its ceiling;
//   - a finding that is not in the baseline (NEW);
//   - a baseline finding that no longer occurs (STALE: fixed, so delete it).
// A count below its ceiling is reported so the ceiling can come down.
//
//   node tools/verify-density.js
//   DENSITY_JSON=out.json node tools/verify-density.js   (also dump every measurement)
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const BASELINE_FILE = path.join(__dirname, "verify-density.baseline.json");
// verify-design's clock: plan day 14 (START 2026-10-16).
const FIXED_NOW = new Date("2026-11-01T12:00:00Z");
const WIDTHS = [{ w: 320, h: 568 }, { w: 390, h: 844 }];
// The main routes: every destination of the sidebar and the tab bar, a course,
// a lecture with its summary, the drill and the sync sheet (the re-plan's
// page steps after T-051-1, /monk and the Sync sheet included).
const ROUTES = ["/", "/lesson/math110/0/13", "/workshop", "/atlas", "/courses", "/course/math110",
  "/exams", "/record", "/practice", "/review", "/calendar", "/treasury", "/library", "/drill",
  "/transcript", "/sync", "/monk"];
// Lesson content, exempt from the 12-word rule (spec rule 3).
const EXEMPT = ".beats, .beat, .sum-lead, .sum-more, .sum-split, .q-card, .q-text, .opt, .expl, .lq-why";
const ROW_PARTS = [
  // [row, title, subtitle]
  [".glist .grow", ".g-t", ".g-s"],
  [".lq-tile", ".lq-tt", ".lq-tm"],
  [".book", ".bk-t", ".bk-m"],
  ["[data-row]", "[data-row-title]", "[data-row-sub]"],
];
const MAX_WORDS = 12;

// verify-design's seed, value for value: a few study days, a proven lecture,
// a due recall, a solved problem; Light picked from the menu (with the
// per-device marker an explicit pick sets). Dates from the pinned clock.
function seed([nowMs]) {
  if (window.top !== window) return;
  const iso = d => new Date(nowMs - d * 86400000).toISOString().slice(0, 10);
  const s = { lessons: {}, problems: {}, studyDays: [], review: {}, settings: { theme: "light", themeNavyOnce: true } };
  for (let i = 0; i < 4; i++) s.studyDays.push(iso(i));
  s.lessons["math110.0.13"] = { done: true, verified: true, doneAt: iso(1), notes: "n", checks: [true], solved: 3, recall: "x".repeat(200), verifiedAt: iso(1) };
  s.lessons["math110.0.0"] = { done: true, verified: false, doneAt: iso(2), notes: "", checks: [] };
  s.review["math110.0.13"] = { due: iso(1), box: 1 };
  s.problems["Arrays & Hashing|Contains Duplicate"] = iso(3);
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}

function measure([EXEMPT, ROW_PARTS, MAX_WORDS]) {
  const words = t => (t.match(/\S+/g) || []).filter(x => /[\p{L}\p{N}]/u.test(x)).length;
  const clean = t => t.replace(/\s+/g, " ").trim();
  const vw = innerWidth, vh = innerHeight;
  const visible = el => el && el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.textContent.trim() && n.parentElement && !n.parentElement.closest("script, style, svg, [aria-hidden=true]")
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  let first = 0;
  const long = [];
  for (const n of textNodes) {
    const el = n.parentElement;
    if (!visible(el)) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    const rects = [...r.getClientRects()].filter(q => q.width > 0.5 && q.height > 0.5);
    if (!rects.length) continue;
    // In the first viewport: any of its line boxes on screen. A drawer parked
    // off the left edge, or a node clipped away by an ancestor, is not.
    const onScreen = rects.some(q => q.right > 0 && q.left < vw && q.bottom > 0 && q.top < vh);
    if (onScreen) {
      const mid = rects.find(q => q.right > 0 && q.left < vw && q.bottom > 0 && q.top < vh);
      const hit = document.elementFromPoint(Math.min(vw - 1, Math.max(0, mid.left + mid.width / 2)), Math.min(vh - 1, Math.max(0, mid.top + mid.height / 2)));
      // Covered by something else (a fixed bar over the page) — counted once, as the bar.
      if (!hit || hit === el || el.contains(hit) || hit.contains(el)) first += words(n.textContent);
    }
    const nw = words(n.textContent);
    if (nw > MAX_WORDS && !el.closest(EXEMPT)) long.push({ n: nw, text: clean(n.textContent).slice(0, 70) });
  }

  const lineCount = el => {
    const cs = getComputedStyle(el);
    if (cs.display === "inline") {
      const r = document.createRange(); r.selectNodeContents(el);
      const tops = [...r.getClientRects()].filter(q => q.width > 0.5).map(q => q.top).sort((a, b) => a - b);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      let lines = 0, last = -1e9;
      for (const t of tops) if (t - last > lh / 2) { lines++; last = t; }
      return lines;
    }
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    const box = el.getBoundingClientRect();
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    return Math.max(1, Math.round((box.height - pad) / lh));
  };
  const rows = [];
  for (const [rowSel, tSel, sSel] of ROW_PARTS) {
    for (const row of document.querySelectorAll(rowSel)) {
      if (!visible(row)) continue;
      for (const [kind, sel] of [["title", tSel], ["sub", sSel]]) {
        for (const el of row.querySelectorAll(sel)) {
          if (el.closest(rowSel) !== row || !visible(el) || !clean(el.textContent)) continue;
          rows.push({ kind, lines: lineCount(el), text: clean(el.textContent).slice(0, 70) });
        }
      }
    }
  }
  return { first, long, rows };
}

function loadBaseline() {
  const b = JSON.parse(fs.readFileSync(BASELINE_FILE, "utf8"));
  if (!b || typeof b.words !== "object" || !Array.isArray(b.findings)) throw new Error(BASELINE_FILE + ": expected { words: {}, findings: [] }");
  const findings = new Map();
  b.findings.forEach((e, i) => {
    if (!e || typeof e.key !== "string" || typeof e.item !== "string") throw new Error(BASELINE_FILE + " finding " + i + ": expected { key, item }");
    if (findings.has(e.key)) throw new Error(BASELINE_FILE + ": duplicate key " + e.key);
    findings.set(e.key, e.item);
  });
  return { words: b.words, findings };
}

(async () => {
  const BASE = loadBaseline();
  const browser = await chromium.launch();
  const dump = { words: {}, findings: [] };
  const found = new Map();
  const over = [], under = [], errors = [];
  for (const { w, h } of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(FIXED_NOW);
    await ctx.route(/^https?:/, r => r.abort());
    await ctx.addInitScript(seed, [FIXED_NOW.getTime()]);
    // The drill draws its questions at random, so a count would differ run to
    // run; a finding has to survive a re-measure. A seeded generator makes
    // every draw the same draw.
    await ctx.addInitScript(() => { let x = 20261022; Math.random = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648); });
    const page = await ctx.newPage();
    page.on("pageerror", e => errors.push(w + " " + e.message));
    for (const route of ROUTES) {
      // Proof the view was rebuilt (verify-contrast's marker), then let the
      // finite entrance animations land.
      await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-density-stale", "1"); }).catch(() => {});
      await page.goto(URL + route, { waitUntil: "load" });
      await page.waitForFunction(() => document.querySelector("#view > *") && !document.querySelector("#view [data-density-stale]"), null, { timeout: 8000, polling: "raf" });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => Promise.all(document.getAnimations()
        .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
      await page.evaluate(() => window.scrollTo(0, 0));
      const m = await page.evaluate(measure, [EXEMPT, ROW_PARTS, MAX_WORDS]);
      const wk = w + " " + route;
      dump.words[wk] = m.first;
      const ceil = BASE.words[wk];
      if (ceil === undefined || m.first > ceil) over.push(wk + ": " + m.first + " words in the first viewport (ceiling " + (ceil === undefined ? "none" : ceil) + ")");
      else if (m.first < ceil) under.push(wk + ": " + m.first + " (ceiling " + ceil + ")");
      for (const r of m.rows) if (r.lines > 1) {
        const key = r.kind + "|" + w + "|" + route + "|" + r.text;
        found.set(key, r.kind + " on " + r.lines + " lines");
      }
      for (const l of m.long) {
        const key = "long|" + w + "|" + route + "|" + l.text;
        found.set(key, l.n + " words");
      }
    }
    await ctx.close();
  }
  await browser.close();

  for (const [k, v] of found) dump.findings.push({ key: k, what: v });
  if (process.env.DENSITY_JSON) fs.writeFileSync(process.env.DENSITY_JSON, JSON.stringify(dump, null, 1));

  const fresh = [...found.keys()].filter(k => !BASE.findings.has(k));
  const stale = [...BASE.findings.keys()].filter(k => !found.has(k));
  const known = [...found.keys()].filter(k => BASE.findings.has(k));
  const bad = over.length + fresh.length + stale.length + errors.length;
  const renders = WIDTHS.length * ROUTES.length;

  if (over.length) { console.log("OVER — first-viewport words above the ceiling in " + over.length + " route-width(s)"); over.forEach(s => console.log("  FAIL  " + s)); }
  if (fresh.length) { console.log("NEW — " + fresh.length + " finding(s) not in tools/verify-density.baseline.json"); fresh.forEach(k => console.log("  FAIL  " + k + "   (" + found.get(k) + ")")); }
  if (stale.length) { console.log("STALE — " + stale.length + " baseline finding(s) no longer occur; delete them from the baseline"); stale.forEach(k => console.log("  STALE  " + k + "   (" + BASE.findings.get(k) + ")")); }
  if (errors.length) { console.log("PAGE ERRORS — " + errors.length); errors.forEach(e => console.log("  FAIL  " + e)); }
  if (under.length) { console.log("BELOW THE CEILING (lower it in the baseline) — " + under.length); under.forEach(s => console.log("  note  " + s)); }
  const byItem = {};
  known.forEach(k => { const it = BASE.findings.get(k); byItem[it] = (byItem[it] || 0) + 1; });
  const total = Object.values(dump.words).reduce((a, b) => a + b, 0);
  console.log((bad ? "FAIL" : "PASS") + " — " + renders + " route-renders (" + ROUTES.length + " routes x " + WIDTHS.map(x => x.w).join("/") + "px, Light); " +
    total + " first-viewport words in all; " + known.length + " known findings (" +
    (Object.keys(byItem).sort().map(k => k + " " + byItem[k]).join(", ") || "none") + "), " + fresh.length + " new, " + stale.length + " stale, " + over.length + " over");
  process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
