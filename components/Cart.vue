<template>
  <b-sidebar id="sidebar-cart" aria-label="Cart" no-header shadow right backdrop footer-tag="div">
      <template #footer="{ hide }">
       CHECKOUT
      </template>
      <div class="px-3 py-2">
        I AM CART
      </div>
    </b-sidebar>
</template>
<script>
  export default {
    props: {

    },
    computed: {

    }
  }
</script>