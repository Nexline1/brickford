// Brickford app icons, rasterised from the crest that is already in index.html.
//
// The old set was brown-on-cream: an opaque cream tile, which is the inverse of
// the mark as it actually appears in the product. In a dark browser tab (Arc) or
// on an iPhone home screen it read as a bright white card with something small
// in it. The sidebar crest is GOLD on DARK BROWN - inside .sidebar the stylesheet
// re-scopes --accent to --panel-accent - so that is what the icon should be.
//
//   node tools/make-icons.mjs
//
// Every file is written with an opaque background on purpose. iOS composites
// alpha onto black for apple-touch-icon, and a favicon tile that matches the
// brand reads better on light AND dark chrome than a floating mark does.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "platform", "icons");

const GOLD = "#c99a63";   // --panel-accent, parchment
const DARK = "#2b2118";   // --panel, parchment

const html = fs.readFileSync(path.join(ROOT, "platform", "index.html"), "utf8");
const crest = html.match(/<svg viewBox="0 0 200 224" aria-label="Brickford crest">([\s\S]*?)<\/svg>/)[1];

// The temple alone. Below ~48px the laurel wreath, the keyline and the two
// diamonds collapse into noise - this is the same two-drawings-of-one-crest
// split the icons README already documents.
const TEMPLE = crest
  .split(/(?=<)/)
  .filter(t => {
    if (t.includes("cr-field")) return true;                 // the shield
    if (t.includes("cr-key") || t.includes("cr-stem")) return false;
    if (t.startsWith("<ellipse")) return false;              // laurel leaves
    if (t.startsWith("<polygon") && !t.includes("100,58")) return false;
    if (t.includes('transform="rotate(45')) return false;    // the two diamonds
    return true;
  })
  .join("");

const page = (body, scale, pad) => `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:${DARK};}
  .wrap{width:100vw;height:100vh;display:grid;place-items:center;background:${DARK};}
  svg{width:${scale}%;height:${scale}%;display:block;overflow:visible}
  .cr-field{fill:${GOLD}}
  .cr-key{fill:none;stroke:${DARK};stroke-width:3;opacity:.55}
  .cr-cut{fill:${DARK}}
  .cr-stem{fill:none;stroke:${DARK};stroke-width:3.4;stroke-linecap:round}
</style>
<div class="wrap"><svg viewBox="0 0 200 224" preserveAspectRatio="xMidYMid meet">${body}</svg></div>`;

// [file, px, artwork, how much of the tile the crest fills]
const JOBS = [
  // The crest artwork is 200x224 - taller than wide - so a percentage of the
  // square tile gives roughly 0.89x of that in width. At 82% the 16px favicon
  // was a ~10px shield floating in dark padding; near the tile edge is what a
  // favicon wants.
  ["favicon-16.png", 16, TEMPLE, 96],
  ["favicon-32.png", 32, TEMPLE, 96],
  ["favicon-48.png", 48, TEMPLE, 94],
  ["apple-touch-icon.png", 180, crest, 74],
  ["icon-192.png", 192, crest, 74],
  ["icon-512.png", 512, crest, 74],
  // Android may crop this to a circle, so the mark stays inside the middle 66%.
  ["icon-maskable-512.png", 512, crest, 58],
];

const b = await chromium.launch();
for (const [file, px, art, scale] of JOBS) {
  const ctx = await b.newContext({ viewport: { width: px, height: px }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.setContent(page(art, scale), { waitUntil: "load" });
  await p.screenshot({ path: path.join(OUT, file), omitBackground: false });
  await ctx.close();
  console.log("  " + file.padEnd(24) + px + "x" + px + "  crest at " + scale + "%");
}
await b.close();
console.log("\n7 icons written to platform/icons/");
