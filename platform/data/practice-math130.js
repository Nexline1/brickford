// Brickford — practice items, MATH 130 (T-067 step 3). The shape and the rules
// are in practice-math110.js and docs/CONTENT-STANDARD.md, "Practice items".
window.DAR = window.DAR || {};
DAR.PRACTICE = DAR.PRACTICE || {};
Object.assign(DAR.PRACTICE, {
  "math130.0.10": [
    { id: "p1", type: "numeric", q: "$X\\sim\\mathrm{Pois}(2)$. $P(X=0)$, to four decimals, is:", num: 0.1353, tol: 0.0001,
      expl: "$P(X=0)=e^{-\\lambda}\\lambda^{0}/0!=e^{-2}$." },
    { id: "p2", type: "numeric", q: "By the Poisson approximation, the probability that some two of 30 people share a birthday, to three decimals, is:", num: 0.696, tol: 0.001,
      expl: "$\\lambda=\\binom{30}{2}/365=435/365$ pairs expected. $P(\\text{none})\\approx e^{-\\lambda}$; complement it." },
    { id: "p3", type: "worked", q: "$X\\sim\\mathrm{Bin}(500,\\,0.004)$. Approximate $P(X\\ge1)$ with a Poisson, then compute it exactly.",
      result: "Poisson $1-e^{-2}\\approx0.8647$; exact $1-0.996^{500}\\approx0.8652$", num: 0.865, tol: 0.001,
      steps: ["$\\lambda=np=500\\cdot0.004=2$.", "Poisson: $P(X\\ge1)=1-e^{-2}=0.8647$.",
              "Exact: $1-0.996^{500}=0.8652$. Many trials, each unlikely: the two agree to three places."] },
  ],
});
