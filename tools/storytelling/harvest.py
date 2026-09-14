#!/usr/bin/env python3
"""
Brickford storytelling — Phase 2 harvest.

Runs on YOUR machine, because this build environment cannot reach youtube.com
(egress policy 403 — see docs/storytelling/00-harvest-blocker.md).

    pip install -U yt-dlp
    python3 tools/storytelling/harvest.py

Four stages, each writing to disk before the next starts. Kill it with Ctrl-C at
any point and run it again — it picks up exactly where it stopped. Nothing is
re-fetched.

    1  search      80 seed queries        -> data/storytelling/raw/q_*.jsonl
    2  channels     6 channel catalogues  -> data/storytelling/raw/c_*.jsonl
    3  merge        dedupe by video id    -> data/storytelling/candidates.jsonl
    4  transcripts  captions only         -> data/storytelling/transcripts/<id>.vtt

No video or audio is ever downloaded: stage 4 passes --skip-download and asks
only for subtitle tracks.

Anything that fails is written to data/storytelling/misses.jsonl with the
reason. A query that returns nothing is a recorded miss, not a silent gap.
"""
import json, os, subprocess, sys, time, hashlib, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, "data", "storytelling")
RAW = os.path.join(DATA, "raw")
TRANS = os.path.join(DATA, "transcripts")
QUERIES = os.path.join(ROOT, "tools", "storytelling", "queries.json")
CANDIDATES = os.path.join(DATA, "candidates.jsonl")
MISSES = os.path.join(DATA, "misses.jsonl")

PER_QUERY = 40          # ytsearch40, per the brief
PER_CHANNEL = 120       # cap channel catalogue pulls
SLEEP = 1.5             # be polite; raise if you start seeing 429s


def log(msg):
    print(msg, flush=True)


def miss(kind, target, reason):
    with open(MISSES, "a", encoding="utf-8") as f:
        f.write(json.dumps({"kind": kind, "target": target, "reason": reason[:400],
                            "at": time.strftime("%Y-%m-%d %H:%M")}, ensure_ascii=False) + "\n")


def run(args, timeout=300):
    """yt-dlp, returning (ok, stdout, stderr). Never raises."""
    try:
        p = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
        return p.returncode == 0, p.stdout, p.stderr
    except subprocess.TimeoutExpired:
        return False, "", "timeout after %ds" % timeout
    except FileNotFoundError:
        log("yt-dlp not found. Run:  pip install -U yt-dlp")
        sys.exit(1)


def slug(s):
    return hashlib.sha1(s.encode("utf-8")).hexdigest()[:12]


# ---------------------------------------------------------------- stage 1 + 2
def fetch_listing(kind, key, target, n):
    """One search or one channel. Cached on disk; returns list of raw dicts."""
    path = os.path.join(RAW, "%s_%s.jsonl" % (kind, key))
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return [json.loads(l) for l in f if l.strip()]

    spec = "ytsearch%d:%s" % (n, target) if kind == "q" else target
    ok, out, err = run(["yt-dlp", spec, "--flat-playlist", "--dump-json",
                        "--no-warnings", "--ignore-errors",
                        "--playlist-end", str(n)])
    rows = []
    for line in out.splitlines():
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            continue

    if not rows:
        why = err.strip() or "returned no results"
        miss("search" if kind == "q" else "channel", target, why)
        log("    MISS  %s" % (why.splitlines()[-1][:110]))
        # Cache an empty result ONLY when yt-dlp actually succeeded and the query
        # genuinely has no hits. A network error, a 403 or a rate-limit must NOT
        # be cached, or the next run skips it as "done" and the query is lost for
        # good. Found by running this against a blocked proxy: all 80 queries
        # cached empty and the re-run reported every one of them as cached.
        if not ok:
            time.sleep(SLEEP)
            return []

    tmp = path + ".part"
    with open(tmp, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    os.replace(tmp, path)          # atomic: a killed run never leaves a half file
    time.sleep(SLEEP)
    return rows


def stage_listings(seeds):
    qs, chs = seeds["queries"], seeds["channels"]
    log("\n=== stage 1: %d search queries ===" % len(qs))
    for i, q in enumerate(qs, 1):
        key = slug(q["q"])
        cached = os.path.exists(os.path.join(RAW, "q_%s.jsonl" % key))
        log("[%2d/%d] %s%s" % (i, len(qs), q["q"][:66], "  (cached)" if cached else ""))
        fetch_listing("q", key, q["q"], PER_QUERY)

    log("\n=== stage 2: %d channel catalogues ===" % len(chs))
    for i, c in enumerate(chs, 1):
        key = slug(c["url"])
        cached = os.path.exists(os.path.join(RAW, "c_%s.jsonl" % key))
        log("[%d/%d] %s%s" % (i, len(chs), c["url"], "  (cached)" if cached else ""))
        fetch_listing("c", key, c["url"], PER_CHANNEL)


# ------------------------------------------------------------------- stage 3
def norm(r, module, lang, found_via):
    """yt-dlp row -> the brief's candidate schema. Missing stays null, never guessed."""
    vid = r.get("id")
    if not vid or len(vid) != 11:
        return None
    dur = r.get("duration")
    return {
        "id": vid,
        "url": "https://www.youtube.com/watch?v=" + vid,
        "title": r.get("title") or "",
        "channel": r.get("channel") or r.get("uploader") or "",
        # flat-playlist does not carry follower counts or upload dates. Stage 5
        # (--enrich) fills these for shortlisted videos. Null until then.
        "channel_subs": r.get("channel_follower_count"),
        "published": r.get("upload_date"),
        "duration_min": round(dur / 60.0, 1) if isinstance(dur, (int, float)) and dur else 0,
        "language": lang,
        "module": module,
        "found_via": found_via,
        "has_transcript": None,
        "status": "candidate",
        "view_count": r.get("view_count"),
    }


def stage_merge(seeds):
    log("\n=== stage 3: merge and dedupe ===")
    seen, rows = {}, []
    # Existing file wins on dedupe, so a re-run never loses a hand-edited record.
    if os.path.exists(CANDIDATES):
        with open(CANDIDATES, encoding="utf-8") as f:
            for l in f:
                if l.strip():
                    c = json.loads(l)
                    seen[c["id"]] = c
                    rows.append(c)
    pre = len(rows)

    srcs = ([("q", slug(q["q"]), q["module"], q["lang"], q["q"]) for q in seeds["queries"]] +
            [("c", slug(c["url"]), c["module"], c["lang"], c["url"]) for c in seeds["channels"]])

    for kind, key, module, lang, found_via in srcs:
        path = os.path.join(RAW, "%s_%s.jsonl" % (kind, key))
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as f:
            for l in f:
                if not l.strip():
                    continue
                c = norm(json.loads(l), module, lang, found_via)
                if not c or c["id"] in seen:
                    continue
                seen[c["id"]] = c
                rows.append(c)

    tmp = CANDIDATES + ".part"
    with open(tmp, "w", encoding="utf-8") as f:
        for c in rows:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    os.replace(tmp, CANDIDATES)
    log("    %d candidates (%d new)  -> %s" % (len(rows), len(rows) - pre, CANDIDATES))
    return rows


# ------------------------------------------------------------------- stage 4
def stage_transcripts(rows, limit=None):
    todo = [c for c in rows if not any(
        os.path.exists(os.path.join(TRANS, "%s.%s.vtt" % (c["id"], lg)))
        for lg in ("en", "ar", "en-orig", "en-US", "en-GB"))]
    if limit:
        todo = todo[:limit]
    log("\n=== stage 4: transcripts for %d candidates (%d already on disk) ==="
        % (len(todo), len(rows) - len(todo)))

    for i, c in enumerate(todo, 1):
        marker = os.path.join(TRANS, "%s.none" % c["id"])
        if os.path.exists(marker):        # known to have no captions; don't re-ask
            continue
        ok, out, err = run(["yt-dlp", c["url"],
                            "--write-auto-subs", "--write-subs",
                            "--sub-langs", "en.*,ar.*",
                            "--skip-download", "--sub-format", "vtt",
                            "--no-warnings", "--ignore-errors",
                            "-o", os.path.join(TRANS, "%(id)s")], timeout=180)
        got = [f for f in os.listdir(TRANS) if f.startswith(c["id"]) and f.endswith(".vtt")]
        if got:
            log("[%3d/%d] ok    %s  %s" % (i, len(todo), c["id"], c["title"][:52]))
        else:
            miss("transcript", c["url"], err.strip() or "no caption track")
            # Same rule as the search cache: only remember "this video has no
            # captions" when yt-dlp succeeded. Otherwise a blip would blacklist
            # a perfectly good video from every future run.
            if ok:
                open(marker, "w").close()
                log("[%3d/%d] NONE  %s  %s" % (i, len(todo), c["id"], c["title"][:52]))
            else:
                log("[%3d/%d] FAIL  %s  (will retry next run)" % (i, len(todo), c["id"]))
        time.sleep(SLEEP)

    # Record what we learned, so Phase 3 can filter on it.
    for c in rows:
        c["has_transcript"] = bool([f for f in os.listdir(TRANS)
                                    if f.startswith(c["id"]) and f.endswith(".vtt")])
    tmp = CANDIDATES + ".part"
    with open(tmp, "w", encoding="utf-8") as f:
        for c in rows:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    os.replace(tmp, CANDIDATES)


# ------------------------------------------------------------------- stage 5
def stage_enrich(rows):
    """Full metadata (subs, upload date) for candidates that have a transcript.
    Slow, so it is opt-in and only runs on the pool Phase 3 will actually score."""
    todo = [c for c in rows if c.get("has_transcript") and c.get("channel_subs") is None]
    log("\n=== stage 5: enrich %d transcripted candidates ===" % len(todo))
    for i, c in enumerate(todo, 1):
        ok, out, _ = run(["yt-dlp", c["url"], "--dump-json", "--skip-download",
                          "--no-warnings"], timeout=120)
        if ok and out.strip().startswith("{"):
            d = json.loads(out.strip().splitlines()[0])
            c["channel_subs"] = d.get("channel_follower_count")
            c["published"] = d.get("upload_date")
            c["view_count"] = d.get("view_count")
            if d.get("duration"):
                c["duration_min"] = round(d["duration"] / 60.0, 1)
        log("[%3d/%d] %s" % (i, len(todo), c["id"]))
        time.sleep(SLEEP)
    tmp = CANDIDATES + ".part"
    with open(tmp, "w", encoding="utf-8") as f:
        for c in rows:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    os.replace(tmp, CANDIDATES)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", choices=["listings", "merge", "transcripts", "enrich", "all"],
                    default="all")
    ap.add_argument("--limit", type=int, help="cap transcripts this run (for a quick trial)")
    a = ap.parse_args()

    for d in (RAW, TRANS):
        os.makedirs(d, exist_ok=True)
    seeds = json.load(open(QUERIES, encoding="utf-8"))

    if a.stage in ("listings", "all"):
        stage_listings(seeds)
    rows = stage_merge(seeds) if a.stage in ("merge", "transcripts", "enrich", "all") else []
    if a.stage in ("transcripts", "all"):
        stage_transcripts(rows, a.limit)
    if a.stage == "enrich":
        stage_enrich(rows)

    n_t = sum(1 for c in rows if c.get("has_transcript"))
    log("\n" + "=" * 58)
    log("  candidates : %d" % len(rows))
    log("  transcripts: %d" % n_t)
    log("  target     : 400+ candidates before cutting (the brief)")
    log("=" * 58)
    log("\nCommit data/storytelling/ and push. Phase 3 picks up from there.")


if __name__ == "__main__":
    main()
