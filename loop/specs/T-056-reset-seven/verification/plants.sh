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

want="${*:-grandfather-old-date monk-off-by-one work-ahead-removed ahead-despite-backlog rest-dow-5 dateforstudy-off-by-one saturday-not-rest seal-on-non-sunday seal-labels-plan-week review-seals-plan-week library-tile-range}"
for n in $want; do case "$n" in
  grandfather-old-date) plant "$n" "$APP" logic 'const QUIZ_GATE_FROM = "2026-10-24";' 'const QUIZ_GATE_FROM = "2026-10-16";' ;;
  monk-off-by-one) plant "$n" "$APP" logic 'const MONK = Object.freeze({ from: "2026-10-24",' 'const MONK = Object.freeze({ from: "2026-10-23",' ;;
  work-ahead-removed) plant "$n" "$APP" logic '    if (real.length) {
      const ahead' '    if (false) {
      const ahead' ;;
  ahead-despite-backlog) plant "$n" "$APP" logic 'return owed > 0 ? "today is done · "' 'return false ? "today is done · "' ;;
  rest-dow-5) plant "$n" "$APP" logic 'const REST_DOW = 6;' 'const REST_DOW = 5;' ;;
  dateforstudy-off-by-one) plant "$n" "$APP" logic 'k + 1 + Math.floor(j / 6) * 7 + (j % 6));' 'k + 2 + Math.floor(j / 6) * 7 + (j % 6));' ;;
  saturday-not-rest) plant "$n" "$APP" design 'if (before || resting) cls.push("rest");' 'if (before) cls.push("rest");' ;;
  # Round 2 (the owner's "Keep Sunday"): the seal offered on a non-Sunday; the
  # seal tile naming the plan week in progress; the Week page sealing the plan
  # week; a Library tile showing a range that is not its revision week.
  seal-on-non-sunday) plant "$n" "$APP" logic 'function isSealDay(iso) { return dowOf(iso) === 0 &&' 'function isSealDay(iso) { return dowOf(iso) !== 6 &&' ;;
  seal-labels-plan-week) plant "$n" "$APP" logic '[["Seal the week", 30, "Week " + sealW.r + ' '[["Seal the week", 30, "Week " + w + ' ;;
  review-seals-plan-week) plant "$n" "$APP" design 'const today = todayISO(), w = revisionWeekOf(today);' 'const today = todayISO(), w = weekNumber();' ;;
  # Round 3: the work-ahead card skipping an owed lecture (the round-2 behaviour).
  next-skips-owed) plant "$n" "$APP" logic 'const ahead = (backlogCount() > 0 && firstOwed()) || realSched(' 'const ahead = realSched(' ;;
  old-week-collides) plant "$n" "$APP" logic 'const sealed = S.weeks.find(x => +x.week === w && (x.date || "") >= from);' 'const sealed = S.weeks.find(x => +x.week === w);' ;;
  old-week-overwritten) plant "$n" "$APP" logic 'const i = S.weeks.findIndex(x => +x.week === w && (x.date || "") >= wFrom);' 'const i = S.weeks.findIndex(x => +x.week === w);' ;;
  gate-on-merge-day) plant "$n" "$APP" logic 'const QUIZ_GATE_FROM = "2026-10-24";' 'const QUIZ_GATE_FROM = "2026-10-23";' ;;
  gate-not-strict) plant "$n" "$APP" logic 'firstWatched(st) < QUIZ_GATE_FROM);' 'firstWatched(st) <= QUIZ_GATE_FROM);' ;;
  week-merge-number-only) plant "$n" "$APP" logic 'const i = S.weeks.findIndex(x => +x.week === +w.week && side(x) === side(w));' 'const i = S.weeks.findIndex(x => +x.week === +w.week);' ;;
  library-tile-range) plant "$n" "$APP" content 'dates: shortRange(rw.from, rw.to),' 'dates: shortRange(rw.from, rw.sun),' ;;
  *) echo "unknown plant $n" ;;
esac; done
