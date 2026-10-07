# T-027: Treasury, a workspace for running the business

Source: owner, 2026-10-07: "that is more of a place where I can manage my business from. Imagine Notion, something like that. I want to make sure that every part of my business, my finance, all of that is being recorded in there."

The owner approved `loop/design/specimen-treasury.png` ("Yes, build this").

## Problem
- **The page.** `V.treasury` is a niche picker, one offer textarea, a 2-client form and an income-only ledger. There are no projects, no expenses, no notes, no pipeline stages, and no way to edit or delete most entries.
- **A sync bug (found while specifying this).** `syncPayload` pushes `treasury`, but `mergeState` never reads it. A pull does not bring another device's treasury in. Because a push merges first and then writes local state, the device that pushes last overwrites the other device's treasury edits on the remote. Business records can be lost across devices.

## Data
All under `S.treasury`. It is backward compatible: existing `niche`, `offer`, `clients` and `entries` carry over through a load-time normalisation that is NOT a write. A render is a read, and the normalised shape persists on the next ordinary save.

Every record gets `id` (a random string) and `updated` (an ISO timestamp), plus `deleted: true` for a delete (a tombstone, so a delete survives a merge).

| Collection | Fields |
|---|---|
| `clients` | `{id, name, stage: "lead" \| "pitched" \| "active" \| "done", contact, note, updated}` |
| `projects` | `{id, clientId?, title, price, status: "open" \| "done", due?, updated}` |
| `money` | `{id, date, amount, kind: "in" \| "out", note, clientId?, updated}` |
| `notes` | `{id, title, body, updated}` |

`niche` and `offer` stay as they are. `offer` becomes the pinned note "The one offer" in Notes.

**Migration:**
- old `clients[i]` becomes a client in stage `active`, plus a project carrying its project and price;
- old `entries[i]` becomes `money` with `kind "in"`;
- ids are deterministic from the content (a hash of the JSON), so two devices migrating the same old data produce the same ids.

## Sync (fixes the bug)
1. `mergeState` merges `treasury`. Each collection is a union by `id`, and for the same `id` the larger `updated` wins (tombstones included). `niche` and `offer` use the later of their own `updated`, stored as `nicheUpdated` and `offerUpdated`. The `changed` count includes treasury changes.
2. `syncPayload` keeps sending `treasury` whole, tombstones included.

## Page (`V.treasury`)
3. **Header.**
   - `h1` "Treasury", then "Your business, in one place: clients, work, money, notes."
   - A "＋ New" primary at the right opens a small menu: Client, Project, Money in, Money out, Note.
   - Each opens an inline sheet or dialog form. Esc or Cancel closes it. Saving calls `save()` once.
4. **Segmented control: Overview · Clients · Projects · Money · Notes.** It is in memory only.
5. **Overview:**
   - Four tiles: BHD in this month, BHD out this month, net (good/bad colour), and active clients with "max 2" while that rule exists.
   - **Pipeline:** four lanes (Lead, Pitched, Active, Done), each with a count, and client cards showing name and a meta line.
     - Cards move between lanes by drag (pointer events). As a keyboard and phone fallback, a card has a stage menu with "Move to …" options.
     - Each move updates `stage` and `updated`, and calls `save()` once.
     - Moving a third client into Active asks for confirmation, keeping today's cap prompt.
   - **Money (latest 5)** and **Notes (latest 3)** cards, side by side at 1024px and up, stacked below.
6. **Clients, Projects, Money:** a table-like list for each.
   - Click a row to edit it inline. Each row can be deleted (tombstone) after a confirm.
   - Money has a month filter and in/out totals.
7. **Notes:** a list of note cards. A note opens a simple editor (title plus body textarea, saved on blur or Done). "The one offer" is pinned at the top.
8. **The niche picker** moves behind a disclosure, "Niche: <current> ▸", on Overview. Its contents and behaviour are unchanged.
9. **Week's "BHD earned" tile (T-026c)** reads `money` `kind "in"` for that week. The existing `revenueTotal()` reads `money` (`in` minus nothing, as today: income only) so its meaning stays the same.
10. **Also:** tokens only; contrast 4.5:1 or better; controls 44px or more; the phone layout stacks (lanes scroll horizontally, using scroll-snap). Bump every `?v=` token.

## Out of scope
- Invoices as PDFs, currencies other than BHD, attachments, and rich text.
- New dependencies.
- PROTECTED paths.

## Acceptance criteria
1. **verify-sync-loop, new cases:**
   - (i) Two devices each add a different client and a money entry, then each pulls. Both end with both records, and the pushed body contains both.
   - (ii) The same record is edited on both devices; the later `updated` wins on both.
   - (iii) A delete on A survives a pull of B's older copy, through the tombstone.
   - (iv) Old-shape treasury (`clients`, `entries`) on both devices migrates to identical ids, so nothing is duplicated after a merge.
   - (v) A render writes nothing: opening /treasury does not increase the writes.
2. **verify-flows:**
   - add a client and drag it Lead → Pitched → Active, so the stage persists after a reload;
   - the keyboard "Move to" works;
   - add money in and money out, and check the Overview tiles show the right sums for the month;
   - add, edit and delete a note;
   - the third-active confirm appears.
3. **verify-design, 1440 and 390, both themes:**
   - 4 tiles, 4 lanes and the 5-option control;
   - "＋ New" is the only primary;
   - lanes scroll horizontally on phone with no clipping, and the clip baseline only shrinks.
4. **Plants, each exiting 1:**
   - (a) `mergeState` skips treasury again;
   - (b) a delete without a tombstone;
   - (c) migration ids that are not deterministic;
   - (d) a stage change that does not save;
   - (e) net computed as in + out.
5. **All gates green.** Screenshots at 1440 and 390, in Dark and Light, of Overview, Money and a note open.
