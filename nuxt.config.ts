// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  
  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      htmlAttrs: {
        lang: 'id'
      },
      title: 'Minuman Murah',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: 'Minuman Murah - Toko Online Terpercaya' },
        { key: 'og:image', property: 'og:image', content: '/assets/img/logo.png' },
        { key: 'og:title', property: 'og:title', content: 'Minuman Murah' },
        { key: 'og:description', property: 'og:description', content: 'Minuman Murah - Toko Online Terpercaya' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
        
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i' },
        
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css' }
      ]
    }
  },

  nitro: {
    devProxy: {
      '/storage': {
        target: (process.env.NUXT_PUBLIC_API_URL || '') + '/storage',
        changeOrigin: true,
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      customerFrontendUrl: process.env.NUXT_PUBLIC_CUSTOMER_FRONTEND_URL || ''
    }
  },
  
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@pinia/nuxt'
  ],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true
    },
  },
  
  css: [
    '@/assets/css/tailwind.css'
  ],

  components: true
})