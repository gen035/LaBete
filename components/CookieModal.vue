<template>
  <client-only>
    <div>
      <div
          role="dialog"
          :aria-label="$t('cookie.text')"
          class="cookieModalWrapper"
          v-if="$store.state.cookieModalOpened && !$cookies.get('labete_cookie_seen')"
      >
        <div class="cookieModal">
          <div class="cookieModal-content" v-html="$t('cookie.text')" />
          <div class="cookieModal-buttons">
            <CustomButton
                v-on:click.native="accept"
                :aria-label="$t('cookie.accept')"
                :text="$t('cookie.accept')"
                icon="fa-check"
            />
            <CustomButton
                v-on:click.native="openSettings"
                :aria-label="$t('cookie.accept')"
                :text="$t('cookie.params')"
                icon="fa-cog"
            />
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>
<script>
  import CustomButton from "@/components/CustomButton.vue";
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
        window.location.reload();
      },
      openSettings() {
        this.$store.commit('SET_COOKIE_MODAL', false);
        this.$store.commit('SET_COOKIE_PREFERENCES_MODAL', true);
      }
    },
    components: {
      CustomButton,
    },
  }
</script>
