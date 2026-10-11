# mkiso.py (the T-039 reviewer's, plus the appRemoved/noReport tally) <tree> <n> -- writes <tree>/tools/iso-review.js: the switch (c) block of verify-design.js, n times.
# Env at run time: PLANT_FIRST=1 skips the Light pick on the FIRST attempt of every block run (a one-off
# failing measurement with storage intact: the real wrapper must commit it, a silent retry would hide it).
import sys
root, n = sys.argv[1], int(sys.argv[2])
L = open(root + "/tools/verify-design.js", encoding="utf-8").read().split("\n")
def idx(pred):
    r = [k for k, l in enumerate(L) if pred(l)]
    assert len(r) == 1, r
    return r[0]
i = idx(lambda l: l == "(async () => {")
a = idx(lambda l: l.startswith("  const readTheme = () => ({"))
b = idx(lambda l: l.startswith('  for (const [label, seedTheme] of [["nothing stored"'))
p = idx(lambda l: l.startswith("  const pickTheme = async (page, t) => {"))
c = idx(lambda l: l.startswith('  await acrossReload({ label: "switch (c)"'))
d = idx(lambda l: l.startswith('  await acrossReload({ label: "switch (c2)"'))
pre = "\n".join(L[:i])
helpers = "\n".join(L[a:b]) + "\n" + "\n".join(L[p:p + 4])
block = "\n".join(L[c:d])
old = '    await pickTheme(page, "light");\n    await reload(page, { waitUntil: "load" });'
assert block.count(old) == 1
block = block.replace(old, '    if (!(process.env.PLANT_FIRST && ++__bodyCalls === 1)) await pickTheme(page, "light");\n    await reload(page, { waitUntil: "load" });')
out = pre + """
(async () => {
  const browser = await chromium.launch();
""" + helpers + """
  let __bodyCalls = 0, blockFails = 0;
  for (let run = 0; run < """ + str(n) + """; run++) {
    __bodyCalls = 0;
    const f0 = fails;
""" + block + """
    if (fails > f0) blockFails++;
    console.log("RUN " + (run + 1) + " " + (fails > f0 ? "FAILED" : "passed") + " (body ran " + __bodyCalls + "x counted)");
  }
  await browser.close();
  const rs = require("./lib-reload").stats;
  console.log("ISO: " + blockFails + " of """ + str(n) + """ block runs failed; " + fails + " failed checks of " + checks + "; lost attempts " + rs.lost + ", exhausted " + rs.exhausted + ", app-removed attempts " + rs.appRemoved + ", reloads with no unload report " + rs.noReport);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
"""
open(root + "/tools/iso-review.js", "w", encoding="utf-8").write(out)
print("wrote", root + "/tools/iso-review.js")
