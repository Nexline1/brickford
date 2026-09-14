// Brickford — SPCH 100, the storytelling seed.
//
// THIS IS A SEED, NOT THE CURRICULUM. Five lessons, not thirty. It exists so
// the Publish block has something in it while the full harvest is blocked (see
// docs/storytelling/00-harvest-blocker.md — youtube.com is 403 from the build
// environment, so the 80-query search that would build the real 30-hour core
// path has to be run locally).
//
// Every lesson here had its transcript read before it was added, per the brief.
// The transcripts are stored in data/storytelling/transcripts/ so a lesson
// survives its video being deleted. One candidate was REJECTED at this stage
// and is recorded in docs/storytelling/rejections.md — its title was fine and
// its captions were nonsense, which is the whole reason the rule exists.
//
// Harvest content gets APPENDED as new units. Never insert into Unit I: lesson
// keys are positional ("spch100.0.0"), so an insert silently re-points progress.
window.DAR = window.DAR || {};

DAR.COURSES.push({
  id: "spch100",
  instructor: { name: "Matthew Dicks · Vinh Giang · Matt Abrahams", org: "The Moth · Stanford GSB" },
  code: "SPCH 100", title: "Storytelling", faculty: "Speech",
  practice: { label: "The reps — story bank daily, recorded rep weekly", url: "https://www.themoth.org/tell-a-story/storytelling-tips-tricks" },
  phase: 0, color: "gold",
  desc: "The fourth subject. Told stories, not written ones — the anecdote in a meeting, the answer under pressure in an audit, the ninety seconds to camera. Watching does not make anyone better at this; the reps on the Practice page are the course. These are the mechanics the reps run on.",
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
