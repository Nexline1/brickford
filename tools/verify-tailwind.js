// verify-tailwind.js — the committed CSS is what the sources build.
//
// GitHub Pages serves platform/css/tailwind.css exactly as committed; there is
// no CI step that builds it. So the one way it goes wrong is quietly: someone
// edits tailwind.config.js, platform/css/tailwind.input.css, or adds a class
// to a page, and does not run `npm run build:css`. The page then asks for a
// class the shipped stylesheet does not have, and the element is simply
// unstyled — which looks like a design decision, not a bug.
//
// This rebuilds the CSS into a temp file with the same command as build:css
// and compares it byte for byte with the committed file. Exit 1 on any
// difference (or if the build itself fails), with the first differing line.
//
//   node tools/verify-tailwind.js
//   CSS=path/to/other.css node tools/verify-tailwind.js   (compare another file; used to plant a stale copy)
"use strict";
const fs = require("fs"), os = require("os"), path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "platform/css/tailwind.input.css");
const COMMITTED = process.env.CSS ? path.resolve(process.env.CSS) : path.join(ROOT, "platform/css/tailwind.css");

// The CLI from node_modules (pinned in package.json), run through this node so
// it works the same on Windows, where .bin shims are .cmd files.
let cli;
try {
  const pkgPath = require.resolve("@tailwindcss/cli/package.json", { paths: [ROOT] });
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  cli = path.join(path.dirname(pkgPath), typeof pkg.bin === "string" ? pkg.bin : pkg.bin.tailwindcss);
  const want = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).devDependencies["@tailwindcss/cli"];
  if (pkg.version !== want) {
    console.error("FAIL  @tailwindcss/cli " + pkg.version + " is installed, package.json pins " + want + ". Run npm ci.");
    process.exit(1);
  }
} catch (e) {
  console.error("FAIL  @tailwindcss/cli is not installed. Run `npm ci` at the repo root.\n      " + e.message);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "verify-tailwind-"));
const out = path.join(tmp, "tailwind.css");
// Same flags as `npm run build:css`.
const r = spawnSync(process.execPath, [cli, "-i", INPUT, "-o", out, "--optimize"], { cwd: ROOT, encoding: "utf8" });
if (r.status !== 0 || !fs.existsSync(out)) {
  console.error("FAIL  the Tailwind build failed:\n" + (r.stderr || r.stdout));
  process.exit(1);
}

const built = fs.readFileSync(out, "utf8");
fs.rmSync(tmp, { recursive: true, force: true });
if (!fs.existsSync(COMMITTED)) {
  console.error("FAIL  " + path.relative(ROOT, COMMITTED) + " does not exist. Run `npm run build:css` and commit it.");
  process.exit(1);
}
const have = fs.readFileSync(COMMITTED, "utf8");

if (built === have) {
  console.log("ok    " + path.relative(ROOT, COMMITTED) + " is current (" + built.length + " bytes, " + built.split("\n").length + " lines)");
  process.exit(0);
}

const a = have.split("\n"), b = built.split("\n");
let i = 0;
while (i < a.length && i < b.length && a[i] === b[i]) i++;
console.error("FAIL  " + path.relative(ROOT, COMMITTED) + " is stale: it is not what the config, the input CSS and the pages build.");
console.error("      first difference at line " + (i + 1) + ":");
console.error("        committed: " + JSON.stringify((a[i] === undefined ? "<end of file>" : a[i]).slice(0, 160)));
console.error("        built:     " + JSON.stringify((b[i] === undefined ? "<end of file>" : b[i]).slice(0, 160)));
console.error("      committed " + have.length + " bytes, built " + built.length + " bytes. Run `npm run build:css` and commit the result.");
process.exit(1);
