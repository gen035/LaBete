<template>
  <section class="content glossary">
      <section class="container">
        <div class="row">
            <div
              v-html="$prismic.asHtml(content.title)"
              class="col-md-12"
            />
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-10" v-html="$prismic.asHtml(content.content)" />
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-10">
            <div class="row flex-row d-flex align-items-stretch">
              <GlossaryCard v-for="card in glossaryCards" :key="index" :data="card"/>
            </div>
          </div>
        </div>
      </section>
  </section>
</template>

<script>
  import GlossaryCard from '~/components/GlossaryCard';
  export default {
    async asyncData({ app, error, store }) {
      const locale = store.state.i18n.locale;
      let content = []

      await app.$prismic.api.getByUID('page', 'glossary', {
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

      let glossaryCards = [];
      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'glossarycard'), {
           lang: `${locale}-ca`,
        }
      ).then((response) => {
        response.results.forEach(result => {
          glossaryCards.push(result.data);
        });
      })
  
      let seo = await app.$prismic.api.getByID(content.seo.id);
      seo = seo.data;

      if (content) {
        return {
          content,
          glossaryCards,
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
    components : {
      GlossaryCard
    },
    nuxtI18n: {
      paths: {
         fr: '/glossaire',
        en: '/glossary'
      }
    },
  }
</script>
