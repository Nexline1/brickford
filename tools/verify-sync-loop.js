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
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
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
    await page.goto(URL + "/lesson/math110/0/1", { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.click("[data-act='toggleDone']");
    await page.waitForTimeout(6000);
    check(puts > before, "automatic push resumes once sync works again");
    await ctx.close();
  }

  await browser.close();
  console.log(fails
    ? "\nFAIL — " + fails + " assertion" + (fails === 1 ? "" : "s") + " broken"
    : "\nPASS — sync never restarts the video, and a rejected token latches only the automatic push");
  process.exit(fails ? 1 : 0);
})();
