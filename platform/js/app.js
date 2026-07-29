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
  function weekNumber() { return Math.max(1, Math.floor(daysBetween(D.START_DATE, todayISO()) / 7) + 1); }
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
    settings: { theme: "light", lastBackup: null, dailyStart: "08:00" },
  };
  let S;
  try { S = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch (e) { S = JSON.parse(JSON.stringify(DEFAULT)); }
  S.treasury = Object.assign({}, DEFAULT.treasury, S.treasury);
  S.settings = Object.assign({}, DEFAULT.settings, S.settings);
  function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
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
        const r = mergeState(remote);
        S.settings.lastSync = todayISO(); save();
        say("");
        if (r.changed) { render(); toast("Pulled \u2014 " + r.changed + " change" + (r.changed === 1 ? "" : "s") + " merged."); }
        return true;
      }
      const body = {
        message: "progress: " + todayISO() + " from " + S.settings.deviceId,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(syncPayload(), null, 1)))),
      };
      if (!file.missing && file.sha) body.sha = file.sha;
      return ghFetch("PUT", body).then(res2 => {
        if (res2.status === 409) throw new Error("The remote moved while pushing. Pull, then push again.");
        if (!res2.ok) return res2.json().then(j => { throw new Error(j.message || ("GitHub returned " + res2.status)); });
        S.settings.lastSync = todayISO(); save(); say("");
        toast("Pushed.");
        return true;
      });
    }).catch(err => {
      say('<span style="color:var(--bad);">' + esc(err.message) + "</span>");
      return false;
    }).then(v => { syncBusy = false; return v; });
  }

  // Push shortly after progress changes, so sync is not a chore to remember.
  let pushTimer = null;
  function syncSoon() {
    if (!ghToken()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => runSync("push"), 4000);
  }

  function syncPayload() {
    const state = {};
    ["lessons", "problems", "quizAttempts", "quizMisses", "diag", "gates", "studyDays",
     "weeks", "labs", "psets", "electives", "treasury", "review", "concepts", "anchors"]
      .forEach(k => state[k] = S[k]);
    state.settings = { theme: S.settings.theme, dailyStart: S.settings.dailyStart };
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
  const postsTotal = () => S.weeks.reduce((a, w) => a + (+w.posts || 0), 0);
  const revenueTotal = () => S.treasury.entries.reduce((a, e) => a + (+e.amount || 0), 0);
  function streak() {
    const set = new Set(S.studyDays);
    let n = 0;
    let d = new Date();
    if (!set.has(todayISO())) d.setDate(d.getDate() - 1); // streak survives until today ends
    while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
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
  function addMonths(iso, m) {
    // Local-date arithmetic; toISOString would shift the day in non-UTC zones.
    const p = iso.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1 + m, p[2]);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
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
      const target = addMonths(base, g.months);
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
    const baseline = addMonths(D.START_DATE, D.GATES.reduce((a, g) => a + g.months, 0));
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
    events.push([
      "BEGIN:VEVENT", "UID:brickford-daily@brickford.local", "DTSTAMP:" + stamp,
      "DTSTART:" + ymd(D.START_DATE) + "T" + t(sh * 60 + sm),
      "DTEND:" + ymd(D.START_DATE) + "T" + t(endMin),
      "RRULE:FREQ=DAILY",
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
    const w = Math.max(1, Math.floor(daysBetween(D.START_DATE, iso) / 7) + 1);
    const row = D.WEEK_PLAN.find(r => w >= r.from && w <= r.to) || D.WEEK_PLAN[D.WEEK_PLAN.length - 1];
    return { w, row };
  }
  const PHASE_COLOR = ["var(--ink-3)", "var(--accent)", "var(--accent-2)", "var(--bad)"];
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
  const COURSE_SHORT = { math110: "Lin Algebra", math120: "Calculus", math130: "Probability", ai200: "Zero to Hero", ai210: "fast.ai", math210: "Math for ML", ai300: "Paper Room", sys250: "GPU & Systems", ai310: "LLM Eng", res400: "Research" };
  const P2_DAY = 182; // day index where Phase 2 opens (week 27)
  // Pacing is calibrated to the gates: spine content done ~week 13 with
  // weeks 14-26 for the original-project block (Gate 2, month 6 = GPT from
  // scratch); papers at 3 weeks each put 8+ reimplementations before Gate 3
  // (month 12) and all 16 before Gate 4 (month 18).
  function scheduledFor(iso) {
    const d = daysBetween(D.START_DATE, iso);
    if (d < 0) return [];
    const items = [];

    // ---- Theory ----
    // Stage 1: the three math courses rotate LA→Calc→Prob, each day's quota
    // packed from REAL video minutes to fill the ~2h block — ~5 short 3B1B
    // chapters, or one 50-minute MIT lecture. Future days re-anchor if you
    // work ahead (see windowFor).
    const dT = daysBetween(D.START_DATE, todayISO());
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
    return items;
  }
  function schedDone(it) { return !it.pseudo && !!(S.lessons[lessonKey(it.cid, it.ui, it.li)] || {}).done; }
  function realSched(iso) { return scheduledFor(iso).filter(it => !it.pseudo); }
  // The day's quota per subject, with live progress against it:
  // "2/4 lectures · Lin Algebra · 41m video" — fills in as lessons are ticked.
  function dayLoadHTML(real) {
    if (!real.length) return "";
    const load = {};
    real.forEach(it => {
      const L = load[it.code] = load[it.code] || { n: 0, done: 0, min: 0, cid: it.cid };
      L.n++; if (schedDone(it)) L.done++; L.min += it.l.min || 0;
    });
    const chips = Object.entries(load).map(([code, v]) => {
      const full = v.done === v.n;
      return '<span class="pill ' + (full ? "good" : "teal") + '" style="text-transform:none; letter-spacing:0.02em;">' +
        (full ? "✓ " : "") + v.done + "/" + v.n + " lecture" + (v.n === 1 ? "" : "s") + " · " + esc(COURSE_SHORT[v.cid] || code) +
        (v.min ? " · " + v.min + "m video" : "") + "</span>";
    }).join(" ");
    return '<div style="display:flex; flex-wrap:wrap; gap:6px; margin:4px 0 10px;">' + chips + "</div>";
  }
  // One shared renderer for a scheduled item (dashboard + calendar detail).
  function schedRowHTML(it) {
    if (it.pseudo) {
    return '<div class="plan-row"><span class="block">' + it.track + '</span><span class="what">' + esc(it.t) + '</span><a class="btn ghost go" href="' + it.href + '">Go</a></div>';
    }
    const dn = schedDone(it);
    const dur = it.l.min
      ? (it.l.min >= 60 ? Math.floor(it.l.min / 60) + "h" + (it.l.min % 60 ? pad2(it.l.min % 60) : "") : it.l.min + "m") + " video"
      : (it.l.paper ? "paper" : "reading");
    const meta = ' <span class="mono" style="color:var(--ink-3); font-size:var(--fs-tiny); white-space:nowrap;">' + dur +
      (it.spanN > 1 ? " · day " + it.dayN + " of " + it.spanN : "") + "</span>";
    const fc = D.COURSES.find(x => x.id === it.cid);
    return '<div class="plan-row' + (fc ? " " + facClass(fc) : "") + '"><span class="block">' + it.track + '</span><span class="what">' +
      (dn ? '<span style="color:var(--good); font-weight:700;">✓</span> ' : "") +
      "<strong>" + esc(it.code) + "</strong> — " + esc(it.l.t) + meta + "</span>" +
      '<a class="btn ghost go" href="#/lesson/' + it.cid + "/" + it.ui + "/" + it.li + '">' + (dn ? "Review" : "Open") + "</a></div>";
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
    for (let iso = (from > D.START_DATE ? from : D.START_DATE); iso < today; iso = addDaysISO(iso, 1))
      realSched(iso).forEach(it => { if (!schedDone(it)) owed.add(lessonKey(it.cid, it.ui, it.li)); });
    return owed.size;
  }
  // Status of a calendar day: judged against ITS OWN scheduled lessons —
  // catching up late still turns the day green. Falls back to activity
  // for days beyond the scheduled syllabus.
  function dayStatus(iso) {
    const today = todayISO();
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

  V.dashboard = function () {
    const day = Math.max(1, daysBetween(D.START_DATE, todayISO()) + 1);
    const f = currentFocus();
    const g = nextGate();
    const st = streak();
    const studiedToday = S.studyDays.includes(todayISO());
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
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
    const dsa = dsaCount(), posts = postsTotal(), rev = Math.round(revenueTotal());
    const due = reviewsDue();
    const proven = Object.values(S.lessons).filter(l => l && l.verified).length;
    const dayPct = real.length ? (doneToday / real.length) * 100 : (studiedToday ? 100 : 0);
    const charted = weeksArr.some(w => (+w.dsa || 0) || (+w.revenue || 0));

    // Gate progress: how far through this gate's own window we are, so the
    // ring reads as "time spent" against the countdown beside it.
    let gatePct = 0, gateLeft = 0;
    if (g) {
      gateLeft = Math.max(0, daysBetween(todayISO(), g.target));
      const span = g.months * 30.4;
      gatePct = Math.max(0, Math.min(100, ((span - gateLeft) / span) * 100));
    }

    const tile = (label, valueHTML, barPct, tone) =>
      '<div class="card tile"><div class="t-label">' + label + '</div><div class="t-value">' + valueHTML + "</div>" +
      (barPct == null ? "" : '<div class="bar grow' + (tone ? " " + tone : "") + '"><i style="--w:' + (barPct / 100) + '; transform:scaleX(' + (barPct / 100) + ');"></i></div>') +
      "</div>";
    const num = (v, dec) => '<span data-count="' + v + '"' + (dec ? ' data-dec="' + dec + '"' : "") + ">" + (dec ? v.toFixed(dec) : v) + "</span>";

    // Before anything has been done, six zero tiles and an empty chart read as
    // failure. Point at the one next action instead.
    const started = !!firstActivityISO();
    const firstUp = real[0];
    return '<div class="view-enter">' +
      // ---- Hero: identity, day, one short line of context, today's ring ----
      '<div class="page-head hero">' +
      '<div class="hero-text"><div class="kicker">' + esc(D.IDENTITY.est) + "</div>" +
      "<h1>" + greet + ' — <span class="mono" style="color:var(--accent);">Day ' + String(day).padStart(3, "0") + "</span></h1>" +
      '<div class="meta"><span>Week ' + f.week + '</span><span class="dot"></span><span>Phase ' + f.phase + '</span><span class="dot"></span>' +
      '<span class="pill gold">' + esc(f.tag) + "</span>" +
      (studiedToday ? '<span class="pill good">✓ today marked</span>' : "") + "</div></div>" +
      ringHTML(dayPct, real.length ? doneToday + "/" + real.length : (studiedToday ? "✓" : "—"), "today", dayPct >= 100 ? "good" : "", 92) +
      "</div>" +

      (!started && firstUp
        ? '<div class="card feature"><div style="display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap;">' +
          '<div style="flex:1 1 220px; min-width:0;"><div style="font-size:var(--fs-tiny); letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-3); font-weight:600;">Start here</div>' +
          '<div style="color:var(--ink); font-weight:600; font-size:1.05rem; margin-top:2px;">' + esc(firstUp.code) + " — " + esc(firstUp.l.t) + "</div>" +
          '<div style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">One lecture. Everything else fills in behind you.</div></div>' +
          '<a class="btn" href="#/lesson/' + firstUp.cid + "/" + firstUp.ui + "/" + firstUp.li + '">Open ▸</a></div></div>'
        : "") +

      (S.settings.lastLesson
        ? '<div class="card" style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">' +
          '<div><div style="font-size:var(--fs-tiny); letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-3); font-weight:600;">Continue</div>' +
          '<div style="color:var(--ink); font-weight:600; margin-top:2px;">' + esc(S.settings.lastLesson.label) + "</div></div>" +
          '<a class="btn" href="#/lesson/' + S.settings.lastLesson.cid + "/" + S.settings.lastLesson.ui + "/" + S.settings.lastLesson.li + '">Resume ▸</a></div>'
        : "") +

      (backupAge === null || backupAge > 14
        ? '<div class="card" style="border-color:var(--line-strong); display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;"><span style="font-size:var(--fs-small); color:var(--ink-2);">' +
          (backupAge === null ? "This browser is the only copy." : "Last backup " + backupAge + " days ago.") +
          '</span><button class="btn" data-act="backup">Export backup</button></div>'
        : "") +

      // ---- Four metrics, two across on phones ----
      '<div class="tiles stagger" style="margin-top:16px;">' +
      tile("Streak", num(st) + ' <span class="unit">days</span>', Math.min(100, st / 30 * 100)) +
      tile("DSA", num(dsa) + ' <span class="unit">/ 150</span>', dsa / 150 * 100) +
      tile("Proven", num(proven), null) +
      tile("Treasury", num(rev) + ' <span class="unit">BHD</span>', null) +
      "</div>" +

      '<div class="grid cols-2 top" style="margin-top:16px;">' +
      // ---- Today ----
      '<div class="card"><div style="display:flex; align-items:baseline; justify-content:space-between; gap:10px; flex-wrap:wrap;">' +
      "<h2>Today</h2>" +
      (real.length ? '<span class="mono" style="font-size:var(--fs-small); color:var(--ink-3);">' + doneToday + " of " + real.length + " done</span>" : "") +
      "</div>" +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:4px;">' +
      'Theory · the maths under every layer &nbsp;·&nbsp; Build · the network itself &nbsp;·&nbsp; Practice · a separate track</p>' +
      (real.length ? '<div class="bar grow" style="margin-top:10px;"><i style="--w:' + (dayPct / 100) + '; transform:scaleX(' + (dayPct / 100) + ');"></i></div>' : "") +
      dayLoadHTML(real) +
      (backlog > 0
        ? '<div class="plan-row" style="border-left:2px solid var(--bad); padding-left:10px;"><span class="block" style="color:var(--bad); background:color-mix(in srgb, var(--bad) 10%, transparent);">Owed</span><span class="what"><strong>' + (backlog > 20 ? "20+" : backlog) + "</strong> lesson" + (backlog === 1 ? "" : "s") + " behind</span><a class=\"btn ghost go\" href=\"#/calendar\">Calendar</a></div>"
        : "") +
      '<div style="margin-top:6px;">' +
      (due.length
        ? '<div class="plan-row"><span class="block" style="color:var(--accent-2); background:color-mix(in srgb, var(--accent-2) 12%, transparent);">Recall</span>' +
          '<span class="what"><strong>' + due.length + "</strong> lecture" + (due.length === 1 ? "" : "s") + " due before new material</span>" +
          '<a class="btn ghost go" href="#/recall">Recall</a></div>'
        : "") +
      todaySched.map(schedRowHTML).join("") +
      (todaySched.length ? "" : '<div class="plan-row"><span class="block">Study</span><span class="what">Before Day 1 — calibration and setup</span><a class="btn ghost go" href="#/guide">Handbook</a></div>') +
      '<div class="plan-row"><span class="block">Practice</span><span class="what">' +
      (probs.length
        ? (probsCat ? esc(probsCat) + " · " : "") + probs.map(p => "<strong>" + esc(p) + "</strong>").join(", ") +
          ' <span style="color:var(--ink-3);">— separate track from the maths</span>'
        : "All 150 done.") +
      '</span><a class="btn ghost go" href="#/course/cs150">Tracker</a></div>' +
      '<div class="plan-row"><span class="block">Drill</span><span class="what">' +
      (missPool().length ? "<strong>" + missPool().length + "</strong> missed questions waiting" : "Pool clear") +
      '</span><a class="btn ghost go" href="#/drill">Drill</a></div>' +
      '<div class="plan-row"><span class="block">Publish</span><span class="what">Notes → post</span><a class="btn ghost go" href="#/review">Review</a></div>' +
      "</div>" +
      '<div style="margin-top:14px;">' + (studiedToday
        ? '<span class="pill good">✓ Deep Track marked for today</span>'
        : '<button class="btn" data-act="studied">Mark today’s Deep Track done</button>') + "</div></div>" +

      // ---- Next gate: countdown + how far through its window ----
      '<div class="card feature">' +
      '<div style="display:flex; align-items:center; gap:var(--sp-4); flex-wrap:wrap;">' +
      '<div style="flex:1 1 180px; min-width:0;">' +
      "<h2>" + (g ? "Gate " + g.n + " — " + esc(g.label) : "All gates passed") + "</h2>" +
      (g
        ? '<div class="mono" style="margin:6px 0 2px; font-size:1.9rem; color:var(--accent);">' + num(gateLeft) + ' <span style="font-size:0.8rem; color:var(--panel-ink);">days left</span></div>' +
          '<p style="font-size:var(--fs-small); color:var(--ink-2);">' + esc(g.req) + "</p>"
        : '<p style="color:var(--good);">You are what you set out to become.</p>') +
      "</div>" +
      (g ? ringHTML(gatePct, Math.round(gatePct) + "%", "elapsed", "", 92) : "") +
      "</div>" +
      (g
        ? '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:12px;">Target ' + g.target + " · finish " + drift.projected +
          (drift.aheadDays > 0 ? ' · <span style="color:var(--good);">' + drift.aheadDays + " days ahead</span>"
            : drift.aheadDays < 0 ? ' · <span style="color:var(--bad);">' + (-drift.aheadDays) + " days behind</span>"
            : " · on baseline") +
          ' · <a href="#/transcript">All gates</a></p>'
        : "") +
      "</div></div>" +

      // ---- Charts only once there is something to plot ----
      (charted
        ? '<div class="grid cols-2" style="margin-top:16px;">' +
          '<div class="card"><h2>DSA over time</h2>' + lineChart(weeksArr.map(w => +w.dsa || 0), weeksArr.map(w => "Week " + w.week)) + "</div>" +
          '<div class="card"><h2>Revenue by week</h2>' + barChart(weeksArr.map(w => +w.revenue || 0), weeksArr.map(w => "Week " + w.week)) + "</div>" +
          "</div>"
        : started
          ? '<div class="card" style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">' +
            '<span style="font-size:var(--fs-small); color:var(--ink-2);">Seal a week to start the charts.</span>' +
            '<a class="btn ghost" href="#/review">Weekly Review</a></div>'
          : "") +
      "</div>";
  };

  V.courses = function () {
    const phase = currentPhase();
    const PHASES = [
      [0, "Phase 0 — Foundations", "Verify the math, sharpen the code. Weeks 1–2, then ongoing."],
      [1, "Phase 1 — The Spine", "Neural networks from zero, end to end. Months 1–6."],
      [2, "Phase 2 — Depth", "Papers, systems, GPUs, LLM engineering. Months 7–18."],
      [3, "Phase 3 — Frontier", "The fork: researcher, engineer, or founder."],
    ];
    const card = c => {
      const m = courseMastery(c);
      const ls = c.tracker ? { done: dsaCount(), total: 150 } : courseLessonStats(c);
      const locked = c.phase > phase;
      const cov = courseCoverage(c);
      return '<a href="#/course/' + c.id + '" class="card hoverable course-card ' + facClass(c) + (locked ? " locked" : "") + '" style="text-decoration:none;"><div class="edge"></div>' +
        '<div style="display:flex; justify-content:space-between; align-items:baseline;"><span class="code">' + esc(c.code) + "</span>" +
        (locked ? '<span class="pill">Unlocks in Phase ' + c.phase + "</span>" : '<span class="pill gold">' + m + "% mastery</span>") + "</div>" +
        "<h3>" + esc(c.title) + "</h3>" +
        '<div class="desc">' + esc(c.desc) + "</div>" +
        '<div style="margin-top:14px;"><div class="bar grow"><u style="transform:scaleX(' + (cov / 100) + ');"></u><i style="--w:' + (m / 100) + '; transform:scaleX(' + (m / 100) + ');"></i></div>' +
        '<div style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:5px;">' +
        (c.tracker ? ls.done + " / " + ls.total + " problems"
                   : ls.done + " watched · " + ls.verified + " proven · " + ls.total + " lectures") +
        "</div></div></a>";
    };
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Registrar</div><h1>Course Catalog</h1>' +
      '<div class="sub">' + D.COURSES.length + ' courses · four phases · free and permanent.</div>' +
      '<div class="row-actions"><a class="btn ghost" href="#/electives">Outside courses</a></div></div>' +
      PHASES.map(ph => {
        const cs = D.COURSES.filter(c => c.phase === ph[0]);
        if (!cs.length) return "";
        return '<h2 style="margin:26px 0 2px;">' + ph[1] + '</h2><p style="font-size:var(--fs-tiny); color:var(--ink-3); margin:0 0 12px;">' + ph[2] + '</p><div class="grid cols-2">' + cs.map(card).join("") + "</div>";
      }).join("") + "</div>";
  };

  V.course = function (cid) {
    const c = D.COURSES.find(x => x.id === cid);
    if (!c) return "<p>Unknown course.</p>";
    if (c.tracker) return trackerCourse(c);
    const cst = courseLessonStats(c);
    const cmastery = courseMastery(c);
    const cbest = c.quiz ? bestQuiz(c.quiz) : null;
    const [clvlEn, clvlGrade] = standing(cmastery);
    const checkpoint =
      '<div class="card feature" style="margin-top:16px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px; flex-wrap:wrap;">' +
      '<h2>Course checkpoint — your level</h2><span class="pill">' + cst.done + " / " + cst.total + " lessons</span></div>" +
      '<div style="margin:10px 0; max-width:520px;"><div class="bar"><i style="transform:scaleX(' + (cmastery / 100) + ');"></i></div></div>' +
      '<p style="font-size:var(--fs-small);"><strong style="font-size:1.1rem;">' + cmastery + "% · " + clvlEn + (clvlGrade !== "—" ? " (Grade " + clvlGrade + ")" : "") + "</strong>" +
      (cbest != null ? ' · best exam <strong>' + cbest + "%</strong>" : "") + "</p>" +
      (c.quiz
        ? '<p style="font-size:var(--fs-small); margin-top:6px;">15 questions on ' + esc(c.code) + ", drawn fresh, graded instantly.</p>" +
          '<div style="margin-top:12px;"><a class="btn" href="#/quiz/' + c.quiz + '">Sit the ' + esc(c.code) + ' checkpoint exam</a></div>'
        : '<p style="font-size:var(--fs-small); margin-top:6px;">This course is proven by building, not multiple choice — reimplement the papers, ship the systems. Your level here is the labs you complete with proof.</p>' +
          '<div style="margin-top:12px;"><a class="btn" href="#/workshop">Prove it in the Workshop</a></div>') +
      "</div>";
    return '<div class="view-enter"><div class="page-head"><div class="kicker">' + esc(c.code) + " · " + esc(c.faculty) + "</div><h1>" + esc(c.title) + "</h1>" +
      '<div class="sub">' + esc(c.desc) + "</div>" +
      '<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">' +
      c.external.map(e => '<a class="btn ghost" href="' + e.url + '" target="_blank" rel="noopener">' + esc(e.label) + " ↗</a>").join("") +
      (c.quiz ? '<a class="btn" href="#/quiz/' + c.quiz + '">Sit the examination</a>' : "") +
      "</div></div>" +
      c.units.map((u, ui) =>
        '<div class="card"><div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px; margin-bottom:6px;"><h2>' + esc(u.name) + "</h2>" +
        (function () {
          const uDone = u.lessons.filter((_, i) => (S.lessons[lessonKey(c.id, ui, i)] || {}).done).length;
          return '<span class="pill' + (uDone === u.lessons.length ? " good" : "") + '">' + uDone + " / " + u.lessons.length + " lectures</span>";
        })() + "</div>" +
        u.lessons.map((l, i) => {
          const k = lessonKey(c.id, ui, i);
          const done = (S.lessons[k] || {}).done;
          return '<a class="lesson-row ' + (done ? "done" : "") + '" href="#/lesson/' + c.id + "/" + ui + "/" + i + '">' +
            '<span class="n">' + (i + 1) + '</span><span class="t">' + esc(l.t) + "</span>" +
            (done ? '<span class="tick">✓</span>' : "") + "</a>";
        }).join("") + "</div>"
      ).join("") + checkpoint + "</div>";
  };

  function trackerCourse(c) {
    const cats = Object.keys(c.problems);
    // Work top-down through the roadmap: the current category is the first with
    // anything left in it, which is also where nextProblems() is drawing from.
    const thisCat = cats.find(cat => c.problems[cat].some(p => !S.problems[cat + "|" + p])) || null;
    return '<div class="view-enter"><div class="page-head"><div class="kicker">' + esc(c.code) + " · " + esc(c.faculty) + "</div><h1>" + esc(c.title) + "</h1>" +
      '<div class="sub">' + esc(c.desc) + "</div>" +
      '<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">' +
      c.external.map(e => '<a class="btn ghost" href="' + e.url + '" target="_blank" rel="noopener">' + esc(e.label) + " ↗</a>").join("") +
      '<a class="btn" href="#/quiz/' + c.quiz + '">Sit the concept examination</a></div>' +
      '<div style="margin-top:14px; max-width:420px;"><div class="bar teal"><i style="transform:scaleX(' + (dsaCount() / 150) + ');"></i></div>' +
      '<div style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;"><strong style="color:var(--ink);">' + dsaCount() + " / 150</strong> — the Month-6 gate number</div></div></div>" +

      // The page used to be a bare list of problem names, which said nothing
      // about what to do or why this track exists alongside the mathematics.
      '<div class="card"><h2>How this track works</h2>' +
      '<div class="tl" style="margin-top:6px;">' +
      '<div class="tl-row"><span class="tl-date">why</span><span class="tl-what">Interviews are still solved on a whiteboard, and reading a paper into working code needs a language you do not have to fight. That is what this buys.</span></div>' +
      '<div class="tl-row"><span class="tl-date">apart</span><span class="tl-what">This runs <strong>parallel</strong> to the mathematics and does not depend on it. Nothing here builds on linear algebra, and nothing in linear algebra needs this. They are two tracks on the same day.</span></div>' +
      '<div class="tl-row"><span class="tl-date">order</span><span class="tl-what">Top to bottom, category by category. The list below is the NeetCode roadmap order — do not shop around in it.</span></div>' +
      '<div class="tl-row"><span class="tl-date">each</span><span class="tl-what">Read the problem, write it yourself, run it. Stuck past 25 minutes: read the editorial, close it, then write it again from memory. Tick it only when it ran.</span></div>' +
      "</div>" +
      (thisCat
        ? '<div style="margin-top:12px;"><span class="pill gold">this week · ' + esc(thisCat) + "</span></div>"
        : "") +
      "</div>" +

      '<div class="grid cols-2">' +
      cats.map(cat => {
        const probs = c.problems[cat];
        const done = probs.filter(p => S.problems[cat + "|" + p]).length;
        return '<div class="card"><div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;"><h3>' + esc(cat) + '</h3><span class="pill ' + (done === probs.length ? "good" : "") + '">' + done + "/" + probs.length + "</span></div>" +
          probs.map(p => {
            const k = cat + "|" + p;
            return '<label class="check-row"><input type="checkbox" data-prob="' + esc(k) + '" ' + (S.problems[k] ? "checked" : "") + '><span class="checkbox">' + CHECK_SVG + '</span><span class="check-label">' + esc(p) + "</span></label>";
          }).join("") + "</div>";
      }).join("") + "</div></div>";
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
    return '<div class="view-enter"><div class="page-head"><div class="kicker"><a href="#/course/' + cid + '">' + esc(c.code) + "</a> · " + esc(u.name) + "</div>" +
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
      // ---- the four gates: watching is not learning ----
      '<div class="grid cols-2 top" style="margin-top:16px;">' +
      '<div class="card"><div style="display:flex; align-items:baseline; justify-content:space-between; gap:10px; flex-wrap:wrap;">' +
      "<h2>Prove it</h2>" +
      '<span class="mono" style="font-size:var(--fs-small); color:var(--ink-3);">' + gatesOk + " of 4</span></div>" +
      '<div class="bar grow" style="margin-top:10px;"><i style="--w:' + (gatesOk / 4) + '; transform:scaleX(' + (gatesOk / 4) + ');"></i></div>' +
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

      // ---- watched vs proven, stated plainly ----
      '<div class="card"><h2>Where this lecture stands</h2>' +
      '<div class="tl" style="margin-top:8px;">' +
      '<div class="tl-row"><span class="tl-what">Watched</span><span class="pill' + (st.done ? " teal" : "") + '">' + (st.done ? "yes" : "not yet") + "</span></div>" +
      '<div class="tl-row"><span class="tl-what">Proven</span><span class="pill' + (st.verified ? " good" : "") + '">' + (st.verified ? "yes" : "not yet") + "</span></div>" +
      (rv ? '<div class="tl-row"><span class="tl-what">Next recall</span><span class="mono" style="font-size:var(--fs-small); color:' + (rv.due <= todayISO() ? "var(--accent)" : "var(--ink-3)") + ';">' + esc(rv.due) + "</span></div>" : "") +
      "</div>" +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:12px;">Only <strong>proven</strong> counts toward mastery. Watching moves coverage.</p>' +
      (lessonWhy.length
        ? '<div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--line);">' +
          '<div class="field">Why this matters</div>' +
          lessonWhy.map(x => '<div style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;">' +
            esc(x.applies) + ' <a href="#/concept/' + x.id + '" style="white-space:nowrap;">' + esc(x.title) + " \u203a</a></div>").join("") +
          "</div>"
        : "") +
      '<div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">' +
      '<button class="btn ghost" data-act="toggleDone">' + (st.done ? "Unmark watched" : "Mark watched") + "</button>" +
      (st.done
        ? '<a class="btn" href="#/summary/' + cid + "/" + ui + "/" + li + '">Summary ' + (hasSummary ? "▸" : "") + "</a>"
        : '<button class="btn" disabled title="Mark it watched first">Summary — locked</button>') +
      "</div>" +
      (l.paper || l.read ? "" : '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:12px;">Pause the video before each result and predict it. Prediction first, explanation second — that is what makes it stick.</p>') +
      "</div></div>" +

      '<div style="display:flex; justify-content:space-between; margin-top:16px;">' +
      (prev ? '<a class="btn ghost" href="' + prev + '">← Previous</a>' : "<span></span>") +
      (next ? '<a class="btn" href="' + next + '">Next lecture →</a>' : '<a class="btn" href="#/course/' + cid + '">Course complete view</a>') +
      "</div></div>";
  };

  V.exams = function () {
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Examinations</div><h1>Exam Hall</h1>' +
      '<div class="sub">Diagnostics set Phase 1’s shape (≥70%). Concept exams are auto-graded, drawn fresh each sitting.</div></div>' +
      "<h2 style='margin:6px 0 12px;'>Official diagnostics</h2><div class='grid cols-2'>" +
      D.DIAGNOSTICS.map(d => {
        const r = S.diag[d.id] || {};
        const verdict = r.score == null ? null : d.gate == null ? "logged" : r.score >= d.gate ? "pass" : "gap";
        return '<div class="card hoverable"><div style="display:flex; justify-content:space-between; align-items:baseline;"><span class="pill teal">' + esc(d.subject) + "</span>" +
          (verdict === "pass" ? '<span class="pill good">✓ ' + r.score + "% — verified</span>" :
           verdict === "gap" ? '<span class="pill crimson">' + r.score + "% — gap block activates</span>" :
           verdict === "logged" ? '<span class="pill good">✓ done</span>' : '<span class="pill">not sat</span>') + "</div>" +
          "<h3 style='margin-top:6px;'>" + esc(d.title) + "</h3>" +
          '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">' + esc(d.note) + "</p>" +
          '<div style="margin-top:12px;"><a class="btn" href="#/diag/' + d.id + '">Enter examination room</a></div></div>';
      }).join("") + "</div>" +
      "<h2 style='margin:26px 0 12px;'>Concept examinations</h2><div class='grid cols-2'>" +
      Object.keys(D.QUIZZES).map(id => {
        const b = D.QUIZZES[id];
        const at = S.quizAttempts[id] || [];
        const best = bestQuiz(id);
        const bc = D.COURSES.find(x => x.quiz === id);
        return '<div class="card hoverable course-card ' + (bc ? facClass(bc) : "") + '"><div class="edge"></div>' +
          '<div style="display:flex; justify-content:space-between; align-items:baseline;"><span class="code">' + esc(b.course) + "</span>" +
          (best != null ? '<span class="pill ' + (best >= 70 ? "good" : "") + '">best ' + best + "%</span>" : '<span class="pill">unattempted</span>') + "</div>" +
          "<h3 style='margin-top:6px;'>" + esc(b.title) + "</h3>" +
          '<p style="font-size:var(--fs-small); color:var(--ink-2);"><strong>' + unlockedIdx(id).length + "</strong> of " + b.questions.length + " unlocked by what you have watched · " + at.length + " attempt" + (at.length === 1 ? "" : "s") + "</p>" +
          '<div style="margin-top:12px;">' +
          (unlockedIdx(id).length
            ? '<a class="btn" href="#/quiz/' + id + '">Begin sitting</a>'
            : '<button class="btn" disabled title="Watch a lecture from this course first">Locked</button>') +
          "</div></div>";
      }).join("") + "</div></div>";
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
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Exam Hall</div><h1>' + esc(bank.title) + '</h1></div><div id="quizMount"></div></div>';
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
    const startPad = first.getDay(); // 0=Sun
    const daysInMonth = new Date(cy, cm, 0).getDate();
    const gateByDate = {};
    gatePlan().forEach(g => { if (!g.doneDate) gateByDate[g.target] = g; });
    const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      .map(d => '<div class="cal-dow">' + d + "</div>").join("");
    let cells = "";
    for (let i = 0; i < startPad; i++) cells += '<div class="cal-cell blank"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = cy + "-" + pad2(cm) + "-" + pad2(d);
      const before = iso < D.START_DATE;
      const status = before ? null : dayStatus(iso);
      const cls = ["cal-cell"];
      if (iso === today) cls.push("today");
      if (iso === calSel) cls.push("sel");
      if (before) cls.push("rest");
      if (status === "completed") cls.push("cdone");
      else if (status === "missed") cls.push("cmiss");
      else if (status === "partial") cls.push("cpart");
      let inner = '<span class="dnum">';
      if (!before) { const { row } = weekRowFor(iso); inner += '<span class="pdot" style="background:' + PHASE_COLOR[row.phase] + '"></span>'; }
      inner += d + "</span>";
      if (status === "completed") inner += '<span class="cmark" style="color:var(--good);">✓</span>';
      else if (status === "missed") inner += '<span class="cmark" style="color:var(--bad);">!</span>';
      else if (status === "partial") inner += '<span class="cmark" style="color:var(--accent-2);">◐</span>';
      if (before) {
        inner += '<span class="ctag" style="color:var(--ink-3);">Before start</span>';
      } else {
        const { w, row } = weekRowFor(iso);
        const isSunday = new Date(cy, cm - 1, d).getDay() === 0;
        const sched = scheduledFor(iso);
        const real = sched.filter(it => !it.pseudo);
        const dn = real.filter(schedDone).length;
        if (gateByDate[iso]) inner += '<span class="cflag">◆ Gate ' + gateByDate[iso].n + "</span>";
        else if (isSunday) inner += '<span class="cflag" style="color:var(--accent-2);">Review</span>';
        // The day's own courses, so the structure reads straight off the grid
        const names = [];
        sched.forEach(it => { const n = it.pseudo ? it.short : (COURSE_SHORT[it.cid] || it.code); if (n && !names.includes(n)) names.push(n); });
        inner += '<span class="ctag">' + (names.length ? esc(names.join(" + ")) : esc(row.tag)) + "</span>";
        inner += '<span class="chrs">' + (real.length && iso <= today ? dn + "/" + real.length + " done" : "W" + w + " · ~5h") + "</span>";
      }
      cells += '<div class="' + cls.join(" ") + '" data-cal-day="' + iso + '">' + inner + "</div>";
    }
    return '<div class="card"><div class="cal-head"><h2>' + monthName + "</h2>" +
      '<div class="cal-nav"><button class="btn ghost" data-cal-nav="prev" aria-label="Previous month"><svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 1.5 L2 6.5 L6.5 11.5"/></svg></button>' +
      '<button class="btn ghost" data-cal-nav="today">Today</button>' +
      '<button class="btn ghost" data-cal-nav="next" aria-label="Next month"><svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5 L6 6.5 L1.5 11.5"/></svg></button></div></div>' +
      '<div class="cal-grid">' + dow + cells + "</div>" +
      '<div class="cal-legend">' +
      '<span><span class="pdot" style="background:var(--accent)"></span>Phase 1</span>' +
      '<span><span class="pdot" style="background:var(--accent-2)"></span>Phase 2</span>' +
      '<span><span class="pdot" style="background:var(--bad)"></span>Phase 3</span>' +
      '<span style="color:var(--accent);">◆ Gate</span>' +
      '<span style="color:var(--good);">✓ Done</span><span style="color:var(--bad);">! Missed</span></div></div>';
  }

  function dayDetailHTML() {
    const iso = calSel;
    if (iso < D.START_DATE) {
      return '<div class="card"><h2>The climb hasn’t started yet</h2><p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">Day 1 is ' + D.START_DATE + '. Pick that day or later to see the brief.</p></div>';
    }
    const dObj = new Date(iso + "T00:00:00");
    const nice = dObj.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const day = Math.max(1, daysBetween(D.START_DATE, iso) + 1);
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

    const brief = (block, time, what, href, btn) =>
      '<div class="plan-row"><span class="block">' + block + '</span><span class="what">' + what +
      (time ? ' <span class="mono" style="color:var(--ink-3); font-size:var(--fs-tiny);">' + time + "</span>" : "") + "</span>" +
      (href ? '<a class="btn ghost go" href="' + href + '">' + btn + "</a>" : "") + "</div>";

    // This day's own lessons — fixed forever, done state shown per lesson.
    const schedRows = sched.map(schedRowHTML).join("");

    const statusPill = {
      today: '<span class="pill teal">Today</span>',
      upcoming: '<span class="pill">Upcoming</span>',
      completed: '<span class="pill good">✓ Completed</span>',
      partial: '<span class="pill" style="color:var(--accent-2); border-color:var(--accent-2);">Partly done</span>',
      missed: '<span class="pill crimson">Missed — catch up</span>',
    }[status];

    // Per-day progress line: this day's scheduled lessons, done vs owed.
    const fill = real.length ? schedDoneN / real.length : (act.sealed ? 1 : 0);
    // Where you stand in each course featured today: "Lin Algebra 6/51".
    const courseStand = [...new Set(real.map(it => it.cid))].map(cid => {
      const c = D.COURSES.find(x => x.id === cid);
      const cs = courseLessonStats(c);
      return "<strong>" + esc(COURSE_SHORT[cid] || c.code) + "</strong> " + cs.done + "/" + cs.total + " lectures done";
    }).join(" · ");
    const progressLine =
      '<div style="margin-top:12px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:baseline; font-size:var(--fs-tiny); color:var(--ink-3); margin-bottom:4px;">' +
      '<span style="letter-spacing:0.14em; text-transform:uppercase; font-weight:600;">Progress this day</span>' +
      '<span class="mono">' + (real.length ? schedDoneN + " of " + real.length + " lessons" : "no scheduled lessons") +
      " · " + act.problems + ' problem' + (act.problems === 1 ? "" : "s") + (act.sealed ? " · sealed ✓" : "") + "</span></div>" +
      '<div class="bar' + (fill === 1 ? "" : " teal") + '"><i style="transform:scaleX(' + fill + ');"></i></div>' +
      (courseStand ? '<div style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:6px;">' + courseStand + "</div>" : "") +
      "</div>";

    const catchUp = (status === "missed" || status === "partial")
      ? '<div class="card feature" style="margin-top:12px; padding:14px 16px;"><strong>' +
        (status === "missed" ? "You missed this day — its lessons are still here." : "You started this day but didn’t finish it.") +
        '</strong><div style="font-size:var(--fs-small); margin-top:2px;">This day’s content never moves. Clear the unticked lessons below and the day turns green — even late. That’s getting back on track.</div></div>'
      : "";

    const briefLabel = status === "missed" ? "This day’s lessons — finish what’s owed"
      : status === "partial" ? "This day’s lessons — finish the rest"
      : status === "upcoming" ? "This day’s lessons · ~5h (theory 2h · build 1.5h · practice 45m · drill 10m · publish 30m)"
      : "Today’s lessons · ~5h (theory 2h · build 1.5h · practice 45m · drill 10m · publish 30m)";

    return '<div class="card"><div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px; flex-wrap:wrap;">' +
      "<h2>" + nice + "</h2>" +
      '<div style="display:flex; gap:6px; align-items:baseline;">' + statusPill + '<span class="pill teal">Day ' + day + " · Week " + w + "</span></div></div>" +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;"><strong style="color:var(--ink);">Focus:</strong> ' + esc(row.focus) + "</p>" +
      progressLine +
      catchUp +
      (gate ? '<div class="card feature" style="margin-top:12px; padding:14px 16px;"><strong>◆ Gate ' + gate.n + " — " + esc(gate.label) + '</strong><div style="font-size:var(--fs-small); margin-top:2px;">' + esc(gate.req) + "</div></div>" : "") +
      '<div style="margin-top:12px;">' +
      '<div style="font-size:var(--fs-tiny); letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-3); font-weight:600; margin-bottom:2px;">' + briefLabel + "</div>" +
      dayLoadHTML(real) +
      (schedRows || brief("Study", "Beyond the scheduled syllabus — project work per the week focus above", "", "#/workshop", "Workshop")) +
      brief("Practice",
        probs.length ? "NeetCode: " + probs.map(p => "<strong>" + esc(p) + "</strong>").join(", ") : "All 150 problems done",
        "45m", "#/course/cs150", "Tracker") +
      brief("Drill", missPool().length ? "<strong>" + missPool().length + "</strong> missed questions in the pool" : "Pool clear — a random drill", "10m", "#/drill", "Drill") +
      brief("Publish", "Turn today’s notes into a public post", "30m", "#/review", "Review") +
      (isSunday ? brief("Sunday", "Seal the week — no shipped artifact = a failed week", "30m", "#/review", "Seal") : "") +
      "</div>" +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:12px;">This calendar is a fixed syllabus: each date owns these exact lessons, forever. Theory rotates Linear Algebra → Calculus → Probability so all three advance together; Build walks the AI spine in order. Click any past or future day to see precisely its material.</p>' +
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
  const EV_LABEL = { lesson: "Lecture", problem: "Problem", exam: "Examination", diagnostic: "Diagnostic", gate: "Gate", week: "Week sealed", lab: "Lab", day: "Day sealed" };
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
    const last = S.settings.lastSync;
    const devs = Object.keys(S.foreignLedgers).length;
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Devices</div><h1>Sync</h1>' +
      '<div class="sub">One record on every device, kept in your own repo.</div></div>' +

      '<div class="card"><div class="vseal">' +
      '<div class="vico ' + (tok ? "ok" : "bad") + '">' + (tok ? "\u2713" : "!") + "</div>" +
      '<div class="vtext"><div class="vhead">' + (tok ? "Connected" : "Not connected") + "</div>" +
      '<div class="muted">' +
      (last ? "Last sync " + esc(last) : "This device has never synced.") +
      (devs ? " \u00b7 " + devs + " other device" + (devs === 1 ? "" : "s") : "") + "</div></div></div>" +
      (tok
        ? '<div class="row-actions">' +
          '<button class="btn" data-act="syncPull">Pull</button>' +
          '<button class="btn" data-act="syncPush">Push</button>' +
          '<button class="btn ghost" data-act="syncForget">Forget token</button></div>' +
          '<div id="syncMsg" class="muted" style="margin-top:10px;"></div>'
        : "") + "</div>" +

      (tok ? "" :
        '<div class="card" style="margin-top:16px;"><h2>Connect</h2>' +
        '<div class="tl" style="margin-top:6px;">' +
        '<div class="tl-row"><span class="tl-date">1</span><span class="tl-what">GitHub \u2192 Settings \u2192 Developer settings \u2192 <strong>Fine-grained tokens</strong> \u2192 Generate.</span></div>' +
        '<div class="tl-row"><span class="tl-date">2</span><span class="tl-what">Repository access: <strong>only</strong> ' + SYNC_REPO + ". Permissions: <strong>Contents \u2192 Read and write</strong>. Nothing else.</span></div>" +
        '<div class="tl-row"><span class="tl-date">3</span><span class="tl-what">Paste it below. It stays in this browser and is sent only to github.com.</span></div>' +
        "</div>" +
        '<div style="margin-top:12px;"><label class="field" for="ghTok">Token</label>' +
        '<input id="ghTok" type="password" placeholder="github_pat_\u2026" autocomplete="off"></div>' +
        '<div style="margin-top:10px;"><button class="btn" data-act="syncConnect">Connect</button></div>' +
        '<p class="note">Anyone with this device can read the token. Scope it to the one repo; Forget it before lending the device.</p></div>') +

      '<div class="card" style="margin-top:16px;"><h2>How merging works</h2><div class="tl" style="margin-top:6px;">' +
      '<div class="tl-row"><span class="tl-date">safe</span><span class="tl-what">Pull merges field by field \u2014 the further-along version of each lecture wins, days and problems union. Working on both devices never costs you work.</span></div>' +
      '<div class="tl-row"><span class="tl-date">record</span><span class="tl-what">Each device keeps its own hash chain. Syncing never re-hashes history, so a head you have already published stays valid.</span></div>' +
      "</div></div></div>";
  };

  // Faculty drives colour, so a subject is recognisable before it is read.
  const FACULTY_CLASS = {
    "Mathematics": "fac-math", "Artificial Intelligence": "fac-ai",
    "Systems": "fac-sys", "Physics": "fac-phys", "Research": "fac-res",
  };
  function facClass(c) {
    if (FACULTY_CLASS[c.faculty]) return FACULTY_CLASS[c.faculty];
    const f = (c.faculty || "").toLowerCase();
    if (f.indexOf("math") >= 0) return "fac-math";
    if (f.indexOf("system") >= 0 || f.indexOf("comput") >= 0 || f.indexOf("algorith") >= 0) return "fac-sys";
    if (f.indexOf("phys") >= 0) return "fac-phys";
    if (f.indexOf("research") >= 0) return "fac-res";
    return "fac-ai";
  }

  // When does each course actually begin? Derived from the schedule itself
  // rather than a hand-maintained phase field, because those drifted apart:
  // AI 200 is scheduled from day one while being labelled a 2027 course.
  let _startCache = null;
  function courseStartDays() {
    if (_startCache) return _startCache;
    const out = {};
    for (let d = 0; d <= 400; d++) {
      const iso = addDaysISO(D.START_DATE, d);
      scheduledFor(iso).forEach(it => {
        if (it.cid && out[it.cid] == null) out[it.cid] = d;
      });
      if (Object.keys(out).length >= D.COURSES.length) break;
    }
    return (_startCache = out);
  }

  V.atlas = function () {
    const PH = [[0, "Foundations"], [1, "The Spine"], [2, "Depth"], [3, "Frontier"]];
    const here = currentPhase();
    const starts = courseStartDays();
    const dToday = daysBetween(D.START_DATE, todayISO());
    const courseNode = c => {
      const m = courseMastery(c), cov = courseCoverage(c);
      const start = starts[c.id];
      const running = start != null && start <= dToday;
      const locked = c.tracker ? false : start == null ? true : !running;
      // A tracker course never appears in the lesson schedule because it has no
      // lessons — it is practised every day through the problem list instead.
      const when = c.tracker ? "daily practice"
        : start == null ? "unscheduled"
        : running ? "running now"
        : "opens week " + (Math.floor(start / 7) + 1);
      return '<a class="atlas-node ' + facClass(c) + (locked ? " locked" : "") + (running ? " now" : "") + '" href="#/course/' + c.id + '">' +
        '<div class="an-code">' + esc(c.code) + "</div>" +
        '<div class="an-title">' + esc(c.title) + "</div>" +
        '<div class="bar grow"><u style="transform:scaleX(' + (cov / 100) + ');"></u><i style="--w:' + (m / 100) + '; transform:scaleX(' + (m / 100) + ');"></i></div>' +
        '<div class="row-split"><span class="an-num mono">' + m + '%</span>' +
        '<span class="an-when' + (running ? " now" : "") + '">' + when + "</span></div></a>";
    };
    const gates = gatePlan();
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Atlas</div><h1>The whole climb</h1>' +
      '<div class="sub">Pale is watched · solid is proven. Tracks run in parallel — the maths and the neural networks both start on day one.</div></div>' +
      PH.map(([n, name]) => {
        const cs = D.COURSES.filter(c => c.phase === n);
        if (!cs.length) return "";
        const g = gates[n];
        return '<div class="atlas-band' + (n === here ? " now" : "") + '">' +
          '<div class="ab-head"><span class="ab-n mono">' + n + "</span>" +
          '<span class="ab-name">' + name + "</span>" +
          (n === here ? '<span class="pill gold">current phase</span>' : "") +
          (g ? '<span class="ab-gate mono">gate ' + g.n + " · " + esc(g.target) + "</span>" : "") + "</div>" +
          '<div class="atlas-row">' + cs.map(courseNode).join("") + "</div></div>";
      }).join("") +
      (CONCEPTS().length
        ? '<div class="card" style="margin-top:16px;"><h2>Linear algebra, as ideas</h2>' +
          '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin:2px 0 10px;">Left depends on nothing · each column needs the one before</p>' +
          conceptGraph("math110") + "</div>"
        : "") +
      "</div>";
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
          '<div class="tl" style="margin-top:10px;">' +
          '<div class="tl-row"><span class="tl-date">trap</span><span class="tl-what">' + esc(c.miss) + "</span></div>" +
          '<div class="tl-row"><span class="tl-date">in AI</span><span class="tl-what">' + esc(c.applies) + "</span></div>" +
          "</div></div>"
        : "") +

      // ---- probes ----
      '<div class="card" style="margin-top:16px;"><h2>Probe</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin:2px 0 10px;">All of them right, once, and this idea enters spaced recall</p>' +
      '<div id="probeMount"><button class="btn" data-act="startProbe" data-cid="' + esc(id) + '">Begin ' + c.probes.length + " question" + (c.probes.length === 1 ? "" : "s") + "</button></div></div>" +

      // ---- where it sits ----
      '<div class="grid cols-2 top" style="margin-top:16px;">' +
      '<div class="card"><h2>Stands on</h2>' +
      ((c.prereq || []).length
        ? '<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">' +
          c.prereq.map(p => { const q = conceptById(p); return q ? '<a class="pill wrapping" href="#/concept/' + p + '">' + esc(q.title) + "</a>" : ""; }).join("") + "</div>"
        : '<p style="font-size:var(--fs-small); color:var(--ink-2);">Nothing — this is bedrock.</p>') +
      (rv ? '<div class="tl" style="margin-top:12px;"><div class="tl-row"><span class="tl-what">Next recall</span>' +
        '<span class="mono" style="font-size:var(--fs-small); color:' + (rv.due <= todayISO() ? "var(--accent)" : "var(--ink-3)") + ';">' + esc(rv.due) + "</span></div></div>" : "") +
      "</div>" +
      '<div class="card"><h2>Taught in</h2><div class="tl" style="margin-top:8px;">' +
      (c.lectures || []).map(k => {
        const L = lessonLabel(k);
        if (typeof L === "string") return "";
        return '<div class="tl-row"><span class="tl-what"><a href="#/lesson/' + L.cid + "/" + L.ui + "/" + L.li + '">' + esc(L.title) + "</a></span></div>";
      }).join("") + "</div></div></div></div>";
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
        ? '<div class="tiles stagger" style="margin-bottom:16px;">' +
          '<div class="card tile"><div class="t-label">Due now</div><div class="t-value"><span data-count="' + due.length + '">' + due.length + "</span></div></div>" +
          '<div class="card tile"><div class="t-label">Scheduled</div><div class="t-value"><span data-count="' + all.length + '">' + all.length + "</span></div></div>" +
          "</div>" + due.slice(0, 8).map(card).join("")
        : '<div class="card"><div class="vseal"><div class="vico ok">✓</div><div class="vtext"><div class="vhead">Nothing due</div>' +
          '<div style="font-size:var(--fs-small); color:var(--ink-2);">' +
          (all.length ? all.length + " lecture" + (all.length === 1 ? "" : "s") + " scheduled ahead." : "Prove a lecture and it enters the rotation.") +
          "</div></div></div></div>") +

      (next.length
        ? '<div class="card" style="margin-top:16px;"><h2>Coming up</h2><div class="tl" style="margin-top:8px;">' +
          next.map(k => {
            const L = lessonLabel(k);
            if (typeof L === "string") return "";
            return '<div class="tl-row"><span class="tl-date">' + esc(S.review[k].due) + "</span>" +
              '<span class="tl-what">' + esc(L.code) + " · " + esc(L.title) + "</span></div>";
          }).join("") + "</div></div>"
        : "") +
      "</div>";
  };

  V.record = function () {
    const v = verifyChain();
    const led = S.ledger;
    const milestones = led.filter(e => ["exam", "diagnostic", "gate", "week", "lab"].indexOf(e.type) >= 0).slice(-14).reverse();
    const counts = {};
    led.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
    const first = led.length ? led[0].ts.slice(0, 10) : "—";
    const last = led.length ? led[led.length - 1].ts.slice(0, 10) : "—";
    const sealedDays = S.studyDays.length;

    const tile = (label, value) =>
      '<div class="card tile"><div class="t-label">' + label + '</div><div class="t-value">' + value + "</div></div>";

    return '<div class="view-enter"><div class="page-head"><div class="kicker">Provenance</div><h1>The Record</h1>' +
      '<div class="sub">Every step, hash-chained in order. Edit one and the rest stop matching.</div>' +
      '<div class="row-actions"><a class="btn ghost" href="#/transcript">Transcript &amp; gates</a>' +
      '<a class="btn ghost" href="#/method">How it works</a></div></div>' +

      // ---- verdict ----
      '<div class="card"><div class="vseal">' +
      '<div class="vico ' + (v.ok ? "ok" : "bad") + '">' + (v.ok ? "✓" : "!") + "</div>" +
      '<div class="vtext"><div class="vhead">' +
      (v.ok ? "Chain intact — " + v.count + " entr" + (v.count === 1 ? "y" : "ies") : "Chain broken at entry " + v.brokenAt) +
      "</div>" +
      '<div style="font-size:var(--fs-small); color:var(--ink-2);">' +
      (led.length ? first + " → " + last : "Nothing recorded yet — the first completed lecture starts the chain.") +
      "</div></div>" +
      '<div style="margin-left:auto; display:flex; gap:8px; flex-wrap:wrap;">' +
      '<button class="btn ghost" data-act="copyHead">Copy head hash</button>' +
      '<button class="btn" data-act="exportRecord">Download record</button></div>' +
      "</div>" +
      (led.length ? '<div class="hash" style="margin-top:12px;"><span style="color:var(--ink-3);">head</span> ' + esc(chainHead()) + "</div>" : "") +
      "</div>" +

      // ---- shape of the record ----
      '<div class="tiles stagger" style="margin-top:16px;">' +
      tile("Entries", '<span data-count="' + led.length + '">' + led.length + "</span>") +
      tile("Days sealed", '<span data-count="' + sealedDays + '">' + sealedDays + "</span>") +
      tile("Examinations", '<span data-count="' + (counts.exam || 0) + '">' + (counts.exam || 0) + "</span>") +
      tile("Lectures", '<span data-count="' + (counts.lesson || 0) + '">' + (counts.lesson || 0) + "</span>") +
      "</div>" +

      // ---- heatmap ----
      '<div class="card" style="margin-top:16px;"><h2>Consistency</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin:2px 0 10px;">One square per day · tap for that day</p>' +
      heatmapHTML(26) +
      '<div class="cal-legend"><span>Quiet</span>' +
      [0, 1, 2, 3, 4].map(l => '<span class="hc l' + l + '" style="display:inline-block;"></span>').join("") +
      "<span>Busy</span></div></div>" +

      // ---- anchors: the part that makes dates mean something ----
      '<div class="card" style="margin-top:16px;"><h2>Public anchors</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:2px;">Timestamps inside this app are self-reported. Publish the head hash somewhere public — a commit, a post — and its date becomes third-party evidence that the record existed then.</p>' +
      (S.anchors.length
        ? '<div class="tl" style="margin-top:10px;">' + S.anchors.slice().reverse().map((a, ri) => {
            const i = S.anchors.length - 1 - ri;
            return '<div class="tl-row"><span class="tl-date">' + esc(a.date) + "</span>" +
              '<span class="tl-what">' + (a.url ? '<a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.where || a.url) + "</a>" : esc(a.where || "—")) +
              '<div class="hash" style="margin-top:4px;">' + esc(a.head) + "</div></span>" +
              '<button class="btn ghost" data-delanchor="' + i + '">Remove</button></div>';
          }).join("") + "</div>"
        : '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:8px;">No anchors yet.</p>') +
      '<div class="grid cols-2" style="margin-top:12px;">' +
      '<div><label class="field" for="anWhere">Where published</label><input id="anWhere" type="text" placeholder="e.g. commit in nexline1/brickford, or an X post"></div>' +
      '<div><label class="field" for="anUrl">Link (optional)</label><input id="anUrl" type="text" placeholder="https://…"></div>' +
      "</div>" +
      '<div style="margin-top:10px;"><button class="btn" data-act="addAnchor">Anchor today\u2019s head</button></div></div>' +

      // ---- milestones ----
      (milestones.length
        ? '<div class="card" style="margin-top:16px;"><h2>Milestones</h2><div class="tl stagger" style="margin-top:8px;">' +
          milestones.map(e => '<div class="tl-row"><span class="tl-date">' + e.ts.slice(0, 10) + "</span>" +
            '<span class="tl-what">' + esc(eventLine(e)) + "</span></div>").join("") +
          "</div></div>"
        : "") +

      // ---- verify someone else's file ----
      '<div class="card" style="margin-top:16px;"><h2>Verify a record file</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:2px;">Anyone can check an exported record here, or re-run the hashes themselves — the file ships the exact bytes that were hashed.</p>' +
      '<div style="margin-top:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">' +
      '<button class="btn ghost" data-act="pickRecord">Choose file…</button>' +
      '<input type="file" id="recFile" accept=".json" style="display:none;">' +
      '<span id="recResult" style="font-size:var(--fs-small); color:var(--ink-2);"></span></div></div>' +

      "</div>";
  };

  V.transcript = function () {
    const counted = D.COURSES.filter(c => !c.elective && c.phase <= currentPhase());
    const overall = counted.length ? Math.round(counted.reduce((a, c) => a + courseMastery(c), 0) / counted.length) : 0;
    const [stEn, stGrade] = standing(overall);
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Official record</div><h1>Transcript &amp; Gates</h1></div>' +
      '<div class="card feature" style="text-align:center; padding:36px;">' +
      '<div style="font-family:var(--font-display); font-weight:600; font-size:1.7rem; color:var(--ink);">Brickford</div>' +
      '<div style="font-size:var(--fs-tiny); letter-spacing:0.16em; text-transform:uppercase; color:var(--ink-3); margin-top:2px;">Academic Record</div>' +
      '<div style="margin:18px auto; width:120px; border-top:1px solid var(--line-strong);"></div>' +
      '<div class="mono" style="font-size:2.4rem; font-weight:600; color:var(--ink);">' + overall + "%</div>" +
      '<div class="pill gold" style="margin-top:6px;">' + stEn + (stGrade !== "—" ? " · Grade " + stGrade : "") + "</div></div>" +
      '<div class="card"><h2>Courses</h2><div class="table-wrap"><table><thead><tr><th>Course</th><th>Title</th><th style="width:34%;">Mastery</th><th>Best exam</th><th>Standing</th></tr></thead><tbody>' +
      D.COURSES.map(c => {
        const m = courseMastery(c);
        const q = c.quiz ? bestQuiz(c.quiz) : null;
        const [sEn] = standing(m);
        return "<tr><td><strong style='color:var(--accent);'>" + esc(c.code) + "</strong></td><td>" + esc(c.title) + "</td>" +
          '<td><div class="bar"><i style="transform:scaleX(' + (m / 100) + ');"></i></div></td>' +
          "<td>" + (q != null ? q + "%" : "—") + "</td><td>" + m + "% · " + sEn + "</td></tr>";
      }).join("") + "</tbody></table></div></div>" +
      '<div class="card"><h2>The five gates</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:2px;">Adaptive: each target counts from the previous gate’s completion. Move fast and the 3-year baseline compresses further.</p>' +
      gatePlan().map(g => {
        const passed = !!g.doneDate;
        const ng = nextGate();
        const isNext = ng && ng.n === g.n;
        const overdue = !passed && daysBetween(todayISO(), g.target) < 0;
        return '<div class="gate ' + (passed ? "passed" : isNext ? "next" : "") + '"><div class="medal">' + (passed ? "✓" : g.n) + "</div>" +
          '<div style="flex:1;"><div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;"><strong style="color:var(--ink);">' + esc(g.label) + " — " + (passed ? "passed " + g.doneDate : "target " + g.target) + "</strong>" +
          (passed ? '<span class="pill good">passed</span>' : overdue ? '<span class="pill crimson">overdue — revise, don’t abandon</span>' : isNext ? '<span class="pill teal">' + Math.max(0, daysBetween(todayISO(), g.target)) + " days left</span>" : "") + "</div>" +
          '<div style="font-size:var(--fs-small); color:var(--ink-2); margin-top:2px;">' + esc(g.req) + "</div>" +
          '<div style="margin-top:8px;"><button class="btn ghost" data-gate="' + g.n + '">' + (passed ? "Unmark" : "Mark passed — honestly") + "</button></div></div></div>";
      }).join("") + "</div></div>";
  };

  V.review = function () {
    const w = weekNumber();
    const logged = S.weeks.some(x => +x.week === w);
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Sunday ritual</div><h1>Weekly Review</h1>' +
      '<div class="sub">One row per week. No shipped artifact = a failed week.</div></div>' +
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
      { startDate: todayISO() > D.START_DATE ? todayISO() : D.START_DATE, durationMin: 300, recur: "FREQ=DAILY" });
    const nextSunday = addDaysISO(todayISO(), (7 - new Date(todayISO() + "T00:00:00").getDay()) % 7 || 7);
    const reviewLink = gcalUrl("Brickford — Weekly Review (seal the week)",
      "No shipped artifact = a failed week. Fill the row before the day ends.",
      { startDate: nextSunday, atTime: "18:00", durationMin: 30, recur: "FREQ=WEEKLY;BYDAY=SU" });

    return '<div class="view-enter"><div class="page-head"><div class="kicker">The rhythm</div><h1>Calendar</h1>' +
      '<div class="sub">Tap any day for its brief.</div></div>' +

      monthGridHTML() +
      dayDetailHTML() +

      '<div class="card"><h2>Daily start time</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:2px;">When the Deep Track block begins — used for every link below.</p>' +
      '<div style="display:flex; gap:10px; align-items:flex-end; margin-top:10px; max-width:260px;">' +
      '<div style="flex:1;"><label class="field">Start time</label><input type="text" id="calStart" value="' + esc(start) + '" placeholder="08:00" inputmode="numeric"></div>' +
      '<button class="btn ghost" data-act="saveCalStart">Save</button></div></div>' +

      '<div class="card feature"><h2>Add the recurring rituals</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">One click each — opens Google Calendar with the event ready to save.</p>' +
      '<div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">' +
      '<a class="btn" href="' + dailyLink + '" target="_blank" rel="noopener">Add Deep Track — daily, ' + esc(start) + "–" + esc(addMinutesClock(start, 300)) + ' ↗</a>' +
      '<a class="btn ghost" href="' + reviewLink + '" target="_blank" rel="noopener">Add Weekly Review — Sundays 18:00 ↗</a>' +
      "</div></div>" +

      '<div class="card"><h2>Add your open gate deadlines</h2>' +
      (openGates.length
        ? '<div style="margin-top:6px;">' + openGates.map(g =>
            '<div class="plan-row"><span class="block">Gate ' + g.n + '</span><span class="what"><strong>' + esc(g.label) + "</strong> — target " + g.target + "</span>" +
            '<a class="btn ghost go" href="' + gcalUrl("Brickford Gate " + g.n + " — " + g.label, g.req, { allDay: true, startDate: g.target }) + '" target="_blank" rel="noopener">Add ↗</a></div>'
          ).join("") + "</div>"
        : '<p style="color:var(--good); margin-top:6px;">All five gates passed — nothing left to schedule.</p>') +
      "</div>" +

      '<div class="card"><h2>Export everything</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">Daily block, weekly review, and every open gate. Import into Google, Apple, or Outlook.</p>' +
      '<div style="margin-top:12px;"><button class="btn" data-act="downloadIcs">Download brickford.ics</button></div></div>' +

      '<div class="card"><h2>This week at a glance</h2><div class="table-wrap"><table><thead><tr><th>Block</th><th>Time</th><th>What</th></tr></thead><tbody>' +
      D.SCHEDULE.map(s => "<tr><td><strong style='color:var(--ink);'>" + esc(s.block) + "</strong></td><td>" + esc(s.time) + "</td><td>" + esc(s.note) + "</td></tr>").join("") +
      "</tbody></table></div></div></div>";
  };

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
            '<div style="margin-top:12px;"><div style="font-size:var(--fs-tiny); letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-3); font-weight:600;">The first five moves</div>' +
            ["List 30 targets from Google Maps + Instagram — name, owner, number", "Record a 60-second Arabic demo of the agent answering on YOUR number", "Send 10 DMs a day for 3 days (script: Library → Earning Offers)", "Close ONE pilot at 50% price with a testimonial + referral clause", "Deliver in ≤2 weeks, publish the case study, raise the price"]
              .map((s, i) => '<div class="plan-row"><span class="block">Move ' + (i + 1) + '</span><span class="what">' + s + "</span></div>").join("") +
            "</div></div>";
        }
        return '<div class="card"><h2>Choose your niche — one industry, one buyer, one offer</h2>' +
          '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">Generalists chase; specialists get referred. Lock one niche and stay locked for at least 10 pitches before judging it.</p>' +
          '<div class="grid cols-2" style="margin-top:14px;">' +
          D.NICHES.map(n =>
            '<div class="card" style="' + (n.pick ? "border-color:var(--accent);" : "") + '">' +
            '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;"><h3>' + esc(n.name) + "</h3>" + (n.pick ? '<span class="pill gold">recommended</span>' : "") + "</div>" +
            '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:2px;">' + esc(n.market) + " · " + esc(n.pricing) + "</p>" +
            '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;">' + esc(n.verdict) + "</p>" +
            '<div style="margin-top:10px;"><button class="btn ' + (n.pick ? "" : "ghost") + '" data-niche="' + n.id + '">Lock this niche</button></div></div>'
          ).join("") + "</div></div>";
      })() +

      '<div class="grid cols-3">' +
      '<div class="card stat"><div class="stat-label">Total collected</div><div class="stat-value">' + Math.round(total) + ' <span class="unit">BHD</span></div></div>' +
      '<div class="card stat"><div class="stat-label">Clients on the books</div><div class="stat-value">' + t.clients.length + ' <span class="unit">/ 2 max</span></div></div>' +
      '<div class="card stat"><div class="stat-label">Entries</div><div class="stat-value">' + t.entries.length + "</div></div></div>" +
      '<div class="card"><h2>The one offer</h2><textarea id="trOffer" placeholder="Write your single productized offer here — niche, deliverable, days, fixed BHD price. See Library → Earning Offers for the three drafts.">' + esc(t.offer) + '</textarea>' +
      '<div style="margin-top:10px;"><button class="btn ghost" data-act="saveOffer">Save offer</button></div></div>' +
      '<div class="grid cols-2">' +
      '<div class="card"><h2>Clients</h2>' +
      (t.clients.length ? '<div class="table-wrap"><table><thead><tr><th>Client</th><th>Project</th><th>Price</th><th></th></tr></thead><tbody>' +
        t.clients.map((c, i) => "<tr><td>" + esc(c.name) + "</td><td>" + esc(c.project) + "</td><td>" + fmtBHD(+c.price || 0) + '</td><td><button class="btn danger" data-delclient="' + i + '" style="padding:4px 10px;">×</button></td></tr>').join("") + "</tbody></table></div>" : '<p style="color:var(--ink-3); font-size:var(--fs-small);">No clients yet — send the 10 messages.</p>') +
      '<div class="grid cols-3" style="margin-top:12px; gap:8px;"><input type="text" id="clName" placeholder="Name"><input type="text" id="clProject" placeholder="Project"><input type="number" id="clPrice" placeholder="BHD"></div>' +
      '<div style="margin-top:8px;"><button class="btn" data-act="addClient">Add client</button></div></div>' +
      '<div class="card"><h2>Revenue ledger</h2>' +
      (t.entries.length ? '<div class="table-wrap"><table><thead><tr><th>Date</th><th>Amount</th><th>Note</th></tr></thead><tbody>' +
        t.entries.slice().reverse().map(e => "<tr><td>" + e.date + "</td><td><strong style='color:var(--accent);'>" + fmtBHD(+e.amount) + "</strong></td><td>" + esc(e.note || "") + "</td></tr>").join("") + "</tbody></table></div>" : '<p style="color:var(--ink-3); font-size:var(--fs-small);">Empty ledger. It will not stay empty.</p>') +
      '<div class="grid cols-2" style="margin-top:12px; gap:8px;"><input type="number" id="enAmount" placeholder="Amount (BHD)" step="0.01"><input type="text" id="enNote" placeholder="Note (client / deliverable)"></div>' +
      '<div style="margin-top:8px;"><button class="btn" data-act="addEntry">Record payment</button></div></div>' +
      "</div></div>";
  };

  V.workshop = function () {
    const labsDone = D.LABS.filter(l => (S.labs[l.id] || {}).done).length;
    const psetTotal = D.PSETS.reduce((a, g) => a + g.items.length, 0);
    const psetDone = D.PSETS.reduce((a, g) => a + g.items.filter(i => S.psets[i.id]).length, 0);
    const pool = missPool();
    const phases = [[0, "Phase 0 — Calibration"], [1, "Phase 1 — Foundations"], [2, "Phase 2 — Depth"], [3, "Phase 3 — Frontier"]];
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The forge</div><h1>Workshop</h1>' +
      '<div class="sub">Labs, problem sets, and a drill built from your own mistakes.</div>' +
      '<div class="row-actions"><a class="btn" href="#/recall">Recall due</a>' +
      '<a class="btn ghost" href="#/drill">Daily drill</a></div></div>' +

      '<div class="grid cols-3">' +
      '<div class="card stat"><div class="stat-label">Labs shipped</div><div class="stat-value">' + labsDone + ' <span class="unit">/ ' + D.LABS.length + "</span></div></div>" +
      '<div class="card stat"><div class="stat-label">Problem sets</div><div class="stat-value">' + psetDone + ' <span class="unit">/ ' + psetTotal + "</span></div></div>" +
      '<div class="card stat"><div class="stat-label">Miss pool</div><div class="stat-value">' + pool.length + ' <span class="unit">questions</span></div></div>' +
      "</div>" +

      '<div class="card" style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">' +
      '<div style="flex:1; min-width:240px;"><h2>Daily drill</h2><p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:2px;">' +
      (pool.length
        ? pool.length + " questions you have personally missed are waiting. Answer one correctly and it leaves the pool."
        : "The pool is clear — the drill draws random questions to keep the blade sharp.") +
      '</p></div><a class="btn" href="#/drill">' + (pool.length ? "Begin drill" : "Random drill") + "</a></div>" +

      phases.map(ph => {
        const labs = D.LABS.filter(l => l.phase === ph[0]);
        if (!labs.length) return "";
        return '<div class="card" style="margin-top:16px;"><h2>' + ph[1] + "</h2>" + labs.map((l, i) => {
          const st = S.labs[l.id] || { done: false, proof: "" };
          return '<div style="padding:12px 0;' + (i < labs.length - 1 ? " border-bottom:1px solid var(--line);" : "") + '">' +
            '<label class="check-row" style="padding:0;"><input type="checkbox" data-lab="' + l.id + '" ' + (st.done ? "checked" : "") + '><span class="checkbox">' + CHECK_SVG + "</span>" +
            '<span class="check-label" style="flex:1;"><strong style="color:var(--ink);">' + esc(l.title) + '</strong> <span class="mono" style="font-size:var(--fs-tiny); color:var(--ink-3);">~' + l.hours + "h</span><br>" + esc(l.req) + "</span></label>" +
            '<input type="text" data-proof="' + l.id + '" placeholder="Proof URL — repo, post, or screenshot" value="' + esc(st.proof || "") + '" style="margin-top:8px;">' +
            "</div>";
        }).join("") + "</div>";
      }).join("") +

      '<h2 style="margin:26px 0 12px;">Problem sets — pen and paper</h2><div class="grid cols-2">' +
      D.PSETS.map(g =>
        '<div class="card"><div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;"><h3>' + esc(g.title) + '</h3><a class="btn ghost" style="padding:4px 10px; flex-shrink:0;" href="' + g.url + '" target="_blank" rel="noopener">Open ↗</a></div>' +
        g.items.map(i =>
          '<label class="check-row"><input type="checkbox" data-pset="' + i.id + '" ' + (S.psets[i.id] ? "checked" : "") + '><span class="checkbox">' + CHECK_SVG + '</span><span class="check-label">' + esc(i.label) + "</span></label>"
        ).join("") + "</div>"
      ).join("") + "</div></div>";
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
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The outside world</div><h1>Outside Courses</h1>' +
      '<div class="sub">Audit free. Pay only when a credential opens a door. Tap a status to cycle.</div></div>' +
      '<div class="card"><div class="table-wrap"><table><thead><tr><th>Provider</th><th>Course</th><th>Fits</th><th>Cost</th><th>Brickford verdict</th><th></th><th>Status</th></tr></thead><tbody>' +
      D.ELECTIVES.map(e => {
        const st = S.electives[e.id];
        return "<tr><td style='white-space:nowrap;'>" + esc(e.provider) + "</td><td><strong style='color:var(--ink);'>" + esc(e.what) + "</strong></td>" +
          "<td style='white-space:nowrap;'>" + (phases[e.phase] || "Any") + "</td><td>" + esc(e.cost) + "</td><td>" + esc(e.verdict) + "</td>" +
          '<td><a class="btn ghost" style="padding:4px 10px;" href="' + e.url + '" target="_blank" rel="noopener">↗</a></td>' +
          '<td><button class="btn ghost" style="padding:2px 6px; border:none;" data-elective="' + e.id + '">' +
          (st === "done" ? '<span class="pill good">done</span>' : st === "planned" ? '<span class="pill teal">planned</span>' : '<span class="pill">—</span>') +
          "</button></td></tr>";
      }).join("") + "</tbody></table></div></div></div>";
  };

  V.guide = function () {
    const row = (n, title, body, href, btn) =>
      '<div class="plan-row"><span class="block">' + n + '</span><span class="what"><strong>' + title + "</strong> — " + body + "</span>" +
      (href ? '<a class="btn ghost go" href="' + href + '">' + btn + "</a>" : "") + "</div>";
    const law = (title, body) =>
      '<div style="padding:10px 0; border-bottom:1px solid var(--line);"><strong style="color:var(--ink);">' + title + "</strong><div style='font-size:var(--fs-small); color:var(--ink-2); margin-top:2px;'>" + body + "</div></div>";
    const mod = (name, when, what, href) =>
      '<a class="card hoverable" href="' + href + '" style="text-decoration:none;"><div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;"><h3>' + name + '</h3><span class="pill teal">' + when + "</span></div>" +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">' + what + "</p></a>";

    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Handbook</div><h1>How to run Brickford</h1>' +
      '<div class="sub">Three loops, seven laws, one map. It works only if you run it.</div></div>' +

      '<div class="card"><h2>The daily loop — 4 to 5 hours, 7 days</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:2px;">Same order every day.</p><div style="margin-top:6px;">' +
      row("1", "Open the Dashboard", "today’s lessons, plus anything owed from earlier days", "#/", "Open") +
      row("2", "Theory · ~2h", "the math rotation — Linear Algebra → Calculus → Probability", null, "") +
      row("3", "Build · ~1.5h", "today’s spine lesson + the two named NeetCode problems", null, "") +
      row("4", "Drill · ~10 min", "the questions you missed, served back until they stick", "#/drill", "Drill") +
      row("5", "Publish · ~30 min", "today’s notes → a post draft", null, "") +
      row("6", "Seal the day", "the streak counts pressed days", "#/", "Mark") +
      "</div></div>" +

      '<div class="card"><h2>The weekly loop — Sunday, 30 minutes</h2><div style="margin-top:6px;">' +
      row("1", "Weekly Review", "what shipped, DSA, posts, revenue. No artifact = a failed week", "#/review", "Review") +
      row("2", "Sit one examination", "one concept exam · ≥85% is Mastered · 40% of course mastery", "#/exams", "Exams") +
      row("3", "Export a backup", "sidebar → Backup. This browser is the only copy", null, "") +
      "</div></div>" +

      '<div class="card"><h2>The monthly loop — gate day</h2><div style="margin-top:6px;">' +
      row("1", "Transcript & Gates", "pass a gate the day it is true — every later target moves earlier", "#/transcript", "Gates") +
      row("2", "Workshop audit", "every done lab needs a proof URL — the list is your CV", "#/workshop", "Labs") +
      "</div></div>" +

      '<h2 style="margin:26px 0 12px;">The seven laws</h2><div class="card">' +
      law("1 · Never just watch", "Close the video, rebuild from memory, compare.") +
      law("2 · The gates are honest or they are nothing", "You grade yourself. Cheat and you cheat only yourself.") +
      law("3 · Ship every week", "A repo, a post, or a delivery. Or the week is failed.") +
      law("4 · The drill is daily", "Ten minutes. The miss pool maps what you don’t know.") +
      law("5 · One niche, capped hours", "≤2h/day, max 2 clients, one niche. It funds the mission.") +
      law("6 · Proof or it didn’t happen", "No proof URL, no credit. Links are the only currency.") +
      law("7 · Back up weekly", "Export every Sunday. Restore anywhere.") +
      "</div>" +

      '<h2 style="margin:26px 0 12px;">The map — what each room is for</h2><div class="grid cols-2">' +
      mod("Dashboard", "daily", "Your generated day plan, streak, pace vs the 3-year baseline, and the resume button.", "#/") +
      mod("Courses", "daily", "12 courses in 4 phases. Follow the plan’s pick — don’t browse; the sequencing is the curriculum.", "#/courses") +
      mod("Workshop", "daily", "Labs (portfolio with proofs), problem sets (pen and paper), and the Daily Drill.", "#/workshop") +
      mod("Exam Hall", "weekly", "Official MIT/Harvard diagnostics with the 3-hour clock, plus 250 auto-graded questions in 7 banks.", "#/exams") +
      mod("Transcript & Gates", "monthly", "Mastery per course, your standing, and the five adaptive gates that decide the timeline.", "#/transcript") +
      mod("Weekly Review", "Sunday", "The sealing ritual. Feeds every chart and every stat tile.", "#/review") +
      mod("Treasury", "selling", "Your locked niche, the five moves, clients (max 2), and the revenue ledger.", "#/treasury") +
      mod("Outside Courses", "planning", "14 vetted external courses with costs and verdicts — take what serves the plan.", "#/electives") +
      mod("Library", "reference", "The founding documents: curriculum, offers, diagnostics, this whole system’s source of truth.", "#/library") +
      "</div>" +

      '<div class="card" style="margin-top:16px;"><h2>Right now — Phase 0, weeks 1–2</h2>' +
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">Four things, then Phase 1 opens: three math diagnostics (≥70%), the coding diagnostic, GitHub/blog/X, and the Treasury’s first five moves.</p>' +
      '<div style="margin-top:12px;"><a class="btn" href="#/exams">Enter the Exam Hall</a></div></div>' +
      "</div>";
  };

  const DOCS = [
    { id: "readme", file: "../README.md", title: "Phase 0 — Calibration Kit", sub: "The Week 1–2 checklist: exams, diagnostics, setup" },
    { id: "curriculum", file: "../phase-1-curriculum.md", title: "Phase 1 — Curriculum (Months 1–6)", sub: "Week-by-week plan + adjustment rules" },
    { id: "coding", file: "../coding-diagnostic.md", title: "Coding Diagnostic", sub: "The no-AI flashcards build + NeetCode 10" },
    { id: "offers", file: "../earning-offers.md", title: "Earning Offers", sub: "Three productized offers, Arabic pitch included" },
    { id: "log", file: "../progress-log.md", title: "Progress Log (file)", sub: "The original markdown log — the Weekly Review here supersedes it" },
  ];
  V.library = function () {
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Knowledge base</div><h1>Library</h1>' +
      '<div class="sub">The founding documents, and every external resource.</div>' +
      '<div class="row-actions"><a class="btn ghost" href="#/guide">The handbook</a>' +
      '<a class="btn ghost" href="#/method">How it works</a></div></div>' +
      '<div class="grid cols-2">' +
      DOCS.map(d => '<a class="card hoverable" href="#/doc/' + d.id + '" style="text-decoration:none;"><h3>' + esc(d.title) + '</h3><p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">' + esc(d.sub) + "</p></a>").join("") +
      '</div><div class="card" style="margin-top:16px;"><h2>External halls</h2><div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">' +
      [["Karpathy — Zero to Hero", "https://karpathy.ai/zero-to-hero.html"], ["nanoGPT", "https://github.com/karpathy/nanoGPT"], ["fast.ai", "https://course.fast.ai/"], ["NeetCode", "https://neetcode.io/roadmap"], ["MIT OpenCourseWare", "https://ocw.mit.edu/"], ["Stat 110", "https://stat110.hsites.harvard.edu/"], ["Mathematics for ML (book)", "https://mml-book.github.io/"], ["Understanding Deep Learning (book)", "https://udlbook.github.io/udlbook/"], ["ARENA curriculum", "https://www.arena.education/"], ["3Blue1Brown", "https://www.3blue1brown.com/"]]
        .map(r => '<a class="btn ghost" href="' + r[1] + '" target="_blank" rel="noopener">' + r[0] + " ↗</a>").join("") +
      "</div></div></div>";
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
          if (!S.studyDays.includes(todayISO())) { S.studyDays.push(todayISO()); logEvent("day", todayISO(), {}); }
          save(); render();
          toast("Counted. The chain grows.");
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
        if (cb.checked) toast("Lab shipped. Paste the proof URL below it.");
      };
    });
    $$("[data-proof]", root).forEach(inp => {
      inp.onchange = () => {
        const st = S.labs[inp.dataset.proof] || { done: false, proof: "" };
        st.proof = inp.value.trim();
        S.labs[inp.dataset.proof] = st; save();
        toast("Proof recorded.");
      };
    });
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

  function render() {
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
    else if (r === "/workshop") html = V.workshop();
    else if (r === "/drill") html = V.drill();
    else if (r === "/electives") html = V.electives();
    else if (r === "/guide") html = V.guide();
    else if (r === "/calendar") html = V.calendar();
    else if (r === "/library") html = V.library();
    else if (seg[0] === "doc") html = V.doc(seg[1]);
    else html = V.dashboard();
    view.innerHTML = html;
    renderMath(view);
    stackTables(view);
    animateCounts(view);
    wire(view, r);
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
    $("#menuBtn").onclick = () => $("#sidebar").classList.toggle("open");
    window.addEventListener("hashchange", render);
    render();
    // Pull once on open so a device that has been away is current before the
    // first tap, and push anything still pending when the tab goes away.
    if (ghToken()) runSync("pull");
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") runSync("push"); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
