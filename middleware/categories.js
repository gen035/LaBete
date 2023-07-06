export default async function({ store, $swell }) {
  let categories = await $swell.categories.list();
  categories = categories && categories.results && categories.results.length > 0 ? categories.results : [];
  store.commit('SET_CATEGORIES', categories);
}