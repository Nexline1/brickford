#!/usr/bin/env bash
# T-056 plant runner. Each plant edits one file, runs one gate, and must see
# it exit 1. The file is restored from a copy taken first, on every exit path:
# a normal finish, a failure, Ctrl-C (INT), TERM or HUP. Then it is compared
# byte for byte with the original (cmp), so a plant cannot outlive its run.
# Usage: loop/specs/T-056-reset-seven/verification/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(dirname "$0")"
export NODE_PATH=/opt/node22/lib/node_modules
APP="$ROOT/platform/js/app.js"
BAK=""; TARGET=""; CHILD=""
restore() { if [ -n "$BAK" ] && [ -f "$BAK" ]; then cp "$BAK" "$TARGET"; cmp -s "$BAK" "$TARGET" && echo "  restored $TARGET (cmp identical)"; rm -f "$BAK"; BAK=""; fi; }
trap 'restore' EXIT
# The gate runs in the background and the script waits on it, so a signal
# interrupts the wait at once: the file is restored, then the gate is stopped.
trap 'restore; [ -n "$CHILD" ] && kill "$CHILD" 2>/dev/null; exit 130' INT TERM HUP

plant() {  # name file gate python-replacement(old) (new)
  local name="$1" file="$2" gate="$3" old="$4" new="$5"
  TARGET="$file"; BAK="$(mktemp)"; cp "$file" "$BAK"
  python3 - "$file" "$old" "$new" <<'PY' || { echo "PLANT $name: pattern not found"; restore; return 2; }
import sys; p, a, b = sys.argv[1:4]; s = open(p).read()
if s.count(a) != 1: sys.exit(1)
open(p, "w").write(s.replace(a, b))
PY
  echo "== plant $name -> node tools/verify-$gate.js"
  (cd "$ROOT" && exec timeout 3000 node "tools/verify-$gate.js") > "$OUT/plant-$name.txt" 2>&1 &
  CHILD=$!; wait "$CHILD"; local rc=$?; CHILD=""
  restore
  grep -E "^  FAIL|^FAIL|^PASS|invariant\(s\) FAILED|check\(s\) FAILED" "$OUT/plant-$name.txt" | head -12
  echo "  exit $rc ($( [ $rc -eq 1 ] && echo 'caught, as required' || echo 'NOT CAUGHT' ))"
  echo "exit $rc" >> "$OUT/plant-$name.txt"
}

want="${*:-grandfather-old-date monk-off-by-one work-ahead-removed rest-dow-5 dateforstudy-off-by-one saturday-not-rest}"
for n in $want; do case "$n" in
  grandfather-old-date) plant "$n" "$APP" logic 'const QUIZ_GATE_FROM = "2026-10-23";' 'const QUIZ_GATE_FROM = "2026-10-16";' ;;
  monk-off-by-one) plant "$n" "$APP" logic 'const MONK = Object.freeze({ from: "2026-10-24",' 'const MONK = Object.freeze({ from: "2026-10-23",' ;;
  work-ahead-removed) plant "$n" "$APP" logic '    if (real.length) {
      const ahead' '    if (false) {
      const ahead' ;;
  rest-dow-5) plant "$n" "$APP" logic 'const REST_DOW = 6;' 'const REST_DOW = 5;' ;;
  dateforstudy-off-by-one) plant "$n" "$APP" logic 'k + 1 + Math.floor(j / 6) * 7 + (j % 6));' 'k + 2 + Math.floor(j / 6) * 7 + (j % 6));' ;;
  saturday-not-rest) plant "$n" "$APP" design 'if (before || resting) cls.push("rest");' 'if (before) cls.push("rest");' ;;
  *) echo "unknown plant $n" ;;
esac; done
