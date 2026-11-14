#!/bin/bash
cd /home/user/bf-T-073
export TZ=America/Los_Angeles
OUT=loop/specs/T-073-pytorch-slice/verification/plants.txt
: > $OUT
plant() { # name file python-edit
  local name=$1 file=$2 edit=$3
  local before=$(sha256sum "$file" | cut -d' ' -f1)
  cp "$file" /tmp/t073-plant-backup
  python3 -c "$edit" "$file" || { echo "PLANT $name: edit failed" >> $OUT; return; }
  local planted=$(sha256sum "$file" | cut -d' ' -f1)
  node tools/verify-content.js > /tmp/t073-plant-$name.txt 2>&1; local rc=$?
  cp /tmp/t073-plant-backup "$file"
  local after=$(sha256sum "$file" | cut -d' ' -f1)
  echo "plant $name ($file): exit $rc; planted file differed: $([ "$planted" != "$before" ] && echo yes || echo NO); restored byte-identical: $([ "$after" = "$before" ] && echo yes || echo NO)" >> $OUT
  grep "FAIL" /tmp/t073-plant-$name.txt | sed 's/^/    /' >> $OUT
}
plant wrong-output platform/data/practice-cs100.js 'import sys;p=sys.argv[1];s=open(p).read();a="out: \"(3, 3) 4 15 53 (2, 2)\"";assert s.count(a)==1;open(p,"w").write(s.replace(a,"out: \"(3, 3) 4 15 54 (2, 2)\""))'
plant list-restatement-removed tools/verify-content.js 'import sys,re;p=sys.argv[1];s=open(p).read();i=s.index("  \"cs100.1.1/p1\": \"A = [[1, 0]");j=s.index("\n};",i);open(p,"w").write(s[:i]+s[j+1:])'
plant ratchet-raised tools/verify-content.practice-baseline.json 'import sys;p=sys.argv[1];s=open(p).read();assert "\"uncovered\": 281" in s;open(p,"w").write(s.replace("\"uncovered\": 281","\"uncovered\": 282"))'
git status --short >> $OUT
echo PDONE >> $OUT
