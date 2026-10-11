# plant.py <worktree> <plant>   -- applies one T-039 plant in place (restore with git show HEAD:path > path, prove with cmp)
import sys
root, plant = sys.argv[1], sys.argv[2]
CLEAR_LOCAL = '(() => { if (window.top === window && (performance.getEntriesByType("navigation")[0] || {}).type === "reload") localStorage.clear(); })'
CLEAR_SESSION = '(() => { if (window.top === window && (performance.getEntriesByType("navigation")[0] || {}).type === "reload") sessionStorage.clear(); })'
def edit(rel, pairs):
    p = root + "/" + rel
    s = open(p, encoding="utf-8").read()
    for a, b in pairs:
        n = s.count(a)
        assert n == 1, (rel, a, n)
        s = s.replace(a, b)
    open(p, "w", encoding="utf-8").write(s)
    print("planted", plant, "in", rel)
if plant == "a":       # app bug: the theme pick does not save
    edit("platform/js/app.js", [("        save(); applyTheme();\n", "        applyTheme();\n")])
elif plant in ("b-design", "b2-design"):  # storage always lost on reload: a document-start clear in every fresh() context
    clr = CLEAR_LOCAL if plant == "b-design" else CLEAR_SESSION
    edit("tools/verify-design.js", [("  if (theme !== undefined) await ctx.addInitScript(seed, [FIXED_NOW.getTime(), theme]);\n",
        "  await ctx.addInitScript(" + clr + ");\n  if (theme !== undefined) await ctx.addInitScript(seed, [FIXED_NOW.getTime(), theme]);\n")])
elif plant == "b-flows":
    edit("tools/verify-flows.js", [("""    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: true });
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    let remote = null,""", """    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, timezoneId: "UTC", reducedMotion: "reduce", hasTouch: true });
    await ctx.addInitScript(""" + CLEAR_LOCAL + """);
    await ctx.clock.setFixedTime(new Date(TODAY + "T12:00:00Z"));
    let remote = null,""")])
elif plant == "b-sync":
    edit("tools/verify-sync-loop.js", [
      ("""    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", colorScheme: "light" });
""", """    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", colorScheme: "light" });
    await ctx.addInitScript(""" + CLEAR_LOCAL + """);
"""),
      ("""    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", colorScheme: "light" });
""", """    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", colorScheme: "light" });
    await ctx2.addInitScript(""" + CLEAR_LOCAL + """);
""")])
elif plant == "c":     # silent retry: the wrapper retries on ANY failure, not only the storage-lost precondition
    edit("tools/lib-reload.js", [
      ("    if (run.lost === null) {\n", "    if (run.lost === null && !err && !held.some(args => args.includes(false))) {\n"),
      ("    const b = run.lost.boot, seen", "    if (run.lost === null) run.lost = { boot: { state: true, local: \"(retried on a failure)\", session: \"(retried on a failure)\" }, stamp: \"\" };\n    const b = run.lost.boot, seen"),
    ])
else:
    raise SystemExit("unknown plant " + plant)
