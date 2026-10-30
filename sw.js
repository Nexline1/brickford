// sw.js — Brickford with no connection (T-058). Hand-written: no Workbox, no
// dependency. tools/verify-offline.js is the gate that holds it.
//
// Where it lives. At the site root, beside platform/ and revision/, because a
// worker answers only for navigations inside its own directory: registered from
// platform/ it could never serve ../revision/week-NN.pdf, which the Library
// opens in a tab of its own, and GitHub Pages cannot send the
// Service-Worker-Allowed header that would let it reach. platform/index.html
// registers ../sw.js?v=<token>, the same ?v= token every script and stylesheet
// carries, so the sed that bumps the tokens also names a new worker and a new
// cache, and nothing else has to remember to.
//
// One rule per kind of request:
//   - the app's page (platform/ and platform/index.html): NETWORK FIRST, this
//     version's copy when the network fails or has not answered in 3s (SLOW).
//     That is how a new version arrives: on the next launch, never by
//     reloading a page someone is using. (On a network that is always slower
//     than 3s, the new version waits for a launch that gets an answer in time.)
//   - everything else under platform/ (the ?v= scripts, data, stylesheet,
//     icons, manifest, and the self-hosted Inter the stylesheet names): CACHE
//     FIRST from this version's own cache, which install fills from the page
//     itself, and from the stylesheet the way it fills from the manifest, so
//     the list cannot drift from what it loads. Installing waits on that cache
//     alone; everything else fills afterwards.
//   - files the app opens but does not load (the revision PDFs, the Library's
//     documents): network first within SLOW too, kept in a cache that outlives
//     versions, so an update does not download 7 MB of PDFs again.
//   - Google's font stylesheet: the cached copy, refreshed behind it.
//   - KaTeX and the font files: cache first, since their URLs change when
//     their bytes do (a version in the path, a hash in the name).
// Anything else (YouTube, GitHub's API) is not touched: it goes to the network
// as if there were no worker, and fails offline the way it always has.
"use strict";
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const SHELL = "brickford-" + VERSION;   // this version's app; deleted once a newer one is active
const FILES = "brickford-files";         // not tied to a version; kept across updates
const ROOT = new URL("./", self.location.href).href;
const APP = ROOT + "platform/";
const INDEX = APP + "index.html";
// Opened from the app rather than loaded by its page: the Sunday revision PDFs
// (REVISION_PDFS in platform/js/app.js) and the Library's documents (DOCS).
const OPENED = ["revision/week-01.pdf", "revision/week-02.pdf", "revision/week-03.pdf",
  "revision/week-04.pdf", "revision/week-05.pdf", "revision/week-06.pdf",
  "README.md", "phase-1-curriculum.md", "coding-diagnostic.md", "earning-offers.md", "progress-log.md"]
  .map(p => ROOT + p);
const PINNED = /^https:\/\/(cdn\.jsdelivr\.net\/npm\/katex@|fonts\.gstatic\.com\/)/;
const FONT_CSS = /^https:\/\/fonts\.googleapis\.com\/css/;

// Into the cache unless it is already there. CORS mode, so a third-party file
// is stored readable rather than opaque (an opaque one cannot be checked, and
// counts as megabytes against the quota).
// Each fetch is bounded (a minute: a 1.7 MB PDF on a slow line), so one that
// stalls ends, and the next launch tries it again.
const FILL_MS = 60000;
async function keep(cache, url) {
  if (await cache.match(url)) return;
  const signal = self.AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(FILL_MS) : undefined;
  const res = await fetch(url, { mode: "cors", credentials: "omit", signal });
  if (res.status === 200) await cache.put(url, res);
}
// The woff2 files a stylesheet already in the cache names (KaTeX's, Google's).
async function keepFonts(cache, cssUrl) {
  const css = await cache.match(cssUrl);
  if (!css) return;
  const urls = [...(await css.text()).matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)].map(m => new URL(m[1], cssUrl).href);
  await Promise.all(urls.map(u => keep(cache, u).catch(() => {})));
}

self.addEventListener("install", event => event.waitUntil((async () => {
  // The page says what it loads: every relative src and href in index.html,
  // plus the icons its manifest names and the fonts its stylesheet names. All
  // or nothing: a version whose cache is missing a file is not installed, and
  // the one before it stays.
  const page = await fetch(INDEX, { cache: "no-cache" });
  if (!page.ok) throw new Error("index.html: " + page.status);
  const html = await page.clone().text();
  const refs = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map(m => new URL(m[1], INDEX));
  const want = new Set(refs.filter(u => u.href.startsWith(APP) && !u.hash).map(u => u.href));
  const shell = await caches.open(SHELL);
  const get = async u => {
    // A ?v= file never changes under its name, so the HTTP cache may answer;
    // anything else is asked about again.
    const res = await fetch(u, { cache: /[?&]v=/.test(u) ? "default" : "no-cache" });
    if (!res.ok) throw new Error(u + ": " + res.status);
    return res;
  };
  for (const man of [...want].filter(u => /\/manifest\.json(\?|$)/.test(u))) {
    const res = await get(man);
    ((await res.clone().json()).icons || []).forEach(i => want.add(new URL(i.src, man).href));
    await shell.put(man, res);
    want.delete(man);
  }
  // The app's own stylesheets name the fonts they load (T-051: Inter, from
  // platform/fonts/), the way the manifest names its icons. Only woff2 files
  // under platform/; the third-party sheets are fill()'s.
  for (const css of [...want].filter(u => /\.css(\?|$)/.test(u))) {
    const res = await get(css);
    [...(await res.clone().text()).matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)]
      .map(m => new URL(m[1], css).href).filter(u => u.startsWith(APP)).forEach(u => want.add(u));
    await shell.put(css, res);
    want.delete(css);
  }
  await Promise.all([...want].map(async u => shell.put(u, await get(u))));
  await shell.put(INDEX, page);
  // Nothing else: installing waits on the shell alone (fill, below).
  await self.skipWaiting();
})()));

// Best effort, and only what is missing: the PDFs and documents, KaTeX and the
// font stylesheet that index.html names, then the fonts those stylesheets
// name. Never part of installing or activating, so one stalled download
// cannot keep a version from starting: it runs once this version is active,
// and again on every launch (the page's fetch keeps the worker alive for it)
// until nothing is missing. One run at a time.
let filling = null;
function fill() {
  return filling || (filling = (async () => {
    const page = await caches.match(INDEX, { cacheName: SHELL });
    if (!page) return;
    const third = [...(await page.text()).matchAll(/\s(?:src|href)="(https:\/\/[^"]+)"/g)].map(m => new URL(m[1]))
      .filter(u => u.pathname !== "/").map(u => u.href).filter(u => PINNED.test(u) || FONT_CSS.test(u));
    const files = await caches.open(FILES);
    await Promise.all(OPENED.concat(third).map(u => keep(files, u).catch(() => {})));
    await Promise.all(third.filter(u => /\.css$|\/css2?\?/.test(u)).map(u => keepFonts(files, u).catch(() => {})));
  })().catch(() => {}).then(() => { filling = null; }));
}

// The old version's cache goes the moment this one is active. Pages already
// open keep running the code they loaded; nothing is reloaded under them.
self.addEventListener("activate", event => {
  const ready = (async () => {
    for (const name of await caches.keys())
      if (name.startsWith("brickford-") && name !== SHELL && name !== FILES) await caches.delete(name);
    await self.clients.claim();
  })();
  event.waitUntil(ready);
  ready.then(fill, () => {});
});

// A network that takes a request and never answers (one bar of signal, a
// Wi-Fi with no internet behind it) must not hold the app hostage. Wherever a
// cached copy can answer, the network gets SLOW ms; then the copy is served,
// and the network may still finish behind it.
const SLOW = 3000;
// The network's answer if it comes within SLOW ms; else the cached copy, if
// there is one; else the network's answer whenever it comes.
async function soon(net, cached) {
  let t;
  const late = new Promise(r => { t = setTimeout(r, SLOW, null); });
  try {
    const first = await Promise.race([net, late]);
    if (first) return first;
    return (await cached()) || await net;
  } finally { clearTimeout(t); }
}
const quiet = p => { p.catch(() => {}); return p; };

async function appPage(req) {
  const cached = () => caches.match(INDEX, { cacheName: SHELL });
  // no-cache: GitHub Pages sends max-age=600, and the HTTP cache must not
  // hold a new version back either. Unchanged, this is a 304.
  const net = quiet(fetch(req.url, { cache: "no-cache", credentials: "same-origin" }));
  try {
    const res = await soon(net, cached);
    return res.ok ? res : (await cached()) || res;
  } catch (e) {
    const hit = await cached();
    if (hit) return hit;
    throw e;
  }
}
// The PDFs and the documents: network first, within SLOW. What the network
// brings is kept, late or not (200 only: a ranged 206 from a PDF viewer
// cannot be stored).
async function networkFirst(event, url) {
  const cache = await caches.open(FILES);
  const net = quiet(fetch(event.request).then(res => {
    if (res.status === 200) cache.put(url, res.clone()).catch(() => {});
    return res;
  }));
  event.waitUntil(net.then(() => {}, () => {}));
  try {
    return await soon(net, () => cache.match(url));
  } catch (e) {
    const hit = await cache.match(url);
    if (hit) return hit;
    throw e;
  }
}
// Third-party, in CORS mode so the copy is readable rather than opaque.
const cors = url => fetch(url, { mode: "cors", credentials: "omit" });
async function refreshInto(cache, url) {
  const res = await cors(url);
  if (res.status === 200) await cache.put(url, res.clone());
  return res;
}
// Google's font stylesheet: the copy at once, refreshed behind it. With no
// copy yet, the network gets SLOW ms and then the page gets an empty sheet: it
// renders in the fallback face rather than waiting on a font.
async function fontSheet(event, url) {
  const cache = await caches.open(FILES);
  const net = quiet(refreshInto(cache, url));
  event.waitUntil(net.then(() => {}, () => {}));
  const hit = await cache.match(url);
  return hit || soon(net, async () => new Response("", { headers: { "Content-Type": "text/css" } }));
}
// KaTeX and the font files: cache first. A file not cached yet gets SLOW ms,
// then the page goes on without it (KaTeX's script must not hold app.js, which
// runs after it) while the fetch finishes and is kept for next time.
async function pinned(event, url) {
  const cache = await caches.open(FILES);
  const hit = await cache.match(url);
  if (hit) return hit;
  const net = quiet(refreshInto(cache, url).catch(() => fetch(event.request)));
  event.waitUntil(net.then(() => {}, () => {}));
  return soon(net, async () => Response.error());
}
// This version's own files. A lookup by name, not caches.open, which would
// create the cache again after a newer version deleted it.
async function fromShell(req, url) {
  return (await caches.match(url, { cacheName: SHELL })) || fetch(req);
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = req.url.split("#")[0], bare = url.split("?")[0];
  if (bare === APP || bare === INDEX) { event.respondWith(appPage(req)); event.waitUntil(fill()); }
  else if (OPENED.includes(bare)) event.respondWith(networkFirst(event, bare));
  else if (url.startsWith(APP)) event.respondWith(fromShell(req, url));
  else if (PINNED.test(url)) event.respondWith(pinned(event, url));
  else if (FONT_CSS.test(url)) event.respondWith(fontSheet(event, url));
});
