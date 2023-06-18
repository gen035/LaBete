<template>
  <section class="content products">
      <section class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <h1>{{category.name}}</h1>
          </div>
        </div>
        <div class="row" v-if="category.description">
          <div class="col-md-6 offset-md-3 text-center product-description">{{category.description}}</div>
        </div>
        <div class="row">
            <div class="col-md-2">
              <Filters :attributes="attributes" :categories="categories" />
            </div>
            <div class="col-md-10">
              <h2 v-if="products.length <=0">NO PROD</h2>
              <ProductCard v-if="products.length > 0" v-for="(product, index) in products" :product="product" :key="index"/>
            </div>
        </div>
      </section>
  </section>
</template>

<script>
  import Filters from '~/components/Filters';
  import ProductCard from '~/components/ProductCard';

  export default {
    async asyncData({ app, error, store, $swell, params}) {
      const locale = store.state.i18n.locale;
      let content = [];

      const category = await app.$swell.categories.get(params && params.category);
      const categories = [category];

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
          categories,
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
