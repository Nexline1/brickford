# mkiso-c2.py (the T-039 reviewer's, plus the appRemoved/noReport tally) <tree> <n> [sessionclear] -- the switch (c2) block of verify-design.js, n times;
# with "sessionclear": every fresh() context clears sessionStorage on every document after its first (window.name).
import sys
root, n = sys.argv[1], int(sys.argv[2]); sc = len(sys.argv) > 3
src = open(root + "/tools/verify-design.js", encoding="utf-8").read()
if sc:
    a = "  await ctx.clock.setFixedTime(FIXED_NOW);\n"
    assert src.count(a) == 1
    src = src.replace(a, '  await ctx.addInitScript(() => { if (window.top !== window) return; if (window.name === "__rvB2") sessionStorage.clear(); window.name = "__rvB2"; });\n' + a)
L = src.split("\n")
def idx(pred):
    r = [k for k, l in enumerate(L) if pred(l)]
    assert len(r) == 1, r
    return r[0]
i = idx(lambda l: l == "(async () => {")
a = idx(lambda l: l.startswith("  const readTheme = () => ({"))
b = idx(lambda l: l.startswith('  for (const [label, seedTheme] of [["nothing stored"'))
p = idx(lambda l: l.startswith("  const pickTheme = async (page, t) => {"))
c = idx(lambda l: l.startswith('  await acrossReload({ label: "switch (c2)"'))
d = [k for k in range(c, len(L)) if L[k] == "  });"][0]
out = "\n".join(L[:i]) + "\n(async () => {\n  const browser = await chromium.launch();\n" + "\n".join(L[a:b]) + "\n" + "\n".join(L[p:p + 4]) + \
  "\n  let blockFails = 0;\n  for (let run = 0; run < " + str(n) + "; run++) {\n    const f0 = fails;\n" + "\n".join(L[c:d + 1]) + \
  "\n    if (fails > f0) blockFails++;\n  }\n  await browser.close();\n  const rs = require('./lib-reload').stats;\n" + \
  "  console.log('ISO-C2: ' + blockFails + ' of " + str(n) + " block runs failed; ' + fails + ' failed of ' + checks + '; lost ' + rs.lost + ', exhausted ' + rs.exhausted + ', app-removed ' + rs.appRemoved + ', no unload report ' + rs.noReport);\n" + \
  "  process.exit(fails ? 1 : 0);\n})().catch(e => { console.error(e); process.exit(2); });\n"
open(root + "/tools/iso-c2.js", "w", encoding="utf-8").write(out)
print("wrote iso-c2.js", "sessionclear" if sc else "")
