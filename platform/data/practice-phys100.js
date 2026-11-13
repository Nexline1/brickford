// Brickford — practice items, PHYS 100 (T-068, practice batch 2). The shape and
// the rules are in practice-math110.js and docs/CONTENT-STANDARD.md, "Practice items".
window.DAR = window.DAR || {};
DAR.PRACTICE = DAR.PRACTICE || {};
Object.assign(DAR.PRACTICE, {
  // Both scheduled 20 Dec, the day 8.01 starts.
  "phys100.0.0": [
    { id: "p1", type: "numeric", q: "Lewin's balloons flew to about 145,000 feet. With 1 ft = 0.3048 m, that is how many kilometres, to one decimal?", num: 44.2, tol: 0.05,
      expl: "$145000\\times0.3048=44196$ m, or 44.2 km. A unit is only a choice: the height is the same, the number changes." },
  ],
  "phys100.0.1": [
    { id: "p1", type: "numeric", q: "A rod measures $92.4\\pm0.2$ cm standing and $93.5\\pm0.2$ cm lying. The difference, in cm, is:", num: 1.1,
      expl: "$93.5-92.4=1.1$, with uncertainty $0.2+0.2=0.4$ as in the lecture: $1.1\\pm0.4$ cm. Bigger than its uncertainty, so it is a result." },
    { id: "p2", type: "numeric", q: "Galileo's scaling, $d\\propto\\ell^{3/2}$. An animal 9 times larger in every length: by what factor does the femur's ratio $d/\\ell$ grow?", num: 3,
      expl: "$d/\\ell\\propto\\ell^{1/2}$, and $\\sqrt9=3$. The femur is 9 times longer and 27 times thicker." },
    { id: "p3", type: "worked", q: "Guess a pendulum's period as $T\\propto\\ell^{\\alpha}m^{\\beta}g^{\\gamma}$. Find the powers, then the factor $T$ changes by when $\\ell$ goes from 0.5 m to 2 m.",
      result: "$T=C\\sqrt{\\ell/g}$, independent of $m$; the period doubles", num: 2,
      steps: ["$[T]=[L]^{\\alpha}[M]^{\\beta}([L]/[T]^{2})^{\\gamma}$.", "Mass appears only once, so $\\beta=0$. Time: $1=-2\\gamma$, so $\\gamma=-\\tfrac12$. Length: $\\alpha+\\gamma=0$, so $\\alpha=\\tfrac12$.",
              "$T\\propto\\sqrt{\\ell}$: four times the length, $\\sqrt4=2$ times the period. The constant ($2\\pi$) needs more than dimensions."] },
  ],
});
