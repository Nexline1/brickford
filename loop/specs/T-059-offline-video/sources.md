# T059 - Official, freely licensed, downloadable copies of the Brickford lectures

Researched 2026-10-28. Read-only: nothing in the repo was changed.

## Read this first: what could and could not be verified

The session's network policy allows only `github.com` and `raw.githubusercontent.com`. Every publisher host was refused (403 on CONNECT, or ENOTFOUND for WebFetch): `ocw.mit.edu`, `archive.org`, `youtube.com`, `stat110.hsites.harvard.edu`, `cs336.stanford.edu`, `dlsyscourse.org`, `course.fast.ai`, `karpathy.ai`, `3blue1brown.com`, `inference.org.uk`, `ted.com`, `video.stanford.edu`, `matthewdicks.com`. I did not try mirrors or proxies of those hosts.

So:
- **CORS is "unknown" for every host.** No `curl -I` against a file host was possible.
- **No file was downloaded, and no file size was measured.** Sizes below are copied from OCW's own pages or metadata (source stated per row).
- **No live link was tested.** URLs come from (a) MIT OCW's own content repos on GitHub (org `mitocwcontent`, snapshot Jan 2022), (b) a 2013 scrape of OCW's old HTML pages (`ivan6209/teacher-mitArchive-git`), (c) one OCW developer test repo for a 2023 course, (d) WebSearch result summaries. Treat every "yes" as "the publisher's own pages pointed there at snapshot time".
- Facts that come only from a search summary are marked "search summary". Those are the weakest.

Counts: the task says 463 lectures. The curriculum has **466 lesson rows but 463 distinct YouTube ids** (3 ids repeat: `kCc8FmEb1nY` in ai200+ai300, `DAOcjicFr1Y` twice in ai300, `LPv1KfUXLCo` in ai300+ai310). None of the repeats is a covered lecture, so covered rows = covered ids.

## Result

**Covered (official file, stated CC licence, mapped lecture by lecture): 124 of 463 distinct lectures (26.8%).**
**Plus 16 lectures with an official download but no stated licence (MacKay): 140 of 463 (30.2%) if the owner accepts "published for download, licence unstated".** The 16 are not in the 124.

Covered lectures: MATH 110 35, MATH 120 35, PHYS 100 37, MATH 210 17. Everything else: none found.

### Table

| Course | Source (what the lessons embed) | Official download | Licence | Host | CORS | Covered / total | Typical MB per lecture | Evidence |
|---|---|---|---|---|---|---|---|---|
| MATH 110 (51) | Unit I: 3Blue1Brown, 16 videos. Unit II: MIT OCW 18.06 (Strang), 35 videos, from OCW's own YouTube playlist `PLE7DDD91010BC51F8` | **Partial.** Unit II yes (35/35, matched by YouTube id). Unit I none found | OCW: CC BY-NC-SA (OCW terms page, search summary says 4.0). Unit I: unknown (see notes) | archive.org, `archive.org/download/MIT18.06S05_MP4/NN.mp4` | unknown | **35 / 51** | ~195 (range 159-213) per 2013 OCW page. A search summary of today's OCW lecture-videos page shows 88/103/106 MB, unpaired. Unknown which is current | A1 below; `mitocwcontent/18.06-spring-2010` `content/resources/lecture-*.md` |
| MATH 120 (47) | Unit I: 3Blue1Brown, 12 videos. Unit II: MIT OCW 18.01 (Jerison), 35 videos (recorded Fall 2007, published under the 18.01 Fall 2006 course) | **Partial.** Unit II yes (35/35, matched by YouTube id). Unit I none found | OCW CC BY-NC-SA (course page, search summary). Unit I unknown | archive.org, `archive.org/download/MIT18.01JF07/ocw-18.01-f07-lecNN_300k.mp4` | unknown | **35 / 47** | ~207 (range 167-219) per 2013 OCW page | A2 below; `mitocwcontent/18.01-fall-2006` |
| MATH 130 (34) | Harvard Stat 110 (Blitzstein), YouTube playlist | **None found** (site says YouTube and iTunes U; no download link seen) | Harvard page footer "Copyright ... President and Fellows of Harvard College" (search summary). No CC found | n/a | unknown | **0 / 34** | n/a | search summary of `stat110.hsites.harvard.edu` (host blocked, not fetched) |
| AI 200 (15) | 3Blue1Brown NN primer (4) + Karpathy Zero to Hero (11) | **None found** | Karpathy code: MIT. Videos: no licence found. 3b1b: see notes | n/a | unknown | **0 / 15** | n/a | `karpathy/nn-zero-to-hero` README: "a series of YouTube videos" |
| AI 210 (8) | fast.ai 2022 Part 1 (Howard) | **None found** | Site source repo: Apache-2.0 (`fastai/course22-web` LICENSE). Videos: no licence found | n/a | unknown | **0 / 8** | n/a | `course22-web/Lessons/lesson1.qmd` embeds a `youtube-nocookie.com` iframe and offers no download |
| PHYS 100 (37) | Walter Lewin, MIT 8.01 Fall 1999: intro + lectures 1-35 + "For the Love of Physics" | **Yes, with caveats** (see notes). 37/37 mapped by title and order, not by YouTube id | CC BY-NC-SA 3.0 US (OCW page footer, 2013) | archive.org, item `MIT8.01F99`, `NN_512kb.mp4` | unknown | **37 / 37** | ~199 (range 167-226; intro 13, last lecture 132) per 2013 OCW page | A3 below; `Physics_I:_Classical_Mechanics(Fall_1999)/.../video-lectures/lecture-N/index.htm` in `ivan6209/teacher-mitArchive-git` |
| MATH 210 (36) | Unit I: MIT 18.S096 IAP 2023 (Edelman, Johnson), OCW's own playlist `PLUl4u3cNGP62EaLLH92E_VCN4izBKK6OE`, 17 videos. Unit II: three Stanford CS231n lectures. Unit III: MacKay, 16 | **Partial.** Unit I yes (17/17). Unit II not checked. Unit III downloadable, licence unstated | Unit I: CC BY-NC-SA 4.0, stated in each resource file and in the YouTube description | Unit I: OCW's own storage (`archive_url` is empty; path under `ol-ocw-studio-app/courses/18-s096-...`). Unit III: Cambridge `inference.org.uk/itprnn_lectures/` (search summary) | unknown | **17 / 36** (+16 not counted) | Unit I: mean 82.8, range 43.9-154.5 (`file_size` in OCW metadata, 360p). Unit III: unknown; one file listed as 950 MB (search summary) | A4, A5 below; `gumaerc-testorg/18.s096-iap-2023` |
| AI 300 (4 rows, 3 ids) | One unidentified video (`DAOcjicFr1Y`, used twice) + a Karpathy and a CS336 video that also sit in AI 200 / AI 310 | **None found** | n/a | n/a | unknown | **0 / 4** | n/a | repeats, see above |
| SYS 250 (36) | CMU 10-714 (Chen, Kolter), 24; GPU MODE, 12 | **None found** | unknown | n/a | unknown | **0 / 36** | n/a | `gpu-mode/lectures` README links only the YouTube channel; `dlsyscourse.org` blocked, search results show YouTube only |
| AI 310 (17) | Stanford CS336 Spring 2025 (Liang, Hashimoto) | **None found** | unknown | n/a | unknown | **0 / 17** | n/a | CS336 site source (`stanford-cs336/stanford-cs336.github.io` index.html): "Recordings: YouTube playlist" only |
| RES 400 (11) | David Silver RL (10, DeepMind/UCL); Hamming talk (1) | **None found** | unknown | n/a | unknown | **0 / 11** | n/a | search summaries only: lectures on DeepMind's YouTube channel; Hamming appears as transcripts only |
| SPCH 100 (170) | many independent creators. By title: 9 TED, 1 TED-Ed, 16 TEDx, 6 Talks at Google, 2 Pixar in a Box (Khan Academy), 2 Stanford GSB, rest individuals | **None found** | TED talks: CC BY-NC-ND 4.0 for sharing, but see notes: downloading not authorised | n/a | unknown | **0 / 170** | n/a | TED usage policy and TED-Ed help article (search summaries) |
| **Total** |  |  |  |  |  | **124 / 463** (140 with MacKay) |  |  |

## Notes per course

**MATH 110 / MATH 120 (MIT OCW).** The OCW resource files carry `video_metadata.youtube_id`, and every one of the 70 Unit II ids in the curriculum is present: the lesson is the same upload OCW itself publishes. Each has an `archive_url`. Item names: `MIT18.06S05_MP4` (files `01.mp4`..`34.mp4`, `24b.mp4`) and `MIT18.01JF07`. OCW notes the 18.06 videos were recorded Fall 1999 and the 18.01 videos Fall 2007 (18.01 has no video for in-class exam sessions). Sizes in the appendix are the figures OCW printed in 2013 ("Internet Archive (MP4 - N MB)"). Whether today's OCW "Download video" button still points at these archive.org files is unknown, and the 2026 search summary lists smaller sizes (88-106 MB), so the files may have been re-encoded.

**3Blue1Brown (MATH 110 Unit I, MATH 120 Unit I, AI 200 primer, 32 videos).** No official download found. The `3b1b/videos` repo README says that repo's contents (the source code) are CC BY-NC-SA 4.0. That covers the code, not rendered video files. A search summary quoting an OER catalogue lists the channel as "YouTube Standard" licence; unconfirmed. The 3b1b FAQ page was not readable.

**PHYS 100 (Lewin).** The 2013 OCW pages list, per lecture, `http://www.archive.org/download/MIT8.01F99/N_512kb.mp4` ("Internet Archive (MP4 - ~199 MB)") and a smaller iTunes U copy (~112 MB). Page titles and order match the 37 curriculum rows exactly. Three caveats:
1. MIT removed Lewin's lectures from OCW in Dec 2014 (The Tech, CBS Boston, via search results). A search result for `archive.org/details/MIT8.01F99` shows the item page with 37 files and an "MIT OpenCourseWare" collection label, but I could not open it, so current availability is unknown.
2. The curriculum's YouTube ids are not MIT's upload ids (OCW's pages list different ids). Same recordings by title, different uploader. The "publisher's own channel" test therefore fails for the YouTube side, but the archive.org item is the publisher's.
3. Licence is CC BY-NC-SA 3.0 US per the 2013 OCW footer; search summaries for the archive.org item agree.
Fallback inside OCW: `8.01SC` Fall 2016 (211 short videos on `archive.org/download/MIT8.01F16/`), a different lecturer and format.

**MATH 210 (18.S096).** All 17 resource files say `license: https://creativecommons.org/licenses/by-nc-sa/4.0/`, `file_type: video/mp4`, 360p, with `file_size` in bytes (sum 1,407 MB). The YouTube description also says "License: Creative Commons BY-NC-SA". The repo I read is an OCW developer's test copy, not MIT's live site; the real OCW page for Lecture 1 Part 1 (`.../resources/ocw_18s096_lecture01_part1_2023jan18_mp4`) showed up in search results. Unit II (3 Stanford CS231n lectures) was not checked: unknown. Unit III (MacKay): per a search summary, the Cambridge page lists 16 MP4s, slides and snapshots for download, and says the 2012 filming was organised by Emli-Mari Nel; no licence is stated on the originals; the videolectures.net copies carry CC BY 4.0 per that site's own statement. Not counted.

**SPCH 100.** No official download found for any of the 170. TED: the usage policy offers CC BY-NC-ND 4.0 for sharing, but per the search summary TED's terms list downloading as prohibited without a licence and say the embeddable player must be used. TED-Ed's help article says TED cannot currently offer downloadable versions and that TED-Ed is not CC. Khan Academy's "Pixar in a Box" page was not readable. Brandon Sanderson's lecture: no CC licence found. Nothing here is counted.

**Everything else.** MATH 130, AI 210, AI 310, SYS 250, RES 400: the publisher's own pages point only to YouTube (verified from repo source for fast.ai, CS336, GPU MODE, Karpathy; from search summaries for Harvard, CMU, DeepMind). "None found" means no download link was seen; it is not proof that none exists.

## CORS

Unknown for all hosts. Two things to know before building:
- A plain `<video src="...">` plays cross-origin without CORS. CORS matters only if the app `fetch()`es the file to cache it (IndexedDB/Cache API) or reads bytes.
- A years-old Public Lab forum thread (via search) reports an `archive.org/download/...` URL redirecting to an `ia*.us.archive.org` host with no `Access-Control-Allow-Origin`, so the browser blocked it. Not current evidence either way; measure.

When the hosts are allowed, run once per host (follow the redirect, send an Origin):

```
curl -sIL -H 'Origin: https://example.app' 'https://archive.org/download/MIT18.06S05_MP4/01.mp4' | grep -i -E '^(HTTP|location|access-control|content-length|content-type)'
curl -sI  -H 'Origin: https://example.app' -H 'Range: bytes=0-1' 'https://archive.org/download/MIT8.01F99/1_512kb.mp4' | grep -i -E '^(HTTP|access-control|accept-ranges|content-range)'
```
Also check `Accept-Ranges: bytes` (needed for seeking) and an `OPTIONS` preflight if the app sends a `Range` header from `fetch()`.

## Legitimate open alternatives (checked in OCW's own repos only)

| For | Alternative | What I checked |
|---|---|---|
| MATH 130 Probability (Stat 110) | MIT 6.041SC (Tsitsiklis), 25 lectures: `archive.org/download/MIT6.041F10/MIT6_041F11_lecNN_300k.mp4`. Also MIT RES.6-012 Introduction to Probability, 242 short clips: `archive.org/download/MITRES.6-012S18/...` | Both listed in `mitocwcontent/6.041sc-fall-2013` and `res.6-012-spring-2018` with archive.org URLs. Not the same lectures as Stat 110; same subject |
| AI 200 (backprop, neural nets) and MATH 210 Unit II (optimisation) | MIT 18.065 (Strang), 34 lectures: `archive.org/download/MIT18.065S18/MIT18_065S18_LectureNN_300k.mp4`. Relevant: L22 gradient descent, L23 momentum, L25 SGD, L26 structure of neural nets, L27 backpropagation, L32-33 CNNs | Listed in `mitocwcontent/18.065-spring-2018`. Theory lectures, not Karpathy's code-alongs |
| PHYS 100 fallback | MIT 8.01SC Fall 2016 (211 short videos) | Listed in `mitocwcontent/8.01sc-fall-2016` |
| AI 210, AI 310, SYS 250, RES 400, SPCH 100 | None checked | n/a |

## To finish verification (needs network access)

Allow `ocw.mit.edu`, `archive.org` and `*.us.archive.org` first: that covers all 124 counted lectures. Then:
1. HEAD every URL in the appendix (200 vs 404, `content-length`, CORS, `accept-ranges`). Expected: sizes in the appendix are 2013 values.
2. Open `https://archive.org/details/MIT8.01F99` and confirm the 37 files still exist.
3. Open the live OCW pages for 18.06 Lecture 1, 18.01 Lecture 1 and 18.S096 Lecture 1 Part 1 and read the "Download video" target and licence line.
4. Optional, for the "none found" courses: `inference.org.uk/itprnn_lectures/` (MacKay licence), `ted.com` talk page download button, Khan Academy "Pixar in a Box" video page.

## Appendix: lecture-by-lecture mapping (124 counted lectures + 16 MacKay)

### A1. MATH 110 Unit II - MIT 18.06 (35/35 mapped by YouTube id)

Mapping key: `video_metadata.youtube_id` in the OCW resource file equals the curriculum `v`. Size = "Internet Archive (MP4 - N MB)" printed on the 2013 OCW lecture page (unknown if the file was re-encoded since).

| v | lecture | file | MB |
|---|---|---|---|
| J7DzL2_Na80 | The Geometry of Linear Equations | `https://archive.org/download/MIT18.06S05_MP4/01.mp4` | 159 |
| QVKj3LADCnA | Elimination with Matrices | `https://archive.org/download/MIT18.06S05_MP4/02.mp4` | 198 |
| FX4C-JpTFgY | Multiplication and Inverse Matrices | `https://archive.org/download/MIT18.06S05_MP4/03.mp4` | 198 |
| MsIvs_6vC38 | Factorization into A = LU | `https://archive.org/download/MIT18.06S05_MP4/04.mp4` | 201 |
| JibVXBElKL0 | Transposes, Permutations, Spaces R^n | `https://archive.org/download/MIT18.06S05_MP4/05.mp4` | 191 |
| 8o5Cmfpeo6g | Column Space and Nullspace | `https://archive.org/download/MIT18.06S05_MP4/06.mp4` | 185 |
| VqP2tREMvt0 | Solving Ax = 0: Pivot Variables, Special Solutions | `https://archive.org/download/MIT18.06S05_MP4/07.mp4` | 173 |
| 9Q1q7s1jTzU | Solving Ax = b: Row Reduced Form R | `https://archive.org/download/MIT18.06S05_MP4/08.mp4` | 188 |
| yjBerM5jWsc | Independence, Basis, and Dimension | `https://archive.org/download/MIT18.06S05_MP4/09.mp4` | 200 |
| nHlE7EgJFds | The Four Fundamental Subspaces | `https://archive.org/download/MIT18.06S05_MP4/10.mp4` | 198 |
| 2IdtqGM6KWU | Matrix Spaces; Rank 1; Small World Graphs | `https://archive.org/download/MIT18.06S05_MP4/11.mp4` | 185 |
| 6-wh6yvk6uc | Graphs, Networks, Incidence Matrices | `https://archive.org/download/MIT18.06S05_MP4/12.mp4` | 191 |
| l88D4r74gtM | Quiz 1 Review | `https://archive.org/download/MIT18.06S05_MP4/13.mp4` | 191 |
| YzZUIYRCE38 | Orthogonal Vectors and Subspaces | `https://archive.org/download/MIT18.06S05_MP4/14.mp4` | 199 |
| Y_Ac6KiQ1t0 | Projections onto Subspaces | `https://archive.org/download/MIT18.06S05_MP4/15.mp4` | 195 |
| osh80YCg_GM | Projection Matrices and Least Squares | `https://archive.org/download/MIT18.06S05_MP4/16.mp4` | 192 |
| 0MtwqhIwdrI | Orthogonal Matrices and Gram-Schmidt | `https://archive.org/download/MIT18.06S05_MP4/17.mp4` | 198 |
| srxexLishgY | Properties of Determinants | `https://archive.org/download/MIT18.06S05_MP4/18.mp4` | 197 |
| 23LLB9mNJvc | Determinant Formulas and Cofactors | `https://archive.org/download/MIT18.06S05_MP4/19.mp4` | 213 |
| QNpj-gOXW9M | Cramer's Rule, Inverse Matrix, and Volume | `https://archive.org/download/MIT18.06S05_MP4/20.mp4` | 204 |
| cdZnhQjJu4I | Eigenvalues and Eigenvectors | `https://archive.org/download/MIT18.06S05_MP4/21.mp4` | 205 |
| 13r9QY6cmjc | Diagonalization and Powers of A | `https://archive.org/download/MIT18.06S05_MP4/22.mp4` | 207 |
| IZqwi0wJovM | Differential Equations and exp(At) | `https://archive.org/download/MIT18.06S05_MP4/23.mp4` | 204 |
| lGGDIGizcQ0 | Markov Matrices; Fourier Series | `https://archive.org/download/MIT18.06S05_MP4/24.mp4` | 204 |
| QuZL5IKpO_U | Quiz 2 Review | `https://archive.org/download/MIT18.06S05_MP4/24b.mp4` | 193 |
| UCc9q_cAhho | Symmetric Matrices and Positive Definiteness | `https://archive.org/download/MIT18.06S05_MP4/25.mp4` | 175 |
| M0Sa8fLOajA | Complex Matrices; Fast Fourier Transform | `https://archive.org/download/MIT18.06S05_MP4/26.mp4` | 191 |
| vF7eyJ2g3kU | Positive Definite Matrices and Minima | `https://archive.org/download/MIT18.06S05_MP4/27.mp4` | 202 |
| TSdXJw83kyA | Similar Matrices and Jordan Form | `https://archive.org/download/MIT18.06S05_MP4/28.mp4` | 183 |
| TX_vooSnhm8 | Singular Value Decomposition | `https://archive.org/download/MIT18.06S05_MP4/29.mp4` | 162 |
| Ts3o2I8_Mxc | Linear Transformations and Their Matrices | `https://archive.org/download/MIT18.06S05_MP4/30.mp4` | 198 |
| 0h43aV4aH7I | Change of Basis; Image Compression | `https://archive.org/download/MIT18.06S05_MP4/31.mp4` | 201 |
| HgC1l_6ySkc | Quiz 3 Review | `https://archive.org/download/MIT18.06S05_MP4/32.mp4` | 189 |
| Go2aLo7ZOlU | Left and Right Inverses; Pseudoinverse | `https://archive.org/download/MIT18.06S05_MP4/33.mp4` | 167 |
| RWvi4Vx4CDc | Final Course Review | `https://archive.org/download/MIT18.06S05_MP4/34.mp4` | 173 |

### A2. MATH 120 Unit II - MIT 18.01 (35/35 mapped by YouTube id)

| v | lecture | file | MB |
|---|---|---|---|
| 7K1sB05pE0A | Rate of Change | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec01_300k.mp4` | 209 |
| ryLdyDrBfvI | Limits | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec02_300k.mp4` | 212 |
| kCPVBl953eY | Derivatives | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec03_300k.mp4` | 201 |
| 4sTKcvYMNxk | Chain Rule | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec04_300k.mp4` | 185 |
| 5q_3FDOkVRQ | Implicit Differentiation | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec05_300k.mp4` | 197 |
| 9v25gg2qJYE | Exponential and Log | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec06_300k.mp4` | 193 |
| eHJuAByQf5A | Exam 1 Review | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec07_300k.mp4` | 204 |
| BSAA0akmPEU | Linear and Quadratic Approximations | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec09_300k.mp4` | 188 |
| eRCN3daFCmU | Curve Sketching | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec10_300k.mp4` | 208 |
| twzGBqPeW0M | Max-min | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec11_300k.mp4` | 200 |
| YN7k_bXXggY | Related Rates | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec12_300k.mp4` | 201 |
| sRIDVAcoG5A | Newton's Method | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec13_300k.mp4` | 216 |
| 4Q37iOyBq44 | Mean Value Theorem | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec14_300k.mp4` | 218 |
| -MI0b4h3rS0 | Antiderivatives | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec15_300k.mp4` | 196 |
| 60VGKnYBpbg | Differential Equations | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec16_300k.mp4` | 194 |
| hjZhPczMkL4 | Definite Integrals | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec18_300k.mp4` | 201 |
| 1RLctDS2hUQ | First Fundamental Theorem | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec19_300k.mp4` | 206 |
| Pd2xP5zDsRw | Second Fundamental Theorem | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec20_300k.mp4` | 211 |
| _JXPe2J069c | Applications to Logarithms | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec21_300k.mp4` | 214 |
| ShGBRUx2ub8 | Volumes | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec22_300k.mp4` | 212 |
| R9a_NHXrBcg | Work, Probability | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec23_300k.mp4` | 207 |
| jBkXbAgMj6s | Numerical Integration | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec24_300k.mp4` | 215 |
| zUEuKrxgHws | Exam 3 Review | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec25_300k.mp4` | 210 |
| Bv9kVDcj7yo | Trig Integrals | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec27_300k.mp4` | 199 |
| CXKoCMVqM9s | Inverse Substitution | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec28_300k.mp4` | 207 |
| HgEqXhsIq_g | Partial Fractions | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec29_300k.mp4` | 207 |
| aeXp1zC6Hls | Integration by Parts | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec30_300k.mp4` | 219 |
| TpWQlKHPyJ4 | Parametric Equations | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec31_300k.mp4` | 194 |
| XRkgBWbWvg4 | Polar Coordinates | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec32_300k.mp4` | 210 |
| BGE3wb7H2PA | Exam 4 Review | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec33_300k.mp4` | 209 |
| PNTnmH6jsRI | Indeterminate Forms | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec35_300k.mp4` | 208 |
| KhwQKE_tld0 | Improper Integrals | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec36_300k.mp4` | 210 |
| MK_0QHbUnIA | Infinite Series | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec37_300k.mp4` | 214 |
| wOHrNt9ScYs | Taylor's Series | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec38_300k.mp4` | 202 |
| --lPz7VFnKI | Final Review | `https://archive.org/download/MIT18.01JF07/ocw-18.01-f07-lec39_300k.mp4` | 167 |

### A3. PHYS 100 - MIT 8.01 Fall 1999 (37/37 mapped by title and order, NOT by YouTube id)

The 2013 OCW pages list MIT's own YouTube ids, which differ from the curriculum ids. Titles match 1:1 (including the "Weightlessnes" typo). Size = "Internet Archive (MP4 - N MB)" on the 2013 OCW page. Item MIT8.01F99 was linked from OCW; OCW removed the lectures in Dec 2014; current availability of the archive.org item is unverified.

| v | lecture | file | MB |
|---|---|---|---|
| Uo28HOrhipc | Introduction | `https://archive.org/download/MIT8.01F99/intro_512kb.mp4` | 13 |
| X9c0MRooBzQ | Units, Dimensions, and Scaling Arguments | `https://archive.org/download/MIT8.01F99/1_512kb.mp4` | 154 |
| 8tTwp4XX-5Y | Introduction to Kinematics | `https://archive.org/download/MIT8.01F99/2_512kb.mp4` | 206 |
| hgkKE8szT18 | Vectors | `https://archive.org/download/MIT8.01F99/3_512kb.mp4` | 200 |
| 92Em8p6Qzmo | The Motion of Projectiles | `https://archive.org/download/MIT8.01F99/4_512kb.mp4` | 213 |
| Usg_IPT5gJQ | Uniform Circular Motion | `https://archive.org/download/MIT8.01F99/5_512kb.mp4` | 205 |
| Xuj8iPVu7q0 | Newton's First, Second, and Third Laws | `https://archive.org/download/MIT8.01F99/6_512kb.mp4` | 198 |
| M0mxyPOMcw0 | Weight, Perceived Gravity, and Weightlessnes | `https://archive.org/download/MIT8.01F99/7_512kb.mp4` | 201 |
| lXhtdUMt6Ek | Frictional Forces | `https://archive.org/download/MIT8.01F99/8_512kb.mp4` | 194 |
| DzO4qR9ZcXU | Review of Lectures 1 through 5 | `https://archive.org/download/MIT8.01F99/9_512kb.mp4` | 202 |
| klIlCfte0UM | Hooke's Law, Simple Harmonic Oscillator | `https://archive.org/download/MIT8.01F99/10_512kb.mp4` | 199 |
| 54VrCrWqaPU | Work, Energy, and Universal Gravitation | `https://archive.org/download/MIT8.01F99/11_512kb.mp4` | 198 |
| XFo08M8MGhg | Resistive Forces | `https://archive.org/download/MIT8.01F99/12_512kb.mp4` | 200 |
| GqSt9aMgu7Q | Equation of Motion for Simple Harmonic Oscillators | `https://archive.org/download/MIT8.01F99/13_512kb.mp4` | 207 |
| CW353dqcbtA | Orbits and Escape Velocity | `https://archive.org/download/MIT8.01F99/14_512kb.mp4` | 201 |
| vXjjNRSELTw | Momentum and Its Conservation | `https://archive.org/download/MIT8.01F99/15_512kb.mp4` | 211 |
| ogiY6xt_TRM | Elastic and Inelastic Collisions | `https://archive.org/download/MIT8.01F99/16_512kb.mp4` | 198 |
| 3X63nXD6rsg | Momentum of Individual Objects, Rocket Equation | `https://archive.org/download/MIT8.01F99/17_512kb.mp4` | 196 |
| v3FdoCOBvak | Review of Lectures 6 through 15 | `https://archive.org/download/MIT8.01F99/18_512kb.mp4` | 200 |
| kB5ikKusiM4 | Rotating Rigid Bodies, Inertia, and Axis Theorems | `https://archive.org/download/MIT8.01F99/19_512kb.mp4` | 167 |
| Mcy4fVLHumI | Angular Momentum | `https://archive.org/download/MIT8.01F99/20_512kb.mp4` | 207 |
| fLfjU-RdAHg | Torque | `https://archive.org/download/MIT8.01F99/21_512kb.mp4` | 192 |
| G5zxfMmRtsk | Kepler's Laws, Elliptical Orbits, and Maneuvers | `https://archive.org/download/MIT8.01F99/22_512kb.mp4` | 198 |
| oY8ak7hxKpw | Doppler Effect, Binary Stars, Neutron Stars, Black Holes | `https://archive.org/download/MIT8.01F99/23_512kb.mp4` | 203 |
| N92FYHHT1qM | Rolling Motion, Gyroscopes | `https://archive.org/download/MIT8.01F99/24_512kb.mp4` | 202 |
| ZC0nSed4BXY | Static Equilibrium, Stability, Rope Walker | `https://archive.org/download/MIT8.01F99/25_512kb.mp4` | 195 |
| u7MnqQrRD_s | Elasticity and Young's Modulus | `https://archive.org/download/MIT8.01F99/26_512kb.mp4` | 226 |
| bXyxZU1_MSc | Gases and Incompressible Liquids | `https://archive.org/download/MIT8.01F99/27_512kb.mp4` | 199 |
| Hlmpoo32QPE | Hydrostatics, Archimedes' Principle, Fluid Dynamics | `https://archive.org/download/MIT8.01F99/28_512kb.mp4` | 197 |
| agxXsniwBTY | Review of Lectures 16 through 24 | `https://archive.org/download/MIT8.01F99/29_512kb.mp4` | 200 |
| nNvVVIQOFsc | Simple Harmonic Oscillations of Suspended Solid Bodies | `https://archive.org/download/MIT8.01F99/30_512kb.mp4` | 200 |
| aYEl8YJz8iQ | Pendulums and Springs | `https://archive.org/download/MIT8.01F99/31_512kb.mp4` | 193 |
| FFMKON9IkAU | Thermal Expansion | `https://archive.org/download/MIT8.01F99/32_512kb.mp4` | 198 |
| PLISNwkiqlk | Ideal-Gas Law | `https://archive.org/download/MIT8.01F99/33_512kb.mp4` | 212 |
| ql1UN6hcymI | Heisenberg's Uncertainty Principle | `https://archive.org/download/MIT8.01F99/34_512kb.mp4` | 192 |
| eViW2PX6Z6M | Professor Lewin’s Early days at MIT | `https://archive.org/download/MIT8.01F99/35_512kb.mp4` | 177 |
| 4a0FbQdH3dY | For the Love of Physics (Walter Lewin's Last Lecture) | `https://archive.org/download/MIT8.01F99/ocw-8.01-For_the_Love_of_Physics_300k.mp4` | 132 |

### A4. MATH 210 Unit I - MIT 18.S096 IAP 2023 (17/17 mapped by YouTube id)

Source: OCW Studio resource files (copy in the OCW developer test repo `gumaerc-testorg/18.s096-iap-2023`; each file states `license: https://creativecommons.org/licenses/by-nc-sa/4.0/`, `archive_url` empty, so the file is not on archive.org). Page URL pattern: `https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/<stem>_mp4` (the Lecture 1 Part 1 page appeared in search results).

| v | lecture | file (360p) | MB (file_size) |
|---|---|---|---|
| 0YqjeqLhDDE | Lecture 1 Part 1: Introduction and Motivation | `ocw_18s096_lecture01_part1_2023jan18_360p_16_9.mp4` | 93.7 |
| 5DUQ3-Y_gX4 | Lecture 1 Part 2: Derivatives as Linear Operators | `ocw_18s096_lecture01-part2_2023jan18_360p_16_9.mp4` | 57.8 |
| v8EIBpBEC6A | Lecture 2 Part 1: Derivatives in Higher Dimensions: Jacobians and Matrix Functions | `ocw_18s096_lecture02-part1_2023jan20_360p_16_9.mp4` | 107.0 |
| DH118YqIgow | Lecture 2 Part 2: Vectorization of Matrix Functions | `ocw_18s096_lecture02-part2_2023jan20_360p_16_9.mp4` | 46.5 |
| BKo57m-uU1k | Lecture 3 Part 1: Kronecker Products and Jacobians | `ocw_18s096_lecture03-part1_2023jan23_360p_16_9.mp4` | 87.3 |
| gtG62xaelPE | Lecture 3 Part 2: Finite-Difference Approximations | `ocw_18s096_lecture03-part2_2023jan23_360p_16_9.mp4` | 101.9 |
| qWYtrT4TeIs | Lecture 4 Part 1: Gradients and Inner Products in Other Vector Spaces | `ocw_18s096_lecture04-part1_2023jan26_360p_16_9.mp4` | 96.8 |
| lBfqvBJaFmc | Lecture 4 Part 2: Nonlinear Root Finding, Optimization, and Adjoint Gradient Methods | `ocw_18s096_lecture04-part2_2023jan26_360p_16_9.mp4` | 94.9 |
| 66Hc7vnDQ8o | Lecture 5 Part 1: Derivative of Matrix Determinant and Inverse | `ocw_18s096_lecture05-part1-new_2023jan27_360p_16_9.mp4` | 43.9 |
| 5F6roh4pmJU | Lecture 5 Part 2: Forward Automatic Differentiation via Dual Numbers | `ocw_18s096_lecture05-part2-new_2023jan27_360p_16_9.mp4` | 64.7 |
| r9_5dxtDTOk | Lecture 5 Part 3: Differentiation on Computational Graphs | `ocw_18s096_lecture05-part3-new_2023jan27_360p_16_9.mp4` | 67.9 |
| cvBHoCAUkD4 | Lecture 6 Part 1: Adjoint Differentiation of ODE Solutions | `ocw_18s096_lecture06-part1_2023jan30_360p_16_9.mp4` | 154.5 |
| tTUT7YuSMoc | Lecture 6 Part 2: Calculus of Variations and Gradients of Functionals | `ocw_18s096_lecture06-part2_2023jan30_360p_16_9.mp4` | 47.3 |
| feU1kISxPDM | Lecture 7 Part 1: Derivatives of Random Functions | `ocw_18s096_lecture07-part1_2023feb01_360p_16_9.mp4` | 98.1 |
| PkpRIStmfrE | Lecture 7 Part 2: Second Derivatives, Bilinear Forms, and Hessian Matrices | `ocw_18s096_lecture07-part2_2023feb01_360p_16_9.mp4` | 50.9 |
| v6w8hVZPt0o | Lecture 8 Part 1: Derivatives of Eigenproblems | `ocw_18s096_lecture08-part1_2023feb03_360p_16_9.mp4` | 60.0 |
| 43kl6wi1H6k | Lecture 8 Part 2: Automatic Differentiation on Computational Graphs | `ocw_18s096_lecture08-part2_2023feb03_360p_16_9.mp4` | 134.0 |

Mean 82.8 MB, min 43.9, max 154.5, total 1407 MB for 17.


### A5. MATH 210 Unit III - MacKay (16 lectures; NOT counted - licence unknown)

Curriculum order matches the 16 filmed lectures (Cambridge, 2012). Per-file URLs were not verified; a search snippet of the Cambridge index shows `15.mp4 [950M]`.

- 1. `BCiZc0n6COY` Introduction to Information Theory
- 2. `y5VdtQSqiAI` Entropy and Data Compression (I): Introduction to Compression, Inf.Theory and Entropy
- 3. `0SxJl5G2bp0` Entropy and Data Compression (II): Shannon's Source Coding Theorem, The Bent Coin Lottery
- 4. `eHGqNvkL4n4` Entropy and Data Compression (III): Shannon's Source Coding Theorem, Symbol Codes
- 5. `cJ_rhZ9DP9k` Entropy and Data Compression (IV): Shannon's Source Coding Theorem, Symbol Codes
- 6. `9w4LnXIip5A` Noisy Channel Coding (I): Inference and Information Measures for Noisy Channels
- 7. `vVAsh5DAe10` Noisy Channel Coding (II): The Capacity of a Noisy Channel
- 8. `KSV8KnF38bs` Noisy Channel Coding (III): The Noisy-Channel Coding Theorem
- 9. `HrRNqb5C-b0` A Noisy Channel Coding Gem, And An Introduction To Bayesian Inference (I)
- 10. `mDVE0M-xQlc` An Introduction To Bayesian Inference (II): Inference Of Parameters And Models
- 11. `XJGfXuFQVNE` Approximating Probability Distributions (I):  Clustering As An Example Inference Problem
- 12. `sN_0iGWcyLI` Approximating Probability Distributions (II): Monte Carlo Methods (I)
- 13. `Qr6tg9oLGTA` Approximating Probability Distributions (III): Monte Carlo Methods (II): Slice Sampling
- 14. `rkV6Wu30x4g` Approximating Probability Distributions (IV): Variational Methods
- 15. `Z1pcTxvCOgw` Data Modelling With Neural Networks (I): Feedforward Networks: The Capacity Of A Neuron
- 16. `OvMGPHpa_tM` Data Modelling With Neural Networks (II): Content-Addressable Memories And State
