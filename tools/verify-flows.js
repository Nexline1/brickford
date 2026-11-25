// verify-flows.js — the three things a study day is made of, walked end to end.
//
// Why this exists: every other gate measures a page — its data, its contrast,
// its frame, its overflow. None of them ever pressed anything and checked that
// the day still worked. These are the three presses a day depends on:
//
//   (a) open today's session: the dashboard names the next lecture, and its
//       button opens that lecture;
//   (b) answer a quiz question: the answer registers — graded, marked, and the
//       sitting moves on;
//   (c) mark a lecture watched: the dashboard's "N / M today" count goes up.
//
// And, since T-016 (loop/specs/T-016-thumbnails-and-resume/spec.md), where a
// lecture was left off:
//
//   (d) resume: the player's time is kept when it is paused, when the route is
//       left, when the page goes away and when it is hidden (how a phone
//       mostly leaves); reopening the lecture asks the player to start there;
//       the end of the video clears it;
//   (e) a render is a read: opening the lecture and hearing 50 playing ticks
//       spread across it, with a render after each of the first 20 — every
//       render made while the player holds a time nobody has saved — write
//       nothing at all; and a pause after them writes exactly once, so the
//       zero is not blindness;
//   (f) the resume point syncs: a pull takes the later posAt per lecture,
//       whichever side wins the lecture's standing, and a push carries pos;
//   (g) under a second is not a position: opened at start=754, a buffering
//       report at 0:00 and an immediate leave keep 754 — and the one real 0,
//       a lecture that began at 0 taken back to its start, is kept;
//   (h) the player's own frame, end to end: a stub of YouTube's embed is
//       served INTO the lecture's frame, and speaks postMessage the way the
//       player does — the handshake, then a pause that saves; while a pause
//       from the top window, from a second YouTube frame, and from the
//       player's frame once it is on another origin each write nothing;
//   (i) a slow phone (once): that stub answers only after 60 hails, the old
//       cap — the page must still be asking, and resume must still work.
//
// And, since T-026b (loop/specs/T-026b-problems-exams-proof/spec.md):
//
//   (l) a lab ticked on Problems saves exactly as before the page changed
//       shape: { done: true, proof: "" } and a lab event in two saves, the
//       proof field under its row with the cursor in it and no re-render; a
//       proof stored in one save; the untick stored, logged and the field gone.
//
// And, since T-026c (loop/specs/T-026c-week-calendar-library/spec.md):
//
//   (o) Seal the week stores exactly what it stored before the page changed
//       shape: { week, date, shipped, dsa, posts, revenue, notes }, those keys
//       in that order and nothing else, in two saves, with the counted DSA and
//       BHD equal to the fixture's (worked out here from the revision week's
//       dates), the week sealed before untouched, and the chain's week event
//       as before — at 1440 and 390 in dark and light, the payments on both
//       edges of the week and on its Saturday; once with an empty ledger,
//       where BHD is typed and stored as typed; and once with a ledger that
//       has nothing in the week, where BHD is a counted 0.
//
// And, since T-028 (loop/specs/T-028-practice-recorder/spec.md), record yourself
// — in a second Chromium launched with a fake microphone
// (--use-fake-ui-for-media-stream --use-fake-device-for-media-stream; this
// file:// page is a secure context, and getUserMedia, MediaRecorder and
// IndexedDB were measured to work on it, so there is no server):
//
//   (p) at 390 (tapped) and 1280 (keyboard): Story, record, about 2s by the
//       page's own timer, stop. One clip in IndexedDB (brickford_audio/clips,
//       key <date>-1, { date, seconds >= 1, kind, title } and a non-empty
//       Blob); reps.story gains exactly one entry for today, the hand form's
//       shape, through the form's path (a rep event on the chain); no audio
//       in any localStorage key; the list shows it, play makes an <audio>
//       with a blob: src, the title renames inline (IndexedDB only), and
//       delete asks, then removes it. Opening the page, reading the list and
//       recording write nothing. The 1:30 stop, on a limit shortened through
//       window.__recLimit, on Humour: one press, it stops itself, and the rep
//       goes through the humour path. A Saturday: "Nothing owed today" above
//       the recorder, and the clip is kept (the rep path refuses a rest day);
//   (q) no microphone, at 390 and 1280: the permission denied (getUserMedia
//       stubbed to reject NotAllowedError) and no device (the plain Chromium,
//       NotFoundError). The line "Microphone not available, so log it by
//       hand" and the manual form, on Story and then Humour, and logging by
//       hand stores what it always stored.
//
// And, since T-046 (loop/specs/T-046-transcripts-v2/spec.md), record on the
// phone, transcribe on the laptop — in a third Chromium, with the fake
// microphone and --allow-file-access-from-files (a module Worker cannot be
// made from a file:// page without it). The pinned library URL is a stub
// module; GitHub is a stub (ghStub) answering the private repo only:
//
//   (r) the phone (390, tapped): a saved story is PUT once to
//       brickford-private/contents/audio/<key>.webm with the clip's own bytes,
//       the record gains remote { sha, at }; no Transcribe, question, card or
//       off line, no Worker, no import, no listing of audio/. The laptop
//       (1280): the question with the real size first, then Download, the
//       stub asked for the pinned model, revision, q8, English; the
//       transcript { text, chunks, model, at } on the IndexedDB record and in
//       no storage key and no PUT; the struck fillers, chips, words, words per
//       minute, Copy; no long task over 200ms. The desktop pull: audio/
//       listed, the raw bytes stored in the clip shape, Transcribe, consent,
//       transcript. An upload that fails: one muted line, the clip intact, no
//       retry from three renders or five seconds, one per open after. Not now
//       remembered; a kept clip transcribed on a press; no Worker, a failed
//       download, out of memory and no speech each one muted line.
//
// And, since T-023 (loop/specs/T-023-floating-tab-bar/spec.md), the tab bar:
//
//   (j) slide (once, 390px, motion on): a finger 60% of the way from Today to
//       Courses has the bubble under it within 2px; release opens /courses and
//       the bubble settles on it; past Review the bubble resists; a 40px
//       vertical drag switches nothing; tapping the active tab at scrollY 800
//       goes to 0 (and instantly under reduced motion); Today left at 600 is
//       at 600 again after Courses; and all of it makes zero save() calls. A
//       Ctrl-click on a tab (800x700, mouse), and a Ctrl- or Shift-tap with a
//       finger (390) — held from the press, or only at the release — each
//       open exactly one new page and leave this one where it was; a pen's
//       barrel-button press switches nothing.
//
// And, since T-038 (loop/specs/T-038-gates-honest/spec.md), a gate:
//
//   (m) passed on purpose: /transcript offers a pass for the next gate only;
//       it opens a confirm sheet listing the gate's requirements, and "Pass
//       gate 1" stays disabled — a press stores nothing — until every one is
//       ticked (by tap at 390, by keyboard alone at 1280); Escape and Cancel
//       store nothing; the pass is one save() of { date, at, passed: true };
//       then the unmark, offered for the last passed gate only, asks the same
//       way and is one save() of { passed: false };
//   (n) the unmark sticks (once): after a pull from a stub remote that still
//       holds the pass, the gate stays open here, the push carries the
//       unmark, and the device that still held the pass pulls the unmark.
//
// For (d), (e) and (g) the frame cannot reach YouTube, so they speak for the
// player through the test-only hook (window.__brickfordTest.playerMessage,
// present only when the page is booted on a #/__test hash), whose
// playerMessage writes through the same path a real player message does: a
// message exactly as the embed would post it, handed to the same handler
// (playerEvent). Only the origin/source filter in front of that handler is
// skipped — which is what (h) and (i) are for: no hook, real postMessage
// from a real cross-origin frame.
//
// Each flow runs in its own FRESH browser context, at a phone width and a
// desktop width, with a fixed clock (Tuesday 20 Oct 2026, a study day) and a
// seeded state. Every http(s) request is refused — there is no token, so no
// sync, and the YouTube/KaTeX CDNs are not needed for any of this — and any
// request to GitHub fails the run. The one exception is (f), which needs a
// sync to happen: it gives its own context a stub token and answers GitHub
// itself, and nothing in it leaves the machine. (h) and (i) answer the
// embed's URL with a stub page the same way; nothing reaches YouTube.
//
// T-039 (loop/specs/T-039-reload-storage-flake/spec.md): the one reload here,
// (n)'s boot pull, goes through tools/lib-reload.js. In verify-design's
// "switch (c)" a reload of this file:// page in an ephemeral context was seen
// to start, before any app script ran, without storage the old page had. So
// just before the reload a stamp is written beside the state in localStorage,
// and two things are read: whether the old page still held it when it
// unloaded (a report through a binding only the harness owns; if not, the app
// took it: measured, never retried) and whether it arrived at document start.
// Only a stamp the old page is reported to have held and the new one did not
// find discards the attempt — every reading of it, failing checks included —
// and (n) is re-measured from fresh contexts, up to 5 attempts; if all 5 lose
// it the gate fails with that reason. With no unload report the attempt is
// measured as it is, never retried (fail-closed). Whether the state arrived is
// what the checks measure; their predicates are as they were.
//
// And, since T-065 (loop/specs/T-065-monk-start/spec.md), Monk Mode's start:
//
//   (ms) before it, #/monk and the dashboard offer one Start button and no day; the sheet it opens
//       names the cost and asks for a tick; its last button must be PRESSED AND HELD 1.5 s (a click,
//       a short hold and a slide off the button start nothing; Space or Enter held works too); then
//       one write stores the day and both places read Day 1 of 21.
//
//   node tools/verify-flows.js                 # gate
//   node tools/verify-flows.js --shots <dir>   # also write a screenshot per flow
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const { acrossReload } = require("./lib-reload");
const URL = "file://" + path.join(path.resolve(__dirname, ".."), "platform/index.html") + "#";

// Plan day 14 (moved with reset seven, START 2026-10-16; was 2026-10-20 under START 2026-10-05, 2026-10-06 under 2026-09-21).
const TODAY = "2026-11-01";               // a Sunday: a study day with lectures scheduled
const WIDTHS = [390, 1280];
const shotsAt = process.argv.indexOf("--shots");
const SHOTS = shotsAt > 0 ? path.resolve(process.argv[shotsAt + 1]) : null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

let fails = 0, checks = 0, githubHits = 0;
function check(name, ok, detail) {
  checks++;
  if (!ok) fails++;
  console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : ""));
  return ok;
}

// `boot` is the first hash: "/" for the flows a reader starts from Today, and
// "/__test" for the ones that need the test hook (it is only installed when
// the page boots on a hash carrying __test).
async function fresh(browser, w, state, boot, now) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: w < 860,
  });
  await ctx.route(/^https?:/, r => {
    if (/api\.github\.com/.test(r.request().url())) githubHits++;
    return r.abort();
  });
  await ctx.clock.setFixedTime(new Date((now || TODAY) + "T12:00:00Z"));
  if (state) await ctx.addInitScript(s => { if (window.top === window) localStorage.setItem("darhikmah_v1", s); }, JSON.stringify(state));
  await ctx.addInitScript(countWrites);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(URL + (boot || "/"), { waitUntil: "load" });
  await page.waitForSelector("#view > *");
  return { ctx, page, errors };
}
// Every write of the progress state, counted from the page. save() is the only
// thing that writes it (app.js), so a count that moves is a save(). Installed
// after the seed above, so the seed itself is not counted.
function countWrites() {
  if (window.top !== window) return;
  window.__stateWrites = 0;
  const set = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    if (k === "darhikmah_v1") window.__stateWrites++;
    return set.call(this, k, v);
  };
}
const stored = (page, k) => page.evaluate(k => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons || {})[k] || null, k);
const writes = page => page.evaluate(() => window.__stateWrites);
const frameSrc = page => page.evaluate(() => { const f = document.querySelector("#view .video-frame iframe"); return f ? f.getAttribute("src") : ""; });
// What the embed posts, as it posts it: a JSON string. infoDelivery carries
// the playing state and the time; onStateChange carries the new state alone.
const PLAYING = 1, PAUSED = 2, ENDED = 0;
const tick = (page, t, v) => page.evaluate(([t, v, s]) => window.__brickfordTest.playerMessage(JSON.stringify(
  { event: "infoDelivery", info: { playerState: s, currentTime: t, videoData: { video_id: v } } })), [t, v, PLAYING]);
const setState = (page, s) => page.evaluate(s => window.__brickfordTest.playerMessage(JSON.stringify({ event: "onStateChange", info: s })), s);

// The lecture these use: MATH 110, unit I, lecture 14 — 17 minutes, so 754s
// (12:34) is inside it. Its id, length and title are read from the curriculum
// itself, not restated here.
const LECTURE = { cid: "math110", ui: 0, li: 13 };
const LK = LECTURE.cid + "." + LECTURE.ui + "." + LECTURE.li;
const LROUTE = "/lesson/" + LECTURE.cid + "/" + LECTURE.ui + "/" + LECTURE.li;
const lessonOf = (() => {
  const vm = require("vm");
  const sandbox = { window: {} };
  sandbox.window.DAR = sandbox.DAR = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(path.resolve(__dirname, ".."), "platform/data/curriculum.js"), "utf8"), sandbox);
  return (cid, ui, li) => {
    const c = sandbox.window.DAR.COURSES.find(x => x.id === cid);
    const l = c.units[ui].lessons[li];
    return { v: l.v, min: l.min, label: c.code + " · " + l.t };
  };
})();
const CUR = lessonOf(LECTURE.cid, LECTURE.ui, LECTURE.li);
// T-043: a lecture opens only once the one before it is cleared, so the
// resume flows' contexts carry lecture 13 watched with its quiz passed —
// a quiz pass added to the fixture, nothing else. Their own lecture (14) is
// untouched by it.
const PREV_PASSED = { "math110.0.12": { done: true, doneAt: "2026-10-28", notes: "", checks: [],
  quiz: { passedAt: "2026-10-28", at: "2026-10-28T10:00:00.000Z", firstTry: 3, total: 3, attempts: 3 } } };
const unlocked = st => Object.assign({}, st || {}, { lessons: Object.assign({}, PREV_PASSED, (st || {}).lessons || {}) });

// The page going to the background, as the page sees it: visibilityState,
// and the visibilitychange event (a headless page cannot be backgrounded).
const setVisibility = (page, state) => page.evaluate(s => {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => s });
  Object.defineProperty(document, "hidden", { configurable: true, get: () => s === "hidden" });
  document.dispatchEvent(new Event("visibilitychange"));
}, state);

// ---- a stand-in for YouTube's embed, for (h) and (i) ----
// Served by a route into the lecture's own frame (the real player is never
// reached), on YouTube's origin, so what the page receives is a real
// cross-origin postMessage. It behaves the way the player does on the wire:
// it says nothing until the page hails it ("listening"), then answers with
// initialDelivery and onReady, and from then on posts what the harness hands
// it (__say) — JSON strings, in YouTube's shapes. It records every hail and
// every command the page sends it. `quiet` hails are ignored before it
// answers: a phone whose player is slow to start listening. __post sends
// whatever the handshake, for frames that are not the player.
const stubPage = quiet => `<!doctype html><meta charset="utf-8"><title>player stub</title><script>
var quiet = ${quiet}, heard = 0, answered = false, commands = [];
function post(s) { parent.postMessage(s, "*"); }
function wire(o) { o.id = 1; o.channel = "widget"; return JSON.stringify(o); }
addEventListener("message", function (e) {
  var m; try { m = JSON.parse(e.data); } catch (x) { return; }
  if (m.event === "listening") {
    heard++;
    if (!answered && heard > quiet) {
      answered = true;
      post(wire({ event: "initialDelivery", info: { playerState: -1, currentTime: 0, videoData: { video_id: location.pathname.split("/").pop() } } }));
      post(wire({ event: "onReady", info: null }));
    }
  } else if (m.event === "command") commands.push(m.func + (m.args ? " " + m.args.join(",") : ""));
});
window.__stub = function () { return { heard: heard, answered: answered, commands: commands }; };
window.__say = function (s) { if (!answered) return false; post(s); return true; };
window.__post = function (s) { post(s); return true; };
</script>`;
// Somewhere that is not YouTube, though its name starts like it: the player's
// frame is sent here in (h), and the page it gets posts a pause on arrival.
const ELSEWHERE = "https://www.youtube.com.example.net";
const wireMsg = o => JSON.stringify(Object.assign({}, o, { id: 1, channel: "widget" }));
const PAUSE_MSG = wireMsg({ event: "onStateChange", info: 2 });
const playingMsg = (t, v) => wireMsg({ event: "infoDelivery", info: { playerState: 1, currentTime: t, videoData: { video_id: v } } });
async function stubPlayer(ctx, quiet) {
  await ctx.route(/^https:\/\/www\.youtube\.com\/embed\//, r => r.fulfill({ status: 200, contentType: "text/html", body: stubPage(quiet) }));
  await ctx.route(new RegExp("^" + ELSEWHERE.replace(/\./g, "\\.") + "/"), r => r.fulfill({ status: 200, contentType: "text/html",
    body: "<!doctype html><title>elsewhere</title><script>parent.postMessage(" + JSON.stringify(PAUSE_MSG) + ", \"*\");</script>" }));
}
// The lecture's frame, once the stub is running in it.
async function playerFrame(page) {
  const fr = await (await page.waitForSelector("#view .video-frame iframe[data-k]", { state: "attached" })).contentFrame();
  await fr.waitForFunction(() => typeof window.__stub === "function", null, { timeout: 8000 });
  return fr;
}
// Every message the top page receives, counted by a listener registered AFTER
// the app's — listeners run in the order they were added, so once this one has
// counted a message the app has finished handling it: proof, not a wait.
async function listenAfterApp(page) {
  await page.evaluate(() => {
    window.__heard = [];
    window.addEventListener("message", e => window.__heard.push({ origin: e.origin, data: typeof e.data === "string" ? e.data : "" }));
  });
}
// Send one message (exactly `s`) and wait until the page has handled it.
async function delivered(page, s, send) {
  const n = await page.evaluate(s => window.__heard.filter(h => h.data === s).length, s);
  if ((await send()) === false) return false;
  return page.waitForFunction(([s, n]) => window.__heard.filter(h => h.data === s).length > n, [s, n], { timeout: 5000 })
    .then(() => true, () => false);
}
const fromPlayer = (page, fr, s) => delivered(page, s, () => fr.evaluate(s => window.__say(s), s));

// Proof the view was rebuilt, not a guess at how long it takes: renderInner()
// replaces #view's children wholesale, so a marker on the current first child
// cannot survive the next render. (The technique verify-contrast.js uses.)
async function markView(page) {
  await page.evaluate(() => { const c = document.querySelector("#view > *"); if (c) c.setAttribute("data-flow-stale", "1"); });
}
async function viewReplaced(page) {
  await page.waitForFunction(() => document.querySelector("#view > *") &&
    !document.querySelector("#view [data-flow-stale]"), null, { timeout: 8000 });
}
// T-068: platform/ served on 127.0.0.1, an ephemeral port, node's own http (no dependency). For the one
// block whose reload file:// storage cannot carry (the (p) recorder block, below). { base, close }.
function serveDir(dir) {
  const http = require("http");
  const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
    ".png": "image/png", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".pdf": "application/pdf" };
  const srv = http.createServer((q, r) => {
    const rel = decodeURIComponent(q.url.split("?")[0]), f = path.join(dir, rel);
    if (!f.startsWith(dir + path.sep)) { r.writeHead(403); return r.end(); }
    fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream", "cache-control": "no-store" }); r.end(d); });
  });
  return new Promise(res => srv.listen(0, "127.0.0.1", () => res({ base: "http://127.0.0.1:" + srv.address().port + "/index.html#",
    close: () => new Promise(c => { srv.close(() => c()); srv.closeAllConnections(); }) })));
}
async function go(page, route, base) {
  await markView(page);
  await page.goto((base || URL) + route, { waitUntil: "load" });
  await viewReplaced(page);
}
const todayCount = page => page.evaluate(() => {
  const m = /(\d+) \/ (\d+) today/.exec((document.querySelector(".card.one.lead .gh-meta") || {}).textContent || "");
  return m ? { done: +m[1], of: +m[2] } : null;
});
async function shot(page, name) {
  if (!SHOTS) return;
  // The view's entrance animation starts at opacity 0 even under reduced
  // motion (it is collapsed to 0.01ms, which still needs a frame), so a
  // screenshot taken in the same frame as a render shows an empty page. Wait
  // for the animations on the view to finish: proof, not a duration.
  await page.evaluate(() => Promise.all(document.querySelector("#view").getAnimations({ subtree: true })
    .filter(a => !a.effect || a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished)));
  await page.screenshot({ path: path.join(SHOTS, name + ".png"), fullPage: false });
}

// ---- T-038: the gates, and the confirm sheet ----
const GATE1_REQ = (() => {
  const vm = require("vm");
  const sandbox = { window: {} };
  sandbox.window.DAR = sandbox.DAR = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(path.resolve(__dirname, ".."), "platform/data/curriculum.js"), "utf8"), sandbox);
  return sandbox.window.DAR.GATES[0].req.split(" \u00b7 ");
})();
const gatesStored = page => page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").gates || {});
// What /transcript offers right now: every gate control, by what it does.
const gateControls = page => page.evaluate(() => [...document.querySelectorAll("#view [data-gate]")]
  .map(b => b.dataset.gateDo + " " + b.dataset.gate).filter((v, i, a) => a.indexOf(v) === i).sort().join(", "));
// The open sheet, as the reader has it.
const sheetState = page => page.evaluate(() => {
  const d = document.querySelector("dialog.sheet");
  if (!d) return null;
  const go = d.querySelector("[data-sheet-go]");
  return { open: d.open, modal: d.matches(":modal"), title: (d.querySelector("h2") || {}).textContent || "",
           reqs: [...d.querySelectorAll("[data-gate-req]")].map(i => ({ text: i.closest("label").textContent.trim(), on: i.checked })),
           go: go ? { text: go.textContent.trim(), disabled: go.disabled } : null,
           focusIn: d.contains(document.activeElement), focus: document.activeElement ? document.activeElement.tagName + (document.activeElement.dataset.gateReq != null ? "[req]" : "") : "" };
});
const sheetGone = page => page.waitForFunction(() => !document.querySelector("dialog.sheet"), null, { timeout: 4000 }).then(() => true, () => false);

// Watched lectures unlock quiz questions, so flow (b) starts with some watched,
// the day before the quiz gate (QUIZ_GATE_FROM, read from app.js): watched
// before it shipped, as they were when this fixture was written (T-056).
const GATE = /const QUIZ_GATE_FROM = "(\d{4}-\d\d-\d\d)"/.exec(fs.readFileSync(path.join(path.resolve(__dirname, ".."), "platform/js/app.js"), "utf8"))[1];
const BEFORE_GATE = (d => { d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); })(new Date(GATE + "T00:00:00Z"));
const WATCHED = {};
for (let i = 0; i < 16; i++) WATCHED["math110.0." + i] = { done: true, doneAt: BEFORE_GATE, notes: "", checks: [] };


// ---- T-026c: the week the pinned clock seals, walked here ----
// T-056 r2 (owner, "Keep Sunday"): the Week page seals the REVISION week, not
// the plan week. Revision Sundays are every Sunday from the first one with a
// study week behind it (Sun 25 Oct since reset seven); the week a date answers
// to is the first revision Sunday on or after it, and runs from the Sunday
// before (week 1: START_DATE) to the day before its own Sunday, so its Saturday
// is in it. On Sun 1 Nov that is week 2, 25-31 Oct (study days 25-30 Oct) —
// plan week 3 (Fri 30 Oct - Thu 5 Nov) is two days in and must not be sealed.
// The Seal flow's expected numbers are worked out from its own fixture and
// these dates, never read from the page.
const T26C_WEEK = (() => {
  const vm = require("vm");
  const sandbox = { window: {} };
  sandbox.window.DAR = sandbox.DAR = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(path.resolve(__dirname, ".."), "platform/data/curriculum.js"), "utf8"), sandbox);
  const study = [];
  for (const d = new Date(sandbox.window.DAR.START_DATE + "T00:00:00Z"); study.length < 400; d.setUTCDate(d.getUTCDate() + 1))
    if (d.getUTCDay() !== 6) study.push(d.toISOString().slice(0, 10));
  const start = sandbox.window.DAR.START_DATE, sundays = [];
  for (const d = new Date(start + "T00:00:00Z"); sundays.length < 60; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    if (d.getUTCDay() === 0 && study.some(x => x < iso)) sundays.push(iso);   // a Sunday with study days behind it
  }
  // The first such Sunday may still be inside the first week (a Friday start
  // has one study day before Sun 18 Oct): the first revision Sunday is the
  // first one with a full Sun-Fri week behind it, week 1 taking what precedes.
  const firstRev = sundays.find(s => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - 7); return d.toISOString().slice(0, 10) >= start; });
  const revs = sundays.filter(s => s >= firstRev);
  const k = revs.findIndex(s => s >= TODAY), sun = revs[k];
  const back = n => { const d = new Date(sun + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
  return { w: k + 1, from: k === 0 ? start : back(7), to: back(1), sun };
})();
// Two problems solved, a lecture proven this week, a week already sealed —
// which a seal must leave exactly as it was — and payments on both edges of
// the week and its rest day: the Saturday that ends the week before and the
// Sunday it is sealed on, which starts the week after (neither counts), its
// Sunday, a weekday, its Saturday and its Friday (all four count). T-056 r2:
// the week sealed on Sun 1 Nov is revision week 2, Sun 25 - Sat 31 Oct.
const T26C_SEAL_STATE = (theme, entries) => ({
  settings: { theme, themeNavyOnce: true },
  problems: { "Arrays & Hashing|Contains Duplicate": "2026-10-24", "Arrays & Hashing|Valid Anagram": "2026-10-30" },
  lessons: { "math110.0.13": { done: true, verified: true, doneAt: "2026-10-30", verifiedAt: "2026-10-30", notes: "", checks: [] } },
  treasury: { offer: "", clients: [], niche: "", entries: entries || [
    { date: "2026-10-24", amount: 999, note: "the last day of the week before" },
    { date: "2026-10-25", amount: 120, note: "pilot" },
    { date: "2026-10-28", amount: 30.5, note: "a referral" },
    { date: "2026-10-31", amount: 7, note: "the rest day" },
    { date: "2026-10-30", amount: 2.25, note: "the last study day of the week" },
    { date: "2026-11-01", amount: 500, note: "the first day of the week after" },
  ] },
  weeks: [{ week: 1, date: "2026-10-25", shipped: "flashcards-cli", dsa: 4, posts: 1, revenue: 120, notes: "the router broke twice" }],
});
const t26cEarned = st => Math.round(st.treasury.entries.filter(e => e.date >= T26C_WEEK.from && e.date <= T26C_WEEK.to)
  .reduce((a, e) => a + e.amount, 0) * 100) / 100;

(async () => {
  const browser = await chromium.launch();

  for (const w of WIDTHS) {
    console.log("\n" + w + "px");

    // ---- (a) open today's session ----
    {
      const { ctx, page, errors } = await fresh(browser, w, null);
      const cta = await page.evaluate(() => {
        const a = document.querySelector(".card.one.lead a.one-go");
        const k = document.querySelector(".card.one.lead .one-kind");
        return a ? { href: a.getAttribute("href"), title: k ? k.textContent.trim() : "", verb: a.textContent.trim() } : null;
      });
      check("(a) the dashboard names the next lecture", !!cta && /^#\/lesson\//.test(cta.href) && cta.title.length > 0,
        cta ? "\"" + cta.title + "\" -> " + cta.href : "no .one-go button on the dashboard");
      if (cta) {
        await markView(page);
        await page.click(".card.one.lead a.one-go");
        await viewReplaced(page);
        const got = await page.evaluate(() => ({
          hash: location.hash,
          h1: (document.querySelector("#view h1") || {}).textContent || "",
          btn: !!document.querySelector("#view [data-act=toggleDone]"),
        }));
        // T-043: when today's lecture is locked the card names the quiz that
        // opens it ("Quiz: <title>"), and its button opens that lecture.
        // Review r1: a lecture not yet watched is "Watch: <title>, then its quiz".
        // T-080 PR 2: the label only; the \u25b8 glyph became a drawn chevron (CHEV), asserted in verify-design's T-080 block.
        check("(a) nothing watched: the card says to watch the first lecture in the chain, then take its quiz, with \"Open\"",
          /^Watch: .+, then its quiz$/.test(cta.title) && cta.verb === "Open", "\"" + cta.title + "\", \"" + cta.verb + "\"");
        check("(a) its button opens that lecture", got.hash === cta.href && got.h1.includes(cta.title.replace(/^(Quiz|Watch): /, "").replace(/, then its quiz$/, "")) && got.btn,
          "at " + got.hash + ", h1 \"" + got.h1.trim() + "\"");
        await shot(page, "flow-a-open-session-" + w);
      }
      check("(a) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (b) answer one quiz question ----
    {
      const { ctx, page, errors } = await fresh(browser, w, { lessons: WATCHED });
      await go(page, "/quiz/linear-algebra");
      await page.waitForSelector("#quizMount > *", { timeout: 8000 });
      const card = await page.evaluate(() => ({
        q: !!document.querySelector("#quizMount .q-card"),
        opts: document.querySelectorAll("#quizMount .opt").length,
        num: !!document.querySelector("#numAns"),
        text: document.querySelector("#quizMount").textContent.trim().slice(0, 60),
      }));
      if (check("(b) a question is on screen", card.q && (card.opts > 0 || card.num), card.q ? (card.opts ? card.opts + " options" : "numeric") : "\"" + card.text + "\"")) {
        if (card.opts) await page.click("#quizMount .opt >> nth=0");
        else { await page.fill("#numAns", "0"); await page.click("#numGo"); }
        await page.waitForSelector("#qFeedback .expl", { timeout: 5000 }).catch(() => {});
        const r = await page.evaluate(() => ({
          fb: ((document.querySelector("#qFeedback .expl strong") || {}).textContent || "").trim(),
          locked: [...document.querySelectorAll("#quizMount .opt")].every(b => b.disabled),
          marked: !!document.querySelector("#quizMount .opt.correct") || !document.querySelector("#quizMount .opt"),
          next: getComputedStyle(document.querySelector("#nextBtn")).visibility,
        }));
        check("(b) the answer registers: graded, locked and marked",
          /^(Correct\.|Not quite)/.test(r.fb) && r.locked && r.marked && r.next === "visible",
          "feedback \"" + r.fb + "\", options locked " + r.locked + ", next button " + r.next);
        await shot(page, "flow-b-quiz-answer-" + w);
        await page.click("#nextBtn");
        const p = await page.evaluate(() => document.querySelectorAll("#quizMount .q-progress i.done").length +
          (document.querySelector("#quizMount .score-seal") ? 1 : 0));
        check("(b) the sitting moves on", p === 1, p + " question(s) marked done in the progress strip");
      }
      check("(b) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (c) mark a lecture watched, then pass its quiz (T-043) ----
    // loop/specs/T-043-lecture-quiz-gate/spec.md, criterion 1. Before T-043
    // marking watched moved the count; now a lecture counts once it is
    // watched AND its quiz is passed. Today's first lecture is MATH 120
    // lecture 13; the fixture passes the quiz of the lecture before it (a
    // quiz pass added, nothing else), so it is open. One question is
    // answered wrong, the rest right; the answers are read from the summary's
    // own checks (window.DAR), by the bank index the card carries.
    {
      const PREV = { "math120.0.11": { done: true, doneAt: "2026-10-28", notes: "", checks: [],
        quiz: { passedAt: "2026-10-28", at: "2026-10-28T10:00:00.000Z", firstTry: 2, total: 2, attempts: 2 } } };
      const { ctx, page, errors } = await fresh(browser, w, { lessons: PREV }, "/__test");
      await go(page, "/");
      const before = await todayCount(page);
      const cta = await page.evaluate(() => (document.querySelector(".card.one.lead a.one-go") || { getAttribute: () => "" }).getAttribute("href"));
      check("(c) the dashboard shows a count for today, and its next lecture is open", !!before && before.of > 0 && cta === "#/lesson/math120/1/0",
        (before ? before.done + " / " + before.of + " today" : "no \"N / M today\" on the dashboard") + ", next " + cta);
      const calSub = () => page.evaluate(() => ((document.querySelector("#view .cd-sub") || {}).textContent || "").trim());
      await go(page, "/calendar");
      const cal0 = await calSub();
      // The next lecture, before the pass: one card, no video, no Mark watched.
      await go(page, "/lesson/math120/1/1");
      const lock0 = await page.evaluate(() => ({ lock: !!document.querySelector("#view .lq-lock"), frame: !!document.querySelector("#view .video-frame"),
        mark: !!document.querySelector("#view [data-act=toggleDone]"),
        go: (document.querySelector("#view .lq-lock a.btn") || { getAttribute: () => "" }).getAttribute("href"),
        text: ((document.querySelector("#view .lq-lock") || {}).textContent || "").trim() }));
      check("(c) the next lecture is locked before the pass: one card pointing at this quiz, no video, no Mark watched",
        lock0.lock && !lock0.frame && !lock0.mark && lock0.go === "#/lesson/math120/1/0" && /^Pass the quiz for/.test(lock0.text),
        JSON.stringify(lock0));
      await shot(page, "flow-c-locked-" + w);
      await go(page, "/lesson/math120/1/0");
      await markView(page);
      await page.click("#view [data-act=toggleDone]");
      await viewReplaced(page);
      const label = await page.evaluate(() => document.querySelector("#view [data-act=toggleDone]").textContent.trim());
      check("(c) the lecture page records it", label === "Unmark watched", "button now reads \"" + label + "\"");
      const mounted = await page.evaluate(() => ({ quiz: !!document.querySelector("#view #lqMount .lq-card"), bar: !!document.querySelector("#view .lq-watched"),
        frame: !!document.querySelector("#view .video-frame"), ring: ((document.querySelector("#rail .rl-ring") || {}).textContent || "").replace(/\s+/g, " ").trim(),
        rule: !!document.querySelector("#rail .rl-rule"), railLock: !!document.querySelector("#rail .rl-lock") }));
      check("(c) watching collapses the video to the watched bar and mounts the quiz under it", mounted.quiz && mounted.bar && !mounted.frame, JSON.stringify(mounted));
      check("(c) the rail's ring does not count it yet, says why, and shows the next lecture locked",
        /^0\/3/.test(mounted.ring) && mounted.rule && mounted.railLock, JSON.stringify(mounted));
      await go(page, "/");
      const mid = await todayCount(page);
      const midCta = await page.evaluate(() => ({ kind: ((document.querySelector(".card.one.lead .one-kind") || {}).textContent || "").trim(),
        verb: ((document.querySelector(".card.one.lead a.one-go") || {}).textContent || "").trim(),
        href: (document.querySelector(".card.one.lead a.one-go") || { getAttribute: () => "" }).getAttribute("href") }));
      // T-080 PR 2: the label only; the \u25b8 glyph became a drawn chevron (CHEV), asserted in verify-design's T-080 block.
      check("(c) watched with the quiz still to pass: the card says \"Quiz: <title>\" with \"Start\", to this lecture",
        midCta.kind === "Quiz: Rate of Change" && midCta.verb === "Start" && midCta.href === "#/lesson/math120/1/0", JSON.stringify(midCta));
      check("(c) the dashboard count does not move on \"watched\" alone", !!mid && !!before && mid.done === before.done && mid.of === before.of,
        (before ? before.done + " / " + before.of : "?") + " -> " + (mid ? mid.done + " / " + mid.of : "?"));
      await go(page, "/lesson/math120/1/0");
      await page.waitForSelector("#view #lqMount .lq-card");
      // The sitting.
      const bank = await page.evaluate(() => window.DAR.SUMMARIES["math120.1.0"].checks.map(q => ({ a: q.a, num: q.num, opts: q.opts ? q.opts.length : 0 })));
      const n = bank.length;
      const w0 = await writes(page);
      let missedQ = null, firstOrder = null, againOrder = null, answeredN = 0, wFinish = null;
      for (let guard = 0; guard < 3 * n + 4; guard++) {
        const cur = await page.evaluate(() => { const c = document.querySelector("#view #lqMount .lq-card");
          return c ? { q: +c.dataset.q, order: [...c.querySelectorAll(".opt")].map(b => +b.dataset.o), head: (c.querySelector(".lq-n") || {}).textContent } : null; });
        if (!cur) break;
        const b = bank[cur.q];
        const miss = missedQ === null && b.opts > 1;
        if (miss) { missedQ = cur.q; firstOrder = cur.order; }
        else if (cur.q === missedQ) againOrder = cur.order;
        if (b.opts) {
          const pick = miss ? cur.order.findIndex(o => o !== b.a) : cur.order.indexOf(b.a);
          await page.click("#view #lqMount .opt >> nth=" + pick);
        } else {
          await page.fill("#view #numAns", String(b.num));
          await page.click("#view #numGo");
        }
        answeredN++;
        await page.waitForFunction(() => getComputedStyle(document.querySelector("#view #nextBtn")).visibility === "visible", null, { timeout: 4000 });
        if (miss) {
          const after = await page.evaluate(() => ({ seg: [...document.querySelectorAll("#view .lq-segs i")].map(i => i.className),
            why: ((document.querySelector("#view #qFeedback") || {}).textContent || "").trim() }));
          check("(c) a miss shows why and turns its segment red", after.seg.includes("miss") && /^Not quite\./.test(after.why) && /comes back/.test(after.why),
            JSON.stringify(after));
          await shot(page, "flow-c-quiz-miss-" + w);
        }
        const last = await page.evaluate(() => document.querySelector("#view #nextBtn").textContent.trim() === "Finish");
        if (last) wFinish = await writes(page);
        await markView(page).catch(() => {});
        await page.click("#view #nextBtn");
        if (last) { await viewReplaced(page); break; }
      }
      check("(c) the missed question comes back with its options reshuffled", missedQ !== null && !!againOrder && againOrder.join() !== firstOrder.join() &&
        againOrder.slice().sort().join() === firstOrder.slice().sort().join(), "first " + JSON.stringify(firstOrder) + ", again " + JSON.stringify(againOrder));
      check("(c) the sitting asks every question, and the miss once more", answeredN === n + 1, answeredN + " answers for " + n + " questions");
      const passCard = await page.evaluate(() => ((document.querySelector("#view .lq-pass") || {}).textContent || "").replace(/\s+/g, " ").trim());
      check("(c) the pass card shows firstTry = n-1 and that it counted for today",
        passCard.includes(n + " of " + n + " · " + (n - 1) + " right on the first try · counted for today") && /Next lecture/.test(passCard), "\"" + passCard + "\"");
      await shot(page, "flow-c-passed-" + w);
      const rec = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}");
        return { q: ((s.lessons || {})["math120.1.0"] || {}).quiz || null, ev: (s.ledger || []).filter(e => e.type === "quiz") }; });
      const wAfter = await writes(page);
      check("(c) the record is stored once, on finish: nothing written while answering, one quiz event, firstTry n-1 of n",
        wFinish === w0 && !!rec.q && rec.q.passedAt === TODAY && rec.q.firstTry === n - 1 && rec.q.total === n && rec.q.attempts === n + 1 &&
          rec.ev.length === 1 && rec.ev[0].ref === "math120.1.0" && rec.ev[0].data.firstTry === n - 1 && rec.ev[0].data.total === n && wAfter - w0 === 1,
        "writes while answering " + (wFinish - w0) + ", at finish " + (wAfter - wFinish) + "; record " + JSON.stringify(rec.q) + "; events " + JSON.stringify(rec.ev.map(e => e.data)));
      // A render is a read: three more renders of the passed page write nothing.
      const wr0 = await writes(page);
      for (let i = 0; i < 3; i++) { await markView(page); await page.evaluate(() => window.__brickfordTest.render()); await viewReplaced(page); }
      const ring1 = await page.evaluate(() => ((document.querySelector("#rail .rl-ring") || {}).textContent || "").replace(/\s+/g, " ").trim());
      check("(c) nothing is written at render (three renders of the passed lecture)", (await writes(page)) === wr0, (await writes(page)) - wr0 + " write(s)");
      check("(c) the rail's ring counts it after the pass", /^1\/3/.test(ring1), "ring " + ring1);
      await go(page, "/");
      const after = await todayCount(page);
      check("(c) the dashboard count goes up by one after the pass", !!before && !!after && after.done === before.done + 1 && after.of === before.of,
        (before ? before.done + " / " + before.of : "?") + " -> " + (after ? after.done + " / " + after.of : "?"));
      await shot(page, "flow-c-mark-watched-" + w);
      await go(page, "/calendar");
      const cal1 = await calSub();
      check("(c) today's day status in the calendar counts it only after the pass", /0 of 3 done/.test(cal0) && /1 of 3 done/.test(cal1), "\"" + cal0 + "\" -> \"" + cal1 + "\"");
      await go(page, "/lesson/math120/1/0");
      await markView(page);
      await page.click("#view .lq-pass a.btn");
      await viewReplaced(page);
      const nx = await page.evaluate(() => ({ hash: location.hash, h1: ((document.querySelector("#view h1") || {}).textContent || "").trim(),
        lock: !!document.querySelector("#view .lq-lock"), mark: !!document.querySelector("#view [data-act=toggleDone]") }));
      check("(c) Next lecture navigates, and the next lecture is open after the pass", nx.hash === "#/lesson/math120/1/1" && !nx.lock && nx.mark && /^2\. /.test(nx.h1),
        JSON.stringify(nx));
      check("(c) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (d) resume: kept on pause, on leaving, on pagehide; cleared at the end ----
    {
      const { ctx, page, errors } = await fresh(browser, w, unlocked(null), "/__test");
      const hook = await page.evaluate(() => !!window.__brickfordTest && typeof window.__brickfordTest.playerMessage === "function");
      check("(d) the test hook is installed on a #/__test boot", hook);
      await go(page, LROUTE);
      const src0 = await frameSrc(page);
      check("(d) the embed asks for the player's messages (enablejsapi=1) and has no start point yet",
        /[?&]enablejsapi=1(&|$)/.test(src0) && !/[?&]start=/.test(src0), src0);

      // Playing at 12:34.3, then the pause.
      const w0 = await writes(page);
      await tick(page, 754.3, CUR.v);
      const held = { w: await writes(page), st: await stored(page, LK) };
      check("(d) a playing tick is held in memory, not written", held.w === w0 && !(held.st && held.st.pos != null),
        (held.w - w0) + " write(s), stored " + JSON.stringify(held.st));
      await setState(page, PAUSED);
      const paused = await stored(page, LK);
      check("(d) the pause keeps it: S.lessons[k].pos === 754, with a posAt stamp",
        !!paused && paused.pos === 754 && !isNaN(Date.parse(paused.posAt)), JSON.stringify(paused));

      // The course page says where you are: the row's subtitle and its frame's edge.
      await go(page, "/course/" + LECTURE.cid);
      const row = await page.evaluate(href => {
        const a = document.querySelector('#view a.grow[href="#' + href + '"]');
        if (!a) return null;
        // T-080 PR 3: the course row has no frame now; how far you got is the row's own thin bar.
        const i = a.querySelector(".lr-prog i");
        return { line: ((a.querySelector(".g-s") || {}).textContent || "").trim(), edge: i ? i.style.width : "" };
      }, LROUTE);
      const want = Math.round(754 / (CUR.min * 60) * 1000) / 10 + "%";
      check("(d) the course row shows it: \"Resume at 12:34\" and a " + want + " progress edge",
        !!row && /Resume at 12:34$/.test(row.line) && row.edge === want, row ? "\"" + row.line + "\", edge " + row.edge : "no row for " + LROUTE);

      // Reopened, the embed starts there.
      await go(page, LROUTE);
      const src1 = await frameSrc(page);
      check("(d) reopening the lecture builds an embed with start=754", /[?&]start=754(&|$)/.test(src1), src1);

      // Leaving the route mid-play, with no pause, keeps the time as well.
      await tick(page, 800.9, CUR.v);
      await go(page, "/course/" + LECTURE.cid);
      const left = await stored(page, LK);
      await go(page, LROUTE);
      const src2 = await frameSrc(page);
      check("(d) leaving the route mid-play keeps it (pos 800), and the next open starts there",
        !!left && left.pos === 800 && /[?&]start=800(&|$)/.test(src2), "pos " + (left && left.pos) + ", " + src2);

      // So does the page going away.
      await tick(page, 900, CUR.v);
      await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
      const hid = await stored(page, LK);
      check("(d) the page going away (pagehide) keeps it (pos 900)", !!hid && hid.pos === 900, "pos " + (hid && hid.pos));

      // And so does the page being hidden — how a phone mostly leaves (another
      // app, the lock button), often with no pagehide at all.
      await tick(page, 930.6, CUR.v);
      const wh = await writes(page);
      await setVisibility(page, "hidden");
      const hidden = { w: await writes(page) - wh, st: await stored(page, LK) };
      await setVisibility(page, "visible");
      check("(d) the page being hidden (visibilitychange) keeps it (pos 930), in one save",
        hidden.w === 1 && !!hidden.st && hidden.st.pos === 930, hidden.w + " save(s), pos " + (hidden.st && hidden.st.pos));
      await tick(page, 960.2, CUR.v);
      await setState(page, PAUSED);
      const back = await stored(page, LK);
      check("(d) back on the page, the player is still heard: a tick and a pause keep pos 960", !!back && back.pos === 960,
        "pos " + (back && back.pos));

      // The end clears it — stamped, so the clear outlives an older point
      // another device is still holding.
      await tick(page, CUR.min * 60 - 1, CUR.v);
      await setState(page, ENDED);
      const ended = await stored(page, LK);
      check("(d) an ended event clears pos, and stamps posAt", !!ended && !("pos" in ended) && !isNaN(Date.parse(ended.posAt)),
        JSON.stringify(ended));
      await go(page, "/course/" + LECTURE.cid);
      await go(page, LROUTE);
      const src3 = await frameSrc(page);
      check("(d) and the next open starts from the beginning (no start=)", !/[?&]start=/.test(src3), src3);
      await shot(page, "flow-d-resume-" + w);
      check("(d) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (e) a render is a read ----
    // lastLesson is seeded as this lecture, so opening it has nothing to
    // record either: every write counted below is one the page chose to make.
    // 50 playing ticks spread across the lecture, 19s apart (0:30.4 to
    // 16:01.4, so a write keyed to any clock position has one to fire on),
    // and a render after each of the first 20: every render is made while the
    // player holds a time nobody has saved. The frame each render builds
    // starts at the time just heard — the proof a time WAS held at that render.
    {
      const seeded = { settings: { lastLesson: { cid: LECTURE.cid, ui: LECTURE.ui, li: LECTURE.li, label: CUR.label } } };
      const { ctx, page, errors } = await fresh(browser, w, unlocked(seeded), "/__test");
      const w0 = await writes(page);
      await go(page, LROUTE);
      await page.evaluate(() => {
        window.__rebuilds = 0;
        new MutationObserver(ms => { for (const m of ms) if (m.addedNodes.length) window.__rebuilds++; })
          .observe(document.querySelector("#view"), { childList: true });
      });
      const at = i => 30.4 + i * 19;
      const starts = [];
      for (let i = 0; i < 50; i++) {
        await tick(page, at(i), CUR.v);
        if (i < 20) {
          await page.evaluate(() => window.__brickfordTest.render());
          starts.push(+(/[?&]start=(\d+)/.exec(await frameSrc(page)) || [])[1]);
        }
      }
      const r = await page.evaluate(() => ({ rebuilds: window.__rebuilds, writes: window.__stateWrites,
        frame: !!document.querySelector("#view .video-frame iframe[data-k]") }));
      const offStart = starts.map((s, i) => ({ s, want: Math.floor(at(i)) })).filter(x => x.s !== x.want);
      check("(e) the lecture was rendered 20 more times, each between two playing ticks, a rebuilt view whose frame starts at the time just heard (held, unsaved)",
        r.rebuilds === 20 && r.frame && starts.length === 20 && offStart.length === 0,
        r.rebuilds + " rebuild(s), frame " + r.frame + (offStart.length ? "; start= " + offStart.slice(0, 3).map(x => x.s + " (want " + x.want + ")").join(", ")
          : "; start= " + starts[0] + " … " + starts[19]));
      check("(e) opening it, 50 playing infoDelivery ticks across the lecture (0:30-16:01) and 20 renders between them: zero save() calls",
        r.writes - w0 === 0, (r.writes - w0) + " save(s)");
      await setState(page, PAUSED);
      const after = await writes(page), st = await stored(page, LK);
      const last = Math.floor(at(49));
      check("(e) and the pause after them is exactly one save, at the last tick's time (so the ticks were heard)",
        after - r.writes === 1 && !!st && st.pos === last, (after - r.writes) + " save(s), pos " + (st && st.pos) + " (want " + last + ")");
      check("(e) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (g) under a second is not a position ----
    // A player opened at start= reports 0 while it buffers, before it has
    // seeked there (iOS, on an ordinary open). Left at that moment, the
    // lecture must keep the point it was opened at.
    {
      const T10 = "2026-11-01T10:00:00.000Z";
      const seeded = { lessons: { [LK]: { done: false, notes: "", checks: [], pos: 754, posAt: T10 } } };
      const { ctx, page, errors } = await fresh(browser, w, unlocked(seeded), "/__test");
      await go(page, LROUTE);
      const src = await frameSrc(page);
      await page.evaluate(v => window.__brickfordTest.playerMessage(JSON.stringify(
        { event: "infoDelivery", info: { playerState: 3, currentTime: 0, videoData: { video_id: v } } })), CUR.v);
      await go(page, "/course/" + LECTURE.cid);
      const kept = await stored(page, LK);
      check("(g) opened at start=754, a buffering report at 0:00 and an immediate leave keep pos 754 (and its posAt)",
        /[?&]start=754(&|$)/.test(src) && !!kept && kept.pos === 754 && kept.posAt === T10, src.replace(/^.*\?/, "?") + "; stored " + JSON.stringify(kept));

      // The one real 0: a lecture that began at 0 (no start=), played to 5:00
      // and paused there, then taken back to its start and paused again.
      // T-043: the course's first lecture (never locked, and not watched in
      // this fixture); it was the lecture before LECTURE, which the fixture
      // now holds watched with its quiz passed so that LECTURE is open.
      const B = { cid: LECTURE.cid, ui: 0, li: 0 };
      const BK = B.cid + "." + B.ui + "." + B.li, BL = lessonOf(B.cid, B.ui, B.li);
      await go(page, "/lesson/" + B.cid + "/" + B.ui + "/" + B.li);
      const srcB = await frameSrc(page);
      await tick(page, 300.2, BL.v);
      await setState(page, PAUSED);
      const at5 = await stored(page, BK);
      await tick(page, 0.4, BL.v);
      await setState(page, PAUSED);
      const at0 = await stored(page, BK);
      check("(g) the one real 0 is kept: opened from the beginning, paused at 5:00, taken back to the start and paused — pos 300, then 0",
        !/[?&]start=/.test(srcB) && !!at5 && at5.pos === 300 && !!at0 && at0.pos === 0,
        "start= " + (/[?&]start=/.test(srcB) ? "present" : "absent") + ", pos " + (at5 && at5.pos) + " then " + (at0 && at0.pos));
      check("(g) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (h) the player's own frame, end to end ----
    // No test hook: the stub is served into the lecture's frame, on YouTube's
    // origin, and everything below is a real postMessage between windows.
    {
      const { ctx, page, errors } = await fresh(browser, w, unlocked(null), "/");
      await stubPlayer(ctx, 0);
      await listenAfterApp(page);
      await go(page, LROUTE);
      const fr = await playerFrame(page);
      const shook = await fr.waitForFunction(() => window.__stub().answered && window.__stub().commands.length > 0, null, { timeout: 8000 })
        .then(() => true, () => false);
      const hs = await fr.evaluate(() => window.__stub());
      // The handshake's own two messages, handled, before anything is counted.
      await page.waitForFunction(() => window.__heard.filter(h => /"event":"(initialDelivery|onReady)"/.test(h.data)).length >= 2, null, { timeout: 5000 }).catch(() => {});
      check("(h) the handshake, through a stub of YouTube's embed in the lecture's frame: the page hails it, it answers, the page subscribes to onStateChange",
        shook && hs.heard >= 1 && hs.commands.indexOf("addEventListener onStateChange") >= 0,
        hs.heard + " hail(s) heard, answered " + hs.answered + ", commands [" + hs.commands.join("; ") + "]");

      const w0 = await writes(page);
      const d1 = await fromPlayer(page, fr, playingMsg(754.3, CUR.v));
      const d2 = await fromPlayer(page, fr, PAUSE_MSG);
      const a = { w: await writes(page) - w0, st: await stored(page, LK) };
      check("(h) from the frame: a playing infoDelivery then onStateChange 2 (paused) save pos 754, in one save",
        d1 && d2 && a.w === 1 && !!a.st && a.st.pos === 754, (d1 && d2 ? "" : "not delivered; ") + a.w + " save(s), stored " + JSON.stringify(a.st));

      // Nobody else's messages. Each foreign one is a pause, sent while the
      // player holds a time nobody has saved, so a filter that let it through
      // would write.
      await fromPlayer(page, fr, playingMsg(800.2, CUR.v));
      let wb = await writes(page);
      const t1 = await delivered(page, PAUSE_MSG, () => page.evaluate(s => window.postMessage(s, "*"), PAUSE_MSG));
      const fromTop = await writes(page) - wb;
      check("(h) a pause posted by the top window itself writes nothing", t1 && fromTop === 0,
        (t1 ? "" : "not delivered; ") + fromTop + " save(s), stored pos " + ((await stored(page, LK)) || {}).pos);

      await page.evaluate(() => {
        const x = document.createElement("iframe");
        x.id = "otherPlayer"; x.src = "https://www.youtube.com/embed/aaaaaaaaaaa?enablejsapi=1";
        document.body.appendChild(x);
      });
      const other = await (await page.waitForSelector("#otherPlayer", { state: "attached" })).contentFrame();
      await other.waitForFunction(() => typeof window.__post === "function", null, { timeout: 8000 });
      await fromPlayer(page, fr, playingMsg(820.2, CUR.v));
      wb = await writes(page);
      const t2 = await delivered(page, PAUSE_MSG, () => other.evaluate(s => window.__post(s), PAUSE_MSG));
      const fromOther = await writes(page) - wb;
      check("(h) a pause posted by a second YouTube frame (YouTube's origin, not the player's window) writes nothing", t2 && fromOther === 0,
        (t2 ? "" : "not delivered; ") + fromOther + " save(s), stored pos " + ((await stored(page, LK)) || {}).pos);
      const t3 = await fromPlayer(page, fr, PAUSE_MSG);
      const own = { w: await writes(page) - wb, st: await stored(page, LK) };
      check("(h) and the player's own pause after them saves the time it held (pos 820), once — so those zeros were not deafness",
        t3 && own.w === 1 && !!own.st && own.st.pos === 820, own.w + " save(s), pos " + (own.st && own.st.pos));

      // The player's window itself, once it is on another origin: the frame
      // navigates away (the source still matches; only the origin does not).
      await fromPlayer(page, fr, playingMsg(840.2, CUR.v));
      wb = await writes(page);
      await fr.evaluate(u => { setTimeout(() => { location.href = u; }, 0); }, ELSEWHERE + "/elsewhere");
      const t4 = await page.waitForFunction(o => window.__heard.some(h => h.origin === o), ELSEWHERE, { timeout: 8000 }).then(() => true, () => false);
      const fromElsewhere = await writes(page) - wb;
      check("(h) a pause posted from the player's own frame once it is on " + ELSEWHERE.replace("https://", "") + " writes nothing",
        t4 && fromElsewhere === 0, (t4 ? "" : "not delivered; ") + fromElsewhere + " save(s), stored pos " + ((await stored(page, LK)) || {}).pos);
      check("(h) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (l) tick a lab on Problems (T-026b) ----
    // The page around the checkbox changed shape; what a tick does must not.
    // The first lab of the current phase, ticked by pressing its row: the lab
    // is stored done with an empty proof, a lab event joins the chain, the
    // proof field appears under that row with the cursor in it — all from
    // the change handler, in exactly two saves (its own and the event's), with
    // no re-render. A proof typed into the field is stored (one save); the
    // untick stores done false, logs it, and takes the field away again.
    {
      const { ctx, page, errors } = await fresh(browser, w, null);
      await go(page, "/workshop");
      // T-045: the catalogue sits behind "Everything" now; it is opened as a
      // reader would, by pressing its summary, before the lab is looked for.
      await page.click("#view details#pbAll > summary");
      const lab = await page.evaluate(() => {
        const cb = [...document.querySelectorAll("#view input[data-lab]")].find(i => i.closest("label").checkVisibility());
        if (!cb) return null;
        document.querySelector("#view > *").setAttribute("data-flow-keep", "1");
        return { id: cb.dataset.lab, checked: cb.checked };
      });
      check("(l) /workshop shows an unticked lab of the current phase", !!lab && !lab.checked, lab ? lab.id : "no visible lab checkbox");
      if (lab) {
        const sel = '#view label:has(input[data-lab="' + lab.id + '"])';
        const labs = () => page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").labs || {});
        const lastEvent = () => page.evaluate(() => { const l = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").ledger || []; return l[l.length - 1] || null; });
        let w0 = await writes(page);
        await page.click(sel);
        const field = await page.waitForFunction(id => document.querySelector('#view input[data-proof="' + id + '"]'), lab.id, { timeout: 4000 }).then(() => true, () => false);
        const ticked = { w: await writes(page) - w0, st: (await labs())[lab.id], ev: await lastEvent() };
        const place = await page.evaluate(id => {
          const inp = document.querySelector('#view input[data-proof="' + id + '"]'), row = document.querySelector('#view label:has(input[data-lab="' + id + '"])');
          if (!inp || !row) return null;
          return { under: inp.getBoundingClientRect().top >= row.getBoundingClientRect().bottom - 0.5, sameBox: inp.parentElement === row.parentElement,
                   focused: document.activeElement === inp, kept: !!document.querySelector("#view [data-flow-keep]") };
        }, lab.id);
        check("(l) ticking it stores { done: true, proof: \"\" } in two saves (the tick and its chain event), and logs a lab event",
          field && ticked.w === 2 && !!ticked.st && ticked.st.done === true && ticked.st.proof === "" &&
            !!ticked.ev && ticked.ev.type === "lab" && ticked.ev.ref === lab.id && ticked.ev.data.done === true,
          ticked.w + " save(s), stored " + JSON.stringify(ticked.st) + ", last event " + JSON.stringify(ticked.ev && { type: ticked.ev.type, ref: ticked.ev.ref, data: ticked.ev.data }));
        check("(l) the proof field appears under that row, focused, and the page was not re-rendered",
          !!place && place.under && place.sameBox && place.focused && place.kept, JSON.stringify(place));
        w0 = await writes(page);
        await page.fill('#view input[data-proof="' + lab.id + '"]', "https://github.com/example/flashcards");
        // Leaving the field is what fires its change, as it does for a reader.
        await page.$eval('#view input[data-proof="' + lab.id + '"]', el => el.blur());
        const proofed = { w: await writes(page) - w0, st: (await labs())[lab.id] };
        check("(l) a proof typed into it is stored, in one save",
          proofed.w === 1 && !!proofed.st && proofed.st.done === true && proofed.st.proof === "https://github.com/example/flashcards",
          proofed.w + " save(s), stored " + JSON.stringify(proofed.st));
        w0 = await writes(page);
        await page.click(sel);
        const gone = await page.waitForFunction(id => !document.querySelector('#view input[data-proof="' + id + '"]'), lab.id, { timeout: 4000 }).then(() => true, () => false);
        const unticked = { w: await writes(page) - w0, st: (await labs())[lab.id], ev: await lastEvent(),
                           checked: await page.evaluate(id => document.querySelector('#view input[data-lab="' + id + '"]').checked, lab.id) };
        check("(l) unticking it stores done: false in two saves, logs { done: false }, and takes the proof field away",
          gone && !unticked.checked && unticked.w === 2 && !!unticked.st && unticked.st.done === false &&
            !!unticked.ev && unticked.ev.type === "lab" && unticked.ev.ref === lab.id && unticked.ev.data.done === false,
          unticked.w + " save(s), stored " + JSON.stringify(unticked.st) + ", field " + (gone ? "gone" : "still there"));
      }
      check("(l) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (m) a gate is passed on purpose, and unmarked the same way (T-038) ----
    {
      const { ctx, page, errors } = await fresh(browser, w, null, "/transcript");
      // A harness error inside the flow is a FAIL line, never a crash that
      // takes every later check with it.
      try {
        const keys = w >= 860;                       // 1280: the keyboard alone; 390: taps
        const press = async sel => keys ? (await page.focus(sel), await page.keyboard.press("Enter")) : page.tap(sel);
        check("(m) /transcript offers a pass for the next gate only (Gate 1), and no unmark", (await gateControls(page)) === "pass 1",
          "controls: " + (await gateControls(page) || "none"));
        let w0 = await writes(page);
        await press("#view [data-gate-do=pass][data-gate='1']");
        await page.waitForSelector("dialog.sheet[open]", { timeout: 4000 }).catch(() => {});
        let sh = await sheetState(page);
        check("(m) it opens a modal confirm sheet listing Gate 1's " + GATE1_REQ.length + " requirements, unticked, with \"Pass gate 1\" disabled",
          !!sh && sh.open && sh.modal && JSON.stringify(sh.reqs.map(r => r.text)) === JSON.stringify(GATE1_REQ.map(t => t.charAt(0).toUpperCase() + t.slice(1))) &&
            sh.reqs.every(r => !r.on) && !!sh.go && sh.go.text === "Pass gate 1" && sh.go.disabled,
          JSON.stringify(sh));
        if (keys) {
          // Space on the focused requirement ticks it: the boxes take the keyboard.
          await page.keyboard.press("Space");
          const k = await sheetState(page);
          check("(m) the keyboard lands inside the sheet, on the first requirement, and Space ticks it",
            !!sh && sh.focusIn && sh.focus === "INPUT[req]" && !!k && k.reqs.length > 0 && k.reqs[0].on, (sh ? sh.focus : "no sheet") + ", first ticked " + (k && k.reqs[0] && k.reqs[0].on));
        }
        // Every requirement is needed: with each one in turn left unticked (the
        // others ticked) the button is disabled, and pressing it anyway stores
        // nothing. A rule that skipped any one requirement fails one of these.
        // If the sheet is gone (a press went through and closed it), that hole
        // is recorded as failed and the loop stops: the check below then prints
        // FAIL instead of the harness crashing on a sheet that is not there.
        const holes = [];
        const closedHole = async hole => ({ hole, ticked: "sheet closed", disabled: false, w: await writes(page) - w0,
                                            g: JSON.stringify(await gatesStored(page)), open: false });
        for (let hole = 0; hole < GATE1_REQ.length; hole++) {
          const before = await sheetState(page);
          if (!before) { holes.push(await closedHole(hole)); break; }
          for (let i = 0; i < before.reqs.length; i++) {
            if (before.reqs[i].on !== (i !== hole)) {
              const sel = "dialog.sheet label:has([data-gate-req]) >> nth=" + i;
              if (keys) await page.click(sel); else await page.tap(sel);
            }
          }
          const st = await sheetState(page);
          if (!st) { holes.push(await closedHole(hole)); break; }
          await page.evaluate(() => { const b = document.querySelector("dialog.sheet [data-sheet-go]"); if (b) b.click(); });
          holes.push({ hole, ticked: st.reqs.map(r => r.on ? 1 : 0).join(""), disabled: !!st.go && st.go.disabled, w: await writes(page) - w0,
                       g: JSON.stringify(await gatesStored(page)), open: !!(await sheetState(page)) });
          if (!holes[holes.length - 1].open) break;
        }
        check("(m) with any one of the " + GATE1_REQ.length + " requirements unticked \"Pass gate 1\" is disabled, and pressing it stores nothing",
          holes.length === GATE1_REQ.length && holes.every(h => h.disabled && h.w === 0 && h.g === "{}" && h.open &&
            h.ticked === GATE1_REQ.map((_, i) => i === h.hole ? 0 : 1).join("")),
          holes.map(h => h.ticked + (h.disabled ? " disabled" : " ENABLED") + ", " + h.w + " save(s), stored " + h.g).join("; "));
        // The rest needs the sheet the holes left open; if a press closed it,
        // the check above has already failed and the flow is not walked on a
        // state it was not written for.
        if (holes.some(h => !h.open)) console.log("  skip  (m) the rest of the gate flow at " + w + "px: the sheet closed during the check above");
        else {
          // Escape (or Cancel) closes it and stores nothing; reopened, it starts unticked.
          if (keys) await page.keyboard.press("Escape"); else await page.tap("dialog.sheet [data-sheet-cancel]");
          const closed = await sheetGone(page);
          check("(m) " + (keys ? "Escape" : "Cancel") + " closes the sheet and stores nothing", closed && (await writes(page)) - w0 === 0 && JSON.stringify(await gatesStored(page)) === "{}",
            "closed " + closed + ", " + ((await writes(page)) - w0) + " save(s)");
          await press("#view [data-gate-do=pass][data-gate='1']");
          await page.waitForSelector("dialog.sheet[open]", { timeout: 4000 }).catch(() => {});
          const reopened = await sheetState(page);
          for (let i = 0; i < GATE1_REQ.length; i++) {
            if (keys) { await page.keyboard.press("Space"); if (i < GATE1_REQ.length - 1) await page.keyboard.press("Tab"); }
            else await page.tap("dialog.sheet label:has([data-gate-req]) >> nth=" + i);
          }
          sh = await sheetState(page);
          check("(m) reopened it starts unticked; with every requirement ticked \"Pass gate 1\" is enabled",
            !!reopened && reopened.reqs.length === GATE1_REQ.length && reopened.reqs.every(r => !r.on) && reopened.go.disabled &&
              !!sh && sh.reqs.every(r => r.on) && !sh.go.disabled,
            "reopened " + JSON.stringify(reopened && reopened.reqs.map(r => r.on)) + ", then " + JSON.stringify(sh && { reqs: sh.reqs.map(r => r.on), go: sh.go }));
          await markView(page);
          w0 = await writes(page);
          if (keys) {
            for (let i = 0; i < 4 && !(await page.evaluate(() => document.activeElement && document.activeElement.matches("[data-sheet-go]"))); i++) await page.keyboard.press("Tab");
            await page.keyboard.press("Enter");
          } else await page.tap("dialog.sheet [data-sheet-go]");
          await viewReplaced(page);
          const passed = { w: await writes(page) - w0, g: await gatesStored(page), gone: await sheetGone(page), ctl: await gateControls(page),
            row: await page.evaluate(() => ((document.querySelector("#view .glist .grow .g-lead") || {}).textContent || "").trim()) };
          const p1 = passed.g[1] || {};
          check("(m) passing is one save() of { date: today, at, passed: true }; the sheet closes, Gate 1 reads passed, and the controls move on (pass 2, unmark 1)",
            passed.w === 1 && p1.passed === true && p1.date === TODAY && /^\d{4}-\d\d-\d\dT/.test(p1.at || "") && passed.gone && passed.row === "\u2713" && passed.ctl === "pass 2, unmark 1",
            passed.w + " save(s), stored " + JSON.stringify(passed.g) + ", row lead \"" + passed.row + "\", controls " + passed.ctl);
          // The unmark asks too.
          await ctx.clock.setFixedTime(new Date(TODAY + "T12:05:00Z"));
          w0 = await writes(page);
          await page.evaluate(() => { const d = document.querySelector("#view details.unit"); if (d) d.open = true; });
          await press("#view [data-gate-do=unmark][data-gate='1']");
          await page.waitForSelector("dialog.sheet[open]", { timeout: 4000 }).catch(() => {});
          sh = await sheetState(page);
          const asked = { sh, w: await writes(page) - w0 };
          check("(m) unmark opens a confirm sheet (\"Unmark gate 1\") and stores nothing until it is pressed",
            !!sh && sh.open && sh.modal && !!sh.go && sh.go.text === "Unmark gate 1" && !sh.go.disabled && asked.w === 0, JSON.stringify(sh) + ", " + asked.w + " save(s)");
          await markView(page);
          if (keys) {
            for (let i = 0; i < 4 && !(await page.evaluate(() => document.activeElement && document.activeElement.matches("[data-sheet-go]"))); i++) await page.keyboard.press("Tab");
            await page.keyboard.press("Enter");
          } else await page.tap("dialog.sheet [data-sheet-go]");
          await viewReplaced(page);
          const un = { w: await writes(page) - w0, g: await gatesStored(page), ctl: await gateControls(page) };
          const u1 = un.g[1] || {};
          check("(m) unmarking is one save() of { passed: false } stamped later than the pass, and Gate 1 is open again (pass 1, no unmark)",
            un.w === 1 && u1.passed === false && (u1.at || "") > (p1.at || "") && un.ctl === "pass 1",
            un.w + " save(s), stored " + JSON.stringify(un.g) + ", controls " + un.ctl);
          await shot(page, "flow-m-gate-unmarked-" + w);
        }
      } catch (e) { check("(m) the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
      check("(m) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- (o) seal the week (T-026c) ----
  // The Week page changed shape; what Seal stores must not. At 1440 and 390,
  // in dark and light: the two answers and a posts count typed, Seal pressed.
  // The stored week must be exactly { week, date, shipped, dsa, posts,
  // revenue, notes } — those keys in that order, nothing added — with the
  // counted numbers equal to the fixture's (DSA every problem solved, BHD the
  // payments dated in this plan week), in two saves (the week and its chain
  // event), the week before untouched, and the chain's week event as before.
  // Then once with an empty ledger, where BHD is typed and stored as typed
  // (the spec: it "stays editable if the ledger has none"); and once with a
  // ledger that has nothing in this week, where BHD is a counted 0.
  console.log("\nsealing the week (T-026c)");
  const sealFlow = async (theme, w, entries, typedRev) => {
    const at = w + "px " + theme + (typedRev != null ? ", an empty ledger (BHD typed)" : entries ? ", no payment in this week (BHD a counted 0)" : "");
    const state = T26C_SEAL_STATE(theme, entries);
    const { ctx, page, errors } = await fresh(browser, w, state, "/review");
    try {
      await page.waitForSelector("#view .wk-tiles", { timeout: 8000 });
      const typed = { shipped: "flashcards-cli v2 and a post", notes: "two late nights", posts: 2 };
      await page.fill("#rvShipped", typed.shipped);
      await page.fill("#rvNotes", typed.notes);
      await page.fill("#rvPosts", String(typed.posts));
      if (typedRev != null) await page.fill("#rvRev", String(typedRev));
      const w0 = await writes(page);
      await markView(page);
      await page.click("#view [data-act=logWeek]");
      await viewReplaced(page);
      const after = await page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}"));
      const sealed = (after.weeks || []).filter(x => x.week === T26C_WEEK.w);
      const want = { week: T26C_WEEK.w, date: TODAY, shipped: typed.shipped, dsa: Object.keys(state.problems).length, posts: typed.posts,
        revenue: typedRev != null ? typedRev : t26cEarned(state), notes: typed.notes };
      const n = (await writes(page)) - w0;
      check("(o) " + at + ": Seal stores Week " + T26C_WEEK.w + " in the shape it always had, " + JSON.stringify(want) + " (these keys, in this order, nothing else), in two saves",
        sealed.length === 1 && JSON.stringify(sealed[0]) === JSON.stringify(want) && n === 2,
        n + " save(s), stored " + JSON.stringify(sealed));
      check("(o) " + at + ": the week sealed before it is stored exactly as it was",
        (after.weeks || []).length === 2 && JSON.stringify(after.weeks.find(x => x.week === 1)) === JSON.stringify(state.weeks[0]), JSON.stringify(after.weeks));
      const ev = (after.ledger || [])[(after.ledger || []).length - 1];
      check("(o) " + at + ": the chain's last entry is the week event, as before: type week, ref week" + T26C_WEEK.w + ", { shipped, dsa, posts, revenue }",
        !!ev && ev.type === "week" && ev.ref === "week" + T26C_WEEK.w &&
          JSON.stringify(ev.data) === JSON.stringify({ shipped: want.shipped, dsa: want.dsa, posts: want.posts, revenue: want.revenue }),
        JSON.stringify(ev && { type: ev.type, ref: ev.ref, data: ev.data }));
      const shown = await page.evaluate(() => ({ state: ((document.querySelector("#view .wk-state") || {}).textContent || "").trim(),
        first: ((document.querySelector("#view .wk-weeks > details .wk-h b") || {}).textContent || "").trim() }));
      const day = Number(TODAY.slice(8)) + " " + new Date(TODAY + "T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      check("(o) " + at + ": the page then reads \"Sealed " + day + "\", and Week " + T26C_WEEK.w + " is the newest past week",
        shown.state === "Sealed " + day && shown.first === "Week " + T26C_WEEK.w, JSON.stringify(shown));
      if (typedRev == null) await shot(page, "flow-o-sealed-" + w + "-" + theme);
    } catch (e) { check("(o) " + at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(o) " + at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  };
  for (const theme of ["dark", "light"]) for (const w of [1440, 390]) await sealFlow(theme, w);
  await sealFlow("dark", 390, [], 75.5);
  await sealFlow("dark", 390, [{ date: "2026-10-24", amount: 999, note: "the last day of the week before" },
                              { date: "2026-11-01", amount: 500, note: "the first day of the week after" }]);

  // ---- (p) record yourself, and (q) no microphone (T-028) ----
  // A second Chromium, launched with a fake microphone: --use-fake-ui-for-
  // media-stream grants the permission prompt and --use-fake-device-for-media-
  // stream supplies a device. Measured on this file:// page first: it is a
  // secure context there, getUserMedia, MediaRecorder and IndexedDB all work,
  // so no server is needed and nothing in the app was changed for the harness.
  // Every reading is the page's own storage: the clip as IndexedDB holds it
  // (database brickford_audio, store clips), the rep as localStorage holds it.
  console.log("\nrecord yourself (T-028)");
  const micBrowser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  // The clips as stored, without ever creating the database: an open that
  // would create it is aborted, so a read can never stand in for the app.
  const clipsInDB = page => page.evaluate(() => new Promise(res => {
    const q = indexedDB.open("brickford_audio");
    q.onupgradeneeded = () => q.transaction.abort();
    q.onerror = () => res({ absent: true, list: [] });
    q.onsuccess = () => {
      const db = q.result;
      if (!db.objectStoreNames.contains("clips")) { db.close(); return res({ list: [], noStore: true }); }
      const out = [], t = db.transaction("clips", "readonly");
      t.objectStore("clips").openCursor().onsuccess = e => {
        const c = e.target.result;
        if (!c) return;
        const v = c.value || {};
        out.push({ key: c.key, date: v.date, seconds: v.seconds, kind: v.kind, title: v.title, fields: Object.keys(v).sort().join(","),
          blob: v.blob instanceof Blob ? { size: v.blob.size, type: v.blob.type } : null });
        c.continue();
      };
      t.oncomplete = () => { db.close(); res({ list: out }); };
    };
  }));
  const stateNow = page => page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}"));
  // Audio in storage, by any of the shapes it could take: a data: URL, base64,
  // an object URL, the database's name, or a field holding a Blob (which
  // JSON writes as {}). Every localStorage key is read, not only the state —
  // except the token, whose NAME is tested before anything reads it: no gate
  // ever calls getItem("brickford_gh_token").
  const audioInStorage = page => page.evaluate(() => {
    const hits = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k === "brickford_gh_token") continue;
      const v = localStorage.getItem(k) || "";
      const m = /data:audio|;base64,|blob:|brickford_audio|"(audio|blob|clip|chunks?)"\s*:/i.exec(v);
      if (m) hits.push(k + ": \"" + v.slice(Math.max(0, m.index - 30), m.index + 40) + "\"");
    }
    return hits;
  });
  const recState = page => page.evaluate(() => {
    const b = document.querySelector("#view .pr-rec"), d = b && b.querySelector(".pr-dot"), t = document.querySelector("#view .pr-time");
    const cs = d && getComputedStyle(d);
    return b ? { on: b.getAttribute("aria-pressed") === "true", label: b.getAttribute("aria-label") || "", time: t ? t.textContent.trim() : "",
      w: d.getBoundingClientRect().width, radius: cs ? parseFloat(cs.borderTopLeftRadius) : 0, focus: document.activeElement === b } : null;
  });
  const clipRows = page => page.evaluate(() => [...document.querySelectorAll("#view .pr-clip")].map(r => ({
    key: r.dataset.clip, title: (r.querySelector(".pr-name") || {}).value || "", meta: ((r.querySelector(".pr-meta") || {}).textContent || "").trim(),
    audio: r.querySelector("audio") ? r.querySelector("audio").getAttribute("src") || "" : null,
    dl: r.querySelector("a[download]") ? { href: r.querySelector("a[download]").getAttribute("href") || "", name: r.querySelector("a[download]").getAttribute("download") || "" } : null,
  })));
  const pickTab = async (page, k) => {
    await page.click("#view [data-ptab=" + k + "]");
    await page.waitForFunction(k => { const b = document.querySelector("#view [data-ptab=" + k + "]"); return b && b.getAttribute("aria-pressed") === "true"; }, k, { timeout: 4000 });
  };
  const press = async (page, how) => {
    if (how === "key") { await page.focus("#view .pr-rec"); await page.keyboard.press("Enter"); }
    else if (how === "tap") await page.tap("#view .pr-rec");
    else await page.click("#view .pr-rec");
  };
  const DAY = new Date(TODAY + "T00:00:00Z").toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).replace(",", "");
  async function micFresh(br, w, state, now, init, base) {
    const ctx = await br.newContext({ viewport: { width: w, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: w < 860, isMobile: w < 860,
      ...(base ? { serviceWorkers: "block" } : {}) });
    await ctx.route(/^https?:/, r => { if (base && r.request().url().startsWith(base.replace(/#$/, "").replace(/index\.html$/, ""))) return r.continue();
      if (/api\.github\.com/.test(r.request().url())) githubHits++; return r.abort(); });
    await ctx.clock.setFixedTime(new Date((now || TODAY) + "T12:00:00Z"));
    if (state) await ctx.addInitScript(s => { if (window.top === window && !sessionStorage.getItem("__seeded")) { sessionStorage.setItem("__seeded", "1"); localStorage.setItem("darhikmah_v1", s); } }, JSON.stringify(state));
    await ctx.addInitScript(countWrites);
    for (const f of [].concat(init || [])) await ctx.addInitScript(f);
    const page = await ctx.newPage();
    const errors = [], dialogs = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("dialog", d => { dialogs.push(d.message()); d.accept().catch(() => {}); });
    await page.goto((base || URL) + "/practice", { waitUntil: "load" });
    await page.waitForSelector("#view .seg");
    return { ctx, page, errors, dialogs };
  }
  const P_STATE = { settings: { theme: "dark", themeNavyOnce: true } };

  for (const w of WIDTHS) {
    const how = w < 860 ? "tap" : "key", at = w + "px (" + (how === "tap" ? "tapped" : "keyboard") + ")";
    const { ctx, page, errors, dialogs } = await micFresh(micBrowser, w, P_STATE);
    try {
      const w0 = await writes(page);
      await pickTab(page, "story");
      // The list is filled from IndexedDB after the render: wait for it.
      await page.waitForFunction(() => { const l = document.querySelector("#view #prClips"); return l && l.getAttribute("aria-busy") === "false"; }, null, { timeout: 5000 });
      check("(p) " + at + ": opening Practice, switching to Story and reading the recordings wrote nothing", (await writes(page)) === w0, (await writes(page)) - w0 + " write(s)");
      const r0 = await recState(page);
      check("(p) " + at + ": the record button is idle, labelled, and the timer reads 0:00 / 1:30",
        !!r0 && !r0.on && /record/i.test(r0.label) && r0.time === "0:00 / 1:30", JSON.stringify(r0));
      await press(page, how);
      await page.waitForFunction(() => { const b = document.querySelector("#view .pr-rec"); return b && b.getAttribute("aria-pressed") === "true"; }, null, { timeout: 5000 });
      // About two seconds, measured by the page's own timer.
      await page.waitForFunction(() => /^0:0[2-9] \/ 1:30$/.test(((document.querySelector("#view .pr-time") || {}).textContent || "").trim()), null, { timeout: 8000 });
      const r1 = await recState(page);
      check("(p) " + at + ": while recording the button says Stop, the dot is a rounded square (radius under half its width), and the timer counts m:ss / 1:30",
        !!r1 && r1.on && /stop/i.test(r1.label) && r1.radius < r1.w / 2 - 1 && /^0:0[2-9] \/ 1:30$/.test(r1.time) && (how !== "key" || r1.focus),
        JSON.stringify(r1));
      await shot(page, "flow-p-recording-" + w);
      check("(p) " + at + ": nothing was written while recording", (await writes(page)) === w0, (await writes(page)) - w0 + " write(s)");
      await press(page, how);
      // The list is drawn by the render that follows the save, so a row on
      // screen means the rep, if it was logged, is already stored.
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      const db = await clipsInDB(page), c = db.list[0] || {};
      check("(p) " + at + ": one clip in IndexedDB brickford_audio/clips, key " + TODAY + "-1, { date, seconds >= 1, kind story, title \"Story · " + DAY + "\" } and a non-empty audio Blob",
        db.list.length === 1 && c.key === TODAY + "-1" && c.date === TODAY && c.seconds >= 1 && c.kind === "story" && c.title === "Story · " + DAY &&
          !!c.blob && c.blob.size > 0 && /^audio\//.test(c.blob.type), JSON.stringify(db));
      const st = await stateNow(page), story = (st.reps || {}).story || [];
      const ev = (st.ledger || [])[(st.ledger || []).length - 1] || {};
      check("(p) " + at + ": reps.story gains exactly one entry for today, { date, seconds, takes, from } with the clip's seconds, through the form's path (chain: rep story)",
        story.length === 1 && story[0].date === TODAY && story[0].seconds === c.seconds && Object.keys(story[0]).join(",") === "date,seconds,takes,from" &&
          ev.type === "rep" && ev.ref === "story" && ev.data && ev.data.seconds === c.seconds,
        JSON.stringify(story) + " ev " + JSON.stringify({ type: ev.type, ref: ev.ref, data: ev.data }));
      const hits = await audioInStorage(page);
      check("(p) " + at + ": no audio anywhere in localStorage (no data: URL, base64, object URL, database name or Blob field)", hits.length === 0, hits.join(" | "));
      const r2 = await recState(page);
      check("(p) " + at + ": after stop the button is idle again and holds the focus" + (how === "key" ? "" : " (or the page did not move it)"),
        !!r2 && !r2.on && r2.time === "0:00 / 1:30" && (how !== "key" || r2.focus), JSON.stringify(r2));
      let rows = await clipRows(page);
      check("(p) " + at + ": the list shows it: \"Story · " + DAY + "\", \"" + DAY + " · 0:0" + c.seconds + "\", with a download link to a blob: URL",
        rows.length === 1 && rows[0].key === TODAY + "-1" && rows[0].title === "Story · " + DAY && rows[0].meta === DAY + " · " + "0:" + String(c.seconds).padStart(2, "0") &&
          !!rows[0].dl && /^blob:/.test(rows[0].dl.href) && /\.(webm|ogg|mp4|m4a|wav)$/.test(rows[0].dl.name), JSON.stringify(rows));
      check("(p) " + at + ": no <audio> until play is pressed", rows.length === 1 && rows[0].audio === null, JSON.stringify(rows));
      await page.click("#view .pr-clip .pr-play");
      await page.waitForFunction(() => !!document.querySelector("#view .pr-clip audio"), null, { timeout: 4000 }).catch(() => {});
      rows = await clipRows(page);
      check("(p) " + at + ": play creates its <audio>, and its src is a blob: URL", rows.length === 1 && /^blob:/.test(rows[0].audio || ""), JSON.stringify(rows));
      // Renamed inline: the title field, typed into and left.
      const wR = await writes(page);
      await page.fill("#view .pr-clip .pr-name", "The napkin one");
      await page.press("#view .pr-clip .pr-name", "Enter");
      await page.waitForFunction(() => new Promise(res => {
        const q = indexedDB.open("brickford_audio");
        q.onsuccess = () => { const t = q.result.transaction("clips"); const g = t.objectStore("clips").get(document.querySelector("#view .pr-clip").dataset.clip);
          g.onsuccess = () => { q.result.close(); res(!!g.result && g.result.title === "The napkin one"); }; };
        q.onerror = () => res(false);
      }), null, { timeout: 4000 }).catch(() => {});
      const db2 = await clipsInDB(page);
      check("(p) " + at + ": the title renames inline: IndexedDB holds \"The napkin one\", and nothing is written to localStorage",
        db2.list.length === 1 && db2.list[0].title === "The napkin one" && (await writes(page)) === wR, JSON.stringify(db2.list.map(x => x.title)) + ", " + ((await writes(page)) - wR) + " write(s)");
      // Delete, after a confirm.
      const wD = await writes(page), nDialogs = dialogs.length;
      await page.click("#view .pr-clip [data-clip-del]");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 0, null, { timeout: 4000 }).catch(() => {});
      const db3 = await clipsInDB(page), st3 = await stateNow(page);
      check("(p) " + at + ": delete asks first, then removes the clip from IndexedDB and the list; the rep stays logged; nothing written to localStorage",
        dialogs.length === nDialogs + 1 && /delete/i.test(dialogs[dialogs.length - 1] || "") && db3.list.length === 0 && (await clipRows(page)).length === 0 &&
          ((st3.reps || {}).story || []).length === 1 && (await writes(page)) === wD,
        "dialogs " + JSON.stringify(dialogs.slice(nDialogs)) + ", clips " + db3.list.length + ", reps.story " + ((st3.reps || {}).story || []).length);
      await shot(page, "flow-p-deleted-" + w);
    } catch (e) { check("(p) " + at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(p) " + at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // The 1:30 stop, on a limit shortened through the one hook (window.__recLimit,
  // read only when defined), on the Humour tab: ONE press, and it stops itself.
  {
    const { ctx, page, errors } = await micFresh(micBrowser, 1280, P_STATE);
    try {
      await pickTab(page, "humor");
      await page.evaluate(() => { window.__recLimit = 2; });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => { const b = document.querySelector("#view .pr-rec"); return b && b.getAttribute("aria-pressed") === "true"; }, null, { timeout: 5000 });
      const r1 = await recState(page);
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 10000 });
      const db = await clipsInDB(page), st = await stateNow(page), humor = (st.reps || {}).humor || [], c = db.list[0] || {};
      const r2 = await recState(page);
      check("(p) auto-stop: with window.__recLimit = 2 one press records, the timer reads m:ss / 0:02, and it stops on its own at the limit",
        !!r1 && r1.on && / \/ 0:02$/.test(r1.time) && !!r2 && !r2.on, JSON.stringify({ r1, r2 }));
      check("(p) auto-stop: one humour clip, 1 to 3 seconds, title \"Humour · " + DAY + "\"",
        db.list.length === 1 && c.kind === "humor" && c.seconds >= 1 && c.seconds <= 3 && c.title === "Humour · " + DAY && !!c.blob && c.blob.size > 0, JSON.stringify(db.list));
      check("(p) auto-stop: logged through the humour rep path — reps.humor gains one entry for today, reps.story none",
        humor.length === 1 && humor[0].date === TODAY && humor[0].seconds === c.seconds && ((st.reps || {}).story || []).length === 0, JSON.stringify(st.reps));
    } catch (e) { check("(p) auto-stop: the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(p) auto-stop: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // A rest day: "Nothing owed today" above the recorder, and recording still
  // works — the clip is kept; the rep path refuses a rest day, as it always has.
  {
    const SAT = "2026-10-24";
    const { ctx, page, errors } = await micFresh(micBrowser, 390, P_STATE, SAT);
    try {
      const o = await page.evaluate(() => {
        const rest = [...document.querySelectorAll("#view .card")].find(c => /Nothing owed today/.test(c.textContent));
        const btn = document.querySelector("#view .pr-rec");
        return { rest: !!rest, above: !!rest && !!btn && rest.getBoundingClientRect().bottom <= btn.getBoundingClientRect().top };
      });
      check("(p) a Saturday: the \"Nothing owed today\" card sits above the recorder", o.rest && o.above, JSON.stringify(o));
      await page.tap("#view .pr-rec");
      await page.waitForFunction(() => /^0:0[1-9]/.test(((document.querySelector("#view .pr-time") || {}).textContent || "").trim()), null, { timeout: 8000 });
      await page.tap("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      const db = await clipsInDB(page), st = await stateNow(page);
      check("(p) a Saturday: recording is allowed — the clip is kept (key " + SAT + "-1); no rep is logged on a rest day",
        db.list.length === 1 && db.list[0].key === SAT + "-1" && (((st.reps || {}).story) || []).length === 0, JSON.stringify(db.list.map(x => x.key)) + " " + JSON.stringify(st.reps || {}));
      await shot(page, "flow-p-saturday-390");
    } catch (e) { check("(p) a Saturday: the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(p) a Saturday: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // ---- T-028 review 1: how a recording can end ----
  // The streams the page is handed, captured as getUserMedia returns them, so
  // the harness can end a track under the recorder and read whether the app
  // released the microphone. __gumDelay holds the prompt open that long.
  const captureStreams = () => {
    if (window.top !== window || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    window.__streams = [];
    const g = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async c => {
      if (window.__gumDelay) await new Promise(r => setTimeout(r, window.__gumDelay));
      const s = await g(c);
      window.__streams.push(s);
      return s;
    };
  };
  const allEnded = page => page.waitForFunction(() => window.__streams.length > 0 &&
    window.__streams.every(s => s.getTracks().every(t => t.readyState === "ended")), null, { timeout: 8000 }).then(() => true, () => false);
  const idle = page => page.waitForFunction(() => { const b = document.querySelector("#view .pr-rec");
    return !!b && b.getAttribute("aria-pressed") === "false" && b.getAttribute("aria-busy") === "false"; }, null, { timeout: 8000 }).then(() => true, () => false);
  const timerAt = (page, re) => page.waitForFunction(re => new RegExp(re).test(((document.querySelector("#view .pr-time") || {}).textContent || "").trim()), re, { timeout: 8000 });

  // The recorder stops by itself (the track ended: a device unplugged, the
  // permission revoked). The clip is still finished — numeric seconds, a rep
  // the chain can verify after a reload — and the microphone's timer does not
  // outlive it: the next recording runs to its full length. Review 2: the
  // limit is 3s from the FIRST press, the track ends at about 2s, and the
  // second recording starts the moment the first one's row appears — so a
  // leaked timer from the first (it would call recStop at 3s from the first
  // press) lands inside the second and cuts it under a second. With the limit
  // set only before the second press, the leak would have fired at 90s, long
  // after this case ended, and the check could never fail.
  //
  // T-068: this block reloads over http://127.0.0.1, not file://. Its "none yet" was not the app: read back
  // just before the reload the state held the ledger every time, but headless Chromium starts a reloaded
  // file:// page with localStorage EMPTY about one reload in five (any file:// reload, with or without a
  // microphone, after a 2s wait or none), and lib-reload's retry cannot fire because nothing an unloading
  // document sends ever reaches Playwright, so no unload report arrives. Over http the same reload lost
  // nothing in 120 tries. loop/specs/T-068-batch2-fixes/verification/p-diagnosis/ has the scripts and counts.
  // The reload is still proven: the stamp written last before it, and the state, must be there at
  // document start, or the reloaded page was never measured and that is said, not "none yet".
  const P_HTTP = await serveDir(path.join(path.resolve(__dirname, ".."), "platform"));
  await acrossReload({ label: "(p) the recorder stops by itself", check, fail: why => check("(p) the recorder stops by itself: " + why, false) }, async (check, reload) => {
    const { ctx, page, errors } = await micFresh(micBrowser, 1280, P_STATE, null, captureStreams, P_HTTP.base);
    try {
      await pickTab(page, "story");
      await page.evaluate(() => { window.__recLimit = 3; });
      await page.click("#view .pr-rec");
      await timerAt(page, "^0:02 ");
      await page.evaluate(() => window.__streams.forEach(s => s.getTracks().forEach(t => t.stop())));
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      const idleAfter = await idle(page);
      // The second recording, at once: inside the first one's 3s.
      await page.click("#view .pr-rec");
      const db = await clipsInDB(page), st = await stateNow(page), story = (st.reps || {}).story || [];
      const ev = (st.ledger || [])[(st.ledger || []).length - 1] || {};
      const hist = await page.evaluate(() => document.querySelector("#view .pr-log") ? document.querySelector("#view .pr-log").textContent : "");
      check("(p) the track ends under the recorder: the clip is finished anyway — one clip, one rep whose seconds is a number equal to the clip's, its chain event the same, nothing reading \"undefined\"",
        db.list.length === 1 && story.length === 1 && typeof story[0].seconds === "number" && story[0].seconds >= 1 && story[0].seconds === db.list[0].seconds &&
          !!ev.data && ev.data.seconds === story[0].seconds && !/undefined/.test(hist) && !/undefined/.test(JSON.stringify(st.reps)),
        JSON.stringify({ clips: db.list.map(c => [c.key, c.seconds]), story, ev: ev.data }));
      check("(p) the track ends under the recorder: the button is idle again", idleAfter, "");
      await page.waitForFunction(() => document.querySelector("#view .pr-rec").getAttribute("aria-pressed") === "true", null, { timeout: 5000 });
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 2, null, { timeout: 10000 }).catch(() => {});
      const db2 = await clipsInDB(page), second = db2.list.find(c => c.key === TODAY + "-2");
      check("(p) the track ends under the recorder: the next recording, started inside the first one's 3s, runs to its full length (3 of a 3s limit), not cut short by the first one's timer",
        !!second && second.seconds === 3, JSON.stringify(db2.list.map(c => [c.key, c.seconds])));
      const proof = await reload(page, { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      check("(p) the track ends under the recorder: the reload is measured, the stamp written last before it and the state both there at document start",
        !!proof.boot.state && proof.boot.local === proof.stamp, JSON.stringify(proof.boot));
      await go(page, "/record", P_HTTP.base);
      const seals = await page.evaluate(() => { const g = [...document.querySelectorAll("#view .ghead")].find(x => /Latest seals/.test(x.textContent));
        return g ? ((g.querySelector(".gh-meta") || {}).textContent || "").trim() : null; });
      check("(p) the track ends under the recorder: after a reload /record says the chain is whole (\"newest first\", not \"chain broken\")", seals === "newest first", String(seals));
    } catch (e) { check("(p) the recorder stops by itself: the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(p) the recorder stops by itself: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  });
  await P_HTTP.close();

  // A start still waiting on the microphone prompt (held open 1.5s) is
  // cancelled by leaving the page or picking another tab: the stream that
  // arrives afterwards is released, and nothing is recorded or logged.
  for (const what of ["leave", "tab"]) {
    const at = "(p) the prompt is open and the reader " + (what === "leave" ? "leaves the page" : "picks Humour");
    const { ctx, page, errors } = await micFresh(micBrowser, 1280, P_STATE, null, captureStreams);
    try {
      await pickTab(page, "story");
      const w0 = await writes(page);
      await page.evaluate(() => { window.__gumDelay = 1500; });
      await page.click("#view .pr-rec");
      const wait = await page.waitForFunction(() => { const b = document.querySelector("#view .pr-rec");
        return b.getAttribute("aria-busy") === "true" && /^Starting/.test(document.querySelector("#view .pr-time").textContent); }, null, { timeout: 2000 }).then(() => true, () => false);
      check(at + ": while the prompt is open the button shows it is starting (aria-busy, \"Starting…\")", wait, "");
      if (what === "leave") await page.evaluate(() => { location.hash = "#/"; });
      else await page.click("#view [data-ptab=humor]");
      const ended = await allEnded(page);
      if (what === "leave") { await go(page, "/practice"); await pickTab(page, "story"); }
      const db = await clipsInDB(page), st = await stateNow(page), b = await recState(page);
      check(at + ": the stream that arrives after is released (every track ended), no clip, no rep, nothing written, and the button on screen is idle",
        ended && db.list.length === 0 && !((st.reps || {}).story || []).length && !((st.reps || {}).humor || []).length && (await writes(page)) === w0 && !!b && !b.on && !/^Starting/.test(b.time),
        JSON.stringify({ ended, clips: db.list.length, reps: st.reps || null, writes: (await writes(page)) - w0, button: b }));
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // Under a second is not a rep: a double tap 30ms apart, and a stop 150ms
  // into a recording, keep nothing and log nothing.
  {
    const { ctx, page, errors } = await micFresh(micBrowser, 1280, P_STATE, null, captureStreams);
    try {
      await pickTab(page, "story");
      await page.evaluate(() => { const b = () => document.querySelector("#view .pr-rec"); b().click(); setTimeout(() => b().click(), 30); });
      const ended = await allEnded(page), still = await idle(page);
      await page.waitForFunction(() => document.querySelector("#view #prClips").getAttribute("aria-busy") === "false", null, { timeout: 5000 });
      const db = await clipsInDB(page), st = await stateNow(page);
      check("(p) a double tap 30ms apart: the microphone is released, the button is idle, no clip and no rep",
        ended && still && db.list.length === 0 && !((st.reps || {}).story || []).length, JSON.stringify({ ended, still, clips: db.list.length, reps: st.reps || null }));
      await page.evaluate(() => { const t = document.querySelector("#toast"); window.__toasts = []; new MutationObserver(() => window.__toasts.push(t.textContent)).observe(t, { childList: true, characterData: true, subtree: true }); });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelector("#view .pr-rec").getAttribute("aria-pressed") === "true", null, { timeout: 5000 });
      await page.waitForTimeout(150);                       // the length under test, not a settle
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => window.__toasts.length > 0, null, { timeout: 5000 });
      const db2 = await clipsInDB(page), st2 = await stateNow(page), said = await page.evaluate(() => window.__toasts.join(" | "));
      check("(p) stopped 150ms in: nothing kept, nothing logged, and the reader is told (\"Under a second…\")",
        db2.list.length === 0 && !((st2.reps || {}).story || []).length && /^Under a second/.test(said), JSON.stringify({ clips: db2.list.length, reps: st2.reps || null, said }));
    } catch (e) { check("(p) under a second: the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(p) under a second: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // Review 2: MediaRecorder.start() throws (a recorder in a bad state). The
  // microphone is released, the hand form appears as for a refused prompt,
  // nothing is logged, and nothing escapes as a page error.
  {
    const at = "(p) MediaRecorder.start() throws";
    const { ctx, page, errors } = await micFresh(micBrowser, 1280, P_STATE, null, [captureStreams, () => {
      if (window.top === window && window.MediaRecorder) MediaRecorder.prototype.start = function () { throw new DOMException("bad state", "InvalidStateError"); };
    }]);
    try {
      await pickTab(page, "story");
      const w0 = await writes(page);
      await page.click("#view .pr-rec");
      const fell = await page.waitForFunction(() => /Microphone not available, so log it by hand/.test((document.querySelector("#view .pr-pane") || {}).textContent || ""), null, { timeout: 5000 }).then(() => true, () => false);
      const ended = await allEnded(page);
      const f = await page.evaluate(() => ({ rec: !!document.querySelector("#view .pr-rec"), form: !!document.querySelector("#view #repSecs") && !!document.querySelector("#view [data-act=repStory]"),
        live: window.__streams.reduce((n, s) => n + s.getTracks().filter(t => t.readyState === "live").length, 0) }));
      const db = await clipsInDB(page), st = await stateNow(page);
      check(at + ": the fallback line and the hand form appear, the record button is gone, no track is live, no clip, nothing logged or written",
        fell && ended && f.form && !f.rec && f.live === 0 && db.list.length === 0 && !((st.reps || {}).story || []).length && (await writes(page)) === w0,
        JSON.stringify({ fell, ended, f, clips: db.list.length, reps: st.reps || null, writes: (await writes(page)) - w0 }));
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  await micBrowser.close();

  // (q) No microphone. Twice: the permission denied (getUserMedia stubbed to
  // reject with NotAllowedError, as a refused prompt does), and no device at
  // all (the plain Chromium, which has none: NotFoundError). Each time the
  // card shows the one line and the manual form, and logging by hand works.
  const NOMIC = [
    { name: "permission denied", init: () => {
      if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException("Permission denied", "NotAllowedError"));
    } },
    { name: "no device", init: null },
  ];
  for (const nm of NOMIC) for (const w of WIDTHS) {
    const at = w + "px, " + nm.name;
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: w < 860, isMobile: w < 860 });
    await ctx.route(/^https?:/, r => { if (/api\.github\.com/.test(r.request().url())) githubHits++; return r.abort(); });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    if (nm.init) await ctx.addInitScript(nm.init);
    await ctx.addInitScript(countWrites);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    try {
      await page.goto(URL + "/practice", { waitUntil: "load" });
      await page.waitForSelector("#view .seg");
      await pickTab(page, "story");
      if (w < 860) await page.tap("#view .pr-rec"); else await page.click("#view .pr-rec");
      await page.waitForFunction(() => /Microphone not available, so log it by hand/.test((document.querySelector("#view .pr-pane") || {}).textContent || ""), null, { timeout: 5000 }).catch(() => {});
      const f = await page.evaluate(() => {
        const p = document.querySelector("#view .pr-pane"), vis = s => { const e = p && p.querySelector(s); return !!e && e.checkVisibility(); };
        return { line: /Microphone not available, so log it by hand/.test((p || {}).textContent || ""), rec: !!document.querySelector("#view .pr-rec"),
          form: vis("#repSecs") && vis("#repTakes") && vis("#repWhich") && vis("[data-act=repStory]") };
      });
      check("(q) " + at + ": Story — the fallback line and the manual form (seconds, takes, which, Log the rep) appear; no record button",
        f.line && f.form && !f.rec, JSON.stringify(f));
      await shot(page, "flow-q-nomic-" + w + "-" + nm.name.replace(/ /g, "-"));
      await page.fill("#repSecs", "75"); await page.fill("#repTakes", "2"); await page.fill("#repWhich", "the napkin one");
      await markView(page);
      await page.click("#view [data-act=repStory]");
      await viewReplaced(page);
      const st = await stateNow(page), story = (st.reps || {}).story || [];
      check("(q) " + at + ": logging by hand still works — reps.story { date, seconds 75, takes 2, from \"the napkin one\" }",
        story.length === 1 && JSON.stringify(story[0]) === JSON.stringify({ date: TODAY, seconds: 75, takes: 2, from: "the napkin one" }), JSON.stringify(story));
      await pickTab(page, "humor");
      const h = await page.evaluate(() => {
        const p = document.querySelector("#view .pr-pane");
        return { line: /Microphone not available, so log it by hand/.test((p || {}).textContent || ""), rec: !!document.querySelector("#view .pr-rec"),
          fields: [0, 1, 2, 3, 4].every(k => { const e = document.getElementById("joke" + k); return !!e && e.checkVisibility(); }) };
      });
      check("(q) " + at + ": Humour — once the microphone has failed, the same line, and the five attempts open (not folded); no record button",
        h.line && h.fields && !h.rec, JSON.stringify(h));
      for (let k = 0; k < 5; k++) await page.fill("#joke" + k, "attempt " + (k + 1));
      await markView(page);
      await page.click("#view [data-act=repHumor]");
      await viewReplaced(page);
      const humor = ((await stateNow(page)).reps || {}).humor || [];
      check("(q) " + at + ": Humour logs by hand as before — five attempts, no keeper", humor.length === 1 && humor[0].attempts.length === 5 && humor[0].keeper === 0, JSON.stringify(humor));
    } catch (e) { check("(q) " + at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(q) " + at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // (q) on a Saturday, permission denied, at 390: the hand panes draw no Log
  // button that could only refuse — the line "Nothing owed today" instead —
  // on Story (once the microphone has failed), Humour and Story bank.
  {
    const at = "390px, permission denied, Sat 24 Oct";
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: true, isMobile: true });
    await ctx.route(/^https?:/, r => { if (/api\.github\.com/.test(r.request().url())) githubHits++; return r.abort(); });
    await ctx.clock.setFixedTime(new Date("2026-10-24T12:00:00Z"));
    await ctx.addInitScript(NOMIC[0].init);
    await ctx.addInitScript(countWrites);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    try {
      await page.goto(URL + "/practice", { waitUntil: "load" });
      await page.waitForSelector("#view .seg");
      await pickTab(page, "story");
      await page.tap("#view .pr-rec");
      await page.waitForFunction(() => !!document.querySelector("#view .pr-nomic"), null, { timeout: 5000 });
      const pane = () => page.evaluate(() => { const p = document.querySelector("#view .pr-pane");
        return { nomic: !!p.querySelector(".pr-nomic"), rest: ((p.querySelector(".pr-rest") || {}).textContent || "").trim(),
          log: [...document.querySelectorAll("#view .pr-pane [data-act^=rep]")].map(b => b.dataset.act), fields: p.querySelectorAll("input, textarea").length }; });
      const out = { story: await pane() };
      await pickTab(page, "humor"); out.humor = await pane();
      await pickTab(page, "bank"); out.bank = await pane();
      check("(q) " + at + ": Story, Humour and Story bank each say \"Nothing owed today.\" and draw no Log button and no fields; Story and Humour still say the microphone is not available",
        ["story", "humor", "bank"].every(k => out[k].rest === "Nothing owed today." && out[k].log.length === 0 && out[k].fields === 0) && out.story.nomic && out.humor.nomic,
        JSON.stringify(out));
    } catch (e) { check("(q) " + at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(q) " + at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (r) record on the phone, transcribe on the laptop (T-046 v2) ----
  // loop/specs/T-046-transcripts-v2/spec.md. A third Chromium, with the fake
  // microphone and --allow-file-access-from-files: a module Worker cannot be
  // made from a file:// page without it (SecurityError, origin 'null' —
  // measured in October), and the app is served over https in use. The pinned
  // library URL is routed to a stub module whose pipeline() returns a canned
  // transcript after a 400ms busy loop (the model's work: a long task on
  // whichever thread runs it); the stub posts what it was asked for to
  // https://tx-stub.test/report, which the harness answers itself. GitHub is
  // answered by ghStub below (the private repo's state file, its audio/
  // folder, uploads), so nothing reaches api.github.com, jsdelivr or
  // huggingface.co. "Desktop" is 1280px with no touch ((pointer: fine));
  // "phone" is 390px with touch ((pointer: coarse)) — measured.
  console.log("\nrecord on the phone, transcribe on the laptop (T-046)");
  const TX_PINNED = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";
  const TX_PRIV = "/repos/Nexline1/brickford-private";
  const TX_SRC = fs.readFileSync(path.join(path.resolve(__dirname, ".."), "platform/js/app.js"), "utf8");
  const txConst = n => (new RegExp("const " + n + " = \"([^\"]*)\"").exec(TX_SRC) || [])[1];
  const TX_MODEL = txConst("TX_MODEL"), TX_REVISION = txConst("TX_REVISION"), TX_MB = +((/const TX_MODEL_MB = (\d+);/.exec(TX_SRC) || [])[1]);
  // The canned transcript: every filler rule fires once and is refused once.
  // "I like it" (a verb), "Things like that" (a preposition), "a kind of map"
  // (after a determiner) and "Is that right?" (a question, no comma) are not
  // fillers; "So" alone opens a story and is not one either.
  const TX_CHUNKS = [
    { text: " So um, last Tuesday a client asked me, like, what an embedding actually is.", timestamp: [0, 4.2] },
    { text: " I like it. Things like that matter.", timestamp: [4.2, 6.8] },
    { text: " You know, I drew arrows on a napkin, you know, king minus man plus woman.", timestamp: [6.8, 11.5] },
    { text: " I mean, it was a kind of map. I kind of froze.", timestamp: [11.5, 14.9] },
    { text: " Okay so she said it back, right? Is that right? Uh, so yeah.", timestamp: [14.9, 19.0] },
  ];
  const TX_TEXT = TX_CHUNKS.map(c => c.text).join("");
  // Worked out by hand from the text above, in reading order.
  const TX_STRUCK = ["um", "like", "actually", "You know", "you know", "I mean", "kind of", "Okay so", "right", "Uh", "so yeah"];
  const TX_CHIPS = ["11 fillers to cut", "um ×1", "like ×1", "actually ×1", "you know ×2", "I mean ×1", "kind of ×1", "okay so ×1",
    "right? ×1", "uh ×1", "so yeah ×1"];
  // Words by whitespace: a different count from the app's word pattern.
  const TX_WORDS = TX_TEXT.trim().split(/\s+/).filter(t => /[A-Za-z0-9]/.test(t)).length;
  const TX_MARK = "king minus man plus woman";     // a phrase only the transcript holds
  const TX_ASK = "Download the speech model (~" + TX_MB + " MB, once)? It runs on this device; your audio never leaves your devices and your private repo. Each transcription then takes about a minute per 30 seconds of speech.";
  const TX_UPFAIL = "Audio stays on this device until your token can reach brickford-private";
  const txStub = mode => `
const report = o => fetch("https://tx-stub.test/report", { method: "POST", body: JSON.stringify(o) }).catch(() => {});
const wait = ms => new Promise(r => setTimeout(r, ms));
export const env = {};
export async function pipeline(task, model, opts) {
  opts = opts || {};
  const cb = typeof opts.progress_callback === "function" ? opts.progress_callback : () => {};
  for (const p of [0, 40, 100]) { cb({ status: "progress_total", progress: p, loaded: p, total: 100 }); await wait(80); }
  return async function (audio, o) {
    o = o || {};
    await report({ task, model, revision: opts.revision, dtype: opts.dtype, device: opts.device, f32: audio instanceof Float32Array,
      len: audio && audio.length, timestamps: o.return_timestamps, chunk: o.chunk_length_s, language: o.language, job: o.task });
    // The model's work, in a task of its own: a timer task is reported as a long
    // task wherever it runs (a loop straight after a fetch's await was measured not to be).
    await new Promise(r => setTimeout(() => { const t0 = performance.now(); while (performance.now() - t0 < 400) {} r(); }, 0));
    if (o.streamer && typeof o.streamer.end === "function") o.streamer.end();
    await wait(150);
    ${mode === "oom" ? "throw new RangeError(\"Array buffer allocation failed\");"
      : mode === "silence" ? "return { text: \" [BLANK_AUDIO]\", chunks: [{ text: \" [BLANK_AUDIO]\", timestamp: [0, 2] }] };"
      : "return " + JSON.stringify({ text: TX_TEXT, chunks: TX_CHUNKS }) + ";"}
  };
}`;
  // A 2.0s 440 Hz tone, 16-bit PCM WAV at 48 kHz (so the page has to resample it to 16 kHz).
  const txWavBytes = () => {
    const rate = 48000, n = rate * 2, b = Buffer.alloc(44 + n * 2);
    b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVE", 8); b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
    b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 2, 40);
    for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(8000 * Math.sin(2 * Math.PI * 440 * i / rate)), 44 + i * 2);
    return b;
  };
  // GitHub, answered here. The private repo's state file (an empty remote),
  // its audio/ folder (o.remote: [{ name, sha, bytes }], else 404), the raw
  // bytes of a file in it, and uploads (o.putFail() true: a 403). Anything
  // else, including any path of the public repo, is a 404. Every request is
  // logged as it arrived; a PUT's content is decoded.
  function ghStub(o) {
    const log = [];
    const handler = route => {
      const q = route.request(), u = new globalThis.URL(q.url()), m = q.method(), p = u.pathname;
      const ent = { method: m, url: q.url(), path: p, accept: q.headers().accept || "" };
      if (m === "PUT") { try { const b = JSON.parse(q.postData() || "{}"); ent.message = b.message; ent.content = Buffer.from(b.content || "", "base64"); } catch (e) { ent.bad = true; } }
      log.push(ent);
      const json = (status, body) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
      if (p === TX_PRIV + "/contents/progress/brickford-state.json")
        return m === "GET" ? json(200, { sha: "state0", content: Buffer.from("{}").toString("base64") }) : json(200, { content: { sha: "state1" } });
      if (p === TX_PRIV + "/contents/audio" && m === "GET")
        return o.remote ? json(200, o.remote.map(f => ({ name: f.name, path: "audio/" + f.name, sha: f.sha, size: f.bytes.length, type: "file" }))) : json(404, { message: "Not Found" });
      const f = p.startsWith(TX_PRIV + "/contents/audio/") ? p.slice((TX_PRIV + "/contents/audio/").length) : null;
      if (f && m === "PUT") return o.putFail && o.putFail() ? json(403, { message: "Resource not accessible by personal access token" })
        : json(201, { content: { sha: "upsha" + log.filter(x => x.method === "PUT" && x.path === p).length, path: "audio/" + f } });
      if (f && m === "GET") {
        const r = (o.remote || []).find(x => x.name === f);
        if (!r) return json(404, { message: "Not Found" });
        return /raw/.test(ent.accept) ? route.fulfill({ status: 200, contentType: "application/octet-stream", body: r.bytes }) : json(200, { sha: r.sha, size: r.bytes.length });
      }
      return json(404, { message: "Not Found" });
    };
    return { log, handler, puts: () => log.filter(x => x.method === "PUT"), audioPuts: () => log.filter(x => x.method === "PUT" && /\/contents\/audio\//.test(x.path)) };
  }
  // Watched from document start: every Worker the page makes, every long
  // task, and every text a transcription status line shows as it changes.
  const txWatch = () => {
    if (window.top !== window) return;
    window.__workers = [];
    const W = window.Worker;
    if (typeof W === "function") window.Worker = function (url, opts) { window.__workers.push({ url: String(url), type: (opts || {}).type || "classic" }); return new W(url, opts); };
    window.__long = [];
    try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__long.push({ at: e.startTime, ms: e.duration }))).observe({ type: "longtask", buffered: true }); } catch (e) { /* none */ }
    window.__lines = [];
    new MutationObserver(() => document.querySelectorAll("#view .tx-line").forEach(l => {
      const t = l.textContent.trim(); if (window.__lines[window.__lines.length - 1] !== t) window.__lines.push(t); }))
      .observe(document, { subtree: true, childList: true, characterData: true });
  };
  const noWorker = () => { if (window.top === window) { window.Worker = undefined; } };
  const txBrowser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--allow-file-access-from-files"] });
  // mode: "speech" | "silence" | "oom" serve the stub; null refuses the URL (the download fails).
  // o: { token, remote, putFail, init, boot }.
  async function txFresh(w, mode, state, o) {
    o = o || {};
    const ctx = await txBrowser.newContext({ viewport: { width: w, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: w < 860, isMobile: w < 860 });
    const net = { lib: 0, hf: 0, other: 0, reports: [] }, gh = ghStub(o);
    await ctx.route(/^https?:/, r => { const u = r.request().url(); if (/huggingface\.co/.test(u)) net.hf++; net.other++; return r.abort(); });
    await ctx.route(/^https:\/\/api\.github\.com\//, gh.handler);
    await ctx.route(/^https:\/\/tx-stub\.test\//, r => { try { net.reports.push(JSON.parse(r.request().postData() || "{}")); } catch (e) { net.reports.push({ bad: true }); }
      return r.fulfill({ status: 204, headers: { "access-control-allow-origin": "*" } }); });
    await ctx.route(u => u.href === TX_PINNED, r => { net.lib++; return mode
      ? r.fulfill({ status: 200, contentType: "text/javascript", headers: { "access-control-allow-origin": "*", "cache-control": "no-store" }, body: txStub(mode) })
      : r.abort(); });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
    if (state) await ctx.addInitScript(s => { if (window.top === window && !sessionStorage.getItem("__seeded")) { sessionStorage.setItem("__seeded", "1"); localStorage.setItem("darhikmah_v1", s); } }, JSON.stringify(state));
    if (o.token) await ctx.addInitScript(() => { if (window.top === window) localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness"); });
    await ctx.addInitScript(countWrites);
    await ctx.addInitScript(txWatch);
    for (const f of [].concat(o.init || [])) await ctx.addInitScript(f);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("dialog", d => d.accept().catch(() => {}));
    await page.goto(URL + (o.boot || "/practice"), { waitUntil: "load" });
    await page.waitForSelector(o.boot ? "#view > *" : "#view .seg");
    return { ctx, page, errors, net, gh };
  }
  const until = async (fn, ms) => { for (const t0 = Date.now(); Date.now() - t0 < (ms || 8000);) { if (await fn()) return true; await new Promise(r => setTimeout(r, 100)); } return !!(await fn()); };
  const listRead = page => page.waitForFunction(() => { const l = document.querySelector("#view #prClips"); return l && l.getAttribute("aria-busy") === "false"; }, null, { timeout: 5000 });
  // Every clip as IndexedDB holds it, the transcript included, and its bytes (base64) when asked.
  const txDB = (page, bytes) => page.evaluate(bytes => new Promise(res => {
    const q = indexedDB.open("brickford_audio");
    q.onupgradeneeded = () => q.transaction.abort();
    q.onerror = () => res([]);
    q.onsuccess = () => {
      const db = q.result;
      if (!db.objectStoreNames.contains("clips")) { db.close(); return res([]); }
      const out = [], t = db.transaction("clips", "readonly");
      t.objectStore("clips").openCursor().onsuccess = e => {
        const c = e.target.result;
        if (!c) return;
        const v = c.value || {};
        out.push({ key: c.key, date: v.date, seconds: v.seconds, kind: v.kind, title: v.title, fields: Object.keys(v).sort().join(","),
          size: v.blob ? v.blob.size : 0, type: v.blob ? v.blob.type : "", blob: v.blob, transcript: v.transcript || null, remote: v.remote || null });
        c.continue();
      };
      t.oncomplete = async () => {
        db.close();
        for (const c of out) { if (bytes && c.blob) { const u = new Uint8Array(await c.blob.arrayBuffer()); let s = ""; for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); c.b64 = btoa(s); } delete c.blob; }
        res(out.sort((a, b) => (a.key < b.key ? -1 : 1)));
      };
    };
  }), !!bytes);
  // The transcript anywhere but IndexedDB: every localStorage and
  // sessionStorage value except the token, whose NAME is tested first.
  const txElsewhere = page => page.evaluate(mark => {
    const hits = [];
    for (const [name, st] of [["localStorage", localStorage], ["sessionStorage", sessionStorage]])
      for (let i = 0; i < st.length; i++) {
        const k = st.key(i);
        if (k === "brickford_gh_token") continue;
        const v = st.getItem(k) || "";
        if (v.includes(mark) || /"transcript"\s*:|"chunks"\s*:/.test(v)) hits.push(name + "." + k);
      }
    return hits;
  }, TX_MARK);
  // ...and in nothing sent to GitHub: every PUT's decoded content.
  const txInPuts = gh => gh.puts().filter(x => x.content && (x.content.includes(TX_MARK) || /"(transcript|chunks|transcribe)"\s*:/.test(x.content.toString("latin1")))).map(x => x.path);
  const txCard = page => page.evaluate(() => {
    const d = document.querySelector("#view .pr-clip details.pr-tx");
    if (!d) return null;
    const card = d.querySelector(".tx-text");
    return { open: d.open, struck: [...d.querySelectorAll(".tx-text s.tx-f")].map(s => s.textContent),
      chips: [...d.querySelectorAll(".tx-chips .tx-chip")].map(c => c.textContent.trim()), total: !!d.querySelector(".tx-chips .tx-chip.tx-total:first-child"),
      stats: ((d.querySelector(".tx-stats") || {}).textContent || "").trim(), note: ((d.querySelector(".tx-note") || {}).textContent || "").trim(),
      text: card ? card.textContent : "", select: card ? getComputedStyle(card).userSelect : "", copy: !!d.querySelector("[data-tx-copy]") };
  });
  // A colour equal to --ink-2 as the page computes it: the muted text.
  const mutedIs = () => { const p = document.createElement("span"); p.style.color = "var(--ink-2)"; document.body.appendChild(p); const c = getComputedStyle(p).color; p.remove(); return c; };
  const rowState = page => page.evaluate(mutedIs => {
    const ink2 = (new Function("return (" + mutedIs + ")()"))();
    return [...document.querySelectorAll("#view .pr-clip")].map(r => {
      const line = r.querySelectorAll(".pr-txrow .tx-line");
      return { key: r.dataset.clip, go: !!r.querySelector("[data-tx-go]"), tx: !!r.querySelector("details.pr-tx"), play: !!r.querySelector(".pr-play"),
        lines: [...line].map(l => l.textContent.trim()), muted: [...line].every(l => getComputedStyle(l).color === ink2) };
    });
  }, mutedIs.toString());
  // Everything of transcription on the page: a phone must show none of it.
  const txAny = page => page.evaluate(() => ({ ask: !!document.querySelector("#view .pr-ask"), go: document.querySelectorAll("#view [data-tx-go]").length,
    card: !!document.querySelector("#view details.pr-tx"), off: !!document.querySelector("#view .pr-txoff"), line: !!document.querySelector("#view .tx-line") }));
  const upLine = page => page.evaluate(mutedIs => { const l = document.querySelector("#view #prUp .pr-upfail"); const ink2 = (new Function("return (" + mutedIs + ")()"))();
    return { lines: document.querySelectorAll("#view .pr-upfail").length, text: l ? l.textContent.trim() : null, muted: !!l && getComputedStyle(l).color === ink2 }; }, mutedIs.toString());
  const asked = page => page.evaluate(() => { const a = document.querySelector("#view .pr-ask");
    return a ? { text: ((a.querySelector(".pr-ask-t") || a).textContent || "").trim().replace(/\s+/g, " "), buttons: [...a.querySelectorAll("button")].map(b => b.textContent.trim()) } : null; });
  // `t` is on the long-task entries' own timeline: document.timeline.currentTime
  // (the fixed clock fakes performance.now onto another — measured in October).
  const txNow = page => page.evaluate(() => ({ workers: window.__workers.slice(), lines: window.__lines.slice(), t: document.timeline.currentTime,
    setting: (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).transcribe }));
  // A playable clip, written straight into IndexedDB the way the recorder keeps one.
  const txSeedWav = ([c, b64]) => new Promise((res, rej) => {
    const s = atob(b64), u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    const blob = new Blob([u], { type: "audio/wav" });
    const q = indexedDB.open("brickford_audio", 1);
    q.onupgradeneeded = () => { if (!q.result.objectStoreNames.contains("clips")) q.result.createObjectStore("clips"); };
    q.onerror = () => rej(q.error);
    q.onsuccess = () => { const t = q.result.transaction("clips", "readwrite");
      t.objectStore("clips").put({ date: c.date, seconds: c.seconds, kind: c.kind, title: c.title, blob: blob }, c.key);
      t.oncomplete = () => { q.result.close(); res(blob.size); }; t.onerror = () => rej(t.error); };
  });
  const TX_WAV = txWavBytes(), TX_WAV64 = TX_WAV.toString("base64");
  const TX_SEED = { key: "2026-10-30-1", date: "2026-10-30", seconds: 72, kind: "story", title: "Story · Fri 30 Oct" };
  const P_STATE_ON = { settings: { theme: "dark", themeNavyOnce: true, transcribe: "on" } };
  // Seed a clip, then let the page read it: away and back, a render each (and an open).
  async function txSeeded(page) {
    const n = await page.evaluate(txSeedWav, [TX_SEED, TX_WAV64]);
    await go(page, "/");
    await go(page, "/practice");
    await listRead(page);
    await page.waitForFunction(k => !!document.querySelector("#view .pr-clip[data-clip='" + k + "']"), TX_SEED.key, { timeout: 5000 });
    return n;
  }
  const tap = async (page, sel, w) => { if (w < 860) await page.tap(sel); else await page.click(sel); };
  const recordOne = async (page, w, n) => {
    await press(page, w < 860 ? "tap" : "click");
    await page.waitForFunction(() => /^0:0[2-9] \/ 1:30$/.test(((document.querySelector("#view .pr-time") || {}).textContent || "").trim()), null, { timeout: 8000 });
    await press(page, w < 860 ? "tap" : "click");
    await page.waitForFunction(n => document.querySelectorAll("#view .pr-clip").length === n, n, { timeout: 8000 });
  };
  const privOnly = gh => gh.log.every(x => x.path.startsWith(TX_PRIV + "/"));

  // (r) the phone, 390 (tapped): record a story; it is uploaded to the private
  // repo's audio/ and that is all — no Transcribe, no question, no Worker, no
  // library, no pull of audio/.
  {
    const at = "(r) phone, 390px";
    const { ctx, page, errors, net, gh } = await txFresh(390, "speech", P_STATE, { token: true, remote: [{ name: "2026-10-30-1.wav", sha: "rsha1", bytes: TX_WAV }] });
    try {
      await pickTab(page, "story");
      await listRead(page);
      await recordOne(page, 390, 1);
      const up = await until(() => gh.audioPuts().length >= 1 && gh.audioPuts().length === gh.audioPuts().length, 8000);
      await until(async () => !!((await txDB(page))[0] || {}).remote, 4000);
      const db = await txDB(page, true), c = db[0] || {}, p = gh.audioPuts();
      check(at + ": the saved clip was uploaded once, by a PUT to " + TX_PRIV + "/contents/audio/" + c.key + ".webm, and the bytes sent are the clip's",
        up && p.length === 1 && p[0].path === TX_PRIV + "/contents/audio/" + c.key + ".webm" && !!c.b64 && p[0].content && p[0].content.toString("base64") === c.b64,
        JSON.stringify({ puts: p.map(x => x.path), sent: p[0] && p[0].content && p[0].content.length, size: c.size }));
      check(at + ": the clip's record gained remote { sha, at } — the sha GitHub answered — and nothing else",
        db.length === 1 && c.fields === "blob,date,kind,remote,seconds,title" && !!c.remote && c.remote.sha === "upsha1" && !isNaN(Date.parse(c.remote.at)) && Object.keys(c.remote).join(",") === "sha,at",
        JSON.stringify({ fields: c.fields, remote: c.remote }));
      const any = await txAny(page), s = await txNow(page), u = await upLine(page);
      check(at + ": the phone shows no Transcribe, no question, no transcript and no off line; no Worker was made and the library was never requested",
        !any.ask && any.go === 0 && !any.card && !any.off && !any.line && s.workers.length === 0 && net.lib === 0 && net.hf === 0, JSON.stringify({ any, workers: s.workers.length, lib: net.lib }));
      // A planted phone that asks anyway: answer it, so an import would show.
      if (any.ask) { await page.tap("#view .pr-ask [data-tx=yes]").catch(() => {}); await page.waitForTimeout(2000); }
      await go(page, "/"); await go(page, "/practice"); await listRead(page); await page.waitForTimeout(500);
      const any2 = await txAny(page), s2 = await txNow(page);
      check(at + ": and after leaving and opening Practice again still none of it, and nothing imported",
        !any2.ask && any2.go === 0 && s2.workers.length === 0 && net.lib === 0, JSON.stringify({ any2, workers: s2.workers.length, lib: net.lib }));
      check(at + ": the phone never lists or downloads audio/ (" + gh.log.length + " GitHub requests, all to the private repo), and no failure line",
        !gh.log.some(x => x.method === "GET" && /\/contents\/audio/.test(x.path)) && privOnly(gh) && u.lines === 0 && gh.audioPuts().length === 1,
        JSON.stringify({ log: gh.log.map(x => x.method + " " + x.path), up: u }));
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // (r) the laptop, 1280: record, consent, transcribe; the upload as on the
  // phone; the transcript only on the clip's IndexedDB record.
  {
    const w = 1280, at = "(r) desktop, 1280px";
    const { ctx, page, errors, net, gh } = await txFresh(w, "speech", P_STATE, { token: true });
    try {
      await pickTab(page, "story");
      await listRead(page);
      await recordOne(page, w, 1);
      await page.waitForSelector("#view .pr-ask", { timeout: 5000 }).catch(() => {});
      const a = await asked(page), n0 = await txNow(page);
      check(at + ": once the clip is saved the page asks first — \"" + TX_ASK + "\", Download and Not now — and before the answer nothing is imported, no Worker exists and nothing is stored",
        !!a && a.text === TX_ASK && a.buttons.join("|") === "Download|Not now" && net.lib === 0 && net.hf === 0 && n0.workers.length === 0 && n0.setting === undefined,
        JSON.stringify({ a, lib: net.lib, workers: n0.workers, setting: n0.setting }));
      const before = await txDB(page);
      await page.click("#view .pr-ask [data-tx=yes]");
      await page.waitForFunction(() => !!document.querySelector("#view .pr-clip details.pr-tx"), null, { timeout: 15000 });
      await until(() => gh.audioPuts().length >= 1, 6000);
      const n1 = await txNow(page);
      check(at + ": Download made one module Worker (js/transcribe-worker.js?v=…), and the pinned library was imported once, by it",
        n1.workers.length === 1 && n1.workers[0].type === "module" && /(^|\/)js\/transcribe-worker\.js\?v=\w+$/.test(n1.workers[0].url) && net.lib === 1 && net.hf === 0,
        JSON.stringify({ workers: n1.workers, lib: net.lib, hf: net.hf }));
      const db = await txDB(page), c = db[0] || {}, t = c.transcript || {}, rp = net.reports[0] || {};
      check(at + ": the worker asked for automatic-speech-recognition with " + TX_MODEL + " at revision " + TX_REVISION + " (q8, wasm, English), with timestamps, and was handed 16 kHz mono Float32 PCM (" +
        ((rp.len || 0) / 16000).toFixed(2) + "s for a " + c.seconds + "s clip)",
        net.reports.length === 1 && rp.task === "automatic-speech-recognition" && rp.model === TX_MODEL && rp.revision === TX_REVISION && rp.dtype === "q8" && rp.device === "wasm" &&
          rp.language === "english" && rp.job === "transcribe" && rp.f32 === true && rp.timestamps === true && Math.abs(rp.len / 16000 - c.seconds) <= 1, JSON.stringify(net.reports));
      // T-075: the run shows a clock and an estimate, never a bare percentage
      // (a 6 s clip sat at "Transcribing… 0%" for over a minute and looked dead).
      check(at + ": while it worked the row said \"Loading the speech model… n%\", then \"Transcribing… m:ss · <estimate>. Keep this tab open.\" (a clock, not a percentage)",
        n1.lines.some(l => /^Loading the speech model… \d{1,3}%$/.test(l)) && n1.lines.some(l => /^Transcribing… \d+:\d\d · (about (a minute|\d+ min) on a laptop|about \d+ min left|almost done)\. Keep this tab open\.$/.test(l)) &&
          !n1.lines.some(l => /^Transcribing… \d{1,3}%$/.test(l)) &&
          n1.lines.findIndex(l => /^Transcribing/.test(l)) > n1.lines.findIndex(l => /^Loading/.test(l)), JSON.stringify(n1.lines));
      check(at + ": the transcript is on the clip's IndexedDB record as { text, chunks, model, at } — the stub's text and chunks, model " + TX_MODEL + "@" + TX_REVISION + " — and the audio is untouched",
        db.length === 1 && c.fields === "blob,date,kind,remote,seconds,title,transcript" && Object.keys(t).join(",") === "text,chunks,model,at" && t.text === TX_TEXT &&
          JSON.stringify(t.chunks) === JSON.stringify(TX_CHUNKS) && t.model === TX_MODEL + "@" + TX_REVISION && !isNaN(Date.parse(t.at)) && c.size === (before[0] || {}).size,
        JSON.stringify({ fields: c.fields, keys: Object.keys(t), model: t.model, at: t.at, size: [c.size, (before[0] || {}).size] }));
      check(at + ": the clip was uploaded once to " + TX_PRIV + "/contents/audio/ (the laptop's own recordings go to the private repo too)",
        gh.audioPuts().length === 1 && gh.audioPuts()[0].path === TX_PRIV + "/contents/audio/" + c.key + ".webm" && privOnly(gh), JSON.stringify(gh.log.map(x => x.method + " " + x.path)));
      // The rep's save armed a state push about 4s out: wait for it, then read every PUT.
      const pushed = await until(() => gh.puts().some(x => /brickford-state\.json$/.test(x.path)), 9000);
      const st = await stateNow(page), else1 = await txElsewhere(page), inPut = txInPuts(gh);
      check(at + ": and nowhere else — no storage key holds it, no PUT to GitHub carries it (" + gh.puts().length + " read, the state push among them), the rep is the hand form's shape, the chain has no transcript event; the device remembers only \"on\"",
        pushed && else1.length === 0 && inPut.length === 0 && Object.keys(((st.reps || {}).story || [])[0] || {}).join(",") === "date,seconds,takes,from" &&
          !(st.ledger || []).some(e => /transcri/i.test(JSON.stringify(e))) && (st.settings || {}).transcribe === "on",
        JSON.stringify({ pushed, elsewhere: else1, inPut, rep: ((st.reps || {}).story || [])[0], setting: (st.settings || {}).transcribe }));
      await page.click("#view .pr-clip details.pr-tx > summary");
      await page.waitForFunction(() => { const d = document.querySelector("#view .pr-clip details.pr-tx"); return d && d.open; }, null, { timeout: 4000 });
      const card = await txCard(page);
      check(at + ": the fillers struck through are exactly " + JSON.stringify(TX_STRUCK) + " — not \"I like it\", \"Things like that\", \"a kind of map\" or \"Is that right?\"",
        !!card && JSON.stringify(card.struck) === JSON.stringify(TX_STRUCK), JSON.stringify(card && card.struck));
      check(at + ": the chips give the total, then each filler's count in reading order: " + TX_CHIPS.join(", "),
        !!card && card.total && JSON.stringify(card.chips) === JSON.stringify(TX_CHIPS), JSON.stringify(card && card.chips));
      const wpm = Math.round(TX_WORDS * 60 / c.seconds);
      check(at + ": the card says " + TX_WORDS + " words · " + wpm + " per minute (from the clip's " + c.seconds + " seconds), and \"Whisper can miss 'um' and 'uh'.\"",
        !!card && card.stats === TX_WORDS + " words · " + wpm + " per minute" && card.note === "Whisper can miss 'um' and 'uh'.", JSON.stringify(card && [card.stats, card.note]));
      check(at + ": the card's text is the transcript, selectable, with a Copy button",
        !!card && card.text === TX_TEXT.trim() && card.select !== "none" && card.copy, JSON.stringify(card && { text: card.text.slice(0, 40), select: card.select, copy: card.copy }));
      await page.click("#view .pr-clip [data-tx-copy]");
      await page.waitForFunction(() => /Copied/.test((document.querySelector("#toast") || {}).textContent || ""), null, { timeout: 4000 }).catch(() => {});
      const clip = await page.evaluate(() => navigator.clipboard.readText().catch(e => "(unreadable: " + e.message + ")"));
      check(at + ": Copy puts the transcript on the clipboard", clip === TX_TEXT.trim(), JSON.stringify(clip.slice(0, 60)));
      const long = await page.evaluate(t0 => window.__long.filter(e => e.at + e.ms >= t0 && e.ms >= 200), n0.t);
      check(at + ": no long task of 200ms or more ran on the page from Download to the transcript (the model works off the main thread)", long.length === 0, JSON.stringify(long));
      // A render is a read: away and back draws the transcript again and starts nothing.
      await go(page, "/"); await go(page, "/practice"); await listRead(page); await page.waitForTimeout(300);
      const n2 = await txNow(page);
      check(at + ": leaving the page and coming back starts nothing — the same one Worker, no new import, the stub asked once, no second upload",
        n2.workers.length === 1 && net.lib === 1 && net.reports.length === 1 && gh.audioPuts().length === 1 && (await rowState(page)).every(r => r.tx && !r.go),
        JSON.stringify({ workers: n2.workers.length, lib: net.lib, reports: net.reports.length, puts: gh.audioPuts().length }));
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // (r) the laptop pulls a clip the phone uploaded: audio/ lists it, its raw
  // bytes come down into IndexedDB in the clip shape, and it is transcribed
  // there after the question — at 1280.
  {
    const at = "(r) desktop pull, 1280px";
    const REMOTE = [{ name: "2026-10-30-1.wav", sha: "rsha1", bytes: TX_WAV }, { name: "README.md", sha: "x", bytes: Buffer.from("not a clip") }];
    const state = { settings: { theme: "dark", themeNavyOnce: true }, reps: { story: [{ date: "2026-10-30", seconds: 2, takes: 1, from: "The napkin, on the phone" }] } };
    const { ctx, page, errors, net, gh } = await txFresh(1280, "speech", state, { token: true, remote: REMOTE });
    try {
      await page.waitForFunction(() => !!document.querySelector("#view .pr-clip[data-clip='2026-10-30-1']"), null, { timeout: 10000 });
      const db = await txDB(page, true), c = db.find(x => x.key === "2026-10-30-1") || {};
      const gets = gh.log.filter(x => x.method === "GET" && /\/contents\/audio/.test(x.path));
      check(at + ": Practice opened lists " + TX_PRIV + "/contents/audio and downloads the one clip file it lacks, raw (README.md left alone)",
        gets.some(x => x.path === TX_PRIV + "/contents/audio") && gets.filter(x => /\/audio\/./.test(x.path)).map(x => x.path.split("/").pop() + " " + /raw/.test(x.accept)).join("|") === "2026-10-30-1.wav true" && privOnly(gh),
        JSON.stringify(gets.map(x => x.path + " " + x.accept)));
      check(at + ": it is stored in the clip shape — date from the key, the rep's seconds and title, kind story, the bytes as served, remote { sha } from the listing — and no upload of it",
        db.length === 1 && c.fields === "blob,date,kind,remote,seconds,title" && c.date === "2026-10-30" && c.seconds === 2 && c.kind === "story" && c.title === "The napkin, on the phone" &&
          c.type === "audio/wav" && c.b64 === TX_WAV64 && (c.remote || {}).sha === "rsha1" && gh.audioPuts().length === 0,
        JSON.stringify({ n: db.length, fields: c.fields, date: c.date, seconds: c.seconds, kind: c.kind, title: c.title, type: c.type, same: c.b64 === TX_WAV64, remote: c.remote, puts: gh.audioPuts().length }));
      const r0 = await rowState(page), s0 = await txNow(page);
      check(at + ": its row offers Transcribe, and nothing was imported yet", r0.length === 1 && r0[0].go && net.lib === 0 && s0.workers.length === 0, JSON.stringify({ r0, lib: net.lib }));
      await page.click("#view .pr-clip [data-tx-go]");
      await page.waitForSelector("#view .pr-ask", { timeout: 4000 }).catch(() => {});
      const a = await asked(page);
      check(at + ": Transcribe asks the question first, and still nothing is imported", !!a && a.text === TX_ASK && net.lib === 0, JSON.stringify({ a, lib: net.lib }));
      await page.click("#view .pr-ask [data-tx=yes]");
      await page.waitForFunction(() => !!document.querySelector("#view .pr-clip details.pr-tx"), null, { timeout: 15000 });
      const db2 = await txDB(page), c2 = db2[0] || {}, rp = net.reports[0] || {};
      check(at + ": the pulled clip is transcribed: the 2.0s 48 kHz WAV reached the worker as " + (rp.len || 0) + " samples (32000 at 16 kHz, within 10ms), and the transcript is on its record only",
        net.reports.length === 1 && Math.abs(rp.len - 32000) <= 160 && !!c2.transcript && c2.transcript.text === TX_TEXT && (await txElsewhere(page)).length === 0 && txInPuts(gh).length === 0,
        JSON.stringify({ reports: net.reports, has: !!c2.transcript }));
      await page.click("#view .pr-clip details.pr-tx > summary");
      const card = await txCard(page), wpm = Math.round(TX_WORDS * 60 / 2);
      check(at + ": words per minute come from the pulled clip's seconds: " + TX_WORDS + " words · " + wpm + " per minute at 2s",
        !!card && card.stats === TX_WORDS + " words · " + wpm + " per minute", JSON.stringify(card && card.stats));
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // (r) an upload that fails: one muted line, the clip intact, no retry by
  // itself and none from a render — only the next open of Practice. Booted on
  // #/__test for the hook's foreground render() — at 390 (tapped).
  {
    const at = "(r) upload fails, 390px";
    let fail = true;
    const { ctx, page, errors, gh } = await txFresh(390, "speech", P_STATE, { token: true, putFail: () => fail, boot: "/__test" });
    try {
      await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 8000 });
      const size = await page.evaluate(txSeedWav, [TX_SEED, TX_WAV64]);
      await go(page, "/practice");
      await listRead(page);
      await until(() => gh.audioPuts().length >= 1, 6000);
      await page.waitForFunction(() => !!document.querySelector("#view #prUp .pr-upfail"), null, { timeout: 4000 }).catch(() => {});
      const u1 = await upLine(page), c1 = (await txDB(page))[0] || {};
      check(at + ": opening Practice tried the upload once; it failed, and the list says, in one muted line, \"" + TX_UPFAIL + "\"",
        gh.audioPuts().length === 1 && u1.lines === 1 && u1.text === TX_UPFAIL && u1.muted, JSON.stringify({ puts: gh.audioPuts().length, u1 }));
      check(at + ": the recording is intact — the same audio, no remote, still listed and playable",
        c1.size === size && !c1.remote && (await rowState(page)).some(r => r.key === TX_SEED.key && r.play), JSON.stringify({ size: [c1.size, size], remote: c1.remote }));
      for (let i = 0; i < 3; i++) { await markView(page); await page.evaluate(() => window.__brickfordTest.render()); await viewReplaced(page); await listRead(page); }
      await page.waitForTimeout(5000);
      check(at + ": three renders of the page and five seconds later, still one upload: a render is a read, and a failure is not retried in a loop",
        gh.audioPuts().length === 1, gh.audioPuts().length + " upload(s)");
      await go(page, "/"); await go(page, "/practice"); await listRead(page);
      await until(() => gh.audioPuts().length >= 2, 6000); await page.waitForTimeout(300);
      const u2 = await upLine(page);
      check(at + ": the next open of Practice tries it once more (2 uploads), and the line is still there", gh.audioPuts().length === 2 && u2.text === TX_UPFAIL, JSON.stringify({ puts: gh.audioPuts().length, u2 }));
      fail = false;
      await go(page, "/"); await go(page, "/practice"); await listRead(page);
      await until(async () => !!((await txDB(page))[0] || {}).remote, 6000);
      await page.waitForFunction(() => !document.querySelector("#view .pr-upfail"), null, { timeout: 4000 }).catch(() => {});
      const u3 = await upLine(page), c3 = (await txDB(page))[0] || {};
      check(at + ": once the token can reach the repo, the next open uploads it (3 tries in all), the record gets remote, and the line is gone",
        gh.audioPuts().length === 3 && !!c3.remote && u3.lines === 0 && privOnly(gh) && gh.audioPuts().every(x => x.path === TX_PRIV + "/contents/audio/" + TX_SEED.key + ".wav"),
        JSON.stringify({ puts: gh.audioPuts().map(x => x.path), remote: c3.remote, u3 }));
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // (r) "Not now", remembered on this device — at 1280.
  {
    const at = "(r) Not now, 1280px";
    const { ctx, page, errors, net } = await txFresh(1280, "speech", P_STATE);
    try {
      await pickTab(page, "story");
      await listRead(page);
      await recordOne(page, 1280, 1);
      await page.waitForSelector("#view .pr-ask", { timeout: 5000 });
      await page.click("#view .pr-ask [data-tx=no]");
      await page.waitForFunction(() => !document.querySelector("#view .pr-ask"), null, { timeout: 4000 }).catch(() => {});
      const off = () => page.evaluate(() => { const o = document.querySelector("#view .pr-txoff");
        return { ask: !!document.querySelector("#view .pr-ask"), line: o ? ((o.querySelector(".pr-txoff-t") || {}).textContent || "").trim() : null,
          on: o ? ((o.querySelector("[data-tx=on]") || {}).textContent || "").trim() : null, go: document.querySelectorAll("#view [data-tx-go]").length }; });
      const o1 = await off(), s1 = await txNow(page);
      check(at + ": Not now closes the question; the list says \"Transcription is off on this device.\" with \"Turn on transcription\", and no row offers Transcribe",
        !o1.ask && o1.line === "Transcription is off on this device." && o1.on === "Turn on transcription" && o1.go === 0, JSON.stringify(o1));
      check(at + ": it is remembered on the device (settings.transcribe \"off\"); nothing was imported and no Worker was made",
        s1.setting === "off" && net.lib === 0 && s1.workers.length === 0, JSON.stringify({ setting: s1.setting, lib: net.lib, workers: s1.workers.length }));
      await go(page, "/"); await go(page, "/practice"); await listRead(page);
      await pickTab(page, "story");
      const o2 = await off();
      await recordOne(page, 1280, 2);
      await page.waitForTimeout(300);
      const o3 = await off(), s3 = await txNow(page);
      check(at + ": after leaving and coming back, and after a second recording, it is still off — no question, no import, no Worker",
        !o2.ask && o2.line === "Transcription is off on this device." && !o3.ask && o3.line === "Transcription is off on this device." && net.lib === 0 && s3.workers.length === 0 && s3.setting === "off",
        JSON.stringify({ o2, o3, lib: net.lib, workers: s3.workers.length }));
      await page.click("#view .pr-txoff [data-tx=on]");
      await page.waitForSelector("#view .pr-ask", { timeout: 4000 }).catch(() => {});
      const a = await asked(page), s4 = await txNow(page);
      check(at + ": \"Turn on transcription\" brings the question back, and still downloads nothing until it is answered",
        !!a && a.text === TX_ASK && s4.setting === undefined && net.lib === 0 && s4.workers.length === 0, JSON.stringify({ a, setting: s4.setting, lib: net.lib }));
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // (r) a clip already kept, with transcription on: the render starts
  // nothing; Transcribe does — at 1280, keyboard.
  {
    const at = "(r) Transcribe on a kept clip, 1280px";
    const { ctx, page, errors, net } = await txFresh(1280, "speech", P_STATE_ON);
    try {
      await listRead(page);
      const size = await txSeeded(page);
      const r0 = await rowState(page), s0 = await txNow(page);
      check(at + ": with transcription on, opening the page with an untranscribed clip starts nothing — no import, no Worker — and its row offers Transcribe",
        r0.length === 1 && r0[0].go && !r0[0].tx && net.lib === 0 && s0.workers.length === 0, JSON.stringify({ r0, lib: net.lib, workers: s0.workers.length }));
      await page.focus("#view .pr-clip [data-tx-go]");
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => !!document.querySelector("#view .pr-clip details.pr-tx"), null, { timeout: 15000 });
      const db = await txDB(page), c = db[0] || {}, rp = net.reports[0] || {};
      check(at + ": Transcribe ran it without asking again: the 2.0s 48 kHz WAV reached the worker as " + (rp.len || 0) + " samples (32000 at 16 kHz, within 10ms)",
        !(await asked(page)) && net.reports.length === 1 && rp.f32 === true && Math.abs(rp.len - 32000) <= 160, JSON.stringify(net.reports));
      check(at + ": the transcript is stored on that clip and the audio is untouched", !!c.transcript && c.transcript.text === TX_TEXT && c.size === size, JSON.stringify({ size: [c.size, size], has: !!c.transcript }));
      await page.click("#view .pr-clip details.pr-tx > summary");
      const card = await txCard(page), wpm = Math.round(TX_WORDS * 60 / TX_SEED.seconds);
      check(at + ": words per minute come from the clip's own seconds: " + TX_WORDS + " words · " + wpm + " per minute at " + TX_SEED.seconds + "s",
        !!card && card.stats === TX_WORDS + " words · " + wpm + " per minute", JSON.stringify(card && card.stats));
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // (r) the failure paths: one muted line each, and the recording intact.
  const TX_FAILS = [
    { name: "no Worker", mode: "speech", init: noWorker, line: /^This browser cannot run the speech model, so this one stays audio only\.$/ },
    { name: "the download fails", mode: null, line: /^Could not download the speech model\. The recording is kept\.$/ },
    { name: "out of memory", mode: "oom", line: /^Not enough memory to transcribe this one\. The recording is kept\.$/ },
    { name: "no speech", mode: "silence", line: /^No speech found in this recording\.$/ },
  ];
  for (const f of TX_FAILS) {
    const at = "(r) failure, " + f.name + ", 1280px";
    const { ctx, page, errors, net } = await txFresh(1280, f.mode, P_STATE_ON, { init: f.init });
    try {
      await listRead(page);
      const size = await txSeeded(page);
      await page.click("#view .pr-clip [data-tx-go]");
      await page.waitForFunction(() => { const r = document.querySelector("#view .pr-clip .pr-txrow .tx-line"); return r && !/…/.test(r.textContent); }, null, { timeout: 15000 });
      const r = (await rowState(page))[0] || {}, db = await txDB(page), c = db[0] || {};
      check(at + ": the row shows one muted line (" + f.line.source.replace(/^\^|\$$|\\/g, "") + ")", r.lines.length === 1 && f.line.test(r.lines[0]) && r.muted, JSON.stringify(r));
      check(at + ": the recording is intact — the same audio, no transcript, still playable", c.size === size && !c.transcript && r.play && !r.tx, JSON.stringify({ size: [c.size, size], transcript: !!c.transcript, play: r.play }));
      if (f.name === "no Worker") check(at + ": nothing was imported", net.lib === 0, "lib " + net.lib);
    } catch (e) { check(at + ": the flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check(at + ": no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  await txBrowser.close();

  // ---- (j) the tab bar you slide along (T-023) ----
  // Once, at 390x568, with motion ON (the spring is part of what is measured).
  // 568 tall so Today scrolls past 800 (at 844 it scrolls 548).
  // Touches are real CDP touch events; the vertical drag is also done with a
  // mouse pointer, which no touch-action can intercept, so it is the page's
  // own hysteresis that is tested. Pointer moves are delivered once a frame,
  // so every reading waits two frames. Positions are the bubble's COMPUTED
  // transform and its box, never a screenshot.
  console.log("\nthe tab bar (once, 390px)");
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 568 }, timezoneId: "UTC", hasTouch: true, isMobile: true });
    await ctx.route(/^https?:/, r => { if (/api\.github\.com/.test(r.request().url())) githubHits++; return r.abort(); });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    await ctx.addInitScript(countWrites);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const cdp = await ctx.newCDPSession(page);
    const touch = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y, id: 1 }] });
    const twoFrames = () => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const bub = () => page.evaluate(() => {
      const e = document.querySelector("#tabbar .tab-bubble"), r = e.getBoundingClientRect();
      return { tx: new DOMMatrix(getComputedStyle(e).transform).m41, c: r.left + r.width / 2 };
    });
    const hash = () => page.evaluate(() => location.hash);
    // Rendered, not just routed: the view is rebuilt inside a view transition,
    // after the hash has changed. The active tab is marked in the same task as
    // the view and the scroll, so it is the proof.
    // And the route's cross-fade over: while a view transition runs, Chromium
    // hit-tests every press to <html>, so a tap sent then would land nowhere.
    // Proof that it is over is the bar taking hits again.
    const shown = rt => page.evaluate(rt => {
      const a = document.querySelector("#tabbar a.active"), r = a && a.getBoundingClientRect();
      return !!a && a.dataset.route === rt && location.hash === "#" + rt &&
        !!document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2).closest("#tabbar");
    }, rt);
    const centres = await page.evaluate(() => [...document.querySelectorAll("#tabbar a")].map(a => {
      const r = a.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, rt: a.dataset.route };
    }));
    // Wait for proof, with a deadline: a spring has no duration.
    const until = async (fn, ms) => { const t0 = Date.now(); for (;;) { const v = await fn(); if (v || Date.now() - t0 > (ms || 3000)) return v; await page.waitForTimeout(30); } };
    const w0 = await writes(page);
    await until(() => shown("/"));

    // Slide from Today 60% of the way to Courses: the bubble is under the finger.
    const T = centres[0], C = centres[1];
    const fx = T.x + 0.6 * (C.x - T.x);
    const b0 = await bub();
    await touch("touchStart", T.x, T.y);
    for (let i = 1; i <= 8; i++) await touch("touchMove", T.x + (fx - T.x) * i / 8, T.y);
    await twoFrames();
    const b1 = await bub();
    check("(j) sliding 60% toward Courses: the bubble's translateX follows the finger within 2px",
      Math.abs((b1.tx - b0.tx) - (fx - T.x)) <= 2 && Math.abs(b1.c - fx) <= 2,
      "finger moved " + (fx - T.x).toFixed(1) + "px, translateX moved " + (b1.tx - b0.tx).toFixed(1) + "px; bubble centre " + b1.c.toFixed(1) + " vs finger " + fx.toFixed(1));
    await page.waitForTimeout(150);                       // the finger rests before lifting: no throw
    await touch("touchEnd");
    const onCourses = await until(async () => (await hash()) === "#/courses");
    // Settled is AT the target: the spring snaps there exactly when it stops.
    const settled = await until(async () => { const b = await bub(); return Math.abs(b.c - C.x) <= 0.5 ? b : null; });
    check("(j) release: the route becomes /courses and the bubble settles centred on Courses",
      onCourses && !!settled, (await hash()) + ", bubble centre " + (await bub()).c.toFixed(1) + " vs Courses " + C.x.toFixed(1));

    // Past Review: it resists.
    await until(() => shown("/courses"));
    const P = centres[3], R = centres[4];
    await touch("touchStart", P.x, P.y);
    for (let i = 1; i <= 6; i++) await touch("touchMove", P.x + (R.x - P.x) * i / 6, P.y);
    await twoFrames();
    const atR = await bub();
    for (let i = 1; i <= 6; i++) await touch("touchMove", R.x + 60 * i / 6, P.y);
    await twoFrames();
    const past = await bub();
    check("(j) sliding 60px past Review: the bubble resists, moving less than the finger",
      past.c - atR.c > 0 && past.c - atR.c < 60 * 0.6,
      "finger +60px, bubble +" + (past.c - atR.c).toFixed(1) + "px");
    await page.waitForTimeout(150);
    await touch("touchEnd");
    await until(() => shown("/review"));

    // A vertical drag of 40px on another tab switches nothing: by touch, and by
    // a mouse pointer (no touch-action applies, so only the hysteresis decides).
    const E = centres[2];
    const before = await hash();
    await touch("touchStart", E.x, E.y);
    for (let i = 1; i <= 8; i++) await touch("touchMove", E.x, E.y - 40 * i / 8);
    await touch("touchEnd");
    await page.waitForTimeout(500);
    const afterTouch = await hash();
    await page.mouse.move(E.x, E.y); await page.mouse.down();
    await page.mouse.move(E.x, E.y - 40, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    const afterMouse = await hash();
    check("(j) a 40px vertical drag on Exams does not switch tabs (touch and pointer)",
      afterTouch === before && afterMouse === before, before + " -> touch " + afterTouch + ", pointer " + afterMouse);

    // Tap the active tab at scrollY 800: back to the top.
    const H = centres[0];
    await touch("touchStart", H.x, H.y); await touch("touchEnd");
    await until(() => shown("/"));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: "instant" }));
    const at800 = await page.evaluate(() => Math.round(scrollY));
    await touch("touchStart", H.x, H.y); await touch("touchEnd");
    const top = await until(async () => (await page.evaluate(() => scrollY)) === 0, 4000);
    check("(j) tapping the active tab at scrollY 800 scrolls to 0",
      at800 === 800 && top, "from " + at800 + " to " + (await page.evaluate(() => Math.round(scrollY))));

    // Scroll memory: Today at 600, go to Courses, come back.
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    const at600 = await page.evaluate(() => Math.round(scrollY));
    await touch("touchStart", C.x, C.y); await touch("touchEnd");
    await until(() => shown("/courses"));
    await page.waitForTimeout(200);
    const onC = await page.evaluate(() => Math.round(scrollY));
    await touch("touchStart", H.x, H.y); await touch("touchEnd");
    await until(() => shown("/"));
    const back = await until(async () => { const y = await page.evaluate(() => scrollY); return Math.abs(y - 600) <= 2 ? y : null; }, 2000);
    check("(j) scroll memory: Today at 600, to Courses (" + onC + ") and back is 600 (+/-2)",
      at600 === 600 && back !== null, "back at " + (await page.evaluate(() => Math.round(scrollY))));

    const w1 = await writes(page);
    check("(j) a render is a read: sliding, tapping and switching made zero save() calls", w1 - w0 === 0, (w1 - w0) + " write(s)");
    check("(j) no page errors", errors.length === 0, errors.join(" | "));
    await shot(page, "j-tabbar");
    await ctx.close();
  }
  // Reduced motion: the tap to the top is instant.
  {
    const { ctx, page, errors } = await fresh(browser, 390, null, "/");
    const H = await page.evaluate(() => { const r = document.querySelector("#tabbar a").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    const from = await page.evaluate(() => { window.scrollTo({ top: 400, behavior: "instant" }); return Math.round(scrollY); });
    await page.touchscreen.tap(H.x, H.y);
    const y = await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r(Math.round(scrollY)))));
    check("(j) reduced motion: tapping the active tab is at the top within a frame", from === 400 && y === 0, "from " + from + " to " + y);
    check("(j) reduced motion: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // Modifier-clicks are the browser's (T-023 review). At 800px the bar is on
  // screen and a mouse is the pointer; the bar captured every press and
  // activate()d it, so Ctrl-click on a tab navigated THIS page and opened
  // nothing. A plain click afterwards must still switch tabs, so the guard is
  // not just a bar that ignores the mouse.
  {
    const ctx = await browser.newContext({ viewport: { width: 800, height: 700 }, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.route(/^https?:/, r => { if (/api\.github\.com/.test(r.request().url())) githubHits++; return r.abort(); });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const opened = [];
    ctx.on("page", p => opened.push(p));
    const mod = process.platform === "darwin" ? "Meta" : "Control";
    await page.click("#tabbar a[data-route='/courses']", { modifiers: [mod] });
    const t0 = Date.now();
    while (!opened.length && Date.now() - t0 < 4000) await page.waitForTimeout(50);
    await page.waitForTimeout(400);                       // and no second one
    const stay = await page.evaluate(() => location.hash);
    check("(j) " + mod + "-click on the Courses tab at 800x700 opens exactly 1 new page and leaves this one on #/",
      opened.length === 1 && stay === "#/", opened.length + " new page(s); this page at " + stay +
      (opened[0] ? "; new page " + opened[0].url().replace(/^.*#/, "#") : ""));
    await page.click("#tabbar a[data-route='/courses']");
    const went = await page.waitForFunction(() => location.hash === "#/courses", null, { timeout: 4000 }).then(() => true, () => false);
    check("(j) a plain click on the Courses tab at 800x700 still switches to it", went, await page.evaluate(() => location.hash));
    check("(j) modifier-click: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  // The same, for a finger (T-023 review 2): an iPad with a keyboard Cmd-taps
  // with a touch pointer. The pointerdown guard covered only the mouse while
  // the click guard covered every pointer, so a Ctrl- or Shift-tap navigated
  // this page AND opened a new one. Real CDP touches, carrying the modifier
  // bits (2 = Ctrl, 8 = Shift); reduced motion, so no cross-fade is in the way.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: "UTC", hasTouch: true, isMobile: true, reducedMotion: "reduce" });
    await ctx.route(/^https?:/, r => { if (/api\.github\.com/.test(r.request().url())) githubHits++; return r.abort(); });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(URL + "/", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    const cdp = await ctx.newCDPSession(page);
    const C = await page.evaluate(() => { const r = document.querySelector("#tabbar a[data-route='/courses']").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    // The modifier bits on the press and on the release, separately: a touch
    // that lands plain and lifts with Ctrl or Shift held (review 3) reached
    // pointerup's activate() with the click it sends also let through.
    const tap = (down, up) => cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: C.x, y: C.y, id: 1 }], modifiers: down })
      .then(() => cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [], modifiers: up === undefined ? down : up }));
    // Each case from #/, so one cannot inherit the other's navigation.
    const home = async () => {
      if (await page.evaluate(() => location.hash) !== "#/") {
        await page.goto(URL + "/", { waitUntil: "load" });
        await page.waitForFunction(() => { const a = document.querySelector("#tabbar a.active"); return a && a.dataset.route === "/"; });
      }
    };
    for (const [name, down, up] of [["a Ctrl-tap", 2, 2], ["a Shift-tap", 8, 8],
                                    ["a plain touch lifted with Ctrl", 0, 2], ["a plain touch lifted with Shift", 0, 8]]) {
      await home();
      const opened = [];
      const onPage = p => opened.push(p);
      ctx.on("page", onPage);
      await tap(down, up);
      const t0 = Date.now();
      while (!opened.length && Date.now() - t0 < 4000) await page.waitForTimeout(50);
      await page.waitForTimeout(500);                     // and no second one, and no late navigation here
      ctx.off("page", onPage);
      const stay = await page.evaluate(() => location.hash);
      check("(j) " + name + " (touch) on the Courses tab at 390 opens exactly 1 new page and leaves this one on #/",
        opened.length === 1 && stay === "#/", opened.length + " new page(s); this page at " + stay +
        (opened[0] ? "; new page " + opened[0].url().replace(/^.*#/, "#") : ""));
      for (const p of opened) await p.close();
    }
    // A pen's barrel button is a right press (review 3): the bar switched tab
    // on it and the context menu then opened over the new page.
    await home();
    await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: C.x, y: C.y, button: "right", buttons: 2, clickCount: 1, pointerType: "pen" });
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: C.x, y: C.y, button: "right", buttons: 0, clickCount: 1, pointerType: "pen" });
    await page.waitForTimeout(500);
    const penStay = await page.evaluate(() => location.hash);
    check("(j) a pen barrel-button (right) press on the Courses tab at 390 leaves this page on #/", penStay === "#/", "this page at " + penStay);
    await tap(0);
    const went = await page.waitForFunction(() => location.hash === "#/courses", null, { timeout: 4000 }).then(() => true, () => false);
    check("(j) a plain tap on the Courses tab at 390 still switches to it", went, await page.evaluate(() => location.hash));
    check("(j) modifier-tap: no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (i) a slow phone: the player starts listening after the old cap ----
  // Once, at the phone width. The stub ignores the first 60 hails it hears —
  // 60 was where the page used to stop asking — so it answers only if the
  // page is still asking after that (about 16s in). Then resume has to work.
  console.log("\na slow phone (once, 390px)");
  {
    const { ctx, page, errors } = await fresh(browser, 390, unlocked(null), "/");
    await stubPlayer(ctx, 60);
    await listenAfterApp(page);
    await go(page, LROUTE);
    const fr = await playerFrame(page);
    const shook = await fr.waitForFunction(() => window.__stub().answered && window.__stub().commands.length > 0, null, { timeout: 40000, polling: 250 })
      .then(() => true, () => false);
    const hs = await fr.evaluate(() => window.__stub());
    await page.waitForFunction(() => window.__heard.filter(h => /"event":"(initialDelivery|onReady)"/.test(h.data)).length >= 2, null, { timeout: 5000 }).catch(() => {});
    check("(i) a player that answers only after 60 hails (the old cap) is still being asked, and the handshake completes",
      shook && hs.heard > 60, hs.heard + " hail(s) heard, answered " + hs.answered + ", commands [" + hs.commands.join("; ") + "]");
    const w0 = await writes(page);
    const d1 = await fromPlayer(page, fr, playingMsg(754.3, CUR.v));
    const d2 = await fromPlayer(page, fr, PAUSE_MSG);
    const a = { w: await writes(page) - w0, st: await stored(page, LK) };
    check("(i) and resume works: a playing infoDelivery and a pause from the frame save pos 754, in one save",
      d1 && d2 && a.w === 1 && !!a.st && a.st.pos === 754, (d1 && d2 ? "" : "not delivered; ") + a.w + " save(s), stored " + JSON.stringify(a.st));
    check("(i) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (k) the answer is not where it was written (T-032) ----
  // The banks put the answer in one slot almost every time (option B in every
  // summary file, option A in two banks), so a reader learns the slot instead
  // of the material. DAR.Quiz.mount presents each question with its options
  // shuffled. Every multiple-choice question in every bank, summary and
  // concept is mounted alone 8 times: the slot the answer lands in must be
  // uniform over all of them, and grading must follow the option, not the slot.
  console.log("\nmultiple choice (once)");
  {
    const { ctx, page, errors } = await fresh(browser, 1280);
    const r = await page.evaluate(() => {
      const D = window.DAR, pool = [];
      Object.keys(D.QUIZZES || {}).forEach(k => D.QUIZZES[k].questions.forEach(q => pool.push(q)));
      Object.keys(D.SUMMARIES || {}).forEach(k => (D.SUMMARIES[k].checks || []).forEach(q => pool.push(q)));
      (D.CONCEPTS || []).forEach(c => (c.probes || []).forEach(q => pool.push(q)));
      const norm = html => { const t = document.createElement("span"); t.innerHTML = html; return t.innerHTML; };
      const mcq = pool.filter(q => q.opts && q.opts.length > 1 && new Set(q.opts.map(norm)).size === q.opts.length);
      const host = document.createElement("div"); document.body.appendChild(host);
      const at = {}, stored = {};
      let mounts = 0, unfound = 0, gradedRight = 0, gradedWrong = 0;
      mcq.forEach(q => {
        const n = q.opts.length, want = norm(q.opts[q.a]);
        at[n] = at[n] || Array(n).fill(0); stored[n] = stored[n] || Array(n).fill(0);
        stored[n][q.a]++;
        for (let k = 0; k < 8; k++) {
          DAR.Quiz.mount(host, { title: "t", course: "t", perSitting: 1, questions: [q] }, {});
          mounts++;
          const btns = [...host.querySelectorAll(".opt")];
          const pos = btns.findIndex(b => b.lastElementChild.innerHTML === want);
          if (pos < 0) { unfound++; continue; }
          at[n][pos]++;
          if (k === 0) {            // the right option is graded right, wherever it was shuffled to
            btns[pos].click();
            if (/Correct\./.test(host.querySelector("#qFeedback").textContent) && btns[pos].classList.contains("correct")) gradedRight++;
          } else if (k === 1) {     // a wrong option is graded wrong, and the right one is marked
            btns[(pos + 1) % n].click();
            if (/Not quite/.test(host.querySelector("#qFeedback").textContent) && btns[pos].classList.contains("correct")) gradedWrong++;
          }
        }
      });
      host.remove();
      return { total: mcq.length, skipped: pool.filter(q => q.opts).length - mcq.length, mounts, unfound, at, stored, gradedRight, gradedWrong };
    });
    console.log("  info  as written in the data — " + Object.keys(r.stored).map(n => n + " options: " + r.stored[n].join("/")).join("; ") +
      (r.skipped ? " (" + r.skipped + " with duplicate option texts left out)" : ""));
    check("(k) every multiple-choice question was mounted and its answer found", r.total > 400 && r.unfound === 0,
      r.total + " questions, " + r.mounts + " mounts, " + r.unfound + " unfound");
    Object.keys(r.at).forEach(n => {
      const c = r.at[n], sum = c.reduce((a, b) => a + b, 0);
      if (sum < 200) return;      // too few mounts to judge that option count
      const share = c.map(v => v / sum);
      check("(k) " + n + "-option questions: the answer lands in every slot about equally (within 5 points of " + Math.round(100 / n) + "%)",
        share.every(s => Math.abs(s - 1 / n) <= 0.05), c.map((v, i) => "ABCDE"[i] + " " + Math.round(share[i] * 100) + "%").join(", ") + " of " + sum);
    });
    check("(k) choosing the right option is graded right, wherever it was shuffled to", r.gradedRight === r.total, r.gradedRight + " of " + r.total);
    check("(k) choosing a wrong option is graded wrong, and the right one is marked", r.gradedWrong === r.total, r.gradedWrong + " of " + r.total);
    check("(k) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (lk) T-043 review r1: a chain of locks deeper than two ----
  // Once, at 390, nothing watched. Only lectures planned on or after
  // QUIZ_GATE_FROM lock (owner, 2026-10-15), and the plan's dates here are
  // read from the page (planDateOf) and asserted, not assumed. In MATH 110,
  // R is the first lecture planned from the gate on; R+3 is locked behind
  // R+2, behind R+1, behind R — and R, whose predecessor is planned before
  // the gate, is open. The card names R+2 in its title, says three quizzes
  // stand in the way, and its button opens R (lockRoot). Today's calendar
  // block for MATH 120 links to the root of its own chain, which stops at the
  // gate too.
  console.log("\na chain of locks (once, 390px)");
  {
    const { ctx, page, errors } = await fresh(browser, 390, null, "/__test");
    const ch = await page.evaluate(() => {
      const T = window.__brickfordTest, D = window.DAR, gate = T.QUIZ_GATE_FROM;
      const flat = cid => { const f = []; D.COURSES.find(c => c.id === cid).units.forEach((u, ui) => u.lessons.forEach((l, li) => f.push({ k: cid + "." + ui + "." + li, ui, li, t: l.t }))); return f; };
      const f = flat("math110"), j = f.findIndex(x => (T.planDateOf(x.k) || "9999") >= gate);
      const m = flat("math120"), mj = m.findIndex(x => (T.planDateOf(x.k) || "9999") >= gate);
      return { gate, R: f[j], R2: f[j + 2], R3: f[j + 3], prevDate: T.planDateOf(f[j - 1].k), rDate: T.planDateOf(f[j].k), no: j + 1,
        rLocked: T.lockedBy("math110", f[j].ui, f[j].li), mRoot: m[mj].k };
    });
    await go(page, "/lesson/math110/" + ch.R3.ui + "/" + ch.R3.li);
    const L = await page.evaluate(() => { const c = document.querySelector("#view .lq-lock");
      return c ? { t: c.querySelector(".lq-lock-t").textContent.trim(), m: c.querySelector(".lq-lock-m").textContent.trim(), ahead: c.dataset.ahead,
        btn: c.querySelector("a.btn").getAttribute("href"), label: c.querySelector("a.btn").textContent.trim() } : null; });
    check("(lk) the chain stops at the gate: " + ch.R.k + " (planned " + ch.rDate + ") is open, its predecessor planned " + ch.prevDate + " before " + ch.gate,
      ch.prevDate < ch.gate && ch.rDate >= ch.gate && ch.rLocked === false, JSON.stringify(ch));
    // T-080 PR 2: the label only; the \u25b8 glyph became a drawn chevron (CHEV), asserted in verify-design's T-080 block.
    check("(lk) a chain of three: the title names the lecture before, the line says 3 quizzes, the button opens the root",
      !!L && L.t === "Pass the quiz for \u201c" + ch.R2.t + "\u201d first" && L.ahead === "3" &&
        new RegExp("^MATH 110 · 3 quizzes stand before this lecture, from lecture " + ch.no + ",").test(L.m) &&
        L.btn === "#/lesson/math110/" + ch.R.ui + "/" + ch.R.li && L.label === "Open lecture " + ch.no, JSON.stringify(L));
    const root = await page.evaluate(() => window.__brickfordTest.lockRoot("math120", 1, 0));
    await go(page, "/calendar");
    const blk = await page.evaluate(() => [...document.querySelectorAll("#view .cd-blk.locked")].map(b => b.getAttribute("href")));
    check("(lk) the calendar's locked block for today's MATH 120 lecture links to the first quiz in its chain, which starts at the gate",
      root === ch.mRoot && blk.includes("#/lesson/" + root.split(".").join("/")) && !blk.includes("#/lesson/math120/1/0"), "root " + root + "; locked blocks " + JSON.stringify(blk));
    check("(lk) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (rw) T-043: "Rewatch from m:ss" on a miss, in place ----
  // Once, at 1280. No summary carries `at` yet, so the page's own copy of the
  // lecture's checks is given one (95s) before the quiz mounts. A miss then
  // offers "Rewatch from 1:35"; pressing it puts the player back where the
  // watched bar was, at start=95 (the resume mechanism's start=), without a
  // render — the quiz card on screen is the same element, still on the miss.
  console.log("\nrewatch from a miss (once, 1280px)");
  {
    const st = { lessons: { "math120.0.11": { done: true, doneAt: "2026-10-28", notes: "", checks: [],
        quiz: { passedAt: "2026-10-28", at: "2026-10-28T10:00:00.000Z", firstTry: 2, total: 2, attempts: 2 } },
      "math120.1.0": { done: true, doneAt: "2026-11-01", notes: "", checks: [] } } };
    const { ctx, page, errors } = await fresh(browser, 1280, st, "/__test");
    await page.evaluate(() => window.DAR.SUMMARIES["math120.1.0"].checks.forEach(q => { q.at = 95; }));
    await go(page, "/lesson/math120/1/0");
    await page.waitForSelector("#view #lqMount .lq-card");
    await page.evaluate(() => {
      const c = document.querySelector("#view .lq-card"), q = window.DAR.SUMMARIES["math120.1.0"].checks[+c.dataset.q];
      c.dataset.flowStamp = "original";
      const o = [...c.querySelectorAll(".opt")].find(b => +b.dataset.o !== q.a);
      if (o) o.click(); else { document.querySelector("#view #numAns").value = "-98765"; document.querySelector("#view #numGo").click(); }
    });
    const btn = await page.evaluate(() => ((document.querySelector("#view .lq-rewatch-at") || {}).textContent || "").trim());
    check("(rw) a miss on a question with `at` offers \"Rewatch from 1:35\"", btn === "Rewatch from 1:35", "\"" + btn + "\"");
    const w0 = await writes(page);
    if (btn) await page.click("#view .lq-rewatch-at");
    const r = await page.evaluate(() => { const f = document.querySelector("#view .video-frame iframe[data-k]"), c = document.querySelector("#view .lq-card");
      return { src: f ? f.getAttribute("src") : "", k: f ? f.dataset.k : "", bar: !!document.querySelector("#view .lq-watched"),
        same: !!c && c.dataset.flowStamp === "original", miss: !!document.querySelector("#view .lq-segs i.miss") }; });
    check("(rw) pressing it puts the player back in place at start=95, and the quiz card is the same element, still on the miss",
      /[?&]start=95(&|$)/.test(r.src) && r.k === "math120.1.0" && !r.bar && r.same && r.miss, JSON.stringify(r));
    check("(rw) and writes nothing", (await writes(page)) === w0, (await writes(page)) - w0 + " write(s)");
    check("(rw) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (f) the resume point syncs: the later posAt wins, per lecture ----
  // Once, at the desktop width: nothing here is about layout. A stub token and
  // a stub GitHub, both inside this context; the pull is the one boot() makes.
  console.log("\nsync (once)");
  {
    const T9 = "2026-11-01T09:00:00.000Z", T10 = "2026-11-01T10:00:00.000Z", T11 = "2026-11-01T11:00:00.000Z";
    const A = "math110.0.13", B = "math110.0.14", C = "math110.0.15";
    const local = { lessons: {
      [A]: { done: false, notes: "", checks: [], pos: 754, posAt: T10 },   // theirs is newer, and further along
      [B]: { done: false, notes: "", checks: [], pos: 500, posAt: T11 },   // mine is newer; theirs is further along
      [C]: { done: false, notes: "", checks: [], pos: 200, posAt: T10 },   // it ended over there, later
    } };
    const remote = { v: 1, updatedAt: T11, device: "other", ledgers: {}, state: { lessons: {
      [A]: { done: true, doneAt: TODAY, notes: "", checks: [], pos: 300, posAt: T11 },
      [B]: { done: true, doneAt: TODAY, notes: "", checks: [], pos: 100, posAt: T9 },
      [C]: { done: false, notes: "", checks: [], posAt: T11 },
    } } };
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce" });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    let put = null, gotPut;
    const putSeen = new Promise(r => { gotPut = r; });
    await ctx.route(/^https?:/, r => {
      const req = r.request();
      if (!/api\.github\.com/.test(req.url())) return r.abort();
      if (req.method() === "GET") return r.fulfill({ status: 200, contentType: "application/json",
        body: JSON.stringify({ sha: "stubsha", content: Buffer.from(JSON.stringify(remote), "utf8").toString("base64") }) });
      if (!put) { put = JSON.parse(req.postData() || "{}"); gotPut(); }
      return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) });
    });
    await ctx.addInitScript(s => {
      if (window.top !== window) return;
      localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness");
      localStorage.setItem("darhikmah_v1", s);
    }, JSON.stringify(local));
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(URL + "/course/math110", { waitUntil: "load" });
    const pulled = await page.waitForFunction(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).lastSyncAt,
      null, { timeout: 8000 }).then(() => true, () => false);
    check("(f) the boot pull ran against the stub", pulled);
    const s = await page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons || {});
    const show = k => JSON.stringify({ done: s[k] && s[k].done, pos: s[k] && s[k].pos, posAt: s[k] && s[k].posAt });
    check("(f) where theirs is newer it wins: pos 754 -> 300 (and their watched mark comes too)",
      !!s[A] && s[A].pos === 300 && s[A].posAt === T11 && s[A].done === true, show(A));
    check("(f) where mine is newer it stays (pos 500), though theirs wins the lecture's standing (watched)",
      !!s[B] && s[B].pos === 500 && s[B].posAt === T11 && s[B].done === true, show(B));
    check("(f) an end over there, stamped later, clears the point here",
      !!s[C] && !("pos" in s[C]) && s[C].posAt === T11, show(C));
    await page.goto(URL + "/sync", { waitUntil: "load" });
    await page.waitForSelector("[data-act='syncPush']", { timeout: 8000 });
    await page.click("[data-act='syncPush']");
    const pushed = await Promise.race([putSeen.then(() => true), new Promise(r => setTimeout(() => r(false), 8000))]);
    let sent = null;
    try { sent = JSON.parse(Buffer.from(put.content, "base64").toString("utf8")).state.lessons; } catch (e) {}
    check("(f) a push carries pos and posAt in its payload (syncPayload)",
      pushed && !!sent && sent[A].pos === 300 && sent[A].posAt === T11 && sent[B].pos === 500 && !("pos" in sent[C]) && sent[C].posAt === T11,
      !pushed ? "no PUT within 8s" : sent ? "A " + JSON.stringify(sent[A] && { pos: sent[A].pos, posAt: sent[A].posAt }) +
        ", B pos " + (sent[B] && sent[B].pos) + ", C pos " + (sent[C] && sent[C].pos) : "unreadable payload");
    check("(f) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (n) the unmark sticks: a pull from a remote that still holds the pass ----
  // Once, at 390. Gate 1 is passed and then unmarked through the sheet with no
  // token (nothing syncs); then a stub token, and a stub GitHub whose file
  // still holds the pass exactly as this device stored it. A reload makes the
  // boot pull. Then the other device: the pass here, the unmark over there.
  console.log("\ngate sync (once)");
  // T-068: this device reloads over http://127.0.0.1, for the reason the (p) recorder block does (file:// storage
  // lost on a reload, in the browser, before any script runs); the other device below never reloads and stays on file://.
  const N_HTTP = await serveDir(path.join(path.resolve(__dirname, ".."), "platform"));
  await acrossReload({ label: "(n) gate sync", check, fail: why => check(why, false) }, async (check, reload) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: true, serviceWorkers: "block" });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    let remote = null, put = null, gets = 0, gotPut = null;
    await ctx.route(/^https?:/, r => {
      const req = r.request();
      if (req.url().startsWith(N_HTTP.base.replace(/index\.html#$/, ""))) return r.continue();
      if (!/api\.github\.com/.test(req.url())) return r.abort();
      if (!remote) return r.abort();             // no token yet: nothing may reach here
      if (req.method() === "GET") { gets++; return r.fulfill({ status: 200, contentType: "application/json",
        body: JSON.stringify({ sha: "stubsha", content: Buffer.from(JSON.stringify(remote), "utf8").toString("base64") }) }); }
      put = JSON.parse(req.postData() || "{}");
      if (gotPut) gotPut();
      return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) });
    });
    await ctx.addInitScript(countWrites);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(N_HTTP.base + "/transcript", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
    // Declared out here: the other device below is seeded with them, and a
    // harness error inside this try must not turn into a ReferenceError there.
    let thePass = null, theUnmark = null;
    try {
      const passVia = async (doWhat) => {
        await page.evaluate(() => { const d = document.querySelector("#view details.unit"); if (d) d.open = true; });
        await page.tap("#view [data-gate-do=" + doWhat + "][data-gate='1']");
        await page.waitForSelector("dialog.sheet[open]", { timeout: 4000 });
        const n = await page.evaluate(() => document.querySelectorAll("dialog.sheet [data-gate-req]").length);
        for (let i = 0; i < n; i++) await page.tap("dialog.sheet label:has([data-gate-req]) >> nth=" + i);
        await markView(page);
        await page.tap("dialog.sheet [data-sheet-go]");
        await viewReplaced(page);
      };
      await passVia("pass");
      thePass = (await gatesStored(page))[1];
      await ctx.clock.setFixedTime(new Date(TODAY + "T12:05:00Z"));
      await passVia("unmark");
      theUnmark = (await gatesStored(page))[1];
      remote = { v: 1, updatedAt: TODAY + "T12:00:30.000Z", device: "phone", ledgers: {}, state: { gates: { 1: thePass } } };
      await page.evaluate(() => localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness"));
      const proof = await reload(page, { waitUntil: "load" });
      check("(n) gate sync: the reload is measured, the stamp written last before it and the state both there at document start",
        !!proof.boot.state && proof.boot.local === proof.stamp, JSON.stringify(proof.boot));
      const pulled = await page.waitForFunction(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).lastSyncAt,
        null, { timeout: 8000 }).then(() => true, () => false);
      await page.waitForSelector("#view [data-gate]");
      const after = { g: (await gatesStored(page))[1], ctl: await gateControls(page) };
      check("(n) after a pull from a stub remote that still holds the pass, the unmark sticks (Gate 1 open, pass 1 offered)",
        !!thePass && thePass.passed === true && !!theUnmark && theUnmark.passed === false && pulled && gets > 0 &&
          !!after.g && after.g.passed === false && after.g.at === theUnmark.at && after.ctl === "pass 1",
        "pass " + JSON.stringify(thePass) + ", unmark " + JSON.stringify(theUnmark) + ", pulled " + pulled + " (" + gets + " GET), now " + JSON.stringify(after.g) + ", controls " + after.ctl);
      await page.goto(N_HTTP.base + "/sync", { waitUntil: "load" });
      await page.waitForSelector("[data-act='syncPush']", { timeout: 8000 });
      put = null;
      const putSeen = new Promise(r => { gotPut = r; });
      await page.tap("[data-act='syncPush']");
      const pushed = await Promise.race([putSeen.then(() => true), new Promise(r => setTimeout(() => r(false), 8000))]);
      let sent = null;
      try { sent = JSON.parse(Buffer.from(put.content, "base64").toString("utf8")).state.gates; } catch (e) {}
      check("(n) the push that follows carries the unmark, so the remote loses the pass", pushed && !!sent && !!sent[1] && sent[1].passed === false,
        pushed ? JSON.stringify(sent) : "no PUT");
    } catch (e) { check("(n) this device's flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(n) no page errors (this device)", errors.length === 0, errors.join(" | "));
    await ctx.close();

    // The other device: it still holds the pass, and the remote has the unmark.
    const ctx2 = await browser.newContext({ viewport: { width: 390, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: true });
    await ctx2.clock.setFixedTime(new Date(TODAY + "T13:00:00Z"));
    const remote2 = { v: 1, updatedAt: TODAY + "T12:05:30.000Z", device: "laptop", ledgers: {}, state: { gates: { 1: theUnmark } } };
    await ctx2.route(/^https?:/, r => {
      const req = r.request();
      if (!/api\.github\.com/.test(req.url())) return r.abort();
      if (req.method() === "GET") return r.fulfill({ status: 200, contentType: "application/json",
        body: JSON.stringify({ sha: "stubsha", content: Buffer.from(JSON.stringify(remote2), "utf8").toString("base64") }) });
      return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) });
    });
    await ctx2.addInitScript(s => {
      if (window.top !== window) return;
      localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness");
      if (!sessionStorage.getItem("__seeded")) { sessionStorage.setItem("__seeded", "1"); localStorage.setItem("darhikmah_v1", s); }
    }, JSON.stringify({ gates: { 1: thePass } }));
    const page2 = await ctx2.newPage();
    const errors2 = [];
    page2.on("pageerror", e => errors2.push(e.message));
    try {
      await page2.goto(URL + "/transcript", { waitUntil: "load" });
      const pulled2 = await page2.waitForFunction(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).lastSyncAt,
        null, { timeout: 8000 }).then(() => true, () => false);
      await page2.waitForFunction(() => !!document.querySelector("#view [data-gate-do=pass][data-gate='1']"), null, { timeout: 8000 }).catch(() => {});
      const g2 = (await gatesStored(page2))[1], ctl2 = await gateControls(page2);
      check("(n) the device that still held the pass pulls the unmark: Gate 1 open there too",
        pulled2 && !!g2 && g2.passed === false && ctl2 === "pass 1", "pulled " + pulled2 + ", now " + JSON.stringify(g2) + ", controls " + ctl2);
    } catch (e) { check("(n) the other device's flow ran to its end without a harness error", false, e.message.split("\n")[0]); }
    check("(n) no page errors (the other device)", errors2.length === 0, errors2.join(" | "));
    await ctx2.close();
  });
  await N_HTTP.close();

  // ---- (pd) T-045: Problems, as what is due now ----
  // A lecture watched with its quiz not passed, and 18.06 Pset 1 unlocked
  // (its lecture, Elimination with Matrices, watched and passed). "Take it"
  // on the quiz row opens that lecture's quiz; passing it takes the row off
  // Problems. "Open" on the pset shows its source and its done toggle;
  // ticking it takes that row off too, and stores S.psets as before.
  for (const w of WIDTHS) {
    console.log("\nProblems: due now (" + w + "px)");
    const st = { lessons: {
      "math120.1.0": { done: true, doneAt: TODAY, notes: "", checks: [] },
      "math110.1.1": { done: true, doneAt: TODAY, notes: "", checks: [], quiz: { passedAt: TODAY, at: TODAY + "T10:00:00.000Z", firstTry: 2, total: 2, attempts: 2 } } } };
    const { ctx, page, errors } = await fresh(browser, w, st, "/__test");
    const due = () => page.evaluate(() => [...document.querySelectorAll("#view #pdDue [data-due]")].map(n => n.dataset.due + ":" + n.dataset.id));
    await go(page, "/workshop");
    const d0 = await due();
    check("(pd) /workshop lists the quiz waiting and the unlocked pset", d0.includes("quiz:math120.1.0") && d0.includes("pset:1806-ps1"), d0.join(", "));
    await markView(page);
    await page.click('#view #pdDue a[data-due=quiz][data-id="math120.1.0"]');
    await viewReplaced(page);
    const opened = await page.waitForSelector("#view #lqMount .lq-card", { timeout: 4000 }).then(() => true, () => false);
    check("(pd) \"Take it\" opens that lecture's quiz", opened && /#\/lesson\/math120\/1\/0$/.test(page.url()), page.url().split("#")[1]);
    const bank = await page.evaluate(() => window.DAR.SUMMARIES["math120.1.0"].checks.map(q => ({ a: q.a, num: q.num, opts: q.opts ? q.opts.length : 0 })));
    for (let guard = 0; guard < 2 * bank.length + 2; guard++) {
      const cur = await page.evaluate(() => { const c = document.querySelector("#view #lqMount .lq-card");
        return c ? { q: +c.dataset.q, order: [...c.querySelectorAll(".opt")].map(b => +b.dataset.o) } : null; });
      if (!cur) break;
      const b = bank[cur.q];
      if (b.opts) await page.click("#view #lqMount .opt >> nth=" + cur.order.indexOf(b.a));
      else { await page.fill("#view #numAns", String(b.num)); await page.click("#view #numGo"); }
      await page.waitForFunction(() => getComputedStyle(document.querySelector("#view #nextBtn")).visibility === "visible", null, { timeout: 4000 });
      const last = await page.evaluate(() => document.querySelector("#view #nextBtn").textContent.trim() === "Finish");
      await markView(page).catch(() => {});
      await page.click("#view #nextBtn");
      if (last) { await viewReplaced(page); break; }
    }
    const passed = !!((await stored(page, "math120.1.0")) || {}).quiz;
    await go(page, "/workshop");
    const d1 = await due();
    check("(pd) passing it takes the quiz row off Problems", passed && !d1.includes("quiz:math120.1.0") && d1.includes("pset:1806-ps1"), "passed " + passed + "; " + d1.join(", "));
    const sel = '#view #pdDue details[data-due=pset][data-id="1806-ps1"]';
    await page.click(sel + " > summary");
    const body = await page.evaluate(s => { const d = document.querySelector(s), a = d && d.querySelector(".pd-body a[href]"), cb = d && d.querySelector("input[data-pset]");
      return d ? { open: d.open, src: a ? a.getAttribute("href") : null, srcVis: !!a && a.checkVisibility(), cb: !!cb && cb.closest("label").checkVisibility() } : null; }, sel);
    check("(pd) \"Open\" on the pset shows its source link and its done toggle", !!body && body.open && /^https:\/\/ocw\.mit\.edu\//.test(body.src || "") && body.srcVis && body.cb, JSON.stringify(body));
    await markView(page);
    await page.click(sel + " label:has(input[data-pset])");
    await viewReplaced(page);
    const d2 = await due(), ps = await page.evaluate(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").psets || {})["1806-ps1"]);
    check("(pd) marking it done stores psets[\"1806-ps1\"] = true and takes the row off Problems", ps === true && !d2.includes("pset:1806-ps1"), "stored " + ps + "; " + (d2.join(", ") || "nothing due"));
    check("(pd) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- T-054: Monk Mode, #/monk (loop/specs/T-054-monk-page/spec.md) ----
  // At 390 and 1280, on Fri 30 Oct 2026 (day 1 of 21 since T-061 moved day 1 to 30 Oct; T-057 had it on Wed 28 Oct, day 5 of 90 before that), nothing stored:
  //   opening the page writes nothing (twice, and after a repaint);
  //   a prayer chip, No sin (a toggle), a German chip, the work and Brickford-hours steppers and a new loop each write exactly
  //   once, on the press, and the page shows it; the four seed loops are
  //   on screen before anything is stored, and stored with the first loop;
  //   saving tomorrow's plan writes once, ticks today's "Plan tomorrow", and
  //   with the clock moved to Sat 31 Oct (day 2) is that day's Top 3.
  const MK_DAY = "2026-11-01", MK_NEXT = "2026-11-02";  // T-062: day 1 is Sun 1 Nov, day 2 Mon 2 Nov (was 30/31 Oct)
  const SEED_LOOPS = ["Carousel 'Top 5 Claude Code skills': approved twice 6 Oct, never rebuilt: rebuild or drop",
    "Carousel 'OpenAI agent broke into a health portal': approved 24 Sep, never built: drop or reframe",
    "Connect your main Gmail in Claude", "Allow huggingface.co in the cloud environment"];
  for (const w of WIDTHS) {
    console.log("\nT-054 Monk Mode at " + w + "px:");
    const { ctx, page, errors } = await fresh(browser, w, { monkStart: MK_DAY }, "/", MK_DAY);   // T-065: the start is state now; this one pins day 1 = 1 Nov
    const monk = () => page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").monk || null);
    const w0 = await writes(page);
    await go(page, "/monk");
    await go(page, "/");
    await go(page, "/monk");
    const w1 = await writes(page);
    const first = await page.evaluate(() => ({
      head: ((document.querySelector("#view .mk-head .one-kind") || {}).textContent || "").trim(),
      loops: [...document.querySelectorAll("#view [data-mk-loop] .g-t")].map(n => n.textContent.trim()),
      chips: [...document.querySelectorAll("#view [data-mk-pray]")].map(b => b.dataset.mkPray) }));
    check("(m) opening #/monk writes nothing (" + w0 + " -> " + w1 + ", opened twice)", w1 === w0 && !(await monk()));
    check("(m) the page is day 1 of 21 with 3 prayer chips and the 4 seed loops, before anything is stored",
      first.head === "Day 1 of 21" && first.chips.join() === "fajr,dhuhrAsr,maghribIsha" && JSON.stringify(first.loops) === JSON.stringify(SEED_LOOPS), JSON.stringify(first));
    const once = async (sel, name, ok) => {
      const before = await writes(page);
      await markView(page);
      await page.click(sel);
      await viewReplaced(page);
      const after = await writes(page), m = await monk();
      const pressed = await page.evaluate(s => { const b = document.querySelector(s); return b ? b.getAttribute("aria-pressed") : null; }, sel);
      check("(m) " + name + ": exactly one write, on the press, and the page shows it", after - before === 1 && !!m && ok(m, pressed), (after - before) + " write(s); " + JSON.stringify(m && m.days && m.days[MK_DAY]) + "; aria-pressed " + pressed);
    };
    const isISO = v => typeof v === "string" && !isNaN(Date.parse(v)) && /T/.test(v);
    await once("#view [data-mk-pray=fajr]", "the Fajr chip", (m, p) => m.days[MK_DAY].prayers.fajr === true && isISO(m.days[MK_DAY].at) && p === "true");
    // T-057: the Brickford habit toggle became the bfh hours stepper; No sin is the toggle pressed here.
    await once("#view [data-mk-habit=nosin]", "the No sin toggle", (m, p) => m.days[MK_DAY].nosin === true && m.days[MK_DAY].prayers.fajr === true && p === "true");
    await once("#view [data-mk-german=podcast]", "the German podcast chip", (m, p) => JSON.stringify(m.days[MK_DAY].german) === JSON.stringify({ podcast: true }) && m.days[MK_DAY].nosin === true && p === "true");
    await once("#view [data-mk-num=work][data-d='0.5']", "the work-hours stepper (+0.5)", m => m.days[MK_DAY].work === 0.5);
    const outText = await page.evaluate(() => ((document.querySelector("#view [data-mk-out=work]") || {}).textContent || "").trim());
    check("(m) the stepper reads 0.5 / 10", outText === "0.5 / 10", outText);
    await once("#view [data-mk-num=bfh][data-d='0.5']", "the Brickford-hours stepper (+0.5), under bfh, no boolean brickford written", m => m.days[MK_DAY].bfh === 0.5 && !("brickford" in m.days[MK_DAY]) && m.days[MK_DAY].work === 0.5);
    const bfhText = await page.evaluate(() => ((document.querySelector("#view [data-mk-out=bfh]") || {}).textContent || "").trim());
    check("(m) the Brickford stepper reads 0.5 / 3", bfhText === "0.5 / 3", bfhText);
    // A new loop: the first write to loops stores the four seeds with it.
    {
      const before = await writes(page);
      await page.fill("#mkLoopNew", "Reply to the venue");
      await markView(page);
      await page.click("#view [data-mk-add]");
      await viewReplaced(page);
      const m = await monk(), after = await writes(page);
      const texts = m && m.loops ? Object.values(m.loops).map(l => l.text) : [];
      check("(m) adding a loop: one write, the four seeds stored first, then the new one",
        after - before === 1 && texts.length === 5 && SEED_LOOPS.every(t => texts.includes(t)) && texts.includes("Reply to the venue") &&
        Object.values(m.loops).every(l => isISO(l.at) && l.done === false), (after - before) + " write(s); " + JSON.stringify(texts));
    }
    // Tomorrow's plan.
    {
      await page.fill("#mkPlanBusiness", "Call two venues");
      await page.fill("#mkPlanContent", "Script the Bahrain video");
      await page.fill("#mkPlanEducation", "MATH 120 lecture 4");
      const before = await writes(page);
      await markView(page);
      await page.click("#view [data-mk-save]");
      await viewReplaced(page);
      const m = await monk(), after = await writes(page);
      const plan = m && m.plans && m.plans[MK_NEXT];
      check("(m) saving tomorrow's plan: one write, the three fields under " + MK_NEXT + ", and today's Plan tomorrow ticked",
        after - before === 1 && !!plan && plan.business === "Call two venues" && plan.content === "Script the Bahrain video" && plan.education === "MATH 120 lecture 4" &&
        isISO(plan.at) && m.days[MK_DAY].plan === true, (after - before) + " write(s); " + JSON.stringify(plan));
      const top = await page.evaluate(() => [...document.querySelectorAll("#view #mkTop3 .g-t")].map(n => n.textContent.trim()));
      check("(m) today's Top 3 is still today's (the defaults), not tomorrow's", top.length === 3 && !top.includes("Call two venues"), JSON.stringify(top));
      await ctx.clock.setFixedTime(new Date(MK_NEXT + "T12:00:00Z"));
      await go(page, "/");
      const w2 = await writes(page);
      await go(page, "/monk");
      const top2 = await page.evaluate(() => [...document.querySelectorAll("#view #mkTop3 .g-t")].map(n => n.textContent.trim()));
      const head2 = await page.evaluate(() => ((document.querySelector("#view .mk-head .one-kind") || {}).textContent || "").trim());
      check("(m) the clock moved to " + MK_NEXT + ": day 2, and the Top 3 is the plan saved last night, with no write",
        head2 === "Day 2 of 21" && JSON.stringify(top2) === JSON.stringify(["Call two venues", "Script the Bahrain video", "MATH 120 lecture 4"]) && (await writes(page)) === w2,
        head2 + " " + JSON.stringify(top2));
    }
    await shot(page, "monk-" + w);
    check("(m) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- T-065: Start Monk Mode, one press-and-hold (loop/specs/T-065-monk-start/spec.md) ----
  // Nothing stored, on Fri 6 Nov 2026 (any day will do: the day it is pressed is day 1), at 390 and 1280:
  // the page and the dashboard offer Start and no day; the sheet says what it costs; its last button is
  // dead until the box is ticked; a click, a short hold, a hold that slides off the button and a hold
  // with the box unticked each start nothing; ticking and holding 1.5 s starts it with one write, and
  // then the page and the dashboard read Day 1 of 21 with Start gone. At 1280 once more by keyboard.
  const ST_DAY = "2026-11-06";
  const startSheet = page => page.evaluate(() => { const d = document.querySelector("dialog.sheet");
    if (!d || !d.open) return null;
    const h = d.querySelector("[data-monk-hold]"), a = d.querySelector("[data-monk-ack]"), r = h.getBoundingClientRect();
    return { lede: d.querySelector(".sheet-lede").textContent.trim(), ack: d.querySelector(".check-label").textContent.trim(), hold: h.textContent.trim(),
      disabled: h.disabled, checked: a.checked, w: r.width, h: r.height }; });
  const monkStored = page => page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").monkStart || null);
  const holdCentre = async page => { const b = await page.locator("[data-monk-hold]").boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const monkHead = page => page.evaluate(() => ((document.querySelector("#view .mk-head .one-kind") || {}).textContent || "").trim());
  for (const w of WIDTHS) {
    console.log("\nT-065 Start Monk Mode at " + w + "px:");
    const { ctx, page, errors } = await fresh(browser, w, null, "/", ST_DAY);
    const w0 = await writes(page);
    await go(page, "/monk");
    const pg = await page.evaluate(() => { const b = [...document.querySelectorAll("#view [data-monk-start]")], r = b[0] ? b[0].getBoundingClientRect() : null;
      return { n: b.length, t: b[0] ? b[0].textContent.trim() : "", w: r ? r.width : 0, h: r ? r.height : 0, day: /Day \d+ of \d+/.test(document.querySelector("#view").textContent) }; });
    check("(ms) the Monk page offers one Start Monk Mode button, at least 44x44, and no day number", pg.n === 1 && pg.t === "Start Monk Mode" && pg.w >= 44 && pg.h >= 44 && !pg.day, JSON.stringify(pg));
    await go(page, "/");
    const dr = await page.evaluate(() => { const b = [...document.querySelectorAll("#view [data-monk-start]")];
      return { n: b.length, t: b[0] ? b[0].textContent.replace(/◐/, "").trim() : "", h: b[0] ? b[0].getBoundingClientRect().height : 0, day: /Day \d+ of 21/.test(document.querySelector("#view").textContent) }; });
    check("(ms) the dashboard's Monk row is one Start Monk Mode button, at least 44 high, and no day number", dr.n === 1 && dr.t === "Start Monk Mode" && dr.h >= 44 && !dr.day, JSON.stringify(dr));
    check("(ms) looking at both wrote nothing and started nothing", (await writes(page)) === w0 && (await monkStored(page)) === null, (await writes(page)) + " writes");

    // The dashboard's row opens the sheet; Cancel and Escape close it and store nothing.
    await page.click("#view button.monk-row");
    await page.waitForSelector("dialog.sheet[open]");
    const s0 = await startSheet(page);
    check("(ms) the sheet says \"21 days. Day 1 is today (Fri 6 Nov). This can't be undone or reset.\", asks \"I understand it can't be reset\", and its last button reads Hold to start, dead and at least 44x44",
      !!s0 && /^21 days\. Day 1 is today \(Fri,? 6 Nov\)\. This can't be undone or reset\.$/.test(s0.lede) && s0.ack === "I understand it can't be reset" && s0.hold === "Hold to start" &&
      s0.disabled === true && s0.checked === false && s0.w >= 44 && s0.h >= 44, JSON.stringify(s0));
    await page.click("dialog.sheet [data-sheet-cancel]");
    check("(ms) Cancel closes the sheet and starts nothing", !(await startSheet(page)) && (await monkStored(page)) === null && (await writes(page)) === w0);
    await page.click("#view button.monk-row");
    await page.waitForSelector("dialog.sheet[open]");
    await page.keyboard.press("Escape");
    check("(ms) Escape closes the sheet and starts nothing", !(await startSheet(page)) && (await monkStored(page)) === null && (await writes(page)) === w0);

    await go(page, "/monk");
    await page.click("#view [data-monk-start]");
    await page.waitForSelector("dialog.sheet[open]");
    await shot(page, "monk-start-sheet-" + w);
    // The box unticked: the button is dead, and holding it does nothing.
    let c = await holdCentre(page);
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    await page.waitForTimeout(1700);
    await page.mouse.up();
    check("(ms) with the box unticked, holding the button 1.7 s starts nothing", (await monkStored(page)) === null);
    await page.click("dialog.sheet .check-row");
    const s1 = await startSheet(page);
    check("(ms) ticking the box enables the button", !!s1 && s1.checked === true && s1.disabled === false, JSON.stringify(s1));
    // Ticked: none of these may start it. Each waits past the 1.5 s it would have needed.
    await page.click("[data-monk-hold]");
    await page.waitForTimeout(1700);
    check("(ms) a single click on the final button does NOT start it (1.7 s later: nothing stored, sheet still open)", (await monkStored(page)) === null && !!(await startSheet(page)));
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    await page.waitForTimeout(700);
    await page.mouse.up();
    await page.waitForTimeout(1000);
    check("(ms) a 0.7 s hold, let go, does not start it (1.7 s after the press)", (await monkStored(page)) === null && !!(await startSheet(page)));
    await page.mouse.down();
    await page.waitForTimeout(300);
    await page.mouse.move(2, 2);
    await page.waitForTimeout(1500);
    await page.mouse.move(c.x, c.y);   // back on the button before letting go: a release on the dimmed page would dismiss the sheet, which is not what this measures
    await page.mouse.up();
    check("(ms) a hold that slides off the button does not start it, nor does coming back (1.8 s after the press)", (await monkStored(page)) === null && !!(await startSheet(page)));
    // The real one. (If an earlier press already started it or closed the sheet, say so and stop here
    // rather than fail on a missing button: a harness error would hide which check caught it.)
    if (!(await startSheet(page))) {
      check(false, "(ms) the sheet is still open for the real hold (an earlier press started it or closed it)");
      await ctx.close();
      continue;
    }
    const before = await writes(page);
    c = await holdCentre(page);
    await page.mouse.move(c.x, c.y);
    const t0 = Date.now();
    await page.mouse.down();
    await page.waitForFunction(() => !!JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").monkStart, null, { timeout: 6000 });
    const held = Date.now() - t0;
    await page.mouse.up();
    await page.waitForFunction(() => !document.querySelector("dialog.sheet") && !!document.querySelector("#view .mk-head"), null, { timeout: 4000 });
    check("(ms) ticked and held, it starts after about 1.5 s (" + held + " ms), stores " + ST_DAY + " in one write, and the sheet closes",
      held >= 1400 && held < 4500 && (await monkStored(page)) === ST_DAY && (await writes(page)) - before === 1, held + " ms; " + ((await writes(page)) - before) + " write(s); " + (await monkStored(page)));
    check("(ms) the page then reads Day 1 of 21, with no Start button left", (await monkHead(page)) === "Day 1 of 21" && (await page.evaluate(() => document.querySelectorAll("[data-monk-start]").length)) === 0, await monkHead(page));
    await shot(page, "monk-started-" + w);
    await go(page, "/");
    const dd = await page.evaluate(() => { const a = document.querySelector("#view a.monk-row"); return { head: a ? a.querySelector(".g-main").textContent : null, start: document.querySelectorAll("[data-monk-start]").length }; });
    // T-080 PR 2: the row sits in the dashboard's "Needs you" strip; its own title and day are read.
    check("(ms) the dashboard row then reads Monk ModeDay 1 of 21, with no Start button left", /^Monk ModeDay 1 of 21 \u00b7 /.test(dd.head || "") && dd.start === 0, JSON.stringify(dd));
    check("(ms) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }
  {
    console.log("\nT-065 Start Monk Mode by keyboard at 1280px:");
    const { ctx, page, errors } = await fresh(browser, 1280, null, "/", ST_DAY);
    await go(page, "/monk");
    await page.focus("#view [data-monk-start]");
    await page.keyboard.press("Enter");
    await page.waitForSelector("dialog.sheet[open]");
    await page.focus("[data-monk-ack]");
    await page.keyboard.press("Space");
    await page.focus("[data-monk-hold]");
    await page.keyboard.down("Enter");
    await page.waitForTimeout(600);
    await page.keyboard.up("Enter");
    await page.waitForTimeout(1000);
    check("(ms) by keyboard: the box ticked with Space, then Enter held 0.6 s and released starts nothing", (await monkStored(page)) === null && !!(await startSheet(page)), String(await monkStored(page)));
    const t0 = Date.now();
    await page.keyboard.down("Space");
    await page.waitForFunction(() => !!JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").monkStart, null, { timeout: 6000 });
    const held = Date.now() - t0;
    await page.keyboard.up("Space");
    await page.waitForFunction(() => !document.querySelector("dialog.sheet") && !!document.querySelector("#view .mk-head"), null, { timeout: 4000 });
    check("(ms) by keyboard: Space held starts it after about 1.5 s (" + held + " ms), and the page reads Day 1 of 21",
      held >= 1400 && held < 4500 && (await monkStored(page)) === ST_DAY && (await monkHead(page)) === "Day 1 of 21", held + " ms; " + (await monkHead(page)));
    check("(ms) no page errors (keyboard)", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (pr) T-067 step 3: practice items ----
  // Under a watched lecture's quiz: a numeric item answered right and wrong, a
  // worked solution that is not in the page until an attempt, a written answer
  // whose checklist is not in the page under 80 characters, a missed item back
  // in Recall two days on, Grade with Claude against a stub (one request, only
  // the question, the checklist and the answer; the key in no DOM, no body and
  // no stored state), its fallback without a key, and Copy this week's answers.
  {
    console.log("\npractice items (T-067 step 3):");
    const PR_DAY = "2026-11-22", PR_LATER = "2026-11-24";
    const KEY = "sk-ant-test-stub-not-a-real-key-0123456789";
    const W = { done: true, doneAt: PR_DAY, notes: "", checks: [] };
    const PR_STATE = { studyDays: ["2026-11-20"], lessons: {
      "math110.1.8": Object.assign({ quiz: { passedAt: PR_DAY, total: 2, firstTry: 2 } }, W),
      "ai200.0.3": Object.assign({}, W, { doneAt: "2026-10-20" }) } };
    const PRK = "math110.1.8", PRI = await (async () => {
      const ctx0 = { window: {} }; ctx0.window.DAR = {};
      require("vm").runInNewContext(fs.readFileSync(path.join(path.resolve(__dirname, ".."), "platform/data/practice-math110.js"), "utf8") +
        fs.readFileSync(path.join(path.resolve(__dirname, ".."), "platform/data/practice-ai200.js"), "utf8"), Object.assign(ctx0, { DAR: ctx0.window.DAR }));
      return ctx0.window.DAR.PRACTICE;
    })();
    const item = id => "#view .pr-item[data-pr-id='" + id + "']";
    const prStore = page => page.evaluate(() => JSON.parse(localStorage.getItem("darhikmah_v1") || "{}"));
    const answerIt = async (page, id, v) => {
      await page.fill(item(id) + " .pr-in", v);
      await page.click(item(id) + " [data-pr='check']");
    };
    const grades = [];
    const { ctx, page, errors } = await fresh(browser, 390, PR_STATE, "/", PR_DAY);
    let later = null;
    // A planted bug can take away a field the next step needs: that is a failed check, not a crashed gate.
    try {
    await go(page, "/lesson/math110/1/8");
    await page.waitForSelector("#view .pr-list");
    const kinds = await page.evaluate(() => [...document.querySelectorAll("#view .pr-item")].map(e => e.dataset.prType).join(","));
    check("(pr) a watched lecture shows its Practice block under the quiz, one card per item", kinds === PRI[PRK].map(i => i.type).join(","), kinds);
    // numeric, right and wrong
    await answerIt(page, "p1", String(PRI[PRK][0].num));
    await page.waitForSelector(item("p1") + " .pill.good");
    await answerIt(page, "p2", String(PRI[PRK][1].num + 3));
    await page.waitForSelector(item("p2") + " .pill.crimson");
    let s = await prStore(page);
    const p = (s.practice || {})[PRK] || {};
    check("(pr) a numeric item answered right is marked right, stored as ok, and counts toward the gate",
      (p.p1 || {}).mark === "ok" && (p.p1 || {}).answer === String(PRI[PRK][0].num) &&
      await page.evaluate(() => (document.querySelector("#view [data-pr-count]") || {}).textContent) === "1 of 3 solved",
      JSON.stringify(p.p1) + "; " + await page.evaluate(() => (document.querySelector("#view [data-pr-count]") || {}).textContent));
    check("(pr) a numeric item answered wrong shows the answer, is stored as missed, and enters the spaced review",
      (p.p2 || {}).mark === "missed" && ((s.review || {})["p:" + PRK + ":p2"] || {}).due === PR_LATER &&
      new RegExp("the answer is " + PRI[PRK][1].num).test(await page.textContent(item("p2"))), JSON.stringify(p.p2) + " " + JSON.stringify((s.review || {})["p:" + PRK + ":p2"]));
    // worked: the solution is not in the page before an attempt
    const before = await page.evaluate(sel => { const e = document.querySelector(sel); return { steps: e.querySelectorAll(".pr-steps, .pr-sol").length, html: e.innerHTML }; }, item("p3"));
    const stepText = PRI[PRK][2].steps[1];
    check("(pr) a worked solution is not in the page before an attempt (no steps, no answer in the DOM)",
      before.steps === 0 && before.html.indexOf(stepText) < 0, before.steps + " solution element(s)");
    await answerIt(page, "p3", "dependent");
    await page.waitForSelector(item("p3") + " .pr-steps");
    const after = await page.evaluate(sel => document.querySelectorAll(sel + " .pr-steps li").length, item("p3"));
    await page.click(item("p3") + " [data-pr='mark'][data-m='missed']");
    await page.waitForSelector(item("p3") + " .pill.crimson");
    s = await prStore(page);
    check("(pr) after an attempt the worked steps show, and Missed is stored and scheduled for review",
      after === PRI[PRK][2].steps.length && ((s.practice[PRK] || {}).p3 || {}).mark === "missed" && !!(s.review || {})["p:" + PRK + ":p3"], after + " steps");
    // write: the checklist is not in the page under 80 characters
    await go(page, "/lesson/ai200/0/3");
    await page.waitForSelector(item("p2") + " textarea.pr-in");
    await answerIt(page, "p2", "Forward, loss, gradient, backprop, update. Done.");
    await page.waitForTimeout(300);
    const short = await page.evaluate(sel => ({ ticks: document.querySelectorAll(sel + " [data-pr-tick]").length, model: document.querySelector(sel).innerHTML.indexOf("Model answer") }), item("p2"));
    s = await prStore(page);
    check("(pr) a written answer under 80 characters reveals no checklist and no model answer, and stores nothing",
      short.ticks === 0 && short.model < 0 && !((s.practice || {})["ai200.0.3"] || {}).p2, JSON.stringify(short));
    const essay = "The forward pass runs the input through each layer to a prediction; the loss scores it against the target; " +
      "backpropagation applies the chain rule from the output back to get the gradient of the loss for every weight; each weight then steps against its gradient.";
    await answerIt(page, "p2", essay);
    await page.waitForSelector(item("p2") + " [data-pr-tick]", { state: "attached" });
    const ticks = await page.evaluate(sel => document.querySelectorAll(sel + " [data-pr-tick]").length, item("p2"));
    await page.click(item("p2") + " .check-row >> nth=0");
    await page.waitForTimeout(200);
    s = await prStore(page);
    check("(pr) at 80 characters or more the checklist and the model answer appear, and a tick is stored",
      ticks === PRI["ai200.0.3"][1].points.length && (((s.practice["ai200.0.3"] || {}).p2 || {}).ticks || [])[0] === true, ticks + " points");
    // Grade with Claude: no key yet, so the button is off and the line says why
    const noKey = await page.evaluate(sel => { const b = document.querySelector(sel + " [data-pr='grade']"); return { off: !!(b && b.disabled), msg: (document.querySelector(sel + " .pr-msg") || {}).textContent }; }, item("p2"));
    check("(pr) without a key, Grade with Claude is off and one line falls back to self-check", noKey.off && /self-check/.test(noKey.msg || ""), JSON.stringify(noKey));
    await go(page, "/sync");
    await page.waitForSelector("#aiKeyIn");
    await page.fill("#aiKeyIn", KEY);
    await page.click("[data-act='aiKeySave']");
    await page.waitForSelector("[data-act='aiKeyForget']");
    await page.route("https://api.anthropic.com/**", route => {
      const rq = route.request();
      grades.push({ url: rq.url(), method: rq.method(), headers: rq.headers(), body: rq.postData() });
      const it = PRI["ai200.0.3"][1];
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ type: "message", role: "assistant",
        content: [{ type: "text", text: JSON.stringify({ points: it.points.map((t, i) => ({ point: t, verdict: i < 4 ? "met" : "missing" })),
          correction: "Say what the learning rate does, and that the loop repeats over mini-batches." }) }] }) });
    });
    await go(page, "/lesson/ai200/0/3");
    await page.waitForSelector(item("p2") + " [data-pr='grade']:not([disabled])");
    await page.click(item("p2") + " [data-pr='grade']");
    await page.waitForSelector(item("p2") + " .pr-gl li");
    await page.waitForTimeout(300);
    const g0 = grades[0] || { headers: {}, body: "{}" }, body = JSON.parse(g0.body || "{}");
    let content = {};
    try { content = JSON.parse(((body.messages || [])[0] || {}).content || "{}"); } catch (e) {}
    const itW = PRI["ai200.0.3"][1];
    check("(pr) Grade with Claude sends exactly one Messages API request with the key in its header and the browser-access header",
      grades.length === 1 && g0.method === "POST" && g0.url === "https://api.anthropic.com/v1/messages" && g0.headers["x-api-key"] === KEY &&
      g0.headers["anthropic-dangerous-direct-browser-access"] === "true" && /^\d{4}-\d\d-\d\d$/.test(g0.headers["anthropic-version"] || ""),
      grades.length + " request(s), version " + g0.headers["anthropic-version"]);
    check("(pr) the request holds only the question, the checklist and the answer (and the grading instruction and JSON schema)",
      JSON.stringify(Object.keys(body).sort()) === JSON.stringify(["fallbacks", "max_tokens", "messages", "model", "output_config", "system"]) &&
      body.fallbacks === "default" && g0.headers["anthropic-beta"] === "server-side-fallback-2026-07-01" &&
      (body.messages || []).length === 1 && JSON.stringify(Object.keys(content).sort()) === JSON.stringify(["answer", "key_points", "question"]) &&
      content.question === itW.q && content.answer === essay && JSON.stringify(content.key_points) === JSON.stringify(itW.points) &&
      body.output_config.format.type === "json_schema",
      "body " + Object.keys(body).join(",") + "; content " + Object.keys(content).join(","));
    s = await prStore(page);
    const g = (((s.practice || {})["ai200.0.3"] || {}).p2 || {}).grade || {};
    const verdicts = await page.evaluate(sel => document.querySelectorAll(sel + " .pr-gl li").length, item("p2"));
    check("(pr) the verdict per key point and the one correction are shown and stored with the item",
      verdicts === itW.points.length && (g.points || []).length === itW.points.length && /learning rate/.test(g.correction || "") &&
      /learning rate/.test(await page.textContent(item("p2"))), verdicts + " verdicts");
    const leak = await page.evaluate(k => ({ dom: document.documentElement.outerHTML.indexOf(k) >= 0, state: (localStorage.getItem("darhikmah_v1") || "").indexOf(k) >= 0 }), KEY);
    check("(pr) the key appears nowhere in the DOM, the request body or the stored progress state",
      !leak.dom && !leak.state && (g0.body || "").indexOf(KEY) < 0, JSON.stringify(leak));
    // Copy this week's answers
    await go(page, "/");
    await page.waitForSelector("#view [data-act='copyWeek']");
    await page.evaluate(() => { navigator.clipboard.writeText = t => { window.__copied = t; return Promise.resolve(); }; });   // the clipboard, stubbed
    await page.click("#view [data-act='copyWeek']");
    await page.waitForFunction(() => typeof window.__copied === "string", null, { timeout: 4000 }).catch(() => {});
    const copied = await page.evaluate(() => window.__copied || "");
    check("(pr) Copy this week's answers produces the questions and the answers as plain text",
      /^Brickford practice, 2026-11-16 to 2026-11-22/.test(copied) && copied.indexOf("My answer: " + PRI[PRK][0].num) >= 0 &&
      copied.indexOf(essay) >= 0 && copied.indexOf("Independence, Basis, and Dimension") >= 0 && copied.indexOf("<") < 0 && copied.indexOf(KEY) < 0,
      copied.split("\n").length + " lines");
    check("(pr) no page errors", errors.length === 0, errors.join(" | "));
    later = await prStore(page);
    } catch (e) { check("(pr) the practice flow ran to its end without a harness error", false, String(e.message).split("\n")[0]); }
    await ctx.close();
    // Two days on: the missed items are due in Recall, and on the dashboard.
    if (later) {
      const { ctx, page, errors } = await fresh(browser, 390, later, "/", PR_LATER);
      await go(page, "/recall");
      await page.waitForSelector("#view .pr-recall");
      const cards = await page.evaluate(() => [...document.querySelectorAll("#view .pr-recall")].map(e => e.textContent));
      const q2 = PRI[PRK][1].q.split("$")[0];
      check("(pr) a missed item comes back in Recall when its review is due", cards.length === 2 && cards.some(t => t.indexOf(q2) >= 0), cards.length + " practice card(s)");
      await page.click("#view [data-recall='solid'][data-k='p:" + PRK + ":p2']");
      await page.waitForTimeout(300);
      const rv = ((await prStore(page)).review || {})["p:" + PRK + ":p2"] || {};
      check("(pr) grading it Solid in Recall pushes it out like any review", rv.box === 1 && rv.due > PR_LATER, JSON.stringify(rv));
      check("(pr) no page errors (Recall)", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- (cp) T-069: the near checkpoints ----
  // On Today, at 390 (tapped) and 1280 (ticked by keyboard, unticked by mouse):
  // an item ticked and unticked is one write each, { done, at } stored, the
  // checkpoint's count repainted in place and the fold left open; every row and
  // fold head of the block is at least 44x44; drawing the block writes nothing.
  for (const w of WIDTHS) {
    console.log("\ncheckpoints (T-069) at " + w + "px:");
    const CP_DAY = "2026-11-16";
    const { ctx, page, errors } = await fresh(browser, w, null, "/", CP_DAY);
    try {
      await page.waitForSelector("#view .cp-list");
      const w0 = await writes(page);
      const small = await page.evaluate(() => [...document.querySelectorAll("#view .cp-list summary, #view .cp-list label.check-row")]
        .filter(el => el.checkVisibility()).map(el => { const b = el.getBoundingClientRect(); return { t: el.textContent.trim().slice(0, 24), w: b.width, h: b.height }; }));
      check("(cp) every fold head and tick row of the Checkpoints block is at least 44x44 (" + small.length + " on screen)",
        small.length >= 7 && small.every(b => b.w >= 44 && b.h >= 44), small.filter(b => b.w < 44 || b.h < 44).map(b => b.t + " " + Math.round(b.w) + "x" + Math.round(b.h)).join(", ") || small.length + " targets");
      const ITEM = '#view input[data-cp-tick="c1|sameday"]', ROW = "#view label:has(" + ITEM.slice(6) + ")";
      const read = () => page.evaluate(sel => ({ checked: document.querySelector(sel).checked, meta: document.querySelector('#view [data-cp-meta="c1"]').textContent,
        open: document.querySelector('#view details.cp[data-cp="c1"]').open, st: ((JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").checkpoints || {}).c1 || {}).sameday || null }), ITEM);
      if (w < 860) await page.tap(ROW);
      else { await page.focus(ITEM); await page.keyboard.press("Space"); }
      await page.waitForFunction(sel => document.querySelector(sel).checked, ITEM, { timeout: 4000 });
      const on = Object.assign(await read(), { w: (await writes(page)) - w0 });
      check("(cp) " + (w < 860 ? "a tap" : "Space on the focused box") + " ticks an item: one write, { done: true, at } stored, the count reads 1/4, the checkpoint stays open",
        on.w === 1 && on.checked && on.st && on.st.done === true && /^2026-11-16T/.test(on.st.at) && on.meta.startsWith("1/4 \u00b7 6 Dec \u00b7 20d left") && on.open, JSON.stringify(on));
      const w1 = await writes(page);
      if (w < 860) await page.tap(ROW); else await page.click(ROW);
      await page.waitForFunction(sel => !document.querySelector(sel).checked, ITEM, { timeout: 4000 });
      const off = Object.assign(await read(), { w: (await writes(page)) - w1 });
      check("(cp) " + (w < 860 ? "a second tap" : "a click") + " unticks it: one write, { done: false, at } stored (the untick kept, so it syncs), the count reads 0/4",
        off.w === 1 && !off.checked && off.st && off.st.done === false && !!off.st.at && off.meta.startsWith("0/4") && off.open, JSON.stringify(off));
      await page.evaluate(() => window.scrollTo(0, 0));
      await go(page, "/record");
      await go(page, "/");
      check("(cp) drawing Proof and Today again writes nothing, and Today still shows the untick", (await writes(page)) - w1 === 1 &&
        !(await page.evaluate(sel => document.querySelector(sel).checked, ITEM)), ((await writes(page)) - w1 - 1) + " write(s) on render");
      await shot(page, "checkpoints-" + w);
    } catch (e) { check("(cp) the checkpoints flow ran to its end without a harness error", false, String(e.message).split("\n")[0]); }
    check("(cp) no page errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // ---- (ob) T-079: the owed banner on Today (loop/specs/T-079-owed-banner/spec.md) ----
  // Clock Sun 29 Nov, first activity Wed 25 Nov, nothing watched: Wednesday to Friday's lectures are owed
  // and Sunday's are today's. The banner lists owedList() (verify-logic holds the list itself) in order, five
  // rows and the rest in a closed <details>, each row 44px and labelled by its lateness. Drawing it writes
  // nothing. Tapping a row opens that lecture; marking it watched removes the row. With nothing owed (no
  // activity, and activity on a Saturday with nothing scheduled) there is no banner.
  {
    const OB_DAY = "2026-11-29", OB_SEED = { studyDays: ["2026-11-25"] };
    const banner = page => page.evaluate(() => {
      const rows = [...document.querySelectorAll("#view [data-owed]")], more = document.querySelector("#view details.owed-more");
      return { head: !!document.querySelector("#view .owed-head"), keys: rows.map(r => r.dataset.owed), hrefs: rows.map(r => r.getAttribute("href")),
        labels: rows.map(r => r.querySelector(".g-v").textContent), shown: rows.filter(r => r.checkVisibility()).length,
        moreOpen: more ? more.open : null, moreLabel: more ? more.querySelector("summary").textContent.trim() : null,
        small: [...rows, ...(more ? [more.querySelector("summary")] : [])].filter(r => r.checkVisibility()).map(r => r.getBoundingClientRect())
          .filter(b => b.width < 44 || b.height < 44).map(b => Math.round(b.width) + "x" + Math.round(b.height)) };
    });
    const word = e => e.late > 1 ? e.late + " days late" : e.late === 1 ? "1 day late" : "today";
    for (const w of WIDTHS) {
      console.log("\nowed banner (T-079) at " + w + "px:");
      const { ctx, page, errors } = await fresh(browser, w, OB_SEED, "/__test", OB_DAY);
      try {
        const list = await page.evaluate(() => window.__brickfordTest.owedList());
        const w0 = await writes(page);
        await go(page, "/");
        const b = await banner(page);
        check("(ob) the banner lists every owed lecture, oldest first, each labelled today / 1 day late / N days late (" + list.length + " owed)",
          b.head && list.length > 5 && b.keys.join() === list.map(e => e.k).join() && b.labels.join() === list.map(word).join() &&
            list.some(e => e.late > 1) && list.some(e => e.late === 1) && list.some(e => e.late === 0),
          JSON.stringify({ rows: b.keys.length, labels: b.labels.slice(0, 6) }));
        check("(ob) five rows show, the rest sit in a closed <details> reading +N more", b.shown === 5 && b.moreOpen === false && b.moreLabel === "+" + (list.length - 5) + " more",
          b.shown + " shown, details " + b.moreOpen + " \"" + b.moreLabel + "\"");
        check("(ob) every row on screen and the +N more fold are at least 44x44", b.small.length === 0, b.small.join(", ") || "all 44+");
        check("(ob) drawing Today with the banner writes nothing", (await writes(page)) - w0 === 0, ((await writes(page)) - w0) + " write(s)");
        // A row whose lecture has no quiz, so marking it watched clears it.
        const i = await page.evaluate(keys => keys.findIndex(k => { const p = k.split("."), c = window.DAR.COURSES.find(x => x.id === p[0]), l = c.units[+p[1]].lessons[+p[2]];
          return !((((window.DAR.SUMMARIES || {})[l.alias || k] || {}).checks || []).length); }), b.keys.slice(0, 5));
        if (i < 0) throw new Error("no quiz-free lecture among the first five rows");
        const k = b.keys[i];
        await markView(page);
        if (w < 860) await page.tap('#view [data-owed="' + k + '"]'); else await page.click('#view [data-owed="' + k + '"]');
        await viewReplaced(page);
        const at = await page.evaluate(() => location.hash);
        check("(ob) " + (w < 860 ? "tapping" : "clicking") + " a row opens that lecture (" + k + ")", at === "#" + b.hrefs[i].slice(1) && at === "#/lesson/" + k.split(".").join("/"), at);
        await page.click("#view [data-act=toggleDone]");
        await page.waitForFunction(() => ((document.querySelector("#view [data-act=toggleDone]") || {}).textContent || "").trim() === "Unmark watched", null, { timeout: 8000 });
        await go(page, "/");
        const b2 = await banner(page);
        check("(ob) marking it watched removes its row, and only its row", !b2.keys.includes(k) && b2.keys.join() === b.keys.filter(x => x !== k).join(), b2.keys.length + " rows, was " + b.keys.length);
        await shot(page, "owed-banner-" + w);
      } catch (e) { check("(ob) the owed-banner flow ran to its end without a harness error", false, String(e.message).split("\n")[0]); }
      check("(ob) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
      for (const [name, seed, day] of [["no activity", null, OB_DAY], ["activity only on a Saturday, nothing scheduled", { studyDays: ["2026-11-28"] }, "2026-11-28"]]) {
        const f = await fresh(browser, w, seed, "/__test", day);
        await go(f.page, "/");
        const n = await f.page.evaluate(() => window.__brickfordTest.owedList().length), e = await banner(f.page);
        check("(ob) nothing owed (" + name + "): no banner", n === 0 && !e.head && e.keys.length === 0 && e.moreOpen === null && !f.page.isClosed() &&
          !(await f.page.evaluate(() => !!document.querySelector("#view .owed-list"))), n + " owed, head " + e.head + ", " + e.keys.length + " rows");
        check("(ob) no page errors (" + name + ")", f.errors.length === 0, f.errors.join(" | "));
        await f.ctx.close();
      }
    }
  }

  await browser.close();
  console.log("");
  check("no network sync (GitHub requests from test contexts)", githubHits === 0, githubHits + " request(s)");
  console.log("\n" + (fails === 0
    ? "PASS — " + checks + " checks: 9 flows (open, answer, mark watched, resume, render-is-a-read, under-a-second, the player's own frame, a lab ticked on Problems, a gate passed and unmarked through its confirm sheet) x " +
      WIDTHS.length + " widths, each in a fresh context; the resume point's sync merge, an unmarked gate that survives a pull of the pass (both devices), a slow phone's late player, and the tab bar's slide, tap and scroll memory once, and the answer slot uniform across all multiple-choice mounts, every question graded by the option rather than the slot; " +
      "Seal the week at 1440/390 x 2 themes, once with an empty ledger (BHD typed) and once with none of the ledger in the week (a counted 0), the stored week the shape it always was (T-026c); " +
      "record yourself at 390/1280 with a fake microphone — the clip in IndexedDB, one rep through the form's path, no audio in localStorage, play, rename and delete, the 1:30 stop on a shortened limit, a Saturday — and no microphone (denied, and no device) at 390/1280, the line and the form by hand (T-028); " +
      "Monk Mode at 390/1280 — opening writes nothing, a prayer chip, No sin, a German chip, the work and Brickford-hours steppers, a loop and tomorrow's plan one write each, and that plan as the next day's Top 3 (T-054); " +
      "Start Monk Mode at 390/1280 — a tick, then a hold of 1.5 s (mouse, and Space at 1280) and no click, short hold or slide-off starts it, one write, Day 1 of 21 on the page and the dashboard (T-065); " +
      "practice items at 390 — numeric right and wrong, a worked solution and a written checklist kept out of the page until an attempt, Grade with Claude against a stub (one request, only the question, checklist and answer, the key nowhere), Copy this week, and a missed item back in Recall (T-067 step 3); " +
      "checkpoints at 390 (tapped) and 1280 (keyboard, then mouse) — tick and untick one write each, 44x44 targets, drawing writes nothing (T-069); " +
      "the owed banner at 390 and 1280 — the owed list in order with its lateness, five rows and +N more, 44x44, drawing writes nothing, a row opens its lecture, watching it removes the row, no banner with nothing owed (T-079); " +
      "record on the phone, transcribe on the laptop — the upload to the private repo's audio/ at 390 and 1280, the phone with no transcription at all, consent, the transcript on IndexedDB only, fillers, counts, words per minute, Copy, the desktop pull, the upload failure and its retry per open, Not now, and every failure line (T-046)"
    : fails + " of " + checks + " flow check(s) FAILED"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
