<template>
  <CustomButton
      :aria-label="$t('cart.addToCart')"
      @click="addToCart"
      :text="cartStore.getCartUpdating && cartStore.getCartUpdatingId === product.id ? $t('cart.addToCartPending') : $t('cart.addToCart')"
      :disabled="product.stock_status !== 'in_stock'"
      icon="fa-shopping-cart"
  />
</template>
<script>
import { useCartStore } from '~/stores/cart'
export default {
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  methods: {
    async addToCart() {
      await this.cartStore.addCartItem({ product_id: this.product.id, quantity: 1 })
    }
  }
}
</script>
