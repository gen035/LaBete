<template>
  <div class="button" @click="addToCart" data-track="" data-track-category="cart" data-track-action="click" :data-track-label="product.id">
    <a>
      <p class="button-text">
        Add to cart
      </p>
      <div class="button-icon-container">
        <p class="button-icon fas fa-shopping-cart"></p>
      </div>
    </a>
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
