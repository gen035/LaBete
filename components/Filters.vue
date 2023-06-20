<template>
  <aside class="filters">
    <div class="filters-type">
      <h3>Categories</h3>
      <b-form-checkbox-group
        v-model="selectedCategories"
        name="category"
        :options="getCategories"
        textField="name"
        valueField="id"
        >
      </b-form-checkbox-group>
    </div>
    <div v-for="(attribute, index) in getAttributes" :key="index" class="filters-type">
      <h3>{{attribute.name}}</h3>
      <b-form-checkbox-group
        v-model="selectedFilters[attribute.id]"
        :name="attribute.name"
        :options="attribute.values">
      </b-form-checkbox-group>
    </div>
    <button class="button" @click="clearFilters" data-track="" data-track-category="filters" data-track-action="click" data-track-label="clear">
      <p class="button-text">
          Clear
        </p>
        <div class="button-icon-container">
          <p class="button-icon fa fa-undo"></p>
        </div>
    </button>
  </aside>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { categorySlugMapping } from '../pages/products/constants.js';
  export default {
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
        const locale = this.$store.state.i18n.locale;
        return categorySlugMapping.hasOwnProperty(locale) && categorySlugMapping[locale].hasOwnProperty(slug) && categorySlugMapping[locale][slug] || null;
      },
      clearFilters() {
        this.selectedCategories = [];
        this.selectedFilters = {};
      }
    },
    computed: {
      locale() {
        return this.$store.state.i18n.locale;
      },
      ...mapGetters([
          "getAttributes",
          "getCategories"
      ])
    }
  }
</script>