<template>
  <section class="content brand">
      <section class="container">
        <div v-if="content?.title?.length > 0" class="row">
          <div
            v-html="asHTML(content.title)"
            class="col-md-12"
          />
        </div>
        <div class="row pt-5">
          <template v-for="(block, index) in blocks">
            <Block
              :block="block"
              imageType="img"
              :index="index"
            />
          </template>
        </div>
      </section>
  </section>
</template>

<script setup>
import { asText, asHTML } from '@prismicio/client'

definePageMeta({
  i18n: {
    paths: {
      fr: '/marque',
      en: '/brand'
    }
  }
})

const { $prismic } = useNuxtApp()
const { locale } = useI18n()

const { data } = useAsyncData('brand', async () => {
  try {
    const docs = await $prismic.client.getAllByType('brandpage', { lang: `${locale.value}-ca` })
    if (!docs.length) return null
    const doc = docs[0].data

    let seo = null
    if (doc.seo?.id) {
      const seoDoc = await $prismic.client.getByID(doc.seo.id).catch(() => null)
      seo = seoDoc?.data ?? null
    }

    const blocks = []
    for (const block of (doc.blocks || [])) {
      if (!block.block?.id) continue
      const item = await $prismic.client.getByID(block.block.id).catch(() => null)
      if (item) blocks.push(item.data)
    }

    return { content: doc, blocks, seo }
  } catch (err) {
    console.error('[brand] Failed to fetch Prismic data:', err?.message || String(err))
    return null
  }
})

const content = computed(() => data.value?.content ?? null)
const blocks = computed(() => data.value?.blocks ?? [])
const seo = computed(() => data.value?.seo ?? null)

useHead(computed(() => ({
  title: seo.value?.title ? asText(seo.value.title) : 'La Bête',
  meta: [
    { name: 'description', content: seo.value?.description ? asText(seo.value.description) : '' }
  ]
})))
</script>
