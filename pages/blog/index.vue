<template>
  <div class="blog">
    <div class="container-full">
      <div class="row justify-content-center mx-auto">
        <div class="blog-header align-items-center justify-content-center mt-3 mb-5">
          <img src="~/assets/images/blog_header.jpg" />
          <h1>{{$t('blog.title')}}</h1>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div v-if="posts?.length === 0" class="blog-empty">
          <h2 class="title-h1">{{$t('blog.empty.title')}}</h2>
          <p class="text-center">{{$t('blog.empty.content')}}</p>
        </div>
        <template v-else>
          <BlogPost v-for="(post, index) in posts" :key="index" :post="post" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { asText } from '@prismicio/client'

defineI18nRoute({
  paths: {
    fr: '/blogue',
    en: '/blog'
  }
})

const { $prismic } = useNuxtApp()
const { locale } = useI18n()

const { data } = useAsyncData('blog-index', async () => {
  try {
    const postDocs = await $prismic.client.getAllByType('blog_post', {
      lang: `${locale.value}-ca`,
      orderings: [{ field: 'document.first_publication_date' }]
    })

    const seoId = locale.value === 'en' ? 'Z0E07xMAACQA3yRe' : 'Z0E1IBMAACIA3ySl'
    const seoDoc = await $prismic.client.getByID(seoId).catch(() => null)
    const seo = seoDoc?.data ?? null

    return { posts: postDocs, seo }
  } catch (err) {
    console.error('[blog] Failed to fetch Prismic data:', err?.message || String(err))
    return { posts: [], seo: null }
  }
})

const posts = computed(() => data.value?.posts ?? [])
const seo = computed(() => data.value?.seo ?? null)

useHead(computed(() => ({
  title: seo.value?.title ? asText(seo.value.title) : 'La Bête',
  meta: [
    { name: 'description', content: seo.value?.description ? asText(seo.value.description) : '' }
  ]
})))
</script>
