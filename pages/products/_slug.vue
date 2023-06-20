<template>
  <section class="content product">
      <section class="container-fluid">
        HELLO
      </section>
  </section>
</template>

<script>  
  export default {
    async asyncData({ app, error, store, params}) {
      const locale = store.state.i18n.locale;
      let product = await app.$swell.products.get(params && params.slug)

      if (product) {
        return {
          product,
        }
      } else {
        error({ statusCode: 404, message: 'Page not found' })
      }
    },
    head() {
      return {
        title: `La Bête | ${this.product.meta_title || this.product.name}`,
        link: [
        //{ rel: 'canonical', href: `https://<DOMAIN>${this.$prismic.linkResolver(this.document)}` }
        ],
        meta: [
          { hid: 'description', name: 'description', content: `${this.product.meta_description || this.product.description}` }
        ]
      }
    },
    data() {
    },
    watch: {
    },
    methods: {
    },
    components: {
    },
    nuxtI18n: {
      paths: {
        fr: '/produits/:slug',
        en: '/products/:slug'
      }
    },
  }
</script>
