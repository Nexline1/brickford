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
  // Batch 2 (T-068): scheduled 14 Dec.
  "math130.0.11": [
    { id: "p1", type: "numeric", q: "$X$ is uniform on $(2,6)$. $P(3\\le X\\le4.5)$ is:", num: 0.375,
      expl: "The density is $\\tfrac14$ on the interval, so the probability is length times density: $1.5\\cdot\\tfrac14$." },
    { id: "p2", type: "numeric", q: "$X$ is uniform on $(0,4)$. Using LOTUS for $E(X^{2})$, $\\mathrm{Var}(X)$ to three decimals is:", num: 1.333, tol: 0.001,
      expl: "$E(X^{2})=\\int_{0}^{4}x^{2}\\cdot\\tfrac14\\,dx=\\tfrac{16}{3}$ and $E(X)=2$, so $\\tfrac{16}{3}-4=\\tfrac43$. In general $(b-a)^{2}/12$." },
    { id: "p3", type: "worked", q: "$X$ has PDF $f(x)=3x^{2}$ on $(0,1)$. Check it is valid, then find $E(X)$ and, with LOTUS, $\\mathrm{Var}(X)$.",
      result: "$E(X)=\\tfrac34$, $\\mathrm{Var}(X)=\\tfrac{3}{80}=0.0375$", num: 0.0375, tol: 0.0001,
      steps: ["$f\\ge0$ and $\\int_{0}^{1}3x^{2}dx=1$: valid. Note $f(1)=3$, above 1, and that is fine.",
              "$E(X)=\\int_{0}^{1}x\\cdot3x^{2}dx=\\tfrac34$; by LOTUS $E(X^{2})=\\int_{0}^{1}x^{2}\\cdot3x^{2}dx=\\tfrac35$.",
              "$\\mathrm{Var}(X)=\\tfrac35-\\tfrac{9}{16}=\\tfrac{3}{80}$."] },
  ],
});
