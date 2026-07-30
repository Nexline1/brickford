# App icons — how to replace them with your own logo

These four PNGs are what iOS and Android use when Brickford is added to a home
screen. They are the **full crest** — shield, keyline, laurel wreath, temple,
diamond — rendered in the Parchment identity: brown `#5d3f26` on cream `#f8f4ec`.
The install already works; replace them whenever you have your own artwork.

Note the deliberate difference from the favicon: the browser-tab mark is a
**simplified** crest, because at 16px the laurels and the keyline turn to mud. An
app icon is 180-512px and has the resolution to carry the whole device. Two
drawings of one crest, each sized for where it is used.

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

The current set was rasterised from the `.crest` SVG in `platform/index.html` at
92% scale (66% for the maskable one), with the theme variables replaced by fixed
values — an app icon cannot follow a theme. The crest artwork is 200x224, taller
than wide, so it is centred in a square viewBox rather than stretched; stretching
it makes the shield fat.

## What this install does and does not do

It gives you a real app icon, no Safari chrome, and its own window — `display:
standalone`. It does **not** work offline: there is no service worker, on purpose.
One would fight the `?v=` cache-busting the project relies on, and could serve a
stale build for days; the lectures are YouTube videos that need the network
anyway. If offline access ever matters, that is a deliberate follow-up, not
something to bolt on.
