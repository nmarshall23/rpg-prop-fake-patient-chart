import { createApp } from 'vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from "primevue/toastservice";

import App from './App.vue'

import "@/assets/main.scss";
import '@/assets/tailwind.css';

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { definePreset } from '@primevue/themes';

const router = createRouter({
    history: createWebHistory(),
    // pass the generated routes written by the plugin 🤖
    routes,
})

const themePreset = definePreset(Aura, {
    //Your customizations, see the following sections for examples
    semantic: {
        colorScheme: {
            light: {
                root: {
                    background: '{surface.100}',
                    color: '{surface.700}'
                },
                subtitle: {
                    color: '{surface.500}'
                },
                content: {
                    background: '{sky.50}'
                },
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                }
            }
        }
    },
    components: {
        fieldset: {
            legend: {
                background: '{transparent}',
            }
        }
    }
});

const app = createApp(App)

app
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: themePreset,
            options: {
                darkModeSelector: false,
                cssLayer: {
                    name: 'primevue',
                    order: 'tailwind-base, primevue, tailwind-utilities'
                },
            },
        }
    })
    .use(ToastService)

app.mount('#app')
