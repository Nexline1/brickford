# Phase 2 — how to run the harvest

Ten minutes of your attention, then it runs on its own for a few hours.

## Why you and not me

`youtube.com` is 403 by this environment's egress policy, and both transcript MCP
servers were removed mid-session. Full evidence in `00-harvest-blocker.md`. You picked
the local-run route, which is the fastest unblock and the one that depends on nobody
else.

## Run it

```bash
cd path/to/brickford
git pull
pip install -U yt-dlp
python3 tools/storytelling/harvest.py
```

That's it. **Ctrl-C whenever you like** — every stage writes to disk before the next
starts and nothing is re-fetched on a restart. Leaving it overnight is fine.

Expect roughly 2–5 hours end to end, almost all of it stage 4. Stage 1 is ~80 searches
at ~1.5s apart plus fetch time; stage 4 is one caption fetch per candidate.

### What it does

| stage | what | writes |
|---|---|---|
| 1 | 80 seed queries at `ytsearch40:` — 66 English, 8 Arabic, 6 named-channel | `data/storytelling/raw/q_*.jsonl` |
| 2 | 6 channel catalogues, up to 120 videos each | `raw/c_*.jsonl` |
| 3 | merge, dedupe by video id, normalise to the brief's schema | `candidates.jsonl` |
| 4 | captions only, `--skip-download` | `transcripts/<id>.*.vtt` |

**No video or audio is ever downloaded.** Stage 4 passes `--skip-download` and requests
subtitle tracks only.

### If you want to sanity-check it first

```bash
python3 tools/storytelling/harvest.py --stage listings   # searches only, ~10 min
python3 tools/storytelling/harvest.py --stage merge      # see the candidate count
python3 tools/storytelling/harvest.py --stage transcripts --limit 20
```

If the candidate count after `merge` is well under 400, tell me and I'll widen the query
set before you spend hours on stage 4.

### Optional, after the rest finishes

```bash
python3 tools/storytelling/harvest.py --stage enrich
```

Fills `channel_subs`, `published` and `view_count` — but **only** for candidates that
actually have a transcript, since those are the only ones Phase 3 will score. It's slow
(one full metadata call per video) and Phase 3 works without it; subscriber counts are a
weak credibility signal next to what the transcript says. Skip it unless you're curious.

## Then

```bash
git add data/storytelling && git commit -m "Phase 2 harvest" && git push
```

Tell me it's pushed and I pick up at Phase 3: read every transcript, score on the six
axes, apply the redundancy penalty, and write `scored.jsonl` + `rejections.md`.

## What the output looks like

`candidates.jsonl`, one JSON object per line, append-only, deduped by video id:

```json
{"id":"x7p329Z8MD0","url":"https://www.youtube.com/watch?v=x7p329Z8MD0",
 "title":"Homework for Life | Matthew Dicks | TEDxBerkshires","channel":"TEDx Talks",
 "channel_subs":null,"published":null,"duration_min":17.5,"language":"en",
 "module":"A2","found_via":"...","has_transcript":true,"status":"candidate"}
```

`channel_subs` and `published` are **null** rather than guessed — `--flat-playlist` does
not carry them, and inventing a number was off the table. `--stage enrich` fills them
properly if you want them.

`module` is the query's module. It is a **provisional filing, not a verdict** — Phase 3
re-files each video on what its transcript actually teaches, which is the whole reason
the brief says titles lie.

## Two things that may bite

**Rate limiting.** If you start seeing `429` or empty results partway through, raise
`SLEEP` at the top of `harvest.py` from `1.5` to `4` and re-run. It resumes, so you lose
nothing.

**Bot checks.** YouTube sometimes asks a datacentre IP to prove it is a browser. On a
home connection this is rare. If it happens, `yt-dlp --cookies-from-browser chrome`
is the documented fix — add it to the `run()` calls in the script and re-run.

## The seed list is a starting point, not an authority

`tools/storytelling/queries.json` holds all 80. The brief's named channels are in there
as seeds and **the script records a miss if one doesn't resolve** rather than assuming
it exists. If you already know a teacher worth adding, put them in that file before you
run it — one line each, no code change needed.
