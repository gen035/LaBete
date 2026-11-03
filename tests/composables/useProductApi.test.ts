import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProductApi } from '~/composables/useProductApi'

const swell = {
  products: {
    list: vi.fn(),
    get: vi.fn(),
  },
}

let swellPreview = true

beforeEach(() => {
  swellPreview = true
  vi.clearAllMocks()
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { swellPreview } }))
  vi.stubGlobal('useNuxtApp', () => ({ $swell: swell }))
  vi.stubGlobal('$fetch', vi.fn())
})

describe('useProductApi', () => {
  it('uses the non-production list endpoint and preserves published and inactive products', async () => {
    const previewProduct = { id: 'draft-1', active: false, preview_only: true }
    const publishedProduct = { id: 'published-1', active: true, preview_only: false }
    const request = vi.mocked(globalThis.$fetch)
    request.mockResolvedValue({
      results: [publishedProduct, previewProduct],
      count: 2,
      page: 1,
      page_count: 1,
    })
    const query = { limit: 24, page: 1, categories: 'featured', sort: 'date_created desc' }

    const result = await useProductApi().list(query)

    expect(request).toHaveBeenCalledWith('/api/products', { query })
    expect(result.results).toEqual([publishedProduct, previewProduct])
    expect(swell.products.list).not.toHaveBeenCalled()
  })

  it('uses the non-production detail endpoint and preserves expansion', async () => {
    const request = vi.mocked(globalThis.$fetch)
    request.mockResolvedValue({ id: 'draft/1', active: false, preview_only: true })
    const query = { expand: ['cross_sells', 'up_sells'] }

    await useProductApi().get('draft/1', query)

    expect(request).toHaveBeenCalledWith('/api/products/draft%2F1', { query })
    expect(swell.products.get).not.toHaveBeenCalled()
  })

  it('uses the public Swell client in production mode', async () => {
    swellPreview = false
    swell.products.list.mockResolvedValue({ results: [{ id: 'published-1' }] })
    swell.products.get.mockResolvedValue({ id: 'published-1' })
    const listQuery = { limit: 24, page: 1, categories: 'featured', sort: 'date_created desc' }
    const detailQuery = { expand: ['cross_sells', 'up_sells'] }

    await useProductApi().list(listQuery)
    await useProductApi().get('published-1', detailQuery)

    expect(swell.products.list).toHaveBeenCalledWith(listQuery)
    expect(swell.products.get).toHaveBeenCalledWith('published-1', detailQuery)
    expect(globalThis.$fetch).not.toHaveBeenCalled()
  })
})
