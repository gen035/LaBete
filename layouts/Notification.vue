<template>
  <div class="notification" v-if="this.$store.state.notification">
    <b-alert :variant="type" :show="show">{{text}}</b-alert>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: this.$store.state.notification.type || 'success',
        show: this.$store.state.notification.show,
        text: this.$store.state.notification.show
      }
    },
    methods: {
      
    }
  }
</script>
