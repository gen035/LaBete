<template>
  <client-only>
    <div class="cookieModalWrapper" v-if="this.$store.state.cookieModalOpened && !this.$cookies.get('labete_cookie_seen')">
      <div class="cookieModal">
        <div class="cookieModal-content" v-html="this.$t('cookie.text')" />
        <div class="cookieModal-buttons">
          <button v-on:click="accept" class="cookieModal-buttons--accept">{{ $t('cookie.accept') }}</button>
          <button v-on:click="openSettings" class="cookieModal-buttons--params">{{ $t('cookie.params') }}</button>
        </div>
      </div>
    </div>
  </client-only>
</template>
<script>
  import Media from '~/components/Media';
  export default {
    data() {
      return {

      }
    },
    methods: {
      setModalCookie() {
        this.$store.commit('SET_COOKIE_MODAL', false);
        this.$cookies.set('labete_cookie_seen', true, { maxAge: 365 * 24 * 60 * 60 });
        this.forcePageReload();
      },
      accept() {
        this.$cookies.set('LABETE_PRIVACY_PERF', true, { maxAge: 365 * 24 * 60 * 60 });
        this.$cookies.set('LABETE_PRIVACY_PERSO', true, { maxAge: 365 * 24 * 60 * 60 });
        this.setModalCookie();
      },
      forcePageReload() {
        console.log('forcePageReloadx');
        window.location.reload();
      },
      openSettings() {
        this.$store.commit('SET_COOKIE_MODAL', false);
        this.$store.commit('SET_COOKIE_PREFERENCES_MODAL', true);
      }
    },
  }
</script>
