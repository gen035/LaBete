<template>
  <section class="content product">
      <section class="container-fluid">
        <div class="row">
          <div class="col-md-3">
            <VueSlickCarousel v-bind="settings">
              <template v-for="(image, index) in product.images">
                <img :key="index" :src="image.file.url" />
              </template>
            </VueSlickCarousel>
          </div>
          <div class="col-md-4">
            <h2>{{product.name}}</h2>
            <div v-html="product.description" />
            <div v-if="!product.sale" class="product-price">{{product.price}}$</div>
            <div v-if="product.sale" class="product-price product-price--sale">
              <span>{{product.price}}$</span>
              <s>{{product.orig_price}}$</s>
            </div>
            <AddToCart :product="product" />
          </div>
        </div>
      </section>
  </section>
</template>

<script>
  import AddToCart from '~/components/AddToCart';
  import VueSlickCarousel from 'vue-slick-carousel';

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
    methods: {
    },
    components: {
      AddToCart,
      VueSlickCarousel
    },
    nuxtI18n: {
      paths: {
        fr: '/produits/:slug',
        en: '/products/:slug'
      }
    },
  }
</script>
