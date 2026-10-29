# T-058: changed assertions

## Existing gates

None. No file under `tools/` other than the new `tools/verify-offline.js` was edited, and no
assertion, threshold or baseline entry in any existing gate was changed, skipped or loosened.
`tools/verify-clip.baseline.json` is untouched. This still holds after origin/main (T-061, #27) was
merged in: `git diff origin/main -- tools/` shows `tools/verify-offline.js` alone. T-061's changes to
verify-logic, verify-flows, verify-sync-loop and verify-design arrived through the merge byte for
byte. They are recorded in T-061's own changed-assertions.md.

Markup the existing gates can see changed in two places, with identical text online:
- the dashboard's sync row: its `g-t` and `g-v` gained `data-sync-t` / `data-sync-v`. Online they read
  exactly what they read before ("Synced", then "failing" or the age).
- the /sync head: gained `data-sync-head`. Online it reads exactly what it read before ("Connected",
  "Connected, but failing" or "Not connected").

The other two changes appear only offline, and no existing gate runs offline: the lesson's
`.video-off` panel, and the Handbook's new "On your phone" group. That group is visible online and
is measured by verify-clip, verify-contrast and verify-shell on /guide as before.

## The new gate's own checks, revised during the build (before it was first committed green)

Each revision was made because the check measured the wrong thing. None was made to turn a failure
into a pass without a cause.

1. **Update: "B's worker is in charge ... A's is gone".** The first draft waited for the page's
   controller to be B. A controller switches to the new worker when its activation *starts*: the
   spec moves the clients before the `activate` event runs, and the old caches are deleted inside
   that event. A trace (worker-side `caches.keys()`) showed A's cache present at the controller
   switch and gone 2s later. The wait is now `controller.state === "activated"` for the right
   script URL. The assertion itself (B's cache present, A's absent, the files cache present) is
   unchanged, and the old-caches-kept plant still fails it.
2. **The PDF tile: "opens its revision PDF offline, in its own tab".** The first draft listened for
   the download only on the new tab. Chromium reports it on the opener too, sometimes before the
   new tab's `page` event. It now listens on both from before the click, and "in its own tab" is
   proven separately (the context's page count grew). The bytes are still compared to the file on
   disk.
3. **KaTeX.** The first draft required `.katex > 0` on `/lesson/math110/0/0` and
   `/concept/la-eigen`. The concept page draws no `$…$` until a check starts (its math is in the
   check questions), so that fixture could not fail for the reason the check names. The check now
   holds every shell route to its online count (same number of `.katex` offline as online, at least
   one route with math) and requires the stand-in stylesheet's `KaTeX_Main` on a typeset element.
   That is stricter than before: 25 routes instead of 2.

## Review round 1: the new gate's checks changed after it was first committed green

Each change below makes a check stricter or adds one. None was removed, and none was loosened to turn
a failure into a pass. Where a row names a plant, that plant exits 1 against the merged head (`plants-run.txt`).

| Check | Was | Now | Why |
|---|---|---|---|
| The worker's scope (install) | `reg.scope === BASE + "/"` and the script URL | Also: `revision/week-01.pdf` starts with `reg.scope` | Fix 6 asked for it to be stated outright. It adds nothing that `reg.scope === BASE + "/"` did not already hold, so it has no plant of its own. |
| The manifest (install) | `start_url` inside `scope` | Also: `id` inside `scope`; `scope` covers `revision/`; `scope` equals the worker's registered scope. Name, short_name, standalone and the icons as before | Fix 6: `scope` went from `./` to `../` so that a PDF opened from the Home Screen app stays in the app's window. The check now pins the scope to exactly the directory the worker answers for, and `id` (unchanged, `/platform/`) to inside it. Plant `scope-platform-only` (scope back to `./`) exits 1. |
| The install block's files cache (fix 2) | Read straight after activation | Waited for first (`filled()`, polled from Node), then read. The assertion is unchanged | Fix 2 moved the filling of the files cache out of `install`, so it is no longer complete at activation by design. The wait has a cause and a bound (30s). A cache that never fills still fails. Plant `fill-in-install` (the fill moved back into install) exits 1 on the stalled-download block. |
| The Home Screen app (new block, fix 6) | (none) | `navigator.standalone` stubbed true with addInitScript (iOS): no revision tile carries a `target`, a click on Week 1 opens no new tab, and offline (`setOffline` plus the server refusing) the download is `/revision/week-01.pdf`, byte-identical to the file. A second context stubs `matchMedia("(display-mode: standalone)")` alone (Android, desktop): no tile carries a `target` | Fix 6. Plant `standalone-new-tab` (the target kept in standalone) exits 1. Emulated: iOS's own half needs a check on the owner's iPhone (spec.md). |
| file:// (fix 7) | Zero registrations from `getRegistrations()` | `ServiceWorkerContainer.prototype.register` is spied with addInitScript; zero calls. The spy must be installed and `navigator.serviceWorker` present (true on file:// in Chromium), so a call would be seen. Zero registrations and no page error, as before | Fix 7: the old check could not fail. With the `/^https?:$/` guard removed, file:// calls `register()`, which rejects and is caught, so the registration count is zero either way. Plant `register-on-file` (the guard removed from index.html) exits 1. |

## Review round 1: plants that had to follow the code

Two of the spec's four plants had stopped applying. At d323a21 each pattern matched 0 times, so
plants.sh would have stopped at "pattern not found exactly once": neither had run against fixes 1
and 3 (those commits ran their own plants by name). Each still puts back the same bug. Only the
text it matches changed:
- `index-cache-first`: fix 1 put a comment between `const cached = ...` and the `try`. The plant now
  inserts its cache-first return after `const cached = ...`, above that comment.
- `offline-push-rejected`: fix 3 replaced the `syncOffline` flag with `markOwed()`. The plant now
  replaces the line `if (offline()) { markOwed(); ... }` with a `syncFailed("Token rejected — offline")`.

## Review round 1: new blocks, each with its plant (fixes 1 to 5)

New checks, not changed ones. Listed so that every check added in round 1 has its plant beside it:
- Fix 1, a network that never answers: the app opens from the cache in under 5s, and a PDF and a document
  arrive whole in under 5s. Plant `no-timeout`.
- Fix 2, one stalled download: the worker is active in under 15s, with its shell complete. Plant `fill-in-install`.
- Fix 3, the owed push across a relaunch, and a push asked for while a pull is out. Plants
  `owed-ignored-at-boot` and `busy-push-dropped`.
- Fix 4, a Wi-Fi with no internet (navigator.onLine true): "Offline · will sync", no error, the sync owed,
  the lesson's frame becomes the panel, and the next launch pushes. Plants `no-answer-is-failure` and
  `frame-kept-when-net-down`.
- Fix 5, a rejected token, then offline: "Synced · failing", never "will sync". Plant `offline-before-latch`.
