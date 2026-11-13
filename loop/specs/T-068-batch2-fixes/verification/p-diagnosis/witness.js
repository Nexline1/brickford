const path=require("path");const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const N=+process.argv[2]||60; const U="file://"+path.join("/home/user/bf-T-068","platform/index.html");
(async()=>{const br=await chromium.launch();const tally={};
for(let i=0;i<N;i++){const ctx=await br.newContext({timezoneId:"UTC"});await ctx.route(/^https?:/,r=>r.abort());
await ctx.addInitScript(()=>{ if(window.top!==window) return; window.__boot={ st: localStorage.getItem("darhikmah_v1")!==null, stamp: localStorage.getItem("__s"), n: localStorage.length }; });
if(process.argv[3]==="keep"){ const kp=await ctx.newPage(); await kp.goto("file://"+__dirname+"/keeper.html"); await kp.evaluate(()=>localStorage.length); global.__kp=kp; }
const page=await ctx.newPage(); await page.goto(U+"#/practice",{waitUntil:"load"});
await page.evaluate(()=>{localStorage.setItem("darhikmah_v1",JSON.stringify({ledger:[1]}));localStorage.setItem("__s","X");});
await page.reload({waitUntil:"load"}); const b=await page.evaluate(()=>window.__boot);
let w=null, after=null, kv=null; if(global.__kp) kv=await global.__kp.evaluate(()=>localStorage.getItem('__s'));
if(!b.stamp){ const p2=await ctx.newPage(); await p2.goto(U+"#/record",{waitUntil:"load"}); w=await p2.evaluate(()=>window.__boot);
  after=await page.evaluate(()=>({ st: localStorage.getItem("darhikmah_v1")!==null, stamp: localStorage.getItem("__s") })); }
const k=JSON.stringify({boot:b.stamp?"ok":"LOST", witness:w&&(w.stamp?"sees":"blind"), reloadedNow: after && (after.stamp?"sees":"blind"), keeper: kv}); tally[k]=(tally[k]||0)+1; await ctx.close();}
console.log(JSON.stringify(tally,null,1));await br.close();})();
