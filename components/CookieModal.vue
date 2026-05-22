<template>
  <client-only>
    <div>
      <div
          role="dialog"
          :aria-label="$t('cookie.text')"
          class="cookieModalWrapper"
          v-if="mainStore.cookieModalOpened && !labeteCookieSeen"
      >
        <div class="cookieModal">
          <div class="cookieModal-content" v-html="$t('cookie.text')" />
          <div class="cookieModal-buttons">
            <CustomButton
                @click="accept"
                :aria-label="$t('cookie.accept')"
                :text="$t('cookie.accept')"
                icon="fa-check"
            />
            <CustomButton
                @click="openSettings"
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
  export default {
    setup() {
      const mainStore = useMainStore();
      const labeteCookieSeen = useCookie('labete_cookie_seen', { maxAge: 365 * 24 * 60 * 60 });
      const labetePrivacyPerf = useCookie('LABETE_PRIVACY_PERF', { maxAge: 365 * 24 * 60 * 60 });
      const labetePrivacyPerso = useCookie('LABETE_PRIVACY_PERSO', { maxAge: 365 * 24 * 60 * 60 });
      return { mainStore, labeteCookieSeen, labetePrivacyPerf, labetePrivacyPerso };
    },
    methods: {
      setModalCookie() {
        this.mainStore.setCookieModal(false);
        this.labeteCookieSeen = true;
        this.forcePageReload();
      },
      accept() {
        this.labetePrivacyPerf = true;
        this.labetePrivacyPerso = true;
        this.setModalCookie();
      },
      forcePageReload() {
        window.location.reload();
      },
      openSettings() {
        this.mainStore.setCookieModal(false);
        this.mainStore.setCookiePreferencesModal(true);
      }
    },
  }
</script>
