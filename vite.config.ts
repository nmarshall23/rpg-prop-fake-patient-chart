import { defineConfig } from 'vite'

import VueRouter from 'unplugin-vue-router/vite'
import vue from '@vitejs/plugin-vue'
import eslint from '@nabla/vite-plugin-eslint';

import Components from 'unplugin-vue-components/vite'
import {PrimeVueResolver} from '@primevue/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
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
  ],
})
