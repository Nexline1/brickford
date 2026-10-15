#!/bin/bash
# run.sh <id> <title> <note> <file...> -- <apply-script> -- <gate-cmd>...
# Saves each file, applies the plant, records the diff, runs each gate, restores
# each file from the saved copy, cmp-checks it, re-runs the gates on the restored bytes.
S=/tmp/claude-0/-home-user-brickford/e8e314d5-7130-5570-8abd-d441eaf954df/scratchpad
cd /home/user/bf-T-037
export NODE_PATH=/opt/node22/lib/node_modules
V=loop/specs/T-037-spch100-full-course/verification
id=$1; title=$2; note=$3; shift 3
files=(); while [ "$1" != "--" ]; do files+=("$1"); shift; done; shift
apply=$1; shift; shift
gates=("$@")
X=':!'$V
mkdir -p $S/plant/$id
for f in "${files[@]}"; do mkdir -p "$S/plant/$id/$(dirname $f)"; cp -p "$f" "$S/plant/$id/$f"; done
echo "# Plant ($id): $title"
echo "# $(date -u +%FT%TZ), commit $(git rev-parse --short HEAD). $note"
echo
echo "## The plant"
echo "\$ $apply"
bash -c "$apply"
echo "\$ git status --short (outside verification/)"; git status --short -- . "$X"
echo "\$ git diff --stat; git diff"
git diff --stat -- . "$X"; git diff -- . "$X" | head -60
echo
echo "## The gates, on the planted bytes"
for g in "${gates[@]}"; do
  echo "\$ $g"
  bash -c "$g" > $S/plant/$id/out 2>&1; rc=$?
  grep -E 'FAIL|MOVED|DIFF|RESULT|Error' $S/plant/$id/out | head -15
  tail -1 $S/plant/$id/out
  echo "exit $rc"
  echo
done
echo "## Restore"
for f in "${files[@]}"; do
  cp -p "$S/plant/$id/$f" "$f"
  if cmp "$S/plant/$id/$f" "$f"; then echo "cmp $f: identical to the saved copy"; else echo "cmp $f: DIFFERS"; fi
done
st=$(git status --short -- . "$X")
echo "git status outside verification/: $([ -z "$st" ] && echo clean || echo "DIRTY: $st")"
echo "git diff HEAD outside verification/: $([ -z "$(git diff HEAD -- . "$X")" ] && echo none || echo PRESENT)"
for g in "${gates[@]}"; do
  echo "\$ $g   (restored)"
  bash -c "$g" > $S/plant/$id/out 2>&1; rc=$?
  tail -1 $S/plant/$id/out; echo "exit $rc"
done
