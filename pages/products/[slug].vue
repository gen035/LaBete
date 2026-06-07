<template>
  <section class="content products">
    <section class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <h2 class="title-h2">{{ categoryTitle }}</h2>
        </div>
      </div>
      <div class="row" v-if="categoryDesc">
        <div
          v-html="categoryDesc"
          class="col-md-8 offset-md-2 text-center product-description"
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
          <ProductCard v-else v-for="(product, index) in productsResults" :product="product" :key="index"/>
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

<script setup>
import { asText } from '@prismicio/client'

defineI18nRoute({
  paths: {
    fr: '/produits/:category',
    en: '/products/:category'
  }
})

const route = useRoute()
const { $prismic, $swell } = useNuxtApp()
const { locale } = useI18n()
const mainStore = useMainStore()

const { data: pageData } = useAsyncData(`products-category-${route.params.slug}`, async () => {
  try {
    const lang = `${locale.value}-ca`

    const response = await $prismic.client.getAllByType('products', { lang })
    let content = null
    response.forEach(result => { content = result.data })

    if (!content) return null

    const seoDoc = content.seo?.id ? await $prismic.client.getByID(content.seo.id).catch(() => null) : null
    const seo = seoDoc?.data ?? null

    return { content, seo }
  } catch (err) {
    console.error('[products-category] Failed to fetch Prismic data:', err?.message || String(err))
    return null
  }
})

useHead(computed(() => {
  const categorySlug = route.params.slug
  return {
    title: pageData.value?.seo ? `${asText(pageData.value.seo.title)} - ${categorySlug}` : 'La Bête',
    meta: [
      { hid: 'description', name: 'description', content: pageData.value?.seo ? asText(pageData.value.seo.description) : '' }
    ]
  }
}))

const count = ref(0)
const products = ref(null)
const productsResults = ref([])
const progress = ref(0)
const hasFetched = ref(false)

const categoryTitle = computed(() => {
  const categories = mainStore.categories || []
  const category = categories.find(c => c.slug === route.params.slug)
  return category ? category.name : ''
})

const categoryDesc = computed(() => {
  const categories = mainStore.categories || []
  const category = categories.find(c => c.slug === route.params.slug)
  return category ? category.description : ''
})

const setProgress = (amount, total) => {
  progress.value = (amount / total) * 100
}

const fetchProducts = async () => {
  products.value = await $swell.products.list({
    limit: 24,
    sort: 'date_created desc',
    categories: route.params.slug,
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
</script>
