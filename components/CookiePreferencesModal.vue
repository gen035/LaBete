<template>
  <client-only>
    <div class="cookiePreferencesModalWrapper" v-if="this.$store.state.cookiePreferencesModalOpened">
      <div class="cookiePreferencesModal">
        <div class="cookiePreferencesModal-content">
          <h1>{{ $t('cookie.params') }}</h1>
        </div>
        <div class="cookiePreferencesModal-cookie">
          <div class="cookiePreferencesModal--text">
            <h3>{{ $t('cookie.list.essential') }}</h3>
            <p>{{ $t('cookie.list.essential_description') }}</p>
          </div>
          <b-form-checkbox checked="true" name="check-button" size="md" switch disabled/>
        </div>
        <div class="cookiePreferencesModal-cookie">
          <div class="cookiePreferencesModal--text">
            <h3>{{ $t('cookie.list.performance') }}</h3>
            <p>{{ $t('cookie.list.performance_description') }}</p>
          </div>
          <b-form-checkbox v-model="$cookies.get('LABETE_PRIVACY_PERF')" name="check-button" size="md" @change="setCookieCategory('LABETE_PRIVACY_PERF')" switch />
        </div>
        <div class="cookiePreferencesModal-cookie">
          <div class="cookiePreferencesModal--text">
            <h3>{{ $t('cookie.list.personalisation') }}</h3>
            <p>{{ $t('cookie.list.personalisation_description') }}</p>
          </div>
          <b-form-checkbox v-model="$cookies.get('LABETE_PRIVACY_PERSO')" name="check-button" size="md" @change="setCookieCategory('LABETE_PRIVACY_PERSO')" switch />
        </div>
        <button v-on:click="save" class="cookiePreferencesModal-buttons--save">{{ $t('cookie.save') }}</button>
      </div>
    </div>
  </client-only>
</template>
<script>
  import Media from '~/components/Media';
  export default {
    methods: {
      forcePageReload() {
        window.location.reload();
      },
      setCookieCategory(category) {
        const cookieExists = this.checkCookie(category);
        if(cookieExists) {
          console.log(`REMOVE COOKIE - ${category}:`, cookieExists);
          this.$cookies.remove(category);
          this.deleteCookies(category);
        } else {
          console.log(`ADD COOKIE: - ${category}:`, cookieExists)
          this.$cookies.set(category, true, { maxAge: 365 * 24 * 60 * 60 });
        }
      },
      save() {
        this.forcePageReload();
      },
      checkCookie(cookie) {
        return this.$cookies.get(cookie) || false;
      },
      deleteCookies(category) {
        const cookies = {
          LABETE_PRIVACY_PERF: ['_ga', '_gid', '_gat'],
          LABETE_PRIVACY_PERSO: ['i18n_redirected', 'labete_newsletter', 'labete_cookie_seen']
        }

        cookies && cookies[category].forEach((cookieName) => {
          this.$cookies.remove(cookieName);
        });
      }
    },
  }
</script>
