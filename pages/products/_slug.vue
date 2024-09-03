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
          <NoProducts v-if="productsResults && productsResults.length === 0" />
          <ProductCard v-else v-for="(product, index) in productsResults" :product="product" :key="index"/>
        </div>
         <div v-if="products.page_count > 1" class="row">
            <CustomButton :text="$t('products.more')" v-on:click.native="loadMore" icon="fa-plus" :disabled="products && products.page >= products.page_count"/>
          </div>
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
      let products = await app.$swell.products.list({
        limit: 25,
        sort: "date_created desc",
        categories: category
      });

      const productsResults = products && products.results && products.results.length > 0 ? products.results : [];

      if (content) {
        return {
          content,
          products,
          productsResults,
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
    methods: {
      async loadMore() {
        console.log('LOAD', this.products)
        const newProducts = await this.$swell.products.list({
          limit: 25,
          sort: "date_created desc",
          categories: this.category,
          page: this.products.page + 1
        });

         // Check if newProducts is defined and has results
        if (newProducts && newProducts.results) {
          // Append new products to the existing products array
          this.productsResults = [...this.productsResults, ...newProducts.results];
          // Update the products object with the new pagination data
          this.products = newProducts;
        }
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
