<template>
  <div class="container error">
    <div class="row">
      <div class="col-md-12 text-center">
        <h1>{{ $t('error.title') }}</h1>
        <p v-if="error.statusCode === 404">
          {{ $t('error.notFound.text') }}
        </p>
        <button class="button-simple" @click="goHome">{{ $t('error.home') }}</button>
        <Media
          classes="error-img"
          :image="mainStore.settings?.error_image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['error'])

const mainStore = useMainStore()

const goHome = () => clearError({ redirect: '/' })
</script>
