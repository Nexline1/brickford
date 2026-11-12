# The Python bridge (CS 100, proposed)

**Recommendation: CS50P 2022 (Harvard, David J. Malan), all ten lectures, then two short array-and-tensor sessions, with 3Blue1Brown's LLM chapters on Fridays.** About 8 weeks at the new pace (cutover 22 Nov 2026 → Micrograd second pass from 18 Jan 2027, computed in `dates.md`), and two thirds of the time is typing, not watching.

## What could not be checked — read this first

The brief asks for a choice made **after reading the transcripts**. That did not happen, and nothing below should be treated as checked:

- `Yt_T` (youtube-transcript.ai) refused every call: *"This MCP server needs a free API key (10 requests a day)… Create a key at youtube-transcript.ai/get-api-key, then reconnect with the key in its URL."*
- `Youtube_Transcribt` returned "An unexpected error occurred" (or nothing) for every video tried, including one already in the curriculum (`fNk_zzaMoSs`).
- From this container, youtube.com answers 403 at the proxy and cs50.harvard.edu does not resolve, so neither oEmbed metadata nor CS50's own transcripts could be fetched.
- A web search did confirm three facts: CS50P Lecture 0 "Functions, Variables" is `JP7ITIXGpHk` at about 1 h 45; CS50P Lecture 8 "Object-Oriented Programming" runs about 2 h 47; 3Blue1Brown's Deep Learning chapters 5 and 6 are about 27 and 26 minutes. Everything else (the other ids and lengths) is from memory and is marked `unverified` in `plan-data.js`.

**To unblock:** give `Yt_T` an API key (the owner creates one at youtube-transcript.ai and reconnects the server), or allow `www.youtube.com` and `cs50.harvard.edu` in this environment's network settings. Then each id below gets checked by transcript and its transcript stored next to this file, before step 2 writes anything into `platform/data`.

The choice itself does not hang on the transcripts: CS50P is the course the owner's own CS50 teacher built for exactly this gap, with graded problem sets. The transcripts are needed to fix the ids, the minutes, and the "what each teaches" column below, and to write the practice items in step 3.

## Why CS50P, and not the others

| Candidate | Verdict |
|---|---|
| **CS50P 2022** (10 lectures, ~15.5 h, free on CS50's YouTube channel and on cs50.harvard.edu/python) | **Chosen.** Same teacher as the CS50 the owner finished, so no new style to learn. Each lecture has a problem set of 4–6 small programs with an automatic checker (`check50`), which is exactly the "unsolved problems with a way to correct them" the owner asked for. It covers the four things Karpathy assumes and the owner lacks: functions and loops written fluently, classes with dunder methods (`__add__`, `__repr__` — Micrograd's `Value` is nothing else), list comprehensions and `*args`, and regular expressions (the GPT-2 tokenizer's split pattern is a regex). |
| A short crash course (e.g. a 1–4 h "Python for beginners") | **Rejected as the main course.** It shows syntax once and gives no problems; the owner's trouble is not syntax recognition but writing code alone. Useful only as a refresher if a CS50P week is missed. |
| NumPy + PyTorch tensor basics | **Kept, after CS50P, short.** Makemore 1 is broadcasting from its first minutes; Micrograd is plain Python and does not need it. Two sessions: a NumPy hour (arrays, shapes, axis sums, broadcasting) and a 2.5 h slice of a PyTorch-fundamentals course (tensors, dtypes, indexing, `@`, `view`, `sum(dim, keepdim)`, broadcasting rules). |
| 3Blue1Brown Deep Learning ch. 5–7 + "LLMs explained briefly" | **Kept, on Fridays, no code.** They keep the subject alive while the coding weeks are slow, and chapter 6 (attention) is a stated prerequisite of "Let's build GPT" in the map. |
| Karpathy "Deep dive into LLMs" (`ai200.2.1`, already in the data) | **Moved forward** into the bridge Fridays, split across seven of them. No code. Its one-hour cousin `ai200.2.0` becomes optional. |

## The bridge, in order

Minutes are video. "Practice" is the 2 h block (about 75 min coding, 45 min math problems) and is not lecture time. Each CS50P lecture spans the days `plan-dates.js` gives it at 60 effort-minutes a day (EFFORT = min × 1.8 + 4), so a 105-minute lecture is four days of about 26 minutes of video each, typed along, with that day's problems in the practice block.

| Key | Lecture | Video id | Min | Teaches | Needed by | Practice (CS50P problem set unless noted) |
|---|---|---|---:|---|---|---|
| cs100.0.0 | CS50P 0 — Functions, Variables | `JP7ITIXGpHk` (search-confirmed) | 105 | `print`, `input`, `str`/`int`/`float`, f-strings, `def`, `return`, scope | everything | Problem Set 0 (Indoor Voice, Playback Speed, Making Faces, Einstein, Tip Calculator) |
| cs100.0.1 | CS50P 1 — Conditionals | `_b6NgY_pMdw` (unverified) | 60 | `if/elif/else`, `and/or`, `match` | everything | Problem Set 1 |
| cs100.0.2 | CS50P 2 — Loops | `-7xg8pGcP6w` (unverified) | 90 | `while`, `for`, `range`, lists, dicts, nested loops | Makemore 1 (counting bigrams in a dict) | Problem Set 2 |
| cs100.0.3 | CS50P 3 — Exceptions | `LW7g1169dDI` (unverified) | 56 | `try/except/else`, `raise` | reading tracebacks in every Karpathy notebook | Problem Set 3 |
| cs100.0.4 | CS50P 4 — Libraries | `u51Zjlnui4Y` (unverified) | 80 | `import`, `random`, `statistics`, `pip`, APIs, `sys.argv` | fast.ai 1 (map: `ai210.0.0`) | Problem Set 4 |
| cs100.0.5 | CS50P 5 — Unit Tests | `tIrcxwLqzjQ` (unverified) | 55 | `assert`, `pytest` | checking your own Micrograd against PyTorch | Problem Set 5 |
| cs100.0.6 | CS50P 6 — File I/O | `KD-Yoel6EVQ` (unverified) | 107 | `open`, `with`, CSV, reading a file line by line | Makemore 1 (`names.txt`), the tokenizer | Problem Set 6 |
| cs100.0.7 | CS50P 7 — Regular Expressions | `hy3sd9MOAcc` (unverified) | 120 | `re`, patterns, groups | the GPT-2 tokenizer's split regex (`ai200.1.7`) | Problem Set 7 |
| cs100.0.8 | CS50P 8 — Object-Oriented Programming | `e4fwY9ZsxPw` (length search-confirmed, id unverified) | 167 | classes, `__init__`, `__str__`, properties, operator overloading, class methods, inheritance | **Micrograd** (`Value.__add__`, `__mul__`, `__radd__`); `nn.Module` everywhere after | Problem Set 8 + a 40-line `Value` class with `+` and `*` before watching Micrograd |
| cs100.0.9 | CS50P 9 — Et Cetera | `6pgodt1mezg` (unverified) | 100 | sets, globals, type hints, docstrings, `argparse`, unpacking, `*args/**kwargs`, `map`, list and dict comprehensions, generators | every Karpathy file (comprehensions are his default idiom) | Problem Set 9 / Final Project idea (start it; finish in the project block) |
| cs100.1.0 | NumPy for beginners (freeCodeCamp, Keith Galli) | `QUT1VHiLmmI` (unverified) | 58 | arrays, `shape`, slicing, `sum(axis=)`, broadcasting | Makemore 1 | 20 array exercises; by hand predict every shape before running |
| cs100.1.1 | PyTorch fundamentals, chapter 00 of *Learn PyTorch for Deep Learning* (Daniel Bourke) | `V_xro1bcAuA` (unverified; a 150-min slice of a 25 h video — timestamps from the transcript) | 150 | tensors, dtypes, devices, indexing, `@`, `view`/`reshape`, `sum(dim, keepdim)`, broadcasting rules | **Makemore 1** (`N / N.sum(1, keepdim=True)` is the lecture's famous broadcasting trap) | the chapter's exercises; then redo the bigram count table in NumPy and in PyTorch |
| cs100.2.0 | 3B1B — Large Language Models explained briefly | `LPZh9BOjkQs` (unverified) | 8 | what an LLM does, in one picture | motivation | one written paragraph: what is predicted, from what |
| cs100.2.1 | 3B1B — Transformers, the tech behind LLMs (ch. 5) | `wjZofJX0v4M` (length search-confirmed) | 27 | tokens, embeddings, the unembedding, softmax with temperature | Build GPT | explain softmax with temperature in writing |
| cs100.2.2 | 3B1B — Attention in transformers, step by step (ch. 6) | `eMlx5fFNoYc` (length search-confirmed) | 26 | queries, keys, values, masking, heads | **Build GPT** (`ai200.1.6`, in the map) | draw one attention pattern by hand for a 4-token sentence |
| cs100.2.3 | 3B1B — How might LLMs store facts (ch. 7) | `9-Jl0dxWQs8` (unverified) | 23 | the MLP block, superposition | RES 400 interpretability, later | one written paragraph |
| ai200.2.1 | Karpathy — Deep dive into LLMs like ChatGPT (in the data) | `7xTGNNLPyMI` (in the data) | 211 | pretraining, tokens, post-training, RL, hallucination | context for everything after | one written summary per Friday part |

Total video ≈ 1,230 minutes (20.5 h), plus the Deep dive's 3.5 h already in the data.

**Easy NeetCode problems start in week 4 of the bridge** (after Loops and Exceptions): two a day in the coding block, Arrays & Hashing first (CS 150's own list), solved in Python with no AI.

## Then the Karpathy second pass

The second pass re-uses the same videos under new keys (`ai200.3.0`–`ai200.3.4`, the plan's "Second pass: type along" unit), so the first-pass watch history stays intact. Typing along at about 35 minutes of video a day, with each lecture followed in the practice block by "rebuild it without the video". The map gates each one on the math it needs:

| Lecture | Needs, besides the previous lecture |
|---|---|
| Micrograd (`ai200.3.0`) | CS50P 8 (classes) and 9 (comprehensions), the chain rule (`math120.0.3`), 3B1B backprop calculus (`ai200.0.3`) |
| Makemore 1 (`ai200.3.1`) | PyTorch tensors and broadcasting (`cs100.1.1`), matrix multiplication (`math110.0.3`), conditional probability (`math130.0.3`) |
| Makemore 2 (`ai200.3.2`) | random variables and distributions (`math130.0.7`) |
| Makemore 3 (`ai200.3.3`) | location and scale of a distribution (`math130.0.13`) |
| Makemore 4 (`ai200.3.4`) | the multivariable chain rule (`math120.2.4`, the new bridge unit) |
| Makemore 5 → Build GPT → Tokenizer → GPT-2 (original keys `ai200.1.5`–`1.8`) | attention (`cs100.2.2`) and dot products (`math110.0.8`) before GPT; regex and file I/O (`cs100.0.7`, `cs100.0.6`) before the tokenizer |

Computed result (`dates.md`): the bridge ends 17 Jan 2027, the second pass and the rest of Zero to Hero end 7 Mar 2027.
