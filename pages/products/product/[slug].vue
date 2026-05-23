<template>
  <section class="content product">
      <section class="container-fluid">
        <div class="row">
          <div class="col-md-6 col-lg-5 col-xl-4 col-xxl-3 offset-lg-1 offset-xl-2 offset-xxl-3 product-slider">
            <Carousel v-if="product && product.images && product.images.length > 0" :wrap-around="true" :autoplay="2000" :pause-autoplay-on-hover="true" :items-to-show="1">
              <Slide v-for="(image, index) in product.images" :key="index">
                <v-lazy-image :src="image.file.url" :alt="`${product.name} - ${index}`" src-placeholder="/product_placeholder.jpg"/>
              </Slide>
              <template #addons>
                <Pagination />
              </template>
            </Carousel>
            <img v-if="$i18n.locale === 'fr'" src="~/assets/images/quebec_fr.png" class="product-card-quebec" />
            <img v-if="$i18n.locale === 'en'" src="~/assets/images/quebec_en.png" class="product-card-quebec" />
          </div>
          <div class="col-md-6 col-lg-5 col-xl-4 col-xxl-3 product-detail">
            <div v-if="product && product.stock_level <= 0" class="mb-2 product-price product-price--sold">
              <span>{{$t('product.sold')}}</span>
            </div>
            <h1 class="product-title">{{product?.name}}</h1>
            <div class="product-desc" v-html="product?.description" />
            <div v-if="product && !product.sale && product.stock_level > 0" class="product-price">{{product.price}}$</div>
            <div v-if="product && product.sale && product.stock_level > 0" class="product-price product-price--sale">
              <span>{{product.price}}$</span>
              <s>{{product.orig_price}}$</s>
            </div>
            <AddToCart v-if="product && product.stock_level > 0" :product="product" />
          </div>
        </div>
        <div class="row" v-if="getProductRecommended && getProductRecommended.length > 0">
          <div class="col-md-12"><h1>{{ $t('product.recommended') }}</h1></div>
          <div class="row d-flex justify-content-center">
            <ProductCard v-for="(upsell, index) in getProductRecommended" :product="upsell" :key="index"/>
          </div>
        </div>
      </section>
  </section>
</template>

<script setup>
import VLazyImage from 'v-lazy-image'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

definePageMeta({
  i18n: {
    paths: {
      fr: '/produits/produit/:slug',
      en: '/products/product/:slug'
    }
  }
})

const route = useRoute()
const { $swell } = useNuxtApp()
const productStore = useProductStore()

const { data: product } = useAsyncData(`product-${route.params.slug}`, async () => {
  const p = await $swell.products.get(route.params.slug, {
    expand: ['cross_sells', 'up_sells']
  })

  if (p) {
    const upSells = p.up_sells && p.up_sells.length > 0 ? p.up_sells : null
    await productStore.fetchProductsBySlugs(upSells)
  }

  return p || null
})

useHead(computed(() => ({
  title: product.value ? `La Bête | ${product.value.meta_title || product.value.name}` : 'La Bête',
  meta: [
    { hid: 'description', name: 'description', content: product.value ? `${product.value.meta_description || product.value.description}` : '' }
  ]
})))

const getProductRecommended = computed(() => productStore.getProductRecommended)
</script>
