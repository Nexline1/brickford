#!/usr/bin/env bash
# T-054 plants: each puts one bug into platform/js/app.js, runs the gate that
# must catch it, and expects exit 1. app.js is backed up first and restored on
# any exit (including Ctrl-C); a backup left by an interrupted run is restored
# before anything else happens.
set -u
cd "$(dirname "$0")/../../../.."
export NODE_PATH=/opt/node22/lib/node_modules
APP=platform/js/app.js BAK=platform/js/app.js.plant-bak
if [ -f "$BAK" ]; then echo "leftover backup found: restoring $APP"; mv -f "$BAK" "$APP"; fi
restore() { [ -f "$BAK" ] && mv -f "$BAK" "$APP"; }
trap restore EXIT INT TERM
plant() {  # name, gate, python find, python replace
  cp "$APP" "$BAK"
  python3 - "$APP" "$3" "$4" <<'PY' || { echo "PLANT $1: pattern not found"; restore; return 1; }
import sys
p, a, b = sys.argv[1:4]
s = open(p).read()
assert s.count(a) == 1, "pattern count %d" % s.count(a)
open(p, "w").write(s.replace(a, b))
PY
  node "tools/verify-$2.js" > "/tmp/plant-$2.log" 2>&1; code=$?
  restore
  echo "plant $1 -> verify-$2 exit $code ($(grep -c '  FAIL' /tmp/plant-$2.log) FAIL lines)"
  grep -m3 '  FAIL' "/tmp/plant-$2.log" | cut -c1-200
}
plant "(a) a write during render" flows \
  '  V.monk = function () {
' '  V.monk = function () {
    monkStore(); monkSave();
'
plant "(b) monk in the push while MONK_SYNCS is false" sync-loop \
  'if (MONK_SYNCS && S.monk) state.monk = S.monk;' 'if (S.monk) state.monk = S.monk;'
plant "(c) an off-by-one in prayerTimes" logic \
  '+iso.slice(8, 10)) - LNG / (15 * 24);' '+iso.slice(8, 10) + 1) - LNG / (15 * 24);'
git diff --quiet -- "$APP" && echo "app.js restored, unchanged"
