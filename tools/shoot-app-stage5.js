// shoot-app-stage5.js — Week and the Sunday seal, Record, Proof and Treasury in the built Flutter app (app-web/), 375x812.
//
//   node tools/shoot-app-stage5.js [out dir]     default loop/specs/T-064-flutter-app/shots (stage5-*.png)
//
// Serves the repo root at /brickford/ on a local port (run tools/build-app.sh first), fixes the clock at
// Sunday 8 Nov 2026 08:15 (the Sunday that closes revision week 3) and seeds a state in the web app's shape: nine
// sealed days, a hash chain of seven links built with node's own sha256, DSA ticked, lectures proven. It then does
// the real things: seals the week, seals the day, anchors the head, records a payment, and reads back what each wrote
// (the chain is re-verified here, with node's sha256, not the app's). Controls are found through Flutter's
// semantics identifiers; every control shot is measured at 44x44 or more. Exits 1 on a failed assertion.
"use strict";
const fs = require("fs"), http = require("http"), path = require("path"), crypto = require("crypto");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "loop/specs/T-064-flutter-app/shots"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".otf": "font/otf", ".woff2": "font/woff2", ".bin": "application/octet-stream", ".txt": "text/plain" };
let fails = 0;
const check = (name, ok, detail) => { if (!ok) fails++; console.log((ok ? "  ok    " : "  FAIL  ") + name + (detail ? " — " + detail : "")); };

function serve() {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    if (!u.pathname.startsWith("/brickford/")) { res.writeHead(404); return res.end(); }
    let p = path.join(ROOT, decodeURIComponent(u.pathname.slice("/brickford/".length)));
    if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
    if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

// The chain, built and re-verified with node's own sha256 (the app's is hand-written).
const canon = v => v === null || typeof v !== "object" ? JSON.stringify(v === undefined ? null : v) : Array.isArray(v) ? "[" + v.map(canon).join(",") + "]"
  : "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
const sha = s => crypto.createHash("sha256").update(s, "utf8").digest("hex");
const GENESIS = "brickford-genesis";
function chain(list) {
  const out = [];
  list.forEach(([type, ref, data, ts]) => { const e = { i: out.length, ts, type, ref, data, prev: out.length ? out[out.length - 1].hash : GENESIS }; e.hash = sha(canon(e)); out.push(e); });
  return out;
}
const verify = L => L.every((e, i) => e.i === i && e.prev === (i ? L[i - 1].hash : GENESIS) &&
  sha(canon({ i: e.i, ts: e.ts, type: e.type, ref: e.ref, data: e.data, prev: e.prev })) === e.hash);

const w = (on, extra) => Object.assign({ done: true, doneAt: on, notes: "", checks: [] }, extra || {});
const days = ["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04"];
const ledger = chain([
  ["day", "2026-10-26", {}, "2026-10-26T07:00:00.000Z"], ["lesson", "math110.0.0", { done: true }, "2026-10-27T07:00:00.000Z"], ["quiz", "math110.0.0", { firstTry: 4, total: 5 }, "2026-10-27T07:30:00.000Z"],
  ["lab", "flashcards-cli", { done: true }, "2026-10-29T07:00:00.000Z"], ["exam", "linear-algebra", { score: 11, total: 15, pct: 73 }, "2026-10-30T07:00:00.000Z"],
  ["problem", "Arrays & Hashing|Two Sum", { solved: true }, "2026-11-02T07:00:00.000Z"], ["day", "2026-11-04", {}, "2026-11-04T07:00:00.000Z"],
]);
const state = {
  lessons: { "math110.0.0": w("2026-11-02", { quiz: { passedAt: "2026-11-02" } }), "math110.0.1": w("2026-11-03", { verified: true, verifiedAt: "2026-11-03" }), "math110.0.2": w("2026-11-04", { verified: true, verifiedAt: "2026-11-04" }),
    "math110.0.3": w("2026-11-04"), "ai200.0.0": w("2026-10-29"), "math120.0.0": w("2026-10-28") },
  problems: { "Arrays & Hashing|Two Sum": "2026-11-02", "Arrays & Hashing|Valid Anagram": "2026-11-03", "Stack|Min Stack": "2026-10-30" },
  studyDays: days, ledger,
  treasury: { offer: "", clients: [{ name: "Nour Clinic", project: "WhatsApp agent", price: 450 }], niche: "", entries: [{ date: "2026-11-02", amount: 250, note: "setup, first clinic" }, { date: "2026-11-04", amount: 60.5, note: "retainer" }] },
  weeks: [{ week: 2, date: "2026-11-01", shipped: "the flashcards CLI", dsa: 2, posts: 1, revenue: 0, notes: "slow Tuesday" }, { week: 1, date: "2026-10-25", shipped: "", dsa: 0, posts: 0, revenue: 0, notes: "" }],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const BASE = "http://localhost:" + server.address().port + "/brickford/app-web/";
  const browser = await chromium.launch();
  const W = 375, H = 812;
  const errors = [], hosts = new Set();
  try {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, serviceWorkers: "block" });
    await ctx.clock.setFixedTime(new Date("2026-11-08T08:15:00"));
    await ctx.route(/youtube\.com|ytimg\.com/, r => r.abort());
    await ctx.addInitScript(s => { if (!localStorage.getItem("flutter.darhikmah_v1")) localStorage.setItem("flutter.darhikmah_v1", s); }, JSON.stringify(JSON.stringify(state)));
    const page = await ctx.newPage();
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error" && !/youtube\.com|ytimg\.com/.test((m.location() || {}).url || "")) errors.push(m.text()); });
    page.on("request", r => { const h = new URL(r.url()).host; if (!h.startsWith("localhost") && !/(^|\.)youtube\.com$|ytimg\.com$/.test(h)) hosts.add(h); });
    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForSelector("flutter-view, flt-glass-pane", { timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const p = document.querySelector("flt-semantics-placeholder"); if (p) p.click(); });
    await page.waitForSelector("[flt-semantics-identifier]", { timeout: 10000 });
    const id = (x, n = 0) => page.locator(`[flt-semantics-identifier="${x}"]`).nth(n);
    const has = async x => (await id(x).count()) > 0;
    const shot = async name => { await page.mouse.move(W - 3, 300); await page.waitForTimeout(900); const f = path.join(OUT, "stage5-" + name + ".png"); await page.screenshot({ path: f }); console.log("  shot  " + path.relative(ROOT, f)); };
    const tap = async (x, n = 0) => { const b = await id(x, n).boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(700); return b; };
    const wait = x => page.waitForSelector(`[flt-semantics-identifier="${x}"]`, { timeout: 10000 });
    const scroll = async dy => { await page.mouse.move(W / 2, 500); await page.mouse.wheel(0, dy); await page.waitForTimeout(700); };
    const sized = async (ids, label) => {
      const small = [];
      for (const x of ids) { const b = await id(x).boundingBox().catch(() => null); if (!b || b.width < 44 || b.height < 44) small.push(x + " " + (b ? Math.round(b.width) + "x" + Math.round(b.height) : "missing")); }
      check(label + " are at least 44x44", small.length === 0, small.join(", ") || ids.length + " measured");
    };
    const stored = async () => JSON.parse(JSON.parse(await page.evaluate(() => localStorage.getItem("flutter.darhikmah_v1"))));
    const type = async (x, text) => { await tap(x); await page.keyboard.type(text); await page.waitForTimeout(300); };

    // ---- Home: the two chips ----
    await wait("chip-week");
    check("Home carries the Week chip, and Seal day while today is open", (await has("chip-week")) && (await has("chip-seal")));
    await shot("home");

    // ---- Week ----
    await tap("chip-week");
    await wait("week-seal");
    await shot("week");
    await sized(["week-seal", "posts-minus", "posts-plus", "week-shipped", "week-notes", "back"], "the Week controls");
    await type("week-shipped", "the Treasury page");
    await type("week-notes", "a slow Thursday");
    await tap("posts-plus"); await tap("posts-plus"); await tap("posts-plus");
    await shot("week-filled");
    await tap("week-seal");
    await page.waitForTimeout(500);
    await shot("week-sealed");
    let S = await stored();
    const mine = S.weeks.filter(x => +x.week === 3 && x.date === "2026-11-08");
    check("sealing wrote S.weeks in the web app's shape (week 3, today's date, what shipped, DSA counted, posts, BHD counted from the Treasury: 250 + 60.5)",
      mine.length === 1 && mine[0].shipped === "the Treasury page" && mine[0].notes === "a slow Thursday" && mine[0].dsa === 3 && mine[0].posts === 3 && mine[0].revenue === 310.5 && S.weeks.length === 3, JSON.stringify(mine[0]));
    const ev = S.ledger[S.ledger.length - 1];
    check("and one week event, linked to the chain, which still verifies with node's sha256", ev.type === "week" && ev.ref === "week3" && S.ledger.length === 8 && verify(S.ledger) && /^2026-11-08T\d\d:\d\d:\d\d\.\d{3}Z$/.test(ev.ts), JSON.stringify(ev.data));
    await tap("back");

    // ---- Record ----
    await tap("tab-Profile");
    await wait("chip-record");
    await shot("profile");
    await tap("chip-record");
    await wait("record-proof");
    await shot("record");
    await sized(["record-seal", "record-proof", "record-reset", "back"], "the Record controls");
    await tap("record-seal");
    S = await stored();
    check("sealing today pushed 2026-11-08 into S.studyDays and logged a day event", S.studyDays.includes("2026-11-08") && S.ledger[S.ledger.length - 1].type === "day" && verify(S.ledger), S.studyDays.length + " sealed days");
    await shot("record-sealed");
    await scroll(620);
    await shot("record-chain");
    await scroll(900);
    await shot("record-ledger");
    await scroll(-3000);

    // ---- Proof ----
    await tap("record-proof");
    await wait("anchor-add");
    await shot("proof");
    await sized(["proof-copy-head", "proof-copy-record", "anchor-add", "proof-verify", "back"], "the Proof controls");
    await type("anchor-where", "a commit on GitHub");
    await tap("anchor-add");
    S = await stored();
    check("anchoring stored the head hash with where and when", S.anchors.length === 1 && S.anchors[0].head === S.ledger[S.ledger.length - 1].hash && S.anchors[0].where === "a commit on GitHub" && S.anchors[0].date === "2026-11-08", JSON.stringify(S.anchors[0]));
    await shot("proof-anchored");
    await tap("back");
    await tap("back");

    // ---- Treasury ----
    await tap("chip-treasury");
    await wait("entry-add");
    await shot("treasury");
    await sized(["entry-add", "entry-amount", "entry-note", "back"], "the Treasury controls");
    await type("entry-amount", "1137.5");
    await type("entry-note", "annual retainer");
    await tap("entry-add");
    await shot("treasury-added");
    S = await stored();
    const last = S.treasury.entries[S.treasury.entries.length - 1];
    check("a payment is stored as the web app stores it (today, the number, the note)", S.treasury.entries.length === 3 && last.date === "2026-11-08" && last.amount === 1137.5 && last.note === "annual retainer", JSON.stringify(last));
    await scroll(1500);
    await shot("treasury-clients");
    await scroll(1500);
    await shot("treasury-offers");
    await wait("niche-lock");
    await sized(["niche-lock"], "Lock this niche");
    await scroll(-4000);
    await tap("back");

    // ---- Library ----
    await tap("chip-library");
    await wait("revision-1");
    await shot("library");
    await sized(["revision-1", "revision-6", "back"], "the Library rows");
    check("no page or console errors, and no host but this one was asked", errors.length === 0 && hosts.size === 0, errors.slice(0, 3).join(" | ") + [...hosts].join(","));
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(String(e.stack || e)); process.exit(1); });
