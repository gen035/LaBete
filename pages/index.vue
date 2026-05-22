<template>
  <div class="home">
    <section class="home-slider container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-12">
            <Slider :data="pageData?.slider" />
          </div>
          <div class="col-md-4 d-none d-md-block position-relative">
            <div class="home-text-box">
              <h1 class="home-title">{{ pageData?.content?.hero_title?.[0]?.text }}</h1>
              <p class="home-subtitle">{{ pageData?.content?.hero_subtitle?.[0]?.text }}</p>
              <a class="button-simple" :href="pageData?.hero_button?.url?.url" v-if="pageData?.hero_button">{{pageData?.hero_button?.text}}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container d-md-none">
      <div class="row">
        <div class="col-12 text-center pb-4">
          <h1 class="home-title--mobile">{{ pageData?.content?.hero_title?.[0]?.text }}</h1>
          <p class="home-subtitle--mobile">{{ pageData?.content?.hero_subtitle?.[0]?.text }}</p>
          <a class="d-inline-block button-simple" :href="pageData?.hero_button?.url?.url" v-if="pageData?.hero_button">{{pageData?.hero_button?.text}}</a>
        </div>
      </div>
    </section>
    <template v-for="(block, index) in pageData?.top_blocks" :key="index">
      <Block
        :block="block"
        :index="index"
        size="small"
        :imageType="index === 0 ? 'img' : 'background'"
      />
    </template>
    <section
      v-if="pageData?.cards && pageData?.cards.length > 0"
      class="py-5"
    >
      <div class="container">
        <div class="row align-items-center justify-content-center">
          <div
            v-for="(card, index) in pageData?.cards"
            class="col-6 col-md-4 home-link"
            :key="index"
          >
            <Card
              :card="card"
            />
          </div>
        </div>
      </div>
    </section>
    <template v-for="(block, index) in pageData?.blocks" :key="index">
      <Block
        :block="block"
        :index="index"
        :imageType="index === 0 ? 'img' : 'background'"
      />
    </template>
    <!--<section class="container home-images p-5">
      <div class="row align-items-center">
        <div class="col-md-6 home-image text-center p-4">
          <Media :image="pageData?.content?.image_1" />
        </div>
        <div class="col-md-6 home-image text-center p-4">
          <Media :image="pageData?.content?.image_2" />
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 home-image text-center p-4">
          <Media :image="pageData?.content?.image_3" />
        </div>
      </div>
    </section>-->
    <client-only>
      <section v-if="productsResults && productsResults.length > 0" class="container py-4">
        <div class="row">
          <h1>{{$t('home.products.title')}}</h1>
        </div>
        <div class="row d-flex justify-content-center">
          <ProductCard v-for="(product, index) in productsResults" :product="product" :key="`${product.id}`"/>
        </div>
      </section>
    </client-only>
  </div>
</template>

<script>
import { asText } from '@prismicio/client'

definePageMeta({
  i18n: {
    paths: {
      fr: '/',
      en: '/'
    }
  }
})

export default {
  setup() {
    const { $prismic } = useNuxtApp()
    const { $swell } = useNuxtApp()
    const { locale } = useI18n()

    const { data: pageData } = useAsyncData('home', async () => {
      const lang = `${locale.value}-ca`

      const homeDocs = await $prismic.client.getAllByType('home', { lang })
      if (homeDocs.length === 0) return null
      const content = homeDocs[0].data

      const [hero_button_doc, seo_doc] = await Promise.all([
        $prismic.client.getByID(content.hero_button.id),
        $prismic.client.getByID(content.seo.id),
      ])

      const cards = await Promise.all(
        content.cards.map(({ card }) => $prismic.client.getByID(card.id).then(d => d.data))
      )

      const blocks = await Promise.all(
        content.blocks.map(({ block }) => $prismic.client.getByID(block.id).then(d => d.data))
      )

      const sliderDoc = await $prismic.client.getByID(content.slider.id)

      const top_blocks = await Promise.all(
        content.top_blocks.map(async ({ top_block }) => {
          const item = await $prismic.client.getByID(top_block.id)
          if (item.data.button?.id) {
            item.data.button = await $prismic.client.getByID(item.data.button.id)
          }
          return item.data
        })
      )

      return {
        content,
        hero_button: hero_button_doc.data,
        seo: seo_doc.data,
        cards,
        blocks,
        slider: sliderDoc.data,
        top_blocks,
      }
    })

    const { data: productsResults } = useAsyncData('home-products', async () => {
      const res = await $swell.products.list({ limit: 4, sort: 'date_created desc', categories: 'featured' })
      return res?.results ?? []
    })

    useHead(computed(() => ({
      title: pageData.value?.seo ? asText(pageData.value.seo.title) : 'La Bête',
    })))

    useSeoMeta(computed(() => ({
      description: pageData.value?.seo ? asText(pageData.value.seo.description) : '',
    })))

    return { pageData, productsResults }
  }
}
</script>
