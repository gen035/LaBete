<template>
  <div class="newsletterModalWrapper" v-if="getNewsletter.isOpened">
    <div class="newsletterModal">
      <i class="far fa-times-circle newsletterModal-close" v-on:click="close"></i>
      <div class="newsletterModal-img" v-bind:style="{ 'background-image': 'url(' + getNewsletter.data?.image?.url +')' }"></div>
      <div class="newsletterModal-content">
        <h1>{{ getNewsletter.data?.title }}</h1>
        <p>{{ getNewsletter.data?.description }}</p>
        <Newsletter :isModal="true" />
      </div>
    </div>
  </div>
</template>
<script>
  import Media from '~/components/Media';
  import Newsletter from '~/components/Newsletter';
  import {mapGetters} from "vuex";
  export default {
    created() {
      this.resetTimeout(); // Start the initial timeout
    },
    methods: {
      close() {
        this.$store.commit('SET_NEWSLETTER_OPENED', false);
        this.$cookies.set(
          'labete_newsletter',
          true,
          {
            maxAge: 1 * 24 * 60 * 60
          }
        );
      },
      resetTimeout() {
        clearTimeout(this.timeoutId); // Clear the previous timeout (if any)

        this.timeoutId = setTimeout(() => {
          if(!this.$cookies.get('labete_newsletter')) {
            this.$store.commit('SET_NEWSLETTER_OPENED', true);
          }
          this.resetTimeout();
        }, 10000); // Set the timeout duration (e.g., 10 seconds)
      },
    },
    computed: {
      ...mapGetters([
        "getNewsletter"
      ])
    },
    components: {
      Media,
      Newsletter
    }
  }
</script>
