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
//     version's copy only when the network fails. That is how a new version
//     arrives: on the next launch, never by reloading a page someone is using.
//   - everything else under platform/ (the ?v= scripts, data, stylesheet,
//     icons, manifest): CACHE FIRST from this version's own cache, which install
//     fills from the page itself, so the list cannot drift from what it loads.
//   - files the app opens but does not load (the revision PDFs, the Library's
//     documents) and Google's font stylesheet: network first, kept in a cache
//     that outlives versions, so an update does not download 7 MB of PDFs again.
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
async function keep(cache, url) {
  if (await cache.match(url)) return;
  const res = await fetch(url, { mode: "cors", credentials: "omit" });
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
  // plus the icons its manifest names. All or nothing: a version whose cache
  // is missing a file is not installed, and the one before it stays.
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
  await Promise.all([...want].map(async u => shell.put(u, await get(u))));
  await shell.put(INDEX, page);
  // Best effort, and only what is missing: the PDFs and documents, KaTeX and
  // the font stylesheet, then the fonts those stylesheets name. A file that
  // cannot be fetched now is fetched the first time it is used online.
  const files = await caches.open(FILES);
  const third = refs.filter(u => u.pathname !== "/").map(u => u.href).filter(u => PINNED.test(u) || FONT_CSS.test(u));
  await Promise.all(OPENED.concat(third).map(u => keep(files, u).catch(() => {})));
  await Promise.all(third.filter(u => /\.css$|\/css2?\?/.test(u)).map(u => keepFonts(files, u).catch(() => {})));
  await self.skipWaiting();
})()));

// The old version's cache goes the moment this one is active. Pages already
// open keep running the code they loaded; nothing is reloaded under them.
self.addEventListener("activate", event => event.waitUntil((async () => {
  for (const name of await caches.keys())
    if (name.startsWith("brickford-") && name !== SHELL && name !== FILES) await caches.delete(name);
  await self.clients.claim();
})()));

async function appPage(req) {
  const cached = () => caches.match(INDEX, { cacheName: SHELL });
  try {
    // no-cache: GitHub Pages sends max-age=600, and the HTTP cache must not
    // hold a new version back either. Unchanged, this is a 304.
    const res = await fetch(req.url, { cache: "no-cache", credentials: "same-origin" });
    return res.ok ? res : (await cached()) || res;
  } catch (e) {
    const hit = await cached();
    if (hit) return hit;
    throw e;
  }
}
async function networkFirst(req, url) {
  const cache = await caches.open(FILES);
  try {
    const res = await fetch(url.startsWith(ROOT) ? req : new Request(url, { mode: "cors", credentials: "omit" }));
    // 200 only: a ranged 206 from a PDF viewer cannot be stored.
    if (res.status === 200) cache.put(url, res.clone()).catch(() => {});
    return res;
  } catch (e) {
    const hit = await cache.match(url);
    if (hit) return hit;
    throw e;
  }
}
async function cacheFirst(name, req, url) {
  const cache = await caches.open(name);
  const hit = await cache.match(url);
  if (hit) return hit;
  if (name === SHELL) return fetch(req);
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (res.status === 200) cache.put(url, res.clone()).catch(() => {});
    return res;
  } catch (e) {
    return fetch(req);
  }
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = req.url.split("#")[0], bare = url.split("?")[0];
  if (bare === APP || bare === INDEX) event.respondWith(appPage(req));
  else if (OPENED.includes(bare)) event.respondWith(networkFirst(req, bare));
  else if (url.startsWith(APP)) event.respondWith(cacheFirst(SHELL, req, url));
  else if (PINNED.test(url)) event.respondWith(cacheFirst(FILES, req, url));
  else if (FONT_CSS.test(url)) event.respondWith(networkFirst(req, url));
});
