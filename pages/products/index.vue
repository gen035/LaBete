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
              <Filters @newFilters="(newFilters) => handleFilters(newFilters)" />
            </div>
            <div class="col-md-10">
              <div class="row" v-if="products.length > 0">
                <div class="col-md-2 d-flex align-items-center">
                  {{$t('products.sort')}}
                  <b-form-select v-model="order" :options="orderOptions"></b-form-select>
                </div>
              </div>
              <div class="row">
                <h2 v-if="products.length <=0">NO PROD</h2>
                <ProductCard v-if="products.length > 0" v-for="(product, index) in products" :product="product" :key="index"/>
              </div>
            </div>
        </div>
      </section>
  </section>
</template>

<script>
  import Filters from '~/components/Filters';
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
        order: null,
        orderOptions: [
          { value: null, text: this.$t('products.orderSelection') },
          { value: 'asc', text: this.$t('products.asc') },
          { value: 'desc', text: this.$t('products.desc') }
        ],
        filters: {}
      }
    },
    watch: {
      order() {
        if(this.order === 'asc') {
          this.products.sort((a, b) => a.price - b.price);
        } else {
          this.products.sort((a, b) => b.price - a.price);
        }
      },
      filters() {
        this.getNewProducts();
      }
    },
    methods: {
      handleFilters(filters) {
        this.filters = JSON.parse(filters);
      },
      async getNewProducts() {
        const newProducts = await this.$swell.products.list({
          $filters: this.filters
        });
        this.products = newProducts && newProducts.results;
      }
    },
    components: {
      Filters,
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
