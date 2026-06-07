import { defineStore } from 'pinia'

declare function useNuxtApp(): any

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart:         null  as any,
    error:        null  as any,
    isUpdating:   false,
    isUpdatingId: null  as string | null,
    isOpened:     false,
    notification: {}    as any,
  }),

  actions: {
    setCart(cart: any)              { this.cart = cart },
    setCartError(error: any)        { this.error = error },
    setCartOpened(v: boolean)       { this.isOpened = v },
    setCartUpdating(v: boolean)     { this.isUpdating = v },
    setCartUpdatingId(id: any)      { this.isUpdatingId = id },
    setNotification(n: any)         { this.notification = n },

    async checkCartItemHasStock({ item, id }: { item?: any; id?: string }) {
      const { $swell } = useNuxtApp()
      const items = this.cart?.items
      let cartItem: any
      let product: any
      const quantityToAdd = item ? item.quantity : 1

      if (item)     product = await $swell.products.get(item.productId)
      else if (id)  product = await $swell.products.get(id)

      if (!product) throw new Error('Product in cart could not be found.')

      if (items) {
        let variant: any
        if (item) variant = $swell.products.variation(product, item.options)
        cartItem = items.find((ci: any) => {
          if (id)   return ci.id === id
          if (item) return item.variant ? ci.variantId === variant?.variantId : ci.productId === variant?.id
          return null
        })
      }

      const stockPurchasable = cartItem ? cartItem.product.stockPurchasable : product.stockPurchasable
      const stockTracking    = cartItem ? cartItem.product.stockTracking    : product.stockTracking
      const stockLevel       = cartItem?.variant?.stockLevel ?? (cartItem ? cartItem.product.stockLevel : product.stockLevel)
      const currentQuantity  = cartItem?.quantity ?? 0

      if (stockPurchasable || !stockTracking) return true
      return currentQuantity + quantityToAdd <= stockLevel
    },

    async addCartItem(item: any) {
      const { $swell } = useNuxtApp()
      if (this.isUpdating) return

      if (this.cart?.items?.some((ci: any) => ci.product_id === item.product_id)) {
        this.setNotification({ show: true, type: 'danger', dismissible: true, text: 'cart.already' })
        return
      }

      this.setCartUpdating(true)
      this.setCartUpdatingId(item?.product_id)

      try {
        const validateStock = $swell.settings.get('cart.validateStock')
        if (validateStock) {
          const hasStock = await this.checkCartItemHasStock({ item })
          if (!hasStock) {
            this.setCartUpdating(false)
            this.setCartUpdatingId(null)
            throw new Error('invalid_stock')
          }
        }

        const cart = await $swell.cart.addItem(item)
        if (cart.errors) {
          this.setCartError(cart.errors)
        } else {
          this.setCart(cart)
          this.setCartOpened(true)
        }
      } catch (err: any) {
        if (err.message === 'invalid_stock') throw err
        console.error('addCartItem error', err)
      }

      this.setCartUpdating(false)
    },

    async removeCartItem(item: any) {
      const { $swell } = useNuxtApp()
      if (this.isUpdating) return
      this.setCartUpdating(true)
      try {
        const cart = await $swell.cart.removeItem(item.id)
        this.setCart(cart)
      } catch (err) {
        console.error(err)
      }
      this.setCartUpdating(false)
    },

    async initializeCart({ checkoutId }: { checkoutId?: string } = {}) {
      const { $swell } = useNuxtApp()
      try {
        const cart = checkoutId
          ? await $swell.cart.recover(checkoutId)
          : await $swell.cart.get()
        this.setCart(cart)
      } catch (err) {
        console.error('initializeCart error', err)
      }
    },
  },

  getters: {
    getCart:              (state) => state.cart,
    getCartOpened:        (state) => state.isOpened,
    getCartProducts:      (state) => state.cart?.items ?? [],
    getCartProductsCount: (state) => state.cart?.item_quantity ?? 0,
    getCartUpdating:      (state) => state.isUpdating,
    getCartUpdatingId:    (state) => state.isUpdatingId,
    getNotification:      (state) => state.notification,
  },
})
