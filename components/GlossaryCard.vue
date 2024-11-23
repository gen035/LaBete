<template>
  <div class="col-lg-4 col-sm-6 my-2">
    <div class="glossary-card py-2 px-3">
      <figure>
        <Media :image="data.image" placeholder="horizontal" />
      </figure>
      <div class="glossary-card-body">
        <div
          v-html="$prismic.asHtml(data.title)"
        />
        <div
          v-html="$prismic.asHtml(data.content)"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import Media from '~/components/Media';
  export default {
    props: {
      data: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
    components: {
      Media
    }
  }
</script>
