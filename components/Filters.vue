<template>
  <aside class="filters">
    <div class="filters-type">
      <h3>Categories</h3>
      <ul>
        <li v-for="(category, index) in categories" :key="index">{{category.name}}</li>
      </ul>
    </div>
  </aside>
</template>
<script>
  export default {
    props: {
      attributes: {
        type: Object,
        require: true,
        default: () => ({})
      },
      categories: {
        type: Array,
        require: true,
        default: () => ({})
      }
    }
  }
</script>