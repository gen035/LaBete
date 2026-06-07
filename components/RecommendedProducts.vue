<template>
  <div>
  <ProductCard v-for="(product, index) in products" :product="product" :key="index"/>
  </div>
</template>
<script>
  export default {
    props: {
      products: {
        type: Array,
        required: true,
        default: () => ({})
      }
    },
  }
</script>
