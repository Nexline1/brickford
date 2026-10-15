# Plant (f): two unlogged attributions.
#  1. spch100.4.5 credits Vinh Giang again ("A communication coach's three levels" -> "Vinh Giang's
#     three levels") — a name logged for other videos, but not for FsxorSNJBaA, whose title and
#     transcript never name him. This is the attribution review round 1 found and fix 4 removed.
#  2. spch100.8.1 gains a teacher no row logs at all: "as Jordan Peterson puts it".
p = "platform/data/storytelling.js"
s = open(p, encoding="utf-8").read()
a = "takeaway: \"A communication coach's three levels"
assert s.count(a) == 1
s = s.replace(a, "takeaway: \"Vinh Giang's three levels")
i = s.index('  "spch100.8.1": {\n    takeaway: "')   # the summary, not the drill
j = s.index('takeaway: "', i) + len('takeaway: "')
s = s[:j] + "As Jordan Peterson puts it, " + s[j:]
open(p, "w", encoding="utf-8").write(s)
