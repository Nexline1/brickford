// Brickford — lecture summaries, MATH 110 Unit II (MIT 18.06, Gilbert Strang)
//
// Split from summaries-math110.js because one file for fifty-one lectures runs
// to three thousand lines. DAR.SUMMARIES is merged with Object.assign, so this
// file only has to exist and be loaded; app.js reads one flat map and knows
// nothing about which course or unit a key belongs to.
//
// Same contract as the 3Blue1Brown file, and the same reason for it: written
// FROM the lecture, following Strang's own argument in his own order, so the
// summary is a review of what he actually said rather than a paraphrase of the
// topic. tools/verify-content.js enforces the shape and RECOMPUTES every
// numeric answer — see the summaries block there before adding an entry.
//
// beats[]  — the argument as it develops. fig is optional (an id in DAR.FIG).
// worked   — the practical pattern, because theory alone does not transfer.
// watch    — the trap, stated as the error rather than a warning.
// checks[] — active review; recognising a summary is not remembering it.
window.DAR = window.DAR || {};

DAR.SUMMARIES = Object.assign(DAR.SUMMARIES || {}, {

  "math110.1.0": {
    takeaway: "Every linear system has a row picture and a column picture, and the column picture is the one that survives into higher dimensions.",
    beats: [
      { t: "One problem, written three ways", d: "$n$ equations in $n$ unknowns. The row picture takes one equation at a time; the column picture takes one column at a time; the matrix form $A\\vec{x}=\\vec{b}$ packages both. Strang stars the column picture, and the lecture earns the star." },
      { t: "The row picture is where they meet", d: "Each equation draws a line in two dimensions, a plane in three. The solution is the point they all share — two planes meet along a line, and the third plane cuts that line at a point." },
      { t: "The column picture asks for a combination", d: "$A\\vec{x}=\\vec{b}$ is asking: how much of each column do I need so that they add up to $\\vec{b}$? That linear combination of columns is the single most fundamental operation in the course." },
      { t: "Why the column picture scales and the row picture does not", d: "Three planes intersecting is already hard to see. Nine is hopeless. But combinations of nine vectors in nine dimensions is still a thought you can hold, even without picturing it." },
      { t: "Solvable for every $\\vec{b}$ is a question about span", d: "Ask whether the combinations of the columns fill the whole space. If the third column lies in the plane of the first two, it adds nothing, and most right-hand sides are simply unreachable." },
    ],
    worked: "$2x-y=0$ and $-x+2y=3$. In the column picture: find $x,y$ with $x(2,-1) + y(-1,2) = (0,3)$. One of the first column plus two of the second gives $(2-2,\\,-1+4) = (0,3)$. So $x=1$, $y=2$.",
    watch: "Reading $A\\vec{x}$ only as rows dotted with $\\vec{x}$. It is equally a combination of the columns, and that is the reading the rest of the course is built on.",
    concepts: ["la-span"],
    checks: [
      { q: "$A\\vec{x}=\\vec{b}$ has a solution for EVERY $\\vec{b}$ exactly when:", opts: ["$A$ is square", "Combinations of the columns fill the whole space", "The rows are perpendicular", "$\\vec{b}$ is the zero vector"], a: 1,
        expl: "The reachable right-hand sides are precisely the combinations of the columns. If those fill the space, every $\\vec{b}$ is reachable; if they fill only a plane, most are not." },
      { q: "Combining $(2,-1)$ and $(-1,2)$ with $x=1$ and $y=2$, the second component is:", num: 3,
        expl: "$1\\cdot(-1) + 2\\cdot 2 = -1 + 4 = 3$." },
    ],
  },

  "math110.1.1": {
    takeaway: "Elimination is a sequence of row operations, and every row operation is multiplication on the left by one very simple matrix.",
    beats: [
      { t: "The algorithm, one column at a time", d: "Accept the first row; the leading entry is the first pivot. Subtract multiples of that row to clear the rest of its column. Drop to the next pivot and repeat. What comes out is upper triangular — call it $U$." },
      { t: "A pivot is never zero", d: "A zero in the pivot position is survivable if some row below has a non-zero entry there: exchange rows. It is fatal when everything below is zero too — no third pivot, and the matrix has no inverse." },
      { t: "The right-hand side rides along", d: "Tack $\\vec{b}$ on as an extra column — the augmented matrix. $A$ becomes $U$ and $\\vec{b}$ becomes $\\vec{c}$. Then solve $U\\vec{x}=\\vec{c}$ from the bottom row upwards: back substitution, which is easy because the system is triangular." },
      { t: "A matrix on the LEFT does row operations", d: "A row times a matrix is a combination of that matrix's ROWS, mirroring how a matrix times a column is a combination of its columns. Elimination is entirely rows, which is why the elimination matrices multiply from the left." },
      { t: "Each step is one elementary matrix", d: "To subtract 3 times row one from row two, take the identity and write $-3$ in the 2,1 position. Everything else stays, because the identity leaves every row alone. That matrix is $E_{21}$." },
      { t: "Composing them is the associative law", d: "$E_{32}(E_{21}A) = (E_{32}E_{21})A$. You may move the parentheses, never the order — matrix multiplication does not commute. Multiplying the $E$s together first gives one matrix that performs all of elimination." },
    ],
    worked: "Undoing a step reads straight off it. $E_{21}$ subtracted 3 times row one from row two, so $E_{21}^{-1}$ adds it back: the identity with $+3$ in the 2,1 position. Multiply the two and you get $I$.",
    watch: "Treating the pivots as bookkeeping. They are the diagnostic: three non-zero pivots means invertible, and their product is the determinant.",
    concepts: ["la-matmul"],
    checks: [
      { q: "Elimination matrices multiply on the LEFT because:", opts: ["Matrix multiplication commutes", "Multiplying on the left combines ROWS; on the right it combines columns", "The left matrix must be square", "Elimination operates on columns"], a: 1,
        expl: "Row operations are what elimination does, and a matrix applied from the left takes combinations of rows. A permutation on the right would exchange columns instead." },
      { q: "For $A=\\begin{pmatrix}1&2&1\\\\3&8&1\\\\0&4&1\\end{pmatrix}$, elimination gives pivots 1, 2 and 5. Their product, the determinant, is:", num: 10,
        expl: "$1\\cdot2\\cdot5 = 10$, and expanding $\\det A$ directly gives $4-6+12=10$ — the same number two ways." },
    ],
  },

  "math110.1.2": {
    takeaway: "Matrix multiplication is one operation with five readings, and the one that pays later is column times row, because it builds a matrix out of a single rank-one piece.",
    beats: [
      { t: "The entry-by-entry rule is the row-column dot product", d: "The entry of $AB$ in row 3, column 4 is row 3 of $A$ dotted with column 4 of $B$: $\\sum_k a_{3k}b_{k4}$. It is correct, it is what you compute by hand, and it says almost nothing about why the answer looks the way it does." },
      { t: "Columns of $AB$ are combinations of columns of $A$", d: "Take $A$ times one column of $B$ at a time. Each column of $B$ is a recipe, and the column of $AB$ it produces is that combination of $A$'s columns. Rows of $AB$ are, symmetrically, combinations of the rows of $B$." },
      { t: "Column times row makes a whole matrix", d: "A column of $A$ times a row of $B$ — an $m\\times 1$ times a $1\\times n$ — is a full $m\\times n$ matrix. Every one of its columns is a multiple of that one column, and every row a multiple of that one row: a rank-one matrix." },
      { t: "$AB$ is the sum of those rank-one pieces", d: "Column $k$ of $A$ times row $k$ of $B$, summed over $k$. The whole product is a stack of rank-one layers. That decomposition comes back for the four subspaces and again, in its best form, at the SVD." },
      { t: "Blocks multiply by the same rule", d: "Cut both matrices into blocks that fit, and the block in position 1,1 of the product is $A_1B_1 + A_2B_3$ — the row-column rule again, with matrices where the numbers were." },
      { t: "Gauss-Jordan solves for every column of $A^{-1}$ at once", d: "$AA^{-1}=I$ is $n$ systems sharing one matrix. Augment $[A\;|\;I]$ and eliminate downwards and then upwards until the left half is $I$. Whatever $E$ did that satisfies $EA=I$, so $E$ IS $A^{-1}$ — and it has been applied to $I$ on the right, leaving $A^{-1}$ sitting there." },
    ],
    worked: "Invert $\\begin{pmatrix}1&3\\\\2&7\\end{pmatrix}$. Augment with $I$, subtract twice row one from row two to get a 1 in the corner, then subtract three times the new row two from row one. The right half reads $\\begin{pmatrix}7&-3\\\\-2&1\\end{pmatrix}$.",
    watch: "Calling a matrix singular because its determinant happened to be zero. The reason is that some non-zero $\\vec{x}$ has $A\\vec{x}=\\vec{0}$; an inverse would multiply that to give $\\vec{x}=\\vec{0}$, which is false.",
    concepts: ["la-matmul"],
    checks: [
      { q: "A column of $A$ times a row of $B$ produces:", opts: ["A single number", "A full matrix, every column a multiple of that one column", "A vector", "The identity"], a: 1,
        expl: "An $m\\times 1$ times a $1\\times n$ is $m\\times n$. Its column space is one line and its row space is one line — rank one — and $AB$ is the sum of $n$ such layers." },
      { q: "The inverse of $\\begin{pmatrix}1&3\\\\2&7\\end{pmatrix}$ has, in row 1 column 2, the entry:", num: -3,
        expl: "The determinant is $7-6=1$, so the inverse is $\\begin{pmatrix}7&-3\\\\-2&1\\end{pmatrix}$ and the 1,2 entry is $-3$. Check it: $1\\cdot(-3)+3\\cdot 1 = 0$, as the off-diagonal of $I$ requires." },
    ],
  },

  "math110.1.3": {
    takeaway: "Elimination undone is tidier than elimination done: the multipliers drop straight into $L$, so the factorisation $A=LU$ costs nothing beyond the elimination already performed.",
    beats: [
      { t: "Inverses and transposes reverse the order", d: "$(AB)^{-1} = B^{-1}A^{-1}$ — shoes off, then socks, so socks back on before shoes. Transposing $AA^{-1}=I$ gives the same reversal and a second fact: $(A^{T})^{-1} = (A^{-1})^{T}$, so the two operations commute on a single matrix." },
      { t: "Move the elimination matrices to the other side", d: "$E_{32}E_{31}E_{21}A = U$. Multiply back by the inverses, in the opposite order, and $A = E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}U$. Name that lower triangular product $L$ and you have $A = LU$." },
      { t: "The forward product invents a number nobody chose", d: "Multiply $E_{21}$ (subtract 2 of row one from row two) by $E_{32}$ (subtract 5 of row two from row three) and a 10 appears in the 3,1 corner: ten of row one reached row three by going through row two." },
      { t: "The reverse product does not", d: "Take the same two steps as inverses in the opposite order and the entries stay where they were put: 2 and 5 on the diagonal's south side, nothing between them. $L$ is a record, not a computation." },
      { t: "So $A$ can be thrown away", d: "Once a row of $U$ and the multipliers that made it are saved, the original row has nothing left to say. $L$ and $U$ together are the matrix, held in the same amount of storage." },
      { t: "The price is $n^3/3$ once, then $n^2$ per right-hand side", d: "Clearing the first column touches about $n^2$ entries, the next about $(n-1)^2$, and the sum behaves like $\\int x^2\\,dx$. That is why you factor once and then run each new $\\vec{b}$ through cheaply." },
    ],
    worked: "$A=\\begin{pmatrix}2&1\\\\8&7\\end{pmatrix}$. The multiplier is 4, and subtracting 4 times row one from row two leaves $U=\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix}$. $L$ is the identity carrying that same 4 below the diagonal, and $LU$ returns $A$.",
    watch: "Multiplying the elimination matrices together to find $L$. That product mixes multipliers — a 2 and a 5 become a 10 — while their inverses in reverse order leave them alone.",
    concepts: ["la-matmul"],
    checks: [
      { q: "The multipliers appear undisturbed in $L$, but not in the product of the $E$s, because:", opts: ["$L$ is upper triangular", "In the reverse order, no later step feeds an earlier row's multiple further down", "The $E$s are not invertible", "$L$ has the pivots on its diagonal"], a: 1,
        expl: "Forwards, a multiple of row one is put into row two and then carried on into row three. Taking the inverses in the opposite order never composes the two steps, so each multiplier stays in its own slot." },
      { q: "With $E_{21}$ subtracting 2 of row one from row two and $E_{32}$ subtracting 5 of row two from row three, the entry of $E_{32}E_{21}$ in row 3, column 1 is:", num: 10,
        expl: "$(-5)\\cdot(-2) = 10$: two of row one went into row two, and five copies of that new row two went into row three." },
    ],
  },

  "math110.1.4": {
    takeaway: "A subspace is any set of vectors you cannot escape by adding or scaling, which is why every one of them contains the zero vector.",
    beats: [
      { t: "Row exchanges turn $A=LU$ into $PA=LU$", d: "If a zero lands in a pivot position, a permutation $P$ puts the rows into an order that works, and elimination proceeds as before. There are $n!$ such matrices, and each one's inverse is its transpose: $P^{T}P=I$." },
      { t: "Transposing swaps the indices", d: "$(A^{T})_{ij} = A_{ji}$ — a reflection across the main diagonal. A matrix unchanged by it is symmetric, and symmetric matrices will turn out to be the best-behaved ones in the course." },
      { t: "$R^{T}R$ is symmetric whatever $R$ is", d: "Transpose it: the order reverses, giving $R^{T}(R^{T})^{T}$, and transposing twice returns $R$. So the product equals its own transpose. Two lines, no arithmetic, and the same two cover $RR^{T}$." },
      { t: "A space is closed under combinations", d: "Adding two members stays inside; scaling a member by any real number stays inside. The first quadrant of the plane fails: it is fine under addition, but multiplying $(3,2)$ by $-5$ leaves it immediately." },
      { t: "Which forces the zero vector in", d: "Any member times 0 must still be a member. So a line through the origin is a subspace of $\\mathbb{R}^2$ and a parallel line beside it is not — and the whole plane, every line through the origin, and $\\{\\vec{0}\\}$ alone are the only three kinds." },
      { t: "A matrix gives you one for free: the column space", d: "Take the columns, take every linear combination of them, and what you get is closed by construction. Two independent columns in $\\mathbb{R}^3$ fill a plane through the origin — not all of $\\mathbb{R}^3$, and more than a line." },
    ],
    worked: "$R=\\begin{pmatrix}1&3\\\\2&3\\\\4&1\\end{pmatrix}$. Row 1 of $RR^{T}$ against column 3 is $1\\cdot4 + 3\\cdot1 = 7$; row 3 against column 1 is $4\\cdot1 + 1\\cdot3 = 7$ as well. Same two numbers, multiplied in the other order.",
    watch: "Calling a line in $\\mathbb{R}^2$ a copy of $\\mathbb{R}^1$. Its vectors have two components, so it lives inside $\\mathbb{R}^2$; only a line through the origin is even a subspace.",
    concepts: ["la-span"],
    checks: [
      { q: "The first quadrant of the plane is not a subspace because:", opts: ["It does not contain the zero vector", "Multiplying a member by a negative number leaves it", "Adding two members leaves it", "It is not a plane"], a: 1,
        expl: "It contains $\\vec{0}$ and it is closed under addition. What it fails is scaling: $-5\\cdot(3,2) = (-15,-10)$ is in the opposite quadrant, so the set is not closed under multiplication by every real number." },
      { q: "For $R=\\begin{pmatrix}1&3\\\\2&3\\\\4&1\\end{pmatrix}$, the entry of $RR^{T}$ in row 1, column 3 is:", num: 7,
        expl: "$(1,3)\\cdot(4,1) = 4+3 = 7$. The 3,1 entry is $(4,1)\\cdot(1,3)$, the same dot product — which is the whole reason $RR^{T}$ is symmetric." },
    ],
  },

});
