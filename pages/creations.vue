<template>
  <section class="content creations">
    <section class="container">
      <div class="row">
        <div
            v-html="asHTML(content.title)"
            class="col-md-12"
        />
      </div>
      <div class="row">
        <div class="col-2 creations-img" v-for="(image, imageIndex) in images" :key="imageIndex" @click="index = imageIndex">
          <Media :image="image" />
        </div>
      </div>
      <LightGallery
          :images="images"
          :index="index"
          :disable-scroll="false"
          @close="index = null"
      />
    </section>
  </section>
</template>

<script>
import { asText, asHTML } from '@prismicio/client'

definePageMeta({
  i18n: {
    paths: {
      fr: '/nos-creations',
      en: '/our-creations'
    }
  }
})

export default {
  setup() {
    const { $prismic } = useNuxtApp()
    const { locale } = useI18n()

    const index = ref(null)

    const { data: content } = useAsyncData('creations', async () => {
      const docs = await $prismic.client.getAllByType('creations', { lang: `${locale.value}-ca` })
      if (!docs.length) return null
      const doc = docs[0].data
      if (doc.seo && doc.seo.id) {
        const seoDoc = await $prismic.client.getByID(doc.seo.id)
        doc._seo = seoDoc.data
      }
      return doc
    })

    const images = computed(() => {
      if (!content.value?.images) return []
      return content.value.images.map(item => ({
        title: item.image.alt || null,
        url: item.image.url
      }))
    })

    useHead(computed(() => ({
      title: content.value?._seo?.title ? asText(content.value._seo.title) : 'La Bête',
      meta: [
        { name: 'description', content: content.value?._seo?.description ? asText(content.value._seo.description) : '' }
      ]
    })))

    return { content, images, index, asHTML }
  }
}
</script>
