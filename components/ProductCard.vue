<template>
  <client-only>
    <div class="product-card col-xl-2 col-lg-3 col-md-4 col-6">
      <div class="product-card-wrapper" @click="goTo">
        <div v-if="product.sale && this.in_stock" class="product-card-sale">{{$t('product.sale')}}</div>
        <div class="product-card-image">
          <img
            v-if="product.images && product.images.length > 0 && product.images[0].file.url"
            :src="product.images[0].file.url"
            :alt="product.name"
            :title="product.name"
          />
          <img
            v-else
            src="~/assets/images/product_placeholder.jpg"
          />
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
  import AddToCart from '~/components/AddToCart';
  import Media from '~/components/Media';

  export default {
    props: {
      product: {
        type: Object,
        require: true,
        default: () => ({})
      }
    },
    data() {
      return {
        in_stock: this.product.stock_level > 0
      }
    },
    methods: {
      goTo() {
        const locale = this.$store.state.i18n.locale;
        const pathPrefix = locale === 'en' ? `/${locale}/products/product/` : '/produits/produit/';
        this.$router.push(`${pathPrefix}${this.product.slug}`);
      }
    },
    components: {
      AddToCart,
      Media
    }
  }
</script>
