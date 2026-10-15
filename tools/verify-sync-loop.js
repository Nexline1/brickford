// verify-sync-loop.js — a re-render must never restart the video.
//
// Why this exists: on 2026-09-17 the lesson page reloaded itself every four
// seconds and the video could not be watched. V.lesson wrote settings.lastLesson
// during its own render, save() armed a push 4s out, the push failed on a
// read-only token, and the failure handler re-rendered "so the banner reaches
// whatever page is open" — which ran V.lesson, which saved, which armed another
// push. An infinite loop that rebuilt the <iframe> on every pass.
//
// The test stubs GitHub the way the broken token behaved: GET succeeds, PUT is
// rejected. Then it watches the lesson page for fifteen seconds and asserts the
// iframe is the SAME NODE throughout.
//
// T-039 (loop/specs/T-039-reload-storage-flake/spec.md): the two reloads in
// the theme-and-pull checks go through tools/lib-reload.js. In verify-design's
// "switch (c)" a reload of this file:// page in an ephemeral context was seen
// to start, before any app script ran, without storage the old page had. So
// just before each reload a stamp is written beside the state in localStorage
// — a stamp, not the state key, because the seeds below rewrite a missing
// state before any later init script could look — and two things are read:
// whether the old page still held it when it unloaded (a report through a
// binding only the harness owns; if not, the app took it: measured, never
// retried) and whether it arrived at document start. Only a stamp the old page
// is reported to have held and the new one did not find discards the attempt
// — every reading of it, failing checks included — and that half is
// re-measured from a fresh context, up to 5 attempts; if all 5 lose it the
// gate fails with that reason. With no unload report the attempt is measured
// as it is, never retried (fail-closed). Whether the state arrived is what the
// checks measure; their predicates are as they were.
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const { acrossReload } = require("./lib-reload");
const URL = "file://" + path.join(path.resolve(__dirname, ".."), "platform/index.html") + "#";

const WATCH_MS = 15000;          // long enough for three 4s push cycles
let fails = 0;
const check = (ok, msg) => { console.log((ok ? "  ok    " : "  FAIL  ") + msg); if (!ok) fails++; };

// GitHub's own wording for a fine-grained token that can read but not write.
const REJECT = { message: "Resource not accessible by personal access token" };

async function session(browser, { putOk }) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await ctx.addInitScript(() => {
    localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness");
    // Count every rebuild of the view, and tag each iframe with an identity so
    // "same node" is checkable from the page.
    window.__renders = 0;
    window.__iframeSerial = 0;
  });
  const page = await ctx.newPage();

  // Stand in for api.github.com entirely — nothing leaves the machine.
  await page.route("https://api.github.com/**", route => {
    const method = route.request().method();
    if (method === "GET") {
      return route.fulfill({
        status: 200, contentType: "application/json",
        body: JSON.stringify({ sha: "stubsha", content: Buffer.from("{}").toString("base64") }),
      });
    }
    if (putOk) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) });
    }
    return route.fulfill({ status: 403, contentType: "application/json", body: JSON.stringify(REJECT) });
  });

  await page.goto(URL + "/lesson/math110/0/0", { waitUntil: "load" });
  await page.waitForTimeout(600);

  // Identity for the live iframe: stamp it once, and see whether the stamp
  // survives. A rebuilt element arrives unstamped. Count view rebuilds too, so
  // a failure reads as "it re-rendered three times" rather than only as a
  // missing stamp.
  await page.evaluate(() => {
    const f = document.querySelector(".video-frame iframe");
    if (f) f.dataset.stamp = "original";
    window.__renders = 0;
    new MutationObserver(ms => {
      for (const m of ms) if (m.type === "childList" && m.addedNodes.length) window.__renders++;
    }).observe(document.querySelector("#view"), { childList: true });
  });
  const before = await page.evaluate(() => {
    const f = document.querySelector(".video-frame iframe");
    return f ? { src: f.src, stamp: f.dataset.stamp || "" } : null;
  });

  await page.waitForTimeout(WATCH_MS);

  const after = await page.evaluate(() => {
    const f = document.querySelector(".video-frame iframe");
    return {
      renders: window.__renders,
      frame: f ? { src: f.src, stamp: f.dataset.stamp || "(rebuilt)" } : null,
    };
  });
  await ctx.close();
  return { before, after: after.frame, renders: after.renders };
}

(async () => {
  const browser = await chromium.launch();

  console.log("A failing token — the state the bug needed:");
  const bad = await session(browser, { putOk: false });
  check(!!bad.before && !!bad.before.src, "lesson page renders a video frame");
  check(!!bad.after, "video frame still present after " + WATCH_MS / 1000 + "s");
  check(bad.after && bad.after.stamp === "original",
    "iframe is the same element after " + WATCH_MS / 1000 + "s (was: " + (bad.after && bad.after.stamp) + ")");
  check(bad.before && bad.after && bad.before.src === bad.after.src, "iframe src unchanged");
  // Nothing the reader did should repaint the page they are sitting still on.
  check(bad.renders === 0, "the view was not rebuilt while sitting on the page (rebuilds: " + bad.renders + ")");

  console.log("A working token — the normal path must still work:");
  const good = await session(browser, { putOk: true });
  check(!!good.after, "video frame present");
  check(good.after && good.after.stamp === "original", "iframe survives a successful push too");
  check(good.renders === 0, "a successful push does not repaint either (rebuilds: " + good.renders + ")");

  // Deferring a background repaint must not make the page inert. Acting on it —
  // marking the lecture watched — is a foreground render and has to repaint.
  console.log("The page still responds to being used:");
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.route("https://api.github.com/**", r => r.abort());
    await page.goto(URL + "/lesson/math110/0/0", { waitUntil: "load" });
    await page.waitForTimeout(600);
    const btn = await page.$("[data-act='toggleDone']");
    const label = btn ? (await btn.textContent()).trim() : "";
    check(!!btn && /Mark watched/.test(label), "the watched control is on the lesson page (" + label + ")");
    if (btn) {
      await btn.click();
      await page.waitForTimeout(800);
      const after = await page.evaluate(() => {
        const b = document.querySelector("[data-act='toggleDone']");
        return {
          label: b ? b.textContent.trim() : "(gone)",
          stored: (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons || {})["math110.0.0"],
        };
      });
      check(!!after.stored && after.stored.done === true, "marking watched is recorded");
      check(/Unmark watched/.test(after.label),
        "and the page repaints to show it — foreground render still runs (" + after.label + ")");
    }
    await ctx.close();
  }

  // The rejection latch must stop the doomed automatic push and nothing else.
  // Getting this wrong in the other direction — latching a device off sync
  // permanently — would be worse than the loop it prevents.
  console.log("A rejected token latches the automatic push, and only that:");
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    await ctx.addInitScript(() => localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness"));
    const page = await ctx.newPage();
    let puts = 0, putOk = false;
    await page.route("https://api.github.com/**", route => {
      if (route.request().method() === "GET") {
        return route.fulfill({ status: 200, contentType: "application/json",
          body: JSON.stringify({ sha: "stubsha", content: Buffer.from("{}").toString("base64") }) });
      }
      puts++;
      return putOk
        ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) })
        : route.fulfill({ status: 403, contentType: "application/json", body: JSON.stringify(REJECT) });
    });
    const storedError = () => page.evaluate(() =>
      (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings || {}).syncError);

    await page.goto(URL + "/lesson/math110/0/0", { waitUntil: "load" });
    await page.waitForTimeout(500);
    await page.click("[data-act='toggleDone']");
    await page.waitForTimeout(6000);
    const e1 = await storedError();
    check(!!e1 && e1.fatal === true, "a rejected token is recorded as fatal");
    const first = puts;
    check(first >= 1, "the first automatic push was attempted (" + first + ")");

    await page.click("[data-act='toggleDone']"); await page.waitForTimeout(6000);
    await page.click("[data-act='toggleDone']"); await page.waitForTimeout(6000);
    check(puts === first, "latched — further saves armed no push (still " + puts + ")");

    putOk = true;
    await page.goto(URL + "/sync", { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.click("[data-act='syncPush']");
    await page.waitForTimeout(1500);
    check(puts > first, "a manual push still runs while latched — it is not a lockout");
    check(!(await storedError()), "a success clears the error, lifting the latch");

    const before = puts;
    // T-043: lecture 2 is locked behind lecture 1's quiz now (no Mark watched
    // on a locked page), so the save that proves the push resumed is made on
    // lecture 1 — any save arms the push; which lecture it is was never the point.
    await page.goto(URL + "/lesson/math110/0/0", { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.click("[data-act='toggleDone']");
    await page.waitForTimeout(6000);
    check(puts > before, "automatic push resumes once sync works again");
    await ctx.close();
  }

  // The navy switch (T-024) is per device. A pull must never import another
  // device's theme or its themeNavyOnce marker: if it did, a stored "light"
  // left by the old default would become a kept "pick" here and the one-time
  // switch would be lost for good. The remote below carries both.
  console.log("A pull never carries the theme or the navy-switch marker between devices:");
  await acrossReload({ label: "a pull, a save, a reload: still navy", check, fail: why => check(false, why) }, async (check, reload) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", colorScheme: "light" });
    await ctx.addInitScript(() => {
      localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness");
      if (!localStorage.getItem("darhikmah_v1"))
        localStorage.setItem("darhikmah_v1", JSON.stringify({ settings: { theme: "light" } }));
    });
    const page = await ctx.newPage();
    const remote = { v: 1, device: "other-device", state: { settings: { theme: "parchment", themeNavyOnce: true } }, ledgers: {} };
    let pushed = null;
    await page.route("https://api.github.com/**", route => {
      if (route.request().method() === "GET") {
        return route.fulfill({ status: 200, contentType: "application/json",
          body: JSON.stringify({ sha: "stubsha", content: Buffer.from(JSON.stringify(remote)).toString("base64") }) });
      }
      try { pushed = JSON.parse(Buffer.from(JSON.parse(route.request().postData()).content, "base64").toString()); } catch (e) {}
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) });
    });
    const stored = () => page.evaluate(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings) || {});

    await page.goto(URL + "/sync", { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.click("[data-act='syncPull']");
    await page.waitForTimeout(1200);
    await page.click("[data-act='syncPush']");
    await page.waitForTimeout(1500);
    // An ordinary save, so whatever the pull left in memory reaches storage.
    await page.goto(URL + "/lesson/math110/0/0", { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.click("[data-act='toggleDone']");
    await page.waitForTimeout(400);
    const s = await stored();
    check(s.theme === undefined && s.themeNavyOnce === true,
      "after a pull and a save, this device's theme is its own navy switch, not the remote's (" + JSON.stringify({ theme: s.theme, mark: s.themeNavyOnce }) + ")");
    const st = pushed && pushed.state && pushed.state.settings;
    check(!!st, "the push was captured");
    check(!!st && !("themeNavyOnce" in st) && st.theme === undefined,
      "the pushed settings carry no marker and no theme (" + JSON.stringify(st) + ")");
    await reload(page, { waitUntil: "load" });
    await page.waitForTimeout(400);
    const dt = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    check(dt === "dark", "after a reload the device is still navy (data-theme " + dt + ")");
    await ctx.close();
  });
  await acrossReload({ label: "a pull, a save, a reload: a picked Light kept", check, fail: why => check(false, why) }, async (check, reload) => {

    // And the other way round: an explicit pick (Light, with the marker) must
    // survive a pull from a real remote, whose settings carry a theme and NO
    // marker (syncPayload never sends it). A pull that copied the remote's
    // marker would clear it here, and the next load would switch Light to navy.
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", colorScheme: "light" });
    await ctx2.addInitScript(() => {
      localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness");
      if (!localStorage.getItem("darhikmah_v1"))
        localStorage.setItem("darhikmah_v1", JSON.stringify({ settings: { theme: "light", themeNavyOnce: true } }));
    });
    const page2 = await ctx2.newPage();
    const real = { v: 1, device: "other-device", state: { settings: { theme: "parchment", dailyStart: "08:00", streakFrom: null } }, ledgers: {} };
    await page2.route("https://api.github.com/**", route => route.request().method() === "GET"
      ? route.fulfill({ status: 200, contentType: "application/json",
          body: JSON.stringify({ sha: "stubsha", content: Buffer.from(JSON.stringify(real)).toString("base64") }) })
      : route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) }));
    await page2.goto(URL + "/sync", { waitUntil: "load" });
    await page2.waitForTimeout(400);
    await page2.click("[data-act='syncPull']");
    await page2.waitForTimeout(1200);
    await page2.goto(URL + "/lesson/math110/0/0", { waitUntil: "load" });
    await page2.waitForTimeout(400);
    await page2.click("[data-act='toggleDone']");
    await page2.waitForTimeout(400);
    await reload(page2, { waitUntil: "load" });
    await page2.waitForTimeout(400);
    const s2 = await page2.evaluate(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").settings) || {});
    const dt2 = await page2.evaluate(() => document.documentElement.getAttribute("data-theme"));
    check(s2.theme === "light" && s2.themeNavyOnce === true && dt2 === "light",
      "a picked Light survives a pull from a real remote, a save and a reload (" +
      JSON.stringify({ theme: s2.theme, mark: s2.themeNavyOnce, dataTheme: dt2 }) + ")");
    await ctx2.close();
  });

  // T-028: a recording stays on the device that made it. A Chromium with a
  // fake microphone (--use-fake-ui-for-media-stream grants the prompt,
  // --use-fake-device-for-media-stream supplies the device; on this file://
  // page getUserMedia, MediaRecorder and IndexedDB all work, so no server)
  // records a story on /practice. The clip must be in IndexedDB — so its
  // absence from the push means something — and every push captured (the
  // manual one, and the automatic one the rep arms if it fires first) must carry the rep exactly as
  // the hand form logs it and no audio: no data: URL, no base64, no object URL,
  // nothing of brickford_audio, no Blob field, and no state key syncPayload
  // does not already send. The clock is pinned to a study day (Tue 20 Oct
  // 2026), so the rep is owed and logged whatever day this runs.
  console.log("A recording stays on the device — the push carries the rep, never the audio:");
  {
    const mic = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
    const ctx = await mic.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", timezoneId: "UTC" });
    await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
    await ctx.addInitScript(() => localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness"));
    const page = await ctx.newPage();
    const pushes = [];
    await page.route("https://api.github.com/**", route => {
      if (route.request().method() === "GET")
        return route.fulfill({ status: 200, contentType: "application/json",
          body: JSON.stringify({ sha: "stubsha", content: Buffer.from("{}").toString("base64") }) });
      try { pushes.push(Buffer.from(JSON.parse(route.request().postData()).content, "base64").toString()); } catch (e) { pushes.push("(unreadable push)"); }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) });
    });
    const SENT = ["anchors", "concepts", "diag", "electives", "gates", "labs", "lessons", "problems", "psets", "quizAttempts", "quizMisses",
      "reps", "review", "settings", "studyDays", "treasury", "weeks"].join(",");
    const AUDIO = /data:audio|;base64,|blob:|brickford_audio|"(audio|blob|clip|chunks?)"\s*:/i;
    try {
      await page.goto(URL + "/practice", { waitUntil: "load" });
      await page.waitForSelector("#view [data-ptab=story]");
      await page.click("#view [data-ptab=story]");
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => /^0:0[1-9]/.test(((document.querySelector("#view .pr-time") || {}).textContent || "").trim()), null, { timeout: 8000 });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      const clip = await page.evaluate(() => new Promise(res => {
        const q = indexedDB.open("brickford_audio");
        q.onerror = () => res(null);
        q.onsuccess = () => { const g = q.result.transaction("clips").objectStore("clips").getAll();
          g.onsuccess = () => { q.result.close(); res(g.result.map(v => ({ size: v.blob ? v.blob.size : 0, seconds: v.seconds }))); }; };
      }));
      check(!!clip && clip.length === 1 && clip[0].size > 0, "the clip is in IndexedDB brickford_audio (" + JSON.stringify(clip) + ")");
      await page.goto(URL + "/sync", { waitUntil: "load" });
      await page.waitForSelector("[data-act='syncPush']");
      const n0 = pushes.length;
      await page.click("[data-act='syncPush']");
      for (const t0 = Date.now(); pushes.length === n0 && Date.now() - t0 < 8000;) await page.waitForTimeout(100);
      const parsed = pushes.map(p => { try { return JSON.parse(p); } catch (e) { return null; } });
      const withRep = parsed.filter(p => p && p.state && ((p.state.reps || {}).story || []).length === 1);
      check(pushes.length > n0 && withRep.length >= 1, "a push carried the recorded rep (" + pushes.length + " push(es), " + withRep.length + " with the rep)");
      const rep = withRep.length ? withRep[withRep.length - 1].state.reps.story[0] : null;
      check(!!rep && Object.keys(rep).join(",") === "date,seconds,takes,from" && rep.date === "2026-10-20" && !!clip && rep.seconds === clip[0].seconds,
        "the pushed rep is the hand form's shape, { date, seconds, takes, from }, with the clip's seconds (" + JSON.stringify(rep) + ")");
      const audio = pushes.map((p, i) => { const m = AUDIO.exec(p); return m ? "push " + (i + 1) + ": \"" + p.slice(Math.max(0, m.index - 30), m.index + 40) + "\"" : null; }).filter(Boolean);
      check(audio.length === 0, "no push carries audio or brickford_audio data" + (audio.length ? " — " + audio.join(" | ") : " (" + pushes.length + " push(es) read)"));
      const keys = parsed.map(p => p && p.state ? Object.keys(p.state).sort().join(",") : "(none)").filter(k => k !== SENT);
      check(parsed.length > 0 && keys.length === 0, "every push's state has exactly the keys syncPayload sends" + (keys.length ? " — got " + keys[0] : ""));
    } catch (e) { check(false, "the recording half ran to its end without a harness error — " + e.message.split("\n")[0]); }
    await ctx.close();
    await mic.close();
  }

  // T-028 review 1: a repaint nobody asked for must not destroy the Practice
  // page's media either. The remote here has something new on every GET (a
  // bank entry "from the laptop"), so every push merges and then calls
  // render({ background: true }) — the toast "Pushed — N changes merged in"
  // is raised in the same task, so it is the proof the repaint was asked for.
  // (1) One of your recordings playing when it lands: the <audio> must be the
  // same element, still attached, still playing. (2) A recording in progress
  // when it lands: the record button must be the same element, still
  // recording, still holding the focus — and the recording then finishes.
  console.log("A background repaint leaves a playing recording and a recording in progress alone:");
  {
    const mic = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
    const busyCtx = async init => {
      const ctx = await mic.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", timezoneId: "UTC" });
      await ctx.clock.setFixedTime(new Date("2026-10-20T12:00:00Z"));
      await ctx.addInitScript(() => localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness"));
      if (init) await ctx.addInitScript(init);
      const page = await ctx.newPage();
      let gets = 0;
      await page.route("https://api.github.com/**", route => {
        if (route.request().method() === "GET") {
          gets++;
          const remote = { v: 1, device: "laptop", state: { reps: { bank: [{ date: "2026-10-1" + (gets % 10), what: "from the laptop " + gets, why: "" }] } }, ledgers: {} };
          return route.fulfill({ status: 200, contentType: "application/json",
            body: JSON.stringify({ sha: "s" + gets, content: Buffer.from(JSON.stringify(remote)).toString("base64") }) });
        }
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "n" + gets } }) });
      });
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(URL + "/practice", { waitUntil: "load" });
      await page.waitForSelector("#view [data-ptab=story]");
      await page.click("#view [data-ptab=story]");
      return { ctx, page, errors };
    };
    const timer = (page, re, ms) => page.waitForFunction(re => new RegExp(re).test(((document.querySelector("#view .pr-time") || {}).textContent || "").trim()), re, { timeout: ms || 12000 });
    // Proof a background repaint was asked for: the push's merge toast, raised
    // in the same task as render({ background: true }), after `n` was seen.
    const mergedPush = async page => {
      await page.evaluate(() => { const t = document.querySelector("#toast"); window.__toastSeen = []; new MutationObserver(() => window.__toastSeen.push(t.textContent)).observe(t, { childList: true, characterData: true, subtree: true }); });
      return page.waitForFunction(() => window.__toastSeen.some(x => /merged in/.test(x)), null, { timeout: 12000 }).then(() => true, () => false);
    };
    try {
      const { ctx, page, errors } = await busyCtx();
      await page.click("#view .pr-rec");
      await timer(page, "^0:08 ");
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      // The save armed a push about 4s out; play the recording before it lands.
      await page.click("#view .pr-clip .pr-play");
      await page.waitForFunction(() => { const a = document.querySelector("#view .pr-clip audio"); return a && !a.paused; }, null, { timeout: 4000 });
      await page.evaluate(() => { window.__a = document.querySelector("#view .pr-clip audio"); });
      const asked = await mergedPush(page);
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const a = await page.evaluate(() => ({ attached: window.__a.isConnected, same: document.querySelector("#view .pr-clip audio") === window.__a,
        playing: !window.__a.paused && !window.__a.ended, t: +window.__a.currentTime.toFixed(2) }));
      check(asked, "(1) a push merged in the laptop's entry and asked for a background repaint while the recording played");
      check(asked && a.attached && a.same && a.playing, "(1) the playing <audio> is the same element, attached and still playing after it (" + JSON.stringify(a) + ")");
      check(errors.length === 0, "(1) no page errors" + (errors.length ? " — " + errors.join(" | ") : ""));
      await ctx.close();
    } catch (e) { check(false, "(1) ran to its end without a harness error — " + e.message.split("\n")[0]); }
    try {
      const { ctx, page, errors } = await busyCtx();
      await page.click("#view .pr-rec");
      await timer(page, "^0:01 ");
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      // The save armed a push about 4s out; start the next recording, from
      // the keyboard, before it lands.
      await page.focus("#view .pr-rec");
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.querySelector("#view .pr-rec").getAttribute("aria-pressed") === "true", null, { timeout: 5000 });
      await page.evaluate(() => { window.__b = document.querySelector("#view .pr-rec"); });
      const asked = await mergedPush(page);
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const b = await page.evaluate(() => ({ attached: window.__b.isConnected, same: document.querySelector("#view .pr-rec") === window.__b,
        recording: window.__b.getAttribute("aria-pressed") === "true", focus: document.activeElement === window.__b,
        time: document.querySelector("#view .pr-time").textContent }));
      check(asked, "(2) a push merged in the laptop's entry and asked for a background repaint while recording");
      check(asked && b.attached && b.same && b.recording && b.focus, "(2) the record button is the same element, still recording and still focused after it (" + JSON.stringify(b) + ")");
      await page.keyboard.press("Enter");
      const two = await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 2, null, { timeout: 8000 }).then(() => true, () => false);
      check(two, "(2) Enter then stops it and the second recording is kept (2 in the list)");
      check(errors.length === 0, "(2) no page errors" + (errors.length ? " — " + errors.join(" | ") : ""));
      await ctx.close();
    } catch (e) { check(false, "(2) ran to its end without a harness error — " + e.message.split("\n")[0]); }

    // Review 2: deferred, not lost. What the view says against what is stored:
    // the "N logged" pill under the list, and the reps in localStorage.
    const shown = page => page.evaluate(() => {
      const r = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").reps || {};
      const m = /(\d+) logged/.exec(((document.querySelector("#view .pr-log .pill") || {}).textContent || ""));
      return { view: m ? +m[1] : null, stored: ["bank", "story", "humor", "review"].reduce((n, k) => n + (r[k] || []).length, 0) };
    });
    const caughtUp = page => page.waitForFunction(() => {
      const r = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").reps || {};
      const m = /(\d+) logged/.exec(((document.querySelector("#view .pr-log .pill") || {}).textContent || ""));
      return !!m && +m[1] === ["bank", "story", "humor", "review"].reduce((n, k) => n + (r[k] || []).length, 0);
    }, null, { timeout: 6000 }).then(() => true, () => false);
    // (3) A clip paused part-way when the repaint is asked for: the <audio> is
    // the same element at the same place. (4) Played on to its end: the
    // repaint that was skipped runs, and the view shows the merged count.
    try {
      const { ctx, page, errors } = await busyCtx();
      await page.click("#view .pr-rec");
      await timer(page, "^0:08 ");
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      await page.click("#view .pr-clip .pr-play");
      await page.waitForFunction(() => { const a = document.querySelector("#view .pr-clip audio"); return a && a.currentTime > 1.5; }, null, { timeout: 6000 });
      await page.click("#view .pr-clip .pr-play");                 // the same button pauses
      await page.waitForFunction(() => document.querySelector("#view .pr-clip audio").paused, null, { timeout: 4000 });
      const t0 = await page.evaluate(() => { window.__a = document.querySelector("#view .pr-clip audio"); return window.__a.currentTime; });
      const asked = await mergedPush(page);
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const a = await page.evaluate(() => ({ attached: window.__a.isConnected, same: document.querySelector("#view .pr-clip audio") === window.__a,
        paused: window.__a.paused, t: window.__a.currentTime }));
      const gap = await shown(page);
      check(asked, "(3) a push merged in the laptop's entry and asked for a background repaint while the clip was paused part-way");
      check(asked && a.attached && a.same && a.paused && Math.abs(a.t - t0) < 0.01,
        "(3) the paused <audio> is the same element, attached, at the same place (" + JSON.stringify(Object.assign({ t0: +t0.toFixed(3) }, a, { t: +a.t.toFixed(3) })) + "; the view says " + gap.view + " logged, storage holds " + gap.stored + ")");
      await page.click("#view .pr-clip .pr-play");                 // play on
      const ended = await page.waitForFunction(() => window.__a.ended, null, { timeout: 15000 }).then(() => true, () => false);
      const up = await caughtUp(page), now = await shown(page);
      check(ended && up, "(4) played to its end, the skipped repaint runs: the view says " + now.view + " logged, storage holds " + now.stored);
      check(errors.length === 0, "(3)(4) no page errors" + (errors.length ? " — " + errors.join(" | ") : ""));
      await ctx.close();
    } catch (e) { check(false, "(3)(4) ran to its end without a harness error — " + e.message.split("\n")[0]); }
    // (5) The microphone prompt open (held a minute) when the repaint is asked
    // for, and then cancelled: the view catches up.
    try {
      const { ctx, page, errors } = await busyCtx(() => {
        if (window.top !== window || !navigator.mediaDevices) return;
        const g = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = async c => { if (window.__gumDelay) await new Promise(r => setTimeout(r, window.__gumDelay)); return g(c); };
      });
      await page.click("#view .pr-rec");
      await timer(page, "^0:01 ");
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      await page.evaluate(() => { window.__gumDelay = 60000; });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelector("#view .pr-rec").getAttribute("aria-busy") === "true", null, { timeout: 4000 });
      const asked = await mergedPush(page);
      const gap = await shown(page);
      check(asked && gap.view !== null && gap.view < gap.stored,
        "(5) a push merged in the laptop's entry while the prompt was open, and the repaint waited (the view says " + gap.view + " logged, storage holds " + gap.stored + ")");
      await page.click("#view .pr-rec");                          // cancel the start
      const up = await caughtUp(page), now = await shown(page);
      check(up, "(5) the prompt cancelled, the view catches up: " + now.view + " logged, storage holds " + now.stored);
      check(errors.length === 0, "(5) no page errors" + (errors.length ? " — " + errors.join(" | ") : ""));
      await ctx.close();
    } catch (e) { check(false, "(5) ran to its end without a harness error — " + e.message.split("\n")[0]); }
    // (6) Review 3, under reduced motion (every context here asks for it, so
    // a render replaces #view synchronously): the prompt open, a repaint
    // skipped, then the reader picks Humour — exactly one tab is pressed, and
    // it is Humour, with Humour's recorder on screen, once the view has caught
    // up. (7) The same state, then the reader leaves /practice: the view is
    // swapped exactly once (the router's render), not twice.
    const gumDelay = () => {
      if (window.top !== window || !navigator.mediaDevices) return;
      const g = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async c => { if (window.__gumDelay) await new Promise(r => setTimeout(r, window.__gumDelay)); return g(c); };
    };
    const promptSkipped = async page => {
      await page.click("#view .pr-rec");
      await timer(page, "^0:01 ");
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelectorAll("#view .pr-clip").length === 1, null, { timeout: 8000 });
      await page.evaluate(() => { window.__gumDelay = 60000; });
      await page.click("#view .pr-rec");
      await page.waitForFunction(() => document.querySelector("#view .pr-rec").getAttribute("aria-busy") === "true", null, { timeout: 4000 });
      const asked = await mergedPush(page), gap = await shown(page);
      return asked && gap.view !== null && gap.view < gap.stored;
    };
    // A queued task and two frames: whatever the app queued before this ran.
    const drained = page => page.evaluate(() => new Promise(r => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(r)), 0)));
    try {
      const { ctx, page, errors } = await busyCtx(gumDelay);
      const skipped = await promptSkipped(page);
      await page.click("#view [data-ptab=humor]");
      const up = await caughtUp(page);
      await drained(page);
      const t = await page.evaluate(() => ({ pressed: [...document.querySelectorAll("#view [data-ptab]")].filter(b => b.getAttribute("aria-pressed") === "true").map(b => b.dataset.ptab),
        recorder: (document.querySelector("#view .pr-rec") || { dataset: {} }).dataset.kind || null, reduce: matchMedia("(prefers-reduced-motion: reduce)").matches }));
      check(skipped, "(6) reduced motion: the prompt open, a merged push, and the repaint waited");
      check(skipped && up && t.reduce && t.pressed.length === 1 && t.pressed[0] === "humor" && t.recorder === "humor",
        "(6) reduced motion: picking Humour then leaves exactly one tab pressed, Humour, with Humour's recorder on screen and the view caught up (" + JSON.stringify(Object.assign({ caughtUp: up }, t)) + ")");
      check(errors.length === 0, "(6) no page errors" + (errors.length ? " — " + errors.join(" | ") : ""));
      await ctx.close();
    } catch (e) { check(false, "(6) ran to its end without a harness error — " + e.message.split("\n")[0]); }
    try {
      const { ctx, page, errors } = await busyCtx(gumDelay);
      const skipped = await promptSkipped(page);
      await page.evaluate(() => { const v = document.querySelector("#view"); window.__swaps = 0;
        new MutationObserver(ms => { window.__swaps += ms.filter(m => m.target === v && m.addedNodes.length).length; }).observe(v, { childList: true }); });
      await page.evaluate(() => { location.hash = "#/"; });
      await page.waitForFunction(() => location.hash === "#/" && !document.querySelector("#view .pr-seg") && !!document.querySelector("#view > *"), null, { timeout: 6000 });
      await drained(page);
      const swaps = await page.evaluate(() => window.__swaps);
      check(skipped && swaps === 1, "(7) reduced motion: leaving /practice with the prompt open and a repaint waiting swaps the view once (" + swaps + " swap(s))");
      check(errors.length === 0, "(7) no page errors" + (errors.length ? " — " + errors.join(" | ") : ""));
      await ctx.close();
    } catch (e) { check(false, "(7) ran to its end without a harness error — " + e.message.split("\n")[0]); }
    await mic.close();
  }

  // T-043 (loop/specs/T-043-lecture-quiz-gate/spec.md): the lecture quiz
  // pass is carried apart from the "further along" rule. Device A here; the
  // remote is device B. Every date comes from the app's QUIZ_GATE_FROM
  // (review r1): G-1 is before the gate, G+n after it, the clock at G+5.
  //  (k0) A passed, B's copy is further along (verified) with no quiz: the
  //       pass survives B winning.
  //  (k1) both passed: passedAt/at from the earlier pass; firstTry, total
  //       and attempts together from the better sitting — never mixed.
  //  (k2) only B passed: after the pull the lock on the next lecture lifts
  //       and the dashboard's next action moves on with it.
  //  (k3) both watched: the earliest doneAt and firstDoneAt stand, so a
  //       lecture first watched before the gate stays grandfathered.
  console.log("A quiz pass survives the merge, and the lock and the dashboard follow it (T-043):");
  {
    const probe = await browser.newContext();
    const pp = await probe.newPage();
    await pp.goto(URL + "/__test", { waitUntil: "load" });
    await pp.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 10000 });
    const G = await pp.evaluate(() => window.__brickfordTest.QUIZ_GATE_FROM);
    await probe.close();
    const day = n => { const d = new Date(G + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", timezoneId: "UTC" });
    await ctx.clock.setFixedTime(new Date(day(5) + "T12:00:00Z"));
    const Q = (passedAt, firstTry, total, attempts) => ({ passedAt, at: passedAt + "T10:00:00.000Z", firstTry, total, attempts: attempts == null ? total + 1 : attempts });
    const K0 = "math120.0.0", K1 = "math120.0.1", K1B = "math110.0.1", K2 = "math120.0.2", K3 = "math130.0.0", K4 = "spch100.0.0";
    const W = (doneAt, more) => Object.assign({ done: true, doneAt, notes: "", checks: [] }, more || {});
    const local = { lessons: {
      [K0]: W(day(1), { quiz: Q(day(3), 1, 2) }),
      [K1]: W(day(1), { quiz: Q(day(1), 3, 3, 3) }),
      [K1B]: W(day(1), { quiz: Q(day(3), 2, 2, 2) }),
      [K2]: W(day(4)),
      [K3]: W(day(1), { firstDoneAt: day(-1) }),
      [K4]: W(day(2)) } };
    const remote = { v: 1, device: "device-b", ledgers: {}, state: { lessons: {
      [K0]: W(day(1), { verified: true, verifiedAt: day(4), notes: "x".repeat(90), recall: "y".repeat(130), solved: 3, checks: [true, true, true] }),
      [K1]: W(day(1), { quiz: Q(day(3), 5, 8, 9) }),
      [K1B]: W(day(1), { quiz: Q(day(1), 1, 2, 3) }),
      [K2]: W(day(4), { quiz: Q(day(4), 2, 2) }),
      [K3]: W(day(2), { verified: true, verifiedAt: day(2), notes: "x".repeat(90), recall: "y".repeat(130), solved: 3, checks: [true, true, true] }),
      [K4]: W(day(-1)) } } };
    await ctx.addInitScript(s => {
      if (window.top !== window) return;
      localStorage.setItem("brickford_gh_token", "ghp_stub_token_for_the_harness");
      if (!localStorage.getItem("darhikmah_v1")) localStorage.setItem("darhikmah_v1", s);
    }, JSON.stringify(local));
    const page = await ctx.newPage();
    let serve = false;
    await page.route("https://api.github.com/**", route => {
      if (route.request().method() === "GET")
        return route.fulfill({ status: 200, contentType: "application/json",
          body: JSON.stringify({ sha: "stubsha", content: Buffer.from(JSON.stringify(serve ? remote : {})).toString("base64") }) });
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: { sha: "newsha" } }) });
    });
    const stored = () => page.evaluate(() => (JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons) || {});
    const view = async route => {
      await page.goto(URL + route, { waitUntil: "load" });
      await page.waitForSelector("#view > *");
      return page.evaluate(() => ({
        lock: !!document.querySelector("#view .lq-lock"), mark: !!document.querySelector("#view [data-act=toggleDone]"),
        next: (document.querySelector(".card.one.lead a.one-go") || {}).getAttribute ? document.querySelector(".card.one.lead a.one-go").getAttribute("href") : "",
        kind: ((document.querySelector(".card.one.lead .one-kind") || {}).textContent || "").trim() }));
    };
    // Where the dashboard should point, walked here from storage and the
    // summaries' checks (not from the app's lock code): today's first lecture
    // not cleared, then back through the chain of locks in front of it.
    const expectNext = async () => {
      await page.goto(URL + "/__test", { waitUntil: "load" });
      await page.waitForFunction(() => !!window.__brickfordTest, null, { timeout: 10000 });
      return page.evaluate(() => {
      const T = window.__brickfordTest, D = window.DAR, gate = T.QUIZ_GATE_FROM;
      const L = JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons || {};
      const d0 = new Date(), iso = d0.getFullYear() + "-" + String(d0.getMonth() + 1).padStart(2, "0") + "-" + String(d0.getDate()).padStart(2, "0");
      const quiz = k => !!(((D.SUMMARIES || {})[k] || {}).checks || []).length;
      const gf = s0 => !!s0.done && [s0.doneAt, s0.firstDoneAt].filter(Boolean).sort()[0] < gate;
      const passed = s0 => !!(s0.quiz && s0.quiz.passedAt);
      const cleared = k => { const s0 = L[k] || {}; return !!s0.done && (passed(s0) || !quiz(k) || gf(s0)); };
      const blocks = k => { const s0 = L[k] || {}; return quiz(k) && !passed(s0) && !gf(s0); };
      const it = T.scheduledFor(iso).filter(x => !x.pseudo).find(x => !cleared(x.cid + "." + x.ui + "." + x.li));
      if (!it) return null;
      const flat = []; D.COURSES.find(c => c.id === it.cid).units.forEach((u, ui) => u.lessons.forEach((_, li) => flat.push(it.cid + "." + ui + "." + li)));
      let i = flat.indexOf(it.cid + "." + it.ui + "." + it.li);
      while (i > 0 && !(L[flat[i]] || {}).done && blocks(flat[i - 1])) i--;
      return "#/lesson/" + flat[i].split(".").join("/");
    }); };
    try {
      const wantBefore = await expectNext();
      const dashBefore = await view("/");
      const lockBefore = await view("/lesson/math120/0/3");
      const k4Before = await view("/lesson/spch100/0/1");
      serve = true;
      await page.goto(URL + "/sync", { waitUntil: "load" });
      await page.waitForSelector("[data-act='syncPull']");
      await page.click("[data-act='syncPull']");
      await page.waitForFunction(k => !!(((JSON.parse(localStorage.getItem("darhikmah_v1") || "{}").lessons || {})[k] || {}).quiz), K2, { timeout: 8000 }).catch(() => {});
      const L = await stored();
      const q = k => JSON.stringify((L[k] || {}).quiz || null);
      const sameQ = (k, want) => JSON.stringify((L[k] || {}).quiz || null) === JSON.stringify(want);
      check(!!L[K0] && L[K0].verified === true && sameQ(K0, Q(day(3), 1, 2)),
        "(k0) the pass on this device survives the remote's further-along copy winning (verified " + (L[K0] || {}).verified + ", quiz " + q(K0) + ")");
      check(sameQ(K1, Q(day(1), 3, 3, 3)),
        "(k1) an earlier 3 of 3 here against a later 5 of 8 there: this sitting, whole — no 5 of 3 (" + q(K1) + ")");
      check(sameQ(K1B, { passedAt: day(1), at: day(1) + "T10:00:00.000Z", firstTry: 2, total: 2, attempts: 2 }),
        "(k1) a later 2 of 2 here against an earlier 1 of 2 there: the remote's passedAt and at, this sitting's firstTry, total and attempts (" + q(K1B) + ")");
      check(sameQ(K2, Q(day(4), 2, 2)), "(k2) a pass only the remote had arrives (" + q(K2) + ")");
      check(!!L[K3] && L[K3].verified === true && L[K3].doneAt === day(1) && L[K3].firstDoneAt === day(-1),
        "(k3) the remote's copy wins, and the earliest doneAt and the first-watched date before the gate stand (" + JSON.stringify(L[K3] && { doneAt: L[K3].doneAt, firstDoneAt: L[K3].firstDoneAt, verified: L[K3].verified }) + ")");
      check(!!L[K4] && L[K4].doneAt === day(-1), "(k3) both watched: the earlier doneAt (before the gate) stands (" + (L[K4] || {}).doneAt + ")");
      const lockAfter = await view("/lesson/math120/0/3");
      const k4After = await view("/lesson/spch100/0/1");
      const k3Next = await view("/lesson/math130/0/1");
      const dashAfter = await view("/");
      const wantAfter = await expectNext();
      check(lockBefore.lock && !lockBefore.mark && !lockAfter.lock && lockAfter.mark,
        "(k2) lecture 4 is locked before the pull and open after it (before: lock " + lockBefore.lock + ", after: lock " + lockAfter.lock + ", Mark watched " + lockAfter.mark + ")");
      check(k4Before.lock && !k4After.lock && !k3Next.lock,
        "(k3) SPCH 100 lecture 2 is locked before the pull and open after it (grandfathered by the merged date); MATH 130 lecture 2 stays open (" +
          JSON.stringify({ k4Before: k4Before.lock, k4After: k4After.lock, k3Next: k3Next.lock }) + ")");
      check(!!wantBefore && dashBefore.next === wantBefore && dashAfter.next === wantAfter && (wantBefore !== wantAfter || wantBefore.indexOf("math120") < 0),
        "(k2) the dashboard's next action follows the merged state: " + dashBefore.next + " (" + dashBefore.kind + ") -> " + dashAfter.next + " (" + dashAfter.kind + "); walked here: " +
          wantBefore + " -> " + wantAfter);
    } catch (e) { check(false, "the quiz merge half ran to its end without a harness error — " + e.message.split("\n")[0]); }
    await ctx.close();
  }

  await browser.close();
  console.log(fails
    ? "\nFAIL — " + fails + " assertion" + (fails === 1 ? "" : "s") + " broken"
    : "\nPASS — sync never restarts the video, and a rejected token latches only the automatic push, and a pull never carries the theme, and a recording never leaves the device, and a background repaint leaves a playing or paused recording and a recording in progress alone, and runs once they are done (T-028), and a quiz pass survives every merge (T-043)");
  process.exit(fails ? 1 : 0);
})();
