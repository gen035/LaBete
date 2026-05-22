<template>
  <client-only>
    <div>
      <div
          role="dialog"
          class="cookiePreferencesModalWrapper"
          v-if="mainStore.cookiePreferencesModalOpened"
      >
        <div class="cookiePreferencesModal">
          <div class="cookiePreferencesModal-content">
            <h1>{{ $t('cookie.params') }}</h1>
          </div>

          <div class="cookiePreferencesModal-cookie">
            <div class="cookiePreferencesModal--text">
              <h3>{{ $t('cookie.list.essential') }}</h3>
              <p>{{ $t('cookie.list.essential_description') }}</p>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" checked disabled>
            </div>
          </div>

          <div class="cookiePreferencesModal-cookie">
            <div class="cookiePreferencesModal--text">
              <h3>{{ $t('cookie.list.performance') }}</h3>
              <p>{{ $t('cookie.list.performance_description') }}</p>
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="perfEnabled"
                id="perfCheck"
                @change="setCookieCategory('LABETE_PRIVACY_PERF')"
              >
            </div>
          </div>

          <div class="cookiePreferencesModal-cookie">
            <div class="cookiePreferencesModal--text">
              <h3>{{ $t('cookie.list.personalisation') }}</h3>
              <p>{{ $t('cookie.list.personalisation_description') }}</p>
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="persoEnabled"
                id="persoCheck"
                @change="setCookieCategory('LABETE_PRIVACY_PERSO')"
              >
            </div>
          </div>

          <CustomButton
              @click="save"
              :aria-label="$t('cookie.save')"
              :text="$t('cookie.save')"
              icon="fa-save"
          />
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
      // Cookies to clear when revoking consent categories
      const cookieGa = useCookie('_ga');
      const cookieGid = useCookie('_gid');
      const cookieGat = useCookie('_gat');
      const cookieI18n = useCookie('i18n_redirected');
      const cookieNewsletter = useCookie('labete_newsletter');
      const cookieSeen = useCookie('labete_cookie_seen');
      return {
        mainStore,
        labeteCookieSeen,
        labetePrivacyPerf,
        labetePrivacyPerso,
        cookieGa,
        cookieGid,
        cookieGat,
        cookieI18n,
        cookieNewsletter,
        cookieSeen,
      };
    },
    data() {
      return {
        perfEnabled: !!this.labetePrivacyPerf,
        persoEnabled: !!this.labetePrivacyPerso,
      };
    },
    methods: {
      forcePageReload() {
        window.location.reload();
      },
      setCookieCategory(category) {
        if (category === 'LABETE_PRIVACY_PERF') {
          if (this.labetePrivacyPerf) {
            this.labetePrivacyPerf = null;
            this.deleteCookies(category);
          } else {
            this.labetePrivacyPerf = true;
          }
        } else if (category === 'LABETE_PRIVACY_PERSO') {
          if (this.labetePrivacyPerso) {
            this.labetePrivacyPerso = null;
            this.deleteCookies(category);
          } else {
            this.labetePrivacyPerso = true;
          }
        }
      },
      save() {
        this.labeteCookieSeen = true;
        this.forcePageReload();
      },
      deleteCookies(category) {
        if (category === 'LABETE_PRIVACY_PERF') {
          this.cookieGa = null;
          this.cookieGid = null;
          this.cookieGat = null;
        } else if (category === 'LABETE_PRIVACY_PERSO') {
          this.cookieI18n = null;
          this.cookieNewsletter = null;
          this.cookieSeen = null;
        }
      }
    },
  }
</script>
