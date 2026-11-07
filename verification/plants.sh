#!/bin/bash
# T-063 plants. Each reintroduces one bug, runs the gate that must catch it, restores, cmp-checks.
# Exit 1 per plant that is (correctly) caught is reported; the script exits 1 if any plant was caught
# (expected), 2 if a plant slipped through or a restore differs.
cd "$(dirname "$0")/.." || exit 2
export NODE_PATH=/opt/node22/lib/node_modules
APP=platform/js/app.js; B=$(mktemp -d); cp "$APP" "$B/app.js"
restore() { cp "$B/app.js" "$APP"; cmp -s "$B/app.js" "$APP" || { echo "RESTORE FAILED"; exit 2; }; }
trap restore EXIT INT TERM
caught=0
plant() { # name, sed expr, gate
  sed -i "$2" "$APP"; cmp -s "$B/app.js" "$APP" && { echo "PLANT $1 did not change the file"; exit 2; }
  if node "$3" >"$B/out.txt" 2>&1; then echo "PLANT $1: NOT CAUGHT"; restore; exit 2; else echo "PLANT $1: caught (exit 1)"; caught=$((caught+1)); fi
  restore
}
plant rest-day-reanchors-past 's/const dT = studyAnchor();/const dT = studyToday();/' tools/verify-logic.js
plant glyph-always-empty 's/(S.lessons\[it.cid + "." + it.ui + "." + it.li\] || {}).done ? /false ? /; s/<span class="cd-ok" role="img" aria-label="done">✓<\/span>/<span class="cd-st cd-ring" role="img" aria-label="not watched"><\/span>/' tools/verify-design.js
trap - EXIT; restore
[ "$caught" -eq 2 ] && exit 1 || exit 2
