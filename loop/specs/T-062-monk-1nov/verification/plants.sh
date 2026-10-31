#!/usr/bin/env bash
# T-062 plant runner (copied from T-057's, pointed at this worktree: ROOT is
# the repo this script sits in, /home/user/bf-T-062 for the loop's build).
# Each plant edits one file, runs one gate, and must see it exit 1. The file
# is restored from a copy taken first, on every exit path: a normal finish, a
# failure, Ctrl-C (INT), TERM or HUP. Then it is compared byte for byte with
# the original (cmp), so a plant cannot outlive its run; a restore that does
# not compare identical stops the script (exit 3).
# The script exits 0 only when every plant it ran was caught (its gate exited 1).
# Usage: loop/specs/T-062-monk-1nov/verification/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(dirname "$0")"
export NODE_PATH=/opt/node22/lib/node_modules
APP="$ROOT/platform/js/app.js"
BAK=""; TARGET=""; CHILD=""; MISSED=0
echo "plants against $ROOT ($(cd "$ROOT" && git rev-parse --short HEAD))"
restore() {
  if [ -n "$BAK" ] && [ -f "$BAK" ]; then
    cp "$BAK" "$TARGET"
    if cmp -s "$BAK" "$TARGET"; then echo "  restored $TARGET (cmp identical)"; rm -f "$BAK"; BAK=""
    else echo "  RESTORE FAILED: $TARGET differs from its copy $BAK (kept)"; BAK=""; exit 3; fi
  fi
}
trap 'restore' EXIT
# The gate runs in the background and the script waits on it, so a signal
# interrupts the wait at once: the file is restored, then the gate is stopped.
trap 'restore; [ -n "$CHILD" ] && kill "$CHILD" 2>/dev/null; exit 130' INT TERM HUP

plant() {  # name file gate python-replacement(old) (new)
  local name="$1" file="$2" gate="$3" old="$4" new="$5"
  TARGET="$file"; BAK="$(mktemp)"; cp "$file" "$BAK"
  python3 - "$file" "$old" "$new" <<'PY' || { echo "PLANT $name: pattern not found"; restore; MISSED=$((MISSED + 1)); return 2; }
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
  [ $rc -eq 1 ] || MISSED=$((MISSED + 1))
  echo "exit $rc" >> "$OUT/plant-$name.txt"
}

want="${*:-days-90 ring-counts-also bfh-reads-brickford-bool priorities-not-first focus-counts-prestart phone-missing-counts phone-two-counts monk-from-30}"
for n in $want; do case "$n" in
  # The 90 days back (MONK.days 21 -> 90): monkDay("2026-11-22") is no longer null.
  days-90) plant "$n" "$APP" logic 'const MONK = Object.freeze({ from: "2026-11-01", days: 21,' 'const MONK = Object.freeze({ from: "2026-11-01", days: 90,' ;;
  # The ring counts the Also toggles as well as the five priorities.
  ring-counts-also) plant "$n" "$APP" logic 'const done = MONK_PRI.filter(([k]) => mkPriDone(d, k, method)).length, n = MONK_PRI.length;' 'const done = MONK_PRI.filter(([k]) => mkPriDone(d, k, method)).length + MONK_HABITS.filter(([k]) => mkHabitDone(d, k)).length, n = MONK_PRI.length + MONK_HABITS.length;' ;;
  # An old boolean `brickford: true` read as Brickford 3 h.
  bfh-reads-brickford-bool) plant "$n" "$APP" logic 'if (k === "bfh") return mkHours(d, "bfh", 3);' 'if (k === "bfh") return mkHours(d, "bfh", 3) || d.brickford === true;' ;;
  # Also above Priorities on #/monk.
  priorities-not-first) plant "$n" "$APP" design 'nowHTML + priHTML + topHTML + mapHTML + focusHTML + alsoHTML +' 'nowHTML + alsoHTML + topHTML + mapHTML + focusHTML + priHTML +' ;;
  # T-057 review round 1: monkFocus counting the days before day 1.
  focus-counts-prestart) plant "$n" "$APP" logic 'for (let i = addDaysISO(end, -6); i <= end; i = addDaysISO(i, 1)) if (i >= MONK.from) list.push(i);' 'for (let i = addDaysISO(end, -6); i <= end; i = addDaysISO(i, 1)) list.push(i);' ;;
  # T-057 review round 1: the phone rule's two edges.
  phone-missing-counts) plant "$n" "$APP" logic 'const mkPhoneOk = d => d.phone != null && d.phone < 2;' 'const mkPhoneOk = d => d.phone < 2;' ;;
  phone-two-counts) plant "$n" "$APP" logic 'const mkPhoneOk = d => d.phone != null && d.phone < 2;' 'const mkPhoneOk = d => d.phone != null && d.phone <= 2;' ;;
  # T-062: the old start back (1 Nov -> 30 Oct): 31 Oct reads day 2 instead of no row.
  monk-from-30) plant "$n" "$APP" logic 'const MONK = Object.freeze({ from: "2026-11-01", days: 21,' 'const MONK = Object.freeze({ from: "2026-10-30", days: 21,' ;;
  *) echo "unknown plant $n"; MISSED=$((MISSED + 1)) ;;
esac; done
echo "plants: $(( $(echo $want | wc -w) - MISSED )) of $(echo $want | wc -w) caught (each gate exit 1)"
[ $MISSED -eq 0 ]
