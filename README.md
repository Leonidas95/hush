# Hush

An ambient sound mixer for the browser. Blend rain, waves, fire and a dozen other
textures into a room to think in — then keep it, share it, or fall asleep to it.

- **No account, no server.** Nothing you do here leaves the device.
- **Installable.** A PWA that works with the network switched off.
- **Nothing is downloaded.** Every sound is synthesised in the browser as you
  listen (see [Sound](#sound)), so the whole app is a few hundred kilobytes and
  the loops never repeat.

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
  natural loudness varied by more than 30 dB — rain buried chimes at the same
  slider position. Each voice carries a trim measured against rain, and the mix
  bus ends in a limiter so stacking every sound at full level can only ever get
  loud, never distort.

## Structure

- `apps/web` — the Hush application. Composes screens exclusively from
  `@repo/ui` and ships no CSS of its own.
  - `src/audio` — the mixer: noise generation, voices, and the engine that owns
    the single `AudioContext`.
  - `src/sounds` — the catalogue pairing presentation with a voice.
  - `src/state` — the mix, presets, share links, and persistence.
- `packages/ui` — the entire design surface, backed by Astryx. See its
  `AGENTS.md`; the design system is confined to this package.
- `packages/typescript-config` — shared TypeScript configurations.
- `apps/api` — a NestJS service, unused by Hush and kept from the boilerplate.

## Getting started

```sh
pnpm i --frozen-lockfile
pnpm dev            # everything
pnpm dev -F=web     # just Hush
pnpm build
pnpm lint           # biome + knip
```

> The repo pins `pnpm@11`. Installing with pnpm 9 produces a subtly broken
> `node_modules` — some packages land without their dependencies, which breaks
> the Astryx CLI and service-worker generation in ways that look unrelated. If
> you hit that, `pnpm install --force` repairs it.

## Tooling

- **[Turborepo](https://turborepo.dev/)** — monorepo build orchestration.
- **[Vite](https://vitejs.dev/)** + **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** — bundling and the service worker.
- **[Biome](https://biomejs.dev/)** — linting and formatting.
- **[Knip](https://knip.dev/)** — dead code and dependency analysis.
- **[Husky](https://typicode.github.io/husky/)** — pre-commit checks.
