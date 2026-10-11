# diag-patch.py <tree>  -- T-039's instrumentation of the isolated switch (a)/(c) block.
# Run after mkswitch2.py <tree> <n>; writes <tree>/tools/diag-only.js from tools/switch-only.js.
# Adds: a context init script registered BEFORE every seed (window.__first: sessionStorage
# '__bare' flag and lengths, localStorage presence, at document start); the settings stored
# in-page right after the Light pick; a page init script that logs every write of the state
# in the reloaded document with its stack; and one DIAG3 line per run.
import sys
root = sys.argv[1]
s = open(root + "/tools/switch-only.js").read()
def rep(a, b):
    global s
    assert s.count(a) == 1, a
    s = s.replace(a, b)
rep("""  if (theme !== undefined) await ctx.addInitScript(seed, [FIXED_NOW.getTime(), theme]);
  if (extra) await ctx.addInitScript(extra, [FIXED_NOW.getTime()]);""",
"""  await ctx.addInitScript(() => { if (window.top !== window) return; window.__first = { ss: sessionStorage.getItem('__bare'), ssLen: sessionStorage.length, ls: localStorage.getItem('darhikmah_v1') !== null, lsLen: localStorage.length }; });
  if (theme !== undefined) await ctx.addInitScript(seed, [FIXED_NOW.getTime(), theme]);
  if (extra) await ctx.addInitScript(extra, [FIXED_NOW.getTime()]);""")
rep("""    await pickTheme(page, "light");
    await reload(page, { waitUntil: "load" });""",
"""    await pickTheme(page, "light");
    const dPick = await page.evaluate(() => { const st = JSON.parse(localStorage.getItem("darhikmah_v1") || "null"); return { dt: document.documentElement.dataset.theme, settings: st && st.settings, hash: location.hash }; });
    await page.addInitScript(() => {
      if (window.top !== window) return;
      const raw = localStorage.getItem("darhikmah_v1");
      window.__docStart = raw && JSON.parse(raw).settings;
      window.__wlog = [];
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === "darhikmah_v1") { let th; try { th = (JSON.parse(v).settings || {}); } catch (e) {} window.__wlog.push({ settings: th, stack: (new Error().stack || "").split("\\n").slice(2, 6).map(x => x.trim()).join(" < ") }); }
        return set.call(this, k, v);
      };
    });
    await reload(page, { waitUntil: "load" });""")
rep("""    const c = await page.evaluate(readTheme);""",
"""    const c = await page.evaluate(readTheme);
    const dAfter = await page.evaluate(() => ({ first: window.__first, docStart: window.__docStart, boot: window.__bootHadState, wlog: window.__wlog, hash: location.hash }));
    console.log("DIAG3 " + JSON.stringify({ pick: dPick, after: dAfter, ctheme: c.theme, cstored: c.stored }));""")
open(root + "/tools/diag-only.js", "w").write(s)
