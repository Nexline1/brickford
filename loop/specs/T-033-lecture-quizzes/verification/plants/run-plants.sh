#!/bin/bash
# T-033 plants (a)-(f) against tools/verify-content.js, (g) against check-evidence.js. Each plant: back up the
# file, apply the bug, run the gate (must exit 1), restore, and prove the restore
# byte for byte with cmp against the backup AND against git HEAD.
cd "$(dirname "$0")/../../../../.." || exit 2
OUT=loop/specs/T-033-lecture-quizzes/verification/plants
export PYTHONDONTWRITEBYTECODE=1
SP=${TMPDIR:-/tmp}/t033-plants; mkdir -p "$SP"
F=platform/data/summaries-ai310.js
run() {  # name, description, python-edit
  local name=$1 desc=$2 edit=$3
  cp "$F" "$SP/backup.js"
  python3 -c "$edit" "$F"
  git diff --no-color -- "$F" > "$OUT/plant-$name.diff"
  node tools/verify-content.js > "$OUT/plant-$name-verify-content.txt" 2>&1; local code=$?
  cp "$SP/backup.js" "$F"
  cmp "$SP/backup.js" "$F" && local c1=identical || local c1=DIFFERENT
  git show HEAD:"$F" > "$SP/head.js"; cmp "$SP/head.js" "$F" && local c2=identical || local c2=DIFFERENT
  echo "plant ($name) $desc: verify-content exit $code; restored: cmp backup $c1, cmp HEAD $c2" | tee -a "$OUT/plants-summary.txt"
  grep "FAIL" "$OUT/plant-$name-verify-content.txt" | sed 's/^/    /' | tee -a "$OUT/plants-summary.txt"
}
: > "$OUT/plants-summary.txt"
node tools/verify-content.js > /dev/null 2>&1; echo "baseline: verify-content exit $? on HEAD" | tee -a "$OUT/plants-summary.txt"
run a "one numeric answer changed (ai310.1.0 ViT patches 196 -> 197)" \
  'import sys;p=sys.argv[1];s=open(p).read();a="num: 196,";assert s.count(a)==1;open(p,"w").write(s.replace(a,"num: 197,"))'
run b "an answer index out of range (ai310.1.0 check 0: a 0 -> 4)" \
  'import sys;p=sys.argv[1];s=open(p).read();a="get back a label and a score. What happened in between?\", opts: [";i=s.index(a);j=s.index("], a: 0,",i);open(p,"w").write(s[:j]+"], a: 4,"+s[j+len("], a: 0,"):])'
run c "a >90-min lecture with 5 checks (planted video fixture ai200.2.1, 211 min, 5 checks)" \
  "import sys;sys.path.insert(0,'$OUT');import fixture;fixture.plant(sys.argv[1],5)"
run c-control "control for (c) and (e): the same fixture with 8 checks, all at in range (must PASS, exit 0)" \
  "import sys;sys.path.insert(0,'$OUT');import fixture;fixture.plant(sys.argv[1],8)"
run d "the answer made the unique longest in every MCQ of one lesson (ai310.1.2)" \
  'import sys,re
p=sys.argv[1];s=open(p).read();i=s.index("\"ai310.1.2\": {");j=s.index("\"ai310.1.3\": {")
blk=s[i:j]
def fix(m):
  opts=re.findall(r"\"((?:[^\"\\\\]|\\\\.)*)\"",m.group(1));a=int(m.group(2))
  opts[a]=opts[a]+" — and this answer has been padded to be the longest"
  return "opts: ["+", ".join("\""+o+"\"" for o in opts)+"], a: "+m.group(2)+","
blk2=re.sub(r"opts: \[(.*?)\], a: (\d),",fix,blk)
assert blk2!=blk;open(p,"w").write(s[:i]+blk2+s[j:])'
run e "at beyond the video's length (fixture with 8 checks, check 7 at 13000s > 211 min = 12660s)" \
  "import sys;sys.path.insert(0,'$OUT');import fixture;fixture.plant(sys.argv[1],8,13000)"
run f "beyond the spec's five: answer slot A over 40% in a course (15 more AI 310 answers moved to slot A, 40 of 99)" \
  'import sys,re
p=sys.argv[1];s=open(p).read();n=[0]
def f(m):
  if n[0]>=15: return m.group(0)
  n[0]+=1; return "], a: 0,"
s2=re.sub(r"\], a: [123],",f,s);assert n[0]==15;open(p,"w").write(s2)'
# (g) check-evidence.js: one evidence quote altered must fail; restore proven with cmp.
E=loop/specs/T-033-lecture-quizzes/verification/evidence/ai310.jsonl
cp "$E" "$SP/ev-backup.jsonl"
python3 -c 'import sys,json
p=sys.argv[1];L=open(p,encoding="utf-8").read().split("\n");n=0
for k,l in enumerate(L):
  if not l: continue
  d=json.loads(l)
  if d["key"]=="ai310.0.13" and d["i"]==2: d["quote"]=d["quote"].replace("definitely","probably");L[k]=json.dumps(d,ensure_ascii=False);n+=1
assert n==1;open(p,"w",encoding="utf-8").write("\n".join(L))' "$E"
node loop/specs/T-033-lecture-quizzes/verification/check-evidence.js > "$OUT/plant-g-check-evidence.txt" 2>&1; code=$?
cp "$SP/ev-backup.jsonl" "$E"
cmp "$SP/ev-backup.jsonl" "$E" && c1=identical || c1=DIFFERENT
git show HEAD:"$E" > "$SP/ev-head.jsonl"; cmp "$SP/ev-head.jsonl" "$E" && c2=identical || c2=DIFFERENT
echo "plant (g) check-evidence.js: one evidence quote altered (ai310.0.13 check 2, 'definitely' -> 'probably'): exit $code; restored: cmp backup $c1, cmp HEAD $c2" | tee -a "$OUT/plants-summary.txt"
grep "FAIL" "$OUT/plant-g-check-evidence.txt" | sed 's/^/    /' | tee -a "$OUT/plants-summary.txt"
