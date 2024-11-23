<template>
  <div class="blog-post-item col-md-8 offset-md-2 col-12 mb-3 mb-lg-5" @click="goTo">
    <div class="row">
      <div class="blog-post-item-img col-lg-6 col-12">
        <Media :image="post.data.image" placeholder="horizontal" />
      </div>
      <div class="blog-post-item-body align-content-center col-lg-6 col-12 py-2 py-lg-0">
        <div v-html="$prismic.asHtml(post.data.title)" />
        <time :datetime="post.first_publication_date" class="blog-post-item-date my-2 d-block">{{formattedDate}}</time>
        <div>
          <p>{{createExcerpt}}</p>
          <a class="blog-post-item-link my-2 d-block" :title="$t('blog.read')">{{$t('blog.read')}}</a>
          <ul class="blog-post-tags" v-if="post.data.tags?.length > 0">
            <li v-for="tag in post.data.tags">{{tag.tag}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Media from '~/components/Media';
  export default {
    props: {
      post: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
    methods: {
      goTo() {
        const locale = this.$store.state.i18n.locale;
        const pathPrefix = locale === 'en' ? `/${locale}/blog/` : '/blogue/';
        this.$router.push(`${pathPrefix}${this.post.uid}`);
      }
    },
    computed: {
      createExcerpt() {
        let words = "";
        if (this.post && this.post.data && Array.isArray(this.post.data.content) && this.post.data.content[0] && this.post.data.content[0].text) {
          words = this.post.data.content[0].text.split(' ').slice(0, 20).join(' ');
        }
        return `${words}...`; // Add ellipsis to indicate an excerpt
      },
      formattedDate() {
        const dateObj = new Date(this.post.first_publication_date);
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
    }
  }
</script>
