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
 "platform/data/summaries-math130.js",
 "platform/data/summaries-phys100.js",
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
  "math120.1.11": [{ i: 1, v: (function () {   // dx/dt from x(d) = sqrt(d^2 - 900), by the chain rule numerically
                        const x = d => Math.sqrt(d * d - 900), d = 50, e = 1e-6;
                        const dxdd = (x(d + e) - x(d - e)) / (2 * e);
                        return Math.round(Math.abs(dxdd * -80)); })(),
                    },
                    { i: 2, v: (function () {   // dh/dt = 2 / (dV/dh) at h = 5, dV/dh by difference
                        const V = h => (1 / 3) * Math.PI * Math.pow(2 * h / 5, 2) * h, h = 5, e = 1e-6;
                        const dVdh = (V(h + e) - V(h - e)) / (2 * e);
                        return Math.round((2 / dVdh) * 1000) / 1000; })() }],
  "math120.1.12": [{ i: 1, v: (function () {   // the MVT c for x^2 on [1,3], found by scanning for f'(c) = secant slope
                        const f = x => x * x, a = 1, b = 3, e = 1e-6;
                        const sec = (f(b) - f(a)) / (b - a);
                        let bc = 0, gap = Infinity;
                        for (let i = 1; i < 200000; i++) {
                          const c = a + (b - a) * i / 200000;
                          const g = Math.abs((f(c + e) - f(c - e)) / (2 * e) - sec);
                          if (g < gap) { gap = g; bc = c; } }
                        return Math.round(bc); })() }],
  "math120.1.13": [{ i: 1, v: (function () {   // the true cube root, not the tangent-line estimate
                        return Math.round(Math.cbrt(64.1) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the gap between the two antiderivatives, sampled
                        const d = x => 0.5 * Math.sin(x) * Math.sin(x) - (-0.5 * Math.cos(x) * Math.cos(x));
                        const a = d(0.3), b = d(1.7), c = d(2.9);
                        if (Math.abs(a - b) > 1e-12 || Math.abs(b - c) > 1e-12) return NaN;
                        return Math.round(a * 1000) / 1000; })() }],
  "math120.1.14": [{ i: 1, v: (function () {   // y' = -x y from y(0) = 3, integrated by RK4 rather than solved
                        const f = (x, y) => -x * y; let y = 3, x = 0; const h = 1e-4;
                        for (let i = 0; i < 10000; i++) {
                          const k1 = f(x, y), k2 = f(x + h / 2, y + h * k1 / 2);
                          const k3 = f(x + h / 2, y + h * k2 / 2), k4 = f(x + h, y + h * k3);
                          y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += h; }
                        return Math.round(y * 1000) / 1000; })() }],
  "math120.1.15": [{ i: 1, v: (function () {   // area under x^2 on [0,3] by midpoint Riemann sum, not by b^3/3
                        const f = x => x * x, a = 0, b = 3, n = 4000000, h = (b - a) / n;
                        let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h) * h;
                        return Math.round(s); })(),
                    },
                    { i: 2, v: (function () {   // sum of squares over n^3, evaluated directly at large n
                        const n = 4000000; let s = 0;
                        for (let i = 1; i <= n; i++) s += (i / n) * (i / n) * (1 / n);
                        return Math.round(s * 1000) / 1000; })() }],
  "math120.1.16": [{ i: 1, v: (function () {   // one hump of sine, by Simpson rather than by -cos
                        const f = Math.sin, a = 0, b = Math.PI, n = 100000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round(s * h / 3); })(),
                    },
                    { i: 2, v: (function () {   // the substitution example, integrated in x directly
                        const f = x => Math.pow(x * x * x + 2, 5) * x * x;
                        const a = 1, b = 2, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.17": [{ i: 1, v: (function () {   // integral of 1/(1+x) on [0,4] by Simpson, not as ln 5
                        const f = x => 1 / (1 + x), a = 0, b = 4, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.18": [{ i: 1, v: (function () {   // the area by VERTICAL slices, the decomposition the summary calls the hard way
                        const simp = (f, a, b, n) => { const h = (b - a) / n; let s = f(a) + f(b);
                          for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        const left = simp(x => 2 * Math.sqrt(x), 0, 1, 200000);
                        const right = simp(x => Math.sqrt(x) - (x - 2), 1, 4, 200000);
                        return Math.round((left + right) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the Gaussian tail, by Simpson out to where it is negligible
                        const f = t => Math.exp(-t * t), a = 0, b = 10, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.19": [{ i: 1, v: (function () {   // ball of radius 3 by the disk integral, not by 4/3 pi a^3
                        const a = 3, f = x => Math.PI * (2 * a * x - x * x);
                        const lo = 0, hi = 2 * a, n = 200000, h = (hi - lo) / n;
                        let s = f(lo) + f(hi);
                        for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the cauldron by HORIZONTAL disks in y, where the summary used shells in x
                        const f = y => Math.PI * y, lo = 0, hi = 1, n = 200000, h = (hi - lo) / n;
                        let s = f(lo) + f(hi);
                        for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.20": [{ i: 1, v: (function () {   // mean of sin over [0,pi] by Simpson, not as 2/pi
                        const f = Math.sin, a = 0, b = Math.PI, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round(((s * h / 3) / Math.PI) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the weighted mean temperature, both integrals done numerically
                        const simp = (f, a, b, n) => { const h = (b - a) / n; let s = f(a) + f(b);
                          for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        const top = simp(y => (100 - 30 * y) * Math.PI * y, 0, 1, 200000);
                        const bot = simp(y => Math.PI * y, 0, 1, 200000);
                        return Math.round(top / bot); })() }],
  "math120.1.21": [{ i: 1, v: (function () {   // the annulus probability from the SHELL integral, not from powers of 1/2
                        const simp = (f, lo, hi, n) => { const h = (hi - lo) / n; let s = f(lo) + f(hi);
                          for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        const a = Math.sqrt(Math.log(2));          // from e^(-a^2) = 1/2
                        const w = r => 2 * Math.PI * r * Math.exp(-r * r);
                        return Math.round((simp(w, 2 * a, 3 * a, 200000) / simp(w, 0, 40, 400000)) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // two hours of twelve of that same integral
                        const simp = (f, lo, hi, n) => { const h = (hi - lo) / n; let s = f(lo) + f(hi);
                          for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        const a = Math.sqrt(Math.log(2));
                        const w = r => 2 * Math.PI * r * Math.exp(-r * r);
                        const band = simp(w, 2 * a, 3 * a, 200000) / simp(w, 0, 40, 400000);
                        return Math.round((band * 2 / 12) * 1000) / 1000; })() }],
  "math120.1.22": [{ i: 1, v: (function () {   // the trapezoid as the MEAN of the two Riemann sums, not from the y0/2 pattern
                        const y = x => 1 / x, dx = 0.5;
                        const L = dx * (y(1) + y(1.5)), R = dx * (y(1.5) + y(2));
                        return Math.round(((L + R) / 2) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // Simpson by fitting the parabola through the three points and integrating it exactly
                        const pts = [[1, 1], [1.5, 2 / 3], [2, 0.5]];
                        // Lagrange -> coefficients of a x^2 + b x + c
                        let A = 0, B = 0, C = 0;
                        for (let i = 0; i < 3; i++) {
                          const [xi, yi] = pts[i];
                          const [xj] = pts[(i + 1) % 3], [xk] = pts[(i + 2) % 3];
                          const d = (xi - xj) * (xi - xk);
                          A += yi / d; B += yi * (-(xj + xk)) / d; C += yi * (xj * xk) / d; }
                        const F = x => A * x * x * x / 3 + B * x * x / 2 + C * x;
                        return Math.round((F(2) - F(1)) * 1000) / 1000; })() }],
  "math120.1.23": [{ i: 1, v: (function () {   // sin^2 cos^2 over a quarter period, by quadrature on the raw integrand
                        const f = x => Math.pow(Math.sin(x), 2) * Math.pow(Math.cos(x), 2);
                        const a = 0, b = Math.PI / 2, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the tab's area straight from sqrt(25 - y^2), no trig substitution
                        const f = y => Math.sqrt(25 - y * y), a = 0, b = 3, n = 400000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.24": [{ i: 1, v: (function () {   // sec^4 by quadrature on 1/cos^4, not via tan + tan^3/3
                        const f = t => 1 / Math.pow(Math.cos(t), 4);
                        const a = 0, b = Math.PI / 4, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the same integral straight in x, no trig substitution at all
                        const f = x => 1 / (x * x * Math.sqrt(1 + x * x));
                        const a = 1, b = 2, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.25": [{ i: 1, v: (function () {   // the cover-up coefficient as a numerical limit of (x+2)f(x)
                        const f = x => (x * x + 2) / ((x - 1) * (x - 1) * (x + 2));
                        const e = 1e-7, x = -2 + e;
                        return Math.round(((x + 2) * f(x)) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the definite integral by quadrature on the undecomposed fraction
                        const f = x => (4 * x - 1) / (x * x + x - 2);
                        const a = 2, b = 3, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.26": [{ i: 1, v: (function () {   // (ln y)^2 by quadrature, not via the reduction formula
                        const f = y => Math.pow(Math.log(y), 2);
                        const a = 1, b = Math.E, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // x e^x by quadrature, not via G1
                        const f = x => x * Math.exp(x), a = 0, b = 1, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round(s * h / 3); })() }],
  "math120.1.27": [{ i: 1, v: (function () {   // arc length by quadrature on sqrt(1 + 4x^2), not via the log formula
                        const f = x => Math.sqrt(1 + 4 * x * x);
                        const a = 0, b = 1, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // sphere area from the ANGLE parametrisation, where ds = a dtheta
                        const a = 2, f = t => 2 * Math.PI * (a * Math.sin(t)) * a;
                        const lo = 0, hi = Math.PI, n = 200000, h = (hi - lo) / n;
                        let s = f(lo) + f(hi);
                        for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.28": [{ i: 1, v: (function () {   // ellipse perimeter from the RECTANGULAR arc-length element, not the parametrisation
                        // y = sqrt(1 - x^2/4) on a quarter arc, ds = sqrt(1 + y'^2) dx, times 4
                        const yp = x => -x / (4 * Math.sqrt(1 - x * x / 4));
                        const f = x => Math.sqrt(1 + yp(x) * yp(x));
                        const lo = 0, hi = 2 - 1e-9, n = 4000000, h = (hi - lo) / n;
                        let s = 0;                                   // midpoint, to dodge the endpoint singularity
                        for (let i = 0; i < n; i++) s += f(lo + (i + 0.5) * h) * h;
                        return Math.round(4 * s * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // ellipsoid area by midpoint sum on the parametric integrand
                        const g = t => 2 * Math.PI * 2 * Math.sin(t) *
                                       Math.sqrt(4 * Math.cos(t) * Math.cos(t) + Math.sin(t) * Math.sin(t));
                        const n = 4000000, h = Math.PI / n; let s = 0;
                        for (let i = 0; i < n; i++) s += g((i + 0.5) * h) * h;
                        return Math.round(s * 1000) / 1000; })() }],
  "math120.1.29": [{ i: 1, v: (function () {   // one rose petal by quadrature on (1/2) r^2, not via pi/8
                        const f = t => 0.5 * Math.pow(Math.sin(2 * t), 2);
                        const a = 0, b = Math.PI / 2, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // x arctan x by quadrature, not by parts
                        const f = x => x * Math.atan(x), a = 0, b = 1, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.30": [{ i: 1, v: (function () {   // the limit by direct numerical evaluation, not by differentiating twice
                        const f = x => (Math.cos(x) - 1) / (x * x);
                        const a = f(1e-4), b = f(1e-5);
                        if (Math.abs(a - b) > 1e-6) return NaN;      // must have settled
                        return Math.round(b * 10) / 10; })(),
                    },
                    { i: 2, v: (function () {   // likewise, straight from the quotient at small x
                        const f = x => Math.sin(5 * x) / Math.sin(2 * x);
                        const a = f(1e-5), b = f(1e-6);
                        if (Math.abs(a - b) > 1e-6) return NaN;
                        return Math.round(b * 10) / 10; })() }],
  "math120.1.31": [{ i: 1, v: (function () {   // substitute x = 1/t to pull the infinite tail onto [0,1], then sum it
                        // integral 1..inf of x^(-3/2) dx becomes integral 0..1 of t^(-1/2) dt
                        const f = t => 1 / Math.sqrt(t), n = 8000000, h = 1 / n;
                        let s = 0; for (let i = 0; i < n; i++) s += f((i + 0.5) * h) * h;
                        return Math.round(s * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // e^(-4x) by quadrature out to where it is under 1e-50
                        const f = x => Math.exp(-4 * x), a = 0, b = 30, n = 300000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],
  "math120.1.32": [{ i: 1, v: (function () {   // the Basel sum added up directly, not quoted as pi^2/6
                        let s = 0; for (let n = 20000000; n >= 1; n--) s += 1 / (n * n);
                        return Math.round(s * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the geometric sum added up term by term, not via 1/(1-a)
                        let s = 0, t = 1; for (let n = 0; n < 200; n++) { s += t; t /= 3; }
                        return Math.round(s * 1000) / 1000; })() }],
  "math120.1.33": [{ i: 1, v: (function () {   // e from the LIMIT definition (1 + 1/n)^n, not from the factorial series
                        const n = 1e9;
                        return Math.round(Math.pow(1 + 1 / n, n) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the first N whose harmonic sum reaches 4, by summing
                        let s = 0; for (let n = 1; n <= 1000; n++) { s += 1 / n; if (s >= 4) return n; }
                        return NaN; })() }],
  "math120.1.34": [{ i: 1, v: (function () {   // ln 1.5 from the logarithm itself, not from the alternating series
                        return Math.round(Math.log(1.5) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // erf(1) by quadrature on e^(-t^2), not by the series
                        const f = t => Math.exp(-t * t), a = 0, b = 1, n = 200000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((2 / Math.sqrt(Math.PI)) * (s * h / 3) * 1000) / 1000; })() }],

  // MATH 130 — probability. These recompute by ENUMERATION or simulation, never
  // by re-evaluating the combinatorial formula the summary derives.
  "math130.0.0": [{ i: 1, v: (function () {   // full house by walking all 2,598,960 five-card hands
                        const rank = c => (c / 4) | 0;
                        let full = 0, total = 0;
                        for (let a = 0; a < 52; a++) for (let b = a + 1; b < 52; b++)
                        for (let c = b + 1; c < 52; c++) for (let d = c + 1; d < 52; d++)
                        for (let e = d + 1; e < 52; e++) {
                          total++;
                          const n = {};
                          for (const x of [a, b, c, d, e]) { const r = rank(x); n[r] = (n[r] || 0) + 1; }
                          const counts = Object.values(n).sort();
                          if (counts.length === 2 && counts[0] === 2 && counts[1] === 3) full++; }
                        return Math.round((full / total) * 1e5) / 1e5; })(),
                    },
                    { i: 2, v: (function () {   // multisets of size 3 from 10, counted by listing them
                        let n = 0;
                        for (let a = 0; a < 10; a++) for (let b = a; b < 10; b++) for (let c = b; c < 10; c++) n++;
                        return n; })() }],
  "math130.0.1": [{ i: 1, v: (function () {   // enumerate 10-bit masks, count the splits, halve the double count
                        let half = 0;
                        for (let m = 0; m < 1024; m++) {
                          let bits = 0; for (let i = 0; i < 10; i++) if (m & (1 << i)) bits++;
                          if (bits === 5) half++; }
                        return half / 2; })(),
                    },
                    { i: 2, v: (function () {   // 5-subsets of 8 listed directly, not via the Vandermonde sum
                        let n = 0;
                        for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) for (let c = b + 1; c < 8; c++)
                        for (let d = c + 1; d < 8; d++) for (let e = d + 1; e < 8; e++) n++;
                        return n; })() }],
  // A simulation was tried here first and rejected: the true value 0.50730 sits
  // about 1.8 standard errors from the 0.5075 rounding boundary even at twenty
  // million trials, so the gate would have failed a few runs in a hundred. A
  // gate that is flaky is worse than one that is absent. This counts exactly
  // instead, by a different decomposition than the summary's: choose WHICH 23
  // days are used, then assign the people to them, in exact integer arithmetic.
  "math130.0.2": [{ i: 1, v: (function () {
                        const C = (n, k) => { let r = 1n; for (let i = 0n; i < BigInt(k); i++)
                          r = r * (BigInt(n) - i) / (i + 1n); return r; };
                        let ways = C(365, 23);                      // which days are occupied
                        for (let i = 1n; i <= 23n; i++) ways *= i;   // assign the 23 people to them
                        let total = 1n; for (let i = 0; i < 23; i++) total *= 365n;
                        const noMatch = Number(ways * 1000000n / total) / 1000000;
                        return Math.round((1 - noMatch) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // 1 - D_n/n! by the derangement RECURRENCE, not the inclusion-exclusion sum
                        let a = 1, b = 0;                           // d_n = D_n/n!, d_0 = 1, d_1 = 0
                        for (let n = 2; n <= 52; n++) { const d = (n - 1) / n * b + a / n; a = b; b = d; }
                        return Math.round((1 - b) * 1000) / 1000; })() }],
  "math130.0.3": [{ i: 1, v: (function () {   // all 6^6 outcomes walked, rather than 1 - (5/6)^6
                        let hits = 0, total = 0;
                        for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++)
                        for (let d = 1; d <= 6; d++) for (let e = 1; e <= 6; e++) for (let f = 1; f <= 6; f++) {
                          total++;
                          if (a === 6 || b === 6 || c === 6 || d === 6 || e === 6 || f === 6) hits++; }
                        return Math.round((hits / total) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // the count of sixes built up die by die, never using the binomial formula
                        let dist = [1];
                        for (let i = 0; i < 18; i++) {
                          const next = new Array(dist.length + 1).fill(0);
                          for (let k = 0; k < dist.length; k++) {
                            next[k] += dist[k] * 5 / 6;             // this die is not a six
                            next[k + 1] += dist[k] * 1 / 6; }       // this die is a six
                          dist = next; }
                        return Math.round((1 - (dist[0] + dist[1] + dist[2])) * 1000) / 1000; })() }],
  "math130.0.4": [{ i: 1, v: (function () {   // count a synthetic population in integers, the lecture's own intuition, not Bayes' rule
                        const N = 100000000, ill = N / 100, well = N - ill;
                        const truePos = ill * 95 / 100, falsePos = well * 5 / 100;
                        return Math.round((truePos / (truePos + falsePos)) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // every two-card hand enumerated; no symmetry argument used
                        const AS = 0;                               // cards 0..51, ranks are card/4, ace of spades is 0
                        let withAS = 0, bothAces = 0;
                        for (let a = 0; a < 52; a++) for (let b = a + 1; b < 52; b++) {
                          if (a !== AS && b !== AS) continue;
                          withAS++;
                          if (((a / 4) | 0) === 0 && ((b / 4) | 0) === 0) bothAces++; }
                        return Math.round((bothAces / withAS) * 1000) / 1000; })() }],
  "math130.0.5": [{ i: 1, v: (function () {   // switching wins iff the first guess was wrong: count the 9 (car, guess) pairs
                        let wins = 0, total = 0;                    // no tree, no law of total probability
                        for (let car = 1; car <= 3; car++) for (let guess = 1; guess <= 3; guess++) {
                          total++; if (car !== guess) wins++; }
                        return Math.round((wins / total) * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // Dr Nick's rate as a weighted average of his two conditionals, not by summing cells
                        const pHeart = 10 / 100, pBand = 90 / 100;
                        return Math.round((pHeart * (2 / 10) + pBand * (81 / 90)) * 100) / 100; })() }],
  "math130.0.6": [{ i: 1, v: (function () {   // solve the tridiagonal RECURSION by elimination, never the closed form
                        const p = 0.49, q = 0.51, N = 100;
                        // p_i - p*p_{i+1} - q*p_{i-1} = 0 for 1..N-1, with p_0 = 0 and p_N = 1.
                        // Forward sweep: write p_i = c_i * p_{i+1} + d_i, then back-substitute.
                        const c = new Array(N).fill(0), d = new Array(N).fill(0);
                        for (let i = 1; i < N; i++) {
                          const denom = 1 - q * c[i - 1];
                          c[i] = p / denom;
                          d[i] = q * d[i - 1] / denom; }
                        const a = new Array(N + 1).fill(0); a[N] = 1;
                        for (let i = N - 1; i >= 1; i--) a[i] = c[i] * a[i + 1] + d[i];
                        return Math.round(a[50] * 1000) / 1000; })(),
                    },
                    { i: 2, v: (function () {   // Bin(7, 1/2) at k = 3 by enumerating all 128 outcome strings
                        let hits = 0, total = 0;
                        for (let m = 0; m < 128; m++) {
                          let ones = 0; for (let b = 0; b < 7; b++) if (m & (1 << b)) ones++;
                          total++; if (ones === 3) hits++; }
                        return Math.round((hits / total) * 10000) / 10000; })() }],

  // The hypergeometric, recomputed as a SEQUENTIAL draw: deal five cards one at a
  // time and carry the distribution of the ace count forward with the conditional
  // probabilities of the moment. Never the binomial-coefficient PMF the summary derives.
  "math130.0.7": [{ i: 1, v: (function () {
                        let cur = [1];
                        for (let i = 0; i < 5; i++) {
                          const nx = new Array(i + 2).fill(0);
                          for (let j = 0; j <= i; j++) {
                            if (!cur[j]) continue;
                            const aces = 4 - j, left = 52 - i;
                            nx[j + 1] += cur[j] * aces / left;
                            nx[j] += cur[j] * (left - aces) / left; }
                          cur = nx; }
                        return Math.round(cur[2] * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // the same count WITH replacement, by convolving five Bernoullis
                        let b = [1];
                        for (let i = 0; i < 5; i++) {
                          const nx = new Array(i + 2).fill(0);
                          for (let j = 0; j <= i; j++) {
                            nx[j + 1] += b[j] * (1 / 13);
                            nx[j] += b[j] * (12 / 13); }
                          b = nx; }
                        return Math.round(b[2] * 10000) / 10000; })() }],

  "math130.0.8": [{ i: 1, v: (function () {   // the same sequential deal, now averaged — not indicators and symmetry
                        let cur = [1];
                        for (let i = 0; i < 5; i++) {
                          const nx = new Array(i + 2).fill(0);
                          for (let j = 0; j <= i; j++) {
                            if (!cur[j]) continue;
                            const aces = 4 - j, left = 52 - i;
                            nx[j + 1] += cur[j] * aces / left;
                            nx[j] += cur[j] * (left - aces) / left; }
                          cur = nx; }
                        let e = 0; for (let j = 0; j < cur.length; j++) e += j * cur[j];
                        return Math.round(e * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // E(X) = sum of the tail probabilities P(X >= k), not q/p and not the derivative trick
                        let e = 0;
                        for (let k = 1; k <= 2000; k++) e += Math.pow(0.8, k);
                        return Math.round(e * 1000) / 1000; })() }],

  "math130.0.9": [{ i: 0, v: (function () {   // walk all 5040 permutations of 1..7 and count the local maxima
                        const out = [];
                        (function rec(rest, acc) {
                          if (!rest.length) { out.push(acc); return; }
                          for (let i = 0; i < rest.length; i++) {
                            const r = rest.slice(); const x = r.splice(i, 1)[0];
                            rec(r, acc.concat([x])); } })([1, 2, 3, 4, 5, 6, 7], []);
                        let total = 0;
                        out.forEach(perm => {
                          for (let i = 0; i < 7; i++) {
                            const l = i > 0 ? perm[i - 1] : -1, r = i < 6 ? perm[i + 1] : -1;
                            if (perm[i] > l && perm[i] > r) total++; } });
                        return Math.round((total / out.length) * 1000) / 1000; })() },
                   { i: 1, v: (function () {   // sum n against the negative binomial PMF directly — the route the lecture avoids
                        const r = 3, p = 0.4, q = 0.6;
                        let pmf = Math.pow(p, r), e = 0;
                        for (let n = 0; n <= 5000; n++) { e += n * pmf; pmf = pmf * q * (n + r) / (n + 1); }
                        return Math.round(e * 1000) / 1000; })() }],

  "math130.0.10": [{ i: 0, v: (function () {   // count the triplets one by one, and take the exponential from its series
                        let triples = 0;
                        for (let i = 1; i <= 100; i++) for (let j = i + 1; j <= 100; j++) triples += 100 - j;
                        const lam = triples / (365 * 365);
                        let e = 0, term = 1;
                        for (let n = 0; n < 200; n++) { e += term; term = term * (-lam) / (n + 1); }
                        return Math.round((1 - e) * 1000) / 1000; })() },
                   { i: 1, v: (function () {   // the EXACT binomial, by convolving 1000 Bernoullis — never the Poisson limit
                        let d = [1];
                        for (let i = 0; i < 1000; i++) {
                          const nx = new Array(Math.min(i + 2, 8)).fill(0);
                          for (let j = 0; j < d.length && j < 7; j++) {
                            nx[j + 1] += d[j] * 0.002;
                            nx[j] += d[j] * 0.998; }
                          d = nx; }
                        return Math.round(d[3] * 10000) / 10000; })() }],

  // Continuous distributions recompute by Simpson quadrature on the density, which
  // is the pattern already used across MATH 120: exact to far more places than the
  // check states, and a different route from the closed forms the summary derives.
  "math130.0.11": [{ i: 1, v: (function () {   // integrate (x - 1/2)^2 — the definition of variance, not E(X^2) - (EX)^2
                        const f = x => (x - 0.5) * (x - 0.5), n = 2000, h = 1 / n;
                        let s = f(0) + f(1);
                        for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // integrate the exponential DENSITY over [0,1], never 1 - e^{-1}
                        const f = x => Math.exp(-x), n = 2000, h = 1 / n;
                        let s = f(0) + f(1);
                        for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() }],

  // Batch two. Simpson on densities throughout, as for 0.11 — but each quantity is
  // reached by the route the summary does NOT use: brute quadrature where the
  // lecture squares an integral into polar coordinates, enumeration where it
  // expands indicators, inclusion–exclusion where it sums a harmonic series.
  "math130.0.12": [{ i: 1, v: (function () {   // integrate e^{-z^2/2} on the line directly, never via polar coordinates
                        const f = z => Math.exp(-z * z / 2), a = -12, b = 12, n = 4000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // Phi(1) as area under the density from -12 up to 1
                        const f = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI), a = -12, b = 1, n = 4000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() }],

  "math130.0.13": [{ i: 1, v: (function () {   // area of the standard normal density over [-2, 2]
                        const f = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI), a = -2, b = 2, n = 2000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // walk all 1024 outcome strings of ten trials, not npq and not the indicator expansion
                        let m1 = 0, m2 = 0;
                        for (let m = 0; m < 1024; m++) {
                          let k = 0, pr = 1;
                          for (let b = 0; b < 10; b++) { if (m & (1 << b)) { k++; pr *= 0.3; } else pr *= 0.7; }
                          m1 += k * pr; m2 += k * k * pr; }
                        return Math.round((m2 - m1 * m1) * 1000) / 1000; })() }],

  "math130.0.14": [{ i: 1, v: (function () {   // E(T) = sum of P(T > t), with P(T > t) by inclusion–exclusion over missing types
                        const n = 6, C = (a, b) => { let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return r; };
                        let e = 0;
                        for (let t = 0; t < 3000; t++) {
                          let p = 0;
                          for (let j = 1; j <= n; j++) p += (j % 2 ? 1 : -1) * C(n, j) * Math.pow(1 - j / n, t);
                          e += p; }
                        return Math.round(e * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // integrate e^{u^2} term by term: sum of 1 / (n! (2n+1))
                        let s = 0, fact = 1;
                        for (let n = 0; n < 30; n++) { if (n > 0) fact *= n; s += 1 / (fact * (2 * n + 1)); }
                        return Math.round(s * 10000) / 10000; })() }],

  "math130.0.15": [{ i: 1, v: (function () {   // a ratio of two areas under the density, not the memoryless shortcut
                        const f = x => 0.5 * Math.exp(-0.5 * x);
                        const area = (a, b) => { const n = 20000, h = (b - a) / n; let s = f(a) + f(b);
                          for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        return Math.round((area(3, 120) / area(1, 120)) * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // integrate (x - 1/2)^2 against the Expo(2) density, not 1/lambda^2
                        const f = x => (x - 0.5) * (x - 0.5) * 2 * Math.exp(-2 * x), a = 0, b = 40, n = 20000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],

  "math130.0.16": [{ i: 1, v: (function () {   // Bayes by quadrature: integral of p * p^100 over integral of p^100
                        const area = g => { const n = 4000, h = 1 / n; let s = g(0) + g(1);
                          for (let i = 1; i < n; i++) s += g(i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        return Math.round((area(p => Math.pow(p, 101)) / area(p => Math.pow(p, 100))) * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // E(e^Z) by integrating e^z against the density, never by completing the square
                        const f = z => Math.exp(z - z * z / 2) / Math.sqrt(2 * Math.PI), a = -15, b = 15, n = 6000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() }],

  // Batch three. Joint distributions invite 2-D Simpson and enumeration; the
  // summaries reach their numbers through series, symmetry, stories and closed
  // forms, so each check below is reached some other way.
  "math130.0.17": [{ i: 1, v: (function () {   // integrate z^6 against the density, not the MGF series
                        const f = z => Math.pow(z, 6) * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI), a = -15, b = 15, n = 6000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // integrate y^3 against the Expo(2) density, not n!/lambda^n
                        const f = y => y * y * y * 2 * Math.exp(-2 * y), a = 0, b = 40, n = 20000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 1000) / 1000; })() }],

  "math130.0.18": [{ i: 1, v: (function () {   // 2-D Simpson of |x - y| over the whole square, no splitting and no symmetry
                        const n = 400, h = 1 / n, w = i => (i === 0 || i === n) ? 1 : (i % 2 ? 4 : 2);
                        let s = 0;
                        for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) s += w(i) * w(j) * Math.abs(i - j) * h;
                        return Math.round((s * h * h / 9) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // area of the strip by plane geometry — the disc minus two circular segments
                        const d = 0.5, segment = Math.acos(d) - d * Math.sqrt(1 - d * d);
                        return Math.round(((Math.PI - 2 * segment) / Math.PI) * 1000) / 1000; })() }],

  "math130.0.19": [{ i: 1, v: (function () {   // walk all 3^4 = 81 category sequences, never the multinomial coefficient
                        const p = [0.5, 0.3, 0.2];
                        let s = 0;
                        for (let m = 0; m < 81; m++) {
                          const c = [0, 0, 0]; let x = m, pr = 1;
                          for (let k = 0; k < 4; k++) { const r = x % 3; x = (x - r) / 3; c[r]++; pr *= p[r]; }
                          if (c[0] === 2 && c[1] === 1 && c[2] === 1) s += pr; }
                        return Math.round(s * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // P(X <= 2|Y|) by nested quadrature over two normals — never the Cauchy density
                        const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
                        const simp = (f, a, b, n) => { const h = (b - a) / n; let s = f(a) + f(b);
                          for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        const Phi = x => simp(phi, -12, x, 800);
                        return Math.round(simp(y => phi(y) * Phi(2 * Math.abs(y)), -10, 10, 800) * 10000) / 10000; })() }],

  "math130.0.20": [{ i: 1, v: (function () {   // E(X1 X2) - E(X1)E(X2) summed over the whole trinomial table, not by lumping
                        const n = 10, p1 = 0.2, p2 = 0.3, p3 = 0.5;
                        const fact = k => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
                        let e1 = 0, e2 = 0, e12 = 0;
                        for (let a = 0; a <= n; a++) for (let b = 0; a + b <= n; b++) {
                          const c = n - a - b;
                          const pr = fact(n) / (fact(a) * fact(b) * fact(c)) * Math.pow(p1, a) * Math.pow(p2, b) * Math.pow(p3, c);
                          e1 += a * pr; e2 += b * pr; e12 += a * b * pr; }
                        return Math.round((e12 - e1 * e2) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // sequential draw, carrying the distribution of the white count ball by ball
                        let cur = [1];
                        for (let i = 0; i < 5; i++) {
                          const nx = new Array(i + 2).fill(0);
                          for (let j = 0; j <= i; j++) {
                            if (!cur[j]) continue;
                            const white = 5 - j, left = 20 - i;
                            nx[j + 1] += cur[j] * white / left;
                            nx[j] += cur[j] * (left - white) / left; }
                          cur = nx; }
                        let m1 = 0, m2 = 0; cur.forEach((p, j) => { m1 += j * p; m2 += j * j * p; });
                        return Math.round((m2 - m1 * m1) * 1000) / 1000; })() }],

  "math130.0.21": [{ i: 1, v: (function () {   // build a concrete assignment and average the overlap over all 105 pairs
                        const C = []; for (let c = 0; c < 15; c++) C.push(new Set());
                        for (let i = 0; i < 100; i++) for (let k = 0; k < 3; k++) C[(3 * i + k) % 15].add(i);
                        let total = 0, pairs = 0;
                        for (let a = 0; a < 15; a++) for (let b = a + 1; b < 15; b++) {
                          C[a].forEach(x => { if (C[b].has(x)) total++; }); pairs++; }
                        return Math.round((total / pairs) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // integrate the log-normal density itself from 0 to 2, not Phi(ln 2)
                        const f = y => Math.exp(-(Math.log(y) * Math.log(y)) / 2) / (y * Math.sqrt(2 * Math.PI)), a = 1e-12, b = 2, n = 20000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() }],

  // Batch four. Beta and Gamma quantities by quadrature, never via the Gamma-function
  // identities the lectures derive; waiting times by propagating the distribution
  // of a small Markov chain, never by first-step equations.
  "math130.0.22": [{ i: 1, v: (function () {   // Bayes by quadrature: integral of p * likelihood * prior over the same without p
                        const simp = (f, n) => { const h = 1 / n; let s = f(0) + f(1);
                          for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        const post = p => Math.pow(p, 7) * Math.pow(1 - p, 3) * p * (1 - p);   // Bin likelihood x Beta(2,2) kernel
                        return Math.round((simp(p => p * post(p), 2000) / simp(post, 2000)) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // integrate the polynomial numerically, not by billiard balls
                        const f = x => 10 * x * x * Math.pow(1 - x, 3), n = 2000, h = 1 / n;
                        let s = f(0) + f(1);
                        for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() }],

  "math130.0.23": [{ i: 1, v: (function () {   // Gamma(1/2) as 2 * integral of e^{-u^2} on [0, 12], by Simpson
                        const f = u => Math.exp(-u * u), a = 0, b = 12, n = 4000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((2 * s * h / 3) * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // integrate the Gamma(3, 2) density over [0, 1], not the Poisson count
                        const f = t => 8 * t * t * Math.exp(-2 * t) / 2, n = 2000, h = 1 / n;
                        let s = f(0) + f(1);
                        for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() }],

  "math130.0.24": [{ i: 1, v: (function () {   // integrate the Beta(3,3) density to 0.4, not the binomial tail
                        const f = x => 30 * x * x * (1 - x) * (1 - x), a = 0, b = 0.4, n = 2000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // one over the numerical integral of x^2 (1-x)^3, not the Gamma ratio
                        const f = x => x * x * Math.pow(1 - x, 3), n = 2000, h = 1 / n;
                        let s = f(0) + f(1);
                        for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2);
                        return Math.round((1 / (s * h / 3)) * 1000) / 1000; })() }],

  "math130.0.25": [{ i: 1, v: (function () {   // push probability mass through the HH chain flip by flip, sum t * P(done at t)
                        let none = 1, lastH = 0, e = 0;
                        for (let t = 1; t <= 400; t++) {
                          const done = 0.5 * lastH;
                          e += t * done;
                          [none, lastH] = [0.5 * none + 0.5 * lastH, 0.5 * none]; }
                        return Math.round(e * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // ratio of Poisson products, P(X=4)P(Y=6) over the sum across all splits
                        const pm = (k, l) => { let r = Math.exp(-l); for (let i = 1; i <= k; i++) r *= l / i; return r; };
                        let d = 0; for (let k = 0; k <= 10; k++) d += pm(k, 3) * pm(10 - k, 3);
                        return Math.round((pm(4, 3) * pm(6, 3) / d) * 10000) / 10000; })() }],

  // Batch five. Conditional expectation and limit theorems invite shortcuts —
  // Adam, Eve, independence, Phi tables — so each check is reached the long way:
  // nested quadrature over the joint set-up, exact convolution, or an integral
  // over the region the event describes.
  "math130.0.26": [{ i: 1, v: (function () {   // integrate y over the joint density 1/x on 0 < y < x < 1, never Adam's law
                        const simp = (f, a, b, n) => { const h = (b - a) / n; let s = f(a) + f(b);
                          for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        return Math.round(simp(x => simp(y => y / x, 0, x, 200), 1e-9, 1, 400) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // build the beta-binomial PMF by quadrature and take its variance, never Eve's law
                        const simp = (f, n) => { const h = 1 / n; let s = f(0) + f(1);
                          for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        const C = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return r; };
                        let m1 = 0, m2 = 0;
                        for (let k = 0; k <= 10; k++) {
                          const p = C(10, k) * simp(q => Math.pow(q, k) * Math.pow(1 - q, 10 - k) * 12 * q * (1 - q) * (1 - q), 2000);
                          m1 += k * p; m2 += k * k * p; }
                        return Math.round((m2 - m1 * m1) * 1000) / 1000; })() }],

  "math130.0.27": [{ i: 1, v: (function () {   // P(X <= 7) as P(T_8 > 4) for a Gamma(8,1) arrival time, not a PMF sum
                        const f = t => Math.pow(t, 7) * Math.exp(-t) / 5040, a = 4, b = 80, n = 20000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((Math.exp(-4) + 1 - s * h / 3) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // integrate (1/x) against the Unif(1,3) density
                        const f = x => 0.5 / x, a = 1, b = 3, n = 2000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() }],

  "math130.0.28": [{ i: 1, v: (function () {   // exact Bin(100, 1/2) by convolving 100 fair Bernoullis
                        let d = [1];
                        for (let i = 0; i < 100; i++) {
                          const nx = new Array(i + 2).fill(0);
                          for (let j = 0; j <= i; j++) { nx[j + 1] += d[j] * 0.5; nx[j] += d[j] * 0.5; }
                          d = nx; }
                        let s = 0; for (let k = 60; k <= 100; k++) s += d[k];
                        return Math.round(s * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // area under the standard normal density beyond 1.9
                        const f = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI), a = 1.9, b = 12, n = 4000, h = (b - a) / n;
                        let s = f(a) + f(b);
                        for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
                        return Math.round((s * h / 3) * 10000) / 10000; })() }],

  "math130.0.29": [{ i: 1, v: (function () {   // integrate the bivariate normal over the disc of radius sqrt 2, never the chi-square
                        const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
                        const simp = (f, a, b, n) => { const h = (b - a) / n; let s = f(a) + f(b);
                          for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        const r = Math.SQRT2;   // x = r sin(theta) removes the square-root endpoints
                        return Math.round(simp(t => phi(r * Math.sin(t)) * 2 * simp(phi, 0, r * Math.cos(t), 200) * r * Math.cos(t),
                          -Math.PI / 2, Math.PI / 2, 400) * 10000) / 10000; })() },
                   { i: 2, v: (function () {   // integrate the joint density over the wedge |y| < x, not by independence
                        const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
                        const simp = (f, a, b, n) => { const h = (b - a) / n; let s = f(a) + f(b);
                          for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
                        return Math.round(simp(x => phi(x) * simp(phi, -x, x, 200), 0, 10, 400) * 1000) / 1000; })() }],

  // Batch six. Markov chain quantities by iteration where the summary solves an
  // equation, and by elimination where the summary iterates; the survey's slope by
  // gradient descent on squared error rather than the covariance formula.
  "math130.0.30": [{ i: 1, v: (function () {   // walk every two-step path 1 -> k -> 3 explicitly
                        const Q = [[1/3, 2/3, 0, 0], [1/2, 0, 1/2, 0], [0, 0, 0, 1], [1/2, 0, 1/4, 1/4]];
                        let p = 0; for (let k = 0; k < 4; k++) p += Q[0][k] * Q[k][2];
                        return Math.round(p * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // run the chain from state 1 until it settles, never solve sQ = s
                        const Q = [[1/3, 2/3, 0, 0], [1/2, 0, 1/2, 0], [0, 0, 0, 1], [1/2, 0, 1/4, 1/4]];
                        let s = [1, 0, 0, 0];
                        for (let t = 0; t < 5000; t++) {
                          const n = [0, 0, 0, 0];
                          for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) n[j] += s[i] * Q[i][j];
                          s = n; }
                        return Math.round(s[0] * 1000) / 1000; })() }],

  "math130.0.31": [{ i: 1, v: (function () {   // run the walk until it settles, never the degree formula
                        const A = [[1, 2], [0, 2], [0, 1, 3], [2]];
                        let s = [1, 0, 0, 0];
                        for (let t = 0; t < 5000; t++) {
                          const n = [0, 0, 0, 0];
                          for (let i = 0; i < 4; i++) A[i].forEach(j => { n[j] += s[i] / A[i].length; });
                          s = n; }
                        return Math.round(s[2] * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // first-step hitting times to node 4 by value iteration, then one step out and back
                        const A = [[1, 2], [0, 2], [0, 1, 3], [2]];
                        let h = [0, 0, 0, 0];
                        for (let it = 0; it < 20000; it++) {
                          const n = [0, 0, 0, 0];
                          for (let i = 0; i < 3; i++) n[i] = 1 + A[i].reduce((acc, j) => acc + h[j], 0) / A[i].length;
                          h = n; }
                        return Math.round((1 + h[2]) * 1000) / 1000; })() }],

  "math130.0.32": [{ i: 1, v: (function () {   // run the weighted walk until it settles, never the weighted-degree formula
                        const W = [[0, 1, 2], [1, 0, 3], [2, 3, 0]];
                        let s = [1, 0, 0];
                        for (let t = 0; t < 5000; t++) {
                          const n = [0, 0, 0];
                          for (let i = 0; i < 3; i++) {
                            const tot = W[i][0] + W[i][1] + W[i][2];
                            for (let j = 0; j < 3; j++) n[j] += s[i] * W[i][j] / tot; }
                          s = n; }
                        return Math.round(s[2] * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // Gaussian elimination on s(G - I) = 0 with sum 1 — the method the lecture avoids
                        const Q = [[0, 0.5, 0.5, 0], [0.5, 0, 0.5, 0], [0, 0, 0, 1], [0.25, 0.25, 0.25, 0.25]];
                        const G = Q.map(r => r.map(x => 0.85 * x + 0.15 / 4));
                        const M = [];
                        for (let j = 0; j < 4; j++) { M.push([]); for (let i = 0; i < 4; i++) M[j].push(G[i][j] - (i === j ? 1 : 0)); M[j].push(0); }
                        M[3] = [1, 1, 1, 1, 1];
                        for (let c = 0; c < 4; c++) {
                          let p = c; for (let r = c + 1; r < 4; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
                          [M[c], M[p]] = [M[p], M[c]];
                          for (let r = 0; r < 4; r++) { if (r === c) continue;
                            const f = M[r][c] / M[c][c]; for (let k = c; k < 5; k++) M[r][k] -= f * M[c][k]; } }
                        return Math.round((M[3][4] / M[3][3]) * 10000) / 10000; })() }],

  "math130.0.33": [{ i: 2, v: (function () {   // minimise squared error by gradient descent, never Cov / Var
                        const X = [1, 2, 3, 4], Y = [2, 3, 5, 6];
                        let a = 0, b = 0;
                        for (let it = 0; it < 200000; it++) {
                          let ga = 0, gb = 0;
                          for (let i = 0; i < 4; i++) { const e = Y[i] - a - b * X[i]; ga += -2 * e; gb += -2 * e * X[i]; }
                          a -= 0.01 * ga; b -= 0.01 * gb; }
                        return Math.round(b * 1000) / 1000; })() }],

  // PHYS 100. Every kinematics answer below comes from STEPPING the motion —
  // advancing position and velocity in small time steps under constant g and
  // reading the answer off the trajectory — never from the closed form the
  // summary derives. Each step uses the exact constant-acceleration update, and
  // the final partial step is solved within the step, so the result is exact
  // up to rounding rather than approximate to O(dt).
  "phys100.0.1": [{ i: 1, v: (function () {   // step two falls, from 3 m and from 1.5 m, and divide the times
                        const g = 9.8, fall = h => { let y = h, v = 0, t = 0; const dt = 1e-5;
                          for (;;) { const y2 = y + v * dt - 0.5 * g * dt * dt;
                            if (y2 <= 0) { const a = -0.5 * g; return t + (-v - Math.sqrt(v * v - 4 * a * y)) / (2 * a); }
                            v -= g * dt; y = y2; t += dt; } };
                        return Math.round((fall(3) / fall(1.5)) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // step a single fall from 3 m
                        const g = 9.8; let y = 3, v = 0, t = 0; const dt = 1e-5;
                        for (;;) { const y2 = y + v * dt - 0.5 * g * dt * dt;
                          if (y2 <= 0) { const a = -0.5 * g; t += (-v - Math.sqrt(v * v - 4 * a * y)) / (2 * a); break; }
                          v -= g * dt; y = y2; t += dt; }
                        return Math.round(t * 1000) / 1000; })() }],

  "phys100.0.2": [{ i: 1, v: (function () {   // step x'' = 2 from x = 8, v = -6 and record the lowest position reached
                        let x = 8, v = -6, lo = Infinity; const a = 2, dt = 1e-4;
                        for (let i = 0; i <= 60000; i++) { if (x < lo) lo = x; x += v * dt + 0.5 * a * dt * dt; v += a * dt; }
                        return Math.round(lo * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // change in velocity over impact time, with the reversal counted
                        const vIn = -5, vOut = 5, dt = 0.01;
                        return Math.round(Math.abs(vOut - vIn) / dt * 1000) / 1000; })() }],

  "phys100.0.3": [{ i: 1, v: Math.round(Math.hypot(Math.hypot(3, -5), 6) * 1000) / 1000 },   // two perpendicular Pythagoras steps
                   { i: 2, v: Math.round(Math.atan2(Math.hypot(3, -5), 6) * 180 / Math.PI * 100) / 100 }],   // atan2 of the perpendicular part, not arccos

  "phys100.0.4": [{ i: 1, v: (function () {   // fly the ball at 45 degrees step by step and find where it lands
                        const g = 9.8, v0 = Math.sqrt(60.172), al = Math.PI / 4;
                        let x = 0, y = 0, vx = v0 * Math.cos(al), vy = v0 * Math.sin(al); const dt = 1e-5;
                        for (;;) { const y2 = y + vy * dt - 0.5 * g * dt * dt;
                          if (y2 < 0 && vy < 0) { const a = -0.5 * g; x += vx * (-vy - Math.sqrt(vy * vy - 4 * a * y)) / (2 * a); break; }
                          x += vx * dt; y = y2; vy -= g * dt; }
                        return Math.round(x * 100) / 100; })() },
                   { i: 2, v: (function () {   // the same at 30 degrees
                        const g = 9.8, v0 = Math.sqrt(60.172), al = Math.PI / 6;
                        let x = 0, y = 0, vx = v0 * Math.cos(al), vy = v0 * Math.sin(al); const dt = 1e-5;
                        for (;;) { const y2 = y + vy * dt - 0.5 * g * dt * dt;
                          if (y2 < 0 && vy < 0) { const a = -0.5 * g; x += vx * (-vy - Math.sqrt(vy * vy - 4 * a * y)) / (2 * a); break; }
                          x += vx * dt; y = y2; vy -= g * dt; }
                        return Math.round(x * 100) / 100; })() }],

  // Circular motion recomputes by differencing the velocity vector over a tiny time
  // step — measuring how fast it turns — never by v^2/r. Statics by the vector
  // triangle and the law of sines (Lewin's second method), dynamics by energy or by
  // stepping, friction thresholds by bisection on the net force.
  "phys100.0.5": [{ i: 1, v: (function () {   // |dv|/dt for the rotating velocity vector
                        const r = 0.1, w = 2 * Math.PI / 0.1, dt = 1e-6;
                        const v = t => [-r * w * Math.sin(w * t), r * w * Math.cos(w * t)];
                        const a = v(0), b = v(dt);
                        return Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / dt * 10) / 10; })() },
                   { i: 2, v: (function () {   // bisect on the period until the differenced acceleration at 100 m is 10
                        const acc = T => { const w = 2 * Math.PI / T, dt = 1e-6;
                          const v = t => [-100 * w * Math.sin(w * t), 100 * w * Math.cos(w * t)];
                          const a = v(0), b = v(dt); return Math.hypot(b[0] - a[0], b[1] - a[1]) / dt; };
                        let lo = 1, hi = 100;
                        for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (acc(m) > 10) lo = m; else hi = m; }
                        return Math.round(lo * 100) / 100; })() }],

  "phys100.0.6": [{ i: 1, v: Math.round(40 * Math.sin(Math.PI / 4) / Math.sin(105 * Math.PI / 180) * 100) / 100 },   // law of sines on the force triangle
                   { i: 2, v: Math.round(40 * Math.sin(Math.PI / 6) / Math.sin(105 * Math.PI / 180) * 100) / 100 }],

  "phys100.0.7": [{ i: 1, v: (function () {   // energy: drop 1 m, v^2 from lost potential energy, then a = v^2 / 2h
                        const m1 = 1.1, m2 = 1.25, g = 10, h = 1;
                        return Math.round((2 * (m2 - m1) * g * h / (m1 + m2)) / (2 * h) * 1000) / 1000; })() },
                   { i: 2, v: (function () {   // tension from the lighter mass's own equation, with a found by energy
                        const m1 = 1.1, m2 = 1.25, g = 10, a = (m2 - m1) * g / (m1 + m2);
                        return Math.round(m1 * (a + g) * 100) / 100; })() }],

  "phys100.0.8": [{ i: 1, v: (function () {   // step the sliding system for one second and read the speed gained
                        const m1 = 1, m2 = 2, g = 10, al = Math.PI / 6, mk = 0.4, dt = 1e-5;
                        let v = 0;
                        for (let i = 0; i < 100000; i++) v += (m2 * g - m1 * g * Math.sin(al) - mk * m1 * g * Math.cos(al)) / (m1 + m2) * dt;
                        return Math.round(v * 100) / 100; })() },
                   { i: 2, v: (function () {   // bisect on mu until the uphill net force is exactly zero
                        const m1 = 0.361, m2 = 0.27, al = 20 * Math.PI / 180;
                        let lo = 0, hi = 2;
                        for (let i = 0; i < 200; i++) { const mu = (lo + hi) / 2;
                          if (m2 - m1 * Math.sin(al) - mu * m1 * Math.cos(al) > 0) lo = mu; else hi = mu; }
                        return Math.round(lo * 1000) / 1000; })() }],

  "phys100.0.9": [{ i: 1, v: (function () {   // step the climb until vertical velocity reaches zero and record the height
                        let y = 0, v = 133, top = 0; const g = 10, dt = 1e-5;
                        while (v > 0) { y += v * dt - 0.5 * g * dt * dt; v -= g * dt; if (y > top) top = y; }
                        return Math.round(top); })() },
                   { i: 2, v: (function () {   // difference the velocity vector on the 15 m arm
                        const r = 15, w = 2 * Math.PI / 2.5, dt = 1e-6;
                        const v = t => [-r * w * Math.sin(w * t), r * w * Math.cos(w * t)];
                        const a = v(0), b = v(dt);
                        return Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / dt * 10) / 10; })() }],

  // Oscillations by stepping the equation of motion with RK4 and timing zero
  // crossings; the loop by bisection on the energy condition; g by differencing the
  // potential; terminal speed by stepping the drag equation to steady state; escape
  // by quadrature of the force out to (effectively) infinity; the orbit by stepping
  // it in two dimensions and timing one revolution.
  "phys100.0.10": [{ i: 0, v: (function () {   // step x'' = -(k/m) x, time between alternate zero crossings
                        const w2 = 10 / 0.1, dt = 1e-5; let x = 0, v = -3, t = 0; const cr = [];
                        const f = (x, v) => [v, -w2 * x];
                        while (cr.length < 3) {
                          const a = f(x, v), b = f(x + a[0] * dt / 2, v + a[1] * dt / 2), c = f(x + b[0] * dt / 2, v + b[1] * dt / 2), d = f(x + c[0] * dt, v + c[1] * dt);
                          const nx = x + dt / 6 * (a[0] + 2 * b[0] + 2 * c[0] + d[0]), nv = v + dt / 6 * (a[1] + 2 * b[1] + 2 * c[1] + d[1]);
                          if (x > 0 && nx <= 0) cr.push(t + dt * x / (x - nx));
                          x = nx; v = nv; t += dt; }
                        return Math.round((cr[2] - cr[1]) * 1000) / 1000; })() }],

  "phys100.0.11": [{ i: 0, v: (function () {   // bisect on release height until the speed at the top just meets v^2 = gR
                        const g = 9.8, R = 1; let lo = 2, hi = 4;
                        for (let i = 0; i < 200; i++) { const h = (lo + hi) / 2; if (2 * g * (h - 2 * R) >= g * R) hi = h; else lo = h; }
                        return Math.round(hi * 10) / 10; })() },
                   { i: 1, v: (function () {   // g = -dU/dr, differenced across one metre of height
                        const G = 6.67e-11, M = 5.97e24, R = 6.37e6, U = r => -G * M / r;
                        return Math.round((U(R + 1) - U(R - 1)) / 2 * 100) / 100; })() }],

  "phys100.0.12": [{ i: 0, v: (function () {   // step m v' = mg - C2 r^2 v^2 for 30 s from rest
                        const m = 0.034, r = 0.35, C2 = 0.85, g = 9.8, dt = 1e-3, f = v => g - C2 * r * r * v * v / m;
                        let v = 0;
                        for (let i = 0; i < 30000; i++) { const a = f(v), b = f(v + a * dt / 2), c = f(v + b * dt / 2), d = f(v + c * dt); v += dt / 6 * (a + 2 * b + 2 * c + d); }
                        return Math.round(v * 100) / 100; })() }],

  "phys100.0.13": [{ i: 0, v: (function () {   // step the full theta'' = -(g/R) sin(theta) from 1.2 degrees
                        const w2 = 9.8 / 115, dt = 1e-3; let th = 1.2 * Math.PI / 180, om = 0, t = 0; const cr = [];
                        const f = (x, v) => [v, -w2 * Math.sin(x)];
                        while (cr.length < 3) {
                          const a = f(th, om), b = f(th + a[0] * dt / 2, om + a[1] * dt / 2), c = f(th + b[0] * dt / 2, om + b[1] * dt / 2), d = f(th + c[0] * dt, om + c[1] * dt);
                          const n = th + dt / 6 * (a[0] + 2 * b[0] + 2 * c[0] + d[0]), nv = om + dt / 6 * (a[1] + 2 * b[1] + 2 * c[1] + d[1]);
                          if (th > 0 && n <= 0) cr.push(t + dt * th / (th - n));
                          th = n; om = nv; t += dt; }
                        return Math.round((cr[2] - cr[1]) * 10) / 10; })() }],

  "phys100.0.14": [{ i: 0, v: (function () {   // Simpson on the work against GM/r^2 from R outward, r = R e^s, s to 40
                        const G = 6.67e-11, M = 5.97e24, R = 6.37e6, N = 4000, S = 40, h = S / N;
                        const f = s => G * M / (R * Math.exp(s));   // (GM/r^2) dr/ds
                        let sum = 0;
                        for (let i = 0; i <= N; i++) sum += (i === 0 || i === N ? 1 : i % 2 ? 4 : 2) * f(i * h);
                        return Math.round(Math.sqrt(2 * sum * h / 3) / 100) / 10; })() },
                   { i: 1, v: (function () {   // step the orbit in two dimensions and time one revolution
                        const GM = 6.67e-11 * 5.97e24, r0 = 6.8e6, dt = 0.5; let s = [r0, 0, 0, Math.sqrt(GM / r0)], t = 0;
                        const f = s => { const r3 = Math.pow(s[0] * s[0] + s[1] * s[1], 1.5); return [s[2], s[3], -GM * s[0] / r3, -GM * s[1] / r3]; };
                        for (;;) {
                          const k1 = f(s), k2 = f(s.map((x, i) => x + k1[i] * dt / 2)), k3 = f(s.map((x, i) => x + k2[i] * dt / 2)), k4 = f(s.map((x, i) => x + k3[i] * dt));
                          const n = s.map((x, i) => x + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
                          if (t > 100 && s[1] < 0 && n[1] >= 0) return Math.round((t + dt * -s[1] / (n[1] - s[1])) / 60);
                          s = n; t += dt; } })() }],
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

// The other direction. A recomputation that names a lesson which does not exist,
// or a check index that is not numeric, is dead code that looks like coverage —
// and it stays green, because the loop above only ever reads expectedSummary by
// the keys it already has. This caught a math120.1.14 entry written before the
// summary it checked.
Object.keys(expectedSummary).forEach(k => {
  const s = (D.SUMMARIES || {})[k];
  ok(!!s, "expectedSummary " + k + ": names a summary that exists");
  if (!s) return;
  expectedSummary[k].forEach(e => {
    const c = (s.checks || [])[e.i];
    ok(!!c && c.num !== undefined,
       "expectedSummary " + k + " check " + e.i + ": is a numeric check on that summary");
  });
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
