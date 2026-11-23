# App icons — how to replace them with your own logo

These PNGs are what iOS and Android use when Brickford is added to a home
screen, and what browsers show in the tab. Since 23 Nov 2026 they are the
**owner's crest**: double-keyline shield, laurel wreath, temple, two diamonds,
in gold `#DFB46B` on black `#090909`, traced from his artwork (left half
mirrored, so it is exactly symmetric).

**One master, everything generated.** `crest.svg` here is the only drawing.
`node tools/crest-gen.js` writes it into the website's sidebar
(`platform/index.html`, coloured by each theme's `--crest`), the phone app's
boot screen (`app/web/index.html`), the Flutter painter
(`app/lib/widgets/crest_data.dart`), and every PNG below, in both
`platform/icons/` and `app/web/icons/`. To change the logo: replace the path in
`crest.svg`, run the script, bump the `?v=` token, rebuild the app
(`tools/build-app.sh`).

## Drop your files here, with these exact names

| file | size | used by | notes |
|---|---|---|---|
| `apple-touch-icon.png` | **180×180** | iOS "Add to Home Screen" | **Must be PNG and fully opaque.** Safari ignores SVG here, and it composites transparency onto black. |
| `icon-192.png` | **192×192** | Android / Chrome install | |
| `icon-512.png` | **512×512** | Android / Chrome, splash screen | |
| `icon-maskable-512.png` | **512×512** | Android adaptive icons | Keep the logo inside the middle **~66%**. Android may crop this to a circle, and anything near the edge gets cut. |

Same names, same sizes, and nothing else needs editing — `manifest.json` and the
`<head>` of `index.html` already point at these paths.

## Two things that will bite

**Square, and no transparency.** A non-square image gets stretched. A transparent
background turns black on iOS rather than white.

**Bump the cache token or your phone keeps the old icon.** iOS caches home-screen
icons aggressively — more so than any other asset. In `platform/index.html`, the
icon links and the manifest carry `?v=…`; change that value (it is the same token
used for the CSS and JS), then remove the app from your home screen and re-add it.
Without both steps you will keep seeing the previous icon and conclude nothing
happened.

## Regenerating from the crest

`node tools/crest-gen.js` renders each icon in Chromium from `crest.svg`: the
crest at 80% of the square on opaque black for the home-screen and install
icons, 62% for the maskable one, and 94% for the tab icons (16/32/48), where
every pixel counts. The crest is 200x224, taller than wide, so it is centred,
never stretched.

## What this install does and does not do

It gives you a real app icon, no Safari chrome, and its own window — `display:
standalone`. It does **not** work offline: there is no service worker, on purpose.
One would fight the `?v=` cache-busting the project relies on, and could serve a
stale build for days; the lectures are YouTube videos that need the network
anyway. If offline access ever matters, that is a deliberate follow-up, not
something to bolt on.
