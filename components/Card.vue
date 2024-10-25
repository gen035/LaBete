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
  import Media from '~/components/Media';

  export default {
    props: {
      card: {
        type: Object,
        require: true,
        default: () => ({})
      }
    },
    computed: {
      computedHref() {
        if (!this.card.open_modal) {
          const locale = this.$store.state.i18n.locale;
          const url = this.card?.link?.url || '#';
          const page = url.split('/').pop();
          return `${locale === 'en' ? '/' + locale : ''}/${page}`;
        }
        return 'javascript:void(0);';  // Avoid page navigation when modal is true
      }
    },
    methods: {
      goTo() {
        const openModal = this.card.open_modal;
        if(openModal) {
          this.$store.commit('SET_MESSAGE', true);
        }
      }
    },
    components: {
      Media
    }
  }
</script>
