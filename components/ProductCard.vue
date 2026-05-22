<template>
  <client-only>
    <div class="product-card col-xl-2 col-lg-3 col-md-4 col-6" :id="product.id">
      <div role="button" :aria-label="product?.name" class="product-card-wrapper" @click="goTo">
        <div v-if="product.sale && this.in_stock" class="product-card-sale">{{$t('product.sale')}}</div>
        <div class="product-card-image">
          <v-lazy-image :src="product.images[0].file.url" src-placeholder="/product_placeholder.jpg"/>
          <img v-if="$i18n.locale === 'fr'" src="~/assets/images/quebec_fr.png" class="product-card-quebec" />
          <img v-if="$i18n.locale === 'en'" src="~/assets/images/quebec_en.png" class="product-card-quebec" />
        </div>
        <div class="product-card-name">{{ product.name }}</div>
        <div v-if="!product.sale && this.in_stock" class="product-card-price">{{product.price}}$</div>
        <div v-if="product.sale && this.in_stock" class="product-card-price product-card-price--sale">
          <span>{{product.price}}$</span>
          <s>{{product.orig_price}}$</s>
        </div>
        <div v-if="product.stock_status !== 'in_stock'" class="product-card-price product-card-price--sold">
          <span>{{$t('product.sold')}}</span>
        </div>
      </div>
      <AddToCart :product="product" />
    </div>
  </client-only>
</template>
<script>
  import VLazyImage from 'v-lazy-image';

  export default {
    props: {
      product: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
    setup() {
      const { locale } = useI18n()
      const router = useRouter()
      return { locale, router }
    },
    data() {
      return {
        in_stock: this.product.stock_level > 0
      }
    },
    methods: {
      goTo() {
        const pathPrefix = this.locale.value === 'en' ? `/${this.locale.value}/products/product/` : '/produits/produit/';
        this.router.push(`${pathPrefix}${this.product.slug}`);
      }
    },
    components: { VLazyImage }
  }
</script>
