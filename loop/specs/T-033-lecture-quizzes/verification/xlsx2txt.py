# Render an .xlsx to text: sheet names, then each sheet's cells (value and formula) for the first MAXR rows.
import sys, zipfile, re, xml.etree.ElementTree as ET
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
src = sys.argv[1]; MAXR = int(sys.argv[2]) if len(sys.argv) > 2 else 40; MAXC = int(sys.argv[3]) if len(sys.argv) > 3 else 40
z = zipfile.ZipFile(src)
ss = []
if 'xl/sharedStrings.xml' in z.namelist():
    for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS):
        ss.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))
wb = ET.fromstring(z.read('xl/workbook.xml'))
rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
rmap = {r.get('Id'): r.get('Target') for r in rels}
def colnum(c):
    n = 0
    for ch in c: n = n * 26 + ord(ch) - 64
    return n
print('# ' + src.split('/')[-1])
for sh in wb.find('m:sheets', NS):
    name = sh.get('name'); tgt = rmap[sh.get('{%s}id' % NS['r'])]
    path = 'xl/' + tgt.lstrip('/').replace('xl/', '') if not tgt.startswith('/xl/') else tgt[1:]
    print('\n=== sheet: %s (%s)' % (name, path))
    root = ET.fromstring(z.read(path))
    dim = root.find('m:dimension', NS)
    if dim is not None: print('dimension', dim.get('ref'))
    for row in root.iter('{%s}row' % NS['m']):
        r = int(row.get('r'))
        if r > MAXR: break
        out = []
        for c in row.findall('m:c', NS):
            ref = c.get('r'); col = re.match(r'[A-Z]+', ref).group(0)
            if colnum(col) > MAXC: continue
            v = c.find('m:v', NS); f = c.find('m:f', NS); t = c.get('t')
            val = v.text if v is not None else ''
            if t == 's' and val != '': val = ss[int(val)]
            if t == 'inlineStr':
                val = ''.join(x.text or '' for x in c.iter('{%s}t' % NS['m']))
            s = ref + '=' + repr(val)
            if f is not None and (f.text or f.get('ref')): s += ' {=' + (f.text or ('shared ' + str(f.get('si')))) + '}'
            if val != '' or f is not None: out.append(s)
        if out: print(' | '.join(out))
