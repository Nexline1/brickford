// lib-reload.js — every page.reload in a gate, with proof the stored state arrived.
//
// Why this exists (loop/specs/T-039-reload-storage-flake/spec.md): verify-design's
// "switch (c)" failed at random — 2 of ~12 runs on T-031, 4 of 6 on T-026c, with
// the check's code identical. The app saves correctly before the reload every
// time. What fails is the BROWSER: the harness runs a file:// page in an
// ephemeral Playwright context, and a reload there can come back without the
// storage the page had. Two shapes of it have been measured, both at document
// start, before any app script ran:
//   - localStorage empty (the spec's evidence/run2-diag.txt): the state key
//     null, the lecture marked watched gone with it, sessionStorage intact;
//   - sessionStorage empty (T-039's own diagnosis, verification/): localStorage
//     intact, but the harness's write-once seed (verify-design's bareSettings,
//     which keys "once" off sessionStorage) fired again and wrote its fixture
//     over the app's state — so the app booted on {theme:"light"} with no
//     marker and correctly switched it to dark. 5 of 60 isolated runs here,
//     read by a probe registered before every seed; no localStorage loss in
//     those 60.
// Neither is something the app can cause or prevent: nothing of it runs
// before the read that came back wrong.
//
// So a reload is proven at DOCUMENT START, because that is the only point the
// app cannot have written yet. Before the reload, if the state is stored, a
// one-off stamp is written beside it in localStorage AND in sessionStorage; an
// init script added to the page reads the state key and both stamps before any
// page script, records them as window.__bootHadState and takes the stamps away
// again, so the app sees exactly the storage it left. The stamps are what make
// the proof independent of init-script order: Playwright runs init scripts in
// the order they were added, so a harness seed that writes the state when it
// is missing (verify-sync-loop's) or when its sessionStorage flag is missing
// (verify-design's) runs BEFORE the probe and would make a lost state look
// present. No seed writes a stamp.
//
// The rule, and the only one: if the state was stored before the reload and
// the reloaded document did not find it — the state key, or either stamp
// written beside it — the attempt is not a measurement of the app. Its
// readings are discarded, a note is printed, and the WHOLE block is measured
// again from a fresh context — up to ATTEMPTS in all. If every attempt loses
// the storage, the gate FAILS with that reason; it never passes on a
// measurement it did not make. Any other failure, of any check, is committed
// exactly as it was measured and never retried. The checks' own predicates are
// untouched: a block hands its `check` calls to a buffer with the harness's
// own signature and they are replayed into the harness's check, in order, once
// the attempt stands.
"use strict";

const STATE_KEY = "darhikmah_v1";
const STAMP_KEY = "__harnessReloadStamp";
const ATTEMPTS = 3;

// How many attempts were discarded for a lost storage, this process. Read by
// the isolated-block runner to report the re-measures.
const stats = { lost: 0, exhausted: 0 };

// The document-start probe. Top frame only: the lesson page's video frame is an
// opaque origin where storage throws.
function bootProbe([key, stampKey]) {
  if (window.top !== window) return;
  try {
    const local = localStorage.getItem(stampKey), session = sessionStorage.getItem(stampKey);
    window.__bootHadState = { state: localStorage.getItem(key) !== null, local, session };
    if (local !== null) localStorage.removeItem(stampKey);
    if (session !== null) sessionStorage.removeItem(stampKey);
  } catch (e) {
    window.__bootHadState = { state: false, local: null, session: null, error: String(e && e.message || e) };
  }
}

const probed = new WeakSet();
let serial = 0;

// One proven reload. Returns { storedBefore, boot, stamp, lost }. `lost` is the whole
// precondition: the state was stored before the reload, and at document start
// the reloaded page was missing the state key or either stamp written beside it.
async function provenReload(page, options) {
  const stamp = "r" + process.pid + "." + (++serial) + "." + Date.now();
  if (!probed.has(page)) {
    await page.addInitScript(bootProbe, [STATE_KEY, STAMP_KEY]);
    probed.add(page);
  }
  const storedBefore = await page.evaluate(([key, stampKey, stamp]) => {
    const had = localStorage.getItem(key) !== null;
    if (had) { localStorage.setItem(stampKey, stamp); sessionStorage.setItem(stampKey, stamp); }
    return had;
  }, [STATE_KEY, STAMP_KEY, stamp]);
  await page.reload(options);
  const boot = await page.evaluate(() => window.__bootHadState);
  if (!boot) throw new Error("reload probe: the document-start probe did not run, so the reload is unproven");
  const lost = storedBefore && !(boot.state && boot.local === stamp && boot.session === stamp);
  return { storedBefore, boot, stamp, lost };
}

class StorageLost extends Error {}

// Measure `body` across a proven reload. `body(check, reload)` is the block as
// it was, given a `check` that holds its calls (same arguments as the
// harness's) and a `reload(page, options)` to use in place of page.reload.
// The held check returns nothing, so a block must not branch on check's
// result (none of the five does). `fail(why)` records one failing check in the
// harness's own terms.
async function acrossReload({ label, check, fail }, body) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const held = [];
    const run = { lost: null };
    const reload = async (page, options) => {
      const r = await provenReload(page, options);
      if (r.lost) {
        run.lost = r;
        await page.context().close().catch(() => {});
        throw new StorageLost(label + ": browser storage lost on reload (attempt " + attempt + " of " + ATTEMPTS + ")");
      }
      return r;
    };
    let err = null;
    try { await body((...args) => { held.push(args); }, reload); } catch (e) { err = e; }
    const commit = () => { for (const args of held) check(...args); };
    // THE retry condition, and the only one: this attempt's reload lost the
    // stored state. Everything else — a failing check, a harness error — is
    // committed as measured.
    if (run.lost === null) {
      commit();
      if (err) throw err;
      return;
    }
    stats.lost++;
    const b = run.lost.boot, seen = v => v === null ? "missing" : v === run.lost.stamp ? "present" : "stale";
    const why = "stored before the reload; at document start the state key was " + (b.state ? "present" : "missing") +
      ", the localStorage stamp " + seen(b.local) + ", the sessionStorage stamp " + seen(b.session) +
      (b.error ? " (" + b.error + ")" : "");
    if (attempt < ATTEMPTS) {
      console.log("  note  " + label + ": browser storage lost on reload (attempt " + attempt + " of " + ATTEMPTS + "), re-measured — " + why);
      continue;
    }
    stats.exhausted++;
    console.log("  note  " + label + ": browser storage lost on reload (attempt " + attempt + " of " + ATTEMPTS + ") — " + why);
    commit();
    fail(label + ": browser storage lost on reload in all " + ATTEMPTS + " attempts, each from a fresh context — " +
      "the reloaded page was never measured, so this cannot pass (the browser dropped the page's storage; the app did not)");
  }
}

module.exports = { acrossReload, provenReload, bootProbe, stats, STATE_KEY, STAMP_KEY, ATTEMPTS };
