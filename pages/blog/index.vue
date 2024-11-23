<template>
  <h1>blog</h1>
</template>

<script>
  import VLazyImage from "v-lazy-image/v2";

  export default {
    async asyncData({ app, error, store, params}) {
      const locale = store.state.i18n.locale;

      let seo = await app.$prismic.api.getByID(locale === 'en' ? 'Z0E07xMAACQA3yRe' : 'Z0E1IBMAACIA3ySl');
      console.log(seo)
      seo = seo.data;

      return {
        seo
      }
    },
    head() {
      return {
        title: this.$prismic.asText(this.seo.title),
        link: [
        //{ rel: 'canonical', href: `https://<DOMAIN>${this.$prismic.linkResolver(this.document)}` }
        ],
        meta: [
          { hid: 'description', name: 'description', content: this.$prismic.asText(this.seo.description) }
        ]
      }
    },
    components: {
      VLazyImage
    },
    nuxtI18n: {
      paths: {
        fr: '/blogue',
        en: '/blog'
      }
    },
  }
</script>
