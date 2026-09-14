# Phase 2 is blocked: no YouTube access from this environment

Recorded so it is not re-discovered. Every line below is a command that was run and
what it returned, on 2026-09-12/14.

## What was tried

**1. `yt-dlp`, the method the brief specifies.** Installed fine (`yt-dlp-2026.8.19`).
Then:

```
$ yt-dlp "ytsearch3:joke structure setup punchline lesson" --flat-playlist --dump-json
ERROR: Unable to download API page: ('Unable to connect to proxy',
OSError('Tunnel connection failed: 403 Forbidden'))
```

**2. Direct HTTPS.** All five hosts return `000` (no connection):
`www.youtube.com`, `youtube.com`, `m.youtube.com`, `googlevideo.com`, `www.google.com`.

**3. The proxy's own diagnostics** name the reason explicitly:

```
host: www.youtube.com:443
kind: connect_rejected
detail: gateway answered 403 to CONNECT (policy denial or upstream failure)
```

This is the session's organisation egress policy. The environment's own README is
unambiguous about what to do:

> ### 403 / 407 from the proxy
> The destination host is not allowed by your organization's egress policy for this
> session. **Do not retry or route around it — report the blocked host.**

So I did not try mirrors, Invidious/Piped front-ends, or any other bypass. Routing
around an org egress policy is not a workaround, it is the thing the policy exists to
stop.

**4. `WebFetch` on YouTube.** Same wall, stated more plainly:
`{"error_type":"EGRESS_BLOCKED","domain":"www.youtube.com"}`

**5. The transcript MCP servers.** `Yt_T` and `Youtube_Transcribt` were connected at the
start of this session and **worked** — one real transcript was pulled end to end
(Matthew Dicks, *Homework for Life*, TEDxBerkshires, `x7p329Z8MD0`: 17:31, 10,233 words,
auto-generated English). Both servers were then **removed from the session
configuration** mid-flight. A tool search for any replacement returns nothing.

## What still works

`WebSearch` — returns real YouTube titles, URLs and channel names. Verified against two
seed queries from the brief; results included live video URLs.

## What this does to each phase

| phase | status |
|---|---|
| 0 platform notes | ✅ unaffected, delivered |
| 1 taxonomy | ✅ unaffected |
| 2 harvest, 400+ candidates via `yt-dlp` | ⛔ the specified mechanism is dead. `WebSearch` can substitute at maybe 20–40% of the yield and **cannot** produce `channel_subs`, `published`, view counts, or channel catalogue enumeration |
| 3 verify against transcript | ⛔ **hard blocked.** No transcript access of any kind |
| 4 sequence into tiers | ⚠️ possible, but tiering unverified videos means ranking titles, which is what the brief forbids |
| 5 mechanic + drill per lesson | ⛔ derived from transcripts |
| 6 install | ⚠️ mechanically fine; there is just nothing verified to install |
| 7 practice layer | ✅ unaffected — it is reps, not videos |

## The rules this would force me to break

From the brief, verbatim:

- *"Never put a video in the curriculum without reading its transcript. Titles lie."*
- *"Never invent a channel, video, URL or view count."*
- *"Every core-path lesson has a verified URL, a stored transcript, a stated mechanic and
  a same-day drill."*

Phases 2–6 cannot be completed without breaking the first and third of those. Building a
curriculum out of search-result titles would look like a delivered mission and would be
exactly the failure the brief was written to prevent — so it is not on the table.

## Ways forward, in order of how good they are

1. **Get `youtube.com` and `youtube-transcript`-style hosts onto the egress allowlist**
   for this environment, or re-add the `Yt T` MCP server. Then the brief runs as written.
2. **Ali runs the harvest locally.** `yt-dlp` on his own machine, the exact commands from
   the brief, output pushed as `data/storytelling/candidates.jsonl` plus
   `transcripts/<id>.vtt`. I take it from Phase 3 and everything else proceeds unchanged.
   This is the fastest unblock and needs nothing from anyone else.
3. **Deliver the unblocked parts now** — Phase 0, Phase 1, and the whole of Phase 7,
   which is the part that actually changes how well he tells a story — and hold 2–6.

---

## Update, 14 Sep 2026: transcripts are back, search is not

The `Yt T` MCP server reconnected mid-session and works again — verified by
pulling a second full transcript end to end (*How To Think Faster And Talk
Smarter | With Stanford Lecturer*, `jw_-OSxk36U`, 39:15, 22,592 words), now
stored alongside the first.

This changes the split, but **it does not unblock Phase 2**:

| capability | state |
|---|---|
| `yt-dlp` search + channel enumeration | ⛔ still 403 by egress policy |
| YouTube metadata (subs, views, upload date) | ⛔ still unreachable |
| **Transcript fetch, one video at a time** | ✅ **working again** |
| `WebSearch` for discovery | ✅ working |

So the hard rule — *never install a video without reading its transcript* — is
satisfiable again, for any video whose id is already known. What is still
missing is **discovery at scale**: `WebSearch` surfaces maybe 20–40% of what 80
`ytsearch40:` queries would, and cannot enumerate a channel's catalogue at all.

Two consequences worth stating plainly:

1. **The local harvest is still the right path.** It is the only route to the
   400+ pool the brief asks for, and to the redundancy penalty meaning anything
   — you cannot drop a video for teaching a mechanic already covered if you only
   ever found three videos on that mechanic.
2. **Stage 4 may now be redundant.** If the MCP holds, transcripts can be pulled
   here from the ids the harvest finds, so the local run could stop after stage
   3. Worth deciding before a multi-hour stage 4 — but the MCP has already
   disconnected once this session, so the local copy is the durable one.

Note the MCP transcripts arrive as rolling auto-captions with each phrase
repeated up to three times. Both stored files are de-duplicated on the way in;
the raw form is roughly 50% padding and would wreck any scoring that counts
minutes-per-mechanic.
