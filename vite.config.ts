import { fileURLToPath, URL } from 'node:url';


import { defineConfig } from 'vite'

import VueRouter from 'unplugin-vue-router/vite'
import vue from '@vitejs/plugin-vue'
import eslint from '@nabla/vite-plugin-eslint';

import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import { ghPages } from "vite-plugin-gh-pages"

// https://vite.dev/config/
export default defineConfig({
  // base: "/rpg-props-fake-docs/",
  plugins: [
    VueRouter({
      /* options */
    }),
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    }),
    eslint(),
    ghPages(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
