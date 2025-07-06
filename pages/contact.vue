<template>
  <section class="content">
      <section class="container">
        <div class="row">
            <div
              v-html="$prismic.asHtml(content.title)"
              class="col-md-12"
            />
        </div>
        <div class="row align-items-center justify-content-center">
          <div v-if="content && content.contact_items" class="col-md-4">
              <div v-for="(item, index) in content.contact_items" class="contact-item">
                <a :href="`${item.link && item.link.url}`" :title="formattedTitle(item)" data-track="" data-track-category="contact" data-track-action="click" :data-track-label="formattedTitle(item)" target="_blank">
                  <h2 v-if="item && item.label && item.label.length > 0">{{item.label[0].text}}<i v-if="item.fa_icon && item.fa_icon.length > 0" :class="item.fa_icon[0].text"></i></h2>
                  <p v-if="item && item.display_text && item.display_text.length > 0">{{item.display_text[0].text}}</p>
                  <p v-if="item && item.label && item.handle.length > 0 && item.handle[0].text">{{ item.handle[0].text }}</p>
                </a>
              </div>
          </div>
          <div class="col-md-4">
            <Media :image="content.image" :altProp="$t('contact.alt')" classes="contact-img-1"/>
            <Media :image="content.image_mobile" :altProp="$t('contact.alt')" classes="contact-img-2"/>
          </div>
        </div>
      </section>
  </section>
</template>

<script>
  import Media from '~/components/Media';
  export default {
    async asyncData({ app, error, store }) {
      const locale = store.state.i18n.locale;
      let content = []

      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'contact'), {
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
    components: {
      Media
    },
    nuxtI18n: {
      paths: {
        fr: '/contact',
        en: '/contact'
      }
    },
  }
</script>
