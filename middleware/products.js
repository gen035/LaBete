export default async function({ store, $swell }) {
  let products = await $swell.products.list({
    limit: 100
  });
  store.commit('SET_PRODUCTS', products);
}
