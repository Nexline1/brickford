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
