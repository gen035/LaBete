<template>
  <section class="content cookie_policy">
      <section class="container">
        <div class="row">
            <div
              v-html="content ? asHTML(content.title) : ''"
              class="col-md-12"
            />
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-8" v-html="content ? asHTML(content.content) : ''" />
        </div>
      </section>
  </section>
</template>

<script>
import { asText, asHTML } from '@prismicio/client'

definePageMeta({
  i18n: {
    paths: {
      fr: '/politique-cookie',
      en: '/cookie-policy'
    }
  }
})

export default {
  setup() {
    const { $prismic } = useNuxtApp()
    const { locale } = useI18n()

    const { data: content } = useAsyncData('cookie-policy', async () => {
      try {
        const doc = await $prismic.client.getByUID('page', 'cookie_policy', {
          lang: `${locale.value}-ca`
        })
        if (!doc) return null
        const contentData = doc.data
        if (contentData.seo && contentData.seo.id) {
          const seoDoc = await $prismic.client.getByID(contentData.seo.id)
          contentData._seo = seoDoc ? seoDoc.data : null
        }
        return contentData
      } catch (err) {
        console.error('Error fetching document:', err)
        return null
      }
    })

    useHead(computed(() => ({
      title: content.value?._seo?.title ? asText(content.value._seo.title) : 'La Bête',
    })))

    useSeoMeta(computed(() => ({
      description: content.value?._seo?.description ? asText(content.value._seo.description) : '',
    })))

    return { content, asHTML }
  },
}
</script>
