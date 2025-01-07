<template>
  <section class="content products">
      <section class="container-fluid">
        <div class="row">
          <div
            v-html="$prismic.asHtml(content.title)"
            class="col-md-8 offset-md-2 col-xl-6 offset-xl-3"
          />
        </div>
        <div class="row" v-if="content.content">
          <div
            v-html="$prismic.asHtml(content.content)"
            class="col-md-8 offset-md-2 col-xl-6 offset-xl-3 text-center product-description"
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
            <ProductCard v-else v-for="product in this.productsResults" :product="product" :key="product.id"/>
          </div>
          <div class="row">
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
        count: 0,
        products: null,
        productsResults: [],
        progress: 0,
        hasFetched: false
      }
    },
    async mounted() {
      await this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        this.products = await this.$swell.products.list({
          limit: 24,
          sort: "date_created desc",
          page: this.products && this.products.page + 1 || 1
        });

        if (this.products && this.products.results && this.products.results.length > 0) {
          const newProducts = this.products.results;

          // Remove duplicates by 'id' (assuming products have an 'id' field)
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
