export type ProductRecord = Record<string, unknown>

export type ProductListResponse = {
  results: ProductRecord[]
  count?: number
  page?: number
  page_count?: number
}

type ProductQuery = Record<string, unknown>

type ProductApi = {
  isPreview: boolean
  list: (query?: ProductQuery) => Promise<ProductListResponse>
  get: (id: string, query?: ProductQuery) => Promise<ProductRecord | null>
}

export function useProductApi(): ProductApi {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const isPreview = config.public.swellPreview === true
  const list = (query: ProductQuery = {}) => {
    if (isPreview) return $fetch<ProductListResponse>('/api/products', { query })
    return nuxtApp.$swell.products.list(query)
  }

  const get = (id: string, query: ProductQuery = {}) => {
    if (isPreview) return $fetch<ProductRecord | null>(`/api/products/${encodeURIComponent(id)}`, { query })
    return nuxtApp.$swell.products.get(id, query)
  }

  return { isPreview, list, get }
}
