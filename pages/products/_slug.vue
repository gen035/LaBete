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
      <template v-if="this.hasFetched">
        <div class="row">
          <NoProducts v-if="this.productsResults && this.productsResults.length === 0" />
          <ProductCard v-else v-for="(product, index) in this.productsResults" :product="product" :key="index"/>
        </div>
        <div v-if="this.count > 24" class="row">
          <div class="progress my-3 mx-auto">
            <div class="progress-bar" :style="{width: this.progress + '%'}"></div>
          </div>
          <div class="progress-text text-center my-2">
            {{ $t('products.progress', { current: this.productsResults.length, count: this.count }) }}
          </div>
        </div>
        <div v-if="this.products && (this.products.page < this.products.page_count)" class="row">
          <CustomButton :text="$t('products.more')" v-on:click.native="fetchProducts" icon="fa-plus" size="large" />
        </div>
      </template>
    </section>
  </section>
</template>

<script>
  import CategoriesDropdown from '~/components/CategoriesDropdown';
  import Filters from '~/components/Filters';
  import NoProducts from '~/components/NoProducts';
  import ProductCard from '~/components/ProductCard';
  import CustomButton from '~/components/CustomButton.vue';

  export default {
    async asyncData({ app, error, store, params }) {
      const locale = store.state.i18n.locale;
      let content = [];

      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'products'), {
           lang: `${locale}-ca`
        }
      ).then((response) => {
        response.results.forEach(result => {
          content = result.data;
        });
      })

      let seo = await app.$prismic.api.getByID(content.seo.id)
      seo = seo.data;

      const category =  params && params.category;

      if (content) {
        return {
          category,
          content,
          seo
        }
      } else {
        error({ statusCode: 404, message: 'Page not found' })
      }
    },
    head() {
      return {
        title: `${this.$prismic.asText(this.seo.title)} - ${this.category}`,
        link: [
        //{ rel: 'canonical', href: `https://<DOMAIN>${this.$prismic.linkResolver(this.document)}` }
        ],
        meta: [
          { hid: 'description', name: 'description', content: this.$prismic.asText(this.seo.description) }
        ]
      }
    },
    data() {
      return {
        count: 0,
        products: null,
        productsResults: [],
        progress: 0,
        hasFetched: false
      }
    },
    async mounted() {
      await this.fetchProducts()
    },
    methods: {
      async fetchProducts() {
        this.products = await this.$swell.products.list({
          limit: 24,
          sort: "date_created desc",
          categories: this.category,
          page: this.products && this.products.page + 1 || 1
        });

        if (this.products && this.products.results && this.products.results.length > 0) {
          const newProducts = this.products.results;
          // Remove duplicates
          const uniqueProducts = [
            ...this.productsResults,
            ...newProducts.filter(product =>
                !this.productsResults.some(existingProduct => existingProduct.id === product.id)
            )
          ];

          this.productsResults = uniqueProducts;
        }
        this.count = this.products.count;
        this.setProgress(this.productsResults.length, this.count);
        this.hasFetched = true;
      },
      setProgress(amount, count) {
        this.progress = (amount / count) * 100;
      }
    },
    computed: {
      categoryTitle() {
        const categories = this.$store.state.categories || [];
        const category = categories.find(category => category.slug === this.$route.params.category);
        return category ? category.name : '';
      },
      categoryDesc() {
        const categories = this.$store.state.categories || [];
        const category = categories.find(category => category.slug === this.$route.params.category);
        return category ? category.description : '';
      }
    },
    components: {
      CategoriesDropdown,
      CustomButton,
      NoProducts,
      ProductCard
    },
    nuxtI18n: {
      paths: {
        fr: '/produits/:category',
        en: '/products/:category'
      }
    },
  }
</script>
