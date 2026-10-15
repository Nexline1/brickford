# Render a .ipynb as plain text: every cell numbered (1-based, in notebook order),
# markdown and code verbatim, text outputs kept (long ones cut in the middle and
# marked), images and HTML outputs replaced by a one-line marker.
import json, sys, os
def out_text(o):
    if o.get("output_type") == "stream": return "".join(o.get("text", ""))
    d = o.get("data", {})
    if "text/plain" in d: return "".join(d["text/plain"])
    if o.get("output_type") == "error": return "ERROR " + o.get("ename", "") + ": " + o.get("evalue", "")
    return ""
def render(path, cap=4000):
    nb = json.load(open(path))
    lines = ["# " + os.path.basename(path)]
    for i, c in enumerate(nb["cells"], 1):
        src = "".join(c.get("source", ""))
        lines.append("\n=== cell %d [%s]" % (i, c["cell_type"]))
        lines.append(src)
        for o in c.get("outputs", []) or []:
            t = out_text(o)
            kinds = list(o.get("data", {}).keys())
            if any(k.startswith("image/") for k in kinds): lines.append("--- output: [image]")
            if t:
                if len(t) > cap: t = t[:cap // 2] + "\n... [output cut: %d chars] ...\n" % len(t) + t[-cap // 2:]
                lines.append("--- output:\n" + t)
    return "\n".join(lines)
for p in sys.argv[2:]:
    o = os.path.join(sys.argv[1], os.path.basename(p) + ".txt")
    open(o, "w").write(render(p))
    print(o, os.path.getsize(o))
