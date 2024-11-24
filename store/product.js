// store/product.js
export default {
    namespaced: true, // Important for module encapsulation
    state: () => ({
        recommended: null,
        error: null
    }),
    actions: {
        async fetchProductsBySlugs({ commit }, products) {
            if (Array.isArray(products) && products.length > 0) {
                try {
                    // Extract product IDs
                    const ids = products.map(({ product_id }) => product_id).filter(Boolean);

                    // Fetch recommended products concurrently
                    const recommendedProducts = await Promise.all(
                    ids.map(async (id) => {
                        try {
                            return await this.$swell.products.get({ where: { id } });
                        } catch (error) {
                            console.error(`Failed to fetch product with ID: ${id}`, error);
                            return null; // Skip invalid/failing products
                        }
                    })
                    );

                    // Filter valid products with results and stock availability
                    const validProducts = recommendedProducts
                        .filter(product => product && product.results && product.results.length > 0)
                        .map(product => product.results[0])
                        .filter(product => product.stock_level > 0);

                    // Limit to top 3 results and commit
                    commit('SET_PRODUCTS_RECOMMENDED', validProducts.slice(0, 3));
                } catch (error) {
                    console.error('Error fetching recommended products:', error);
                    commit('SET_PRODUCTS_RECOMMENDED', null); // Fallback if overall process fails
                }
            } else {
                commit('SET_PRODUCTS_RECOMMENDED', null);
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
