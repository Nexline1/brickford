# Brickford — Flutter app (T-064)

The Flutter build of Brickford. `platform/` stays the live web app until parity.

- Data: `assets/data/*.json`, written by `node tools/export-data.js` from `platform/data/*.js`. Never edit by hand.
- Engine: `lib/engine/`, a 1:1 port of the date/schedule/streak functions in `platform/js/app.js`.
  `node tools/verify-app.js` holds the port to the JS, date by date.
- Fonts: Playfair Display and Inter, bundled under `assets/fonts/` (OFL, licences beside them);
  `GoogleFonts.config.allowRuntimeFetching` is false, so nothing is fetched at runtime.
- Web build: `tools/build-app.sh` builds with `--base-href /brickford/app/` and copies the output
  into this folder, which GitHub Pages serves at `/brickford/app/`.
