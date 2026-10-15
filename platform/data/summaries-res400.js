// Brickford — lecture summaries, RES 400 (Research & Frontier)
//
// T-033. Every entry here was written FROM its source after reading the whole of
// it: a lecture from its transcript, a reading from the page the lesson links
// (fetched from the official repository that publishes the page, where the page's
// own host is unreachable — see the T-033 notes). Nothing is written from memory
// or from what a source "probably" says. A lesson whose source could not be
// fetched has no entry; T-033's unavailable.md says which and why.
//
// Same shape as the other summary files, plus two optional fields on each check:
//   at  — the second in the video where the point is taught (video sources);
//   src — the section of the reading where it is taught (papers and readings).
// tools/verify-content.js holds the quiz to its size (5 / 6 / 8 by length, 6 for
// a reading), recomputes every numeric answer independently, and bounds how
// often the answer is the unique longest option.
//
// No concepts and no figures: DAR.CONCEPTS and DAR.FIG are linear algebra, so
// `concepts: []` is the correct value here.
window.DAR = window.DAR || {};

DAR.SUMMARIES = Object.assign(DAR.SUMMARIES || {}, {

  "res400.2.2": {
    takeaway: "Most of research is the outer loop — choosing which problem is worth solving and ripe for solving — and taste for that can be learned: fertile ground, ambition with a real attack, one core contribution per paper, and no gaming of proxy metrics.",
    beats: [
      { t: "Why, and the honest disclaimer", d: "A PhD offers freedom, ownership, deep expertise, and keeps future choices open. It also brings deadline grind, discarded months of work and identity crises; if you are unsure, lean slightly negative, and try research before committing — which is exactly why research experience is valued in admissions: the student knows what they are getting into." },
      { t: "Getting in: references, references, references", d: "Strong letters from people you did research with matter most; a publication helps; grades matter little beyond not being low. Time spent on grades would have been better spent on research, early and under several supervisors." },
      { t: "The adviser is a symbiosis", d: "Understand their incentives — tenure, funding, recognition. Pre-tenure advisers tend to be hands-on and low-level; senior ones work at a higher level of abstraction. Ask their students specific questions, look at where alumni went, and choose the whole lab, because you will see its students every day." },
      { t: "The outer loop", d: "Solving problems is the simple inner loop. Most of the time goes on the outer loop: which problems are worth solving and ripe for solving. Advisers are masters of it — 'taste' is real — and you acquire it by practice and apprenticeship." },
      { t: "What makes a problem good", d: "Fertile ground that papers can build on; your adviser's interests; ambition, because a 10x more important problem is at most 2-3x harder — aiming at 10x forces first principles and a new strategy; but with an attack, as Hamming put it; and an area you can be 'the person who did X' in. Five years of work is about 10,400 hours, so the skills should be worth having anyway." },
      { t: "What to avoid", d: "Incremental 'cockroach' papers — 2% on a benchmark, hard to reject, rarely cited; the 'next logical step' nobody has bothered with; the easy poster. Your adviser can be wrong, and you may sometimes ignore them. And do not just play the paper game: think from first principles and do what others should but do not." },
      { t: "Papers", d: "Learn what bad looks like by reviewing — only good examples is a binary classifier trained on positives. Match the expected gestalt. Identify the single core contribution and organise everything around it; contributions are not additive. Default structure, one point per paragraph, every step justified (no laundry list), and an internal deadline two weeks early." },
      { t: "Code and talks", d: "Release your code — it forces better habits and invites follow-ups — and document it for the future you. A talk's goal is to make the audience care about the problem, teach them something and entertain them, not to recite your paper: pictures over text, no dense results tables, no outline slide, and watch the thin band between bored and confused." },
      { t: "Conferences, and no shortcuts", d: "Go, and treat the hallways as the main event: the papers are old news, and much of a field's knowledge is never written down but held by its community. Finally, gaming proxy metrics — self-citation, remixed or resubmitted papers, missing baselines — catches up with you. Do good work and communicate it properly." },
    ],
    worked: "Run a candidate project through the checklist before starting: is it fertile (will it lead to more work)? Is it ambitious, and is there a concrete attack? Can it be described in a sentence — 'the person who did X'? Will the skills be worth having even if it fails? If the honest answer is 'it is the next logical step', look again.",
    watch: "Mistaking a stream of accepted incremental papers for progress. They get in because a reviewer cannot point to anything to kill them, so the acceptances feel productive — but they are not cited and do not move the field.",
    concepts: [],
    checks: [
      { q: "Karpathy notes that research experience is prized when PhD programs choose students. What reason does he give?", opts: ["It proves the student can already publish at the top venues", "The student is likelier to know what they are getting into", "Admissions weigh it above reference letters and grades alike", "It shows the student can work without an adviser from day one"], a: 1, src: "Preliminaries — The disclaimer",
        expl: "After listing the hardships, he advises trying research first, and notes that a main reason research experience is desirable in PhD hiring is not the research itself but that the student is more likely to know what they are signing up for. Reference letters, not experience, are what he calls most important." },
      { q: "Karpathy calls a PhD 'an exercise in the outer loop'. What is the outer loop?", opts: ["Running many experiments in parallel and keeping the ones that work", "Writing results up fast so the next paper can begin straight away", "Rereading the literature until the open problems become obvious", "Deciding which problems are worth solving and which are ripe to solve"], a: 3, src: "Research topics — An exercise in the outer loop",
        expl: "Solving a problem is the inner loop. The outer loop is the meta-problem — imagining solving hypothetical problems and asking what it would unlock and whether anyone cares — and it is where most of a PhD's time goes. The 'taste' academics talk about is skill at this loop." },
      { q: "Why does Karpathy argue that a problem 10x more important is not 10x harder?", opts: ["Aiming at 10x forces first-principles thinking and a new strategy", "Important problems attract collaborators, who share out the work", "Bigger problems get more funding, which buys the compute to solve them", "Reviewers are more lenient with papers on more important problems"], a: 0, src: "Research topics — Be ambitious: the sublinear scaling of hardness",
        expl: "In his experience a 10x more important problem is at most 2-3x harder, because the ambition itself changes the approach: you confront an approach's real limits and innovate. Aim for 10% and you get it by working hard; aim for 100% and you will likely still get there, but by a different route. Hamming's caveat follows: it still needs a reasonable attack." },
      { q: "Using Karpathy's working year — 260 working days of 8 hours — how many years does it take to reach Gladwell's 10,000 hours? Give two decimal places.", num: 4.81, tol: 0.01, src: "Research topics — Valuable skills",
        expl: "A working year is 260 x 8 = 2,080 hours, and 10,000 / 2,080 = 4.81 years. That is why he says five years (10,400 hours) is exactly enough to become an expert — so choose an area whose skills you will value whatever the papers achieve." },
      { q: "Karpathy packed a second, minor contribution into his video-classification paper. What lesson does he draw?", opts: ["Two contributions make a paper about twice as likely to be cited", "Minor ideas belong in the appendix, where reviewers expect them", "Contributions are not additive: the minor one diluted the paper", "A second contribution is fine if the experiments support it too"], a: 2, src: "Writing papers — Identify the core contribution",
        expl: "He had reasoned that two contributions are better than one. They are not: the second was minor, distracted from the first, and no one cared. A paper sells a single thing that was not obvious before, and everything in it is organised around that one contribution." },
      { q: "If most papers at a conference are old news by the time it meets, why does Karpathy still insist you go?", opts: ["Attending is how reviewers learn to recognise your name on papers", "Much of a field's knowledge is never written down; its people hold it", "The talks give results in much more detail than the papers have room for", "The posters show the newest results before they ever reach arXiv"], a: 1, src: "Attending conferences",
        expl: "Research is a social endeavour, and each field has knowledge that never gets serialised into papers — what to work on next, which methods really work, the inside story of a paper. The hallway is the main event that is not on the schedule: learn from the hivemind first, then influence it." },
    ],
  },

});
