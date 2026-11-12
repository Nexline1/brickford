// Brickford — practice items, MATH 120 (T-067 step 3). The shape and the rules
// are in practice-math110.js and docs/CONTENT-STANDARD.md, "Practice items".
// Unit I is sized by the lecture's length (practiceTarget: 1 item up to 15
// minutes, 2 up to 35); Unit II's lectures in the 22 Nov to 6 Dec window get 3.
window.DAR = window.DAR || {};
DAR.PRACTICE = DAR.PRACTICE || {};
Object.assign(DAR.PRACTICE, {
  // ---- Unit I: Essence of calculus ----
  "math120.0.0": [
    { id: "p1", type: "numeric", q: "$A(x)$ is the area under $y=3x^{2}$ from 0 to $x$. The ratio $dA/dx$ at $x=2$ is:", num: 12,
      expl: "Nudging $x$ adds a thin sliver of height $3x^{2}$ and width $dx$, so $dA/dx=3\\cdot2^{2}$." },
    { id: "p2", type: "numeric", q: "Summing rings $2\\pi r\\,dr$ from $r=0$ to $r=3$ is the area under $y=2\\pi r$ from 0 to 3. That area, to two decimals, is:", num: 28.27, tol: 0.01,
      expl: "A triangle of base 3 and height $6\\pi$: $\\tfrac12\\cdot3\\cdot6\\pi=9\\pi$, the disc's area." },
  ],
  "math120.0.1": [
    { id: "p1", type: "numeric", q: "For $s(t)=t^{2}$, the derivative at $t=4$ is:", num: 8,
      expl: "$\\frac{(4+dt)^{2}-16}{dt}=8+dt$, which approaches 8." },
    { id: "p2", type: "worked", q: "For $s(t)=t^{2}+t$, simplify $\\dfrac{s(3+dt)-s(3)}{dt}$ and say what it approaches.",
      result: "$7+dt$, which approaches 7", num: 7,
      steps: ["$s(3+dt)=9+6\\,dt+dt^{2}+3+dt$ and $s(3)=12$.", "The difference is $7\\,dt+dt^{2}$; divide by $dt$: $7+dt$.",
              "As $dt$ shrinks the ratio approaches 7. That limit is the derivative."] },
  ],
  "math120.0.2": [
    { id: "p1", type: "numeric", q: "By the power rule, the derivative of $x^{4}$ at $x=3$ is:", num: 108,
      expl: "$4x^{3}$ at 3: $4\\cdot27$. The cube's three faces become a hypercube's four." },
    { id: "p2", type: "numeric", q: "The derivative of $\\cos\\theta$ at $\\theta=\\pi/2$ is:", num: -1,
      expl: "$\\frac{d}{d\\theta}\\cos\\theta=-\\sin\\theta$, and $\\sin(\\pi/2)=1$: at the top of the circle the x-coordinate falls fastest." },
  ],
  "math120.0.3": [
    { id: "p1", type: "numeric", q: "By the chain rule, the derivative of $(3x+1)^{2}$ at $x=1$ is:", num: 24,
      expl: "Outer: $2(3x+1)$, which is 8 at $x=1$. Inner: 3. Multiply." },
    { id: "p2", type: "numeric", q: "By the product rule, the derivative of $x^{2}\\sin x$ at $x=\\pi$, to two decimals, is:", num: -9.87, tol: 0.01,
      expl: "$2x\\sin x+x^{2}\\cos x$ at $\\pi$: $0+\\pi^{2}(-1)$." },
  ],
  "math120.0.4": [
    { id: "p1", type: "numeric", q: "The proportionality constant for base 16 divided by the constant for base 2 is:", num: 4,
      expl: "The constants are $\\ln 16$ and $\\ln 2$, and $16=2^{4}$." },
  ],
  "math120.0.5": [
    { id: "p1", type: "numeric", q: "On the circle $x^{2}+y^{2}=13$, the slope $dy/dx$ at $(2,3)$, to three decimals, is:", num: -0.667, tol: 0.001,
      expl: "$2x\\,dx+2y\\,dy=0$ gives $dy/dx=-x/y=-2/3$." },
    { id: "p2", type: "worked", q: "On the curve $xy=6$, find $dy/dx$ at $(2,3)$ by differentiating implicitly.",
      result: "$-3/2$", num: -1.5,
      steps: ["The product changes by $x\\,dy+y\\,dx$.", "It must stay 6, so $x\\,dy+y\\,dx=0$ and $dy/dx=-y/x$.", "At $(2,3)$: $-3/2$."] },
  ],
  "math120.0.6": [
    { id: "p1", type: "numeric", q: "$\\displaystyle\\lim_{x\\to3}\\frac{x^{2}-9}{x-3}$ equals:", num: 6,
      expl: "Both vanish at 3. Compare nudges: $2x\\,dx$ against $dx$, so $2\\cdot3$." },
    { id: "p2", type: "worked", q: "Find $\\displaystyle\\lim_{x\\to0}\\frac{\\sin(3x)}{x}$ by comparing how much the top and the bottom change.",
      result: "3", num: 3,
      steps: ["Both are 0 at $x=0$.", "The top changes by $3\\cos(0)\\,dx=3\\,dx$; the bottom by $dx$.", "The $dx$ cancel: the limit is 3."] },
  ],
  "math120.0.7": [
    { id: "p1", type: "numeric", q: "A car's velocity is $v(t)=t(10-t)$. The distance it travels between $t=0$ and $t=6$ is:", num: 108,
      expl: "An antiderivative is $5t^{2}-t^{3}/3$; at 6 it is $180-72$, at 0 it is 0." },
    { id: "p2", type: "worked", q: "$v(t)=6-2t$ for $t$ from 0 to 5. Find the displacement, and the distance actually travelled.",
      result: "Displacement 5; distance 13", num: 5,
      steps: ["$\\int_0^5 (6-2t)\\,dt=[6t-t^{2}]_0^5=5$.", "$v$ is negative after $t=3$: that area subtracts.",
              "Distance adds both pieces: $9$ forward and $4$ back, so 13."] },
  ],
  "math120.0.8": [
    { id: "p1", type: "numeric", q: "The average value of $\\sin x$ on $[0,\\pi]$, to three decimals, is:", num: 0.637, tol: 0.001,
      expl: "The area is 2 and the width is $\\pi$: $2/\\pi$, the slope of $-\\cos x$ between the endpoints." },
  ],
  "math120.0.9": [
    { id: "p1", type: "numeric", q: "For $f(x)=x^{4}$, the second derivative at $x=2$ is:", num: 48,
      expl: "$f'=4x^{3}$, $f''=12x^{2}$, and $12\\cdot4=48$." },
  ],
  "math120.0.10": [
    { id: "p1", type: "numeric", q: "Using $e^{x}\\approx1+x+\\tfrac{x^{2}}{2}$, estimate $e^{0.2}$.", num: 1.22, tol: 0.001,
      expl: "$1+0.2+0.02$. The true value is $1.2214\\ldots$; the next term, $x^{3}/6$, is the gap." },
    { id: "p2", type: "worked", q: "Write the quadratic Taylor polynomial of $\\sqrt{x}$ at $a=4$ and use it to estimate $\\sqrt{4.1}$.",
      result: "$2+\\tfrac{x-4}{4}-\\tfrac{(x-4)^{2}}{64}$; $\\sqrt{4.1}\\approx2.0248$", num: 2.0248, tol: 0.0001,
      steps: ["$f(4)=2$, $f'(x)=\\tfrac{1}{2\\sqrt x}$ so $f'(4)=\\tfrac14$.", "$f''(x)=-\\tfrac{1}{4x^{3/2}}$ so $f''(4)=-\\tfrac{1}{32}$; divide by $2!$: $-\\tfrac{1}{64}$.",
              "At $x=4.1$: $2+0.025-0.00015625=2.02484$."] },
  ],
  "math120.0.11": [
    { id: "p1", type: "numeric", q: "Read as a transformation of the number line, $x^{3}$ stretches a small cluster of points near the input 2 by a factor of:", num: 12,
      expl: "The local stretch factor is the derivative $3x^{2}$ at 2." },
  ],

  // ---- Unit II: MIT 18.01, the lectures Plan v2 schedules 22 Nov to 6 Dec ----
  "math120.1.7": [
    { id: "p1", type: "numeric", q: "Use the linear approximation of $\\sqrt{1+x}$ near 0 to estimate $\\sqrt{1.06}$.", num: 1.03, tol: 0.0005,
      expl: "$\\sqrt{1+x}\\approx1+\\tfrac{x}{2}$, so $1+0.03$." },
    { id: "p2", type: "numeric", q: "The quadratic approximation of $e^{0.1}$, to four decimals, is:", num: 1.105, tol: 0.0005,
      expl: "$1+x+\\tfrac{x^{2}}{2}=1+0.1+0.005$." },
    { id: "p3", type: "worked", q: "Find the coefficient of $x$ in the linear approximation of $e^{2x}(1+x)^{3}$ near 0.",
      result: "5", num: 5,
      steps: ["$e^{2x}\\approx1+2x$ and $(1+x)^{3}\\approx1+3x$.", "Multiply and drop $x^{2}$: $1+5x$."] },
  ],
  "math120.1.8": [
    { id: "p1", type: "numeric", q: "$f(x)=x^{3}-12x$. The value of $f$ at its positive critical point is:", num: -16,
      expl: "$f'=3x^{2}-12=0$ at $x=2$; $f(2)=8-24$." },
    { id: "p2", type: "numeric", q: "Where does $f(x)=x^{3}-6x^{2}+1$ change from concave down to concave up? Enter $x$.", num: 2,
      expl: "$f''=6x-12$ is negative before 2 and positive after." },
    { id: "p3", type: "worked", q: "Sketch $f(x)=\\dfrac{x}{x^{2}+1}$: critical points with their values, and both ends.",
      result: "Max $\\tfrac12$ at $x=1$, min $-\\tfrac12$ at $x=-1$; both ends tend to 0", num: 0.5,
      steps: ["$f'=\\dfrac{1-x^{2}}{(x^{2}+1)^{2}}$: zero at $x=\\pm1$.", "$f(1)=\\tfrac12$, $f(-1)=-\\tfrac12$; $f$ is odd.",
              "For large $|x|$, $f\\approx1/x\\to0$; so $x=1$ is the maximum and $x=-1$ the minimum."] },
  ],
  "math120.1.9": [
    { id: "p1", type: "numeric", q: "The smallest value of $x+\\dfrac{4}{x}$ for $x>0$ is:", num: 4,
      expl: "$1-4/x^{2}=0$ at $x=2$; both ends go to infinity, so $2+2$ is the minimum." },
    { id: "p2", type: "numeric", q: "The largest value of $x\\,e^{-x}$ for $x\\ge0$, to three decimals, is:", num: 0.368, tol: 0.001,
      expl: "$f'=(1-x)e^{-x}$ is zero at $x=1$; $f(0)=0$ and $f\\to0$ at infinity, so $1/e$." },
    { id: "p3", type: "worked", q: "Find the largest value of $f(x)=x^{3}-3x$ on $[0,3]$. Check the critical points and the ends.",
      result: "18, at the endpoint $x=3$", num: 18,
      steps: ["$f'=3x^{2}-3=0$ at $x=1$ inside the interval: $f(1)=-2$.", "Ends: $f(0)=0$ and $f(3)=27-9=18$.",
              "The maximum sits at an endpoint, where $f'\\neq0$."] },
  ],
  "math120.1.10": [
    { id: "p1", type: "numeric", q: "An open box with a square base and volume 32 uses the least material. Its height is:", num: 2,
      expl: "Area $x^{2}+4xy$ with $y=32/x^{2}$: $x^{2}+128/x$. Then $2x=128/x^{2}$ gives $x=4$, $y=2$." },
    { id: "p2", type: "numeric", q: "A wire of length 12 is cut in two and each piece bent into a square. The least total area enclosed is:", num: 4.5,
      expl: "$(x/4)^{2}+((12-x)/4)^{2}$ is least at $x=6$: two squares of side 1.5. The ends, one square, give 9." },
    { id: "p3", type: "worked", q: "A 10 ft ladder leans on a wall. Its foot slides away at 2 ft/s. How fast is the top sliding down when the foot is 6 ft out?",
      result: "1.5 ft/s", num: 1.5,
      steps: ["$x^{2}+y^{2}=100$; differentiate in time first: $2x\\,x'+2y\\,y'=0$.", "Now plug in: $x=6$, $y=8$, $x'=2$.",
              "$y'=-\\tfrac{6\\cdot2}{8}=-1.5$: falling at 1.5 ft/s."] },
  ],
  "math120.1.11": [
    { id: "p1", type: "numeric", q: "Newton's method for $\\sqrt{10}$ from $x_0=3$. To four decimals, $x_1$ is:", num: 3.1667, tol: 0.0001,
      expl: "Average the guess with $10/\\text{guess}$: $\\tfrac12(3+10/3)=19/6$." },
    { id: "p2", type: "numeric", q: "A conical tank, point down, is 8 ft deep with radius 4 at the top. Water flows in at 3 ft³ per minute. $dh/dt$ at depth 6 ft, in ft per minute to three decimals, is:", num: 0.106, tol: 0.001,
      expl: "$r=h/2$, so $V=\\pi h^{3}/12$ and $V'=\\tfrac{\\pi h^{2}}{4}h'$. Then $h'=\\tfrac{4\\cdot3}{36\\pi}=\\tfrac{1}{3\\pi}$." },
    { id: "p3", type: "worked", q: "Run two Newton steps on $f(x)=x^{3}-2$ from $x_0=1$.",
      result: "$x_1=4/3$, $x_2\\approx1.2639$", num: 1.2639, tol: 0.0001,
      steps: ["$x_{n+1}=x_n-\\dfrac{x_n^{3}-2}{3x_n^{2}}$.", "$x_1=1-\\tfrac{-1}{3}=\\tfrac43$.",
              "$x_2=\\tfrac43-\\dfrac{64/27-2}{16/3}=1.26389$. The cube root of 2 is $1.25992$."] },
  ],
  "math120.1.12": [
    { id: "p1", type: "numeric", q: "For $f(x)=x^{3}$ on $[0,3]$, the value of $c$ the Mean Value Theorem promises, to three decimals, is:", num: 1.732, tol: 0.001,
      expl: "The average slope is $27/3=9$; $3c^{2}=9$ gives $c=\\sqrt3$, inside $(0,3)$." },
    { id: "p2", type: "numeric", q: "$f'(x)\\ge2$ on $[1,4]$ and $f(1)=5$. The least possible value of $f(4)$ is:", num: 11,
      expl: "$f(4)-f(1)=f'(c)\\cdot3\\ge6$." },
    { id: "p3", type: "worked", q: "Prove $e^{x}\\ge1+x$ for $x\\ge0$, the three-line way.",
      result: "$g(x)=e^{x}-1-x$ has $g(0)=0$ and $g'(x)=e^{x}-1\\ge0$, so $g\\ge0$.",
      steps: ["Form the difference: $g(x)=e^{x}-1-x$.", "Check the start: $g(0)=0$.",
              "$g'(x)=e^{x}-1\\ge0$ for $x\\ge0$, and by the Mean Value Theorem $g$ cannot decrease."] },
  ],
});
