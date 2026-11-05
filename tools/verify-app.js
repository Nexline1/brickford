// verify-app.js — the Flutter app (app/) against the web app it ports (T-064).
//
//   node tools/verify-app.js                 the gate: freshness, parity, then the plants
//   node tools/verify-app.js --plant NAME    one planted defect; must exit 1 (the gate runs these itself)
//   node tools/verify-app.js --no-plants     the parity checks only (a quick look while editing)
//
// Four things, each of which fails the gate on its own:
//
// 1. FRESHNESS. app/assets/data/*.json is what tools/export-data.js would
//    write from platform/data/*.js right now, byte for byte. A curriculum edit
//    that was not re-exported would give the app a different plan.
//
// 2. PARITY. app.js (in Chromium, through the test hook __brickfordTest that
//    verify-logic uses, under a fixed clock) and the Dart port
//    (app/tool/engine_dump.dart) answer the same questions about the same
//    state fixtures, and every answer must be identical:
//      - the plan: dateForStudy for study days 0..1100, studyIndex,
//        prevStudyDay and monkDay for every date from START_DATE to
//        dateForStudy(1093) + 7, addStudyDays probes, every revision week,
//        monkScore probes, REST_DOW, QUIZ_GATE_FROM, MONK, MONK_PRI;
//      - per fixture, under its own clock: scheduledFor (keys, tracks and
//        day n of m) and dayStatus for every date in that range,
//        lessonCleared and grandfathered for every lesson, streak,
//        bestStreak, backlogCount;
//      - per fixture, with the clock walked across every date of the range:
//        studyAnchor, scheduledFor(today), streak and backlogCount.
//    A few functions are not on the hook (studyAnchor, prevStudyDay,
//    grandfathered, MONK_PRI); those are lifted out of app.js's source text
//    into a VM (vmExtract below) and run there, so the JS side is always
//    app.js's own code, never a copy written for the test.
//
// 3. PLANTS. Each planted defect must make this gate exit 1, or the gate has
//    never been shown to catch anything:
//      rest-dow    the Dart engine with REST_DOW = 5 (Friday)
//      stale-json  app/assets/data with one lesson's minutes changed
//      rest-status the Dart dayStatus with a past Saturday no longer "rest"
//                  (it falls through to missed/partial, which is how the web
//                  calendar would paint three years of Saturdays red)
//
// 4. CALENDAR (T-064 stage 2). What the Flutter calendar draws: dayStatus,
//    scheduledFor (the day sheet's rows) and gatePlan (the diamonds) for every
//    date from 2026-10-01 to 2026-12-31, for each state fixture above under a
//    Saturday clock and under a study-day clock, Dart against app.js.
//    Each runs in a scratch copy; nothing in the repo is modified.
//
// 5. QUIZ, PROBLEMS, EXAMS (T-064 stage 4). app.js and the Dart port on the same
//    inputs: grade() lifted out of quiz-engine.js against gradeAnswer over a
//    matrix of questions and typed answers (the comma, the tolerance, parseFloat's
//    prefix); whole sittings (the lecture's mastery quiz and the bank sitting)
//    run through the real DAR.Quiz in the page, with Math.random replaced by a
//    seeded generator and scripted answers, against MasterySitting/BankSitting
//    with the same generator: every question drawn, every option order, every
//    outcome and the result must be identical; recordQuizPass, updateMisses and
//    bestQuiz lifted from app.js; and lessonCleared, grandfathered, lockedBy and
//    the catch-up list at the gate. problemsDue and V.exams are read from the
//    rendered pages (#/workshop, #/exams) of app.js against problemsDue and
//    examItems, so psetDue, labDue, the plan ordering and the 70 pass mark are
//    measured end to end, not re-implemented in the test.
//    Plants: quiz-pass-mark (the bank pass mark 70 -> 75), quiz-gate (the gate day
//    counts as grandfathered), pset-due (a ticked pset stays due).
"use strict";
const fs = require("fs"), os = require("os"), path = require("path"), vm = require("vm");
const { execFileSync, spawnSync } = require("child_process");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const exporter = require("./export-data.js");

const ROOT = path.resolve(__dirname, "..");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const DART = process.env.DART || (fs.existsSync("/opt/flutter/bin/dart") ? "/opt/flutter/bin/dart" : "dart");
const PLANTS = ["rest-dow", "stale-json", "rest-status", "merge-weeks", "merge-streak", "monk-times", "quiz-pass-mark", "quiz-gate", "pset-due", "ledger-hash", "seal-guard", "treasury-sum", "atlas-count"];
const LIGHT = ["merge-weeks", "merge-streak", "monk-times", "quiz-pass-mark", "quiz-gate", "pset-due", "ledger-hash", "seal-guard", "treasury-sum", "atlas-count"].includes(process.argv[process.argv.indexOf("--plant") + 1]) || !!process.env.VERIFY_ONLY;
const CAL_FROM = "2026-10-01", CAL_TO = "2026-12-31";
const CAL_CLOCKS = ["2026-11-07", "2026-11-05"];        // a Saturday (rest) clock and a study-day clock

const argPlant = (() => { const i = process.argv.indexOf("--plant"); return i < 0 ? null : process.argv[i + 1]; })();
if (argPlant && !PLANTS.includes(argPlant)) { console.log("unknown plant " + argPlant); process.exit(2); }

let fails = 0, checks = 0;
function check(name, ok, detail) {
  checks++;
  if (!ok) fails++;
  console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : ""));
}

const addDays = (iso, n) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
function range(from, to) { const out = []; for (let d = from; d <= to; d = addDays(d, 1)) out.push(d); return out; }
const noon = iso => new Date(iso + "T12:00:00Z");
const schedKey = items => items.map(it => it.track + ":" + (it.pseudo ? "~" + it.short : it.cid + "." + it.ui + "." + it.li) +
  (it.dayN != null || it.spanN != null ? "@" + String(it.dayN ?? null) + "/" + String(it.spanN ?? null) : "")).join(" ");

// ---------- app.js functions that are not on the hook ----------
// Lifted out of the source by name, so what runs is app.js's own text.
function vmExtract(names, file) {
  const src = fs.readFileSync(path.join(ROOT, file || "platform/js/app.js"), "utf8");
  const pieces = names.map(name => {
    const fi = src.indexOf("function " + name + "(");
    if (fi >= 0) {
      let i = src.indexOf("{", fi), depth = 0;
      for (; i < src.length; i++) { if (src[i] === "{") depth++; else if (src[i] === "}" && --depth === 0) break; }
      return src.slice(fi, i + 1);
    }
    const m = src.match(new RegExp("\\n\\s*((?:const|let) " + name + " = [^\\n]*)"));
    if (!m) throw new Error("vmExtract: " + name + " not found in app.js");
    return m[1];
  });
  return pieces.join("\n");
}
function jsPure(startDate) {
  const ctx = { D: { START_DATE: startDate }, __today: startDate };
  vm.createContext(ctx);
  const code = vmExtract(["pad2", "addDaysISO", "daysBetween", "dowOf", "REST_DOW", "isRestDay", "_restK", "restOffset",
    "restsWithin", "studyIndex", "dateForStudy", "prevStudyDay", "studyToday", "studyAnchor", "QUIZ_GATE_FROM",
    "firstWatched", "grandfathered", "MONK_PRI", "localISO", "firstSunday", "revisionWeek", "canon", "mergeQuiz", "mergeState", "gateRec",
    "syncPayload", "MONK_SYNCS", "mkHHMM", "quizPassed", "recordQuizPass", "updateMisses", "bestQuiz", "revisionWeekOf", "isSealDay"]);
  ctx.S = null;
  vm.runInContext("const todayISO = () => __today; const logEvent = () => {}; const save = () => {};\n" + code +
    "\nthis.__f = { prevStudyDay, studyAnchor, grandfathered, MONK_PRI, setToday: t => { __today = t; }, mkHHMM," +
    " mergeState, syncPayload, setS: s => { S = s; }, getS: () => S, quizPassed, recordQuizPass, updateMisses, bestQuiz, revisionWeek, revisionWeekOf, isSealDay };", ctx);
  return ctx.__f;
}

// ---------- the browser ----------
async function page(browser, clock, state) {
  const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
  await ctx.route("https://api.github.com/**", r => r.abort());
  await ctx.route(/^https?:\/\//, r => r.abort());        // nothing leaves the machine: no KaTeX, no fonts, no YouTube
  await ctx.clock.setFixedTime(noon(clock));
  if (state) await ctx.addInitScript(s => { if (window.top === window) localStorage.setItem("darhikmah_v1", s); }, JSON.stringify(state));
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", e => errors.push(e.message));
  await p.goto(URL + "/__test", { waitUntil: "load" });
  await p.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 15000 });
  return { ctx, page: p, errors };
}

// ---------- the fixtures ----------
// Built from the plan itself (the JS plan, read through the hook), so they
// stay meaningful whatever START_DATE says.
function fixturesFrom(plan) {
  const days = plan.dayKeys;                       // lesson keys of plan days 1..14, in plan order, per day
  const uniq = a => [...new Set(a)];
  const first8 = uniq(days.slice(0, 8).flat()), next6 = uniq(days.slice(8, 14).flat()).filter(k => !first8.includes(k));
  const WATCH_ON = ["2026-10-16", "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22"];
  const AFTER = ["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-11-01", "2026-11-02"];
  const owner = {};
  first8.forEach((k, i) => { owner[k] = { done: true, doneAt: WATCH_ON[i % WATCH_ON.length], notes: "", checks: [] }; });
  const gate = JSON.parse(JSON.stringify(owner));
  next6.forEach((k, i) => {
    gate[k] = { done: true, doneAt: AFTER[i % AFTER.length], notes: "", checks: [] };
    if (i % 2 === 0) gate[k].quiz = { passedAt: AFTER[i % AFTER.length] };
  });
  // An unmark (firstDoneAt kept, doneAt deleted) and a re-mark after the gate of a lecture first watched before it.
  if (first8[0]) gate[first8[0]] = { done: false, firstDoneAt: "2026-10-16", notes: "", checks: [] };
  if (first8[1]) gate[first8[1]] = { done: true, doneAt: "2026-10-30", firstDoneAt: "2026-10-18", notes: "", checks: [] };
  if (first8[2]) gate[first8[2]].verified = true;
  // Sealed every study day to yesterday except 22 Oct: a gap inside the run, before streakFrom.
  const sealed = range("2026-10-16", "2026-11-03").filter(d => new Date(d + "T00:00:00Z").getUTCDay() !== 6 && d !== "2026-10-22");
  const gateState = {
    lessons: gate, studyDays: sealed, settings: { streakFrom: "2026-10-20" },
    problems: { "Arrays & Hashing|Two Sum": "2026-10-27", "Stack|Min Stack": true },
    review: first8[2] ? { [first8[2]]: { due: "2026-11-01", box: 0 } } : {},
  };
  const ahead = {};
  const take = (cid, n, on) => plan.flat[cid].slice(0, n).forEach(k => { ahead[k] = { done: true, doneAt: on, notes: "", checks: [] }; });
  take("math110", 30, "2026-10-17"); take("math120", 6, "2026-10-17"); take("ai200", 12, "2026-10-18"); take("spch100", 25, "2026-10-19");
  const late = {};
  ["math110", "math120", "math130", "ai200", "ai210"].forEach(cid => plan.flat[cid].forEach(k => { late[k] = { done: true, doneAt: "2026-10-20", notes: "", checks: [] }; }));
  plan.flat.math210.slice(0, 5).forEach(k => { late[k] = { done: true, doneAt: "2027-06-01", notes: "", checks: [] }; });
  return [
    { name: "empty", clock: "2026-11-04", state: null },
    { name: "before the start", clock: "2026-10-10", state: null },
    { name: "owner (days 1-8 watched before the gate)", clock: "2026-10-25", state: { lessons: owner } },
    { name: "gate (watched before and after, quizzes, seals, streakFrom)", clock: "2026-11-04", state: gateState },
    { name: "rest-day clock (Sat 7 Nov)", clock: "2026-11-07", state: gateState },
    { name: "worked ahead", clock: "2026-10-20", state: { lessons: ahead } },
    { name: "phase 2 (spine done, day 301)", clock: plan.d300, state: { lessons: late, studyDays: ["2027-06-01", "2027-06-02"] } },
  ];
}

const MONK_PROBES = [null, {}, { prayers: { fajr: true, dhuhrAsr: true, maghribIsha: true } }, { prayers: { fajr: true, dhuhrAsr: true } },
  { nosin: true }, { nosin: "yes" }, { work: 10 }, { work: 9.5 }, { work: "10" }, { bfh: 3 }, { bfh: 2.9 },
  { german: { podcast: true, speak: true, write: true, read: true } }, { german: { podcast: true, speak: true, write: true } }, { german: [true] },
  { prayers: { fajr: true, dhuhrAsr: true, maghribIsha: true }, nosin: true, work: 11, bfh: 3.5, german: { podcast: 1, speak: 1, write: 1, read: 1 } }];

// ---------- sync + monk fixtures (T-064 stage 3) ----------
const clone = v => JSON.parse(JSON.stringify(v));
const strip = v => Array.isArray(v) ? v.map(strip) : v && typeof v === "object"
  ? Object.fromEntries(Object.entries(v).filter(([, x]) => x != null).map(([k, x]) => [k, strip(x)])) : v;
const PROJ = ["lessons", "studyDays", "problems", "psets", "electives", "labs", "diag", "quizAttempts", "weeks", "review", "concepts", "anchors", "reps", "foreignLedgers", "gates", "monk"];
const projectS = S => strip(JSON.parse(JSON.stringify(Object.assign(Object.fromEntries(PROJ.map(k => [k, S[k]])), { streakFrom: S.settings.streakFrom }))));
// app.js's DEFAULT plus the load-time additions (ledger, concepts, anchors, foreignLedgers), complete, so the JS VM and Dart start equal.
const baseState = over => Object.assign({
  v: 1, lessons: {}, problems: {}, quizAttempts: {}, quizMisses: {}, diag: {}, gates: {}, studyDays: [], weeks: [], labs: {}, psets: {}, electives: {},
  treasury: { offer: "", clients: [], entries: [], niche: "" }, reps: { bank: [], story: [], humor: [], review: [] }, review: {}, concepts: {}, anchors: [],
  ledger: [], foreignLedgers: {}, monk: {},
  settings: { lastBackup: null, dailyStart: "08:00", streakFrom: null, lastSyncAt: null, syncError: null, deviceId: "dev-phone" },
}, over);
const remoteFile = (state, ledgers) => ({ v: 1, updatedAt: "2026-11-05T10:00:00.000Z", device: "dev-laptop", state, ledgers: ledgers || {} });

function mergeFixtures(plan) {
  const wk = plan.rev, before = r => addDays(wk[r].from, -4), after = r => addDays(wk[r].from, 2);
  const ev = (type, ref, data, ts) => ({ type, ref, data, ts });
  const diverge = {
    name: "two devices that diverge",
    local: baseState({
      lessons: {
        A: { done: true, doneAt: "2026-10-20", notes: "a short note", solved: 1, pos: 100, posAt: "2026-10-20T10:00:00.000Z" },
        B: { done: false, notes: "", pos: 50, posAt: "2026-10-21T08:00:00.000Z" },
        C: { done: true, doneAt: "2026-10-22", verified: true },
        D: { done: true, doneAt: "2026-10-25", notes: "aaaa", recall: "r" },
        E: { done: true, doneAt: "2026-10-26" },
      },
      studyDays: ["2026-10-18", "2026-10-16"],
      problems: { x: true, z: "2026-10-30" }, psets: { p1: true }, electives: { a: "planned" }, labs: { l1: { done: true } }, diag: { d1: { score: 3 } },
      quizAttempts: { b1: [{ date: "2026-10-20", pct: 80, score: 4 }] },
      weeks: [{ week: 1, date: after(1), seal: "phone" }],
      review: { k1: { last: "2026-10-20", box: 1 }, k3: { last: "2026-10-30", box: 2 } },
      concepts: { c1: { proven: false, sketches: [{ png: "p1", date: "2026-10-20" }] }, c3: { proven: true, provenAt: "2026-10-20" } },
      anchors: [{ head: "h1", date: "d1" }],
      reps: { bank: [{ date: "2026-10-20", what: "x" }], story: [{ date: "2026-10-21", seconds: 60 }], humor: [{ date: "2026-10-22", attempts: ["a1"] }], review: [{ date: "2026-10-31" }] },
      foreignLedgers: { "dev-laptop": [ev("lesson", "A", {}, "2026-10-20T09:00:00.000Z")] },
      gates: { 1: { date: "2026-10-20", at: "2026-10-20T00:00:00.000Z", passed: true } },
      monk: { days: { "2026-11-05": { nosin: true, at: "2026-11-05T05:00:00.000Z" } } },
      settings: { lastBackup: null, dailyStart: "08:00", streakFrom: "2026-10-19", lastSyncAt: null, syncError: null, deviceId: "dev-phone" },
    }),
    remote: remoteFile({
      lessons: {
        A: { done: true, doneAt: "2026-10-18", notes: "a longer note than the local one", solved: 3, pos: 10, posAt: "2026-10-19T09:00:00.000Z" },
        B: { done: true, doneAt: "2026-10-21", notes: "" },
        C: { done: true, doneAt: "2026-10-21" },
        D: { done: true, doneAt: "2026-10-27", notes: "bbbb", recall: "a longer recall" },
        F: { done: true, doneAt: "2026-10-28" },
      },
      studyDays: ["2026-10-17", "2026-10-18", "2026-10-19"],
      problems: { x: "2026-10-27", y: "2026-10-28" }, psets: { p1: true, p2: true }, electives: { a: "done", b: "planned" }, labs: { l2: { done: true } }, diag: { d1: { score: 9 }, d2: { score: 1 } },
      quizAttempts: { b1: [{ date: "2026-10-20", pct: 80, score: 4 }, { date: "2026-10-21", pct: 60, score: 3 }], b2: [{ date: "2026-10-22", pct: 100, score: 5 }] },
      weeks: [{ week: 1, date: addDays(after(1), 3), seal: "laptop" }, { week: 2, date: after(2), seal: "laptop" }],
      review: { k1: { last: "2026-10-22", box: 3 }, k2: { last: "2026-10-23", box: 1 }, k3: { last: "2026-10-01", box: 9 } },
      concepts: { c1: { proven: true, provenAt: "2026-10-25", sketches: [{ png: "p2", date: "2026-10-21" }, { png: "p3", date: "2026-10-22" }] }, c2: { proven: false }, c3: { proven: false } },
      anchors: [{ head: "h1", date: "d1" }, { head: "h2", date: "d2" }],
      reps: { bank: [{ date: "2026-10-20", what: "x" }, { date: "2026-10-19", what: "y" }], story: [{ date: "2026-10-21", seconds: 60 }, { date: "2026-10-21", seconds: 90 }],
        humor: [{ date: "2026-10-22", attempts: ["a1"] }, { date: "2026-10-23", attempts: ["b1"] }], review: [{ date: "2026-10-31" }, { date: "2026-10-30" }] },
      gates: { 1: { date: "2026-10-25", at: "2026-10-25T08:00:00.000Z", passed: true }, 2: "2026-11-01" },
      monk: { days: { "2026-11-05": { work: 10, at: "2030-01-01T00:00:00.000Z" }, "2026-11-04": { nosin: true, at: "2026-11-04T05:00:00.000Z" } } },
      settings: { theme: "dark", dailyStart: "07:00", streakFrom: "2026-10-23" },
    }, { "dev-laptop": [ev("lesson", "A", {}, "2026-10-18T09:00:00.000Z"), ev("lesson", "B", {}, "2026-10-21T09:00:00.000Z")],
      "dev-phone": [ev("x", "own", {}, "2026-10-01T00:00:00.000Z")], "dev-tablet": [ev("lesson", "F", {}, "2026-10-28T09:00:00.000Z")] }),
  };
  const sf = (name, mine, theirs) => ({ name: "streakFrom " + name, local: baseState({ settings: { ...baseState().settings, streakFrom: mine } }), remote: remoteFile({ settings: { streakFrom: theirs } }) });
  const wkOf = (name, local, remote) => ({ name: "sealed week " + name, local: baseState({ weeks: local }), remote: remoteFile({ weeks: remote }) });
  const q = (passedAt, at, firstTry, total, attempts) => ({ passedAt, at, firstTry, total, attempts });
  const lessonPair = (name, mine, theirs) => ({ name: "lessons: " + name, local: baseState({ lessons: { L: mine } }), remote: remoteFile({ lessons: { L: theirs } }) });
  return [
    diverge,
    sf("remote later wins", "2026-10-20", "2026-11-01"), sf("remote earlier is ignored", "2026-11-01", "2026-10-20"),
    sf("local unset, remote set", null, "2026-10-30"), sf("remote null changes nothing", "2026-10-30", null),
    wkOf("pre-reset local kept beside the new remote", [{ week: 3, date: before(3), seal: "old" }], [{ week: 3, date: after(3), seal: "new" }]),
    wkOf("new local kept beside the pre-reset remote", [{ week: 3, date: after(3), seal: "new" }], [{ week: 3, date: before(3), seal: "old" }]),
    wkOf("same side: the later seal wins, the earlier is ignored",
      [{ week: 3, date: after(3), seal: "a" }, { week: 4, date: addDays(after(4), 2), seal: "b" }],
      [{ week: 3, date: addDays(after(3), 1), seal: "a2" }, { week: 4, date: after(4), seal: "b2" }]),
    wkOf("both sides of two weeks at once", [{ week: 3, date: before(3) }, { week: 3, date: after(3) }], [{ week: 3, date: addDays(before(3), 1) }, { week: 3, date: addDays(after(3), 5) }, { week: 5, date: after(5) }]),
    lessonPair("both watched, the earlier doneAt stands", { done: true, doneAt: "2026-10-25", notes: "n" }, { done: true, doneAt: "2026-10-23", notes: "n" }),
    lessonPair("quiz: the earlier pass, the better first-try sitting", { done: true, doneAt: "2026-10-25", quiz: q("2026-10-26", "2026-10-26T10:00:00.000Z", 2, 5, 2) },
      { done: true, doneAt: "2026-10-25", quiz: q("2026-10-25", "2026-10-25T09:00:00.000Z", 4, 5, 1) }),
    lessonPair("quiz: only the remote passed", { done: true, doneAt: "2026-10-25", quiz: { attempts: 1 } }, { done: true, doneAt: "2026-10-25", quiz: q("2026-10-24", "2026-10-24T08:00:00.000Z", 3, 4, 2) }),
    lessonPair("quiz: only the local passed", { done: true, doneAt: "2026-10-25", quiz: q("2026-10-24", "2026-10-24T08:00:00.000Z", 3, 4, 2) }, { done: true, doneAt: "2026-10-25" }),
    lessonPair("quiz: a tie on share, the longer quiz wins", { done: true, quiz: q("2026-10-24", "a", 2, 4, 1) }, { done: true, quiz: q("2026-10-24", "b", 4, 8, 3) }),
    lessonPair("quiz passes survive the further-along copy", { done: false, quiz: q("2026-10-24", "a", 1, 2, 1) }, { done: true, doneAt: "2026-11-02", firstDoneAt: "2026-10-16", verified: true }),
    lessonPair("firstDoneAt is the earliest either side knows", { done: false, firstDoneAt: "2026-10-18" }, { done: true, doneAt: "2026-11-02", firstDoneAt: "2026-10-16" }),
    lessonPair("an ended lecture (pos cleared, newer posAt) beats an older point", { done: true, doneAt: "2026-10-25", pos: 300, posAt: "2026-11-02T08:00:00.000Z" }, { done: true, doneAt: "2026-10-25", posAt: "2026-11-03T08:00:00.000Z" }),
    lessonPair("the older pause does not move the newer one", { done: true, doneAt: "2026-10-25", pos: 300, posAt: "2026-11-03T08:00:00.000Z" }, { done: true, doneAt: "2026-10-25", pos: 10, posAt: "2026-11-01T08:00:00.000Z" }),
    { name: "monk: a remote monk is never read", local: baseState({ monk: { days: { "2026-11-05": { prayers: { fajr: true }, at: "2026-11-05T04:00:00.000Z" } } } }),
      remote: remoteFile({ monk: { days: { "2026-11-05": { prayers: { fajr: false }, nosin: true, at: "2030-01-01T00:00:00.000Z" } }, plans: { x: { at: "2030-01-01" } }, loops: { y: { text: "t", at: "2030-01-01" } } } }) },
    { name: "a legacy true gate finds its ledger event", local: baseState(), remote: remoteFile({ gates: { 1: true } },
      { "dev-laptop": [ev("gate", "gate1", { passed: true }, "2026-10-30T09:00:00.000Z")] }) },
    { name: "an empty remote changes nothing", local: diverge.local, remote: remoteFile({}) },
    { name: "a remote that is not a file is ignored", local: diverge.local, remote: null },
  ];
}
function payloadFixtures() {
  const m = mergeFixtures({ rev: Array.from({ length: 8 }, (_, i) => ({ from: addDays("2026-10-05", 7 * i) })) })[0];
  return [
    { name: "a full device, monk in S", local: m.local },
    { name: "a bare device with a theme", local: baseState({ settings: { ...baseState().settings, theme: "dark", streakFrom: "2026-11-01" } }) },
  ];
}
const MONK_DATES = ["2026-11-01", "2026-11-11", "2026-11-21", "2026-12-21", "2027-03-20", "2027-06-21", "2028-02-29"];
function monkFixture() {
  const days = {};
  const pr = (a, b, c) => ({ fajr: a, dhuhrAsr: b, maghribIsha: c });
  days["2026-11-01"] = { prayers: pr(true, true, true), nosin: true, work: 10, bfh: 3, german: { podcast: true, speak: true, write: true, read: true }, gym: 1, shorts: 2, stream: 1, at: "x" };
  days["2026-11-02"] = { prayers: pr(true, true, false), nosin: true, work: 9.5, bfh: 3.5, shorts: 3, video: 1, scripts: 2, gym: 1, phone: 1.5 };
  days["2026-11-03"] = { prayers: pr(true, true, true), nosin: false, work: 11, bfh: 2, german: { podcast: true }, shorts: 1, book: 1, phone: 3 };
  days["2026-11-04"] = { prayers: pr(false, false, false), nosin: true, work: 4, scripts: 1, gym: 1, clips: 12, stream: 1 };
  days["2026-11-05"] = { prayers: pr(true, true, true), nosin: true, work: 10, bfh: 3, german: { podcast: true, speak: true, write: true, read: true }, clips: 6, shorts: 1 };
  days["2026-11-08"] = { work: 7, stream: 2, clips: 30 };
  return { dates: MONK_DATES, days, sumDates: ["2026-11-05", "2026-11-08", "2026-11-30", "2026-12-02"],
    focusDates: ["2026-10-31", "2026-11-01", "2026-11-02", "2026-11-05", "2026-11-08", "2026-11-20"],
    phones: [null, {}, { phone: 0 }, { phone: 1.5 }, { phone: 2 }, { phone: 3 }] };
}

// The merge block: app.js's own mergeState (lifted into a VM) over each fixture, the live hook's `changed` as a cross-check.
async function runMergeJS(browser, fx, pure) {
  const out = { merge: {}, payload: {}, hookChanged: {}, errors: [] };
  for (const f of fx.merge) {
    pure.setS(clone(f.local));
    const r = pure.mergeState(clone(f.remote));
    out.merge[f.name] = { changed: r.changed, state: projectS(pure.getS()) };
    const { ctx, page: p, errors } = await page(browser, fx.planClock, f.local);
    out.hookChanged[f.name] = await p.evaluate(remote => window.__brickfordTest.mergeState(remote).changed, clone(f.remote));
    out.errors = out.errors.concat(errors);
    await ctx.close();
  }
  for (const f of fx.payload) {
    pure.setS(clone(f.local));
    const p = clone(pure.syncPayload());
    delete p.updatedAt;
    out.payload[f.name] = strip(p);
  }
  return out;
}
async function runMonkJS(browser, fx, pure) {
  const { ctx, page: p, errors } = await page(browser, fx.planClock, null);
  const m = await p.evaluate(mk => {
    const T = window.__brickfordTest, plan = {}, times = {};
    mk.dates.forEach(d => { times[d] = T.monkPrayerTimes(d); plan[d] = T.monkPlanFor(d); });
    return {
      times, plan,
      slots: T.monkSlots().map(s => [s.k, s.label, s.at, s.mins].join("|")),
      sums: Object.fromEntries(mk.sumDates.map(d => [d, { week: T.monkWeekSums(mk.days, d), month: T.monkMonthSums(mk.days, d), weekStart: T.monkWeekStart(d) }])),
      focus: Object.fromEntries(mk.focusDates.map(d => [d, T.monkFocus(mk.days, d)])),
      phoneOk: mk.phones.map(d => !!T.mkPhoneOk(d || {})),
    };
  }, fx.monk);
  await ctx.close();
  const hh = pure.mkHHMM;
  return {
    errors,
    raw: m.times,
    out: {
      times: Object.fromEntries(Object.entries(m.times).map(([d, t]) => [d, { hhmm: Object.fromEntries(Object.entries(t).map(([k, v]) => [k, hh(v)])) }])),
      plan: Object.fromEntries(Object.entries(m.plan).map(([d, evs]) => [d, evs.map(e => hh(e.start) + "-" + hh(e.end) + " " + e.kind + " " + e.title)])),
      slots: m.slots, sums: m.sums,
      focus: Object.fromEntries(Object.entries(m.focus).map(([d, f]) => [d, f && { days: f.days, key: f.key, label: f.label, rate: f.rate, fix: f.fix }])),
      phoneOk: m.phoneOk,
    },
  };
}

// ---------- quiz, Problems, Exams fixtures (T-064 stage 4) ----------
const GRADE_QS = [{ opts: ["a", "b", "c"], a: 2 }, { num: 5 }, { num: 2.5 }, { num: 2.5, tol: 0.01 }, { num: 1.234 }, { num: -0.5 }, { num: 0 }, { num: 100, tol: 0 }, { num: 1000 }];
const GRADE_GIVEN = [0, 1, 2, "5", "5.0", " 5", "5,0", "5abc", "abc", "", "1e0", "1e3", "+5", ".5", "-.5", "5.", "2,5", "2.5", "2.505", "2.52", "1,234.5", "1.234",
  "-0.5", "−0.5", "0x10", "Infinity", "-Infinity", "1e999", "1_000", "  \n5", "5 6", "5e", "5e+", "e5", "NaN", "0.1e1", "1E2", "00012", "1.2.3", ",5", "0,0", "-0", "100.000001", "999.9999999"];
function quizFixtures(plan, fixtures) {
  const sm = JSON.parse(fs.readFileSync(path.join(exporter.OUT, "summaries.json"), "utf8"));
  const quizKeys = JSON.parse(fs.readFileSync(path.join(exporter.OUT, "quiz-keys.json"), "utf8"));
  const work = JSON.parse(fs.readFileSync(path.join(exporter.OUT, "workshop.json"), "utf8"));
  const banks = JSON.parse(fs.readFileSync(path.join(exporter.OUT, "quizzes.json"), "utf8"));
  const pick = f => Object.keys(sm).find(k => sm[k].checks && f(sm[k].checks));
  const lec = {
    big: pick(c => c.length === 8 && c.some(q => !q.opts)) || pick(c => c.length === 8),
    flt: pick(c => c.some(q => !q.opts && !Number.isInteger(q.num))),
    tol: pick(c => c.some(q => q.tol != null && !q.opts)) || pick(c => c.some(q => q.tol != null)),
    mcq: pick(c => c.length === 3 && c.every(q => q.opts)),
  };
  const sittings = [
    { name: "lecture quiz, 8 checks, seed 1", mode: "mastery", lecture: lec.big, seed: 1 },
    { name: "lecture quiz, 8 checks, seed 77", mode: "mastery", lecture: lec.big, seed: 77 },
    { name: "lecture quiz, a decimal answer", mode: "mastery", lecture: lec.flt, seed: 42 },
    { name: "lecture quiz, a tolerance", mode: "mastery", lecture: lec.tol, seed: 5 },
    { name: "lecture quiz, options only", mode: "mastery", lecture: lec.mcq, seed: 99 },
    { name: "bank linear-algebra, 15 of 40", mode: "bank", bank: "linear-algebra", take: 40, perSitting: 15, seed: 5 },
    { name: "bank dsa, 15 of 30", mode: "bank", bank: "dsa", take: 30, perSitting: 15, seed: 6 },
    { name: "bank math-for-ml, 12 of 30", mode: "bank", bank: "math-for-ml", take: 30, perSitting: 12, seed: 7 },
    { name: "bank calculus, perSitting above the 7 unlocked", mode: "bank", bank: "calculus", take: 7, perSitting: 12, seed: 8 },
    { name: "bank probability, perSitting 0 means 15", mode: "bank", bank: "probability", take: 20, perSitting: 0, seed: 9 },
  ];
  // The gate: lectures spread across the plan (some before the gate date, some after), each with a successor left unwatched.
  const inQ = plan.keys.filter(k => quizKeys.includes(k)), spread = [0, 20, 40, 60, 80, 100, 120, 140, 160].map(i => inQ[i]).filter(Boolean);
  const noQ = plan.keys.find(k => !quizKeys.includes(k));
  const L = {};
  const w = (on, extra) => Object.assign({ done: true, doneAt: on, notes: "", checks: [] }, extra || {});
  const st = [w("2026-10-20"), w("2026-10-23"), w("2026-10-24"), w("2026-10-26", { quiz: { passedAt: "2026-10-26" } }),
    { done: false, firstDoneAt: "2026-10-20", notes: "", checks: [] }, w("2026-10-30", { firstDoneAt: "2026-10-20" }),
    { done: false, notes: "", checks: [], quiz: { passedAt: "2026-10-26" } }, w("2026-11-02"), w("2026-10-24", { firstDoneAt: "2026-10-23" })];
  spread.forEach((k, i) => { L[k] = st[i]; });
  if (noQ) L[noQ] = w("2026-10-26");
  const gate = { name: "the gate", clock: "2026-11-04", state: { lessons: L }, quizKeys: spread.concat(noQ ? [noQ] : []) };
  // Problems / Exams: every plan fixture, plus four built for them.
  const la = banks["linear-algebra"].questions;
  const mix = { name: "problems: owed, catch-up, due and ticked psets and labs", clock: "2026-10-27", state: {
    lessons: { "math110.1.1": w("2026-10-20"), "math110.1.4": w("2026-10-26", { quiz: { passedAt: "2026-10-26" } }), "math110.1.5": w("2026-10-26"), "ai200.0.0": w("2026-10-26") },
    psets: { "1806-ps1": "2026-10-26" }, labs: { "neetcode-10": { done: true, proof: "" } } } };
  const review = { name: "problems: a miss pool, one question locked", clock: "2026-11-04", state: {
    lessons: { [la[0].after]: w("2026-10-26"), [la[1].after]: w("2026-10-26") }, quizMisses: { "linear-algebra": [0, 1, 39, 200] } } };
  const exMix = { lessons: { "math110.0.0": w("2026-10-26"), "math110.0.1": w("2026-10-26"), "math110.0.2": w("2026-10-26"), "math120.0.0": w("2026-10-26") },
    problems: { "Arrays & Hashing|Two Sum": "2026-10-27" },
    diag: { "diag-la": { score: 70, date: "2026-11-01" }, "diag-calc": { score: 69, date: "2026-11-01" }, "diag-code": { score: 80, date: "2026-11-01" } },
    quizAttempts: { "linear-algebra": [{ date: "2026-11-01", score: 10, total: 15, pct: 70 }], dsa: [{ date: "2026-11-01", score: 10, total: 15, pct: 69 }, { date: "2026-11-02", score: 8, total: 15, pct: 55 }], calculus: [{ date: "2026-11-01", score: 15, total: 15, pct: 100 }] } };
  const clone2 = v => JSON.parse(JSON.stringify(v));
  // The coding diagnostic marked complete in the app is { score: null }: V.exams counts it as not sat (score != null), and so does the port.
  const exGate = Object.assign(clone2(exMix), { gates: { 1: { date: "2026-11-01", at: "2026-11-01T10:00:00.000Z", passed: true } }, diag: Object.assign(clone2(exMix.diag), { "diag-code": { score: null, date: "2026-11-01" } }) });
  const exAll = Object.assign(clone2(exMix), { diag: Object.assign(clone2(exMix.diag), { "diag-prob": { score: 88, date: "2026-11-02" } }) });
  const evals = fixtures.map(f => ({ name: f.name, clock: f.clock, state: f.state }))
    .concat([mix, review, { name: "exams: sat, boundary scores, a gate-less diagnostic with a score", clock: "2026-11-04", state: exMix },
      { name: "exams: gate 1 already passed", clock: "2026-11-04", state: exGate }, { name: "exams: every diagnostic sat", clock: "2026-11-04", state: exAll }]);
  return {
    grade: { qs: GRADE_QS, given: GRADE_GIVEN }, sittings, gate, evals,
    problems: evals, exams: evals,
    psetIds: [].concat(...work.PSETS.map(g => g.items.map(i => i.id))), labIds: work.LABS.map(l => l.id),
    record: { key: lec.mcq,
      passes: [{ total: 5, firstTry: 3, attempts: 7 }, { total: 5, firstTry: 2, attempts: 6 }, { total: 5, firstTry: 4, attempts: 5 }, { total: 5, firstTry: 4, attempts: 4 },
        { total: 10, firstTry: 8, attempts: 12 }, { total: 6, firstTry: 5, attempts: 6 }],
      misses: [["linear-algebra", [1, 2, 3], []], ["linear-algebra", [5], [1]], ["calculus", [0], []], ["linear-algebra", [], [2, 3, 5]], ["linear-algebra", [3], [3]]],
      attempts: { a: [{ pct: 70 }, { pct: 69 }], b: [{ pct: 0 }], c: [] } },
  };
}
function jsGrade() {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext("let q = null;\n" + vmExtract(["grade"], "platform/js/quiz-engine.js") + "\nthis.__g = (qq, g) => { q = qq; return grade(g); };", ctx);
  return ctx.__g;
}
// Runs in the page. The same policy as runSitting in engine_dump.dart: a question numbered bi is missed on its first
// showing when bi % 3 == 0, a numeric answer is typed with a decimal comma when bi is odd, and the miss is answered
// right when it comes back. Math.random is a seeded generator, so the draws match the Dart port's.
function driveSitting(f) {
  let seed = f.seed; Math.random = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const D = window.DAR, mastery = f.mode === "mastery";
  const qs = f.lecture ? D.SUMMARIES[f.lecture].checks : D.QUIZZES[f.bank].questions.slice(0, f.take);
  const norm = h => { const d = document.createElement("div"); d.innerHTML = h; return d.innerHTML; };
  const box = document.createElement("div"); document.body.appendChild(box);
  let result = null;
  D.Quiz.mount(box, mastery ? { title: "t", course: "", questions: qs } : { title: "t", course: "c", perSitting: f.perSitting, questions: qs },
    { mastery, onFinish: r => { result = r; } });
  const trace = [], nth = {};
  for (let guard = 0; !result && guard < 500; guard++) {
    const opts = Array.from(box.querySelectorAll(".opt"));
    let bi, perm = [];
    if (mastery) { bi = +box.querySelector(".q-card").dataset.q; perm = opts.map(b => +b.dataset.o); }
    else {
      const text = box.querySelector(".q-text").innerHTML;
      bi = qs.findIndex(q => norm(q.q) === text);
      if (opts.length) {
        const used = new Set();
        perm = opts.map(b => { const t = b.querySelector("span:last-child").innerHTML; const i = qs[bi].opts.findIndex((o, j) => !used.has(j) && norm(o) === t); used.add(i); return i; });
      }
    }
    const q = qs[bi], n0 = nth[bi] || 0; nth[bi] = n0 + 1;
    const right = bi % 3 !== 0 || n0 >= 1;
    const again = mastery && /again/.test(box.querySelector(".lq-n").textContent);
    if (opts.length) { const aSlot = perm.indexOf(q.a); opts[right ? aSlot : (aSlot === 0 ? 1 : 0)].click(); }
    else { const num = String(q.num); box.querySelector("#numAns").value = right ? (bi % 2 === 0 ? num : num.replace(".", ",")) : "zzz"; box.querySelector("#numGo").click(); }
    const ok = /^Correct/.test(box.querySelector("#qFeedback strong").textContent);
    const segs = mastery ? ":" + Array.from(box.querySelectorAll(".lq-segs i")).map(i => i.className === "ok" ? "o" : i.className === "miss" ? "m" : ".").join("") : "";
    trace.push(bi + ":" + perm.join("") + ":" + (again ? "r" : "n") + ":" + (ok ? "+" : "-") + segs);
    box.querySelector("#nextBtn").click();
  }
  return { trace, result: mastery ? { total: result.total, firstTry: result.firstTry, attempts: result.attempts, missed: result.missed }
    : { score: result.score, total: result.total, pct: result.pct, missed: result.missed, correct: result.correct } };
}
const readProblems = () => {
  const q = s => Array.from(document.querySelectorAll(s));
  return { due: q("#pdDue > [data-due]").map(e => e.dataset.due + ":" + e.dataset.id), n: +document.querySelector(".pd-count").textContent,
    soon: q(".pd-soon [data-soon]").map(e => e.dataset.soon + ":" + e.dataset.id) };
};
const readExams = () => {
  const t = (e, s) => { const x = e.querySelector(s); return x ? x.textContent : ""; }, rows = [];
  const hero = document.querySelector(".ex-hero");
  if (hero) rows.push(["hero", hero.querySelector(".ex-sit").getAttribute("href"), t(hero, ".at-gate"), t(hero, ".ex-facts span"), t(hero, ".at-days b")]);
  document.querySelectorAll(".ex-open .ex-card").forEach(c => { const p = c.querySelector(".pill");
    rows.push(["card", c.getAttribute("href"), t(c, ".tl-t"), t(c, ".tl-m"), p ? p.className.replace("pill ", "") + ":" + p.textContent : ""]); });
  document.querySelectorAll(".ex-locked .ex-lock").forEach(c => rows.push(["lock", t(c, ".ex-ln"), c.querySelector(".ex-lbar").getAttribute("aria-label")]));
  return { rows, rec: t(document, ".ex-rec") };
};
async function runQuizJS(browser, fx, pure) {
  const qf = fx.quiz, out = { errors: [], sittings: {}, problems: {}, exams: {} };
  const grade = jsGrade();
  out.grade = qf.grade.qs.map(q => qf.grade.given.map(g => !!grade(q, g)));
  {
    const { ctx, page: p, errors } = await page(browser, fx.planClock, null);
    for (const f of qf.sittings) out.sittings[f.name] = await p.evaluate(driveSitting, f);
    out.errors = out.errors.concat(errors); await ctx.close();
  }
  {
    const g = qf.gate, { ctx, page: p, errors } = await page(browser, g.clock, g.state);
    const r = await p.evaluate(({ keys, all }) => { const T = window.__brickfordTest;
      return { cleared: Object.fromEntries(keys.map(k => [k, !!T.lessonCleared(k)])),
        locked: Object.fromEntries(all.map(k => { const [c, u, l] = k.split("."); return [k, !!T.lockedBy(c, +u, +l)]; })), catchUp: T.catchUpQuizzes().map(x => x.k) }; },
      { keys: g.quizKeys, all: fx.lessonKeys });
    pure.setS(clone(g.state)); pure.setToday(g.clock);
    r.grandfathered = Object.fromEntries(g.quizKeys.filter(k => g.state.lessons[k]).map(k => [k, !!pure.grandfathered(g.state.lessons[k])]));
    r.passed = Object.fromEntries(g.quizKeys.map(k => [k, !!pure.quizPassed(k)]));
    out.gate = r; out.errors = out.errors.concat(errors); await ctx.close();
  }
  for (const f of qf.evals) {
    const { ctx, page: p, errors } = await page(browser, f.clock, f.state);
    await p.evaluate(() => { location.hash = "#/workshop"; });
    await p.waitForSelector(".pd-count", { timeout: 15000 });
    const pr = await p.evaluate(readProblems);
    pr.psetDue = Object.fromEntries(qf.psetIds.map(id => [id, pr.due.includes("pset:" + id)]));
    pr.labDue = Object.fromEntries(qf.labIds.map(id => [id, pr.due.includes("lab:" + id)]));
    out.problems[f.name] = pr;
    await p.evaluate(() => { location.hash = "#/exams"; });
    await p.waitForSelector(".ex-rec", { timeout: 15000 });
    out.exams[f.name] = await p.evaluate(readExams);
    out.errors = out.errors.concat(errors); await ctx.close();
  }
  const r = qf.record;
  pure.setS({ lessons: {}, quizMisses: {}, quizAttempts: clone(r.attempts) }); pure.setToday("2026-11-04");
  out.record = { passes: [], misses: [], best: {} };
  r.passes.forEach(x => { pure.recordQuizPass(r.key, clone(x)); const q = clone(pure.getS().lessons[r.key].quiz); delete q.at; out.record.passes.push(q); });
  r.misses.forEach(m => { pure.updateMisses(m[0], m[1], m[2]); out.record.misses.push(clone(pure.getS().quizMisses[m[0]])); });
  Object.keys(r.attempts).forEach(b => { out.record.best[b] = pure.bestQuiz(b); });
  out.record.bestNone = pure.bestQuiz("none");
  return out;
}

// ---------- record fixtures (T-064 stage 5) ----------
// app.js's ledger, lifted into a VM with a scripted clock: sha256 (an IIFE, so cut out by its bounds), canon,
// logEvent, verifyChain, preimage and eventLine, all app.js's own text.
function jsLedger() {
  const src = fs.readFileSync(path.join(ROOT, "platform/js/app.js"), "utf8");
  const end = "\n  })();", i = src.indexOf("const sha256 = (function () {"), j = src.indexOf(end, i) + end.length;
  if (i < 0 || j < end.length) throw new Error("jsLedger: sha256 not found in app.js");
  const ctx = { S: { ledger: [] }, __ts: [] };
  ctx.Date = class { toISOString() { return ctx.__ts.shift(); } };
  vm.createContext(ctx);
  vm.runInContext("const save = () => {}; const syncSoon = () => {};\n" + src.slice(i, j) + "\n" +
    vmExtract(["GENESIS", "canon", "logEvent", "verifyChain", "chainHead", "preimage", "EV_LABEL", "eventLine", "fmtBHD", "numText", "revenueTotal"]) +
    "\nthis.__f = { sha256, canon, logEvent, verifyChain, chainHead, preimage, eventLine, fmtBHD, numText, revenueTotal };", ctx);
  const f = ctx.__f;
  return Object.assign({}, f, {
    build(events) { ctx.S = { ledger: [] }; events.forEach(ev => { ctx.__ts.push(ev.ts); f.logEvent(ev.type, ev.ref, ev.data); }); return clone(ctx.S.ledger); },
    setS(s) { ctx.S = s; },
  });
}
const REC_EVENTS = [
  { type: "day", ref: "2026-10-16", data: {}, ts: "2026-10-16T08:01:02.003Z" },
  { type: "lesson", ref: "math110.0.0", data: { done: true }, ts: "2026-10-16T09:00:00.000Z" },
  { type: "quiz", ref: "math110.0.0", data: { total: 5, firstTry: 4 }, ts: "2026-10-16T09:20:11.500Z" },
  { type: "quiz", ref: "math110.1.2", data: { firstTry: 0, total: 0 }, ts: "2026-10-17T09:20:11.500Z" },
  { type: "exam", ref: "calc-bank", data: { pct: 80, total: 15, score: 12 }, ts: "2026-10-18T10:00:00.000Z" },
  { type: "lab", ref: "flashcards-cli", data: { done: true }, ts: "2026-10-19T10:00:00.000Z" },
  { type: "lab", ref: "flashcards-cli", data: { done: false }, ts: "2026-10-19T10:05:00.000Z" },
  { type: "problem", ref: "Arrays|Two Sum", data: { solved: true }, ts: "2026-10-20T10:00:00.000Z" },
  { type: "problem", ref: "Arrays|Two Sum", data: { solved: false }, ts: "2026-10-20T10:01:00.000Z" },
  { type: "diagnostic", ref: "coding", data: { score: null }, ts: "2026-10-21T10:00:00.000Z" },
  { type: "diagnostic", ref: "mit-18-06", data: { score: 72 }, ts: "2026-10-21T11:00:00.000Z" },
  { type: "gate", ref: "gate1", data: { passed: true }, ts: "2026-10-22T11:00:00.000Z" },
  { type: "gate", ref: "gate1", data: { passed: false }, ts: "2026-10-22T11:30:00.000Z" },
  { type: "week", ref: "week3", data: { shipped: "a repo — دليل 🚀 \"quoted\" \\ back\ttab\n", revenue: 1149.5, posts: 3, dsa: 2 }, ts: "2026-11-08T12:00:00.000Z" },
  { type: "week", ref: "week4", data: { shipped: "", revenue: 0, posts: 0, dsa: 0 }, ts: "2026-11-15T12:00:00.000Z" },
  { type: "streak", ref: "2026-11-05", data: { was: 9, best: 14 }, ts: "2026-11-05T12:00:00.000Z" },
  { type: "streak", ref: "2026-11-06", data: { was: 0, best: 0 }, ts: "2026-11-06T12:00:00.000Z" },
  { type: "day", ref: 0, data: null, ts: "2026-11-06T12:00:01.000Z" },
  { type: "rep", ref: "story", data: { seconds: 94, z: { y: [1, 2.5, { b: null, a: "\u007f \u0000é" }], a: -0.5 } }, ts: "2026-11-06T12:01:00.000Z" },
  { type: "rep", ref: "story", data: {}, ts: "2026-11-06T12:02:00.000Z" },
  { type: "rep", ref: "humor", data: { keeper: 3 }, ts: "2026-11-06T12:03:00.000Z" },
  { type: "rep", ref: "humor", data: { keeper: 0 }, ts: "2026-11-06T12:04:00.000Z" },
  { type: "rep", ref: "bank", data: {}, ts: "2026-11-06T12:05:00.000Z" },
  { type: "rep", ref: "review", data: {}, ts: "2026-11-06T12:06:00.000Z" },
  { type: "rep", ref: "other", data: {}, ts: "2026-11-06T12:07:00.000Z" },
  { type: "quiz", ref: "nope.0.0", data: {}, ts: "2026-11-06T12:08:00.000Z" },
  { type: "mystery", ref: "math110.99.0", data: { n: [100, 1e-7, 1.5e300, 12345678901, 0.1 + 0.2, -0, 1e21, 123456789.123456789] }, ts: "2026-11-06T12:09:00.000Z" },
];
const REC_TAMPER = [
  { name: "an entry's data edited", op: "set", i: 4, field: "data", value: { pct: 100, score: 15, total: 15 } },
  { name: "a timestamp edited", op: "set", i: 5, field: "ts", value: "2026-01-01T00:00:00.000Z" },
  { name: "a prev pointer edited", op: "set", i: 7, field: "prev", value: "brickford-genesis" },
  { name: "an entry removed", op: "drop", i: 2 },
  { name: "the last hash replaced", op: "set", i: REC_EVENTS.length - 1, field: "hash", value: "0".repeat(64) },
  { name: "two entries swapped", op: "swap", i: 8, j: 9 },
  { name: "an index edited", op: "set", i: 6, field: "i", value: 7 },
  { name: "a type edited", op: "set", i: 1, field: "type", value: "quiz" },
];
const REC_SHA = ["", "abc", "a".repeat(55), "a".repeat(56), "a".repeat(64), "a".repeat(1000), "héllo — دليل 😀"];
const REC_AMOUNTS = [0, 1, 12.5, 150, 1149.5, 1234567.891, 0.005, 0.004, 0.015, 2.675, 1.005, -2.5, -0.5, -1234.567, 99999.995, 1e6, 0.1 + 0.2, 8.125, 3.14159, 12.345, 100, 7.1];
const lessonsOn = (keys, on, more) => Object.fromEntries(keys.map(k => [k, Object.assign({ done: true, doneAt: on, notes: "", checks: [] }, more)]));

function recordFixtures(plan) {
  const L = jsLedger(), ledger = L.build(REC_EVENTS);
  const tampered = clone(ledger); tampered[2].data = { done: false };
  const days9 = range("2026-10-26", "2026-11-04").filter(d => new Date(d + "T00:00:00Z").getUTCDay() !== 6);
  const longRun = range("2026-10-16", "2026-10-22").filter(d => new Date(d + "T00:00:00Z").getUTCDay() !== 6).concat(days9);
  const k = i => plan.keys[i];
  const heat = {
    lessons: Object.assign({}, lessonsOn([k(0), k(1), k(2), k(3), k(4)], "2026-11-02"), lessonsOn([k(5), k(6), k(7)], "2026-11-03"), lessonsOn([k(8)], "2026-11-04"),
      lessonsOn([k(9), k(10)], "2026-11-01"), lessonsOn([k(16), k(17)], "2026-10-29"), lessonsOn([k(11)], "2026-10-20", { verified: true, verifiedAt: "2026-10-20" }), lessonsOn([k(12)], "2026-10-21", { verified: true })),
    problems: { "Arrays|Two Sum": "2026-11-01", "Arrays|Valid Anagram": "2026-11-01", "Stack|Min Stack": "2026-10-28", "Stack|Other": true, "Stack|None": false },
    studyDays: days9,
  };
  const wk = (week, date, shipped, extra) => Object.assign({ week, date, shipped, dsa: 1, posts: 0, revenue: 0, notes: "" }, extra);
  const entries = [{ date: "2026-10-31", amount: 50, note: "" }, { date: "2026-11-01", amount: 100.25, note: "clinic" }, { date: "2026-11-07", amount: 20, note: "a & <b>" }, { date: "2026-11-08", amount: 7, note: "" }];
  const counted = { treasury: { offer: "", clients: [], niche: "", entries }, lessons: Object.assign({}, heat.lessons, {
    [k(13)]: { done: true, verified: true, verifiedAt: "2026-11-03" }, [k(14)]: { verified: true, verifiedAt: "2026-11-08" }, [k(15)]: { verified: true, verifiedAt: "2026-11-01" } }),
    problems: heat.problems };
  const weeksSealed = [wk(3, "2026-09-27", "old start"), wk(3, "2026-11-08", "x".repeat(70) + " — tail", { dsa: 4, posts: 2, revenue: 12.5, notes: "late" }),
    wk("2", "2026-11-01", "", { dsa: 2, posts: 1, revenue: 1149.5 }), wk(1, "2026-10-25", "first", { posts: 5 })];
  const st = over => baseState(over);
  return {
    ledger: { events: REC_EVENTS, tamper: REC_TAMPER },
    sha: REC_SHA,
    weeks: [
      { name: "Wednesday: nothing sealed, an empty treasury (typed BHD)", clock: "2026-11-04", state: st({}) },
      { name: "Sunday: a counted treasury, proven lectures and DSA in the week", clock: "2026-11-08", state: st(counted) },
      { name: "Sunday: sealed, a pre-reset week 3 beside it, a long line, a string week number", clock: "2026-11-08", state: st({ weeks: weeksSealed }) },
      { name: "Monday: week 4 opens, the seal is past", clock: "2026-11-09", state: st({ weeks: weeksSealed }) },
      { name: "Wednesday before the start", clock: "2026-10-14", state: st({}) },
      { name: "the first seal Sunday (25 Oct)", clock: "2026-10-25", state: st({ problems: heat.problems }) },
      { name: "Saturday, the rest day", clock: "2026-11-07", state: st(counted) },
    ],
    seals: [
      { name: "counted treasury", clock: "2026-11-08", state: st(counted), input: { shipped: " a repo ", notes: " slow ", posts: 3, rev: null } },
      { name: "typed revenue on the first seal Sunday", clock: "2026-10-25", state: st({ problems: heat.problems }), input: { shipped: "", notes: "", posts: 0, rev: 12.5 } },
      { name: "re-sealing replaces this week's, the pre-reset one stays", clock: "2026-11-08", state: st({ weeks: weeksSealed }), input: { shipped: "again", notes: "", posts: 1, rev: 3 } },
      { name: "another week's seal is appended", clock: "2026-11-08", state: st({ weeks: [wk(2, "2026-11-01", "w2")] }), input: { shipped: "w3", notes: "n", posts: 2, rev: 0 } },
    ],
    refused: [
      { name: "Wednesday", clock: "2026-11-04", state: st({ weeks: weeksSealed }) },
      { name: "Saturday", clock: "2026-11-07", state: st({}) },
      { name: "Monday", clock: "2026-11-09", state: st({}) },
      { name: "before the start", clock: "2026-10-14", state: st({}) },
    ],
    sealDates: range(addDays(plan.start, -3), addDays(plan.start, 70)),
    streaks: [
      { name: "a run into today with a Saturday inside", clock: "2026-11-04", state: st({ studyDays: days9 }) },
      { name: "today not sealed yet", clock: "2026-11-05", state: st({ studyDays: days9 }) },
      { name: "an older, longer best behind a gap", clock: "2026-11-05", state: st({ studyDays: longRun }) },
      { name: "the Saturday rest day", clock: "2026-11-07", state: st({ studyDays: days9 }) },
      { name: "a second reset over an earlier streakFrom", clock: "2026-11-05", state: st({ studyDays: days9, settings: Object.assign(baseState().settings, { streakFrom: "2026-10-28" }) }) },
      { name: "no sealed days at all", clock: "2026-11-05", state: st({}) },
    ],
    records: [
      { name: "empty", clock: "2026-11-05", state: st({}) },
      { name: "active: a full chain, heat levels 0-4, proven lectures", clock: "2026-11-05", state: st(Object.assign({}, heat, { ledger })) },
      { name: "tampered chain on a Saturday clock", clock: "2026-11-07", state: st(Object.assign({}, heat, { ledger: tampered })) },
      { name: "three links: Genesis among the newest four", clock: "2026-11-05", state: st({ ledger: ledger.slice(0, 3), studyDays: days9 }) },
    ],
    treasury: {
      amounts: REC_AMOUNTS,
      states: [
        { name: "empty", clock: "2026-11-05", state: st({}) },
        { name: "clients only", clock: "2026-11-05", state: st({ treasury: { offer: "", niche: "", entries: [], clients: [{ name: "A", project: "p", price: 300 }, { name: "B", project: "", price: "oops" }] } }) },
        { name: "payments, junk amounts, two clients", clock: "2026-11-05", state: st({ treasury: { offer: "x", niche: "", clients: [{ name: "A", project: "p & q", price: 300 }, { name: "B", project: "", price: 1234.5 }],
          entries: [{ date: "2026-11-02", amount: 150, note: "clinic" }, { date: "2026-11-03", amount: 1137.5, note: "x & <y>" }, { date: "2026-11-04", amount: "12.345", note: "" },
            { date: "2026-11-04", amount: 0.1, note: "" }, { date: "2026-11-04", amount: 0.2, note: "" }, { date: "2026-11-05", amount: "abc", note: "junk" }, { date: "2026-11-05", amount: -40, note: "refund" }] } }) },
      ],
    },
  };
}

const readWeek = () => {
  const q = (s, r) => Array.from((r || document).querySelectorAll(s)), t = (e, s) => e.querySelector(s).textContent, rev = document.querySelector("#rvRev");
  return { w: document.querySelector("h1").textContent, tiles: q(".wk-tiles .wk-tile").map(x => { const b = x.querySelector("b"); return b ? b.textContent : null; }),
    dsa: +document.querySelector("#rvDsa").value, counted: !!rev && rev.type === "hidden", revValue: rev && rev.type === "hidden" ? +rev.value : null,
    state: document.querySelector(".wk-state").textContent,
    past: q(".wk-weeks .wk-card:not(.wk-slot)").map(c => [t(c, ".wk-h b"), t(c, ".wk-h span"), t(c, ".wk-s"), t(c, ".wk-m"), t(c, ".wk-notes")]) };
};
const readRecord = () => {
  const q = s => Array.from(document.querySelectorAll(s)), meta = q(".ghead .gh-meta").map(m => m.textContent)[1];
  return { tiles: q(".pf-tiles .at-days b").map(b => b.textContent),
    heat: q(".heat .hc").map(c => c.classList.contains("void") ? -1 : c.classList.contains("rest") ? -2 : +[...c.classList].find(k => /^l\d$/.test(k)).slice(1)),
    seals: q(".pf-seals .seal").map(s => [s.querySelector("b").textContent, s.querySelector(".seal-h").textContent]),
    chain: meta === "none yet" ? "none" : meta === "newest first" ? "ok" : meta.replace("chain broken at entry ", "broken at ") };
};
const readTreasury = () => {
  const q = (s, r) => Array.from((r || document).querySelectorAll(s)), tables = q("table");
  const rows = h => { const t = tables.find(x => x.querySelector("th") && x.querySelector("th").textContent === h); return t ? q("tbody tr", t).map(tr => q("td", tr).map(td => td.textContent).slice(0, 3)) : []; };
  return { counts: q(".onecounts b").map(b => b.textContent), rows: rows("Date"), clients: rows("Client") };
};

async function runRecordJS(browser, fx, pure) {
  const R = fx.record, out = { errors: [], ledger: {}, weeks: {}, seals: {}, streak: {}, record: {}, treasury: { states: {} } };
  const L = jsLedger();
  // ledger: the chain, its tampered forms, the preimages, the lines, sha256 vectors
  const entries = L.build(R.ledger.events);
  out.ledger = { entries, preimages: entries.map(e => L.preimage(e)), lines: entries.map(e => L.eventLine(e)), head: L.chainHead() };
  L.setS({ ledger: clone(entries) });
  const norm = v => ({ ok: v.ok, count: v.count, brokenAt: v.brokenAt == null ? null : v.brokenAt, head: v.head == null ? null : v.head });
  out.ledger.verify = norm(L.verifyChain());
  out.ledger.tamper = Object.fromEntries(R.ledger.tamper.map(t => {
    const c = clone(entries);
    if (t.op === "set") c[t.i][t.field] = clone(t.value); else if (t.op === "drop") c.splice(t.i, 1); else { const a = c[t.i]; c[t.i] = c[t.j]; c[t.j] = a; }
    const v = L.verifyChain(c);
    return [t.name, Object.assign(norm(v), { text: v.ok ? "ok" : "chain breaks at entry " + v.brokenAt + " of " + c.length })];
  }));
  out.sha = Object.fromEntries(R.sha.map(s => [s, L.sha256(s)]));
  // the Week page, the seal, the sealing dates
  for (const f of R.weeks) {
    const { ctx, page: p, errors } = await page(browser, f.clock, f.state);
    await p.evaluate(() => { location.hash = "#/review"; });
    await p.waitForSelector(".wk-state", { timeout: 15000 });
    out.weeks[f.name] = await p.evaluate(readWeek); out.errors = out.errors.concat(errors); await ctx.close();
  }
  for (const f of R.seals) {
    const { ctx, page: p, errors } = await page(browser, f.clock, f.state);
    await p.evaluate(() => { location.hash = "#/review"; });
    await p.waitForSelector("[data-act=logWeek]", { timeout: 15000 });
    await p.evaluate(i => {
      document.querySelector("#rvShipped").value = i.shipped; document.querySelector("#rvNotes").value = i.notes; document.querySelector("#rvPosts").value = String(i.posts);
      const rev = document.querySelector("#rvRev"); if (rev && rev.type !== "hidden" && i.rev != null) rev.value = String(i.rev);
    }, f.input);
    await p.click("[data-act=logWeek]");
    out.seals[f.name] = await p.evaluate(() => { const S = JSON.parse(localStorage.getItem("darhikmah_v1")); return { weeks: S.weeks, ledger: S.ledger }; });
    out.errors = out.errors.concat(errors); await ctx.close();
  }
  out.sealDates = Object.fromEntries(R.sealDates.map(d => { const w = pure.revisionWeekOf(d); return [d, { w, sealDay: pure.isSealDay(d), ready: d >= pure.revisionWeek(w).sun }]; }));
  { const { ctx, page: p, errors } = await page(browser, fx.planClock, null);
    out.revLectures = await p.evaluate(n => Array.from({ length: n }, (_, i) => window.__brickfordTest.revisionLectures(i + 1)), 6);
    out.errors = out.errors.concat(errors); await ctx.close(); }
  // the streak reset (on the Record page) and the day seal (on the dashboard)
  for (const f of R.streaks) {
    const { ctx, page: p, errors } = await page(browser, f.clock, f.state);
    const T = () => ({ streak: window.__brickfordTest.streak(), best: window.__brickfordTest.bestStreak() });
    const before = await p.evaluate(T);
    await p.evaluate(() => { window.confirm = () => true; location.hash = "#/record"; });
    await p.waitForSelector("[data-act=resetStreak]", { timeout: 15000 });
    await p.click("[data-act=resetStreak]");
    const afterReset = await p.evaluate(() => { const S = JSON.parse(localStorage.getItem("darhikmah_v1")), T = window.__brickfordTest;
      return { streakFrom: S.settings.streakFrom, streak: T.streak(), best: T.bestStreak(), ledger: S.ledger }; });
    await p.evaluate(() => { location.hash = "#/"; });
    await p.waitForSelector("[data-act=resetStreak]", { state: "detached", timeout: 15000 });
    await p.waitForTimeout(100);
    if (await p.evaluate(() => !!document.querySelector("[data-act=studied]"))) await p.click("[data-act=studied]");
    const after = await p.evaluate(() => { const S = JSON.parse(localStorage.getItem("darhikmah_v1")), T = window.__brickfordTest;
      return { studyDays: S.studyDays, streak: T.streak(), best: T.bestStreak(), ledger: S.ledger }; });
    out.streak[f.name] = { before, afterReset, after }; out.errors = out.errors.concat(errors); await ctx.close();
  }
  // the Record page
  for (const f of R.records) {
    const { ctx, page: p, errors } = await page(browser, f.clock, f.state);
    await p.evaluate(() => { location.hash = "#/record"; });
    await p.waitForSelector(".pf-tiles", { timeout: 15000 });
    out.record[f.name] = await p.evaluate(readRecord); out.errors = out.errors.concat(errors); await ctx.close();
  }
  // the Treasury: fmtBHD / numText / revenueTotal lifted, the page rendered
  out.treasury.amounts = R.treasury.amounts.map(v => [L.fmtBHD(v), L.numText(v), Math.round(v)]);
  for (const f of R.treasury.states) {
    L.setS(clone(Object.assign({ ledger: [] }, f.state)));
    const { ctx, page: p, errors } = await page(browser, f.clock, f.state);
    await p.evaluate(() => { location.hash = "#/treasury"; });
    await p.waitForSelector("#trOffer", { timeout: 15000 });
    const pg = await p.evaluate(readTreasury);
    out.treasury.states[f.name] = { total: L.revenueTotal(), totalText: String(Math.round(L.revenueTotal())), counts: pg.counts, rows: pg.rows, clients: pg.clients };
    out.errors = out.errors.concat(errors); await ctx.close();
  }
  return out;
}

// ---------- Atlas, Recall, Drill, Electives fixtures (T-064 stage 6a) ----------
// The Atlas and the course pages are read from app.js's rendered #/atlas and #/course/<id> (so the route, the
// gates, which courses are running and the unit counts are measured end to end), against Dart's AtlasData and
// unitCounts. Reach: every branch the plants break must be hit by some fixture.
function learnFixtures(plan) {
  const st = over => baseState(over), F = plan.flat;
  const provenLessons = Object.assign({},
    lessonsOn(F.math110.slice(0, 6), "2026-10-20", { verified: true, verifiedAt: "2026-10-21" }),   // proven
    lessonsOn(F.math110.slice(6, 10), "2026-10-22"),                                                // watched, not proven
    lessonsOn(F.ai200.slice(0, 3), "2026-10-22", { verified: true, verifiedAt: "2026-10-23" }), lessonsOn(F.ai200.slice(3, 4), "2026-10-24"));
  const proven = st({
    lessons: provenLessons,
    gates: { 1: { date: "2026-10-30", at: "2026-10-30T09:00:00.000Z", passed: true } },
    quizAttempts: { "linear-algebra": [{ date: "2026-10-25", score: 11, total: 15, pct: 73 }, { date: "2026-10-28", score: 13, total: 15, pct: 87 }], dsa: [{ date: "2026-11-01", score: 9, total: 15, pct: 60 }] },
    problems: { "Arrays & Hashing|Two Sum": "2026-10-27", "Arrays & Hashing|Valid Anagram": "2026-10-28", "Stack|Min Stack": true, "Stack|Other": false },
  });
  const late = {};
  ["math110", "math120", "math130", "ai200", "ai210"].forEach(cid => F[cid].forEach(k => { late[k] = { done: true, doneAt: "2026-10-20", notes: "", checks: [], verified: true, verifiedAt: "2026-10-21" }; }));
  const aheadL = {};
  F.math110.slice(0, 30).forEach(k => { aheadL[k] = { done: true, doneAt: "2026-10-17", notes: "", checks: [] }; });
  F.ai200.slice(0, 12).forEach(k => { aheadL[k] = { done: true, doneAt: "2026-10-18", notes: "", checks: [] }; });
  const g = (date, at) => ({ date, at: at || date + "T09:00:00.000Z", passed: true });
  const atlas = [
    { name: "before the start", clock: "2026-09-20", state: st({}) },
    { name: "a Saturday, the first rest day", clock: "2026-10-10", state: st({}) },
    { name: "day 17, nothing done", clock: "2026-11-04", state: st({}) },
    { name: "proven and watched lectures, gate 1 passed, exams, DSA", clock: "2026-11-04", state: proven },
    { name: "worked ahead", clock: "2026-10-20", state: st({ lessons: aheadL }) },
    { name: "phase 2, gates 1 and 2 passed", clock: plan.d300, state: st({ lessons: late, gates: { 1: g("2026-12-20"), 2: g("2027-03-15") }, studyDays: ["2027-06-01"] }) },
    { name: "every gate passed (object, legacy date, legacy true)", clock: "2029-05-01", state: st({ gates: { 1: g("2026-12-20"), 2: "2027-03-15", 3: true, 4: g("2028-01-10"), 5: g("2029-04-20") } }) },
  ];
  return { atlas, courseFixtures: [3, 4, 5] };
}

async function runLearnJS(browser, fx) {
  const out = { errors: [], atlas: {}, units: {} };
  const L = fx.learn;
  const readAtlas = () => {
    const t = (el, sel) => { const e = el.querySelector(sel); return e ? e.textContent.trim() : null; };
    const rt = document.querySelector(".rt"), pin = document.querySelector(".rt-pin"), nx = document.querySelector(".at-next");
    const chips = [...document.querySelectorAll(".at-chip")], later = [...document.querySelectorAll(".ghead")].find(h => h.textContent.startsWith("Opens later"));
    return {
      sub: t(document, ".page-head .sub"), base: t(document, ".at-base"),
      nodes: [...document.querySelectorAll(".rt-node")].map(li => [t(li, ".rt-lab b"), t(li, ".rt-lab span"), ["done", "next", "past", "cur"].filter(c => li.classList.contains(c)).join(" ")]),
      pin: pin.textContent.trim(), pinEnd: pin.classList.contains("end"), fill: rt.style.getPropertyValue("--fill").trim(), f: rt.style.getPropertyValue("--f").trim(),
      next: nx && nx.querySelector(".at-k") ? { k: t(nx, ".at-k"), gate: t(nx, ".at-gate"), reqs: [...nx.querySelectorAll(".at-req")].map(e => e.textContent.trim()), days: t(nx, ".at-days b") } : null,
      tiles: [...document.querySelectorAll(".at-tile")].map(a => [a.getAttribute("href").replace("#/course/", ""), t(a, ".tl-code"), t(a, ".tl-t"), t(a, ".tl-m"), t(a, ".tl-pct")]),
      chips: chips.filter(c => !c.classList.contains("more")).map(c => c.textContent.trim()), more: (chips.find(c => c.classList.contains("more")) || { textContent: "" }).textContent.trim(),
      laterN: later ? t(later, ".gh-meta") : null,
    };
  };
  for (const f of L.atlas) {
    const { ctx, page: p, errors } = await page(browser, f.clock, f.state);
    await p.evaluate(() => { location.hash = "#/atlas"; });
    await p.waitForSelector(".rt-node", { timeout: 15000 });
    out.atlas[f.name] = await p.evaluate(readAtlas);
    if (L.courseFixtures.includes(L.atlas.indexOf(f))) {
      const units = {};
      for (const c of L.courses.filter(c => !c.tracker)) {
        await p.evaluate(h => { location.hash = h; }, "#/course/" + c.id);
        await p.waitForFunction(code => ((document.querySelector(".page-head .kicker") || {}).textContent || "").startsWith(code), c.code, { timeout: 15000 });
        units[c.id] = await p.evaluate(() => [...document.querySelectorAll("details.unit")].map(d => [d.querySelector(".u-name").textContent, d.querySelector(".pill").textContent]));
      }
      out.units[f.name] = units;
    }
    out.errors = out.errors.concat(errors); await ctx.close();
  }
  return out;
}

// ---------- the two engines ----------
async function runJS(browser, fx) {
  const out = { fixtures: {} };
  const pure = jsPure(fx.START);
  {
    const { ctx, page: p, errors } = await page(browser, fx.planClock, null);
    out.plan = await p.evaluate(fx => {
      const T = window.__brickfordTest;
      return {
        START_DATE: window.DAR.START_DATE, REST_DOW: T.REST_DOW, QUIZ_GATE_FROM: T.QUIZ_GATE_FROM,
        MONK: { from: T.MONK.from, days: T.MONK.days }, MONK_PRI: null,
        dateForStudy: Array.from({ length: fx.studyN }, (_, i) => T.dateForStudy(i)),
        studyIndex: fx.dates.map(d => T.studyIndex(d)), prevStudyDay: null,
        addStudyDays: fx.addStudy.map(([d, n]) => T.addStudyDays(d, n)),
        revisionWeek: Array.from({ length: fx.revisionWeeks }, (_, i) => { const w = T.revisionWeek(i + 1); return w.from + ".." + w.to + "@" + w.sun; }),
        monkDay: fx.dates.map(d => T.monkDay(d)),
        monkScore: fx.monkDays.map(d => { const s = T.monkScore(d); return [s.done, s.n, s.pct]; }),
      };
    }, fx);
    out.plan.MONK_PRI = pure.MONK_PRI.map(p => p[0]);
    out.plan.prevStudyDay = fx.dates.map(d => pure.prevStudyDay(d));
    out.errors = errors.slice();
    await ctx.close();
  }
  for (const f of fx.fixtures) {
    const { ctx, page: p, errors } = await page(browser, f.clock, f.state);
    const fixed = await p.evaluate(({ dates, keys, schedSrc }) => {
      const T = window.__brickfordTest, schedKey = eval(schedSrc);
      return {
        studyAnchor: null,
        sched: dates.map(d => schedKey(T.scheduledFor(d))),
        status: dates.map(d => T.dayStatus(d)),
        cleared: Object.fromEntries(keys.map(k => [k, T.lessonCleared(k)])),
        grandfathered: null,
        streak: T.streak(), bestStreak: T.bestStreak(), backlogCount: T.backlogCount(),
      };
    }, { dates: fx.dates, keys: fx.lessonKeys, schedSrc: schedKey.toString() });
    pure.setToday(f.clock);
    fixed.studyAnchor = pure.studyAnchor();
    const lessons = (f.state && f.state.lessons) || {};
    fixed.grandfathered = Object.fromEntries(fx.lessonKeys.filter(k => lessons[k] && typeof lessons[k] === "object").map(k => [k, pure.grandfathered(lessons[k])]));
    const walk = { anchor: [], today: [], streak: [], backlog: [] };
    for (const t of f.walk) {
      await p.clock.setFixedTime(noon(t));
      const r = await p.evaluate(schedSrc => {
        const T = window.__brickfordTest, schedKey = eval(schedSrc);
        const now = new Date(), iso = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
        return { iso, today: schedKey(T.scheduledFor(iso)), streak: T.streak(), backlog: T.backlogCount() };
      }, schedKey.toString());
      if (r.iso !== t) throw new Error("the page clock reads " + r.iso + ", wanted " + t);
      pure.setToday(t);
      walk.anchor.push(pure.studyAnchor()); walk.today.push(r.today); walk.streak.push(r.streak); walk.backlog.push(r.backlog);
    }
    out.fixtures[f.name] = { fixed, walk };
    out.errors = out.errors.concat(errors);
    await ctx.close();
  }
  return out;
}

// The calendar block: each fixture's state under each calendar clock, read through the hook.
async function runCalendarJS(browser, fx) {
  const out = {};
  for (const f of fx.fixtures) {
    for (const clock of fx.calendar.clocks) {
      const { ctx, page: p, errors } = await page(browser, clock, f.state);
      out[f.name + " @ " + clock] = await p.evaluate(({ dates, schedSrc }) => {
        const T = window.__brickfordTest, schedKey = eval(schedSrc);
        return {
          status: dates.map(d => T.dayStatus(d)),
          sched: dates.map(d => schedKey(T.scheduledFor(d))),
          gates: T.gatePlan().map(g => g.n + ":" + g.target + ":" + (g.doneDate || "")),
        };
      }, { dates: fx.calendar.dates, schedSrc: schedKey.toString() });
      if (errors.length) throw new Error("app.js page errors under " + clock + ": " + errors.slice(0, 2).join(" | "));
      await ctx.close();
    }
  }
  return out;
}

function runDart(fxFile, dataDir, engineRoot) {
  const tool = path.join(engineRoot, "tool/engine_dump.dart");
  const res = spawnSync(DART, ["run", tool, dataDir, fxFile], { encoding: "utf8", maxBuffer: 1 << 30, cwd: ROOT });
  if (res.status !== 0) throw new Error("engine_dump.dart failed (" + res.status + "):\n" + (res.stderr || res.stdout).slice(0, 3000));
  return JSON.parse(res.stdout);
}

// Every leaf that differs, as "path: js X, dart Y", the first few of each kind.
function diff(a, b, at, out, label) {
  if (out.length > 400) return;
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) { a.forEach((x, i) => diff(x, b[i], at.concat(label ? label(at, i) : i), out, label)); return; }
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    const ks = new Set(Object.keys(a).concat(Object.keys(b)));
    ks.forEach(k => diff(a[k], b[k], at.concat(k), out, label));
    return;
  }
  if (JSON.stringify(a) !== JSON.stringify(b)) out.push(at.join(" / ") + ": js " + JSON.stringify(a) + ", dart " + JSON.stringify(b));
}

// ---------- the gate ----------
(async () => {
  const t0 = Date.now();
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "verify-app-"));
  let dataDir = exporter.OUT, engineRoot = path.join(ROOT, "app");
  console.log("verify-app" + (argPlant ? " — PLANT " + argPlant : ""));

  if (argPlant === "stale-json") {
    dataDir = path.join(scratch, "data");
    fs.cpSync(exporter.OUT, dataDir, { recursive: true });
    const p = path.join(dataDir, "courses.json"), c = JSON.parse(fs.readFileSync(p, "utf8"));
    c[0].units[0].lessons[0].min += 60;           // MATH 110's first lecture an hour longer: re-packs the Theory windows
    fs.writeFileSync(p, JSON.stringify(c, null, 1) + "\n");
  }
  if (argPlant === "rest-status") {
    engineRoot = path.join(scratch, "app");
    fs.cpSync(path.join(ROOT, "app/lib/engine"), path.join(engineRoot, "lib/engine"), { recursive: true });
    fs.cpSync(path.join(ROOT, "app/tool"), path.join(engineRoot, "tool"), { recursive: true });
    const p = path.join(engineRoot, "lib/engine/engine.dart"), src = fs.readFileSync(p, "utf8");
    const was = "if (isRestDay(iso) && ge(iso, START_DATE)) return 'rest';";
    const planted = src.replace(was, "if (isRestDay(iso) && ge(iso, START_DATE) && !lt(iso, today)) return 'rest';");
    if (planted === src) throw new Error("plant rest-status: the rest line of dayStatus not found in engine.dart");
    fs.writeFileSync(p, planted);
  }
  // The light plants: one changed line in the Dart merge or the Dart prayer-time method.
  const PLANT_EDITS = {
    "merge-weeks": ["lib/engine/merge.dart", "side(x) == side(w)", "true"],                                   // the revisionWeek.from rule gone
    "merge-streak": ["lib/engine/merge.dart", "_js(rf).compareTo(_s(e.settings['streakFrom'])) > 0", "_js(rf).compareTo(_s(e.settings['streakFrom'])) < 0"],   // the earlier date wins
    "monk-times": ["lib/engine/engine.dart", "isha: 14,", "isha: 15,"],                                      // Isha at 15 degrees, not 14
    "quiz-pass-mark": ["lib/engine/quiz.dart", "const examPassAt = 70;", "const examPassAt = 75;"],            // a bank's pass mark, 70 -> 75
    "quiz-gate": ["lib/engine/engine.dart", "fw != null && lt(fw, QUIZ_GATE_FROM);", "fw != null && le(fw, QUIZ_GATE_FROM);"],   // the gate day itself counts as before the gate
    "ledger-hash": ["lib/engine/record.dart", "final keys = [for (final k in v.keys) '$k']..sort();", "final keys = [for (final k in v.keys) '$k'];"],   // canon no longer sorts keys: the chain hash differs from the web app's
    "seal-guard": ["lib/engine/record.dart", "return ge(t, revisionWeek(revisionWeekOf(t)).sun);", "return ge(t, revisionWeek(revisionWeekOf(t)).from);"],   // the seal opens on the week's first day, not its Sunday
    "treasury-sum": ["lib/engine/record.dart", "(a, e) => a + (e is Map ? jsOr0(e['amount']) : 0))", "(a, e) => a + (e is Map ? jsOr0(e['amount']).floorToDouble() : 0))"],   // every payment loses its cents
    "atlas-count": ["lib/engine/learn.dart", "tracker ? dsaCount() : st!.verified,", "tracker ? dsaCount() : st!.done,"],   // a tile counts the lectures watched as proven
    "pset-due": ["lib/engine/problems.dart", "lessonCleared('${i['after']}') && !truthy(_m(S['psets'])[i['id']]);", "lessonCleared('${i['after']}');"],   // a ticked pset stays due
  };
  if (PLANT_EDITS[argPlant]) {
    const [file, was, now] = PLANT_EDITS[argPlant];
    engineRoot = path.join(scratch, "app");
    fs.cpSync(path.join(ROOT, "app/lib/engine"), path.join(engineRoot, "lib/engine"), { recursive: true });
    fs.cpSync(path.join(ROOT, "app/tool"), path.join(engineRoot, "tool"), { recursive: true });
    const pf = path.join(engineRoot, file), src = fs.readFileSync(pf, "utf8");
    if (!src.includes(was)) throw new Error("plant " + argPlant + ": `" + was + "` not found in " + file);
    fs.writeFileSync(pf, src.replace(was, now));
  }
  if (argPlant === "rest-dow") {
    engineRoot = path.join(scratch, "app");
    fs.cpSync(path.join(ROOT, "app/lib/engine"), path.join(engineRoot, "lib/engine"), { recursive: true });
    fs.cpSync(path.join(ROOT, "app/tool"), path.join(engineRoot, "tool"), { recursive: true });
    const p = path.join(engineRoot, "lib/engine/engine.dart"), src = fs.readFileSync(p, "utf8");
    const planted = src.replace(/static const int REST_DOW = 6;/, "static const int REST_DOW = 5;");
    if (planted === src) throw new Error("plant rest-dow: REST_DOW = 6 not found in engine.dart");
    fs.writeFileSync(p, planted);
  }

  // 1. freshness
  const stale = exporter.stale(dataDir);
  check("app/assets/data/*.json is fresh against platform/data/*.js (tools/export-data.js --check)", stale.length === 0,
    stale.length ? "stale: " + stale.join(", ") : Object.keys(exporter.build()).length + " files, byte-identical");

  // 2. parity
  const browser = await chromium.launch();
  try {
    // The plan, read from app.js: the range, the lesson keys, the days the fixtures are built from.
    const START = JSON.parse(fs.readFileSync(path.join(exporter.OUT, "meta.json"), "utf8")).START_DATE;
    const pre = await page(browser, addDays(START, -1), null);
    const plan = await pre.page.evaluate(() => {
      const T = window.__brickfordTest, D = window.DAR, flat = {}, keys = [];
      D.COURSES.forEach(c => { flat[c.id] = []; (c.units || []).forEach((u, ui) => u.lessons.forEach((_, li) => { flat[c.id].push(c.id + "." + ui + "." + li); keys.push(c.id + "." + ui + "." + li); })); });
      const dayKeys = Array.from({ length: 14 }, (_, i) => T.scheduledFor(T.dateForStudy(i)).filter(it => !it.pseudo).map(it => it.cid + "." + it.ui + "." + it.li));
      const rev = [null].concat(Array.from({ length: 7 }, (_, i) => { const w = T.revisionWeek(i + 1); return { from: w.from, to: w.to, sun: w.sun }; }));
      return { start: D.START_DATE, end: T.dateForStudy(1093), d300: T.dateForStudy(300), flat, keys, dayKeys, rev };
    });
    await pre.ctx.close();
    const LAST = addDays(plan.end, 7);
    const dates = range(plan.start, LAST);
    const fx = {
      START: plan.start, planClock: "2026-11-04", dates, studyN: 1101, lessonKeys: plan.keys,
      addStudy: [].concat(...[addDays(plan.start, -3), plan.start, addDays(plan.start, 1), "2026-11-04", "2026-11-07", "2027-01-01", plan.end, LAST]
        .map(d => [0, 1, 5, 6, 7, 30, 1094].map(n => [d, n]))),
      revisionWeeks: Math.ceil(dates.length / 7) + 1,
      monkDays: MONK_PROBES,
      fixtures: fixturesFrom(plan).map(f => Object.assign(f, { walk: dates })),
      calendar: { dates: range(CAL_FROM, CAL_TO), clocks: CAL_CLOCKS },
      light: LIGHT, merge: mergeFixtures(plan), payload: payloadFixtures(), monk: monkFixture(),
    };
    fx.quiz = quizFixtures(plan, fx.fixtures);
    fx.record = recordFixtures(plan);
    fx.learn = learnFixtures(plan);
    fx.learn.courses = JSON.parse(fs.readFileSync(path.join(exporter.OUT, "courses.json"), "utf8")).map(c => ({ id: c.id, code: c.code, tracker: !!c.tracker }));
    console.log("  plan " + plan.start + " .. day 1094 " + plan.end + ", " + dates.length + " dates to " + LAST + ", " +
      fx.fixtures.length + " fixtures, " + plan.keys.length + " lessons");
    const fxFile = path.join(scratch, "fixtures.json");
    fs.writeFileSync(fxFile, JSON.stringify(fx));

    const tDart = Date.now();
    const dart = runDart(fxFile, dataDir, engineRoot);
    console.log("  dart engine: " + Math.round((Date.now() - tDart) / 1000) + "s");
    if (!LIGHT) {
      const tJs = Date.now();
      const js = await runJS(browser, fx);
      js.calendar = await runCalendarJS(browser, fx);
      console.log("  app.js:      " + Math.round((Date.now() - tJs) / 1000) + "s");
      check("app.js ran without page errors", js.errors.length === 0, js.errors.slice(0, 3).join(" | "));

      // Name a date index by its date, so a finding reads "sched / 2026-11-05".
      const byDate = (at, i) => (["studyIndex", "prevStudyDay", "monkDay", "sched", "status", "today", "streak", "backlog", "anchor"].includes(at[at.length - 1]) ? dates[i] : i);
      const sections = [["the plan (dates, studyIndex, prevStudyDay, addStudyDays, revision weeks, monkDay, monkScore, constants)", js.plan, dart.plan]];
      fx.fixtures.forEach(f => {
        sections.push([f.name + " @ " + f.clock + ": scheduledFor + dayStatus on " + dates.length + " dates, lessonCleared, grandfathered, streak, backlog",
          js.fixtures[f.name].fixed, dart.fixtures[f.name] && dart.fixtures[f.name].fixed]);
        sections.push([f.name + ", clock walked over " + dates.length + " dates: studyAnchor, scheduledFor(today), streak, backlogCount",
          js.fixtures[f.name].walk, dart.fixtures[f.name] && dart.fixtures[f.name].walk]);
      });
      const calDates = fx.calendar.dates;
      const byCal = (at, i) => (["status", "sched"].includes(at[at.length - 1]) ? calDates[i] : i);
      fx.fixtures.forEach(f => CAL_CLOCKS.forEach(clock => {
        const k = f.name + " @ " + clock;
        sections.push(["calendar: " + k + " (" + (new Date(clock + "T00:00:00Z").getUTCDay() === 6 ? "Saturday" : "study-day") + " clock): dayStatus, scheduledFor, gatePlan on " +
          CAL_FROM + ".." + CAL_TO, js.calendar[k], dart.calendar && dart.calendar[k], byCal]);
      }));
      sections.forEach(([name, a, b, label]) => {
        const out = [];
        diff(a, b, [], out, label || byDate);
        check("parity: " + name, out.length === 0, out.length ? out.length + (out.length > 400 ? "+" : "") + " differ; " + out.slice(0, 4).join("; ") : "");
      });
      // The parity is only worth something if the fixtures reach the branches.
      const g = js.fixtures[fx.fixtures[3].name], w = js.fixtures[fx.fixtures[5].name], r = js.fixtures[fx.fixtures[4].name];
      const statuses = new Set([].concat(...Object.values(js.fixtures).map(x => x.fixed.status))), cleared = Object.values(g.fixed.cleared);
      // Worked ahead: MATH 110's 31st lecture (the first not watched) lands on a different date than the plan gives it.
      const k30 = "Theory:" + plan.flat.math110[30], at = list => list.findIndex(s => s.split(" ").some(x => x.split("@")[0] === k30));
      const reanchored = at(w.fixed.sched) >= 0 && at(w.fixed.sched) !== at(js.fixtures[fx.fixtures[0].name].fixed.sched);
      check("the fixtures reach every day status (across them), and in the gate fixture both lessonCleared answers, a streak, a backlog, re-anchored work ahead and a rest-day anchor",
        ["completed", "partial", "missed", "today", "upcoming", "rest"].every(s => statuses.has(s)) && cleared.includes(true) && cleared.includes(false) &&
        g.fixed.streak > 0 && g.fixed.backlogCount > 0 && reanchored && r.fixed.studyAnchor >= 0,
        "statuses " + [...statuses].join("/") + "; streak " + g.fixed.streak + ", best " + g.fixed.bestStreak + ", backlog " + g.fixed.backlogCount +
        "; rest-day anchor " + r.fixed.studyAnchor);
      // The calendar block reaches what the calendar draws: every status, and a past Saturday on each clock.
      const calStatuses = new Set([].concat(...Object.values(js.calendar).map(x => x.status)));
      const pastSat = calDates.indexOf("2026-10-31");
      check("the calendar block reaches every day status, a past Saturday as rest on both clocks, and gate targets",
        ["completed", "partial", "missed", "today", "upcoming", "rest"].every(s => calStatuses.has(s)) &&
        CAL_CLOCKS.every(c => js.calendar[fx.fixtures[3].name + " @ " + c].status[pastSat] === "rest") &&
        Object.values(js.calendar).every(x => x.gates.length > 0),
        [...calStatuses].join("/") + "; " + Object.keys(js.calendar).length + " fixture x clock runs, " + calDates.length + " dates each");
    }

    // 5. sync: app.js's mergeState and syncPayload (lifted into a VM), the live hook's `changed` as a cross-check, and Dart.
    if (!process.env.VERIFY_ONLY) {
      const pure = jsPure(fx.START);
      const tM = Date.now();
      const jm = await runMergeJS(browser, fx, pure);
      console.log("  merge:       " + fx.merge.length + " fixtures, " + fx.payload.length + " payloads, " + Math.round((Date.now() - tM) / 1000) + "s");
      check("the merge ran in app.js without page errors", jm.errors.length === 0, jm.errors.slice(0, 3).join(" | "));
      const lifted = fx.merge.filter(f => jm.hookChanged[f.name] !== jm.merge[f.name].changed);
      check("the lifted mergeState and the live one on the test hook count the same changes on every fixture", lifted.length === 0,
        lifted.length ? lifted.map(f => f.name + ": vm " + jm.merge[f.name].changed + ", hook " + jm.hookChanged[f.name]).join("; ") : fx.merge.length + " fixtures");
      fx.merge.forEach(f => {
        const out = [];
        diff(jm.merge[f.name], dart.merge && dart.merge[f.name], [], out, (at, i) => i);
        check("parity: mergeState — " + f.name + " (" + (jm.merge[f.name].changed) + " changes)", out.length === 0, out.slice(0, 4).join("; "));
      });
      fx.payload.forEach(f => {
        const out = [];
        diff(jm.payload[f.name], dart.payload && dart.payload[f.name], [], out, (at, i) => i);
        check("parity: syncPayload — " + f.name, out.length === 0, out.slice(0, 4).join("; "));
      });
      check("the payload never carries monk, and the merge never reads a remote one",
        fx.payload.every(f => !("monk" in (jm.payload[f.name].state || {})) && !("monk" in ((dart.payload[f.name] || {}).state || {}))) &&
        JSON.stringify(jm.merge["monk: a remote monk is never read"].state.monk) === JSON.stringify(fx.merge.find(f => f.name.startsWith("monk:")).local.monk) &&
        jm.merge["monk: a remote monk is never read"].changed === 0);
      // Reach: the fixtures must exercise the branches the plants break.
      const m = jm.merge, wkN = n => (m["sealed week " + n].state.weeks || []).length;
      check("the merge fixtures reach the later-streakFrom rule, the kept-beside sealed week and the doneAt / quiz merges",
        m["streakFrom remote later wins"].state.streakFrom === "2026-11-01" && m["streakFrom remote earlier is ignored"].state.streakFrom === "2026-11-01" &&
        wkN("pre-reset local kept beside the new remote") === 2 && wkN("new local kept beside the pre-reset remote") === 2 &&
        wkN("same side: the later seal wins, the earlier is ignored") === 2 &&
        m["lessons: both watched, the earlier doneAt stands"].state.lessons.L.doneAt === "2026-10-23" &&
        m["lessons: quiz: the earlier pass, the better first-try sitting"].state.lessons.L.quiz.passedAt === "2026-10-25" &&
        m["two devices that diverge"].changed > 20,
        "diverge: " + m["two devices that diverge"].changed + " changes");
    }

    // 6. monk: the prayer times, the day plan, the sums and the focus
    if (!process.env.VERIFY_ONLY) {
      const pure = jsPure(fx.START);
      const jk = await runMonkJS(browser, fx, pure);
      check("the monk block ran in app.js without page errors", jk.errors.length === 0, jk.errors.slice(0, 3).join(" | "));
      const raw = [];
      for (const [d, t] of Object.entries(jk.raw)) for (const [k, v] of Object.entries(t)) {
        const dv = dart.monk && dart.monk.times[d] && dart.monk.times[d].raw[k];
        if (typeof dv !== "number" || Math.abs(dv - v) > 1e-6 || Math.round(dv) !== Math.round(v)) raw.push(d + " " + k + ": js " + v + ", dart " + dv);
      }
      check("parity: monkPrayerTimes minutes (raw to 1e-6 and rounded) — " + MONK_DATES.length + " dates x 6 times", raw.length === 0, raw.slice(0, 4).join("; "));
      const dm = dart.monk || {};
      const dOut = { times: Object.fromEntries(Object.entries(dm.times || {}).map(([d, t]) => [d, { hhmm: t.hhmm }])), plan: dm.plan, slots: dm.slots, sums: dm.sums, focus: dm.focus, phoneOk: dm.phoneOk };
      for (const k of ["times", "plan", "slots", "sums", "focus", "phoneOk"]) {
        const out = [];
        diff(strip(jk.out[k]), strip(dOut[k]), [], out, (at, i) => i);
        check("parity: monk " + ({ times: "HH:MM of every prayer time", plan: "monkPlanFor (the day's blocks, in order)", slots: "monkSlots", sums: "monkWeekSums, monkMonthSums, monkWeekStart", focus: "monkFocus", phoneOk: "mkPhoneOk" })[k],
          out.length === 0, out.slice(0, 4).join("; "));
      }
      const f5 = jk.out.focus["2026-11-05"];
      check("the monk fixtures reach a focus line, a month sum and a Friday-free week", !!f5 && f5.days >= 2 && jk.out.sums["2026-11-05"].week.shorts > 0 && jk.out.sums["2026-11-08"].month.clips > 0,
        f5 ? f5.label + " " + f5.rate + "% over " + f5.days + " days" : "no focus");
    }

    // 7. quiz, Problems, Exams
    if (!process.env.VERIFY_ONLY) {
      const pure = jsPure(fx.START);
      const tQ = Date.now();
      const jq = await runQuizJS(browser, fx, pure);
      console.log("  quiz:        " + fx.quiz.sittings.length + " sittings, " + fx.quiz.evals.length + " Problems/Exams pages, " + Math.round((Date.now() - tQ) / 1000) + "s");
      check("the quiz block ran in app.js without page errors", jq.errors.length === 0, jq.errors.slice(0, 3).join(" | "));
      const dq = dart.quiz || {}, idx = (at, i) => i, one = (name, a, b, label) => { const out = []; diff(a, b, [], out, label || idx); check(name, out.length === 0, out.slice(0, 4).join("; ")); };
      one("parity: grading — gradeAnswer against quiz-engine.js grade() over " + GRADE_QS.length + " questions x " + GRADE_GIVEN.length + " answers (the comma, the tolerance, parseFloat's prefix)", jq.grade, dq.grade);
      for (const f of fx.quiz.sittings) one("parity: sitting — " + f.name + " (" + jq.sittings[f.name].trace.length + " questions shown: draw, option order, outcome, result)", jq.sittings[f.name], dq.sittings && dq.sittings[f.name]);
      one("parity: the gate — lessonCleared, grandfathered, quizPassed on " + fx.quiz.gate.quizKeys.length + " lectures, lockedBy on all " + fx.lessonKeys.length + ", catchUpQuizzes", jq.gate, dq.gate);
      one("parity: recordQuizPass (a pass kept, a worse sitting ignored, a better one kept), updateMisses, bestQuiz", jq.record, dq.record);
      for (const f of fx.quiz.evals) {
        one("parity: problemsDue — " + f.name + " (" + jq.problems[f.name].n + " due: quizzes, catch-up, psets, labs, review; the next three locked; psetDue and labDue per item)", jq.problems[f.name],
          dq.problems && dq.problems[f.name] && { due: dq.problems[f.name].due, n: dq.problems[f.name].n, soon: dq.problems[f.name].soon, psetDue: dq.problems[f.name].psetDue, labDue: dq.problems[f.name].labDue });
        one("parity: Exams — " + f.name + " (" + jq.exams[f.name].rows.length + " rows: hero, open, locked, verdicts)", jq.exams[f.name], dq.exams && dq.exams[f.name]);
      }
      // Reach: the fixtures must hit what the plants break.
      const traces = [].concat(...Object.values(jq.sittings).map(x => x.trace)), prob = Object.values(jq.problems), ex = Object.values(jq.exams);
      const kinds = new Set([].concat(...prob.map(x => x.due.map(d => d.split(":")[0]))));
      const tags = new Set([].concat(...ex.map(x => x.rows.filter(r => r[0] === "card").map(r => r[4]))));
      const mixP = jq.problems["problems: owed, catch-up, due and ticked psets and labs"], exM = jq.exams["exams: sat, boundary scores, a gate-less diagnostic with a score"];
      check("the quiz fixtures reach a miss that comes back, a decimal comma, a wrong bank answer, and a lecture quiz that cost attempts",
        traces.some(t => t.includes(":r:")) && traces.some(t => t.includes(":n:-")) && Object.values(jq.sittings).some(x => x.result.attempts > x.result.total) &&
        jq.grade[2][GRADE_GIVEN.indexOf("2,5")] === true && jq.grade[1][GRADE_GIVEN.indexOf("5abc")] === true && jq.grade[1][GRADE_GIVEN.indexOf("abc")] === false,
        traces.length + " questions shown");
      check("the Problems fixtures reach every kind of row, a pset ticked and so not due, a lab not yet in its phase, and the next locked items",
        ["quiz", "catchup", "pset", "lab", "review"].every(k => kinds.has(k)) && mixP.psetDue["1806-ps1"] === false && mixP.psetDue["1806-ps2"] === true &&
        prob.every(x => x.soon.length > 0 || x.n > 0) && Object.values(jq.problems).some(x => Object.values(x.labDue).some(v => !v)), [...kinds].join("/") + "; " + mixP.due.length + " due in the mix");
      check("the Exams fixtures reach a pass at 70, a gap at 69, a logged diagnostic, locked banks, and a hero with days to the gate",
        exM.rows.some(r => r[0] === "card" && r[4] === "good:70%") && exM.rows.some(r => r[0] === "card" && r[4] === "crimson:69%") && tags.has("good:done") &&
        ex.some(x => x.rows.some(r => r[0] === "lock")) && ex.some(x => x.rows[0][4] !== "") && ex.some(x => x.rows[0][4] === ""), [...tags].join(", "));
    }

    // 8. record: the ledger chain, the Week page and the seal, the streak reset, the Record page, the Treasury
    if (!process.env.VERIFY_ONLY) {
      const pure = jsPure(fx.START);
      const tR = Date.now();
      const jr = await runRecordJS(browser, fx, pure);
      console.log("  record:      " + fx.record.ledger.events.length + " ledger events, " + fx.record.weeks.length + " week pages, " + fx.record.seals.length + " seals, " + fx.record.streaks.length + " streaks, " +
        fx.record.records.length + " record pages, " + fx.record.treasury.states.length + " treasuries, " + Math.round((Date.now() - tR) / 1000) + "s");
      check("the record block ran in app.js without page errors", jr.errors.length === 0, jr.errors.slice(0, 3).join(" | "));
      const dr = dart.record || {}, idx = (at, i) => i, one = (name, a, b, label) => { const out = []; diff(a, b, [], out, label || idx); check(name, out.length === 0, out.slice(0, 4).join("; ")); };
      const dl = dr.ledger || {};
      one("parity: the hash chain — logEvent over " + fx.record.ledger.events.length + " events (every field of every entry, so every hash and prev), byte for byte with app.js's sha256 and canon", jr.ledger.entries, dl.entries);
      one("parity: the preimage of every entry (the exact bytes hashed), the head hash and verifyChain", { p: jr.ledger.preimages, head: jr.ledger.head, v: jr.ledger.verify }, { p: dl.preimages, head: dl.head, v: dl.verify });
      one("parity: sha256 on " + fx.record.sha.length + " vectors (padding at 55/56/64 bytes, UTF-8, a long message)", jr.sha, dr.sha);
      one("parity: eventLine for every kind of entry", jr.ledger.lines, dl.lines);
      one("parity: a tampered chain breaks where verifyChain says, and the record-file check names the same entry — " + fx.record.ledger.tamper.length + " tamperings", jr.ledger.tamper, dl.tamper, (at, i) => i);
      for (const f of fx.record.weeks) one("parity: Week page — " + f.name + " (" + jr.weeks[f.name].state + ")", jr.weeks[f.name], dr.weeks && dr.weeks[f.name]);
      for (const f of fx.record.seals) one("parity: sealing the week — " + f.name + " (S.weeks and the week event, hash included)", jr.seals[f.name], dr.seals && dr.seals[f.name]);
      one("parity: revisionWeekOf, isSealDay and the Sunday guard on " + fx.record.sealDates.length + " dates", jr.sealDates, dr.sealDates);
      one("parity: revisionLectures for the " + jr.revLectures.length + " revision PDFs", jr.revLectures, dr.revLectures);
      const refused = dr.refused || {}, sealDates = jr.sealDates;
      check("the seal is refused off its Sunday: nothing is written on a Wednesday, Saturday, Monday or before the start", fx.record.refused.every(f => refused[f.name] && refused[f.name].sealed === false &&
        refused[f.name].ledger.length === 0 && JSON.stringify(refused[f.name].weeks) === JSON.stringify(f.state.weeks)), Object.keys(refused).map(k => k + "=" + refused[k].sealed).join(", "));
      check("the guard opens exactly on the Sundays that seal (and only there)", Object.entries(sealDates).every(([d, x]) => (new Date(d + "T00:00:00Z").getUTCDay() === 0 && x.sealDay) === x.ready) &&
        Object.entries(sealDates).filter(([, x]) => x.ready).length >= 9 && Object.keys(dr.sealDates || {}).every(d => dr.sealDates[d].ready === sealDates[d].ready),
        Object.entries(sealDates).filter(([, x]) => x.ready).length + " Sundays open");
      for (const f of fx.record.streaks) one("parity: streak reset and day seal — " + f.name + " (streak " + jr.streak[f.name].before.streak + " -> " + jr.streak[f.name].afterReset.streak + " -> " + jr.streak[f.name].after.streak + ", best " + jr.streak[f.name].before.best + ")",
        jr.streak[f.name], dr.streak && dr.streak[f.name]);
      for (const f of fx.record.records) one("parity: Record page — " + f.name + " (tiles " + jr.record[f.name].tiles.join("/") + ", chain " + jr.record[f.name].chain + ")", jr.record[f.name], dr.record && dr.record[f.name]);
      one("parity: fmtBHD, numText and Math.round on " + fx.record.treasury.amounts.length + " amounts (halves, thirds, groups, negatives)", jr.treasury.amounts, dr.treasury && dr.treasury.amounts);
      for (const f of fx.record.treasury.states) one("parity: Treasury — " + f.name + " (total " + jr.treasury.states[f.name].total + ")", jr.treasury.states[f.name], dr.treasury && dr.treasury.states && dr.treasury.states[f.name]);
      // Reach: the fixtures must hit what the plants break.
      const jl = jr.ledger, w2 = jr.weeks["Sunday: sealed, a pre-reset week 3 beside it, a long line, a string week number"], rc = jr.record["active: a full chain, heat levels 0-4, proven lectures"];
      check("the record fixtures reach unsorted keys with unicode, a re-seal beside a pre-reset week, every heat level, a broken chain, Genesis, a streak reset and a counted week",
        jl.entries.some(e => JSON.stringify(Object.keys(e.data)) !== JSON.stringify(Object.keys(e.data).sort()) && Object.keys(e.data).length > 1) &&
        jl.entries.some(e => /[^\x00-\x7f]/.test(JSON.stringify(e.data))) && w2.past.length === 4 && w2.past[1][2].length === 60 &&
        [0, 1, 2, 3, 4].every(l => rc.heat.includes(l)) && rc.heat.includes(-1) && rc.heat.includes(-2) &&
        Object.values(jr.ledger.tamper).every(t => !t.ok) && jr.record["tampered chain on a Saturday clock"].chain === "broken at 2" &&
        jr.record["three links: Genesis among the newest four"].seals.some(s => s[0] === "Genesis") &&
        Object.values(jr.streak).some(x => x.before.streak > 0 && x.afterReset.streak === 0 && x.after.best >= x.before.best) &&
        jr.weeks["Sunday: a counted treasury, proven lectures and DSA in the week"].counted === true && jr.weeks["Sunday: a counted treasury, proven lectures and DSA in the week"].tiles[3] === "120.25" &&
        jr.weeks["Wednesday: nothing sealed, an empty treasury (typed BHD)"].counted === false,
        jl.entries.length + " links; week 3 earned " + jr.weeks["Sunday: a counted treasury, proven lectures and DSA in the week"].tiles[3]);
    }

    // 9. Atlas, Recall, Drill, Electives (stage 6a)
    {
      const tL = Date.now();
      const jl = await runLearnJS(browser, fx);
      console.log("  learn:       " + fx.learn.atlas.length + " Atlas pages, " + Math.round((Date.now() - tL) / 1000) + "s");
      check("the Atlas block ran in app.js without page errors", jl.errors.length === 0, jl.errors.slice(0, 3).join(" | "));
      const dl = dart.learn || {}, idx = (at, i) => i, one = (name, a, b) => { const out = []; diff(a, b, [], out, idx); check(name, out.length === 0, out.slice(0, 4).join("; ")); };
      for (const f of fx.learn.atlas) one("parity: Atlas — " + f.name + " (" + jl.atlas[f.name].tiles.length + " running, " + jl.atlas[f.name].laterN + " later; route, next gate, fill, tiles' proven counts and mastery)", jl.atlas[f.name], dl.atlas && dl.atlas[f.name]);
      for (const name of Object.keys(jl.units)) one("parity: unit counts on every course page — " + name + " (" + Object.values(jl.units[name]).reduce((a, u) => a + u.length, 0) + " units)", jl.units[name], dl.units && dl.units[name]);
      // Reach: the fixtures must hit what the plants break.
      const A = jl.atlas, pv = A["proven and watched lectures, gate 1 passed, exams, DSA"], all = A["every gate passed (object, legacy date, legacy true)"];
      check("the Atlas fixtures reach a passed gate, all gates passed, a pre-start pin, proven below watched (a count that differs), a best exam in the mastery, DSA on the tracker, and later chips with +N",
        pv.nodes[1][2].includes("done") && all.next === null && A["before the start"].pin.startsWith("Starts ") && pv.tiles.some(t => /^[1-9]\d* of \d+ proven$/.test(t[3])) &&
        pv.tiles.some(t => t[3] === "3 of 150 problems") && pv.tiles.some(t => t[4] !== "0%") && pv.more.startsWith("+") && A["worked ahead"].tiles.length >= pv.tiles.length &&
        Object.values(jl.units).every(u => Object.values(u).some(x => x.some(y => y[1].split("/")[0] !== "0"))),
        pv.tiles.map(t => t[0] + " " + t[3] + " " + t[4]).join("; "));
    }
  } finally {
    await browser.close();
    fs.rmSync(scratch, { recursive: true, force: true });
  }

  // 3. plants (only from the gate itself, never from inside a plant)
  if (!argPlant && !process.argv.includes("--no-plants")) {
    for (const name of PLANTS) {
      const res = spawnSync(process.execPath, [__filename, "--plant", name], { encoding: "utf8", maxBuffer: 1 << 28 });
      const caught = (res.stdout.match(/^ {2}FAIL {2}.*$/gm) || []).map(l => l.replace(/^ {2}FAIL {2}/, "").split(" — ")[0]);
      check("plant " + name + " exits 1", res.status === 1,
        "exit " + res.status + (caught.length ? "; caught by: " + caught.slice(0, 3).join("; ") : "") + (res.status !== 1 && res.stderr ? "; " + res.stderr.slice(0, 400) : ""));
    }
  }

  console.log("\n" + (fails ? fails + " of " + checks + " checks FAILED" : "all " + checks + " checks passed") + " (" + Math.round((Date.now() - t0) / 1000) + "s)");
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
