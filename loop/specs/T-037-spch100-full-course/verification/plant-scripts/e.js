// Plant (e): put back the SPCH check options as they were before fix 2 (commit 97d2e13 —
// every lesson of fix 1 already installed, the distractors not yet rewritten), leaving
// every other byte of platform/data/storytelling.js as it is. The new verify-content
// assertion must fail on them: at that commit the answer was the unique longest option
// in 442 of 513 checks.
const fs = require("fs"), vm = require("vm"), cp = require("child_process");
const F = "platform/data/storytelling.js";
const load = s => { const c = {}; c.window = c; c.DAR = { COURSES: [], DRILLS: {}, SUMMARIES: {} }; vm.createContext(c); vm.runInContext(s, c); return c.DAR; };
const old = load(cp.execSync("git show 97d2e13:" + F).toString());
let src = fs.readFileSync(F, "utf8");
const re = /\{ q: "(?:[^"\\]|\\.)*", opts: (\[(?:[^\]"]|"(?:[^"\\]|\\.)*")*\]), a: (\d+),/g;
let n = 0;
Object.keys(old.SUMMARIES).filter(k => k.startsWith("spch100.")).forEach(k => {
  const start = src.indexOf('  "' + k + '": {\n    takeaway:'); if (start < 0) return;
  const end = src.indexOf("\n  },\n", start);
  let blk = src.slice(start, end), j = 0, m, out = "", last = 0; re.lastIndex = 0;
  while ((m = re.exec(blk))) {
    const o = old.SUMMARIES[k].checks[j++]; if (!o) break;
    const s0 = m.index + m[0].indexOf(m[1]);
    const rep = "[" + o.opts.map(x => JSON.stringify(x)).join(", ") + "]";
    if (rep !== m[1]) n++;
    out += blk.slice(last, s0) + rep; last = s0 + m[1].length;
  }
  out += blk.slice(last);
  src = src.slice(0, start) + out + src.slice(end);
});
fs.writeFileSync(F, src);
console.log("restored the pre-fix options of " + n + " SPCH checks");
