import sys
root=sys.argv[1]; n=int(sys.argv[2])
src=open(root+'/tools/verify-design.js',encoding='utf-8').read()
L=src.split('\n')
i=L.index('(async () => {')
pre='\n'.join(L[:i])
a=[k for k,l in enumerate(L) if l.startswith('  const readTheme = () => ({')][0]
b=[k for k,l in enumerate(L) if l.startswith('  for (const [label, seedTheme] of [["nothing stored"')][0]
c=[k for k,l in enumerate(L) if l.startswith('  console.log("\\nT-024: the navy switch");')][0]
d=[k for k,l in enumerate(L) if l.startswith('    check("switch (a)/(c): no page errors"')][0]
helpers='\n'.join(L[a:b])
block='\n'.join(L[c+1:d+3])   # through the closing brace of the (a)/(c) block
out=pre+'\n(async () => {\n  const browser = await chromium.launch();\n'+helpers+'\n  let cFails = 0;\n  for (let run = 0; run < '+str(n)+'; run++) {\n    const f0 = fails;\n'+block+'\n  }\n  await browser.close();\n  console.log("SWITCH-ONLY: " + fails + " failed check(s) over '+str(n)+' runs of switch (a)/(c), " + checks + " checks");\n  const __rs = require("./lib-reload").stats;\n  console.log("RE-MEASURES: " + __rs.lost + " attempt(s) discarded for browser storage lost on reload, " + __rs.exhausted + " block(s) that lost it on all 3 attempts");\n  process.exit(fails ? 1 : 0);\n})().catch(e => { console.error(e); process.exit(2); });\n'
open(root+'/tools/switch-only.js','w',encoding='utf-8').write(out)
