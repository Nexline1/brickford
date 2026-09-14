# Rejections

Every video read and turned down, with the reason. The brief asks for these
because they are as useful as the picks — and because a rejection log is the
only proof that anything was actually read.

**This log is tiny because Phase 2 never ran.** `youtube.com` is 403 from the
build environment, so the 80-query harvest that would have produced 400+
candidates has to run on Ali's machine. What follows is the handful reached
through `WebSearch` + the transcript MCP. The real list comes after the harvest.

| video | module | verdict | reason |
|---|---|---|---|
| [`w5fLlH-jA4M`](https://www.youtube.com/watch?v=w5fLlH-jA4M) — *Vinh Giang — 5 Vocal Foundations - Rate of Speech* | A3 | **Rejected** | Caption track auto-detected as Korean and transcribed as nonsense — "문일석 my q 니켈 odc 있고 is proven 차". 2:15 long, 414 "words", none of them recoverable. No English track available. |

## Why that one matters more than it looks

It is a real video, by a teacher who is on the shortlist, with an accurate title
that names a mechanic I specifically wanted for A3. Ranked on title and channel
alone it would have gone straight into the core path.

It is unusable. That is the entire argument for the rule:

> *"Never put a video in the curriculum without reading its transcript. Titles lie."*

The failure mode here is not a bad video — it is a good video with a broken
caption track, which no amount of metadata would have caught. Note also that
another video from the *same channel* (`YyWZmdkPfDM`) transcribed cleanly and
was accepted. Channel-level credibility does not transfer to the individual
video.

## Searched for, nothing found (14 Sep)

Four more `WebSearch` passes aimed at the two biggest remaining gaps returned
**no YouTube video at all** — only blogs, SEO listicles, PDFs and paid courses:

| target | module | what came back |
|---|---|---|
| joke structure / setup-punchline / misdirection, twice | **A5** | MasterClass, Udemy, comedy blogs |
| short-form hooks / first three seconds | **B1** | opus.pro, virvid.ai, faceless.so |
| Jenny Hoyos on Shorts retention | **B1** | LinkedIn, Medium, podcast summaries |

This is not a content gap, it is a **discovery** gap, and it is the clearest
demonstration yet of why the local harvest is still the critical path.
`WebSearch` is a web search engine: it surfaces pages *about* a topic, and the
pages that rank for "how to write a joke" are the ones written for search, not
the videos that teach it. `yt-dlp "ytsearch40:joke writing structure comedy
class"` searches YouTube itself and would return forty actual videos.

**A5 (humour construction) and B1 (short-form structure) therefore still have no
source.** A5 is the more serious of the two — the taxonomy puts humour
construction *before* humour in real time, and the course currently has the
second without the first.

## Not yet scored

Three videos passed the read and are installed as the seed. They have **not**
been through Phase 3 scoring, and the distinction matters: scoring without a
pool is theatre. The redundancy penalty — *"drop its score hard if a mechanic is
already covered by a higher-scoring video"* — cannot fire when there is only one
video per module. You cannot decline the twelfth video on hooks until you have
found twelve.

So the seed is: transcript-verified, mechanically useful, and **unranked**. When
the harvest lands, all three go back into the pool and compete on the six axes
like everything else. Any of them may lose its place.
