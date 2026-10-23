// verify-logic.js — the date and streak arithmetic, asserted.
//
// Why this exists: everything the learner sees about "today" — which lectures
// are due, whether the streak held, how much is owed, whether a Saturday is
// painted red — comes out of eight small functions in platform/js/app.js, and
// until T-000 nothing tested any of them. CLAUDE.md lists the invariants they
// must keep; this gate checks each one and names it when it breaks.
//
// app.js is one IIFE, so nothing is exported. The page publishes a frozen,
// read-only `window.__brickfordTest` only when the hash contains "__test"
// (spec T-000 names and approves that one hook). Every scenario runs in a
// FRESH browser context with a fixed clock and its own seeded state, so no
// real progress is read and no token exists to sync with.
//
// Expected values are computed here, in Node, from the calendar itself — a
// Saturday is `getUTCDay() === 6`, not whatever REST_DOW says — so a planted
// REST_DOW or an off-by-one in dateForStudy cannot agree with itself.
"use strict";
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const URL = "file://" + path.join(path.resolve(__dirname, ".."), "platform/index.html") + "#";

// The facts CLAUDE.md states. If the owner resets the plan, CLAUDE.md changes
// and so does this block — on purpose, in the same commit. Reset six (2026-10-06)
// moved the start to 2026-10-05, and every dated fixture below moved forward two
// weeks with it, weekdays unchanged, so each still sits inside the plan.
// Reset seven (T-056, 2026-10-23) moved it to Friday 2026-10-16. A Monday start
// becoming a Friday one cannot keep both a fixture's plan day and its weekday,
// so every study-day fixture moved 10 study days (dateForStudy(studyIndex) under
// the old start, replicated, not counted by hand) and keeps its plan day; each
// Saturday fixture was re-picked as the Saturday its scenario needs.
const START = "2026-10-16";
const DAY_1094 = "2030-04-14";           // dateForStudy(1093)
const BASELINE = "2030-04-15";           // addStudyDays(START, 1094)
const WALK_TO = "2030-04-27";            // past the finish, so the whole plan is walked

// ---------- calendar arithmetic, independent of the app ----------
const addDays = (iso, n) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const isSat = iso => new Date(iso + "T00:00:00Z").getUTCDay() === 6;
function range(from, to) {                // inclusive
  const out = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

let fails = 0, checks = 0;
function check(name, ok, detail) {
  checks++;
  if (!ok) fails++;
  console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : ""));
}

// Every GitHub request any scenario makes is counted and refused. There is no
// token in a fresh context, so the count must stay at zero.
let githubHits = 0;

async function scenario(browser, now, state, tz) {
  const ctx = await browser.newContext({ timezoneId: tz || "UTC", reducedMotion: "reduce" });
  await ctx.route("https://api.github.com/**", r => { githubHits++; return r.abort(); });
  // Noon, so no timezone edge can move the date the app computes as "today".
  // `now` is a date (noon UTC that day) or, for T-038's local-date checks, a full instant.
  await ctx.clock.setFixedTime(new Date(/T/.test(now) ? now : now + "T12:00:00Z"));
  if (state) await ctx.addInitScript(s => { if (window.top === window) localStorage.setItem("darhikmah_v1", s); }, JSON.stringify(state));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(URL + "/__test", { waitUntil: "load" });
  await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 10000 });
  return { ctx, page, errors };
}

(async () => {
  const browser = await chromium.launch();
  const days = range("2025-12-31", WALK_TO);
  const planDays = days.filter(d => d >= START);
  const saturdays = planDays.filter(isSat);

  // ---- pure date functions: one scenario, empty state, plan day 14 (Sun 1 Nov) ----
  {
    const { ctx, page, errors } = await scenario(browser, "2026-11-01", null);
    const r = await page.evaluate(({ days, saturdays }) => {
      const T = window.__brickfordTest;
      const idx = {};
      days.forEach(d => { idx[d] = T.studyIndex(d); });
      const back = {};
      days.forEach(d => { if (idx[d] >= 0) back[d] = T.dateForStudy(idx[d]); });
      const satSched = {}, satStatus = {};
      saturdays.forEach(d => { satSched[d] = T.scheduledFor(d).length; satStatus[d] = T.dayStatus(d); });
      return {
        start: window.DAR.START_DATE,
        d0: T.dateForStudy(0),
        d1093: T.dateForStudy(1093),
        base: T.addStudyDays(window.DAR.START_DATE, 1094),
        idx, back, satSched, satStatus,
        day1Sched: T.scheduledFor(window.DAR.START_DATE).length,
        missedTue: T.dayStatus("2026-10-25"),     // a past study day (plan day 8), nothing done
      };
    }, { days, saturdays });

    check("day 1 = START_DATE", r.start === START && r.idx[START] === 0 && r.d0 === START,
      "DAR.START_DATE " + r.start + ", studyIndex(START) " + r.idx[START] + ", dateForStudy(0) " + r.d0);
    check("day 1094 = dateForStudy(1093) = " + DAY_1094, r.d1093 === DAY_1094, "got " + r.d1093);
    check("gate baseline addStudyDays(START, 1094) = " + BASELINE, r.base === BASELINE, "got " + r.base);

    const satBad = saturdays.filter(d => r.idx[d] !== -1);
    check("studyIndex is -1 on a Saturday", satBad.length === 0,
      satBad.length ? satBad.length + " Saturday(s) indexed, first " + satBad[0] + " -> " + r.idx[satBad[0]]
                    : saturdays.length + " Saturdays from " + START + " to " + WALK_TO);
    const pre = days.filter(d => d < START);
    const preBad = pre.filter(d => r.idx[d] !== -1);
    check("studyIndex is -1 before the start", preBad.length === 0,
      preBad.length ? "first " + preBad[0] + " -> " + r.idx[preBad[0]] : pre.length + " days before " + START);

    // Independent count: every non-Saturday from the start is the next index.
    let expect = 0, seqBad = null;
    planDays.forEach(d => {
      if (isSat(d)) return;
      if (!seqBad && r.idx[d] !== expect) seqBad = d + " -> " + r.idx[d] + ", expected " + expect;
      expect++;
    });
    check("studyIndex counts every non-Saturday once, in order", !seqBad,
      seqBad || expect + " study days, the last index " + (expect - 1));

    const rtBad = Object.keys(r.back).filter(d => r.back[d] !== d);
    check("dateForStudy(studyIndex(d)) = d for study days", rtBad.length === 0,
      rtBad.length ? rtBad.length + " mismatch(es), first " + rtBad[0] + " -> " + r.back[rtBad[0]]
                   : Object.keys(r.back).length + " study days round-tripped");

    const schBad = saturdays.filter(d => r.satSched[d] !== 0);
    check("scheduledFor(Saturday) = []", schBad.length === 0 && r.day1Sched > 0,
      schBad.length ? schBad.length + " Saturday(s) schedule work, first " + schBad[0] + " (" + r.satSched[schBad[0]] + " items)"
                    : "every Saturday empty; day 1 schedules " + r.day1Sched + " (not vacuous)");

    const stBad = saturdays.filter(d => r.satStatus[d] !== "rest");
    check('dayStatus(Saturday) = "rest"', stBad.length === 0 && r.missedTue === "missed",
      stBad.length ? stBad.length + " Saturday(s) not rest, first " + stBad[0] + " -> " + r.satStatus[stBad[0]]
                   : "every Saturday rest; an untouched past study day is \"" + r.missedTue + "\" (not vacuous)");
    check("no page errors (date scenario)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- the streak ----
  // Today is Sunday 1 Nov (plan day 14). Sealed: Fri 16 – Mon 19 Oct, plan days
  // 1-3 (an old run of 3), then Fri 23 – Fri 30 Oct and Sun 1 Nov, plan days
  // 7-14. Saturdays 24 and 31 Oct are not sealed and must be stepped over: the
  // current run is 8, not 1.
  const sealed = ["2026-10-16", "2026-10-18", "2026-10-19",
    "2026-10-23", "2026-10-25", "2026-10-26", "2026-10-27", "2026-10-28",
    "2026-10-29", "2026-10-30", "2026-11-01"];
  {
    const { ctx, page, errors } = await scenario(browser, "2026-11-01", { studyDays: sealed });
    const r = await page.evaluate(() => ({ s: window.__brickfordTest.streak(), b: window.__brickfordTest.bestStreak() }));
    check("streak steps over an unsealed Saturday", r.s === 8,
      "run Fri 23 Oct – Sun 1 Nov across unsealed Sats 24 and 31 Oct: expected 8, got " + r.s);
    // Known app bug: bestStreak counts a sealed Saturday (app.js:572-587). Owned
    // by a follow-up item; its fix must add the assertion bestStreak() === 8 for
    // the sealed-Saturday fixture below. Until then no check here claims that
    // bestStreak never counts a rest day — these fixtures leave Saturday unsealed.
    check("bestStreak steps over unsealed rest-day gaps", r.b === 8, "expected 8, got " + r.b);
    check("no page errors (streak scenario)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // The same run with Saturday 31 Oct SEALED as well: a rest day is never
  // counted, even when there is a seal on it, so the run is still 8, not 9.
  // bestStreak is deliberately not asserted on this fixture (known app bug above).
  {
    const withSat = sealed.concat(["2026-10-31"]).sort();
    const { ctx, page, errors } = await scenario(browser, "2026-11-01", { studyDays: withSat });
    const s = await page.evaluate(() => window.__brickfordTest.streak());
    check("streak does not count a sealed Saturday", s === 8,
      "run Fri 23 Oct – Sun 1 Nov with Sat 31 Oct sealed: expected 8, got " + s);
    check("no page errors (sealed-Saturday scenario)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await scenario(browser, "2026-11-01",
      { studyDays: sealed, settings: { streakFrom: "2026-10-30" } });
    const r = await page.evaluate(() => ({ s: window.__brickfordTest.streak(), b: window.__brickfordTest.bestStreak() }));
    check("streak stops at streakFrom", r.s === 2, "streakFrom 30 Oct: expected 2, got " + r.s);
    // Known app bug: bestStreak counts a sealed Saturday (app.js:572-587). Owned
    // by a follow-up item; its fix must add the assertion bestStreak() === 8 for
    // the sealed-Saturday fixture above.
    check("bestStreak ignores streakFrom", r.b === 8, "streakFrom 30 Oct: expected 8, got " + r.b);
    check("no page errors (streakFrom scenario)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- the backlog ----
  // What these two checks do NOT test: backlogCount's own rest-day skip
  // (app.js, `if (isRestDay(iso)) continue;`) is redundant with scheduledFor's
  // -1 index — scheduledFor already returns [] on a Saturday — so removing the
  // skip changes no result and nothing here can catch it. The skip is not
  // independently tested; the check names below claim only the outcome.
  //
  // (1) The only day between the first activity and today is a Saturday, so
  //     nothing can be owed.
  {
    const { ctx, page, errors } = await scenario(browser, "2026-11-01", { studyDays: ["2026-10-31"] });
    const n = await page.evaluate(() => window.__brickfordTest.backlogCount());
    check("a rest day owes no lessons (backlogCount)", n === 0, "expected 0, got " + n);
    check("no page errors (backlog scenario 1)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // (2) Fri 23 to Fri 30 Oct, nothing watched: the backlog is exactly the
  //     lectures scheduled on the seven non-Saturdays (Saturday is left out by
  //     the calendar here, not by the app; see the note above on the skip).
  {
    const from = "2026-10-23", today = "2026-11-01";
    const owedDays = range(from, addDays(today, -1)).filter(d => !isSat(d));
    const { ctx, page, errors } = await scenario(browser, today, { studyDays: [from] });
    const r = await page.evaluate(owedDays => {
      const T = window.__brickfordTest;
      const keys = new Set();
      owedDays.forEach(d => T.scheduledFor(d).filter(it => !it.pseudo)
        .forEach(it => keys.add(it.cid + "." + it.ui + "." + it.li)));
      return { n: T.backlogCount(), expect: keys.size };
    }, owedDays);
    check("backlogCount = the unwatched lectures scheduled since the first activity", r.n === r.expect && r.expect > 0,
      owedDays.length + " study days " + from + " .. " + addDays(today, -1) + ": expected " + r.expect + ", got " + r.n);
    check("no page errors (backlog scenario 2)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- storytelling is isolated (T-037) ----
  // SPCH 100 runs only in the Publish block, so lengthening it may lengthen
  // only that track. Two loads, empty state, the same fixed clock: one as
  // shipped, one with data/storytelling.js served empty. Every Theory and Build
  // item — lessons and pseudo blocks, with their day-N-of-M spans — must land
  // on the same date in both, across the whole plan. The second load is a fresh
  // page, so nothing app.js caches can hide a dependency on the storytelling
  // data. (The before/after date map in loop/specs/T-037-* is the one-off proof
  // for that change; this is the standing version of its central claim.)
  {
    const walkPlan = async withoutSpch => {
      const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
      await ctx.route("https://api.github.com/**", r => { githubHits++; return r.abort(); });
      if (withoutSpch) await ctx.route(/\/data\/storytelling\.js/, r => r.fulfill({ status: 200,
        contentType: "application/javascript", body: "/* storytelling removed for the isolation check */" }));
      await ctx.clock.setFixedTime(new Date("2026-11-01T12:00:00Z"));
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(URL + "/__test", { waitUntil: "load" });
      await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 10000 });
      const r = await page.evaluate(planDays => {
        const T = window.__brickfordTest;
        const other = {};
        let spch = 0, spchOff = 0, pubOther = 0;
        planDays.forEach(iso => {
          const row = [];
          T.scheduledFor(iso).forEach(it => {
            const isSpch = !it.pseudo && /^spch/.test(it.cid);
            if (isSpch) { spch++; if (it.track !== "Publish") spchOff++; }
            if (it.track === "Publish") { if (!isSpch) pubOther++; return; }
            row.push(it.track + ":" + (it.pseudo ? it.short : it.cid + "." + it.ui + "." + it.li) +
              (it.spanN > 1 ? "#" + it.dayN + "/" + it.spanN : ""));
          });
          if (row.length) other[iso] = row.join(" | ");
        });
        return { other, spch, spchOff, pubOther };
      }, planDays);
      await ctx.close();
      return { r, errors };
    };
    const a = await walkPlan(false), b = await walkPlan(true);
    check("storytelling runs only in the Publish block", a.r.spch > 0 && a.r.spchOff === 0 && a.r.pubOther === 0,
      a.r.spch + " SPCH item-days, " + a.r.spchOff + " outside Publish, " + a.r.pubOther + " non-SPCH item(s) in Publish");
    const keys = [...new Set(Object.keys(a.r.other).concat(Object.keys(b.r.other)))].sort();
    const moved = keys.filter(d => a.r.other[d] !== b.r.other[d]);
    check("removing storytelling moves no other lesson or block", moved.length === 0 && b.r.spch === 0 && keys.length > 0,
      moved.length ? moved.length + " day(s) differ, first " + moved[0] + ": " + (a.r.other[moved[0]] || "nothing") +
                     "  vs without SPCH: " + (b.r.other[moved[0]] || "nothing")
                   : keys.length + " days of Theory and Build identical with and without the course");
    check("no page errors (isolation scenario)", a.errors.length === 0 && b.errors.length === 0,
      a.errors.concat(b.errors).join(" | "));
  }

  // ---- the gates (T-038) ----
  // loop/specs/T-038-gates-honest/spec.md. The owner's device had Gates 1-3
  // passed by accident, and an unmark could never stick. Each check below
  // drives the app's own functions through the test hook (gatePlan, setGate —
  // the one function the Transcript's confirm sheet calls — and mergeState),
  // and every expected date is walked here, Saturday by Saturday, from the
  // gate lengths in curriculum.js (data), never read back from gatePlan.
  {
    const addStudy = (iso, n) => {          // n study days on from iso (from the next study day on a Saturday)
      let cur = iso < START ? START : iso;
      while (isSat(cur)) cur = addDays(cur, 1);
      for (let k = 0; k < n; ) { cur = addDays(cur, 1); if (!isSat(cur)) k++; }
      return cur;
    };
    let MONTHS = null;
    const expectPlan = done => {            // done: { n: "YYYY-MM-DD" } of the passed gates
      let base = START;
      return MONTHS.map((m, i) => {
        const target = addStudy(base, Math.round(m * 30.4));
        const d = done[i + 1] || null;
        base = d || target;
        return { n: i + 1, target, done: d };
      });
    };
    const readPlan = page => page.evaluate(() => window.__brickfordTest.gatePlan().map(g => ({ n: g.n, target: g.target, done: g.doneDate })));
    const stored = page => page.evaluate(() => { const s = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
      return { gates: s.gates || {}, events: (s.ledger || []).filter(e => e.type === "gate").map(e => ({ ref: e.ref, data: e.data })) }; });
    const show = plan => plan.map(g => g.n + ":" + (g.done ? "passed " + g.done : "open") + "->" + g.target).join(" ");
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    // An event as logEvent() writes one. Its hash is not the point here: the
    // date of a legacy `true` comes from its ts, whether or not the chain verifies.
    const gateEvent = (i, ts, n, passed) => ({ i, ts, type: "gate", ref: "gate" + n, data: { passed }, prev: "x", hash: "y" + i });

    // (1) A legacy `true` is passed on a date that does not move: START_DATE
    //     with no gate event, and the LOCAL date of its last passing gate event
    //     when there is one. Two different days (Sun 1 Nov and Sun 15 Nov) must
    //     give the same plan. Read as "today", every later target slides daily.
    const DAY_A = "2026-11-01", DAY_B = "2026-11-15";
    {
      const plans = [];
      for (const day of [DAY_A, DAY_B]) {
        const { ctx, page, errors } = await scenario(browser, day, { gates: { 1: true } });
        if (!MONTHS) MONTHS = await page.evaluate(() => window.DAR.GATES.map(g => g.months));
        plans.push({ plan: await readPlan(page), errors });
        await ctx.close();
      }
      const want = expectPlan({ 1: START });
      check("a legacy true gives the same targets on two different days (no gate event: passed on START_DATE)",
        same(plans[0].plan, plans[1].plan) && same(plans[0].plan, want),
        DAY_A + ": " + show(plans[0].plan) + " | " + DAY_B + ": " + show(plans[1].plan) + " | want " + show(want));
      check("no page errors (legacy true scenarios)", plans.every(p => p.errors.length === 0), plans.map(p => p.errors.join(" | ")).join(" "));
    }
    {
      // In Bahrain (UTC+3) 22:30Z on 19 Oct is 01:30 on the 20th. The last
      // PASSING event wins: passed on the 18th, passed again late on the 19th
      // (UTC), then an unmark on the 21st that the old merge undid (which is
      // how a `true` outlives its unmark) — so 20 Oct, local. The first event
      // would say the 18th, the last of any kind the 21st, a UTC reading the 19th.
      const ledger = [gateEvent(0, "2026-10-18T10:00:00.000Z", 1, true), gateEvent(1, "2026-10-19T22:30:00.000Z", 1, true),
                      gateEvent(2, "2026-10-21T09:00:00.000Z", 1, false)];
      const plans = [];
      for (const day of [DAY_A, DAY_B]) {
        const { ctx, page, errors } = await scenario(browser, day, { gates: { 1: true }, ledger }, "Asia/Bahrain");
        plans.push({ plan: await readPlan(page), errors });
        await ctx.close();
      }
      const want = expectPlan({ 1: "2026-10-20" });
      check("a legacy true takes the local date of its last PASSING gate event (Asia/Bahrain: 19 Oct 22:30Z is 20 Oct; a later unmark event is not it), the same on two days",
        same(plans[0].plan, plans[1].plan) && same(plans[0].plan, want),
        DAY_A + ": " + show(plans[0].plan) + " | " + DAY_B + ": " + show(plans[1].plan) + " | want " + show(want));
      check("no page errors (legacy true with a gate event)", plans.every(p => p.errors.length === 0), plans.map(p => p.errors.join(" | ")).join(" "));
    }

    // (2) Old date strings read exactly as before — passed on that date, the
    //     next target counted from it (a Saturday pass counts from the next
    //     study day, a Sunday) — in UTC and eight hours west of it. A `false` is open.
    //     Loading and drawing /atlas, /transcript and / rewrites none of it (a
    //     render is a read); the next ordinary save — a DSA problem ticked —
    //     stores every gate in the new shape, on the same dates.
    {
      const old = { 1: "2026-11-20", 2: "2027-03-13", 3: false };
      const want = expectPlan({ 1: "2026-11-20", 2: "2027-03-13" });
      const runs = [];
      for (const tz of ["UTC", "America/Los_Angeles"]) {
        const { ctx, page, errors } = await scenario(browser, DAY_A, { gates: old }, tz);
        const plan = await readPlan(page);
        const drawn = [];
        for (const r of ["/atlas", "/transcript", "/"]) {
          await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-logic-stale", "1"); });
          await page.evaluate(r => { location.hash = "#" + r; }, r);
          await page.waitForFunction(() => document.querySelector("#view > *") && !document.querySelector("#view [data-logic-stale]"), null, { timeout: 8000 });
          drawn.push(same((await stored(page)).gates, old));
        }
        await page.evaluate(() => { location.hash = "#/course/cs150"; });
        await page.waitForSelector("#view input[data-prob]", { state: "attached", timeout: 8000 });
        await page.evaluate(() => { const cb = document.querySelector("#view input[data-prob]"); cb.checked = true; cb.dispatchEvent(new Event("change")); });
        const after = (await stored(page)).gates;
        const replan = await readPlan(page);
        runs.push({ tz, plan, drawn, after, replan, errors });
        await ctx.close();
      }
      check("old date strings read the same as before (passed on that date; a Saturday pass counts from the next study day), in UTC and America/Los_Angeles",
        runs.every(r => same(r.plan, want)), runs.map(r => r.tz + ": " + show(r.plan)).join(" | ") + " | want " + show(want));
      check("render is a read: loading and drawing /atlas, /transcript and / leaves the old shapes as stored",
        runs.every(r => r.drawn.length === 3 && r.drawn.every(Boolean)), runs.map(r => r.tz + " " + r.drawn.join(",")).join("; "));
      // Local midnight: 00:00Z in UTC, 08:00Z in Los Angeles (both dates are
      // in standard time there: PST ends 1 Nov 2026 and starts again 14 Mar 2027).
      const midnightZ = { "UTC": "T00:00:00.000Z", "America/Los_Angeles": "T08:00:00.000Z" };
      const shapeOk = r => { const a = r.after || {}, z = midnightZ[r.tz];
        return !!a[1] && a[1].passed === true && a[1].date === "2026-11-20" && a[1].at === "2026-11-20" + z &&
          !!a[2] && a[2].passed === true && a[2].date === "2027-03-13" && a[2].at === "2027-03-13" + z &&
          !!a[3] && a[3].passed === false && same(r.replan, want); };
      check("the next ordinary save stores { date, at, passed } (at = the date's LOCAL midnight, UTC and Los Angeles), and the plan does not move",
        runs.every(shapeOk), runs.map(r => r.tz + " " + JSON.stringify(r.after) + " | " + show(r.replan || [])).join(" || "));
      check("no page errors (old date strings)", runs.every(r => r.errors.length === 0), runs.map(r => r.errors.join(" | ")).join(" "));
    }

    // (3) Only the next gate can be passed, only the last passed one unmarked.
    //     A refused call stores nothing and logs nothing. Run in Bahrain at
    //     22:30Z on 1 Nov, which is 01:30 on the 2nd there: a pass is dated
    //     by the local calendar, as everything else here is.
    const DAY_LOCAL = "2026-11-02";
    {
      const { ctx, page, errors } = await scenario(browser, DAY_A + "T22:30:00Z", null, "Asia/Bahrain");
      const r = await page.evaluate(() => {
        const T = window.__brickfordTest;
        const st = () => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
        const evs = () => (st().ledger || []).filter(e => e.type === "gate").length;
        const out = {};
        out.early = [T.setGate(3, true), T.setGate(2, true), T.setGate(5, true)];
        out.earlyGates = JSON.stringify(st().gates || {}); out.earlyEvents = evs();
        out.earlyOpen = T.gatePlan().every(g => !g.doneDate);
        out.first = T.setGate(1, true);
        out.firstRec = (st().gates || {})[1] || null;
        out.skip = T.setGate(3, true);
        out.second = T.setGate(2, true);
        out.unFirst = T.setGate(1, false);
        out.unSecond = T.setGate(2, false);
        out.rec2 = (st().gates || {})[2] || null;
        out.plan = T.gatePlan().map(g => g.doneDate);
        out.events = (st().ledger || []).filter(e => e.type === "gate").map(e => e.ref + ":" + e.data.passed).join(",");
        return out;
      });
      check("an out-of-order pass is impossible: Gate 3, 2 or 5 before Gate 1 is refused, stores nothing and logs nothing",
        r.early.every(x => x === false) && r.earlyGates === "{}" && r.earlyEvents === 0 && r.earlyOpen,
        "returned " + r.early.join(",") + ", stored " + r.earlyGates + ", " + r.earlyEvents + " gate event(s)");
      check("the next gate can be passed: stored as { date: today (local: 2 Nov in Bahrain), at, passed: true }, and Gate 3 is still refused after it",
        r.first === true && !!r.firstRec && r.firstRec.date === DAY_LOCAL && r.firstRec.passed === true && /^\d{4}-\d\d-\d\dT/.test(r.firstRec.at || "") &&
          r.skip === false && r.second === true,
        "pass 1 " + r.first + " " + JSON.stringify(r.firstRec) + "; pass 3 " + r.skip + "; pass 2 " + r.second);
      check("only the last passed gate can be unmarked (Gate 1 refused while Gate 2 is passed; Gate 2 then stored { passed: false })",
        r.unFirst === false && r.unSecond === true && !!r.rec2 && r.rec2.passed === false && same(r.plan, [DAY_LOCAL, null, null, null, null]) &&
          r.events === "gate1:true,gate2:true,gate2:false",
        "unmark 1 " + r.unFirst + ", unmark 2 " + r.unSecond + ", plan " + JSON.stringify(r.plan) + ", events " + r.events);
      check("no page errors (gate order)", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // (4) Last writer wins on `at`, per gate. A pass at t1 on one device, an
    //     unmark at t2 on another: whichever of them pulls, the gate is open.
    //     Then the mixed devices — a legacy date string or `false` on one side
    //     — and the other direction (a later pass beats an earlier unmark), so
    //     "the unmark always wins" cannot pass for last-writer-wins.
    {
      const T1 = "2026-10-30T08:00:00.000Z", T2 = "2026-10-30T20:00:00.000Z";
      const P1 = { date: "2026-10-30", at: T1, passed: true }, U2 = { date: null, at: T2, passed: false };
      const U1 = { date: null, at: T1, passed: false }, P2 = { date: "2026-10-30", at: T2, passed: true };
      const cases = [
        ["the device that passed (t1) pulls the unmark (t2): open", { 1: P1 }, { 1: U2 }, null],
        ["the device that unmarked (t2) pulls the pass (t1): still open", { 1: U2 }, { 1: P1 }, null],
        ["an unmark (t2) pulls a legacy date string for that day (00:00): still open", { 1: U2 }, { 1: "2026-10-30" }, null],
        ["a legacy date string here pulls a newer unmark: open", { 1: "2026-10-23" }, { 1: U2 }, null],
        ["an unmark (t1) pulls a later pass (t2): passed", { 1: U1 }, { 1: P2 }, "2026-10-30"],
        ["a legacy false (no time) pulls a timed pass: passed", { 1: false }, { 1: P1 }, "2026-10-30"],
        // The remote's own ledger carries the event, so it has to be merged
        // before the gates are: otherwise this reads START_DATE (16 Oct).
        ["nothing here pulls a legacy true whose gate event is in the remote's ledger: passed that day", {}, { 1: true }, "2026-10-19",
          { phone: [gateEvent(0, "2026-10-19T09:00:00.000Z", 1, true)] }],
      ];
      const got = [];
      for (const [name, local, remote, want, ledgers] of cases) {
        const { ctx, page, errors } = await scenario(browser, DAY_A, { gates: local });
        const r = await page.evaluate(([remote, ledgers]) => {
          const T = window.__brickfordTest;
          const changed = T.mergeState({ v: 1, device: "other", state: { gates: remote }, ledgers: ledgers || {} }).changed;
          return { done: T.gatePlan()[0].doneDate, changed };
        }, [remote, ledgers || null]);
        got.push({ name, want, r, errors });
        await ctx.close();
      }
      const line = c => c.name + " -> " + (c.r.done ? "passed " + c.r.done : "open") + (c.r.done === c.want ? "" : " (want " + (c.want ? "passed " + c.want : "open") + ")");
      check("LWW merge: a pass at t1, then an unmark at t2 on another device, gives an unmark after a pull either way round",
        got.slice(0, 2).every(c => c.r.done === c.want), got.slice(0, 2).map(line).join("; "));
      check("LWW merge, mixed devices: an unmark beats an older legacy date string, either side",
        got.slice(2, 4).every(c => c.r.done === c.want), got.slice(2, 4).map(line).join("; "));
      check("LWW merge is last-writer-wins, not unmark-wins: a later pass beats an earlier unmark, and a timed pass beats a legacy false",
        got.slice(4, 6).every(c => c.r.done === c.want), got.slice(4, 6).map(line).join("; "));
      check("a remote legacy true is dated by its gate event in the remote's own ledger (19 Oct, not START_DATE)",
        got[6].r.done === got[6].want, line(got[6]));
      {
        const { ctx, page, errors } = await scenario(browser, DAY_A, { gates: { 1: P1, 2: U2 } });
        const n = await page.evaluate(g => window.__brickfordTest.mergeState({ v: 1, device: "other", state: { gates: g }, ledgers: {} }).changed, { 1: P1, 2: U2 });
        check("a pull of the same gates changes nothing", n === 0, n + " change(s)");
        got.push({ errors });
        await ctx.close();
      }
      check("no page errors (gate merge)", got.every(c => c.errors.length === 0), got.map(c => c.errors.join(" | ")).join(" "));
    }
  }

  // ---- the lecture quiz gate (T-043) ----
  // loop/specs/T-043-lecture-quiz-gate/spec.md. "Done" is watched AND
  // cleared: the quiz passed, no quiz at all, or first watched before the
  // gate shipped (grandfathered). Sun 18 Oct (plan day 2) schedules three MATH 120 lectures
  // and one SPCH 100 lecture that have quizzes, and two AI 200 lectures that
  // have none. Every expectation is worked out here from the fixture and the
  // summaries' checks (the data), never from schedDone. Every date is derived
  // from the app's QUIZ_GATE_FROM (review r1): grandfathered = gate - 1,
  // gated = gate + 1, the clock at gate + 5 — so any ship date works.
  {
    const P = "2026-10-18";
    const probe = await scenario(browser, "2026-11-01", null);
    const GATE = await probe.page.evaluate(() => window.__brickfordTest.QUIZ_GATE_FROM);
    await probe.ctx.close();
    const BEFORE = addDays(GATE, -1), AFTER = addDays(GATE, 1), TODAY = addDays(GATE, 5);
    // The plan's own date for every lecture, walked here: an empty state
    // with the clock the day before the start, when no day is re-anchored by
    // progress, so every date is the fixed plan's. Then a chain that crosses
    // the gate (owner, 2026-10-15: "lock from go-live only"): in a course,
    // lecture X is the last planned before QUIZ_GATE_FROM and Y1, Y2, Y3 the
    // three after it, all four with quizzes.
    const planCtx = await scenario(browser, addDays(START, -1), null);
    const plan = await planCtx.page.evaluate(n => {
      const T = window.__brickfordTest, out = {};
      const d = new Date(window.DAR.START_DATE + "T00:00:00Z");
      for (let i = 0; i < n; i++, d.setUTCDate(d.getUTCDate() + 1)) {
        const iso = d.toISOString().slice(0, 10);
        T.scheduledFor(iso).forEach(it => { if (!it.pseudo) { const k = it.cid + "." + it.ui + "." + it.li; if (!out[k]) out[k] = iso; } });
      }
      const sums = window.DAR.SUMMARIES || {}, q = k => !!((sums[k] || {}).checks || []).length;
      const flat = {};
      window.DAR.COURSES.forEach(c => { flat[c.id] = []; (c.units || []).forEach((u, ui) => u.lessons.forEach((_, li) => flat[c.id].push(c.id + "." + ui + "." + li))); });
      return { dates: out, flat, quiz: Object.keys(sums).filter(q) };
    }, 500);
    await planCtx.ctx.close();
    const hasQ = new Set(plan.quiz);
    const CH = (() => {
      for (const cid of ["math120", "math110", "math130", "spch100"]) {
        const f = plan.flat[cid], j = f.findIndex(k => (plan.dates[k] || "9999") >= GATE);
        if (j >= 1 && j + 2 < f.length && [j - 1, j, j + 1, j + 2].every(i => hasQ.has(f[i]))) return { cid, X: f[j - 1], Y1: f[j], Y2: f[j + 1], Y3: f[j + 2] };
      }
      return null;
    })();
    const part = k => k.split(".").slice(1).map(Number);
    const PASS = { passedAt: AFTER, at: AFTER + "T10:00:00.000Z", firstTry: 2, total: 3, attempts: 4 };
    const run = async (name, lessonsFor, extra) => {
      const { ctx, page, errors } = await scenario(browser, TODAY, null);
      const meta = await page.evaluate(P => ({
        gate: window.__brickfordTest.QUIZ_GATE_FROM,
        items: window.__brickfordTest.scheduledFor(P).filter(it => !it.pseudo).map(it => {
          const k = it.cid + "." + it.ui + "." + it.li, sm = (window.DAR.SUMMARIES || {})[k];
          return { k, quiz: !!(sm && sm.checks && sm.checks.length) };
        }),
      }), P);
      await ctx.close();
      const state = Object.assign({ lessons: lessonsFor(meta), studyDays: [P] }, extra ? extra(meta) : {});
      const sc = await scenario(browser, TODAY, state);
      const r = await sc.page.evaluate(([P, TODAY, lessons]) => {
        const T = window.__brickfordTest, gate = T.QUIZ_GATE_FROM;
        const sums = window.DAR.SUMMARIES || {};
        const mine = k => { const st = lessons[k]; if (!st || !st.done) return false;
          const sm = sums[k]; return !(sm && sm.checks && sm.checks.length) || !!(st.quiz && st.quiz.passedAt) || (st.doneAt && st.doneAt < gate); };
        const owed = new Set();
        for (let d = new Date(P + "T00:00:00Z"); d.toISOString().slice(0, 10) < TODAY; d.setUTCDate(d.getUTCDate() + 1))
          T.scheduledFor(d.toISOString().slice(0, 10)).filter(it => !it.pseudo).forEach(it => {
            const k = it.cid + "." + it.ui + "." + it.li; if (!mine(k)) owed.add(k); });
        const items = T.scheduledFor(P).filter(it => !it.pseudo);
        return {
          sched: items.map(it => ({ k: it.cid + "." + it.ui + "." + it.li, got: T.schedDone(it), want: mine(it.cid + "." + it.ui + "." + it.li) })),
          status: T.dayStatus(P), backlog: T.backlogCount(), owed: owed.size,
          lockQuizless: T.lockedBy("ai200", 0, 1) || T.lockedBy("ai200", 1, 0), lockFirst: T.lockedBy("math120", 0, 0),
          catchUp: T.catchUpQuizzes().map(x => x.k), streak: T.streak(), best: T.bestStreak(),
        };
      }, [P, TODAY, state.lessons]);
      await sc.ctx.close();
      return { name, meta, r, errors: errors.concat(sc.errors) };
    };
    const watched = doneAt => meta => { const L = {}; meta.items.forEach(i => { L[i.k] = { done: true, doneAt, notes: "", checks: [] }; }); return L; };
    const passed = doneAt => meta => { const L = watched(doneAt)(meta);
      meta.items.forEach(i => { if (i.quiz) L[i.k].quiz = Object.assign({}, PASS); }); return L; };
    // The ten study days up to TODAY, sealed: the streak with every quiz open
    // must equal the streak with no lectures at all.
    const run10 = []; for (let d = TODAY; run10.length < 10; d = addDays(d, -1)) if (!isSat(d)) run10.push(d);
    const gated = await run("gated", watched(AFTER));
    const pass = await run("passed", passed(AFTER));
    const gf = await run("grandfathered", watched(BEFORE));
    const sealedRun = await run("gated, with ten sealed days", watched(AFTER), () => ({ studyDays: run10.slice().sort() }));
    const sealedBare = await run("no lectures, the same ten sealed days", () => ({}), () => ({ studyDays: run10.slice().sort() }));
    const nQ = gated.meta.items.filter(i => i.quiz).length, nNo = gated.meta.items.length - nQ;
    const schedLine = x => x.r.sched.map(s => s.k + "=" + s.got + (s.got === s.want ? "" : "(want " + s.want + ")")).join(" ");
    check("the fixture day has gated and quiz-less lectures; dates from QUIZ_GATE_FROM " + GATE + " (grandfathered " + BEFORE + ", gated " + AFTER + ", today " + TODAY + ")",
      nQ > 0 && nNo > 0 && gated.meta.gate === GATE && BEFORE >= P, nQ + " with a quiz, " + nNo + " without");
    check("schedDone: watched after the gate with the quiz not passed is NOT done; a quiz-less watched lecture is",
      gated.r.sched.every(s => s.got === s.want) && gated.r.sched.some(s => !s.got) && gated.r.sched.some(s => s.got), schedLine(gated));
    check("schedDone: a passed quiz makes a watched lecture done", pass.r.sched.every(s => s.got === s.want && s.got), schedLine(pass));
    check("schedDone: watched before the gate is done without a quiz (grandfathered)", gf.r.sched.every(s => s.got === s.want && s.got), schedLine(gf));
    check("dayStatus follows: partial while a quiz is open, completed once passed or grandfathered",
      gated.r.status === "partial" && pass.r.status === "completed" && gf.r.status === "completed",
      "gated " + gated.r.status + ", passed " + pass.r.status + ", grandfathered " + gf.r.status);
    check("backlogCount follows: an unpassed quiz is still owed, a pass or a grandfathered watch is not",
      [gated, pass, gf].every(x => x.r.backlog === x.r.owed) && gated.r.backlog - pass.r.backlog === nQ,
      [gated, pass, gf].map(x => x.name + " " + x.r.backlog + " (want " + x.r.owed + ")").join(", "));
    check("the lock: the first lecture of a course never; a lecture after a quiz-less one never (watched or not)",
      gated.r.lockFirst === false && gated.r.lockQuizless === false,
      "math120 lecture 1 " + gated.r.lockFirst + "; ai200 0.1 and 1.0, each after a quiz-less lecture (one unwatched), " + gated.r.lockQuizless);

    // ---- lock from go-live only (owner, 2026-10-15) ----
    // X is planned before the gate, Y1..Y3 on or after it (dates walked above).
    {
      check("the fixture chain crosses the gate (not vacuous)", !!CH && plan.dates[CH.X] < GATE && plan.dates[CH.Y1] >= GATE,
        CH ? CH.X + " " + plan.dates[CH.X] + " | " + CH.Y1 + " " + plan.dates[CH.Y1] + " | " + CH.Y2 + " | " + CH.Y3 + " (gate " + GATE + ")" : "no course has one");
      const lockState = async lessons => {
        const sc = await scenario(browser, TODAY, { lessons });
        const r = await sc.page.evaluate(([CH, cid]) => { const T = window.__brickfordTest, pt = k => k.split(".").slice(1).map(Number);
          return { y1: T.lockedBy(cid, ...pt(CH.Y1)), y2: T.lockedBy(cid, ...pt(CH.Y2)), y3: T.lockedBy(cid, ...pt(CH.Y3)), root3: T.lockRoot(cid, ...pt(CH.Y3)) }; }, [CH, CH && CH.cid]);
        await sc.ctx.close();
        return { r, errors: sc.errors };
      };
      if (CH) {
        const none = await lockState({});
        check("a lecture planned before the gate, not watched, does not lock its successor", none.r.y1 === false, CH.Y1 + " locked " + none.r.y1);
        check("a lecture planned on or after the gate, not watched, locks its successor", none.r.y2 === true, CH.Y2 + " locked " + none.r.y2);
        check("a chain across the gate locks only from the gate on: the root of " + CH.Y3 + " is " + CH.Y1 + ", not " + CH.X,
          none.r.y3 === true && none.r.root3 === CH.Y1, "root " + none.r.root3);
        const W = (d, more) => Object.assign({ done: true, doneAt: d, notes: "", checks: [] }, more || {});
        const gatedY1 = await lockState({ [CH.Y1]: W(AFTER) });
        const passY1 = await lockState({ [CH.Y1]: W(AFTER, { quiz: Object.assign({}, PASS) }) });
        const gfY1 = await lockState({ [CH.Y1]: W(BEFORE) });
        check("after the gate: watched with the quiz not passed still locks the next; a pass or a watch before the gate opens it",
          gatedY1.r.y2 === true && passY1.r.y2 === false && gfY1.r.y2 === false,
          "watched " + gatedY1.r.y2 + ", passed " + passY1.r.y2 + ", watched before the gate " + gfY1.r.y2);
        check("no page errors (lock from go-live)", [none, gatedY1, passY1, gfY1].every(x => x.errors.length === 0), [none, gatedY1, passY1, gfY1].map(x => x.errors.join(" | ")).join(" "));
      }
    }
    const wantCU = gf.meta.items.filter(i => i.quiz).map(i => i.k);
    check("catchUpQuizzes lists the grandfathered lectures with a quiz not passed, in course order, and nothing gated or passed",
      JSON.stringify(gf.r.catchUp.slice().sort()) === JSON.stringify(wantCU.slice().sort()) && gated.r.catchUp.length === 0 && pass.r.catchUp.length === 0 &&
        gf.r.catchUp.indexOf("math120.0.0") < gf.r.catchUp.indexOf("math120.0.2"),
      "grandfathered " + gf.r.catchUp.join(",") + "; gated " + gated.r.catchUp.length + "; passed " + pass.r.catchUp.length);
    check("the streak is unchanged by the gate: open quizzes do not touch sealed days",
      sealedRun.r.streak === sealedBare.r.streak && sealedRun.r.best === sealedBare.r.best && sealedBare.r.streak >= 8,
      "with open quizzes " + sealedRun.r.streak + " (best " + sealedRun.r.best + "), without lectures " + sealedBare.r.streak + " (best " + sealedBare.r.best + ")");
    check("no page errors (quiz gate)", [gated, pass, gf, sealedRun, sealedBare].every(x => x.errors.length === 0),
      [gated, pass, gf, sealedRun, sealedBare].map(x => x.errors.join(" | ")).join(" "));

    // Review r1: unmark, then mark watched again, through the page. A lecture
    // first watched before the gate stays grandfathered: cleared, on the
    // catch-up list, and not holding the next lecture.
    {
      // CH.Y1, planned after the gate, watched ahead of its day before it.
      const k = CH ? CH.Y1 : "math120.0.0", nx = CH ? CH.Y2 : "math120.0.1";
      const { ctx, page, errors } = await scenario(browser, TODAY, { lessons: { [k]: { done: true, doneAt: BEFORE, notes: "", checks: [] } } });
      const at = () => page.evaluate(([k, nx]) => { const T = window.__brickfordTest, st = (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons || {})[k] || null;
        const p = nx.split("."); return { cleared: T.lessonCleared(k), lock: T.lockedBy(p[0], +p[1], +p[2]), cu: T.catchUpQuizzes().some(x => x.k === k), st }; }, [k, nx]);
      const before = await at();
      const press = async want => {
        await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-logic-stale", "1"); });
        await page.click("#view [data-act=toggleDone]");
        await page.waitForFunction(w => !document.querySelector("#view [data-logic-stale]") &&
          ((document.querySelector("#view [data-act=toggleDone]") || {}).textContent || "").trim() === w, want, { timeout: 8000 });
      };
      let off = {}, again = {}, harness = "";
      try {
        await page.evaluate(k => { location.hash = "#/lesson/" + k.split(".").join("/"); }, k);
        await page.waitForSelector("#view [data-act=toggleDone]", { timeout: 8000 });
        await press("Mark watched");
        off = await at();
        await press("Unmark watched");
        again = await at();
      } catch (e) { harness = "harness: " + e.message.split("\n")[0] + " (the lecture page lost its watched control — locked?) "; }
      check("unmark then re-mark keeps a lecture first watched before the gate grandfathered (cleared, on catch-up, the next lecture open)",
        !harness && !!CH && before.cleared && !before.lock && off.st && !off.st.done && off.st.firstDoneAt === BEFORE && off.lock === true &&
          again.cleared && !again.lock && again.cu && again.st.done && again.st.doneAt === TODAY && again.st.firstDoneAt === BEFORE,
        harness + JSON.stringify({ before, off: off.st, again }));
      check("no page errors (re-mark)", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- T-056: reset seven keeps what was watched, and nothing goes half done ----
  // loop/specs/T-056-reset-seven. The owner watched the lectures of the OLD
  // plan's days 1-8 (START 2026-10-05) between 16 and 22 Oct, no quizzes, and
  // asked for 16 Oct to be day 1 without rewatching anything. Nothing about a
  // lecture is keyed by date, so those lectures are the new plan's days 1-8
  // too. Under the gate T-043 shipped (16 Oct) every one of them would need its
  // quiz and days 1-7 would paint "Part" — the half-done bug. With the gate at
  // this change's ship date they are grandfathered: the days paint done, the
  // quizzes wait on the catch-up list, and on Sun 25 Oct (day 8, its lectures
  // already watched) the next action is the first lecture not yet watched,
  // read from the work-ahead plan, never a watched one. The old plan is read
  // from the app itself, curriculum.js served with the old START_DATE.
  {
    const GATE = await (async () => { const p = await scenario(browser, "2026-11-01", null);
      const g = await p.page.evaluate(() => window.__brickfordTest.QUIZ_GATE_FROM); await p.ctx.close(); return g; })();
    const oldCtx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
    await oldCtx.route("https://api.github.com/**", r => { githubHits++; return r.abort(); });
    const curSrc = require("fs").readFileSync(path.join(path.resolve(__dirname, ".."), "platform/data/curriculum.js"), "utf8");
    const oldSrc = curSrc.replace(/DAR\.START_DATE = "[0-9-]+";/, 'DAR.START_DATE = "2026-10-05";');
    await oldCtx.route(/\/data\/curriculum\.js/, r => r.fulfill({ status: 200, contentType: "application/javascript", body: oldSrc }));
    await oldCtx.clock.setFixedTime(new Date("2026-10-04T12:00:00Z"));
    const oldPage = await oldCtx.newPage();
    await oldPage.goto(URL + "/__test", { waitUntil: "load" });
    await oldPage.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 10000 });
    const oldPlan = await oldPage.evaluate(() => { const T = window.__brickfordTest, keys = [];
      for (let i = 0; i < 8; i++) T.scheduledFor(T.dateForStudy(i)).forEach(it => { if (!it.pseudo) { const k = it.cid + "." + it.ui + "." + it.li; if (keys.indexOf(k) < 0) keys.push(k); } });
      return { start: window.DAR.START_DATE, keys }; });
    await oldCtx.close();
    const WATCH_ON = ["2026-10-16", "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22"];
    const lessons = {};
    oldPlan.keys.forEach((k, i) => { lessons[k] = { done: true, doneAt: WATCH_ON[i % WATCH_ON.length], notes: "", checks: [] }; });
    const NOW = "2026-10-25";
    const DAYS7 = ["2026-10-16", "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23"];
    const { ctx, page, errors } = await scenario(browser, NOW, { lessons });
    const r = await page.evaluate(([DAYS7, NOW]) => {
      const T = window.__brickfordTest, sums = window.DAR.SUMMARIES || {};
      return { start: window.DAR.START_DATE, idx: DAYS7.map(d => T.studyIndex(d)), nowIdx: T.studyIndex(NOW),
        status: DAYS7.map(d => T.dayStatus(d)), sat17: T.dayStatus("2026-10-17"),
        sched: DAYS7.concat([NOW]).map(d => T.scheduledFor(d).filter(it => !it.pseudo).map(it => [it.cid + "." + it.ui + "." + it.li, T.schedDone(it)])),
        cu: T.catchUpQuizzes().map(x => x.k), quizK: Object.keys(sums).filter(k => ((sums[k] || {}).checks || []).length) };
    }, [DAYS7, NOW]);
    const watchedK = new Set(oldPlan.keys);
    const withQuiz = oldPlan.keys.filter(k => r.quizK.indexOf(k) >= 0);
    check("T-056 fixture: the old plan's days 1-8 read from START 2026-10-05 (" + oldPlan.keys.length + " lectures), watched 16-22 Oct, no quiz passed; " + withQuiz.length + " of them have a quiz; gate " + GATE,
      oldPlan.start === "2026-10-05" && oldPlan.keys.length > 20 && withQuiz.length > 5 && r.start === "2026-10-16" &&
        r.idx.join() === "0,1,2,3,4,5,6" && r.nowIdx === 7 && r.sat17 === "rest",
      "new indices " + r.idx.join() + ", 25 Oct index " + r.nowIdx + ", Sat 17 Oct " + r.sat17);
    const notDone = r.sched.flat().filter(([k, d]) => !d).map(([k]) => k);
    check("T-056: every lecture the new plan puts on days 1-8 was watched and counts as done (grandfathered, no quiz needed)",
      r.sched.every(day => day.length > 0) && r.sched.flat().every(([k, d]) => watchedK.has(k) && d),
      notDone.length ? "not done: " + notDone.join(",") : r.sched.map(d => d.length).join("+") + " lectures");
    check("T-056: days 1-7 (16-23 Oct, Sat 17 Oct rest) paint completed, none partial",
      r.status.every(s => s === "completed"), DAYS7.map((d, i) => d.slice(5) + " " + r.status[i]).join(", "));
    const cuMissing = withQuiz.filter(k => r.cu.indexOf(k) < 0);
    check("T-056: their quizzes stay on the catch-up list", cuMissing.length === 0, cuMissing.length ? "missing " + cuMissing.join(",") : r.cu.length + " on the list");
    // The calendar, as drawn: no "Part" dot on those days, and no lock on the day view.
    await page.evaluate(() => { location.hash = "#/calendar"; });
    await page.waitForSelector("#view [data-cal-day='2026-10-16']", { state: "attached", timeout: 8000 });
    const cal = await page.evaluate(DAYS7 => DAYS7.map(d => { const c = document.querySelector("#view [data-cal-day='" + d + "'] .cmark");
      return c ? c.className.replace("cmark ", "") : "none"; }), DAYS7);
    check("T-056: the calendar draws days 1-7 done (dfull), no Part (dhalf)", cal.every(c => c === "dfull"), DAYS7.map((d, i) => d.slice(5) + " " + cal[i]).join(", "));
    // The dashboard on Sun 25 Oct: the next action and the rail.
    await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-logic-stale", "1"); location.hash = "#/"; });
    await page.waitForFunction(() => !document.querySelector("#view [data-logic-stale]") && document.querySelector("#view .card.one.lead .one-go"), null, { timeout: 8000 });
    const dash = await page.evaluate(() => { const lead = document.querySelector("#view .card.one.lead"), rail = document.querySelector("#rail a.btn");
      return { href: lead.querySelector(".one-go").getAttribute("href"), kind: lead.querySelector(".one-kind").textContent,
        hint: lead.querySelector(".one-hint").textContent, backlog: window.__brickfordTest.backlogCount(), rail: rail ? rail.getAttribute("href") : null,
        lessonLinks: [...document.querySelectorAll("#view a[href^='#/lesson/']")].filter(a => !a.classList.contains("done-row")).map(a => a.getAttribute("href")),
        doneRows: document.querySelectorAll("#view a.done-row[href^='#/lesson/']").length }; });
    const keyOf = h => { const m = /^#\/lesson\/([^/]+)\/(\d+)\/(\d+)$/.exec(h || ""); return m ? m[1] + "." + m[2] + "." + m[3] : null; };
    const nk = keyOf(dash.href);
    const firstUnwatched = nk ? await page.evaluate(nk => { const cid = nk.split(".")[0], c = window.DAR.COURSES.find(x => x.id === cid), flat = [];
      c.units.forEach((u, ui) => u.lessons.forEach((_, li) => flat.push(cid + "." + ui + "." + li))); return flat; }, nk) : [];
    const prevK = firstUnwatched[firstUnwatched.indexOf(nk) - 1];
    check("T-056: on Sun 25 Oct (day 8, its lectures already watched) the next action opens the first lecture not yet watched",
      !!nk && !watchedK.has(nk) && !!prevK && watchedK.has(prevK) && !/^(Quiz|Watch): /.test(dash.kind) && keyOf(dash.rail) === nk,
      JSON.stringify({ next: nk, title: dash.kind, prev: prevK, rail: dash.rail }));
    const rewatch = dash.lessonLinks.map(keyOf).filter(k => k && watchedK.has(k) && k !== nk);
    check("T-056: nothing on the dashboard asks to re-watch a watched lecture (a watched one shows only as a ticked done row)",
      !watchedK.has(nk) && rewatch.length === 0 && dash.doneRows > 0, rewatch.length ? "open links to watched: " + rewatch.join(",")
        : dash.lessonLinks.length + " open lesson link(s), none watched; " + dash.doneRows + " ticked done row(s)");
    check("T-056: nothing is owed, so the work-ahead card says \"ahead of plan\"", dash.backlog === 0 && /today is done · ahead of plan$/.test(dash.hint),
      "backlog " + dash.backlog + ", hint \"" + dash.hint + "\"");
    check("no page errors (T-056 watched days)", errors.length === 0, errors.join(" | "));
    await ctx.close();
    // Review r1, finding 4: the same, with one earlier lecture (MATH 130's
    // first, plan day 3) never watched. Today is still cleared, so the card
    // works ahead, but it must not claim "ahead of plan": it says what is
    // owed, as the dashboard's "owed from earlier days" row counts it.
    const owedK = "math130.0.0";
    const less = Object.assign({}, lessons); delete less[owedK];
    const o = await scenario(browser, NOW, { lessons: less });
    await o.page.evaluate(() => { location.hash = "#/"; });
    await o.page.waitForSelector("#view .card.one.lead .one-go", { timeout: 8000 });
    const od = await o.page.evaluate(() => ({ today: window.__brickfordTest.scheduledFor(window.__brickfordTest.dateForStudy(7)).filter(it => !it.pseudo).every(it => window.__brickfordTest.schedDone(it)),
      backlog: window.__brickfordTest.backlogCount(), hint: document.querySelector("#view .card.one.lead .one-hint").textContent,
      href: document.querySelector("#view .card.one.lead .one-go").getAttribute("href") }));
    check("T-056: today cleared with a lecture owed (" + owedK + "): the card says \"today is done · 1 owed\", never \"ahead of plan\"",
      od.today && od.backlog === 1 && /today is done · 1 owed$/.test(od.hint) && !/ahead of plan/.test(od.hint) && !watchedK.has(keyOf(od.href)),
      JSON.stringify(od));
    check("no page errors (T-056 owed)", o.errors.length === 0, o.errors.join(" | "));
    await o.ctx.close();
  }

  // ---- T-056 r2: Sunday stays the seal-and-revision day (owner, "Keep Sunday") ----
  // With a Friday start, plan weeks run Fri-Thu, so "Seal the week · Week N"
  // on a Sunday named a plan week two days in. The owner kept Sunday: each
  // Sunday seals and revises the six study days before it, Sun-Fri, and the
  // first, Sun 25 Oct, takes the start to Fri 23 Oct (days 1-7). Revision
  // weeks are not plan weeks. The ranges below are the owner's, written out;
  // the week a date answers to is worked out here from the Sundays alone (the
  // first revision Sunday on or after it), never from the app's arithmetic.
  {
    const OWNER = [["2026-10-16", "2026-10-23", "2026-10-25"], ["2026-10-25", "2026-10-30", "2026-11-01"], ["2026-11-01", "2026-11-06", "2026-11-08"],
      ["2026-11-08", "2026-11-13", "2026-11-15"], ["2026-11-15", "2026-11-20", "2026-11-22"], ["2026-11-22", "2026-11-27", "2026-11-29"]];
    const isSun = iso => new Date(iso + "T00:00:00Z").getUTCDay() === 0;
    const revSundays = days.filter(d => isSun(d) && d >= "2026-10-25");
    const revOf = d => 1 + revSundays.findIndex(s => s >= d);
    const span = planDays.filter(d => d <= "2028-10-15");
    const p = await scenario(browser, "2026-11-01", null);
    const r = await p.page.evaluate(span => { const T = window.__brickfordTest;
      const weeks = []; for (let n = 1; T.revisionWeek(n).sun <= span[span.length - 1]; n++) weeks.push(T.revisionWeek(n));
      return { weeks, of: span.map(d => T.revisionWeekOf(d)), ics: T.buildICS(),
        study: span.filter(d => T.studyIndex(d) >= 0) }; }, span);
    const got6 = r.weeks.slice(0, 6).map(w => [w.from, w.to, w.sun]);
    check("T-056 r2: revision weeks 1-6 are the owner's: 16-23 Oct (revised Sun 25 Oct), then 25-30 Oct, 1-6 Nov, 8-13 Nov, 15-20 Nov, 22-27 Nov, each revised the Sunday after",
      JSON.stringify(got6) === JSON.stringify(OWNER) && r.weeks.slice(0, 6).every((w, i) => w.r === i + 1), JSON.stringify(got6));
    const ofBad = span.map((d, i) => [d, r.of[i], revOf(d)]).filter(x => x[1] !== x[2]);
    check("T-056 r2: every date to Oct 2028 answers to the revision week of the first revision Sunday on or after it (" + span.length + " dates)",
      ofBad.length === 0, ofBad.length ? ofBad.length + " wrong, first " + ofBad[0].join(" -> ") : "first " + span[0] + " -> " + r.of[0]);
    const cover = {}; let shapeBad = null;
    r.weeks.forEach(w => {
      const inW = r.study.filter(d => d >= w.from && d <= w.to);
      inW.forEach(d => { cover[d] = (cover[d] || 0) + 1; });
      const want = w.r === 1 ? 7 : 6;
      if (!shapeBad && (inW.length !== want || !isSun(w.sun) || new Date(w.to + "T00:00:00Z").getUTCDay() !== 5 || w.to !== addDays(w.sun, -2) ||
        (w.r > 1 && w.from !== addDays(w.sun, -7)))) shapeBad = JSON.stringify(w) + " holds " + inW.length + " study days";
    });
    const last = r.weeks[r.weeks.length - 1].to;
    const coverBad = r.study.filter(d => d <= last && cover[d] !== 1);
    check("T-056 r2: the revision weeks partition the study days: week 1 holds 7, every other 6, each ends on a Friday and is revised two days later, a Sunday",
      !shapeBad && coverBad.length === 0 && r.weeks.length > 100, shapeBad || (coverBad.length ? coverBad.length + " study day(s) not in exactly one week, first " + coverBad[0] : r.weeks.length + " weeks to " + last));
    const ev = (r.ics.split("BEGIN:VEVENT").find(e => /UID:brickford-review@/.test(e)) || "");
    check("T-056 r2: the exported calendar's weekly review starts Sun 25 Oct 18:00, weekly on Sundays (BYDAY=SU)",
      /DTSTART:20261025T180000/.test(ev) && /RRULE:FREQ=WEEKLY;BYDAY=SU\r\n/.test(ev), ev.replace(/\r\n/g, " | ").slice(0, 200));
    check("no page errors (T-056 r2 arithmetic)", p.errors.length === 0, p.errors.join(" | "));
    await p.ctx.close();

    // The calendar's day view offers the seal only on a revision Sunday, and
    // names the week it seals; the Week page seals that week, never the plan
    // week in progress. One clock per day.
    const short = iso => Number(iso.slice(8)) + " " + new Date(iso + "T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const label = n => { const [a, b] = OWNER[n - 1]; return "Week " + n + " · " + (a.slice(0, 7) === b.slice(0, 7) ? Number(a.slice(8)) + "–" + short(b) : short(a) + "–" + short(b)); };
    const DAYS = [["2026-10-18", null, 1, "Opens Sunday 25 Oct · 7 days"], ["2026-10-23", null, 1, "Opens Sunday 25 Oct · 2 days"],
      ["2026-10-24", null, 1, "Opens Sunday 25 Oct · 1 day"], ["2026-10-25", 1, 1, "Ready to seal"], ["2026-10-26", null, 2, "Opens Sunday 1 Nov · 6 days"],
      ["2026-10-30", null, 2, "Opens Sunday 1 Nov · 2 days"], ["2026-11-01", 2, 2, "Ready to seal"], ["2026-11-05", null, 3, "Opens Sunday 8 Nov · 3 days"],
      ["2026-11-08", 3, 3, "Ready to seal"]];
    for (const [d, sealN, weekN, state] of DAYS) {
      const s = await scenario(browser, d, null);
      await s.page.evaluate(() => { location.hash = "#/calendar"; });
      await s.page.waitForSelector("#view .cd-hb", { timeout: 8000 });
      const tiles = await s.page.evaluate(() => [...document.querySelectorAll("#view .cd-hb")].map(a =>
        [a.querySelector(".tl-t").textContent, a.querySelector(".tl-m").textContent.replace(/ /g, " ")]));
      const seal = tiles.filter(t => t[0] === "Seal the week");
      check("T-056 r2: " + d + " (" + new Date(d + "T00:00:00Z").toLocaleString("en-US", { weekday: "short", timeZone: "UTC" }) + ") " +
          (sealN ? "offers the seal, \"30 min · " + label(sealN) + "\"" : "offers no seal"),
        sealN ? seal.length === 1 && seal[0][1] === "30 min · " + label(sealN) : seal.length === 0, JSON.stringify(seal));
      await s.page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-logic-stale", "1"); location.hash = "#/review"; });
      await s.page.waitForFunction(() => !document.querySelector("#view [data-logic-stale]") && document.querySelector("#view .wk-state"), null, { timeout: 8000 });
      const wk = await s.page.evaluate(() => ({ h1: document.querySelector("#view h1").textContent, state: document.querySelector("#view .wk-state").textContent }));
      check("T-056 r2: " + d + " the Week page is \"Week " + weekN + "\" and reads \"" + state + "\"", wk.h1 === "Week " + weekN && wk.state === state, JSON.stringify(wk));
      if (d === "2026-11-01") {
        await s.page.fill("#rvShipped", "a repo");
        await s.page.click("#view [data-act=logWeek]");
        await s.page.waitForFunction(() => /Sealed/.test((document.querySelector("#view .wk-state") || {}).textContent || ""), null, { timeout: 8000 });
        const st = await s.page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}"));
        const e = (st.ledger || [])[(st.ledger || []).length - 1];
        check("T-056 r2: sealing on Sun 1 Nov (plan day 14, plan week 3 running) stores revision week 2 (25-30 Oct), and the chain says week2",
          (st.weeks || []).length === 1 && st.weeks[0].week === 2 && st.weeks[0].date === d && !!e && e.type === "week" && e.ref === "week2",
          JSON.stringify({ weeks: st.weeks, ev: e && { type: e.type, ref: e.ref } }));
      }
      check("no page errors (T-056 r2 " + d + ")", s.errors.length === 0, s.errors.join(" | "));
      await s.ctx.close();
    }

    // The Library's Sunday revision tiles: one per PDF, each its revision
    // week's range and the lectures the plan as drawn puts in it (counted
    // here from scheduledFor on an empty state, distinct lectures, pseudo
    // blocks left out, exactly as tools/revision-pdf.js counts them).
    const l = await scenario(browser, "2026-11-01", null);
    const lib = await l.page.evaluate(OWNER => { const T = window.__brickfordTest;
      const counts = OWNER.map(([a, b]) => { const k = new Set();
        for (let d = new Date(a + "T00:00:00Z"); d.toISOString().slice(0, 10) <= b; d.setUTCDate(d.getUTCDate() + 1))
          T.scheduledFor(d.toISOString().slice(0, 10)).forEach(it => { if (!it.pseudo) k.add(it.cid + "." + it.ui + "." + it.li); });
        return k.size; });
      location.hash = "#/library";
      return counts; }, OWNER);
    await l.page.waitForSelector("#view .lb-rev a", { timeout: 8000 });
    const tiles = await l.page.evaluate(() => [...document.querySelectorAll("#view .lb-rev a")].map(a =>
      [a.getAttribute("href"), a.querySelector(".pb-t").textContent, a.querySelector(".pb-d").textContent]));
    const wantT = OWNER.map((_, i) => ["../revision/week-0" + (i + 1) + ".pdf", "Week " + (i + 1), label(i + 1).replace(/^Week \d+ · /, "") + " · " + lib[i] + " lectures"]);
    check("T-056 r2: the Library's six Sunday revision tiles are the revision weeks, each its range and its lecture count (" + lib.join(", ") + ")",
      JSON.stringify(tiles) === JSON.stringify(wantT) && lib.every(n => n > 0), JSON.stringify(tiles));
    check("no page errors (T-056 r2 Library)", l.errors.length === 0, l.errors.join(" | "));
    await l.ctx.close();
  }

  // T-052: the monk-mode row. Day 1 is 24 Oct 2026 and day 90 is 21 Jan 2027 (T-056),
  // counted in calendar days (a Saturday counts); the dashboard shows the row
  // only inside those 90 days, linking to the private monk-mode page.
  for (const [now, want] of [["2026-10-23", null], ["2026-10-24", 1], ["2026-10-26", 3], ["2027-01-21", 90], ["2027-01-22", null]]) {
    const probe = await scenario(browser, now, null);
    await probe.page.evaluate(() => { location.hash = "#/"; });
    await probe.page.waitForSelector("#view .dash-title", { state: "attached" });
    const r = await probe.page.evaluate(() => {
      const T = window.__brickfordTest;
      const a = document.querySelector("#view a.monk-row");
      return { url: T.MONK.url, row: !!a,
        href: a ? a.getAttribute("href") : null, blank: a ? a.target === "_blank" : null,
        head: a ? a.closest(".glist").previousElementSibling.textContent : null,
        h: a ? Math.round(a.getBoundingClientRect().height) : null };
    });
    const day = await probe.page.evaluate(d => window.__brickfordTest.monkDay(d), now);
    // T-054 changed where the row goes: #/monk in the same window (it was
    // MONK.url in a new tab). The day, the head and the 44px are as they were.
    const ok = day === want && (want === null
      ? !r.row
      : r.row && r.href === "#/monk" && r.blank === false && r.head === "Monk ModeDay " + want + " of 90" && r.h >= 44);
    check("monk mode on " + now + ": " + (want === null ? "no row" : "day " + want + " of 90, a 44px row opening #/monk in the same window"), ok, JSON.stringify({ day, ...r }));
    check("no page errors (monk mode " + now + ")", probe.errors.length === 0, probe.errors.join(" | "));
    await probe.ctx.close();
  }

  // T-054: the Monk Mode page's arithmetic (loop/specs/T-054-monk-page/spec.md,
  // with the owner's amendment of 2026-10-23: Ja'fari Tehran, prayers combined
  // into 3). Expected values are stated here or worked out here in Node, never
  // read from the app.
  //
  // The prayer table is ONE line: the method the app must ship and the Manama
  // times it must give, within a minute. When the owner settles a method, this
  // line and PRAYER_METHOD in app.js are the whole change.
  const PRAYER_TABLE = { method: { fajr: 17.7, maghrib: 4.5, isha: 14, combine: true }, days: { "2026-10-22": { fajr: "04:24", dhuhr: "11:22", maghrib: "17:20" }, "2026-12-06": { fajr: "04:51", dhuhr: "11:29", maghrib: "17:04" }, "2027-01-15": { fajr: "05:07", dhuhr: "11:47", maghrib: "17:25" } } };
  {
    const probe = await scenario(browser, "2026-10-28", null);
    const toMin = hm => +hm.slice(0, 2) * 60 + +hm.slice(3);
    const r = await probe.page.evaluate(days => {
      const T = window.__brickfordTest;
      const out = { method: T.PRAYER_METHOD, syncs: T.MONK_SYNCS, times: {} };
      for (const d of days) out.times[d] = T.monkPrayerTimes(d);
      return out;
    }, Object.keys(PRAYER_TABLE.days));
    check("PRAYER_METHOD is the table's method (" + JSON.stringify(PRAYER_TABLE.method) + ")",
      JSON.stringify(r.method) === JSON.stringify(PRAYER_TABLE.method), JSON.stringify(r.method));
    check("MONK_SYNCS ships false until T-053", r.syncs === false, String(r.syncs));
    for (const [d, want] of Object.entries(PRAYER_TABLE.days)) {
      const got = r.times[d] || {};
      const off = Object.keys(want).map(k => [k, typeof got[k] === "number" ? Math.abs(got[k] - toMin(want[k])) : Infinity]);
      check("prayer times, Manama, " + d + ": " + Object.entries(want).map(([k, v]) => k + " " + v).join(", ") + " within 1 minute",
        off.every(([, m]) => m <= 1), off.map(([k, m]) => k + " off by " + (isFinite(m) ? m.toFixed(2) : "missing")).join(", "));
    }

    // The port is the reference's: loop/design/monk-mode.html's own
    // prayerTimes, read from the file and run here, against the app's on all
    // 90 days, to 0.01 minute. The table above allows a minute, which a date
    // one day out stays inside (the times move under a minute a day); this
    // does not.
    {
      const html = require("fs").readFileSync(path.join(path.resolve(__dirname, ".."), "loop/design/monk-mode.html"), "utf8");
      const a = html.indexOf("  const d2r"), b = html.indexOf("  // ---------- the routine");
      const geo = /const LAT = ([\d.]+), LNG = ([\d.]+), TZH = (\d+)/.exec(html);
      let ref = null;
      try { ref = a > 0 && b > a && geo ? new Function("LAT", "LNG", "TZH", html.slice(a, b) + "\nreturn prayerTimes;")(+geo[1], +geo[2], +geo[3]) : null; } catch (e) { ref = null; }
      const span90 = range("2026-10-24", "2027-01-21");
      const app = await probe.page.evaluate(ds => ds.map(d => window.__brickfordTest.monkPrayerTimes(d)), span90);
      const KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
      const worst = ref ? span90.map((d, i) => { const r0 = ref(d); return KEYS.map(k => [d + " " + k, Math.abs(app[i][k] - r0[k])]); }).flat().sort((x, y) => y[1] - x[1])[0] : null;
      check("prayer times equal the reference's prayerTimes (loop/design/monk-mode.html) on all " + span90.length + " days, to 0.01 minute",
        !!worst && span90.length === 90 && worst[1] < 0.01, worst ? "worst " + worst[0] + " off by " + worst[1].toFixed(4) + " min" : "could not read the reference's prayerTimes");
    }

    // Combined and separate: the slots, and the prayer blocks in the routine.
    // 23 Oct 2026 is a Friday: no Jumu'ah, the grave visit stays.
    const FRI = "2026-10-23";
    const c = await probe.page.evaluate(d => {
      const T = window.__brickfordTest, on = T.PRAYER_METHOD, off = Object.assign({}, on, { combine: false });
      const pick = m => ({ slots: T.monkSlots(m).map(s => s.label), pt: T.monkPrayerTimes(d, m),
        blocks: T.monkPlanFor(d, m).filter(e => e.kind === "prayer").map(e => [e.title, e.start, e.end - e.start]),
        titles: T.monkPlanFor(d, m).map(e => e.title) });
      return { on: pick(on), off: pick(off) };
    }, FRI);
    const near = (a, b) => Math.abs(a - b) < 1e-9;
    check("combine on: 3 chips, Fajr, Dhuhr & Asr, Maghrib & Isha", c.on.slots.join("|") === "Fajr|Dhuhr & Asr|Maghrib & Isha", c.on.slots.join("|"));
    check("combine on: 3 prayer blocks, Fajr 15 min at Fajr, Dhuhr & Asr 25 min at Dhuhr, Maghrib & Isha 25 min at Maghrib",
      c.on.blocks.length === 3 && c.on.blocks[0][0] === "Fajr" && near(c.on.blocks[0][1], c.on.pt.fajr) && c.on.blocks[0][2] === 15 &&
      c.on.blocks[1][0] === "Dhuhr & Asr" && near(c.on.blocks[1][1], c.on.pt.dhuhr) && c.on.blocks[1][2] === 25 &&
      c.on.blocks[2][0] === "Maghrib & Isha" && near(c.on.blocks[2][1], c.on.pt.maghrib) && c.on.blocks[2][2] === 25, JSON.stringify(c.on.blocks));
    check("combine off: 5 chips and 5 prayer blocks, each at its own time",
      c.off.slots.join("|") === "Fajr|Dhuhr|Asr|Maghrib|Isha" && c.off.blocks.length === 5 &&
      ["fajr", "dhuhr", "asr", "maghrib", "isha"].every((k, i) => near(c.off.blocks[i][1], c.off.pt[k])), JSON.stringify(c.off.blocks));
    // The owner's routine (amendment 2026-10-23, second message), every
    // block but the prayers, by weekday, stated here as the table was given.
    const BASE = [[330, 10, "Journaling"], [340, 20, "Meditation"], [360, 90, "Gym"], [360, 45, "German \u2014 Easy German podcast"],
      [450, 180, "Brickford \u2014 Deep Track"], [630, 45, "Scripting"], [720, 120, "Working \u2014 business"], [830, 10, "Post short-form"], [840, 90, "Nap"],
      [930, 10, "German \u2014 speaking"], [940, 10, "German \u2014 writing"], [950, 70, "Working \u2014 business"], [1080, 25, "German \u2014 reading"],
      [1105, 155, "Working \u2014 business"], [1260, 55, "Reading"], [1315, 5, "Plan tomorrow"]];
    const ROUTINE = dw => {
      let b = BASE.map(x => x.slice());
      if (dw === 0 || dw === 3) b[6][2] = "Editing \u2014 stream \u2192 clips";
      if (dw === 2 || dw === 6) b = b.filter(x => x[0] !== 1105).concat([[1140, 120, "Stream (English)"]]);
      if (dw === 5) b.push([480, 60, "Grandmother \u2014 grave visit"]);
      if (dw === 0) b.push([1080, 30, "Weekly review"]);
      return b.map(x => x.join(" ")).sort();
    };
    const WEEK = range("2026-10-25", "2026-10-31");
    const rt = await probe.page.evaluate(ds => ds.map(d => window.__brickfordTest.monkPlanFor(d).filter(e => e.kind !== "prayer").map(e => [e.start, e.end - e.start, e.title].join(" ")).sort()), WEEK);
    WEEK.forEach((d, i) => {
      const want = ROUTINE(new Date(d + "T00:00:00Z").getUTCDay());
      const miss = want.filter(x => !rt[i].includes(x)), extra = rt[i].filter(x => !want.includes(x));
      check("the routine on " + d + " (" + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(d + "T00:00:00Z").getUTCDay()] + "): " + want.length + " blocks as the owner gave them",
        miss.length === 0 && extra.length === 0, "missing " + JSON.stringify(miss) + ", extra " + JSON.stringify(extra));
    });
    check("Friday " + FRI + ": no Jumu'ah block, the grave visit stays",
      !c.on.titles.some(t => /jumu/i.test(t)) && !c.off.titles.some(t => /jumu/i.test(t)) && c.on.titles.includes("Grandmother — grave visit"), c.on.titles.join(", "));

    // The day score: 3 prayer slots + 6 habits + work >= 10 + phone < 2 = 11
    // items (13 with combine off). Each fixture says what it gets, by hand.
    const ALL3 = { fajr: true, dhuhrAsr: true, maghribIsha: true };
    const GER = { podcast: true, speak: true, write: true, read: true };
    const HAB = { german: GER, brickford: true, meditate: true, read: true, clean: true, plan: true };
    const SCORE = [
      ["nothing logged", {}, 0, 11],
      ["everything", Object.assign({ prayers: ALL3, work: 10, phone: 1.5 }, HAB), 11, 11],
      ["Fajr only, work 9.5, phone exactly 2", { prayers: { fajr: true }, work: 9.5, phone: 2 }, 1, 11],
      ["phone 0 counts as under 2", { phone: 0 }, 1, 11],
      ["two prayers, German (all 4), work 10, phone 1.5", { prayers: { dhuhrAsr: true, maghribIsha: true }, german: GER, work: 10, phone: 1.5 }, 5, 11],
      ["German 3 of 4 does not count", { german: { podcast: true, speak: true, write: true } }, 0, 11],
      ["German as a bare true (the old shape) does not count", { german: true }, 0, 11],
      ["a separate-prayer key does not count when combined", { prayers: { dhuhr: true, asr: true } }, 0, 11],
    ];
    const sc = await probe.page.evaluate(F => F.map(([, rec]) => window.__brickfordTest.monkScore(rec)), SCORE);
    SCORE.forEach(([name, , done, n], i) => {
      const want = { done, n, pct: Math.round(100 * done / n) };
      check("score: " + name + " = " + done + " of " + n + " (" + want.pct + "%)", JSON.stringify(sc[i]) === JSON.stringify(want), JSON.stringify(sc[i]));
    });
    const sc5 = await probe.page.evaluate(() => { const T = window.__brickfordTest, off = Object.assign({}, T.PRAYER_METHOD, { combine: false });
      return T.monkScore({ prayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true }, work: 10 }, off); });
    check("score, combine off: 5 prayers + work = 6 of 13", JSON.stringify(sc5) === JSON.stringify({ done: 6, n: 13, pct: 46 }), JSON.stringify(sc5));

    // Weeks run Sunday to Saturday: every day from the Sunday before day 1 to
    // the Saturday after day 90, against getUTCDay() here.
    const span = range("2026-10-18", "2027-01-23");
    const ws = await probe.page.evaluate(ds => ds.map(d => window.__brickfordTest.monkWeekStart(d)), span);
    const wsBad = span.filter((d, i) => ws[i] !== addDays(d, -new Date(d + "T00:00:00Z").getUTCDay()) || new Date(ws[i] + "T00:00:00Z").getUTCDay() !== 0);
    check("weeks start on Sunday: " + span.length + " days, each in the week of the Sunday on or before it", wsBad.length === 0, wsBad.slice(0, 3).map(d => d + " -> " + ws[span.indexOf(d)]).join(", "));

    // The weekly and monthly sums on a fixture. Wednesday 28 Oct 2026: its
    // week is Sun 25 Oct to Sat 31 Oct, so Sat 24 Oct and Sun 1 Nov are out.
    const DAYS = {
      "2026-10-24": { shorts: 5, stream: 1, work: 12, gym: 1, clips: 3 },
      "2026-10-25": { shorts: 2, work: 8.5, gym: 1, clips: 5, scripts: 1 },
      "2026-10-28": { shorts: 1, stream: 1, work: 10, video: 1 },
      "2026-10-31": { shorts: 3, stream: 1, book: 1, work: 11.5, gym: 1, scripts: 2 },
      "2026-11-01": { shorts: 9, work: 9, clips: 4, stream: 1 },
    };
    const sums = await probe.page.evaluate(D => { const T = window.__brickfordTest;
      return { wk: T.monkWeekSums(D, "2026-10-28"), wkSun: T.monkWeekSums(D, "2026-10-25"), wkSat: T.monkWeekSums(D, "2026-10-31"),
        oct: T.monkMonthSums(D, "2026-10-28"), nov: T.monkMonthSums(D, "2026-11-01") }; }, DAYS);
    const WK = { shorts: 6, stream: 2, video: 1, scripts: 3, gym: 2, book: 1, work: 30 };
    const same = (a, b) => Object.keys(b).every(k => a && a[k] === b[k]);
    check("this week (Sun 25 - Sat 31 Oct) from Wed 28 Oct: " + JSON.stringify(WK), same(sums.wk, WK), JSON.stringify(sums.wk));
    check("the same week from its Sunday and from its Saturday", same(sums.wkSun, WK) && same(sums.wkSat, WK), JSON.stringify([sums.wkSun, sums.wkSat]));
    check("this month: October streams 3, clips 8; November streams 1, clips 4",
      same(sums.oct, { stream: 3, clips: 8 }) && same(sums.nov, { stream: 1, clips: 4 }), JSON.stringify([sums.oct, sums.nov]));

    // Focus this week: the weakest habit over the 7 days before today, with
    // its fix. Today 30 Oct: the window is 23-29 Oct, of which 24-29 are monk
    // days (6; day 1 is 24 Oct since T-056). Prayers all 3 on 4 of them (67%), German on 1 (17%), the rest
    // on all 6 (100%), work and phone on all 6: German is the weakest. On the
    // other 5 days German is 3 of its 4 chips, which is not done.
    const FOCUS = {};
    ["2026-10-24", "2026-10-25", "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29"].forEach((d, i) => {
      FOCUS[d] = Object.assign({ prayers: i < 4 ? ALL3 : { fajr: true }, work: 10, phone: 1 }, HAB, { german: i === 0 ? GER : { podcast: true, speak: true, read: true } });
    });
    FOCUS["2026-10-23"] = { german: false };           // before day 1: not counted
    const f = await probe.page.evaluate(D => window.__brickfordTest.monkFocus(D, "2026-10-30"), FOCUS);
    check("focus this week: German 1.5 h at 17% over 6 days, with its fix",
      !!f && f.days === 6 && f.key === "german" && f.label === "German 1.5 h" && f.rate === 17 && /German listening/.test(f.fix || ""), JSON.stringify(f));
    check("no page errors (monk arithmetic)", probe.errors.length === 0, probe.errors.join(" | "));
    await probe.ctx.close();
  }

  // The hook is test-only: an ordinary load must not publish it.
  {
    const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date("2026-11-01T12:00:00Z"));
    await ctx.route("https://api.github.com/**", r => { githubHits++; return r.abort(); });
    const page = await ctx.newPage();
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const has = await page.evaluate(() => "__brickfordTest" in window);
    check("the test hook exists only under #__test", !has, has ? "published on an ordinary load" : "absent on #/");
    await ctx.close();
  }

  await browser.close();
  check("no network sync (GitHub requests from test contexts)", githubHits === 0, githubHits + " request(s)");

  console.log("\n" + (fails === 0
    ? "PASS — " + checks + " invariants hold"
    : fails + " of " + checks + " invariant(s) FAILED"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
