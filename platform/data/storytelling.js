// Brickford — SPCH 100, Storytelling.
//
// Units I and II are the five-lesson SEED that held the Publish block while the
// harvest was blocked (docs/storytelling/00-harvest-blocker.md). Units III
// onward are the full course (T-037, owner-approved 2026-10-09: "Bigger: about
// 50 hours"), one unit per module of docs/storytelling/01-taxonomy.md, in its
// dependency order, at the hours recorded there as the 2026-10-09 revision.
//
// Every lesson here had its transcript read before it was added, per the brief.
// The transcripts are stored in data/storytelling/transcripts/<v>.txt so a
// lesson survives its video being deleted, every candidate considered is in
// data/storytelling/candidates.jsonl, and every one turned down is in
// docs/storytelling/rejections.md with the reason. Titles lie; a transcript
// was the only evidence admitted.
//
// APPEND ONLY. Lesson keys are positional ("spch100.0.0"), so an inserted unit
// or a reordered lesson silently re-points the owner's progress onto a
// different video. data/storytelling/ledger.json pins every key to its video
// id, and tools/verify-content.js fails if any pinned key moves. A new lesson
// goes at the end of the last unit or in a new unit after it, and gets a line
// in the ledger.
//
// Each lesson carries two layers, both checked by tools/verify-content.js:
//   DAR.DRILLS[key]     — the mechanic in one sentence, 3-5 rules paraphrased
//                         from the transcript, one drill of ten minutes or less
//                         that leaves an artifact, and the check that says it
//                         worked. Same-day work; it sits under the video.
//   DAR.SUMMARIES[key]  — the revision summary in the shape every other course
//                         uses (takeaway, beats, worked, watch, checks), so the
//                         Sunday review can quiz it. No KaTeX here: no dollar
//                         signs, no bare "<", because the fields are raw HTML.
window.DAR = window.DAR || {};
DAR.DRILLS = DAR.DRILLS || {};
DAR.SUMMARIES = DAR.SUMMARIES || {};

DAR.COURSES.push({
  id: "spch100",
  instructor: { name: "Matthew Dicks · Vinh Giang · Matt Abrahams", org: "The Moth · Stanford GSB" },
  code: "SPCH 100", title: "Storytelling", faculty: "Speech",
  practice: { label: "The reps — story bank daily, recorded rep weekly", url: "https://www.themoth.org/tell-a-story/storytelling-tips-tricks" },
  phase: 0, color: "gold",
  desc: "The fourth subject. Told stories, not written ones — the anecdote in a meeting, the answer under pressure in an audit, the joke that lands, the ninety seconds to camera. About forty-three hours across fifteen modules: structure, finding stories, delivery, speaking as a non-native speaker, humour written and live, conversation, high-stakes talking, then the same mechanics pointed at a lens. Watching does not make anyone better at this; the reps on the Practice page are the course. These are the mechanics the reps run on.",
  external: [
    { label: "Matthew Dicks — Homework for Life", url: "https://matthewdicks.com/homework-for-life/" },
    { label: "Think Fast, Talk Smart (Stanford GSB)", url: "https://www.gsb.stanford.edu/business-podcasts/think-fast-talk-smart-podcast" },
  ],
  units: [
    {
      name: "Unit I — Seed: finding, delivering, and holding up under pressure",
      lessons: [
        { t: "Homework for Life — finding the story in an ordinary day", v: "x7p329Z8MD0", min: 18 },
        { t: "Five ways to improve your professional voice", v: "YyWZmdkPfDM", min: 11 },
        { t: "Think faster, talk smarter — structure under pressure", v: "jw_-OSxk36U", min: 39 },
      ],
    },
    {
      // APPENDED as a second unit, not inserted into Unit I. Lesson keys are
      // positional, so putting the story spine at index 0 where the dependency
      // order wants it would have silently re-pointed any progress already made
      // on the first three. Order inside the seed is worth less than a record
      // that stays true; the full harvest rebuild sequences the whole course at
      // once, and that is the moment to move things.
      name: "Unit II — Seed: the spine, and humour you can prepare",
      lessons: [
        { t: "The Pixar story spine — six prompts that hold a story up", v: "nLpoqD7LHOU", min: 4 },
        { t: "How to easily be funnier in conversations", v: "6G7pNhZA0LU", min: 5 },
      ],
    },
    {
      // T-037 begins here. Units are appended in the taxonomy's dependency
      // order — structure, finding, delivery, non-native delivery, humour
      // written then live, conversation, high stakes, then Track B — and never
      // inserted, for the reason at the top of this file.
      name: "Unit III — Structure: the moment, the stakes, the ending",
      lessons: [
        { t: "What is a story — and why tell one", v: "enzuCJNA3Qg", min: 18 },
        { t: "The five-second moment: the instant a story is about", v: "IPf0dfZXJG4", min: 24 },
        { t: "Anecdote, bait and reflection — the two building blocks", v: "yNgypfZ4Jc4", min: 5 },
        { t: "The elephant: a reason to listen in the first thirty seconds", v: "nXoTR5l4Dks", min: 10 },
        { t: "The clues to a great story — make me care", v: "KxDwieKpawg", min: 19 },
        { t: "The shapes of stories — fortune drawn over time", v: "oP3c1h8v2ZQ", min: 5 },
        { t: "Building a story live: know the end, start close to it", v: "hCf3dHd8_i8", min: 41 },
        { t: "And, But, Yet, Therefore — structure in one breath", v: "_96OKURDlwc", min: 4 },
        { t: "Structure is what they know, and when — the Nemo flashbacks", v: "bKrCKg9ggVI", min: 4 },
        { t: "Write what you know — the feeling under the monster story", v: "1rMnzNZkIX0", min: 3 },
        { t: "Credibility before vulnerability — five tips for a story in a talk", v: "vrxIlFfqKEE", min: 7 },
        { t: "Promise, progress, payoff — why a middle drags and an ending lands (start at 19:28)", v: "ihd76ijy9LU", min: 56 },
      ],
    },
    {
      name: "Unit IV — Finding stories: the lens, the bank, the volume",
      lessons: [
        { t: "Homework for Life, sharpened — and the pickle story", v: "x--U2X47pw8", min: 7 },
        { t: "Seeing with storyteller eyes — notice the flag", v: "_gq60_clzk0", min: 3 },
        { t: "A photo folder called Stories", v: "rwtoN6skzR0", min: 5 },
        { t: "First, last, best, worst — mining the past", v: "VoaGniZSFGw", min: 7 },
        { t: "Personal signature stories — make them, then bank them", v: "ojl2k8ylAMA", min: 13 },
        { t: "Twelve lessons: zoom in, quote it, use 'how are you?'", v: "1Anw1adlP50", min: 12 },
        { t: "Most of the work is finding — and killing", v: "VKXrZGs2kRQ", min: 4 },
        { t: "The taste gap — volume on a deadline", v: "X74yYfTZSWU", min: 5 },
      ],
    },
    {
      name: "Unit V — Delivery: voice, body, pauses, nerves",
      lessons: [
        { t: "The voice toolbox — register, prosody, pace, and a warm-up", v: "eIho2S0ZahI", min: 10 },
        { t: "The five dials — rate, volume, melody, tone, pause", v: "6-shbSFc48E", min: 43 },
        { t: "Melody, volume, and the descending scale", v: "f3bR84PnLGc", min: 36 },
        { t: "The pause — tie it to a breath", v: "-3PORS6gWF0", min: 13 },
        { t: "Five body-language habits that read as confidence", v: "U1O3UFeCEeU", min: 8 },
        { t: "Rookie, pretty good, natural — using the whole range", v: "FsxorSNJBaA", min: 28 },
        { t: "Nerves: treat the symptoms and the sources", v: "GRdm4Iweuz0", min: 38 },
        { t: "How to speak — the promise, the star, the ending", v: "Unzc731iCUY", min: 63 },
        { t: "When all eyes are on you — rehearse to the stakes, connect, then review", v: "HYNXzKU92Qs", min: 24 },
        { t: "Skills, not talent — open body, functional hands, the pause over 'uh'", v: "K0pxo-dS9Hc", min: 16 },
        { t: "Breath is thought — the diaphragm, stillness, and the closed mouth", v: "YSfY7dO02nA", min: 19 },
        { t: "Stage movement — give every place and person a spot, and go back to it", v: "vGkyNL9efNw", min: 15 },
        { t: "Move with a purpose — the action in the story, and the stage as a timeline", v: "96AiJJnmys0", min: 4 },
      ],
    },
    {
      name: "Unit VI — Speaking as a non-native speaker: clear, not native",
      lessons: [
        { t: "Speak it like a video game, not a piano exam", v: "Ge7c7otG2mk", min: 15 },
        { t: "Intelligibility, not accent — what the research says to fix", v: "8pdMn5wmkb8", min: 5 },
        { t: "The other view: aim native-like, one perfect sentence at a time", v: "Ti_gFEe1XNY", min: 17 },
        { t: "Keep speaking — the accent, the comments, and what 'normal' is", v: "B4a0NvLTebw", min: 11 },
        { t: "The rhythm of English — content words carry the beat", v: "XTjT93yOv00", min: 4 },
        { t: "Thought groups — chunk, link, and pause by meaning", v: "UD8v2G-zVlc", min: 10 },
        { t: "Shadowing in ten steps — understand before you copy", v: "rn3pmHIJ7nA", min: 12 },
        { t: "Stop translating: chunks, self-talk, keep it short", v: "qyF0MYeGb3w", min: 6 },
        { t: "Four past tenses that move a story in English", v: "_CuYleYGlQE", min: 14 },
        { t: "Presenting in your second language — seven mistakes", v: "c_VGjjuEH-s", min: 38 },
        { t: "Share, don't present — bottom line first, less robotic", v: "lX_KmPQPjLI", min: 20 },
        { t: "Being funny in another language", v: "SP8YSgUkCh0", min: 46 },
        { t: "Word stress — the syllable that is higher and longer", v: "pRXsIthxgH8", min: 4 },
        { t: "Intonation — the melody that carries attitude", v: "p8DJFNjZiIM", min: 5 },
        { t: "Arabic speakers' English — p and b, the r, and the missing 'a'", v: "spNrlty3tzk", min: 5 },
        { t: "Stuck for a word — simplify, define, synonym, opposite, go general (stop at 6:20)", v: "R6JupGkbltY", min: 6 },
        { t: "Linking — a consonant sound runs into the next vowel sound", v: "Nc2r_5XhkGk", min: 16 },
      ],
    },
    {
      name: "Unit VII — Humour you can build: structure, filters, the funny story",
      lessons: [
        { t: "What makes things funny — the benign violation", v: "ysSgG5V-R3U", min: 12 },
        { t: "Funny versus comedy — flawed people doing their best", v: "Qs5GHa4pG24", min: 7 },
        { t: "Joke structure — the one thing with two meanings", v: "Lo4cGaknU40", min: 12 },
        { t: "Three kinds of setup", v: "Qv1ACVimrfQ", min: 4 },
        { t: "The late-night formula — two lists and a link", v: "_ODsLIMSBq0", min: 4 },
        { t: "Eleven funny filters", v: "7kl9DWY9gPQ", min: 8 },
        { t: "Making writing funnier — flaws, details, zig zig zag", v: "zNTxSBgDNp4", min: 5 },
        { t: "How Seinfeld writes a bit", v: "itWxXyCfW5s", min: 5 },
        { t: "A little story, how you feel about it, zoom out, tag", v: "mucrIfbz_b4", min: 5 },
        { t: "The levity list — exaggeration, contrast, rule of three", v: "iC_2VBWTALg", min: 29 },
        { t: "Three ways to add humour to a speech", v: "dj6q7fuAkT0", min: 5 },
        { t: "Stand-up techniques for people who are not comedians", v: "oZmn7OTv6Go", min: 55 },
        { t: "The clown and the editor — a repeatable process for writing funny (stop at 33:20)", v: "57Bs9Ftq6FE", min: 33 },
        { t: "Anatomy of a cartoon — incongruity, context, and who the target is", v: "FKxaL8Iau8Q", min: 21 },
        { t: "Open mode and closed mode — Cleese on the conditions for ideas", v: "Pb5oIIPO62g", min: 37 },
        { t: "Humour tailored to the room — Judy Carter's 'what's a bad day?'", v: "reb6VY9Wu8s", min: 35 },
        { t: "The laugh generator — punch up a talk from its transcript", v: "qIxRZQd9gfg", min: 10 },
        { t: "When a joke gets nothing — too little information, or too much", v: "5isx4lkVCZc", min: 3 },
        { t: "Don't open with a joke — three low-risk ways to be light", v: "h6sm47j-Am4", min: 6 },
        { t: "Act-outs, part one — show, don't tell: play what the character wants", v: "OxcxXAuQFws", min: 7 },
        { t: "Act-outs, part two — stage the scene, play the honest reaction (stop at 8:20)", v: "4v398Tmu4rU", min: 8 },
      ],
    },
    {
      name: "Unit VIII — Humour in real time: noticing, yes-and, reading the room",
      lessons: [
        { t: "Finding laughter anywhere — notice your honest reactions", v: "sUv353ua7E8", min: 7 },
        { t: "The way of improvisation — seven steps", v: "MUO-pWJ0riQ", min: 11 },
        { t: "Improv wisdom — don't prepare, just show up", v: "ABw26imw4m4", min: 57 },
        { t: "Humour is a skill — point of view, yes-and, staircase wit", v: "MdZAMSyn_As", min: 19 },
        { t: "Humour at work — status, styles, and the lines not to cross", v: "Fi5MNuF30FQ", min: 60 },
        { t: "Jokes that make people like you less", v: "j8hyXTbV1x0", min: 10 },
        { t: "Rescuing a joke — explain it, flatten it, own the flub", v: "q0--oItSgUY", min: 11 },
        { t: "Callbacks", v: "sjaNf7gB78k", min: 3 },
        { t: "Name the elephant in the room", v: "uRVwiN16NIg", min: 4 },
        { t: "Yes-and, then 'thank you because' — disagreeing without killing the idea", v: "KA447nZpVzs", min: 20 },
        { t: "Crowd work — turning an ordinary answer into a joke", v: "ZqzPS1Ap-bA", min: 14 },
        { t: "Prepared spontaneity — lines in your pocket for the questions everyone asks", v: "aCw3uiO0L_8", min: 3 },
        { t: "Teasing and comebacks — British banter, and when to stop", v: "UA_bkg5SQ0k", min: 14 },
        { t: "Self-deprecation that raises you — whoever names the weakness owns it", v: "xiX85UzI86Y", min: 14 },
        { t: "Where self-deprecation stops — never joke about the job you were hired for", v: "JLlwxZggsfg", min: 18 },
      ],
    },
    {
      name: "Unit IX — Conversation: listening, asking, holding the floor",
      lessons: [
        { t: "Ten rules for a better conversation", v: "R1vskiVDwl4", min: 11 },
        { t: "Shift or support — the habits we don't see in ourselves", v: "bGYfTSHoyq4", min: 22 },
        { t: "Five ways to listen better — and RASA", v: "cSohjlYQI2A", min: 8 },
        { t: "The power of listening — what do you really want?", v: "saXfavo1OQo", min: 16 },
        { t: "The mirror — an invitation to keep talking", v: "SJ2az4HxlTs", min: 2 },
        { t: "TALK — topics, asking, levity, kindness", v: "LTrrd94QEdU", min: 43 },
        { t: "Three kinds of conversation, and the deep question", v: "ybrihVuh43A", min: 10 },
        { t: "Conversation starters that spark", v: "cef35Fk7YD8", min: 18 },
        { t: "Talking to strangers — five ways in", v: "rFpDK2KhAgw", min: 12 },
        { t: "Feedback in four parts", v: "wtl5UrrgU8c", min: 5 },
        { t: "Disagreeing productively — common ground and better questions", v: "uyKCDessl2s", min: 22 },
        { t: "Argue less, talk more — 'what did you hear?', and a well, not a waterfall", v: "bIjz7UkauBA", min: 32 },
        { t: "Supercommunicators — match the conversation, loop for understanding", v: "dEq_PG3iof0", min: 46 },
      ],
    },
    {
      name: "Unit X — High stakes: explaining, pitching, and the hard questions",
      lessons: [
        { t: "One idea, built in their heads", v: "-FOCpMAww28", min: 8 },
        { t: "The curse of knowledge — find the core, make it concrete", v: "_DyC0fd395Y", min: 12 },
        { t: "Talk nerdy to us — so what, no jargon, no bullets", v: "y66YKWz_sf0", min: 4 },
        { t: "Before and after — putting words on numbers (stop at 24:00)", v: "7TiX-tTSRVU", min: 24 },
        { t: "The shape of a persuasive talk — what is, what could be", v: "1nYFpuc2Umk", min: 18 },
        { t: "How to start — a joke, a story or a question", v: "Bh3iM--2AW4", min: 20 },
        { t: "Rhetoric — threes, repetition, balance, metaphor", v: "bGBamfWasNQ", min: 19 },
        { t: "Describe what you do so anyone could build it", v: "17XZGUX_9iM", min: 27 },
        { t: "The 30-second pitch and the 2-minute pitch", v: "Q-YBCehpgpc", min: 14 },
        { t: "Value stories — normal, explosion, new normal", v: "vfLUGWEiMlk", min: 30 },
        { t: "A true story for every point in the pitch", v: "boyKF4Z1WX0", min: 48 },
        { t: "The accusation audit — say their objections first", v: "CnD7edz5LxQ", min: 2 },
        { t: "Direct questions get direct answers", v: "b4kLTqbxVUU", min: 5 },
        { t: "Answer the question asked — and say 'I don't know'", v: "tUyNKvRjQjs", min: 1 },
        { t: "Delivering bad news", v: "_klzinNwoic", min: 3 },
        { t: "Restarting a stalled deal — and earning 'that's right'", v: "L1W74fD77lo", min: 2 },
        { t: "Fight with story — the wedding DJs who booked 100 of 100", v: "NZA1oeZmkSA", min: 9 },
        { t: "Death by PowerPoint — one message, six objects, you as the visual aid", v: "Iwpi1Lm6dFo", min: 20 },
        { t: "Make numbers count — translate every number people must feel", v: "UYz9JSG6Qss", min: 17 },
        { t: "Six pitches — Pixar, subject line, rhyme, question, tweet, one word", v: "XvxtC60V6kc", min: 5 },
        { t: "Why you, now — the shift, the stakes, the promised land", v: "tP0oWTwmrpU", min: 21 },
        { t: "Magic words — identities, could not should, hedges and advice", v: "MCkRsoAXXCI", min: 48 },
        { t: "Reading the room in a pitch — five faces and what to say back", v: "0MtsXbTJdt8", min: 46 },
      ],
    },
    {
      name: "Unit XI — Choosing your stories: the five-minute test and the bank",
      lessons: [
        { t: "Your life story in five minutes", v: "iWDmnTKdbu8", min: 7 },
        { t: "A story bank — categories, prompts and tags", v: "Jb3V1bYX3sU", min: 22 },
        { t: "Which story to tell — start from the objective, then look for a success, a failure or a moment of clarity (stop at 58:00)", v: "x3cCL9TcdUQ", min: 58 },
      ],
    },
    {
      name: "Unit XII — Short-form structure: hooks, progression, payoff",
      lessons: [
        { t: "A story in under sixty seconds", v: "ZmNpeXTj2c4", min: 4 },
        { t: "Four ways a hook fails — delay, confusion, irrelevance, disinterest", v: "2byPP_9F0-Q", min: 16 },
        { t: "Hook layering — what the first three seconds of viral shorts share", v: "sb3-tuDwhJ0", min: 20 },
        { t: "Hook point — attention, story, credibility", v: "-bpcK9qonPE", min: 27 },
        { t: "Shorts in depth — but/so, visible progress, the last word", v: "7eosJwqoDaY", min: 41 },
        { t: "Three script mistakes — story flow, comprehension, speed to value", v: "0f6_pRAIJjI", min: 17 },
      ],
    },
    {
      name: "Unit XIII — Retention and analytics: reading what the audience did",
      lessons: [
        { t: "How recommendations work — pulled for each viewer, not pushed", v: "rHLjxrbXmmY", min: 40 },
        { t: "Reading a retention graph — five shapes", v: "wZBLDOpimG0", min: 5 },
        { t: "Shorts metrics — viewed versus swiped, valued watch time", v: "_tWy-_otnUc", min: 44 },
        { t: "Where a strategist looks first", v: "WpghnKjBBG8", min: 4 },
      ],
    },
    {
      name: "Unit XIV — On camera: the lens, the energy, the reps",
      lessons: [
        { t: "Talk to one person — how TV presenters own the words", v: "rAIhsokIdJY", min: 8 },
        { t: "When to look at the lens, and when to look away", v: "I06Ckbf6hc0", min: 2 },
        { t: "What low energy and nervous movement look like", v: "ht09gU7ID5Y", min: 2 },
        { t: "Coffee mode and presenter mode", v: "Y11SX2oHmw8", min: 10 },
        { t: "Dial it up, then bring it down", v: "CDLB03lQjdQ", min: 5 },
        { t: "Thirty days of recording yourself", v: "VXo4_ErkN_U", min: 8 },
        { t: "Sounding natural from a script — conversational lines, one sentence at a time", v: "3nn4vZseLC8", min: 8 },
        { t: "Talking-head basics — eyeline, one soft light, the mic close, slower, in sections", v: "jIG2TZwFwtE", min: 5 },
        { t: "Reading from a prompter — write it to be said, break it into breaths, rehearse on the glass", v: "7BswSByjOXM", min: 7 },
        { t: "Why a prompter read still sounds fake — the setup, the head space, and your own words", v: "JErF0FoAYvw", min: 7 },
        { t: "Sounding natural on air — an anchor's prompter habits", v: "82ToIEdbf8Y", min: 4 },
        { t: "Body language on camera — you fill the frame, so everything is bigger", v: "FzvN3Vxq6Cw", min: 19 },
      ],
    },
    {
      name: "Unit XV — Documenting the build: process, not a diary",
      lessons: [
        { t: "Show your work — share the process, not just the product (talk ends 37:30)", v: "m8v3jf8RVBk", min: 38 },
        { t: "A vlog needs a story — goal, challenge, complications, payoff", v: "KdsWzPMCv7w", min: 16 },
        { t: "Devlogs — technical or design, a straight line, the struggle left in", v: "laSmItPiId0", min: 17 },
        { t: "Explain the build to people who don't build", v: "q7tNk3EhDOg", min: 4 },
      ],
    },
    {
      name: "Unit XVI — Positioning and pillars: who it's for, what you're known for",
      lessons: [
        { t: "The smallest viable audience — specific up", v: "KC_CPpErxdY", min: 5 },
        { t: "Positioning — context that makes your value obvious (talk ends 34:10)", v: "j7gYVXjDePw", min: 35 },
        { t: "Five content pillars — knowledge, experience, need, you, values", v: "QtQjxqGuxTI", min: 14 },
      ],
    },
    {
      name: "Unit XVII — Long-form: acts, scripts, packaging, tension",
      lessons: [
        { t: "Three acts — 24 hours to meet Yes Theory", v: "CbWCNxxP-RI", min: 9 },
        { t: "Scripting a long video — packaging, outline, intro, body, outro", v: "7I50PECz7SU", min: 20 },
        { t: "Packaging — legitbait, not a click trap", v: "S2xHZPH5Sng", min: 19 },
        { t: "Editing for tension — moments, countdowns, questions", v: "Kt-mmNGKT88", min: 5 },
        { t: "A story inside a review — and packaging before you film", v: "xNC8gPIMv6U", min: 16 },
      ],
    },
  ],
});

// ---- The drill layer ----
// Per the brief: the mechanic in one sentence, three to five extractable rules
// mostly paraphrased from the transcript, ONE drill of ten minutes or less that
// produces an artifact, and one check that says how you know it worked.
// No summary longer than the drill.
DAR.DRILLS = Object.assign(DAR.DRILLS || {}, {

  "spch100.0.0": {
    module: "A2",
    mechanic: "A story is one five-second moment of change, and you find it by asking the day a question rather than waiting to be handed something dramatic.",
    rules: [
      "At the end of each day, ask literally this: <em>if I had to tell a 5-minute story from something that happened today, as benign as it might be, what was the most story-like moment?</em>",
      "Do not write the story. Dicks is explicit — “I don’t write the story down because that would be too much.” A line or two is the whole entry.",
      "A spreadsheet or a notebook, either is fine. What matters is that it is the same place every day.",
      "Benign is the point. The entries that look like nothing are the ones you would otherwise lose, and they are where the stories actually are.",
      "The effect is cumulative and not mainly about stories: doing it daily is what makes time stop compressing.",
    ],
    drill: { minutes: 5, artifact: "written",
      do: "Open the story bank on the Practice page and log today — two lines, what happened and why it stuck. Then do the same for yesterday from memory." },
    check: "Yesterday's entry is noticeably harder to write than today's. That gap is the argument for doing it daily, felt rather than believed.",
  },

  "spch100.0.1": {
    module: "A3",
    mechanic: "Half of a first impression is vocal, and your professional voice is almost certainly flatter than your real one — the fix is hearing yourself, not trying harder.",
    rules: [
      "Visual image is only ~50% of the first impression; the other half is <strong>vocal image</strong> — what people conclude the moment you open your mouth.",
      "You are already good at this with friends. The damage happens when you switch into the “professional” register — Giang’s test is asking a child to act like an adult and watching them go monotone.",
      "Same words, different delivery, opposite meaning. He says “that’s a great career path” four ways: impressed, sarcastic, defeated, and a disappointed mother.",
      "Look in the vocal mirror: record yourself, then note what you <em>like</em> and what the <em>limitations</em> are. Two lists, not one.",
      "Read children's books out loud. They are dense in emotive words, so they force inflection you cannot reach from a status update.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Record 60 seconds explaining what you are building, in your normal professional voice. Then read one page of a children's book aloud. Then record the same 60 seconds again." },
    check: "Play take one and take three back to back. If you cannot hear a difference, the drill did not work — the children's book was read too safely.",
  },

  "spch100.0.2": {
    module: "A7",
    mechanic: "Under pressure people list; structure is what makes an answer land, and two structures cover almost every question you will be asked in an audit.",
    rules: [
      "<strong>Take the beat.</strong> You are not obliged to answer instantly — “give me a moment to think about that”, a clarifying question, or a paraphrase all buy the same second.",
      "“Our brains are not set up for lists.” Itemising under pressure is the default failure, and it is the one to design against.",
      "<strong>Problem → Solution → Benefit.</strong> The structure of every advertisement you have ever seen, and it works for explaining technical work to a buyer.",
      "<strong>A-D-D</strong>, for <em>adding value</em>: <strong>A</strong>nswer, give a <strong>D</strong>etailed example, then <strong>D</strong>escribe why it is important.",
      "Practise structures before you need them. The point is that under pressure you reach for a shape you already own rather than inventing one.",
    ],
    drill: { minutes: 10, artifact: "spoken",
      do: "Have someone ask you “so what do you actually do?” Answer it twice out loud: once as Problem-Solution-Benefit, once as A-D-D. Time both." },
    check: "Both come in under 45 seconds and neither contains the word “basically”. If you rambled, you reached for a list instead of a shape.",
  },

  "spch100.1.0": {
    module: "A1",
    mechanic: "A story is six sentences: a normal, a rupture, a chain of consequences each caused by the last, and a changed normal — and if the chain does not hold, you have a list of events rather than a story.",
    rules: [
      "The six prompts, in order: <em>Once upon a time… Every day… One day… Because of that… Because of that… Until finally…</em>",
      "“Because of that” is the load-bearing one. It forces causation — if “and then” would work just as well, the story has gone slack there.",
      "Build the wireframe before the detail. His words: a gesture if you're an artist, an outline if you're a writer. Details come after, and they are chosen to support the ending.",
      "Write the ending first in practice, because the ending tells you what the opening “every day” has to be — the beginning is the opposite of the end.",
      "It is scale-free. The video runs the same six prompts over <em>Up</em>, <em>Dead Poets Society</em> and Martin Luther, and then tells you to try it on going to the grocery store.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take one entry from your story bank and force it through all six prompts. If either “because of that” only works as “and then”, the entry is an anecdote, not a story yet — write which one broke." },
    check: "Both “because of that” links survive being read aloud as causation. If one is really “and then”, you have found the exact gap the story is missing.",
  },

  "spch100.1.1": {
    module: "A6",
    mechanic: "Most conversational humour is not improvised — it is prepared answers to the three questions you are always asked, plus one cheap reliable move when you have nothing.",
    rules: [
      "List the <strong>three questions you get asked most</strong>. For you that is what you do, what Brickford is, and what the community is. Write a true answer <em>and</em> a playful one for each. He split-tested his in person until they landed.",
      "<strong>Say the opposite.</strong> Hot day, everyone complaining: “man, it's cold out here.” Humour is largely just the unexpected arriving, and this is the cheapest form of it.",
      "<strong>Prime yourself.</strong> Watch ten minutes of a comedian you actually enjoy before a social occasion — you carry the demeanour in, not the lines. He calls it using recency bias on yourself.",
      "The bar is lower than you think: “you could say the opposite and you'll be the funniest person in most groups.” This is a reason to start, not a reason to stop.",
      "The deep path is an improv class, not more watching. Noted here so the ceiling is honest — this video is the floor.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Write the three questions you are asked most in audits and at the community. For each, one true answer and one playful answer. Ten words each, no more." },
    check: "You can say all six out loud without reading them. A playful answer you have to look up is not prepared, it is written down.",
  },
});

// ---- Revision summaries for the seed (Units I and II) ----
// Written in T-037 from the same stored transcripts the seed drills came from,
// so the five seed lessons can be reviewed like every other lesson.
Object.assign(DAR.SUMMARIES, {

  "spch100.0.0": {
    takeaway: "Homework for Life: at the end of each day, ask what the most story-like moment was and write a line or two. Done daily it builds a storyteller's lens, fills a bank of small stories, and — the part Dicks did not expect — slows time down.",
    beats: [
      { t: "The lunch box", d: "When the doctor says to take food away from a food-throwing toddler, his wife warns it will be hard for him because he grew up hungry — a secret he never told her — and admits she quietly unpacks the oversized lunches he packs every morning." },
      { t: "Dander in the wind", d: "Moments like that are everywhere. We miss most of them, and when we do see one we have no way of catching it." },
      { t: "Small stories connect", d: "His dramatic stories — dying, jail, homelessness — are only okay on stage. The small ones are what audiences love, because everyone has a secret and everyone knows hunger." },
      { t: "The assignment", d: "Every night: if I had to tell a five-minute story from something that happened today, however benign, what was the most story-like moment? Write a sentence or two. Not the story." },
      { t: "The lens sharpens", d: "Walking an old dog at 2 a.m., in boxers, in the rain, becomes a moment he will own forever instead of an annoyance. Forgotten childhood memories start surfacing too." },
      { t: "Time slows down", d: "Days stop blurring together. He can touch any moment from years of entries and be back inside it." },
      { t: "Commitment and faith", d: "Five minutes every day, and patience: the early entries are weak, and the lens can take months to sharpen." },
    ],
    worked: "Same time, same place, every night, one line per moment however ordinary — 'walked Kaylee at 2 a.m., underwear, birds, rain, beauty'. A few weeks later, reread the list and mark the entries that still pull you straight back into the moment.",
    watch: "Waiting for something dramatic before writing anything down. The practice depends on logging the ordinary; skipping the 'boring' days is exactly what keeps the lens from sharpening.",
    concepts: [],
    checks: [
      { q: "What question does Dicks ask himself each night?", opts: ["What did I achieve today?", "If I had to tell a five-minute story from something that happened today, what was the most story-like moment?", "What was the worst thing that happened today?", "What should I do better tomorrow?"], a: 1,
        expl: "The words 'as benign as it might be' matter: the point is the best moment of an ordinary day." },
      { q: "Why doesn't he write the whole story down?", opts: ["It would be too much, and he would stop doing it", "Writing kills spontaneity", "The Moth forbids notes", "He records audio instead"], a: 0,
        expl: "He says outright that writing the story would be too much. A sentence or two keeps the habit alive." },
      { q: "Which effect of the practice did he not expect?", opts: ["Winning more StorySLAMs", "Better spelling", "Time slowing down, so days stop disappearing", "Becoming a teacher"], a: 2,
        expl: "He calls it a magical elixir: the days creep by, and none is lost." },
    ],
  },

  "spch100.0.1": {
    takeaway: "Half of a first impression is vocal, and most professionals switch into a flat 'professional' voice. Giang's five fixes: respect what the voice does, build a taste for voices, look in the vocal mirror, read children's books aloud, and record yourself regularly.",
    beats: [
      { t: "Vocal image", d: "Visual image is only half the first-impression puzzle. The other half forms the moment you open your mouth: how confident, friendly and trustworthy you seem." },
      { t: "The professional voice", d: "Ask a child to act like an adult and they go serious and monotone. We do the same at work, and become less engaging and less influential." },
      { t: "Same words, opposite meanings", d: "'Wow, that's a great career path' — amazed, sarcastic, defeated, and a disappointed mother. The meaning lives beneath the words." },
      { t: "Build your vocal taste", d: "Watch the most-viewed TED talks, notice whose voice draws you in and whose annoys you, and ask why — the way you develop a sense of style." },
      { t: "The vocal mirror", d: "Record yourself, watch it back, and list what you like and what the voice says about you that you do not intend." },
      { t: "Children's books and monthly videos", d: "Children's books are full of emotive words that force inflection. One recorded video a month gives twelve markers a year, so invisible progress becomes visible." },
    ],
    worked: "Record sixty seconds of how you normally explain your work. Listen back and write two columns: what you like, and what the voice says about you that you did not mean. Repeat monthly and compare against the first.",
    watch: "Assuming good content is enough. Correct words said in the wrong voice are not effective, and listeners decide on confidence and trust within seconds.",
    concepts: [],
    checks: [
      { q: "Besides visual image, what makes up the other half of a first impression?", opts: ["Your vocabulary", "Your vocal image — what people conclude when you speak", "Your handshake", "Your credentials"], a: 1,
        expl: "He splits the first impression roughly fifty-fifty between visual image and vocal image." },
      { q: "What does the 'great career path' demonstration show?", opts: ["Identical words can carry opposite meanings depending on how they are said", "Career advice should be specific", "Sarcasm never works", "Short sentences are clearer"], a: 0,
        expl: "The same sentence came out amazed, sarcastic, defeated and disappointed." },
      { q: "Why make one video a month?", opts: ["To build a following", "To practise editing", "To create markers that make otherwise invisible progress visible", "To replace live practice"], a: 2,
        expl: "Progress in communication is hard to see; twelve markers a year make it visible and keep you going." },
    ],
  },

  "spch100.0.2": {
    takeaway: "Abrahams's method for speaking on the spot: be interested rather than interesting, treat anxiety as go-time, take a beat, trade perfection for connection, and reach for a practised structure — Problem-Solution-Benefit, or Answer-Detail-Describe — instead of a list.",
    beats: [
      { t: "Interested, not interesting", d: "Start conversations with curiosity: comment on your surroundings ('did I miss the memo on the blue?') and keep them going with 'tell me more'." },
      { t: "Anxiety has symptoms and sources", d: "It is hard-wired but manageable. Reframing nerves as excitement helps: it is your body saying this matters." },
      { t: "Three common mistakes", d: "Not preparing; believing there is one right way to say it; and answering instantly. Take a beat — a clarifying question or a paraphrase buys the moment you need." },
      { t: "Structure, not lists", d: "Our brains are not set up for lists. Problem-Solution-Benefit is the structure of every advertisement and works for any pitch." },
      { t: "Small talk is hacky sack, not tennis", d: "Keep the ball in the air together. Mix supporting turns (ask more about their topic) with shifting turns (move the topic) — roughly two-thirds to three-quarters supporting." },
      { t: "Q&A as opportunity, answered with ADD", d: "Answer, give a Detailed example, then Describe why it matters to them. It keeps you from taking the listener on your discovery of the answer." },
      { t: "Maximise mediocrity; breathe out", d: "Judging yourself mid-sentence steals bandwidth, so turn the judging down. Finish each thought out of breath: the inhale becomes a pause and leaves no room for 'um'." },
    ],
    worked: "Asked 'so what do you do?', answer in ADD: one sentence that answers it, one concrete example, then why it matters to the person asking. Then stop.",
    watch: "Thinking out loud — listing points as they occur to you. It says far more than needed and leaves the listener with nothing they can remember.",
    concepts: [],
    checks: [
      { q: "According to Abrahams, what is the wrong place to start small talk?", opts: ["Asking a question", "Commenting on your surroundings", "Feeling that you must be interesting", "Saying 'tell me more'"], a: 2,
        expl: "The pressure to be interesting is the problem; being interested is the fix." },
      { q: "What does ADD stand for?", opts: ["Answer, give a Detailed example, Describe why it matters", "Ask, Discuss, Decide", "Agree, Deflect, Defer", "Attention, Desire, Demand"], a: 0,
        expl: "He uses it for Q&A — answer, example, relevance — and demonstrates it on a mock interview question." },
      { q: "How does he reduce filler words like 'um'?", opts: ["Speaking faster", "Memorising the talk", "Never pausing", "Finishing each thought out of breath, so the inhale becomes a pause"], a: 3,
        expl: "You cannot say 'um' while breathing in, so the pause replaces the filler." },
      { q: "In small talk, roughly what share of turns should support the other person's topic?", opts: ["About a tenth", "About half", "About two-thirds to three-quarters", "Every single turn"], a: 2,
        expl: "The rest are shifting turns, which move the topic or the focus." },
    ],
  },

  "spch100.1.0": {
    takeaway: "The story spine reduces any story to six prompts — Once upon a time, Every day, One day, Because of that, Because of that, Until finally — a wireframe to build detail onto, and it works on a Pixar film, on history, or on a trip to the grocery store.",
    beats: [
      { t: "A wireframe first", d: "Distil the story to its most basic form — a gesture if you draw, an outline if you write — so that every scene you add later pushes the plot forward." },
      { t: "The six prompts", d: "Once upon a time… Every day… One day… Because of that… Because of that… Until finally…" },
      { t: "Up", d: "A couple saves for adventure; one day she dies; because of that he flies off, takes a scout along, compromises; until finally he learns the ultimate adventure is caring for those you love." },
      { t: "Dead Poets Society and Martin Luther", d: "The same six prompts carry a school drama and a religious revolution — the structure is scale-free." },
      { t: "Know where it ends", d: "Once you know where you start and where the story ends, it is far easier to choose details that support the ending. Try it on a trip to the grocery store." },
    ],
    worked: "Fill all six prompts in one sitting — ending first if that is easier — then read the two 'because of that' lines aloud and check that each is caused by the line before it.",
    watch: "Letting 'because of that' quietly become 'and then'. A list of events in order is not a chain of causes, and it is the causes that push a story forward.",
    concepts: [],
    checks: [
      { q: "Which prompt forces cause and effect?", opts: ["Once upon a time", "Every day", "Because of that", "Until finally"], a: 2,
        expl: "If 'and then' would work just as well, the story has gone slack at that point." },
      { q: "What does the spine give you before any details?", opts: ["A wireframe or outline of the whole story", "A cast of characters", "A final line", "A title"], a: 0,
        expl: "Details come afterwards, chosen to push toward the ending." },
      { q: "What ordinary story does the video suggest practising on?", opts: ["Your CV", "A news article", "A film review", "Going to the grocery store"], a: 3,
        expl: "Anything in your life can be structured as a story spine; it suggests five to ten minutes on something that small." },
    ],
  },

  "spch100.1.1": {
    takeaway: "Most conversational humour is prepared: a true answer and a playful answer to the questions you are always asked, saying the opposite as a cheap and reliable move, and priming yourself with ten minutes of a comedian you love. The deep path is an improv class.",
    beats: [
      { t: "The same questions, every time", d: "Conversations open on the same tracks — what do you study, what do you do. Prepare a true answer that shows your values and a playful one, and split-test them, as he did." },
      { t: "Say the opposite", d: "On a hot day when everyone is complaining, 'man, it's cold out here' gets a chuckle. Much of humour is simply the unexpected." },
      { t: "Prime yourself", d: "Watch ten to fifteen minutes of the comedian whose vibe you want before you go out. You carry their demeanour in, not their lines." },
      { t: "The bar is low", d: "You do not need to be excellent. Saying the opposite will make you the funniest person in most groups." },
      { t: "Go deeper with improv", d: "Improv classes teach scene-building and structure — almost everything about being funny live, if the class is any good." },
    ],
    worked: "Write your three most-asked questions and, under each, a true answer and a playful one. Use the playful ones in real conversations and keep whichever actually gets a laugh.",
    watch: "Trying to be spontaneously quick like a professional comedian with no prepared material. Speed comes from long practice; the prepared answer is available today.",
    concepts: [],
    checks: [
      { q: "What does he suggest preparing for the questions you are asked most?", opts: ["A true answer that reveals your values, and a playful one", "A memorised joke", "A question to ask back", "A short story"], a: 0,
        expl: "They are free gimmes, like an uncle's ready-made joke." },
      { q: "Why does saying the opposite tend to get a chuckle?", opts: ["People like contrarians", "Humour is often just the unexpected happening", "It shows intelligence", "It changes the subject"], a: 1,
        expl: "It is not the funniest kind of humour, but it is the easiest and most reliable." },
      { q: "What does 'priming yourself' mean here?", opts: ["Rehearsing jokes", "Drinking coffee first", "Watching ten minutes of a comedian whose vibe you want before going out", "Reading the news"], a: 2,
        expl: "It uses recency on yourself: the demeanour carries over even when the lines do not." },
    ],
  },
});

// =====================================================================
// Unit III — A1, story structure for spoken stories (budget 2.5 h)
// Matthew Dicks (Storyworthy), Ira Glass, Andrew Stanton, Kurt Vonnegut,
// Tamsen Webster. Everything below was written from the stored transcripts.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.2.0": {
    module: "A1",
    mechanic: "Telling a good story is not a gift but a decision you make before you open your mouth, and the material is the small thing you did that you cannot yet explain.",
    rules: [
      "People keep stories and lose data. Nobody has ever asked to see a pie chart again; everyone re-watches a film they already know by heart.",
      "Vulnerability buys connection. After he tells something true and unflattering, strangers tell him things they have told no one.",
      "A story told first earns trust — he opened the talk with one so you would already like him when he asked you to act. He calls it coercing people benevolently.",
      "Ask <em>why did you do that?</em> about small, odd behaviour. Refusing a free Gatorade at 100 degrees led back to a boy who grew up hungry and learned never to accept food he could not repay.",
      "The people who love us tolerate rambling, so most of us were trained to tell bad stories. The cure is strategy — think before you speak, and listen — not talent.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "List three small things you did this week that you cannot fully explain — something refused, avoided, or over-reacted to. Pick one and write 'why did I do that?' three times, answering each one more honestly than the last." },
    check: "The third answer surprises you. If all three are the obvious reason, you stopped asking too early.",
  },

  "spch100.2.1": {
    module: "A1",
    mechanic: "Every story is about one instant of change — a realization or a transformation that takes about five seconds — and the dramatic events around it are only the road to that instant.",
    rules: [
      "Change flips like a coin: <em>I don't feel loved</em> becomes <em>I feel loved</em>. A lot leads up to it; the change itself is instantaneous.",
      "Audiences do not cry when he dies in the ambulance. They cry when his friends crowd the emergency-room door. No one can connect to a windshield; everyone can connect to finding out you are loved.",
      "Most of his stories are moments an outsider would not even notice, because the important shifts happen in our heads.",
      "A little change is enough. A small change of mind or heart will carry a whole story.",
      "Be deeply curious about yourself. He kept a moment at a golf bench rolling around for three months before he understood what it meant.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take one story-bank entry and write its five-second moment as a single sentence: 'Before, I thought (or felt) X; in that instant, I thought (or felt) Y.' Under it, list the three events that lead up to it." },
    check: "The sentence has a clear before and after, and it is not the most dramatic event in the story. If your moment is the crash, you picked the event, not the change.",
  },

  "spch100.2.2": {
    module: "A1",
    mechanic: "A broadcast story is two building blocks woven together — the anecdote, a sequence of actions where one thing leads to the next, and the moment of reflection that says why it matters — with bait pulling the listener from question to question.",
    rules: [
      "Forget the school essay — a topic sentence followed by facts. Spoken stories run on two blocks: the <strong>anecdote</strong> and the <strong>moment of reflection</strong>.",
      "An anecdote is a sequence of actions. Even a man waking in an oddly quiet house and walking downstairs has momentum, because it feels like a train with a destination.",
      "Use <strong>bait</strong>: keep raising questions and answering them. The quiet house plants a <em>why?</em>, and the listener assumes you will answer it.",
      "Without reflection, a killer anecdote means nothing; without an anecdote, a smart reflection is a lecture. You need both, and a good story flips between them.",
      "Be ruthless. If the action or the meaning is missing, the piece will not come together however much you polish it.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Rewrite one story-bank entry as six sentences in this order: action, action, reflection, action, action, reflection. Underline the question each of the first two sentences raises." },
    check: "Read only the action sentences: they still pull you forward. Read only the reflections: they say something you did not know at the start.",
  },

  "spch100.2.3": {
    module: "A1",
    mechanic: "Open with an elephant — an early signpost of what the story is about and what could go wrong — so the audience has a question to carry to the end, and let it change colour when the story turns.",
    rules: [
      "Stakes make an audience worry, wonder, root for you, or hope for your downfall. They are why anyone wants to reach the end.",
      "A film has a trailer; you do not. When you start speaking nobody knows what you are going to say, so you have to give them a reason to care straight away.",
      "The elephant is a question the listener can hold: <em>will he get the spoon?</em> <em>how will he get home with no petrol and no money?</em>",
      "Elephants change colour. On the widower's porch, getting home stops mattering; the new stake is how he will live with the lie.",
      "It works outside stories — a pitch, a keynote, a launch. <em>I have been waiting two and a half years to tell you this</em> is an elephant.",
    ],
    drill: { minutes: 10, artifact: "spoken",
      do: "Write three different opening sentences for one story-bank entry, each putting a question in the listener's head within thirty seconds. Say each out loud and keep the one that makes you most want the next line." },
    check: "Someone who hears only your first thirty seconds can say what the story seems to be about and what might go wrong. If they cannot, there is no elephant yet.",
  },

  "spch100.2.4": {
    module: "A1",
    mechanic: "A great story knows its punchline from the first sentence, makes a promise early, and makes the audience work out two plus two for themselves, which is what keeps them caring.",
    rules: [
      "Storytelling is joke telling: know your ending, and make everything from the first sentence lead to it.",
      "The greatest commandment is <em>make me care</em>. A promise at the start works like a pebble pulled back in a slingshot.",
      "Give them two plus two, never four. Audiences want to work for their meal but must not notice they are working; a well-organised absence of information draws them in.",
      "Drama is anticipation mingled with uncertainty — short-term tension (will Dory forget?) inside long-term tension (will they ever find Nemo?).",
      "Use what you know: not your plot or your facts, but a truth you have felt, so the story carries values you actually hold.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Write the key moment of one story twice: once naming the feeling outright ('I was terrified'), once with only the details that let a listener infer it. Keep the second version." },
    check: "Read version two to someone and ask what you were feeling. If they name it without your having said it, you gave them two plus two.",
  },

  "spch100.2.5": {
    module: "A1",
    mechanic: "Any story can be drawn as a curve of good and bad fortune over time, and it is the shape of the curve — not the details — that an audience responds to.",
    rules: [
      "Two axes: good fortune at the top and ill fortune at the bottom, beginning on the left and end on the right. Only the shape matters.",
      "<strong>Man in a hole</strong>: someone gets into trouble and gets out again. People never tire of it.",
      "<strong>Boy gets girl</strong>: an ordinary day, someone finds something wonderful, loses it, gets it back.",
      "Cinderella starts at the bottom, climbs a step with each gift, drops at midnight — but not to the bottom, because she will remember the dance — and ends off the scale.",
      "Start a little above average, so the audience does not think they are being handed a depressing person.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "On one sheet, draw the fortune curve for three story-bank entries. Label each one: man in a hole, boy gets girl, or flat." },
    check: "At least one curve has a clear fall and recovery. If all three are flat lines, those entries are reports so far, not stories.",
  },

  "spch100.2.6": {
    module: "A1",
    mechanic: "Decide what has changed in you before you speak, make the opening its opposite, start as close to the ending as you can, and every sentence will have something to aim at.",
    rules: [
      "Start with the ending: what change are you trying to make the audience understand? (A father who pushed his daughter away becomes a father who regrets it.)",
      "The beginning is the opposite of the ending. No opposite usually means an anecdote — <em>cotton candy: delicious but forgettable</em> — or a moment you have not yet understood.",
      "Start as close to the end as possible. He opens five minutes before the film ends, seconds before she climbs over the armrest, not when they arrive at the cinema.",
      "Tell it beat by beat — do not get ahead or behind — and end on the desire rather than the tidy resolution, so the story stays alive in the listener.",
      "Judge your own telling kindly and then specifically: what worked, then what to cut. His first pass was a B minus, which is already better than most dinner-table stories.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "For one story-bank entry write three lines: the ending (the change, as 'from X to Y'), the opening state (X), and the first sentence of the story placed as late in time as it can go." },
    check: "Your first and last sentences are opposites. If the first one is 'so I woke up that morning', you started too far from the end.",
  },

  "spch100.2.7": {
    module: "A1",
    mechanic: "Compress any message into And, But, Therefore — situation, problem, resolution — and insert a Yet for the moment of truth that makes the audience accept the Therefore.",
    rules: [
      "<strong>And</strong>: two pieces of information that set up the situation everyone accepts.",
      "<strong>But</strong>: the problem — the conflict act of the story.",
      "<strong>Therefore</strong>: the resolution you are proposing.",
      "<strong>Yet</strong>: the one extra fact that is the moment of truth; it is what makes the audience agree that the Therefore follows.",
      "Use it on the fly, when there is no time to build a full story but the message still needs a shape.",
    ],
    drill: { minutes: 5, artifact: "written",
      do: "Write an And-But-Yet-Therefore for the opening of a business audit: their situation, the problem, the fact that changes their mind, what you will do. One line each." },
    check: "Said aloud it takes under thirty seconds, and the Therefore feels inevitable after the Yet. If you could delete the Yet without loss, it is not a moment of truth.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.2.0": {
    takeaway: "Dicks's case is that a told story is remembered, earns trust and changes the teller — and that telling one well is a matter of deciding what to say before you say it, not of having lived a dramatic life.",
    beats: [
      { t: "A reluctant first night", d: "Friends pushed him to his first Moth StorySLAM. He hoped his name would stay in the hat, his wife made him go up, and with the first words at the microphone he knew he wanted to come back." },
      { t: "Stories are kept, data is not", d: "Nobody asks to see a slide deck again, but people re-watch films they know by heart. Whatever you put inside a story gets remembered." },
      { t: "Vulnerability buys connection", d: "After a vulnerable story, strangers hand him their secrets — five women told him about miscarriages they had told no one else. Going first gives other people permission." },
      { t: "Benevolent persuasion", d: "He opened the talk with a story so the audience would like him before he asked them for anything. A story earns trust, and trust makes people follow." },
      { t: "Personal understanding", d: "He refused a Gatorade on a 100-degree golf course and only understood why when he asked himself: a hungry child learns never to accept food he cannot pay back." },
      { t: "Most of us were trained to tell bad stories", d: "Our audiences love us and put up with rambling. The fix is simple decision-making — think about what you will say before you say it — which anyone can learn." },
    ],
    worked: "When one of your own reactions seems out of proportion — refusing help, snapping at a stranger, avoiding a place — ask why you did it, then ask again. The answer that comes from years earlier is usually the story; the reaction is its doorway.",
    watch: "Believing you need a dramatic life to have stories. He has been through car crashes and jail and calls those the hardest to tell; what works is the small moment you would normally walk past.",
    concepts: [],
    checks: [
      { q: "According to Dicks, what mainly separates a good storyteller from a bad one?", opts: ["A dramatic life full of events", "Deciding what to say before saying it", "A trained performer's voice", "Memorising the story word for word"], a: 1,
        expl: "He calls storytelling decision-making: simple strategies anyone can learn. He says he is not gifted, just someone who thinks before he speaks." },
      { q: "Why does he open the talk with his own story before giving any advice?", opts: ["To fill time while the slides load", "Because the event required it", "So the audience likes and trusts him before he asks them to act", "To prove he has had a hard life"], a: 2,
        expl: "He says it outright: a story earns trust and makes people want to follow you — persuasion, but benevolent." },
      { q: "What did refusing a free drink on the golf course reveal when he asked himself why?", opts: ["A habit from a hungry childhood still ran his behaviour", "That he was dehydrated", "That he distrusted his friend", "That he dislikes sports drinks"], a: 0,
        expl: "Children who grow up hungry learn never to accept food they cannot reciprocate. He would not have known without asking." },
    ],
  },

  "spch100.2.1": {
    takeaway: "A story is about the instant someone changes — usually small and internal — and the dramatic events around it only matter as the road to that instant.",
    beats: [
      { t: "The crash that is not the story", d: "At seventeen, two days before Christmas, he goes through a windshield after a day spent buying surprise presents for friends; his heart stops in the ambulance." },
      { t: "The doorway that is", d: "His parents go to check the car before they come to him. His friends, alerted by a McDonald's phone tree, crowd the emergency-room doors chanting his name. They gave him the gift of family." },
      { t: "Why nobody cries at the death", d: "Audiences blink when he dies and cry when his friends arrive. Nobody can connect to a windshield; everybody can connect to finding out they are loved." },
      { t: "Realization or transformation", d: "A story is change over time: either I now see something differently, or I have become someone different. The change itself takes an instant." },
      { t: "Small is enough", d: "Most of his stories are moments an outsider would not notice, because most change happens inside your head. A small change of mind or heart is enough." },
      { t: "The bench and the fountain", d: "His son promised to build him a fountain when he dies. Three months later he realised that playing golf with his son was the one childhood promise to himself he had kept." },
    ],
    worked: "Write the moment as 'before, I thought X; in that instant, I thought Y'. Then work backwards: what does the audience need to know for Y to land? Anything that does not serve that instant can go — including the drama.",
    watch: "Mistaking the biggest event for the story. The crash is spectacular and inert; the instant of feeling loved is small, and it is what the audience actually responds to.",
    concepts: [],
    checks: [
      { q: "In the car-crash story, what is the five-second moment?", opts: ["Going through the windshield", "His heart stopping in the ambulance", "Realising, as his friends crowd the doorway, that he is loved", "The nurse agreeing to call McDonald's"], a: 2,
        expl: "The crash is the road. The change is from feeling alone to knowing he has a family." },
      { q: "Why do audiences not cry when he describes dying?", opts: ["Nobody can connect to the experience of going through a windshield", "He rushes that section", "It is too graphic to hear", "They do not believe him"], a: 0,
        expl: "People wince at gore but cannot connect to it. The emotional response comes at the moment they recognise from their own lives." },
      { q: "What did the golf-bench moment finally mean to him?", opts: ["That his son wants to build a fountain", "That he should stop playing golf", "That he resents how he was raised", "That he was keeping his most important childhood promise by playing golf with his son"], a: 3,
        expl: "He let the moment roll around for three months; the realisation arrived later, which is why he argues for being curious about yourself." },
    ],
  },

  "spch100.2.2": {
    takeaway: "Ira Glass reduces a story to two building blocks — the anecdote, which carries momentum, and the moment of reflection, which carries meaning — and says the craft is weaving them together while baiting the listener with questions.",
    beats: [
      { t: "Not the school essay", d: "We were taught a topic sentence followed by supporting facts. Broadcast stories work on two different blocks: the anecdote and the reflection." },
      { t: "The anecdote is a sequence of actions", d: "This happened, which led to this, which led to this. Even the dullest sequence — a man wakes, the house is too quiet, he walks downstairs — feels like a train with a destination." },
      { t: "Bait", d: "The quiet house raises a question, and the listener assumes it will be answered. Keep raising and answering questions from the first line." },
      { t: "The moment of reflection", d: "At some point someone has to say why you are listening — the bigger thing the story is driving at." },
      { t: "Two ways to fail", d: "A thrilling anecdote that means nothing, or a smart idea with no story under it. You need both, and a good piece flips back and forth between them." },
    ],
    worked: "Draft in alternation: a little action, a line of meaning, more action, more meaning. If the meaning lines could be deleted without anyone noticing, they are not reflections yet; if the action lines are summaries, they are not anecdote.",
    watch: "Falling in love with a great anecdote that predictably leads nowhere. Glass calls that the bane of his existence — and says you must be ruthless enough to see that one of the two blocks is missing.",
    concepts: [],
    checks: [
      { q: "What are Ira Glass's two building blocks of a story?", opts: ["Setup and punchline", "The anecdote and the moment of reflection", "Character and setting", "Hook and call to action"], a: 1,
        expl: "The anecdote is the sequence of actions; the reflection says why it matters." },
      { q: "In his example of a man waking in a quiet house, what is the 'bait'?", opts: ["The unusual quiet, which raises the question why", "The man's name", "The staircase", "The time of day"], a: 0,
        expl: "The quiet plants a question, and any question you raise implies you will answer it." },
      { q: "Which failure does he call the bane of his existence?", opts: ["Stories that are too short", "Too much music under the tape", "A thrilling anecdote that means absolutely nothing", "Interviewees who talk too fast"], a: 2,
        expl: "Without a moment of reflection, even a surprising sequence of events tells the listener nothing new." },
    ],
  },

  "spch100.2.3": {
    takeaway: "Dicks's essential stake is the elephant: an early, clear signal of what the story is about and what could go wrong, which gives the audience a reason to stay — and which may turn into a different stake as the story develops.",
    beats: [
      { t: "What stakes do", d: "They make an audience worry, wonder, root for you or hope for your demise. They are what drives people to the end of a story." },
      { t: "Why a speaker needs it more than a film", d: "Films have trailers, so we walk in knowing the stakes. When you start to speak, nobody knows what you are about to say." },
      { t: "The spoon of power", d: "A boy pulls a spoon out of a leaf pile, Dicks declares it the spoon of power, and now he must have it. Will he get the spoon? That question carries the story." },
      { t: "No petrol, no money", d: "His tyre disintegrates a hundred miles from home; seven hours later all his money is in a stranger's hand and the tank is empty. How will he get home?" },
      { t: "The elephant changes colour", d: "On a widower's porch, lying about a charity, getting home stops mattering. The new stake is how he will face what he has done." },
      { t: "Beyond stories", d: "A pitch, a keynote, a product launch all need one. 'I have been waiting two and a half years to tell you this' is an elephant." },
    ],
    worked: "In the first thirty seconds, state the situation that creates the question, not a summary of the story: where you are, what you want, what is in the way. Every later sentence then reads as a step toward the answer.",
    watch: "A cheap hook — a shocking first line unrelated to what the story is really about. The elephant has to be the question the story actually answers, at least for now.",
    concepts: [],
    checks: [
      { q: "Why does a spoken story need an elephant more than a film does?", opts: ["Films are longer", "Films have trailers, so their audience already knows the stakes", "Speakers have no visuals", "Live audiences are less patient"], a: 1,
        expl: "A film audience arrives knowing what kind of story it is. A listener has no idea until you tell them." },
      { q: "What does it mean that an elephant can change colour?", opts: ["The narrator switches", "The tone gets darker", "The ending has a twist", "The main stake can shift, as when getting home stops mattering on the widower's porch"], a: 3,
        expl: "The first stake gets the audience in; a new one can take over once the story turns." },
      { q: "Which of these openings is an elephant?", opts: ["My tyre has just disintegrated, I have no phone and no money, and I am a hundred miles from home.", "This is a story about loneliness.", "I want to tell you about something that happened once.", "Let me start with some background about my family."], a: 0,
        expl: "It gives the listener a question to hold — how will he get home? — without summarising the story." },
    ],
  },

  "spch100.2.4": {
    takeaway: "Stanton's craft notes from Pixar: know the punchline, make a promise, make the audience care, and let them assemble the meaning themselves — two plus two, never four.",
    beats: [
      { t: "Storytelling is joke telling", d: "Know your ending, and make everything from the first sentence to the last lead toward it." },
      { t: "Make me care", d: "The greatest story commandment. You stop flicking channels on the one programme that made you care, and that is by design." },
      { t: "The promise", d: "A good beginning promises the story will be worth the time — like a pebble pulled back in a slingshot." },
      { t: "Two plus two", d: "Audiences are born problem-solvers and want to work for their meal without noticing. A well-organised absence of information draws them in." },
      { t: "Anticipation mingled with uncertainty", d: "Short-term tension (will Dory forget?) running inside long-term tension (will they find Nemo?), built on honest conflict." },
      { t: "Spine, change, theme, wonder", d: "Characters have an inner drive they cannot escape; stories die when things go static; a theme runs underneath; and the rarest ingredient is wonder." },
      { t: "Use what you know", d: "Not plot or fact, but a truth you have felt — Marlin's promise to Nemo came from a boy told he would not live." },
    ],
    worked: "Take the emotional peak of your story and remove the sentence that names the emotion. Replace it with two concrete details from which the listener can work the emotion out. That is two plus two.",
    watch: "Giving the audience four: explaining the feeling, the lesson and the meaning outright. It feels clear to the teller and leaves the listener with nothing to do — and nothing to care about.",
    concepts: [],
    checks: [
      { q: "What does Stanton mean by 'give them two plus two, not four'?", opts: ["Tell the story twice", "Let the audience assemble the meaning from the clues you provide", "Use simple language", "Keep stories under four minutes"], a: 1,
        expl: "The audience wants to work for its meal; the order and choice of elements decides whether they engage." },
      { q: "How does he define drama, quoting William Archer?", opts: ["Conflict between good and evil", "A beginning, a middle and an end", "Anticipation mingled with uncertainty", "Surprise followed by relief"], a: 2,
        expl: "Have you made the audience want to know what happens next, and how it will all end?" },
      { q: "What does he call the greatest story commandment?", opts: ["Make me care", "Know your audience", "Never use dialogue", "End with a twist"], a: 0,
        expl: "Emotionally, intellectually or aesthetically — just make me care." },
    ],
  },

  "spch100.2.5": {
    takeaway: "Vonnegut draws stories as curves of fortune over time and shows that a handful of shapes — man in a hole, boy gets girl, Cinderella — are what audiences actually respond to.",
    beats: [
      { t: "The axes", d: "Up the side runs fortune, from sickness and poverty to wealth and boisterous health; along the bottom runs time, from beginning to end. It is the shape of the curve that matters." },
      { t: "Man in a hole", d: "Start a little above average, fall into trouble, climb out again. People never get sick of it." },
      { t: "Boy gets girl", d: "An ordinary day, an ordinary person; they find something wonderful, lose it, and get it back." },
      { t: "Cinderella", d: "She starts at the bottom, rises with each gift from the fairy godmother, drops at midnight — but not to the bottom, because she will remember the dance — and ends off the scale." },
    ],
    worked: "Before telling a story, sketch its curve on a napkin. If the line never dips, there is no trouble to get out of; if it never rises, you have only bad news. The dip-and-recovery is what holds a listener.",
    watch: "Telling a flat line — a pleasant sequence of events with no fall and no recovery — and wondering why nobody leans in.",
    concepts: [],
    checks: [
      { q: "What do Vonnegut's two axes represent?", opts: ["Character and setting", "Fortune (ill to good) and time (beginning to end)", "Tension and release", "Truth and fiction"], a: 1,
        expl: "The G-I axis is good fortune to ill fortune; the B-E axis is beginning to end." },
      { q: "Why does Cinderella not fall back to the bottom at midnight?", opts: ["The fairy godmother saves her", "She keeps the carriage", "The prince finds her at once", "She will remember the dance for the rest of her life"], a: 3,
        expl: "The loss is real but she ends above where she began, because the memory stays." },
      { q: "Which shape is 'somebody gets into trouble and gets out of it again'?", opts: ["Man in a hole", "Boy gets girl", "Cinderella", "A flat line"], a: 0,
        expl: "Vonnegut says people never tire of it." },
    ],
  },

  "spch100.2.6": {
    takeaway: "Watching Dicks build a story live from a homework-for-life entry shows the craft as a chain of decisions: know the change, open on its opposite, start as late as possible, aim every beat at the end.",
    beats: [
      { t: "Find it in the last 72 hours", d: "He scans three days of entries and picks a film night with his sixteen-year-old daughter. Within 72 hours there is nearly always something worth telling." },
      { t: "Ending first, then its opposite", d: "Before telling it he names what he is trying to say — how often will moments like this happen again? — and asks what its opposite is. That becomes the beginning." },
      { t: "Start close to the end", d: "He opens during the car chase with minutes of the film left, not when they arrive at the cinema." },
      { t: "The ending found in the telling", d: "Mid-story he remembers watching her walk into the house from the car. Profound moments often happen in benign places — alone at the wheel, in a drive-through queue." },
      { t: "End on the wish, not the hug", d: "He closes hoping she will agree to a make-up cuddle. An unresolved ending keeps the story alive in the listener." },
      { t: "Grade it kindly, then honestly", d: "First what worked, then what did not: a bloated opening, too little suspense, stakes he could raise. A B minus — still better than most stories told at dinner." },
      { t: "Anecdote or story?", d: "His son's tale of smuggled dead crabs was an anecdote until a question found the change: I don't believe people; I have to learn for myself." },
    ],
    worked: "Ask 'what changed in me?' and write it as 'from X to Y'. The first sentence lives in X as close to the change as possible; the last lives in Y. If you cannot find an X, probe the meaning further or accept it is an anecdote.",
    watch: "Starting at the chronological beginning — 'so we got to the cinema'. Every sentence before the stakes appear is a sentence the audience spends waiting for a reason to care.",
    concepts: [],
    checks: [
      { q: "What does 'start with the end' mean in Dicks's method?", opts: ["Tell the ending first and then flash back", "Know the change you are trying to convey before you begin", "State the moral in your first line", "Memorise the last sentence"], a: 1,
        expl: "You cannot aim at an ending you have not chosen; the change you want to convey decides everything else." },
      { q: "If you cannot find an opposite of your final moment to begin with, what is most likely true?", opts: ["You have an anecdote, or have not yet found what the moment means", "The story should be told backwards", "It needs more detail", "It is too short"], a: 0,
        expl: "His son's crab story became a story only once a question uncovered what it meant." },
      { q: "Why does he prefer ending on the wish for a hug rather than the hug?", opts: ["It is shorter", "It avoids sentimentality", "It is more honest about the facts", "An open ending keeps the story alive in the listener"], a: 3,
        expl: "People wonder what happened next, and the story keeps working in them." },
    ],
  },

  "spch100.2.7": {
    takeaway: "Tamsen Webster takes Randy Olson's And, But, Therefore — the three acts of a story in three words — and adds a Yet for the moment of truth that makes the resolution persuasive.",
    beats: [
      { t: "And", d: "Two pieces of information that set the scene: stories are powerful, and there is plenty of advice about them." },
      { t: "But", d: "The problem: we rarely have time to apply that advice to our messages." },
      { t: "Therefore", d: "The resolution: we need simpler ways to give messages a story's shape." },
      { t: "Yet", d: "The moment of truth inside the second act — the extra fact that makes the audience agree with the Therefore. Here: the easier something is, the more likely we are to use it." },
    ],
    worked: "When you have ten seconds to prepare, say four lines: the situation (And), the problem (But), the fact that changes their mind (Yet), and what should happen (Therefore). It is a story's skeleton without the story.",
    watch: "A Yet that is just another restatement of the problem. If deleting it changes nothing, the audience has not been given a reason to accept your Therefore.",
    concepts: [],
    checks: [
      { q: "Which act of a story does the 'But' stand for?", opts: ["The setup", "The conflict, or problem", "The resolution", "The moral"], a: 1,
        expl: "And is setup, But is conflict, Therefore is resolution." },
      { q: "What does Webster's added 'Yet' supply?", opts: ["A joke to relax the audience", "A second problem", "The moment of truth that makes the audience accept the resolution", "A summary of the setup"], a: 2,
        expl: "It is the extra piece of information that persuades the audience the Therefore follows." },
      { q: "When is this structure most useful?", opts: ["Only for written reports", "When you must shape a message quickly, with no time for a full story", "When the audience already agrees with you", "For stories longer than ten minutes"], a: 1,
        expl: "She presents it as the fast way to apply story structure on the fly." },
    ],
  },
});

// =====================================================================
// Unit IV — A2, finding stories in an ordinary week (budget 1.5 h with
// the seed's Homework for Life). Matthew Dicks, Philipp Humm, Jennifer
// Aaker, Ira Glass, and two short speaker-coach videos on noticing.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.3.0": {
    module: "A2",
    mechanic: "Homework for Life gets sharper with practice — from about one noticed moment a day to nearly eight — and the bank pays out when you match one of your own small moments to the message you need to land.",
    rules: [
      "The prompt that makes it unavoidable: <em>if my family would only be returned for a story from today, which moment would I tell?</em> Ask it even on days when nothing seemed to happen.",
      "Two columns: the date, and a line or two. Never the whole story — he wants it small, repeatable and practicable.",
      "The lens sharpens: in 2015 he caught 1.3 moments a day, mostly things he did; now 7.8, including things he heard, said or only thought.",
      "Match by adjacency: a contract manager needs a story about being specific; Dicks has twenty — he never lets a restaurant put a pickle on his plate.",
      "Tell your own story, not a borrowed one. A borrowed pickle lands the message but reveals nothing about you, and revealing yourself is what connects.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Pick a message you will need this month (for example 'details matter' or 'ask before you build'). Search your story bank for one small personal moment adjacent to it, and write the two-sentence bridge: the moment, then 'that is how I want us to be about X'." },
    check: "The moment is yours, and it is about something unrelated to work. If it is a work example, it is an illustration, not an adjacent story.",
  },

  "spch100.3.1": {
    module: "A2",
    mechanic: "There are no boring lives, only boring storytellers: the observant notice the small flag the mind raises — frustration, surprise, a laugh — and treat it as a story arriving.",
    rules: [
      "<em>Boring life syndrome</em> is a seductive excuse: the belief that good speakers simply have more interesting lives.",
      "A friend whose life was work, a baby, cafés and cycling had the best stories, because she noticed the queue, the barista, the ride home.",
      "Believing you are a storyteller changes what you see — the shift comes before the stories do.",
      "Watch for the flag: the moment you are frustrated, surprised, or find yourself laughing is your mind telling you to pay attention.",
    ],
    drill: { minutes: 5, artifact: "written",
      do: "Tonight, list every moment today when you felt a flag — annoyed, surprised, amused — however small. Write a few words for each." },
    check: "You have at least three entries from a day you would have called uneventful. If you have none, you were looking for events rather than flags.",
  },

  "spch100.3.2": {
    module: "A2",
    mechanic: "Capture the moment the instant it catches you — a photo into a phone folder called Stories — so that when a talk needs an illustration you scan a bank instead of searching a blank memory.",
    rules: [
      "A suggestion box with no paper, a rental tyre botched with glue, a cooking class on mole: each was a two-second photo of something curious, odd or frustrating.",
      "Keep one folder named <em>Stories</em>. Capturing takes two seconds; deciding what it means can wait.",
      "We are walking story banks who forget to record. 'I don't have a story' is almost never true.",
      "You already tell stories at work — behind a product, a campaign, a personal brand in an interview — so the bank is a business tool.",
    ],
    drill: { minutes: 5, artifact: "written",
      do: "Create a photo album called Stories now. Scroll back through the last two weeks of your camera roll and move every photo that has a story behind it into the album, with a three-word caption." },
    check: "The album has at least five photos, and for each you can say in one sentence why it caught you. Photos you cannot explain are just photos.",
  },

  "spch100.3.3": {
    module: "A2",
    mechanic: "Mine the past with a grid — first, last, best, worst across the top, prompts like gift, car, teacher, holiday down the side — and note a few words per cell, deciding later which are stories.",
    rules: [
      "Homework for Life trains you to spot future moments; First-Last-Best-Worst digs out the ones already behind you.",
      "Columns: first, last, best, worst. Rows: any category that can trigger a memory — gift, car, teacher, pet, holiday.",
      "Write one or two words per memory, never the story. Getting it all down comes first.",
      "Afterwards, scan the table for the cells that make you think <em>that could be a story</em>; roughly half are new ideas.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Draw a 4 x 5 grid: first, last, best, worst across; job, client, teacher, trip and money down. Fill as many cells as you can in eight minutes, two words each, then star the two you most want to tell." },
    check: "At least twelve cells are filled and one starred cell is a memory you had not thought about this year. If every cell is a well-worn story, you were choosing rather than remembering.",
  },

  "spch100.3.4": {
    module: "A2",
    mechanic: "Signature stories can be made as well as found: carve out an area of cheerful incompetence, brand ordinary outings as special, seek the highs and lows, and bank what happens in six words.",
    rules: [
      "<strong>Carve out clear areas of incompetence.</strong> Her father cannot take a photo; her husband needs a protocol for the bins. The incompetence is a story generator — and saves work.",
      "<strong>Be sneaky, then brand it.</strong> Her father renamed outings he wanted as <em>special days</em>; the branded days are the ones the children remember.",
      "<strong>Seek highs and lows.</strong> Signature stories are not winning, winning, winning. The miserable Disneyland day became the best holiday-card story.",
      "People remember the peak and the end, so design for the memory rather than the experience.",
      "<strong>Bank them, even six words long.</strong> At dinner, ask 'what was the story of today?' rather than 'what did you do?'",
    ],
    drill: { minutes: 5, artifact: "written",
      do: "Write six-word stories for three moments of the past month: one high, one low, one in an area you are cheerfully bad at." },
    check: "Read each to someone; at least one gets a 'wait — what happened?' A six-word story that needs no follow-up is a summary.",
  },

  "spch100.3.5": {
    module: "A2",
    mechanic: "Most good stories are small, and you get them by living for them — saying yes to fear, banking them, and telling a tiny true one every time someone asks how you are — then telling them zoomed in, with real dialogue.",
    rules: [
      "Share the rock bottom: success impresses people, struggle changes them. And start as close to the challenge as you can.",
      "Zoom in from the helicopter: picture the moment and ask where am I, what am I doing, thinking, feeling, hearing.",
      "Quote people. 'My boss said I should prepare more' is a summary; his exact words start a film in the listener's head. Do the same with your inner voice.",
      "Say yes to fear — the awkward call, the workshop in a language you have half forgotten. Every yes is a future story.",
      "Make life the arena: when someone asks 'how are you?', answer with a ten-second true story instead of 'busy'. Keep a story bank with title, lesson and summary.",
    ],
    drill: { minutes: 10, artifact: "spoken",
      do: "Prepare a ten-second true answer to 'how are you?' from today, with one quoted line in it. Use it on the next three people who ask." },
    check: "At least one person asks a follow-up question. If all three just nod, the answer was a status report, not a story.",
  },

  "spch100.3.6": {
    module: "A2",
    mechanic: "Finding a decent story takes as much time as producing it, most of what you try should be killed, and the only way to get lucky is a schedule that puts enough material through your hands.",
    rules: [
      "The real work is not shooting and editing; finding the decent story often takes longer than making it.",
      "His team spends more than half of every week just looking for stories and trying them, and kills between a third and a half of what it tries.",
      "Kill without regret. If the feeling you had is not in the footage, killing it lets something better live.",
      "Everything you record is trying to be bad — unstructured, pointless, boring — so be ruthless at every stage.",
      "Get lucky on purpose: put yourself on a schedule so that once a month the great one turns up.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Go through the last two weeks of your story bank and mark each entry keep or kill, using one test: would I tell this to a stranger at dinner? Kill at least a third." },
    check: "At least a third are marked kill and you feel slightly bad about one of them. If you kept everything, you were not choosing.",
  },

  "spch100.3.7": {
    module: "A2",
    mechanic: "For the first years your taste is better than your work, which is why most people quit; the only way through the gap is a large volume of work on a deadline.",
    rules: [
      "You got into this because you have good taste, so you can tell your early work disappoints you.",
      "Nearly everyone who does interesting creative work went through years of that gap. It is normal.",
      "Close it with volume: put yourself on a deadline — one finished story a week or a month — ideally with someone waiting for it.",
      "Even eight years in, his own radio work was ill-conceived and over-emphasised. Talk the way people normally talk; do not underline every third word.",
    ],
    drill: { minutes: 5, artifact: "written",
      do: "Set your deadline in writing: one recorded story every Friday for the next eight weeks, and name the person who will receive it. Send them the first message now." },
    check: "Someone other than you knows the deadline exists. A deadline only you know about is a wish.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.3.0": {
    takeaway: "Dicks revisits Homework for Life: the daily note gets sharper with practice, and the bank pays off when you need a story for a message — you match a small personal moment to it by adjacency instead of borrowing someone else's.",
    beats: [
      { t: "The person with the most stories wins", d: "The best storytellers have the most stories to choose from. He started Homework for Life because he was running out." },
      { t: "The kidnapping prompt", d: "If his family would only be returned for a story about today, which moment would he tell? Two columns: the date, and a line or two." },
      { t: "The lens sharpens", d: "In 2015 he noticed 1.3 moments a day, mostly things he did. Last year it was 7.8 — including things heard, said or only thought — because the lens got sharper, not his life." },
      { t: "Why time flies", d: "Most people remember perhaps fifty days of a year with any clarity. A daily record turns a year back into 365 days." },
      { t: "Matching by adjacency", d: "A contract manager wanted his team to be more specific. Dicks hates pickles and always tells servers not to put one on the plate — a story about being specific." },
      { t: "Don't borrow", d: "The manager wanted to use the pickle story himself. It would land the message but reveal nothing about him, and revealing yourself is what makes people connect." },
    ],
    worked: "Write the message you need ('be specific', 'ask before you build'). Scan your bank for a small personal moment where you behaved that way about something unrelated. Tell the moment, then bridge: 'that is how I want us to be about X.'",
    watch: "Borrowing a good story from someone else. It may land, but it costs you the thing a story is for: the audience learning something true about the person in front of them.",
    concepts: [],
    checks: [
      { q: "How many moments a day was Dicks noticing in 2015, compared with recently?", opts: ["About 1.3 then, about 7.8 now", "About 5 then, about 5 now", "About 10 then, about 3 now", "One a week then, one a day now"], a: 0,
        expl: "His life did not get more interesting; the lens got sharper, and he now counts things heard, said or thought." },
      { q: "What does matching a story 'by adjacency' mean?", opts: ["Telling stories in the order they happened", "Choosing a story about the same industry", "Using a small personal moment that mirrors the message, like pickles for specificity", "Telling two stories side by side"], a: 2,
        expl: "The pickle story is about restaurants, not contracts, but it carries exactly the behaviour he wants." },
      { q: "Why shouldn't the manager simply use Dicks's pickle story?", opts: ["It is copyrighted", "It is too long", "It reveals nothing about the manager himself, which is where a story's power comes from", "His team would not find it funny"], a: 2,
        expl: "The more we reveal about ourselves, the more connected the audience gets." },
    ],
  },

  "spch100.3.1": {
    takeaway: "No life is too boring for stories; the difference is noticing. The observant teller treats the mind's small flags — frustration, surprise, laughter — as stories arriving.",
    beats: [
      { t: "Boring life syndrome", d: "The comforting belief that great speakers simply have more interesting lives. It is an excuse." },
      { t: "No boring stories, only boring storytellers", d: "A rough truth, and an important one." },
      { t: "The friend with the ordinary life", d: "Work, a baby, cafés, the daycare, cycling home — and always a story about the coffee queue or the barista, because she was observant." },
      { t: "Believe you are a storyteller", d: "Deciding that you are one is what changes what you see." },
      { t: "The flag", d: "When you are frustrated, surprised or laughing, your mind raises a flag that says pay attention. Most of the time we let those moments fly past." },
    ],
    worked: "At the end of a day, list the moments your mind raised a flag — irritation, surprise, a laugh — however trivial. Those, not the day's events, are your raw material.",
    watch: "Looking for events. The observant friend's days held no events at all; what she had was a habit of noticing.",
    concepts: [],
    checks: [
      { q: "What is 'boring life syndrome'?", opts: ["Being bored at work", "The belief that good speakers just have more interesting lives", "A fear of public speaking", "Telling the same story twice"], a: 1,
        expl: "It is seductive because it excuses us from noticing our own material." },
      { q: "Which of these is the 'flag' the speaker describes?", opts: ["A sudden moment of frustration, surprise or laughter", "A notification on your phone", "A deadline", "A compliment from your boss"], a: 0,
        expl: "Those reactions are the mind saying: pay attention, something happened here." },
      { q: "Why did the friend with an ordinary life have so many stories?", opts: ["She travelled a lot", "She was a professional writer", "She was observant and saw the world as a storyteller", "She exaggerated"], a: 2,
        expl: "Her life was not extraordinary; her noticing was." },
    ],
  },

  "spch100.3.2": {
    takeaway: "A speaker's simplest capture habit: when something strikes you as curious, odd or frustrating, take a photo into a folder called Stories. When a talk needs an illustration, scan the folder.",
    beats: [
      { t: "Three photos, no point", d: "A hotel suggestion box with no paper or pens, a rental car tyre botched with glue and four and a half hours stranded, a cooking class on mole with up to a hundred ingredients." },
      { t: "The point is the habit", d: "Each was a moment that sparked curiosity or frustration, and each took two seconds to capture." },
      { t: "The Stories folder", d: "When preparing a talk or a video and the point needs an illustration, scan the folder of hundreds of moments." },
      { t: "Walking story banks", d: "We all have thousands of stories; we just forget to record them. 'I don't have a story' is not believable." },
      { t: "Business runs on stories", d: "Presentations, interviews and pitches all tell a story about a product, a person or an idea." },
    ],
    worked: "Make the capture smaller than the decision: photograph first, decide later. When preparing anything, open the folder before you open a blank page.",
    watch: "Trying to remember the moment instead of recording it. The flat tyre feels unforgettable for a week and is gone in a month.",
    concepts: [],
    checks: [
      { q: "What should go into the Stories folder?", opts: ["Only photos of important events", "Anything that piques your curiosity, interest or frustration", "Photos of your audience", "Slides from talks you liked"], a: 1,
        expl: "The test is that it caught your attention, not that it was important." },
      { q: "When is the folder used?", opts: ["When preparing a talk or video and a point needs a story", "Only at the end of each year", "To post directly to social media", "Never; capturing is the point"], a: 0,
        expl: "It replaces searching a blank memory under pressure." },
      { q: "Why does the speaker not believe clients who say they have no stories?", opts: ["Everyone has been on holiday", "Clients exaggerate", "We all have thousands of stories and simply fail to record them", "Stories can be invented"], a: 2,
        expl: "We are walking story banks that forget to keep a record." },
    ],
  },

  "spch100.3.3": {
    takeaway: "Two exercises for an empty story bank: Homework for Life to catch new moments as they happen, and First-Last-Best-Worst to dig old ones out of the past.",
    beats: [
      { t: "Homework for Life, briefly", d: "Every day ask which moment you would tell a story about; write the date, the moment, and optionally a lesson. Early entries feel trivial — that is normal." },
      { t: "What it gives you", d: "A pool of stories, more mindfulness as you walk around, and patterns: you start to see what triggers you and how you react." },
      { t: "The grid", d: "Across the top: first, last, best, worst. Down the side: prompts such as gift, car, teacher, pet, holiday." },
      { t: "One or two words per cell", d: "Do not write stories yet; just get the memories down." },
      { t: "Then choose", d: "Scan the table for the memories that make you think 'that could be a story' — roughly half will be new ideas." },
    ],
    worked: "Fill the grid fast, without judging, in one sitting. Then star two cells and run each through the five-second-moment test: what changed in me?",
    watch: "Writing full stories into the grid. It slows you down, you fill four cells instead of twenty, and the best memories surface late.",
    concepts: [],
    checks: [
      { q: "What are the four column headings of the grid?", opts: ["Who, what, where, when", "First, last, best, worst", "Past, present, future, never", "Happy, sad, angry, afraid"], a: 1,
        expl: "Each prompt — gift, car, teacher — is asked four ways." },
      { q: "How much should you write in each cell?", opts: ["A full paragraph", "Only a date", "One or two words to remember the memory", "Nothing until you have a lesson"], a: 2,
        expl: "Speed matters; developing the story comes later." },
      { q: "How do the two exercises differ?", opts: ["Homework for Life catches new moments; the grid digs out past ones", "They are the same exercise", "The grid is for business stories only", "Homework for Life is weekly"], a: 0,
        expl: "One trains your eye forward, the other mines your memory." },
    ],
  },

  "spch100.3.4": {
    takeaway: "Aaker's family rules for creating signature stories, not just finding them: carve out areas of incompetence, be sneaky and brand ordinary days as special, seek highs and lows, and bank the results — six words is enough.",
    beats: [
      { t: "Carve out areas of incompetence", d: "Her father cannot take a photograph; her husband needs a full protocol before he can take the bins out. Cheerful incompetence generates stories — and spares you the job." },
      { t: "Be sneaky, then brand it", d: "Her father took the children on outings he wanted and called them special days. Those are the ones they remember." },
      { t: "Seek highs and lows", d: "Signature stories are not winning after winning. They need an arc — like James Bond or Jurassic Park." },
      { t: "Disneyland, the worst day", d: "Long queues, a dead phone, an au pair with heatstroke. Written up honestly in the holiday card, it became the best story — and people remember the peak and the end." },
      { t: "Bank them, briefly", d: "Six-word stories ('Married the wrong girl. Fixed it.'). Ask 'what was the story of today?' instead of 'what did you do today?'" },
    ],
    worked: "When a day goes badly, decide while it is happening that it will be a story: notice the details, take the photo of the unhappy moment, and write the six words that night.",
    watch: "Only banking wins. A collection of successes has no arc, and nobody asks to hear it twice.",
    concepts: [],
    checks: [
      { q: "Why carve out an area of incompetence?", opts: ["To avoid responsibility at work", "It generates stories and spares you a task", "To seem humble in interviews", "Because experts are boring"], a: 1,
        expl: "Her father's photography and her husband's bins are both stories and both chores avoided." },
      { q: "What did her father do with outings the children did not want?", opts: ["Cancelled them", "Paid them to come", "Branded them as special days, which made them memorable", "Went alone"], a: 2,
        expl: "Anticipating something as special made it remembered as special." },
      { q: "Why was the bad Disneyland day worth recording?", opts: ["A signature story needs highs and lows, and people remember the peak and the end", "It was free", "The tickets were expensive", "It made the children laugh at the time"], a: 0,
        expl: "Designing for memories rather than experiences is what creates a life of stories." },
    ],
  },

  "spch100.3.5": {
    takeaway: "Philipp Humm's twelve lessons fall into two groups: how to get more stories (say yes to fear, find magic in the mundane, use 'how are you?' as practice, keep a bank) and how to tell them (start near the challenge, zoom in, quote the dialogue and your inner voice, give the why, show the change).",
    beats: [
      { t: "Share the rock bottom", d: "Dan Martell skipped his teenage years of drugs and crime because they made him emotional. Success impresses people; struggle changes them." },
      { t: "Start at the challenge", d: "A workshop participant spent 93 seconds on job title and background before his story began, and lost the room." },
      { t: "Zoom in", d: "Not the helicopter shot ('I faced a big challenge') but the trench: where am I, what am I doing, thinking, feeling, hearing?" },
      { t: "Quote it", d: "Outer dialogue ('Phillip, what the hell was that?') and inner dialogue ('how am I going to turn this around?') make the story play like a film." },
      { t: "The why and the change", d: "Beginners give events, amateurs give the goal, pros give the reason it mattered. Memorable stories show a moment of change." },
      { t: "Get more stories", d: "Say yes to what scares you; find magic in the mundane with Homework for Life; answer 'how are you?' with a tiny true story; keep a story bank." },
    ],
    worked: "Before telling a moment, close your eyes and answer the five zoom questions aloud. Use one sensory detail, one quoted line, and one line of inner voice. Cut the background.",
    watch: "Staying in the helicopter: 'it was a stressful period at work'. Nothing is visible, so nothing is felt.",
    concepts: [],
    checks: [
      { q: "What does 'zooming in' mean in Humm's war-film image?", opts: ["Describing the whole battlefield", "Dropping into one specific scene with its sights, sounds and thoughts", "Using a camera", "Telling the story faster"], a: 1,
        expl: "Ask where am I, what am I doing, thinking, feeling and hearing." },
      { q: "According to Humm, what separates a pro storyteller from an amateur?", opts: ["Longer stories", "More jokes", "Sharing why the goal mattered, not just what the goal was", "Better slides"], a: 2,
        expl: "The what gives information; the why gives emotion." },
      { q: "What does he suggest doing when someone asks 'how are you?'", opts: ["Tell a tiny, true story from your day", "Say 'busy'", "Ask them first", "Change the subject"], a: 0,
        expl: "Make your life the arena: every small exchange is practice." },
    ],
  },

  "spch100.3.6": {
    takeaway: "Ira Glass on the part nobody tells you: finding a decent story takes as long as producing it, a good team kills a third to a half of what it tries, and luck comes from putting enough material through your hands.",
    beats: [
      { t: "Finding is the work", d: "We imagine the real work is shooting and editing; often finding the decent story takes longer than making it." },
      { t: "Half the week is looking", d: "His staff do nothing but look for stories and try them, and kill between a third and a half of everything they try." },
      { t: "Enjoy the killing", d: "When the feeling you had is not in the tape, kill it. Killing it makes room for something better." },
      { t: "Everything is trying to be crap", d: "Like entropy: anything you record drifts toward pointless, digressive and boring unless you prop it up aggressively at every stage." },
      { t: "Get lucky on a schedule", d: "Do enough interviews every week that once a month you stumble on something so good it pays for the other weeks." },
    ],
    worked: "Treat your story bank as a pipeline, not a vault: try stories out loud on friends, keep the ones that land, and cut the rest without arguing with yourself.",
    watch: "Keeping a story because you loved the moment, even though it falls flat every time you tell it. The feeling you had is not automatically in the telling.",
    concepts: [],
    checks: [
      { q: "Roughly what share of the stories his team tries end up killed?", opts: ["Almost none", "Between a third and a half", "About 90 per cent", "Exactly one in ten"], a: 1,
        expl: "And he describes the team as among the best at the job." },
      { q: "What does he mean by 'all production is trying to be crap'?", opts: ["Equipment is unreliable", "Interviewees lie", "Material naturally drifts toward pointless and boring unless you fight it at every stage", "Audiences are hard to please"], a: 2,
        expl: "He compares it to entropy." },
      { q: "How do you put yourself in a position to get lucky?", opts: ["Do enough material on a schedule that a great story turns up every month or so", "Wait for inspiration", "Only tell big stories", "Copy successful stories"], a: 0,
        expl: "Volume on a schedule is what produces the rare great one." },
    ],
  },

  "spch100.3.7": {
    takeaway: "Ira Glass's best-known advice: for years your taste will be better than your work, which is why most people quit — and the only way to close the gap is a large volume of work on a deadline.",
    beats: [
      { t: "Taste got you in", d: "You want to make things because you love them, so your taste is good from the start." },
      { t: "The gap", d: "For the first couple of years what you make is not that good, and your taste is good enough to tell. Many people quit there." },
      { t: "Everyone goes through it", d: "Nearly everyone he knows who does interesting creative work spent years in that phase. It is normal." },
      { t: "Volume on a deadline", d: "Finish one story every week or month, ideally with someone expecting it. Only volume closes the gap." },
      { t: "Year eight", d: "He plays a clip of himself eight years in: ill-conceived writing, every third word stressed. Talk the way people normally talk." },
    ],
    worked: "Set a weekly deadline with an external witness — someone who expects the recording on Friday — and keep it even when the piece disappoints you.",
    watch: "Waiting until the work matches your taste before you put it out. The work only catches up through the volume you are postponing.",
    concepts: [],
    checks: [
      { q: "What is 'the gap' Glass describes?", opts: ["The time between projects", "The distance between your good taste and your not-yet-good work", "A pause before a punchline", "The gap in a market"], a: 1,
        expl: "You can see your work disappoints you precisely because your taste is good." },
      { q: "What does he say closes the gap?", opts: ["A better microphone", "Waiting for inspiration", "Studying theory", "A large volume of work on a deadline"], a: 3,
        expl: "Ideally with someone waiting for the work, even if they do not pay you." },
      { q: "What delivery fault does he point out in his own year-eight tape?", opts: ["Stressing every third word instead of talking the way people normally talk", "Speaking too fast", "Too many pauses", "Using notes"], a: 0,
        expl: "Underlining every third word for emphasis sounds unnatural." },
    ],
  },
});

// =====================================================================
// Unit V — A3, delivery: voice, body, pauses, nerves (budget 5.0 h with
// the seed's professional-voice lesson). Julian Treasure, Vinh Giang, a
// coach on three levels of speaker, Roger Love, Rebecca Martin, Alex Lyon, Matt Abrahams, and
// Patrick Winston's MIT lecture. The coaches disagree in one place — how
// a sentence should end in pitch — and the summaries say so rather than
// picking a winner.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.4.0": {
    module: "A3",
    mechanic: "The voice is a toolbox most people never open — register, timbre, prosody, pace, pitch and volume — and what you say only lands if you stand on honesty, authenticity, integrity and love while you say it.",
    rules: [
      "Seven habits make people stop listening: gossip, judging, negativity, complaining, excuses, exaggeration that becomes lying, and dogmatism — opinions delivered as facts.",
      "Speak from the chest when you want weight. Treasure says we hear depth as authority, and most people speak from the throat by default.",
      "Prosody is the sing-song that carries meaning. One note is monotone; ending every statement as if it were a question is the other trap.",
      "Use the extremes on purpose: go fast for excitement, slow to emphasise, and remember that silence is allowed. Get quiet to make people lean in.",
      "Warm up before anything important. His routine: sigh out with arms up, lip buzz, tongue la-la, a rolled R, and the siren from high to low.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Do Treasure's warm-up once: sigh, lips, tongue, rolled R, siren. Then record one sentence from your story bank three ways: from the throat, from the chest, and with one deliberate two-second silence before the key word." },
    check: "Play the three takes back to back. You can hear the chest take sit lower than the throat take, and the silence in the third take is a full two seconds, not a hesitation.",
  },

  "spch100.4.1": {
    module: "A3",
    mechanic: "Speaking is a set of behaviours, not a fixed voice, and five dials do most of the work: rate, volume, pitch as melody, tonality as the emotion under the words, and the pause.",
    rules: [
      "Vary the rate. Fast shows passion; slowing down makes even an ordinary line sound weighty. A steady rate is what bores people.",
      "Most people speak at about a three out of ten for volume, and a five feels too loud to them. Giang says the missing two points cost them authority.",
      "A song is about as long as a page of a book, yet you remember the song. Melody makes speech memorable, and most people use only two notes.",
      "Your face sets your tone. A neutral face gives a neutral voice, so a monotone voice usually comes from a monotone body.",
      "Fixes from his live coaching: do not start with <em>so</em>, end sentences lower in pitch, pause after the strong line, and hold eye contact with the lens.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Answer 'what do you do?' to camera in about sixty seconds. Record it again with one change per dial: one fast stretch and one slow one, volume up to a five, a wider pitch range, a face that matches the content, and a long pause after your best line." },
    check: "In the second take you can point to each of the five changes by timestamp. If you cannot find one, that dial did not move.",
  },

  "spch100.4.2": {
    module: "A3",
    mechanic: "The voice you have is one you imitated as a child, not one you were born with, and you can rebuild it: add melody so volume does not sound like anger, stop dropping the pitch at every comma and full stop, and breathe through your nose.",
    rules: [
      "Love says over 85 per cent of people speak on one or two notes. Add enough melody that you sound as if you are singing to someone.",
      "Volume on one note sounds angry. Volume with melody, going up and down, sounds happy.",
      "School taught us to drop the pitch at every comma and full stop. Love calls this the descending scale and says it makes speakers sound sad, so try lifting instead.",
      "Recording your voicemail shows you how you sound to other people, and most people settle on a bad take after twenty minutes. Record yourself until you are not settling.",
      "Breathe in through the nose at commas and full stops. Love says mouth breathing dries the voice out, and nose breathing lets it last all day.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Record a twenty-second voicemail greeting three times: one note, then louder on one note, then louder with melody and with the ends of sentences lifting instead of falling. Close your lips and breathe through your nose at every full stop." },
    check: "On playback, the second take sounds harder than the first and the third sounds warmer than both. If the third still drops at the full stops, record it again.",
  },

  "spch100.4.3": {
    module: "A3",
    mechanic: "A pause shows that you are secure enough to take up the room's time, and the reliable way to make one is to tie it to a breath: speak the point on the out-breath, and the in-breath is the pause.",
    rules: [
      "Rushing reads as junior status. A pause says that what you have to say is worth waiting for.",
      "Do not just stop talking. Breathe in, speak at the top of the breath, finish the thought as the breath runs out, then take the next breath — that is the pause.",
      "Pause at the very start: three breaths and eye contact with three people before the first word. In practice it will come out at about one and a half breaths.",
      "Pause just before or just after your main message, and stay with the audience during it. Keep breathing and check silently whether it landed.",
      "Build transition pauses into your outline. Moving, looking at your notes or taking a sip of water all count, and audiences forgive them.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Read a short article aloud using Martin's method: breathe in at every full stop, speak on the out-breath, and let the next breath be the pause. Then record your opening line with three breaths and three imagined faces before it." },
    check: "The pauses fall at the full stops and not in the middle of sentences. Before the opening line there are at least two seconds of silence, and the line does not start with 'um'.",
  },

  "spch100.4.4": {
    module: "A3",
    mechanic: "You can look confident while feeling anxious by doing five things together: one thought per look, an occasional smile, a planted stance, gestures from a home base, and a pause with a nod after key ideas.",
    rules: [
      "Look at people about 90 per cent of the time, three to five seconds each: one thought, one look. Scanning the room, looking over heads and sticking to friendly faces all fail.",
      "Smile now and then. A stone face looks anxious, and a smile makes eye contact feel warm instead of piercing.",
      "Plant your feet: shoulder-width apart, weight on the balls of your feet, knees soft. Walking with a purpose is fine; pacing is not.",
      "Rest your hands loosely together at waist height, as if holding a can, and gesture about once a sentence. No pockets, no pen, no crossed arms.",
      "Pause for about a second after most sentences and two after key ideas. Lyon says a small nod in the long pauses gets the audience nodding with you.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Prop up your phone, stand in the ready position, and deliver ninety seconds of any story to three objects placed around the room, one thought per object, with your hands starting from home base each time." },
    check: "Watch it with the sound off. Your feet do not move unless you are walking with a purpose, your eyes change target at sentence breaks, and your hands go back to home base between gestures.",
  },

  "spch100.4.5": {
    module: "A3",
    mechanic: "People hear you as a rookie, a pretty good or a natural communicator depending on how much of your range you use in voice, body and words — and what keeps most people at 'pretty good' is the fear of using the edges.",
    rules: [
      "Rookie signs: flat delivery, vocal fry at the end of the breath, a filler word in every sentence, a body that does nothing, and no structure in the words.",
      "Build self-awareness first. Answer a question on camera for two minutes, get it transcribed, and look for circles, repetition and filler words.",
      "Pretty good speakers have range but play it safe. The coach says the fear of judgment is mostly false, because people are thinking about themselves.",
      "Only move with purpose. A repeated gesture that does not serve the message is non-functional behaviour and should go.",
      "Natural speakers match face and voice, because the audience needs to see the emotion and hear it. They also make the same point with an analogy, a prop or a story.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Record a two-minute unscripted answer to 'why do you want to speak better?' Transcribe it (any free tool) and mark every filler word and every place you circle back. Then say the main point three ways: as an analogy, with a prop you have to hand, and as a thirty-second story." },
    check: "You have a filler-word count, and the story version has a moment and a change — not just the point repeated with feeling.",
  },

  "spch100.4.6": {
    module: "A3",
    mechanic: "Speaking anxiety has symptoms (racing heart, shallow breath, dry mouth) and sources (fear of missing a future goal), and you need to treat both — a long out-breath for the symptoms, the present moment and a structure for the sources.",
    rules: [
      "To calm the symptoms, take slow belly breaths with an out-breath twice as long as the in-breath; two or three are enough. Holding something cold helps if you blush or sweat.",
      "The main source is fear of a bad future outcome, so come back to the present: walk, move, play a song, or count backwards from 100 in sevens.",
      "Remember that you are there to serve the audience. Moving the spotlight off yourself takes the pressure off.",
      "The biggest fear is forgetting, and a map prevents it. Set a goal — what they should know, feel and do — and pick a structure such as what, so what, now what.",
      "For spontaneous speaking, lower your standard to doing what is needed, work out why you were asked, then use the structure. Abrahams's mother's advice: tell the time, don't build the clock.",
    ],
    drill: { minutes: 8, artifact: "spoken",
      do: "Before your next recording or meeting, do three breaths with the out-breath twice as long as the in-breath, then count back from 100 in sevens to 72. Then give a forty-five-second what / so what / now what on something from your week, out loud." },
    check: "You reached 72 without losing count, and the answer has three parts you could label — the now-what is an action, not a summary.",
  },

  "spch100.4.7": {
    module: "A3",
    mechanic: "Speaking well is mostly knowledge and practice, not talent, and Winston's toolkit covers the whole arc: open with what they will know by the end, repeat the idea, fence it off and number the parts, and close by naming your contributions and saluting the audience instead of saying thank you.",
    rules: [
      "Do not open with a joke, because people are still settling in. Open with an empowerment promise: what they will know at the end that they do not know now.",
      "Cycle on the idea, because about a fifth of the room is drifting at any moment. Fence it off from ideas it could be confused with, and use verbal punctuation — numbered parts — so people can get back on.",
      "Slides are for exposing ideas, not teaching them. Too many slides and too many words make the audience read instead of listen, so do not read them aloud and do not hide behind a laser pointer.",
      "To make work memorable, use Winston's star: a symbol, a slogan, a surprise, a salient idea that sticks out, and a story.",
      "End on a contributions slide, and with a final line that is not 'thank you' — a joke, a benediction, or a salute to the audience.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take a talk or story you might give. Write its empowerment promise in one sentence, its five star elements (symbol, slogan, surprise, salient idea, story), and a final line that salutes the audience instead of thanking them." },
    check: "The promise is about what the listener will be able to do, not what you will cover, and the final line could not be swapped for 'thank you' without losing something.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.4.0": {
    takeaway: "Julian Treasure's TED talk in three parts: seven habits that make people stop listening, four foundations that spell HAIL, and a toolbox of register, timbre, prosody, pace, pitch and volume — warmed up before anything important.",
    beats: [
      { t: "Seven deadly sins", d: "Gossip, judging, negativity, complaining, excuses, exaggeration that turns into lying, and dogmatism." },
      { t: "HAIL", d: "Honesty, authenticity, integrity, love. Love tempers honesty, and it is hard to judge someone while wishing them well." },
      { t: "Register and timbre", d: "Nose, throat or chest: depth carries authority. Timbre — rich, smooth, warm — can be trained with breathing, posture and exercises." },
      { t: "Prosody, pace, pitch, volume", d: "Avoid one note and avoid making every statement sound like a question. Use silence. Get quiet to draw people in." },
      { t: "The warm-up", d: "Arms up and sigh, lip buzz, tongue la-la, rolled R, and the siren from high to low." },
    ],
    worked: "Before an interview, do the warm-up in the corridor (the siren if you only have time for one), then say your opening line once from the chest, slowly, with silence before the key word.",
    watch: "Upspeak: making every sentence end like a question. It takes away a prosody tool you need for real questions and makes statements sound unsure.",
    concepts: [],
    checks: [
      { q: "What does HAIL stand for?", opts: ["Humour, anecdote, insight, lesson", "Honesty, authenticity, integrity, love", "Hook, arc, image, landing", "Hear, acknowledge, inquire, lead"], a: 1,
        expl: "Four foundations to stand on so that what you say is welcomed." },
      { q: "Where does Treasure say to speak from when you want weight?", opts: ["The nose", "The throat", "The chest", "The head voice"], a: 2,
        expl: "He links depth to perceived power and authority." },
      { q: "Which warm-up does he say he would keep if he could only do one?", opts: ["The siren, from high 'we' to low 'aw'", "The lip buzz", "The rolled R", "The sigh"], a: 0,
        expl: "He says the pros call it the siren." },
    ],
  },

  "spch100.4.1": {
    takeaway: "Vinh Giang's five foundations — rate, volume, pitch as melody, tonality, and the pause — coached live on a student, then applied to accents, interviews, imitation and nerves. The voice is behaviour, so it can change.",
    beats: [
      { t: "You are not trapped in your voice", d: "Changing your mouth movements and breath changes how you sound. The way you speak is a set of behaviours." },
      { t: "The five dials", d: "Vary the rate. Speak at a five, not a three. Use melody, because a song sticks and a page does not. Let your face carry the emotion. Pause." },
      { t: "Live coaching", d: "A student answers 3-2-1 style, then again with more volume, gestures and a lower pitch at the end of sentences, then with long pauses and no opening 'so'." },
      { t: "Accent", d: "Record twenty improvised minutes, send it to a speech pathologist for pronunciation and to an ESL teacher for grammar, then fix one thing at a time." },
      { t: "Interviews and imitation", d: "Spend 5–10 per cent of the time on connection: answer 'tell me about yourself' with a prepared story. Copy great speakers the way a chef copies recipes, then add your own lemon." },
      { t: "Nerves and range", d: "Burn off adrenaline with a quick walk or push-ups, use breathing, and focus on the audience. When an unused part of your voice feels fake, tell yourself it is only unfamiliar." },
    ],
    worked: "His interview answer: a prepared story (selling MP3 players at 13, and what it taught him about selling the wrong way and the right way), linked to the job, takes about three minutes and builds rapport before the questions start.",
    watch: "Calling an unfamiliar voice 'fake'. It is the same instrument — you have just never used those keys, and calling them fake stops you exploring.",
    concepts: [],
    checks: [
      { q: "Why does Giang compare a song with a page of a book?", opts: ["Songs are shorter", "Both have about the same number of words, but melody makes the song memorable", "Books are harder to read aloud", "Songs repeat their chorus"], a: 1,
        expl: "So speaking with more melody makes what you say stick." },
      { q: "What does he say causes a monotone voice?", opts: ["A cold", "Speaking too fast", "A monotone body — including a neutral face", "Too much volume"], a: 2,
        expl: "Your face controls the emotion under your words." },
      { q: "What is his advice for someone worried about their accent?", opts: ["Record twenty improvised minutes and have a speech pathologist and an ESL teacher review it", "Avoid speaking in meetings", "Copy a native speaker's accent exactly", "Speak more slowly and nothing else"], a: 0,
        expl: "Then work on one thing at a time, so you do not freeze up." },
    ],
  },

  "spch100.4.2": {
    takeaway: "Roger Love, interviewed on MarieTV: the voice you have is one you imitated, monotone and timid volume are learned, the falling pitch at every full stop makes people sound sad, and nose breathing saves the voice.",
    beats: [
      { t: "The voice you imitated", d: "We copied our parents to connect with them. That outdated voice may now be holding you back, and you can build a new one." },
      { t: "Emotion first", d: "He argues that sounds carry the emotion that gets a message remembered, and that great songwriters are storytellers who move you from emotion to emotion in three minutes." },
      { t: "Monotone and volume", d: "Most people use one or two notes. Loud on one note sounds angry; loud with melody sounds happy." },
      { t: "The descending scale", d: "Dropping in pitch at every comma and full stop, as children are taught, sounds sad. He recommends lifting instead." },
      { t: "Characters and breath", d: "You need different voices for work and home. Close your lips and breathe through your nose at the full stops so the voice lasts." },
    ],
    worked: "The voicemail test: record a greeting, listen back, and notice what you settle for. That settled-for voice is the one everyone hears. Keep recording until the melody goes up and down.",
    watch: "The coaches in this unit disagree. Giang tells a student to end sentences lower for authority; Love says lift the ends for warmth; Treasure warns against making every statement sound like a question. Use all three: lift inside the sentence for warmth, land the key claim low, and never end every line on a question.",
    concepts: [],
    checks: [
      { q: "According to Love, why does loud speech sometimes sound angry?", opts: ["Volume always sounds angry", "It is loud and stays on one note — with melody it sounds happy", "The microphone distorts it", "People expect quiet speakers"], a: 1,
        expl: "Volume mixed with melody is heard as energy, not anger." },
      { q: "What is the 'descending scale'?", opts: ["A singing exercise", "Speaking more and more quietly", "Dropping in pitch at every comma and full stop, which he says sounds sad", "Slowing down at the end of a talk"], a: 2,
        expl: "He traces it back to how children are taught to read aloud." },
      { q: "What does he say is the main reason speakers lose their voice?", opts: ["Breathing in through the mouth", "Speaking too loudly", "Not drinking enough tea", "Talking too fast"], a: 0,
        expl: "The nose moistens the air; breathe through it at commas and full stops." },
    ],
  },

  "spch100.4.3": {
    takeaway: "Rebecca Martin on the pause: why it works (time to think, time to process, and a sign of status), how to make it natural (tie it to a breath), and the three places it pays off most (before you start, around your main message, and at transitions).",
    beats: [
      { t: "Why pause", d: "You get time to think, the audience gets time to process, and it shows you think your words are worth waiting for. Rushing comes across as junior." },
      { t: "How", d: "Breathe in, speak at the top of the breath, finish the thought as the breath runs out, then breathe in again. That in-breath is the pause." },
      { t: "Practice", d: "Read an article aloud and take a full breath at every full stop." },
      { t: "Before you start", d: "Three breaths and eye contact with three people. It feels too long; in practice it becomes one and a half breaths, and the room's attention goes up." },
      { t: "Message and transitions", d: "Pause around your key line and stay with the audience while you do. Plan pauses between sections, where moving or a sip of water is fine." },
    ],
    worked: "She delivers a line ('we are only scared of how powerful and beautiful we actually are') and holds the silence, breathing and checking in silently with the audience, before moving on.",
    watch: "A pause in the wrong place — in the middle of a sentence, or after a weak point. A pause makes whatever comes just before it sound important.",
    concepts: [],
    checks: [
      { q: "What does Martin say a natural pause must be tied to?", opts: ["A slide change", "A gesture", "A breath", "A sip of water"], a: 2,
        expl: "When the thought runs out with the breath, the in-breath is the pause." },
      { q: "What does she suggest before the first word of an important talk?", opts: ["Three breaths and eye contact with three people", "A joke", "Thanking the organisers", "Reading the agenda"], a: 0,
        expl: "It settles your nerves and signals that something important is about to happen." },
      { q: "What does rushing through your content tell the audience, according to her?", opts: ["That you are well prepared", "That you are of junior status and do not want to take up their time", "That the material is easy", "That you are excited"], a: 1,
        expl: "Pausing shows you are secure in your role and in the value you bring." },
    ],
  },

  "spch100.4.4": {
    takeaway: "Alex Lyon's five habits that come across as confidence even when you are nervous: eye contact (one thought, one look), an occasional smile, a planted ready position, gestures from a home base, and pauses with a nod.",
    beats: [
      { t: "Eye contact", d: "About 90 per cent of the time, three to five seconds per person, everyone in the room several times. Glance at notes and come straight back." },
      { t: "Smile", d: "A stone face looks like a deer in the headlights. Smiling relaxes you and warms up your eye contact." },
      { t: "Posture", d: "Feet shoulder-width apart, weight forward, knees soft, no swaying. Walk with a purpose, then stop and plant again." },
      { t: "Hands", d: "Home base: hands loosely together at the waist, or relaxed at your sides. A small gesture about once a sentence." },
      { t: "Pause and nod", d: "One second after a sentence, two after a key idea, and a small nod. Audiences tend to nod back." },
    ],
    worked: "Practise 'one thought, one look' out loud: say half a sentence to one person, move your eyes as the next half starts, and repeat until it is automatic.",
    watch: "The advice to look over people's heads. It may calm you, but nobody feels connected, so it does not look confident.",
    concepts: [],
    checks: [
      { q: "How long does Lyon suggest looking at each person?", opts: ["Under a second", "About three to five seconds — one thought, one look", "As long as they look back", "Thirty seconds"], a: 1,
        expl: "Long enough to finish a thought and for them to feel a connection." },
      { q: "What is the 'ready position'?", opts: ["Hands in pockets, weight on heels", "Arms crossed, feet together", "Leaning on the lectern", "Feet shoulder-width apart, weight on the balls of the feet, knees soft"], a: 3,
        expl: "Plant from the waist down; be animated from the waist up." },
      { q: "What does he recommend adding to the longer pauses?", opts: ["A small nod", "A sip of water", "A glance at the slides", "A smile at the floor"], a: 0,
        expl: "It looks confident and audiences tend to nod along." },
    ],
  },

  "spch100.4.5": {
    takeaway: "A communication coach's three levels — rookie, pretty good, natural — assessed on voice, body and words. You move up by first getting self-awareness, then using your full range, and finally having more than one way to make any point.",
    beats: [
      { t: "Rookie", d: "Flat delivery, vocal fry, filler words in every breath, a body that does nothing, no structure. He calls them habits, not who you are." },
      { t: "The self-awareness exercise", d: "Two unscripted minutes on camera, transcribed, so you can see the filler words and the circling." },
      { t: "Pretty good", d: "Range, but kept safe. A small set of gestures used over and over. Repeated, non-functional movement — he uses a speaker who keeps moving as the example." },
      { t: "Frameworks", d: "Structures such as PREP and 3-2-1 filter your thinking so the listener does not have to sort it out." },
      { t: "Natural", d: "All five vocal dials, purposeful body language, a face that matches the voice, and other ways to say the same thing: analogy, prop, story." },
    ],
    worked: "'Read more books' three ways: the analogy (reading is to the mind what exercise is to the body), the prop (a book holds years of someone's work), and the story (his father, after a half-million-dollar loss: every book you read is a soldier in your army).",
    watch: "Moving without a reason. If a movement does not serve the message, it distracts — and small habits like touching your glasses add up.",
    concepts: [],
    checks: [
      { q: "What does the coach say keeps 'pretty good' speakers stuck?", opts: ["They do not know any frameworks", "Fear of judgment stops them using the edges of their range", "Their accent", "Too much volume"], a: 1,
        expl: "And he says the fear is mostly false — people are thinking about themselves." },
      { q: "How does he define non-functional behaviour?", opts: ["Any behaviour that distracts from the message", "Any gesture with both hands", "Standing still", "Using a prop"], a: 0,
        expl: "If it does not serve the message, it should go." },
      { q: "Why does the face matter as much as the voice?", opts: ["Cameras show faces", "Smiling is polite", "If people see the emotion but do not hear it — or hear it but do not see it — they do not feel it", "The face controls volume"], a: 2,
        expl: "Natural speakers match how they look to how they sound." },
    ],
  },

  "spch100.4.6": {
    takeaway: "Matt Abrahams of Stanford on nerves: anxiety has symptoms and sources, and you deal with both. Then the tools that reduce the fear of forgetting — a goal (know, feel, do), a structure (what, so what, now what), and a lower bar for speaking on the spot.",
    beats: [
      { t: "The biology", d: "Fight or flight: faster heart, shallow breath, a thinner voice, sweating, dry mouth. All normal, and all unhelpful when you speak." },
      { t: "Symptoms", d: "Belly breaths with an out-breath twice as long as the in-breath ('the rule of lung'); something cold in your palm if you blush or sweat." },
      { t: "Sources", d: "Fear of a bad future outcome. Get present: move, play music, count back in sevens. And remember you are there to serve the audience." },
      { t: "Structure as a map", d: "It is hard to get lost with a map. Set a goal of what they should know, feel and do, then choose a structure — problem, solution, benefit, or what, so what, now what." },
      { t: "Spontaneous speaking", d: "Reframe, lower your standard to doing what is needed, find out why you were asked, then structure. Feedback, apologies and Q&A all work this way." },
      { t: "Interviews and memorability", d: "Two or three themes, each backed by an example, a figure, and a third-party endorsement. Be concrete, invite people in, and use time-travel language: imagine, picture this, remember when." },
    ],
    worked: "Feedback after a meeting in what / so what / now what: 'You went fast through the implementation plan' / 'so people may think it is not thought through' / 'next time, slow down and add detail.'",
    watch: "Building the clock. When we are unsure, we keep adding to an answer that was already complete. Tell the time.",
    concepts: [],
    checks: [
      { q: "What is Abrahams's 'rule of lung'?", opts: ["Breathe in for twice as long as you breathe out", "Hold your breath before the first line", "Breathe out for twice as long as you breathe in", "Breathe through the mouth"], a: 2,
        expl: "The relaxation response happens on the out-breath." },
      { q: "What does he say is the main source of speaking anxiety?", opts: ["Fear of not reaching a goal — a feared future outcome", "Bright lights", "Low blood sugar", "Large audiences"], a: 0,
        expl: "So the antidote is getting present." },
      { q: "What are the three parts of his communication goal?", opts: ["Hook, body, close", "What the audience should know, feel and do", "Symbol, slogan, surprise", "Who, what, why"], a: 1,
        expl: "Information, emotion, action." },
    ],
  },

  "spch100.4.7": {
    takeaway: "Patrick Winston's MIT lecture: speaking skill is knowledge and practice far more than talent. Start with a promise, cycle and fence your ideas, choose tools by purpose, be remembered through the star, and finish on your contributions and a salute rather than 'thank you'.",
    beats: [
      { t: "Knowledge beats talent", d: "He was a better skier than an Olympic gymnast because he had the knowledge and the practice. Quality depends on knowledge, practice and, much less, talent." },
      { t: "How to start", d: "Not with a joke. With an empowerment promise." },
      { t: "Four heuristics", d: "Cycle three times, because a fifth of the room is drifting. Build a fence around your idea. Number the sections so people can get back on. Ask a question and wait — seven seconds is normal." },
      { t: "Tools", d: "The board for teaching (its speed matches thinking, and it gives your hands a job); props for memory; slides for exposing ideas — few words, no reading aloud, no laser pointer." },
      { t: "Winston's star", d: "Symbol, slogan, surprise, salient idea, story — what made his arch-learning work memorable by accident." },
      { t: "How to stop", d: "Collaborators go on the first slide; contributions go on the last. End with a joke, a benediction, or a salute — not 'thank you for listening'." },
    ],
    worked: "His job-talk shape: within five minutes, a vision (a problem someone cares about plus a new approach) and evidence that you have done something (the steps needed); conclude by listing your contributions to mirror those steps.",
    watch: "'Thank you for listening' as the last words. It implies the audience stayed only out of politeness. Mouth a thank you once the applause starts.",
    concepts: [],
    checks: [
      { q: "Why does Winston advise against opening with a joke?", opts: ["Jokes are unprofessional", "People are still settling in and adjusting to your voice", "Jokes take too long", "MIT audiences do not laugh"], a: 1,
        expl: "A joke works at the end, once people are used to you." },
      { q: "What are the five points of Winston's star?", opts: ["Hook, setup, punch, tag, callback", "Problem, approach, steps, demo, contributions", "Symbol, slogan, surprise, salient idea, story", "Pace, pitch, pause, posture, presence"], a: 2,
        expl: "Each starts with S; together they make work recognisable." },
      { q: "What should the final slide be labelled?", opts: ["Contributions", "Questions?", "Thank you", "Conclusions"], a: 0,
        expl: "It stays up while people ask questions and leave, so it should say what you did." },
    ],
  },
});

// =====================================================================
// Unit VI — A8, speaking as a non-native speaker (budget 4.0 h). Mindset
// (Marianna Pascal, Safwat Saleem), the research on what to fix (Tracey
// Derwing), the native-like view argued against it (Marc Green), rhythm
// and thought groups, shadowing, narrative tenses, presenting in a second
// language (two coaches), and humour across languages. Two lessons
// disagree on purpose — intelligible versus native-like — and the
// summaries set them against each other rather than picking one.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.5.0": {
    module: "A8",
    mechanic: "How well you communicate in a second language depends far more on attitude than on level: speak as if you are playing a game, focused on the other person and the result, not as if you are taking a piano exam scored on mistakes.",
    rules: [
      "School taught English as an art to master, so many adults go into a conversation expecting to be marked on their mistakes. That expectation is what freezes them.",
      "The gamer is terrible and his friends are watching, but he feels no shame because all his attention is on the target. Speak with that focus.",
      "Pascal's pharmacy story: the fluent sales rep, worried about being judged, went round in circles; the counter girl with little English asked two questions and solved the problem.",
      "When you try to be correct and get a result at once, three things go: your listening, your words, and your confidence. Listeners may read the third as doubt about your ability to do the job.",
      "Pascal says 96 per cent of English conversations involve a non-native speaker. It is a tool to get a result, and it belongs to you.",
    ],
    drill: { minutes: 8, artifact: "spoken",
      do: "Explain something from your work or week to someone (or to the camera) for two minutes with one rule: the moment you notice yourself checking your grammar, ask the listener a question instead — 'does that make sense?', 'have you seen this?' Afterwards, write down the result you were trying to get." },
    check: "You asked at least two questions and can name the result in one line. If you cannot name the result, the talk was about getting it right, not about getting it done.",
  },

  "spch100.5.1": {
    module: "A8",
    mechanic: "Research separates intelligibility (how much the listener understands) and comprehensibility (how hard they have to work) from accent, and a heavy accent can still be easy to understand — so fix the features that cost understanding, not every difference.",
    rules: [
      "Intelligibility is how much of what you say the listener actually understands. Comprehensibility is how much effort it takes them.",
      "Most materials take a scattergun approach, drilling every difference from a local accent. Many of those differences never affect understanding.",
      "The 'th' sounds are noticeable but matter little. Derwing says listeners adapt to them almost immediately.",
      "Some sound pairs separate many words (high functional load), like p and b. Mixing those up costs far more understanding than a 'th' substitution.",
      "You want the listener to spend as little effort as possible, so they do not dread talking to you. Some people with strong accents are very easy to understand.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Record a sixty-second story. Play it to someone (or to a speech-to-text tool) and mark only the words they misheard or had to ask about. Ignore everything else. Sort the marked words into: a sound, a stress, or speed." },
    check: "Your list contains only words that actually broke understanding, and each one has a category. If the list is full of 'th' you were marking accent, not intelligibility.",
  },

  "spch100.5.2": {
    module: "A8",
    mechanic: "Marc Green argues the opposite of the last lesson: past fluency, three things make native speakers treat you as one of them — minimal accent, the expressions locals actually use, and their cultural habits — and pronunciation is the one to start with.",
    rules: [
      "Fluency is when the language becomes subconscious. You do not need academic mastery to reach a native-like level; many native speakers do not have it either.",
      "The perfect-sentence technique: read one sentence from a book to a native speaker, get rated (obvious accent, slight, none), hear it read back, repeat — until they cannot hear an accent.",
      "Learn the words people use, not the textbook ones. In French, <em>boulot</em> for work and <em>fric</em> for money.",
      "Adopt the small cultural habits — gestures, the sound you make when you get hurt, how you say 'mm-hmm'. They only come from listening actively.",
      "Copy characters in TV shows and learn song lyrics. Songs tell stories, and their emotion fixes the expressions in your memory.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Pick one sentence from something you will actually say this week. Find a recording of a native speaker saying something similar, then record yourself saying your sentence ten times, comparing after each try. Keep the best and the first take." },
    check: "Played side by side, the best take is clearly different from the first in at least one place you can name: a stress, a vowel, or a link between words.",
  },

  "spch100.5.3": {
    module: "A8",
    mechanic: "Comments about an accent are mostly about what the listener is used to, and 'normal' is only what people have been exposed to — so the way to change it is to keep using your voice.",
    rules: [
      "Saleem stuttered as a child and avoided speaking. He began using his own voice in his animations, edited heavily to sound 'normal'.",
      "Comments about his Pakistani accent ('couldn't follow because of the Indian accent') made him stop using his voice in his work.",
      "His reframe: ancient texts barely name blue, and the theory is that cultures saw a colour only once they could make it. Normal is what is visible around us.",
      "Bias of this kind is mostly favouritism toward people we can relate to, more than a wish to harm.",
      "Keep speaking. Every accent heard on a stage widens what the next audience treats as normal.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write down the worst thing anyone has said about how you speak — word for word. Under it, write two lines: what it says about what that listener was used to, and one place this month where you will speak anyway." },
    check: "The second line names a real place and date. The first line is about the listener's experience, not your worth.",
  },

  "spch100.5.4": {
    module: "A8",
    mechanic: "English rhythm hangs on the content words — the nouns, main verbs and adjectives that carry information — while the function words in between are squeezed together, so a longer sentence can keep the same beat as a short one.",
    rules: [
      "Content words carry the information: the subject, the verb, the object. Function words — <em>the</em>, <em>a</em>, <em>in</em>, <em>will</em> — add a little meaning but not the main information.",
      "Say 'MICE EAT CHEESE', then add function words without changing the beat: 'the MICE will have EATen the CHEESE'.",
      "Push the function words together ('might have been' comes out as 'mitabin') and make the content words the loudest, clearest part.",
      "Practise at home in front of a mirror, not on the bus.",
    ],
    drill: { minutes: 6, artifact: "recorded",
      do: "Write three sentences from a story you tell. Underline the content words. Clap on each underlined word while you say the sentence, and squeeze everything else in between the claps. Record the third sentence without clapping." },
    check: "In the recording, the underlined words are clearly louder and longer than the rest, and the function words sound reduced rather than fully pronounced.",
  },

  "spch100.5.5": {
    module: "A8",
    mechanic: "Speech comes in thought groups — short chunks of words that belong together by meaning, linked smoothly inside and separated by small pauses — and where you put the breaks can change what the sentence means.",
    rules: [
      "'Let's eat, Grandma' and 'Let's eat Grandma' differ only in one pause. Thought groups (also called speech units, tone units or chunks) are what the pauses mark.",
      "Group by meaning: a subject and its verb, or a phrase like <em>in the middle of the night</em>, stay together. Do not split a phrase in the middle.",
      "If a chunk feels too short, you have over-divided; if you run out of breath, you have not divided enough. Aim for one idea per chunk.",
      "To emphasise a word, give it its own short chunk: 'It was — absolutely — incredible.'",
      "Inside a chunk the words link together ('turn it off' sounds like one word). Linking happens within chunks, not across the breaks.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Take a five-sentence paragraph from your story bank and mark the thought-group breaks with a slash. Record it. Then pick the most important word and give it its own chunk in a second recording." },
    check: "No slash splits a phrase, the words inside each chunk run together, and the key word in the second take is set off with a pause on both sides.",
  },

  "spch100.5.6": {
    module: "A8",
    mechanic: "Shadowing works when you understand and study a short clip before you copy it: meaning, dictation, analysis, repeat-after, record-and-compare, shadow with the transcript, shadow blind, read aloud from memory, then talk about the topic yourself.",
    rules: [
      "Choose 30–90 seconds of one clear speaker you would like to sound like. A monologue is easier to start with than a conversation.",
      "Listen for the gist first, then try a dictation. What you cannot write down shows what your ear is missing — linking, reductions, whole phrases.",
      "Study how the speaker says it, not just what it means: stress, tone, rhythm.",
      "Repeat sentence by sentence for accuracy, not speed. Then record yourself and compare with the original — that is usually the first time you really hear yourself.",
      "Shadow with the transcript, then without it, just behind the speaker. Then read it aloud from memory, and finish by speaking freely on the same topic.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Pick a 45-second clip of a speaker you admire. Do steps 2, 5, 6 and 7 today: gist, sentence-by-sentence repeat, one recording, and a written list of three differences between your take and theirs." },
    check: "The three differences are specific — 'I stressed MEET, she stressed PEOPLE' — not 'my accent is worse'.",
  },

  "spch100.5.7": {
    module: "A8",
    mechanic: "Translating in your head slows you down and makes your speech sound like your first language, so build direct routes instead: learn whole phrases, think out loud in the language, and keep sentences short.",
    rules: [
      "Speak, and allow mistakes. It is better to say something wrong than to lose the moment translating; note the correction you get and learn it.",
      "Learn chunks — whole natural phrases like 'my name is' — and imagine where you will use them.",
      "Listen a lot, and listen for the big picture. Translating every word you hear gets you lost.",
      "Talk to yourself in the language while you do chores, about your day or the news. It does not matter if it is wrong.",
      "Keep it short and simple. Trying to build the same complex sentences you would in your first language is what forces translation.",
    ],
    drill: { minutes: 6, artifact: "spoken",
      do: "For five minutes while doing something else (cooking, walking), narrate what you are doing and thinking out loud in English, in sentences of ten words or fewer. Then write down three phrases you wanted and did not have." },
    check: "You kept talking for the full five minutes, and the three missing phrases are written as whole phrases, not single words.",
  },

  "spch100.5.8": {
    module: "A8",
    mechanic: "Good English storytellers move through tenses on purpose: the past perfect sets the background, 'would' sets up routines, the past simple carries the main events, and a switch to the present zooms in on the key moment.",
    rules: [
      "Past perfect (<em>had collapsed</em>) shows what was already true before the story's moment. Without it, listeners lose the order of events.",
      "Past perfect continuous (<em>had been working for years</em>) adds how long something had been going on.",
      "<em>Would</em> describes repeated past habits ('every morning I would…'), then the past simple breaks the routine ('one day the doorbell rang').",
      "The historical present ('so he walks in, and she opens the door') pulls the listener into the scene, like a camera zooming in.",
      "Listen for these switches in podcasts and in colleagues' stories before trying to use them all.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Retell a story-bank moment in about ninety seconds using all four: one past-perfect background line, two 'would' routine lines, the event in the past simple, and the five-second moment itself in the present tense." },
    check: "You can point to the exact line where you switch into the present, and it is the moment of change — not the setup.",
  },

  "spch100.5.9": {
    module: "A8",
    mechanic: "Presenting well in your first language does not carry over automatically, so prepare differently: rebuild instead of translating the slides, time a full run, write bullet points as sentences you can say, memorise only the opening and closing lines, and work on your inner state.",
    rules: [
      "Do not translate your slides. Rebuild the structure for how this audience thinks, with fewer words, so they listen to you rather than read.",
      "You only become spontaneous after enough rehearsal. Charisma you have in your first language is not automatic in the second.",
      "Time a full run. Most people have no sense of how long an idea takes to explain in English and are surprised by the clock.",
      "Do not memorise the whole talk. Memorise the first two and last two sentences, and write each bullet point as a full sentence you can actually say, like the first line of a paragraph.",
      "Write down your one big idea as an answer, not a title: 'we have found a way to double sales next quarter', not 'how to increase sales'.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "For a talk or meeting update you could give, write: the two opening sentences, the two closing sentences, five bullet points as full speakable sentences, and the one big idea as a claim. Then time yourself saying it once." },
    check: "Every bullet has a verb, the big idea is a statement and not a question, and you have a real time in minutes written down.",
  },

  "spch100.5.10": {
    module: "A8",
    mechanic: "Three shifts for presenting in a second language at work: think of it as sharing with specific people rather than presenting, give the bottom line first instead of over-explaining, and practise until you sound human rather than perfect.",
    rules: [
      "'Presenting' puts the focus on you; 'sharing' puts it on who is in the chairs and what they need. Preparation becomes less memorising and more connection.",
      "Over-explaining often comes from a culture where the journey comes before the destination, or from trying to prove your English. American audiences, she says, want the point first.",
      "If the whole thing could be an email, it does not need a meeting. Add what only you can add — what the numbers mean and what action follows.",
      "Perfect pronunciation in a monotone puts people to sleep. Master the high-frequency words of your job, then work on rhythm and intonation.",
      "Practise in the position you will present in, picture one person who needs what you have, record yourself, and work on one thing a week.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Take a recent update you gave or will give. Record it once as you would normally say it. Then record it again starting with the bottom line in one sentence, followed by at most three supporting points and the action you need." },
    check: "The second take is shorter, its first sentence could be the subject line of an email, and it ends with a request, not a summary.",
  },

  "spch100.5.11": {
    module: "A8",
    mechanic: "Humour does not translate word for word — puns and local references stay behind — but jokes built on shared human experience can travel, and you build them in a new language by testing them in conversation with a tutor who corrects you.",
    rules: [
      "Puns rarely survive translation; the Spanish cow-and-holiday pun means nothing in English. Do not start with wordplay.",
      "Much humour rests on shared cultural context. Local jokes get local laughs.",
      "Gad Elmaleh had to rebuild his French act for American audiences. Eddie Izzard writes from universal material, starts in English, and adds the new language a few minutes at a time.",
      "Izzard's method: sit with a conversation tutor for hours and go through the act you have been improvising, getting corrections and better words.",
      "Delivery is part of the joke: stress, intonation and timing. Being funny by accident comes before being funny on purpose.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Take a funny moment from your story bank. Write it in two versions: one that depends on a pun or a reference only your culture would get, and one that depends only on what happened and how people reacted. Tell the second version to someone from a different background." },
    check: "The second version works with no explanation; if you had to explain anything, that part goes.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.5.0": {
    takeaway: "Marianna Pascal, after twenty years training Southeast Asian professionals: how well someone communicates in English has little to do with their level and a lot to do with their attitude. Speak it like a computer game — focused on the target — not like a piano exam where you are marked on mistakes.",
    beats: [
      { t: "Faizal", d: "A factory supervisor with very low English who listened calmly and said exactly what he meant." },
      { t: "The piano exam", d: "Her daughter dreaded piano because success meant few mistakes. Many learners bring the same dread to English." },
      { t: "The gamer", d: "In a cybercafe, a bad player watched by friends shows no embarrassment — all his attention is on the bad guys." },
      { t: "The pharmacy", d: "The fluent sales rep panics and talks in circles; the counter girl asks 'heart okay or not? brain okay or not?' and solves it." },
      { t: "Whose English", d: "For every native speaker there are five non-native speakers. English is a tool to get a result, not an art to master." },
      { t: "The shutdown", d: "Trying to be correct and effective at the same time costs you your listening, your words, and your apparent confidence." },
    ],
    worked: "The engineers' barbecue: 'the hot dog contains the cheese' fails three times; a Japanese engineer says 'cheese… integrator!' and everyone understands. That is real English working.",
    watch: "Mistaking fluency for effectiveness. The sales rep had more English and got a worse result, because her attention was on herself.",
    concepts: [],
    checks: [
      { q: "What does Pascal say how well people communicate in English mostly depends on?", opts: ["Their vocabulary size", "Their attitude towards English", "Their accent", "How long they studied"], a: 1,
        expl: "Faizal had a very low level and communicated beautifully." },
      { q: "What is the 'one thing' she recommends?", opts: ["Learn ten new words a day", "Avoid speaking until you are fluent", "Focus on the other person and the result you want, not on yourself", "Watch films without subtitles"], a: 2,
        expl: "Like the gamer focused on the target." },
      { q: "Which three things does she say shut down when you try to be correct under pressure?", opts: ["Listening, speaking, and confidence", "Memory, vision, and hearing", "Grammar, spelling, and accent", "Pace, pitch, and volume"], a: 0,
        expl: "And listeners may mistake the third for a lack of ability." },
    ],
  },

  "spch100.5.1": {
    takeaway: "Tracey Derwing, co-author of a research book on pronunciation teaching: focus on intelligibility (how much is understood) and comprehensibility (how easy it is), not on removing every trace of accent — some very noticeable features hardly matter, and some quiet ones matter a lot.",
    beats: [
      { t: "Two measures", d: "Intelligibility is how much the listener understands; comprehensibility is how much effort it costs them." },
      { t: "The scattergun", d: "Many materials drill every difference from the local accent, but many differences never affect understanding." },
      { t: "The 'th' example", d: "Very noticeable, rarely important: listeners adjust to it almost immediately." },
      { t: "Functional load", d: "Pairs like p and b separate many words, so mixing them up costs much more understanding." },
      { t: "Heavy but clear", d: "Research shows some speakers with heavy accents are very easy to understand. It depends which features are involved." },
    ],
    worked: "Ask the listener, not the mirror. A word someone actually misheard is worth fixing; a sound that is merely 'not native' may not be worth your time.",
    watch: "Spending months on the most noticeable sound in your accent because people comment on it, while a less noticeable stress or consonant problem keeps causing misunderstandings.",
    concepts: [],
    checks: [
      { q: "What is comprehensibility?", opts: ["How native you sound", "How fast you speak", "How much effort the listener needs to understand you", "How many words you know"], a: 2,
        expl: "Intelligibility is how much they understand; comprehensibility is how hard it is." },
      { q: "Why does Derwing say the 'th' sounds deserve less attention than they get?", opts: ["Listeners adapt to them almost immediately, so they rarely block understanding", "They are rare in English", "They cannot be learned by adults", "Native speakers do not use them"], a: 0,
        expl: "They are salient, not important." },
      { q: "What does 'high functional load' mean for a pair like p and b?", opts: ["It is hard to pronounce", "It only matters in British English", "It is the most common accent feature", "Many words differ only by that pair, so confusing it costs understanding"], a: 3,
        expl: "That is why it matters more than f versus th." },
    ],
  },

  "spch100.5.2": {
    takeaway: "Marc Green at TEDxHeidelberg argues for going beyond fluency to a native-like level — minimise your accent, learn the expressions locals actually use, and absorb cultural habits. This is the opposite view to the previous two lessons, and worth hearing in full.",
    beats: [
      { t: "Moscow, 1987", d: "He copied down the Russian word for 'exit' as the name of his station — the story that started him learning languages." },
      { t: "The deck of cards", d: "About a quarter of the cards gets you basics; over half is fluency, when the language becomes subconscious. Mastery is slower and optional." },
      { t: "Accent first", d: "He calls it the most overlooked part of learning a language. The perfect-sentence technique: rate, hear, repeat, until no accent is heard." },
      { t: "Local words", d: "Textbook French says 'le travail'; friends say 'mon boulot'. You learn these one at a time, from people." },
      { t: "Cultural traits", d: "Gestures, 'ouch' versus 'aïe', 'uh-huh' versus 'mm-hmm' — picked up through active listening." },
    ],
    worked: "His tools when you are not living among native speakers: copy characters from TV shows, write down any expression you do not know, and learn song lyrics, because the emotion helps the phrases stick.",
    watch: "The tension with Derwing and Pascal is real. Their evidence says intelligibility is enough for being understood; Green's claim is about social belonging, which is a different goal. Decide which one you are working on before you spend the hours.",
    concepts: [],
    checks: [
      { q: "What is Green's 'perfect-sentence technique'?", opts: ["Writing one perfect sentence a day", "Memorising famous quotes", "Reading one sentence to a native speaker and repeating it until they hear no accent", "Recording a full chapter of a book"], a: 2,
        expl: "It can take a long time even for one sentence." },
      { q: "Which three areas does he say take you to a native-like level?", opts: ["Accent, local expressions, cultural traits", "Grammar, vocabulary, spelling", "Reading, writing, listening", "Speed, volume, pitch"], a: 0,
        expl: "All three need contact with native speakers." },
      { q: "How does his goal differ from Derwing's?", opts: ["He wants to be understood; she wants belonging", "They have the same goal", "He is talking about writing", "He is aiming at being accepted as one of the group, not just being understood"], a: 3,
        expl: "Being understood and being treated as a native speaker are different targets." },
    ],
  },

  "spch100.5.3": {
    takeaway: "Safwat Saleem, an animator who stuttered as a child, stopped using his own voice after comments mocked his Pakistani accent — then realised that 'normal' is just what people have been exposed to, and that the only way to widen it is to keep speaking.",
    beats: [
      { t: "The dream", d: "'Have you forgotten your name?' — what classmates said when he stuttered, and what people chant in his recurring dream." },
      { t: "The comments", d: "Positive at first, then: 'his voice is annoying', 'can't follow because of the Indian accent'. He couldn't edit part two." },
      { t: "Homer's colours", d: "Ancient texts barely mention blue. One theory is that cultures only see a colour once they can make it." },
      { t: "Normal is exposure", d: "Studies on bias suggest favouritism toward people we relate to. Few children's books show children of colour, so the circle of normal stays small." },
      { t: "Back to the voice", d: "He is using his voice in his work again, and says giving up is not an option." },
    ],
    worked: "The talk is itself a model of story structure: a recurring dream opens it, the comments are the turning point, Homer's colours are the reflection, and it ends back on the voice — with jokes all the way through ('I clearly have a Pakistani accent').",
    watch: "Hearing a comment about your accent as a verdict on your competence. Saleem's first reaction was to take it personally; the reframe was that it described the commenter's experience.",
    concepts: [],
    checks: [
      { q: "Why does Saleem tell the story of Homer and the colour blue?", opts: ["To show that ancient people were colour-blind", "To show that people only 'see' what they have been exposed to — and 'normal' works the same way", "To explain his career in animation", "To show that translation loses meaning"], a: 1,
        expl: "An accented narrator is not 'normal' only because few are heard." },
      { q: "What did the online comments first make him do?", opts: ["Stop using his own voice in his work", "Take accent classes", "Hire a narrator straight away", "Delete the video"], a: 0,
        expl: "Until he understood what the comments were really about." },
      { q: "Which comment does he correct on stage?", opts: ["That the video was too long", "That he spoke too fast", "That he used peanut butter", "That he had an Indian accent — it is Pakistani"], a: 3,
        expl: "One of several jokes in the talk." },
    ],
  },

  "spch100.5.4": {
    takeaway: "A short drill on English rhythm: content words (the information) are stressed and clear, function words are squeezed in between, so 'MICE EAT CHEESE' and 'the MICE might have been EATing the CHEESE' keep the same three beats.",
    beats: [
      { t: "Two kinds of word", d: "Content words — subject, verb, object — carry the information. Function words like the, a, in, will help but are not the main information." },
      { t: "The build", d: "MICE EAT CHEESE → THE MICE EAT THE CHEESE → … → THE MICE MIGHT HAVE BEEN EATING THE CHEESE." },
      { t: "Same beat", d: "More words, same rhythm: the stressed words stay evenly spaced." },
      { t: "Squeeze", d: "'Might have been' becomes 'mitabin'. The content words are the loudest and clearest part." },
    ],
    worked: "Clap on MICE, EAT and CHEESE and fit everything else between the claps. If a sentence gets slower as it gets longer, you are giving the function words full stress.",
    watch: "Pronouncing every word clearly and equally. It sounds careful but makes the important words harder to pick out.",
    concepts: [],
    checks: [
      { q: "Which of these is a content word?", opts: ["the", "cheese", "will", "in"], a: 1,
        expl: "Nouns, main verbs and adjectives carry the information." },
      { q: "What happens to the beat as function words are added?", opts: ["It stays roughly the same, with the function words squeezed between", "It slows down for each new word", "Every word gets its own beat", "The beat moves to the function words"], a: 0,
        expl: "English is timed by its stressed words." },
      { q: "What should be the loudest and clearest part of the sentence?", opts: ["The first word", "The last word", "The content words", "The articles"], a: 2,
        expl: "That is what makes the rhythm English." },
    ],
  },

  "spch100.5.5": {
    takeaway: "Pronunciation with Emma on thought groups: we speak in short meaningful chunks with small breaks between them, link the words inside each chunk, and can change the meaning — or add emphasis — by moving the breaks.",
    beats: [
      { t: "Let's eat, Grandma", d: "One pause separates inviting Grandma from eating her. Thought groups are what the pauses mark." },
      { t: "No fixed rules", d: "Breaks depend on meaning, emphasis and speed — but some splits sound natural and others make the listener work." },
      { t: "Group by meaning", d: "Keep subject and verb, and set phrases like 'in the middle of the night', together." },
      { t: "Size check", d: "Too short means over-divided; out of breath means not divided enough." },
      { t: "Emphasis", d: "Give a word its own chunk to make it stand out: 'I told you — repeatedly — I don't want to discuss it.'" },
      { t: "Linking", d: "Inside a chunk, words connect ('turn it off'). That is why native speech can be hard to follow, and why chunking yours helps others follow you." },
    ],
    worked: "'I told him naturally he'd have to pay.' With the break after 'him', naturally means of course he would pay. With the break after 'naturally', it describes how you told him.",
    watch: "Pausing wherever you run out of words rather than where the meaning breaks. The listener then has to put the pieces together.",
    concepts: [],
    checks: [
      { q: "What decides where a thought-group break goes?", opts: ["The number of syllables", "The meaning — words that belong to one idea stay together", "Commas only", "Wherever you need to breathe"], a: 1,
        expl: "There are no fixed rules, but meaning is the guide." },
      { q: "How can you emphasise a single word using thought groups?", opts: ["Say it faster", "Put it at the end of the sentence", "Give it its own short chunk", "Repeat it twice"], a: 2,
        expl: "Isolating it draws the listener's attention." },
      { q: "Where does linking between words happen?", opts: ["Inside a thought group, not across the breaks", "Only between sentences", "Only before a pause", "Nowhere in careful speech"], a: 0,
        expl: "The chunk flows as one unit." },
    ],
  },

  "spch100.5.6": {
    takeaway: "A teacher's ten-step shadowing method, built on the view that most learners start shadowing too early: choose a short clip, understand it, take dictation, study it, repeat sentence by sentence, record and compare, shadow with and without the transcript, read aloud from memory — and then talk about it yourself.",
    beats: [
      { t: "Choose", d: "30–90 seconds, one speaker, someone you would like to sound like, speaking clearly." },
      { t: "Understand", d: "Listen for the gist and the emotion, then do a dictation to find what your ear misses." },
      { t: "Study", d: "Note phrases and collocations, and how they are said: stress, tone, rhythm. She calls this the most important stage." },
      { t: "Repeat and compare", d: "One sentence at a time, for accuracy. Record it, compare it with the original, try again." },
      { t: "Shadow", d: "With the transcript, just behind the speaker; then blind, while walking or cooking." },
      { t: "Transfer", d: "Read it aloud from memory in the speaker's style, then speak about the same topic yourself." },
    ],
    worked: "A clip about friendship becomes: shadow it, then talk for two minutes about what friendship means to you, using the phrases you just practised.",
    watch: "Shadowing a whole film scene on day one. Without understanding and analysis you copy the sound roughly and learn little.",
    concepts: [],
    checks: [
      { q: "Why does she recommend an optional dictation step?", opts: ["It is easier than listening", "Teachers require it", "It shows what your ears are not picking up, such as linking and reductions", "It replaces shadowing"], a: 2,
        expl: "The gaps in your dictation are your gaps in listening." },
      { q: "What is 'blind shadowing'?", opts: ["Shadowing with your eyes closed", "Shadowing without the transcript, just behind the speaker", "Shadowing a speaker you cannot see", "Reading the transcript silently"], a: 1,
        expl: "It builds fluency and processing speed." },
      { q: "What is the bonus step after the ten?", opts: ["Speak about the clip's topic yourself", "Find a harder clip", "Write a summary", "Translate the clip"], a: 0,
        expl: "Shadowing should end in your own speech." },
    ],
  },

  "spch100.5.7": {
    takeaway: "Six habits for thinking directly in the language instead of translating: speak and accept mistakes, learn in chunks, listen a lot (for the big picture), link words to images, think out loud, and keep sentences short and simple.",
    beats: [
      { t: "Why translating hurts", d: "It slows you down so you miss your turn, and your sentences follow your first language's patterns." },
      { t: "Speak", d: "Better to say it wrong and be corrected than stay silent translating. Note the correction." },
      { t: "Chunks", d: "Learn 'my name is…', not 'name'. A word-for-word version from Spanish or French ('I call myself…') sounds wrong." },
      { t: "Listen and picture", d: "Listen for the gist, not every word; connect words to images rather than translations." },
      { t: "Out loud, and simple", d: "Talk to yourself as you do chores. Keep it short and simple: the goal is communication, not poetry." },
    ],
    worked: "Label things at home with sticky notes in English, so the first word you think of when you see the plant is the English one.",
    watch: "Building the long, layered sentences you would use in your first language. That is the moment you start translating.",
    concepts: [],
    checks: [
      { q: "What are 'chunks'?", opts: ["Short pauses", "Whole natural phrases learned as a unit, like 'my name is'", "Groups of vocabulary flashcards", "Parts of a presentation"], a: 1,
        expl: "They avoid word-for-word translation." },
      { q: "What does KISS stand for here?", opts: ["Keep it short and simple", "Know idioms, speak slowly", "Keep in step with speakers", "Kind, interested, sincere, simple"], a: 0,
        expl: "Communication, not poetry." },
      { q: "Why does translating in your head make your English less natural?", opts: ["Because it is too fast", "Because it uses too many idioms", "Because it copies the structures of your first language", "Because it removes your accent"], a: 2,
        expl: "Your English ends up sounding like a translation." },
    ],
  },

  "spch100.5.8": {
    takeaway: "How good storytellers in English move between tenses: past perfect for background, 'would' for routines, past simple for the main events, and the historical present to zoom in on the key moment. Notice it in what you listen to before forcing it into your own stories.",
    beats: [
      { t: "The textbook version", d: "Past simple once, past continuous in progress, used to for habits, present perfect for relevance now. Not wrong — but real storytellers move between tenses freely." },
      { t: "Past perfect", d: "'By the time he recovered, the empire had already collapsed' — so the order of events is clear." },
      { t: "Past perfect continuous", d: "'For thousands of years, people had been…' — adds duration to the background." },
      { t: "Would for routines", d: "'Every morning I would wake at six…' Then the past simple breaks it: 'one day the doorbell rang'." },
      { t: "Historical present", d: "'Two years later he catches sight of a young boy.' It brings the listener into the scene." },
    ],
    worked: "The full pattern in one story: past perfect sets the scene, 'would' gives the routine, past simple says what happened, the present zooms into the moment.",
    watch: "Switching tenses at random. The historical present works because it marks the moment that matters; used everywhere, it just sounds confused.",
    concepts: [],
    checks: [
      { q: "What does the past perfect do in a story?", opts: ["Marks the climax", "Describes habits", "Shows something was already true before the story's moment", "Shows the future"], a: 2,
        expl: "It keeps the order of events clear." },
      { q: "What is the historical present used for?", opts: ["Pulling the listener into a key moment, like zooming in", "Correcting grammar", "Describing background", "Ending a story"], a: 0,
        expl: "'She opens the door. The crowd goes silent.'" },
      { q: "How does 'would' work in a story?", opts: ["It always means a condition", "It describes repeated past habits, which the past simple then interrupts", "It shows uncertainty", "It replaces the past perfect"], a: 1,
        expl: "'I would read the paper… one day there was a knock at the door.'" },
    ],
  },

  "spch100.5.9": {
    takeaway: "Natalia of Upskill Me, who teaches public speaking to non-native speakers, on seven mistakes in second-language presentations: translating the slides, under-preparing, never timing yourself, saving questions for the end, memorising every word, never writing anything down, and ignoring your inner state.",
    beats: [
      { t: "Don't translate", d: "Rebuild the talk for this audience; fewer words on slides, because reading replaces listening." },
      { t: "Prepare more, not less", d: "Charismatic speakers in their first language often go silent in their second. Spontaneity comes after rehearsal." },
      { t: "Time yourself", d: "You may think three minutes have passed when it has been fifteen. Do a full timed run." },
      { t: "Questions throughout", d: "Invite questions as you go: a talk is a conversation, and questions show trust." },
      { t: "Memorise the edges only", d: "Learn the first two and last two sentences. Write each bullet as a full sentence you can say — the first line of a paragraph." },
      { t: "Write, and the inner state", d: "Write the one big idea as an answer, not a title. Then work on your state, because confidence comes from having done it many times." },
    ],
    worked: "Bullet point 'five thousand dollars' versus 'we have added five thousand dollars of value to the product.' The first reminds you of the topic; the second gives you correct English to start the paragraph with.",
    watch: "Memorising every word. When one word goes, you are stuck looking for it instead of thinking about the audience.",
    concepts: [],
    checks: [
      { q: "What does she say to memorise word for word?", opts: ["The whole talk", "Only the opening and closing two sentences", "Nothing at all", "Only the slide titles"], a: 1,
        expl: "The body runs on bullet points written as sentences." },
      { q: "Why write bullet points as full sentences?", opts: ["They look better on slides", "They are shorter", "They give you correct English to start each part, not just a reminder of the topic", "They are easier to translate"], a: 2,
        expl: "Non-native speakers usually need help with how to say it, not what to say." },
      { q: "Which of these is a 'one big idea' rather than a title?", opts: ["We have found a strategy to double sales next quarter", "How to increase sales", "Sales strategy review", "Our sales: an overview"], a: 0,
        expl: "A big idea answers a question; a title asks one." },
    ],
  },

  "spch100.5.10": {
    takeaway: "A coach for non-native leaders in American companies on three shifts: treat a presentation as sharing with specific people, stop over-explaining and give the bottom line first, and practise until you sound human rather than perfect.",
    beats: [
      { t: "Share, don't present", d: "Presenting is about you; sharing is about the people in the chairs and what they need. It changes your preparation and your energy." },
      { t: "Know your audience's level", d: "A specialist presenting to other directors has to translate the specialism, not show it off." },
      { t: "Bottom line first", d: "Over-explaining comes from a culture that values the journey, or from trying to prove your English. Both are inefficient here." },
      { t: "Add what only you can", d: "Not every number on the slide — what the numbers mean and what action follows." },
      { t: "Less robotic", d: "Perfect pronunciation in a monotone puts people to sleep. Master your job's high-frequency words, then work on rhythm. Practise standing up if you will present standing up." },
    ],
    worked: "A CFO explaining quarterly numbers to non-finance colleagues: instead of reading the table, say whether it means growth, and what to do as a result — invest in training, slow down, change course.",
    watch: "Scripting everything. When something goes wrong live, you have never practised carrying on through a mistake.",
    concepts: [],
    checks: [
      { q: "Why does she suggest thinking of a presentation as 'sharing'?", opts: ["It sounds more modest", "It moves your focus from yourself to the people receiving it", "It means you need no slides", "It is shorter"], a: 1,
        expl: "Preparation becomes connection rather than memorisation." },
      { q: "What are two reasons she gives for over-explaining?", opts: ["Too many slides and too little time", "Nerves and caffeine", "A culture that puts the journey first, or wanting to prove your English", "Bad microphones and large rooms"], a: 2,
        expl: "Identifying which one applies makes it faster to fix." },
      { q: "Which pronunciation does she say to master first?", opts: ["The high-frequency words of your job", "Every vowel sound", "Idioms and slang", "The 'th' sounds"], a: 0,
        expl: "Then let it go and work on rhythm and intonation." },
    ],
  },

  "spch100.5.11": {
    takeaway: "A Babbel podcast on whether humour travels: puns and cultural references mostly do not, comedians who move between languages have to rebuild their acts, and Eddie Izzard argues that universal material can travel if you add the new language a few minutes at a time and rehearse with a conversation tutor.",
    beats: [
      { t: "Puns don't travel", d: "Spanish puns told in English get blank looks; 'did you get a haircut?' makes no sense in French." },
      { t: "Context matters", d: "Much humour depends on what people grew up watching. Seinfeld dubbed into German flopped." },
      { t: "Rebuilding the act", d: "Gad Elmaleh's 90-minute French show, full of props and characters, had to be rebuilt for American stand-up." },
      { t: "Izzard's method", d: "Universal material, performed in English with a few minutes of French at the end, slowly becoming all French — rehearsed for hours with a conversation tutor in a café." },
      { t: "Delivery", d: "Stress and timing in a language you are learning are the hard part. Filler words and intonation help you sound natural before you are fully fluent." },
    ],
    worked: "'Local jokes get local laughs.' Jokes about shared human situations — a misunderstanding, a family moment — survive the move between languages far better than wordplay.",
    watch: "Translating a joke that works in your first language word for word. Even when you explain it, it rarely lands. The closing minutes are Izzard on why he does it: a deliberately political answer about learning languages rather than building walls.",
    concepts: [],
    checks: [
      { q: "Why did the Spanish jokes fall flat in English?", opts: ["They were too long", "They were rude", "They were puns that only work in Spanish", "The hosts did not understand Spanish"], a: 2,
        expl: "Wordplay depends on the original words." },
      { q: "How does Eddie Izzard build a show in a new language?", opts: ["He hires a translator for the whole script", "He starts with universal material and adds the new language bit by bit, rehearsing with a conversation tutor", "He performs only physical comedy", "He memorises local jokes"], a: 1,
        expl: "He rehearses the act he has been improvising with his tutors." },
      { q: "What does 'local jokes get local laughs' mean?", opts: ["References only one place understands only work in that place", "You should only perform locally", "Local audiences laugh more", "Jokes about places are always funny"], a: 0,
        expl: "Material that relies on shared human experience travels further." },
    ],
  },
});

// =====================================================================
// Unit VII — A5, humour construction (budget 3.0 h). Theory first (Peter
// McGraw, Steve Kaplan), then the joke itself (Greg Dean, the late-night
// two-list formula, Scott Dikkers' filters, a TED-Ed lesson), then bits
// and stories (Seinfeld, Birbiglia), then humour pointed at talks and
// speeches (Aaker and Bagdonas, a speaking coach on best-man speeches,
// David Nihill at Google). The weighting toward humour went mostly to A6:
// the long A5 sources found were auto-captioned interviews over 45 minutes,
// which the transcript tool cuts off, and none is installed unread.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.6.0": {
    module: "A5",
    mechanic: "Humour happens when something seems wrong (a violation) and at the same time seems OK (benign) — so a joke that is not landing usually needs either more wrongness or more safety.",
    rules: [
      "Three conditions, all at once: a violation of how things ought to be, a reason it is benign, and both appraisals together.",
      "A violation becomes benign if the audience is not strongly committed to the broken norm, if it is psychologically distant, or if there is another reading that makes it OK — like play-fighting.",
      "Purely benign is not funny (you cannot tickle yourself). A pure, malign violation is not funny either.",
      "Distance works both ways: big violations get funnier with distance (tragedy plus time); small ones get funnier up close ('you had to be there').",
      "Match your style. If you are brash, soften the violation (McGraw's Silverman strategy). If you are mild, sharpen it by pointing out what is wrong with everyday things (the Seinfeld strategy).",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Take one mildly annoying moment from your week. Write it three ways: with the violation removed (just the facts), as a benign violation (the wrong thing plus why it is OK), and as a malign one (too close or too cruel). Underline what makes the middle one safe." },
    check: "You can name the violation and the specific thing that makes it benign — distance, low commitment, or another reading. If you cannot name both, it is not a benign violation yet.",
  },

  "spch100.6.1": {
    module: "A5",
    mechanic: "Funny is whatever makes you laugh, but comedy is something bigger: telling the truth about flawed people — an unusual person in an ordinary situation, or an ordinary person in an unusual one — trying their best in a world that is too hard for them.",
    rules: [
      "Funny is personal. If you are not laughing, it is not funny to you, whatever the reviews say.",
      "Comedy is a wider category than 'jokes'. It can hold sadness and even tragedy, as long as the people are flawed and trying.",
      "Drama helps people dream about who they could be; Kaplan says comedy helps people live with who they are.",
      "Kaplan's taste: he avoids comedy that punches down at less powerful people, and unmotivated slapstick without a human story behind it.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Pick a story where you were out of your depth. Write two sentences: your flaw or blind spot in that moment, and what you were trying, sincerely, to achieve. Then write the moment where the flaw and the effort collide." },
    check: "The collision moment has you trying hard — not being stupid on purpose. If you are mocking your past self, you have a joke at your expense, not a comic story.",
  },

  "spch100.6.2": {
    module: "A5",
    mechanic: "A joke has two parts joined by a connector — one thing with two meanings: the setup leads the audience to an expected meaning (the target assumption), and the punch reveals the unexpected one, so identifying, fixing and writing jokes all start by finding that connector.",
    rules: [
      "To identify a joke, find the one thing with two meanings. A page of material may contain only one joke.",
      "To fix a joke, strip out everything that does not serve it — Dean quotes Patton Oswalt — and cut the rationalisations (why you went on holiday, why you were there).",
      "Do not repeat the expected meaning in the punch. The audience already supplied it.",
      "To write jokes (Dean's 'joke mine'): take a setup, name the expected meaning, find the words that caused it, list unexpected meanings, and write a punch for each.",
      "'For Father's Day I took my father out' — took out can mean dinner, kill, hit, remove, or date. Each meaning is a different punch.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Write one setup from your own life. Name the expected meaning and the exact word that causes it. List five other meanings of that word and write a one-line punch for three of them. Then cut the best one to the fewest words that still work." },
    check: "Every punch reinterprets the same connector word, and the final version has no word you could delete without losing the joke.",
  },

  "spch100.6.3": {
    module: "A5",
    mechanic: "Setups come in three kinds: a performed setup that misdirects, shared knowledge the audience already has, and observation, where both halves are already in the audience's head and the comedian just puts them together.",
    rules: [
      "Performed setup (the one-liner): the comedian says it, and its job is to create a clear target assumption for the punch to shatter.",
      "Shared knowledge: the setup lives in the audience's head — satire, parody, the news. If they do not have it, the joke means nothing.",
      "Before using shared knowledge, check that this room actually has it.",
      "Observation: both parts are already known, and the comedian's work is noticing them together — Carlin's dog hates you blowing in its face but sticks its head out of the car window.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Write one example of each kind from your own world: a one-liner with a performed setup, a line that relies on something your colleagues all know, and an observation of two things everyone has seen but nobody has connected." },
    check: "For the shared-knowledge line, name the group that would not get it. For the observation, both halves are things your audience has really seen.",
  },

  "spch100.6.4": {
    module: "A5",
    mechanic: "Late-night writers mass-produce topical jokes with a method: take a story with two subjects, free-associate a list for each, find a pair of items with a surprising logical link, and then reach that link from the setup with a who/what/where/why/when/how question.",
    rules: [
      "Two laugh triggers drive it: surprise, and two very different things joined by a hidden similarity.",
      "The setup can be any story that contains two subjects the audience cares about.",
      "Write a list of associations for each subject, then look across the two lists for a link that fires as many laugh triggers as possible.",
      "Get from the setup to the link by asking the W questions ('What did robot Trump do at Disney World?').",
      "If your lists are long enough, you will find an angle other writers did not.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Pick a small piece of news from your industry that involves two subjects. Write ten associations for each in two columns. Draw lines between three surprising pairs and turn the best pair into a two-line joke using a W question." },
    check: "The joke's punch uses one item from each column, and someone outside your industry could follow the setup.",
  },

  "spch100.6.5": {
    module: "A5",
    mechanic: "Scott Dikkers sorts the ways things get funny into filters — irony, character, shock, hyperbole, wordplay, reference, madcap, parody, analogy, misplaced focus and meta — so when an idea is flat you can run it through a different one.",
    rules: [
      "Irony: say the opposite of what you mean and commit to it straight.",
      "Character: give someone two clear traits and show them acting on both at once.",
      "Hyperbole works best when it is exaggerated past the possible (Rodney Dangerfield's urine test with an olive in it). Shock works, but use it sparingly.",
      "Reference is just noticing a small shared moment nobody has pointed out. Analogy finds many connection points between two unrelated things.",
      "Misplaced focus draws attention to what matters by obsessing over something trivial. Meta makes fun of humour itself.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take one plain opinion you hold ('I hate long meetings'). Rewrite it through four filters: irony, hyperbole, analogy and misplaced focus. Read them aloud and mark the one that sounds most like you." },
    check: "Each version is clearly a different filter — the hyperbole is impossible, not just big, and the irony is played completely straight.",
  },

  "spch100.6.6": {
    module: "A5",
    mechanic: "A TED-Ed lesson on finding the funny: specific details answer who, what, when, where, why and how; comic characters come from finding a flaw and playing it up; and small tools — incongruity, 'what if', the rule of three and the punch word at the end — make the lines land.",
    rules: [
      "The more specific the details, the funnier the story. Vague details give the listener nothing to picture.",
      "For a comic character, find the flaw and play it up — or play with opposites, like the genius doing the stupidest thing.",
      "Find incongruities by mind-mapping from one word, then shift from what is to what if.",
      "Zig, zig, zag: set up a pattern of two and break it on the third. Put the punch word at the end of the line.",
      "Comedy is trial and error, and writing is rewriting.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write one paragraph about something that irritated you this week. Rewrite it with three specific details (brand names, numbers, exact words said), one list of three that breaks on the third item, and the funniest word moved to the end of its sentence." },
    check: "Every vague noun in the first version has become a specific one, and the last word of the key sentence is the funny word.",
  },

  "spch100.6.7": {
    module: "A5",
    mechanic: "Seinfeld builds a bit like a song: a funny first line, words chosen because they are funny, tight connections between jokes, syllables counted, and the biggest laugh saved for the end.",
    rules: [
      "Start with something you think is funny and go from there. He likes the first line to be funny straight away.",
      "Choose words for their sound and picture: in 'chimps in the dirt playing with sticks', four of seven words are funny.",
      "Link jokes with connective tissue as tight as a jigsaw. If a transition is a split second too long, shave letters and count syllables.",
      "In a long bit, the biggest laugh has to come at the end, not the middle — and the ending is the hardest part.",
      "He writes longhand, and will spend years on one bit about nothing.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take a funny story you tell. Write the first line so it is funny on its own. Go through the rest and circle the words that are funny to say; replace two dull words with funnier, more specific ones. Then reorder so the biggest laugh comes last." },
    check: "Reading it aloud, there is nothing between the last laugh and the end — no explanation, no 'anyway'.",
  },

  "spch100.6.8": {
    module: "A5",
    mechanic: "Mike Birbiglia's structure for funny stories, from advice Ira Glass gave him: tell a little of the story, then say how you feel about it, then a bit more story — the jokes live in how you feel — and finish by zooming out to what it means before zooming back in for a final tag.",
    rules: [
      "Alternate story and feeling. Comedians' strength is how they feel about things.",
      "Audiences want to know there is an ending, and that you are a little different after the story than before.",
      "Know where it begins and where it ends, put in as many jokes as the audience will let you, and skip to the ending if you lose them.",
      "Hook them, keep pulling them forward, then zoom out to what this says about life — and zoom back in for a tag that buttons it up.",
      "Talk about what you actually care about. That is the only thing that is interesting.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Tell a two-minute story aloud using the rhythm: one beat of story, one line of how you felt about it, repeat three times. Then add one zoom-out line (what this says about you or people) and one tag that returns to a detail from the story." },
    check: "At least three of your 'how I felt' lines are specific and honest, and the tag refers back to something concrete — not a moral.",
  },

  "spch100.6.9": {
    module: "A5",
    mechanic: "Jennifer Aaker and Naomi Bagdonas: humour rests on truth and misdirection, so start by noticing — a levity list of three odd things a day — then run any observation through exaggeration, contrast, or the rule of three.",
    rules: [
      "They describe a 'humour cliff': people laugh far less once they start work, partly because they believe they must be serious to be taken seriously.",
      "Keep a levity list: for ten days, write down three funny, odd or interesting things at the end of each day.",
      "Exaggeration: push an observation to an extreme ('I can't remember how we used to put on trousers').",
      "Contrast: put the upside next to an absurd downside of the same thing.",
      "Rule of three: two normal items, then the funny one ('hallway chats, eye contact in meetings, and trousers').",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write today's three entries for a levity list. Take the best one and write it three ways: as an exaggeration, as a contrast, and as a rule-of-three list with the odd item last." },
    check: "Each version is true at its core. If you had to invent a fact to make it funny, go back to the observation.",
  },

  "spch100.6.10": {
    module: "A5",
    mechanic: "Three techniques anyone can put into a speech, shown in real best-man speeches: misdirection (lead one way, turn at the end), exaggeration (stretch a true trait past belief), and self-deprecation in small doses.",
    rules: [
      "Misdirection: 'such a wonderful, once-in-a-lifetime achievement… I've graduated law school.' The audience assumed the wedding.",
      "Exaggeration: he had the wedding website up before he met her. The trait (planning) is true; the scale is not.",
      "Self-deprecation by contrast: his friends tell stories about good deeds; mine are about the goat we stole.",
      "Do not let self-deprecation become self-loathing. Too much of it makes the audience feel sorry for you instead of laughing.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write a three-line toast for a friend or colleague: one line of misdirection, one exaggeration of a real trait of theirs, and one self-deprecating contrast. Keep it under sixty seconds aloud." },
    check: "The exaggerated trait is one everyone in the room would recognise, and the self-deprecating line makes you look human, not hopeless.",
  },

  "spch100.6.11": {
    module: "A5",
    mechanic: "David Nihill, who spent a year pretending to be a comedian to beat his fear of speaking: go for fun before funny by building talks on your own stories, then use comedians' techniques — a relatable setup, the funny word last, the rule of three as one-two-four — and plan your ending so it is not killed by silence.",
    rules: [
      "Keep a funny-story file. Prompts: most embarrassing moment, first date, teaching your parents video calls, the wrong word in a new language, first day at work, strangest customer.",
      "Make the opening relatable to the whole room ('being somewhere new can be uncomfortable…') before the specific story.",
      "Setup, punchline, tag — and move the funny word to the end of the sentence, then stop and let them laugh. 'The end of laughter is the height of listening.'",
      "Rule of three as one, two, four: two items create a pattern, the third breaks it.",
      "Take questions before your conclusion, so you control the ending. If a joke fails, acknowledge it and move on.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Pick one story from the prompts and write its opening line so it applies to everyone in the room. Then write the key funny sentence twice: once as you would normally say it, once with the funny word moved to the very end." },
    check: "In the rewritten sentence, nothing comes after the funny word. If you keep talking after it, you are stepping on your own laugh.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.6.0": {
    takeaway: "Peter McGraw's benign violation theory, from the Humor Research Lab at Boulder: something is funny when it seems wrong and OK at the same time. That explains what is funny, what is not, and how to adjust a joke that misses.",
    beats: [
      { t: "The trigger", d: "His talk about moral violations got laughs instead of disgust — a church raffling off a Hummer — and he set out to explain why." },
      { t: "Three conditions", d: "A violation, a reason it is benign, and both at once." },
      { t: "Making it benign", d: "Low commitment to the norm, psychological distance, or another reading (play-fighting, tickling)." },
      { t: "Not funny, two ways", d: "Purely benign is dull; purely malign is upsetting. Falling down stairs unhurt is funny; badly hurt is not — unless it happens to someone else." },
      { t: "Distance cuts both ways", d: "Big violations need distance; small ones get funnier closer up. The Silverman strategy softens; the Seinfeld strategy sharpens." },
    ],
    worked: "His opening — 'turn to a stranger and start tickling them' — was a violation (wrong to ask), made benign by the audience (open-minded), distance (in the future), and another reading (it is a talk about humour).",
    watch: "Fixing a flat joke by adding more edge when the real problem is that nobody feels safe. Ask which side is missing: the wrong, or the OK.",
    concepts: [],
    checks: [
      { q: "According to the benign violation theory, when does humour occur?", opts: ["Whenever something is surprising", "When a situation is a violation and benign at the same time", "When the audience feels superior", "When a joke has three parts"], a: 1,
        expl: "Both appraisals have to happen together." },
      { q: "Why can't you tickle yourself, in McGraw's terms?", opts: ["Your skin adapts", "It is a malign violation", "There is no violation — it is purely benign", "You laugh too early"], a: 2,
        expl: "Without any threat there is nothing to be funny." },
      { q: "Which of these is NOT one of the ways he lists to make a violation benign?", opts: ["Making it louder", "Low commitment to the violated norm", "Psychological distance", "An alternative interpretation that makes it OK"], a: 0,
        expl: "Volume is not part of the theory." },
    ],
  },

  "spch100.6.1": {
    takeaway: "Steve Kaplan, who teaches comedy writing: funny is anything that makes you laugh, but comedy is the truth about flawed people trying to cope with a world that is too hard for them — which is why it can hold sadness.",
    beats: [
      { t: "A wider envelope", d: "The Apartment is sad, with an attempted suicide in it, and still a comedy, because its people are flawed and trying." },
      { t: "Dream versus live", d: "Drama helps us dream about who we could be; comedy helps us live with who we are." },
      { t: "Funny is personal", d: "If you are not laughing, it is not funny to you — like jangling keys for a baby." },
      { t: "The definition", d: "Unusual characters in a typical situation, or typical characters in an unusual one, trying to deal with it." },
      { t: "Taste", d: "He does not care for comedy that punches down, or for slapstick with no human story behind it." },
    ],
    worked: "Turn a story where you looked foolish into comedy by showing what you were sincerely trying to do. The laugh comes from the gap between the effort and the result, not from you calling yourself an idiot.",
    watch: "Confusing 'getting a laugh' with comedy. Jangling keys gets a laugh; nobody would spend a year writing it.",
    concepts: [],
    checks: [
      { q: "How does Kaplan distinguish 'funny' from 'comedy'?", opts: ["They are the same thing", "Comedy must have jokes; funny does not", "Funny is whatever makes you laugh; comedy is telling the truth about flawed people trying to cope", "Funny is for film; comedy is for stage"], a: 2,
        expl: "His example is a baby laughing at keys — funny, not comedy." },
      { q: "Why does he call The Apartment a comedy even though it is sad?", opts: ["Its people are flawed and doing their best in a world that is too hard for them", "It has a happy ending", "It was marketed as one", "It has slapstick scenes"], a: 0,
        expl: "Comedy can hold sadness and even tragedy." },
      { q: "What does he say comedy helps people do, compared with drama?", opts: ["Escape reality", "Learn facts", "Dream of who they could be", "Live with who they are"], a: 3,
        expl: "Drama is about who we could be." },
    ],
  },

  "spch100.6.2": {
    takeaway: "Greg Dean, who has taught stand-up since 1982: a joke turns on one thing with two meanings. Find it to identify the joke, strip everything that does not serve it to fix the joke, and mine its other meanings to write new ones.",
    beats: [
      { t: "Identify", d: "People bring him whole pages that contain one joke. Find the connector — the one thing with an expected and an unexpected meaning." },
      { t: "Fix", d: "A divorce joke shrinks from three sentences to one by cutting 'long and messy', the holiday, and every rationalisation: 'After my divorce I had a sex change — from very seldom to not at all.'" },
      { t: "Don't explain", d: "Never restate the expected meaning in the punch." },
      { t: "Write: the joke mine", d: "Setup, expected meaning, the words that cause it, a list of other meanings, a punch for each." },
      { t: "Volume", d: "Once you know the mechanism, okay jokes are easy. The hard part is the great ones that reveal something true, and that takes a lot of writing." },
    ],
    worked: "'For Father's Day I took my father out' — expected: to dinner. Mine 'took out': kill (with a 45), hit (with a right cross), remove (out of an urn), date (the goodnight kiss was awkward). Each meaning is a new punch.",
    watch: "Writing around the joke. If you cannot point to the single word or phrase with two meanings, you do not yet know where your joke is.",
    concepts: [],
    checks: [
      { q: "What is the 'connector' in Dean's joke structure?", opts: ["The pause before the punch", "One thing in the joke that has two meanings", "The tag after the punch", "The audience's laugh"], a: 1,
        expl: "The setup leads to one meaning, the punch reveals the other." },
      { q: "What does he say to strip out when fixing a joke?", opts: ["Everything that does not serve the joke, including rationalisations", "Only swear words", "The punch", "Any mention of yourself"], a: 0,
        expl: "He quotes Patton Oswalt." },
      { q: "In the 'joke mine', what do you list after finding the words that cause the expected meaning?", opts: ["Other topics", "Possible tags", "Other comedians' jokes", "Unexpected meanings of those words"], a: 3,
        expl: "Each unexpected meaning leads to a different punch." },
    ],
  },

  "spch100.6.3": {
    takeaway: "Greg Dean's three kinds of setup: the performed one-liner setup that misdirects, shared knowledge already in the audience's head, and observation, where both setup and punch are already known and the comedian just connects them.",
    beats: [
      { t: "Performed", d: "The comedian says the setup. Its job is clear misdirection toward a target assumption." },
      { t: "Shared knowledge", d: "Satire and parody depend on what the audience already knows. Without it, the joke means nothing." },
      { t: "Check the room", d: "That is why comedians use news, TV and common experiences — and why they must know whether this audience shares them." },
      { t: "Observation", d: "Both halves are known: dogs hate air blown in their faces, but stick their heads out of car windows. The comedian notices and presents the pair." },
    ],
    worked: "At a team offsite, a joke about last quarter's planning tool relies on shared knowledge — it works with your team and dies with a client.",
    watch: "Using a shared-knowledge joke with a mixed audience. The people who do not have the reference feel shut out, not amused.",
    concepts: [],
    checks: [
      { q: "What makes a 'shared knowledge' setup different?", opts: ["The comedian sings it", "It is always a pun", "The setup is already in the audience's mind, so the comedian only gives the punch", "It needs a prop"], a: 2,
        expl: "Satire and parody rely on it." },
      { q: "In an observational joke, where are the setup and the punch?", opts: ["Both are already in the audience's mind; the comedian connects them", "Only in the comedian's notes", "In the news", "In the previous joke"], a: 0,
        expl: "Carlin's dog joke is his example." },
      { q: "What is the purpose of a performed one-liner setup?", opts: ["To explain the joke", "To introduce the comedian", "To get a small laugh", "To create misdirection toward a target assumption"], a: 3,
        expl: "The punch then shatters that assumption." },
    ],
  },

  "spch100.6.4": {
    takeaway: "How late-night writers produce a hundred topical jokes a day: pick a story with two subjects, free-associate a list for each, find a surprising link between the lists, and reach it from the setup with a who/what/where/why/when/how question.",
    beats: [
      { t: "No waiting for inspiration", d: "The volume needs an algorithm." },
      { t: "Two triggers", d: "Surprise (setup and punch) and two unlike things joined by a hidden similarity." },
      { t: "Two lists", d: "For the Disney robot-Trump story: one list about Trump, one about Disney." },
      { t: "The link", d: "Trump deporting Aladdin — surprising, recognisable, and it fires several laugh triggers for that audience." },
      { t: "The bridge", d: "'What did robot Trump do at Disney?' gets you from setup to punch." },
    ],
    worked: "Long lists give each show its own angle on the same story — one used deportation, another sent Jeff Sessions to the Country Bear Jamboree.",
    watch: "Stopping at short lists. The first few associations are the ones every other writer has too.",
    concepts: [],
    checks: [
      { q: "What are the two lists in the late-night formula?", opts: ["Good jokes and bad jokes", "Free associations for each of the two subjects in the story", "Setups and punchlines", "Facts and opinions"], a: 1,
        expl: "The joke comes from linking an item from each list." },
      { q: "How do writers get from the setup to the link they found?", opts: ["By asking who/what/where/why/when/how questions about the setup", "By adding a pun", "By reading it faster", "By adding a tag"], a: 0,
        expl: "'What did robot Trump do at Disney World?'" },
      { q: "Why do longer lists help?", opts: ["They make jokes longer", "They impress the head writer", "They avoid swearing", "They lead to links other writers did not find"], a: 3,
        expl: "That is how shows find different angles on the same story." },
    ],
  },

  "spch100.6.5": {
    takeaway: "Scott Dikkers, founding editor of The Onion, on eleven 'funny filters' — irony, character, shock, hyperbole, wordplay, reference, madcap, parody, analogy, misplaced focus and meta — shown with Onion headlines.",
    beats: [
      { t: "Irony", d: "Take the opposite of your literal meaning, buy into it, and play it straight." },
      { t: "Character", d: "Two traits shown together: a philandering string theorist who 'can explain everything'." },
      { t: "Shock and hyperbole", d: "Shock is a cheap laugh; use it sparingly. The best hyperbole defies physics." },
      { t: "Wordplay and reference", d: "Wordplay can be done well. Reference just points out a small shared moment nobody else has noticed — Seinfeld built a career on it." },
      { t: "Madcap, parody, analogy", d: "Silliness as garnish; every Onion story parodies a news article; an analogy with many connection points (Al Gore as Superman's father) is a rich seam." },
      { t: "Misplaced focus and meta", d: "Obsess over the trivial to highlight what matters; make fun of humour itself." },
    ],
    worked: "'Secondhand smoke linked to secondhand coolness' — misplaced focus: the real danger is ignored in favour of something unimportant, which makes you notice the danger.",
    watch: "Leaning on shock because it is easy. It works in mixed company, but it is the cheapest filter, and a little goes a long way.",
    concepts: [],
    checks: [
      { q: "How does Dikkers say irony works?", opts: ["Take the opposite of your literal meaning and play it completely straight", "Make a pun on a word", "Exaggerate until it is impossible", "Refer to another joke"], a: 0,
        expl: "'I love soup' written as a sincere celebration of soup." },
      { q: "What makes the best hyperbole, in his view?", opts: ["Small exaggerations", "Swearing", "Exaggeration past the point of physical possibility", "Quoting statistics"], a: 2,
        expl: "His example is Rodney Dangerfield's olive." },
      { q: "What is 'misplaced focus'?", opts: ["Looking at the wrong person", "Focusing on something trivial so the audience thinks about what really matters", "A camera technique", "Forgetting the punchline"], a: 1,
        expl: "Secondhand smoke linked to secondhand coolness." },
    ],
  },

  "spch100.6.6": {
    takeaway: "A TED-Ed lesson by comedy writer Cheri Steinkellner: funny comes from specific details, characters with a flaw played up, incongruity found by mind-mapping and 'what if', and small tools like zig-zig-zag and the punch word last.",
    beats: [
      { t: "Did you ever notice", d: "Much comedy is noticing the ordinary things nobody notices." },
      { t: "Details", d: "Who, what, when, where, why, how — and the more specific, the funnier." },
      { t: "Characters", d: "Commedia dell'arte types (the know-it-all, the lovable loser): find the flaw, play it up, or flip opposites." },
      { t: "Incongruity", d: "Mind-map from a word ('pickle'), then go from what is to what if. Write the dumb ideas down too." },
      { t: "Tools", d: "Rule of three (zig, zig, zag), punch at the end of the line, and the claim that k-sounds are funny." },
    ],
    worked: "'A rabbi, a priest and a coconut walk into a bar' breaks the pattern; changing 'bar' to 'disco' moves the funny word to the end.",
    watch: "Treating rule-of-thumb claims as laws. 'K-words are funny' is a writer's habit, not a finding; test it on your own lines.",
    concepts: [],
    checks: [
      { q: "What is the Commedia dell'arte rule for a comic character?", opts: ["Give them a catchphrase", "Make them always win", "Find the flaw, then play it up", "Make them speak in rhyme"], a: 2,
        expl: "Or play with opposites." },
      { q: "What does 'zig, zig, zag' describe?", opts: ["The rule of three: set up a pattern, then break it", "A dance move", "Three jokes in a row", "Changing topics"], a: 0,
        expl: "A rabbi, a priest and a coconut." },
      { q: "Why do specific details help?", opts: ["They make the story longer", "They prove it really happened", "They are easier to remember", "They give the listener something precise to picture, which is funnier"], a: 3,
        expl: "The more specific the details, the funnier the story." },
    ],
  },

  "spch100.6.7": {
    takeaway: "Jerry Seinfeld shows The New York Times how he wrote his Pop-Tart bit over two years: funny first line, funny words, links as tight as a jigsaw, syllables counted, and the biggest laugh at the end.",
    beats: [
      { t: "Start anywhere funny", d: "'Pop-Tart' is fun to say; the first line should be funny right away." },
      { t: "Funny words", d: "'Chimps in the dirt playing with sticks' — four of seven words are funny." },
      { t: "Tell them it is a story", d: "'In the midst of that darkness and hopelessness, the Pop-Tart appears' gets a laugh because it signals a story." },
      { t: "Connective tissue", d: "Links between jokes have to be smooth; if one is a split second too long he shaves letters and counts syllables, like songwriting." },
      { t: "The ending", d: "In a long bit the biggest laugh must come last. His: 'They can't go stale, because they were never fresh.'" },
    ],
    worked: "He writes longhand on yellow legal pads with the same Bic pen he used for every Seinfeld episode, and spends years on something that 'means absolutely nothing'.",
    watch: "Letting the biggest laugh sit in the middle of a story. Everything after it feels like a let-down, however good it is.",
    concepts: [],
    checks: [
      { q: "Where does Seinfeld say the biggest laugh in a long bit must go?", opts: ["At the end", "At the start", "In the middle", "Wherever it fits"], a: 0,
        expl: "That is why the ending is the hardest part." },
      { q: "What does he compare tightening the links between jokes to?", opts: ["Cooking", "Songwriting — counting syllables", "Building a house", "Painting"], a: 1,
        expl: "He shaves letters off words to get the timing." },
      { q: "Why does he say 'chimps in the dirt playing with sticks' works?", opts: ["It rhymes", "It is true", "Four of its seven words are funny on their own", "It is short"], a: 2,
        expl: "Word choice matters." },
    ],
  },

  "spch100.6.8": {
    takeaway: "Mike Birbiglia on the storytelling advice he uses constantly, from Ira Glass: tell a little story, say how you feel about it, repeat — the jokes are in how you feel — and end by zooming out, then back in for a tag.",
    beats: [
      { t: "Story, feeling, story", d: "Comics' strength is how they feel about things; that is where the jokes come from." },
      { t: "Two things the audience wants", d: "To know the story has an ending, and to know that something is changing." },
      { t: "Jokes inside the frame", d: "Know where it starts and ends, then see how many jokes the audience lets you get away with. If you lose them, skip to the end." },
      { t: "Zoom out, zoom in", d: "Hook, pull forward, zoom out to the bigger meaning, then come back for a final tag." },
      { t: "Care", d: "Talk about what you actually think about. Topical material you do not care about is not interesting." },
    ],
    worked: "His analysis of a friend's Russia story: the hook (in Russia, no Russian), the pull (the Russian mom, drinking, robbing a train), the zoom-out (I'd never thought about whether I would rob a train), and the tag.",
    watch: "Stacking jokes with no feeling between them. Without the 'how I felt' beats, a story becomes a list of bits.",
    concepts: [],
    checks: [
      { q: "What structure did Ira Glass give Birbiglia?", opts: ["Setup, punch, tag", "Tell a little story, say how you feel about it, then a little more story", "Beginning, middle, end", "Three jokes, then a story"], a: 1,
        expl: "The feelings are where the comedy lives." },
      { q: "What does he suggest if the audience is not with a story?", opts: ["Skip to the ending", "Tell it louder", "Start again", "Explain it"], a: 0,
        expl: "Knowing the ending lets you bail out." },
      { q: "What is the 'zoom out' at the end of a story?", opts: ["A camera move", "A list of thanks", "A recap of events", "A step back to what it means in a larger context, before a final tag"], a: 3,
        expl: "Then you zoom back in for the tag." },
    ],
  },

  "spch100.6.9": {
    takeaway: "Jennifer Aaker and Naomi Bagdonas on the Future of Storytelling podcast: why humour works on the brain and at work, the 'humour cliff', and a starter kit — a levity list, then exaggeration, contrast and the rule of three, all built on truth and misdirection.",
    beats: [
      { t: "Why it matters", d: "They cite research that people remember more when they laugh — viewers of comic news shows recalled more current events, and students taught with humour scored higher." },
      { t: "The humour cliff", d: "They report that a four-year-old laughs about 300 times a day; a 40-year-old takes over two months to laugh that much." },
      { t: "Four myths", d: "One is the 'born with it' myth. Humour is a skill with a science to it." },
      { t: "The levity list", d: "For ten days, write down three funny or odd things at the end of each day." },
      { t: "Three techniques", d: "Exaggeration, contrast, and the rule of three — applied to any true observation." },
      { t: "Truth and misdirection", d: "The two foundations: lead the brain one way, then turn it." },
    ],
    worked: "The remote-work observation (no one wears trousers on video calls) done three ways: exaggerated ('how did we put on trousers?'), contrasted (finding good lighting versus time saved on trousers), and as a list of three (hallway chats, eye contact, trousers).",
    watch: "Trying to be funny before noticing anything. The techniques need raw material; the levity list is where it comes from.",
    concepts: [],
    checks: [
      { q: "What is a 'levity list'?", opts: ["A list of jokes to memorise", "Three funny or odd things written down at the end of each day", "A list of comedians to watch", "A ranking of your colleagues' humour"], a: 1,
        expl: "They suggest doing it for ten days." },
      { q: "In the rule of three, where does the funny item go?", opts: ["Last, after two normal items", "First", "In the middle", "It is repeated three times"], a: 0,
        expl: "Two items set the pattern; the third breaks it." },
      { q: "What do they call the two foundations of humour?", opts: ["Timing and volume", "Wit and charm", "Truth and misdirection", "Surprise and repetition"], a: 2,
        expl: "Lead the audience one way, then shift." },
    ],
  },

  "spch100.6.10": {
    takeaway: "A speaking coach breaks down three techniques from real best-man speeches that anyone can use in a work presentation: misdirection, exaggeration and self-deprecation — with a warning about overdoing the last one.",
    beats: [
      { t: "Misdirection", d: "'A once-in-a-lifetime achievement… I've graduated law school. There's also a wedding.' The audience assumed the wedding." },
      { t: "Exaggeration", d: "'He had the wedding website up before he met Michelle.' Built on a true trait: he plans everything." },
      { t: "Self-deprecation", d: "His brother's friends recall good deeds; his friends recall the goat they stole." },
      { t: "The limit", d: "Self-deprecation repeated becomes self-loathing, and the audience starts to feel sorry for you." },
    ],
    worked: "For a work talk: 'This project took a huge amount of dedication — mostly from the coffee machine.' Misdirection toward the team, a turn at the end.",
    watch: "Exaggerating a trait the person is sensitive about. The planner in the example was proud of planning; pick traits people would happily admit to.",
    concepts: [],
    checks: [
      { q: "Why did the law-school line get a laugh?", opts: ["It was rude", "The audience expected the achievement to be the wedding", "It was a pun", "It was very long"], a: 1,
        expl: "Misdirection: lead one way, turn at the end." },
      { q: "What is the risk the coach mentions with self-deprecation?", opts: ["It becomes self-loathing and the audience feels sorry for you", "It is too easy", "Nobody understands it", "It insults the couple"], a: 0,
        expl: "Use it, but not again and again." },
      { q: "What makes the wedding-website exaggeration work?", opts: ["It is completely made up", "It is about the speaker", "It uses wordplay", "It stretches a real trait everyone recognises"], a: 3,
        expl: "The trait is true; only the scale is exaggerated." },
    ],
  },

  "spch100.6.11": {
    takeaway: "David Nihill at Talks at Google: after a year posing as a stand-up to beat his fear of speaking, he argues presenters should go for fun before funny — build on your own stories, then use comedians' techniques for structure, timing and memory.",
    beats: [
      { t: "Why", d: "He says comedians are judged every 12 seconds, and business talks now compete with entertainment. He counted laughs in top TED talks and found they rival comedy films." },
      { t: "Stories first", d: "Your own story carries no risk if it does not get a laugh — and nobody knows if you mess it up. Keep a funny-story file." },
      { t: "Relatable setup", d: "Open with something the whole room shares before the specific story." },
      { t: "Timing", d: "Setup, punch, tag. Move the funny word to the end and stop — Obama's salmon joke ends on 'smoked'." },
      { t: "Rule of three as one-two-four", d: "Two items set a pattern; the third breaks it — on a book blurb, a sign, an email." },
      { t: "Memory and endings", d: "A memory palace so you never go blank; speak 10–15 per cent louder to cut filler words; take questions before your conclusion." },
    ],
    worked: "Pitches too: 'we have a year-on-year growth rate of 80 per cent' puts the impact word last. It feels odd to say and sounds natural to the audience.",
    watch: "Ending on Q&A. If nobody asks anything, the talk dies on silence. Take questions, then deliver a planned final slide and line.",
    concepts: [],
    checks: [
      { q: "What does Nihill mean by 'fun before funny'?", opts: ["Play games before the talk", "Engage with your own stories first; a story that does not get a laugh still works", "Tell your best joke first", "Avoid humour at work"], a: 1,
        expl: "Stories carry no risk of the silence a failed joke gets." },
      { q: "Where should the funny word go in the sentence?", opts: ["At the start", "In the middle", "At the very end, followed by a pause", "Repeated twice"], a: 2,
        expl: "Then stop and let them react." },
      { q: "Why take questions before your conclusion?", opts: ["So you control the ending even if nobody asks anything", "To save time", "Because audiences prefer it", "To avoid hard questions"], a: 0,
        expl: "Comedians never end on a flat note." },
    ],
  },
});

// =====================================================================
// Unit VIII — A6, humour in real time (budget 3.0 h with the seed's
// conversation lesson). Noticing (Chris Duffy), improvisation (Dave
// Morris, Patricia Ryan Madson), humour as a practised skill (Andrew
// Tarvin), humour at work and its limits (Aaker and Bagdonas at Google),
// reading discomfort and recovering a joke (two breakdowns of talk-show
// clips), callbacks, and naming the elephant in the room.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.7.0": {
    module: "A6",
    mechanic: "People with a good sense of humour mostly notice and accept their honest, odd reactions instead of squeezing them into the 'right' answer — so the skill is switching off self-judgement and writing down what stands out.",
    rules: [
      "Children say their honest, unexpected thoughts whether you want them to or not. Adults learn to filter them out.",
      "Duffy's improv drill: name seven weird kinds of something, fast. The tax lawyer started with brown shoes and black shoes and got to shoes covered in gold.",
      "Every comedian he knows keeps a notebook of small odd things they notice. Once you keep one, there is no shortage of material.",
      "Bring some mischief to self-serious places — but notice that his LinkedIn prank also cost him the account.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Set a timer for two minutes and list seven weird types of something from your work (meetings, emails, clients). Do not judge. Then circle the one you would actually say out loud to a colleague." },
    check: "At least three items are things you would not have written if someone were reading over your shoulder.",
  },

  "spch100.7.1": {
    module: "A6",
    mechanic: "Improvisers make things up live with seven habits that also run conversation: play, let yourself fail, listen (be willing to change), say yes, say 'and', play by the rules of the game, and relax.",
    rules: [
      "Play: do something because it is fun, in the moment, instead of turning it into work in your head.",
      "Let yourself fail. Failing does not make you a failure; an improviser just starts again.",
      "Listening is the willingness to change. Most people listen only enough to reply.",
      "Say yes — a string of yeses goes somewhere, one 'no' stops it — then say 'and', adding your own brick. 'Yes, but' contradicts.",
      "Rules free you. Within the constraints of the game (the slides, the brief), you improvise.",
    ],
    drill: { minutes: 8, artifact: "spoken",
      do: "With a friend (or alone, out loud), build a two-minute story where every sentence must start with 'Yes, and…' and add one new detail. Then repeat with 'Yes, but…' and notice the difference." },
    check: "The 'yes, and' version went somewhere neither of you planned; the 'yes, but' version stalled or argued.",
  },

  "spch100.7.2": {
    module: "A6",
    mechanic: "Patricia Ryan Madson's improv wisdom: start anywhere, accept your first idea instead of hunting for a good one, make sense rather than jokes, treat mistakes as material, and pay attention to what is actually in front of you.",
    rules: [
      "Start anywhere. Waiting for the perfect starting point is what keeps people frozen.",
      "The imaginary gift box: whatever you find in it is fine. Trying to come up with a good idea gets in the way of having an idea.",
      "'Don't make jokes, make sense.' Improv is funny because it makes sense of what is really happening, not because people are being clever.",
      "When you make a mistake, raise your arms and say 'ta-da' — the circus bow — so your attention moves to what comes next.",
      "Wake up to the physical world. Close your eyes and try to describe the room; most people cannot.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Close your eyes where you are and write, without looking, five details of the room: the light, colours, what is on the walls, who is near. Then open your eyes, check, and write one thing you had never noticed that you could mention in a conversation." },
    check: "You recorded at least one detail you got wrong. The point is the gap between what you assumed and what is there.",
  },

  "spch100.7.3": {
    module: "A6",
    mechanic: "Andrew Tarvin, an engineer turned humour trainer, treats humour as a skill learned by practice: take your point of view from stand-up, heighten it with yes-and from improv ('if this is true, what else is true?'), commit to it like sketch performers, and shorten your staircase wit with repetition.",
    rules: [
      "Stand-up teaches point of view: share how you see things, as a way to connect (mint chocolate is toothpaste) or to make a point.",
      "Improv teaches heightening: 'if this is true, what else is true?' — and turns small talk about the weather into a real conversation.",
      "Sketch teaches commitment. A half-hearted joke is worse than a committed one.",
      "Staircase wit — thinking of the line hours later — is a sign of comic instinct. With practice the gap shrinks.",
      "A bad joke has never got anyone fired; an inappropriate one might. Keep it positive and inclusive, and if no one laughs it is just a nice statement.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write one thing you genuinely believe that others might not (your point of view). Then write three 'if this is true, what else is true?' lines that push it further. Finally, recall a moment this week where you thought of the right line too late, and write it down." },
    check: "Each heightened line follows logically from the one before. If one is random, it breaks the game.",
  },

  "spch100.7.4": {
    module: "A6",
    mechanic: "Aaker and Bagdonas on using humour at work: it is less about being funny than about small moments of levity — look for what is true, call out the odd moment — while managing status, knowing your humour style, never punching down, and checking your distance from the subject.",
    rules: [
      "'Don't look for what's funny, look for what's true.' Write down a few true, odd observations at the end of each day.",
      "Status matters. Early in a career people feel they must prove credibility before using humour; leaders who stay serious miss the approachability humour gives them.",
      "Self-deprecation can lower your status when you are junior and signal confidence when you are senior.",
      "Before a joke, ask how it will make others feel, not how it will make you look. Never punch down, and check your distance — you can joke about your own mother, not someone else's.",
      "When a joke gets crickets, name it ('well, that didn't work'). When you cross a line, acknowledge it and get curious about your blind spot.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Plan one small act of levity for a real meeting or email this week: a sign-off other than 'best', a true observation about the situation everyone is in, or humour hung on an existing ritual. Write it down and, next to it, answer: how will it make the others feel?" },
    check: "The line is about a shared situation or yourself, not about someone lower in status than you — and you wrote the 'how will they feel' answer before deciding to use it.",
  },

  "spch100.7.5": {
    module: "A6",
    mechanic: "Three kinds of joke that cost you liking, shown with talk-show clips: pushing someone's sensitive information for a laugh after they show discomfort, guilt-trip jokes, and teasing people who are lower in status than you.",
    rules: [
      "Watch for discomfort: verbal hesitation (cutting off mid-sentence) and self-soothing body language (hugging themselves, touching face or neck). When you see it, pull back and change topic.",
      "Rescue the moment by turning the joke on yourself, then move to something they do want to talk about.",
      "Guilt jokes ('I guess my invitation got lost') make people want to spend less time with you.",
      "Teasing works between people who are close, about things they are not sensitive about. The same joke aimed down the org chart reads as mockery.",
      "A tease that starts with a real compliment lands far more safely.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Think of a teasing line you have used with someone recently. Write it down, then answer: are we close? Are they higher, equal or lower in status? Is this something they are sensitive about? Rewrite it as a compliment-then-tease if any answer is risky." },
    check: "Your rewrite would still be fine if the person heard it repeated to their boss.",
  },

  "spch100.7.6": {
    module: "A6",
    mechanic: "Norm Macdonald's habits, broken down: smile so people expect to laugh, explain a joke that missed as if it were obviously brilliant, deliver a deliberately obvious punchline after a pause, and treat a flubbed delivery as the start of a new joke about your bad delivery.",
    rules: [
      "A mischievous smile tells people something worth laughing at is coming.",
      "If a joke misses, explaining it with a big expectant smile can get the laugh the joke did not.",
      "The anti-joke: build up with a pregnant pause, then say the least insightful thing possible. It only works if you commit fully.",
      "When you flub a story or a punchline, that is not the end of the joke — it is a new joke about how bad you are at telling it.",
      "Light playfulness lands hardest where it is least expected — the first minutes of an interview or a networking event — so keep it gentle there.",
    ],
    drill: { minutes: 6, artifact: "spoken",
      do: "Tell a friend one deliberately weak pun. If it misses, explain it slowly with a straight, proud face. Note what happened. Then retell a story and, at the point where you usually stumble, comment on your own stumble instead of rushing past it." },
    check: "You let the miss sit for at least a beat before rescuing it. Rushing on is the one move that kills both versions.",
  },

  "spch100.7.7": {
    module: "A6",
    mechanic: "A callback brings back something that got a laugh earlier, creating an inside joke with the room — and it only works if the original landed.",
    rules: [
      "A callback creates the feeling of an inside joke: nobody who missed the first part would get it.",
      "Only call back to something that worked the first time. Recalling a joke that died reminds people it died.",
      "A callback makes a good closer: it brings everything full circle.",
      "If you are stuck for a final punchline, a callback to the opening often does the job.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Take a talk or story you give. Find one line near the start that gets a reaction. Write a callback to it for your final line — the same image or phrase in a new context." },
    check: "The callback changes something about the original (new context, new twist) rather than simply repeating it.",
  },

  "spch100.7.8": {
    module: "A6",
    mechanic: "If something could distract the audience or you — a sling, a hungover 8 a.m. crowd, your own visible nerves — name it in a quick, light line at the start and move on; it shows you are present and takes the distraction away.",
    rules: [
      "The elephant in the room is anything that might distract your audience or you.",
      "Name it in a throwaway line, not a five-minute story: 'Turns out once you're over 47 you shouldn't skateboard.'",
      "For a tired audience, show that you feel their pain ('my mother always said the best cure for a hangover was a 45-minute lecture on gastroenterology').",
      "For your own nerves, a light admission can take the pressure off both of you — but only when the nerves are big enough to be noticed.",
      "Take about twelve seconds, then carry on with the talk.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "For your next talk, meeting or call, list what could distract the audience: time of day, the room, something about you, a recent event. Pick the biggest and write one light opening line that names it in under twelve seconds." },
    check: "The line acknowledges the thing without apologising for it, and it leads straight into your real opening.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.7.0": {
    takeaway: "Chris Duffy, a former elementary teacher and improv teacher, at TED: the difference between people with a great sense of humour and everyone else is often just whether they notice and accept their honest, odd reactions — and you can retrain that.",
    beats: [
      { t: "The fifth graders", d: "A worksheet on shapes comes back with friends' names; an anonymous question card reads 'What are balls for.' — with a full stop." },
      { t: "The adult improvisers", d: "His weekend students had to unlearn the idea that there was a right answer." },
      { t: "Seven weird shoes", d: "A tax lawyer started with brown, white and black shoes; with practice he got to shoes covered in gold." },
      { t: "The notebook", d: "Every comedian he knows keeps a running list of odd things they notice." },
      { t: "Mischief in serious places", d: "He made himself CEO of LinkedIn on LinkedIn; the site emailed everyone to congratulate him — until its trust team shut the account." },
    ],
    worked: "'Faith, you are taking a pretty disrespectful tone for someone who works for me.' The joke is just committing to the absurd premise he had already set up.",
    watch: "Mistaking a filter for taste. Rejecting every odd thought before you look at it leaves you nothing to choose from.",
    concepts: [],
    checks: [
      { q: "What does Duffy say often separates people with a great sense of humour from others?", opts: ["Their memory for jokes", "Whether they notice and accept their honest reactions instead of forcing them into a box", "Their accent", "How much comedy they watch"], a: 1,
        expl: "Kids do it naturally; adults can relearn it." },
      { q: "What was the 'seven weird types of shoes' exercise designed to do?", opts: ["Turn off self-judgement and let unexpected ideas through", "Teach vocabulary", "Test memory", "Find the best answer"], a: 0,
        expl: "The tax lawyer's list changed once he stopped censoring himself." },
      { q: "What habit does he say every comedian he knows shares?", opts: ["Writing at night", "Performing daily", "Keeping a notebook of odd things they notice", "Reading the news"], a: 2,
        expl: "There turns out to be no shortage of material." },
    ],
  },

  "spch100.7.1": {
    takeaway: "Dave Morris, an improviser, at TEDxVictoria: life is improvised, and the seven skills he teaches on stage — play, let yourself fail, listen, say yes, say 'and', play the game, relax and have fun — are the ones that make conversation and collaboration work.",
    beats: [
      { t: "A process, not a thing", d: "Improvisation is a way of making something — theatre, jazz, hip-hop, MacGyver's gadgets." },
      { t: "Play and fail", d: "Play happens in the moment; fear of failure drags you back into your head. Failing does not make you a failure." },
      { t: "Listening", d: "'Listening is the willingness to change.' Collaboration means taking your ego out of it." },
      { t: "Yes, and", d: "The audience says yes to every question and builds a story in seconds; saying no stops it cold. 'And' adds a brick; 'but' contradicts." },
      { t: "Play the game, relax", d: "Rules — slides, a brief, a job application — free you to improvise within them." },
    ],
    worked: "His live demo: 'Do you want to tell a story with me?' 'Yes.' 'Is it about a knight?' 'Yes.' … a whole story in thirty seconds. Then the same questions answered 'no': nothing.",
    watch: "Being a yes-man. Agreeing without adding anything keeps things pleasant but goes nowhere — the 'and' is the contribution.",
    concepts: [],
    checks: [
      { q: "How does Morris define listening?", opts: ["Waiting for your turn", "Repeating what was said", "The willingness to change", "Taking notes"], a: 2,
        expl: "If you are not willing to change, you are not really listening." },
      { q: "What is the difference between 'yes, and' and 'yes, but'?", opts: ["'And' builds on the idea; 'but' contradicts it", "They mean the same", "'But' is more polite", "'And' is for comedy only"], a: 0,
        expl: "Each person adds a brick." },
      { q: "Why does he say rules help improvisers?", opts: ["They make it fair", "They prevent mistakes", "They impress audiences", "They channel creativity by giving it constraints"], a: 3,
        expl: "Within the game's rules, you are free." },
    ],
  },

  "spch100.7.2": {
    takeaway: "Patricia Ryan Madson, who taught improvisation at Stanford for decades, at Google: improvising is a way of living — start anywhere, accept what is in the box, make sense rather than jokes, take a bow for your mistakes, and wake up to the world around you.",
    beats: [
      { t: "Start anywhere", d: "Improvisers do not wait for inspiration or the perfect beginning; the first step shows you the second." },
      { t: "The gift box", d: "Everyone opens an imaginary box. Whatever is in it is fine — trying to have a good idea blocks having any idea, and you cannot help being original." },
      { t: "Make sense", d: "'Don't make jokes, make sense.' Improv looks funny because it makes sense of what is happening." },
      { t: "The circus bow", d: "When you make a mistake, raise your arms and say 'ta-da', which moves your attention to what comes next." },
      { t: "Notice and thank", d: "Eyes closed, describe the room — nobody can fully. Ask: where am I, what am I doing, what would improve this moment? Notice who made your day possible." },
    ],
    worked: "The audience's boxes held a peacock feather, two cans of corn, a live cat, someone's wife's left shoe — fifty people, fifty different things, without anyone trying to be original.",
    watch: "Trying to be clever. Madson's whole method rests on the opposite: the obvious, honest response is usually the one that works. NOTE: the first thirteen minutes are a thank-you list to Google. She closes with a parable about a water tank of unknown size: you do not know how much time you have, so do not let it drip away.",
    concepts: [],
    checks: [
      { q: "What does Madson mean by 'don't make jokes, make sense'?", opts: ["Avoid humour at work", "Improvised scenes work by making sense of what is really happening, not by being clever", "Explain your jokes", "Use logic puzzles"], a: 1,
        expl: "The humour follows from the sense." },
      { q: "What is the 'circus bow' for?", opts: ["Ending a performance", "Greeting the audience", "Responding to a mistake so your attention moves to what comes next", "Asking for applause"], a: 2,
        expl: "Ta-da, instead of curling up in embarrassment." },
      { q: "What did the imaginary gift-box exercise show?", opts: ["That people cannot help being original when they accept their first idea", "That most people are not creative", "That gifts should be planned", "That improv needs props"], a: 0,
        expl: "Trying to come up with a good idea gets in the way." },
    ],
  },

  "spch100.7.3": {
    takeaway: "Andrew Tarvin, an engineer who left Procter and Gamble to teach humour, at TEDxTAMU: humour is a skill you learn by practice. Borrow point of view from stand-up, heightening from improv, and commitment from sketch — and know the difference between a bad joke and an inappropriate one.",
    beats: [
      { t: "Grandma's WTF", d: "'Wow, that's fun' — his grandmother's reading of WTF, and his case for a more playful outlook." },
      { t: "Not a natural", d: "Voted teacher's pet, an engineer — he learned comedy by running an improv group like a project: practice three times a week, review shows like game tape." },
      { t: "Stand-up: point of view", d: "Share a perspective to connect or to make a point — humans should come with error messages." },
      { t: "Improv: heighten", d: "'If this is true, what else is true?' — and use yes-and to turn small talk into conversation." },
      { t: "Sketch: commit", d: "Confidence makes the performance; staircase wit shortens with practice." },
      { t: "Bad versus inappropriate", d: "Nobody was ever fired for a bad joke. Keep it positive and inclusive, and a joke that misses is just a nice statement." },
    ],
    worked: "Small talk: 'How about this weather?' — 'Yes, and if you weren't here, what would you be doing in it?' The yes-and moves the exchange from filler to learning about the person.",
    watch: "Waiting to feel funny before trying. Tarvin's argument is that the confidence comes from the practice, not the other way round.",
    concepts: [],
    checks: [
      { q: "What does Tarvin say we learn from improv?", opts: ["How to memorise lines", "How to explore and heighten a point of view — if this is true, what else is true?", "How to dress for stage", "How to do impressions"], a: 1,
        expl: "Accept and build." },
      { q: "What is 'staircase wit', and what does he say about it?", opts: ["Thinking of the right line later; it is a sign of comic instinct that practice shortens", "A kind of pun", "Joking on stairs", "A stand-up technique"], a: 0,
        expl: "From four hours later, to minutes, to the moment." },
      { q: "How does he distinguish a bad joke from an inappropriate one?", opts: ["Bad jokes are longer", "Inappropriate jokes are funnier", "There is no difference", "A bad joke just doesn't land; an inappropriate one has the wrong subject, target or timing"], a: 3,
        expl: "No one gets fired for a bad joke." },
    ],
  },

  "spch100.7.4": {
    takeaway: "Jennifer Aaker and Naomi Bagdonas, who teach a Stanford course on humour, at Talks at Google: humour at work is less about being funny than about small, intentional moments of levity — and doing it well means understanding status, humour styles, and where the lines are.",
    beats: [
      { t: "The double life", d: "Bagdonas did improv at night and was so serious at her consulting job that a client guessed she spent Fridays re-ironing blouses." },
      { t: "A choice in small moments", d: "Madeleine Albright wore a huge bug brooch to meet the Russian minister after the State Department was bugged." },
      { t: "Look for what's true", d: "Write down a few true, odd observations each day. A CEO 'accidentally' left his screen shared while searching 'things inspirational CEOs say during hard times'." },
      { t: "Status", d: "Juniors feel they must prove credibility first; seniors who stay serious miss the approachability humour brings. Self-deprecation lowers status for juniors and signals confidence for seniors." },
      { t: "The lines", d: "Ask how it will make others feel; never punch down; check your distance from the subject." },
      { t: "Styles and crickets", d: "Four styles — stand-up, magnet, sniper, sweetheart. When a joke dies, name it; when you cross a line, own it and find the blind spot." },
    ],
    worked: "Bagdonas kept being goofier with a dry colleague and got nothing — like a tourist shouting louder in English. She switched to the colleague's style: a silent cat-headed bobblehead left on her desk, which became a running joke.",
    watch: "Speaking louder in your own humour style. If someone is not responding, they may just have a different style, not no sense of humour.",
    concepts: [],
    checks: [
      { q: "What is their biggest tip for having more humour in your life?", opts: ["Learn ten jokes", "Watch more comedy", "Don't look for what's funny, look for what's true", "Always go for the laugh"], a: 2,
        expl: "Become an observer of your own life." },
      { q: "How does self-deprecation work differently by status, according to them?", opts: ["It can lower perceived status for juniors but signal confidence for seniors", "It always helps", "It always hurts", "It only works for comedians"], a: 0,
        expl: "Some people over-use it, which can cost them status." },
      { q: "What do they recommend when a joke gets crickets?", opts: ["Repeat it louder", "Explain it in detail", "Apologise at length", "Name it lightly — 'well, that didn't work'"], a: 3,
        expl: "Naming it often cuts the tension enough to get a laugh." },
    ],
  },

  "spch100.7.5": {
    takeaway: "A conversation-skills channel's breakdown of talk-show clips: three kinds of joke that make people like you less — exposing sensitive information after someone shows discomfort, guilt-trip jokes, and teasing people below you — and what to do instead.",
    beats: [
      { t: "Sensitive information", d: "A host keeps pushing a guest to name an ex while she clearly wants to stop." },
      { t: "Discomfort signs", d: "Verbal hesitation, and self-soothing body language — self-hugging, touching the face or neck. Time to pivot." },
      { t: "The better move", d: "Turn the joke on yourself ('you don't want a drink? great, more for me'), then invite them to talk about what they do want to discuss." },
      { t: "Guilt jokes", d: "'I guess my invitation got lost' — the guest is visibly uncomfortable, or fires back." },
      { t: "Status and closeness", d: "The same 'nerd' tease is mockery from a host to less famous guests and affection from a wife who compliments her husband first." },
    ],
    worked: "Sofia Vergara calls her husband a nerd — after calling him handsome — and it lands, because they are close, he is not sensitive about it, and the compliment comes first.",
    watch: "Ploughing ahead because the room is laughing. Other people's laughter does not mean the person you are teasing is fine.",
    concepts: [],
    checks: [
      { q: "Which two signs of discomfort does the video say to watch for?", opts: ["Laughing and clapping", "Verbal hesitation and self-soothing body language", "Silence and eye contact", "Yawning and leaning back"], a: 1,
        expl: "When you see them, pull back and change topic." },
      { q: "Why do guilt-trip jokes backfire?", opts: ["They make the person want to spend less time with you", "They are too subtle", "They are too long", "They only work on TV"], a: 0,
        expl: "They are often hurt feelings disguised as humour." },
      { q: "When does teasing tend to land well?", opts: ["With strangers", "With people below you at work", "When it is about something they care about deeply", "Between people who are close, about something they are not sensitive about"], a: 3,
        expl: "A compliment first helps." },
    ],
  },

  "spch100.7.6": {
    takeaway: "A conversation-skills channel's breakdown of Norm Macdonald: how he made bad jokes kill — a mischievous smile, explaining jokes the audience already got, deliberately obvious punchlines after a pause, and turning his own fumbled delivery into the joke.",
    beats: [
      { t: "The smile", d: "It signals that something worth laughing at is coming." },
      { t: "Explaining the joke", d: "'Like a flower — yeah, cauliflower. No offence, but your face looks like a cauliflower.' The explanation gets the bigger laugh." },
      { t: "The anti-joke", d: "A build-up and a pause, then: kickboxing combines the grace of boxing with… kicking." },
      { t: "The obvious fake", d: "Telling a joke in the first person while making it clear it never happened to him — the bad performance becomes the joke." },
      { t: "Where it works", d: "His three-minute moth joke only works on a talk show. In life, use light playfulness where it is unexpected, like the start of an interview." },
    ],
    worked: "When you flub a story — skip a key detail, botch the punchline — the video suggests treating it as the start of a new joke about how bad you are at telling it.",
    watch: "Half-committing. A mildly dull punchline is just boring; the anti-joke only works if it is as flat as possible, delivered with total confidence. The last two minutes of the video are an advert for the channel's course.",
    concepts: [],
    checks: [
      { q: "What should you do, according to the video, when a joke doesn't land?", opts: ["Apologise", "Move on quickly", "Explain it with a big expectant smile, as if it were brilliant", "Repeat it louder"], a: 2,
        expl: "The explanation becomes the joke." },
      { q: "Why does a deliberately obvious punchline work?", opts: ["Audiences expect jokes to be non-obvious, so extreme obviousness surprises them", "It is easy to understand", "It is shorter", "It rhymes"], a: 0,
        expl: "But you must commit completely." },
      { q: "What does the video say a flubbed delivery can become?", opts: ["A reason to stop", "The beginning of a new joke about your bad delivery", "A lesson for next time", "A callback"], a: 1,
        expl: "People love a joke about how bad you are at telling jokes." },
    ],
  },

  "spch100.7.7": {
    takeaway: "A short lesson on callbacks: bring back something that got a laugh earlier, and you create the feeling of an inside joke with the room — as long as the original worked.",
    beats: [
      { t: "What it is", d: "Tell a joke, let time pass, then refer back to it." },
      { t: "Why it works", d: "It feels like an inside joke between friends — nobody who missed the first part would get it — plus a little nostalgia." },
      { t: "The condition", d: "The original must have landed. Calling back a dud reminds people it died." },
      { t: "As a closer", d: "A callback brings things full circle, and rescues you when you cannot find a final punchline." },
    ],
    worked: "In a meeting, an early laugh about the conference-room projector that never works becomes the closing line: 'and if all else fails, we'll present it on the projector.'",
    watch: "Calling back too often. One or two callbacks feel clever; five feel like a private club the newcomers are not in.",
    concepts: [],
    checks: [
      { q: "What is the one condition for a callback to work?", opts: ["It must be short", "The original joke must have landed", "It must be at the end", "It must be a pun"], a: 1,
        expl: "Otherwise you remind people of the miss." },
      { q: "Why do callbacks bond an audience?", opts: ["They create the feeling of an inside joke that only those present would get", "They are louder", "They explain the topic", "They are surprising every time"], a: 0,
        expl: "Plus a little nostalgia." },
      { q: "Where does the lesson suggest a callback works especially well?", opts: ["As the opening line", "In the middle of a story", "In written slides", "As the closer, to bring things full circle"], a: 3,
        expl: "It makes the ending feel complete." },
    ],
  },

  "spch100.7.8": {
    takeaway: "An Emmy-winning comedy writer's safest way to open with humour: acknowledge the elephant in the room — anything that could distract the audience or you — in one light line, then get on with the talk.",
    beats: [
      { t: "The definition", d: "Anything that might distract your audience or distract you." },
      { t: "The sling", d: "People will wonder what happened. 'Turns out once you're over 47 you shouldn't skateboard.' Then carry on." },
      { t: "The hungover room", d: "An 8 a.m. Vegas conference: 'My mom always said the best cure for a hangover is a 45-minute lecture on gastroenterology.'" },
      { t: "Your own nerves", d: "If you will visibly shake, a light admission ('if I pass out, drag me back to my seat and tell me I was great') can relieve both you and them." },
      { t: "Keep it short", d: "About twelve seconds. Most of the time you need not mention nerves at all — only when the elephant is that big." },
    ],
    worked: "Naming the obvious shows you are present in the same moment as the audience, which is why it lands even when the line itself is mild.",
    watch: "Spending five minutes on the elephant. A long apology or story turns a distraction into the topic.",
    concepts: [],
    checks: [
      { q: "What counts as an 'elephant in the room' here?", opts: ["Anything that could distract the audience or you", "A controversial topic", "An important guest", "A joke about animals"], a: 0,
        expl: "A sling, a hungover crowd, or your own visible nerves." },
      { q: "How long should acknowledging it take?", opts: ["Five minutes", "As long as it takes", "A few seconds — about twelve — then carry on", "Until people laugh"], a: 2,
        expl: "It is a throwaway, not a story." },
      { q: "What does the writer say about admitting nerves?", opts: ["Never do it", "Always do it", "Do it at the end", "Usually unnecessary — only when they are big enough to be noticed"], a: 3,
        expl: "Then a light line can relieve both sides." },
    ],
  },
});

// =====================================================================
// Unit IX — A4, conversation mechanics (budget 3.0 h). Listening (Celeste
// Headlee twice, Julian Treasure, William Ury, Chris Voss's mirror),
// asking and topics (Alison Wood Brooks, Charles Duhigg, Vanessa Van
// Edwards, Kio Stark), and the harder conversations — feedback (LeeAnn
// Renninger) and disagreement (Julia Dhar). The audit skill is mostly
// here: listening for what an owner actually wants, and asking questions
// that do not lead.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.8.0": {
    module: "A4",
    mechanic: "Celeste Headlee, a radio interviewer, says the skills of a good interview make a good conversation, and pick one of ten rules to master: be present, assume you will learn something, ask open questions, let your own thoughts go by, admit what you don't know, don't equate your experience with theirs, don't repeat yourself, skip the details, listen, and be brief.",
    rules: [
      "Forget performed attention — eye contact, nodding, repeating back. If you are actually paying attention, you don't need to show it.",
      "Don't pontificate. Enter every conversation assuming you have something to learn; everyone is an expert in something.",
      "Ask open questions (who, what, when, where, why, how) and let them describe it: 'what was that like?' rather than 'were you terrified?'",
      "Let thoughts come and go. The interviewer who asks an already-answered question stopped listening two minutes earlier to hold onto a clever one.",
      "It is not about you: don't match their story with yours, don't repeat yourself, leave out the dates and names, and be brief.",
    ],
    drill: { minutes: 8, artifact: "spoken",
      do: "In your next real conversation, practise only rule three. Turn every yes/no question you are about to ask into an open one ('Did you like it?' becomes 'What was it like?'). Afterwards, write down two answers you would not have heard otherwise." },
    check: "You can quote at least one thing the other person said that surprised you. If you can only remember what you said, you were not listening.",
  },

  "spch100.8.1": {
    module: "A4",
    mechanic: "Most bad conversation habits are ones we cannot see in ourselves — especially conversational narcissism, the 'shift response' that pulls attention back to you instead of the 'support response' that keeps it on them — so find yours by asking the people closest to you.",
    rules: [
      "A shift response moves the topic to you ('my son does that too…'); a support response keeps it on them ('how does that work with twins?'). Conversational narcissism is shifting every time.",
      "Write the five habits that annoy you most in others. Without showing the list, ask people close to you which of them you do. Usually it is most of them.",
      "When someone is grieving, don't share your own loss. They need you to bear witness; your story feels good to you and does nothing for them.",
      "If you cannot listen right now, say so and take a rain check rather than pretending.",
      "To start a conversation, ask people questions they know the answer to about things they care about — their city, their team, their work.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write the five conversation habits that annoy you most in other people. Send the list (without saying it is about annoying habits) to two people who know you well and ask: 'Which of these do I do?' Record the answers." },
    check: "You have answers from two people, and you have picked the one habit both mentioned to work on first.",
  },

  "spch100.8.2": {
    module: "A4",
    mechanic: "Julian Treasure says we are losing our listening, and gives five exercises to win it back — three minutes of silence a day, the mixer, savouring ordinary sounds, choosing a listening position — plus RASA for conversation: receive, appreciate, summarise, ask.",
    rules: [
      "Listening is making meaning from sound, through filters we are mostly unaware of — and those filters decide what we pay attention to.",
      "Three minutes of silence (or quiet) a day resets your ears.",
      "In noisy places, count how many separate channels of sound you can hear; savour mundane sounds.",
      "Listening positions: you can choose how you listen — critical or empathetic, active or passive — to suit what you are hearing.",
      "RASA: Receive (pay attention), Appreciate (small sounds like 'mm', 'oh'), Summarise ('so…'), Ask (questions afterwards).",
    ],
    drill: { minutes: 8, artifact: "spoken",
      do: "In your next one-to-one conversation of five minutes or more, run RASA deliberately: say nothing but small appreciation sounds until they finish a point, then start your turn with 'So…' and a one-sentence summary, then ask one question." },
    check: "The other person said 'yes, exactly' (or corrected you) after your summary. Either response means the summary did its job.",
  },

  "spch100.8.3": {
    module: "A4",
    mechanic: "William Ury, a negotiator for thirty years, says negotiation is mostly listening: it helps you understand the other side, connect, and get them to listen back — and real listening hears what is behind the words, which starts by quieting your own mind first.",
    rules: [
      "Listening may be the cheapest concession you can make: it costs nothing and buys a lot.",
      "In ordinary listening the focus is on you (where do I agree, what will I say?). In genuine listening it moves to them — their frame of reference, their emotions and needs.",
      "Ask what lies under the list of demands: 'What do you really want? What would these things give you?' The tycoon's answer was 'freedom'.",
      "Before a hard conversation, take a moment of quiet to notice your own reactions, so you can let them go and listen.",
      "Listening is contagious: someone who has been heard is more ready to hear you.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Think of a client, colleague or family member who keeps asking for specific things. Write their list of demands. Then write the question you would ask to get beneath it ('What would that give you?') and your best guess at the deeper need. Next time you talk, ask the question." },
    check: "Your guessed need is a feeling or a value (security, recognition, freedom), not another demand.",
  },

  "spch100.8.4": {
    module: "A4",
    mechanic: "The mirror — repeating the last few words someone said — invites them to keep talking and expand, without the faint interrogation of 'what do you mean by that?'",
    rules: [
      "Voss says people who are both high-IQ and high-EQ love mirrors.",
      "A mirror is a reflex tool that can bail you out in any moment.",
      "It works as a substitute for 'please go on' or 'what do you mean by that?', which carry an element of interrogation however well meant.",
      "The other person hears it as an invitation and feels encouraged, not cornered.",
    ],
    drill: { minutes: 6, artifact: "spoken",
      do: "In three conversations today, when someone says something you want to hear more about, repeat their last two or three words with a slightly curious tone — and then stay silent. Count how many sentences they add." },
    check: "At least once, the person expanded by two or more sentences without you asking a question.",
  },

  "spch100.8.5": {
    module: "A4",
    mechanic: "Alison Wood Brooks of Harvard teaches conversation as four maxims — TALK: topics, asking, levity, kindness — and her research on topics finds that we judge what others want to talk about badly, so preparing a few topics in advance makes conversations more enjoyable.",
    rules: [
      "Topics: how we prepare, select, shift and end them. Asking: asking and answering questions well. Levity: humour and play. Kindness: receptiveness to opposing views, responsive listening, and reflection afterwards.",
      "We project our own interests onto others when guessing what they want to talk about — and underweight the good signals: they introduced the topic, they laughed, they called back to it.",
      "We overweight the 'mirror question' ('how was your weekend?' back to you), which is often just politeness.",
      "In her experiments, people asked to jot down five topics beforehand enjoyed the conversation more, felt less anxious, and landed on more interesting topics.",
      "People resist preparing because it feels unnatural — but 91 per cent of her students named topic preparation as a top-three lesson.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Before your next coffee, call or client meeting, write five topics that might be fun or useful to discuss with that specific person. Keep them in your pocket. Afterwards, note which you used and which topic they introduced themselves." },
    check: "At least one of your five topics was about them (their work, their interests), not about you or the weather.",
  },

  "spch100.8.6": {
    module: "A4",
    mechanic: "Charles Duhigg: every discussion contains three possible conversations — practical (solving problems), emotional (feelings, wanting empathy) and social (identity and relationships) — and communication works when both people are in the same one, which deep questions help you find.",
    rules: [
      "Problems start when two people are having different kinds of conversation — he wanted sympathy about work; his wife offered solutions.",
      "The matching principle: recognise which conversation is happening and match it, or invite the other person to match you.",
      "Teachers ask: do you want to be helped, hugged, or heard? In ordinary life, deep questions do the same job.",
      "A deep question asks about values, beliefs or experiences: 'What do you love about your job?' rather than 'Where do you work?'",
      "The surgeon started asking 'What does this diagnosis mean to you?', listened to an emotional answer, then asked permission to move to practical options.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Write down three factual questions you ask by habit ('Where do you work?', 'How was the trip?'). Rewrite each as a deep question about values or experience. Use one of them today." },
    check: "Each rewritten question asks how the person feels about or makes sense of something, not just what happened.",
  },

  "spch100.8.7": {
    module: "A4",
    mechanic: "Vanessa Van Edwards argues we are contagious — non-verbally, verbally and emotionally — so open with visible hands and a real smile, and replace autopilot questions with ones that send the brain looking for something good.",
    rules: [
      "She says people look at hands first; hidden hands make an audience uneasy. Her team counted that the most-viewed TED speakers used far more gestures.",
      "A real smile reaches the upper cheeks; she reports that people catch the real one and not the fake one — even on the phone, a happy 'hello' rated as more likeable.",
      "'What do you do?', 'How are you?' and 'Where are you from?' scored worst in her speed-networking study.",
      "Questions send the brain looking for matches: 'Been busy?' finds stress; 'Working on anything exciting?' finds excitement.",
      "Before something nerve-racking, say 'I'm excited' instead of 'I'm nervous' — she cites a karaoke study where that reframe raised accuracy.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Write three conversation starters you could use at your next networking event or client meeting that ask for something good: an exciting project, something to look forward to, the best part of their week. Use one in your next conversation and note the reply." },
    check: "None of your three can be answered with a single word, and none invites a complaint.",
  },

  "spch100.8.8": {
    module: "A4",
    mechanic: "Kio Stark on talking to strangers: brief exchanges can create 'fleeting intimacy', and there are reliable ways in — a smile, triangulation (comment on a third thing you both see), noticing (a compliment), the dogs-and-babies principle, and disclosure.",
    rules: [
      "Use perception rather than the category 'stranger' — it frees you, and it is how you see people as individuals.",
      "People are often more open with strangers, partly because we spell everything out instead of expecting them to read our minds.",
      "Know the local rules: civil inattention in the US, Danes who would rather miss their stop, Egyptian hospitality.",
      "Ways in: a smile; triangulate on something you both see; notice something and compliment it (shoes are neutral); talk to their dog or baby.",
      "Disclosure — telling something true about yourself — is usually met with disclosure.",
    ],
    drill: { minutes: 6, artifact: "spoken",
      do: "Today, use one of Stark's openers with someone you do not know: a comment on something you can both see (triangulation) or a specific compliment (noticing). Write down what you said and how long the exchange lasted." },
    check: "You started at least one exchange. Its length does not matter; a ten-second exchange counts.",
  },

  "spch100.8.9": {
    module: "A4",
    mechanic: "LeeAnn Renninger's four-part feedback formula, from studying people others name as great feedback-givers: a micro-yes question, a specific data point instead of blur words, an impact statement, and a question back.",
    rules: [
      "Most feedback is either too soft to register or too direct, which makes people defensive.",
      "Start with a micro-yes: 'Do you have five minutes to talk about how that meeting went?' It signals feedback is coming and gives the other person a choice.",
      "Give the data point: what you saw or heard. Replace blur words ('unreliable', 'proactive') with specifics ('you said 11, and I still don't have it').",
      "State the impact: 'because I didn't get it, I was blocked.' Then ask: 'How do you see it?'",
      "Ask for feedback regularly (pulling it) rather than waiting for it to be pushed.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write one piece of feedback you have been putting off — positive or negative — in the four parts: micro-yes question, data point, impact, question. Underline any blur word and replace it with what actually happened." },
    check: "The data point contains something a camera could have recorded — no adjectives about the person.",
  },

  "spch100.8.10": {
    module: "A4",
    mechanic: "Julia Dhar, three-time world schools debating champion, says productive disagreement starts from common ground, separates ideas from the identity of the person holding them, and comes with the humility to be wrong; the TED Business host adds three kinds of question that keep it from turning defensive — probing, open and neutral.",
    rules: [
      "Find common ground first, however narrow — a shared reality to argue from.",
      "Debate the idea, not the person. Debaters don't choose their sides, so attacking the person is pointless; teams can submit ideas anonymously on one template.",
      "Embrace the humility of uncertainty. Ask: 'What have you changed your mind about, and why?' Pre-commit to what would change yours.",
      "Probing questions seek specifics ('What qualities does John bring that we lack?') instead of 'Why do you want John?'",
      "Ask open, not closed, questions, and neutral, not leading ones: 'How would you assess the project?' rather than 'Hasn't it been a great success?'",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Pick a current disagreement. Write: one thing you and the other person both agree on; the strongest version of their idea, with no reference to who they are; what would change your mind; and three questions — one probing, one open, one neutral — to ask them." },
    check: "None of your three questions can be answered yes or no, and none contains your own opinion.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.8.0": {
    takeaway: "Celeste Headlee, a public-radio interviewer, at TED: the skills that make a good interview make a good conversation. Forget performed attention; learn ten rules — and mastering just one will already help.",
    beats: [
      { t: "Why it matters", d: "She cites Pew findings on polarisation and a teacher who calls conversational competence the most overlooked skill we fail to teach." },
      { t: "Forget the tips", d: "Eye contact, nodding, repeating back — if you are really paying attention, you don't need to show it." },
      { t: "Rules 1–3", d: "Don't multitask; don't pontificate (assume you have something to learn); use open questions — 'what was that like?'" },
      { t: "Rules 4–8", d: "Let your own thoughts go by; say when you don't know; don't equate your experience with theirs; don't repeat yourself; stay out of the weeds." },
      { t: "Rules 9–10", d: "Listen — we talk at about 225 words a minute but can listen at 500, and the mind fills the gap. Be brief." },
    ],
    worked: "'Were you terrified?' gets 'yes'. 'What was that like?' makes them stop and think, and you get the real answer.",
    watch: "Waiting with a clever question while they are still talking. By the time you ask it, it may already have been answered.",
    concepts: [],
    checks: [
      { q: "Why does Headlee dismiss tips like nodding and repeating back?", opts: ["They are rude", "If you are really paying attention, you don't need to perform it", "They take too long", "They only work on radio"], a: 1,
        expl: "There is no reason to learn to look attentive if you are attentive." },
      { q: "Which is an open question in her sense?", opts: ["Were you angry?", "Did you enjoy it?", "What was that like?", "Is that right?"], a: 2,
        expl: "Open questions start with who, what, when, where, why or how." },
      { q: "What does she say about matching someone's story with your own experience?", opts: ["Don't — it is never the same, and it is not about you", "Always do it to show empathy", "Do it only with friends", "Do it at the end"], a: 0,
        expl: "Conversations are not a promotional opportunity." },
    ],
  },

  "spch100.8.1": {
    takeaway: "Celeste Headlee on her book We Need to Talk: conversation is a skill we practise, not information we memorise. The habits that hurt it most — like shifting attention to ourselves — are the ones we can't see, so ask the people around you.",
    beats: [
      { t: "A skill, like the gym", d: "You don't go once. And being bad at listening is a human problem — babies arrive knowing how to scream, not listen." },
      { t: "Shift versus support", d: "Shift responses move attention to you; support responses keep it on them. Conversational narcissism is always taking the ball." },
      { t: "The five-habits audit", d: "List the five things that annoy you most; ask people close to you how many you do. Usually it is all five." },
      { t: "Bearing witness", d: "When her friend's father died, Headlee shared her own loss. The friend snapped, 'You win.' She needed someone to listen, not a matching story." },
      { t: "Disagreement and exits", d: "Listening to someone you disagree with gives them nothing and gives you a lot. If you can't listen right now, say so and come back." },
    ],
    worked: "Her advice to a scientist who couldn't start conversations: ask where he's from, then ask what it's like. Questions people know the answer to, about things they care about, take the pressure off both of you.",
    watch: "Sharing a similar story to show empathy. It feels generous and is usually a shift response.",
    concepts: [],
    checks: [
      { q: "What is a 'support response'?", opts: ["Agreeing with everything", "A reply that keeps attention on what the other person is talking about", "Offering practical help", "Changing the subject politely"], a: 1,
        expl: "A shift response moves attention to yourself." },
      { q: "How does Headlee suggest finding your own bad habits?", opts: ["Record every conversation", "Take an online test", "List the five habits that annoy you most in others and ask people close to you which ones you do", "Ask a stranger"], a: 2,
        expl: "You'll usually find you do many of them." },
      { q: "What did her grieving friend need, in hindsight?", opts: ["Someone to bear witness and listen", "Practical advice", "A similar story", "Distraction"], a: 0,
        expl: "The matching story did nothing for her." },
    ],
  },

  "spch100.8.2": {
    takeaway: "Julian Treasure at TED: we are losing our listening in a noisy, recorded, headphone world. Five tools to get it back — silence, the mixer, savouring, listening positions — and RASA for conversation.",
    beats: [
      { t: "What listening is", d: "Making meaning from sound, using pattern recognition, differencing and filters most of us are unaware of." },
      { t: "Why we're losing it", d: "Recording, noise, headphones creating 'personal sound bubbles', and media that has to shout." },
      { t: "Three ear exercises", d: "Three minutes of silence a day; the mixer (count the channels in a noisy café); savouring mundane sounds." },
      { t: "Listening positions", d: "The most important tool: consciously choose how you listen to suit what you are hearing." },
      { t: "RASA", d: "Receive, appreciate, summarise, ask." },
    ],
    worked: "In a meeting, RASA sounds like: attention on the speaker, small 'mm' and 'right' sounds, then 'So what you're saying is…', then a question.",
    watch: "Skipping 'summarise' because it feels slow. It is the step that proves you heard, and it often corrects a misunderstanding before it costs anything.",
    concepts: [],
    checks: [
      { q: "What does RASA stand for?", opts: ["Repeat, ask, smile, agree", "Receive, appreciate, summarise, ask", "Respond, analyse, share, act", "Relax, attend, speak, answer"], a: 1,
        expl: "It is also the Sanskrit word for juice or essence." },
      { q: "Which exercise does Treasure call the most important?", opts: ["Listening positions — consciously choosing how you listen", "Three minutes of silence", "The mixer", "Savouring"], a: 0,
        expl: "It turns your filters into levers." },
      { q: "What is 'the mixer' exercise?", opts: ["Mixing music", "Talking over noise", "Counting how many separate sound channels you can hear in a noisy place", "Listening to two people at once"], a: 2,
        expl: "It sharpens the quality of your listening." },
    ],
  },

  "spch100.8.3": {
    takeaway: "William Ury, co-author of Getting to Yes, at TEDxSanDiego: listening is the missing half of communication and the heart of negotiation. It helps you understand, connect, and get heard — and the hardest part is quieting yourself first.",
    beats: [
      { t: "Hugo Chávez at midnight", d: "Shouted at for half an hour, Ury just listened until the president asked, 'So, what should I do?' — then proposed a Christmas truce." },
      { t: "Three reasons", d: "Listening helps you understand the other side, builds rapport and trust, and makes them more likely to listen to you." },
      { t: "Genuine listening", d: "From inside their frame of reference: what is said and unsaid, the emotions and needs behind the words." },
      { t: "'What do you really want?'", d: "A businessman's list of demands turned out to mean one thing: freedom. The dispute settled in four days." },
      { t: "Listen to yourself first", d: "A moment of quiet before a hard conversation lets you notice and let go of your own reactions." },
    ],
    worked: "Ury's follow-up when the list came: 'You seem to have everything. What are these things really going to give you? What do you most want in your life?'",
    watch: "Defending yourself when someone is shouting. It feels natural and starts an argument you cannot win.",
    concepts: [],
    checks: [
      { q: "Why does Ury call listening 'the cheapest concession'?", opts: ["It is quick", "It costs nothing and brings large benefits", "It avoids paying money", "It ends negotiations sooner"], a: 1,
        expl: "It helps you understand, connect, and get heard in return." },
      { q: "What did the Brazilian businessman really want, under his list of demands?", opts: ["The company headquarters", "A higher share price", "Freedom", "An apology"], a: 2,
        expl: "Once that was clear, the negotiation became much easier." },
      { q: "What does Ury say helps you listen to others?", opts: ["Listening to yourself first, in a moment of quiet", "Taking notes", "Asking many questions", "Mirroring body language"], a: 0,
        expl: "Noticing your own reactions lets you set them aside." },
    ],
  },

  "spch100.8.4": {
    takeaway: "Chris Voss, former FBI hostage negotiator, in a short clip on the mirror: repeating someone's last few words is a reflex tool that invites them to keep talking, without the hint of interrogation in 'what do you mean by that?'",
    beats: [
      { t: "IQ and EQ", d: "'IQ will get you hired, EQ will get you fired.' People skills keep you in the job." },
      { t: "A reflex tool", d: "In any moment, a mirror can bail you out." },
      { t: "Invitation, not interrogation", d: "'What do you mean by that?' has an edge of interrogation however well meant; a mirror feels like an invitation." },
      { t: "What happens", d: "People expand, feel encouraged, and do not feel cornered." },
    ],
    worked: "Client: 'The last vendor just didn't get our business.' You: 'Didn't get your business?' — and silence. They will usually tell you exactly what was missing.",
    watch: "Mirroring in a flat or sarcastic tone, or rapid-fire. Said with curiosity and followed by silence, it invites; said any other way, it mocks.",
    concepts: [],
    checks: [
      { q: "What is a mirror in Voss's sense?", opts: ["Copying someone's posture", "Repeating the last few words someone said", "Agreeing with them", "Summarising their whole point"], a: 1,
        expl: "It invites them to continue." },
      { q: "Why does he prefer a mirror to 'what do you mean by that?'", opts: ["The question has an element of interrogation; the mirror feels like an invitation", "It is shorter", "It sounds smarter", "It ends the topic"], a: 0,
        expl: "People feel encouraged rather than cornered." },
      { q: "What does 'IQ will get you hired, EQ will get you fired' mean?", opts: ["Intelligence is all that matters", "Emotional skill gets you promoted", "You can get the job on credentials and lose it for lack of people skills", "Employers prefer EQ to IQ"], a: 2,
        expl: "His point is that you need both." },
    ],
  },

  "spch100.8.5": {
    takeaway: "Alison Wood Brooks, who teaches 'How to Talk Gooder' at Harvard Business School, on the science of conversation: four maxims (TALK), a study showing we read others' topic preferences poorly, and a simple fix — prepare topics in advance.",
    beats: [
      { t: "Conversations are micro-decisions", d: "Every turn involves choices: stay on this topic or switch, ask or answer, joke or not." },
      { t: "TALK", d: "Topics, Asking, Levity, Kindness — the last defined as receptiveness to opposing views, responsive listening, and reflection afterwards." },
      { t: "Topic detection", d: "People guess their partner's topic preferences only a little better than chance, and a simple language algorithm does better." },
      { t: "Good and bad cues", d: "Underweighted: they raised the topic, they laughed, they called back to it. Overweighted: mirror questions, often just politeness." },
      { t: "Prepare topics", d: "Jotting five topics beforehand raised enjoyment, lowered anxiety, and led to more interesting conversations." },
      { t: "Status", d: "In Q&A: power makes people think less about others' preferences, and low-status people laugh more out of deference." },
    ],
    worked: "Before meeting a client you know a little, five topics on a card: the project they mentioned last time, their move to a new office, a book you both like, what's changing in their industry, their weekend hobby. You may use none; having them is what lowers the anxiety.",
    watch: "Assuming they enjoy the topic because you do. Brooks's data shows we heavily project our own preferences.",
    concepts: [],
    checks: [
      { q: "What does TALK stand for?", opts: ["Tell, ask, listen, keep going", "Topics, asking, levity, kindness", "Timing, attention, laughter, knowledge", "Truth, accuracy, logic, kindness"], a: 1,
        expl: "A play on Grice's conversational maxims." },
      { q: "Which cue does Brooks say people overweight as a sign of interest?", opts: ["Laughter", "Who introduced the topic", "Callbacks to the topic", "Mirror questions like asking 'how was your weekend?' back"], a: 3,
        expl: "Those are often just politeness." },
      { q: "What did preparing five topics in advance do in her studies?", opts: ["Increased enjoyment and reduced anxiety", "Made conversations feel forced", "Made no difference", "Shortened conversations"], a: 0,
        expl: "Prepared pairs also landed on more interesting topics." },
    ],
  },

  "spch100.8.6": {
    takeaway: "Charles Duhigg, in an animated talk: every discussion can hold three kinds of conversation — practical, emotional, social — and we connect when we match. Deep questions are the everyday way to find out which one you are in.",
    beats: [
      { t: "The trap", d: "He came home wanting sympathy; his wife gave advice. Both valid — but mismatched, so neither heard the other." },
      { t: "Three conversations", d: "Practical (plans and problems), emotional (feelings; we want empathy, not solutions), social (identity and relationships)." },
      { t: "Matching", d: "Recognise which conversation is happening, then match it or invite the other person to match you." },
      { t: "Deep questions", d: "'What do you love about your job?' instead of 'Where do you work?' They invite values and experiences." },
      { t: "The surgeon", d: "Patients ignored his advice until he began by asking 'What does this diagnosis mean to you?' — listened — and then asked to move on to options." },
    ],
    worked: "The experiment he recommends: ask someone 'When was the last time you cried in front of another person?' and then share your own answer. He cites research where people dread it beforehand and rate it as one of their best conversations afterwards.",
    watch: "Answering an emotional conversation with practical advice. It is the commonest mismatch, and it makes good advice land as an attack.",
    concepts: [],
    checks: [
      { q: "What are Duhigg's three kinds of conversation?", opts: ["Formal, informal, intimate", "Practical, emotional, social", "Business, personal, family", "Opening, middle, closing"], a: 1,
        expl: "All three can happen in one discussion." },
      { q: "What is the 'matching principle'?", opts: ["Recognising which conversation is happening and matching it, or inviting the other to match you", "Copying body language", "Matching the other person's volume", "Agreeing to keep the peace"], a: 0,
        expl: "Mismatches are why people stop hearing each other." },
      { q: "Which is a deep question?", opts: ["Where did you go to school?", "What time is the meeting?", "What was high school like, and how did it change you?", "How many people work there?"], a: 2,
        expl: "It asks about experience and meaning, not just facts." },
    ],
  },

  "spch100.8.7": {
    takeaway: "Vanessa Van Edwards at TEDxLondon: we are contagious, non-verbally, verbally and emotionally. Show your hands, smile for real, swap autopilot small talk for questions that spark, and reframe nerves as excitement.",
    beats: [
      { t: "Hands", d: "She says we look at hands first; hidden hands unsettle people. Her analysis found the most-viewed TED speakers used many more gestures." },
      { t: "Emotions spread", d: "Fear is caught (she cites a sweat study); so is happiness — but only a real smile, reaching the upper cheeks." },
      { t: "The phone", d: "In her lab, listeners could hear a happy 'hello' and rated it as more likeable." },
      { t: "Small talk that sparks", d: "In 500 speed-networking conversations, 'What do you do?' and 'How are you?' scored worst. 'Working on anything exciting?' sends the brain looking for good things." },
      { t: "I'm excited", d: "She cites a study where people who said 'I'm excited' before singing scored higher than those who said 'I'm nervous'." },
    ],
    worked: "'Been busy lately?' makes people search for stress. 'Anything good happen today?' makes them search for something good — and she argues you become more memorable for asking.",
    watch: "Treating the numbers as laws. These are her lab's findings and cited studies; the practical point — questions that invite good news work better than autopilot ones — holds either way.",
    concepts: [],
    checks: [
      { q: "Why does she suggest 'Working on anything exciting?' instead of 'Been busy?'", opts: ["It is shorter", "It sends the other person's mind looking for exciting things instead of stress", "It is more professional", "It avoids talking about work"], a: 1,
        expl: "The brain looks for hits that match the question." },
      { q: "What distinguishes a real smile, in her talk?", opts: ["Showing teeth", "It lasts longer", "It reaches the upper cheek muscles, near the eyes", "It is symmetrical"], a: 2,
        expl: "People catch the real one, not the fake." },
      { q: "What reframe does she recommend before a nerve-racking task?", opts: ["Saying 'I'm excited' instead of 'I'm nervous'", "Saying 'I'm calm'", "Saying nothing", "Taking deep breaths"], a: 0,
        expl: "Anxiety and excitement feel similar; the label changes the mindset." },
    ],
  },

  "spch100.8.8": {
    takeaway: "Kio Stark on talking to strangers: it creates 'fleeting intimacy' and frees us from seeing people as categories. Know the local rules — and try the ways in: smile, triangulate, notice, dogs and babies, disclose.",
    beats: [
      { t: "'Don't stand there'", d: "An old man told her to step off the storm drain in case she disappeared — a small, warm exchange that made her feel noticed." },
      { t: "Perception over categories", d: "'Stranger' is a shortcut that leads to bias. Most strangers aren't dangerous; we just have no context." },
      { t: "Fleeting intimacy", d: "People are often more open with strangers — and with strangers we explain everything instead of expecting mind-reading." },
      { t: "Local rules", d: "Civil inattention in the US; Danes avoiding 'excuse me'; Egyptian hospitality." },
      { t: "Ways in", d: "Smile; triangulate on a shared sight; notice (compliment shoes); talk to the dog or baby; disclose something true." },
    ],
    worked: "Triangulation at a conference: standing by the same overloaded coffee station, 'Do you think they're testing which of us gives up first?' — a third thing you both see, and an easy start.",
    watch: "Ignoring signals. Stark's first step is finding someone who is making eye contact; breaking the local rules a little is the point, ignoring someone's clear 'no' is not.",
    concepts: [],
    checks: [
      { q: "What is 'triangulation' in Stark's sense?", opts: ["Talking to three people at once", "Commenting on a third thing you and the stranger can both see", "Introducing two strangers", "Asking three questions"], a: 1,
        expl: "Public art, someone preaching, odd clothes." },
      { q: "What is the 'dogs and babies principle'?", opts: ["Avoid people with dogs", "Talk to their dog or baby as a way of seeing whether the person is open to talking", "Compliment their pet", "Ask about their children"], a: 1,
        expl: "The dog or baby is a social conduit." },
      { q: "What tends to happen when you disclose something personal to a stranger?", opts: ["They leave", "They change the subject", "They tend to disclose in return", "They become suspicious"], a: 2,
        expl: "We meet disclosure with disclosure." },
    ],
  },

  "spch100.8.9": {
    takeaway: "LeeAnn Renninger, from TED's The Way We Work: most feedback is either too soft to register or too direct to hear. Great feedback-givers use four parts — micro-yes, data point, impact, question — and ask for feedback regularly.",
    beats: [
      { t: "The problem", d: "She cites Gallup: only 26 per cent of employees strongly agree that the feedback they get improves their work." },
      { t: "Micro-yes", d: "A short question that signals feedback is coming and gives a choice: 'Can I share some ideas about that meeting?'" },
      { t: "Data point", d: "What you saw or heard. Convert blur words ('not reliable') into specifics ('you said 11; I still don't have it')." },
      { t: "Impact and question", d: "'Because of that, I was blocked.' Then: 'How do you see it?' — turning compliance into commitment." },
      { t: "Pull, don't wait", d: "Ask for feedback regularly rather than waiting for it." },
    ],
    worked: "Positive feedback needs specifics too: 'I liked how you added those stories, because it helped me grasp the concepts faster' tells the person exactly what to keep doing.",
    watch: "Blur words in praise ('great job'). They feel kind and tell the person nothing about what to repeat.",
    concepts: [],
    checks: [
      { q: "What is a 'micro-yes'?", opts: ["A small compliment", "A short yes/no question that signals feedback is coming and creates buy-in", "Agreeing quickly", "A one-word answer"], a: 1,
        expl: "It paces the conversation and gives autonomy." },
      { q: "What is a 'blur word'?", opts: ["A word that can mean different things to different people, like 'proactive'", "A filler word", "A long word", "A technical term"], a: 0,
        expl: "Convert it into an actual data point." },
      { q: "Why end feedback with a question?", opts: ["To be polite", "To end quickly", "To create commitment and joint problem-solving, not just compliance", "To check they were listening"], a: 2,
        expl: "It stops being a monologue." },
    ],
  },

  "spch100.8.10": {
    takeaway: "Julia Dhar, three-time world schools debating champion, on disagreeing productively — find common ground, debate ideas not identities, hold the humility of uncertainty — with Modupe Akinola of Columbia adding the negotiation view: ask probing, open and neutral questions.",
    beats: [
      { t: "Debate done badly", d: "Her first debate at age ten made every cable-news mistake: attacking the person, then going to extremes." },
      { t: "Common ground", d: "The best persuaders start with whatever everyone agrees on, however narrow — a shared reality." },
      { t: "Ideas, not identity", d: "Debaters don't pick their sides. At work, collect ideas anonymously on one template; half the best ones in her government project came from people who'd rarely be heard." },
      { t: "Humility", d: "Ask: what have you changed your mind about? Pre-commit to what would change yours. Mr Rogers moved a sceptical senator in 1969." },
      { t: "Better questions", d: "Probing ('what qualities does John bring?'), open ('what would you need to know to use my approach?'), neutral ('how would you assess the project?')." },
    ],
    worked: "Instead of 'Hasn't the project been a great success?' (leading) ask 'How would you assess the project so far?' (neutral) — less confrontational, and you learn what they actually think.",
    watch: "Arguing with the person rather than the idea. The moment you say 'that's such a finance view', you've made it about identity, and they will defend themselves, not the idea.",
    concepts: [],
    checks: [
      { q: "Where does Dhar say productive disagreement starts?", opts: ["With your strongest argument", "With common ground, however narrow", "With the other side's weakest point", "With data"], a: 1,
        expl: "It invites everyone into a shared reality." },
      { q: "Which is a neutral question?", opts: ["Hasn't the project been a great success?", "Are we using my approach, yes or no?", "How would you assess the project so far?", "Why do you want John?"], a: 2,
        expl: "Leading and closed questions provoke defensiveness." },
      { q: "Why does Dhar suggest collecting ideas anonymously?", opts: ["To separate ideas from the identity of the person who proposed them", "To save time", "To avoid credit disputes", "To make meetings shorter"], a: 0,
        expl: "Ideas are then judged on their merits." },
    ],
  },
});

// =====================================================================
// Unit X — A7, high-stakes talking (budget 4.5 h with the seed's
// structure-under-pressure lesson). Explaining technical work to people
// outside it (Chris Anderson, Made to Stick, Melissa Marshall, Storytelling
// with Data), the shape and opening of a persuasive talk (Nancy Duarte,
// Simon Lancaster twice), pitching (Kevin Hale and Michael Seibel of Y
// Combinator, Kindra Hall twice, Matthew Dicks), and the live part — objections, questions
// and bad news (Chris Voss three times, Alex Lyon, Seibel). This is the
// module nearest the owner's audits.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.9.0": {
    module: "A7",
    mechanic: "Chris Anderson, TED's curator, says the one thing great talks share is not a formula but a job: build a single idea in the listener's mind — one idea, a reason to care, made from concepts they already have, and worth sharing.",
    rules: [
      "Limit the talk to <strong>one major idea</strong> and make it the through-line: everything you say links back to it. Cut the rest so you have time to explain that one thing properly.",
      "Get permission with <strong>curiosity</strong>: a question that shows why something doesn't make sense and needs explaining. A gap in their picture of the world makes them want it bridged.",
      "Build the idea piece by piece from concepts the audience <em>already</em> understands — their language, not yours. The terms you live with every day are strangers to them.",
      "Use a metaphor to show the shape of the idea — Jennifer Kahn called CRISPR 'a word processor to edit DNA' — and test the talk on trusted friends to find where they get lost.",
      "Ask who the idea benefits. If it only serves you or your organisation, the audience will see through it.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Pick one finding you would give a business owner after an audit. Write it as one sentence (the idea), one question that exposes the gap ('why are you paying for three tools that do the same job?'), and one metaphor built from something the owner already knows. Read it to someone who doesn't know the business." },
    check: "The listener can repeat your one idea back in their own words. If they repeat a detail instead, the through-line is not there yet.",
  },

  "spch100.9.1": {
    module: "A7",
    mechanic: "Once you know something you can't imagine not knowing it — the curse of knowledge — so experts drift into abstraction; the cure from Chip and Dan Heath's Made to Stick, as Miriam Rich presents it, is to find the core and make it concrete, emotional and a story.",
    rules: [
      "Sticky ideas share six traits, SUCCES: <strong>simple, unexpected, concrete, credible, emotional, stories</strong>.",
      "The tapping study: people tapping out a song predicted listeners would name it half the time; listeners got 3 of 120. You hear the tune in your head — they hear knocking.",
      "Find the core and make it compact, like a proverb — 'short sentences drawn from long experience'. Then give information a little at a time, only as much as they need.",
      "Be concrete. Jerry Kaplan pitched a laptop computer by dropping a plain leather folder on the table; the investors picked it up, argued about it, and he left with 4.5 million dollars.",
      "People give to one needy person more readily than to a whole region. Feeling attaches to individuals, so give the idea a face and a story.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Take one technical thing you do (an automation, an audit check). Write how you would explain it to a peer. Then rewrite it for a shop owner, built around one concrete thing they could picture or hold, with no word they would need to ask about." },
    check: "Read the second version to someone outside your field and ask them to explain it back in one sentence. If they can't, a term or an abstraction is still in there.",
  },

  "spch100.9.2": {
    module: "A7",
    mechanic: "Melissa Marshall, who taught communication to Penn State engineers, gives an equation for explaining technical work: take your science, subtract the bullet points and the jargon, divide by relevance to the listener, multiply by your passion.",
    rules: [
      "Answer <strong>so what?</strong> first. Not 'I study trabeculae' but 'I study the mesh-like structure of bones because it matters for treating osteoporosis'.",
      "Beware jargon: why say 'spatial and temporal' when 'space and time' does the job? Accessible is not dumbed down — as simple as possible, but no simpler.",
      "Use examples, stories and analogies to make people care about the content.",
      "Drop the bullet points. Put one readable sentence on the slide that the audience can hold onto if they get lost, and a visual that does the rest.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Write the 'so what' sentence for one service you sell: 'I do X, which matters to you because Y.' Then list every jargon word in your current one-line description and swap each for a plain one." },
    check: "Your sentence names a consequence the owner cares about (money, time, risk), not a feature — and contains no word a fourteen-year-old would need explained.",
  },

  "spch100.9.3": {
    module: "A7",
    mechanic: "Cole Nussbaumer Knaflic and her Storytelling with Data colleagues make over one cluttered business slide live: visualise (get data out of tables, cut clutter, separate actual from forecast) and verbalise (words that clarify, decide whether it is a success story or a call to action, pressure-test the assumptions).",
    rules: [
      "Don't let important data hide in tables. Tables are <em>read</em>, slowly; graphs are <em>seen</em>. Use common graphs your audience already knows how to read.",
      "Find and remove clutter — borders, gridlines, diagonal labels, trailing zeros. Keep a few data labels as pointers to the comparison you want made.",
      "Make actual and forecast look different: solid lines and filled markers for what was measured, dashed or lighter for what is projected.",
      "Spell out abbreviations, define each acronym once, and call a metric the same thing everywhere. Then decide: is this a <strong>success story</strong> or a <strong>call to action</strong>?",
      "Make your assumptions explicit and talk them through with someone who knows the context. In their example the forecast on the slide was already out of reach.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take one chart or table you would show a client. Write a takeaway title — a full sentence saying what to conclude. Mark which numbers are actual and which projected. Add one line: 'This is a success story / a call to action, and the action is ...'." },
    check: "Someone glancing at it for five seconds can tell you the conclusion and what you want them to do. If they describe the chart instead, the words are not doing their job.",
  },

  "spch100.9.4": {
    module: "A7",
    mechanic: "Nancy Duarte found one shape under great talks from 'I Have a Dream' to the iPhone launch: open with what is, contrast it with what could be, move back and forth between the two, and end with a call to action and the new bliss — with the audience as the hero and the speaker as the mentor.",
    rules: [
      "The audience is the hero; you are the mentor. 'You're not Luke Skywalker, you're Yoda' — your job is to help them cross from their ordinary world into your idea.",
      "Open with <strong>what is</strong>, the status quo, and contrast it with <strong>what could be</strong>. Make that gap as wide as you can.",
      "In the middle, move back and forth between what is and what could be. People will resist; like a boat tacking into the wind, you use the resistance.",
      "End with the call to action, then the <strong>new bliss</strong>: what the world looks like once your idea is adopted.",
      "Create one moment they will always remember — Jobs switching the phone on — and use repetition, metaphor, and words the audience already holds dear.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Sketch a two-minute audit debrief as alternating lines: what is, what could be, what is, what could be — then the call to action and the new bliss, one sentence each. Six lines in total." },
    check: "The gap is concrete on both sides — a number or a scene in every 'what is' and 'what could be' line. A line that is a slogan is not doing the contrast.",
  },

  "spch100.9.5": {
    module: "A7",
    mechanic: "Simon Lancaster, a speechwriter, says to open a speech by making the audience feel something, and offers three openings sorted by the feeling they create: a joke for pleasure, a story for connection, a question for alertness.",
    rules: [
      "Never open with 'delighted to be here'. Lift the room from the first line.",
      "<strong>A joke</strong> for pleasure. Keep one go-to anecdote, plus a few lines for when something goes wrong at the start — a phone rings, the clicker dies. Self-deprecation signals confidence.",
      "<strong>A story</strong> for connection. Don't 'tell them what you're going to tell them'; wrap the point in a story with a hero and a goal — metaphorical, historical, or best of all personal.",
      "<strong>A question</strong> for alertness — emotional, factual, philosophical — or a dilemma you leave open and answer at the end, like Gandhi's sandal.",
      "Whichever you choose, the aim is a feeling. People forget what you said; they don't forget how you made them feel.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Write three openings for the same three-minute talk about your work: one joke or self-deprecating line, one personal story under 45 seconds, one open dilemma you will answer at the end. Record all three." },
    check: "Played back, each opening makes you feel something different — amused, moved, curious. If two feel the same, rewrite the weaker one.",
  },

  "spch100.9.6": {
    module: "A7",
    mechanic: "Simon Lancaster says the language of leadership is ancient rhetoric that schools stopped teaching, and shows six devices: threes, repetition, balance, metaphor, exaggeration and rhyme — worth knowing both to use and to notice being used on you.",
    rules: [
      "Put things in <strong>threes</strong>: 'government of the people, by the people, for the people'. Three sounds complete, compelling and credible.",
      "<strong>Repeat</strong> the opening of successive sentences to carry emotion — Churchill's 'we shall fight on the beaches, we shall fight on the landing grounds'.",
      "<strong>Balance</strong> a sentence: 'ask not what your country can do for you, ask what you can do for your country'. A balanced sentence sounds like balanced thinking, even when it isn't.",
      "Choose <strong>metaphors</strong> on purpose. They draw people towards things or make them recoil, and they are rarely challenged — a 'financial storm' is something nobody caused.",
      "Exaggeration and rhyme signal feeling and truth ('if it doesn't fit, you must acquit'). Rhymes are easy to swallow, which is exactly why they can hide a fallacy.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write the closing paragraph of an audit report three ways: once with a three-part list, once as a balanced sentence ('we are X, not Y'), once with a metaphor for the client's current situation. Read each aloud." },
    check: "Each version could be said in a meeting without sounding like a politician — and for the metaphor you can say what it implies and whether that is fair.",
  },

  "spch100.9.7": {
    module: "A7",
    mechanic: "Kevin Hale of Y Combinator says your only job when describing what you do is to be clear — legible to someone who knows nothing about your business — by leading with what you make and naming three nouns: the product, the problem and the customer.",
    rules: [
      "Avoid the four enemies of clarity: ambiguity, complexity (several ideas braided together), mystery (jargon, vague pronouns) and the ignorable (marketing speak, MBA speak, buzzwords).",
      "Be conversational — a description your mother would understand and be proud of. No jargon, no preamble.",
      "Be reproducible: give nouns the listener can picture. 'Airbnb is the first online marketplace that lets travelers book rooms with locals instead of hotels.'",
      "Use 'X for Y' only if X is a household success, Y clearly wants it, and Y is a big market. 'Buffer for Snapchat' fails on all three.",
      "Be concise: strip down to the nouns, then add back only the words that make the listener more excited. Lead with <em>what</em>, not why or how.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Write your one-sentence description of what you do. Circle the nouns. Cross out every adjective, adverb and buzzword, then add back only the ones that would make a shop owner more interested. Keep both versions." },
    check: "A stranger reading only your sentence could say what you make, for whom, and what problem it solves. If ten readers would picture ten different things, it is still muddy.",
  },

  "spch100.9.8": {
    module: "A7",
    mechanic: "Michael Seibel of Y Combinator breaks a pitch into a 30-second version — what you do, how big the market is, your traction — and a 2-minute version that adds your insight, business model, team and the ask, with one rule over both: talk less.",
    rules: [
      "Thirty seconds is three sentences: what you do in words your mom would understand; how big the market is; your traction, or proof you are moving fast.",
      "The two-minute pitch adds a unique insight in two sentences (you can see whether you got the 'aha'), the business model in one sentence without running away from it, the team, and the ask.",
      "For the team: anything you did that made investors money; otherwise how many founders, how many technical, how long you have known each other, and that you are full-time. Skip the awards.",
      "Know the ask cold — the instrument, the cap, how much you are raising, the minimum check. This is the one place jargon belongs.",
      "Talk less: the more you say, the more chances to say something they don't like. Then stop and let them talk.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Record your 30-second pitch as exactly three sentences: what you do, how big the market is, your traction (or how fast you are moving). Then record a two-minute version that adds the insight, the business model, the team and the ask." },
    check: "The 30-second take really is under 30 seconds, and someone hearing it once could tell a friend what you do.",
  },

  "spch100.9.9": {
    module: "A7",
    mechanic: "Kindra Hall says 'this is our story' followed by values or specifications is not a story; a business story needs an arc — normal, explosion, new normal — with an identifiable character, emotion, and a specific moment you zoom in on.",
    rules: [
      "The arc: <strong>normal</strong> (what was happening, what was at stake, how it felt), <strong>explosion</strong> (the change — something introduced, a decision made), <strong>new normal</strong> (what is possible now).",
      "Name a character — Susan or Carlos, not 'we at XYZ'. A company is not a character.",
      "Emotion doesn't need drama. Matter-of-fact frustration ('the information kept getting lost') is enough, because the listener has felt it too.",
      "Don't tell it like a résumé. Cut the steps that don't matter, find the moment, and zoom in so the listener can see it.",
      "Never fib. If something is missing, the true detail you need is there if you think harder — and a story that starts with a lie won't reach its potential.",
    ],
    drill: { minutes: 10, artifact: "spoken",
      do: "Tell the story of one client you helped in 90 seconds: normal (their name, what was going wrong, how it felt), explosion (the moment something changed), new normal (what they can do now). No 'we believe', no feature list." },
    check: "Your listener can tell you the client's name, the moment, and how it felt. If they can only tell you what you sell, you told a pitch.",
  },

  "spch100.9.10": {
    module: "A7",
    mechanic: "In a long interview, Kindra Hall argues that the stories that sell are small true moments rather than big triumphs, and describes how a sales team built a catalogue of real stories — one for each key point in their pitch.",
    rules: [
      "Small stories count. Waiting until your story is big enough is a disservice; everyday struggles are what people relate to.",
      "A product's value lives in a moment — the holiday dress that didn't fit last year and fits this year — not in claims about the product.",
      "Selling by 'shoulds' (you should buy this, you should lose weight) is the oldest, weakest form. A story lets people want it for themselves.",
      "Build a catalogue: list your differentiators and the key points of your pitch, then find a true story from inside the organisation for each, so everyone knows which story goes where.",
      "'Can I tell you a story?' moves a sceptic into curiosity. The stories must be true — and you know it's working when they tell you one back.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "List the five points you most need a client to understand in a sales or audit conversation. Next to each, write one true story — a client, a moment, an outcome — that shows it. Leave a blank where you don't have one yet." },
    check: "Every filled row has a real name or a real moment in it. The blanks are your list of stories to go and find this week.",
  },

  "spch100.9.11": {
    module: "A7",
    mechanic: "Chris Voss's accusation audit: list every accusation the other side could make against you and, instead of denying them, say them first — 'you're probably going to think I'm greedy'.",
    rules: [
      "Start the list with what you would want to deny — what you don't want them to think about you.",
      "Make the small shift from denial to observation: 'You're probably going to think...'",
      "In any deal people eventually ask themselves 'am I wasting my time?' and 'are there better alternatives?' Say it for them.",
      "Naming a negative that isn't there doesn't plant it, Voss says — it inoculates against it.",
      "Do it up front, before they raise it. It gets people collaborative faster.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Before your next sales or audit call, write the five worst things the owner might be thinking about you ('another consultant who'll tell me to buy software'). Turn each into a 'you're probably thinking...' sentence and pick the two you will open with." },
    check: "Read them aloud. If any sounds defensive or sarcastic, rewrite it as a plain observation until it doesn't.",
  },

  "spch100.9.12": {
    module: "A7",
    mechanic: "Alex Lyon, drawing on Allen Weiner's book So Smart But..., says most questions are direct — yes/no, multiple choice, fill in the blank — and a direct question gets a direct answer: the answer, about one sentence of detail, then a full stop.",
    rules: [
      "Listen for the type: yes/no ('can you have it done by Monday?'), multiple choice ('Monday or Wednesday?'), fill in the blank ('when can you have it done?'). Essay questions are a different job.",
      "Give the answer first, then about one sentence of detail. Put a period on it in your mind and stop.",
      "You can qualify without dodging: 'No; however, I can have it done by Tuesday.'",
      "Don't overcorrect into one-word answers — it sounds like brushing people off, like a coach who hates the press.",
      "After a talk, people want dialogue. Short answers make room for many turns, which is what makes Q&A satisfying.",
    ],
    drill: { minutes: 6, artifact: "recorded",
      do: "Have someone ask you ten quick questions about your work, mixing the types. Answer each with the answer, one sentence of detail, and a stop. Record it." },
    check: "Play it back: no answer runs past two sentences, and none starts with background before the answer.",
  },

  "spch100.9.13": {
    module: "A7",
    mechanic: "Michael Seibel on interviews: the founders who go furthest answer the question they were actually asked, briefly, and say 'I don't know' when they don't.",
    rules: [
      "Answer the question you were asked. Answering a different one hijacks the interviewer's line of thought — the path that was leading them to yes.",
      "If you don't know, say you don't know.",
      "Being given a few minutes doesn't mean you should fill them; your words carry more weight the fewer you use.",
      "Straightforward, fast and concise, ideally with real numbers, makes it 'downhill' to yes.",
    ],
    drill: { minutes: 5, artifact: "spoken",
      do: "Ask a friend for three hard questions about your business, including one you can't answer. Answer each in under 20 seconds. For the one you can't, say 'I don't know' and what you would do to find out." },
    check: "You said 'I don't know' once without apologising or padding, and no answer went past 20 seconds.",
  },

  "spch100.9.14": {
    module: "A7",
    mechanic: "Chris Voss's way to deliver bad news: say 'I've got bad news', pause for a count of two, then say it — instead of opening with 'how are you?'",
    rules: [
      "Don't open with 'how are you?'. People learn that it means bad news is coming, and if they are already in a hard situation it sounds clueless.",
      "Brace them first: 'I've got bad news.'",
      "Pause for about a count of two, then deliver it. Waiting longer becomes excruciating.",
      "Your job is to lessen the impact of a hard moment, not to avoid it.",
    ],
    drill: { minutes: 5, artifact: "spoken",
      do: "Think of a finding a client won't want to hear (their ads are losing money; their booking form is losing leads). Say it aloud three times in the pattern: 'I've got bad news.' — a two-count pause — the finding in one sentence." },
    check: "The finding is one sentence with no cushioning in front of it, and the pause is no more than about two seconds.",
  },

  "spch100.9.15": {
    module: "A7",
    mechanic: "Chris Voss on restarting a stalled negotiation and earning trust: ask 'have you given up on this project?', and when they reply, summarise the facts and how they feel about them until they say 'that's right'.",
    rules: [
      "'Have you given up on this project?' restarts conversations that have gone silent for weeks — nobody likes to give up, and nobody wants to say yes without knowing what that commits them to.",
      "Assume you may have contributed to the silence.",
      "When they respond, summarise their position: the facts, and how they feel about the facts. Aim for a 'that's right'.",
      "For many people, being understood matters more than getting what they want — and once they feel understood, they may change their minds.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Pick a stalled thread — a prospect who went quiet. Write the one-line 'have you given up on...?' message, and a three-sentence summary of their situation and how they probably feel about it, ready for when they reply." },
    check: "Your summary names at least one feeling, not just facts and constraints.",
  },

  "spch100.9.16": {
    module: "A7",
    mechanic: "Matthew Dicks tells how he and a friend launched a wedding-DJ business with no skill and no gear by competing on story instead of equipment — and booked 100 of the first 100 couples they met.",
    rules: [
      "If you can't win on features, don't fight there. They had a mixer, a couple of speakers and some CDs against booths full of lights and smoke machines — so they fought with story.",
      "Be the people the client would want around: tell stories about yourselves and your relationship, not about your equipment.",
      "Answer a client's worry with a story about a past client who had it: 'a year ago, Janet had the same problem — here is what she did, and here are your options.'",
      "Let the conversation do the work. Their stand was one table and one deliberately plain flyer saying who they were, what they offered and the price.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write down the three worries business owners raise most often in your audits. For each, write a 60-second story about a past client (or yourself) who had the same worry — what they did and what happened — ending with the options open to this owner." },
    check: "Each story names a person and a moment and ends with options, not a hard sell. If one is a feature list with a name attached, rewrite it.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.9.0": {
    takeaway: "Chris Anderson: a speaker's number one task is to transfer an idea into the listener's mind. Not a formula — red rug, childhood story, call to action — but one idea, built carefully out of what the audience already has.",
    beats: [
      { t: "Not a formula", d: "Overused devices come across as clichéd or manipulative. What great talks share is an idea, recreated in every listener." },
      { t: "What an idea is", d: "A pattern of information that helps you understand and navigate the world. A worldview is built from millions of them." },
      { t: "One idea, a reason to care", d: "Cut to one through-line, then stir curiosity by showing a gap in how they see things." },
      { t: "Their concepts, not yours", d: "Build from what the listener already knows; a metaphor shows the shape. Test it on friends." },
      { t: "Worth sharing", d: "Ask who the idea benefits. One that only serves you will be seen through." },
    ],
    worked: "Jennifer Kahn explaining CRISPR: 'It's as if, for the first time, you had a word processor to edit DNA.' Cut and paste is a concept everyone already has, so the new idea snaps into place.",
    watch: "Jargon you no longer notice. Anderson's warning is that terms you live with every day are completely unfamiliar to the audience — testing on a friend is how you find them.",
    concepts: [],
    checks: [
      { q: "According to Anderson, what do all great TED talks have in common?", opts: ["A personal childhood story", "An inspiring call to action", "They build a single idea in the listener's mind", "A round red rug"], a: 2,
        expl: "The devices are optional; the idea is not." },
      { q: "What does he say is the main tool for earning the audience's permission?", opts: ["Curiosity — revealing a gap in their understanding", "Humour", "Credentials", "Statistics"], a: 0,
        expl: "A disconnection in their worldview makes them want it bridged." },
      { q: "Why does the 'word processor for DNA' line work?", opts: ["It is technically complete", "It builds the new idea from a concept the listener already has", "It uses scientific vocabulary", "It is funny"], a: 1,
        expl: "Metaphor shows the shape of the pattern using something familiar." },
    ],
  },

  "spch100.9.1": {
    takeaway: "The villain of clear explanation is the curse of knowledge: once you know something, it is hard to remember not knowing it. Made to Stick's answer is to find the core, make it concrete, make people feel it, and tell a story.",
    beats: [
      { t: "SUCCES", d: "Sticky ideas are simple, unexpected, concrete, credible, emotional, and told as stories." },
      { t: "Tappers and listeners", d: "Tappers expected to be understood half the time; listeners named 3 songs in 120. The tune was only in the tapper's head." },
      { t: "The ski lift", d: "Rich's brother taught her to ski and forgot to mention getting off the lift. He had forgotten what not knowing feels like." },
      { t: "Find the core", d: "Prioritise; the model is a proverb. Too many options, even irrelevant ones, paralyse people." },
      { t: "Concrete, emotional, story", d: "Abstract truths travel in concrete language; people give to one person, not a region; stories are remembered." },
    ],
    worked: "Jerry Kaplan, 29, with no slide deck, dropped a plain leather folder on the table: 'here is a model of the next step in the computer revolution'. The partners picked it up, imagined it as a laptop and argued about memory chips — the concrete object did the explaining, and he raised 4.5 million.",
    watch: "Thinking at the expert's altitude. Experts want to talk chess strategy; the listener needs to know how the bishop moves.",
    concepts: [],
    checks: [
      { q: "In the tapping study, how often did listeners name the song?", opts: ["About half the time", "About one time in four", "About 3 times in 120", "Never"], a: 2,
        expl: "The tappers predicted 50 per cent." },
      { q: "What does SUCCES stand for?", opts: ["Simple, unexpected, concrete, credible, emotional, stories", "Short, useful, clear, correct, easy, sincere", "Structure, urgency, contrast, credibility, energy, story", "Simple, unique, catchy, credible, exciting, social"], a: 0,
        expl: "The final S is dropped from 'success'." },
      { q: "Why did Kaplan's leather folder work?", opts: ["It looked expensive", "It made an abstract idea concrete enough to handle and argue about", "It contained detailed specifications", "It surprised them with its colour"], a: 1,
        expl: "Concreteness makes an idea mean the same thing to everyone." },
    ],
  },

  "spch100.9.2": {
    takeaway: "Melissa Marshall: scientists and engineers have to invite the rest of us in. Say why it matters, cut the jargon without dumbing it down, use examples and analogies, and replace bullet points with one sentence and a picture.",
    beats: [
      { t: "So what?", d: "Relevance first: the bone research matters because of osteoporosis." },
      { t: "Jargon", d: "'Space and time', not 'spatial and temporal'. As simple as possible, but no simpler." },
      { t: "Examples, stories, analogies", d: "The ways in for someone outside the field." },
      { t: "Bullets kill", d: "Bulleted slides overload the language part of the brain. One readable sentence plus a visual." },
      { t: "The equation", d: "Science minus bullets and jargon, divided by relevance, times passion." },
    ],
    worked: "Genevieve Brown's slide: one readable sentence — the structure of trabeculae is so strong it inspired the design of the Eiffel Tower — and an image, instead of a bulleted list about bone mesh.",
    watch: "Confusing accessible with dumbed down. Marshall's point is that you can be clear without compromising the idea.",
    concepts: [],
    checks: [
      { q: "What question does Marshall say a technical speaker must answer first?", opts: ["How does it work?", "So what — why is it relevant to us?", "Who funded it?", "What was the method?"], a: 1,
        expl: "Relevance is the way in." },
      { q: "What should replace a slide full of bullet points?", opts: ["A table", "Two slides of bullets", "One readable sentence plus a visual", "A video"], a: 2,
        expl: "The sentence is something to key into if they get lost." },
      { q: "In her equation, what do you divide by?", opts: ["Relevance to the audience", "Time", "Passion", "Jargon"], a: 0,
        expl: "Then multiply by passion." },
    ],
  },

  "spch100.9.3": {
    takeaway: "A live before-and-after makeover of one business slide. Visualise — make it clear where to look — and verbalise — tell people what to see and what to do about it.",
    beats: [
      { t: "Tables hide data", d: "Tables are read, graphs are seen. A line graph showed the trend the table at the bottom of the slide buried." },
      { t: "Clutter out", d: "Border, gridlines, the box around the data, diagonal labels, trailing zeros — each removal makes the data stand out." },
      { t: "Actual versus forecast", d: "Solid for what was measured; dashed lines and hollow markers for projections, so nobody mistakes a target for a result." },
      { t: "Words that clarify", d: "No ACCTS, MOS or undefined ASP; one name per metric; the title at the top left where the eye starts." },
      { t: "Success or call to action", d: "The original read as good news. Asking the client showed the target was out of reach, so the slide became a decision." },
    ],
    worked: "Before: a red star, '77% achieved in nine months', 'great market and successful launch'. After: the title asks whether to reassess the target or change the salesforce strategy, and two graphs show accounts per manager flattening since the sales-team integration, so the forecast of 25 per manager will not happen.",
    watch: "Watch the first 24 minutes. After that the session turns into a book launch (giveaways, a discount code, workshop dates) and audience questions.",
    concepts: [],
    checks: [
      { q: "Why do graphs usually beat tables for making a point?", opts: ["They look more professional", "Tables engage the slower verbal system; graphs use the faster visual one", "Graphs hold more numbers", "Executives prefer colour"], a: 1,
        expl: "Reading numbers means scanning and holding them in your head." },
      { q: "How do they show forecast data beside actual data?", opts: ["The same solid line", "They hide the forecast", "A different format, such as dashed lines and unfilled markers", "On a separate slide"], a: 2,
        expl: "The formatting itself carries the uncertainty." },
      { q: "What turned the slide from a success story into a call to action?", opts: ["Pressure-testing the assumptions with the client", "A new colour scheme", "Adding more data", "Removing the title"], a: 0,
        expl: "Make assumptions explicit and talk to people about them." },
    ],
  },

  "spch100.9.4": {
    takeaway: "Nancy Duarte studied cinema, literature and thousands of presentations and found a shape: what is, what could be, back and forth, then a call to action and the new bliss. The audience is the hero; the presenter is the mentor.",
    beats: [
      { t: "Story versus presentation", d: "We react physically to stories; presentations flatline. She set out to find why." },
      { t: "Hero and mentor", d: "The presenter is not Luke Skywalker but Yoda, helping the audience cross into the new idea." },
      { t: "The gap", d: "Contrast the status quo with what could be, and make the gap as wide as possible." },
      { t: "Tacking", d: "Move back and forth between the two; resistance is used, the way a sailing boat uses the wind." },
      { t: "The new bliss", d: "End with the call to action and a picture of the world with the idea adopted." },
    ],
    worked: "King's bad check: 'America has given the Negro people a bad check, a check which has come back marked insufficient funds' (what is), then 'we have come to cash this check' (what could be). The first great roar came at that contrast, carried by a metaphor everyone understood.",
    watch: "Making yourself the hero. The idea goes nowhere unless the audience takes it up. A content note: the last two minutes are her own life story and mention childhood abuse.",
    concepts: [],
    checks: [
      { q: "In Duarte's model, what role does the presenter play?", opts: ["The hero", "The villain", "The narrator", "The mentor who helps the audience cross over"], a: 3,
        expl: "The audience is the hero of the idea." },
      { q: "How does a Duarte-shaped talk begin?", opts: ["With a joke", "With what is — the status quo — set against what could be", "With the call to action", "With credentials"], a: 1,
        expl: "The contrast is the inciting incident." },
      { q: "What is the 'new bliss'?", opts: ["A picture of the world with your idea adopted, used as the ending", "The opening hook", "The question and answer session", "A product demo"], a: 0,
        expl: "Jobs ended on Gretzky's puck; King on 'free at last'." },
    ],
  },

  "spch100.9.5": {
    takeaway: "Simon Lancaster: lift the audience from the first line rather than starting with a ritual thank-you. Choose the feeling you want — pleasure, connection or alertness — and open with a joke, a story or a question.",
    beats: [
      { t: "The problem", d: "Most openings are 'delighted to be here'; he claims students' brain activity in lectures is lower than in sleep." },
      { t: "A joke", d: "His go-to is Einstein's driver, plus spare one-liners for when the tech fails. Self-deprecation lifts the audience." },
      { t: "A story", d: "Telling them what you'll tell them is boring three times. Wrap the point in a story — his is the twins in the neonatal unit." },
      { t: "A question", d: "Emotional, factual, philosophical, or a prolonged dilemma." },
      { t: "Feelings", d: "Maya Angelou: people never forget how you made them feel." },
    ],
    worked: "The open dilemma: it's 1935, you are Gandhi, your sandal falls under the departing train — do you board or go back for it? Left open through a whole speech, answered at the end: he threw the other sandal down too, so whoever found them would have a pair.",
    watch: "Treat the three 'drugs' — dopamine, oxytocin, cortisol — as a memorable framing, not settled neuroscience; the brain-chemistry claims are simplified. The opening drug jokes and the 'psychopaths' line are bits, not data.",
    concepts: [],
    checks: [
      { q: "Which opening does Lancaster recommend for connection and empathy?", opts: ["A question", "A statistic", "A personal story", "A joke"], a: 2,
        expl: "Stories let the audience see the world through your eyes." },
      { q: "What is his objection to 'tell them what you're going to tell them'?", opts: ["It takes too long", "It amounts to announcing you'll be boring, being boring, then saying you were", "It is too emotional", "It confuses the audience"], a: 1,
        expl: "You can't stamp a point into someone's head." },
      { q: "How did the Gandhi question work in the speech he describes?", opts: ["It was asked, left open through the speech, and answered at the end", "It was answered immediately", "It was rhetorical, with no answer", "It was asked only at the end"], a: 0,
        expl: "The image stayed wedged in the audience's minds." },
    ],
  },

  "spch100.9.6": {
    takeaway: "Simon Lancaster: rhetoric used to be taught to everyone; now it is the privilege of a few. Threes, repetition, balance, metaphor, exaggeration and rhyme make arguments compelling — which is why you should know them both to use and to resist.",
    beats: [
      { t: "Threes", d: "Tricolon: 'veni, vidi, vici'. Short, three-part phrases sound complete and credible." },
      { t: "Repetition", d: "Repeating the opening clause is the sound of passion — and why market traders use it." },
      { t: "Balance", d: "Antithesis makes thinking sound balanced, even when the balance is an illusion." },
      { t: "Metaphor", d: "We use one roughly every 16 words, and they steer decisions on investment, crime and war." },
      { t: "Exaggeration and rhyme", d: "Emotional people overstate; rhymes feel true because they are easy to process." },
    ],
    worked: "'Calais jungle' turns migrants into wild animals; 'financial storm' makes a crisis sound like weather that nobody caused, while Pope Francis's harsher image demands a clean-up. Same events, different conclusions, decided by the picture.",
    watch: "Using the devices to dress up a weak argument. His own improvised demo shows they can make an absurd case sound plausible. A content note: there is strong language near the end.",
    concepts: [],
    checks: [
      { q: "What is a tricolon?", opts: ["A rhyme", "A metaphor", "Putting points in threes", "A repeated question"], a: 2,
        expl: "'Government of the people, by the people, for the people.'" },
      { q: "Why, according to Lancaster, do balanced sentences persuade?", opts: ["They are shorter", "A balanced sentence suggests balanced thinking, even when that is an illusion", "They rhyme", "They contain metaphors"], a: 1,
        expl: "Our brains like balance." },
      { q: "What does the 'financial storm' metaphor imply, in his reading?", opts: ["That the crisis was natural and nobody was to blame", "That the bankers caused it", "That it will last forever", "That it was predicted"], a: 0,
        expl: "A storm sweeps in and sweeps away with no need for action." },
    ],
  },

  "spch100.9.7": {
    takeaway: "Kevin Hale: investors and customers will do the selling in their own heads once they understand you — so your job is clarity. Lead with what you make, give them three nouns to picture, and cut everything that doesn't add excitement.",
    beats: [
      { t: "Clear, not sold", d: "YC reckons that for every company it interviews, another just as good was missed because its application did not express the idea clearly." },
      { t: "Four enemies", d: "Ambiguity, complexity, mystery and the ignorable — buzzwords the listener filters out like banner ads." },
      { t: "Reproducible", d: "Three nouns — product, problem, customer. 'Lumini is building X-ray vision for soldiers and first responders.'" },
      { t: "X for Y", d: "X must be a household success, Y must want it, and Y must be a big market." },
      { t: "Concise", d: "Concision tells the listener you have thought deeply and are efficient." },
    ],
    worked: "'Our company will make low-cost and low-power-consumption medical devices based on artificial intelligence and IoT suitable for sub-Saharan communities' becomes 'affordable medical devices for sub-Saharan Africa'. The AI and IoT were the how; 'low cost' was the word that earned its place.",
    watch: "Padding to look bigger. Hale sees founders defending against imagined objections inside the description itself, and every inflating word moves the listener further away.",
    concepts: [],
    checks: [
      { q: "Which three nouns should a listener be able to picture from your description?", opts: ["Team, market, revenue", "What you make, the problem, the customer", "Mission, vision, values", "Price, product, place"], a: 1,
        expl: "Without them they can't ask the next questions." },
      { q: "When does 'X for Y' fail, in Hale's terms?", opts: ["When X is a household name", "When Y is a big market", "When X is small or obscure, as in 'Buffer for Snapchat'", "When Y clearly wants X"], a: 2,
        expl: "Buffer is smaller than Snapchat, so the comparison shrinks you." },
      { q: "What does concision signal to an investor?", opts: ["That you have thought deeply and work efficiently", "That the business is small", "That you are nervous", "That you lack data"], a: 0,
        expl: "Efficient with words suggests efficient with thoughts and actions." },
    ],
  },

  "spch100.9.8": {
    takeaway: "Michael Seibel: a pitch is a 30-second version you can give anyone and a 2-minute version for someone you must convince. Anything longer is mostly a chance to say something they don't like.",
    beats: [
      { t: "Thirty seconds", d: "What you do (the mom test), how big the market is, and traction or speed." },
      { t: "Insight", d: "Two sentences of 'aha'. If they look as though they already knew it, you didn't nail it." },
      { t: "Model and team", d: "One sentence on how you make money; then founders, technical mix, how long you've known each other, full-time." },
      { t: "The ask", d: "Instrument, cap, amount, minimum check. This is where jargon belongs." },
      { t: "Fundraising", d: "Flip the power: plan to need little money, get warm intros, and book every meeting in the same week." },
    ],
    worked: "'We're Airbnb and we allow you to rent out the extra room in your house' rather than 'we're a marketplace for space' — the first needs no prior knowledge, the second needs a follow-up question.",
    watch: "Running from the business-model question. Listing advertising, maybe virtual goods, maybe something else tells the listener you don't know; say what your industry usually does and move on.",
    concepts: [],
    checks: [
      { q: "What are the three sentences of Seibel's 30-second pitch?", opts: ["Team, product, ask", "What you do, how big the market is, your traction", "Problem, solution, vision", "Mission, history, goals"], a: 1,
        expl: "From there a conversation can start." },
      { q: "What does he advise if your business model is advertising?", opts: ["Avoid mentioning it", "List several options to look flexible", "Say it plainly in one sentence and move on", "Promise to decide later"], a: 2,
        expl: "Facebook and Google are advertising businesses." },
      { q: "How should investor meetings be scheduled?", opts: ["All in the same week, after warm introductions", "One a week to stay focused", "Cold emails to as many as possible", "Only after launch"], a: 0,
        expl: "Fundraising is a sprint, not a marathon." },
    ],
  },

  "spch100.9.9": {
    takeaway: "Kindra Hall, in a customer-success podcast: calling something 'our story' doesn't make it one. Business stories need an arc — normal, explosion, new normal — with a named character, real emotion and a specific moment, and there are four kinds worth having: value, founder, purpose and customer.",
    beats: [
      { t: "Not a story", d: "'This is our story — we believe in excellence' or a list of gigabytes is just words with a label on." },
      { t: "The arc", d: "Normal (the situation and what was at stake), explosion (the inflection point), new normal (what is possible now)." },
      { t: "Components", d: "A character with a name, emotion that can be matter-of-fact, and a moment zoomed in so the listener sees it." },
      { t: "Four stories", d: "Value, founder (including your own founding moment in a role), purpose, and customer — with low production value often more believable." },
      { t: "Never fib", d: "The true detail you need is there if you think harder; a made-up one is hard to keep straight." },
    ],
    worked: "The host, Josh, tells his company's founding story unrehearsed and it comes out as a résumé — consulting, then meetings, then customer success managers. Hall's edit: add the matter-of-fact emotion (information slipping away), cut the steps that don't matter, find the moment he realised, and loop back to 'information slipping through your fingers like grains of sand'.",
    watch: "Telling it chronologically. 'First we did this, then this' is a natural first draft and reads like a résumé; the story is in the moment, not the sequence.",
    concepts: [],
    checks: [
      { q: "What are the three parts of Hall's story arc?", opts: ["Problem, solution, benefit", "Hook, body, close", "Setup, conflict, resolution", "Normal, explosion, new normal"], a: 3,
        expl: "The explosion doesn't need fireworks — just the inflection point." },
      { q: "What does Hall say about emotion in a business story?", opts: ["It must be dramatic", "Matter-of-fact frustration is enough if the audience has felt it", "It should be avoided", "Only customer stories need it"], a: 1,
        expl: "'This isn't right' is an emotion." },
      { q: "Which is NOT one of her four business story types?", opts: ["Value story", "Founder story", "Competitor story", "Customer story"], a: 2,
        expl: "The fourth is the purpose story." },
    ],
  },

  "spch100.9.10": {
    takeaway: "Kindra Hall, interviewed at length: the stories that sell are small, true moments, and a sales team can systematically build one for every point of its pitch. 'Can I tell you a story?' moves a sceptic into curiosity, and it is working when they tell one back.",
    beats: [
      { t: "The cassette", d: "Her origin story: a family minivan, five people doing five things, united by a storytelling-festival tape." },
      { t: "Small stories", d: "She used to think her life wasn't dramatic enough to tell. The small, everyday stories are the ones people relate to." },
      { t: "Value in a moment", d: "Not product claims but the dress that didn't fit last year and does this year." },
      { t: "Shoulds versus stories", d: "Telling people what they should do is the oldest form of selling; a story lets them want it themselves." },
      { t: "The catalogue", d: "A client's team took four differentiators and ten pitch points and went into the company to find a real story for each, then put them in the sales manual." },
    ],
    worked: "A volunteer firefighter calmed a frightened woman who had been misled to get the door open by asking 'Can I tell you a story?' and telling her about a colleague who went in without backup and didn't come out. She calmed down, asked questions, and let them work.",
    watch: "Skipping the first quarter-hour is tempting: it is the host's praise and Hall's own origin story, which is itself a demonstration. The teaching runs from about 15:00 to 42:00.",
    concepts: [],
    checks: [
      { q: "How did the sales team Hall describes build its story catalogue?", opts: ["They hired actors", "They found a true story inside the organisation for each key pitch point", "They wrote composite customers", "They used competitors' stories"], a: 1,
        expl: "It meant talking to customer service and breaking down silos." },
      { q: "According to Hall and her mentor Donald Davis, how do you know a story is working?", opts: ["They tell a related story back to you", "They take notes", "They laugh", "They ask for a brochure"], a: 0,
        expl: "Then you are two people sharing stories." },
      { q: "What does Hall insist on about business stories?", opts: ["They must be dramatic", "They must be short", "They must be true", "They must be about the founder"], a: 2,
        expl: "This is not an opportunity to falsify." },
    ],
  },

  "spch100.9.11": {
    takeaway: "Chris Voss's accusation audit: list every accusation the other side could make against you and say it first. Naming a negative doesn't plant it — it inoculates against it.",
    beats: [
      { t: "The list", d: "Start with what you would want to deny — 'I don't want them to think I'm greedy.'" },
      { t: "The shift", d: "From denial to observation: 'You're probably going to think I'm greedy.'" },
      { t: "Universal ones", d: "'Am I wasting my time?' and 'are there better alternatives?' come up in every deal." },
      { t: "Why up front", d: "It deactivates the negative thinking so people get collaborative faster." },
    ],
    worked: "Opening an audit call: 'You're probably wondering whether this is another consultant about to tell you to buy more software, and whether this hour is a waste of your time.' Said first, the owner doesn't have to sit on it.",
    watch: "Sarcasm. An accusation audit delivered with an edge sounds like a dare; it has to be a plain, calm observation.",
    concepts: [],
    checks: [
      { q: "Where does Voss say to start your accusation list?", opts: ["With your strengths", "With what you would want to deny", "With their weaknesses", "With the price"], a: 1,
        expl: "Then shift from denial to observation." },
      { q: "What does he say happens when you name a negative that isn't there?", opts: ["It plants the idea", "It makes you look weak", "It confuses them", "It inoculates against it rather than planting it"], a: 3,
        expl: "He admits he doesn't know why; he knows it works." },
      { q: "When should you do the accusation audit?", opts: ["Up front, before they raise the objections", "Only if they object", "At the close", "In writing afterwards"], a: 0,
        expl: "Don't wait for them to ask." },
    ],
  },

  "spch100.9.12": {
    takeaway: "Alex Lyon, from his mentor Allen Weiner's book: most questions are direct — yes/no, multiple choice, fill in the blank — and deserve a direct answer of about one sentence plus one sentence of detail, then silence.",
    beats: [
      { t: "Four question types", d: "True/false, multiple choice, fill in the blank, and essay. The first three are direct." },
      { t: "Answer, detail, stop", d: "The headline answer, about a sentence of detail, then a mental full stop." },
      { t: "Qualify, don't dodge", d: "'No; however, I can have it done by Tuesday.'" },
      { t: "Not one word", d: "A clipped 'turnovers' sounds like a coach brushing off the press." },
      { t: "Q&A is dialogue", d: "The talk was your monologue; short answers allow many turns." },
    ],
    worked: "'When can you have that project done?' is fill in the blank: 'Wednesday looks best — that leaves a day for testing.' 'Can you have it by Monday?' is yes/no: 'No; however, I can have it by Tuesday.'",
    watch: "Burying the answer under background. The line from The Hunt for Red October is the rule: you're liable to be asked some direct questions — give them direct answers.",
    concepts: [],
    checks: [
      { q: "Which kind of question is 'Does Monday or Wednesday work better?'", opts: ["Essay", "Fill in the blank", "Multiple choice", "True/false"], a: 2,
        expl: "Pick one, add a sentence, stop." },
      { q: "What should follow a direct answer?", opts: ["About one sentence of detail, then stop", "A full explanation of the background", "A question back", "Nothing at all"], a: 0,
        expl: "One-word answers overcorrect." },
      { q: "Why do concise answers suit Q&A?", opts: ["They hide weaknesses", "They allow back-and-forth dialogue, which audiences find satisfying", "They save the speaker effort", "They avoid follow-ups"], a: 1,
        expl: "The monologue is over." },
    ],
  },

  "spch100.9.13": {
    takeaway: "Michael Seibel on Y Combinator interviews: the founders who go furthest answer the question asked, briefly, and say 'I don't know' when they don't. A different answer hijacks the path the interviewer was walking towards yes.",
    beats: [
      { t: "The compliment", d: "In high school he was praised for saying 'I don't know'. Years of interviews showed him why." },
      { t: "Fewer words", d: "Having a few minutes doesn't mean filling them; impact rises as words fall." },
      { t: "The thought path", d: "The interviewer is walking a path towards yes; dodging the question interrupts it." },
      { t: "Downhill to yes", d: "Straight, fast, concise, ideally with real numbers." },
    ],
    worked: "Asked 'how many users came back last week?', the strong answer is the number, or 'I don't know — I can pull it tonight', not a tour of the roadmap.",
    watch: "Answering the question you wish you'd been asked. It feels like steering; to the listener it reads as evasion.",
    concepts: [],
    checks: [
      { q: "What did Seibel notice about the founders who do best in interviews?", opts: ["They talk the longest", "They answer the question asked and say 'I don't know' when they don't", "They bring slides", "They avoid numbers"], a: 1,
        expl: "Straightforward beats impressive." },
      { q: "Why is not answering the question costly?", opts: ["It is rude", "It wastes time only", "It takes over the interviewer's line of thought towards yes", "It shows nerves"], a: 2,
        expl: "It makes it harder to get to yes." },
      { q: "What does he say about the number of words you use?", opts: ["Their impact goes up the fewer you say", "More detail is always safer", "Use every minute you're given", "Words don't matter, only numbers"], a: 0,
        expl: "Concise and on track." },
    ],
  },

  "spch100.9.14": {
    takeaway: "Chris Voss: deliver bad news by bracing people — 'I've got bad news' — pausing for a count of two, then saying it. Not 'how are you?', which they have learned to dread.",
    beats: [
      { t: "The call", d: "He was told of a hostage's death this way at 5am, and made the same call to others all day." },
      { t: "Not 'how are you?'", d: "Well-meant, but people learn it means bad news, and in a crisis it sounds clueless." },
      { t: "Brace, pause, deliver", d: "'I've got bad news', a count of two, then the news." },
      { t: "No longer than two", d: "A longer pause becomes excruciating." },
    ],
    worked: "Telling a client their campaign lost money: 'I've got bad news.' (one, two) 'The ads you ran in September cost more than the bookings they brought in.' Then stop and let them respond.",
    watch: "Cushioning. A paragraph of reassurance before the news is the 'how are you?' habit in another form.",
    concepts: [],
    checks: [
      { q: "What does Voss say to do instead of opening with 'how are you?'", opts: ["Send an email first", "Say 'I've got bad news', pause briefly, then deliver it", "Start with good news", "Ask how their week was"], a: 1,
        expl: "It braces them." },
      { q: "How long should the pause be?", opts: ["About ten seconds", "As long as it takes", "No pause", "About a count of two"], a: 3,
        expl: "Longer is excruciating." },
      { q: "Why is 'how are you?' a poor opening for bad news?", opts: ["People associate it with bad news coming, and it can sound clueless", "It is too formal", "It takes too long", "It is impolite"], a: 0,
        expl: "You often already know how they are." },
    ],
  },

  "spch100.9.15": {
    takeaway: "Chris Voss: 'Have you given up on this project?' restarts conversations that have gone silent. When they reply, summarise their facts and feelings until you get a 'that's right' — being understood matters more to many people than winning.",
    beats: [
      { t: "The email", d: "Nobody likes to give up, and nobody wants to say yes without knowing what it commits them to; replies often come within minutes." },
      { t: "Your share", d: "There's a good chance you contributed to the silence." },
      { t: "The summary", d: "The facts, and how they feel about the facts — including feelings driving them that they're blind to." },
      { t: "That's right", d: "Once people feel understood they may change their minds about decisions already made." },
    ],
    worked: "A prospect who went quiet after a proposal gets one line: 'Have you given up on fixing the booking problem?' When they reply, the summary might be: 'It sounds like the cost was fine, but you're worried about the time it would take your staff to learn a new system during the busy season.'",
    watch: "A summary of facts only. Voss's point is the feelings about the facts; leave those out and they won't feel understood.",
    concepts: [],
    checks: [
      { q: "Why does 'have you given up on this project?' work?", opts: ["It threatens them", "It offers a discount", "Nobody likes to give up, and nobody wants to say yes to it", "It is very polite"], a: 2,
        expl: "It restarts stalled negotiations." },
      { q: "What should your summary include?", opts: ["The facts and how they feel about the facts", "Only the facts", "Your offer", "Your feelings"], a: 0,
        expl: "That earns the 'that's right'." },
      { q: "For whom, does Voss say, is being understood often more important than the deal?", opts: ["Nobody", "The assertive negotiator", "Only friends", "Only buyers"], a: 1,
        expl: "Being understood can matter more than getting what they want." },
    ],
  },

  "spch100.9.16": {
    takeaway: "Matthew Dicks: in 1997 he and his friend Benji launched a wedding-DJ company knowing nothing about weddings or music. Unable to compete on equipment, they competed on story — 37 bookings from 37 couples at their first bridal show, and 100 of the first 100 they ever met.",
    beats: [
      { t: "The yes", d: "Benji asked if he wanted to be a wedding DJ. He says yes to everything, planning to turn a yes into a no later if he must." },
      { t: "No advantage", d: "The practice party went terribly; their first wedding was free, and he ended up in the cake-cutting photos." },
      { t: "Fight with story", d: "One table, one plain red flyer, and stories — about that first wedding, and about two friends who bonded over a cartoon theme song at McDonald's." },
      { t: "Stories as answers", d: "A couple's worry got a story about an earlier couple with the same problem, and their options." },
      { t: "The result", d: "37 weddings booked before they had done their second, and a company that ran for more than 25 years." },
    ],
    worked: "A bride says she doesn't much like her father but knows she has to dance with him. Instead of advice, Dicks answers with a story: a year ago Janet had the same problem; here is what Janet did, and here are some of your options.",
    watch: "This is the opening of one of his courses, so the last minute is a pitch for his teaching. The method is in the middle: what they did at the bridal show and in client meetings.",
    concepts: [],
    checks: [
      { q: "Why did Dicks and Benji decide to 'fight with story'?", opts: ["They had studied storytelling", "They couldn't compete on music, equipment or effects", "The bridal show required it", "Their flyer was too long"], a: 1,
        expl: "Everyone else had lights and smoke machines." },
      { q: "How did he answer a bride's worry about the father-daughter dance?", opts: ["With a story about an earlier bride who had the same problem, and her options", "With a discount", "By changing the subject", "With a playlist"], a: 0,
        expl: "The story carried the advice." },
      { q: "What was their goal at the bridal show?", opts: ["To have the best-looking booth", "To hand out the most flyers", "To book the most expensive weddings", "To become people the couple would want at their wedding"], a: 3,
        expl: "Except that the couple would be paying them to come." },
    ],
  },
});

// =====================================================================
// Unit XI — B3, story selection (budget 0.5 h). The first Track B unit:
// which of your own experiences are worth telling. Deliberately small: the
// teaching that does this best — Matthew Dicks's five-second moment and his
// anecdote-or-story test — is already installed in Unit III (A1) and Unit IV
// (A2), so B3 adds only the creator's tools: a five-minute life-story
// exercise and a story bank with categories and tags.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.10.0": {
    module: "B3",
    mechanic: "A social-media director's exercise for finding which parts of your story to share: set a five-minute timer and tell your whole life story out loud — the limit forces choices, and what you choose shows what you feel defines you.",
    rules: [
      "Set a timer for five minutes and tell your life story to someone, or to a camera. No preparation.",
      "Notice what you chose. The parts you reach for under a time limit are the ones you feel define you.",
      "Notice what you left out. She skipped an experience she would have called life-shaping — that is information too.",
      "Repeat it. Each pass narrows in on the points that belong in the story you tell an audience.",
    ],
    drill: { minutes: 7, artifact: "recorded",
      do: "Set a five-minute timer and record your life story. Then list the moments you included, and one important thing you left out." },
    check: "You can say in one sentence what thread connects the moments you chose.",
  },

  "spch100.10.1": {
    module: "B3",
    mechanic: "Michelle Knight, a brand-storytelling coach, builds a story bank in about 30 minutes: capture stories under five categories using prompts, then tag each with the emotion, the lesson and the offer it leads to, so the right story is findable when you need it.",
    rules: [
      "Five categories: career and business moments; personal growth; relationships and conversations; challenges and obstacles; daily life and behind the scenes.",
      "Use prompts to fill them: your first paying client, a launch that flopped, the moment you almost quit, a conversation that reminded you why you do this, a rejection that stung.",
      "Tag every story with the <strong>emotion</strong> it creates, the <strong>lesson</strong> (so you remember the point in six months) and the <strong>offer</strong> it naturally leads to.",
      "Keep the bank where you can add to it in a moment — on your phone, by voice note — not in a notebook on a desk.",
      "Review weekly: what happened this week that I could make content from?",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Make five columns, one per category. Answer one prompt in each with a one-line story, and tag each with an emotion, a lesson and the service it leads to." },
    check: "Five stories, each with all three tags — and at least one connects naturally to something you sell.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.10.0": {
    takeaway: "Telling your life story in five minutes, against a timer, is a selection test. The limit forces choices, and the parts you choose are the ones you feel define you — which is what to share with an audience.",
    beats: [
      { t: "The prompt", d: "Found on a list of dinner questions: tell your partner your life story in five minutes." },
      { t: "Done on camera", d: "She sets the timer and goes: a wealthy town she never fitted into, choosing Buffalo for its community, a career in marketing." },
      { t: "The thread", d: "Anxiety as a teenager, therapy, and now social media for an organisation fighting mental-health stigma." },
      { t: "What was left out", d: "A programme she'd say shaped her life didn't make the five minutes." },
      { t: "Repeat", d: "Each attempt narrows in on what defines you." },
    ],
    worked: "Her five minutes become one arc she hadn't planned: not fitting in among wealth as a child, choosing a city for its community, therapy in high school, and now helping change how her community sees mental illness. The timer found the thread.",
    watch: "Treating it as a résumé. The point is not to cover everything but to see what you select; if your five minutes are dates and job titles, do it again and say what each choice meant.",
    concepts: [],
    checks: [
      { q: "What does the five-minute limit do?", opts: ["Forces choices, revealing what you feel defines you", "Makes the story funnier", "Ensures you cover everything", "Helps you memorise it"], a: 0,
        expl: "Selection is the exercise." },
      { q: "What did she notice about her own attempt?", opts: ["She ran out of time at age ten", "She left out something she'd have called life-shaping", "She only talked about work", "She couldn't think of anything"], a: 1,
        expl: "What you omit is information too." },
      { q: "How should you use the exercise over time?", opts: ["Do it once", "Only with strangers", "Repeat it to keep narrowing in on what defines you", "Write it as an essay instead"], a: 2,
        expl: "The more you do it, the clearer the points." },
    ],
  },

  "spch100.10.1": {
    takeaway: "A story bank only works if you can find the right story later. Michelle Knight files hers in five categories and tags each with emotion, lesson and offer, so a launch, a post or a video can pull exactly the story it needs.",
    beats: [
      { t: "Why a bank", d: "Stress about what to share disappears when the stories are already collected." },
      { t: "Statuses", d: "Idea, written, posted — with a link to where each story was used, so it can be reused." },
      { t: "Five categories", d: "Career moments, personal growth, relationships, challenges, and daily life behind the scenes." },
      { t: "Tags", d: "Emotion, lesson and offer connection: the coloured markers on the folders." },
      { t: "A system", d: "Phone and voice notes, a weekly review. Once you start looking, you see stories everywhere." },
    ],
    worked: "Her most-used story: signing her first paying client on a live stream after running home from work. It sits under career moments, tagged for excitement and fear, with the photo her husband took attached — and it has been reused on webinars and sales pages.",
    watch: "The tool tour. The video is sponsored by a project-management app and spends time on its AI features; the method works in any spreadsheet or notes app.",
    concepts: [],
    checks: [
      { q: "Which is NOT one of Knight's five categories?", opts: ["Career and business moments", "Challenges and obstacles", "Competitor analysis", "Daily life and behind the scenes"], a: 2,
        expl: "The other two are personal growth and relationships." },
      { q: "Why tag a story with its lesson?", opts: ["For search rankings", "So you remember the point months later when you go to use it", "To shorten it", "For the algorithm"], a: 1,
        expl: "Some stories sit untouched for six months." },
      { q: "What does the offer-connection tag do?", opts: ["Lets you find the stories that lead naturally to a particular product or service", "Sets a price", "Tracks views", "Hides private stories"], a: 0,
        expl: "This is where storytelling and selling meet." },
    ],
  },
});

// =====================================================================
// Unit XII — B1, short-form structure (budget 2.0 h). Hooks, lock-in,
// progression and payoff: Jenny Hoyos twice (her TED framework and a long
// interview), Kallaway on why hooks fail, a creator's catalogue of what the
// first three seconds of viral shorts have in common, and Brendan Kane's
// hook point. The taxonomy asked for recency weighting here; the platforms
// change, so treat specific numbers in these lessons as of their recording.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.11.0": {
    module: "B1",
    mechanic: "Jenny Hoyos's 60-second story: open with a surprising question, make the audience feel constant progression towards the answer, add conflict through a B plot, keep the answer uncertain, then give it quickly.",
    rules: [
      "Start with a question — the more unexpected the better — because people stay to learn the answer. Is fast food really faster than cooking it yourself?",
      "Make progression visible: say what's left (tomatoes, lettuce, cheese) so viewers feel how close the answer is.",
      "Smooth sailing is boring. Add conflict — her mother in the car is the B plot ('You're going to burn that car').",
      "Build tension by keeping the answer uncertain until the end.",
      "Then answer quickly and concisely. If the story takes longer than making a burger, you're overcooking both.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Pick a question from your own week whose answer you genuinely don't know (can I fix this in ten minutes? which tool is faster?). Record a 60-second story: the question, three visible steps, one thing that goes wrong, and the answer in the last line." },
    check: "It runs under 60 seconds and the answer is in the final sentence. If the answer arrives early, the seconds after it are dead.",
  },

  "spch100.11.1": {
    module: "B1",
    mechanic: "Kallaway says a hook has one job — get the viewer to opt in — and does it by delivering topic clarity and on-target curiosity; hooks fail in four ways: delay, confusion, irrelevance and disinterest.",
    rules: [
      "<strong>Delay</strong>: the topic arrives too late. Cut the fluff and put the topic in the first one or two seconds — speed to value. 'This is the craziest thing I've ever seen' tells the viewer nothing.",
      "<strong>Confusion</strong>: fewer, simpler words (a sixth-grade reading level), active voice, and the misread test — could this sentence be understood two ways?",
      "<strong>Irrelevance</strong>: say 'you' and 'your', not 'I' and 'me', and name a pain point they already have. 'If you struggle with acne, try these three things' beats 'three trends in skincare'.",
      "<strong>Disinterest</strong>: open a curiosity loop with contrast — what they already believe (A) against your alternative (B), stated or implied.",
      "Clarity usually takes the first sentence and the contrast the next one or two, so a hook is often two or three lines.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write the hook for a short about one thing you do for clients, as you would naturally say it. Then fix it in order: topic into the first line, simpler words, 'you' instead of 'I', and a contrast (most people do A; this does B)." },
    check: "Read only the first sentence to someone. They can say what the video is about and who it is for; if not, the delay or the confusion is still there.",
  },

  "spch100.11.2": {
    module: "B1",
    mechanic: "A creator coach and her team catalogued hundreds of shorts with over a million views and found that the first three seconds almost always stack several hooks at once — on-screen text, movement, a cut, sound — rather than relying on one.",
    rules: [
      "Layer hooks: in her sample, 96 per cent of viral shorts used three or more hooks in the first three seconds; only one used a single hook.",
      "Put text on screen — 81 per cent did, and those had higher engagement.",
      "Start with movement in the very first frame (something entering the shot or coming towards the camera), not a still.",
      "Cut at least once in the first three seconds; the average was twice.",
      "Match the hook to the kind of value: educational shorts often open on a question or the end result; entertaining ones on movement and a 'what is happening?' moment; relatable ones on relatable text.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Take one short you have posted or planned. Write down what happens in its first three seconds — words, on-screen text, movement, cuts, sound — and count the hooks. Redesign the opening so it has at least three." },
    check: "The new opening lists at least three distinct hooks, all pointing at the same topic. Three hooks pointing three ways is noise.",
  },

  "spch100.11.3": {
    module: "B1",
    mechanic: "Brendan Kane, author of Hook Point, says winning attention takes three things in order — a hook that stops the scroll, a story that holds the attention, and credibility so people believe it — and the hook usually works by interrupting the pattern of everything else in the feed.",
    rules: [
      "You compete with everything in the feed, not just your competitors. Say what everyone says, the way they say it, and you get scrolled past.",
      "Interrupt the pattern. Used sparingly, subvert the expectation: 'meditation is a scam' — then 'I thought so too, until...'",
      "Express the viewer's problem better than they can express it themselves. That is where credibility comes from.",
      "Don't cram purpose, mission and product into the first seconds. First get them to stop.",
      "Make it interesting to an outsider who knows nothing about your field, then narrow. Views-to-reach measures the hook, retention measures the story, comments and actions measure credibility.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write the line everyone in your field uses ('automation saves you time'). Write an honest pattern-interrupt version, and the two sentences that follow it: the viewer's problem, said better than they would say it." },
    check: "The follow-up delivers on the interrupt. If an 'X is a scam' hook is followed by a pitch for X with no turn, you have built clickbait.",
  },

  "spch100.11.4": {
    module: "B1",
    mechanic: "Jenny Hoyos breaks a short into a hook (a shock, what you're going to do, a reason to stay to the end), a build-up told with 'but' and 'so' rather than 'and then', and a payoff that is short, surprising and lands on the last word — with progress visible throughout.",
    rules: [
      "The hook is your thumbnail: open on the most shocking moment — often a cold open showing the finished result — then show how you got there.",
      "Tell it with 'but' and 'so', not 'and then'. Small conflicts keep the progression from running in a straight line.",
      "Give a mechanism of progress — an on-screen timer, a checklist of ingredients — so viewers know how close the end is. Never say 'finally' halfway through.",
      "Pace it: a fast first ten seconds, a slightly slower middle so nobody gets lost, a concise end. Characters help — aspirational yet relatable, and opposites, like her and her mother.",
      "Payoff: short, surprising, and the answer is the last word you say. Then read the analytics: viewed-versus-swiped judges the hook (she aims for 70–85 per cent); in the retention graph, look a few seconds before a drop.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Script a 45-second short as beats on sticky notes or lines: the hook, three 'but' or 'so' beats, the payoff. Mark where progress is visible on screen, and underline the last word." },
    check: "No beat begins 'and then', and the final word of the script is the answer. Anything after the answer gets cut.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.11.0": {
    takeaway: "Jenny Hoyos, whose shorts average millions of views, gives her framework in four minutes: a surprising question, constant progression, conflict, uncertainty — and a quick answer. She says it works for asking for a raise as well as for a feed.",
    beats: [
      { t: "The question", d: "People stay to find out the answer, so ask something surprising first." },
      { t: "Progression", d: "Show how close you are — each ingredient added is a step towards the answer." },
      { t: "Conflict", d: "Without it nobody is invested. Her mother is the B plot." },
      { t: "Uncertainty", d: "Keep the outcome in doubt right up to the end." },
      { t: "Quick payoff", d: "Give the answer concisely; she finishes her five-minute slot in four." },
    ],
    worked: "Can she cook a burger in the car faster than the drive-through queue moves? Each ingredient marks progress, her mother supplies the conflict ('You're doing all this for one subscriber?'), and the answer — faster, if basically raw — comes in the last seconds. Over 45 million views.",
    watch: "Over-delivering at the end. Once the question is answered, stop.",
    concepts: [],
    checks: [
      { q: "How does Hoyos recommend starting a short story?", opts: ["With your name and channel", "With a surprising question the audience wants answered", "With the ending", "With background"], a: 1,
        expl: "The question holds them to the end." },
      { q: "What role did her mother play in the burger video?", opts: ["The B plot that adds conflict", "The director", "The judge", "The narrator"], a: 0,
        expl: "Viewers also wanted to see what would happen between them." },
      { q: "Why say which ingredients are still to come?", opts: ["For the recipe", "To fill time", "To make progress visible, so viewers feel how close the answer is", "For search"], a: 2,
        expl: "Constant progression keeps people from stopping." },
    ],
  },

  "spch100.11.1": {
    takeaway: "Kallaway: a hook has one job — to make the viewer opt in — and needs two things: topic clarity and on-target curiosity. When a hook fails, it is one of four mistakes: delay, confusion, irrelevance or disinterest.",
    beats: [
      { t: "Delay", d: "Short-form retention decays steeply from the first second; every second without the topic loses viewers." },
      { t: "Confusion", d: "Fewer, simpler words, active voice, and no second way to read the sentence." },
      { t: "Irrelevance", d: "'You' instead of 'I', and a need-to-have pain point instead of a nice-to-have topic." },
      { t: "Disinterest", d: "Open a curiosity loop: each answer raises a new question." },
      { t: "Contrast", d: "A versus B — stated ('most people use X, I have something faster') or implied." },
    ],
    worked: "Confusing: 'These guys built a 30 million dollar empire and the online money they made is most difficult to earn if you don't develop a journaling practice like they did.' Clear: 'These guys built a 30 million dollar empire, and their secret for earning money online was their insane journaling practice.' The same idea, reordered.",
    watch: "Vague suspense. 'You won't believe this' has zero context; anyone who stays is staying for your face or the caption. The video also plugs his paid hooks course and an AI tool along the way.",
    concepts: [],
    checks: [
      { q: "What two things must a hook deliver, according to Kallaway?", opts: ["Topic clarity and on-target curiosity", "Humour and urgency", "A face and music", "A question and a promise"], a: 0,
        expl: "Then the viewer can decide to opt in." },
      { q: "Which fix addresses 'irrelevance'?", opts: ["Cut the first two lines", "Use simpler words", "Frame it with 'you' and a pain point the viewer already has", "Add music"], a: 2,
        expl: "The viewer needs to see it is for them." },
      { q: "What is 'implied contrast'?", opts: ["Stating A and B explicitly", "Stating your alternative and letting the viewer supply the baseline they already know", "Contradicting yourself", "Using a split screen"], a: 1,
        expl: "Your take against the field of options they already know." },
    ],
  },

  "spch100.11.2": {
    takeaway: "A creator coach's team catalogued hundreds of shorts with over a million views across more than 40 niches. The strongest pattern: the first three seconds stack several hooks — text, movement, a cut, sound — and the visuals carry most of the weight.",
    beats: [
      { t: "The sample", d: "Every short over a million views from the Shorts tab and 40-plus niche searches, logged in a spreadsheet." },
      { t: "Most common hooks", d: "Movement into frame, loud music, a zoom, and the 'what is happening?' moment." },
      { t: "Most engaging hooks", d: "Story openings, exclamations, questions, relatability and humour." },
      { t: "Hashtags", d: "Only 8 per cent of the viral shorts used any." },
      { t: "Value pillars", d: "Mostly entertainment; inspirational drew the most views, educational the most engagement." },
    ],
    worked: "A relatable short layering three hooks in three seconds: a person running towards the camera (movement), 'POV: that friend' on screen (relatable text), and a spoken question to the viewer.",
    watch: "Survivorship. The sample contains only videos that already went viral, with no flops to compare, so treat the percentages as patterns worth testing, not causes. She also plugs a paid guide midway.",
    concepts: [],
    checks: [
      { q: "What share of the viral shorts used three or more hooks in the first three seconds?", opts: ["About a quarter", "About half", "96 per cent", "All of them"], a: 2,
        expl: "Only one used a single hook." },
      { q: "What did the team find about hashtags?", opts: ["Only 8 per cent of the viral shorts used any", "Every viral short used five", "They doubled views", "They were required"], a: 0,
        expl: "Her advice: stop stressing about them." },
      { q: "Why be careful with conclusions from this sample?", opts: ["It is too small", "It only includes videos that already went viral, with no comparison group", "It covers one niche", "It was generated by AI"], a: 1,
        expl: "Patterns among winners are not proof of what made them win." },
    ],
  },

  "spch100.11.3": {
    takeaway: "Brendan Kane, on a sales podcast: in a three-second world you compete with LeBron James and Netflix, not just your rivals. A hook point wins the first part of the conversation; then a story has to hold the attention, and credibility has to make people believe it.",
    beats: [
      { t: "Three pillars", d: "Attention, story, credibility — fail any one and the others are wasted." },
      { t: "Pattern interruption", d: "'Meditation is the key to focus' has been seen a thousand times; 'meditation is a scam' stops the scroll." },
      { t: "Say their problem better", d: "Copywriter Craig Clemens: express the problem better than the customer can, and you earn trust." },
      { t: "Don't overwhelm", d: "Purpose, mission and product mean nothing until they have stopped." },
      { t: "Measure each pillar", d: "Views to reach for the hook, retention for the story, comments and conversions for credibility." },
    ],
    worked: "A Mother's Day campaign for a photo-book company was aimed at mothers over 45. Tested broadly, it landed hardest with women aged 18 to 25 — who tagged their mothers, reaching the core audience better than narrow targeting would have.",
    watch: "Subversion as a gimmick. Kane uses it sparingly, and the story must deliver; 'cold calling sucks' followed by a vanilla pitch burns the credibility you were after.",
    concepts: [],
    checks: [
      { q: "What are Kane's three pillars, in order?", opts: ["Hook, story, credibility", "Story, hook, offer", "Credibility, hook, call to action", "Price, product, promotion"], a: 0,
        expl: "If you can't grab attention you never get to the story." },
      { q: "Which metric does he use to judge whether the hook works?", opts: ["Likes", "Comment length", "Views to reach — how many who saw it watched past three seconds", "Follower count"], a: 2,
        expl: "A view is counted at three seconds." },
      { q: "Why make a hook interesting to outsiders?", opts: ["Outsiders buy more", "It widens reach, and non-buyers can share it with people who are buyers", "Algorithms penalise niches", "It removes all jargon"], a: 1,
        expl: "The daughters shared it with the mothers." },
    ],
  },

  "spch100.11.4": {
    takeaway: "Jenny Hoyos, in a long interview: a short is a moment, not a squeezed-down long video. Hook with a visual shock, build with 'but' and 'so', make progress visible, and land the answer on the last word — then let the analytics say which part failed.",
    beats: [
      { t: "A moment, not a guide", d: "A glucose monitor reacting to pasta is a short; a complete guide to diabetes is a long video." },
      { t: "Hook as thumbnail", d: "Cold-open on the finished dish so the curiosity becomes 'how?'." },
      { t: "Mechanism", d: "A timer or ingredient checklist shows how close the end is; 'finally' or 'sit back, this will take a while' make people leave." },
      { t: "Characters", d: "Aspirational yet relatable, like Spider-Man and Peter Parker; she does the cool thing and her mother tells her off." },
      { t: "Analytics", d: "Viewed-versus-swiped tests the hook; a retention graph shows an early exit, a specific drop, or a slow slide from weak progression." },
    ],
    worked: "Pasta with her mother, told with 'but': we boil the water and add salt — but that's far too much salt, so I'll add more water. We take out the pasta — oh no, it's still raw — so I'll leave it in longer. Every beat is a small conflict, so the progression never runs in a straight line.",
    watch: "Over-delivering. If the question is 'what's two plus two?', the last word is 'four'; anything after it is a reason to swipe. Her analytics advice near the end: when the retention graph drops, look a few seconds before the drop, because what came before it is what made people leave.",
    concepts: [],
    checks: [
      { q: "What does Hoyos say to use instead of 'and then'?", opts: ["'But' and 'so'", "'Next'", "'Meanwhile'", "'Finally'"], a: 0,
        expl: "Conflict keeps the progression non-linear." },
      { q: "What is a 'mechanism' in her sense?", opts: ["A camera rig", "A visible sign of progress, like an on-screen timer or ingredient checklist", "An editing app", "A sponsor"], a: 1,
        expl: "Without one, viewers feel there's no end in sight." },
      { q: "Where should the answer to the hook's question come?", opts: ["In the first five seconds", "In the middle", "As the very last word", "In the description"], a: 2,
        expl: "Once they have the answer, they leave." },
    ],
  },
});

// =====================================================================
// Unit XIII — B2, retention and reading your analytics (budget 1.5 h).
// Mostly from YouTube itself: its head of recommendations and its Shorts
// product lead, both interviewed by the creator liaison, plus a short guide
// to the shapes of a retention graph and a strategist's first look at a
// channel. The point the module exists for: reading your own graph is a
// skill, and the numbers are compared with your own videos, not anyone else's.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.12.0": {
    module: "B2",
    mechanic: "Todd Beaupré, who leads YouTube's recommendations, says the system pulls videos for each viewer at the moment they open the app rather than pushing a video out — so there is no single magic metric, and creators learn most by comparing their own videos with each other and listening to their audience.",
    rules: [
      "Recommendations are pulled per viewer and per moment — device, time of day, history. Each viewer gets a different ranking for the same video.",
      "Early viewers aren't only subscribers, and a video isn't judged on its first hour. Evergreen videos often get most of their views a month or more later.",
      "There is no single metric: click-through rate, absolute and relative watch time, likes, dislikes, comments and viewer surveys are combined, weighted differently on a TV than on a phone.",
      "Read your analytics relatively: compare a video with your others of similar length, and look for where its retention drops against your norm. Then listen to the audience, not only the numbers.",
      "The subscriptions-feed traffic source is a clean slice — the audience is the same every time, so a lower click-through there points at the content. Around 10 per cent is normal even for your best videos.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Open the analytics for your last five videos or posts. For each, write the average percentage viewed, the click-through rate, and where the biggest drop in retention is. Rank them against each other, not against anyone else's numbers." },
    check: "You can name one thing your best-retained video did that your worst did not. If your notes only say 'the algorithm', look again.",
  },

  "spch100.12.1": {
    module: "B2",
    mechanic: "A creator coach walks through the five shapes in YouTube's retention report — flat line, gradual decline, spikes, dips and the typical-retention band — and what each tells you to change in the next video.",
    rules: [
      "Flat line: viewers stayed for the whole section. He suggests keeping value constant, with a change of some kind every 8–12 seconds.",
      "A gradual decline is normal; a steep one is pacing. Cut filler so every section answers 'why should I keep watching?'",
      "Spikes are rewinds and rewatches — study what happened there and do more of it.",
      "Dips are exits and skips: tangents, slow explanations, weak transitions. Watch the section yourself at 1.5x; if it drags for you, it drags for them.",
      "The grey band is your typical retention for your last ten videos of similar length. Aim to stay above your own band, and apply the lessons to the next video rather than re-editing old ones.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Take the retention graph of one video (or sketch one for a talk you gave). Mark its biggest dip and its best spike, and write one sentence on what was happening at each." },
    check: "Each mark has a specific cause written beside it ('I explained the tool before showing the result'), not a guess like 'people got bored'.",
  },

  "spch100.12.2": {
    module: "B2",
    mechanic: "YouTube's Shorts product lead Todd Sherman and creator Jenny Hoyos agree on how to read a short: check viewed-versus-swiped first (that's the hook), then retention and rewatching — because the system estimates whether people valued their time, and allows for length.",
    rules: [
      "When a short underperforms, compare its viewed-versus-swiped-away with your last ten. Most of the time the hook lost them.",
      "Hook in the first frame: a shock (ideally visual), then what the video is about, then what they will get by the end — and deliver it.",
      "Watch time is a proxy for value, and YouTube adds surveys to estimate valued watch time, allowing for duration — so a great 15-second short can compete with a 60-second one. Rewatchability helps the short ones.",
      "Correlate your own numbers. Hoyos's team found that on her channel views tracked viewed-versus-swiped, retention and rewatching — not likes, comments or shares.",
      "Make each format on purpose; a short is not a cut-down long video. Trends are an easy start, and Hoyos makes hers evergreen by tying them to things every human does.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "List your last ten shorts or posts with one number each for the hook (viewed-versus-swiped, or how many stayed past the first seconds on other platforms). Take the lowest two and rewrite their openings: shock, what it's about, what they get at the end." },
    check: "Your rewrites change the first second, not the ending. If you rewrote the payoff, you fixed the wrong end.",
  },

  "spch100.12.3": {
    module: "B2",
    mechanic: "Paddy Galloway, a YouTube strategist, starts every channel review with views over time and the top videos, brainstorms ways to repeat, 'staircase' or adapt what worked, and checks which other channels and videos the client's audience watches.",
    rules: [
      "Start simple: views over time and the most-viewed videos. What about that period, or that video, made it work?",
      "Brainstorm 10–30 ideas that take what worked and repeat it with a twist, staircase it (take it up a level), or adapt it to a new format.",
      "Don't fear repeating yourself. Average views per viewer shows that only a tiny share of your audience watches most of your videos.",
      "Match time to impact. If the title and thumbnail drive something like 40 per cent of performance, spending 1 per cent of your time on them is a misallocation; he suggests 10–15 per cent.",
      "Look at the other channels and videos your audience watches, and which videos send you suggested traffic. That shows the cluster you are really in.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "List your three best-performing posts or talks. For each, write one 'repeat with a twist', one 'staircase' and one 'new format' idea — nine ideas in all." },
    check: "At least one of the nine is something you would have rejected as 'already done'. That is the point of the exercise.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.12.0": {
    takeaway: "YouTube's head of recommendations, Todd Beaupré, with creator liaison Rene Ritchie: the algorithm doesn't push your video out; it pulls the best videos for each viewer at the moment they open the app. Focus on audiences, compare your videos with each other, and stop reading the first hour.",
    beats: [
      { t: "Pull, not push", d: "Candidates are found and ranked for each viewer at that moment, using history and context." },
      { t: "Not a subscriber test", d: "Even in the first hour, videos reach people who have never watched the channel; the system learns per audience." },
      { t: "No magic number", d: "Click-through, absolute and relative watch time, surveys, likes, dislikes and comments — weighted differently by device." },
      { t: "Puddles don't cause rain", d: "Longer videos rise because people watching on TV want them; the algorithm follows the audience." },
      { t: "Channels as brands", d: "Same diners, same restaurant; a different value proposition deserves a different brand — and the system copes either way." },
    ],
    worked: "Ritchie's own channel: a big phone review could count on hundreds of thousands of views, an accessibility video a few thousand. Not a penalty — a smaller audience for the topic, like an arthouse film next to a blockbuster. Judge each against its own kind.",
    watch: "Over-reading the first hours. Someone on a phone clicks a notification at once; someone saving an hour-long video for the TV watches it at night or at the weekend.",
    concepts: [],
    checks: [
      { q: "How does Beaupré describe the way recommendations work?", opts: ["Each new video is pushed to subscribers first", "Candidate videos are pulled and ranked for each viewer when they open YouTube", "Videos are ranked once, globally", "The newest videos are shown first"], a: 1,
        expl: "Each viewer gets a different ranking." },
      { q: "What does he say about which metric matters most?", opts: ["Click-through rate", "Watch time", "No single metric; many are combined and weighted by context", "Likes"], a: 2,
        expl: "No metric on its own is a good indicator of value." },
      { q: "Why is the subscriptions-feed traffic source useful to a creator?", opts: ["Its audience is the same for every video, so differences point at the content", "It has the most views", "It ignores retention", "It shows revenue"], a: 0,
        expl: "A clean way to separate the content from the algorithm." },
    ],
  },

  "spch100.12.1": {
    takeaway: "Five shapes in a retention graph, and what each one says: flat is good, gradual is normal, spikes are gold, dips are exits — and the typical-retention band shows whether you beat your own average.",
    beats: [
      { t: "Flat line", d: "Viewers locked in for that section." },
      { t: "Gradual decline", d: "Normal — unless it's steep, which points at pacing." },
      { t: "Spikes", d: "Rewinds, rewatches, shares. Find out what caused them." },
      { t: "Dips", d: "Tangents, slow explanations, weak transitions." },
      { t: "Typical band", d: "Your last ten videos of similar length; stay above it." },
    ],
    worked: "His forward-looking plan: open past videos, screenshot the graphs, note the biggest dips and best spikes, leave the old videos alone, and apply the lessons to the very next upload.",
    watch: "Treating one number as the whole story. He calls retention YouTube's 'number one signal'; YouTube's own head of recommendations says no single metric decides. His 50 and 60 per cent benchmarks are his opinion, not YouTube's.",
    concepts: [],
    checks: [
      { q: "What does a spike in the retention graph usually mean?", opts: ["People rewound, rewatched or shared that moment", "People left", "An ad played", "The video ended"], a: 0,
        expl: "Study it and recreate it." },
      { q: "What is the grey band in the typical-retention view?", opts: ["Your subscribers' retention", "YouTube's average for all videos", "Your typical retention for recent videos of similar length", "The ad breaks"], a: 2,
        expl: "Your own baseline, not anyone else's." },
      { q: "What is his fix for a dip?", opts: ["Add a longer intro", "Cut or speed up that kind of section in future videos", "Re-upload the video", "Add hashtags"], a: 1,
        expl: "If it feels slow at 1.5x, it is slow." },
    ],
  },

  "spch100.12.2": {
    takeaway: "A conversation between YouTube's Shorts product lead, Todd Sherman, and Jenny Hoyos. Short form serves snackable moments; the system estimates whether people valued their time; and viewed-versus-swiped is the first number to check when a short underperforms.",
    beats: [
      { t: "Snackable", d: "A short competes with a quick game, an article, even one crossword clue — anything that fills a minute." },
      { t: "An hour per second", d: "Hoyos's process: ideas from things every human does, five story cuts, the edit as a jigsaw." },
      { t: "Valued watch time", d: "Surveys help estimate whether time was valued, allowing for length; rewatchability helps short shorts." },
      { t: "Her correlation check", d: "On her channel, time-based metrics tracked views; likes, comments and shares did not." },
      { t: "Thumbnails", d: "Feed viewers never see them; the channel page and sponsors do." },
    ],
    worked: "When a creator asks Sherman why a short flopped, he pulls up their last ten videos side by side. Almost always, the one in question had a much higher swiped-away share — the hook didn't land.",
    watch: "Generalising from one channel. Hoyos's finding about likes and shares is a correlation on her own data; Sherman's point is that the system combines every signal, weighted by how well each predicts enjoyment.",
    concepts: [],
    checks: [
      { q: "What is the first metric Sherman checks when a short underperforms?", opts: ["Likes", "Viewed versus swiped away", "Subscriber count", "Comments"], a: 1,
        expl: "Usually the hook didn't get them." },
      { q: "What is 'valued watch time'?", opts: ["An estimate, using surveys among other things, of whether viewers valued the time they spent", "Watch time on paid content", "Time spent choosing a thumbnail", "The average length of all shorts"], a: 0,
        expl: "It goes beyond raw watch time." },
      { q: "Why do Hoyos's shorts still get thumbnails?", opts: ["They drive most feed views", "The algorithm requires them", "For the channel page and for showing past work to brands", "To hide spoilers"], a: 2,
        expl: "Feed viewers decide from the video itself." },
    ],
  },

  "spch100.12.3": {
    takeaway: "Paddy Galloway, interviewed by YouTube's creator liaison: the first thing he looks at is views over time and the top videos. What worked can be repeated, staircased or adapted — and almost nobody watches enough of your channel to notice.",
    beats: [
      { t: "Views over time", d: "Which periods performed, and what about them led to it." },
      { t: "Top videos, new ideas", d: "Brainstorm 10–30 ideas from what made the winners work." },
      { t: "Average views per viewer", d: "A tiny share of viewers watch any significant portion of your videos." },
      { t: "Click versus delivery", d: "Roughly 40 per cent the packaging, 60 per cent whether the video delivered." },
      { t: "Your real cluster", d: "Other channels your audience watches, and where suggested traffic comes from." },
    ],
    worked: "A client spends perhaps 1 per cent of their time on the title and thumbnail when those may account for around 40 per cent of a video's performance. His suggestion isn't 40 per cent of the time — it's 10 or 15.",
    watch: "Ticking an idea off as done. Galloway asks whether a winning idea can be repeated with a twist, or taken up a level, before moving on.",
    concepts: [],
    checks: [
      { q: "What does Galloway look at first on a new client's channel?", opts: ["Views over time and the most-viewed videos", "Comments", "Thumbnail colours", "Upload schedule"], a: 0,
        expl: "Correlation spreadsheets come later." },
      { q: "What does 'staircasing' an idea mean?", opts: ["Repeating it identically", "Taking a proven idea up another level", "Splitting it into parts", "Posting it at a different time"], a: 1,
        expl: "Alongside repeating with a twist and adapting to a new format." },
      { q: "Why does he check the other channels your audience watches?", opts: ["To copy them exactly", "To report them", "To find the cluster of YouTube you are really in, and ideas your audience already likes", "To choose collaborators only"], a: 2,
        expl: "You may be in a different cluster than you thought." },
    ],
  },
});

// =====================================================================
// Unit XIV — B6, delivery on camera (budget 0.6 h). Small on purpose: Unit V
// (A3) carries voice, body, pauses and nerves, and the taxonomy calls B6 the
// delta. That delta is the lens: a TV director on owning the words and
// talking to one person, two presenter trainers on eye line and energy, Ali
// Abdaal's two modes, the over-the-top-then-down drill, and a 30-day
// record-and-rate habit from a creator with an accent he worried about.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.13.0": {
    module: "B6",
    mechanic: "A television director who has filmed thousands of presenters says talking to camera is an ownership skill, not a performance skill: own every word, talk to one specific person, keep a natural rhythm of eye contact, and run two or three notches above your normal energy.",
    rules: [
      "Own the words. Even if AI or someone else helped write the script, read it aloud, change the words you'd never say, and mark it up — capitals for emphasis, line breaks, pauses.",
      "Keep the language simple. Plain words are easy to say and easy to hear; that isn't dumbing down.",
      "Talk to one specific person, not 'hey guys'. Imagine you are on a video call with them, and your phrasing, pauses and warmth change.",
      "Don't lock onto the lens. Read a few words ahead, glance away as you would when thinking, and come back to the lens to land a key line.",
      "Be the same person, two or three notches higher. Script first to build the pattern, go off script later — and take the pressure off: the reps matter, the single video doesn't.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Write a 45-second script about one thing you do. Read it aloud and change every word you wouldn't say; mark the emphasis and the pauses. Then record it to one named person as if on a video call, glancing away once and coming back to the lens for your key line." },
    check: "Someone who knows you watches it and says it sounds like you. If they say it sounds like you reading, the words still aren't yours.",
  },

  "spch100.13.1": {
    module: "B6",
    mechanic: "A presenter trainer's rule for a piece to camera: keep your eyes on the lens even though it gives you no reaction, and only look away at something the audience can see.",
    rules: [
      "Looking into the lens reads as looking into the viewer's eyes; avoiding it looks insecure, even shifty.",
      "Your instinct is to look for a reaction — a floor manager, a friend beside the camera. Resist it.",
      "Assume that what you're saying is going down as well as it possibly could. Be a little presumptuous.",
      "Look away only at something the viewer can see (the cup in your hand), never at something off-screen.",
    ],
    drill: { minutes: 5, artifact: "recorded",
      do: "Record 30 seconds to camera with someone standing beside it. Keep your eyes on the lens through your best line, and look away only once, at an object in shot." },
    check: "In playback your eyes never drift to the person beside the camera. If they do, put the person behind you and try again.",
  },

  "spch100.13.2": {
    module: "B6",
    mechanic: "A presenter trainer shows in ninety seconds what happens to a piece to camera when energy and expression drop and nerves come out as movement — rocking, wobbling, eyes sliding off the lens.",
    rules: [
      "A still body, a clear eye line and energy work together; lose any one and the viewer notices.",
      "Flatten the peaks and troughs in your voice and face and you lose the viewer, even if everything else is right.",
      "Nervous energy leaks out as movement: small wobbles, rocking as if you're on a boat.",
      "Pick up the energy, sit or stand still, use your hands a little. An occasional move is fine; constant pacing helps you, not the viewer.",
    ],
    drill: { minutes: 5, artifact: "recorded",
      do: "Record the same 20 seconds three ways: flat and still; energetic but rocking; energetic, still, with a few gestures. Watch them back to back." },
    check: "You can see the difference between the second and third takes. If you can't, move the phone back so your whole upper body is in shot.",
  },

  "spch100.13.3": {
    module: "B6",
    mechanic: "Ali Abdaal, who went from shy to filming every week, separates two ways of talking to a lens — coffee mode (a friend across the table) and presenter mode (a small group, energy up) — because the camera takes about two points off your charisma.",
    rules: [
      "Coffee mode: the camera is a friend over coffee. Use it for calls, negotiations, sales and heartfelt videos.",
      "Presenter mode: the camera takes about two points of charisma out of ten, so speak at 6.5–7 to come across at 5. He pictures three or four students in front of him.",
      "Be yourself — your words, your jokes. A 1950s announcer voice sounds fake.",
      "Speak through a smile; it changes your voice and your own energy. Use your hands, elbows relaxed, in the space in front of you.",
      "Warm up before you film (he sings along to music), and get reps — even video messages to friends instead of texts.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Record the same 30 seconds twice: once in coffee mode to one friend, once in presenter mode to a small group. Then send one video message to a friend today instead of a text." },
    check: "You can say which mode suits your next short and why — and the video message has been sent.",
  },

  "spch100.13.4": {
    module: "B6",
    mechanic: "A course-video coach's five tips for a talking-head shot — vary your gestures, find your comfortable position, dial it up, practise with retakes, stay yourself — and the drill that matters most: go over the top first, then bring it down.",
    rules: [
      "Vary your gestures. The same arm movement on every sentence becomes the thing people notice.",
      "Find the position you are comfortable in — sitting, standing, leaning on a desk. Leaning forward reads as engaged.",
      "Dial it up: what feels natural to you will probably look bored on camera. If it feels dramatic and over the top, it probably looks fine.",
      "Go way over the top first, then review and tone it down. Bringing energy down a notch is easier than pushing it up bit by bit.",
      "Practise, and don't fear retakes — but don't change your personality. The point is your best self, not someone else's.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Record 20 seconds at what feels like ridiculous, over-the-top energy. Then record the same 20 seconds at what feels normal. Watch both and choose the level between them that looks right." },
    check: "The level you choose is closer to the over-the-top take than you expected. If you chose the 'normal' one, show both to someone else and let them choose.",
  },

  "spch100.13.5": {
    module: "B6",
    mechanic: "A creator who spent a year without posting broke the block by recording himself every day for 30 days and rating each take — pace, pronunciation, engagement, energy, charisma — aiming for one small improvement a day, not perfection.",
    rules: [
      "Perfectionism kept him at zero uploads for eleven months. Focus on the next recording, not the finished channel.",
      "Record every day for 30 days — your day, a story, anything — unscripted.",
      "After each take, note the weak and strong points and rate pace, pronunciation, engagement, energy and charisma.",
      "In practice only, imitate a creator you admire to stretch your range ('imitate to enhance'). Use your hands; speak through a smile.",
      "Avoid 'British Airways mode' — the over-polished announcer voice.",
    ],
    drill: { minutes: 5, artifact: "recorded",
      do: "Start your own 30 days today: record two minutes telling one story from yesterday, unscripted. Rate it 1–5 on pace, pronunciation, engagement, energy and charisma, and write one thing to change tomorrow." },
    check: "A dated rating sheet exists with today's five numbers and tomorrow's one change.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.13.0": {
    takeaway: "A TV director who has filmed thousands of presenters: talking to camera is ownership, not performance. Own the words, talk to one person, keep a natural eye rhythm, and run two or three notches higher than you would in a room.",
    beats: [
      { t: "Ownership", d: "Coached, scripted executives at a launch in Berlin couldn't make sense of their own sentences; presenters who write their own mark up the prompter." },
      { t: "One person", d: "'Hey guys' flattens everything. Picture a video call with one friend." },
      { t: "Eye rhythm", d: "A phone has no prompter glass. Read ahead, glance away, come back for the key line." },
      { t: "Two or three notches", d: "The camera strips texture out; a heightened version of yourself puts it back." },
      { t: "Reps", d: "Script first, then off script; around video ten the lens starts to feel like a face." },
    ],
    worked: "Kirsty Young recording the closing link for the Queen's funeral: weeks spent on every word, so that in front of the prompter the emotion still came through. She owned every syllable before she said it.",
    watch: "A locked stare. Looking into the lens the whole time feels as unnatural to the viewer as it does to you — and notes off to one side make the viewer wonder who you're talking to. The video includes a plug for his paid course.",
    concepts: [],
    checks: [
      { q: "What does the director say talking to camera mostly is?", opts: ["A performance skill", "An ownership skill — knowing and owning every word", "A technical skill", "A natural talent"], a: 1,
        expl: "He has never seen anyone fake their way through it." },
      { q: "What is wrong with opening on 'hey guys'?", opts: ["It aims at everyone, so delivery goes vague and flat — pick one person", "It is too casual", "It is too long", "It is old-fashioned"], a: 0,
        expl: "You phrase things differently for someone you know." },
      { q: "How should you handle eye contact without a teleprompter?", opts: ["Stare at the lens throughout", "Read notes placed to one side", "Read ahead, glance away naturally, and return to the lens for key lines", "Close your eyes when thinking"], a: 2,
        expl: "A direct look lands harder by contrast." },
    ],
  },

  "spch100.13.1": {
    takeaway: "Eye contact through the lens is the basic piece-to-camera technique. The camera gives no feedback, so you stay on the lens anyway, and look away only at things the viewer can see.",
    beats: [
      { t: "Lens as eyes", d: "Looking into the lens is looking into the viewer's eyes." },
      { t: "No reaction", d: "We instinctively look for a face; the camera never gives one." },
      { t: "Be presumptuous", d: "Assume it is landing as well as it possibly could." },
      { t: "Visible looks only", d: "Look down at the cup in your hand, not at something out of shot." },
    ],
    worked: "Holding a cup, he looks down at it — fine, because the viewer can see what he is looking at. Look at something out of shot and the viewer is distracted; add the wrong movement and it all falls apart.",
    watch: "Searching the room for approval. The TV director's glance away is a thinking beat inside a conversation; this trainer's rule is about where your attention goes. Neither lets you look for a reaction off-camera.",
    concepts: [],
    checks: [
      { q: "Why keep your eyes on the lens?", opts: ["It reads as looking into the viewer's eyes; avoiding it looks insecure or shifty", "It hides notes", "The camera focuses better", "It is a broadcasting rule"], a: 0,
        expl: "The same as eye contact in person." },
      { q: "When is it fine to look away from the lens?", opts: ["To check the floor manager's reaction", "To read notes off to the side", "When the viewer can see what you are looking at", "Never"], a: 2,
        expl: "Otherwise it is distracting." },
      { q: "What does he suggest assuming about how your words are landing?", opts: ["That they are failing", "That they are going down as well as possible", "That nobody is listening", "Nothing at all"], a: 1,
        expl: "Be a little presumptuous." },
    ],
  },

  "spch100.13.2": {
    takeaway: "A ninety-second demonstration: the same presenter and the same words, with energy drained and then nervous movement added — and how quickly the piece to camera stops working.",
    beats: [
      { t: "Baseline", d: "Still, on the lens, energetic: nothing distracting." },
      { t: "Energy drained", d: "Flatter voice, less expression — still natural, but less engaging." },
      { t: "Nerves as movement", d: "Small wobbles, then rocking." },
      { t: "Eyes off", d: "Uncomfortable with the lens, the eyes start to slide away." },
    ],
    worked: "He keeps talking while his voice flattens, then begins to rock gently — 'like I'm on a boat' — and his eyes drift off the lens. Each change is small; together they make the piece hard to watch.",
    watch: "Pacing that comforts you. Constant movement, like a caged animal, feels good to the presenter and does nothing for the person watching.",
    concepts: [],
    checks: [
      { q: "Where does nervous energy go when you hold yourself rigid?", opts: ["Into your voice only", "Into small movements like wobbling and rocking", "Nowhere", "Into your hands only"], a: 1,
        expl: "It comes out somewhere else." },
      { q: "What is his fix?", opts: ["Move constantly", "Lower your energy", "Pick up the energy, stay still, use your hands a little", "Look away from the lens"], a: 2,
        expl: "Occasional movement is fine." },
      { q: "Why does constant movement fail?", opts: ["It feels good to the presenter but does nothing for the viewer", "It breaks broadcasting rules", "It blurs the picture", "It is too fast"], a: 0,
        expl: "Like a caged lion." },
    ],
  },

  "spch100.13.3": {
    takeaway: "Ali Abdaal: camera confidence is a skill that spills into the rest of life. Pick a mode — coffee or presenter — lift your energy to make up for what the camera takes, smile, use your hands, warm up, and get reps.",
    beats: [
      { t: "Why it matters", d: "Remote interviews, sales, content — and it raised his confidence off camera too." },
      { t: "Two modes", d: "Coffee with a friend; a talk to three or four students." },
      { t: "Imperfection", d: "Your own words and jokes beat a put-on presenter voice." },
      { t: "Smile and hands", d: "Speaking through a smile lifts voice and energy; relaxed gestures read as confident." },
      { t: "Warm-up", d: "He sings along to music while setting up." },
    ],
    worked: "He says a line flat, then the same line through a smile. The words don't change, but the second take sounds more confident and more engaged — and he says it lifts his own energy as well.",
    watch: "The course pitch. The first three minutes are mostly about his paid course; the five tips start after that.",
    concepts: [],
    checks: [
      { q: "Why does Abdaal suggest presenter-mode energy of about 7 out of 10?", opts: ["To sound like a TV host", "To speak faster", "Because the camera takes roughly two points off your charisma", "To save time"], a: 2,
        expl: "A 5 comes across as a 3." },
      { q: "When does he use coffee mode?", opts: ["For calls, negotiations, sales and heartfelt videos", "For loud product launches", "Only on stage", "Never"], a: 0,
        expl: "The camera is a friend over coffee." },
      { q: "What easy daily rep does he suggest?", opts: ["Reading the news aloud", "Sending video messages to friends instead of texts", "Filming strangers", "Rewatching old videos"], a: 1,
        expl: "Practice that costs nothing." },
    ],
  },

  "spch100.13.4": {
    takeaway: "Five practical tips from a course-video coach, and one drill worth keeping: record yourself way over the top first, then tone it down — because what feels natural reads as flat on camera.",
    beats: [
      { t: "Gesture variety", d: "Repetition becomes the distraction." },
      { t: "Comfort", d: "Sit, stand or lean — whatever lets you act naturally." },
      { t: "Dial it up", d: "If it feels over the top to you, it probably looks right." },
      { t: "Retakes", d: "Saying a line again and again is normal." },
      { t: "Authenticity", d: "Be your best self, not someone else." },
    ],
    worked: "Her rule of thumb: if it feels dramatic and over the top to you, it probably looks good on camera. So the first take is deliberately too much, and the review tells you how far to bring it back.",
    watch: "Pop statistics. The '10,000 hours' and '37 times better in a year' lines are motivational figures, not research on camera skill.",
    concepts: [],
    checks: [
      { q: "Why record an over-the-top take first?", opts: ["To use as a blooper", "Because toning down is easier than pushing energy up bit by bit", "Because it is funnier", "To test the microphone"], a: 1,
        expl: "You've done the hard work already." },
      { q: "What does she say about what feels natural to you?", opts: ["It will probably read as bored and unengaged on camera", "It always looks best", "It should never change", "It is only for experts"], a: 0,
        expl: "You need to dial it up." },
      { q: "What should the tips not do?", opts: ["Change your energy", "Change your gestures", "Turn you into someone else", "Change where you sit"], a: 2,
        expl: "Audiences see through it." },
    ],
  },

  "spch100.13.5": {
    takeaway: "A creator who worried about his accent records himself every day for 30 days, rates every take, and goes from no uploads in eleven months to talking to the lens like a friend on a video call. The method is incremental, not heroic.",
    beats: [
      { t: "The block", d: "A journal entry predicted the worst case — zero uploads — and it came true." },
      { t: "The protocol", d: "Record daily, note weak and strong points, rate five things." },
      { t: "What changed", d: "Far fewer 'uh's and silences — not perfection." },
      { t: "What he added", d: "Imitate to enhance, hands, smile, consistency, no announcer voice." },
    ],
    worked: "His 'British Airways mode' demonstration: a perfectly pleasant announcer voice cancelling your flight to Dubai and threatening to call security — polished, and completely fake. The fix is to sound like yourself, not like an announcement.",
    watch: "Treating it as a course review. He credits a paid course for some tips; the part that worked first was free — thirty days of recording and rating himself.",
    concepts: [],
    checks: [
      { q: "What did he rate after each recording?", opts: ["Views and likes", "Lighting and sound", "Script accuracy", "Pace, pronunciation, engagement, energy and charisma"], a: 3,
        expl: "The goal was one small improvement a day." },
      { q: "What is 'British Airways mode'?", opts: ["An over-polished, fake announcer voice", "Speaking too fast", "Travel vlogging", "Reading from a teleprompter"], a: 0,
        expl: "Sounding perfect and not like a person." },
      { q: "What does 'imitate to enhance' mean?", opts: ["Copy another creator in your published videos", "Imitate a speaker you admire in practice, to stretch your range", "Use a voice changer", "Repeat your old videos"], a: 1,
        expl: "Practice only, not uploads." },
    ],
  },
});

// =====================================================================
// Unit XV — B4, documenting a build without it becoming a vlog (budget
// 1.25 h). Austin Kleon's own SXSW talk on showing your work, a filmmaker on
// giving any vlog a goal and complications, and two game developers on
// devlogs — the nearest genre to documenting automation work for people who
// don't build: record as you go, tell it as a straight line from goal to
// result, keep the struggle, and explain for the audience you want.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.14.0": {
    module: "B4",
    mechanic: "Austin Kleon, in his SXSW keynote, says the way to be found is to become a good citizen of a 'scenius' rather than a lone genius: listen first, share what you love with credit, teach what you know, and work in the open — sharing your process, not just your product.",
    rules: [
      "Don't be a vampire (draining people) or 'human spam' (wanting attention you never give). If you want to be noticed, notice first; if you want to be interesting, be interested.",
      "Share the work you love, always with credit — what it is, who made it, how, and where to find more. Sharing what you love is the first step to sharing your own.",
      "Find your 'knuckleballers' — the few people working on the same odd thing — and treat them as collaborators, not competition.",
      "Teach what you know as soon as you learn it. Learn in front of others: document your progress and share as you go, process and not just product.",
      "Connections come from doing good work, not from networking. Build sharing into your routine, play the long game, and don't quit early. Never ask anyone to 'follow me back'.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Write today's 'working in the open' post about what you are building: one thing you learned this week, one screenshot or sketch of the unfinished work, and one credit to someone whose work helped you." },
    check: "The post would make sense to someone who has never heard of you, and it credits someone by name. If it only announces a finished product, it is a launch, not process.",
  },

  "spch100.14.1": {
    module: "B4",
    mechanic: "A filmmaker's five ways to make documenting your day into storytelling: tell more stories, build every video on setup, challenge, complications, payoff and change, consume stories rather than tutorials, map the beats of what you watch, and tell it visually.",
    rules: [
      "Tell more stories, everywhere. 'We hiked up a mountain and the view was great' is a report; the same hike with context, a time limit and a summit at sunset is a story.",
      "Structure: setup (put them in the scene), challenge (the goal and what's against you — a time limit works), complications (what pushes you back), payoff (did you make it?), change (how it affected you).",
      "Before you film, decide the goal and what stands in its way; complications will happen anyway, so film them when they do.",
      "Watch stories more than tutorials, and write down the beats of the ones that hold you.",
      "It's a visual medium: show rather than tell — wides, close-ups, a beginning and an end, even for a trip to the park.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Plan your next build session as a story before you start: the goal, the time limit or obstacle, two things that might go wrong, and the shot that will prove whether you made it." },
    check: "The plan has a question a viewer would want answered ('can I automate this in an afternoon?'). If it reads like a to-do list, there is no challenge yet.",
  },

  "spch100.14.2": {
    module: "B4",
    mechanic: "A game developer who makes devlogs explains the two kinds — technical (how you built it) and design (why you decided) — and the rules that keep either from becoming a diary: record as you go, tell a straight line from goal to result, keep the struggle, script for confidence, and give each video a question worth searching for.",
    rules: [
      "Technical devlogs: run a screen recorder while you work, speed up the footage, and show results, not code. Talk about your method, the struggles and how you got past them.",
      "Design devlogs: the decisions and why you made them — you may not even have a result to show yet.",
      "Tell it as a straight line: what you set out to do, and whether you did. Making a devlog after a milestone gives you a conclusion.",
      "Leave the struggle in; competence plus honesty about what failed reads better than polish. He scripts and rehearses so he sounds as confident as he wants to.",
      "Use your own personality, turned up — don't force jokes if you aren't funny. Frame each video around a question people might search for, so it gives value.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Pick one thing you finished building recently. Write a five-line devlog outline: the goal, the first approach, what went wrong, what you changed, the result — plus a title phrased as a question someone might search." },
    check: "Line three (what went wrong) is real and specific. If nothing went wrong, pick a different build or tell a design devlog instead.",
  },

  "spch100.14.3": {
    module: "B4",
    mechanic: "An indie game developer says devlogs fail when they're made for other developers: explain your systems with visuals and analogies for the people who'd use the thing, and make it look good before you show it.",
    rules: [
      "Don't make videos for people in your own trade by default. Jargon and deep-dives reach peers, not the customers you want.",
      "Explain the system in plain language with visuals and a bit of fun; in his channel these explanations hold viewers best, builders and non-builders alike.",
      "Treat each devlog as a mini-trailer — the visuals come first, so make it look decent before you film it.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Take one automation or system you built. Explain what it does in four sentences a shop owner would follow — no tool names — with one analogy, and list the one visual that would show it working." },
    check: "A non-technical person reads it and can say what problem it solves. If they ask what a webhook is, rewrite.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.14.0": {
    takeaway: "Austin Kleon's SXSW keynote on showing your work: forget being a genius; become part of a 'scenius' — a community of people sharing, crediting, teaching and learning in the open. Share your process, not just your product, and play the long game.",
    beats: [
      { t: "Vampires and human spam", d: "People who drain you, and people who want your attention but never give theirs. Use the vampire test." },
      { t: "Scenius", d: "Brian Eno's word for communal genius: Florence for Da Vinci, Paris for Picasso." },
      { t: "Shut up and listen", d: "He started by drawing panels at SXSW and posting them — sharing what he loved, with credit." },
      { t: "Knuckleballers", d: "Like R.A. Dickey's fellow knuckleball pitchers, the few doing your odd thing share secrets rather than hoard them." },
      { t: "Teach and work in the open", d: "Teaching drawing made more people draw — and added to his own work rather than competing with it." },
    ],
    worked: "Steve Albini, asked by a former talent-show contestant to produce his record, answered that he had never had connections that weren't a natural outgrowth of doing the work — people waste energy making connections instead of getting good, and being good is the only thing that earns them.",
    watch: "Watch to 37:30; the rest is audience questions. The pitfall he names: 'follow me back' — asking for attention instead of earning it.",
    concepts: [],
    checks: [
      { q: "What does Kleon mean by 'scenius'?", opts: ["A lone genius's studio", "Communal genius — good work emerging from a network of people sharing and supporting each other", "A type of art school", "A social network"], a: 1,
        expl: "It makes room for the rest of us." },
      { q: "What does he say good credit includes?", opts: ["Just the creator's name", "Context: what it is, who made it, how, why you're sharing it, and where to find more", "A link to buy it", "Nothing — sharing is enough"], a: 1,
        expl: "Without it, your sharing makes no connection." },
      { q: "According to Albini, where do real connections come from?", opts: ["Networking events", "Social media follows", "Doing good work — connections are a natural outgrowth of it", "Asking famous people for favours"], a: 2,
        expl: "Being good at things is what earns clout." },
    ],
  },

  "spch100.14.1": {
    takeaway: "A filmmaker's case that even a vlog needs a story: give it setup, a challenge, complications, a payoff and a change — and decide the goal before you film, because the complications will turn up on their own.",
    beats: [
      { t: "Tell more stories", d: "Turn everyday reports into stories in conversation, and notice how people respond." },
      { t: "Five beats", d: "Setup, challenge, complications, payoff, change." },
      { t: "Time as a challenge", d: "A sunset, three days on the Pony Express trail, a 24-hour challenge — a clock gives you a through-line." },
      { t: "Consume stories", d: "Watch stories, not just tutorials, and write down their beats." },
      { t: "Visual storytelling", d: "Show it — wides, close-ups, a beginning and an end." },
    ],
    worked: "The hike, told twice. As a report: 'we went up this mountain and it had the best view.' As a story: five long studio days, a peak in the distance, one hour of daylight, 1,800 feet straight up, the summit just as the sun dips — and then doing a new trail every evening after that.",
    watch: "Just filming whatever happens. Without a goal and an obstacle decided beforehand, a day of footage is a diary, not a video.",
    concepts: [],
    checks: [
      { q: "Which is NOT one of his five story beats?", opts: ["Setup", "Challenge", "Sponsorship", "Payoff"], a: 2,
        expl: "The others are complications and change." },
      { q: "Why is a time limit useful in a vlog?", opts: ["It shortens the edit", "It creates a challenge and a through-line the viewer wants resolved", "It pleases the algorithm", "It saves battery"], a: 1,
        expl: "Will they make it in time?" },
      { q: "What does he recommend consuming more of?", opts: ["Gear reviews", "Tutorials", "Stories — and noting their beats", "Analytics"], a: 2,
        expl: "Story matters more than cinematic B-roll." },
    ],
  },

  "spch100.14.2": {
    takeaway: "A game developer's guide to devlogs: choose technical (how) or design (why), record as you go, tell it as a straight line from goal to result, keep the struggle, script for confidence, and give every video a question worth searching for.",
    beats: [
      { t: "Technical devlogs", d: "Record your screen while you work; speed it up; show results and your thought process, not code." },
      { t: "Design devlogs", d: "The decisions and why — a video on what makes a good twin-stick shooter before the game is finished." },
      { t: "After a milestone", d: "Summarising lets you come in with a conclusion and what you learned." },
      { t: "Scripted confidence", d: "Unscripted he says 'like' and 'probably'; scripted and rehearsed he sounds sure." },
      { t: "Value", d: "Frame each video around something people might search for, like how to use playtest feedback." },
    ],
    worked: "His own titles: graphics, level design, sound and music, player feedback — and 'that time I cancelled my game'. Each devlog takes one topic and explores it through the game he is making, so a playlist becomes a timeline of the build.",
    watch: "Forced personality. If you are not funny, don't try to be; turn up the personality you already have instead — a confident monotone that shows impressive results works too.",
    concepts: [],
    checks: [
      { q: "What does a design devlog focus on?", opts: ["The code", "The editing software", "The decisions you made and why", "Sales figures"], a: 2,
        expl: "Technical devlogs cover how." },
      { q: "Why leave struggles in a devlog?", opts: ["They fill time", "Honest struggle plus what you learned shows competence and keeps you human", "Viewers like failure for its own sake", "It's required"], a: 1,
        expl: "Nothing ever goes that smoothly, and everyone knows it." },
      { q: "How does he recommend recording technical work?", opts: ["Run a screen recorder while you work, then speed it up and show the results", "Recreate everything afterwards", "Film the keyboard", "Only show the finished product"], a: 0,
        expl: "Making it as you go is easier than assembling it backwards." },
    ],
  },

  "spch100.14.3": {
    takeaway: "An indie developer's warning: devlogs made for other developers reach only developers. Explain your systems simply, with visuals and a bit of fun, for the people who would actually use what you build — and make it look good first.",
    beats: [
      { t: "Not for your peers", d: "Raycasts and state machines attract developers who may never play your game." },
      { t: "Explain simply", d: "A harvesting system explained with visuals and funny scenes became the best-retained part of his videos." },
      { t: "Visuals first", d: "Each devlog is a mini-trailer; ugly placeholders lose viewers." },
    ],
    worked: "His harvesting system, explained without jargon: a component on any object checks whether you're using the right tool, how good the tool is, how much damage to apply, when to drop the resource — and then damages the tool that hit it. Complex logic, said as a little story of cause and effect.",
    watch: "The sponsor segment at the end, and the jargon reflex. The video is short; the point is that the explanation, not the system, is what an outsider watches.",
    concepts: [],
    checks: [
      { q: "Why does he warn against making devlogs for other developers?", opts: ["They don't watch YouTube", "It limits your reach to peers rather than the people who'd use what you make", "They are too critical", "It's against the rules"], a: 1,
        expl: "Most of them won't play your genre." },
      { q: "Which parts of his videos hold viewers best?", opts: ["The plain, visual, funny explanations of systems", "The code walkthroughs", "The sponsor reads", "The outros"], a: 0,
        expl: "Builders and non-builders alike." },
      { q: "Why make the work look good before filming?", opts: ["For awards", "Because each devlog acts as a mini-trailer and visuals come first", "To hide bugs", "To save editing time"], a: 1,
        expl: "Even the best video flops if the game looks bad." },
    ],
  },
});

// =====================================================================
// Unit XVI — B7, positioning and content pillars (budget 0.9 h). Small on
// purpose; the taxonomy warned this module attracts padding. Seth Godin on
// the smallest viable audience, April Dunford's positioning method (made for
// products, and just as useful for positioning a service or a person), and
// a strategist's five sources of content pillars.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.15.0": {
    module: "B7",
    mechanic: "Seth Godin says start with the smallest viable audience — the few people who share your taste and want to go where you're going — and get specific rather than generic, because being specific is how the person looking for what you do finds you.",
    rules: [
      "Don't spend your day persuading people who don't want to get the joke. Begin with the ones who do.",
      "A tiny share of a big population is enough: Cory Doctorow is unknown to 99 per cent of English speakers and still a bestseller.",
      "'Niche down' is two negatives; say 'specific up'. If you're generic you can't be the best, because everyone does it.",
      "Ask what would be worth doing even if you knew it would fail — then ship it when it feels not quite ready.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Describe your smallest viable audience in one sentence: who they are, what they already believe, and what they want that you can give. Then write the generic version you have been using, for contrast." },
    check: "Someone who fits your sentence would recognise themselves in it — and someone who doesn't would know it isn't for them.",
  },

  "spch100.15.1": {
    module: "B7",
    mechanic: "April Dunford says positioning is the context that makes your value obvious to the customers who care most — and you work it out deliberately, starting with the real competitive alternatives, then your unique capabilities, the value they create, who cares most about that value, and the market category that frames it.",
    rules: [
      "Positioning comes before messaging, taglines and branding. It works like the opening scene of a film: it tells people where they are, so they can follow the rest.",
      "A market category triggers assumptions — competitors, features, buyer, price. Choose one whose assumptions are true of you, or you'll spend every meeting undoing them.",
      "Start with competitive alternatives: what would the customer do if you didn't exist? Often it's a spreadsheet or an intern, not a company.",
      "Then capabilities you have that the alternatives don't, the value they deliver, the customers who care most about that value, and the category that makes it obvious.",
      "Narrow can be faster: 'CRM for investment banks' beat the market leader in its niche, then widened step by step.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Fill in Dunford's five components for your own service, in her order: what owners do instead of hiring you; what you can do that those alternatives can't; the value that creates; which owners care most about it; and the category that makes that value obvious." },
    check: "Your 'alternative' is something owners really do today (a spreadsheet, a nephew, nothing), not another consultant — and your value line names a result, not a feature.",
  },

  "spch100.15.2": {
    module: "B7",
    mechanic: "A content strategist's five-part framework: content pillars are broad topics within your niche that you want to be known for — not 'education' or 'inspiration' — drawn from five sources: your knowledge, your experience, what your audience needs, your personal angle, and your values.",
    rules: [
      "Education, motivation and inspiration are what a post does, not what it's about. Pillars are topics people would look for you to cover.",
      "Knowledge: what could you talk about for 30 minutes with no notes, that your audience doesn't know yet?",
      "Experience: where you've been and how you got here — the path that makes you credible.",
      "Audience need: what stands between your audience and the result you promise? Teach that.",
      "Personal angle and values: the human angle that makes you different (it will polarise, and should) and what you stand for in your work.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Brain-dump answers to the five questions — knowledge, experience, audience need, personal angle, values — then name one pillar for each in two to four words." },
    check: "Each pillar could generate ten post ideas, and none of them is 'education', 'tips' or 'motivation'.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.15.0": {
    takeaway: "Seth Godin: begin with the smallest viable audience — the people who share your taste — and get specific. Generic can't be the best at anything; specific is how the right person finds you.",
    beats: [
      { t: "Show up and ship", d: "Develop taste, understand your genre, and ship even when it feels not quite ready." },
      { t: "If you knew you'd fail", d: "A better question than 'if you couldn't fail': what is worth doing anyway?" },
      { t: "Enough is enough", d: "One per cent of two billion English speakers is a lot of people." },
      { t: "Specific up", d: "'Niche down' sounds like shrinking; being specific is how you become the best at something." },
    ],
    worked: "Cory Doctorow: 99 per cent of English speakers have never read a word he wrote — and the remaining one per cent is enough to make him a bestseller and a successful Kickstarter.",
    watch: "Chasing the people who don't get it. You can spend your whole day persuading non-believers instead of serving the people who already want to go where you're going.",
    concepts: [],
    checks: [
      { q: "What does Godin mean by the 'smallest viable audience'?", opts: ["The cheapest audience to buy ads for", "The smallest group who share your taste and want what you make — enough to sustain the work", "Your family and friends", "A test audience for surveys"], a: 1,
        expl: "They become fuel to be singular rather than generic." },
      { q: "Why does he prefer 'specific up' to 'niche down'?", opts: ["It's shorter", "Being specific is how you become the best at something and get found", "It sounds more technical", "It avoids competition entirely"], a: 1,
        expl: "Generic can't be the best because everyone does it." },
      { q: "What question does he suggest instead of 'what would you do if you couldn't fail?'", opts: ["What would make the most money?", "What would go viral?", "What would be worth doing even if you knew it would fail?", "What do your competitors do?"], a: 2,
        expl: "Paradoxically, that leads to things that work." },
    ],
  },

  "spch100.15.1": {
    takeaway: "April Dunford: positioning is the foundation under all marketing — the context that makes your value obvious to the customers who care most. Choose it deliberately, starting from what customers would really do without you.",
    beats: [
      { t: "What it isn't", d: "Not messaging, a tagline, your 'why' or your brand. Those flow from it." },
      { t: "Assumptions", d: "Say 'CRM' and people assume competitors, features, buyer and price before you've said anything else." },
      { t: "Reposition, same product", d: "Email for lawyers became team collaboration for lawyers; robots became autonomous industrial vehicles." },
      { t: "The order", d: "Alternatives, capabilities, value, best-fit customers, market category." },
      { t: "Narrow to win", d: "CRM for investment banks went from about 1.5 million to nearly 80 million in revenue in around 18 months, and was acquired by the leader." },
    ],
    worked: "A startup sold 'email for lawyers' — with no calendar, and not replacing anyone's email. Its loved feature was secure, context-aware document sharing with clients. Repositioned as team collaboration for lawyers, the competitors became Slack and Teams, the expected features matched, and customers expected to pay.",
    watch: "Leaving customers to work it out. They grab the first clue ('there's an inbox, so it's email') and get stuck; the Segway, launched as 'a revolution in human transportation', confused everyone. Watch to about 34:00; questions follow.",
    concepts: [],
    checks: [
      { q: "Where does Dunford say positioning work should start?", opts: ["The tagline", "Competitive alternatives — what customers would do if you didn't exist", "The brand colours", "The founder's vision"], a: 1,
        expl: "Otherwise it sounds good in the office and loses in the market." },
      { q: "Why does the market category matter so much?", opts: ["It sets off assumptions about competitors, features, buyers and price", "It decides your logo", "Search engines require it", "It sets your tax rate"], a: 0,
        expl: "True assumptions save work; false ones create it." },
      { q: "What was the 'email for lawyers' product better positioned as?", opts: ["A calendar app", "A CRM", "Team collaboration for lawyers", "A law firm"], a: 2,
        expl: "Same product, different context." },
    ],
  },

  "spch100.15.2": {
    takeaway: "Content pillars are broad topics within your niche that you want to be known for. A strategist draws hers from five sources — knowledge, experience, audience need, personal angle and values — so ideas never run dry and the content attracts the right people.",
    beats: [
      { t: "What pillars aren't", d: "'Education' or 'inspiration' describe an outcome; 'five hair tips' and 'dog grooming' both qualify." },
      { t: "Knowledge", d: "Her own: content systems." },
      { t: "Experience", d: "Her winding career from corporate marketing to agency to personal brand." },
      { t: "Audience need", d: "'Content without the damage' — unlearning bad advice before her method can work." },
      { t: "Angle and values", d: "'Against the status quo'; 'I have receipts' — no advice without proof." },
    ],
    worked: "A curly-hair stylist's pillars: curl patterns and textures (knowledge), transformations (experience), a home hair-care routine (what clients need between appointments), putting down the flat iron (personal angle) — each one a topic she could post about for months.",
    watch: "Picking pillars by post type. 'Educational, motivational, promotional' gives you nothing to search your memory with; topics do. (Strong language, and a course plug at the end.)",
    concepts: [],
    checks: [
      { q: "Why does she reject 'education' and 'inspiration' as pillars?", opts: ["They're outdated", "They describe what a post does, not what it's about, so they don't narrow your message", "They're too specific", "Platforms penalise them"], a: 1,
        expl: "Pillars are topics you want to be known for." },
      { q: "What does the 'audience need' pillar cover?", opts: ["What your audience likes to watch", "What stands between them and the result you promise", "Their demographics", "Their budget"], a: 1,
        expl: "Teach what they must know before your offer can work." },
      { q: "What is expected of the 'personal connections' pillar?", opts: ["To stay neutral", "To be strictly professional", "To be polarising — attracting the right people and repelling the wrong ones", "To avoid stories"], a: 2,
        expl: "That's the point of it." },
    ],
  },
});

// =====================================================================
// Unit XVII — B5, long-form and YouTube structure (budget 1.2 h; light on
// purpose, as the taxonomy asked). Colin and Samir twice (three acts; how
// they cut a documentary for tension), a script-order guide, Veritasium
// on packaging, and a Waveform conversation on finding a story inside a
// review and packaging before filming.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.16.0": {
    module: "B5",
    mechanic: "Colin and Samir build videos on three acts — setup, conflict, resolution — and show it on one video: act one sets the goal and a deadline, act two is stages of rising tension, act three is the release.",
    rules: [
      "Act one is the setup: give context and hook them to the end. A strong act one drives the rest.",
      "Add a constraint to raise the stakes — they gave themselves 24 hours.",
      "Act two is the conflict: stages (they used title cards) with tension rising, up to a low point where it looks as if you'll fail.",
      "Signal the change of act with music, location and form — voice-over and B-roll in act one, a fast drumbeat and a new place in act two, something reflective in act three.",
      "Brainstorm before you pick up a camera; choose ideas that fit three acts.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Outline a video about a real project as three acts: act one in one sentence with a deadline in it, act two as three stages each harder than the last, act three as the release and what it meant." },
    check: "Somewhere in act two there's a moment where it looks as if you'll fail. If every stage goes well, there's no act two.",
  },

  "spch100.16.1": {
    module: "B5",
    mechanic: "This scriptwriting guide writes every script in the same order — packaging, outline, intro, body, outro — on one principle: when reality beats the viewer's expectations they stay, and when it doesn't they leave.",
    rules: [
      "Packaging first: the idea, then the title (the thumbnail can stay loose). The first lines must confirm the click, and ideally beat it.",
      "Outline before you write: bullet the points and check they're genuinely new. If they're not, research more before you script.",
      "Intro formula: the topic straight away, then the common belief, then your contrarian take, then proof and a plan.",
      "Body: put your second-best point first and build up from there; explain each point with context, application and framing; re-hook between points.",
      "End on a high note that reminds them the promise was kept. Calls to action work best embedded where they genuinely solve the problem being discussed.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Draft the intro of a long video using his order: one line confirming the title, one line of common belief, one contrarian line, one line of proof, one line of plan. Then bullet the body points and mark which is second-best, to go first." },
    check: "Your first body point is something your audience probably hasn't heard. If it's the obvious tip, swap it.",
  },

  "spch100.16.2": {
    module: "B5",
    mechanic: "Derek Muller of Veritasium separates 'legitbait' — titles and thumbnails that are enticing and accurate — from the click trap, and argues packaging is at least half the job, because it decides how many people YouTube shows the video to at all.",
    rules: [
      "Picture two axes: how sensationalised it is, and how much it withholds. Too much of both is a click trap; too little is the dead zone; legitbait sits between.",
      "There are hundreds of accurate titles for any video. Choose the one that tells the most people why they'd care.",
      "Click-through drives impressions: better packaging gets you shown more, not just clicked more.",
      "Test and swap. 'Asteroids: Earth's Biggest Threat' went from near-worst to his best after one change: 'These Are the Asteroids to Worry About'.",
      "Package for outsiders: 'The Simplest Math Problem No One Can Solve' reaches people who've never heard of the Collatz conjecture. Keep the video uncompromised; adjust the packaging.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write five accurate titles for one video or post you've made. Mark each as dead zone, legitbait or click trap. Rewrite the dead-zone ones for someone who has never heard of the topic." },
    check: "Your best title is one you'd be comfortable defending as accurate, and a stranger would know why to click.",
  },

  "spch100.16.3": {
    module: "B5",
    mechanic: "Colin and Samir break down how they cut a documentary from more than fifty hours of footage: capture moments rather than shots, show instead of announcing, count down instead of up, and build tension like a game of Jenga.",
    rules: [
      "Shots can be fetched later; moments can't. Know when to be rolling — the unguarded moment becomes the soul of the piece.",
      "Show, don't say: they cut a two-minute car scene explaining the plan and moved the B-roll into a visual cold open.",
      "Count down, not up. 'Day three of production' means nothing; days left until the deadline raises the stakes.",
      "Jenga storytelling: each piece pulled out makes the tower shakier, so tension rises to the end.",
      "One macro question for the whole film, with micro questions opening inside it — curiosity gaps between what they know and want to know.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Take a project you're filming or have filmed. Write its macro question, three micro questions, and the countdown you could put on screen." },
    check: "The countdown ends at a moment the viewer cares about (launch, client meeting, deadline), not at the end of your filming schedule.",
  },

  "spch100.16.4": {
    module: "B5",
    mechanic: "In a Waveform podcast conversation, Colin and Samir argue that storytelling advice applies even to a product review — set up something the viewer waits for — and that if you're frantically changing titles after upload, the mistake came earlier: package the idea before you film.",
    rules: [
      "You can open a narrative inside a review: 'two things I really like about this, and one I really don't' gives the viewer something to wait for.",
      "Use 'but' and 'therefore', not 'and then' — the South Park rule — even in a tech video.",
      "Not all advice transfers: a niche audience may want depth that a retention-maximising six-minute cut would remove.",
      "If you keep swapping titles and thumbnails after upload, the problem started earlier. Decide the packaging before you script or film.",
      "When you can't package first (a review of something untested), build repeatable formats so the packaging is half-decided.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "For your next long piece, write the title and thumbnail idea before anything else. Then write the one line in the intro that sets up something viewers will wait for." },
    check: "The packaging came first, and the intro's setup line is paid off later in the outline.",
  },
});

Object.assign(DAR.SUMMARIES, {

  "spch100.16.0": {
    takeaway: "Colin and Samir: the three-act structure is the most important thing to know before making a video. Set up the goal and the stakes, run rising tension through act two, and release it in act three — and spend the effort on act one.",
    beats: [
      { t: "Setup", d: "Context and a hook strong enough to carry the viewer to the end." },
      { t: "Conflict", d: "The meat: the adventure and transformation, with tension rising." },
      { t: "Resolution", d: "Everything ties together; the tension is released." },
      { t: "Signals", d: "Music, location and style change to tell the viewer a new act has begun." },
      { t: "Brainstorm first", d: "Think the idea through before picking up a camera." },
    ],
    worked: "'24 hours to meet Yes Theory': act one declares the goal on screen with a building crescendo; act two runs through attempts under title cards to night-time, music gone, when it looks as if they'll fail; then a phone call — 'have you checked your Twitter?' — opens act three, with reflective music.",
    watch: "Skipping the constraint. Meeting Yes Theory was the goal; the 24-hour limit is what gave act two its tension.",
    concepts: [],
    checks: [
      { q: "What is act two for, in their structure?", opts: ["The conflict — where tension rises", "The introduction", "The sponsor", "The credits"], a: 0,
        expl: "Everything set up in act one plays out." },
      { q: "How did they raise the stakes in act one?", opts: ["A bigger budget", "A 24-hour time limit", "A celebrity guest", "A giveaway"], a: 1,
        expl: "A constraint makes the journey worth following." },
      { q: "How did they signal the start of act two?", opts: ["A title card saying 'Act Two'", "Silence", "A fast drumbeat and a change of location", "A sponsor read"], a: 2,
        expl: "Act one had been voice-over and B-roll." },
    ],
  },

  "spch100.16.1": {
    takeaway: "One script order for long videos: packaging, outline, intro, body, outro — all driven by one principle, expectations against reality. When what they get beats what they expected, they stay.",
    beats: [
      { t: "Expectations versus reality", d: "Like the relief after a speech you expected to bomb." },
      { t: "Click confirmation", d: "The title sets the expectation; the first lines confirm and ideally beat it." },
      { t: "Outline for uniqueness", d: "If the points are common knowledge, research more before writing." },
      { t: "Intro formula", d: "Topic, common belief, contrarian take, proof, plan." },
      { t: "Body and outro", d: "Second-best point first, then build; re-hook between points; end on a high note." },
    ],
    worked: "The intro of the video itself: 'Today we're talking about writing killer scripts' (topic); 'this is an art, one of the hardest things to learn' (common belief); 'but there is a right answer — they all run the same process' (contrarian); then the five-step plan and his credentials (plan and proof).",
    watch: "Leading with your best point. He argues a rising pattern — strong, stronger — keeps people watching, the way albums rarely open with the hit. Three of his own plugs are deliberately 'native embedded' in the video.",
    concepts: [],
    checks: [
      { q: "What principle does the guide say drives every scripting decision?", opts: ["Length versus budget", "Expectations versus reality", "Topic versus trend", "Hook versus thumbnail"], a: 1,
        expl: "Reality beating expectations keeps viewers." },
      { q: "Which point does he put first in the body?", opts: ["The best", "The weakest", "The second-best", "A random one"], a: 2,
        expl: "Then the best, so value seems to rise." },
      { q: "What is 'click confirmation'?", opts: ["The first lines confirming what the title promised", "A pop-up asking viewers to subscribe", "A thumbnail test", "The end screen"], a: 0,
        expl: "Ideally they beat the expectation too." },
    ],
  },

  "spch100.16.2": {
    takeaway: "Derek Muller of Veritasium: there's a difference between 'legitbait' — enticing and accurate — and the click trap. Packaging is at least half the job, because click-through decides how many people YouTube shows your video to at all.",
    beats: [
      { t: "The basketball", d: "'Strange Applications of the Magnus Effect' went nowhere on YouTube; a re-upload titled 'Basketball Dropped From Dam' got tens of millions." },
      { t: "Why it changed", d: "YouTube moved from subscriptions to engagement, which raised the importance of packaging." },
      { t: "Two kinds of clickbait", d: "Legitbait versus click trap, mapped on sensationalism and withholding." },
      { t: "Swap and test", d: "Real-time metrics let you change a title and watch for a bump in views." },
      { t: "Adjust the packaging", d: "Jack Conte's idea: keep the box uncompromised; change the wrapping." },
    ],
    worked: "'Are Negative Ions Good For You?' — a question nobody asked — became 'Do Salt Lamps Work?', and gained about one and a half million views. The new title was also clearer and more accurate.",
    watch: "Treating all clickbait as the enemy. The dead zone ('Strange Applications of the Magnus Effect') fails too; the target is accurate and enticing. The last minute is a sponsor read.",
    concepts: [],
    checks: [
      { q: "What is 'legitbait'?", opts: ["Packaging that is enticing and accurate", "Misleading titles that get clicks", "Titles with no curiosity", "Paid promotion"], a: 0,
        expl: "As opposed to a click trap." },
      { q: "Why does click-through matter beyond clicks?", opts: ["It sets ad rates", "It largely decides how many impressions YouTube gives the video", "It counts as watch time", "It sets your subscriber count"], a: 1,
        expl: "Limited real estate goes to what gets clicked." },
      { q: "Why title a video 'The Simplest Math Problem No One Can Solve' rather than 'The Collatz Conjecture'?", opts: ["It's shorter", "It hides the topic", "It tells far more people why they'd care, not just those who already know the term", "It's funnier"], a: 2,
        expl: "More people learn something new." },
    ],
  },

  "spch100.16.3": {
    takeaway: "Colin and Samir cut a documentary from more than fifty hours of footage: capture moments, show instead of announcing, count down rather than up, and let tension rise like a Jenga tower.",
    beats: [
      { t: "Moments, not shots", d: "An unguarded 'do you think I'm evil?' exchange became the soul of the piece." },
      { t: "Show, don't say", d: "A two-minute explanatory car scene became a visual cold open." },
      { t: "Count down", d: "'Day one, day two' meant nothing; time running out did." },
      { t: "Jenga storytelling", d: "Each piece removed makes the tower shakier until the end." },
      { t: "Macro and micro questions", d: "How will two worlds come together? — with smaller curiosity gaps inside." },
    ],
    worked: "Their first title cards counted production days up — day one, two, three. They realised that raised no stakes, so they counted down instead, and showed unfinished sets to make the audience feel the time running out.",
    watch: "Over-explaining. On YouTube you're used to saying everything aloud so nobody's lost; in a documentary the picture can do it, and it's stronger.",
    concepts: [],
    checks: [
      { q: "What's the difference between a moment and a shot?", opts: ["Shots can be recaptured later; moments can't", "Moments are longer", "Shots need a crew", "There's no difference"], a: 0,
        expl: "Either you get the moment or you don't." },
      { q: "Why did they switch from counting days up to counting down?", opts: ["To shorten the film", "Counting up meant nothing; counting down raised the stakes", "For the sponsor", "It looked better"], a: 1,
        expl: "Time running out builds tension." },
      { q: "What is 'Jenga storytelling'?", opts: ["Stacking jokes", "Editing with blocks of colour", "Tension rising as the structure gets less stable", "Telling stories backwards"], a: 2,
        expl: "By the end you're on the edge of your seat." },
    ],
  },

  "spch100.16.4": {
    takeaway: "Marques Brownlee asks Colin and Samir whether MrBeast's storytelling advice transfers to tech reviews. Their answer: storytelling does — set up something the viewer waits for — but not every retention tactic suits a niche, and packaging is best decided before you film.",
    beats: [
      { t: "Story in a review", d: "'Two things I really like, one I really don't' sets up a wait." },
      { t: "But and therefore", d: "The South Park rule applies to a phone launch too." },
      { t: "Tension and release", d: "A review is tension in itself: what does Marques think?" },
      { t: "Niche depth", d: "Their audience wants long answers; cutting everything to six minutes would lose value." },
      { t: "Package first", d: "If you're frantically changing titles, the mistake was earlier." },
    ],
    worked: "A phone review told with 'but, therefore': this line of phones has been incredible — but this one is different — therefore you should think about it differently. The same causal chain a story uses, inside a product review.",
    watch: "About half of this clip is podcast conversation (a MrBeast-challenge tangent, creators' complaints about thumbnails and AdSense). The structure points are in the first seven minutes and from about 11:40 to 13:30.",
    concepts: [],
    checks: [
      { q: "How can a review open a narrative, according to Samir?", opts: ["By setting up something the viewer waits for, like the one thing he doesn't like", "By telling a childhood story", "By hiding the product", "By using music"], a: 0,
        expl: "That's a story element." },
      { q: "What does frantic title-swapping suggest, in their view?", opts: ["Good testing", "A mistake earlier in the process — the idea wasn't packaged first", "A broken algorithm", "Too many uploads"], a: 1,
        expl: "Good ideas make titles and thumbnails easy." },
      { q: "Why don't they take every retention tip to the extreme?", opts: ["It's too expensive", "YouTube forbids it", "Their niche audience values depth that a very short cut would remove", "They don't track retention"], a: 2,
        expl: "Know your audience." },
    ],
  },
});

// =====================================================================
// Unit V, top-up (T-037, 2026-10-09) — A3 delivery, three lessons
// appended after spch100.4.7: Vinh Giang's before / during / after system,
// David JP Phillips's catalogue of 110 skills, and Caroline Goyder on
// breath. Appended at the END of the unit, so every existing key keeps its
// video.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.4.8": {
    module: "A3",
    mechanic: "Most of what goes wrong when everyone is watching is fixed before the moment — by rehearsal scaled to the stakes and done out loud at full energy — and in the moment you open with connection rather than content; afterwards you record and review, because nobody else will tell you the truth.",
    rules: [
      "Rehearse in proportion to the stakes: one to three run-throughs for a weekly stand-up, about ten when leaders are in the room, a hundred for a pitch that could raise real money.",
      "Table reads go out loud, with the same energy, volume and pace as the real thing. You present the way you rehearse, and more effort in rehearsal means better recall.",
      "Improv rehearsal: speak without the notes, and when you blank, pause, breathe and try for at least ten seconds before looking. The strain fixes the words, and you are rehearsing a calm pause instead of panic.",
      "Treat nerves on three levels: psychological (think about who you are helping, not about yourself), physiological (burn off the adrenaline backstage, then slow your breathing), emotional (call it excitement).",
      "Open with connection, not content — a short origin story — and aim for roughly a third education, a third inspiration, a third entertainment, plus the one per cent that is yours.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Pick something you must say this week. Do one table read out loud at full performance energy. Then do one run without notes, recorded on your phone — when you blank, pause and try for ten seconds before you look." },
    check: "The recording has at least one blank you recovered from with a pause rather than a scramble, and its energy matches how you would say it on the day, not how you would mumble it at a desk.",
  },

  "spch100.4.9": {
    module: "A3",
    mechanic: "Presentation skills are skills, not talent: of the 110 David JP Phillips catalogued from 5,000 speakers, the core few are keeping the body open, gesturing for a function, making the hands say what the words say, a calm pace, and a pause where you would have said 'uh'.",
    rules: [
      "Closed body language — the fig leaf, the 'double bunny', hands in pockets, the T-rex — reads as feeling threatened. Stay open, and don't retreat as you open.",
      "Use gestures for their function: something getting better or worse, one-two-three. Don't park your hands in a locked position between points.",
      "If your hands contradict your words, the audience follows the hands. Body and voice have to say the same thing.",
      "A calm pace signals that what you are saying matters. Pause instead of filling with 'uh' — nothing in his list lowers credibility more, because it signals you don't know where you are going.",
      "Small skills stack: look up (thinking), an audible in-breath (something is coming), a Duchenne smile that reaches the eyes, a brief laugh at yourself. Combine them the way a boxer combines punches.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Film a sixty-second welcome to a room twice: once with your hands wherever they usually go, once with an open stance and a functional gesture for each point (count it, show bigger or smaller, better or worse). In the second take, replace every 'uh' with a silent pause." },
    check: "With the sound off, someone watching the second take could tell how many points you made and which way each one went — and the second take has no 'uh' in it.",
  },

  "spch100.4.10": {
    module: "A3",
    mechanic: "Confident speaking starts inside the body: the voice is an instrument you practise, a relaxed low breath is what power looks like, and because all speech rides on the out-breath, the in-breath — taken with the mouth closed — decides how the next sentence sounds.",
    rules: [
      "The voice is an instrument, and there is no such thing as a bad saxophone, only an unpractised one. The simplest daily practice is to sing: shower, car, anywhere.",
      "The most powerful person in a room has the most relaxed breathing. Stillness reads as status — on stage, everyone moves around the king.",
      "Find the diaphragm: thumb just below the breastbone, breathe in and push the thumb away, breathe out and feel it come back. Do this whenever nerves rise.",
      "Breath is thought. All speech is out-breath, and the in-breath is where the thought and feeling arrive — breathe in the feeling you want the room to have, then speak on it.",
      "Know when to shut your mouth: close it and take the in-breath before the next phrase.",
    ],
    drill: { minutes: 6, artifact: "recorded",
      do: "Stand with your thumb below your breastbone and take five slow breaths, pushing the thumb away on each in-breath. Then record the first two sentences of something you must present, twice: once straight off, once after closing your mouth and breathing in the feeling you want the room to have." },
    check: "On playback the second take is lower and slower, there is no gasp at the start of the phrase, and you can name the feeling you breathed in.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.4.8": {
    takeaway: "Vinh Giang's system for the moments when everyone is watching, in three stages: before (rehearse to the stakes, out loud, at full energy, then without notes), during (nerves on three levels, connection before content, a balance of education, inspiration and entertainment), after (record and review, and build your own stage).",
    beats: [
      { t: "Rehearse to the stakes", d: "Theatre's rule is two hours of rehearsal per minute on stage. He scales it: one to three runs for a weekly stand-up, ten when leaders attend, a hundred for an investor pitch." },
      { t: "Table reads", d: "Read the script aloud five to ten times with the energy, volume and pace of the real thing. Rehearse it mumbling while you pace, and you will pace on stage." },
      { t: "Improv rehearsal", d: "Go without notes; when you forget, pause and try for ten seconds before checking. The strain fixes the words and trains a pause instead of panic." },
      { t: "Nerves, three levels", d: "Think about who you are helping. Push-ups or star jumps backstage, then slow breathing. Call the feeling excitement — Mel Robbins told him the body cannot tell the two apart." },
      { t: "Connection before content", d: "Open with a short origin story, not research or statistics. In an interview, answer 'tell me about yourself' with a story instead of adjectives." },
      { t: "33 / 33 / 33 / 1", d: "Pure magic felt like a show; pure education put the room to sleep. Organisers wanted people to learn something useful, feel inspired and have fun — plus the one per cent that is yours." },
      { t: "Record and review", d: "Film every talk and meeting you reasonably can and watch the whole thing back. With no gigs, he built a stage in his backyard, then got a busking permit and spoke to strangers." },
    ],
    worked: "At a dentists' conference in Sydney the organiser told him his talk was one of the best she had seen. An hour later he watched a flat, monotone speaker walk off and heard her say the same words to him. That is why he stopped trusting compliments and started filming: two GoPros taped together, one on him and one on the audience, so he could see what he was doing at the moment they reached for their phones.",
    watch: "The seven-step rehearsal video he advertises is a sign-up for his own material, and a hundred rehearsals is his standard, not a rule. The first two steps — table reads at full energy and the ten-second recall — are the lesson.",
    concepts: [],
    checks: [
      { q: "During an improv rehearsal you forget your next line. What does he tell you to do?", opts: ["Look at your notes straight away so you keep momentum", "Pause, breathe and try to remember for at least ten seconds before checking", "Skip to the next part you remember", "Start again from the top"], a: 1,
        expl: "The strain fixes the material, and you are practising a calm pause instead of panic." },
      { q: "Why does he insist table reads are done at full performance energy?", opts: ["Because you end up presenting the way you rehearsed", "Because it tires the voice so it sits lower on the day", "Because organisers expect it", "Because it makes the script shorter"], a: 0,
        expl: "Higher effort in rehearsal also means better recall." },
      { q: "What is the '33 / 33 / 33 / 1' formula?", opts: ["Thirty-three slides, minutes and questions, and one ask", "Pace, pitch and pause, plus one gesture", "A third education, a third inspiration, a third entertainment, plus your own X-factor", "A third story, a third data, a third questions, and a call to action"], a: 2,
        expl: "He arrived at it by asking organisers what they wanted their audience to take away." },
      { q: "Why does he distrust the feedback people give right after a talk?", opts: ["Audiences are usually hostile", "People say 'amazing' to everyone, so it tells you nothing", "Feedback forms are anonymous", "Only professional speakers can judge a talk"], a: 1,
        expl: "They don't want to hurt you, and they wouldn't know what specific feedback to give anyway." },
    ],
  },

  "spch100.4.9": {
    takeaway: "David JP Phillips spent seven years analysing 5,000 speakers and found 110 learnable skills. His five favourites — open body language, no retreating, functional gestures, a calm pace, the pause instead of 'uh' — plus four tiny skills that change a room's state in five seconds.",
    beats: [
      { t: "Skills, not talent", d: "The more of the 110 you use, the better you are; nobody is born with a gene for the stage. Knowing what each move does is the difference between guessing and choosing." },
      { t: "Open, not closed", d: "Closed positions signal threat. His catalogue: the fig leaf, the double bunny, the forklift, the peacock, the prayer, the beggar, the British horse rider, the T-rex." },
      { t: "Functional gestures", d: "Hands are for showing better, worse, one-two-three. When they say the opposite of the words, the audience believes the hands." },
      { t: "Pace and pause", d: "A slow pace reads as importance — his 'utterly boring' sentence held the room because he slowed down. 'Uh' is the cheap compromise for a pause, and the biggest single loss of credibility." },
      { t: "Four small skills", d: "Look up, inhale audibly, smile with the eyes, laugh at yourself. He spent six months learning the eye-reaching smile after finding it missing from years of holiday photos." },
    ],
    worked: "His demonstration of contradiction: an upbeat paragraph about why everyone should learn public speaking, said warmly but with hands doing the opposite. Then he asks whether you were listening to what he said or watching what he did. The room had been watching.",
    watch: "The list of 110 is his own taxonomy, and some claims (smiles and divorce rates) come without a source on screen. Trust the demonstrations, which you can test on your own recording, over the statistics.",
    concepts: [],
    checks: [
      { q: "Of the 110 skills, which does Phillips say lowers your credibility most?", opts: ["Standing behind a lectern", "Filling pauses with 'uh'", "Speaking slowly", "Using too many slides"], a: 1,
        expl: "It signals you don't know what you are saying or where you are going." },
      { q: "When your gestures contradict your words, what does the audience do?", opts: ["Ignore the gestures", "Average the two messages", "Ask what you meant", "Follow the gestures"], a: 3,
        expl: "Positive words with negative hands: the room watched the hands." },
      { q: "What does a calm, slow pace signal, in his account?", opts: ["That what you are saying is important", "That you are nervous", "That you are unprepared", "That you want to finish"], a: 0,
        expl: "A high pace suggests you don't really want to be there." },
    ],
  },

  "spch100.4.10": {
    takeaway: "Caroline Goyder's three lessons, from a voice coach who once bombed: practise the instrument by singing daily, breathe low from the diaphragm because relaxed breathing is what power looks like, and remember that we breathe our thoughts — the in-breath, taken with the mouth closed, decides how the next sentence sounds.",
    beats: [
      { t: "The hall of shame", d: "As a rookie she went too fast, lost her words, and when the microphone broke someone shouted 'speak up'. She concluded that confidence lives inside the body, not on the outside." },
      { t: "An instrument, not a gift", d: "Demosthenes stammered and was jeered, then practised for months in a cellar and over the waves. Her version is easier: sing every day." },
      { t: "Power breathes slowly", d: "The most powerful person in a room has the most relaxed breathing, and the king stays still while everyone moves around him." },
      { t: "The diaphragm", d: "A yoga teacher put a gym weight on her stomach and said lift it with your breath. The thumb below the breastbone gives the same feeling standing up." },
      { t: "Breath is thought", d: "Inspiration and respiration share a root. Breathe in someone you love and the out-breath carries it; breathe in excitement and the voice has excitement in it." },
    ],
    worked: "A client whose husband died on their honeymoon had to give the eulogy in the church where they had married. She wrote that the only way she got through it was what she had practised: breathing low and slow, taking her time, finding the control.",
    watch: "Low breathing is for the moment before a phrase, not a reason to stop after every word. Pair it with thought groups from Unit VI so the breath lands at the end of a meaning.",
    concepts: [],
    checks: [
      { q: "How do actors tell who is most powerful in a room, by her account?", opts: ["They speak first", "They have the most relaxed breathing and stay still", "They stand nearest the door", "They are the loudest"], a: 1,
        expl: "Everyone moves around the king; the king stays still." },
      { q: "What is her simplest daily practice for the voice?", opts: ["Reading the news aloud", "Humming scales at a piano", "Singing — in the shower, in the car, anywhere", "Recording voice notes"], a: 2,
        expl: "Practice is the way to a great instrument." },
      { q: "What is the 'big secret' she ends on?", opts: ["Know when to shut your mouth — take the in-breath with it closed", "Always speak from notes", "Smile before every sentence", "Project to the back wall"], a: 0,
        expl: "All speech is out-breath; the in-breath is where the thought arrives." },
    ],
  },
});

// =====================================================================
// Unit X, top-up (T-037, 2026-10-09) — A7 high-stakes talking, six
// lessons appended after spch100.9.16: slides (David JP Phillips), numbers
// (Chip Heath on Think Fast, Talk Smart), six pitch formats (Dan Pink), the
// 'why you, now' narrative (Andy Raskin), persuasive wording (Jonah Berger,
// Talks at Google), and reading faces during a pitch (Vanessa Van Edwards,
// Talks at Google). Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.9.17": {
    module: "A7",
    mechanic: "A slide competes with you for the audience's small working memory, so design it to be seen, not read: one message, no sentences you also say aloud, the important thing biggest, contrast to steer the eye, a dark background so you stay the brightest thing, and no more than six objects.",
    rules: [
      "One message per slide. With two, people attend to one and lose the other — like hearing your name across a noisy party.",
      "The redundancy effect: sentences on screen while you talk leave close to nothing remembered. Move the sentences into the speaker notes; put a short phrase and an image on the slide.",
      "The eye goes to what is big, moving, high-contrast or signal-coloured. Make the most important element the biggest — which is rarely the headline.",
      "Contrast steers focus: reveal or highlight one item at a time, and use a dark background so you, not the screen, are the highest-contrast object. You are the presentation.",
      "Six objects per slide at most. Counting takes about five times longer than seeing, so use more slides rather than fuller ones.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take one slide you have used, or would use, to explain your work. Rebuild it: one message as a short phrase, the most important element largest, a dark background, no more than six objects. Move every full sentence into the speaker notes." },
    check: "Someone shown the new slide for three seconds can tell you its one message, and you can count its objects without going past six.",
  },

  "spch100.9.18": {
    module: "A7",
    mechanic: "A number nobody can feel is a number nobody acts on, so translate every important number into something people already have instincts about — a familiar comparison, a human-scale timeline, a frequency like 'two out of five' — and spend the last third of the effort on that translation, not on more analysis.",
    rules: [
      "Every number must be translated. People given a comparison alongside an area ('about the size of two Californias') remembered it far better weeks later.",
      "Put time on a human scale: a bulb that lasts seven years is changed when your child learns to walk, again in second grade, and again for driver's ed.",
      "Prefer frequencies to percentages: forty per cent becomes 'two of the last five people whose hands you shook'.",
      "Make data emotional, because emotion is what drives action — Florence Nightingale's charts showed field hospitals killing far more soldiers than the enemy.",
      "If you are not the numbers person in the room, pull the numbers onto your turf: 'if this table is the whole budget, how much of it is this line?'",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Take three numbers from your own work — a price, a time saved, a percentage. For each, write one translation: a comparison to something familiar, a human-scale timeline, or 'x out of y people'." },
    check: "Read the three translations to someone outside your field; without hearing the original numbers they can say whether each is big or small and why it matters.",
  },

  "spch100.9.19": {
    module: "A7",
    mechanic: "A pitch is an invitation to a conversation, not a throw, and Dan Pink gives six compact formats for making one: the Pixar pitch, the subject line, the rhyme, the question, the short post and the one word.",
    rules: [
      "The Pixar pitch: once upon a time, every day, one day, because of that, because of that, until finally.",
      "Every email is a pitch. Subject lines work when they are clearly useful or genuinely intriguing; ones that try to be both do worse.",
      "Rhyme raises processing fluency, so a rhyming line is absorbed and remembered — 'if it doesn't fit, you must acquit'.",
      "A question makes listeners supply their own reasons. 'Are you better off than you were four years ago?' outperformed a statement about the economy.",
      "Own one word, the way a campaign owned 'Forward'. Pitching works best when it is collaborative.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Write the same offer — your service, or a project you want approved — in four of the six formats: a Pixar pitch, a subject line, a question pitch and a one-word pitch." },
    check: "The question pitch can only be answered with the listener's own reasons, and the one word is one you would be glad to have people say when they think of you.",
  },

  "spch100.9.20": {
    module: "A7",
    mechanic: "Stop pitching 'why us' and tell a 'why you, now' story: name an undeniable shift in the customer's world, show that it creates winners and losers, tease the promised land, and only then present what you do as the way to get there.",
    rules: [
      "Most pitches list solutions and explain why we are better than rivals. When dozens of competitors all shout 'why us', that stops working.",
      "Name the shift: what has changed that makes this more valuable now than a few years ago? Ask real customers exactly that question.",
      "Show the stakes — a big opportunity and an existential threat, winners and losers. Reluctant buyers are mostly doing fine; they need to see what is changing.",
      "Tease the promised land, the goal state that means 'happily ever after', then position each feature as a weapon against the monster blocking the way.",
      "Follow the principles, not the template: pasting your logo into someone else's deck is how it fails.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "For your own service, write four lines: the shift ('now every...'), the winners and losers it creates, the promised land, and one monster that blocks it. Then one sentence on how what you do deals with that monster." },
    check: "The first line never mentions you or your product, and a business owner reading it could say 'yes, that is happening to me'.",
  },

  "spch100.9.21": {
    module: "A7",
    mechanic: "Small changes in wording change what people do: turn actions into identities, ask what you could do rather than should, drop hedges you don't mean, state real uncertainty as named conditions you own, pause rather than fill, and ask for advice.",
    rules: [
      "Turn actions into identities: 'can you be a helper?' raised helping by about thirty per cent, and 'be a voter' raised turnout by about fifteen.",
      "When you are stuck, ask what you <em>could</em> do rather than what you <em>should</em> do — 'could' widens the options and produced more creative solutions.",
      "Hedges like 'this might work' make you sound less sure and less persuasive. Cut the ones you don't mean.",
      "When you are genuinely unsure, name it and own it: 'this is a strong option, and for it to work these three things need to happen' — 'it seems to me', not 'it seems'. Pause instead of saying 'um'.",
      "Asking for advice makes people rate you as more competent, not less. 'You' grabs attention, but can sound like blame ('did you finish the report?').",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Take the last proposal or email in which you asked for something. Rewrite it: turn one action into an identity, delete every hedge you didn't mean, and replace one 'I'm not sure this will work' with the conditions it needs in order to work." },
    check: "The rewrite has no 'might', 'maybe' or 'just' that you don't mean, and any uncertainty left in it is stated as named conditions, owned with 'I'.",
  },

  "spch100.9.22": {
    module: "A7",
    mechanic: "In a pitch or a hard conversation the face says what the words don't: learn a handful of expressions — fear, anger, suspicion, contempt, disgust — and answer each one (reassure, explain, find the source, check in) instead of pressing on; and pitch to the other person's personality, not your own.",
    rules: [
      "Hands are a second channel: in her lab's coding, the most-viewed TED talks used far more gestures than the least-viewed. Hiding behind a podium switches that channel off.",
      "Fear (brows up, whites of the eyes) usually means confusion or threat: reassure, explain more, or show calm.",
      "Anger shows as two vertical lines between the brows; tightened lower lids mean suspicion — you are not done explaining. Stay neutral and look for the source.",
      "Contempt, a one-sided raise of the mouth, festers if ignored. Check in at once: 'Are we all good? Anything you'd like me to go back over?'",
      "Use the platinum rule — treat people the way they want to be treated: details and agendas for the conscientious, the big idea for the rest, extra care with bad news for a worrier.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Watch five minutes of any recorded pitch or interview with the sound off. Note each time you see one of the five expressions, with a timestamp, and write what the speaker could have said next." },
    check: "You logged at least three timestamped expressions, each paired with a specific next line — reassure, explain, ask about the source, or check in — rather than 'keep going'.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.9.17": {
    takeaway: "David JP Phillips's five rules for slides that don't kill the room: one message, no sentences you also speak (the redundancy effect), the important thing biggest, contrast and a dark background to steer the eye, and six objects at most — which means more slides, not fewer.",
    beats: [
      { t: "Working memory is tiny", d: "Car five, seat 42: people check a train ticket about six times before they sit down. Slides draw on the same memory." },
      { t: "One message", d: "Two messages split attention, like hearing your name across a party and nodding along to the person in front of you." },
      { t: "The redundancy effect", d: "Text on the slide while you speak leaves close to nothing remembered. Sentences go in the notes; the slide gets short phrases and an image." },
      { t: "Size and contrast", d: "Eyes go to moving, signal-coloured, high-contrast and big things. Shrink the headline so the eye falls to the content; reveal one item at a time." },
      { t: "Dark background", d: "On a white slide the screen out-contrasts and out-sizes you. Darken it and you become the visual aid." },
      { t: "Six objects", d: "A few balls are seen in about two-tenths of a second; more must be counted, about five times slower. Past six, the audience stops seeing." },
    ],
    worked: "One deck he worked on went from 95 crowded slides to 135 sparse ones, with an immediate result for the project. Rules that cap the number of slides just make people cram 36 slides' worth into four.",
    watch: "These rules are for slides that sit behind a speaker. A deck that will be read alone — a leave-behind after an audit — needs its sentences. Make two versions rather than one that does both badly.",
    concepts: [],
    checks: [
      { q: "What is the 'redundancy effect' he warns about?", opts: ["Repeating your key point three times", "Showing sentences on screen while you say them, so almost nothing is remembered", "Using one template for every deck", "Two slides carrying the same message"], a: 1,
        expl: "Pull the text into the notes field and keep the slide for short phrases and an image." },
      { q: "Why does he recommend a dark background?", opts: ["It prints better", "It saves battery", "So you, not the screen, are the biggest high-contrast object", "White is hard to read in sunlight"], a: 2,
        expl: "You are the presentation; the slide is the support." },
      { q: "What is his limit for objects on one slide?", opts: ["Six", "Three", "Ten", "Fifteen"], a: 0,
        expl: "Beyond six, people count instead of see." },
    ],
  },

  "spch100.9.18": {
    takeaway: "Chip Heath on Stanford's Think Fast, Talk Smart: untranslated numbers are like shouting a phrase in a language half the room doesn't speak. Translate every important number into a comparison, a human-scale timeline or a frequency, and make it emotional — the curse of knowledge hides how much the audience needs this.",
    beats: [
      { t: "The curse of knowledge", d: "Experts can't imagine not knowing what they know — doctors, lawyers, an eleven-year-old explaining his favourite game. The cure is concrete language." },
      { t: "Translate every number", d: "When a search result gave an area with a comparison ('about two Californias'), people remembered it much better a week and six weeks later." },
      { t: "Human-scale time", d: "His students sold a seven-year bulb by tying each change to a child's milestones: learning to walk, second grade, driver's ed." },
      { t: "Frequencies beat percentages", d: "Forty per cent skip handwashing becomes two of the last five people you shook hands with — and listeners reach for the sanitiser." },
      { t: "Make data emotional", d: "Florence Nightingale's charts showed hospitals killing far more soldiers than the enemy did. Emotion is what moves people to act." },
      { t: "The last third", d: "After the analysis you are tired and two-thirds done; the translation is the extra third most people skip." },
    ],
    worked: "In a budget meeting where you are not the numbers person: 'Let's imagine this table is the whole budget — how much of it does this line take up?' The analyst gets to calculate, and everyone else can now see whether it is trivial or huge.",
    watch: "A translation has to keep the proportion honest. Dollar bills stacked to the moon are concrete, but nobody has a feel for that distance either — pick something from daily life.",
    concepts: [],
    checks: [
      { q: "What does Heath mean by 'every number must be translated'?", opts: ["Convert it into another currency", "Round it to one decimal place", "Put it into terms people already have a feel for", "Show it in a chart"], a: 2,
        expl: "Comparisons, human-scale timelines and frequencies." },
      { q: "Which version of '40% don't wash their hands' did he find most powerful?", opts: ["Two of the last five people you shook hands with", "Four in ten adults", "Forty per cent of the population", "Nearly half of everyone"], a: 0,
        expl: "We are bad at picturing probabilities and good at picturing people." },
      { q: "Why, in his view, do analysts skip translating?", opts: ["They are not allowed to simplify", "After the analysis they are tired, and translating takes another third of the effort", "Audiences prefer raw numbers", "It makes the numbers less accurate"], a: 1,
        expl: "Getting the answer feels like the finish line; communicating it is the rest of the job." },
    ],
  },

  "spch100.9.19": {
    takeaway: "Dan Pink's six pitches from To Sell Is Human — Pixar, subject line, rhyme, question, short post and one word — each a way to invite a conversation rather than throw a message at someone.",
    beats: [
      { t: "Pixar pitch", d: "Emma Coats's story spine used as a pitch: we see the world as episodes, not as logical propositions." },
      { t: "Subject line", d: "Utility or curiosity, not a muddle of both. A campaign's most-opened email said only 'Hey'." },
      { t: "Rhyming pitch", d: "Rhyme increases processing fluency. Johnnie Cochran's line from the O. J. Simpson trial is still remembered." },
      { t: "Question pitch", d: "Questions are active and statements passive. Reagan asked instead of asserting, and voters supplied the reasons." },
      { t: "Short post and one word", d: "Useful information and questions do well in short posts. Own one word, the way 'Forward' carried a campaign." },
    ],
    worked: "In 1980 Reagan could have said economic conditions had deteriorated over 48 months. He asked, 'Are you better off now than you were four years ago?' — and each listener did the persuading by thinking it through.",
    watch: "A rhyme or one-word pitch that is clever but untrue is a slogan, not a pitch. Use the format to make a true point easier to hold.",
    concepts: [],
    checks: [
      { q: "Which two kinds of subject line work, according to Pink?", opts: ["Long ones and short ones", "Useful ones and curiosity ones — not a mix", "Questions and commands", "Personal ones and formal ones"], a: 1,
        expl: "Anything in between does poorly." },
      { q: "Why is a question pitch more persuasive than a statement?", opts: ["Listeners start articulating their own reasons", "It sounds more polite", "It is shorter", "It hides the ask"], a: 0,
        expl: "People believe the reasons they come up with themselves." },
      { q: "What does Pink say a pitch really is?", opts: ["A performance", "A throw you either catch or miss", "An invitation to a conversation", "A list of features"], a: 2,
        expl: "Pitching, done well, is collaborative." },
    ],
  },

  "spch100.9.20": {
    takeaway: "Andy Raskin, author of 'The Greatest Sales Deck I've Ever Seen': the story that cuts through a crowded market is not 'why us' but 'why you, now' — name the shift, show the winners and losers, tease the promised land, and make your product the weapon for getting there.",
    beats: [
      { t: "The restaurant sign", d: "A list of dishes, then reasons under 'why should I come in?' — the self-centred 'why us' most companies use." },
      { t: "Zuora's story", d: "It opens with a change in the world — we have moved to a subscription economy — and celebrates those who adapt. It is not about Zuora at all." },
      { t: "Luke, the reluctant buyer", d: "Obi-Wan's demo doesn't move Luke; a change in his world does, and then there are stakes. Most buyers aren't in pain — they assume life will stay okay." },
      { t: "Ask customers what changed", d: "Logikcull asked customers why it was more valuable now and heard 'now everything is discoverable'. Prospects say 'that's me' at that slide." },
      { t: "Features as weapons", d: "Zaius named the monster — marketing data and campaign tools in separate systems — and pointed every feature at it. The 'how are you different?' questions stopped." },
      { t: "Belonging", d: "A promised-land story is an invitation to join people heading somewhere. Even a pizza place can tell one." },
    ],
    worked: "Logikcull, a legal-discovery platform: the shift was 'now everything is discoverable' — data from drones, cars, chats; deadlines haven't changed, so you either fail miserably or look like a star; the promised land is instant discovery. Raskin reports new reps' time to their first win fell from about sixty days to under thirty.",
    watch: "A shift you can't evidence is a scare tactic. His teams interviewed real customers about what had changed before they wrote a slide.",
    concepts: [],
    checks: [
      { q: "What is the first move in a 'why you, now' story?", opts: ["Show the product demo", "List your differences from competitors", "Name an undeniable shift in the customer's world", "Tell your founding story"], a: 2,
        expl: "The shift creates the urgency that a feature list can't." },
      { q: "Which question did his clients put to their customers?", opts: ["What has changed such that having this is more valuable now than a few years ago?", "What do you dislike about our competitors?", "How much would you pay?", "Which feature should we build next?"], a: 0,
        expl: "The answers became the shift on the first slide." },
      { q: "Why do people who copy the Zuora deck often fail, in his account?", opts: ["The deck is too long", "They paste their logo into a template instead of following the principles", "They pitch to the wrong buyer", "They leave out pricing"], a: 1,
        expl: "Like a good film, a narrative has its own flow." },
    ],
  },

  "spch100.9.21": {
    takeaway: "Jonah Berger at Talks at Google on Magic Words: six kinds of language (similarity, questions, emotion, agency, confidence, concreteness), with depth on identity nouns, could versus should, hedges and how to state uncertainty without sounding unsure, and why asking for advice raises how competent you look.",
    beats: [
      { t: "Help versus helper", d: "Asking young children to 'be a helper' rather than to 'help' raised helping by about thirty per cent; 'be a voter' raised turnout by about fifteen. We want to hold desirable identities." },
      { t: "Nouns sound stable", d: "A 'runner' runs more than someone who runs; a 'hard worker' sounds more consistent than 'hard-working'." },
      { t: "Could, not should", d: "'Should' implies a single right answer; 'could' widens the options, and people produced more creative solutions." },
      { t: "Certainty persuades", d: "People preferred a more certain financial advisor even when he was no more accurate. Habitual hedges undercut you." },
      { t: "Name and own uncertainty", d: "'It's a great idea, but these three things need to happen' and 'it seems to me' keep you honest without sounding unsure. Pause instead of 'um'." },
      { t: "Ask for advice", d: "People who asked their partner for advice were rated as more competent — everyone thinks their own advice is good." },
      { t: "When to hedge", d: "Certainty is a tool. In a small team meeting, or as the newest member, hedging signals openness — and certainty lands differently across cultures." },
    ],
    worked: "Instead of telling a client 'I'm not sure this strategy will work', say 'I think this is a strong strategy — and for it to work, these three things need to happen.' Both admit uncertainty; only the second sounds like you have thought it through.",
    watch: "One of his examples of confident speech is a politician; the point is the mechanism, not the politics. Certainty you don't have is overconfidence — name the conditions instead of faking it.",
    concepts: [],
    checks: [
      { q: "Why did 'can you be a helper?' work better than 'can you help?'", opts: ["It is shorter", "It frames the action as an identity people want to hold", "It sounds more polite", "Children prefer nouns"], a: 1,
        expl: "Turning actions into identities makes them more appealing to take on." },
      { q: "How does Berger suggest expressing real uncertainty without undermining yourself?", opts: ["Don't mention it", "Add more hedges to be safe", "Name the conditions it depends on and own it with 'I'", "Speak more quickly"], a: 2,
        expl: "Calling out the hurdles shows you have thought about them." },
      { q: "What happened to people who asked their partner for advice?", opts: ["They were seen as more competent", "They were seen as less intelligent", "Nothing changed", "They were seen as lazy"], a: 0,
        expl: "The person asked thinks: they must be smart, they asked me." },
    ],
  },

  "spch100.9.22": {
    takeaway: "Vanessa Van Edwards at Talks at Google: her lab's coding of TED talks, inaugural addresses and Shark Tank pitches, then a crash course in five facial expressions to watch for during a pitch and what to say when you see each — plus pitching to the other person's personality.",
    beats: [
      { t: "Hands as a second track", d: "The most-viewed TED talks averaged about 465 hand gestures in eighteen minutes, the least-viewed about 272. Gestures work like bold type." },
      { t: "Shark Tank", d: "Mistakes with the numbers sank 64 per cent of failed pitches whatever the charisma. Past that, 45 per cent of successful entrepreneurs smiled walking in, against 21 per cent of unsuccessful ones." },
      { t: "Fear, anger, suspicion", d: "Fear widens the eyes — reassure or explain. Anger draws two vertical lines; suspicion tightens the lower lids, a sign you are not done selling." },
      { t: "Contempt and disgust", d: "Contempt, a one-sided smirk, festers and needs addressing now. Disgust often appears when someone is hunting for a polite way to say no — give them permission to say it." },
      { t: "Personality", d: "High-conscientiousness people want agendas and details; low want the big idea. Worriers take longer to recover from even small bad news." },
      { t: "Disraeli and Gladstone", d: "After dinner with Gladstone a journalist thought him the cleverest person in England; after Disraeli, she thought she was." },
    ],
    worked: "You see a flash of contempt when you mention the price. Instead of pushing on: 'Are we all good? Anything you'd like me to go back over?' Then go back over that part and watch whether the expression returns.",
    watch: "These are her lab's findings and a popular reading of Paul Ekman's work; the claim that nonverbal signals carry about twelve times the weight of words is hers, and reading micro-expressions is contested by other researchers. Treat a face as a cue to check in, never as proof of what someone thinks.",
    concepts: [],
    checks: [
      { q: "As you explain your price, someone's lower eyelids tighten. What does she say that signals?", opts: ["Boredom", "Suspicion — you are not done explaining", "Agreement", "Tiredness"], a: 1,
        expl: "Keep explaining; the sale isn't made yet." },
      { q: "Why does she say contempt has to be addressed straight away?", opts: ["It is the one emotion that doesn't fade by itself", "It means the deal is lost", "It is the most common expression", "It shows the person is lying"], a: 0,
        expl: "Fear and anger burst and pass; contempt sits and grows." },
      { q: "What is the 'platinum rule'?", opts: ["Always pitch to the most senior person", "Treat others the way you want to be treated", "Treat others the way they want to be treated", "Mirror the other person's posture exactly"], a: 2,
        expl: "Meet people through the lens of their personality, not yours." },
    ],
  },
});

// =====================================================================
// Unit VII, top-up (T-037, 2026-10-09) — A5 humour you can build, three
// lessons appended after spch100.6.11: Scott Dikkers (The Onion) on a
// repeatable writing process, Bob Mankoff (The New Yorker) on incongruity
// and context, and John Cleese's 1991 talk on the open and closed modes.
// Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.6.12": {
    module: "A5",
    mechanic: "Writing funny reliably is a process, not a mood: generate in 'clown' mode without judging, refine in 'editor' mode, get neutral feedback on the whole shape early, and in writing do the job a comedy club does for a comedian — announce the joke with a funny title and keep the beats escalating.",
    rules: [
      "The clown is pure creative energy and the editor is pure judgement. Most adults are stuck in editor; a professional dips into clown for the rough draft and into editor to refine and to weigh feedback.",
      "Having fun matters, but fun doesn't make the work good. Skill grows when you meet neutral feedback — a paying or indifferent audience — and adjust until what you love meets what they like.",
      "Get feedback on the whole shape early: a two-to-three-page treatment, or tell the story aloud. If listeners interrupt with questions instead of leaning in, the outline has a problem.",
      "Ask readers specific questions: their overall impression, then five things that didn't work and a fix for each. Praise tells you little.",
      "Written comedy has no room, no timing and no club, so the title must tell readers this will be funny, and the joke beats must escalate.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Clown pass, five minutes: write ten possible funny titles for one true, mildly annoying thing from your week, judging none of them. Editor pass, five minutes: pick the best and write three joke beats under it that get bigger in order." },
    check: "All ten titles exist before any was crossed out, and the three beats escalate — the third would not work as the first.",
  },

  "spch100.6.13": {
    module: "A5",
    mechanic: "A joke fuses two things that don't belong together — the syntax of politeness with a rude message — and whether it is funny depends on context: the same violation is benign in one setting and malign in another, and the best target is often us rather than them.",
    rules: [
      "Incongruity is the engine: expectations defied, the narrative switched. 'How about never — is never good for you?' pairs a polite form with a rude message.",
      "Nothing is funny in itself; it depends on context and expectation. A line that is a benign violation in a book of rejected cartoons is a malign one beside an article on cancer research.",
      "Choose the target on purpose. Most humour is a friend mocking an enemy; The New Yorker aims at its own readers — our obsessions, narcissism and foibles.",
      "Bring two frames of reference together fast: if they don't connect within about half a second, it isn't funny.",
      "It is a numbers game: cartoonists bring ten to fifteen ideas a week and most are rejected, and seventy-five per cent satisfaction is about the best humour ever gets.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write the same complaint about your field twice: once aimed at outsiders (them), once aimed at yourself or people like you (us). Build each on one incongruity — a polite form carrying a rude message, or two frames that collide." },
    check: "A colleague would laugh and wince at the 'us' version, and for both you can name the two things you collided.",
  },

  "spch100.6.14": {
    module: "A5",
    mechanic: "Creativity is a mode, not a talent: ideas come in the relaxed, playful 'open' mode and get carried out in the purposeful 'closed' one, and you can set up the open mode with space, a fixed time, longer pondering, the confidence that nothing is wrong, and humour.",
    rules: [
      "Open mode is relaxed, curious and playful; closed mode is purposeful and a little anxious. Ponder in open, act in closed, then return to open to review the result.",
      "Make an oasis: somewhere you won't be interrupted, with a definite start and end. Allow about ninety minutes, because the mind races with urgent trivia before it quietens.",
      "Tolerate the discomfort of an unsolved problem for longer. Ask when a decision really has to be made, and keep pondering until then instead of grabbing the first answer.",
      "While you are playing nothing is a mistake; absurd 'intermediate impossibles' are stepping stones to ideas that work.",
      "Humour moves you from closed to open faster than anything, and serious is not the same as solemn. A joke and a new idea are the same act: connecting two frames of reference in a way that makes new meaning.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Ten minutes, door closed, phone away. Take one stuck problem — a talk opening, a joke that isn't working. Pair your topic with five unrelated objects and write one line connecting each pair. Don't judge anything until the timer ends." },
    check: "All five pairings have a line, at least one is something you would have rejected in the first minute, and you chose one to develop only after the timer rang.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.6.12": {
    takeaway: "Scott Dikkers, founder of The Onion, interviewed on how to write funny reliably: switch on purpose between the clown (generate) and the editor (judge), get neutral feedback on the whole shape before polishing, and in writing give readers what a club gives a comedian — a funny title and escalating beats.",
    beats: [
      { t: "Stick with what works", d: "Brands build when something people like is produced consistently; a daily comic strip and a weekly print deadline kept him at it." },
      { t: "Fun, then neutral feedback", d: "Eddie Murphy and Chris Farley looked like overnight talents but had been at it since childhood. The real development started when they met audiences who owed them nothing." },
      { t: "Clown and editor", d: "Children are all clown; many adults are all editor, which is writer's block. Professionals move between the two with precision." },
      { t: "Feedback on the shape", d: "He gets notes on a short treatment before drafting, and tells film outlines aloud — questions from the listener mean a broken outline." },
      { t: "Beta readers", d: "Twenty to fifty readers, picked for variety, fill in a form: overall impression, five things that didn't work, a fix for each. Problems many of them mention get fixed." },
      { t: "Writing is the hardest medium", d: "No room to read, no control of timing, no club announcing comedy. So the title announces the joke and the beats are paced to escalate." },
    ],
    worked: "His favourite character is the bumbling authority — Leslie Nielsen's doctors and detectives — and The Onion is that character: an important-sounding newspaper saying silly things. Casting a newsreader with a deep, perfect 'voice of authority' for its radio show made every line funnier.",
    watch: "This is an interview, and after about 33:20 it turns to his views on satire and the state of the world rather than craft — stop there. The eleven filters themselves are in this unit's earlier lesson.",
    concepts: [],
    checks: [
      { q: "What does Dikkers say writer's block usually is?", opts: ["A lack of talent", "Being stuck in editor mode, judging before anything is written", "Not reading enough", "Writing at the wrong time of day"], a: 1,
        expl: "The editor cuts everything before it reaches the page." },
      { q: "Why does a written funny piece need a funny title?", opts: ["The reader isn't in a comedy club, so the title has to announce that this will be funny", "Search engines prefer it", "Editors insist on it", "It replaces the first joke"], a: 0,
        expl: "Most writers go from a dull title straight into a block of grey text and lose the reader." },
      { q: "What does he ask beta readers for?", opts: ["A star rating", "What they liked best", "An overall impression, five things that didn't work, and a fix for each", "A line edit"], a: 2,
        expl: "Praise isn't actionable; problems and proposed fixes are." },
    ],
  },

  "spch100.6.13": {
    takeaway: "Bob Mankoff, The New Yorker's cartoon editor, on designing humour: incongruity fuses things that don't belong; context decides whether a violation is benign or malign; the target can be us rather than them; and it is all a numbers game of many ideas and a lot of rejection.",
    beats: [
      { t: "Seventy-five per cent", d: "No humour pleases everyone. An angry letter about 'jokes on old white males' and an animal lover who rated a cartoon two show how wide the spread is without a laughing room around you." },
      { t: "Danger with bars", d: "Entertainment needs a little danger with protection, like a zoo. Ask where the tiger is and how you will manage it." },
      { t: "Idea drawings", d: "His contract said 'idea drawings', not cartoons: work that needs thinking from the cartoonist and from the reader." },
      { t: "Incongruity", d: "'No, Thursday's out. How about never — is never good for you?' fuses the syntax of politeness with the message of rudeness." },
      { t: "Context decides", d: "A crude line is perfect in a book of rejects and malign beside an article on the immune system. The week after 9/11 the magazine ran no cartoons at all." },
      { t: "Target us", d: "'I started my vegetarianism for health reasons... now it's just to annoy people.' The humour reflects back on the reader." },
    ],
    worked: "After 9/11 the magazine waited a week, then ran: 'I thought I'd never laugh again. Then I saw your jacket.' The joke isn't about the attackers; it is about us choosing to go on living — and the context made it a benign violation.",
    watch: "Self-directed humour works for The New Yorker because its readers share the target. In a pitch, 'us' should mean you or your shared trade — never the client sitting in front of you.",
    concepts: [],
    checks: [
      { q: "Why does 'How about never — is never good for you?' work, by his analysis?", opts: ["It is short", "A polite form carries a rude message — two things that don't belong together", "It uses a famous name", "It rhymes"], a: 1,
        expl: "Incongruity: we hold both readings at once." },
      { q: "Why would a cartoon that is perfect in The Rejection Collection fail in The New Yorker?", opts: ["Context turns a benign violation into a malign one", "The drawing is worse", "The readers are older", "It is too long"], a: 0,
        expl: "There is no such thing as funny in and of itself." },
      { q: "Who is usually the target of New Yorker humour, as he describes it?", opts: ["Politicians", "Other magazines", "The readers themselves — our obsessions and foibles", "Foreigners"], a: 2,
        expl: "Most humour is friends mocking enemies; theirs reflects back on us." },
    ],
  },

  "spch100.6.14": {
    takeaway: "John Cleese's 1991 talk on creativity: it is a way of operating, not a talent. You need the open mode to have ideas and the closed mode to carry them out, and you can set up the open mode with space, time, more time, confidence and humour.",
    beats: [
      { t: "Not a talent", d: "Donald MacKinnon's research found the most creative architects, scientists and writers no different in IQ; they could get themselves into a playful, almost childlike mood." },
      { t: "Open and closed", d: "In the closed mode Fleming would have thrown away the dish where nothing grew; in the open mode he got curious about it. Hitchcock told stories when a writing session got tense." },
      { t: "Space and time", d: "Seal yourself off for a defined period. The first minutes fill with urgent trivia; sit through it and the mind quietens. Ninety minutes, then stop." },
      { t: "More time", d: "A Python colleague took the first solution and finished by five; Cleese sat with the discomfort for another hour and got something more original. Defer decisions until they are due." },
      { t: "Confidence and humour", d: "While playing, nothing is a mistake. Humour gets you into the open mode fastest — serious subjects don't require solemnity." },
      { t: "Connecting frameworks", d: "A joke and an idea both connect two frames of reference. Random juxtapositions can start it; intuition picks which ones mean something." },
    ],
    worked: "The airline pilot asked when he last had sex says '1958' — and, seeing the researcher's surprise, 'well, it's only 2110 now'. The laugh arrives the moment two frames, a year and the 24-hour clock, connect: the same click as a new idea.",
    watch: "The talk was given to managers and ends with an ironic list of ways to stamp out creativity in your staff — it is satire, not advice. The light-bulb jokes in between are period filler, not models to copy.",
    concepts: [],
    checks: [
      { q: "Why, in Cleese's telling, did Fleming notice what became penicillin?", opts: ["He was in the open mode, so a useless dish became a clue", "He was working under pressure", "He had a higher IQ than colleagues", "He followed a strict protocol"], a: 0,
        expl: "In the closed mode an uncultured dish is an irrelevance; in the open mode it is a clue." },
      { q: "What does he recommend when you face a decision?", opts: ["Decide at once to look decisive", "Ask when it has to be taken, and keep pondering until then", "Delegate it", "Put it to a vote"], a: 1,
        expl: "The most creative people tolerate the discomfort of an unsolved problem for longer." },
      { q: "What does he say a joke and a new idea have in common?", opts: ["Both need a punchline", "Both work best in groups", "Both connect two frames of reference in a new way", "Both should be short"], a: 2,
        expl: "The laugh, and the idea, come at the moment of connection." },
    ],
  },
});

// =====================================================================
// Unit VIII, top-up (T-037, 2026-10-09) — A6 humour in real time, four
// lessons appended after spch100.7.8: Second City's Anne Libera and Kelly
// Leonard (yes-and, and 'thank you because'), Greg Dean on crowd work, a
// comedy MC on prepared lines, and English with Lucy on teasing and
// comebacks. Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.7.9": {
    module: "A6",
    mechanic: "Improvisation is practice at being unpractised: say 'yes, and' at the front end of ideas to get abundance, and when you genuinely disagree, start with 'thank you because' and something you truly valued before you say what worries you.",
    rules: [
      "Pitch ideas to people told to negate every one, then to people told to yes-and every one: the first feels deflating, the second gets louder and the ideas get bigger.",
      "Yes-and belongs at the front end — the first minutes of a brainstorm — to get an abundance of ideas. It is not a rule to agree with everything, and it can be used to manipulate.",
      "When you genuinely disagree, say 'thank you because…', name something you valued in what they said, then give your concern. Genuine gratitude makes people readier to hear criticism.",
      "Repeat the last word the other person said, in your head or aloud, before you reply — it makes you listen to the end instead of planning halfway through.",
      "Break a rut with a 'slightly bad idea' day, and build an ensemble with one-word-at-a-time stories. An ensemble is as good as its ability to cover for whoever is weakest at the moment.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "With a friend or colleague, plan an imaginary event in three quick rounds: one of you blocks every idea; then you yes-and every idea; then real objections are allowed, but only after 'thank you because…'. Afterwards write one sentence on how each round felt." },
    check: "You have a sentence for each round, and in the third round every objection followed something specific you genuinely valued — not a generic 'thanks'.",
  },

  "spch100.7.10": {
    module: "A6",
    mechanic: "Riffing with people live is joke-writing under pressure: hear what their answer is about, take a negative opinion of it (the premise), connect it to a second idea, then keep going — escalate the consequences, tag the laugh, and compare it to something it shouldn't resemble.",
    rules: [
      "Find the premise in their answer: a subject plus your negative opinion of it. Without one you stall and start thinking 'what's funny?' instead of listening.",
      "A joke is two different ideas connected. Spot the assumption in what they said and reinterpret it.",
      "Escalate the consequences — a bad day into a nuclear winter, a cough into a pandemic — so the tension builds like a balloon.",
      "Tag: add another punchline to the same setup while the laugh is still going, then another.",
      "Compare: 'an accountant who hates numbers — that's like a lifeguard who hates water.' Say your honest opinion; people respect a consistent point of view even when they disagree.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Write three ordinary answers people give you — where they're from, what they do, how their week went. For each, write the premise (subject plus negative opinion), one comparison ('that's like…') and two tags." },
    check: "Every line ties back to the premise you wrote, and at least one comparison joins two things that clearly don't belong together but share a real feature.",
  },

  "spch100.7.11": {
    module: "A6",
    mechanic: "Much of what looks improvised is prepared: the same few names, jobs and home towns come up again and again, so write a line for each in advance and drop it in when the moment comes.",
    rules: [
      "Good crowd work is as much giving the impression of improvising as actually improvising.",
      "The questions are predictable — name, job, where you're from — and so are most of the answers.",
      "Write a line for each common answer and keep it in your back pocket; it still works years later.",
      "Expect the answers people invent to mess with you, like airline pilot, and have something for those too.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "List the five questions you are asked most at events — what do you do, where are you from, how's business. Write one short, true, lightly funny answer to each that you could use for a year." },
    check: "Each line is under fifteen words, is true, and doesn't need the other person to have heard it before.",
  },

  "spch100.7.12": {
    module: "A6",
    mechanic: "Playful teasing is affectionate irony between people who trust each other: say the opposite of what you mean ('nice one, genius'), answer a jab on the same theme or turn it on yourself, and end the volley with a self-deprecating agreement before anyone gets hurt.",
    rules: [
      "Teasing becomes bullying the moment you mean to hurt. People can laugh on the outside and feel awful inside, so when unsure, err on the side of caution.",
      "Irony and sarcasm carry the tease: calling someone 'genius' just after a wrong answer, or a doubtful 'oh yeah?' at their confidence.",
      "A comeback stays on the same theme ('genius' answered with 'all right, Einstein') or turns on yourself ('you and me both, mate').",
      "Cheeky lines like 'I bet that sounded funnier in your head' are for friends, not for people you've just met.",
      "Know when to stop: a self-deprecating agreement ('me too') closes the back-and-forth before someone gets annoyed.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write a six-line back-and-forth between you and a friend about something small that went wrong — a missed train, a burnt dinner — with one ironic tease, one same-theme comeback, one self-deprecating line and a line that ends it." },
    check: "No line touches something the other person can't change or is sensitive about, and the last line lowers the temperature rather than scoring one more point.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.7.9": {
    takeaway: "Second City's Anne Libera and Kelly Leonard run their classic exercise on a live conference audience — ideas met first by people told to negate them, then by people told to yes-and them — and add a tool from their work with Chicago behavioural scientists: 'thank you because', genuine gratitude before a genuine disagreement.",
    beats: [
      { t: "Yoga for your social skills", d: "Improv is loud group mindfulness and practice at being unpractised. It began as Viola Spolin's games for immigrant children at Hull House, many of them silent or in gibberish." },
      { t: "Negate, then yes-and", d: "Pitching to people who deny everything was 'challenging' — one participant said it felt like being a woman in a meeting. The yes-and round was exhilarating for everyone." },
      { t: "Front end only", d: "The man in the suit who says he'd get no work done if he yes-anded everything misses the point: it is five minutes at the start of a brainstorm. And it can be used for evil." },
      { t: "Thank you because", d: "Research shows gratitude makes people more open to negative feedback. It was the round people found hardest to stop talking in." },
      { t: "The last word", d: "Stating the last word someone said before you answer forces you to listen to the end of the sentence." },
      { t: "Taboo day and the ensemble", d: "Asked for ideas Second City would never stage, the cast produced scenes that mostly ended up in the show. An ensemble compensates for its weakest member — who could be anyone." },
    ],
    worked: "Demonstrated live: 'Let's build a dome on the moon for the reunion.' 'Thank you, because there's such poetry in that idea — but the budget worries me.' 'Thank you — I appreciate that you're grounding me while looking for a way to make it happen.'",
    watch: "'Thank you because' works only if the 'because' is something you actually heard and valued; said by rote, it is the manipulation they warn about. The exercise rounds are crowd noise — follow along in the transcript.",
    concepts: [],
    checks: [
      { q: "When is 'yes, and' meant to be used, according to Leonard?", opts: ["In every conversation, always", "At the front end of ideas — the first minutes of a brainstorm — to get abundance", "Only on stage", "When closing a deal"], a: 1,
        expl: "It is rapid prototyping for ideas, not a vow never to say no." },
      { q: "What is 'thank you because'?", opts: ["Naming something you genuinely valued in what someone said before stating your disagreement", "A polite way to end a meeting", "A way of avoiding disagreement", "A thank-you note after a pitch"], a: 0,
        expl: "Gratitude first makes the disagreement easier to hear." },
      { q: "Why repeat the last word someone said before you reply?", opts: ["To sound agreeable", "To buy time to think", "It forces you to listen to the end instead of planning your answer", "To mirror their accent"], a: 2,
        expl: "Most of us start composing a reply halfway through." },
    ],
  },

  "spch100.7.10": {
    takeaway: "Greg Dean on why crowd work is so popular and what it really is: joke-writing done live. Find the premise in someone's answer, connect it to something else, build a story with more questions, escalate, tag, take other points of view, and compare.",
    beats: [
      { t: "Not luck or charisma", d: "Strong crowd work is applied joke writing under pressure; an unfunny answer is exactly where the skill shows." },
      { t: "Premise first", d: "In his system a premise is a negative opinion about a subject. Hear the subject in their answer and pick your position, or you loop on 'what's funny?' and stop being present." },
      { t: "Two ideas connected", d: "Identify the assumption in what was said and reinterpret it instantly." },
      { t: "Escalate and tag", d: "Make the consequences worse with each line; follow a punchline with more punchlines and no new setup." },
      { t: "Judgement and points of view", d: "Your honest opinions show your values; people may disagree but respect consistency. Speaking as the tree, the fire or the firefighter adds angles." },
      { t: "Comparisons", d: "'I'm an accountant but I hate numbers' — 'that's like a lifeguard who hates water.' Or treat a relationship as an ice-hockey game: it starts with icing, fights break out, the counsellor is the referee." },
    ],
    worked: "His tag chain: 'For Father's Day I took my father out.' 'It only took three shots.' 'I could always drink him under the table.' 'Not sure why we drank under the table.' 'Maybe because he was my priest.' Every tag rides on the first setup.",
    watch: "It is a promotional 'blogcast' for his paid class, and on stage the target volunteered for it. Off stage, aim the negative opinion at the situation or at yourself, not at the person who just answered you.",
    concepts: [],
    checks: [
      { q: "In Dean's system, what is a premise?", opts: ["The first line of a joke", "A negative opinion about a subject", "A funny fact", "The audience's assumption"], a: 1,
        expl: "It is the engine for the jokes that follow." },
      { q: "What is a tag?", opts: ["A punchline that follows a punchline without a new setup", "A callback to an earlier joke", "A hashtag on a clip", "A question to the audience"], a: 0,
        expl: "Tags keep the laughter rolling." },
      { q: "'I'm an accountant who hates numbers.' Which reply uses his comparison technique?", opts: ["'Why did you become one?'", "'Numbers hate you too.'", "'That's like a lifeguard who hates water.'", "'Me too.'"], a: 2,
        expl: "Find another pair that shares the same contradiction." },
    ],
  },

  "spch100.7.11": {
    takeaway: "A London comedy MC's safe crowd-work technique: because the same names, jobs and places come up night after night, he pre-writes jokes for them and drops them in, so it looks spontaneous.",
    beats: [
      { t: "The impression of improvising", d: "Being quick with a crowd is a skill worth building, but much good MC work leans on material written in advance." },
      { t: "Predictable answers", d: "In London a handful of names — Dave, Rob, Phil, Helen, Sarah — and the same ten or twenty jobs and places keep coming up." },
      { t: "Sixty jokes", d: "A line for each of those, kept for years, means he always seems quick when he meets Dave who works in IT." },
      { t: "The liars", d: "People messing with you claim to be airline pilots or gynaecologists — expect them." },
    ],
    worked: "At a networking event, 'So what do you do?' is certain. A prepared, true line about your work — written once, tried a few times — means you never freeze, and the conversation can go somewhere unplanned after it.",
    watch: "It is a short clip from a course promotion. A prepared line opens the door; after it, listen and riff — the previous lesson.",
    concepts: [],
    checks: [
      { q: "What is the MC's 'safe' crowd-work technique?", opts: ["Never talking to the audience", "Pre-written jokes for the names, jobs and places that always come up", "Asking only yes-or-no questions", "Picking on latecomers"], a: 1,
        expl: "It gives the impression of improvising." },
      { q: "Why does it work?", opts: ["The same handful of answers come up again and again", "Audiences never listen closely", "Every crowd is different", "Comedians memorise names in advance"], a: 0,
        expl: "Name, job and home town are predictable." },
      { q: "Which job claims does he say often mean someone is messing with you?", opts: ["Teacher and nurse", "Accountant and lawyer", "Airline pilot and gynaecologist", "IT and sales"], a: 2,
        expl: "Have a line ready for the liars too." },
    ],
  },

  "spch100.7.12": {
    takeaway: "English with Lucy on British banter: playful teasing and clever comebacks are a big part of the culture, built on irony, same-theme replies and self-deprecation — with a firm line between teasing and bullying, and a knack for ending it.",
    beats: [
      { t: "Don't give up your day job", d: "Said to a friend after off-key karaoke: irony to ease an awkward moment, with no intent to offend." },
      { t: "Teasing versus bullying", d: "It crosses the line when you mean to hurt. Someone can laugh on the outside and feel uncomfortable inside." },
      { t: "At the pub quiz", d: "'You're having a laugh, aren't you?', 'you and me both, mate', 'you and your trusty pal Google' — doubt, shared self-deprecation and a sarcastic jab." },
      { t: "Cheeky comebacks", d: "'I bet that sounded funnier in your head' and 'you know you love it' work between friends; with someone you've just met, they probably won't." },
      { t: "Same theme", d: "'Nice one, genius' after a wrong answer is met with 'all right, Einstein' — the volley stays on intelligence." },
      { t: "Ending it", d: "'I highly doubt that.' 'Me too.' Agreeing with the jab closes the exchange before anyone gets annoyed." },
    ],
    worked: "Alex is sure the longest river in the UK is the Thames, bets the next two rounds on it, and it's the Severn. 'Nice one, genius.' 'All right, Einstein, let's see how you do.' 'Stick with me and you might learn a thing or two.' 'I highly doubt that.' 'Me too.'",
    watch: "This is British friendship banter. In many workplaces and cultures — and in a first meeting with a client — the same lines read as rude. Listen to how a group teases each other before you join in. The lesson includes a sponsor segment and course plugs.",
    concepts: [],
    checks: [
      { q: "When does teasing cross into bullying, according to Lucy?", opts: ["When it's in public", "When you are purposely trying to hurt someone", "When it's about work", "When the other person doesn't laugh at once"], a: 1,
        expl: "Consider the other person's feelings; err on the side of caution." },
      { q: "After 'nice one, genius', which comeback stays on the same theme?", opts: ["'All right, Einstein'", "'Whatever'", "'Your round'", "'That's not fair'"], a: 0,
        expl: "Both lines are about intelligence." },
      { q: "How does the exchange end?", opts: ["With a harsher joke", "By changing the subject", "By agreeing with the jab — 'me too'", "By walking away"], a: 2,
        expl: "A self-deprecating agreement signals the teasing is done." },
    ],
  },
});

// =====================================================================
// Unit III, top-up (T-037, 2026-10-09) — A1 structure, two short Pixar in
// a Box lessons appended after spch100.2.7: Kristen Lester on structure as
// 'what they know, and when', and Pete Docter on putting your own feeling
// under the plot. Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.2.8": {
    module: "A1",
    mechanic: "Structure is the answer to 'what do you want the audience to know, and when?' — the same events in a different order produce a different feeling, as Finding Nemo learned when it moved the barracuda scene to the start.",
    rules: [
      "A joke has a structure — opening, build-up, ending — and getting any part wrong or out of order kills it.",
      "Without conflict there is no story: if every lady agrees to dance with the mushroom, the joke is over.",
      "Decide what the audience must know first in order to feel what you want them to feel later.",
      "Early cuts of Finding Nemo spread Marlin's backstory through the film as flashbacks, and audiences didn't like him until they learned, near the end, why he was so protective.",
      "Moving the loss to the opening changed none of the events and all of how people felt about Marlin.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Take a story you tell in which you behave in a way that could look bad — over-cautious, angry, stubborn. Write it in two orders: with the reason revealed at the end, and with the reason up front. Note which order makes a listener side with you." },
    check: "Both versions contain exactly the same events, and you can name the one fact whose position changes how the listener judges you.",
  },

  "spch100.2.9": {
    module: "A1",
    mechanic: "'Write what you know' means put something you have actually felt into whatever you are telling, because a story's power is making the audience feel what you felt — and it takes many retellings before it sparkles.",
    rules: [
      "'What happened?' is an invitation to tell a story; we answer it every day.",
      "Tell stories about monsters and car chases if you like, but put something from your own life into them: feeling scared, alone, out of your depth.",
      "Monsters, Inc. pitched as 'a monster who scares kids for a living' got smiles but bored audiences; it worked once Docter saw it was about a man becoming a father, which was what was happening to him.",
      "The aim is to get the audience to have the same feeling you had.",
      "Stories don't come out right the first time, or the thirtieth; keep retelling until they sparkle.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Pick a story you usually tell for laughs. Under it, write one sentence — 'This story is really about ___' — naming a feeling from your own life, such as being new, being out of your depth, or suddenly being responsible for someone." },
    check: "The sentence names a feeling, not an event, and you can find one detail in the story that doesn't serve that feeling and could go.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.2.8": {
    takeaway: "Pixar story artist Kristen Lester: structure is what you want the audience to know, and when. A mushroom joke told out of order dies, and Finding Nemo's audiences only warmed to Marlin once his loss moved from late flashbacks to the opening.",
    beats: [
      { t: "The mushroom joke", d: "Opening, build-up, punchline ('I'm a fungi'). Botch the opening or the middle, or let every lady say yes, and there's no joke." },
      { t: "What, and when", d: "Structure decides what the audience knows at each moment, and so what they feel." },
      { t: "Nemo's flashbacks", d: "Early versions wove Marlin and Coral's past through the film and revealed the barracuda attack near the end. Audiences didn't like Marlin." },
      { t: "The fix", d: "Almost all the flashbacks went; the attack moved to the beginning. Knowing his loss from the start, audiences saw his protectiveness as love and his journey as brave." },
    ],
    worked: "Same events, new order: once the audience sees Coral and all but one of the eggs taken in the opening minutes, 'I promise I will never let anything happen to you' explains every over-cautious thing Marlin does afterwards.",
    watch: "This is the short opening video of a longer Khan Academy lesson; the exercises are on Khan Academy's Pixar in a Box pages.",
    concepts: [],
    checks: [
      { q: "How does Lester define structure?", opts: ["The number of acts", "What you want the audience to know, and when", "The length of each scene", "The order you wrote it in"], a: 1,
        expl: "Get the order wrong and the effect changes, even with the same material." },
      { q: "Why didn't early audiences like Marlin?", opts: ["They didn't learn why he was so protective until near the end", "His voice was wrong", "The film was too long", "Nemo was the hero"], a: 0,
        expl: "The flashback structure hid his reason until it was too late." },
      { q: "What breaks the mushroom joke in her last failed attempt?", opts: ["A wrong punchline", "Telling it too fast", "No conflict — everyone says yes", "A missing opening"], a: 2,
        expl: "Without conflict, joke over." },
    ],
  },

  "spch100.2.9": {
    takeaway: "Pete Docter opens Pixar in a Box's storytelling season: stories connect on an emotional level, 'write what you know' means putting your own feelings into any plot, and stories only sparkle after many retellings.",
    beats: [
      { t: "'What happened?'", d: "When Val asks Pete what happened, she is asking for a story. People have told them for as long as they could speak." },
      { t: "Write what you know", d: "As a kid he wanted explosions and car chases, not suburban Minnesota. You can have both — put how you felt into the explosions." },
      { t: "Monsters, Inc.", d: "'A monster who scares kids for a living' got smiles in a pitch but left audiences restless. It was really about a man becoming a father — what was happening to Docter." },
      { t: "Retell it", d: "Not even the greats get it right first time; Pixar's stories improve over retelling after retelling, up to the thirtieth and beyond." },
    ],
    worked: "Monsters, Inc.: the clock-in, eat-donuts, talk-about-union-dues joke was funny for a minute. The film found its spine when Docter recognised his own life in it — someone suddenly responsible for a small child.",
    watch: "Under three minutes of introduction; the rest of the season is on Khan Academy. Its value here is one move: name the feeling under your plot.",
    concepts: [],
    checks: [
      { q: "What does 'write what you know' mean in Docter's telling?", opts: ["Only write about your home town", "Put something you have felt into whatever you write", "Avoid fantasy", "Research every detail"], a: 1,
        expl: "Something from your own life makes the story come alive." },
      { q: "What did Docter realise Monsters, Inc. was really about?", opts: ["A man becoming a father", "Union politics", "Fear of the dark", "A friendship between monsters"], a: 0,
        expl: "That was what was happening to him at the time." },
      { q: "What does he say about getting a story right?", opts: ["Geniuses get it right first time", "Two drafts are enough", "It takes many retellings before it sparkles", "Test it only once"], a: 2,
        expl: "Up to the thirtieth time, and on." },
    ],
  },
});

// =====================================================================
// Unit VI, top-up (T-037, 2026-10-09) — A8 non-native speaker, three
// short lessons appended after spch100.5.11: word stress and intonation
// (Rachel's English), and the slips Arabic speakers most often make in
// English. Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.5.12": {
    module: "A8",
    mechanic: "Inside an English word one syllable is stressed — higher in pitch and longer — and in a sentence the important words are stressed while the small ones shrink; the listener's ear finds meaning by those stresses, so a word stressed on the wrong syllable can be hard to recognise.",
    rules: [
      "A stressed syllable is usually higher in pitch and longer: a-BOUT, not A-bout.",
      "Long words can have a primary and a secondary stress: em-BAR-rass-ment has its main stress on the second syllable, a lighter one on the first, and the last two unstressed.",
      "In a sentence the content words carry the stress: 'I SAW her at the MEET-ing.'",
      "Unstressed words reduce — in 'I got it for you', 'for' is a short, low 'fr'.",
      "Learn each new word's stress together with the word; dictionaries mark it, and free pitch-tracking software can show it.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Pick ten words of three or more syllables that you use at work. Look up each one's stressed syllable, write the word with that syllable in capitals, and record yourself saying each word alone and then in a short sentence." },
    check: "On playback the capitalised syllable is audibly the highest and longest in every word, and each matches the dictionary.",
  },

  "spch100.5.13": {
    module: "A8",
    mechanic: "Intonation is the pitch pattern across a phrase: American statements start higher and end lowest, questions often rise, and the same words with a different melody carry a different attitude — so English spoken with another language's melody sounds foreign even when every sound is right.",
    rules: [
      "Stressed syllables are higher, longer and often louder; content words take the stress and function words don't.",
      "Statements tend to start higher and reach their lowest pitch at the end; questions often rise at the end.",
      "The melody carries attitude: a rising 'Are you serious?' sounds concerned and open; a falling one sounds like a judgement.",
      "Correct sounds spoken with another language's melody still sound foreign.",
      "Train the ear by looping a native phrase several times before you try to repeat it.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Record 'Are you serious?' twice — once rising, as concern, once falling, as judgement. Then record three statements about your own work and check that each ends at its lowest pitch." },
    check: "A friend can tell which 'Are you serious?' was the concerned one without being told, and none of your three statements rises at the end.",
  },

  "spch100.5.14": {
    module: "A8",
    mechanic: "Your first language predicts your most likely slips in English; for Arabic speakers the common ones are p and b (Arabic has no p), a strongly rolled r, spelling that isn't phonetic, and dropping 'a/an' or putting the adjective after the noun — so check those first.",
    rules: [
      "P and B: Arabic has only B. Put a hand on your throat — B vibrates, P doesn't: paper, people, pen.",
      "The R: a rolled r is still understood, but soften it — the tongue rises toward the roof of the mouth without touching it.",
      "English spelling isn't phonetic: 'though' and 'through' share letters but not sounds, and an initial 'kn' drops the k (know, knife). Learn the sound with each new word.",
      "Arabic has no indefinite article: 'I teacher' has to become 'I'm a teacher', and 'I have pen' becomes 'I have a pen'.",
      "In English the adjective goes before the noun and doesn't change for gender: 'a red pen', not 'pen red'.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Record yourself reading this aloud, then listen back: 'I'm a project manager. People pay me to plan big projects, and I have a pretty busy week — a planning meeting, a new proposal, and a presentation on Thursday.'" },
    check: "Every p in people, pay, plan, projects, pretty, planning, proposal and presentation is voiceless — a puff of air, no buzz — and every 'a' before a noun is there.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.5.12": {
    takeaway: "Rachel's English introduces stress: in American English certain syllables in a word, and certain words in a sentence, are higher in pitch and longer. That contrast is what lets the ear pick out meaning — and much of what makes an accent.",
    beats: [
      { t: "About", d: "Two syllables, the second stressed: higher in pitch and longer." },
      { t: "Primary and secondary", d: "Embarrassment: primary stress on the second syllable, a secondary on the first, the last two unstressed." },
      { t: "In a sentence", d: "In 'I saw her at the meeting', 'saw' and the first half of 'meeting' stand out." },
      { t: "Seeing it", d: "Pitch-tracking software shows each stressed syllable as a scoop up in the voice." },
      { t: "Reduction", d: "'I got it for you' — 'for' becomes a short, low 'fr'. Stress and reduction together make up much of an accent." },
    ],
    worked: "Embarrassment: em (secondary) – BAR (primary) – rass – ment. Say it once with every syllable equal and once with this pattern; the second is the one a listener recognises at once.",
    watch: "The model is American English. Stress as pitch plus length holds for British English too, but some words differ, so check a dictionary for the variety you want.",
    concepts: [],
    checks: [
      { q: "What makes a syllable stressed, in Rachel's explanation?", opts: ["It is louder, nothing else", "It is usually higher in pitch and longer", "It is spoken faster", "It comes first in the word"], a: 1,
        expl: "Pitch and length are what the ear picks up." },
      { q: "In 'embarrassment', where is the primary stress?", opts: ["On the second syllable", "On the first syllable", "On the last syllable", "Spread evenly"], a: 0,
        expl: "The first syllable has a secondary stress." },
      { q: "What happens to 'for' in 'I got it for you'?", opts: ["It is stressed", "It disappears completely", "It is reduced to a short, low 'fr'", "It is lengthened"], a: 2,
        expl: "Unstressed words reduce." },
    ],
  },

  "spch100.5.13": {
    takeaway: "Rachel's English defines intonation as the pitch pattern across a phrase. American statements fall to their lowest point at the end, questions rise, and the melody alone can turn the same words into concern or judgement.",
    beats: [
      { t: "From stress to melody", d: "Stressed syllables are higher; content words are stressed and function words not. Strung together, those pitches make a pattern." },
      { t: "Statements fall", d: "'Today it's sunny.' 'I wish I'd been there.' Even long sentences with ups and downs reach their lowest point at the end." },
      { t: "Questions rise", d: "'Me?' goes up; 'me.' goes down." },
      { t: "Attitude", d: "'I'm dropping out of school.' 'Are you serious?' — rising sounds open and concerned; falling sounds like disapproval." },
      { t: "Sounding foreign", d: "The right sounds in another language's melody still sound foreign. Loop native speech until the melody is in your ear." },
    ],
    worked: "'I'm dropping out of school.' Reply A, rising: 'Are you serious?' — what happened, are you okay? Reply B, falling: 'Are you serious.' — that's a bad idea. The same three words set up opposite conversations.",
    watch: "Unit V's coaches disagree about how a sentence should end on stage; this lesson describes everyday American statements. In a talk, a falling ending still signals that you mean it.",
    concepts: [],
    checks: [
      { q: "How do American English statements usually move in pitch?", opts: ["They start higher and end lowest", "They rise at the end", "They stay flat", "They start low and rise"], a: 0,
        expl: "The lowest point is at the end." },
      { q: "After 'I'm dropping out of school', what does a falling 'Are you serious?' convey?", opts: ["Concern", "Confusion about the words", "A judgement — disapproval", "Excitement"], a: 2,
        expl: "Rising would sound open and concerned." },
      { q: "Why can correct sounds still sound foreign?", opts: ["The vocabulary is wrong", "They are spoken with another language's melody", "They are too slow", "The grammar is wrong"], a: 1,
        expl: "Intonation characterises a language as much as its sounds." },
    ],
  },

  "spch100.5.14": {
    takeaway: "A short lesson from an English teacher who also speaks Arabic, on the slips Arabic speakers most often make in English: p and b, a strongly rolled r, non-phonetic spelling and silent letters, capital letters, the missing 'a/an', and adjective order.",
    beats: [
      { t: "P and B", d: "Arabic has a B but no P, so 'people' can come out as 'bibble'. B vibrates in the throat; P is only air." },
      { t: "The R", d: "A rolled r is still understood; soften it so the tongue lifts toward the roof of the mouth without touching." },
      { t: "Spelling and sound", d: "Arabic is read as it is written; English is not. 'Though' and 'through'; an initial 'kn' drops the k." },
      { t: "Capital letters", d: "Arabic has none. English capitalises sentence starts, names, cities, countries and nationalities." },
      { t: "The missing 'a'", d: "'I teacher' and 'I have pen' carry Arabic patterns straight across; English needs 'I'm a teacher' and 'I have a pen'." },
      { t: "Adjective order", d: "English puts the adjective first and doesn't change it for gender: 'I have a red pen'." },
    ],
    worked: "'I have pen red' carries two Arabic patterns at once — no indefinite article, and the adjective after the noun. Fixed: 'I have a red pen.'",
    watch: "Two of the six points (spelling and capitals) are about writing. The speaking ones — p and b, and the dropped 'a' — are what a listener notices in a pitch.",
    concepts: [],
    checks: [
      { q: "Why do many Arabic speakers mix up p and b?", opts: ["Arabic has a B but no P", "The letters look alike", "English spelling is confusing", "They are the same sound"], a: 0,
        expl: "The p sound simply doesn't exist in Arabic." },
      { q: "How can you feel the difference between B and P?", opts: ["B is longer", "Hand on the throat — B vibrates, P doesn't", "P is louder", "B uses the tongue"], a: 1,
        expl: "B is voiced; P is voiceless." },
      { q: "Which sentence correctly fixes 'I have pen red'?", opts: ["I have red pen", "I have the pen red", "I have a red pen", "I have pen a red"], a: 2,
        expl: "Indefinite article, then the adjective before the noun." },
    ],
  },
});

// =====================================================================
// Unit IX, top-up (T-037, 2026-10-09) — A4 conversation, two lessons
// appended after spch100.8.10: trial lawyer Jefferson Fisher at Talks at
// Google, and a long interview with Charles Duhigg that goes past the
// short lesson already installed (spch100.8.6) into looping, identities and
// hard conversations. Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.8.11": {
    module: "A4",
    mechanic: "In a hard conversation, aim to learn rather than to prove: check what was heard instead of insisting on what you said, ask how they came to their view, speak in perspectives, swap 'does that make sense?' for a real question, use silence on purpose, and say less.",
    rules: [
      "The biggest problem is assuming that what you said is what they heard. Instead of 'that's not what I said', ask 'what did you hear?'",
      "Go in with something to learn, not something to prove. Facts rarely move a deeply held belief; open questions can — 'how long have you felt that way? what led to that?'",
      "Perfection isn't relatable; struggle is. Swap 'I don't agree' for 'I see it differently' or 'I have a different take'.",
      "Drop 'does that make sense?' — it suggests they're slow or you're unsure, and nobody answers no. Ask 'what's your take?' instead.",
      "Use silence: a short pause shows you're thinking, and five to seven seconds after something rude lets it echo. Be a well, not a waterfall — about three sentences, then let them ask.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Recall a recent disagreement and write down the line you actually said. Rewrite it three ways: as a 'what did you hear?' check, as a perspective statement ('I see it differently because…'), and as a three-sentence answer with no 'does that make sense?' at the end." },
    check: "None of the rewrites contains 'you're wrong', 'that's not what I said' or 'does that make sense?', and the short answer really is three sentences.",
  },

  "spch100.8.12": {
    module: "A4",
    mechanic: "Every discussion holds practical, emotional and social conversations, and you connect only when you are in the same one: find out which it is ('helped, heard or hugged?'), ask deep questions, prove you listened by looping for understanding, and in hard conversations control things together rather than each other.",
    rules: [
      "Match the conversation — practical (what is this really about?), emotional (how do we feel?), social (who are we?). If you're in different ones you can't hear each other; ask whether they want to be helped, heard or hugged.",
      "Ask deep questions, about beliefs, values and experiences rather than facts: 'what made you go into law?', not 'what kind of law?'",
      "Loop for understanding: ask, repeat the answer back in your own words, then ask whether you got it right. The third step is the one people forget.",
      "Notice emotions and acknowledge them, and share something real back — authenticity is reciprocal, and people are quick to detect a fake.",
      "In a hard conversation, name the awkwardness up front, ask what each of you wants from it, and control things together — the time, the boundaries of the argument — not each other.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "In your next real conversation, do one full loop: ask a deep question, repeat the answer back in your own words, and ask 'did I get that right?'. Afterwards write down the question, your paraphrase and their reply to the check." },
    check: "All three steps happened, and their reply either confirmed your paraphrase or corrected something that you then repeated back again.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.8.11": {
    takeaway: "Trial lawyer Jefferson Fisher at Talks at Google: assume what you said isn't what they heard, go in to learn rather than to prove, share struggle, speak in perspectives, replace 'does that make sense?' with a real question, use silence on purpose, and keep your answers short.",
    beats: [
      { t: "What did you hear?", d: "We judge our own words badly because we also interpret them for the listener. Ask what they heard instead of insisting on what you said." },
      { t: "Learn, not prove", d: "Telling someone they're wrong can mean telling them their grandparents were wrong; walls go up and facts bounce off. Ask how long they've felt that way and what led to it." },
      { t: "Struggle is relatable", d: "A newly promoted woman who didn't feel qualified could say: 'I know I have a way to go — and what excites me about that is…'" },
      { t: "Perspective words", d: "'I see things differently' and 'I have a different take' keep a conversation open where 'I don't agree' closes it." },
      { t: "'Does that make sense?'", d: "It implies the listener is slow or that you're unsure, and nobody says no. Ask for their thoughts or questions instead." },
      { t: "Silence", d: "A considered pause signals thinking; five to seven seconds after a rude remark lets it echo. 'I'm not ignoring you, I'm thinking' says it plainly." },
      { t: "A well, not a waterfall", d: "His company keeps emails to three sentences or fewer. On video calls especially, answer briefly and trust people to ask." },
    ],
    worked: "Someone says something belittling in a meeting. Instead of firing back, he lets five seconds of silence pass. Their words now sit out in the open; often they take them back or apologise, and if they double down you've lost nothing — 'silence can never be misquoted'.",
    watch: "The first few minutes are host chat and the book's framing; the tools come thick from about the nine-minute mark. Using AI as a 'thought partner' is his personal habit, not part of the method.",
    concepts: [],
    checks: [
      { q: "What does Fisher suggest asking instead of saying 'that's not what I said'?", opts: ["'Let me repeat myself'", "'What did you hear?'", "'You misunderstood me'", "'Calm down'"], a: 1,
        expl: "It gives you their perspective instead of a fight about the record." },
      { q: "Why does he want people to drop 'does that make sense?'", opts: ["It suggests the listener is slow or you're unsure, and nobody answers no", "It is too informal", "It takes too long", "It is a leading question about facts"], a: 0,
        expl: "Ask a real question that invites them to respond." },
      { q: "What does 'be a well, not a waterfall' mean?", opts: ["Speak more slowly", "Ask more questions", "Give a short answer and let people ask for more", "Repeat your point"], a: 2,
        expl: "Limit it to about three sentences; they have the agency to ask." },
    ],
  },

  "spch100.8.12": {
    takeaway: "Charles Duhigg, author of Supercommunicators, in a long interview: anyone can learn it. Find out which of three conversations you're in and match it, ask deep questions, loop for understanding, share something real back, see people's many identities, and in hard conversations look for what you can control together.",
    beats: [
      { t: "Three conversations", d: "He came home venting about work (emotional) while his wife offered solutions (practical), and neither could hear the other. Now she asks: solve it together, or just vent?" },
      { t: "Deep questions", d: "Supercommunicators ask ten to twenty times as many questions as average, about half of them deep — beliefs, values, experiences. Ask how someone feels about their life, not its facts." },
      { t: "Looping for understanding", d: "Ask, repeat back in your own words, ask if you got it right. It proves you listened, and people become more willing to listen in return." },
      { t: "The spy who listened", d: "CIA officer Jim Lawler spent months failing to recruit a source; when he finally admitted his own disappointment in himself, matching hers, she agreed — and was a prized asset for twenty years." },
      { t: "Who are we?", d: "Reducing someone to one identity stereotypes them. Name their others — parent, neighbour, lawyer — and find the tribe you share." },
      { t: "Hard conversations", d: "Don't try to control the other person. Control things together — the time, the place, the boundaries of the argument — say up front it may be awkward, and ask what each of you wants." },
    ],
    worked: "A performance review that opens: 'This might be a tough conversation, and I really want to help you. What are you hoping to get out of it?' 'A raise.' Now both people know what the conversation is about, even if the answer is 'not yet — here's the path to one'.",
    watch: "The three conversations are also in this unit's short Duhigg lesson (spch100.8.6); this interview adds looping, identities and hard conversations. Figures like 'ten to twenty times as many questions' are his summaries of studies, with no papers shown.",
    concepts: [],
    checks: [
      { q: "What are the three steps of looping for understanding?", opts: ["Ask, agree, advise", "Ask a question, repeat the answer back in your own words, ask if you got it right", "Listen, nod, summarise at the end", "Question, challenge, conclude"], a: 1,
        expl: "The third step gives them the chance to say you heard them — or to correct you." },
      { q: "Duhigg comes home venting and his wife offers solutions. What went wrong?", opts: ["He was in an emotional conversation and she in a practical one", "She wasn't listening", "They were both too tired", "He had asked for advice"], a: 0,
        expl: "Different conversations, different parts of the brain." },
      { q: "In a hard conversation, what does he say you should try to control?", opts: ["The other person's emotions", "The other person's conclusion", "Things you can control together, like the time and the boundaries", "Nothing — let it run"], a: 2,
        expl: "Trying to control each other backfires; controlling things together builds cooperation." },
    ],
  },
});

// =====================================================================
// Unit VII, second top-up (T-037, 2026-10-09) — A5, four lessons on
// humour for talks, appended after spch100.6.14: Judy Carter on building
// material from the audience's bad days, the 'laugh generator' and joke
// troubleshooting from A Funnier You, and Alex Lyon's case against opening
// with your own joke (which disagrees with Simon Lancaster in Unit X — the
// summary says so). Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.6.15": {
    module: "A5",
    mechanic: "Humour for a business audience is built from their life, not yours: call a few of them before the talk, ask what a bad day looks like, and turn their insider pain — acronyms, rituals, frustrations — into lists and lines; tell the truth about yourself, mock yourself lightly, and turn problems into punchlines.",
    rules: [
      "Before a corporate talk, call people in the audience and ask 'What's a bad day?' Their insider details become material that lands because it is about them.",
      "Don't lecture ('you've got to follow your dream'); make the talk about them.",
      "Comedy is the truth. The dullest officer in the navy got his first laugh by saying 'I know I'm boring' — light self-mockery reads as confidence.",
      "Simple formulas help: the list of three, with the big obvious item last ('we stopped kissing, stopped eating together, he moved in with his new wife').",
      "Turn problems into punchlines — the boss from hell is a heckler — and let a poignant story land without a laugh; it moves people in a different way.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Pick an audience you might speak to — a client's team, your trade. Write five answers they would give to 'What's a bad day?', from what you already know of their work. Turn two of them into a list of three in which the third item is the big, obvious one." },
    check: "Each list is about their world rather than yours, and someone from that audience would recognise every item as true.",
  },

  "spch100.6.16": {
    module: "A5",
    mechanic: "To find the laughs you have been talking past, record the talk or story as you would actually say it, get a verbatim transcript, go through it line by line for clear assumptions and double meanings, twist them, then say it again, record, and repeat.",
    rules: [
      "Get your facts, then distort them: nearly every statement carries an assumption you can twist.",
      "Record the thing — intro, bio, story, signature talk — ideally in front of an audience. Don't write it first; we don't speak the way we write.",
      "Get a verbatim transcript: it shows the ums, and where the laughs actually happened.",
      "Go line by line for double meanings and clear assumptions ('end up on the rocks'), and twist each one — often by finding the upside of a downside.",
      "It is iterative: change, record, test, repeat. That is how stand-ups get good, too.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Record a two-minute story you often tell and transcribe it (your phone can). Mark every line that carries a clear assumption or a double meaning, then write one twist for the two best lines." },
    check: "Each twist keeps the original line and adds a surprise that depends on its assumption, and you can say both versions aloud without reading.",
  },

  "spch100.6.17": {
    module: "A5",
    mechanic: "When a joke gets nothing, go to the recording and check the information: if the setup was unclear or used a reference they don't share, they are still catching up at the punchline; if they have heard it before or are too close to the subject, it can't surprise them — aim for the middle.",
    rules: [
      "Record every time you speak, so you can see what happened rather than what you remember.",
      "Use references your audience knows; otherwise they can't put the pieces together.",
      "A confusing lead-in leaves people behind at the punchline. The setup has to create one clear expectation and picture.",
      "People who know too much won't laugh either: a cliché they have heard, or a target they are too close to or don't accept.",
      "Aim for the middle — not too little information, not too much.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "Take one line that got less of a laugh than you hoped. Write which side failed — too little (unclear setup, unfamiliar reference) or too much (cliché, too close to home) — and rewrite the setup to fix it." },
    check: "The new setup creates a single clear expectation, and any reference in it is one this audience would know.",
  },

  "spch100.6.18": {
    module: "A5",
    mechanic: "A stand-up-style setup-and-punchline joke as your opener is high risk and low reward, so get lightness with less exposure: quote someone funny, tell a light story in which someone pursues a goal and hits obstacles, or show something visual you already know is funny.",
    rules: [
      "The common failure: the opening joke gets silence, the speaker chuckles nervously to cue a laugh, and the first moment of the talk is crickets.",
      "Quote a comedian by name: the line is tested, the audience hears the comedian's voice, and if it flops it is on them, not on you.",
      "A light story gets its smile from a goal and the obstacles in its way — the road-trip principle of Dumb and Dumber.",
      "Show a funny picture or slide you have already seen make people laugh; you don't have to deliver it.",
      "Lighthearted humour, yes; your own one-liner as the very first line, no.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write three alternative openings for your next talk: one built on a quote from a named comedian or humorist, one ten-second story with a goal and an obstacle, and one funny image you would show with a single line of setup." },
    check: "None of the three depends on you delivering a punchline cold, and the story has a clear goal and at least one obstacle.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.6.15": {
    takeaway: "Judy Carter, comic turned 'motivational humorist' and author of The Comedy Bible, interviewed on making business audiences laugh: research their bad days, make the talk about them, tell the truth about yourself, use simple formulas like the list of three, and let a poignant story do what a joke can't.",
    beats: [
      { t: "Make it about them", d: "For a thousand surgical technologists she called people beforehand and asked what a bad day was. 'Were there signs in childhood? Hey Tommy, get off that slide, I haven't sterilised it yet.'" },
      { t: "Insider material", d: "Corporate people speak in acronyms; a 'top ten ways you know you're stressed' list in their language lands because it is theirs." },
      { t: "Start before the start", d: "Warned that a rock crowd would hate her, she played the accordion badly to the queue outside; when she walked on carrying it, she already had them." },
      { t: "Comedy is the truth", d: "Radio challenged her to make 'the least funny man in America' funny — a naval captain who bored his cadets. His first laugh: 'I know I'm boring.'" },
      { t: "Formulas", d: "The list of three with the obvious item last. You don't need great talent to be funny for five minutes in a meeting — a few formulas will do." },
      { t: "Mess into message", d: "Stories about growing up with her disabled sister didn't get laughs but moved the room, and people queued to share their own lives. You can't spell 'message' without 'mess'." },
    ],
    worked: "Starting a comedy tour on 12 September 2001, she opened with a moment of silence, then said the attackers could take buildings and lives but she'd be damned if they took her sense of humour. The room applauded, and the show could begin.",
    watch: "This is a long, friendly interview with plenty of career story; the techniques sit in the middle. The lines quoted are hers, written for her rooms — borrow the method, not the jokes.",
    concepts: [],
    checks: [
      { q: "What does Carter ask audience members before a corporate talk?", opts: ["What they want to learn", "What a bad day looks like for them", "What their favourite joke is", "Who their boss is"], a: 1,
        expl: "Their insider details make the humour about them." },
      { q: "How did 'the least funny man in America' get his first laugh?", opts: ["By admitting 'I know I'm boring'", "With a comedian's one-liner", "With a story about his dog", "By showing a cartoon"], a: 0,
        expl: "Comedy is the truth — and light self-mockery signals confidence." },
      { q: "In her list of three, where does the big, obvious item go?", opts: ["First", "In the middle", "Last", "It is left out"], a: 2,
        expl: "Two subtle clues, then the glaring one." },
    ],
  },

  "spch100.6.16": {
    takeaway: "'A Funnier You' on the laugh generator: record your talk or story as you actually say it, get a verbatim transcript, comb it line by line for assumptions and double meanings, twist them, and iterate — the way stand-ups refine a set.",
    beats: [
      { t: "Distort the facts", d: "Twain's line: get your facts, then distort them. Surprise comes from twisting the expectation a statement carries." },
      { t: "Naturally funny isn't enough", d: "Being funny with friends didn't survive a stand-up stage, and stand-up didn't survive a humorous-speech contest; he needed a process." },
      { t: "Record, don't write", d: "Speech and writing differ, and a script is not a transcript. Tell it to the cat if you must, but record it." },
      { t: "Verbatim transcript", d: "It shows filler words and, with an audience, where laughs landed — expected and unexpected." },
      { t: "Twist", d: "Look for double meanings and clear assumptions, then twist them; the upside of a downside is a reliable turn." },
    ],
    worked: "A client sailing alone down the coast to Mexico: 'I didn't want my boat to end up on the rocks — so I did what any captain would do. I went to the liquor cabinet.' Another, pulled aside by airport security while her husband and children went on: 'He's freaking out. All I could think was: finally, some alone time.'",
    watch: "He sells 'laughter audits' and names a paid transcription service; any free phone transcription will do. Not every line needs a joke — mark the candidates and keep the best two.",
    concepts: [],
    checks: [
      { q: "Why does he insist on recording before writing?", opts: ["Recordings are easier to share", "We don't speak the way we write, so the transcript shows what you really say", "Audiences prefer recordings", "It is faster"], a: 1,
        expl: "A script isn't a transcript." },
      { q: "What does a verbatim transcript of a live run show you?", opts: ["Your fillers and where the laughs actually happened", "Your slide timings", "The audience's names", "Only grammar mistakes"], a: 0,
        expl: "Expected laughs that didn't come, and unexpected ones you can build on." },
      { q: "In the airport-security example, what kind of twist makes the laugh?", opts: ["A pun", "An exaggeration", "Finding the upside of an obviously bad event", "A callback"], a: 2,
        expl: "The assumption is that being pulled aside is bad; the twist is that it's a break." },
    ],
  },

  "spch100.6.17": {
    takeaway: "A three-minute troubleshooting guide from 'A Funnier You': when a joke dies, check the recording for an information problem — too little (a confusing setup, an unknown reference) or too much (a cliché, or a subject the audience is too close to).",
    beats: [
      { t: "Go to the recording", d: "Record even on the phone in your pocket; you need to see what was actually said." },
      { t: "References they know", d: "If the audience doesn't share the reference, they can't put the pieces together." },
      { t: "Confused setups", d: "Words before the punchline that confuse leave people behind; the punchline lands on minds still catching up." },
      { t: "Too much information", d: "'Why did the chicken cross the road?' gets nothing because everyone knows it. Some people are too close to the subject, or reject the target." },
      { t: "The middle", d: "Aim for the big middle of the bell curve: not too much, not too little." },
    ],
    worked: "A joke that relies on an industry acronym kills at a trade conference and dies at a family dinner: same words, different information. The fix is in the setup — name the thing plainly for outsiders, or save the line for insiders.",
    watch: "Short and general: use it as the checklist after the laugh generator, not as a technique of its own.",
    concepts: [],
    checks: [
      { q: "What is the first step when a joke doesn't get a laugh?", opts: ["Drop it at once", "Go to the recording", "Tell it louder next time", "Ask the audience"], a: 1,
        expl: "See what you actually said and how it landed." },
      { q: "Why does 'why did the chicken cross the road?' get no laugh?", opts: ["Everyone has heard it, so nothing surprises", "It is too long", "It is offensive", "It needs a picture"], a: 0,
        expl: "Too much information kills the surprise." },
      { q: "What does aiming for the middle mean here?", opts: ["Three jokes per speech", "Jokes in the middle of the talk only", "Not too little information and not too much", "Telling jokes slowly"], a: 2,
        expl: "Clear enough to follow, fresh enough to surprise." },
    ],
  },

  "spch100.6.18": {
    takeaway: "Communication coach Alex Lyon pushes back on 'open with a joke': a cold setup-and-punchline joke is high risk and low reward. He offers three low-risk ways to start light — quote someone funny, tell a goal-and-obstacles story, or show a funny visual.",
    beats: [
      { t: "The failure mode", d: "Nobody laughs, the speaker chuckles nervously, the audience chuckles nervously, and the first moment of the talk is gone." },
      { t: "Quote the funny", d: "'As Jerry Seinfeld said, my parents didn't want to move to Florida, but they're 65 and that's the law.' Tested material, with attention on the line, not on you." },
      { t: "Goal and obstacles", d: "A story turns lighthearted when someone is trying to get somewhere and everything goes wrong — the Dumb and Dumber road trip." },
      { t: "Show it", d: "A picture or slide you already know is funny gets a smile with no punchline to deliver." },
    ],
    worked: "Instead of 'So a consultant walks into a bar…', open with: 'Jerry Seinfeld said his parents didn't want to move to Florida, but they're 65 and that's the law. Our industry has laws like that too.' The laugh is pre-tested, and you've bridged to your topic.",
    watch: "Simon Lancaster (Unit X) treats a joke as one good way to open, for pleasure; Lyon says not your own one-liner. They agree on the goal — a feeling in the first seconds — and differ on how much risk to take for it.",
    concepts: [],
    checks: [
      { q: "Why does Lyon advise against opening with your own setup-punchline joke?", opts: ["Jokes are unprofessional", "It is high risk and low reward — silence in the first moment is hard to recover from", "Audiences dislike humour", "It takes too long"], a: 1,
        expl: "He is in favour of humour, just not that kind as the opener." },
      { q: "What makes quoting a comedian lower-risk?", opts: ["It is tested material, and if it flops it is on them, not you", "Nobody knows the comedian", "It is shorter", "It avoids eye contact"], a: 0,
        expl: "You and the audience look at the line together." },
      { q: "What makes a story lighthearted, in his account?", opts: ["A twist ending", "A famous character", "A goal and the obstacles in its way", "A moral"], a: 2,
        expl: "Everything that can go wrong on the way to the goal." },
    ],
  },
});

// =====================================================================
// Unit VIII, second top-up (T-037, 2026-10-09) — A6, the taxonomy's
// 'self-deprecation that doesn't cost status', two lessons appended after
// spch100.7.12: Ric Keller's TEDx talk on why it works, and Jill Griffin on
// where it stops. Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.7.13": {
    module: "A6",
    mechanic: "Joking about your own flaws signals confidence — 'I know I'm flawed, and I still believe in myself' — and it relaxes people, defuses criticism and narrows the status gap; whoever raises a weakness first owns how it lands.",
    rules: [
      "Self-deprecation takes confidence: it says you know your flaws and believe in yourself anyway. That relaxes people, deflects criticism and builds rapport.",
      "Raise the weakness yourself. People who saw a politician joke about his own weight rated him better than people who saw a talk-show host make the same jokes about him — same topic, different owner.",
      "In a study of an executive introducing a new hire, a joke at his own expense beat no humour, and a joke at the new hire's expense did worst; self-deprecation narrows the gap between boss and team.",
      "Turn an attack into a line: called an amateur, he agreed, then said amateurs built the Ark and professionals built the Titanic.",
      "Be real rather than polished — 'don't fake it till you make it; be real to seal the deal'.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Write down the criticism a client is most likely to make of you — too young, too new, too small, an accent. Write two lines that raise it yourself with a light, true joke, each followed by one sentence that pivots to a real strength." },
    check: "Each line names the weakness plainly, the joke is at your expense and nobody else's, and the pivot names a strength you can back up.",
  },

  "spch100.7.14": {
    module: "A6",
    mechanic: "Self-deprecation builds trust only when it targets something peripheral; a joke about the core skill people rely on you for — a surgeon's 'wobbly hand', a new manager's 'I'm no leader' — unsettles them and costs trust.",
    rules: [
      "Done well, self-deprecating humour makes you relatable and trustworthy; context decides whether it lands.",
      "Never aim it at your core competence or the job you were hired for: a surgeon with a wobbly hand, a developer who can't code, a coach who can't listen.",
      "A newly promoted manager who joked about lacking leadership skills got a gasp and eye-rolls, and left his team feeling rudderless.",
      "Warning signs: the jokes fall flat and you replay them; you use them because celebrating wins feels like bragging; you start believing the punchline.",
      "Give equal time to stating your strengths. Self-deprecation used to please people is inauthentic.",
    ],
    drill: { minutes: 6, artifact: "written",
      do: "List three things you could joke about yourself. Mark each as core (what clients pay you for) or peripheral (habits, tastes, history). Rewrite any core one as a peripheral one, or drop it." },
    check: "Every joke left on the list is about something a client doesn't rely on you for, and you can name the one skill you will not joke about.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.7.13": {
    takeaway: "Former congressman Ric Keller on the power of self-deprecating humour: it shows confidence, relaxes people, deflects criticism and narrows status gaps, and studies of politicians and executives back it up. Whoever raises a weakness first controls how it lands.",
    beats: [
      { t: "The seventh husband", d: "Last of sixteen candidates pitching to a group of CEOs after hours of waiting, he opened by saying he felt like Elizabeth Taylor's seventh husband on his wedding night: he knew what to do, but not how to make it interesting. They ranked him first." },
      { t: "Fired from Wendy's", d: "'You think you can serve our country? You can't even serve french fries.' He tells it on himself." },
      { t: "The Christie study", d: "Viewers who saw Chris Christie eat a doughnut on Letterman rated him better than those who saw Letterman's fat jokes about him. Same topic; who raised it made the difference." },
      { t: "The executive study", d: "'I'm so glad Pat took this job despite knowing everything about me' beat no humour; the same joke aimed at Pat did worst." },
      { t: "Turning attacks", d: "'Amateurs built the Ark; professionals built the Titanic.' Lincoln: 'If I had two faces, would I be wearing this one?' Reagan refused to exploit his opponent's 'youth and inexperience'." },
    ],
    worked: "Attacked for having no experience against a mayor and a state legislator, he agreed — 'I am an amateur' — then turned it: 'It was amateurs who built Noah's Ark and professionals who built the Titanic.' The issue stopped coming up.",
    watch: "Not every example is self-deprecation: Reagan's and Lincoln's lines turn the attack back on the opponent. The next lesson draws the boundary — never joke about the core skill you are trusted for.",
    concepts: [],
    checks: [
      { q: "What did the Christie study show?", opts: ["Weight jokes always backfire", "Jokes about a weakness worked in his favour when he raised them himself", "Politicians should avoid humour", "Talk-show audiences prefer comedians"], a: 1,
        expl: "Same topic, same show; only the owner of the joke changed." },
      { q: "In the executive study, which introduction did worst?", opts: ["Humour aimed at the new employee", "Self-deprecating humour", "No humour at all", "A formal speech"], a: 0,
        expl: "Negative humour about others ranked below no humour." },
      { q: "What does Keller say self-deprecation signals?", opts: ["Low self-esteem", "Desperation", "Confidence — you know your flaws and still believe in yourself", "Indifference"], a: 2,
        expl: "It takes self-confidence to use it." },
    ],
  },

  "spch100.7.14": {
    takeaway: "Career coach Jill Griffin on when self-deprecating humour helps and when it hurts: it builds trust and relatability, but aimed at the core skill you are trusted for, it spends that trust — as a newly promoted manager found in a stand-up meeting.",
    beats: [
      { t: "Why it works", d: "It shows self-awareness and humility, puts people at ease, and keeps successful people relatable." },
      { t: "Tyson's stand-up", d: "Promoted from within, he joked about his own leadership skills. Someone gasped, people sighed and rolled their eyes, and he stumbled to the end of the meeting." },
      { t: "The core-skill rule", d: "Would you book a surgeon who joked about a wobbly hand, or a developer who joked he couldn't code? Don't joke about what you were hired to do." },
      { t: "Warning signs", d: "Flat jokes you replay all day, using it because wins feel like bragging, joking about yourself when alone, and starting to believe the punchline." },
      { t: "Strengths, too", d: "When did you last give equal time to saying what you're good at? Self-deprecation used to please people is inauthentic." },
    ],
    worked: "A new team lead wants to stay 'one of the crew'. Instead of 'Don't worry, I've no idea how to run a team either', he jokes about something peripheral — 'I promise these stand-ups will be shorter than my commute' — and keeps his competence off the table.",
    watch: "About half the episode is coaching on thoughts and confidence, plus plugs; the humour rule sits roughly between minutes twelve and seventeen. It complements Keller rather than contradicting him.",
    concepts: [],
    checks: [
      { q: "What is Griffin's main rule for self-deprecating humour at work?", opts: ["Never use it", "Don't aim it at your core skill or the job you were hired to do", "Use it only with senior people", "Use it in every meeting"], a: 1,
        expl: "Peripheral flaws build trust; core ones undermine it." },
      { q: "What happened when Tyson joked about his leadership skills?", opts: ["The team felt rudderless — gasps, sighs and eye-rolls", "Everyone laughed", "He was promoted again", "Nobody noticed"], a: 0,
        expl: "A new leader joking about lacking leadership skills unsettled the team." },
      { q: "Which is a warning sign that self-deprecation has become a problem?", opts: ["People laugh", "You use it once a month", "You start believing the punchline", "You joke about your hobbies"], a: 2,
        expl: "Repeating negative thoughts about yourself is practising them." },
    ],
  },
});

// =====================================================================
// Unit XII, top-up (T-037, 2026-10-09) — B1 short-form structure, one
// lesson appended after spch100.11.4: a scriptwriting guide on story flow,
// comprehension and speed to value. Appended at the END of the unit; no
// key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.11.5": {
    module: "B1",
    mechanic: "Scripts lose viewers in three ways — tangents that break the story's through line, wording that makes people work to understand, and value that arrives too late — so audit every line for necessity, write for a sixth-grade reader in short active sentences, and state the value in the first seconds, then re-hook.",
    rules: [
      "Story flow: keep one clear through line — this happened, but this, so this. After writing, read each line and ask whether it is necessary context or a logical step, or a distraction. Cut the distractions.",
      "Comprehension: simpler words (about a sixth-grade level), shorter sentences, active voice; say a hard idea twice, the second time in the plainest words.",
      "Name your concepts: a one- or two-word name is easier to remember than a definition.",
      "Speed to value: in the first two or three seconds, set the context and tease the benefit or aggravate the pain.",
      "Re-hook about 20–25 seconds into a short (two or three minutes into a long video) — signal that something better is still coming, then deliver it — and end by summarising or extending the value.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take a 60-second script, or write one about a problem you solve. Mark every line K (needed context or logical step) or C (tangent), and cut the Cs. Rewrite the first line so it sets the context and teases the value, and add one re-hook line around the 20-second mark." },
    check: "Every remaining line is a K, the first line names both the topic and why it is worth watching, and the re-hook promises something not yet delivered.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.11.5": {
    takeaway: "A short-form scriptwriting guide on the three mistakes that cost retention — broken story flow, low comprehension and slow speed to value — with a line-by-line audit, five comprehension tactics, and a hook, body, re-hook, body, outro architecture.",
    beats: [
      { t: "Story flow", d: "His prince walks into the forest; then a detour about the prince loving horses as a child breaks the thread, and some listeners never get back on. Good storytelling works like hypnosis." },
      { t: "The line audit", d: "Is this line necessary context or an intentional step, or a distraction? Like a school word bank, you're not meant to use every word you were given." },
      { t: "Comprehension", d: "People don't buy because you know words they don't. Simpler words, shorter sentences, active voice, say it twice, name your frameworks." },
      { t: "Speed to value", d: "Books and films have a captive audience; a feed doesn't. Signal the value in the first seconds." },
      { t: "The architecture", d: "Hook (context plus value), first body, re-hook at 20–25 seconds, second body, outro that summarises or extends the value." },
    ],
    worked: "A tax accountant's script that wanders into the politics behind a new tax bill loses the small-business owner it hooked. Cut the tangent, open with the topic and the saving, re-hook at twenty seconds with 'but the bigger saving is…', and keep the politics for another video.",
    watch: "He promotes his free community and suggests using an AI tool to simplify wording; the line audit and the architecture are the lesson. The architecture is this course's long-form scripting lesson (spch100.16.1) in miniature.",
    concepts: [],
    checks: [
      { q: "What is the 'story flow' problem?", opts: ["The video is too short", "Extra details and tangents break the through line, so viewers lose the thread", "There are too many cuts", "There is no music"], a: 1,
        expl: "Every jump costs a share of the audience." },
      { q: "When does he suggest a re-hook in a short-form video?", opts: ["About 20–25 seconds in", "In the first second", "Only at the end", "Every five seconds"], a: 0,
        expl: "Two or three minutes in for a long YouTube video." },
      { q: "Which of these is one of his comprehension tactics?", opts: ["Use longer words to sound expert", "Speak faster", "Restate a hard idea a second time in the simplest words", "Avoid naming your ideas"], a: 2,
        expl: "He does it himself: 'rudimentary — or simple'." },
    ],
  },
});

// =====================================================================
// Unit III, second top-up (T-037, 2026-10-09) — A1, one lesson appended
// after spch100.2.9: Riaz Meghji's five tips, kept for its one distinctive
// rule (credibility before vulnerability). Appended at the END of the
// unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.2.10": {
    module: "A1",
    mechanic: "A story in a talk lands when you know its purpose and what the audience cares about, open on an unexpected truth, put them in the scene through the senses, move from struggle to conflict to resolution with a takeaway, and earn credibility before you show vulnerability.",
    rules: [
      "Decide the purpose first — inform, persuade, entertain — and frame a problem the audience cares about right now.",
      "Open with an unexpected truth or a secret ('Last month I received an email I was never supposed to see') so they ask what happened next.",
      "Speak to the senses — what you saw, heard, smelled — because listeners take in a story as if they were living it.",
      "Structure it as struggle, conflict, resolution, and say what changed and what is in it for them.",
      "Credibility before vulnerability: openness draws people closer only if they already see you as competent; otherwise a raw reveal can make you look like a mess.",
    ],
    drill: { minutes: 8, artifact: "written",
      do: "Pick a story for your next talk or pitch. Write its purpose in one line, an opening line that reveals an unexpected truth, one sensory detail, and the sentence that establishes your credibility before the vulnerable part arrives." },
    check: "The opening line makes a listener ask 'what happened?', and the vulnerable moment comes after at least one sentence that tells them why they should trust you.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.2.10": {
    takeaway: "Broadcaster Riaz Meghji's five tips for telling a story to an audience: know its purpose, open on an unexpected truth, speak to the senses, move from struggle to conflict to resolution with a takeaway, and show credibility before vulnerability.",
    beats: [
      { t: "Purpose", d: "Inform, persuade, entertain? Frame a problem the audience cares about now. He borrows John Maxwell's four ingredients: hope, help, heart and humour." },
      { t: "An unexpected truth", d: "'Last month I received an email I was never supposed to see.' A secret with a silver lining sets up a change." },
      { t: "The senses", d: "What did you see, hear, smell, touch, taste? Detail draws the audience into the scene with you." },
      { t: "Struggle, conflict, resolution", d: "People cheer for an underdog only after they relate to the struggle; the conflict builds suspense; the resolution says how you changed and what they can take from it." },
      { t: "Credibility before vulnerability", d: "The pratfall effect: a reveal draws people closer only if they already see you as competent." },
    ],
    worked: "In a pitch: first one line of credibility ('I've rebuilt the books for forty firms like yours'), then the vulnerable story ('the first one, I nearly lost because I missed something obvious'), then what it taught you — and what that means for them.",
    watch: "Short and general; several tips echo earlier lessons in this unit (the elephant, the five-second moment). Its distinctive contribution is the order: credibility first, then vulnerability.",
    concepts: [],
    checks: [
      { q: "What does 'credibility before vulnerability' mean?", opts: ["Never be vulnerable", "Show you are competent before you share something raw, or the reveal can backfire", "Share flaws first to build trust", "Only experts should tell stories"], a: 1,
        expl: "How a reveal lands depends on how they saw you beforehand." },
      { q: "Which kind of opening does he recommend?", opts: ["An unexpected truth or a secret", "A dictionary definition", "A statistic", "Thanking the organisers"], a: 0,
        expl: "It makes the audience ask what happened next." },
      { q: "What three stages does he suggest in place of beginning, middle and end?", opts: ["Hook, offer, call to action", "Setup, punchline, tag", "Struggle, conflict, resolution", "Past, present, future"], a: 2,
        expl: "Relate to the struggle, build suspense in the conflict, reveal the change." },
    ],
  },
});

// =====================================================================
// Unit XIV, top-up (T-037, 2026-10-09) — B6 delivery on camera, two short
// lessons appended after spch100.13.5: reading a script without sounding
// read, and the setup-and-pace checklist for a talking head. B6 stays the
// delta over Unit V, as the taxonomy intends. Appended at the END of the
// unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.13.6": {
    module: "B6",
    mechanic: "You sound natural on camera when the words are conversational and the delivery varies: write short, simple sentences in the second person, change pace and stress the key word, work from bullet points or record one scripted sentence at a time, and let your normal body language show.",
    rules: [
      "Make yourself comfortable — clothes, place, standing if it gives you energy — because comfort reads as natural.",
      "Write the way you talk: short, simple sentences, not news-article language. Record yourself talking to a friend and listen to how you actually speak.",
      "Say 'you', not 'hi everyone' or 'what's up, Instagram' — talk to one person.",
      "Vary the pace and stress the key word; read a line a few times until it sounds like you talking.",
      "For short videos, script in your notes app and record one sentence per take; for longer ones, work from bullet points. Show your hands and smile.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Write a five-sentence script for a short video, then rewrite it in conversational lines — short sentences, 'you'. Record it one sentence per take, repeating each line until its key word gets the stress." },
    check: "On playback no sentence sounds read, each has one clearly stressed word, and the script never addresses 'everyone'.",
  },

  "spch100.13.7": {
    module: "B6",
    mechanic: "Most weak talking-head videos are fixed by habits, not gear: camera slightly above eye level, one soft light at about 45 degrees with your face the brightest thing in frame, the microphone closer than feels normal, delivery 10–15 per cent slower, and recording in short sections.",
    rules: [
      "Eyeline: put the camera slightly above eye level so you look straight into the lens — a few inches higher than feels normal.",
      "Light: one soft light at about 45 degrees beats several harsh ones; your face should be the brightest thing in the frame.",
      "Audio: move the microphone closer than feels normal. Viewers forgive poor light; they leave if they can't hear you.",
      "Slow down by 10–15 per cent, pausing between thoughts; it feels too slow while recording and sounds clearer on playback.",
      "Record in short sections rather than one perfect take, and redo only the section you flub.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Record the same 30-second clip twice: first with your current setup and pace; then with the camera raised, one light at 45 degrees, the microphone closer, and a slightly slower delivery, in two sections. Compare them." },
    check: "In the second take your eyes meet the lens without looking down, your face is the brightest thing in frame, the audio has no room echo, and someone you show both prefers it.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.13.6": {
    takeaway: "A former news reporter turned business coach on looking and sounding natural on video — comfort, conversational language, 'you' not 'everyone', walking and talking, natural body language — and how to read a script without sounding as if you're reading it.",
    beats: [
      { t: "The memorised script", d: "Her first business videos — memorised lines, dressed up in the living room — looked anything but genuine." },
      { t: "Sound like yourself", d: "Record a real conversation and listen. Short, simple sentences and a varied pace, not news-article language." },
      { t: "Talk to one person", d: "People are told to talk to the camera as to one person, then open with 'hi everyone'. Use you, yours, yourself." },
      { t: "Move and show your hands", d: "Walking and talking, or doing a familiar task, relaxes you. Open palms and a smile; she often stands for energy." },
      { t: "Script or not", d: "Long videos from bullet points; short ones scripted in a notes app and recorded a sentence at a time — nothing to memorise, easy to edit." },
      { t: "Voiceovers", d: "Read a line several times until it has the rhythm of real speech, stressing the words the viewer cares about." },
    ],
    worked: "Her voiceover line 'I'm going to show you how I make my voiceover videos, like the one you're watching': read flat the first time; on the next take she stresses 'voiceover videos', the words her viewer cares about, and slows down for 'like the one you're watching'.",
    watch: "A few claims (showing your thumbs looks more attractive) come without a source, and the ending is a gear promotion. The scripting method is the lesson.",
    concepts: [],
    checks: [
      { q: "How does she record short scripted videos?", opts: ["She memorises the whole script", "One sentence per take, read from her notes app", "With a teleprompter", "She improvises everything"], a: 1,
        expl: "Short clips she can put together in editing." },
      { q: "What is wrong with opening 'Hi everyone'?", opts: ["It addresses a crowd instead of the one person watching", "It is too short", "It is too formal", "Platforms penalise it"], a: 0,
        expl: "Talk to one person, so say 'you'." },
      { q: "What does she do to make a read line sound natural?", opts: ["Speak faster", "Read it once only", "Repeat it until it has a natural rhythm, stressing the key word", "Whisper it"], a: 2,
        expl: "Vary pace and emphasis the way you would in conversation." },
    ],
  },

  "spch100.13.7": {
    takeaway: "Five no-new-gear fixes for talking-head videos — eyeline, one soft light, the microphone close, a slower delivery, and recording in short sections — shown on an iPhone with a budget lavalier to make the point.",
    beats: [
      { t: "Eyeline", d: "Too low and you look down into the lens; too high and you look stiff. Slightly above eye level — a few inches more than feels normal." },
      { t: "One soft light", d: "Softness, not brightness: one light at 45 degrees. If the background competes with your face, the lighting is working against you." },
      { t: "Microphone closer", d: "Distance makes audio thin and echoey. Clean audio matters more than good video." },
      { t: "Slower", d: "Nearly everyone speeds up on camera, which sounds less confident. Slow down 10–15 per cent and compare two test clips." },
      { t: "Sections", d: "One perfect take is pressure that makes delivery worse. Finish a section, reset, move on; redo only what you flub." },
    ],
    worked: "His pace test: the same clip at normal speed and slightly slower. Recording the slower one felt too slow; played back, it sounded clearer and more confident — which is why he says to record both and compare.",
    watch: "This is mostly setup, and its delivery points (pace, sections) overlap this unit's earlier lessons. Use it as the checklist you run before you press record.",
    concepts: [],
    checks: [
      { q: "Where should the camera sit, according to him?", opts: ["Well below eye level", "Slightly above eye level", "Directly overhead", "At chest height"], a: 1,
        expl: "You look straight into the lens, not down at it." },
      { q: "What does he say matters more than good video?", opts: ["Clean audio", "A new camera", "The background", "Colourful lights"], a: 0,
        expl: "If they struggle to hear you, they're gone." },
      { q: "By how much does he suggest slowing your delivery?", opts: ["By half", "Not at all", "About 10–15 per cent", "Speeding up instead"], a: 2,
        expl: "It feels slow while recording and sounds clearer back." },
    ],
  },
});

// =====================================================================
// Unit VI, second top-up (T-037, 2026-10-09) — A8 non-native speaker,
// two lessons appended after spch100.5.14: what to do when the English
// word will not come (Advanced English), and consonant-to-vowel linking
// (mmmEnglish). Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.5.15": {
    module: "A8",
    mechanic: "When the exact English word will not come, do not go silent — the goal is to be understood, not to be perfect — so talk around the gap: simplify, define it, use a synonym, say its opposite, or go more general and let the listener ask for detail.",
    rules: [
      "'The enemy of the good is the perfect': holding an idea back because you cannot phrase it perfectly in English deprives the room of it. <strong>Intelligibility</strong> is the goal.",
      "Simplify (KISS — keep it simple, silly): say it in plainer terms. A complicated phrasing is not more impressive.",
      "Define: you know the meaning even without the word, so describe it in other words. It takes longer, but it gets across.",
      "Synonym or opposite: reach for a similar word, or say the opposite of what you mean ('not eager at all' for 'reluctant').",
      "Generalise: go to the bigger picture. If listeners want detail they will ask, and you cannot predict what they will want anyway.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Write down five words from your own work or story that you sometimes cannot find in English (in your first language if need be). For each, record one sentence that gets the meaning across without the word, using a different strategy each time: simplify, define, synonym, opposite, generalise." },
    check: "Someone who hears the five recordings can name each missing word or idea, no recording stops or apologises mid-sentence, and each one uses a different strategy.",
  },

  "spch100.5.16": {
    module: "A8",
    mechanic: "In connected English speech a word ending in a consonant sound runs straight into a following word that begins with a vowel sound, with no gap — and the rule is about the sounds you hear, not the letters you see.",
    rules: [
      "Natural English is not spoken word by word: words reduce, contract and link. Saying each word separately is very clear but sounds robotic.",
      "Listen for sounds, not letters: 'like' ends in the letter e, but the e is silent, so the word ends in a /k/ sound and links to 'it'.",
      "Where a consonant sound meets a vowel sound, push them together — no space, no breath — so the pair rolls like one word.",
      "Small unstressed words often reduce to a schwa first; in 'slice of', the /s/ of 'slice' joins the schwa of 'of'.",
      "Start with the small, common words that begin with a vowel — prepositions, articles, conjunctions — and train by listening to native speakers and imitating them.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Write three sentences from one of your stories and mark every place where a consonant sound meets a vowel sound with a dash (like-it, slice-of), going by sound, not spelling. Record each sentence twice: once word by word, once linked." },
    check: "Every dash sits where a consonant sound meets a vowel sound (a silent final e does not count as a vowel), and on the linked take there is no gap at any dash.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.5.15": {
    takeaway: "Advanced English's lesson is about the moment a word will not come. Silence is the worst option — perfect is not the goal, being understood is — and five strategies get you round the gap: simplify, define, use a synonym, say the opposite, or generalise.",
    beats: [
      { t: "The enemy of the good", d: "Holding back an idea because you cannot phrase it perfectly in English deprives everyone of it." },
      { t: "The long way round is fine", d: "Concise is the general rule, but when the exact word is missing, a longer, roundabout explanation is acceptable." },
      { t: "Simplify and define", d: "Keep it simple (KISS). You know the meaning, so describe it in other words." },
      { t: "Synonym and opposite", d: "Find a similar word — checking a thesaurus whenever you learn a new word builds the stock — or say the opposite of what is on your mind." },
      { t: "Generalise", d: "Think bigger picture. If listeners want detail they will ask, and you cannot know in advance what they will latch on to." },
    ],
    worked: "Suppose 'reluctant' will not come. Simplify: 'he didn't want to.' Define: 'he agreed, but slowly, without wanting to.' Synonym: 'he was unwilling.' Opposite: 'he was not eager at all.' Generalise: 'he wasn't happy about it.' Any one of them gets the meaning across; silence gets nothing across.",
    watch: "Stop at about 6:20; the rest is channel and podcast promotion. The lesson is about conversation, but the same five moves rescue a talk or a story when a word goes missing in front of people.",
    concepts: [],
    checks: [
      { q: "What goal does the lesson set in place of perfection?", opts: ["Intelligibility — being understood", "A native accent", "Never pausing", "Always using the most precise word"], a: 0,
        expl: "Perfect is not the goal; communicating is." },
      { q: "The word 'reluctant' will not come, so you say 'he was not eager at all'. Which strategy is that?", opts: ["Simplify", "Generalise", "Say the opposite (contradict)", "Define"], a: 2,
        expl: "You reached the meaning through its opposite." },
      { q: "Why, according to the lesson, need you not give every detail when you generalise?", opts: ["Details confuse native speakers", "Listeners who want more will ask, and you cannot predict what they will want", "Short answers always sound more fluent", "Details need vocabulary you do not have"], a: 1,
        expl: "Let the other person ask for the part they care about." },
    ],
  },

  "spch100.5.16": {
    takeaway: "Emma from mmmEnglish opens a series on connected speech with consonant-to-vowel linking: when one word ends in a consonant sound and the next starts with a vowel sound, the two are pushed together with no gap. It is a large part of why natural speech sounds quick and relaxed, and it works on sounds, not spelling.",
    beats: [
      { t: "Same sentence, twice", d: "Said naturally, then word by word — the second is very clear but sounds like a robot." },
      { t: "Words bump into each other", d: "In natural English sounds change, get added or drop out. You cannot read it off the page; it is learned by listening and practising aloud." },
      { t: "Sounds, not letters", d: "'Like' ends in the letter e but in the sound /k/, so it links to 'it'." },
      { t: "No space, no breath", d: "The /k/ goes straight into the vowel. In 'slice of', the /s/ joins the schwa of an unstressed 'of'." },
      { t: "Where to start", d: "Small common words that begin with a vowel — prepositions, articles, conjunctions — give the most chances to link." },
    ],
    worked: "'I picked it up at eight.' Mark the links by sound: picked-it (the -ed is a /t/ sound), it-up, up-at, at-eight. Said word by word it has five gaps; linked, everything after 'I' runs as one unbroken stream.",
    watch: "About 1:30 to 3:05 is a sponsor message. Several practice sentences appear on screen and are not in the captions, so watch rather than listen in the background. This is part one: vowel-to-vowel and consonant-to-consonant linking are promised for later lessons and are not covered here. The video frames linking as reducing your accent; in this course the aim is ease and flow, not a native accent (see 'Intelligibility, not accent' earlier in this unit).",
    concepts: [],
    checks: [
      { q: "Why does 'like it' link, even though 'like' ends in a vowel letter?", opts: ["Because both words are short", "Because 'it' is stressed", "Because the e is silent, so 'like' ends in a /k/ consonant sound", "It does not — a vowel letter never links"], a: 2,
        expl: "Linking follows sounds, not spelling." },
      { q: "What should happen at a consonant-to-vowel link?", opts: ["The two sounds are pushed together with no gap or breath", "A short pause separates them", "The consonant is dropped", "The vowel is stressed"], a: 0,
        expl: "The pair rolls like one word." },
      { q: "Where does the lesson suggest starting to practise linking?", opts: ["Long technical words", "Small common words that begin with a vowel — prepositions, articles, conjunctions", "The last word of each sentence", "Names and numbers"], a: 1,
        expl: "They are everywhere, so they give the most practice." },
    ],
  },
});

// =====================================================================
// Unit III, third top-up (T-037, 2026-10-09) — A1 structure, one lesson
// appended after spch100.2.10: Brandon Sanderson's 2025 plot lecture on
// promise, progress and payoff (official upload, real captions, read in
// full). Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.2.11": {
    module: "A1",
    mechanic: "A story runs on promise, progress and payoff: the opening promises what kind of story this is and how it will feel, the middle must visibly move toward that promise or listeners treat it as a detour and stop investing, and the ending fulfils the promise in a way that feels surprising yet inevitable.",
    rules: [
      "Make the right promise early. The opening tells people the tone — funny, dark, tense — and what the story is about. The shorter the story, the harder and sooner the promise has to land.",
      "A cold open can be the story in miniature: a small version of the problem that shows what the big one will be.",
      "Progress is most of the story. You control time completely, so the job is not to make things happen but to give a <strong>sense</strong> of progress, and to signpost it: closer, one more piece, almost there.",
      "When an audience gets bored, it is usually a mismatch: you promised one thing and the progress is on a different axis. Fix the promise rather than the middle.",
      "Payoff should be surprising yet inevitable: make them doubt they will get what you promised (obstacles, escalation), then deliver — or make them wish for something better than the promise, and give them that.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Take one story from your bank and write four lines: (1) the promise your first two sentences make — the tone and the question the story raises; (2) three signposts of progress you will say aloud in the middle; (3) the moment the listener should doubt the outcome; (4) the payoff in one sentence. If the payoff does not answer the promise, rewrite the opening, not the ending." },
    check: "The payoff sentence answers the exact question the opening raises, and each of the three signposts names a step toward that answer rather than a side trip.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.2.11": {
    takeaway: "Brandon Sanderson reduces plot to promise, progress and payoff. The opening promises what kind of story it is; the middle must keep showing movement toward that promise; the ending fulfils it in a way that feels surprising yet inevitable. When an audience is bored, the progress is usually on a different axis from the promise.",
    beats: [
      { t: "Big P and little p", d: "The big plot is what you can say in a sentence; the little plot is the small problem-and-solution beats that keep people engaged moment to moment." },
      { t: "The tone promise", d: "If it will be funny, there are jokes early; if it will be dark, the opening is dark. Names, descriptions and the first pages all make the promise." },
      { t: "The story in miniature", d: "Raiders of the Lost Ark opens with a mini adventure that is the whole film in small: a clever hero, hard trials, and he loses anyway." },
      { t: "You control progress", d: "You could end any story in one sentence or spend fifty pages on one second. The job is a satisfying sense of progress, signposted — 'we're getting closer, one more piece'." },
      { t: "The side-quest problem", d: "Promise point B, then send the characters to point C, and readers stop investing. His fix in Oathbringer was a new promise: if one character does not reach C, someone he loves will die." },
      { t: "Surprising yet inevitable", d: "Obstacles, escalation and red herrings make people doubt the promise. The toy-car-and-toy-plane twist makes them want something else, then gives it to them." },
    ],
    worked: "A story about nearly missing a job interview. Promise: 'I almost didn't make it to the interview that got me this job' — tense, a little comic, and the question is whether he makes it. Progress: the missed bus, the wrong building, the lift out of order, each told against the clock ('eleven minutes left'). Doubt: at the top of the stairs the receptionist says the panel has gone home. Payoff: one of them is stuck in that broken lift. A detour into what he had for breakfast would feel like a side quest — cut it, or tie it to the clock.",
    watch: "Start at about 19:28; the first nineteen minutes are course logistics and questions about outlining (the big P / little p distinction at 2:48 and the overview at 9:09 are worth a minute each). The lecture is about novels and films. He says a short story must hit its promise harder, in the first paragraph; for a two-minute spoken story that means the first line or two. Contains spoilers for While You Were Sleeping and the Lord of the Rings films.",
    concepts: [],
    checks: [
      { q: "According to Sanderson, what is usually wrong when an audience finds a section boring?", opts: ["The language is too plain", "The progress is on a different axis from what was promised", "There is no twist", "The section is too short"], a: 1,
        expl: "His usual fix is to change the promise so it matches the progress." },
      { q: "Why does Raiders of the Lost Ark open with a short adventure?", opts: ["To show the story in miniature and promise what the film will be", "To give the villain's backstory", "To fill time before the title", "To set up a twist that reverses the ending"], a: 0,
        expl: "The rest of the film is the same shape at length." },
      { q: "What makes a payoff feel surprising yet inevitable, in the lecture?", opts: ["Hiding the promise until the end", "Putting a twist in every story", "Making the audience doubt they will get what was promised, then delivering it", "Ending before the promise is fulfilled"], a: 2,
        expl: "Obstacles, escalation and red herrings create the doubt." },
    ],
  },
});

// =====================================================================
// Unit VII, third top-up (T-037, 2026-10-09) — A5 the funny story, two
// lessons appended after spch100.6.18: Greg Dean on act-outs — playing
// the other people in a story from what they want, and staging the scene
// so it reads as real. Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.6.19": {
    module: "A5",
    mechanic: "In a funny story, playing the other people instead of narrating them puts the scene in the present in front of the audience — and a character becomes funny once you know what they want and what they value, because their point of view supplies the second interpretation a joke needs.",
    rules: [
      "Show, don't tell: 'my friend asked him…' is the narrator telling. Turning to play the friend lets the audience watch it happen now, which is more urgent and often funnier.",
      "After writing a bit, mark every character in it. A character you have not thought about comes out as a blank mannequin — 'just some guy'.",
      "Find each character's objective: why are they saying this, to this person? 'I want them to agree with me.' 'I want to put them down.'",
      "A character with different values reads the same thing differently. That is two interpretations of one thing — the structure of a joke — so the character starts writing jokes for you.",
      "Get to know the character by being them away from the stage, then put them in the story and stage them properly.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Take a funny story from your bank with at least one other person in it. Write one line on what that person wants in the key moment and what they value. Then record the moment twice: once narrated ('she said that…'), once acted out, turning to speak as her in the present." },
    check: "In the acted-out take the other person speaks in their own voice and from their own want, and you can point to the line where their point of view, not yours, makes the joke.",
  },

  "spch100.6.20": {
    module: "A5",
    mechanic: "To act out the scene inside a joke, write it as a scene, give the other person a decided attitude, stage it so the space stays physically consistent, and play your line as an honest reaction in the present — the audience laughs at believable people reacting, and fixates on anything in the scene that is not real.",
    rules: [
      "Write the joke out as a scene: where the narration sets it up, who is in it, where it happens, and what each person says.",
      "Give the other character a decided attitude — nice, bored, mean, hostile. Without one there is no point acting it out.",
      "Stage it consistently: an officer at the driver's window means you sit, hold the wheel and look up and over your left shoulder. A wrong side or a level eye line breaks the reality, and the audience watches the mistake instead of the joke.",
      "Play your line as an honest response happening now, not as a joke being delivered. Try different attitudes until the line sounds like something a real person would say.",
      "Acted out, the scene shows both personalities and the relationship between them, which is where the extra laughs come from.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Pick a two-person exchange from one of your stories. Write it as a scene: where each person is, what each says, and each one's attitude. Then record it on video, acted out: the other person's line in their voice and position, your reply looking at where they stand." },
    check: "On playback your eyes go to the same place every time the other person speaks, and your reply sounds like a real reaction rather than a punchline being delivered.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.6.19": {
    takeaway: "Greg Dean, answering a student whose act is full of characters: play them. Acting a character out turns telling into showing and puts the scene in the present, and once you know what a character wants and values, their point of view starts writing the jokes for you.",
    beats: [
      { t: "Narrator or scene", d: "'My friend asked him why…' is the narrator telling. Acting the friend out lets the audience watch it happen as if it were happening now." },
      { t: "No ghost mannequins", d: "An unexamined character comes out as 'some guy'. Decide who they are and what they value." },
      { t: "The objective", d: "Why are they saying this to this person? Then track it back: why does it matter to them?" },
      { t: "Two interpretations", d: "Your values and the character's values read the same thing differently — the structure of a joke, coming from character rather than wordplay." },
      { t: "One line, a whole world", d: "Richard Pryor plays a prison inmate for a single line, and the answer is so reasonable to the man that the audience sees his whole world." },
    ],
    worked: "A story about a landlord who will not fix the heating. Narrated: 'He said it wasn't that cold.' With an objective — he wants to avoid spending money, and he values being right — you turn and play him: 'Cold? This is fresh air. People pay for this in Switzerland.' The line comes from his point of view, not yours, and that gap is the joke.",
    watch: "A classroom question-and-answer clip. Dean refers to staging lessons taught elsewhere; the next lesson in this unit covers staging. His suggestion to walk around in public as the character is optional; the core is the objective and the values.",
    concepts: [],
    checks: [
      { q: "Why does Dean say acting out a character helps a funny story?", opts: ["It turns telling into showing and brings the scene into the present", "It lets you skip the setup", "It hides weak punchlines", "It makes the story shorter"], a: 0,
        expl: "The audience watches it happen instead of hearing about it." },
      { q: "What is a 'ghost mannequin' in Dean's terms?", opts: ["A prop on stage", "A character played without knowing who they are — just 'some guy'", "An audience member who never laughs", "A joke without a setup"], a: 1,
        expl: "Decide who the character is and what they value." },
      { q: "How does knowing a character's values produce jokes?", opts: ["It tells you which words to rhyme", "It makes the audience trust you", "It gives a second interpretation of the same thing, from their point of view", "It lets you reuse old material"], a: 2,
        expl: "Two interpretations of one thing is what a joke is." },
    ],
  },

  "spch100.6.20": {
    takeaway: "Greg Dean's tenth 'make funny jokes funnier' tip takes a Steven Wright one-liner about being pulled over and shows how to perform it as a scene: write it out, give the officer an attitude, stage the car and the window correctly, and play the reply as an honest reaction happening now.",
    beats: [
      { t: "A scene inside a one-liner", d: "'Didn't you see that stop sign?' 'Yes, but I don't believe everything I read.' Wright narrates it; there is a two-person scene inside." },
      { t: "Write it as a scene", d: "Mark where the setup ends and the scene begins, who is in it, and what each person says." },
      { t: "Portray the character", d: "Is the officer nice, mean, bored or hostile? Those choices decide how the scene plays." },
      { t: "Staging", d: "The officer stands at the driver's window, so you bend your knees, hold the wheel and look up and to the left. Get it wrong and the audience fixates on the mistake." },
      { t: "The honest reaction", d: "Why would anyone say that to someone who can give them a ticket? Find the state of mind that makes the line believable." },
    ],
    worked: "Narrated: 'My boss asked if I'd finished the report, and I said I'd been thinking about it very hard.' Acted out: you look up to where he stands by your desk, play him tired rather than angry, then answer him earnestly, as if thinking hard really were a kind of finishing. The earnest reaction gets the laugh, not the wording.",
    watch: "A narrated version of a blog post, with auto-generated captions; a short plug for a free workbook sits around 5:15, and from about 8:20 it lists the other tips in the series. The staging assumes driving on the right; where people drive on the left the officer is on the other side, as Dean notes.",
    concepts: [],
    checks: [
      { q: "Why does staging matter in an act-out, according to Dean?", opts: ["It makes the story longer", "If the audience notices something unreal in the scene, they fixate on it instead of the joke", "It lets you drop the setup", "It hides nerves"], a: 1,
        expl: "Space work has to be right in rehearsal." },
      { q: "In the police-stop example, where does the performer look when speaking to the officer?", opts: ["Straight ahead", "Down and to the right", "Directly sideways at head height", "Up and over the left shoulder"], a: 3,
        expl: "A level eye line would mean the officer is kneeling." },
      { q: "How should the punchline sound when it is acted out?", opts: ["Like an honest reaction from someone really in that moment", "Like a clearly delivered joke", "Louder than the rest", "Spoken to the audience, not the character"], a: 0,
        expl: "Believable reactions get the laugh; fake ones get judged." },
    ],
  },
});

// =====================================================================
// Unit V, second top-up (T-037, 2026-10-09) — A3 delivery, two lessons
// appended after spch100.4.10: stage movement for stories — a world
// champion's blocking of his own speech, and the two reasons to move.
// Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {

  "spch100.4.11": {
    module: "A3",
    mechanic: "Movement on a stage should carry meaning: say something from one spot, move as you go to the next thing, give each place and person in the story a fixed position, and return to that exact spot whenever the story does — so the audience sees the story's map without being told it.",
    rules: [
      "Don't move for movement's sake. Make a statement from one place, move as you go to the next statement, and say it from the new place. Wandering tells the audience your movement means nothing.",
      "Centre stage is the strongest position. Use it for the main point — the line that sums up everything.",
      "Lay places out the way the audience would see them on a map: the speaker walks from Indiana, on the audience's right, to California, on their left.",
      "Plant each character in one spot and keep them there. Use distance when the distance is the point — a 'thank you' sent clear across the stage.",
      "When the story goes back to a place, walk back to the same spot. Rehearse the blocking until you no longer think about it, keep your eyes on the audience, and check it on video and with competent feedback.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Take a story with at least two places and one other person. Draw a stage plan from the audience's side: where each place is, where the person stands, and centre stage for your main line. Then record yourself telling it on your feet, moving only between the marked spots." },
    check: "On the video every move starts and ends at a marked spot, you return to the same spot each time the story goes back there, and nothing is said while wandering.",
  },

  "spch100.4.12": {
    module: "A3",
    mechanic: "Move on stage for one of two reasons — because an action in the story moves you, or to step forward along a timeline — and remember where you have put every person and place, so you never walk through a scene you built.",
    rules: [
      "People remember what they see when you say something, so make the story visible — but pacing back and forth demolishes the scene you created.",
      "Do what the story tells you to do: if you go to talk to someone, go to where they are; if the story is standing in a queue, you hardly need to move.",
      "Give each location its own spot and remember where you put everyone, or you end up having lunch on the spot where you held the funeral.",
      "Use the stage as a timeline that reads left to right, and move along it on a transition line such as 'fast-forward with me eight years'.",
      "At the close, step back to the earlier spots to call back to earlier stories and points, visually and verbally.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Take a talk or story with three moments at different ages or dates. Mark three spots on the floor from the audience's left to their right. Record yourself telling it, walking to the next spot only on a transition line, and finish by stepping back to the first spot for a callback." },
    check: "Each move happens on a transition line, you never cross a spot where you placed a person or place, and the closing callback is said from the spot where that moment was first told.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.4.11": {
    takeaway: "The 2005 Toastmasters world champion walks through the stage movement of his winning speech. Every move had a reason: start from the back centre, put places where they sit on a map, plant the receptionist in one spot, use distance, and go back to the same spot whenever the story does.",
    beats: [
      { t: "Don't wander", d: "Say something from one spot, move as you go to the next statement, say it from there." },
      { t: "Walk out at the whole room", d: "He started at the back of the stage and walked straight out to centre stage, the strongest position, instead of coming in at an angle from a corner." },
      { t: "The map", d: "Small-town Indiana is told from one side; he crosses the stage as he heads for Los Angeles, because on a map Indiana is to the right of California." },
      { t: "Planted characters and distance", d: "The receptionist stays in one place every time he looks at her. He walks away toward an imagined lift so his 'thank you' has to travel across the stage." },
      { t: "Back to the same spot", d: "When he goes home to his roommates, he walks back to where California was. The audience already has it placed." },
    ],
    worked: "A story with three places: home, the office, the hospital. From the audience's side, put home on their left and the hospital on their right, and keep centre stage for the realisation the story leads to. Your mother stays where the hospital bed is; each time she speaks, you turn to that spot. When the story comes home at the end, walk back to exactly where home was.",
    watch: "Most of the video is his speech, paused and explained. Stage left and stage right are named from the speaker's side, so stage left is the audience's right, and he corrects himself once mid-sentence. He calls placing scenes on the stage 'blocking' or 'holographing'.",
    concepts: [],
    checks: [
      { q: "What does wandering around the stage communicate, according to the speaker?", opts: ["Energy and confidence", "That your movement has no meaning, so it becomes a distraction", "That you know the material", "Nothing, as long as you keep talking"], a: 1,
        expl: "Move to a spot, speak from it, move again." },
      { q: "Why did he cross the stage when his story went from Indiana to California?", opts: ["To match the map in the audience's mind", "To reach a second microphone", "To get closer to the judges", "To use up time"], a: 0,
        expl: "On a map, Indiana is to the right of California." },
      { q: "When the story returns to a place it has already been, what does he do?", opts: ["Stands at centre stage", "Stays where he is", "Walks back to the exact spot where that place was set up", "Points at the screen"], a: 2,
        expl: "The audience has already placed it there." },
    ],
  },

  "spch100.4.12": {
    takeaway: "A short lesson from a speaking boot camp: most speakers either stand still or pace, and pacing walks all over the scene they built. Move for two reasons only — an action in the story, or a step along a timeline — and remember where you put everything.",
    beats: [
      { t: "Seen, not just said", d: "Paraphrasing Patricia Fripp: people remember what they see when you say it, so speeches should be visual." },
      { t: "Action prompts movement", d: "'I've got to go talk to my wife about this' — walk to where she is, look her in the eyes, come back." },
      { t: "Lunch on your uncle", d: "A speaker held his uncle's funeral on one spot, then later had lunch on the same spot. Placed scenes are holograms; don't step on them." },
      { t: "The stage as a timeline", d: "Tell a story and make the point in one place; walk to the next on 'fast-forward with me eight years'." },
      { t: "Callbacks", d: "At the close, step back: 'just like when I was ten years old…', visually and verbally." },
    ],
    worked: "A talk with three stories — age ten, eighteen and today. Stand at the audience's left for ten, walk to the centre on 'eight years later', and to their right for today. Close by stepping back to the left: 'just like when I was ten…'. The room sees the callback before it hears it.",
    watch: "Under four minutes, with auto-generated captions that do not name the speaker. Left and right on the timeline are the audience's, which means walking from your right to your left as you face them.",
    concepts: [],
    checks: [
      { q: "What are the two reasons for moving on stage, in this lesson?", opts: ["Energy and variety", "To reach both sides of the room", "An action in the story, and a step along a timeline", "To calm nerves and fill pauses"], a: 2,
        expl: "Anything else is pacing." },
      { q: "What went wrong in the 'lunch on your uncle' speech?", opts: ["The speaker reused a spot already given to another scene", "The story was too sad", "The speaker stood still too long", "The timeline ran backwards"], a: 0,
        expl: "Remember where you put everybody and everything." },
      { q: "How does the timeline help the close of a talk?", opts: ["It shortens the ending", "You can step back to earlier spots to call back to earlier stories", "It hides your notes", "It keeps you at centre stage"], a: 1,
        expl: "The callback is visual as well as verbal." },
    ],
  },
});

// =====================================================================
// Unit XI, top-up (T-037 review round 1, 2026-10-09) — B3 story selection,
// one lesson appended after spch100.10.1: Paul Smith on choosing a story
// from the objective (a success, a failure or a moment of clarity), the
// ten stories a leader keeps ready, and why failures belong in the set.
// Re-fetched whole (an earlier fetch had stopped at the tool's limit) and
// read in full. Appended at the END of the unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {
  "spch100.10.2": {
    module: "B3",
    mechanic: "Choose the story from the point, not the point from the story: decide what you want this audience to think, feel or do differently, then search your past — and other people's — for a success, a failure or a moment of clarity around exactly that.",
    rules: [
      "Start with the objective and the audience. Only then go looking for a story; structure and polish come last.",
      "Look in three places: a time someone did the thing well (a success), a time someone did it badly and paid for it (a failure), and the moment you realised it mattered (a moment of clarity).",
      "Most of your stories should not be about you. A story you saw, or heard someone else tell, counts — and a set that is all about you sounds arrogant.",
      "Mix successes and failures. A case for change and a 'why I work the way I do' story usually land better as failures, and failures show you care more about the listener's growth than your ego.",
      "To get stories out of other people, don't ask for stories. Ask 'tell me about a time when…' — a mistake, a surprise, a biggest success.",
    ],
    drill: { minutes: 10, artifact: "written",
      do: "Write one sentence: what you want a specific audience to think, feel or do after your next talk, post or meeting. Under it write three headings — Success, Failure, Moment of clarity — and put one real candidate under each in a line, at least one of them not about you. Circle the one you would tell and say why in one sentence." },
    check: "The objective names an audience and a change in thinking, feeling or doing; each heading holds a specific moment (a time, a place, a person) rather than a topic; and at least one candidate happened to someone else.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.10.2": {
    takeaway: "Paul Smith, interviewed about Lead with a Story and The 10 Stories Great Leaders Tell: start from what you want people to think, feel or do, then look for a success, a failure or a moment of clarity around it. Keep a small set of durable stories ready, and tell more failures than feels comfortable.",
    beats: [
      { t: "Ask for a time, not a story", d: "Leaders asked for advice give bumper stickers. 'Tell me about a time when you made a huge mistake' can only be answered with a story." },
      { t: "Six parts before it is a story", d: "A time, a place, a main character with a goal, something in the way, and events that resolve. A relatable hero, a worthy challenge, emotion and a surprise make it a great one." },
      { t: "Objective first", d: "Decide what this audience should think, feel or do; then look for a success, a failure or a moment of clarity around it. Most of your stories should not be about you." },
      { t: "Ten stories", d: "Where we came from, why we can't stay, where we're going, how we'll get there; what we believe, who we serve, what we do for them, how we're different; why I lead the way I do, why you should want to work here." },
      { t: "Failures for change", d: "A case for change is a story about a person who would benefit — or one who missed out — not a financial metric. Leadership-philosophy stories also land better as failures." },
      { t: "Surprise by withholding", d: "Give the place and a first name but hold back the year and the surname until the end: the nine-year-old staring at the kettle turns out to be James Watt." },
    ],
    worked: "Objective: get a new team to ask for help early. Success: a colleague who flagged a blocked task on day one and shipped on time. Failure: the week you sat on a bug for four days and the release slipped. Moment of clarity: a mentor saying 'I'd rather hear bad news on Monday than on Friday'. Tell the failure — it costs you something, and it shows the team you would rather they skip the mistake than protect your image.",
    watch: "An hour-long podcast conversation with auto-generated captions. The teaching starts after about five minutes of background and ends with reading recommendations near 58:00. His '10 to 15 percent of a meeting' figure is his own observation, and he says so; the eBay experiment he describes (cheap objects resold with invented stories) is told from memory, with the markup approximate.",
    concepts: [],
    checks: [
      { q: "Where does Smith say the search for a story should start?", opts: ["With the structure you will tell it in, then a story to fill it", "With what you want this audience to think, feel or do differently", "With your most dramatic memory, then a point it could make", "With a story you have told before, adapted to the new audience"], a: 1,
        expl: "Objective and audience first; then a success, a failure or a moment of clarity around it." },
      { q: "Which kind of story does he say usually works better as a case for change?", opts: ["A failure: a person who missed out because nothing changed", "A success: the best quarter the whole team has ever had together", "A forecast: the return on investment the change will bring us", "A founding story: where the company first started out"], a: 0,
        expl: "Find the people who would benefit — and tell the story of one who didn't." },
      { q: "How did he make the kettle story end on a surprise?", opts: ["He told it in the present tense and gave the setting at the end", "He held back the boy's surname and the year until the very end", "He opened on the ending and then told the story backwards", "He left the mother out, so the boy seemed to be on his own there"], a: 1,
        expl: "Withhold part of the who and the when — details listeners expect at the start." },
      { q: "Why does he say most of the stories you tell shouldn't be about you?", opts: ["Other people's stories are always more dramatic than yours", "Listeners trust a story more when it is second-hand", "If every story is yours, you come across as arrogant", "You can't check your own memories well enough"], a: 2,
        expl: "A story you saw, or heard someone tell, can carry the point just as well." },
    ],
  },
});

// =====================================================================
// Unit XIV, second top-up (T-037 review round 1, 2026-10-09) — B6 delivery
// on camera, four lessons appended after spch100.13.7: writing and
// rehearsing for a teleprompter, why a prompter read still sounds fake,
// a news anchor's habits for a conversational read, and body language
// when you fill the frame. Each read in full. Appended at the END of the
// unit; no key moves.
// =====================================================================
Object.assign(DAR.DRILLS, {
  "spch100.13.8": {
    module: "B6",
    mechanic: "A prompter read sounds natural when the script was written to be spoken and rehearsed on the prompter itself: short paragraphs, everyday words, cues for inflection written into the text, eyes that never visibly scan, and a body that moves the way it does in conversation.",
    rules: [
      "Write like you speak: contractions, plain words, sentences you would say to a friend over dinner. Bullet points are a fair way to start before full scripts.",
      "One or two sentences per paragraph: more breaths, and clean places to pick up again when you fluff a line.",
      "The viewer must not see your eyes track the text. Trade your distance from the prompter against the size of the text until they stop moving.",
      "Rehearse on the prompter, not on a laptop screen. Notice where you trip — for this presenter, small words like 'to', 'or' and 'of' at the end of a line — and move them.",
      "Relax: use your hands, move your head with your eyes, look away where you naturally would, and mark the inflection in the script — an ellipsis to trail off, capitals to lift.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Rewrite 150 words of something you have written into spoken form: contractions, one or two sentences per paragraph, an ellipsis where your voice should trail off and capitals on the two words to hit. Put it in a prompter app or a large-font page just under the lens, record one take, fix the line ends that tripped you, and record again." },
    check: "In the second take your eyes do not visibly sweep across the lines, your head moves at least a few times, and the marked words are audibly lifted.",
  },

  "spch100.13.9": {
    module: "B6",
    mechanic: "A teleprompter read sounds fake for three reasons — the setup lets your eyes travel, the performance is acted rather than meant, and the words were never yours — and each has its own fix: text inside the lens, the 'why' behind every line, a script in your own spoken voice, and permission to go off it.",
    rules: [
      "Set it up first: keep the text inside the edges of the lens and the cue marker centred on it. Eyes sweeping the glass are the tell no technique can hide.",
      "Don't perform 'not reading' with scheduled glances and gestures. Make it real to yourself first: who you are talking to, and why this matters to them.",
      "Fix the script before the delivery. Words that aren't yours — a generated script, an essay voice, a keynote voice — can't be made to sound natural.",
      "You're not on live TV: pause, redo a line, say it differently, follow a tangent, and cut it together afterwards.",
      "Practise deliberately: record, watch back, and change one thing next time.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Take a 60-second script you wrote. Above it, write two lines: who exactly is watching, and why this matters to them today. Record it from a prompter or a large-font page under the lens; then record it again, allowed to drift off the script once. Watch both back." },
    check: "In the second take at least one line is said differently from the page, the eyes stay on the lens, and you can point to the moment where the 'why' you wrote changed how a line sounded.",
  },

  "spch100.13.10": {
    module: "B6",
    mechanic: "A broadcaster's habits for a conversational prompter read: know the story well enough to ad-lib, memorise your first line, let your eyes run a few words ahead of your voice, fix errors on sight, gesture a little, and vary pace, pitch and emphasis as if talking to a friend.",
    rules: [
      "Edit the script into your own speech beforehand, and know why the story matters, so the tone fits it and you can ad-lib if you must.",
      "Memorise the opening line, so you can start it before you turn to the camera.",
      "Let your eyes run four or five words ahead of your mouth. That buffer is what lets you sound conversational, and what lets you replace a wrong word without missing a beat.",
      "Gesture naturally — you are telling a story, not conducting an orchestra.",
      "Punch key words, pause where it feels right, don't end every sentence on the same pitch, and vary the pace: a trusted neighbour, not a tax auditor.",
    ],
    drill: { minutes: 8, artifact: "recorded",
      do: "Take a 100-word news-style paragraph about something you know and plant one wrong word in it. Memorise the first line. Record it from a prompter app or a page under the lens: begin the first line looking off-camera, turn to the lens, and replace the wrong word on sight without stopping." },
    check: "The planted error is replaced without a pause or a restart, the first line is said before the turn, and no two sentences in a row end on the same falling pitch.",
  },

  "spch100.13.11": {
    module: "B6",
    mechanic: "On camera you fill the frame, so small faults look large: look into the lens (at least 80 percent of the time when a live room is also watching), let your face show you're glad to be there, open and lengthen the body, keep your hands at rest unless a gesture means something, and stay grounded instead of rocking.",
    rules: [
      "If the video matters most, find the lens and look into it — all the time if you can, about 80/20 lens to room if you are also serving a live audience.",
      "Your face is huge on screen: no stony expression, and no fake fixed grin either. Let it show you're glad to be there.",
      "Open, not small: no crossed arms or hunched shoulders; lengthen the spine as if a string pulled the crown of your head up. Stand to record if you can.",
      "Hands rest at your sides and come up only to gesture. For a talk you repeat, build a small gesture vocabulary: one-two-three, up and down, bigger and smaller.",
      "No rocking, no small shuffling steps, no drifting out of frame: feel the floor under your feet and stay put unless the shot calls for movement. Then record yourself and watch it back.",
    ],
    drill: { minutes: 10, artifact: "recorded",
      do: "Record one minute to camera sitting down, then the same minute standing, framed from the waist up. Watch both with the sound off and tally: seconds spent looking away from the lens, any crossed or hidden hands, any rocking or shifting of the feet." },
    check: "In the better take the eyes are on the lens for most of the minute, every gesture goes with something you are saying, and the tally for rocking or shifting is zero.",
  },
});
Object.assign(DAR.SUMMARIES, {

  "spch100.13.8": {
    takeaway: "Seven teleprompter habits from a presenter who has read scripts for their own videos for eighteen years: write in spoken English, break the script into short paragraphs, keep your eyes from scanning, rehearse on the prompter itself, fix what trips you, relax the body, and keep the inflection.",
    beats: [
      { t: "Bullets before scripts", d: "Prompting a full script takes practice; bullet points can feel more natural at first." },
      { t: "Write like you speak", d: "Throw out English-class grammar: 'don't', not 'do not'; start sentences with 'and'; everyday words." },
      { t: "Paragraph breaks", d: "One or two sentences per paragraph gives you breaths, and places to cut when you restart." },
      { t: "Hide the eyes", d: "Eyes moving across the text break the viewer's trust. Distance and text size are traded against each other." },
      { t: "Rehearse on the glass", d: "Your mouth and brain behave differently reading a prompter than a computer screen. An operator moved the presenter's trip-words from the ends of lines to the starts." },
      { t: "Body and voice", d: "Relax the face, use the hands, look away where you naturally would, move your head; cue inflection with ellipses and capitals." },
    ],
    worked: "Before: 'It is important to note that the deployment process consists of three stages, each of which must be completed in order.' As a prompter script: 'Deploying takes three steps.' / 'And you can't skip one…' / 'Here's WHY.' Three short paragraphs, a contraction, an ellipsis to trail and a capital to lift.",
    watch: "Under seven minutes. The middle carries a plug for the presenter's own live training, and the end recommends a prompter. The five-feet distance is a rule of thumb for that set-up, not a standard.",
    concepts: [],
    checks: [
      { q: "What did the teleprompter operator change to stop the presenter stumbling?", opts: ["She moved short words like 'or' and 'of' off the ends of lines", "She made the text bigger, so fewer words fitted on a line", "She slowed the scroll so each line stayed on the glass for longer", "She split the longest sentences in two at the commas"], a: 0,
        expl: "Small words at a line end caused the trips; at the start of the next line they didn't." },
      { q: "Why only one or two sentences per paragraph?", opts: ["It keeps every line inside the lens, so the eyes don't wander", "It gives you breaths, and clean places to restart after a slip", "It speeds the read up, so the finished video comes out shorter", "It lets the operator scroll the whole script at one fixed speed"], a: 1,
        expl: "More breaths feel natural, and each break is a place to pick up again." },
      { q: "How does the lesson suggest getting inflection into a read?", opts: ["Mark it in the script: an ellipsis to trail off, capitals to lift", "Record each sentence separately and keep the liveliest take", "Read a little faster than normal, since speed sounds like energy", "Keep your face still so that your voice carries all the emotion"], a: 0,
        expl: "The script itself carries the cues." },
    ],
  },

  "spch100.13.9": {
    takeaway: "A creator who bought a teleprompter on why prompter reads still feel fake even with all the tricks: set it up so your eyes can't travel, stop acting natural and make it real to yourself, write the script in your own spoken voice, and give yourself permission to go off it.",
    beats: [
      { t: "The viewer's radar", d: "In a video about teleprompters you hunt for the tells; in an ordinary video, set up properly, viewers aren't looking for them." },
      { t: "Setup", d: "Keep the text within the lens: this creator uses a phone held upright, one to three words per line, the cue marker centred on the lens." },
      { t: "Acting natural is still acting", d: "Scheduled glances and gestures look like a school play. A commercial director once gave this creator the head space behind the action, not the moves." },
      { t: "The script is the problem", d: "Not a ChatGPT script, not an essay or keynote voice: it has to read the way you speak." },
      { t: "Flexibility", d: "Pause, redo, ad-lib or follow a tangent, then edit. Feeling held hostage by the script shows." },
    ],
    worked: "On the page: 'Today we will be discussing three methods for improving sleep.' The head space: a friend who has been awake at 3 a.m. all week. Said to her: 'You've been waking up at three, right? Here are three things that actually helped me.' The same information, now spoken to someone.",
    watch: "Seven minutes of one creator's practice and opinion; they say they are still learning, and call the very large text an experiment rather than a known best practice. It ends with a link to the prompter they use.",
    concepts: [],
    checks: [
      { q: "What gives a prompter read away before anything else, in this lesson?", opts: ["Eyes moving across the glass when the text runs past the lens", "A voice that is too loud, because the prompter sits too far away", "Hands held still, because the speaker is gripping the remote", "A flat tone, because the scroll speed is set slightly too fast"], a: 0,
        expl: "Fix the setup first, or nothing else is worth doing." },
      { q: "What is the fix for a performance that feels like a school play?", opts: ["Add more glances away and bigger gestures, on a fixed schedule", "Get into the head space: who you're talking to, and why it matters", "Slow the prompter right down so that you can think between the lines", "Memorise the first and the last lines so they look unscripted"], a: 1,
        expl: "Make it real to yourself first; let that guide where you look and how you say it." },
      { q: "Why can't a generated script be rescued by delivery tips, in this lesson?", opts: ["The prompter can't display text from another program", "Words that aren't your own can't be made to sound like you", "Generated scripts are always too long for a single take", "Viewers can spot machine-written text from its rhythm alone"], a: 1,
        expl: "The script has to read exactly the way you speak." },
    ],
  },

  "spch100.13.10": {
    takeaway: "A TV anchor's ten extra tips for sounding human on a prompter, plus his seven originals. The newest: your eyes run four or five words ahead of your voice, and that split second is what lets a read sound conversational.",
    beats: [
      { t: "First line from memory", d: "Memorise it, so you can begin while still looking at your co-anchor, then turn to the camera." },
      { t: "Know the story", d: "If you know why it matters to your community, the tone follows and you can ad-lib." },
      { t: "Gestures and sight editing", d: "Move your hands a little. When you see a mistake on the prompter, say the right word without missing a beat." },
      { t: "Watch others, and yourself", d: "Study presenters who sound conversational; watch yourself back; practise on a free online prompter." },
      { t: "Read ahead", d: "Peripheral vision works vertically too: scanning four to five words ahead lets the brain process them in time." },
      { t: "The originals", d: "Edit it into your own speech, write conversationally, punch words, pause, vary pace and pitch, breathe, talk as to a friend." },
    ],
    worked: "'Police closed the bridge Tuesday after a crack was found in the deck.' Read flat, every word weighs the same. Read as to a friend: 'Police CLOSED the bridge on Tuesday… after someone found a crack in the deck.' One punched word, one short pause, and a sentence that doesn't end on the same falling note as the last one.",
    watch: "About four minutes, cut quickly; the seven original tips go by in the last minute. The study on gestures he mentions is cited without detail.",
    concepts: [],
    checks: [
      { q: "Why does he memorise his first line?", opts: ["So he can start it facing his co-anchor, then turn to the camera", "So the prompter operator has time to load the rest of the script", "So he has one line ready to repeat if the prompter fails", "So the director can frame the shot before he reads anything"], a: 0,
        expl: "The read begins before the eyes reach the glass." },
      { q: "What is 'sight editing'?", opts: ["Cutting lines from the script while rehearsing it out loud", "Saying the right word when you spot an error on the prompter", "Checking the shot on a monitor while reading the next line", "Marking the words to punch with capitals before going on air"], a: 1,
        expl: "Proofreading still lets mistakes through; fix them live, without a pause." },
      { q: "What does reading four or five words ahead do, in his account?", opts: ["It keeps your eyes centred, so the viewer can't see you reading", "It lets the operator scroll faster without you losing your place", "Your brain gets the words in time, so the read sounds conversational", "It gives you time to breathe before every new sentence starts"], a: 2,
        expl: "A vocal coach pointed it out; he had been doing it without noticing." },
    ],
  },

  "spch100.13.11": {
    takeaway: "A media trainer on body language for video: on camera you fill the whole frame, so eye contact, facial expression, open posture, deliberate gestures and stillness matter more than on a stage — and the only accurate mirror is a recording of yourself.",
    beats: [
      { t: "Four stages", d: "From not knowing you're doing it wrong to doing it right without thinking. Camera delivery is a new skill, so expect to pass through all four." },
      { t: "Larger than life", d: "On a stage you share the space; on a screen you are the whole frame." },
      { t: "The lens", d: "Looking into it reads as looking into the viewer's eyes. In a hybrid talk, roughly 80 percent lens and 20 percent room; glancing down at a comfort monitor looks like disconnecting on video." },
      { t: "Face", d: "No expression reads as cold or unhappy to be there; a fake grin is worse at that size." },
      { t: "Open, long, grounded", d: "Open hands, no slouching, a lengthened spine; stand if you can; feel your feet on the floor." },
      { t: "Hands and feet", d: "Hands at your sides until a gesture is needed; a planned gesture vocabulary; no rocking and no small back-and-forth steps." },
    ],
    worked: "A seated webinar: laptop raised so the lens is at eye level, the notes window dragged right under the lens, chair pushed back so the frame shows hands and shoulders. Hands rest on the desk and rise only on 'three things' and 'it got bigger'. Before going live, feet flat on the floor.",
    watch: "About nineteen minutes, with a plug for the trainer's agency at the end. The claims about hormones — dopamine and oxytocin from a smile, serotonin from feeling the floor — are the trainer's own and unexplained; the practical advice doesn't depend on them.",
    concepts: [],
    checks: [
      { q: "Why are body-language faults bigger on camera than on a stage, in this lesson?", opts: ["Viewers watch videos more critically than live audiences do", "On screen you fill the frame, so every movement is magnified", "Cameras exaggerate fast movement because of their frame rate", "There is no audience reaction to cover a nervous habit"], a: 1,
        expl: "On a stage you are one thing among many in the room." },
      { q: "In a hybrid talk, with a live room and a recording, where should your eyes be?", opts: ["Mostly on the room, glancing at the lens at the end of each point", "On the lens about 80 percent of the time and the room about 20", "On the comfort monitor, so you never lose your place in the slides", "Evenly split between the lens, the room and the comfort monitor"], a: 1,
        expl: "The video is what lasts, so it gets most of the eye contact." },
      { q: "What should your hands do when you're not gesturing?", opts: ["Hold a pen or clicker so they have something natural to do", "Clasp them loosely in front of you at waist height, like a steeple", "Let them rest at your sides and bring them up only to gesture", "Keep them moving gently so you never look stiff or frozen"], a: 2,
        expl: "Distracting, repetitive gestures disappear when the default is stillness." },
    ],
  },
});
