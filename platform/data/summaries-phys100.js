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

  "phys100.0.5": {
    takeaway: "Going round a circle at constant speed still means accelerating — toward the centre, with magnitude $v^{2}/r = \\omega^{2}r$ — and something must push or pull to supply it; remove that push and the object flies off along the tangent, not in a spiral.",
    beats: [
      { t: "Period, frequency, angular velocity", d: "$T$ is the time for one revolution; $f = 1/T$ in hertz; $\\omega = 2\\pi/T$ in radians per second. And the speed is $v = 2\\pi r/T = \\omega r$." },
      { t: "Centripetal acceleration", d: "The speed is constant but the velocity's direction keeps changing, so there must be an acceleration: $a_c = v^{2}/r = \\omega^{2}r$, always pointing to the CENTRE. He leaves the derivation to the book." },
      { t: "A vacuum cleaner", d: "Blades at 10 cm turning at 600 rpm: $f = 10$ Hz, $\\omega \\approx 63$ rad/s, $v \\approx 6.3$ m/s, $a_c \\approx 400$ m/s² — forty times $g$." },
      { t: "Linear in $r$", d: "With $\\omega$ fixed, $a_c = \\omega^{2}r$ GROWS with distance from the axis. Writing $v^{2}/r$ tempts you to think the reverse, but $v$ itself grows with $r$." },
      { t: "Something must push or pull", d: "On a turntable, a seat bolted down pushes on your back, or a bar you hold pulls you inward. No free lunch: the acceleration needs a cause. Next lecture calls it a force." },
      { t: "Cut the string", d: "A ball circling on a string, cut at the bottom of the circle: it flies straight up, stops and falls back. Not the spiral that intuition suggests — just the velocity it had, continued." },
      { t: "The planets and $1/R^{2}$", d: "From each planet's orbital period and mean distance, compute $\\omega^{2}R$. On log–log paper the points lie on a line of slope $-2$: Mercury, 100 times closer than Pluto, has 10,000 times the centripetal acceleration. Gravity falls off as $1/R^{2}$." },
      { t: "A marble in a spinning tube", d: "Nothing in a smooth tube can push the marble inward, so it keeps its velocity and drifts to the end. That is a centrifuge — and his grandmother drying lettuce in a colander swung round her head." },
      { t: "Perceived gravity", d: "Hung from a string you feel a pull up; standing, a push up. Either way you perceive gravity OPPOSITE the push or pull. Swung round in a circle, the pull points inward — so your 'down' points outward." },
      { t: "A space station", d: "A 100 m wheel with $\\omega^{2}R \\approx 10$ m/s² needs $\\omega \\approx 0.3$ rad/s, a turn every 20 seconds, rim speed about 30 m/s. 'Down' is outward everywhere, zero at the hub. Walking into a spoke means climbing a wall; walking out of the hub means falling down a shaft." },
      { t: "A lab centrifuge", d: "3600 rpm at 15 cm: about 20,000 m/s², some 2000 $g$. Fine silver chloride particles that stayed suspended for hours sink to the side in seconds; the glass itself must survive being 2000 times heavier." },
      { t: "A bucket of water, upside down", d: "At the top of a vertical circle of radius 1 m, you need $v^{2}/R \\gt g$, so $v \\gt 3.2$ m/s — a revolution in under 2 seconds. Then the string still pulls, 'gravity' for the water points up to the ceiling, and the water stays in." },
    ],
    worked: "For anything moving in a circle, first write $a_c = \\omega^{2}r$ toward the centre, then ask which real push or pull supplies it. If nothing can, the object leaves along the tangent.",
    watch: "Thinking centripetal acceleration falls with radius on a rotating body. At fixed $\\omega$ it is $\\omega^{2}r$ and grows outward; the hub feels nothing.",
    concepts: [],
    checks: [
      { q: "A ball whirled on a string in a horizontal circle has its string cut. It then moves:", opts: ["Outward along the radius", "In a spiral away from the centre", "Along the tangent to the circle at that instant", "Toward the centre"], a: 2,
        expl: "With the pull removed there is no centripetal acceleration; it keeps the velocity it had, which is tangent to the circle." },
      { q: "Vacuum-cleaner blades 10 cm from the axis turn at 600 rpm. Their centripetal acceleration, in m/s² to one decimal place, is:", num: 394.8,
        expl: "$\\omega = 2\\pi \\times 10 = 62.8$ rad/s, so $\\omega^{2}r = 394.8$ m/s² — about 40 $g$." },
      { q: "A space station of radius 100 m must give $\\omega^{2}R = 10$ m/s² at its rim. The time for one revolution, in seconds to two decimal places, is:", num: 19.87,
        expl: "$\\omega = \\sqrt{10/100} = 0.316$ rad/s, so $T = 2\\pi/\\omega = 19.87$ s." },
    ],
  },

  "phys100.0.6": {
    takeaway: "Newton's three laws: without a net force velocity stays constant; $\\vec F = m\\vec a$ defines force; and every force comes with an equal and opposite force on the other body — none provable, all believed because every measurement agrees with them.",
    beats: [
      { t: "The first law", d: "Galileo's law of inertia: a body at rest stays at rest, and a body in motion keeps its velocity along a straight line, unless acted on by an external force. Everyday experience denies it — friction, air drag and gravity always intervene." },
      { t: "Only in inertial frames", d: "Accelerate yourself toward the class and the class seems to accelerate toward you, yet nobody feels a push. The first law fails in an accelerating frame." },
      { t: "Is this room inertial?", d: "No: the Earth spins (at the equator $\\omega^{2}R \\approx 0.034$ m/s², about 300 times less than $g$), orbits the Sun (five times less again), and so on. Small enough that the lecture hall is a good inertial frame in practice." },
      { t: "The second law defines force", d: "Stretch a spring by a fixed amount and it pulls with the same strength on any mass. Experimentally $m_1a_1 = m_2a_2$. That product is FORCE: $\\vec F = m\\vec a$, in newtons, kg·m/s². The acceleration points along the force." },
      { t: "Mass without gravity", d: "Is this circular, if masses are measured with gravity? No: two identical pieces of cheese have twice the mass of one — count the atoms. Relative mass needs no force." },
      { t: "Weight as a force", d: "Everything here falls with the same $g$, so the gravitational force is $mg$, proportional to mass. A half-kilogram ball at rest in the hand: gravity pulls down with about 5 N, the hand pushes up with 5 N." },
      { t: "No statement about speed", d: "$F = ma$ says nothing about velocity, so it holds for anything slow compared with light. Near the speed of light, special relativity takes over." },
      { t: "The third law", d: "If one body exerts a force on another, the other exerts an equal and opposite force on the first: action equals minus reaction. Always — moving, accelerating or at rest." },
      { t: "Two blocks pushed together", d: "20 N pushes a 5 kg block against a 15 kg block. The pair accelerates at 1 m/s². Isolate the 15 kg block: it needs 15 N, supplied by the first block. Isolate the 5 kg block: 20 N in, 15 N back from the second block. The contact forces are equal and opposite." },
      { t: "It is everywhere", d: "A garden hose snaking backward. A balloon let go — a rocket. A gun's recoil. Hero's steam engine spinning as jets leave it; a soda can with slanted holes doing the same. Walking pushes the floor back so the floor pushes you forward; on ice you cannot." },
      { t: "The Earth falls too", d: "An apple falling 100 m pulls the Earth with the same 5 N. The Earth accelerates at about $8\\times10^{-25}$ m/s² and moves some $10^{-23}$ m before they meet — real, and unmeasurable." },
      { t: "Two strings, two answers", d: "A block hangs by a string with another hanging below it. Pull the lower one and which breaks? Slowly, the upper one — it carries the weight plus your pull. Yanked, the lower one: the block's inertia means it has barely moved before the lower string fails, so the upper string never feels the pull. Lewin leaves the class to think it through." },
    ],
    worked: "For a system of bodies, find the acceleration of the whole first, then isolate each body, draw only the forces ON it, and apply $F = ma$ to that body alone. Contact forces appear in equal and opposite pairs.",
    watch: "Putting both members of a third-law pair on the same body. Action and reaction act on DIFFERENT bodies, so they never cancel each other.",
    concepts: [],
    checks: [
      { q: "Action and reaction forces never cancel because:", opts: ["One is always larger", "They act on different bodies", "They act at different times", "Only one of them is real"], a: 1,
        expl: "The pair consists of the force of A on B and the force of B on A. To cancel, forces must act on the same body." },
      { q: "A 4 kg mass hangs from two strings at 60° and 45° to the horizontal ($g = 10$). The tension in the 60° string, in newtons to two decimal places, is:", num: 29.28,
        expl: "Resolving horizontally and vertically, $T_1 = 2mg/(1 + \\sqrt3) = 29.28$ N." },
      { q: "And the tension in the 45° string, in newtons to two decimal places, is:", num: 20.71,
        expl: "$T_2 = T_1/\\sqrt2 = 20.71$ N. Lewin's spring scales read roughly 30 and 20." },
    ],
  },

  "phys100.0.7": {
    takeaway: "Your WEIGHT is the push or pull that supports you — what a bathroom scale reads — not the gravitational force $mg$. Accelerate up and you weigh more; accelerate down and you weigh less; fall freely and you weigh nothing, though gravity has not changed at all.",
    beats: [
      { t: "What weight is", d: "Standing on a bathroom scale, gravity pulls with $mg$ and the scale pushes up with $F_s$. That push IS your weight. At rest it equals $mg$." },
      { t: "An elevator going up", d: "Accelerating up at $a$: $F_s - mg = ma$, so $F_s = m(a + g)$. At 5 m/s² you weigh one and a half times as much; at 30 m/s², four times. Seeing is believing: that is your weight." },
      { t: "Going down, and free fall", d: "Accelerating down: $F_s = m(g - a)$. Cut the cable and $a = g$: the scale reads zero. You are WEIGHTLESS — like an astronaut in orbit, except the elevator eventually hits the ground." },
      { t: "Free fall defined", d: "Free fall means the ONLY forces on you are gravitational. No floor, seat or string is pushing or pulling." },
      { t: "Hanging works the same way", d: "Hanging from a spring scale, the tension is your weight: $T = m(a + g)$ when accelerating up, zero in free fall." },
      { t: "An Atwood machine", d: "Masses $m_1 \\lt m_2$ over a frictionless pulley on a massless string. The tension is the same on both sides — a massless string with different tensions at its ends would have infinite acceleration — so both masses have the SAME weight." },
      { t: "Solving it", d: "$T - m_1g = m_1a$ and $m_2g - T = m_2a$ give $a = \\frac{m_2 - m_1}{m_1 + m_2}g$ and $T = \\frac{2m_1m_2}{m_1 + m_2}g$. Equal masses: no acceleration, $T = mg$. One mass zero: the other falls freely and $T = 0$." },
      { t: "Mass is not weight", d: "With 1.1 kg and 1.25 kg, $a \\approx g/16$ and both weigh $1.17g$ newtons: the lighter one, accelerating up, has gained weight; the heavier one, accelerating down, has lost it." },
      { t: "The vertical circle again", d: "At the bottom of a swing, $T = m(a_c + g)$: heavier. At the top, $T = m(a_c - g)$: lighter, and weightless when $a_c = g$ exactly. If $a_c \\lt g$ the tension would be negative — meaning the bucket never gets there." },
      { t: "Jumping off a table", d: "Half a second of weightlessness from a 1 m table: a gallon of water floats above the hands. Then the bill: hitting the floor at about 5 m/s and stopping in 0.2 s is 25 m/s² upward — about three and a half times normal weight." },
      { t: "Seen on a fast scale", d: "Professor Trumper's scale with a 10 ms response: a 14.5 lb load drops to zero in free fall, spikes to three or four times its weight on the cushion, bounces into weightlessness again, and settles." },
      { t: "'Zero gravity' flights", d: "The KC-135 cuts power at 45° and 425 mph and flies a free-fall parabola for about 30 seconds: everyone weightless. Then about double weight as it pulls out. 'Zero gravity' is a misnomer: gravity is fully present — the weight is zero." },
    ],
    worked: "To find the reading on any scale, isolate the body, write $F = ma$ with the scale's force and $mg$, and solve for the scale's force. Up-acceleration adds to $g$, down-acceleration subtracts.",
    watch: "Calling a weightless astronaut 'free of gravity'. Gravity acts on them almost as strongly as on the ground; they are weightless because nothing pushes back.",
    concepts: [],
    checks: [
      { q: "In a freely falling elevator, a bathroom scale under your feet reads zero because:", opts: ["Gravity has switched off", "Nothing needs to push on you — only gravity acts, so your weight is zero", "Your mass has become zero", "The scale is broken by the fall"], a: 1,
        expl: "Weight is the supporting force. In free fall gravity alone acts and the floor pushes with nothing." },
      { q: "An Atwood machine has 1.1 kg and 1.25 kg masses ($g = 10$). Its acceleration, in m/s² to three decimal places, is:", num: 0.638,
        expl: "$a = \\frac{0.15}{2.35}\\times10 = 0.638$ m/s², about $g/16$." },
      { q: "The string tension in that machine, in newtons to two decimal places, is:", num: 11.7,
        expl: "$T = \\frac{2 \\times 1.1 \\times 1.25}{2.35}\\times10 = 11.70$ N — the weight of BOTH masses, $1.17g$." },
    ],
  },

  "phys100.0.8": {
    takeaway: "Friction grows to match whatever push it must resist, up to a maximum $\\mu N$ — and that maximum is, surprisingly, independent of the mass and of the contact area; only the pair of materials matters.",
    beats: [
      { t: "Static friction adjusts", d: "Push gently on a block and it does not move: friction grows to match. Push harder and it grows further, until it reaches a MAXIMUM, $F_f^{\\max} = \\mu N$, and you win. $N$ is the normal force, equal to $mg$ on a level floor." },
      { t: "Static and kinetic", d: "$\\mu_s$ is for breaking the block loose; $\\mu_k$, smaller, is for keeping it sliding. Starting motion is harder than sustaining it." },
      { t: "Measuring it with a tilt", d: "On an incline at $\\alpha$, resolve gravity into $mg\\cos\\alpha$ into the surface (balanced by $N$) and $mg\\sin\\alpha$ down the slope. At the angle where it just slips, $mg\\sin\\alpha = \\mu_s mg\\cos\\alpha$, so $\\mu_s = \\tan\\alpha$." },
      { t: "Mass does not matter", d: "The mass cancels. A plastic bin empty and a bin loaded with five times its mass slid at 21.0° and 21.2°. A parked truck and a small car start to slide on the same slope, about 45° for rubber on concrete." },
      { t: "Neither does area", d: "Two wooden blocks, one resting on a face four times larger than the other: they slid within two-tenths of a degree. Wider tyres do not grip better by this law — so why do race cars use them? An assignment question." },
      { t: "An incline with a hanging mass", d: "Block $m_1$ on a slope tied over a pulley to hanging $m_2$. The trouble: you do not know in advance whether it will move up, move down, or stay put — and friction points DIFFERENTLY in each case." },
      { t: "Three cases, tested separately", d: "It accelerates uphill if $m_2g \\gt m_1g\\sin\\alpha + \\mu_s m_1g\\cos\\alpha$. Downhill if $m_2g \\lt m_1g\\sin\\alpha - \\mu_s m_1g\\cos\\alpha$. Otherwise it does not move at all, and static friction takes whatever value balances it." },
      { t: "A worked example", d: "$m_1 = 1$ kg, $m_2 = 2$ kg, $\\alpha = 30°$, $\\mu_s = 0.5$, $\\mu_k = 0.4$, $g = 10$. Since $20 \\gt 5 + 4.33$, it goes uphill — and once moving, KINETIC friction applies and the tension falls below $m_2g$, because $m_2$ is now accelerating down and losing weight." },
      { t: "Sanity checks", d: "The acceleration must come out positive in the direction you established, and the tension must be less than 20 N. If not, there is an error." },
      { t: "When nothing moves", d: "With $m_2 = 0.4$ kg: neither condition holds, so $a = 0$. Gravity pulls 5 N downhill, the string 4 N uphill, and static friction supplies exactly 1 N uphill." },
      { t: "Lubrication", d: "Water between tyre and dusty road can make friction almost vanish: hydroplaning. His pan lid, scraping when dry, spun freely once water collected in the rim." },
      { t: "Riding on gas", d: "Hovercraft, air tracks and a dry-ice puck all float on a thin gas film, reducing friction to almost nothing — the air track will serve for collision experiments later." },
    ],
    worked: "With friction in play, first decide which way the system would move, test each direction against the maximum static friction, and only then write the equations — with kinetic friction if it moves, and whatever friction is needed if it does not.",
    watch: "Assuming friction always equals $\\mu N$. That is only its maximum; until slipping, static friction is exactly what equilibrium requires, and may even point the other way.",
    concepts: [],
    checks: [
      { q: "Two blocks of the same material but different masses sit on an incline that is slowly raised. They start to slide:", opts: ["The heavier first", "The lighter first", "At the same angle, since $\\mu_s = \\tan\\alpha$ does not involve the mass", "Only if their contact areas match"], a: 2,
        expl: "Both $mg\\sin\\alpha$ and the maximum friction $\\mu_s mg\\cos\\alpha$ scale with $m$; the mass cancels." },
      { q: "With $m_1 = 1$ kg on a 30° slope, $m_2 = 2$ kg hanging, $\\mu_k = 0.4$ and $g = 10$, the acceleration once moving, in m/s² to two decimal places, is:", num: 3.85,
        expl: "$a = \\frac{20 - 5 - 0.4\\times10\\cos30°}{3} = 3.85$ m/s² uphill." },
      { q: "A 0.361 kg box on a 20° incline starts moving uphill when 0.270 kg hangs from it. The static friction coefficient, to three decimal places, is:", num: 0.432,
        expl: "$\\mu_s = \\frac{m_2 - m_1\\sin20°}{m_1\\cos20°} = 0.432$ — larger than the $\\tan20° = 0.364$ from the tilt test, since wood grain differs with direction." },
    ],
  },

  "phys100.0.9": {
    takeaway: "A revision sheet for the first exam: scaling, vectors, one-dimensional motion read off a graph, projectiles as two independent motions, and uniform circular motion — each worked with numbers.",
    beats: [
      { t: "What the exam covers", d: "The first five lectures and the first two assignments. The fundamental equations will NOT be given — they have to be part of your world." },
      { t: "Scaling, revisited", d: "Resisting crushing requires $d \\propto \\ell^{3/2}$; the data say $d \\propto \\ell$. What nature actually guards against is BUCKLING — bones bowing and snapping — and that requirement scales $d$ with $\\ell$." },
      { t: "Dot products two ways", d: "$\\vec A = 3\\hat x$, $\\vec B = 2\\hat x + 2\\hat y$: by components, $3 \\times 2 = 6$ at once. By $|\\vec A||\\vec B|\\cos\\theta = 3 \\times 2\\sqrt2 \\times \\cos45° = 6$ too — but slower. Choose the method the question makes easy." },
      { t: "Cross products", d: "$|\\vec A \\times \\vec B| = |\\vec A||\\vec B|\\sin\\theta$, perpendicular to both, direction by the right-hand corkscrew, and $\\vec A \\times \\vec B = -\\vec B \\times \\vec A$." },
      { t: "Reading a motion graph", d: "$x(t)$ over four seconds: a parabola from 6 to 3 m, a straight line to $-3$ m, a flat second, a straight line back to 6 m. Parabola means constant acceleration ($-6$ m/s²); straight lines mean constant velocity ($-6$, 0, $+9$ m/s); at the corners $v$ and $a$ are undefined." },
      { t: "Average velocity against average speed", d: "Start and end at $x = 6$: average velocity 0. Distance travelled $3 + 6 + 0 + 9 = 18$ m in 4 s: average speed 4.5 m/s. Signs appear only in velocity." },
      { t: "Projectiles as two motions", d: "$x = x_0 + v_{0x}t$ and $v_x = v_{0x}$ forever. $y = y_0 + v_{0y}t - \\tfrac12gt^{2}$, $v_y = v_{0y} - gt$, $a_y = -g$ — with the minus because 'up' was chosen positive, not because gravity points down." },
      { t: "The KC-135 in numbers", d: "189 m/s at 45°: both components 133 m/s. Top when $v_y = 0$: $t = 13.3$ s, $h \\approx 884$ m. Back to start height after 26.6 s, 3.5 km downrange, with $v_y = -133$ m/s — the same speed at the mirror angle." },
      { t: "Uniform circular motion", d: "$f = 1/T$, $\\omega = 2\\pi/T$, $v = \\omega r$, $a_c = v^{2}/r = \\omega^{2}r$ toward the centre." },
      { t: "NASA's centrifuge", d: "15 m arm, 24 rpm: $T = 2.5$ s, $\\omega \\approx 2.5$ rad/s, $v \\approx 38$ m/s (85 mph), $a_c \\approx 95$ m/s² — nearly 10 $g$, with the direction changing all the while. Most of us faint near 6 $g$. A 747 takeoff is only about 2 m/s²." },
      { t: "A puzzle for the weekend", d: "Slide your fingers together under a metre stick: they move alternately, never together. The finger nearer the centre carries more of the weight, so more friction; the other slides until IT is nearer, and they swap. Friction's maximum is $\\mu N$, and $N$ is shifting." },
    ],
    worked: "On any problem, draw the axes and choose which way is positive before writing a single equation. Every sign afterwards follows from that choice — and the final answer's sign is a check on it.",
    watch: "Putting a minus sign on $g$ because 'gravity points down'. The sign comes from your axis; choose 'down' as positive and the acceleration is $+g$.",
    concepts: [],
    checks: [
      { q: "An object goes from $x = 6$ m to 3, to $-3$, stays, and returns to 6 m in 4 s. Its average speed and average velocity are:", opts: ["4.5 m/s and 4.5 m/s", "4.5 m/s and 0", "0 and 4.5 m/s", "1.5 m/s and 0"], a: 1,
        expl: "Distance $3 + 6 + 0 + 9 = 18$ m over 4 s; displacement zero." },
      { q: "The KC-135 enters its parabola with a vertical speed of 133 m/s ($g = 10$). The height it gains, in metres to the nearest metre, is:", num: 884,
        expl: "$v_{0y}^{2}/2g = 133^{2}/20 = 884$ m, reached after 13.3 s." },
      { q: "NASA's centrifuge has a 15 m arm and turns once every 2.5 s. The centripetal acceleration, in m/s² to one decimal place, is:", num: 94.7,
        expl: "$\\omega = 2\\pi/2.5 = 2.51$ rad/s, so $\\omega^{2}r = 94.7$ m/s² — almost 10 $g$." },
    ],
  },

  "phys100.0.10": {
    takeaway: "A force that pulls back in proportion to the displacement, $F = -kx$, gives simple harmonic motion: $x = A\\cos(\\omega t + \\varphi)$ with $\\omega = \\sqrt{k/m}$ — and a period that does not depend on how far you pull it.",
    beats: [
      { t: "Hooke's law", d: "Stretch or compress a spring by $x$ and it pushes back with $F = -kx$. The minus sign is the whole story: the force always points back toward equilibrium. It holds only until the spring is overstretched." },
      { t: "Measuring k", d: "Hang masses on the spring and plot the extension: a straight line. Each kilogram added stretched Lewin's spring about 13 cm, so $k = \\Delta(mg)/\\Delta x$ — the slope, not a single reading." },
      { t: "The equation of motion", d: "$m\\ddot x = -kx$, so $\\ddot x + \\tfrac km x = 0$. The solution is $x = A\\cos(\\omega t + \\varphi)$ with $\\omega = \\sqrt{k/m}$ and $T = 2\\pi\\sqrt{m/k}$. $A$ and $\\varphi$ come from the starting conditions; $T$ does not." },
      { t: "A worked start", d: "$k = 10$ N/m, $m = 0.1$ kg, released from $x = 0$ at $-3$ m/s: $\\omega = 10$ rad/s, $T = 0.628$ s, and the starting conditions fix $A = v_0/\\omega = 0.3$ m and $\\varphi = \\pi/2$." },
      { t: "The glider on the air track", d: "186 g on two springs: ten oscillations took 15.16 s, and 15.13 s from a larger amplitude — the same within error. Double the mass to 372 g: the prediction is $\\sqrt2 \\times 15.15 = 21.42$ s; measured 21.36 s." },
      { t: "The pendulum", d: "The restoring force is $-mg\\sin\\theta$. Only for small angles, where $\\sin\\theta \\approx \\theta$, is it proportional to the displacement, and then $T = 2\\pi\\sqrt{\\ell/g}$ — no mass in it. A 1 m pendulum ticks with a period of about 2 s." },
      { t: "Lewin rides the bob", d: "A 5 m pendulum, $T = 4.57 \\pm 0.02$ s predicted. Ten swings: 45.70 s at 5°, 45.75 s at 10°, and 45.6 s with Lewin himself sitting on the bob — mass does not matter, as long as he keeps his body in the shape of the ball." },
    ],
    worked: "For any system that oscillates, write $m\\ddot x$ as minus a constant times $x$. Whatever multiplies $x$ after dividing by $m$ is $\\omega^{2}$, and the period is $2\\pi/\\omega$ — read off the equation, not solved again.",
    watch: "Using $T = 2\\pi\\sqrt{\\ell/g}$ for large swings. It rests on $\\sin\\theta \\approx \\theta$; at large angles the period grows and the motion is no longer simple harmonic.",
    concepts: [],
    checks: [
      { q: "A 0.1 kg mass on a spring with $k = 10$ N/m. Its period, in seconds to three decimal places, is:", num: 0.628,
        expl: "$\\omega = \\sqrt{10/0.1} = 10$ rad/s, so $T = 2\\pi/10 = 0.628$ s, whatever the amplitude." },
      { q: "The glider's mass is doubled from 186 g to 372 g. Its period:", opts: ["doubles", "grows by $\\sqrt2$", "halves", "is unchanged"], a: 1,
        expl: "$T \\propto \\sqrt m$: $15.15 \\times \\sqrt2 = 21.42$ s predicted, 21.36 s measured." },
      { q: "Lewin sits on the bob of the 5 m pendulum. The period:", opts: ["grows, because the mass is larger", "shrinks, because the mass is larger", "stays the same, because $T = 2\\pi\\sqrt{\\ell/g}$ has no mass in it", "doubles"], a: 2,
        expl: "The mass cancels. Ten swings took 45.6 s with him on it, against 45.70 s without — the same within the error, provided he does not change the length by sitting up." },
    ],
  },

  "phys100.0.11": {
    takeaway: "Work is force times displacement, $W = \\int \\vec F \\cdot d\\vec r$, and it equals the change in kinetic energy. For a conservative force like gravity the work depends only on the endpoints, so mechanical energy $K + U$ is conserved.",
    beats: [
      { t: "Work and kinetic energy", d: "$W = \\int \\vec F \\cdot d\\vec r$, a scalar measured in joules. The work–energy theorem: the work done by the net force is $\\Delta K = \\tfrac12 mv_B^{2} - \\tfrac12 mv_A^{2}$. Lifting 15 kg by 1 m costs about 150 J." },
      { t: "Gravity is conservative", d: "Going from A to B, gravity does $-mg(y_B - y_A)$ of work, whatever the path — straight up, a zig-zag, a loop. Only the height difference counts. Friction is not conservative: the longer the path, the more work it takes." },
      { t: "Conservation of mechanical energy", d: "When only conservative forces do work, $K + U$ is constant. An object released from height $h$ has $v^{2} = 2g(h - y)$ at height $y$ — no matter what track it came down." },
      { t: "The loop-the-loop", d: "At the top of a loop of radius $R$ the track can only push down, so the minimum speed there satisfies $mg = mv^{2}/R$. With $v^{2} = 2g(h - 2R)$, the ball needs $h \\ge 2.5R$. Release it from lower and it falls off." },
      { t: "Universal gravitation", d: "$F = GMm/r^{2}$, $G = 6.67 \\times 10^{-11}$. At the Earth's surface this is $mg$, so $g = GM/R^{2}$. Far away the potential energy is $U = -GMm/r$: zero at infinity, negative everywhere else." },
      { t: "The bowling ball to the chin", d: "A heavy pendulum released from his chin swings across the room and back. Mechanical energy is conserved, so it cannot come back higher than it started — as long as he does not push it. Lewin stands still, and trusts the physics." },
    ],
    worked: "For a speed at the end of a track, skip the forces: write $mgh_A + \\tfrac12mv_A^{2} = mgh_B + \\tfrac12mv_B^{2}$ and solve. Forces are only needed where a CONDITION matters — like the track still pushing at the top of the loop.",
    watch: "Taking $h = 2R$ for the loop because 'the ball has to reach the top'. Reaching the top with zero speed means falling off before it gets there; it has to arrive with $v^{2} = gR$ to spare.",
    concepts: [],
    checks: [
      { q: "A ball rolls without friction into a vertical loop of radius $R$. The minimum release height, in units of $R$ to one decimal place, is:", num: 2.5,
        expl: "At the top $v^{2} \\ge gR$, and $v^{2} = 2g(h - 2R)$, so $2(h - 2R) \\ge R$ and $h \\ge 2.5R$." },
      { q: "With $G = 6.67 \\times 10^{-11}$, $M = 5.97 \\times 10^{24}$ kg and $R = 6.37 \\times 10^{6}$ m, the gravitational acceleration at the Earth's surface, in m/s² to two decimal places, is:", num: 9.81,
        expl: "$g = GM/R^{2} = 3.98 \\times 10^{14} / 4.06 \\times 10^{13} = 9.81$ m/s²." },
      { q: "An object slides from A to B once straight down and once along a long zig-zag, both frictionless. The work gravity does:", opts: ["is larger on the zig-zag", "is larger straight down", "is the same both ways", "is zero both ways"], a: 2,
        expl: "Gravity is conservative: its work is $-mg\\,\\Delta y$ and depends only on the endpoints." },
    ],
  },

  "phys100.0.12": {
    takeaway: "Drag on a sphere has two parts, $F = C_1 r v + C_2 r^{2} v^{2}$: viscous at low speed, pressure at high speed. When drag equals weight the object stops accelerating, and that terminal speed scales as $r^{2}$ in the first regime and $\\sqrt r$ in the second.",
    beats: [
      { t: "Two terms", d: "$|F| = C_1 r v + C_2 r^{2} v^{2}$. $C_1$ comes from viscosity, $C_2$ from pushing the fluid out of the way. The two are equal at the critical speed $v_c = C_1/(C_2 r)$; well below it the first term rules (regime 1), well above it the second (regime 2)." },
      { t: "Terminal speed", d: "The object speeds up until drag balances $mg$. In regime 1, $v_t = mg/(C_1 r)$; for a sphere $m \\propto r^{3}$, so $v_t \\propto r^{2}$. In regime 2, $v_t = \\sqrt{mg/(C_2 r^{2})} \\propto \\sqrt r$." },
      { t: "Ball bearings in syrup", d: "Steel balls of several sizes fall through Karo syrup — deep in regime 1. They reach 99% of terminal speed within about 9 ms. Plot the fall time against $1/d^{2}$: a straight line, exactly as $v_t \\propto r^{2}$ demands." },
      { t: "In air", d: "For air, $C_1 \\approx 3.1 \\times 10^{-4}$ and $C_2 \\approx 0.85$. The critical speed for anything the size of a pebble is tiny, so almost everything that falls in air is in regime 2." },
      { t: "The balloon", d: "34 g, radius 0.35 m: $v_t = \\sqrt{mg/(C_2 r^{2})} \\approx 1.8$ m/s, so a 3 m drop should take about 2 s rather than the 0.8 s of free fall. It took 2.0 s." },
      { t: "Raindrops and people", d: "A 1 cm pebble dropped from 475 m would hit at about 225 mph without air; with air, about 75 mph. A skydiver's terminal speed is about 150 mph. Even an apple dropped from a few metres arrives some 2 ms late." },
      { t: "The asymmetric trajectory", d: "With drag the path is no longer a parabola: it comes down more steeply than it went up. Lewin's puzzle — is the rise or the fall longer? Drag opposes the motion both ways, so it adds to gravity going up and subtracts from it coming down. The fall takes longer." },
    ],
    worked: "Before using a drag formula, decide which regime you are in by comparing the speed with $v_c = C_1/(C_2 r)$. Then keep only the dominant term — the terminal speed follows from setting it equal to $mg$.",
    watch: "Assuming heavier objects always fall faster. In regime 2, $v_t \\propto \\sqrt{m}/r$, so what matters is the mass per unit of cross-section, not the mass — a big light balloon drifts down while a small pebble drops.",
    concepts: [],
    checks: [
      { q: "A balloon of mass 34 g and radius 0.35 m falls in regime 2 with $C_2 = 0.85$ ($g = 9.8$). Its terminal speed, in m/s to two decimal places, is:", num: 1.79,
        expl: "$v_t = \\sqrt{mg/(C_2 r^{2})} = \\sqrt{0.333/0.104} = 1.79$ m/s." },
      { q: "In regime 1 (viscous), doubling the radius of a steel sphere multiplies its terminal speed by:", opts: ["$\\sqrt2$", "2", "4", "8"], a: 2,
        expl: "$v_t = mg/(C_1 r)$ with $m \\propto r^{3}$, so $v_t \\propto r^{2}$: a factor of 4." },
      { q: "A ball thrown straight up in air, with drag. Compared with the time going up, the time coming down is:", opts: ["shorter", "the same", "longer", "zero"], a: 2,
        expl: "Going up, drag and gravity both slow it; coming down, drag works against gravity. The net downward acceleration is smaller, so the fall takes longer." },
    ],
  },

  "phys100.0.13": {
    takeaway: "Force is minus the slope of the potential, $F = -dU/dx$. Near any minimum of $U$ the potential is a parabola, so small motions about a stable equilibrium are simple harmonic — and energy conservation gives the period without drawing a single force.",
    beats: [
      { t: "Force from potential", d: "For a conservative force, $F = -dU/dx$. Where $dU/dx = 0$ there is equilibrium: stable at a minimum of $U$ ($U'' > 0$), unstable at a maximum ($U'' \\lt 0$). A marble in a bowl against a marble on a dome." },
      { t: "The spring, by energy", d: "$\\tfrac12 mv^{2} + \\tfrac12 kx^{2}$ is constant. Differentiate with respect to time: $m v\\dot v + kx\\dot x = 0$, so $\\ddot x + \\tfrac km x = 0$ — the same equation as from Newton, with no force diagram." },
      { t: "An object on a circular track", d: "Its height is $R(1 - \\cos\\theta)$, so $U = mgR(1 - \\cos\\theta) \\approx \\tfrac12 mgR\\theta^{2}$ for small angles. Energy conservation gives $\\ddot\\theta + \\tfrac gR\\theta = 0$ and $T = 2\\pi\\sqrt{R/g}$ — the pendulum again." },
      { t: "Why only gravity matters", d: "The normal force of the track, like the tension in a pendulum string, is always perpendicular to the motion. It does no work, so it never enters the energy equation — which is why the track and the string give the same period." },
      { t: "The air track bent into a circle", d: "Radius $115 \\pm 5$ m, swung only about 1.2°: predicted $T = 21.5 \\pm 0.5$ s. Three oscillations took 64.05 s, so $T = 21.35$ s — inside the error." },
      { t: "The rolling ball", d: "A ball rolling in a curved track of radius 85 cm: predicted 1.85 s, measured 2.27 s from ten oscillations. Friction cannot explain it, since it hardly damps. Lewin leaves it open; the answer is that the ball also ROTATES, so some of its energy goes into spinning and it moves more slowly than a sliding object would." },
    ],
    worked: "To find the period of any small oscillation: write the energy, expand $U$ to second order around the minimum, and read off $\\omega^{2} = U''/m$ (or the angular equivalent). One derivative, no force diagram.",
    watch: "Treating a rolling ball as a sliding block. Rolling stores kinetic energy in rotation as well as in translation, so the same drop in $U$ buys less speed — and the period comes out longer than $2\\pi\\sqrt{R/g}$.",
    concepts: [],
    checks: [
      { q: "An air-track glider oscillates on a circular track of radius 115 m ($g = 9.8$), with small amplitude. Its period, in seconds to one decimal place, is:", num: 21.5,
        expl: "$T = 2\\pi\\sqrt{R/g} = 2\\pi\\sqrt{115/9.8} = 21.5$ s. Lewin measured 21.35 s." },
      { q: "A point where $dU/dx = 0$ and $d^{2}U/dx^{2} \\gt 0$ is:", opts: ["an unstable equilibrium", "a stable equilibrium", "not an equilibrium", "a point of maximum force"], a: 1,
        expl: "Zero slope means zero force; positive curvature means $U$ is a minimum, so a small displacement produces a force pulling back." },
      { q: "A ball ROLLING in a curved track oscillates more slowly than $2\\pi\\sqrt{R/g}$ predicts, mainly because:", opts: ["friction damps it", "part of its kinetic energy is rotational", "the normal force does work", "the track radius was measured wrongly"], a: 1,
        expl: "The same loss of $U$ is shared between translation and rotation, so the ball moves more slowly and the period is longer." },
    ],
  },

  "phys100.0.14": {
    takeaway: "To escape the Earth, total energy must reach zero: $v_{esc} = \\sqrt{2GM/R}$, about 11.2 km/s. A circular orbit needs $\\sqrt{GM/r}$, exactly $\\sqrt2$ less. Then power, $P = \\vec F \\cdot \\vec v$, and how little of our energy use is muscle.",
    beats: [
      { t: "Escape velocity", d: "$E = \\tfrac12 mv^{2} - GMm/r$ is conserved. To just reach infinity with nothing left, $E = 0$: $v_{esc} = \\sqrt{2GM/R} \\approx 11.2$ km/s, about 25,000 mph. $E \\ge 0$ is an unbound orbit; $E \\lt 0$ is bound." },
      { t: "Circular orbits", d: "Gravity supplies the centripetal force: $GMm/r^{2} = mv^{2}/r$, so $v = \\sqrt{GM/r}$ and $T = 2\\pi r^{3/2}/\\sqrt{GM}$. Know $r$ and the period follows, and the other way round." },
      { t: "From shuttle to Jupiter", d: "The shuttle at 400 km altitude ($r \\approx 6800$ km): about 90 minutes and 8 km/s. The Moon: 27.5 days at 1 km/s. The Earth around the Sun: a year at 30 km/s. Jupiter, five times further out: $5^{3/2} \\approx 12$ years." },
      { t: "Sputnik's secret", d: "The period and radius of Sputnik's orbit were easy to find — 96 minutes. Its mass was not: orbital motion does not depend on the satellite's mass, which is exactly what the Americans wanted to know." },
      { t: "The factor of $\\sqrt2$", d: "At any radius, escape speed is $\\sqrt2$ times orbital speed: $8 \\times \\sqrt2 \\approx 11.2$. And in a circular orbit $K = \\tfrac12 GMm/r$, so $E = \\tfrac12 U = -K$: always negative." },
      { t: "Power", d: "$P = dW/dt = \\vec F \\cdot \\vec v$, in watts. On a bike in regime 2, drag $\\propto v^{2}$, so $P \\propto v^{3}$: 10 mph takes about 15 W, 25 mph about $2.5^{3} \\approx 15$ times more, some 230 W. It is the road's friction that pushes you forward." },
      { t: "Heat and food", d: "One calorie heats 1 g of water 1 °C and is 4.2 J (Joule's paddle wheel). Your body radiates about 100 W, $10^{7}$ J a day — 2,000 food Calories. Climbing three floors five times is only 35,000 J; climbing 5,000 feet is $10^{6}$ J, and then you do need to eat more." },
      { t: "The world's energy", d: "Heating a bath takes about $2 \\times 10^{7}$ J — a volunteer could not even keep six 20 W bulbs lit. The world uses about $4 \\times 10^{20}$ J a year; sunlight brings 1,400 W/m². Fossil fuel is being burned a million times faster than it forms; fusion of the oceans' deuterium would last billions of years." },
    ],
    worked: "For any orbit question, set gravity equal to $mv^{2}/r$ first; $v$ and $T$ follow. For escape, set the total energy to zero. The two answers always differ by $\\sqrt2$, which is a quick check.",
    watch: "Thinking a heavier satellite needs a different speed. The satellite's mass cancels on both sides of $GMm/r^{2} = mv^{2}/r$ — which is exactly why Sputnik's orbit gave away nothing about the rocket.",
    concepts: [],
    checks: [
      { q: "With $G = 6.67 \\times 10^{-11}$, $M = 5.97 \\times 10^{24}$ kg and $R = 6.37 \\times 10^{6}$ m, the escape speed from the Earth's surface, in km/s to one decimal place, is:", num: 11.2,
        expl: "$\\sqrt{2GM/R} = \\sqrt{1.25 \\times 10^{8}} = 11{,}180$ m/s, so 11.2 km/s." },
      { q: "With the same constants, the period of a circular orbit of radius 6800 km, in minutes to the nearest minute, is:", num: 93,
        expl: "$T = 2\\pi r^{3/2}/\\sqrt{GM} = 5583$ s, which is 93 minutes — Lewin's 'about an hour and a half'." },
      { q: "A cyclist in regime 2 speeds up from 10 to 25 mph. The power needed grows by a factor of about:", opts: ["2.5", "6", "15", "25"], a: 2,
        expl: "Drag $\\propto v^{2}$ and $P = Fv \\propto v^{3}$: $2.5^{3} = 15.6$." },
    ],
  },

});
