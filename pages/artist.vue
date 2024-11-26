<template>
  <section class="content artist">
      <section class="container">
        <div class="row">
          <div
            v-html="$prismic.asHtml(content.title)"
            class="col-md-12"
          />
          <div
            v-html="$prismic.asHtml(content.subtitle)"
            class="col-md-12 text-center m-0"
          />
        </div>
        <div class="row">
            <div class="col-md-6 col-lg-4 offset-lg-1 text-center">
              <Media 
                v-if="content.image" 
                :image="content.image" 
                :class="{ 'd-none d-md-block': hasMobileImage }" 
              />
              <Media v-if="content.mobile_image" :image="content.mobile_image" class="d-md-none" />
            </div>
            <div
              v-html="$prismic.asHtml(content.content)"
              class="col-md-6 col-lg-6"
            />
        </div>
      </section>
  </section>
</template>

<script>
  import Media from '~/components/Media';
  export default {
    async asyncData({ app, error, store }) {
      const locale = store.state.i18n.locale;
      let content = [];

      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'about'), {
           lang: `${locale}-ca`
        }
      ).then((response) => {
        response.results.forEach(result => {
          content = result.data;
        });
      })

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
    computed: {
      hasMobileImage() {
        return this.content.mobile_image;
      }
    },
    components: {
      Media
    },
    nuxtI18n: {
      paths: {
        fr: '/artiste',
        en: '/artist'
      }
    },
  }
</script>
