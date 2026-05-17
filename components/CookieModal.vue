<template>
  <client-only>
    <div>
      <div
          role="dialog"
          :aria-label="$t('cookie.text')"
          class="cookieModalWrapper"
          v-if="mainStore.cookieModalOpened && !labeteCookieSeen.value"
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
  import CustomButton from "@/components/CustomButton.vue";
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
        this.labeteCookieSeen.value = true;
        this.forcePageReload();
      },
      accept() {
        this.labetePrivacyPerf.value = true;
        this.labetePrivacyPerso.value = true;
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
    components: {
      CustomButton,
    },
  }
</script>
