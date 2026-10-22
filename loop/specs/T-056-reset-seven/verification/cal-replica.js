// Replicates studyIndex/dateForStudy/addStudyDays from platform/js/app.js exactly (UTC-safe dowOf).
function mk(START){
  const REST_DOW=6;
  const dowOf=iso=>new Date(iso+"T00:00:00Z").getUTCDay();
  const addDaysISO=(iso,n)=>{const d=new Date(iso+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
  const daysBetween=(a,b)=>Math.round((new Date(b+"T00:00:00Z")-new Date(a+"T00:00:00Z"))/864e5);
  const isRest=iso=>dowOf(iso)===REST_DOW;
  const k=(REST_DOW-dowOf(START)+7)%7;
  const restsWithin=n=>n>k?Math.floor((n-k-1)/7)+1:0;
  const studyIndex=iso=>{if(iso<START||isRest(iso))return -1;const n=daysBetween(START,iso);return n-restsWithin(n);};
  const dateForStudy=i=>{if(i<k)return addDaysISO(START,i);const j=i-k;return addDaysISO(START,k+1+Math.floor(j/6)*7+(j%6));};
  const addStudyDays=(iso,n)=>{const b=studyIndex(iso);if(b<0){let c=iso<START?START:addDaysISO(iso,1);while(isRest(c))c=addDaysISO(c,1);return dateForStudy(studyIndex(c)+n);}return dateForStudy(b+n);};
  return {studyIndex,dateForStudy,addStudyDays,dowOf,addDaysISO};
}
module.exports=mk;
if(require.main===module){
  const O=mk("2026-10-05"),N=mk("2026-10-16");
  const W=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  console.log("old d1094",O.dateForStudy(1093),"baseline",O.addStudyDays("2026-10-05",1094));
  console.log("new d1094",N.dateForStudy(1093),"baseline",N.addStudyDays("2026-10-16",1094));
  console.log("discarded", O.studyIndex("2026-10-15")+1, "first rest", ["2026-10-16","2026-10-17"].filter(d=>N.dowOf(d)===6));
  for(const a of process.argv.slice(2)){const i=O.studyIndex(a);console.log(a,W[O.dowOf(a)],"old day",i+1,"-> new",i>=0?N.dateForStudy(i)+" "+W[N.dowOf(N.dateForStudy(i))]:"rest/pre", "| new day of same date", N.studyIndex(a)+1);}
}
