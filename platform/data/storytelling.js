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
  desc: "The fourth subject. Told stories, not written ones — the anecdote in a meeting, the answer under pressure in an audit, the joke that lands, the ninety seconds to camera. About fifty hours across sixteen modules: structure, finding stories, delivery, speaking as a non-native speaker, humour written and live, conversation, high-stakes talking, then the same mechanics pointed at a lens. Watching does not make anyone better at this; the reps on the Practice page are the course. These are the mechanics the reps run on.",
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
// the seed's professional-voice lesson). Julian Treasure, Vinh Giang (two
// lessons), Roger Love, Rebecca Martin, Alex Lyon, Matt Abrahams, and
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
      "Pretty good speakers have range but play it safe. Giang says the fear of judgment is mostly false, because people are thinking about themselves.",
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
    takeaway: "Vinh Giang's three levels — rookie, pretty good, natural — assessed on voice, body and words. You move up by first getting self-awareness, then using your full range, and finally having more than one way to make any point.",
    beats: [
      { t: "Rookie", d: "Flat delivery, vocal fry, filler words in every breath, a body that does nothing, no structure. Giang calls them habits, not who you are." },
      { t: "The self-awareness exercise", d: "Two unscripted minutes on camera, transcribed, so you can see the filler words and the circling." },
      { t: "Pretty good", d: "Range, but kept safe. A small set of gestures used over and over. Repeated, non-functional movement — he uses a speaker who keeps moving as the example." },
      { t: "Frameworks", d: "Structures such as PREP and 3-2-1 filter your thinking so the listener does not have to sort it out." },
      { t: "Natural", d: "All five vocal dials, purposeful body language, a face that matches the voice, and other ways to say the same thing: analogy, prop, story." },
    ],
    worked: "'Read more books' three ways: the analogy (reading is to the mind what exercise is to the body), the prop (a book holds years of someone's work), and the story (his father, after a half-million-dollar loss: every book you read is a soldier in your army).",
    watch: "Moving without a reason. If a movement does not serve the message, it distracts — and small habits like touching your glasses add up.",
    concepts: [],
    checks: [
      { q: "What does Giang say keeps 'pretty good' speakers stuck?", opts: ["They do not know any frameworks", "Fear of judgment stops them using the edges of their range", "Their accent", "Too much volume"], a: 1,
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
    watch: "Translating a joke that works in your first language word for word. Even when you explain it, it rarely lands. NOTE: the transcript tool stops at 41:30 of 45:42; the unread end is the hosts' closing discussion.",
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
// reading discomfort and recovering a joke (two Charisma on Command
// breakdowns), callbacks, and naming the elephant in the room.
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
    watch: "Trying to be clever. Madson's whole method rests on the opposite: the obvious, honest response is usually the one that works. NOTE: the first thirteen minutes are a thank-you list to Google; the transcript tool stops at 53:01 of 57:19, where she moves to book signing.",
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
    takeaway: "A Charisma on Command breakdown of talk-show clips: three kinds of joke that make people like you less — exposing sensitive information after someone shows discomfort, guilt-trip jokes, and teasing people below you — and what to do instead.",
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
    takeaway: "A Charisma on Command breakdown of Norm Macdonald: how he made bad jokes kill — a mischievous smile, explaining jokes the audience already got, deliberately obvious punchlines after a pause, and turning his own fumbled delivery into the joke.",
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
    takeaway: "Kio Stark at TED: talking to strangers creates 'fleeting intimacy' and frees us from seeing people as categories. Know the local rules — and try the ways in: smile, triangulate, notice, dogs and babies, disclose.",
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
