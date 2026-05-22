<template>
  <client-only>
    <template v-if="cartStore.getCartOpened">
      <div
        class="offcanvas offcanvas-end show cart"
        tabindex="-1"
        id="sidebar-cart"
        aria-label="Cart"
        style="visibility: visible"
      >
        <div class="offcanvas-body px-3 py-2 container">
          <h2 class="cart-title title-h2">{{ $t('cart.title') }}</h2>
          <div v-if="cartStore.getCartProducts?.length > 0" class="cart-items">
            <div v-for="(item, index) in cartStore.getCartProducts" :key="index">
              <div
                v-if="item?.product"
                role="button"
                :aria-label="item?.product?.name"
                class="card overflow-hidden cart-item"
                @click="goTo(item)"
              >
                <div
                  role="button"
                  :aria-label="$t('cart.delete')"
                  v-if="item.product.stock_level <= 0"
                  class="cart-unavailable"
                  @click="removeItem(item)"
                >
                  <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                  <h3>{{ $t('cart.unavailable') }}</h3>
                  <p>{{ $t('cart.delete') }}</p>
                </div>
                <div class="row g-0">
                  <div
                    class="col-4 cart-image"
                    :style="{ backgroundImage: `url(${item.product.images[0].file.url})` }"
                  />
                  <div class="col-8">
                    <div class="card-body d-flex flex-column justify-content-between">
                      <h5 class="card-title">{{ item.product.name && item.product.name.substring(0, 20) + '...' }}</h5>
                      <div v-if="!item.discount_each" class="card-text row">
                        <div class="col-12 cart-item-price">{{ item.price }}$</div>
                      </div>
                      <div v-if="item.discount_each" class="card-text row">
                        <div class="col-6 cart-item-price">
                          {{ item.price - item.discount_each }}$
                          <s class="col-8">{{ item.price }}$</s>
                        </div>
                      </div>
                      <div class="card-text row">
                        <div class="col-6 cart-item-qty">{{ $t('cart.qty') }} {{ item.quantity }}</div>
                        <div
                          role="button"
                          :aria-label="$t('cart.delete')"
                          class="col-6 cart-item-delete"
                          @click.stop="removeItem(item)"
                        >{{ $t('cart.delete') }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="cart-empty text-center mt-5">{{ $t('cart.empty') }}</div>
        </div>
        <div class="cart-footer container">
          <div v-if="cartStore.getCart?.discount_total" class="row">
            <div class="col-6">{{ $t('cart.promo') }}</div>
            <div class="col-6 text-right">-{{ cartStore.getCart?.discount_total || 0 }}$</div>
          </div>
          <div class="row">
            <div class="col-6">{{ $t('cart.subtotal') }}</div>
            <div class="col-6 text-right">{{ cartStore.getCart?.grand_total || 0 }}$</div>
          </div>
          <div class="row">
            <div class="col-6">{{ $t('cart.shipping') }}</div>
            <div class="col-6 text-right cart-shipping">{{ $t('cart.shipping_amount') }}</div>
          </div>
          <div class="row">
            <div class="col-12 text-center">
              <CustomButton
                :aria="$t('cart.checkout')"
                :url="cartStore.getCart?.checkout_url"
                :disabled="isCheckoutDisabled"
                target="_self"
                :text="$t('cart.checkout')"
                icon="fa-credit-card"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-backdrop fade show" @click="cartStore.setCartOpened(false)"></div>
    </template>
  </client-only>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const { locale } = useI18n()
const route = useRoute()
const router = useRouter()

function removeItem(product: any) {
  cartStore.removeCartItem(product)
}

function goTo(item: any) {
  const slug = item.product?.slug
  const inStock = item.product?.stock_level > 0
  if (!inStock) { return }
  const pathPrefix = locale.value === 'en' ? `/${locale.value}/products/product/` : '/produits/produit/'
  router.push(`${pathPrefix}${slug}`)
}

const isCheckoutDisabled = computed(() => {
  return cartStore.getCartProducts.some((item: any) => item.product && item.product.stock_level <= 0)
})

onMounted(() => {
  const { checkout: checkoutId } = route.query
  cartStore.initializeCart({ checkoutId: checkoutId as string | undefined })
})
</script>
