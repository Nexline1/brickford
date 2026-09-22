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

  "math110.1.5": {
    takeaway: "The column space says which right-hand sides are reachable; the null space says how many ways each reachable one can be reached.",
    beats: [
      { t: "A subspace is closed, and closure is the whole test", d: "Add two members, scale a member by any real number, and stay inside. A plane through the origin in $\\mathbb{R}^3$ passes; the union of a plane and a line through it fails, because one vector from each adds to something in neither." },
      { t: "An intersection is always a subspace", d: "If $\\vec{v}$ and $\\vec{w}$ lie in both $S$ and $T$, their sum lies in $S$ and in $T$, so it lies in both. The same argument handles scaling. Intersections shrink the set and keep the structure; unions do the reverse." },
      { t: "The column space is every combination of the columns", d: "For a four-by-three matrix the columns live in $\\mathbb{R}^4$, so $C(A)$ is a subspace of $\\mathbb{R}^4$ — but three vectors cannot fill four dimensions, so it is a proper subspace and most of $\\mathbb{R}^4$ is out of reach." },
      { t: "$A\\vec{x}=\\vec{b}$ is solvable exactly when $\\vec{b}$ is in $C(A)$", d: "That is not a theorem so much as a restatement: $A\\vec{x}$ IS a combination of the columns. If $\\vec{b}$ is one, the recipe is $\\vec{x}$; if it is not, no $\\vec{x}$ exists. Four equations in three unknowns are unsolvable for most $\\vec{b}$ and solvable for some." },
      { t: "A dependent column adds nothing", d: "In $\\begin{pmatrix}1&1&2\\\\2&1&3\\\\3&1&4\\\\4&1&5\\end{pmatrix}$ the third column is the first plus the second. Throw it away and the column space is unchanged: a plane in $\\mathbb{R}^4$, not a three-dimensional space." },
      { t: "The null space collects the $\\vec{x}$ with $A\\vec{x}=\\vec{0}$", d: "Here it is every multiple of $(1,1,-1)$ — a line in $\\mathbb{R}^3$. It is a subspace because $A\\vec{v}=A\\vec{w}=\\vec{0}$ forces $A(\\vec{v}+\\vec{w})=\\vec{0}$. The solutions of $A\\vec{x}=\\vec{b}$ for non-zero $\\vec{b}$ are not, since $\\vec{0}$ is not among them." },
    ],
    worked: "Two ways to name a subspace, and the two spaces use one each. Hand over some vectors and say take all combinations — that builds the column space. Hand over equations and say find everything that satisfies them — that carves out the null space.",
    watch: "Testing for a subspace by checking addition only. The first quadrant of the plane is closed under addition and still fails, because scaling by a negative number leaves it.",
    concepts: ["la-span", "la-rank-nullity"],
    checks: [
      { q: "The union of a plane and a line, both through the origin in $\\mathbb{R}^3$, is not a subspace because:", opts: ["It omits the zero vector", "A vector from the plane plus one from the line usually lies in neither", "It is not closed under scaling", "A plane and a line cannot intersect"], a: 1,
        expl: "Both pieces contain $\\vec{0}$ and both are closed under scaling. Addition is what breaks: the sum steps off the plane and off the line at once." },
      { q: "For $A=\\begin{pmatrix}1&1&2\\\\2&1&3\\\\3&1&4\\\\4&1&5\\end{pmatrix}$, the dimension of the column space is:", num: 2,
        expl: "Column three is column one plus column two, so it contributes nothing. The two that remain are independent, and $C(A)$ is a plane inside $\\mathbb{R}^4$." },
    ],
  },

  "math110.1.6": {
    takeaway: "Elimination does not change the null space, and what it leaves behind — the pivot columns — tells you exactly how many free choices the solutions have.",
    beats: [
      { t: "Elimination preserves the null space, not the column space", d: "Subtracting a multiple of one equation from another leaves the solution set alone, so $A\\vec{x}=\\vec{0}$ and $U\\vec{x}=\\vec{0}$ have the same answers. The columns themselves do move, so $C(U)$ is a different space from $C(A)$." },
      { t: "A zero in the pivot position with zeros beneath is not a failure", d: "In the square case it meant singular and you stopped. Rectangular, you shrug and move to the next column. What comes out is echelon form — a staircase, not a triangle — and the count of pivots is the rank $r$." },
      { t: "Pivot columns and free columns", d: "A column with a pivot has a pivot variable; a column without one has a free variable. Free means exactly what it says: assign it any value at all, and back substitution then fixes the pivot variables." },
      { t: "One special solution per free variable", d: "Set one free variable to 1 and the rest to 0, solve, and repeat for each. That gives $n-r$ vectors, and every vector in the null space is a combination of them. The count is the whole content of the algorithm." },
      { t: "Reduced row echelon form makes the answer readable", d: "Eliminate upwards as well and scale each pivot to 1. Now $R$ carries an identity in the pivot rows and columns, a free block $F$ beside it, and zero rows below — one for each row that was a combination of the others." },
      { t: "The special solutions are $-F$ stacked on $I$", d: "$R = \\begin{pmatrix}I&F\\end{pmatrix}$ and $R\\vec{x}=\\vec{0}$ reads $\\vec{x}_{pivot} = -F\\vec{x}_{free}$. Put the identity in the free rows and $-F$ appears above it. The back substitution has already been done; the sign flip is the only work." },
    ],
    worked: "$A=\\begin{pmatrix}1&2&2&2\\\\2&4&6&8\\\\3&6&8&10\\end{pmatrix}$. Column two is twice column one and row three is row one plus row two, so elimination finds two pivots and a zero row. Four columns, rank two: two free variables, two special solutions, and the null space is a plane.",
    watch: "Reading a row of zeros as a mistake in the arithmetic. It is a finding: that row was a combination of the others, and elimination is reporting it.",
    concepts: ["la-rank-nullity"],
    checks: [
      { q: "Elimination leaves the null space unchanged but changes the column space because:", opts: ["It changes the number of pivots", "Row operations preserve the solutions of $A\\vec{x}=\\vec{0}$ while moving the columns themselves", "The null space is always zero", "Only column operations matter"], a: 1,
        expl: "Subtracting one equation from another cannot gain or lose a solution. But the columns of $U$ are different vectors from the columns of $A$, so their combinations span a different space." },
      { q: "For $A=\\begin{pmatrix}1&2&2&2\\\\2&4&6&8\\\\3&6&8&10\\end{pmatrix}$, the number of special solutions is:", num: 2,
        expl: "Four columns and rank two, so $n-r = 4-2 = 2$ free variables — one special solution each." },
    ],
  },

  "math110.1.7": {
    takeaway: "Every solution of $A\\vec{x}=\\vec{b}$ is one particular solution plus anything from the null space, and the rank alone decides whether there are none, one, or infinitely many.",
    beats: [
      { t: "Carry $\\vec{b}$ through elimination as an extra column", d: "Work on the augmented matrix $[A\;|\;\\vec{b}]$ so the right-hand side gets every operation the left does. If a combination of rows gives a zero row, the same combination of $b$'s entries must give zero, or the system is inconsistent." },
      { t: "That is solvability, stated twice", d: "\"$\\vec{b}$ lies in the column space\" and \"every combination of rows that zeroes $A$ also zeroes $\\vec{b}$\" are the same condition from opposite sides. Elimination reports the second; the column picture explains the first." },
      { t: "The particular solution: set every free variable to zero", d: "That leaves a square system in the pivot variables, which back substitution solves. It is one solution among many, chosen because it is the cheapest one to write down." },
      { t: "Add the null space to get the rest", d: "$A\\vec{x}_p = \\vec{b}$ and $A\\vec{x}_n = \\vec{0}$, so $A(\\vec{x}_p + \\vec{x}_n) = \\vec{b}$ for every $\\vec{x}_n$. The complete solution is $\\vec{x}_p$ plus all combinations of the special solutions — and this pattern recurs everywhere linear equations do." },
      { t: "The solution set is a shifted subspace", d: "The null space is a subspace through the origin; the solution set is that same flat object translated to sit on $\\vec{x}_p$. It does not contain $\\vec{0}$, so it is not a subspace — which is why no constant may multiply $\\vec{x}_p$." },
      { t: "Rank decides the count before any arithmetic", d: "$r=m=n$: invertible, exactly one. $r=n \\lt m$: no free variables, so zero or one. $r=m \\lt n$: no zero rows, so always at least one, hence infinitely many. $r \\lt m$ and $r \\lt n$: zero or infinitely many." },
    ],
    worked: "$A=\\begin{pmatrix}1&2&2&2\\\\2&4&6&8\\\\3&6&8&10\\end{pmatrix}$ with $\\vec{b}=(1,5,6)$: row three is row one plus row two and $1+5=6$, so it is solvable. Set $x_2=x_4=0$, leaving $x_1+2x_3=1$ and $2x_3=3$, so $\\vec{x}_p = (-2,0,\\tfrac{3}{2},0)$.",
    watch: "Putting a free constant in front of $\\vec{x}_p$. Scaling it breaks $A\\vec{x}_p=\\vec{b}$; only the null space part is free to be multiplied and added.",
    concepts: ["la-rank-nullity"],
    checks: [
      { q: "The set of solutions to $A\\vec{x}=\\vec{b}$ with $\\vec{b}\\neq\\vec{0}$ is:", opts: ["A subspace", "The null space shifted so it passes through one particular solution", "Always a single point", "Always empty"], a: 1,
        expl: "It is the null space translated by $\\vec{x}_p$ — the same shape and the same dimension, but not through the origin, so it fails the definition of a subspace." },
      { q: "For that $A$ and $\\vec{b}=(1,5,6)$, the first component of the particular solution with free variables set to zero is:", num: -2,
        expl: "$2x_3 = 3$ gives $x_3 = \\tfrac{3}{2}$, and then $x_1 = 1 - 2\\cdot\\tfrac{3}{2} = -2$." },
    ],
  },

  "math110.1.8": {
    takeaway: "A basis is the set of vectors that is neither redundant nor short, and every basis for a given space turns out to have the same size.",
    beats: [
      { t: "More unknowns than equations guarantees a non-zero solution", d: "With $n > m$ there are at most $m$ pivots, so at least one free variable survives. Give it the value 1 and back substitution produces a vector in the null space that is not $\\vec{0}$. The whole lecture rests on this." },
      { t: "Independence means the only combination giving $\\vec{0}$ is the trivial one", d: "Put the vectors in the columns of a matrix and the definition becomes a question about $N(A)$: independent when the null space holds only $\\vec{0}$, dependent when it holds anything else. Any set containing $\\vec{0}$ is dependent immediately." },
      { t: "Spanning means the combinations reach everything", d: "The columns of a matrix span its column space — that is what the column space is. Spanning says the set is large enough; independence says it is not too large. Neither implies the other." },
      { t: "A basis is both at once", d: "Independent and spanning. Hand someone a basis for a subspace and you have told them everything about it. For $\\mathbb{R}^n$, $n$ vectors form a basis exactly when the square matrix holding them is invertible." },
      { t: "There are infinitely many bases, all the same size", d: "Any invertible $3\\times3$ matrix has columns that are a basis for $\\mathbb{R}^3$. What every basis for a space shares is its count — and that number is the space's dimension." },
      { t: "Rank is a dimension, and so is the number of free variables", d: "The pivot columns are a basis for $C(A)$, so $\\dim C(A) = r$. The special solutions are a basis for $N(A)$, so $\\dim N(A) = n-r$. A matrix has a rank; a space has a dimension — the words do not swap." },
    ],
    worked: "A shortcut worth having: once you know the dimension is 2, any two independent vectors from the space are automatically a basis. If they failed to span, a third independent vector would exist — and that would make the dimension bigger than 2.",
    watch: "Saying \"the dimension of the matrix\" or \"the rank of the subspace\". A matrix has a rank; a space has a dimension. The rank of $A$ is the dimension of $C(A)$.",
    concepts: ["la-independence", "la-basis", "la-rank-nullity"],
    checks: [
      { q: "Three vectors in $\\mathbb{R}^2$ are:", opts: ["Always independent", "Always dependent, because the $2\\times3$ matrix holding them must have a free variable", "Independent if none is zero", "A basis for $\\mathbb{R}^2$"], a: 1,
        expl: "Two rows allow at most two pivots, so one of the three columns is free. Setting it to 1 produces a non-zero combination of the three that gives $\\vec{0}$." },
      { q: "For $A=\\begin{pmatrix}1&2&3&1\\\\1&1&2&1\\\\1&2&3&1\\end{pmatrix}$, the dimension of the null space is:", num: 2,
        expl: "Column three is column one plus column two and column four repeats column one, so the rank is 2. Then $n-r = 4-2 = 2$, which is also the number of special solutions." },
    ],
  },

  "math110.1.9": {
    takeaway: "A matrix carries four subspaces, and their dimensions are fixed by the rank alone: $r$, $n-r$, $r$ and $m-r$.",
    beats: [
      { t: "Two spaces in $\\mathbb{R}^n$, two in $\\mathbb{R}^m$", d: "The null space and the row space hold vectors with $n$ components; the column space and the left null space hold vectors with $m$ components. The row space is written $C(A^{T})$ so everything stays a column." },
      { t: "The row space has the same dimension as the column space", d: "Both are $r$. That is the lecture's one surprising claim, and it settles questions the columns alone hide: a $3\\times3$ matrix with two equal rows has rank 2, so its three columns cannot be independent, however unrelated they look." },
      { t: "Row reduction destroys the column space and preserves the row space", d: "Every row operation takes combinations of rows, so nothing leaves the row space and the steps reverse. The columns, meanwhile, are genuinely different vectors — $C(R)\\neq C(A)$." },
      { t: "So $R$ hands you the best basis for the row space", d: "The first $r$ rows of $R$ — of $R$, not of $A$. The pivot columns of $A$ — of $A$, not of $R$ — are the basis for the column space. The two spaces read off opposite matrices, and swapping them is the standard mistake." },
      { t: "The special solutions are a basis for the null space", d: "One per free variable, so $\\dim N(A) = n-r$. With $\\dim C(A^{T}) = r$, the two subspaces of $\\mathbb{R}^n$ account for all $n$ — which is just the pivot-and-free split of the variables, stated as dimensions.", fig: "figRankNullity" },
      { t: "The left null space needs $E$, not $R$", d: "$\\vec{y}$ with $A^{T}\\vec{y}=\\vec{0}$ is $\\vec{y}^{T}A = \\vec{0}^{T}$ transposed: a combination of ROWS giving the zero row. Run Gauss-Jordan on $[A\;|\;I]$; the $E$ that appears satisfies $EA=R$, and its last $m-r$ rows are that basis." },
    ],
    worked: "Vector spaces need not hold arrows. The $3\\times3$ matrices form one — they add and scale, and nothing asks them to multiply. Upper triangular is a subspace, symmetric is another, and their intersection is the diagonal matrices, of dimension 3.",
    watch: "Taking the basis of the row space from $A$ and the basis of the column space from $R$. It is the other way round: $R$'s rows span the same row space, but $R$'s columns do not span $C(A)$.",
    concepts: ["la-rank-nullity", "la-basis"],
    checks: [
      { q: "Row reduction preserves the row space but not the column space because:", opts: ["It changes the rank", "Each step replaces a row by a combination of rows, and the steps reverse", "The columns are never touched", "$R$ has fewer rows than $A$"], a: 1,
        expl: "Every new row is a combination of the old ones and the operations undo, so the spans match exactly. The columns of $R$ are different vectors from the columns of $A$, so their span differs too." },
      { q: "For $A=\\begin{pmatrix}1&2&3&1\\\\1&1&2&1\\\\1&2&3&1\\end{pmatrix}$, the dimension of the left null space is:", num: 1,
        expl: "$m-r = 3-2 = 1$. Row three equals row one, so a single combination — row three minus row one — gives the zero row." },
    ],
  },

  "math110.1.10": {
    takeaway: "Rank-one matrices are exactly the products $\\vec{u}\\vec{v}^{T}$, and every matrix of rank $r$ is a sum of $r$ of them — which is why they are the building blocks.",
    beats: [
      { t: "Matrices form a vector space of their own", d: "The $3\\times3$ matrices add and scale, so they are vectors, and nothing forces you to multiply them. The dimension is 9. Symmetric and upper triangular are subspaces of dimension 6 each — but only the upper triangular one is spanned by members of the obvious basis." },
      { t: "Intersection and sum, never union", d: "$S\\cap U$ is the diagonal matrices, dimension 3. The union is not a subspace; the SUM — every symmetric plus every upper triangular — is, and it is all of $M$. The dimensions balance: $6+6 = 3+9$." },
      { t: "Solutions of a differential equation are a vector space too", d: "$y''+y=0$ has solution space spanned by $\\cos x$ and $\\sin x$ — dimension 2, because the equation is second order. Those are the special solutions of a null space, and finding a basis for it is what a course in linear differential equations is." },
      { t: "Rank one means one column times one row", d: "$\\begin{pmatrix}1&4&5\\\\2&8&10\\end{pmatrix} = \\begin{pmatrix}1\\\\2\\end{pmatrix}\\begin{pmatrix}1&4&5\\end{pmatrix}$. Every rank-one matrix has this form $\\vec{u}\\vec{v}^{T}$, and a rank-four matrix is a sum of four such pieces." },
      { t: "But the rank-one matrices are not a subspace", d: "Add two of them and the rank is usually 2. In general $\\mathrm{rank}(A+B)\\le \\mathrm{rank}(A)+\\mathrm{rank}(B)$, so a fixed rank is never preserved by addition. Being a building block and being closed are different properties." },
      { t: "A condition on the entries is a null space in disguise", d: "The vectors in $\\mathbb{R}^4$ whose components sum to zero are $N(A)$ for the one-row matrix $A = \\begin{pmatrix}1&1&1&1\\end{pmatrix}$. Rank 1, so the dimension is $4-1=3$, and the three special solutions are its basis." },
    ],
    worked: "The four subspaces of $\\begin{pmatrix}1&1&1&1\\end{pmatrix}$, all at once. Row space: one dimension in $\\mathbb{R}^4$. Null space: three. Column space: all of $\\mathbb{R}^1$. Left null space: just $\\vec{0}$, dimension 0, basis the empty set. $3+1=4$ and $1+0=1$.",
    watch: "Expecting the rank-$k$ matrices to form a subspace because the rank-one ones are so simple. Sums raise the rank, so only the zero matrix survives in every case.",
    concepts: ["la-rank-nullity", "la-basis"],
    checks: [
      { q: "A matrix has rank one exactly when it can be written as:", opts: ["A diagonal matrix", "One column times one row, $\\vec{u}\\vec{v}^{T}$", "A sum of two rank-one matrices", "A square matrix with one pivot"], a: 1,
        expl: "Every column is then a multiple of $\\vec{u}$ and every row a multiple of $\\vec{v}^{T}$, so the column space and the row space are both lines — rank one, and it need not be square." },
      { q: "The vectors in $\\mathbb{R}^4$ whose four components sum to zero form a subspace of dimension:", num: 3,
        expl: "They are the null space of the rank-one matrix $\\begin{pmatrix}1&1&1&1\\end{pmatrix}$, so the dimension is $n-r = 4-1 = 3$." },
    ],
  },

  "math110.1.11": {
    takeaway: "An incidence matrix turns a graph into linear algebra, and then each of the four subspaces says something you could have read off the picture.",
    beats: [
      { t: "One row per edge, two non-zeros in it", d: "Edge from node $i$ to node $j$ gets $-1$ in column $i$ and $+1$ in column $j$. A big graph gives a big, very sparse matrix — exactly $2m$ non-zeros — and that structure is what real applications hand you instead of invented examples." },
      { t: "$A\\vec{x}$ computes potential differences", d: "Read $\\vec{x}$ as a potential at each node. Then row $k$ of $A\\vec{x}$ is the drop across edge $k$. The matrix is a difference operator, and everything that follows is about when those differences vanish or balance." },
      { t: "The null space is the constant potentials", d: "$A\\vec{x}=\\vec{0}$ means every difference is zero, so $\\vec{x} = c(1,1,\\dots,1)$ — one dimension, and the rank is $n-1$. Physically: potential is only defined up to a constant, which is why you ground a node." },
      { t: "Dependent rows are loops", d: "Edges 1, 2 and 3 form a loop, and row one plus row two gives row three. Independent rows are a set of edges with no loop — which is a tree. That is the same statement twice, once in algebra and once in graph theory." },
      { t: "The left null space is Kirchhoff's Current Law", d: "$A^{T}\\vec{y}=\\vec{0}$ says the flow into each node equals the flow out. Its basis is one current circulating around each independent loop, and $\\dim = m-r$ counts them. Currents round the big outer loop are the sum of two small ones, not a third basis vector." },
      { t: "The dimension formula is Euler's formula", d: "$m-r$ loops and $r = n-1$ give $\\text{nodes} - \\text{edges} + \\text{loops} = 1$ for every graph. Linear algebra proves a topological fact, and the framework $\\vec{x}\\to A\\vec{x}\\to C A\\vec{x} \\to A^{T}CA\\vec{x}$ is the shape of equilibrium problems generally." },
    ],
    worked: "Five edges and four nodes: $A=\\begin{pmatrix}-1&1&0&0\\\\0&-1&1&0\\\\-1&0&1&0\\\\-1&0&0&1\\\\0&0&-1&1\\end{pmatrix}$. Rank 3, null space one-dimensional, left null space two-dimensional — and $4-5+2=1$, as Euler requires.",
    watch: "Counting every loop you can see as an independent one. Current round the outer loop is the sum of the currents round two inner loops, so only $m-r$ of them belong in a basis.",
    concepts: ["la-rank-nullity"],
    checks: [
      { q: "The null space of a connected graph's incidence matrix is:", opts: ["Only the zero vector", "All constant potential vectors $c(1,1,\\dots,1)$", "The currents satisfying Kirchhoff's law", "The whole of $\\mathbb{R}^n$"], a: 1,
        expl: "Every entry of $A\\vec{x}$ is a difference of two potentials, and all differences vanish exactly when the potentials are equal. Hence rank $n-1$, and grounding one node removes the ambiguity." },
      { q: "For that five-edge, four-node graph, the number of independent loops is:", num: 2,
        expl: "$m-r = 5-3 = 2$, which is the dimension of the left null space — one basis current per independent loop." },
    ],
  },

  "math110.1.13": {
    takeaway: "The row space and the null space are not merely different subspaces: they meet at right angles and between them account for the whole of $\\mathbb{R}^n$.",
    beats: [
      { t: "The dot product is the test, and Pythagoras is the reason", d: "$\\vec{x}$ and $\\vec{y}$ are orthogonal when $\\vec{x}^{T}\\vec{y}=0$. Expand $\\|\\vec{x}\\|^2+\\|\\vec{y}\\|^2 = \\|\\vec{x}+\\vec{y}\\|^2$ and everything cancels except $2\\vec{x}^{T}\\vec{y}$, so the right triangle and the vanishing dot product are the same condition." },
      { t: "Orthogonal subspaces need EVERY pair to be orthogonal", d: "The blackboard and the floor are not orthogonal: they share a line along their crack, and a non-zero vector is never orthogonal to itself. Two subspaces that are orthogonal meet only at $\\vec{0}$ — though meeting only at $\\vec{0}$ is not by itself enough." },
      { t: "$A\\vec{x}=\\vec{0}$ already says the null space is orthogonal to the rows", d: "Written out, that equation is row one dotted with $\\vec{x}$ gives 0, row two dotted with $\\vec{x}$ gives 0, and so on down. Scaling and adding those statements extends it from the rows to every combination of them — the whole row space." },
      { t: "Complement, not merely orthogonal", d: "The dimensions add to $n$: $r$ and $n-r$. Two perpendicular lines in $\\mathbb{R}^3$ cannot be a row space and a null space, because $1+1\\neq3$. The null space contains ALL vectors perpendicular to the row space, not just some." },
      { t: "Which is why $A\\vec{x}=\\vec{b}$ with no solution is the next problem", d: "A thousand measurements of a satellite's position against six parameters: $\\vec{b}$ carries noise and will not sit in the column space. Throwing away equations until the system is square discards information; the point is to use all of it." },
      { t: "$A^{T}A$ is the matrix that answers it", d: "Square, symmetric — $(A^{T}A)^{T} = A^{T}A$ — and the equation to solve becomes $A^{T}A\\hat{x} = A^{T}\\vec{b}$. It is invertible exactly when $A$ has independent columns, because $N(A^{T}A) = N(A)$." },
    ],
    worked: "$A=\\begin{pmatrix}1&1\\\\1&2\\\\1&5\\end{pmatrix}$ gives $A^{T}A = \\begin{pmatrix}3&8\\\\8&30\\end{pmatrix}$, invertible. Replace the second column with $(1,2,5)$ doubled and the columns become dependent — then $A^{T}A$ has rank 1 and no inverse.",
    watch: "Reading \"the subspaces do not intersect\" as \"the subspaces are orthogonal\". Sharing only $\\vec{0}$ is necessary and not sufficient; every vector in one must be perpendicular to every vector in the other.",
    concepts: ["la-rank-nullity"],
    checks: [
      { q: "$A^{T}A$ is invertible exactly when:", opts: ["$A$ is square", "The columns of $A$ are independent", "$A$ is symmetric", "$A$ has more rows than columns"], a: 1,
        expl: "$N(A^{T}A) = N(A)$, so $A^{T}A$ has only $\\vec{0}$ in its null space precisely when $A$ does — which is what independent columns means. $A$ itself need not be square or invertible." },
      { q: "For $A=\\begin{pmatrix}1&1\\\\1&2\\\\1&5\\end{pmatrix}$, the entry of $A^{T}A$ in row 2, column 2 is:", num: 30,
        expl: "It is the second column dotted with itself: $1+4+25 = 30$. Every diagonal entry of $A^{T}A$ is a squared length, which is why they are never negative." },
    ],
  },

  "math110.1.14": {
    takeaway: "Projection is what you do when $A\\vec{x}=\\vec{b}$ has no solution: replace $\\vec{b}$ by the nearest point of the column space and solve that instead.",
    beats: [
      { t: "One line first, and the right angle does all the work", d: "The projection of $\\vec{b}$ onto the line through $\\vec{a}$ is $\\vec{p}=\\hat{x}\\vec{a}$, and the error $\\vec{b}-\\hat{x}\\vec{a}$ must be perpendicular to $\\vec{a}$. That single condition gives $\\hat{x}=\\dfrac{\\vec{a}^{T}\\vec{b}}{\\vec{a}^{T}\\vec{a}}$ — no angles, no cosines.", fig: "figProjection" },
      { t: "Put the parentheses elsewhere and a matrix appears", d: "$\\vec{p} = \\vec{a}\\dfrac{\\vec{a}^{T}\\vec{b}}{\\vec{a}^{T}\\vec{a}} = \\left(\\dfrac{\\vec{a}\\vec{a}^{T}}{\\vec{a}^{T}\\vec{a}}\\right)\\vec{b}$. The top is a column times a row, so $P$ is a rank-one matrix whose column space is that line. Doubling $\\vec{b}$ doubles $\\vec{p}$; doubling $\\vec{a}$ changes nothing, since the line is the same." },
      { t: "Two properties identify every projection matrix", d: "$P^{T}=P$ and $P^{2}=P$. The second is geometry, not algebra: project once and you are on the subspace; project again and you do not move. Anything already in the subspace is its own projection." },
      { t: "In higher dimensions the subspace is a column space", d: "Give a basis $\\vec{a}_1,\\vec{a}_2$ and make them the columns of $A$. The projection is $A\\hat{x}$, and the error must be perpendicular to both columns — which is exactly $A^{T}(\\vec{b}-A\\hat{x}) = \\vec{0}$." },
      { t: "Which places the error in the left null space", d: "$A^{T}\\vec{e}=\\vec{0}$ says $\\vec{e}\\in N(A^{T})$, and the previous lecture showed $N(A^{T})$ is orthogonal to $C(A)$. The equation derived from geometry and the four-subspace picture agree, which is the check that it is right." },
      { t: "So $P = A(A^{T}A)^{-1}A^{T}$, and you may not simplify it", d: "Splitting $(A^{T}A)^{-1}$ into $A^{-1}(A^{T})^{-1}$ collapses $P$ to $I$ — which is correct only when $A$ is square and invertible, where the column space IS the whole space. A rectangular $A$ has no inverse to split." },
    ],
    worked: "Fitting a line to $(1,1)$, $(2,2)$, $(3,2)$. The equations $C+D=1$, $C+2D=2$, $C+3D=2$ have no solution, so $A=\\begin{pmatrix}1&1\\\\1&2\\\\1&3\\end{pmatrix}$, $\\vec{b}=(1,2,2)$, and you solve $A^{T}A\\hat{x}=A^{T}\\vec{b}$ instead.",
    watch: "Cancelling $(A^{T}A)^{-1}$ into $A^{-1}(A^{T})^{-1}$. It gives $P=I$ — projection onto everything — and it is only legal when $A$ is square, which is the one case you never needed a projection for.",
    concepts: ["la-projection"],
    checks: [
      { q: "A projection matrix satisfies $P^{2}=P$ because:", opts: ["$P$ is always the identity", "A point already on the subspace is its own projection, so the second projection moves nothing", "$P$ has rank one", "$P$ is invertible"], a: 1,
        expl: "The first projection lands in the subspace; projecting a point of the subspace returns it unchanged. Together with $P^{T}=P$, this pair identifies projection matrices." },
      { q: "Projecting $\\vec{b}=(1,2,3)$ onto the line through $\\vec{a}=(1,1,1)$, the multiplier $\\hat{x}$ is:", num: 2,
        expl: "$\\hat{x} = \\dfrac{\\vec{a}^{T}\\vec{b}}{\\vec{a}^{T}\\vec{a}} = \\dfrac{1+2+3}{1+1+1} = \\dfrac{6}{3} = 2$, so the projection is $(2,2,2)$ and the error $(-1,0,1)$ is perpendicular to $\\vec{a}$." },
    ],
  },

  "math110.1.15": {
    takeaway: "Least squares is a projection: the best line is the one whose predicted values are the projection of the data onto the column space.",
    beats: [
      { t: "The two extremes check the formula", d: "If $\\vec{b}$ is already in $C(A)$ it is $A\\vec{x}$, and $A(A^{T}A)^{-1}A^{T}A\\vec{x}$ collapses to $A\\vec{x}=\\vec{b}$. If $\\vec{b}\\perp C(A)$ it is in $N(A^{T})$, so the trailing $A^{T}\\vec{b}$ is $\\vec{0}$. Projection keeps one part and kills the other." },
      { t: "$I-P$ projects onto the perpendicular space", d: "It is symmetric and squares to itself for the same reasons $P$ does. $\\vec{b}$ splits as $\\vec{p}+\\vec{e}$: the piece in the column space and the piece in the left null space." },
      { t: "Two pictures of one problem", d: "In the data plot, $e_1,e_2,e_3$ are the vertical gaps between the points and the line. In the vector picture, they are the components of one error vector perpendicular to $C(A)$. Minimising $\\|\\vec{e}\\|^{2}$ is the same act in both." },
      { t: "Calculus and linear algebra give the same equations", d: "Set $\\partial/\\partial C$ and $\\partial/\\partial D$ of the summed squared error to zero, and the two linear equations you get are $A^{T}A\\hat{x}=A^{T}\\vec{b}$ written out. They are called the normal equations." },
      { t: "Squaring is a choice, and it has a cost", d: "One wild measurement contributes its error squared, so a single outlier can drag the whole line. Least squares is the most used criterion and not the only one; statisticians identify outliers rather than let them dominate." },
      { t: "Why $A^{T}A$ is invertible when the columns are independent", d: "Suppose $A^{T}A\\vec{x}=\\vec{0}$. Multiply by $\\vec{x}^{T}$: $(A\\vec{x})^{T}(A\\vec{x}) = 0$, a squared length, so $A\\vec{x}=\\vec{0}$. Independent columns then force $\\vec{x}=\\vec{0}$, so the null space is trivial." },
    ],
    worked: "The points $(1,1)$, $(2,2)$, $(3,2)$ give $\\begin{pmatrix}3&6\\\\6&14\\end{pmatrix}\\hat{x} = \\begin{pmatrix}5\\\\11\\end{pmatrix}$, so $C=\\tfrac{2}{3}$ and $D=\\tfrac{1}{2}$. The fitted values are $\\tfrac{7}{6},\\tfrac{5}{3},\\tfrac{13}{6}$ and the errors $-\\tfrac16,\\tfrac26,-\\tfrac16$ — perpendicular to both columns.",
    watch: "Checking only that $\\vec{e}$ is perpendicular to $\\vec{p}$. It is perpendicular to the whole column space, so it must also be orthogonal to $(1,1,1)$ and to $(1,2,3)$ separately.",
    concepts: ["la-projection"],
    checks: [
      { q: "$A^{T}A\\vec{x}=\\vec{0}$ forces $\\vec{x}=\\vec{0}$ when the columns of $A$ are independent because:", opts: ["$A^{T}A$ is symmetric", "$\\vec{x}^{T}A^{T}A\\vec{x} = \\|A\\vec{x}\\|^{2}$, so $A\\vec{x}=\\vec{0}$, and independence finishes it", "$A$ is square", "$A^{T}A$ is the identity"], a: 1,
        expl: "Multiplying through by $\\vec{x}^{T}$ turns the equation into a squared length equal to zero, which forces $A\\vec{x}=\\vec{0}$. Independent columns mean $N(A)=\\{\\vec{0}\\}$, so $\\vec{x}$ is zero." },
      { q: "For the points $(1,1)$, $(2,2)$, $(3,2)$, the slope $D$ of the least-squares line is:", num: 0.5,
        expl: "The normal equations $3C+6D=5$ and $6C+14D=11$ give $2D=1$ after eliminating $C$, so $D=\\tfrac12$ and then $C=\\tfrac23$." },
    ],
  },

  "math110.1.16": {
    takeaway: "With an orthonormal basis every formula in this chapter collapses, and Gram-Schmidt is the procedure that manufactures one from any independent set.",
    beats: [
      { t: "$Q^{T}Q=I$ is the whole definition, written as a matrix", d: "Row $i$ of $Q^{T}$ times column $j$ of $Q$ is $\\vec{q}_i^{T}\\vec{q}_j$ — one on the diagonal, zero off it. $Q$ need not be square for this; when it IS square the identity also says $Q^{T}=Q^{-1}$, and only then is it called an orthogonal matrix." },
      { t: "The projection matrix loses its inverse", d: "$P = Q(Q^{T}Q)^{-1}Q^{T}$ becomes simply $QQ^{T}$. It is still symmetric, and $QQ^{T}QQ^{T} = QQ^{T}$ because $Q^{T}Q=I$ sits in the middle. If $Q$ is square the column space is everything and $P=I$." },
      { t: "The normal equations become a list of dot products", d: "$Q^{T}Q\\hat{x}=Q^{T}\\vec{b}$ is just $\\hat{x} = Q^{T}\\vec{b}$: the $i$-th coordinate is $\\vec{q}_i^{T}\\vec{b}$. Nothing to invert, nothing to solve — the component along a basis vector is a dot product with it." },
      { t: "Gram-Schmidt: keep the first, correct the second", d: "$\\vec{A}=\\vec{a}$. Then $\\vec{B} = \\vec{b} - \\dfrac{\\vec{A}^{T}\\vec{b}}{\\vec{A}^{T}\\vec{A}}\\vec{A}$ — the original vector minus its projection, which is the error vector from the projection lecture. Check it: $\\vec{A}^{T}\\vec{B}$ cancels to zero." },
      { t: "The third subtracts two projections, and so on", d: "$\\vec{C} = \\vec{c} - \\dfrac{\\vec{A}^{T}\\vec{c}}{\\vec{A}^{T}\\vec{A}}\\vec{A} - \\dfrac{\\vec{B}^{T}\\vec{c}}{\\vec{B}^{T}\\vec{B}}\\vec{B}$. Divide each result by its length at the end; that division is where the square roots come from." },
      { t: "In matrix form it is $A=QR$, and $R$ is triangular", d: "The same column space, a better basis for it. $R$ is upper triangular because each new $\\vec{q}$ was built to be orthogonal to every EARLIER $\\vec{a}$, so the entries below the diagonal are $\\vec{a}_1^{T}\\vec{q}_2$ and their kind — all zero." },
    ],
    worked: "$\\vec{a}=(1,1,1)$ and $\\vec{b}=(1,0,2)$. Here $\\vec{a}^{T}\\vec{b}=3$ and $\\vec{a}^{T}\\vec{a}=3$, so subtract one copy: $\\vec{B}=(1,0,2)-(1,1,1)=(0,-1,1)$. Divide by $\\sqrt{3}$ and $\\sqrt{2}$ and the columns of $Q$ are done.",
    watch: "Orthogonalising against the ORIGINAL vectors instead of the ones already produced. Each subtraction must use $\\vec{A}$ and $\\vec{B}$ as corrected, or the result is not perpendicular to anything.",
    concepts: ["la-projection", "la-basis"],
    checks: [
      { q: "In $A=QR$, the matrix $R$ is upper triangular because:", opts: ["$Q$ is square", "Each $\\vec{q}_j$ was constructed orthogonal to every earlier $\\vec{a}_i$, so those entries vanish", "$R$ is a permutation", "Gram-Schmidt reverses the column order"], a: 1,
        expl: "The entry below the diagonal in column one is $\\vec{a}_1^{T}\\vec{q}_2$, and $\\vec{q}_2$ was built by subtracting off exactly the $\\vec{a}_1$ direction. Every such entry is zero, leaving a triangle." },
      { q: "Gram-Schmidt on $\\vec{a}=(1,1,1)$ and $\\vec{b}=(1,0,2)$ gives $\\vec{B}$ whose second component is:", num: -1,
        expl: "$\\dfrac{\\vec{a}^{T}\\vec{b}}{\\vec{a}^{T}\\vec{a}} = \\dfrac{3}{3} = 1$, so $\\vec{B} = (1,0,2)-(1,1,1) = (0,-1,1)$, and $\\vec{a}^{T}\\vec{B} = 0-1+1 = 0$ as required." },
    ],
  },

  "math110.1.17": {
    takeaway: "Three properties define the determinant completely, and everything else — including the formula and the test for invertibility — is deduced from them.",
    beats: [
      { t: "The three that define it", d: "$\\det I = 1$; exchanging two rows reverses the sign; and the determinant is linear in each row SEPARATELY, meaning one row may be scaled or split while the others are held fixed. A big formula up front would hide where all this comes from." },
      { t: "Not linear in the matrix", d: "$\\det(A+B) \\neq \\det A + \\det B$. The linearity is one row at a time. That is also why $\\det(2A) = 2^{n}\\det A$ for an $n\\times n$ matrix: a factor of 2 comes out of each of the $n$ rows." },
      { t: "Equal rows force zero, by an argument with no arithmetic in it", d: "Exchange the two identical rows. The matrix is unchanged, so the determinant is unchanged; but property two says the sign flipped. A number equal to its own negative is zero." },
      { t: "Which is why elimination does not change it", d: "Subtracting $\\ell$ times one row from another splits, by linearity, into the original determinant plus $-\\ell$ times a determinant with two equal rows — and that second piece is zero. So $\\det A = \\det U$." },
      { t: "A triangular determinant is the product of the pivots", d: "Clear the entries above the diagonal by elimination, factor each $d_i$ out of its row, and what remains is $\\det I = 1$. That is how software actually computes a determinant: eliminate, then multiply the pivots, watching the sign for row exchanges." },
      { t: "Multiplicative, and blind to transposing", d: "$\\det(AB) = \\det A \\det B$, so $\\det(A^{-1}) = 1/\\det A$ and $\\det(A^{2}) = (\\det A)^{2}$. And $\\det A^{T} = \\det A$, which quietly converts every row property in the list into a column property." },
    ],
    worked: "So $\\det A = 0$ exactly when $A$ is singular. Elimination either reaches a full set of pivots, whose product is non-zero, or produces a row of zeros, which by linearity with factor 0 makes the determinant zero. Nothing else can happen.",
    watch: "Extending linearity to the whole matrix. One row may be split or scaled with the others fixed; doubling every row multiplies the determinant by $2^{n}$, not by 2.",
    concepts: ["la-determinant"],
    checks: [
      { q: "A matrix with two identical rows has determinant zero because:", opts: ["Its rows are unit vectors", "Exchanging them leaves the matrix alone but must flip the sign, and only 0 equals its own negative", "The identity has determinant 1", "Elimination always fails"], a: 1,
        expl: "It uses property two and nothing else. The same argument covers any size of matrix, which is why the three properties are stated before any formula." },
      { q: "If $A = \\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$, then $\\det(2A)$ is:", num: -8,
        expl: "$\\det A = 4-6 = -2$, and a factor of 2 comes out of each of the two rows: $2^{2}\\cdot(-2) = -8$. Directly, $\\det\\begin{pmatrix}2&4\\\\6&8\\end{pmatrix} = 16-24 = -8$." },
    ],
  },

  "math110.1.18": {
    takeaway: "Splitting every row into its coordinates turns the three properties into a formula with $n!$ terms, and grouping those terms by the first row gives cofactors.",
    beats: [
      { t: "Split each row, then discard almost everything", d: "Write each row as a sum of $n$ vectors with one non-zero entry. Linearity turns the determinant into $n^{n}$ pieces, and every piece that repeats a column has a column of zeros — dead. Only the pieces using each column once survive." },
      { t: "So the survivors are the permutations, and there are $n!$", d: "Pick the first row's column $n$ ways, the second row's $n-1$ ways, and so on. Each survivor factors out to a product $a_{1\\alpha}a_{2\\beta}\\cdots a_{n\\omega}$ with $\\alpha,\\beta,\\dots,\\omega$ a permutation of $1..n$." },
      { t: "The sign is the parity of that permutation", d: "Plus if an even number of row exchanges returns it to order, minus if odd. Half the terms carry each sign. The $3\\times3$ trick of diagonals going one way and the other is genuinely $3\\times3$ only: the anti-diagonal of a $4\\times4$ takes two exchanges, so it is plus." },
      { t: "Collect the terms containing $a_{1j}$ and a smaller determinant appears", d: "Once row 1 and column $j$ are used, what is left is every way of choosing one entry from each remaining row and column — which is exactly the determinant of the $(n-1)\\times(n-1)$ matrix with that row and column struck out." },
      { t: "A cofactor is that minor with its sign built in", d: "$C_{ij} = \\pm\\det(\\text{matrix with row } i, \\text{ column } j \\text{ deleted})$, plus when $i+j$ is even. The signs alternate like a checkerboard, so a cofactor expansion along row 2 starts with a minus." },
      { t: "Three formulas, three temperaments", d: "The pivots have all the work already done by elimination. The big formula has it spread across $n!$ terms. Cofactors sit between: easy factors times smaller determinants, which is what makes recursion possible." },
    ],
    worked: "The tridiagonal matrix of ones. Expanding along the first row twice gives $D_n = D_{n-1} - D_{n-2}$, so from $D_1=1$ and $D_2=0$ the sequence runs $1, 0, -1, -1, 0, 1$ — and then repeats. These determinants have period 6, so $D_{61} = D_1 = 1$.",
    watch: "Learning the $3\\times3$ picture of down-right diagonals as plus and down-left as minus. It is a coincidence of size three; at $4\\times4$ the anti-diagonal is plus, and only the parity rule survives.",
    concepts: ["la-determinant"],
    checks: [
      { q: "The big formula has $n!$ terms because:", opts: ["Each term is a pivot", "Each surviving term uses one entry from every row and every column, which is a permutation", "Half the terms are negative", "The matrix has $n^{2}$ entries"], a: 1,
        expl: "A term repeating a column has a column of zeros and vanishes. What remains is one choice per row with all columns distinct — a permutation of $1..n$, and there are $n!$ of those." },
      { q: "The $4\\times4$ tridiagonal matrix of ones (ones on the diagonal and on both neighbouring diagonals, zeros elsewhere) has determinant:", num: -1,
        expl: "$D_4 = D_3 - D_2 = (-1) - 0 = -1$. Elimination on the matrix itself gives the same answer, which is the check that the recursion was set up correctly." },
    ],
  },

  "math110.1.19": {
    takeaway: "The determinant turns three algorithms into formulas — the inverse, the solution, and the volume — and only the last of the three is worth computing that way.",
    beats: [
      { t: "$A^{-1} = \\dfrac{1}{\\det A}C^{T}$", d: "$C$ is the matrix of cofactors, and it is TRANSPOSED. For $2\\times2$ this reproduces the familiar $\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$: the $d$ is the 1,1 cofactor and the $-b$ is the cofactor of $c$, moved by the transpose." },
      { t: "The diagonal of $AC^{T}$ is the cofactor formula, $n$ times over", d: "Row $i$ of $A$ against column $i$ of $C^{T}$ is $a_{i1}C_{i1}+\\cdots+a_{in}C_{in}$, which is last lecture's expansion along row $i$. Every diagonal entry comes out $\\det A$." },
      { t: "And the off-diagonal entries vanish for a reason", d: "Row 1 of $A$ against the cofactors of row 2 is the cofactor expansion of a matrix whose rows 1 and 2 are identical. Two equal rows means determinant zero. So $AC^{T} = (\\det A)I$." },
      { t: "Cramer's rule follows, and is a trap", d: "$x_j = \\dfrac{\\det B_j}{\\det A}$ where $B_j$ is $A$ with column $j$ replaced by $\\vec{b}$ — because expanding $\\det B_j$ down that column produces exactly the entries of $C^{T}\\vec{b}$. Computing $n+1$ determinants takes approximately forever; elimination does not." },
      { t: "The determinant IS the volume of the box the rows span", d: "Rows as edges from the origin, completed into a parallelepiped. Negative determinant means a left-handed box, so take the absolute value for volume. In two dimensions it is the area of a parallelogram.", fig: "figDeterminant" },
      { t: "Which holds because volume obeys the same three properties", d: "The unit cube has volume 1. Swapping edges does not change it. Doubling one edge doubles it — that is property 3A. Anything satisfying the three defining properties IS the determinant, so no separate proof is needed." },
    ],
    worked: "The area of the triangle with corners $(0,0)$, $(a,b)$, $(c,d)$ is $\\tfrac12|ad-bc|$ — no base, no height, no square roots, only the coordinates you were given. For corners away from the origin, take $\\tfrac12$ of the $3\\times3$ determinant whose rows are $(x_i, y_i, 1)$.",
    watch: "Forgetting the transpose in $\\dfrac{1}{\\det A}C^{T}$. The entry in position $i,j$ of the inverse is the cofactor $C_{ji}$, not $C_{ij}$, and for a non-symmetric matrix the two differ.",
    concepts: ["la-determinant"],
    checks: [
      { q: "In $AC^{T}$, the off-diagonal entries are zero because:", opts: ["The cofactors are zero", "Row $i$ against row $j$'s cofactors expands the determinant of a matrix with two identical rows", "$C$ is symmetric", "$\\det A = 0$"], a: 1,
        expl: "The product is the cofactor expansion of $A$ with row $j$ replaced by a copy of row $i$. That matrix has two equal rows, so its determinant — and therefore the entry — is zero." },
      { q: "The triangle with corners $(0,0)$, $(3,1)$ and $(1,2)$ has area:", num: 2.5,
        expl: "$\\tfrac12|ad-bc| = \\tfrac12|3\\cdot2 - 1\\cdot1| = \\tfrac52$. The parallelogram on the same two edges has area 5." },
    ],
  },

  "math110.1.20": {
    takeaway: "An eigenvector is a direction the matrix does not turn, and finding one starts by making $A-\\lambda I$ singular.",
    beats: [
      { t: "Most vectors change direction; eigenvectors do not", d: "$A\\vec{x} = \\lambda\\vec{x}$ says the output is parallel to the input, with $\\lambda$ allowed to be negative, zero or complex. Eigenvalue zero is nothing special: those eigenvectors are the null space, so a singular matrix simply has $0$ among its eigenvalues.", fig: "figEigen" },
      { t: "Some matrices you can read without any algebra", d: "A projection has eigenvalue 1 for every vector in the plane and 0 for every vector perpendicular to it. The swap $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ has $(1,1)$ with $\\lambda=1$ and $(-1,1)$ with $\\lambda=-1$ — and those two eigenvectors are perpendicular, which is what symmetry buys." },
      { t: "The characteristic equation removes $\\vec{x}$", d: "Rewrite as $(A-\\lambda I)\\vec{x}=\\vec{0}$. A non-zero solution exists only if $A-\\lambda I$ is singular, so $\\det(A-\\lambda I)=0$. Solve that for $\\lambda$ first; then each eigenvector is a null space you find by elimination." },
      { t: "Trace and determinant are free checks", d: "The eigenvalues sum to the trace and multiply to the determinant. In the $2\\times2$ case the characteristic equation is literally $\\lambda^{2} - (\\text{trace})\\lambda + \\det = 0$, so one eigenvalue hands you the other." },
      { t: "Eigenvalues do not add", d: "$\\lambda(A)+\\lambda(B)$ is not $\\lambda(A+B)$, because $A$'s eigenvector is generally not $B$'s. The one safe case is $B = cI$: adding $3I$ leaves every eigenvector alone and adds 3 to every eigenvalue." },
      { t: "Two ways it goes wrong", d: "A $90°$ rotation turns every vector, so no real eigenvector exists — its eigenvalues are $i$ and $-i$, a conjugate pair from a perfectly real matrix. And $\\begin{pmatrix}3&1\\\\0&3\\end{pmatrix}$ has $\\lambda=3$ twice but only ONE line of eigenvectors. A repeated eigenvalue is where the shortage starts." },
    ],
    worked: "$A=\\begin{pmatrix}3&1\\\\1&3\\end{pmatrix}$. Trace 6, determinant 8, so $\\lambda^{2}-6\\lambda+8=0$ and the eigenvalues are 4 and 2. Subtract $4I$ and the null space is $(1,1)$; subtract $2I$ and it is $(-1,1)$ — the same eigenvectors as the swap matrix, since $A$ is that matrix plus $3I$.",
    watch: "Treating a triangular matrix's easy eigenvalues as the end of the story. They do sit on the diagonal, but a repeated one may come with too few independent eigenvectors, and that is the case that breaks everything downstream.",
    concepts: ["la-eigen"],
    checks: [
      { q: "If $A$ has eigenvalue $\\lambda$ and $B$ has eigenvalue $\\alpha$, then $A+B$:", opts: ["Has eigenvalue $\\lambda+\\alpha$", "Generally does not, because $A$ and $B$ usually have different eigenvectors", "Has eigenvalue $\\lambda\\alpha$", "Has no eigenvalues"], a: 1,
        expl: "The argument would need one vector to be an eigenvector of both. It works when $B$ is a multiple of $I$, since then every vector is an eigenvector of $B$; otherwise you must solve the new problem." },
      { q: "The larger eigenvalue of $\\begin{pmatrix}3&1\\\\1&3\\end{pmatrix}$ is:", num: 4,
        expl: "$\\lambda^{2}-6\\lambda+8 = (\\lambda-4)(\\lambda-2)$. The 6 is the trace and the 8 is the determinant, so both coefficients can be read off the matrix." },
    ],
  },

  "math110.1.21": {
    takeaway: "Put the eigenvectors in the columns of $S$ and $A$ becomes diagonal, which turns the hundredth power of a matrix into the hundredth power of $n$ numbers.",
    beats: [
      { t: "$AS = S\\Lambda$ is just matrix multiplication", d: "Column $j$ of $AS$ is $A\\vec{x}_j = \\lambda_j\\vec{x}_j$. Pulling those $\\lambda$s out on the RIGHT rebuilds $S$ with a diagonal $\\Lambda$ beside it. If $S$ is invertible, $S^{-1}AS = \\Lambda$ and $A = S\\Lambda S^{-1}$." },
      { t: "Powers collapse because the inside cancels", d: "$A^{2} = S\\Lambda S^{-1}S\\Lambda S^{-1} = S\\Lambda^{2}S^{-1}$, and $A^{k} = S\\Lambda^{k}S^{-1}$. Same eigenvectors, eigenvalues raised to the power. Multiplying $LU$ by itself a hundred times tells you nothing; this tells you everything." },
      { t: "So stability is a statement about $|\\lambda|$", d: "$A^{k}\\to 0$ exactly when every $|\\lambda_i| \\lt 1$. $S$ and $S^{-1}$ do not move, so only $\\Lambda^{k}$ decides. That information is in the eigenvalues and is nowhere in the pivots." },
      { t: "Distinct eigenvalues guarantee enough eigenvectors", d: "The whole construction needs $S^{-1}$ to exist. $n$ different eigenvalues always give $n$ independent eigenvectors. A repeated eigenvalue MAY still be fine — the identity repeats $1$ $n$ times and every vector is an eigenvector — or may not." },
      { t: "Where it fails, and the two multiplicities", d: "$\\begin{pmatrix}2&1\\\\0&2\\end{pmatrix}$ has $\\lambda=2$ with algebraic multiplicity 2 but a one-dimensional null space for $A-2I$: geometric multiplicity 1. No $S$, no diagonalisation." },
      { t: "To solve $\\vec{u}_{k+1}=A\\vec{u}_k$, split $\\vec{u}_0$ into eigenvectors", d: "$\\vec{u}_0 = c_1\\vec{x}_1+\\cdots+c_n\\vec{x}_n$; then $\\vec{u}_k = c_1\\lambda_1^{k}\\vec{x}_1+\\cdots+c_n\\lambda_n^{k}\\vec{x}_n$. Each piece goes its own way, and the largest $|\\lambda|$ eventually dominates everything." },
    ],
    worked: "Fibonacci. Write $\\vec{u}_k = (F_{k+1}, F_k)$ and the second-order rule becomes $\\vec{u}_{k+1} = \\begin{pmatrix}1&1\\\\1&0\\end{pmatrix}\\vec{u}_k$. Trace 1 and determinant $-1$ give $\\lambda = \\tfrac{1\\pm\\sqrt5}{2}$, so $F_k$ grows like $1.618^{k}$ — the other eigenvalue, about $-0.618$, dies away.",
    watch: "Concluding that a repeated eigenvalue means no diagonalisation. Count the eigenvectors: the identity repeats its eigenvalue $n$ times and diagonalises perfectly. Only a shortage of independent eigenvectors stops it.",
    concepts: ["la-eigen"],
    checks: [
      { q: "$A^{k}\\to 0$ as $k$ grows exactly when:", opts: ["$\\det A = 0$", "Every eigenvalue satisfies $|\\lambda| \\lt 1$", "$A$ is symmetric", "The pivots are small"], a: 1,
        expl: "$A^{k} = S\\Lambda^{k}S^{-1}$ and only $\\Lambda^{k}$ changes with $k$, so each $\\lambda_i^{k}$ must go to zero. The pivots say nothing about this." },
      { q: "If $A = \\begin{pmatrix}3&1\\\\1&3\\end{pmatrix}$, the largest eigenvalue of $A^{3}$ is:", num: 64,
        expl: "$A$ has eigenvalues 4 and 2, and cubing the matrix cubes them: $4^{3}=64$ and $2^{3}=8$. The eigenvectors are unchanged." },
    ],
  },

  "math110.1.22": {
    takeaway: "Exponentials do for differential equations exactly what powers did for difference equations, and the eigenvalues decide the fate of the solution before you compute anything.",
    beats: [
      { t: "Each eigenvector gives one pure exponential solution", d: "$\\vec{u} = e^{\\lambda t}\\vec{x}$ satisfies $d\\vec{u}/dt = A\\vec{u}$, since differentiating brings down $\\lambda$ and $A\\vec{x}=\\lambda\\vec{x}$ matches it. The general solution is $c_1e^{\\lambda_1 t}\\vec{x}_1 + \\cdots + c_ne^{\\lambda_n t}\\vec{x}_n$." },
      { t: "The constants come from the starting point", d: "At $t=0$ every exponential is 1, so $S\\vec{c} = \\vec{u}(0)$ — the eigenvector matrix again. Split the initial vector into eigenvectors once, and each piece then travels on its own." },
      { t: "Stability is the REAL part, not the magnitude", d: "$|e^{(-3+6i)t}| = e^{-3t}$: the imaginary part only rotates. So $\\vec{u}(t)\\to\\vec{0}$ when every eigenvalue has negative real part — the left half plane, where powers needed the unit circle." },
      { t: "A zero eigenvalue is a steady state", d: "$e^{0t}=1$ never moves. If one eigenvalue is 0 and the rest have negative real part, the solution settles onto a multiple of that eigenvector. For $2\\times2$, stability reads off the matrix: negative trace and positive determinant." },
      { t: "Substituting $\\vec{u}=S\\vec{v}$ uncouples the system", d: "It becomes $d\\vec{v}/dt = \\Lambda\\vec{v}$, $n$ separate scalar equations with no coupling. Solve each, transform back, and the answer is $\\vec{u}(t) = Se^{\\Lambda t}S^{-1}\\vec{u}(0)$." },
      { t: "Which is what $e^{At}$ means", d: "Define it by the series $I + At + \\tfrac{(At)^{2}}{2} + \\cdots$, and substituting $A=S\\Lambda S^{-1}$ makes every interior $S^{-1}S$ cancel, leaving $Se^{\\Lambda t}S^{-1}$. The series always converges; the $S$ form needs $A$ to be diagonalisable." },
    ],
    worked: "$A=\\begin{pmatrix}-1&2\\\\1&-2\\end{pmatrix}$ is singular, so $\\lambda_1=0$, and the trace $-3$ forces $\\lambda_2=-3$. Eigenvectors $(2,1)$ and $(1,-1)$. From $\\vec{u}(0)=(1,0)$, both constants are $\\tfrac13$, and the $e^{-3t}$ term dies: the steady state is $\\tfrac13(2,1)$.",
    watch: "Using $|\\lambda| \\lt 1$ as the stability test for a differential equation. That is the test for POWERS. Exponentials need the real part negative, and an eigenvalue of $-5$ is stable while $\\tfrac12$ is not.",
    concepts: ["la-eigen"],
    checks: [
      { q: "$\\vec{u}(t)\\to\\vec{0}$ for every starting vector exactly when every eigenvalue has:", opts: ["Absolute value less than 1", "Negative real part", "Absolute value greater than 1", "Zero imaginary part"], a: 1,
        expl: "$|e^{\\lambda t}| = e^{(\\mathrm{Re}\\,\\lambda)t}$, because the imaginary part only contributes a rotation of modulus 1. The unit-circle test belongs to $A^{k}$, not to $e^{At}$." },
      { q: "The non-zero eigenvalue of $\\begin{pmatrix}-1&2\\\\1&-2\\end{pmatrix}$ is:", num: -3,
        expl: "The second column is $-2$ times the first, so the determinant is 0 and one eigenvalue is 0. The trace is $-3$, so the other must be $-3$." },
    ],
  },

  "math110.1.23": {
    takeaway: "A Markov matrix always has $\\lambda=1$, and the eigenvector that goes with it is the population the system settles into.",
    beats: [
      { t: "Two properties, both from probability", d: "Every entry is at least 0, and every column sums to 1. The entries are the chance of moving from one state to another, and the columns sum to 1 because nobody is lost. Powers of a Markov matrix are Markov." },
      { t: "Why $\\lambda=1$ is guaranteed", d: "Subtract $I$ and every column of $A-I$ sums to 0 — which means the ROWS add up to the zero row. Dependent rows make the matrix singular, so 1 is an eigenvalue. The vector $(1,1,\\dots,1)$ sits in $N((A-I)^{T})$." },
      { t: "And $A$ and $A^{T}$ share eigenvalues", d: "$\\det(A-\\lambda I) = \\det(A^{T}-\\lambda I)$, since transposing does not change a determinant and $\\lambda I$ transposes to itself. The eigenVECTORS differ — one lives in the null space, the other in the left null space." },
      { t: "Every other eigenvalue is no larger in magnitude", d: "So in $\\vec{u}_k = c_1 1^{k}\\vec{x}_1 + c_2\\lambda_2^{k}\\vec{x}_2 + \\cdots$, every term but the first decays. The steady state is $c_1\\vec{x}_1$ — and $\\vec{x}_1$ has no negative components, so it is a population and not just a vector." },
      { t: "Orthonormal bases make coefficients free", d: "To expand $\\vec{v} = x_1\\vec{q}_1+\\cdots+x_n\\vec{q}_n$, take the inner product with $\\vec{q}_1$: every other term dies and $x_1 = \\vec{q}_1^{T}\\vec{v}$. In matrix form, $Q\\vec{x}=\\vec{v}$ with $Q^{-1}=Q^{T}$." },
      { t: "Fourier series is that idea in infinite dimensions", d: "The basis is $1, \\cos x, \\sin x, \\cos 2x, \\dots$, the inner product is $\\int_0^{2\\pi} f(x)g(x)\\,dx$ — a sum became an integral — and the functions are orthogonal. So $a_1 = \\frac{1}{\\pi}\\int_0^{2\\pi} f(x)\\cos x\\,dx$, by the same one-line argument." },
    ],
    worked: "Two states, with $A = \\begin{pmatrix}0.9&0.2\\\\0.1&0.8\\end{pmatrix}$. Trace 1.7, so the eigenvalues are 1 and 0.7. The eigenvector for 1 is $(2,1)$, so a thousand people starting anywhere end up split $\\tfrac23$ and $\\tfrac13$ — regardless of who started where.",
    watch: "Looking for eigenvalue 0 because that was the steady state for differential equations. Under repeated multiplication a zero eigenvalue dies immediately; it is $\\lambda=1$ that stands still.",
    concepts: ["la-eigen", "la-projection"],
    checks: [
      { q: "Every Markov matrix has $\\lambda=1$ because:", opts: ["Its entries are positive", "The columns of $A-I$ sum to zero, so its rows are dependent and it is singular", "It is symmetric", "Its determinant is 1"], a: 1,
        expl: "Columns of $A$ summing to 1 means columns of $A-I$ sum to 0, so adding all the rows of $A-I$ gives the zero row. Dependent rows mean singular, and singular at the shift $\\lambda=1$ means 1 is an eigenvalue." },
      { q: "The second eigenvalue of $\\begin{pmatrix}0.9&0.2\\\\0.1&0.8\\end{pmatrix}$ is:", num: 0.7,
        expl: "One eigenvalue is 1, and the trace is $0.9+0.8=1.7$, so the other is $0.7$. The determinant confirms it: $0.72-0.02 = 0.7 = 1\\times0.7$." },
    ],
  },

  "math110.1.25": {
    takeaway: "Symmetry buys two things nothing else does: the eigenvalues are real and the eigenvectors can be chosen perpendicular, so $A = Q\\Lambda Q^{T}$.",
    beats: [
      { t: "Real eigenvalues, perpendicular eigenvectors", d: "\"Can be chosen\" perpendicular, because a repeated eigenvalue gives a whole plane of eigenvectors and you pick an orthogonal pair inside it. With distinct eigenvalues there is no choice to make — the lines are already at right angles.", fig: "figSpectral" },
      { t: "So $S$ becomes $Q$ and $S^{-1}$ becomes $Q^{T}$", d: "Normalise the perpendicular eigenvectors and the eigenvector matrix is orthogonal, whose inverse IS its transpose. $A = Q\\Lambda Q^{T}$ — the spectral theorem, and visibly symmetric, since transposing it returns the same product." },
      { t: "Why the eigenvalues must be real", d: "Conjugate $A\\vec{x}=\\lambda\\vec{x}$, transpose it, use $A^{T}=A$, and compare: $\\lambda\\,\\bar{\\vec{x}}^{T}\\vec{x} = \\bar\\lambda\\,\\bar{\\vec{x}}^{T}\\vec{x}$. That factor is $|x_1|^{2}+\\cdots+|x_n|^{2}$, strictly positive, so it cancels and $\\lambda = \\bar\\lambda$." },
      { t: "For complex matrices the right condition is $\\bar{A}^{T}=A$", d: "The proof needed to conjugate AND transpose. Over the reals conjugation does nothing, so it reduces to symmetry; over the complex numbers it is Hermitian, and those are the matrices with real eigenvalues and perpendicular eigenvectors." },
      { t: "Every symmetric matrix is a sum of projections", d: "Multiply $Q\\Lambda Q^{T}$ out column times row: $A = \\lambda_1\\vec{q}_1\\vec{q}_1^{T} + \\cdots + \\lambda_n\\vec{q}_n\\vec{q}_n^{T}$. Each $\\vec{q}\\vec{q}^{T}$ is a projection matrix onto one eigenvector line, and they are mutually perpendicular." },
      { t: "The pivots' signs match the eigenvalues' signs", d: "Not their values — their SIGNS, and the counts agree exactly. Pivots are cheap and eigenvalues of a $50\\times50$ are not, so this is how you learn how many are positive without computing any of them." },
    ],
    worked: "Positive definite means symmetric with all eigenvalues positive — equivalently all pivots positive, equivalently every leading sub-determinant positive. $\\begin{pmatrix}5&2\\\\2&3\\end{pmatrix}$: pivots 5 and $\\tfrac{11}{5}$, sub-determinants 5 and 11. All positive, so it passes.",
    watch: "Testing only the full determinant. $\\begin{pmatrix}-1&0\\\\0&-3\\end{pmatrix}$ has determinant 3, positive, and both eigenvalues negative. Every leading sub-determinant has to be positive, not just the last.",
    concepts: ["la-spectral", "la-eigen"],
    checks: [
      { q: "For a symmetric matrix, the pivots tell you:", opts: ["The eigenvalues exactly", "How many eigenvalues are positive and how many negative", "The eigenvectors", "Nothing"], a: 1,
        expl: "The pivots are not the eigenvalues, but their signs match one for one. Since pivots come from elimination and are cheap, this is a practical way to count positive eigenvalues for a large matrix." },
      { q: "The second pivot of $\\begin{pmatrix}5&2\\\\2&3\\end{pmatrix}$ is:", num: 2.2,
        expl: "The pivots multiply to the determinant, $15-4=11$, so the second is $\\tfrac{11}{5}=2.2$. Both positive, so the matrix is positive definite." },
    ],
  },

  "math110.1.26": {
    takeaway: "Every inner product gains a conjugate when the numbers go complex, and the Fourier matrix — the most important complex matrix — factors so well that its transform runs in $n\\log n$.",
    beats: [
      { t: "Transposing now means conjugate-and-transpose", d: "$\\vec{z}^{T}\\vec{z}$ for $\\vec{z}=(1,i)$ gives $1+i^{2}=0$, which is nonsense for a non-zero vector. $\\bar{\\vec{z}}^{T}\\vec{z} = 1+1 = 2$ is the length squared. Write it $\\vec{z}^{H}\\vec{z}$, after Hermite." },
      { t: "Three words change, one idea does not", d: "Symmetric becomes Hermitian, $A^{H}=A$ — real down the diagonal, conjugate pairs across it. Orthogonal becomes unitary, $Q^{H}Q=I$. Real eigenvalues and perpendicular eigenvectors carry over unchanged." },
      { t: "The Fourier matrix is built from one number", d: "$F_{jk} = W^{jk}$ with $W = e^{2\\pi i/n}$, the first $n$-th root of 1 — one $n$-th of the way round the unit circle, and rows and columns indexed from 0. For $n=4$, $W=i$ and the matrix is entries $1, i, -1, -i$." },
      { t: "Its columns are orthogonal, but only with the conjugate", d: "Columns 1 and 3 of $F_4$ look like they dot to 4. Conjugating the first flips the signs of the imaginary entries and the sum is 0. Each column has length 2, so $\\tfrac12 F_4$ is unitary and its inverse is its conjugate transpose." },
      { t: "$F_{64}$ contains two copies of $F_{32}$", d: "Because squaring $W_{64}$ gives $W_{32}$. So $F_{64} = \\begin{pmatrix}I&D\\\\I&-D\\end{pmatrix}\\begin{pmatrix}F_{32}&0\\\\0&F_{32}\\end{pmatrix}P$, where $P$ sorts even-indexed entries before odd and $D$ is diagonal — both nearly free." },
      { t: "Recur, and $n^{2}$ becomes $\\tfrac{n}{2}\\log_2 n$", d: "Split the 32s into 16s, and on down. The middle cost vanishes; what is left is one diagonal fix-up per halving, and there are $\\log_2 n$ halvings. That factorisation is the fast Fourier transform." },
    ],
    worked: "At $n=1024$: the direct product costs $1024^{2}$, more than a million multiplications. The FFT costs $\\tfrac{1024}{2}\\times 10 = 5120$. That is a factor of about 200, from nothing but writing one matrix as a product of sparse ones.",
    watch: "Taking the dot product of complex columns without conjugating. Two Fourier columns that appear to have inner product 4 are in fact orthogonal — the conjugate flips the sign of every imaginary term.",
    concepts: ["la-spectral"],
    checks: [
      { q: "For complex vectors, the length squared is $\\bar{\\vec{z}}^{T}\\vec{z}$ rather than $\\vec{z}^{T}\\vec{z}$ because:", opts: ["It is shorter to write", "Each term becomes $|z_k|^{2}$, so the total is positive instead of possibly zero or negative", "Complex vectors have no length", "It makes the matrix square"], a: 1,
        expl: "$\\bar{z}_k z_k = a^{2}+b^{2}$, never negative. Without the conjugate, $(1,i)$ would have length zero despite being a non-zero vector." },
      { q: "The fast Fourier transform on $n = 1024$ points costs about $\\tfrac{n}{2}\\log_2 n$ multiplications, which is:", num: 5120,
        expl: "$\\tfrac{1024}{2}\\times\\log_2 1024 = 512\\times10 = 5120$, against $1024^{2} = 1048576$ for the direct product — about 200 times fewer." },
    ],
  },

  "math110.1.27": {
    takeaway: "Positive definite means $\\vec{x}^{T}A\\vec{x} \\gt 0$ for every non-zero $\\vec{x}$, which is the matrix version of a positive second derivative — the test for a minimum.",
    beats: [
      { t: "Four tests, one property", d: "All eigenvalues positive; all pivots positive; every leading sub-determinant positive; and $\\vec{x}^{T}A\\vec{x} \\gt 0$ for all $\\vec{x}\\neq\\vec{0}$. The last is the definition and the first three are how you check it." },
      { t: "$\\vec{x}^{T}A\\vec{x}$ is a quadratic form", d: "For a $2\\times2$ it multiplies out to $ax^{2} + 2bxy + cy^{2}$: pure degree two, no linear or constant part. The diagonal supplies the squares and the off-diagonal the cross term, which is the only part that can turn the whole thing negative." },
      { t: "Which makes the graph a bowl or a saddle", d: "$\\begin{pmatrix}2&6\\\\6&20\\end{pmatrix}$ gives a bowl with its minimum at the origin. Change the 20 to a 7 and $(1,-1)$ makes the form negative: up in some directions, down in others — a saddle point, and not a minimum." },
      { t: "Completing the square IS elimination", d: "$2x^{2}+12xy+20y^{2} = 2(x+3y)^{2} + 2y^{2}$. The numbers outside the squares are the PIVOTS and the number inside is the multiplier. Positive pivots means a sum of positive squares, which is why the pivot test works." },
      { t: "And it is calculus's second-derivative test", d: "First derivatives zero is not enough; in one variable the second derivative must be positive. In $n$ variables the matrix of second derivatives must be positive definite — and it is symmetric because $f_{xy}=f_{yx}$." },
      { t: "Slicing the bowl gives an ellipsoid", d: "Set $\\vec{x}^{T}A\\vec{x}=1$ and you cut out an ellipse, or in three variables a lopsided football. $A = Q\\Lambda Q^{T}$ says the eigenvectors point along the principal axes and the eigenvalues set their lengths." },
    ],
    worked: "$\\begin{pmatrix}2&6\\\\6&c\\end{pmatrix}$: at $c=20$ the determinant is 4 and both tests pass. At $c=18$ the determinant is 0, one eigenvalue is 0, there is no second pivot — positive SEMI-definite, the borderline. At $c=7$ the determinant is $-22$ and it is a saddle.",
    watch: "Reading $\\vec{x}^{T}A\\vec{x} \\gt 0$ off the diagonal. Both diagonal entries can be positive while the cross term dominates; the whole point of the tests is that the squares must OVERWHELM the cross term.",
    concepts: ["la-spectral", "la-determinant"],
    checks: [
      { q: "When $\\vec{x}^{T}A\\vec{x}$ is written as a sum of squares, the numbers multiplying those squares are:", opts: ["The eigenvalues", "The pivots", "The determinants", "The entries of $A$"], a: 1,
        expl: "Completing the square is elimination in another notation: the pivots land outside the squares and the multipliers inside. Positive pivots therefore give a sum of positive squares." },
      { q: "For $\\begin{pmatrix}2&6\\\\6&c\\end{pmatrix}$, the value of $c$ on the borderline between positive definite and indefinite is:", num: 18,
        expl: "The determinant $2c-36$ is zero at $c=18$, so one eigenvalue is 0 and the other is 20 from the trace. Positive semi-definite: never negative, but not strictly positive." },
    ],
  },

  "math110.1.28": {
    takeaway: "Two matrices are similar when $B = M^{-1}AM$, and similarity preserves the eigenvalues exactly while scrambling the eigenvectors.",
    beats: [
      { t: "First, where positive definite matrices come from", d: "$A^{T}A$, for any rectangular $A$. Group the product as $\\vec{x}^{T}A^{T}A\\vec{x} = \\|A\\vec{x}\\|^{2} \\ge 0$, and it is strictly positive once $A$ has independent columns, since then $A\\vec{x}=\\vec{0}$ forces $\\vec{x}=\\vec{0}$." },
      { t: "And why the definition is worth having", d: "$A^{-1}$ is positive definite because its eigenvalues are $1/\\lambda$. $A+B$ is, because $\\vec{x}^{T}(A+B)\\vec{x}$ is a sum of two positive numbers — which neither the eigenvalues nor the pivots of $A+B$ would have told you." },
      { t: "Similarity is a family, and diagonal is the best member", d: "$S^{-1}AS = \\Lambda$ says $A$ is similar to $\\Lambda$. Any other invertible $M$ gives some other $B$ in the same family. All of them share one thing." },
      { t: "The eigenvalues, and the proof is three lines", d: "From $A\\vec{x}=\\lambda\\vec{x}$, insert $MM^{-1}$ and multiply by $M^{-1}$: $B(M^{-1}\\vec{x}) = \\lambda(M^{-1}\\vec{x})$. Same $\\lambda$, and the eigenvector is $M^{-1}\\vec{x}$ — which is why diagonalising makes the eigenvectors into $(1,0),(0,1)$." },
      { t: "A repeated eigenvalue splits the family in two", d: "$4I$ is similar only to itself: $M^{-1}(4I)M = 4I$ whatever $M$ is. Every OTHER matrix with eigenvalues 4 and 4 belongs to a second family, whose best member is $\\begin{pmatrix}4&1\\\\0&4\\end{pmatrix}$ — one eigenvector, not diagonalisable." },
      { t: "Jordan form, and why counting eigenvectors is not enough", d: "Blocks with $\\lambda$ on the diagonal and 1s above, one eigenvector per block. Two $4\\times4$ matrices can both have eigenvalue 0 four times, rank 2, and two eigenvectors, and still not be similar — because one splits $3+1$ and the other $2+2$." },
    ],
    worked: "$A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ has eigenvalues 3 and 1. Take $M=\\begin{pmatrix}1&4\\\\0&1\\end{pmatrix}$ and $M^{-1}AM = \\begin{pmatrix}-2&-15\\\\1&6\\end{pmatrix}$ — unrecognisable, but the trace is still 4 and the determinant still 3, so the eigenvalues are still 3 and 1.",
    watch: "Concluding that matching eigenvalues and matching eigenvector counts make two matrices similar. The SIZES of the Jordan blocks must match too, and those are not visible in either count.",
    concepts: ["la-eigen"],
    checks: [
      { q: "$4I$ is similar to no other matrix because:", opts: ["It has no eigenvalues", "$M^{-1}(4I)M = 4M^{-1}M = 4I$ for every invertible $M$", "It is not invertible", "It has four eigenvectors"], a: 1,
        expl: "A scalar multiple of $I$ commutes with everything, so the conjugation does nothing. Every other matrix with eigenvalues 4 and 4 sits in a different, larger family." },
      { q: "With $A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ and $M=\\begin{pmatrix}1&4\\\\0&1\\end{pmatrix}$, the determinant of $M^{-1}AM$ is:", num: 3,
        expl: "$\\det(M^{-1}AM) = \\det(M^{-1})\\det A\\det M = \\det A = 3$, and directly $\\begin{pmatrix}-2&-15\\\\1&6\\end{pmatrix}$ gives $-12+15 = 3$." },
    ],
  },

  "math110.1.29": {
    takeaway: "The SVD finds an orthonormal basis of the row space that $A$ carries to an orthonormal basis of the column space, which no single set of eigenvectors can do.",
    beats: [
      { t: "Two orthogonal matrices, not one", d: "$A = U\\Sigma V^{T}$ for ANY matrix — rectangular, singular, whatever. A symmetric positive definite matrix is the special case where $U$ and $V$ coincide, because its eigenvectors are already orthogonal.", fig: "figSVD" },
      { t: "The goal, stated in the four-subspaces picture", d: "Gram-Schmidt gives an orthonormal basis for the row space easily, but $A$ would scatter it. The SVD asks for the basis $\\vec{v}_1,\\dots,\\vec{v}_r$ whose images $A\\vec{v}_i = \\sigma_i\\vec{u}_i$ stay orthogonal." },
      { t: "$A^{T}A$ makes the $U$s disappear", d: "$A^{T}A = V\\Sigma^{T}U^{T}U\\Sigma V^{T} = V\\Sigma^{2}V^{T}$, because $U^{T}U=I$. That is exactly $Q\\Lambda Q^{T}$ for a symmetric positive semi-definite matrix, so the $\\vec{v}$s are its eigenvectors and the $\\sigma^{2}$ its eigenvalues." },
      { t: "$AA^{T}$ does the same for the $U$s", d: "Multiply the other way and $V^{T}V=I$ cancels instead. The eigenvalues match, because $AB$ and $BA$ always share eigenvalues — so the same $\\sigma^{2}$ come out both times, which is a free check on the arithmetic." },
      { t: "Singular values are square roots, and they are positive", d: "$\\sigma_i = \\sqrt{\\lambda_i(A^{T}A)}$, and $A^{T}A$ is positive semi-definite, so no imaginary numbers and no sign ambiguity. Zero singular values are the null space directions and give the zero columns of $\\Sigma$." },
      { t: "It is the right basis for all four subspaces at once", d: "$\\vec{v}_1..\\vec{v}_r$ span the row space, $\\vec{v}_{r+1}..\\vec{v}_n$ the null space, $\\vec{u}_1..\\vec{u}_r$ the column space, $\\vec{u}_{r+1}..\\vec{u}_m$ the left null space — all orthonormal, and $A$ diagonal between them." },
    ],
    worked: "$A=\\begin{pmatrix}4&3\\\\8&6\\end{pmatrix}$ has rank 1. $A^{T}A = \\begin{pmatrix}80&60\\\\60&45\\end{pmatrix}$, also rank 1, so its eigenvalues are 125 and 0 and $\\sigma_1 = \\sqrt{125}$. Then $\\vec{v}_1 = (0.8, 0.6)$ spans the row space and $\\vec{u}_1 = \\tfrac{1}{\\sqrt5}(1,2)$ the column space.",
    watch: "Picking each eigenvector's sign independently. $\\vec{v}_i$ and $\\vec{u}_i$ are paired by $A\\vec{v}_i = \\sigma_i\\vec{u}_i$ with $\\sigma_i \\gt 0$; choose one freely and the other is then determined. Strang hit exactly this in the lecture.",
    concepts: ["la-svd", "la-spectral"],
    checks: [
      { q: "The vectors $\\vec{v}_i$ in $A = U\\Sigma V^{T}$ are:", opts: ["The eigenvectors of $A$", "The eigenvectors of $A^{T}A$", "Any orthonormal basis of the row space", "The columns of $A$"], a: 1,
        expl: "$A^{T}A = V\\Sigma^{2}V^{T}$ because $U^{T}U=I$ removes $U$ entirely. $A$ itself may have no orthogonal eigenvectors, or none at all if it is rectangular." },
      { q: "For $A=\\begin{pmatrix}4&3\\\\8&6\\end{pmatrix}$, the non-zero eigenvalue of $A^{T}A$ is:", num: 125,
        expl: "$A^{T}A = \\begin{pmatrix}80&60\\\\60&45\\end{pmatrix}$ has rank 1, so one eigenvalue is 0 and the other is the trace, $80+45=125$. Hence $\\sigma_1 = \\sqrt{125}$." },
    ],
  },

  "math110.1.30": {
    takeaway: "A linear transformation exists without coordinates; choosing a basis for the inputs and one for the outputs is what turns it into a matrix.",
    beats: [
      { t: "Two rules, and nothing else", d: "$T(\\vec{v}+\\vec{w}) = T(\\vec{v})+T(\\vec{w})$ and $T(c\\vec{v}) = cT(\\vec{v})$ — or in one statement, $T$ must preserve every linear combination. Projection and rotation satisfy this with no matrix in sight.", fig: "figGridTransform" },
      { t: "Which rules a lot of things out", d: "Shifting the plane by a fixed $\\vec{v}_0$ fails: doubling the input does not double the output. Taking a vector's length fails: multiplying by $-2$ doubles the length rather than negating it. And $T(\\vec{0})=\\vec{0}$ always, so anything that moves the origin is out." },
      { t: "Knowing $T$ on a basis is knowing $T$", d: "Every input is $c_1\\vec{v}_1+\\cdots+c_n\\vec{v}_n$, so linearity forces $T(\\vec{v}) = c_1T(\\vec{v}_1)+\\cdots+c_nT(\\vec{v}_n)$. That is the entire information content of the transformation: $n$ outputs." },
      { t: "Coordinates ARE the choice of basis", d: "Writing $\\vec{v}=(3,2,4)$ silently assumes the standard basis. The numbers are how much of each basis vector is present; change the basis and the same vector gets different coordinates." },
      { t: "The construction rule, column by column", d: "Apply $T$ to $\\vec{v}_1$, write the result in the output basis, and those coefficients are column 1 of $A$. Repeat for each $\\vec{v}_j$. Then $A$ times the input coordinates gives the output coordinates, by construction." },
      { t: "A good basis makes the matrix diagonal", d: "Projection onto a line in the standard basis is $\\begin{pmatrix}0.5&0.5\\\\0.5&0.5\\end{pmatrix}$. In the basis along the line and perpendicular to it — the eigenvectors — the same transformation is $\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$. Same transformation, better coordinates." },
    ],
    worked: "The derivative is linear, which is why a short table of derivatives covers everything. From the basis $1, x, x^{2}$ to the basis $1, x$, it takes $c_1+c_2x+c_3x^{2}$ to $c_2+2c_3x$, so its matrix is $\\begin{pmatrix}0&1&0\\\\0&0&2\\end{pmatrix}$ — three columns in, two rows out.",
    watch: "Calling a shift linear because it looks simple. A linear transformation must fix the origin: $T(\\vec{0}) = T(0\\cdot\\vec{v}) = 0\\cdot T(\\vec{v}) = \\vec{0}$, and adding $\\vec{v}_0$ breaks that immediately.",
    concepts: ["la-linear-map", "la-basis"],
    checks: [
      { q: "Shifting every vector by a fixed $\\vec{v}_0 \\neq \\vec{0}$ is not linear because:", opts: ["It is not continuous", "It moves the origin, and a linear transformation must send $\\vec{0}$ to $\\vec{0}$", "It changes lengths", "It is not invertible"], a: 1,
        expl: "$T(c\\vec{v}) = cT(\\vec{v})$ with $c=0$ forces $T(\\vec{0})=\\vec{0}$. Doubling the input also fails to double the output, since only one copy of $\\vec{v}_0$ is ever added." },
      { q: "For the derivative from basis $1, x, x^{2}$ to basis $1, x$, the matrix entry in row 2, column 3 is:", num: 2,
        expl: "The third basis input is $x^{2}$, whose derivative is $2x$ — that is $0$ of the output basis vector $1$ and $2$ of the output basis vector $x$. So column 3 is $(0,2)$." },
    ],
  },

  "math110.1.31": {
    takeaway: "Compression is a change of basis: rewrite the image in a basis where most coefficients are tiny, then throw those away.",
    beats: [
      { t: "The standard basis is the worst possible one", d: "A $512\\times512$ image is a vector with $512^{2}$ components, one gray level per pixel. Neighbouring pixels are almost equal, and the standard basis exploits none of that — a blank blackboard still costs every pixel." },
      { t: "So put the constant vector in the basis", d: "$(1,1,\\dots,1)$ alone carries a solid image. At the other extreme $(1,-1,1,-1,\\dots)$ carries the fastest alternation. A real image is mostly the first and barely any of the last, which is exactly the redundancy compression lives on." },
      { t: "JPEG changes basis, then thresholds", d: "Break the image into $8\\times8$ blocks, change to the Fourier basis inside each — 64 pixels in, 64 coefficients out, and nothing lost. Only the NEXT step loses: set small coefficients to zero. Sixty-four down to three is 21-to-1." },
      { t: "A good basis has to be fast and has to compress", d: "Fast means multiplying by $W$ and $W^{-1}$ is cheap — the FFT for Fourier, a fast transform for wavelets. Compressing means a few coefficients nearly reproduce the signal. Leaving the basis alone is the fastest of all and compresses nothing." },
      { t: "Wavelets: same idea, different basis", d: "$(1,1,1,1,1,1,1,1)$, then $(1,1,1,1,-1,-1,-1,-1)$, then halves of that, down to $(1,-1,0,0,0,0,0,0)$ and its shifts. They are mutually orthogonal, so once normalised $W^{-1}=W^{T}$ and the inverse transform costs the same as the forward one." },
      { t: "Change the basis and the matrix becomes similar", d: "$\\vec{x} = W\\vec{c}$ converts coordinates. One transformation computed in two bases gives two matrices $A$ and $B=M^{-1}AM$ — similar, same eigenvalues. In the eigenvector basis the matrix is diagonal, which is the best basis there is and the most expensive to find." },
    ],
    worked: "The alternating vector $(1,-1,1,-1,1,-1,1,-1)$ is not a wavelet, but it is the sum of the last four: $(1,-1,0,0,0,0,0,0)$ and its three shifts. A vector cheap in one basis can be expensive in another, which is the whole reason the choice of basis is worth arguing about.",
    watch: "Calling the change of basis itself compression. It is lossless and changes nothing about the size; the loss happens afterwards, when small coefficients are set to zero.",
    concepts: ["la-basis", "la-linear-map"],
    checks: [
      { q: "The wavelet matrix $W$ is cheap to invert because:", opts: ["It is triangular", "Its columns are orthogonal, so once normalised $W^{-1} = W^{T}$", "It is diagonal", "It has rank one"], a: 1,
        expl: "Any two of those basis vectors have equal numbers of $+1$ and $-1$ overlapping, so their dot product is zero. Normalise the lengths and the inverse transform is just the transpose." },
      { q: "In $\\mathbb{R}^{8}$, the alternating vector $(1,-1,1,-1,1,-1,1,-1)$ is a sum of how many of the finest Haar wavelets?", num: 4,
        expl: "The four finest wavelets are $(1,-1,0,\\dots)$ and its shifts by 2, 4 and 6 positions. Added together they give exactly the alternating vector, so the answer is 4." },
    ],
  },

});
