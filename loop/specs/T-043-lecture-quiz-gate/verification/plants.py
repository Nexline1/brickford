#!/usr/bin/env python3
# T-043 plants (a)-(e): put each bug back, run the gate that must catch it,
# record its exit code, restore the file. Run from the worktree root:
#   NODE_PATH=/opt/node22/lib/node_modules python3 loop/specs/T-043-lecture-quiz-gate/verification/plants.py [a b ...]
import subprocess, sys, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
PLANTS = {
  "a": ("a miss is not re-queued", "platform/js/quiz-engine.js",
        "        queue.push({ bi: cur.bi, pos: cur.pos, again: true });\n", "", ["tools/verify-flows.js"]),
  "b": ("schedDone ignores the quiz", "platform/js/app.js",
        "function schedDone(it) { return !it.pseudo && lessonCleared(lessonKey(it.cid, it.ui, it.li)); }",
        "function schedDone(it) { return !it.pseudo && !!(S.lessons[lessonKey(it.cid, it.ui, it.li)] || {}).done; }", ["tools/verify-logic.js"]),
  "c": ("the merge drops a pass", "platform/js/app.js",
        "      if (quiz && canon(quiz) !== canon(now.quiz || null)) { now.quiz = quiz; changed++; }\n", "", ["tools/verify-sync-loop.js"]),
  "d": ("the lock reads a stored flag instead of deriving", "platform/js/app.js",
        "    return lessonBlocks(lessonKey(p.cid, p.ui, p.li)) ? p : null;",
        "    return (S.lessons[lessonKey(cid, ui, li)] || {}).locked ? p : null;", ["tools/verify-logic.js"]),
  "e": ("the quiz record is written during render", "platform/js/app.js",
        "    const cleared = lessonCleared(k);\n",
        "    const cleared = lessonCleared(k);\n    if (passed) { S.lessons[k].quiz.seenAt = new Date().toISOString(); save(); }\n", ["tools/verify-flows.js"]),
}
which = sys.argv[1:] or sorted(PLANTS)
results = []
for key in which:
    name, path, old, new, gates = PLANTS[key]
    fp = os.path.join(ROOT, path)
    src = open(fp).read()
    assert src.count(old) == 1, (key, "anchor not found once")
    open(fp, "w").write(src.replace(old, new))
    try:
        for g in gates:
            r = subprocess.run(["node", g], cwd=ROOT, capture_output=True, text=True)
            fails = [l for l in r.stdout.splitlines() if "FAIL" in l]
            print("(%s) %s -> %s exit %d" % (key, name, g, r.returncode))
            for l in fails[:6]: print("      " + l.strip()[:220])
            results.append((key, r.returncode))
    finally:
        open(fp, "w").write(src)
ok = all(code == 1 for _, code in results)
print("ALL PLANTS EXIT 1" if ok else "SOME PLANT DID NOT EXIT 1: %r" % results)
sys.exit(0 if ok else 1)
