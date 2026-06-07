<template>
  <div class="col-lg-4 col-sm-6 my-2">
    <div class="glossary-card p-3 d-flex flex-column">
      <figure>
        <Media :image="data.image" placeholder="horizontal" />
      </figure>
      <div class="glossary-card-body">
        <div
          v-html="asHTML(data.title)"
        />
        <div
          v-html="asHTML(data.content)"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import { asHTML } from '@prismicio/client'
  export default {
    setup() {
      return { asHTML }
    },
    props: {
      data: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
  }
</script>
