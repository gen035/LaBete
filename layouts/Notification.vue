<template>
  <div class="notification">
    <b-alert :variant="type" :show="show" :dismissible="dismissible" fade @dismissed="clear">
      {{$t(`${text}`)}}
    </b-alert>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  export default {
    methods: {
      clear() {
        this.$store.commit('cart/SET_NOTIFICATION', null);
      }
    },
    computed: {
      ...mapGetters('cart', [
          'getNotification',
      ]),
      show() {
        return this.getNotification && this.getNotification.show;
      },
      type() {
        return this.getNotification && this.getNotification.type || 'success';
      },
      dismissible() {
        return this.getNotification && this.getNotification.dismissible;
      },
      text() {
        return this.getNotification && this.getNotification.text;
      },
    },
  }
</script>
