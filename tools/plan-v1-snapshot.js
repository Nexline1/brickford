// plan-v1-snapshot.js — T-067 step 2. What a tree schedules on every date before the
// Plan v2 cutover, under a Thursday, Friday, Saturday and Sunday clock, for an empty
// state and a worked-ahead one (v1's future days re-anchor to the first unwatched
// lesson, so a worked-ahead state is what exercises that path).
//
//   node tools/plan-v1-snapshot.js <repo root> > tools/verify-logic.v1-snapshot.json
//
// The committed snapshot was taken from origin/main at 183cff5 (before Plan v2), and
// tools/verify-logic.js compares this branch against it date by date: every date
// before 2026-11-22 must schedule exactly what main scheduled. The fixtures are in the
// file, so the gate replays exactly what was measured.
"use strict";
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const CUTOVER = "2026-11-22";
const CLOCKS = ["2026-11-19", "2026-11-20", "2026-11-21", "2026-11-22"];   // Thu, Fri, Sat, Sun
const addDays = (iso, n) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const schedKey = items => items.map(it => it.track + ":" + (it.pseudo ? "~" + it.short : it.cid + "." + it.ui + "." + it.li) +
  (it.dayN != null || it.spanN != null ? "@" + String(it.dayN ?? null) + "/" + String(it.spanN ?? null) : "")).join(" ");

// Worked ahead: watched on 10 Nov, well past what the plan had reached by then, in every
// v1 track — including all of AI 200's first three units, so the Build spine re-anchors
// past the end of the lessons v1 had.
function aheadState(flat) {
  const lessons = {};
  const take = (cid, n) => (flat[cid] || []).slice(0, n).forEach(k => { lessons[k] = { done: true, doneAt: "2026-11-10", notes: "", checks: [] }; });
  take("math110", 34); take("math120", 14); take("math130", 12); take("ai200", 15); take("ai210", 2); take("spch100", 40);
  return { lessons, studyDays: ["2026-11-10"] };
}

async function snapshot(root, fixtures) {
  const URL = "file://" + path.join(root, "platform/index.html") + "#/__test";
  const browser = await chromium.launch();
  const out = { cutover: CUTOVER, clocks: CLOCKS, fixtures: [], sched: {} };
  try {
    const open = async (clock, state) => {
      const ctx = await browser.newContext({ timezoneId: "UTC" });
      await ctx.route("https://api.github.com/**", r => r.abort());
      await ctx.clock.setFixedTime(new Date(clock + "T12:00:00Z"));
      if (state) await ctx.addInitScript(s => { if (window.top === window) localStorage.setItem("darhikmah_v1", s); }, JSON.stringify(state));
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(URL, { waitUntil: "load" });
      await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 15000 });
      return { ctx, page, errors };
    };
    let fx = fixtures;
    if (!fx) {
      const { ctx, page } = await open(CLOCKS[0], null);
      const flat = await page.evaluate(() => { const o = {}; window.DAR.COURSES.forEach(c => { o[c.id] = []; (c.units || []).forEach((u, ui) => u.lessons.forEach((_, li) => o[c.id].push(c.id + "." + ui + "." + li))); }); return o; });
      await ctx.close();
      fx = [{ name: "empty", state: null }, { name: "worked ahead", state: aheadState(flat) }];
    }
    out.fixtures = fx;
    for (const f of fx) for (const clock of CLOCKS) {
      const { ctx, page, errors } = await open(clock, f.state);
      const r = await page.evaluate(({ cut, src }) => {
        const T = window.__brickfordTest, key = eval(src), o = {};
        for (let d = window.DAR.START_DATE; d < cut; ) {
          o[d] = key(T.scheduledFor(d));
          const x = new Date(d + "T00:00:00Z"); x.setUTCDate(x.getUTCDate() + 1); d = x.toISOString().slice(0, 10);
        }
        return o;
      }, { cut: CUTOVER, src: schedKey.toString() });
      if (errors.length) throw new Error("page errors under " + f.name + " @ " + clock + ": " + errors.join(" | "));
      out.sched[f.name + " @ " + clock] = r;
      await ctx.close();
    }
  } finally { await browser.close(); }
  return out;
}

module.exports = { snapshot, schedKey, CLOCKS, CUTOVER, addDays };

if (require.main === module) {
  const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
  snapshot(root).then(o => process.stdout.write(JSON.stringify(o, null, 1) + "\n")).catch(e => { console.error(e); process.exit(1); });
}
