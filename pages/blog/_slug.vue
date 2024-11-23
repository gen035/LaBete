<template>
  <div class="blog-post container">
    <div class="row">
      <div class="col-md-8 col-12 offset-md-2">
        <div
          v-html="$prismic.asHtml(content.title)"
        />
        <Media :image="content.image" placeholder="horizontal"/>
        <ul class="blog-post-tags" v-if="content.tags?.length > 0">
          <li v-for="tag in content.tags">{{tag.tag}}</li>
        </ul>
        <div
          v-html="$prismic.asHtml(content.content)"
          class="blog-post-body"
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
              content = null;
          }
      }).catch((error) => {
          console.error('Error fetching document:', error);
      });
      
      if (content) {
        const excerpt = content.content[0].text.split(' ').slice(0, 20).join(' ') || "";
        return {
          content,
          excerpt
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
          { hid: 'description', name: 'description', content: this.excerpt }
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
