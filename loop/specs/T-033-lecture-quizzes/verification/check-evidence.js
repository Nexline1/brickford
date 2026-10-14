// T-033 evidence check.   node loop/specs/T-033-lecture-quizzes/verification/check-evidence.js
//
// For every check in the five T-033 summary files there must be exactly one line in
// evidence/<courseId>.jsonl: {key, i, at, src, quote}. Its `at`/`src` must match the
// check's, the quote must be at most 25 words, and — when the source is cached
// under sources/ (git-ignored, so absent in a fresh clone) — the quote must occur
// in that source verbatim, up to whitespace, case and markdown emphasis.
// sources.json maps each key to its cached files.
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const HERE = __dirname, ROOT = path.resolve(HERE, "../../../..");
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
const FILES = ["curriculum", "summaries-ai200", "summaries-ai210", "summaries-ai300", "summaries-ai310", "summaries-res400"];
FILES.forEach(f => { const p = path.join(ROOT, "platform/data", f + ".js"); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, "utf8"), ctx); });
const D = ctx.DAR, COURSES = ["ai200", "ai210", "ai300", "ai310", "res400"];
const sources = JSON.parse(fs.readFileSync(path.join(HERE, "sources.json"), "utf8"));
const norm = s => String(s).replace(/<[^>]*>/g, " ").replace(/\[\[[^\]]*\]\]/g, "").replace(/[*_`#>]/g, "")
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();
let fail = 0, n = 0, verbatim = 0, uncached = 0;
const bad = m => { fail++; console.log("  FAIL " + m); };
COURSES.forEach(cid => {
  const keys = Object.keys(D.SUMMARIES || {}).filter(k => k.startsWith(cid + "."));
  const evPath = path.join(HERE, "evidence", cid + ".jsonl");
  const ev = fs.existsSync(evPath) ? fs.readFileSync(evPath, "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l)) : [];
  if (keys.length && !ev.length) bad(cid + ": no evidence file");
  keys.forEach(k => (D.SUMMARIES[k].checks || []).forEach((c, i) => {
    n++;
    const rows = ev.filter(e => e.key === k && e.i === i);
    if (rows.length !== 1) return bad(k + " check " + i + ": " + rows.length + " evidence lines (want 1)");
    const e = rows[0];
    if ((c.at === undefined ? null : c.at) !== (e.at === undefined ? null : e.at)) bad(k + " check " + i + ": at " + c.at + " in data, " + e.at + " in evidence");
    if (c.src !== undefined && c.src !== e.src) bad(k + " check " + i + ": src differs between data and evidence");
    const words = String(e.quote || "").trim().split(/\s+/).filter(Boolean).length;
    if (!words || words > 25) bad(k + " check " + i + ": quote is " + words + " words (1 to 25)");
    const files = ((sources[k] || {}).files || []).map(f => path.join(ROOT, f)).filter(f => fs.existsSync(f));
    if (!files.length) { uncached++; return; }
    const text = norm(files.map(f => fs.readFileSync(f, "utf8")).join("\n"));
    if (text.includes(norm(e.quote))) verbatim++;
    else bad(k + " check " + i + ": quote not found in the cached source: " + e.quote);
  }));
  ev.forEach(e => { if (!(D.SUMMARIES[e.key] && (D.SUMMARIES[e.key].checks || [])[e.i])) bad(cid + ": evidence for " + e.key + " check " + e.i + " names no check"); });
});
console.log((fail ? fail + " FAILED; " : "PASS — ") + n + " checks, " + verbatim + " quotes found verbatim in the cached source, " + uncached + " with no cached source here");
process.exit(fail ? 1 : 0);
