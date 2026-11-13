#!/usr/bin/env bash
# T-072 plants: each must make verify-boot exit 1, and every file must come back byte-identical.
set -u
R=/home/user/bf-T-072
L=/tmp/t072/plants
mkdir -p $L
cd $R
cp -p app-web/index.html $L/index.html.orig

plant() { # name, python replacement (old, new)
  local name=$1 old=$2 new=$3
  python3 - "$old" "$new" <<'EOF'
import sys
p='/home/user/bf-T-072/app-web/index.html'; s=open(p).read(); old,new=sys.argv[1],sys.argv[2]
assert s.count(old)==1, ("not found once", old)
open(p,'w').write(s.replace(old,new))
EOF
  diff <(cat $L/index.html.orig) app-web/index.html > $L/$name.diff
  node tools/verify-boot.js $L/shots-$name > $L/$name.log 2>&1; local rc=$?
  cp -p $L/index.html.orig app-web/index.html
  cmp $L/index.html.orig app-web/index.html && echo "$name: verify-boot exit $rc; app-web/index.html restored byte-identical" | tee -a $L/summary.txt
}

: > $L/summary.txt
plant wordmark-plus-2px 'font: 700 26.4px/36px "Brickford Playfair"' 'font: 700 28.4px/36px "Brickford Playfair"'
plant georgia '700 26.4px/36px "Brickford Playfair", Georgia, serif' '700 26.4px/36px Georgia, "Times New Roman", serif'

# Plant 3: the splash no longer waits for its fonts (main.dart), rebuilt; app-web/ and main.dart restored after.
cp -p app/lib/main.dart $L/main.dart.orig
rm -rf $L/app-web.orig && cp -a app-web $L/app-web.orig
python3 - <<'EOF'
p='/home/user/bf-T-072/app/lib/main.dart'; s=open(p).read()
old='  await fontsReady(splashFonts);\n'
assert s.count(old)==1
open(p,'w').write(s.replace(old,''))
EOF
diff $L/main.dart.orig app/lib/main.dart > $L/no-font-wait.diff
bash tools/build-app.sh > $L/no-font-wait.build.log 2>&1
node tools/verify-boot.js $L/shots-no-font-wait > $L/no-font-wait.log 2>&1; rc=$?
cp -p $L/main.dart.orig app/lib/main.dart
rm -rf app-web && cp -a $L/app-web.orig app-web
cmp $L/main.dart.orig app/lib/main.dart && diff -r $L/app-web.orig app-web > /dev/null && \
  echo "no-font-wait: verify-boot exit $rc; app/lib/main.dart and app-web/ restored byte-identical" | tee -a $L/summary.txt
git -C $R checkout loop/specs/T-064-flutter-app/shots
echo PLANTS_DONE >> $L/summary.txt
