<template>
  <div role="dialog" class="messageModalWrapper" v-if="this.$store.state.messageOpened">
    <div class="messageModal">
      <i role="button" :aria-label="$t('newsletter.close')" class="far fa-times-circle messageModal-close" v-on:click="close"></i>
      <div v-if="image && image.url" class="messageModal-img" v-bind:style="{ 'background-image': 'url(' + image.url +')' }"></div>
      <div class="messageModal-content">
        <h1 v-if="title && title.length > 0">{{ title[0].text }}</h1>
        <p v-if="description && description.length > 0" v-html="$prismic.asHtml(description)" />
      </div>
    </div>
  </div>
</template>
<script>
  import Media from '~/components/Media';
  export default {
    data() {
      return {
        title: this.$store.state.message.title,
        description: this.$store.state.message.description,
        image: this.$store.state.message.image
      }
    },
    methods: {
      close() {
        this.$store.commit('SET_MESSAGE', false);
      }
    },
    components: {
      Media
    }
  }
</script>
