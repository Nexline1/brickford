// T-033: the calendar order of the 80 target lectures.
// (1) A pure Node replica of studyIndex / dateForStudy / packWindows / scheduledFor
//     from platform/js/app.js, empty progress (fixed windows).
// (2) The real scheduledFor through window.__brickfordTest, fixed clock, fresh context.
// The two must agree on the first date of every target lecture.
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = process.argv[2];
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "platform/data/curriculum.js"), "utf8"), ctx);
const D = ctx.DAR;
const TARGET = ["ai200", "ai210", "ai300", "ai310", "res400"];

const REST_DOW = 6, STUDY_WEEK = 6, P2_DAY = 182;
const addDaysISO = (iso, n) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dowOf = iso => new Date(iso + "T00:00:00Z").getUTCDay();
const daysBetween = (a, b) => Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000);
const restK = (REST_DOW - dowOf(D.START_DATE) + 7) % 7;
const restsWithin = n => n > restK ? Math.floor((n - restK - 1) / 7) + 1 : 0;
function studyIndex(iso) { if (iso < D.START_DATE || dowOf(iso) === REST_DOW) return -1; const n = daysBetween(D.START_DATE, iso); return n - restsWithin(n); }
function dateForStudy(i) { if (i < restK) return addDaysISO(D.START_DATE, i); const j = i - restK; return addDaysISO(D.START_DATE, restK + 1 + Math.floor(j / 6) * 7 + (j % 6)); }
const EFFORT = m => m * 1.8 + 4, THEORY_BUDGET = 120, BUILD_BUDGET = 90;
const flat = cid => { const c = D.COURSES.find(x => x.id === cid), out = []; (c.units || []).forEach((u, ui) => u.lessons.forEach((l, li) => out.push({ cid, ui, li, l }))); return out; };
function packWindows(fl, budget) {
  const out = []; let i = 0;
  while (i < fl.length) {
    const e = EFFORT(fl[i].l.min || 50);
    if (e > budget * 1.15) { const n = Math.ceil(e / budget); for (let k = 1; k <= n; k++) out.push({ idxs: [i] }); i++; }
    else { let eff = 0, j = i; while (j < fl.length) { const ej = EFFORT(fl[j].l.min || 50); if (ej > budget * 1.15) break; if (j > i && eff + ej > budget * 1.05) break; eff += ej; j++; }
      const idxs = []; for (let k = i; k < j; k++) idxs.push(k); out.push({ idxs }); i = j; }
  }
  return out;
}
const ROT = ["math110", "math120", "math130"];
const rotW = {}; ROT.forEach(c => rotW[c] = packWindows(flat(c), THEORY_BUDGET));
const spine = flat("ai200").concat(flat("ai210")), spineW = packWindows(spine, BUILD_BUDGET);
function sched(d) {
  const items = [];
  const rot = ROT[d % 3], tw = rotW[rot][Math.floor(d / 3)];
  let theory = false;
  if (tw) { tw.idxs.forEach(k => items.push(flat(rot)[k])); theory = tw.idxs.length > 0; }
  if (!theory && d >= P2_DAY) {
    const chain = [["math210", 1], ["sys250", 2], ["ai310", 2], ["res400", 3]];
    let off = d - P2_DAY;
    for (const [cid, span] of chain) { const fl = flat(cid), len = fl.length * span; if (off < len) { items.push(fl[Math.floor(off / span)]); break; } off -= len; }
    const ph = flat("phys100"), p = Math.floor((d - P2_DAY) / 4);
    if ((d - P2_DAY) % 4 === 0 && p >= 0 && p < ph.length) items.push(ph[p]);
  }
  const bw = spineW[d];
  if (bw && bw.idxs.length) bw.idxs.forEach(k => items.push(spine[k]));
  else if (d >= P2_DAY) { const pa = flat("ai300"), pi = Math.floor((d - P2_DAY) / 21); if (pi < pa.length) items.push(pa[pi]); }
  return items;
}
const first = {};
for (let d = 0; d < 1200; d++) sched(d).forEach(it => { const k = it.cid + "." + it.ui + "." + it.li; if (TARGET.includes(it.cid) && !(k in first)) first[k] = dateForStudy(d); });
const all = []; TARGET.forEach(cid => flat(cid).forEach(it => all.push({ k: cid + "." + it.ui + "." + it.li, l: it.l })));
module.exports = { first, all, D, studyIndex, dateForStudy };

if (require.main === module) (async () => {
  const { chromium } = require("/opt/node22/lib/node_modules/playwright");
  const browser = await chromium.launch();
  const c = await browser.newContext({ timezoneId: "UTC" });
  await c.route("https://api.github.com/**", r => r.abort());
  await c.clock.setFixedTime(new Date("2026-10-14T12:00:00Z"));
  const page = await c.newPage();
  await page.goto("file://" + path.join(ROOT, "platform/index.html") + "#/__test", { waitUntil: "load" });
  await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 10000 });
  const real = await page.evaluate(({ start, n, target }) => {
    const T = window.__brickfordTest, out = {};
    for (let i = 0; i < n; i++) { const iso = T.dateForStudy(i);
      T.scheduledFor(iso).forEach(it => { if (it.pseudo || !target.includes(it.cid)) return; const k = it.cid + "." + it.ui + "." + it.li; if (!(k in out)) out[k] = iso; }); }
    return out;
  }, { start: D.START_DATE, n: 1200, target: TARGET });
  await browser.close();
  let agree = 0, disagree = [];
  all.forEach(x => { if (first[x.k] === real[x.k]) agree++; else disagree.push(x.k + " replica " + first[x.k] + " app " + real[x.k]); });
  console.log("replica vs app.js scheduledFor: " + agree + " of " + all.length + " agree" + (disagree.length ? "\n  " + disagree.join("\n  ") : ""));
  const rows = all.slice().sort((a, b) => (first[a.k] || "9999").localeCompare(first[b.k] || "9999") || 0);
  console.log(JSON.stringify(rows.map(r => [r.k, first[r.k], r.l.t, r.l.v || "", r.l.min || "", r.l.paper ? "paper" : r.l.read ? "read" : ""])));
})();
