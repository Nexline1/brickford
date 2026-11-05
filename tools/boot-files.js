// boot-files.js — post-build step for app-web/ (tools/build-app.sh), T-064 boot.
//
//   node tools/boot-files.js <app-web dir>        minify the data JSON, write the boot total
//   require("./boot-files.js").BOOT_FILES         the startup file list (tools/shoot-app.js checks it)
//
// 1. Minifies app-web/assets/assets/data/*.json in place (whitespace only:
//    JSON.parse then JSON.stringify, so the values are identical).
// 2. Sums the bytes a first start on iOS Safari reads before the first frame
//    (BOOT_FILES: main.dart.js, the full CanvasKit, the startup data the app's
//    BrickfordData.files names, the manifests and the fonts Home draws) and
//    writes the sum into index.html's __BOOT_TOTAL_BYTES__, the boot screen's
//    "of ~N MB". Chromium reads the smaller canvaskit/chromium build, so there
//    the count ends under the total; the boot screen says "~".
"use strict";
const fs = require("fs"), path = require("path");

const ENGINE = fs.readFileSync(path.join(__dirname, "../app/lib/engine/engine.dart"), "utf8");
const startup = (ENGINE.match(/static const files = \[([^\]]*)\]/) || [])[1];
if (!startup) throw new Error("boot-files: BrickfordData.files not found in engine.dart");
const DATA = startup.match(/'[^']+\.json'/g).map(s => "assets/assets/data/" + s.slice(1, -1));

const BOOT_FILES = [
  "flutter_bootstrap.js", "main.dart.js", "canvaskit/canvaskit.js", "canvaskit/canvaskit.wasm",
  "assets/AssetManifest.bin.json", "assets/FontManifest.json", "assets/fonts/MaterialIcons-Regular.otf",
  ...DATA,
  ...["Regular", "Medium", "SemiBold", "Bold", "ExtraBold"].map(w => "assets/assets/fonts/inter/Inter-" + w + ".ttf"),
  "assets/assets/fonts/playfair/PlayfairDisplay-Bold.ttf",
];
module.exports = { BOOT_FILES };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, "../app-web"));
  const dataDir = path.join(out, "assets/assets/data");
  let saved = 0;
  for (const f of fs.readdirSync(dataDir).filter(f => f.endsWith(".json"))) {
    const p = path.join(dataDir, f), raw = fs.readFileSync(p, "utf8"), min = JSON.stringify(JSON.parse(raw));
    saved += raw.length - min.length;
    fs.writeFileSync(p, min);
  }
  let total = 0;
  for (const f of BOOT_FILES) {
    const p = path.join(out, f);
    if (!fs.existsSync(p)) throw new Error("boot-files: " + f + " is not in " + out);
    total += fs.statSync(p).size;
  }
  const idx = path.join(out, "index.html"), html = fs.readFileSync(idx, "utf8");
  if (!html.includes("__BOOT_TOTAL_BYTES__")) throw new Error("boot-files: index.html has no __BOOT_TOTAL_BYTES__");
  fs.writeFileSync(idx, html.replace("__BOOT_TOTAL_BYTES__", String(total)));
  console.log("boot-files: data JSON minified (-" + Math.round(saved / 1024) + " KB); boot total " + (total / 1048576).toFixed(1) + " MB over " + BOOT_FILES.length + " files");
}
