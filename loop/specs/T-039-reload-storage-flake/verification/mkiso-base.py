# mkiso-base.py <tree> <n> -- the switch (a)/(c) block of the BASE verify-design.js (no wrapper), n times.
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
e = idx(lambda l: l.startswith('    check("switch (a)/(c): no page errors"'))
block = "\n".join(L[p + 4:e + 3])
assert block.lstrip().startswith("{") and block.rstrip().endswith("}"), block[:40]
out = "\n".join(L[:i]) + """
(async () => {
  const browser = await chromium.launch();
""" + "\n".join(L[a:b]) + "\n" + "\n".join(L[p:p + 4]) + """
  let blockFails = 0;
  for (let run = 0; run < """ + str(n) + """; run++) {
    const f0 = fails;
""" + block + """
    if (fails > f0) blockFails++;
    console.log("RUN " + (run + 1) + " " + (fails > f0 ? "FAILED" : "passed"));
  }
  await browser.close();
  console.log("ISO-BASE: " + blockFails + " of """ + str(n) + """ block runs failed; " + fails + " failed checks of " + checks);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
"""
open(root + "/tools/iso-review.js", "w", encoding="utf-8").write(out)
print("wrote")
