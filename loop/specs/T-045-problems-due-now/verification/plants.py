#!/usr/bin/env python3
# T-045 plants (a)-(d): put each bug back, run the gate that must catch it,
# record its exit code, restore the file. Run from the worktree root:
#   NODE_PATH=/opt/node22/lib/node_modules python3 loop/specs/T-045-problems-due-now/verification/plants.py [a b c d]
import subprocess, sys, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
PLANTS = {
  "a": ("a pset shows before its after lecture is cleared", "platform/js/app.js",
        "  const psetDue = i => lessonCleared(i.after) && !S.psets[i.id];",
        "  const psetDue = i => !S.psets[i.id];", ["tools/verify-design.js"]),
  "b": ("a lab shows before its phase", "platform/js/app.js",
        "  const labDue = l => lessonCleared(l.after) && currentPhase() >= l.phase && !(S.labs[l.id] || {}).done;",
        "  const labDue = l => lessonCleared(l.after) && !(S.labs[l.id] || {}).done;", ["tools/verify-design.js"]),
  "c": ("an after names a lesson that does not exist", "platform/data/workshop.js",
        'id: "1806-ps3", after: "math110.1.5",',
        'id: "1806-ps3", after: "math110.1.99",', ["tools/verify-content.js"]),
  "d": ("the Daily review row is never shown (review r1, finding 2)", "platform/js/app.js",
        "    const review = missPool().filter(p => questionUnlocked(p.bankId, D.QUIZZES[p.bankId].questions[p.idx])).length;",
        "    const review = 0;", ["tools/verify-design.js"]),
}
# Interrupt-safe (review r1): before a file is planted its original is copied
# to <file>.plant-backup, and removed only once it is restored. A run killed
# outright (SIGKILL, a container restart) leaves the backup behind, and the
# next run puts it back before anything else. SIGTERM/SIGHUP are turned into
# SystemExit so the `finally` below restores the file on those too.
import signal
def _exit(signum, frame): raise SystemExit(128 + signum)
for sig in (signal.SIGTERM, signal.SIGHUP): signal.signal(sig, _exit)
for _, path, _o, _n, _g in PLANTS.values():
    bk = os.path.join(ROOT, path) + ".plant-backup"
    if os.path.exists(bk):
        os.replace(bk, os.path.join(ROOT, path))
        print("restored %s from a backup a killed run left behind" % path)
which = sys.argv[1:] or sorted(PLANTS)
results = []
for key in which:
    name, path, old, new, gates = PLANTS[key]
    fp = os.path.join(ROOT, path)
    src = open(fp).read()
    assert src.count(old) == 1, (key, "anchor not found once")
    open(fp + ".plant-backup", "w").write(src)
    open(fp, "w").write(src.replace(old, new))
    try:
        for g in gates:
            r = subprocess.run(["node", g], cwd=ROOT, capture_output=True, text=True)
            fails = [l for l in r.stdout.splitlines() if "FAIL" in l]
            print("(%s) %s -> %s exit %d (%d FAIL lines)" % (key, name, g, r.returncode, len(fails)))
            for l in fails[:6]: print("      " + l.strip()[:240])
            results.append((key, r.returncode))
    finally:
        open(fp, "w").write(src)
        os.remove(fp + ".plant-backup")
ok = all(code == 1 for _, code in results)
print("ALL PLANTS EXIT 1" if ok else "SOME PLANT DID NOT EXIT 1: %r" % results)
sys.exit(0 if ok else 1)
