const path=require("path");const {chromium}=require("/opt/node22/lib/node_modules/playwright");
const URL="file://"+path.resolve(__dirname,"../../../../../platform/index.html")+"#";
(async()=>{const b=await chromium.launch();
for (const [route,k] of [["/lesson/ai310/1/2","ai310.1.2"],["/lesson/math130/0/0","math130.0.0"]]) for (const w of [320,390]) {
 const ctx=await b.newContext({viewport:{width:w,height:844},isMobile:true,hasTouch:true,reducedMotion:"reduce"});await ctx.route(/^https?:/,r=>r.abort());
 const p=await ctx.newPage();await p.goto(URL+route,{waitUntil:"load"});await p.waitForSelector('[data-act="startSummaryCheck"]');
 // mount with only the numeric checks so a numeric question is shown for sure
 const r=await p.evaluate(k=>{const sm=DAR.SUMMARIES[k];const m=document.querySelector("#sumCheck");
  DAR.Quiz.mount(m,{title:"t",course:"Review",perSitting:1,questions:sm.checks.filter(c=>c.num!==undefined)},{});
  const go=document.querySelector("#numGo"),inp=document.querySelector("#numAns"),card=document.querySelector("#sumCheck .q-card");
  const g=go.getBoundingClientRect(),c=card.getBoundingClientRect(),cs=getComputedStyle(card);
  return {goRight:Math.round(g.right),cardInner:Math.round(c.right-parseFloat(cs.paddingRight)-parseFloat(cs.borderRightWidth)),cardRight:Math.round(c.right),goW:Math.round(g.width),goScrollW:go.scrollWidth,goClientW:go.clientWidth,inpW:Math.round(inp.getBoundingClientRect().width)};},k);
 console.log(k,w,JSON.stringify(r));await ctx.close();}
await b.close();})();
