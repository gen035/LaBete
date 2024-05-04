<template>
  <section class="content product">
      <section class="container-fluid">
        <div class="row">
          <div class="col-md-6 col-lg-5 col-xl-4 col-xxl-3 offset-lg-1 offset-xl-2 offset-xxl-3 product-slider">
            <VueSlickCarousel v-if="product.images && product.images.length > 0" v-bind="settings">
              <template v-for="(image, index) in product.images">
                <img :key="index" :src="image.file.url" />
              </template>
            </VueSlickCarousel>
          </div>
          <div class="col-md-6 col-lg-5 col-xl-4 col-xxl-3 product-detail">
            <div v-if="product.stock_level <= 0" class="mb-2 product-price product-price--sold">
              <span>{{$t('product.sold')}}</span>
            </div>
            <h2 class="product-title">{{product.name}}</h2>
            <div class="product-desc"v-html="product.description" />
            <div v-if="!product.sale && product.stock_level > 0" class="product-price">{{product.price}}$</div>
            <div v-if="product.sale && product.stock_level > 0" class="product-price product-price--sale">
              <span>{{product.price}}$</span>
              <s>{{product.orig_price}}$</s>
            </div>
            <AddToCart v-if="product.stock_level > 0" :product="product" />
          </div>
        </div>
      </section>
  </section>
</template>

<script>
  import AddToCart from '~/components/AddToCart';
  import RecommendedProducts from '~/components/RecommendedProducts';
  import VueSlickCarousel from 'vue-slick-carousel';

  export default {
    async asyncData({ app, error, store, params}) {
      const locale = store.state.i18n.locale;
      let recommendedProducts = [];
      let product = await app.$swell.products.get(params && params.slug, {
        expand: ['cross_sells']
      });

      if (product) {
        return {
          product
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
    data(){
      return {
        settings: {
          adaptiveHeight: true,
          arrows: false,
          autoplay: true,
          autoplaySpeed: 2000,
          dots: true,
          fade: true,
          infinite: true,
          pauseOnHover: true,
          slidesToShow: 1,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                dots: true
              }
            }
          ]
        }
      }
    },
    components: {
      AddToCart,
      RecommendedProducts,
      VueSlickCarousel
    },
    nuxtI18n: {
      paths: {
        fr: '/produits/produit/:slug',
        en: '/products/product/:slug'
      }
    },
  }
</script>
