<template>
  <div class="product-card col-sm-3">
    <div class="product-card-wrapper" @click="goTo">
      <div v-if="product.sale" class="product-card-sale">{{$t('product.sale')}}</div>
      <div class="product-card-image">
        <img :src="product.images[0].file.url" />
      </div>
      <div class="product-card-name">{{ product.name }}</div>
      <div v-if="!product.sale" class="product-card-price">{{product.price}}$</div>
      <div v-if="product.sale" class="product-card-price product-card-price--sale">
        <span>{{product.price}}$</span>
        <s>{{product.orig_price}}$</s>
      </div>
    </div>
    <AddToCart :product="product" />
  </div>
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
    created() {
      console.log(this.product)
    },
    methods: {
      goTo() {
        const locale = this.$store.state.i18n.locale;
        this.$router.push(`${locale === 'en' ? '/' + locale + '/products/': '/produits/'}${this.product.slug}`)
      }
    },
    components: {
      AddToCart,
      Media
    }
  }
</script>
