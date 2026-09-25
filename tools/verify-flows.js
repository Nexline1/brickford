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
// Each flow runs in its own FRESH browser context, at a phone width and a
// desktop width, with a fixed clock (Tuesday 6 Oct 2026, a study day) and a
// seeded state. Every http(s) request is refused — there is no token, so no
// sync, and the YouTube/KaTeX CDNs are not needed for any of this — and any
// request to GitHub fails the run.
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

async function fresh(browser, w, state) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: w < 860,
  });
  await ctx.route(/^https?:/, r => {
    if (/api\.github\.com/.test(r.request().url())) githubHits++;
    return r.abort();
  });
  await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
  if (state) await ctx.addInitScript(s => { if (window.top === window) localStorage.setItem("darhikmah_v1", s); }, JSON.stringify(state));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(URL + "/", { waitUntil: "load" });
  await page.waitForSelector("#view > *");
  return { ctx, page, errors };
}

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
  }

  await browser.close();
  console.log("");
  check("no network sync (GitHub requests from test contexts)", githubHits === 0, githubHits + " request(s)");
  console.log("\n" + (fails === 0
    ? "PASS — " + checks + " checks, 3 flows x " + WIDTHS.length + " widths, each in a fresh context"
    : fails + " of " + checks + " flow check(s) FAILED"));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
