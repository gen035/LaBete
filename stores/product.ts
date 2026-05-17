import { defineStore } from 'pinia'

declare function useNuxtApp(): any

export const useProductStore = defineStore('product', {
  state: () => ({
    recommended: null as any[] | null,
    error:       null as any,
  }),

  actions: {
    setRecommended(products: any[] | null) { this.recommended = products },

    async fetchProductsBySlugs(products: any[]) {
      const { $swell } = useNuxtApp()
      if (!Array.isArray(products) || products.length === 0) {
        this.setRecommended(null)
        return
      }

      try {
        const ids = products.map(({ product_id }: any) => product_id).filter(Boolean)
        const fetched = await Promise.all(
          ids.map(async (id: string) => {
            try {
              return await $swell.products.get({ where: { id } })
            } catch {
              return null
            }
          })
        )

        const valid = fetched
          .filter((p: any) => p?.results?.length > 0)
          .map((p: any) => p.results[0])
          .filter((p: any) => p.stock_level > 0)
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
