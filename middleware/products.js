export default async function({ store, $swell }) {
  let products = await $swell.products.list();
  store.commit('SET_PRODUCTS', products);
}
