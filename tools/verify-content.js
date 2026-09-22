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
["platform/data/curriculum.js", "platform/data/workshop.js", "platform/js/figures.js", "platform/js/lab.js",
 "platform/data/concepts-linear-algebra.js",
 "platform/data/quiz-linear-algebra.js","platform/data/quiz-calculus.js","platform/data/quiz-probability.js",
 "platform/data/quiz-dsa.js","platform/data/quiz-zero-to-hero.js","platform/data/quiz-math-for-ml.js",
 "platform/data/quiz-llm-engineering.js","platform/data/summaries-math110.js",
 "platform/data/summaries-math110-mit.js",
 "platform/data/summaries-math120.js",
 "platform/data/storytelling.js"]
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

// Interactive figures. A `lab:` key pointing at nothing fails silently — the
// panel simply does not render — so the link is asserted here rather than
// discovered by noticing an absence.
const LAB = D.LAB || {};
D.CONCEPTS.forEach(c => {
  if (!c.lab) return;
  ok(!!LAB[c.lab], c.id + ": lab '" + c.lab + "' exists in DAR.LAB");
  const l = LAB[c.lab];
  if (!l) return;
  ok(!!l.title, c.lab + ": states what to do with it");
  ok(!!l.ask, c.lab + ": asks something the dragging answers");
  ok(typeof l.mount === "function", c.lab + ": has a mount function");
});
// An unreferenced lab is dead weight: it can never be reached from a concept.
Object.keys(LAB).forEach(k =>
  ok(D.CONCEPTS.some(c => c.lab === k), "lab " + k + ": is referenced by a concept"));

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
// ---------- the drill layer ----------
// A drill keyed to a lesson that does not exist renders nothing and says nothing,
// so the failure is invisible in the browser and has to be caught here.
Object.keys(D.DRILLS || {}).forEach(k => {
  const d = D.DRILLS[k];
  ok(lessonKeys.has(k), "drill " + k + ": keys a lecture that exists");
  ok(!!d.mechanic && d.mechanic.length > 40, "drill " + k + ": states a mechanic in a real sentence");
  ok(Array.isArray(d.rules) && d.rules.length >= 3 && d.rules.length <= 5,
     "drill " + k + ": has 3-5 extractable rules (has " + (d.rules || []).length + ")");
  ok(!!d.drill && !!d.drill.do, "drill " + k + ": says what to actually do");
  ok(!!d.drill && d.drill.minutes > 0 && d.drill.minutes <= 10,
     "drill " + k + ": the drill is 10 minutes or less");
  ok(!!d.drill && ["written", "recorded", "spoken"].indexOf(d.drill.artifact) >= 0,
     "drill " + k + ": produces a written, recorded or spoken artifact");
  ok(!!d.check && d.check.length > 20, "drill " + k + ": says how you know it worked");
  // The brief: "No summaries longer than the drill."
  ok(d.mechanic.length < d.rules.join(" ").length, "drill " + k + ": mechanic is a sentence, not a summary");
});

// ---------- the lecture summaries ----------
// This layer had NO checks at all until 22 Sep 2026, which was survivable while
// it was six entries written in one sitting. It is on its way to fifty-one.
//
// Every way a summary can be wrong fails SILENTLY in the browser. app.js's
// summaryHTML() returns "" for a key that matches no lecture; the figure lookup
// is guarded by `b.fig && D.FIG[b.fig]`; the concept lookup is a .find() whose
// miss renders an empty string. So a typo in any of the three produces a page
// that is merely missing something, which is indistinguishable from a lecture
// that has no summary yet. And a wrong `num` is worse than missing: the spaced
// scheduler rehearses it for months. That is the failure CONTENT-STANDARD.md
// exists to prevent, so the numbers are recomputed here rather than trusted.
const expectedSummary = {
  "math110.0.0":  [{ i: 1, v: (function () { return 1 + 3; })() }],            // first component of (1,2)+(3,-1)
  "math110.0.1":  [{ i: 1, v: rank([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) }],      // size of a basis of R^3
  "math110.0.2":  [{ i: 1, v: (function () {   // 90 deg CCW, second component of column 1
                        const t = Math.PI / 2;
                        const R = [[Math.cos(t), -Math.sin(t)], [Math.sin(t), Math.cos(t)]];
                        return Math.round(R[1][0]); })() }],
  "math110.0.4":  [{ i: 1, v: (function () {   // 90 deg about y, third component of column 1
                        const t = Math.PI / 2;
                        const Ry = [[Math.cos(t), 0, Math.sin(t)], [0, 1, 0], [-Math.sin(t), 0, Math.cos(t)]];
                        return Math.round(Ry[2][0]); })() }],
  "math110.0.5":  [{ i: 1, v: det2([[3, 0], [0, 2]]) }],
  "math110.0.6":  [{ i: 1, v: (function () {   // nullity of a 7-column, rank-3 matrix
                        const M = [[1, 0, 0, 2, 1, 0, 3], [0, 1, 0, 1, 1, 0, 1], [0, 0, 1, 0, 2, 0, 5]];
                        return M[0].length - rank(M); })() }],
  "math110.0.7":  [{ i: 1, v: (function () {   // columns of a matrix taking R^4 to R^2
                        const A = [[1, 0, 0, 0], [0, 1, 0, 0]];
                        return A[0].length; })() }],
  "math110.0.8":  [{ i: 1, v: (function () {   // (1,2) . (3,4)
                        const v = [1, 2], w = [3, 4];
                        return v.reduce((s, x, i) => s + x * w[i], 0); })() }],
  "math110.0.9":  [{ i: 1, v: det2([[-3, 2], [1, 1]]) }],                   // 2D cross product IS the determinant
  "math110.0.10": [{ i: 1, v: (function () {   // area spanned by two perpendicular vectors of length 2
                        return Math.abs(det2([[2, 0], [0, 2]])); })() }],
  "math110.0.11": [{ i: 1, v: (function () {   // Cramer: swap v into column one, divide by det A
                        const A = [[3, 1], [1, 2]], v = [9, 8];
                        const A1 = [[v[0], A[0][1]], [v[1], A[1][1]]];
                        return det2(A1) / det2(A); })() }],
  "math110.0.12": [{ i: 1, v: (function () {   // her (-1,2) read into our coordinates, first component
                        const B = [[2, -1], [1, 1]];          // her basis vectors as columns
                        const c = [-1, 2];
                        return B[0][0] * c[0] + B[0][1] * c[1]; })() }],
  "math110.0.13": [{ i: 1, v: Math.max.apply(null, eig2([[3, 1], [0, 2]])) }],
  "math110.0.14": [{ i: 1, v: Math.max.apply(null, eig2([[2, 7], [1, 8]])) }],
  "math110.0.15": [{ i: 1, v: (function () {   // d/dx of x^3+5x^2+4x+5, coefficient of x
                        const c = [5, 4, 5, 1];              // constant term first
                        const d = c.slice(1).map((v, i) => (i + 1) * v);
                        return d[1]; })() }],
  "math110.1.0":  [{ i: 1, v: (function () {   // x*(2,-1) + y*(-1,2) at x=1,y=2, second component
                        const c1 = [2, -1], c2 = [-1, 2], x = 1, y = 2;
                        return x * c1[1] + y * c2[1]; })() }],
  "math110.1.1":  [{ i: 1, v: (function () {   // det of the lecture's matrix, by cofactor expansion
                        const A = [[1, 2, 1], [3, 8, 1], [0, 4, 1]];
                        return A[0][0] * det2([[A[1][1], A[1][2]], [A[2][1], A[2][2]]])
                             - A[0][1] * det2([[A[1][0], A[1][2]], [A[2][0], A[2][2]]])
                             + A[0][2] * det2([[A[1][0], A[1][1]], [A[2][0], A[2][1]]]); })() }],
  "math110.1.2":  [{ i: 1, v: (function () {   // inverse of [[1,3],[2,7]], entry 1,2
                        const A = [[1, 3], [2, 7]], d = det2(A);
                        return -A[0][1] / d; })() }],
  "math110.1.3":  [{ i: 1, v: (function () {   // the spurious 10 in E32 E21
                        const E21 = [[1, 0, 0], [-2, 1, 0], [0, 0, 1]];
                        const E32 = [[1, 0, 0], [0, 1, 0], [0, -5, 1]];
                        return matmul(E32, E21)[2][0]; })() }],
  "math110.1.4":  [{ i: 1, v: (function () {   // R R^T is symmetric; entry 1,3
                        const R = [[1, 3], [2, 3], [4, 1]];
                        const Rt = R[0].map((_, j) => R.map(r => r[j]));
                        return matmul(R, Rt)[0][2]; })() }],
  "math110.1.5":  [{ i: 1, v: rank([[1, 1, 2], [2, 1, 3], [3, 1, 4], [4, 1, 5]]) }],
  "math110.1.6":  [{ i: 1, v: (function () {   // free variables = n - r
                        const A = [[1, 2, 2, 2], [2, 4, 6, 8], [3, 6, 8, 10]];
                        return A[0].length - rank(A); })() }],
  "math110.1.7":  [{ i: 1, v: (function () {   // x_p with the free variables at zero
                        const x3 = 3 / 2;                    // 2*x3 = 3 from row two
                        return 1 - 2 * x3; })() }],          // x1 + 2*x3 = 1 from row one
  "math110.1.8":  [{ i: 1, v: (function () {   // dim N(A) = n - r
                        const A = [[1, 2, 3, 1], [1, 1, 2, 1], [1, 2, 3, 1]];
                        return A[0].length - rank(A); })() }],
  "math110.1.9":  [{ i: 1, v: (function () {   // dim N(A^T) = m - r
                        const A = [[1, 2, 3, 1], [1, 1, 2, 1], [1, 2, 3, 1]];
                        return A.length - rank(A); })() }],
  "math110.1.10": [{ i: 1, v: (function () {   // components summing to zero: null space of a row of ones
                        const A = [[1, 1, 1, 1]];
                        return A[0].length - rank(A); })() }],
  "math110.1.11": [{ i: 1, v: (function () {   // independent loops = m - r for the incidence matrix
                        const A = [[-1, 1, 0, 0], [0, -1, 1, 0], [-1, 0, 1, 0],
                                   [-1, 0, 0, 1], [0, 0, -1, 1]];
                        return A.length - rank(A); })() }],
  "math110.1.12": [{ i: 1, v: (function () {   // dim N(C^T) for C = [[U,U],[U,0]] with U 5x3 of rank 3
                        const U = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [0, 1, 1]];
                        const Z = [0, 0, 0];
                        const C = U.map(r => r.concat(r)).concat(U.map(r => r.concat(Z)));
                        return C.length - rank(C); })() }],
  "math110.1.13": [{ i: 1, v: (function () {   // (A^T A)[1][1] for the lecture's tall matrix
                        const A = [[1, 1], [1, 2], [1, 5]];
                        const At = A[0].map((_, c) => A.map(r => r[c]));
                        return matmul(At, A)[1][1]; })() }],
  "math110.1.14": [{ i: 1, v: (function () {   // projection multiplier onto a line
                        const a = [1, 1, 1], b = [1, 2, 3];
                        const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
                        return dot(a, b) / dot(a, a); })() }],
  "math110.1.15": [{ i: 1, v: (function () {   // least-squares slope, from the normal equations
                        const A = [[1, 1], [1, 2], [1, 3]], b = [[1], [2], [2]];
                        const At = A[0].map((_, c) => A.map(r => r[c]));
                        const N = matmul(At, A), f = matmul(At, b);
                        const ND = [[N[0][0], f[0][0]], [N[1][0], f[1][0]]];
                        return det2(ND) / det2(N); })() }],
  "math110.1.16": [{ i: 1, v: (function () {   // Gram-Schmidt second vector, component two
                        const a = [1, 1, 1], b = [1, 0, 2];
                        const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
                        const k = dot(a, b) / dot(a, a);
                        return b.map((x, i) => x - k * a[i])[1]; })() }],
  "math110.1.17": [{ i: 1, v: (function () {   // det(2A) is 2^n det A; compute the doubled matrix directly
                        const A = [[1, 2], [3, 4]];
                        return det2(A.map(r => r.map(x => 2 * x))); })() }],
  "math110.1.18": [{ i: 1, v: (function () {   // 4x4 tridiagonal of ones, by elimination not by the recursion
                        const M = [[1, 1, 0, 0], [1, 1, 1, 0], [0, 1, 1, 1], [0, 0, 1, 1]];
                        const A = M.map(r => r.slice()); let d = 1;
                        for (let c = 0; c < 4; c++) {
                          let p = c; for (let i = c; i < 4; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
                          if (Math.abs(A[p][c]) < 1e-12) return 0;
                          if (p !== c) { [A[c], A[p]] = [A[p], A[c]]; d = -d; }
                          d *= A[c][c];
                          for (let i = c + 1; i < 4; i++) {
                            const f = A[i][c] / A[c][c];
                            for (let j = c; j < 4; j++) A[i][j] -= f * A[c][j];
                          }
                        }
                        return Math.round(d); })() }],
  "math110.1.19": [{ i: 1, v: (function () {   // triangle area from two edge vectors
                        return Math.abs(det2([[3, 1], [1, 2]])) / 2; })() }],
  "math110.1.20": [{ i: 1, v: Math.max.apply(null, eig2([[3, 1], [1, 3]])) }],
  "math110.1.21": [{ i: 1, v: (function () {   // largest eigenvalue of A^3, from A^3 itself
                        const A = [[3, 1], [1, 3]];
                        return Math.max.apply(null, eig2(matmul(matmul(A, A), A))); })() }],
  "math110.1.22": [{ i: 1, v: Math.min.apply(null, eig2([[-1, 2], [1, -2]])) }],
  "math110.1.23": [{ i: 1, v: Math.min.apply(null, eig2([[0.9, 0.2], [0.1, 0.8]])) }],
  "math110.1.24": [{ i: 1, v: (function () {   // determinant of the 4x4 tridiagonal 1,2,3 matrix
                        const M = [[0, 1, 0, 0], [1, 0, 2, 0], [0, 2, 0, 3], [0, 0, 3, 0]];
                        const A = M.map(r => r.slice()); let d = 1;
                        for (let c = 0; c < 4; c++) {
                          let p = c; for (let i = c; i < 4; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
                          if (Math.abs(A[p][c]) < 1e-12) return 0;
                          if (p !== c) { [A[c], A[p]] = [A[p], A[c]]; d = -d; }
                          d *= A[c][c];
                          for (let i = c + 1; i < 4; i++) {
                            const f = A[i][c] / A[c][c];
                            for (let j = c; j < 4; j++) A[i][j] -= f * A[c][j];
                          }
                        }
                        return Math.round(d); })() }],
  "math110.1.25": [{ i: 1, v: (function () {   // second pivot = det / first pivot
                        const A = [[5, 2], [2, 3]];
                        return det2(A) / A[0][0]; })() }],
  "math110.1.26": [{ i: 1, v: (function () {   // (n/2) log2 n at n = 1024
                        const n = 1024;
                        return (n / 2) * Math.log2(n); })() }],
  "math110.1.27": [{ i: 1, v: (function () {   // c making [[2,6],[6,c]] singular
                        return 6 * 6 / 2; })() }],
  "math110.1.28": [{ i: 1, v: (function () {   // det of M^-1 A M, from the product itself
                        const A = [[2, 1], [1, 2]], M = [[1, 4], [0, 1]], Mi = [[1, -4], [0, 1]];
                        return det2(matmul(Mi, matmul(A, M))); })() }],
  "math110.1.29": [{ i: 1, v: (function () {   // non-zero eigenvalue of A^T A
                        const A = [[4, 3], [8, 6]];
                        const At = A[0].map((_, c) => A.map(r => r[c]));
                        return Math.max.apply(null, eig2(matmul(At, A))); })() }],
  "math110.1.30": [{ i: 1, v: (function () {   // derivative matrix, row 2 column 3
                        const c = [0, 0, 1];                 // the basis input x^2
                        const d = c.slice(1).map((v, i) => (i + 1) * v);   // coefficients of the derivative
                        return d[1]; })() }],
  "math110.1.31": [{ i: 1, v: (function () {   // how many finest Haar wavelets sum to (1,-1,...)
                        const fine = [0, 2, 4, 6].map(k => {
                          const w = [0, 0, 0, 0, 0, 0, 0, 0]; w[k] = 1; w[k + 1] = -1; return w; });
                        const sum = fine.reduce((a, w) => a.map((x, i) => x + w[i]));
                        const alt = [1, -1, 1, -1, 1, -1, 1, -1];
                        return sum.every((x, i) => x === alt[i]) ? fine.length : -1; })() }],
  "math110.1.32": [{ i: 1, v: (function () {   // trace of A^2 for a symmetric orthogonal 3x3
                        const A = [[0, 1, 0], [1, 0, 0], [0, 0, 1]];   // symmetric and orthogonal
                        return trace(matmul(A, A)); })() }],
  "math110.1.33": [{ i: 1, v: (function () {   // trace of the projection onto a 2-dimensional column space
                        const A = [[1, 1], [1, 2], [1, 5]];
                        const At = A[0].map((_, c) => A.map(r => r[c]));
                        const N = matmul(At, A), d = det2(N);
                        const Ni = [[N[1][1] / d, -N[0][1] / d], [-N[1][0] / d, N[0][0] / d]];
                        return trace(matmul(A, matmul(Ni, At))); })() }],
  "math110.1.34": [{ i: 1, v: (function () {   // least-squares slope, by Cramer on the normal equations
                        const A = [[1, 0], [1, 1], [1, 2]], b = [[3], [4], [1]];
                        const At = A[0].map((_, c) => A.map(r => r[c]));
                        const N = matmul(At, A), f = matmul(At, b);
                        const ND = [[N[0][0], f[0][0]], [N[1][0], f[1][0]]];
                        return det2(ND) / det2(N); })() }],

  // ---- MATH 120, Single-Variable Calculus ----
  "math120.0.0":  [{ i: 1, v: (function () {   // dA/dx for the area under y = x^2, at x = 3
                        const f = x => x * x;
                        return f(3); })() }],
  "math120.0.1":  [{ i: 1, v: (function () {   // d/dt of t^3 at t = 2, from the difference quotient
                        const s = t => t * t * t, t = 2, h = 1e-6;
                        return Math.round((s(t + h) - s(t - h)) / (2 * h)); })() }],
  "math120.0.2":  [{ i: 1, v: (function () {   // power rule on x^5 at x = 2, by difference quotient
                        const f = x => Math.pow(x, 5), x = 2, h = 1e-5;
                        return Math.round((f(x + h) - f(x - h)) / (2 * h)); })() }],
  "math120.0.3":  [{ i: 1, v: (function () {   // chain rule on (x^2)^3 at x = 1, numerically
                        const g = x => Math.pow(x * x, 3), x = 1, h = 1e-5;
                        return Math.round((g(x + h) - g(x - h)) / (2 * h)); })() }],
  "math120.0.4":  [{ i: 1, v: Math.round(Math.log(8) / Math.log(2)) }],
  "math120.0.5":  [{ i: 1, v: (function () {   // dy/dx = -x/y on the circle, at (3,4)
                        const x = 3, y = 4;
                        return -x / y; })() }],
  "math120.0.6":  [{ i: 1, v: (function () {   // L'Hopital on (x^2-4)/(x-2) at x = 2, numerically
                        const f = x => (x * x - 4) / (x - 2);
                        return Math.round(f(2 + 1e-7)); })() }],
  "math120.0.7":  [{ i: 1, v: (function () {   // integral of t(8-t) from 0 to 6, by Riemann sum
                        const v = t => t * (8 - t); let s = 0, n = 2000000, a = 0, b = 6, h = (b - a) / n;
                        for (let i = 0; i < n; i++) s += v(a + (i + 0.5) * h) * h;
                        return Math.round(s); })() }],
  "math120.0.8":  [{ i: 1, v: (function () {   // integral of sin from 0 to pi
                        let s = 0, n = 2000000, h = Math.PI / n;
                        for (let i = 0; i < n; i++) s += Math.sin((i + 0.5) * h) * h;
                        return Math.round(s); })() }],
  "math120.0.9":  [{ i: 1, v: (function () {   // second derivative of x^3 at x = 3
                        const f = x => x * x * x, x = 3, h = 1e-4;
                        return Math.round((f(x + h) - 2 * f(x) + f(x - h)) / (h * h)); })() }],
  "math120.0.10": [{ i: 1, v: (function () {   // 1 - x^2/2 at x = 0.1
                        const x = 0.1;
                        return 1 - x * x / 2; })() }],
  "math120.0.11": [{ i: 1, v: (function () {   // local stretch factor of x^2 at 3 = its derivative
                        const f = x => x * x, x = 3, h = 1e-6;
                        return Math.round((f(x + h) - f(x - h)) / (2 * h)); })() }],
  "math120.1.0":  [{ i: 1, v: (function () {   // triangle under a tangent to y = 1/x
                        const x0 = 3, y0 = 1 / x0;
                        return 0.5 * (2 * x0) * (2 * y0); })() }],
  "math120.1.1":  [{ i: 1, v: (function () {   // h = 80 - 5t^2, speed at t = 4
                        const h = t => 80 - 5 * t * t, t = 4, e = 1e-6;
                        return Math.round((h(t + e) - h(t - e)) / (2 * e)); })() }],
  "math120.1.2":  [{ i: 1, v: (function () {   // d/dx sin x at pi/3, from the difference quotient
                        const x = Math.PI / 3, e = 1e-6;
                        const d = (Math.sin(x + e) - Math.sin(x - e)) / (2 * e);
                        return Math.round(d * 1e6) / 1e6; })() }],
  "math120.1.3":  [{ i: 1, v: (function () {   // n-th derivative of x^n is n!
                        let f = 1; for (let k = 2; k <= 5; k++) f *= k; return f; })() }],
  "math120.1.4":  [{ i: 1, v: (function () {   // d/dx arctan x at x = 2, numerically
                        const x = 2, e = 1e-6;
                        return Math.round(((Math.atan(x + e) - Math.atan(x - e)) / (2 * e)) * 1e6) / 1e6; })() }],
  "math120.1.5":  [{ i: 1, v: (function () {   // d/dx x^x at x = 1, numerically from the definition
                        const f = x => Math.pow(x, x), x = 1, e = 1e-6;
                        return Math.round((f(x + e) - f(x - e)) / (2 * e)); })() }],
  "math120.1.6":  [{ i: 1, v: (function () {   // d/dx e^(x arctan x) at x = 1, by central difference
                        const f = x => Math.exp(x * Math.atan(x)), x = 1, e = 1e-5;
                        return Math.round(((f(x + e) - f(x - e)) / (2 * e)) * 1000) / 1000; })() }],
  "math120.1.7":  [{ i: 1, v: (function () {   // f'(0) for e^(-3x)/sqrt(1+x), numerically, not by the product
                        const f = x => Math.exp(-3 * x) / Math.sqrt(1 + x), e = 1e-6;
                        return Math.round(((f(e) - f(-e)) / (2 * e)) * 1e6) / 1e6; })(),
                    },
                    { i: 2, v: (function () {   // ln(1.1) to 3dp, from the true logarithm
                        return Math.round(Math.log(1.1) * 1000) / 1000; })() }],
  "math120.1.8":  [{ i: 1, v: (function () {   // f''(0)/2 for the same function, by second difference
                        const f = x => Math.exp(-3 * x) / Math.sqrt(1 + x), h = 1e-4;
                        const d2 = (f(h) - 2 * f(0) + f(-h)) / (h * h);
                        return Math.round((d2 / 2) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // critical value of 3x - x^3, found by scanning
                        const f = x => 3 * x - x * x * x; let best = -Infinity;
                        for (let i = 0; i <= 200000; i++) { const x = i / 100000; if (f(x) > best) best = f(x); }
                        return Math.round(best); })() }],
  "math120.1.9":  [{ i: 2, v: (function () {   // min of x/ln x for x > 1, by scanning
                        const f = x => x / Math.log(x); let best = Infinity;
                        for (let i = 1; i <= 400000; i++) { const x = 1 + i / 10000; const y = f(x); if (y < best) best = y; }
                        return Math.round(best * 1000) / 1000; })() }],
  "math120.1.10": [{ i: 1, v: (function () {   // x:y for the least-surface open box, by scanning with V = 1
                        const V = 1, A = x => x * x + 4 * V / x;
                        let bx = 0, best = Infinity;
                        for (let i = 1; i <= 2000000; i++) { const x = i / 100000; const a = A(x); if (a < best) { best = a; bx = x; } }
                        return Math.round(bx / (V / (bx * bx))); })(),
                    },
                    { i: 2, v: (function () {   // least area of the two squares, by scanning the cut
                        const a = x => (x / 4) * (x / 4) + ((1 - x) / 4) * ((1 - x) / 4);
                        let best = Infinity;
                        for (let i = 0; i <= 100000; i++) { const v = a(i / 100000); if (v < best) best = v; }
                        return Math.round(best * 1e5) / 1e5; })() }],
};

let sumNums = 0;
const summaryKeys = Object.keys(D.SUMMARIES || {});
summaryKeys.forEach(k => {
  const s = D.SUMMARIES[k];
  ok(lessonKeys.has(k), "summary " + k + ": keys a lecture that exists");
  ok(!!s.takeaway && s.takeaway.length > 30, "summary " + k + ": takeaway is a real claim");
  ok(!!s.worked && s.worked.length > 30, "summary " + k + ": has a worked pattern");
  ok(!!s.watch && s.watch.length > 20, "summary " + k + ": names the error people make");
  ok(Array.isArray(s.beats) && s.beats.length >= 3,
     "summary " + k + ": has at least 3 beats (has " + ((s.beats || []).length) + ")");
  (s.beats || []).forEach((b, i) => {
    ok(!!b.t && !!b.d, "summary " + k + " beat " + i + ": has a title and a body");
    ok(!b.fig || typeof D.FIG[b.fig] === "function",
       "summary " + k + " beat " + i + ": figure '" + b.fig + "' exists in DAR.FIG");
  });
  (s.concepts || []).forEach(id => ok(ids.has(id), "summary " + k + ": concept '" + id + "' resolves"));
  ok(Array.isArray(s.checks) && s.checks.length >= 1, "summary " + k + ": has at least one check");
  (s.checks || []).forEach((c, i) => {
    const isNum = c.num !== undefined;
    ok(isNum || (Array.isArray(c.opts) && c.opts.length >= 3 && c.a !== undefined),
       "summary " + k + " check " + i + ": is numeric or multiple choice");
    ok(!isNum || c.a === undefined, "summary " + k + " check " + i + ": is not numeric AND multiple choice");
    ok(!!c.expl, "summary " + k + " check " + i + ": has an explanation");
    if (!isNum && Array.isArray(c.opts)) ok(c.a >= 0 && c.a < c.opts.length,
       "summary " + k + " check " + i + ": answer index " + c.a + " is inside opts");
    if (isNum) {
      const want = (expectedSummary[k] || []).find(e => e.i === i);
      ok(!!want, "summary " + k + " check " + i + ": numeric answer is independently checked");
      if (want) {
        sumNums++;
        ok(Math.abs(want.v - c.num) < 1e-9,
           "summary " + k + " check " + i + ": stated " + c.num + ", recomputed " + want.v);
      }
    }
  });
  // Every prose field is injected as raw HTML so KaTeX can see the $...$ — which
  // means a bare "<" before a letter or a slash is parsed as a tag and eats the
  // rest of the sentence. In mathematics write \lt, or leave a space after it.
  [["takeaway", s.takeaway], ["worked", s.worked], ["watch", s.watch]]
    .concat((s.beats || []).map((b, i) => ["beat " + i, b.d]))
    .forEach(([where, text]) => ok(!/<[a-zA-Z/]/.test(text || ""),
       "summary " + k + " " + where + ": no raw '<' — it is injected unescaped"));
});

D.COURSES.forEach(c => {
  ok(!!c.practice && /^https:\/\//.test(c.practice.url), c.code + ": has an https practice source");
  ok(!!c.practice && c.practice.label && c.practice.label.length > 8, c.code + ": practice source says what to do");
});

console.log("\n" + (fail === 0
  ? "PASS — " + checks + " checks, " + numChecked + " numeric answers recomputed, "
    + Object.keys(D.DRILLS || {}).length + " drills, " + D.CONCEPTS.length + " concepts, " + Object.keys(D.FIG).length + " figures, "
    + Object.keys(LAB).length + " interactive, "
    + summaryKeys.length + " lecture summaries (" + sumNums + " numerics recomputed), "
    + tagged + " questions gated (" + untagged + " untagged)"
  : fail + " of " + checks + " checks FAILED"));
process.exit(fail === 0 ? 0 : 1);
