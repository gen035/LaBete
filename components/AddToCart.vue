<template>
  <CustomButton
      v-on:click.native="addToCart"
      :text="this.$store.state.cartIsUpdating && this.$store.state.cartIsUpdatingId === this.product.id ? $t('cart.addToCartPending') : $t('cart.addToCart')"
      :disabled="this.product.stock_status !== 'in_stock'"
      icon="fa-shopping-cart"
  />
</template>
<script>
  import CustomButton from "@/components/CustomButton.vue";
  export default {
    props: {
      product: {
        type: Object,
        require: true,
        default: () => ({})
      }
    },
    methods: {
      async addToCart() {
        await this.$store.dispatch('addCartItem', {
            product_id: this.product.id,
            quantity: 1
          });
      }
    },
    components: {
      CustomButton,
    },
  }
</script>
