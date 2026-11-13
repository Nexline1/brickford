const path=require("path");const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async()=>{const br=await chromium.launch();const ctx=await br.newContext();const page=await ctx.newPage();
await page.goto("file://"+path.join("/home/user/bf-T-068","platform/index.html")+"#/practice",{waitUntil:"load"});
const got=[];await page.exposeBinding("__b",(s,r)=>got.push(r));
console.log("typeof in old doc:",await page.evaluate(()=>typeof window.__b));
await page.evaluate(()=>{const send=window.__b;["pagehide","unload"].forEach(ev=>window.addEventListener(ev,()=>{try{send(ev)}catch(e){}}));document.addEventListener("visibilitychange",()=>{try{send("vis")}catch(e){}});});
await page.reload({waitUntil:"load"});
await new Promise(r=>setTimeout(r,500));
console.log("reports:",JSON.stringify(got));await br.close();})();
