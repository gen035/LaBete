// store/product.js
export default {
    namespaced: true, // Important for module encapsulation
    state: () => ({
        recommended: null,
        error: null
    }),
    actions: {
        async fetchProductsBySlugs({ commit }, products) {
            try {
                const ids = products.map(({ product_id }) => product_id);
                const recommendedProducts = await Promise.all(
                    ids.map(id => this.$swell.products.get({ where: { id } }))
                );

                const validProducts = recommendedProducts.filter(product => product && product.results && product.results.length > 0);
                const recommendedProductsResults = validProducts.map(product => product.results[0]);
                commit('SET_PRODUCTS_RECOMMENDED', recommendedProductsResults);
            } catch (error) {
                console.error('Failed to fetch recommended products:', error);
                commit('SET_ERROR', error);
            }
        }
    },
    mutations: {
        SET_PRODUCTS_RECOMMENDED(state, recommended) {
            state.recommended = recommended;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },
    getters: {
        getProductRecommended(state) {
            return state.recommended;
        }
    }
};
