<template>
  <div class="blog-post container">
    <div class="row">
      <div class="col-md-8 col-12 offset-md-2">
        <div
          v-html="asHTML(content.data.title)"
        />
        <Media :image="content.data.image" placeholder="horizontal"/>
        <div class="d-flex my-3">
          <time :datetime="content.first_publication_date">{{formattedDate}}</time>
          <ul class="blog-post-tags" v-if="content.data.tags?.length > 0">
            <li v-for="tag in content.data.tags">{{tag.tag}}</li>
          </ul>
        </div>
        <div
          v-html="asHTML(content.data.content)"
          class="blog-post-body"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { asText, asHTML } from '@prismicio/client'

definePageMeta({
  i18n: {
    paths: {
      fr: '/blogue/:slug',
      en: '/blog/:slug'
    }
  }
})

export default {
  setup() {
    const { $prismic } = useNuxtApp()
    const { locale } = useI18n()
    const route = useRoute()

    const { data: content } = useAsyncData(`blog-post-${route.params.slug}`, async () => {
      const doc = await $prismic.client.getByUID('blog_post', route.params.slug, {
        lang: `${locale.value}-ca`
      })
      return doc || null
    })

    const excerpt = computed(() => {
      if (!content.value?.data?.content?.[0]?.text) return ''
      return content.value.data.content[0].text.split(' ').slice(0, 20).join(' ')
    })

    const formattedDate = computed(() => {
      if (!content.value?.first_publication_date) return ''
      const dateObj = new Date(content.value.first_publication_date)
      const day = String(dateObj.getUTCDate()).padStart(2, '0')
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0')
      const year = dateObj.getUTCFullYear()
      return `${day}-${month}-${year}`
    })

    useHead(computed(() => ({
      title: content.value?.data?.title ? `La Bête | ${asText(content.value.data.title)}` : 'La Bête',
      meta: [
        { name: 'description', content: excerpt.value }
      ]
    })))

    return { content, formattedDate, asHTML }
  }
}
</script>
