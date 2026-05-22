<template>
  <div v-if="mainStore.getCategories && mainStore.getCategories.length > 0" class="dropdown m-md-2 categories-dropdown" id="category">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      {{ $t('products.categories.text') }}
    </button>
    <ul class="dropdown-menu">
      <li>
        <NuxtLink class="dropdown-item" :to="localePath('products')" active-class="active">
          {{ $t('products.categories.all') }}
        </NuxtLink>
      </li>
      <template v-for="(category, index) in mainStore.getCategories" :key="index">
        <li v-if="category.slug !== 'featured'">
          <NuxtLink class="dropdown-item" :to="localePath({name: 'products-slug', params: { category: category.slug }})" active-class="active">
            {{ $t(`products.categories.${category.slug}`) }}
          </NuxtLink>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { useMainStore } from '~/stores/main'

export default {
  setup() {
    const mainStore = useMainStore()
    return { mainStore }
  }
}
</script>
