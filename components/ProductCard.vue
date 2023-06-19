<template>
  <div class="product-card col-sm-3">
    <img :src="product.images[0].file.url" />
    <div class="product-card-name">{{ product.name }}</div>
    <div v-if="!product.sale" class="product-card-price">{{product.price}}$</div>
    <div v-if="product.sale" class="product-card-price product-card-price--sale">
      <span>{{product.price}}$</span>
      <s>{{product.orig_price}}$</s>
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
        const openModal = this.card.open_modal;
        if(openModal) {
          this.$store.commit('SET_MESSAGE', true);
        }else{
          const locale = this.$store.state.i18n.locale;
          const url = this.card && this.card.link && this.card.link.url;
          const page = url.split("/").pop();
          this.$router.push(`${locale === 'en' ? '/' + locale : ''}/${page}`)
        }
      }
    },
    components: {
      AddToCart,
      Media
    }
  }
</script>
