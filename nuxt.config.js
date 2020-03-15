
export default {
  mode: 'universal',
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
      { name:'application-name', content:'Genevieve Perron Migneron'},
      { name:'msapplication-TileColor', content:'#343434' },
      { name:'msapplication-TileImage', content:'/mstile-144x144.png' },
      { name:'msapplication-square70x70logo', content:'/mstile-70x70.png' },
      { name:'msapplication-square150x150logo', content:'/mstile-150x150.png' },
      { name:'msapplication-wide310x150logo', content:'/mstile-310x150.png' },
      { name:'msapplication-square310x310logo', content:'/mstile-310x310.png' },
      { rel: 'stylesheet', type: 'text/css', href: '//use.fontawesome.com/releases/v5.4.2/css/all.css'},
      { rel: 'stylesheet', type: 'text/css', href: '//fonts.googleapis.com/css?family=Assistant|PT+Serif'},
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/styles/application.sass'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/map.js',
    '~/plugins/axios.js'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
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
    ['@nuxtjs/google-analytics', {
      id: 'UA-34334834-1'
    }],
    '@nuxtjs/axios'
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
    transpile: [/^vue2-google-maps($|\/)/, 'vue2-gmap-custom-marker'],
  }
}
