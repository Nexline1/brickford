// Brickford — lecture summaries, MATH 110
//
// The point of a summary is review without rewatching: the claims a lecture
// establishes, in the order it builds them, with the figure that carries each
// one and the worked pattern you are expected to be able to reproduce.
//
// These summarise the *substance* of the material, not a transcript. Locked
// until the lecture is marked watched, so the summary can never quietly replace
// watching it.
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
});
