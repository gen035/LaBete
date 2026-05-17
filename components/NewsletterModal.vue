<template>
  <div role="dialog" class="newsletterModalWrapper" v-if="mainStore.newsletter.isOpened">
    <div class="newsletterModal">
      <i role="button" :aria-label="$t('newsletter.close')" class="far fa-times-circle newsletterModal-close" @click="close"></i>
      <div class="newsletterModal-img" v-bind:style="{ 'background-image': 'url(' + mainStore.newsletter.data?.image?.url +')' }"></div>
      <div class="newsletterModal-content">
        <h1>{{ mainStore.newsletter.data?.title }}</h1>
        <p>{{ mainStore.newsletter.data?.description }}</p>
        <Newsletter :isModal="true" />
      </div>
    </div>
  </div>
</template>
<script>
  import Newsletter from '~/components/Newsletter';
  export default {
    setup() {
      const mainStore = useMainStore();
      const labeteNewsletter = useCookie('labete_newsletter', { maxAge: 1 * 24 * 60 * 60 });
      return { mainStore, labeteNewsletter };
    },
    created() {
      this.resetTimeout();
    },
    beforeUnmount() {
      clearTimeout(this.timeoutId);
    },
    methods: {
      close() {
        this.mainStore.setNewsletterOpened(false);
        this.labeteNewsletter.value = true;
      },
      resetTimeout() {
        clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
          const hasNewsletterCookie = !!this.labeteNewsletter.value;

          if (!hasNewsletterCookie) {
            this.mainStore.setNewsletterOpened(true);
          }
          this.resetTimeout();
        }, 10000);
      },
    },
    components: {
      Newsletter
    }
  }
</script>
