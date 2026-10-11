# T-039: the flaky "switch (c)" check — storage lost on reload in the harness

Source: T-031 and T-026c builders and the T-031 reviewer, 2026-10-10.
- verify-design's T-024 check "switch (c): Light picked from the menu after the switch survives a reload" fails at random.
- It failed in 2 of ~12 design runs on T-031 and in 4 of 6 on T-026c.
- In isolation it fails 4 of 24 at 45fdf55 (main) and 2 of 24 at T-026c's head. The check's code is identical in both.
- **A flaky gate blocks every merge, and it trains everyone to ignore red.**

## Diagnosis (coordinator, 2026-10-10)
Evidence is in `evidence/run2-diag.txt`: 30 isolated runs of the switch (a)/(c) block at T-026c's head, instrumented. One run failed.

1. **Before the reload, the app saved correctly.** In all 30 runs, right after the Light pick, the page's own `localStorage` held `settings.theme = "light"`, and `data-theme` was light.
2. **After the reload, in the failing run, storage started empty.** At document start, before any app script, `localStorage.getItem("darhikmah_v1")` returned **null**.
   - The seed's `sessionStorage` flag was present, so the seed correctly did not rewrite it.
   - Everything was gone, including the lecture marked watched by `reallySave`.
   - The app then booted with the defaults (dark), and its lesson render saved them. That is what the check read: `{"raw":true,"has":false}`.
   - In the 29 passing runs, the reloaded page found `{theme:"light", themeNavyOnce:true}` at document start.
3. **So the browser lost the origin's localStorage across the reload.** The app did not. The harness runs a `file://` page in an ephemeral Playwright context, and a reload there can come back with an empty storage area. Nothing in the app runs before that read, so no app bug can produce a null there.

## Scope
1. **A precondition proof on every reload in a gate.**
   - Before each `page.reload` in `tools/verify-design.js` (switch (c) about line 2243, (c2) about line 2261), `tools/verify-flows.js` (about line 1333) and `tools/verify-sync-loop.js` (about lines 226 and 256), arm a document-start probe: an init script that records, before any app script, whether the state key was present (`window.__bootHadState`).
   - After the reload:
     - **If the state was stored before the reload and the reloaded document found it missing,** the browser lost storage. That reading is not a measurement of the app. Re-run that block from a fresh context, up to 5 attempts in all (amended 2026-10-11, see below; originally 3), and print a line saying so, e.g. `note  switch (c): storage lost on reload (attempt 1 of 5), re-measured`.
     - **If all 5 attempts lose storage,** the gate FAILS with that reason. It never passes silently.
     - **If storage arrived,** the check's assertions run exactly as today, unchanged.
2. **Do not loosen any assertion.** The checks' predicates stay byte-identical; only the retry-on-precondition wrapper is new. Use one shared helper, not five copies.
3. **Comments.** Each harness's header comment gets a short paragraph: the diagnosis, and why the precondition is read at document start (the app cannot write before it).
4. **Do not change the app.** `platform/` is untouched; no `?v=` bump is needed.

## Acceptance criteria
1. **The isolated block runs 60 times with 0 failures.** Run switch (a)/(c) at the new head (the method is in `evidence/`; extract the block as the coordinator did). Any storage-loss re-measures are counted and reported. The full verify-design runs 3 times sequentially and passes every time.
2. **Plants, each exiting 1:**
   - (a) **App bug.** Make the theme pick not save: remove the `save()` from the menu's click handler in `platform/js/app.js`. switch (c) must still FAIL. It must not be retried into a pass, because storage arrives and holds no theme.
   - (b) **Storage always lost.** Inject a document-start script that clears localStorage on every reload. The gate must FAIL after 5 attempts (amended 2026-10-11; originally 3), with the storage-lost reason.
   - (c) **Silent retry.** Make the wrapper retry on any failure, not only the storage-lost precondition. Then plant (a) passes, so show that plant (a) is what catches this. The reviewer checks that the wrapper's retry condition is the precondition alone.
   - Restore every plant byte-for-byte (`cmp`).
3. **All gates green, run one at a time,** plus clip under `TZ=America/Los_Angeles`. The clip baseline is unchanged.

## Amendment, 2026-10-11 (coordinator, from review rounds 1–3)
The rule in Scope 1 was replaced during review. What ships, in `tools/lib-reload.js`:

1. **The stamps decide, not the state key.**
   - Just before the reload the harness writes a unique stamp into localStorage. For switch (c) only (`session: true`), it also writes one into sessionStorage.
   - A document-start probe reads the stamps back.
   - Whether the state key arrived is left to the checks to measure.
   - Why: in round 1, a missing key next to two present stamps could only mean the old page's own unload handlers had removed it. An app bug that removed it half the time passed 18 of 20 runs after re-measure.
2. **An unload report.**
   - Listeners for pagehide, visibilitychange (hidden) and unload are added last, so they run after the app's own.
   - They report through a harness-only `page.exposeBinding` channel whether the old page still held the key and the stamps as it unloaded.
   - If the report says the app took them, the attempt is measured, never retried.
   - Why: in round 1, an app clearing storage at unload read as a browser loss.
3. **Fail-closed.**
   - With no unload report, the attempt is measured, never retried.
   - Why: in round 2, an app that silenced `console.log`, the first report channel, turned the report off. Its wipe was then retried: 3 of 20 runs failed, against 10 of 20 at base.
   - The binding was measured delivering all three events on 150 of 150 reloads.
4. **The retry condition, whole:** `lost = storedBefore && !!report && !appRemoved && !kept(boot)`.
5. **The session stamp is opt-in.** Only switch (c) depends on sessionStorage, through verify-design's write-once seed. Nothing in `platform/` reads sessionStorage.
6. **5 attempts, not 3.**
   - The browser here drops the sessionStorage stamp on about 8–16% of reloads, in bursts.
   - In round 2 the reviewer saw one block lose all 3 attempts: a red gate caused by the browser alone.
   - Under the fail-closed, stamps-only rule, more attempts cannot pass an app failure.
7. **Every reading of a lost attempt is discarded,** failing checks included. Exhaustion records exactly one failure.
8. **Plant (c), as evidenced.** The plant that tells a silent retry from this wrapper skips the Light pick in attempt 1 only, with storage intact.
   - HEAD exits 1 with 0 re-measures.
   - HEAD with a retry-on-any-failure wrapper exits 0.
