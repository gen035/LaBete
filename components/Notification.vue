<template>
  <div class="notification">
    <div v-if="show" :class="`alert alert-${type} alert-dismissible fade show`" role="alert">
      {{$t(`${text}`)}}
      <button v-if="dismissible" type="button" class="btn-close" @click="clear" aria-label="Close"></button>
    </div>
  </div>
</template>
<script>
  export default {
    setup() {
      const cartStore = useCartStore()
      return { cartStore }
    },
    methods: {
      clear() {
        this.cartStore.setNotification(null);
      }
    },
    computed: {
      show() {
        return this.cartStore.getNotification && this.cartStore.getNotification.show;
      },
      type() {
        return this.cartStore.getNotification && this.cartStore.getNotification.type || 'success';
      },
      dismissible() {
        return this.cartStore.getNotification && this.cartStore.getNotification.dismissible;
      },
      text() {
        return this.cartStore.getNotification && this.cartStore.getNotification.text;
      },
    },
  }
</script>
