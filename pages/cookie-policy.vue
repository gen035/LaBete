<template>
  <section class="content cookie_policy">
      <section class="container">
        <div class="row">
            <div
              v-html="$prismic.asHtml(content.title)"
              class="col-md-12"
            />
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-8" v-html="$prismic.asHtml(content.content)" />
        </div>
      </section>
  </section>
</template>

<script>
  export default {
    async asyncData({ app, error, store }) {
      const locale = store.state.i18n.locale;
      let content = []

      await app.$prismic.api.getByUID('page', 'cookie_policy', {
          lang: `${locale}-ca`
      }).then((response) => {
          if (response) {
              content = response.data;
          } else {
              console.error('Document not found');
          }
      }).catch((error) => {
          console.error('Error fetching document:', error);
      });

      let seo = await app.$prismic.api.getByID(content.seo.id)
      seo = seo.data;

      if (content) {
        return {
          content,
          seo
        }
      } else {
        error({ statusCode: 404, message: 'Page not found' })
      }
    },
    methods: {
      formattedTitle(item) {
        const title = item && item.label && item.label.length > 0 && item.label[0].text.toLowerCase();
        return title;
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
    nuxtI18n: {
      paths: {
        fr: '/politique-cookie',
        en: '/cookie-policy'
      }
    },
  }
</script>
