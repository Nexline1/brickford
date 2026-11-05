// verify-app.js — the Flutter app (app/) against the web app it ports (T-064).
//
//   node tools/verify-app.js                 the gate: freshness, parity, then the plants
//   node tools/verify-app.js --plant NAME    one planted defect; must exit 1 (the gate runs these itself)
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
"use strict";
const fs = require("fs"), os = require("os"), path = require("path"), vm = require("vm");
const { execFileSync, spawnSync } = require("child_process");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const exporter = require("./export-data.js");

const ROOT = path.resolve(__dirname, "..");
const URL = "file://" + path.join(ROOT, "platform/index.html") + "#";
const DART = process.env.DART || (fs.existsSync("/opt/flutter/bin/dart") ? "/opt/flutter/bin/dart" : "dart");
const PLANTS = ["rest-dow", "stale-json", "rest-status", "merge-weeks", "merge-streak", "monk-times"];
const LIGHT = ["merge-weeks", "merge-streak", "monk-times"].includes(process.argv[process.argv.indexOf("--plant") + 1]);
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
function vmExtract(names) {
  const src = fs.readFileSync(path.join(ROOT, "platform/js/app.js"), "utf8");
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
    "syncPayload", "MONK_SYNCS", "mkHHMM"]);
  ctx.S = null;
  vm.runInContext("const todayISO = () => __today;\n" + code +
    "\nthis.__f = { prevStudyDay, studyAnchor, grandfathered, MONK_PRI, setToday: t => { __today = t; }, mkHHMM," +
    " mergeState, syncPayload, setS: s => { S = s; }, getS: () => S };", ctx);
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
    {
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
    {
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
  } finally {
    await browser.close();
    fs.rmSync(scratch, { recursive: true, force: true });
  }

  // 3. plants (only from the gate itself, never from inside a plant)
  if (!argPlant) {
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
