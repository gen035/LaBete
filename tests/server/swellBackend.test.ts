import { beforeEach, describe, expect, it, vi } from 'vitest'

const { request } = vi.hoisted(() => ({ request: vi.fn() }))

vi.mock('ofetch', () => ({ $fetch: request }))

import {
  assertSwellBackendEnabled,
  getSwellProduct,
  listSwellProducts,
  normalizeSwellProduct,
  normalizeSwellProductList,
} from '~/server/utils/swellBackend'
beforeEach(() => {
  request.mockReset()
})

describe('Swell preview product normalization', () => {
  it('marks inactive products while preserving list metadata', () => {
    const response = normalizeSwellProductList({
      results: [
        { id: 'published', active: true },
        { id: 'draft', active: false },
      ],
      count: 2,
      page: 1,
      page_count: 1,
    })

    expect(response).toMatchObject({ count: 2, page: 1, page_count: 1 })
    expect(response.results).toEqual([
      { id: 'published', active: true, preview_only: false },
      { id: 'draft', active: false, preview_only: true },
    ])
  })

  it('normalizes a detail product with the same marker', () => {
    expect(normalizeSwellProduct({ id: 'draft', active: false })).toEqual({
      id: 'draft',
      active: false,
      preview_only: true,
    })
  })
  it('authenticates backend detail requests and fixes expansion', async () => {
    request.mockResolvedValue({ id: 'draft', active: false })

    await getSwellProduct('draft/1', {
      swellSecretKey: 'secret',
      public: { swellPreview: true, swellStoreId: 'store' },
    })

    expect(request).toHaveBeenCalledWith('https://api.swell.store/products/draft%2F1', {
      headers: { Authorization: `Basic ${Buffer.from('store:secret').toString('base64')}` },
      query: { expand: 'cross_sells,up_sells' },
    })
  })

  it('fails closed before requesting Swell when preview credentials are missing', async () => {
    await expect(listSwellProducts(
      { limit: 24, page: 1, sort: 'date_created desc' },
      { public: { swellPreview: true, swellStoreId: 'store' } },
    )).rejects.toMatchObject({ statusCode: 503 })
    expect(request).not.toHaveBeenCalled()
  })

  it('rejects disabled non-production access before requesting Swell', () => {
    expect(() => assertSwellBackendEnabled({ public: { swellPreview: false } })).toThrowError()
    expect(request).not.toHaveBeenCalled()
  })
})
