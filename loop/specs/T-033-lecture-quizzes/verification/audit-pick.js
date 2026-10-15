// T-033 audit sample: 10 checks drawn with a fixed-seed LCG (seed 20261015) from every
// T-033 check, sorted by key then index. Usage: node verification/audit-pick.js
const fs=require("fs"),vm=require("vm"),path=require("path");const R=path.resolve(__dirname,"../../../..");
const ctx={};ctx.window=ctx;vm.createContext(ctx);
["curriculum","summaries-ai200","summaries-ai210","summaries-ai300","summaries-ai310","summaries-res400"].forEach(f=>{const p=path.join(R,"platform/data",f+".js");if(fs.existsSync(p))vm.runInContext(fs.readFileSync(p,"utf8"),ctx);});
const S=ctx.DAR.SUMMARIES;const all=[];
Object.keys(S).filter(k=>/^(ai200|ai210|ai300|ai310|res400)\./.test(k)).sort().forEach(k=>(S[k].checks||[]).forEach((c,i)=>all.push({k,i,c})));
const ev={};["ai200","ai210","ai300","ai310","res400"].forEach(c=>{const p=R+"/loop/specs/T-033-lecture-quizzes/verification/evidence/"+c+".jsonl";if(fs.existsSync(p))fs.readFileSync(p,"utf8").split("\n").filter(Boolean).forEach(l=>{const d=JSON.parse(l);ev[d.key+"#"+d.i]=d;});});
// seeded LCG, seed = 20261015
let x=20261015;const rnd=()=>{x=(x*1103515245+12345)%2147483648;return x/2147483648;};
const picked=new Set();while(picked.size<10)picked.add(Math.floor(rnd()*all.length));
console.log("population",all.length);
[...picked].sort((a,b)=>a-b).forEach(n=>{const {k,i,c}=all[n];const e=ev[k+"#"+i];
console.log("\n#"+n,k,"check",i);console.log("Q:",c.q);if(c.opts)console.log("A:",c.opts[c.a]);else console.log("NUM:",c.num,"tol",c.tol);console.log("src:",c.src||("at "+c.at));console.log("quote:",e&&e.quote);});
