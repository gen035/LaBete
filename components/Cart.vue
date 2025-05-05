<template>
  <client-only>
    <b-sidebar
      @hidden="closed()"
      :visible="getCartOpened"
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
          <div v-if="getCart?.discount_total" class="row">
            <div class="col-6">{{$t('cart.promo')}}</div>
            <div class="col-6 text-right">-{{getCart?.discount_total || 0}}$</div>
          </div>
          <div class="row">
            <div class="col-6">{{$t('cart.subtotal')}}</div>
            <div class="col-6 text-right">{{getCart?.grand_total || 0}}$</div>
          </div>
          <div class="row">
            <div class="col-6">{{$t('cart.shipping')}}</div>
            <div class="col-6 text-right cart-shipping">{{$t('cart.shipping_amount')}}</div>
          </div>
          <div class="row">
            <div class="col-12 text-center">
              <CustomButton
                :aria="$t('cart.checkout')"
                :url="getCart?.checkout_url"
                :disabled="isCheckoutDisabled"
                target="_self"
                :text="$t('cart.checkout')"
                icon="fa-credit-card"
              />
            </div>
          </div>
        </template>
        <div class="px-3 py-2 container">
          <h2 class="cart-title title-h2">{{$t('cart.title')}}</h2>
          <div v-if="getCartProducts?.length > 0" class="cart-items">
            <div v-for="(item, index) in getCartProducts">
              <b-card
                role="button"
                :aria-label="item?.product?.name"
                v-if="item?.product"
                :key="index"
                no-body
                class="overflow-hidden cart-item"
                @click="goTo(item)"
              >
                <div
                  role="button"
                  :aria-label="$('cart.delete')"
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
                    cols="4"
                    v-bind:style="{ backgroundImage: `url(${item.product.images[0].file.url})` }"
                  />
                  <b-col cols="8">
                    <b-card-body class="d-flex flex-column justify-content-between" :title="item.product.name && item.product.name.substring(0, 20) + '...'">
                      <b-card-text class="row">
                        <div class="col-12 cart-item-price">{{item.price}}$</div>
                      </b-card-text>
                      <b-card-text class="row">
                        <div class="col-6 cart-item-qty">{{$t('cart.qty')}} {{item.quantity}}</div>
                        <div role="button" :aria-label="$t('cart.delete')" class="col-6 cart-item-delete" @click.stop="removeItem(item)">{{$t('cart.delete')}}</div>
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
    </client-only>
</template>
<script>
  import { mapGetters } from 'vuex';
  import CustomButton from "@/components/CustomButton.vue";
  export default {
    methods: {
      removeItem(product) {
        this.$store.dispatch('cart/removeCartItem', product);
      },
      closed() {
        this.$store.commit('cart/SET_CART_ISOPENED', false);
      },
      goTo(item) {
        const slug = item.product?.slug;
        const inStock = item.product?.stock_level > 0;

        if (!inStock) { return }

        const locale = this.$store.state.i18n.locale;
        const pathPrefix = locale === 'en' ? `/${locale}/products/product/` : '/produits/produit/';
        this.$router.push(`${pathPrefix}${slug}`);
      }
    },
    mounted() {
      // Pass a checkout ID as a query string param to recover a specific cart
      const { checkout: checkoutId } = this.$route.query;
      this.$store.dispatch('cart/initializeCart', { checkoutId });
    },
    computed: {
      ...mapGetters('cart', [
          'getCart',
          'getCartOpened',
          'getCartProducts'
      ]),
      isCheckoutDisabled() {
        // Check if any item in the cart has a stock level of 0
        return this.getCartProducts.some(item => item.product && item.product.stock_level <= 0);
      }
    },
    components: {
      CustomButton,
    },
  }
</script>
