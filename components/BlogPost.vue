<template>
  <div class="blog-post-item col-md-8 offset-md-2 col-12 mb-5" @click="goTo">
    <div class="row">
      <div class="blog-post-item-img col-lg-6 col-12">
        <Media :image="post.data.image" placeholder="horizontal" />
      </div>
      <div class="blog-post-item-body col-lg-6 col-12">
        <div v-html="$prismic.asHtml(post.data.title)" />
        <div class="blog-post-item-date my-2">{{new Date(post.first_publication_date).toLocaleString()}}</div>
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
          words = this.post.data.content[0].text.split(' ').slice(0, 50).join(' ');
        }
        return `${words}...`; // Add ellipsis to indicate an excerpt
      }
    },
    components: {
      Media
    }
  }
</script>
