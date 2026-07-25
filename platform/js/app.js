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
    let total = 0, done = 0;
    (c.units || []).forEach((u, ui) => u.lessons.forEach((_, li) => {
      total++;
      if ((S.lessons[lessonKey(c.id, ui, li)] || {}).done) done++;
    }));
    return { total, done };
  }
  function courseMastery(c) {
    if (c.tracker) {
      const p = dsaCount() / 150;
      const q = bestQuiz(c.quiz);
      return Math.round((q == null ? p : p * 0.6 + (q / 100) * 0.4) * 100);
    }
    const { total, done } = courseLessonStats(c);
    const lr = total ? done / total : 0;
    const q = c.quiz ? bestQuiz(c.quiz) : null;
    return Math.round((q == null ? lr : lr * 0.6 + (q / 100) * 0.4) * 100);
  }
  function standing(pct) {
    return pct >= 85 ? ["Mastered", "A"] : pct >= 70 ? ["Proficient", "B"] :
           pct >= 50 ? ["Developing", "C"] : pct > 0 ? ["Started", "D"] : ["Not begun", "—"];
  }
  function currentFocus() {
    const w = weekNumber();
    const row = D.WEEK_PLAN.find(r => w >= r.from && w <= r.to);
    const last = D.WEEK_PLAN[D.WEEK_PLAN.length - 1];
    return { week: w, focus: row ? row.focus : last.focus };
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
    return '<div class="plan-row"><span class="block">' + it.track + '</span><span class="what">' +
      (dn ? '<span style="color:var(--good); font-weight:700;">✓</span> ' : "") +
      "<strong>" + esc(it.code) + "</strong> — " + esc(it.l.t) + meta + "</span>" +
      '<a class="btn ghost go" href="#/lesson/' + it.cid + "/" + it.ui + "/" + it.li + '">' + (dn ? "Review" : "Open") + "</a></div>";
  }
  // Unfinished scheduled lessons from days already past (multi-day lessons
  // count once — via a set of lesson keys).
  function backlogCount() {
    const today = todayISO();
    const owed = new Set();
    for (let iso = D.START_DATE; iso < today; iso = addDaysISO(iso, 1))
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
    const backlog = backlogCount();
    const probs = nextProblems(2);
    const drift = planDrift();

    return '<div class="view-enter">' +
      '<div class="page-head"><div class="kicker">' + esc(D.IDENTITY.est) + '</div>' +
      '<h1>' + greet + ' — <span class="mono" style="color:var(--accent);">Day ' + String(day).padStart(3, "0") + '</span> of the climb</h1>' +
      '<div class="sub">Week ' + f.week + ' · ' + esc(f.focus) + "</div></div>" +

      (S.settings.lastLesson
        ? '<div class="card" style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">' +
          '<div><div style="font-size:var(--fs-tiny); letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-3); font-weight:600;">Continue where you left off</div>' +
          '<div style="color:var(--ink); font-weight:600; margin-top:2px;">' + esc(S.settings.lastLesson.label) + "</div></div>" +
          '<a class="btn" href="#/lesson/' + S.settings.lastLesson.cid + "/" + S.settings.lastLesson.ui + "/" + S.settings.lastLesson.li + '">Resume ▸</a></div>'
        : "") +

      (backupAge === null || backupAge > 14
        ? '<div class="card" style="border-color:var(--line-strong); display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;"><span style="font-size:var(--fs-small); color:var(--ink-2);">' +
          (backupAge === null ? "No backup has ever been taken. Your progress lives in this browser — export a backup file now." : "Last backup was " + backupAge + " days ago.") +
          '</span><button class="btn" data-act="backup">Export backup</button></div>'
        : "") +

      '<div class="grid cols-4" style="margin-top:16px;">' +
      '<div class="card stat"><div class="stat-label">Streak</div><div class="stat-value">' + st + ' <span class="unit">days</span></div><div class="stat-sub">' + (studiedToday ? "Today is counted." : "Today not yet marked.") + "</div></div>" +
      '<div class="card stat"><div class="stat-label">DSA solved</div><div class="stat-value">' + dsaCount() + ' <span class="unit">/ 150</span></div><div class="stat-sub">Month-6 gate target</div></div>' +
      '<div class="card stat"><div class="stat-label">Posts published</div><div class="stat-value">' + postsTotal() + '</div><div class="stat-sub">Become undeniable in public</div></div>' +
      '<div class="card stat"><div class="stat-label">Treasury</div><div class="stat-value">' + Math.round(revenueTotal()) + ' <span class="unit">BHD</span></div><div class="stat-sub">Earning track, ≤2h/day</div></div>' +
      "</div>" +

      '<div class="grid cols-2" style="margin-top:16px;">' +
      '<div class="card"><h2>Today’s plan</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:2px;">Today’s slot in the fixed syllabus — see the Calendar for the whole map.</p>' +
      dayLoadHTML(todaySched.filter(it => !it.pseudo)) +
      (backlog > 0
        ? '<div class="plan-row" style="border-left:2px solid var(--bad); padding-left:10px;"><span class="block" style="color:var(--bad); background:color-mix(in srgb, var(--bad) 10%, transparent);">Owed</span><span class="what"><strong>' + backlog + "</strong> unfinished lesson" + (backlog === 1 ? "" : "s") + ' from earlier days — clear them first</span><a class="btn ghost go" href="#/calendar">Calendar</a></div>'
        : "") +
      '<div style="margin-top:6px;">' +
      todaySched.map(schedRowHTML).join("") +
      (todaySched.length ? "" : '<div class="plan-row"><span class="block">Study</span><span class="what">Before Day 1 — calibration and setup</span><a class="btn ghost go" href="#/guide">Handbook</a></div>') +
      '<div class="plan-row"><span class="block">Practice</span><span class="what">' +
      (probs.length ? "NeetCode next: " + probs.map(p => "<strong>" + esc(p) + "</strong>").join(", ") : "All 150 problems done.") +
      '</span><a class="btn ghost go" href="#/course/cs150">Tracker</a></div>' +
      '<div class="plan-row"><span class="block">Drill</span><span class="what">' +
      (missPool().length ? "<strong>" + missPool().length + "</strong> missed questions waiting in the pool" : "Pool clear — a random drill keeps the blade sharp") +
      '</span><a class="btn ghost go" href="#/drill">Drill</a></div>' +
      '<div class="plan-row"><span class="block">Publish</span><span class="what">Turn today’s notes into public output — the weekly post is non-negotiable.</span><a class="btn ghost go" href="#/review">Review</a></div>' +
      "</div>" +
      '<div style="margin-top:14px;">' + (studiedToday
        ? '<span class="pill good">✓ Deep Track marked for today</span>'
        : '<button class="btn" data-act="studied">Mark today’s Deep Track done</button>') + "</div></div>" +

      '<div class="card feature"><h2>Next gate' + (g ? " — " + esc(g.label) : "") + "</h2>" +
      (g
        ? '<div class="mono" style="margin:8px 0 4px; font-size:1.7rem; color:var(--accent);">' + Math.max(0, daysBetween(todayISO(), g.target)) + " days remain</div>" +
          '<p style="font-size:var(--fs-small); color:var(--ink-2);">' + esc(g.req) + "</p>" +
          '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:6px;">Target ' + g.target + ' · adaptive — pass early and every later gate moves earlier · <a href="#/transcript">Transcript &amp; Gates</a></p>' +
          '<p style="font-size:var(--fs-tiny); margin-top:2px; color:var(--ink-3);">Projected finish ' + drift.projected +
          (drift.aheadDays > 0 ? ' · <span style="color:var(--good);">' + drift.aheadDays + " days ahead of the 3-year baseline</span>"
            : drift.aheadDays < 0 ? ' · <span style="color:var(--bad);">' + (-drift.aheadDays) + " days behind the 3-year baseline</span>"
            : " · on baseline") + "</p>"
        : '<p style="color:var(--good);">All five gates passed. You are what you set out to become.</p>') +
      "</div></div>" +

      '<div class="grid cols-2" style="margin-top:16px;">' +
      '<div class="card"><h2>DSA problems over time</h2>' + lineChart(weeksArr.map(w => +w.dsa || 0), weeksArr.map(w => "Week " + w.week)) + "</div>" +
      '<div class="card"><h2>Revenue by week</h2>' + barChart(weeksArr.map(w => +w.revenue || 0), weeksArr.map(w => "Week " + w.week)) + "</div>" +
      "</div></div>";
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
      return '<a href="#/course/' + c.id + '" class="card hoverable course-card ' + c.color + (locked ? " locked" : "") + '" style="text-decoration:none;"><div class="edge"></div>' +
        '<div style="display:flex; justify-content:space-between; align-items:baseline;"><span class="code">' + esc(c.code) + "</span>" +
        (locked ? '<span class="pill">Unlocks in Phase ' + c.phase + "</span>" : '<span class="pill gold">' + m + "% mastery</span>") + "</div>" +
        "<h3>" + esc(c.title) + "</h3>" +
        '<div class="desc">' + esc(c.desc) + "</div>" +
        '<div style="margin-top:14px;"><div class="bar"><i style="transform:scaleX(' + (m / 100) + ');"></i></div>' +
        '<div style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:5px;">' + ls.done + " / " + ls.total + (c.tracker ? " problems" : " lessons") + "</div></div></a>";
    };
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Registrar</div><h1>Course Catalog</h1>' +
      '<div class="sub">' + D.COURSES.length + ' courses across four phases. Free, world-class, permanent. Mastery = lessons completed (60%) + best examination (40%). Locked phases open as the plan advances — or as you pass gates early.</div></div>' +
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
        ? '<p style="font-size:var(--fs-small); margin-top:6px;">Sit the checkpoint to see exactly where you stand on ' + esc(c.code) + " — 15 questions drawn fresh from the bank, graded instantly with your verdict and the exact questions you missed.</p>" +
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
    return '<div class="view-enter"><div class="page-head"><div class="kicker">' + esc(c.code) + " · " + esc(c.faculty) + "</div><h1>" + esc(c.title) + "</h1>" +
      '<div class="sub">' + esc(c.desc) + "</div>" +
      '<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">' +
      c.external.map(e => '<a class="btn ghost" href="' + e.url + '" target="_blank" rel="noopener">' + esc(e.label) + " ↗</a>").join("") +
      '<a class="btn" href="#/quiz/' + c.quiz + '">Sit the concept examination</a></div>' +
      '<div style="margin-top:14px; max-width:420px;"><div class="bar teal"><i style="transform:scaleX(' + (dsaCount() / 150) + ');"></i></div>' +
      '<div style="font-size:var(--fs-small); color:var(--ink-2); margin-top:6px;"><strong style="color:var(--ink);">' + dsaCount() + " / 150</strong> — the Month-6 gate number</div></div></div>" +
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
      '<div class="grid cols-2" style="margin-top:16px;">' +
      '<div class="card"><h2>Rebuild-from-memory ritual</h2>' +
      objectives.map((o, i) =>
        '<label class="check-row"><input type="checkbox" data-check="' + i + '" ' + (st.checks[i] ? "checked" : "") + '><span class="checkbox">' + CHECK_SVG + '</span><span class="check-label">' + esc(o) + "</span></label>"
      ).join("") +
      '<div style="margin-top:14px;">' +
      '<button class="btn ' + (st.done ? "ghost" : "") + '" data-act="toggleDone">' + (st.done ? "✓ Completed — unmark" : "Mark lecture complete") + "</button></div></div>" +
      '<div class="card"><h2>Notes</h2><textarea id="lessonNotes" placeholder="What did you learn? What broke your brain? Write it — this becomes your weekly post.">' + esc(st.notes) + '</textarea>' +
      '<div style="margin-top:10px;"><button class="btn ghost" data-act="saveNotes">Save notes</button></div></div></div>' +
      '<div style="display:flex; justify-content:space-between; margin-top:16px;">' +
      (prev ? '<a class="btn ghost" href="' + prev + '">← Previous</a>' : "<span></span>") +
      (next ? '<a class="btn" href="' + next + '">Next lecture →</a>' : '<a class="btn" href="#/course/' + cid + '">Course complete view</a>') +
      "</div></div>";
  };

  V.exams = function () {
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Examinations</div><h1>Exam Hall</h1>' +
      '<div class="sub">Two tiers. Official diagnostics decide the shape of Phase 1 (≥70% gate). Concept examinations are auto-graded, drawn fresh from question banks each sitting.</div></div>' +
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
        return '<div class="card hoverable"><div style="display:flex; justify-content:space-between; align-items:baseline;"><span class="pill gold">' + esc(b.course) + "</span>" +
          (best != null ? '<span class="pill ' + (best >= 70 ? "good" : "") + '">best ' + best + "%</span>" : '<span class="pill">unattempted</span>') + "</div>" +
          "<h3 style='margin-top:6px;'>" + esc(b.title) + "</h3>" +
          '<p style="font-size:var(--fs-small); color:var(--ink-2);">' + b.questions.length + " questions in the bank · " + (b.perSitting || 15) + " per sitting · " + at.length + " attempt" + (at.length === 1 ? "" : "s") + "</p>" +
          '<div style="margin-top:12px;"><a class="btn" href="#/quiz/' + id + '">Begin sitting</a></div></div>';
      }).join("") + "</div></div>";
  };

  V.quiz = function (bankId) {
    const bank = D.QUIZZES[bankId];
    if (!bank) return "<p>Unknown examination.</p>";
    setTimeout(() => {
      DAR.Quiz.mount($("#quizMount"), bank, {
        onFinish(res) {
          (S.quizAttempts[bankId] = S.quizAttempts[bankId] || []).push({ date: todayISO(), score: res.score, total: res.total, pct: res.pct });
          updateMisses(bankId, res.missed, res.correct);
          save();
          toast("Recorded: " + res.pct + "% in the register.");
        },
        onExit() { location.hash = "#/exams"; },
      });
    }, 0);
    return '<div class="view-enter"><div class="page-head"><div class="kicker">Exam Hall</div><h1>' + esc(bank.title) + '</h1></div><div id="quizMount"></div></div>';
  };

  let timerH = null;
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
      '<div class="sub">One row per week, no exceptions. A week with no shipped artifact is a failed week — regardless of hours “studied”. The chain must not break.</div></div>' +
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
      '<div class="sub">Your month at a glance — click any day for its brief and jump straight into the lesson. Below: one-click Google Calendar links (no sign-in, no API key) and a full export.</div></div>' +

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
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">One <code>.ics</code> file with the daily block, the weekly review, and every open gate deadline. In Google Calendar: Settings → Import &amp; export → Import. Works the same in Apple Calendar and Outlook.</p>' +
      '<div style="margin-top:12px;"><button class="btn" data-act="downloadIcs">Download brickford.ics</button></div></div>' +

      '<div class="card"><h2>This week at a glance</h2><div class="table-wrap"><table><thead><tr><th>Block</th><th>Time</th><th>What</th></tr></thead><tbody>' +
      D.SCHEDULE.map(s => "<tr><td><strong style='color:var(--ink);'>" + esc(s.block) + "</strong></td><td>" + esc(s.time) + "</td><td>" + esc(s.note) + "</td></tr>").join("") +
      "</tbody></table></div></div></div>";
  };

  V.treasury = function () {
    const t = S.treasury;
    const total = revenueTotal();
    return '<div class="view-enter"><div class="page-head"><div class="kicker">The Earning Track</div><h1>Treasury</h1>' +
      '<div class="sub">≤ 2 hours per day, maximum 2 clients, fixed scope and price. This funds the mission — it never becomes the mission. Raise prices ~20% after every 2 completed projects.</div></div>' +
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
      '<div class="sub">Watching is not knowing. Labs with acceptance criteria, problem sets on paper, and a daily drill built from your own mistakes. Proof or it didn’t happen.</div></div>' +

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
      let pool = missPool().sort(() => Math.random() - 0.5).slice(0, 10);
      if (pool.length < 5) {
        const have = new Set(pool.map(p => p.bankId + "|" + p.idx));
        const all = Object.keys(D.QUIZZES).flatMap(b => D.QUIZZES[b].questions.map((_, i) => ({ bankId: b, idx: i })));
        all.sort(() => Math.random() - 0.5);
        for (const p of all) {
          if (pool.length >= 10) break;
          const k = p.bankId + "|" + p.idx;
          if (!have.has(k)) { have.add(k); pool.push(p); }
        }
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
      '<div class="sub">Other people’s universities — audit free, take what serves the plan, pay only when a credential unlocks a door. Click a status to cycle: untracked → planned → done.</div></div>' +
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
      '<div class="sub">This platform is an operating system, not a library. It works only if you run the loops. Three loops, seven laws, and a map of every room.</div></div>' +

      '<div class="card"><h2>The daily loop — 4 to 5 hours, 7 days</h2>' +
      '<p style="font-size:var(--fs-tiny); color:var(--ink-3); margin-top:2px;">Same order every day. The calendar is a fixed syllabus — each date owns its lessons; the Dashboard shows today’s slot.</p><div style="margin-top:6px;">' +
      row("1", "Open the Dashboard", "today’s scheduled lessons are listed, plus an Owed row if earlier days have unfinished lessons — clear those first", "#/", "Open") +
      row("2", "Theory · ~2h", "today’s math lessons (the rotation: Linear Algebra → Calculus → Probability). The 2h block packs by real video length — 4–6 short 3Blue1Brown chapters, or one full MIT lecture. Work past today’s quota and tomorrow automatically advances", null, "") +
      row("3", "Build · ~1.5h", "today’s spine lesson (a Karpathy lesson spans ~5 days — “day 2 of 5” means keep rebuilding it) plus the two named NeetCode problems", null, "") +
      row("4", "Drill · ~10 min", "the Daily Drill serves questions YOU missed. Answer right, they leave; answer wrong, they stay. This is where knowledge becomes permanent", "#/drill", "Drill") +
      row("5", "Publish · ~30 min", "turn today’s lesson notes into a post draft. Notes live under every lecture — write them as future posts", null, "") +
      row("6", "Seal the day", "press “Mark today’s Deep Track done”. The streak only counts pressed days", "#/", "Mark") +
      "</div></div>" +

      '<div class="card"><h2>The weekly loop — Sunday, 30 minutes</h2><div style="margin-top:6px;">' +
      row("1", "Weekly Review", "fill the row: what shipped, DSA count, posts, revenue. No artifact = the week is sealed as FAILED, visibly. That pressure is the feature", "#/review", "Review") +
      row("2", "Sit one examination", "one concept exam in the Hall (aim ≥85% = Mastered) — it feeds course mastery 40%", "#/exams", "Exams") +
      row("3", "Export a backup", "sidebar → Backup. Your progress lives in this browser; the file is your insurance and your device-sync tool", null, "") +
      "</div></div>" +

      '<div class="card"><h2>The monthly loop — gate day</h2><div style="margin-top:6px;">' +
      row("1", "Transcript & Gates", "check the next gate’s requirements against reality. Pass it the day it’s true — every later gate immediately moves earlier. The 3-year plan compresses only through this page", "#/transcript", "Gates") +
      row("2", "Workshop audit", "labs are your portfolio. Each done lab needs a proof URL — that list IS your CV until an employer replaces it", "#/workshop", "Labs") +
      "</div></div>" +

      '<h2 style="margin:26px 0 12px;">The seven laws</h2><div class="card">' +
      law("1 · Never just watch", "Every lecture ends with the rebuild ritual: close the video, reproduce the code or derivation from memory, compare. Watching feels like learning; rebuilding is learning.") +
      law("2 · The gates are honest or they are nothing", "You grade your own exams and mark your own gates. Cheat here and you cheat only the person the whole platform exists for.") +
      law("3 · Ship every week", "A shipped artifact — repo, post, delivery — or the week is failed. Public output is how a self-taught engineer becomes undeniable.") +
      law("4 · The drill is daily", "Ten minutes. Your miss pool is a map of exactly what you don’t know; drain it daily and exams stop being scary.") +
      law("5 · One niche, capped hours", "Treasury work stays ≤2h/day, max 2 clients, one locked niche, ten pitches before judging. It funds the mission; it never becomes it.") +
      law("6 · Proof or it didn’t happen", "Labs without proof URLs don’t count. Links to real repos and posts are the only currency that converts to jobs.") +
      law("7 · Back up weekly", "Progress lives in the browser. Export every Sunday; restore on your phone to carry the university in your pocket.") +
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
      '<p style="font-size:var(--fs-small); color:var(--ink-2); margin-top:4px;">Before the loops begin at full speed, calibrate: sit the three math diagnostics in the Exam Hall (≥70% or a gap-block activates), do the coding diagnostic (flashcards lab, no AI), set up GitHub/blog/X, and run the niche’s first five moves in the Treasury. When all four are done, Phase 1 starts and the Dashboard takes over.</p>' +
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
      '<div class="sub">The founding documents of your ascent, and every external resource. The roadmap is law; revise it deliberately, never abandon it.</div></div>' +
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
          if (!S.studyDays.includes(todayISO())) S.studyDays.push(todayISO());
          save(); render();
          toast("Counted. The chain grows.");
        } else if (act === "backup") {
          exportBackup();
        } else if (act === "toggleDone" || act === "saveNotes") {
          const m = location.hash.match(/#\/lesson\/([^/]+)\/(\d+)\/(\d+)/);
          if (!m) return;
          const k = lessonKey(m[1], +m[2], +m[3]);
          const st = S.lessons[k] || { done: false, notes: "", checks: [] };
          if (act === "toggleDone") { st.done = !st.done; if (st.done) st.doneAt = todayISO(); else delete st.doneAt; }
          st.notes = $("#lessonNotes") ? $("#lessonNotes").value : st.notes;
          S.lessons[k] = st; save();
          if (act === "toggleDone") { render(); toast(st.done ? "Lecture marked complete." : "Unmarked."); }
          else toast("Notes preserved.");
        } else if (act === "saveDiag") {
          const m = location.hash.match(/#\/diag\/(.+)/);
          const v = parseFloat($("#diagScore").value);
          if (!isFinite(v)) { toast("Enter the honest number."); return; }
          S.diag[m[1]] = { score: Math.round(v), date: todayISO() }; save(); render();
          toast(v >= 70 ? "Verified. Full speed." : "Recorded. The gap block begins — truth over comfort.");
        } else if (act === "saveDiagDone") {
          const m = location.hash.match(/#\/diag\/(.+)/);
          S.diag[m[1]] = { score: null, date: todayISO() }; save(); render(); toast("Diagnostic marked complete.");
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
        S.lessons[k] = st; save();
      };
    });
    // problem tracker
    $$("[data-prob]", root).forEach(cb => {
      cb.onchange = () => {
        S.problems[cb.dataset.prob] = cb.checked ? todayISO() : false; save();
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
    // gates
    $$("[data-gate]", root).forEach(b => {
      b.onclick = () => {
        const n = +b.dataset.gate;
        S.gates[n] = S.gates[n] ? false : todayISO();
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
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
