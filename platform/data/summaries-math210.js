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

});
