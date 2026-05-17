import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '~/stores/product'

describe('useProductStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initial recommended is null', () => {
    const store = useProductStore()
    expect(store.recommended).toBeNull()
  })

  it('setRecommended updates state', () => {
    const store = useProductStore()
    const products = [{ id: '1' }, { id: '2' }]
    store.setRecommended(products)
    expect(store.recommended).toEqual(products)
  })
})
