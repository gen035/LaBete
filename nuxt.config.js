
export default {
  mode: 'universal',
  target: 'static',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel:'apple-touch-icon-precomposed', sizes:'57x57', href:'/apple-touch-icon-57x57.png' },
      { rel:'apple-touch-icon-precomposed', sizes:'114x114', href:'/apple-touch-icon-114x114.png' },
      { rel:'apple-touch-icon-precomposed', sizes:'72x72', href:'/apple-touch-icon-72x72.png' },
      { rel:'apple-touch-icon-precomposed', sizes:'144x144', href:'/apple-touch-icon-144x144.png' },
      { rel:'apple-touch-icon-precomposed', sizes:'60x60', href:'/apple-touch-icon-60x60.png' },
      { rel:'apple-touch-icon-precomposed', sizes:'120x120', href:'/apple-touch-icon-120x120.png' },
      { rel:'apple-touch-icon-precomposed', sizes:'76x76', href:'/apple-touch-icon-76x76.png' },
      { rel:'apple-touch-icon-precomposed', sizes:'152x152', href:'/apple-touch-icon-152x152.png' },
      { rel:'icon', type:'image/png', href:'/favicon-196x196.png', sizes:'196x196' },
      { rel:'icon', type:'image/png', href:'/favicon-96x96.png', sizes:'96x96' },
      { rel:'icon', type:'image/png', href:'/favicon-32x32.png', sizes:'32x32' },
      { rel:'icon', type:'image/png', href:'/favicon-16x16.png', sizes:'16x16' },
      { rel:'icon', type:'image/png', href:'/favicon-128.png', sizes:'128x128' },
      { rel: 'stylesheet', href:'/font-awesome/css/fontawesome.css'},
      { rel: 'stylesheet', href:'/font-awesome/css/brands.css'},
      { rel: 'stylesheet', href:'/font-awesome/css/solid.css'},
      { name:'application-name', content:'La Bête'},
      { name:'msapplication-TileColor', content:'#343434' },
      { name:'msapplication-TileImage', content:'/mstile-144x144.png' },
      { name:'msapplication-square70x70logo', content:'/mstile-70x70.png' },
      { name:'msapplication-square150x150logo', content:'/mstile-150x150.png' },
      { name:'msapplication-wide310x150logo', content:'/mstile-310x150.png' },
      { name:'msapplication-square310x310logo', content:'/mstile-310x310.png' },
    ],
    script: [
      { src: 'https://www.googletagmanager.com/gtag/js?id=G-TBQWHYP39H', async: true },
      // This script will only be included in production
      ...(process.env.NODE_ENV === 'PRODUCTION'
        ? [{ src: '/ga.js', async: true}]
        : [])
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#bb9842' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/styles/application.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/lightGallery.client.js',
    '~/plugins/swell.js'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'cookie-universal-nuxt',
    ['prismic-nuxt', {
      endpoint: 'https://labete.cdn.prismic.io/api/v2',
      linkResolver: function(doc, ctx) {
        return '/'
      }
    }],
    ['nuxt-i18n', {
      locales: [
        {
          name: 'English',
          code: 'en',
          iso: 'en-CA',
          file: 'en.js'
        },
        {
          name: 'Francais',
          code: 'fr',
          iso: 'fr-CA',
          file: 'fr.js'
        }
      ],
      langDir: 'locales/',
      defaultLocale: 'fr',
      lazy: true
    }],
    ['bootstrap-vue/nuxt'],
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/sitemap'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
  },
  publicRuntimeConfig: {
    swellPublicKey: process.env.SWELL_PUBLIC_KEY,
    swellStoreId: process.env.SWELL_STORE_ID
  }
}
