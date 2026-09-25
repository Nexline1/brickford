// Brickford — lecture summaries, SYS 250 (GPU & Systems Engineering)
//
// Two sources. Unit I is CMU 10-714, Deep Learning Systems: Algorithms and
// Implementation, with Zico Kolter and Tianqi Chen (2022): the course builds
// "needle", a small deep-learning framework, from automatic differentiation down
// to a GPU array backend. Unit II is the GPU MODE lecture series: profiling, the
// PMPP book, CUDA from Python, performance, reductions, Flash Attention, Triton,
// speculative decoding, tensor cores and Mosaic GPU.
//
// Same contract as the other summary files: written FROM the lecture, following
// the lecturer's own argument in his own order, keeping his examples. If a video
// has no captions, its entry says so in its first beat and is listed here.
//
// tools/verify-content.js enforces the shape and RECOMPUTES every numeric answer
// by a different route from the one the summary teaches: a gradient by central
// finite differences of the forward function, a count by walking the loops or
// the index space, an output size by sliding the window, a streamed or tiled
// computation against its direct form. Never Monte Carlo.
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

  "sys250.0.0": {
    takeaway: "Deep learning took off less because of any one model than because of easy automatic-differentiation libraries: a ConvNet that once took 44,000 lines and six months now takes about 100 lines and an afternoon. The core ideas underneath are few (automatic differentiation, gradient-based optimization, and fast linear algebra on GPUs), so you can build a capable framework, needle, in about 2,000 lines. Knowing how it works inside makes you faster with the real ones.",
    beats: [
      { t: "What deep learning can do", d: "Kolter's tour: AlexNet on ImageNet (2012), AlphaGo (2016), StyleGAN faces, GPT-3 writing a plausible if wrong course summary, AlphaFold 2, and Stable Diffusion painting 'a dog dressed as a university professor'. Small teams matter too: DeOldify's colourization was two people, and the timm image-model library started as one." },
      { t: "Why it took off when it did", d: "Google Trends for 'deep learning' barely moved after AlexNet. It rose with Keras, TensorFlow and PyTorch (2015–16). Kolter's claim: the biggest driver of adoption was easy-to-use automatic-differentiation libraries. Autodiff itself dates from the 1970s, and Torch existed, but it needed Lua." },
      { t: "44,000 lines to 100", d: "In 2012, Tianqi Chen's GPU ConvNet for ImageNet took about 44,000 lines of code and six months. Today the same model is about 100 lines and a few hours, and that iteration speed is itself a research capability." },
      { t: "Why study the systems", d: "Three reasons. To build frameworks: the field is still fluid, as JAX's recent rise shows. To use them well: knowing what really executes lets you write efficient, GPU-saturating code, which Kolter calls a superpower even for non-systems research. And because they are fun." },
      { t: "Simple at the core", d: "PyTorch and TensorFlow are millions of lines, but every result above rests on automatic differentiation, gradient-based optimization, and efficient matrix multiplies on GPUs. A reasonable GPU framework with convolutions, RNNs and Transformers fits in under 2,000 lines. Differentiating through a gradient you could barely derive by hand still feels like magic." },
      { t: "The instructors", d: "Kolter works on adversarial robustness and implicit layers, and was an early PyTorch adopter (his CUDA kernel once left a striding bug in PyTorch's linear solver for a year). Chen created XGBoost, was a lead developer of MXNet, and co-founded Apache TVM and OctoML." },
      { t: "What you will build", d: "Needle ('necessary elements of deep learning'), loosely like PyTorch, in four homeworks: automatic differentiation; a neural-network library (modules, optimizers, data loading); CPU and GPU linear-algebra backends; and MLPs, ConvNets, RNNs and Transformers. Not record-breaking, but trains medium models such as on CIFAR from scratch." },
      { t: "Prerequisites and format", d: "You need systems programming (C with a few classes: write a matmul over raw float pointers, and debug the segfault), linear algebra, calculus and prior machine learning. Homework 0 tests this: softmax regression and a two-layer network. Lectures alternate between algorithms and live-coded implementation. Homeworks are autograded, with code run locally and only answers submitted. The final project must extend needle itself." },
    ],
    worked: "To judge whether a framework feature is worth learning in depth, ask which of the three cores it touches: the autodiff graph, the optimizer, or the array backend and its hardware. Most performance problems live in the third, and most correctness problems in the first.",
    watch: "Treating the framework as a black box. The internals decide whether your code saturates the GPU, whether memory leaks through a retained graph, and whether a new layer is practical to build.",
    concepts: [],
    checks: [
      { q: "Kolter's explanation for the timing of deep learning's widespread adoption is:", opts: ["AlexNet's ImageNet win in 2012", "easy-to-use automatic-differentiation libraries (TensorFlow, PyTorch and similar, from 2015–16)", "the invention of backpropagation", "cheaper GPUs"], a: 1,
        expl: "The Google Trends curve rises with the libraries, not with the landmark papers. Autodiff itself is decades old." },
      { q: "The algorithmic core under essentially every modern deep-learning result is:", opts: ["symbolic differentiation and exact solvers", "automatic differentiation and gradient-based optimization, run on fast linear algebra", "genetic algorithms", "hand-derived update rules"], a: 1,
        expl: "That is why a capable framework fits in about 2,000 lines, even though production ones are millions." },
      { q: "Needle's final project must:", opts: ["implement any model in PyTorch", "extend the needle library itself, for example with a new backend or fused operators", "reproduce a published paper", "tune hyperparameters on CIFAR"], a: 1,
        expl: "It is effectively homework 5: new functionality in the framework, not just a model built with one." },
    ],
  },

  "sys250.0.1": {
    takeaway: "Every machine-learning algorithm is three choices: a hypothesis class, a loss, and an optimizer. Softmax regression picks a linear map $h_\\theta(x) = \\theta^{T}x$ to $k$ logits, the cross-entropy loss $-h_y + \\log\\sum_j e^{h_j}$, and minibatch SGD. Its gradient, found by pretending everything is a scalar and then fixing the shapes, is $\\nabla_\\theta = \\frac1B X^{T}(Z - I_y)$, where $Z$ is the row-wise softmax. That is a few lines of code and under 8% error on MNIST.",
    beats: [
      { t: "Programs from data", d: "Writing a digit classifier by hand is hopeless. Instead, collect labelled examples and hand them to an algorithm that outputs a program $h$: supervised learning. Every such algorithm is a hypothesis class (parameterized by $\\theta$), a loss function, and an optimization procedure." },
      { t: "The setting", d: "$k$-class classification, with inputs $x^{(i)} \\in \\mathbb R^{n}$, labels $y^{(i)} \\in \\{1, \\ldots, k\\}$, and $m$ examples. For MNIST, $n = 784$ ($28 \\times 28$ pixels), $k = 10$, and $m = 60{,}000$." },
      { t: "The linear hypothesis, in batch form", d: "$h_\\theta(x) = \\theta^{T}x$ with $\\theta \\in \\mathbb R^{n \\times k}$, giving $k$ scores: the logits. Stack the examples as the rows of $X$ ($m \\times n$), and $h_\\theta(X) = X\\theta$. Batch notation is not just tidier: one matrix multiply is far faster than $m$ vector operations, on CPUs as well as GPUs." },
      { t: "Why not the error rate", d: "The 0–1 loss (wrong if the arg-max is not $y$) is how classifiers are reported, but it is useless to optimize. Its gradient is zero almost everywhere, and minimizing it exactly is NP-hard even for linear classifiers." },
      { t: "Cross-entropy", d: "Turn logits into probabilities by exponentiating and normalizing (the softmax), then penalize the negative log-probability of the true class: $\\ell_{ce}(h, y) = -h_y + \\log\\sum_j\\exp h_j$. Keep the softmax inside the loss rather than in the model: it is numerically safer (no log of a zero), and the problem stays convex." },
      { t: "The core optimization problem", d: "$\\min_\\theta \\frac1m\\sum_i \\ell(h_\\theta(x^{(i)}), y^{(i)})$ contains all three ingredients. Gradient descent steps $\\theta \\leftarrow \\theta - \\alpha\\nabla_\\theta f(\\theta)$, with the gradient an $n \\times k$ matrix of partial derivatives pointing uphill. The step size matters: too small is slow, and too large bounces or diverges." },
      { t: "Stochastic gradient descent", d: "A full gradient sums over all $m$ examples: more data would mean slower steps, and the data does not fit in memory. So take minibatches of size $B$ and step on each. It is noisy but much faster, and it (with small variants) trains essentially every deep network." },
      { t: "The gradient, the embarrassing way", d: "For a vector $h$: $\\nabla_h\\ell_{ce} = z - e_y$, where $z$ is the softmax. For $\\theta$, pretend everything is a scalar, apply the chain rule ($(z - e_y) \\cdot x$), then arrange transposes until the shapes match $n \\times k$: $x(z - e_y)^{T}$. In batch form, $X^{T}(Z - I_y)$. It works surprisingly often, but always check it numerically." },
    ],
    worked: "Softmax regression in full: split the data into minibatches, and for each one compute $Z = \\text{normalize}(\\exp(X\\theta))$ row by row, then update $\\theta \\leftarrow \\theta - \\frac{\\alpha}{B}X^{T}(Z - I_y)$. That is about six lines of Python.",
    watch: "Choosing test sizes that coincide. If $k = n$, a wrongly transposed gradient still has the right shape and runs. Keep every dimension distinct while debugging.",
    concepts: [],
    checks: [
      { q: "Logits $h = (2, 1, 0)$ and true class 1 (the first). The cross-entropy loss (natural log) is (two decimals):", num: 0.41,
        expl: "$-2 + \\log(e^{2} + e + 1) = \\log(1 + e^{-1} + e^{-2}) \\approx 0.41$." },
      { q: "For the same logits and label, $\\partial\\ell/\\partial h_1$ is (two decimals):", num: -0.33,
        expl: "$z_1 - 1$, where $z_1 = e^{2}/(e^{2} + e + 1) \\approx 0.665$, gives about $-0.33$." },
      { q: "Softmax regression on MNIST ($n = 784$, $k = 10$) has how many parameters?", num: 7840,
        expl: "$\\theta$ is $n \\times k = 784 \\times 10$ (no bias term in the lecture's formulation)." },
      { q: "The 0–1 error is a poor training loss because:", opts: ["it is too slow to compute", "it is flat almost everywhere (zero gradient), and exact minimization is NP-hard", "it is not bounded", "it needs probabilities"], a: 1,
        expl: "Gradient methods need a loss that responds to small parameter changes. Cross-entropy does; the error rate does not." },
    ],
  },

  "sys250.0.2": {
    takeaway: "A linear classifier can only carve space into linear regions. The fix is a feature map, $h = \\theta^{T}\\phi(x)$, but a linear $\\phi$ collapses back into a linear model, so add a nonlinearity: $\\phi(x) = \\sigma(W^{T}x)$. Training $W$ too makes a two-layer neural network. A neural network is just composed, differentiable, parameterized functions. A two-layer network is a universal approximator, but so are splines; depth is used because, empirically, it works better per parameter.",
    beats: [
      { t: "Beyond linear", d: "A linear hypothesis picks the class whose direction best matches $x$, which carves space into linear regions. Rings of classes around the origin defeat it, and in high dimensions real classes are rarely linearly separable." },
      { t: "Feature maps", d: "Use $h_\\theta(x) = \\theta^{T}\\phi(x)$ with $\\phi: \\mathbb R^{n} \\to \\mathbb R^{d}$. Hand-crafted features (for the rings, $x_1^{2} + x_2^{2}$) were how most machine learning was done for years, and they are still powerful. The goal now is to learn $\\phi$ from data." },
      { t: "Linear features collapse", d: "$\\phi(x) = W^{T}x$ gives $\\theta^{T}W^{T}x$, which is just another linear map: nothing is gained. Add an elementwise nonlinearity, $\\phi(x) = \\sigma(W^{T}x)$, and almost any choice escapes. Even a fixed random Gaussian $W$ with $\\sigma = \\cos$ (random Fourier features) works well." },
      { t: "Train the features too", d: "Optimize $W$ along with $\\theta$ and you have a two-layer network: $h_\\theta(X) = \\sigma(XW_1)W_2$, with $X$ of size $m \\times n$, $W_1$ of $n \\times d$ and $W_2$ of $d \\times k$. From now on $\\theta$ means all the parameters, and $\\sigma$ any elementwise nonlinearity (ReLU, sigmoid, tanh)." },
      { t: "What 'neural network' means", d: "The name evokes the brain, and biology did inspire much of the history. In engineering terms, though, it is any hypothesis made of multiple parameterized, differentiable functions (layers) composed from input to output. 'Deep network' is a synonym, and 'deep learning' is machine learning that uses them, with no minimum depth. The real jump is from one layer to more than one." },
      { t: "Universal approximation, demystified", d: "In 1-D: sample the target function on a grid and join the samples with a linear spline. A ReLU network reproduces that spline by starting with a constant and adding $\\pm\\max(0, wx + b)$ at each knot to bend the slope. So a one-hidden-layer network can match any continuous function on a closed region to within $\\varepsilon$. But it needs a hidden unit per sample point, and splines and nearest-neighbour methods share the property. Universality is not why networks work." },
      { t: "The L-layer MLP", d: "$Z_1 = X$, $Z_{i+1} = \\sigma_i(Z_iW_i)$ for $i = 1, \\ldots, L$, with output $h_\\theta(X) = Z_{L+1}$. Here $Z_i$ is $m \\times n_i$ (the hidden layer, or activations) and $W_i$ is $n_i \\times n_{i+1}$. The last $\\sigma$ is often the identity. A bias term is optional and often unnecessary." },
      { t: "Why deep", d: "The brain has stages (inspiring, not an argument). Circuit theory: parity of $N$ bits needs $2^{N}$ hidden units with one layer but $O(N)$ with $\\log N$ layers, although networks are notoriously bad at LEARNING parity. The honest answer: for a fixed parameter budget, depth, especially with structure (convolutions, recurrence, attention), works better empirically." },
    ],
    worked: "To build a nonlinear classifier: map $x$ through $\\sigma(xW_1)$, apply a linear layer $W_2$ to get logits, and train both $W_1$ and $W_2$ with cross-entropy and SGD, exactly as in softmax regression. Only the gradient computation changes.",
    watch: "Stacking linear layers without a nonlinearity. $XW_1W_2$ is a single linear map $X(W_1W_2)$, however many layers you write.",
    concepts: [],
    checks: [
      { q: "A two-layer network with no biases on MNIST ($n = 784$), $d = 100$ hidden units and $k = 10$ classes has how many parameters?", num: 79400,
        expl: "$W_1$ is $784 \\times 100 = 78{,}400$, and $W_2$ is $100 \\times 10 = 1{,}000$." },
      { q: "Why does $h = \\theta^{T}W^{T}x$ add nothing over softmax regression?", opts: ["$W$ is not trained", "$\\theta^{T}W^{T}$ is just another matrix, so the model is still linear in $x$", "it has too few parameters", "it is not differentiable"], a: 1,
        expl: "A nonlinearity between the two maps is what enlarges the hypothesis class." },
      { q: "The universal approximation theorem does NOT explain deep learning's success because:", opts: ["it is false", "it needs arbitrarily many hidden units, and simple methods like splines have the same property", "it only holds for sigmoids", "it only holds for deep networks"], a: 1,
        expl: "Representing a function is not the same as learning it efficiently from data." },
    ],
  },

  "sys250.0.3": {
    takeaway: "Backpropagation is the chain rule plus caching. For an MLP, $Z_{i+1} = \\sigma(Z_iW_i)$, define $G_i = \\nabla_{Z_i}\\ell$. Then $G_i = (G_{i+1} \\circ \\sigma'(Z_iW_i))W_i^{T}$ and $\\nabla_{W_i}\\ell = Z_i^{T}(G_{i+1} \\circ \\sigma'(Z_iW_i))$: a forward pass stores the $Z_i$, and a backward pass computes the $G_i$. Each layer only has to multiply the incoming gradient by its own derivative (a vector–Jacobian product), which is the modular idea behind automatic differentiation.",
    beats: [
      { t: "Same problem, new hypothesis", d: "The loss (cross-entropy) and optimizer (SGD) are unchanged from softmax regression. All that is needed is the gradient with respect to every parameter: here $W_1$ and $W_2$ of $\\sigma(XW_1)W_2$." },
      { t: "The last layer", d: "With $\\sigma(XW_1)$ constant, this is softmax regression on new features: $\\nabla_{W_2} = \\sigma(XW_1)^{T}(S - I_y)$, where $S$ is the row-wise softmax of the output ($m \\times k$) and $I_y$ the one-hot labels." },
      { t: "The first layer", d: "Chain rule through four factors, treating them as scalars: $(S - I_y) \\cdot W_2 \\cdot \\sigma'(XW_1) \\cdot X$. The shapes are $m \\times k$, $d \\times k$, $m \\times d$ and $m \\times n$, and the target is $n \\times d$. So: $X^{T}\\big[(S - I_y)W_2^{T} \\circ \\sigma'(XW_1)\\big]$, where $\\circ$ is elementwise, because $\\sigma$ acts elementwise. For ReLU, $\\sigma'$ is 0 or 1." },
      { t: "Resolve never to do this again", d: "The result is a handful of Python lines for SGD on a two-layer network, which is remarkable. But how did we know the product was elementwise there? Only a numerical check confirms it. The lesson: learn automatic differentiation." },
      { t: "The L-layer chain", d: "$\\partial\\ell/\\partial W_i$ is a long product $\\frac{\\partial\\ell}{\\partial Z_{L+1}}\\frac{\\partial Z_{L+1}}{\\partial Z_L}\\cdots\\frac{\\partial Z_{i+1}}{\\partial W_i}$. The same prefix appears in the gradient of every earlier layer, so name it: $G_i = \\partial\\ell/\\partial Z_i$, with $G_i = G_{i+1}\\,\\partial Z_{i+1}/\\partial Z_i$." },
      { t: "In real matrix form", d: "$G_i$ has the shape of $Z_i$ ($m \\times n_i$). Matching shapes: $G_i = (G_{i+1} \\circ \\sigma'(Z_iW_i))W_i^{T}$ and $\\nabla_{W_i}\\ell = Z_i^{T}(G_{i+1} \\circ \\sigma'(Z_iW_i))$. Write it as matrix operations from the start, because that is how anyone implements it." },
      { t: "Forward and backward passes", d: "Forward: $Z_1 = X$, then $Z_{i+1} = \\sigma_i(Z_iW_i)$. Backward: $G_{L+1} = S - I_y$ for cross-entropy, then the $G_i$ recursion from $L$ down to 1, computing each $\\nabla_{W_i}$ on the way. The total cost is about twice a forward pass, but every $Z_i$ must be kept for the backward pass: backprop trades memory for speed." },
      { t: "The modular view", d: "Each layer must compute its forward pass and multiply the incoming gradient $G_{i+1}$ by its own derivatives: a vector–Jacobian product. That is all a layer needs to support in order to join backpropagation, and it is the seed of automatic differentiation." },
    ],
    worked: "To backprop an MLP by hand: run forward and store every $Z_i$. Set $G_{L+1} = S - I_y$. Then for $i = L$ down to 1: $D = G_{i+1} \\circ \\sigma'(Z_iW_i)$, $\\nabla_{W_i} = Z_i^{T}D$, and $G_i = DW_i^{T}$. Check one entry against a finite difference.",
    watch: "Freeing activations after the forward pass. The weight gradients need $Z_i$, so backprop's memory grows with depth and batch size. That is its central cost, not its arithmetic.",
    concepts: [],
    checks: [
      { q: "One input $x = 1$, $W_1 = (1, -1)$, ReLU, $W_2 = \\begin{pmatrix}2 & 0\\\\ 0 & 1\\end{pmatrix}$, true class 2, cross-entropy. $\\partial\\ell/\\partial(W_1)_{11}$ is (two decimals):", num: 1.76,
        expl: "Hidden units are $(1, 0)$, logits $(2, 0)$, softmax $(0.881, 0.119)$, so $S - I_y = (0.881, -0.881)$. Then $(S - I_y)W_2^{T} = (1.762, -0.881)$; ReLU' is $(1, 0)$; times $x$: 1.76." },
      { q: "Same network: $\\partial\\ell/\\partial(W_2)_{11}$ is (two decimals):", num: 0.88,
        expl: "$\\sigma(XW_1)^{T}(S - I_y)$: the first hidden unit (1) times the first entry of $S - I_y$ (0.881)." },
      { q: "Why must the forward activations $Z_i$ be stored?", opts: ["to print them", "$\\nabla_{W_i}\\ell = Z_i^{T}(\\cdots)$ needs them during the backward pass", "to compute the loss", "they are needed for the next minibatch"], a: 1,
        expl: "That is backprop's memory cost: a plain forward pass could discard each layer once used." },
      { q: "In $G_i = (G_{i+1} \\circ \\sigma'(Z_iW_i))W_i^{T}$, the $\\circ$ is elementwise because:", opts: ["it is faster", "$\\sigma$ is applied elementwise, so its Jacobian is diagonal", "the matrices are square", "of the softmax"], a: 1,
        expl: "A diagonal Jacobian times a vector is an elementwise product. Shape matching reveals it; a numerical check confirms it." },
    ],
  },

  "sys250.0.4": {
    takeaway: "Three ways to get gradients. Numerical differences are exact in principle but cost $2n$ evaluations and lose precision, so use them only to CHECK gradients. Symbolic differentiation repeats work. Automatic differentiation walks the computational graph. Forward mode costs one pass per input; reverse mode computes adjoints $\\bar v_i = \\partial y/\\partial v_i$ from the output back, summing over every path, and gets all input gradients in one pass. Modern frameworks do reverse mode by BUILDING a new graph for the gradient, which gives gradients of gradients for free.",
    beats: [
      { t: "Where gradients fit", d: "Hypothesis, loss, optimizer: SGD and all its variants need $\\nabla_\\theta\\ell$, and deriving it by hand is infeasible for modern models." },
      { t: "Numerical differentiation", d: "$\\partial f/\\partial\\theta_i \\approx \\frac{f(\\theta + \\epsilon e_i) - f(\\theta - \\epsilon e_i)}{2\\epsilon}$, with error $O(\\epsilon^{2})$ against $O(\\epsilon)$ for the one-sided version, because the second-order terms cancel. It needs $2n$ evaluations and suffers rounding error, so use it for checking: pick a random unit $\\delta$ and compare $\\delta^{T}\\nabla f$ against $\\frac{f(\\theta + \\epsilon\\delta) - f(\\theta - \\epsilon\\delta)}{2\\epsilon}$." },
      { t: "Symbolic differentiation wastes work", d: "For $f = \\prod_i\\theta_i$, $\\partial f/\\partial\\theta_k = \\prod_{j \\ne k}\\theta_j$. Computing each separately takes $n(n - 2)$ multiplications, where sharing partial products needs only about $n$. The symbolic formulas hide the reuse." },
      { t: "Computational graphs", d: "A DAG of intermediate values. Chen's example is $y = \\ln x_1 + x_1x_2 - \\sin x_2$, with $v_1 = x_1$, $v_2 = x_2$, $v_3 = \\ln v_1$, $v_4 = v_1v_2$, $v_5 = \\sin v_2$, $v_6 = v_3 + v_4$ and $v_7 = v_6 - v_5$. Evaluate it in topological order at $(2, 5)$ to get $y \\approx 11.65$." },
      { t: "Forward mode", d: "Carry $\\dot v_i = \\partial v_i/\\partial x_1$ alongside each value: $\\dot v_1 = 1$, $\\dot v_2 = 0$, $\\dot v_3 = \\dot v_1/v_1 = 0.5$, $\\dot v_4 = \\dot v_1v_2 + v_1\\dot v_2 = 5$, and so on. One pass gives the derivative with respect to ONE input. That is ideal for few inputs and many outputs, and wrong for a scalar loss over millions of parameters." },
      { t: "Reverse mode", d: "Define adjoints $\\bar v_i = \\partial y/\\partial v_i$ and start at the end with $\\bar v_7 = 1$: $\\bar v_6 = \\bar v_7 \\cdot 1$, $\\bar v_5 = \\bar v_7 \\cdot (-1)$, and so on backwards. A node used twice, like $v_2$ in $v_4$ and $v_5$, sums its partial adjoints: $\\bar v_2 = \\bar v_4\\frac{\\partial v_4}{\\partial v_2} + \\bar v_5\\frac{\\partial v_5}{\\partial v_2}$, which is the multivariable chain rule. One backward pass gives every input's gradient." },
      { t: "The algorithm", d: "Keep node_to_grad: a list of partial adjoints $\\bar v_{k \\to i} = \\bar v_i\\,\\partial v_i/\\partial v_k$ for each node. Walk the graph in reverse topological order. At each node, sum its list to get $\\bar v_i$, then append a partial adjoint to each of its inputs' lists. By the time a node is reached, everything that consumed it has already contributed." },
      { t: "Extend the graph, don't just backprop", d: "Instead of numbers, build new graph NODES for each adjoint: for $v_4 = v_2 \\cdot v_3$, $\\bar v_{2 \\to 4} = \\bar v_4 \\cdot v_3$ becomes a multiply node. Caffe and cuda-convnet ran backprop in place on the forward graph; Theano pioneered the extended graph, and TensorFlow and PyTorch adopted it. The gradient is a graph, so it can be differentiated again (gradient of gradient), reused for any input, and optimized before it runs. For tensors, the same rules apply elementwise: $Z = XW$ gives $\\bar X = \\bar ZW^{T}$." },
    ],
    worked: "To gradient-check an autodiff implementation: pick a random unit direction $\\delta$ and a small $\\epsilon$ (about $10^{-5}$). Compare $\\delta \\cdot \\nabla f$ from your autodiff against $\\frac{f(\\theta + \\epsilon\\delta) - f(\\theta - \\epsilon\\delta)}{2\\epsilon}$, and repeat for a few directions. This is the test to run before trusting any new operator.",
    watch: "Overwriting an adjoint instead of summing. When a value feeds two operations, its adjoint is the SUM of the partial adjoints from both. Keeping only the last one silently drops a path.",
    concepts: [],
    checks: [
      { q: "For $y = \\ln x_1 + x_1x_2 - \\sin x_2$ at $(2, 5)$, $\\partial y/\\partial x_1$ is:", num: 5.5,
        expl: "$1/x_1 + x_2 = 0.5 + 5$. Reverse mode gets it by summing the paths through $v_3$ and $v_4$." },
      { q: "Same function: $\\partial y/\\partial x_2$ is (two decimals):", num: 1.72,
        expl: "$x_1 - \\cos x_2 = 2 - \\cos 5 \\approx 2 - 0.284 = 1.72$: the paths through $v_4$ and $v_5$." },
      { q: "For $f = \\theta_1\\theta_2\\cdots\\theta_{10}$, computing each $\\partial f/\\partial\\theta_k$ independently from its symbolic formula takes how many multiplications in total?", num: 80,
        expl: "Each is a product of 9 numbers (8 multiplications), 10 times: $n(n - 2) = 80$. Sharing prefix and suffix products needs only $O(n)$." },
      { q: "Reverse mode beats forward mode for training because:", opts: ["it is more accurate", "a loss is one scalar of many parameters, and reverse mode gets all their gradients in one pass", "it uses less memory", "it avoids the chain rule"], a: 1,
        expl: "Forward mode needs one pass per input: millions of them. Reverse mode needs one per output." },
    ],
  },

  "sys250.0.5": {
    takeaway: "Needle's tensors are nodes of a computational graph. A Value carries cached_data (the array), op (what produced it), inputs (from what), and requires_grad. Each Op defines compute (arrays in, array out) and gradient (Tensors in, Tensors out), so gradients are graphs too. Operator overloading builds the graph. Eager mode computes immediately, lazy mode on demand. And because a tensor remembers its history, accumulating a loss across iterations keeps the whole history alive unless you detach it.",
    beats: [
      { t: "Needle's layout", d: "About 1,000 lines of Python: __init__, autograd.py (about 400 lines: the data structures and differentiation machinery) and ops.py (about 300 lines: operators). For the first homeworks the array backend is numpy, imported as array_api so it can later be swapped for needle's own CPU/GPU NDArray." },
      { t: "Tensor is a Value", d: "Fields: cached_data (the computed array), inputs (the Values it was computed from), op (the operation), and requires_grad (true if any input requires it). A leaf has op = None and no inputs. For $v_1 = 0$, $v_2 = \\exp v_1$, $v_3 = v_2 + 1$, $v_4 = v_2v_3$: $v_4$ is 2, its op is EWiseMul, and its inputs are $v_2$ and $v_3$, so the graph can be traced back." },
      { t: "Ops", d: "Each operator subclasses TensorOp and implements compute and gradient. AddScalar stores its scalar as an attribute. Writing y = x + 1 calls __add__, which dispatches to ops.AddScalar." },
      { t: "What happens on x1 + x2", d: "__add__ calls EWiseAdd()(self, other). TensorOp.__call__ calls Tensor.make_from_op, which creates a Tensor via __new__ (since __init__ is the user-facing constructor), runs _init to set op, inputs and requires_grad, and then, unless in lazy mode, realize_cached_data. That realizes the inputs recursively and calls op.compute on their arrays: numpy's a + b." },
      { t: "Eager versus lazy", d: "Eager (needle's default, like PyTorch) computes as the graph is built, which hides graph-construction cost behind computation. Lazy mode leaves cached_data empty until something needs it (.numpy(), .data, a shape), then computes. That allows whole-graph optimization, as PyTorch/XLA does for TPUs." },
      { t: "The memory trap", d: "sum_loss += x * x inside a loop does not just accumulate a number. Every iteration adds nodes that point back to the previous sum, so after 100 iterations the entire chain is alive. That is a classic cause of PyTorch programs running out of memory. detach() returns a Tensor with the same data but no op and no inputs; PyTorch's equivalents are .detach() and no_grad." },
      { t: "The gradient function", d: "gradient(out_grad, node) receives the output adjoint and returns each input's partial adjoint, as Tensors rather than arrays. For EWiseMul, $v_4 = v_2v_3$, it returns (out_grad · $v_3$, out_grad · $v_2$). gradient_as_tuple always returns a tuple. With out_grad = 1 at $v_4$, it gives (2, 1)." },
      { t: "Why Tensors, not arrays", d: "Because gradient builds graph nodes, the adjoints are themselves computational graphs. You can compute on them and differentiate again: gradients of gradients. compute only has to produce numbers; gradient has to produce graphs. Homework 1 is to write reverse-mode AD over this: traverse in reverse topological order and sum the partial adjoints." },
    ],
    worked: "To debug a needle computation, print each node's id, the ids of its inputs, its op type and its data. Walk .inputs back to the leaves to see exactly what the graph contains. Call .detach() on anything kept across iterations (running losses, logged metrics).",
    watch: "Accumulating a loss tensor over a training loop without detaching it. It looks like one number, but it holds the entire computational history, and memory grows every iteration.",
    concepts: [],
    checks: [
      { q: "$v_1 = 0$, $v_2 = e^{v_1}$, $v_3 = v_2 + 1$, $v_4 = v_2v_3$. The value of $v_4$ is:", num: 2,
        expl: "$e^{0} = 1$, then $1 + 1 = 2$, then $1 \\times 2 = 2$." },
      { q: "For the same graph, $dv_4/dv_1$ at $v_1 = 0$ is:", num: 3,
        expl: "$v_4 = e^{v_1}(e^{v_1} + 1)$, so the derivative is $2e^{2v_1} + e^{v_1} = 3$. Reverse mode: $\\bar v_2 = \\bar v_4v_3 + \\bar v_4v_2 = 2 + 1 = 3$, then $\\bar v_1 = \\bar v_2e^{v_1} = 3$." },
      { q: "An op's gradient function takes and returns Tensors rather than NDArrays so that:", opts: ["it runs faster", "the adjoints are themselves graphs, which allows gradients of gradients", "numpy is not needed", "it can run lazily"], a: 1,
        expl: "compute only needs numbers. gradient must build graph nodes." },
      { q: "detach() on a Tensor returns:", opts: ["a copy with its graph duplicated", "a Tensor with the same data but no op and no inputs, cut from the history", "the gradient", "an NDArray"], a: 1,
        expl: "It stops gradient flow and lets the old graph be freed." },
    ],
  },

});
