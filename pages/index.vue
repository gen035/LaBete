<template>
  <div>
    <section class="home-slider container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-12">
            <Slider :data="slider" />
          </div>
          <div class="col-md-4 d-none d-md-block position-relative">
            <h1 class="home-title">{{ content.hero_title[0].text }}</h1>
          </div>
        </div>
      </div>
    </section>
    <section class="container d-md-none">
      <div class="row">
        <div class="col-12">
          <div class="home-title--mobile">
            {{ content.hero_title[0].text }}
          </div>
        </div>
      </div>
    </section>
    <section
      v-if="cards"
      class="py-5"
    >
      <div class="container">
        <div class="row align-items-center justify-content-center">
          <div
            v-for="(card, index) in cards"
            class="col-6 col-md-4 home-link"
            :key="index"
          >
            <Card
              :card="card"
            />
          </div>
        </div>
      </div>
    </section>
    <template
      v-for="(block, index) in blocks"
    >
      <HomePageBlock
        :block="block"
        :index="index"
      />
    </template>
    <section class="container home-images p-5">
      <div class="row align-items-center">
        <div class="col-md-6 home-image text-center p-4">
          <Media :image="content.image_1" />
        </div>
        <div class="col-md-6 home-image text-center p-4">
          <Media :image="content.image_2" />
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 home-image text-center p-4">
          <Media :image="content.image_3" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Media from '~/components/Media';
  import Card from '~/components/Card';
  import Slider from '~/components/Slider';
  import HomePageBlock from '~/components/HomePageBlock';

  export default {
    async asyncData({ app, error, store}) {
      const locale = store.state.i18n.locale;
      let content = []

      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'home'), {
            lang: `${locale}-ca`
          }
        ).then((response) => {
          response.results.forEach(result => {
            content = result.data;
          });
        })

      let seo = await app.$prismic.api.getByID(content.seo.id)
      seo = seo.data;

      let cards = [];
      for (const card of content.cards) {
        const item = await app.$prismic.api.getByID(card.card.id);
        cards.push(item.data);
      }

      let blocks = [];
      for (const block of content.blocks) {
        const item = await app.$prismic.api.getByID(block.block.id);
        blocks.push(item.data);
      }

      let slider = {};
      const sliderData = await app.$prismic.api.getByID(content.slider.id);
      slider = sliderData.data;

      if (content) {
        return {
          content,
          seo,
          blocks,
          cards,
          slider
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
      Card,
      HomePageBlock,
      Media,
      Slider
    },
    nuxtI18n: {
      paths: {
        fr: '/',
        en: '/'
      }
    },
  }
</script>
