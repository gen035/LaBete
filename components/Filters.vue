<template>
  <aside class="filters">
    <div class="filters-type">
      <h3>Categories</h3>
      <NuxtLink
        v-for="(category, index) in getCategories"
        :to="localePath({name: 'products-slug', params: { category: category.slug }})"
        :key="index"
      >
        {{ category.name }}
      </NuxtLink>
    </div>
    <div v-for="(attribute, index) in getAttributes" :key="index" class="filters-type">
      <h3>{{attribute.name}}</h3>
      <div class="d-flex flex-wrap gap-2" :name="attribute.name">
        <div v-for="(value, index) in attribute.values" :key="index" class="form-check">
          <input class="form-check-input" type="checkbox" :id="`filter-${attribute.id}-${index}`" :value="value" v-model="selectedFilters[attribute.id]" />
          <label class="form-check-label" :for="`filter-${attribute.id}-${index}`">{{$t(`filters.${attribute.id}.${value}`)}}</label>
        </div>
      </div>
    </div>
    <div class="filters-clear" @click="clearFilters" data-track="" data-track-category="filters" data-track-action="click" data-track-label="clear">
      <i class="fa fa-undo"></i>{{$t('filters.clear')}}
    </div>
  </aside>
</template>
<script>
  import { useMainStore } from '~/stores/main'
  import { categorySlugMapping } from '~/utils/productConstants.js';
  export default {
    setup() {
      const mainStore = useMainStore()
      const { locale } = useI18n()
      return { mainStore, locale }
    },
    data() {
      return {
        selectedCategories: [],
        selectedFilters: {}
      }
    },
    watch: {
      selectedFilters: {
        handler(newVal) {
          if (!this.isEqual(newVal, this.oldObject)) {
            this.$emit('newFilters', JSON.stringify(newVal));
          }
          this.oldObject = this.deepCopy(newVal);
        },
        deep: true
      },
      selectedCategories: {
        handler(newVal, oldVal) {
          if(newVal !== oldVal) {
            this.$emit('newCategories', JSON.stringify(newVal));
          }
        }
      }
    },
    methods: {
      isEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      },
      deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      filterSlug(slug) {
        const locale = this.locale;
        return categorySlugMapping.hasOwnProperty(locale) && categorySlugMapping[locale].hasOwnProperty(slug) && categorySlugMapping[locale][slug] || null;
      },
      clearFilters() {
        this.selectedCategories = [];
        this.selectedFilters = {};
      }
    },
    computed: {
      getAttributes() { return this.mainStore.getAttributes },
      getCategories() { return this.mainStore.getCategories },
    }
  }
</script>
