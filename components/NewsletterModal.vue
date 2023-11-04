<template>
  <div class="newsletterModalWrapper" v-if="this.$store.state.newsletterOpened">
    <div class="newsletterModal">
      <i class="far fa-times-circle newsletterModal-close" v-on:click="close"></i>
      <div class="newsletterModal-img" v-bind:style="{ 'background-image': 'url(' + image.url +')' }"></div>
      <div class="newsletterModal-content">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <Newsletter :isModal="true" />
      </div>
    </div>
  </div>
</template>
<script>
  import Media from '~/components/Media';
  import Newsletter from '~/components/Newsletter';
  export default {
    created() {
      this.resetTimeout(); // Start the initial timeout
    },
    data() {
      return {
        title: this.$store.state.newsletter.title,
        description: this.$store.state.newsletter.description,
        image: this.$store.state.newsletter.image,
        timeoutId: null,
      }
    },
    methods: {
      close() {
        this.$store.commit('SET_NEWSLETTER', false);
        this.$cookies.set(
          'labete_newsletter',
          true,
          {
            maxAge: 7 * 24 * 60 * 60
          }
        );
      },
      resetTimeout() {
        clearTimeout(this.timeoutId); // Clear the previous timeout (if any)

        this.timeoutId = setTimeout(() => {
          if(!this.$cookies.get('labete_newsletter')) {
            this.$store.commit('SET_NEWSLETTER', true);
          }
          this.resetTimeout();
        }, 10000); // Set the timeout duration (e.g., 10 seconds)
      },
    },
    components: {
      Media,
      Newsletter
    }
  }
</script>