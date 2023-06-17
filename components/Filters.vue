<template>
  <aside class="filters">
    <div class="filters-type">
      <h3>Categories</h3>
      <ul>
        <li v-for="(category, index) in categories" :key="index">{{category.name}}</li>
      </ul>
    </div>
    <div v-for="(attribute, index) in attributes" :key="index" class="filters-type">
      <h3>{{attribute.name}}</h3>
      <ul>
        <li v-for="(value, index) in attribute.values" :key="index">{{value}}</li>
      </ul>
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
  }
</script>