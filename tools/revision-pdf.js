// revision-pdf.js — the Sunday revision PDF for one plan week (T-035).
//
//   node tools/revision-pdf.js <week>        → revision/week-0N.pdf
//   node tools/revision-pdf.js <week> --html → also keeps the print HTML beside it
//
// Everything printed comes out of the app itself. The page is loaded with the
// read-only test hook (#/__test, spec T-000) in a fresh context with a fixed
// clock and no stored progress, so scheduledFor() returns the plan as drawn,
// and each lecture's text is DAR.SUMMARIES[cid.unit.lesson] verbatim. A
// lecture with no summary is listed on "Not yet summarised" with its video
// link; nothing is written for it here. Self-checks are the summary's own
// checks, answered at the back with the summary's own answers.
//
// The week's dates are not computed here. Week N is study days 6(N-1)..6N-1
// (STUDY_WEEK = 6), read through dateForStudy, and then CONFIRMED against the
// week number the app itself prints (weekNumber(), via the Today folio) on
// the week's first and last day and on the study day either side. If the app
// disagrees, nothing is written.
//
// Math is rendered by KaTeX 0.16.11, the version the app loads, with the
// app's delimiters. The page is printed offline, so KaTeX and the Inter
// font are read from a local cache (~/.cache/brickford), fetched once with
// `npm pack` if missing. Nothing is added to the repo or to the app.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const APP = "file://" + path.join(ROOT, "platform/index.html");
const STUDY_WEEK = 6;
const CHECKS_PER_LECTURE = 3;
const KATEX_VER = "0.16.11", INTER_VER = "5.2.8";
const CACHE = process.env.BRICKFORD_CACHE || path.join(os.homedir(), ".cache", "brickford");

const week = parseInt(process.argv[2], 10);
if (!(week >= 1)) { console.error("usage: node tools/revision-pdf.js <week> [--html]"); process.exit(2); }
const keepHtml = process.argv.includes("--html");
const OUT_DIR = path.join(ROOT, "revision");
const OUT = path.join(OUT_DIR, "week-" + String(week).padStart(2, "0") + ".pdf");

// ---------- local copies of KaTeX and Inter ----------
function npmPackage(spec, dir) {
  const pkg = path.join(CACHE, dir, "package");
  if (fs.existsSync(path.join(pkg, "package.json"))) return pkg;
  fs.mkdirSync(path.join(CACHE, dir), { recursive: true });
  const tgz = execFileSync("npm", ["pack", spec, "-q", "--pack-destination", CACHE], { encoding: "utf8" }).trim().split("\n").pop();
  execFileSync("tar", ["xzf", path.join(CACHE, tgz), "-C", path.join(CACHE, dir)]);
  return pkg;
}
const KATEX = npmPackage("katex@" + KATEX_VER, "katex-" + KATEX_VER);
const INTER = npmPackage("@fontsource-variable/inter@" + INTER_VER, "inter-" + INTER_VER);
const fileURL = p => "file://" + p;
const fontCSS = ["opsz.css", "opsz-italic.css"]
  .map(f => fs.readFileSync(path.join(INTER, f), "utf8").replace(/url\(\.\/files\//g, "url(" + fileURL(path.join(INTER, "files")) + "/"))
  .join("\n");

// ---------- small helpers ----------
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dd = iso => new Date(iso + "T00:00:00Z");
const dayShort = iso => DOW[dd(iso).getUTCDay()] + " " + dd(iso).getUTCDate() + " " + MON[dd(iso).getUTCMonth()].slice(0, 3);
const addDays = (iso, n) => { const d = dd(iso); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
function rangeLabel(a, b) {
  const A = dd(a), B = dd(b);
  const left = DOW[A.getUTCDay()] + " " + A.getUTCDate() + (A.getUTCMonth() === B.getUTCMonth() ? "" : " " + MON[A.getUTCMonth()]);
  return left + " – " + DOW[B.getUTCDay()] + " " + B.getUTCDate() + " " + MON[B.getUTCMonth()] + " " + B.getUTCFullYear();
}
function hm(min) {
  min = Math.round(min);
  const h = Math.floor(min / 60), m = min % 60;
  return h ? h + " h" + (m ? " " + m + " min" : "") : m + " min";
}
const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");

// ---------- read the plan from the app ----------
async function appContext(browser, isoNoon) {
  const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
  await ctx.route(/^https?:\/\//, r => r.abort());      // offline: no sync, no CDN
  await ctx.clock.setFixedTime(new Date(isoNoon + "T12:00:00Z"));
  return ctx;
}
async function hookPage(ctx) {
  const page = await ctx.newPage();
  await page.goto(APP + "#/__test", { waitUntil: "load" });
  await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 15000 });
  return page;
}
// The week number the app prints for `iso`: its folio reads "Day 013 · Week 3",
// or "Saturday · Week 3" on the rest day (textContent; the CSS uppercases it).
async function appWeekOn(browser, iso) {
  const ctx = await appContext(browser, iso);
  const page = await ctx.newPage();
  await page.goto(APP + "#/", { waitUntil: "load" });
  const w = await page.waitForFunction(() => {
    const m = /(?:Day \d+|day) \u00b7 Week (\d+)\b/.exec(document.body.textContent || "");
    return m && +m[1];
  }, null, { timeout: 15000 }).then(h => h.jsonValue());
  await ctx.close();
  return w;
}

async function readPlan(browser) {
  // Pass 1: the week's dates, from the app's own dateForStudy.
  let ctx = await appContext(browser, "2026-01-01");
  let page = await hookPage(ctx);
  const span = await page.evaluate(({ week, SW }) => {
    const T = window.__brickfordTest;
    const from = T.dateForStudy((week - 1) * SW), to = T.dateForStudy(week * SW - 1);
    return { start: window.DAR.START_DATE, from, to, prev: week > 1 ? T.dateForStudy((week - 1) * SW - 1) : null,
      next: T.dateForStudy(week * SW), restDow: T.REST_DOW };
  }, { week, SW: STUDY_WEEK });
  await ctx.close();

  // Confirm with weekNumber(): first and last day are week N, the study days
  // either side are N-1 and N+1.
  const seen = { from: await appWeekOn(browser, span.from), to: await appWeekOn(browser, span.to),
    next: await appWeekOn(browser, span.next), prev: span.prev ? await appWeekOn(browser, span.prev) : null };
  const ok = seen.from === week && seen.to === week && seen.next === week + 1 && (!span.prev || seen.prev === week - 1);
  if (!ok) throw new Error("week boundaries disagree with the app's weekNumber(): " + JSON.stringify({ span, seen }));

  // Pass 2: the lectures, with the clock on the week's last day (its Sunday).
  ctx = await appContext(browser, span.to);
  page = await hookPage(ctx);
  const plan = await page.evaluate(({ from, to }) => {
    const T = window.__brickfordTest, D = window.DAR;
    const days = [];
    for (let iso = from; iso <= to; ) {
      const items = T.scheduledFor(iso);
      days.push({ iso, idx: T.studyIndex(iso), items: items.map(it => it.pseudo ? { pseudo: true, track: it.track, t: it.t } : {
        key: it.cid + "." + it.ui + "." + it.li, cid: it.cid, ui: it.ui, li: it.li, track: it.track,
        dayN: it.dayN || 1, spanN: it.spanN || 1 }) });
      const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1); iso = d.toISOString().slice(0, 10);
    }
    const keys = new Set(); days.forEach(d => d.items.forEach(i => i.key && keys.add(i.key)));
    const lessons = {}, summaries = {}, figs = {};
    keys.forEach(k => {
      const [cid, ui, li] = k.split(".");
      const c = D.COURSES.find(x => x.id === cid), u = c.units[+ui], l = u.lessons[+li];
      lessons[k] = { code: c.code, course: c.title, unit: u.t || u.title || "", title: l.t, v: l.v || null, url: l.url || null, min: l.min || null };
      const sm = (D.SUMMARIES || {})[k];
      if (sm) {
        summaries[k] = JSON.parse(JSON.stringify(sm));
        sm.beats.forEach(b => { if (b.fig && D.FIG && D.FIG[b.fig] && !figs[b.fig]) figs[b.fig] = D.FIG[b.fig]({}); });
      }
    });
    const concepts = {}; (D.CONCEPTS || []).forEach(c => { concepts[c.id] = c.title; });
    return { days, lessons, summaries, figs, concepts };
  }, span);
  await ctx.close();
  return Object.assign({ span, seen }, plan);
}

// ---------- shape the week ----------
function shapeWeek(P) {
  const order = [], byKey = {};
  P.days.forEach(d => {
    if (d.idx < 0) return;                                  // the rest day
    d.items.forEach(it => {
      if (!it.key) return;                                  // a pseudo block (psets, project) is not a lecture
      let L = byKey[it.key];
      if (!L) { L = byKey[it.key] = Object.assign({ key: it.key, track: it.track, dates: [], firstDayN: it.dayN, spanN: it.spanN }, P.lessons[it.key]); order.push(L); }
      L.dates.push(d.iso); L.lastDayN = it.dayN;
    });
  });
  order.forEach((L, i) => {
    L.n = i + 1;
    L.sum = P.summaries[L.key] || null;
    L.href = L.url || (L.v ? "https://www.youtube.com/watch?v=" + L.v : null);
    // Video minutes this week: a lecture the plan spreads over several days
    // counts the share of it that falls on this week's days.
    L.weekMin = L.min ? L.min * (L.spanN > 1 ? L.dates.length / L.spanN : 1) : 0;
    L.carriedIn = L.firstDayN > 1;                          // began last week
    L.carriesOn = L.lastDayN < L.spanN;                     // finishes next week
  });
  const rest = P.days.filter(d => d.idx < 0).map(d => d.iso);
  const pseudo = [];
  P.days.forEach(d => d.items.forEach(it => { if (it.pseudo && !pseudo.includes(it.t)) pseudo.push(it.t); }));
  return { lectures: order, rest, pseudo };
}

// ---------- the print layout ----------
const CSS = `
${fontCSS}
@page { size: A4; margin: 20mm 19mm 18mm; }
@page { @top-left { content: "Brickford · Sunday revision"; } @top-right { content: var(--rh); }
        @bottom-center { content: counter(page) " of " counter(pages); } }
@page :first { @top-left { content: none; } @top-right { content: none; } @bottom-center { content: none; } }
:root {
  --font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter Variable", "Segoe UI Variable", system-ui, sans-serif;
  /* iOS system colours, light; small text uses the accessible shade (tokens §5) */
  --label: #000; --label-2: #3C3C43; --label-3: #6E6E73; --sep: #C6C6C8; --grouped: #F2F2F7;
  --blue: #007AFF; --link: #0066CC; --blue-tint: #EAF3FF; --orange-tint: #FFF4E5; --orange-ink: #8A4B00;
  /* the app's figure variables, set for white paper */
  --ink: #1d1d1f; --ink-2: #3C3C43; --ink-3: #6E6E73; --line: #C6C6C8; --line-strong: #8E8E93;
  --accent: #007AFF; --accent-2: #3f6ea0; --good: #248A3D; --bad: #D70015; --paper: #fff; --bg: #fff; --card: #fff;
}
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; background: #fff; color: var(--label); font-family: var(--font); font-optical-sizing: auto;
  font-size: 10.5pt; line-height: 1.42; -webkit-font-smoothing: antialiased; }
@page { @top-left { font: 400 7.5pt/1 var(--font); color: #6E6E73; letter-spacing: .02em; }
        @top-right { font: 400 7.5pt/1 var(--font); color: #6E6E73; letter-spacing: .02em; }
        @bottom-center { font: 400 7.5pt/1 var(--font); color: #6E6E73; } }
a { color: var(--link); text-decoration: none; }
p { margin: 0; }
code { font-family: "DejaVu Sans Mono", ui-monospace, monospace; font-size: .88em; background: var(--grouped); padding: .05em .3em; border-radius: 3px; }
.katex { font-size: 1.06em; }
.page { break-before: page; }
.eyebrow { font-size: 8pt; line-height: 1.3; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--label-3); }
.h-large { font-size: 30pt; line-height: 1.1; font-weight: 700; letter-spacing: -.022em; margin: 4pt 0 0; }
.h1 { font-size: 20pt; line-height: 1.18; font-weight: 700; letter-spacing: -.019em; margin: 3pt 0 0; }
.h2 { font-size: 13.5pt; line-height: 1.25; font-weight: 600; letter-spacing: -.012em; margin: 0 0 7pt; }
.sub { font-size: 11.5pt; color: var(--label-2); margin-top: 6pt; }
.muted { color: var(--label-3); }
.small { font-size: 8.5pt; line-height: 1.4; }
.section-h { font-size: 8pt; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--label-3);
  margin: 16pt 0 5pt 11pt; break-after: avoid; }
/* inset grouped list (tokens §6), for paper: a grey group, white-free rows, opaque hairlines that start at the text */
.group { background: var(--grouped); border-radius: 9pt; overflow: hidden; break-inside: avoid; }
.row { display: flex; align-items: baseline; gap: 10pt; padding: 7pt 11pt; position: relative; }
.row + .row::before { content: ""; position: absolute; top: 0; left: 11pt; right: 0; border-top: .5pt solid var(--sep); }
.row .grow { flex: 1; min-width: 0; }
.row .val { color: var(--label-3); white-space: nowrap; font-variant-numeric: tabular-nums; }
.row .num { width: 16pt; color: var(--label-3); font-variant-numeric: tabular-nums; flex: none; }
.row.total { font-weight: 600; }
.row.total .val { color: var(--label); }
.code { font-weight: 600; font-size: 8pt; letter-spacing: .04em; color: var(--label-3); }
.foot { font-size: 8pt; color: var(--label-3); margin: 5pt 11pt 0; line-height: 1.4; }

/* cover */
.cover { height: 257mm; display: flex; flex-direction: column; }
.cover .top { display: flex; justify-content: space-between; }
.cover .title { margin-top: 46mm; }
.cover .stats { display: flex; gap: 22pt; margin: 18pt 0 4pt; }
.cover .stat .n { font-size: 20pt; font-weight: 700; letter-spacing: -.019em; font-variant-numeric: tabular-nums; }
.cover .stat .l { font-size: 8pt; color: var(--label-3); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
.cover .bottom { margin-top: auto; }

/* contents */
.toc .row { padding: 3.3pt 11pt; font-size: 9.5pt; line-height: 1.3; }
.toc .t { font-weight: 500; }
.toc .meta { font-size: 8.5pt; color: var(--label-3); white-space: nowrap; font-variant-numeric: tabular-nums; }
.toc .code { width: 50pt; flex: none; }
.badge { font-size: 7.5pt; font-weight: 600; letter-spacing: .03em; padding: 1.5pt 5pt; border-radius: 4pt; white-space: nowrap; }
.badge.no { background: var(--orange-tint); color: var(--orange-ink); }

/* a lecture: they flow, one after another, separated by space and a rule */
.lec.page { break-before: page; }
.lec + .lec { border-top: .75pt solid var(--sep); margin-top: 24pt; padding-top: 16pt; }
.lec-open { break-inside: avoid; }
.lec-head { margin-bottom: 12pt; }
.lec-meta { font-size: 9pt; color: var(--label-3); margin-top: 5pt; }
.lec-meta a { font-weight: 500; }
.callout { background: var(--blue-tint); border-radius: 9pt; padding: 11pt 13pt; break-inside: avoid; }
.callout .eyebrow { color: #0058B9; margin-bottom: 3pt; }
.callout p { font-size: 12.5pt; line-height: 1.38; letter-spacing: -.01em; font-weight: 500; }
ol.beats { list-style: none; margin: 0; padding: 0; }
ol.beats li { display: grid; grid-template-columns: 19pt 1fr; column-gap: 7pt; padding: 6pt 0; break-inside: avoid; }
ol.beats li + li { border-top: .5pt solid var(--sep); }
.bn { width: 17pt; height: 17pt; border-radius: 50%; background: var(--label); color: #fff; font-size: 8.5pt; font-weight: 600;
  display: flex; align-items: center; justify-content: center; font-variant-numeric: tabular-nums; margin-top: 1pt; }
.bt { font-weight: 600; letter-spacing: -.005em; }
.bd { color: var(--label-2); margin-top: 1.5pt; }
.fig { margin: 7pt 0 2pt; }
.fig svg { max-width: 62%; height: auto; display: block; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt; margin-top: 4pt; }
.panel { background: var(--grouped); border-radius: 9pt; padding: 9pt 11pt; break-inside: avoid; }
.panel .eyebrow { margin-bottom: 3pt; }
.panel.watch { background: var(--orange-tint); }
.panel.watch .eyebrow { color: var(--orange-ink); }
.pills { display: flex; flex-wrap: wrap; gap: 5pt; }
.pill { background: var(--grouped); border-radius: 20pt; padding: 2.5pt 8pt; font-size: 9pt; }
.q { padding: 7pt 11pt; break-inside: avoid; position: relative; }
.q + .q::before { content: ""; position: absolute; top: 0; left: 11pt; right: 0; border-top: .5pt solid var(--sep); }
.q .qt { font-weight: 500; }
.q ol { margin: 4pt 0 0; padding: 0; list-style: none; counter-reset: opt; }
.q ol li { counter-increment: opt; padding-left: 15pt; position: relative; color: var(--label-2); margin-top: 1.5pt; }
.q ol li::before { content: counter(opt, upper-alpha); position: absolute; left: 0; font-weight: 600; color: var(--label-3); font-size: 8.5pt; top: .6pt; }
.q .blank { margin-top: 5pt; color: var(--label-3); font-size: 9pt; }
.qn { font-weight: 600; color: var(--label-3); margin-right: 3pt; font-variant-numeric: tabular-nums; }

/* week's end and answers */
.est { margin: 0 0 5.5pt; break-inside: avoid; font-size: 9.5pt; line-height: 1.38; color: var(--label-2); }
.est .k { font-weight: 600; color: var(--label); }
.est .k .qn { font-weight: 600; }
.course-h { display: flex; align-items: center; font-weight: 600; font-size: 11pt; margin: 14pt 0 6pt; break-after: avoid; }
.course-h:first-of-type { margin-top: 4pt; }
.ans { padding: 6pt 11pt; position: relative; break-inside: avoid; }
.ans + .ans::before { content: ""; position: absolute; top: 0; left: 11pt; right: 0; border-top: .5pt solid var(--sep); }
.ans .a { font-weight: 600; }
.ans .x { color: var(--label-2); margin-top: 1.5pt; font-size: 9.5pt; }
.ans-lec { break-inside: avoid; margin-bottom: 10pt; }
.ans-h { font-weight: 600; font-size: 10pt; margin: 0 0 4pt 11pt; break-after: avoid; }
.ans { padding: 5pt 11pt; font-size: 9.5pt; }
`;

function lectureMeta(L) {
  const days = L.dates.length === 1 ? dayShort(L.dates[0]) : dayShort(L.dates[0]) + " – " + dayShort(L.dates[L.dates.length - 1]);
  const parts = [days];
  if (L.spanN > 1) parts.push("day " + L.firstDayN + (L.lastDayN !== L.firstDayN ? "–" + L.lastDayN : "") + " of " + L.spanN);
  if (L.min) parts.push(L.min + " min video");
  return parts.join(" · ");
}
function tocDays(L) {
  const a = dayShort(L.dates[0]).slice(0, -4), b = dayShort(L.dates[L.dates.length - 1]).slice(0, -4);
  return L.dates.length === 1 ? a : a + " – " + b;
}
function videoLink(L) {
  return L.href ? '<a href="' + esc(L.href) + '">Watch on YouTube</a>' : "";
}
function checksOf(L) { return (L.sum && L.sum.checks || []).slice(0, CHECKS_PER_LECTURE); }

function buildHTML(P, W) {
  const { span } = P;
  const L = W.lectures, done = L.filter(x => x.sum), missing = L.filter(x => !x.sum);
  const rh = "Week " + week + " · " + rangeLabel(span.from, span.to);
  // courses, in the order they first appear
  const courses = [];
  L.forEach(x => { let c = courses.find(c => c.code === x.code); if (!c) courses.push(c = { code: x.code, title: x.course, lec: [], min: 0 }); c.lec.push(x); c.min += x.weekMin; });
  const totalMin = L.reduce((a, x) => a + x.weekMin, 0);
  const split = L.filter(x => x.spanN > 1 && (x.carriedIn || x.carriesOn));

  let h = "";
  // ---- cover ----
  h += '<section class="cover">' +
    '<div class="top"><span class="eyebrow">Brickford · Sunday revision</span><span class="eyebrow">Plan week ' + week + "</span></div>" +
    '<div class="title"><div class="eyebrow">Revision notes</div>' +
    '<h1 class="h-large">Week ' + week + "</h1>" +
    '<div class="sub">' + esc(rangeLabel(span.from, span.to)) + "</div></div>" +
    '<div class="stats">' +
    '<div class="stat"><div class="n">' + L.length + '</div><div class="l">Lectures</div></div>' +
    '<div class="stat"><div class="n">' + esc(hm(totalMin)) + '</div><div class="l">Video</div></div>' +
    '<div class="stat"><div class="n">' + done.length + " / " + L.length + '</div><div class="l">Summarised</div></div>' +
    "</div>" +
    '<div class="bottom"><div class="section-h" style="margin-top:0">Courses this week</div><div class="group">' +
    courses.map(c => '<div class="row"><span class="grow">' + '<span class="code">' + esc(c.code) + "</span>&nbsp;&nbsp;" + esc(c.title) + "</span>" +
      '<span class="val">' + plural(c.lec.length, "lecture") + " · " + esc(hm(c.min)) + "</span></div>").join("") +
    '<div class="row total"><span class="grow">Total</span><span class="val">' + plural(L.length, "lecture") + " · " + esc(hm(totalMin)) + "</span></div>" +
    "</div>" +
    '<p class="foot">Study days ' + dayShort(span.from) + " to " + dayShort(span.to) +
    (W.rest.length ? "; " + W.rest.map(dayShort).join(", ") + " is the rest day" : "") + ". Hours are video time" +
    (split.length ? "; a lecture the plan spreads over several days counts only the days that fall in this week" : "") + ".</p>" +
    "</div></section>";

  // ---- contents ----
  h += '<section class="page toc"><div class="eyebrow">' + esc(rh) + '</div><h2 class="h1">Contents</h2>' +
    '<div class="section-h">Lectures, in plan order</div><div class="group">' +
    L.map(x => '<a class="row" href="#lec-' + x.n + '" style="color:inherit"><span class="num">' + x.n + "</span>" +
      '<span class="code">' + esc(x.code) + '</span><span class="grow"><span class="t">' + esc(x.title) + "</span></span>" +
      (x.sum ? "" : '<span class="badge no">No summary</span>') +
      '<span class="meta">' + esc(tocDays(x)) + "</span></a>").join("") +
    "</div>" +
    '<div class="section-h">At the back</div><div class="group">' +
    (missing.length ? '<a class="row" href="#missing" style="color:inherit"><span class="grow">Not yet summarised</span><span class="val">' + plural(missing.length, "lecture") + "</span></a>" : "") +
    '<a class="row" href="#established" style="color:inherit"><span class="grow">What this week established</span></a>' +
    '<a class="row" href="#answers" style="color:inherit"><span class="grow">Answers to the self-checks</span></a>' +
    "</div>" +
    '<p class="foot">' + (missing.length
      ? done.length + " of " + L.length + " lectures have a summary. The other " + missing.length + " are listed, with their video links, on “Not yet summarised”; nothing is written for them here."
      : "Every lecture this week has a summary.") +
    (W.pseudo.length ? " The plan also holds non-lecture blocks this week: " + W.pseudo.map(esc).join("; ") + "." : "") + "</p></section>";

  // ---- lectures ----
  let qNo = 0;
  L.forEach(x => {
    h += '<section class="' + (x.n === 1 ? "page " : "") + 'lec" id="lec-' + x.n + '"><div class="lec-open">' +
      '<div class="lec-head"><div class="eyebrow">' + esc(x.code) + " · " + esc(x.course) + " · Lecture " + x.n + " of " + L.length + "</div>" +
      '<h2 class="h1">' + esc(x.title) + "</h2>" +
      '<div class="lec-meta">' + esc(lectureMeta(x)) + (x.href ? " · " + videoLink(x) : "") +
      (x.carriedIn ? " · began in week " + (week - 1) : "") + (x.carriesOn ? " · finishes in week " + (week + 1) : "") + "</div>" +
      (x.unit ? '<div class="lec-meta" style="margin-top:1pt">' + esc(x.unit) + "</div>" : "") + "</div>";
    if (!x.sum) {
      h += '<div class="panel"><div class="eyebrow">Not yet summarised</div><p>This lecture has no summary yet, so nothing is printed for it. It is listed with its video link on “Not yet summarised” at the back.</p></div></div></section>';
      return;
    }
    const s = x.sum;
    h += '<div class="callout"><div class="eyebrow">The takeaway</div><p>' + s.takeaway + "</p></div></div>";
    h += '<div class="section-h">The argument · ' + plural(s.beats.length, "step") + '</div><ol class="beats">' +
      s.beats.map((b, i) => '<li><span class="bn">' + (i + 1) + '</span><div><div class="bt">' + b.t + '</div><div class="bd">' + b.d + "</div>" +
        (b.fig && P.figs[b.fig] ? '<div class="fig">' + P.figs[b.fig] + "</div>" : "") + "</div></li>").join("") + "</ol>";
    h += '<div class="pair">' +
      (s.worked ? '<div class="panel"><div class="eyebrow">Worked example</div><p>' + s.worked + "</p></div>" : "") +
      (s.watch ? '<div class="panel watch"><div class="eyebrow">Watch for</div><p>' + s.watch + "</p></div>" : "") + "</div>";
    const cs = (s.concepts || []).filter(id => P.concepts[id]);
    if (cs.length) h += '<div class="section-h">Key concepts</div><div class="pills">' + cs.map(id => '<span class="pill">' + esc(P.concepts[id]) + "</span>").join("") + "</div>";
    const qs = checksOf(x);
    if (qs.length) {
      h += '<div class="section-h">Check yourself · answers at the back</div><div class="group">' +
        qs.map((q, i) => { qNo++; return '<div class="q"><div class="qt"><span class="qn">' + x.n + "." + (i + 1) + "</span>" + q.q + "</div>" +
          (q.opts ? "<ol>" + q.opts.map(o => "<li>" + o + "</li>").join("") + "</ol>" : '<div class="blank">Your answer: ______________</div>') + "</div>"; }).join("") +
        "</div>";
    }
    h += "</section>";
  });

  // ---- not yet summarised ----
  if (missing.length) {
    h += '<section class="page" id="missing"><div class="eyebrow">' + esc(rh) + '</div><h2 class="h1">Not yet summarised</h2>' +
      '<p class="sub">' + plural(missing.length, "lecture") + " this week " + (missing.length === 1 ? "has" : "have") + " no summary yet. Watch or rewatch them from the links below.</p>" +
      '<div class="section-h">Lectures</div><div class="group">' +
      missing.map(x => '<div class="row"><span class="num">' + x.n + '</span><span class="grow"><span class="t">' + esc(x.title) + '</span><br><span class="small muted">' +
        esc(x.code) + " · " + esc(lectureMeta(x)) + "</span><br>" +
        (x.href ? '<a class="small" href="' + esc(x.href) + '">' + esc(x.href) + "</a>" : '<span class="small muted">No video link in the plan</span>') + "</span></div>").join("") +
      "</div></section>";
  }

  // ---- what this week established ----
  h += '<section class="page" id="established"><div class="eyebrow">' + esc(rh) + '</div><h2 class="h1">What this week established</h2>' +
    '<p class="sub">Each lecture’s takeaway, by course.</p>';
  courses.forEach(c => {
    h += '<div class="course-h">' + esc(c.code) + "&nbsp;·&nbsp;" + esc(c.title) + "</div>";
    c.lec.forEach(x => {
      h += '<p class="est"><span class="k"><span class="qn">' + x.n + "</span>" + esc(x.title) + (/[.?!]$/.test(x.title) ? "" : ".") + "</span> " +
        (x.sum ? x.sum.takeaway : '<span class="muted">Not yet summarised.</span>') + "</p>";
    });
  });
  h += "</section>";

  // ---- answers ----
  h += '<section class="page" id="answers"><div class="eyebrow">' + esc(rh) + '</div><h2 class="h1">Answers</h2>' +
    '<p class="sub">The answers and explanations are the summaries’ own.</p>';
  L.filter(x => checksOf(x).length).forEach(x => {
    h += '<div class="ans-lec"><div class="ans-h"><span class="qn">' + x.n + "</span>" + esc(x.title) + '</div><div class="group">' +
      checksOf(x).map((q, i) => {
        const a = q.opts ? String.fromCharCode(65 + q.a) + " — " + q.opts[q.a] : String(q.num).replace(/^-/, "\u2212") + (q.tol ? " (± " + q.tol + ")" : "");
        return '<div class="ans"><span class="qn">' + x.n + "." + (i + 1) + '</span><span class="a">' + a + "</span>" +
          (q.expl ? '<div class="x">' + q.expl + "</div>" : "") + "</div>";
      }).join("") + "</div></div>";
  });
  h += "</section>";

  // An escaped dollar (\$40) means money. KaTeX's auto-render does not treat
  // \$ as escaped, so it pairs it with the next $ and garbles the rest of the
  // line (the app has the same defect). Here it is set apart in its own
  // element, which auto-render reads as a separate text node, so it prints
  // as a plain "$" and the real $...$ pairs stay paired.
  h = h.replace(/\\\$/g, '<span class="usd">$</span>');
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Brickford · Week ' + week + " revision</title>" +
    '<link rel="stylesheet" href="' + fileURL(path.join(KATEX, "dist/katex.min.css")) + '">' +
    "<style>" + CSS + ":root{--rh:" + JSON.stringify(rh) + "}</style></head><body>" + h +
    '<script src="' + fileURL(path.join(KATEX, "dist/katex.min.js")) + '"></script>' +
    '<script src="' + fileURL(path.join(KATEX, "dist/contrib/auto-render.min.js")) + '"></script>' +
    "<script>renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});" +
    "document.body.dataset.math='done';</script></body></html>";
}

(async () => {
  const browser = await chromium.launch();
  try {
    const P = await readPlan(browser);
    const W = shapeWeek(P);
    if (!W.lectures.length) throw new Error("week " + week + " schedules no lectures");
    const html = buildHTML(P, W);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "brickford-revision-"));
    const htmlPath = path.join(tmp, "week-" + String(week).padStart(2, "0") + ".html");
    fs.writeFileSync(htmlPath, html);

    const ctx = await browser.newContext();
    await ctx.route(/^https?:\/\//, r => r.abort());
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", e => errs.push(e.message));
    page.on("console", m => { if (/^RAW\$/.test(m.text())) console.log("  " + m.text()); });
    await page.goto(fileURL(htmlPath), { waitUntil: "load" });
    await page.waitForFunction(() => document.body.dataset.math === "done", null, { timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    // Self-checks on the print HTML before anything is written.
    const audit = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let raw = 0, n;
      while ((n = walker.nextNode())) if (!n.parentElement.closest(".katex, .usd, script, style") && /\$/.test(n.nodeValue)) { raw++; console.log("RAW$ " + n.nodeValue.slice(0, 200)); }
      return { katexErrors: document.querySelectorAll(".katex-error").length, rawDollar: raw, text: document.body.innerText };
    });
    const problems = [];
    if (errs.length) problems.push("page errors: " + errs.join(" | "));
    if (audit.katexErrors) problems.push(audit.katexErrors + " KaTeX error(s)");
    if (audit.rawDollar) problems.push(audit.rawDollar + " text node(s) still holding a raw $");
    W.lectures.forEach(x => { if (!audit.text.includes(x.title)) problems.push("title missing from the page: " + x.title); });
    if (problems.length) throw new Error("print HTML failed its checks:\n  " + problems.join("\n  "));

    fs.mkdirSync(OUT_DIR, { recursive: true });
    await page.pdf({ path: OUT, format: "A4", printBackground: true, preferCSSPageSize: true, outline: true, tagged: true });
    await ctx.close();
    if (keepHtml) fs.copyFileSync(htmlPath, OUT.replace(/\.pdf$/, ".html"));
    fs.rmSync(tmp, { recursive: true, force: true });

    const summarised = W.lectures.filter(x => x.sum).length;
    console.log("week " + week + " · " + rangeLabel(P.span.from, P.span.to) + " (app weekNumber: " + JSON.stringify(P.seen) + ")");
    W.lectures.forEach(x => console.log("  " + String(x.n).padStart(2) + "  " + x.key.padEnd(13) + (x.sum ? "summary  " : "MISSING  ") + x.title));
    console.log("  " + W.lectures.length + " lectures, " + summarised + " summarised, " + (W.lectures.length - summarised) + " missing → " + path.relative(ROOT, OUT));
  } catch (e) {
    console.error(e.message || e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
