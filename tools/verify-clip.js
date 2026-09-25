// verify-clip.js — the clipping sweep, in the repo at last.
//
// CLAUDE.md has listed "the clipping sweep" as a deploy gate for a long time,
// but it lived in a scratch file with a hard-coded route list and a path to
// one machine. This is that sweep, made a gate:
//
//   every route × 320/390/768/1024/1100/1280/1440 px × root font 16 and 24 px,
//   with an empty state and with seeded progress,
//
// and on each render two questions:
//
//   1. does the page scroll sideways? (documentElement wider than the window)
//   2. is anything cut off? — an element whose content is wider than its box,
//      that is not a deliberate scroller (overflow-x auto/scroll) and not a
//      deliberate ellipsis. Inside an overflow:hidden box that content is
//      simply gone; outside one it paints over its neighbour. Both are bugs.
//
// The 24px root exists because the spacing scale is in rem: a sweep that only
// runs at 16px proves nothing about anyone who has raised their text size.
//
// Findings are checked against tools/verify-clip.baseline.json: the clipping
// that already existed when this gate landed (2026-09-25), each entry owned by
// a fix item. Only a NEW finding, or a baseline entry that no longer occurs
// (stale), fails the run. The baseline is hand-edited and may only shrink.
//
// Whole window, not just .main: the sidebar once vanished with every gate that
// measured .main green.
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const URL = "file://" + path.join(path.resolve(__dirname, ".."), "platform/index.html") + "#";

// Known findings, each owned by a fix item (T-001 …). Hand-edited only, and it
// may only SHRINK: adding an entry is loosening this test (loop/lessons.md).
// There is deliberately no flag that rewrites it.
const BASELINE_FILE = path.join(__dirname, "verify-clip.baseline.json");
const BASELINE = new Map();
{
  const list = JSON.parse(fs.readFileSync(BASELINE_FILE, "utf8"));
  if (!Array.isArray(list)) throw new Error(BASELINE_FILE + ": expected an array");
  list.forEach((e, n) => {
    if (!e || typeof e.key !== "string" || typeof e.item !== "string" || e.key.split("|").length !== 5 || /\d+>\d+/.test(e.key))
      throw new Error(BASELINE_FILE + " entry " + n + ": expected { key: state|root|width|route|selector, item: T-00x }");
    if (BASELINE.has(e.key)) throw new Error(BASELINE_FILE + ": duplicate key " + e.key);
    BASELINE.set(e.key, e.item);
  });
}

// The page renders today's date (the calendar, the course's "today" counts),
// so the sweep pins it: Tuesday 6 Oct 2026, noon UTC — verify-flows.js's fixed
// study day. Without this the result depended on the day it was run.
const FIXED_NOW = new Date("2026-10-06T12:00:00Z");
const WIDTHS = [320, 390, 768, 1024, 1100, 1280, 1440];
const ROOTS = [16, 24];
// verify-contrast.js's route list (every view the router has), plus the two
// route families it does not visit: a diagnostic and a library document.
const ROUTES = [
  "/", "/atlas", "/courses", "/course/math110", "/course/cs150", "/course/phys100",
  "/lesson/math110/0/13", "/concept/la-eigen",
  "/workshop", "/electives", "/exams", "/quiz/linear-algebra", "/recall",
  "/method", "/record", "/transcript", "/review", "/calendar", "/library",
  "/treasury", "/sync", "/drill", "/guide", "/practice",
  "/lesson/math110/0/0", "/no-such-page",
  "/course/spch100", "/lesson/spch100/0/0", "/lesson/spch100/1/0", "/course/ai200",
  "/diag/diag-la", "/doc/readme",
];

// Two main states, because each hides things the other shows: an empty browser
// has the empty states ("Nothing unlocked yet", no streak), and progress
// brings the Prove-it card, a streak, a due recall, a solved problem.
// Same seed as verify-contrast.js.
function seed(nowMs) {
  // Init scripts run in every frame; the lesson page's video frame is an
  // opaque-origin error page here, where localStorage throws. Top frame only.
  if (window.top !== window) return;
  // Dates are derived from the pinned clock passed in, never from Date.now().
  const iso = d => new Date(nowMs - d * 86400000).toISOString().slice(0, 10);
  const s = { lessons: {}, problems: {}, studyDays: [], review: {} };
  for (let i = 0; i < 4; i++) s.studyDays.push(iso(i));
  s.lessons["math110.0.13"] = { done: true, verified: true, doneAt: iso(1), notes: "n", checks: [true], solved: 3, recall: "x".repeat(200), verifiedAt: iso(1) };
  s.lessons["math110.0.0"] = { done: true, verified: false, doneAt: iso(2), notes: "", checks: [] };
  s.review["math110.0.13"] = { due: iso(1), box: 1 };
  s.problems["Arrays & Hashing|Contains Duplicate"] = iso(3);
  s.weeks = [{ week: 1, date: iso(2), shipped: "repo", dsa: 4, posts: 1, revenue: 120, notes: "" }];
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}
// The quiz and the drill open on a question drawn at random, and a numeric
// question (#numAns + #numGo) lays out differently from a multiple-choice one.
// Both layouts must be swept, so each draw is pinned: the PRNG is reseeded to a
// fixed value right before the route is opened, and the kind of the first
// question is ASSERTED — if content or the draw ever changes so that the
// pinned seed no longer opens the expected kind, the gate fails rather than
// silently sweeping a different layout.
//
// The seeded state above has only three linear-algebra questions unlocked and
// all three are multiple choice, so no seed can draw a numeric one there. The
// numeric variants therefore run in a third state, "seeded-num": the same seed
// plus the first sixteen MATH 110 unit-0 lectures watched (the set
// verify-flows.js uses). Their keys carry "~num" on the route.
function seedNum(nowMs) {
  if (window.top !== window) return;
  const iso = d => new Date(nowMs - d * 86400000).toISOString().slice(0, 10);
  const s = { lessons: {}, problems: {}, studyDays: [], review: {} };
  for (let i = 0; i < 4; i++) s.studyDays.push(iso(i));
  s.lessons["math110.0.13"] = { done: true, verified: true, doneAt: iso(1), notes: "n", checks: [true], solved: 3, recall: "x".repeat(200), verifiedAt: iso(1) };
  for (let i = 0; i < 16; i++) if (!s.lessons["math110.0." + i]) s.lessons["math110.0." + i] = { done: true, doneAt: iso(2), notes: "", checks: [] };
  s.review["math110.0.13"] = { due: iso(1), box: 1 };
  s.problems["Arrays & Hashing|Contains Duplicate"] = iso(3);
  s.weeks = [{ week: 1, date: iso(2), shipped: "repo", dsa: 4, posts: 1, revenue: 120, notes: "" }];
  localStorage.setItem("darhikmah_v1", JSON.stringify(s));
}
const DRAW_SEED = { "/quiz/linear-algebra": 1, "/drill": 1 };      // opens multiple choice (seeded)
const plain = ROUTES.map(r => ({ route: r, key: r, seed: DRAW_SEED[r] }));
const NUM_ROUTES = [
  { route: "/quiz/linear-algebra", key: "/quiz/linear-algebra~num", seed: 3 },
  { route: "/drill", key: "/drill~num", seed: 6 },
];
// [name, seed function, routes, what the first drawn question must be]
const STATES = [
  ["empty", null, plain, "none"],          // nothing watched: no question to draw
  ["seeded", seed, plain, "mcq"],
  ["seeded-num", seedNum, NUM_ROUTES, "num"],
];

// ---------- the measurement, run inside the page ----------
const PROBE = function () {
  const sel = el => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    if (typeof el.className === "string" && el.className.trim()) s += "." + el.className.trim().split(/\s+/).slice(0, 3).join(".");
    return s;
  };
  const clipped = [];
  let measured = 0;
  document.querySelectorAll("body *").forEach(el => {
    // Inside an <svg>, clientWidth/scrollWidth are not the layout: the viewBox
    // scales the drawing and the SVG viewport does its own clipping. A caption
    // in a figure once read scrollWidth 353 against clientWidth 295 at a 24px
    // root while sitting comfortably inside its box. The <svg> itself is still
    // checked.
    if (el.ownerSVGElement) return;
    if (!el.checkVisibility()) return;
    measured++;
    if (el.scrollWidth <= el.clientWidth + 1) return;
    const cs = getComputedStyle(el);
    if (cs.textOverflow === "ellipsis" || cs.overflowX === "auto" || cs.overflowX === "scroll") return;
    clipped.push(sel(el) + " (" + el.scrollWidth + ">" + el.clientWidth + ", overflow-x " + cs.overflowX + ")");
  });
  return {
    measured,
    clipped: [...new Set(clipped)],
    sideways: document.documentElement.scrollWidth > window.innerWidth + 1
      ? document.documentElement.scrollWidth + ">" + window.innerWidth : "",
    root: getComputedStyle(document.documentElement).fontSize,
  };
};

(async () => {
  const browser = await chromium.launch();
  const failures = [];
  let renders = 0, elements = 0, githubHits = 0;

  for (const [stateName, stateFn, routes, drawKind] of STATES) {
    for (const root of ROOTS) {
      for (const w of WIDTHS) {
        const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce", hasTouch: w < 860, timezoneId: "UTC" });
        // Before any page script runs: the clock is fixed for the context.
        await ctx.clock.setFixedTime(FIXED_NOW);
        // No token in a fresh context, so nothing should call GitHub; count it
        // if anything does, and refuse it either way.
        // Every http(s) request is refused: nothing here needs the network, and
        // the lesson page's YouTube frame otherwise throws its own errors into
        // the page and makes the result depend on what the sandbox can reach.
        await ctx.route(/^https?:/, r => {
          if (/api\.github\.com/.test(r.request().url())) githubHits++;
          return r.abort();
        });
        // The quiz and the drill shuffle their questions, and a numeric question
        // lays out differently from a multiple-choice one. A seeded Math.random
        // makes every run draw the same questions, so a finding reproduces.
        await ctx.addInitScript(() => {
          let a = 0x2f6b1c3d;
          window.__clipReseed = v => { a = v; };
          Math.random = () => {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            let t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
          };
        });
        if (stateFn) await ctx.addInitScript(stateFn, FIXED_NOW.getTime());
        await ctx.addInitScript(rt => {
          document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.fontSize = rt + "px"; });
        }, root);
        const page = await ctx.newPage();
        let errors = [];
        page.on("pageerror", e => errors.push(e.message));
        // One real load per context; every route after it is a same-document
        // hash change, so the root font size set above holds throughout. The
        // boot hash is not in ROUTES, so the first route still fires a
        // hashchange (see verify-contrast.js).
        await page.goto(URL + "/__boot", { waitUntil: "load" });
        await page.waitForSelector("#view > *");

        for (const { route, key, seed: drawSeed } of routes) {
          // Proof the view was rebuilt: renderInner() replaces #view's children
          // wholesale, so a marker on the current first child cannot survive
          // the next render. A fixed wait would measure the PREVIOUS page
          // whenever a render ran long.
          await page.evaluate(() => {
            const c = document.querySelector("#view > *");
            if (c) c.setAttribute("data-clip-stale", "1");
          });
          errors = [];
          if (drawSeed != null) await page.evaluate(v => window.__clipReseed(v), drawSeed);
          await page.goto(URL + route, { waitUntil: "load" });
          await page.waitForFunction(
            () => document.querySelector("#view > *") && !document.querySelector("#view [data-clip-stale]"),
            null, { timeout: 8000, polling: "raf" });
          // Then wait for the entrance animations to land (finite ones only),
          // so the geometry measured is the resting geometry. Two views mount
          // their body a tick after the render (the quiz and the library
          // document); wait for those hosts to be filled too.
          await page.waitForFunction(() => {
            const q = document.querySelector("#quizMount"), d = document.querySelector("#docHost");
            return (!q || q.children.length > 0) && (!d || d.textContent.trim() !== "Loading…");
          }, null, { timeout: 8000 });
          let drawWrong = "";
          if (drawSeed != null) {
            // The drill mounts its body a tick after the render, like the quiz.
            await page.waitForFunction(() => { const m = document.querySelector("#drillMount, #quizMount"); return m && m.children.length > 0; }, null, { timeout: 8000 });
            const kind = await page.evaluate(() => document.querySelector("#numAns") ? "num" : document.querySelector("#view .opt") ? "mcq" : "none");
            if (kind !== drawKind) drawWrong = "pinned draw (seed " + drawSeed + ") opened " + kind + ", expected " + drawKind + " — content or the draw changed; re-pin the seed";
          }
          await page.evaluate(() => Promise.all(document.getAnimations()
            .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity)
            .map(a => a.finished.catch(() => {}))));

          let r = await page.evaluate(PROBE);
          renders++;
          elements += r.measured;
          // A finding has to survive a re-measure (verify-contrast.js's rule).
          if (r.clipped.length || r.sideways) {
            await page.waitForTimeout(250);
            const again = await page.evaluate(PROBE);
            const keep = new Set(again.clipped.map(c => c.split(" (")[0]));
            r.clipped = r.clipped.filter(c => keep.has(c.split(" (")[0]));
            if (!again.sideways) r.sideways = "";
          }
          const rootOk = r.root === root + "px";
          if (drawWrong) errors.push(drawWrong);
          if (r.clipped.length || r.sideways || errors.length || !rootOk) {
            failures.push({ stateName, root, w, route: key, r, errors: errors.slice(), rootOk });
          }
        }
        await ctx.close();
      }
    }
  }
  await browser.close();

  // ---------- classify against the baseline ----------
  // One finding = one key: state|root|width|route|selector (or
  // "sideways-scroll"). No pixel numbers, so a known defect that shifts by a
  // pixel stays the same finding. Page errors and a root font that did not
  // apply are never baselined: they always fail.
  const found = new Map();                    // key -> detail
  const hard = [];
  failures.forEach(f => {
    const pre = f.stateName + "|" + f.root + "|" + f.w + "|" + f.route + "|";
    if (f.r.sideways) found.set(pre + "sideways-scroll", "page scrolls sideways (" + f.r.sideways + ")");
    f.r.clipped.forEach(c => {
      const k = pre + c.split(" (")[0];
      if (!found.has(k)) found.set(k, "clipped " + c);
    });
    f.errors.forEach(e => hard.push(pre + "page error: " + e));
    if (!f.rootOk) hard.push(pre + "root font is " + f.r.root + ", asked for " + f.root + "px");
  });
  if (githubHits) hard.push(githubHits + " request(s) to GitHub from a context with no token");
  const total = STATES.reduce((n, st) => n + st[2].length, 0) * WIDTHS.length * ROOTS.length;
  if (renders !== total) hard.push("only " + renders + " of " + total + " renders ran");

  const known = new Map(), fresh = [];
  found.forEach((detail, k) => {
    if (BASELINE.has(k)) known.set(k, BASELINE.get(k));
    else fresh.push([k, detail]);
  });
  const stale = [...BASELINE.keys()].filter(k => !found.has(k));

  if (fresh.length) {
    console.log("NEW — " + fresh.length + " finding(s) not in tools/verify-clip.baseline.json");
    fresh.forEach(([k, d]) => console.log("  NEW    " + k + "   " + d));
  }
  if (stale.length) {
    // A baseline entry that no longer occurs is either fixed (delete it from
    // the baseline, which is the point) or was never real. Either way the
    // baseline must say what is true today, so it fails until it does.
    console.log("\nSTALE — " + stale.length + " baseline entr" + (stale.length === 1 ? "y" : "ies") + " no longer found; remove them from the baseline");
    stale.forEach(k => console.log("  STALE  " + k + "   (" + BASELINE.get(k) + ")"));
  }
  if (hard.length) {
    console.log("\nFAILURES THAT ARE NEVER BASELINED — " + hard.length);
    hard.forEach(h => console.log("  FAIL   " + h));
  }

  // Known findings: one line per owning item, grouped by element, so the
  // report still says what is outstanding without burying anything new.
  const perItem = {};
  known.forEach(item => { perItem[item] = (perItem[item] || 0) + 1; });
  const items = Object.keys(perItem).sort();
  if (known.size) {
    const groups = new Map();
    known.forEach((item, k) => {
      const [st, rt, w, route, sel] = k.split("|");
      const g = item + "  " + sel;
      if (!groups.has(g)) groups.set(g, { combos: new Set(), routes: new Set() });
      groups.get(g).combos.add(rt + "px@" + w);
      groups.get(g).routes.add(route);
    });
    console.log("\nKNOWN (baselined, owned by a fix item) — item, element, root@width, routes");
    [...groups.entries()].sort().forEach(([g, v]) => {
      const routes = [...v.routes];
      console.log("  " + g.padEnd(44) + [...v.combos].join(" ") + "; " + (routes.length > 4 ? routes.length + " routes" : routes.join(" ")));
    });
  }

  const bad = fresh.length + stale.length + hard.length;
  const tally = fresh.length + " new, " + stale.length + " stale, " + known.size + " known" +
    (items.length ? " (" + items.map(t => t + " " + perItem[t]).join(", ") + ")" : "");
  console.log("\n" + (bad === 0 ? "PASS — " : "FAIL — ") + tally + "; " + renders + " renders: " +
    ROUTES.length + " routes × 2 states + " + NUM_ROUTES.length + " numeric draws, × " + WIDTHS.length +
    " widths × roots " + ROOTS.join("/") + "px (" + elements + " element measurements)" +
    (hard.length ? "; " + hard.length + " unbaselinable failure(s)" : ""));
  process.exit(bad === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
