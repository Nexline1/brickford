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

});
