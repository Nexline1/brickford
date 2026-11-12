#!/usr/bin/env bash
# T-067 step 3 plant runner (the step-2 shape). Each plant edits one file in place, runs one gate,
# and must see it exit 1 with the named check among its FAIL lines. The file is restored from a
# copy taken first, on every exit path, and compared byte for byte (cmp); a restore that does not
# compare identical stops the script (exit 3). sha256 of every planted file is printed before the
# first plant and after the last.
# Usage: loop/specs/T-067-plan-v2/verification-practice/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(dirname "$0")"
APP="$ROOT/platform/js/app.js"; P110="$ROOT/platform/data/practice-math110.js"; BASE="$ROOT/tools/verify-content.practice-baseline.json"
BAK=""; TARGET=""; CHILD=""; MISSED=0
echo "plants against $ROOT ($(cd "$ROOT" && git rev-parse --short HEAD))"
sums() { for f in "$APP" "$P110" "$BASE"; do echo "  $(sha256sum "$f" | cut -c1-64)  ${f#$ROOT/}"; done; }
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

plant() {  # name file gate expect old new   (old must occur exactly once in file; expect: a regex one FAIL line must match)
  local name="$1" file="$2" gate="$3" expect="$4" old="$5" new="$6"
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
  grep -E "^  FAIL|^PASS|invariant\(s\) FAILED|checks FAILED|check\(s\) FAILED|assertions? broken" "$OUT/plant-$name.txt" | cut -c1-260 | head -8
  local named=0; grep -E "FAIL" "$OUT/plant-$name.txt" | grep -qE "$expect" && named=1
  echo "  exit $rc, the named check $( [ $named -eq 1 ] && echo failed || echo 'DID NOT fail' ) ($( [ $rc -eq 1 ] && [ $named -eq 1 ] && echo 'caught, as required' || echo 'NOT CAUGHT' ))"
  [ $rc -eq 1 ] && [ $named -eq 1 ] || MISSED=$((MISSED + 1))
  echo "exit $rc" >> "$OUT/plant-$name.txt"
}

want="${*:-wrong-numeric ratchet-loosened optional-owed key-leak worked-visible}"
for n in $want; do case "$n" in
  # verify-content: a wrong numeric answer in the data (det of diag(4,-3) stored as +12).
  wrong-numeric) plant "$n" "$P110" content "math110.0.5/p1: num 12 is recomputed" \
    '{ id: "p1", type: "numeric", q: "$\\det\\begin{pmatrix}4&0\\\\0&-3\\end{pmatrix}$ is:", num: -12,' \
    '{ id: "p1", type: "numeric", q: "$\\det\\begin{pmatrix}4&0\\\\0&-3\\end{pmatrix}$ is:", num: 12,' ;;
  # verify-content: the ratchet loosened (one more uncovered lecture allowed).
  ratchet-loosened) plant "$n" "$BASE" content "practice ratchet" '"uncovered": 294' '"uncovered": 295' ;;
  # verify-logic: an optional lecture counted as owed (backlogCount stops skipping it).
  optional-owed) plant "$n" "$APP" logic "an optional lecture is never owed" \
    'if (it.l.optional) return; if (!schedDone(it)' 'if (!schedDone(it)' ;;
  # verify-sync-loop: the Anthropic key leaks into the sync payload.
  key-leak) plant "$n" "$APP" sync-loop "Anthropic key is in no PUT" \
    'if (S.practice && Object.keys(S.practice).length) state.practice = S.practice;' \
    'if (S.practice && Object.keys(S.practice).length) state.practice = S.practice; state.grading = { key: aiKey() };' ;;
  # verify-flows: a worked solution rendered before any attempt.
  worked-visible) plant "$n" "$APP" flows "worked solution is not in the page before an attempt" \
    'const tried = prTried(it, ps);' 'const tried = prTried(it, ps) || it.type === "worked";' ;;
  *) echo "unknown plant $n"; MISSED=$((MISSED + 1)) ;;
esac; done
echo "sha256 after:"; sums
echo "$MISSED plant(s) not caught"
[ $MISSED -eq 0 ]
