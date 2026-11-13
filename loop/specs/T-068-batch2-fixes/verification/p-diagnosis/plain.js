const path=require("path");const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const MODE=process.argv[2]||"plain", N=+process.argv[3]||40;
(async()=>{const br=await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });let lost=0;
for(let i=0;i<N;i++){const ctx=await br.newContext({viewport:{width:1280,height:900},timezoneId:"UTC"});await ctx.route(/^https?:/,r=>r.abort());
await ctx.clock.setFixedTime(new Date("2026-11-01T12:00:00Z"));
await ctx.addInitScript(()=>{ if(window.top!==window) return; window.__has = localStorage.getItem("darhikmah_v1")!==null; });
const page=await ctx.newPage();
await page.goto("file://"+path.join("/home/user/bf-T-068","platform/index.html")+"#/practice",{waitUntil:"load"});
await page.waitForSelector("#view .seg");
if(MODE==="gum"){ await page.evaluate(async()=>{ const s=await navigator.mediaDevices.getUserMedia({audio:true}); window.__s=s; }); await page.evaluate(()=>window.__s.getTracks().forEach(t=>t.stop())); }
if(MODE==="gumlive"){ await page.evaluate(async()=>{ const s=await navigator.mediaDevices.getUserMedia({audio:true}); window.__s=s; }); }
if(MODE==="idb"){ await page.evaluate(()=>new Promise(r=>{const q=indexedDB.open("x");q.onupgradeneeded=()=>q.result.createObjectStore("s");q.onsuccess=()=>{const t=q.result.transaction("s","readwrite");t.objectStore("s").put(new Blob(["abc"]),"k");t.oncomplete=()=>r();};})); }
await page.evaluate(()=>localStorage.setItem("darhikmah_v1", JSON.stringify({ledger:[1,2]})));
if(MODE==="wait") await new Promise(r=>setTimeout(r,2000));
if(MODE==="twice"){ await page.reload({waitUntil:"load"}); await page.evaluate(()=>localStorage.setItem("darhikmah_v1", JSON.stringify({ledger:[1,2]}))); }
if(MODE==="newpage"){ const p2=await ctx.newPage(); await p2.goto("file://"+path.join("/home/user/bf-T-068","platform/index.html")+"#/record",{waitUntil:"load"}); const h=await p2.evaluate(()=>window.__has); if(!h) lost++; await ctx.close(); continue; }
await page.reload({waitUntil:"load"});
const has=await page.evaluate(()=>window.__has); if(!has) lost++;
await ctx.close();}
console.log(MODE,"lost",lost,"of",N);await br.close();})();
