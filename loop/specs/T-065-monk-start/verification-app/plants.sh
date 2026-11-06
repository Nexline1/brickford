#!/usr/bin/env bash
# Runs the four T-065 app plants one at a time. verify-app.js plants into a scratch copy of app/lib/engine and
# app/tool (the repo is never edited); this also snapshots the files a plant edits and cmp's them afterwards, so
# "restored byte-identically" is measured, not assumed. Each plant must exit 1.
cd "$(dirname "$0")/../../../.." || exit 2
export PATH=/opt/flutter/bin:$PATH
V=loop/specs/T-065-monk-start/verification-app
FILES="app/lib/engine/engine.dart app/lib/engine/merge.dart app/lib/engine/monk.dart app/tool/engine_dump.dart"
SNAP=$(mktemp -d)
for f in $FILES; do mkdir -p "$SNAP/$(dirname "$f")"; cp "$f" "$SNAP/$f"; done
bad=0
for p in monk-start-overwrites monk-merge-later monk-payload-monk monk-day-unstarted; do
  node tools/verify-app.js --plant "$p" > "$V/plant-$p.txt" 2>&1
  code=$?
  same=yes
  for f in $FILES; do cmp -s "$f" "$SNAP/$f" || same=NO; done
  caught=$(grep -c '^  FAIL' "$V/plant-$p.txt")
  echo "plant $p: exit $code (want 1), failing checks $caught, files byte-identical after: $same"
  [ "$code" = 1 ] && [ "$same" = yes ] || bad=1
done
rm -rf "$SNAP"
exit $bad
