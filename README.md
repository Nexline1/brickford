# Phase 0 — Calibration Kit (Weeks 1–2)

> **This kit now lives inside your university platform: double-click `Brickford.bat` in this folder.**
> It opens **Brickford** in your browser — courses with embedded lectures, the Exam Hall (timers + auto-graded exams), transcript & gates, weekly review, treasury, and this document rendered in the Library. The launcher window also prints a **phone URL** (works on the same Wi-Fi while the PC is on). Use the platform's **Backup** button weekly; progress lives per-browser, and Backup/Restore moves it between devices.

Start date: 2026-07-27 (Day 1, a Monday — each week runs Monday to Sunday, and the Sunday review seals it). Everything here is measurable. No vibes, only results.

---

## 1. Math Diagnostic (3 sessions, exam conditions: timer on, no notes, no AI, no internet)

**Session A — Linear Algebra (3 hours)**
- Exam: [MIT 18.06 Final Exam (Spring 2010, Strang)](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/b799045edd80df18879088bcf872b214_MIT18_06S10_Final_Exam.pdf)
- Solutions (open ONLY after finishing): [18.06 Final Solutions](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/45790724487e46dcc02f55d0fc092ab7_MIT18_06S10_Final_Answers.pdf)

**Session B — Calculus (3 hours)**
- Exam: [MIT 18.01SC Final Exam (Fall 2010)](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/93c7107d33490a892fdf426e5033062e_MIT18_01SCF10_final.pdf)
- Solutions: [18.01SC Final Solutions](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/resources/mit18_01scf10_finalsol/)

**Session C — Probability (2 hours)**
- Do Strategic Practice sets 1, 3, and 10 (pick ~10 problems total) from [Harvard Stat 110 Strategic Practice Problems](https://stat110.hsites.harvard.edu/strategic-practice-problems) (solutions are included in each PDF — again, only after).

**Scoring rule (write your % below each):**
- ≥70% on all three → math verified, Phase 1 runs at full speed.
- Any subject <70% → that subject gets a daily 1-hour gap-filling block in Phase 1 using [Mathematics for Machine Learning (free PDF)](https://mml-book.github.io/) + [3Blue1Brown](https://www.3blue1brown.com/).

| Subject | Score | Date | Verdict |
|---|---|---|---|
| Linear Algebra (18.06) | ___% | | |
| Calculus (18.01) | ___% | | |
| Probability (Stat 110) | ___% | | |

## 2. Coding Diagnostic

See [coding-diagnostic.md](coding-diagnostic.md). Two parts, both with AI assistance fully OFF.

## 3. Infrastructure Setup (one afternoon)

- [ ] GitHub account under your real name, professional profile README
- [ ] Blog: GitHub Pages or Substack — pick one, don't overthink
- [ ] X/Twitter account for public build-in-public posts
- [ ] Bookmark: [Karpathy — Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html)

## 4. Earning Offer (one page, one sitting)

Write ONE productized offer using skills you already have. Template:
> "I build [specific AI automation, e.g., WhatsApp booking agent / lead-qualification bot] for [specific Gulf niche, e.g., clinics / restaurants / real-estate offices] in [X days] for [fixed price BHD]."

Rules: fixed scope, fixed price, delivery ≤ 2 weeks, max 2 clients at once, ≤2 h/day. Your Arabic+English+German and real agency experience is the moat.

## The method — watched is not learned

A lecture can be **watched** or **proven**, and they are different numbers.
Mastery counts only the second. To prove one, four gates:

1. **Recall cold** — blank page, three minutes, no video
2. **Rebuild** — reproduce the derivation or code from memory, then diff it
3. **Solve unaided** — three problems from the course's real source
4. **Explain plainly** — a few sentences a smart friend would follow

Proving a lecture puts it into spaced recall: it returns at 2, 7, 21, 60 and
120 days. Solid recall pushes the interval out; forgetting resets it. Due
recalls appear on the Dashboard ahead of new material, because relearning what
is fading beats covering more ground. See **Method** and **Recall** in the app.

---

## Verifying this record

The platform keeps an append-only log of every completed lecture, examination,
gate and sealed week. Each entry commits to the one before it:

    hash = sha256(canonical_json({ i, ts, type, ref, data, prev }))
    prev = the previous entry's hash   (first entry: "brickford-genesis")

Edit, insert or delete any past entry and every hash after it stops matching.
**The Record** page shows the current verdict and exports the whole log.

To check an exported `brickford-record-*.json` yourself, without trusting this
code: every entry ships the exact bytes that were hashed, so

    printf '%s' "<preimage>" | shasum -a 256

must reproduce that entry's `hash`, and each `prev` must equal the previous
entry's `hash`.

**What this does and does not prove.** The chain proves the log has not been
edited since it was written. It does not, by itself, prove *when* anything
happened — the timestamps are self-reported. That is what the anchors are for:
publishing a head hash somewhere with its own independent timestamp (a commit
in this repo, a public post) pins the whole history before it to that date,
because the hash could not have been computed from a log that did not yet
exist. Anchor often; each one hardens everything before it. The strongest
evidence remains the external artifacts themselves — repositories, commits,
pull requests, published posts — which carry timestamps nobody here controls.

---

## 5. Weekly Rhythm starts immediately

Every Sunday: fill one row in [progress-log.md](progress-log.md). A week with no shipped artifact = failed week, regardless of hours "studied."

---

**When all boxes above are done → Phase 1 begins: Karpathy Zero to Hero video 1 (micrograd), NeetCode arrays, fast.ai lesson 1.** Full roadmap lives at `C:\Users\user\.claude\plans\we-are-building-a-synthetic-falcon.md`.
