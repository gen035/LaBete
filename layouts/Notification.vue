<template>
  <div class="notification" v-if="show">
    <b-alert :variant="type" :show="show" :dismissible="dismissible" fade @dismissed="clear">
      {{$t(`${text}`)}}
    </b-alert>
  </div>
</template>
<script>
  export default {
    methods: {
      clear() {
        this.$store.commit('SET_NOTIFICATION', null);
      }
    },
    computed: {
      show() {
        return this.$store.state.notification && this.$store.state.notification.show;
      },
      type() {
        return this.$store.state.notification && this.$store.state.notification.type || 'success';
      },
      dismissible() {
        return this.$store.state.notification && this.$store.state.notification.dismissible;
      },
      text() {
        return this.$store.state.notification && this.$store.state.notification.text;
      },
    },
  }
</script>
