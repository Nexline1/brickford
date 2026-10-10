// T-037 — the date-map proof. Walks every calendar day of the plan through the
// app's own scheduledFor() (via the spec'd #__test hook) with a FIXED clock and
// an EMPTY state, and writes every lesson's scheduled date(s), grouped as
// non-SPCH lessons, SPCH lessons, and the pseudo blocks (Psets/Project/Frontier).
//
//   NODE_PATH=/opt/node22/lib/node_modules node date-map.js <platform dir> <out.json>
//   node date-map.js --diff before.json after.json
//
// The diff mode exits 1 if ANY non-SPCH lesson's dates, any pseudo block, the
// start, day 1094 or the gate baseline differ, or if any SPCH seed lesson
// (spch100.0.* / spch100.1.*) moved.
"use strict";
const fs = require("fs"), path = require("path");

if (process.argv[2] === "--diff") {
  const A = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
  const B = JSON.parse(fs.readFileSync(process.argv[4], "utf8"));
  let bad = 0;
  const say = s => { console.log(s); };
  ["start", "day1094", "baseline"].forEach(k => {
    const same = A[k] === B[k];
    if (!same) bad++;
    say((same ? "same  " : "MOVED ") + k + ": " + A[k] + " -> " + B[k]);
  });
  const cmpMap = (name, a, b) => {
    const keys = new Set(Object.keys(a).concat(Object.keys(b)));
    let moved = 0, n = 0;
    [...keys].sort().forEach(k => {
      n++;
      const x = JSON.stringify(a[k] || null), y = JSON.stringify(b[k] || null);
      if (x !== y) { moved++; if (moved <= 40) say("  MOVED " + name + " " + k + ": " + x + " -> " + y); }
    });
    say((moved ? "DIFF  " : "same  ") + name + ": " + n + " keys, " + moved + " differ");
    return moved;
  };
  bad += cmpMap("non-SPCH lesson", A.nonSpch, B.nonSpch);
  bad += cmpMap("pseudo block", A.pseudo, B.pseudo);
  const seed = m => Object.fromEntries(Object.entries(m).filter(([k]) => /^spch100\.[01]\./.test(k)));
  bad += cmpMap("SPCH seed lesson", seed(A.spch), seed(B.spch));
  const spA = Object.keys(A.spch).length, spB = Object.keys(B.spch).length;
  const lastA = Object.values(A.spch).flat().sort().pop(), lastB = Object.values(B.spch).flat().sort().pop();
  say("info  SPCH lessons: " + spA + " -> " + spB + "; last SPCH date " + lastA + " -> " + lastB +
      "; SPCH speech days " + A.spchDays + " -> " + B.spchDays);
  say(bad ? "RESULT: " + bad + " group(s) differ" : "RESULT: identical — no non-SPCH date, pseudo block, seed lesson, start, day 1094 or baseline moved");
  process.exit(bad ? 1 : 0);
}

const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const platform = path.resolve(process.argv[2]);
const out = process.argv[3];
const URL = "file://" + path.join(platform, "index.html") + "#/__test";
const NOW = "2026-10-09";        // fixed; the empty state makes windowFor use the fixed windows
const WALK_TO = "2032-12-31";    // well past the finish

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
  await ctx.route("https://api.github.com/**", r => r.abort());
  await ctx.clock.setFixedTime(new Date(NOW + "T12:00:00Z"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 10000 });
  const r = await page.evaluate(WALK_TO => {
    const T = window.__brickfordTest, D = window.DAR;
    const add = (iso, n) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    const nonSpch = {}, spch = {}, pseudo = {};
    let spchDays = 0;
    for (let iso = D.START_DATE; iso <= WALK_TO; iso = add(iso, 1)) {
      const items = T.scheduledFor(iso);
      let sp = false;
      items.forEach(it => {
        if (it.pseudo) { (pseudo[iso] = pseudo[iso] || []).push(it.track + ":" + it.short); return; }
        const k = it.cid + "." + it.ui + "." + it.li;
        const tag = iso + (it.spanN > 1 ? "#" + it.dayN + "/" + it.spanN : "") + "@" + it.track;
        if (/^spch/.test(it.cid)) { (spch[k] = spch[k] || []).push(tag); sp = true; }
        else (nonSpch[k] = nonSpch[k] || []).push(tag);
      });
      if (sp) spchDays++;
    }
    return { start: D.START_DATE, day1094: T.dateForStudy(1093), baseline: T.addStudyDays(D.START_DATE, 1094),
             nonSpch, spch, pseudo, spchDays };
  }, WALK_TO);
  r.clock = NOW; r.errors = errors;
  fs.writeFileSync(out, JSON.stringify(r, null, 1));
  console.log("wrote " + out + ": " + Object.keys(r.nonSpch).length + " non-SPCH lessons, " +
    Object.keys(r.spch).length + " SPCH lessons over " + r.spchDays + " days, " + Object.keys(r.pseudo).length +
    " pseudo-block days; start " + r.start + ", day 1094 " + r.day1094 + ", baseline " + r.baseline + "; page errors " + errors.length);
  await browser.close();
})();
