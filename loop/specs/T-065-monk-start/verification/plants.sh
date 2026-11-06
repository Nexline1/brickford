#!/usr/bin/env bash
# T-065 plant runner (the T-062 shape, pointed at this worktree: ROOT is the repo this
# script sits in). Each plant edits platform/js/app.js, runs one gate, and must see it
# exit 1. The file is restored from a copy taken first, on every exit path (a normal
# finish, a failure, INT, TERM or HUP), and then compared byte for byte with that copy
# (cmp); a restore that does not compare identical stops the script (exit 3). The
# file's sha256 is printed before the first plant and after the last, so the two can
# be read side by side. The script exits 0 only when every plant it ran was caught.
# Usage: loop/specs/T-065-monk-start/verification/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(dirname "$0")"
export NODE_PATH=/opt/node22/lib/node_modules
APP="$ROOT/platform/js/app.js"
BAK=""; TARGET=""; CHILD=""; MISSED=0
echo "plants against $ROOT ($(cd "$ROOT" && git rev-parse --short HEAD))"
echo "app.js sha256 before: $(sha256sum "$APP" | cut -d' ' -f1)"
restore() {
  if [ -n "$BAK" ] && [ -f "$BAK" ]; then
    cp "$BAK" "$TARGET"
    if cmp -s "$BAK" "$TARGET"; then echo "  restored $TARGET (cmp identical)"; rm -f "$BAK"; BAK=""
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
  grep -E "^  FAIL|^FAIL|^PASS|invariant\(s\) FAILED|check\(s\) FAILED|assertion" "$OUT/plant-$name.txt" | cut -c1-260 | head -12
  echo "  exit $rc ($( [ $rc -eq 1 ] && echo 'caught, as required' || echo 'NOT CAUGHT' ))"
  [ $rc -eq 1 ] || MISSED=$((MISSED + 1))
  echo "exit $rc" >> "$OUT/plant-$name.txt"
}

want="${*:-start-overwrites merge-takes-later payload-has-monk click-starts import-replaces no-immediate-push}"
for n in $want; do case "$n" in
  # (a) startMonk lets a second press overwrite the first date.
  start-overwrites) plant "$n" "$APP" logic '    if (S.monkStart) return false;
' '' ;;
  # (b) mergeState takes the LATER of two start dates (an older device could then move it).
  merge-takes-later) plant "$n" "$APP" logic '(!S.monkStart || rm < S.monkStart)' '(!S.monkStart || rm > S.monkStart)' ;;
  # (c) S.monk goes back into the payload (the privacy rule of T-054 broken).
  payload-has-monk) plant "$n" "$APP" sync-loop 'if (MONK_SYNCS && S.monk) state.monk = S.monk;' 'if (S.monk) state.monk = S.monk;' ;;
  # (d) a single click on the final button starts it (the hold is bypassed).
  click-starts) plant "$n" "$APP" flows '    hold.addEventListener("contextmenu", e => e.preventDefault());
' '    hold.addEventListener("contextmenu", e => e.preventDefault());
    hold.addEventListener("click", () => { dlg.close(); if (startMonk()) render(); });
' ;;
  # (e) importBackup lets the backup's date replace this device's.
  import-replaces) plant "$n" "$APP" logic '        if (kept) S.monkStart = kept;' '        if (false) S.monkStart = kept;' ;;
  # (f) the start waits out the 4 s debounce instead of pushing at once.
  no-immediate-push) plant "$n" "$APP" sync-loop '    if (ghToken()) { clearTimeout(pushTimer); runSync("push"); }
' '' ;;
  *) echo "unknown plant $n"; MISSED=$((MISSED + 1)) ;;
esac; done
echo "app.js sha256 after:  $(sha256sum "$APP" | cut -d' ' -f1)"
echo "plants: $(( $(echo $want | wc -w) - MISSED )) of $(echo $want | wc -w) caught (each gate exit 1)"
[ $MISSED -eq 0 ]
