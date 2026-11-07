#!/bin/bash
# T-053 plants: put one bug back, run the gate that should catch it, require exit 1,
# restore the file byte-identically (cmp against a copy taken first).
#   plants.sh web    three plants against tools/verify-sync-loop.js
#   plants.sh dart   three plants against app/test/sync_test.dart
# Each run is saved as plant-<kind>-<n>-<name>.txt beside this script.
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$ROOT/loop/specs/T-053-private-sync/verification"
export PATH="$PATH:/opt/flutter/bin"
cd "$ROOT"
bad=0

# plant <kind> <n> <name> <file> <old> <new> <gate command...>
plant() {
  local kind="$1" n="$2" name="$3" file="$4" old="$5" new="$6"; shift 6
  local bak; bak="$(mktemp)"; cp "$file" "$bak"
  OLD="$old" NEW="$new" FILE="$file" python3 - <<'PY' || { echo "plant $n ($name): the text to replace is not in $file"; bad=1; cp "$bak" "$file"; return; }
import os, sys
p = os.environ["FILE"]; s = open(p, encoding="utf-8").read()
if s.count(os.environ["OLD"]) != 1: sys.exit(1)
open(p, "w", encoding="utf-8", newline="").write(s.replace(os.environ["OLD"], os.environ["NEW"], 1))
PY
  local log="$OUT/plant-$kind-$n-$name.txt"
  "$@" > "$log" 2>&1; local rc=$?
  cp "$bak" "$file"
  if cmp -s "$bak" "$file"; then local restored=restored; else local restored=NOT-RESTORED; bad=1; fi
  echo "exit $rc ($restored byte-identically, cmp)" >> "$log"
  echo "plant $kind $n $name: gate exit $rc, file $restored"
  [ "$rc" = 1 ] || { echo "  EXPECTED exit 1"; bad=1; }
  rm -f "$bak"
}

case "${1:-}" in
web)
  F=platform/js/app.js
  plant web 1 push-to-public-path "$F" \
    'const url = "https://api.github.com/repos/" + SYNC_REPO + (repoOnly' \
    'const url = "https://api.github.com/repos/" + (method === "PUT" ? "Nexline1/brickford" : SYNC_REPO) + (repoOnly' \
    node tools/verify-sync-loop.js
  plant web 2 repo-404-is-file-missing "$F" \
    'if (r.status === 404) throw new Error(SYNC_NO_ACCESS);' \
    'if (r.status === 404) return res;' \
    node tools/verify-sync-loop.js
  plant web 3 push-without-merge "$F" \
    '      let mergedIn = 0;
      if (remote) {' \
    '      let mergedIn = 0;
      if (false && remote) {' \
    node tools/verify-sync-loop.js
  ;;
dart)
  F=app/lib/state/sync.dart
  T=test/sync_test.dart
  plant dart 1 push-to-public-path "$F" \
    "Uri.parse('https://api.github.com/repos/\$repo\${repoOnly" \
    "Uri.parse('https://api.github.com/repos/\${method == 'PUT' ? _oldPublicRepo : repo}\${repoOnly" \
    bash -c "cd app && flutter test $T"
  plant dart 2 repo-404-is-file-missing "$F" \
    "if (r.statusCode == 404) throw _SyncError(\"Sync can't reach" \
    "if (r.statusCode == 404) return res; if (r.statusCode == 404) throw _SyncError(\"Sync can't reach" \
    bash -c "cd app && flutter test $T"
  plant dart 3 push-without-merge "$F" \
    'if (remote != null) mergedIn = m.quiet' \
    'if (false && remote != null) mergedIn = m.quiet' \
    bash -c "cd app && flutter test $T"
  ;;
*) echo "usage: plants.sh web|dart"; exit 2 ;;
esac
git -C "$ROOT" status --short -- platform app tools | sed 's/^/  tree: /'
exit $bad
