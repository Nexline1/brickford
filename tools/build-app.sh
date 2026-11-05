#!/usr/bin/env bash
# build-app.sh — build the Flutter web app (T-064) and copy it to app-web/.
#
#   tools/build-app.sh            FLUTTER=/path/to/flutter to override
#
# GitHub Pages serves the repo root (with .nojekyll), so app-web/ is
# https://nexline1.github.io/brickford/app-web/, beside /brickford/platform/.
# /brickford/app/ is the Flutter project's own folder; its one served file is
# app/index.html, a hand-written redirect to app-web/. The build output never
# goes into app/ itself: app/.gitignore keeps any copy there out of git.
#
# app-web/ is replaced whole on every run, so nothing from an old build lingers.
# Left out: debug symbols, the wasm-renderer files (this is a dart2js +
# CanvasKit build, which loads canvaskit/ and canvaskit/chromium/ only), and
# Flutter's deprecated flutter_service_worker.js (web/flutter_bootstrap.js
# registers no worker; the site's sw.js answers only for platform/, the
# revision PDFs and the font/KaTeX hosts, so it leaves app-web/ alone).
# CanvasKit is bundled (--no-web-resources-cdn): the app needs no third-party host.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
FLUTTER=${FLUTTER:-/opt/flutter/bin/flutter}
BASE=/brickford/app-web/
OUT="$ROOT/app-web"

node "$ROOT/tools/export-data.js" --check
cd "$ROOT/app"
"$FLUTTER" build web --release --base-href "$BASE" --no-web-resources-cdn --no-wasm-dry-run

rm -rf "$OUT"
mkdir -p "$OUT"
(cd build/web && find . -type f ! -name '*.symbols' ! -name '.last_build_id' ! -name 'flutter_service_worker.js' \
  ! -path './canvaskit/skwasm*' ! -path './canvaskit/wimp*' ! -path './canvaskit/webparagraph/*' -print0 \
  | while IFS= read -r -d '' f; do mkdir -p "$OUT/$(dirname "$f")"; cp "$f" "$OUT/$f"; done)

grep -q "<base href=\"$BASE\">" "$OUT/index.html" || { echo "build-app: index.html does not carry base $BASE" >&2; exit 1; }
echo "build-app: $(find "$OUT" -type f | wc -l) files, $(du -sb "$OUT" | cut -f1) bytes in app-web/ (base $BASE)"
