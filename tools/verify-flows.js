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
//       left and when the page goes away; reopening the lecture asks the
//       player to start there; the end of the video clears it;
//   (e) a render is a read: opening the lecture, rendering it 20 times and
//       hearing 50 playing ticks from the player write nothing at all — and a
//       pause after them writes exactly once, so the zero is not blindness;
//   (f) the resume point syncs: a pull takes the later posAt per lecture,
//       whichever side wins the lecture's standing, and a push carries pos.
//
// The frame here cannot reach YouTube, so (d) and (e) speak for the player
// through the read-only test hook (window.__brickfordTest.playerMessage,
// present only when the page is booted on a #/__test hash): a message exactly
// as the embed would post it, handed to the same handler.
//
// Each flow runs in its own FRESH browser context, at a phone width and a
// desktop width, with a fixed clock (Tuesday 6 Oct 2026, a study day) and a
// seeded state. Every http(s) request is refused — there is no token, so no
// sync, and the YouTube/KaTeX CDNs are not needed for any of this — and any
// request to GitHub fails the run. The one exception is (f), which needs a
// sync to happen: it gives its own context a stub token and answers GitHub
// itself, and nothing in it leaves the machine.
//
//   node tools/verify-flows.js                 # gate
//   node tools/verify-flows.js --shots <dir>   # also write a screenshot per flow
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const URL = "file://" + path.join(path.resolve(__dirname, ".."), "platform/index.html") + "#";

const TODAY = "2026-10-06";               // a Tuesday: a study day with lectures scheduled
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
const CUR = (() => {
  const vm = require("vm");
  const sandbox = { window: {} };
  sandbox.window.DAR = sandbox.DAR = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(path.resolve(__dirname, ".."), "platform/data/curriculum.js"), "utf8"), sandbox);
  const c = sandbox.window.DAR.COURSES.find(x => x.id === LECTURE.cid);
  const l = c.units[LECTURE.ui].lessons[LECTURE.li];
  return { v: l.v, min: l.min, label: c.code + " · " + l.t };
})();

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
for (let i = 0; i < 16; i++) WATCHED["math110.0." + i] = { done: true, doneAt: "2026-10-01", notes: "", checks: [] };

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
      for (let i = 0; i < 20; i++) await page.evaluate(() => window.__brickfordTest.render());
      for (let i = 0; i < 50; i++) await tick(page, 100 + i * 0.25, CUR.v);
      const r = await page.evaluate(() => ({ rebuilds: window.__rebuilds, writes: window.__stateWrites,
        frame: !!document.querySelector("#view .video-frame iframe[data-k]") }));
      check("(e) the lecture was rendered 20 more times, each one a rebuilt view with its frame", r.rebuilds === 20 && r.frame,
        r.rebuilds + " rebuild(s), frame " + r.frame);
      check("(e) opening it, 20 renders and 50 playing infoDelivery ticks: zero save() calls", r.writes - w0 === 0,
        (r.writes - w0) + " save(s)");
      await setState(page, PAUSED);
      const after = await writes(page), st = await stored(page, LK);
      const last = Math.floor(100 + 49 * 0.25);
      check("(e) and the pause after them is exactly one save, at the last tick's time (so the ticks were heard)",
        after - r.writes === 1 && !!st && st.pos === last, (after - r.writes) + " save(s), pos " + (st && st.pos) + " (want " + last + ")");
      check("(e) no page errors", errors.length === 0, errors.join(" | "));
      await ctx.close();
    }
  }

  // ---- (f) the resume point syncs: the later posAt wins, per lecture ----
  // Once, at the desktop width: nothing here is about layout. A stub token and
  // a stub GitHub, both inside this context; the pull is the one boot() makes.
  console.log("\nsync (once)");
  {
    const T9 = "2026-10-06T09:00:00.000Z", T10 = "2026-10-06T10:00:00.000Z", T11 = "2026-10-06T11:00:00.000Z";
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
    ? "PASS — " + checks + " checks: 5 flows (open, answer, mark watched, resume, render-is-a-read) x " + WIDTHS.length +
      " widths, each in a fresh context, and the resume point's sync merge once"
    : fails + " of " + checks + " flow check(s) FAILED"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
