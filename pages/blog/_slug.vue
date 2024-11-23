<template>
  <div class="blog-post container">
    <div class="row">
      <div class="col-md-8 col-12 offset-md-2">
        <div
          v-html="$prismic.asHtml(content.data.title)"
        />
        <Media :image="content.data.image" placeholder="horizontal"/>
        <div class="d-flex my-3">
          <time :datetime="content.first_publication_date">{{formattedDate}}</time>
          <ul class="blog-post-tags" v-if="content.data.tags?.length > 0">
            <li v-for="tag in content.data.tags">{{tag.tag}}</li>
          </ul>
        </div>
        <div
          v-html="$prismic.asHtml(content.data.content)"
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
              content = response;
          } else {
              content = null;
          }
      }).catch((error) => {
          console.error('Error fetching document:', error);
      });
      
      if (content) {
        const excerpt = content.data.content[0].text.split(' ').slice(0, 20).join(' ') || "";
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
    computed: {
      formattedDate() {
        const dateObj = new Date(this.content.first_publication_date);
        // Extract day, month, and year
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const year = dateObj.getUTCFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
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
