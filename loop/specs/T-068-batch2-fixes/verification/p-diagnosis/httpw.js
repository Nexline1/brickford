const path=require("path"),http=require("http"),fs=require("fs");const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const ROOT="/home/user/bf-T-068/platform";
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split("?")[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{"content-type":f.endsWith(".html")?"text/html":f.endsWith(".js")?"text/javascript":f.endsWith(".css")?"text/css":"application/octet-stream"});r.end(d);});});
srv.listen(0,async()=>{const U="http://127.0.0.1:"+srv.address().port+"/index.html";const N=+process.argv[2]||60;
const br=await chromium.launch();const tally={};
for(let i=0;i<N;i++){const ctx=await br.newContext({timezoneId:"UTC"});
await ctx.addInitScript(()=>{ if(window.top!==window) return; window.__boot={ stamp: localStorage.getItem("__s"), n: localStorage.length }; });
const page=await ctx.newPage(); await page.goto(U+"#/practice",{waitUntil:"load"});
await page.evaluate(()=>{localStorage.setItem("darhikmah_v1",JSON.stringify({ledger:[1]}));localStorage.setItem("__s","X");});
await page.reload({waitUntil:"load"}); const b=await page.evaluate(()=>window.__boot);
const k=b.stamp?"ok":"LOST"; tally[k]=(tally[k]||0)+1; await ctx.close();}
console.log("http",JSON.stringify(tally));await br.close();srv.close();});
