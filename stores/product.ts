import { defineStore } from 'pinia'
import { useProductApi, type ProductRecord } from '~/composables/useProductApi'

type RecommendationRef = {
  product_id?: string
}

export const useProductStore = defineStore('product', {
  state: () => ({
    recommended: null as ProductRecord[] | null,
    error:       null as unknown,
  }),

  actions: {
    setRecommended(products: ProductRecord[] | null) { this.recommended = products },

    async fetchProductsBySlugs(products: RecommendationRef[]) {
      const productApi = useProductApi()
      if (!Array.isArray(products) || products.length === 0) {
        this.setRecommended(null)
        return
      }

      try {
        const ids = products
          .map(product => product.product_id)
          .filter((id): id is string => Boolean(id))
        const fetched = await Promise.all(
          ids.map(async (id): Promise<ProductRecord | null> => {
            try {
              const response = await productApi.get(id)
              if (!response) return null
              const results = response.results
              if (Array.isArray(results)) {
                const first = results[0]
                return first && typeof first === 'object' && !Array.isArray(first)
                  ? first as ProductRecord
                  : null
              }
              return response
            } catch {
              return null
            }
          })
        )

        const valid = fetched
          .filter((product): product is ProductRecord =>
            product !== null && typeof product.stock_level === 'number' && product.stock_level > 0,
          )
          .slice(0, 3)

        this.setRecommended(valid)
      } catch (err) {
        console.error('fetchProductsBySlugs error', err)
        this.setRecommended(null)
      }
    },
  },

  getters: {
    getProductRecommended: (state) => state.recommended,
  },
})
