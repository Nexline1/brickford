#!/usr/bin/env bash
# T-051-1 plant runner (T-061's, pointed at this item: ROOT is the repo this
# script sits in). Each plant edits one file, runs one gate, and must see it
# exit 1. The file is restored from a copy taken first, on every exit path: a
# normal finish, a failure, Ctrl-C (INT), TERM or HUP. Then it is compared byte
# for byte with the original (cmp), so a plant cannot outlive its run; a
# restore that does not compare identical stops the script (exit 3).
# The script exits 0 only when every plant it ran was caught (its gate exited 1).
# Usage: loop/specs/T-051-apple-system/verification-1/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(dirname "$0")"
export NODE_PATH=/opt/node22/lib/node_modules
APP="$ROOT/platform/js/app.js"
CSS="$ROOT/platform/css/style.css"
SW="$ROOT/sw.js"
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
  grep -E "^  FAIL|^FAIL|^PASS|^OVER|^NEW|^STALE|BELOW THRESHOLD|problem\(s\)" "$OUT/plant-$name.txt" | head -12
  echo "  exit $rc ($( [ $rc -eq 1 ] && echo 'caught, as required' || echo 'NOT CAUGHT' ))"
  [ $rc -eq 1 ] || MISSED=$((MISSED + 1))
  echo "exit $rc" >> "$OUT/plant-$name.txt"
}

GT_OLD='.grow .g-t {
  display: block; font-family: var(--font-body); font-weight: 600;
  font-size: var(--fs-headline);'
GT_NEW='.grow .g-t {
  display: block; font-family: var(--font-body); font-weight: 600;
  font-size: 1.375rem;'

want="${*:-density-two-line-sub density-dashboard-sentence density-more-words row-title-22-density row-title-22-design button-paints-44 contrast-accent-stock inter-not-precached hover-opacity crest-is-gold}"
for n in $want; do case "$n" in
  # verify-density 1: a 2-line subtitle. The dashboard's "Problems today"
  # subtitle, below the fold, ten words instead of three (no sentence rule broken).
  density-two-line-sub) plant "$n" "$APP" density \
    "'<span class=\"g-s\">before new material</span></span>' +" \
    "'<span class=\"g-s\">before new material, and the cards that are due come first</span></span>' +" ;;
  # verify-density 2: a returned sentence on the dashboard, 16 words under the title.
  density-dashboard-sentence) plant "$n" "$APP" density \
    "'<h1 class=\"folio dash-title\">Dashboard</h1>' +" \
    "'<h1 class=\"folio dash-title\">Dashboard</h1>' + '<p class=\"sub\">Every lecture you finish today moves the whole plan one real step closer to the finish.</p>' +" ;;
  # verify-density 3: a raised word count, the dashboard title five words longer
  # (no row, no sentence).
  density-more-words) plant "$n" "$APP" density \
    "'<h1 class=\"folio dash-title\">Dashboard</h1>' +" \
    "'<h1 class=\"folio dash-title\">Dashboard for today and this week</h1>' +" ;;
  # A 22px row title (the owner's phone): .g-t at Title 2 instead of 17px.
  # verify-density's one-line rule, and verify-design's type scale.
  row-title-22-density) plant "$n" "$CSS" density "$GT_OLD" "$GT_NEW" ;;
  row-title-22-design) plant "$n" "$CSS" design "$GT_OLD" "$GT_NEW" ;;
  # A button painted 44px: the 5px transparent hit edge taken away, so the
  # 44px box is all paint. The hit box is unchanged; the paint check catches it.
  button-paints-44) plant "$n" "$CSS" design \
    "  border: 5px solid transparent; border-radius: 999px;" \
    "  border: 0 solid transparent; border-radius: 999px;" ;;
  # A token reverted to the stock iOS hue its accessible shade replaced:
  # Light's tint #0066cc back to systemBlue #007aff (4.0:1 on white).
  contrast-accent-stock) plant "$n" "$CSS" contrast \
    "  --accent: #0066cc;      /* tint: links" \
    "  --accent: #007aff;      /* tint: links" ;;
  # Inter left out of the precache: sw.js skips the stylesheet's fonts.
  inter-not-precached) plant "$n" "$SW" offline \
    ".filter(u => u.startsWith(APP)).forEach(u => want.add(u));" \
    ".filter(u => u.startsWith(APP) && !/\\/fonts\\//.test(u)).forEach(u => want.add(u));" ;;
  # Review r1, 1: the unguarded opacity hover back (opacity 0.88 on every
  # .btn, every pointer), which took every kind under 4.5:1.
  hover-opacity) plant "$n" "$CSS" design \
    "@media (hover: hover) {
  .btn:hover:not(:disabled) { background-color: var(--btn-bg-hover); }" \
    ".btn:hover { opacity: 0.88; }
@media (hover: hover) {
  .btn:hover:not(:disabled) { background-color: var(--btn-bg-hover); }" ;;
  # Review r1, 2: the crest back on --gold (iOS orange), off the brand colour.
  crest-is-gold) plant "$n" "$CSS" design \
    ".crest .cr-field { fill: var(--crest); }" \
    ".crest .cr-field { fill: var(--gold); }" ;;
  *) echo "unknown plant $n"; MISSED=$((MISSED + 1)) ;;
esac; done
echo "plants: $(( $(echo $want | wc -w) - MISSED )) of $(echo $want | wc -w) caught (each gate exit 1)"
[ $MISSED -eq 0 ]
