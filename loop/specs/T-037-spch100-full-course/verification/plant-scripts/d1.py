# Plant (d1): "make room for storytelling" — when the storytelling course is loaded, carve 10 effort-minutes
# out of the Build block. A schedule change that moves another course's (the AI spine's) dates.
p = "platform/js/app.js"
s = open(p, encoding="utf-8").read()
a = 'const bw = windowFor("b:spine", spineFlat, BUILD_BUDGET, d, dT < 0 ? -1 : dT);'
assert s.count(a) == 1
b = 'const bw = windowFor("b:spine", spineFlat, BUILD_BUDGET - (D.COURSES.some(c => c.id === "spch100") ? 10 : 0), d, dT < 0 ? -1 : dT);'
open(p, "w", encoding="utf-8").write(s.replace(a, b))
