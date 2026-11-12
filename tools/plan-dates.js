// plan-dates.js — T-067 step 1. READ-ONLY with respect to the app: it changes
// nothing under platform/. It
//   1. reads the curriculum and the audit's judgements (loop/specs/T-067-plan-v2/plan-data.js),
//   2. writes prerequisites.json (every lecture: needs + level, provisional keys declared),
//   3. runs the REAL app in Chromium through the existing test hook
//      (window.__brickfordTest, exactly as tools/verify-logic.js does) to read the
//      OLD schedule — scheduledFor() on every study day 0..1093, fresh state — and
//      the study calendar (studyIndex, dateForStudy, addStudyDays),
//   4. simulates the NEW (v2) sequence from the prerequisite map with the new
//      budgets, using the app's own EFFORT and packing rules,
//   5. rewrites the generated sections (between <!-- BEGIN GENERATED --> and
//      <!-- END GENERATED -->) of audit.md, prerequisites.md, sequence.md, dates.md.
//
//   node tools/plan-dates.js
//
// Deterministic: fixed clock, fresh browser state, no network.
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SPEC = path.join(ROOT, "loop/specs/T-067-plan-v2");
const P = require(path.join(SPEC, "plan-data.js"));

const CUTOVER = "2026-11-22";                  // provisional: the Sunday after step 2 ships
const V2 = { MATH: 90, AI: 60 };               // effort-minute budgets per day (Storytelling unchanged at 40)
const EFFORT = m => m * 1.8 + 4;               // app.js, unchanged
const PAPER_PRACTICE_DAYS = 21;                // one paper per three weeks, as in v1, but in the practice block
const GATE2_PROJECT_DAYS = 48, GATE4_CONSOLIDATION_DAYS = 24, GATE5_DAYS = 547;

// ---------------- data ----------------
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
const DATA = path.join(ROOT, "platform/data");
["curriculum.js", "storytelling.js"].concat(fs.readdirSync(DATA).filter(f => /^summaries-.*\.js$/.test(f)).sort())
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(DATA, f), "utf8"), ctx, { filename: f }));
const D = ctx.DAR;

const L = [];                                   // every lecture, real and provisional
const byKey = {};
function add(x) { L.push(x); byKey[x.key] = x; }
for (const c of D.COURSES) (c.units || []).forEach((u, ui) => u.lessons.forEach((l, li) =>
  add({ key: `${c.id}.${ui}.${li}`, cid: c.id, code: c.code, ui, li, t: l.t, v: l.v || "", min: l.min || 0, real: true })));
const provNote = {};
for (const pc of P.PROVISIONAL) {
  const course = D.COURSES.find(c => c.id === pc.course);
  const code = pc.code || (course && course.code);
  pc.units.forEach((u, k) => {
    const ui = pc.unitIndex != null ? pc.unitIndex + k : k;
    let lessons = u.lessons;
    if (u.alias) lessons = u.alias.map(a => ({ t: byKey[a].t + " (second pass, typing along)", v: byKey[a].v, min: byKey[a].min, check: "same video as " + a + " (in the data)", alias: a }));
    if (u.titles) lessons = u.titles.map((t, i) => ({ t: `Lecture ${i + 1} — ${t}`, v: null, min: u.min, check: u.check }));
    if (u.count) lessons = Array.from({ length: u.count }, (_, i) => ({ t: `${u.name} — lecture ${i + 1}`, v: null, min: u.min, check: u.check }));
    lessons.forEach((l, li) => {
      const key = `${pc.course}.${ui}.${li}`;
      add({ key, cid: pc.course, code, ui, li, t: l.t, v: l.v || "", min: l.min, real: false, addition: !!pc.addition, alias: l.alias, check: l.check });
      provNote[key] = (pc.addition ? "proposed course (needs owner approval)" : "proposed lecture") + (l.check ? "; " + l.check : "");
    });
  });
}

// ---------------- marks, levels, needs ----------------
const mark = k => (P.MARKS[k] || ["core", P.COURSE_REASON[byKey[k].cid] || (byKey[k].addition ? "proposed addition, see audit.md" : "proposed lecture, see python-bridge.md")]);
const status = k => mark(k)[0];
const scheduledKind = k => status(k) === "core";
function level(k) {
  const x = byKey[k];
  if (P.LEVEL[k]) return P.LEVEL[k];
  return P.LEVEL_DEFAULT[x.cid + "." + x.ui] || P.LEVEL_DEFAULT[x.cid] || 2;
}
const unitLessons = {};
L.forEach(x => (unitLessons[x.cid + "." + x.ui] = unitLessons[x.cid + "." + x.ui] || []).push(x));
function defaultChain(x) {
  const ul = unitLessons[x.cid + "." + x.ui];
  for (let i = x.li - 1; i >= 0; i--) if (scheduledKind(ul[i].key)) return [ul[i].key];
  // first core lesson of its unit: needs the last core lesson of the previous unit of the same course
  for (let u = x.ui - 1; u >= 0; u--) {
    const pl = unitLessons[x.cid + "." + u] || [];
    for (let i = pl.length - 1; i >= 0; i--) if (scheduledKind(pl[i].key)) return [pl[i].key];
  }
  return [];
}
const needs = {};
L.forEach(x => {
  const base = P.REPLACE[x.key] ? P.REPLACE[x.key].slice() : defaultChain(x);
  needs[x.key] = Array.from(new Set(base.concat(P.NEEDS[x.key] || [])));
});
// sanity: every needed key exists; a core lesson never needs a non-core one
const problems = [];
L.forEach(x => needs[x.key].forEach(n => {
  if (!byKey[n]) problems.push(`${x.key} needs unknown ${n}`);
  else if (scheduledKind(x.key) && !scheduledKind(n)) problems.push(`${x.key} (core) needs ${n} (${status(n)})`);
}));
const prereqJSON = { _provisional: provNote, _note: "Generated by tools/plan-dates.js from plan-data.js. needs = prerequisites; level 1 intro, 2 core, 3 advanced; status is the audit mark." };
L.forEach(x => { prereqJSON[x.key] = { needs: needs[x.key], level: level(x.key), status: status(x.key) }; });
fs.writeFileSync(path.join(SPEC, "prerequisites.json"), JSON.stringify(prereqJSON, null, 1) + "\n");

// ---------------- the real app: old schedule + calendar ----------------
async function readApp() {
  const { chromium } = require("/opt/node22/lib/node_modules/playwright");
  const browser = await chromium.launch();
  const ctxb = await browser.newContext({ timezoneId: "UTC" });
  await ctxb.route("https://api.github.com/**", r => r.abort());
  await ctxb.clock.setFixedTime(new Date("2026-11-12T12:00:00Z"));
  const page = await ctxb.newPage();
  await page.goto("file://" + path.join(ROOT, "platform/index.html") + "#/__test", { waitUntil: "load" });
  await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 15000 });
  const out = await page.evaluate(({ cut }) => {
    const T = window.__brickfordTest;
    const days = [];
    for (let d = 0; d < 1094; d++) {
      const iso = T.dateForStudy(d);
      days.push({ d, iso, items: T.scheduledFor(iso).filter(i => !i.pseudo && i.cid).map(i => ({ key: i.cid + "." + i.ui + "." + i.li, track: i.track })) });
    }
    const dates = [];
    for (let d = 0; d < 1300; d++) dates.push(T.dateForStudy(d));
    return { days, dates, cutIdx: T.studyIndex(cut) };
  }, { cut: CUTOVER });
  await browser.close();
  return out;
}

// ---------------- v2 simulation ----------------
function simulate(app, withAdditions) {
  const cut = app.cutIdx;
  const done = new Set(), doneDay = {};       // key → study day its last part is scheduled
  app.days.filter(x => x.d < cut).forEach(x => x.items.forEach(i => {
    if (i.track === "Build" && !/^ai200\.(0\.\d+|1\.[0-4])$/.test(i.key)) return;   // re-scheduled in v2
    done.add(i.key); doneDay[i.key] = -1;
  }));
  // Karpathy first pass and 3B1B primer were watched (owner, 10 Nov)
  ["ai200.0.0", "ai200.0.1", "ai200.0.2", "ai200.0.3", "ai200.1.0", "ai200.1.1", "ai200.1.2", "ai200.1.3", "ai200.1.4"].forEach(k => { done.add(k); doneDay[k] = -1; });
  const include = x => scheduledKind(x.key) && !done.has(x.key) && (withAdditions || !x.addition) && x.cid !== "spch100";
  // The multivariable bridge (math120 unit III) is its own queue, so it can run beside
  // the rest of 18.01 instead of waiting behind series and techniques.
  const qid = x => x.cid === "math120" && x.ui === 2 ? "math120b" : x.cid;
  const queue = id => L.filter(x => qid(x) === id && include(x));
  // Core courses rotate; 18.02 (an addition) joins that rotation and so alternates with MATH 210.
  // The other math-line additions run only on a day no core course has a ready lecture, in the
  // tutor's priority order (18.650, statistical mechanics), with 18.03 and 8.02 alternating.
  const mathCourses = ["math110", "math120", "math130", "phys100", "math210"].concat(withAdditions ? ["math140"] : []);
  const mathAdds = withAdditions ? ["math160", "phys300", "math150", "phys200"] : [];
  let altMath = "phys200", altAI = "cs150";
  const Q = {}; mathCourses.concat(mathAdds, ["cs100", "ai200", "ai210", "ai300", "sys250", "ai310", "res400", "cs150", "cs110"]).forEach(c => (Q[c] = queue(c)));
  const ready = (x, day) => needs[x.key].every(n => (!withAdditions && byKey[n].addition) || doneDay[n] != null && doneDay[n] < day || (doneDay[n] === day && sameDayOK(n, day)));
  let sameDay = new Set();
  const sameDayOK = n => sameDay.has(n);
  const schedule = [];                        // per day: { d, iso, math:[...], ai:[...] }
  const lastLevel = { MATH: null, AI: null }, jumps = [];
  const span = { MATH: null, AI: null, FRI: null };      // { x, k, n }
  let rot = 0;
  const dowOf = iso => new Date(iso + "T00:00:00Z").getUTCDay();
  const aiMain = () => [...Q.cs100.filter(x => x.ui <= 1), ...Q.ai200.filter(x => x.ui === 3), ...Q.ai200.filter(x => x.ui === 1), ...Q.ai300, ...(altAI === "cs150" ? [...Q.ai210, ...Q.cs150] : [...Q.cs150, ...Q.ai210]), ...Q.sys250, ...Q.ai310, ...Q.res400];
  const aiFriday = () => [...Q.cs100.filter(x => x.ui === 2), ...Q.ai200.filter(x => x.ui === 2), ...Q.cs110];
  const remove = x => { const q = Q[qid(x)]; q.splice(q.indexOf(x), 1); };
  function take(track, budget, first, day, sameCourseNext) {
    // pack like app.js packWindows: a lesson over 1.15×budget spans days; otherwise fill to 1.05×budget
    const e = EFFORT(first.min || 50);
    remove(first);
    if (e > budget * 1.15) {
      const n = Math.ceil(e / budget);
      span[track] = { x: first, k: 1, n };
      if (n === 1) { span[track] = null; doneDay[first.key] = day; sameDay.add(first.key); }
      return [{ x: first, k: 1, n }];
    }
    const got = [{ x: first }]; let eff = e; doneDay[first.key] = day; sameDay.add(first.key);
    for (;;) {
      const nx = sameCourseNext();
      if (!nx || !ready(nx, day)) break;
      const ej = EFFORT(nx.min || 50);
      if (ej > budget * 1.15 || eff + ej > budget * 1.05) break;
      remove(nx); eff += ej; got.push({ x: nx }); doneDay[nx.key] = day; sameDay.add(nx.key);
    }
    return got;
  }
  function continueSpan(track, day) {
    const s = span[track]; s.k++;
    const it = { x: s.x, k: s.k, n: s.n };
    if (s.k >= s.n) { doneDay[s.x.key] = day; span[track] = null; }
    return [it];
  }
  for (let day = cut; day < 1094; day++) {
    const iso = app.dates[day];
    sameDay = new Set();
    const row = { d: day, iso, math: [], ai: [] };
    // MATH & PHYSICS track: rotate over the courses whose next lecture is ready
    if (span.MATH) row.math = continueSpan("MATH", day);
    else {
      for (let t = 0; t < mathCourses.length; t++) {
        const c = mathCourses[(rot + t) % mathCourses.length];
        const nx = Q[c][0];
        if (nx && ready(nx, day)) { row.math = take("MATH", V2.MATH, nx, day, () => Q[c][0]); rot = (rot + t + 1) % mathCourses.length; break; }
      }
      if (!row.math.length) {
        const order = mathAdds.filter(c => c !== "math150" && c !== "phys200");
        const pair = altMath === "phys200" ? ["math150", "phys200"] : ["phys200", "math150"];
        for (const c of order.concat(mathAdds.length ? pair : [])) {
          const nx = Q[c][0];
          if (nx && ready(nx, day)) { row.math = take("MATH", V2.MATH, nx, day, () => Q[c][0]); if (c === "math150" || c === "phys200") altMath = c; break; }
        }
      }
    }
    // AI / PYTHON / BUILD track. Fridays carry the no-code talks (their own lane: a long talk
    // continues on the NEXT Friday, so it never blocks the coding line). Once the Math &
    // Physics line is finished, its 90 minutes go to this line (theory stays ~3 h a day).
    const mathDone = !mathCourses.concat(mathAdds).some(c => Q[c].length) && !span.MATH;
    const aiBudget = mathDone ? V2.MATH + V2.AI : V2.AI;
    const pick = (lane, list) => { for (const x of list) if (ready(x, day)) { if (x.cid === "ai210" || x.cid === "cs150") altAI = x.cid; return take(lane, aiBudget, x, day, () => { const q = Q[qid(x)]; const nx = q[0]; return nx && nx.ui === x.ui ? nx : null; }); } return null; };
    const main = () => span.AI ? continueSpan("AI", day) : pick("AI", aiMain());
    if (dowOf(iso) === 5) row.ai = (span.FRI ? continueSpan("FRI", day) : pick("FRI", aiFriday())) || main() || [];
    else row.ai = main() || (span.FRI ? null : pick("FRI", aiFriday())) || [];
    if (mathDone) row.theoryToAI = true;
    for (const tr of ["MATH", "AI"]) {
      const items = row[tr === "MATH" ? "math" : "ai"];
      if (items.length && !(items[0].k > 1)) {
        const lv = level(items[0].x.key);
        if (lastLevel[tr] != null && Math.abs(lv - lastLevel[tr]) > 1) jumps.push(`${iso} ${tr}: level ${lastLevel[tr]} → ${lv} at ${items[0].x.key}`);
        lastLevel[tr] = level(items[items.length - 1].x.key);
      }
    }
    schedule.push(row);
    if (!mathCourses.some(c => Q[c].length) && !Object.keys(Q).some(c => Q[c].length) && !span.MATH && !span.AI && !span.FRI) break;
  }
  const left = Object.keys(Q).reduce((a, c) => a.concat(Q[c].map(x => x.key)), []);
  // papers: reimplementation in the practice block, 21 study days each, after the Karpathy pass
  const papers = L.filter(x => x.cid === "ai300" && doneDay[x.key] != null).sort((a, b) => doneDay[a.key] - doneDay[b.key]);
  let free = doneDay["ai200.1.8"] + 1; const paperEnd = {};
  papers.forEach(p => { const s = Math.max(free, doneDay[p.key] + 1); paperEnd[p.key] = s + PAPER_PRACTICE_DAYS - 1; free = s + PAPER_PRACTICE_DAYS; });
  return { schedule, doneDay, jumps, left, papers, paperEnd };
}

// ---------------- write ----------------
function replaceGenerated(file, text) {
  const fp = path.join(SPEC, file);
  if (!fs.existsSync(fp)) return false;
  const src = fs.readFileSync(fp, "utf8");
  const a = src.indexOf("<!-- BEGIN GENERATED -->"), b = src.indexOf("<!-- END GENERATED -->");
  if (a < 0 || b < 0) return false;
  fs.writeFileSync(fp, src.slice(0, a) + "<!-- BEGIN GENERATED -->\n" + text.trim() + "\n" + src.slice(b));
  return true;
}
const esc = s => String(s).replace(/\|/g, "/");

(async () => {
  const app = await readApp();
  const date = d => app.dates[d];
  const cut = app.cutIdx;

  // ---- old ----
  const oldLast = {}, oldFirst = {};
  app.days.forEach(x => x.items.forEach(i => { oldLast[i.key] = x.d; if (oldFirst[i.key] == null) oldFirst[i.key] = x.d; }));
  const courseIds = D.COURSES.map(c => c.id);
  const oldCourseLast = cid => Math.max(-1, ...Object.keys(oldLast).filter(k => k.startsWith(cid + ".")).map(k => oldLast[k]));
  const oldCourseFirst = cid => { const v = Object.keys(oldFirst).filter(k => k.startsWith(cid + ".")).map(k => oldFirst[k]); return v.length ? Math.min(...v) : -1; };
  const oldAllLast = Math.max(...Object.values(oldLast));
  const oldAllLastNoSpch = Math.max(...Object.keys(oldLast).filter(k => !k.startsWith("spch")).map(k => oldLast[k]));
  const notScheduledOld = L.filter(x => x.real && oldLast[x.key] == null).map(x => x.key);

  // ---- gates ----
  const months = D.GATES.map(g => Math.round(g.months * 30.4));
  const gateA = []; { let b = 0; months.forEach(m => { b += m; gateA.push(b); }); }
  // dateForStudy(i) for i = cumulative is addStudyDays(START, cumulative), START being study day 0

  const runs = { core: simulate(app, false), plus: simulate(app, true) };
  const lastOf = (r, cids) => Math.max(-1, ...Object.keys(r.doneDay).filter(k => cids.some(c => k.startsWith(c + ".")) && r.doneDay[k] >= 0).map(k => r.doneDay[k]));
  const firstOf = (r, cids) => { const v = []; r.schedule.forEach(row => [...row.math, ...row.ai].forEach(i => { if (cids.includes(i.x.cid)) v.push(row.d); })); return v.length ? Math.min(...v) : -1; };
  function gatesB(r) {
    const g1 = gateA[0];
    const g2 = Math.max(g1, r.doneDay["ai200.1.8"] + GATE2_PROJECT_DAYS);
    const p6 = r.papers[5] ? r.paperEnd[r.papers[5].key] : NaN;
    const g3 = Math.max(g2, p6);
    const p16 = r.papers.length ? r.paperEnd[r.papers[r.papers.length - 1].key] : NaN;
    const g4 = Math.max(g3, lastOf(r, ["sys250", "ai310", "res400", "math210"]) + GATE4_CONSOLIDATION_DAYS, p16 + 1);
    const g5 = g4 + GATE5_DAYS;
    return [g1, g2, g3, g4, g5];
  }

  // ---- console summary ----
  console.log("cutover", CUTOVER, "= study day", cut + 1, "(index " + cut + ")");
  console.log("prerequisite problems:", problems.length ? problems.join("; ") : "none");
  for (const [name, r] of Object.entries(runs)) console.log(name, "level jumps:", r.jumps.length, r.jumps.slice(0, 5).join("; "), "| left unscheduled:", r.left.length, r.left.slice(0, 8).join(" "));

  // ---- audit table ----
  const counts = {};
  L.forEach(x => { const c = counts[x.cid] = counts[x.cid] || { code: x.code, core: 0, optional: 0, duplicate: 0, skipped: 0, min: 0, coreMin: 0, prov: !x.real, add: x.addition }; const s = status(x.key); c[s.startsWith("duplicate") ? "duplicate" : s]++; c.min += x.min; if (s === "core") c.coreMin += P.VIDEO_REUSED[x.key] ? 0 : x.min; });
  let audit = "### Counts per course\n\n| Course | Lectures | Core | Optional | Duplicate | Skipped | Core video hours |\n|---|---:|---:|---:|---:|---:|---:|\n";
  Object.entries(counts).forEach(([cid, c]) => { audit += `| ${c.code} (${cid})${c.add ? " — proposed" : c.prov ? " — proposed" : ""} | ${c.core + c.optional + c.duplicate + c.skipped} | ${c.core} | ${c.optional} | ${c.duplicate} | ${c.skipped} | ${(c.coreMin / 60).toFixed(1)} |\n`; });
  audit += "\n### Every lecture\n\nLevel: 1 intro, 2 core, 3 advanced. Provisional keys (not yet in the data) are marked †.\n";
  let lastU = "";
  L.forEach(x => {
    const u = x.cid + "." + x.ui;
    if (u !== lastU) { const cu = D.COURSES.find(c => c.id === x.cid); const un = cu && cu.units[x.ui] ? cu.units[x.ui].name : (P.PROVISIONAL.find(p => p.course === x.cid) || {}).title || ""; audit += `\n#### ${x.code} — ${esc(un)}\n\n| Key | Min | Lvl | Title | Mark | Reason |\n|---|---:|---:|---|---|---|\n`; lastU = u; }
    const [s, why] = mark(x.key);
    audit += `| ${x.key}${x.real ? "" : " †"} | ${x.min} | ${level(x.key)} | ${esc(x.t)} | ${s} | ${esc(why)} |\n`;
  });
  replaceGenerated("audit.md", audit);

  // ---- prerequisites (cross-course edges) ----
  let pre = `${L.length} lectures (${L.filter(x => x.real).length} real, ${L.filter(x => !x.real).length} provisional), ${L.reduce((a, x) => a + needs[x.key].length, 0)} edges. Checks: ${problems.length ? problems.join("; ") : "every needed key exists; no core lecture needs an optional or duplicate one"}. Cycle check: \`node tools/audit-lectures.js --check-prereqs\`.\n\n### Every cross-course edge\n\n| Lecture | Needs (other course) |\n|---|---|\n`;
  L.forEach(x => { const cross = needs[x.key].filter(n => byKey[n].cid !== x.cid); if (cross.length) pre += `| ${x.key} ${esc(x.t)} | ${cross.map(n => n + " " + esc(byKey[n].t)).join("; ")} |\n`; });
  pre += "\n### Non-default edges inside a course\n\n| Lecture | Needs |\n|---|---|\n";
  L.forEach(x => { const def = P.REPLACE[x.key] ? null : defaultChain(x); const inside = needs[x.key].filter(n => byKey[n].cid === x.cid && !(def || []).includes(n)); if (inside.length || P.REPLACE[x.key]) pre += `| ${x.key} ${esc(x.t)} | ${inside.length ? inside.join(", ") : "(none: chain removed)"} |\n`; });
  replaceGenerated("prerequisites.md", pre);

  // ---- sequence ----
  const r = runs.core;
  const fmtItems = items => items.map(i => `${i.x.key}${i.x.real ? "" : "†"} ${esc(i.x.t).slice(0, 60)}${i.n > 1 ? ` (part ${i.k}/${i.n})` : ""}`).join(" + ") || "—";
  const wd = iso => new Date(iso + "T00:00:00Z").toUTCString().slice(0, 3);
  const speechOn = iso => { const day = app.days.find(x => x.iso === iso); return day ? day.items.filter(i => i.track === "Publish").map(i => i.key).join(", ") : ""; };
  let seq = `Generated from prerequisites.json by tools/plan-dates.js. Cutover ${CUTOVER} = study day ${cut + 1}. Budgets: Math & Physics ${V2.MATH}, AI/Python/Build ${V2.AI}, Storytelling 40 (unchanged) effort-minutes, EFFORT = min × 1.8 + 4. Level jumps > 1 inside a track: ${r.jumps.length ? r.jumps.join("; ") : "none"}.\n\n### The first 8 weeks, day by day\n\n| Study day | Date | Math & Physics (~1 h 30) | AI / Python (~1 h) | Storytelling (~40 min, unchanged) |\n|---:|---|---|---|---|\n`;
  r.schedule.slice(0, 48).forEach(row => { seq += `| ${row.d + 1} | ${wd(row.iso)} ${row.iso} | ${fmtItems(row.math)} | ${fmtItems(row.ai)} | ${speechOn(row.iso) || (wd(row.iso) === "Fri" ? "weekly recorded rep" : "—")} |\n`; });
  seq += "\n### After that, week by week (six study days each)\n\n| Week | From | Math & Physics | AI / Python / Build |\n|---:|---|---|---|\n";
  for (let w = 8; w * 6 < r.schedule.length; w++) {
    const rows = r.schedule.slice(w * 6, w * 6 + 6);
    if (!rows.length) break;
    const sum = tr => { const ks = []; rows.forEach(rw => rw[tr].forEach(i => { if (!ks.includes(i.x.key)) ks.push(i.x.key); })); if (!ks.length) return "—"; const first = byKey[ks[0]], last = byKey[ks[ks.length - 1]]; return ks.length === 1 ? `${ks[0]} ${esc(first.t).slice(0, 50)}` : `${ks.length} lectures: ${ks[0]} ${esc(first.t).slice(0, 34)} … ${ks[ks.length - 1]} ${esc(last.t).slice(0, 34)}`; };
    const m = sum("math"), a = sum("ai");
    if (m === "—" && a === "—") break;
    seq += `| ${w + 1} | ${rows[0].iso} | ${m} | ${a} |\n`;
  }
  replaceGenerated("sequence.md", seq);

  // ---- dates ----
  const label = d => d < 0 ? "before cutover" : `${date(d)} (day ${d + 1})`;
  let dt = `Computed by tools/plan-dates.js: the OLD dates are read from the real app (scheduledFor on every study day, fresh state, through window.__brickfordTest); the NEW dates are the v2 simulation. Calendar: START ${D.START_DATE}, Saturday rest, day 1094 = ${date(1093)}. Cutover ${CUTOVER} = study day ${cut + 1}.\n\n`;
  dt += "### When each course's last lecture lands\n\n| Course | Old first | Old last | New (core only, for reference) | New (everything included — the plan) |\n|---|---|---|---|---|\n";
  courseIds.filter(c => c !== "cs150").concat(["cs100", "cs110", "cs150", "math140", "math160", "math150", "phys300", "phys200"]).forEach(cid => {
    const code = (byKey[L.find(x => x.cid === cid)?.key] || {}).code || cid;
    if (!L.some(x => x.cid === cid)) return;
    const ol = oldCourseLast(cid), of = oldCourseFirst(cid);
    const nc = cid === "spch100" ? ol : lastOf(runs.core, [cid]), np = cid === "spch100" ? ol : lastOf(runs.plus, [cid]);
    dt += `| ${code} | ${of < 0 ? "not scheduled" : label(of)} | ${ol < 0 ? "not scheduled" : label(ol)} | ${cid === "spch100" ? "unchanged: " + label(ol) : nc < 0 ? (L.some(x => x.cid === cid && x.addition) ? "—" : "done before cutover / not scheduled") : label(nc)} | ${cid === "spch100" ? "unchanged" : np < 0 ? "—" : label(np)} |\n`;
  });
  const lastAll = rr => Math.max(...Object.values(rr.doneDay));
  dt += `\nOld: the last lecture of any kind lands ${label(oldAllLast)}; excluding Storytelling ${label(oldAllLastNoSpch)}. Never scheduled by the old plan: ${notScheduledOld.length ? notScheduledOld.join(", ") : "none"}.\n`;
  dt += `New, core only: last lecture ${label(lastAll(runs.core))}; the math foundation (MATH 110/120/130) ends ${label(lastOf(runs.core, ["math110", "math120", "math130"]))}, so Phase-2 work opens then instead of fixed day 183; the Karpathy pass ends ${label(runs.core.doneDay["ai200.1.8"])}; the 16th paper's reimplementation ends ${label(runs.core.paperEnd[runs.core.papers[15]?.key])}.\n`;
  dt += `New, everything included (core + the seven additions; option A): Zero to Hero done ${label(runs.plus.doneDay["ai200.1.8"])}; last lecture ${label(lastAll(runs.plus))}; the 16th paper ends ${label(runs.plus.paperEnd[runs.plus.papers[15]?.key])}.\n`;
  dt += `Unscheduled leftovers: core ${runs.core.left.length ? runs.core.left.join(" ") : "none"}; with additions ${runs.plus.left.length ? runs.plus.left.join(" ") : "none"}.\n`;
  // Option A (owner, 12 Nov): gates and day 1094 unchanged. Show what the full plan has done by each gate.
  const R = runs.plus;
  const papersBy = d => R.papers.filter(p => R.paperEnd[p.key] <= d).length;
  const addsLeft = d => ["cs110", "cs150", "math140", "math160", "math150", "phys300", "phys200"].filter(c => lastOf(R, [c]) > d).map(c => byKey[c + ".0.0"].code);
  dt += "\n### Gates under option A (chosen 12 Nov: unchanged)\n\n| Gate | Requirement | Target (unchanged) | Papers reimplemented by then | Added courses still running then |\n|---|---|---|---:|---|\n";
  D.GATES.forEach((g, i) => { const d = gateA[i]; dt += `| ${g.n} ${g.label} | ${esc(g.req)} | ${label(d)} | ${papersBy(d)} of 16 | ${addsLeft(d).join(", ") || "none"} |\n`; });
  dt += `\nNo gate moves: the targets are what the app's gatePlan() gives today (cumulative months × 30.4 study days, walked with dateForStudy), and day 1094 stays ${date(1093)}. With everything included the last lecture is ${label(lastAll(R))} and the 16th paper ${label(R.paperEnd[R.papers[15]?.key])}, both before gate 4 (${label(gateA[3])}).\n`;
  dt += `\nPaper reimplementations (everything included, ${PAPER_PRACTICE_DAYS} study days each in the practice block): ` + R.papers.map((p, i) => `${i + 1}. ${p.key} ends ${date(R.paperEnd[p.key])}`).join("; ") + ".\n";
  replaceGenerated("dates.md", dt);

  // machine-readable summary for README
  fs.writeFileSync(path.join(SPEC, "dates.json"), JSON.stringify({
    cutover: CUTOVER, cutIdx: cut, day1094: date(1093), oldLast: date(oldAllLast), oldLastNoSpch: date(oldAllLastNoSpch),
    coreLast: date(lastAll(runs.core)), plusLast: date(lastAll(runs.plus)), karpathyDone: date(runs.core.doneDay["ai200.1.8"]),
    bridgeDone: date(lastOf(runs.core, ["cs100"])), secondPassStart: date(runs.core.schedule.find(rw => rw.ai.some(i => i.x.key === "ai200.3.0")).d), pyDone: date(Math.max(runs.core.doneDay["cs100.1.1"], runs.core.doneDay["cs100.0.9"])), mathFoundationDone: date(lastOf(runs.core, ["math110", "math120", "math130"])),
    gatesA: gateA.map(date), plusKarpathyDone: date(runs.plus.doneDay["ai200.1.8"]), plusPaper16: date(runs.plus.paperEnd[runs.plus.papers[15].key]), plusPaper6: date(runs.plus.paperEnd[runs.plus.papers[5].key]), plusMathFoundation: date(lastOf(runs.plus, ["math110", "math120", "math130"])), plusAdds: Object.fromEntries(["cs110", "cs150", "math140", "math160", "math150", "phys300", "phys200"].map(c => [c, [date(firstOf(runs.plus, [c])), date(lastOf(runs.plus, [c]))]])), counts,
  }, null, 1) + "\n");
  console.log(JSON.stringify(JSON.parse(fs.readFileSync(path.join(SPEC, "dates.json"), "utf8")), (k, v) => k === "counts" ? undefined : v));
})().catch(e => { console.error(e); process.exit(1); });
