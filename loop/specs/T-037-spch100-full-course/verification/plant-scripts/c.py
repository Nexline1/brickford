# Plant (c): delete the `check:` line of one drill (spch100.4.12), leaving the drill otherwise intact.
import re
p = "platform/data/storytelling.js"
s = open(p, encoding="utf-8").read()
i = s.index('  "spch100.4.12": {\n    module: "A3",')
j = s.index('    check: "', i)
k = s.index('\n', j) + 1
open(p, "w", encoding="utf-8").write(s[:j] + s[k:])
