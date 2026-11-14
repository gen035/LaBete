<template>
  <section class="content product">
      <section class="container-fluid">
        <div class="row">
          <div class="col-md-6 col-lg-5 col-xl-4 col-xxl-3 offset-lg-1 offset-xl-2 offset-xxl-3 product-slider">
            <Carousel v-if="product && product.images && product.images.length > 0" :wrap-around="true" :autoplay="product.images.length > 1 ? 2000 : 0" :pause-autoplay-on-hover="true" :items-to-show="1">
              <Slide v-for="(image, index) in product.images" :key="index">
                <v-lazy-image :src="withSwellImageWidth(image.file.url, 750)" :alt="`${product.name} - ${index}`" src-placeholder="/product_placeholder.jpg"/>
              </Slide>
              <template v-if="product.images.length > 1" #addons>
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
            <AddToCart v-if="product && product.stock_level > 0 && product.preview_only !== true" :product="product" />
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
import { withSwellImageWidth } from '~/utils/swellImage'
import VLazyImage from 'v-lazy-image'
import 'vue3-carousel/dist/carousel.css'

defineI18nRoute({
  paths: {
    fr: '/produits/produit/[slug]',
    en: '/products/product/[slug]'
  }
})

const route = useRoute()
const productApi = useProductApi()
const productStore = useProductStore()

const { data: product } = useAsyncData(`product-${route.params.slug}`, async () => {
  try {
    const p = await productApi.get(route.params.slug, {
      expand: ['cross_sells', 'up_sells']
    })

    if (p) {
      const upSells = Array.isArray(p.up_sells)
        ? p.up_sells.filter(item =>
          typeof item === 'object' && item !== null && !Array.isArray(item),
        )
        : []
      await productStore.fetchProductsBySlugs(upSells)
    }

    return p || null
  } catch (err) {
    console.error('[product] Failed to fetch product:', err?.message || String(err))
    return null
  }
})

useHead(computed(() => ({
  title: product.value ? `La Bête | ${product.value.meta_title || product.value.name}` : 'La Bête',
  meta: [
    { hid: 'description', name: 'description', content: product.value ? `${product.value.meta_description || product.value.description}` : '' }
  ]
})))

const getProductRecommended = computed(() => productStore.getProductRecommended)
</script>
