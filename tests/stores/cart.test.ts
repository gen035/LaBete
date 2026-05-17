import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/stores/cart'

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initial state has no cart', () => {
    const store = useCartStore()
    expect(store.cart).toBeNull()
  })

  it('setCart updates cart state', () => {
    const store = useCartStore()
    const fakeCart = { items: [], item_quantity: 0 }
    store.setCart(fakeCart)
    expect(store.cart).toEqual(fakeCart)
  })

  it('setCartOpened controls drawer visibility', () => {
    const store = useCartStore()
    store.setCartOpened(true)
    expect(store.isOpened).toBe(true)
  })

  it('getCartProductsCount returns 0 when cart is null', () => {
    const store = useCartStore()
    expect(store.getCartProductsCount).toBe(0)
  })

  it('getCartProductsCount reads item_quantity from cart', () => {
    const store = useCartStore()
    store.setCart({ items: [], item_quantity: 3 })
    expect(store.getCartProductsCount).toBe(3)
  })
})
