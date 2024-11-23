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
            <ProductCard v-else v-for="(product, index) in this.productsResults" :product="product" :key="product.id"/>
          </div>
          <div class="row">
            <CustomButton :text="$t('products.more', { number: products.count - (products.limit * products.page)})" v-on:click.native="loadMore" icon="fa-plus" :disabled="this.products && this.products.page >= this.products.page_count" size="large" />
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
    },
    async mounted() {
      this.products = await this.$swell.products.list({
        limit: 24,
        sort: "date_created desc"
      });

      this.productsResults = this.products && this.products.results && this.products.results.length > 0 ? this.products.results : [];
      this.hasFetched = true;
    },
    methods: {
      async loadMore() {
        const newProducts = await this.$swell.products.list({
          limit: 24,
          sort: "date_created desc",
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
