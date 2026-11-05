{{flutter_js}}
{{flutter_build_config}}

// No service worker. Flutter's own is deprecated (it only unregisters itself
// and reloads the page), and the site's sw.js at the repo root answers only
// for platform/, the revision PDFs and the font/KaTeX hosts; offline for this
// app is a later stage of T-064.
_flutter.loader.load({
  onEntrypointLoaded: async (engineInitializer) => {
    const appRunner = await engineInitializer.initializeEngine();
    const splash = document.getElementById("splash");
    if (splash) splash.remove();
    await appRunner.runApp();
  },
});
