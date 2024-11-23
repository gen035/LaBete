<template>
  <b-dropdown
      v-if="getCategories && getCategories.length > 0"
      id="category"
      :text="$t('products.categories.text')"
      class="m-md-2 categories-dropdown"
  >
    <template>
      <NuxtLink
          :to="localePath('products')"
          active-class="active"
          exact
      >
        {{$t('products.categories.all')}}
      </NuxtLink>
    </template>
    <template v-for="(category, index) in getCategories">
      <NuxtLink
          :to="localePath({name: 'products-slug', params: { category: category.slug }})"
          active-class="active"
          v-if="category.slug !== 'featured'"
          exact
      >
        {{$t(`products.categories.${category.slug}`)}}
      </NuxtLink>
    </template>
  </b-dropdown>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      "getCategories"
    ])
  }
}
</script>
