<template>
  <section class="content artist">
      <section class="container" v-if="content">
        <div class="row">
          <div
            v-html="asHTML(content.title)"
            class="col-md-12"
          />
          <div
            v-html="asHTML(content.subtitle)"
            class="col-md-12 text-center m-0"
          />
        </div>
        <div class="row">
            <div class="col-md-6 col-lg-4 offset-lg-1 text-center">
              <Media
                v-if="content.image"
                :image="content.image"
                :class="{ 'd-none d-md-block': hasMobileImage }"
              />
              <Media v-if="content.mobile_image" :image="content.mobile_image" class="d-md-none" />
            </div>
            <div
              v-html="asHTML(content.content)"
              class="col-md-6 col-lg-6"
            />
        </div>
      </section>
  </section>
</template>

<script setup>
import { asText, asHTML } from '@prismicio/client'

defineI18nRoute({
  paths: {
    fr: '/artiste',
    en: '/artist'
  }
})

const { $prismic } = useNuxtApp()
const { locale } = useI18n()

const { data: content } = useAsyncData('artist', async () => {
  try {
    const docs = await $prismic.client.getAllByType('about', { lang: `${locale.value}-ca` })
    if (!docs.length) return null
    const doc = docs[0].data
    if (doc.seo?.id) {
      const seoDoc = await $prismic.client.getByID(doc.seo.id).catch(() => null)
      doc._seo = seoDoc?.data ?? null
    }
    return doc
  } catch (err) {
    console.error('[artist] Failed to fetch Prismic data:', err?.message || String(err))
    return null
  }
})

const hasMobileImage = computed(() => content.value?.mobile_image ?? false)

useHead(computed(() => ({
  title: content.value?._seo?.title ? asText(content.value._seo.title) : 'La Bête',
  meta: [
    { name: 'description', content: content.value?._seo?.description ? asText(content.value._seo.description) : '' }
  ]
})))
</script>
