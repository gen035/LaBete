<template>
  <section class="content products">
      <section class="container-fluid">
        <div class="row">
          <div
            v-html="$prismic.asHtml(content.title)"
            class="col-md-12"
          />
        </div>
        <div class="row" v-if="content.content">
          <div
            v-html="$prismic.asHtml(content.content)"
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
          <div class="row">
            <CustomButton :text="$t('products.more')" v-on:click.native="loadMore" icon="fa-plus" :disabled="this.products && this.products.page >= this.products.page_count"/>
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
    async asyncData({ app, error, store }) {
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

      if (content) {
        return {
          content,
          seo
        }
      } else {
        error({ statusCode: 404, message: 'Page not found' })
      }
    },
    head() {
      return {
        title: this.$prismic.asText(this.seo.title),
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
        products: null,
        productsResults: null,
        hasFetched: false,
      }
      // return {
      //   order: 'date',
      //   orderOptions: [
      //     { value: 'date', text: this.$t('products.orderSelection') },
      //     { value: 'asc', text: this.$t('products.asc') },
      //     { value: 'desc', text: this.$t('products.desc') }
      //   ],
      //   categories: [],
      //   filters: {}
      // }
    },
    watch: {
      // order() {
      //   this.products = this.sortProducts(this.order);
      // },
      // filters() {
      //   this.getNewProducts();
      // },
      // categories() {
      //   this.getNewProducts();
      // }
    },
    async mounted() {
      this.products = await this.$swell.products.list({
        limit: 25
      });

      this.productsResults = this.products && this.products.results && this.products.results.length > 0 ? this.products.results : [];
      this.hasFetched = true;
    },
    methods: {
      // handleCategories(categories) {
      //   this.categories = JSON.parse(categories);
      // },
      // handleFilters(filters) {
      //   this.filters = JSON.parse(filters);
      // },
      // sortProducts(order, newProducts) {
      //   const productsToOrder = newProducts || this.products;

      //   switch (order) {
      //     case 'asc':
      //       return productsToOrder.sort((a, b) => a.price - b.price);
      //       break;
      //     case 'desc':
      //       return productsToOrder.sort((a, b) => b.price - a.price);
      //       break;
      //     default:
      //       console.log('def')
      //       return productsToOrder.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
      //   }
      // },
      // async getNewProducts() {
      //   const newProducts = await this.$swell.products.list({
      //     categories: this.categories,
      //     $filters: this.filters
      //   });

      //   const newProductsResults = newProducts && newProducts.results;
      //   this.products = this.sortProducts(this.order, newProductsResults);
      // }
    },
    middleware: [
      'categories',
    ],
    components: {
      CategoriesDropdown,
      CustomButton,
      Filters,
      NoProducts,
      ProductCard
    },
    nuxtI18n: {
      paths: {
        fr: '/produits',
        en: '/products'
      }
    },
  }
</script>
