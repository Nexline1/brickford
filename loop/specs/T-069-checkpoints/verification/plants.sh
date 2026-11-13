#!/usr/bin/env bash
# T-069 plant runner (the T-067 shape). Each plant edits one file in place, runs one gate, and must see it
# exit 1 with the named check among its FAIL lines (flutter: among its failing tests). The file is restored
# from a copy taken first, on every exit path, and compared byte for byte (cmp); a restore that does not
# compare identical stops the script (exit 3). sha256 of every planted file is printed before the first
# plant and after the last. The verify-app plants (checkpoints-payload-drop, checkpoints-merge-older,
# checkpoints-auto-ignores-state) run inside node tools/verify-app.js itself, in a scratch copy.
# Usage: loop/specs/T-069-checkpoints/verification/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(dirname "$0")"
APP="$ROOT/platform/js/app.js"; MERGE="$ROOT/app/lib/engine/merge.dart"; BLOCK="$ROOT/app/lib/screens/home/checkpoints_block.dart"
BAK=""; TARGET=""; CHILD=""; MISSED=0
echo "plants against $ROOT ($(cd "$ROOT" && git rev-parse --short HEAD))"
sums() { for f in "$APP" "$MERGE" "$BLOCK"; do echo "  $(sha256sum "$f" | cut -c1-64)  ${f#$ROOT/}"; done; }
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
  if [ "$gate" = flutter ]; then
    echo "== plant $name -> flutter test (app/)"
    (cd "$ROOT/app" && exec timeout 3000 /opt/flutter/bin/flutter test) > "$OUT/plant-$name.txt" 2>&1 &
  else
    echo "== plant $name -> node tools/verify-$gate.js"
    (cd "$ROOT" && exec timeout 3000 node "tools/verify-$gate.js") > "$OUT/plant-$name.txt" 2>&1 &
  fi
  CHILD=$!; wait "$CHILD"; local rc=$?; CHILD=""
  restore
  grep -E "^  FAIL|^PASS|invariant\(s\) FAILED|checks FAILED|check\(s\) FAILED|\[E\]$|Some tests failed|All tests passed" "$OUT/plant-$name.txt" | cut -c1-260 | head -8
  local named=0; grep -E "FAIL|\[E\]$" "$OUT/plant-$name.txt" | grep -qE "$expect" && named=1
  echo "  exit $rc, the named check $( [ $named -eq 1 ] && echo failed || echo 'DID NOT fail' ) ($( [ $rc -eq 1 ] && [ $named -eq 1 ] && echo 'caught, as required' || echo 'NOT CAUGHT' ))"
  [ $rc -eq 1 ] && [ $named -eq 1 ] || MISSED=$((MISSED + 1))
  echo "exit $rc" >> "$OUT/plant-$name.txt"
}

want="${*:-web-merge-older web-render-writes web-auto-ignores-state web-tick-writes-twice flutter-push-drops flutter-home-never-unticks}"
for n in $want; do case "$n" in
  # verify-logic: the web checkpoint merge takes the OLDER `at`.
  web-merge-older) plant "$n" "$APP" logic "T-069: checkpoint ticks merge per item by" \
    'if (!mine[id] || String(t.at || "") > String((m && m.at) || ""))' 'if (!mine[id] || String(t.at || "") < String((m && m.at) || ""))' ;;
  # verify-logic: drawing the dashboard block writes (a "last seen" stamp, saved quietly: no push, but a write).
  web-render-writes) plant "$n" "$APP" logic "T-069: a render is a read" \
    '    const open = vs.findIndex(v => v.state !== "done");' \
    '    const open = vs.findIndex(v => v.state !== "done");
    S.checkpoints.seen = todayISO(); syncQuiet++; save(); syncQuiet--;' ;;
  # verify-logic: the web auto-tick ignores the state (CS50P 3-5 always done).
  web-auto-ignores-state) plant "$n" "$APP" logic "T-069: the auto-ticks follow the state" \
    'if (a.watched) return a.watched.every(k => !!(S.lessons[k] && S.lessons[k].done));' 'if (a.watched) return true;' ;;
  # verify-flows: a tick is chained as an event too (logEvent saves again): two writes per tick.
  web-tick-writes-twice) plant "$n" "$APP" flows "\(cp\) .*ticks an item: one write" \
    '        if (!cpToggle(cid, iid, cb.checked)) { cb.checked = !cb.checked; return; }
        save();' \
    '        if (!cpToggle(cid, iid, cb.checked)) { cb.checked = !cb.checked; return; }
        save(); logEvent("checkpoint", cid + "|" + iid, { done: cb.checked });' ;;
  # flutter test: the Dart payload drops checkpoints, so a phone push drops the laptop's ticks.
  flutter-push-drops) plant "$n" "$MERGE" flutter "a push carries the checkpoints" \
    "  if (S['checkpoints'] is Map && (S['checkpoints'] as Map).isNotEmpty) state['checkpoints'] = S['checkpoints'];
" "" ;;
  # flutter test: the Home block's row passes the item's current state, so a second tap never unticks.
  flutter-home-never-unticks) plant "$n" "$BLOCK" flutter "a tap ticks an item and a second unticks it" \
    'onTap: () => widget.m.cpToggle(v.id, x.id, !x.done)' 'onTap: () => widget.m.cpToggle(v.id, x.id, true)' ;;
  *) echo "unknown plant $n"; MISSED=$((MISSED + 1)) ;;
esac; done
echo "sha256 after:"; sums
echo "$MISSED plant(s) not caught"
[ $MISSED -eq 0 ]
