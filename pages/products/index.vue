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
            <div class="col-md-2">
              <Filters @newCategories="(newCategories) => handleCategories(newCategories)" @newFilters="(newFilters) => handleFilters(newFilters)" />
            </div>
            <div class="col-md-10">
              <!-- <div class="row" v-if="products.length > 0">
                <div class="col-md-2 d-flex align-items-center">
                  {{$t('products.sort')}}
                  <b-form-select v-model="order" :options="orderOptions"></b-form-select>
                </div>
              </div> -->
              <div class="row">
                <NoProducts v-if="products.length === 0" />
                <ProductCard v-if="products.length > 0" v-for="(product, index) in products" :product="product" :key="index"/>
              </div>
            </div>
        </div>
      </section>
  </section>
</template>

<script>
  import Filters from '~/components/Filters';
  import NoProducts from '~/components/NoProducts';
  import ProductCard from '~/components/ProductCard';
  
  export default {
    async asyncData({ app, error, store, $swell }) {
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

      let products = await app.$swell.products.list();
      products = products && products.results && products.results.length > 0 ? products.results : [];

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
        categories: [],
        filters: {}
      }
    },
    watch: {
      order() {
        this.products = this.sortProducts(this.order);
      },
      filters() {
        this.getNewProducts();
      },
      categories() {
        this.getNewProducts();
      }
    },
    methods: {
      handleCategories(categories) {
        this.categories = JSON.parse(categories);
      },
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
          categories: this.categories,
          $filters: this.filters
        });
        
        const newProductsResults = newProducts && newProducts.results;
        this.products = this.sortProducts(this.order, newProductsResults);
      }
    },
    components: {
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
