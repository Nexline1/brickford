// Brickford — lecture summaries, MATH 120 (Single-Variable Calculus)
//
// Unit I is 3Blue1Brown's Essence of Calculus; Unit II is MIT 18.01 with David
// Jerison. Both live here — 47 entries is long but not the three thousand lines
// that forced MATH 110's MIT half into its own file.
//
// Same contract as the MATH 110 files: written FROM the lecture, following the
// lecturer's own argument in their own order, so the summary reviews what was
// actually said rather than paraphrasing the topic. tools/verify-content.js
// enforces the shape and RECOMPUTES every numeric answer — see the summaries
// block there before adding an entry.
//
// No concepts and no figures yet: DAR.CONCEPTS and DAR.FIG are both entirely
// linear algebra so far, so `concepts: []` is the correct value here. A calculus
// concept set is its own round, with its own authoring standard.
//
// beats[]  — the argument as it develops.
// worked   — the practical pattern, because theory alone does not transfer.
// watch    — the trap, stated as the error rather than as a warning.
// checks[] — active review; recognising a summary is not remembering it.
window.DAR = window.DAR || {};

DAR.SUMMARIES = Object.assign(DAR.SUMMARIES || {}, {

  "math120.0.0": {
    takeaway: "Hard problems become sums of many small quantities, those sums become areas under graphs, and derivatives are how you find those areas.",
    beats: [
      { t: "Slice the circle in a way that respects its symmetry", d: "Concentric rings, not squares. A ring at radius $r$ unrolls into something close to a rectangle: width $2\\pi r$, which is essentially the definition of $\\pi$, and thickness $dr$, which is however finely you chose to slice." },
      { t: "The approximation gets better exactly as $dr$ shrinks", d: "The unrolled ring is not a rectangle — its top and bottom edges differ. But they differ less the thinner the ring, so $2\\pi r\\,dr$ is wrong by an amount that vanishes. Holding that fact in mind is the whole method." },
      { t: "Stand the rectangles side by side and a graph appears", d: "Each has width $dr$, so they pack snugly along a $r$-axis, and each has height $2\\pi r$. Their tops trace the line $y = 2\\pi r$. The sum of many small numbers has become the area under a graph." },
      { t: "That area is a triangle, and out falls $\\pi r^{2}$", d: "Base 3, height $2\\pi\\cdot3$, so $\\tfrac12\\cdot3\\cdot6\\pi = 9\\pi$. For a general radius $R$ it is $\\pi R^{2}$ — the formula, derived rather than remembered." },
      { t: "Now ask the same question of a curve that is not a triangle", d: "What is the area under $y=x^{2}$ from 0 to $x$? Call it $A(x)$ — the INTEGRAL of $x^{2}$. It is a mystery function, and attacking it head-on gets you nowhere." },
      { t: "So nudge $x$ and watch what the area does", d: "Push $x$ by $dx$ and the new sliver is nearly a rectangle: height $x^{2}$, width $dx$. So $dA \\approx x^{2}\\,dx$, which rearranges to $\\dfrac{dA}{dx} \\approx x^{2}$. That ratio is the DERIVATIVE, and the relation between it and the area is the fundamental theorem." },
    ],
    worked: "The method transfers. Distance from velocity: at each moment multiply the velocity by a tiny $dt$ to get a tiny distance, then add them. Any problem that becomes a sum of thin rectangles side by side is a problem about the area under a graph.",
    watch: "Treating $2\\pi r\\,dr$ as the ring's exact area. It is an approximation, and the argument works because the error shrinks faster than the number of rings grows — not because the rectangle was ever right.",
    concepts: [],
    checks: [
      { q: "Summing the ring areas $2\\pi r\\,dr$ turns into an area under a graph because:", opts: ["Circles and triangles have the same area", "Each term is a rectangle of width $dr$ and height $2\\pi r$, and they pack side by side under $y=2\\pi r$", "$\\pi$ is irrational", "The rings are exactly rectangles"], a: 1,
        expl: "The factor $dr$ is both the thickness of each rectangle and the spacing between successive values of $r$, which is what lets them sit flush against each other beneath the graph." },
      { q: "For $A(x)$, the area under $y=x^{2}$ from 0 to $x$, the ratio $dA/dx$ at $x=3$ is:", num: 9,
        expl: "The sliver added by nudging $x$ is a rectangle of height $x^{2}$ and width $dx$, so $dA/dx = x^{2} = 3^{2} = 9$. That relation IS the fundamental theorem of calculus." },
    ],
  },

  "math120.0.1": {
    takeaway: "\"Instantaneous rate of change\" is an oxymoron, and the derivative is the clever construction that gets the meaning without the contradiction.",
    beats: [
      { t: "Velocity at a single instant is not a thing", d: "Show someone a photograph of a car and ask its speed — there is no answer. Speed needs two moments to compare: a change in distance over a change in time. Yet a velocity graph assigns a number to each single $t$. That tension is the whole chapter." },
      { t: "What a real speedometer does is sidestep it", d: "It measures how far the car goes between 3 and 3.01 seconds and divides by 0.01. Never a single instant — always a small interval. Call them $ds$ and $dt$, and velocity is $ds/dt$." },
      { t: "On the graph that ratio is a slope", d: "$dt$ is a step right, $ds$ is the resulting rise, so $ds/dt$ is rise over run between two nearby points on the distance curve. Steep graph, fast car; shallow graph, slow car." },
      { t: "The derivative is what the ratio APPROACHES", d: "Not the ratio at some particular $dt$, and not $dt = 0$ — that is division by zero. As the two points slide together, the secant line approaches the TANGENT line, and the derivative is that tangent's slope." },
      { t: "Letting $dt\\to0$ makes the algebra simpler, not harder", d: "For $s=t^{3}$ at $t=2$: expanding $(2+dt)^{3}-2^{3}$ gives a mess, but the $2^{3}$ cancel, every surviving term has a $dt$, and after dividing only $3\\cdot2^{2}$ has no $dt$ left. Everything else vanishes. So $\\frac{d}{dt}t^{3} = 3t^{2}$." },
      { t: "The paradox, sharpened", d: "For $s=t^{3}$ the derivative at $t=0$ is 0. So is the car moving? Between 0 and 0.1 seconds it travels 0.001 m — it moves. The derivative being 0 does not mean static; it means the best CONSTANT approximation to its speed near 0 is 0." },
    ],
    worked: "Notation warning: the $d$ in $ds/dt$ announces an intention. It says you are going to ask what the ratio approaches as the nudge shrinks. It is not a fraction, even though it behaves like one often enough to be misleading.",
    watch: "Reading the derivative as a rate of change at an instant. Change needs two moments. Read it instead as the best constant approximation for the rate of change near a point — which is what the tangent line is.",
    concepts: [],
    checks: [
      { q: "The derivative is not simply $ds/dt$ for a small $dt$ because:", opts: ["$dt$ would be negative", "It is what that ratio APPROACHES as $dt$ shrinks — a limit, not a value at any particular $dt$", "$ds$ is always zero", "Small numbers are hard to compute"], a: 1,
        expl: "Any fixed $dt$ gives the slope of a secant through two points. As $dt\\to0$ that secant approaches the tangent at a single point, and the derivative is the tangent's slope — never evaluated AT $dt=0$, which would be division by zero." },
      { q: "For $s(t)=t^{3}$, the derivative at $t=2$ is:", num: 12,
        expl: "Expanding $(2+dt)^{3}-2^{3}$ and dividing by $dt$ leaves $3\\cdot2^{2}$ plus terms that all carry a $dt$. Those vanish, giving $3\\cdot4 = 12$." },
    ],
  },

  "math120.0.2": {
    takeaway: "Derivative formulas are not rules to memorise: draw what the function literally means, nudge the input, and read the answer off the picture.",
    beats: [
      { t: "$x^{2}$ is a square, so nudge its side", d: "Grow the side by $dx$ and three new pieces appear: two thin rectangles of area $x\\,dx$ each, and one tiny corner square of area $dx^{2}$. So $df \\approx 2x\\,dx$, and $df/dx = 2x$." },
      { t: "The corner square is why the rule is clean", d: "At $dx = 0.01$ the two rectangles contribute $0.06$ and the corner contributes $0.0001$. Anything with $dx$ raised above the first power is negligible — that is the rule of thumb the whole subject leans on." },
      { t: "$x^{3}$ is a cube, and the same thing happens", d: "Three thin square slabs of volume $x^{2}\\,dx$ each, plus edge slivers and a corner cube that all carry $dx^{2}$ or $dx^{3}$. So $\\frac{d}{dx}x^{3} = 3x^{2}$ — which the graph alone could never have told you." },
      { t: "The power rule is that argument in general", d: "Expanding $(x+dx)^{n}$ gives $x^{n}$, then $n$ terms that pick a single $dx$ from one of the $n$ parentheses — $n\\,x^{n-1}dx$ — then everything else, all carrying $dx^{2}$ or worse. So $\\frac{d}{dx}x^{n} = n x^{n-1}$." },
      { t: "$1/x$ is a puddle of fixed area", d: "Width $x$, height $1/x$, area always 1. Widen it by $dx$ and the height must drop by exactly enough to cancel the area gained. That drop is negative, which is where the minus sign in $-1/x^{2}$ comes from." },
      { t: "$\\sin\\theta$ is a height on the unit circle", d: "Step $d\\theta$ along the circumference. Zoomed in, the arc is a straight line and the little triangle is SIMILAR to the big one with angle $\\theta$ and hypotenuse 1. So $d(\\sin\\theta)/d\\theta$ is adjacent over hypotenuse — the definition of $\\cos\\theta$." },
    ],
    worked: "The graph tells you the shape, the meaning tells you the formula. The slope of $\\sin$ is clearly positive at 0, zero at the peak, negative after — and that is true of infinitely many functions. Only the unit-circle triangle pins it to exactly $\\cos\\theta$.",
    watch: "Keeping the $dx^{2}$ term because it looks like it should count. It is divided by $dx$ along with everything else, so one factor of $dx$ survives — and then vanishes as $dx\\to0$. Second-order terms never reach the answer.",
    concepts: [],
    checks: [
      { q: "The derivative of $\\sin\\theta$ is exactly $\\cos\\theta$ rather than merely something with the same peaks because:", opts: ["Both graphs are waves", "The nudge triangle on the unit circle is similar to the angle-$\\theta$ triangle, so the ratio IS adjacent over hypotenuse", "Sine and cosine are inverses", "$\\pi$ appears in both"], a: 1,
        expl: "Reading the graph gives the shape and nothing more — many functions share those peaks. The similar triangles turn $d(\\sin\\theta)/d\\theta$ into a ratio that is the definition of cosine." },
      { q: "By the power rule, the derivative of $x^{5}$ at $x=2$ is:", num: 80,
        expl: "$\\frac{d}{dx}x^{5} = 5x^{4}$, so at $x=2$ it is $5\\cdot16 = 80$. The 5 counts the parentheses from which the single $dx$ could have been chosen." },
    ],
  },

  "math120.0.3": {
    takeaway: "There are only three ways to combine functions — add, multiply, compose — so three rules cover every expression, however monstrous.",
    beats: [
      { t: "Three combinations, and that is all", d: "Subtracting is multiplying by $-1$ and adding. Dividing is composing with $1/x$ and multiplying. So sum, product and composition are the complete set, and any tangle of functions peels apart into layers of those three." },
      { t: "Sums stack, so their changes stack", d: "For $\\sin x + x^{2}$ the height is one bar on top of another. Nudge $x$ and the total change is the change in one plus the change in the other: $df = \\cos x\\,dx + 2x\\,dx$. The derivative of a sum is the sum of the derivatives." },
      { t: "Products are areas, so draw a box", d: "Sides $\\sin x$ and $x^{2}$, both adjustable as $x$ moves. Nudging $x$ adds a thin strip along the bottom, a thin strip along the side, and a negligible corner carrying $dx^{2}$." },
      { t: "Which is exactly \"left d right, right d left\"", d: "Bottom strip: $\\sin x \\cdot d(x^{2})$. Side strip: $x^{2}\\cdot d(\\sin x)$. Out of context the mnemonic is strange; as two rectangles it is obvious. A constant factor just scales the box, so it passes straight through." },
      { t: "Composition is three number lines", d: "$x$ on the first, $x^{2}$ on the second, $\\sin(x^{2})$ on the third. A nudge $dx$ produces a nudge $dh$ on the second line, which produces a nudge on the third. Name the middle value $h$ and the bookkeeping gets easy." },
      { t: "So the chain rule is a cancellation that is real", d: "$\\dfrac{dg}{dx} = \\dfrac{dg}{dh}\\cdot\\dfrac{dh}{dx}$. The $dh$ cancelling is not notational sleight of hand — it is literally the nudge on the middle line, measured once going in and once coming out." },
    ],
    worked: "Note which function the outer derivative eats. For $\\sin(x^{2})$ it is $\\cos(x^{2})$, not $\\cos x$ — the inside stays unaltered — and only then do you multiply by $2x$. Writing it $dg/dh$ rather than $dg/dx$ is the reminder.",
    watch: "Differentiating the outer function at $x$ instead of at the inner function's value. $\\frac{d}{dx}\\sin(x^{2})$ is $\\cos(x^{2})\\cdot 2x$; $\\cos(x)\\cdot2x$ is a different function entirely.",
    concepts: [],
    checks: [
      { q: "The product rule has two terms because:", opts: ["Products are commutative", "Nudging $x$ grows the box along two sides, adding one thin rectangle on each", "One term is for the corner", "Derivatives always come in pairs"], a: 1,
        expl: "Each side length is its own function of $x$, so each changes, and each change contributes a strip. The corner piece carries $dx^{2}$ and vanishes, which is why there are exactly two terms and not three." },
      { q: "By the chain rule, the derivative of $(x^{2})^{3}$ at $x=1$ is:", num: 6,
        expl: "With $h=x^{2}$: $\\frac{dg}{dh} = 3h^{2} = 3x^{4}$ and $\\frac{dh}{dx} = 2x$, so the product is $6x^{5}$, which is 6 at $x=1$. Expanding first gives $x^{6}$ and the same answer." },
    ],
  },

  "math120.0.4": {
    takeaway: "Every exponential is proportional to its own derivative, and $e$ is simply the base for which that proportionality constant is 1.",
    beats: [
      { t: "Over a whole day, the rate looks like the population", d: "A mass doubling daily goes 8 to 16 between day 3 and day 4 — a rate of 8 per day, which is the mass at the start. Tempting, but it compares across a full day, and the derivative asks about vanishing intervals." },
      { t: "The exponent law splits the problem in two", d: "$2^{t+dt} = 2^{t}\\cdot 2^{dt}$, so the difference quotient factors as $2^{t}\\cdot\\dfrac{2^{dt}-1}{dt}$. Turning addition in the exponent into multiplication outside is what links tiny steps to rates." },
      { t: "And the right-hand factor has no $t$ in it", d: "Plug small values in and $\\dfrac{2^{dt}-1}{dt}$ settles on about $0.6931$ — a constant, independent of where you started. So $\\frac{d}{dt}2^{t}$ is not itself, but is PROPORTIONAL to itself." },
      { t: "Different bases, different constants, and a pattern", d: "Base 3 gives $1.0986$; base 8 gives $2.079$, which is exactly three times base 2's constant. Not random. The question becomes: is there a base whose constant is 1?" },
      { t: "There is, and that is what defines $e$", d: "$e \\approx 2.71828$, and $e^{t}$ equals its own derivative. Asking why $e$ has this property is like asking why $\\pi$ is the circumference-to-diameter ratio — it is not a coincidence, it is the definition." },
      { t: "So the mystery constants are natural logs", d: "Write $2 = e^{\\ln 2}$, so $2^{t} = e^{(\\ln 2)t}$, and the chain rule gives derivative $(\\ln 2)\\cdot 2^{t}$. And $\\ln 2 = 0.6931$. Every mystery constant is the natural log of the base." },
    ],
    worked: "This is why applications write $e^{kt}$ rather than $a^{t}$. Population growth, a cup of water cooling, money compounding — all are rates proportional to the quantity itself, and writing them with base $e$ makes $k$ literally that proportionality constant.",
    watch: "Thinking $e$ is somehow built into a function written $e^{kt}$. Any exponential can be written in any base; choosing $e$ is a choice, made because it gives the exponent's constant a readable meaning.",
    concepts: [],
    checks: [
      { q: "$\\frac{d}{dt}2^{t}$ is proportional to $2^{t}$ because:", opts: ["2 is even", "$2^{t+dt}$ factors as $2^{t}\\cdot2^{dt}$, so everything depending on $dt$ separates from $t$ entirely", "The graph is a straight line", "Exponentials have no derivative"], a: 1,
        expl: "After factoring, the $dt$-dependent piece $\\frac{2^{dt}-1}{dt}$ contains no $t$, so it approaches a fixed number no matter where you started. The derivative is therefore that constant times the original function." },
      { q: "The proportionality constant for base 8 divided by the constant for base 2 is:", num: 3,
        expl: "Each constant is the natural log of the base, and $\\ln 8 = \\ln 2^{3} = 3\\ln 2$. So $2.079 / 0.6931 = 3$ exactly — the pattern is a law of logarithms, not a coincidence." },
    ],
  },

  "math120.0.5": {
    takeaway: "Implicit differentiation stops being strange once you read $2x\\,dx + 2y\\,dy$ as how much a two-variable expression changes under a step $(dx, dy)$.",
    beats: [
      { t: "An implicit curve has no input and no output", d: "$x^{2}+y^{2}=5^{2}$ is the set of points satisfying a property, not the graph of a function. So you cannot nudge \"the input\" — $x$ and $y$ are interdependent, and the usual derivative story does not apply." },
      { t: "The procedure looks like nonsense the first time", d: "Differentiate both sides: $x^{2}$ gives $2x\\,dx$, $y^{2}$ gives $2y\\,dy$, the constant gives 0. Rearranged, $dy/dx = -x/y$. It works — but what does differentiating an expression with two variables in it even mean?" },
      { t: "The ladder problem is the same equation with time in it", d: "A 5 m ladder slipping down a wall: $x(t)^{2}+y(t)^{2}=5^{2}$ holds at every instant, so its time-derivative is 0. That gives $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$ — and there the derivative has an obvious meaning." },
      { t: "The circle case is that, with $dt$ removed", d: "Name $s = x^{2}+y^{2}$, a function assigning a number to every point of the plane. Then $2x\\,dx + 2y\\,dy$ is a recipe: given where you are and which tiny step you take, it tells you how much $s$ changes. The nudges float free of any common variable." },
      { t: "Setting the derivative to 0 is the condition for staying on the curve", d: "On the circle $s$ is 25 and must remain 25, so $ds = 0$. That is exactly $2x\\,dx + 2y\\,dy = 0$. Strictly it keeps you on the TANGENT line, but for small enough steps those coincide." },
      { t: "Which turns into a way of deriving new formulas", d: "For $y = \\ln x$, rewrite as $e^{y} = x$. A step keeping you on the curve needs $e^{y}dy = dx$, so $dy/dx = 1/e^{y}$ — and on the curve $e^{y}$ IS $x$. Hence $\\frac{d}{dx}\\ln x = \\frac1x$." },
    ],
    worked: "For $\\sin(x)\\,y^{2} = x$: the left side changes by $\\sin x\\cdot 2y\\,dy + y^{2}\\cos x\\,dx$ (product rule), the right by $dx$. Setting them equal says both sides must change by the same amount — the only way the equation can keep holding.",
    watch: "Reading $ds=0$ as \"nothing changes\". The step is real and both $x$ and $y$ move; what stays fixed is the VALUE of the expression, which is what keeps you on the curve rather than drifting off it.",
    concepts: [],
    checks: [
      { q: "Setting the differentiated expression equal to zero means:", opts: ["The curve is flat", "The step $(dx,dy)$ keeps the expression's value unchanged, so it stays on the curve", "$x$ and $y$ are both zero", "The derivative does not exist"], a: 1,
        expl: "$2x\\,dx+2y\\,dy$ is how much $x^{2}+y^{2}$ changes under an arbitrary step. Requiring that change to be zero is requiring the point to remain at the same value — which is what being on the curve means." },
      { q: "On the circle $x^{2}+y^{2}=25$, the slope $dy/dx$ at the point $(3,4)$ is:", num: -0.75,
        expl: "$2x\\,dx+2y\\,dy=0$ gives $dy/dx = -x/y = -3/4$. The tangent is perpendicular to the radius, which the geometry confirms independently." },
    ],
  },

  "math120.0.6": {
    takeaway: "Limits exist to avoid talking about infinitely small changes, and once you have them the derivative can turn around and evaluate limits.",
    beats: [
      { t: "The formal definition is what you have been doing all along", d: "$f'(a) = \\lim_{h\\to0}\\dfrac{f(a+h)-f(a)}{h}$. The $h$ is the same thing as $dx$ — a concrete, finitely small number like $0.001$. A different letter is used only to make clear that nothing infinitesimal is involved." },
      { t: "Nothing here references an infinitely small change", d: "That is the point of limits. They let you ask what happens as a nudge shrinks without ever having to say what a nudge of size zero would mean. Reading $dx$ as a real nudge is not a crutch; it is a translation of this definition." },
      { t: "\"Approaches\" made airtight: epsilon and delta", d: "Pick any distance $\\varepsilon$ around the candidate value, however small. If a limit exists you can always find a range $\\delta$ around the input so that every input within $\\delta$ lands within $\\varepsilon$. The order matters: $\\varepsilon$ first, then $\\delta$." },
      { t: "And when the limit fails, it fails visibly", d: "A function jumping from 1 to 2 at the trouble point: shrink the input range as far as you like and the output range still straddles a gap of 1. No $\\delta$ works for $\\varepsilon = 0.4$, so no limit exists." },
      { t: "$0/0$ is the interesting case, and derivatives crack it", d: "If $f(a)=g(a)=0$, then near $a$ each is approximately its derivative times $dx$. The ratio is $\\dfrac{f'(a)\\,dx}{g'(a)\\,dx}$ and the $dx$ cancel, leaving $f'(a)/g'(a)$." },
      { t: "That is L'Hôpital's rule", d: "Differentiate top and bottom SEPARATELY — not as a quotient — and plug the trouble input back in. It cannot be used to discover derivative formulas, since it presupposes them; discovering those still takes the geometry." },
    ],
    worked: "$\\lim_{x\\to1}\\dfrac{\\sin(\\pi x)}{x^{2}-1}$. Both vanish at 1. The numerator changes by $\\pi\\cos(\\pi)\\,dx = -\\pi\\,dx$; the denominator by $2x\\,dx = 2\\,dx$. The $dx$ cancel and the limit is exactly $-\\pi/2$.",
    watch: "Applying L'Hôpital with the quotient rule. You differentiate numerator and denominator independently and then divide — the rule is about two separate derivatives, not the derivative of the fraction.",
    concepts: [],
    checks: [
      { q: "A limit fails to exist, in epsilon-delta terms, when:", opts: ["The function is undefined at the point", "Some $\\varepsilon$ exists for which no $\\delta$ is small enough to trap the outputs", "The graph is steep", "The derivative is zero"], a: 1,
        expl: "Being undefined at the point is normal — that is exactly the case limits handle. Failure means you can name a tolerance, say 0.4, that the output range never fits inside no matter how tight you squeeze the inputs." },
      { q: "By L'Hôpital's rule, $\\lim_{x\\to2}\\dfrac{x^{2}-4}{x-2}$ equals:", num: 4,
        expl: "Both parts vanish at $x=2$. Differentiating separately gives $2x$ over $1$, and at $x=2$ that is 4. Factoring as $(x+2)(x-2)/(x-2)$ gives the same answer." },
    ],
  },

  "math120.0.7": {
    takeaway: "The integral is the limit of a sum of thin rectangles, and you evaluate it by finding an antiderivative and looking at just two inputs.",
    beats: [
      { t: "Constant velocity would be easy, so pretend it is", d: "Distance is velocity times time, and on a velocity-against-time plot that product is literally an AREA. Chop $[0,8]$ into intervals of width $dt$ and treat the speed as constant across each one." },
      { t: "Which choice of constant does not matter", d: "Anywhere between the interval's start and end speed will do. What matters is only that the approximation improves as $dt$ shrinks — that pretending the car jumps between constant speeds becomes less wrong the finer the chopping." },
      { t: "$\\int_0^8 v(t)\\,dt$ says exactly that", d: "The stretched S is a sum, $v(t)\\,dt$ is one rectangle, and $dt$ does double duty: it is a factor in each term AND the spacing between samples. Shrink it and each rectangle shrinks while their number grows." },
      { t: "Let the upper bound vary and you get a function", d: "$s(T) = \\int_0^T v(t)\\,dt$ is the distance travelled after $T$ seconds. Nudge $T$ by $dT$ and the area grows by a sliver of height $v(T)$ and width $dT$ — so $ds/dT = v(T)$." },
      { t: "So integrating is undoing a derivative", d: "For $v = 8t - t^{2}$, ask what has that as its derivative: $4t^{2}$ gives $8t$, and $-\\tfrac13t^{3}$ gives $-t^{2}$. Any constant may be added, since constants differentiate to zero — hence the $+C$." },
      { t: "The fundamental theorem, and why it feels like cheating", d: "$\\int_a^b f = F(b) - F(a)$. Subtracting at the lower bound is what forces the integral from $a$ to $a$ to be zero, and it cancels whatever $C$ you chose. A sum over a whole continuum, computed from two numbers." },
    ],
    worked: "Integrals measure SIGNED area. Where the graph dips below the axis, $v(t)$ is negative, so $ds = v\\,dt$ is negative and the car moves backwards. That area subtracts — which is why the result is displacement rather than distance travelled.",
    watch: "Forgetting to subtract the antiderivative at the lower bound. $F(b)$ alone is only correct when $F(a)$ happens to be zero; otherwise the integral from $a$ to $a$ would not come out zero.",
    concepts: [],
    checks: [
      { q: "The derivative of the area-so-far function equals the height of the graph because:", opts: ["Areas and heights are the same units", "Nudging the right edge by $dT$ adds a sliver that is nearly a rectangle of height $f(T)$ and width $dT$", "The graph is a straight line", "Integrals and derivatives are unrelated"], a: 1,
        expl: "$dA \\approx f(T)\\,dT$, so $dA/dT = f(T)$. The approximation improves as $dT$ shrinks, which makes the limit exact — and that is the fundamental theorem." },
      { q: "With $v(t) = t(8-t)$, the distance travelled between $t=0$ and $t=6$ is:", num: 72,
        expl: "The antiderivative is $4t^{2}-\\tfrac13t^{3}$. At $t=6$ that is $144-72=72$; at $t=0$ it is 0. So the integral is $72 - 0 = 72$." },
    ],
  },

  "math120.0.8": {
    takeaway: "Averaging a continuous quantity is an integral divided by a width — and reading that as an average slope explains why antiderivatives solve integrals at all.",
    beats: [
      { t: "You cannot add infinitely many values and divide by infinity", d: "But you can sample finitely many, average those, and ask what happens as the sample grows. Whenever you want to add up values across a continuum and it does not make sense, the answer is almost always an integral." },
      { t: "Rewrite the finite average in terms of the spacing", d: "With samples spaced $dx$ apart across $[0,\\pi]$, there are about $\\pi/dx$ of them. Dividing the sum of heights by that count is the same as multiplying the sum by $dx$ and dividing by $\\pi$." },
      { t: "Which turns the numerator into an integral", d: "The terms become $\\sin(x)\\,dx$ — areas, not heights. So the average height is $\\dfrac{1}{\\pi}\\int_0^{\\pi}\\sin x\\,dx$: area divided by width. Even the units agree." },
      { t: "Evaluate it the usual way", d: "The antiderivative of $\\sin$ is $-\\cos$, whose slope does visibly track the sine graph's height. Between 0 and $\\pi$ its value rises by exactly 2, so the area is 2 and the average height is $2/\\pi \\approx 0.64$." },
      { t: "Now read $\\dfrac{F(b)-F(a)}{b-a}$ as a slope", d: "Rise over run on the antiderivative's graph, between the two endpoints. That is the second perspective the chapter is for." },
      { t: "And $f$ IS the slope of $F$ at every point", d: "So the average value of $f$ is the average of all those tangent slopes — and the average slope across a stretch of graph is just the overall slope from start to end. That is why comparing two endpoints suffices." },
    ],
    worked: "A second cue for reaching for an integral. The first was: the problem breaks into a sum of many small things. The second is: you understand an idea in a finite setting — an average, a count, an expectation — and want it over a continuous range. Probability is full of this.",
    watch: "Dividing the integral by the number of samples. The sample count has already been absorbed: once the terms carry $dx$, what you divide by is the WIDTH of the interval, not how many points you took.",
    concepts: [],
    checks: [
      { q: "The average value of $f$ on $[a,b]$ equals $\\frac{F(b)-F(a)}{b-a}$, which is also:", opts: ["The maximum of $f$", "The slope of the antiderivative's graph between the two endpoints", "The area under $F$", "The derivative of $f$"], a: 1,
        expl: "Rise over run on $F$. Since $f$ is by definition the slope of $F$ at each point, averaging $f$ is averaging those tangent slopes — and the average slope over a stretch is the overall slope end to end." },
      { q: "The area under $\\sin x$ from 0 to $\\pi$ is:", num: 2,
        expl: "The antiderivative is $-\\cos x$, which is $-(-1) = 1$ at $\\pi$ and $-1$ at 0. The change is $1-(-1) = 2$." },
    ],
  },

  "math120.0.9": {
    takeaway: "The second derivative is the derivative of the derivative — visually it is curvature, and physically it is acceleration.",
    beats: [
      { t: "It measures how the slope is changing", d: "Curving upwards means the slope is increasing, so the second derivative is positive. Curving downwards means it is negative. Where the graph is locally straight, there is no curvature and the second derivative is 0." },
      { t: "Sign and size are different questions", d: "Two graphs can both curve upwards at $x=4$ and have very different second derivatives — one where the slope rockets up, one where it creeps. The sign says which way it bends; the magnitude says how sharply." },
      { t: "Where the notation comes from", d: "Take two steps of size $dx$. The first changes $f$ by $df_1$, the second by $df_2$, and the difference between those changes is $ddf$ — proportional to $dx^{2}$, so about $0.0001$ when $dx = 0.01$. The second derivative is $ddf/(dx)^{2}$, written $\\dfrac{d^{2}f}{dx^{2}}$." },
      { t: "The most visceral reading is acceleration", d: "Distance, then velocity, then acceleration. A positive second derivative is the feeling of the seat pushing you forward; a negative one is slowing down. And the third derivative, genuinely, is called jerk." },
    ],
    worked: "This is the setup for Taylor series. Approximating a function near a point uses the value, then the slope, then the curvature, then the next order up — each higher derivative pinning down one more aspect of the shape.",
    watch: "Reading the $2$s in $\\frac{d^{2}f}{dx^{2}}$ as ordinary squares. The top counts how many times you differentiated; the bottom really is $(dx)^{2}$, because the change-in-the-change is second order in the step.",
    concepts: [],
    checks: [
      { q: "A graph curving downwards at a point has:", opts: ["A positive second derivative", "A negative second derivative, because the slope is decreasing there", "A zero first derivative", "No second derivative"], a: 1,
        expl: "Curvature direction IS the sign of the second derivative. The first derivative can be anything — steeply positive, zero, negative — while the graph bends downwards." },
      { q: "For $f(x)=x^{3}$, the second derivative at $x=3$ is:", num: 18,
        expl: "$f'(x) = 3x^{2}$ and $f''(x) = 6x$, so at $x=3$ it is 18. The graph of $x^{3}$ is bending upwards there, and the positive sign agrees." },
    ],
  },

  "math120.0.10": {
    takeaway: "Taylor series translate derivative information at a single point into approximation information near that point, by matching one derivative per coefficient.",
    beats: [
      { t: "Build the approximation one derivative at a time", d: "To fit $c_0+c_1x+c_2x^{2}$ to $\\cos x$ near 0: $c_0$ makes the values agree, $c_1$ makes the slopes agree, $c_2$ makes the curvatures agree. Each constant is responsible for exactly one derivative, and nothing else." },
      { t: "Which is why plugging in $x=0$ matters so much", d: "Every higher-order term carries an $x$, so at $x=0$ it washes out of every derivative below its own order. Adding a new term never disturbs the coefficients already chosen — that independence is what makes the construction work." },
      { t: "Factorials appear because the power rule cascades", d: "Differentiating $x^{n}$ $n$ times leaves $1\\cdot2\\cdots n$. So you do not set the coefficient equal to the derivative you want; you divide by $n!$ to cancel that. Hence $c_n = f^{(n)}(0)/n!$." },
      { t: "Cosine's derivatives cycle, so its coefficients do", d: "$\\cos,-\\sin,-\\cos,\\sin$, repeating; at 0 that is $1,0,-1,0$. So the polynomial is $1 - \\tfrac{x^{2}}{2} + \\tfrac{x^{4}}{24} - \\cdots$, and $1-\\tfrac{x^{2}}{2}$ is the best CUBIC approximation too, since $c_3$ comes out zero." },
      { t: "The second-order term is a triangle", d: "Approximate an area function near $a$: the rectangle $f(a)(x-a)$ plus the triangle on top of it, base $x-a$ and height $f'(a)(x-a)$, giving $\\tfrac12 f'(a)(x-a)^{2}$. Every term in the formula is a piece of that picture." },
      { t: "Infinitely many terms is a series, and it may not converge", d: "$e^{x}$ equals its Taylor series everywhere. $\\ln x$ expanded at 1 converges only for inputs in $(0,2)$ — outside that the partial sums thrash about. The width of the good region is the radius of convergence." },
    ],
    worked: "To approximate near some $a$ other than 0, write the polynomial in powers of $(x-a)$ and evaluate every derivative at $a$. It looks heavier, but all it does is make $a$ behave the way 0 did — so plugging in $x=a$ still kills everything but one term.",
    watch: "Assuming a Taylor series is valid wherever the function is. $\\ln x$ is perfectly well defined at $x=3$, but the derivative information gathered at $x=1$ does not reach that far, and the series diverges.",
    concepts: [],
    checks: [
      { q: "Taylor coefficients are divided by $n!$ because:", opts: ["Factorials make the numbers smaller", "Differentiating $x^{n}$ $n$ times produces a factor of $n!$, which must be cancelled", "The series would otherwise be infinite", "It makes the graph symmetric"], a: 1,
        expl: "Each application of the power rule drops the exponent in front, so $n$ of them leave $1\\cdot2\\cdots n$. Dividing by $n!$ makes the $n$-th derivative of the polynomial come out equal to $f^{(n)}(0)$ exactly." },
      { q: "Using $\\cos x \\approx 1 - \\tfrac{x^{2}}{2}$, the estimate of $\\cos(0.1)$ is:", num: 0.995,
        expl: "$1 - \\tfrac{0.01}{2} = 1 - 0.005 = 0.995$, which matches the true value to the digits shown. The next correction is $\\tfrac{0.0001}{24}$, about four millionths." },
    ],
  },

  "math120.0.11": {
    takeaway: "Read a function as a transformation of the number line and the derivative becomes a local stretch factor — a view that survives into contexts where graphs do not.",
    beats: [
      { t: "The slope reading is one view, not the definition", d: "What a derivative is really about is how sensitive the output is to a tiny nudge in the input. Slope is what that sensitivity looks like when you draw a graph — and graphs stop being drawable once inputs and outputs are not plain numbers." },
      { t: "So map the input line onto an output line instead", d: "Zoom in near an input and look at evenly spaced points. The derivative is the factor by which that cluster gets stretched or squeezed on arrival. For $x^{2}$ near 1 the spacing roughly doubles; near 3 it multiplies by about 6." },
      { t: "Every value of the derivative has a picture", d: "Less than 1 in magnitude means contraction. Zero means the neighbourhood collapses towards a point as you zoom further. Negative means the cluster is also FLIPPED — near $-2$, $x^{2}$ acts locally like multiplying by $-4$." },
      { t: "Which explains a puzzle about $1+\\frac1x$", d: "Its fixed points are $\\varphi \\approx 1.618$ and $-1/\\varphi \\approx -0.618$. Both satisfy the equation, yet hitting enter repeatedly on a calculator always lands on $\\varphi$, from any starting number." },
      { t: "Because stability is a statement about the derivative", d: "Near $\\varphi$ the derivative has magnitude about $0.38$, so each pass pulls the neighbourhood inward — a gravitational tug. Near the little brother it exceeds 2, so points are flung away. Stable and unstable fixed points." },
      { t: "The rule worth keeping", d: "A fixed point is stable when $|f'|$ there is less than 1 and unstable when it is greater. The sign only tells you whether the approach spirals or marches; the magnitude decides the fate." },
    ],
    worked: "This is the real reason to carry the view forward. Picturing a whole function as a transformation is clunkier than a graph for single-variable work, but multivariable calculus, complex analysis and differential geometry all live in places where no graph can be drawn.",
    watch: "Judging a fixed point by the derivative's sign. A derivative of $-0.38$ is stable and $-2$ is not, even though both are negative — it is the magnitude against 1 that decides.",
    concepts: [],
    checks: [
      { q: "A fixed point of $f$ is stable under repeated application when:", opts: ["$f'$ is positive there", "$|f'|$ there is less than 1, so nearby points contract towards it", "$f'$ is zero there", "$f$ is increasing"], a: 1,
        expl: "Each pass multiplies the distance from the fixed point by roughly $|f'|$. Below 1 that distance shrinks to nothing; above 1 it grows, and the point repels whatever you start with." },
      { q: "Read as a transformation, $x^{2}$ stretches a small cluster of points near the input 3 by a factor of:", num: 6,
        expl: "The stretch factor is the derivative: $\\frac{d}{dx}x^{2} = 2x$, which is 6 at $x=3$. Near $x=1$ the same function stretches by only 2." },
    ],
  },

  "math120.1.0": {
    takeaway: "The derivative is the slope of the tangent line, defined as the limit of secant slopes — and the difference quotient is the formula that makes it computable.",
    beats: [
      { t: "Drawing a tangent by eye is not a definition", d: "You can see the right line; a machine cannot. What distinguishes it is not that it touches once — a wiggly curve can be crossed repeatedly. The honest statement is a limit of SECANT lines $PQ$ as $Q$ slides towards $P$." },
      { t: "Two notations, and then one formula", d: "$\\Delta x$ is the horizontal step, $\\Delta f$ the resulting rise, and $\\Delta f/\\Delta x$ is the secant's slope. Then $f'(x_0) = \\lim_{\\Delta x\\to0}\\dfrac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$ — the difference quotient, and everything else follows from it." },
      { t: "Worked on $1/x$, and the cancellation is the point", d: "Over a common denominator the $x_0$ terms cancel and one $\\Delta x$ divides out. Only THEN can you set $\\Delta x = 0$ — before the cancellation you have $0/0$. The answer is $-1/x_0^{2}$: negative, and flattening as $x_0$ grows, both of which the graph confirms." },
      { t: "The binomial theorem gives the power rule", d: "$(x+\\Delta x)^{n} = x^{n} + nx^{n-1}\\Delta x + O(\\Delta x^{2})$. The $x^{n}$ cancels, one $\\Delta x$ divides out, and the $O(\\Delta x^{2})$ junk still carries a $\\Delta x$ and vanishes. So $\\frac{d}{dx}x^{n} = nx^{n-1}$, and polynomials follow term by term." },
      { t: "Calculus gets a bad name because of the context around it", d: "The calculus step in a word problem is usually one line. Everything else — intercepts, substitution, algebra — is what you already knew, and it is where the difficulty actually lives." },
      { t: "And the deliberate sloppiness with letters", d: "In the tangent-line problem $y$ means the curve's height in one line and the equation $y=0$ of a horizontal line two lines later. Mathematicians reuse letters rather than invent eight; you have to track which role each one is playing." },
    ],
    worked: "Tangent to $y=1/x$ at $(x_0,y_0)$, with the axes, encloses a triangle. Setting $y=0$ gives the $x$-intercept $2x_0$; by the symmetry $x \\leftrightarrow y$ of $xy=1$, the $y$-intercept is $2y_0$. Area $= \\tfrac12(2x_0)(2y_0) = 2x_0y_0 = 2$ — the same for every point.",
    watch: "Setting $\\Delta x = 0$ before simplifying. The quotient is $0/0$ until the cancellation is done; the algebra is what makes the limit exist, not a formality before it.",
    concepts: [],
    checks: [
      { q: "The tangent line is defined as a limit of secants rather than as \"the line touching once\" because:", opts: ["Secants are easier to draw", "A curve can meet a line more than once and still be tangent there, so touching count does not characterise it", "Tangent lines never cross the curve", "Limits are required by convention"], a: 1,
        expl: "A wiggly curve may cross its tangent line again elsewhere. What actually pins the tangent down is that secant slopes through a nearby point converge to it as that point approaches." },
      { q: "The triangle cut off by the axes and a tangent to $y=1/x$ has area:", num: 2,
        expl: "The intercepts are $2x_0$ and $2y_0$, so the area is $\\tfrac12(2x_0)(2y_0) = 2x_0y_0$. On this curve $x_0y_0=1$, so the area is 2 regardless of where the tangent touches." },
    ],
  },

  "math120.1.1": {
    takeaway: "A derivative is a rate of change, and making that rigorous means separating left and right limits — which is also what makes continuity definable.",
    beats: [
      { t: "The same ratio, read as a rate", d: "$\\Delta y/\\Delta x$ is the AVERAGE rate of change over the interval; $dy/dx$ is the instantaneous one. Charge gives current, distance gives speed, temperature gives the gradient that drives weather." },
      { t: "The pumpkin drop makes the difference visceral", d: "From 80 m, $h = 80-5t^{2}$ reaches the ground at $t=4$. Average speed is $-20$ m/s. But $h' = -10t$, so at impact it is $-40$ m/s — twice the average, about 90 mph. Nobody at the event cares about the average." },
      { t: "Sensitivity of measurement is the third use", d: "GPS measures a distance $h$ with some error $\\Delta h$ and deduces a horizontal distance $L$. How bad the error in $L$ is comes from $\\Delta L/\\Delta h \\approx dL/dh$. That is why derivatives matter for landing aircraft." },
      { t: "Easy limits versus the limits derivatives need", d: "$\\lim_{x\\to4}\\frac{x+3}{x^{2}+1}$ is done by substituting. A derivative NEVER is: plugging in gives $0/0$ every single time, so some cancellation is always required first." },
      { t: "Left and right limits, and the zoo of discontinuities", d: "A jump has both one-sided limits existing but unequal. A removable one has them equal with a hole — $\\frac{\\sin x}{x}$ at 0 is the important case. An infinite one splits: $1/x$ goes to $+\\infty$ from the right and $-\\infty$ from the left, so writing a single limit there is simply wrong." },
      { t: "Differentiable implies continuous, in one line", d: "$\\lim(f(x)-f(x_0)) = \\lim\\frac{f(x)-f(x_0)}{x-x_0}\\cdot(x-x_0) = f'(x_0)\\cdot 0 = 0$. Multiplying and dividing by $x-x_0$ is legal precisely because the limit never evaluates AT $x_0$, so that factor is small but never zero." },
    ],
    worked: "The derivative graph looks nothing like the function's. $1/x$ has two branches, one rising and one falling; $-1/x^{2}$ is negative everywhere and dives to $-\\infty$ on both sides. What it plots is the SLOPE, and slope has its own shape.",
    watch: "Writing $\\lim_{x\\to0}\\frac1x = \\infty$. The two sides disagree: $+\\infty$ from the right and $-\\infty$ from the left. Specify the side, or say the limit does not exist.",
    concepts: [],
    checks: [
      { q: "Multiplying and dividing by $(x-x_0)$ inside a limit is legal because:", opts: ["Zero times anything is zero", "The limit never evaluates at $x = x_0$, so that factor is always non-zero", "Limits ignore algebra", "$x_0$ is always positive"], a: 1,
        expl: "A limit as $x\\to x_0$ deliberately excludes $x=x_0$ itself. The factor is arbitrarily small but never zero, so the division is valid at every point the limit actually looks at." },
      { q: "For $h = 80 - 5t^{2}$, the speed at impact ($t=4$) in metres per second is:", num: -40,
        expl: "$h'(t) = -10t$, so $h'(4) = -40$. The average speed over the fall was only $-20$, since the pumpkin started at rest." },
    ],
  },

  "math120.1.2": {
    takeaway: "Both trig derivatives come from two limits at zero, and those two limits come from one geometric fact: short pieces of curve are nearly straight.",
    beats: [
      { t: "Two kinds of formula, and you need both", d: "SPECIFIC ones give a named function's derivative — $x^{n}$, $1/x$, $\\sin x$. GENERAL ones combine what you have — sums, constant multiples, and soon products and quotients. A handful of each generates everything." },
      { t: "Expand with the sum formula, then group to keep $0/0$ together", d: "$\\sin(x+\\Delta x) = \\sin x\\cos\\Delta x + \\cos x\\sin\\Delta x$. Subtracting $\\sin x$ and grouping gives $\\sin x\\cdot\\frac{\\cos\\Delta x-1}{\\Delta x} + \\cos x\\cdot\\frac{\\sin\\Delta x}{\\Delta x}$. The grouping is the whole trick: a term that is not over a zero becomes meaningless." },
      { t: "Two limits do all the work", d: "(A) $\\frac{\\cos\\Delta x - 1}{\\Delta x}\\to0$ and (B) $\\frac{\\sin\\Delta x}{\\Delta x}\\to1$. So $\\frac{d}{dx}\\sin x = \\cos x$, and the same expansion for cosine gives $\\frac{d}{dx}\\cos x = -\\sin x$." },
      { t: "Those two limits ARE the derivatives at zero", d: "(B) is $\\frac{d}{dx}\\sin x$ at $x=0$; (A) is $\\frac{d}{dx}\\cos x$ at $x=0$. So knowing the rate of change at one single place delivers it at every place — that is the structure of the proof." },
      { t: "Why (B) is 1: the bow and the bowstring", d: "On the unit circle, $2\\sin\\theta$ is the chord and $2\\theta$ is the arc. As $\\theta$ closes, the curve and the straight segment merge in length, so their ratio goes to 1. Short curves are nearly straight." },
      { t: "Why (A) is 0: the gap closes faster", d: "$1-\\cos\\theta$ is the tiny gap between the bowstring and the bow, and $\\theta$ is the arc. Both go to zero, but the gap goes far faster — so the ratio goes to 0, not to 1." },
    ],
    worked: "A second proof, for all $\\theta$ at once: move a point round the unit circle by $\\Delta\\theta$. The chord has length about $\\Delta\\theta$ and is nearly perpendicular to the radius, so the angle in the little triangle is again $\\theta$. Hence $\\Delta y \\approx \\Delta\\theta\\cos\\theta$.",
    watch: "Using degrees. Every one of these arguments compares an ARC LENGTH with a vertical distance, so the angle must be measured as length along the unit circle. In degrees the formulas are simply wrong.",
    concepts: [],
    checks: [
      { q: "$\\frac{d}{dx}\\sin x = \\cos x$ holds only when $x$ is in radians because:", opts: ["Radians are more modern", "The proof compares the arc length $\\theta$ with a chord, so the angle must be measured as length on the unit circle", "Degrees make sine negative", "Cosine is undefined in degrees"], a: 1,
        expl: "The limit $\\frac{\\sin\\theta}{\\theta}\\to1$ says a chord and an arc have the same length in the limit. That is a statement about two lengths, and it fails if $\\theta$ is counted in 360ths of a turn." },
      { q: "The derivative of $\\sin x$ at $x = \\pi/3$ is:", num: 0.5,
        expl: "It is $\\cos(\\pi/3) = \\tfrac12$. The sine graph is still rising there, but less steeply than at 0, where the derivative is 1." },
    ],
  },

  "math120.1.3": {
    takeaway: "Product, quotient and chain rules are proved the same way — write the change, add and subtract a middle term, divide by $\\Delta x$ — and the chain rule is the one that sets you free.",
    beats: [
      { t: "The product rule comes from changing one factor at a time", d: "Write $\\Delta(uv)$, then add and subtract $u(x)v(x+\\Delta x)$. The middle terms cancel and what is left is $\\Delta u\\cdot v(x+\\Delta x) + u(x)\\cdot\\Delta v$. Divide by $\\Delta x$ and let it go: $(uv)' = u'v + uv'$." },
      { t: "Continuity does the last step", d: "In the limit, $v(x+\\Delta x)\\to v(x)$ — and that is exactly the theorem that differentiable implies continuous. It is where that earlier result gets used." },
      { t: "The quotient rule, by the same method", d: "Put the difference over a common denominator, watch $uv$ cancel twice, and $\\left(\\frac uv\\right)' = \\dfrac{u'v - uv'}{v^{2}}$. Ugly, and it has to be memorised in the right order, because the numerator is not symmetric." },
      { t: "Which quietly extends the power rule", d: "Take $u=1$ and $v=x^{n}$: the quotient rule gives $-nx^{-n-1}$. That is the SAME formula $\\frac{d}{dx}x^{m} = mx^{m-1}$, now with $m$ negative. One rule, one proof, twice the range." },
      { t: "The chain rule is almost algebra", d: "$\\dfrac{\\Delta y}{\\Delta t} = \\dfrac{\\Delta y}{\\Delta x}\\cdot\\dfrac{\\Delta x}{\\Delta t}$ — the middle change genuinely cancels. In the limit, $\\dfrac{dy}{dt} = \\dfrac{dy}{dx}\\cdot\\dfrac{dx}{dt}$. Naming the inner value $x$ makes it obvious; with practice you skip the name." },
      { t: "Higher derivatives, and $D^{n}x^{n} = n!$", d: "Differentiating $x^{n}$ repeatedly brings the exponent down each time: $n$, then $n-1$, down to 1. After $n$ passes the product of those is $n!$ and no $x$ remains — so the next derivative is 0." },
    ],
    worked: "$\\frac{d}{dt}(\\sin t)^{10}$. Outside is the tenth power, inside is $\\sin t$. Differentiate the outside at the inside value: $10(\\sin t)^{9}$. Multiply by the inside's derivative: $\\cos t$. Answer $10\\sin^{9}t\\cos t$.",
    watch: "Reversing the quotient rule's numerator. It is $u'v - uv'$, and $uv' - u'v$ is its negative — a sign error that survives every later step. The product rule is symmetric; this one is not.",
    concepts: [],
    checks: [
      { q: "The power rule holds for negative exponents because:", opts: ["It was assumed from the start", "Applying the quotient rule to $1/x^{n}$ produces exactly $mx^{m-1}$ with $m=-n$", "Negative powers are undefined", "The chain rule covers it"], a: 1,
        expl: "With $u=1$, the quotient rule gives $-v'/v^{2} = -nx^{n-1}/x^{2n} = -nx^{-n-1}$ — the same formula with the exponent negative in both places. Nothing new had to be assumed." },
      { q: "The fifth derivative of $x^{5}$ is the constant:", num: 120,
        expl: "Each pass drops the exponent in front: $5\\cdot4\\cdot3\\cdot2\\cdot1 = 5! = 120$. The sixth derivative is 0, since a constant differentiates to nothing." },
    ],
  },

  "math120.1.4": {
    takeaway: "Differentiate the equation you were given instead of solving it first, and both fractional powers and every inverse function fall out.",
    beats: [
      { t: "Fractional powers, via an integer equation", d: "$y = x^{m/n}$ is not yet differentiable by anything you know. But $y^{n} = x^{m}$ is. Differentiate that with the chain rule, solve for $y'$, substitute $y$ back — and the exponent arithmetic collapses to $\\frac{m}{n}x^{m/n-1}$. The power rule now covers every rational exponent." },
      { t: "The method in one line", d: "Apply $\\frac{d}{dx}$ to BOTH sides of the equation, treating $y$ as a function of $x$ so every $y$ term picks up a $y'$. Then solve for $y'$ algebraically." },
      { t: "On the circle it beats the explicit route", d: "$x^{2}+y^{2}=1$ differentiates to $2x+2yy'=0$, so $y' = -x/y$ — three symbols. Solving for $y$ first forces a square root, a chain rule, and a choice of branch, and the answers agree." },
      { t: "And it handles both branches at once", d: "$-x/y$ is correct above and below the axis without comment: on the lower half $y$ is negative, so the slope comes out positive, exactly as the picture shows." },
      { t: "The gain grows with the mess", d: "$y^{4}+xy^{2}-2=0$ has a quartic solution with nested radicals and up to four branches. Implicitly it is two lines. You still need a point — at $(1,1)$ the slope is $-\\tfrac16$ — but you never have to DIFFERENTIATE the monstrous formula." },
      { t: "Every inverse function, for free", d: "$y=\\arctan x$ means $\\tan y = x$. Differentiate: $\\frac{y'}{\\cos^{2}y} = 1$, so $y' = \\cos^{2}y$. Draw the right triangle with legs $x$ and 1, read $\\cos y = 1/\\sqrt{1+x^{2}}$, and the answer is $\\dfrac{1}{1+x^{2}}$." },
    ],
    worked: "The same three steps give $\\frac{d}{dx}\\arcsin x$. From $\\sin y = x$: $(\\cos y)y' = 1$, so $y' = 1/\\cos y$, and the triangle gives $\\cos y = \\sqrt{1-x^{2}}$. Answer $\\dfrac{1}{\\sqrt{1-x^{2}}}$.",
    watch: "Leaving the answer in terms of $y$. $\\cos^{2}(\\arctan x)$ is correct and useless; the triangle is what converts it into a formula in $x$ alone, and for trig functions it always simplifies.",
    concepts: [],
    checks: [
      { q: "Implicit differentiation is preferred for $y^{4}+xy^{2}-2=0$ because:", opts: ["The explicit solution does not exist", "You never have to differentiate the quartic formula — two lines give $y'$ in terms of $x$ and $y$", "It avoids the chain rule", "It gives a simpler curve"], a: 1,
        expl: "The explicit solution exists but is a nest of radicals with several branches. Implicit differentiation needs a point on the curve, but the differentiation itself stays trivial." },
      { q: "The derivative of $\\arctan x$ at $x = 2$ is:", num: 0.2,
        expl: "$\\frac{d}{dx}\\arctan x = \\dfrac{1}{1+x^{2}}$, so at $x=2$ it is $\\tfrac15 = 0.2$. The arctangent is flattening towards its horizontal asymptote at $\\pi/2$." },
    ],
  },

  "math120.1.5": {
    takeaway: "There is exactly one base whose exponential is its own derivative, and defining $e$ to be that base is what makes every other exponential and every logarithm differentiable.",
    beats: [
      { t: "The difference quotient factors", d: "For $f(x)=a^{x}$, $\\dfrac{a^{x+\\Delta x}-a^{x}}{\\Delta x} = a^{x}\\cdot\\dfrac{a^{\\Delta x}-1}{\\Delta x}$. The $a^{x}$ comes out because the exponential law says so, and what is left does not mention $x$ at all." },
      { t: "So the whole problem is one number", d: "That leftover limit is a constant depending only on $a$. Call it $M(a)$. Then $\\frac{d}{dx}a^{x} = M(a)\\,a^{x}$ — every exponential is proportional to its own derivative, and $M(a)$ is the constant of proportionality." },
      { t: "And that number is a slope you can point at", d: "Put $x=0$: $\\frac{d}{dx}a^{x}\\big|_{0} = M(a)\\cdot a^{0} = M(a)$. So $M(a)$ is simply the slope of $y=a^{x}$ where it crosses the $y$-axis at height 1." },
      { t: "Define $e$ as the base that makes it 1", d: "$M(2)\\approx 0.693$ and $M(4)\\approx 1.386$ — under 1 and over 1 — so somewhere between is a base with $M=1$. Name it $e$. Then $\\dfrac{d}{dx}e^{x} = e^{x}$, exactly." },
      { t: "Why such a base has to exist", d: "Replacing $a$ by $a^{k}$ stretches the graph horizontally by $1/k$, which multiplies the slope at 0 by $k$: $M(a^{k}) = kM(a)$. Choosing $k = 1/M(2)$ manufactures the base you want, so $e = 2^{1/M(2)}$." },
      { t: "The log comes back by implicit differentiation", d: "$y = \\ln x$ means $e^{y} = x$. Differentiate: $e^{y}y' = 1$, so $y' = 1/e^{y} = 1/x$. The awkward function $\\ln$ has the cleanest derivative in the subject." },
      { t: "Two ways to differentiate any $a^{x}$", d: "Either rewrite $a^{x} = e^{(\\ln a)x}$ and use the chain rule, or take logs first — $\\ln u = x\\ln a$, differentiate both sides to get $u'/u = \\ln a$. Both give $\\frac{d}{dx}a^{x} = (\\ln a)a^{x}$, and both show $M(a) = \\ln a$." },
      { t: "Logarithmic differentiation earns its keep on $x^{x}$", d: "It is neither a power ($x^{n}$, fixed exponent) nor an exponential ($a^{x}$, fixed base), so no rule applies. But $\\ln u = x\\ln x$, so $u'/u = 1 + \\ln x$, and $\\frac{d}{dx}x^{x} = x^{x}(1+\\ln x)$." },
    ],
    worked: "The compound-interest limit $\\lim_{n\\to\\infty}(1+1/n)^{n}$ is the derivative of $\\ln$ at $x=1$ in disguise. Since $\\ln'(1)=1$, the difference quotient $\\frac{\\ln(1+1/n)-\\ln 1}{1/n} = n\\ln(1+1/n) = \\ln\\big((1+1/n)^{n}\\big)$ tends to 1 — so the thing inside the log tends to $e$.",
    watch: "Treating $M(a)$ as if it were 1 for every base. It is 1 only for $e$; in general it is $\\ln a$, which is why $\\frac{d}{dx}2^{x}$ is $0.693\\cdot 2^{x}$ and not $2^{x}$.",
    concepts: [],
    checks: [
      { q: "What is $M(a)$, the constant with $\\frac{d}{dx}a^{x} = M(a)a^{x}$?", opts: ["The value of $a$ itself", "The slope of $y=a^{x}$ at $x=0$, which turns out to be $\\ln a$", "Always 1", "The $y$-intercept of $a^{x}$"], a: 1,
        expl: "Setting $x=0$ in the formula gives $M(a)$ directly as the slope at the $y$-intercept, and the base-$e$ rewrite identifies it as $\\ln a$." },
      { q: "The derivative of $x^{x}$ at $x = 1$ is:", num: 1,
        expl: "$\\frac{d}{dx}x^{x} = x^{x}(1+\\ln x)$, and at $x=1$ that is $1\\cdot(1+0) = 1$. Neither the power rule nor the exponential rule applies here — logarithmic differentiation is what gets it." },
    ],
  },

  "math120.1.6": {
    takeaway: "Exam 1 is Unit I in two columns: five general rules that combine functions, and a memorised list of specific derivatives — plus the ability to read the definition of the derivative backwards.",
    beats: [
      { t: "The five general rules", d: "Sum, constant multiple, product, quotient, chain — and implicit differentiation as a sixth technique rather than a formula. Inverse functions and logarithmic differentiation are both implicit differentiation wearing different clothes." },
      { t: "The specific list you must simply know", d: "$x^{r}$ (now for every real $r$, not just rational), $\\sin$, $\\cos$, $\\tan$, $\\sec$, $e^{x}$, $\\ln x$, $\\arctan$, $\\arcsin$. Cosecant and cotangent are not on the list because everything reduces to these." },
      { t: "$x^{r}$ for irrational $r$, both ways", d: "Base $e$: $x^{r} = e^{r\\ln x}$, chain rule, done. Logarithmic: $\\ln u = r\\ln x$, so $u'/u = r/x$. Both give $rx^{r-1}$, and the proof never cared whether $r$ was rational." },
      { t: "The chain rule in one sentence", d: "If $y$ moves 10 times as fast as $x$ and $x$ moves 5 times as fast as $t$, then $y$ moves 50 times as fast as $t$. Substituting $10(5t+a)+b = 50t + \\ldots$ makes it algebra; rates multiply." },
      { t: "You can dodge the quotient rule", d: "$(1/v)' = (v^{-1})' = -v^{-2}v'$ by the chain rule — which is also where the minus sign in the quotient rule comes from. $\\sec x = (\\cos x)^{-1}$ differentiates to $\\sin x/\\cos^{2}x$, conventionally written $\\sec x\\tan x$." },
      { t: "Pick the rule before you start writing", d: "$(x^{10}+8x)^{6}$ expanded is a page of exam paper; by the chain rule it is $6(x^{10}+8x)^{5}(10x^{9}+8)$ on one line. Do not simplify unless asked — any correct form is a correct answer." },
      { t: "Which derivatives you may be asked to derive from the definition", d: "The ones actually done that way in lecture: $1/x$, $x^{n}$, $\\sin$, $\\cos$, $a^{x}$, and the product and quotient rules themselves. Nothing requires going all the way back to first principles for the rest." },
      { t: "Read the definition backwards to kill a limit", d: "$\\lim_{u\\to0}\\frac{e^{u}-1}{u}$ is not a limit to be fought — it is $\\frac{d}{du}e^{u}$ at $u=0$, which is 1. Any difference quotient in disguise can be evaluated by recognising whose derivative it is." },
      { t: "Differentiability means the two tangents agree", d: "There is only one test: compute the left and the right tangent and check they are equal. Sketching $y'$ underneath $y$ is the geometric half — the derivative of $\\ln x$ is $1/x$, and the two graphs look nothing like each other." },
    ],
    worked: "The promised hardest one: $\\frac{d}{dx}e^{x\\arctan x}$. Chain rule first, giving $e^{x\\arctan x}$ times the derivative of the exponent; then the product rule on $x\\arctan x$, giving $\\arctan x + \\dfrac{x}{1+x^{2}}$. Four of the listed formulas in one expression, and it fits on a line.",
    watch: "Expecting the graph of $f'$ to resemble the graph of $f$. It does not — it records the slope at each point, so a curve that rises ever more slowly has a derivative that falls towards zero while staying positive.",
    concepts: [],
    checks: [
      { q: "The cleanest way to evaluate $\\lim_{u\\to0}\\dfrac{e^{u}-1}{u}$ is to:", opts: ["Apply L'Hopital twice", "Recognise it as the derivative of $e^{u}$ at $u=0$, which is 1", "Expand $e^{u}$ as a product", "Substitute $u = 1/k$ and take $k\\to\\infty$"], a: 1,
        expl: "It is the difference quotient for $e^{u}$ at 0 written out in full. Reading the definition of the derivative in reverse turns a limit problem into a lookup." },
      { q: "The derivative of $e^{x\\arctan x}$ at $x = 1$, to three decimal places, is:", num: 2.819,
        expl: "$e^{x\\arctan x}\\left(\\arctan x + \\frac{x}{1+x^{2}}\\right)$ at $x=1$ is $e^{\\pi/4}(\\pi/4 + 1/2) = 2.193\\times1.285 = 2.819$." },
    ],
  },

  "math120.1.7": {
    takeaway: "Replacing a hard function by its tangent line near one point is the whole of linear approximation, and the second derivative supplies the curvature the line cannot see.",
    beats: [
      { t: "One formula, and it is the tangent line", d: "$f(x) \\approx f(x_{0}) + f'(x_{0})(x-x_{0})$. The right-hand side is exactly the equation of the tangent at $x_{0}$, so the claim is only that a curve looks like its tangent near the point of tangency — and nowhere else." },
      { t: "It is the definition of the derivative, read forwards", d: "The derivative says $\\Delta f/\\Delta x \\to f'(x_{0})$. Turn that round: for small $\\Delta x$, $\\Delta f \\approx f'(x_{0})\\Delta x$. Multiply out and you have the boxed formula. Average rate and instantaneous rate, swapped." },
      { t: "Always expand about 0, and memorise five", d: "With $x_{0}=0$ the formula is $f(x)\\approx f(0)+f'(0)x$. That gives $\\sin x \\approx x$, $\\cos x \\approx 1$, $e^{x}\\approx 1+x$, $\\ln(1+x)\\approx x$ and $(1+x)^{r}\\approx 1+rx$ — each one just $f(0)$ and $f'(0)$ read off a two-column table." },
      { t: "Why $\\ln(1+x)$ and not $\\ln x$", d: "The logarithm has no tangent line at 0 — it dives to $-\\infty$. Shifting to $\\ln(1+x)$ puts the expansion point where the function is well behaved. Same for $(1+x)^{r}$: $x^{r}$ at 0 can have infinite slope." },
      { t: "The right-hand side is the EASY side", d: "It looks backwards, because the approximation is longer to write. But $\\ln(1.1)$ needs a calculator and $1/10$ does not. That trade — an exact ugly thing for an inexact simple one — is the entire point." },
      { t: "Combine the library instead of differentiating", d: "For $e^{-3x}/\\sqrt{1+x}$, write it as $e^{-3x}(1+x)^{-1/2} \\approx (1-3x)(1-\\tfrac12 x)$ and multiply out. Discard the $x^{2}$ term — you already threw away infinitely many others getting here — and the answer is $1-\\tfrac72 x$." },
      { t: "A real one: GPS time dilation", d: "$T' = T(1-v^{2}/c^{2})^{-1/2} \\approx T(1+\\tfrac12 v^{2}/c^{2})$. At $v\\approx4$ km/s the correction is about $10^{-10}$ — a millimetre of position — and the engineers pre-offset the satellites' broadcast frequency by exactly this. The $u^{2}$ term is $10^{-20}$ and was rightly ignored." },
      { t: "Quadratic approximation adds the curvature", d: "$f(x)\\approx f(x_{0})+f'(x_{0})(x-x_{0})+\\dfrac{f''(x_{0})}{2}(x-x_{0})^{2}$. For $\\cos x$ the line $y=1$ cannot even say which side of 1 the curve is on; $1-\\tfrac12 x^{2}$ is the best-fitting parabola and answers that." },
    ],
    worked: "$\\ln(1.1)$: linear gives $x = 0.1$. Quadratic gives $x - \\tfrac12 x^{2} = 0.1 - 0.005 = 0.095$, and the true value is $0.0953\\ldots$ — the correction buys two more digits for one multiplication.",
    watch: "Keeping quadratic debris in a linear answer. When $(1-3x)(1-\\tfrac12 x)$ produces a $\\tfrac32 x^{2}$, it is not a bonus term — it is one of infinitely many quadratic contributions you have already dropped, so keeping it makes the answer less honest, not more.",
    concepts: [],
    checks: [
      { q: "Why is $\\sin x \\approx x$ also the QUADRATIC approximation of $\\sin$ near 0?", opts: ["Sine is linear near 0", "$f''(0) = -\\sin 0 = 0$, so the $x^{2}$ term vanishes", "The quadratic rule does not apply to trig functions", "Because $\\cos 0 = 1$"], a: 1,
        expl: "The second derivative of $\\sin$ is $-\\sin$, which is 0 at 0. The first correction to $\\sin x \\approx x$ is cubic, which is why the approximation is unusually good." },
      { q: "The coefficient of $x$ in the linear approximation of $e^{-3x}/\\sqrt{1+x}$ near 0 is:", num: -3.5,
        expl: "It is $f'(0)$. Multiplying the two library approximations gives $-3 - \\tfrac12 = -\\tfrac72$, without ever running the quotient rule on that expression." },
      { q: "The quadratic approximation of $\\ln(1.1)$, to three decimal places, is:", num: 0.095,
        expl: "$\\ln(1+x) \\approx x - \\tfrac12 x^{2}$ at $x = 0.1$ gives $0.1 - 0.005 = 0.095$, which agrees with the true $0.09531$ to three places." },
    ],
  },

  "math120.1.8": {
    takeaway: "The sign of $f'$ says which way the curve goes and the sign of $f''$ says which way it bends — but the ends of the graph, the ones off the screen, are the part only you can supply.",
    beats: [
      { t: "Where the $\\tfrac12$ comes from", d: "Test the formula on a parabola $a+bx+cx^{2}$, whose quadratic approximation must be itself. $f(0)=a$, $f'(0)=b$, but $f''(0)=2c$ — so recovering $c$ needs half of it. No other constant could work." },
      { t: "The catalog, second order", d: "$\\sin x \\approx x$ (no $x^{2}$ term at all), $\\cos x \\approx 1-\\tfrac12 x^{2}$, $e^{x}\\approx 1+x+\\tfrac12 x^{2}$, $\\ln(1+x)\\approx x-\\tfrac12 x^{2}$, and $(1+x)^{r}\\approx 1+rx+\\tfrac{r(r-1)}{2}x^{2}$. All only for $x$ near 0." },
      { t: "Use quadratic only when forced", d: "Always try linear first. Quadratic is messier and buys one thing: a rate of convergence. $\\ln a_{k}\\to1$ is the linear statement; the $x^{2}$ term is what tells you the gap shrinks like $1/k$ rather than merely that it shrinks." },
      { t: "Multiplying them out is easy for one reason", d: "$e^{-3x}(1+x)^{-1/2}$ looks like a brutal product, but you discard every power above $x^{2}$ as you go, so only a handful of cross terms survive: $1 - \\tfrac72 x + \\tfrac{51}{8}x^{2}$." },
      { t: "Sketching, principle one", d: "$f' > 0 \\Rightarrow f$ increasing; $f' < 0 \\Rightarrow f$ decreasing. That is the tangent-line picture again: if the tangent points up, so does the curve." },
      { t: "Principle two, one level up", d: "$f'' > 0$ means $f'$ is increasing — the slope is getting larger, even if it is still negative — and that is exactly what CONCAVE UP means. $f'' < 0$ is concave down." },
      { t: "Critical points are where $f'=0$", d: "For $f = 3x - x^{3}$, $f' = 3(1-x)(1+x)$, positive strictly between $-1$ and 1 and negative outside. So $x = \\pm1$ are the critical points, and the critical VALUES $f(\\pm1) = \\pm2$ are what you actually plot." },
      { t: "Do not abandon precalculus", d: "That $f(0)=0$, that the function is odd, that $3x-x^{3}$ behaves like $-x^{3}$ far out — none of that is calculus, and all of it constrains the picture. The derivatives fill in what common sense could not reach." },
      { t: "Check the ends, because a plotter cannot", d: "As $x\\to+\\infty$ the cubic term dominates and $f\\to-\\infty$; as $x\\to-\\infty$, $f\\to+\\infty$. This is the one part of curve sketching a graphing calculator genuinely cannot do, because it is off the screen." },
      { t: "Inflection points are the decoration", d: "$f'' = -6x$ changes sign at 0, so the curve switches from concave up to concave down there. An inflection point is where $f''=0$ — worth marking, but the last thing you need, not the first." },
    ],
    worked: "The order that works: factor $f'$ and read off where it is positive; plot the critical points WITH their values; use symmetry and any easy value; settle the two ends by the dominant term; then let $f''$ decide the bending. Ten seconds of that beats plotting points.",
    watch: "Reaching for $f''$ to decide whether a critical point is a peak or a trough when $f'$ has already told you. If $f'$ is positive to the left of $x_{0}$ and negative to the right, it is a maximum — no second derivative required.",
    concepts: [],
    checks: [
      { q: "A curve is falling but $f'' > 0$. What is happening?", opts: ["It is concave up: the slope is negative but increasing, so the fall is flattening out", "The curve is rising", "There is an inflection point there", "$f''$ cannot be positive while the curve falls"], a: 0,
        expl: "$f''>0$ says $f'$ is increasing. Going from $-4$ to $-3$ is an increase, so the curve still falls, just less steeply — concave up." },
      { q: "The coefficient of $x^{2}$ in the quadratic approximation of $e^{-3x}/\\sqrt{1+x}$ is:", num: 6.375,
        expl: "It is $f''(0)/2$. Multiplying the two catalog expansions and collecting the three quadratic cross-terms gives $\\tfrac32 + \\tfrac92 + \\tfrac38 = \\tfrac{51}{8} = 6.375$." },
      { q: "The critical value of $f(x) = 3x - x^{3}$ at its positive critical point is:", num: 2,
        expl: "$f' = 3(1-x)(1+x)$ vanishes at $x=1$, and $f(1) = 3 - 1 = 2$. The critical POINT is $x=1$; the critical VALUE is the height you plot." },
    ],
  },

  "math120.1.9": {
    takeaway: "Plot the infinities and the ends FIRST; the critical points are the last piece of scaffolding, and a maximum can just as easily sit at an endpoint or a discontinuity as at a place where $f'=0$.",
    beats: [
      { t: "No critical points is not a dead end", d: "$f = \\dfrac{x+1}{x+2}$ has $f' = \\dfrac{1}{(x+2)^{2}}$, which is never 0. Students trained to solve $f'=0$ freeze here. The answer is precalculus: plot the point that is NOT there, $x=-2$." },
      { t: "One-sided limits, read by sign", d: "At $x\\to-2^{+}$: numerator $\\to-1$, denominator $\\to 0^{+}$, so $f\\to-\\infty$. From the left the denominator is $0^{-}$ and $f\\to+\\infty$. The whole vertical asymptote is settled by tracking one sign." },
      { t: "The ends, by dividing through", d: "$\\dfrac{x+1}{x+2} = \\dfrac{1+1/x}{1+2/x} \\to 1$ in both directions, so $y=1$ is a horizontal asymptote. With that and the vertical one, the picture is nearly finished before any calculus." },
      { t: "No critical point means no backtracking", d: "The curve cannot dip below $y=1$ and return, because returning needs a horizontal tangent and there are none. That single observation completes the sketch — and it is the first derivative doing geometry, not algebra." },
      { t: "The interval matters when you say 'increasing'", d: "$f' > 0$ everywhere it is defined, but $f$ is NOT increasing on $(-\\infty,\\infty)$ — it is increasing on $(-\\infty,-2)$ and on $(-2,\\infty)$ separately. Ignoring the break is ignoring the Grand Canyon." },
      { t: "The five-step scheme", d: "1. Plot discontinuities, especially infinite ones. 2. Plot the ends. 3. Plot easy points (optional). 4. Find critical points and their VALUES. 5. Sign of $f'$ on each interval — and that last step is a double-check, not a discovery. If steps 1 and 2 are done well you will rarely need it." },
      { t: "Avoid the second derivative unless forced", d: "It is almost always awful to compute and it buys only the absence of wiggles. For $x/\\ln x$ it does earn its keep once: $f''$ flips at $x=e^{2}$, so there IS an inflection on the rising arm that the rest of the analysis missed." },
      { t: "A worked skeleton: $f = x/\\ln x$", d: "Domain $x>0$. Asymptote at $x=1$ ($-\\infty$ from the left, $+\\infty$ from the right). $f(0^{+})=0$ with slope 0. $f(\\infty)=\\infty$. Then $f' = \\dfrac{\\ln x - 1}{(\\ln x)^{2}}$ vanishes once, at $x=e$, where $f=e$." },
      { t: "Max-min is sketching without the decoration", d: "Finding extremes from a graph is trivial; drawing the graph took twenty minutes. So skip the concavity and the aesthetics, and look only at the scaffolding." },
      { t: "Three places an extreme can hide", d: "Critical points, ENDPOINTS, and points of discontinuity. On the $x/\\ln x$ picture there are five extreme candidates and only ONE of them is a critical point. A course that teaches 'set $f'=0$' has taught you one fifth of the method." },
    ],
    worked: "Rewriting beats the quotient rule twice here. $\\dfrac{x+1}{x+2} = 1 - \\dfrac{1}{x+2}$ makes $f'$ obvious and reveals the curve is a hyperbola; $f' = \\dfrac{1}{\\ln x} - \\dfrac{1}{(\\ln x)^{2}}$ makes the second derivative bearable AND exposes the critical point at $x=0^{+}$ that the first form hid.",
    watch: "Solving $f'=0$ by setting only the numerator to zero. The second form of $f'$ for $x/\\ln x$ shows the derivative also vanishes where the DENOMINATOR blows up, at $x\\to0^{+}$ — a horizontal slope the numerator equation never mentions.",
    concepts: [],
    checks: [
      { q: "$f' $ is never zero on an interval. What does that immediately tell you about the sketch?", opts: ["The function is constant", "The curve cannot turn around anywhere on that interval, so it cannot dip and come back", "The function has no asymptotes", "The second derivative is also never zero"], a: 1,
        expl: "Turning around requires a horizontal tangent. No critical point means no backtracking, which is often enough to finish a sketch once the asymptotes are down." },
      { q: "When hunting a maximum, the three kinds of place to check are:", opts: ["Critical points only", "Critical points, endpoints, and points of discontinuity", "Inflection points and endpoints", "Wherever $f''=0$"], a: 1,
        expl: "On the $x/\\ln x$ graph, four of the five candidate extremes are ends or discontinuities. Checking only $f'=0$ misses most of them." },
      { q: "The smallest value of $x/\\ln x$ for $x > 1$, to three decimal places, is:", num: 2.718,
        expl: "$f' = (\\ln x - 1)/(\\ln x)^{2}$ vanishes at $x = e$, and $f(e) = e/\\ln e = e = 2.718\\ldots$ — the critical point and the critical value happen to coincide." },
    ],
  },

  "math120.1.10": {
    takeaway: "A max-min word problem is three steps — draw it, name the variables, eliminate one using the constraint — and the critical point is only a candidate until you have checked the ends.",
    beats: [
      { t: "Draw the diagram, name the variables", d: "Cut a wire of length 1 at $x$; the two squares have sides $x/4$ and $(1-x)/4$, so $A = (x/4)^{2} + ((1-x)/4)^{2}$. Everything after this is mechanical — the setup is the problem." },
      { t: "The critical point gave the WRONG extreme", d: "$A' = 0$ at $x = 1/2$, where $A = 1/32$. But $A \\to 1/16$ at both ends. The one place calculus pointed at is the MINIMUM — the largest area was at the excluded end, where one square vanishes. Skip the endpoints and you get the exact opposite of the answer." },
      { t: "Minimum VALUE and where it is achieved are different questions", d: "For the wire, the minimum value is $1/32$; it is achieved at $x=1/2$; the minimum POINT on the graph is $(1/2, 1/32)$. People say 'the minimum' for all three, so say which you mean." },
      { t: "A constraint is what lets you eliminate a variable", d: "Open box, square base $x$, height $y$: $V = x^{2}y$ and $A = x^{2} + 4xy$. $V$ is fixed, so $y = V/x^{2}$, and $A$ becomes a function of $x$ alone: $A = x^{2} + 4V/x$." },
      { t: "Infinity is usually one of the ends", d: "Here $x$ ranges over $(0,\\infty)$ — the upper end is not $\\sqrt{A}$, because $A$ is the thing varying; only $V$ is fixed. $A\\to\\infty$ at both ends, so the single critical point $x = (2V)^{1/3}$ must be the minimum." },
      { t: "The second-derivative test works and is still not recommended", d: "$A'' = 2 + 8V/x^{3} > 0$, so concave up, so the critical point is a minimum. It happens to be easy here; on most problems it is worse work than checking the ends." },
      { t: "The best answer is dimensionless", d: "$x = 2^{1/3}V^{1/3}$, $y = 2^{-2/3}V^{1/3}$, $A = 3\\cdot2^{1/3}V^{2/3}$ are all correct and all forgettable. The answer worth keeping is $x/y = 2$: the optimal box is a 2:1 box, at every scale." },
      { t: "Implicit differentiation gets there faster", d: "Differentiate $V = x^{2}y$ with $V$ constant: $0 = 2xy + x^{2}y'$, so $y' = -2y/x$. Then $dA/dx = 2x + 4y + 4xy' = 2x - 4y = 0$, giving $x/y = 2$ in four lines — and landing straight on the proportion, not on the messy explicit dimensions." },
      { t: "What implicit differentiation does NOT do", d: "It never checks whether the critical point is a max, a min, or neither. You get the candidate quickly and still owe the ends — which for this problem means doing roughly what you avoided." },
      { t: "Related rates is the same setup skill, with $t$", d: "Police 30 ft off the road read 50 ft and an approach rate of 80 ft/s along the radar line. Name $x$ (car to the foot of the perpendicular) and $d$ (car to the police) — both vary. Do NOT name the 30; it never changes. The question is whether $dx/dt$ exceeds 95 ft/s." },
    ],
    worked: "The eliminate-then-differentiate order matters. Plugging $y = V/x^{2}$ into $A$ BEFORE differentiating turns a two-variable problem into an ordinary one; differentiating first and substituting later leaves you carrying $y'$ through every line.",
    watch: "Answering with the critical point and stopping. Half the time it is the wrong extreme, as the wire problem shows, and on a constrained problem it is not even the answer the question asked for — the box's proportion is what someone building it needs.",
    concepts: [],
    checks: [
      { q: "The wire problem's critical point $x = 1/2$ turns out to be:", opts: ["The maximum area", "The minimum area — the maximum sits at the excluded endpoints", "Neither a max nor a min", "Undefined, since the wire cannot be cut in half"], a: 1,
        expl: "$A(1/2) = 1/32$ while $A \\to 1/16$ at both ends. The function dips and rises, so the only critical point is the bottom." },
      { q: "For the open box of fixed volume with least surface area, the ratio $x : y$ of base side to height is:", num: 2,
        expl: "$x = 2^{1/3}V^{1/3}$ and $y = 2^{-2/3}V^{1/3}$, so $x/y = 2^{1/3+2/3} = 2$. It is dimensionless, so it holds at every volume — the shape is the answer." },
      { q: "The least area enclosed by the two squares cut from a unit wire is:", num: 0.03125,
        expl: "Two equal squares of side $1/8$: $2\\times(1/8)^{2} = 2/64 = 1/32 = 0.03125$." },
    ],
  },

  "math120.1.11": {
    takeaway: "Related rates is the chain rule applied to a picture: write the geometric relation, differentiate it with respect to time BEFORE substituting any number, and only then plug in.",
    beats: [
      { t: "Differentiate first, substitute second", d: "The radar problem has $x^{2}+30^{2}=d^{2}$ and $dd/dt = -80$. Putting $x=40$ in before differentiating freezes a variable that is moving. Differentiating gives $2x\\,dx/dt = 2d\\,dd/dt$; only now do the numbers go in, and $dx/dt = -100$ ft/s. Over 95, so yes, speeding." },
      { t: "Do not solve for the variable if you can avoid it", d: "You could write $x = \\sqrt{d^{2}-900}$ and differentiate that. It is a waste of time — implicit differentiation of the Pythagorean relation is two symbols and no square roots." },
      { t: "Similar triangles is the fact you will need most", d: "Conical tank, top radius 4, depth 10, water at radius $r$ and height $h$: $r/h = 4/10$, so $r = \\tfrac25 h$. That one line is what turns a two-variable problem into a one-variable one." },
      { t: "Substitute when it is easy, differentiate implicitly when it is not", d: "$V = \\tfrac13\\pi r^{2}h$ becomes $\\tfrac13\\pi(\\tfrac25 h)^{2}h$ — worth substituting. But do NOT then solve for $h$ as a function of $V$; differentiate straight out, $dV/dt = \\tfrac{4\\pi}{25}h^{2}\\,dh/dt$." },
      { t: "A constant inflow is not a constant rise", d: "Filling at 2 cubic feet a minute, the water climbs slower as the cone widens. At $h=5$, $dh/dt = 1/(2\\pi)$ ft/min. The rate you were given and the rate you were asked for are different quantities linked by the chain rule — that is the whole subject." },
      { t: "The hanging ring: a minimisation with a constraint", d: "Fix $(0,0)$ and $(a,b)$, hang a ring on a string of fixed length $L$. The constraint is $\\sqrt{x^{2}+y^{2}} + \\sqrt{(a-x)^{2}+(b-y)^{2}} = L$, and the ring settles at the LOWEST $y$ — where $y'=0$." },
      { t: "Knowing it is an ellipse does not help", d: "That curve is an ellipse with the two hands at its foci, which is true and completely useless: writing the ellipse's equation makes the problem ten times longer. Differentiate the constraint as it stands." },
      { t: "The mess collapses into a symmetry", d: "Setting $y'=0$ kills half the terms and leaves $\\dfrac{x}{\\sqrt{x^{2}+y^{2}}} = \\dfrac{a-x}{\\sqrt{(a-x)^{2}+(b-y)^{2}}}$ — that is $\\sin\\alpha = \\sin\\beta$. The two angles to the horizontal are equal however you tilt your hands, and the tension in the two sides is therefore equal. That is why suspension bridges are built this way." },
      { t: "Newton's method: pretend the function is a line", d: "To solve $f(x)=0$, guess $x_{0}$, take the tangent there, and let $x_{1}$ be where that tangent crosses the axis. Setting $y=0$ in $y-y_{0} = m(x-x_{0})$ gives $x_{1} = x_{0} - y_{0}/m$." },
      { t: "The formula, and how fast it runs", d: "$x_{n+1} = x_{n} - \\dfrac{f(x_{n})}{f'(x_{n})}$. For $x^{2}=5$ from $x_{0}=2$: $9/4$, then $161/72$, then a longer fraction. The errors go $2\\times10^{-1}$, $10^{-2}$, $4\\times10^{-5}$, $10^{-10}$ — the number of correct digits roughly doubles each step." },
    ],
    worked: "For $f(x) = x^{2}-a$ the iteration simplifies to $x_{n+1} = \\tfrac12 x_{n} + \\dfrac{a}{2x_{n}}$ — average your guess with $a$ divided by your guess. That is the square-root algorithm inside your calculator, and it is Newton's method in one line.",
    watch: "Plugging the instantaneous numbers into the geometry before differentiating. Substituting $x=40$ into $x^{2}+900=d^{2}$ first gives $1600+900=2500$, an equation with no variables left and therefore no rates in it at all.",
    concepts: [],
    checks: [
      { q: "Why does Newton's method converge so fast?", opts: ["Because the tangent line is exact", "Because replacing the curve by its tangent has an error of order $(\\Delta x)^{2}$, so the correct digits roughly double each step", "Because it only works on quadratics", "Because $f'$ is constant"], a: 1,
        expl: "The linear approximation's error is quadratic in the distance from the root, which is what turns $10^{-2}$ into $4\\times10^{-5}$ into $10^{-10}$ in three steps." },
      { q: "In the radar problem, the car's speed along the road, in feet per second, is:", num: 100,
        expl: "$2x\\,dx/dt = 2d\\,dd/dt$ with $x=40$, $d=50$, $dd/dt=-80$ gives $dx/dt = -100$. The approach rate along the radar line understates the true speed, because the car is not driving at the police." },
      { q: "In the conical tank, $dh/dt$ at depth 5 feet, in feet per minute to three decimal places, is:", num: 0.159,
        expl: "$V = \\tfrac{4\\pi}{75}h^{3}$, so $dV/dh = \\tfrac{4\\pi}{25}h^{2} = 4\\pi$ at $h=5$. Then $dh/dt = 2/(4\\pi) = 1/(2\\pi) \\approx 0.159$." },
    ],
  },

  "math120.1.12": {
    takeaway: "The Mean Value Theorem upgrades “the difference quotient is APPROXIMATELY the derivative” to “it is EXACTLY the derivative somewhere”, and that single upgrade is what licenses every claim that the sign of $f'$ controls $f$.",
    beats: [
      { t: "Newton's error squares itself", d: "Near the root the curve and its tangent separate quadratically, so $E_{n+1}\\approx E_{n}^{2}$: $10^{-1}$, $10^{-2}$, $10^{-4}$, $10^{-8}$, $10^{-16}$. The number of correct digits DOUBLES each step, which is why three iterations outrun a calculator." },
      { t: "Three ways it fails", d: "Start too far away and it converges to the wrong root. Land where $f'=0$ and the tangent never meets the axis, so $x_{n+1}$ is undefined. And on a wiggle it can cycle — $x_{0}\\to x_{1}\\to x_{0}$ forever, each side convinced the other root is better." },
      { t: "The theorem in one sentence", d: "Boston to LA, 3000 miles in 6 hours: at some instant you were doing exactly 500 mph. 'Mean' is just 'average'." },
      { t: "In symbols, with its hypotheses", d: "$\\dfrac{f(b)-f(a)}{b-a} = f'(c)$ for some $c$ strictly between $a$ and $b$, provided $f$ is differentiable on $(a,b)$ and continuous on $[a,b]$. Continuity at the ends is what connects the endpoint values to the behaviour inside." },
      { t: "The proof is a sliding line", d: "Draw the secant through $(a,f(a))$ and $(b,f(b))$. Take a parallel line below the curve and slide it up until it touches; at the touching point the tangent is parallel to the secant, which is the equation. If it will not touch from below, slide one down from above." },
      { t: "One bad point ruins it", d: "Two straight segments meeting in a corner: the sliding line touches exactly at the kink, where no tangent exists. The differentiability hypothesis is not decoration — a single defective point destroys the construction." },
      { t: "The useful form", d: "$f(b) = f(a) + f'(c)(b-a)$. With $b>a$ the factor $(b-a)$ is positive, so the sign of $f'$ IS the sign of $f(b)-f(a)$. That is all three graphing facts at once." },
      { t: "$f'=0 \\Rightarrow f$ constant needs proving", d: "It looks too obvious to need an argument, but nothing before the MVT connected the derivative at interior points to the values at the ends. It is the simplest consequence and the key to everything that follows — the whole of integration rests on it." },
      { t: "How it differs from linear approximation", d: "Linear approximation says the average rate is APPROXIMATELY $f'(a)$. The MVT says it EQUALS $f'(c)$ for some unnamed $c$. You never learn which $c$; what you get is $\\min f' \\le \\frac{f(b)-f(a)}{b-a} \\le \\max f'$ — the average speed is trapped between the slowest and the fastest." },
      { t: "Inequalities, by bootstrapping", d: "To show $e^{x} > 1+x$ for $x>0$: let $f = e^{x}-(1+x)$, note $f(0)=0$ and $f' = e^{x}-1 > 0$, so $f$ increases from 0. Then use THAT to prove $e^{x} > 1+x+\\tfrac{x^{2}}{2}$, and so on up the series — the tortoise chasing the hare, catching it only in the limit." },
    ],
    worked: "Every inequality proof here has the same three lines: form the difference $g$, check $g(0)=0$, and show $g' > 0$. The previous inequality is what supplies $g' > 0$ for the next one, so the chain builds itself.",
    watch: "Being asked to 'find the $c$'. It is a comprehension exercise, not a technique — the theorem guarantees at least one $c$ and is perfectly happy with ten, and in practice the MVT is never used to locate a $c$, only to bound an average between a min and a max.",
    concepts: [],
    checks: [
      { q: "Newton's method lands exactly on a point where $f' = 0$. What happens?", opts: ["It converges immediately", "The next guess is undefined — the tangent is horizontal and never meets the axis", "It converges to the other root", "It cycles between two values"], a: 1,
        expl: "$f'(x_{n})$ sits in the denominator of the iteration. Geometrically the horizontal tangent has no $x$-intercept, so there is nothing for the next guess to be." },
      { q: "For $f(x)=x^{2}$ on $[1,3]$, the value of $c$ the Mean Value Theorem promises is:", num: 2,
        expl: "The secant slope is $(9-1)/(3-1) = 4$, and $f'(c) = 2c = 4$ gives $c = 2$ — which happens to be the midpoint only because $f$ is a parabola." },
      { q: "What does the Mean Value Theorem give you that linear approximation does not?", opts: ["A faster way to compute derivatives", "An exact equality — the difference quotient IS $f'(c)$ for some interior $c$, not merely close to $f'(a)$", "A formula for the second derivative", "A way to find roots"], a: 1,
        expl: "Linear approximation is an estimate with an unquantified error. The MVT trades knowing WHERE for knowing EXACTLY, and that exactness is what proves $f'=0 \\Rightarrow f$ constant." },
    ],
  },

  "math120.1.13": {
    takeaway: "Antidifferentiation is every derivative formula read backwards, and the only ambiguity it carries is an additive constant — which the Mean Value Theorem is what guarantees.",
    beats: [
      { t: "Differentials are Leibniz's notation, and they matter", d: "$dy = f'(x)\\,dx$ says the same thing as $dy/dx = f'(x)$, but treating the pieces as quantities you can move around is what makes substitution natural. Britain kept Newton's notation and fell a century or two behind the continent over exactly this." },
      { t: "Linear approximation in the new clothes", d: "For $64.1^{1/3}$: $y = x^{1/3}$, $dy = \\tfrac13 x^{-2/3}dx$. At $x=64$, $y=4$ and $dy = \\tfrac{1}{48}dx$. With $dx = 0.1$, $y + dy = 4 + \\tfrac{1}{480} \\approx 4.002$. Every number here matches one in the old formula — same method, new notation." },
      { t: "The integral sign means 'a function whose derivative is'", d: "$\\int g(x)\\,dx = G(x)$ where $G' = g$. It is called the INDEFINITE integral because $G + C$ works just as well; the answer is a family, not a function." },
      { t: "The power rule, backwards, with one hole", d: "$\\int x^{a}\\,dx = \\dfrac{x^{a+1}}{a+1} + C$ — because $d(x^{a+1}) = (a+1)x^{a}dx$. It fails at exactly one exponent, $a=-1$, where you would divide by zero." },
      { t: "And the hole is the logarithm", d: "$\\int \\dfrac{dx}{x} = \\ln|x| + C$. The absolute value is real content: for $x<0$, $\\frac{d}{dx}\\ln(-x) = \\frac{1}{-x}\\cdot(-1) = \\frac1x$, so the one formula covers both sides." },
      { t: "The rest of the list is recall", d: "$\\int\\sin x\\,dx = -\\cos x$, $\\int\\sec^{2}x\\,dx = \\tan x$, $\\int\\frac{dx}{\\sqrt{1-x^{2}}} = \\arcsin x$, $\\int\\frac{dx}{1+x^{2}} = \\arctan x$. Practising these is how the differentiation formulas finally stick." },
      { t: "The constant is the ONLY ambiguity", d: "If $F' = G'$ then $(F-G)' = 0$, so $F - G$ is constant. That is the Mean Value Theorem doing the work — without it, knowing a rate of change would not determine the function up to a starting value, and calculus would be useless." },
      { t: "Substitution: name the messy part", d: "For $\\int x^{3}(x^{4}+2)^{5}dx$, expanding the fifth power is a disaster. Set $u = x^{4}+2$, so $du = 4x^{3}dx$, and the integral becomes $\\int u^{5}\\frac{du}{4} = \\frac{1}{24}u^{6}$. Then change BACK to $x$ — the question was asked in $x$." },
      { t: "Advanced guessing beats substitution once you can see two steps", d: "$\\int\\frac{x\\,dx}{\\sqrt{1+x^{2}}}$: guess $(1+x^{2})^{1/2}$, differentiate, and it comes out exactly right. $\\int e^{6x}dx$: guess $e^{6x}$, get $6e^{6x}$, so divide by 6. Writing the guess down and fixing the coefficient is what stops the arithmetic slips." },
      { t: "Two right answers that look different", d: "$\\int\\sin x\\cos x\\,dx$ is both $\\tfrac12\\sin^{2}x$ and $-\\tfrac12\\cos^{2}x$. Subtract them: $\\tfrac12(\\sin^{2}x+\\cos^{2}x) = \\tfrac12$. Not zero — constant. Same family of functions: matching them for every $x$ forces $C_{1}-C_{2} = -\\tfrac12$." },
      { t: "Substitute when the differential is simpler than the function", d: "$\\int\\frac{dx}{x\\ln x}$ looks forbidding. But $u = \\ln x$ has $du = dx/x$, so the whole thing is $\\int du/u = \\ln|\\ln x| + C$. Go for the trickiest part — that is where the substitution lives." },
    ],
    worked: "The substitution ritual in full: pick $u$, compute $du$, rewrite the integral so that every $x$ and every $dx$ has vanished, integrate in $u$, then substitute back. Skipping the last step leaves an answer to a question nobody asked.",
    watch: "Antidifferentiating when you meant to differentiate, and the reverse. It gets WORSE for a while as you learn to read the formulas both ways — that is not a sign you are going backwards, and the cure is volume.",
    concepts: [],
    checks: [
      { q: "Why does $\\int x^{a}dx = \\dfrac{x^{a+1}}{a+1}$ fail at $a = -1$?", opts: ["Because $x^{-1}$ has no antiderivative", "Because $a+1 = 0$ and you would be dividing by zero — that case is $\\ln|x|$ instead", "Because negative powers are not differentiable", "Because the constant $C$ is undefined there"], a: 1,
        expl: "The derivative identity $d(x^{a+1}) = (a+1)x^{a}dx$ is true for every $a$; only dividing by $a+1$ breaks, and the missing antiderivative is the logarithm." },
      { q: "The linear approximation to $64.1^{1/3}$, to three decimal places, is:", num: 4.002,
        expl: "$dy = \\tfrac{1}{48}dx$ at $x=64$, with $dx = 0.1$, gives $4 + 1/480 = 4.00208\\ldots$ — and the true cube root agrees to three places." },
      { q: "$\\tfrac12\\sin^{2}x$ and $-\\tfrac12\\cos^{2}x$ are both antiderivatives of $\\sin x\\cos x$. Their difference is:", num: 0.5,
        expl: "$\\tfrac12\\sin^{2}x + \\tfrac12\\cos^{2}x = \\tfrac12$. They differ by a constant, which is exactly what the uniqueness theorem allows — same family, with the two labels for $C$ offset by $\\tfrac12$." },
    ],
  },

  "math120.1.14": {
    takeaway: "Separation of variables is the one technique here, and it works whenever $dy/dx$ factors into a function of $x$ times a function of $y$ — Leibniz's notation is what makes the algebra feel legal.",
    beats: [
      { t: "The trivial case first", d: "$dy/dx = f(x)$ is solved by antidifferentiating, full stop. For now that means substitution, or advanced guessing, and nothing else." },
      { t: "When the right side mentions $y$ too", d: "$\\left(\\frac{d}{dx}+x\\right)y = 0$ — quantum mechanics calls it the annihilation operator — is $dy/dx = -xy$. The rate now depends on where you ARE, not just on $x$, and antidifferentiating is no longer enough." },
      { t: "Separate, then integrate both sides", d: "$\\dfrac{dy}{y} = -x\\,dx$ puts every $y$ on the left and every $x$ on the right. Antidifferentiate each in its OWN variable: $\\ln y = -x^{2}/2 + C$. Exponentiating gives $y = Ae^{-x^{2}/2}$ — the normal distribution, and the harmonic oscillator's ground state." },
      { t: "The general shape of the method", d: "It applies to $dy/dx = f(x)g(y)$. Divide by $g(y)$, multiply by $dx$, integrate to get $H(y) = F(x)+C$ — an IMPLICIT solution — then invert $H$ if you can. The calculus is usually easy; the inverting is usually the mess." },
      { t: "Dividing by $y$ loses the solution $y=0$", d: "It is a boring solution and it is still a solution. Any time you divide by something that might be zero, go back and ask what case you discarded — that is where missing solutions always are." },
      { t: "One constant, not two", d: "$\\ln y + C_{1} = -x^{2}/2 + C_{2}$ is legal and wasteful; the two always combine. And the constant is only ADDITIVE at the antiderivative step — exponentiating turns it multiplicative, $A = e^{C}$." },
      { t: "General solution versus a particular one", d: "The answer is a FAMILY with a parameter. One extra fact — say $y(0)=3$ — pins it down: $A=3$, so $y = 3e^{-x^{2}/2}$. The equation gives the rate of change; the initial condition gives the starting place." },
      { t: "A geometry problem becomes a differential equation", d: "'Tangent twice as steep as the ray from the origin' is $dy/dx = 2y/x$. Separating gives $\\ln y = 2\\ln x + C$, so $y = Ax^{2}$ — every parabola through the origin, opening either way." },
      { t: "Watch the point where the equation is undefined", d: "$dy/dx = 2y/x$ says nothing at $x=0$. A solution can arrive on one branch and leave on another, so these are really RAYS from the origin rather than whole parabolas. Knowing a value and a rate does not always determine the function." },
      { t: "Perpendicular trajectories, and constants that do NOT all work", d: "Curves crossing those parabolas at right angles satisfy $dy/dx = -x/(2y)$, which separates to $\\tfrac{x^{2}}{2} + y^{2} = c$ — ellipses. Only $c>0$ describes anything. Sometimes you must add back solutions the method lost; sometimes you must throw some away." },
      { t: "An ellipse is not a function", d: "Explicitly, $y = \\pm\\sqrt{a^{2}-x^{2}/2}$: the top halves and the bottom halves are separate solutions. At $y=0$ the slope is infinite — exactly what the $y$ in the denominator predicted — and the solution simply stops." },
    ],
    worked: "The ritual: separate, integrate both sides in their own variables with ONE constant, invert if you want $y$ explicitly, then ask two questions the algebra will not ask for you — which solutions did dividing lose, and which values of the constant are actually admissible.",
    watch: "Expecting the constant to behave. It is additive only immediately after antidifferentiating; every nonlinear step afterwards transforms it, and in this lecture it comes out multiplicative twice and as a squared semi-axis once.",
    concepts: [],
    checks: [
      { q: "Solving $dy/dx = -xy$ by separation misses which solution, and why?", opts: ["$y = e^{x}$, because the exponential was mishandled", "$y = 0$, because the first step divides by $y$", "$y = -x$, because of the minus sign", "None — separation finds every solution"], a: 1,
        expl: "Dividing by $y$ is valid only when $y \\ne 0$. The constant zero function satisfies the equation and has to be put back by inspection." },
      { q: "With $y(0) = 3$, the solution of $dy/dx = -xy$ at $x=1$, to three decimal places, is:", num: 1.82,
        expl: "$y = 3e^{-x^{2}/2}$, so $y(1) = 3/\\sqrt{e} = 1.8196\\ldots$ The initial condition selects one member of the whole family." },
      { q: "For the perpendicular family $\\tfrac{x^{2}}{2}+y^{2} = c$, which constants are admissible?", opts: ["Every real $c$", "Only $c > 0$ — the rest describe no curve at all", "Only $c < 0$", "Only integer $c$"], a: 1,
        expl: "A sum of two squares cannot be negative, and $c=0$ is the single point at the origin. Unlike the parabola family, where a solution had to be added back, here some have to be discarded." },
    ],
  },

  "math120.1.15": {
    takeaway: "A definite integral is the limit of a sum of rectangle areas, and doing even one by hand — Archimedes' parabola — is what makes the shortcut coming next worth having.",
    beats: [
      { t: "Three steps, and the third is the calculus", d: "Divide the region into rectangles, add up their areas, then let the rectangles get thin. The rectangles never fit the curve — some overshoot, some undershoot — and the whole point is that the mismatch goes to zero in the limit." },
      { t: "Why rectangles", d: "They are the one shape whose area you already know: base times height. Everything in the construction follows from starting with the shape you can measure." },
      { t: "Set it up with $n$ equal strips", d: "For $\\int_{0}^{b}x^{2}dx$, each base is $b/n$ and the right-hand heights are $(b/n)^{2}$, $(2b/n)^{2}$, up to $(nb/n)^{2}$. The sum is $\\left(\\frac{b}{n}\\right)^{3}\\left(1^{2}+2^{2}+\\cdots+n^{2}\\right)$." },
      { t: "Factor out everything you understand", d: "Pulling $(b/n)^{3}$ out front is not a trick, it is the standard move: isolate the part you do NOT know how to evaluate, which here is $\\sum i^{2}$, and study that alone." },
      { t: "Trap the sum between two pyramids", d: "Stack $n\\times n$, $(n-1)\\times(n-1)$, ... unit-height blocks. The smooth pyramid inside has volume $\\tfrac13 n^{3}$; the one outside has $\\tfrac13(n+1)^{3}$. So $\\tfrac13 \\lt \\dfrac{\\sum i^{2}}{n^{3}} \\lt \\tfrac13\\left(1+\\tfrac1n\\right)^{3}$, and both ends go to $\\tfrac13$." },
      { t: "The answer, and the pattern", d: "$\\int_{0}^{b}x^{2}dx = \\tfrac13 b^{3}$. Alongside $\\int_{0}^{b}1\\,dx = b$ (a rectangle) and $\\int_{0}^{b}x\\,dx = \\tfrac12 b^{2}$ (a triangle), the list reads $\\frac{b^{1}}{1}, \\frac{b^{2}}{2}, \\frac{b^{3}}{3}$ — so $x^{3}$ should give $\\frac{b^{4}}{4}$." },
      { t: "Archimedes may have set mathematics back 2000 years", d: "He got the parabola's area by a method so brilliant and so difficult that nobody could see the pattern behind it, or reach the cubic. Calculus made these easy; the difficulty of the old proof was the obstacle." },
      { t: "Sigma notation compresses the mess, not the work", d: "$\\sum_{i=1}^{n}a_{i} = a_{1}+\\cdots+a_{n}$, so the whole Riemann sum is $\\sum_{i=1}^{n}\\frac{b}{n}\\left(\\frac{ib}{n}\\right)^{2}$ and factoring is the distributive law. Fewer symbols, same content." },
      { t: "The general Riemann sum", d: "Split $[a,b]$ into $n$ equal pieces of width $\\Delta x = (b-a)/n$, pick ANY sample point $c_{i}$ in each piece, and add $\\sum f(c_{i})\\Delta x$. Right ends, left ends, midpoints — all converge to the same thing." },
      { t: "The notation is the limit, written down", d: "$\\sum f(c_{i})\\Delta x$ becomes $\\int_{a}^{b}f(x)\\,dx$: the sigma stretches into the integral sign and $\\Delta x$ becomes $dx$. Leibniz chose the symbols to look like what they replace." },
      { t: "Integrals as cumulative sums, not areas", d: "Borrow at a rate $f(t)$ dollars per year, daily, so $\\Delta t = 1/365$. Each day's borrowing is $f(t)\\Delta t$ — dollars per year times years, which is DOLLARS — and the year's total is $\\int_{0}^{1}f(t)\\,dt$. What you owe, compounded, is $\\int_{0}^{1}e^{r(1-t)}f(t)\\,dt$." },
    ],
    worked: "The $dx$ is not decoration: it carries the units. Rate times width is the quantity, which is why a borrowing rate in dollars per year integrated against $dt$ in years comes out in dollars, and why changing variables works at all.",
    watch: "Trying to evaluate the Riemann sum exactly. It has no closed form worth chasing — you trap it between two things you can compute and take the limit. The limit is the easy object; the finite sum is the hard one.",
    concepts: [],
    checks: [
      { q: "Why factor $(b/n)^{3}$ out of the Riemann sum before taking the limit?", opts: ["It cancels with the $dx$", "To isolate $\\sum i^{2}$, the one factor whose size is not yet understood", "Because the distributive law requires it", "To make the rectangles equal width"], a: 1,
        expl: "Everything else is elementary. Separating out the unknown sum is what lets you trap it between two pyramids and discover it behaves like $\\tfrac13 n^{3}$." },
      { q: "$\\displaystyle\\int_{0}^{3}x^{2}\\,dx$ equals:", num: 9,
        expl: "$\\tfrac13 b^{3}$ with $b=3$ is $27/3 = 9$ — the pyramid argument's payoff, and the same number a fine Riemann sum converges to." },
      { q: "$\\displaystyle\\lim_{n\\to\\infty}\\frac{1^{2}+2^{2}+\\cdots+n^{2}}{n^{3}}$, to three decimal places, is:", num: 0.333,
        expl: "Both pyramids give $\\tfrac13$: the inner one exactly, the outer one as $\\tfrac13(1+1/n)^{3} \\to \\tfrac13$. The squeeze leaves no room." },
    ],
  },

});
