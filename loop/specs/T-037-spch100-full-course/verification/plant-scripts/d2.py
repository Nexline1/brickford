# Plant (d2): the same intent done unconditionally — shrink the Build block from 90 to 80 effort-minutes
# for everyone. Moves the AI spine's dates whether or not storytelling is loaded.
p = "platform/js/app.js"
s = open(p, encoding="utf-8").read()
a = "const THEORY_BUDGET = 120, BUILD_BUDGET = 90;"
assert s.count(a) == 1
open(p, "w", encoding="utf-8").write(s.replace(a, "const THEORY_BUDGET = 120, BUILD_BUDGET = 80;"))
