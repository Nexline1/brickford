# Rejections

Every video read and turned down, with the reason. The brief asks for these
because they are as useful as the picks — and because a rejection log is the
only proof that anything was actually read.

## T-037 harvest (2026-10-09)

Generated from `data/storytelling/candidates.jsonl`, which is the source of truth: every
candidate considered for SPCH 100 in T-037, installed or not, with its module, the query
that found it and the note written when it was read. **371 candidates: 170 installed, 201 rejected.**
Every installed video's transcript is stored in `data/storytelling/transcripts/`.

### Rejections by reason

| reason | count |
|---|---|
| Redundant: the mechanic is already installed | 55 |
| Not fetched: redundant on its face (title, length or source) | 55 |
| Thin: a performance, promo, fragment or low-density talk with no teachable mechanic | 33 |
| Transcript truncated by the tool — too much of the video unread | 28 |
| No readable transcript | 17 |
| Off the module's mechanic (title lies) | 7 |
| Another upload of an installed talk, a paid-course re-upload, or the same lecture | 6 |
| **total** | **201** |

Two policies drive most of these. **Redundancy:** a video is installed only if it adds a
mechanic no installed lesson already teaches, so a good video that repeats a better one is
rejected and the note names the lesson that covers it. **Truncation:** during the harvest
the transcript tool stopped at about 120,000 characters, and a video with more than about 15%
of its teaching unread was rejected rather than installed half-read. The tool now returns
whole transcripts; review round 1 re-fetched the two B3 videos rejected for this alone (one
installed, one rejected on density). The queries run in review round 1, including those that
found nothing worth logging, are in `data/storytelling/searches.jsonl`.

### Every rejection

#### A1 — 35 rejected

| video | reason |
|---|---|
| [`sB2HiVqux-M`](https://www.youtube.com/watch?v=sB2HiVqux-M) — *Live 1-Hour Workshop: Storytelling Breakdowns* | Transcript tool: 'This video is unavailable'. |
| [`ngjGwh4EfWY`](https://www.youtube.com/watch?v=ngjGwh4EfWY) — *The Moth Story Map / Dante Jackson / Moth EDU* | The transcript is only the told story; the 'map' is visual. No spoken mechanic to extract. |
| [`qnCMWo-A0_4`](https://www.youtube.com/watch?v=qnCMWo-A0_4) — *Storytelling Part 4 - Pixar in a Box (a), story structure* | A viewer's second-hand summary of Pixar in a Box, not Pixar teaching; the spine is already installed (spch100.1.0). |
| [`xe7Gzq6xM4A`](https://www.youtube.com/watch?v=xe7Gzq6xM4A) — *How to master the art of storytelling w/Matthew Dicks* | Transcript truncated by the tool at 40:07 of 54:12 (26% unread). |
| [`ybQTg-gnKQs`](https://www.youtube.com/watch?v=ybQTg-gnKQs) — *How to tell better stories in tech, life & make ideas storyworthy ft. Matthew Dicks (FULL EPISODE)* | Transcript truncated at 37:18 of 47:59 (22% unread). |
| [`EczEthi-QwA`](https://www.youtube.com/watch?v=EczEthi-QwA) — *5x15 and The Moth: How to Tell a Story* | Transcript truncated at 42:25 of 1:12:14 (41% unread). Re-found in the B3 search and re-fetched: same truncation. |
| [`MlZKwsx58po`](https://www.youtube.com/watch?v=MlZKwsx58po) — *Gateways 2019 Keynote by Randy Olson: Narrative is Everything: The ABT Framework* | Transcript truncated at 34:40 of 1:04:11 (46% unread). ABT installed via _96OKURDlwc instead. |
| [`si7MQAV6da4`](https://www.youtube.com/watch?v=si7MQAV6da4) — *Kindra Hall / Choose Your Story, Change Your Life / Talks at Google* | Off-mechanic: rewriting the stories you tell yourself (self-talk), not telling a story to others. |
| [`Q5QKCGIEjbw`](https://www.youtube.com/watch?v=Q5QKCGIEjbw) — *Speaking Your Truth: First Steps into the Art of Storytelling with Matthew Dicks* | Transcript truncated at 40:04 of 2:07:28. Re-found in the B3 search and re-fetched: same truncation. |
| [`d90tG7RDxsM`](https://www.youtube.com/watch?v=d90tG7RDxsM) — *Cracking the Code of Great Storytelling / Matthew Dicks / Vodcast Ep. #1* | Transcript truncated at 37:39 of 1:09:23. |
| [`bZDiwANRS84`](https://www.youtube.com/watch?v=bZDiwANRS84) — *How to Become a Master Storyteller (What Nobody Teaches You!)* | Transcript truncated at 32:25 of 1:54:11. Re-found in the B3 search and re-fetched: same truncation. |
| [`J4wguyJZI6A`](https://www.youtube.com/watch?v=J4wguyJZI6A) — *How to tell better stories / Matthew Dicks (Storyworthy)* | Transcript truncated at 35:05 of 1:42:53. |
| [`8NmQlCvpCIs`](https://www.youtube.com/watch?v=8NmQlCvpCIs) — *Make Stories That Stick* | 41-second short; its one idea (the frame: know the beginning and end) is taught in full in hCf3dHd8_i8. |
| [`UKBQyhwLxZE`](https://www.youtube.com/watch?v=UKBQyhwLxZE) — *Kindra Hall Stories That Stick (book review)* | Third-party book summary by a marketing channel, padded with subscribe CTAs; Hall herself is installed via boyKF4Z1WX0. |
| [`xtFMT7bJBFk`](https://www.youtube.com/watch?v=xtFMT7bJBFk) — *We Are All Storytellers / Teach Creativity with Adobe and Khan Academy* | Promotional overview of a teacher course; no mechanic. |
| [`TigfWxBRAwo`](https://www.youtube.com/watch?v=TigfWxBRAwo) — *#471: How to Make Your Stories Stronger by Calculating Your But-to-And Ratio* | Transcript truncated at 39:17 of 55:55. |
| [`tXC-cgxYZZw`](https://www.youtube.com/watch?v=tXC-cgxYZZw) — *How To Tell Stories That Move People - Will Storr* | Transcript truncated at 36:25 of 1:34:32. |
| [`0o11xmS8kuQ`](https://www.youtube.com/watch?v=0o11xmS8kuQ) — *Will Storr on the Science of Storytelling: We're storytelling animals* | Transcript truncated at 44:52 of 2:02:22. |
| [`Kzqd61lLyHk`](https://www.youtube.com/watch?v=Kzqd61lLyHk) — *How to be a better storyteller / Will Storr on Storytelling* | Two-minute promo; prediction/curiosity and goals-and-obstacles are covered better by KxDwieKpawg (Stanton). |
| [`DenjA_cxkQI`](https://www.youtube.com/watch?v=DenjA_cxkQI) — *The Story That Won: Trader Joe's, Masks, and One Perfect Moment* | A performance with no commentary — a model story, but it teaches no mechanic in its own words. |
| [`sK2P2NEIXUE`](https://www.youtube.com/watch?v=sK2P2NEIXUE) — *Speak Less. Expect More. / Matthew J Dicks / TEDxTheCountrySchool* | About teaching children (expect more of them), not a storytelling mechanic. |
| [`T62VEAtk-VE`](https://www.youtube.com/watch?v=T62VEAtk-VE) — *How to Tell a Short Story About Yourself / The 5 Minute Formula* | Redundancy: a generic three-act 'who I am' story; covered better by the spine (spch100.1.0) and Hall's normal/explosion/new normal; ends on subscribe CTA. |
| [`ngZQUebMSEg`](https://www.youtube.com/watch?v=ngZQUebMSEg) — *Pixar in a Box: Character Development* | A three-minute skit introducing the 'elevator test' for fictional characters; thin, and about designing characters rather than telling true stories. |
| [`M9NOvrU4Yew`](https://www.youtube.com/watch?v=M9NOvrU4Yew) — *The clues to a great story (re-upload)* | Duplicate of KxDwieKpawg (same talk, unofficial upload); not fetched. |
| [`RM36Po6R25U`](https://www.youtube.com/watch?v=RM36Po6R25U) — *Pixar's Secret Storytelling Formula (Andrew Stanton Interview)* | Not fetched: A1 already carries Stanton's own talk. |
| [`FvNvFBvicpI`](https://www.youtube.com/watch?v=FvNvFBvicpI) — *How to Tell a Story by The Moth: 18 Minute Summary* | Not fetched: a third-party book summary, not The Moth teaching. |
| [`5pFI9UuC_fc`](https://www.youtube.com/watch?v=5pFI9UuC_fc) — *Ira Glass on Storytelling 1* | Not fetched: another upload of the same Ira Glass series installed from yNgypfZ4Jc4. |
| [`RG4WcRAgm7Y`](https://www.youtube.com/watch?v=RG4WcRAgm7Y) — *Dan Harmon's Story Circle* | Not fetched: a screenwriting structure for episodes; the spoken-anecdote structure is already carried by the spine and Dicks. |
| [`EGf6WTFsqPE`](https://www.youtube.com/watch?v=EGf6WTFsqPE) — *Matthew Dicks at The Moth GrandSLAM Championship* | Not fetched: a performance; teaching is taken from his lessons. |
| [`HlfRsKPdV0g`](https://www.youtube.com/watch?v=HlfRsKPdV0g) — *Pixar in a Box Season 3: The Art of Storytelling* | Read in full. A 54-second trailer cut from the introduction video, which is installed (1rMnzNZkIX0). |
| [`mvsw-kze3QU`](https://www.youtube.com/watch?v=mvsw-kze3QU) — *The Moth - Stories of Schooling & Getting Schooled - SXSW EDU 2018* | Read the opening and sampled the rest: a live Moth show of performed stories, not instruction. Model stories, but no mechanic is taught. |
| [`74uv0mJS0uM`](https://www.youtube.com/watch?v=74uv0mJS0uM) — *Wired for story: Lisa Cron at TEDxFurmanU* | Read in full. An argument for why story persuades (change feeling before thinking, the brain as protagonist); the practice of persuading with story is installed in Unit X (Hall, Duarte, Raskin). About a minute of captions is missing near 12:00. |
| [`zfqGPv5GTPI`](https://www.youtube.com/watch?v=zfqGPv5GTPI) — *Wired for Story: What Audiences Really Crave and How to Give it to Them* | Read the first fifteen minutes (complete real captions available). A 96-minute talk to an MFA programme about writing novels; the module is spoken anecdote, and its central idea (a story is about how someone changes) is taught for speakers by Dicks (spch100.2.1, 2.6) and Stanton (2.4). |
| [`-hO7fM9EHU4`](https://www.youtube.com/watch?v=-hO7fM9EHU4) — *Brandon's Philosophy on Plot—Promises, Progress, and Payoffs* | Read in full (auto captions). Same lecturer and same mechanic from an earlier year of the course, without the payoff section; the uploading channel could not be verified from here. The complete official 2025 lecture (ihd76ijy9LU) is installed instead. |
| [`kqogXJSgkGI`](https://www.youtube.com/watch?v=kqogXJSgkGI) — *Bridging the Personal and Universal with Catherine Burns / The Future of StoryTelling Podcast* | Read in full. Mostly The Moth's history and its move online in 2020; the two craft points (don't be too slick or memorised; the specific detail opens onto the universal) are covered by spch100.5.10 and spch100.2.9. |

#### A2 — 5 rejected

| video | reason |
|---|---|
| [`1dMurjL582I`](https://www.youtube.com/watch?v=1dMurjL582I) — *Storytelling: The Art of Noticing / Ted Anthony / TEDxPittsburgh* | Off-mechanic: about deconstructing the stories marketing and politics tell you (media literacy), not finding your own stories. |
| [`8q0GTutHGNs`](https://www.youtube.com/watch?v=8q0GTutHGNs) — *How to build your story bank (free)* | A job-interview behavioural story bank (categories like ambiguity and prioritisation); generic and off-target. The bank habit is covered better by Homework for Life and Humm. |
| [`BRUGWA7pZHw`](https://www.youtube.com/watch?v=BRUGWA7pZHw) — *Doing 'Homework for Life' to Find Stories* | Redundant: a two-minute restatement of Homework for Life, already the seed lesson spch100.0.0 and spch100.3.0. |
| [`_zxar8m2VBk`](https://www.youtube.com/watch?v=_zxar8m2VBk) — *Storytelling Q&A: How Do You Organize Your Homework For Life?* | Transcript tool: 'This video is unavailable'. |
| [`6iswJAEi0es`](https://www.youtube.com/watch?v=6iswJAEi0es) — *2 Storytelling Exercises I've Done Every Day For 3 Years* | Read in full. Exercise one is Homework for Life (installed twice: Dicks's TEDx talk as spch100.0.0, and spch100.3.0); exercise two (improvise the day's story aloud with context, challenge, resolution) is the daily drill those lessons already set. |

#### A3 — 19 rejected

| video | reason |
|---|---|
| [`w5fLlH-jA4M`](https://www.youtube.com/watch?v=w5fLlH-jA4M) — *Vinh Giang — 5 Vocal Foundations - Rate of Speech* | Caption track auto-detected as Korean and transcribed as nonsense (see rejections.md). Logged here in T-037. |
| [`CuaY4qe4V34`](https://www.youtube.com/watch?v=CuaY4qe4V34) — *(title not returned)* | Transcript unavailable (LOGIN_REQUIRED); not installable without reading it. |
| [`hco4mOwuQmg`](https://www.youtube.com/watch?v=hco4mOwuQmg) — *Mastering your Vocal Image - Vinh Giang* | Caption track auto-detected as Dutch; text unreadable as English. 2-minute clip, covered by 6-shbSFc48E. |
| [`ZtTUfMHuioA`](https://www.youtube.com/watch?v=ZtTUfMHuioA) — *How to Speak Clearly & With Confidence - Matt Abrahams* | Transcript truncated at about 36:44 of 2:26:15 (over 75% unread). |
| [`lnpWb9_wr3g`](https://www.youtube.com/watch?v=lnpWb9_wr3g) — *How to be Heard: Secrets for Powerful Speaking and Listening with Julian Treasure* | Transcript truncated at about 40:02 of 56:14 (29% unread); the TED talk eIho2S0ZahI covers the speaking toolbox in full. |
| [`bHblBfPy5qU`](https://www.youtube.com/watch?v=bHblBfPy5qU) — *Public Speaking Eye Contact* | Redundant: its eye-contact advice is the first tip of U1O3UFeCEeU from the same coach. |
| [`pYeg90MNK8s`](https://www.youtube.com/watch?v=pYeg90MNK8s) — *How to Practise Stage Presence (And Actually Improve It)* | 2.5-minute promo with little teachable content. |
| [`IbafjfAAWO0`](https://www.youtube.com/watch?v=IbafjfAAWO0) — *Stop Saying 'Umm' in 20 Minutes - Simple Trick!* | 1:43 clip; the filler-word exercise is covered by the record-and-transcribe drill in FsxorSNJBaA. |
| [`2yBsNNEiOrM`](https://www.youtube.com/watch?v=2yBsNNEiOrM) — *(title not returned)* | Transcript unavailable (could not fetch); not installable without reading it. |
| [`gMtXGdaKBlM`](https://www.youtube.com/watch?v=gMtXGdaKBlM) — *Improve Your Public Speaking with the Power of the Pause* | 32-second clip; covered by -3PORS6gWF0. |
| [`PdZWpISPWUY`](https://www.youtube.com/watch?v=PdZWpISPWUY) — *Introduction to Body Language by Vinh Giang* | Read in full. The opening segment of a longer course ('with each section I will share the nuances'); its points (move the body to move the voice, be as big as the room) are covered better by Phillips (spch100.4.9) and the existing body-language lesson U1O3UFeCEeU. |
| [`08DEVitOATM`](https://www.youtube.com/watch?v=08DEVitOATM) — *Hand gestures for influence and impact - Vinh Giang* | Read in full. A fragment cut from the middle of a course (starts mid-sentence on a gesture called 'distractor'); functional gestures are taught completely by Phillips (spch100.4.9). |
| [`a2MR5XbJtXU`](https://www.youtube.com/watch?v=a2MR5XbJtXU) — *The surprising secret to speaking with confidence* | Not fetched: listed under the same title as the TEDxBrixton upload that was read and installed as spch100.4.10. One copy is enough. |
| [`BaH5qVXIzFU`](https://www.youtube.com/watch?v=BaH5qVXIzFU) — *How to Practice a Speech* | Read in full (default caption track is an Arabic translation; the English track exists). The 3x3+1 schedule overlaps spch100.4.8 (out-loud table reads at full energy, then without notes) and spch100.5.9 (memorise only the opening and closing); the new part (halving notes each day) is too thin for a 15-minute lesson. Sponsor segment 4:24-5:40. |
| [`SF2QKCpxpro`](https://www.youtube.com/watch?v=SF2QKCpxpro) — *Public Speaking Skills: Rehearsal* | Transcript tool could not fetch the video; cannot be installed unread. |
| [`jn3gJ70iD4w`](https://www.youtube.com/watch?v=jn3gJ70iD4w) — *Public Speaking Tip: How to Diagram Your Stage Movement* | Not fetched: stage-movement planning is now taught by spch100.4.11 and 4.12; a third lesson on the same mechanic would be redundant. |
| [`iul9LgpT-AM`](https://www.youtube.com/watch?v=iul9LgpT-AM) — *Public Speaking Basics: Stage Movement (Body Language #5 of 5)* | Not fetched: same mechanic as spch100.4.11 and 4.12, already installed. |
| [`jvw7KR_DYI0`](https://www.youtube.com/watch?v=jvw7KR_DYI0) — *Facial Expressions - Speaking Tip #41* | Read in full. The face carrying the emotion and an occasional smile are taught by spch100.4.1 (the five dials) and 4.4 (Alex Lyon); reacting in character is taught by the act-out lessons (spch100.6.19, 6.20). |
| [`XMHlU-Xl-0A`](https://www.youtube.com/watch?v=XMHlU-Xl-0A) — *Art of Storytelling Tool #2: Facial Expression* | Read in full. Mostly clips of children's stories being performed; one teaching point (let the emotion grow from inside rather than putting on a face) in about a minute. Too thin for a lesson. |

#### A4 — 5 rejected

| video | reason |
|---|---|
| [`2xOBcjob7qA`](https://www.youtube.com/watch?v=2xOBcjob7qA) — *The Psychology of Being a Super Communicator - Charles Duhigg* | Transcript truncated at 33:02 of 53:37 (38% unread); the matching principle is installed via ybrihVuh43A. |
| [`OBac5a8rDbY`](https://www.youtube.com/watch?v=OBac5a8rDbY) — *#16 How to do customer interviews? Rob Fitzpatrick, author of "The Mom Test"* | Transcript truncated at 35:38 of 61:44 (42% unread). Gap noted: no complete Mom Test source found for the audit-interview use case. |
| [`QS5H3xvReXU`](https://www.youtube.com/watch?v=QS5H3xvReXU) — *[The Mom Test] How to research a product nobody actually needs* | About product strategy for novelty products, not conversation mechanics. |
| [`SYSnWqaRv9w`](https://www.youtube.com/watch?v=SYSnWqaRv9w) — *Terry Gross on Effective Communication Skills - Up Close at NAFSA 2018* | About 5 minutes on interviewing (ground rule: tell me if it is too personal); the rest is biography and conference topics. Low density. |
| [`YaDsicojxdA`](https://www.youtube.com/watch?v=YaDsicojxdA) — *Terry Gross: My Job As An Interviewer Is To Find Out Something I Don't Know* | Talk-show segment; one paragraph on interview priorities, no mechanic. |

#### A5 — 24 rejected

| video | reason |
|---|---|
| [`OkF_QWAnKiM`](https://www.youtube.com/watch?v=OkF_QWAnKiM) — *Joke Writing Secrets the Pros Use (Tutorial)* | Transcript truncated at 39:51 of 2:18:35. |
| [`Z69mt4uuqWQ`](https://www.youtube.com/watch?v=Z69mt4uuqWQ) — *How to Write Comedy - Write 15 Jokes in 30 Minutes* | Listing technique is already taught by _ODsLIMSBq0 and Dean; the whole worked example is crude double entendres about a real person's affair. Read to 29:19. |
| [`lcu3oOciWeY`](https://www.youtube.com/watch?v=lcu3oOciWeY) — *How to Turn Problems into Punchlines - Judy Carter* | 98-second promo clip; no mechanic. |
| [`fhD9YbGeUVU`](https://www.youtube.com/watch?v=fhD9YbGeUVU) — *The 11 Tricks Behind Funny Storytelling (Scott Dikkers Interview)* | Transcript truncated at 36:52 of 64:14 (43% unread); the filters themselves installed via 7kl9DWY9gPQ. |
| [`0vMbMLQfrCM`](https://www.youtube.com/watch?v=0vMbMLQfrCM) — *Joe Toplyn - Comedy Writing for Late Night TV - Dramatists Guild - New York - Nov 13, 2014* | Transcript truncated at 41:49 of 72:47 (43% unread). |
| [`KztmE6jLTJ0`](https://www.youtube.com/watch?v=KztmE6jLTJ0) — *No. 13 - Joe Toplyn Talks Writing for Late Night Talk Shows* | Transcript truncated at 39:55 of 60:01 (33% unread). |
| [`tqnN8w6-Pb4`](https://www.youtube.com/watch?v=tqnN8w6-Pb4) — *Stand Up Comedy Fundamentals - Part 1 - Joke Structure, Performing Techniques - Greg Dean Classes* | Frame-setting only (how he built his taxonomy); no mechanic beyond Lo4cGaknU40. |
| [`bviXGe3Vz30`](https://www.youtube.com/watch?v=bviXGe3Vz30) — *Joke Writing Tips: Changing Perspective - Greg Dean* | 30-second clip. |
| [`ia1ZaBiYpZI`](https://www.youtube.com/watch?v=ia1ZaBiYpZI) — *Joke Writing - Stand Up Comedy Forum #1 with Greg Dean - What do you struggle with?* | Live Q&A forum, low density and partly a membership pitch; the useful part (strip what does not serve the joke) is in Lo4cGaknU40. Read to 32:21 of 69:30. |
| [`X5G0INWwQe4`](https://www.youtube.com/watch?v=X5G0INWwQe4) — *Hidden Tools For Writing A Comedy Screenplay - Steve Kaplan [FULL INTERVIEW]* | Transcript truncated at 53:27 of 2:16:15 (61% unread). |
| [`Oi8jgJdkXMI`](https://www.youtube.com/watch?v=Oi8jgJdkXMI) — *Seth Meyers on 'Late Night,' Fatherhood and How to Write the Perfect Joke - Standard Speaker Series* | Transcript truncated at 39:37 of 60:42 (35% unread). |
| [`voGUWsVak44`](https://www.youtube.com/watch?v=voGUWsVak44) — *How To Make Readers Laugh. Writing Humour With Dave Cohen* | Transcript truncated at 41:22 of 62:12 (33% unread). |
| [`mc1y-aFefb4`](https://www.youtube.com/watch?v=mc1y-aFefb4) — *How I convince people that I'm funny (even though I'm actually not) - EB McCready - TEDxOU* | Thin on mechanic; leans on the 1988 pen-in-mouth facial-feedback study, whose 2016 multi-lab replication did not reproduce it. Smiling is covered by U1O3UFeCEeU. |
| [`72LbiZMTAGQ`](https://www.youtube.com/watch?v=72LbiZMTAGQ) — *Build a Comedy Routine Webinar Beginner Classes Greg Dean* | Transcript truncated at 43:57 of 1:06:39 (34% unread). |
| [`VLhr2mntDxg`](https://www.youtube.com/watch?v=VLhr2mntDxg) — *How To Write Stand Up Comedy (FULL COURSE)* | Transcript unavailable through the MCP ('could not fetch'); not installable without reading it. |
| [`01zLfhFHeM4`](https://www.youtube.com/watch?v=01zLfhFHeM4) — *How to Fix a Joke (in Real Time)* | No captions on the video; not installable without reading it. |
| [`JiPnzYMNCF4`](https://www.youtube.com/watch?v=JiPnzYMNCF4) — *How to Start a Speech With Humor (Safest Method)* | Read in full. The callback opener; callbacks are already installed (spch100.7.7). |
| [`t6K2MEQUSkw`](https://www.youtube.com/watch?v=t6K2MEQUSkw) — *How to add Humor to your speech - The Analogy - Speaking Tip #33* | Read in full. Comparison and analogy humour, covered by Greg Dean's comparisons (spch100.7.10) and the levity list's contrast (spch100.6.9); mostly clips of other comedians. |
| [`EUBARePe4nI`](https://www.youtube.com/watch?v=EUBARePe4nI) — *How to Write "Genius" Jokes* | Read in full. The two-column incongruity list and the rule of three are taught already (spch100.6.4 late-night formula, 6.9 levity list); its worked examples are crude. |
| [`qtYrbLcPdGo`](https://www.youtube.com/watch?v=qtYrbLcPdGo) — *The #1 Joke Writing Mistake Beginners Make (And How to Fix It)* | Read in full. Leading comparisons and mirrored phrases are setup misdirection, covered by Greg Dean's structure and setup lessons (spch100.6.2, 6.3). |
| [`-BxKMgL75as`](https://www.youtube.com/watch?v=-BxKMgL75as) — *An introduction to a benign violation account of humor.* | Read in full. The same researcher's TEDx talk is installed (spch100.6.0) and covers the theory more fully. |
| [`XlZH-VmhSwE`](https://www.youtube.com/watch?v=XlZH-VmhSwE) — *Jimmy Carr & Frankie Boyle: The Most Honest Interview in Comedy (Full Unfiltered Conversation)* | Read in full. A rambling public Q&A; the craft points (audiences regulate comedy, joke order builds trust) are a few lines among tour talk and offensive asides. |
| [`9lOyUo_F1oU`](https://www.youtube.com/watch?v=9lOyUo_F1oU) — *Telling Funny Stories - Stand Up Comedy Routine - Greg Dean* | Read in full. Mostly a performance clip; the teaching is a list of what funny stories need, each taught in full by spch100.6.19 and 6.20. |
| [`RL2fBcSSiGA`](https://www.youtube.com/watch?v=RL2fBcSSiGA) — *How to tell a funny story in stand up comedy writing.* | Read in full. Jab-jab-punch (laughs along the way), write 500 words then insert small jokes, make yourself the target: covered by the laugh generator (spch100.6.16), Birbiglia (6.8) and the self-deprecation lessons (7.13, 7.14). Unattributed channel; its laughs-per-minute figure is unsourced. |

#### A6 — 16 rejected

| video | reason |
|---|---|
| [`6iFCm5ZokBI`](https://www.youtube.com/watch?v=6iFCm5ZokBI) — *Humor at work - Andrew Tarvin - TEDxOhioStateUniversity* | Redundant with MdZAMSyn_As (same speaker); mostly the benefits case, less mechanic. |
| [`uJKDipbCzdc`](https://www.youtube.com/watch?v=uJKDipbCzdc) — *Jennifer Aaker and Naomi Bagdonas: Why great leaders take humor seriously* | Not fetched: the same authors' full Talks at Google session (Fi5MNuF30FQ) is installed. |
| [`b89e8qQ3cl4`](https://www.youtube.com/watch?v=b89e8qQ3cl4) — *Second City and the Power of "Yes, And" with Kelly Leonard - The Future of StoryTelling Podcast* | Read in full. Redundant: the same speaker's yes-and exercise is installed in a tighter form with the 'thank you because' tool (KA447nZpVzs); the rest is anecdote and podcast promotion. |
| [`BUHqWaU3Krk`](https://www.youtube.com/watch?v=BUHqWaU3Krk) — *Getting to 'Yes And': The Art of Business Improv - Bob Kulhan* | Title lies: the only caption track is a Russian audiobook reading of a novel, unrelated to the title. |
| [`T0-xW_G1nQM`](https://www.youtube.com/watch?v=T0-xW_G1nQM) — *Dan Klein - Designing the Future with Improvisation - Singularity University* | Read in full (real captions). Redundant: yes-and, mistakes as gifts, don't try to be funny, 80% listening are his mentor Madson's points, already installed at 57 minutes (spch100.7.2); adds only the one-word-at-a-time game, which KA447nZpVzs also has. |
| [`C1uIw3wxyC4`](https://www.youtube.com/watch?v=C1uIw3wxyC4) — *Status - Keith Johnstone - Improv Interviews by Bev Fox - The Suggestibles* | Read in full. A 100-second interview fragment defining status; no technique, and under the transcript-length floor. |
| [`kMW8_h0YH5s`](https://www.youtube.com/watch?v=kMW8_h0YH5s) — *The Secret of Improv* | Read in full. A three-minute workshop fragment ('be less interesting', 'give your partner a good time'); covered better by Madson (spch100.7.2). |
| [`u-cmV0eO6Bw`](https://www.youtube.com/watch?v=u-cmV0eO6Bw) — *A Crash Course in Improv at Second City Chicago* | Read in full. A promotional tour of the Second City training centre; no technique taught. |
| [`esQDdi5jBkc`](https://www.youtube.com/watch?v=esQDdi5jBkc) — *The Elements of Improv 108 - "Game of the Scene"* | Read in full. Find a behaviour, repeat and heighten it; callbacks must be natural. Redundant with Tarvin's heightening ('if this is true, what else is true', spch100.7.3) and the callbacks lesson (spch100.7.7), and loosely explained. |
| [`NPVnpPe70Qk`](https://www.youtube.com/watch?v=NPVnpPe70Qk) — *How To Be Witty And Quick (Have Quick Comebacks)* | Transcript unavailable: the video is unavailable on YouTube. |
| [`3TkboKV9VCE`](https://www.youtube.com/watch?v=3TkboKV9VCE) — *Stephen Colbert Breaks Down His Approach To Comedy and Improv* | Transcript unavailable through the MCP ('could not fetch'); not installable without reading it. |
| [`mKg6ESJpZzI`](https://www.youtube.com/watch?v=mKg6ESJpZzI) — *The Psychology of Self Deprecating Humor* | Read in full (real captions). Its point — self-deprecation suits people already high in status and backfires for the unconfident — is made with evidence by Keller (spch100.7.13) and bounded by Griffin (spch100.7.14); the rest is an anecdote and book promotion. |
| [`x5QdvyDHqhU`](https://www.youtube.com/watch?v=x5QdvyDHqhU) — *How to make fun of yourself... like a boss.* | Read in full. A stand-up clip, no teaching. |
| [`waLJbfNRcWk`](https://www.youtube.com/watch?v=waLJbfNRcWk) — *The Differences of Playing High and Low* | Read in full. An unexplained improv scene; no teaching in the audio. |
| [`7emTgD17o54`](https://www.youtube.com/watch?v=7emTgD17o54) — *"Getting to Yes And" With Bob Kulhan* | Read in full. A leadership podcast mostly about corporate culture; its one mechanic (yes means 'I hear you', and is the bridge) is covered by spch100.7.9 and 7.2. |
| [`mvxQGGbZuso`](https://www.youtube.com/watch?v=mvxQGGbZuso) — *These improv skills can supercharge your career - Bob Kulhan - Big Think Edge* | Read in full. An hour-long live Q&A; yes-and versus yes-but and divergent/convergent thinking are covered by spch100.7.9 and Cleese (6.14), and it repeats an unsupported 'goldfish attention span' claim. |

#### A7 — 12 rejected

| video | reason |
|---|---|
| [`64XjGDgEOKM`](https://www.youtube.com/watch?v=64XjGDgEOKM) — *Matthew Dicks of Storyworthy Does A Sales Storytelling Ask Me Anything* | Transcript truncated at 37:17 of 52:19. |
| [`q4lB6lTJtP4`](https://www.youtube.com/watch?v=q4lB6lTJtP4) — *The Unforgettable Storytelling Technique Of Kindra Hall (Ep. 90)* | Transcript truncated at 46:28 of 1:01:35 (25% unread). |
| [`CdO9a41WUss`](https://www.youtube.com/watch?v=CdO9a41WUss) — *Jennifer Aaker: The Power of Story* | Read in full (real captions). Low mechanic density: half is happiness-versus-meaning research and brand advertisements. Story-in-persuasion is carried better by _DyC0fd395Y, vfLUGWEiMlk and boyKF4Z1WX0. |
| [`dnX140ZmHt0`](https://www.youtube.com/watch?v=dnX140ZmHt0) — *Simon Lancaster's six top tricks for speakers* | Redundant: the same rhetorical devices as bGBamfWasNQ in a shorter cut. |
| [`Bs9NbxJHV-w`](https://www.youtube.com/watch?v=Bs9NbxJHV-w) — *Chip Heath - Made to Stick* | Read in full: a 6-minute excerpt of the opening only (sticky false ideas as examples); no principle is taught in the clip. _DyC0fd395Y covers the book's mechanics. |
| [`IVNVd-Rp0rg`](https://www.youtube.com/watch?v=IVNVd-Rp0rg) — *Craftiest ways to answer tough questions after your presentation [8 easy options]* | Read in full. Academic-seminar framing that teaches dodging, including deliberately running out the clock so no questions can be asked; the honest moves (clarify, say I don't know) are covered by b4kLTqbxVUU and tUyNKvRjQjs. |
| [`BwrWRyiD-Gg`](https://www.youtube.com/watch?v=BwrWRyiD-Gg) — *A 3-Step Framework to Handle Every Sales Objection* | Transcript truncated by the tool at 41:43 of 58:03 (28% unread); rejected under the truncation rule. |
| [`Mtjatz9r-Vc`](https://www.youtube.com/watch?v=Mtjatz9r-Vc) — *The art of innovation/* | Not fetched: a general innovation talk whose pitching part (10/20/30 slides) is a small fraction; pitching is carried by Hale and Seibel. |
| [`IRrecMyTDgE`](https://www.youtube.com/watch?v=IRrecMyTDgE) — *How To Tell A Great Story with Kindra Hall* | Transcript truncated by the tool at 43:43 of 1:10:29 (38% unread); rejected under the truncation rule. Her framework is installed from vfLUGWEiMlk. |
| [`N73MMO_O2uo`](https://www.youtube.com/watch?v=N73MMO_O2uo) — *Making Numbers Count: The Art and Science of Communicating Numbers* | Transcript truncated at 48:16 of 1:00:44, and the first twelve minutes are a host recap and screen-sharing trouble. The same ideas, cleanly, are installed from UYz9JSG6Qss. |
| [`7HQrHv2ro9M`](https://www.youtube.com/watch?v=7HQrHv2ro9M) — *3 Ways to Get Better at Presenting Technical Info to Nontechnical Audiences* | Read in full. Redundant: revisit beginner material, test on non-technical listeners, test new phrasing — covered better by the curse-of-knowledge lesson (_DyC0fd395Y) and Anderson's test-on-friends advice (-FOCpMAww28). |
| [`cS873ig9K4E`](https://www.youtube.com/watch?v=cS873ig9K4E) — *Carmine Gallo Talks at Google about the Storytelling Structure* | Title lies: a 17-second clip whose only caption track is unrelated Romanian and English fragments. Nothing to read. |

#### A8 — 12 rejected

| video | reason |
|---|---|
| [`I2bsyCu-0Yo`](https://www.youtube.com/watch?v=I2bsyCu-0Yo) — *Do I Need to Sound Like A Native English Speaker? - Interview with Hadar from Accent's Way* | Redundant: 'English belongs to you' is Pascal's lesson, intelligibility-over-nativeness is Derwing's with evidence, and representation is Saleem's; contains a ~1-min app ad. |
| [`URFbCU3v7EY`](https://www.youtube.com/watch?v=URFbCU3v7EY) — *ALL ABOUT INTONATION - The Live English Show with Hadar Shemesh/* | No captions available; cannot be installed without reading a transcript. |
| [`QhgyDx9XX88`](https://www.youtube.com/watch?v=QhgyDx9XX88) — *Sentence Stress & Intonation - Speak Fluent English Naturally* | Anonymous 'Daily English Lab' podcast with generic, unverifiable anecdotes; content covered by XTjT93yOv00 and UD8v2G-zVlc from named teachers. |
| [`Th40eifXjf8`](https://www.youtube.com/watch?v=Th40eifXjf8) — *How to Shadow Efficiently & Practice English Speaking (tips for every level)* | Redundant with rn3pmHIJ7nA, and about a quarter of the runtime is a sponsored app segment. |
| [`gvIVFKrJprM`](https://www.youtube.com/watch?v=gvIVFKrJprM) — *Presenting in English When English Isn't Your Native Language/* | No captions available. |
| [`Yy3bfXDx-uY`](https://www.youtube.com/watch?v=Yy3bfXDx-uY) — *Dimitris Polychronopoulos - Being funny in a foreign language [EN] - PG 2017* | A recital of multilingual jokes rather than a taught mechanic; English auto-captions garble the non-English jokes. Read 0:24-13:47 and 34:33-42:41 (not the whole), enough to see the format; rejected on format, not on a claim about the unread part. |
| [`MxBy3M5cKu8`](https://www.youtube.com/watch?v=MxBy3M5cKu8) — *How to Tell a Story in English Like a Native* | Read in full. A scripted two-host episode with heavy repetition; its phrase bank (sequence words, past continuous for background) is covered by spch100.5.8 and 5.7 and by Unit III. |
| [`2mS7w_np2Nw`](https://www.youtube.com/watch?v=2mS7w_np2Nw) — *Function Words - American English Pronunciation + Intonation/Word Stress* | Read in full (real captions). Redundant: function words being low, quick and reduced against stressed content words is the mechanic of the installed rhythm lesson (spch100.5.4). |
| [`T_qLKu0rFlU`](https://www.youtube.com/watch?v=T_qLKu0rFlU) — *How to Tell a Story in English* | Read in full. A generic six-step template (basic story, background, characters, climax, conclusion, lesson) taught better in Unit III. |
| [`B_VWnXMalQI`](https://www.youtube.com/watch?v=B_VWnXMalQI) — *Telling Stories in English* | Read in full. A narrated example story with no teaching. |
| [`kgq2dmB6eL4`](https://www.youtube.com/watch?v=kgq2dmB6eL4) — *How to tell great stories in English! Live English Class* | No captions on the video; not installable without reading it. |
| [`2VEyd3pL88Q`](https://www.youtube.com/watch?v=2VEyd3pL88Q) — *Speaking practice: What to do when you forget the words: Live English Class* | No captions available through the transcript tool; cannot be installed unread. |

#### B1 — 3 rejected

| video | reason |
|---|---|
| [`IPW-MF8Kp0I`](https://www.youtube.com/watch?v=IPW-MF8Kp0I) — *How to get retention SO HIGH your shorts always go viral* | Read in full. Teaches a sock-puppet trick (commenting on your own short from a second account to fake audience reaction) and deliberate-mistake engagement bait; its honest structure (hook, tension, payoff) is covered better by Hoyos. |
| [`0QvgMJg1u7s`](https://www.youtube.com/watch?v=0QvgMJg1u7s) — *Zach King Reveals the Secret to Making a Viral TikTok* | Read in full: a talk-show interview; one sentence on a writers' room mining everyday annoyances, otherwise anecdotes. |
| [`Q75eYZDg7gY`](https://www.youtube.com/watch?v=Q75eYZDg7gY) — *Everything You've Been Told About Short Form Content is a LIE.* | Read in full. Hook / build-up / result and the retention-graph shapes are taught already by Jenny Hoyos (spch100.11.4) and the B2 retention lesson (spch100.12.1); adds the 80/20 result placement and trial reels inside a long coaching pitch. |

#### B2 — 11 rejected

| video | reason |
|---|---|
| [`9v9yyWEmGD0`](https://www.youtube.com/watch?v=9v9yyWEmGD0) — *How To Read Audience Retention On YouTube (WHAT VIDEO DO I MAKE NEXT)* | Read in full (auto captions). A 48-minute live stream with low density and tool promotion; the retention shapes are taught by spch100.12.1 and 'make the next video from what held them' by spch100.12.3 (Galloway). Its one new point, don't telegraph the ending, is a sentence. |
| [`zCO8QOrz0b4`](https://www.youtube.com/watch?v=zCO8QOrz0b4) — *How To Decode Your Video's Audience Retention Report in YouTube Analytics* | Read in full (YouTube's own Culture and Trends team, real captions). Drops, rewinds and absolute versus relative retention are taught more fully by spch100.12.1; the new part (geography and device splits) is about a minute. |
| [`lV-X9yCkj1k`](https://www.youtube.com/watch?v=lV-X9yCkj1k) — *Retention Curves Have 4 Shapes. Here's What Each One Means.* | Not fetched: the same mechanic as spch100.12.1 (five retention shapes), already installed. |
| [`jKRiib3Xzoo`](https://www.youtube.com/watch?v=jKRiib3Xzoo) — *A/B testing on YouTube* | Read in full (real captions; a feature walkthrough in YouTube's own voice). Eligibility, steps and result labels for title/thumbnail tests; the one transferable rule — the winner is chosen by watch-time share, not clicks — is a single line, and packaging is taught in spch100.16.2. |
| [`V8f_VWMV8pY`](https://www.youtube.com/watch?v=V8f_VWMV8pY) — *YouTube Analytics Reports To Know: Audience Retention Graph!* | Not fetched: reading the retention graph is installed (spch100.12.1, 12.3); B2 reached its band with 12.4 and 12.5. |
| [`g1JOdK8Oi0k`](https://www.youtube.com/watch?v=g1JOdK8Oi0k) — *YouTube Audience Retention Analytics. How to Read the Data? [Tutorial]* | Not fetched: reading the retention graph is installed (spch100.12.1, 12.3); B2 is within its band. |
| [`dAR3d6xnG0o`](https://www.youtube.com/watch?v=dAR3d6xnG0o) — *The NEW Rules Of YouTube (From a 50 Billion View Strategist)* | Not fetched: by its search summary ideation and thumbnails rather than analytics; Paddy Galloway's own analytics breakdown is installed (spch100.12.3). |
| [`EWXYRAMwFKM`](https://www.youtube.com/watch?v=EWXYRAMwFKM) — *Beginner's Guide to YouTube Analytics // watch time, CTR, and average view duration EXPLAINED* | Not fetched: the metrics are taught by YouTube's own staff in spch100.12.0 and by spch100.12.5; B2 is within its band. |
| [`eHv_IB5Uvr4`](https://www.youtube.com/watch?v=eHv_IB5Uvr4) — *What Is a Good Average View Duration on YouTube?* | Not fetched: by its title a benchmark question; spch100.12.0 and 12.1 argue against fixed benchmarks, and B2 is within its band. |
| [`2G4aQDd6yYQ`](https://www.youtube.com/watch?v=2G4aQDd6yYQ) — *Can’t Get 75% Audience Retention In First 30 Seconds Of Your YouTube Video? TRY THIS* | Not fetched: the first-30-seconds question is answered with data by spch100.12.4. |
| [`2g6hbhclpKo`](https://www.youtube.com/watch?v=2g6hbhclpKo) — *YouTube Analytics Explained — 2026 Beginner’s Guide (What Really Matters)* | Not fetched: the metrics are covered by spch100.12.0-12.5; B2 is within its band. |

#### B3 — 13 rejected

| video | reason |
|---|---|
| [`J2AOhNEOhj8`](https://www.youtube.com/watch?v=J2AOhNEOhj8) — *How the Generosity of Scars Makes Your Story More Powerful with Scott Mann* | Review round 1: re-fetched whole (1:03:58, 12,865 words; the earlier fetch had stopped at 38:02) and read in full. Rejected on density: mostly a biographical interview. The selection teaching (relatability first and vulnerability as its by-product, adjusting the level to the room, skipping a point that is too raw, no struggle no story) is about ten minutes scattered across the hour, and B3 is filled by x3cCL9TcdUQ. |
| [`BvSp9VQdwVU`](https://www.youtube.com/watch?v=BvSp9VQdwVU) — *Speak From Your Scars, Not Your Open Wounds/* | Transcript unavailable through the MCP ('could not fetch this video'); not installed unread. |
| [`pbYrhLiEIv0`](https://www.youtube.com/watch?v=pbYrhLiEIv0) — *The Moth: The art and craft of storytelling* | Read in full: a two-minute promotional piece about The Moth; no mechanic taught. |
| [`PVzEtvc7iW0`](https://www.youtube.com/watch?v=PVzEtvc7iW0) — *Give Me 5 Mins, And I'll Improve Your Storytelling Skills By 182%* | Read in full: a podcast clip of Kallaway on speed to value and contrast; redundant with his own fuller hooks video 2byPP_9F0-Q. |
| [`fwQ575VQUsE`](https://www.youtube.com/watch?v=fwQ575VQUsE) — *Paul Smith Clip 2: Lead With A Story. Top Storytelling Coach On How To Use Stories To Lead and Sell* | Read in full: a 70-second clip retelling one study (story-described eBay items); an anecdote, no method. |
| [`Fl3EACOpilE`](https://www.youtube.com/watch?v=Fl3EACOpilE) — *The Secret To Choosing Your Next Story!* | Not fetched: by its search summary it is for novelists choosing their next book project, not for choosing which true story to tell; B3 is filled by x3cCL9TcdUQ. |
| [`Q8_TxVQKVpg`](https://www.youtube.com/watch?v=Q8_TxVQKVpg) — *5 storytelling tips for content creators* | Not fetched: by its search summary, general engagement tips rather than selection; selection is taught by x3cCL9TcdUQ. |
| [`eng0Tb4vMps`](https://www.youtube.com/watch?v=eng0Tb4vMps) — *How to be a good storyteller and inspire anyone :Matthew Dicks* | Not fetched: Dicks's method for finding and choosing stories is already installed from his own uploads in six lessons; another interview would repeat it. |
| [`oi1ucpRX5E0`](https://www.youtube.com/watch?v=oi1ucpRX5E0) — *What is Your Signature Story? - David Aaker* | Not fetched: by its search summary, brand signature stories for companies; the personal version is installed (ojl2k8ylAMA). |
| [`AoKJwkITuI4`](https://www.youtube.com/watch?v=AoKJwkITuI4) — *Worlds Greatest Speaker Training - Signature Story* | Not fetched: by its search summary, one speaker performing a three-minute signature story, not teaching how to choose one. |
| [`Ou8Db1LB4tQ`](https://www.youtube.com/watch?v=Ou8Db1LB4tQ) — *Show Your Scars, Not Your Wounds* | Not fetched: by its search summary, a pastor's talk on healing rather than a lesson on choosing what to tell. |
| [`HVQhK3wF0PY`](https://www.youtube.com/watch?v=HVQhK3wF0PY) — *5 Storytelling Exercises For Beginners* | Not fetched: by its title, exercises for telling rather than choosing; the story-finding exercises are installed in A2 (VoaGniZSFGw). |
| [`olTpXoKes_w`](https://www.youtube.com/watch?v=olTpXoKes_w) — *How to tell a GREAT Story - Storytelling Workshop for Keynotes and Speeches* | Not fetched: by its title, a keynote structure workshop (A1/A7, both within budget); B3 is filled by x3cCL9TcdUQ. |

#### B4 — 13 rejected

| video | reason |
|---|---|
| [`61QO5gG52HI`](https://www.youtube.com/watch?v=61QO5gG52HI) — *How to Show Your Work And Get Discovered - Austin Kleon* | Read: a third-party podcast summarising the book, not Kleon. His own SXSW talk (m8v3jf8RVBk) is installed instead. |
| [`KmGFHsy1IGU`](https://www.youtube.com/watch?v=KmGFHsy1IGU) — *Show Your Work Book Summary - Authored by: Austin Kleon* | Read in full: a third-party summary whose anecdotes ('a writer named Shawn', 'a producer in Seattle') cannot be traced to the book; not installed. |
| [`RVKofRN1dyI`](https://www.youtube.com/watch?v=RVKofRN1dyI) — *Document, Don't Create* | Read in full (real captions). A motivational montage; its mechanic (share the process rather than advice, don't wait for production values, just start) is taught in full by Kleon's Show Your Work (spch100.14.0). |
| [`AKcAn8-s-cM`](https://www.youtube.com/watch?v=AKcAn8-s-cM) — *How to build in public: 10 examples to copy [B2B SaaS]* | Read in full. A list of post types (mistakes, wins, product updates, stats, polls, events); thin on how, and its last recommendation — public 'beef' with competitors because people love drama — is the opposite of spch100.14.4's reasoned advice. |
| [`YsKugR5fuMU`](https://www.youtube.com/watch?v=YsKugR5fuMU) — *The mindset difference between documenting vs vlogging* | Read in full (real captions). A personal reflection: vlogging as performance led to burnout, documenting as-is is for reflection. One idea, no technique; spch100.14.0 and 14.2 teach documenting a build. |
| [`8RMCwB3BUh0`](https://www.youtube.com/watch?v=8RMCwB3BUh0) — *How To Build In Public As A Founder Successfully?* | Not fetched: B4 reached its band with spch100.14.4 and 14.5; by its title the same ground as 14.4. |
| [`WJlvQu3yeCY`](https://www.youtube.com/watch?v=WJlvQu3yeCY) — *If you're not building in public, watch this now.* | Not fetched: by its title a case for building in public rather than a method; B4 is within its band. |
| [`ke6oxy8Z7C4`](https://www.youtube.com/watch?v=ke6oxy8Z7C4) — *My "BUILD IN PUBLIC" Strategy (Examples for Vibe-Coders)* | Not fetched: by its title one creator's posting strategy; spch100.14.4 covers what to share. |
| [`jg_mIUnwfWo`](https://www.youtube.com/watch?v=jg_mIUnwfWo) — *How To Make A Viral Devlog Like Dani* | Not fetched: a third-party breakdown of another creator's devlogs; the first-hand devlog lessons spch100.14.2 and 14.3 are installed. |
| [`hhpXfwuOLec`](https://www.youtube.com/watch?v=hhpXfwuOLec) — *5 Tips to Make a Successful Devlog* | Not fetched: by its title the ground of spch100.14.2 and 14.3. |
| [`qRvA64shLG4`](https://www.youtube.com/watch?v=qRvA64shLG4) — *How to Make a Video DEVLOG - Full Guide* | Not fetched: by its title the ground of spch100.14.2 and 14.3. |
| [`sg4Y4cVKLwA`](https://www.youtube.com/watch?v=sg4Y4cVKLwA) — *Indie Hacking, Bootstrapping, Building in Public, Social Media* | Not fetched: by its search summary a broad interview; the same author's focused episode on what to share (iq_DetrM-DE) is installed. |
| [`7Xxb8jggf0w`](https://www.youtube.com/watch?v=7Xxb8jggf0w) — *An Example of using Storytelling in a Technical Presentation* | Not fetched: by its title a single example; the method is installed as spch100.14.5. |

#### B5 — 11 rejected

| video | reason |
|---|---|
| [`MC58rL52gl4`](https://www.youtube.com/watch?v=MC58rL52gl4) — *How to Tell A Story In Video - Step by Step Script Breakdown* | Read in full (real captions). Hook, backstory, experience, climax, takeaway, and letting the shoot rewrite the script: covered by spch100.14.1 (setup, challenge, complications, payoff, change; film the complications) and spch100.16.1 (script order). |
| [`Eh1xTFUoJO8`](https://www.youtube.com/watch?v=Eh1xTFUoJO8) — *The Obvious Strategy That Separates Great YouTubers : Ed (Film Booth)* | Not fetched: B5 reached its band with spch100.16.5 and 16.6; by its title a channel-strategy interview rather than video structure. |
| [`c6X-Ywy3yVU`](https://www.youtube.com/watch?v=c6X-Ywy3yVU) — *I Found 3 Retention Techniques that Make Videos BLOW UP* | Not fetched: by its title retention tactics (B2 ground); B5 is within its band. |
| [`7Y3DvzFSc4o`](https://www.youtube.com/watch?v=7Y3DvzFSc4o) — *Documentary Storytelling: Master 3 Act Structure* | Not fetched: three-act structure for video is installed as spch100.16.0. |
| [`ECOe1Qo99d0`](https://www.youtube.com/watch?v=ECOe1Qo99d0) — *How To Use Open Loops To Keep People Enaged* | Not fetched: open loops and rehooks are covered by spch100.16.1 and 16.4. |
| [`TfGP15IKseI`](https://www.youtube.com/watch?v=TfGP15IKseI) — *How To Make A Video Essay: Writing* | Not fetched: B5 reached its band; the writing process for long explainers is now spch100.16.6. |
| [`O50HPQ1eHYY`](https://www.youtube.com/watch?v=O50HPQ1eHYY) — *Colin & Samir Break Down What's Working on YouTube Today* | Not fetched: by its title platform trends rather than structure; Colin and Samir's structure lessons are installed (spch100.16.0, 16.3, 16.4). |
| [`dIKsEhX-vyU`](https://www.youtube.com/watch?v=dIKsEhX-vyU) — *Why every Johnny Harris video goes viral* | Not fetched: a third-party breakdown; Harris's own account (zq4b96m1AvM) is installed. |
| [`Ka9NMyqiXjU`](https://www.youtube.com/watch?v=Ka9NMyqiXjU) — *Derek Muller, Veritasium: 2016 Richtmyer Memorial Lecture Award* | Not fetched: by its search summary a physics-teaching lecture on productive confusion; its core finding is installed in six minutes as spch100.16.5. |
| [`zV9iWjTdjpg`](https://www.youtube.com/watch?v=zV9iWjTdjpg) — *How to Structure a Script That Keeps Viewers Watching* | Not fetched: script structure is covered by spch100.16.1 and 16.6; B5 is within its band. |
| [`Yv8lpauoBYo`](https://www.youtube.com/watch?v=Yv8lpauoBYo) — *How to Script a YouTube Video That Keep 'Em hooked* | Not fetched: script structure is covered by spch100.16.1 and 16.6; B5 is within its band. |

#### B6 — 21 rejected

| video | reason |
|---|---|
| [`gEXDKEW8zKs`](https://www.youtube.com/watch?v=gEXDKEW8zKs) — *How to talk naturally on camera in 3 easy steps (takes 10 minutes)* | Read in full. Watch others, rehearse, find your style: each point covered more concretely by rAIhsokIdJY, Y11SX2oHmw8 and VXo4_ErkN_U (redundancy rule). |
| [`n1yILT7-8F0`](https://www.youtube.com/watch?v=n1yILT7-8F0) — *How To Talk to the Camera (Maintain Eye Contact without Memorising)/* | No captions of any kind; the transcript could not be read, so it cannot be installed. |
| [`jYmJPTeQEaA`](https://www.youtube.com/watch?v=jYmJPTeQEaA) — *Ali Abdaal course - Camera Confidence download/* | Not fetched: an unofficial re-upload of a paid course. Only the author's own uploads are considered. |
| [`D1JGg-aSzeA`](https://www.youtube.com/watch?v=D1JGg-aSzeA) — *Ali Abdaal's camera confidence course/* | Not fetched: an unofficial re-upload of a paid course. |
| [`bvbMdVSyRHg`](https://www.youtube.com/watch?v=bvbMdVSyRHg) — *How to speak on camera NATURALLY - 7 Easy Tips* | Read in full. Talk to one person, look at the lens, watch yourself back and practise are already installed (spch100.13.0, 13.1, 13.5); scripting is covered by spch100.13.6. |
| [`MU9-0UfK1jg`](https://www.youtube.com/watch?v=MU9-0UfK1jg) — *INSTANTLY Look Natural on Video (4 Simple Hacks)* | Read in full (real captions). Smile and blink, a photo of a friend by the lens, posture, notes as a safety net, film in sections — each already covered in Unit XIV. |
| [`O3BqluVM_7c`](https://www.youtube.com/watch?v=O3BqluVM_7c) — *Anchoring and Teleprompters 101* | Read in full (an MSNBC anchor, by the transcript). A four-minute primer: breathe, review the script ahead, write conversationally, talk to a friend, spell guests' names phonetically, keep a paper backup. All but the phonetic spelling are taught more fully in spch100.13.8 and 13.10. |
| [`-_VzPT8ZSYw`](https://www.youtube.com/watch?v=-_VzPT8ZSYw) — *Presenting skills to become a great 'on-screen' communicator* | Read in full. Part one of a presenter series: words, tone and face must agree; no 'cheesy presenter' smile; signpost a new section with a change of tone; 'camera fog' means exaggerating slightly. The last is taught in spch100.13.0 and 13.4, and the video leans on the 7/38/55 split as a general rule of communication, which the studies it comes from do not support. |
| [`SyoVOn3gwuY`](https://www.youtube.com/watch?v=SyoVOn3gwuY) — *How to Speak Confidently ON CAMERA - 20 Pro Hacks* | Not fetched: B6 reached its band with spch100.13.8-13.11; by its title a list of confidence tips, the ground spch100.13.3 and 13.5 already cover. |
| [`DcrWVdEABq8`](https://www.youtube.com/watch?v=DcrWVdEABq8) — *Give Me 5 Minutes and I'll Help You Sound More "Natural" on Camera* | Not fetched: by its title the same ground as spch100.13.6 and 13.9 (sounding natural to camera); B6 is within its band. |
| [`WPSjZdldvoY`](https://www.youtube.com/watch?v=WPSjZdldvoY) — *How to Develop and Practice YouTube Camera Presence and Confidence* | Not fetched: by its title the record-and-practise protocol of spch100.13.5; B6 is within its band. |
| [`FnOiVmAdbNY`](https://www.youtube.com/watch?v=FnOiVmAdbNY) — *TV Presenting Masterclass* | Not fetched: by its search summary a promotion for a paid online course. |
| [`68JX_Abb4Ag`](https://www.youtube.com/watch?v=68JX_Abb4Ag) — *Autocue Presenter Basics - presenter tips for webinars, keynote speeches & training materials.* | Not fetched: autocue reading is now taught by spch100.13.8-13.10, each read in full. |
| [`FTuLj83Fq90`](https://www.youtube.com/watch?v=FTuLj83Fq90) — *How to Use a Teleprompter* | Not fetched: teleprompter use is now taught by spch100.13.8-13.10, each read in full. |
| [`FqLF5YBsk8E`](https://www.youtube.com/watch?v=FqLF5YBsk8E) — *TV Presenter Training Pt1* | Not fetched: part one of a series; the presenter basics are covered by spch100.13.0 and the new prompter lessons. |
| [`yXo8WQx9kf8`](https://www.youtube.com/watch?v=yXo8WQx9kf8) — *Self Tape Technique: Framing, Shot Angle, Eyeline, Eye Light* | Not fetched: by its title, eyeline and framing for actors' audition tapes, where the actor usually must not look into the lens; the creator's case is spch100.13.1 and 13.7. |
| [`t9YcRtQFHXU`](https://www.youtube.com/watch?v=t9YcRtQFHXU) — *How to Use a Teleprompter Without Looking Like You're Reading* | Not fetched: the same question as spch100.13.8 and 13.9, both read in full. |
| [`0QE90OKqof8`](https://www.youtube.com/watch?v=0QE90OKqof8) — *How to Look Like You're NOT Reading from a Teleprompter* | Not fetched: the same question as spch100.13.8 and 13.9, both read in full. |
| [`v_IquUJv2fg`](https://www.youtube.com/watch?v=v_IquUJv2fg) — *How to read from a Teleprompter without sounding awkward* | Not fetched: the same question as spch100.13.8 and 13.9, both read in full. |
| [`Cc5cm1xuwzk`](https://www.youtube.com/watch?v=Cc5cm1xuwzk) — *CAMERA SHY? 10 tips to help you become more comfortable* | Not fetched: by its title the camera-confidence ground of spch100.13.3 and 13.5. |
| [`8Ei6TN8vFv0`](https://www.youtube.com/watch?v=8Ei6TN8vFv0) — *6 Body Language Tips for Zoom Calls* | Not fetched: on-camera body language is taught by spch100.13.11, read in full. |

#### B7 — 1 rejected

| video | reason |
|---|---|
| [`4s2U_hTRWpg`](https://www.youtube.com/watch?v=4s2U_hTRWpg) — *The Shortcut to Building Your Personal Brand* | Read in full: mostly a demonstration of the author's custom GPT; the framework itself (values, statement, pillars, topics) takes a minute and is covered better by QtQjxqGuxTI. |

## Before T-037 (September 2026) — kept as history

The section below was written when Phase 2 had not run and `youtube.com` was 403 from the
build environment. Its two open gaps were closed in T-037: A5 (humour construction) is
Unit VII and B1 (short-form structure) is Unit XII, and the seed lessons it calls
"unranked" now sit inside full units. `w5fLlH-jA4M` is also in the T-037 table above.

| video | module | verdict | reason |
|---|---|---|---|
| [`w5fLlH-jA4M`](https://www.youtube.com/watch?v=w5fLlH-jA4M) — *Vinh Giang — 5 Vocal Foundations - Rate of Speech* | A3 | **Rejected** | Caption track auto-detected as Korean and transcribed as nonsense — "문일석 my q 니켈 odc 있고 is proven 차". 2:15 long, 414 "words", none of them recoverable. No English track available. |

### Why that one matters more than it looks

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

### Searched for, nothing found (14 Sep)

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

### Not yet scored

Three videos passed the read and are installed as the seed. They have **not**
been through Phase 3 scoring, and the distinction matters: scoring without a
pool is theatre. The redundancy penalty — *"drop its score hard if a mechanic is
already covered by a higher-scoring video"* — cannot fire when there is only one
video per module. You cannot decline the twelfth video on hooks until you have
found twelve.

So the seed is: transcript-verified, mechanically useful, and **unranked**. When
the harvest lands, all three go back into the pool and compete on the six axes
like everything else. Any of them may lose its place.
