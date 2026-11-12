// export-data.js — platform/data/*.js as JSON for the Flutter app (T-064).
//
//   node tools/export-data.js          write app/assets/data/*.json
//   node tools/export-data.js --check  exit 1 if any file there differs (tools/verify-app.js runs this)
//
// The data files are loaded in a VM exactly as tools/verify-content.js loads
// them, and in the order platform/index.html loads them (read from its script
// tags, so the two cannot drift: storytelling.js pushes its courses onto
// DAR.COURSES, and order is what decides where they land). Nothing here is
// copied by hand and nothing is reshaped beyond splitting DAR into files: the
// Flutter engine reads the same COURSES array the web engine walks, so a lesson
// key means the same lecture on both. Output is deterministic (insertion-order
// keys, fixed indent, trailing newline), so --check is a byte comparison.
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "app/assets/data");

// The data scripts platform/index.html loads, in its order.
function dataScripts(root) {
  const html = fs.readFileSync(path.join(root, "platform/index.html"), "utf8");
  return [...html.matchAll(/<script[^>]*\ssrc="(data\/[^"?]+\.js)(?:\?[^"]*)?"/g)].map(m => "platform/" + m[1]);
}

function loadDAR(root) {
  const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
  const files = dataScripts(root);
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f }));
  return { D: ctx.DAR, files };
}

// JSON.stringify drops functions and undefined without a word; the export must
// not lose anything the app could need, so it refuses instead.
function assertPlain(v, where) {
  if (typeof v === "function" || v === undefined) throw new Error("export-data: " + where + " is not JSON data (" + typeof v + ")");
  if (typeof v === "number" && !Number.isFinite(v)) throw new Error("export-data: " + where + " is " + v);
  if (v && typeof v === "object") for (const k of Object.keys(v)) assertPlain(v[k], where + "." + k);
}
const json = (v, where) => { assertPlain(v, where); return JSON.stringify(v, null, 1) + "\n"; };

function build(root) {
  const { D, files } = loadDAR(root || ROOT);
  const SPEECH = D.COURSES.filter(c => c.faculty === "Speech").map(c => c.id);
  const lessons = [];
  D.COURSES.forEach(c => (c.units || []).forEach((u, ui) => u.lessons.forEach((l, li) =>
    lessons.push(Object.assign({ k: c.id + "." + ui + "." + li, cid: c.id, ui, li, code: c.code }, l)))));
  const out = {
    "meta.json": { START_DATE: D.START_DATE, IDENTITY: D.IDENTITY, sources: files },
    "courses.json": D.COURSES,
    "lessons.json": lessons,
    "summaries.json": D.SUMMARIES || {},
    // The quiz gate's one question at startup, "does lecture k have a quiz?",
    // without the 1.9 MB of summaries (the app reads those when a lecture
    // opens). app.js lessonQuiz's own test: sm && sm.checks && sm.checks.length.
    "quiz-keys.json": Object.keys(D.SUMMARIES || {}).filter(k => { const sm = D.SUMMARIES[k]; return !!(sm && sm.checks && sm.checks.length); }),
    "quizzes.json": D.QUIZZES || {},
    "workshop.json": { PSETS: D.PSETS || [], LABS: D.LABS || [], NICHES: D.NICHES || [], ELECTIVES: D.ELECTIVES || [] },
    "gates.json": { GATES: D.GATES, DIAGNOSTICS: D.DIAGNOSTICS, WEEK_PLAN: D.WEEK_PLAN },
    "storytelling.json": { courses: SPEECH, DRILLS: D.DRILLS || {} },
    // T-067: DAR.PREREQ, the prerequisite map Plan v2 is scheduled from.
    "prereq.json": D.PREREQ || {},
    // T-067 step 3: DAR.PRACTICE, the practice items under each lecture's quiz (platform/data/practice-*.js).
    "practice.json": D.PRACTICE || {},
  };
  const text = {};
  for (const [name, v] of Object.entries(out)) text[name] = json(v, name);
  return text;
}

// The files in `dir` that are missing or differ from a fresh export.
function stale(dir, root) {
  const want = build(root);
  const bad = [];
  for (const [name, body] of Object.entries(want)) {
    const p = path.join(dir || OUT, name);
    if (!fs.existsSync(p)) bad.push(name + " (missing)");
    else if (fs.readFileSync(p, "utf8") !== body) bad.push(name);
  }
  return bad;
}

module.exports = { build, stale, dataScripts, OUT };

if (require.main === module) {
  if (process.argv.includes("--check")) {
    const bad = stale();
    if (bad.length) { console.log("export-data: STALE " + bad.join(", ") + " — run node tools/export-data.js"); process.exit(1); }
    console.log("export-data: app/assets/data is fresh against platform/data");
  } else {
    fs.mkdirSync(OUT, { recursive: true });
    const text = build();
    for (const [name, body] of Object.entries(text)) fs.writeFileSync(path.join(OUT, name), body);
    console.log("export-data: wrote " + Object.keys(text).map(n => n + " " + Math.round(text[n].length / 1024) + " KB").join(", "));
  }
}
