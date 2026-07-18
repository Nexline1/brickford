// Brickford — Workshop data: labs (hands-on builds with acceptance criteria)
// and problem sets (pen-and-paper practice). Lab/pset state lives in
// S.labs / S.psets; a lab is only "done" when its criteria are honestly met,
// and the proof field wants a URL (repo, post, screenshot).
window.DAR = window.DAR || {};

DAR.LABS = [
  // ---- Phase 0 ----
  { id: "flashcards-cli", phase: 0, hours: 4, title: "Spaced-repetition flashcards CLI (no AI)",
    req: "SM-2-style scheduling, JSON persistence, crash-safe input, pushed to GitHub as your first repo." },
  { id: "neetcode-10", phase: 0, hours: 2, title: "The NeetCode 10, unaided",
    req: "The 10 diagnostic problems solved with AI off; verdict logged in the coding diagnostic doc." },

  // ---- Phase 1 ----
  { id: "micrograd-blind", phase: 1, hours: 8, title: "Micrograd from a blank file",
    req: "Autograd engine + MLP that trains on a toy dataset — written from memory, no reference open." },
  { id: "tokenizer", phase: 1, hours: 6, title: "BPE tokenizer from scratch",
    req: "Encode/decode round-trips perfectly; vocab of 512 trained on your own corpus." },
  { id: "gpt-arabic", phase: 1, hours: 20, title: "GPT on your own Arabic corpus",
    req: "Character-level GPT trained end to end on Arabic text you collected; samples posted publicly." },
  { id: "kaggle-entry", phase: 1, hours: 12, title: "Kaggle competition entry",
    req: "Beat the sample-submission baseline on a live competition; write up what actually moved the score." },
  { id: "blog-deepdive", phase: 1, hours: 6, title: "One technical deep-dive post",
    req: "A post that teaches backprop or attention from scratch — clear enough that a stranger thanks you." },
  { id: "deploy-space", phase: 1, hours: 4, title: "Ship a model demo",
    req: "Any trained model behind a public UI (HF Space or similar); link works from a phone." },

  // ---- Phase 2 ----
  { id: "resnet-cifar", phase: 2, hours: 10, title: "CIFAR-10 ResNet at 93%+",
    req: "Trained from scratch — no pretrained weights; ablation table covering at least 3 design choices." },
  { id: "gpt2-repro", phase: 2, hours: 20, title: "Reproduce a GPT-2 (124M) training run",
    req: "nanoGPT-style run on an open corpus; loss curve matches the expected shape and you can explain every hyperparameter." },
  { id: "lora-finetune", phase: 2, hours: 8, title: "LoRA finetune, by hand",
    req: "LoRA implemented without the peft library; task eval beats the base model; adapter <1% of params." },
  { id: "eval-harness", phase: 2, hours: 8, title: "Build an eval harness",
    req: "≥3 tasks, deterministic seeds, one command produces a scored report; used on your own finetunes." },
  { id: "cuda-matmul", phase: 2, hours: 10, title: "CUDA matmul kernel",
    req: "Tiled shared-memory kernel ≥10× naive; benchmark chart against cuBLAS included." },
  { id: "kernel-profile", phase: 2, hours: 6, title: "Profile and speed up a real model",
    req: "torch.profiler trace of a training step; one bottleneck found and fixed with before/after numbers." },
  { id: "oss-pr", phase: 2, hours: 12, title: "Merged open-source PR",
    req: "A non-trivial PR merged into an ML repo you actually use (not a typo fix)." },
  { id: "rag-system", phase: 2, hours: 10, title: "RAG over your own documents, no framework",
    req: "Retrieval + generation built from parts; faithfulness measured with and without retrieval." },
  { id: "dpo-run", phase: 2, hours: 10, title: "DPO alignment run",
    req: "DPO on a small model with a public preference dataset; win-rate vs the SFT base reported." },

  // ---- Phase 3 ----
  { id: "interp-notebook", phase: 3, hours: 8, title: "Interpretability notebook",
    req: "Induction heads reproduced on a 2-layer model with TransformerLens; published with plots." },
  { id: "agent-tools", phase: 3, hours: 10, title: "Agent with tools",
    req: "An LLM agent with ≥3 tools completes a multi-step task unaided; failure modes documented." },
  { id: "inference-api", phase: 3, hours: 8, title: "Deploy an inference API",
    req: "A quantized model served publicly; p95 latency and cost per 1k tokens documented." },
];

DAR.PSETS = [
  { course: "MATH 110", title: "MIT 18.06 problem sets & exams",
    url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/assignments/",
    items: [
      { id: "1806-ps1", label: "Pset 1 — Ax = b, elimination" },
      { id: "1806-ps2", label: "Pset 2 — LU, transposes" },
      { id: "1806-ps3", label: "Pset 3 — vector spaces, nullspace" },
      { id: "1806-ps4", label: "Pset 4 — independence, four subspaces" },
      { id: "1806-ps5", label: "Pset 5 — orthogonality, projections" },
      { id: "1806-ps6", label: "Pset 6 — least squares, Gram-Schmidt" },
      { id: "1806-ps7", label: "Pset 7 — determinants" },
      { id: "1806-ps8", label: "Pset 8 — eigenvalues, diagonalization" },
      { id: "1806-ps9", label: "Pset 9 — symmetric & positive definite" },
      { id: "1806-ps10", label: "Pset 10 — SVD, linear transformations" },
      { id: "1806-exams", label: "The three quizzes (under exam conditions)" },
    ] },
  { course: "MATH 120", title: "MIT 18.01 problem sets & exams",
    url: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/syllabus/",
    items: [
      { id: "1801-ps1", label: "Unit 1 — differentiation psets" },
      { id: "1801-ps2", label: "Unit 2 — applications of differentiation" },
      { id: "1801-ps3", label: "Unit 3 — the definite integral" },
      { id: "1801-ps4", label: "Unit 4 — techniques of integration" },
      { id: "1801-ps5", label: "Unit 5 — exploring the infinite (series)" },
      { id: "1801-exams", label: "Unit exams 1–4 (under exam conditions)" },
    ] },
  { course: "MATH 130", title: "Stat 110 strategic practice",
    url: "https://stat110.hsites.harvard.edu/strategic-practice-problems",
    items: [
      { id: "s110-sp1", label: "SP 1 — naive definition, counting" },
      { id: "s110-sp2", label: "SP 2 — conditional probability, Bayes" },
      { id: "s110-sp3", label: "SP 3 — independence, discrete r.v.s" },
      { id: "s110-sp4", label: "SP 4 — expectation, indicators" },
      { id: "s110-sp5", label: "SP 5 — continuous r.v.s, Normal" },
      { id: "s110-sp6", label: "SP 6 — LOTUS, moments" },
      { id: "s110-sp7", label: "SP 7 — joint distributions" },
      { id: "s110-sp8", label: "SP 8 — covariance, transformations" },
      { id: "s110-sp9", label: "SP 9 — conditional expectation" },
      { id: "s110-sp10", label: "SP 10 — inequalities, LLN, CLT" },
      { id: "s110-sp11", label: "SP 11 — Markov chains" },
      { id: "s110-final", label: "A practice final (3h, exam conditions)" },
    ] },
  { course: "MATH 210", title: "18.S096 homework + MacKay exercises",
    url: "https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/pages/assignments/",
    items: [
      { id: "ms096-hw1", label: "18.S096 homework 1" },
      { id: "ms096-hw2", label: "18.S096 homework 2" },
      { id: "mackay-ch2", label: "MacKay ch. 2 exercises (probability & entropy)" },
      { id: "mackay-ch4", label: "MacKay ch. 4 exercises (source coding)" },
      { id: "mackay-ch8", label: "MacKay ch. 8–9 exercises (channel capacity)" },
    ] },
];
