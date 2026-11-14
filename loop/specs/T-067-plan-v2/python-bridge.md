# The Python bridge (CS 100): the shorter one

**Decision (owner, 12 Nov): the shorter bridge.** CS50 already taught variables, functions, conditionals and loops, so CS50P lectures 0–2 are **skipped** (still in the data, unscheduled). The bridge is CS50P lectures 3–9, then a NumPy hour and a PyTorch-tensors session. The no-code 3Blue1Brown chapters and Karpathy's Deep dive run alongside on Fridays.

**Computed length** (`dates.md`): from the cutover, Sunday 22 Nov 2026, to Monday 4 Jan 2027. That is 38 study days, about **6 study weeks**, not the 5 asked for. The coding lectures fill 5 of every 6 days, and the 6th (Friday) carries the no-code talks. Typed along, CS50P 3–9 is 707 minutes of video, plus 58 for NumPy and 150 for PyTorch. The Karpathy second pass starts Tuesday 5 Jan 2027.

## Verification (12 Nov 2026)

The transcript tools were down all session: `Yt_T` needs an API key, and `Youtube_Transcribt` errored on every video. Later in the session youtube.com became reachable from the container. **Every new video id was then checked against YouTube itself**:
- oEmbed for the title and channel, which also proves the video exists and is public;
- the official playlist page, or a YouTube search result, for the length.

YouTube's watch pages answer with a bot check, so lengths came from playlists and search results, not from watch pages.

- **188 of 189 new lecture ids verified**, each with its real title, channel and length recorded in `check` in `plan-data.js`. That covers the bridge, the second pass and all seven additions.
- **2 ids corrected.** Both were from memory and wrong: CS50P Lecture 3 "Exceptions" is `LW7g1169v7w` (not `LW7g1169dDI`), and CS50P Lecture 4 "Libraries" is `MztLZWibctI` (not `u51Zjlnui4Y`).
- **Lengths corrected.** For example, CS50P 9 runs 2 h 29, not 1 h 40. Every date was recomputed from the real minutes.
- **1 gap, kept unverified.** MIT 18.03's official playlist has no Mattuck lecture 18. Its slot holds `pRIEYR5JHQA`, a different 2010 lecture by Miller and Vandiver. `math150.0.17` has no video until a source is found.
- **The PyTorch slice (verified 13 Nov 2026, T-073).** `V_xro1bcAuA` is freeCodeCamp's 25 h 37 PyTorch course. The lesson is chapters 13–29, **1:22:08–3:52:58** (about 150 minutes), read from the chapter list with get_video_details: 13 Intro to tensors 1:22:08, 14 Creating tensors 1:35:35, 17 Datatypes 1:54:01, 18 Attributes 2:03:26, 19 Manipulating 2:11:50, 20 Matmul 2:17:50, 23 min/max/mean/sum 2:48:18, 25 Reshaping/viewing/stacking 2:57:48, 26 Squeeze/unsqueeze/permute 3:11:31, 27 Indexing 3:23:28, 28 PyTorch and NumPy 3:33:01, 29 Reproducibility 3:42:10, and it stops where 30 GPU begins, 3:52:58. The first 1:22:08 is intro theory. The app plays the video from 0:00, so the lesson title says which part to watch.
- **Transcripts were not read.** The ids, titles and lengths are confirmed. What each lecture teaches, in the table below, comes from the course pages and titles. Step 3's practice items must be written from transcripts, so a transcript key is still needed (see README).

## The bridge, in order

"Practice" means the 2-hour block: about 75 minutes of coding and 45 minutes of math. It is not lecture time.

| Key | Lecture | Video id (verified) | Min | Teaches | Needed by | Practice (the CS50P problem set unless noted) |
|---|---|---|---:|---|---|---|
| cs100.0.0–0.2 | CS50P 0–2: Functions and Variables, Conditionals, Loops | `JP7ITIXGpHk`, `_b6NgY_pMdw`, `-7xg8pGcP6w` | 106, 56, 81 | — | — | **skipped**: covered by CS50 |
| cs100.0.3 | CS50P 3 — Exceptions | `LW7g1169v7w` | 45 | `try/except/else`, `raise` | reading tracebacks in every Karpathy notebook | Problem Set 3 |
| cs100.0.4 | CS50P 4 — Libraries | `MztLZWibctI` | 77 | `import`, `random`, `statistics`, `pip`, APIs, `sys.argv` | fast.ai 1 (`ai210.0.0`) | Problem Set 4 |
| cs100.0.5 | CS50P 5 — Unit Tests | `tIrcxwLqzjQ` | 51 | `assert`, `pytest` | checking your own Micrograd against PyTorch | Problem Set 5 |
| cs100.0.6 | CS50P 6 — File I/O | `KD-Yoel6EVQ` | 92 | `open`, `with`, CSV | Makemore 1 (`names.txt`), the tokenizer | Problem Set 6 |
| cs100.0.7 | CS50P 7 — Regular Expressions | `hy3sd9MOAcc` | 125 | `re`, patterns, groups | the GPT-2 tokenizer's split regex (`ai200.1.7`) | Problem Set 7 |
| cs100.0.8 | CS50P 8 — Object-Oriented Programming | `e4fwY9ZsxPw` | 168 | classes, `__init__`, `__str__`, properties, operator overloading, inheritance | **Micrograd** (`Value.__add__`, `__mul__`); `nn.Module` everywhere after | Problem Set 8, plus a 40-line `Value` class with `+` and `*` before Micrograd |
| cs100.0.9 | CS50P 9 — Et Cetera | `6pgodt1mezg` | 149 | sets, type hints, `argparse`, unpacking, `*args`, `map`, comprehensions, generators | every Karpathy file | Problem Set 9 |
| cs100.1.0 | NumPy for beginners (freeCodeCamp, Keith Galli) | `QUT1VHiLmmI` | 58 | arrays, `shape`, slicing, `sum(axis=)`, broadcasting | Makemore 1 | 20 array exercises: predict every shape before running |
| cs100.1.1 | PyTorch fundamentals (freeCodeCamp, Daniel Bourke), 1:22:08–3:52:58 (chapters 13–29) | `V_xro1bcAuA` | 150 | tensors, dtypes, indexing, `@`, `view`, `sum(dim, keepdim)`, broadcasting | **Makemore 1** (`N / N.sum(1, keepdim=True)`) | the chapter's exercises, then the bigram count table in NumPy and in PyTorch |
| cs100.2.0 | 3B1B — Large Language Models explained briefly | `LPZh9BOjkQs` | 8 | what an LLM does | motivation | one written paragraph |
| cs100.2.1 | 3B1B — Transformers, the tech behind LLMs (ch. 5) | `wjZofJX0v4M` | 27 | tokens, embeddings, softmax with temperature | Build GPT | explain temperature in writing |
| cs100.2.2 | 3B1B — Attention in transformers, step by step (ch. 6) | `eMlx5fFNoYc` | 26 | queries, keys, values, masking, heads | **Build GPT** (`ai200.1.6`) | draw one attention pattern by hand |
| cs100.2.3 | 3B1B — How might LLMs store facts (ch. 7) | `9-Jl0dxWQs8` | 23 | the MLP block, superposition | RES 400 interpretability | one written paragraph |
| ai200.2.1 | Karpathy — Deep dive into LLMs like ChatGPT (in the data) | `7xTGNNLPyMI` | 211 | pretraining, post-training, RL, hallucination | context | one written summary per Friday part |

**Easy NeetCode problems start in week 3 of the bridge**: two a day in the coding block, Arrays & Hashing first, in Python, with no AI.

**After the talks, Fridays carry MIT Missing Semester** (from 12 Feb 2027; see `additions.md`).

## Why CS50P (unchanged reasoning)

CS50P has the same teacher as the CS50 the owner finished. Each lecture has a problem set with an automatic checker, which gives "unsolved problems with a way to correct them". It covers what Karpathy assumes: classes with dunder methods, comprehensions, `*args`, regular expressions and file handling.

A short crash course was rejected: it gives no problems. NumPy and PyTorch are kept short, because Makemore 1 is broadcasting from its first minutes.

## Then the Karpathy second pass

Same videos under new keys `ai200.3.0`–`ai200.3.4`. All 9 Zero to Hero ids were verified in Karpathy's playlist `PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ`. He is typed along at about 31 minutes of video a day, and each lecture is followed by "rebuild it without the video".

| Lecture | Needs, besides the previous lecture |
|---|---|
| Micrograd (`ai200.3.0`) | CS50P 8 and 9, the chain rule (`math120.0.3`), 3B1B backprop calculus |
| Makemore 1 (`ai200.3.1`) | PyTorch tensors (`cs100.1.1`), matrix multiplication (`math110.0.3`), conditional probability (`math130.0.3`) |
| Makemore 2 (`ai200.3.2`) | random variables and distributions (`math130.0.7`) |
| Makemore 3 (`ai200.3.3`) | location and scale (`math130.0.13`) |
| Makemore 4 (`ai200.3.4`) | matrix multiplication's readings (`math110.1.2`) and the chain rule (`math120.1.3`); 18.02 comes later and is not needed here |
| Makemore 5 → Build GPT → Tokenizer → GPT-2 | attention (`cs100.2.2`) and dot products before GPT; regex and file I/O before the tokenizer |

Computed: Zero to Hero done **28 Feb 2027** with everything included (24 Feb if no addition ran).
