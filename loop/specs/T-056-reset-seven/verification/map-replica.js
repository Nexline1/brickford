const mk=require("./cal-replica.js");const O=mk("2026-10-05"),N=mk("2026-10-16");
const W=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function map(d){const i=O.studyIndex(d);if(i>=0)return N.dateForStudy(i);
 if(O.dowOf(d)===6&&d>="2026-10-05"){const prev=O.studyIndex(O.addDaysISO(d,-1));const w=Math.floor(prev/6);for(let j=w*6;j<w*6+6;j++){const a=N.dateForStudy(j),b=N.addDaysISO(a,1);if(N.dowOf(b)===6)return b;}}
 return null;}
module.exports=map;
if(require.main===module){for(let d="2026-10-05";d<="2026-11-08";d=O.addDaysISO(d,1)){const m=map(d);console.log(d,W[O.dowOf(d)],"d"+(O.studyIndex(d)+1),"->",m,m?W[O.dowOf(m)]+" d"+(N.studyIndex(m)+1):"");}}
