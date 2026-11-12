// Brickford — practice items, AI 200 Unit I (T-067 step 3). Written answers:
// one prompt per 3Blue1Brown chapter, plus the end-to-end capstone on the last.
// The checklist and the model answer show only after an attempt of at least
// 80 characters. Rules: practice-math110.js, docs/CONTENT-STANDARD.md.
window.DAR = window.DAR || {};
DAR.PRACTICE = DAR.PRACTICE || {};
Object.assign(DAR.PRACTICE, {
  "ai200.0.0": [
    { id: "p1", type: "write", q: "In the digit-recognising network, what does one neuron in a hidden layer compute? Say what its weights do and what its bias does.",
      points: ["A neuron holds one number, its activation, between 0 and 1.",
               "It takes a weighted sum of every activation in the previous layer.",
               "The weights are the pattern it looks for: positive where it wants ink, negative where it wants none.",
               "The bias shifts the sum: how high it must be before the neuron lights up.",
               "A squashing function (sigmoid, or ReLU) turns the sum into the activation.",
               "784, 16, 16, 10 neurons give about 13,000 weights and biases, and learning means choosing them."],
      model: "Each neuron holds an activation, a number between 0 and 1. It computes a weighted sum of all the activations in the layer before it, adds a bias, and squashes the result with a sigmoid (or ReLU). The weights act as a pattern: large positive weights on the pixels where it wants ink and negative ones around them, so the sum is large only when that pattern is present. The bias sets the threshold, how large the sum must be before the neuron is meaningfully active. With 784 inputs, two hidden layers of 16 and 10 outputs, the network has about 13,002 such weights and biases, and learning means finding good values for all of them." },
  ],
  "ai200.0.1": [
    { id: "p1", type: "write", q: "What does the cost function measure, and how does gradient descent use it to make the network better?",
      points: ["The cost compares the network's output with the desired output: the sum of squared differences.",
               "It is averaged over all the training examples.",
               "It is one number that depends on all 13,000 weights and biases.",
               "The negative gradient points in the direction that lowers the cost fastest.",
               "Each step moves every weight and bias a little in that direction, proportional to the slope; then repeat.",
               "The size of each gradient component says how sensitive the cost is to that parameter."],
      model: "For one training image the cost adds up the squared differences between the ten output activations and the desired output (1 for the right digit, 0 for the rest); the cost of the network is the average of that over all the training examples. Seen this way the cost is a single function of all 13,002 weights and biases. Its gradient says which way to move them to increase the cost fastest, so gradient descent steps the other way: it computes the negative gradient, nudges every parameter by a small multiple of its component, and repeats until the cost settles in a local minimum. Each component's size also tells you how much that parameter matters right now." },
  ],
  "ai200.0.2": [
    { id: "p1", type: "write", q: "Without formulas: how does one training example 'want' to change the weights and biases, and how are the wishes of many examples combined?",
      points: ["The example wants the correct output neuron raised and the others lowered, in proportion to how far off each is.",
               "An activation can be raised three ways: its bias, its weights, or the activations feeding it.",
               "Weights from brighter neurons matter more: change those in proportion to their activation.",
               "The changes wanted of the previous layer are passed back and become that layer's targets: backward, layer by layer.",
               "Average the nudges over all examples, in practice over random mini-batches (stochastic gradient descent)."],
      model: "Take one image of a 2. It wants the output neuron for 2 pushed up and every other output pushed down, each by an amount proportional to how wrong it is. Any one activation can be raised by increasing its bias, by increasing the weights from the previous layer (most usefully those from neurons that are already bright, so 'neurons that fire together wire together'), or by changing the previous layer's activations in the direction of the weights. That last wish cannot be granted directly, so the desired changes are added up over all the outputs and handed back to the layer before, which repeats the process: this backwards pass is backpropagation. Doing it for every training example and averaging gives the negative gradient; in practice it is averaged over small random mini-batches, which is stochastic gradient descent." },
  ],
  "ai200.0.3": [
    { id: "p1", type: "write", q: "With one neuron per layer, write the chain rule for $\\partial C/\\partial w^{(L)}$ and explain what each factor means.",
      points: ["The cost for one example is $C=(a^{(L)}-y)^{2}$.",
               "$z^{(L)}=w^{(L)}a^{(L-1)}+b^{(L)}$ and $a^{(L)}=\\sigma(z^{(L)})$.",
               "$\\partial C/\\partial w^{(L)}=a^{(L-1)}\\,\\sigma'(z^{(L)})\\,2(a^{(L)}-y)$.",
               "The factor $a^{(L-1)}$: a weight matters more when the neuron feeding it is active.",
               "For the bias, $\\partial z/\\partial b=1$; for the previous activation, $\\partial z/\\partial a^{(L-1)}=w^{(L)}$, which carries the chain one layer back.",
               "With many neurons per layer the same rule holds with indices, summing over every path through the next layer."],
      model: "Write the last step as a chain: $z^{(L)}=w^{(L)}a^{(L-1)}+b^{(L)}$, $a^{(L)}=\\sigma(z^{(L)})$, $C=(a^{(L)}-y)^{2}$. A nudge to $w^{(L)}$ nudges $z$, which nudges $a$, which nudges $C$, so $\\partial C/\\partial w^{(L)}=\\frac{\\partial z}{\\partial w}\\frac{\\partial a}{\\partial z}\\frac{\\partial C}{\\partial a}=a^{(L-1)}\\,\\sigma'(z^{(L)})\\,2(a^{(L)}-y)$. The last factor is how wrong the output is, the middle one how responsive the neuron is, and the first how active the input neuron was. The bias has $\\partial z/\\partial b=1$. Replacing $\\partial z/\\partial w$ by $\\partial z/\\partial a^{(L-1)}=w^{(L)}$ gives the sensitivity to the previous activation, and repeating the argument one layer back is backpropagation. With many neurons the formulas gain indices, and a neuron's sensitivity sums over all the paths through the next layer." },
    { id: "p2", type: "write", q: "Explain, end to end, how a neural network learns: forward pass, loss, gradient, backpropagation, update.",
      points: ["Forward pass: the input flows through the layers, each a weighted sum, a bias and a nonlinearity, to an output.",
               "Loss: one number that compares the output with the target and says how wrong the network is.",
               "Gradient: the partial derivative of the loss with respect to every weight and bias.",
               "Backpropagation computes it with the chain rule, from the output back to the input, reusing each layer's result.",
               "Update: every parameter takes a small step against its gradient, scaled by the learning rate.",
               "Repeat over many mini-batches until the loss stops falling, and check on examples the network never saw."],
      model: "Training repeats one loop. In the forward pass an input (an image, a sentence) goes through the network layer by layer; each layer takes weighted sums of the previous activations, adds biases and applies a nonlinearity, and the last layer produces a prediction. The loss turns the gap between that prediction and the right answer into a single number, for example squared error or cross-entropy. The gradient is the list of partial derivatives of that loss with respect to every weight and bias: how much the loss would change if each one moved a little. Backpropagation computes all of them at once by applying the chain rule from the output backwards, so each layer's sensitivities are built from the next layer's instead of being recomputed. The update moves every parameter a small step in the direction that lowers the loss, by the learning rate times its gradient. Doing this over many random mini-batches drives the loss down; the network has learned when it also does well on examples it was never trained on." },
  ],
});
