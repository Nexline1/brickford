{{flutter_js}}
{{flutter_build_config}}

// No service worker. Flutter's own is deprecated (it only unregisters itself
// and reloads the page), and the site's sw.js at the repo root answers only
// for platform/, the revision PDFs and the font/KaTeX hosts; offline for this
// app is a later stage of T-064.
// The boot screen in index.html stays up until the first frame
// ("flutter-first-frame"); a failure anywhere in here reaches its error screen.
try {
  const started = _flutter.loader.load({
    onEntrypointLoaded: async (engineInitializer) => {
      const appRunner = await engineInitializer.initializeEngine();
      await appRunner.runApp();
    },
  });
  if (started && started.catch) started.catch((e) => window.__bootFail && window.__bootFail(e && (e.stack || e.message) || e));
} catch (e) {
  if (window.__bootFail) window.__bootFail(e && (e.stack || e.message) || e);
}
