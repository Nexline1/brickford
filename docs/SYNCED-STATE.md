# The synced state: what an outside reader can rely on

The app pushes one file, `progress/brickford-state.json` in `Nexline1/brickford-private`
(`syncPayload` in `platform/js/app.js`, ported in `app/lib/engine/merge.dart`). Anything that reads
that file without running the app (the life-loop tracker, a script) may rely on the fields below
and on nothing else. Every other field in the file can change shape without notice.

**The rule: a change to any field listed here updates this file and verify-logic's contract check
in the same PR.** The check (`tools/verify-logic.js`, "T-074 contract") reads the table below,
builds a real payload and fails when a listed field is missing or does not have the stated format.
A row is one field: a path, then its format in backticks. Keep that shape; the check parses it.

## The file

```
{ "v": 1, "updatedAt": "<ISO timestamp>", "device": "<deviceId>",
  "state": { "lessons": { "<lessonKey>": { ... } }, "studyDays": [ ... ], ... },
  "ledgers": { "<deviceId>": [ { "ts", "type", "ref", "data", ... } ] } }
```

A lesson key is `<courseId>.<unitIndex>.<lessonIndex>`, for example `math110.0.3`. Keys are
append-only (`data/curriculum-ledger.json`), so a key never changes meaning.

## Formats

- `bool`: `true` or `false`.
- `date`: `YYYY-MM-DD`, the device's local date.
- `datetime`: an ISO 8601 UTC timestamp, `YYYY-MM-DDTHH:MM:SS.sssZ`.
- `date|datetime`: either of the two. Compare on the date part (`slice(0, 10)`).
- `string`, `object`: a JSON string, a JSON object.

## The fields

| Field | Format | Written | Merge (two devices) |
|---|---|---|---|
| `state.lessons.*.done` | `bool` | Mark watched sets it true, unmark sets it false. | The further-along copy of the lesson wins (proven, then watched, then notes). |
| `state.lessons.*.doneAt` | `date` | On every mark watched: the day of the latest watch. Deleted on unmark. | When both sides are watched, the earlier date. |
| `state.lessons.*.firstDoneAt` | `date\|datetime` | Once, on the first mark watched (since T-074), and never changed after. | The earlier date part wins; on the same day a full timestamp beats a date-only value. |
| `state.lessons.*.scheduledFor` | `date` | Once, the first study day the plan gave the lecture, and never changed after. | The earlier date wins; a value on one side fills a missing one. |
| `state.studyDays[]` | `date` | "Mark today's Deep Track done": the sealed days. | Union. |
| `ledgers.*[].ts` | `datetime` | Every event the record chains (logEvent). | Each device's ledger is its own; nothing is merged into another device's. |
| `ledgers.*[].type` | `string` | The event's kind: `lesson`, `quiz`, `verified`, `day`, `problem`, ... | As above. |
| `ledgers.*[].ref` | `string` | What it is about; for `lesson`, `quiz` and `verified`, the lesson key. | As above. |
| `ledgers.*[].data` | `object` | The event's details; for `lesson`, `{ "done": true }` or `{ "done": false }`. | As above. |

### `firstDoneAt`, and the date-only values

From T-074 on, the first mark watched writes a full timestamp (`2026-11-25T12:00:00.000Z`).
Before it, `firstDoneAt` was written only by an unmark, as a date (`2026-10-20`), and most watched
lessons had none. On its first start after T-074 each device gives every watched lesson without
one `firstDoneAt = doneAt` (a date). Existing values are kept exactly as they are. So a reader
sees both formats for good: treat `firstDoneAt` as a date unless it has a `T`, and compare on the
date part.

The timestamp is UTC; `doneAt` and `scheduledFor` are the device's local date. Near midnight the
date part of `firstDoneAt` can be one day off the local date. For lateness that is the reader's
call; the app itself only ever compares `firstDoneAt` on its date part (the quiz gate's
grandfathering).

### `scheduledFor`

Each device walks the study days from the later of the start date and its first activity, up to
and including today, at start-up and on the first screen drawn after the date changes. For every
lecture the plan puts on that day that is not optional, and that Plan v2 does not schedule again
later (a v1 lecture v2 re-schedules is not owed on its v1 day), it writes `scheduledFor` if the
lesson has none. The first date that owns the lecture wins. Saturdays schedule nothing, so no
`scheduledFor` is ever a Saturday. Past days never move in the plan, so a device that starts late
backfills the true dates. Working ahead moves only future days, which are not frozen until they
arrive, so it never changes a stored `scheduledFor`.

Drawing a screen never writes storage or arms a push, so a newly frozen date (and a backfilled
`firstDoneAt`) reaches the file with the device's next ordinary save and the push after it, not at
the moment it is frozen. Until then every start re-derives the same values.

A lesson entry may hold only `scheduledFor` (a lecture that was due and not watched yet).

## Lateness is the reader's job

The app stores when a lecture was due and when it was first watched, and computes nothing from
the two. A reader works out lateness as

```
late_days = date(firstDoneAt) - scheduledFor      (date parts, in days)
```

`0` or less is on time; a lesson with `scheduledFor` and no `firstDoneAt` is not watched yet. A
lesson with no `scheduledFor` was never due on a day this device has seen (it was watched ahead, or
it is optional).

## Planned

- **`mood` event** (T-076, planned, not shipped): a ledger event `type: "mood"`, one tap, four
  slots a day. Its `ref` and `data` are defined when T-076 ships, and they join the table above then.
