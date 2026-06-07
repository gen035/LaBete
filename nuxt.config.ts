export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  ssr: true,

  css: ['@/assets/styles/application.scss'],

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'apple-touch-icon-precomposed', sizes: '57x57',   href: '/apple-touch-icon-57x57.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '114x114', href: '/apple-touch-icon-114x114.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '72x72',   href: '/apple-touch-icon-72x72.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '144x144', href: '/apple-touch-icon-144x144.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '60x60',   href: '/apple-touch-icon-60x60.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '120x120', href: '/apple-touch-icon-120x120.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '76x76',   href: '/apple-touch-icon-76x76.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '152x152', href: '/apple-touch-icon-152x152.png' },
        { rel: 'icon', type: 'image/png', href: '/favicon-196x196.png', sizes: '196x196' },
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png',   sizes: '96x96' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png',   sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png',   sizes: '16x16' },
        { rel: 'icon', type: 'image/png', href: '/favicon-128.png',     sizes: '128x128' },
        { rel: 'stylesheet', href: '/font-awesome/css/all.min.css' },
      ],
      script: [
        ...(process.env.NODE_ENV === 'production' ? [
          { src: 'https://www.googletagmanager.com/gtag/js?id=G-TBQWHYP39H', async: true },
          { src: '/ga.js', async: true },
        ] : []),
      ],
    },
  },

  modules: [
    '@nuxtjs/prismic',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],

  plugins: [
    '~/plugins/01.swell.ts',
    '~/plugins/02.init.server.ts',
    '~/plugins/bootstrap.client.ts',
  ],

  prismic: {
    endpoint: 'labete',
    preview: false,
    toolbar: false,
  },

  i18n: {
    restructureDir: false,
    customRoutes: 'page',
    compilation: {
      strictMessage: false,
    },
    locales: [
      { name: 'English',  code: 'en', language: 'en-CA', file: 'en.js' },
      { name: 'Francais', code: 'fr', language: 'fr-CA', file: 'fr.js' },
    ],
    langDir: 'locales/',
    defaultLocale: 'fr',
    lazy: true,
    detectBrowserLanguage: false,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Bootstrap 5.x uses legacy @import, mix(), unit(), red/green/blue(), and
          // mixed-decls patterns that Dart Sass now warns about. Suppress them here
          // since they come from third-party code we cannot change.
          // See: https://getbootstrap.com/docs/5.3/getting-started/vite/#sass
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls'],
        },
      },
    },
  },

  nitro: {
    preset: 'vercel',
  },

  runtimeConfig: {
    public: {
      swellPublicKey: process.env.SWELL_PUBLIC_KEY,
      swellStoreId:   process.env.SWELL_STORE_ID,
    },
  },
})
