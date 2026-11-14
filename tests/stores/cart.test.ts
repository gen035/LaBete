import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/stores/cart'

const swell = {
  settings: { get: vi.fn() },
  cart: { addItem: vi.fn() },
}

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.stubGlobal('useNuxtApp', () => ({ $swell: swell }))
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

  it('rejects a preview-only cart item before touching Swell', async () => {
    const store = useCartStore()

    await store.addCartItem({ product_id: 'draft-1', preview_only: true })

    expect(swell.settings.get).not.toHaveBeenCalled()
    expect(swell.cart.addItem).not.toHaveBeenCalled()
    expect(store.notification).toMatchObject({ show: true, text: 'cart.unavailable' })
  })

  it('omits preview-only metadata from the Swell cart payload', async () => {
    swell.settings.get.mockReturnValue(false)
    swell.cart.addItem.mockResolvedValue({ items: [], item_quantity: 1 })
    const store = useCartStore()

    await store.addCartItem({ product_id: 'published-1', quantity: 1, preview_only: false })

    expect(swell.cart.addItem).toHaveBeenCalledWith({ product_id: 'published-1', quantity: 1 })
    expect(store.cart).toEqual({ items: [], item_quantity: 1 })
  })
})
