// Brickford — the iOS design system as Tailwind tokens (T-051).
//
// Loaded from platform/css/tailwind.input.css with `@config`. Build with
// `npm run build:css`; tools/verify-tailwind.js fails when the committed
// platform/css/tailwind.css is not what this file and the input produce.
//
// Colours are DYNAMIC, the way iOS system colours are: `bg-canvas` reads
// var(--ios-canvas), and the plugin at the bottom writes that variable once for
// light (:root) and once for dark (:root[data-theme="dark"]). So a page never
// writes `dark:` for a colour; it names the role and the theme picks the value.
// Each token also exposes its two fixed values (`bg-canvas-light`,
// `bg-canvas-dark`) for the rare place that must not flip, such as a specimen
// swatch. The `dark:` variant itself is defined in the input CSS with
// @custom-variant and follows data-theme="dark" on <html>.
//
// Text contrast: every `*-text` token and `label-secondary` clears 4.5:1 on
// canvas and card in both themes (tools/verify-contrast.js keeps that true).
// The exact iOS hues (`tint`, `destructive`, `green`, `orange`, `gray` ...) are
// for fills, icons and large text only. `label-tertiary` is for chevrons and
// other glyphs, never for words.

const plugin = require("tailwindcss/plugin");

// [light, dark]. Apple's names in the comments.
const palette = {
  // Surfaces
  canvas:             ["#F2F2F7", "#000000"],   // systemGroupedBackground
  card:               ["#FFFFFF", "#1C1C1E"],   // secondarySystemGroupedBackground
  "card-inset":       ["#F2F2F7", "#2C2C2E"],   // tertiarySystemGroupedBackground: a well inside a card
  bar:                ["rgb(249 249 249 / 0.94)", "rgb(22 22 23 / 0.94)"], // chrome material (tab bar, sidebar), used with backdrop-blur
  // Ink
  label:              ["#1D1D1F", "#F5F5F7"],   // owner's ink (apple.com), in place of #000 / #FFF
  "label-secondary":  ["#6E6E73", "#8E8E93"],   // small grey text: accessible shade light, systemGray dark
  "label-tertiary":   ["#C7C7CC", "#48484A"],   // chevrons, disclosure glyphs; never words
  // Lines and states
  separator:          ["#C6C6C8", "#38383A"],   // opaque separator
  highlight:          ["#D1D1D6", "#3A3A3C"],   // systemGray4: a row while pressed
  fill:               ["#E5E5EA", "#2C2C2E"],   // systemGray5: tracks, empty segments, selected sidebar row
  // Tint (iOS blue)
  tint:               ["#007AFF", "#0A84FF"],   // systemBlue: icons, fills, large text
  "tint-text":        ["#0066CC", "#0A84FF"],   // links and tinted words
  "tint-fill":        ["#0071E3", "#0071E3"],   // filled-button background under white text (4.70:1)
  // Destructive (iOS red)
  destructive:        ["#FF3B30", "#FF453A"],   // systemRed: icons, fills
  "destructive-text": ["#D70015", "#FF453A"],   // red words (light: systemRed, increased contrast)
  // System greens and oranges
  green:              ["#34C759", "#30D158"],   // systemGreen: icons, fills, rings
  "green-text":       ["#1F7A35", "#30D158"],   // green words (light: darker than iOS #248A3D, which is 4.40:1 on white)
  orange:             ["#FF9500", "#FF9F0A"],   // systemOrange: icons, fills
  "orange-text":      ["#C93400", "#FF9F0A"],   // orange words (light: systemOrange, increased contrast)
  // The rest of the system palette, for icon tiles (Settings-style, white glyph)
  indigo:             ["#5856D6", "#5E5CE6"],
  purple:             ["#AF52DE", "#BF5AF2"],
  pink:               ["#FF2D55", "#FF375F"],
  teal:               ["#30B0C7", "#40C8E0"],
  gray:               ["#8E8E93", "#8E8E93"],   // systemGray: icon tiles only (fails 4.5:1 as small text in light)
};

const colors = {
  transparent: "transparent",
  current: "currentColor",
  inherit: "inherit",
  white: "#FFFFFF",
  black: "#000000",
};
for (const [name, [light, dark]] of Object.entries(palette)) {
  colors[name] = { DEFAULT: `var(--ios-${name})`, light, dark };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./platform/**/*.html",
    "./platform/js/**/*.js",
    // The owner's glob was specimen-apple-*.html, which would miss the
    // deliverable itself (specimen-apple.html); this matches both.
    "./loop/design/specimen-apple*.html",
  ],
  theme: {
    // Replaces Tailwind's palette entirely: no blue-500 can drift in beside
    // systemBlue.
    colors,
    fontFamily: {
      // SF on Apple devices (Safari: -apple-system, Chrome on macOS:
      // BlinkMacSystemFont), the self-hosted Inter everywhere else.
      sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "system-ui", "sans-serif"],
      mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
    },
    // The iOS text styles at the default ("Large") size, in rem so the
    // reader's text-size setting scales the layout. Line heights are Apple's
    // (17/22, not 1.5). Tracking is Inter's dynamic-metrics curve,
    //   tracking(em) = -0.0223 + 0.185 * e^(-0.1745 * size_px),
    // rounded to four places: negative from 13px up, positive below.
    fontSize: {
      tab:           ["0.625rem",  { lineHeight: "0.75rem",   letterSpacing: "0.0100em" }], // 10/12  tab-bar label
      caption2:      ["0.6875rem", { lineHeight: "0.8125rem", letterSpacing: "0.0048em" }], // 11/13
      caption1:      ["0.75rem",   { lineHeight: "1rem",      letterSpacing: "0.0005em" }], // 12/16
      footnote:      ["0.8125rem", { lineHeight: "1.125rem",  letterSpacing: "-0.0032em" }], // 13/18  captions, section headers
      subhead:       ["0.9375rem", { lineHeight: "1.25rem",   letterSpacing: "-0.0088em" }], // 15/20
      callout:       ["1rem",      { lineHeight: "1.3125rem", letterSpacing: "-0.0110em" }], // 16/21
      body:          ["1.0625rem", { lineHeight: "1.375rem",  letterSpacing: "-0.0128em" }], // 17/22  rows, body
      title3:        ["1.25rem",   { lineHeight: "1.5625rem", letterSpacing: "-0.0167em" }], // 20/25  card title
      title2:        ["1.375rem",  { lineHeight: "1.75rem",   letterSpacing: "-0.0183em" }], // 22/28
      title1:        ["1.75rem",   { lineHeight: "2.125rem",  letterSpacing: "-0.0209em" }], // 28/34
      "large-title": ["2.125rem",  { lineHeight: "2.5625rem", letterSpacing: "-0.0218em" }], // 34/41  page header
    },
    extend: {
      letterSpacing: {
        // Uppercase section headers: capitals set tight read as a shout.
        caps: "0.06em",
      },
      borderRadius: {
        icon: "0.4375rem", // 7px on a 29px Settings-style icon tile
        app: "22.37%",     // the app-icon corner, as a fraction of its side
      },
      spacing: {
        "icon-tile": "1.8125rem", // 29px
      },
      screens: {
        // The app's own breakpoint: below it the tab bar, above it the sidebar.
        nav: "860px",
      },
      transitionTimingFunction: {
        // Critically damped, no overshoot: a spring's shape as a curve.
        ios: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [
    // Writes every palette entry as a custom property, once per theme. The
    // `dark` values apply under data-theme="dark", the same attribute the
    // @custom-variant in the input CSS reads.
    plugin(({ addBase }) => {
      const light = { "color-scheme": "light" };
      const dark = { "color-scheme": "dark" };
      for (const [name, [l, d]] of Object.entries(palette)) {
        light[`--ios-${name}`] = l;
        dark[`--ios-${name}`] = d;
      }
      addBase({ ":root": light, ':root[data-theme="dark"]': dark });
    }),
  ],
};
