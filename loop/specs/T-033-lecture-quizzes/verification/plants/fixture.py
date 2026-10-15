# Planted fixture for T-033 plants (c) and (e): a video-sourced summary for
# ai200.2.1 (211 minutes, so it needs 8 checks; still unbuilt, so the key is free —
# ai200.1.0, the fixture's first target, has been built since). Every other rule is satisfied:
# 4 equal-length options (no unique longest or shortest), answers spread A-D,
# whole-second `at` values inside the video. NEVER committed into a data file.
import sys
def entry(n_checks, bad_at=None):
    checks = []
    for i in range(n_checks):
        at = 600 + i * 900
        if bad_at is not None and i == 7: at = bad_at
        checks.append('{ q: "Planted check %d: which option is the planted answer?", opts: ["Planted option one", "Planted option two", "Planted option 3rd", "Planted option 4th"], a: %d, at: %d, expl: "This check exists only to exercise verify-content; it is never committed." }' % (i, i % 4, at))
    return ('\n  "ai200.2.1": {\n    takeaway: "PLANTED FIXTURE for T-033 plants (c) and (e); never committed.",\n'
            '    beats: [{ t: "Planted", d: "Planted beat one." }, { t: "Planted", d: "Planted beat two." }, { t: "Planted", d: "Planted beat three." }],\n'
            '    worked: "PLANTED FIXTURE worked pattern, never committed.",\n    watch: "PLANTED FIXTURE watch, never committed.",\n    concepts: [],\n'
            '    checks: [\n      ' + ',\n      '.join(checks) + ',\n    ],\n  },\n')
def plant(path, n_checks, bad_at=None):
    s = open(path).read()
    i = s.rstrip().rfind("\n});")
    open(path, "w").write(s[:i] + "\n" + entry(n_checks, bad_at) + s[i:])
if __name__ == "__main__":
    plant(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]) if len(sys.argv) > 3 else None)
