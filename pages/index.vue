<template>
  <div class="home">
    <section class="home-slider container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-12">
            <Slider :data="slider" />
          </div>
          <div class="col-md-4 d-none d-md-block position-relative">
            <div class="home-text-box">
              <h1 class="home-title">{{ content.hero_title[0].text }}</h1>
              <p class="home-subtitle">{{ content.hero_subtitle[0].text }}</p>
              <a class="button-simple" :href="hero_button.url.url" v-if="hero_button">{{hero_button.text}}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container d-md-none">
      <div class="row">
        <div class="col-12 text-center pb-4">
          <h1 class="home-title--mobile">{{ content.hero_title[0].text }}</h1>
          <p class="home-subtitle--mobile">{{ content.hero_subtitle[0].text }}</p>
          <a class="d-inline-block button-simple" :href="hero_button.url.url" v-if="hero_button">{{hero_button.text}}</a>
        </div>
      </div>
    </section>
    <template v-for="(block, index) in top_blocks">
      <Block
        :block="block"
        :index="index"
        size="small"
        :key="index"
        :imageType="index === 0 ? 'img' : 'background'"
      />
    </template>
    <section
      v-if="cards && cards.length > 0"
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
    <template v-for="(block, index) in blocks">
      <Block
        :block="block"
        :index="index"
        :key="index"
        :imageType="index === 0 ? 'img' : 'background'"
      />
    </template>
    <!--<section class="container home-images p-5">
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
    </section>-->
    <client-only>
      <section v-if="this.productsResults && this.productsResults.length > 0" class="container py-4">
        <div class="row">
          <h1>{{$t('home.products.title')}}</h1>
        </div>
        <div class="row d-flex justify-content-center">
          <ProductCard v-for="(product, index) in this.productsResults" :product="product" :key="`${product.id}`"/>
        </div>
      </section>
    </client-only>
  </div>
</template>

<script>
  import Media from '~/components/Media';
  import Card from '~/components/Card';
  import Slider from '~/components/Slider';
  import Block from '~/components/Block';
  import ProductCard from '~/components/ProductCard';
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

      let hero_button = await app.$prismic.api.getByID(content.hero_button.id);
      hero_button = hero_button.data;

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

      let top_blocks = [];
      for (const block of content.top_blocks) {
        const item = await app.$prismic.api.getByID(block.top_block.id);

        let itemButton;
        if (item && item.data && item.data.button && item.data.button.id) {
          itemButton = await app.$prismic.api.getByID(item.data.button.id);
        }

        if (itemButton) {
          item.data.button = itemButton;
        }

        top_blocks.push(item.data);
      }

      if (content) {
        return {
          content,
          hero_button,
          seo,
          blocks,
          cards,
          slider,
          top_blocks
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
    data() {
      return {
        productsResults: null
      }
    },
    async mounted() {
      this.products = await this.$swell.products.list({
       limit: 4,
        sort: "date_created desc",
        categories: "featured"
      });

      this.productsResults = this.products && this.products.results && this.products.results.length > 0 ? this.products.results : [];
    },
    components: {
      Block,
      Card,
      Media,
      Slider,
      ProductCard
    },
    nuxtI18n: {
      paths: {
        fr: '/',
        en: '/'
      }
    },
  }
</script>
