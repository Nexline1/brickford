// Brickford — MATH 110 concept layer
//
// Lessons are organised by video. Concepts are organised by idea, which is how
// an engineer actually thinks. Each concept carries:
//   one    — the compressed truth, one sentence (verbal half of dual coding)
//   fig    — an id in DAR.FIG (visual half)
//   prereq — concept ids it stands on, which builds the graph
//   lectures — where it is taught (real lesson keys)
//   miss   — the misconception that actually trips people
//   applies — where it shows up in AI, because abstract maths sticks when it pays
//   probes — retrieval items, same shape as the exam banks
//
// Every numeric probe answer is recomputed by tools/verify-content.js.
window.DAR = window.DAR || {};

DAR.CONCEPTS = (DAR.CONCEPTS || []).concat([
  {
    id: "la-vector", course: "math110", title: "A vector is a displacement",
    one: "A vector is not a point but a movement — how far and which way — so the same arrow anywhere means the same thing.",
    fig: "figVectorAdd", prereq: [], lectures: ["math110.0.0"],
    miss: "Believing a vector must start at the origin. Position is a choice; the displacement is the vector.",
    applies: "Every token, image and user is a vector in a learned space. Cosine similarity is literally the angle between two of them.",
    probes: [
      { q: "$u=(3,-1)$ and $v=(-1,4)$. The second component of $u+v$ is:", num: 3,
        expl: "Add componentwise: $-1 + 4 = 3$." },
      { q: "Two arrows of equal length and direction, drawn at different places, represent:", opts: ["Different vectors", "The same vector", "Vectors that sum to zero", "A basis"], a: 1,
        expl: "A vector is defined by magnitude and direction, not by where it is drawn." },
    ],
  },
  {
    id: "la-span", course: "math110", title: "Span is everywhere you can reach",
    one: "The span of a set of vectors is every point you can get to by scaling them and adding — one vector gives a line, two independent ones give a plane.",
    fig: "figSpan", prereq: ["la-vector"], lectures: ["math110.0.1", "math110.1.5"],
    miss: "Confusing the span with the vectors themselves. The span is the whole infinite set they generate.",
    applies: "A layer can only output what its columns span. That is exactly why a low-rank adapter with rank r can only move the output inside an r-dimensional subspace.",
    probes: [
      { q: "The span of $\\{(1,2),(2,4)\\}$ in $\\mathbb{R}^2$ is:", opts: ["All of $\\mathbb{R}^2$", "A line through the origin", "A single point", "A plane in $\\mathbb{R}^3$"], a: 1,
        expl: "$(2,4)=2(1,2)$ — the second adds no new direction, so the span is one line." },
      { q: "The dimension of $\\mathrm{span}\\{(1,0,0),(0,1,0),(1,1,0)\\}$ is:", num: 2,
        expl: "The third vector is the sum of the first two, so only two directions are independent." },
    ],
  },
  {
    id: "la-independence", course: "math110", title: "Independence means no wasted direction",
    one: "Vectors are dependent when one of them can be built from the others, so it contributes nothing the rest did not already cover.",
    fig: "figIndependence", prereq: ["la-span"], lectures: ["math110.0.1", "math110.1.8"],
    miss: "Assuming independent means perpendicular. Independent only means non-redundant; two vectors 1° apart are still independent.",
    applies: "Collinear features carry no extra information but do inflate your parameter count. The same redundancy is why trained weight matrices are often far closer to low rank than their shape suggests.",
    probes: [
      { q: "Any 4 vectors in $\\mathbb{R}^3$ are:", opts: ["Always independent", "Always dependent", "Dependent only if one is zero", "A basis of $\\mathbb{R}^3$"], a: 1,
        expl: "You cannot have more independent directions than the dimension of the space." },
      { q: "$\\{(1,2),(3,c)\\}$ is dependent when $c$ equals:", num: 6,
        expl: "Dependent means $(3,c)$ is a multiple of $(1,2)$: the multiple is 3, so $c=6$. Equivalently $\\det=c-6=0$." },
    ],
  },
  {
    id: "la-basis", course: "math110", title: "A basis is the ruler you measure with",
    one: "A basis is a minimal set that spans the space, and coordinates are just the recipe for a point in terms of that set — change the basis and the coordinates change while the point does not.",
    fig: "figBasis", prereq: ["la-independence"], lectures: ["math110.0.1", "math110.0.12", "math110.1.8"],
    miss: "Treating coordinates as intrinsic to a point. They belong to the basis, not the point.",
    applies: "Attention heads read and write different subspaces of the same residual stream — each is choosing a basis to measure in. Interpretability work is largely the search for the basis in which features are readable.",
    probes: [
      { q: "In the basis $\\{(1,0),(1,1)\\}$, the point $(2,2)$ has first coordinate:", num: 0,
        expl: "Solve $a(1,0)+b(1,1)=(2,2)$: the second row gives $b=2$, then $a+2=2$ so $a=0$." },
      { q: "A basis of $\\mathbb{R}^4$ must contain exactly how many vectors?", num: 4,
        expl: "A basis of an $n$-dimensional space has exactly $n$ vectors — enough to span, few enough to stay independent." },
    ],
  },
  {
    id: "la-linear-map", course: "math110", title: "A matrix moves space",
    one: "A matrix is an action, not a table: it sends the basis vectors somewhere, its columns record exactly where they land, and every other point follows along.",
    fig: "figGridTransform", prereq: ["la-basis"], lectures: ["math110.0.2", "math110.1.30"],
    miss: "Reading a matrix as a grid of numbers to be manipulated instead of a transformation to be pictured.",
    applies: "Every `nn.Linear`, every attention projection, every embedding lookup is this one idea. If you can see what a matrix does to space, you can see what a layer does to a representation.",
    probes: [
      { q: "The columns of $A$ tell you:", opts: ["The eigenvalues of $A$", "Where the basis vectors land", "The rank of $A$", "Whether $A$ is invertible"], a: 1,
        expl: "$Ae_1$ is the first column — the image of the first basis vector." },
      { q: "For $A=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$, the second component of $A(1,1)^T$ is:", num: 3,
        expl: "$A$ scales the axes independently: $(1,1)\\mapsto(2,3)$." },
    ],
  },
  {
    id: "la-matmul", course: "math110", title: "Multiplication is composition",
    one: "$AB$ means do $B$ first and then $A$, which is why the order matters and why the inner dimensions must agree.",
    fig: "figCompose", prereq: ["la-linear-map"], lectures: ["math110.0.3", "math110.1.2"],
    miss: "Expecting $AB=BA$. Rotating then shearing is not shearing then rotating.",
    applies: "A forward pass is a chain of composed maps. Because composition is matmul, matmul is where essentially all the FLOPs and all the GPU engineering go.",
    probes: [
      { q: "$AB$ applied to a vector means:", opts: ["Apply $A$, then $B$", "Apply $B$, then $A$", "Apply both and add", "Order does not matter"], a: 1,
        expl: "$(AB)x = A(Bx)$ — the right-hand map acts first." },
      { q: "For $A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$, $B=\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$, the $(1,1)$ entry of $AB$ is:", num: 2,
        expl: "Row 1 of $A$ times column 1 of $B$: $1\\cdot1 + 1\\cdot1 = 2$." },
    ],
  },
  {
    lab: "det2", id: "la-determinant", course: "math110", title: "The determinant is a volume factor",
    one: "The determinant says how much a map multiplies area or volume, and its sign says whether space was flipped — zero means space was flattened and information was destroyed.",
    fig: "figDeterminant", prereq: ["la-linear-map"], lectures: ["math110.0.5", "math110.1.17"],
    miss: "Thinking the determinant measures how big a matrix is. It measures how much the map stretches volume.",
    applies: "Normalising flows track the log-determinant of the Jacobian precisely because it is the volume change that keeps a density valid.",
    probes: [
      { q: "$\\det\\begin{pmatrix}3&1\\\\2&4\\end{pmatrix}$ is:", num: 10,
        expl: "$3\\cdot4 - 1\\cdot2 = 10$." },
      { q: "$\\det A = 0$ means the map:", opts: ["Preserves volume", "Flattens space into a lower dimension", "Is a rotation", "Has no eigenvalues"], a: 1,
        expl: "Zero volume factor means the image is degenerate, so $A$ is not invertible." },
    ],
  },
  {
    id: "la-rank-nullity", course: "math110", title: "Rank plus nullity is conserved",
    one: "Every input direction either survives into the column space or is crushed to zero, and the two counts always add to the number of columns.",
    fig: "figRankNullity", prereq: ["la-span", "la-linear-map"], lectures: ["math110.0.6", "math110.1.6", "math110.1.9"],
    miss: "Thinking rank counts rows or columns of the matrix. It counts independent directions in the output.",
    applies: "The r in LoRA is a rank budget: it fixes how many independent directions your update is allowed to move. Every bottleneck layer is a deliberate choice about what to crush.",
    probes: [
      { q: "$A$ is $4\\times7$ with rank 3. Its nullity is:", num: 4,
        expl: "Rank + nullity = number of columns: $3 + n = 7$, so $n = 4$." },
      { q: "The rank of $A$ equals:", opts: ["Its number of rows", "The dimension of its column space", "Its largest entry", "Its determinant"], a: 1,
        expl: "Rank is the number of independent directions in the image — the dimension of the column space." },
    ],
  },
  {
    lab: "eigen", id: "la-eigen", course: "math110", title: "Eigenvectors are the directions that survive",
    one: "An eigenvector is a direction the map only stretches and never turns, and its eigenvalue is the stretch factor.",
    fig: "figEigen", prereq: ["la-linear-map", "la-determinant"], lectures: ["math110.0.13", "math110.1.20", "math110.1.21"],
    miss: "Assuming every matrix has a full set of eigenvectors. A shear has only one direction, and no eigenbasis at all.",
    applies: "Repeated multiplication is governed by the largest eigenvalue — which is exactly why gradients explode or vanish through depth, and why spectral norms get clipped.",
    probes: [
      { q: "The largest eigenvalue of $\\begin{pmatrix}4&1\\\\0&3\\end{pmatrix}$ is:", num: 4,
        expl: "Triangular, so the eigenvalues sit on the diagonal: 4 and 3." },
      { q: "The sum of the eigenvalues of $\\begin{pmatrix}5&2\\\\1&3\\end{pmatrix}$ is:", num: 8,
        expl: "The trace equals the sum of eigenvalues: $5+3=8$." },
      { q: "An eigenvector $v$ of $A$ satisfies:", opts: ["$Av = 0$", "$Av$ is a scalar multiple of $v$", "$Av = v$ always", "$v$ is a column of $A$"], a: 1,
        expl: "$Av=\\lambda v$ — the direction is preserved, only the length changes." },
    ],
  },
  {
    lab: "proj", id: "la-projection", course: "math110", title: "Projection finds the closest point",
    one: "Projecting onto a subspace lands on the nearest point in it, and you know it is nearest because the error comes out perpendicular.",
    fig: "figProjection", prereq: ["la-basis"], lectures: ["math110.1.14", "math110.1.15"],
    miss: "Expecting least squares to solve $Ax=b$ exactly. It solves the closest thing available when no solution exists.",
    applies: "Every regression is this projection. Attention's output is a weighted combination of value vectors — a point inside the span of what it attended to.",
    probes: [
      { q: "Least squares solves which system?", opts: ["$A\\hat x = b$", "$A^TA\\hat x = A^Tb$", "$AA^T\\hat x = b$", "$\\hat x = A^{-1}b$"], a: 1,
        expl: "The normal equations: project $b$ onto the column space so the residual is orthogonal to it." },
      { q: "The projection of $b=(3,4)$ onto $\\mathrm{span}\\{(1,0)\\}$ has second component:", num: 0,
        expl: "Projecting onto the $x$-axis keeps the first component and zeroes the rest: $(3,0)$." },
    ],
  },
  {
    id: "la-spectral", course: "math110", title: "Symmetric matrices stretch perpendicular axes",
    one: "A real symmetric matrix has real eigenvalues and perpendicular eigenvectors, so it acts by stretching space along a set of right-angled axes.",
    fig: "figSpectral", prereq: ["la-eigen"], lectures: ["math110.1.25", "math110.1.27"],
    miss: "Assuming any matrix has orthogonal eigenvectors. That guarantee is what symmetry buys you.",
    applies: "Covariance matrices and Hessians are symmetric, so curvature always decomposes into perpendicular directions with real magnitudes. That is the ground under PCA and under every second-order optimiser.",
    probes: [
      { q: "A real symmetric matrix always has:", opts: ["Positive eigenvalues", "Real eigenvalues and orthogonal eigenvectors", "Determinant 1", "Complex eigenvalues in pairs"], a: 1,
        expl: "The spectral theorem: $A = Q\\Lambda Q^T$ with $Q$ orthogonal and $\\Lambda$ real." },
      { q: "A symmetric $A$ has eigenvalues 2 and 5. The largest value of $x^TAx$ over unit vectors $x$ is:", num: 5,
        expl: "The quadratic form is maximised along the top eigenvector, giving the largest eigenvalue." },
    ],
  },
  {
    id: "la-svd", course: "math110", title: "Every matrix is rotate, stretch, rotate",
    one: "The SVD factors any matrix at all into a rotation, a stretch along perpendicular axes, and another rotation — so every linear map has the same underlying shape.",
    fig: "figSVD", prereq: ["la-spectral", "la-projection"], lectures: ["math110.1.29", "math110.1.31"],
    miss: "Treating singular values as eigenvalues. Singular values exist for every matrix, including non-square ones; eigenvalues do not.",
    applies: "PCA, low-rank compression and LoRA all pick the top singular directions. The ratio of largest to smallest is the condition number — the number that predicts whether your training goes numerically unstable.",
    probes: [
      { q: "In $A = U\\Sigma V^T$, the columns of $V$ are eigenvectors of:", opts: ["$A$", "$A^TA$", "$AA^T$", "$A^{-1}$"], a: 1,
        expl: "$A^TA = V\\Sigma^2V^T$, so $V$ diagonalises $A^TA$; $U$ does the same for $AA^T$." },
      { q: "$A$ is $5\\times3$ with rank 2. Its number of nonzero singular values is:", num: 2,
        expl: "The count of nonzero singular values is the rank." },
    ],
  },
]);
