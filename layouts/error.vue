<template>
  <div class="container error">
    <div class="row">
      <div class="col-md-12 text-center">
        <h1>{{ $t('error.title') }}</h1>
        <p v-if="error.statusCode === 404">
          {{ $t('error.notFound.text') }}
        </p>
        <nuxt-link to="/">{{ $t('error.home') }}</nuxt-link>
        <Media
          classes="error-img"
          :image="this.getSettings.error_image"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Media from './../components/Media';
  import { mapGetters } from 'vuex';

  export default {
    props: ['error'],
    layout: 'error',// you can set a custom layout for the error page
    computed: {
      ...mapGetters([
        "getSettings"
      ])
    },
    components: {
      Media
    }
  }
</script>
