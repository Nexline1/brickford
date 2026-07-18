# Coding Diagnostic — No AI Allowed

Purpose: measure the real gap between "builder with AI" and "engineer." AI autocomplete, ChatGPT, Claude — all OFF. Documentation and official docs sites are ALLOWED (that's real engineering). Google for syntax is allowed; copying solutions is not.

## Part 1 — Build (one sitting, max 4 hours, Python)

Build a **command-line flashcard trainer** from scratch:

1. Reads a `cards.json` file of question/answer pairs (create 10 sample cards yourself — use Stat 110 concepts, two birds one stone).
2. Quizzes the user in random order; user types an answer, program shows correct answer, user self-grades (y/n).
3. Implements **spaced repetition**: cards answered wrong reappear sooner. Simple version: keep a per-card score; wrong → score 0, right → score +1; each round, draw cards with probability weighted by (3 − score, min 1).
4. Saves progress to disk so quitting and restarting continues where you left off.
5. Handles bad input without crashing (missing file, malformed JSON, Ctrl+C mid-session saves cleanly).

**Grading yourself:**
- Finished all 5 requirements in ≤4 h → strong; Phase 1 coding block can be lighter.
- Finished 1–3, or needed >4 h → normal for your background; Phase 1 runs the full 1 h/day fundamentals block.
- Couldn't finish 1–2 without wanting AI → important data, not failure; fundamentals block becomes 1.5 h/day for the first two months.

## Part 2 — Algorithms (one sitting, ~2 hours)

On [NeetCode](https://neetcode.io/practice) (roadmap → Arrays & Hashing + Two Pointers), solve these 10, in Python, no AI:

1. Contains Duplicate
2. Valid Anagram
3. Two Sum
4. Group Anagrams
5. Top K Frequent Elements
6. Product of Array Except Self
7. Valid Palindrome
8. Two Sum II (sorted)
9. 3Sum
10. Best Time to Buy and Sell Stock

| # solved unaided | Verdict |
|---|---|
| 8–10 | Ahead of expectation — accelerate DSA pace |
| 5–7 | On track — standard NeetCode plan (150 by month 6) |
| 0–4 | Expected for AI-native builder — start with easy tier, no shame, just reps |

## Deliverable

Push the flashcard project to GitHub as your first repo (`flashcards-cli`), with a README explaining the spaced-repetition logic. That's simultaneously your diagnostic, your first portfolio piece, and your first public artifact. Record results in [progress-log.md](progress-log.md).
