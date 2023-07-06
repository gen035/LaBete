<template>
  <div>
  <ProductCard v-for="(product, index) in products" :product="product" :key="index"/>
  </div>
</template>
<script>
  import ProductCard from '~/components/ProductCard';

  export default {
    props: {
      products: {
        type: Array,
        require: true,
        default: () => ({})
      }
    },
    created() {
    },
    methods: {
    },
    components: {
    }
  }
</script>
