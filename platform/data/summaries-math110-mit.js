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

});
