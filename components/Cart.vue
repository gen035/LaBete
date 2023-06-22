<template>
  <b-sidebar @hidden="closed()" :visible="this.$store.state.cartIsOpened" id="sidebar-cart" aria-label="Cart" no-header shadow right backdrop footer-tag="div">
      <template #footer="{ hide }">
       {{getCart && getCart.grand_total}}
      </template>
      <div class="px-3 py-2">
        <div class="cart-title">{{$t('cart.title')}}</div>
        <div v-if="getCartProducts && getCartProducts.length > 0" class="cart-items">
           <div v-for="(item, index) in getCartProducts" class="cart-item row">
            <div class="col-4">
              <img :src="item.product.images[0].file.url" />
            </div>
            <div class="col-8">
              <div class="row">
                <div class="col-12">
                  {{item.product.name}}
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  Qty: {{item.quantity}}
                </div>
                <div class="col-6 cart-delete">
                  <span @click="removeItem(item)">{{$t('cart.delete')}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="cart-empty">EMPTY</div>
      </div>
    </b-sidebar>
</template>
<script>
  import { mapGetters } from 'vuex';
  export default {
    methods: {
      removeItem(product) {
        this.$store.dispatch('removeCartItem', product);
      },
      closed() {
        this.$store.commit('SET_CART_ISOPENED', false);
      }
    },
    mounted() {
      // Pass a checkout ID as a query string param to recover a specific cart
      const { checkout: checkoutId } = this.$route.query;
      this.$store.dispatch('initializeCart', { checkoutId });
    },
    computed: {
      ...mapGetters([
          "getCart",
          "getCartProducts"
      ])
    }
  }
</script>