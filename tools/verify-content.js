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
