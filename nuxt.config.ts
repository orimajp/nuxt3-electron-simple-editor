// https://nuxt.com/docs/api/configuration/nuxt-config
import type { ElectronOptions } from 'nuxt-electron'

export default defineNuxtConfig({
  app: {
    head: {
      style: [
        {
          children: "html, body { margin-bottom: -20px; }"
        }
      ],
    }
  },
  ssr: false,
  css: [
    'vuetify/lib/styles/main.sass',
    '/node_modules/github-markdown-css/github-markdown-dark.css',
    '/node_modules/highlight.js/styles/github-dark.css'
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    ['nuxt-electron', <ElectronOptions>{
      include: ['electron'],
    }],
  ],
})
