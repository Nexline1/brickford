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
const START = "2026-10-05";
const DAY_1094 = "2030-04-02";           // dateForStudy(1093)
const BASELINE = "2030-04-03";           // addStudyDays(START, 1094)
const WALK_TO = "2030-04-15";            // past the finish, so the whole plan is walked

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

  // ---- pure date functions: one scenario, empty state, a fixed Tuesday ----
  {
    const { ctx, page, errors } = await scenario(browser, "2026-10-20", null);
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
        missedTue: T.dayStatus("2026-10-13"),     // a past study day, nothing done
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
                   : "every Saturday rest; an untouched past Tuesday is \"" + r.missedTue + "\" (not vacuous)");
    check("no page errors (date scenario)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- the streak ----
  // Today is Tuesday 20 Oct. Sealed: Mon 5 – Wed 7 Oct (an old run of 3), then
  // Mon 12 – Fri 16 Oct and Sun 18 – Tue 20 Oct. Saturday 17 Oct is not sealed
  // and must be stepped over: the current run is 8, not 3.
  const sealed = ["2026-10-05", "2026-10-06", "2026-10-07",
    "2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16",
    "2026-10-18", "2026-10-19", "2026-10-20"];
  {
    const { ctx, page, errors } = await scenario(browser, "2026-10-20", { studyDays: sealed });
    const r = await page.evaluate(() => ({ s: window.__brickfordTest.streak(), b: window.__brickfordTest.bestStreak() }));
    check("streak steps over an unsealed Saturday", r.s === 8,
      "run Mon 12 – Tue 20 Oct across unsealed Sat 17 Oct: expected 8, got " + r.s);
    // Known app bug: bestStreak counts a sealed Saturday (app.js:572-587). Owned
    // by a follow-up item; its fix must add the assertion bestStreak() === 8 for
    // the sealed-Saturday fixture below. Until then no check here claims that
    // bestStreak never counts a rest day — these fixtures leave Saturday unsealed.
    check("bestStreak steps over unsealed rest-day gaps", r.b === 8, "expected 8, got " + r.b);
    check("no page errors (streak scenario)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // The same run with Saturday 17 Oct SEALED as well: a rest day is never
  // counted, even when there is a seal on it, so the run is still 8, not 9.
  // bestStreak is deliberately not asserted on this fixture (known app bug above).
  {
    const withSat = sealed.concat(["2026-10-17"]).sort();
    const { ctx, page, errors } = await scenario(browser, "2026-10-20", { studyDays: withSat });
    const s = await page.evaluate(() => window.__brickfordTest.streak());
    check("streak does not count a sealed Saturday", s === 8,
      "run Mon 12 – Tue 20 Oct with Sat 17 Oct sealed: expected 8, got " + s);
    check("no page errors (sealed-Saturday scenario)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await scenario(browser, "2026-10-20",
      { studyDays: sealed, settings: { streakFrom: "2026-10-19" } });
    const r = await page.evaluate(() => ({ s: window.__brickfordTest.streak(), b: window.__brickfordTest.bestStreak() }));
    check("streak stops at streakFrom", r.s === 2, "streakFrom 19 Oct: expected 2, got " + r.s);
    // Known app bug: bestStreak counts a sealed Saturday (app.js:572-587). Owned
    // by a follow-up item; its fix must add the assertion bestStreak() === 8 for
    // the sealed-Saturday fixture above.
    check("bestStreak ignores streakFrom", r.b === 8, "streakFrom 19 Oct: expected 8, got " + r.b);
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
    const { ctx, page, errors } = await scenario(browser, "2026-10-18", { studyDays: ["2026-10-17"] });
    const n = await page.evaluate(() => window.__brickfordTest.backlogCount());
    check("a rest day owes no lessons (backlogCount)", n === 0, "expected 0, got " + n);
    check("no page errors (backlog scenario 1)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // (2) Mon 12 to Mon 19 Oct, nothing watched: the backlog is exactly the
  //     lectures scheduled on the seven non-Saturdays (Saturday is left out by
  //     the calendar here, not by the app; see the note above on the skip).
  {
    const from = "2026-10-12", today = "2026-10-20";
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
      await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
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
    //     when there is one. Two different days (Tue 20 Oct and Tue 3 Nov) must
    //     give the same plan. Read as "today", every later target slides daily.
    const DAY_A = "2026-10-20", DAY_B = "2026-11-03";
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
      // In Bahrain (UTC+3) 22:30Z on 7 Oct is 01:30 on the 8th. The last
      // PASSING event wins: passed on the 6th, passed again late on the 7th
      // (UTC), then an unmark on the 9th that the old merge undid (which is
      // how a `true` outlives its unmark) — so 8 Oct, local. The first event
      // would say the 6th, the last of any kind the 9th, a UTC reading the 7th.
      const ledger = [gateEvent(0, "2026-10-06T10:00:00.000Z", 1, true), gateEvent(1, "2026-10-07T22:30:00.000Z", 1, true),
                      gateEvent(2, "2026-10-09T09:00:00.000Z", 1, false)];
      const plans = [];
      for (const day of [DAY_A, DAY_B]) {
        const { ctx, page, errors } = await scenario(browser, day, { gates: { 1: true }, ledger }, "Asia/Bahrain");
        plans.push({ plan: await readPlan(page), errors });
        await ctx.close();
      }
      const want = expectPlan({ 1: "2026-10-08" });
      check("a legacy true takes the local date of its last PASSING gate event (Asia/Bahrain: 7 Oct 22:30Z is 8 Oct; a later unmark event is not it), the same on two days",
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
    //     22:30Z on 20 Oct, which is 01:30 on the 21st there: a pass is dated
    //     by the local calendar, as everything else here is.
    const DAY_LOCAL = "2026-10-21";
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
      check("the next gate can be passed: stored as { date: today (local: 21 Oct in Bahrain), at, passed: true }, and Gate 3 is still refused after it",
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
      const T1 = "2026-10-19T08:00:00.000Z", T2 = "2026-10-19T20:00:00.000Z";
      const P1 = { date: "2026-10-19", at: T1, passed: true }, U2 = { date: null, at: T2, passed: false };
      const U1 = { date: null, at: T1, passed: false }, P2 = { date: "2026-10-19", at: T2, passed: true };
      const cases = [
        ["the device that passed (t1) pulls the unmark (t2): open", { 1: P1 }, { 1: U2 }, null],
        ["the device that unmarked (t2) pulls the pass (t1): still open", { 1: U2 }, { 1: P1 }, null],
        ["an unmark (t2) pulls a legacy date string for that day (00:00): still open", { 1: U2 }, { 1: "2026-10-19" }, null],
        ["a legacy date string here pulls a newer unmark: open", { 1: "2026-10-12" }, { 1: U2 }, null],
        ["an unmark (t1) pulls a later pass (t2): passed", { 1: U1 }, { 1: P2 }, "2026-10-19"],
        ["a legacy false (no time) pulls a timed pass: passed", { 1: false }, { 1: P1 }, "2026-10-19"],
        // The remote's own ledger carries the event, so it has to be merged
        // before the gates are: otherwise this reads START_DATE (5 Oct).
        ["nothing here pulls a legacy true whose gate event is in the remote's ledger: passed that day", {}, { 1: true }, "2026-10-07",
          { phone: [gateEvent(0, "2026-10-07T09:00:00.000Z", 1, true)] }],
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
      check("a remote legacy true is dated by its gate event in the remote's own ledger (7 Oct, not START_DATE)",
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

  // The hook is test-only: an ordinary load must not publish it.
  {
    const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
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
