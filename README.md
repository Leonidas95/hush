# Hush

An ambient sound mixer for the browser. Blend rain, waves, fire and a dozen other
textures into a room to think in, then keep it or share it or fall asleep to it.

- **No account, no server.** Your mix is saved in `localStorage` and never leaves the device.
- **Nothing is downloaded.** Every sound is synthesised in the browser as you
  listen (see [Sound](#sound)), so the app is small and the loops never repeat.
- **Shareable.** A mix encodes into the URL hash, so a link rebuilds it exactly.

Live at [leonidas95.github.io/hush](https://leonidas95.github.io/hush/).

## Sound

There are no audio files. Each of the sixteen voices is a small Web Audio graph
built from filtered noise and oscillators:

| Voice | How it is made |
| --- | --- |
| Rain, Thunder | A broadband bed plus scattered drop bursts; thunder adds slow, low rolls with long tails |
| Waves | A dark bed whose level and brightness rise together into each break, then draw back more slowly |
| Stream | Bright, narrow water noise with a restless mid band and rising bubbles |
| Wind, Leaves | A band whose centre wanders on a random walk, so gusts never arrive on a schedule |
| Fire | A combustion bed under crackles a few milliseconds long |
| Crickets, Birds, Café | Event voices: trills, phrased calls, and the mid-band roll of a full room |
| Train, Fan | A low bed plus, respectively, the two-beat clack of a rail joint and a blade-rate ripple |
| Chimes | Struck partials at deliberately inharmonic ratios, with long tails |
| White / Pink / Brown noise | The three spectral colours, offered plainly |

Two details matter for quality:

- **Seamless loops.** Looping raw noise clicks, because the last sample and the
  first are unrelated. Each noise buffer is generated with a tail past the loop
  point and crossfaded back over its head on an equal-power curve.
- **Balanced levels.** The voices are built from different processes, so their
  natural loudness varies widely; rain buried chimes at the same slider
  position. Each voice carries a trim measured against rain, and the mix bus
  ends in a limiter, so stacking every sound at full level can only ever get
  loud, never distort.

## Features

- Sixteen voices, each with its own level, on a grid of tiles.
- Eight blends (Rainy window, Deep focus, Night train and so on) as starting points.
- A sleep timer of 15 to 120 minutes that fades the mix out over the final 30 seconds.
- Share: copies a link carrying the current mix in the hash to the clipboard.
- The mix and the master level are restored on the next visit.

## Structure

Single Vite app, no monorepo.

- `src/audio` — the mixer: `noise.ts` generates the looping noise buffers,
  `voices/` builds each voice on the shared kit in `voices/kit.ts`, and
  `engine.ts` owns the single `AudioContext`, the channel gains and the limiter.
- `src/sounds/catalog.ts` — the sixteen sounds, pairing name, glyph and accent
  with a voice factory.
- `src/state` — `mix.ts` holds the presets, the share encoding and persistence;
  `useMixer.ts` is the hook the screens talk to.
- `src/features` — the screens: header, sound grid, transport bar, and the
  preset and timer sheets.
- `src/ui` — the entire design surface, backed by Astryx. Nothing outside this
  directory imports `@astryxdesign/*` or ships CSS. See `src/ui/AGENTS.md`.

## Getting started

```sh
pnpm i --frozen-lockfile
pnpm theme:build     # generates the Astryx theme, needed before dev or build
pnpm dev
pnpm build
pnpm lint            # oxlint
```

`pnpm theme:check` verifies the generated theme is current without rewriting it.

## Deployment

Pushing to `main` runs `.github/workflows` (lint, build, deploy) and publishes to
GitHub Pages. The build sets `BASE_PATH` to the repo name, which `vite.config.ts`
uses as its `base`; set `BASE_PATH=/` to serve from a custom domain.

## Tooling

- **[Vite](https://vitejs.dev/)** — dev server and bundling.
- **[React 19](https://react.dev/)** with the React Compiler via Babel.
- **[Astryx](https://www.npmjs.com/package/@astryxdesign/core)** — the design system behind `src/ui`.
- **[oxlint](https://oxc.rs/docs/guide/usage/linter)** — linting.
- **[TypeScript](https://www.typescriptlang.org/)** — strict, project references.
