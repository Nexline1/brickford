// Brickford — lecture summaries, PHYS 100 (Classical Mechanics)
//
// MIT 8.01 with Walter Lewin, Fall 1999: one unit, 37 lectures. His lectures are
// built around demonstrations — an apple dropped from two heights, a student
// measured standing and lying down, a monkey shot out of a tree — and the
// summaries keep them, because the demonstration IS the argument in this course.
// Lewin's other constant refrain is that a measurement without its uncertainty is
// meaningless, and the summaries carry that too.
//
// Same contract as the other summary files: written FROM the lecture, following
// the lecturer's own argument in his own order, so the summary reviews what was
// actually said rather than paraphrasing the topic. tools/verify-content.js
// enforces the shape and RECOMPUTES every numeric answer — see the summaries
// block there before adding an entry.
//
// Physics numerics recompute by INTEGRATING THE EQUATION OF MOTION numerically —
// stepping the trajectory and reading the answer off it — never by re-evaluating
// the closed form a beat derives. Conservation-law answers are recomputed in a
// different frame or by a different elimination; moments of inertia and fluid
// forces by quadrature over the body. The constant is the one Lewin uses, g = 9.8.
//
// No concepts and no figures: DAR.CONCEPTS and DAR.FIG are still entirely linear
// algebra, so `concepts: []` is the correct value here.
//
// beats[]  — the argument as it develops.
// worked   — the practical pattern, because theory alone does not transfer.
// watch    — the trap, stated as the error rather than as a warning.
// checks[] — active review; recognising a summary is not remembering it.
window.DAR = window.DAR || {};

DAR.SUMMARIES = Object.assign(DAR.SUMMARIES || {}, {

  "phys100.0.0": {
    takeaway: "What 8.01 is for, in Lewin's words: not to cover a great deal but to UNCOVER a few basic things you will remember for the rest of your life — and to make you see the beauty of physics.",
    beats: [
      { t: "The course", d: "Calculus-based Newtonian mechanics at the core, with some fluid mechanics and a little kinetic gas theory. At MIT it is a requirement for every student." },
      { t: "Every lecture an event", d: "Where it arises naturally he goes beyond the syllabus: neutron stars, black holes, Big Bang cosmology, supernova explosions, musical instruments." },
      { t: "The last lecture", d: "His own research — x-ray astronomy from balloons the size of the Empire State Building, flown to about 145,000 feet." },
      { t: "The goal", d: "Not to chew through many equations, but to see through them. Even if you never need physics again, he wants you to love it." },
    ],
    worked: "Watch each lecture for the demonstration, then ask what equation it tests. The equations are the tool; the demonstration is what you will remember.",
    watch: "Treating physics as a list of formulas to memorise. The course is built to make a few ideas unforgettable, not to cover many.",
    concepts: [],
    checks: [
      { q: "Lewin describes his goal for the course as:", opts: ["Covering as many equations as possible", "Uncovering a few basic things students will remember for life", "Preparing students for research", "Reviewing high-school physics"], a: 1,
        expl: "His words: not to cover a lot, but to uncover several very basic things — and to make students love physics." },
      { q: "Besides Newtonian mechanics, 8.01 as Lewin teaches it includes:", opts: ["Quantum field theory", "Some fluid mechanics and kinetic gas theory", "Electromagnetism", "Special relativity only"], a: 1,
        expl: "Mechanics is the core, with a little fluid mechanics and kinetic gas theory, plus excursions into astrophysics where they fit." },
    ],
  },

  "phys100.0.1": {
    takeaway: "Every quantity in mechanics is built from length, time and mass — and dimensional analysis alone can tell you HOW an answer scales, provided you choose the right variables and never forget that a measurement without its uncertainty is meaningless.",
    beats: [
      { t: "Forty-five orders of magnitude", d: "From a fraction of a proton to the universe itself. To compare anything quantitatively you need units: the metre, the second and the kilogram." },
      { t: "Three fundamental dimensions", d: "$[L]$, $[T]$, $[M]$. Everything else is built from them: speed $[L]/[T]$, volume $[L]^{3}$, density $[M]/[L]^{3}$, acceleration $[L]/[T]^{2}$. Metres per second or inches per year — the dimension is the same." },
      { t: "Uncertainty is not optional", d: "'Any measurement that you make without the knowledge of its uncertainty is completely meaningless.' He wants you to hear it at three in the morning." },
      { t: "Are you longer lying down?", d: "His grandmother said so. First calibrate: an aluminium bar measures $149.9$ standing and $150.0$ lying, each $\\pm 0.1$ cm — the apparatus agrees with itself. Then a student: $183.2$ standing, $185.7$ lying. A difference of $2.5 \\pm 0.2$ cm. Grandmother was right, and only the known uncertainty makes that a result." },
      { t: "Galileo's question", d: "Why are mammals not much bigger? Femur length $\\ell \\propto$ size $S$, mass $M \\propto S^{3} \\propto \\ell^{3}$. For the bone not to break, pressure $\\propto M/d^{2}$ must stay bounded, so $M \\propto d^{2}$. Together, $d \\propto \\ell^{3/2}$." },
      { t: "Which predicts", d: "An animal 100 times larger needs femurs 100 times longer but 1000 times thicker. Eventually the bone is as thick as it is long, which is biologically impossible — a ceiling on size." },
      { t: "And the bones say otherwise", d: "Femurs from a mouse to an elephant, from Harvard's collection. $d/\\ell$ should grow tenfold across that range; it barely changes. A beautiful scaling argument, and the data do not support it. The measurement wins." },
      { t: "Dimensional analysis of a fall", d: "Guess $t \\propto h^{\\alpha}m^{\\beta}g^{\\gamma}$. Matching dimensions, $[T] = [L]^{\\alpha}[M]^{\\beta}([L]/[T]^{2})^{\\gamma}$, forces $\\beta = 0$, $\\gamma = -\\tfrac12$, $\\alpha = \\tfrac12$. So $t = C\\sqrt{h/g}$ — and the fall time does not depend on the mass." },
      { t: "Tested with apples", d: "Heights of 3 m and 1.5 m, each $\\pm 3$ mm, predict $t_1/t_2 = \\sqrt2 = 1.414$, within about $\\pm0.002$. Measured: 781 and 551 ms, each $\\pm 2$ ms, ratio $1.417 \\pm 0.008$. Agreement, within the uncertainties." },
      { t: "But the method has limits", d: "Use the mass of the Earth instead of $g$ and the analysis gets stuck: mass appears twice and cannot be separated. Dimensional analysis never gives the constant $C$, and a different but reasonable choice of variables can give no answer at all." },
    ],
    worked: "To guess how an answer scales, list the quantities it could depend on, write each in $[L]$, $[T]$, $[M]$, and demand the powers match on both sides. Then test the scaling with an experiment whose uncertainty you know.",
    watch: "Believing a dimensional argument as a proof. It fixes powers, not constants, and it depends entirely on which variables you chose to include.",
    concepts: [],
    checks: [
      { q: "Dimensional analysis of the fall time $t \\propto h^{\\alpha}m^{\\beta}g^{\\gamma}$ gives:", opts: ["$t \\propto h/g$", "$t \\propto \\sqrt{h/g}$, independent of the mass", "$t \\propto m\\sqrt h$", "$t \\propto \\sqrt{hg}$"], a: 1,
        expl: "Mass appears only on the right, so $\\beta = 0$; matching $[L]$ and $[T]$ gives $\\alpha = \\tfrac12$, $\\gamma = -\\tfrac12$." },
      { q: "The ratio of fall times from 3 m and from 1.5 m, to three decimal places, is:", num: 1.414,
        expl: "$\\sqrt{3/1.5} = \\sqrt2 = 1.414$. Lewin measured $781/551 = 1.417 \\pm 0.008$ — in agreement." },
      { q: "With $g = 9.8$ m/s², the time for an apple to fall 3 m from rest, in seconds to three decimal places, is:", num: 0.782,
        expl: "$t = \\sqrt{2h/g} = \\sqrt{6/9.8} = 0.782$ s — the constant $C$ is $\\sqrt2$, which dimensional analysis could not supply. Lewin's timer read 781 ms." },
    ],
  },

  "phys100.0.2": {
    takeaway: "Velocity is $dx/dt$ and acceleration is $dv/dt = d^{2}x/dt^{2}$ — two equations to remember for the rest of your life — and signs matter: they depend on which direction you call positive, not on where you put zero.",
    beats: [
      { t: "Average velocity", d: "$\\bar v = \\frac{x(t_2) - x(t_1)}{t_2 - t_1}$. It depends on your choice of POSITIVE direction — flip it and every sign flips — but not on where you put $x = 0$." },
      { t: "Velocity is not speed", d: "Go out and come back: average velocity 0, average speed = distance travelled over time, perhaps 100 m/s. And $-100$ m/s is a LOWER velocity than $+30$ m/s but a HIGHER speed. Speed is the magnitude." },
      { t: "Instantaneous velocity", d: "Shrink the interval: $v = \\lim_{\\Delta t\\to0}\\frac{x(t+\\Delta t) - x(t)}{\\Delta t} = \\frac{dx}{dt}$, the slope of the $x$–$t$ graph. Positive, zero or negative, according to that slope." },
      { t: "Timing a bullet", d: "Two wires $148.5 \\pm 0.5$ cm apart, a timer good to $0.1$ ms. The bullet takes $5.8$ ms: $256 \\pm 4$ m/s. The distance error is a third of a percent; the timing error, $1.7\\%$, is the only one that matters. The timer's precision was chosen in advance to reach 2%." },
      { t: "Average acceleration", d: "$\\bar a = \\frac{v(t_2) - v(t_1)}{t_2 - t_1}$, in m/s². A tennis ball hits the floor at 5 m/s and bounces back at 5 m/s in about $10^{-2}$ s: $\\bar a = 10/0.01 = 1000$ m/s²." },
      { t: "Why things break", d: "A tomato hitting at the same speed stops over maybe a quarter of a second: about 20 m/s². What breaks an egg — or Sherlock Holmes's victim's skull on a marble floor — is the MAGNITUDE of acceleration, set by the change in velocity and how short the impact is. Your sign convention is irrelevant to the egg." },
      { t: "Instantaneous acceleration", d: "$a = \\frac{dv}{dt} = \\frac{d^{2}x}{dt^{2}}$. Reading it off an $x$–$t$ graph is harder: you are judging how the SLOPE changes — curving upward means $a \\gt 0$, a straight stretch means $a = 0$." },
      { t: "A worked example", d: "$x = 8 - 6t + t^{2}$: $v = -6 + 2t$ and $a = 2$. At $t = 0$ the object is at 8 m moving at $-6$ m/s. It is at $x = 0$ at $t = 2$ and $t = 4$, stops at $t = 3$ at $x = -1$, and turns back — the positive acceleration slowly winning over the negative velocity." },
      { t: "Constant acceleration in general", d: "$x = x_0 + v_0t + \\tfrac12at^{2}$, $v = v_0 + at$. The three constants are the starting position, the starting velocity and half the acceleration." },
      { t: "Gravity", d: "Near the Earth's surface $g = 9.80$ m/s² in Boston, independent of the object's mass, speed, composition, size or shape — in vacuum. Not obvious, and not provable from first principles; it is an experimental fact. It also fixes the dimensional-analysis constant: $t = \\sqrt{2h/g}$." },
      { t: "The strobe test", d: "An apple falling 3 m, lit at 10 Hz for about 0.8 s: seven or eight images, spaced ever wider because $v = gt$. The class guessed anywhere from four to eleven." },
    ],
    worked: "Given $x(t)$, differentiate for $v$ and $a$, then find where $x = 0$, where $v = 0$, and the position there. Those few numbers are enough to sketch the motion and say what the object is doing.",
    watch: "Confusing a lower velocity with a lower speed. $-100$ m/s is less than $+30$ m/s, but it is the faster of the two.",
    concepts: [],
    checks: [
      { q: "An object goes out and returns to its start in 3 s, covering 300 m in total. Its average velocity and average speed are:", opts: ["100 m/s and 100 m/s", "0 and 100 m/s", "100 m/s and 0", "0 and 0"], a: 1,
        expl: "Velocity uses displacement, which is zero; speed uses distance travelled." },
      { q: "For $x = 8 - 6t + t^{2}$ (metres, seconds), the position where the object momentarily stops, in metres, is:", num: -1,
        expl: "$v = -6 + 2t = 0$ at $t = 3$, where $x = 8 - 18 + 9 = -1$." },
      { q: "A ball hits the floor at 5 m/s and leaves at 5 m/s after a 0.01 s impact. The magnitude of its average acceleration, in m/s², is:", num: 1000,
        expl: "The velocity changes by 10 m/s — not zero, since it reversed — in 0.01 s: $1000$ m/s²." },
    ],
  },

  "phys100.0.3": {
    takeaway: "Vectors add head to tail and decompose into perpendicular components — and that decomposition turns a complicated motion in three dimensions into three independent one-dimensional motions.",
    beats: [
      { t: "Scalars and vectors", d: "Mass, temperature, speed: one number each. Velocity and acceleration need a direction too — they are vectors, drawn as arrows. Seen head-on, a dot; seen from behind, a cross." },
      { t: "Why vectors add as they do", d: "Walk across a table while the table itself is moved: from the lecture hall you see the SUM of the two displacements, $\\vec{OS} = \\vec{OP} + \\vec{PS}$. Head to tail, or by completing a parallelogram — the same result, and $\\vec A + \\vec B = \\vec B + \\vec A$." },
      { t: "Negatives and differences", d: "$-\\vec A$ is $\\vec A$ turned through 180°. So $\\vec A - \\vec B = \\vec A + (-\\vec B)$. Magnitudes 4 and 5 can sum to anything from 1 to 9, depending on direction." },
      { t: "Components", d: "Project $\\vec A$ onto the axes: $\\vec A = A_x\\hat x + A_y\\hat y + A_z\\hat z$, with unit vectors (\"x roof\") along the positive axes. Its magnitude is $|\\vec A| = \\sqrt{A_x^{2} + A_y^{2} + A_z^{2}}$." },
      { t: "An example", d: "$\\vec A = 3\\hat x - 5\\hat y + 6\\hat z$ has $|\\vec A| = \\sqrt{70}$, and its angle $\\theta$ to the $z$-axis satisfies $\\cos\\theta = 6/\\sqrt{70}$." },
      { t: "The dot product", d: "$\\vec A\\cdot\\vec B = A_xB_x + A_yB_y + A_zB_z = |\\vec A||\\vec B|\\cos\\theta$ — a SCALAR. Positive, zero or negative; zero when the vectors are perpendicular. It will return as work: positive and negative." },
      { t: "The cross product", d: "$\\vec A \\times \\vec B$ by the three-row determinant with $\\hat x, \\hat y, \\hat z$ on top — or geometrically, magnitude $|\\vec A||\\vec B|\\sin\\theta$, perpendicular to both. Zero when they are parallel." },
      { t: "Its direction: the corkscrew", d: "Turn $\\vec A$ into $\\vec B$ through the smaller angle, as a corkscrew — demonstrated in a potato. Clockwise as seen by you drives it away: into the board. So $\\vec A \\times \\vec B = -\\vec B \\times \\vec A$, unlike the dot product." },
      { t: "Always a right-handed system", d: "Axes must satisfy $\\hat x \\times \\hat y = +\\hat z$. Draw them the other way and every torque and angular momentum later comes out with the wrong sign." },
      { t: "The payoff: independent components", d: "$\\vec r(t) = x(t)\\hat x + y(t)\\hat y + z(t)\\hat z$, so $\\vec v = \\dot x\\hat x + \\dot y\\hat y + \\dot z\\hat z$ and $\\vec a = \\ddot x\\hat x + \\ddot y\\hat y + \\ddot z\\hat z$. A three-dimensional motion is three one-dimensional motions, each governed by the familiar constant-acceleration equations." },
      { t: "A thrown ball", d: "Launched at speed $v_0$ and angle $\\alpha$: horizontally, $v_x = v_0\\cos\\alpha$ forever, since there is no horizontal acceleration. Vertically, $v_y = v_0\\sin\\alpha - gt$. The horizontal motion does not know what the vertical one is doing." },
      { t: "The cart and the golf ball", d: "A cart fires a golf ball straight up while rolling. The ball keeps the cart's horizontal velocity, so it stays above the cart and lands back on it. 'Physics works.'" },
    ],
    worked: "Faced with motion in two or three dimensions, resolve everything — initial velocity, acceleration — along perpendicular axes, and solve each axis as a separate one-dimensional problem with its own constant acceleration.",
    watch: "Using a left-handed set of axes. With $\\hat x \\times \\hat y = -\\hat z$, every cross product later in the course flips sign.",
    concepts: [],
    checks: [
      { q: "The cross product $\\vec A \\times \\vec B$ is zero when:", opts: ["The vectors are perpendicular", "The vectors are parallel or antiparallel", "The vectors have equal length", "Never"], a: 1,
        expl: "Its magnitude is $|\\vec A||\\vec B|\\sin\\theta$, zero at 0° and 180°. The DOT product is the one that vanishes for perpendicular vectors." },
      { q: "The magnitude of $\\vec A = 3\\hat x - 5\\hat y + 6\\hat z$, to three decimal places, is:", num: 8.367,
        expl: "$\\sqrt{9 + 25 + 36} = \\sqrt{70} = 8.367$." },
      { q: "The angle between that vector and the positive $z$-axis, in degrees to two decimal places, is:", num: 44.18,
        expl: "$\\cos\\theta = A_z/|\\vec A| = 6/\\sqrt{70}$, so $\\theta = 44.18°$." },
    ],
  },

  "phys100.0.4": {
    takeaway: "A projectile is a constant-velocity motion sideways and a constant-acceleration motion vertically, and from those two alone come the parabola, the maximum height, the range $v_0^{2}\\sin2\\alpha/g$ — and the monkey that cannot escape.",
    beats: [
      { t: "The path is a parabola", d: "$x = v_0\\cos\\alpha\\,t$ and $y = v_0\\sin\\alpha\\,t - \\tfrac12gt^{2}$. Eliminate $t$: $y = x\\tan\\alpha - \\frac{g\\,x^{2}}{2v_0^{2}\\cos^{2}\\alpha}$ — a constant times $x$ minus a constant times $x^{2}$." },
      { t: "The highest point", d: "Where $v_y = v_0\\sin\\alpha - gt = 0$: at $t = v_0\\sin\\alpha/g$, and height $h = \\frac{(v_0\\sin\\alpha)^{2}}{2g}$. Larger with faster launch and steeper angle; larger on the Moon." },
      { t: "Back to the ground", d: "The parabola is symmetric, so the flight takes twice as long as the climb: $\\frac{2v_0\\sin\\alpha}{g}$. Multiply by $v_0\\cos\\alpha$: range $= \\frac{v_0^{2}\\sin2\\alpha}{g}$, largest at 45°." },
      { t: "Why $v_0^{2}$", d: "Double the launch speed and the ball stays up twice as long AND moves sideways twice as fast: four times the range." },
      { t: "Measuring $v_0^{2}$ first", d: "Fire the spring gun straight up: it rises $3.07$ m, estimated against a 3 m mark, but repeated shots differed by up to 15 cm, so allow 5%. Then $v_0^{2} = 2gh = 60.2$ m²/s², and only $v_0^{2}$ is needed." },
      { t: "45°: the angle barely matters", d: "Prediction $60.2/9.8 = 6.14 \\pm 0.31$ m. A one-degree error in the angle changes $\\sin 2\\alpha$ by $0.06\\%$ at the flat top of the sine curve — negligible. The ball lands inside the band." },
      { t: "30°: now it does", d: "$\\sin 60°$ sits on the steep part of the sine curve: one degree changes it by 2%. Total uncertainty about 7%, so $5.3 \\pm 0.37$ m. It lands in the band again — 'hit the jackpot'." },
      { t: "60° lands in the same place", d: "$\\sin 120° = \\sin 60°$, so the range is the same, but the flight takes LONGER: the horizontal component $v_0\\cos60°$ is smaller, and horizontal speed is what sets how long the trip takes." },
      { t: "The monkey", d: "A hunter aims straight at a monkey in a tree; the monkey lets go the instant the gun fires. Without gravity the ball would travel the straight line to it. With gravity the ball falls $\\tfrac12gt^{2}$ below that line — exactly as far as the monkey has fallen in the same time." },
      { t: "Whatever the speed", d: "Faster or slower, the ball meets the monkey — higher up or lower down. Only the AIM matters, and a very slow ball simply reaches the ground first." },
      { t: "The monkey's point of view", d: "In a frame falling freely with $g$, gravity disappears: the ball flies straight at the monkey at speed $v_0$ and arrives after $\\sqrt{D^{2} + h^{2}}/v_0$. From the lecture hall it is $D/(v_0\\cos\\alpha)$ — the same time, as it must be." },
      { t: "Robert", d: "A toy monkey on an electromagnet, a golf-ball gun, and Lewin in hunting costume. The ball hits." },
    ],
    worked: "For any projectile question, write the horizontal and vertical equations separately, find the time from whichever axis pins it down, and substitute that time into the other axis.",
    watch: "Assuming equal range means equal flight time. Launches at 30° and 60° land in the same spot, but the steeper one stays in the air longer.",
    concepts: [],
    checks: [
      { q: "The hunter aims directly at the monkey, which drops at the instant of firing. The ball hits the monkey:", opts: ["Only for one particular launch speed", "For any launch speed high enough to reach it before it lands", "Never, because gravity pulls the ball below the aim", "Only if fired horizontally"], a: 1,
        expl: "Ball and monkey fall the same $\\tfrac12gt^{2}$ below the aim line in the same time, so the aim alone decides it." },
      { q: "With $v_0^{2} = 60.172$ m²/s² and $g = 9.8$ m/s², the range at 45°, in metres to two decimal places, is:", num: 6.14,
        expl: "$v_0^{2}\\sin 90°/g = 60.172/9.8 = 6.14$ m — the maximum possible range." },
      { q: "The same launch at 30°, in metres to two decimal places, lands at:", num: 5.32,
        expl: "$60.172\\sin60°/9.8 = 5.32$ m. A launch at 60° lands in the same place, after a longer flight." },
    ],
  },

});
