<template>
  <a
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
    methods: {
      goTo() {
        const openModal = this.card.open_modal;
        if(openModal) {
          this.$store.commit('SET_MESSAGE', true);
        }else{
          const locale = this.$store.state.i18n.locale;
          const url = this.card && this.card.link && this.card.link.url;
          const page = url.split("/").pop();
          this.$router.push(`${locale === 'en' ? '/' + locale : ''}/${page}`)
        }
      }
    },
    components: {
      Media
    }
  }
</script>
