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
elif plant in ("u50", "clearall"):   # app bugs at unload (review 1): a pagehide listener of the app's own, registered at load
    act = 'if (Math.random() < 0.5) localStorage.removeItem("darhikmah_v1");' if plant == "u50" else "localStorage.clear();"
    p = root + "/platform/js/app.js"
    s0 = open(p, encoding="utf-8").read()
    open(p, "w", encoding="utf-8").write('window.addEventListener("load", () => window.addEventListener("pagehide", () => { ' + act + ' }));\n' + s0)
    print("planted", plant, "in platform/js/app.js")
elif plant in ("b-design", "b2-design"):  # storage always lost on reload: a document-start clear in every fresh() context
    clr = CLEAR_LOCAL if plant == "b-design" else CLEAR_SESSION
    # Registered BEFORE the context's clock: Playwright's fake clock replaces window.performance with an
    # object whose getEntriesByType() returns [], so a script that runs after it cannot tell a reload.
    edit("tools/verify-design.js", [("  await ctx.clock.setFixedTime(FIXED_NOW);\n",
        "  await ctx.addInitScript(" + clr + ");\n  await ctx.clock.setFixedTime(FIXED_NOW);\n")])
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
elif plant == "c":     # silent retry: the wrapper retries on ANY failure (a failing check or an error), not only the lost-stamp precondition
    edit("tools/lib-reload.js", [
      ("      return r;\n    };\n", "      run.last = r;\n      return r;\n    };\n"),
      ("    if (run.lost === null) {\n", "    if (run.lost === null && !err && !held.some(args => args.includes(false))) {\n"),
      ("    stats.lost++;\n", "    if (run.lost === null) run.lost = run.last || { stamp: \"\", session: false, report: null, boot: { local: null, session: null } };\n    stats.lost++;\n"),
    ])
else:
    raise SystemExit("unknown plant " + plant)
