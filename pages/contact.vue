<template>
  <section class="content">
      <section class="container" v-if="content">
        <div class="row">
            <div
              v-html="asHTML(content.title)"
              class="col-md-12"
            />
        </div>
        <div class="row align-items-center justify-content-center">
          <div v-if="content && content.contact_items" class="col-md-4">
              <div v-for="(item, index) in content.contact_items" class="contact-item">
                <a :href="`${item.link && item.link.url}`" :title="formattedTitle(item)" data-track="" data-track-category="contact" data-track-action="click" :data-track-label="formattedTitle(item)" target="_blank">
                  <h2 v-if="item && item.label && item.label.length > 0">{{item.label[0].text}}<i v-if="item.fa_icon && item.fa_icon.length > 0" :class="item.fa_icon[0].text"></i></h2>
                  <p v-if="item && item.display_text && item.display_text.length > 0">{{item.display_text[0].text}}</p>
                  <p v-if="item && item.label && item.handle.length > 0 && item.handle[0].text">{{ item.handle[0].text }}</p>
                </a>
              </div>
          </div>
          <div class="col-md-4">
            <Media :image="content.image" :altProp="$t('contact.alt')" classes="contact-img-1"/>
            <Media :image="content.mobile_image" :altProp="$t('contact.alt')" classes="contact-img-2"/>
          </div>
        </div>
      </section>
  </section>
</template>

<script setup>
import { asText, asHTML } from '@prismicio/client'

defineI18nRoute({
  paths: {
    fr: '/contact',
    en: '/contact'
  }
})

const { $prismic } = useNuxtApp()
const { locale } = useI18n()

const { data: content } = useAsyncData('contact', async () => {
  try {
    const docs = await $prismic.client.getAllByType('contact', { lang: `${locale.value}-ca` })
    if (!docs.length) return null
    const doc = docs[0].data
    if (doc.seo?.id) {
      const seoDoc = await $prismic.client.getByID(doc.seo.id).catch(() => null)
      doc._seo = seoDoc?.data ?? null
    }
    return doc
  } catch (err) {
    console.error('[contact] Failed to fetch Prismic data:', err?.message || String(err))
    return null
  }
})

useHead(computed(() => ({
  title: content.value?._seo?.title ? asText(content.value._seo.title) : 'La Bête',
  meta: [
    { name: 'description', content: content.value?._seo?.description ? asText(content.value._seo.description) : '' }
  ]
})))

const formattedTitle = (item) => {
  return item && item.label && item.label.length > 0 && item.label[0].text.toLowerCase()
}
</script>
