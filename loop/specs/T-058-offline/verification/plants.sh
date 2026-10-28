#!/usr/bin/env bash
# T-058 plant runner. Each plant edits one file, runs tools/verify-offline.js,
# and must see it exit 1. The file is restored from a copy taken first, on
# every exit path: a normal finish, a failure, Ctrl-C (INT), TERM or HUP. Then
# it is compared byte for byte with the original (cmp), so a plant cannot
# outlive its run; a restore that does not compare identical fails the script.
# The script exits 0 only when every plant named was caught (gate exit 1) and
# every restore compared identical.
# Usage: loop/specs/T-058-offline/verification/plants.sh [name ...]
set -u
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$(dirname "$0")"
export NODE_PATH=/opt/node22/lib/node_modules
APP="$ROOT/platform/js/app.js"
SW="$ROOT/sw.js"
BAK=""; TARGET=""; CHILD=""; BAD=0
restore() {
  if [ -n "$BAK" ] && [ -f "$BAK" ]; then
    cp "$BAK" "$TARGET"
    if cmp -s "$BAK" "$TARGET"; then echo "  restored $TARGET (cmp identical)"
    else echo "  RESTORE FAILED: $TARGET differs from its copy at $BAK (kept)"; BAD=1; BAK=""; return 1; fi
    rm -f "$BAK"; BAK=""
  fi
}
trap 'restore' EXIT
# The gate runs in the background and the script waits on it, so a signal
# interrupts the wait at once: the file is restored, then the gate is stopped.
trap 'restore; [ -n "$CHILD" ] && kill "$CHILD" 2>/dev/null; exit 130' INT TERM HUP

plant() {  # name file old new
  local name="$1" file="$2" old="$3" new="$4"
  TARGET="$file"; BAK="$(mktemp)"; cp "$file" "$BAK"
  python3 - "$file" "$old" "$new" <<'PY' || { echo "PLANT $name: pattern not found exactly once"; restore; BAD=1; return 2; }
import sys; p, a, b = sys.argv[1:4]; s = open(p).read()
if s.count(a) != 1: sys.exit(1)
open(p, "w").write(s.replace(a, b))
PY
  if cmp -s "$BAK" "$file"; then echo "PLANT $name: file unchanged"; restore; BAD=1; return 2; fi
  echo "== plant $name -> node tools/verify-offline.js"
  (cd "$ROOT" && exec timeout 900 node tools/verify-offline.js) > "$OUT/plant-$name.txt" 2>&1 &
  CHILD=$!; wait "$CHILD"; local rc=$?; CHILD=""
  restore || true
  grep -E "^  FAIL|^FAIL|^PASS" "$OUT/plant-$name.txt" | head -12
  echo "  exit $rc ($( [ $rc -eq 1 ] && echo 'caught, as required' || echo 'NOT CAUGHT' ))"
  echo "exit $rc" >> "$OUT/plant-$name.txt"
  [ $rc -eq 1 ] || BAD=1
}

want="${*:-data-file-left-out index-cache-first offline-push-rejected old-caches-kept no-timeout fill-in-install owed-ignored-at-boot busy-push-dropped no-answer-is-failure frame-kept-when-net-down offline-before-latch}"
for n in $want; do case "$n" in
  # A data file left out of the precache: install skips quiz-dsa.js.
  data-file-left-out) plant "$n" "$SW" \
    '  const want = new Set(refs.filter(u => u.href.startsWith(APP) && !u.hash).map(u => u.href));' \
    '  const want = new Set(refs.filter(u => u.href.startsWith(APP) && !u.hash).map(u => u.href));
  for (const u of want) if (/\/data\/quiz-dsa\.js/.test(u)) want.delete(u);' ;;
  # index.html cache-first: a stale page, so an update never arrives.
  index-cache-first) plant "$n" "$SW" \
    '  const cached = () => caches.match(INDEX, { cacheName: SHELL });
  try {' \
    '  const cached = () => caches.match(INDEX, { cacheName: SHELL });
  { const hit = await cached(); if (hit) return hit; }
  try {' ;;
  # An offline push treated as a token rejection: recorded as fatal, latched.
  offline-push-rejected) plant "$n" "$APP" \
    '    if (offline()) { syncOffline = true; say(OFFLINE_SAY); return Promise.resolve(false); }' \
    '    if (offline()) { syncFailed("Token rejected — offline"); return Promise.resolve(false); }' ;;
  # Old caches not deleted on activate.
  old-caches-kept) plant "$n" "$SW" \
    'if (name.startsWith("brickford-") && name !== SHELL && name !== FILES) await caches.delete(name);' \
    'if (name.startsWith("brickford-") && name !== SHELL && name !== FILES) void name;' ;;
  # Review r1, 1: no timeout, so a network that never answers holds the launch.
  no-timeout) plant "$n" "$SW" \
    '    const first = await Promise.race([net, late]);' \
    '    const first = await net;' ;;
  # Review r1, 2: the files cache filled inside install, so one stalled PDF holds activation.
  fill-in-install) plant "$n" "$SW" \
    '  // Nothing else: installing waits on the shell alone (fill, below).
  await self.skipWaiting();' \
    '  await fill();
  await self.skipWaiting();' ;;
  # Review r1, 3: the debt not read at boot (a pull, as before), so a relaunch never pushes it.
  owed-ignored-at-boot) plant "$n" "$APP" \
    '    if (ghToken()) runSync(owedMark() ? "push" : "pull");' \
    '    if (ghToken()) runSync("pull");' ;;
  # Review r1, 3: a push asked for while a pull is out is dropped.
  busy-push-dropped) plant "$n" "$APP" \
    '    if (syncBusy) { if (dir === "push") pushAgain = true; return Promise.resolve(false); }' \
    '    if (syncBusy) return Promise.resolve(false);' ;;
  # Review r1, 4: a fetch with no answer (navigator.onLine true) treated as a sync failure.
  no-answer-is-failure) plant "$n" "$APP" \
    '      if (offline() || err.network) { markOwed(); netState(true); say(OFFLINE_SAY); return false; }' \
    '      if (offline()) { markOwed(); netState(true); say(OFFLINE_SAY); return false; }' ;;
  # Review r1, 4: the lesson trusts navigator.onLine alone; a frame drawn before the failure stays.
  frame-kept-when-net-down) plant "$n" "$APP" \
    '    if (!f || heardFrom === f) return;' \
    '    if (f || !f) return;' ;;
  # Review r1, 5: offline tested before the latch, so a rejected token reads "will sync".
  offline-before-latch) plant "$n" "$APP" \
    '    if (latched()) return { t: "Synced", v: "failing" };' \
    '' ;;
  *) echo "unknown plant $n"; BAD=1 ;;
esac; done
echo
[ $BAD -eq 0 ] && echo "PLANTS: every plant caught (exit 1), every restore cmp-identical" || echo "PLANTS: FAILED (a plant was not caught, did not apply, or did not restore)"
exit $BAD
