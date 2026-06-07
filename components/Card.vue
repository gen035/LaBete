<template>
  <a
    :href="computedHref"
    @click="goTo()"
    :title="card.title[0].text"
  >
    <Media
      classes="d-none d-md-block d-lg-block"
      :image="card.image"
    />
    <Media
      classes="d-block d-md-none d-lg-none"
      :image="card.image_mobile"
    />
    <h2>{{ card.title[0].text }}</h2>
  </a>
</template>
<script>
  import { useMainStore } from '~/stores/main'

  export default {
    props: {
      card: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
    setup() {
      const { locale } = useI18n()
      const mainStore = useMainStore()
      return { locale, mainStore }
    },
    computed: {
      computedHref() {
        if (!this.card.open_modal) {
          const url = this.card?.link?.url || '#';
          const page = url.split('/').pop();
          return `${this.locale.value === 'en' ? '/' + this.locale.value : ''}/${page}`;
        }
        return 'javascript:void(0);';  // Avoid page navigation when modal is true
      }
    },
    methods: {
      goTo() {
        if (this.card.open_modal) {
          this.mainStore.setMessageOpened(true);
        }
      }
    },
  }
</script>
