// Brickford — lecture summaries, AI 200 (Neural Networks: Zero to Hero)
//
// T-033. Every entry here was written FROM its source after reading the whole of
// it. Both YouTube transcript tools are down, so under the spec's amendment of
// 2026-10-14 ("course materials now, transcripts later") Unit II is written from
// Karpathy's own companion material on GitHub — the lecture notebooks in
// karpathy/nn-zero-to-hero and the repositories each lecture builds (micrograd,
// makemore, ng-video-lecture, minbpe, build-nanogpt), pinned by commit in T-033's
// sources.json. A question tests only what that material shows the lecture does.
// Units I and III (3Blue1Brown, the two big-picture talks) wait for transcripts.
//
// Same shape as the other summary files, plus optional fields on each check:
//   src — the file and cell or section where the point is made;
//   at  — the second in the video, added once transcripts can be read again.
// tools/verify-content.js holds each quiz to the size the lecture's LENGTH sets
// (5 / 6 / 8), recomputes every numeric answer independently, and bounds how
// often the answer is the unique longest option.
//
// No concepts and no figures: DAR.CONCEPTS and DAR.FIG are linear algebra, so
// `concepts: []` is the correct value here.
window.DAR = window.DAR || {};

DAR.SUMMARIES = Object.assign(DAR.SUMMARIES || {}, {

  "ai200.1.0": {
    takeaway: "Backpropagation is the chain rule applied node by node over an expression graph: each operation knows only its local derivative, gradients flow from the output back through a topological order, and they ADD wherever a value is used more than once — about a hundred lines of Python, and the same numbers PyTorch gives.",
    beats: [
      { t: "A derivative is a nudge", d: "Bump an input by a tiny h and see how much the output moves: $(f(x+h)-f(x))/h$. For $f(x) = 3x^2 - 4x + 5$ the slope is about 0 at $x = 2/3$. For $d = a b + c$, nudging $c$ by $h$ moves $d$ by exactly $h$ — the slope with respect to $c$ is 1." },
      { t: "Value: a number that remembers where it came from", d: "A Value wraps a scalar and records its children and the operation that produced it, so a calculation builds an expression graph as it runs. Each node also carries grad — the derivative of the final output with respect to it — starting at 0." },
      { t: "Backprop by hand", d: "Set the output's grad to 1 and walk backwards. A + node passes its gradient to both inputs unchanged; a * node gives each input the other input's value times the gradient. That is the chain rule, applied locally. Nudging every leaf a little in the direction of its gradient raises L from -8 to about -7.29, as predicted." },
      { t: "A neuron, and tanh's local derivative", d: "A neuron computes $\\tanh(w \\cdot x + b)$. Its local derivative is $1 - o^2$, so at $o = 0.7071$ it is 0.5. Each operation gets a _backward closure that applies exactly its own local rule." },
      { t: "backward(): topological order, then reverse", d: "Build a topological ordering of the graph, set the root's grad to 1, and call each node's _backward in reverse order — so a node passes gradient to its inputs only once every node that uses it has passed gradient into it." },
      { t: "Gradients accumulate", d: "If a value is used twice — b = a + a — both paths contribute, and a.grad must be 2, not 1. So every _backward uses +=, never =. The notebook flags the one place the video got this wrong (the exp backward) and fixes it." },
      { t: "How finely to break operations is a choice", d: "Rewriting tanh as $(e^{2n}-1)/(e^{2n}+1)$ with exp, power, subtraction and division gives the same forward value and the same gradients. Supporting constants takes a few small methods (__radd__, __rmul__, __neg__, __sub__, __truediv__ via a power of -1)." },
      { t: "PyTorch says the same", d: "The same neuron in PyTorch, with requires_grad on scalar tensors, gives o = 0.7071 and the same gradients for x1, w1, x2, w2. PyTorch works on tensors; micrograd on single numbers — which is why micrograd chops each neuron into individual adds and multiplies." },
      { t: "A tiny neural net library, and training it", d: "Neuron, Layer and MLP, each with parameters(). MLP(3, [4, 4, 1]) is trained on four examples: forward pass, loss = sum of squared errors, reset every grad to 0, loss.backward(), then step each parameter by -0.1 times its gradient. The loss falls and the predictions approach the targets." },
      { t: "The micrograd repository", d: "About 100 lines of engine and 50 of nn, with ReLU neurons. Its demo trains MLP(2, [16, 16, 1]) — 337 parameters — on the two-moons data with a max-margin loss plus L2 regularization and SGD with a decaying learning rate, reaching 100% training accuracy; its tests check forward values and gradients against PyTorch." },
    ],
    worked: "To trust a gradient, check it two ways. Compute it with backward(), then nudge that one input by a small h and measure $(L(x+h) - L(x))/h$ — the notebook's lol() does exactly this and gets -3.99999 for dL/db where backprop says -4. Then, for a whole model, compare against PyTorch on the same inputs, as the repository's tests do.",
    watch: "Forgetting that gradients accumulate. Because _backward adds into grad, a training loop that does not reset every parameter's grad to 0 before loss.backward() steps on the sum of all past gradients — and writing = instead of += in a _backward silently drops every path but the last.",
    concepts: [],
    checks: [
      { q: "The lecture starts from $f(x) = 3x^2 - 4x + 5$ and estimates slopes by nudging x by a tiny h. What is the slope of f at $x = 3$?", num: 14, src: "micrograd_lecture_first_half_roughly.ipynb, cells 2-5",
        expl: "The nudge estimates the derivative $f'(x) = 6x - 4$, so at $x = 3$ the slope is 14: raise x by h and f rises by about 14h. At $x = 2/3$ the same estimate gives about 0 — the bottom of the parabola." },
      { q: "During backprop, a + node receives gradient g from above. What does it pass to each of its two inputs?", opts: ["g to each input, unchanged, since a sum's local derivative is 1", "g/2 to each input, so that the total gradient is preserved", "g times the other input's value, as for a multiplication", "Nothing at all: a sum has no parameters, so it stops the gradient"], a: 0, src: "micrograd_lecture_first_half_roughly.ipynb, cells 7-8",
        expl: "Nudging c in d = a*b + c moves d by exactly h, so the local derivative is 1, and the chain rule multiplies g by 1 for both inputs — a + node routes the gradient through to everything that feeds it. Multiplying by the other input's value is the rule for *." },
      { q: "With a = 2, b = -3, c = 10, f = -2 and L = (a*b + c)*f, what is dL/db?", num: -4, src: "micrograd_lecture_first_half_roughly.ipynb, cells 8 and 12",
        expl: "Chain rule: dL/dd = f = -2, dd/de = 1, and de/db = a = 2, so dL/db = -2 x 1 x 2 = -4. The notebook's lol() checks it numerically by nudging b and gets -3.99999." },
      { q: "Why does backward() first build a topological ordering of the graph and then call each node's _backward in reverse?", opts: ["So that the leaf nodes are visited first and their gradients are set to 1", "So that each node's gradient is complete before it is passed further back", "So that the graph can be drawn left to right by draw_dot afterwards", "So that each node is visited twice, once per input it happens to have"], a: 1, src: "micrograd_lecture_first_half_roughly.ipynb, cells 8 and 17",
        expl: "A node's _backward pushes its own grad into its inputs. If it ran before every node that uses it had contributed, it would push an incomplete gradient. Reversing a topological order guarantees all of a node's consumers run first. Only the root is set to 1." },
      { q: "b = a + a, then b.backward(). a.grad should be 2. Why must every _backward use += rather than =?", opts: ["Because = would make a.grad negative when a appears twice", "Because Python does not allow = on attributes inside closures", "Because a value used twice gets gradient from both uses, so they add", "Because += is faster when the graph grows to many thousands of nodes"], a: 2, src: "micrograd_lecture_first_half_roughly.ipynb, cell 32; second half, cell 8",
        expl: "Here both inputs of the + node are the same object, so with = the second assignment overwrites the first and a.grad ends at 1. By the multivariable chain rule the contributions add. The notebook notes the video used = in the exp backward and fixes it." },
      { q: "The second notebook rebuilds the neuron with tanh written as $(e^{2n}-1)/(e^{2n}+1)$, using exp, subtraction and division. What does that show?", opts: ["That exp must be avoided, since it changes the gradients of the inputs", "That tanh needs its own backward method, as the composite version is wrong", "That division cannot be backpropagated until it is rewritten as a sum", "That any breakdown of the operations gives the same values and gradients"], a: 3, src: "micrograd_lecture_second_half_roughly.ipynb, cells 8 and 12",
        expl: "The forward value and every gradient come out the same as with the single tanh node. How finely you break a function into operations is up to you; all that matters is that each operation knows its own local derivative — exp's is its output, a power's is $n x^{n-1}$, and division is multiplication by a power of -1." },
      { q: "MLP(3, [4, 4, 1]) as built in the lecture: each neuron has one weight per input plus a bias. How many parameters does it have?", num: 41, src: "micrograd_lecture_second_half_roughly.ipynb, cells 15-16",
        expl: "Layer sizes 3 to 4 to 4 to 1. First layer: 4 neurons x (3 + 1) = 16; second: 4 x (4 + 1) = 20; output: 1 x (4 + 1) = 5. Total 41. The repository's demo, MLP(2, [16, 16, 1]), has 48 + 272 + 17 = 337." },
      { q: "In the training loop, what goes wrong if you delete the line that sets every p.grad to 0 before loss.backward()?", opts: ["Each step uses the sum of all past gradients, since backward adds into grad", "Nothing changes, because backward() always overwrites the old gradients", "The loss can no longer be computed, because grad is read in the forward pass", "The update flips sign, so gradient descent turns into gradient ascent"], a: 0, src: "micrograd_lecture_second_half_roughly.ipynb, cell 18",
        expl: "Because every _backward does +=, gradients pile up across iterations unless reset — the repository wraps this as zero_grad(). The update itself is p.data += -0.1 * p.grad: minus, to step against the gradient and lower the loss, where the first notebook stepped WITH the gradient to make L go up." },
    ],
  },

  "ai200.1.1": {
    takeaway: "A bigram language model can be built two ways — count which character follows which and normalise, or train a one-layer net with a softmax on the negative log likelihood — and the two arrive at the same model, which is the point: the neural framing is the one that scales.",
    beats: [
      { t: "One file of names, many examples", d: "32,033 names, 2 to 15 letters long. Each name is several examples at once: every character is evidence about which character follows it, and where names start and end." },
      { t: "Counting bigrams", d: "Wrap each name in start and end markers and count every adjacent pair. The final version uses one token, '.', at index 0 for both start and end, giving a 27 x 27 table N whose row i counts what follows character i." },
      { t: "From counts to samples", d: "Normalise each row into probabilities, start from '.', and draw the next character with torch.multinomial until '.' comes back. The names ('mor.', 'axx.', 'minaymoryles.') are bad — a bigram sees one character of context — but they are drawn from the data's statistics." },
      { t: "Broadcasting, carefully", d: "Normalise with P.sum(1, keepdims=True): a 27 x 1 column of row sums divides each ROW. P.sum(1) gives shape 27, which broadcasts as a 1 x 27 row and divides each COLUMN instead — no error, just a wrong model." },
      { t: "Scoring a model: negative log likelihood", d: "Maximising the likelihood of the data — the product of the probabilities assigned to every actual next character — is the same as minimising the average negative log likelihood. The smoothed count model scores 2.4765. Adding 1 to every count keeps any pair from having probability 0, which would make the loss infinite." },
      { t: "The same model as a neural net", d: "One-hot encode the input character and multiply by a 27 x 27 weight matrix W: that selects W's row for the character — 27 logits, read as log-counts. Exponentiate and normalise (together, a softmax) to get probabilities. The loss is the mean NLL of the correct next characters." },
      { t: "Training it", d: "On all 228,146 bigrams: forward, set W.grad to None, loss.backward(), W += -50 * W.grad. A regulariser, 0.01 * (W**2).mean(), pulls W toward zero, where all logits are equal and predictions are uniform — the gradient-based twin of adding counts." },
      { t: "Same destination", d: "The trained net reaches a loss of about 2.48, the counts' level, and with the same random seed it samples almost exactly the same names. The difference is what comes next: the table cannot grow to longer contexts, and the net can." },
    ],
    worked: "Index the probabilities of the right answers in one step — probs[torch.arange(n), ys] — take the log, average and negate: that is the loss, for the count table and the network alike. Then compare it against the counts model's 2.48 as the target a one-character-context model can reach.",
    watch: "Dropping keepdims=True when normalising. P.sum(1) has shape 27 and broadcasts as a row, so each column is divided by a row's total. Nothing errors and the samples still look plausible; only the numbers are wrong.",
    concepts: [],
    checks: [
      { q: "The first count table marks names with separate start and end tokens; the final one uses a single '.' at index 0 for both. Why is one token enough?", opts: ["Names never contain a dot, so the model cannot mistake it for a letter", "A start only ever opens a bigram and an end only closes one, so they never clash", "PyTorch needs the count table to be square, so the two markers had to be merged", "One shared token means every sampled name starts and ends with one letter"], a: 1, src: "makemore_part1_bigrams.ipynb, cells 6 and 9-11",
        expl: "A start token only ever appears as the first character of a bigram and an end token only as the second, so one symbol can play both roles without ambiguity. With two tokens the table had a row for the end token and a column for the start token that could only ever hold zeros." },
      { q: "How many training bigrams does the name 'isabella' contribute, once it is wrapped in the start/end token?", num: 9, src: "makemore_part1_bigrams.ipynb, cells 11 and 28",
        expl: "'.isabella.' has 10 symbols, so 9 adjacent pairs: one for the first letter, seven between letters, and one for the end. In general a name of n letters gives n + 1 examples — 'emma' gives the 5 shown in the notebook." },
      { q: "P is 27 x 27. Why must each row be divided by P.sum(1, keepdims=True) rather than by P.sum(1)?", opts: ["keepdims makes the sum run over columns instead of rows, as is needed", "Without keepdims PyTorch raises an error, because the shapes cannot broadcast", "The two are the same; keepdims only changes how the result is printed", "Without keepdims the sums broadcast as a row, and columns get divided"], a: 3, src: "makemore_part1_bigrams.ipynb, cells 19-24",
        expl: "P.sum(1, keepdims=True) is 27 x 1, which stretches across the columns, so row i is divided by row i's total. P.sum(1) is shape 27; broadcasting aligns it from the right as 1 x 27, so column j is divided by row j's total — silently wrong." },
      { q: "Why does the count model normalise N + 1 rather than N itself?", opts: ["To shift every index up by one, since '.' takes index 0 in the count table", "To make every row sum to exactly one before the division happens", "So no bigram has probability zero, which would make the loss infinite", "To speed up sampling by removing zeros from the multinomial draw"], a: 2, src: "makemore_part1_bigrams.ipynb, cells 24 and 27",
        expl: "A pair never seen in training would get probability 0, its log would be minus infinity, and the average NLL of any name containing it would be infinite. Adding a fake count everywhere smooths the model; more added counts make it more uniform." },
      { q: "A model that gives every one of the 27 characters probability 1/27 — what average negative log likelihood does it score? Two decimal places.", num: 3.3, tol: 0.01, src: "makemore_part1_bigrams.ipynb, cells 26-27 and 47",
        expl: "Each example costs $-\\ln(1/27) = \\ln 27 \\approx 3.30$. The count model gets down to 2.48; the randomly initialised network starts on 'emma' at 3.77 — worse than uniform, because random weights are confidently wrong." },
      { q: "In the network, what does xenc @ W compute when xenc is a one-hot vector?", opts: ["It picks out W's row for the input character: 27 logits, read as log-counts", "It adds up W's column for that character into one single combined score", "It sorts the 27 characters by their weights before the softmax runs", "It scales each weight by the character's index, so later letters count more"], a: 0, src: "makemore_part1_bigrams.ipynb, cells 31-45",
        expl: "Multiplying a one-hot row by a matrix selects one row of the matrix. So W plays the role of the log of the count table: exponentiating gives 'counts' and normalising gives probabilities — the softmax." },
      { q: "The final loss adds 0.01 * (W**2).mean(). What does that term pull the model toward?", opts: ["Larger weights, so that common bigrams are predicted more confidently", "W near zero, where all logits are equal and predictions are uniform", "A faster effective learning rate, as the squared term has a bigger gradient", "Fewer parameters, by setting the least useful weights exactly to zero"], a: 1, src: "makemore_part1_bigrams.ipynb, cell 58",
        expl: "If W were all zeros, every logit would be 0, every count exp(0) = 1, and every next character equally likely. Penalising W's size pulls toward that uniform model — the same effect as adding fake counts to N, with 0.01 playing the role of the smoothing strength." },
      { q: "With the same seed, sampling from the trained network gives almost exactly the count model's names. Why?", opts: ["The sampling loop still reads the old count table P, not the network", "The seed fixes the names, whatever probabilities the model happens to give", "The net has learned nearly the same next-character odds as the count table", "Both models memorised the training names and replay them in the same order"], a: 2, src: "makemore_part1_bigrams.ipynb, cells 25 and 59",
        expl: "The network and the table are two parametrisations of the same bigram model, and training on the NLL drives the network to the table's probabilities (loss about 2.48). The sampling loop uses the network's softmax output — the notebook shows the old P line commented out." },
    ],
  },

  "ai200.1.2": {
    takeaway: "To see more than one character back, stop counting and learn: embed each character as a small vector, concatenate the last three, and feed them through a hidden layer — Bengio et al.'s MLP — trained on minibatches and judged on data it never trained on.",
    beats: [
      { t: "A context of three characters", d: "block_size = 3: each example is the previous three characters (padded with '.' at the start of a name) and the next character as the label. A name of n letters gives n + 1 examples." },
      { t: "Train, dev and test", d: "Shuffle the words and split 80 / 10 / 10 — 182,441, 22,902 and 22,803 examples. Train on the first, tune choices on the second, and keep the third for the end." },
      { t: "An embedding table", d: "C maps each of the 27 characters to a learned vector — 2 numbers at first, so the embedding can be plotted, then 10. C[X] looks up every character of every context at once." },
      { t: "Concatenate, then a hidden layer", d: "emb.view(-1, 30) lays each context's three 10-dimensional embeddings side by side as one 30-long vector; a 200-unit tanh layer and a 27-way output layer follow. 11,897 parameters in all, and F.cross_entropy computes the loss from the logits." },
      { t: "Minibatches", d: "Each step uses 32 random training examples, not all 182,441: the gradient is noisier but far cheaper, so the model can take hundreds of thousands of steps." },
      { t: "Finding a learning rate", d: "Sweep candidate rates evenly in the exponent — 10 to the power of linspace(-3, 0) — and watch the loss to find a good one. The final run uses 0.1 for 100,000 steps, then decays to 0.01." },
      { t: "Judge it on the dev set", d: "Training loss 2.126, dev loss 2.170: close, so the model is not simply memorising, and it beats the bigram model's 2.48. Samples ('kaleigh.', 'quinton.', 'jace.') now look much more like names." },
    ],
    worked: "Write every tensor's shape next to the line that makes it: X is (N, 3), C[X] is (N, 3, 10), the view is (N, 30), the hidden layer (N, 200), the logits (N, 27). Most bugs in this model are a shape that is not what you thought, and the comments in the notebook do exactly this.",
    watch: "Reporting the training loss as the model's quality. Only the dev split says how it does on names it has not seen; and the test split is spent once, at the end, or it stops being an honest measure.",
    concepts: [],
    checks: [
      { q: "C is 27 x 10, W1 is 30 x 200 with a bias of 200, W2 is 200 x 27 with a bias of 27. How many parameters does the MLP have?", num: 11897, src: "makemore_part2_mlp.ipynb, cells 23-24",
        expl: "Embedding 27 x 10 = 270; hidden layer 30 x 200 + 200 = 6,200; output layer 200 x 27 + 27 = 5,427. Total 11,897 — the notebook prints the same. Note the embedding table counts: it is learned like any other weight." },
      { q: "With block_size = 3, how many (context, next character) examples does the name 'emma' produce?", num: 5, src: "makemore_part2_mlp.ipynb, cell 5",
        expl: "Every character of 'emma.' is a target — e, m, m, a and the final '.' — each predicted from the three before it, padded with '.': '...' predicts e, '..e' predicts m, and so on. n letters give n + 1 examples." },
      { q: "Why does the forward pass reshape the embeddings with emb.view(-1, 30)?", opts: ["To average the three characters' embeddings into a single vector", "To lay the three 10-number embeddings side by side as one input", "To drop the batch dimension so the matrix multiply can broadcast", "To sort the context characters by index before the hidden layer"], a: 1, src: "makemore_part2_mlp.ipynb, cells 9-11 and 28",
        expl: "C[X] has shape (batch, 3, 10). The hidden layer wants one vector per example, so the three embeddings are concatenated into 30 numbers — keeping which character was where, which averaging would lose. The -1 lets PyTorch infer the batch size." },
      { q: "Each training step indexes 32 random rows of the training set. What does that buy?", opts: ["An exact gradient, because 32 examples cover all 27 characters", "Lower loss at the end, because small batches overfit much less", "A noisier but far cheaper gradient, so many more steps can be taken", "A larger learning rate, since 32 is the maximum the GPU can hold"], a: 2, src: "makemore_part2_mlp.ipynb, cell 28",
        expl: "A forward and backward pass over all 182,441 examples per step would be slow. A minibatch's gradient only approximates the full one, but it is good enough to move in a useful direction, and the run takes 200,000 such steps." },
      { q: "Why does the learning-rate sweep try 10 to the power of linspace(-3, 0) rather than evenly spaced rates?", opts: ["To try the rates evenly on a log scale, from 0.001 up to 1", "To make sure the very last rate tried is always exactly zero", "Because PyTorch only accepts learning rates that are powers of 10", "To spend most of the 1,000 tries on rates that are close to 1"], a: 0, src: "makemore_part2_mlp.ipynb, cells 26-28",
        expl: "What matters about a learning rate is its order of magnitude. Spacing the exponent evenly from -3 to 0 spreads the 1,000 candidates evenly across 0.001, 0.01, 0.1 and 1, so the loss-versus-exponent plot shows where training works. The run then settles on 0.1, decayed to 0.01." },
      { q: "After training, the loss is 2.126 on the training split and 2.170 on the dev split. What does that comparison tell you?", opts: ["The model is badly overfitting and the dev split should be discarded", "The dev split is easier, so its loss must be higher than the training one", "Little overfitting: it does nearly as well on names it never trained on", "The model has converged, so a bigger network could not do any better"], a: 2, src: "makemore_part2_mlp.ipynb, cells 30-31 and 33",
        expl: "Overfitting shows as a training loss far below the dev loss. Here they are close, so the model generalises — and both beat the bigram model's 2.48. A small gap is also a hint that the model has room to grow before it starts memorising." },
    ],
  },

});
