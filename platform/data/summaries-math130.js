// Brickford — lecture summaries, MATH 130 (Probability)
//
// Harvard Stat 110 with Joe Blitzstein: one unit, 34 lectures. His course has a
// particular voice — story proofs, naming distributions by the experiment that
// generates them, and a running insistence that a probability is meaningless
// until you have said what the sample space is. The summaries follow that voice
// and that order, the way the MATH 110 and MATH 120 files follow Strang's and
// Jerison's.
//
// Same contract as the other summary files: written FROM the lecture, following
// the lecturer's own argument in their own order, so the summary reviews what
// was actually said rather than paraphrasing the topic. tools/verify-content.js
// enforces the shape and RECOMPUTES every numeric answer — see the summaries
// block there before adding an entry.
//
// Probability numerics recompute well by SIMULATION, which is a genuinely
// different method from the combinatorics a summary teaches: count the favourable
// outcomes by enumeration or by running the experiment, never by re-evaluating
// the formula the beat derived. Seeded, so the gate stays deterministic.
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

  "math130.0.0": {
    takeaway: "The naive definition — favourable outcomes over possible outcomes — is correct only when the outcomes are equally likely and finite in number, and the rest of this lecture is learning to count the two numbers.",
    beats: [
      { t: "Statistics is the logic of uncertainty", d: "Mathematics is the logic of certainty. Everyone has uncertainty, and probability is how you quantify it and update it. That is the whole subject in one sentence." },
      { t: "It started with gambling, and the intuitions were wrong", d: "Fermat and Pascal worked it out in letters to each other in the 1650s, analysing games of chance. Newton was consulted too, and although his arithmetic was right, his INTUITION about a dice problem was wrong. Expect to be surprised often." },
      { t: "Sample space and event", d: "A sample space $S$ is the set of all possible outcomes of an experiment — read 'experiment' as broadly as you like. An EVENT is a subset of $S$. Treating events as sets was the breakthrough that made probability mathematics rather than a collection of heuristics." },
      { t: "The naive definition", d: "$P(A) = \\dfrac{\\text{number of outcomes favourable to } A}{\\text{number of possible outcomes}}$. Two coins give $\\{HH, HT, TH, TT\\}$, so $P(\\text{both tails}) = \\tfrac14$." },
      { t: "Its two assumptions, both strong", d: "All outcomes equally likely, and finitely many of them. Symmetry sometimes justifies the first — a cube has six identical faces — but a loaded die has six outcomes too." },
      { t: "Life on Neptune", d: "Either there is or there is not, so the naive definition says $\\tfrac12$. Then intelligent life on Neptune is also $\\tfrac12$ — which cannot be, since it must be strictly less likely. Listing two cases is not the same as showing they are equally likely, and this argument appears in the news regularly." },
      { t: "The multiplication rule", d: "If experiment 1 has $n_{1}$ outcomes and, whatever happened there, experiment 2 has $n_{2}$, and so on, the combined experiment has $n_{1}n_{2}\\cdots n_{r}$ outcomes. Picture the tree: two cone types branching into three flavours is six leaves, and $2\\times3 = 3\\times2$, so the order you branch in does not matter." },
      { t: "Which is why listing is hopeless", d: "Ten binary choices already give $2^{10} = 1024$ leaves. Counting has to replace enumerating almost immediately." },
      { t: "The binomial coefficient, derived not memorised", d: "$\\binom{n}{k} = \\frac{n!}{(n-k)!\\,k!}$, and it is 0 when $k \\gt n$. Pick in order — $n(n-1)\\cdots(n-k+1)$ ways — then divide by $k!$, because you counted every subset once per ordering." },
      { t: "A full house, by the tree", d: "Choose the rank you hold three of (13), choose which three of its four suits $\\binom43$, choose the other rank (12, not 13), choose two of its suits $\\binom42$. Over $\\binom{52}{5}$ hands, that is about 0.00144." },
      { t: "The sampling table", d: "Choosing $k$ from $n$: with replacement and order mattering, $n^{k}$; without replacement and order mattering, $n(n-1)\\cdots(n-k+1)$; without replacement and order not mattering, $\\binom{n}{k}$. All three follow straight from the multiplication rule." },
      { t: "The fourth cell is much harder than the other three", d: "With replacement and order NOT mattering, the count is $\\binom{n+k-1}{k}$ — and nothing about the multiplication rule makes that obvious. It is worth checking on tiny cases before seeing the proof." },
    ],
    worked: "Write down a concrete instance before counting anything. 'Three sevens and two tens' is what makes the full-house count structured: it tells you there are two ranks to choose, in a definite role, and that the second choice has 12 options rather than 13.",
    watch: "Applying the naive definition because the outcomes are easy to list. The question is never how many cases there are but whether they are equally likely — and a sentence saying why should appear in the solution, not just the fraction.",
    concepts: [],
    checks: [
      { q: "Why is 'either there is life on Neptune or there is not, so $P = \\tfrac12$' wrong?", opts: ["Because the sample space is infinite", "Because listing two outcomes does not make them equally likely, and the naive definition requires that", "Because probability cannot apply to astronomy", "Because the events are not disjoint"], a: 1,
        expl: "The same argument gives $\\tfrac12$ for intelligent life, which must be strictly less probable than life. The contradiction exposes the missing justification rather than an arithmetic slip." },
      { q: "The probability of a full house in a five-card hand, to five decimal places, is:", num: 0.00144,
        expl: "$\\dfrac{13\\binom43\\cdot12\\binom42}{\\binom{52}{5}} = \\dfrac{3744}{2598960} = 0.001441$. The second rank has 12 choices, not 13 — it cannot repeat the first." },
      { q: "Choosing 3 items from 10 with replacement, order not mattering, the number of possibilities is:", num: 220,
        expl: "$\\binom{n+k-1}{k} = \\binom{12}{3} = 220$ — the one cell of the sampling table that does not fall out of the multiplication rule. Compare $10^{3} = 1000$ when order does matter." },
    ],
  },

  "math130.0.1": {
    takeaway: "A story proof counts the same thing two ways and reads off the identity — and the whole of probability rests on just two axioms once you stop assuming outcomes are equally likely.",
    beats: [
      { t: "Label everything", d: "Given $n$ people, $n$ elk or $n$ balls, imagine them numbered 1 to $n$. Ten green balls may look identical to you, but probability behaves as though they are distinguishable, and reasoning as if they are not will give wrong answers." },
      { t: "Check answers by extreme and simple cases", d: "Looking over your work again finds nothing, because you will make the same mistake twice. Plug in $k=0$, $k=1$, $n=2$ — the simplest NONTRIVIAL case is usually the informative one." },
      { t: "Teams of 4 and 6 versus two teams of 5", d: "$\\binom{10}{4}$ splits into a 4 and a 6, because naming the four names the six. But two teams of 5 is $\\binom{10}{5}/2$: with no jerseys to tell them apart, choosing $\\{1..5\\}$ and choosing $\\{6..10\\}$ are the same split counted twice." },
      { t: "Which also proves $\\binom{n}{k} = \\binom{n}{n-k}$", d: "Choose who is in or choose who is out. One sentence, no factorials — that is a story proof: proof by interpretation rather than by algebra." },
      { t: "Stars and bars", d: "Choosing $k$ from $n$ with replacement, order not mattering, is the same problem as putting $k$ INDISTINGUISHABLE particles into $n$ distinguishable boxes. Encode a configuration as $k$ dots and $n-1$ separators; choose which of the $n+k-1$ positions hold the dots. Hence $\\binom{n+k-1}{k}$." },
      { t: "Recognising two problems are the same is the hard skill", d: "Nothing in the original wording mentions particles or boxes. Seeing that the dot diagram already IS the answer is pattern recognition, and it is what the course is training." },
      { t: "Bose, Einstein, and when indistinguishability is real", d: "For two coins we count four outcomes even when the coins look identical, because they are really labelled. Bose proposed that certain particles have only THREE — no distinction between HT and TH — was laughed at, wrote to Einstein, and the two predicted a state of matter observed seventy years later. For probability, the labelled model is almost always the right one." },
      { t: "The committee-with-a-president identity", d: "$k\\binom{n}{k} = n\\binom{n-1}{k-1}$. Choose the committee then its chair, or choose the chair then the rest of the committee from those remaining. Both count the same configurations, so they are equal." },
      { t: "Vandermonde, which algebra makes horrible", d: "$\\binom{m+n}{k} = \\sum_{j=0}^{k}\\binom{m}{j}\\binom{n}{k-j}$. Split the $m+n$ people into a group of $m$ and a group of $n$; any choice of $k$ takes $j$ from the first and $k-j$ from the second, and the cases are disjoint. Four lines instead of a page of cancelling factorials." },
      { t: "A probability space is a pair", d: "$S$, the sample space, and $P$, a function whose INPUT is an event — a subset of $S$ — and whose output is a number in $[0,1]$. Note that $P$ does not take outcomes; it takes sets." },
      { t: "Axiom 1: the two extremes", d: "$P(\\varnothing)=0$ and $P(S)=1$. An event occurs when the realised outcome lies in it; nothing lies in the empty set, and everything lies in $S$." },
      { t: "Axiom 2: countable additivity", d: "$P\\left(\\bigcup_{n}A_{n}\\right) = \\sum_{n}P(A_{n})$ when the $A_{n}$ are DISJOINT. That condition is the whole content. Every theorem in probability follows from these two rules." },
    ],
    worked: "When an identity looks like a nightmare in algebra, read both sides as counting instructions. $\\binom{m+n}{k}$ says 'choose $k$ from two groups combined'; the sum says 'choose $j$ from one and the rest from the other'. If both descriptions count the same configurations, the identity is proved.",
    watch: "Dividing by 2 out of habit, or failing to. The question is whether anything distinguishes the two groups: teams of 4 and 6 differ by size, two teams of 5 do not. Ask what makes two outcomes different before deciding whether you have double-counted.",
    concepts: [],
    checks: [
      { q: "Why is splitting 10 people into two teams of 5 counted as $\\binom{10}{5}/2$?", opts: ["Because order matters within a team", "Because nothing distinguishes the teams, so each split is counted once as 'this five' and once as 'the other five'", "Because $\\binom{10}{5}$ is even", "It should not be divided; the answer is $\\binom{10}{5}$"], a: 1,
        expl: "With a team of 4 and a team of 6, naming one names the other unambiguously. Two equal unlabelled teams have no such asymmetry, so every split appears twice." },
      { q: "The number of ways to split 10 people into two unlabelled teams of 5 is:", num: 126,
        expl: "$\\binom{10}{5}/2 = 252/2 = 126$. Equivalently, fix person 1 onto a team and choose their four teammates: $\\binom{9}{4} = 126$." },
      { q: "$\\displaystyle\\sum_{j=0}^{5}\\binom{3}{j}\\binom{5}{5-j}$ equals:", num: 56,
        expl: "Vandermonde with $m=3$, $n=5$, $k=5$ gives $\\binom{8}{5} = 56$. The terms with $j \\gt 3$ vanish, since $\\binom{3}{j} = 0$ there." },
    ],
  },

  "math130.0.2": {
    takeaway: "Twenty-three people suffice for a better-than-even birthday match, because the quantity that matters is not $k$ but the $\\binom{k}{2}$ PAIRS — and inclusion-exclusion is the general tool for the probability of a union.",
    beats: [
      { t: "State the assumptions before computing anything", d: "365 days, equally likely, births independent. None is exactly true — there are real seasonal effects, and they differ by country — but each has to be said out loud, because the naive definition depends on them." },
      { t: "Above 365 people the answer is 1", d: "More people than days means some day holds two, by the pigeonhole principle. Worth stating: it is the sanity check at the extreme end." },
      { t: "Compute the complement", d: "$P(\\text{no match}) = \\dfrac{365\\cdot364\\cdots(365-k+1)}{365^{k}}$, then subtract from 1. Count the terms carefully — the last is $365-k+1$, and being off by one here is the classic error." },
      { t: "The numbers", d: "$k=23$ gives 50.7%; $k=50$ gives 97%; $k=100$ gives over 99.999%. Almost everyone guesses something above 100 for the first one." },
      { t: "Why 23 is not absurd", d: "$\\binom{23}{2} = 253$ pairs. You are not asking about one coincidence but about 253 chances at a coincidence, and 253 is the same order as 365. Looking at $k$ is intuitive and is the wrong quantity." },
      { t: "The same question, one day apart, needs only 14", d: "And proving THAT is much harder — you cannot just replace 364 by 362, because the excluded days overlap as the year fills up. Approximation methods later in the course handle it." },
      { t: "The complement rule, proved from the axioms", d: "$S = A \\cup A^{c}$, disjoint, so $1 = P(A) + P(A^{c})$. Two lines from axioms 1 and 2." },
      { t: "Monotonicity", d: "If $A \\subseteq B$ then $P(A) \\le P(B)$: write $B = A \\cup (B \\cap A^{c})$, disjoint, so $P(B) = P(A) + \\text{something} \\ge 0$." },
      { t: "Disjointification", d: "Axiom 2 only applies to disjoint events, so make them disjoint: $A\\cup B = A \\cup (B\\cap A^{c})$. That single move is behind both of the proofs above and the next one." },
      { t: "The union of two events", d: "$P(A\\cup B) = P(A)+P(B)-P(A\\cap B)$. Add both areas, then remove the overlap you counted twice." },
      { t: "Inclusion-exclusion in general", d: "Add the singles, subtract the pairs, add the triples, alternating. For three events the triple intersection is added three times and subtracted three times, so it must be added back once — which is exactly what the pattern does." },
      { t: "De Montmort's matching problem", d: "Shuffle cards numbered 1 to $n$ and count as you turn them over; you win if some card's position equals its number. $P(A_{j}) = 1/n$ by symmetry, $P(A_{1}\\cap\\cdots\\cap A_{k}) = (n-k)!/n!$, and inclusion-exclusion collapses almost everything." },
      { t: "And the answer is $1 - 1/e$", d: "What survives is $1 - \\frac{1}{2!} + \\frac{1}{3!} - \\cdots$, the Taylor series for $e^{-1}$. About 0.632, and — remarkably — it barely changes with $n$. This constant will keep appearing." },
    ],
    worked: "Ask whether the event or its complement is easier to count. 'No two share a birthday' is a clean product; 'at least one pair shares' is a mess of overlapping cases. The complement rule makes that a free choice.",
    watch: "Trusting intuition about coincidences. The biggest coincidence would be no coincidences at all: count how many opportunities there are for the event, not how many objects there are.",
    concepts: [],
    checks: [
      { q: "Why does 23 people suffice for a better-than-even birthday match?", opts: ["Because $365/23 \\approx 16$", "Because there are $\\binom{23}{2} = 253$ pairs, and 253 is comparable to 365", "Because birthdays are not really uniform", "Because of the pigeonhole principle"], a: 1,
        expl: "The event is about pairs, not people, and pairs grow quadratically. That is why the intuitive answer — something over 100 — is so far out." },
      { q: "The probability of a birthday match among 23 people, to three decimal places, is:", num: 0.507,
        expl: "$1 - \\frac{365\\cdot364\\cdots343}{365^{23}} = 0.5073$. The first $k$ for which it exceeds a half." },
      { q: "The probability of at least one match in de Montmort's card game with 52 cards, to three decimal places, is:", num: 0.632,
        expl: "$1 - \\frac{1}{2!} + \\frac{1}{3!} - \\cdots \\to 1 - e^{-1} = 0.6321$. Equivalently $1 - D_{n}/n!$, where $D_{n}$ counts the derangements." },
    ],
  },

  "math130.0.3": {
    takeaway: "Conditional probability is $P(A\\mid B) = \\dfrac{P(A\\cap B)}{P(B)}$ — restrict the world to $B$ and renormalise — and conditioning is the soul of statistics, because it is how beliefs get updated by evidence.",
    beats: [
      { t: "The matching problem, finished", d: "There are $\\binom{n}{k}$ intersections of size $k$, each of probability $\\frac{(n-k)!}{n!}$, and the product collapses to $\\frac{1}{k!}$. So $P(\\text{match}) = 1 - \\frac{1}{2!} + \\frac{1}{3!} - \\cdots$ and $P(\\text{no match}) \\to e^{-1} \\approx 0.37$." },
      { t: "And it converges absurdly fast", d: "Even at $n=10$ the answer agrees with $1/e$ to about $10^{-8}$. Two competing forces — each card is unlikely to match, but there are many cards — balance out at a constant, which is not what most people guess." },
      { t: "Independence means multiply", d: "$A$ and $B$ are independent when $P(A\\cap B) = P(A)P(B)$. Nothing about vagueness like 'one tells you nothing about the other' — that is the intuition, this is the test." },
      { t: "Independent is not disjoint, and confusing them is a disaster", d: "Disjoint means that if $A$ occurs then $B$ CANNOT. That is the opposite of independence, which says $A$ occurring tells you nothing about $B$." },
      { t: "Three events need four equations, not three", d: "All three pairs independent — pairwise independence — does NOT imply $P(A\\cap B\\cap C) = P(A)P(B)P(C)$, and neither implies the other. For $n$ events, every subset must factor." },
      { t: "Newton and Pepys", d: "At least one six in 6 dice, at least two in 12, or at least three in 18 — which is likeliest? Pepys believed the third and bet on it. The answer is the first: 0.665, 0.619, 0.597." },
      { t: "'At least one' means take the complement", d: "$P(\\text{at least one six in }6) = 1 - (5/6)^{6}$. A union invites inclusion-exclusion, but its complement is an intersection of independent events, which is just a product." },
      { t: "The binomial probability, derived on the spot", d: "$P(\\text{exactly }k\\text{ sixes in }n) = \\binom{n}{k}\\left(\\frac16\\right)^{k}\\left(\\frac56\\right)^{n-k}$: choose which positions hold the sixes, then fix each die. Worth deriving rather than memorising, because it will recur constantly." },
      { t: "Newton's arithmetic was right and his intuition was wrong", d: "Stigler showed the intuitive argument had to be wrong WITHOUT decoding it: nothing in it used the fairness of the dice, yet with unfair dice the ordering can reverse. An argument that is insensitive to something the answer depends on cannot be correct." },
      { t: "Pebble world", d: "Draw the sample space as pebbles whose masses sum to 1. Conditioning on $B$ means deleting every pebble outside $B$ and then RENORMALISING so the remaining masses sum to 1 again — which is exactly the division by $P(B)$." },
      { t: "Frequentist world", d: "Repeat the experiment many times, circle the repetitions where $B$ happened, and ask what fraction of THOSE also had $A$. Same formula, a different picture of what it means." },
      { t: "Three theorems, all one line", d: "$P(A\\cap B) = P(B)P(A\\mid B) = P(A)P(B\\mid A)$; the chain rule $P(A_{1}\\cap\\cdots\\cap A_{n}) = P(A_{1})P(A_{2}\\mid A_{1})\\cdots$; and Bayes' rule $P(A\\mid B) = \\frac{P(B\\mid A)P(A)}{P(B)}$. The proofs are trivial; the implications have kept statisticians arguing for two centuries." },
      { t: "The chain rule can be applied in any order", d: "There are $n!$ orderings, and they are all valid. On a given problem one may be routine and another intractable, so the ordering is a choice worth making deliberately." },
    ],
    worked: "When an event says 'at least one', reach for the complement before reaching for inclusion-exclusion. The complement of a union is an intersection, and if the pieces are independent an intersection is a product.",
    watch: "Treating independence and disjointness as similar because both sound like 'unrelated'. Disjoint events are maximally DEPENDENT: knowing one occurred tells you the other definitely did not.",
    concepts: [],
    checks: [
      { q: "$A$ and $B$ are disjoint with $P(A), P(B) \\gt 0$. Are they independent?", opts: ["Yes — disjoint events never interact", "No — $P(A\\cap B) = 0$ while $P(A)P(B) \\gt 0$, so they are strongly dependent", "Only if $P(A) = P(B)$", "It cannot be determined"], a: 1,
        expl: "Knowing $A$ occurred tells you $B$ certainly did not, which is the most informative thing one event can say about another." },
      { q: "The probability of at least one six in six fair dice, to three decimal places, is:", num: 0.665,
        expl: "$1 - (5/6)^{6} = 0.6651$. This is Pepys's option A, and the largest of the three — against his own strong belief." },
      { q: "The probability of at least three sixes in eighteen fair dice, to three decimal places, is:", num: 0.597,
        expl: "$1 - \\sum_{k=0}^{2}\\binom{18}{k}(1/6)^{k}(5/6)^{18-k} = 0.5973$ — the least likely of the three, and the one Pepys bet on." },
    ],
  },

  "math130.0.4": {
    takeaway: "Break a hard probability into disjoint cases and add them up — the law of total probability — and pair it with Bayes' rule, because the quantity you want is almost never the one you were given.",
    beats: [
      { t: "The general strategy is decomposition", d: "Partition $S$ into disjoint $A_{1},\\ldots,A_{n}$ covering everything. Then $P(B) = \\sum_{i}P(B\\mid A_{i})P(A_{i})$. The proof is immediate from axiom 2; the ART is choosing a partition that makes each piece easy, and a bad choice turns one hard problem into $n$ hard problems." },
      { t: "Two cards, two conditions, two very different answers", d: "$P(\\text{both aces}\\mid\\text{have an ace}) = \\frac{\\binom42/\\binom{52}{2}}{1-\\binom{48}{2}/\\binom{52}{2}} = \\frac{1}{33}$. But $P(\\text{both aces}\\mid\\text{have the ace of spades}) = \\frac{3}{51} = \\frac{1}{17}$ — by symmetry, the other card is equally likely to be any of 51." },
      { t: "Why naming the suit almost doubles it", d: "The answer would be $1/17$ for hearts, clubs or diamonds too, so the suit is irrelevant — and yet not naming it gives $1/33$. 'At least one ace' is a union; 'the ace of spades' identifies a specific card and lets you draw the hand. The two conditions are not the same information." },
      { t: "A test that is 95% accurate", d: "Interpret it: $P(T\\mid D) = 0.95$ and $P(T^{c}\\mid D^{c}) = 0.95$. Say which conditional you mean before computing anything — 'accurate' on its own is not a number." },
      { t: "The patient wants the other conditional", d: "$P(T\\mid D)$ is what the manufacturer advertises; $P(D\\mid T)$ is what the patient cares about. Bayes' rule connects them: $P(D\\mid T) = \\frac{P(T\\mid D)P(D)}{P(T)}$, with the denominator supplied by the law of total probability." },
      { t: "And the answer is about 16%", d: "With a 1% base rate: in 1000 patients, 10 have the disease and nearly all test positive, while about 50 of the 990 healthy ones test positive too. Ten out of sixty is roughly a sixth. Asked this, most of a group of Harvard doctors guessed around 95%." },
      { t: "Because intuition ignores the base rate", d: "People attend to how rarely the test errs and forget how rarely the disease occurs. The two rarities compete, and here the rarity of the disease wins." },
      { t: "Biohazard 1: the prosecutor's fallacy", d: "Confusing $P(A\\mid B)$ with $P(B\\mid A)$. Sally Clark was convicted on $P(\\text{two cot deaths}\\mid\\text{innocent}) = 1/73{,}000{,}000$ — a figure that assumed independence with no justification — presented as though it were $P(\\text{innocent}\\mid\\text{evidence})$. Bayes' rule would have carried a prior for innocence that is extremely close to 1. She served years before the conviction was overturned." },
      { t: "Biohazard 2: prior versus posterior", d: "Being told that $A$ occurred does NOT mean writing $P(A)=1$. It means $P(A\\mid A)=1$. Deciding what goes left and right of the bar is most of the work." },
      { t: "Biohazard 3: conditional independence is a different thing", d: "$A$ and $B$ are conditionally independent given $C$ when $P(A\\cap B\\mid C) = P(A\\mid C)P(B\\mid C)$. Neither direction implies the other." },
      { t: "Conditionally independent but not independent", d: "Games against a chess opponent of unknown strength are independent GIVEN their strength — but not unconditionally, because winning the first five tells you a great deal about the sixth." },
      { t: "Independent but not conditionally independent", d: "Fire and popcorn are independent causes of the alarm. Given that the alarm sounded, ruling out popcorn makes fire certain — so conditioning on a common EFFECT creates dependence between its causes." },
      { t: "Bayes' rule is coherent", d: "Update on two clues at once, or on one and then the other, or in the reverse order: the posterior is the same. Evidence can arrive in any sequence without disturbing the conclusion." },
    ],
    worked: "When Bayes' rule leaves you needing $P(B)$ in the denominator, that is the cue for the law of total probability. Partition on the thing you are trying to infer — disease or not, guilty or not — and the denominator becomes two easy terms with the numerator already among them.",
    watch: "Quoting a conditional probability without saying which way round it runs. 'The test is 95% accurate' and 'there is a 1 in 73 million chance she is innocent' are both statements whose direction was never checked, and in one case it cost someone years of their life.",
    concepts: [],
    checks: [
      { q: "Fire and popcorn are independent causes of an alarm. Given the alarm sounds, are they still independent?", opts: ["Yes — independence is a property of the events themselves", "No — conditioning on a common effect makes the causes compete to explain it, so ruling one out raises the other", "Only if they are equally likely", "Yes, provided the alarm is reliable"], a: 1,
        expl: "If the alarm sounds and nobody is making popcorn, fire becomes certain. Unconditional independence says nothing about what happens once you condition on something both causes influence." },
      { q: "With a 1% base rate and a test that is 95% accurate in both directions, $P(\\text{disease}\\mid\\text{positive})$, to three decimal places, is:", num: 0.161,
        expl: "$\\frac{0.95\\times0.01}{0.95\\times0.01 + 0.05\\times0.99} = \\frac{0.0095}{0.059} = 0.161$. The 49.5 false positives per thousand swamp the 9.5 true ones." },
      { q: "$P(\\text{both cards are aces}\\mid\\text{the hand contains the ace of spades})$, to three decimal places, is:", num: 0.059,
        expl: "$3/51 = 1/17 = 0.0588$. Nearly double the $1/33 = 0.0303$ you get from the weaker condition 'the hand contains an ace'." },
    ],
  },

});
