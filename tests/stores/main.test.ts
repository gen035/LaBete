import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMainStore } from '~/stores/main'

describe('useMainStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('setCategories updates state', () => {
    const store = useMainStore()
    const cats = [{ slug: 'wine', name: 'Wine' }]
    store.setCategories(cats)
    expect(store.categories).toEqual(cats)
  })

  it('setSettings updates state', () => {
    const store = useMainStore()
    store.setSettings({ siteName: 'La Bête' })
    expect(store.settings).toEqual({ siteName: 'La Bête' })
  })

  it('setNewsletterOpened toggles newsletter.isOpened', () => {
    const store = useMainStore()
    store.setNewsletterOpened(true)
    expect(store.newsletter.isOpened).toBe(true)
  })

  it('getCategory filters by slug', () => {
    const store = useMainStore()
    store.setCategories([{ slug: 'wine' }, { slug: 'beer' }])
    expect(store.getCategory('wine')).toEqual([{ slug: 'wine' }])
  })
})
