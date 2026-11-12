#!/usr/bin/env bash
# T-067 step 3 Flutter plant runner (the web step's shape). Each plant edits one Dart file IN PLACE, runs one
# gate (flutter test on the practice tests), and must see it exit 1 with the named test among its failures. The
# file is restored from a copy taken first, on every exit path, and compared byte for byte (cmp); a restore that
# does not compare identical stops the script (exit 3). sha256 of every planted file is printed before the first
# plant and after the last. (verify-app runs practice-payload-drop and practice-merge-older itself, on a scratch
# copy of the engine, against its parity checks.)
# Usage: loop/specs/T-067-plan-v2/verification-practice-app/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(cd "$(dirname "$0")" && pwd)"
FLUTTER="${FLUTTER:-/opt/flutter/bin/flutter}"
MERGE="$ROOT/app/lib/engine/merge.dart"; SYNC="$ROOT/app/lib/state/sync.dart"; BLOCK="$ROOT/app/lib/screens/lesson/practice_block.dart"
BAK=""; TARGET=""; CHILD=""; MISSED=0
echo "plants against $ROOT ($(cd "$ROOT" && git rev-parse --short HEAD))"
sums() { for f in "$MERGE" "$SYNC" "$BLOCK"; do echo "  $(sha256sum "$f" | cut -c1-64)  ${f#$ROOT/}"; done; }
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

plant() {  # name file expect old new   (old must occur exactly once in file; expect: a regex one failing test name must match)
  local name="$1" file="$2" expect="$3" old="$4" new="$5"
  TARGET="$file"; BAK="$(mktemp)"; cp "$file" "$BAK"
  python3 - "$file" "$old" "$new" <<'PY' || { echo "PLANT $name: pattern not found exactly once"; restore; MISSED=$((MISSED + 1)); return 2; }
import sys; p, a, b = sys.argv[1:4]; s = open(p).read()
if s.count(a) != 1: sys.exit(1)
open(p, "w").write(s.replace(a, b))
PY
  echo "== plant $name -> flutter test test/lecture_practice_test.dart"
  (cd "$ROOT/app" && exec timeout 1200 "$FLUTTER" test test/lecture_practice_test.dart) > "$OUT/plant-$name.txt" 2>&1 &
  CHILD=$!; wait "$CHILD"; local rc=$?; CHILD=""
  restore
  local fails; fails="$(sed -n '/^Failing tests:/,$p' "$OUT/plant-$name.txt" | grep -E "lecture_practice_test.dart: " | sed 's/.*lecture_practice_test.dart: //')"
  echo "$fails" | sed 's/^/  failed: /' | head -8
  local named=0; echo "$fails" | grep -qE "$expect" && named=1
  echo "  exit $rc, the named test $( [ $named -eq 1 ] && echo failed || echo 'DID NOT fail' ) ($( [ $rc -eq 1 ] && [ $named -eq 1 ] && echo 'caught, as required' || echo 'NOT CAUGHT' ))"
  [ $rc -eq 1 ] && [ $named -eq 1 ] || MISSED=$((MISSED + 1))
  echo "exit $rc" >> "$OUT/plant-$name.txt"
}

want="${*:-payload-drops-practice key-leak worked-visible merge-older}"
for n in $want; do case "$n" in
  # The Dart payload drops practice (what a Flutter push did before this port).
  payload-drops-practice) plant "$n" "$MERGE" "sync payload carries practice|push carries practice" \
    "  if (S['practice'] is Map && (S['practice'] as Map).isNotEmpty) state['practice'] = S['practice'];
" "" ;;
  # The Anthropic key leaks into what a push writes.
  key-leak) plant "$n" "$SYNC" "no PUT holds the key" \
    "'content': base64.encode(utf8.encode(encodePayload(syncPayload(_e, now: m.now())))),
" \
    "'content': base64.encode(utf8.encode(encodePayload(syncPayload(_e, now: m.now())..['grading'] = {'key': m.prefs.getString('brickford_anthropic_key')}))),
" ;;
  # A worked solution shows before any attempt.
  worked-visible) plant "$n" "$BLOCK" "worked solution is hidden before an attempt" \
    "final tried = prTried(it, ps);" "final tried = prTried(it, ps) || type == 'worked';" ;;
  # The practice merge takes the OLDER at.
  merge-older) plant "$n" "$MERGE" "the newer .at. wins" \
    "_s(t['at']).compareTo(_s(m0 is Map ? m0['at'] : null)) > 0" "_s(t['at']).compareTo(_s(m0 is Map ? m0['at'] : null)) < 0" ;;
  *) echo "unknown plant $n"; MISSED=$((MISSED + 1)) ;;
esac; done
echo "sha256 after:"; sums
echo "$MISSED plant(s) not caught"
[ $MISSED -eq 0 ]
