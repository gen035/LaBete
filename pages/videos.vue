<template>
  <section class="content videos">
    <section v-if="content" class="container">
      <div class="row">
        <div v-html="asHTML(content.title)" class="col-md-12" />
        <div
          v-html="asHTML(content.content)"
          class="col-md-8 offset-md-2 text-center mb-5"
        />
      </div>

      <div class="row">
        <div
          v-for="(video, index) in content.videos"
          :key="(video.video_link && video.video_link.embed_url) || index"
          class="col-md-6 offset-md-3 mb-5 video"
        >
          <h2>{{ asText(video.video_title) }}</h2>

          <time v-if="video.date">
            {{ formatDate(video.date) }}
          </time>

          <div
            class="video-wrapper"
            v-if="video.video_link && video.video_link.html"
          >
            <div
              class="video-embed"
              v-html="responsiveEmbed(video.video_link.html)"
            />
          </div>

        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { asText, asHTML } from '@prismicio/client'

definePageMeta({
  i18n: {
    paths: {
      fr: '/videos',
      en: '/videos'
    }
  }
})

export default {
  setup() {
    const { $prismic } = useNuxtApp()
    const { locale } = useI18n()

    const { data: content } = useAsyncData('videos', async () => {
      const docs = await $prismic.client.getAllByType('videos_page', { lang: `${locale.value}-ca` })
      if (!docs.length) return null
      const doc = docs[0].data
      if (doc.seo && doc.seo.id) {
        const seoDoc = await $prismic.client.getByID(doc.seo.id)
        doc._seo = seoDoc.data
      }
      return doc
    })

    useHead(computed(() => ({
      title: content.value?._seo?.title ? asText(content.value._seo.title) : 'La Bête',
      meta: [
        { name: 'description', content: content.value?._seo?.description ? asText(content.value._seo.description) : '' }
      ]
    })))

    return { content, asText, asHTML }
  },
  methods: {
    responsiveEmbed(html) {
      return (html || '')
        .replace(/width="[^"]*"/i, 'width="100%"')
        .replace(/height="[^"]*"/i, 'height="100%"')
    },

    formatDate(dateStr) {
      try {
        return new Date(dateStr).toLocaleDateString('fr-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch (e) {
        return dateStr
      }
    }
  }
}
</script>
