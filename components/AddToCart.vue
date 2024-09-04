<template>
  <client-only>
    <CustomButton
        v-on:click.native="addToCart"
        :text="getCartUpdating && getCartUpdatingId === this.product.id ? $t('cart.addToCartPending') : $t('cart.addToCart')"
        icon="fa-shopping-cart"
    />
  </client-only>
</template>
<script>
import CustomButton from "@/components/CustomButton.vue";
import {mapGetters} from "vuex";
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
      await this.$store.dispatch('cart/addCartItem', {
        product_id: this.product.id,
        quantity: 1
      });
    }
  },
  computed: {
    ...mapGetters('cart', [
      'getCart',
      'getCartProducts',
      'getCartUpdating',
      'getCartUpdatingId'
    ])
  },
  components: {
    CustomButton,
  },
}
</script>
