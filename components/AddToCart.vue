<template>
  <div>
    <button class="button" @click="addToCart" data-track="" data-track-category="cart" data-track-action="click" :data-track-label="product.id">
      <p class="button-text">
          {{this.$store.state.cartIsUpdating && this.$store.state.cartIsUpdatingId === product.id ? $t('cart.addToCartPending') : $t('cart.addToCart') }}
        </p>
        <div class="button-icon-container">
          <p class="button-icon fas fa-shopping-cart"></p>
        </div>
    </button>
  </div>
</template>
<script>
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
        cartIsUpdating: this.$store.state.cartIsUpdating
      }
    },
    created() {
      console.log(this.product)
    },
    methods: {
      async addToCart() {
        await this.$store.dispatch('addCartItem', {
            product_id: this.product.id,
            quantity: 1
          });
        console.log('addToCart', this.product)
      }
    }
  }
</script>
