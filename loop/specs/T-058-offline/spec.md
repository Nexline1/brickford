# T-058 — Brickford works offline (and installs as an app)

Owner, 2026-10-28: "make sure that the platform is working offline … even if I don't have Wi-Fi or an
internet connection … This applies to the entire platform … Why not make the entire platform possibly run
offline? … if possible, we get to do it ASAP." (Earlier, 23 Oct: "we need it as an app.")

Today the app has a manifest and icons but NO service worker: with no connection it does not load at all.
All 463 lectures are YouTube embeds, so this item makes everything EXCEPT the video stream work offline.
Offline video is a separate item (T-059) and is out of scope here.

## Scope
1. **Service worker** for the app (`platform/`). Precache the whole shell: index.html, css, js, every
   `platform/data/*.js`, icons, manifest (~3 MB total). Also cache the third-party assets the page needs to
   render: KaTeX 0.16.11 js/css/fonts from cdn.jsdelivr.net and the Google Fonts css + woff2 (runtime cache on
   first use is fine). The Sunday revision PDFs (`/revision/week-*.pdf`, 7 MB) must open offline too — note a SW
   registered under /platform/ does not intercept a top-level navigation to /revision/; solve it (e.g. the
   Library opens them through the app, or register the SW where its scope covers both — GitHub Pages cannot
   send Service-Worker-Allowed) and say which.
2. **Updates must never get stuck on an old version.** index.html network-first with cache fallback;
   `?v=`-versioned assets cache-first; the SW's cache name derives from the same ?v= token the gates bump, and
   old caches are deleted on activate. A new version applies on the next launch/navigation — never a forced
   reload while a video is on screen (CLAUDE.md: a repaint nobody asked for must not destroy what is on screen).
3. **Offline lesson page:** summary, quiz, notes, concepts, problems all work; the video frame is replaced by a
   plain "Video needs a connection" panel (no broken iframe, no error loop). Marking watched/quiz offline
   works and is saved locally.
4. **Sync while offline:** a failed push because the device is offline is NOT a token rejection — no latch, no
   error banner loop; show a quiet "Offline · will sync" state where the sync status already lives, and push
   once on the `online` event (going through the existing push path, so every sync-loop rule still holds).
5. **Install:** confirm the manifest + icons + apple meta make it installable on iPhone (Add to Home Screen)
   and Android (Install app); fix anything missing (start_url/scope/display/icons 192+512, maskable).
6. Handbook/guide gets two short lines: how to install, and what works offline (everything but videos).

## Acceptance
- New gate `tools/verify-offline.js` (Playwright over a local http server — SWs need http, not file://):
  load once online; `context.setOffline(true)`; reload; visit every route the shell gate visits; each renders
  its content (not an error page), KaTeX renders, a lesson shows the offline video panel; tick a lecture
  offline → saved; a revision PDF opens offline; go online → exactly one push attempted, no latch.
  Update test: serve version A, load, serve version B (new ?v=), relaunch → B is running and A's cache is gone.
- Plants (each exit 1): a data file left out of the precache; index.html cache-first (stale update);
  offline push treated as a token rejection; old caches not deleted.
- Every existing gate green (content, contrast, shell, sync-loop ×2, logic, flows ×2, clip 797 may only
  shrink + TZ=LA, design ×2). The existing gates load file:// — the SW must not break them (register only on
  http(s)). Add verify-offline to CLAUDE.md's gate list (PROTECTED path, owner-approved for this line).
- No new runtime dependency (no Workbox): hand-written SW.
