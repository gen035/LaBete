<template>
  <section class="content creations">
      <section class="container">
        <div class="row">
            <div
              v-html="$prismic.asHtml(content.title)"
              class="col-md-12"
            />
        </div>
        <div class="row">
          <div class="col-2 creations-img" v-for="(image, imageIndex) in images" :key="imageIndex" @click="index = imageIndex">
              <Media :image="image" />
          </div>
        </div>
        <LightGallery
          :images="images"
          :index="index"
          :disable-scroll="false"
          @close="index = null"
        />
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
        app.$prismic.predicates.at('document.type', 'creations'), {
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
    data() {
      return {
        images: [],
        index: null
      }
    },
    created() {
      if(this.content) {
        const images = this.content.images;
        const imageArr = [];

        images.map((item, index) => {
          imageArr.push({
            title: item.image.alt || null,
            url: item.image.url
          })
        });

        this.images =  imageArr;
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
        fr: '/nos-creations',
        en: '/our-creations'
      }
    },
  }
</script>
