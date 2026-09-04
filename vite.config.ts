import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://leonidas95.github.io/hush/, so assets need the repo
  // name as a prefix. Overridable for custom domains via BASE_PATH.
  base: process.env.BASE_PATH ?? '/hush/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
