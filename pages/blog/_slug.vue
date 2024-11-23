<template>
  <div class="blog-post container">
    <div class="row">
      <div class="col-md-8 col-md-push-2">
        <div
          v-html="$prismic.asHtml(content.title)"
        />
        <Media :image="content.image" placeholder="horizontal"/>
        <div class="blog-post-date">{{content.date}}</div>
        <ul class="blog-post-tags" v-if="content.tags?.length > 0">
          <li v-for="tag in content.tags">{{tag.tag}}</li>
        </ul>
        <div
          v-html="$prismic.asHtml(content.content)"
        />
      </div>
    </div>
  </div>
</template>

<script>

  import Media from '~/components/Media';

  export default {
    async asyncData({ app, error, store, params}) {
      const locale = store.state.i18n.locale;
      let content = []

      await app.$prismic.api.getByUID('blog_post', params.slug, {
          lang: `${locale}-ca`
      }).then((response) => {
          if (response) {
              content = response.data;
          } else {
              console.error('Document not found');
          }
      }).catch((error) => {
          console.error('Error fetching document:', error);
      });

      if (content) {
        return {
          content
        }
      } else {
        error({ statusCode: 404, message: 'Page not found' })
      }
    },
    head() {
      return {
        title: `La Bête | ${this.$prismic.asText(this.content.title)}`,
        link: [
        //{ rel: 'canonical', href: `https://<DOMAIN>${this.$prismic.linkResolver(this.document)}` }
        ],
        meta: [
          { hid: 'description', name: 'description', content: "" }
        ]
      }
    },
    components: {
      Media
    },
    nuxtI18n: {
      paths: {
        fr: '/blogue/:slug',
        en: '/blog/:slug'
      }
    },
  }
</script>
