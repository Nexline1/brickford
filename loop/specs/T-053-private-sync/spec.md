# T-053: Progress sync moves to a private repo

## Why
Owner, 2026-10-23: "Go: also move my progress sync to the private repo".

Sync currently writes `progress/brickford-state.json` to the PUBLIC repo `Nexline1/brickford`. Anyone can read the owner's progress there, including notes, recall text and the ledger. The app repo stays public, because GitHub Pages on the free plan needs that.

## What
1. A constant `PRIVATE_REPO = "Nexline1/brickford-private"`. `SYNC_REPO` becomes `PRIVATE_REPO`, and the path stays `progress/brickford-state.json`. The owner creates the repo and grants the sync token access to it.
2. **One-time migration, so no device loses data.** The first sync on a device after this ships:
   - pulls the private file;
   - if it is missing (404), reads the OLD public file once, read-only;
   - merges with `mergeState` exactly as an ordinary pull would;
   - pushes the result to the private repo.

   The device records `settings.syncMovedAt` once this is done, and never reads the public file again. The public file is never written again.
3. **Errors name the fix.** A 404 or 403 from the private repo (no such repo, or the token lacks access) shows in the existing sync-error row as "Sync can't reach brickford-private: give your token access to it". It uses the same latch rules as today: automatic pushes stop, while manual pull and push still try.
4. **Nothing else changes.** The token is the same, the merge rules are the same, and the render-is-a-read and background-repaint rules still hold.
5. **Separate owner step, not part of this item:** delete `progress/brickford-state.json` from the public repo's main branch once both devices have synced. History keeps old copies; removing those needs a history rewrite, which is the owner's call.

## Acceptance
- **verify-sync-loop**, with stubbed GitHub:
  - pushes and pulls go only to `repos/Nexline1/brickford-private/contents/progress/brickford-state.json`;
  - the migration reads the public path exactly once and never writes to it;
  - merged state from both is kept;
  - a 403 or 404 shows the new error line and latches automatic push only.
- **Plants that make a gate exit 1:**
  - (a) a push to the public path;
  - (b) the migration skipping the merge, which drops one side's lessons;
  - (c) the public file read again after `syncMovedAt` is set.
- Every gate passes, and the `?v=` tokens are bumped.

## Amendment, 2026-11-07 (owner: "all of my progress went wiped out in DIA ... finalize syncing devices asap")
Cause of the wipe: a new browser has empty localStorage, and nothing was ever synced. `progress/brickford-state.json` does NOT exist in the public repo on any branch or in its history (checked with `git log --all -- progress/brickford-state.json`: empty). So no device has ever completed a push; the real progress lives only in the original browsers/phone.
Consequences for this item:
- **No migration code.** There is no public file to read, so item 2 (the one-time migration from the public file, `syncMovedAt`, plants b and c) is dropped. The new build never reads or writes the public repo. (Re-check `git log --all -- progress/brickford-state.json` before merge: if a public file appeared, stop and tell the owner.)
- `SYNC_REPO` / `defaultRepo` become `Nexline1/brickford-private`, in BOTH the web app (platform/js/app.js) and the Flutter app (app/lib/state/sync.dart). Same path, same merge rules, same token, same latch rules.
- **404 means two things on a private repo.** GitHub answers 404 (not 403) for a private repo a fine-grained token has no access to, and also 404 for a file that does not exist yet. The app must tell them apart: on a 404 from the file, ask GET /repos/{repo}; a 404 there means "Sync can't reach brickford-private: give your token access to it" (shown in the existing sync-error row, same latch: automatic pushes stop, manual Pull/Push always run and a success lifts the latch); a 200 means the file is simply missing (first push creates it).
- **A new device restores from the file.** Acceptance adds: a fresh empty device with a token pulls a stub remote that holds lessons, studyDays, settings.streakFrom and monkStart, and shows them; pushing from a fresh empty device cannot remove anything the remote holds (the merge-before-write rule).
- The two apps' on-screen sync text names the private repo (web: the two lines that say `SYNC_REPO`; Flutter: the Profile/sync screen).
