// Brickford — Application Core
// State (localStorage) · hash router · all views. No frameworks, nothing to rot.
(function () {
  "use strict";
  const D = window.DAR;
  const KEY = "darhikmah_v1";

  // ---------- utilities ----------
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  // Local calendar date — NOT toISOString() (that's UTC and shows the
  // wrong day for anyone ahead of UTC, e.g. Bahrain UTC+3 before 3 AM).
  const todayISO = () => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };
  const fmtBHD = v => "BHD " + (Math.round(v * 100) / 100).toLocaleString();
  function daysBetween(a, b) { return Math.floor((new Date(b) - new Date(a)) / 86400000); }

  // ---------- six days a week ----------
  // The plan runs six days, not seven. One day off is the difference between a
  // schedule someone keeps for three years and one they abandon in month two, so
  // the rest day is part of the curriculum rather than a lapse in it.
  //
  // The consequence, which is the whole reason this is a real change and not a
  // display tweak: everything downstream indexes by STUDY day, not calendar day.
  // A rest day has no index at all. It is not a day you fell behind on — it is a
  // day with nothing scheduled, so it cannot break a streak and cannot owe you
  // lessons. Skipping it stretches the calendar rather than compressing the work,
  // because the load per day was the thing that was too heavy.
  const REST_DOW = 6;                                  // 0 = Sunday … 6 = Saturday
  const ICS_DOW = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  // Derived, never written twice: the exported calendar cannot drift from the
  // schedule it is supposed to describe.
  const ICS_STUDY_DAYS = ICS_DOW.filter((_, i) => i !== REST_DOW).join(",");
  const REST_NAME = "Saturday";
  const dowOf = iso => new Date(iso + "T00:00:00").getDay();
  const isRestDay = iso => dowOf(iso) === REST_DOW;
  // Calendar offset from the start to the first rest day.
  let _restK = null;
  function restOffset() {
    if (_restK == null) _restK = (REST_DOW - dowOf(D.START_DATE) + 7) % 7;
    return _restK;
  }
  // How many rest days fall in the first `n` calendar days from the start.
  function restsWithin(n) {
    const k = restOffset();
    return n > k ? Math.floor((n - k - 1) / 7) + 1 : 0;
  }
  // 0-based index of `iso` among study days. -1 before the start, or on a rest
  // day — callers must treat -1 as "no work belongs to this date".
  function studyIndex(iso) {
    if (iso < D.START_DATE || isRestDay(iso)) return -1;
    const n = daysBetween(D.START_DATE, iso);
    return n - restsWithin(n);
  }
  // The inverse: the calendar date carrying study day `i`. Exact rather than
  // approximate, because the gate dates are computed from it and a rounded
  // countdown that drifts by a day a month would be worse than none.
  function dateForStudy(i) {
    const k = restOffset();
    if (i < k) return addDaysISO(D.START_DATE, i);
    const j = i - k;
    return addDaysISO(D.START_DATE, k + 1 + Math.floor(j / 6) * 7 + (j % 6));
  }
  // ---- the speech calendar ----
  // Storytelling runs FIVE days a week, not six: it rests on Saturday with
  // everything else, and again on Friday, which carries the weekly recorded rep
  // instead of a lecture. Friday is not a second day off — the rep is that day's
  // work. Derived from SPEECH_OFF_DOW alone, the same way every other cadence
  // here derives from REST_DOW, so the two can never drift apart.
  const SPEECH_OFF_DOW = 5;                  // Friday
  let _friK = null;
  function speechOffset() {                  // study index of the first Friday
    if (_friK == null) {
      let i = 0;
      while (i < 7 && dowOf(dateForStudy(i)) !== SPEECH_OFF_DOW) i++;
      _friK = i;
    }
    return _friK;
  }
  // Fridays land every STUDY_WEEK study days from the first one; this counts
  // those strictly before study index `d`.
  function speechOffsWithin(d) {
    const k = speechOffset();
    return d > k ? Math.floor((d - k - 1) / STUDY_WEEK) + 1 : 0;
  }
  // 0-based index of `iso` among speech days. -1 on a Friday, a Saturday, or
  // before the start — callers treat -1 as "no lecture belongs to this date".
  function speechSlot(iso) {
    const d = studyIndex(iso);
    if (d < 0 || dowOf(iso) === SPEECH_OFF_DOW) return -1;
    return d - speechOffsWithin(d);
  }
  function addStudyDays(iso, n) {
    const base = studyIndex(iso);
    // From a rest day or before the start, count from the next study day.
    if (base < 0) {
      let cur = iso < D.START_DATE ? D.START_DATE : addDaysISO(iso, 1);
      while (isRestDay(cur)) cur = addDaysISO(cur, 1);
      return dateForStudy(studyIndex(cur) + n);
    }
    return dateForStudy(base + n);
  }
  const studyToday = () => studyIndex(todayISO());
  function nextStudyDay(iso) {
    let cur = addDaysISO(iso, 1);
    for (let guard = 0; guard < 14 && isRestDay(cur); guard++) cur = addDaysISO(cur, 1);
    return cur;
  }
  const nextStudyHref = () => "#/calendar";
  function nextStudyLabel() {
    const n = nextStudyDay(todayISO());
    return new Date(n + "T00:00:00").toLocaleString("en-US", { weekday: "long" }) + "’s plan";
  }
  // The plan's week is six study days, not seven calendar ones.
  const STUDY_WEEK = 6;
  function weekNumber() {
    const i = studyToday();
    // On a rest day, you are still in the week you just worked.
    const eff = i >= 0 ? i : Math.max(0, studyIndex(prevStudyDay(todayISO())));
    return Math.max(1, Math.floor(eff / STUDY_WEEK) + 1);
  }
  function prevStudyDay(iso) {
    let cur = addDaysISO(iso, -1);
    for (let guard = 0; guard < 14 && (isRestDay(cur) || cur < D.START_DATE); guard++) {
      if (cur < D.START_DATE) return D.START_DATE;
      cur = addDaysISO(cur, -1);
    }
    return cur;
  }
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }
  function renderMath(el) {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(el, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
          throwOnError: false,
        });
      } catch (e) {}
    }
  }
  const CHECK_SVG = '<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 8 L6.2 11 L12 4.5"/></svg>';

  // ---------- state ----------
  const DEFAULT = {
    v: 1,
    lessons: {},        // "course.unit.idx" -> {done, notes, checks:[]}
    problems: {},       // "Category|Name" -> true
    quizAttempts: {},   // bankId -> [{date, score, total, pct}]
    quizMisses: {},     // bankId -> [bank question indices currently in the miss pool]
    diag: {},           // diagId -> {score, date}
    gates: {},          // gateN -> completion date (ISO) when passed
    studyDays: [],      // ISO dates
    weeks: [],          // {week, date, shipped, dsa, posts, revenue, notes}
    labs: {},           // labId -> {done, proof}
    psets: {},          // psetItemId -> true
    electives: {},      // electiveId -> "planned" | "done"
    treasury: { offer: "", clients: [], entries: [], niche: "" },
    // The practice layer. Four append-only logs: a daily two-line story bank,
    // the weekly recorded story rep, the weekly five-attempt humour rep, and the
    // monthly review. Append-only because a rep you did happened, and because
    // that is the only shape the sync merge can union without losing a rep
    // written on the other device.
    reps: { bank: [], story: [], humor: [], review: [] },
    // streakFrom: the streak counts sealed days on or after this date. Null
    // means "since the beginning". Resetting the streak sets it to today, which
    // zeroes the number without deleting a single sealed day — the heatmap, the
    // day count and the chain stay exactly as true as they were.
    // lastSyncAt / syncError are per-device facts about THIS browser's link to
    // GitHub, so they are deliberately not in syncPayload - pushing them would
    // tell the phone about the laptop's broken token.
    settings: { theme: "light", lastBackup: null, dailyStart: "08:00", streakFrom: null,
                lastSyncAt: null, syncError: null },
  };
  let S;
  try { S = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch (e) { S = JSON.parse(JSON.stringify(DEFAULT)); }
  S.treasury = Object.assign({}, DEFAULT.treasury, S.treasury);
  S.reps = Object.assign({ bank: [], story: [], humor: [], review: [] }, S.reps);
  S.settings = Object.assign({}, DEFAULT.settings, S.settings);
  // Every persisted change schedules a push. This hangs off save() rather than
  // off logEvent() because only 16 of 42 mutation sites logged an event, so
  // notes, gates and treasury edits were silently never syncing.
  // syncQuiet guards the obvious trap: runSync itself calls save(), which would
  // otherwise schedule the next push forever.
  let syncQuiet = 0;
  function save() {
    localStorage.setItem(KEY, JSON.stringify(S));
    if (!syncQuiet) syncSoon();
  }
  S.ledger = S.ledger || [];
  S.review = S.review || {};
  S.concepts = S.concepts || {};
  S.anchors = S.anchors || [];

  // ---------- cross-device sync ----------
  // localStorage is per-browser by definition, so the phone and the laptop are
  // separate universes. The repo is already yours and already versioned, so it
  // makes the natural backend: every sync is a commit, which doubles as a
  // third-party timestamp for the record.
  S.settings.deviceId = S.settings.deviceId ||
    (Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4));
  S.foreignLedgers = S.foreignLedgers || {};

  const SYNC_REPO = "Nexline1/brickford";
  const SYNC_PATH = "progress/brickford-state.json";
  const ghToken = () => { try { return localStorage.getItem("brickford_gh_token") || ""; } catch (e) { return ""; } };

  function ghFetch(method, body) {
    const url = "https://api.github.com/repos/" + SYNC_REPO + "/contents/" + SYNC_PATH;
    return fetch(method === "GET" ? url + "?ref=main" : url, {
      method: method,
      headers: {
        Authorization: "Bearer " + ghToken(),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // Field-level merge. Working on both devices in the same day must never cost
  // you work, so nothing here is last-writer-wins except plain settings.
  function mergeState(remote) {
    if (!remote || typeof remote !== "object") return { changed: 0 };
    let changed = 0;
    const r = remote.state || {};

    // lessons: keep the further-along version of each
    Object.keys(r.lessons || {}).forEach(k => {
      const mine = S.lessons[k], theirs = r.lessons[k];
      if (!theirs) return;
      if (!mine) { S.lessons[k] = theirs; changed++; return; }
      const score = x => (x.verified ? 4 : 0) + (x.done ? 2 : 0) + ((x.notes || "").length + (x.recall || "").length > 0 ? 1 : 0);
      if (score(theirs) > score(mine)) { S.lessons[k] = theirs; changed++; }
      else if (score(theirs) === score(mine)) {
        // same standing: keep the richer text and the higher problem count
        if ((theirs.notes || "").length > (mine.notes || "").length) { mine.notes = theirs.notes; changed++; }
        if ((theirs.recall || "").length > (mine.recall || "").length) { mine.recall = theirs.recall; changed++; }
        if ((theirs.solved || 0) > (mine.solved || 0)) { mine.solved = theirs.solved; changed++; }
      }
    });
    // sets: union
    (r.studyDays || []).forEach(d => { if (S.studyDays.indexOf(d) < 0) { S.studyDays.push(d); changed++; } });
    S.studyDays.sort();
    ["problems", "psets", "electives", "labs", "diag", "gates"].forEach(key => {
      Object.keys(r[key] || {}).forEach(k => {
        if (!S[key][k] && r[key][k]) { S[key][k] = r[key][k]; changed++; }
      });
    });
    // attempts: concat, dedupe
    Object.keys(r.quizAttempts || {}).forEach(b => {
      S.quizAttempts[b] = S.quizAttempts[b] || [];
      const seen = new Set(S.quizAttempts[b].map(a2 => a2.date + "|" + a2.pct + "|" + a2.score));
      (r.quizAttempts[b] || []).forEach(a2 => {
        const k = a2.date + "|" + a2.pct + "|" + a2.score;
        if (!seen.has(k)) { S.quizAttempts[b].push(a2); seen.add(k); changed++; }
      });
    });
    // weeks: by week number, later entry wins
    (r.weeks || []).forEach(w => {
      const i = S.weeks.findIndex(x => +x.week === +w.week);
      if (i < 0) { S.weeks.push(w); changed++; }
      else if ((w.date || "") > (S.weeks[i].date || "")) { S.weeks[i] = w; changed++; }
    });
    // review: the later due date wins, so a recall done elsewhere is respected
    Object.keys(r.review || {}).forEach(k => {
      const mine = S.review[k], theirs = r.review[k];
      if (!mine || (theirs.last || "") > (mine.last || "")) { S.review[k] = theirs; changed++; }
    });
    // concepts: proven wins; sketches keep the newest two across devices
    Object.keys(r.concepts || {}).forEach(k => {
      const mine = S.concepts[k], theirs = r.concepts[k];
      if (!mine) { S.concepts[k] = theirs; changed++; return; }
      if (theirs.proven && !mine.proven) { mine.proven = true; mine.provenAt = theirs.provenAt; changed++; }
      const all = (mine.sketches || []).concat(theirs.sketches || [])
        .filter((v, i, arr) => arr.findIndex(x => x.png === v.png) === i)
        .sort((x, y) => (x.date < y.date ? -1 : 1));
      if (all.length !== (mine.sketches || []).length) { mine.sketches = all.slice(-2); changed++; }
    });
    (r.anchors || []).forEach(a2 => {
      if (!S.anchors.some(x => x.head === a2.head && x.date === a2.date)) { S.anchors.push(a2); changed++; }
    });

    // Reps union like anchors: a rep is a thing that happened, so two devices
    // can only ever have MORE of them between them, never fewer. Identity is
    // the date plus the payload, so the same rep synced twice stays one rep
    // while two genuinely different entries on one day both survive.
    const repKey = { bank: e => e.date + "|" + (e.what || ""), story: e => e.date + "|" + (e.seconds || 0),
                     humor: e => e.date + "|" + ((e.attempts || [])[0] || ""), review: e => e.date };
    ["bank", "story", "humor", "review"].forEach(k => {
      const mine = S.reps[k] || (S.reps[k] = []);
      const seen = new Set(mine.map(repKey[k]));
      ((r.reps || {})[k] || []).forEach(e => {
        const id = repKey[k](e);
        if (!seen.has(id)) { mine.push(e); seen.add(id); changed++; }
      });
      mine.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    });

    // The streak floor takes the later of the two. Days union, so without this a
    // reset on the phone would be silently undone by the next pull from the
    // laptop — and taking the later date also means a reset can never be
    // un-done by an older device that has not heard about it yet.
    const rf = (r.settings || {}).streakFrom;
    if (rf && rf > (S.settings.streakFrom || "")) { S.settings.streakFrom = rf; changed++; }

    // Ledgers stay per device and are never re-hashed: rewriting a chain would
    // orphan any head hash already published as an anchor.
    const ledgers = remote.ledgers || {};
    Object.keys(ledgers).forEach(dev => {
      if (dev === S.settings.deviceId) return;
      const theirs = ledgers[dev] || [];
      const mineForeign = S.foreignLedgers[dev] || [];
      if (theirs.length > mineForeign.length) { S.foreignLedgers[dev] = theirs; changed++; }
    });
    return { changed: changed };
  }

  // One code path for both directions so the manual buttons and the automatic
  // pull-on-open cannot drift apart.
  let syncBusy = false;
  // A sync that fails silently is worse than one that never ran: the device goes
  // on looking connected while its record quietly diverges. `say` only ever
  // reaches the /sync page, and four of the five callers pass nothing - the boot
  // pull, the pull on resume, the pagehide push and the debounced push after
  // every save were all discarding their errors. These two record the outcome
  // where the rest of the UI can see it.
  function syncOk() {
    // A first successful sync, or one that clears a failure, changes what the
    // status indicator should say even when the merge moved nothing. Without
    // this the dashboard sat on "never" while lastSyncAt was already recorded -
    // the same class of lie as the silent failure, pointing the other way.
    const transition = !S.settings.lastSyncAt || !!S.settings.syncError;
    syncQuiet++;
    S.settings.lastSync = todayISO();
    S.settings.lastSyncAt = new Date().toISOString();
    S.settings.syncError = null;
    save();
    syncQuiet--;
    if (transition && !rendering) render();
  }
  function syncFailed(msg) {
    syncQuiet++;
    S.settings.syncError = { msg: String(msg || "Sync failed"), at: new Date().toISOString() };
    save();
    syncQuiet--;
  }
  function runSync(dir, say) {
    say = say || function () {};
    if (!ghToken() || syncBusy) return Promise.resolve(false);
    syncBusy = true;
    say("Contacting GitHub\u2026");
    return ghFetch("GET").then(res => {
      if (res.status === 404) return { missing: true };
      if (res.status === 401 || res.status === 403) throw new Error("Token rejected \u2014 it needs Contents: Read and write on " + SYNC_REPO + ".");
      if (!res.ok) throw new Error("GitHub returned " + res.status + ".");
      return res.json();
    }).then(file => {
      const remote = file.missing ? null
        : JSON.parse(decodeURIComponent(escape(atob((file.content || "").replace(/\n/g, "")))));
      if (dir === "pull") {
        if (!remote) { say("Nothing stored yet \u2014 push from the device that has your progress."); return false; }
        syncQuiet++;
        const r = mergeState(remote);
        syncQuiet--;
        syncOk();
        say("");
        if (r.changed) { render(); toast("Pulled \u2014 " + r.changed + " change" + (r.changed === 1 ? "" : "s") + " merged."); }
        return true;
      }
      // A push MUST merge before it writes. This fetched the file only for its
      // sha and then wrote local state straight over the top, which made every
      // push whole-file last-writer-wins and defeated the entire point of the
      // field-level merge below it.
      //
      // The failure it caused: the laptop pushes a day's work, then the phone —
      // still holding yesterday's state — backgrounds and pushes, and the laptop's
      // day is gone from the remote. Both devices then look like they "don't
      // sync", because each keeps seeing its own stale copy come back.
      //
      // Merging first makes a push safe from any device in any order.
      let mergedIn = 0;
      if (remote) {
        syncQuiet++;
        mergedIn = mergeState(remote).changed;
        syncQuiet--;
      }
      const body = {
        message: "progress: " + todayISO() + " from " + S.settings.deviceId +
          (mergedIn ? " (merged " + mergedIn + ")" : ""),
        content: btoa(unescape(encodeURIComponent(JSON.stringify(syncPayload(), null, 1)))),
      };
      if (!file.missing && file.sha) body.sha = file.sha;
      return ghFetch("PUT", body).then(res2 => {
        if (res2.status === 409) throw new Error("The remote moved while pushing. Pull, then push again.");
        if (!res2.ok) return res2.json().then(j => { throw new Error(j.message || ("GitHub returned " + res2.status)); });
        syncOk(); say("");
        // If the push pulled work in on its way past, the screen is out of date.
        if (mergedIn) { render(); toast("Pushed — " + mergedIn + " change" + (mergedIn === 1 ? "" : "s") + " merged in."); }
        else toast("Pushed.");
        return true;
      });
    }).catch(err => {
      syncFailed(err.message);
      say('<span style="color:var(--bad);">' + esc(err.message) + "</span>");
      // Re-render so the banner appears on whatever page is open, not just on
      // /sync where `say` lands. Guarded: a failure during a render would recurse.
      if (!rendering) render();
      return false;
    }).then(v => { syncBusy = false; return v; });
  }

  // Push shortly after progress changes, so sync is not a chore to remember.
  let pushTimer = null;
  function syncSoon() {
    if (!ghToken() || syncQuiet) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => runSync("push"), 4000);
  }

  function syncPayload() {
    const state = {};
    ["lessons", "problems", "quizAttempts", "quizMisses", "diag", "gates", "studyDays",
     "weeks", "labs", "psets", "electives", "treasury", "review", "concepts", "anchors", "reps"]
      .forEach(k => state[k] = S[k]);
    state.settings = { theme: S.settings.theme, dailyStart: S.settings.dailyStart, streakFrom: S.settings.streakFrom };
    const ledgers = Object.assign({}, S.foreignLedgers);
    ledgers[S.settings.deviceId] = S.ledger;
    return { v: 1, updatedAt: new Date().toISOString(), device: S.settings.deviceId, state: state, ledgers: ledgers };
  }

  // ---------- SHA-256, synchronous, no dependencies ----------
  // The record's hash chain needs hashing inside the existing save paths.
  // crypto.subtle is async and would turn every checkbox handler into a
  // promise, so this is the plain implementation. Verified against Node's
  // crypto for the padding boundaries (55/56/63/64 bytes) and unicode.
  const sha256 = (function () {
    const K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    return function (msg) {
      const bytes = [];
      for (let i = 0; i < msg.length; i++) {
        let c = msg.codePointAt(i);
        if (c > 0xffff) i++;
        if (c < 0x80) bytes.push(c);
        else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
        else if (c < 0x10000) bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
        else bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      }
      const hi = Math.floor(bytes.length / 536870912), lo = (bytes.length * 8) >>> 0;
      bytes.push(0x80);
      while (bytes.length % 64 !== 56) bytes.push(0);
      bytes.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255,
                 (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
      let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
      const w = new Array(64);
      for (let off = 0; off < bytes.length; off += 64) {
        for (let i = 0; i < 16; i++)
          w[i] = ((bytes[off+i*4] << 24) | (bytes[off+i*4+1] << 16) | (bytes[off+i*4+2] << 8) | bytes[off+i*4+3]) >>> 0;
        for (let i = 16; i < 64; i++) {
          const s0 = rotr(w[i-15],7) ^ rotr(w[i-15],18) ^ (w[i-15] >>> 3);
          const s1 = rotr(w[i-2],17) ^ rotr(w[i-2],19) ^ (w[i-2] >>> 10);
          w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
        }
        let a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
        for (let i = 0; i < 64; i++) {
          const S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25);
          const ch = (e & f) ^ (~e & g);
          const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
          const S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22);
          const mj = (a & b) ^ (a & c) ^ (b & c);
          const t2 = (S0 + mj) >>> 0;
          h=g; g=f; f=e; e=(d + t1) >>> 0; d=c; c=b; b=a; a=(t1 + t2) >>> 0;
        }
        H = [(H[0]+a)>>>0,(H[1]+b)>>>0,(H[2]+c)>>>0,(H[3]+d)>>>0,(H[4]+e)>>>0,(H[5]+f)>>>0,(H[6]+g)>>>0,(H[7]+h)>>>0];
      }
      return H.map(x => x.toString(16).padStart(8, "0")).join("");
    };
  })();

  // ---------- the record: an append-only hash chain ----------
  // Every entry commits to the one before it, so removing or editing any past
  // entry changes every hash after it and the chain fails to verify. That
  // proves internal consistency; it cannot prove *when* something happened on
  // its own — for that the head hash gets published somewhere with its own
  // timestamp (see anchors on the Record page).
  const GENESIS = "brickford-genesis";
  // Sorted keys so the same entry always hashes identically.
  function canon(v) {
    if (v === null || typeof v !== "object") return JSON.stringify(v === undefined ? null : v);
    if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
    return "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
  }
  function logEvent(type, ref, data) {
    const prev = S.ledger.length ? S.ledger[S.ledger.length - 1].hash : GENESIS;
    const e = { i: S.ledger.length, ts: new Date().toISOString(), type: type, ref: String(ref || ""), data: data || {}, prev: prev };
    e.hash = sha256(canon(e));
    S.ledger.push(e);
    save();
    syncSoon();
    return e;
  }
  function verifyChain(list) {
    const L = list || S.ledger;
    for (let i = 0; i < L.length; i++) {
      const e = L[i];
      const body = { i: e.i, ts: e.ts, type: e.type, ref: e.ref, data: e.data, prev: e.prev };
      if (e.i !== i || e.prev !== (i ? L[i - 1].hash : GENESIS) || sha256(canon(body)) !== e.hash)
        return { ok: false, brokenAt: i, count: L.length };
    }
    return { ok: true, count: L.length, head: L.length ? L[L.length - 1].hash : GENESIS };
  }
  const chainHead = () => (S.ledger.length ? S.ledger[S.ledger.length - 1].hash : GENESIS);

  // ---------- computed ----------
  const dsaCount = () => Object.values(S.problems).filter(Boolean).length;
  const revenueTotal = () => S.treasury.entries.reduce((a, e) => a + (+e.amount || 0), 0);
  function streak() {
    const set = new Set(S.studyDays);
    const floor = S.settings.streakFrom || "";
    let n = 0;
    let cur = todayISO();
    // The streak survives until today ends, and a rest day is scheduled time
    // off — stepping over it must not end the run, or the platform punishes you
    // for keeping to its own plan. Rest days are skipped, never counted.
    if (!set.has(cur)) cur = addDaysISO(cur, -1);
    for (let guard = 0; guard < 4000; guard++) {
      // A reset draws a line: days before it are still sealed and still in the
      // record, they just belong to the previous run.
      if (cur < floor) break;
      if (isRestDay(cur)) { cur = addDaysISO(cur, -1); continue; }
      if (!set.has(cur)) break;
      n++;
      cur = addDaysISO(cur, -1);
    }
    return n;
  }
  // The longest run ever recorded, ignoring resets — so zeroing the counter
  // cannot erase the fact that you once went 21 days. Same rules: rest days are
  // stepped over, never counted.
  function bestStreak() {
    const days = S.studyDays.slice().sort();
    let best = 0, run = 0, prev = null;
    days.forEach(d => {
      if (prev) {
        let gap = addDaysISO(prev, 1);
        while (gap < d && isRestDay(gap)) gap = addDaysISO(gap, 1);
        run = gap === d ? run : 0;
      }
      run++;
      if (run > best) best = run;
      prev = d;
    });
    return best;
  }
  function bestQuiz(bankId) {
    const at = S.quizAttempts[bankId] || [];
    return at.length ? Math.max(...at.map(a => a.pct)) : null;
  }
  // Miss pool: wrong answers join, later correct answers on the same question leave.
  function updateMisses(bankId, missed, correct) {
    const cur = new Set(S.quizMisses[bankId] || []);
    (correct || []).forEach(i => cur.delete(i));
    (missed || []).forEach(i => cur.add(i));
    S.quizMisses[bankId] = Array.from(cur);
    save();
  }
  function missPool() {
    return Object.keys(S.quizMisses).flatMap(b =>
      (S.quizMisses[b] || [])
        .filter(i => D.QUIZZES[b] && D.QUIZZES[b].questions[i] != null)
        .map(i => ({ bankId: b, idx: i })));
  }
  function lessonKey(cid, u, i) { return cid + "." + u + "." + i; }
  function courseLessonStats(c) {
    let total = 0, done = 0, verified = 0;
    (c.units || []).forEach((u, ui) => u.lessons.forEach((_, li) => {
      total++;
      const st = S.lessons[lessonKey(c.id, ui, li)] || {};
      if (st.done) done++;
      if (st.verified) verified++;
    }));
    return { total, done, verified };
  }

  // ---------- watched is not learned ----------
  // Two separate numbers, deliberately. Coverage is how much of the syllabus
  // you have sat through; mastery is how much you have proven by recalling it
  // cold, solving problems unaided, and explaining it. A video you watched
  // moves coverage and nothing else.
  const PRACTICE_TARGET = 3;         // problems solved unaided per lecture
  const RECALL_MIN = 120;            // characters of a real blank-page attempt
  const EXPLAIN_MIN = 80;            // characters of a plain-language explanation
  // Three problems is right for a 50-minute MIT lecture and absurd for a
  // 10-minute chapter. A gate that is disproportionate gets faked, and a faked
  // gate destroys the value of the whole record.
  function practiceTarget(l) {
    if (l && l.solve) return l.solve;
    const m = l && l.min;
    if (!m) return 2;
    if (m <= 15) return 1;
    if (m <= 35) return 2;
    return 3;
  }
  function lessonGates(st, l) {
    st = st || {};
    const need = practiceTarget(l);
    return [
      { id: "recall", label: "Recalled cold", ok: (st.recall || "").trim().length >= RECALL_MIN,
        hint: "write what the lecture established, from memory" },
      { id: "rebuild", label: "Rebuilt from memory", ok: [0, 1, 2].every(i => (st.checks || [])[i]),
        hint: "tick the three rebuild steps" },
      { id: "solve", label: (st.solved || 0) + " of " + need + " problems unaided", ok: (st.solved || 0) >= need,
        hint: "solve " + need + " problems without help" },
      { id: "explain", label: "Explained plainly", ok: (st.notes || "").trim().length >= EXPLAIN_MIN,
        hint: "explain it in a few plain sentences" },
    ];
  }
  const lessonCanVerify = (st, l) => lessonGates(st, l).every(g => g.ok);

  // ---------- spaced recall ----------
  // A verified lecture comes back on a widening schedule. Forgetting it resets
  // the interval; recalling it solidly pushes it further out.
  const BOXES = [2, 7, 21, 60, 120];
  function scheduleReview(k, box) {
    const b = Math.max(0, Math.min(BOXES.length - 1, box || 0));
    S.review[k] = { box: b, due: addDaysISO(todayISO(), BOXES[b]), last: todayISO(),
                    lapses: (S.review[k] && S.review[k].lapses) || 0 };
  }
  function reviewsDue() {
    const today = todayISO();
    return Object.keys(S.review).filter(k => {
      const st = S.lessons[k];
      return st && st.verified && S.review[k].due <= today;
    }).sort((a, b) => S.review[a].due < S.review[b].due ? -1 : 1);
  }
  function lessonLabel(k) {
    const parts = k.split(".");
    const c = D.COURSES.find(x => x.id === parts[0]);
    if (!c || !c.units[parts[1]] || !c.units[parts[1]].lessons[parts[2]]) return k;
    return { code: c.code, cid: c.id, ui: +parts[1], li: +parts[2], title: c.units[parts[1]].lessons[parts[2]].t };
  }
  function courseMastery(c) {
    if (c.tracker) {
      const p = dsaCount() / 150;
      const q = bestQuiz(c.quiz);
      return Math.round((q == null ? p : p * 0.6 + (q / 100) * 0.4) * 100);
    }
    const { total, verified } = courseLessonStats(c);
    const lr = total ? verified / total : 0;
    const q = c.quiz ? bestQuiz(c.quiz) : null;
    return Math.round((q == null ? lr : lr * 0.6 + (q / 100) * 0.4) * 100);
  }
  // How much of the syllabus has been sat through — progress, not proof.
  function courseCoverage(c) {
    if (c.tracker) return Math.round(dsaCount() / 150 * 100);
    const { total, done } = courseLessonStats(c);
    return total ? Math.round(done / total * 100) : 0;
  }
  function standing(pct) {
    return pct >= 85 ? ["Mastered", "A"] : pct >= 70 ? ["Proficient", "B"] :
           pct >= 50 ? ["Developing", "C"] : pct > 0 ? ["Started", "D"] : ["Not begun", "—"];
  }
  function currentFocus() {
    const w = weekNumber();
    const row = D.WEEK_PLAN.find(r => w >= r.from && w <= r.to) || D.WEEK_PLAN[D.WEEK_PLAN.length - 1];
    return { week: w, focus: row.focus, tag: row.tag, phase: row.phase };
  }
  // Adaptive schedule: a gate's target = the previous gate's completion date
  // (its target while still open) + this gate's duration. Passing early pulls
  // every later target earlier. S.gates[n] stores the completion date
  // (legacy backups stored `true`; treated as passed today).
  function gatePlan() {
    let base = D.START_DATE;
    return D.GATES.map(g => {
      const raw = S.gates[g.n];
      const doneDate = raw === true ? todayISO() : (raw || null);
      const target = addStudyDays(base, Math.round(g.months * 30.4));
      base = doneDate || target;
      return Object.assign({}, g, { target, doneDate });
    });
  }
  function nextGate() { return gatePlan().find(g => !g.doneDate); }
  function currentPhase() {
    const w = weekNumber();
    return w > 78 ? 3 : w > 26 ? 2 : w > 2 ? 1 : 0;
  }
  function planDrift() {
    const plan = gatePlan();
    const last = plan[plan.length - 1];
    const baseline = addStudyDays(D.START_DATE, Math.round(D.GATES.reduce((a, g) => a + g.months, 0) * 30.4));
    const projected = last.doneDate || last.target;
    return { projected, aheadDays: daysBetween(projected, baseline) };
  }

  // ---------- calendar (Google-native, no OAuth, no API key) ----------
  function pad2(n) { return String(n).padStart(2, "0"); }
  function ymd(iso) { return iso.replace(/-/g, ""); }
  function addDaysISO(iso, n) {
    const p = iso.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2] + n);
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }
  function dailyStartTime() { return (S.settings.dailyStart || "08:00").split(":").map(Number); }
  function addMinutesClock(hhmm, mins) {
    const [h, m] = hhmm.split(":").map(Number);
    const t = ((h * 60 + m + mins) % 1440 + 1440) % 1440;
    return pad2(Math.floor(t / 60)) + ":" + pad2(t % 60);
  }
  function addMinutesClock(hhmm, mins) {
    const [h, m] = hhmm.split(":").map(Number);
    const total = h * 60 + m + mins;
    return pad2(Math.floor((total % 1440) / 60)) + ":" + pad2(total % 60);
  }
  // Google's own "quick add" URL — opens Calendar with the event pre-filled.
  // No sign-in flow of ours, no client ID, no API key: it's the same link
  // any "Add to Google Calendar" button on the web uses.
  function gcalUrl(title, details, opts) {
    opts = opts || {};
    let dates;
    if (opts.allDay) {
      dates = ymd(opts.startDate) + "/" + ymd(addDaysISO(opts.endDate || opts.startDate, 1));
    } else {
      const [sh, sm] = opts.atTime ? opts.atTime.split(":").map(Number) : dailyStartTime();
      const startMin = sh * 60 + sm, endMin = startMin + (opts.durationMin || 60);
      const t = m => pad2(Math.floor((m % 1440) / 60)) + pad2(m % 60) + "00";
      dates = ymd(opts.startDate) + "T" + t(startMin) + "/" + ymd(opts.startDate) + "T" + t(endMin);
    }
    const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates, details: details || "" });
    if (opts.recur) params.set("recur", "RRULE:" + opts.recur);
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }
  function buildICS() {
    const [sh, sm] = dailyStartTime();
    const endMin = sh * 60 + sm + 300; // ~5h Deep Track block
    const t = m => pad2(Math.floor((m % 1440) / 60)) + pad2(m % 60) + "00";
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const esc = s => String(s).replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
    const events = [];
    // Day 1 is never a rest day by construction, but anchor explicitly so this
    // survives a future change to REST_DOW.
    let icsFrom = D.START_DATE;
    while (isRestDay(icsFrom)) icsFrom = addDaysISO(icsFrom, 1);
    events.push([
      "BEGIN:VEVENT", "UID:brickford-daily@brickford.local", "DTSTAMP:" + stamp,
      "DTSTART:" + ymd(icsFrom) + "T" + t(sh * 60 + sm),
      "DTEND:" + ymd(icsFrom) + "T" + t(endMin),
      // Six days, not seven. BYDAY lists every day except the rest day.
      "RRULE:FREQ=WEEKLY;BYDAY=" + ICS_STUDY_DAYS,
      "SUMMARY:Brickford — Deep Track",
      "DESCRIPTION:" + esc("Theory ~2h, Build ~1.5h, Drill ~10min, Publish ~30min. Open the Dashboard for today's exact plan."),
      "END:VEVENT",
    ].join("\r\n"));
    const startDow = new Date(D.START_DATE + "T00:00:00").getDay();
    // A Sunday start date must not review a week that hasn't run yet.
    const sunday = addDaysISO(D.START_DATE, (7 - startDow) % 7 || 7);
    events.push([
      "BEGIN:VEVENT", "UID:brickford-review@brickford.local", "DTSTAMP:" + stamp,
      "DTSTART:" + ymd(sunday) + "T180000", "DTEND:" + ymd(sunday) + "T183000",
      "RRULE:FREQ=WEEKLY;BYDAY=SU",
      "SUMMARY:Brickford — Weekly Review (seal the week)",
      "DESCRIPTION:" + esc("No shipped artifact = a failed week. Fill the row before the day ends."),
      "END:VEVENT",
    ].join("\r\n"));
    gatePlan().filter(g => !g.doneDate).forEach(g => {
      events.push([
        "BEGIN:VEVENT", "UID:brickford-gate" + g.n + "@brickford.local", "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + ymd(g.target), "DTEND;VALUE=DATE:" + ymd(addDaysISO(g.target, 1)),
        "SUMMARY:" + esc("Brickford Gate " + g.n + " — " + g.label),
        "DESCRIPTION:" + esc(g.req),
        "END:VEVENT",
      ].join("\r\n"));
    });
    return "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Brickford//EN\r\nCALSCALE:GREGORIAN\r\n" + events.join("\r\n") + "\r\nEND:VCALENDAR\r\n";
  }

  function nextProblems(n) {
    const c = D.COURSES.find(x => x.tracker);
    const out = [];
    for (const cat of Object.keys(c.problems))
      for (const p of c.problems[cat])
        if (!S.problems[cat + "|" + p]) { out.push(p); if (out.length >= n) return out; }
    return out;
  }
  // The week-plan row that governs a given calendar date.
  function weekRowFor(iso) {
    const w = Math.max(1, Math.floor(Math.max(0, studyIndex(iso)) / STUDY_WEEK) + 1);
    const row = D.WEEK_PLAN.find(r => w >= r.from && w <= r.to) || D.WEEK_PLAN[D.WEEK_PLAN.length - 1];
    return { w, row };
  }
  // What was actually done on a given date — the per-day progress line.
  function dayActivity(iso) {
    let lessons = 0;
    Object.values(S.lessons).forEach(l => { if (l && l.doneAt === iso) lessons++; });
    let problems = 0;
    Object.values(S.problems).forEach(v => { if (v === iso) problems++; });
    const sealed = S.studyDays.includes(iso);
    return { lessons, problems, sealed, any: lessons + problems > 0 || sealed };
  }
  // ---------- the fixed syllabus ----------
  // Every date owns its lessons, permanently. Yesterday's content stays on
  // yesterday; tomorrow's is previewable today. Theory rotates the three
  // math courses (LA → Calc → Prob, two lessons per turn) so they advance
  // in parallel like real university courses; Build walks the AI spine in
  // order, one lesson per day. Progress never reshuffles this map.
  let _flatCache = null;
  function flatLessons(cid) {
    _flatCache = _flatCache || {};
    if (!_flatCache[cid]) {
      const c = D.COURSES.find(x => x.id === cid);
      const out = [];
      (c.units || []).forEach((u, ui) => u.lessons.forEach((l, li) => out.push({ cid, ui, li, l, code: c.code })));
      _flatCache[cid] = out;
    }
    return _flatCache[cid];
  }
  // ---- pacing: real video minutes → daily quotas ----
  // effort(min) ≈ watch + notes + immediate practice = minutes × 1.8 + 4.
  // Theory block ≈ 2h (120m), Build ≈ 1.5h (90m). Short videos pack several
  // to a day; a lesson whose effort exceeds its block spans days ("day 2 of 4").
  const EFFORT = m => m * 1.8 + 4;
  const THEORY_BUDGET = 120, BUILD_BUDGET = 90;
  // The Publish block DAR.SCHEDULE has always declared at ~30 min and nothing
  // ever filled. 40 effort-minutes is the owner's call: EFFORT(20) = 40, so it
  // is twenty minutes of video a day, and the day does not grow.
  const SPEECH_BUDGET = 40;
  function packWindows(flat, from, budget) {
    const out = [];
    let i = from;
    while (i < flat.length) {
      const e = EFFORT(flat[i].l.min || 50);
      if (e > budget * 1.15) {
        const n = Math.ceil(e / budget);
        for (let k = 1; k <= n; k++) out.push({ idxs: [i], dayN: k, spanN: n });
        i++;
      } else {
        let eff = 0, j = i;
        while (j < flat.length) {
          const ej = EFFORT(flat[j].l.min || 50);
          if (ej > budget * 1.15) break;
          if (j > i && eff + ej > budget * 1.05) break;
          eff += ej; j++;
        }
        const idxs = []; for (let k = i; k < j; k++) idxs.push(k);
        out.push({ idxs });
        i = j;
      }
    }
    return out;
  }
  let _winCache = null;
  function fixedWindows(key, flat, budget) {
    _winCache = _winCache || {};
    if (!_winCache[key]) _winCache[key] = packWindows(flat, 0, budget);
    return _winCache[key];
  }
  function firstUnfinished(flat) {
    for (let i = 0; i < flat.length; i++)
      if (!(S.lessons[lessonKey(flat[i].cid, flat[i].ui, flat[i].li)] || {}).done) return i;
    return flat.length;
  }
  // The work-ahead mechanism. Past days and today are frozen (history stays
  // history; today can be completed and turn green). Days AFTER today
  // re-anchor to your first unfinished lesson: clear more than today's quota
  // and tomorrow automatically asks for the NEXT lessons, never repeats.
  // Falling behind does NOT shift dates — missed lessons stay owed on their
  // own days and the backlog counts them.
  function windowFor(key, flat, budget, slot, todaySlot) {
    const fixed = fixedWindows(key, flat, budget);
    if (todaySlot < 0 && firstUnfinished(flat) === 0) return fixed[slot] || null;
    if (slot <= todaySlot) return fixed[slot] || null;
    const fu = firstUnfinished(flat);
    const nextFixedStart = todaySlot + 1 < fixed.length ? fixed[todaySlot + 1].idxs[0] : flat.length;
    if (fu <= nextFixedStart) return fixed[slot] || null;
    const dyn = packWindows(flat, fu, budget);
    return dyn[slot - todaySlot - 1] || null;
  }
  const THEORY_ROT = ["math110", "math120", "math130"];
  // Storytelling. Listed before the data exists on purpose: until a course with
  // one of these ids is present the Publish block simply emits nothing, so this
  // ships dark and lights up when the curriculum lands. No release coupling.
  const SPEECH_COURSES = ["spch100", "spch110"];
  const P2_DAY = 182; // day index where Phase 2 opens (week 27)
  // Pacing is calibrated to the gates: spine content done ~week 13 with
  // weeks 14-26 for the original-project block (Gate 2, month 6 = GPT from
  // scratch); papers at 3 weeks each put 8+ reimplementations before Gate 3
  // (month 12) and all 16 before Gate 4 (month 18).
  function scheduledFor(iso) {
    const d = studyIndex(iso);
    if (d < 0) return [];          // before the start, or a rest day
    const items = [];

    // ---- Theory ----
    // Stage 1: the three math courses rotate LA→Calc→Prob, each day's quota
    // packed from REAL video minutes to fill the ~2h block — ~5 short 3B1B
    // chapters, or one 50-minute MIT lecture. Future days re-anchor if you
    // work ahead (see windowFor).
    const dT = studyToday();
    const rotIdx = d % 3, rot = THEORY_ROT[rotIdx];
    const rotFlat = flatLessons(rot);
    const turn = Math.floor(d / 3);
    const todayTurn = dT < 0 ? -1 : Math.floor((dT - rotIdx) / 3); // this course's last turn on/before today
    const tw = windowFor("t:" + rot, rotFlat, THEORY_BUDGET, turn, todayTurn);
    let theoryAdded = false;
    if (tw) {
      tw.idxs.forEach(k => items.push(Object.assign({ track: "Theory", dayN: tw.dayN, spanN: tw.spanN }, rotFlat[k])));
      theoryAdded = tw.idxs.length > 0;
    }
    if (!theoryAdded && d >= P2_DAY) {
      // Stage 3 (week 27+): the depth chain — Math for ML daily, then GPU &
      // Systems and LLM Engineering every 2nd day, then Research every 3rd.
      const chain = [["math210", 1], ["sys250", 2], ["ai310", 2], ["res400", 3]];
      let off = d - P2_DAY;
      for (const [cid, span] of chain) {
        const flat = flatLessons(cid);
        const len = flat.length * span;
        if (off < len) {
          items.push(Object.assign({ track: "Theory", dayN: (off % span) + 1, spanN: span }, flat[Math.floor(off / span)]));
          theoryAdded = true;
          break;
        }
        off -= len;
      }
      // Classical mechanics runs as a parallel light track rather than a link in
      // the chain: 37 lectures inserted sequentially would push systems and LLM
      // engineering back by months. One lecture every fourth day covers the
      // course across weeks 27-48 without touching the spine.
      const physFlat = flatLessons("phys100");
      const pIdx = Math.floor((d - P2_DAY) / 4);
      if ((d - P2_DAY) % 4 === 0 && pIdx >= 0 && pIdx < physFlat.length)
        items.push(Object.assign({ track: "Theory", dayN: 1, spanN: 1 }, physFlat[pIdx]));
    }
    if (!theoryAdded) {
      // Stage 2 (math done → week 26): psets and exam prep keep the blade sharp.
      items.push(d < P2_DAY
        ? { track: "Theory", pseudo: true, short: "Psets", t: "Problem sets & exam prep — MIT psets, Stat 110 practice, checkpoint exams", href: "#/workshop" }
        : { track: "Theory", pseudo: true, short: "Frontier", t: "Frontier study on your fork — new papers, ARENA, outside courses", href: "#/electives" });
    }

    // ---- Build ----
    // The spine (Zero to Hero → fast.ai), packed by real minutes into the
    // ~1.5h block: short primer videos pair up; a 2h+ Karpathy build spans
    // several days ("day 2 of 4"). Future days re-anchor if you work ahead.
    const spineFlat = flatLessons("ai200").concat(flatLessons("ai210"));
    const bw = windowFor("b:spine", spineFlat, BUILD_BUDGET, d, dT < 0 ? -1 : dT);
    let buildAdded = false;
    if (bw) {
      bw.idxs.forEach(k => items.push(Object.assign({ track: "Build", dayN: bw.dayN, spanN: bw.spanN }, spineFlat[k])));
      buildAdded = bw.idxs.length > 0;
    }
    if (!buildAdded) {
      if (d < P2_DAY) {
        // Weeks ~14–26: the original-project block that fills Gate 2.
        items.push({ track: "Build", pseudo: true, short: "Project", t: "Original project block — your GPT on your corpus, nanoGPT depth, labs (see week focus)", href: "#/workshop" });
      } else {
        // Week 27+: the Paper Room, one canonical paper per 3 weeks.
        const papers = flatLessons("ai300");
        const pi = Math.floor((d - P2_DAY) / 21);
        if (pi < papers.length) items.push(Object.assign({ track: "Build", dayN: ((d - P2_DAY) % 21) + 1, spanN: 21 }, papers[pi]));
        else items.push({ track: "Build", pseudo: true, short: "Frontier", t: "Frontier build — ship on your fork: labs, open source, product", href: "#/workshop" });
      }
    }

    // ---- Publish ----
    // The fourth subject. Five days a week; Friday carries the weekly rep.
    const sd = speechSlot(iso);
    const speechFlat = SPEECH_COURSES
      .filter(cid => D.COURSES.some(c => c.id === cid))
      .reduce((a, cid) => a.concat(flatLessons(cid)), []);
    if (speechFlat.length) {
      if (sd >= 0) {
        const sToday = speechSlot(todayISO());
        const sw = windowFor("s:speech", speechFlat, SPEECH_BUDGET, sd, sToday);
        if (sw) sw.idxs.forEach(k =>
          items.push(Object.assign({ track: "Publish", dayN: sw.dayN, spanN: sw.spanN }, speechFlat[k])));
      }
    }
    return items;
  }
  function schedDone(it) { return !it.pseudo && !!(S.lessons[lessonKey(it.cid, it.ui, it.li)] || {}).done; }
  function realSched(iso) { return scheduledFor(iso).filter(it => !it.pseudo); }
  // A scheduled block that is not a lecture — the later weeks where a course has
  // run out of lessons and the day is project or frontier work. Real lectures go
  // through dayGroupsHTML below, on both pages that show a day.
  function pseudoRowHTML(it) {
    return '<a class="grow" href="' + it.href + '"><span class="g-lead">\u00b7</span>' +
      '<span class="g-main"><span class="g-t">' + esc(it.t) + '</span>' +
      '<span class="g-s">' + esc(it.track) + '</span></span></a>';
  }
  // The day, grouped by course.
  //
  // Nine separate cards meant nine borders, nine "Open" buttons and six rows
  // each announcing "MATH 110" - 987px of scrolling for one day, repeated
  // every day for three years. The information was never nine things; it was
  // three courses with a few lectures each.
  //
  // So: one card per run of the same course, its code stated once in the
  // header with the run's totals, and the lectures as rows inside it. The row
  // itself is the link, which retires nine button labels. Same content, about
  // half the height, and the shape of the day is visible at a glance.
  function dayGroupsHTML(items) {
    const runs = [];
    items.forEach(it => {
      const last = runs[runs.length - 1];
      if (last && last.cid === it.cid) last.items.push(it);
      else runs.push({ cid: it.cid, code: it.code, track: it.track, items: [it] });
    });
    let n = 0;
    return runs.map(run => {
      const fc = D.COURSES.find(x => x.id === run.cid);
      const mins = run.items.reduce((a, it) => a + (it.l.min || 0), 0);
      const doneN = run.items.filter(schedDone).length;
      return '<div class="ghead">' + esc(run.code) + " \u00b7 " + esc(run.track) +
        '<span class="gh-meta">' +
        (doneN ? doneN + " / " + run.items.length + " done" : run.items.length + " lecture" + (run.items.length === 1 ? "" : "s")) +
        (mins ? " \u00b7 " + (mins >= 60 ? Math.floor(mins / 60) + "h" + (mins % 60 ? pad2(mins % 60) : "") : mins + "m") : "") +
        "</span></div>" +
        '<div class="glist">' + run.items.map(it => {
          const dn = schedDone(it);
          n++;
          const dur = it.l.min ? it.l.min + "m" : it.l.paper ? "paper" : "reading";
          return '<a class="grow ' + (fc ? facClass(fc) : "") + (dn ? " done-row" : "") + '" href="#/lesson/' +
            it.cid + "/" + it.ui + "/" + it.li + '">' +
            '<span class="g-lead">' + (dn ? "\u2713" : n) + "</span>" +
            '<span class="g-main"><span class="g-t">' + esc(it.l.t) + "</span></span>" +
            '<span class="g-v">' + esc(dur) +
            (it.spanN > 1 ? " \u00b7 " + it.dayN + "/" + it.spanN : "") + "</span></a>";
        }).join("") + "</div>";
    }).join("");
  }

  // Unfinished scheduled lessons from days already past (multi-day lessons
  // count once — via a set of lesson keys).
  // The first day you actually did something. Before that there is no debt:
  // a syllabus that assigns lessons to dates you were never present for will
  // greet a new arrival with a backlog, which is both false and discouraging.
  function firstActivityISO() {
    let first = null;
    S.studyDays.forEach(d => { if (!first || d < first) first = d; });
    Object.values(S.lessons).forEach(l => { if (l && l.doneAt && (!first || l.doneAt < first)) first = l.doneAt; });
    Object.values(S.problems).forEach(v => { if (typeof v === "string" && (!first || v < first)) first = v; });
    return first;
  }
  function backlogCount() {
    const today = todayISO();
    const from = firstActivityISO();
    if (!from) return 0;                       // nothing started, nothing owed
    const owed = new Set();
    for (let iso = (from > D.START_DATE ? from : D.START_DATE); iso < today; iso = addDaysISO(iso, 1)) {
      if (isRestDay(iso)) continue;                 // a day off owes nothing
      realSched(iso).forEach(it => { if (!schedDone(it)) owed.add(lessonKey(it.cid, it.ui, it.li)); });
    }
    return owed.size;
  }
  // Status of a calendar day: judged against ITS OWN scheduled lessons —
  // catching up late still turns the day green. Falls back to activity
  // for days beyond the scheduled syllabus.
  function dayStatus(iso) {
    const today = todayISO();
    if (isRestDay(iso) && iso >= D.START_DATE) return "rest";
    if (iso > today) return "upcoming";
    if (iso === today) return "today";
    const sched = realSched(iso);
    if (sched.length) {
      const done = sched.filter(schedDone).length;
      if (done === sched.length) return "completed";
      if (done > 0 || dayActivity(iso).any) return "partial";
      return "missed";
    }
    const a = dayActivity(iso);
    if (a.sealed) return "completed";
    if (a.any) return "partial";
    return "missed";
  }

  // ---------- charts (hand-rolled SVG, single-series, chart ink = brand) ----------
  function lineChart(values, labels, opts) {
    const o = Object.assign({ w: 560, h: 150, pad: 26, color: "var(--accent-2)" }, opts);
    if (!values.length) return '<p style="color:var(--ink-3); font-size:var(--fs-small);">No entries yet — data appears as you log weekly reviews.</p>';
    const max = Math.max(...values, 1), min = 0;
    const X = i => o.pad + (i * (o.w - 2 * o.pad)) / Math.max(values.length - 1, 1);
    const Y = v => o.h - o.pad - ((v - min) * (o.h - 2 * o.pad)) / (max - min || 1);
    const pts = values.map((v, i) => X(i) + "," + Y(v)).join(" ");
    const dots = values.map((v, i) =>
      '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="7" fill="transparent" data-tip="' + esc(labels[i] + ": " + v) + '"/>' +
      '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="3" fill="' + o.color + '" pointer-events="none"/>'
    ).join("");
    const gridY = [0.5].map(f => { const y = Y(min + (max - min) * f); return '<line class="grid-line" x1="' + o.pad + '" y1="' + y + '" x2="' + (o.w - o.pad) + '" y2="' + y + '"/>'; }).join("");
    return '<div class="chart"><svg viewBox="0 0 ' + o.w + " " + o.h + '" role="img">' + gridY +
      '<text class="axis-label" x="' + o.pad + '" y="12">' + max + '</text>' +
      '<polyline fill="none" stroke="' + o.color + '" stroke-width="2" stroke-linejoin="round" points="' + pts + '"/>' + dots + "</svg></div>";
  }
  function barChart(values, labels, opts) {
    const o = Object.assign({ w: 560, h: 150, pad: 26 }, opts);
    if (!values.length) return '<p style="color:var(--ink-3); font-size:var(--fs-small);">No revenue logged yet — the Treasury feeds this.</p>';
    const max = Math.max(...values, 1);
    const bw = Math.min(34, ((o.w - 2 * o.pad) / values.length) - 4);
    const bars = values.map((v, i) => {
      const x = o.pad + i * ((o.w - 2 * o.pad) / values.length);
      const h = ((v / max) * (o.h - 2 * o.pad)) || 0;
      const y = o.h - o.pad - h;
      return '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + Math.max(h, 1) + '" rx="3" fill="var(--accent)" data-tip="' + esc(labels[i] + ": " + fmtBHD(v)) + '"/>';
    }).join("");
    return '<div class="chart"><svg viewBox="0 0 ' + o.w + " " + o.h + '" role="img"><line class="grid-line" x1="' + o.pad + '" y1="' + (o.h - o.pad) + '" x2="' + (o.w - o.pad) + '" y2="' + (o.h - o.pad) + '"/>' + bars + "</svg></div>";
  }
  function wireChartTips(root) {
    const tip = $("#chartTip");
    $$("[data-tip]", root).forEach(elm => {
      elm.addEventListener("mousemove", e => {
        tip.textContent = elm.dataset.tip;
        tip.style.left = e.clientX + 12 + "px";
        tip.style.top = e.clientY - 30 + "px";
        tip.classList.add("show");
      });
      elm.addEventListener("mouseleave", () => tip.classList.remove("show"));
    });
  }

  // ---------- tiny markdown ----------
  function md(src) {
    const lines = src.split(/\r?\n/);
    let html = "", inList = false, inTable = false;
    const inline = s => esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    const closeAll = () => { if (inList) { html += "</ul>"; inList = false; } if (inTable) { html += "</tbody></table></div>"; inTable = false; } };
    for (let raw of lines) {
      const l = raw.trimEnd();
      if (/^\|/.test(l.trim())) {
        const cells = l.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
        if (cells.every(c => /^:?-{2,}:?$/.test(c))) continue;
        if (!inTable) { closeAll(); html += '<div class="table-wrap"><table><tbody>'; inTable = true; }
        html += "<tr>" + cells.map(c => "<td>" + inline(c) + "</td>").join("") + "</tr>";
        continue;
      } else if (inTable) { html += "</tbody></table></div>"; inTable = false; }
      if (/^### /.test(l)) { closeAll(); html += "<h3>" + inline(l.slice(4)) + "</h3>"; }
      else if (/^## /.test(l)) { closeAll(); html += "<h2>" + inline(l.slice(3)) + "</h2>"; }
      else if (/^# /.test(l)) { closeAll(); html += "<h1>" + inline(l.slice(2)) + "</h1>"; }
      else if (/^---+$/.test(l)) { closeAll(); html += "<hr>"; }
      else if (/^> /.test(l)) { closeAll(); html += "<blockquote>" + inline(l.slice(2)) + "</blockquote>"; }
      else if (/^[-*] /.test(l) || /^- \[[ x]\] /.test(l)) {
        if (!inList) { closeAll(); html += "<ul>"; inList = true; }
        html += "<li>" + inline(l.replace(/^[-*] (\[[ x]\] )?/, "")) + "</li>";
      }
      else if (/^\d+\. /.test(l)) {
        if (!inList) { closeAll(); html += "<ul>"; inList = true; }
        html += "<li>" + inline(l.replace(/^\d+\. /, "")) + "</li>";
      }
      else if (l === "") { closeAll(); }
      else { closeAll(); html += "<p>" + inline(l) + "</p>"; }
    }
    closeAll();
    return html;
  }

  // ---------- views ----------
  const V = {};

  // ---------- the practice layer ----------
  // What is owed today, derived — never a stored "pending" flag, which would go
  // stale the moment the clock moved.
  function repsDue(iso) {
    iso = iso || todayISO();
    if (isRestDay(iso) || iso < D.START_DATE) return [];      // Saturday owes nothing
    const out = [];
    if (!(S.reps.bank || []).some(e => e.date === iso))
      out.push({ kind: "bank", label: "Story bank", hint: "one real thing, two lines" });
    if (dowOf(iso) === SPEECH_OFF_DOW) {
      const wk = weekOf(iso);
      if (!(S.reps.story || []).some(e => weekOf(e.date) === wk))
        out.push({ kind: "story", label: "Story rep", hint: "one from the bank, recorded, under 90s" });
      if (!(S.reps.humor || []).some(e => weekOf(e.date) === wk))
        out.push({ kind: "humor", label: "Humour rep", hint: "five attempts, most will be bad" });
    }
    // The monthly review was reachable only by scrolling to a form that was
    // always on screen. Now that the page shows what is owed, it has to be able
    // to BE owed - otherwise it can never be done at all. It comes due once
    // there is a recording four weeks old and no review since.
    const old4 = addDaysISO(iso, -28);
    const hasOld = (S.reps.story || []).some(e => e.date <= old4);
    const lastRev = (S.reps.review || []).reduce((a, e) => (e.date > a ? e.date : a), "");
    if (hasOld && (!lastRev || lastRev <= old4))
      out.push({ kind: "review", label: "Monthly review", hint: "rewatch the recording from four weeks ago" });
    return out;
  }
  // Which plan week a date belongs to, so "one a week" means one per plan week
  // rather than one per rolling seven days.
  function weekOf(iso) {
    const d = studyIndex(iso);
    return d < 0 ? -1 : Math.floor(d / STUDY_WEEK);
  }

  // ---------- the one next action ----------
  // A dashboard that offers eight equal choices is one you stand in front of
  // instead of using. This resolves the single thing to do, and both the hero
  // and the rail render the same answer — so the next lecture is one tap away
  // from any page rather than something to navigate back to.
  // Karpathy's lecture titles run past 60 characters; a button is not a place
  // for a sentence.
  const clipTitle = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/[\s—·-]+$/, "") + "…" : s);
  function nextAction() {
    const real = realSched(todayISO());
    const nextUp = real.find(it => !schedDone(it));
    const due = reviewsDue();
    if (nextUp) {
      const c = D.COURSES.find(x => x.id === nextUp.cid);
      return {
        href: "#/lesson/" + nextUp.cid + "/" + nextUp.ui + "/" + nextUp.li,
        kind: "lecture", code: nextUp.code, title: nextUp.l.t,
        fac: c ? facClass(c) : "",
        label: clipTitle(nextUp.l.t, 34),
        hint: (nextUp.l.min ? nextUp.l.min + "m video · " : "") +
              (real.indexOf(nextUp) + 1) + " of " + real.length + " today",
        verb: "Open",
      };
    }
    if (due.length) return {
      href: "#/recall", kind: "recall", code: "RECALL",
      title: due.length + " lecture" + (due.length === 1 ? "" : "s") + " due",
      label: "Recall " + due.length + " lecture" + (due.length === 1 ? "" : "s"),
      hint: "due before new material", verb: "Start",
    };
    if (S.settings.lastLesson) {
      const L = S.settings.lastLesson;
      return {
        href: "#/lesson/" + L.cid + "/" + L.ui + "/" + L.li, kind: "resume", code: "RESUME",
        title: L.label, label: "Resume " + clipTitle(L.label, 40),
        hint: "picking up where you stopped", verb: "Resume",
      };
    }
    if (isRestDay(todayISO()) && todayISO() >= D.START_DATE) return {
      href: "#/calendar", kind: "rest", code: "REST",
      title: REST_NAME + " is off",
      label: "Rest day — nothing due", hint: "six days a week; your streak is safe",
      verb: "Calendar",
    };
    return {
      href: "#/atlas", kind: "none", code: "TODAY", title: "Nothing scheduled",
      label: "Open the Atlas", hint: "nothing scheduled today", verb: "Atlas",
    };
  }

  // ---------- a spring ----------
  //
  // apple-design 4: a fixed-duration animation cannot respond to new input; a
  // spring can, because new input only changes the target. No library — this is
  // a no-build static app — so this is the whole thing in fifteen lines, in
  // Apple's own two parameters rather than mass/stiffness/damping:
  //
  //   response  how quickly it reaches the target, in seconds
  //   damping   1.0 is critically damped (no overshoot); below 1 bounces
  //
  // It returns its live value so an interrupt can start from the PRESENTATION
  // value rather than the logical one, which is the difference between grabbing
  // a moving drawer and watching it jump (apple-design 3).
  function spring(from, to, opts, onFrame, onDone) {
    const resp = (opts && opts.response) || 0.4;
    const damp = (opts && opts.damping) || 1.0;
    let x = from, v = (opts && opts.velocity) || 0;
    const w = (2 * Math.PI) / resp;
    let raf = null, last = performance.now(), dead = false;
    function step(now) {
      const dt = Math.min((now - last) / 1000, 1 / 30);   // clamp: a backgrounded tab must not teleport
      last = now;
      const a = -w * w * (x - to) - 2 * damp * w * v;
      v += a * dt; x += v * dt;
      if (Math.abs(x - to) < 0.5 && Math.abs(v) < 25) { x = to; v = 0; onFrame(x, v); dead = true; if (onDone) onDone(); return; }
      onFrame(x, v);
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return {
      cancel() { if (raf) cancelAnimationFrame(raf); dead = true; },
      get value() { return x; },
      get velocity() { return v; },
      get done() { return dead; },
    };
  }

  // apple-design 6: land where the gesture is GOING, not where the finger left.
  // This is Apple's own projection from the Designing Fluid Interfaces sample —
  // exponential decay, not the textbook v²/2a.
  function projectMomentum(velocity, decel) {
    const d = decel || 0.998;
    return (velocity / 1000) * d / (1 - d);
  }

  // ---------- the drawer ----------
  //
  // It was classList.toggle("open") against a CSS transition: no drag, no
  // velocity, no scrim, and impossible to grab once it was moving. Now it
  // tracks the finger 1:1, projects the throw, hands the release velocity to
  // the spring so there is no seam between dragging and settling, and can be
  // caught and reversed at any frame.
  let drawer = null;
  function mountDrawer() {
    const el = $("#sidebar"), btn = $("#menuBtn");
    if (!el || !btn) return;
    let scrim = $("#scrim");
    if (!scrim) {
      scrim = document.createElement("div");
      scrim.id = "scrim"; scrim.className = "scrim";
      document.body.appendChild(scrim);
    }
    const width = () => Math.round(el.getBoundingClientRect().width) || 264;
    const phone = () => window.matchMedia("(max-width: 860px)").matches;
    const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = -width(), anim = null, drag = null;
    const swallow = e => e.preventDefault();

    function paint(px) {
      x = px;
      const w = width();
      const p = Math.max(0, Math.min(1, 1 + px / w));      // 0 shut … 1 open
      el.style.transform = "translateX(" + px + "px)";
      scrim.style.opacity = String(p);
      // Deliberately NOT touched while a drag is live. Making the scrim
      // hit-testable partway through a gesture changes the element under the
      // pointer, and Chromium answers that by cancelling the pointer outright:
      // the window saw one pointermove and then a pointercancel, which end()
      // read as a release and sprang the drawer shut after 35px of travel. The
      // scrim only starts taking taps once the gesture is over.
      if (!drag) scrim.style.pointerEvents = p > 0.02 ? "auto" : "none";
      el.classList.toggle("open", p > 0.5);
      document.documentElement.classList.toggle("drawer-open", p > 0.5);
    }
    function settle(to, vel) {
      if (anim) anim.cancel();
      // Reduced motion still gets the state change, just without the travel.
      if (reduce()) { paint(to); return; }
      anim = spring(x, to, { response: 0.34, damping: 1, velocity: vel || 0 }, paint);
    }
    const open = () => settle(0, 0);
    const shut = () => settle(-width(), 0);

    // ---- the gesture ----
    function begin(e, fromEdge) {
      if (!phone()) return;
      if (anim) { anim.cancel(); anim = null; }        // grab it mid-flight
      drag = { id: e.pointerId, x0: e.clientX, base: x, hist: [], moved: false, fromEdge };
      // The moves are tracked on WINDOW, not via setPointerCapture on the
      // element that took the pointerdown. Two reasons, both found by watching
      // the events rather than reasoning about them: the edge strip is 20px
      // wide, so a committed drag has long left it; and the scrim this gesture
      // fades in becomes hit-testable partway through and takes the capture off
      // the element that owned it — the log showed lostpointercapture one move
      // after pointerdown. Window listeners cannot be stolen from.
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      // Deny the browser its own gesture. Logging every event on the window
      // showed the real cause of the dead drag: pointerdown, one pointermove,
      // then `dragstart` — Chromium beginning a native drag-and-drop — and
      // immediately `pointercancel`, which killed the stream. Suppressing
      // selection and the drag at the source is what keeps the pointer ours.
      window.addEventListener("dragstart", swallow);
      window.addEventListener("selectstart", swallow);
      el.style.transition = "none";
    }
    function move(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0;
      if (!drag.moved) {
        if (Math.abs(dx) < 8) return;                  // hysteresis before committing
        drag.moved = true;
      }
      drag.hist.push({ x: e.clientX, t: performance.now() });
      if (drag.hist.length > 5) drag.hist.shift();
      let next = drag.base + dx;
      // apple-design 9: resist past the edge rather than stopping dead.
      if (next > 0) next = (next * 0.35);
      paint(Math.max(-width() * 1.2, Math.min(next, 24)));
      e.preventDefault();
    }
    function end(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.removeEventListener("dragstart", swallow);
      window.removeEventListener("selectstart", swallow);
      scrim.style.pointerEvents = x > -width() * 0.98 ? "auto" : "none";
      if (!d.moved) return;
      // Velocity from the last few samples, not the final one — a single frame
      // at the end of a gesture is noise.
      let vel = 0;
      if (d.hist.length > 1) {
        const a = d.hist[0], b = d.hist[d.hist.length - 1];
        const dt = (b.t - a.t) / 1000;
        if (dt > 0) vel = (b.x - a.x) / dt;
      }
      const w = width();
      const projected = x + projectMomentum(vel);
      settle(projected > -w / 2 ? 0 : -w, vel);
    }

    // Any part of it showing is enough to grab — the test for this used the
    // "open" class, which only flips past halfway, so a drawer caught at 36% of
    // its travel ignored the finger and carried on closing. apple-design 3: a
    // moving element has to be catchable at ANY frame, not only a majority one.
    el.addEventListener("pointerdown", e => { if (x > -width() + 2) begin(e, false); });

    // A left-edge strip so the drawer can be pulled in from a closed state —
    // the gesture people already expect from every app on the phone.
    const edge = document.createElement("div");
    edge.className = "edge-grab";
    document.body.appendChild(edge);
    edge.addEventListener("pointerdown", e => begin(e, true));

    btn.onclick = () => (el.classList.contains("open") ? shut() : open());
    scrim.onclick = shut;
    // Tapping through to a page closes the drawer behind you.
    el.addEventListener("click", e => { if (e.target.closest("a[href^='#/']")) shut(); });
    window.addEventListener("keydown", e => { if (e.key === "Escape" && el.classList.contains("open")) shut(); });
    // A rotate or a resize past the breakpoint must not strand it mid-travel.
    window.addEventListener("resize", () => {
      if (!phone()) { if (anim) anim.cancel(); el.style.transform = ""; scrim.style.opacity = "0"; scrim.style.pointerEvents = "none"; el.classList.remove("open"); document.documentElement.classList.remove("drawer-open"); x = -width(); }
      else paint(el.classList.contains("open") ? 0 : -width());
    });

    paint(-width());
    drawer = { open, shut };
  }

  // The rail, and its collapsed one-line form for phones. Same data, both
  // rendered outside #view so they survive every route change.
  function mountRail() {
    const a = nextAction();
    const real = realSched(todayISO());
    const doneToday = real.filter(schedDone).length;
    const pct = real.length ? (doneToday / real.length) * 100 : (S.studyDays.includes(todayISO()) ? 100 : 0);
    const studied = S.studyDays.includes(todayISO());

    // The rail exists so the next lecture is one tap from ANY page. On the
    // dashboard it is not one tap away, it is already the largest thing on the
    // screen — and since the hero became the lecture the two carried the same
    // four facts word for word, 400px apart: the code, the title, "17m video ·
    // 1 of 6 today", and the count. So it stows on "/" and works everywhere else.
    const rail = $("#rail");
    if (rail) rail.classList.toggle("stowed", route() === "/");
    if (rail) rail.innerHTML =
      '<div class="rail-card ' + (a.fac || "") + '">' +
      '<div class="rl-ring">' + ringHTML(pct, real.length ? doneToday + "/" + real.length : (studied ? "✓" : "—"), "today", pct >= 100 ? "good" : "", 84) + "</div>" +
      '<div class="rl-label">Next up</div>' +
      '<div class="rl-code">' + esc(a.code) + "</div>" +
      '<div class="rl-title">' + esc(clipTitle(a.title, 56)) + "</div>" +
      '<div class="rl-meta">' + esc(a.hint) + "</div>" +
      '<a class="btn" href="' + a.href + '">' + esc(a.verb) + " ▸</a>" +
      (studied
        ? '<div class="rl-foot"><span>Day sealed</span><b style="color:var(--good);">✓</b></div>'
        : '<div class="rl-foot"><span>Streak</span><b>' + streak() + "d</b></div>") +
      "</div>";

    const bar = $("#railbar");
    if (bar) bar.innerHTML =
      '<span class="rb-main"><span class="rb-label">Next</span>' +
      '<span class="rb-t">' + esc(a.code) + " · " + esc(a.title) + "</span></span>" +
      '<a class="btn" href="' + a.href + '">' + esc(a.verb) + " ▸</a>";
    measureFurniture();
    watchHeroCta();
  }

  // On a phone the dashboard shows the next lecture twice at once: the hero's
  // own big button, and the sticky bar pinned over it. Two buttons for one
  // action, both on screen, is a choice the reader has to make and shouldn't.
  // The sticky bar exists for when the hero has scrolled away, so let it mean
  // that: hidden while the hero button is visible, back the moment it isn't.
  // Falls open (bar always shown) wherever IntersectionObserver is missing.
  let ctaObs = null;
  function watchHeroCta() {
    const bar = $("#railbar");
    if (ctaObs) { ctaObs.disconnect(); ctaObs = null; }
    if (!bar) return;
    // .one.lead is the dashboard's action card and only the dashboard's: the bar
    // stows because it would sit on top of the SAME action, and on every other
    // page the .one-go is a different one (sit the exam, mark a gate passed).
    const cta = $(".one.lead .one-go");
    // No hero button on this route, or no observer: the bar is the only handle.
    if (!cta || typeof IntersectionObserver === "undefined") {
      bar.classList.remove("stowed"); measureFurniture(); return;
    }
    ctaObs = new IntersectionObserver(es => {
      // Deliberately NOT re-measuring here. The bar keeps its reserved space
      // while stowed, so the page's bottom padding is constant and nothing
      // shifts under the reader's thumb as it slides in and out.
      bar.classList.toggle("stowed", es.some(e => e.isIntersecting));
    }, { threshold: 0.6 });
    ctaObs.observe(cta);
  }

  // The tab bar is 58px on paper and 66px in fact — its padding carries
  // env(safe-area-inset-bottom), which no stylesheet can predict. A hard-coded
  // guess put the action bar 8px on top of it. So measure both and publish the
  // real heights, which is also what reserves the right amount of scroll room.
  function measureFurniture() {
    const set = (name, el) => {
      const h = el && getComputedStyle(el).display !== "none" ? Math.ceil(el.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty(name, h + "px");
    };
    set("--tabbar-h", $(".tabbar"));
    set("--railbar-h", $("#railbar"));
  }

  V.dashboard = function () {
    const resting = isRestDay(todayISO()) && todayISO() >= D.START_DATE;
    const day = Math.max(1, (resting ? studyIndex(prevStudyDay(todayISO())) : studyToday()) + 1);
    const f = currentFocus();
    const g = nextGate();
    const st = streak();
    const studiedToday = S.studyDays.includes(todayISO());
    const weeksArr = S.weeks.slice(-12);
    const backupAge = S.settings.lastBackup ? daysBetween(S.settings.lastBackup, todayISO()) : null;
    const todaySched = scheduledFor(todayISO());
    const real = todaySched.filter(it => !it.pseudo);
    const doneToday = real.filter(schedDone).length;
    const backlog = backlogCount();
    const probs = nextProblems(2);
    const trackerC = D.COURSES.find(x => x.tracker);
    const probsCat = trackerC ? Object.keys(trackerC.problems).find(cat => trackerC.problems[cat].some(p => !S.problems[cat + "|" + p])) : null;
    const drift = planDrift();
    const due = reviewsDue();
    const proven = Object.values(S.lessons).filter(l => l && l.verified).length;
    const dayPct = real.length ? (doneToday / real.length) * 100 : (studiedToday ? 100 : 0);
    const charted = weeksArr.some(w => (+w.dsa || 0) || (+w.revenue || 0));

    // Gate progress: how far through this gate's own window we are, so the
    // ring reads as "time spent" against the countdown beside it.
    // gatePct went with the Standing card's second progress ring — the countdown
    // is the number that matters and it is now a row.
    const gateLeft = g ? Math.max(0, daysBetween(todayISO(), g.target)) : 0;

    const cta = nextAction();


    const totalMin = real.reduce((s, it) => s + (it.l.min || 0), 0);

    return '<div class="view-enter">' +
      // ---- The one thing: the next lecture ----
      //
      // This was a .dash-hero: its own card component, with its own context
      // line, its own kicker and its own button slot, styled in forty lines of
      // CSS nobody else could use. Every other page opens with .one — the same
      // idea, the same faculty edge, the same full-width button. Two components
      // were answering one question, which is the whole complaint this round is
      // about, so the hero is now a .one like the rest and the day/week/phase
      // line is a .ghead, the header shape this page already uses twice below.
      '<div class="card one lead ' + (cta.fac || "") + '">' +
      '<div class="ghead oh">Day ' + String(day).padStart(3, "0") + " \u00b7 Week " + f.week +
      '<span class="gh-meta">Phase ' + f.phase +
      (real.length ? " \u00b7 " + doneToday + " / " + real.length + " today"
        : studiedToday ? " \u00b7 day sealed \u2713" : "") + "</span>" +
      "</div>" +
      '<div class="one-kind">' + esc(cta.title) + "</div>" +
      '<p class="one-hint">' + esc(cta.code) + " \u00b7 " + esc(cta.hint) + "</p>" +
      // The bar is a progress ring's job done in 4px. Only once there is
      // progress to draw: an empty track reads as an unfinished element rather
      // than as "none yet".
      (dayPct > 0
        ? '<div style="max-width:420px; margin-top:10px;"><div class="bar grow"><i style="--w:' + (dayPct / 100) + '; transform:scaleX(' + (dayPct / 100) + ');"></i></div></div>'
        : "") +
      '<a class="btn lg one-go" href="' + cta.href + '">' + esc(cta.verb) + " \u25b8</a>" +
      "</div>" +

      // ---- Anything wrong, in one place ----
      //
      // Two alert banners in a component of their own (.task.owed, with its own
      // number bubble, its own three-line body and its own go label) used to sit
      // in two different places on this page — one above the day, one below it.
      // They are rows now, in one group, above everything, because "something is
      // wrong" is the only thing that outranks the day's work.
      (function () {
        const rows = [];
        const e = S.settings.syncError;
        // Two different failures needing different words. No token is a device
        // nobody connected. A token that errors is worse — it looked connected
        // the whole time it was diverging — so it says what GitHub said.
        if (!ghToken())
          rows.push('<a class="grow" href="#/sync"><span class="g-lead bad-lead">!</span>' +
            '<span class="g-main"><span class="g-t">This device is not syncing</span>' +
            '<span class="g-s">progress stays in this browser only</span></span></a>');
        else if (e)
          rows.push('<a class="grow" href="#/sync"><span class="g-lead bad-lead">!</span>' +
            '<span class="g-main"><span class="g-t">Sync is failing</span>' +
            '<span class="g-s">' + esc(e.msg) + " \u00b7 since " + esc(agoLabel(e.at)) + "</span></span></a>");
        if (backlog > 0)
          rows.push('<a class="grow" href="#/calendar"><span class="g-lead bad-lead">!</span>' +
            '<span class="g-main"><span class="g-t">' + (backlog > 20 ? "20+" : backlog) +
            " lecture" + (backlog === 1 ? "" : "s") + " owed from earlier days</span>" +
            '<span class="g-s">catching up late still turns the day green</span></span></a>');
        if (!rows.length) return "";
        return '<div class="ghead">Needs attention<span class="gh-meta">' + rows.length + "</span></div>" +
          '<div class="glist">' + rows.join("") + "</div>";
      })() +

      // ---- The day's own work ----
      //
      // A "TODAY" section heading used to sit here, above per-course headers
      // that say the same thing more precisely. The hero directly above already
      // states the day and the count; the groups name their own course. So the
      // day is its lectures, and nothing announces them twice.
      (resting
        // A rest day has to look deliberate. An empty day with no explanation
        // reads as a broken schedule, and the whole point is that this day is
        // part of the plan rather than a hole in it.
        ? '<div class="ghead">' + esc(REST_NAME) + '<span class="gh-meta">rest day</span></div>' +
          '<div class="glist">' +
          '<div class="grow"><span class="g-lead">\u2014</span>' +
          '<span class="g-main"><span class="g-t">Nothing is scheduled</span>' +
          '<span class="g-s">the plan runs six days a week \u2014 taking the seventh is following it. Your streak is safe.</span></span></div>' +
          '<a class="grow" href="' + nextStudyHref() + '"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">' + esc(nextStudyLabel()) + "</span>" +
          '<span class="g-s">the next study day</span></span></a>' +
          '<a class="grow" href="#/recall"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">Recall, if you want to</span></span></a>' +
          "</div>"
        : real.length
          ? dayGroupsHTML(real) +
            '<div class="glist" style="margin-top:var(--sp-3);">' +
            (studiedToday
              ? '<div class="grow done-row"><span class="g-lead">\u2713</span>' +
                '<span class="g-main"><span class="g-t">Deep Track marked for today</span></span></div>'
              // No Deep Track to mark on a rest day, and none offered: letting a
              // rest day be logged as a study day would inflate the streak, the
              // one number that has to stay honest.
              : '<button class="grow" data-act="studied"><span class="g-lead">\u25cb</span>' +
                '<span class="g-main"><span class="g-t">Mark today\u2019s Deep Track done</span>' +
                '<span class="g-s">seals the day</span></span></button>') +
            "</div>"
          : '<div class="ghead">Today<span class="gh-meta">nothing scheduled</span></div>' +
            '<div class="glist">' +
            '<div class="grow"><span class="g-lead">\u2014</span>' +
            '<span class="g-main"><span class="g-t">' +
            (todaySched.length ? "Problem sets and review only" : "Calibration and setup") + "</span>" +
            '<span class="g-s">' + (todaySched.length ? "no lectures on this day" : "see the Handbook") + "</span></span></div>" +
            '<a class="grow" href="#/calendar"><span class="g-lead"></span>' +
            '<span class="g-main"><span class="g-t">Calendar</span></span></a>' +
            '<a class="grow" href="#/guide"><span class="g-lead"></span>' +
            '<span class="g-main"><span class="g-t">Handbook</span></span></a>' +
            (studiedToday
              ? '<div class="grow done-row"><span class="g-lead">\u2713</span>' +
                '<span class="g-main"><span class="g-t">Deep Track marked for today</span></span></div>'
              : '<button class="grow" data-act="studied"><span class="g-lead">\u25cb</span>' +
                '<span class="g-main"><span class="g-t">Mark today\u2019s Deep Track done</span>' +
                '<span class="g-s">seals the day</span></span></button>') +
            "</div>") +

      // ---- Where you stand, and everything that runs every day ----
      //
      // This was a counts grid, then a disclosure holding four plan-rows, then a
      // Standing card with a countdown and a bar, then a backup card. Four
      // shapes below the day's work, on the page whose whole job is the day's
      // work. They are rows in one group now, in the order you would ask for
      // them, and each one goes where it is about.
      '<div class="ghead">Where you stand</div>' +
      '<div class="glist">' +
      (g
        ? '<a class="grow" href="#/transcript"><span class="g-lead">\u25c6</span>' +
          '<span class="g-main"><span class="g-t">Gate ' + g.n + " \u2014 " + esc(g.label) + "</span>" +
          '<span class="g-s">' + esc(drift.projected) + " finish" +
          (drift.aheadDays > 0 ? " \u00b7 " + drift.aheadDays + " days ahead"
            : drift.aheadDays < 0 ? " \u00b7 " + (-drift.aheadDays) + " days behind" : " \u00b7 on baseline") +
          "</span></span><span class=\"g-v\">" + gateLeft + "d</span></a>"
        : '<a class="grow done-row" href="#/transcript"><span class="g-lead">\u2713</span>' +
          '<span class="g-main"><span class="g-t">All gates passed</span></span></a>') +
      (st > 0
        ? '<a class="grow" href="#/record"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">Streak</span></span>' +
          '<span class="g-v">' + st + "d</span></a>"
        : "") +
      (proven > 0
        ? '<a class="grow" href="#/atlas"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">Lectures proven</span></span>' +
          '<span class="g-v">' + proven + "</span></a>"
        : "") +
      (due.length
        ? '<a class="grow" href="#/recall"><span class="g-lead">!</span>' +
          '<span class="g-main"><span class="g-t">Recall due</span>' +
          '<span class="g-s">before new material</span></span>' +
          '<span class="g-v">' + due.length + "</span></a>"
        : "") +
      (missPool().length
        ? '<a class="grow" href="#/drill"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">Missed questions waiting</span></span>' +
          '<span class="g-v">' + missPool().length + "</span></a>"
        : "") +
      (probs.length
        ? '<a class="grow" href="#/course/cs150"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">Problems today</span>' +
          '<span class="g-s">' + (probsCat ? esc(probsCat) + " \u00b7 " : "") + probs.map(esc).join(", ") + "</span></span></a>"
        : "") +
      (function () {
        const rd = repsDue();
        if (resting || !rd.length) return "";
        return '<a class="grow" href="#/practice"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">' + esc(rd[0].label) + "</span>" +
          '<span class="g-s">' + esc(rd[0].hint) + "</span></span></a>";
      })() +
      (ghToken()
        ? '<a class="grow" href="#/sync"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">Synced</span></span>' +
          '<span class="g-v">' + esc(S.settings.syncError ? "failing" : agoLabel(S.settings.lastSyncAt || S.settings.lastSync)) + "</span></a>"
        : "") +
      (backupAge === null || backupAge > 14
        ? '<button class="grow" data-act="backup"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">Export a backup</span>' +
          '<span class="g-s">' + (backupAge === null ? "this browser is the only copy" : "last one " + backupAge + " days ago") + "</span></span></button>"
        : "") +
      "</div>" +

      // ---- Charts: folded, and only once there is something to plot ----
      // Four tiles used to sit here restating the streak and the DSA count that
      // the status row above already carries, with two charts under them. The
      // tiles are gone; the charts are a thing you go and look at, so they fold.
      (charted
        ? '<details class="unit" style="margin-top:16px;"><summary>' +
          '<span class="u-name">Weekly numbers</span><span class="pill">' + weeksArr.length + " weeks</span>" +
          '<span class="u-prog" style="width:100%;"></span></summary><div class="u-body">' +
          '<div class="grid cols-2">' +
          '<div class="card"><h2>DSA over time</h2>' + lineChart(weeksArr.map(w => +w.dsa || 0), weeksArr.map(w => "Week " + w.week)) + "</div>" +
          '<div class="card"><h2>Revenue by week</h2>' + barChart(weeksArr.map(w => +w.revenue || 0), weeksArr.map(w => "Week " + w.week)) + "</div>" +
          "</div></div></details>"
        : "") +

      // The backup nag used to be a card here AND is now a row in the group
      // above, which put "Export a backup" on the page twice.
      "</div>";
  };

  V.courses = function () {
    const phase = currentPhase();
    const starts = courseStartDays();
    const PHASES = [
      [0, "Phase 0 — Foundations"],
      [1, "Phase 1 — The Spine"],
      [2, "Phase 2 — Depth"],
      [3, "Phase 3 — Frontier"],
    ];

    // Twelve hero cards, each with a code, a mastery pill, a title, an org line,
    // a two-line blurb and a progress bar: 3794px and 701 words for the same
    // twelve courses the Atlas draws in 1219px. Two pages were answering one
    // question in two different shapes.
    //
    // So the Atlas stays the map of what is RUNNING, and this becomes what its
    // own title already claims — a catalog. One row per course: what it is
    // called, how big it is, and how far in you are, where you are in at all.
    const row = c => {
      const m = courseMastery(c);
      const ls = c.tracker ? { done: dsaCount(), total: 150 } : courseLessonStats(c);
      const locked = c.phase > phase;
      const size = c.tracker ? ls.total + " problems" : ls.total + " lecture" + (ls.total === 1 ? "" : "s");
      return '<a class="grow ' + facClass(c) + (locked ? " muted-row" : "") + '" href="#/course/' + c.id + '">' +
        '<span class="g-lead">' +
        (locked ? lockSVG() : '<span class="gdot' + (m >= 85 ? " on" : m > 0 ? " part" : "") + '"></span>') +
        "</span>" +
        '<span class="g-main"><span class="g-t">' + esc(c.title) + "</span>" +
        '<span class="g-s">' + esc(c.code) + " · " + size +
        (c.instructor ? " · " + esc(c.instructor.org) : "") + "</span></span>" +
        // A mastery figure reading 0% on every row is twelve absences, not
        // twelve measurements. It arrives when there is something to report.
        // "Phase 2" here would restate the group header it sits under. The week
        // it opens is the fact that header does not carry.
        (m > 0 ? '<span class="g-v">' + m + "%</span>"
               : locked ? '<span class="g-v">' + (starts[c.id] == null ? "later"
                   : "wk " + (Math.floor(starts[c.id] / STUDY_WEEK) + 1)) + "</span>"
                        : "") + "</a>";
    };

    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Registrar</div><h1>Course Catalog</h1>' +
      '<div class="sub">' + D.COURSES.length + ' courses · four phases · free and permanent. <a href="#/atlas">The Atlas</a> shows which are running now.</div>' +
      '<div class="row-actions"><a class="btn ghost" href="#/electives">Outside courses</a></div></div>' +
      PHASES.map(ph => {
        const cs = D.COURSES.filter(c => c.phase === ph[0]);
        if (!cs.length) return "";
        const done = cs.reduce((s, c) => s + (c.tracker ? 0 : courseLessonStats(c).verified), 0);
        const tot = cs.reduce((s, c) => s + (c.tracker ? 0 : courseLessonStats(c).total), 0);
        return '<div class="ghead">' + ph[1] + '<span class="gh-meta">' +
          (done ? done + " / " + tot + " proven" : tot + " lectures") + "</span></div>" +
          '<div class="glist">' + cs.map(row).join("") + "</div>";
      }).join("") + "</div>";
  };

  // ---------- course listing furniture ----------
  // Facts a person actually decides on: length, effort, who taught it, when it
  // starts, where they stand. Each is a number with a label, never a sentence.
  // Relative time, coarse on purpose: the question is "is this stale", and a
  // minute-accurate answer invites staring at it. Accepts a full ISO timestamp
  // or a bare date (older records stored only the date).
  function agoLabel(iso) {
    if (!iso) return "never";
    const t = Date.parse(iso.length === 10 ? iso + "T12:00:00" : iso);
    if (isNaN(t)) return "never";
    const m = Math.floor((Date.now() - t) / 60000);
    if (m < 2) return "just now";
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    const d = Math.floor(h / 24);
    return d === 1 ? "1d ago" : d + "d ago";
  }
  function factsHTML(cells) {
    return '<div class="onecounts">' + cells.filter(Boolean).map(f =>
      "<div><b>" + f.v + "</b><span>" + esc(f.k) + "</span></div>"
    ).join("") + "</div>";
  }
  function courseHours(c) {
    let m = 0;
    (c.units || []).forEach(u => u.lessons.forEach(l => { m += (l.min || 0); }));
    return m;
  }
  function hoursLabel(m) {
    if (!m) return "—";
    const h = Math.floor(m / 60);
    return h ? h + "h" + (m % 60 ? " " + (m % 60) + "m" : "") : m + "m";
  }
  function taughtHTML(c) {
    if (!c.instructor) return "";
    // Initials from the first named person; a monogram, not a stock avatar.
    const first = c.instructor.name.split("·")[0].trim();
    const ini = first.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return '<div class="taught"><span class="av">' + esc(ini) + "</span><span>" +
      '<span class="tn">' + esc(c.instructor.name) + "</span>" +
      '<span class="to">' + esc(c.instructor.org) + "</span></span></div>";
  }
  function courseFacts(c) {
    const starts = courseStartDays();
    const start = starts[c.id];
    const dToday = studyToday();
    const when = c.tracker ? "every day"
      : start == null ? "\u2014"
      : start <= dToday ? "running" : "week " + (Math.floor(start / STUDY_WEEK) + 1);
    const cst = courseLessonStats(c);
    // The tracker branch that used to live here is gone: trackerCourse draws its
    // own counts row now, and nothing else reached it.
    // "watched 0 / proven 0" on a course you have not started is two absences
    // beside three real facts.
    return factsHTML([
      { k: "lectures", v: cst.total },
      { k: "video", v: hoursLabel(courseHours(c)) },
      cst.done ? { k: "watched", v: cst.done } : null,
      cst.verified ? { k: "proven", v: cst.verified } : null,
      when === "running" ? null : { k: "begins", v: when },
    ]);
  }

  V.course = function (cid) {
    const c = D.COURSES.find(x => x.id === cid);
    if (!c) return "<p>Unknown course.</p>";
    if (c.tracker) return trackerCourse(c);
    const cbest = c.quiz ? bestQuiz(c.quiz) : null;
    const unitDone = ui => c.units[ui].lessons.filter((_, i) => (S.lessons[lessonKey(c.id, ui, i)] || {}).done).length;

    // The one thing on a course page is the next lecture in it — the page used
    // to open on a facts strip and close, 36 lectures later, on a "Prove it"
    // card nobody scrolled to. The action comes first here like it does
    // everywhere else, and the examination is what it becomes once the course
    // has been watched through.
    let nx = null;
    c.units.forEach((u, ui) => u.lessons.forEach((l, li) => {
      if (!nx && !(S.lessons[lessonKey(c.id, ui, li)] || {}).done) nx = { l, ui, li };
    }));
    const started = c.units.some((u, ui) => unitDone(ui) > 0);
    const one = nx
      ? '<div class="card one">' +
        '<div class="one-kind">' + esc(nx.l.t) + "</div>" +
        '<p class="one-hint">' + (started ? "Next up" : "Lecture 1") +
        (nx.l.min ? " \u00b7 " + nx.l.min + "m" : "") + " \u00b7 " + esc(c.units[nx.ui].name) + "</p>" +
        '<a class="btn lg one-go" href="#/lesson/' + c.id + "/" + nx.ui + "/" + nx.li + '">' +
        (started ? "Continue" : "Start the course") + " \u25b8</a></div>"
      : '<div class="card one one-clear">' +
        '<div class="one-kind">' + (c.quiz ? "Prove it" : "Prove it by building") +
        (cbest != null ? ' <span class="one-more">best ' + cbest + "%</span>" : "") + "</div>" +
        '<p class="one-hint">' +
        (c.quiz
          ? "Every lecture watched. 15 questions on " + esc(c.code) + ", drawn fresh, graded instantly. \u226585% is Mastered."
          : "Every lecture watched. This course is proven by building, not multiple choice \u2014 reimplement the papers, ship the systems.") +
        "</p>" +
        (c.quiz
          ? '<a class="btn lg one-go" href="#/quiz/' + c.quiz + '">Sit the examination \u25b8</a>'
          : '<a class="btn lg one-go" href="#/workshop">Open the labs \u25b8</a>') +
        "</div>";

    // Open the unit you are actually in — the first with anything left — and
    // leave the rest shut. Nobody scrolls a fully-expanded 36-lecture syllabus.
    let openUi = c.units.findIndex((u, ui) => unitDone(ui) < u.lessons.length);
    if (openUi < 0) openUi = 0;

    return '<div class="view-enter ' + facClass(c) + '"><div class="page-head"><div class="kicker">' + esc(c.code) + " \u00b7 " + esc(c.faculty) + "</div><h1>" + esc(c.title) + "</h1>" +
      '<div class="sub">' + esc(c.desc) + "</div>" + taughtHTML(c) + "</div>" +

      one +
      courseFacts(c) +

      c.units.map((u, ui) => {
        const dn = unitDone(ui), tot = u.lessons.length;
        return '<details class="unit"' + (ui === openUi ? " open" : "") + '>' +
          '<summary><span class="u-name">' + esc(u.name) + "</span>" +
          '<span class="pill' + (dn === tot ? " good" : "") + '">' + dn + "/" + tot + "</span>" +
          '<span class="u-prog" style="width:' + (tot ? (dn / tot) * 100 : 0) + '%;"></span></summary>' +
          // .lesson-row was a fifth row shape doing the grouped list's job with
          // its own number column, its own title and its own tick. Same row,
          // one spelling: the tick is the leading mark, the duration is the
          // value on the right.
          '<div class="u-body"><div class="glist">' +
          u.lessons.map((l, i) => {
            const st = S.lessons[lessonKey(c.id, ui, i)] || {};
            return '<a class="grow' + (st.done ? " done-row" : "") + '" href="#/lesson/' + c.id + "/" + ui + "/" + i + '">' +
              '<span class="g-lead">' + (st.verified ? "\u2713\u2713" : st.done ? "\u2713" : i + 1) + "</span>" +
              '<span class="g-main"><span class="g-t">' + esc(l.t) + "</span></span>" +
              '<span class="g-v">' + (l.min ? l.min + "m" : l.paper ? "paper" : "reading") + "</span></a>";
          }).join("") + "</div></div></details>";
      }).join("") +

      // Where the course lives outside Brickford, and the way in to its
      // examination once there is one. Rows, not a strip of ghost buttons.
      '<div class="ghead">This course elsewhere</div>' +
      '<div class="glist">' +
      (c.quiz
        ? '<a class="grow" href="#/quiz/' + c.quiz + '"><span class="g-lead">\u25c6</span>' +
          '<span class="g-main"><span class="g-t">Sit the examination</span>' +
          '<span class="g-s">15 questions, drawn fresh, graded instantly</span></span>' +
          (cbest != null ? '<span class="g-v">best ' + cbest + "%</span>" : "") + "</a>"
        : "") +
      c.external.map(e => '<a class="grow" href="' + e.url + '" target="_blank" rel="noopener">' +
        '<span class="g-lead">\u2197</span>' +
        '<span class="g-main"><span class="g-t">' + esc(e.label) + "</span></span></a>").join("") +
      "</div></div>";
  };

  function trackerCourse(c) {
    const cats = Object.keys(c.problems);
    const doneIn = cat => c.problems[cat].filter(p => S.problems[cat + "|" + p]).length;
    // Work top-down through the roadmap: the current category is the first with
    // anything left in it, which is also where nextProblems() is drawing from.
    const thisCat = cats.find(cat => doneIn(cat) < c.problems[cat].length) || null;

    // One category's problems as a list of checkboxes.
    const catBody = cat => c.problems[cat].map(p => {
      const k = cat + "|" + p;
      return '<label class="check-row"><input type="checkbox" data-prob="' + esc(k) + '" ' +
        (S.problems[k] ? "checked" : "") + '><span class="checkbox">' + CHECK_SVG +
        '</span><span class="check-label">' + esc(p) + "</span></label>";
    }).join("");

    // A folded category is one summary row, not a card.
    const catFold = cat => {
      const dn = doneIn(cat), tot = c.problems[cat].length;
      return '<details class="unit"><summary><span class="u-name">' + esc(cat) + "</span>" +
        '<span class="pill' + (dn === tot ? " good" : "") + '">' + dn + "/" + tot + "</span>" +
        '<span class="u-prog" style="width:' + (tot ? (dn / tot) * 100 : 0) + '%;"></span></summary>' +
        '<div class="u-body">' + catBody(cat) + "</div></details>";
    };

    const idx = thisCat ? cats.indexOf(thisCat) : cats.length;
    const behind = cats.slice(0, idx);       // finished, or part-finished and passed
    const ahead = cats.slice(idx + 1);       // not started

    // Fifteen categories, 150 checkboxes, 8786px — for a day on which two
    // problems get solved. The roadmap is strictly ordered and the page even
    // says so ("top to bottom, category by category; do not shop around in
    // it"), so showing all fifteen at once contradicts its own instruction.
    // The category you are IN is the page; the rest is one tap away.
    return '<div class="view-enter ' + facClass(c) + '"><div class="page-head"><div class="kicker">' + esc(c.code) + " · " + esc(c.faculty) + "</div><h1>" + esc(c.title) + "</h1>" +
      '<div class="sub">' + esc(c.desc) + "</div></div>" +

      (thisCat
        ? '<div class="card one">' +
          '<div class="one-kind">' + esc(thisCat) +
          ' <span class="one-more">' + doneIn(thisCat) + " of " + c.problems[thisCat].length + "</span></div>" +
          '<p class="one-hint">Read it, write it yourself, run it. Stuck past 25 minutes: read the editorial, close it, write it again from memory. Tick it only when it ran.</p>' +
          '<div class="one-body">' + catBody(thisCat) + "</div></div>"
        : '<div class="card one one-clear"><div class="one-kind">All 150 solved</div>' +
          '<p class="one-hint">The Month-6 gate number is met.</p></div>') +

      '<div class="onecounts">' +
      "<div><b>" + dsaCount() + " / 150</b><span>Solved</span></div>" +
      "<div><b>" + (150 - dsaCount()) + "</b><span>Left</span></div>" +
      "<div><b>" + (idx + (thisCat ? 1 : 0)) + " / " + cats.length + "</b><span>Category</span></div>" +
      "</div>" +

      // One fold each, not one per category: fourteen summary rows stacked down
      // the page is still fourteen things to scroll past on the way to nothing.
      (behind.length
        ? '<details class="unit" style="margin-top:16px;"><summary><span class="u-name">Behind you</span>' +
          '<span class="pill">' + behind.length + "</span>" +
          '<span class="u-prog" style="width:100%;"></span></summary><div class="u-body">' +
          behind.map(catFold).join("") + "</div></details>"
        : "") +

      (ahead.length
        ? '<details class="unit"><summary><span class="u-name">Ahead</span>' +
          '<span class="pill">' + ahead.length + "</span>" +
          '<span class="u-prog" style="width:0%;"></span></summary><div class="u-body">' +
          '<p class="note" style="margin:0 0 6px;">In roadmap order. Do not shop around in it.</p>' +
          ahead.map(catFold).join("") + "</div></details>"
        : "") +

      // Read once, not daily — so it sits with the things you look up.
      '<details class="unit" style="margin-top:16px;"><summary><span class="u-name">How this track works</span>' +
      '<span class="pill">' + esc(c.code) + '</span><span class="u-prog" style="width:100%;"></span></summary>' +
      '<div class="u-body"><div class="glist">' +
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">Why it is here</span>' +
      '<span class="g-s">Interviews are still solved on a whiteboard, and reading a paper into working code needs a language you do not have to fight. That is what this buys.</span></span></div>' +
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">It runs apart from the mathematics</span>' +
      '<span class="g-s">Nothing here builds on linear algebra, and nothing in linear algebra needs this. They are two tracks on the same day.</span></span></div>' +
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">In order, top to bottom</span>' +
      '<span class="g-s">The list is the NeetCode roadmap order — do not shop around in it.</span></span></div>' +

      "</div>" +
      '<div class="row-actions"><a class="btn ghost" href="#/quiz/' + c.quiz + '">Concept examination</a>' +
      c.external.map(e => '<a class="btn ghost" href="' + e.url + '" target="_blank" rel="noopener">' + esc(e.label) + " ↗</a>").join("") +
      "</div></div></details>" +
      "</div>";
  }

  V.lesson = function (cid, ui, li) {
    const c = D.COURSES.find(x => x.id === cid);
    if (!c || !c.units[ui] || !c.units[ui].lessons[li]) return "<p>Unknown lesson.</p>";
    const u = c.units[ui], l = u.lessons[li];
    const k = lessonKey(cid, ui, li);
    const st = S.lessons[k] || { done: false, notes: "", checks: [] };
    const gates = lessonGates(st, l);
    const gatesOk = gates.filter(g => g.ok).length;
    const canVerify = gatesOk === 4;
    const need = practiceTarget(l);
    const rv = S.review[k];
    const hasSummary = !!(D.SUMMARIES || {})[k];
    // The concepts this lecture teaches already carry a sentence on where the
    // idea shows up in AI. Reuse it rather than writing new prose.
    const lessonWhy = (D.CONCEPTS || []).filter(x => (x.lectures || []).indexOf(k) >= 0).slice(0, 3);
    S.settings.lastLesson = { cid, ui: +ui, li: +li, label: c.code + " · " + l.t };
    save();
    const src = l.v
      ? "https://www.youtube.com/embed/" + l.v + (u.playlist ? "?list=" + u.playlist : "")
      : u.playlist ? "https://www.youtube.com/embed/videoseries?list=" + u.playlist : null;
    const prev = li > 0 ? "#/lesson/" + cid + "/" + ui + "/" + (li - 1) : null;
    const next = li < u.lessons.length - 1 ? "#/lesson/" + cid + "/" + ui + "/" + (+li + 1) : null;
    const objectives = l.obj || (l.v
      ? ["Watch actively — pause and predict before he types", "Close the video; rebuild the code/derivation from memory", "Compare against the original; note every divergence"]
      : ["Read actively — recreate each derivation or claim before scrolling past it", "Close the source; write the core argument from memory", "Compare against the original; note every divergence"]);
    const runtime = l.min ? l.min + "m video" : l.paper ? "paper" : "reading";

    // ---- The four gates, and everything that operates them ----
    //
    // This used to render under every video, always: two textareas, three
    // checkboxes, a ± counter, two external links, Save and Verify — eleven
    // buttons and 2373px of page, in front of a lecture you had not started.
    //
    // It is the work you do AFTER the video, so it arrives when the video is
    // marked watched. Nothing here changed except when it renders: lessonGates()
    // and lessonCanVerify() are untouched, and st.recall / st.checks / st.solved
    // / st.notes keep whatever was typed even while the card is not on screen,
    // because unmarking watched never clears them.
    const proveHTML = () =>
      '<div class="ghead">Prove it<span class="gh-meta">' + gatesOk + ' of 4 gates</span></div>' +
      '<div class="card one' + (canVerify ? " one-clear" : "") + '">' +
      '<div class="bar grow"><i style="--w:' + (gatesOk / 4) + '; transform:scaleX(' + (gatesOk / 4) + ');"></i></div>' +
      '<div class="gates" style="margin-top:12px;">' +
      gates.map(g => '<div class="gate-row' + (g.ok ? " ok" : "") + '"><span class="gmark">' + (g.ok ? "✓" : "") + "</span>" +
        '<span class="gtext">' + esc(g.label) + (g.ok ? "" : ' <span style="color:var(--ink-3);">— ' + esc(g.hint) + "</span>") + "</span></div>").join("") +
      "</div>" +

      // 1 · blank-page recall
      '<div style="margin-top:16px;"><label class="field" for="lessonRecall">1 · Recall it cold — no video, no notes</label>' +
      '<div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">' +
      '<button class="btn ghost" data-act="recallTimer">Start 3-minute recall</button>' +
      '<span class="mono" id="recallClock" style="font-size:var(--fs-small); color:var(--ink-3);"></span></div>' +
      '<textarea id="lessonRecall" placeholder="What did this lecture establish? Definitions, the key result, why it works.">' + esc(st.recall || "") + "</textarea></div>" +

      // 2 · rebuild
      '<div style="margin-top:16px;"><div class="field">2 · Rebuild from memory</div>' +
      objectives.map((o, i) =>
        '<label class="check-row"><input type="checkbox" data-check="' + i + '" ' + ((st.checks || [])[i] ? "checked" : "") + '><span class="checkbox">' + CHECK_SVG + '</span><span class="check-label">' + esc(o) + "</span></label>"
      ).join("") + "</div>" +

      // 3 · solve, from a real source with solutions
      '<div style="margin-top:16px;"><div class="field">3 · Solve ' + need + ' problems unaided</div>' +
      '<div style="font-size:var(--fs-small); color:var(--ink-2);">' + esc(c.practice ? c.practice.label : "Problems from the course source") + "</div>" +
      '<div style="margin-top:8px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">' +
      (c.practice ? '<a class="btn ghost" href="' + c.practice.url + '" target="_blank" rel="noopener">Open problems ↗</a>' : "") +
      (c.quiz ? '<a class="btn ghost" href="#/quiz/' + c.quiz + '">Auto-graded bank</a>' : "") +
      '<span style="display:inline-flex; align-items:center; gap:6px;">' +
      '<button class="btn ghost" data-solve="-1" aria-label="one fewer">−</button>' +
      '<span class="mono" id="solvedN" style="min-width:2.5em; text-align:center;">' + (st.solved || 0) + "</span>" +
      '<button class="btn ghost" data-solve="1" aria-label="one more">+</button>' +
      "</span></div></div>" +

      // 4 · explain
      '<div style="margin-top:16px;"><label class="field" for="lessonNotes">4 · Explain it plainly — this becomes your post</label>' +
      '<textarea id="lessonNotes" placeholder="Explain it as if to a smart friend who has not seen it. No jargon you cannot unpack.">' + esc(st.notes) + "</textarea></div>" +

      '<div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">' +
      '<button class="btn ghost" data-act="saveLesson">Save</button>' +
      (st.verified
        ? '<span class="pill good">✓ Verified ' + esc(st.verifiedAt || "") + "</span>" +
          '<button class="btn ghost" data-act="unverify">Unverify</button>'
        : '<button class="btn" data-act="verify"' + (canVerify ? "" : ' disabled title="Finish the four gates first"') + ">Verify mastery</button>") +
      "</div></div>" +

      // ---- where this lecture stands, as numbers instead of a paragraph ----
      factsHTML([
        { k: "runtime", v: l.min ? l.min + "m" : l.paper ? "paper" : "reading" },
        { k: "gates", v: gatesOk + "/4", lead: gatesOk > 0 },
        { k: "proven", v: st.verified ? "yes" : "—" },
        rv ? { k: "next recall", v: rv.due <= todayISO() ? "due" : rv.due.slice(5) } : null,
      ]) +

      // ---- what this lecture buys, in the concepts' own words ----
      (lessonWhy.length
        ? '<div class="ghead">Why this matters<span class="gh-meta">' + lessonWhy.length + " concept" + (lessonWhy.length === 1 ? "" : "s") + "</span></div>" +
          '<div class="glist">' +
          lessonWhy.map(x => '<a class="grow ' + facClass(c) + '" href="#/concept/' + x.id + '">' +
            '<span class="g-lead"></span>' +
            '<span class="g-main"><span class="g-t">' + esc(x.title) + "</span>" +
            '<span class="g-s">' + esc(x.applies) + "</span></span></a>").join("") +
          "</div>"
        : "");

    return '<div class="view-enter ' + facClass(c) + '"><div class="page-head"><div class="kicker"><a href="#/course/' + cid + '">' + esc(c.code) + "</a> · " + esc(u.name) + "</div>" +
      "<h1>" + (+li + 1) + ". " + esc(l.t) + "</h1></div>" +
      (src
        ? '<div class="video-frame"><iframe src="' + src + '" title="' + esc(l.t) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>'
        : l.paper
          ? '<div class="card">This lesson is a paper — the reading is the lecture.</div>'
          : l.read
            ? '<div class="card">This lesson is a reading — open it below and work through it actively.</div>'
            : '<div class="card">This lesson lives outside YouTube — use the course links.</div>') +
      (l.paper || l.read
        ? '<div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">' +
          (l.paper ? '<a class="btn" href="' + l.paper + '" target="_blank" rel="noopener">Read the paper ↗</a>' : "") +
          (l.read ? '<a class="btn ' + (l.paper ? "ghost" : "") + '" href="' + l.read + '" target="_blank" rel="noopener">' + (l.paper ? "Companion reading" : "Open the reading") + ' ↗</a>' : "") +
          "</div>"
        : "") +

      // ---- one button, beside the runtime ----
      // Unwatched, this is the whole page below the video. Watched, it hands over
      // to the summary and the Prove-it card that follows.
      '<div class="lsn-act">' +
      (st.done
        ? '<a class="btn' + (hasSummary ? "" : " ghost") + '" href="#/summary/' + cid + "/" + ui + "/" + li + '">Summary ▸</a>' +
          '<button class="btn ghost" data-act="toggleDone">Unmark watched</button>'
        : '<button class="btn lg" data-act="toggleDone">Mark watched</button>') +
      '<span class="lsn-run">' + esc(runtime) + "</span></div>" +

      // The drill is same-day work and deliberately NOT behind "watched": it is
      // what turns watching into something, so it tells you what to listen for.
      drillHTML(k) +

      (st.done ? proveHTML() : "") +

      '<div style="display:flex; justify-content:space-between; margin-top:16px;">' +
      (prev ? '<a class="btn ghost" href="' + prev + '">← Previous</a>' : "<span></span>") +
      (next ? '<a class="btn" href="' + next + '">Next lecture →</a>' : '<a class="btn" href="#/course/' + cid + '">Course complete view</a>') +
      "</div></div>";
  };

  V.exams = function () {
    const diagSat = D.DIAGNOSTICS.filter(d => (S.diag[d.id] || {}).score != null).length;
    const qIds = Object.keys(D.QUIZZES);
    const qDone = qIds.filter(id => bestQuiz(id) != null).length;
    const gate1 = gatePlan()[0];
    const gateLeft = gate1 && !gate1.doneDate ? daysBetween(todayISO(), gate1.target) : null;

    // ---- One list, ranked, with size carrying the priority ----
    //
    // Every exam here used to weigh the same, and the owner's instruction was
    // explicit: the urgent one should be a big button, the rest secondary. So
    // each exam gets a score, and the top of the list becomes the card while
    // everything below it becomes a row. Nothing new is stored — the ranking
    // falls out of gatePlan() and unlockedIdx(), which already exist.
    //
    //   a diagnostic not yet sat is the most urgent thing on the page, because
    //   Gate 1 does not open until all four are done — so its deadline IS the
    //   gate's target date;
    //   a concept bank ranks by how much of it you have unlocked, which is how
    //   much of it you have actually watched.
    const items = [];
    D.DIAGNOSTICS.forEach(d => {
      const r = S.diag[d.id] || {};
      const sat = r.score != null;
      items.push({
        kind: "diag", href: "#/diag/" + d.id, title: d.title,
        sub: d.subject + " · " + d.minutes + " min" + (d.gate ? " · pass at " + d.gate + "%" : ""),
        due: gateLeft, sat, score: r.score,
        verdict: !sat ? null : d.gate == null ? "logged" : r.score >= d.gate ? "pass" : "gap",
        // Unsat diagnostics outrank everything; the sooner the gate, the higher.
        rank: sat ? 100 : (gateLeft == null ? 50 : Math.max(0, gateLeft) / 1000),
      });
    });
    qIds.forEach(id => {
      const bank = D.QUIZZES[id], n = unlockedIdx(id).length, best = bestQuiz(id);
      items.push({
        kind: "bank", href: n ? "#/quiz/" + id : "#/courses", title: bank.title,
        sub: bank.course + " · " + (n ? n + " of " + bank.questions.length + " unlocked" : "watch the lectures first"),
        locked: !n, sat: best != null, score: best,
        verdict: best == null ? null : best >= 70 ? "pass" : "gap",
        // +1 so that an unsat diagnostic ALWAYS outranks a bank: a diagnostic
        // has a real deadline (Gate 1 does not open without it) and a bank has
        // none, and a fully-unlocked bank scored 0 — beating the diagnostic it
        // was supposed to sit behind. Then: open and unsat, most-unlocked first.
        rank: 1 + (best != null ? 200 : 0) + (n ? 10 - (n / bank.questions.length) * 10 : 300),
      });
    });
    items.sort((a, b) => a.rank - b.rank);
    const lead = items[0];
    const rest = items.slice(1);

    const scoreTag = it =>
      it.verdict === "pass" ? '<span class="pill good">' + it.score + "%</span>" :
      it.verdict === "gap" ? '<span class="pill crimson">' + it.score + "%</span>" :
      it.verdict === "logged" ? '<span class="pill good">done</span>' : "";

    const row = it => '<a class="grow' + (it.locked ? " muted-row" : "") + '" href="' + it.href + '">' +
      '<span class="g-lead">' + (it.sat ? "✓" : it.locked ? lockSVG() : "") + "</span>" +
      '<span class="g-main"><span class="g-t">' + esc(it.title) + "</span>" +
      '<span class="g-s">' + esc(it.sub) + "</span></span>" +
      (scoreTag(it) || "") + "</a>";

    const open = rest.filter(it => !it.locked);
    const shut = rest.filter(it => it.locked);

    return '<div class="view-enter"><div class="page-head"><div class="kicker">Examinations</div><h1>Exams</h1>' +
      '<div class="sub">Timed, closed-book, no AI.</div></div>' +

      // ---- The one to sit next, at the size that says so ----
      (lead
        ? '<div class="card one' + (lead.due != null && lead.due <= 14 ? " urgent" : "") + '">' +
          '<div class="one-kind">' + esc(lead.title) + "</div>" +
          '<p class="one-hint">' + esc(lead.sub) +
          (lead.due != null ? " · Gate " + gate1.n + " in " + lead.due + " days" : "") + "</p>" +
          '<a class="btn lg one-go" href="' + lead.href + '">Sit it ▸</a></div>'
        : "") +

      (open.length
        ? '<div class="ghead">Also open<span class="gh-meta">' + open.length + "</span></div>" +
          '<div class="glist">' + open.map(row).join("") + "</div>"
        : "") +

      (shut.length
        ? '<div class="ghead">Not open yet<span class="gh-meta">' + shut.length + "</span></div>" +
          '<div class="glist">' + shut.map(row).join("") + "</div>"
        : "") +

      '<div class="ghead">Record</div>' +
      '<div class="glist">' +
      '<div class="grow"><span class="g-lead"></span><span class="g-main"><span class="g-t">Diagnostics sat</span></span>' +
      '<span class="g-v">' + diagSat + " / " + D.DIAGNOSTICS.length + "</span></div>" +
      '<div class="grow"><span class="g-lead"></span><span class="g-main"><span class="g-t">Concept banks attempted</span></span>' +
      '<span class="g-v">' + qDone + " / " + qIds.length + "</span></div>" +
      "</div></div>";
  };

  V.quiz = function (bankId) {
    const bank = D.QUIZZES[bankId];
    if (!bank) return "<p>Unknown examination.</p>";
    const U = unlockedBank(bankId);
    setTimeout(() => {
      if (!U.unlocked) {
        $("#quizMount").innerHTML = '<div class="card"><h2>Nothing unlocked yet</h2>' +
          '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;">This examination only draws on lectures you have watched. Watch one and it opens.</p>' +
          '<div style="margin-top:12px;"><a class="btn" href="#/courses">Go to the course</a></div></div>';
        return;
      }
      DAR.Quiz.mount($("#quizMount"), U.bank, {
        onFinish(res) {
          (S.quizAttempts[bankId] = S.quizAttempts[bankId] || []).push({ date: todayISO(), score: res.score, total: res.total, pct: res.pct });
          // res indices are into the unlocked subset; translate back to the bank.
          updateMisses(bankId, res.missed.map(i => U.map[i]), res.correct.map(i => U.map[i]));
          save();
          logEvent("exam", bankId, { score: res.score, total: res.total, pct: res.pct });
          toast("Recorded: " + res.pct + "% in the register.");
        },
        onExit() { location.hash = "#/exams"; },
      });
    }, 0);
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Examinations</div><h1>' + esc(bank.title) + '</h1></div><div id="quizMount"></div></div>';
  };

  let timerH = null;
  let sketchDirty = false;
  let calCursor = null; // "YYYY-MM" of the displayed month
  let calSel = null;    // "YYYY-MM-DD" of the selected day

  function monthGridHTML() {
    const today = todayISO();
    if (!calCursor) calCursor = today.slice(0, 7);
    if (!calSel) calSel = today > D.START_DATE ? today : D.START_DATE;
    const [cy, cm] = calCursor.split("-").map(Number);
    const first = new Date(cy, cm - 1, 1);
    const monthName = first.toLocaleString("en-US", { month: "long", year: "numeric" });
    const startPad = first.getDay();
    const daysInMonth = new Date(cy, cm, 0).getDate();
    const gateByDate = {};
    gatePlan().forEach(g => { if (!g.doneDate) gateByDate[g.target] = g; });

    // ---- The month as a pattern of marks, not a grid of boxes ----
    //
    // This was "improved" twice by taking text out of the cells, and the owner's
    // verdict both times was that the calendar itself had not changed — which
    // was fair: it was still a table of numbered boxes with a tint, and you
    // cannot read a three-year habit off a tint.
    //
    // A day is now a DOT, the way a ring is a day in Apple's Fitness app: solid
    // where the day was completed, half where it was started, hollow-red where
    // it was missed, bare where it has not happened, nothing at all on a rest
    // day. The number sits under the dot at label size. The eye gets the shape
    // of the month in one pass and the date only when it looks for one.
    const dow = ["S", "M", "T", "W", "T", "F", "S"]
      .map((d, i) => '<div class="cal-dow"' + (i === REST_DOW ? ' style="opacity:.45"' : "") + ">" + d + "</div>").join("");
    let cells = "";
    for (let i = 0; i < startPad; i++) cells += '<div class="cal-cell blank"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = cy + "-" + pad2(cm) + "-" + pad2(d);
      const before = iso < D.START_DATE;
      const status = before ? null : dayStatus(iso);
      const resting = status === "rest";
      const cls = ["cal-cell"];
      if (iso === today) cls.push("today");
      if (iso === calSel) cls.push("sel");
      if (before || resting) cls.push("rest");
      let mark = "dnone";
      if (!before && !resting) {
        mark = status === "completed" ? "dfull"
          : status === "partial" ? "dhalf"
          : status === "missed" ? "dmiss"
          : "dopen";
      }
      const gate = gateByDate[iso];
      cells += '<div class="' + cls.join(" ") + '" data-cal-day="' + iso + '"' +
        ' aria-label="' + iso + (status ? " · " + status : "") + '">' +
        '<span class="cmark ' + mark + '">' + (gate ? "◆" : "") + "</span>" +
        '<span class="dnum">' + d + "</span></div>";
    }
    return '<div class="card"><div class="cal-head"><h2>' + monthName + "</h2>" +
      '<div class="cal-nav"><button class="btn ghost" data-cal-nav="prev" aria-label="Previous month"><svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 1.5 L2 6.5 L6.5 11.5"/></svg></button>' +
      '<button class="btn ghost" data-cal-nav="today">Today</button>' +
      '<button class="btn ghost" data-cal-nav="next" aria-label="Next month"><svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5 L6 6.5 L1.5 11.5"/></svg></button></div></div>' +
      '<div class="cal-grid">' + dow + cells + "</div>" +
      '<div class="cal-legend">' +
      '<span><i class="cmark dfull"></i>Done</span>' +
      '<span><i class="cmark dhalf"></i>Part</span>' +
      '<span><i class="cmark dmiss"></i>Missed</span>' +
      '<span><i class="cmark dopen"></i>Ahead</span>' +
      '<span style="color:var(--accent);">◆ Gate</span></div></div>';
  }

  function dayDetailHTML() {
    const iso = calSel;
    if (iso < D.START_DATE) {
      return '<div class="card"><h2>The climb hasn’t started yet</h2><p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">Day 1 is ' + D.START_DATE + '. Pick that day or later to see the brief.</p></div>';
    }
    const dObj = new Date(iso + "T00:00:00");
    const nice = dObj.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const day = Math.max(1, studyIndex(iso) + 1);
    const { w, row } = weekRowFor(iso);
    const isSunday = dObj.getDay() === 0;
    const isToday = iso === todayISO();
    const status = dayStatus(iso);
    const act = dayActivity(iso);
    const gate = gatePlan().find(g => !g.doneDate && g.target === iso);
    const sched = scheduledFor(iso);
    const real = sched.filter(it => !it.pseudo);
    const schedDoneN = real.filter(schedDone).length;
    const probs = nextProblems(2);

    // This day's own lessons — fixed forever, done state shown per lesson.
    // Same renderer as the dashboard: grouped by course, the row is the link.
    // The "The lessons" label that used to head them is gone: each group names
    // its own course, and the status pill above already says whether the day is
    // owed, part-done or clear.
    const schedRows = real.length || sched.some(it => it.pseudo)
      ? dayGroupsHTML(real) +
        (sched.some(it => it.pseudo)
          ? '<div class="glist" style="margin-top:var(--sp-3);">' +
            sched.filter(it => it.pseudo).map(pseudoRowHTML).join("") + "</div>"
          : "")
      : '<div class="ghead">No lectures on this day</div>' +
        '<div class="glist"><a class="grow" href="#/workshop"><span class="g-lead">·</span>' +
        '<span class="g-main"><span class="g-t">Project work</span>' +
        '<span class="g-s">beyond the scheduled syllabus — per the week focus above</span></span></a></div>';

    // The five things that run on every study day. They were .plan-row — a block
    // label, a sentence and a "Go" button each — which is a fourth shape on a
    // page that already had three. One group, one row apiece, the row is the
    // link, and the five "Go" buttons are gone.
    const routine = (name, time, what, href) =>
      '<a class="grow" href="' + href + '"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">' + name + "</span>" +
      '<span class="g-s">' + what + "</span></span>" +
      '<span class="g-v">' + time + "</span></a>";

    const statusPill = {
      today: '<span class="pill teal">Today</span>',
      upcoming: '<span class="pill">Upcoming</span>',
      completed: '<span class="pill good">✓ Completed</span>',
      partial: '<span class="pill" style="color:var(--accent-2); border-color:var(--accent-2);">Partly done</span>',
      missed: '<span class="pill crimson">Missed — catch up</span>',
      rest: '<span class="pill">Rest day</span>',
    }[status];

    // Per-day progress line: this day's scheduled lessons, done vs owed.
    const fill = real.length ? schedDoneN / real.length : (act.sealed ? 1 : 0);
    const progressLine =
      '<div style="margin-top:12px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:baseline; font-size:var(--fs-tiny); color:var(--ink-3); margin-bottom:4px;">' +
      '<span style="letter-spacing:0.06em; text-transform:uppercase; font-weight:600;">Progress</span>' +
      '<span class="mono">' + (real.length ? schedDoneN + " of " + real.length + " lessons" : "no scheduled lessons") +
      " · " + act.problems + ' problem' + (act.problems === 1 ? "" : "s") + (act.sealed ? " · sealed ✓" : "") + "</span></div>" +
      '<div class="bar' + (fill === 1 ? "" : " teal") + '"><i style="transform:scaleX(' + fill + ');"></i></div>' +
      // courseStand ("Lin Algebra 6/51 lectures done") said the same thing as the
      // bar above it and the rows below it. The day detail was stating its
      // contents four separate ways - bar, this line, the chips, then the
      // lessons themselves. Three of the four were restatements.
      "</div>";

    const catchUp = (status === "missed" || status === "partial")
      ? '<p class="muted" style="margin-top:10px;"><strong style="color:var(--ink);">' +
        (status === "missed" ? "You missed this day — its lessons are still here." : "You started this day but didn’t finish it.") +
        "</strong> This day’s content never moves. Clear the unticked lessons and the day turns green — even late.</p>"
      : "";

    // The summary is a card because it is one object: a date, a state and a bar.
    // Everything under it is rows, so the lists are NOT nested inside the card —
    // a bordered group inside a bordered card is the second border this design
    // spent three rounds getting rid of.
    return '<div class="card" style="margin-top:12px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px; flex-wrap:wrap;">' +
      "<h2>" + nice + "</h2>" +
      '<div style="display:flex; gap:6px; align-items:baseline;">' + statusPill +
      (status === "rest"
        ? '<span class="pill">Week ' + w + "</span>"
        : '<span class="pill teal">Day ' + day + " · Week " + w + "</span>") + "</div></div>" +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;"><strong style="color:var(--ink);">Focus:</strong> ' + esc(row.focus) + "</p>" +
      progressLine +
      catchUp +
      (gate ? '<p class="muted" style="margin-top:10px;"><strong style="color:var(--accent);">◆ Gate ' + gate.n + " — " + esc(gate.label) + "</strong> " + esc(gate.req) + "</p>" : "") +
      "</div>" +

      schedRows +

      '<div class="ghead">Every study day<span class="gh-meta">' + (isSunday ? "5" : "4") + "</span></div>" +
      '<div class="glist">' +
      routine("Practice", "45m",
        probs.length ? "NeetCode: " + probs.map(esc).join(", ") : "All 150 problems done", "#/course/cs150") +
      routine("Drill", "10m",
        missPool().length ? missPool().length + " missed questions in the pool" : "pool clear — a random drill", "#/drill") +
      routine("Publish", "30m", "turn today’s notes into a public post", "#/review") +
      routine("Workshop", "", "the build that the week’s focus is for", "#/workshop") +
      (isSunday ? routine("Seal the week", "30m", "no shipped artifact = a failed week", "#/review") : "") +
      "</div>";
  }

  V.diag = function (id) {
    const d = D.DIAGNOSTICS.find(x => x.id === id);
    if (!d) return "<p>Unknown examination.</p>";
    const r = S.diag[id] || {};
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Official diagnostic · ' + esc(d.subject) + "</div><h1>" + esc(d.title) + "</h1>" +
      '<div class="sub">' + esc(d.note) + "</div>" +
      '<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">' +
      (d.pdf ? '<a class="btn" href="' + d.pdf + '" target="_blank" rel="noopener">Open exam paper ↗</a>' : "") +
      (d.solutions ? '<a class="btn ghost" href="' + d.solutions + '" target="_blank" rel="noopener">Solutions (after only) ↗</a>' : "") +
      "</div></div>" +
      '<div class="grid cols-2">' +
      '<div class="card" style="text-align:center;"><h2>Exam clock — ' + (d.minutes / 60) + ' hours</h2>' +
      '<div class="timer" id="diagTimer">' + String(Math.floor(d.minutes / 60)).padStart(2, "0") + ":" + String(d.minutes % 60).padStart(2, "0") + ':00</div>' +
      '<div style="margin-top:12px; display:flex; gap:8px; justify-content:center;">' +
      '<button class="btn" id="timerStart">Begin — exam conditions</button>' +
      '<button class="btn ghost" id="timerStop">Stop</button></div>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:10px;">The clock lives on this page — leave it open in a tab while you work on paper.</p></div>' +
      '<div class="card"><h2>Record the honest result</h2>' +
      (d.gate != null
        ? '<label class="field" for="diagScore">Score (%) — graded against the official solutions</label><div style="display:flex; gap:10px; max-width:300px;"><input type="number" id="diagScore" min="0" max="100" value="' + (r.score != null ? r.score : "") + '" placeholder="e.g. 74"><button class="btn" data-act="saveDiag">Record</button></div>' +
          '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:12px;">≥ ' + d.gate + "% → subject verified, Phase 1 runs at full speed.<br>Below → a daily gap-filling block activates for this subject (see the Library → Phase 1 curriculum, adjustment rules).</p>"
        : '<p style="font-size:var(--fs-small); color:var(--ink-2);">Mark done when both parts are pushed/solved.</p><button class="btn" data-act="saveDiagDone">Mark diagnostic complete</button>') +
      (r.date ? '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:10px;">Recorded ' + r.date + "</p>" : "") +
      "</div></div></div>";
  };

  // Consistency at a glance: one square per day, a column per week.
  function heatmapHTML(nWeeks) {
    const today = todayISO();
    const lastSunday = addDaysISO(today, -new Date(today + "T00:00:00").getDay());
    const alignedStart = addDaysISO(D.START_DATE, -new Date(D.START_DATE + "T00:00:00").getDay());
    let first = addDaysISO(lastSunday, -7 * ((nWeeks || 26) - 1));
    if (first < alignedStart) first = alignedStart;
    const cols = [];
    for (let wk = first; wk <= lastSunday; wk = addDaysISO(wk, 7)) {
      let col = "";
      for (let d = 0; d < 7; d++) {
        const iso = addDaysISO(wk, d);
        if (iso < D.START_DATE || iso > today) { col += '<i class="hc void"></i>'; continue; }
        if (isRestDay(iso)) { col += '<i class="hc rest" title="' + iso + ' · rest day"></i>'; continue; }
        const a = dayActivity(iso);
        const lvl = Math.min(4, a.lessons + a.problems + (a.sealed ? 1 : 0));
        col += '<button class="hc l' + lvl + (iso === today ? " now" : "") + '" data-hday="' + iso +
          '" title="' + iso + " · " + a.lessons + " lesson" + (a.lessons === 1 ? "" : "s") +
          ", " + a.problems + " problem" + (a.problems === 1 ? "" : "s") + (a.sealed ? ", sealed" : "") +
          '" aria-label="' + iso + '"></button>';
      }
      cols.push('<div class="hcol">' + col + "</div>");
    }
    return '<div class="heat">' + cols.join("") + "</div>";
  }

  // The exact bytes hashed for an entry. Published in the export so a third
  // party can re-run the hash with standard tools instead of trusting this app.
  function preimage(e) {
    return canon({ i: e.i, ts: e.ts, type: e.type, ref: e.ref, data: e.data, prev: e.prev });
  }
  function recordBundle() {
    return {
      platform: "Brickford", startDate: D.START_DATE,
      exportedAt: new Date().toISOString(),
      count: S.ledger.length, head: chainHead(), genesis: GENESIS,
      howToVerify: [
        "1. For each entry: sha256(preimage) must equal its hash.",
        "   Shell check: printf '%s' \"<preimage>\" | shasum -a 256",
        "2. entry[i].prev must equal entry[i-1].hash; entry[0].prev must equal the genesis string.",
        "3. Any edited, inserted or removed entry changes every hash after it, so the chain stops matching.",
        "4. Timestamps are self-reported. Trust them only as far as the anchors below: each anchor is a head hash published somewhere with its own independent timestamp.",
      ],
      anchors: S.anchors,
      entries: S.ledger.map(e => Object.assign({}, e, { preimage: preimage(e) })),
    };
  }
  const EV_LABEL = { lesson: "Lecture", problem: "Problem", exam: "Examination", diagnostic: "Diagnostic", gate: "Gate", week: "Week sealed", lab: "Lab", day: "Day sealed", streak: "Streak", rep: "Practice" };
  function eventLine(e) {
    const d = e.data || {};
    if (e.type === "exam") return "Examination · " + e.ref + " · " + d.pct + "% (" + d.score + "/" + d.total + ")";
    if (e.type === "diagnostic") return "Diagnostic · " + e.ref + (d.score == null ? " · completed" : " · " + d.score + "%");
    if (e.type === "gate") return (d.passed ? "Gate passed · " : "Gate un-marked · ") + e.ref;
    if (e.type === "week") return "Week sealed · " + e.ref + (d.shipped ? " · shipped: " + d.shipped : " · nothing shipped");
    if (e.type === "lab") return (d.done ? "Lab shipped · " : "Lab un-marked · ") + e.ref;
    if (e.type === "lesson") return (d.done ? "Lecture completed · " : "Lecture un-marked · ") + e.ref;
    if (e.type === "problem") return (d.solved ? "Problem solved · " : "Problem un-marked · ") + e.ref;
    if (e.type === "day") return "Deep Track day sealed";
    if (e.type === "rep") return ({
      bank: "Story bank entry", story: "Story rep recorded" + (d.seconds ? " \u00b7 " + d.seconds + "s" : ""),
      humor: "Humour rep \u00b7 five attempts" + (d.keeper ? " \u00b7 kept #" + d.keeper : " \u00b7 none kept"),
      review: "Monthly review written",
    })[e.ref] || "Practice rep";
    if (e.type === "streak") return "Streak reset to zero · previous run " + (d.was || 0) + "d" +
      (d.best ? " · longest ever " + d.best + "d" : "");
    return (EV_LABEL[e.type] || e.type) + " · " + e.ref;
  }

  // Recall, then judge yourself. Forgetting resets the interval; solid recall
  // pushes it out. This is the revision engine — watching once is not enough.
  // Why the method is the method, drawn rather than argued: one curve for
  // watch-and-move-on, one for recall at widening intervals.
  function retentionSVG() {
    const W = 620, H = 165, pad = 26, days = 130;
    const X = d => pad + (d / days) * (W - pad - 10);
    const Y = r => H - pad - (r / 100) * (H - pad - 22);
    const dec = (from, t, tau, r0) => r0 * Math.exp(-(t - from) / tau);
    let passive = "";
    for (let d = 0; d <= days; d += 2) passive += (d ? "L" : "M") + X(d).toFixed(1) + " " + Y(100 * Math.exp(-d / 13)).toFixed(1) + " ";
    const marks = [0, 2, 9, 30, 90];
    let spaced = "", dots = "";
    marks.forEach((m, i) => {
      const end = i + 1 < marks.length ? marks[i + 1] : days;
      const tau = 13 * (i + 1) * 1.5;
      for (let d = m; d <= end; d += 1.5) {
        const r = dec(m, d, tau, 100);
        spaced += (d === m && i === 0 ? "M" : "L") + X(d).toFixed(1) + " " + Y(r).toFixed(1) + " ";
      }
      if (i + 1 < marks.length) spaced += "L" + X(end).toFixed(1) + " " + Y(100).toFixed(1) + " ";
      if (m > 0) dots += '<circle cx="' + X(m).toFixed(1) + '" cy="' + Y(100).toFixed(1) + '" r="3.4" fill="var(--accent)"/>';
    });
    return '<svg class="curve" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Retention decays quickly without recall; each recall resets it and flattens the decay">' +
      '<line x1="' + pad + '" y1="' + Y(0) + '" x2="' + (W - 10) + '" y2="' + Y(0) + '" stroke="var(--line)"/>' +
      '<line x1="' + pad + '" y1="' + Y(0) + '" x2="' + pad + '" y2="' + Y(100) + '" stroke="var(--line)"/>' +
      '<text x="4" y="' + (Y(100) + 4) + '" class="ctick">100%</text>' +
      '<text x="' + pad + '" y="' + (H - 8) + '" class="ctick">day 0</text>' +
      '<text x="' + (W - 40) + '" y="' + (H - 8) + '" class="ctick">day 130</text>' +
      '<path d="' + passive + '" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="4 3"/>' +
      '<path d="' + spaced + '" fill="none" stroke="var(--accent)" stroke-width="2.2" class="curve-draw"/>' +
      dots + "</svg>";
  }

  // ---------- only ask what has been taught ----------
  // Testing un-encoded material is not retrieval practice, it is discouragement.
  // A question unlocks when the lecture that teaches it has been watched. Banks
  // whose questions are not yet tagged fall back to "the course has begun", so
  // an unopened course can never appear in a drill.
  function questionUnlocked(bankId, q) {
    if (q && q.after) return !!(S.lessons[q.after] || {}).done;
    const course = D.COURSES.find(c => c.quiz === bankId);
    if (!course) return false;
    return courseLessonStats(course).done > 0 || !!(course.tracker && dsaCount() > 0);
  }
  function unlockedIdx(bankId) {
    const bank = D.QUIZZES[bankId];
    if (!bank) return [];
    return bank.questions.map((q, i) => questionUnlocked(bankId, q) ? i : -1).filter(i => i >= 0);
  }
  // A bank restricted to what you have covered, ready for DAR.Quiz.mount.
  function unlockedBank(bankId) {
    const bank = D.QUIZZES[bankId];
    const idx = unlockedIdx(bankId);
    return {
      bank: Object.assign({}, bank, {
        questions: idx.map(i => bank.questions[i]),
        perSitting: Math.min(bank.perSitting || 15, idx.length),
      }),
      map: idx, total: bank.questions.length, unlocked: idx.length,
    };
  }

  // ---------- concepts: ideas rather than videos ----------
  const CONCEPTS = () => (D.CONCEPTS || []);
  const conceptById = id => CONCEPTS().find(c => c.id === id);
  const cKey = id => "c:" + id;                  // recall keys for concepts
  function conceptState(id) {
    S.concepts[id] = S.concepts[id] || { sketches: [], proven: false, attempts: 0 };
    return S.concepts[id];
  }
  // Longest prerequisite chain — the graph's natural reading order.
  function conceptDepth(list) {
    const byId = {}; list.forEach(c => byId[c.id] = c);
    const d = {};
    const walk = id => {
      if (d[id] != null) return d[id];
      const c = byId[id];
      if (!c || !(c.prereq || []).length) return d[id] = 0;
      d[id] = 0; // guard against a cycle slipping past the harness
      return d[id] = 1 + Math.max.apply(null, c.prereq.map(p => byId[p] ? walk(p) : 0));
    };
    list.forEach(c => walk(c.id));
    return d;
  }
  // The map of a subject: columns are prerequisite depth, edges are dependencies.
  function conceptGraph(courseId) {
    const list = CONCEPTS().filter(c => c.course === courseId);
    if (!list.length) return "";
    const d = conceptDepth(list);
    const cols = {};
    list.forEach(c => (cols[d[c.id]] = cols[d[c.id]] || []).push(c));
    const depths = Object.keys(cols).map(Number).sort((a, b) => a - b);
    const NW = 118, NH = 42, GX = 158, GY = 56, PAD = 14;
    const rows = Math.max.apply(null, depths.map(k => cols[k].length));
    const W = PAD * 2 + (depths.length - 1) * GX + NW, H = PAD * 2 + (rows - 1) * GY + NH;
    const pos = {};
    depths.forEach((k, ci) => cols[k].forEach((c, ri) => {
      const n = cols[k].length;
      pos[c.id] = { x: PAD + ci * GX, y: PAD + ri * GY + (rows - n) * GY / 2 };
    }));
    let edges = "";
    list.forEach(c => (c.prereq || []).forEach(p => {
      if (!pos[p]) return;
      const a = pos[p], b = pos[c.id];
      const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2;
      edges += '<path d="M' + x1 + " " + y1 + " C" + (x1 + 26) + " " + y1 + " " + (x2 - 26) + " " + y2 + " " + x2 + " " + y2 +
        '" fill="none" stroke="var(--line-strong)" stroke-width="1.3"/>';
    }));
    let nodes = "";
    list.forEach(c => {
      const st = S.concepts[c.id] || {};
      const cls = st.proven ? "proven" : (st.sketches || []).length || st.attempts ? "seen" : "";
      const { x, y } = pos[c.id];
      // Greedy wrap onto two lines. Once a word has spilled to line two every
      // later word must follow it, or the title reads out of order.
      let l1 = "", l2 = "";
      c.title.split(" ").forEach(w => {
        if (!l2 && (l1 + " " + w).trim().length <= 18) l1 = (l1 + " " + w).trim();
        else l2 = (l2 + " " + w).trim();
      });
      if (l2.length > 20) l2 = l2.slice(0, 19).replace(/\s+\S*$/, "") + "…";
      const cc = D.COURSES.find(x => x.id === c.course);
      nodes += '<g class="cg-node ' + cls + (cc ? " " + facClass(cc) : "") + '" data-concept="' + esc(c.id) + '" tabindex="0" role="link" aria-label="' + esc(c.title) + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + NW + '" height="' + NH + '" rx="6"/>' +
        '<text x="' + (x + NW / 2) + '" y="' + (y + (l2 ? 17 : 25)) + '" text-anchor="middle">' + esc(l1) + "</text>" +
        (l2 ? '<text x="' + (x + NW / 2) + '" y="' + (y + 31) + '" text-anchor="middle">' + esc(l2) + "</text>" : "") +
        "</g>";
    });
    return '<div class="cg-wrap"><svg class="cg" viewBox="0 0 ' + W + " " + H + '" style="width:' + W + 'px;">' + edges + nodes + "</svg></div>";
  }

  V.summary = function (cid, ui, li) {
    const k = lessonKey(cid, ui, li);
    const sm = (D.SUMMARIES || {})[k];
    const c = D.COURSES.find(x => x.id === cid);
    const l = c && c.units[ui] ? c.units[ui].lessons[li] : null;
    const st = S.lessons[k] || {};
    if (!l) return '<div class="card">Unknown lecture.</div>';
    const back = "#/lesson/" + cid + "/" + ui + "/" + li;
    // The gate: a summary must never become a substitute for the lecture.
    if (!st.done)
      return '<div class="view-enter"><div class="card"><h2>Locked</h2>' +
        '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;">Watch the lecture and mark it watched. A summary is for review, not for skipping.</p>' +
        '<div style="margin-top:12px;"><a class="btn" href="' + back + '">Back to the lecture</a></div></div></div>';
    if (!sm)
      return '<div class="view-enter"><div class="page-head"><div class="kicker">' + esc(c.code) + '</div><h1>' + esc(l.t) + "</h1></div>" +
        '<div class="card"><h2>Not written yet</h2>' +
        '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;">Summaries are authored lecture by lecture. This one is still to come — the ones that exist are marked in the course view.</p>' +
        '<div style="margin-top:12px;"><a class="btn ghost" href="' + back + '">Back to the lecture</a></div></div></div>';
    return '<div class="view-enter"><div class="page-head"><div class="kicker"><a href="' + back + '">' + esc(c.code) + " · " + esc(l.t) + "</a></div>" +
      "<h1>Summary</h1>" +
      '<div class="sub">' + esc(sm.takeaway) + "</div></div>" +

      '<div class="card"><h2>How it builds</h2><div class="beats stagger">' +
      sm.beats.map((b, i) =>
        '<div class="beat"><div class="beat-n mono">' + (i + 1) + "</div>" +
        '<div class="beat-body"><div class="beat-t">' + b.t + "</div>" +
        '<div class="beat-d">' + b.d + "</div>" +
        (b.fig && D.FIG && D.FIG[b.fig] ? '<div class="beat-fig">' + D.FIG[b.fig]({}) + "</div>" : "") +
        "</div></div>").join("") + "</div></div>" +

      '<div class="grid cols-2 top" style="margin-top:16px;">' +
      '<div class="card"><h2>The worked pattern</h2><div class="beat-d" style="margin-top:6px;">' + sm.worked + "</div></div>" +
      '<div class="card"><h2>Where people slip</h2><div class="beat-d" style="margin-top:6px;">' + sm.watch + "</div>" +
      ((sm.concepts || []).length
        ? '<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:12px;">' +
          sm.concepts.map(id => { const q = (D.CONCEPTS || []).find(x => x.id === id); return q ? '<a class="pill wrapping" href="#/concept/' + id + '">' + esc(q.title) + "</a>" : ""; }).join("") + "</div>"
        : "") + "</div></div>" +

      (sm.checks && sm.checks.length
        ? '<div class="card" style="margin-top:16px;"><h2>Did it stick?</h2>' +
          '<div id="sumCheck"><button class="btn" data-act="startSummaryCheck" data-k="' + esc(k) + '">Check yourself · ' + sm.checks.length + " question" + (sm.checks.length === 1 ? "" : "s") + "</button></div></div>"
        : "") +
      '<div style="margin-top:16px;"><a class="btn ghost" href="' + back + '">Back to the lecture</a></div></div>';
  };

  V.sync = function () {
    const tok = ghToken();
    const last = S.settings.lastSyncAt || S.settings.lastSync;
    const err = S.settings.syncError;
    const devs = Object.keys(S.foreignLedgers).length;
    // Three states, not two. "Connected but every call is failing" was showing
    // as plain "Connected", which is the state this page most needs to name.
    const state = !tok ? "none" : err ? "broken" : "ok";
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Devices</div><h1>Sync</h1>' +
      '<div class="sub">One record on every device, kept in your own repo.</div></div>' +

      '<div class="card"><div class="vseal">' +
      '<div class="vico ' + (state === "ok" ? "ok" : "bad") + '">' + (state === "ok" ? "\u2713" : "!") + "</div>" +
      '<div class="vtext"><div class="vhead">' +
      (state === "ok" ? "Connected" : state === "broken" ? "Connected, but failing" : "Not connected") + "</div>" +
      '<div class="muted">' +
      (last ? "Last successful sync " + esc(agoLabel(last)) : "This device has never synced.") +
      (devs ? " \u00b7 " + devs + " other device" + (devs === 1 ? "" : "s") : "") + "</div></div></div>" +
      (err
        ? '<p class="note" style="border-color:var(--bad); color:var(--ink);"><strong>GitHub said:</strong> ' +
          esc(err.msg) + ' <span class="muted">(' + esc(agoLabel(err.at)) +
          ')</span><br>Until this clears, work on this device stays on this device.</p>'
        : "") +
      (tok
        ? '<div class="row-actions">' +
          '<button class="btn" data-act="syncPull">Pull</button>' +
          '<button class="btn" data-act="syncPush">Push</button>' +
          '<button class="btn ghost" data-act="syncShowTok">Show token</button>' +
          '<button class="btn ghost" data-act="syncForget">Forget token</button></div>' +
          '<div id="syncMsg" class="muted" style="margin-top:10px;"></div>' +
          // Setting up a second device used to mean minting a second token on
          // GitHub, which is the friction that left devices unconnected. The
          // token is already in this browser; let it be copied to the next one.
          '<div id="tokBox" hidden style="margin-top:12px;">' +
          '<label class="field" for="tokOut">This device\u2019s token — paste it into your other device</label>' +
          '<input id="tokOut" type="text" readonly value="' + esc(tok) + '">' +
          '<div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">' +
          '<button class="btn" data-act="syncCopyTok">Copy</button>' +
          '<button class="btn ghost" data-act="syncHideTok">Hide</button></div>' +
          '<p class="note">Anyone who reads this can write to ' + SYNC_REPO +
          '. Show it only on your own screen.</p></div>'
        : "") + "</div>" +

      (tok ? "" :
        '<div class="card" style="margin-top:16px;"><h2>Connect</h2>' +
        '<div class="glist" style="margin-top:10px;">' +
        '<div class="grow"><span class="g-lead">1</span><span class="g-main"><span class="g-t">Generate a token</span>' +
        '<span class="g-s">GitHub \u2192 Settings \u2192 Developer settings \u2192 <strong>Fine-grained tokens</strong> \u2192 Generate.</span></span></div>' +
        '<div class="grow"><span class="g-lead">2</span><span class="g-main"><span class="g-t">Scope it to one repository</span>' +
        '<span class="g-s">Repository access: <strong>only</strong> ' + SYNC_REPO + ". Permissions: <strong>Contents \u2192 Read and write</strong>. Nothing else.</span></span></div>" +
        '<div class="grow"><span class="g-lead">3</span><span class="g-main"><span class="g-t">Paste it below</span>' +
        '<span class="g-s">It stays in this browser and is sent only to github.com.</span></span></div>' +
        "</div>" +
        '<div style="margin-top:12px;"><label class="field" for="ghTok">Token</label>' +
        '<input id="ghTok" type="password" placeholder="github_pat_\u2026" autocomplete="off"></div>' +
        '<div style="margin-top:10px;"><button class="btn" data-act="syncConnect">Connect</button></div>' +
        '<p class="note">Anyone with this device can read the token. Scope it to the one repo; Forget it before lending the device.</p></div>') +

      // The commonest failure is not a bug: the token lives in this browser's
      // storage, so a device where it was never entered syncs nothing at all.
      // Two cards of prose read once and never again, on a page whose actual job
      // is one token field. They stay a tap away — this device having trouble is
      // exactly when they are wanted, and every other time they are in the way.
      '<details class="unit"><summary><span class="u-name">Do this on every device</span>' +
      '<span class="pill">3</span><span class="u-prog" style="width:100%;"></span></summary><div class="u-body">' +
      '<p class="muted">The token is stored in <strong>this browser only</strong>. Paste the same token on the laptop and on the phone — a device you have not connected keeps its own private copy of your progress and never tells you.</p>' +
      '<div class="glist" style="margin-top:10px;">' +
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">On a phone, connect the installed app too</span>' +
      '<span class="g-s">If you added Brickford to the Home Screen, connect it <strong>inside that app</strong> as well — a home-screen app can hold its own storage separate from Safari.</span></span></div>' +
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">How to check a device</span>' +
      '<span class="g-s">The dashboard names any device that is not connected, and shows how long ago it last synced on any device that is.</span></span></div>' +
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">Order does not matter</span>' +
      '<span class="g-s">A push merges what is already stored before it writes, so neither device can overwrite the other.</span></span></div>' +

      "</div></div></details>" +

      '<details class="unit"><summary><span class="u-name">How merging works</span>' +
      '<span class="pill">2</span><span class="u-prog" style="width:100%;"></span></summary><div class="u-body">' +
      '<div class="glist">' +
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">Working on two devices is safe</span>' +
      '<span class="g-s">Pull merges field by field \\u2014 the further-along version of each lecture wins, days and problems union.</span></span></div>' +
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">The record survives a sync</span>' +
      '<span class="g-s">Each device keeps its own hash chain. Syncing never re-hashes history, so a head you have already published stays valid.</span></span></div>' +

      "</div></div></details></div>";
  };

  // Faculty drives colour, so a subject is recognisable before it is read.
  const FACULTY_CLASS = {
    "Mathematics": "fac-math", "Artificial Intelligence": "fac-ai",
    "Systems": "fac-sys", "Physics": "fac-phys", "Research": "fac-res", "Speech": "fac-speech",
  };
  function facClass(c) {
    if (FACULTY_CLASS[c.faculty]) return FACULTY_CLASS[c.faculty];
    const f = (c.faculty || "").toLowerCase();
    if (f.indexOf("math") >= 0) return "fac-math";
    if (f.indexOf("system") >= 0 || f.indexOf("comput") >= 0 || f.indexOf("algorith") >= 0) return "fac-sys";
    if (f.indexOf("phys") >= 0) return "fac-phys";
    if (f.indexOf("research") >= 0) return "fac-res";
    if (f.indexOf("speech") >= 0 || f.indexOf("story") >= 0) return "fac-speech";
    return "fac-ai";
  }

  // When does each course actually begin? Derived from the schedule itself
  // rather than a hand-maintained phase field, because those drifted apart:
  // AI 200 is scheduled from day one while being labelled a 2027 course.
  let _startCache = null;
  function courseStartDays() {
    if (_startCache) return _startCache;
    const out = {};
    // Walk study days, not calendar days: `d` is the index the schedule itself
    // uses, so "opens week N" divides by the six-day study week.
    for (let d = 0; d <= 400; d++) {
      scheduledFor(dateForStudy(d)).forEach(it => {
        if (it.cid && out[it.cid] == null) out[it.cid] = d;
      });
      if (Object.keys(out).length >= D.COURSES.length) break;
    }
    return (_startCache = out);
  }

  // ---------- the quest line ----------
  // One spine, in the order the courses actually open, with the gates sitting on
  // it where they fall. It replaced the four phase bands rather than joining
  // them: two pictures of the same climb on one page is one picture too many,
  // and the bands could not show sequence — which is the only thing a person
  // wants from a map of three years.
  //
  // Every state here is derived, never stored: a node is locked because the
  // schedule has not reached it, running because it has, proven because lectures
  // were actually verified. Nothing about it can flatter you.
  const lockSVG = () => '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
    '<rect x="2.5" y="5.5" width="7" height="5" rx="1"/><path d="M4.2 5.5V4.2a1.8 1.8 0 013.6 0v1.3"/></svg>';

  V.atlas = function () {
    const gates = gatePlan();
    const starts = courseStartDays();
    const dToday = studyToday();
    const ng = nextGate();

    const running = D.COURSES.filter(c => c.tracker || (starts[c.id] != null && starts[c.id] <= dToday));
    const later = D.COURSES.filter(c => running.indexOf(c) < 0)
      .sort((a, b) => (starts[a.id] == null ? 1e9 : starts[a.id]) - (starts[b.id] == null ? 1e9 : starts[b.id]));
    const passed = gates.filter(g => g.doneDate);
    const ahead = gates.filter(g => !g.doneDate && (!ng || g.n !== ng.n));

    // A course as one row. It used to be a card sitting on a rail with a node
    // beside it, a coloured left edge, a progress bar four pixels wide at 4%,
    // and the words "running now" repeated down the right of all five of them.
    // That is five devices saying one thing. The row says it once.
    const courseRow = c => {
      const m = courseMastery(c);
      const st = c.tracker ? { done: dsaCount(), total: 150 } : courseLessonStats(c);
      const doneN = c.tracker ? st.done : st.verified;
      return '<a class="grow ' + facClass(c) + '" href="#/course/' + c.id + '">' +
        '<span class="g-lead"><span class="gdot' + (m >= 85 ? " on" : m > 0 ? " part" : "") + '"></span></span>' +
        '<span class="g-main"><span class="g-t">' + esc(c.title) + "</span>" +
        '<span class="g-s">' + esc(c.code) + " · " +
        (c.tracker ? doneN + " of " + st.total + " problems" : doneN + " of " + st.total + " proven") + "</span></span>" +
        (m > 0 ? '<span class="g-v">' + m + "%</span>" : "") + "</a>";
    };

    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Atlas</div><h1>The climb</h1>' +
      '<div class="sub">Everything running now, and the crossing you are walking towards.</div></div>' +

      // The one thing: the gate you are actually walking towards.
      (ng
        ? '<a class="card one" href="#/transcript" style="text-decoration:none; display:block;">' +
          '<div class="one-kind">Gate ' + ng.n + " — " + esc(ng.label) +
          ' <span class="one-more">' + Math.max(0, daysBetween(todayISO(), ng.target)) + " days</span></div>" +
          '<p class="one-hint">' + esc(ng.req) + "</p></a>"
        : '<div class="card one one-clear"><div class="one-kind">All gates passed</div>' +
          '<p class="one-hint">You are what you set out to become.</p></div>') +

      '<div class="ghead">Running now<span class="gh-meta">' + running.length + "</span></div>" +
      '<div class="glist">' + running.map(courseRow).join("") + "</div>" +

      // Everything else on this page is now the same row, in one group: the
      // crossings still ahead, the courses that have not opened, and the ideas.
      '<div class="ghead">The rest of it</div>' +
      '<div class="glist">' +
      (ahead.length
        ? '<a class="grow" href="#/transcript"><span class="g-lead">◆</span>' +
          '<span class="g-main"><span class="g-t">Later gates</span>' +
          '<span class="g-s">' + esc(ahead[0].label) + " next, " + Math.max(0, daysBetween(todayISO(), ahead[0].target)) + " days out</span></span>" +
          '<span class="g-v">' + ahead.length + "</span></a>"
        : "") +
      (passed.length
        ? '<a class="grow done-row" href="#/transcript"><span class="g-lead">✓</span>' +
          '<span class="g-main"><span class="g-t">Gates passed</span></span>' +
          '<span class="g-v">' + passed.length + "</span></a>"
        : "") +
      (later.length
        ? '<a class="grow" href="#/courses"><span class="g-lead">' + lockSVG() + "</span>" +
          '<span class="g-main"><span class="g-t">Opening later</span>' +
          '<span class="g-s">' + esc(later[0].title) + " opens week " +
          (starts[later[0].id] == null ? "—" : Math.floor(starts[later[0].id] / STUDY_WEEK) + 1) + "</span></span>" +
          '<span class="g-v">' + later.length + "</span></a>"
        : "") +
      (CONCEPTS().length
        ? '<a class="grow" href="#/concept/' + CONCEPTS()[0].id + '"><span class="g-lead">◇</span>' +
          '<span class="g-main"><span class="g-t">Linear algebra, as ideas</span>' +
          '<span class="g-s">Left depends on nothing</span></span>' +
          '<span class="g-v">' + CONCEPTS().length + "</span></a>"
        : "") +
      "</div></div>";
  };

  V.concept = function (id) {
    const c = conceptById(id);
    if (!c) return '<div class="card">Unknown concept.</div>';
    const st = conceptState(id);
    const revealed = !!st.revealed;
    const rv = S.review[cKey(id)];
    const course = D.COURSES.find(x => x.id === c.course);
    const last = (st.sketches || [])[st.sketches.length - 1];
    return '<div class="view-enter"><div class="page-head"><div class="kicker">' +
      (course ? '<a href="#/course/' + course.id + '">' + esc(course.code) + "</a>" : "Concept") + "</div>" +
      "<h1>" + esc(c.title) + "</h1>" +
      '<div class="sub">' + esc(c.one) + "</div></div>" +

      // ---- draw it before you are shown it ----
      '<div class="card"><div style="display:flex; align-items:baseline; justify-content:space-between; gap:10px; flex-wrap:wrap;">' +
      "<h2>Draw it from memory</h2>" +
      (st.proven ? '<span class="pill good">✓ proven</span>' : "") + "</div>" +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin:2px 0 10px;">Sketch first — then compare. Producing beats recognising.</p>' +
      '<canvas id="sketchPad" class="sketchpad" width="640" height="360"></canvas>' +
      '<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">' +
      '<button class="btn ghost" data-act="sketchClear">Clear</button>' +
      '<button class="btn ghost" data-act="sketchSave" data-cid="' + esc(id) + '">Save sketch</button>' +
      (revealed
        ? '<button class="btn ghost" data-act="hideFig" data-cid="' + esc(id) + '">Hide the figure</button>'
        : '<button class="btn" data-act="revealFig" data-cid="' + esc(id) + '">Reveal the figure</button>') +
      '<span class="mono" style="font-size:var(--fs-tiny); color:var(--ink-3);">' +
      (st.sketches || []).length + " saved</span></div>" +
      (last ? '<div style="margin-top:12px;"><div class="field">Your last sketch · ' + esc(last.date) + "</div>" +
        '<img class="sketch-prev" src="' + last.png + '" alt="your previous sketch"></div>' : "") +
      "</div>" +

      // ---- the reference figure ----
      (revealed && D.FIG && D.FIG[c.fig]
        ? '<div class="card" style="margin-top:16px;"><h2>The figure</h2>' + D.FIG[c.fig]({}) +
          '<div class="glist" style="margin-top:10px;">' +
          '<div class="grow"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">Where people go wrong</span>' +
          '<span class="g-s">' + esc(c.miss) + "</span></span></div>" +
          '<div class="grow"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">What it is for, in AI</span>' +
          '<span class="g-s">' + esc(c.applies) + "</span></span></div>" +
          "</div></div>"
        : "") +

      // ---- the interactive figure, where one exists ----
      // Not gated behind the reveal: this one is not an answer to be spoiled, it
      // is an instrument. Playing with it before you can draw it is fine — the
      // point is to watch the number move when the picture moves.
      (c.lab && D.LAB && D.LAB[c.lab]
        ? '<div class="card" style="margin-top:16px;"><div class="row-split"><h2>Try it</h2>' +
          '<span class="pill">interactive</span></div>' +
          '<p class="note" style="margin:2px 0 0;">' + esc(D.LAB[c.lab].title) + "</p>" +
          '<div class="lab" id="labMount" data-lab="' + esc(c.lab) + '"></div>' +
          '<p class="note" style="margin-top:12px;"><strong style="color:var(--ink);">Ask yourself:</strong> ' +
          esc(D.LAB[c.lab].ask) + "</p></div>"
        : "") +

      // ---- probes ----
      '<div class="card" style="margin-top:16px;"><h2>Probe</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin:2px 0 10px;">All of them right, once, and this idea enters spaced recall</p>' +
      '<div id="probeMount"><button class="btn" data-act="startProbe" data-cid="' + esc(id) + '">Begin ' + c.probes.length + " question" + (c.probes.length === 1 ? "" : "s") + "</button></div></div>" +

      // ---- where it sits ----
      '<div class="card" style="margin-top:16px;"><h2>Stands on</h2>' +
      ((c.prereq || []).length
        ? '<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">' +
          c.prereq.map(p => { const q = conceptById(p); return q ? '<a class="pill wrapping" href="#/concept/' + p + '">' + esc(q.title) + "</a>" : ""; }).join("") + "</div>"
        : '<p style="font-size:var(--fs-small); color:var(--ink-2);">Nothing — this is bedrock.</p>') +
      (rv ? '<p class="note" style="margin-top:12px;">Next recall <span class="mono" style="color:' +
        (rv.due <= todayISO() ? "var(--accent)" : "var(--ink-3)") + ';">' + esc(rv.due) + "</span></p>" : "") +
      "</div>" +
      "</div>" +
      '<div class="ghead">Taught in<span class="gh-meta">' + (c.lectures || []).length + "</span></div>" +
      '<div class="glist">' +
      (c.lectures || []).map(k => {
        const L = lessonLabel(k);
        if (typeof L === "string") return "";
        return '<a class="grow" href="#/lesson/' + L.cid + "/" + L.ui + "/" + L.li + '">' +
          '<span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">' + esc(L.title) + "</span>" +
          '<span class="g-s">' + esc(L.code) + "</span></span></a>";
      }).join("") + "</div></div>";
  };

  V.method = function () {
    const step = (n, title, body) =>
      '<div class="mstep"><span class="mnum">' + n + '</span><div><strong style="color:var(--ink);">' + title + "</strong>" +
      '<div style="font-size:var(--fs-small); color:var(--ink-2);">' + body + "</div></div></div>";
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Method</div><h1>How to actually learn here</h1>' +
      '<div class="sub">Watching is the cheapest part. These loops are the rest.</div></div>' +

      // ---- the curve does the arguing ----
      '<div class="card"><h2>Why watching fades</h2>' +
      retentionSVG() +
      '<div class="cal-legend" style="margin-top:4px;">' +
      '<span><i style="width:14px;height:0;border-top:2px dashed var(--bad);display:inline-block;"></i> watch once</span>' +
      '<span><i style="width:14px;height:0;border-top:2px solid var(--accent);display:inline-block;"></i> recall at widening gaps</span>' +
      '<span><i class="pdot" style="background:var(--accent);"></i> a recall check</span></div></div>' +

      // ---- the four gates ----
      '<div class="card" style="margin-top:16px;"><h2>Four gates per lecture</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin:2px 0 12px;">All four, or it counts as watched — not proven</p>' +
      '<div class="stagger">' +
      step(1, "Recall cold", "Blank page, three minutes, no video. What did it establish?") +
      step(2, "Rebuild", "Reproduce the derivation or the code from memory. Diff it.") +
      step(3, "Solve unaided", "Three problems from the real source. Solutions only after.") +
      step(4, "Explain plainly", "A few sentences a smart friend would follow. That is your post.") +
      "</div></div>" +

      // ---- spacing ----
      '<div class="card" style="margin-top:16px;"><h2>Then it comes back</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin:2px 0 12px;">Solid recall pushes it out · forgetting resets it</p>' +
      '<div class="spacing">' +
      BOXES.map((d, i) => '<div class="sp-node"><span class="sp-dot" style="opacity:' + (0.45 + i * 0.14).toFixed(2) + '"></span>' +
        '<span class="sp-lab">' + d + "d</span></div>").join('<span class="sp-line"></span>') +
      "</div>" +
      '<div style="margin-top:14px;"><a class="btn" href="#/recall">Open Recall</a></div></div>' +

      // ---- coverage vs mastery, shown ----
      '<div class="card" style="margin-top:16px;"><h2>Two different numbers</h2>' +
      '<div style="margin-top:10px;"><div style="display:flex; justify-content:space-between; font-size:var(--fs-small); color:var(--ink-2);"><span>Watched</span><span class="mono">70%</span></div>' +
      '<div class="bar" style="margin-top:4px;"><u style="transform:scaleX(0.7);"></u></div></div>' +
      '<div style="margin-top:12px;"><div style="display:flex; justify-content:space-between; font-size:var(--fs-small); color:var(--ink);"><span>Proven</span><span class="mono">25%</span></div>' +
      '<div class="bar" style="margin-top:4px;"><i style="transform:scaleX(0.25);"></i></div></div>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:12px;">Mastery counts the second one. The gap is the honest picture of where you stand.</p>' +
      "</div></div>";
  };

  V.recall = function () {
    const due = reviewsDue();
    const all = Object.keys(S.review).filter(k => (S.lessons[k] || {}).verified);
    const next = all.filter(k => S.review[k].due > todayISO())
      .sort((a, b) => S.review[a].due < S.review[b].due ? -1 : 1).slice(0, 6);
    const card = k => {
      const L = lessonLabel(k);
      if (typeof L === "string") return "";
      const rv = S.review[k];
      return '<div class="card"><div style="display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;">' +
        '<div><div style="font-size:var(--fs-tiny); letter-spacing:0.1em; text-transform:uppercase; color:var(--ink-3); font-weight:600;">' + esc(L.code) + "</div>" +
        '<div style="color:var(--ink); font-weight:600;">' + esc(L.title) + "</div></div>" +
        '<span class="pill' + (rv.lapses > 1 ? " crimson" : "") + '">interval ' + BOXES[rv.box] + "d" + (rv.lapses ? " · " + rv.lapses + " lapse" + (rv.lapses === 1 ? "" : "s") : "") + "</span></div>" +
        '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:8px;">Say it out loud before you open anything. Then judge honestly.</p>' +
        '<div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">' +
        '<button class="btn ghost" data-recall="forgot" data-k="' + esc(k) + '">Forgot</button>' +
        '<button class="btn ghost" data-recall="shaky" data-k="' + esc(k) + '">Shaky</button>' +
        '<button class="btn" data-recall="solid" data-k="' + esc(k) + '">Solid</button>' +
        '<a class="btn ghost" href="#/lesson/' + L.cid + "/" + L.ui + "/" + L.li + '">Open lecture</a></div></div>';
    };
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Revision</div><h1>Recall</h1>' +
      '<div class="sub">Proven lectures come back before you forget them.</div></div>' +

      (due.length
        ? '<div class="onecounts" style="margin-bottom:16px;">' +
          "<div><b>" + due.length + "</b><span>due now</span></div>" +
          "<div><b>" + all.length + "</b><span>scheduled</span></div>" +
          "</div>" + due.slice(0, 8).map(card).join("")
        : '<div class="card"><div class="vseal"><div class="vico ok">✓</div><div class="vtext"><div class="vhead">Nothing due</div>' +
          '<div style="font-size:var(--fs-small); color:var(--ink-2);">' +
          (all.length ? all.length + " lecture" + (all.length === 1 ? "" : "s") + " scheduled ahead." : "Prove a lecture and it enters the rotation.") +
          "</div></div></div></div>") +

      (next.length
        ? '<div class="ghead">Coming up<span class="gh-meta">' + next.length + "</span></div>" +
          '<div class="glist">' +
          next.map(k => {
            const L = lessonLabel(k);
            if (typeof L === "string") return "";
            return '<div class="grow"><span class="g-lead"></span>' +
              '<span class="g-main"><span class="g-t">' + esc(L.title) + "</span>" +
              '<span class="g-s">' + esc(L.code) + "</span></span>" +
              '<span class="g-v">' + esc(S.review[k].due.slice(5)) + "</span></div>";
          }).join("") + "</div>"
        : "") +
      "</div>";
  };

  V.record = function () {
    const v = verifyChain();
    const led = S.ledger;
    const milestones = led.filter(e => ["exam", "diagnostic", "gate", "week", "lab", "streak"].indexOf(e.type) >= 0).slice(-14).reverse();
    const counts = {};
    led.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
    const first = led.length ? led[0].ts.slice(0, 10) : "—";
    const last = led.length ? led[led.length - 1].ts.slice(0, 10) : "—";
    const sealedDays = S.studyDays.length;
    const cur = streak(), best = bestStreak();
    const enoughHeat = daysBetween(D.START_DATE, todayISO()) >= 14;

    // ---- The page is one answer and a set of rows ----
    //
    // It was a verdict card, a counts row, a heatmap card, a streak box with its
    // own two-number layout, a milestones card and a disclosure — six shapes.
    // The answer this page exists to give is yes-or-no, so that is the card; the
    // numbers behind it are rows in one group, the way Health puts a ring at the
    // top and everything that feeds it underneath.
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Provenance</div><h1>Proof</h1>' +
      '<div class="sub">Everything you have actually done, hash-chained in order.</div></div>' +

      '<div class="card one' + (!led.length ? "" : v.ok ? " one-clear" : " urgent") + '">' +
      '<div class="one-kind">' +
      (!led.length ? "Nothing recorded yet" : v.ok ? "Chain intact" : "Chain broken at entry " + v.brokenAt) +
      (led.length && v.ok ? ' <span class="one-more">' + v.count + " entr" + (v.count === 1 ? "y" : "ies") + "</span>" : "") +
      "</div>" +
      '<p class="one-hint">' + (led.length ? first + " → " + last : "The first lecture you prove starts the chain.") + "</p>" +
      (led.length ? '<button class="btn lg one-go" data-act="exportRecord">Download record</button>' : "") +
      "</div>" +

      // The streak, as two rows rather than a bespoke box.
      '<div class="ghead">The run</div>' +
      '<div class="glist">' +
      '<div class="grow"><span class="g-lead"></span><span class="g-main"><span class="g-t">Current streak</span>' +
      '<span class="g-s">' +
      (S.settings.streakFrom ? "counting from " + esc(S.settings.streakFrom) : "every sealed day · Saturdays stepped over") +
      "</span></span>" +
      '<span class="g-v">' + cur + "d</span></div>" +
      '<div class="grow"><span class="g-lead"></span><span class="g-main"><span class="g-t">Longest ever</span>' +
      '<span class="g-s">a reset never touches this</span></span>' +
      '<span class="g-v">' + best + "d</span></div>" +
      (sealedDays ? '<div class="grow"><span class="g-lead"></span><span class="g-main"><span class="g-t">Days sealed</span></span>' +
        '<span class="g-v">' + sealedDays + "</span></div>" : "") +
      (counts.lesson ? '<a class="grow" href="#/courses"><span class="g-lead"></span><span class="g-main"><span class="g-t">Lectures proven</span></span>' +
        '<span class="g-v">' + counts.lesson + "</span></a>" : "") +
      (counts.exam ? '<a class="grow" href="#/exams"><span class="g-lead"></span><span class="g-main"><span class="g-t">Examinations</span></span>' +
        '<span class="g-v">' + counts.exam + "</span></a>" : "") +
      "</div>" +

      // The chart earns its card only once it has weeks to draw.
      (enoughHeat
        ? '<div class="ghead">Consistency<span class="gh-meta">one square per day</span></div>' +
          '<div class="card">' + heatmapHTML(26) +
          '<div class="cal-legend"><span>Quiet</span>' +
          [0, 1, 2, 3, 4].map(l => '<span class="hc l' + l + '" style="display:inline-block;"></span>').join("") +
          "<span>Busy</span></div></div>"
        : "") +

      (milestones.length
        ? '<div class="ghead">Milestones<span class="gh-meta">' + milestones.length + "</span></div>" +
          '<div class="glist">' +
          milestones.slice(0, 6).map(e =>
            '<div class="grow"><span class="g-lead"></span><span class="g-main">' +
            '<span class="g-t">' + esc(eventLine(e)) + "</span></span>" +
            '<span class="g-v">' + e.ts.slice(5, 10) + "</span></div>").join("") +
          "</div>"
        : "") +

      // Everything you touch a few times a year, behind one row each.
      '<div class="ghead">More</div>' +
      '<div class="glist">' +
      '<a class="grow" href="#/transcript"><span class="g-lead"></span><span class="g-main">' +
      '<span class="g-t">Transcript &amp; gates</span><span class="g-s">mastery per course, the five crossings</span></span></a>' +
      '<a class="grow" href="#/method"><span class="g-lead"></span><span class="g-main">' +
      '<span class="g-t">How the record works</span><span class="g-s">what a hash chain proves, and what it does not</span></span></a>' +
      '<button class="grow nav" data-act="toggleAdv"><span class="g-lead"></span><span class="g-main">' +
      '<span class="g-t">Anchor &amp; verify</span><span class="g-s">' +
      (S.anchors.length ? S.anchors.length + " anchored" : "publish the head hash, or check an exported file") + "</span></span></button>" +
      '<button class="grow" data-act="resetStreak"><span class="g-lead"></span><span class="g-main">' +
      '<span class="g-t" style="color:var(--bad);">Reset the streak counter</span>' +
      '<span class="g-s">the sealed days and the chain are untouched</span></span></button>' +
      "</div>" +

      '<div id="advBox" hidden style="margin-top:var(--sp-3);">' +
      (led.length ? '<div class="hash">head ' + esc(chainHead()) + "</div>" +
        '<div class="row-actions"><button class="btn ghost" data-act="copyHead">Copy head hash</button></div>' : "") +
      '<div class="card" style="margin-top:12px;"><h2>Public anchors</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:2px;">Timestamps inside this app are self-reported. Publish the head hash somewhere public and its date becomes third-party evidence.</p>' +
      (S.anchors.length
        ? '<div class="glist" style="margin-top:10px;">' + S.anchors.slice().reverse().map((an, ri) => {
            const i = S.anchors.length - 1 - ri;
            return '<div class="grow"><span class="g-lead">◆</span>' +
              '<span class="g-main"><span class="g-t">' + (an.url ? '<a href="' + esc(an.url) + '" target="_blank" rel="noopener">' + esc(an.where || an.url) + "</a>" : esc(an.where || "—")) + "</span>" +
              '<span class="g-s">' + esc(an.date) + '</span><div class="hash" style="margin-top:4px;">' + esc(an.head) + "</div></span>" +
              '<button class="btn tiny" data-delanchor="' + i + '">Remove</button></div>';
          }).join("") + "</div>"
        : '<p class="note">No anchors yet.</p>') +
      '<div class="grid cols-2" style="margin-top:12px;">' +
      '<div><label class="field" for="anWhere">Where published</label><input id="anWhere" type="text" placeholder="a commit, or an X post"></div>' +
      '<div><label class="field" for="anUrl">Link (optional)</label><input id="anUrl" type="text" placeholder="https://…"></div></div>' +
      '<div style="margin-top:10px;"><button class="btn" data-act="addAnchor">Anchor today’s head</button></div></div>' +
      '<div class="card" style="margin-top:12px;"><h2>Verify a record file</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:2px;">Anyone can check an exported record here — the file ships the exact bytes that were hashed.</p>' +
      '<div style="margin-top:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">' +
      '<button class="btn ghost" data-act="pickRecord">Choose file…</button>' +
      '<input type="file" id="recFile" accept=".json" style="display:none;">' +
      '<span id="recResult" style="font-size:var(--fs-small); color:var(--ink-2);"></span></div></div>' +
      "</div></div>";
  };

  V.transcript = function () {
    const counted = D.COURSES.filter(c => !c.elective && c.phase <= currentPhase());
    const overall = counted.length ? Math.round(counted.reduce((a, c) => a + courseMastery(c), 0) / counted.length) : 0;
    const [stEn, stGrade] = standing(overall);
    const plan = gatePlan();
    const ng = nextGate();

    const gateBtn = g => '<button class="btn' + (g.doneDate ? " ghost" : "") + '" data-gate="' + g.n + '">' +
      (g.doneDate ? "Unmark" : "Mark passed — honestly") + "</button>";


    // A gate as one row. This was a spine — an <ol class="quest"> with its own
    // rail, its own nodes and its own two-line body, drawn nowhere else in the
    // app since the Atlas stopped using it. Same five facts, the shape every
    // other list on every other page already has.
    const gateLine = g => {
      const passed = !!g.doneDate;
      const left = daysBetween(todayISO(), g.target);
      return '<div class="grow' + (passed ? " done-row" : "") + '">' +
        '<span class="g-lead">' + (passed ? "✓" : g.n) + "</span>" +
        '<span class="g-main"><span class="g-t">Gate ' + g.n + " — " + esc(g.label) + "</span>" +
        '<span class="g-s">' + esc(g.req) + "</span></span>" +
        '<span class="g-v"' + (!passed && left < 0 ? ' style="color:var(--bad);"' : "") + ">" +
        (passed ? esc(g.doneDate) : left >= 0 ? left + "d" : (-left) + "d over") +
        "</span></div>";
    };

    return '<div class="view-enter"><div class="page-head"><div class="kicker">Official record</div><h1>Transcript &amp; gates</h1></div>' +

      // The seal. It is the page's whole claim, so it stays — at the size a
      // statement needs rather than the 36px-padded block it was.
      '<div class="card feature" style="text-align:center;">' +
            // Caslon ships 400 and 700; 600 makes the browser synthesise a weight by
      // smearing the outlines, which is exactly the wrong thing to do to a seal.
      '<div style="font-family:var(--font-display); font-weight:700; font-size:1.35rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink);">Brickford</div>' +
      '<div style="font-size:var(--fs-tiny); letter-spacing:0.16em; text-transform:uppercase; color:var(--ink-3); margin-top:2px;">Academic record</div>' +
      '<div class="mono" style="font-size:2.4rem; font-weight:600; color:var(--ink); margin-top:10px;">' + overall + "%</div>" +
      '<div class="pill gold" style="margin-top:6px;">' + stEn + (stGrade !== "—" ? " · Grade " + stGrade : "") + "</div></div>" +

      // The gate you are at, with the one control this page exists for.
      (ng
        ? '<div class="card one' + (daysBetween(todayISO(), ng.target) < 0 ? " urgent" : "") + '">' +
          '<div class="one-kind">Gate ' + ng.n + " — " + esc(ng.label) +
          ' <span class="one-more">' + Math.max(0, daysBetween(todayISO(), ng.target)) + "d left</span></div>" +
          '<p class="one-hint">' + esc(ng.req) + "</p>" +
          '<div class="one-go" style="display:flex; gap:8px; flex-wrap:wrap;">' + gateBtn(ng) + "</div></div>"
        : '<div class="card one one-clear"><div class="one-kind">All gates passed</div>' +
          '<p class="one-hint">You are what you set out to become.</p></div>') +

      // No "Mastery" cell: the seal above states that number at 2.4rem, and no
      // "Mastered 0" — an absence, three lines under a 0% that already said so.
      (function () {
        const mastered = D.COURSES.filter(c => courseMastery(c) >= 85).length;
        const cells = [
          "<div><b>" + plan.filter(g => g.doneDate).length + " / " + plan.length + "</b><span>Gates passed</span></div>",
          "<div><b>" + counted.length + "</b><span>Courses counted</span></div>",
          mastered ? "<div><b>" + mastered + "</b><span>Mastered</span></div>" : "",
        ].filter(Boolean);
        return '<div class="onecounts">' + cells.join("") + "</div>";
      })() +

      '<div class="ghead">The five gates<span class="gh-meta">each from the last one passed</span></div>' +
      '<div class="glist">' + plan.map(gateLine).join("") + "</div>" +

      // The buttons used to be a second copy of the same five gates, in a
      // different row shape, behind a fold. One list is enough: the fold now
      // holds only the controls, one per gate, named by number.
      '<details class="unit"><summary><span class="u-name">Mark a gate passed</span>' +
      '<span class="pill">honestly</span><span class="u-prog" style="width:100%;"></span></summary>' +
      '<div class="u-body"><p class="note" style="margin:0 0 10px;">Adaptive: pass one early and every later target moves earlier with it.</p>' +
      '<div class="row-actions" style="margin-top:0;">' + plan.map(g =>
        '<button class="btn' + (g.doneDate ? " ghost" : "") + '" data-gate="' + g.n + '">' +
        (g.doneDate ? "Unmark " : "Pass ") + g.n + "</button>").join("") +
      "</div></div></details>" +

      '<details class="unit"><summary><span class="u-name">Mastery, course by course</span>' +
      '<span class="pill">' + D.COURSES.length + "</span>" +
      '<span class="u-prog" style="width:' + overall + '%;"></span></summary><div class="u-body">' +
      '<div class="table-wrap"><table><thead><tr><th>Course</th><th style="width:34%;">Mastery</th><th>Best exam</th><th>Standing</th></tr></thead><tbody>' +
      D.COURSES.map(c => {
        const m = courseMastery(c);
        const q = c.quiz ? bestQuiz(c.quiz) : null;
        const [sEn] = standing(m);
        return "<tr><td><strong style='color:var(--accent);'>" + esc(c.code) + "</strong><div style='font-size:var(--fs-tiny); color:var(--ink-3);'>" + esc(c.title) + "</div></td>" +
          '<td><div class="bar"><i style="transform:scaleX(' + (m / 100) + ');"></i></div></td>' +
          "<td>" + (q != null ? q + "%" : "—") + "</td><td>" + m + "% · " + sEn + "</td></tr>";
      }).join("") + "</tbody></table></div></div></details>" +
      "</div>";
  };

  V.review = function () {
    const w = weekNumber();
    const logged = S.weeks.some(x => +x.week === w);
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Sunday ritual</div><h1>Week</h1>' +
      '<div class="sub">Seal the week: what shipped, what did not. No shipped artifact is a failed week.</div></div>' +
      '<div class="card"><h2>Week ' + w + (logged ? " — already logged" : "") + "</h2>" +
      '<div class="grid cols-2" style="margin-top:10px;">' +
      '<div><label class="field">Shipped this week (repo, post, PR, delivery — or empty if none)</label><input type="text" id="rvShipped" placeholder="e.g. flashcards-cli on GitHub + blog post #1"></div>' +
      '<div><label class="field">Total DSA problems solved (cumulative — auto-filled from CS 150)</label><input type="number" id="rvDsa" value="' + dsaCount() + '"></div>' +
      '<div><label class="field">Posts published this week</label><input type="number" id="rvPosts" value="0" min="0"></div>' +
      '<div><label class="field">Revenue this week (BHD)</label><input type="number" id="rvRev" value="0" min="0" step="0.01"></div>' +
      "</div>" +
      '<div style="margin-top:12px;"><label class="field">Notes / blockers</label><textarea id="rvNotes" placeholder="What worked, what broke, what changes next week."></textarea></div>' +
      '<div style="margin-top:12px;"><button class="btn" data-act="logWeek">Seal the week</button></div></div>' +
      '<div class="card"><h2>The register</h2><div class="table-wrap"><table><thead><tr><th>Week</th><th>Shipped</th><th>DSA</th><th>Posts</th><th>Revenue</th><th>Notes</th></tr></thead><tbody>' +
      (S.weeks.length ? S.weeks.slice().reverse().map(x =>
        "<tr><td><strong style='color:" + (x.shipped ? "var(--ink)" : "var(--bad)") + ";'>W" + x.week + (x.shipped ? "" : " ✗") + "</strong><div style='font-size:var(--fs-tiny); color:var(--ink-3);'>" + x.date + "</div></td>" +
        "<td>" + (x.shipped ? esc(x.shipped) : "<span style='color:var(--bad);'>nothing shipped — failed week</span>") + "</td>" +
        "<td>" + (x.dsa || 0) + "</td><td>" + (x.posts || 0) + "</td><td>" + fmtBHD(+x.revenue || 0) + "</td><td>" + esc(x.notes || "") + "</td></tr>").join("")
        : '<tr><td colspan="6" style="color:var(--ink-3);">No weeks sealed yet. The first Sunday is coming.</td></tr>') +
      "</tbody></table></div></div></div>";
  };

  V.calendar = function () {
    const start = S.settings.dailyStart || "08:00";
    const openGates = gatePlan().filter(g => !g.doneDate);
    const dailyLink = gcalUrl("Brickford — Deep Track",
      "Theory ~2h, Build ~1.5h, Drill ~10min, Publish ~30min. Open the Dashboard for today's exact plan.",
      { startDate: todayISO() > D.START_DATE ? todayISO() : D.START_DATE, durationMin: 300, recur: "FREQ=WEEKLY;BYDAY=" + ICS_STUDY_DAYS });
    const nextSunday = addDaysISO(todayISO(), (7 - new Date(todayISO() + "T00:00:00").getDay()) % 7 || 7);
    const reviewLink = gcalUrl("Brickford — Weekly Review (seal the week)",
      "No shipped artifact = a failed week. Fill the row before the day ends.",
      { startDate: nextSunday, atTime: "18:00", durationMin: 30, recur: "FREQ=WEEKLY;BYDAY=SU" });

    return '<div class="view-enter"><div class="page-head"><div class="kicker">The rhythm</div><h1>Calendar</h1>' +
      '<div class="sub">Tap any day for its brief.</div></div>' +

      monthGridHTML() +
      dayDetailHTML() +

      // Five stacked cards of settings and export sat under the calendar - a
      // start-time field, two Google Calendar links, the gate deadlines, an ICS
      // download, and a static block table. None of them answer "what is on
      // which day", which is the page's job; you touch them once and never
      // again. apple-design 6: the common path first, the rest one level deeper.
      '<details class="unit" style="margin-top:16px;"><summary>' +
      '<span class="u-name">Sync to your calendar app</span>' +
      // Was "5 gates open", which is true but has nothing to do with exporting
      // an .ics — the pill names what is behind the fold, not a number it found.
      '<span class="pill">.ics</span>' +
      '<span class="u-prog" style="width:0%;"></span></summary><div class="u-body">' +

      '<div style="display:flex; gap:10px; align-items:flex-end; max-width:280px;">' +
      '<div style="flex:1;"><label class="field" for="calStart">Deep Track start time</label>' +
      '<input type="text" id="calStart" value="' + esc(start) + '" placeholder="08:00" inputmode="numeric"></div>' +
      '<button class="btn ghost" data-act="saveCalStart">Save</button></div>' +

      '<div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">' +
      '<a class="btn" href="' + dailyLink + '" target="_blank" rel="noopener">Deep Track \u2014 daily, ' + esc(start) + "\u2013" + esc(addMinutesClock(start, 300)) + ' \u2197</a>' +
      '<a class="btn ghost" href="' + reviewLink + '" target="_blank" rel="noopener">Weekly review \u2014 Sundays 18:00 \u2197</a>' +
      '<button class="btn ghost" data-act="downloadIcs">Download .ics</button></div>' +

      (openGates.length
        ? '<div class="glist" style="margin-top:14px;">' + openGates.map(g =>
            '<div class="grow"><span class="g-lead">' + g.n + "</span>" +
            '<span class="g-main"><span class="g-t">' + esc(g.label) + "</span>" +
            '<span class="g-s">' + g.target + "</span></span>" +
            '<a class="btn tiny" href="' + gcalUrl("Brickford Gate " + g.n + " \u2014 " + g.label, g.req, { allDay: true, startDate: g.target }) + '" target="_blank" rel="noopener">Add \u2197</a></div>'
          ).join("") + "</div>"
        : '<p class="note" style="margin-top:12px; color:var(--good);">All five gates passed \u2014 nothing left to schedule.</p>') +
      "</div></details></div>";
  };

  // The brief: the mechanic in one sentence, three to five rules, one drill of
  // ten minutes or less that leaves an artifact, and one check. Nothing longer
  // than the drill - reading about storytelling is not the subject.
  function drillHTML(key) {
    const d = (D.DRILLS || {})[key];
    if (!d) return "";
    const ICON = { written: "✎", recorded: "●", spoken: "❝" };
    return '<div class="ghead">The mechanic<span class="gh-meta">module ' + esc(d.module || "") +
      " · drill " + d.drill.minutes + "m · same day</span></div>" +
      '<div class="card drill">' +
      '<p class="dr-mech">' + esc(d.mechanic) + "</p>" +
      '<ol class="dr-rules">' + d.rules.map(r => "<li>" + r + "</li>").join("") + "</ol>" +
      '<div class="dr-do"><div class="dr-tag">' + (ICON[d.drill.artifact] || "•") + " " +
      esc(d.drill.artifact) + " · " + d.drill.minutes + "m</div>" +
      "<p><strong>Do this today.</strong> " + esc(d.drill.do) + "</p>" +
      '<p class="dr-check"><strong>It worked if:</strong> ' + esc(d.check) + "</p></div>" +
      '<div class="row-actions"><a class="btn ghost" href="#/practice">Log it on the Practice page ▸</a></div>' +
      "</div>";
  }

  // The page you land on to DO a rep, not to read about one.
  //
  // It was four stacked cards, 241 words of instruction and twelve input fields
  // all on screen at once - you had to read four paragraphs before you could do
  // a two-minute entry. apple-design 6: "strip the unnecessary so the core
  // purpose shines... show the common path first, advanced options one level
  // deeper." The common path is the single rep owed right now. Everything else
  // is one level deeper, behind the counts row or the history fold.
  const REP_FORM = {
    bank: () =>
      '<label class="field" for="bankWhat">What happened</label>' +
      '<input id="bankWhat" type="text" autocomplete="off" placeholder="a client asked what an embedding was">' +
      '<label class="field" for="bankWhy" style="margin-top:10px;">Why it stuck</label>' +
      '<input id="bankWhy" type="text" autocomplete="off" placeholder="he got it in 20 seconds">',
    story: () =>
      '<div class="grid cols-2">' +
      '<div><label class="field" for="repSecs">Seconds</label><input id="repSecs" type="number" min="1" max="600" inputmode="numeric"></div>' +
      '<div><label class="field" for="repTakes">Takes</label><input id="repTakes" type="number" min="1" max="50" inputmode="numeric"></div></div>' +
      '<label class="field" for="repWhich" style="margin-top:10px;">Which entry</label>' +
      '<input id="repWhich" type="text" autocomplete="off" placeholder="the napkin one">',
    humor: () =>
      [0, 1, 2, 3, 4].map(k =>
        '<input id="joke' + k + '" type="text" autocomplete="off" style="margin-top:' + (k ? "8px" : "0") +
        ';" aria-label="Attempt ' + (k + 1) + '" placeholder="' + (k + 1) + '"></input>').join("") +
      '<label class="field" for="jokeKeep" style="margin-top:10px;">Keeper (1\u20135, blank for none)</label>' +
      '<input id="jokeKeep" type="number" min="1" max="5" inputmode="numeric">',
    review: () =>
      '<label class="field" for="revNotes">What the four-week-old recording shows</label>' +
      '<textarea id="revNotes" rows="4"></textarea>',
  };
  const REP_ACT = { bank: "repBank", story: "repStory", humor: "repHumor", review: "repReview" };
  const REP_VERB = { bank: "Log it", story: "Log the rep", humor: "Log five", review: "Log the review" };

  V.practice = function () {
    const R = S.reps, today = todayISO(), due = repsDue();
    const resting = isRestDay(today) && today >= D.START_DATE;
    const n = k => (R[k] || []).length;
    const bank = (R.bank || []).slice().reverse();
    const wk = weekOf(today);

    // ---- The week, as six dots ----
    // The only feedback on this page. Without it a good week and a bad week
    // look identical, because all the page otherwise shows is today's rep.
    let logged = 0;
    const dots = wk < 0 ? "" : (function () {
      let out = "";
      for (let i = 0; i < STUDY_WEEK; i++) {
        const iso = dateForStudy(wk * STUDY_WEEK + i);
        const on = (R.bank || []).some(e => e.date === iso);
        if (on) logged++;
        // Today counts as ahead until it is over — drawing it as a gap the
        // moment the page loads would mark a day you still have hours of.
        const ahead = iso >= today;
        out += '<span class="wd' + (on ? " on" : ahead ? " ahead" : "") +
          (iso === today ? " now" : "") + '" title="' + iso + (on ? " · logged" : "") + '"></span>';
      }
      return out;
    })();

    const head = '<div class="view-enter"><div class="page-head"><div class="kicker">The reps</div><h1>Practice</h1>' +
      '<div class="sub">Watching does not make anyone funnier. This does.</div></div>';

    // The dots sit in a labelled row rather than floating under the card with a
    // two-word caption — so the thing they count is stated, not guessed.
    const weekRow = wk < 0 ? "" :
      '<div class="glist" style="margin-top:var(--sp-3);"><div class="grow">' +
      '<span class="g-main"><span class="g-t">This week</span>' +
      '<span class="g-s">' + logged + " of " + STUDY_WEEK + " days logged</span></span>" +
      '<span class="weekdots" role="img" aria-label="' + logged + " of " + STUDY_WEEK + ' days logged this week">' + dots + "</span></div></div>";

    // Four numbers that were a grid are four rows in the group every other page
    // now uses — and a kind you have never done is not a zero on the screen.
    const counts = (function () {
      const rows = [["bank", "Story bank", "one real thing, two lines"],
                    ["story", "Story reps", "recorded, under 90 seconds"],
                    ["humor", "Humour reps", "five attempts, most will be bad"],
                    ["review", "Monthly reviews", "rewatch what you recorded"]]
        .filter(([k]) => n(k) > 0)
        .map(([k, t, sub]) => '<div class="grow"><span class="g-main"><span class="g-t">' + t + "</span>" +
          '<span class="g-s">' + sub + '</span></span><span class="g-v">' + n(k) + "</span></div>");
      if (!rows.length) return "";
      return '<div class="ghead">Logged so far</div><div class="glist">' + rows.join("") + "</div>";
    })();

    if (resting)
      return head + '<div class="card one"><div class="one-kind">' + REST_NAME + "</div>" +
        '<p class="one-hint">Nothing owed today.</p></div>' + weekRow + counts + "</div>";

    if (!due.length)
      return head + '<div class="card one one-clear"><div class="one-kind">Clear for today</div>' +
        '<p class="one-hint">Every rep owed today is logged. Streak ' + streak() + "d.</p></div>" +
        weekRow + counts + repHistoryHTML(bank, R) + "</div>";

    // ONE rep. The next one appears here the moment this is logged.
    const d = due[0];
    return head +
      '<div class="card one">' +
      '<div class="one-kind">' + esc(d.label) + (due.length > 1 ? ' <span class="one-more">+' + (due.length - 1) + " more</span>" : "") + "</div>" +
      '<p class="one-hint">' + esc(d.hint) + "</p>" +
      '<div class="one-body">' + REP_FORM[d.kind]() + "</div>" +
      '<button class="btn lg one-go" data-act="' + REP_ACT[d.kind] + '">' + REP_VERB[d.kind] + "</button>" +
      "</div>" +
      weekRow + counts + repHistoryHTML(bank, R) + "</div>";
  };

  // Everything that is not today's rep, folded away. It is a record, not a task.
  function repHistoryHTML(bank, R) {
    if (!bank.length && !(R.story || []).length && !(R.humor || []).length && !(R.review || []).length) return "";
    const row = (date, what, sub) =>
      '<div class="grow"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">' + esc(what) + "</span>" +
      (sub ? '<span class="g-s">' + esc(sub) + "</span>" : "") + "</span>" +
      '<span class="g-v">' + esc(date.slice(5)) + "</span></div>";
    return '<details class="unit" style="margin-top:16px;"><summary>' +
      '<span class="u-name">History</span><span class="pill">' +
      (bank.length + (R.story || []).length + (R.humor || []).length + (R.review || []).length) + " logged</span>" +
      '<span class="u-prog" style="width:100%;"></span></summary><div class="u-body">' +
      '<div class="glist">' +
      bank.slice(0, 10).map(e => row(e.date, e.what, e.why)).join("") +
      (R.story || []).slice(-4).reverse().map(e => row(e.date, e.seconds + "s story rep \u00b7 " + e.takes + " take" + (e.takes === 1 ? "" : "s"), e.from)).join("") +
      (R.humor || []).slice(-4).reverse().map(e => row(e.date, (e.attempts || []).filter(Boolean).length + " jokes written", e.keeper ? "kept #" + e.keeper : "none kept")).join("") +
      (R.review || []).slice(-3).reverse().map(e => row(e.date, "Monthly review", (e.notes || "").slice(0, 90))).join("") +
      "</div></div></details>";
  }

  V.treasury = function () {
    const t = S.treasury;
    const total = revenueTotal();
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Earning Track</div><h1>Treasury</h1>' +
      '<div class="sub">≤2h/day · max 2 clients · fixed scope and price · +20% after every 2 projects.</div></div>' +
      (function () {
        const locked = D.NICHES.find(x => x.id === t.niche);
        if (locked) {
          return '<div class="card" style="border-color:var(--accent);"><div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px; flex-wrap:wrap;">' +
            '<h2>Your niche — ' + esc(locked.name) + '</h2><button class="btn ghost" data-niche="">Change niche</button></div>' +
            '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;"><strong style="color:var(--ink);">The offer:</strong> ' + esc(locked.offer) + " <span class='mono' style='color:var(--accent);'>" + esc(locked.pricing) + "</span></p>" +
            '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;"><strong style="color:var(--ink);">Why they buy:</strong> ' + esc(locked.pain) + "</p>" +
            "</div>" +
            '<div class="ghead">The first five moves</div>' +
            '<div class="glist">' +
            ["List 30 targets from Google Maps + Instagram — name, owner, number", "Record a 60-second Arabic demo of the agent answering on YOUR number", "Send 10 DMs a day for 3 days (script: Library → Earning Offers)", "Close ONE pilot at 50% price with a testimonial + referral clause", "Deliver in ≤2 weeks, publish the case study, raise the price"]
              .map((s, i) => '<div class="grow"><span class="g-lead">' + (i + 1) + "</span>" +
                '<span class="g-main"><span class="g-t">' + esc(s) + "</span></span></div>").join("") +
            "</div>";
        }
        // Six cards, each with a name, a market line, a verdict and its own
        // button, for a choice made once and then locked for at least ten
        // pitches. The recommended one is the page; the other five are a fold.
        const pick = D.NICHES.find(n => n.pick) || D.NICHES[0];
        const rest = D.NICHES.filter(n => n !== pick);
        const nicheRow = n => '<div class="grow"><span class="g-lead"></span>' +
          '<span class="g-main"><span class="g-t">' + esc(n.name) + "</span>" +
          '<span class="g-s">' + esc(n.market) + " · " + esc(n.pricing) + " — " + esc(n.verdict) + "</span></span>" +
          '<button class="btn tiny" data-niche="' + n.id + '">Lock</button></div>';
        return '<div class="card one">' +
          '<div class="one-kind">' + esc(pick.name) + ' <span class="one-more">recommended</span></div>' +
          '<p class="one-hint">' + esc(pick.market) + " · " + esc(pick.pricing) + " — " + esc(pick.verdict) + "</p>" +
          '<button class="btn lg one-go" data-niche="' + pick.id + '">Lock this niche</button></div>' +
          '<p class="note">One industry, one buyer, one offer. Generalists chase; specialists get referred. Stay locked for at least 10 pitches before judging it.</p>' +
          '<details class="unit"><summary><span class="u-name">The other five</span>' +
          '<span class="pill">' + rest.length + "</span>" +
          '<span class="u-prog" style="width:0%;"></span></summary><div class="u-body">' +
          '<div class="glist">' + rest.map(nicheRow).join("") + "</div></div></details>";
      })() +

      // Three cards for three numbers, in the row this app uses for numbers.
      (function () {
        // An empty ledger says so in words a few lines down; a 0 here would be
        // the third place on this page saying the same nothing.
        const cells = [
          total > 0 ? "<div><b>" + Math.round(total) + "</b><span>BHD collected</span></div>" : "",
          "<div><b>" + t.clients.length + " / 2</b><span>Clients</span></div>",
          t.entries.length ? "<div><b>" + t.entries.length + "</b><span>Entries</span></div>" : "",
        ].filter(Boolean);
        return cells.length > 1 ? '<div class="onecounts">' + cells.join("") + "</div>" : "";
      })() +
      '<div class="card"><h2>The one offer</h2><textarea id="trOffer" placeholder="Write your single productized offer here — niche, deliverable, days, fixed BHD price. See Library → Earning Offers for the three drafts.">' + esc(t.offer) + '</textarea>' +
      '<div style="margin-top:10px;"><button class="btn ghost" data-act="saveOffer">Save offer</button></div></div>' +
      '<div class="grid cols-2">' +
      '<div class="card"><h2>Clients</h2>' +
      (t.clients.length ? '<div class="table-wrap"><table><thead><tr><th>Client</th><th>Project</th><th>Price</th><th></th></tr></thead><tbody>' +
        t.clients.map((c, i) => "<tr><td>" + esc(c.name) + "</td><td>" + esc(c.project) + "</td><td>" + fmtBHD(+c.price || 0) + '</td><td><button class="btn danger tiny" data-delclient="' + i + '" aria-label="Remove client">×</button></td></tr>').join("") + "</tbody></table></div>" : '<p style="color:var(--ink-3); font-size:var(--fs-small);">No clients yet — send the 10 messages.</p>') +
      '<div class="grid cols-3" style="margin-top:12px; gap:8px;">' +
      '<div><label class="field" for="clName">Client</label><input type="text" id="clName" placeholder="Name"></div>' +
      '<div><label class="field" for="clProject">Project</label><input type="text" id="clProject" placeholder="Scope"></div>' +
      '<div><label class="field" for="clPrice">Price</label><input type="number" id="clPrice" placeholder="BHD"></div></div>' +
      '<div style="margin-top:8px;"><button class="btn" data-act="addClient">Add client</button></div></div>' +
      '<div class="card"><h2>Revenue ledger</h2>' +
      (t.entries.length ? '<div class="table-wrap"><table><thead><tr><th>Date</th><th>Amount</th><th>Note</th></tr></thead><tbody>' +
        t.entries.slice().reverse().map(e => "<tr><td>" + e.date + "</td><td><strong style='color:var(--accent);'>" + fmtBHD(+e.amount) + "</strong></td><td>" + esc(e.note || "") + "</td></tr>").join("") + "</tbody></table></div>" : '<p style="color:var(--ink-3); font-size:var(--fs-small);">Empty ledger. It will not stay empty.</p>') +
      '<div class="grid cols-2" style="margin-top:12px; gap:8px;">' +
      '<div><label class="field" for="enAmount">Amount</label><input type="number" id="enAmount" placeholder="BHD" step="0.01"></div>' +
      '<div><label class="field" for="enNote">Note</label><input type="text" id="enNote" placeholder="Client / deliverable"></div></div>' +
      '<div style="margin-top:8px;"><button class="btn" data-act="addEntry">Record payment</button></div></div>' +
      "</div></div>";
  };

  V.workshop = function () {
    const labsDone = D.LABS.filter(l => (S.labs[l.id] || {}).done).length;
    const psetTotal = D.PSETS.reduce((a, g) => a + g.items.length, 0);
    const psetDone = D.PSETS.reduce((a, g) => a + g.items.filter(i => S.psets[i.id]).length, 0);
    const pool = missPool();
    const phase = currentPhase();
    const PHASE_NAME = ["Phase 0 — Calibration", "Phase 1 — Foundations", "Phase 2 — Depth", "Phase 3 — Frontier"];

    // A lab, as a row. The proof-URL field appears once the lab is ticked —
    // which is the only moment it can be filled in. Rendering all seventeen
    // unconditionally put twenty text inputs on a page where at most one of
    // them was ever going to be typed into, and made Phase 3 — three years out
    // — as heavy on screen as the lab that is due this week.
    const lab = (l, last) => {
      const st = S.labs[l.id] || { done: false, proof: "" };
      return '<div style="padding:12px 0;' + (last ? "" : " border-bottom:1px solid var(--line);") + '">' +
        '<label class="check-row" style="padding:0;"><input type="checkbox" data-lab="' + l.id + '" ' + (st.done ? "checked" : "") + '><span class="checkbox">' + CHECK_SVG + "</span>" +
        '<span class="check-label" style="flex:1;"><strong style="color:var(--ink);">' + esc(l.title) + '</strong> <span class="mono" style="font-size:var(--fs-tiny); color:var(--ink-3);">~' + l.hours + "h</span><br>" + esc(l.req) + "</span></label>" +
        (st.done
          ? '<input type="text" data-proof="' + l.id + '" placeholder="Proof URL — repo, post, or screenshot" value="' + esc(st.proof || "") + '" style="margin-top:8px;">' +
            (st.proof ? "" : '<div class="note" style="margin-top:4px;">Law 6: no proof URL, no credit.</div>')
          : "") +
        "</div>";
    };
    const labsIn = ph => D.LABS.filter(l => l.phase === ph);
    const phaseCard = ph => {
      const ls = labsIn(ph);
      if (!ls.length) return "";
      return '<div class="card" style="margin-top:16px;"><h2>' + PHASE_NAME[ph] + "</h2>" +
        ls.map((l, i) => lab(l, i === ls.length - 1)).join("") + "</div>";
    };
    const later = [0, 1, 2, 3].filter(ph => ph !== phase && labsIn(ph).length);
    const laterCount = later.reduce((a, ph) => a + labsIn(ph).length, 0);

    return '<div class="view-enter"><div class="page-head"><div class="kicker">The forge</div><h1>Problems</h1>' +
      '<div class="sub">Build something, work problem sets, or drill the questions you personally got wrong.</div></div>' +

      // The drill is the daily thing on this page — the labs are the month's and
      // the problem sets are the term's. It goes first and it is the only card
      // with a button.
      '<div class="card one' + (pool.length ? " urgent" : " one-clear") + '">' +
      '<div class="one-kind">Daily drill' +
      (pool.length ? ' <span class="one-more">' + pool.length + " in the pool</span>" : "") + "</div>" +
      '<p class="one-hint">' +
      (pool.length
        ? pool.length + " questions you have personally missed are waiting. Answer one correctly and it leaves the pool."
        : "The pool is clear — the drill draws random questions to keep the blade sharp.") +
      "</p>" +
      '<a class="btn lg one-go" href="#/drill">' + (pool.length ? "Begin drill" : "Random drill") + " ▸</a></div>" +

      '<div class="onecounts">' +
      // "Recall due 0" is an absence; the Recall page says so in words.
      (reviewsDue().length ? '<a href="#/recall"><b>' + reviewsDue().length + "</b><span>Recall due</span></a>" : "") +
      "<div><b>" + labsDone + " / " + D.LABS.length + "</b><span>Labs shipped</span></div>" +
      "<div><b>" + psetDone + " / " + psetTotal + "</b><span>Problem sets</span></div>" +
      "</div>" +

      // The phase you are in, at weight. Phase 3 is three years away.
      phaseCard(phase) +

      (later.length
        ? '<details class="unit"><summary><span class="u-name">Labs in the other phases</span>' +
          '<span class="pill">' + laterCount + "</span>" +
          '<span class="u-prog" style="width:100%;"></span></summary><div class="u-body">' +
          later.map(phaseCard).join("") + "</div></details>"
        : "") +

      // Pen and paper, on a schedule of their own — you go to these, they do not
      // come to you.
      '<details class="unit"><summary><span class="u-name">Problem sets — pen and paper</span>' +
      '<span class="pill' + (psetDone === psetTotal ? " good" : "") + '">' + psetDone + " / " + psetTotal + "</span>" +
      '<span class="u-prog" style="width:' + (psetTotal ? (psetDone / psetTotal) * 100 : 0) + '%;"></span></summary>' +
      '<div class="u-body"><div class="grid cols-2">' +
      D.PSETS.map(g =>
        '<div class="card"><div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;"><h3>' + esc(g.title) + '</h3><a class="btn ghost tiny" style="flex-shrink:0;" href="' + g.url + '" target="_blank" rel="noopener">Open ↗</a></div>' +
        g.items.map(i =>
          '<label class="check-row"><input type="checkbox" data-pset="' + i.id + '" ' + (S.psets[i.id] ? "checked" : "") + '><span class="checkbox">' + CHECK_SVG + '</span><span class="check-label">' + esc(i.label) + "</span></label>"
        ).join("") + "</div>"
      ).join("") + "</div></div></details>" +
      "</div>";
  };

  V.drill = function () {
    setTimeout(() => {
      let pool = missPool().filter(p => questionUnlocked(p.bankId, D.QUIZZES[p.bankId].questions[p.idx]))
        .sort(() => Math.random() - 0.5).slice(0, 10);
      if (pool.length < 5) {
        // Pad only from material already taught — never from a course you have
        // not opened. That was the bug that served SVD questions on day one.
        const have = new Set(pool.map(p => p.bankId + "|" + p.idx));
        const all = Object.keys(D.QUIZZES).flatMap(b => unlockedIdx(b).map(i => ({ bankId: b, idx: i })));
        all.sort(() => Math.random() - 0.5);
        for (const p of all) {
          if (pool.length >= 10) break;
          const k = p.bankId + "|" + p.idx;
          if (!have.has(k)) { have.add(k); pool.push(p); }
        }
      }
      if (!pool.length) {
        $("#drillMount").innerHTML = '<div class="card"><h2>Nothing to drill yet</h2>' +
          '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;">The drill only serves lectures you have already watched. Watch one, then come back.</p>' +
          '<div style="margin-top:12px;"><a class="btn" href="#/">Today\u2019s plan</a></div></div>';
        return;
      }
      const map = pool; // position in the synthetic bank -> {bankId, idx}
      const bank = {
        title: "Daily Drill", course: "Workshop", perSitting: pool.length,
        questions: pool.map(p => D.QUIZZES[p.bankId].questions[p.idx]),
      };
      DAR.Quiz.mount($("#drillMount"), bank, {
        onFinish(res) {
          const byBank = {};
          res.missed.forEach(j => { const p = map[j]; (byBank[p.bankId] = byBank[p.bankId] || { m: [], c: [] }).m.push(p.idx); });
          res.correct.forEach(j => { const p = map[j]; (byBank[p.bankId] = byBank[p.bankId] || { m: [], c: [] }).c.push(p.idx); });
          Object.keys(byBank).forEach(b => updateMisses(b, byBank[b].m, byBank[b].c));
          toast("Drill sealed — " + res.pct + "%." + (res.missed.length ? " The misses stay in the pool." : " The pool shrinks."));
        },
        onExit() { location.hash = "#/workshop"; },
      });
    }, 0);
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Workshop</div><h1>Daily Drill</h1>' +
      '<div class="sub">Drawn from questions you have personally missed, across every examination bank. Wrong answers stay in the pool; right answers leave it.</div></div><div id="drillMount"></div></div>';
  };

  V.electives = function () {
    const phases = { 0: "Phase 0", 1: "Phase 1", 2: "Phase 2", 3: "Phase 3" };
    const now = currentPhase();
    // Current phase and the next one. Filtering to the current phase alone left
    // this page completely empty for the first six months — every elective is
    // tagged Phase 1 or later — and a reference list you plan from has to have
    // something on it before you arrive.
    const fits = e => e.phase == null || e.phase <= now + 1;
    const head = '<thead><tr><th>Provider</th><th>Course</th><th>Fits</th><th>Cost</th><th>Brickford verdict</th><th></th><th>Status</th></tr></thead>';
    const body = list => "<tbody>" + list.map(e => {
      const st = S.electives[e.id];
      return "<tr><td style='white-space:nowrap;'>" + esc(e.provider) + "</td><td><strong style='color:var(--ink);'>" + esc(e.what) + "</strong></td>" +
        "<td style='white-space:nowrap;'>" + (phases[e.phase] || "Any") + "</td><td>" + esc(e.cost) + "</td><td>" + esc(e.verdict) + "</td>" +
        '<td><a class="btn ghost tiny" href="' + e.url + '" target="_blank" rel="noopener" aria-label="Open source">↗</a></td>' +
        '<td><button class="btn ghost tiny bare" data-elective="' + e.id + '" aria-label="Cycle status">' +
        (st === "done" ? '<span class="pill good">done</span>' : st === "planned" ? '<span class="pill teal">planned</span>' : '<span class="pill">—</span>') +
        "</button></td></tr>";
    }).join("") + "</tbody>";

    const open = D.ELECTIVES.filter(fits);
    const later = D.ELECTIVES.filter(e => !fits(e));

    // The whole catalogue in one table stacks into fourteen labelled blocks on a
    // phone — 6356px of courses most of which do not fit the phase you are in.
    // The ones that fit now are the table; the rest wait where they belong.
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The outside world</div><h1>Outside Courses</h1>' +
      '<div class="sub">Audit free. Pay only when a credential opens a door. Tap a status to cycle.</div></div>' +
      (open.length
        ? '<div class="card"><div class="table-wrap"><table>' + head + body(open) + "</table></div></div>"
        : '<p class="note">Nothing lines up with Phase ' + now + " yet.</p>") +
      (later.length
        ? '<details class="unit"><summary><span class="u-name">Further out</span>' +
          '<span class="pill">' + later.length + "</span>" +
          '<span class="u-prog" style="width:0%;"></span></summary><div class="u-body">' +
          '<div class="table-wrap"><table>' + head + body(later) + "</table></div></div></details>"
        : "") +
      "</div>";
  };

  V.guide = function () {
    // Eleven steps across three loops, each with its own little "go" button, is
    // eleven buttons on a page you read rather than operate. The row is the link
    // where there is somewhere to go, and plain text where there is not — the
    // same rule the day list, the library and the exam list already follow.
    const row = (n, title, body, href) => {
      // The chevron comes from a.grow::after, so a row that goes nowhere does
      // not grow one — a control's look has to predict what it does.
      const inner = '<span class="g-lead">' + n + "</span>" +
        '<span class="g-main"><span class="g-t">' + title + "</span>" +
        '<span class="g-s">' + body + "</span></span>";
      return href ? '<a class="grow" href="' + href + '">' + inner + "</a>"
                  : '<div class="grow">' + inner + "</div>";
    };
    const law = (n, title, body) =>
      '<div class="grow"><span class="g-lead">' + n + "</span>" +
      '<span class="g-main"><span class="g-t">' + title + "</span>" +
      '<span class="g-s">' + body + "</span></span></div>";
    // A room is a row, not a card. Nine cards with a title, a pill and a blurb
    // came to 14 cards on a page whose job is to be read once and referred to.
    const mod = (name, when, what, href) =>
      '<a class="grow" href="' + href + '"><span class="g-lead"></span>' +
      '<span class="g-main"><span class="g-t">' + name + "</span>" +
      '<span class="g-s">' + what + "</span></span>" +
      '<span class="g-v">' + when + "</span></a>";

    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Handbook</div><h1>How to run Brickford</h1>' +
      '<div class="sub">Three loops, seven laws, one map. It works only if you run it.</div></div>' +

      // REST_DOW is the source of truth for the week, and this page used to say
      // "7 days" — the one number the whole schedule is built to contradict.
      // Six days is not a concession here, it is the design: seven was not
      // survivable, and a plan nobody keeps teaches nothing.
      '<div class="card one"><div class="one-kind">The daily loop' +
      ' <span class="one-more">4\u20135h</span></div>' +
      '<p class="one-hint">Six days a week — ' + REST_NAME + " is off, and taking it is following the plan, not breaking it. Same order every day.</p>" +
      '<a class="btn lg one-go" href="#/">Open Today \u25b8</a></div>' +
      '<div class="ghead">In this order<span class="gh-meta">6 steps</span></div>' +
      '<div class="glist">' +
      row("1", "Open Today", "the day’s lectures, plus anything owed from earlier days", "#/") +
      row("2", "Theory · ~2h", "the math rotation — Linear Algebra → Calculus → Probability", null) +
      row("3", "Build · ~1.5h", "today’s spine lecture + the two named NeetCode problems", "#/course/cs150") +
      row("4", "Drill · ~10 min", "the questions you missed, served back until they stick", "#/drill") +
      row("5", "Publish · ~30 min", "the day’s rep — one real thing, two lines", "#/practice") +
      row("6", "Seal the day", "the streak counts pressed days", "#/") +
      "</div>" +

      // The daily loop is what you need when you open this page. The weekly and
      // monthly ones are things you look up on a Sunday or a gate day, so they
      // go one level deeper rather than sitting between you and them.
      '<details class="unit"><summary><span class="u-name">The weekly and monthly loops</span>' +
      '<span class="pill">2</span><span class="u-prog" style="width:100%;"></span></summary>' +
      '<div class="u-body">' +

      '<div class="ghead">The weekly loop<span class="gh-meta">Sunday · 30 min</span></div>' +
      '<div class="glist">' +
      row("1", "Week", "what shipped, DSA, posts, revenue. No artifact = a failed week", "#/review") +
      row("2", "Sit one examination", "one concept exam \u00b7 \u226585% is Mastered \u00b7 40% of course mastery", "#/exams") +
      row("3", "Export a backup", "sidebar \u2192 Backup. This browser is the only copy", null) +
      "</div>" +

      '<div class="ghead">The monthly loop<span class="gh-meta">gate day</span></div>' +
      '<div class="glist">' +
      row("1", "Transcript & gates", "pass a gate the day it is true \u2014 every later target moves earlier", "#/transcript") +
      row("2", "Lab audit", "every done lab needs a proof URL \u2014 the list is your CV", "#/workshop") +
      "</div>" +

      "</div></details>" +

      // The laws are read once and remembered, and the map is a thing you look
      // up. Neither is a thing you scroll past every time you open the Handbook.
      '<details class="unit"><summary><span class="u-name">The seven laws</span>' +
      '<span class="pill">7</span><span class="u-prog" style="width:100%;"></span></summary>' +
      '<div class="u-body"><div class="glist">' +
      law(1, "Never just watch", "Close the video, rebuild from memory, compare.") +
      law(2, "The gates are honest or they are nothing", "You grade yourself. Cheat and you cheat only yourself.") +
      law(3, "Ship every week", "A repo, a post, or a delivery. Or the week is failed.") +
      law(4, "The drill is daily", "Ten minutes. The miss pool maps what you don’t know.") +
      law(5, "One niche, capped hours", "≤2h/day, max 2 clients, one niche. It funds the mission.") +
      law(6, "Proof or it didn’t happen", "No proof URL, no credit. Links are the only currency.") +
      law(7, "Back up weekly", "Export every Sunday. Restore anywhere.") +
      "</div></div></details>" +

      // This list named four rooms that no longer exist under those names —
      // Workshop, Exam Hall, Transcript & Gates and Weekly Review were renamed
      // to Problems, Exams, Proof and Week — and omitted the Atlas, Practice
      // and the Calendar entirely. Every entry below matches a nav label.
      '<details class="unit"><summary><span class="u-name">The map</span>' +
      '<span class="pill">11 rooms</span><span class="u-prog" style="width:100%;"></span></summary>' +
      '<div class="u-body"><div class="glist">' +
      mod("Dashboard", "daily", "The next lecture, the rest of today, and where you stand.", "#/") +
      mod("The Atlas", "weekly", "What is running now, the gates ahead, and what opens later.", "#/atlas") +
      mod("Courses", "reference", "Every course, in four phases. Follow the plan’s pick — the sequencing is the curriculum.", "#/courses") +
      mod("Problems", "daily", "Labs with proof URLs, pen-and-paper problem sets, and the daily drill.", "#/workshop") +
      mod("Exams", "weekly", "The official MIT/Harvard diagnostics, plus the auto-graded concept banks.", "#/exams") +
      mod("Proof", "monthly", "The hash-chained record of everything done, the streak, and the export.", "#/record") +
      mod("Practice", "daily", "The speaking reps — story bank, story rep, humour rep, monthly review.", "#/practice") +
      mod("Week", "Sunday", "The sealing ritual. Feeds every chart and every number.", "#/review") +
      mod("Calendar", "reference", "Every day of the three years, and what belongs to each.", "#/calendar") +
      mod("Treasury", "selling", "The locked niche, the one offer, clients (max 2), and the revenue ledger.", "#/treasury") +
      mod("Library", "reference", "The founding documents and the outside courses.", "#/library") +
      "</div></div></details>" +

      '<div class="card" style="margin-top:16px;"><h2>Right now — Phase 0, weeks 1–2</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">Four things, then Phase 1 opens: three math diagnostics (≥70%), the coding diagnostic, GitHub/blog/X, and the Treasury’s first five moves.</p>' +
      '<div style="margin-top:12px;"><a class="btn" href="#/exams">Sit the diagnostics</a></div></div>' +
      "</div>";
  };

  const DOCS = [
    { id: "readme", file: "../README.md", title: "Phase 0 — Calibration Kit", sub: "The Week 1–2 checklist: exams, diagnostics, setup" },
    { id: "curriculum", file: "../phase-1-curriculum.md", title: "Phase 1 — Curriculum (Months 1–6)", sub: "Week-by-week plan + adjustment rules" },
    { id: "coding", file: "../coding-diagnostic.md", title: "Coding Diagnostic", sub: "The no-AI flashcards build + NeetCode 10" },
    { id: "offers", file: "../earning-offers.md", title: "Earning Offers", sub: "Three productized offers, Arabic pitch included" },
    { id: "log", file: "../progress-log.md", title: "Progress Log (file)", sub: "The original markdown log — the Week page supersedes it" },
  ];
  // The Library is a list of things to open. It was rendering five one-line
  // documents as five ~150px hero cards in a 2-col grid, with two more
  // documents stranded as buttons in the page head - and then ten external
  // links as a ragged pile of pills of ten different widths.
  //
  // apple-design 16, grouping and mapping: "proximity implies relationship."
  // A pile in one row says these ten things are alike; they are not. So the
  // documents become one compact list and the external links are grouped by
  // what they actually are.
  const HALLS = [
    ["Video courses", [
      ["Karpathy \u2014 Zero to Hero", "https://karpathy.ai/zero-to-hero.html"],
      ["3Blue1Brown", "https://www.3blue1brown.com/"],
      ["fast.ai", "https://course.fast.ai/"],
      ["ARENA curriculum", "https://www.arena.education/"],
    ]],
    ["Books", [
      ["Mathematics for ML", "https://mml-book.github.io/"],
      ["Understanding Deep Learning", "https://udlbook.github.io/udlbook/"],
    ]],
    ["Problems & lectures", [
      ["NeetCode", "https://neetcode.io/roadmap"],
      ["MIT OpenCourseWare", "https://ocw.mit.edu/"],
      ["Stat 110", "https://stat110.hsites.harvard.edu/"],
    ]],
    ["Source", [
      ["nanoGPT", "https://github.com/karpathy/nanoGPT"],
    ]],
  ];
  V.library = function () {
    // The handbook and How it works are documents too - they were in the page
    // head only because they are not in DOCS. They belong in the list.
    const rows = [{ href: "#/guide", title: "The Handbook", sub: "How Brickford works, end to end" },
                  { href: "#/method", title: "The Method", sub: "Why it is built this way \u2014 coverage vs. mastery" }]
      .concat(DOCS.map(d => ({ href: "#/doc/" + d.id, title: d.title, sub: d.sub })));
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Knowledge base</div><h1>Library</h1>' +
      '<div class="sub">Everything written down: the founding documents, and the outside resources the courses draw on.</div></div>' +

      '<div class="ghead">Documents<span class="gh-meta">' + rows.length + " to read</span></div>" +
      '<div class="glist">' +
      rows.map(r => '<a class="grow" href="' + r.href + '">' +
        '<span class="g-lead"></span>' +
        '<span class="g-main"><span class="g-t">' + esc(r.title) + "</span>" +
        '<span class="g-s">' + esc(r.sub) + "</span></span></a>").join("") +
      "</div>" +

      // Ten outside links used to sit here as ten ghost buttons in four
      // labelled strips — a chip rail, which is a shape this app uses nowhere
      // else. They are rows in groups like everything else now, and the whole
      // block folds, because you come to the Library for its own documents and
      // leave for someone else's about twice a term.
      '<details class="unit" style="margin-top:16px;"><summary>' +
      '<span class="u-name">External halls</span><span class="pill">' +
      HALLS.reduce((a, h) => a + h[1].length, 0) + " links</span>" +
      '<span class="u-prog" style="width:0%;"></span></summary><div class="u-body">' +
      HALLS.map(([label, links]) =>
        '<div class="ghead">' + esc(label) + "</div>" +
        '<div class="glist">' + links.map(r =>
          '<a class="grow" href="' + r[1] + '" target="_blank" rel="noopener">' +
          '<span class="g-lead">\u2197</span>' +
          '<span class="g-main"><span class="g-t">' + esc(r[0]) + "</span>" +
          '<span class="g-s">' + esc(r[1].replace(/^https?:\/\//, "").replace(/\/.*$/, "")) + "</span></span></a>").join("") +
        "</div>").join("") +
      "</div></details>" +
      "</div>";
  };


  // Not a fallback to Today: an answer. Says what was asked for, and offers the
  // two places worth going from a dead link.
  V.notFound = function (r) {
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Not found</div>' +
      "<h1>There is no page here</h1>" +
      '<div class="sub">Nothing in Brickford answers to <code>#' + esc(r) + "</code>. It may have been renamed, or the link may be old.</div></div>" +
      '<div class="card one"><div class="one-kind">Back to today</div>' +
      '<p class="one-hint">The day\u2019s lectures, and the next one to open.</p>' +
      '<a class="btn lg one-go" href="#/">Open Today \u25b8</a></div>' +
      '<div class="row-actions"><a class="btn ghost" href="#/atlas">The Atlas</a>' +
      '<a class="btn ghost" href="#/guide">Handbook</a></div></div>';
  };

  V.doc = function (id) {
    const d = DOCS.find(x => x.id === id);
    if (!d) return "<p>Unknown document.</p>";
    setTimeout(async () => {
      const host = $("#docHost");
      try {
        const res = await fetch(d.file);
        if (!res.ok) throw new Error(res.status);
        host.innerHTML = md(await res.text());
      } catch (e) {
        host.innerHTML = '<p style="color:var(--bad);">Could not load ' + esc(d.file) + " — make sure you launched via Brickford.bat (the server must serve the career-path folder).</p>";
      }
    }, 0);
    return '<div class="view-enter"><div class="page-head"><div class="kicker"><a href="#/library">Library</a></div><h1>' + esc(d.title) + '</h1></div><div class="card prose" id="docHost">Loading…</div></div>';
  };

  // ---------- actions ----------
  function wire(root, route) {
    // generic data-act buttons
    $$("[data-act]", root).forEach(b => {
      b.onclick = () => {
        const act = b.dataset.act;
        if (act === "studied") {
          // Guard the action, not just the button. Hiding the control is the UI;
          // refusing the write is what keeps the ledger true if it is ever
          // reachable another way.
          if (isRestDay(todayISO()) && todayISO() >= D.START_DATE) {
            toast(REST_NAME + " is a rest day — nothing to mark.");
            return;
          }
          if (!S.studyDays.includes(todayISO())) { S.studyDays.push(todayISO()); logEvent("day", todayISO(), {}); }
          save(); render();
          toast("Counted. The chain grows.");
        } else if (act === "syncShowTok" || act === "syncHideTok") {
          const box = $("#tokBox");
          if (box) box.hidden = act === "syncHideTok";
        } else if (act === "syncCopyTok") {
          const el = $("#tokOut");
          if (!el) return;
          el.select();
          // navigator.clipboard needs a secure context and is absent in some
          // in-app browsers; execCommand still works where it is not.
          const done = () => toast("Copied. Paste it on the other device and press Connect.");
          if (navigator.clipboard && navigator.clipboard.writeText)
            navigator.clipboard.writeText(el.value).then(done, () => { document.execCommand("copy"); done(); });
          else { document.execCommand("copy"); done(); }
        } else if (act === "repBank" || act === "repStory" || act === "repHumor" || act === "repReview") {
          // Guard the write, not just the control: a rep must carry a payload or
          // it does not exist. This is the same discipline as verified-vs-done on
          // a lecture, and it is the only reason the rest of the record is worth
          // anything - a "mark as done" with nothing behind it is a lie you told
          // yourself in a form you will later read as evidence.
          const iso = todayISO();
          if (isRestDay(iso) && iso >= D.START_DATE) {
            toast(REST_NAME + " is a rest day \u2014 nothing owed.");
            return;
          }
          const val = id => { const el = $("#" + id); return el ? el.value.trim() : ""; };
          if (act === "repBank") {
            const what = val("bankWhat");
            if (!what) { toast("Write what happened first \u2014 an empty entry is not an entry."); return; }
            S.reps.bank.push({ date: iso, what: what, why: val("bankWhy") });
            logEvent("rep", "bank", { date: iso });
            toast("Logged. The bank is the input to every other rep.");
          } else if (act === "repStory") {
            const secs = +val("repSecs") || 0;
            if (!secs) { toast("How long was it? The 90-second cap is the teacher."); return; }
            S.reps.story.push({ date: iso, seconds: secs, takes: +val("repTakes") || 1, from: val("repWhich") });
            logEvent("rep", "story", { date: iso, seconds: secs });
            toast(secs <= 90 ? "Logged, and inside 90s." : "Logged \u2014 " + secs + "s. The cap is 90.");
          } else if (act === "repHumor") {
            const attempts = [0, 1, 2, 3, 4].map(i => val("joke" + i));
            const n = attempts.filter(Boolean).length;
            if (n < 5) { toast("Five attempts, not " + n + ". Volume is the mechanic."); return; }
            const k = +val("jokeKeep") || 0;
            S.reps.humor.push({ date: iso, attempts: attempts, keeper: k >= 1 && k <= 5 ? k : 0 });
            logEvent("rep", "humor", { date: iso, keeper: k });
            toast(k ? "Logged, one keeper." : "Logged. No keeper this week \u2014 that is a normal week.");
          } else {
            const notes = val("revNotes");
            if (!notes) { toast("A review with no writing is a rewatch."); return; }
            S.reps.review.push({ date: iso, notes: notes });
            logEvent("rep", "review", { date: iso });
            toast("Review logged.");
          }
          save(); render();
        } else if (act === "resetStreak") {
          // Deliberately the smallest possible reset: it moves the line the
          // counter starts from and touches nothing else. Deleting the sealed
          // days would take the heatmap, the day count and the calendar with
          // them, and none of that stopped being true.
          const was = streak();
          if (!confirm("Reset the streak to zero?\n\nThe counter starts again from today. Every sealed day stays in the record — the heatmap, the day count and the chain are untouched.")) return;
          S.settings.streakFrom = todayISO();
          logEvent("streak", todayISO(), { was: was, best: bestStreak() });
          save(); render();
          toast("Streak reset. It starts again when you seal a day.");
        } else if (act === "revealFig" || act === "hideFig") {
          const st = conceptState(b.dataset.cid);
          st.revealed = act === "revealFig";
          save(); render();
        } else if (act === "sketchClear") {
          const cv = $("#sketchPad");
          if (cv) { const g = cv.getContext("2d"); g.clearRect(0, 0, cv.width, cv.height); sketchDirty = false; }
        } else if (act === "sketchSave") {
          const cv = $("#sketchPad"), id = b.dataset.cid;
          if (!cv) return;
          // Downscale hard: storage is a few megabytes total and sketches are
          // the only thing here that could ever fill it.
          const small = document.createElement("canvas");
          small.width = 320; small.height = 180;
          small.getContext("2d").drawImage(cv, 0, 0, 320, 180);
          const png = small.toDataURL("image/png");
          const st = conceptState(id);
          st.sketches = (st.sketches || []).concat([{ date: todayISO(), png: png }]).slice(-2);
          try { save(); } catch (e) {
            st.sketches = st.sketches.slice(-1);
            try { save(); toast("Storage is tight — keeping only the newest sketch."); }
            catch (e2) { st.sketches = []; save(); toast("Out of storage. Export a backup, then clear old sketches."); return; }
          }
          render(); toast("Sketch saved. Now reveal and compare.");
        } else if (act === "startSummaryCheck") {
          const sm = (D.SUMMARIES || {})[b.dataset.k];
          const mount = $("#sumCheck");
          if (!sm || !mount || !window.DAR.Quiz) return;
          DAR.Quiz.mount(mount, { title: "Summary check", course: "Review", perSitting: sm.checks.length, questions: sm.checks }, {
            onFinish(res) { logEvent("summary-check", b.dataset.k, { pct: res.pct }); save(); },
            onExit() { render(); },
          });
        } else if (act === "startProbe") {
          const c = conceptById(b.dataset.cid);
          const mount = $("#probeMount");
          if (!c || !mount || !window.DAR.Quiz) return;
          const st = conceptState(c.id);
          st.attempts = (st.attempts || 0) + 1; save();
          DAR.Quiz.mount(mount, { title: c.title, course: (D.COURSES.find(x => x.id === c.course) || {}).code || "", perSitting: c.probes.length, questions: c.probes }, {
            onFinish(res) {
              const s2 = conceptState(c.id);
              if (res.pct === 100) {
                const already = s2.proven;
                s2.proven = true; s2.provenAt = todayISO();
                if (!already) { scheduleReview(cKey(c.id), 0); logEvent("concept", c.id, { proven: true }); }
                save();
                toast(already ? "Still solid." : "Proven — first recall in " + BOXES[0] + " days.");
              } else {
                logEvent("probe", c.id, { pct: res.pct });
                save();
                toast(res.pct + "% — read the misses, then sit it again.");
              }
            },
            onExit() { render(); },
          });
        } else if (act === "syncConnect") {
          const v = $("#ghTok") ? $("#ghTok").value.trim() : "";
          if (!v) { toast("Paste the token first."); return; }
          try { localStorage.setItem("brickford_gh_token", v); } catch (e) { toast("Could not store the token."); return; }
          render(); toast("Connected. Pull to bring this device up to date.");
        } else if (act === "syncForget") {
          try { localStorage.removeItem("brickford_gh_token"); } catch (e) {}
          render(); toast("Token forgotten.");
        } else if (act === "syncPull" || act === "syncPush") {
          runSync(act === "syncPull" ? "pull" : "push", t => { const m = $("#syncMsg"); if (m) m.innerHTML = t; });
        } else if (act === "toggleAdv") {
          // The rare tools live in a box the page already rendered; the row just
          // reveals it. No re-render, so the scroll position does not move under
          // the thumb (apple-design 1: nothing on the input path that is not
          // essential).
          const box = $("#advBox");
          if (box) { box.hidden = !box.hidden; if (!box.hidden) box.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
        } else if (act === "copyHead") {
          const h = chainHead();
          if (navigator.clipboard) navigator.clipboard.writeText(h).then(() => toast("Head hash copied."), () => toast(h));
          else toast(h);
        } else if (act === "exportRecord") {
          const blob = new Blob([JSON.stringify(recordBundle(), null, 2)], { type: "application/json" });
          const a2 = document.createElement("a");
          a2.href = URL.createObjectURL(blob);
          a2.download = "brickford-record-" + todayISO() + ".json";
          a2.click(); URL.revokeObjectURL(a2.href);
          toast("Record exported — " + S.ledger.length + " entries.");
        } else if (act === "addAnchor") {
          const where = ($("#anWhere") && $("#anWhere").value.trim()) || "";
          const url = ($("#anUrl") && $("#anUrl").value.trim()) || "";
          if (!where && !url) { toast("Say where you published it."); return; }
          if (!S.ledger.length) { toast("Nothing to anchor yet."); return; }
          S.anchors.push({ date: todayISO(), head: chainHead(), where: where, url: url });
          save(); render(); toast("Anchored. Its public timestamp now backs this record.");
        } else if (act === "pickRecord") {
          if ($("#recFile")) $("#recFile").click();
        } else if (act === "backup") {
          exportBackup();
        } else if (act === "toggleDone" || act === "saveNotes" || act === "saveLesson" || act === "verify" || act === "unverify") {
          const m = location.hash.match(/#\/lesson\/([^/]+)\/(\d+)\/(\d+)/);
          if (!m) return;
          const k = lessonKey(m[1], +m[2], +m[3]);
          const st = S.lessons[k] || { done: false, notes: "", checks: [] };
          // always carry the open editors into state so nothing is lost
          if ($("#lessonNotes")) st.notes = $("#lessonNotes").value;
          if ($("#lessonRecall")) st.recall = $("#lessonRecall").value;
          const cs = D.COURSES.find(x => x.id === m[1]);
          const ls = cs && cs.units[+m[2]] ? cs.units[+m[2]].lessons[+m[3]] : null;
          if (act === "toggleDone") {
            st.done = !st.done;
            if (st.done) st.doneAt = todayISO(); else delete st.doneAt;
          }
          if (act === "verify") {
            if (!lessonCanVerify(st, ls)) { S.lessons[k] = st; save(); render(); toast("Finish the four gates first."); return; }
            st.verified = true; st.verifiedAt = todayISO();
            if (!st.done) { st.done = true; st.doneAt = st.doneAt || todayISO(); }
            S.lessons[k] = st;
            scheduleReview(k, 0);
            logEvent("verified", k, { solved: st.solved || 0 });
            save(); render();
            toast("Proven. First recall check in " + BOXES[0] + " days.");
            return;
          }
          if (act === "unverify") {
            st.verified = false; delete st.verifiedAt; delete S.review[k];
            S.lessons[k] = st; logEvent("unverified", k, {}); save(); render();
            toast("Unverified."); return;
          }
          S.lessons[k] = st; save();
          if (act === "toggleDone") { logEvent("lesson", k, { done: st.done }); render(); toast(st.done ? "Marked watched — mastery still needs the four gates." : "Unmarked."); }
          else { render(); toast("Saved."); }
        } else if (act === "saveDiag") {
          const m = location.hash.match(/#\/diag\/(.+)/);
          const v = parseFloat($("#diagScore").value);
          if (!isFinite(v)) { toast("Enter the honest number."); return; }
          S.diag[m[1]] = { score: Math.round(v), date: todayISO() };
          logEvent("diagnostic", m[1], { score: Math.round(v) }); save(); render();
          toast(v >= 70 ? "Verified. Full speed." : "Recorded. The gap block begins — truth over comfort.");
        } else if (act === "saveDiagDone") {
          const m = location.hash.match(/#\/diag\/(.+)/);
          S.diag[m[1]] = { score: null, date: todayISO() };
          logEvent("diagnostic", m[1], { score: null }); save(); render(); toast("Diagnostic marked complete.");
        } else if (act === "logWeek") {
          const w = weekNumber();
          const entry = {
            week: w, date: todayISO(),
            shipped: $("#rvShipped").value.trim(),
            dsa: +$("#rvDsa").value || 0,
            posts: +$("#rvPosts").value || 0,
            revenue: +$("#rvRev").value || 0,
            notes: $("#rvNotes").value.trim(),
          };
          const i = S.weeks.findIndex(x => +x.week === w);
          if (i >= 0) S.weeks[i] = entry; else S.weeks.push(entry);
          logEvent("week", "week" + w, { shipped: entry.shipped, dsa: entry.dsa, posts: entry.posts, revenue: entry.revenue });
          save(); render();
          toast(entry.shipped ? "Week " + w + " sealed." : "Week " + w + " sealed — as a failed week. Next week answers it.");
        } else if (act === "saveOffer") {
          S.treasury.offer = $("#trOffer").value; save(); toast("Offer saved.");
        } else if (act === "addClient") {
          const name = $("#clName").value.trim();
          if (!name) return;
          if (S.treasury.clients.length >= 2 && !confirm("The cap is 2 clients. The cap protects the Deep Track. Add anyway?")) return;
          S.treasury.clients.push({ name, project: $("#clProject").value.trim(), price: +$("#clPrice").value || 0 });
          save(); render();
        } else if (act === "addEntry") {
          const amount = +$("#enAmount").value;
          if (!amount) return;
          S.treasury.entries.push({ date: todayISO(), amount, note: $("#enNote").value.trim() });
          save(); render(); toast(fmtBHD(amount) + " recorded.");
        } else if (act === "saveCalStart") {
          const v = $("#calStart").value.trim();
          if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) { toast("Use 24h HH:MM, e.g. 08:00."); return; }
          S.settings.dailyStart = v; save(); render();
          toast("Start time saved — links updated.");
        } else if (act === "downloadIcs") {
          const blob = new Blob([buildICS()], { type: "text/calendar" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "brickford.ics";
          a.click();
          URL.revokeObjectURL(a.href);
          toast("brickford.ics downloaded — import it into Google Calendar.");
        }
      };
    });
    // lesson ritual checks
    $$("[data-check]", root).forEach(cb => {
      cb.onchange = () => {
        const m = location.hash.match(/#\/lesson\/([^/]+)\/(\d+)\/(\d+)/);
        if (!m) return;
        const k = lessonKey(m[1], +m[2], +m[3]);
        const st = S.lessons[k] || { done: false, notes: "", checks: [] };
        st.checks[+cb.dataset.check] = cb.checked;
        // carry the open editors so a re-render cannot discard unsaved text
        if ($("#lessonNotes")) st.notes = $("#lessonNotes").value;
        if ($("#lessonRecall")) st.recall = $("#lessonRecall").value;
        S.lessons[k] = st; save(); render();
      };
    });
    // problem tracker
    $$("[data-prob]", root).forEach(cb => {
      cb.onchange = () => {
        S.problems[cb.dataset.prob] = cb.checked ? todayISO() : false; save();
        logEvent("problem", cb.dataset.prob, { solved: cb.checked });
        const c = D.COURSES.find(x => x.tracker);
        // update header count without full rerender
        const n = dsaCount();
        const strong = root.querySelector(".bar.teal + div strong");
        if (strong) strong.textContent = n + " / 150";
        const bar = root.querySelector(".bar.teal > i");
        if (bar) bar.style.transform = "scaleX(" + n / 150 + ")";
        if (n === 150) toast("One hundred and fifty. The gate number is met.");
      };
    });
    // calendar month grid
    $$("[data-cal-day]", root).forEach(c => {
      c.onclick = () => { calSel = c.dataset.calDay; render(); };
    });
    $$("[data-cal-nav]", root).forEach(b => {
      b.onclick = () => {
        const nav = b.dataset.calNav;
        if (nav === "today") { calCursor = todayISO().slice(0, 7); calSel = todayISO() > D.START_DATE ? todayISO() : D.START_DATE; }
        else {
          const [y, m] = (calCursor || todayISO().slice(0, 7)).split("-").map(Number);
          const nd = new Date(y, m - 1 + (nav === "next" ? 1 : -1), 1);
          calCursor = nd.getFullYear() + "-" + pad2(nd.getMonth() + 1);
        }
        render();
      };
    });
    // workshop labs + proof URLs + psets + electives
    $$("[data-lab]", root).forEach(cb => {
      cb.onchange = () => {
        const st = S.labs[cb.dataset.lab] || { done: false, proof: "" };
        st.done = cb.checked;
        S.labs[cb.dataset.lab] = st; save();
        logEvent("lab", cb.dataset.lab, { done: st.done });
        // The proof field only exists once the lab is ticked, so it has to be
        // put there now — the toast says "paste the proof URL below it", and
        // without this there was nothing below it to paste into. Inserted in
        // place rather than by re-rendering, so the page does not jump and the
        // cursor lands in the field the toast is talking about.
        const box = cb.closest("label") && cb.closest("label").parentElement;
        if (box) {
          const existing = box.querySelector("[data-proof]");
          if (st.done && !existing) {
            const inp = document.createElement("input");
            inp.type = "text";
            inp.setAttribute("data-proof", cb.dataset.lab);
            inp.placeholder = "Proof URL — repo, post, or screenshot";
            inp.value = st.proof || "";
            inp.style.marginTop = "8px";
            box.appendChild(inp);
            wireProof(inp);
            inp.focus();
          } else if (!st.done && existing) {
            const note = existing.nextElementSibling;
            if (note && note.classList.contains("note")) note.remove();
            existing.remove();
          }
        }
        if (cb.checked) toast("Lab shipped. Paste the proof URL below it.");
      };
    });
    $$("[data-proof]", root).forEach(wireProof);
    function wireProof(inp) {
      inp.onchange = () => {
        const st = S.labs[inp.dataset.proof] || { done: false, proof: "" };
        st.proof = inp.value.trim();
        S.labs[inp.dataset.proof] = st; save();
        toast("Proof recorded.");
      };
    }
    $$("[data-pset]", root).forEach(cb => {
      cb.onchange = () => { S.psets[cb.dataset.pset] = cb.checked; save(); };
    });
    $$("[data-niche]", root).forEach(b => {
      b.onclick = () => {
        S.treasury.niche = b.dataset.niche;
        save(); render();
        if (b.dataset.niche) toast("Niche locked. Ten pitches minimum before you judge it.");
      };
    });
    $$("[data-elective]", root).forEach(b => {
      b.onclick = () => {
        const id = b.dataset.elective;
        const cur = S.electives[id];
        if (!cur) S.electives[id] = "planned";
        else if (cur === "planned") S.electives[id] = "done";
        else delete S.electives[id];
        save(); render();
      };
    });
    // Interactive figure, if this concept has one.
    const labEl = $("#labMount", root);
    if (labEl && D.LAB && D.LAB[labEl.dataset.lab]) {
      labEl.innerHTML = "";
      D.LAB[labEl.dataset.lab].mount(labEl);
    }
    // Sketch pad: pointer drawing, restored nothing — the point is a blank page.
    if ($("#sketchPad", root)) {
      const cv = $("#sketchPad", root), g = cv.getContext("2d");
      let drawing = false;
      const themeInk = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#2b2118";
      g.lineWidth = 2.4; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = themeInk;
      const at = ev => {
        const r = cv.getBoundingClientRect();
        return [(ev.clientX - r.left) * (cv.width / r.width), (ev.clientY - r.top) * (cv.height / r.height)];
      };
      cv.addEventListener("pointerdown", ev => {
        drawing = true; sketchDirty = true; cv.setPointerCapture(ev.pointerId);
        const [x, y] = at(ev); g.beginPath(); g.moveTo(x, y);
      });
      cv.addEventListener("pointermove", ev => {
        if (!drawing) return;
        ev.preventDefault();
        const [x, y] = at(ev); g.lineTo(x, y); g.stroke();
      });
      const stop = () => { drawing = false; };
      cv.addEventListener("pointerup", stop);
      cv.addEventListener("pointerleave", stop);
    }
    // Concept graph nodes navigate.
    $$("[data-concept]", root).forEach(n => {
      const go = () => { location.hash = "#/concept/" + n.dataset.concept; };
      n.onclick = go;
      n.onkeydown = ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } };
    });
    // 3-minute blank-page recall timer
    $$('[data-act="recallTimer"]', root).forEach(b => {
      b.onclick = () => {
        const clock = $("#recallClock", root);
        if (!clock) return;
        let left = 180;
        clearInterval(timerH);
        const tick = () => {
          clock.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0") + " left";
          if (left <= 0) { clearInterval(timerH); clock.textContent = "time — stop writing, now compare"; toast("Recall window closed. Compare against the source."); }
          left--;
        };
        tick();
        timerH = setInterval(tick, 1000);
        const ta = $("#lessonRecall", root);
        if (ta) ta.focus();
      };
    });
    // problems solved unaided
    $$("[data-solve]", root).forEach(b => {
      b.onclick = () => {
        const m = location.hash.match(/#\/lesson\/([^/]+)\/(\d+)\/(\d+)/);
        if (!m) return;
        const k = lessonKey(m[1], +m[2], +m[3]);
        const st = S.lessons[k] || { done: false, notes: "", checks: [] };
        if ($("#lessonNotes", root)) st.notes = $("#lessonNotes", root).value;
        if ($("#lessonRecall", root)) st.recall = $("#lessonRecall", root).value;
        st.solved = Math.max(0, (st.solved || 0) + (+b.dataset.solve));
        S.lessons[k] = st; save(); render();
      };
    });
    // recall grading: forgetting resets the interval, solid recall extends it
    $$("[data-recall]", root).forEach(btn => {
      btn.onclick = () => {
        const k = btn.dataset.k, grade = btn.dataset.recall;
        const rv = S.review[k];
        if (!rv) return;
        if (grade === "forgot") { rv.lapses = (rv.lapses || 0) + 1; scheduleReview(k, 0); S.review[k].lapses = rv.lapses; }
        else if (grade === "shaky") { const l = rv.lapses || 0; scheduleReview(k, rv.box); S.review[k].lapses = l; }
        else { const l = rv.lapses || 0; scheduleReview(k, (rv.box || 0) + 1); S.review[k].lapses = l; }
        logEvent("recall", k, { grade: grade, box: S.review[k].box });
        save(); render();
        toast(grade === "solid" ? "Solid — next check in " + BOXES[S.review[k].box] + " days."
          : grade === "shaky" ? "Held at " + BOXES[S.review[k].box] + " days."
          : "Reset — back in " + BOXES[0] + " days. That is the system working.");
      };
    });
    // heatmap day -> that day in the calendar
    $$("[data-hday]", root).forEach(el => {
      el.onclick = () => {
        calSel = el.dataset.hday; calCursor = calSel.slice(0, 7);
        location.hash = "#/calendar";
      };
    });
    $$("[data-delanchor]", root).forEach(b => {
      b.onclick = () => { S.anchors.splice(+b.dataset.delanchor, 1); save(); render(); toast("Anchor removed."); };
    });
    // verify an exported record file, independently of the live state
    if ($("#recFile", root)) {
      $("#recFile", root).onchange = ev => {
        const f = ev.target.files && ev.target.files[0];
        const out = $("#recResult", root);
        if (!f || !out) return;
        const rd = new FileReader();
        rd.onload = () => {
          let bundle;
          try { bundle = JSON.parse(rd.result); } catch (e) { out.innerHTML = '<span style="color:var(--bad);">Not valid JSON.</span>'; return; }
          const entries = bundle.entries || [];
          if (!entries.length) { out.innerHTML = '<span style="color:var(--bad);">No entries in that file.</span>'; return; }
          const chain = verifyChain(entries);
          // if the file ships preimages, confirm they hash to the stated hash
          let preOk = true, preBad = -1;
          entries.forEach((e, i) => {
            if (preOk && typeof e.preimage === "string") {
              if (sha256(e.preimage) !== e.hash || e.preimage !== preimage(e)) { preOk = false; preBad = i; }
            }
          });
          if (chain.ok && preOk)
            out.innerHTML = '<span style="color:var(--good);">✓ ' + entries.length + " entries verify · " +
              esc(entries[0].ts.slice(0, 10)) + " → " + esc(entries[entries.length - 1].ts.slice(0, 10)) +
              ' · head ' + esc(String(entries[entries.length - 1].hash).slice(0, 12)) + "…</span>";
          else if (!chain.ok)
            out.innerHTML = '<span style="color:var(--bad);">✗ chain breaks at entry ' + chain.brokenAt + " of " + entries.length + "</span>";
          else
            out.innerHTML = '<span style="color:var(--bad);">✗ entry ' + preBad + " does not hash to its stated value</span>";
        };
        rd.readAsText(f);
      };
    }
    // gates
    $$("[data-gate]", root).forEach(b => {
      b.onclick = () => {
        const n = +b.dataset.gate;
        S.gates[n] = S.gates[n] ? false : todayISO();
        logEvent("gate", "gate" + n, { passed: !!S.gates[n] });
        save(); render();
        if (S.gates[n]) toast("Gate " + n + " passed — every later target just moved earlier.");
      };
    });
    // client delete
    $$("[data-delclient]", root).forEach(b => {
      b.onclick = () => { S.treasury.clients.splice(+b.dataset.delclient, 1); save(); render(); };
    });
    // diag timer
    if (route.startsWith("/diag/")) {
      const d = D.DIAGNOSTICS.find(x => x.id === route.split("/")[2]);
      const el = $("#diagTimer");
      let remaining = d.minutes * 60;
      const draw = () => {
        const h = Math.floor(remaining / 3600), m = Math.floor((remaining % 3600) / 60), s = remaining % 60;
        el.textContent = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        el.classList.toggle("low", remaining <= 600);
      };
      $("#timerStart").onclick = () => {
        clearInterval(timerH);
        remaining = d.minutes * 60; draw();
        toast("Exam conditions begin. No notes. No AI. Truth only.");
        timerH = setInterval(() => {
          remaining--; draw();
          if (remaining <= 0) { clearInterval(timerH); toast("Time. Pens down — grade honestly."); }
        }, 1000);
      };
      $("#timerStop").onclick = () => { clearInterval(timerH); };
    }
    wireChartTips(root);
  }

  // ---------- backup ----------
  function exportBackup() {
    S.settings.lastBackup = todayISO(); save();
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "brickford-backup-" + todayISO() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Backup exported. Keep it somewhere safe.");
    render();
  }
  function importBackup(file) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!data || typeof data !== "object" || !("lessons" in data)) throw new Error("bad file");
        S = Object.assign({}, DEFAULT, data);
        S.treasury = Object.assign({}, DEFAULT.treasury, S.treasury);
        S.settings = Object.assign({}, DEFAULT.settings, S.settings);
        save(); render();
        toast("Backup restored. Welcome back, scholar.");
      } catch (e) { toast("That file is not a valid backup."); }
    };
    r.readAsText(file);
  }

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#/, "") || "/";
    return h;
  }
  // SVG donut. pathLength=100 lets the dash offset be read straight off the
  // percentage, so the CSS animation just sweeps to (100 - pct).
  function ringHTML(pct, label, sub, tone, size) {
    const s = size || 84, r = (s - 9) / 2, p = Math.max(0, Math.min(100, Math.round(pct)));
    return '<div class="ring-wrap" style="width:' + s + "px; height:" + s + 'px;">' +
      '<svg class="ring" width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + " " + s + '" aria-hidden="true">' +
      '<circle class="track" cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" stroke-width="5"/>' +
      '<circle class="fill' + (tone ? " " + tone : "") + '" cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r +
      '" stroke-width="5" pathLength="100" style="--to:' + (100 - p) + '; transform:rotate(-90deg); transform-origin:center;"/>' +
      "</svg>" +
      '<div class="ring-label">' + esc(label) + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</div></div>";
  }

  // Count a number up from zero on entry. The element already holds its final
  // text, so this is decoration only — reduced-motion and no-JS both keep it.
  function animateCounts(root) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$("[data-count]", root).forEach(el => {
      const to = parseFloat(el.getAttribute("data-count"));
      if (!isFinite(to) || to === 0) return;
      const dec = +(el.getAttribute("data-dec") || 0), t0 = performance.now(), dur = 700;
      el.textContent = (0).toFixed(dec);
      const step = now => {
        const k = Math.min(1, (now - t0) / dur);
        el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec);
        if (k < 1) requestAnimationFrame(step); else el.textContent = to.toFixed(dec);
      };
      requestAnimationFrame(step);
    });
  }

  // Phone layout for tables: a desktop table on a 300px-wide card clips its
  // last columns off the card edge — on Outside Courses that hid the Status
  // control entirely. Stamping each body cell with its column header lets CSS
  // restack the row as labelled lines below 640px, with nothing off-screen.
  function stackTables(root) {
    $$(".table-wrap table", root).forEach(t => {
      const heads = $$("thead th", t).map(th => th.textContent.trim());
      if (!heads.length) return;
      t.classList.add("stack-table");
      $$("tbody tr", t).forEach(tr => {
        Array.from(tr.children).forEach((td, i) => {
          if (td.hasAttribute("colspan")) return;
          if (heads[i]) td.setAttribute("data-label", heads[i]);
        });
      });
    });
  }

  // Re-entrancy guard: a failed sync re-renders so its banner reaches whatever
  // page is open, and a sync that fails DURING a render would otherwise recurse.
  let rendering = false;
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      // apple-design 7: a route change is a spatial move, and a hard swap gives
      // the eye nothing to follow. The View Transition API cross-fades the old
      // page into the new one at the compositor, so it costs nothing on the
      // input path — and where it is missing, or where reduced motion is asked
      // for, the swap simply happens as before. Nothing depends on it.
      const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (document.startViewTransition && !reduce) document.startViewTransition(() => renderInner());
      else renderInner();
    } finally { rendering = false; }
  }
  function renderInner() {
    clearInterval(timerH);
    const r = route();
    const view = $("#view");
    let html;
    const seg = r.split("/").filter(Boolean);
    if (r === "/") html = V.dashboard();
    else if (r === "/courses") html = V.courses();
    else if (seg[0] === "course") html = V.course(seg[1]);
    else if (seg[0] === "lesson") html = V.lesson(seg[1], +seg[2], +seg[3]);
    else if (r === "/exams") html = V.exams();
    else if (seg[0] === "quiz") html = V.quiz(seg[1]);
    else if (seg[0] === "diag") html = V.diag(seg[1]);
    else if (r === "/transcript") html = V.transcript();
    else if (r === "/record") html = V.record();
    else if (r === "/recall") html = V.recall();
    else if (r === "/method") html = V.method();
    else if (r === "/atlas") html = V.atlas();
    else if (r === "/sync") html = V.sync();
    else if (seg[0] === "concept") html = V.concept(seg[1]);
    else if (seg[0] === "summary") html = V.summary(seg[1], +seg[2], +seg[3]);
    else if (r === "/review") html = V.review();
    else if (r === "/treasury") html = V.treasury();
    else if (r === "/practice") html = V.practice();
    else if (r === "/workshop") html = V.workshop();
    else if (r === "/drill") html = V.drill();
    else if (r === "/electives") html = V.electives();
    else if (r === "/guide") html = V.guide();
    else if (r === "/calendar") html = V.calendar();
    else if (r === "/library") html = V.library();
    else if (seg[0] === "doc") html = V.doc(seg[1]);
    // Every unrecognised hash used to render the dashboard, silently. A typo, a
    // stale bookmark or a route that was renamed all looked like "you are on
    // Today" rather than "that page is not here" — and tools/verify-contrast.js
    // listed /settings among its routes, so one of its thirty was the dashboard
    // measured a second time.
    else html = V.notFound(r);
    view.innerHTML = html;
    renderMath(view);
    stackTables(view);
    animateCounts(view);
    wire(view, r);
    // Rendered after the view, because V.lesson writes settings.lastLesson while
    // it renders and the rail reads it.
    mountRail();
    // nav active state (sidebar + mobile tab bar)
    $$(".nav a, .tabbar a").forEach(a => {
      const rt = a.dataset.route;
      const active = rt === "/" ? r === "/" : r.startsWith(rt) ||
        (rt === "/courses" && (seg[0] === "course" || seg[0] === "lesson")) ||
        (rt === "/exams" && (seg[0] === "quiz" || seg[0] === "diag")) ||
        (rt === "/workshop" && r === "/drill") ||
        (rt === "/library" && seg[0] === "doc");
      a.classList.toggle("active", !!active);
    });
    $("#sidebar").classList.remove("open");
    window.scrollTo({ top: 0 });
  }

  // ---------- boot ----------
  function boot() {
    const applyTheme = () => {
      document.documentElement.dataset.theme = S.settings.theme || "light";
      $$("#themeMenu [data-theme-pick]").forEach(b =>
        b.classList.toggle("on", b.dataset.themePick === (S.settings.theme || "light")));
    };
    applyTheme();
    $("#themeBtn").onclick = () => $("#themeMenu").classList.toggle("open");
    $$("#themeMenu [data-theme-pick]").forEach(b => {
      b.onclick = () => {
        S.settings.theme = b.dataset.themePick;
        save(); applyTheme();
        $("#themeMenu").classList.remove("open");
      };
    });
    $("#exportBtn").onclick = exportBackup;
    $("#importBtn").onclick = () => $("#importFile").click();
    $("#importFile").onchange = e => { if (e.target.files[0]) importBackup(e.target.files[0]); e.target.value = ""; };
    mountDrawer();
    window.addEventListener("hashchange", render);
    // Rotating the phone changes which furniture exists and how tall it is.
    let rt = null;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(measureFurniture, 120); });
    render();
    // Pull once on open so a device that has been away is current before the
    // first tap, and push anything still pending when the tab goes away.
    if (ghToken()) runSync("pull");
    // Pull again whenever the page comes back to the foreground. Pulling only on
    // load meant a phone with the tab already open — the normal case, since iOS
    // resumes rather than reloads — never saw progress made on the laptop.
    let lastPull = Date.now();
    document.addEventListener("visibilitychange", () => {
      if (!ghToken()) return;
      if (document.visibilityState === "visible") {
        if (Date.now() - lastPull < 20000) return;   // do not hammer the API
        lastPull = Date.now();
        runSync("pull");
      } else {
        runSync("push");
      }
    });
    // iOS kills in-flight fetches as it backgrounds a page, so the push above is
    // best-effort. pagehide fires earlier and more reliably; both are cheap.
    window.addEventListener("pagehide", () => { if (ghToken()) runSync("push"); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
