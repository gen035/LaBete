<template>
  <div class="col-md-3 store">
    <a
      :href="store.google_link.url"
      :title="store.name[0].text"
      target="_blank"
      data-track=""
      data-track-category="stores"
      data-track-action="click"
      :data-track-label="store.name[0].text"
    >
      <i class="fas fa-map-marker-alt"></i>
      <h2 class="store-name">
        {{ store.name[0].text }}
      </h2>
      <p class="store-address" v-html="$prismic.asHtml(store.adresse)"/>
      <p class="store-phone">
        {{ store.phone[0].text }}
      </p>
    </a>
  </div>
</template>
<script>
  export default {
    props: {
      store: {
        type: Object,
        required: true,
        default: () => ({})
      }
    }
  }
</script>