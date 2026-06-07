<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-md-6 footer-newsletter">
          <Newsletter />
        </div>
        <div class="col-md-6">
          <ul class="footer-links">
            <li v-if="facebook">
              <a
                :href="facebook"
                title="Facebook"
                target="_blank"
                data-track=""
                data-track-category="footer"
                data-track-action="click"
                data-track-label="Facebook"
              >
                <i class="fab fa-facebook-f"></i>
              </a>
            </li>
             <li v-if="facebookMessenger">
              <a
                :href="facebookMessenger"
                title="Facebook Messenger"
                target="_blank"
                data-track=""
                data-track-category="footer"
                data-track-action="click"
                data-track-label="Facebook Messenger"
              >
                <i class="fab fa-facebook-messenger"></i>
              </a>
            </li>
            <li v-if="store">
              <a
                :href="store"
                title="Etsy"
                target="_blank"
                data-track=""
                data-track-category="footer"
                data-track-action="click"
                data-track-label="Shop"
              >
                <i class="fab fa-etsy"></i>
              </a>
            </li>
            <li v-if="instagram">
              <a
                :href="instagram"
                title="Instagram"
                target="_blank"
                data-track=""
                data-track-category="footer"
                data-track-action="click"
                data-track-label="Instagram"
              >
                <i class="fab fa-instagram"></i>
              </a>
            </li>
            <li v-if="linkedin">
              <a
                :href="linkedin"
                title="LinkedIn"
                target="_blank"
                data-track=""
                data-track-category="footer"
                data-track-action="click"
                data-track-label="LinkedIn"
              >
                <i class="fab fa-linkedin"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="row footer-text">
        <div class="col-md-12">
          <a href="" title="La Bete" data-track="" data-track-category="footer" data-track-action="click" data-track-label="Logo">
            <Media
              classes="footer-logo"
              :image="mainStore.settings && mainStore.settings.footer_logo"
              :lazy="false"
            />
          </a>
          <div class="footer-copyright">
            {{ mainStore.settings && mainStore.settings.footer_copyright && mainStore.settings.footer_copyright[0].text }} {{ date }}
          </div>
          <div class="footer-policy">
            <NuxtLink :to="localePath('privacy-policy')" exact>
              {{ $t('footer.policy.privacy') }}
            </NuxtLink>
            <NuxtLink :to="localePath('cookie-policy')" exact>
              {{ $t('footer.policy.cookie') }}
            </NuxtLink>
            <NuxtLink :to="localePath('return')" exact>
              {{ $t('footer.policy.return') }}
            </NuxtLink>
            <span v-on:click="openPreferences">
              {{ $t('footer.cookies') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    setup() {
      const mainStore = useMainStore()
      const localePath = useLocalePath()
      return { mainStore, localePath }
    },
    computed: {
      facebook() {
        return this.mainStore.settings && this.mainStore.settings.facebook_link && this.mainStore.settings.facebook_link.url;
      },
      facebookMessenger() {
        return this.mainStore.settings && this.mainStore.settings.facebook_messenger_link && this.mainStore.settings.facebook_messenger_link.url;
      },
      store() {
        return this.mainStore.settings && this.mainStore.settings.store_link && this.mainStore.settings.store_link.url;
      },
      instagram() {
        return this.mainStore.settings && this.mainStore.settings.instagram_link && this.mainStore.settings.instagram_link.url;
      },
      linkedin() {
        return this.mainStore.settings && this.mainStore.settings.linkedin_link && this.mainStore.settings.linkedin_link.url;
      },
    },
    data() {
      return {
        date: new Date().getFullYear()
      }
    },
    methods: {
      openPreferences() {
        this.mainStore.setCookiePreferencesModal(true);
      }
    },
  }
</script>
