const path=require("path");const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async()=>{const br=await chromium.launch();const ctx=await br.newContext();const page=await ctx.newPage();
const got=[];page.on("console",m=>{ if(/^__rep/.test(m.text())) got.push(m.text()); });
await page.goto("file://"+path.join("/home/user/bf-T-068","platform/index.html")+"#/practice",{waitUntil:"load"});
for (let i=0;i<10;i++){
await page.evaluate(i=>{const log=console.log.bind(console);["pagehide","unload"].forEach(ev=>window.addEventListener(ev,()=>{ log("__rep "+i+" "+ev+" "+(localStorage.getItem("darhikmah_v1")!==null)); })); document.addEventListener("visibilitychange",()=>log("__rep "+i+" vis"));},i);
await page.reload({waitUntil:"load"});}
await new Promise(r=>setTimeout(r,300));
console.log(JSON.stringify(got));await br.close();})();
