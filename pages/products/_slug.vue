<template>
  <section class="content products">
      <section class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <h1>{{category.meta_title || category.name}}</h1>
          </div>
        </div>
        <div class="row" v-if="category.description">
          <div class="col-md-6 offset-md-3 text-center product-description" v-html="category.description"/>
        </div>
        <div class="row">
            <div class="col-md-2">
              <Filters :currentCategoryId="category.id" @newFilters="(newFilters) => handleFilters(newFilters)"/>
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
  import { categoryMapping } from './constants';
  
  export default {
    async asyncData({ app, error, store, $swell, params}) {
      const locale = store.state.i18n.locale;
      let content = [];

      const mappedCategory = categoryMapping.hasOwnProperty(locale) && categoryMapping[locale].hasOwnProperty(params && params.category) && categoryMapping[locale][params && params.category] || null;
      
      if(mappedCategory === null) {
        error({ statusCode: 404, message: 'Page not found' })
      }
    
      const category = await app.$swell.categories.get(mappedCategory);

      let attributes = await app.$swell.attributes.list();
      attributes = attributes && attributes.results && attributes.results.length > 0 ? attributes.results : [];

      let products = await app.$swell.products.list({
        category: category.id
      });

      products = products && products.results && products.results.length > 0 ? products.results : [];

      if (content) {
        return {
          attributes,
          category,
          products,
        }
      } else {
        error({ statusCode: 404, message: 'Page not found' })
      }
    },
    head() {
      return {
        title: `La Bête | ${this.category.meta_title || this.category.name}`,
        link: [
        //{ rel: 'canonical', href: `https://<DOMAIN>${this.$prismic.linkResolver(this.document)}` }
        ],
        meta: [
          { hid: 'description', name: 'description', content: this.category.meta_description || this.category.description }
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
          categories: [this.category.id, "648201e2572a710011315ed7"],
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
        fr: '/produits/:category',
        en: '/products/:category'
      }
    },
  }
</script>
