export default async function({ store, $swell }) {
  let attributes = await $swell.attributes.list();
  attributes = attributes && attributes.results && attributes.results.length > 0 ? attributes.results : [];
  store.commit('SET_ATTRIBUTES', attributes);
}