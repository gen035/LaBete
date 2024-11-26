<template>
  <section class="content brand">
      <section class="container">
        <div v-if="content?.title?.length > 0" class="row">
          <div
            v-html="$prismic.asHtml(content.title)"
            class="col-md-12"
          />
        </div>
        <div class="row pt-5">
          <template v-for="(block, index) in blocks">
            <Block
              :block="block"
              imageType="img"
              :index="index"
            />
          </template>
        </div>
      </section>
  </section>
</template>

<script>
  import Block from '~/components/Block';
  export default {
    async asyncData({ app, error, store }) {
      const locale = store.state.i18n.locale;
      let content = [];

      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'brandpage'), {
           lang: `${locale}-ca`
        }
      ).then((response) => {
        response.results.forEach(result => {
          content = result.data;
        });
      })

      let seo = await app.$prismic.api.getByID(content.seo.id)
      seo = seo.data;

      let blocks = [];
      for (const block of content.blocks) {
        const item = await app.$prismic.api.getByID(block.block.id);
        blocks.push(item.data);
      }

      if (content) {
        return {
          content,
          blocks,
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
    components: {
      Block
    },
    nuxtI18n: {
      paths: {
        fr: '/marque',
        en: '/brand'
      }
    },
  }
</script>
