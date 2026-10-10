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
//   node tools/verify-flows.js                 # gate
//   node tools/verify-flows.js --shots <dir>   # also write a screenshot per flow
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const URL = "file://" + path.join(path.resolve(__dirname, ".."), "platform/index.html") + "#";

// Plan day 14 (moved with reset six, START 2026-10-05; was 2026-10-06 under START 2026-09-21).
const TODAY = "2026-10-20";               // a Tuesday: a study day with lectures scheduled
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
async function fresh(browser, w, state, boot) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: w < 860,
  });
  await ctx.route(/^https?:/, r => {
    if (/api\.github\.com/.test(r.request().url())) githubHits++;
    return r.abort();
  });
  await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
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
async function go(page, route) {
  await markView(page);
  await page.goto(URL + route, { waitUntil: "load" });
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

// Watched lectures unlock quiz questions, so flow (b) starts with some watched.
const WATCHED = {};
for (let i = 0; i < 16; i++) WATCHED["math110.0." + i] = { done: true, doneAt: "2026-10-15", notes: "", checks: [] };

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
        return a ? { href: a.getAttribute("href"), title: k ? k.textContent.trim() : "" } : null;
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
        check("(a) its button opens that lecture", got.hash === cta.href && got.h1.includes(cta.title) && got.btn,
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

    // ---- (c) mark a lecture watched ----
    {
      const { ctx, page, errors } = await fresh(browser, w, null);
      const before = await todayCount(page);
      check("(c) the dashboard shows a count for today", !!before && before.of > 0,
        before ? before.done + " / " + before.of + " today" : "no \"N / M today\" on the dashboard");
      await markView(page);
      await page.click(".card.one.lead a.one-go");
      await viewReplaced(page);
      await markView(page);
      await page.click("#view [data-act=toggleDone]");
      await viewReplaced(page);
      const label = await page.evaluate(() => document.querySelector("#view [data-act=toggleDone]").textContent.trim());
      check("(c) the lecture page records it", label === "Unmark watched", "button now reads \"" + label + "\"");
      await go(page, "/");
      const after = await todayCount(page);
      check("(c) the dashboard count goes up by one", !!before && !!after && after.done === before.done + 1 && after.of === before.of,
        (before ? before.done + " / " + before.of : "?") + " -> " + (after ? after.done + " / " + after.of : "?"));
      await shot(page, "flow-c-mark-watched-" + w);
      check("(c) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }

    // ---- (d) resume: kept on pause, on leaving, on pagehide; cleared at the end ----
    {
      const { ctx, page, errors } = await fresh(browser, w, null, "/__test");
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
        const i = a.querySelector(".thumb .th-prog i");
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
      const { ctx, page, errors } = await fresh(browser, w, seeded, "/__test");
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
      const T10 = "2026-10-20T10:00:00.000Z";
      const seeded = { lessons: { [LK]: { done: false, notes: "", checks: [], pos: 754, posAt: T10 } } };
      const { ctx, page, errors } = await fresh(browser, w, seeded, "/__test");
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
      const B = { cid: LECTURE.cid, ui: LECTURE.ui, li: LECTURE.li - 1 };
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
      const { ctx, page, errors } = await fresh(browser, w, null, "/");
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
    const { ctx, page, errors } = await fresh(browser, 390, null, "/");
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

  // ---- (f) the resume point syncs: the later posAt wins, per lecture ----
  // Once, at the desktop width: nothing here is about layout. A stub token and
  // a stub GitHub, both inside this context; the pull is the one boot() makes.
  console.log("\nsync (once)");
  {
    const T9 = "2026-10-20T09:00:00.000Z", T10 = "2026-10-20T10:00:00.000Z", T11 = "2026-10-20T11:00:00.000Z";
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
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: true });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    let remote = null, put = null, gets = 0, gotPut = null;
    await ctx.route(/^https?:/, r => {
      const req = r.request();
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
    await page.goto(URL + "/transcript", { waitUntil: "load" });
    await page.waitForSelector("#view > *");
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
      const thePass = (await gatesStored(page))[1];
      await ctx.clock.setFixedTime(new Date(TODAY + "T12:05:00Z"));
      await passVia("unmark");
      const theUnmark = (await gatesStored(page))[1];
      remote = { v: 1, updatedAt: TODAY + "T12:00:30.000Z", device: "phone", ledgers: {}, state: { gates: { 1: thePass } } };
      await page.evaluate(() => localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness"));
      await page.reload({ waitUntil: "load" });
      const pulled = await page.waitForFunction(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).lastSyncAt,
        null, { timeout: 8000 }).then(() => true, () => false);
      await page.waitForSelector("#view [data-gate]");
      const after = { g: (await gatesStored(page))[1], ctl: await gateControls(page) };
      check("(n) after a pull from a stub remote that still holds the pass, the unmark sticks (Gate 1 open, pass 1 offered)",
        !!thePass && thePass.passed === true && !!theUnmark && theUnmark.passed === false && pulled && gets > 0 &&
          !!after.g && after.g.passed === false && after.g.at === theUnmark.at && after.ctl === "pass 1",
        "pass " + JSON.stringify(thePass) + ", unmark " + JSON.stringify(theUnmark) + ", pulled " + pulled + " (" + gets + " GET), now " + JSON.stringify(after.g) + ", controls " + after.ctl);
      await page.goto(URL + "/sync", { waitUntil: "load" });
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
  }

  await browser.close();
  console.log("");
  check("no network sync (GitHub requests from test contexts)", githubHits === 0, githubHits + " request(s)");
  console.log("\n" + (fails === 0
    ? "PASS — " + checks + " checks: 9 flows (open, answer, mark watched, resume, render-is-a-read, under-a-second, the player's own frame, a lab ticked on Problems, a gate passed and unmarked through its confirm sheet) x " +
      WIDTHS.length + " widths, each in a fresh context; the resume point's sync merge, an unmarked gate that survives a pull of the pass (both devices), a slow phone's late player, and the tab bar's slide, tap and scroll memory once, and the answer slot uniform across all multiple-choice mounts, every question graded by the option rather than the slot"
    : fails + " of " + checks + " flow check(s) FAILED"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
