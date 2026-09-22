// Brickford — lecture summaries, MATH 110
//
// The point of a summary is review without rewatching: the claims a lecture
// establishes, in the order it builds them, with the figure that carries each
// one and the worked pattern you are expected to be able to reproduce.
//
// These summarise the *substance* of the material, not a transcript — they are
// written FROM the lecture, following its own argument in its own order.
//
// They used to be locked until the lecture was marked watched, on the theory
// that a summary could quietly replace watching. The owner chose otherwise on
// 21 Sep 2026: they render inline on the lecture page, unconditionally. The
// four gates still decide what counts as proven, and reading one moves none
// of them.
//
// beats[]  — the argument as it develops. fig is optional (an id in DAR.FIG).
// worked   — the practical pattern, because theory alone does not transfer.
// watch    — the trap, stated as the error rather than a warning.
// checks[] — active review; recognising a summary is not remembering it.
window.DAR = window.DAR || {};

DAR.SUMMARIES = Object.assign(DAR.SUMMARIES || {}, {

  "math110.0.0": {
    takeaway: "Everything in linear algebra is built from exactly two operations: adding vectors and scaling them.",
    beats: [
      { t: "Three views of the same object", d: "Physics: an arrow with length and direction, free to sit anywhere. Computer science: an ordered list of numbers. Mathematics: anything at all that you can add and scale. The whole subject lives in translating between the arrow and the list." },
      { t: "Coordinates are instructions, not identity", d: "Root the arrow at the origin and its coordinates say: walk this far along x, then this far up y. The numbers describe the arrow relative to a chosen frame — they are not the arrow itself." },
      { t: "Addition is composing two movements", d: "Slide the second arrow so its tail meets the first arrow's tip; the sum runs from the original tail to the final tip. That is why addition works out componentwise — you walked x₁ then x₂ in the same direction.", fig: "figVectorAdd" },
      { t: "Scaling stretches, squashes, or flips", d: "Multiplying by 2 doubles the length, by ½ halves it, by −1 reverses the direction. This is exactly why numbers in this context are called scalars: their job is to scale." },
    ],
    worked: "$(1,2) + (3,-1)$. Tip-to-tail: walk 1 right and 2 up, then 3 right and 1 down. You end at $(4,1)$ — the same answer as adding each coordinate separately. The geometry and the arithmetic are the same fact.",
    watch: "Treating the coordinate pair as the vector. Change the basis and every coordinate changes while the arrow does not move at all.",
    concepts: ["la-vector"],
    checks: [
      { q: "Vector addition works componentwise because:", opts: ["It is defined that way by convention", "Walking one displacement then the other adds each direction separately", "Vectors must start at the origin", "Only the lengths matter"], a: 1,
        expl: "Tip-to-tail movement in each axis accumulates independently, which is exactly componentwise addition." },
      { q: "The first component of $(1,2) + (3,-1)$ is:", num: 4, expl: "$1 + 3 = 4$." },
    ],
  },

  "math110.0.1": {
    takeaway: "Coordinates are scalars applied to a chosen basis, and the span is everything those scalars can reach.",
    beats: [
      { t: "The basis is hiding inside the coordinates", d: "The pair $(3,2)$ silently means $3\\hat{\\imath} + 2\\hat{\\jmath}$. Choose different basis vectors and the same pair of numbers points somewhere else entirely — coordinates only mean something relative to a basis." },
      { t: "Linear combination", d: "Fix two vectors, let their scalars roam over every value, and the set of results is the set of linear combinations. The word 'linear' is earned: if you hold one scalar fixed and vary the other, the tip traces a straight line." },
      { t: "Span is the reachable set", d: "Two non-collinear vectors in the plane reach every point in it. Two collinear ones reach only a single line, because the second offers no direction the first did not already have.", fig: "figSpan" },
      { t: "Dependence is redundancy", d: "A vector is dependent on the others when it already lies in their span — removing it shrinks nothing. Independent means every vector contributes a direction genuinely its own.", fig: "figIndependence" },
      { t: "Basis, defined properly", d: "A basis is an independent set that spans the space: enough vectors to reach everywhere, few enough that none is wasted." },
    ],
    worked: "Do $(1,2)$ and $(2,4)$ span the plane? Ask whether one is a multiple of the other: $(2,4) = 2(1,2)$, so they are collinear and span only a line. Contrast $(1,2)$ and $(0,1)$, which are not multiples and so reach every point.",
    watch: "Assuming independent means perpendicular. Two vectors one degree apart are independent — awkward to compute with, but independent.",
    concepts: ["la-span", "la-independence", "la-basis"],
    checks: [
      { q: "The span of two collinear vectors in $\\mathbb{R}^2$ is:", opts: ["The whole plane", "A line through the origin", "Two lines", "The origin only"], a: 1,
        expl: "The second vector adds no new direction, so the reachable set stays one line." },
      { q: "A basis of $\\mathbb{R}^3$ contains how many vectors?", num: 3, expl: "Exactly the dimension: enough to span, few enough to stay independent." },
    ],
  },

  "math110.0.2": {
    takeaway: "A linear transformation is fully determined by where the basis vectors land — and that is all a matrix records.",
    beats: [
      { t: "What makes a transformation linear", d: "Two visual conditions: every line stays a line (never curved), and the origin stays put. Equivalently, grid lines stay parallel and evenly spaced." },
      { t: "The consequence that does all the work", d: "Because grid lines stay parallel and evenly spaced, a vector that was $x\\hat{\\imath} + y\\hat{\\jmath}$ before is $x(\\text{where } \\hat{\\imath} \\text{ landed}) + y(\\text{where } \\hat{\\jmath} \\text{ landed})$ after. Track two vectors and you know the fate of every vector." },
      { t: "The matrix is just those landing spots", d: "Write where $\\hat{\\imath}$ landed in the first column and where $\\hat{\\jmath}$ landed in the second. That is the matrix. Nothing else is going on.", fig: "figGridTransform" },
      { t: "So multiplication is a linear combination of columns", d: "$\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix} = x\\begin{pmatrix}a\\\\c\\end{pmatrix} + y\\begin{pmatrix}b\\\\d\\end{pmatrix}$ — scale each column by the matching coordinate and add." },
    ],
    worked: "Build a 90° counter-clockwise rotation from scratch. $\\hat{\\imath}=(1,0)$ rotates to $(0,1)$; $\\hat{\\jmath}=(0,1)$ rotates to $(-1,0)$. Put those in as columns: $\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$. You never memorised it — you read it off the geometry.",
    watch: "Reading a matrix as a grid of numbers to manipulate. Read the columns as destinations and most matrix facts become obvious instead of memorised.",
    concepts: ["la-linear-map"],
    checks: [
      { q: "A linear transformation is pinned down entirely by:", opts: ["Its determinant", "Where the basis vectors land", "Its eigenvalues", "Its trace"], a: 1,
        expl: "Grid lines stay parallel and evenly spaced, so the basis images fix everything else." },
      { q: "For the 90° counter-clockwise rotation, the second component of the first column is:", num: 1,
        expl: "$\\hat{\\imath}=(1,0)$ lands on $(0,1)$, so the first column is $(0,1)$ and its second component is 1." },
    ],
  },

  "math110.0.3": {
    takeaway: "Matrix multiplication is doing one transformation after another, which is why order matters and why the rows-times-columns rule looks the way it does.",
    beats: [
      { t: "Composition produces a new transformation", d: "Apply a shear, then a rotation. The net effect is itself linear — lines stayed lines, the origin stayed fixed — so it has a matrix of its own. That matrix is the product.", fig: "figCompose" },
      { t: "Read right to left", d: "$AB$ means apply $B$ first, then $A$, inherited from function notation $f(g(x))$. The right-hand matrix touches the vector first." },
      { t: "Computing it is just tracking the basis again", d: "Send $\\hat{\\imath}$ through $B$, then through $A$: the result is the first column of $AB$. Repeat with $\\hat{\\jmath}$ for the second column. The row-times-column recipe is this bookkeeping written out." },
      { t: "Order genuinely changes the outcome", d: "Shear-then-rotate and rotate-then-shear leave the basis in different places, so $AB \\neq BA$. No algebra needed — watch where $\\hat{\\imath}$ ends up." },
      { t: "Associativity is free", d: "$(AB)C = A(BC)$ needs no computation: both sides mean apply $C$, then $B$, then $A$. Same sequence of actions, therefore the same transformation." },
    ],
    worked: "Shear $S=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ then rotate $R=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$. Track $\\hat{\\imath}$: $S$ leaves $(1,0)$, then $R$ sends it to $(0,1)$. Track $\\hat{\\jmath}$: $S$ sends $(0,1)$ to $(1,1)$, then $R$ sends that to $(-1,1)$. So $RS=\\begin{pmatrix}0&-1\\\\1&1\\end{pmatrix}$.",
    watch: "Expecting $AB = BA$. Rotating a sheared square is not shearing a rotated one, and the pictures differ visibly.",
    concepts: ["la-matmul"],
    checks: [
      { q: "In $AB$, which transformation acts on the vector first?", opts: ["$A$", "$B$", "Both simultaneously", "Whichever has larger entries"], a: 1,
        expl: "$(AB)x = A(Bx)$ — the right-hand map acts first, as in $f(g(x))$." },
      { q: "$(AB)C = A(BC)$ holds because:", opts: ["Determinants multiply", "Both describe the same sequence of actions", "Matrices commute", "It only holds for square matrices"], a: 1,
        expl: "Associativity is a statement about doing C, then B, then A either way." },
    ],
  },

  "math110.0.4": {
    takeaway: "Nothing changes in three dimensions: the transformation is still completely described by where the basis vectors land.",
    beats: [
      { t: "The same two conditions", d: "Grid lines stay parallel and evenly spaced, and the origin stays put. The grid is now a lattice filling space rather than a sheet, but the definition of linear does not gain a clause." },
      { t: "Three basis vectors, not two", d: "$\\hat{\\imath}$ along x, $\\hat{\\jmath}$ along y, and a new one, $\\hat{k}$, along z. Follow only those three — the full moving grid is noise, and the three landing spots carry all the information." },
      { t: "Nine numbers is just three columns", d: "Write where each basis vector lands as a column. Three vectors, three coordinates each: a $3\\times3$ matrix, and it describes the whole transformation." },
      { t: "Scale-and-add survives the transformation", d: "The coordinates $(x,y,z)$ are instructions for scaling the basis vectors and adding them. That recipe holds before and after, which is exactly why you scale each column by the matching coordinate and sum." },
      { t: "Composition is still composition", d: "Two $3\\times3$ matrices multiplied means: apply the right transformation, then the left. Graphics and robotics lean on this — a rotation that is hard to picture is built from separate rotations that are not." },
    ],
    worked: "Rotate space $90°$ about the y-axis. $\\hat{\\imath}=(1,0,0)$ lands on $(0,0,-1)$; $\\hat{\\jmath}$ does not move; $\\hat{k}$ lands on $(1,0,0)$. Those three triples are the columns. You read the matrix off the geometry instead of recalling a formula.",
    watch: "Assuming three dimensions needs new machinery. It needs one more basis vector and one more coordinate; every rule from two dimensions carries over untouched.",
    concepts: ["la-linear-map"],
    checks: [
      { q: "A $3\\times3$ matrix has nine entries because:", opts: ["Three dimensions squared is nine", "Three basis vectors each need three coordinates to say where they landed", "A matrix must be square to be invertible", "Each row is one equation"], a: 1,
        expl: "Columns count basis vectors, rows count the coordinates describing each landing spot. $3\\times3$." },
      { q: "Rotating $90°$ about the y-axis sends $\\hat{\\imath}$ to $(0,0,-1)$. The third component of the first column is:", num: -1,
        expl: "The first column is where $\\hat{\\imath}$ lands, and it lands one unit down the negative z-axis." },
    ],
  },

  "math110.0.5": {
    takeaway: "The determinant is the factor by which a transformation scales area, and its sign says whether space was flipped.",
    beats: [
      { t: "Measure the transformation by what it does to one square", d: "The unit square spanned by $\\hat{\\imath}$ and $\\hat{\\jmath}$ has area 1. After the transformation it is a parallelogram, and its area is the determinant. Because grid lines stay parallel and evenly spaced, every other region scales by that same factor.", fig: "figDeterminant" },
      { t: "Zero is the interesting case", d: "A determinant of zero means the square was flattened onto a line (or a point): the columns became dependent, dimension was lost, and information was destroyed. That is precisely when the matrix has no inverse." },
      { t: "Negative means orientation flipped", d: "If the transformation turns space over — $\\hat{\\jmath}$ ending up clockwise from $\\hat{\\imath}$ rather than counter-clockwise — the determinant is negative. Its magnitude is still the area factor." },
      { t: "Where $ad-bc$ comes from", d: "For $\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ the parallelogram's area works out to $ad-bc$. With $b=c=0$ it is a plain $a$-by-$d$ rectangle; the $bc$ term corrects for how much the shape has been sheared." },
      { t: "In three dimensions it is volume", d: "The unit cube becomes a parallelepiped and the determinant is its volume, with sign given by whether the basis stayed right-handed." },
      { t: "Products multiply", d: "$\\det(M_1M_2) = \\det(M_1)\\det(M_2)$, and no computation is required to believe it: apply one area factor and then the other." },
    ],
    worked: "$\\det\\begin{pmatrix}3&0\\\\0&2\\end{pmatrix} = 6$ — a 3-by-2 rectangle, area 6. Now $\\det\\begin{pmatrix}1&1\\\\2&2\\end{pmatrix} = 1\\cdot2 - 1\\cdot2 = 0$: the columns are collinear, the square collapses onto a line, and nothing can be inverted.",
    watch: "Thinking the determinant measures how big a matrix is. It measures how much the map multiplies volume — a matrix of huge entries can have determinant zero.",
    concepts: ["la-determinant"],
    checks: [
      { q: "$\\det A = 0$ tells you the transformation:", opts: ["Preserves area", "Collapses space into a lower dimension", "Is a rotation", "Has no eigenvalues"], a: 1,
        expl: "Zero area factor means the image is degenerate, so the columns are dependent and $A$ is not invertible." },
      { q: "$\\det\\begin{pmatrix}3&0\\\\0&2\\end{pmatrix}$ is:", num: 6, expl: "A 3-by-2 rectangle: area $3\\cdot2=6$." },
    ],
  },

  "math110.0.6": {
    takeaway: "Solving $A\\vec{x}=\\vec{v}$ asks which vector lands on $\\vec{v}$, and the determinant decides whether that question has one answer.",
    beats: [
      { t: "A linear system is a transformation question", d: "Pack the coefficients into a matrix $A$ and the unknowns into a vector $\\vec{x}$. Then $A\\vec{x}=\\vec{v}$ stops being a tangle of variables and becomes: which input vector lands on $\\vec{v}$?" },
      { t: "Non-zero determinant: play the tape backwards", d: "Space was not squashed, so exactly one vector lands on $\\vec{v}$, and you find it by running the transformation in reverse. That reverse is itself a linear transformation — the inverse, $A^{-1}$." },
      { t: "The inverse is defined by undoing", d: "$A^{-1}A$ is the transformation that does nothing: the identity, whose columns are $(1,0)$ and $(0,1)$. That single property is the whole content of the word inverse." },
      { t: "Zero determinant: no inverse exists", d: "You cannot unsquish a line back into a plane. A function sends one input to one output, and undoing a collapse would require sending one vector to a whole line of them." },
      { t: "Rank names how much survived", d: "The number of dimensions in the output. Rank 1 is a line, rank 2 a plane. Full rank means the rank equals the number of columns, so nothing collapsed at all." },
      { t: "Column space and null space", d: "The column space is the span of the columns — everything you can reach. The null space is everything crushed onto the origin, and it is exactly the solution set when $\\vec{v}$ is zero.", fig: "figRankNullity" },
    ],
    worked: "A collapse is not always fatal. If $A$ squashes the plane onto a line, $A\\vec{x}=\\vec{v}$ still has solutions — infinitely many — as long as $\\vec{v}$ happens to lie on that line. Off it, there are none.",
    watch: "Reading $\\det A = 0$ as no solution. It means no INVERSE — solutions still exist, a whole line of them, whenever $\\vec{v}$ lies in the column space.",
    concepts: ["la-rank-nullity"],
    checks: [
      { q: "A $3\\times3$ matrix squashes all of space onto a plane. Its rank is:", opts: ["0", "2", "3", "Undefined for a collapse"], a: 1,
        expl: "Rank is the dimension of the output. A plane is two-dimensional, so the rank is 2 — collapsed, but not as far as a line would be." },
      { q: "A matrix with 7 columns has rank 3. The dimension of its null space is:", num: 4,
        expl: "Rank plus nullity is the number of columns: $7-3=4$. Four dimensions' worth of input is crushed onto the origin." },
    ],
  },

  "math110.0.7": {
    takeaway: "The shape of a matrix is not bookkeeping: the columns count the input's dimensions and the rows count the output's.",
    beats: [
      { t: "Transformations between dimensions are ordinary", d: "The same two conditions apply — grid lines parallel and evenly spaced, origin fixed. Nothing in the definition requires the input and the output to live in the same space." },
      { t: "Columns are inputs, rows are outputs", d: "Three rows and two columns means two basis vectors, each landing somewhere that takes three numbers to describe. So a $3\\times2$ matrix maps two dimensions into three." },
      { t: "Full rank does not mean square", d: "That $3\\times2$ map sends everything onto a plane through the origin in 3D. The plane is its column space, and the matrix is full rank because the plane's dimension matches the input's." },
      { t: "Reading the shape is enough", d: "A $2\\times3$ matrix: three columns, so you start with three basis vectors in 3D; two rows, so each lands somewhere named by two numbers. A map from space onto the plane, read off without computing." },
      { t: "Down to one dimension is the interesting case", d: "A $1\\times2$ matrix takes 2D vectors to single numbers. Each column holds one number — where that basis vector landed on the line. This turns out to be the dot product wearing a different hat." },
    ],
    worked: "Take a line of evenly spaced dots in the plane and push them onto the number line. Linear means they stay evenly spaced after landing. The $1\\times2$ matrix that does it is just the two numbers $\\hat{\\imath}$ and $\\hat{\\jmath}$ land on.",
    watch: "Reading a $3\\times2$ matrix as a square one missing a column. Its input and output live in different spaces entirely — the vectors going in never meet the ones coming out.",
    concepts: ["la-linear-map"],
    checks: [
      { q: "A $2\\times3$ matrix describes a transformation:", opts: ["From 2D to 3D", "From 3D to 2D", "From 2D to 2D", "Only from a space to itself"], a: 1,
        expl: "Three columns means three input basis vectors, so you start in 3D; two rows means each landing spot needs two coordinates, so you finish in 2D." },
      { q: "A matrix mapping 4D to 2D has how many columns?", num: 4,
        expl: "One column per input basis vector, and the input space is four-dimensional." },
    ],
  },

  "math110.0.8": {
    takeaway: "Every linear map from space down to the number line is secretly a vector, and dotting with that vector is applying the map.",
    beats: [
      { t: "Two definitions that ought to be unrelated", d: "Numerically: pair the coordinates, multiply, add. Geometrically: project one vector onto the other's line and multiply the lengths. Positive when they roughly agree, zero when perpendicular, negative when opposed." },
      { t: "Order cannot matter, and symmetry says why", d: "With equal lengths, projecting $\\vec{w}$ onto $\\vec{v}$ is the mirror image of projecting $\\vec{v}$ onto $\\vec{w}$. Scale one of them and the answer doubles under either reading, so the unequal case agrees too." },
      { t: "Maps to the number line are $1\\times2$ matrices", d: "A linear function from 2D to numbers is fixed by where $\\hat{\\imath}$ and $\\hat{\\jmath}$ land, and each lands on a single number. Two numbers written in a row — a matrix one row tall." },
      { t: "That matrix is a vector on its side", d: "Multiplying a $1\\times2$ matrix by a vector is arithmetically identical to taking a dot product. On its own that is a curiosity; the next beat makes it a theorem." },
      { t: "Duality, proved by a projection", d: "Lay a number line diagonally through the origin, with the unit vector $\\hat{u}$ sitting at 1. Projecting onto it is linear, so it has a $1\\times2$ matrix — and by symmetry $\\hat{\\imath}$ lands on $\\hat{u}$'s x-coordinate and $\\hat{\\jmath}$ on its y. The matrix IS $\\hat{u}$." },
    ],
    worked: "Now scale $\\hat{u}$ by 3. Every entry of its matrix triples, so the map becomes project, then multiply by three. That is precisely why $\\vec{v}\\cdot\\vec{w}$ is the projected length times $|\\vec{v}|$ rather than the projected length alone.",
    watch: "Treating the dot product as a formula that measures angle. It is a linear map, and the vector you dot with is that map drawn as an arrow.",
    concepts: ["la-projection"],
    checks: [
      { q: "The dot product of two perpendicular vectors is zero because:", opts: ["They share no coordinates", "The projection of one onto the other is the zero vector", "Their lengths cancel out", "Perpendicular vectors cannot be dotted"], a: 1,
        expl: "The dot product is the projected length times the length projected onto. A perpendicular vector projects to nothing, so the first factor is zero." },
      { q: "$(1,2)\\cdot(3,4)$ is:", num: 11,
        expl: "$1\\cdot3 + 2\\cdot4 = 3 + 8 = 11$." },
    ],
  },

  "math110.0.9": {
    takeaway: "The 2D cross product is a signed area; the 3D one is a vector whose length is that area.",
    beats: [
      { t: "In two dimensions it is a signed area", d: "Take the parallelogram spanned by $\\vec{v}$ and $\\vec{w}$. The cross product is its area, positive when $\\vec{v}$ lies to the right of $\\vec{w}$ and negative when it lies to the left. Order matters; swapping flips the sign." },
      { t: "The basis vectors set the sign convention", d: "$\\hat{\\imath}\\times\\hat{\\jmath}$ is positive, and everything else follows. Since $\\hat{\\imath}$ sits to the right of $\\hat{\\jmath}$, that is what fixes right-of as the positive case rather than an arbitrary choice you have to memorise." },
      { t: "Which is exactly a determinant", d: "Put $\\vec{v}$'s coordinates in the first column and $\\vec{w}$'s in the second. That matrix sends the unit square to the parallelogram, and the determinant is the factor areas scale by — starting from a square of area 1." },
      { t: "In three dimensions the answer is a vector", d: "Its length is the area of the parallelogram, and its direction is perpendicular to both. Two directions qualify, so the right-hand rule picks one: forefinger along $\\vec{v}$, middle finger along $\\vec{w}$, thumb gives the answer." },
      { t: "The computation puts basis vectors in a column", d: "Write $\\hat{\\imath},\\hat{\\jmath},\\hat{k}$ down the first column, $\\vec{v}$ and $\\vec{w}$ in the other two, and compute as if they were numbers. Students are told this is a notational trick — the next lecture shows it is not." },
    ],
    worked: "$\\vec{v}=(-3,1)$, $\\vec{w}=(2,1)$. The determinant of the matrix with those columns is $(-3)(1)-(2)(1) = -5$. So the parallelogram has area 5, and the sign is negative because $\\vec{v}$ lies to the left of $\\vec{w}$.",
    watch: "Reading the 2D cross product as a vector. In the plane it is one signed number; only the 3D version returns a vector, and only there does the right-hand rule apply.",
    concepts: ["la-determinant"],
    checks: [
      { q: "Swapping the two vectors in a cross product:", opts: ["Leaves it unchanged", "Flips its sign", "Squares it", "Makes it zero"], a: 1,
        expl: "The area is the same, but the orientation reverses — and orientation is what the sign records." },
      { q: "For $\\vec{v}=(-3,1)$ and $\\vec{w}=(2,1)$, the 2D cross product $\\vec{v}\\times\\vec{w}$ is:", num: -5,
        expl: "$\\det\\begin{pmatrix}-3&2\\\\1&1\\end{pmatrix} = -3 - 2 = -5$. Area 5, negative orientation." },
    ],
  },

  "math110.0.10": {
    takeaway: "The cross product is the dual vector of a volume function, which is why a determinant computes it and why it comes out perpendicular.",
    beats: [
      { t: "Duality, recalled", d: "Any linear map from a space down to the number line is the same as a dot product with one particular vector — its dual vector. Numerically, it is the map's $1\\times n$ matrix turned on its side." },
      { t: "Define a volume function", d: "Hold $\\vec{v}$ and $\\vec{w}$ fixed and let $(x,y,z)$ vary. Put $(x,y,z)$ in the first column and $\\vec{v},\\vec{w}$ in the other two; the determinant is the signed volume of the parallelepiped the three of them span." },
      { t: "It is linear, so it has a dual vector", d: "Call it $\\vec{p}$. By the definition of a dual vector, $\\vec{p}\\cdot(x,y,z)$ equals that determinant for every input $(x,y,z)$ — no exceptions, because linearity leaves no room for any." },
      { t: "Computationally, $\\vec{p}$ is the basis-vector trick", d: "Expand the determinant and collect the coefficients of $x$, $y$ and $z$. Those three numbers are $\\vec{p}$'s coordinates. Writing $\\hat{\\imath},\\hat{\\jmath},\\hat{k}$ into that column is just a way of signalling to read them as coordinates." },
      { t: "Geometrically, $\\vec{p}$ must be perpendicular", d: "The volume is the base parallelogram's area times the height perpendicular to it. That is precisely a dot product with a vector perpendicular to both $\\vec{v}$ and $\\vec{w}$ whose length is that area." },
    ],
    worked: "Ask what $\\vec{p}$ satisfies $\\vec{p}\\cdot(x,y,z) = \\det[(x,y,z)\\,|\\,\\vec{v}\\,|\\,\\vec{w}]$ for every input. Answer it algebraically and you get the basis-vector trick; answer it geometrically and you get perpendicular-with-area-length. One question, so one vector.",
    watch: "Accepting the $\\hat{\\imath},\\hat{\\jmath},\\hat{k}$ column as a mnemonic with no content. It is the computational half of a duality argument, and the coefficients it collects ARE the dual vector's coordinates.",
    concepts: ["la-determinant"],
    checks: [
      { q: "The cross product comes out perpendicular to $\\vec{v}$ and $\\vec{w}$ because:", opts: ["It is defined to be", "Volume is base area times PERPENDICULAR height, and that is a dot product with a perpendicular vector", "Determinants are always perpendicular", "The right-hand rule forces it"], a: 1,
        expl: "The dual vector has to reproduce the volume through a dot product, and only the perpendicular component of the input contributes to that volume." },
      { q: "Two perpendicular vectors each of length 2 span a parallelogram of area:", num: 4,
        expl: "Perpendicular and equal in length makes it a square: $2\\times2=4$. So their cross product is a vector of length 4." },
    ],
  },

  "math110.0.11": {
    takeaway: "Each coordinate of the unknown vector is an area, and every area scales by the determinant — that is the whole of Cramer's rule.",
    beats: [
      { t: "A wrong idea, pointing the right way", d: "You might hope that dotting the output with the transformed basis vectors recovers the coordinates. It does not: transformations rarely preserve dot products. The ones that do are called orthonormal, and for those the hope is exactly right." },
      { t: "A coordinate, written as an area", d: "The parallelogram spanned by $\\hat{\\imath}$ and the unknown vector has base 1, so its signed area IS that vector's y-coordinate. Pairing the unknown vector with $\\hat{\\jmath}$ gives the x-coordinate the same way." },
      { t: "In three dimensions it is a volume", d: "Pair the unknown vector with the two basis vectors you are not asking about. The signed volume of that parallelepiped is the coordinate you want, and the right-hand rule keeps the sign honest." },
      { t: "Areas do not survive, but they all scale alike", d: "That is what the determinant is. After the transformation every parallelogram's area has been multiplied by $\\det A$ — the same factor for all of them — so dividing by it undoes the damage." },
      { t: "Which makes it computable from the output alone", d: "Replace one column of $A$ with the output vector and take that determinant, then divide by $\\det A$. Replacing the first column gives x, the second gives y. Nothing but numbers you were handed." },
    ],
    worked: "$A=\\begin{pmatrix}3&1\\\\1&2\\end{pmatrix}$, $\\vec{v}=(9,8)$. Swap the output into column one: $\\det\\begin{pmatrix}9&1\\\\8&2\\end{pmatrix}=10$, and $\\det A = 5$. So $x = 10/5 = 2$, and back-substituting gives $y=3$.",
    watch: "Reaching for Cramer's rule to actually solve systems. Gaussian elimination is always faster; this exists to show the determinant and the solution are one fact.",
    concepts: ["la-determinant"],
    checks: [
      { q: "Cramer's rule works because a linear transformation:", opts: ["Preserves all areas", "Scales every area by the same factor, its determinant", "Preserves dot products", "Keeps the basis vectors perpendicular"], a: 1,
        expl: "One common factor for every area is what lets you divide it back out. Preserving areas would make the determinant 1, which is a special case, not the rule." },
      { q: "For $A=\\begin{pmatrix}3&1\\\\1&2\\end{pmatrix}$ and $\\vec{v}=(9,8)$, Cramer's rule gives $x=$", num: 2,
        expl: "$\\det\\begin{pmatrix}9&1\\\\8&2\\end{pmatrix}=18-8=10$, divided by $\\det A = 6-1 = 5$." },
    ],
  },

  "math110.0.12": {
    takeaway: "A matrix whose columns are someone else's basis vectors translates their coordinates into yours; its inverse goes the other way.",
    beats: [
      { t: "Coordinates are a language, not the vector", d: "$(3,2)$ means scale $\\hat{\\imath}$ by 3, scale $\\hat{\\jmath}$ by 2, add. Those two vectors carry every implicit assumption: which way is right, which is up, how long one unit is." },
      { t: "Another basis is another language", d: "Jennifer's $\\vec{b}_1$ and $\\vec{b}_2$ are $(2,1)$ and $(-1,1)$ in our coordinates. In hers they are $(1,0)$ and $(0,1)$ — they are what those coordinates MEAN in her world. Same arrows in space, different words." },
      { t: "The grid is a construct", d: "Space has no grid of its own; a grid is a drawing of a chosen basis. Only the origin is agreed on, because everybody's $(0,0)$ is what you get by scaling anything by zero.", fig: "figBasis" },
      { t: "Her language into ours is a matrix-vector product", d: "Put her basis vectors, written in our coordinates, into the columns. Multiplying by her coordinates scales those columns and adds them — which is exactly what her coordinates were instructing all along." },
      { t: "A transformation from her seat is $A^{-1}MA$", d: "Translate her vector into our language, apply the transformation there, translate the result back. The middle matrix is the transformation as we see it; the outer two are the change of perspective." },
    ],
    worked: "The vector she calls $(-1,2)$: compute $-1\\cdot(2,1) + 2\\cdot(-1,1) = (-4,1)$, and that is it in our coordinates. Going the other way, our $(3,2)$ is her $(5/3,\\,1/3)$ — same arrow, inverse matrix.",
    watch: "Expecting the matrix to convert OUR coordinates into hers, because geometrically it moves our grid onto hers. Numerically it does the exact opposite.",
    concepts: ["la-basis"],
    checks: [
      { q: "The expression $A^{-1}MA$ represents:", opts: ["The transformation $M$ applied twice", "The same transformation $M$, described in the other basis", "The inverse of $M$", "A rotation composed with $M$"], a: 1,
        expl: "Translate in, transform, translate back. The transformation is unchanged; only the language describing it has moved." },
      { q: "Her basis vectors are $(2,1)$ and $(-1,1)$ in our coordinates. The vector she calls $(-1,2)$ has our first coordinate:", num: -4,
        expl: "$-1\\cdot 2 + 2\\cdot(-1) = -2 - 2 = -4$." },
    ],
  },

  "math110.0.13": {
    takeaway: "An eigenvector is a direction the transformation only stretches, never turns, and its eigenvalue is that stretch.",
    beats: [
      { t: "Most vectors get knocked off their line", d: "Apply a transformation and watch a vector: usually it ends up pointing somewhere new. Some special directions stay on their own line and are merely scaled. Those are the eigenvectors.", fig: "figEigen" },
      { t: "The defining equation", d: "$Av = \\lambda v$ with $v \\neq 0$. The matrix on the left and the plain number on the right do the same thing to that one vector — which is why eigenvectors make matrix powers easy." },
      { t: "Finding them means engineering a collapse", d: "Rewrite as $(A - \\lambda I)v = 0$. A nonzero $v$ can only be sent to zero if $A - \\lambda I$ squashes space, so $\\det(A - \\lambda I) = 0$. That is the characteristic equation, and this is where the determinant earns its keep." },
      { t: "Then solve for the direction", d: "Each root $\\lambda$ gives a matrix $A - \\lambda I$ whose null space is the eigenvectors for that $\\lambda$ — a whole line of them, since scaling an eigenvector leaves it an eigenvector." },
      { t: "Not every map has enough of them", d: "A shear has a single eigendirection; some rotations have none at all in the real plane, because every direction genuinely turns. An eigenbasis is a privilege, not a guarantee." },
      { t: "Why anyone cares", d: "In an eigenbasis the transformation is just independent stretches along axes, so applying it a hundred times means raising numbers to the hundredth power instead of multiplying matrices." },
    ],
    worked: "$A=\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}$. Then $\\det(A-\\lambda I) = (3-\\lambda)(2-\\lambda)$, giving $\\lambda = 3, 2$ — the diagonal, as always for a triangular matrix. For $\\lambda=3$, solve $(A-3I)v=0$: $\\begin{pmatrix}0&1\\\\0&-1\\end{pmatrix}v = 0$ forces the second component to zero, so $v=(1,0)$.",
    watch: "Assuming every matrix has a full set of eigenvectors. Ask what a shear does before you assume an eigenbasis exists.",
    concepts: ["la-eigen"],
    checks: [
      { q: "The characteristic equation is $\\det(A-\\lambda I)=0$ because:", opts: ["Determinants are easy to compute", "A nonzero vector can only be sent to zero if the map collapses space", "Every matrix is invertible", "$\\lambda$ must be real"], a: 1,
        expl: "$(A-\\lambda I)v=0$ with $v\\neq0$ requires a nontrivial null space, which means zero determinant." },
      { q: "The largest eigenvalue of $\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}$ is:", num: 3,
        expl: "Triangular, so the eigenvalues are the diagonal entries 3 and 2." },
    ],
  },

  "math110.0.14": {
    takeaway: "The trace and the determinant hand you the mean and the product of the eigenvalues, and two numbers are pinned down by those.",
    beats: [
      { t: "Fact one: the trace is the sum", d: "The two diagonal entries add to the sum of the eigenvalues, so the mean of the eigenvalues is the mean of the diagonal — and you can read that off the matrix without writing anything down." },
      { t: "Fact two: the determinant is the product", d: "Which ought to feel right: an eigenvalue says how much one direction is stretched, and the determinant says how much area is scaled overall. Multiply the stretches and you have the area factor." },
      { t: "Fact three: mean and product pin down the pair", d: "Two numbers sitting at $m \\pm d$ multiply to $m^2 - d^2$, a difference of squares. Set that equal to the product $p$ and $d = \\sqrt{m^2 - p}$ falls straight out." },
      { t: "The whole trick in one line", d: "$\\lambda = m \\pm \\sqrt{m^2 - p}$, with $m$ the mean of the diagonal and $p$ the determinant. No characteristic polynomial, no expanding, no quadratic formula." },
      { t: "Why it is faster, and when it is not", d: "It is the same mathematics as finding the roots of the characteristic polynomial — it has to be. The saving is that $m$ and $p$ are legible straight off the matrix, so you begin writing the answer immediately." },
    ],
    worked: "$\\begin{pmatrix}3&1\\\\4&1\\end{pmatrix}$: the mean of 3 and 1 is 2, and the determinant is $3-4=-1$. So the eigenvalues are $2 \\pm \\sqrt{4+1} = 2 \\pm \\sqrt{5}$. You never wrote down a polynomial.",
    watch: "Filing it as one more formula to memorise. Its value is that the trace and the determinant already mean something, so it carries its own derivation.",
    concepts: ["la-eigen"],
    checks: [
      { q: "In $\\lambda = m \\pm \\sqrt{m^2 - p}$, the quantity $p$ is:", opts: ["The trace", "The determinant", "The mean of the diagonal", "The larger eigenvalue"], a: 1,
        expl: "$p$ is the product of the eigenvalues, and the product of the eigenvalues is the determinant. $m$ is the mean, which comes from the trace." },
      { q: "For $\\begin{pmatrix}2&7\\\\1&8\\end{pmatrix}$, the larger eigenvalue is:", num: 9,
        expl: "Mean of the diagonal is 5; determinant is $16-7=9$. So $\\lambda = 5 \\pm \\sqrt{25-9} = 5 \\pm 4$, giving 9 and 1." },
    ],
  },

  "math110.0.15": {
    takeaway: "A vector is anything you can sensibly add and scale, and every result in linear algebra applies to all of them at once.",
    beats: [
      { t: "The question the series opened with", d: "Is a vector an arrow, or a list of numbers? Once you are fluent with changing basis, coordinates start to feel arbitrary — and determinants and eigenvectors plainly do not care which basis you picked." },
      { t: "Functions add and scale", d: "$(f+g)(x) = f(x) + g(x)$, and scaling a function multiplies every output. That is adding and scaling coordinate by coordinate, exactly as with arrows — there are just infinitely many coordinates." },
      { t: "So functions have linear transformations too", d: "The derivative is one. It is additive and it respects scaling, which is the pair of facts every calculus student uses daily without ever hearing them called linearity." },
      { t: "The derivative, written as a matrix", d: "Take polynomials with basis $1, x, x^2, x^3, \\dots$. A polynomial becomes a coordinate list ending in zeros, and the derivative becomes an infinite matrix carrying $1, 2, 3, \\dots$ down an offset diagonal." },
      { t: "Built the usual way", d: "Each column is the derivative of one basis function, written in coordinates. That is the same rule as for arrows: a linear map is determined by where the basis goes." },
      { t: "The axioms are an interface, not a foundation", d: "Eight rules that adding and scaling must obey. Satisfy them and every theorem applies to your objects, whatever they are. That is why textbooks define linearity as additivity and scaling rather than by grid lines." },
    ],
    worked: "Differentiate $x^3+5x^2+4x+5$ by matrix. Its coordinates are $(5,4,5,1,0,\\dots)$. The matrix returns $(4,10,3,0,\\dots)$, which reads back as $3x^2+10x+4$ — the derivative, obtained by matrix-vector multiplication.",
    watch: "Treating the abstract definition as the real one and the arrows as a crutch. The arrows are where the intuitions come from; the axioms are how they travel.",
    concepts: ["la-basis"],
    checks: [
      { q: "The eight vector-space axioms exist to:", opts: ["Define what an arrow is", "Let a result proved once apply to every set that satisfies them", "Make determinants computable", "Guarantee that a basis is finite"], a: 1,
        expl: "They are a checklist someone else verifies about their own objects. Prove a theorem from the axioms and it reaches every space anyone will ever define." },
      { q: "In the basis $1, x, x^2, x^3$, the derivative of $x^3+5x^2+4x+5$ has coefficient of $x$ equal to:", num: 10,
        expl: "The derivative is $3x^2 + 10x + 4$; the $x$ term comes from differentiating $5x^2$." },
    ],
  },
});
