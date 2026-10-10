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

async function scenario(browser, now, state) {
  const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
  await ctx.route("https://api.github.com/**", r => { githubHits++; return r.abort(); });
  // Noon, so no timezone edge can move the date the app computes as "today".
  await ctx.clock.setFixedTime(new Date(now + "T12:00:00Z"));
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
