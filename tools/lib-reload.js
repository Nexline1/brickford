// lib-reload.js — every page.reload in a gate, with proof the stored state arrived.
//
// Why this exists (loop/specs/T-039-reload-storage-flake/spec.md): verify-design's
// "switch (c)" failed at random — 2 of ~12 runs on T-031, 4 of 6 on T-026c, with
// the check's code identical. Instrumented (the spec's evidence/run2-diag.txt),
// the app had saved correctly before the reload every time; in the failing run
// the RELOADED document found localStorage EMPTY before any app script ran —
// the lecture marked watched gone with it — while sessionStorage survived. The
// harness runs a file:// page in an ephemeral Playwright context, and a reload
// there can come back without the origin's localStorage. That reading is the
// browser, not the app: nothing of the app runs before the read that came back
// null, so no app bug can produce it.
//
// So a reload is proven, at DOCUMENT START, because that is the only point the
// app cannot have written yet. Before the reload, if the state is stored, a
// one-off stamp is written beside it; an init script added to the page reads
// both before any page script, records them as window.__bootHadState and takes
// the stamp away again, so the app sees exactly the storage it left. The stamp
// is what makes the proof independent of init-script order: Playwright runs
// them in the order they were added, so a harness seed that writes the state
// when it is missing (verify-sync-loop's do) runs BEFORE the probe and would
// make a lost state look present. It cannot write the stamp.
//
// The rule, and the only one: if the state was stored before the reload and
// the reloaded document did not find it, the attempt is not a measurement of
// the app. Its readings are discarded, a note is printed, and the WHOLE block
// is measured again from a fresh context — up to ATTEMPTS in all. If every
// attempt loses the storage, the gate FAILS with that reason; it never passes
// on a measurement it did not make. Any other failure, of any check, is
// committed exactly as it was measured and never retried. The checks' own
// predicates are untouched: a block hands its `check` calls to a buffer with
// the harness's own signature and they are replayed into the harness's check,
// in order, once the attempt stands.
"use strict";

const STATE_KEY = "darhikmah_v1";
const STAMP_KEY = "__harnessReloadStamp";
const ATTEMPTS = 3;

// How many attempts were discarded for a lost storage, this process. Read by
// the isolated-block runner to report the re-measures.
const stats = { lost: 0, exhausted: 0 };

// The document-start probe. Top frame only: the lesson page's video frame is an
// opaque origin where localStorage throws.
function bootProbe([key, stampKey]) {
  if (window.top !== window) return;
  try {
    const stamp = localStorage.getItem(stampKey);
    window.__bootHadState = { state: localStorage.getItem(key) !== null, stamp };
    if (stamp !== null) localStorage.removeItem(stampKey);
  } catch (e) {
    window.__bootHadState = { state: false, stamp: null, error: String(e && e.message || e) };
  }
}

const probed = new WeakSet();
let serial = 0;

// One proven reload. Returns { storedBefore, boot, lost }. `lost` is the whole
// precondition: the state was stored before the reload and the reloaded
// document found it — or the stamp written beside it — missing at document start.
async function provenReload(page, options) {
  const stamp = "r" + process.pid + "." + (++serial) + "." + Date.now();
  if (!probed.has(page)) {
    await page.addInitScript(bootProbe, [STATE_KEY, STAMP_KEY]);
    probed.add(page);
  }
  const storedBefore = await page.evaluate(([key, stampKey, stamp]) => {
    const had = localStorage.getItem(key) !== null;
    if (had) localStorage.setItem(stampKey, stamp);
    return had;
  }, [STATE_KEY, STAMP_KEY, stamp]);
  await page.reload(options);
  const boot = await page.evaluate(() => window.__bootHadState);
  if (!boot) throw new Error("reload probe: the document-start probe did not run, so the reload is unproven");
  const lost = storedBefore && !(boot.state && boot.stamp === stamp);
  return { storedBefore, boot, lost };
}

class StorageLost extends Error {}

// Measure `body` across a proven reload. `body(check, reload)` is the block as
// it was, given a `check` that holds its calls (same arguments as the
// harness's) and a `reload(page, options)` to use in place of page.reload.
// `fail(why)` records one failing check in the harness's own terms.
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
    const why = "stored before the reload; at document start the state key was " +
      (run.lost.boot.state ? "present" : "missing") + " and the reload stamp " + (run.lost.boot.stamp === null ? "missing" : "stale") +
      (run.lost.boot.error ? " (" + run.lost.boot.error + ")" : "");
    if (attempt < ATTEMPTS) {
      console.log("  note  " + label + ": browser storage lost on reload (attempt " + attempt + " of " + ATTEMPTS + "), re-measured — " + why);
      continue;
    }
    stats.exhausted++;
    console.log("  note  " + label + ": browser storage lost on reload (attempt " + attempt + " of " + ATTEMPTS + ") — " + why);
    commit();
    fail(label + ": browser storage lost on reload in all " + ATTEMPTS + " attempts, each from a fresh context — " +
      "the reloaded page was never measured, so this cannot pass (the browser dropped localStorage; the app did not)");
  }
}

module.exports = { acrossReload, provenReload, bootProbe, stats, STATE_KEY, STAMP_KEY, ATTEMPTS };
