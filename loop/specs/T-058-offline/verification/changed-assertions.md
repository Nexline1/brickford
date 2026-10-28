# T-058: changed assertions

## Existing gates

None. No file under `tools/` other than the new `tools/verify-offline.js` was edited, and no
assertion, threshold or baseline entry in any existing gate was changed, skipped or loosened.
`tools/verify-clip.baseline.json` is untouched.

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
