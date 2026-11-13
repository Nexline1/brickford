const path=require("path");const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async()=>{const br=await chromium.launch();const ctx=await br.newContext();const page=await ctx.newPage();
await page.addInitScript(()=>{ if(window.top!==window) return; window.__boot = window.name; window.name=""; });
await page.goto("file://"+path.join("/home/user/bf-T-068","platform/index.html")+"#/practice",{waitUntil:"load"});
await page.evaluate(()=>{["pagehide","unload"].forEach(ev=>window.addEventListener(ev,()=>{ window.name = JSON.stringify({ev, t: Date.now()}); }));});
await page.reload({waitUntil:"load"});
console.log("boot window.name:",await page.evaluate(()=>window.__boot));await br.close();})();
