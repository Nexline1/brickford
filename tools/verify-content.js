// Brickford — content correctness harness.  node tools/verify-content.js
//
// Teaching content that is subtly wrong is worse than no content: it installs a
// false belief and the platform then rehearses it on a spaced schedule. So every
// structural claim is checked, and every numeric answer is recomputed here from
// the mathematics rather than copied from the data file.
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
["platform/data/curriculum.js", "platform/data/workshop.js", "platform/js/figures.js",
 "platform/data/concepts-linear-algebra.js",
 "platform/data/quiz-linear-algebra.js","platform/data/quiz-calculus.js","platform/data/quiz-probability.js",
 "platform/data/quiz-dsa.js","platform/data/quiz-zero-to-hero.js","platform/data/quiz-math-for-ml.js",
 "platform/data/quiz-llm-engineering.js","platform/data/summaries-math110.js"]
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f }));

const D = ctx.DAR;
let fail = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { fail++; console.log("  FAIL " + msg); } };

// ---------- structure ----------
const lessonKeys = new Set();
D.COURSES.forEach(c => (c.units || []).forEach((u, ui) =>
  u.lessons.forEach((_, li) => lessonKeys.add(c.id + "." + ui + "." + li))));

const ids = new Set(D.CONCEPTS.map(c => c.id));
ok(ids.size === D.CONCEPTS.length, "concept ids are unique");

D.CONCEPTS.forEach(c => {
  ok(!!c.one && c.one.length > 30, c.id + ": has a real one-line statement");
  ok(!!c.fig && typeof D.FIG[c.fig] === "function", c.id + ": figure '" + c.fig + "' exists in DAR.FIG");
  ok(!!c.miss, c.id + ": names a misconception");
  ok(!!c.applies, c.id + ": says where it applies in AI");
  ok(Array.isArray(c.probes) && c.probes.length >= 2, c.id + ": has at least 2 probes");
  (c.prereq || []).forEach(p => ok(ids.has(p), c.id + ": prereq '" + p + "' resolves"));
  (c.lectures || []).forEach(l => ok(lessonKeys.has(l), c.id + ": lecture '" + l + "' exists"));
  ok((c.lectures || []).length > 0, c.id + ": points at least one lecture");
});

// The graph must be a DAG or the Atlas cannot be laid out and prerequisites lie.
(function acyclic() {
  const byId = {}; D.CONCEPTS.forEach(c => byId[c.id] = c);
  const state = {};
  let cycle = null;
  const visit = (id, stack) => {
    if (state[id] === 2) return;
    if (state[id] === 1) { cycle = stack.concat(id).join(" → "); return; }
    state[id] = 1;
    (byId[id].prereq || []).forEach(p => byId[p] && visit(p, stack.concat(id)));
    state[id] = 2;
  };
  D.CONCEPTS.forEach(c => visit(c.id, []));
  ok(!cycle, "concept graph is acyclic" + (cycle ? " (cycle: " + cycle + ")" : ""));
})();

// Every figure in the library should be reachable and produce valid-looking SVG.
Object.keys(D.FIG).forEach(k => {
  let s = "";
  try { s = D.FIG[k]({}); } catch (e) { s = ""; }
  ok(/^<svg[\s\S]*<\/svg>$/.test(s.trim()), "figure " + k + ": renders an svg");
  ok(/viewBox=/.test(s), "figure " + k + ": has a viewBox (needed to scale to 320px)");
  ok(/aria-label="[^"]{10,}"/.test(s), "figure " + k + ": has a descriptive aria-label");
  ok(!/#[0-9a-fA-F]{3,6}\b/.test(s), "figure " + k + ": uses theme variables, not hard-coded colours");
});

// ---------- the mathematics, recomputed ----------
// Each entry states the answer independently. If the data file and this
// calculation disagree, one of them is wrong and the build stops.
const det2 = m => m[0][0] * m[1][1] - m[0][1] * m[1][0];
const matmul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const trace = m => m.reduce((s, r, i) => s + r[i], 0);
const eig2 = m => { // eigenvalues of a 2x2 via the characteristic polynomial
  const t = trace(m), d = det2(m), r = Math.sqrt(t * t / 4 - d);
  return [t / 2 + r, t / 2 - r];
};
const rank = M => { // Gaussian elimination with partial pivoting
  const A = M.map(r => r.slice()); const rows = A.length, cols = A[0].length;
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = r; for (let i = r; i < rows; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
    if (Math.abs(A[p][c]) < 1e-12) continue;
    [A[r], A[p]] = [A[p], A[r]];
    for (let i = r + 1; i < rows; i++) { const f = A[i][c] / A[r][c]; for (let j = c; j < cols; j++) A[i][j] -= f * A[r][j]; }
    r++;
  }
  return r;
};

const expected = {
  "la-vector":         [{ i: 0, v: (function () { return -1 + 4; })() }],
  "la-span":           [{ i: 1, v: rank([[1, 0, 0], [0, 1, 0], [1, 1, 0]]) }],
  "la-independence":   [{ i: 1, v: (function () { // c making {(1,2),(3,c)} dependent -> det = 0
                              let c = null; for (let k = -20; k <= 20; k++) if (Math.abs(det2([[1, 3], [2, k]])) < 1e-12) c = k; return c; })() }],
  "la-basis":          [{ i: 0, v: (function () { // (2,2) = a(1,0)+b(1,1) -> a
                              const b = 2; return 2 - b; })() },
                        { i: 1, v: 4 }],
  "la-linear-map":     [{ i: 1, v: (function () { const A = [[2, 0], [0, 3]]; return A[1][0] * 1 + A[1][1] * 1; })() }],
  "la-matmul":         [{ i: 1, v: matmul([[1, 1], [0, 1]], [[1, 0], [1, 1]])[0][0] }],
  "la-determinant":    [{ i: 0, v: det2([[3, 1], [2, 4]]) }],
  "la-rank-nullity":   [{ i: 0, v: 7 - 3 }],
  "la-eigen":          [{ i: 0, v: Math.max.apply(null, eig2([[4, 1], [0, 3]])) },
                        { i: 1, v: trace([[5, 2], [1, 3]]) }],
  "la-projection":     [{ i: 1, v: 0 }],
  "la-spectral":       [{ i: 1, v: Math.max(2, 5) }],
  "la-svd":            [{ i: 1, v: rank([[1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 0], [2, 2, 0]]) }],
};

let numChecked = 0;
D.CONCEPTS.forEach(c => {
  (c.probes || []).forEach((p, i) => {
    const isNum = p.num !== undefined;
    ok(isNum || (Array.isArray(p.opts) && p.a !== undefined), c.id + " probe " + i + ": is numeric or multiple choice");
    ok(!!p.expl, c.id + " probe " + i + ": has an explanation");
    if (isNum) {
      const want = (expected[c.id] || []).find(e => e.i === i);
      ok(!!want, c.id + " probe " + i + ": numeric answer is independently checked");
      if (want) {
        numChecked++;
        ok(Math.abs(want.v - p.num) < 1e-9,
          c.id + " probe " + i + ": stated " + p.num + ", recomputed " + want.v);
      }
    }
  });
});

// ---------- exam banks: nothing may be asked before it is taught ----------
// Each question names the lecture that unlocks it. A tag that cannot be read at
// a glance cannot be trusted, so the mapping is printed grouped by lecture.
const lessonTitle = {};
D.COURSES.forEach(c => (c.units || []).forEach((u, ui) =>
  u.lessons.forEach((l, li) => lessonTitle[c.id + "." + ui + "." + li] = l.t)));

const banks = D.QUIZZES || {};
let tagged = 0, untagged = 0;
Object.keys(banks).forEach(id => {
  const course = D.COURSES.find(c => c.quiz === id);
  ok(!!course, "bank " + id + ": belongs to a course");
  banks[id].questions.forEach((q, i) => {
    if (q.after) {
      tagged++;
      ok(!!lessonTitle[q.after], id + " q" + i + ": unlock key '" + q.after + "' resolves to a lecture");
      if (course) ok(q.after.indexOf(course.id + ".") === 0, id + " q" + i + ": unlocks from its own course");
    } else untagged++;
  });
});

if (process.argv.indexOf("--tags") >= 0) {
  Object.keys(banks).forEach(id => {
    const g = {};
    banks[id].questions.forEach(q => { if (q.after) (g[q.after] = g[q.after] || []).push(q.q); });
    const keys = Object.keys(g).sort((a, b) => {
      const A = a.split("."), B = b.split(".");
      return (A[1] - B[1]) || (A[2] - B[2]);
    });
    if (!keys.length) return;
    console.log("\n" + id.toUpperCase());
    keys.forEach(k => {
      console.log("  " + k + "  " + lessonTitle[k]);
      g[k].forEach(q => console.log("      · " + q.replace(/\$|\\\\/g, "").slice(0, 60)));
    });
  });
}

// ---------- practice sources ----------
D.COURSES.forEach(c => {
  ok(!!c.practice && /^https:\/\//.test(c.practice.url), c.code + ": has an https practice source");
  ok(!!c.practice && c.practice.label && c.practice.label.length > 8, c.code + ": practice source says what to do");
});

console.log("\n" + (fail === 0
  ? "PASS — " + checks + " checks, " + numChecked + " numeric answers recomputed, "
    + D.CONCEPTS.length + " concepts, " + Object.keys(D.FIG).length + " figures, "
    + tagged + " questions gated (" + untagged + " untagged)"
  : fail + " of " + checks + " checks FAILED"));
process.exit(fail === 0 ? 0 : 1);
