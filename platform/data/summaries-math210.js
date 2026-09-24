// Brickford — lecture summaries, MATH 210 (Mathematics for Machine Learning)
//
// Three sources. Unit I is MIT 18.S096, Matrix Calculus for Machine Learning and
// Beyond, with Alan Edelman and Steven G. Johnson (IAP 2023): derivatives as linear
// operators, taken holistically on vectors and matrices rather than index by index.
// Unit II is Stanford CS231n's optimization and training lectures plus three
// readings. Unit III is David MacKay's Cambridge course on information theory,
// inference and learning.
//
// Same contract as the other summary files: written FROM the lecture, following
// the lecturer's own argument in his own order, keeping his examples. One stated
// exception: the three Unit II readings (Distill's "Why momentum really works",
// Ruder's overview of gradient descent, Boyd & Vandenberghe ch. 2–3) could not be
// fetched from this environment — the network policy blocks those sites — so they
// are written from the standard content of those texts, and say so.
//
// tools/verify-content.js enforces the shape and RECOMPUTES every numeric answer.
// For this subject that means: a closed-form derivative is checked by central
// finite differences at a concrete point (the method lecture 0.5 teaches); an
// optimizer's rate by iterating it; an entropy, capacity or code length by
// enumeration or by maximising over the input distribution; a posterior by exact
// enumeration or quadrature. Never Monte Carlo.
//
// No concepts and no figures: DAR.CONCEPTS and DAR.FIG are still linear algebra
// from MATH 110, so `concepts: []` is the correct value here.
//
// beats[]  — the argument as it develops.
// worked   — the practical pattern, because theory alone does not transfer.
// watch    — the trap, stated as the error rather than as a warning.
// checks[] — active review; recognising a summary is not remembering it.
window.DAR = window.DAR || {};

DAR.SUMMARIES = Object.assign(DAR.SUMMARIES || {}, {

  "math210.0.0": {
    takeaway: "Calculus should run scalar → vector → matrix, and a derivative is best seen as a LINEARIZATION: $df = f'(x)\\,dx$, with $f'(x)$ a linear operator acting on the small change. For matrices this is not a trivial generalisation — $d(X^{2}) = X\\,dX + dX\\,X$, not $2X\\,dX$.",
    beats: [
      { t: "Why a course on matrix calculus", d: "18.01 is scalars, 18.02 is vectors, and the sequence stops — yet machine learning, statistics and engineering optimisation all need gradients of functions of matrices. Topology-optimised aircraft wings put a whole physics simulation inside an optimisation loop." },
      { t: "Automatic differentiation", d: "It is neither symbolic differentiation (Mathematica) nor numerical finite differences — something else, closer to compiler technology. Using it well means knowing what is under the hood: forward versus reverse mode, vector–Jacobian products, and when it fails." },
      { t: "Derivative as linearization", d: "Near a point, pretend the function is linear: $\\delta y \\approx f'(x)\\,\\delta x$. Written $df = f'(x)\\,dx$ with $dx$ kept on the RIGHT — because soon $dx$ will be a vector or a matrix, and you cannot divide by a vector." },
      { t: "A number check", d: "$x^{2}$ at 3: nudging $x$ by $\\delta x$ changes $x^{2}$ by $6\\,\\delta x$ plus higher order. Think of $dx$ as 0.0001 on a computer — small enough, in context." },
      { t: "The table of cases", d: "Scalar or vector or matrix in, scalar or vector or matrix out. Vector in, scalar out (a loss function) gives a gradient with the SAME shape as the input — for $x^{T}x$, $\\nabla f = 2x$ while $f'(x) = 2x^{T}$, a row vector, so that $df = 2x^{T}dx$ is a scalar. Vector to vector gives an $m \\times n$ Jacobian; higher cases need more than 2-D arrays." },
      { t: "The matrix square", d: "$d(X^{2}) = X\\,dX + dX\\,X$: matrices do not commute, so neither order is preferred and both appear. Checked in Julia on a 3×3 matrix with a tiny random $dX$: $(X + dX)^{2} - X^{2}$ matches $X\\,dX + dX\\,X$, and $2X\\,dX$ does not." },
      { t: "The product rule survives", d: "$d(AB) = dA\\,B + A\\,dB$ for any compatible products — keep $A$ on the left and $B$ on the right. For $x^{T}x$: $dx^{T}x + x^{T}dx = 2x^{T}dx$, allowed only because a dot product is a scalar and $u^{T}v = v^{T}u$." },
      { t: "Jacobian and Hessian", d: "A function $\\mathbb R^{n} \\to \\mathbb R^{m}$ has an $m \\times n$ Jacobian — a first derivative. A scalar function of a vector, like $x^{T}Ax$, has a Hessian matrix — a second derivative, better thought of as a quadratic form." },
    ],
    worked: "To find a derivative holistically: perturb the input by $dx$, expand, keep only the terms linear in $dx$, and read off the linear operator. Then check it numerically: $f(x + dx) - f(x)$ against $f'(x)\\,dx$ for a small random $dx$.",
    watch: "Writing $d(X^{2}) = 2X\\,dX$ by analogy with scalars. It is only right when $dX$ commutes with $X$; in general both orders, $X\\,dX + dX\\,X$, are needed.",
    concepts: [],
    checks: [
      { q: "$f(x) = x^{T}x$ at $x = (3, 4)$, nudged by $dx = (0.001, 0.002)$. The linearized change $2x^{T}dx$, to three decimal places, is:", num: 0.022,
        expl: "$2(3 \\times 0.001 + 4 \\times 0.002) = 0.022$. The true change is 25.022005 − 25; the difference is second order." },
      { q: "For a square matrix $X$, the differential of $X^{2}$ is:", opts: ["$2X\\,dX$", "$X\\,dX + dX\\,X$", "$2\\,dX\\,X$", "$dX^{2}$"], a: 1,
        expl: "The product rule with order kept: $d(XX) = dX\\,X + X\\,dX$. It reduces to $2X\\,dX$ only when $X$ and $dX$ commute." },
      { q: "A loss function takes a vector of $n$ parameters to one number. Its gradient is:", opts: ["a scalar", "a vector the same shape as the input", "an $n \\times n$ matrix", "a row vector with $m$ entries"], a: 1,
        expl: "The gradient of a scalar function always has the input's shape; the derivative $f' = (\\nabla f)^{T}$ is the row vector that acts on $dx$." },
    ],
  },

  "math210.0.1": {
    takeaway: "Johnson's precise version: the derivative is the linear operator $f'(x)$ with $f(x + \\delta x) - f(x) = f'(x)\\,\\delta x + o(\\delta x)$. Linear operators live on any vector space, so this definition works for vectors, matrices and even functions — and for a scalar of a vector it DEFINES the gradient, $df = \\nabla f \\cdot dx$.",
    beats: [
      { t: "Slope is linearization", d: "$f(x + \\delta x) = f(x) + f'(x)\\,\\delta x + o(\\delta x)$, where little-o means anything that vanishes faster than $\\delta x$. This is not a Taylor series — a function need not have one — it is the definition of a derivative." },
      { t: "Differentials", d: "Switching $\\delta$ to $d$ just means: drop the higher-order terms. $df = f(x + dx) - f(x) = f'(x)\\,dx$. The derivative is $f'$; the differential is $df$. They are different objects." },
      { t: "Linear operators", d: "On a vector space (anything you can add and scale), $L$ is linear if $L(v_1 + v_2) = Lv_1 + Lv_2$ and $L(\\alpha v) = \\alpha Lv$. Multiplying by a scalar or a matrix is linear; so are differentiation and integration of functions, and even $f(x) \\mapsto f(x^{2})$." },
      { t: "Affine is not linear", d: "$v \\mapsto 2v + 1$ has a straight-line graph but fails the test: $3v \\mapsto 6v + 1$, not $6v + 3$. Such maps are called affine." },
      { t: "Scalar function of a vector", d: "$df = f'(x)\\,dx$ must turn a vector into a scalar, and the only linear way to do that is a dot product with some vector. That vector is the gradient: $df = \\nabla f \\cdot dx$, so $f' = (\\nabla f)^{T}$." },
      { t: "The gradient of $x^{T}Ax$", d: "With $A$ constant and not assumed symmetric: expand $(x + dx)^{T}A(x + dx)$, drop $dx^{T}A\\,dx$, and transpose the scalar $dx^{T}Ax$ into $x^{T}A^{T}dx$. So $df = x^{T}(A + A^{T})\\,dx$ and $\\nabla f = (A + A^{T})x$." },
      { t: "Vector to vector", d: "If $f: \\mathbb R^{n} \\to \\mathbb R^{m}$, then $f'(x)$ is a linear map from $n$ components to $m$ — expressible as an $m \\times n$ matrix, the Jacobian. You do not have to write the matrix down." },
    ],
    worked: "For a scalar function of a vector: compute $df$, rearrange it into (something)$^{T}dx$ — transposing scalar terms freely — and that something is the gradient.",
    watch: "Calling a function 'linear' because its graph is a line. $2v + 1$ is affine: it fails $L(\\alpha v) = \\alpha L(v)$, and derivatives are linear operators in the strict sense.",
    concepts: [],
    checks: [
      { q: "$f(x) = x^{T}Ax$ with $A = \\begin{pmatrix}1 & 2\\\\ 0 & 3\\end{pmatrix}$. The second component of $\\nabla f$ at $x = (1, 1)$ is:", num: 8,
        expl: "$\\nabla f = (A + A^{T})x = \\begin{pmatrix}2 & 2\\\\ 2 & 6\\end{pmatrix}\\begin{pmatrix}1\\\\1\\end{pmatrix} = (4, 8)$." },
      { q: "Which map is linear in the sense of linear algebra?", opts: ["$v \\mapsto 2v + 1$", "$f(x) \\mapsto f(x^{2})$ on functions", "$v \\mapsto v^{2}$", "$v \\mapsto |v|$"], a: 1,
        expl: "Substituting $x^{2}$ into a function respects sums and scalar multiples of the FUNCTION. The others fail additivity or scaling." },
      { q: "For a scalar function of a vector, $f'(x)$ is best described as:", opts: ["a column vector, the gradient", "a row vector, the transpose of the gradient", "a scalar", "the Hessian"], a: 1,
        expl: "$f'(x)$ acts on $dx$ to give a scalar $df$, so it is a row vector: $f' = (\\nabla f)^{T}$." },
    ],
  },

  "math210.0.2": {
    takeaway: "A nonlinear map is locally linear, and its Jacobian is that local linear map. The sum, product and chain rules all carry over — keeping order. And the order you multiply the chain rule's Jacobians is not a detail: right-to-left is forward mode, left-to-right is reverse mode, and for one output and many inputs reverse mode wins by a factor of $n$.",
    beats: [
      { t: "Corgis", d: "Rotating a picture of Philip the corgi is a linear map of $\\mathbb R^{2}$ — his ears move on a circle. A hyperbolic rotation is also linear — his eyes move on a hyperbola. A nonlinear shear or warp bends squares into curves; its 2×2 Jacobian changes from point to point, but in a tiny patch squares still become parallelograms." },
      { t: "The Jacobian's layout", d: "$df = J\\,dx$ with $J_{ij} = \\partial f_i/\\partial x_j$: rows are outputs, columns are inputs. For the determinant used in change of variables the transpose does not matter; as a linear operator it matters a lot." },
      { t: "Linear maps", d: "$f(x) = Ax$: $d(Ax) = A\\,dx$, so $f' = A$ everywhere — constant, as the slope of $3x$ is constant. Note that $dA$ there is the $m \\times n$ ZERO matrix." },
      { t: "Sum and product rules", d: "$d(g + h) = dg + dh$. $d(gh) = dg\\,h + g\\,dh$ for any product obeying the distributive law, with $dg\\,dh$ dropped as second order — and you may not write $f' = g'h + gh'$, since $dx$ cannot always be moved past $h$. Re-derived: $\\nabla(x^{T}Ax) = (A + A^{T})x$." },
      { t: "The chain rule", d: "$f(x) = g(h(x))$: $f'(x) = g'(h(x))\\,h'(x)$, a composition of linear operators — $h'$ first. For $\\mathbb R^{n} \\to \\mathbb R^{p} \\to \\mathbb R^{m}$ it is an $m \\times p$ times a $p \\times n$ matrix; the other order does not even conform." },
      { t: "Where the parentheses go", d: "$f = a(b(c(x)))$: $f' = a'b'c'$. Multiplying an $m \\times q$ by a $q \\times p$ matrix costs about $mpq$ operations. Right-to-left, $a'(b'c')$, is forward mode; left-to-right, $(a'b')c'$, is reverse mode." },
      { t: "One output, many inputs", d: "Optimisation and machine learning: $m = 1$ (a loss), $n$ huge. Reverse mode is a row vector times matrices, $n^{2}$ each; forward mode multiplies matrices first, $n^{3}$. Reverse mode — also called backpropagation or adjoint differentiation — costs about as much as evaluating $f$ once." },
      { t: "You already do this", d: "Asked for $\\frac{d}{dx}\\sin(x^{2})$, nearly everyone writes the cosine first, working from the output inward — reverse mode, done by instinct." },
    ],
    worked: "Before multiplying a chain of Jacobians, write each one's shape. With a scalar output, start from the left (a row vector) and keep every intermediate product a row vector: that is backpropagation.",
    watch: "Multiplying the chain rule's Jacobians right to left when the output is a single number. The answer is identical, but the cost is $n^{3}$ instead of $n^{2}$ — a factor of $n$, a billion for a large network.",
    concepts: [],
    checks: [
      { q: "$f(x_1, x_2) = (x_1^{2}x_2,\\ x_1 + x_2^{3})$. The determinant of its Jacobian at $(1, 2)$ is:", num: 47,
        expl: "$J = \\begin{pmatrix}2x_1x_2 & x_1^{2}\\\\ 1 & 3x_2^{2}\\end{pmatrix} = \\begin{pmatrix}4 & 1\\\\ 1 & 12\\end{pmatrix}$, determinant $48 - 1 = 47$." },
      { q: "A scalar loss depends on $n$ parameters through two $n \\times n$ Jacobian stages. Evaluating $a'b'c'$ left to right (reverse mode) costs about:", opts: ["$n$", "$n^{2}$", "$n^{3}$", "$n^{4}$"], a: 1,
        expl: "Row vector times matrix is $n^{2}$, and every intermediate stays a row vector. Right to left forms a matrix–matrix product, $n^{3}$." },
      { q: "In the Jacobian $J_{ij} = \\partial f_i/\\partial x_j$, the columns correspond to:", opts: ["the outputs", "the inputs", "the second derivatives", "the eigenvalues"], a: 1,
        expl: "$df = J\\,dx$: each column multiplies one component of $dx$, one input." },
    ],
  },

  "math210.0.3": {
    takeaway: "Inputs and outputs can themselves be matrices. The product rule gives $d(A^{3}) = dA\\,A^{2} + A\\,dA\\,A + A^{2}dA$ — which cannot be simplified — and differentiating $A^{-1}A = I$ gives $d(A^{-1}) = -A^{-1}\\,dA\\,A^{-1}$, the matrix version of $-dA/A^{2}$.",
    beats: [
      { t: "Beyond 18.02", d: "A vector space is anything you can add and scale, so matrices qualify. Matrix to matrix: $A^{-1}$, $A^{3}$, the $U$ of Gaussian elimination. Matrix to scalar: the determinant, the trace, the largest singular value." },
      { t: "The matrix cube", d: "$A^{3} = AAA$, so $d(A^{3}) = dA\\,A^{2} + A\\,dA\\,A + A^{2}dA$ — three terms, one for each factor perturbed. It equals $3A^{2}dA$ only if $dA$ commutes with $A$. This linear operator is not 'some matrix times $dA$'." },
      { t: "Why not flatten?", d: "You can stack the $n^{2}$ entries of $dA$ into a column and write an $n^{2} \\times n^{2}$ Jacobian. Edelman dislikes it as much as indices — it hides the structure." },
      { t: "The inverse, by a trick", d: "$A^{-1}A = I$ for every $A$, so its differential is zero. Product rule: $d(A^{-1})\\,A + A^{-1}dA = 0$. Multiply by $A^{-1}$ on the right: $d(A^{-1}) = -A^{-1}\\,dA\\,A^{-1}$." },
      { t: "Why it matters", d: "Engineering problems solve linear systems; optimising their results means differentiating through a matrix inverse. Doing it entry by entry with Cramer's rule would be madness even at 2×2." },
      { t: "Seeing it in Julia", d: "For the symbolic 2×2 matrix $\\begin{pmatrix}p & r\\\\ q & s\\end{pmatrix}$, vec of $X^{2}$ is four functions of four variables and its 4×4 Jacobian can be printed. Numerically, $(M + E)^{2} - M^{2}$ matches $ME + EM$ to first order." },
      { t: "Kronecker preview", d: "The Kronecker product $A \\otimes B$ — every entry of $A$ times the whole of $B$ — is the notation that turns operators like $dA \\mapsto M\\,dA + dA\\,M$ back into explicit Jacobian matrices when needed." },
    ],
    worked: "To differentiate a matrix function you cannot expand directly, differentiate an IDENTITY it satisfies ($A^{-1}A = I$, $Q^{T}Q = I$, $L U = A$) and solve for the unknown differential.",
    watch: "Writing $d(A^{-1}) = -A^{-2}dA$. The two inverses must sit on either side of $dA$: $-A^{-1}\\,dA\\,A^{-1}$.",
    concepts: [],
    checks: [
      { q: "$A = \\begin{pmatrix}2 & 1\\\\ 0 & 1\\end{pmatrix}$ is perturbed in the direction $dA = \\begin{pmatrix}0 & 0\\\\ 1 & 0\\end{pmatrix}$. The (1,1) entry of $d(A^{-1}) = -A^{-1}dA\\,A^{-1}$ is:", num: 0.25,
        expl: "$A^{-1} = \\begin{pmatrix}0.5 & -0.5\\\\ 0 & 1\\end{pmatrix}$; $dA\\,A^{-1} = \\begin{pmatrix}0 & 0\\\\ 0.5 & -0.5\\end{pmatrix}$; $-A^{-1}$ times that has (1,1) entry $-(0.5 \\times 0 + (-0.5)(0.5)) = 0.25$." },
      { q: "The differential of $A^{3}$ is:", opts: ["$3A^{2}\\,dA$", "$dA\\,A^{2} + A\\,dA\\,A + A^{2}dA$", "$3\\,dA\\,A^{2}$", "$A^{2}\\,dA + dA\\,A^{2}$"], a: 1,
        expl: "One term for each factor of $AAA$ perturbed, order preserved." },
      { q: "How is $d(A^{-1})$ derived most easily?", opts: ["from Cramer's rule entry by entry", "by differentiating $A^{-1}A = I$ with the product rule", "by a Taylor series of $1/A$", "it cannot be done in closed form"], a: 1,
        expl: "$d(A^{-1})A + A^{-1}dA = 0$, then multiply by $A^{-1}$ on the right." },
    ],
  },

  "math210.0.4": {
    takeaway: "The Kronecker product lets you write a matrix-to-matrix derivative as an explicit Jacobian without ever forming it: $(A \\otimes B)\\,\\mathrm{vec}(C) = \\mathrm{vec}(BCA^{T})$. With it, $d(X^{2}) = (I \\otimes X + X^{T} \\otimes I)\\,\\mathrm{vec}(dX)$ — and matrix factorizations such as LU and eigendecompositions become functions with Jacobians too.",
    beats: [
      { t: "Warm-up without indices", d: "Gradient of $\\|x\\|$: with $r = \\|x\\|$, $r^{2} = x^{T}x$, so $2r\\,dr = 2x^{T}dx$ and $\\nabla r = x/r$. The index-by-index way works too; this is the 'grown-up' way." },
      { t: "Jacobians without forming them", d: "The 4×4 Jacobian of the matrix square at $M$ carries the same information as the operator $E \\mapsto ME + EM$. That operator is linear in $E$ — even though $M^{2}$ is not linear in $M$ — and nobody needs to build the matrix." },
      { t: "Kronecker products", d: "$A \\otimes B$ places $a_{ij}B$ in block $(i, j)$ — every product of an entry of $A$ with an entry of $B$, in a fixed order. Julia happily does it with symbols, or pizza and pandas." },
      { t: "The identity to memorise", d: "$(A \\otimes B)\\,\\mathrm{vec}(C) = \\mathrm{vec}(BCA^{T})$. Mnemonic: $B$ sits next to $C$ on the left; $A$ goes around to the right and gets transposed for it." },
      { t: "Kronecker algebra", d: "$(A \\otimes B)^{T} = A^{T} \\otimes B^{T}$ and $(A \\otimes B)^{-1} = A^{-1} \\otimes B^{-1}$ — same order, unlike ordinary products. For $n \\times n$ $A$ and $m \\times m$ $B$: $\\det(A \\otimes B) = (\\det A)^{m}(\\det B)^{n}$; trace is the product of traces; eigenvalues are the products of eigenvalues." },
      { t: "Squares and cubes", d: "$d(X^{2}) = X\\,dX\\,I + I\\,dX\\,X$, so the Jacobian is $I \\otimes X + X^{T} \\otimes I$. $d(X^{3})$ gives $I \\otimes X^{2} + X^{T} \\otimes X + (X^{T})^{2} \\otimes I$. A student caught a live bug here: the test $E$ happened to commute with $M$ — choose random perturbations." },
      { t: "LU is a function", d: "$A = LU$ with $L$ unit lower triangular: $n(n - 1)/2$ numbers in $L$ and $n(n + 1)/2$ in $U$, $n^{2}$ in all. So LU maps $n^{2}$ numbers to $n^{2}$ numbers and has a Jacobian. $dA = dL\\,U + L\\,dU$, with the perturbations restricted to triangular shapes." },
      { t: "Eigendecompositions", d: "A traceless symmetric 2×2 matrix written through its eigenvectors (angle $\\theta/2$) and eigenvalues $\\pm r$ is exactly Cartesian-to-polar coordinates, with Jacobian determinant $r$. The full 2×2 symmetric problem is $\\mathbb R^{3} \\to \\mathbb R^{3}$ with Jacobian determinant $\\lambda_1 - \\lambda_2$ — eigenvalue repulsion." },
    ],
    worked: "To turn $dY = \\sum_k A_k\\,dX\\,B_k$ into an explicit Jacobian, replace each term by $B_k^{T} \\otimes A_k$ and add them. Test the result against a finite difference with a RANDOM perturbation.",
    watch: "Checking a matrix derivative with a perturbation that commutes with $X$ — a multiple of $X$ or of $I$. Wrong formulas pass that test; only a generic random perturbation catches them.",
    concepts: [],
    checks: [
      { q: "$A$ is 2×2 with $\\det A = 3$, $B$ is 3×3 with $\\det B = 3$. Then $\\det(A \\otimes B)$ is:", num: 243,
        expl: "$(\\det A)^{3}(\\det B)^{2} = 27 \\times 9 = 243$ — each determinant raised to the OTHER matrix's size." },
      { q: "The gradient of $\\|x\\|$ at $x = (3, 4)$ has first component:", num: 0.6,
        expl: "$\\nabla\\|x\\| = x/\\|x\\| = (3, 4)/5$, first component 0.6." },
      { q: "$(A \\otimes B)\\,\\mathrm{vec}(C)$ equals:", opts: ["$\\mathrm{vec}(ACB)$", "$\\mathrm{vec}(BCA^{T})$", "$\\mathrm{vec}(A^{T}CB)$", "$\\mathrm{vec}(CAB)$"], a: 1,
        expl: "$B$ stays beside $C$ on the left; $A$ comes around to the right, transposed." },
    ],
  },

  "math210.0.5": {
    takeaway: "Finite differences are a poor way to compute derivatives but the best way to CHECK them. The error of $f(x + \\delta x) - f(x)$ against $f'(x)\\,\\delta x$ falls linearly with $\\delta x$ (truncation) until floating-point roundoff takes over; a step near $\\sqrt{\\varepsilon} \\approx 10^{-8}$ times $x$ balances the two.",
    beats: [
      { t: "Why check at all", d: "Automatic differentiation is reliable, but it fails on external libraries, on parts of a language, and wastes effort differentiating the ERROR of iterative solvers. So you often hand-derive one piece — a custom chain rule — and hand derivations are error-prone." },
      { t: "The finite-difference check", d: "$f(x + \\delta x) - f(x) \\approx f'(x)\\,\\delta x$ — written without dividing, so $\\delta x$ can be a matrix. Forward difference; the backward one uses $x - \\delta x$ (unrelated to backward-mode AD)." },
      { t: "An example", d: "$f(A) = A^{2}$ with random 4×4 $A$ and $dA$ of size $10^{-8}$: the difference matches $A\\,dA + dA\\,A$ to about eight digits, while $2A\\,dA$ is off by about 60%." },
      { t: "Relative error and norms", d: "'Small' always means small COMPARED TO something: use $\\|\\text{approx} - \\text{exact}\\|/\\|\\text{exact}\\|$. For matrices the Frobenius norm $\\|A\\|_F = \\sqrt{\\sum a_{ij}^{2}} = \\sqrt{\\mathrm{tr}(A^{T}A)}$ does the job." },
      { t: "Truncation error", d: "$f(x + \\delta x) = f(x) + f'(x)\\,\\delta x + O(\\delta x^{2})$, so the relative error is $O(\\|\\delta x\\|)$: first-order accuracy, a straight line of slope 1 on a log–log plot." },
      { t: "Roundoff error", d: "Double precision keeps about 15–16 digits. Make $\\delta x$ tiny and $f(x + \\delta x)$ and $f(x)$ agree in most digits, so subtracting them cancels them — catastrophic cancellation. $1 + 10^{-100}$ is exactly 1 on a computer; $\\sin(1 + 10^{-13}) - \\sin 1$ keeps only about four digits." },
      { t: "The sweet spot", d: "Machine epsilon $\\varepsilon = 2^{-52} \\approx 2.2 \\times 10^{-16}$. Rule of thumb: $|\\delta x| \\approx \\sqrt{\\varepsilon}\\,|x| \\approx 10^{-8}|x|$ — about half the digits — where truncation and roundoff errors balance. Both the matrix and the $\\sin$ plots turn up there." },
    ],
    worked: "To test a hand-derived derivative: random input, random direction, $\\delta x$ about $10^{-8}$ of the input's size; compare $f(x + \\delta x) - f(x)$ with $f'(x)[\\delta x]$ by relative error. Around $10^{-8}$ is a pass; order 1 means a bug.",
    watch: "Making $\\delta x$ as small as possible to get a better check. Below about $10^{-8}$ relative, roundoff dominates and the error grows again; at $10^{-100}$ the difference is exactly zero.",
    concepts: [],
    checks: [
      { q: "Double-precision machine epsilon is $2^{-52}$. Its square root, the rule-of-thumb relative step, in units of $10^{-8}$ to two decimal places, is:", num: 1.49,
        expl: "$\\sqrt{2.22 \\times 10^{-16}} = 1.49 \\times 10^{-8}$." },
      { q: "Forward differences for $\\sin$ at $x = 1$: in the truncation regime, the relative error divided by $h$ tends to $\\tfrac12\\tan 1$. To two decimal places that is:", num: 0.78,
        expl: "Error $\\approx \\tfrac12|f''|h = \\tfrac12\\sin(1)h$; relative to $\\cos 1$ that is $\\tfrac12\\tan(1)\\,h = 0.78h$." },
      { q: "Shrinking $\\delta x$ from $10^{-8}$ to $10^{-13}$ makes a forward-difference check:", opts: ["more accurate, as the math predicts", "less accurate, because of catastrophic cancellation", "exactly correct", "unchanged"], a: 1,
        expl: "Past the sweet spot, the subtraction of two nearly equal floating-point numbers loses most of the significant digits." },
    ],
  },

  "math210.0.6": {
    takeaway: "A gradient needs an inner product. Pick one on your vector space — for matrices, the Frobenius product $A \\cdot B = \\mathrm{tr}(A^{T}B)$ — and the gradient of any scalar function is whatever you dot with $dA$ to get $df$. So $\\nabla\\|A\\|_F = A/\\|A\\|_F$ and $\\nabla_A(x^{T}Ay) = xy^{T}$.",
    beats: [
      { t: "Better finite differences", d: "Centered differences, $[f(x + \\delta x) - f(x - \\delta x)]/2$, cancel the even Taylor terms: error $O(\\delta x^{2})$, second-order accurate, with the sweet spot near $10^{-5}$. Higher orders and Richardson extrapolation go further." },
      { t: "Why not in high dimensions", d: "Each finite difference gives the derivative in ONE direction. A gradient with a million components needs a million evaluations of $f$ — hopeless for training a network, fine as a spot check in a few random directions." },
      { t: "Inner products", d: "Any rule $x \\cdot y$ that is symmetric, linear, and positive ($x \\cdot x > 0$ unless $x = 0$). A vector space with one is a Hilbert space. Its norm is $\\|x\\| = \\sqrt{x \\cdot x}$." },
      { t: "The gradient in general", d: "For a scalar $f$ on a Hilbert space, $f'(x)$ is a linear form, and every linear form is a dot product with some vector (the Riesz representation theorem). That vector is $\\nabla f$: $df = \\nabla f \\cdot dx$, always shaped like $x$." },
      { t: "Other inner products", d: "Weighted: $x^{T}Wy$ with $W$ symmetric positive definite — useful when components have different uncertainties or different units (metres, seconds, kilograms). A different inner product gives a different gradient." },
      { t: "Matrices", d: "The obvious product multiplies entries and adds: $A \\cdot B = \\sum a_{ij}b_{ij} = \\mathrm{vec}(A)^{T}\\mathrm{vec}(B) = \\mathrm{tr}(A^{T}B)$ — each diagonal entry of $A^{T}B$ is a column of $A$ dotted with a column of $B$. Its norm is the Frobenius norm." },
      { t: "Gradient of the Frobenius norm", d: "$d\\sqrt{\\mathrm{tr}(A^{T}A)} = \\dfrac{\\mathrm{tr}(dA^{T}A + A^{T}dA)}{2\\|A\\|}$, and $\\mathrm{tr}(B) = \\mathrm{tr}(B^{T})$ merges the terms: $df = \\dfrac{A}{\\|A\\|} \\cdot dA$. The same answer as $\\nabla\\|x\\| = x/\\|x\\|$ — it is the same norm." },
      { t: "Gradient of $x^{T}Ay$", d: "$df = x^{T}dA\\,y$, a scalar, so equal to its trace; the cyclic property $\\mathrm{tr}(AB) = \\mathrm{tr}(BA)$ moves $y$ round: $\\mathrm{tr}(yx^{T}dA) = (xy^{T}) \\cdot dA$. So $\\nabla_A = xy^{T}$ — the matrix of partials $\\partial f/\\partial a_{ij}$, without computing any. Coming soon: $\\nabla\\det A = \\det(A)\\,A^{-T}$." },
    ],
    worked: "For a scalar function of a matrix: compute $df$, wrap it in a trace (it is a scalar), then use $\\mathrm{tr}(B) = \\mathrm{tr}(B^{T})$ and cyclic swaps until it reads $\\mathrm{tr}(G^{T}dA)$. Then $\\nabla f = G$.",
    watch: "Rearranging a trace freely. Only CYCLIC moves are allowed, $\\mathrm{tr}(ABC) = \\mathrm{tr}(CAB)$; swapping two factors in a longer product is not.",
    concepts: [],
    checks: [
      { q: "$f(A) = x^{T}Ay$ with $x = (1, 2)$ and $y = (3, 1, 2)$. The entry $\\partial f/\\partial a_{21}$ of the gradient is:", num: 6,
        expl: "$\\nabla_A f = xy^{T}$, whose (2,1) entry is $x_2y_1 = 2 \\times 3 = 6$." },
      { q: "The Frobenius inner product of $A = \\begin{pmatrix}1 & 2\\\\ 3 & 4\\end{pmatrix}$ and $B = \\begin{pmatrix}0 & 1\\\\ 1 & 0\\end{pmatrix}$, $\\mathrm{tr}(A^{T}B)$, is:", num: 5,
        expl: "It is the sum of entrywise products: $0 + 2 + 3 + 0 = 5$." },
      { q: "Centered differences are more accurate than forward differences for the same step because:", opts: ["they use a smaller step", "the even-order Taylor terms cancel, leaving $O(\\delta x^{2})$ error", "they avoid roundoff completely", "they evaluate $f$ only once"], a: 1,
        expl: "The symmetric difference cancels the $\\delta x^{2}$ term of the expansion, so the error starts at the next order." },
    ],
  },

  "math210.0.7": {
    takeaway: "Derivatives drive Newton's method (linearize, solve, repeat) and optimisation (go downhill along $-\\nabla f$). When $f$ depends on parameters through the solution of $Ax = b$ or $g(x, p) = 0$, the adjoint method gets the whole gradient for ONE extra solve with the transposed system — reverse mode, backpropagation, by another name.",
    beats: [
      { t: "Newton's method", d: "Linearize $f(x + \\delta x) \\approx f(x) + f'(x)\\,\\delta x$, set it to zero, step: $x \\leftarrow x - f(x)/f'(x)$. Near a root the number of correct digits doubles each step." },
      { t: "In many dimensions", d: "The same with the Jacobian: solve $f'(x)\\,\\delta x = -f(x)$, a linear system each step. $n$ equations in $n$ unknowns; start close, or it can wander — the Newton fractals." },
      { t: "Optimisation", d: "For a scalar loss, $-\\nabla f$ is the steepest-descent direction. Then the hard parts: how far to step (line search, backtracking, trust regions), constraints, zig-zagging in long valleys (momentum, conjugate gradients, BFGS, Adam). Most practitioners take an algorithm off the shelf and spend their effort on the formulation." },
      { t: "Engineering design", d: "Parameters $p$ (shape, materials) feed a physical model, $A(p)\\,x = b$; its solution $x$ feeds an objective $f(x)$. A topology-optimised chair came out of letting every voxel be metal or air." },
      { t: "The adjoint trick", d: "$df = f'(x)\\,dx = -f'(x)\\,A^{-1}\\,dA\\,x$. Multiply LEFT to right: $v^{T} = f'(x)A^{-1}$ means solving $A^{T}v = \\nabla f$ — one adjoint solve. Then $\\partial f/\\partial p_k = -v^{T}\\,(\\partial A/\\partial p_k)\\,x$: just a dot product per parameter." },
      { t: "Why not right to left", d: "Right to left needs $A^{-1}(\\partial A/\\partial p_k)x$ for every $k$ — one big solve per parameter. So do finite differences. Forward mode suits few inputs and many outputs; reverse mode suits many inputs and one output." },
      { t: "Nonlinear constraints", d: "If $x$ solves $g(p, x) = 0$: $g_p\\,dp + g_x\\,dx = 0$ gives $dx = -g_x^{-1}g_p\\,dp$ (the implicit function theorem). The adjoint equation uses the transposed Newton Jacobian, $g_x^{T}v = \\nabla f$." },
      { t: "Why AD needs help", d: "Differentiated naively, automatic differentiation propagates derivatives through every Newton iteration — differentiating the solver's ERROR. Tell it the step solves $g = 0$ and one linear solve suffices; the same goes for code in libraries it cannot see." },
    ],
    worked: "For $f(x(p))$ with $A(p)x = b$: solve $Ax = b$, then solve $A^{T}v = \\nabla_x f$, then $\\partial f/\\partial p_k = -v^{T}(\\partial A/\\partial p_k)x$. Two solves, however many parameters.",
    watch: "Computing $dx/dp$ for each parameter and then applying $f'$. That is forward mode — one solve PER parameter — when the adjoint gets all of them for one extra solve.",
    concepts: [],
    checks: [
      { q: "Newton's method on $f(x) = x^{2} - 2$ from $x_0 = 1$. After two steps, $x_2$ to four decimal places is:", num: 1.4167,
        expl: "$x_1 = 1 - (-1)/2 = 1.5$; $x_2 = 1.5 - 0.25/3 = 17/12 = 1.4167$, already close to $\\sqrt2 = 1.4142$." },
      { q: "$A(p) = \\begin{pmatrix}2 + p & 1\\\\ 1 & 3\\end{pmatrix}$, $Ax = (1, 0)$, $f = x_1$. At $p = 0$, $df/dp = -v^{T}(\\partial A/\\partial p)\\,x$ equals (two decimals):", num: -0.36,
        expl: "$x = (3/5, -1/5)$; $A^{T}v = (1, 0)$ gives $v = (3/5, -1/5)$; $\\partial A/\\partial p$ has a single 1 in the corner, so $df/dp = -v_1x_1 = -9/25$." },
      { q: "With a million parameters and one objective, the adjoint method needs:", opts: ["a million solves", "two solves (forward and adjoint) and cheap dot products", "a million finite differences", "the full Jacobian matrix"], a: 1,
        expl: "One forward solve, one transposed solve, then a dot product per parameter." },
    ],
  },

  "math210.0.8": {
    takeaway: "A derivative needs a NORM (to say what 'small' means), which is why the setting is a Banach space. The gradient of the determinant is the cofactor matrix, $\\nabla\\det A = \\det(A)\\,A^{-T}$, so $d\\det A = \\det A\\,\\mathrm{tr}(A^{-1}dA)$ and $d\\log\\det A = \\mathrm{tr}(A^{-1}dA)$.",
    beats: [
      { t: "The norm we swept under the rug", d: "$o(\\delta x)$ means $\\|\\text{remainder}\\|/\\|\\delta x\\| \\to 0$: you need a norm on both input and output even to define a derivative. A normed vector space is a Banach space; an inner product supplies a norm for free." },
      { t: "Three names", d: "$\\nabla\\det A = \\mathrm{cofactor}(A) = \\mathrm{adj}(A)^{T} = \\det(A)\\,(A^{-1})^{T}$. For 2×2 the adjugate swaps the diagonal and negates the off-diagonal." },
      { t: "Checked numerically", d: "A random $A$, a small random $dA$: $\\det(A + dA) - \\det A$ matches $\\mathrm{tr}(\\mathrm{adj}(A)\\,dA)$ — and both ForwardDiff and Zygote return the cofactor matrix as the gradient." },
      { t: "Proof one: Laplace expansion", d: "Expand along row $i$: $\\det A = \\sum_j a_{ij}C_{ij}$, and no cofactor $C_{ij}$ contains $a_{ij}$. So $\\det A$ is affine in each entry with slope $C_{ij}$. A 3×3 example with one symbolic entry gave $13a + \\dots$, and 13 is its minor." },
      { t: "Proof two: near the identity", d: "$\\det(I + dA) = 1 + \\mathrm{tr}(dA) + \\dots$ — the second coefficient of the characteristic polynomial. Then $\\det(A + dA) = \\det A\\,\\det(I + A^{-1}dA)$, giving $\\det A\\,\\mathrm{tr}(A^{-1}dA)$." },
      { t: "Log determinants", d: "$d\\log\\det A = \\mathrm{tr}(A^{-1}dA)$ — the logarithmic derivative, which turns up all over mathematics (and in Newton's $f/f'$)." },
      { t: "Culture: don't compute determinants", d: "In floating point, singular versus nonsingular is a spectrum; conditioning, measured by singular values, is the useful notion. Nor are eigenvalues found from characteristic polynomials: the QR algorithm factors $A = QR$, forms $RQ$, and repeats." },
    ],
    worked: "For any function built from a determinant, use $d\\det A = \\det A\\,\\mathrm{tr}(A^{-1}dA)$, or $d\\log\\det A = \\mathrm{tr}(A^{-1}dA)$ when a log is present, then read off the gradient with the Frobenius product: $\\mathrm{tr}(G^{T}dA)$ means $\\nabla = G$.",
    watch: "Forgetting the transpose. $d\\det A = \\det A\\,\\mathrm{tr}(A^{-1}dA)$, so the GRADIENT is $\\det(A)\\,A^{-T}$, not $\\det(A)\\,A^{-1}$ — they differ whenever $A$ is not symmetric.",
    concepts: [],
    checks: [
      { q: "$A = \\begin{pmatrix}2 & 1\\\\ 1 & 3\\end{pmatrix}$. The derivative of $\\log\\det A$ with respect to the entry $a_{11}$ is:", num: 0.6,
        expl: "$\\partial\\log\\det A/\\partial a_{ij} = (A^{-T})_{ij}$; $A^{-1} = \\tfrac15\\begin{pmatrix}3 & -1\\\\ -1 & 2\\end{pmatrix}$, so $3/5 = 0.6$." },
      { q: "$\\nabla\\det A$ equals:", opts: ["$A^{-1}$", "$\\det(A)\\,A^{-T}$, the cofactor matrix", "$\\mathrm{tr}(A)\\,I$", "$\\det(A)\\,A$"], a: 1,
        expl: "By the Laplace expansion each entry's slope is its cofactor; in matrix form that is $\\det(A)(A^{-1})^{T}$." },
      { q: "In practice, eigenvalues are computed by:", opts: ["finding roots of the characteristic polynomial", "the QR algorithm: factor, reverse to RQ, repeat", "Cramer's rule", "the determinant of $A - \\lambda I$ on a grid of $\\lambda$"], a: 1,
        expl: "Characteristic polynomials are numerically poor; iterated QR factorizations reveal the eigenvalues." },
    ],
  },

  "math210.0.9": {
    takeaway: "Forward-mode automatic differentiation is neither symbolic nor finite differences. Carry a pair — value and derivative — through every operation, with the sum and quotient rules taught to the arithmetic, and an unmodified program returns its exact derivative. Written $a + b\\varepsilon$ with $\\varepsilon^{2} = 0$, these are dual numbers.",
    beats: [
      { t: "What AD is not", d: "Edelman assumed it was a symbolic table of derivatives, or finite differences with a well-chosen step. It is neither — and that is what makes it surprising." },
      { t: "The Babylonian square root", d: "Start with $t = 1$; repeat $t \\leftarrow (t + x/t)/2$, averaging a guess that is too small with one too large. Ten steps match the built-in square root. Each iterate is a rational function of $x$ — the fifth is a degree-16 over degree-15 polynomial — that nobody ever writes out." },
      { t: "Nine lines", d: "Define a type $D$ holding (value, derivative). Teach it $+$ (add both parts) and $/$ (value divided; derivative by the quotient rule, $(v\\,du - u\\,dv)/v^{2}$), and how to promote an ordinary number $c$ to $(c, 0)$." },
      { t: "The magic", d: "Feed the UNCHANGED Babylonian code $D(49, 1)$: out comes $(7, 0.0714\\ldots)$ — $\\sqrt{49}$ and $1/(2\\sqrt{49}) = 1/14$. No formula for the derivative of a square root was given anywhere." },
      { t: "Why it works", d: "It is exactly what differentiating every line by hand does: $t' = 1/2$, then $t' \\leftarrow (t' + (t - x t')/t^{2})/2$ alongside each update. The pair carries that second iteration automatically — and it converges to $1/(2\\sqrt x)$ as the first converges to $\\sqrt x$." },
      { t: "Dual numbers", d: "Write $(a, b)$ as $a + b\\varepsilon$ with $\\varepsilon^{2} = 0$: a first-order expansion. Then $(a + b\\varepsilon)(c + d\\varepsilon) = ac + (ad + bc)\\varepsilon$ — the product rule — and $1/(1 + \\varepsilon) = 1 - \\varepsilon$, $(1 + \\varepsilon)^{5} = 1 + 5\\varepsilon$. All numerical, though it looks symbolic." },
      { t: "Why it is fast", d: "Every program bottoms out in $+ - \\times \\div$, so those four rules suffice in principle (in practice $\\sin$ and friends get their own rules). Julia compiles the derivative code into short, efficient assembler." },
    ],
    worked: "To differentiate a program in forward mode: seed the input as (value, 1), make every operation update the derivative by its own rule, and read the derivative off the output. Constants enter as (value, 0).",
    watch: "Thinking forward-mode AD approximates. There is no step size and no truncation error: it computes the exact derivative of the program as written, to floating-point accuracy.",
    concepts: [],
    checks: [
      { q: "Running the Babylonian square root on the dual number $49 + 1\\varepsilon$ returns a derivative part of (four decimal places):", num: 0.0714,
        expl: "$\\frac{d}{dx}\\sqrt x = 1/(2\\sqrt x) = 1/14 = 0.0714$ at $x = 49$." },
      { q: "With $\\varepsilon^{2} = 0$, the dual number $(1 + \\varepsilon)^{5}$ has $\\varepsilon$-coefficient:", num: 5,
        expl: "Only the linear term of the binomial expansion survives: $1 + 5\\varepsilon$ — the derivative of $x^{5}$ at 1." },
      { q: "Dividing dual numbers $(u, u')/(v, v')$ gives derivative part:", opts: ["$u'/v'$", "$(v u' - u v')/v^{2}$", "$u'v'$", "$(u' + v')/v$"], a: 1,
        expl: "The quotient rule, applied at a point: denominator times derivative of numerator, minus numerator times derivative of denominator, over the denominator squared." },
    ],
  },

  "math210.0.10": {
    takeaway: "Draw a program as a directed acyclic graph with each edge labelled by its one-step derivative. The derivative of an output with respect to an input is the SUM over paths of the PRODUCT of edge labels. Accumulate those path products from the inputs and you have forward mode; from the output, reverse mode.",
    beats: [
      { t: "A three-line program", d: "$a = \\sin x$, $b = a/y$, $z = b + x$. By hand: $z = \\sin(x)/y + x$, so $\\partial z/\\partial x = \\cos(x)/y + 1$ and $\\partial z/\\partial y = -\\sin(x)/y^{2}$." },
      { t: "The computational graph", d: "Nodes are variables; edges carry one-step derivatives: $x \\to a$ with $\\cos x$; $a \\to b$ with $1/y$; $y \\to b$ with $-a/y^{2}$; $b \\to z$ with 1; and $x \\to z$ with 1." },
      { t: "Path products", d: "From $x$ to $z$ there are two paths: $x \\to a \\to b \\to z$ contributes $1 \\cdot (1/y) \\cdot \\cos x$, and $x \\to z$ contributes 1. Their sum is $\\cos(x)/y + 1$. For $y$: one path, $-a/y^{2}$." },
      { t: "Forward and reverse", d: "Walk each path from input to output (forward) or from output to input (reverse). With scalars the order is irrelevant; with matrices on the edges, associativity still allows either order — even middle-outward — as long as products stay in order." },
      { t: "Implementing forward mode", d: "Carry (value, path-product) through the graph: a node $f$ turns $(x, p)$ into $(f(x), f'(x)\\,p)$. Start with $(x, 1)$ — the empty path product is 1, as the empty sum is 0. A constant sends everything to $(c, 0)$." },
      { t: "Where edges merge", d: "At a node with several inputs, $z = f(a, b)$ receives $(a, p)$ and $(b, q)$ and passes on $p\\,\\partial f/\\partial a + q\\,\\partial f/\\partial b$. For $a + b$ the partials are 1 and 1; for $ab$ they are $b$ and $a$." },
    ],
    worked: "To differentiate any composition: draw the graph, label each edge with its local derivative, then sum the path products from input to output. Every chain rule you know is a special case.",
    watch: "Forgetting a path. Where a variable reaches the output by two routes — $x$ goes into $a$ and also straight into $z$ — both products must be ADDED; dropping one loses a term.",
    concepts: [],
    checks: [
      { q: "For $z = \\sin(x)/y + x$, the value of $\\partial z/\\partial x$ at $x = 0$, $y = 2$ is:", num: 1.5,
        expl: "Two paths: $\\cos(0)/2 = 0.5$ through $a$ and $b$, plus 1 directly." },
      { q: "For the same program, $\\partial z/\\partial y$ at $x = \\pi/2$, $y = 2$ is:", num: -0.25,
        expl: "One path, $-a/y^{2} = -\\sin(\\pi/2)/4 = -0.25$." },
      { q: "In forward mode, the input node is seeded with path product:", opts: ["0, the empty sum", "1, the empty product", "the input value", "$\\varepsilon$"], a: 1,
        expl: "A path of length zero multiplies no edges, so its product is the multiplicative identity, 1." },
    ],
  },

  "math210.0.11": {
    takeaway: "To differentiate the solution of an ODE with respect to many parameters, add a Lagrange multiplier $\\lambda(t)$, integrate by parts, and choose $\\lambda$ to kill the unknown sensitivities. $\\lambda$ solves a linear adjoint ODE BACKWARDS in time, and the gradient becomes an integral — one forward solve, one backward solve, however many parameters.",
    beats: [
      { t: "ODEs", d: "$u' = f(u, p, t)$, $u(t_0) = u_0$. Higher-order equations become first-order systems (height and velocity for a falling ball). With no closed form, discretize: explicit Euler, $u_{n+1} = u_n + \\Delta t\\,f(u_n)$ — a forward difference." },
      { t: "Sensitivity analysis", d: "How does the solution respond to the parameters — for fitting reaction rates, control, design? Two families: discretize-then-differentiate (run AD through the solver) or differentiate-then-discretize (continuous sensitivities), each with forward and adjoint modes." },
      { t: "The ball", d: "$z(T) = z_0 + v_0T - \\tfrac12gT^{2}$, so $\\partial z(T)/\\partial g = -\\tfrac12T^{2}$. The question is how to get such derivatives without a closed form." },
      { t: "The cost and the zero", d: "$G(p) = \\int_{t_0}^{T} g(u, p, t)\\,dt$, e.g. squared mismatch with data. Add $\\int \\lambda^{T}(f - u')\\,dt$, which is zero for any $\\lambda(t)$ because $u$ solves the ODE." },
      { t: "Integrate by parts", d: "Differentiating brings in $s = du/dp$, the hard term. Integrate $\\lambda^{T}s'$ by parts and group every $s$ term: they vanish if $\\lambda' = -f_u^{T}\\lambda - g_u^{T}$ with $\\lambda(T) = 0$ — and $s(t_0) = 0$ kills the other boundary term." },
      { t: "The recipe", d: "Solve for $u(t)$ forward; solve the adjoint ODE for $\\lambda(t)$ backward from $T$; then $dG/dp = \\int (g_p + \\lambda^{T}f_p)\\,dt$. Like $A^{T}v$ for linear systems: the adjoint problem is linear and the same size." },
      { t: "Memory tricks", d: "Storing $u(t)$ at every time can be prohibitive for large systems. Re-solve $u$ backwards alongside $\\lambda$ — but that can be unstable, so use checkpoints. And the final integral is itself an ODE, $w' = g_p + \\lambda^{T}f_p$, solved in lockstep." },
      { t: "Discrete data", d: "If $G$ is a sum over measurement times rather than an integral, integrate backwards between them and add a jump to $\\lambda$ at each measurement." },
    ],
    worked: "For $dG/dp$ with $G = \\int g(u, p)\\,dt$ and $u' = f(u, p)$: solve forward for $u$; solve $\\lambda' = -f_u^{T}\\lambda - g_u^{T}$ backward from $\\lambda(T) = 0$; integrate $g_p + \\lambda^{T}f_p$. The cost does not grow with the number of parameters.",
    watch: "Running the adjoint ODE forwards. Its condition is set at the FINAL time, $\\lambda(T) = 0$, so it must be integrated from $T$ back to $t_0$.",
    concepts: [],
    checks: [
      { q: "A ball falls under gravity for $T = 2$ s. The sensitivity of its final height to $g$, $\\partial z(T)/\\partial g$, is:", num: -2,
        expl: "$z(T) = z_0 + v_0T - \\tfrac12gT^{2}$, so the derivative is $-\\tfrac12T^{2} = -2$." },
      { q: "The adjoint variable $\\lambda(t)$ has the same size as:", opts: ["the parameter vector $p$", "the state $u(t)$", "a scalar", "the Jacobian $f_u$"], a: 1,
        expl: "It multiplies $f - u'$, a state-sized vector, so it is a column vector with one entry per state component." },
      { q: "Adding $\\int\\lambda^{T}(f - u')\\,dt$ to the cost is allowed because:", opts: ["$\\lambda$ is zero", "the integrand is zero along any solution of the ODE", "it is a small error", "integration by parts removes it"], a: 1,
        expl: "$u' = f$ along the solution, so the added term is identically zero for any choice of $\\lambda(t)$ — which is then chosen to cancel the sensitivities." },
    ],
  },

  "math210.0.12": {
    takeaway: "Functions are vectors too, so a functional $f(u) = \\int F(u, u', x)\\,dx$ has a derivative defined exactly as before: linearize $f(u + du) - f(u)$. With the inner product $\\langle u, v\\rangle = \\int uv\\,dx$ and one integration by parts, the gradient is $F_u - (F_{u'})'$. Setting it to zero gives the Euler–Lagrange equation.",
    beats: [
      { t: "Functions as vectors", d: "You can add functions and scale them, so they form a vector space. Linear operators, dot products, orthogonality and eigenfunctions all carry over. The one caution is that functions can misbehave (blow up, or oscillate infinitely fast), so we implicitly stay among functions whose integrals exist." },
      { t: "A first functional", d: "$f(u) = \\int_0^1 \\sin(u(x))\\,dx$ takes a function and returns a number. Perturb it by a small function $du(x)$. At each $x$ this is ordinary 18.01 linearization, $\\sin(u + du) \\approx \\sin u + \\cos u\\,du$. So $df = \\int_0^1 \\cos(u(x))\\,du(x)\\,dx$, which is plainly linear in $du$." },
      { t: "The gradient needs a dot product", d: "The obvious inner product multiplies the 'components' (the values at each $x$) and adds them up: $\\langle u, v\\rangle = \\int_0^1 u(x)v(x)\\,dx$. Its norm is what says a change is small. Then $df = \\langle \\nabla f, du\\rangle$ gives $\\nabla f = \\cos u(x)$. In this setting it is often called a Fréchet derivative, but it is just the derivative." },
      { t: "Arc length", d: "$f(u) = \\int_0^1 \\sqrt{1 + u'(x)^{2}}\\,dx$ is the length of the curve. Expanding the square root to first order gives $df = \\int \\frac{u'}{\\sqrt{1 + u'^{2}}}\\,du'\\,dx$. That is linear, but in $du'$ rather than $du$, so it is not yet a dot product with $du$." },
      { t: "Integrate by parts", d: "Moving the derivative off $du$ leaves a boundary term $\\left[\\frac{u'}{\\sqrt{1+u'^{2}}}\\,du\\right]_0^1$ minus $\\int \\left(\\frac{u'}{\\sqrt{1+u'^{2}}}\\right)'du\\,dx$. Fixing the endpoints allows only perturbations with $du(0) = du(1) = 0$, so the boundary term vanishes and $\\nabla f = -\\left(u'/\\sqrt{1+u'^{2}}\\right)'$." },
      { t: "The shortest path", d: "At a minimum the gradient is zero. The quotient rule (after a student caught a slip on the board) collapses it to $u''/(1 + u'^{2})^{3/2} = 0$, so $u'' = 0$: a straight line. Nothing new, but this time derived rather than assumed." },
      { t: "Euler–Lagrange", d: "Take $f(u) = \\int_a^b F(u, u', x)\\,dx$, where $F_u$ and $F_{u'}$ are the derivatives of $F$ in its first and second slots. Then $df = \\int (F_u\\,du + F_{u'}\\,du')\\,dx$. Integrate by parts and drop the boundary term to get $\\nabla f = F_u - (F_{u'})' = 0$, a second-order ODE for $u$." },
      { t: "Where it shows up", d: "The principle of least action uses it to give Newton's laws in any coordinates, and optimal control uses it too. In the brachistochrone problem, the frictionless ramp that gets a mass down fastest turns out to be a cycloid: the curve traced by a point on a rolling wheel. The classical name is calculus of variations, but it is the same derivative on a new vector space." },
    ],
    worked: "To minimize $\\int F(u, u', x)\\,dx$ with fixed ends: write $F_u\\,du + F_{u'}\\,du'$ and integrate the second term by parts. The boundary term dies because $du = 0$ at the ends. Then set what multiplies $du$ to zero: $F_u - \\frac{d}{dx}F_{u'} = 0$.",
    watch: "Reading $\\int F_{u'}\\,du'\\,dx$ as the gradient. It is linear in $du'$, not $du$, and becomes a dot product with $du$ only after integrating by parts. Even then, the boundary term vanishes only because the endpoints are held fixed.",
    concepts: [],
    checks: [
      { q: "$f(u) = \\int_0^1 \\sin(u(x))\\,dx$ at $u(x) = x$. Perturb $u$ by the constant function $du(x) = \\varepsilon$. The rate $df/\\varepsilon$ is (two decimals):", num: 0.84,
        expl: "$df = \\int_0^1 \\cos(x)\\,\\varepsilon\\,dx = \\varepsilon\\sin 1$, so the rate is $\\sin 1 \\approx 0.84$." },
      { q: "The straight line from $(0, 0)$ to $(1, 1)$ has length $\\sqrt2 \\approx 1.41$. The parabola $u = x^{2}$ between the same points has length (two decimals):", num: 1.48,
        expl: "$\\int_0^1\\sqrt{1 + 4x^{2}}\\,dx = \\tfrac{\\sqrt5}{2} + \\tfrac14\\sinh^{-1}2 \\approx 1.48$. It is longer, as the Euler–Lagrange result says any curve other than the line must be." },
      { q: "In the arc-length derivation, the boundary term $\\left[\\frac{u'}{\\sqrt{1+u'^{2}}}\\,du\\right]_0^1$ disappears because:", opts: ["$u'$ is zero at the ends", "the endpoints are fixed, so every allowed perturbation has $du(0) = du(1) = 0$", "the integrand is odd", "it is second order in $du$"], a: 1,
        expl: "We only compare curves with the same endpoints, so every admissible $du$ vanishes there." },
    ],
  },

  "math210.0.13": {
    takeaway: "A random function $X(p)$ returns a random variable. Differencing samples taken independently does not work, because the difference never shrinks. The useful derivative comes from samples that SHARE their randomness: write $X(p) = x(p, \\omega)$ with $\\omega$ drawn from a fixed distribution, and differentiate at fixed $\\omega$. This is the reparameterization trick, and its average is $\\frac{d}{dp}E[X(p)]$, until the function jumps, as discrete ones do.",
    beats: [
      { t: "Two questions", d: "Guest lecturer Gaurav Arya starts with $f(A) = A^{2}$ and answers two questions separately. How does the output change? $(A + dA)^{2} - A^{2} = dA\\,A + A\\,dA + dA^{2}$. Which terms can be neglected? Here, $dA^{2}$. Both questions become non-trivial when the output is random." },
      { t: "Random functions", d: "$X(p)$ is a family of random variables indexed by a real number $p$. Examples are a Bernoulli that returns 1 with probability $p$, and an exponential with scale $p$ (samples of order $p$, larger values exponentially unlikely). Every call returns a different number." },
      { t: "Why differentiate them", d: "Because what we optimize is an average. A variational autoencoder's loss is an expectation; a stochastic model of reacting molecules, with exponential waiting times, is fitted to data. Sampling is easy, but the exact expectation often is not: a five-line random walk is easy to simulate and hard to average analytically. The goal is a new program $\\tilde X(p)$ whose average is $\\frac{d}{dp}E[X(p)]$, an unbiased gradient estimator." },
      { t: "The difference is underspecified", d: "$dX(\\varepsilon) = X(p + \\varepsilon) - X(p)$ is a random variable, but subtracting two random variables needs their JOINT distribution. Two fair coins differ half the time if independent, and never if they are the same coin. Sampled independently, $dX$ stays huge as $\\varepsilon \\to 0$: values around $10^{7}$ that, divided by $\\varepsilon$, average to 1 only in theory." },
      { t: "A fixed source of randomness", d: "Put all the randomness in a sample space $\\Omega$ whose distribution does not depend on $p$. Then $X(p)$ is a deterministic map $\\omega \\mapsto x(p, \\omega)$. With $\\omega$ uniform on $(0, 1)$, which is the computer's rand, an exponential of scale $p$ is $x = -p\\log(1 - \\omega)$." },
      { t: "Couple, then differentiate", d: "Use the SAME $\\omega$ for $p$ and for $p + \\varepsilon$. Now $dX$ is of size $\\varepsilon$ at every $\\omega$, and $\\delta(\\omega) = \\lim dX/\\varepsilon$ exists pointwise. For the exponential, $\\delta = -\\log(1 - \\omega)$. Its average is 1, which equals $\\frac{d}{dp}E[X]$ since $E[X] = p$." },
      { t: "It composes", d: "Because $x(p, \\omega)$ is an ordinary deterministic function, the chain rule just works: $Y = X^{2}$ has pathwise derivative $2X\\delta$. The class noticed that the live demo drew fresh random numbers for $X$ and $\\delta$. They must come from the same $\\omega$." },
      { t: "Discrete randomness breaks it", d: "A Bernoulli is a step: it returns 1 if $\\omega \\gt 1 - p$. Nudging $p$ moves the step, so almost every $\\omega$ sees no change and $\\delta = 0$, yet $\\frac{d}{dp}E[X] = 1$. The missing piece is a jump of size 1 that happens with probability of order $\\varepsilon$, so the limit and the expectation can no longer be swapped. Arya's stochastic triples fix this: like dual numbers with a third slot, they carry the value, the derivative, and a possible jump with its probability." },
    ],
    worked: "To differentiate $E[f(X(p))]$: write the sampler as a deterministic function of $p$ and a random input that does not depend on $p$, $X = x(p, \\omega)$. Differentiate $f(x(p, \\omega))$ in $p$ at fixed $\\omega$ with the ordinary chain rule, then average over $\\omega$. This works when $x$ is continuous in $p$.",
    watch: "Estimating $[X(p + \\varepsilon) - X(p)]/\\varepsilon$ from two independent runs. It is unbiased in principle and useless in practice: the noise does not shrink with $\\varepsilon$, so the variance grows like $1/\\varepsilon^{2}$.",
    concepts: [],
    checks: [
      { q: "$X$ is exponential with scale $p$, sampled as $X = -p\\log(1 - \\omega)$. The pathwise derivative of $Y = X^{2}$ is $2X\\delta$, with $\\delta = -\\log(1 - \\omega)$ from the same $\\omega$. At $p = 3$, its average (which equals $\\frac{d}{dp}E[Y]$) is:", num: 12,
        expl: "$E[Y] = E[X^{2}] = 2p^{2}$ for an exponential of scale $p$, so the derivative is $4p = 12$. Directly: $E[2X\\delta] = 2p\\,E[\\delta^{2}] = 2p \\cdot 2 = 12$." },
      { q: "Differencing two independent samples, one of $X(p + \\varepsilon)$ and one of $X(p)$, fails because:", opts: ["it is biased", "the difference does not shrink as $\\varepsilon \\to 0$, so dividing by $\\varepsilon$ gives enormous variance", "random variables cannot be subtracted", "the exponential has no mean"], a: 1,
        expl: "The average is right but the noise of two unrelated samples swamps the signal. Sharing $\\omega$ makes the difference proportional to $\\varepsilon$." },
      { q: "A Bernoulli$(p)$ is written as $1$ if $\\omega \\gt 1 - p$. At fixed $\\omega$ its pathwise derivative is 0 almost everywhere, yet $\\frac{d}{dp}E[X] = 1$. What does the pathwise derivative miss?", opts: ["a rounding error", "rare jumps of size 1, with probability of order $\\varepsilon$, where the step moves past $\\omega$", "the variance of $\\omega$", "a factor of $p$"], a: 1,
        expl: "The change is not small everywhere; it is large on a small set. That is why discrete randomness needs something beyond the reparameterization trick." },
    ],
  },

  "math210.0.14": {
    takeaway: "The second derivative is the derivative of the derivative: $f''(x)[dx', dx] = f'(x + dx')[dx] - f'(x)[dx]$. It takes TWO small changes and is linear in each (a bilinear form), and it is always symmetric. For $f: \\mathbb{R}^{n} \\to \\mathbb{R}$ it is $dx'^{T}H\\,dx$, with $H$ the symmetric Hessian. Its job is the quadratic approximation behind Newton's method.",
    beats: [
      { t: "Differences of linear operators", d: "$f'(x)$ is a linear operator, so $f'(x + dx') - f'(x)$ is a difference of linear operators. That is itself a linear operator, acting on $dx$. Linear operators form a vector space, which is exactly why matrices add and scale entrywise: those rules are what make $(L_1 + L_2)v = L_1v + L_2v$." },
      { t: "A bilinear form", d: "So $f''(x)$ takes two vectors: $dx'$, the change in WHERE the derivative is taken, and $dx$, the change the derivative acts on. It is linear in each separately, not jointly: $B(2u, 3v) = 6B(u, v)$." },
      { t: "Always symmetric", d: "A general bilinear form need not be symmetric; its two arguments need not even live in the same space. But writing out the definitions gives $f''(x)[dx', dx] = f(x + dx' + dx) - f(x + dx') - f(x + dx) + f(x)$, which treats $dx$ and $dx'$ identically. Equality of mixed partials from 18.02 is a special case." },
      { t: "The Hessian", d: "For scalar $f$ on $\\mathbb{R}^{n}$, $f'(x) = (\\nabla f)^{T}$. The only bilinear map from two column vectors to a scalar is $dx'^{T}H\\,dx$, and symmetry forces $H = H^{T}$. Differentiating $\\nabla f$ row by row gives $H_{ij} = \\partial^{2}f/\\partial x_i\\,\\partial x_j$: the Hessian is the Jacobian of the gradient." },
      { t: "Second derivative of det", d: "Start from $d\\det A = \\det A\\,\\mathrm{tr}(A^{-1}dA)$ and differentiate again with $dA$ held fixed, using the product rule and $d(A^{-1}) = -A^{-1}dA'\\,A^{-1}$. The result is $f''(A)[dA', dA] = \\det A\\,[\\mathrm{tr}(A^{-1}dA')\\,\\mathrm{tr}(A^{-1}dA) - \\mathrm{tr}(A^{-1}dA'\\,A^{-1}dA)]$, symmetric by the cyclic property of the trace. As a Hessian it would be $n^{2} \\times n^{2}$ acting on $\\mathrm{vec}(dA)$: possible, but unnatural." },
      { t: "Quadratic approximation", d: "$f(x + \\delta x) \\approx f(x) + f'(x)\\delta x + \\tfrac12 f''(x)[\\delta x, \\delta x]$. The $\\tfrac12$ is there because $\\delta x$ appears twice, as in a Taylor series: differentiate the model twice and you must get back $f''$." },
      { t: "Why they matter", d: "To optimize, fit a quadratic and step to its minimum; with constraints linearized as well, this is sequential quadratic programming. Equivalently, find a root of $\\nabla f$ by linearizing it. That is Newton's method, with the Hessian as the Jacobian." },
      { t: "When n is a billion", d: "The Hessian is $n \\times n$, so for a neural network it cannot even be stored. Hence quasi-Newton methods, which approximate it: BFGS (named for four people who found it independently in the same year) and Newton–Krylov methods. Hessian-vector products $H\\,dx$ stay cheap even when $H$ itself is not." },
    ],
    worked: "To get a second derivative of a matrix function: take the first-derivative formula, hold the first perturbation $dA$ fixed, perturb $A$ by a second $dA'$, and differentiate with the ordinary rules. The result, linear in both $dA$ and $dA'$, is the bilinear form. Check its symmetry with the cyclic property of the trace.",
    watch: "Dropping the $\\tfrac12$ in the quadratic model. $f''[\\delta x, \\delta x]$ is quadratic in $\\delta x$, so without the half the model's second derivative is $2f''$, and Newton steps come out half the right length.",
    concepts: [],
    checks: [
      { q: "$f(A) = \\det A$ at $A = I$, with both perturbations $dA = dA' = E = \\begin{pmatrix}1 & 2\\\\ 3 & 4\\end{pmatrix}$. The second derivative $f''(I)[E, E]$ is:", num: -4,
        expl: "At $A = I$ the formula is $\\mathrm{tr}(E)^{2} - \\mathrm{tr}(E^{2}) = 25 - 29 = -4$. Indeed $\\det(I + tE) = 1 + 5t - 2t^{2}$." },
      { q: "$f(x, y) = x^{2}y$ at $(1, 1)$, with step $\\delta = (0.1, 0.1)$. The quadratic approximation $f + \\nabla f^{T}\\delta + \\tfrac12\\delta^{T}H\\delta$ gives (two decimals):", num: 1.33,
        expl: "$\\nabla f = (2, 1)$ contributes $0.3$. $H = \\begin{pmatrix}2 & 2\\\\ 2 & 0\\end{pmatrix}$ contributes $\\tfrac12(0.06) = 0.03$. Total $1.33$, against the true $1.1^{3} = 1.331$." },
      { q: "Why is $f''(x)[dx', dx] = f''(x)[dx, dx']$?", opts: ["every bilinear form is symmetric", "expanded, it is $f(x + dx + dx') - f(x + dx) - f(x + dx') + f(x)$, which treats the two changes alike", "because $H$ is diagonal", "only for polynomials"], a: 1,
        expl: "Most bilinear forms are not symmetric. This one is, because writing out the definition of the derivative twice puts $dx$ and $dx'$ in interchangeable positions." },
      { q: "Full Newton's method is impractical for a neural network with $10^{9}$ parameters because:", opts: ["Hessians do not exist for neural networks", "the Hessian has $10^{18}$ entries, too many even to store", "the gradient is too expensive", "Newton only works in one dimension"], a: 1,
        expl: "Hence quasi-Newton approximations such as BFGS, and methods that need only Hessian-vector products." },
    ],
  },

  "math210.0.15": {
    takeaway: "Constrained quantities have constrained perturbations: on the sphere $x^{T}dx = 0$, and for an orthogonal $Q$, $Q^{T}dQ$ is antisymmetric. Differentiate $S = Q\\Lambda Q^{T}$ and take the diagonal: that gives the Hellmann–Feynman result $d\\lambda_i = q_i^{T}\\,dS\\,q_i$. The off-diagonal entries give the eigenvectors, and break down when eigenvalues collide.",
    beats: [
      { t: "The sphere first", d: "If $x^{T}x = 1$, differentiating gives $dx^{T}x + x^{T}dx = 2x^{T}dx = 0$. The only allowed changes are tangent, orthogonal to $x$. Edelman checks it on the circle $x = (\\cos\\theta, \\sin\\theta)$ and numerically at a random point on the sphere. That point comes from normalizing a standard normal vector, whose distribution is rotation-invariant; normalizing a uniform rand vector does not give a uniform point." },
      { t: "Extrinsic or intrinsic", d: "Describing the circle by $x$, two coordinates plus a constraint, is extrinsic. Describing it by the single angle $\\theta$ is intrinsic. Pure mathematicians came to prefer intrinsic coordinates; Edelman thinks extrinsic ones are better for computation." },
      { t: "Gradient on the sphere", d: "For $x^{T}Ax$ with $A$ symmetric, insert the projection $I - xx^{T}$ to restrict $dx$ to the tangent plane. The gradient becomes the ordinary gradient projected onto that plane, pushed back onto the sphere's tangent space. The same holds for any function on the sphere." },
      { t: "Orthogonal matrices", d: "$Q^{T}Q = I$ gives $Q^{T}dQ + dQ^{T}Q = 0$: $Q^{T}dQ$ plus its transpose is zero, so it is antisymmetric. The notebook showed it first: a numerical $Q^{T}dQ$ with a near-zero diagonal and mirrored entries of opposite sign." },
      { t: "Dimension of the orthogonal group", d: "2×2 rotations have one parameter; 3×3 have three (roll, pitch and yaw). In general the count is $n(n-1)/2$: $n^{2}$ entries minus the $n(n+1)/2$ constraints in $Q^{T}Q = I$. Counting through QR, the symmetric eigendecomposition or the SVD gives the same answer." },
      { t: "Differentiate $S = Q\\Lambda Q^{T}$", d: "The product rule gives three terms. Rotate them by $Q^{T}(\\cdot)Q$: $Q^{T}dS\\,Q = Q^{T}dQ\\,\\Lambda - \\Lambda\\,Q^{T}dQ + d\\Lambda$. Edelman checks this numerically on a random symmetric 5×5 matrix and a perturbation of it." },
      { t: "Hellmann–Feynman", d: "Take the diagonal. $Q^{T}dQ$ is antisymmetric, so its diagonal is zero, and multiplying by the diagonal $\\Lambda$ keeps it zero. What remains is $d\\lambda_i = q_i^{T}\\,dS\\,q_i$, which physicists call first-order perturbation theory. Johnson adds that it holds even for a non-symmetric $dS$, which is how small losses are added to a lossless system." },
      { t: "Eigenvectors, and where it fails", d: "The off-diagonal entries give the change in the eigenvectors, divided by $\\lambda_j - \\lambda_i$. When two eigenvalues are equal, it is no longer differentiable. Carrying on, first-order eigenvectors give second-order eigenvalues. For an inequality constraint such as positive semidefinite, parametrize instead: such matrices usually came from a $B^{T}B$ anyway." },
    ],
    worked: "To differentiate an eigenvalue of a symmetric $S(p)$: find its unit eigenvector $q$ and compute $d\\lambda/dp = q^{T}(dS/dp)\\,q$. You do not need the derivative of the eigenvector, as long as $\\lambda$ is not repeated.",
    watch: "Allowing any $dQ$ for an orthogonal matrix. Only perturbations with $Q^{T}dQ$ antisymmetric stay on the orthogonal group. The others step off it, just as a radial $dx$ steps off the sphere.",
    concepts: [],
    checks: [
      { q: "$S = \\begin{pmatrix}3 & 1\\\\ 1 & 1\\end{pmatrix}$. As the entry $s_{11}$ increases, the largest eigenvalue changes at the rate $q^{T}E_{11}q = q_1^{2}$, which is (two decimals):", num: 0.85,
        expl: "$\\lambda = 2 + \\sqrt2$ with eigenvector proportional to $(1, \\sqrt2 - 1)$, so $q_1^{2} = 1/(4 - 2\\sqrt2) \\approx 0.85$." },
      { q: "The orthogonal $4 \\times 4$ matrices form a set of dimension:", num: 6,
        expl: "$n(n-1)/2 = 6$: sixteen entries minus the ten independent constraints in $Q^{T}Q = I$." },
      { q: "Differentiating $Q^{T}Q = I$ shows that a perturbation of an orthogonal matrix must make $Q^{T}dQ$:", opts: ["zero", "symmetric", "antisymmetric", "diagonal"], a: 2,
        expl: "$Q^{T}dQ + (Q^{T}dQ)^{T} = 0$ is the definition of antisymmetric. On the sphere the same step gave $x^{T}dx = 0$." },
      { q: "The derivative of the eigenvectors breaks down when:", opts: ["$S$ is singular", "two eigenvalues coincide, because the formula divides by $\\lambda_j - \\lambda_i$", "$dS$ is not symmetric", "$n \\gt 3$"], a: 1,
        expl: "Hellmann–Feynman for the eigenvalues needs no division. The eigenvector formula does, and a repeated eigenvalue makes the eigenvectors non-unique." },
    ],
  },

  "math210.0.16": {
    takeaway: "A program is a directed acyclic graph with one-step partial derivatives on its edges, and every derivative is the sum over paths of the product of edge weights. Forward mode accumulates those products from the inputs and needs no stored graph. Reverse mode records the graph on a forward pass, then accumulates backwards from the output, sharing work along the way. Its cost scales with the number of outputs, which is why machine learning, with a single loss, uses it.",
    beats: [
      { t: "Partial versus total", d: "Take $a = \\sin x$, $b = a/y$, $z = b + x$. $\\partial z/\\partial x = 1$ is the one-step derivative, pretending $b$ does not depend on $x$; $dz/dx = \\cos(x)/y + 1$ is the whole truth. The graph carries the partials on its edges. A program's graph is always a DAG, because each step needs its inputs first." },
      { t: "Sum over paths", d: "$dz/dx$ is the sum, over all paths from $x$ to $z$, of the product of the edge weights. This is the chain rule, but the graph shows that the order of multiplication is yours to choose. On a computer every weight is a floating-point number, never a finite difference." },
      { t: "Four operations suffice", d: "Every arithmetic program reduces to $+$, $-$, $\\times$ and $\\div$. Their partials are $\\pm1$; $a_2$ and $a_1$; and $1/a_2$ and $-a_1/a_2^{2}$: the sum, product and quotient rules restated. In practice, libraries add known rules (ChainRules.jl), so $\\sin$ comes with $\\cos$. Code that calls out to a Fortran library breaks this unless someone writes a rule for it." },
      { t: "Forward mode", d: "At node $b$, knowing $da_i/dx$ for every input $a_i$: $db/dx = \\sum_i \\frac{\\partial b}{\\partial a_i}\\frac{da_i}{dx}$. The products are carried along as the program executes, so no graph is stored. This is why operator overloading with dual numbers works." },
      { t: "Reverse mode", d: "Now look at the nodes $b_i$ that $a$ feeds: $dz/da = \\sum_i \\frac{dz}{db_i}\\frac{\\partial b_i}{\\partial a}$, starting from $dz/dz = 1$. The sum can be built one edge at a time, adding into an accumulator $\\bar a$. For $b = a_1 + a_2$: $\\bar a_1 \\leftarrow \\bar a_1 + \\bar b$ and $\\bar a_2 \\leftarrow \\bar a_2 + \\bar b$. For $b = a_1a_2$: $\\bar a_1 \\leftarrow \\bar a_1 + a_2\\bar b$ and $\\bar a_2 \\leftarrow \\bar a_2 + a_1\\bar b$. Programs run forwards, so reverse mode must first run forward to compute every value and record the graph. Mathematically the two modes are mirror images; the asymmetry comes from the computer." },
      { t: "Counting the cost", d: "Johnson: forward mode costs the function times the number of inputs; reverse mode costs it times the number of outputs. With many of both, it is expensive either way. Edelman's graph has sources $a$ and $b$ feeding $c$, which feeds $d$. Forward mode computes $acd$ and $bcd$ separately: four multiplies. Reverse mode forms $cd$ once and reuses it: three. This is dynamic programming, and the same reason a row vector times a Jacobian beats a Jacobian times a Jacobian." },
      { t: "The demo", d: "$z = 2xy + (x - 1)^{2}$ at $x = 3$, $y = 5$. Forward pass: 6, 30, 2, 4, then $z = 34$. Reverse pass: the sum passes 1 to both branches. The product $6 \\cdot 5$ sends 5 and 6. The product $2 \\cdot x$ sends 15 and 10. The square sends $2 \\cdot 2 = 4$, and the subtraction adds 4 to $x$ and $-4$ to the constant. Since $x$ is one variable in storage, its contributions accumulate: $\\nabla z = (14, 6)$." },
      { t: "Custom rules and complex numbers", d: "When AD fails, or is wasteful (for example, differentiating the error of an approximate integral), you supply the rule yourself. That is a Jacobian-vector product (frule, pushforward) for forward mode, or a vector-Jacobian product (rrule, pullback) for reverse mode. Complex numbers need care too: $|z|^{2} = zz^{*}$ is not complex-differentiable, yet $df = z^{*}dz + z\\,dz^{*}$. CR (Wirtinger) calculus handles this by treating $z$ and $z^{*}$ as two variables." },
    ],
    worked: "Reverse mode by hand: run forward and write down every intermediate value. Set the output's adjoint to 1. Then walk the operations backwards. For each one, add (edge weight × adjoint of its output) into the adjoint of each input: the weight is $1$ for a sum and the OTHER factor for a product. A variable used twice collects from both uses.",
    watch: "Overwriting instead of accumulating. A variable that feeds two operations, like $x$ in both $2x$ and $x - 1$, must SUM its contributions. Assigning the second one discards the first path, which here gives 4 or 10 instead of 14.",
    concepts: [],
    checks: [
      { q: "For $z = 2xy + (x - 1)^{2}$ at $x = 3$, $y = 5$, reverse mode returns $\\partial z/\\partial x$ =", num: 14,
        expl: "$x$ collects 10 through $2x$ and 4 through $(x - 1)^{2}$: $2y + 2(x - 1) = 10 + 4 = 14$." },
      { q: "For the same $z$ and point, $\\partial z/\\partial y$ =", num: 6,
        expl: "$2x = 6$: the product node sends the other factor, $2x$, back to $y$." },
      { q: "Ten sources each feed node $c$, which feeds the output $d$, and every edge has a weight. Computing the ten path products $a_i\\,c\\,d$ one source at a time takes 20 multiplies. Reverse mode, reusing $cd$, takes:", num: 11,
        expl: "One multiply for $cd$, then one per source: $1 + 10 = 11$. With one output and many inputs, reverse mode shares everything downstream." },
      { q: "Reverse mode, unlike forward mode, must store the computational graph because:", opts: ["it uses more memory by design", "programs execute forwards, so the values and edge weights must be recorded before the backward sweep", "it uses finite differences", "it handles only scalars"], a: 1,
        expl: "Forward mode can ride along with execution. Reverse mode needs the whole forward computation first." },
    ],
  },

  "math210.1.0": {
    takeaway: "Training a linear classifier needs two things. The first is a LOSS that scores how bad a weight matrix $W$ is: the multiclass SVM's hinge loss or softmax's $-\\log$ probability, plus a regularization penalty that prefers simpler $W$. The second is OPTIMIZATION to find a good $W$: follow the negative gradient, computed analytically, checked numerically, and estimated on minibatches.",
    beats: [
      { t: "Loss function", d: "The scores are $s = f(x, W) = Wx$. There are three training images (a cat, a car, a frog), and a $W$ that scores the cat image 3.2 for cat, 5.1 for car and $-1.7$ for frog. A loss $L_i(f(x_i, W), y_i)$ for each example, averaged over the dataset, turns 'this $W$ is bad' into a number." },
      { t: "Multiclass SVM", d: "$L_i = \\sum_{j \\ne y_i}\\max(0,\\, s_j - s_{y_i} + 1)$. The correct score must beat every other score by a margin of 1, and the shape is a hinge. The three images give losses of 2.9, 0 and 12.9, which average to 5.27." },
      { t: "Questions that build intuition", d: "Jiggle the car image's scores and its loss stays 0, because it already clears the margin. The minimum is 0 and the maximum is infinite. At initialization, scores near 0 give $C - 1$, a debugging check at the first iteration. Summing over $j = y_i$ as well adds 1. Using a mean instead of a sum only rescales. Squaring the hinge gives a DIFFERENT classifier." },
      { t: "Regularization", d: "If $W$ gets zero loss, so does $2W$. So far the loss only asks the model to fit the TRAINING data, which invites overfitting: a wiggly curve through every point where a simple line would generalize. The fix is $L = \\frac1N\\sum_i L_i + \\lambda R(W)$, Occam's razor as a soft penalty, with $\\lambda$ a hyperparameter to cross-validate. L2 (weight decay) is the most common, L1 encourages sparsity, and elastic net mixes the two. With $x = (1, 1, 1, 1)$, both $w_1 = (1, 0, 0, 0)$ and $w_2 = (\\tfrac14, \\tfrac14, \\tfrac14, \\tfrac14)$ give the same score, and L2 prefers $w_2$, which spreads influence across the input." },
      { t: "Softmax", d: "Treat the scores as unnormalized log probabilities: $P(k \\mid x) = e^{s_k}/\\sum_j e^{s_j}$ and $L_i = -\\log P(y_i \\mid x_i)$. For the cat, exponentiate to 24.5, 164.0 and 0.18, then normalize to 0.13, 0.87 and 0.00. The loss is $-\\ln 0.13 \\approx 2.04$. The minimum is 0 and the maximum infinite, neither reachable with finite scores. At initialization the loss is $\\log C$. The SVM stops caring once the margin is met, whereas softmax always wants more probability on the correct class. In practice the two perform similarly." },
      { t: "Following the slope", d: "Optimization is walking downhill in a valley you cannot see. Random search reached 15% on CIFAR-10, against 10% for chance and about 95% for the state of the art. Better is to feel the slope. The gradient, the vector of partial derivatives, points uphill, and the slope in any direction is its dot product with that unit vector. Finite differences, one coordinate at a time, are slow and approximate; calculus gives the analytic gradient, exact and fast. Keep the numerical gradient as a GRADIENT CHECK on a scaled-down problem." },
      { t: "Gradient descent and SGD", d: "Initialize $W$, then repeatedly step against the gradient. The step size (learning rate) is the first hyperparameter to set. The full loss is an average over $N$ examples (1.3 million for ImageNet), and so is its gradient. So estimate it on a minibatch of 32, 64 or 128: this is stochastic gradient descent. Momentum and Adam are refinements to come." },
      { t: "Image features", d: "Before ConvNets, the standard approach was to compute features and feed them to a linear classifier: a colour histogram, histograms of oriented gradients over 8×8 cells, or a bag of visual words found by k-means. A transform to polar coordinates can make rings of points linearly separable. ConvNets learn the features from the pixels instead of fixing them in advance." },
    ],
    worked: "Sanity-check a new classifier at iteration 0. With small random weights, the loss should be about $C - 1$ for the SVM, or $\\log C$ for softmax (2.30 for ten classes). Then compare the analytic gradient with a finite-difference one on a small problem before training.",
    watch: "Training with the numerical gradient. It is right for gradient checking and hopeless for training: it needs one loss evaluation per parameter per step, and is still only approximate.",
    concepts: [],
    checks: [
      { q: "Scores, with rows for the cat, car and frog images and columns for the cat, car and frog classes: $(3.2, 5.1, -1.7)$, $(1.3, 4.9, 2.0)$, $(2.2, 2.5, -3.1)$. The average multiclass SVM loss with margin 1 is (two decimals):", num: 5.27,
        expl: "Cat: $\\max(0, 5.1 - 3.2 + 1) + \\max(0, -1.7 - 3.2 + 1) = 2.9$. Car: 0. Frog: $6.3 + 6.6 = 12.9$. The mean is $15.8/3 \\approx 5.27$." },
      { q: "The softmax loss (natural log) for the cat image, with scores 3.2 for cat, 5.1 for car and $-1.7$ for frog, is (two decimals):", num: 2.04,
        expl: "$-\\ln\\frac{e^{3.2}}{e^{3.2} + e^{5.1} + e^{-1.7}} = -\\ln 0.130 \\approx 2.04$." },
      { q: "A softmax classifier on ten classes, initialized so that every score is about 0, should report an initial loss of (two decimals):", num: 2.3,
        expl: "Each class gets probability $1/10$, so the loss is $\\ln 10 \\approx 2.30$. Anything else signals a bug." },
      { q: "$x = (1, 1, 1, 1)$. The weights $w_1 = (1, 0, 0, 0)$ and $w_2 = (0.25, 0.25, 0.25, 0.25)$ give the same score. L2 regularization prefers:", opts: ["$w_1$, because it is sparse", "$w_2$, whose squared norm is 0.25 against 1", "neither, because the scores are equal", "whichever has the larger bias"], a: 1,
        expl: "L2 penalizes $\\sum w_i^{2}$, so it favours spreading the weight. (L1 gives these two the same penalty; its preference is for sparsity in general.)" },
    ],
  },

  "math210.1.1": {
    takeaway: "Four choices decide whether a network can train at all. Use ReLU, not sigmoid. Zero-centre the data. Scale the initial weights by the fan-in (Xavier, with a factor of 2 for ReLU). Add batch normalization. Then babysit the run: check the initial loss, overfit a tiny subset, set the learning rate first, and search hyperparameters at random, on a log scale, from coarse to fine.",
    beats: [
      { t: "Sigmoid's three problems", d: "$\\sigma(x) = 1/(1 + e^{-x})$ squashes to $[0, 1]$, which made it popular as a neuron's firing rate. First, saturated neurons kill the gradient: at $x = \\pm10$ the local gradient is almost 0, and the chain rule multiplies whatever comes from upstream by it. Second, its outputs are not zero-centred: if a neuron's inputs are all positive, every weight gradient has the sign of the upstream gradient, so updates can only move in two quadrants and must zigzag. Third, $\\exp$ is mildly expensive." },
      { t: "ReLU and its variants", d: "tanh is zero-centred but still saturates. ReLU, $\\max(0, x)$, does not saturate for positive inputs, costs almost nothing, and converged about six times faster in AlexNet (2012). But it is not zero-centred, and its negative half is dead: a ReLU knocked off the data cloud, by bad initialization or more often by too high a learning rate, never fires or updates again, and 10–20% of a trained network can be dead. Leaky ReLU gives the negative side a small slope, PReLU learns that slope, and ELU saturates gently for negative inputs. Maxout, $\\max(w_1^{T}x + b_1, w_2^{T}x + b_2)$, neither saturates nor dies, but doubles the parameters. Rule: use ReLU, try the variants, never sigmoid." },
      { t: "Preprocessing", d: "Zero-centre the data, for the same reason as above; general machine learning also normalizes, or uses PCA and whitening. For images, subtract the mean image (32×32×3 for CIFAR) or a per-channel mean (as VGG does), computed once on the training set and applied unchanged at test time. It only fixes the first layer." },
      { t: "Initialization", d: "With $W = 0$, every neuron computes the same thing, gets the same gradient and makes the same update: nothing breaks the symmetry. Small random weights ($0.01 \\times$ Gaussian) work for small networks. But in a 10-layer, 500-unit tanh network the activations shrink toward zero layer by layer, so the weight gradients (proportional to the inputs) vanish too. With standard deviation 1 instead, every tanh saturates at $\\pm1$ and the gradients are zero again." },
      { t: "Xavier and He", d: "Glorot (2010) chose the scale so that output variance equals input variance: $W = \\text{randn}/\\sqrt{n_{\\text{in}}}$. Fewer inputs call for larger weights. The derivation assumes linear activations, and a ReLU zeroes half its inputs, which halves the variance and makes the activations collapse. Divide by $\\sqrt{n_{\\text{in}}/2}$ instead. In papers this can be the difference between a network training and nothing happening." },
      { t: "Batch normalization", d: "If unit Gaussian activations are wanted, force them: for each dimension, $\\hat x = (x - \\mu_B)/\\sqrt{\\sigma_B^{2} + \\varepsilon}$ over the minibatch. For conv layers there is one mean and variance per activation map, shared across the batch and all spatial locations. It is differentiable, and goes after the fully connected or conv layer. A learned scale and shift, $y = \\gamma\\hat x + \\beta$, lets the network undo it, or choose how much tanh saturation it wants. Gradients flow better, training tolerates more learning rates and initializations, and it regularizes slightly, because each output now depends on the rest of the batch. At test time, use running averages from training." },
      { t: "Babysitting the learning process", d: "Check that the initial loss is right: $\\ln 10 \\approx 2.3$ for ten-class softmax. Turn on regularization and check that the loss rises. Overfit a tiny subset with no regularization, and the loss should reach 0. Then find the learning rate. At $10^{-6}$ the loss barely moves, though accuracy can jump to 20% as diffuse probabilities tilt the right way. At $10^{6}$ the loss becomes NaN. The useful range is roughly $10^{-5}$ to $10^{-3}$." },
      { t: "Hyperparameter search", d: "Go coarse to fine: run a few epochs over wide ranges, and abandon any run whose cost exceeds three times the original. Sample on a log scale, because the learning rate acts multiplicatively. Distrust a best value at the edge of the range. Random search beats grid search, because performance usually depends on a few parameters, and random samples try more distinct values of each. Diagnostics: a big train–validation gap means more regularization; no gap means more capacity; the ratio of update size to weight size should be about $10^{-3}$." },
    ],
    worked: "Before a long run: check the initial loss ($\\ln C$ for softmax), check that regularization raises it, and overfit twenty examples to zero loss. Then sweep the learning rate on a log scale for a few epochs and zoom in, making sure the best values sit inside the range, not at its edge.",
    watch: "Initializing every weight to zero. Every neuron then computes the same output, receives the same gradient and makes the same update, forever. Random initialization breaks the symmetry, and its scale has to match the fan-in.",
    concepts: [],
    checks: [
      { q: "The local gradient of the sigmoid, $\\sigma'(x)$, at $x = 0$ is (two decimals):", num: 0.25,
        expl: "$\\sigma' = \\sigma(1 - \\sigma) = \\tfrac12 \\cdot \\tfrac12$. This is its LARGEST value, so every sigmoid layer shrinks the backward signal by at least a factor of 4, and near $x = \\pm10$ it is about $5 \\times 10^{-5}$." },
      { q: "A ReLU layer with 500 inputs, initialized so the variance is preserved (He: Xavier with the factor of 2). The weight standard deviation is (three decimals):", num: 0.063,
        expl: "$\\sqrt{2/500} \\approx 0.063$. A ReLU passes half the variance of a zero-mean input, $E[\\max(0, z)^{2}] = \\tfrac12\\mathrm{Var}(z)$, so the weights need twice the Xavier variance." },
      { q: "Batch normalization of one feature over the minibatch $(1, 2, 3, 6)$. The normalized value of the 6, with $\\varepsilon$ negligible, is (two decimals):", num: 1.6,
        expl: "Mean 3; variance $(4 + 1 + 0 + 9)/4 = 3.5$; $(6 - 3)/\\sqrt{3.5} \\approx 1.60$." },
      { q: "Why does random search beat grid search for hyperparameters?", opts: ["it is cheaper per trial", "performance usually depends strongly on few of them, and random samples try many more distinct values of each", "grid search cannot use a log scale", "random search always finds the optimum"], a: 1,
        expl: "A 3×3 grid tries only three learning rates. Nine random trials try nine." },
    ],
  },

  "math210.1.2": {
    takeaway: "Plain SGD zigzags across badly conditioned valleys, crawls near saddle points, and wanders with noisy gradients. Momentum adds velocity. AdaGrad and RMSProp divide each coordinate's step by a running size of its gradient. Adam does both, with bias correction, and is the default. Optimizers reduce TRAINING error; regularization (dropout, data augmentation, batch norm), ensembles and transfer learning close the gap to test error.",
    beats: [
      { t: "What goes wrong with SGD", d: "A loss shaped like a taco shell, steep one way and shallow the other, has a bad condition number: the ratio of the Hessian's largest to smallest singular value. SGD zigzags across it and crawls along it, and with millions of parameters some ratio is almost certainly large. Where the gradient is zero it stops. In high dimensions saddle points are everywhere and true local minima are rare, and near a saddle the slope is tiny, so progress is slow. Minibatch noise makes it meander. Full-batch gradient descent fixes none of this." },
      { t: "Momentum and Nesterov", d: "Keep a velocity: $v \\leftarrow \\rho v + \\nabla f$, $x \\leftarrow x - \\alpha v$, with friction $\\rho \\approx 0.9$ and $v$ starting at 0. Like a ball rolling downhill, it carries through local minima and saddles; zigzags cancel while speed builds along the shallow direction; and the noise averages out. The velocity is an exponentially weighted average of past gradients. Nesterov evaluates the gradient where the velocity is about to take you, and a change of variables puts it back at the current point. It overshoots less. Momentum may also skip sharp minima, which could be a feature: flat minima probably generalize better." },
      { t: "AdaGrad and RMSProp", d: "AdaGrad adds each squared gradient to a running sum and divides the step by its square root, plus $10^{-7}$ so it never divides by zero. Coordinates with small gradients speed up and steep ones slow down. But the sum only grows, so steps shrink forever: fine for convex problems, bad near saddle points. RMSProp makes the sum leaky, $s \\leftarrow 0.99s + 0.01g^{2}$, a kind of momentum over squared gradients." },
      { t: "Adam", d: "Adam combines a first moment (momentum) and a second moment (RMSProp) and steps by $m/\\sqrt{v}$. Both start at zero, so early steps divide by an almost-zero $v$ and can be huge. Bias correction divides by $1 - \\beta^{t}$. With $\\beta_1 = 0.9$, $\\beta_2 = 0.999$ and a learning rate of $10^{-3}$ or $5 \\times 10^{-4}$, it is a great starting point for almost any architecture. It rescales each coordinate axis separately, so it cannot fix a valley that runs diagonally to the axes." },
      { t: "Schedules and second order", d: "Decay the learning rate: in steps (the sudden drops in ResNet loss curves), exponentially, or as $1/t$. Decay is more common with SGD+momentum than with Adam, and it is a second-order hyperparameter: train without it first, then look at the curve. Newton's step, $x - H^{-1}\\nabla f$, jumps to the minimum of a quadratic model and needs no learning rate, but $H$ is $N \\times N$ for $N = 10^{8}$. Quasi-Newton methods like L-BFGS approximate it. They suit full-batch, noise-free problems such as style transfer, not stochastic training." },
      { t: "Ensembles and dropout", d: "Training ten models and averaging their predictions reliably gains a couple of percent. Snapshots from one run, taken at the lows of a cyclic learning rate, or Polyak averaging of the weights, are cheaper versions of the same idea. Dropout zeroes a random subset of activations on every forward pass. It keeps neurons from co-adapting (no single 'ear' or 'furry' feature can carry the decision) and trains an exponentially large ensemble of subnetworks that share weights. At test time, remove the randomness: multiply by the keep probability $p$, or divide by $p$ during training (inverted dropout). Training takes longer." },
      { t: "Noise in training, averaged at test", d: "The general pattern: add randomness during training, then marginalize it out at test. Dropout is one example. Batch normalization is another: an example's normalization depends on its batch during training and on fixed statistics at test. Data augmentation uses random flips, random crops (tested on 10 fixed crops), and colour jitter. DropConnect zeroes weights instead of activations; fractional max pooling uses random pooling regions; stochastic depth drops whole layers. Use batch norm by default, and add dropout if the network overfits." },
      { t: "Transfer learning", d: "It busts the myth that a CNN needs huge data. Train on ImageNet. Replace the last layer (4096×1000 becomes 4096×C), freeze everything else, and train a linear classifier. With more data, fine-tune more layers at a lower learning rate. Data unlike ImageNet (X-rays, say) needs more re-initialization. It is the norm, not the exception: every framework ships a model zoo." },
    ],
    worked: "A default that works for most new problems: Adam with $\\beta_1 = 0.9$, $\\beta_2 = 0.999$ and a learning rate of $10^{-3}$ or $5 \\times 10^{-4}$. Put batch normalization in the network. Add dropout only once the validation curve shows overfitting. Start from a pretrained model if your dataset is small.",
    watch: "Forgetting to rescale dropout at test time. With keep probability $\\tfrac12$, a neuron saw half its inputs on average during training. Run it on all of them and every activation doubles. Multiply by $p$ at test time, or divide by $p$ during training.",
    concepts: [],
    checks: [
      { q: "Momentum with $\\rho = 0.9$, starting from $v = 0$, under a gradient that stays constant at $g$. The velocity approaches what multiple of $g$?", num: 10,
        expl: "The steady state satisfies $v = 0.9v + g$, so $v = g/(1 - \\rho) = 10g$. On a long gentle slope, momentum steps ten times further than SGD." },
      { q: "Adam with $\\beta_1 = 0.9$, $\\beta_2 = 0.999$ and NO bias correction. On step 1, $m/\\sqrt{v}$ equals what multiple of $\\mathrm{sign}(g)$ ($\\varepsilon$ ignored; two decimals)?", num: 3.16,
        expl: "$m = 0.1g$ and $v = 0.001g^{2}$, so $m/\\sqrt v = 0.1/\\sqrt{0.001} \\approx 3.16$. Bias correction divides by $1 - 0.9$ and $1 - 0.999$, which brings it back to 1." },
      { q: "A neuron $a = w_1x + w_2y$ with $w_1 = 2$, $x = 3$, $w_2 = 1$, $y = 4$, trained with dropout that keeps each input with probability $\\tfrac12$. Its expected output during training is:", num: 5,
        expl: "Average over the four masks: $(0 + 6 + 4 + 10)/4 = 5$, half the test-time value of 10. That is why test outputs are multiplied by $p$." },
      { q: "In a network with $10^{8}$ parameters, the points where SGD most often stalls are:", opts: ["sharp local minima", "saddle points, where some directions go up and others go down", "global minima", "points of infinite gradient"], a: 1,
        expl: "A local minimum needs every one of $10^{8}$ directions to curve upward, which is rare. A saddle only needs a mix, which is almost everywhere. Momentum helps carry through." },
    ],
  },

  // Reading. Written from the standard content of Gabriel Goh's article (Distill,
  // 2017), in its own section order; distill.pub is blocked from this environment,
  // so the page itself was not fetched.
  "math210.1.3": {
    takeaway: "On a quadratic, gradient descent splits into independent eigen-directions, each shrinking by $|1 - \\alpha\\lambda_i|$, so the condition number $\\kappa = \\lambda_n/\\lambda_1$ sets the pace: at best $(\\kappa - 1)/(\\kappa + 1)$ per step. Momentum turns each direction into a damped oscillator, and with the right $\\alpha$ and $\\beta$ the rate becomes $(\\sqrt\\kappa - 1)/(\\sqrt\\kappa + 1)$. That is a square-root speedup, and no first-order method can beat it.",
    beats: [
      { t: "The heavy ball", d: "Gradient descent: $w^{k+1} = w^{k} - \\alpha\\nabla f(w^{k})$. Momentum adds a memory: $z^{k+1} = \\beta z^{k} + \\nabla f(w^{k})$, $w^{k+1} = w^{k} - \\alpha z^{k+1}$. The usual story is a ball rolling downhill, but the article sets out to show exactly why it helps: a quadratic speedup on many functions." },
      { t: "Gradient descent on a quadratic", d: "Take $f(w) = \\tfrac12 w^{T}Aw - b^{T}w$ with $A = Q\\,\\mathrm{diag}(\\lambda_i)\\,Q^{T}$. In eigen-coordinates $x = Q^{T}(w - w^{*})$ the iteration decouples: $x_i^{k} = (1 - \\alpha\\lambda_i)^{k}x_i^{0}$. The error is a sum of eigen-components, each decaying at its own rate. The large-$\\lambda$ ones go first, which is why loss curves drop fast and then crawl." },
      { t: "Choosing the step size", d: "Convergence needs $0 \\lt \\alpha\\lambda_i \\lt 2$ for every $i$, so $\\alpha \\lt 2/\\lambda_n$. The overall rate is $\\max_i |1 - \\alpha\\lambda_i|$, which depends only on the two extreme eigenvalues. It is minimized by $\\alpha = 2/(\\lambda_1 + \\lambda_n)$, where the rate is $(\\kappa - 1)/(\\kappa + 1)$. When $\\kappa$ is large, that is barely below 1." },
      { t: "Example: polynomial regression", d: "Fitting a polynomial by gradient descent makes the eigenvectors concrete. The eigenfeatures with large eigenvalues are smooth and fitted early. Those with small eigenvalues are wiggly and fitted late, if ever. Stopping early therefore acts as a regularizer: it never reaches the directions that overfit." },
      { t: "The dynamics of momentum", d: "Per eigen-direction, momentum is a 2×2 linear recurrence, and its rate is the larger magnitude of that matrix's two eigenvalues. It converges for $0 \\lt \\alpha\\lambda \\lt 2 + 2\\beta$, a wider range than plain descent. As $\\beta$ varies, the path ripples, decreases monotonically, or oscillates. Critical damping, at $\\beta = (1 - \\sqrt{\\alpha\\lambda})^{2}$, is the fastest." },
      { t: "The optimal parameters", d: "Tune for the extreme eigenvalues: $\\alpha = \\left(2/(\\sqrt{\\lambda_1} + \\sqrt{\\lambda_n})\\right)^{2}$ and $\\beta = \\left((\\sqrt\\kappa - 1)/(\\sqrt\\kappa + 1)\\right)^{2}$. The rate becomes $(\\sqrt\\kappa - 1)/(\\sqrt\\kappa + 1)$, so the number of iterations scales like $\\sqrt\\kappa$ instead of $\\kappa$. For $\\kappa = 100$ the rate falls from 0.98 to 0.82 per step." },
      { t: "Example: the colourization problem", d: "Spread colour along a graph by penalizing differences between neighbours: a quadratic built on the graph Laplacian. Information travels one edge per step, and the condition number grows with the graph's size, like $n^{2}$ for a path. Momentum spreads the information visibly faster." },
      { t: "The limits of descent, and noise", d: "Nesterov's lower bound: on a badly conditioned 'convex Rosenbrock' function, no first-order method can beat $(\\sqrt\\kappa - 1)/(\\sqrt\\kappa + 1)$, so momentum is optimal in that sense. With stochastic gradients, the error has a transient phase, which momentum speeds up, and a fine-tuning phase dominated by noise, which momentum does not remove. The optimal $\\beta$ found on a quadratic is a guide, not a guarantee, for a neural network." },
    ],
    worked: "To reason about a step size: find (or estimate) the extreme eigenvalues of the Hessian. Plain descent is stable only for $\\alpha \\lt 2/\\lambda_{\\max}$, and its best rate is $(\\kappa - 1)/(\\kappa + 1)$. With momentum, use $\\beta \\approx ((\\sqrt\\kappa - 1)/(\\sqrt\\kappa + 1))^{2}$. Needing $\\sqrt\\kappa$ iterations instead of $\\kappa$ is the whole gain.",
    watch: "Reading the early drop of the loss as convergence. The large-eigenvalue components vanish first. The small-eigenvalue ones, which set the rate, have hardly started.",
    concepts: [],
    checks: [
      { q: "Gradient descent on $f = \\tfrac12(x^{2} + 100y^{2})$, so $\\kappa = 100$. With the best fixed step size, the error shrinks per step by a factor of (two decimals):", num: 0.98,
        expl: "$\\alpha = 2/(1 + 100)$ gives $|1 - \\alpha| = |1 - 100\\alpha| = 99/101 \\approx 0.98$." },
      { q: "The same function with optimally tuned momentum. The per-step rate is (two decimals):", num: 0.82,
        expl: "$(\\sqrt{100} - 1)/(\\sqrt{100} + 1) = 9/11 \\approx 0.82$. Reducing the error a thousandfold takes about 35 steps instead of about 350." },
      { q: "On $f = \\tfrac12(x^{2} + 100y^{2})$, the largest step size for which plain gradient descent still converges is (supremum, two decimals):", num: 0.02,
        expl: "The $y$ component is multiplied by $1 - 100\\alpha$ each step, which needs $|1 - 100\\alpha| \\lt 1$, so $\\alpha \\lt 2/100$. The steepest direction sets the limit." },
      { q: "Early in gradient descent the loss falls quickly, then crawls. Why?", opts: ["the learning rate decays automatically", "components along large-eigenvalue directions vanish fast; the small-eigenvalue ones decay at $|1 - \\alpha\\lambda_1|$, close to 1", "the gradient becomes noisy", "the function stops being quadratic"], a: 1,
        expl: "Each eigen-component has its own rate. The slow ones dominate once the fast ones have gone." },
    ],
  },

  // Reading. Written from the standard content of Sebastian Ruder's overview (2016),
  // in its own section order; ruder.io is blocked from this environment, so the page
  // itself was not fetched.
  "math210.1.4": {
    takeaway: "A field guide to the update rules. Gradient descent comes in batch, stochastic and mini-batch variants. Momentum and Nesterov add velocity. Adagrad, Adadelta, RMSprop, Adam, AdaMax and Nadam adapt the learning rate for each parameter. Around them sit practical tricks: shuffling, curriculum learning, batch normalization, early stopping and gradient noise. Adaptive methods suit sparse data; Adam is a sound default; well-tuned SGD with a schedule remains competitive.",
    beats: [
      { t: "Three variants", d: "Batch gradient descent uses the whole dataset for each update: it converges to the global minimum on convex problems, but is slow and cannot learn online. SGD updates on one example at a time: fast and noisy, and the noise can jump into better basins; with a decaying learning rate it behaves like batch descent. Mini-batch, with 50 to 256 examples, cuts the variance and uses fast matrix operations. It is what 'SGD' usually means." },
      { t: "The challenges", d: "The learning rate is hard to choose. Predefined schedules cannot adapt to the data. One rate for all parameters is wrong for sparse features, which want larger updates when they finally appear. And saddle points, not local minima, are the real obstacle in high dimensions (Dauphin et al.)." },
      { t: "Momentum and Nesterov", d: "Momentum: $v_t = \\gamma v_{t-1} + \\eta\\nabla J(\\theta)$, $\\theta \\leftarrow \\theta - v_t$, with $\\gamma \\approx 0.9$. It builds speed where gradients agree and damps where they flip. Nesterov takes the gradient at the look-ahead point $\\theta - \\gamma v_{t-1}$, correcting before it overshoots, which helped RNNs." },
      { t: "Adagrad, Adadelta, RMSprop", d: "Adagrad divides each parameter's rate by the root of its accumulated squared gradients, $\\theta_i \\leftarrow \\theta_i - \\eta g_i/\\sqrt{G_{ii} + \\epsilon}$. Rare features get large steps, which is good for sparse data (it trained GloVe), but the accumulator only grows, so learning eventually stops. Adadelta keeps a decaying average instead, $E[g^{2}]_t = \\gamma E[g^{2}]_{t-1} + (1 - \\gamma)g_t^{2}$, and replaces $\\eta$ with the RMS of recent updates, so it needs no learning rate. RMSprop, from Hinton's lecture notes, is the same decaying average with $\\gamma = 0.9$ and $\\eta = 0.001$." },
      { t: "Adam and its relatives", d: "Adam keeps decaying averages of $g$ and $g^{2}$ ($\\beta_1 = 0.9$, $\\beta_2 = 0.999$, $\\epsilon = 10^{-8}$). Both start at zero and are biased toward it, so it divides by $1 - \\beta^{t}$. It behaves like a heavy ball with friction. AdaMax replaces the $\\ell_2$ scaling with $\\ell_\\infty$: $u_t = \\max(\\beta_2u_{t-1}, |g_t|)$. Nadam is Adam with a Nesterov look-ahead." },
      { t: "Pictures and choices", d: "On the Beale function and at a saddle point, the adaptive methods head the right way at once. Momentum and NAG overshoot like a rolling ball, with NAG correcting sooner. At the saddle, SGD barely escapes. For sparse inputs, use an adaptive method. RMSprop, Adadelta and Adam behave alike, with Adam's bias correction giving it a slight edge. Plain SGD with an annealing schedule often works but is slower, more sensitive to initialization, and prone to stalling at saddles." },
      { t: "Parallel and distributed SGD", d: "Hogwild! lets processors update shared memory without locks, which is safe when updates are sparse. Downpour SGD (DistBelief) runs model replicas against a parameter server. There are delay-tolerant algorithms, TensorFlow's distributed runtime, and elastic averaging SGD, which lets workers drift from a centre variable to explore." },
      { t: "Additional strategies", d: "Shuffle every epoch, or use curriculum learning (easy examples first, mixed with random ones). Batch normalization permits higher learning rates. Early stopping on validation error is what Hinton called a 'beautiful free lunch'. Gradient noise, Gaussian with annealed variance $\\eta/(1 + t)^{\\gamma}$, helps very deep networks train." },
    ],
    worked: "Choosing an optimizer: with sparse features, pick an adaptive method (Adagrad family or Adam). Otherwise start with Adam at its default settings. If you have the time to tune, SGD with momentum and a learning-rate schedule can match or beat it. Always shuffle, and keep early stopping on.",
    watch: "Leaving Adagrad running indefinitely. Its denominator is a sum of squares that never shrinks, so the effective learning rate decays like $1/\\sqrt t$ and training quietly stops. That is the flaw Adadelta, RMSprop and Adam were designed to fix.",
    concepts: [],
    checks: [
      { q: "Adagrad sees the same gradient on every step. Ignoring $\\epsilon$, its step at $t = 100$ is what fraction of its first step?", num: 0.1,
        expl: "The accumulator is $t g^{2}$, so the step is $\\eta g/\\sqrt{t g^{2}} = \\eta/\\sqrt t$: one tenth at $t = 100$." },
      { q: "A decaying average $E[g^{2}]$ starts at 0 with $\\gamma = 0.9$, and every gradient is 1. After 10 steps it equals (two decimals):", num: 0.65,
        expl: "$E_t = 0.9E_{t-1} + 0.1$ gives $1 - 0.9^{10} \\approx 0.65$, still biased toward its zero start. That is why Adam divides by $1 - \\beta^{t}$." },
      { q: "For a model whose input features are very sparse, the overview recommends:", opts: ["plain SGD with a fixed rate", "an adaptive learning-rate method", "batch gradient descent", "momentum without an adaptive rate"], a: 1,
        expl: "Adaptive methods give rarely seen features larger updates, with no tuning of per-feature rates." },
      { q: "Adadelta needs no global learning rate because:", opts: ["it uses second derivatives", "it replaces $\\eta$ with the RMS of recent parameter updates, which also fixes the units", "it fixes $\\eta = 1$", "it normalizes the weights"], a: 1,
        expl: "The ratio $\\mathrm{RMS}[\\Delta\\theta]_{t-1}/\\mathrm{RMS}[g]_t$ has the units of $\\theta$ per unit gradient, so it acts as a self-scaled learning rate." },
    ],
  },

  // Reading. Written from the standard content of Boyd & Vandenberghe, Convex
  // Optimization, chapters 2 and 3, in the book's order; web.stanford.edu is blocked
  // from this environment, so the book itself was not fetched.
  "math210.1.5": {
    takeaway: "A set is convex if it contains every segment between its points. A function is convex if its graph lies below every chord, or equivalently above every tangent plane, which is why a zero gradient means a GLOBAL minimum. Rather than checking the definition every time, build convex things from known examples using operations that preserve convexity.",
    beats: [
      { t: "Convex sets", d: "$C$ is convex if $\\theta x_1 + (1 - \\theta)x_2 \\in C$ for all $x_1, x_2 \\in C$ and $\\theta \\in [0, 1]$. Affine sets contain whole lines, cones contain every ray through their points, and the convex hull is the smallest convex set containing given points. Standard examples are hyperplanes $\\{a^{T}x = b\\}$, halfspaces, Euclidean balls, ellipsoids, norm balls and norm cones, polyhedra $\\{Ax \\preceq b,\\ Cx = d\\}$, simplexes, and the cone of positive semidefinite matrices." },
      { t: "Operations that preserve convexity", d: "Intersections (of any number of sets), affine images and preimages, the perspective map $(x, t) \\mapsto x/t$, and linear-fractional maps all keep a set convex. Proving convexity usually means writing the set as one of these built from known pieces." },
      { t: "Generalized inequalities and dual cones", d: "A proper cone $K$ defines an order: $x \\preceq_K y$ means $y - x \\in K$ (for example, componentwise order, or $A \\preceq B$ for matrices). Its dual cone is $K^{*} = \\{y : y^{T}x \\ge 0 \\text{ for all } x \\in K\\}$. The nonnegative orthant and the PSD cone are self-dual. Minimum and minimal elements behave differently under a partial order." },
      { t: "Separating hyperplanes", d: "Two disjoint convex sets can be separated by a hyperplane, $a^{T}x \\le b$ on one side and $\\ge b$ on the other. At every boundary point of a convex set there is a supporting hyperplane. These geometric facts underlie duality and optimality conditions." },
      { t: "Convex functions", d: "$f$ is convex if its domain is convex and $f(\\theta x + (1 - \\theta)y) \\le \\theta f(x) + (1 - \\theta)f(y)$. First-order condition: $f(y) \\ge f(x) + \\nabla f(x)^{T}(y - x)$. The tangent is a GLOBAL underestimator, so $\\nabla f(x) = 0$ means a global minimum. Second-order condition: $\\nabla^{2}f \\succeq 0$. The epigraph is a convex set, sublevel sets are convex, and Jensen's inequality gives $f(E x) \\le E f(x)$." },
      { t: "The catalogue", d: "Convex: $e^{ax}$; $x^{a}$ on $x \\gt 0$ for $a \\ge 1$ or $a \\le 0$; $|x|^{p}$ for $p \\ge 1$; $-\\log x$; $x\\log x$; every norm; $\\max_i x_i$; the quadratic-over-linear $x^{2}/y$ for $y \\gt 0$; and log-sum-exp, $\\log\\sum e^{x_i}$, a smooth max whose gradient is the softmax. Concave: the geometric mean, and $\\log\\det X$ on positive definite matrices." },
      { t: "Operations on functions", d: "Nonnegative weighted sums, composition with an affine map, pointwise maximum or supremum (so the largest eigenvalue is convex), the composition rules (a convex, nondecreasing $h$ of a convex $g$ is convex), minimization over some of the variables, and the perspective $t f(x/t)$ all preserve convexity." },
      { t: "Conjugates and relaxed notions", d: "The conjugate $f^{*}(y) = \\sup_x\\,(y^{T}x - f(x))$ is always convex, being a supremum of affine functions. Fenchel's inequality: $f(x) + f^{*}(y) \\ge x^{T}y$. Example: $\\tfrac12x^{T}Qx$ has conjugate $\\tfrac12y^{T}Q^{-1}y$. Weaker notions: quasiconvex functions (convex sublevel sets) and log-concave functions (Gaussian densities; closed under products and marginalization)." },
    ],
    worked: "To prove a function is convex, avoid the definition. Assemble the function from the catalogue (norms, $-\\log$, log-sum-exp, quadratics with PSD matrices) using the operations that preserve convexity (sums, affine substitution, maxima, the composition rules). If that fails, check whether the Hessian is positive semidefinite.",
    watch: "Taking the minimum of convex functions, or the union of convex sets. Maxima and intersections preserve convexity; minima and unions do not. $\\min(x^{2}, (x - 2)^{2})$ has two separate valleys.",
    concepts: [],
    checks: [
      { q: "$x$ is 0 or 2 with probability $\\tfrac12$ each, and $f(x) = e^{x}$. The Jensen gap $E f(x) - f(E x)$ is (two decimals):", num: 1.48,
        expl: "$E f = (1 + e^{2})/2 \\approx 4.19$ and $f(E x) = e \\approx 2.72$. The gap is about $1.48$, positive as Jensen requires for convex $f$." },
      { q: "The conjugate of $f(x) = -\\log x$ is $f^{*}(y) = \\sup_{x \\gt 0}(yx + \\log x)$. At $y = -2$ it equals (two decimals):", num: -1.69,
        expl: "The supremum is at $x = -1/y = \\tfrac12$: $-1 + \\log\\tfrac12 = -1 - \\log 2 \\approx -1.69$. In general $f^{*}(y) = -1 - \\log(-y)$ for $y \\lt 0$." },
      { q: "For a differentiable convex $f$, $\\nabla f(x^{*}) = 0$ implies:", opts: ["$x^{*}$ is a local minimum only", "$x^{*}$ is a global minimum, because the tangent plane at $x^{*}$ lies below $f$ everywhere", "$x^{*}$ is a saddle point", "nothing without the Hessian"], a: 1,
        expl: "The first-order condition gives $f(y) \\ge f(x^{*}) + 0$ for every $y$." },
      { q: "Which operation does NOT preserve convexity?", opts: ["pointwise maximum of convex functions", "intersection of convex sets", "pointwise minimum of convex functions", "composition with an affine map"], a: 2,
        expl: "$\\min(x^{2}, (x - 2)^{2})$ is not convex: its chord from 0 to 2 lies below the graph at 1." },
    ],
  },

});
