<template>
  <aside class="filters">
    <div class="filters-type">
      <h3>Categories</h3>
      <ul>
        <li v-for="(category, index) in categories" :key="index">{{category.name}}</li>
      </ul>
    </div>
    <div v-for="(attribute, index) in attributes" :key="index" class="filters-type">
      <template v-if="attribute.filterable">
        <h3>{{attribute.name}}</h3>
          <b-form-checkbox-group
            v-model="selectedFilters[attribute.id]"
            :options="attribute.values">
          </b-form-checkbox-group>
      </template>
    </div>
  </aside>
</template>
<script>
  export default {
    props: {
      attributes: {
        type: Array,
        require: true,
        default: () => ({})
      },
      categories: {
        type: Array,
        require: true,
        default: () => ({})
      }
    },
    created() {
      console.log('attr',this.attributes)
    },
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
      }
    }
  }
</script>