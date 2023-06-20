<template>
  <aside class="filters">
    <div class="filters-type">
      <h3>Categories</h3>
      <div class="filters-categories">
         <NuxtLink 
            v-for="(category, index) in getCategories"
            :key="index"
            :to="`${filterSlug(category.slug)}`"
            active-class="active"
            exact
          >{{category.name}}</NuxtLink>
      </div>
    </div>
    <div v-for="(attribute, index) in getAttributes" :key="index" class="filters-type">
      <template v-if="attribute.filterable">
        <h3>{{attribute.name}}</h3>
          <b-form-checkbox-group
            v-model="selectedFilters[attribute.id]"
            :name="attribute.name"
            :options="attribute.values">
          </b-form-checkbox-group>
      </template>
    </div>
  </aside>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { categorySlugMapping } from '../pages/products/constants.js';
  export default {
    data() {
      return {
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
        const locale = this.$store.state.i18n.locale;
        return categorySlugMapping.hasOwnProperty(locale) && categorySlugMapping[locale].hasOwnProperty(slug) && categorySlugMapping[locale][slug] || null;
      }
    },
    computed: {
      ...mapGetters([
          "getAttributes",
          "getCategories"
      ])
    }
  }
</script>