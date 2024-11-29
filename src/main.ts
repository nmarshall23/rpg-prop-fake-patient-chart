import { createApp } from 'vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from "primevue/toastservice";

import App from './App.vue'

import "@/assets/main.scss";
import '@/assets/tailwind.css';


import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
    history: createWebHistory(),
    // pass the generated routes written by the plugin 🤖
    routes,
  })

const app = createApp(App)

app
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .use(ToastService)

app.mount('#app')
