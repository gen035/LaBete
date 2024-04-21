<template>
  <button :class="['button', {'button--disabled' : (this.product.stock_status === 'out_of_stock')}]" @click="addToCart" data-track="" data-track-category="cart" data-track-action="click" :data-track-label="product.id">
    <p class="button-text">
        {{this.$store.state.cartIsUpdating && this.$store.state.cartIsUpdatingId === this.product.id ? $t('cart.addToCartPending') : $t('cart.addToCart') }}
      </p>
      <div class="button-icon-container">
        <p class="button-icon fas fa-shopping-cart"></p>
      </div>
  </button>
</template>
<script>
  import { mapGetters } from 'vuex';
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
    }
  }
</script>
