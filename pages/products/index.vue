<template>
  <section class="content products">
      <section class="container-fluid">
        <div class="row">
          <div
            v-html="asHTML(pageData?.content?.title)"
            class="col-md-8 offset-md-2 col-xl-6 offset-xl-3"
          />
        </div>
        <div class="row" v-if="pageData?.content?.content">
          <div
            v-html="asHTML(pageData?.content?.content)"
            class="col-md-8 offset-md-2 col-xl-6 offset-xl-3 text-center product-description"
          />
        </div>
        <div class="row">
          <div class="col-12 text-center">
            <CategoriesDropdown />
          </div>
        </div>
        <template v-if="hasFetched">
          <div class="row">
            <NoProducts v-if="productsResults && productsResults.length === 0" />
            <ProductCard v-else v-for="product in productsResults" :product="product" :key="product.id"/>
          </div>
          <div v-if="count > 24" class="row">
            <div class="progress my-3 mx-auto">
              <div class="progress-bar" :style="{width: progress + '%'}"></div>
            </div>
            <div class="progress-text text-center my-2">
              {{ $t('products.progress', { current: productsResults.length, count: count }) }}
            </div>
          </div>
          <div v-if="products && (products.page < products.page_count)" class="row">
            <CustomButton :text="$t('products.more')" @click="fetchProducts" icon="fa-plus" size="large" />
          </div>
        </template>
      </section>
  </section>
</template>

<script>
import { asText, asHTML } from '@prismicio/client'

definePageMeta({
  i18n: {
    paths: {
      fr: '/produits',
      en: '/products'
    }
  }
})

export default {
  setup() {
    const { $prismic } = useNuxtApp()
    const { locale } = useI18n()

    const { data: pageData } = useAsyncData('products-index', async () => {
      const lang = `${locale.value}-ca`

      const response = await $prismic.client.getAllByType('products', { lang })
      let content = []
      response.forEach(result => {
        content = result.data
      })

      if (!content) return null

      let seo = await $prismic.client.getByID(content.seo.id)
      seo = seo.data

      return { content, seo }
    })

    useHead(computed(() => ({
      title: pageData.value?.seo ? asText(pageData.value.seo.title) : 'La Bête',
      meta: [
        { hid: 'description', name: 'description', content: pageData.value?.seo ? asText(pageData.value.seo.description) : '' }
      ]
    })))

    const { $swell } = useNuxtApp()

    const count = ref(0)
    const products = ref(null)
    const productsResults = ref([])
    const progress = ref(0)
    const hasFetched = ref(false)

    const setProgress = (amount, total) => {
      progress.value = (amount / total) * 100
    }

    const fetchProducts = async () => {
      products.value = await $swell.products.list({
        limit: 24,
        sort: 'date_created desc',
        page: products.value && products.value.page + 1 || 1
      })

      if (products.value && products.value.results && products.value.results.length > 0) {
        const newProducts = products.value.results
        const uniqueProducts = [
          ...productsResults.value,
          ...newProducts.filter(product =>
            !productsResults.value.some(existingProduct => existingProduct.id === product.id)
          )
        ]
        productsResults.value = uniqueProducts
      }
      count.value = products.value.count
      setProgress(productsResults.value.length, count.value)
      hasFetched.value = true
    }

    onMounted(async () => {
      await fetchProducts()
    })

    return {
      pageData,
      count,
      products,
      productsResults,
      progress,
      hasFetched,
      fetchProducts,
      asHTML
    }
  }
}
</script>
