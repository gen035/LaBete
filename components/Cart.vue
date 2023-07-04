<template>
  <b-sidebar
    @hidden="closed()"
    :visible="this.$store.state.cartIsOpened"
    id="sidebar-cart"
    class="cart"
    aria-label="Cart"
    no-header
    shadow
    right
    backdrop
    footer-tag="div"
    footer-class="cart-footer container"
  >
      <template #footer="{ hide }">
        <div class="row">
          <div class="col-6">{{$t('cart.subtotal')}}$</div>
          <div class="col-6 text-right">{{getCart && getCart.grand_total}}$</div>
        </div>
        <div class="row">
          <div class="col-6">Shipping</div>
          <div class="col-6 text-right cart-shipping">{{$t('cart.shipping_amount')}}</div>
        </div>
        <div class="row">
          <div class="col-12">
          <div class="button" data-track="" data-track-category="cart" data-track-action="click" data-track-label="checkout">
              <a :href="getCart && getCart.checkout_url">
                <p class="button-text">
                  {{$t('cart.checkout')}}
                </p>
                <div class="button-icon-container">
                  <p class="button-icon fa fa-credit-card"></p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </template>
      <div class="px-3 py-2 container">
        <h2 class="cart-title title-h2">{{$t('cart.title')}}</h2>
        <div v-if="getCartProducts && getCartProducts.length > 0" class="cart-items">
          <div v-for="(item, index) in getCartProducts">
            <b-card
              v-if="item.product"
              :key="index"
              no-body
              class="overflow-hidden cart-item"
            >
              <div
                v-if="item.product.stock_level <= 0"
                class="cart-unavailable"
                @click="removeItem(item)"
              >
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                <h3>{{$t('cart.unavailable')}}</h3>
                <p>{{$t('cart.delete')}}</p>
              </div>
              <b-row no-gutters>
                <b-col
                  class="cart-image"
                  md="4"
                  v-bind:style="{ backgroundImage: `url(${item.product.images[0].file.url})` }"
                />
                <b-col md="8">
                  <b-card-body class="d-flex flex-column justify-content-between" :title="item.product.name">
                    <b-card-text class="row">
                      <div class="col-6 cart-item-qty">{{$t('cart.qty')}} {{item.quantity}}</div>
                      <div class="col-6 cart-item-delete" @click="removeItem(item)">{{$t('cart.delete')}}</div>
                    </b-card-text>
                  </b-card-body>
                </b-col>
              </b-row>
            </b-card>
          </div>
        </div>
        <div v-else class="cart-empty text-center mt-5">{{$t('cart.empty')}}</div>
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