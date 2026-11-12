#!/usr/bin/env bash
# T-067 step 2 plant runner (the T-065 shape). Each plant edits one file in place, runs one gate,
# and must see it exit 1. The file is restored from a copy taken first, on every exit path, and
# compared byte for byte (cmp); a restore that does not compare identical stops the script (exit 3).
# sha256 of every planted file is printed before the first plant and after the last.
# The Dart plants (plan-v2-budget, plan-v2-backlog) run inside tools/verify-app.js itself.
# Usage: loop/specs/T-067-plan-v2/verification/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(dirname "$0")"
APP="$ROOT/platform/js/app.js"; PRE="$ROOT/platform/data/prerequisites.js"; CUR="$ROOT/platform/data/curriculum.js"
BAK=""; TARGET=""; CHILD=""; MISSED=0
echo "plants against $ROOT ($(cd "$ROOT" && git rev-parse --short HEAD))"
sums() { for f in "$APP" "$PRE" "$CUR"; do echo "  $(sha256sum "$f" | cut -c1-64)  ${f#$ROOT/}"; done; }
echo "sha256 before:"; sums
restore() {
  if [ -n "$BAK" ] && [ -f "$BAK" ]; then
    cp "$BAK" "$TARGET"
    if cmp -s "$BAK" "$TARGET"; then echo "  restored ${TARGET#$ROOT/} (cmp identical)"; rm -f "$BAK"; BAK=""
    else echo "  RESTORE FAILED: $TARGET differs from its copy $BAK (kept)"; BAK=""; exit 3; fi
  fi
}
trap 'restore' EXIT
trap 'restore; [ -n "$CHILD" ] && kill "$CHILD" 2>/dev/null; exit 130' INT TERM HUP

plant() {  # name file gate old new   (old must occur exactly once in file)
  local name="$1" file="$2" gate="$3" old="$4" new="$5"
  TARGET="$file"; BAK="$(mktemp)"; cp "$file" "$BAK"
  python3 - "$file" "$old" "$new" <<'PY' || { echo "PLANT $name: pattern not found exactly once"; restore; MISSED=$((MISSED + 1)); return 2; }
import sys; p, a, b = sys.argv[1:4]; s = open(p).read()
if s.count(a) != 1: sys.exit(1)
open(p, "w").write(s.replace(a, b))
PY
  echo "== plant $name -> node tools/verify-$gate.js"
  (cd "$ROOT" && exec timeout 3000 node "tools/verify-$gate.js") > "$OUT/plant-$name.txt" 2>&1 &
  CHILD=$!; wait "$CHILD"; local rc=$?; CHILD=""
  restore
  grep -E "^  FAIL|^PASS|invariant\(s\) FAILED|checks FAILED" "$OUT/plant-$name.txt" | cut -c1-260 | head -8
  echo "  exit $rc ($( [ $rc -eq 1 ] && echo 'caught, as required' || echo 'NOT CAUGHT' ))"
  [ $rc -eq 1 ] || MISSED=$((MISSED + 1))
  echo "exit $rc" >> "$OUT/plant-$name.txt"
}

want="${*:-v1-spine-alias v2-early budget-ai needs-ignored level-jump pack-over optional-scheduled videoless-scheduled backlog-owes content-unknown-need content-cycle content-ledger}"
for n in $want; do case "$n" in
  # (a) the v1 spine keeps the second-pass unit: a worked-ahead v1 day re-anchors into it (snapshot gate).
  v1-spine-alias) plant "$n" "$APP" logic 'flatLessons("ai200").filter(f => !f.l.alias).concat' 'flatLessons("ai200").concat' ;;
  # (a) v2 starts a week early: the last pre-cutover week no longer schedules what main did.
  v2-early) plant "$n" "$APP" logic 'const PLAN_V2_FROM = "2026-11-22";' 'const PLAN_V2_FROM = "2026-11-15";' ;;
  # (b) the AI / Python budget 70, not 60: the app no longer agrees with plan-dates.js.
  budget-ai) plant "$n" "$APP" logic 'const V2_MATH = 90, V2_AI = 60;' 'const V2_MATH = 90, V2_AI = 70;' ;;
  # (c) readiness ignores the map: lectures are scheduled before what they need.
  needs-ignored) plant "$n" "$APP" logic 'const ready = (e, day) => needs(e.k).every(' 'const ready = (e, day) => [].every(' ;;
  # (c) a level jump: CS50P lecture 4 marked advanced (3) between two intro (1) lectures.
  level-jump) plant "$n" "$PRE" logic '"cs100.0.4": { needs: ["cs100.0.3"], level: 1 },' '"cs100.0.4": { needs: ["cs100.0.3"], level: 3 },' ;;
  # (d) packing past the budget: a day takes lectures up to 1.6 x, not 1.05 x.
  pack-over) plant "$n" "$APP" logic 'if (ej > budget * 1.15 || eff + ej > budget * 1.05) break;' 'if (ej > budget * 1.15 || eff + ej > budget * 1.6) break;' ;;
  # (d) optional lectures are scheduled.
  optional-scheduled) plant "$n" "$APP" logic 'const v2Schedulable = l => !l.optional && !!(l.v || l.read || l.paper);' 'const v2Schedulable = l => !!(l.v || l.read || l.paper);' ;;
  # (d) a lecture with no video is scheduled (18.03 lecture 18).
  videoless-scheduled) plant "$n" "$APP" logic 'const v2Schedulable = l => !l.optional && !!(l.v || l.read || l.paper);' 'const v2Schedulable = l => !l.optional;' ;;
  # (e) the backlog owes a v1 lecture that v2 schedules again.
  backlog-owes) plant "$n" "$APP" logic 'if (!schedDone(it) && !v2Rescheduled(iso, k)) owed.add(k);' 'if (!schedDone(it)) owed.add(k);' ;;
  # verify-content: a need that resolves to nothing.
  content-unknown-need) plant "$n" "$PRE" content '"cs100.0.4": { needs: ["cs100.0.3"], level: 1 },' '"cs100.0.4": { needs: ["cs100.0.3", "cs100.9.9"], level: 1 },' ;;
  # verify-content: a cycle (CS50P 3 needs CS50P 4, which needs CS50P 3).
  content-cycle) plant "$n" "$PRE" content '"cs100.0.3": { needs: [], level: 1 },' '"cs100.0.3": { needs: ["cs100.0.4"], level: 1 },' ;;
  # verify-content: the ledger. ResNet points back at the AlexNet lecture.
  content-ledger) plant "$n" "$CUR" content '{ t: "ResNet — Deep Residual Learning (2015)", v: "GWt6Fu05voI",' '{ t: "ResNet — Deep Residual Learning (2015)", v: "DAOcjicFr1Y",' ;;
  *) echo "unknown plant $n"; MISSED=$((MISSED + 1)) ;;
esac; done
echo "sha256 after:"; sums
echo "$MISSED plant(s) not caught"
[ $MISSED -eq 0 ]
