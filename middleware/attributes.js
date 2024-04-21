export default async function({ store, $swell }) {
  let attributes = await $swell.attributes.list();
  attributes = attributes && attributes.results && attributes.results.length > 0 ? attributes.results : [];
  const filterableAttributes = attributes.filter(attribute => attribute.filterable);
  console.log(filterableAttributes);
  store.commit('SET_ATTRIBUTES', filterableAttributes);
}
