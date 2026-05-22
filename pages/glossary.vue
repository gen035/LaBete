<template>
  <section class="content glossary">
      <section v-if="content" class="container">
        <div class="row">
            <div
              v-html="asHTML(content.title)"
              class="col-md-12"
            />
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-10" v-html="asHTML(content.content)" />
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-10">
            <div class="row flex-row d-flex align-items-stretch">
              <GlossaryCard v-for="(card, index) in glossaryCards" :key="index" :data="card"/>
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
      fr: '/glossaire',
      en: '/glossary'
    }
  }
})

export default {
  setup() {
    const { $prismic } = useNuxtApp()
    const { locale } = useI18n()

    const { data } = useAsyncData('glossary', async () => {
      const pageDoc = await $prismic.client.getByUID('page', 'glossary', { lang: `${locale.value}-ca` })
      const content = pageDoc ? pageDoc.data : null

      const glossaryCardDocs = await $prismic.client.getAllByType('glossarycard', { lang: `${locale.value}-ca` })
      const glossaryCards = glossaryCardDocs.map(doc => doc.data)

      let seo = null
      if (content && content.seo && content.seo.id) {
        const seoDoc = await $prismic.client.getByID(content.seo.id)
        seo = seoDoc.data
      }

      return { content, glossaryCards, seo }
    })

    const content = computed(() => data.value?.content ?? null)
    const glossaryCards = computed(() => data.value?.glossaryCards ?? [])
    const seo = computed(() => data.value?.seo ?? null)

    useHead(computed(() => ({
      title: seo.value?.title ? asText(seo.value.title) : 'La Bête',
      meta: [
        { name: 'description', content: seo.value?.description ? asText(seo.value.description) : '' }
      ]
    })))

    return { content, glossaryCards, asHTML }
  }
}
</script>
