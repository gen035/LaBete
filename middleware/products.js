export default async function({ store, $swell }) {
    const products = await $swell.products.list({
        limit: 25
    });
    store.commit('SET_PRODUCTS', products);
}
