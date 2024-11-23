<template>
  <div class="blog">
    <div class="container-full">
      <div class="row justify-content-center mx-auto">
        <div class="blog-header align-items-center justify-content-center mt-3 mb-5">
          <img src="https://placehold.co/600x400/EEE/31343C" />
          <h1>{{$t('blog.title')}}</h1>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div v-if="this.posts?.length === 0" class="blog-empty">
          <h2 class="title-h1">{{$t('blog.empty.title')}}</h2>
          <p class="text-center">{{$t('blog.empty.content')}}</p>
        </div>
        <BlogPost v-else-if v-for="(post, index) in this.posts" :key="index" :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
  import BlogPost from '~/components/BlogPost';

  export default {
    async asyncData({ app, error, store, params}) {
      const locale = store.state.i18n.locale;
      let posts = []

      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'blog_post'), {
          lang: `${locale}-ca`,
          orderings : '[document.first_publication_date]',
        }
      ).then((response) => {
         response.results.forEach(result => {
          posts.push(result);
        });
      })

      let seo = await app.$prismic.api.getByID(locale === 'en' ? 'Z0E07xMAACQA3yRe' : 'Z0E1IBMAACIA3ySl');
      seo = seo.data;

      return {
        posts,
        seo
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
    components: {
      BlogPost
    },
    nuxtI18n: {
      paths: {
        fr: '/blogue',
        en: '/blog'
      }
    },
  }
</script>
