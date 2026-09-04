import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const PRECACHE_PLACEHOLDER = '__BUILD_ASSETS__'

function serviceWorker(): Plugin {
  return {
    name: 'hush-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const assets = Object.keys(bundle)
        .filter((fileName) => fileName !== 'index.html')
        .map((fileName) => `./${fileName}`)
      const source = readFileSync(fileURLToPath(new URL('./src/pwa/sw.js', import.meta.url)), 'utf8')

      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: source.replace(PRECACHE_PLACEHOLDER, JSON.stringify(assets)),
      })
    },
  }
}

export default defineConfig({
  base: process.env.BASE_PATH ?? '/hush/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    serviceWorker(),
  ],
})
