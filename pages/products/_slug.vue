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
        <div class="row">
          <NoProducts v-if="products.length === 0" />
          <ProductCard v-if="products.length > 0" v-for="(product, index) in products" :product="product" :key="index"/>
        </div>
      </section>
  </section>
</template>

<script>
  import CategoriesDropdown from '~/components/CategoriesDropdown';
  import Filters from '~/components/Filters';
  import NoProducts from '~/components/NoProducts';
  import ProductCard from '~/components/ProductCard';

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
      let products = await app.$swell.products.list({
        limit: 100,
        categories: category
      });

      products = products && products.results && products.results.length > 0 ? products.results : [];
      products.filter(product => product.stock_status === 'in_stock');

      if (content) {
        return {
          content,
          products,
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
        order: 'date',
        orderOptions: [
          { value: 'date', text: this.$t('products.orderSelection') },
          { value: 'asc', text: this.$t('products.asc') },
          { value: 'desc', text: this.$t('products.desc') }
        ],
        filters: {}
      }
    },
    watch: {
      order() {
        this.products = this.sortProducts(this.order);
      },
      filters() {
        this.getNewProducts();
      }
    },
    methods: {
      handleFilters(filters) {
        this.filters = JSON.parse(filters);
      },
      sortProducts(order, newProducts) {
        const productsToOrder = newProducts || this.products;

        switch (order) {
          case 'asc':
            return productsToOrder.sort((a, b) => a.price - b.price);
            break;
          case 'desc':
            return productsToOrder.sort((a, b) => b.price - a.price);
            break;
          default:
            console.log('def')
            return productsToOrder.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        }
      },
      async getNewProducts() {
        const newProducts = await this.$swell.products.list({
          categories: this.category,
          $filters: this.filters
        });

        const newProductsResults = newProducts && newProducts.results;
        this.products = this.sortProducts(this.order, newProductsResults);
      }
    },
    computed: {
      categoryTitle() {
        const category = this.$store.state.categories.find(category => category.slug === this.$route.params.category);
        return category ? category.name : null;
      },
      categoryDesc() {
        const category = this.$store.state.categories.find(category => category.slug === this.$route.params.category);
        return category ? category.description : null;
      }
    },
    components: {
      CategoriesDropdown,
      Filters,
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
