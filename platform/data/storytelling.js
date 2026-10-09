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
