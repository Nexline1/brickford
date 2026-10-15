# Render a slide PDF as plain text, one "=== slide N" block per page (1-based).
# Needs pypdf (kept outside the repo, e.g. pip install --target <dir> pypdf; PYTHONPATH=<dir>).
import sys
# The system 'cryptography' build is broken here (pyo3 panic); pypdf only needs it for
# encrypted PDFs, so make its import fail cleanly and pypdf falls back without it.
sys.modules['cryptography'] = None
from pypdf import PdfReader
src, out = sys.argv[1], sys.argv[2]
r = PdfReader(src)
with open(out, 'w') as f:
    f.write('# ' + src.split('/')[-1] + '\n')
    for i, p in enumerate(r.pages, 1):
        t = (p.extract_text() or '').strip()
        f.write('\n=== slide %d\n%s\n' % (i, t if t else '[no text layer]'))
print(out, len(r.pages), 'pages')
