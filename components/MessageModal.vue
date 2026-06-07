<template>
  <div role="dialog" class="messageModalWrapper" v-if="mainStore.messageOpened">
    <div class="messageModal">
      <i role="button" :aria-label="$t('newsletter.close')" class="far fa-times-circle messageModal-close" @click="close"></i>
      <div v-if="mainStore.message.image && mainStore.message.image.url" class="messageModal-img" v-bind:style="{ 'background-image': 'url(' + mainStore.message.image.url +')' }"></div>
      <div class="messageModal-content">
        <h1 v-if="mainStore.message.title && mainStore.message.title.length > 0">{{ mainStore.message.title[0].text }}</h1>
        <p v-if="mainStore.message.description && mainStore.message.description.length > 0" v-html="asHTML(mainStore.message.description)" />
      </div>
    </div>
  </div>
</template>
<script>
  import { asHTML } from '@prismicio/client'
  export default {
    setup() {
      const mainStore = useMainStore();
      return { mainStore, asHTML };
    },
    methods: {
      close() {
        this.mainStore.setMessageOpened(false);
      }
    },
  }
</script>
