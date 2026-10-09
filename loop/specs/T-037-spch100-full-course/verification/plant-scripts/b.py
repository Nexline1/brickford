# Plant (b): insert a new unit BEFORE the seed Unit I, so every positional key shifts by one unit and spch100.0.0 re-points.
p = "platform/data/storytelling.js"
s = open(p, encoding="utf-8").read()
a = '  units: [\n    {\n      name: "Unit I — Seed'
assert s.count(a) == 1
ins = ('  units: [\n    {\n      name: "Unit 0 — a unit inserted before the seed (PLANT)",\n'
       '      lessons: [\n        { t: "Document, don\'t create", v: "RVKofRN1dyI", min: 7 },\n      ],\n    },\n'
       '    {\n      name: "Unit I — Seed')
open(p, "w", encoding="utf-8").write(s.replace(a, ins, 1))
