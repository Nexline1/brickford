// lib-reload.js — every page.reload in a gate, with proof the stamps written
// last before it arrived.
//
// Why this exists (loop/specs/T-039-reload-storage-flake/spec.md): verify-design's
// "switch (c)" failed at random — 2 of ~12 runs on T-031, 4 of 6 on T-026c, with
// the check's code identical. The app had stored the pick before the reload
// every time. The reloaded page then started — before any app script ran —
// without storage the old page had. Two shapes have been measured:
//   - localStorage empty (the spec's evidence/run2-diag.txt): the state key
//     null at document start, sessionStorage intact;
//   - sessionStorage empty (T-039's verification/diag-3): localStorage intact,
//     so verify-design's write-once bareSettings seed, which keys "once" off a
//     sessionStorage flag, fired again and wrote its fixture over the app's
//     state. 5 of 60 isolated runs here; no localStorage loss in those 60.
//
// What is proven, and only this. Just before the reload a one-off stamp is
// written beside the state in localStorage — and, for a block that opts in
// with { session: true }, in sessionStorage too (only switch (c) does: its
// seed is the only reader of sessionStorage; nothing in platform/ reads it).
// Two readings are then taken:
//   - the UNLOAD REPORT: a listener added to the old page last, so it runs
//     after the app's own, reports through console.log at pagehide,
//     visibilitychange and unload whether the state key and the stamps are
//     still there. The app writes at pagehide (leaveLecture, the sync push)
//     and at visibilitychange (keepPosition); unload is the last point the old
//     page can touch storage. The last report received is the one used;
//   - DOCUMENT START: an init script added to the page reads the stamps before
//     any page script, records them as window.__bootHadState and takes them
//     away again, so the app sees the storage it left. Playwright runs init
//     scripts in the order they were added, so a harness seed (verify-sync-
//     loop's rewrites a missing state; bareSettings, a missing flag) runs
//     BEFORE this probe. No seed writes a stamp, which is why the stamps and
//     not the state key are what is read.
//
// The rule. If the unload report says the app took the state key or a stamp
// away, the attempt is the app's doing: it is measured as it is and never
// retried. Otherwise, if a required stamp did not arrive at document start,
// the attempt is not a measurement of the app: EVERY reading of it is
// discarded — failing checks included — a note is printed, and the WHOLE block
// is measured again from a fresh context, up to ATTEMPTS in all. If every
// attempt loses the stamps, the gate FAILS with that reason; it never passes
// on a measurement it did not make. Whether the state itself arrived is not
// part of the rule: that is what the checks measure. If no unload report
// arrives, the stamps alone decide, and the note says so. The checks' own
// predicates are untouched: a block hands its `check` calls to a buffer with
// the harness's own signature, and they are replayed into the harness's check,
// in order, once the attempt stands.
"use strict";

const STATE_KEY = "darhikmah_v1";
const STAMP_KEY = "__harnessReloadStamp";
const REPORT = "__harnessReloadUnload ";
const ATTEMPTS = 3;

// This process's tally, read by the isolated-block runners: attempts
// discarded for a lost stamp, blocks that lost it on every attempt, attempts
// the unload report put down to the app, and reloads with no unload report.
const stats = { lost: 0, exhausted: 0, appRemoved: 0, noReport: 0 };

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
const reports = new WeakMap();   // page -> { stamp: the last unload report for it }
let serial = 0;

// One proven reload. Returns { storedBefore, stamp, session, report, boot,
// appRemoved, lost }:
//   report      the last unload report for this stamp, or null if none came;
//   appRemoved  the report says the state key or a required stamp was already
//               gone when the old page unloaded — the app's doing;
//   lost        the retry condition (below).
async function provenReload(page, options, session) {
  const stamp = "r" + process.pid + "." + (++serial) + "." + Date.now();
  if (!probed.has(page)) {
    await page.addInitScript(bootProbe, [STATE_KEY, STAMP_KEY]);
    const got = {};
    reports.set(page, got);
    page.on("console", m => {
      const t = m.text();
      if (!t.startsWith(REPORT)) return;
      try { const r = JSON.parse(t.slice(REPORT.length)); got[r.stamp] = r; } catch (e) {}
    });
    probed.add(page);
  }
  const storedBefore = await page.evaluate(([key, stampKey, stamp, session, prefix]) => {
    const had = localStorage.getItem(key) !== null;
    if (!had) return false;
    localStorage.setItem(stampKey, stamp);
    if (session) sessionStorage.setItem(stampKey, stamp);
    // Added last, so on each event it runs after the app's own listeners.
    const tell = ev => () => {
      if (ev === "visibilitychange" && document.visibilityState !== "hidden") return;
      let r;
      try {
        r = { stamp, ev, key: localStorage.getItem(key) !== null, local: localStorage.getItem(stampKey), session: sessionStorage.getItem(stampKey) };
      } catch (e) { r = { stamp, ev, key: false, local: null, session: null, error: String(e && e.message || e) }; }
      console.log(prefix + JSON.stringify(r));
    };
    window.addEventListener("pagehide", tell("pagehide"));
    document.addEventListener("visibilitychange", tell("visibilitychange"));
    window.addEventListener("unload", tell("unload"));
    return true;
  }, [STATE_KEY, STAMP_KEY, stamp, !!session, REPORT]);
  await page.reload(options);
  const boot = await page.evaluate(() => window.__bootHadState);
  if (!boot) throw new Error("reload probe: the document-start probe did not run, so the reload is unproven");
  const report = storedBefore ? reports.get(page)[stamp] || null : null;
  const kept = r => r.local === stamp && (!session || r.session === stamp);
  const appRemoved = !!report && !(report.key && kept(report));
  // THE retry condition, and the only one: something was stored before the
  // reload, the app did not take it away while the old page unloaded, and a
  // required stamp is missing at document start.
  const lost = storedBefore && !appRemoved && !kept(boot);
  return { storedBefore, stamp, session: !!session, report, boot, appRemoved, lost };
}

class StorageLost extends Error {}

const seen = (v, stamp) => v === null || v === undefined ? "missing" : v === stamp ? "present" : "stale";
// What one reload was seen to do, for the notes.
function account(r) {
  const parts = s => "the localStorage stamp " + seen(s.local, r.stamp) + (r.session ? ", the sessionStorage stamp " + seen(s.session, r.stamp) : "");
  const at = r.report
    ? "at the old page's " + r.report.ev + " the state key was " + (r.report.key ? "present" : "missing") + ", " + parts(r.report)
    : "no unload report arrived, so the stamps alone decide";
  return at + "; at document start " + parts(r.boot) + (r.boot.error ? " (" + r.boot.error + ")" : "");
}

// Measure `body` across a proven reload. `body(check, reload)` is the block as
// it was, given a `check` that holds its calls (same arguments as the
// harness's) and a `reload(page, options)` to use in place of page.reload.
// The held check returns nothing, so a block must not branch on check's
// result (none of the five does). `fail(why)` records one failing check in the
// harness's own terms. `session: true` also requires the sessionStorage stamp.
async function acrossReload({ label, check, fail, session }, body) {
  const losses = [];
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const held = [];
    const run = { lost: null };
    const reload = async (page, options) => {
      const r = await provenReload(page, options, session);
      if (r.storedBefore && !r.report) stats.noReport++;
      if (r.appRemoved) {
        stats.appRemoved++;
        console.log("  note  " + label + ": the app took the stored state or a stamp away while the old page unloaded (attempt " +
          attempt + ") — measured as it is, not retried — " + account(r));
      }
      if (r.lost) {
        run.lost = r;
        await page.context().close().catch(() => {});
        throw new StorageLost(label + ": the stamps written before the reload did not arrive (attempt " + attempt + " of " + ATTEMPTS + ")");
      }
      return r;
    };
    let err = null;
    try { await body((...args) => { held.push(args); }, reload); } catch (e) { err = e; }
    if (run.lost === null) {
      for (const args of held) check(...args);
      if (err) throw err;
      return;
    }
    // A lost attempt: every reading of it is discarded, failing checks included.
    stats.lost++;
    losses.push(run.lost);
    console.log("  note  " + label + ": storage lost on reload (attempt " + attempt + " of " + ATTEMPTS + ")" +
      (attempt < ATTEMPTS ? ", re-measured" : "") + " — " + account(run.lost));
  }
  stats.exhausted++;
  const reported = losses.filter(r => r.report).length;
  fail(label + ": the stamps written just before the reload did not arrive at document start in all " + ATTEMPTS +
    " attempts, each from a fresh context, so the reloaded page was never measured and this cannot pass — " +
    (reported === ATTEMPTS
      ? "each time the old page still held them when it unloaded, so they were lost between its unload and the new page's document start, where no app script runs"
      : (ATTEMPTS - reported) + " of the " + ATTEMPTS + " sent no unload report, so for those this rests on the stamps alone"));
}

module.exports = { acrossReload, provenReload, bootProbe, stats, STATE_KEY, STAMP_KEY, REPORT, ATTEMPTS };
