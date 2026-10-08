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
// And, since T-023 (loop/specs/T-023-floating-tab-bar/spec.md), the tab bar:
//
//   (j) slide (once, 390px, motion on): a finger 60% of the way from Today to
//       Courses has the bubble under it within 2px; release opens /courses and
//       the bubble settles on it; past Review the bubble resists; a 40px
//       vertical drag switches nothing; tapping the active tab at scrollY 800
//       goes to 0 (and instantly under reduced motion); Today left at 600 is
//       at 600 again after Courses; and all of it makes zero save() calls. A
//       Ctrl-click on a tab (800x700, mouse) opens exactly one new page and
//       leaves this one where it was.
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

  await browser.close();
  console.log("");
  check("no network sync (GitHub requests from test contexts)", githubHits === 0, githubHits + " request(s)");
  console.log("\n" + (fails === 0
    ? "PASS — " + checks + " checks: 7 flows (open, answer, mark watched, resume, render-is-a-read, under-a-second, the player's own frame) x " +
      WIDTHS.length + " widths, each in a fresh context; the resume point's sync merge, a slow phone's late player, and the tab bar's slide, tap and scroll memory once"
    : fails + " of " + checks + " flow check(s) FAILED"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
